import fs from "node:fs";
import path from "node:path";
import { GRAMMATIK } from "@/data/grammatik";
import { TEXTER } from "@/data/texter";
import type { Node } from "@/lib/archive";

const BASE_URL = "https://www.fornsvenska.se";
export const ORDBOK_CHUNK_SIZE = 25000;

function samlaSokvagar(noder: Node[], bas: string, prefix = ""): string[] {
  const rutter: string[] = [];
  for (const nod of noder) {
    const slugStig = prefix ? `${prefix}/${nod.slug}` : nod.slug;
    rutter.push(`${bas}/${slugStig}`);
    if (nod.children && nod.kind === "folder") {
      rutter.push(...samlaSokvagar(nod.children, bas, slugStig));
    }
  }
  return rutter;
}

/**
 * Returnerar samtliga 280 kanoniska redaktionella URL:er:
 * - Startsida
 * - Grammatik (rot, 38 mappar, 193 artiklar)
 * - Texter (rot, 8 mappar, 35 utgåvor)
 * - Resursbibliotek och Västgötalagens bokläsare
 * - Ordbokens huvudsida
 */
export function hamtaRedaktionellaSitemapPoster(): Array<{
  url: string;
  changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
}> {
  const poster: Array<{
    url: string;
    changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
    priority?: number;
  }> = [
    {
      url: `${BASE_URL}/`,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/grammatik`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/texter`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/ordbok`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/resurser`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/resurser/vastgotalagen`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  // Grammatiksidor
  for (const stig of samlaSokvagar(GRAMMATIK, "/grammatik")) {
    poster.push({
      url: `${BASE_URL}${stig}`,
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  // Textsidor
  for (const stig of samlaSokvagar(TEXTER, "/texter")) {
    poster.push({
      url: `${BASE_URL}${stig}`,
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  return poster;
}

interface OrdbokMinPost {
  id: string;
}

let cachedOrdbokIds: string[] | null = null;

function laddaOrdbokIds(): string[] {
  if (cachedOrdbokIds) return cachedOrdbokIds;
  try {
    const filVag = path.join(process.cwd(), "data", "ordbok", "poster.json");
    if (!fs.existsSync(filVag)) return [];
    const raw = fs.readFileSync(filVag, "utf-8");
    const parsed: OrdbokMinPost[] = JSON.parse(raw);
    cachedOrdbokIds = parsed.map((p) => p.id).filter(Boolean);
    return cachedOrdbokIds;
  } catch (fel) {
    console.error("[sitemap] Kunde inte läsa ordboksposter:", fel);
    return [];
  }
}

export function hamtaAntalOrdbokSitemaps(): number {
  const ids = laddaOrdbokIds();
  return Math.ceil(ids.length / ORDBOK_CHUNK_SIZE);
}

export function hamtaOrdbokSitemapPoster(chunkIndex: number): Array<{
  url: string;
  changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
}> {
  const ids = laddaOrdbokIds();
  const start = chunkIndex * ORDBOK_CHUNK_SIZE;
  const chunk = ids.slice(start, start + ORDBOK_CHUNK_SIZE);

  return chunk.map((id) => ({
    url: `${BASE_URL}/ordbok/${encodeURIComponent(id)}`,
    changeFrequency: "yearly",
    priority: 0.6,
  }));
}
