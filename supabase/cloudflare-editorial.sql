-- Additive installer. Review and back up production before applying.
-- No existing editorial or content tables are modified.
create table if not exists public.cf_documents (
  domain text not null check (domain in ('startsida','trad_och_block','texter','resurser','ordbok','runor')),
  id text not null check (length(id) between 1 and 500),
  title text not null,
  revision integer not null default 1,
  content jsonb not null,
  approved boolean not null default false,
  published_revision integer,
  published_content jsonb,
  updated_at timestamptz not null default now(),
  primary key(domain,id)
);
create table if not exists public.cf_revisions (
  domain text not null, id text not null, revision integer not null,
  content jsonb not null, actor uuid, created_at timestamptz not null default now(),
  primary key(domain,id,revision),
  foreign key(domain,id) references public.cf_documents(domain,id)
);
create table if not exists public.cf_release_jobs (
  id uuid primary key default gen_random_uuid(),
  idempotency_key text not null unique check(length(idempotency_key) between 1 and 200),
  requested_by uuid not null,
  status text not null default 'pending' check(status in ('pending','running','succeeded','failed')),
  snapshot jsonb not null,
  projects jsonb not null default '{}'::jsonb,
  error text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);
alter table public.cf_documents enable row level security;
alter table public.cf_revisions enable row level security;
alter table public.cf_release_jobs enable row level security;
revoke all on public.cf_documents,public.cf_revisions,public.cf_release_jobs from anon,authenticated;
grant select on public.cf_documents,public.cf_revisions,public.cf_release_jobs to authenticated;
grant all on public.cf_documents,public.cf_revisions,public.cf_release_jobs to service_role;
drop policy if exists cf_admin_read on public.cf_documents;
create policy cf_admin_read on public.cf_documents for select to authenticated using (exists(select 1 from public.admins where user_id=(select auth.uid())));
drop policy if exists cf_admin_read on public.cf_revisions;
create policy cf_admin_read on public.cf_revisions for select to authenticated using (exists(select 1 from public.admins where user_id=(select auth.uid())));
drop policy if exists cf_admin_read on public.cf_release_jobs;
create policy cf_admin_read on public.cf_release_jobs for select to authenticated using (exists(select 1 from public.admins where user_id=(select auth.uid())));

create or replace function public.cf_save_document(p_domain text,p_id text,p_title text,p_content jsonb,p_expected_revision integer,p_approved boolean default false)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare current_rev integer; next_rev integer;
begin
  if auth.uid() is null or not exists(select 1 from public.admins where user_id=auth.uid()) then raise exception 'Administrator required' using errcode='42501'; end if;
  if p_expected_revision is null or p_expected_revision<0 or p_content is null or octet_length(p_content::text)>2000000 then raise exception 'Invalid document'; end if;
  if p_domain='trad_och_block' and jsonb_typeof(p_content)<>'array' then raise exception 'Archive tree must be an array'; end if;
  if p_domain<>'trad_och_block' and jsonb_typeof(p_content)<>'object' then raise exception 'Document must be an object'; end if;
  if p_domain='ordbok' and p_content ? 'correction' and
    (coalesce(p_content->'correction'->>'kallstod','')='' or coalesce(p_content->'correction'->>'note','')='') then raise exception 'Correction requires source evidence'; end if;
  perform pg_advisory_xact_lock(hashtextextended(p_domain||':'||p_id,0));
  select revision into current_rev from public.cf_documents where domain=p_domain and id=p_id for update;
  if coalesce(current_rev,0)<>p_expected_revision then raise exception 'Revision conflict' using errcode='40001'; end if;
  next_rev:=coalesce(current_rev,0)+1;
  insert into public.cf_documents(domain,id,title,revision,content,approved) values(p_domain,p_id,p_title,next_rev,p_content,p_approved)
    on conflict(domain,id) do update set title=excluded.title,revision=excluded.revision,content=excluded.content,approved=excluded.approved,updated_at=now();
  insert into public.cf_revisions(domain,id,revision,content,actor) values(p_domain,p_id,next_rev,p_content,auth.uid());
  return jsonb_build_object('revision',next_rev);
end $$;
revoke all on function public.cf_save_document(text,text,text,jsonb,integer,boolean) from public,anon;
grant execute on function public.cf_save_document(text,text,text,jsonb,integer,boolean) to authenticated;

create or replace function public.cf_request_release(p_key text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare job public.cf_release_jobs; frozen jsonb;
begin
  if auth.uid() is null or not exists(select 1 from public.admins where user_id=auth.uid()) then raise exception 'Administrator required' using errcode='42501'; end if;
  perform pg_advisory_xact_lock(742184901);
  select * into job from public.cf_release_jobs where idempotency_key=p_key;
  if found then return jsonb_build_object('id',job.id,'status',job.status,'created',false); end if;
  if exists(select 1 from public.cf_release_jobs where status in ('pending','running')) then raise exception 'A publication is already queued'; end if;
  if (select count(*) from public.cf_release_jobs where created_at>=date_trunc('month',now() at time zone 'UTC') at time zone 'UTC')>=28 then raise exception 'Monthly publication quota exhausted'; end if;
  if not exists(select 1 from public.cf_documents where approved and revision is distinct from published_revision) then raise exception 'No approved changes'; end if;
  select coalesce(jsonb_agg(jsonb_build_object('domain',domain,'id',id,'revision',case when approved then revision else published_revision end,'content',case when approved then content else published_content end) order by domain,id),'[]'::jsonb)
    into frozen from public.cf_documents where approved or published_content is not null;
  insert into public.cf_release_jobs(idempotency_key,requested_by,snapshot) values(p_key,auth.uid(),frozen) returning * into job;
  return jsonb_build_object('id',job.id,'status',job.status,'created',true);
end $$;
revoke all on function public.cf_request_release(text) from public,anon;
grant execute on function public.cf_request_release(text) to authenticated;

alter table public.cf_release_jobs add column if not exists git_sha text;
create or replace function public.cf_finish_release(p_id uuid,p_status text,p_projects jsonb,p_error text default null)
returns void language plpgsql security definer set search_path = '' as $$
declare job public.cf_release_jobs; item jsonb;
begin
  if coalesce(auth.jwt()->>'role','')<>'service_role' then raise exception 'Build service required' using errcode='42501'; end if;
  if p_status not in ('succeeded','failed') then raise exception 'Invalid final status'; end if;
  select * into job from public.cf_release_jobs where id=p_id for update;
  if not found or job.status not in ('pending','running') then raise exception 'Job is not active'; end if;
  if p_status='succeeded' then
    if job.status<>'running' or not (p_projects ?& array['ord-01','ord-02','ord-03','ord-04','ord-05','ord-06','ord-07','www']) then raise exception 'Missing deployment evidence'; end if;
    for item in select value from jsonb_array_elements(job.snapshot) loop
      update public.cf_documents set published_revision=(item->>'revision')::integer,published_content=item->'content',approved=case when revision=(item->>'revision')::integer then false else approved end
      where domain=item->>'domain' and id=item->>'id';
    end loop;
  end if;
  update public.cf_release_jobs set status=p_status,projects=p_projects,error=left(p_error,2000),completed_at=now() where id=p_id;
end $$;
revoke all on function public.cf_finish_release(uuid,text,jsonb,text) from public,anon,authenticated;
grant execute on function public.cf_finish_release(uuid,text,jsonb,text) to service_role;

create table if not exists public.cf_contact_reservations (
  id uuid primary key default gen_random_uuid(),ip_hash text not null,created_at timestamptz not null default now()
);
create index if not exists cf_contact_time on public.cf_contact_reservations(created_at);
alter table public.cf_contact_reservations enable row level security;
revoke all on public.cf_contact_reservations from public,anon,authenticated;
grant all on public.cf_contact_reservations to service_role;
create or replace function public.cf_reserve_contact(p_ip_hash text)
returns boolean language plpgsql security definer set search_path = '' as $$
begin
  if coalesce(auth.jwt()->>'role','')<>'service_role' then raise exception 'Service required' using errcode='42501'; end if;
  if p_ip_hash !~ '^[a-f0-9]{64}$' then raise exception 'Invalid IP digest'; end if;
  perform pg_advisory_xact_lock(742184902);
  -- Retain only counters needed for this month's quota, never message contents.
  delete from public.cf_contact_reservations where created_at < date_trunc('month',now() at time zone 'UTC') at time zone 'UTC';
  if (select count(*) from public.cf_contact_reservations where created_at>=date_trunc('day',now() at time zone 'UTC') at time zone 'UTC')>=50
    or (select count(*) from public.cf_contact_reservations)>=1000
    or (select count(*) from public.cf_contact_reservations where ip_hash=p_ip_hash and created_at>now()-interval '1 hour')>=5 then return false; end if;
  insert into public.cf_contact_reservations(ip_hash) values(p_ip_hash); return true;
end $$;
revoke all on function public.cf_reserve_contact(text) from public,anon,authenticated;
grant execute on function public.cf_reserve_contact(text) to service_role;
