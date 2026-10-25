/**
 * Skript för E02: Mätning av besökarresor före optimering.
 * Mäter 5 centrala besökarresor mot produktionsbygget (next start)
 * med 5 kalla och 5 varma körningar per resa, för både fullständiga HTML-dokument
 * och Next.js RSC-förhandsladdningar (RSC: 1).
 */

import http from "node:http";
import { spawn, type ChildProcess } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const PORT = 3123;
const BASE_URL = process.env.MEASURE_BASE_URL || `http://127.0.0.1:${PORT}`;

interface RequestResult {
  step: string;
  path: string;
  mode: "HTML" | "RSC";
  status: number;
  durationMs: number;
  byteLength: number;
  cacheControl: string | null;
  nextCache: string | null;
  age?: string | null;
  xNfRequestId?: string | null;
  serverRenderType: "DYNAMIC" | "STATIC" | "CACHED" | "API";
}

interface JourneyResult {
  id: string;
  name: string;
  runs: {
    cold: RequestResult[][];
    warm: RequestResult[][];
  };
}

async function makeRequest(
  urlPath: string,
  stepName: string,
  mode: "HTML" | "RSC" = "HTML"
): Promise<RequestResult> {
  const start = performance.now();
  const headers: Record<string, string> = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  };

  if (mode === "HTML") {
    headers["Accept"] = "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8";
  } else {
    headers["Accept"] = "text/x-component";
    headers["RSC"] = "1";
    headers["Next-Url"] = urlPath;
  }

  const res = await fetch(`${BASE_URL}${urlPath}`, {
    method: "GET",
    headers,
  });

  const body = await res.arrayBuffer();
  const durationMs = Number((performance.now() - start).toFixed(2));
  const byteLength = body.byteLength;

  const cacheControl = res.headers.get("cache-control");
  const nextCache = res.headers.get("x-nextjs-cache");

  let serverRenderType: RequestResult["serverRenderType"] = "DYNAMIC";
  if (urlPath.startsWith("/api/")) {
    serverRenderType = "API";
  } else if (nextCache === "HIT" || nextCache === "STALE") {
    serverRenderType = "CACHED";
  } else if (nextCache === "PRERENDER" || nextCache === "STATIC") {
    serverRenderType = "STATIC";
  } else if (cacheControl?.includes("no-cache") || cacheControl?.includes("no-store") || !cacheControl) {
    serverRenderType = "DYNAMIC";
  }

  return {
    step: stepName,
    path: urlPath,
    mode,
    status: res.status,
    durationMs,
    byteLength,
    cacheControl,
    nextCache,
    age: res.headers.get("age"),
    xNfRequestId: res.headers.get("x-nf-request-id"),
    serverRenderType,
  };
}

async function waitForServer(retries = 30): Promise<void> {
  let lastErr = "";
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(`${BASE_URL}/resurser`);
      if (res.status === 200) return;
    } catch (e: any) {
      lastErr = e?.message ?? String(e);
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Servern startade inte i tid. Senaste fel: ${lastErr}`);
}

const JOURNEYS = [
  {
    id: "resa-1",
    name: "Startsida → Textmapp → Text → Ordboksuppslag → Nästa text",
    steps: [
      { name: "1. Startsida", path: "/" },
      { name: "2. Textmapp (Lagar)", path: "/texter/lagar/aldre-vastgotalagen" },
      { name: "3. Text (Kristnu balkær I)", path: "/texter/lagar/aldre-vastgotalagen/kristnu-balker-i" },
      { name: "4. Ordboksuppslag i text (ord: fyrst)", path: "/api/ordbok/uppslag?ord=fyrst" },
      { name: "5. Nästa text (Kristnu balkær II)", path: "/texter/lagar/aldre-vastgotalagen/kristnu-balker-ii" },
    ],
  },
  {
    id: "resa-2",
    name: "Grammatiksida → Hänvisning",
    steps: [
      { name: "1. Grammatiksida (Vad är fornsvenska)", path: "/grammatik/introduktion/vad-ar-fornsvenska" },
      { name: "2. Grammatikartikel (Omljud)", path: "/grammatik/ljudlara/vokaler/omljud" },
    ],
  },
  {
    id: "resa-3",
    name: "Resurssökning → Bok/PDF-visning",
    steps: [
      { name: "1. Resurser", path: "/resurser" },
      { name: "2. Västgötalagen PDF-läsare", path: "/resurser/vastgotalagen" },
    ],
  },
  {
    id: "resa-4",
    name: "Runsida → Filter → Detalj → Tillbaka",
    steps: [
      { name: "1. Runsida", path: "/runor" },
      { name: "2. API-filter (Ög)", path: "/api/runor/v1?province=Ög" },
      { name: "3. Runkatalog detalj (Öl 1)", path: "/runor/ol-1" },
      { name: "4. Tillbaka till runor", path: "/runor" },
    ],
  },
  {
    id: "resa-5",
    name: "Inloggning → Adminvyer → Anonym kontroll",
    steps: [
      { name: "1. Admin inloggningsvy", path: "/admin" },
      { name: "2. Admin runor", path: "/admin/runor" },
      { name: "3. Anonym kontroll startsida", path: "/" },
    ],
  },
];

async function runMeasurements(): Promise<JourneyResult[]> {
  const results: JourneyResult[] = [];

  for (const journey of JOURNEYS) {
    console.log(`\n=== Mäter ${journey.name} ===`);
    const journeyData: JourneyResult = {
      id: journey.id,
      name: journey.name,
      runs: {
        cold: [],
        warm: [],
      },
    };

    // 5 Kalla körningar
    console.log("  Kör 5 kalla mätningar...");
    for (let c = 0; c < 5; c++) {
      const runSteps: RequestResult[] = [];
      for (const step of journey.steps) {
        // Mät HTML
        const htmlRes = await makeRequest(step.path, step.name, "HTML");
        runSteps.push(htmlRes);

        // Mät RSC om inte API
        if (!step.path.startsWith("/api/")) {
          const rscRes = await makeRequest(step.path, `${step.name} (RSC)`, "RSC");
          runSteps.push(rscRes);
        }
      }
      journeyData.runs.cold.push(runSteps);
      await new Promise((r) => setTimeout(r, 100));
    }

    // 5 Varma körningar
    console.log("  Kör 5 varma mätningar...");
    for (let w = 0; w < 5; w++) {
      const runSteps: RequestResult[] = [];
      for (const step of journey.steps) {
        const htmlRes = await makeRequest(step.path, step.name, "HTML");
        runSteps.push(htmlRes);

        if (!step.path.startsWith("/api/")) {
          const rscRes = await makeRequest(step.path, `${step.name} (RSC)`, "RSC");
          runSteps.push(rscRes);
        }
      }
      journeyData.runs.warm.push(runSteps);
      await new Promise((r) => setTimeout(r, 50));
    }

    results.push(journeyData);
  }

  return results;
}

async function main() {
  const isRemote = Boolean(process.env.MEASURE_BASE_URL);
  let server: ChildProcess | null = null;

  if (!isRemote) {
    console.log("Startar Next.js produktionsserver på port", PORT);
    server = spawn("npx", ["next", "start", "-p", String(PORT), "-H", "127.0.0.1"], {
      env: {
        ...process.env,
        PATH: `/usr/local/bin:${process.env.PATH}`,
        NODE_ENV: "production",
      },
      stdio: "inherit",
    });
  } else {
    console.log("Mäter mot fjärrmiljö:", BASE_URL);
  }

  try {
    await waitForServer();
    console.log("Servern är redo! Kör mätningar...");

    const measurementResults = await runMeasurements();

    const outputFileName = isRemote ? "E13-matvardens-moln.json" : "E02-matvardens-data.json";
    const outputPath = path.join(process.cwd(), "docs", "drift", outputFileName);
    fs.writeFileSync(outputPath, JSON.stringify(measurementResults, null, 2), "utf8");
    console.log(`\nMätdatan sparad till ${outputPath}`);
  } finally {
    if (server) {
      console.log("Stänger produktionsservern...");
      server.kill("SIGTERM");
    }
  }
}

main().catch((err) => {
  console.error("Fel under mätning:", err);
  process.exit(1);
});
