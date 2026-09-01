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

  if (error) return { ok: false, fel: error.message };

  revalidatePath("/");
  return { ok: true };
}
