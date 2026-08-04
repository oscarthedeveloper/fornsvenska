-- ============================================================================
-- Fornsvenska Studielabbet — schema
-- Kör hela filen i Supabase SQL Editor. Den är idempotent och kan köras om.
-- ============================================================================

-- ---------------------------------------------------------------- ADMINISTRATÖRER
-- Bara användare i den här tabellen får skriva. Lägg in dig själv efter att
-- du skapat ditt konto (se sista raden i filen).
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  skapad timestamptz not null default now()
);

alter table public.admins enable row level security;

drop policy if exists "admins lasbar for admins" on public.admins;
create policy "admins lasbar for admins"
  on public.admins for select
  using (auth.uid() = user_id);

-- ------------------------------------------------------------------------ NODER
-- Mappar och dokument i samma tabell. Dokumentinnehållet ligger som JSONB i
-- kolumnen content och har exakt samma form som TypeScript-typerna i lib/.
create table if not exists public.nodes (
  id uuid primary key default gen_random_uuid(),
  root text not null check (root in ('grammatik', 'texter')),
  parent_id uuid references public.nodes (id) on delete cascade,
  slug text not null,
  title text not null,
  kind text not null check (kind in ('folder', 'doc')),
  note text,
  position integer not null default 0,
  content jsonb,
  utkast boolean not null default false,
  skapad timestamptz not null default now(),
  andrad timestamptz not null default now()
);

-- Slugen måste vara unik bland syskon. Två index behövs eftersom NULL inte
-- jämförs med NULL i ett vanligt unique-villkor.
create unique index if not exists nodes_unik_under_forelder
  on public.nodes (parent_id, slug) where parent_id is not null;

create unique index if not exists nodes_unik_pa_rotniva
  on public.nodes (root, slug) where parent_id is null;

create index if not exists nodes_root_idx on public.nodes (root, parent_id, position);

-- Håll "andrad" aktuell
create or replace function public.satt_andrad()
returns trigger language plpgsql as $$
begin
  new.andrad = now();
  return new;
end;
$$;

drop trigger if exists nodes_andrad on public.nodes;
create trigger nodes_andrad
  before update on public.nodes
  for each row execute function public.satt_andrad();

-- -------------------------------------------------------------------- POLICYER
alter table public.nodes enable row level security;

-- Alla får läsa: sajten är offentlig.
drop policy if exists "noder lasbara for alla" on public.nodes;
create policy "noder lasbara for alla"
  on public.nodes for select
  using (true);

-- Bara administratörer får skriva.
drop policy if exists "noder skrivbara for admins" on public.nodes;
create policy "noder skrivbara for admins"
  on public.nodes for all
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));

-- ============================================================================
-- EFTER ATT DU SKAPAT DITT KONTO
--
-- 1. Authentication > Users > Add user. Använd e-postadressen
--    <ditt-användarnamn>@fornsvenska.local, t.ex. oscar@fornsvenska.local,
--    och kryssa i "Auto Confirm User".
-- 2. Kör sedan raden nedan med samma adress:
--
-- insert into public.admins (user_id)
-- select id from auth.users where email = 'oscar@fornsvenska.local'
-- on conflict do nothing;
--
-- 3. Authentication > Providers > Email: slå AV "Enable sign ups".
-- ============================================================================
