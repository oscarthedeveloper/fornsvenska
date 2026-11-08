import test from 'node:test';
import assert from 'node:assert/strict';
import { ReleaseOrchestrator } from '../lib/publishing/releaseOrchestrator.ts';
import { PublishingPipeline } from '../lib/publishing/publishingPipeline.ts';

test('CF11: Pre-flight checks - verifierar gruppbudget, artiklar, maxstorlek och index', async () => {
  const orchestrator = new ReleaseOrchestrator();

  const preflight = await orchestrator.runPreflightChecks();
  assert.equal(preflight.ok, true, 'Pre-flight checks ska godkännas för komplett korpus');
  assert.equal(preflight.totalArticles, 41744);
  assert.equal(preflight.secretsCheckPassed, true);
  assert.equal(preflight.quotaCheckPassed, true);
  assert.equal(preflight.errors.length, 0);

  // Verifiera att samtliga 7 ordgrupper finns med och har acceptabelt filantal (< 16 000)
  const groups = ['ord-01', 'ord-02', 'ord-03', 'ord-04', 'ord-05', 'ord-06', 'ord-07'];
  for (const g of groups) {
    const info = preflight.groupsChecked[g];
    assert.ok(info, `Grupp ${g} måste ha kontrollerats`);
    assert.equal(info.ok, true);
    assert.ok(info.fileCount > 5000, `Grupp ${g} bör ha mer än 5 000 filer`);
    assert.ok(info.fileCount < 16000, `Grupp ${g} måste ligga under säkerhetsgränsen på 16 000 filer`);
    assert.ok(info.maxFileSize < 25 * 1024 * 1024, `Största filen i ${g} måste vara under 25 MB`);
  }
});

test('CF11: Fasindelad samordnad driftsättning - innehållsdelar (ord-01..07) först, huvudsajt sist', async () => {
  const orchestrator = new ReleaseOrchestrator();
  const initialRelease = orchestrator.getActiveReleaseId();

  const adminActor = {
    id: 'admin-ci',
    email: 'admin@fornsvenska.se',
    isAdmin: true,
  };

  const res = await orchestrator.executeRelease({
    actor: adminActor,
    idempotencyKey: 'release-test-staged-1',
  });

  assert.equal(res.ok, true);
  assert.equal(res.httpStatus, 200);
  assert.notEqual(res.releaseId, initialRelease);

  // Kritiskt: Verifiera exakt fasindelad deploy-ordning
  assert.equal(res.stagedProjects.length, 8);
  assert.equal(res.stagedProjects[0], 'ord-01');
  assert.equal(res.stagedProjects[1], 'ord-02');
  assert.equal(res.stagedProjects[2], 'ord-03');
  assert.equal(res.stagedProjects[3], 'ord-04');
  assert.equal(res.stagedProjects[4], 'ord-05');
  assert.equal(res.stagedProjects[5], 'ord-06');
  assert.equal(res.stagedProjects[6], 'ord-07');
  // Huvudsajten aktiveras alltid sist efter alla 7 artikelgrupper
  assert.equal(res.stagedProjects[7], 'huvudsajt');

  // Verifiera att aktiv release nu har uppdaterats atomärt
  assert.equal(orchestrator.getActiveReleaseId(), res.releaseId);
});

test('CF11: Felinjektion 1 - Misslyckad delgruppsdeploy (ord-04) avbryter bygget och lämnar aktiv release intakt', async () => {
  const orchestrator = new ReleaseOrchestrator();
  const stableReleaseBefore = orchestrator.getActiveReleaseId();

  const adminActor = {
    id: 'admin-ci',
    email: 'admin@fornsvenska.se',
    isAdmin: true,
  };

  // Injicera deployfel i ord-04
  const res = await orchestrator.executeRelease({
    actor: adminActor,
    idempotencyKey: 'release-fail-ord04',
    simulateFailureInGroup: 'ord-04',
    failureReason: 'Cloudflare Pages API timeout vid uppladdning av ord-04',
  });

  // Bygget ska avbrytas med HTTP 500
  assert.equal(res.ok, false);
  assert.equal(res.httpStatus, 500);
  assert.ok(res.error?.includes('ord-04'));

  // ATOMÄR ISOLERING: Huvudsajten får ALDRIG ha deployats eller inkluderats
  assert.equal(res.stagedProjects.includes('huvudsajt'), false, 'Huvudsajten får ALDRIG deployas om en artikelgrupp felar');
  assert.ok(res.stagedProjects.includes('ord-01'));
  assert.ok(res.stagedProjects.includes('ord-02'));
  assert.ok(res.stagedProjects.includes('ord-03'));
  assert.equal(res.stagedProjects.includes('ord-04'), false);

  // Kritiskt: Aktiv release får INTE ha ändrats
  assert.equal(
    orchestrator.getActiveReleaseId(),
    stableReleaseBefore,
    'Tidigare stabil release måste förbli 100 % orörd och aktiv vid delbyggsfel'
  );
});

test('CF11: Felinjektion 2 - Idempotens och dubbelklicksskydd', async () => {
  const pipeline = new PublishingPipeline('cf-rel-stable-base');
  const orchestrator = new ReleaseOrchestrator(pipeline);

  const adminActor = {
    id: 'admin-1',
    email: 'admin@fornsvenska.se',
    isAdmin: true,
  };

  const idempotencyKey = 'double-click-safe-key-123';

  // Anrop 1
  const req1 = orchestrator.executeRelease({
    actor: adminActor,
    idempotencyKey,
  });

  // Anrop 2 (dubbelklick med samma idempotencyKey)
  const req2 = orchestrator.executeRelease({
    actor: adminActor,
    idempotencyKey,
  });

  const [res1, res2] = await Promise.all([req1, req2]);

  assert.equal(res1.ok, true);
  // Anrop 2 återanvänder samma jobb och skapar inga parallella byggen
  assert.equal(res2.ok, true);
  assert.equal(res1.jobId, res2.jobId);
});

test('CF11: Blandversionsfönster - kompatibilitet för gamla öppna klienter med tidigare index', async () => {
  const orchestrator = new ReleaseOrchestrator();

  // Verifiera korsdomänsrouting för artiklar ur olika grupper
  const testCases = [
    { id: 'soederwall--af-aeta', expectedDomain: 'ord-01.fornsvenska.se' },
    { id: 'soederwall--fadhir', expectedDomain: 'ord-02.fornsvenska.se' },
    { id: 'soederwall--iarn', expectedDomain: 'ord-03.fornsvenska.se' },
    { id: 'soederwall--madr', expectedDomain: 'ord-04.fornsvenska.se' },
    { id: 'soederwall--rasker', expectedDomain: 'ord-05.fornsvenska.se' },
    { id: 'soederwall--sol', expectedDomain: 'ord-06.fornsvenska.se' },
    { id: 'soederwall--ting', expectedDomain: 'ord-07.fornsvenska.se' },
  ];

  for (const tc of testCases) {
    const comp = orchestrator.verifyCrossVersionCompatibility(tc.id);
    assert.equal(comp.ok, true);
    assert.equal(comp.targetDomain, tc.expectedDomain);
    assert.equal(comp.canonicalPath, `/ordbok/${tc.id}`);
  }
});

test('CF11: Atomär återställning (Rollback) - reversibel aktivering utan att radera redaktionella utkast', async () => {
  const orchestrator = new ReleaseOrchestrator();
  const initialStableRelease = orchestrator.getActiveReleaseId();

  const adminActor = { id: 'admin-ci', email: 'admin@fornsvenska.se', isAdmin: true };
  const regularUser = { id: 'user-2', email: 'lasare@extern.se', isAdmin: false };

  // 1. Kör ny release (v2)
  const rel2 = await orchestrator.executeRelease({
    actor: adminActor,
    idempotencyKey: 'release-for-rollback-test',
  });
  assert.equal(rel2.ok, true);
  assert.equal(orchestrator.getActiveReleaseId(), rel2.releaseId);

  // 2. Icke-administratör nekas rollback med 403
  const failRollback = await orchestrator.executeRollback({
    targetReleaseId: initialStableRelease,
    actor: regularUser,
    reason: 'Otillåten användare försöker återställa',
  });
  assert.equal(failRollback.ok, false);
  assert.equal(failRollback.httpStatus, 403);
  assert.equal(orchestrator.getActiveReleaseId(), rel2.releaseId);

  // 3. Rollback till okänd release nekas med 404
  const notFoundRollback = await orchestrator.executeRollback({
    targetReleaseId: 'cf-rel-finns-inte',
    actor: adminActor,
    reason: 'Felaktigt ID',
  });
  assert.equal(notFoundRollback.ok, false);
  assert.equal(notFoundRollback.httpStatus, 404);

  // 4. Framgångsrik administrativ rollback till tidigare stabil release
  const successRollback = await orchestrator.executeRollback({
    targetReleaseId: initialStableRelease,
    actor: adminActor,
    reason: 'Verifierad rollback efter felupptäckt',
  });

  assert.equal(successRollback.ok, true);
  assert.equal(successRollback.httpStatus, 200);
  assert.equal(successRollback.previousReleaseId, rel2.releaseId);
  assert.equal(successRollback.activeReleaseId, initialStableRelease);
  assert.equal(orchestrator.getActiveReleaseId(), initialStableRelease);
});

test('CF11: Kvotkontroll mot månatlig gratisbudget (max 28 byggen/månad)', async () => {
  const pipeline = new PublishingPipeline();
  pipeline.setMonthlyBuildCount(28); // Månadskvoten är nådd

  const orchestrator = new ReleaseOrchestrator(pipeline);
  const adminActor = { id: 'admin-ci', email: 'admin@fornsvenska.se', isAdmin: true };

  const res = await orchestrator.executeRelease({
    actor: adminActor,
    idempotencyKey: 'quota-exceeded-test',
  });

  assert.equal(res.ok, false);
  assert.equal(res.httpStatus, 429);
  assert.ok(res.error?.includes('förbrukad'));
});
