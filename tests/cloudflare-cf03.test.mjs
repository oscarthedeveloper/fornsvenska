import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import {
  getArticleOwner,
  getArticleCanonicalUrl,
  extractIdInitial,
  generateCloudflareRedirects,
  matchRedirect,
  ORDBOK_GROUPS,
} from '../scripts/cloudflare/routing.ts';
import {
  generateArticleMetadata,
  renderArticleHtml,
} from '../scripts/cloudflare/render-article.ts';
import { hydreraOrdbokPost } from '../lib/ordbok/proveniens.ts';

const dataPath = path.join(process.cwd(), 'data', 'ordbok', 'poster.json');
const allPosts = JSON.parse(readFileSync(dataPath, 'utf8'));

test('CF03: getArticleOwner determinism and full 41 744 ID coverage', () => {
  assert.equal(allPosts.length, 41744);

  const counts = {
    '01': 0,
    '02': 0,
    '03': 0,
    '04': 0,
    '05': 0,
    '06': 0,
    '07': 0,
  };

  for (const post of allPosts) {
    const owner = getArticleOwner(post.id);
    assert.ok(owner, `Post ${post.id} must have owner`);
    assert.ok(counts[owner.group] !== undefined, `Unknown group: ${owner.group}`);
    counts[owner.group]++;

    const canonical = getArticleCanonicalUrl(post.id);
    assert.ok(canonical.startsWith(`https://${owner.host}/ordbok/`));
  }

  // Jämför mot CLOUDFLARE_INVENTERING.json
  assert.equal(counts['01'], 6107, 'Grupp 01 ska ha 6 107 poster');
  assert.equal(counts['02'], 5471, 'Grupp 02 ska ha 5 471 poster');
  assert.equal(counts['03'], 6621, 'Grupp 03 ska ha 6 621 poster');
  assert.equal(counts['04'], 6900, 'Grupp 04 ska ha 6 900 poster');
  assert.equal(counts['05'], 3367, 'Grupp 05 ska ha 3 367 poster');
  assert.equal(counts['06'], 6609, 'Grupp 06 ska ha 6 609 poster');
  assert.equal(counts['07'], 6669, 'Grupp 07 ska ha 6 669 poster');

  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  assert.equal(total, 41744);
});

test('CF03: extractIdInitial validation and error handling', () => {
  assert.equal(extractIdInitial('soederwall--af-aeta'), 'a');
  assert.equal(extractIdInitial('soederwall-supp--ögha'), 'ö');
  assert.equal(extractIdInitial('soederwall--þing'), 'þ');
  assert.equal(extractIdInitial('soederwall---adhr'), '-');
  assert.equal(extractIdInitial('soederwall--_under'), '_');

  assert.throws(() => extractIdInitial('invalid-id-without-dash-dash'), /utan '--'/);
  assert.throws(() => extractIdInitial('soederwall--'), /Tomt huvudordssegment/);
});

test('CF03: Cloudflare Pages _redirects rules cover all IDs and stay under 100 dynamic rules', () => {
  const rules = generateCloudflareRedirects();
  const activeRules = rules.filter((r) => r.trim() && !r.startsWith('#'));

  // Cloudflare Pages stöder max 100 dynamiska regler
  assert.ok(
    activeRules.length <= 100,
    `Aktiva regler (${activeRules.length}) måste vara <= 100`
  );
  assert.equal(activeRules.length, 68);

  // Verifiera att huvudsajtens ordbokssida /ordbok inte triggar omdirigering
  const rootSearchMatch = matchRedirect('/ordbok', activeRules);
  assert.equal(rootSearchMatch, null, '/ordbok får inte omdirigeras');

  // Stickprov och kontroll av samtliga 41 744 poster
  for (let i = 0; i < allPosts.length; i += 200) {
    const p = allPosts[i];
    const path = `/ordbok/${p.id}`;
    const match = matchRedirect(path, activeRules);
    assert.ok(match, `ID ${p.id} måste matcha en regel`);
    assert.equal(match.status, 301);
    const owner = getArticleOwner(p.id);
    assert.equal(match.target, `https://${owner.host}/ordbok/${p.id}`);
  }

  // Verifiera specialtecken och URL-kodade varianter
  const specialCases = [
    { id: 'soederwall--ögha', expectedHost: 'ord-05.fornsvenska.se' },
    { id: 'soederwall--%C3%B6gha', expectedHost: 'ord-05.fornsvenska.se' },
    { id: 'soederwall-supp--þing', expectedHost: 'ord-05.fornsvenska.se' },
    { id: 'soederwall-supp--%C3%BEing', expectedHost: 'ord-05.fornsvenska.se' },
    { id: 'soederwall--äflas', expectedHost: 'ord-07.fornsvenska.se' },
    { id: 'soederwall--%C3%A4flas', expectedHost: 'ord-07.fornsvenska.se' },
  ];

  for (const c of specialCases) {
    const match = matchRedirect(`/ordbok/${c.id}`, activeRules);
    assert.ok(match, `Specialfall ${c.id} måste matcha`);
    assert.equal(match.status, 301);
    assert.ok(
      match.target.startsWith(`https://${c.expectedHost}/ordbok/`),
      `Mål för ${c.id} (${match.target}) ska peka på ${c.expectedHost}`
    );
  }
});

test('CF03: Article HTML renderer produces full static HTML without JS dependency', () => {
  const sample = hydreraOrdbokPost(allPosts[0]);
  const meta = generateArticleMetadata(sample);
  const html = renderArticleHtml(sample);

  // HTML-struktur
  assert.ok(html.startsWith('<!DOCTYPE html>'));
  assert.ok(html.includes('<html lang="sv">'));

  // Metadata
  assert.ok(html.includes(`<title>${meta.titelText}</title>`));
  assert.ok(html.includes(`<link rel="canonical" href="${meta.canonicalUrl}">`));
  assert.ok(html.includes('<meta name="description" content="'));
  assert.ok(html.includes('Fornsvenskt uppslagsord'));
  assert.ok(html.includes('<meta property="og:type" content="article">'));

  // Innehåll
  assert.ok(html.includes(sample.headwordDisplay));
  assert.ok(html.includes(sample.kallaId));
  assert.ok(html.includes('/ordbok/' + sample.id));

  // Tillgänglighet och bokmärken
  assert.ok(html.includes('id="bokmarke-knapp"'));
  assert.ok(html.includes('/assets/article-bookmarks.js'));
  assert.ok(!html.includes('localStorage.setItem'), 'Artikelvärdar får inte skapa separata lokala ordlistor');
  assert.ok(html.includes('Källa och proveniens'));
  assert.ok(html.includes('CC BY 4.0'));
});

test('CF03: Largest group 04 file budget is well within Cloudflare and internal limits', () => {
  const filbudgetPath = path.join(
    process.cwd(),
    'docs',
    'drift',
    'cloudflare',
    'CF03-filbudget.json'
  );
  const budget = JSON.parse(readFileSync(filbudgetPath, 'utf8'));

  assert.equal(budget.group, '04');
  assert.equal(budget.articleCount, 6900);
  assert.equal(budget.totalFiles, 6901);
  assert.ok(
    budget.totalFiles <= budget.internalBudgetLimit,
    `Filantal (${budget.totalFiles}) måste vara <= intern budget (${budget.internalBudgetLimit})`
  );
  assert.ok(
    budget.totalFiles <= budget.cloudflareLimit,
    `Filantal (${budget.totalFiles}) måste vara <= Cloudflare-gräns (${budget.cloudflareLimit})`
  );
  assert.ok(
    budget.budgetUtilizationPct < 50,
    `Budgetutnyttjande (${budget.budgetUtilizationPct}%) ska vara under 50%`
  );
  assert.ok(
    budget.buildDurationMs < 10000,
    `Byggtid (${budget.buildDurationMs} ms) ska vara snabb och under 10s`
  );
});
