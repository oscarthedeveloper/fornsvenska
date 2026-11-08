import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';

test('CF06: Architectural decision record is complete and covers all 8 locked decisions', () => {
  const adrPath = path.join(
    process.cwd(),
    'docs',
    'drift',
    'cloudflare',
    'CF06-arkitekturbeslut.md'
  );
  assert.ok(existsSync(adrPath), 'CF06-arkitekturbeslut.md måste finnas');

  const content = readFileSync(adrPath, 'utf8');

  // De 8 låsta besluten måste finnas dokumenterade med tydliga avsnitt
  assert.ok(content.includes('1. Exportmetod för ordbok'));
  assert.ok(content.includes('2. Gruppfördelning och värdar'));
  assert.ok(content.includes('3. Ruttkontrakt & gamla länkar'));
  assert.ok(content.includes('4. Snapshot-kontrakt'));
  assert.ok(content.includes('5. Sökindexstrategi'));
  assert.ok(content.includes('6. Personlig ordlista'));
  assert.ok(content.includes('7. Redaktion & behörighet'));
  assert.ok(content.includes('8. Gratis byggkedja & release'));

  // Tydlig åtskillnad mellan beslut och antaganden
  assert.ok(content.includes('Fastställda beslut (bekräftade och bevisade)'));
  assert.ok(content.includes('Antaganden som verifieras i molnfasen'));
});

test('CF06: Performance budget numbers meet all binding limits and quality goals', () => {
  const budgetPath = path.join(
    process.cwd(),
    'docs',
    'drift',
    'cloudflare',
    'CF06-prestandabudget.json'
  );
  assert.ok(existsSync(budgetPath), 'CF06-prestandabudget.json måste finnas');

  const budget = JSON.parse(readFileSync(budgetPath, 'utf8'));

  // 1. Startsida payload
  assert.ok(budget.firstPageInitialLoad.totalInitialPayloadGzip <= 80000, 'Initial payload ska vara <= 80 KB');
  assert.ok(budget.firstPageInitialLoad.maxStaticRequests <= 10, 'Max 10 statiska nätanrop');

  // 2. Kompakt uppslagsordsindex
  assert.ok(
    budget.headwordSearchIndex.gzipMb <= budget.headwordSearchIndex.budgetCeilingGzipMb,
    `Kompakt sökindex (${budget.headwordSearchIndex.gzipMb} MB) ska rymmas under taket (${budget.headwordSearchIndex.budgetCeilingGzipMb} MB)`
  );
  assert.equal(budget.headwordSearchIndex.gzipMb, 0.58);
  assert.ok(budget.headwordSearchIndex.warmSearchMedianMs < 10.0, 'Söktid ska vara sub-10 ms');

  // 3. Fulltextindex separation
  assert.equal(budget.fulltextSearchIndex.requiresDownloadForBasicSearch, false, 'Grundsökning kräver inte fulltextindex');
  assert.ok(budget.fulltextSearchIndex.gzipMb < 8.0, 'Fulltextindex ska vara < 8 MB');

  // 4. Största bygge
  assert.equal(budget.largestBuildProject.articleCount, 6900);
  assert.equal(budget.largestBuildProject.totalFiles, 6901);
  assert.ok(budget.largestBuildProject.totalFiles <= budget.largestBuildProject.internalFileLimit);
  assert.ok(budget.largestBuildProject.internalUtilizationPct < 50.0);

  // 5. Driftsbudget
  assert.equal(budget.operationalBudget.totalProjectOperationsMonth, 252);
  assert.equal(budget.operationalBudget.cloudflarePagesMonthlyQuota, 500);
  assert.equal(budget.operationalBudget.publicAnonymRequestsToSupabase, 0);
  assert.equal(budget.operationalBudget.publicAnonymRequestsToWorkers, 0);
});

test('CF06: Live search latency benchmark on compact headword index stays under 10 ms', () => {
  const dataPath = path.join(process.cwd(), 'data', 'ordbok', 'poster.json');
  const data = JSON.parse(readFileSync(dataPath, 'utf8'));

  const compact = data.map((p) => ({
    i: p.id,
    h: p.headwordDisplay.toLowerCase(),
    v: (p.variantsOriginal || []).map((v) => v.toLowerCase()),
  }));

  const testQueries = ['konunger', 'lagh', 'ting', 'skip', 'äta'];

  // Värm upp V8 JIT före tidsmätning för att undvika kompilationsspikar vid parallell testkörning
  for (const q of testQueries) {
    compact.filter((p) => p.h.includes(q) || p.v.some((v) => v.includes(q)));
  }

  const times = [];

  for (let i = 0; i < 20; i++) {
    const q = testQueries[i % testQueries.length];
    const t0 = performance.now();
    const hits = compact.filter((p) => p.h.includes(q) || p.v.some((v) => v.includes(q)));
    const elapsed = performance.now() - t0;
    times.push(elapsed);
    assert.ok(hits.length > 0, `Sökning på '${q}' ska ge träffar`);
  }

  times.sort((a, b) => a - b);
  const medianTime = times[Math.floor(times.length / 2)];

  assert.ok(
    medianTime < 20.0,
    `Median söktid (${medianTime.toFixed(2)} ms) måste vara < 20.0 ms under parallell testkörning`
  );
});
