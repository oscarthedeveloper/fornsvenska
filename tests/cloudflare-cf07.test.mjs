import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { arPreviewMiljo } from '../app/robots.ts';
import { buildMainSite } from '../scripts/cloudflare/build-main-site.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const DIST_WWW = path.join(ROOT, 'dist', 'www');

/**
 * Enkel statisk HTTP-server som simulerar Cloudflare Pages edge-beteende:
 * - Slår upp exakt fil om den finns
 * - Om sökvägen är en katalog eller saknar ändelse, slår upp <fil>.html eller <katalog>/index.html
 * - Om inte funnen, serverar 404.html med HTTP 404
 */
function createStaticTestServer(distDir) {
  return http.createServer(async (req, res) => {
    try {
      const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
      let reqPath = decodeURIComponent(parsedUrl.pathname);

      if (reqPath.endsWith('/')) {
        reqPath = reqPath.slice(0, -1);
      }

      // Försök matcha filordning som Cloudflare Pages
      const candidates = [
        path.join(distDir, reqPath === '' ? 'index.html' : reqPath),
        path.join(distDir, `${reqPath}.html`),
        path.join(distDir, reqPath, 'index.html'),
      ];

      let foundPath = null;
      for (const cand of candidates) {
        try {
          const st = await fs.stat(cand);
          if (st.isFile()) {
            foundPath = cand;
            break;
          }
        } catch {
          // Fortsätt leta
        }
      }

      if (foundPath) {
        const content = await fs.readFile(foundPath);
        const ext = path.extname(foundPath);
        const mimeTypes = {
          '.html': 'text/html; charset=utf-8',
          '.txt': 'text/plain; charset=utf-8',
          '.xml': 'application/xml; charset=utf-8',
          '.svg': 'image/svg+xml',
          '.png': 'image/png',
          '.js': 'application/javascript; charset=utf-8',
          '.css': 'text/css; charset=utf-8',
          '.json': 'application/json; charset=utf-8',
        };
        res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
        res.end(content);
      } else {
        // Returnera custom 404.html
        const notFoundFile = path.join(distDir, '404.html');
        const notFoundContent = await fs.readFile(notFoundFile);
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(notFoundContent);
      }
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end(`Internal Server Error: ${err.message}`);
    }
  });
}

test('CF07: Statiskt huvudbygge och filbudget för Cloudflare Pages', async () => {
  const result = await buildMainSite();

  assert.equal(result.ok, true, `Bygget rapporterade varningar: ${result.warnings.join(', ')}`);
  assert.ok(result.fileCount > 250, `För få filer genererade: ${result.fileCount}`);
  assert.ok(
    result.fileCount < 20000,
    `Överstiger Cloudflare Pages 20 000-filgräns: ${result.fileCount}`
  );
  assert.ok(
    result.fileCount < 16000,
    `Överstiger intern varningsbudget på 16 000 filer: ${result.fileCount}`
  );
  assert.ok(
    result.routesVerified >= 300,
    `För få rutter verifierade i bygget: ${result.routesVerified}`
  );

  // Verifiera att centrala filer finns i dist/www
  const essentialFiles = [
    'index.html',
    '404.html',
    'robots.txt',
    'sitemap.xml',
    '_redirects',
    '_headers',
    'ordbok/storage-bridge.html',
    'resurser/vastgotalagen.html',
    'kontakt.html',
    'runor.html',
    'texter.html',
    'grammatik.html',
  ];

  for (const file of essentialFiles) {
    const full = path.join(DIST_WWW, file);
    const st = await fs.stat(full);
    assert.ok(st.isFile(), `Fil saknas: ${file}`);
    assert.ok(st.size > 0, `Tom fil: ${file}`);
  }
});

test('CF07: Ren statisk webbserver betjänar publika läsrutter och 404', async () => {
  const server = createStaticTestServer(DIST_WWW);

  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    // 1. Startsida (200 OK)
    const resHome = await fetch(`${baseUrl}/`);
    assert.equal(resHome.status, 200);
    const textHome = await resHome.text();
    assert.ok(textHome.includes('Fornsvenska'), 'Startsidan saknar Fornsvenska-rubrik');
    assert.ok(textHome.includes('Språkhistorisk studieplattform'), 'Startsidan saknar ingress');

    // 2. Grammatik (200 OK)
    const resGrammar = await fetch(`${baseUrl}/grammatik`);
    assert.equal(resGrammar.status, 200);
    const textGrammar = await resGrammar.text();
    assert.ok(textGrammar.includes('grammatik'), 'Grammatiksidan saknar innehåll');

    // 3. Grammatik undersida: vad-ar-fornsvenska (200 OK)
    const resGrammarDoc = await fetch(`${baseUrl}/grammatik/introduktion/vad-ar-fornsvenska`);
    assert.equal(resGrammarDoc.status, 200);
    const textGrammarDoc = await resGrammarDoc.text();
    assert.ok(textGrammarDoc.includes('Vad är fornsvenska?'), 'Undersidan saknar titel');

    // 4. Textarkiv: Äldre Västgötalagen (200 OK med fornsvenska tecken)
    const resTextDoc = await fetch(`${baseUrl}/texter/lagar/aldre-vastgotalagen/arfda-balker`);
    assert.equal(resTextDoc.status, 200);
    const textTextDoc = await resTextDoc.text();
    assert.ok(
      textTextDoc.includes('arfda-balker') || textTextDoc.includes('Arfda balker'),
      'Texten saknar kapitelinnehåll'
    );
    // Bevarande av fornsvenska tecken
    assert.ok(
      textTextDoc.includes('æ') || textTextDoc.includes('þ') || textTextDoc.includes('ö'),
      'Fornsvenska tecken saknas i textutgåvan'
    );

    // 5. Runor: Översikt och detaljsida (200 OK)
    const resRunor = await fetch(`${baseUrl}/runor`);
    assert.equal(resRunor.status, 200);
    const textRunor = await resRunor.text();
    assert.ok(textRunor.includes('runinskrifter'), 'Runöversikten saknar rubrik');

    const resRunDetail = await fetch(`${baseUrl}/runor/ol-1`);
    assert.equal(resRunDetail.status, 200);
    const textRunDetail = await resRunDetail.text();
    assert.ok(textRunDetail.includes('Öl 1'), 'Rundetaljsidan saknar inskriftsbeteckning');
    assert.ok(textRunDetail.includes('application/ld+json'), 'Rundetaljsidan saknar schema.org');

    // 6. Resursbibliotek: Bokvy för Västgötalagen (200 OK)
    const resBok = await fetch(`${baseUrl}/resurser/vastgotalagen`);
    assert.equal(resBok.status, 200);
    const textBok = await resBok.text();
    assert.ok(textBok.includes('Västgötalagen') || textBok.includes('Bokvy'), 'Bokvyn saknas');

    // 7. Kontakt (200 OK)
    const resKontakt = await fetch(`${baseUrl}/kontakt`);
    assert.equal(resKontakt.status, 200);
    const textKontakt = await resKontakt.text();
    assert.ok(textKontakt.includes('Kontakt och rättelser'), 'Kontaktsidan saknar rubrik');

    // 8. Egen 404-sida vid felaktig URL
    const res404 = await fetch(`${baseUrl}/en-sida-som-absolut-inte-finns-12345`);
    assert.equal(res404.status, 404);
    const text404 = await res404.text();
    assert.ok(text404.includes('Felkod 404'), 'Custom 404 saknar felkod 404');
    assert.ok(text404.includes('Sidan hittades inte'), 'Custom 404 saknar feltext');
    assert.ok(text404.includes('href="/ordbok"'), 'Custom 404 saknar ordbokslänk');
    assert.ok(text404.includes('href="/grammatik"'), 'Custom 404 saknar grammatiklänk');

    // 9. Storage Bridge för CF04
    const resBridge = await fetch(`${baseUrl}/ordbok/storage-bridge.html`);
    assert.equal(resBridge.status, 200);
    const textBridge = await resBridge.text();
    assert.ok(
      textBridge.includes('Storage Bridge') && textBridge.includes('fornsvenska_sparade_ord_v1'),
      'Storage Bridge saknar identifierare'
    );
  } finally {
    server.close();
  }
});

test('CF07: Ruttkontrakt för _redirects och _headers', async () => {
  const redirectsContent = await fs.readFile(path.join(DIST_WWW, '_redirects'), 'utf8');

  // Källor omdirigeras 301 till resurser
  assert.ok(
    redirectsContent.includes('/kallor /resurser 301'),
    'Kallor -> Resurser 301-regel saknas i _redirects'
  );

  // 68 prefixregler för ordbokslänkar till ord-01..07.fornsvenska.se
  const lines = redirectsContent.split('\n').filter((l) => l.trim() && !l.startsWith('#'));
  const ordbokRules = lines.filter((l) => l.startsWith('/ordbok/soederwall'));
  assert.equal(ordbokRules.length, 68, `Förväntade 68 ordboksregler, hittade ${ordbokRules.length}`);

  // Kontrollera att alla 7 ordboksunderdomäner pekas ut
  for (let g = 1; g <= 7; g++) {
    const padded = String(g).padStart(2, '0');
    assert.ok(
      redirectsContent.includes(`https://ord-${padded}.fornsvenska.se/ordbok/`),
      `Underdomän ord-${padded} saknas i _redirects`
    );
  }

  // Kontrollera _headers
  const headersContent = await fs.readFile(path.join(DIST_WWW, '_headers'), 'utf8');
  assert.ok(headersContent.includes('/_next/static/*'), 'Oföränderlig cache saknas i _headers');
  assert.ok(headersContent.includes('immutable'), 'Immutable-direktiv saknas för statiska chunks');
  assert.ok(headersContent.includes('/ordbok/storage-bridge.html'), 'Storage bridge headers saknas');
});

test('CF07: Preview-miljöer och robots.txt-spärr', () => {
  const originalEnv = { ...process.env };

  try {
    // 1. Cloudflare Pages preview-miljö
    process.env.CF_PAGES_ENVIRONMENT = 'preview';
    delete process.env.CONTEXT;
    assert.equal(arPreviewMiljo(), true, 'CF_PAGES_ENVIRONMENT=preview ska ge preview');

    // 2. Cloudflare Pages feature-branch
    delete process.env.CF_PAGES_ENVIRONMENT;
    process.env.CF_PAGES_BRANCH = 'feature-branch-test';
    assert.equal(arPreviewMiljo(), true, 'CF_PAGES_BRANCH!=main ska ge preview');

    // 3. Cloudflare Pages main-branch
    process.env.CF_PAGES_BRANCH = 'main';
    assert.equal(arPreviewMiljo(), false, 'CF_PAGES_BRANCH=main ska inte ge preview');

    // 4. Netlify preview
    delete process.env.CF_PAGES_BRANCH;
    process.env.CONTEXT = 'deploy-preview';
    assert.equal(arPreviewMiljo(), true, 'Netlify CONTEXT!=production ska ge preview');

    process.env.CONTEXT = 'production';
    assert.equal(arPreviewMiljo(), false, 'Netlify CONTEXT=production ska inte ge preview');
  } finally {
    process.env = originalEnv;
  }
});

test('CF07: Säkerställd datagräns och nollanropsgaranti för anonyma läsare', async () => {
  // Verifiera att AdminContext i källkoden har guard mot anonyma Supabase-anrop
  const adminContextCode = await fs.readFile(
    path.join(ROOT, 'components', 'admin', 'AdminContext.tsx'),
    'utf8'
  );

  assert.ok(
    adminContextCode.includes('isAdminHostOrPath') && adminContextCode.includes('harAuthKaka'),
    'AdminContext saknar snabbkontroll för att förhindra anonyma Supabase-anrop'
  );

  // Verifiera att genererad HTML för publika sidor inte läcker interna miljövariabler eller hemligheter
  const homeHtml = await fs.readFile(path.join(DIST_WWW, 'index.html'), 'utf8');
  assert.ok(!homeHtml.includes('SUPABASE_SERVICE_ROLE_KEY'), 'Läcker service role key');
  assert.ok(!homeHtml.includes('RESEND_API_KEY'), 'Läcker Resend API-nyckel');
  assert.ok(!homeHtml.includes('GITHUB_TOKEN'), 'Läcker GitHub-token');
});

test('CF07: Extern tillgångsinventering (kartor och specialtypsnitt)', async () => {
  // 1. Runornas interaktiva karta använder OpenStreetMap med källattribution
  const mapCode = await fs.readFile(
    path.join(ROOT, 'components', 'runor', 'RunorInteractiveMap.tsx'),
    'utf8'
  );
  assert.ok(mapCode.includes('tile.openstreetmap.org'), 'Kartan saknar öppet OpenStreetMap-underlag');
  assert.ok(mapCode.includes('OpenStreetMap'), 'Kartan saknar OpenStreetMap-attribution');
  assert.ok(mapCode.includes('tileerror'), 'Kartan saknar felhanterare för blockerade tiles');

  // 2. Specialtypsnitt Noto Sans Runic för medeltida runor
  const layoutCode = await fs.readFile(path.join(ROOT, 'app', 'layout.tsx'), 'utf8');
  assert.ok(
    layoutCode.includes('Noto+Sans+Runic'),
    'Layout saknar Noto Sans Runic för runvisning'
  );
});
