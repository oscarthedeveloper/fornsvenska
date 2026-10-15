/**
 * Sidtexten — läsning.
 *
 * Samma uppdelning som resten: Supabase när nycklarna finns, annars
 * standardtexten i koden. Sidan ska gå att titta på utan databas.
 */
import { cache } from "react";
import { HAR_SUPABASE } from "@/lib/supabase/config";
import { skapaServerKlient } from "@/lib/supabase/server";
import { medStandard, type Startinnehall } from "@/lib/sidtyper";

const ANVAND_SUPABASE_SIDOR =
  HAR_SUPABASE && process.env.NEXT_PUBLIC_DATA_SOURCE === "supabase";

export const hamtaStartinnehall = cache(async (): Promise<Startinnehall> => {
  if (!ANVAND_SUPABASE_SIDOR) return medStandard(null);

  try {
    const supabase = skapaServerKlient();
    const { data, error } = await supabase
      .from("sidor")
      .select("content")
      .eq("slug", "start")
      .maybeSingle();

    if (error) throw error;
    return medStandard((data?.content as Partial<Startinnehall>) ?? null);
  } catch (fel) {
    console.warn("[sidor] kunde inte läsa startsidans text:", fel);
    return medStandard(null);
  }
});
