/**
 * Datamodell, filhantering och pedagogisk glosering för Söderwalls ordbok.
 *
 * Tillhandahåller:
 * 1. Kurerade, granskade moderna förklaringar och snabbglosor (data/ordbok/moderniserade-definitioner.json).
 * 2. Regelbaserad automatisk extraktion och 1800-talsnormalisering för poster som ännu saknar kurerad text.
 * 3. Tydlig separation mellan källans historiska ordbokstext och det moderna förklaringsstödet.
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { LagradOrdbokPost } from "./proveniens";
import type { ModerniseradDefinition, OrdbokPost } from "./typer";

const MODERNA_DEF_FIL = path.join(
  process.cwd(),
  "data",
  "ordbok",
  "moderniserade-definitioner.json"
);

/**
 * Läser alla kurerade moderna definitioner från fil.
 */
export function lasAllaModernaDefinitioner(): ModerniseradDefinition[] {
  try {
    if (!existsSync(MODERNA_DEF_FIL)) {
      return [];
    }
    const raw = readFileSync(MODERNA_DEF_FIL, "utf8").trim();
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ModerniseradDefinition[]) : [];
  } catch (err) {
    console.error("Kunde inte läsa moderniserade-definitioner.json:", err);
    return [];
  }
}

/**
 * Läser alla kurerade moderna definitioner som en Map indexerad på post-ID.
 */
export function lasModernaDefinitionerKarta(): Map<string, ModerniseradDefinition> {
  const karta = new Map<string, ModerniseradDefinition>();
  for (const item of lasAllaModernaDefinitioner()) {
    if (item && item.id) {
      karta.set(item.id, item);
    }
  }
  return karta;
}

/**
 * Normaliserar vanliga 1800-talsstavningar i Söderwalls definitioner till modern svenska.
 */
export function modernisera1800TalsSvenska(text: string): string {
  if (!text) return "";

  return text
    .replace(/\bhafwa\b/gi, "ha")
    .replace(/\bwara\b/gi, "vara")
    .replace(/\bgifwa\b/gi, "ge")
    .replace(/\bblifwa\b/gi, "bli")
    .replace(/\btaga\b/gi, "ta")
    .replace(/\bqwinna\b/gi, "kvinna")
    .replace(/\bqvinna\b/gi, "kvinna")
    .replace(/\bhwad\b/gi, "vad")
    .replace(/\bhwilken\b/gi, "vilken")
    .replace(/\bhwilka\b/gi, "vilka")
    .replace(/\bhwem\b/gi, "vem")
    .replace(/\bhuru\b/gi, "hur")
    .replace(/\bhuruledes\b/gi, "hur")
    .replace(/\bemedan\b/gi, "eftersom")
    .replace(/\bhwarjehanda\b/gi, "varjehanda")
    .replace(/\böfwer\b/gi, "över")
    .replace(/\bäfwen\b/gi, "även")
    .replace(/\blikwäl\b/gi, "likväl")
    .replace(/\bqwarstad\b/gi, "kvarstad")
    .replace(/\bqwäll\b/gi, "kväll")
    .replace(/\bdräpa\b/gi, "döda (dräpa)")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Extraherar automatiskt en kort modern orienteringsglosa ur Söderwalls
 * första definition för poster som ännu inte har en manuellt kurerad förklaring.
 */
export function extraheraAutomatiskGlosa(
  post: Pick<OrdbokPost | LagradOrdbokPost, "id" | "headwordDisplay" | "senses">
): ModerniseradDefinition | null {
  if (!post.senses || post.senses.length === 0) return null;

  const forstaText = post.senses[0].text.trim();
  if (!forstaText) return null;

  // Ta bort inledande siffermärkningar som "1) ", "2) ", "a) "
  let renad = forstaText.replace(/^[0-9]+[)\.]\s*/, "").replace(/^[a-z][)\.]\s*/, "");

  // Hitta var definitionen slutar före citat, referenser eller förkortningar
  // Söderwalls förklaringsdel skiljs ofta från textbeläggen med citattecken ("), "Jfr", "Se", "SD", etc.
  const stoppTecken = ['"', ";", "—", " Jfr", " jfr", " Se", " se", " SD ", " VgL", " ÖgL", " UL", " MELL", " KrL", " Sv. Dipl."];
  let kortText = renad;
  let minIdx = -1;

  for (const stopp of stoppTecken) {
    const idx = renad.indexOf(stopp);
    if (idx > 0 && (minIdx === -1 || idx < minIdx)) {
      minIdx = idx;
    }
  }

  if (minIdx > 0) {
    kortText = renad.slice(0, minIdx).trim();
  } else if (renad.length > 140) {
    // Om ingen källavgränsare hittas, ta fram till första punkt om den är rimligt kort
    const punktIdx = renad.indexOf(". ");
    if (punktIdx > 0 && punktIdx < 120) {
      kortText = renad.slice(0, punktIdx).trim();
    } else {
      kortText = renad.slice(0, 110).trim() + "…";
    }
  }

  // Rensa bort eventuella avslutande kommatecken eller punkter
  kortText = kortText.replace(/[,;.\s]+$/, "").trim();
  if (kortText.length < 2) return null;

  const moderniseradText = modernisera1800TalsSvenska(kortText);

  // Dela upp i enstaka synonymer om komma finns
  const glosor = moderniseradText
    .split(/,\s*/)
    .map((g) => g.replace(/[()]/g, "").trim())
    .filter((g) => g.length >= 2 && !g.startsWith("t.ex") && !g.startsWith("ss."))
    .slice(0, 3);

  return {
    id: post.id,
    headwordDisplay: post.headwordDisplay,
    modernGlos: glosor.length > 0 ? glosor : [moderniseradText],
    kortForklaring: moderniseradText,
    kalla: "automatisk_extraktion",
    granskad: false,
  };
}

/**
 * Hämtar den bästa tillgängliga moderna förklaringen:
 * 1. Kurerad manuell definition om sådan finns.
 * 2. Automatisk extraktion ur källans första betydelse som fallback.
 */
export function hamtaBastaModernaDefinition(
  post: Pick<OrdbokPost | LagradOrdbokPost, "id" | "headwordDisplay" | "senses">,
  kureradKarta?: Map<string, ModerniseradDefinition>
): ModerniseradDefinition | null {
  const karta = kureradKarta ?? lasModernaDefinitionerKarta();
  const kurerad = karta.get(post.id);
  if (kurerad) return kurerad;

  return extraheraAutomatiskGlosa(post);
}

/**
 * Sparar eller uppdaterar en kurerad modern definition till fil.
 */
export async function sparaModernDefinitionFil(
  def: ModerniseradDefinition
): Promise<{ ok: boolean; fel?: string; definition?: ModerniseradDefinition }> {
  const id = def.id.trim();
  if (!id) return { ok: false, fel: "Post-ID saknas." };

  const glosor = def.modernGlos.map((g) => g.trim()).filter(Boolean);
  if (glosor.length === 0) {
    return { ok: false, fel: "Minst en modern snabbglosa måste anges." };
  }

  const forklaring = def.kortForklaring.trim();
  if (!forklaring) {
    return { ok: false, fel: "En modern förklaring måste anges." };
  }

  const nu = new Date().toISOString();
  const befintliga = lasAllaModernaDefinitioner();
  const idx = befintliga.findIndex((d) => d.id === id);

  const nyDef: ModerniseradDefinition = {
    id,
    headwordDisplay: def.headwordDisplay?.trim() || undefined,
    modernGlos: glosor,
    kortForklaring: forklaring,
    pedagogiskNot: def.pedagogiskNot?.trim() || undefined,
    modernMotsvarighet: def.modernMotsvarighet?.trim() || glosor[0],
    kalla: "kurerad_redaktionell",
    granskad: true,
    uppdaterad: nu,
  };

  if (idx >= 0) {
    befintliga[idx] = nyDef;
  } else {
    befintliga.push(nyDef);
  }

  try {
    writeFileSync(MODERNA_DEF_FIL, JSON.stringify(befintliga, null, 2) + "\n", "utf8");
    return { ok: true, definition: nyDef };
  } catch (err) {
    return {
      ok: false,
      fel: `Kunde inte spara till ${MODERNA_DEF_FIL}: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

/**
 * Tar bort en kurerad modern definition och återgår till automatisk glosering.
 */
export async function taBortModernDefinitionFil(
  id: string
): Promise<{ ok: boolean; fel?: string }> {
  const trimmatId = id.trim();
  const befintliga = lasAllaModernaDefinitioner();
  const filtrerad = befintliga.filter((d) => d.id !== trimmatId);

  if (filtrerad.length === befintliga.length) {
    return { ok: true };
  }

  try {
    writeFileSync(MODERNA_DEF_FIL, JSON.stringify(filtrerad, null, 2) + "\n", "utf8");
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      fel: `Kunde inte uppdatera ${MODERNA_DEF_FIL}: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}
