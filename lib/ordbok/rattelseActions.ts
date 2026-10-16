"use server";

/**
 * Server Actions för redaktionella rättelser och granskningsstatus i Söderwalls ordbok.
 *
 * Hanterar sparande och borttagning till data/ordbok-rattelser.json samt
 * synkronisering mot Supabase public.ordbok_rattelser om Supabase är aktivt.
 */

import { revalidatePath } from "next/cache";
import { hamtaSession } from "@/lib/session";
import { HAR_SUPABASE } from "@/lib/supabase/config";
import {
  appliceraRattelseIMinne,
  avlasgnaRattelseIMinne,
} from "./ordbokServer";
import {
  lasAllaRattelser,
  sparaRattelseFilOchDb,
  taBortRattelseFilOchDb,
} from "./rattelser";
import type { OrdbokGranskningsstatus, OrdbokRattelse } from "./typer";

export interface RattelseSvar {
  ok: boolean;
  fel?: string;
  rattelse?: OrdbokRattelse;
}

async function kontrolleraBehorighet(): Promise<{
  tillaten: boolean;
  fel?: string;
  anvandarnamn?: string | null;
}> {
  if (HAR_SUPABASE) {
    const { arAdmin, anvandarnamn } = await hamtaSession();
    if (!arAdmin) {
      return {
        tillaten: false,
        fel: "Åtgärden kräver administratörsbehörighet i Fornsvenska Studielabbet.",
      };
    }
    return { tillaten: true, anvandarnamn };
  }
  // I lokalt läge utan konfigurerat Supabase tillåts redaktionella ändringar
  // direkt till data/ordbok-rattelser.json för utveckling och källkontroll.
  return { tillaten: true, anvandarnamn: "redaktion-lokal" };
}

/**
 * Sparar en redaktionell rättelse eller faksimilverifiering.
 */
export async function sparaOrdbokRattelseAction(indata: {
  id: string;
  headwordDisplayOverride?: string;
  reviewStatus: OrdbokGranskningsstatus;
  note: string;
  kallstod: string;
}): Promise<RattelseSvar> {
  const behorighet = await kontrolleraBehorighet();
  if (!behorighet.tillaten) {
    return { ok: false, fel: behorighet.fel };
  }

  const res = await sparaRattelseFilOchDb({
    ...indata,
    anvandarnamn: behorighet.anvandarnamn,
  });

  if (!res.ok || !res.rattelse) {
    return { ok: false, fel: res.fel ?? "Kunde inte spara rättelsen." };
  }

  // Uppdatera serverns minnesindex omedelbart
  appliceraRattelseIMinne(res.rattelse);

  // Revalidera berörda sidor
  revalidatePath("/ordbok");
  revalidatePath(`/ordbok/${encodeURIComponent(indata.id)}`);
  revalidatePath("/admin");

  return { ok: true, rattelse: res.rattelse };
}

/**
 * Raderar en rättelse och återställer posten till källans originalimport.
 */
export async function taBortOrdbokRattelseAction(id: string): Promise<RattelseSvar> {
  const behorighet = await kontrolleraBehorighet();
  if (!behorighet.tillaten) {
    return { ok: false, fel: behorighet.fel };
  }

  const res = await taBortRattelseFilOchDb(id);
  if (!res.ok) {
    return { ok: false, fel: res.fel };
  }

  // Återställ i serverns minnesindex omedelbart
  avlasgnaRattelseIMinne(id);

  revalidatePath("/ordbok");
  revalidatePath(`/ordbok/${encodeURIComponent(id)}`);
  revalidatePath("/admin");

  return { ok: true };
}

/**
 * Hämtar alla sparade rättelser för listning i granskningsvyn.
 */
export async function hamtaAllaOrdbokRattelserAction(): Promise<{
  ok: boolean;
  rattelser: OrdbokRattelse[];
}> {
  const rattelser = lasAllaRattelser();
  return { ok: true, rattelser };
}
