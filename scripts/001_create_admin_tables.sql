-- Site content: key-value store for every editable piece of copy on the site
create table if not exists public.site_content (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

-- Page visits: one row per visit
create table if not exists public.page_visits (
  id bigserial primary key,
  path text not null default '/',
  referrer text,
  user_agent text,
  country text,
  created_at timestamptz not null default now()
);

create index if not exists page_visits_created_at_idx on public.page_visits (created_at desc);
create index if not exists page_visits_path_idx on public.page_visits (path);

-- Admin sessions: opaque tokens stored in an http-only cookie
create table if not exists public.admin_sessions (
  token text primary key,
  email text not null,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null
);

create index if not exists admin_sessions_expires_idx on public.admin_sessions (expires_at);

-- Enable RLS; all real access goes through the server-side service role,
-- so we keep permissive policies disabled by default.
alter table public.site_content enable row level security;
alter table public.page_visits enable row level security;
alter table public.admin_sessions enable row level security;

-- Allow anonymous reads of site_content so the public site can render.
drop policy if exists "site_content public read" on public.site_content;
create policy "site_content public read"
  on public.site_content for select
  to anon, authenticated
  using (true);
