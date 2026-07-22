create table if not exists public.site_content (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

insert into public.site_content (key, value)
values ('landing', '{}'::jsonb)
on conflict (key) do nothing;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site-assets', 'site-assets', true, null, null)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public read site assets" on storage.objects;

create policy "Public read site assets"
on storage.objects
for select
to public
using (bucket_id = 'site-assets');

select pg_notify('pgrst', 'reload schema');
