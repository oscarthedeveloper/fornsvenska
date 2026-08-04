import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
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
