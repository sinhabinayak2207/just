create table if not exists public.site_content (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

insert into public.site_content (key, value)
values ('landing', '{}'::jsonb)
on conflict (key) do nothing;
