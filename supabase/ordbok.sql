-- ============================================================================
-- Fornsvenska Studielabbet — Ordbok (Söderwalls ordbok + Supplementet)
-- Kör hela filen i Supabase SQL Editor. Den är idempotent och kan köras om.
-- ============================================================================

create table if not exists public.ordbok_poster (
  id text primary key,
  source_dataset text not null check (source_dataset in ('soederwall', 'soederwall-supp')),
  kalla_id text not null check (kalla_id in ('SOD1884', 'SOD-SUPP')),
  source_entry_id text not null,
  source_index integer not null,
  old_lemma text,
  is_new_in_supplement boolean not null default false,
  is_main_work_ae_in_supp_file boolean not null default false,
  headword_original text not null,
  headword_display text not null,
  homonym_number integer,
  part_of_speech text[] not null default '{}',
  gram_original text,
  information_original text,
  old_form_original text,
  variants_original text[] not null default '{}',
  word_form_rows jsonb not null default '[]'::jsonb,
  senses jsonb not null default '[]'::jsonb,
  article_plain_text text not null,
  search_keys text[] not null default '{}',
  alias_keys text[] not null default '{}',
  sort_key text not null,
  letter_section text not null,
  references_json jsonb not null default '[]'::jsonb,
  import_version text not null,
  source_checksum text not null,
  review_status text not null default 'oandrad_kallimport',
  skapad timestamptz not null default now(),
  andrad timestamptz not null default now(),
  unique (source_dataset, source_entry_id)
);

create index if not exists ordbok_poster_letter_sort_idx
  on public.ordbok_poster (letter_section, sort_key);

create index if not exists ordbok_poster_dataset_idx
  on public.ordbok_poster (source_dataset, sort_key);

create index if not exists ordbok_poster_search_keys_gin
  on public.ordbok_poster using gin (search_keys);

create index if not exists ordbok_poster_alias_keys_gin
  on public.ordbok_poster using gin (alias_keys);

-- Separat tabell för redaktionella rättelser så att omimport av ordbok_poster
-- aldrig raderar manuellt verifierade rättelser och källstöd.
create table if not exists public.ordbok_rattelser (
  entry_id text primary key references public.ordbok_poster (id) on delete cascade,
  review_status text not null default 'rattad_med_kallstod',
  headword_display_override text,
  note text not null,
  kallstod text not null,
  skapad_av uuid references auth.users (id),
  skapad timestamptz not null default now(),
  andrad timestamptz not null default now()
);

alter table public.ordbok_poster enable row level security;
alter table public.ordbok_rattelser enable row level security;

drop policy if exists "ordbok_poster lasbara for alla" on public.ordbok_poster;
create policy "ordbok_poster lasbara for alla"
  on public.ordbok_poster for select
  using (true);

drop policy if exists "ordbok_poster skrivbara for admins" on public.ordbok_poster;
create policy "ordbok_poster skrivbara for admins"
  on public.ordbok_poster for all
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));

drop policy if exists "ordbok_rattelser lasbara for alla" on public.ordbok_rattelser;
create policy "ordbok_rattelser lasbara for alla"
  on public.ordbok_rattelser for select
  using (true);

drop policy if exists "ordbok_rattelser skrivbara for admins" on public.ordbok_rattelser;
create policy "ordbok_rattelser skrivbara for admins"
  on public.ordbok_rattelser for all
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));

-- Separat tabell för kurerade moderna definitioner och snabbglosor
create table if not exists public.ordbok_moderna_definitioner (
  entry_id text primary key references public.ordbok_poster (id) on delete cascade,
  headword_display text,
  modern_glos text[] not null default '{}',
  kort_forklaring text not null,
  pedagogisk_not text,
  modern_motsvarighet text,
  kalla text not null default 'kurerad_redaktionell',
  granskad boolean not null default true,
  uppdaterad timestamptz not null default now()
);

alter table public.ordbok_moderna_definitioner enable row level security;

drop policy if exists "ordbok_moderna_definitioner lasbara for alla" on public.ordbok_moderna_definitioner;
create policy "ordbok_moderna_definitioner lasbara for alla"
  on public.ordbok_moderna_definitioner for select
  using (true);

drop policy if exists "ordbok_moderna_definitioner skrivbara for admins" on public.ordbok_moderna_definitioner;
create policy "ordbok_moderna_definitioner skrivbara for admins"
  on public.ordbok_moderna_definitioner for all
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));

