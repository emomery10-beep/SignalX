-- ============================================================
-- Migration 035 — Global Market Intelligence
-- Additive only — no existing tables modified except profiles
-- ============================================================

-- ── 1. Consent field on profiles ─────────────────────────────
-- Separate from collective_opt_in (benchmarks) and training_consent (AI)
-- Explicit opt-in to contribute pricing data to the global intelligence pool
alter table public.profiles
  add column if not exists market_intelligence_opt_in  boolean default false,
  add column if not exists market_intelligence_opted_at timestamptz;

-- ── 2. Global product price catalogue ────────────────────────
-- Anonymised, aggregated price signals by product / channel / region
-- Privacy floor enforced at write time: merchant_count >= 3
create table if not exists public.global_product_catalogue (
  id                    uuid primary key default gen_random_uuid(),

  -- Bucket dimensions
  product_name          text        not null,
  category              text,
  channel               text        not null, -- shopify, amazon_fba, pos, woocommerce, etsy, ebay, etc.
  region                text        not null, -- customer_region from unified_data or country code
  currency              text        not null default 'GBP',
  period                text        not null, -- YYYY-MM

  -- Aggregated price signals (never individual merchant data)
  avg_selling_price     numeric,
  min_selling_price     numeric,
  max_selling_price     numeric,
  median_selling_price  numeric,
  avg_gross_margin      numeric,              -- percentage
  avg_units_sold        numeric,              -- per merchant per period

  -- Data quality / privacy
  merchant_count        int         not null, -- must be >= 3 before row is written
  data_points           int         not null,

  last_updated_at       timestamptz default now(),
  created_at            timestamptz default now(),

  unique (product_name, channel, region, currency, period)
);

-- ── 3. Global route intelligence ─────────────────────────────
-- Anonymised shipping route signals from 17track carrier_performance
-- Privacy floor: merchant_count >= 3
create table if not exists public.global_route_intelligence (
  id                    uuid primary key default gen_random_uuid(),

  -- Bucket dimensions
  origin_country        text        not null,
  destination_country   text        not null,
  carrier_code          text        not null default 'ALL',
  period                text        not null, -- YYYY-MM

  -- Aggregated route signals
  avg_transit_days      numeric,
  customs_hold_rate     numeric,              -- 0-100 percentage
  on_time_rate          numeric,              -- 0-100 percentage
  avg_delay_days        numeric,

  -- Data quality / privacy
  merchant_count        int         not null,
  data_points           int         not null,

  last_updated_at       timestamptz default now(),
  created_at            timestamptz default now(),

  unique (origin_country, destination_country, carrier_code, period)
);

-- ── 4. Intelligence search log ────────────────────────────────
-- Tracks what merchants search for — helps prioritise Tavily gap-filling
-- and surfaces demand signals (many searches for X = emerging interest)
create table if not exists public.market_intelligence_searches (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users on delete set null,
  query         text        not null,
  product_name  text,
  region        text,
  results_count int         default 0,
  tavily_fired  boolean     default false,
  created_at    timestamptz default now()
);

-- ── 5. Indexes ────────────────────────────────────────────────
create index if not exists idx_gpc_product    on public.global_product_catalogue (product_name);
create index if not exists idx_gpc_channel    on public.global_product_catalogue (channel, region);
create index if not exists idx_gpc_period     on public.global_product_catalogue (period);
create index if not exists idx_gri_route      on public.global_route_intelligence (origin_country, destination_country);
create index if not exists idx_gri_period     on public.global_route_intelligence (period);
create index if not exists idx_mis_user       on public.market_intelligence_searches (user_id);
create index if not exists idx_mis_query      on public.market_intelligence_searches (query);

-- ── 6. Row-level security ─────────────────────────────────────
alter table public.global_product_catalogue      enable row level security;
alter table public.global_route_intelligence     enable row level security;
alter table public.market_intelligence_searches  enable row level security;

-- global_product_catalogue: readable by all authenticated users
-- writable only by service role (cron job)
create policy "Authenticated users can read product catalogue"
  on public.global_product_catalogue for select
  using (auth.role() = 'authenticated');

-- global_route_intelligence: readable by Growth/Business (enforced in API layer)
create policy "Authenticated users can read route intelligence"
  on public.global_route_intelligence for select
  using (auth.role() = 'authenticated');

-- market_intelligence_searches: users see only their own searches
create policy "Users see own searches"
  on public.market_intelligence_searches for select
  using (auth.uid() = user_id);

create policy "Users insert own searches"
  on public.market_intelligence_searches for insert
  with check (auth.uid() = user_id);
