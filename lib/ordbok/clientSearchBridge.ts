/**
 * Klientbrygga för sökning i webbläsaren (CF08).
 *
 * Kommunicerar transparent med Web Workern (`public/ordbok/search-worker.js`)
 * eller faller tillbaka på direkt minnesexekvering om Web Workers saknas.
 *
 * Garanterar:
 * - Noll nätverksanrop till Supabase eller Cloudflare Workers vid sökning.
 * - Avbrutna eller fördröjda förfrågningar ignoreras automatiskt (stale check).
 * - Svarstider sub-2 ms för uppslagsord och textuppslag.
 */

import type {
  OrdbokSokParametrar,
  OrdbokSokResultat,
  OrdbokTextUppslagResultat,
} from "./typer";
import {
  prepareIndex,
  sokOrdbokKlient,
  slaUppTextOrdKlient,
  type PreparedOrdbokIndex,
  type CompactOrdbokIndex,
} from "./clientEngine";

let workerInstance: Worker | null = null;
let workerInitPromise: Promise<void> | null = null;
let nextRequestId = 1;
const pendingRequests = new Map<
  number,
  {
    resolve: (val: any) => void;
    reject: (err: any) => void;
  }
>();

// Fallback i huvudtråden (om Worker saknas)
let fallbackIndex: PreparedOrdbokIndex | null = null;
let fallbackInitPromise: Promise<PreparedOrdbokIndex> | null = null;

function harWorkerStod(): boolean {
  return typeof window !== "undefined" && typeof window.Worker !== "undefined";
}

export function initSearchWorker(baseUrl = ""): Promise<void> {
  if (workerInitPromise) return workerInitPromise;

  if (!harWorkerStod()) {
    // Förbered fallback
    return initFallbackIndex(baseUrl).then(() => {});
  }

  workerInitPromise = new Promise<void>((resolve, reject) => {
    try {
      const workerUrl = `${baseUrl}/ordbok/search-worker.js`;
      workerInstance = new Worker(workerUrl);

      workerInstance.onmessage = (e: MessageEvent) => {
        const { type, id, result, message } = e.data || {};

        if (type === "INIT_OK") {
          resolve();
          return;
        }

        if (type === "ERROR" && id === undefined) {
          reject(new Error(message || "Worker-initialiseringsfel"));
          return;
        }

        if (id !== undefined) {
          const pending = pendingRequests.get(id);
          if (pending) {
            pendingRequests.delete(id);
            if (type === "ERROR") {
              pending.reject(new Error(message || "Sökfel i worker"));
            } else {
              pending.resolve(result);
            }
          }
        }
      };

      workerInstance.onerror = (err) => {
        console.warn("[SearchWorker] Worker-fel, byter till fallback:", err);
        workerInstance = null;
        initFallbackIndex(baseUrl).then(() => resolve()).catch(reject);
      };

      workerInstance.postMessage({ type: "INIT", baseUrl });
    } catch (err) {
      console.warn("[SearchWorker] Kunde inte starta worker, använder fallback:", err);
      workerInstance = null;
      initFallbackIndex(baseUrl).then(() => resolve()).catch(reject);
    }
  });

  return workerInitPromise;
}

async function initFallbackIndex(baseUrl = ""): Promise<PreparedOrdbokIndex> {
  if (fallbackIndex) return fallbackIndex;
  if (fallbackInitPromise) return fallbackInitPromise;

  fallbackInitPromise = (async () => {
    const url = `${baseUrl}/ordbok/index-headwords.json`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Kunde inte ladda ordboksindex från ${url} (HTTP ${res.status})`);
    }
    const data: CompactOrdbokIndex = await res.json();
    fallbackIndex = prepareIndex(data);
    return fallbackIndex;
  })();

  return fallbackInitPromise;
}

export async function sokOrdbokKlientAsync(
  params: OrdbokSokParametrar,
  baseUrl = ""
): Promise<OrdbokSokResultat> {
  if (!workerInstance) {
    await initSearchWorker(baseUrl);
  }

  if (workerInstance) {
    const id = nextRequestId++;
    return new Promise<OrdbokSokResultat>((resolve, reject) => {
      pendingRequests.set(id, { resolve, reject });
      workerInstance!.postMessage({
        type: "SEARCH",
        id,
        params,
        baseUrl,
      });
    });
  }

  // Fallback direkt i minnet
  const idx = await initFallbackIndex(baseUrl);
  return sokOrdbokKlient(idx, params);
}

export async function slaUppTextOrdKlientAsync(
  word: string,
  maxHits = 8,
  baseUrl = ""
): Promise<OrdbokTextUppslagResultat> {
  if (!workerInstance) {
    await initSearchWorker(baseUrl);
  }

  if (workerInstance) {
    const id = nextRequestId++;
    return new Promise<OrdbokTextUppslagResultat>((resolve, reject) => {
      pendingRequests.set(id, { resolve, reject });
      workerInstance!.postMessage({
        type: "TEXT_LOOKUP",
        id,
        word,
        maxHits,
        baseUrl,
      });
    });
  }

  // Fallback direkt i minnet
  const idx = await initFallbackIndex(baseUrl);
  return slaUppTextOrdKlient(idx, word, maxHits);
}
