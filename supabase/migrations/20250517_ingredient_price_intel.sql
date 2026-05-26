-- ─────────────────────────────────────────────────────────────────────────────
-- Ingredient Price Intelligence
-- Populated by the invoice scanner every time a delivery note is scanned.
-- Anonymised at write time — no PII, supplier names omitted.
-- Powers collective intelligence for restaurants, exporters, researchers.
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.ingredient_price_intel (
  id              uuid primary key default gen_random_uuid(),
  -- Contributer (kept for dedup / rate-limit, never exposed in queries)
  owner_id        uuid not null references public.profiles(id) on delete cascade,
  -- Ingredient details
  ingredient      text not null,         -- normalised lowercase name e.g. "chicken breast"
  category        text not null default 'other',
                                         -- meat | fish | dairy | produce | dry_goods | beverages | cleaning | packaging | other
  unit            text not null default 'kg',
                                         -- kg | g | L | ml | case | box | each | dozen | tray | bag | portion
  unit_price      numeric(12,4) not null check (unit_price > 0),
  currency        char(3) not null default 'GBP',
  -- Geography / sector (resolved from owner profile at write time)
  region          text,                  -- e.g. "United Kingdom", "Kenya", "Germany"
  supplier_type   text,                  -- 'named_supplier' | 'market' | 'wholesaler' | 'unknown'
  -- Time
  delivery_date   date not null default current_date,
  created_at      timestamptz not null default now()
);

-- Indexes for analytics queries
create index if not exists idx_ingredient_intel_name     on public.ingredient_price_intel(ingredient);
create index if not exists idx_ingredient_intel_category on public.ingredient_price_intel(category);
create index if not exists idx_ingredient_intel_date     on public.ingredient_price_intel(delivery_date);
create index if not exists idx_ingredient_intel_region   on public.ingredient_price_intel(region);
create index if not exists idx_ingredient_intel_owner    on public.ingredient_price_intel(owner_id);

-- RLS
alter table public.ingredient_price_intel enable row level security;

-- Owners can insert their own rows
drop policy if exists "ingredient_intel_insert" on public.ingredient_price_intel;
create policy "ingredient_intel_insert"
  on public.ingredient_price_intel for insert
  with check (auth.uid() = owner_id);

-- Anyone authenticated can read the aggregate data (for collective intelligence)
-- But individual owner_id rows are invisible via standard queries
drop policy if exists "ingredient_intel_select" on public.ingredient_price_intel;
create policy "ingredient_intel_select"
  on public.ingredient_price_intel for select
  using (auth.role() = 'authenticated');

-- ─────────────────────────────────────────────────────────────────────────────
-- Anonymised aggregate view — safe to expose via API
-- Returns p25/median/p75 + sample count per ingredient/unit/month/region
-- ─────────────────────────────────────────────────────────────────────────────
create or replace view public.ingredient_price_market as
select
  ingredient,
  category,
  unit,
  currency,
  region,
  to_char(delivery_date, 'YYYY-MM') as period,
  count(*)                          as data_points,
  round(percentile_cont(0.25) within group (order by unit_price)::numeric, 4) as p25,
  round(percentile_cont(0.50) within group (order by unit_price)::numeric, 4) as median,
  round(percentile_cont(0.75) within group (order by unit_price)::numeric, 4) as p75,
  round(avg(unit_price)::numeric, 4)                                          as avg_price,
  round(min(unit_price)::numeric, 4)                                          as min_price,
  round(max(unit_price)::numeric, 4)                                          as max_price
from public.ingredient_price_intel
-- Require at least 3 contributors before exposing data (k-anonymity)
group by ingredient, category, unit, currency, region, period
having count(distinct owner_id) >= 3;

-- ─────────────────────────────────────────────────────────────────────────────
-- restaurant_deliveries log table
-- Stores each scanned delivery for audit / cost-of-goods tracking
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.restaurant_deliveries (
  id              uuid primary key default gen_random_uuid(),
  owner_id        uuid not null references public.profiles(id) on delete cascade,
  location_id     uuid references public.pos_locations(id) on delete set null,
  supplier_name   text,
  invoice_ref     text,
  delivery_date   date,
  currency        char(3) not null default 'GBP',
  total_value     numeric(12,2),
  items_count     int,
  items_json      jsonb,           -- full line items snapshot
  ai_confidence   int,             -- 0-100 extraction confidence
  food_costs_updated int default 0,
  notes           text,
  created_at      timestamptz not null default now()
);

create index if not exists idx_restaurant_deliveries_owner on public.restaurant_deliveries(owner_id);
create index if not exists idx_restaurant_deliveries_date  on public.restaurant_deliveries(delivery_date);

alter table public.restaurant_deliveries enable row level security;

drop policy if exists "restaurant_deliveries_owner" on public.restaurant_deliveries;
create policy "restaurant_deliveries_owner"
  on public.restaurant_deliveries for all
  using (auth.uid() = owner_id);
