import { publishedOverride } from "./editorial/publication-input";
/**
 * Sidtexten — läsning.
 *
 * Samma uppdelning som resten: Supabase när nycklarna finns, annars
 * standardtexten i koden. Sidan ska gå att titta på utan databas.
 */
import * as React from "react";
const cache =
  typeof React.cache === "function"
    ? React.cache
    : (<T extends (...args: any[]) => any>(fn: T): T => fn);
import { HAR_SUPABASE } from "@/lib/supabase/config";
import { skapaPublikServerKlient } from "@/lib/supabase/server";
import { medStandard, type Startinnehall } from "@/lib/sidtyper";

const ANVAND_SUPABASE_SIDOR =
  HAR_SUPABASE && process.env.NEXT_PUBLIC_DATA_SOURCE === "supabase";

export const hamtaStartinnehall = cache(async (): Promise<Startinnehall> => {
  const frozen = publishedOverride<Startinnehall>("startsida", "start");
  if (frozen) return medStandard(frozen);
  if (process.env.CF_RELEASE_SNAPSHOT || !ANVAND_SUPABASE_SIDOR) return medStandard(null);

  try {
    const supabase = skapaPublikServerKlient();
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
