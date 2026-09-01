-- ============================================================================
-- Fornsvenska Studielabbet — redigerbar sidtext
--
-- SÄKERHET I ETT DELAT PROJEKT
-- Databasen delas med andra sajter. Filen skapar bara sin egen tabell och
-- sina egna policyer (alla med prefixet "fornsvenska "). Inget drop table,
-- inget alter table på någon annans tabell, ingen delad funktion rörs.
--
-- Inventering, om du vill se först (läser bara):
--   select table_name from information_schema.tables
--   where table_schema = 'public' and table_name = 'sidor';
-- Tomt svar = inget krockar.
-- ============================================================================

-- Fritext som hör till en sida i stället för till en nod i arkivet.
-- Startsidan ligger under slug 'start'; formen på content bestäms av
-- Startinnehall i lib/sidtyper.ts. Nya textfält kan läggas till i JSON-objektet
-- utan att tabellen behöver migreras; äldre rader fylls ut med standardtext.
create table if not exists public.sidor (
  slug text primary key,
  content jsonb not null default '{}'::jsonb,
  andrad timestamptz not null default now()
);

alter table public.sidor enable row level security;

drop policy if exists "fornsvenska sidor lasbara for alla" on public.sidor;
create policy "fornsvenska sidor lasbara for alla"
  on public.sidor for select
  using (true);

drop policy if exists "fornsvenska sidor skrivbara for admins" on public.sidor;
create policy "fornsvenska sidor skrivbara for admins"
  on public.sidor for all
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));

-- ============================================================================
-- Klart. Gå till startsidan, slå på Redigera och skriv direkt i rubriken.
-- Raden skapas av sig själv första gången du sparar.
-- ============================================================================
