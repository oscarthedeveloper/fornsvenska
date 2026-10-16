"use server";

/**
 * Server Actions för att hantera kurerade moderna definitioner och glosor.
 */

import { revalidatePath } from "next/cache";
import { hamtaSession } from "@/lib/session";
import { HAR_SUPABASE } from "@/lib/supabase/config";
import {
  lasAllaModernaDefinitioner,
  sparaModernDefinitionFil,
  taBortModernDefinitionFil,
} from "./modernisering";
import {
  appliceraModernDefinitionIMinne,
  avlasgnaModernDefinitionIMinne,
} from "./ordbokServer";
import type { ModerniseradDefinition } from "./typer";

async function kravBehorighet(): Promise<{ tillaten: boolean; fel?: string }> {
  if (HAR_SUPABASE) {
    const { arAdmin } = await hamtaSession();
    if (!arAdmin) {
      return {
        tillaten: false,
        fel: "Åtgärden kräver administratörsbehörighet.",
      };
    }
    return { tillaten: true };
  }
  return { tillaten: true };
}

export async function sparaModernDefinitionAction(
  def: ModerniseradDefinition
): Promise<{ ok: boolean; fel?: string; definition?: ModerniseradDefinition }> {
  const behorighet = await kravBehorighet();
  if (!behorighet.tillaten) {
    return { ok: false, fel: behorighet.fel };
  }

  const res = await sparaModernDefinitionFil(def);
  if (!res.ok || !res.definition) {
    return { ok: false, fel: res.fel ?? "Kunde inte spara modern definition." };
  }

  // Uppdatera serverminnet direkt
  appliceraModernDefinitionIMinne(res.definition);

  revalidatePath("/ordbok");
  revalidatePath(`/ordbok/${encodeURIComponent(def.id)}`);
  revalidatePath("/admin");

  return { ok: true, definition: res.definition };
}

export async function taBortModernDefinitionAction(
  id: string
): Promise<{ ok: boolean; fel?: string }> {
  const behorighet = await kravBehorighet();
  if (!behorighet.tillaten) {
    return { ok: false, fel: behorighet.fel };
  }

  const res = await taBortModernDefinitionFil(id);
  if (!res.ok) {
    return { ok: false, fel: res.fel };
  }

  avlasgnaModernDefinitionIMinne(id);

  revalidatePath("/ordbok");
  revalidatePath(`/ordbok/${encodeURIComponent(id)}`);
  revalidatePath("/admin");

  return { ok: true };
}

export async function hamtaAllaModernaDefinitionerAction(): Promise<{
  ok: boolean;
  definitioner: ModerniseradDefinition[];
}> {
  const list = lasAllaModernaDefinitioner();
  return { ok: true, definitioner: list };
}
