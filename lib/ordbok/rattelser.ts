/**
 * Datamodell, filhantering och diff-beräkning för redaktionella rättelser i Söderwalls ordbok.
 *
 * Rättelser sparas i data/ordbok-rattelser.json (som bevaras vid framtida omimporter)
 * och synkroniseras mot Supabase (public.ordbok_rattelser) när Supabase är konfigurerat.
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { HAR_SUPABASE } from "@/lib/supabase/config";
import { skapaServerKlient } from "@/lib/supabase/server";
import type { OrdbokGranskningsstatus, OrdbokPost, OrdbokRattelse } from "./typer";

const RATTELSER_FIL = path.join(process.cwd(), "data", "ordbok-rattelser.json");

/**
 * Läser alla sparade rättelser från data/ordbok-rattelser.json.
 */
export function lasAllaRattelser(): OrdbokRattelse[] {
  try {
    if (!existsSync(RATTELSER_FIL)) {
      return [];
    }
    const raw = readFileSync(RATTELSER_FIL, "utf8").trim();
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as OrdbokRattelse[]) : [];
  } catch (err) {
    console.error("Kunde inte läsa data/ordbok-rattelser.json:", err);
    return [];
  }
}

/**
 * Läser alla rättelser som en Map med post-ID som nyckel.
 */
export function lasRattelserKarta(): Map<string, OrdbokRattelse> {
  const karta = new Map<string, OrdbokRattelse>();
  for (const r of lasAllaRattelser()) {
    if (r && r.id) {
      karta.set(r.id, r);
    }
  }
  return karta;
}

/**
 * Hämtar en specifik rättelse för ett post-ID.
 */
export function lasRattelse(id: string): OrdbokRattelse | null {
  const karta = lasRattelserKarta();
  return karta.get(id) ?? null;
}

/**
 * Sparar en rättelse till data/ordbok-rattelser.json och Supabase (om tillgängligt).
 */
export async function sparaRattelseFilOchDb(
  indata: {
    id: string;
    headwordDisplayOverride?: string;
    reviewStatus: OrdbokGranskningsstatus;
    note: string;
    kallstod: string;
    anvandarnamn?: string | null;
  }
): Promise<{ ok: boolean; fel?: string; rattelse?: OrdbokRattelse }> {
  const id = indata.id.trim();
  if (!id) {
    return { ok: false, fel: "Post-ID saknas." };
  }

  const kallstod = indata.kallstod.trim();
  if (!kallstod) {
    return {
      ok: false,
      fel: "Källstöd är obligatoriskt vid redaktionell rättelse (t.ex. faksimilband, sida eller handskriftshänvisning).",
    };
  }

  const note = indata.note.trim();
  if (!note) {
    return {
      ok: false,
      fel: "Redaktionell motivering eller förklarande not måste anges.",
    };
  }

  const nu = new Date().toISOString();
  const befintliga = lasAllaRattelser();
  const index = befintliga.findIndex((r) => r.id === id);

  const hwOverride = indata.headwordDisplayOverride?.trim() || undefined;

  const nyRattelse: OrdbokRattelse = {
    id,
    headwordDisplayOverride: hwOverride,
    reviewStatus: indata.reviewStatus,
    note,
    kallstod,
    skapad: index >= 0 ? befintliga[index].skapad : nu,
    andrad: nu,
    skapadAv: indata.anvandarnamn || (index >= 0 ? befintliga[index].skapadAv : undefined),
  };

  if (index >= 0) {
    befintliga[index] = nyRattelse;
  } else {
    befintliga.push(nyRattelse);
  }

  // 1. Skriv till lokal fil
  try {
    writeFileSync(RATTELSER_FIL, JSON.stringify(befintliga, null, 2) + "\n", "utf8");
  } catch (err) {
    return {
      ok: false,
      fel: `Kunde inte skriva till data/ordbok-rattelser.json: ${err instanceof Error ? err.message : String(err)}`,
    };
  }

  // 2. Synkronisera mot Supabase om konfigurerat
  if (HAR_SUPABASE) {
    try {
      const supabase = skapaServerKlient();
      const { error } = await supabase.from("ordbok_rattelser").upsert({
        entry_id: id,
        headword_display_override: hwOverride ?? null,
        review_status: indata.reviewStatus,
        note,
        kallstod,
        andrad: nu,
      });
      if (error) {
        console.warn("Supabase ordbok_rattelser kunde inte uppdateras:", error.message);
      }
    } catch (dbErr) {
      console.warn("Supabase-anrop misslyckades:", dbErr);
    }
  }

  return { ok: true, rattelse: nyRattelse };
}

/**
 * Raderar en rättelse och återställer posten till källans original.
 */
export async function taBortRattelseFilOchDb(
  id: string
): Promise<{ ok: boolean; fel?: string }> {
  const trimmatId = id.trim();
  const befintliga = lasAllaRattelser();
  const nyLista = befintliga.filter((r) => r.id !== trimmatId);

  if (nyLista.length === befintliga.length) {
    return { ok: true }; // Fanns inte, inget att ta bort
  }

  try {
    writeFileSync(RATTELSER_FIL, JSON.stringify(nyLista, null, 2) + "\n", "utf8");
  } catch (err) {
    return {
      ok: false,
      fel: `Kunde inte uppdatera data/ordbok-rattelser.json: ${err instanceof Error ? err.message : String(err)}`,
    };
  }

  if (HAR_SUPABASE) {
    try {
      const supabase = skapaServerKlient();
      const { error } = await supabase
        .from("ordbok_rattelser")
        .delete()
        .eq("entry_id", trimmatId);
      if (error) {
        console.warn("Supabase radering misslyckades:", error.message);
      }
    } catch (dbErr) {
      console.warn("Supabase-anrop misslyckades vid radering:", dbErr);
    }
  }

  return { ok: true };
}

export { beraknaRattelseDiff, type RattelseDiff } from "./rattelseDiff";

