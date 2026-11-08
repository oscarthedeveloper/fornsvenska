/**
 * Web Worker för Söderwalls ordbokssökning (CF08).
 *
 * Körs i bakgrundstråd i webbläsaren:
 * - Laddar det kompakta sökindexet (840 KB gzip) asynkront.
 * - Bygger minnesstrukturer utan att blockera webbläsarens huvudtråd eller animationer.
 * - Utför sökningar och morfologiska uppslag på < 2 ms.
 * - Stödjer on-demand-laddning av fulltextindexet vid artikeltextsökning.
 */

import {
  prepareIndex,
  sokOrdbokKlient,
  slaUppTextOrdKlient,
  type PreparedOrdbokIndex,
  type CompactOrdbokIndex,
} from "../../lib/ordbok/clientEngine";
import type { OrdbokSokParametrar } from "../../lib/ordbok/typer";

let preparedIndex: PreparedOrdbokIndex | null = null;
let fulltextMap: Map<string, string> | null = null;
let loadingFulltextPromise: Promise<void> | null = null;
let initPromise: Promise<void> | null = null;

async function doInit(baseUrl = ""): Promise<void> {
  if (preparedIndex) return;
  const url = `${baseUrl}/ordbok/index-headwords.json`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Kunde inte ladda ordboksindex från ${url} (HTTP ${res.status})`);
  }
  const data: CompactOrdbokIndex = await res.json();
  preparedIndex = prepareIndex(data);
}

async function doLoadFulltext(baseUrl = ""): Promise<void> {
  if (fulltextMap) return;
  if (loadingFulltextPromise) return loadingFulltextPromise;

  loadingFulltextPromise = (async () => {
    const url = `${baseUrl}/ordbok/index-fulltext.json`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Kunde inte ladda fulltextindex från ${url} (HTTP ${res.status})`);
    }
    const data = await res.json();
    const map = new Map<string, string>();
    for (const [id, text] of Object.entries(data.articles as Record<string, string>)) {
      map.set(id, text);
    }
    fulltextMap = map;
  })();

  return loadingFulltextPromise;
}

self.addEventListener("message", async (e: MessageEvent) => {
  const { type, id, params, word, maxHits, baseUrl } = e.data || {};

  try {
    switch (type) {
      case "INIT": {
        if (!initPromise) {
          initPromise = doInit(baseUrl || "");
        }
        await initPromise;
        self.postMessage({
          type: "INIT_OK",
          id,
          version: preparedIndex?.version,
          totalCount: preparedIndex?.totalCount,
        });
        break;
      }

      case "SEARCH": {
        if (!preparedIndex) {
          if (!initPromise) initPromise = doInit(baseUrl || "");
          await initPromise;
        }

        const sokParams: OrdbokSokParametrar = params;
        if (sokParams.mode === "artikeltext" && !fulltextMap) {
          await doLoadFulltext(baseUrl || "");
        }

        const result = sokOrdbokKlient(preparedIndex!, sokParams, fulltextMap ?? undefined);
        self.postMessage({
          type: "SEARCH_RESULT",
          id,
          result,
        });
        break;
      }

      case "TEXT_LOOKUP": {
        if (!preparedIndex) {
          if (!initPromise) initPromise = doInit(baseUrl || "");
          await initPromise;
        }

        const result = slaUppTextOrdKlient(preparedIndex!, word, maxHits || 8);
        self.postMessage({
          type: "TEXT_LOOKUP_RESULT",
          id,
          result,
        });
        break;
      }

      case "LOAD_FULLTEXT": {
        await doLoadFulltext(baseUrl || "");
        self.postMessage({
          type: "LOAD_FULLTEXT_OK",
          id,
          totalCount: fulltextMap?.size,
        });
        break;
      }

      default:
        self.postMessage({
          type: "ERROR",
          id,
          message: `Okänd meddelandetyp: ${type}`,
        });
    }
  } catch (err: unknown) {
    self.postMessage({
      type: "ERROR",
      id,
      message: err instanceof Error ? err.message : String(err),
    });
  }
});
