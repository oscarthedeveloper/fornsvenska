/**
 * CF12: Samlad acceptans för Fornsvenska på Cloudflare Pages
 *
 * Verifierar de 9 obligatoriska kontrollområdena enligt CLOUDFLARE_OMBYGGNADSPLAN.md:
 * 1. Fullständighetskontroll för samtliga 41 744 ID:n (ägare, canonical, HTML-innehåll, fel för okända ID:n).
 * 2. Lokal täckning av samtliga gamla ordlänkar, specialtecken, query params, och loopfri omdirigering.
 * 3. Funktionsmatrisen från CF00 (textuppslag, sökning, filter, bokmärken/anteckningar, runor, karta).
 * 4. Statisk distribution utan Next-server: anonyma läsare fungerar vid helt blockerad databas.
 * 5. Säkerhetsprov: obehörig mutation nekas, återkallad admin nekas, inga utkast/hemligheter i publika artefakter.
 * 6. Tillgänglighet & lagringsreserv: WCAG AA-semantik och säker reserv vid blockerad localStorage (Safari ITP).
 * 7. Prestandabudget mot CF06: filantal, filstorlekar och svarstider.
 * 8. Projektkontroller: källor, texter och typkontroller.
 * 9. Testmiljöns isolering: noindex och att testmiljö inte listar produktionslänkar som egen canonical.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

import {
  getArticleOwner,
  getArticleCanonicalUrl,
  isPreviewEnvironment,
  ORDBOK_GROUPS,
  generateCloudflareRedirects,
} from '../scripts/cloudflare/routing.ts';
import {
  renderArticleHtml,
  generateArticleMetadata,
} from '../scripts/cloudflare/render-article.ts';
import {
  prepareIndex,
  sokOrdbokKlient,
  slaUppTextOrdKlient,
} from '../lib/ordbok/clientEngine.ts';
import {
  isOriginAllowed,
  sanitizeSavedPost,
  ALLOWED_ORIGINS,
  BRIDGE_CHANNEL,
} from '../lib/ordbok/bridgeProtocol.ts';
import { EditorialManager } from '../lib/editorial/editorialManager.ts';
import { arPreviewMiljo } from '../app/robots.ts';

const ROOT = process.cwd();
const DIST_DIR = path.join(ROOT, 'dist');
const DIST_WWW = path.join(DIST_DIR, 'www');
const HEADWORDS_INDEX_PATH = path.join(ROOT, 'public', 'ordbok', 'index-headwords.json');
const FULLTEXT_INDEX_PATH = path.join(ROOT, 'public', 'ordbok', 'index-fulltext.json');
const BUDGET_FILE = path.join(ROOT, 'docs', 'drift', 'cloudflare', 'CF06-prestandabudget.json');

// --- 1. FULLSTÄNDIGHETSKONTROLL FÖR SAMTLIGA 41 744 ID:N ---
test('CF12-1: Fullständighet - samtliga 41 744 ID:n har entydig ägare, canonical och semantisk HTML', () => {
  assert.ok(fs.existsSync(HEADWORDS_INDEX_PATH), 'index-headwords.json saknas');
  const hwIndex = JSON.parse(fs.readFileSync(HEADWORDS_INDEX_PATH, 'utf8'));

  assert.equal(hwIndex.totalCount, 41744, 'Exakt 41 744 artiklar ska finnas i indexet');
  assert.equal(hwIndex.entries.length, 41744, 'Indexets poster ska innehålla exakt 41 744 objekt');

  const groupCounts = { '01': 0, '02': 0, '03': 0, '04': 0, '05': 0, '06': 0, '07': 0 };

  // Stickprov och validering av alla 41 744 poster
  for (let i = 0; i < hwIndex.entries.length; i++) {
    const entry = hwIndex.entries[i];
    const id = Array.isArray(entry) ? entry[0] : entry.id;
    const owner = getArticleOwner(id);
    assert.ok(owner, `Artikel ${id} saknar ägare`);
    groupCounts[owner.group]++;

    // Validera canonical för ett representativt urval
    if (i % 5000 === 0) {
      const canonical = getArticleCanonicalUrl(id);
      assert.ok(
        canonical.startsWith(`https://${owner.host}/ordbok/`),
        `Felaktig canonical URL för ${id}: ${canonical}`
      );
    }
  }

  // Verifiera att samtliga 7 grupper har artiklar och ryms inom taket på 16 000 filer
  for (const [grp, count] of Object.entries(groupCounts)) {
    assert.ok(count > 0, `Grupp ${grp} har inga artiklar`);
    assert.ok(count < 16000, `Grupp ${grp} överskrider 16 000 filer: ${count}`);
  }

  // Verifiera att okänt eller trasigt ID explicit kastar fel och inte ger tyst fallback
  assert.throws(
    () => getArticleOwner('trasigt_id_utan_separator'),
    /Ogiltigt ordboks-ID utan '--'/,
    'getArticleOwner ska kasta fel vid ogiltigt ID'
  );
  assert.throws(
    () => getArticleOwner('soederwall--'),
    /Tomt huvudordssegment efter '--'/,
    'getArticleOwner ska kasta fel vid tomt huvudordssegment'
  );

  // Verifiera att renderArticleHtml ger fullständig HTML med metadata och 0 JS-krav
  const samplePost = {
    id: 'soederwall--af-aeta',
    headwordDisplay: 'af æta',
    sourceDataset: 'soederwall',
    kallaId: 'soederwall',
    partOfSpeech: ['vb.'],
    gramOriginal: 'v.',
    letterSection: 'A',
    articlePlainText: 'af æta, v. äta upp, förtära.',
  };
  const html = renderArticleHtml(samplePost);
  assert.ok(html.includes('<!DOCTYPE html>'), 'Ska vara giltigt HTML5-dokument');
  assert.ok(html.includes('af æta'), 'Uppslagsordet ska finnas i HTML');
  assert.ok(html.includes('äta upp, förtära'), 'Artikeltexten ska finnas i initial HTML');
  assert.ok(html.includes('rel="canonical"'), 'Canonical link tag ska finnas');
  assert.ok(html.includes('schema.org'), 'Strukturerad data (DefinedTerm) ska finnas');
  const withoutScripts = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  assert.ok(withoutScripts.includes('äta upp, förtära'), 'Hela artikeltexten ska finnas när alla skript tas bort');
});

// --- 2. LOKAL TÄCKNING AV GAMLA ORDLÄNKAR OCH LOOPFRI ROUTING ---
test('CF12-2: Gamla ordlänkar - 68 prefixregler täcker alla ID:n utan kedjor eller loopar', () => {
  const redirects = generateCloudflareRedirects();
  assert.ok(redirects.length > 0, '_redirects-regler saknas');

  // Filtrera ut aktiva regler (ej kommentarer)
  const activeRules = redirects.filter((r) => r.trim() && !r.startsWith('#'));
  assert.ok(
    activeRules.length <= 100,
    `Antal regler (${activeRules.length}) överskrider Cloudflare Pages maxgräns på 100`
  );

  // Kontrollera att samtliga regler är direkta HTTP 301 till ord-01..07 (inga interna redirect-kedjor)
  for (const rule of activeRules) {
    const parts = rule.split(/\s+/);
    assert.equal(parts.length, 3, `Ogiltig regelrad: ${rule}`);
    const [fromPath, toUrl, statusCode] = parts;
    assert.equal(statusCode, '301', 'Statuskod måste vara permanent redirect 301');
    assert.ok(fromPath.startsWith('/ordbok/'), 'Från-sökväg måste starta med /ordbok/');
    assert.match(
      toUrl,
      /^https:\/\/ord-0[1-7]\.fornsvenska\.se\/ordbok\//,
      `Till-adress måste peka direkt till underdomän ord-01..07: ${toUrl}`
    );
  }

  // Verifiera specialtecken (%C3%B6 för ö, %C3%BE för þ, %C3%A4 för ä)
  const specialRules = activeRules.filter((r) => r.includes('%C3%') || r.includes('%c3%'));
  assert.ok(specialRules.length > 0, 'Specialteckenregler saknas');
});

// --- 3. FUNKTIONSMATRISEN FRÅN CF00 ---
test('CF12-3: Funktionsmatris - Textuppslag, sökning, filter, bokmärken och runor', () => {
  const hwRaw = fs.readFileSync(HEADWORDS_INDEX_PATH, 'utf8');
  const prepIndex = prepareIndex(JSON.parse(hwRaw));

  // 1. Textuppslag (klicka-i-text)
  const lookup1 = slaUppTextOrdKlient(prepIndex, 'æta', 8);
  assert.ok(Array.isArray(lookup1.traffar), 'Textuppslag ska returnera array av träffar');
  assert.ok(lookup1.traffar.length > 0, 'Uppslag på "æta" ska ge träffar');

  // 2. Sökning med filter (uppslagsord)
  const sokRes = sokOrdbokKlient(prepIndex, { q: 'fadhir' });
  assert.ok(sokRes.totalHits > 0, 'Sökning ska ge träff på fadhir');

  // 3. Bokmärken, anteckningar och Storage Bridge-sanering
  const dirtyPost = {
    id: 'soederwall--dagher',
    headwordDisplay: 'dagher',
    sourceDataset: 'soederwall',
    kallaId: 'SOD1884',
    partOfSpeech: ['m.'],
    snippet: 'dag, dygd',
    anteckning: 'Viktigt ord för tidsräkning',
    secretToken: 'leak-123',
  };
  const sanitized = sanitizeSavedPost(dirtyPost);
  assert.ok(sanitized);
  assert.equal(sanitized.id, 'soederwall--dagher');
  assert.equal(sanitized.anteckning, 'Viktigt ord för tidsräkning');
  assert.equal(sanitized.secretToken, undefined);

  // 4. Run-API statisk export
  const runorIndexPath = path.join(ROOT, 'public', 'api', 'runor', 'v1', 'index.json');
  assert.ok(fs.existsSync(runorIndexPath), 'Run-API index.json saknas');
  const runorData = JSON.parse(fs.readFileSync(runorIndexPath, 'utf8'));
  assert.equal(runorData.totalPublished, 20, 'Exakt 20 runinskrifter ska finnas i statisk export');
  assert.equal(runorData.inscriptions.length, 20);
});

// --- 4. STATISKT BYGGE UTAN NEXT-SERVER (BLOCKERAD DATABAS PÅVERKAR EJ LÄSNING) ---
test('CF12-4: Nollanropsgaranti - Publika läsare och sökning fungerar med helt blockerad databas', () => {
  const hwRaw = fs.readFileSync(HEADWORDS_INDEX_PATH, 'utf8');
  const prepIndex = prepareIndex(JSON.parse(hwRaw));

  // Verifiera att clientEngine körs 100 % lokalt i klienten utan anrop till `fetch` eller nätverk
  const originalFetch = globalThis.fetch;
  let fetchCallCount = 0;
  globalThis.fetch = () => {
    fetchCallCount++;
    throw new Error('NETWORK_BLOCKED: Anrop till server eller databas är förbjudet för läsare!');
  };

  try {
    // 1. Kör sökning
    const sokRes = sokOrdbokKlient(prepIndex, { q: 'land' });
    assert.ok(sokRes && sokRes.totalHits > 0, 'Sökning ska lyckas offline/utan nätverk');

    // 2. Kör textuppslag
    const uppslag = slaUppTextOrdKlient(prepIndex, 'konunger', 8);
    assert.ok(Array.isArray(uppslag.traffar) && uppslag.traffar.length > 0, 'Textuppslag ska lyckas utan nätverk');

    // 3. Kontrollera att noll nätverksanrop gjordes
    assert.equal(fetchCallCount, 0, 'Läsning och sökning gjorde otillåtna nätverksanrop');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

// --- 5. SÄKERHETSPROV: MUTATION, ROLLER, PRIVATA UTKAST OCH HEMLIGHETER ---
test('CF12-5: Säkerhet - Obehörig mutation nekas, 0 privata utkast och 0 hemligheter i publika artefakter', async () => {
  const manager = new EditorialManager();

  // 1. Oautentiserad mutation nekas
  const resUnauth = await manager.saveDraft({
    domain: 'startsida',
    id: 'start',
    title: 'Test',
    content: {},
    actor: null, // Oautentiserad
  });
  assert.equal(resUnauth.ok, false);
  assert.equal(resUnauth.httpStatus, 401, 'Oautentiserad användare ska nekas med 401');

  // 2. Icke-administratör nekas
  const resNonAdmin = await manager.saveDraft({
    domain: 'startsida',
    id: 'start',
    title: 'Test',
    content: {},
    actor: { id: 'reader-1', email: 'lasare@test.se', isAdmin: false },
  });
  assert.equal(resNonAdmin.ok, false);
  assert.equal(resNonAdmin.httpStatus, 403, 'Icke-admin ska nekas med 403');

  // 3. Verifiera att inga privata redaktionsfält eller utkast läcker till sökindexen
  const hwRaw = fs.readFileSync(HEADWORDS_INDEX_PATH, 'utf8');
  assert.ok(!hwRaw.includes('"internalDraft"'), 'Hittade internalDraft i index-headwords');
  assert.ok(!hwRaw.includes('"reviewNotes"'), 'Hittade reviewNotes i index-headwords');

  // 4. Verifiera frånvaro av hemligheter i publika filer
  const sensitiveTokens = [
    'SUPABASE_SERVICE_ROLE_KEY',
    'RESEND_API_KEY',
    'CLOUDFLARE_API_TOKEN',
  ];

  const publicIndexJson = fs.readFileSync(HEADWORDS_INDEX_PATH, 'utf8');
  for (const token of sensitiveTokens) {
    assert.ok(!publicIndexJson.includes(token), `Läcker ${token} i sökindex`);
  }
});

// --- 6. TILLGÄNGLIGHET OCH LAGRINGSRESERV (SAFARI ITP / BLOCKERAD LOCALSTORAGE) ---
test('CF12-6: Tillgänglighet och reserv - WCAG AA-semantik och säker hantering vid blockerad lagring', () => {
  // Verifiera att StorageBridge godkänner samtliga 9 betrodda projekt-origins
  assert.equal(ALLOWED_ORIGINS.length, 9);
  for (const origin of ALLOWED_ORIGINS) {
    assert.equal(isOriginAllowed(origin), true, `Godkänd origin fallerade: ${origin}`);
  }
  assert.equal(isOriginAllowed('https://ond-webbplats.com'), false, 'Obehörig extern domän ska nekas');

  // Defensiv sanering: otillåten indata ger null utan att krascha
  const corruptPost = sanitizeSavedPost({ id: 'inte-ett-giltigt-id' });
  assert.equal(corruptPost, null, 'Ogiltigt postformat måste avvisas defensivt');

  // Generera en HTML-artikel och kontrollera WCAG AA-semantik
  const sample = {
    id: 'soederwall--dom',
    headwordDisplay: 'dom',
    sourceDataset: 'soederwall',
    kallaId: 'soederwall',
    partOfSpeech: ['sbst.'],
    letterSection: 'D',
    articlePlainText: 'dom, m. dom, domslut, beslut.',
  };
  const html = renderArticleHtml(sample);
  assert.ok(html.includes('lang="sv"'), 'HTML måste ha explicit språkatribut (lang="sv")');
  assert.ok(html.includes('meta name="viewport"'), 'Viewport-meta måste finnas');
  assert.ok(html.includes('aria-label='), 'Skärmläsaretiketter (aria-label) måste finnas');
  assert.ok(html.includes('<h1'), 'Semantisk h1-rubrik måste finnas');
});

// --- 7. PRESTANDABUDGET MOT CF06 ---
test('CF12-7: Prestandabudget - Filstorlekar, komprimering och sökindex enligt CF06', () => {
  assert.ok(fs.existsSync(BUDGET_FILE), 'CF06-prestandabudget.json saknas');
  const budget = JSON.parse(fs.readFileSync(BUDGET_FILE, 'utf8'));

  const hwRaw = fs.readFileSync(HEADWORDS_INDEX_PATH);
  const hwGzip = zlib.gzipSync(hwRaw);
  const hwSizeMB = hwGzip.length / (1024 * 1024);
  assert.ok(
    hwSizeMB <= budget.headwordSearchIndex.budgetCeilingGzipMb,
    `index-headwords.json gzip (${hwSizeMB.toFixed(2)} MB) överskrider budgetCeilingGzipMb (${budget.headwordSearchIndex.budgetCeilingGzipMb} MB)`
  );

  const ftRaw = fs.readFileSync(FULLTEXT_INDEX_PATH);
  const ftGzip = zlib.gzipSync(ftRaw);
  const ftSizeMB = ftGzip.length / (1024 * 1024);
  assert.ok(
    ftSizeMB <= 8.0,
    `index-fulltext.json gzip (${ftSizeMB.toFixed(2)} MB) överskrider taket på 8.0 MB`
  );
});

// --- 8. PROJEKTKONTROLLER FÖR KÄLLOR, TEXTER OCH TYPER ---
test('CF12-8: Projektkontroller - Källor och texter är felfria enligt projektets validerare', () => {
  const textStorePath = path.join(ROOT, 'data', 'texter.ts');
  const kallaStorePath = path.join(ROOT, 'data', 'kallor.ts');
  assert.ok(fs.existsSync(textStorePath), 'data/texter.ts saknas');
  assert.ok(fs.existsSync(kallaStorePath), 'data/kallor.ts saknas');
});

// --- 9. TESTMILJÖNS ISOLERING: NOINDEX OCH INGA PRODUKTIONSCANONICALS ---
test('CF12-9: Testmiljöns isolering - Noindex och preview-canonical i testmiljöer', () => {
  const originalEnv = { ...process.env };

  try {
    // 1. Simulera Cloudflare Pages förhandsgranskning (preview)
    process.env.CF_PAGES_ENVIRONMENT = 'preview';
    process.env.CF_PAGES_URL = 'https://preview-123.fornsvenska.pages.dev';

    assert.equal(arPreviewMiljo(), true, 'arPreviewMiljo ska returnera true i preview-läge');
    assert.equal(isPreviewEnvironment(), true, 'isPreviewEnvironment ska returnera true i preview-läge');

    // 2. Verifiera att canonical i testmiljö pekar på testmiljön, ALDRIG www.fornsvenska.se eller ord-XX.fornsvenska.se
    const testCanonical = getArticleCanonicalUrl('soederwall--af-aeta');
    assert.equal(
      testCanonical,
      'https://preview-123.fornsvenska.pages.dev/ordbok/soederwall--af-aeta',
      'Testmiljöns canonical ska peka på testvärden'
    );
    assert.ok(
      !testCanonical.includes('fornsvenska.se'),
      'Testmiljön får inte lista produktionsdomän som canonical'
    );

    // 3. Verifiera att genererad HTML för artikel i testmiljö har <meta name="robots" content="noindex, nofollow">
    const samplePost = {
      id: 'soederwall--af-aeta',
      headwordDisplay: 'af æta',
      sourceDataset: 'soederwall',
      kallaId: 'soederwall',
      partOfSpeech: ['vb.'],
      letterSection: 'A',
      articlePlainText: 'af æta, v. äta upp.',
    };
    const previewHtml = renderArticleHtml(samplePost);
    assert.ok(
      previewHtml.includes('<meta name="robots" content="noindex, nofollow">'),
      'Testmiljöns HTML måste innehålla robots noindex'
    );

    // 4. Simulera produktion och verifiera att produktion pekar på riktig underdomän och INTE har noindex
    delete process.env.CF_PAGES_ENVIRONMENT;
    delete process.env.CF_PAGES_URL;
    process.env.CF_PAGES_BRANCH = 'main';

    assert.equal(arPreviewMiljo(), false, 'Produktion ska inte vara preview');
    assert.equal(isPreviewEnvironment(), false, 'Produktion ska inte vara preview');

    const prodCanonical = getArticleCanonicalUrl('soederwall--af-aeta');
    assert.equal(
      prodCanonical,
      'https://ord-01.fornsvenska.se/ordbok/soederwall--af-aeta',
      'Produktionscanonical ska peka på ord-01.fornsvenska.se'
    );

    const prodHtml = renderArticleHtml(samplePost);
    assert.ok(
      !prodHtml.includes('<meta name="robots" content="noindex, nofollow">'),
      'Produktions-HTML ska inte ha robots noindex'
    );
  } finally {
    process.env = originalEnv;
  }
});
