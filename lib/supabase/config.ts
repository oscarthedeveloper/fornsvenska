/** Sant när Supabase är konfigurerat. Annars läser sajten från filerna i data/. */
export const HAR_SUPABASE = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** Användarnamn översätts till e-post med den här domänen. */
export const EPOSTDOMAN =
  process.env.NEXT_PUBLIC_ADMIN_EPOSTDOMAN ?? "fornsvenska.local";

/** Vilka variabler som saknas — används av felmeddelandet på /admin. */
export function saknadeVariabler(): string[] {
  const saknas: string[] = [];
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) saknas.push("NEXT_PUBLIC_SUPABASE_URL");
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    saknas.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  return saknas;
}

export function anvandarnamnTillEpost(anvandarnamn: string) {
  const rent = anvandarnamn.trim().toLowerCase();
  return rent.includes("@") ? rent : `${rent}@${EPOSTDOMAN}`;
}
