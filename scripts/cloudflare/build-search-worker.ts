/**
 * Byggskript för att kompilera och minifiera sökmotorns Web Worker (CF08).
 *
 * Kompilerar `scripts/cloudflare/search-worker-source.ts` till `public/ordbok/search-worker.js`.
 */

import path from "node:path";
import fs from "node:fs/promises";
import zlib from "node:zlib";
import esbuild from "esbuild";

const ROOT = process.cwd();
const ENTRY = path.join(ROOT, "scripts", "cloudflare", "search-worker-source.ts");
const OUT_FILE = path.join(ROOT, "public", "ordbok", "search-worker.js");

export async function buildSearchWorker(): Promise<{
  rawBytes: number;
  gzipBytes: number;
  durationMs: number;
}> {
  const startTime = Date.now();
  console.log(`[buildSearchWorker] Bygger Web Worker från ${ENTRY}...`);

  await esbuild.build({
    entryPoints: [ENTRY],
    outfile: OUT_FILE,
    bundle: true,
    minify: true,
    target: "es2022",
    format: "iife",
    platform: "browser",
    sourcemap: false,
  });

  const content = await fs.readFile(OUT_FILE);
  const gz = zlib.gzipSync(content);
  const durationMs = Date.now() - startTime;

  console.log(
    `[buildSearchWorker] Skapade ${OUT_FILE}: ${(content.length / 1024).toFixed(1)} KB rå, ${(gz.length / 1024).toFixed(1)} KB gzip på ${durationMs} ms`
  );

  return {
    rawBytes: content.length,
    gzipBytes: gz.length,
    durationMs,
  };
}

if (process.argv[1] && process.argv[1].endsWith("build-search-worker.ts")) {
  buildSearchWorker().catch((err) => {
    console.error("Fel vid byggning av worker:", err);
    process.exit(1);
  });
}
