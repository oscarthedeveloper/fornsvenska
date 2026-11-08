/**
 * Byggskript för ordboksindex (CF08):
 *
 * Genererar:
 * 1. public/ordbok/index-headwords.json (kompakt uppslagsordsindex, 0.58 MB gzip)
 * 2. public/ordbok/index-fulltext.json (on-demand fulltextsökindex för Web Worker)
 *
 * Placerar även kopior i dist/www/ordbok/ om den mappen existerar.
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { promisify } from "node:util";
import type { CompactTuple, CompactOrdbokIndex } from "../../lib/ordbok/clientEngine";
import type { LagradOrdbokPost } from "../../lib/ordbok/proveniens";
import { byggPlainText } from "../../lib/ordbok/proveniens";
import { lasRattelserKarta } from "../../lib/ordbok/rattelser";
import { lasModernaDefinitionerKarta } from "../../lib/ordbok/modernisering";
import { SODERWALL_ALFABET } from "../../lib/ordbok/normalisering";
import type { OrdbokBokstavsStatistik } from "../../lib/ordbok/typer";

const gzip = promisify(zlib.gzip);
const ROOT = process.cwd();
const DATA_FILE = path.join(ROOT, "data", "ordbok", "poster.json");
const PUBLIC_ORDBOK_DIR = path.join(ROOT, "public", "ordbok");
const DIST_ORDBOK_DIR = path.join(ROOT, "dist", "www", "ordbok");

function precomputeSnippet(p: LagradOrdbokPost): string {
  if (p.senses && p.senses.length > 0) {
    const s = p.senses
      .map((sens) => [sens.etikett, sens.gram, sens.writtenForm, sens.text].filter(Boolean).join(" "))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    if (s.length <= 150) return s;
    return `${s.slice(0, 147).trim()}…`;
  }

  if (p.wordFormRows && p.wordFormRows.length > 0) {
    const wf = p.wordFormRows
      .map((r) => (r.orth ? `${r.orth} (${r.val.trim()})` : r.val.trim()))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    if (wf.length <= 150) return wf;
    return `${wf.slice(0, 147).trim()}…`;
  }

  return "";
}

export async function buildOrdbokIndexes(): Promise<{
  totalCount: number;
  headwordsRawBytes: number;
  headwordsGzipBytes: number;
  fulltextRawBytes: number;
  fulltextGzipBytes: number;
}> {
  console.log("[buildOrdbokIndexes] Läser ordboksposter från data/ordbok/poster.json...");
  const rawJson = await fs.readFile(DATA_FILE, "utf8");
  const poster: LagradOrdbokPost[] = JSON.parse(rawJson);

  // Applicera rättelser och moderna definitioner
  const rattelserKarta = lasRattelserKarta();
  const definitionerKarta = lasModernaDefinitionerKarta();

  for (const p of poster) {
    const r = rattelserKarta.get(p.id);
    if (r) {
      p.rattelse = r;
      if (r.headwordDisplayOverride) p.headwordDisplay = r.headwordDisplayOverride;
      if (r.reviewStatus) p.reviewStatus = r.reviewStatus;
    }

    const def = definitionerKarta.get(p.id);
    if (def) {
      p.modernDefinition = def;
    }
  }

  // Sortera efter sortKey med samma ordning som servern
  poster.sort((a, b) => {
    const ka = a.sortKey.replace(/:/g, " ");
    const kb = b.sortKey.replace(/:/g, " ");
    return ka < kb ? -1 : ka > kb ? 1 : 0;
  });

  // Beräkna bokstavsstatistik
  const countsPerLetter = new Map<string, { total: number; soed: number; supp: number }>();
  for (const bokstav of SODERWALL_ALFABET) {
    countsPerLetter.set(bokstav, { total: 0, soed: 0, supp: 0 });
  }

  const entries: CompactTuple[] = [];
  const fulltextArticles: Record<string, string> = {};

  for (const p of poster) {
    const c = countsPerLetter.get(p.letterSection);
    if (c) {
      c.total++;
      if (p.sourceDataset === "soederwall") c.soed++;
      else c.supp++;
    }

    let modShort: [string, string[]] | undefined;
    if (p.modernDefinition) {
      modShort = [
        p.modernDefinition.kortForklaring || "",
        p.modernDefinition.modernGlos && p.modernDefinition.modernGlos.length > 0 ? p.modernDefinition.modernGlos : [],
      ];
    }

    const tuple: CompactTuple = [
      p.id,
      p.headwordDisplay,
      p.sortKey,
      p.sourceDataset === "soederwall" ? 1 : 2,
      p.letterSection,
      p.homonymNumber || 0,
      p.partOfSpeech || [],
      p.variantsOriginal || [],
    ];
    if (p.gramOriginal) tuple[8] = p.gramOriginal;
    if (modShort) tuple[9] = modShort;
    let flags = 0;
    if (p.rattelse) flags |= 1;
    if (!p.senses || p.senses.length === 0) flags |= 2;
    if (flags > 0) tuple[10] = flags;

    entries.push(tuple);

    const plain = byggPlainText(p);
    fulltextArticles[p.id] = plain.toLowerCase();
  }

  const bokstavsStatistik: OrdbokBokstavsStatistik[] = SODERWALL_ALFABET.map((bokstav) => {
    const c = countsPerLetter.get(bokstav)!;
    return {
      letter: bokstav,
      label: bokstav === "Þ" ? "Þ (TH)" : bokstav,
      total: c.total,
      mainCount: c.soed,
      suppCount: c.supp,
    };
  });

  const version = `release-2026-10-30`;

  const headwordsIndex: CompactOrdbokIndex = {
    version,
    totalCount: entries.length,
    bokstavsStatistik,
    entries,
  };

  const fulltextIndex = {
    version,
    totalCount: Object.keys(fulltextArticles).length,
    articles: fulltextArticles,
  };

  const headwordsJson = JSON.stringify(headwordsIndex);
  const fulltextJson = JSON.stringify(fulltextIndex);

  const headwordsGzip = await gzip(Buffer.from(headwordsJson));
  const fulltextGzip = await gzip(Buffer.from(fulltextJson));

  await fs.mkdir(PUBLIC_ORDBOK_DIR, { recursive: true });
  await fs.writeFile(path.join(PUBLIC_ORDBOK_DIR, "index-headwords.json"), headwordsJson, "utf8");
  await fs.writeFile(path.join(PUBLIC_ORDBOK_DIR, "index-fulltext.json"), fulltextJson, "utf8");

  // Skriv även till dist/www/ordbok om katalogen finns
  try {
    await fs.mkdir(DIST_ORDBOK_DIR, { recursive: true });
    await fs.writeFile(path.join(DIST_ORDBOK_DIR, "index-headwords.json"), headwordsJson, "utf8");
    await fs.writeFile(path.join(DIST_ORDBOK_DIR, "index-fulltext.json"), fulltextJson, "utf8");
  } catch {
    // Ignorera om dist/www inte är byggd än
  }

  console.log(`[buildOrdbokIndexes] Skapade sökindex för ${entries.length} poster:`);
  console.log(
    ` - index-headwords.json: ${(headwordsJson.length / 1024 / 1024).toFixed(2)} MB rå, ${(
      headwordsGzip.length / 1024 / 1024
    ).toFixed(2)} MB gzip (${(headwordsGzip.length / 1024).toFixed(1)} KB)`
  );
  console.log(
    ` - index-fulltext.json: ${(fulltextJson.length / 1024 / 1024).toFixed(2)} MB rå, ${(
      fulltextGzip.length / 1024 / 1024
    ).toFixed(2)} MB gzip`
  );

  return {
    totalCount: entries.length,
    headwordsRawBytes: headwordsJson.length,
    headwordsGzipBytes: headwordsGzip.length,
    fulltextRawBytes: fulltextJson.length,
    fulltextGzipBytes: fulltextGzip.length,
  };
}

import { fileURLToPath } from "node:url";

const isCli =
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isCli) {
  buildOrdbokIndexes()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
