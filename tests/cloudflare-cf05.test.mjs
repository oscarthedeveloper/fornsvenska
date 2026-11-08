import test from 'node:test';
import assert from 'node:assert/strict';
import { PublishingPipeline } from '../lib/publishing/publishingPipeline.ts';
import { EditorialStore } from '../lib/ordbok/editorialStore.ts';

test('CF05: Vertical test - Save editorial draft, verify public isolation, publish and activate', async () => {
  const editorialStore = new EditorialStore();
  const pipeline = new PublishingPipeline('cf-rel-20261026-v1');

  const adminActor = {
    id: 'user-admin-1',
    email: 'admin@fornsvenska.se',
    isAdmin: true,
  };

  const initialPublicRelease = pipeline.getActiveState().activeReleaseId;
  assert.equal(initialPublicRelease, 'cf-rel-20261026-v1');

  // 1. Innan redigering: Ingen publicerad rättelse finns
  assert.equal(editorialStore.hamtaPubliceradVersion('soederwall--af-aeta'), null);

  // 2. Administratör sparar en redaktionell rättelse och modern definition
  const saveRes1 = await editorialStore.sparaRattelse(
    {
      id: 'soederwall--af-aeta',
      headwordDisplayOverride: 'af äta',
      reviewStatus: 'granskad_med_kallstod',
      note: 'Normaliserad stavning med särskrivning belagd i handskrift',
      kallstod: 'Söderwall Huvudverk band 1 s. 4; Cod. B 543',
    },
    adminActor
  );
  assert.equal(saveRes1.ok, true);

  const saveRes2 = await editorialStore.sparaModernDefinition(
    {
      id: 'soederwall--af-aeta',
      kortForklaring: 'äta upp, förtära',
      modernGlos: ['förtära', 'konsumera'],
    },
    adminActor
  );
  assert.equal(saveRes2.ok, true);

  // 3. Verifiera persistent utkast: Administratören ser utkastet med flaggan opublicerad
  const draft = editorialStore.hamtaUtkast('soederwall--af-aeta', adminActor);
  assert.ok(draft);
  assert.equal(draft.rattelse?.headwordDisplayOverride, 'af äta');
  assert.equal(draft.modernDefinition?.kortForklaring, 'äta upp, förtära');
  assert.equal(draft.harOpubliceradeAndringar, true);

  // 4. KRITISK ISOLERING: Publik läsare ser fortfarande INGET av utkastet innan publicering
  const publicBeforePublish = editorialStore.hamtaPubliceradVersion('soederwall--af-aeta');
  assert.equal(publicBeforePublish, null, 'Opublicerat utkast får ALDRIG synas för publika läsare');
  assert.equal(pipeline.getActiveState().activeReleaseId, initialPublicRelease);

  // 5. Administratör initierar publicering
  const publishResult = await pipeline.requestPublish({
    userId: adminActor.id,
    isAdmin: adminActor.isAdmin,
    idempotencyKey: 'publish-release-v2',
  });

  assert.equal(publishResult.ok, true);
  assert.equal(publishResult.status, 'succeeded');
  assert.notEqual(publishResult.activeReleaseId, initialPublicRelease);

  // 6. Efter framgångsrik publicering: Aktivera revisionen i redaktionslagret
  editorialStore.aktiveraPublicering(publishResult.activeReleaseId);

  // Nu ser publika besökare den nya revisionen
  const publicAfterPublish = editorialStore.hamtaPubliceradVersion('soederwall--af-aeta');
  assert.ok(publicAfterPublish);
  assert.equal(publicAfterPublish.rattelse?.headwordDisplayOverride, 'af äta');
  assert.equal(publicAfterPublish.modernDefinition?.kortForklaring, 'äta upp, förtära');

  // Kontrollera att utkastet inte längre har opublicerade ändringar
  const draftAfter = editorialStore.hamtaUtkast('soederwall--af-aeta', adminActor);
  assert.equal(draftAfter.harOpubliceradeAndringar, false);
  assert.equal(draftAfter.publiceradRevision, publishResult.activeReleaseId);
});

test('CF05: Access control - 401 for unauthenticated, 403 for non-admin, 403 for revoked admin', async () => {
  const editorialStore = new EditorialStore();
  const pipeline = new PublishingPipeline();

  // 1. Oautentiserad användare (null user) nekas med 401
  const resUnauth = await pipeline.requestPublish({
    userId: null,
    isAdmin: false,
  });
  assert.equal(resUnauth.ok, false);
  assert.equal(resUnauth.httpStatus, 401);
  assert.ok(resUnauth.error.includes('Oautentiserad'));

  // 2. Inloggad användare som saknar adminroll nekas med 403
  const regularUser = { id: 'user-regular', email: 'lasare@extern.se', isAdmin: false };
  const resNonAdmin = await pipeline.requestPublish({
    userId: regularUser.id,
    isAdmin: regularUser.isAdmin,
  });
  assert.equal(resNonAdmin.ok, false);
  assert.equal(resNonAdmin.httpStatus, 403);
  assert.ok(resNonAdmin.error.includes('Åtkomst nekad'));

  // Samma sak vid försök att spara i editorial store
  const storeRes = await editorialStore.sparaRattelse(
    {
      id: 'soederwall--af-aeta',
      reviewStatus: 'granskad_med_kallstod',
      note: 'Obehörig ändring',
      kallstod: 'Ingen källa',
    },
    regularUser
  );
  assert.equal(storeRes.ok, false);
  assert.ok(storeRes.fel.includes('Behörighet saknas'));

  // 3. Återkallad adminroll (tidigare admin vars behörighet dragits in)
  const revokedAdmin = { id: 'user-revoked', email: 'ex-admin@fornsvenska.se', isAdmin: false };
  const resRevoked = await pipeline.requestPublish({
    userId: revokedAdmin.id,
    isAdmin: revokedAdmin.isAdmin,
  });
  assert.equal(resRevoked.ok, false);
  assert.equal(resRevoked.httpStatus, 403);
});

test('CF05: Idempotency - Concurrent requests reuse existing job without duplicate builds', async () => {
  const pipeline = new PublishingPipeline();
  const adminActor = { id: 'admin-1', isAdmin: true };

  // Simulera dubbelklick med samma idempotencyKey
  const p1 = pipeline.requestPublish({
    userId: adminActor.id,
    isAdmin: adminActor.isAdmin,
    idempotencyKey: 'same-click-key',
  });

  const p2 = pipeline.requestPublish({
    userId: adminActor.id,
    isAdmin: adminActor.isAdmin,
    idempotencyKey: 'same-click-key',
  });

  const [res1, res2] = await Promise.all([p1, p2]);

  assert.equal(res1.ok, true);
  assert.equal(res2.ok, true);
  // Båda anropen ska referera till samma jobId
  assert.equal(res1.jobId, res2.jobId);
});

test('CF05: Atomic failure isolation - Intentional build error leaves active release 100% intact', async () => {
  const initialRelease = 'cf-rel-stable-20261025';
  const pipeline = new PublishingPipeline(initialRelease);
  const editorialStore = new EditorialStore();

  const adminActor = { id: 'admin-1', email: 'admin@fornsvenska.se', isAdmin: true };

  // Spara ett utkast
  await editorialStore.sparaRattelse(
    {
      id: 'soederwall--bonde-nn.1',
      reviewStatus: 'granskad_med_kallstod',
      note: 'Testanteckning',
      kallstod: 'Äldre Västgötalagen',
    },
    adminActor
  );

  // Simulera publicering med ett avsiktligt byggfel i ord-04
  const failPublishRes = await pipeline.requestPublish({
    userId: adminActor.id,
    isAdmin: true,
    simulateFailure: true,
    failureReason: 'Syntaktiskt fel i mall vid rendering av ord-04',
  });

  assert.equal(failPublishRes.ok, false);
  assert.equal(failPublishRes.status, 'failed');
  assert.equal(failPublishRes.httpStatus, 500);
  assert.ok(failPublishRes.error.includes('Syntaktiskt fel'));

  // ATOMÄR KONTROLL: Aktiv release är fortfarande den stabila initiala versionen!
  const currentState = pipeline.getActiveState();
  assert.equal(currentState.activeReleaseId, initialRelease);

  // Verifiera att jobbet i historiken är markerat som failed med detaljer
  const failedJob = pipeline.getJob(failPublishRes.jobId);
  assert.ok(failedJob);
  assert.equal(failedJob.status, 'failed');
  assert.equal(failedJob.projects['ord-04'].status, 'failed');
  assert.equal(failedJob.projects['huvudsajt'].status, 'pending'); // Huvudsajt aktiverades aldrig!

  // Redaktionslagret aktiverades inte
  assert.equal(editorialStore.hamtaPubliceradVersion('soederwall--bonde-nn.1'), null);
});

test('CF05: Quota enforcement blocks builds when monthly quota is exhausted', async () => {
  const pipeline = new PublishingPipeline();
  const adminActor = { id: 'admin-1', isAdmin: true };

  // Sätt månadskvoten till 28 för att testa spärren
  pipeline.setMonthlyBuildCount(28);

  const res = await pipeline.requestPublish({
    userId: adminActor.id,
    isAdmin: true,
  });

  assert.equal(res.ok, false);
  assert.equal(res.httpStatus, 429);
  assert.ok(res.error.includes('Månadens publiceringskvot är förbrukad'));
});
