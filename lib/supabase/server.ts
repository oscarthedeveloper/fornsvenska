import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./config";

/**
 * Supabase-klient på servern. Läser och skriver sessionskakan.
 *
 * I server-komponenter går det inte att sätta kakor — därför är set/remove
 * inlindade i try/catch. Middleware sköter förnyelsen av sessionen.
 */
export function skapaServerKlient() {
  const kakor = cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      get(name: string) {
        return kakor.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          kakor.set({ name, value, ...options });
        } catch {
          /* anropat från en server-komponent — middleware sköter det */
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          kakor.set({ name, value: "", ...options });
        } catch {
          /* se ovan */
        }
      },
    },
  });
}

/**
 * Publik Supabase-klient för serverkomponenter som inte läser kakor.
 * Använder enbart anonym nyckel (NEXT_PUBLIC_SUPABASE_ANON_KEY) och skickar
 * inga användarsessioner. Detta gör att publika läsningar kan förgenereras
 * eller cachas utan att trigga dynamisk kakavläsning i Next.js.
 */
export function skapaPublikServerKlient() {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
