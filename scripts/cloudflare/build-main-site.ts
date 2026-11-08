/**
 * Byggskript för Cloudflare Pages: Huvudsajt (www.fornsvenska.se)
 *
 * Monterar en fullständig, 100 % statisk distribution till `dist/www`
 * baserad på Next.js statiska prerendering och Fornsvenska.se-snapshoten.
 *
 * - Innehåller startsida, grammatik, textarkiv, resurser, runinskrifter och kontakt.
 * - Egen 404.html för felfall på Cloudflare Pages edge.
 * - 68 prefixregler i `_redirects` för gamla ordbokslänkar till ord-01..07.fornsvenska.se.
 * - Storage Bridge för personliga ordlistans delade data (CF04).
 * - Noll anrop till Supabase eller serverfunktioner för anonyma besökare.
 */

import { writeReleaseMetadata } from "./release-metadata";
import { buildApiWorker } from "./build-api-worker";
import { promises as fs } from "node:fs";
import path from "node:path";
import { GRAMMATIK } from "../../data/grammatik";
import { TEXTER } from "../../data/texter";
import { getAllPaths } from "../../lib/archive";
import { getRunicCorpusState } from "../../lib/runor/server";

const PROJECT_ROOT = process.cwd();
const NEXT_DIR = path.join(PROJECT_ROOT, ".next");
const NEXT_APP_DIR = path.join(NEXT_DIR, "server", "app");
const NEXT_STATIC_DIR = path.join(NEXT_DIR, "static");
const PUBLIC_DIR = path.join(PROJECT_ROOT, "public");
const OUT_DIR = path.join(PROJECT_ROOT, "dist", "www");

interface BuildResult {
  ok: boolean;
  fileCount: number;
  totalBytes: number;
  routesVerified: number;
  warnings: string[];
}

async function copyRecursive(src: string, dest: string) {
  const stat = await fs.stat(src);
  if (stat.isDirectory()) {
    await fs.mkdir(dest, { recursive: true });
    const entries = await fs.readdir(src);
    for (const entry of entries) {
      await copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    await fs.mkdir(path.dirname(dest), { recursive: true });
    await fs.copyFile(src, dest);
  }
}

export async function buildMainSite(): Promise<BuildResult> {
  const startTime = Date.now();
  const warnings: string[] = [];

  // 1. Rensa och förbered målmappen dist/www
  await fs.rm(OUT_DIR, { recursive: true, force: true });
  await fs.mkdir(OUT_DIR, { recursive: true });

  // Kontrollera att .next/server/app finns
  try {
    await fs.access(NEXT_APP_DIR);
  } catch {
    throw new Error(
      "Kunde inte hitta .next/server/app. Kör 'npm run build' först för att sammanställa sidorna."
    );
  }

  // 2. Kopiera Next.js klientresurser (.next/static -> _next/static)
  if (
    await fs
      .access(NEXT_STATIC_DIR)
      .then(() => true)
      .catch(() => false)
  ) {
    await copyRecursive(NEXT_STATIC_DIR, path.join(OUT_DIR, "_next", "static"));
  }

  // 3. Kopiera publika tillgångar (public/ -> dist/www/)
  if (
    await fs
      .access(PUBLIC_DIR)
      .then(() => true)
      .catch(() => false)
  ) {
    const publicFiles = await fs.readdir(PUBLIC_DIR);
    for (const item of publicFiles) {
      if (item === ".DS_Store" || item === "__forms.html") continue;
      await copyRecursive(path.join(PUBLIC_DIR, item), path.join(OUT_DIR, item));
    }
  }

  // 4. Samla och kopiera alla genererade HTML-filer från .next/server/app
  async function harvestHtml(dir: string, relativePrefix = "") {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relPath = path.join(relativePrefix, entry.name);

      if (entry.isDirectory()) {
        // Hoppa över interna Next-mappar eller dynamiska mallar
        if (entry.name.startsWith("[[...") || entry.name.startsWith("[...")) continue;
        await harvestHtml(fullPath, relPath);
      } else if (entry.isFile()) {
        if (entry.name.endsWith(".html")) {
          const content = await fs.readFile(fullPath);

          if (entry.name === "index.html" && relativePrefix === "") {
            // Startsidan
            await fs.writeFile(path.join(OUT_DIR, "index.html"), content);
          } else if (entry.name === "_not-found.html") {
            // 404-sidan för Cloudflare Pages
            await fs.writeFile(path.join(OUT_DIR, "404.html"), content);
            await fs.writeFile(path.join(OUT_DIR, "_not-found.html"), content);
          } else {
            // Undersida (t.ex. grammatik.html eller grammatik/substantiv.html)
            const routeWithoutExt = relPath.replace(/\.html$/, "");

            // Skriv både som <route>.html och <route>/index.html så alla statiska servrar fungerar
            await fs.mkdir(path.join(OUT_DIR, path.dirname(relPath)), { recursive: true });
            await fs.writeFile(path.join(OUT_DIR, relPath), content);

            const prettyDir = path.join(OUT_DIR, routeWithoutExt);
            await fs.mkdir(prettyDir, { recursive: true });
            await fs.writeFile(path.join(prettyDir, "index.html"), content);
          }
        } else if (entry.name.endsWith(".rsc")) {
          const dest = path.join(OUT_DIR, relPath.replace(/\.rsc$/, ".txt"));
          await fs.mkdir(path.dirname(dest), { recursive: true });
          await fs.copyFile(fullPath, dest);
        } else if (entry.name.endsWith(".body")) {
          // Metadata-rutter som robots.txt och sitemap.xml
          const targetName = entry.name.replace(/\.body$/, "");
          const targetRel = path.join(relativePrefix, targetName);
          const targetDest = path.join(OUT_DIR, targetRel);
          await fs.mkdir(path.dirname(targetDest), { recursive: true });
          await fs.copyFile(fullPath, targetDest);
        }
      }
    }
  }

  await harvestHtml(NEXT_APP_DIR);

  // 5. Generera och skriv _redirects
  const redirectsSrc = path.join(
    PROJECT_ROOT,
    "docs",
    "drift",
    "cloudflare",
    "CF03-redirects.txt"
  );
  let redirectRules = "";
  try {
    redirectRules = await fs.readFile(redirectsSrc, "utf8");
  } catch {
    warnings.push("Kunde inte läsa CF03-redirects.txt, använder standardregler.");
  }

  const completeRedirects = [
    "# Cloudflare Pages _redirects för www.fornsvenska.se",
    "# Genererad av build-main-site.ts",
    "",
    "# 1. Äldre interna omdirigeringar",
    "/kallor /resurser 301",
    "",
    "# 2. Gamla ordbokslänkar -> ordboksunderdomäner (ord-01..07)",
    redirectRules.trim(),
    "",
  ].join("\n");

  await fs.writeFile(path.join(OUT_DIR, "_redirects"), completeRedirects, "utf8");
  await fs.writeFile(path.join(PUBLIC_DIR, "_redirects"), completeRedirects, "utf8");

  // 6. Generera _headers för Cloudflare Pages
  const headersContent = [
    "# Cloudflare Pages _headers för www.fornsvenska.se",
    "",
    "# Långlivad cache för oföränderliga kompilerade resurser",
    "/_next/static/*",
    "  Cache-Control: public, max-age=31536000, immutable",
    "",
    "# HTML-sidor och index revalideras vid ändringar",
    "/*.html",
    "  Cache-Control: public, max-age=0, must-revalidate",
    "",
    "# Delad personlig ordlistebrygga",
    "/ordbok/storage-bridge.html",
    "  Cache-Control: public, max-age=3600",
    "  Content-Security-Policy: frame-ancestors 'self' https://fornsvenska.se https://ord-01.fornsvenska.se https://ord-02.fornsvenska.se https://ord-03.fornsvenska.se https://ord-04.fornsvenska.se https://ord-05.fornsvenska.se https://ord-06.fornsvenska.se https://ord-07.fornsvenska.se",
    "",
    "# Bilder och typsnitt",
    "/*.png",
    "  Cache-Control: public, max-age=604800, stale-while-revalidate=86400",
    "/*.svg",
    "  Cache-Control: public, max-age=604800, stale-while-revalidate=86400",
    "",
  ].join("\n");

  await fs.writeFile(path.join(OUT_DIR, "_headers"), headersContent, "utf8");

  // 7. Validera att obligatoriska rutter och tecken finns
  let routesVerified = 0;

  // A: Startsida och 404
  for (const essential of ["index.html", "404.html", "robots.txt", "sitemap.xml", "_redirects", "_headers"]) {
    const p = path.join(OUT_DIR, essential);
    try {
      await fs.access(p);
      routesVerified++;
    } catch {
      throw new Error(`Obligatorisk rotfil saknas i dist/www: ${essential}`);
    }
  }

  // B: Grammatik (alla rutter)
  const grammatikPaths = await getAllPaths("grammatik");
  for (const slugParts of grammatikPaths) {
    const route = slugParts.length === 0 ? "grammatik" : `grammatik/${slugParts.join("/")}`;
    const p = path.join(OUT_DIR, `${route}.html`);
    try {
      await fs.access(p);
      routesVerified++;
    } catch {
      warnings.push(`Grammatikrutt saknas i statiskt bygge: /${route}`);
    }
  }

  // C: Texter (alla rutter)
  const texterPaths = await getAllPaths("texter");
  for (const slugParts of texterPaths) {
    const route = slugParts.length === 0 ? "texter" : `texter/${slugParts.join("/")}`;
    const p = path.join(OUT_DIR, `${route}.html`);
    try {
      await fs.access(p);
      routesVerified++;
    } catch {
      warnings.push(`Textrutt saknas i statiskt bygge: /${route}`);
    }
  }

  // D: Resurser
  for (const route of ["ordbok", "admin", "resurser", "resurser/vastgotalagen", "kontakt"]) {
    const p = path.join(OUT_DIR, `${route}.html`);
    try {
      await fs.access(p);
      routesVerified++;
    } catch {
      warnings.push(`Väsentlig rutt saknas: /${route}`);
    }
  }

  // E: Runor
  const corpus = await getRunicCorpusState();
  const runorRoot = path.join(OUT_DIR, "runor.html");
  await fs.access(runorRoot);
  routesVerified++;

  for (const item of corpus.inscriptions) {
    const p = path.join(OUT_DIR, "runor", `${item.canonicalSlug}.html`);
    try {
      await fs.access(p);
      routesVerified++;
    } catch {
      warnings.push(`Runinskrift saknas i statiskt bygge: /runor/${item.canonicalSlug}`);
    }
  }

  await buildApiWorker();
  await writeReleaseMetadata(OUT_DIR);

  // Räkna alla filer och storlek i dist/www
  let fileCount = 0;
  let totalBytes = 0;

  async function walkDir(d: string) {
    const entries = await fs.readdir(d, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(d, e.name);
      if (e.isDirectory()) {
        await walkDir(full);
      } else if (e.isFile()) {
        fileCount++;
        const s = await fs.stat(full);
        totalBytes += s.size;
      }
    }
  }

  await walkDir(OUT_DIR);

  const durationMs = Date.now() - startTime;
  console.log(
    `[buildMainSite] Klart på ${durationMs} ms: ${fileCount} filer, ${(totalBytes / 1024 / 1024).toFixed(2)} MB, ${routesVerified} rutter verifierade.`
  );

  return {
    ok: warnings.length === 0,
    fileCount,
    totalBytes,
    routesVerified,
    warnings,
  };
}

import { fileURLToPath } from "node:url";

const isCli =
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isCli) {
  buildMainSite()
    .then((res) => {
      if (!res.ok) {
        console.warn("Varningar vid bygge:", res.warnings);
      }
      process.exit(res.ok ? 0 : 1);
    })
    .catch((err) => {
      console.error("Byggfel:", err);
      process.exit(1);
    });
}
