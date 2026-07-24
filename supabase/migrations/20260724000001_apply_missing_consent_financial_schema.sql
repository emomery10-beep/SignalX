-- Migration 008_consent_financial.sql is recorded as "applied" in
-- schema_migrations (both locally and remotely per `supabase migration
-- list --linked`) but none of its DDL actually exists on the live database
-- — confirmed via PostgREST: profiles.data_consent/_at,
-- training_consent/_at, consent_ip_hash all return 42703 (column does not
-- exist); consent_log, financial_snapshots, sector_trends all return
-- PGRST205 (table not found); update_consent() RPC is not callable.
--
-- Practical effect: the Settings > Privacy consent toggles have been
-- silently non-functional since launch. GET /api/consent selects columns
-- that don't exist (postgrest-js doesn't throw on query errors, so the
-- route swallowed it and returned `{ consent: null }`); POST /api/consent
-- calls a function that doesn't exist (same silent swallow, returns 200
-- with a null body). This is also why the GDPR compliance audit's
-- "Consent is demonstrable server-side" check has never passed — there is
-- nowhere for a consent timestamp to be written.
--
-- This migration re-applies 008's DDL verbatim (all statements are
-- idempotent — if not exists / create or replace) under a new version so
-- `db push` actually executes it instead of skipping a version already
-- marked applied.

-- ── ADD CONSENT FIELDS TO PROFILES ───────────────────────────
alter table public.profiles
  add column if not exists data_consent         boolean default false,
  add column if not exists training_consent     boolean default false,
  add column if not exists data_consent_at      timestamptz,
  add column if not exists training_consent_at  timestamptz,
  add column if not exists consent_ip_hash      text;

comment on column public.profiles.data_consent is
  'User explicitly consented to financial data storage for AI personalisation';
comment on column public.profiles.training_consent is
  'User explicitly consented to anonymised data being used to improve AskBiz AI';

-- ── CONSENT LOG (audit trail) ─────────────────────────────────
create table if not exists public.consent_log (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users on delete cascade,
  consent_type  text not null,  -- data_consent | training_consent
  action        text not null,  -- granted | revoked
  ip_hash       text,
  user_agent    text,
  created_at    timestamptz default now()
);

create index if not exists idx_consent_log_user on public.consent_log(user_id);
alter table public.consent_log enable row level security;

drop policy if exists "User owns consent log" on public.consent_log;
create policy "User owns consent log" on public.consent_log for select using (auth.uid() = user_id);

drop policy if exists "Service inserts consent log" on public.consent_log;
create policy "Service inserts consent log" on public.consent_log for insert with check (true);

-- ── FINANCIAL DATA TABLE (consented users only) ───────────────
create table if not exists public.financial_snapshots (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references auth.users on delete cascade,
  upload_id       uuid references public.uploads on delete cascade,
  -- Structural financial metadata only
  business_type   text,
  country         text,
  sector          text,
  -- Aggregated financial metrics (no individual customer data)
  total_revenue   numeric,
  avg_margin_pct  numeric,
  top_categories  text[],      -- product categories only, no names
  low_stock_count int,
  product_count   int,
  -- Period
  data_period     text,        -- e.g. '2026-Q1'
  created_at      timestamptz default now()
);

comment on table public.financial_snapshots is
  'Aggregated financial metrics from consented users only. No customer data, employee data, or bank details. Used for AI personalisation and sector trend alerts.';

create index if not exists idx_financial_snapshots_user    on public.financial_snapshots(user_id);
create index if not exists idx_financial_snapshots_sector  on public.financial_snapshots(sector);
create index if not exists idx_financial_snapshots_country on public.financial_snapshots(country);

alter table public.financial_snapshots enable row level security;

drop policy if exists "User owns financial snapshots" on public.financial_snapshots;
create policy "User owns financial snapshots"
  on public.financial_snapshots for select
  using (auth.uid() = user_id);

drop policy if exists "Service inserts financial snapshots" on public.financial_snapshots;
create policy "Service inserts financial snapshots"
  on public.financial_snapshots for insert
  with check (true);

-- ── SECTOR TRENDS TABLE (fully anonymised) ────────────────────
create table if not exists public.sector_trends (
  id              uuid primary key default gen_random_uuid(),
  sector          text not null,
  country         text,
  metric          text not null,   -- avg_margin | revenue_change | stock_pressure
  value           numeric,
  change_pct      numeric,         -- month-over-month change
  sample_size     int,             -- number of businesses contributing (min 5 for anonymity)
  period          text not null,   -- e.g. '2026-04'
  created_at      timestamptz default now()
);

comment on table public.sector_trends is
  'Fully anonymised sector-level trends. Only published when sample_size >= 5 to protect individual businesses.';

create index if not exists idx_sector_trends_sector on public.sector_trends(sector, period);
alter table public.sector_trends enable row level security;

drop policy if exists "Public sector trends" on public.sector_trends;
create policy "Public sector trends" on public.sector_trends for select using (true);

-- ── FUNCTION: update consent ──────────────────────────────────
create or replace function public.update_consent(
  p_user_id        uuid,
  p_data_consent   boolean,
  p_training_consent boolean,
  p_ip_hash        text default null
) returns jsonb language plpgsql security definer set search_path = 'public' as $$
begin
  if auth.uid() is distinct from p_user_id then
    raise exception 'not authorized to update consent for this user';
  end if;

  update public.profiles set
    data_consent       = p_data_consent,
    training_consent   = p_training_consent,
    data_consent_at    = case when p_data_consent then now() else data_consent_at end,
    training_consent_at = case when p_training_consent then now() else training_consent_at end,
    consent_ip_hash    = p_ip_hash
  where id = p_user_id;

  -- Log the consent action
  if p_data_consent then
    insert into public.consent_log (user_id, consent_type, action, ip_hash)
    values (p_user_id, 'data_consent', 'granted', p_ip_hash)
    on conflict do nothing;
  end if;

  if p_training_consent then
    insert into public.consent_log (user_id, consent_type, action, ip_hash)
    values (p_user_id, 'training_consent', 'granted', p_ip_hash)
    on conflict do nothing;
  end if;

  return jsonb_build_object('success', true);
end;
$$;

revoke all on function public.update_consent(uuid, boolean, boolean, text) from public;
grant execute on function public.update_consent(uuid, boolean, boolean, text) to authenticated;

notify pgrst, 'reload schema';
