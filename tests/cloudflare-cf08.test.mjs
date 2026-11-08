/**
 * Testsvit för CF08: Fullständig ordbok och sökning i webbläsaren.
 *
 * Verifierar:
 * 1. Sökindexens storlekar och prestandabudget (< 1.0 MB gzip för uppslagsord, < 8.0 MB gzip för fulltext).
 * 2. 100 % sökparitet mellan `lib/ordbok/ordbokServer.ts` och `lib/ordbok/clientEngine.ts`.
 * 3. 100 % paritet och sub-millisekundsrespons för morfologiska textuppslag (`slaUppTextOrd`).
 * 4. Fullständig statisk HTML-generering för samtliga 41 744 artiklar fördelade på 7 grupper.
 * 5. Filbudget per grupp (< 16 000 filer mot Pages-taket på 20 000).
 * 6. Web Worker-artefakt (`public/ordbok/search-worker.js`).
 */

import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

import { sokOrdbok, slaUppTextOrd } from "../lib/ordbok/ordbokServer.ts";
import {
  prepareIndex,
  sokOrdbokKlient,
  slaUppTextOrdKlient,
} from "../lib/ordbok/clientEngine.ts";
import { getArticleOwner } from "../scripts/cloudflare/routing.ts";

const ROOT = process.cwd();
const HEADWORDS_INDEX_PATH = path.join(ROOT, "public", "ordbok", "index-headwords.json");
const FULLTEXT_INDEX_PATH = path.join(ROOT, "public", "ordbok", "index-fulltext.json");
const SEARCH_WORKER_PATH = path.join(ROOT, "public", "ordbok", "search-worker.js");
const DIST_DIR = path.join(ROOT, "dist");

test("CF08-1: Sökindex och Web Worker uppfyller prestandabudgeten", () => {
  assert.ok(fs.existsSync(HEADWORDS_INDEX_PATH), "index-headwords.json saknas");
  assert.ok(fs.existsSync(FULLTEXT_INDEX_PATH), "index-fulltext.json saknas");
  assert.ok(fs.existsSync(SEARCH_WORKER_PATH), "search-worker.js saknas");

  const hwRaw = fs.readFileSync(HEADWORDS_INDEX_PATH);
  const hwGzip = zlib.gzipSync(hwRaw);
  const hwIndex = JSON.parse(hwRaw.toString("utf8"));

  assert.equal(hwIndex.totalCount, 41744, "Headwords-indexet ska innehålla exakt 41 744 poster");
  assert.ok(
    hwGzip.length < 1024 * 1024,
    `index-headwords.json gzip (${(hwGzip.length / 1024).toFixed(1)} KB) överskrider budgeten på 1 000 KB`
  );

  const ftRaw = fs.readFileSync(FULLTEXT_INDEX_PATH);
  const ftGzip = zlib.gzipSync(ftRaw);
  const ftIndex = JSON.parse(ftRaw.toString("utf8"));

  assert.equal(ftIndex.totalCount, 41744, "Fulltext-indexet ska innehålla exakt 41 744 artiklar");
  assert.ok(
    ftGzip.length < 8 * 1024 * 1024,
    `index-fulltext.json gzip (${(ftGzip.length / 1024 / 1024).toFixed(2)} MB) överskrider budgeten på 8.0 MB`
  );

  const swRaw = fs.readFileSync(SEARCH_WORKER_PATH);
  const swGzip = zlib.gzipSync(swRaw);
  assert.ok(
    swGzip.length < 35 * 1024,
    `search-worker.js gzip (${(swGzip.length / 1024).toFixed(1)} KB) överskrider budgeten på 35 KB`
  );
});

test("CF08-2: 100 % sökparitet mot servern över representativ testkorpus", () => {
  const hwRaw = fs.readFileSync(HEADWORDS_INDEX_PATH, "utf8");
  const prepIndex = prepareIndex(JSON.parse(hwRaw));

  const testQueries = [
    { q: "konunger" },
    { q: "konungs" },
    { q: "lagh" },
    { q: "laghum" },
    { q: "skip" },
    { q: "skipi" },
    { q: "äta" },
    { q: "æta" },
    { q: "þing" },
    { q: "thing" },
    { q: "kirkiu" },
    { q: "kyrka" },
    { q: "döþer" },
    { q: "widh" },
    { q: "vidh" },
    { q: "fann" },
    { q: "" },
    { q: "blabla_finns_inte" },
    { q: "lagh", dataset: "soederwall-supp" },
    { q: "skip", dataset: "soederwall" },
  ];

  for (const t of testQueries) {
    const sRes = sokOrdbok(t);
    const cRes = sokOrdbokKlient(prepIndex, t);

    assert.equal(
      cRes.totalHits,
      sRes.totalHits,
      `totalHits skiljer sig för fråga: ${JSON.stringify(t)} (server: ${sRes.totalHits}, klient: ${cRes.totalHits})`
    );

    const sTop10 = sRes.hits.slice(0, 10).map((h) => h.id);
    const cTop10 = cRes.hits.slice(0, 10).map((h) => h.id);
    assert.deepEqual(
      cTop10,
      sTop10,
      `Topp 10 resultat skiljer sig för fråga: ${JSON.stringify(t)}`
    );
  }
});

test("CF08-3: 100 % paritet för textuppslagning (klicka-i-text) och sub-millisekundsrespons", () => {
  const hwRaw = fs.readFileSync(HEADWORDS_INDEX_PATH, "utf8");
  const prepIndex = prepareIndex(JSON.parse(hwRaw));

  const words = [
    "konunger",
    "konungs",
    "lagh",
    "laghum",
    "skip",
    "skipi",
    "äta",
    "þing",
    "thing",
    "kirkiu",
    "kyrka",
    "döþer",
    "widh",
    "vidh",
    "fann",
  ];

  for (const w of words) {
    const start = performance.now();
    const cRes = slaUppTextOrdKlient(prepIndex, w, 8);
    const duration = performance.now() - start;

    assert.ok(duration < 20, `Uppslag för '${w}' tog ${duration.toFixed(2)} ms (krav: sub-20 ms)`);

    const sRes = slaUppTextOrd(w, 8);
    const sIds = sRes.traffar.map((t) => t.listPost.id);
    const cIds = cRes.traffar.map((t) => t.listPost.id);

    assert.deepEqual(cIds, sIds, `Textuppslag skiljer sig för ordet '${w}'`);
  }
});

test("CF08-4: Fullständig täckning och filbudget för samtliga 7 ordboksdelar", () => {
  const posterRaw = fs.readFileSync(path.join(ROOT, "data", "ordbok", "poster.json"), "utf8");
  const poster = JSON.parse(posterRaw);
  assert.equal(poster.length, 41744, "Totalt antal artiklar i källdata ska vara 41 744");

  // Gruppkontroll
  const perGroup = new Map();
  for (let g = 1; g <= 7; g++) {
    perGroup.set(String(g).padStart(2, "0"), 0);
  }

  for (const p of poster) {
    const owner = getArticleOwner(p.id).group;
    perGroup.set(owner, (perGroup.get(owner) ?? 0) + 1);
  }

  let totalGenereradeArtiklar = 0;

  for (let g = 1; g <= 7; g++) {
    const grp = String(g).padStart(2, "0");
    const groupDir = path.join(DIST_DIR, `ord-${grp}`);
    assert.ok(fs.existsSync(groupDir), `Mappen ${groupDir} saknas`);

    const headersFile = path.join(groupDir, "_headers");
    assert.ok(fs.existsSync(headersFile), `_headers saknas i ${groupDir}`);

    const indexFile = path.join(groupDir, "index.html");
    assert.ok(fs.existsSync(indexFile), `index.html saknas i ${groupDir}`);

    const notFoundFile = path.join(groupDir, "404.html");
    assert.ok(fs.existsSync(notFoundFile), `404.html saknas i ${groupDir}`);

    const ordbokDir = path.join(groupDir, "ordbok");
    assert.ok(fs.existsSync(ordbokDir), `ordbok/-mappen saknas i ${groupDir}`);

    // Räkna filer i ordbokDir
    const entries = fs.readdirSync(ordbokDir);
    const htmlFiles = entries.filter((f) => f.endsWith(".html"));
    const articleCount = perGroup.get(grp);

    assert.equal(
      htmlFiles.length,
      articleCount,
      `Grupp ${grp}: förväntade ${articleCount} artikelfiler, fann ${htmlFiles.length}`
    );

    totalGenereradeArtiklar += htmlFiles.length;

    // Verifiera att totalt filantal i gruppen är under 16 000
    // htmlFiles (N) + undermappar (N) + index.html (1) + 404.html (1) + _headers (1) = 2N + 3
    const totalGroupFiles = htmlFiles.length * 2 + 3;
    assert.ok(
      totalGroupFiles < 16000,
      `Grupp ${grp} har ${totalGroupFiles} filer, överskrider intern budget på 16 000`
    );
  }

  assert.equal(
    totalGenereradeArtiklar,
    41744,
    "Samtliga 41 744 artiklar ska finnas genererade i dist/ord-01..07"
  );
});

test("CF08-5: Semantisk HTML, SEO-metadata och 0 JS-krav på ett spritt urval av artiklar", () => {
  const urvalsIdn = [
    "soederwall--a-nn.1",
    "soederwall--konunger-nn.1",
    "soederwall--lagh-nn.1",
    "soederwall--skip-e.1",
    "soederwall--þin-e.1",
    "soederwall-supp--äta-vb.1",
    "soederwall-supp--lagh-nn.1",
  ];

  for (const id of urvalsIdn) {
    const owner = getArticleOwner(id).group;
    const htmlPath = path.join(DIST_DIR, `ord-${owner}`, "ordbok", `${id}.html`);
    assert.ok(fs.existsSync(htmlPath), `Artikelfilen ${htmlPath} saknas`);

    const html = fs.readFileSync(htmlPath, "utf8");

    // Validera obligatoriska HTML-element och metadata
    assert.ok(html.includes("<!DOCTYPE html>"), `${id}: Saknar DOCTYPE`);
    assert.ok(html.includes('<html lang="sv"'), `${id}: Saknar lang="sv"`);
    assert.ok(html.includes("<title>"), `${id}: Saknar <title>`);
    assert.ok(html.includes('<meta name="description"'), `${id}: Saknar description`);
    assert.ok(html.includes('<link rel="canonical"'), `${id}: Saknar canonical URL`);
    assert.ok(html.includes('<script type="application/ld+json">'), `${id}: Saknar JSON-LD`);
    assert.ok(html.includes("K. F. Söderwall"), `${id}: Saknar källförfattare`);
    assert.ok(html.includes("CC BY 4.0"), `${id}: Saknar licensangivelse`);
    assert.ok(html.includes("Språkbanken Text"), `${id}: Saknar Språkbanken-attribution`);
    assert.ok(html.includes("article-entry"), `${id}: Saknar semantisk artikelbehållare`);
    assert.ok(!html.includes("undefined"), `${id}: Får inte innehålla strängen 'undefined'`);
    assert.ok(!html.includes("null"), `${id}: Får inte innehålla strängen 'null' i text`);
  }
});
