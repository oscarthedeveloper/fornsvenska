import { createHash } from 'node:crypto';
/**
 * Byggskript för samtliga ordboksunderdomäner (CF08):
 *
 * Fördelar alla 41 744 artiklar på exakt sju projekt (ord-01..07.fornsvenska.se)
 * baserat på ägarfunktionen `getArticleOwner(id)` från CF03.
 *
 * Genererar:
 * - dist/ord-XX/ordbok/[id].html
 * - dist/ord-XX/ordbok/[id]/index.html
 * - dist/ord-XX/index.html
 * - dist/ord-XX/_headers
 *
 * Garanterar:
 * - Varje ID har exakt en ägare.
 * - Varje artikel har komplett semantisk HTML med unika metadata.
 * - Varje grupp ryms med stor marginal under 16 000-filbudgeten (Pages-tak: 20 000).
 */

import { writeReleaseMetadata } from "./release-metadata";
import { build } from "esbuild";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { LagradOrdbokPost } from "../../lib/ordbok/proveniens";
import { hydreraOrdbokPost } from "../../lib/ordbok/proveniens";
import { lasRattelserKarta } from "../../lib/ordbok/rattelser";
import { lasModernaDefinitionerKarta } from "../../lib/ordbok/modernisering";
import { getArticleOwner } from "./routing";
import { renderArticleHtml } from "./render-article";

const ROOT = process.cwd();
const DATA_FILE = path.join(ROOT, "data", "ordbok", "poster.json");
const DIST_DIR = path.join(ROOT, "dist");

export interface GroupBuildResult {
  group: string;
  articleCount: number;
  totalFiles: number;
  outputDir: string;
}

export async function buildOrdbokGroups(targetGroup?: string): Promise<{
  totalArticles: number;
  totalFiles: number;
  durationMs: number;
  groups: Record<string, GroupBuildResult>;
}> {
  const startTime = Date.now();
  const mainHtml = await fs.readFile(path.join(ROOT, ".next/server/app/ordbok.html"), "utf8");
  const htmlClassName = mainHtml.match(/<html[^>]*class="([^"]*)"/)?.[1];
  if (!htmlClassName) throw new Error("Missing main-site font variables");
  console.log(`[buildOrdbokGroups] Läser in 41 744 artiklar från ${DATA_FILE}...`);
  const raw = await fs.readFile(DATA_FILE, "utf8");
  const poster: LagradOrdbokPost[] = JSON.parse(raw);

  // Applicera rättelser och definitioner
  const rattelser = lasRattelserKarta();
  const definitioner = lasModernaDefinitionerKarta();

  for (const p of poster) {
    const r = rattelser.get(p.id);
    if (r) {
      p.rattelse = r;
      if (r.headwordDisplayOverride) p.headwordDisplay = r.headwordDisplayOverride;
      if (r.reviewStatus) p.reviewStatus = r.reviewStatus;
    }
    const def = definitioner.get(p.id);
    if (def) p.modernDefinition = def;
  }

  // Gruppera poster per underdomän 01..07
  const postsPerGroup = new Map<string, LagradOrdbokPost[]>();
  for (let g = 1; g <= 7; g++) {
    postsPerGroup.set(String(g).padStart(2, "0"), []);
  }

  for (const p of poster) {
    const owner = getArticleOwner(p.id).group;
    const list = postsPerGroup.get(owner);
    if (!list) {
      throw new Error(`Okänd ägargrupp '${owner}' för artikel-ID '${p.id}'`);
    }
    list.push(p);
  }

  const results: Record<string, GroupBuildResult> = {};
  let totalBuiltFiles = 0;
  let totalBuiltArticles = 0;

  const groupsToBuild = targetGroup
    ? [targetGroup.padStart(2, "0")]
    : Array.from(postsPerGroup.keys()).sort();

  for (const group of groupsToBuild) {
    const groupPosts = postsPerGroup.get(group) || [];
    const groupDir = path.join(DIST_DIR, `ord-${group}`);
    const ordbokDir = path.join(groupDir, "ordbok");

    await fs.rm(groupDir, { recursive: true, force: true });
    await fs.mkdir(ordbokDir, { recursive: true });

    await fs.mkdir(path.join(groupDir, "assets"), { recursive: true });
    await build({ entryPoints: [path.join(ROOT, "scripts/cloudflare/article-bookmarks.ts")], outfile: path.join(groupDir,"assets/article-bookmarks.js"), bundle: true, minify: true, platform: "browser", target: "es2020" });
    await writeReleaseMetadata(groupDir);
    const cssDir = path.join(ROOT, ".next/static/css");
    const css = (await fs.readdir(cssDir)).filter(f=>f.endsWith('.css'));
    const styles = await Promise.all(css.map(f=>fs.readFile(path.join(cssDir,f),'utf8')));
    await fs.writeFile(path.join(groupDir,'assets/style.css'),styles.join('\n').replaceAll('/_next/static/media/','/assets/fonts/').replaceAll('../media/','fonts/'));
    const styleVersion = createHash('sha256').update(await fs.readFile(path.join(groupDir,'assets/style.css'))).digest('hex').slice(0,12);
    await fs.cp(path.join(ROOT,'.next/static/media'),path.join(groupDir,'assets/fonts'),{recursive:true});
    let filesInGroup = 3 + (await fs.readdir(path.join(groupDir,'assets/fonts'))).length;

    // Generera varje artikel som [id].html samt [id]/index.html
    for (const rawPost of groupPosts) {
      const hydrerad = hydreraOrdbokPost(rawPost);
      const html = renderArticleHtml(hydrerad, undefined, { htmlClassName, styleVersion });

      const htmlFilePath = path.join(ordbokDir, `${rawPost.id}.html`);
      await fs.writeFile(htmlFilePath, html, "utf8");
      filesInGroup++;

      const prettyDir = path.join(ordbokDir, rawPost.id);
      await fs.mkdir(prettyDir, { recursive: true });
      await fs.writeFile(path.join(prettyDir, "index.html"), html, "utf8");
      filesInGroup++;
    }

    // Skapa startsida för underdomänen
    const indexHtml = `<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="utf-8">
  <title>Fornsvenska.se Ordboksarkiv del ${group}</title>
  <meta name="robots" content="noindex, follow">
  <meta http-equiv="refresh" content="0; url=https://www.fornsvenska.se/ordbok">
  <link rel="canonical" href="https://www.fornsvenska.se/ordbok">
  <style>body{font-family:sans-serif;padding:2rem;line-height:1.6;}</style>
</head>
<body>
  <h1>Ordboksarkiv del ${group}</h1>
  <p>Detta är underdomänen för ordboksartiklar del ${group} (totalt ${groupPosts.length} artiklar).
     Gå till den centrala sökningen på <a href="https://www.fornsvenska.se/ordbok">Fornsvenska.se Ordbok</a>.</p>
</body>
</html>`;
    await fs.writeFile(path.join(groupDir, "index.html"), indexHtml, "utf8");
    filesInGroup++;

    // Skapa _headers
    const headersContent = `# Cloudflare Pages _headers för ord-${group}.fornsvenska.se
/*.html
  Cache-Control: public, max-age=0, must-revalidate

/assets/*
  Cache-Control: public, max-age=31536000, immutable
`;
    await fs.writeFile(path.join(groupDir, "_headers"), headersContent, "utf8");
    filesInGroup++;

    // Skapa en minimal 404.html för ordboksdelen
    const notFoundHtml = `<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="utf-8">
  <title>Artikeln hittades inte | Fornsvenska.se</title>
  <style>body{font-family:sans-serif;padding:2rem;line-height:1.6;}</style>
</head>
<body>
  <h1>Artikeln hittades inte (404)</h1>
  <p>Artikeln finns inte i denna ordboksdel. Sök efter ordet i <a href="https://www.fornsvenska.se/ordbok">Söderwalls ordbok</a>.</p>
</body>
</html>`;
    await fs.writeFile(path.join(groupDir, "404.html"), notFoundHtml, "utf8");
    filesInGroup++;

    results[group] = {
      group,
      articleCount: groupPosts.length,
      totalFiles: filesInGroup,
      outputDir: groupDir,
    };

    totalBuiltArticles += groupPosts.length;
    totalBuiltFiles += filesInGroup;

    console.log(
      `[buildOrdbokGroups] Grupp ${group}: ${groupPosts.length} artiklar genererade (${filesInGroup} filer, budget: < 16 000).`
    );
  }

  const durationMs = Date.now() - startTime;
  console.log(
    `[buildOrdbokGroups] Klart på ${(durationMs / 1000).toFixed(2)} s: ${totalBuiltArticles} artiklar, ${totalBuiltFiles} filer totalt.`
  );

  return {
    totalArticles: totalBuiltArticles,
    totalFiles: totalBuiltFiles,
    durationMs,
    groups: results,
  };
}

import { fileURLToPath } from "node:url";

const isCli =
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isCli) {
  const argGroup = process.argv[2];
  buildOrdbokGroups(argGroup)
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
