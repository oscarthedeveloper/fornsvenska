import test from 'node:test';
import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import {
  skickaKontaktMeddelande,
  nollstallRateLimitOchKvot,
  hamtaKontaktKvotStatus,
} from '../lib/kontakt/kontaktService.ts';
import { buildRunicApiExports } from '../scripts/cloudflare/build-runic-api-exports.ts';
import { GET as getRunorV1, OPTIONS as optionsRunorV1 } from '../app/api/runor/v1/route.ts';
import { GET as getRunorSlug, OPTIONS as optionsRunorSlug } from '../app/api/runor/v1/[slug]/route.ts';

test.beforeEach(() => {
  nollstallRateLimitOchKvot();
});

test('CF10: Kontakt - Validering, maxlängder och framgångsrik mock-leverans', async () => {
  // 1. Framgångsrikt inskick med mock-adapter
  const resSuccess = await skickaKontaktMeddelande(
    {
      namn: 'Karin Månsdotter',
      epost: 'karin@exempel.se',
      amne: 'Rättelse till textprov',
      meddelande: 'I textavsnittet saknas en fotnot rörande Cod. Holm. B 59.',
    },
    { tvingaMock: true }
  );

  assert.equal(resSuccess.ok, true);
  assert.equal(resSuccess.httpStatus, 200);
  assert.equal(resSuccess.leveranssatt, 'mock_test');
  assert.ok(resSuccess.meddelandeId?.startsWith('mock-msg-'));

  // 2. Saknad e-post avvisas med 400
  const resNoEmail = await skickaKontaktMeddelande({
    epost: '',
    meddelande: 'Ett meddelande utan avsändare',
  });
  assert.equal(resNoEmail.ok, false);
  assert.equal(resNoEmail.httpStatus, 400);

  // 3. Ogiltig e-postadress avvisas med 400
  const resBadEmail = await skickaKontaktMeddelande({
    epost: 'inte-en-epost',
    meddelande: 'Testmeddelande',
  });
  assert.equal(resBadEmail.ok, false);
  assert.equal(resBadEmail.httpStatus, 400);

  // 4. Överlångt namn (> 100 tecken) avvisas med 400
  const resLongName = await skickaKontaktMeddelande({
    namn: 'A'.repeat(101),
    epost: 'test@exempel.se',
    meddelande: 'Test',
  });
  assert.equal(resLongName.ok, false);
  assert.equal(resLongName.httpStatus, 400);
  assert.ok(resLongName.error?.includes('Namnfältet'));

  // 5. Överlångt meddelande (> 5000 tecken) avvisas med 400
  const resLongMsg = await skickaKontaktMeddelande({
    epost: 'test@exempel.se',
    meddelande: 'X'.repeat(5001),
  });
  assert.equal(resLongMsg.ok, false);
  assert.equal(resLongMsg.httpStatus, 400);
  assert.ok(resLongMsg.error?.includes('Meddelandet överskrider'));
});

test('CF10: Kontakt - Spamskydd, tidsspärr och frekvensbegränsning (Rate Limiting)', async () => {
  // 1. Honeypot: bot-field ifyllt ignoreras tyst utan utskick
  const resHoneypot = await skickaKontaktMeddelande({
    namn: 'Spam Bot',
    epost: 'bot@spam.com',
    meddelande: 'Buy now',
    botField: 'I am a bot',
  });
  assert.equal(resHoneypot.ok, true);
  assert.equal(resHoneypot.meddelandeId, 'silent-bot-discard');

  // 2. Tidsspärr: inskickat under 1 500 ms avvisas som misstänkt automatiserat
  const startTid = 1000000;
  const snabbTid = startTid + 800; // Endast 800 ms efter sidvisning
  const resFast = await skickaKontaktMeddelande(
    {
      epost: 'snabb@exempel.se',
      meddelande: 'Blixtsnabbt skript',
      tidsstampelFormular: startTid,
    },
    { nu: snabbTid, tvingaMock: true }
  );
  assert.equal(resFast.ok, false);
  assert.equal(resFast.httpStatus, 400);
  assert.ok(resFast.error?.includes('för snabbt'));

  // 3. Frekvensbegränsning: max 5 meddelanden per timme från samma IP
  const testIp = '192.168.1.100';
  for (let i = 1; i <= 5; i++) {
    const res = await skickaKontaktMeddelande(
      {
        epost: `anvandare${i}@exempel.se`,
        meddelande: `Meddelande nummer ${i}`,
        klientIp: testIp,
      },
      { tvingaMock: true }
    );
    assert.equal(res.ok, true, `Meddelande ${i} borde accepteras`);
  }

  // Det 6:e anropet från samma IP avvisas med HTTP 429
  const resRateLimited = await skickaKontaktMeddelande(
    {
      epost: 'anvandare6@exempel.se',
      meddelande: 'Meddelande nummer 6 som ska nekas',
      klientIp: testIp,
    },
    { tvingaMock: true }
  );
  assert.equal(resRateLimited.ok, false);
  assert.equal(resRateLimited.httpStatus, 429);
  assert.ok(resRateLimited.error?.includes('För många'));
});

test('CF10: Kontakt - Daglig kvotkontroll (Resend Free: 100 mejl/dag)', async () => {
  nollstallRateLimitOchKvot();

  const statusInnan = hamtaKontaktKvotStatus();
  assert.equal(statusInnan.anvantIdag, 0);
  assert.equal(statusInnan.maxPerDag, 100);

  // Simulera 100 sändningar från olika IP-adresser
  for (let i = 0; i < 100; i++) {
    const res = await skickaKontaktMeddelande(
      {
        epost: `user${i}@exempel.se`,
        meddelande: 'Testmeddelande',
        klientIp: `10.0.0.${i}`,
      },
      { tvingaMock: true }
    );
    assert.equal(res.ok, true);
  }

  const statusEfter100 = hamtaKontaktKvotStatus();
  assert.equal(statusEfter100.anvantIdag, 100);
  assert.equal(statusEfter100.kvarIdag, 0);

  // Det 101:a anropet spärras med HTTP 429
  const resQuotaExceeded = await skickaKontaktMeddelande(
    {
      epost: 'overflod@exempel.se',
      meddelande: 'Över kvotgränsen',
      klientIp: '10.0.1.1',
    },
    { tvingaMock: true }
  );
  assert.equal(resQuotaExceeded.ok, false);
  assert.equal(resQuotaExceeded.httpStatus, 429);
  assert.ok(resQuotaExceeded.error?.includes('utskickskvot'));
});

test('CF10: Run-API - Versionsbundna statiska exporter genererade och verifierade', async () => {
  const result = await buildRunicApiExports();
  assert.equal(result.ok, true);
  assert.equal(result.inscriptionsGenerated, 20);

  const baseDir = path.join(process.cwd(), 'public', 'api', 'runor', 'v1');

  // 1. Kontrollera index.json
  const indexRaw = await fs.readFile(path.join(baseDir, 'index.json'), 'utf8');
  const indexData = JSON.parse(indexRaw);
  assert.equal(indexData.version, '1.0.0');
  assert.equal(indexData.apiEndpoint, '/api/runor/v1');
  assert.equal(indexData.totalPublished, 20);
  assert.ok(indexData.attribution.includes('Sveriges runinskrifter'));
  assert.ok(indexData.license.includes('ODbL 1.0'));
  assert.equal(indexData.inscriptions.length, 20);

  // 2. Kontrollera geojson.json
  const geoRaw = await fs.readFile(path.join(baseDir, 'geojson.json'), 'utf8');
  const geoData = JSON.parse(geoRaw);
  assert.equal(geoData.type, 'FeatureCollection');
  assert.equal(geoData.features.length, 20);
  const firstFeature = geoData.features[0];
  assert.equal(firstFeature.type, 'Feature');
  assert.equal(firstFeature.geometry.type, 'Point');
  assert.ok(Array.isArray(firstFeature.geometry.coordinates));
  assert.equal(firstFeature.geometry.coordinates.length, 2);

  // 3. Kontrollera versionsbundna exporter
  const pilotRaw = await fs.readFile(path.join(baseDir, 'versions', '2026.1-pilot.json'), 'utf8');
  const pilotData = JSON.parse(pilotRaw);
  assert.equal(pilotData.datasetVersion, '2026.1-pilot');
  assert.equal(pilotData.totalPublished, 20);

  const batchRaw = await fs.readFile(path.join(baseDir, 'versions', '2026.2-batch1.json'), 'utf8');
  const batchData = JSON.parse(batchRaw);
  assert.equal(batchData.datasetVersion, '2026.2-batch1');
  assert.equal(batchData.totalPublished, 50);

  // 4. Kontrollera enskilda inskriftsfiler
  const ol1Raw = await fs.readFile(path.join(baseDir, 'inscriptions', 'ol-1.json'), 'utf8');
  const ol1Data = JSON.parse(ol1Raw);
  assert.equal(ol1Data.inscription.canonicalSignum, 'Öl 1');
  assert.equal(ol1Data.inscription.canonicalSlug, 'ol-1');
  assert.ok(ol1Data.inscription.placements[0].coordinatesWgs84);
});

test('CF10: Run-API - Bakåtkompatibilitet för parametrarna format, province, carrier, q, CORS och OPTIONS', async () => {
  // 1. OPTIONS på /api/runor/v1 returnerar HTTP 204 med CORS-headers
  const optRes = await optionsRunorV1();
  assert.equal(optRes.status, 204);
  assert.equal(optRes.headers.get('Access-Control-Allow-Origin'), '*');
  assert.ok(optRes.headers.get('Access-Control-Allow-Methods')?.includes('GET'));

  // 2. GeoJSON via query parameter (?format=geojson)
  const reqGeo = new Request('https://www.fornsvenska.se/api/runor/v1?format=geojson');
  const resGeo = await getRunorV1(reqGeo);
  assert.equal(resGeo.status, 200);
  assert.equal(resGeo.headers.get('Content-Type'), 'application/geo+json; charset=utf-8');
  const dataGeo = await resGeo.json();
  assert.equal(dataGeo.type, 'FeatureCollection');
  assert.equal(dataGeo.features.length, 20);

  // 3. Filtrering på provins (?province=Öl)
  const reqProv = new Request('https://www.fornsvenska.se/api/runor/v1?province=Öl');
  const resProv = await getRunorV1(reqProv);
  assert.equal(resProv.status, 200);
  const dataProv = await resProv.json();
  assert.ok(dataProv.inscriptions.length > 0);
  for (const item of dataProv.inscriptions) {
    assert.equal(item.provinceCode, 'Öl');
  }

  // 4. Filtrering på bärare (?carrier=runsten)
  const reqCarrier = new Request('https://www.fornsvenska.se/api/runor/v1?carrier=runsten');
  const resCarrier = await getRunorV1(reqCarrier);
  assert.equal(resCarrier.status, 200);
  const dataCarrier = await resCarrier.json();
  for (const item of dataCarrier.inscriptions) {
    assert.equal(item.carrier.type, 'runsten');
  }

  // 5. Textsökning (?q=Karlevi)
  const reqSearch = new Request('https://www.fornsvenska.se/api/runor/v1?q=Karlevi');
  const resSearch = await getRunorV1(reqSearch);
  assert.equal(resSearch.status, 200);
  const dataSearch = await resSearch.json();
  assert.equal(dataSearch.inscriptions.length, 1);
  assert.equal(dataSearch.inscriptions[0].canonicalSignum, 'Öl 1');

  // 6. Enskilt inskriftsuppslag via slug
  const reqSlug = new Request('https://www.fornsvenska.se/api/runor/v1/u-112b');
  const resSlug = await getRunorSlug(reqSlug, { params: { slug: 'u-112b' } });
  assert.equal(resSlug.status, 200);
  const dataSlug = await resSlug.json();
  assert.equal(dataSlug.inscription.canonicalSignum, 'U 112B');

  // 7. Okänd slug returnerar 404
  const reqNotFound = new Request('https://www.fornsvenska.se/api/runor/v1/finns-inte');
  const resNotFound = await getRunorSlug(reqNotFound, { params: { slug: 'finns-inte' } });
  assert.equal(resNotFound.status, 404);
});

test('CF10: Inventering och attribution - Karttiles, bokfiler, typsnitt och sekretess', async () => {
  // 1. Verifiera att OpenStreetMap-attribution finns i RunorInteractiveMap
  const mapFile = await fs.readFile(
    path.join(process.cwd(), 'components', 'runor', 'RunorInteractiveMap.tsx'),
    'utf8'
  );
  assert.ok(mapFile.includes('https://tile.openstreetmap.org/{z}/{x}/{y}.png'));
  assert.ok(mapFile.includes('OpenStreetMap'));
  assert.ok(mapFile.includes('attribution:'));

  // 2. Verifiera att runbilder i public/images/runor uppfyller kvalitetsbudgeten (E36: <= 150 KiB för tumnaglar)
  const imageDir = path.join(process.cwd(), 'public', 'images', 'runor');
  const images = await fs.readdir(imageDir);
  for (const img of images) {
    if (img.includes('-thumb.')) {
      const stat = await fs.stat(path.join(imageDir, img));
      assert.ok(
        stat.size <= 150 * 1024,
        `Tumnageln ${img} (${stat.size} B) överskrider budgeten på 150 KiB`
      );
    } else if (img.endsWith('.webp')) {
      const stat = await fs.stat(path.join(imageDir, img));
      assert.ok(
        stat.size <= 300 * 1024,
        `Fullstor bild ${img} (${stat.size} B) överskrider taket på 300 KiB`
      );
    }
  }

  // 3. Verifiera att bokfiler i public/bocker/vastgotalagen existerar och är läsbara
  const bookPdf = path.join(process.cwd(), 'public', 'bocker', 'vastgotalagen', 'vastgotalagen-maskintext.pdf');
  const pdfStat = await fs.stat(bookPdf);
  assert.ok(pdfStat.size > 100 * 1024, 'PDF-filen ska existera och vara större än 100 KB');

  // 4. Verifiera att RESEND_API_KEY aldrig förekommer hårdkodad i repositoryt
  const filesToCheck = [
    'app/api/kontakt/route.ts',
    'lib/kontakt/kontaktService.ts',
    'components/KontaktFormular.tsx',
    'app/kontakt/page.tsx',
  ];

  for (const f of filesToCheck) {
    const content = await fs.readFile(path.join(process.cwd(), f), 'utf8');
    assert.doesNotMatch(content, /re_[a-zA-Z0-9]{20,}/, `Hemlig API-nyckel får ALDRIG finnas i ${f}`);
  }
});
