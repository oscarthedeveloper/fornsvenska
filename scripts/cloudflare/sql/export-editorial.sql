-- Read only: one SELECT means one MVCC snapshot for counts and contents.
-- Run only against the confirmed project. Save the JSON privately, outside Git.
-- No LIMIT or PostgREST row pagination: the result is one aggregate row.
select jsonb_build_object(
  'schemaVersion', 1, 'observedAt', current_timestamp,
  'consistency', 'single-statement-mvcc',
  'nodes', coalesce((select jsonb_agg(to_jsonb(n) order by n.id) from public.nodes n), '[]'::jsonb),
  'sidor', coalesce((select jsonb_agg(to_jsonb(s) order by s.slug) from public.sidor s), '[]'::jsonb),
  'hyllor', coalesce((select jsonb_agg(to_jsonb(h) order by h.id) from public.hyllor h), '[]'::jsonb),
  'resurser', coalesce((select jsonb_agg(to_jsonb(r) order by r.id) from public.resurser r), '[]'::jsonb),
  'counts', jsonb_build_object(
    'nodes', (select count(*) from public.nodes),
    'sidor', (select count(*) from public.sidor),
    'hyllor', (select count(*) from public.hyllor),
    'resurser', (select count(*) from public.resurser)
  )
) as snapshot;
