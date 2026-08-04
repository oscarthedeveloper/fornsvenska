import { cache } from "react";
import { HAR_SUPABASE } from "./supabase/config";
import { skapaServerKlient } from "./supabase/server";

export interface AdminSession {
  arAdmin: boolean;
  anvandarnamn: string | null;
}

/**
 * Vem är inloggad, och är den administratör?
 *
 * Skrivrättigheterna avgörs i databasen av RLS — det här är bara för
 * gränssnittet, så att redigeringsknapparna visas för rätt person.
 */
export const hamtaSession = cache(async (): Promise<AdminSession> => {
  if (!HAR_SUPABASE) return { arAdmin: false, anvandarnamn: null };

  try {
    const supabase = skapaServerKlient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { arAdmin: false, anvandarnamn: null };

    const { data } = await supabase
      .from("admins")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();

    return {
      arAdmin: Boolean(data),
      anvandarnamn: user.email?.split("@")[0] ?? null,
    };
  } catch {
    return { arAdmin: false, anvandarnamn: null };
  }
});
