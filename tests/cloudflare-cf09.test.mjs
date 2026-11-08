import test from 'node:test';
import assert from 'node:assert/strict';
import { EditorialManager } from '../lib/editorial/editorialManager.ts';
import { PublishingPipeline } from '../lib/publishing/publishingPipeline.ts';

test('CF09: Samlad redaktionsmodell - verifiera samtliga 6 innehållsdomäner med isolering och publicering', async () => {
  const manager = new EditorialManager();
  const pipeline = new PublishingPipeline('cf-rel-20261026-v1');

  const adminActor = {
    id: 'user-admin-1',
    email: 'admin@fornsvenska.se',
    isAdmin: true,
    name: 'Redaktör Admin',
  };

  // --- 1. STARTSIDA ---
  const publicStartInnan = manager.getPublishedContent('startsida', 'start');
  assert.ok(publicStartInnan);
  assert.equal(publicStartInnan.rubrik, 'Fornsvenska');

  const saveStart = await manager.saveDraft({
    domain: 'startsida',
    id: 'start',
    title: 'Startsida · Uppdaterad ingress',
    content: {
      ogonrunor: 'ᚠᚢᚦᚬᚱᚴ',
      rubrik: 'Fornsvenska · Medeltidens texter',
      ingress: 'Reviderad och utökad källportal för fornsvenska handskrifter.',
    },
    actor: adminActor,
  });
  assert.equal(saveStart.ok, true);
  assert.equal(saveStart.draft?.draftRevision, 2);
  assert.equal(saveStart.draft?.dirty, true);

  // Kritiskt: Publik läsare ser fortfarande den tidigare publicerade versionen!
  const publicStartMellan = manager.getPublishedContent('startsida', 'start');
  assert.equal(publicStartMellan.rubrik, 'Fornsvenska', 'Opublicerat utkast får inte slå igenom publikt');

  // --- 2. TRÄD OCH MAPPAR ---
  const saveTrad = await manager.saveDraft({
    domain: 'trad_och_block',
    id: 'nod-lagar',
    slug: 'lagar',
    title: 'Landskapslagar och rättstexter (uppdaterad)',
    content: {
      kind: 'folder',
      root: 'texter',
      position: 0,
      childrenCount: 4,
    },
    actor: adminActor,
  });
  assert.equal(saveTrad.ok, true);
  assert.equal(saveTrad.draft?.dirty, true);

  // --- 3. DOKUMENTBLOCK & TEXTER ---
  const saveText = await manager.saveDraft({
    domain: 'texter',
    id: 'text-vg-intro',
    slug: 'aldre-vastgotalagen-inledning',
    title: 'Äldre Västgötalagen · Inledning',
    content: {
      docId: 'vg-aldre',
      title: 'Äldre Västgötalagen',
      segments: [
        { id: 'vg-s1', fornsvenska: 'Sveær egho konung at taka ok sva vrækæ', nusvenska: 'Svearna äga konung att taga och så vräka' },
      ],
    },
    actor: adminActor,
  });
  assert.equal(saveText.ok, true);
  assert.equal(saveText.draft?.dirty, true);

  // --- 4. HYLLOR & RESURSER ---
  const saveResurs = await manager.saveDraft({
    domain: 'resurser',
    id: 'hylla-ordbocker',
    title: 'Medeltida handskriftsutgåvor och ordböcker',
    content: {
      titel: 'Medeltida handskriftsutgåvor och ordböcker (reviderad)',
      note: 'Komplett samling av digitaliserade lexikon och källor',
      position: 1,
    },
    actor: adminActor,
  });
  assert.equal(saveResurs.ok, true);
  assert.equal(saveResurs.draft?.dirty, true);

  // --- 5. ORDBOKSRÄTTELSER & MODERNA DEFINITIONER ---
  const saveOrdbok = await manager.saveDraft({
    domain: 'ordbok',
    id: 'soederwall--af-aeta',
    title: 'soederwall: af-æta',
    content: {
      headword: 'af-æta',
      headwordDisplayOverride: 'af æta (förtära)',
      reviewStatus: 'granskad_med_kallstod',
      note: 'Normaliserad stavning med särskrivning belagd i handskrift Cod. B 543',
      kallstod: 'Söderwall Huvudverk band 1 s. 4',
    },
    sourceCitation: 'Söderwall Huvudverk band 1 s. 4; Cod. B 543',
    editorialNotes: 'Normaliserad stavning med särskrivning belagd i handskrift Cod. B 543',
    actor: adminActor,
  });
  assert.equal(saveOrdbok.ok, true);
  assert.equal(saveOrdbok.draft?.dirty, true);

  // --- 6. RUNOR & GRANSKNINGSFLÖDE ---
  const saveRunor = await manager.saveDraft({
    domain: 'runor',
    id: 'u-112b',
    slug: 'u-112b',
    title: 'U 112B · Kyrkstigen i Ed',
    content: {
      signum: 'U 112B',
      slug: 'u-112b',
      transcription: 'ragnvaldr let rista runar...',
      dating: 'ca 1050–1100',
      editorialNotes: 'Wesséns tolkning i SRI Band 6 med förtydligande om väringagardet',
    },
    status: 'godkand_for_publicering',
    sourceCitation: 'Sveriges runinskrifter Band 6, s. 158',
    editorialNotes: 'Wesséns tolkning i SRI Band 6 med förtydligande om väringagardet',
    assignedReviewer: 'Docent i runologi',
    actor: adminActor,
  });
  assert.equal(saveRunor.ok, true);
  assert.equal(saveRunor.draft?.dirty, true);
  assert.equal(saveRunor.draft?.status, 'godkand_for_publicering');

  // Verifiera att översikten visar 6 opublicerade ändringar
  const overviewBefore = manager.getOverview(pipeline.getActiveState());
  assert.equal(overviewBefore.totalUnpublishedCount, 6);

  // Verifiera att alla 6 domäner fortfarande serverar den gamla versionen publikt
  const snapInnan = manager.exportPublicSnapshot();
  const publicStartSnap = snapInnan.startsida.find((s) => s.id === 'start');
  assert.equal(publicStartSnap?.content.rubrik, 'Fornsvenska');

  // --- PUBLICERING ---
  const pubRes = await pipeline.requestPublish({
    userId: adminActor.id,
    isAdmin: adminActor.isAdmin,
    idempotencyKey: 'test-publish-release-v2',
  });
  assert.equal(pubRes.ok, true);
  assert.equal(pubRes.status, 'succeeded');

  // Aktivera publiceringen i redaktionslagret
  const activation = await manager.publishApprovedDrafts(pubRes.activeReleaseId, adminActor);
  assert.equal(activation.ok, true);
  assert.equal(activation.publishedIds.length, 6);

  // EFTER PUBLICERING: Verifiera att publika läsare nu ser samtliga nya revisioner
  const publicStartEfter = manager.getPublishedContent('startsida', 'start');
  assert.equal(publicStartEfter.rubrik, 'Fornsvenska · Medeltidens texter');

  const publicTextEfter = manager.getPublishedContent('texter', 'text-vg-intro');
  assert.ok(publicTextEfter.segments[0].fornsvenska.includes('vrækæ'));

  const publicRunorEfter = manager.getPublishedContent('runor', 'u-112b');
  assert.ok(publicRunorEfter.editorialNotes.includes('väringagardet'));

  // Verifiera att antalet opublicerade utkast nu är 0
  const overviewAfter = manager.getOverview(pipeline.getActiveState());
  assert.equal(overviewAfter.totalUnpublishedCount, 0);
});

test('CF09: Behörighetskontroll - 401 för oautentiserad och 403 för icke-administratör', async () => {
  const manager = new EditorialManager();

  // 1. Oautentiserad användare (null actor) nekas med 401
  const saveUnauth = await manager.saveDraft({
    domain: 'startsida',
    id: 'start',
    title: 'Test',
    content: {},
    actor: null,
  });
  assert.equal(saveUnauth.ok, false);
  assert.equal(saveUnauth.httpStatus, 401);

  // 2. Icke-administratör nekas med 403
  const regularUser = { id: 'u-user-2', email: 'lasare@extern.se', isAdmin: false };
  const saveNonAdmin = await manager.saveDraft({
    domain: 'startsida',
    id: 'start',
    title: 'Test',
    content: {},
    actor: regularUser,
  });
  assert.equal(saveNonAdmin.ok, false);
  assert.equal(saveNonAdmin.httpStatus, 403);

  // 3. Återställning (rollback) nekas för icke-administratör
  const rollbackNonAdmin = await manager.rollbackToRevision({
    domain: 'startsida',
    id: 'start',
    targetRevision: 1,
    actor: regularUser,
    reason: 'Otillåten återställning',
  });
  assert.equal(rollbackNonAdmin.ok, false);
  assert.equal(rollbackNonAdmin.httpStatus, 403);
});

test('CF09: Samtidighetskontroll (Optimistisk låsning) - upptäcker konflikt och förhindrar tyst överskrivning', async () => {
  const manager = new EditorialManager();

  const editorA = { id: 'admin-a', email: 'anna@fornsvenska.se', isAdmin: true };
  const editorB = { id: 'admin-b', email: 'bertil@fornsvenska.se', isAdmin: true };

  // Båda hämtar posten när den är på revision 1
  const draftInitial = manager.getDraft('startsida', 'start', editorA);
  assert.equal(draftInitial.draft?.draftRevision, 1);

  // Redaktör A sparar revision 2
  const saveA = await manager.saveDraft({
    domain: 'startsida',
    id: 'start',
    title: 'Startsida redigerad av Anna',
    content: { rubrik: 'Fornsvenska · Annas version' },
    expectedRevision: 1, // Anna utgick från rev 1
    actor: editorA,
  });
  assert.equal(saveA.ok, true);
  assert.equal(saveA.draft?.draftRevision, 2);

  // Redaktör B försöker nu spara med expectedRevision = 1 (vet inte att Anna redan sparat rev 2)
  const saveB = await manager.saveDraft({
    domain: 'startsida',
    id: 'start',
    title: 'Startsida redigerad av Bertil',
    content: { rubrik: 'Fornsvenska · Bertils version' },
    expectedRevision: 1, // Bertils gamla basrevision!
    actor: editorB,
  });

  // Kritiskt: Samtidighetskonflikt detekteras med HTTP 409!
  assert.equal(saveB.ok, false);
  assert.equal(saveB.conflict, true);
  assert.equal(saveB.httpStatus, 409);
  assert.ok(saveB.error?.includes('Konflikt vid sparning'));
  assert.equal(saveB.conflictDetails?.currentRevision, 2);
  assert.equal(saveB.conflictDetails?.currentSavedBy, 'anna@fornsvenska.se');

  // Kontrollera att Annas sparning förblev intakt i databasen
  const currentDraft = manager.getDraft('startsida', 'start', editorA);
  assert.equal(currentDraft.draft?.draftRevision, 2);
  assert.equal(currentDraft.draft?.content?.rubrik, 'Fornsvenska · Annas version');

  // Kontrollera att konflikten registrerades i revisionsloggen
  const audit = manager.getAuditLog({ domain: 'startsida', entityId: 'start' }, editorA);
  const conflictEntry = audit.log.find((l) => l.action === 'conflict_detected');
  assert.ok(conflictEntry, 'Samtidighetskonflikt ska loggas i audit log');
});

test('CF09: Reversibilitet och fullständig revisionshistorik med återställning', async () => {
  const manager = new EditorialManager();
  const adminActor = { id: 'admin-1', email: 'admin@fornsvenska.se', isAdmin: true };

  // Steg 1: Skapa revision 2
  await manager.saveDraft({
    domain: 'texter',
    id: 'text-vg-intro',
    title: 'Revision 2 av text',
    content: { text: 'Ändring i revision 2' },
    editorialNotes: 'Första ändringen',
    actor: adminActor,
  });

  // Steg 2: Skapa revision 3
  await manager.saveDraft({
    domain: 'texter',
    id: 'text-vg-intro',
    title: 'Revision 3 av text med misstag',
    content: { text: 'Felaktig text som måste återställas' },
    editorialNotes: 'Misstagsändring',
    actor: adminActor,
  });

  const draftInnanRollback = manager.getDraft('texter', 'text-vg-intro', adminActor);
  assert.equal(draftInnanRollback.draft?.draftRevision, 3);
  assert.equal(draftInnanRollback.draft?.content?.text, 'Felaktig text som måste återställas');

  // Steg 3: Återställ till revision 2
  const rollbackRes = await manager.rollbackToRevision({
    domain: 'texter',
    id: 'text-vg-intro',
    targetRevision: 2,
    actor: adminActor,
    reason: 'Rättade oavsiktlig textändring i revision 3',
  });

  assert.equal(rollbackRes.ok, true);
  assert.equal(rollbackRes.draft?.draftRevision, 4); // Ny revision skapas som bevarar återställningen
  assert.equal(rollbackRes.draft?.content?.text, 'Ändring i revision 2');

  // Kontrollera att historiken innehåller alla revisioner (1, 2, 3 och 4)
  assert.equal(rollbackRes.draft?.history?.length, 4);

  // Kontrollera att rollback-åtgärden registrerades i revisionsloggen
  const audit = manager.getAuditLog({ domain: 'texter', entityId: 'text-vg-intro' }, adminActor);
  const rollbackLog = audit.log.find((l) => l.action === 'rollback');
  assert.ok(rollbackLog);
  assert.ok(rollbackLog?.summary.includes('Återställde'));
});

test('CF09: Källkrav och granskningsregler - ordbok och runor avvisar ofullständiga ändringar', async () => {
  const manager = new EditorialManager();
  const adminActor = { id: 'admin-1', email: 'admin@fornsvenska.se', isAdmin: true };

  // 1. Ordboksrättelse utan källstöd avvisas med 400
  const ordbokUtanKalla = await manager.saveDraft({
    domain: 'ordbok',
    id: 'soederwall--af-aeta',
    title: 'soederwall: af-æta',
    content: {
      headword: 'af-æta',
      note: 'Normaliserad stavning',
    },
    sourceCitation: '', // Tomt källstöd!
    editorialNotes: 'Normaliserad stavning',
    actor: adminActor,
  });
  assert.equal(ordbokUtanKalla.ok, false);
  assert.equal(ordbokUtanKalla.httpStatus, 400);
  assert.ok(ordbokUtanKalla.error?.includes('Källstöd'));

  // 2. Runinskrift: Ogiltig statusövergång avvisas (godkand_for_publicering -> avvisad direkt är inte tillåten)
  const ogiltigStatus = await manager.saveDraft({
    domain: 'runor',
    id: 'u-112b',
    title: 'U 112B',
    content: {},
    status: 'avvisad', // u-112b startar som 'godkand_for_publicering', kan inte hoppa direkt till 'avvisad'
    actor: adminActor,
  });
  assert.equal(ogiltigStatus.ok, false);
  assert.equal(ogiltigStatus.httpStatus, 400);
  assert.ok(ogiltigStatus.error?.includes('Ogiltig statusövergång'));

  // 3. Runinskrift: Godkännande för publicering kräver registrerad granskare
  // Först sätt till under_granskning (giltig övergång)
  const tillGranskning = await manager.saveDraft({
    domain: 'runor',
    id: 'u-112b',
    title: 'U 112B',
    content: { transcription: 'runtext...' },
    status: 'under_granskning',
    actor: adminActor,
  });
  assert.equal(tillGranskning.ok, true);

  // Försök godkänna utan tilldelad granskare
  const godkannUtanGranskare = await manager.saveDraft({
    domain: 'runor',
    id: 'u-112b',
    title: 'U 112B',
    content: { curationNotes: 'Klar för publicering' },
    status: 'godkand_for_publicering',
    assignedReviewer: '', // Saknas!
    sourceCitation: 'SRI Band 6',
    editorialNotes: 'Motivering finns',
    actor: adminActor,
  });
  assert.equal(godkannUtanGranskare.ok, false);
  assert.equal(godkannUtanGranskare.httpStatus, 400);
  assert.ok(godkannUtanGranskare.error?.includes('specifik granskare'));
});

test('CF09: Vattentät publik snapshot-isolering - 0 opublicerade utkast läcker till offentlig snapshot', async () => {
  const manager = new EditorialManager();
  const adminActor = { id: 'admin-1', email: 'admin@fornsvenska.se', isAdmin: true };

  // Skapa opublicerade utkast i alla 6 domäner
  await manager.saveDraft({ domain: 'startsida', id: 'start', title: 'Startsida utkast', content: { draftOnly: true }, actor: adminActor });
  await manager.saveDraft({ domain: 'trad_och_block', id: 'nod-lagar', title: 'Träd utkast', content: { draftOnly: true }, actor: adminActor });
  await manager.saveDraft({ domain: 'texter', id: 'text-vg-intro', title: 'Text utkast', content: { draftOnly: true }, actor: adminActor });
  await manager.saveDraft({ domain: 'resurser', id: 'hylla-ordbocker', title: 'Resurs utkast', content: { draftOnly: true }, actor: adminActor });
  await manager.saveDraft({ domain: 'ordbok', id: 'soederwall--af-aeta', title: 'Ordbok utkast', content: { draftOnly: true, note: 'Utkast', kallstod: 'Söderwall' }, sourceCitation: 'Söderwall', editorialNotes: 'Utkast', actor: adminActor });
  await manager.saveDraft({ domain: 'runor', id: 'u-112b', title: 'Runor utkast', content: { draftOnly: true }, status: 'under_granskning', actor: adminActor });

  // Exportera offentlig snapshot
  const snapshot = manager.exportPublicSnapshot();

  // Verifiera att ingen av domänerna innehåller "draftOnly: true" i sin publika snapshot
  for (const [doman, poster] of Object.entries(snapshot)) {
    for (const post of poster) {
      assert.notEqual(
        post.content?.draftOnly,
        true,
        `Domän ${doman} får ALDRIG innehålla opublicerade utkast i offentlig snapshot!`
      );
    }
  }
});
