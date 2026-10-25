import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

/**
 * Förnyar Supabase-sessionen på förfrågningar från inloggade administratörer.
 *
 * Anonyma besökare (99.9% av trafiken) har inga auth-kakor och passerar
 * omedelbart igenom utan att anropa Supabase Auth API, vilket eliminerar
 * onödiga Edge-funktionsanrop och latens.
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } });

  // Snabbkontroll: har klienten någon auth-kaka från Supabase?
  const harAuthKaka = request.cookies
    .getAll()
    .some((kaka) => kaka.name.startsWith("sb-") && kaka.name.includes("auth-token"));

  if (!harAuthKaka) {
    return response;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const nyckel = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !nyckel) return response;

  const supabase = createServerClient(url, nyckel, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        request.cookies.set({ name, value, ...options });
        response = NextResponse.next({ request: { headers: request.headers } });
        response.cookies.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        request.cookies.set({ name, value: "", ...options });
        response = NextResponse.next({ request: { headers: request.headers } });
        response.cookies.set({ name, value: "", ...options });
      },
    },
  });

  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|pdf|txt|xml|json)$).*)",
  ],
};
