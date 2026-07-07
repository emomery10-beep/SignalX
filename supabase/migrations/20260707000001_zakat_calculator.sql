-- ============================================================
-- AskBiz Migration — Zakat calculator
-- Tables: zakat_calculations, charities
-- Columns: profiles.zakat_* (hawl anchor + cached nisab price)
--
-- Root AskBiz app only — pos-askbiz shares this Supabase project
-- but does not read/write these tables. Purely additive, no changes
-- to existing tables besides new nullable/defaulted columns on
-- profiles. Idempotent (if-not-exists / drop-first) so a re-apply
-- is safe.
--
-- Design notes (see conversation for full rationale):
-- - zakat_calculations is an audit-log snapshot, not a live-mutated
--   balance — one row per calculation, including any manual overrides
--   the user applied, so history reflects what was actually shown.
-- - charities is curated by AskBiz directly (no user submissions),
--   hence public read-only via RLS — writes go through the service
--   role, not client policies.
-- - Nisab price is cached on profiles rather than fetched live on
--   every read: the calculator only calls out to a pricing API when
--   the user explicitly requests a refresh.
-- ============================================================

-- ── PROFILES: hawl anchor + cached nisab price ──────────────
alter table public.profiles
  add column if not exists zakat_hawl_start_date   date,
  add column if not exists zakat_nisab_metal        text not null default 'silver',
  add column if not exists zakat_nisab_cached_value numeric(14,2),
  add column if not exists zakat_nisab_checked_at   timestamptz;

do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'profiles_zakat_nisab_metal_check') then
    alter table public.profiles add constraint profiles_zakat_nisab_metal_check
      check (zakat_nisab_metal in ('gold', 'silver'));
  end if;
end $$;

-- ── ZAKAT CALCULATIONS (audit trail, one row per calculation) ─
create table if not exists public.zakat_calculations (
  id                uuid primary key default gen_random_uuid(),
  owner_id          uuid not null references auth.users on delete cascade,
  calculated_at     timestamptz not null default now(),
  cash_value        numeric(14,2) not null default 0,
  inventory_value   numeric(14,2) not null default 0,
  receivables_value numeric(14,2) not null default 0,
  overrides         jsonb,                    -- any manually-edited figures, keyed by field name
  zakat_base        numeric(14,2) not null,
  nisab_value       numeric(14,2) not null,
  hawl_day_count    int,
  amount_due        numeric(14,2) not null default 0,
  currency          text not null
);

alter table public.zakat_calculations enable row level security;

drop policy if exists "Owner manages zakat calculations" on public.zakat_calculations;
create policy "Owner manages zakat calculations"
  on public.zakat_calculations for all using (auth.uid() = owner_id);

create index if not exists idx_zakat_calculations_owner
  on public.zakat_calculations (owner_id, calculated_at desc);

-- ── CHARITIES (curated directory, public read-only) ──────────
create table if not exists public.charities (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  country_codes  text[] not null default '{}',   -- ISO codes matching profiles.country_code; empty = shown everywhere
  cause_category text,
  logo_url       text,
  donate_url     text not null unique,           -- also makes the future seed insert idempotent
  verified       boolean not null default true,
  sort_order     int not null default 0,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

alter table public.charities enable row level security;

-- Public reference data — same pattern as public.plans / public.sector_trends.
-- No insert/update/delete policy: curation happens via the service role, not client writes.
drop policy if exists "Charities public" on public.charities;
create policy "Charities public" on public.charities for select using (true);

create index if not exists idx_charities_country_codes on public.charities using gin (country_codes);
create index if not exists idx_charities_sort on public.charities (sort_order);

drop trigger if exists set_charities_updated_at on public.charities;
create trigger set_charities_updated_at
  before update on public.charities
  for each row execute procedure public.set_updated_at();
