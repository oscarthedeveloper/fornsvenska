import { withRunicOverrides } from "../../lib/editorial/publication-input";
/**
 * CF10: Byggskript för versionsbundna statiska run-API-exporter
 *
 * Genererar statiska JSON- och GeoJSON-filer i `public/api/runor/v1/`:
 * 1. `index.json`: Kanonisk korpus av samtliga publicerade inskrifter.
 * 2. `geojson.json`: Kanonisk GeoJSON-export enligt RFC 7946.
 * 3. `versions/2026.1-pilot.json` & `versions/2026.2-batch1.json`: Fastlåsta utgåvor.
 * 4. `inscriptions/[slug].json`: Enskilda JSON-filer per inskrift för statisk direktåtkomst.
 *
 * Externa API-anropare och publika kartan kan läsa dessa filer direkt från Cloudflare edge
 * med noll Workers- eller DB-kostnad ($0 driftskostnad).
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { RUNIC_PILOT_INSCRIPTIONS } from "../../lib/runor/pilot-data";
import { RUNIC_COMBINED_CORPUS_50 } from "../../lib/runor/batch1-data";
import { getPublishedRunicCorpus, getPublishedRunicInscription } from "../../lib/runor/contract";
import { inscriptionsToGeoJson } from "../../lib/runor/geojson";
import { CURRENT_RUNIC_DATASET_VERSION } from "../../lib/runor/cache-control";

const PROJECT_ROOT = process.cwd();
const API_BASE_DIR = path.join(PROJECT_ROOT, "public", "api", "runor", "v1");
const VERSIONS_DIR = path.join(API_BASE_DIR, "versions");
const INSCRIPTIONS_DIR = path.join(API_BASE_DIR, "inscriptions");

export async function buildRunicApiExports() {
  const pilot = withRunicOverrides(RUNIC_PILOT_INSCRIPTIONS);
  const batch = withRunicOverrides(RUNIC_COMBINED_CORPUS_50, '2026.2-batch1');
  await fs.mkdir(API_BASE_DIR, { recursive: true });
  await fs.mkdir(VERSIONS_DIR, { recursive: true });
  await fs.mkdir(INSCRIPTIONS_DIR, { recursive: true });

  const generatedAt = new Date().toISOString();

  // 1. Kanonisk publicerad korpus (index.json)
  const canonicalCorpus = getPublishedRunicCorpus(pilot);
  const indexPayload = {
    ...canonicalCorpus,
    datasetVersion: CURRENT_RUNIC_DATASET_VERSION,
    generatedAt,
  };
  await fs.writeFile(
    path.join(API_BASE_DIR, "index.json"),
    JSON.stringify(indexPayload, null, 2),
    "utf8"
  );

  // 2. Kanonisk GeoJSON (geojson.json)
  const publishedItems = pilot.filter(
    (i) => i.curationStatus === "granskad_pilot" || i.curationStatus === "publicerad"
  );
  const geojsonPayload = inscriptionsToGeoJson(publishedItems, "fyndplats");
  await fs.writeFile(
    path.join(API_BASE_DIR, "geojson.json"),
    JSON.stringify(geojsonPayload, null, 2),
    "utf8"
  );

  // 3. Versionsbundna exporter (versions/)
  const pilotPayload = {
    ...getPublishedRunicCorpus(pilot),
    datasetVersion: "2026.1-pilot",
    generatedAt,
  };
  await fs.writeFile(
    path.join(VERSIONS_DIR, "2026.1-pilot.json"),
    JSON.stringify(pilotPayload, null, 2),
    "utf8"
  );

  const batch1Payload = {
    ...getPublishedRunicCorpus(batch),
    datasetVersion: "2026.2-batch1",
    generatedAt,
  };
  await fs.writeFile(
    path.join(VERSIONS_DIR, "2026.2-batch1.json"),
    JSON.stringify(batch1Payload, null, 2),
    "utf8"
  );

  // 4. Enskilda inskrifter (inscriptions/[slug].json)
  let countInscriptions = 0;
  for (const item of pilot) {
    const published = getPublishedRunicInscription(item.canonicalSlug, pilot);
    if (published) {
      const singlePayload = {
        version: "1.0.0",
        datasetVersion: CURRENT_RUNIC_DATASET_VERSION,
        apiEndpoint: `/api/runor/v1/${item.canonicalSlug}`,
        license: "Samnordisk runtextdatabas (ODbL 1.0) / Sveriges runinskrifter (Public Domain)",
        attribution:
          "Källutgåva: Sveriges runinskrifter (Kungl. Vitterhetsakademien / Riksantikvarieämbetet). Metadata och koordinater: Samnordisk runtextdatabas (Uppsala universitet).",
        generatedAt,
        inscription: published,
      };
      await fs.writeFile(
        path.join(INSCRIPTIONS_DIR, `${item.canonicalSlug}.json`),
        JSON.stringify(singlePayload, null, 2),
        "utf8"
      );
      countInscriptions++;
    }
  }

  return {
    ok: true,
    indexFile: path.join(API_BASE_DIR, "index.json"),
    geojsonFile: path.join(API_BASE_DIR, "geojson.json"),
    inscriptionsGenerated: countInscriptions,
  };
}

if (process.argv[1]?.endsWith("build-runic-api-exports.ts")) {
  buildRunicApiExports()
    .then((res) => {
      console.log(`[CF10] Run-API statiska exporter genererade: ${res.inscriptionsGenerated} inskrifter.`);
    })
    .catch((err) => {
      console.error("[CF10] Fel vid generering av Run-API exporter:", err);
      process.exit(1);
    });
}
