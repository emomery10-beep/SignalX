-- Lightweight lead capture for the marketing landing page.
-- Visitors not ready to sign up can leave an email; no auth required to insert.
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  email text,
  phone text,
  source text not null default 'landing_page',
  country text,
  locale text,
  created_at timestamptz not null default now(),
  constraint leads_contact_present check (email is not null or phone is not null)
);

create index if not exists leads_email_idx on public.leads (email);
create index if not exists leads_created_at_idx on public.leads (created_at desc);

alter table public.leads enable row level security;

-- No public policies: all access goes through the service-role key in
-- app/api/lead/route.ts, which bypasses RLS. Anon/authenticated clients
-- get no direct access to this table.
