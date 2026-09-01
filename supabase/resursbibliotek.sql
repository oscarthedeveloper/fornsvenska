-- ============================================================================
-- Fornsvenska Studielabbet — resursbiblioteket
--
-- SÄKERHET I ETT DELAT PROJEKT
-- Databasen delas med andra sajter. Den här filen rör därför BARA sina egna
-- saker, och allt den skapar bär namn som ingen annan lär ha tagit:
--
--   skapar   public.hyllor, public.resurser  (create table if not exists)
--   skapar   funktionen public.satt_resurs_andrad  — en egen, så att den
--            delade satt_andrad() aldrig skrivs över
--   skapar   bucketen "resurser" om den inte redan finns
--   skapar   policyer vars namn börjar med "fornsvenska "
--
-- Den innehåller inget drop table, inget alter table på någon annans tabell,
-- inget truncate och inget delete. De drop-satser som finns gäller enbart
-- triggern och policyerna som filen själv skapar, så att den går att köra om.
--
-- Kör INVENTERINGEN nedan först om du vill se vad som redan finns.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- INVENTERING (frivillig, läser bara — ändrar ingenting)
-- Markera de fem raderna och kör dem för sig.
--
-- select 'tabell' as sort, table_name as namn from information_schema.tables
--   where table_schema = 'public' and table_name in ('hyllor', 'resurser')
-- union all select 'bucket', id from storage.buckets where id = 'resurser'
-- union all select 'policy', policyname from pg_policies
--   where tablename = 'objects' and policyname ilike '%resursfiler%';
--
-- Tomt svar = inget krockar, kör hela filen rakt av.
-- Får du raden "bucket / resurser" och inte har kört den här filen förut,
-- använder någon annan sajt redan det namnet — säg till innan du går vidare.
-- ---------------------------------------------------------------------------

-- ------------------------------------------------------------------- HYLLOR
-- Hyllorna är fria: du namnger dem själv och flyttar dem i redigeringsläget.
create table if not exists public.hyllor (
  id uuid primary key default gen_random_uuid(),
  titel text not null default 'Ny hylla',
  note text,
  position integer not null default 0,
  skapad timestamptz not null default now()
);

create index if not exists hyllor_position_idx on public.hyllor (position);

-- ----------------------------------------------------------------- RESURSER
-- En resurs är en bok, en uppsats, en avhandling eller en skrift.
--
-- Skrifter (lagar, brev, diplom) hamnar aldrig på en hylla utan i
-- Skriftkammaren, och bär sina textversioner i kolumnen versioner:
--   [{ id, etikett, note, innehall }]
-- där innehall är texten med ==markeringar== (se README).
create table if not exists public.resurser (
  id uuid primary key default gen_random_uuid(),
  hylla_id uuid references public.hyllor (id) on delete set null,
  typ text not null default 'larobok'
    check (typ in ('larobok', 'examensarbete', 'avhandling', 'skrift', 'ovrigt')),
  titel text not null default 'Ny resurs',
  forfattare text,
  ar text,
  utgivare text,
  /* Publik URL till omslaget i storage. Null ⇒ standardomslag ritas i koden. */
  omslag text,
  /* Extern länk, när resursen går att läsa eller beställa på nätet. */
  lank text,
  /* 1 = nästan omöjlig att få tag på, 5 = fritt tillgänglig online. */
  tillganglighet integer not null default 3
    check (tillganglighet between 1 and 5),
  beskrivning text,
  versioner jsonb not null default '[]'::jsonb,
  position integer not null default 0,
  utkast boolean not null default false,
  skapad timestamptz not null default now(),
  andrad timestamptz not null default now()
);

create index if not exists resurser_hylla_idx on public.resurser (hylla_id, position);
create index if not exists resurser_typ_idx on public.resurser (typ, position);

-- Egen funktion, inte den delade satt_andrad(). Andra sajter i projektet kan
-- ha en funktion med det namnet som gör något annat, och create or replace
-- hade skrivit över den utan att fråga.
create or replace function public.satt_resurs_andrad()
returns trigger language plpgsql as $$
begin
  new.andrad = now();
  return new;
end;
$$;

drop trigger if exists resurser_andrad on public.resurser;
create trigger resurser_andrad
  before update on public.resurser
  for each row execute function public.satt_resurs_andrad();

-- ---------------------------------------------------------------- POLICYER
-- Samma mönster som noderna: alla får läsa, bara administratörer får skriva.
alter table public.hyllor enable row level security;
alter table public.resurser enable row level security;

drop policy if exists "fornsvenska hyllor lasbara for alla" on public.hyllor;
create policy "fornsvenska hyllor lasbara for alla"
  on public.hyllor for select
  using (true);

drop policy if exists "fornsvenska hyllor skrivbara for admins" on public.hyllor;
create policy "fornsvenska hyllor skrivbara for admins"
  on public.hyllor for all
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));

drop policy if exists "fornsvenska resurser lasbara for alla" on public.resurser;
create policy "fornsvenska resurser lasbara for alla"
  on public.resurser for select
  using (true);

drop policy if exists "fornsvenska resurser skrivbara for admins" on public.resurser;
create policy "fornsvenska resurser skrivbara for admins"
  on public.resurser for all
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));

-- ------------------------------------------------------------------ FILER
-- Omslagsbilder laddas upp från redigeringsläget. Bucketen skapas bara om
-- den saknas: finns den redan lämnas den precis som den är.
insert into storage.buckets (id, name, public)
values ('resurser', 'resurser', true)
on conflict (id) do nothing;

-- Policyerna gäller bara den här bucketen. Andra buckets berörs inte —
-- policyer i Postgres lägger till rättigheter, de tar aldrig bort några.
drop policy if exists "fornsvenska resursfiler lasbara for alla" on storage.objects;
create policy "fornsvenska resursfiler lasbara for alla"
  on storage.objects for select
  using (bucket_id = 'resurser');

drop policy if exists "fornsvenska resursfiler skrivbara for admins" on storage.objects;
create policy "fornsvenska resursfiler skrivbara for admins"
  on storage.objects for all
  using (
    bucket_id = 'resurser'
    and exists (select 1 from public.admins a where a.user_id = auth.uid())
  )
  with check (
    bucket_id = 'resurser'
    and exists (select 1 from public.admins a where a.user_id = auth.uid())
  );

-- ============================================================================
-- Klart. Gå till /resurser, slå på Redigera och lägg till din första hylla.
--
-- Bucketen måste vara publik för att omslagen ska synas. Kontrollera i
-- Storage > resurser > Settings om du fick "bucket / resurser" i
-- inventeringen ovan — då skapades den inte av den här filen.
-- ============================================================================
