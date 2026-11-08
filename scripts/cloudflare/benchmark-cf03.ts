/**
 * CF03: Mätning och filbudget för största ordboksgruppen (Grupp 04)
 *
 * Exporterar samtliga 6 900 artiklar i grupp 04 till disk och mäter:
 * - Antal filer (HTML, tillgångar)
 * - Filstorlekar (total, medel, min, max, gzip)
 * - Byggtid och minnesåtgång
 * - Jämförelse mot 16 000 (intern säkerhetsgräns) och 20 000 (Pages-gräns)
 */

import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { gzipSync } from 'node:zlib';
import { hydreraOrdbokPost, type LagradOrdbokPost } from '../../lib/ordbok/proveniens';
import { renderArticleHtml } from './render-article';
import { getArticleOwner, ORDBOK_GROUPS } from './routing';

export interface BenchmarkResult {
  date: string;
  group: string;
  host: string;
  articleCount: number;
  exportedHtmlFiles: number;
  sharedAssetFiles: number;
  totalFiles: number;
  internalBudgetLimit: number;
  cloudflareLimit: number;
  budgetUtilizationPct: number;
  cloudflareUtilizationPct: number;
  totalBytes: number;
  totalGzipBytes: number;
  averageHtmlBytes: number;
  medianHtmlBytes: number;
  minHtmlBytes: number;
  maxHtmlBytes: number;
  buildDurationMs: number;
  peakRssMb: number;
  nextJsHypotheticalFileCount: number;
  nextJsBudgetUtilizationPct: number;
}

export async function runGroupBenchmark(groupKey = '04', outputDir = '/tmp/fornsvenska-cf03-bench'): Promise<BenchmarkResult> {
  const startTime = performance.now();
  const startMemory = process.memoryUsage().rss;

  const dataPath = path.join(process.cwd(), 'data', 'ordbok', 'poster.json');
  const allPosts = JSON.parse(readFileSync(dataPath, 'utf8')) as LagradOrdbokPost[];

  const conf = ORDBOK_GROUPS[groupKey];
  if (!conf) {
    throw new Error(`Okänd grupp: ${groupKey}`);
  }

  // Filtrera poster som tillhör denna grupp
  const groupPosts = allPosts.filter((p) => {
    const owner = getArticleOwner(p.id);
    return owner.group === groupKey;
  });

  if (existsSync(outputDir)) {
    rmSync(outputDir, { recursive: true, force: true });
  }
  mkdirSync(outputDir, { recursive: true });

  const ordbokDir = path.join(outputDir, 'ordbok');
  mkdirSync(ordbokDir, { recursive: true });
  const assetsDir = path.join(outputDir, 'assets');
  mkdirSync(assetsDir, { recursive: true });

  // Skapa en delad CSS-tillgång
  const cssContent = `/* Delad stil för ordboksgrupp ${groupKey} */
:root { --paper: #f7f5ef; --ink: #1a1a18; --panel: #ffffff; --accent: #8b2500; }
body { background: var(--paper); color: var(--ink); font-family: Georgia, serif; line-height: 1.6; }
`;
  writeFileSync(path.join(assetsDir, 'style.css'), cssContent);
  const sharedAssetFiles = 1;

  const htmlSizes: number[] = [];
  let totalBytes = 0;
  let totalGzipBytes = 0;

  for (const post of groupPosts) {
    const hydrerad = hydreraOrdbokPost(post);
    const html = renderArticleHtml(hydrerad);
    const htmlBuffer = Buffer.from(html, 'utf8');

    // Filstruktur: ordbok/<id>.html (eller ordbok/<id>/index.html)
    // Med Cloudflare Pages fungerar /ordbok/<id>.html direkt som ren URL /ordbok/<id>
    const fileName = `${post.id}.html`;
    const filePath = path.join(ordbokDir, fileName);
    writeFileSync(filePath, htmlBuffer);

    const bytes = htmlBuffer.length;
    htmlSizes.push(bytes);
    totalBytes += bytes;

    const gzipped = gzipSync(htmlBuffer);
    totalGzipBytes += gzipped.length;
  }

  const durationMs = Math.round(performance.now() - startTime);
  const peakRss = Math.round((process.memoryUsage().rss) / (1024 * 1024));

  htmlSizes.sort((a, b) => a - b);
  const minHtmlBytes = htmlSizes[0] ?? 0;
  const maxHtmlBytes = htmlSizes[htmlSizes.length - 1] ?? 0;
  const medianHtmlBytes = htmlSizes[Math.floor(htmlSizes.length / 2)] ?? 0;
  const averageHtmlBytes = Math.round(totalBytes / (htmlSizes.length || 1));

  const totalFiles = groupPosts.length + sharedAssetFiles;
  const internalBudgetLimit = 16000;
  const cloudflareLimit = 20000;

  // Next.js exporterar både en HTML-fil och en RSC payload (.txt) per dynamisk sida
  // plus ~50 gemensamma JS-chunks
  const nextJsHypotheticalFileCount = groupPosts.length * 2 + 50;

  return {
    date: new Date().toISOString().slice(0, 10),
    group: groupKey,
    host: conf.host,
    articleCount: groupPosts.length,
    exportedHtmlFiles: groupPosts.length,
    sharedAssetFiles,
    totalFiles,
    internalBudgetLimit,
    cloudflareLimit,
    budgetUtilizationPct: Math.round((totalFiles / internalBudgetLimit) * 1000) / 10,
    cloudflareUtilizationPct: Math.round((totalFiles / cloudflareLimit) * 1000) / 10,
    totalBytes,
    totalGzipBytes,
    averageHtmlBytes,
    medianHtmlBytes,
    minHtmlBytes,
    maxHtmlBytes,
    buildDurationMs: durationMs,
    peakRssMb: peakRss,
    nextJsHypotheticalFileCount,
    nextJsBudgetUtilizationPct: Math.round((nextJsHypotheticalFileCount / internalBudgetLimit) * 1000) / 10,
  };
}

// Kör om anropad direkt
if (process.argv[1]?.endsWith('benchmark-cf03.ts')) {
  runGroupBenchmark().then((res) => {
    console.log(JSON.stringify(res, null, 2));
  }).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
