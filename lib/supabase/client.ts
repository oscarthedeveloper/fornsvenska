"use client";

import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./config";

/** Supabase-klient för webbläsaren. Används av inloggningen. */
export function skapaKlient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
