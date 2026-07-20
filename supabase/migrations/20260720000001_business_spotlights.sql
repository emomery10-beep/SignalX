-- ── BUSINESS SPOTLIGHTS (merchant self-serve, admin-approved) ──────────
-- Powers the rotating carousel on the public signin/signup brand panel
-- (app/(auth)/signin/page.tsx, .signin-visual-col). A merchant submits
-- their own business once (upsert on owner_id); an admin approves or
-- rejects it before it can ever be publicly visible.
--
-- Deliberately NO insert/update policy for the authenticated role, unlike
-- most owner-scoped tables in this schema (e.g. profiles, zakat_calculations
-- use `for all using (auth.uid() = owner_id)`). status is what gates public
-- visibility on an unauthenticated marketing page — if owners could UPDATE
-- their own row directly, they could set status='approved' themselves and
-- bypass moderation entirely. All writes go through service-role API routes
-- (app/api/spotlight, app/api/admin/spotlight) instead.
create table if not exists public.business_spotlights (
  id              uuid primary key default gen_random_uuid(),
  owner_id        uuid not null unique references auth.users(id) on delete cascade,
  business_name   text not null,
  tagline         text not null,
  logo_url        text,
  link_url        text,
  status          text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  is_active       boolean not null default true,
  rejected_reason text,
  submitted_at    timestamptz not null default now(),
  reviewed_at     timestamptz,
  reviewed_by     uuid references auth.users(id),
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

alter table public.business_spotlights enable row level security;

drop policy if exists "Spotlights public read" on public.business_spotlights;
create policy "Spotlights public read" on public.business_spotlights
  for select using (status = 'approved' and is_active = true);

drop policy if exists "Owner reads own spotlight" on public.business_spotlights;
create policy "Owner reads own spotlight" on public.business_spotlights
  for select using (auth.uid() = owner_id);

create index if not exists idx_business_spotlights_public on public.business_spotlights (status, is_active);

drop trigger if exists set_business_spotlights_updated_at on public.business_spotlights;
create trigger set_business_spotlights_updated_at
  before update on public.business_spotlights
  for each row execute procedure public.set_updated_at();
