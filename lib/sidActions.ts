"use server";

import { revalidatePath } from "next/cache";
import { skapaServerKlient } from "@/lib/supabase/server";
import { HAR_SUPABASE } from "@/lib/supabase/config";
import { hamtaSession } from "@/lib/session";
import { medStandard, type Startinnehall } from "@/lib/sidtyper";

export interface Svar {
  ok: boolean;
  fel?: string;
}

function begripligtDatabasfel(error: { code?: string; message: string }): string {
  const tabellSaknas =
    error.code === "PGRST205" ||
    error.message.includes("public.sidor") ||
    error.message.includes("schema cache");

  if (tabellSaknas) {
    return "Startsidans databastabell saknas. Kör supabase/startsida.sql i Supabase SQL Editor och försök igen.";
  }

  return error.message;
}

/**
 * Sparar sidans text. Raden skapas första gången någon skriver något —
 * därför upsert och inte update.
 */
export async function sparaStartinnehall(
  innehall: Startinnehall
): Promise<Svar> {
  if (!HAR_SUPABASE) return { ok: false, fel: "Supabase är inte konfigurerat." };

  const { arAdmin } = await hamtaSession();
  if (!arAdmin) return { ok: false, fel: "Du är inte inloggad som administratör." };

  const supabase = skapaServerKlient();
  const normaliserat = medStandard(innehall);
  const { error } = await supabase
    .from("sidor")
    .upsert({
      slug: "start",
      content: normaliserat,
      andrad: new Date().toISOString(),
    });

  if (error) return { ok: false, fel: begripligtDatabasfel(error) };

  revalidatePath("/");
  return { ok: true };
}
