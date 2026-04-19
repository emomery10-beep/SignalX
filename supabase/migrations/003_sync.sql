-- ============================================================
-- SignalX Migration 003 — Unified Data Model + Live Sync
-- One clean model from all connected sources
-- ============================================================

-- ── CONNECTED SOURCES ────────────────────────────────────────
create table if not exists public.connected_sources (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users on delete cascade,
  source_type   text not null check (source_type in (
    'shopify','square','stripe','quickbooks','google_sheets',
    'amazon_fba','woocommerce','jumia','takealot','manual_csv'
  )),
  name          text not null,                    -- e.g. "My Shopify Store"
  credentials   jsonb default '{}',               -- encrypted tokens, API keys
  config        jsonb default '{}',               -- shop domain, sheet ID, etc.
  status        text default 'active' check (status in ('active','paused','error')),
  last_synced_at timestamptz,
  sync_interval_minutes int default 360,          -- default: every 6 hours
  error_message text,
  created_at    timestamptz default now()
);

-- ── UNIFIED DATA MODEL ───────────────────────────────────────
-- Every source maps into this single clean table
create table if not exists public.unified_data (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users on delete cascade,
  source_id       uuid references public.connected_sources on delete cascade,
  source_type     text not null,

  -- Core fields (the SignalX unified model)
  record_date     date,
  sku             text,
  product_name    text,
  category        text,
  variant         text,                           -- size, colour, etc.
  supplier        text,

  -- Sales
  units_sold      numeric default 0,
  selling_price   numeric default 0,
  discount        numeric default 0,
  gross_revenue   numeric default 0,              -- units_sold * selling_price
  net_revenue     numeric default 0,              -- after discount

  -- Costs
  cost_price      numeric default 0,
  shipping_cost   numeric default 0,
  packaging_cost  numeric default 0,
  marketplace_fee numeric default 0,              -- Shopify, Jumia, etc.
  tax             numeric default 0,
  total_cost      numeric default 0,              -- sum of all costs

  -- Margin
  gross_margin    numeric default 0,              -- (net_revenue - cost_price) / net_revenue * 100
  net_margin      numeric default 0,              -- after all costs

  -- Inventory
  stock_level     numeric default 0,
  stock_movement  numeric default 0,              -- + in, - out
  low_stock_flag  boolean default false,
  damaged_stock   numeric default 0,

  -- Channel & geography
  channel         text,                           -- shopify, square, stripe, manual
  customer_region text,
  currency        text default 'USD',

  -- Marketing
  ad_spend        numeric default 0,
  campaign        text,
  coupon_code     text,
  coupon_discount numeric default 0,

  -- Finance
  payment_status  text,                           -- paid, refunded, pending
  refund_amount   numeric default 0,
  payout_amount   numeric default 0,

  -- Source reference
  source_record_id text,                          -- original ID from source system
  raw_data        jsonb default '{}',             -- full original record for debugging

  created_at      timestamptz default now(),
  updated_at      timestamptz default now(),

  -- Prevent duplicate imports
  unique(user_id, source_type, source_record_id)
);

-- ── SYNC LOG ─────────────────────────────────────────────────
create table if not exists public.sync_log (
  id           uuid primary key default gen_random_uuid(),
  source_id    uuid references public.connected_sources on delete cascade,
  user_id      uuid references auth.users on delete cascade,
  status       text check (status in ('success','error','partial')),
  records_synced int default 0,
  records_new    int default 0,
  records_updated int default 0,
  error_message text,
  started_at   timestamptz default now(),
  finished_at  timestamptz
);

-- ── WEBHOOK EVENTS (incoming) ────────────────────────────────
create table if not exists public.webhook_events (
  id           uuid primary key default gen_random_uuid(),
  source_type  text not null,
  event_type   text not null,                     -- order.created, payment.succeeded, etc.
  payload      jsonb not null,
  processed    boolean default false,
  error        text,
  received_at  timestamptz default now()
);

-- ── RLS ──────────────────────────────────────────────────────
alter table public.connected_sources enable row level security;
alter table public.unified_data       enable row level security;
alter table public.sync_log           enable row level security;
alter table public.webhook_events     enable row level security;

create policy "Own sources"       on public.connected_sources for all using (auth.uid() = user_id);
create policy "Own unified data"  on public.unified_data       for all using (auth.uid() = user_id);
create policy "Own sync log"      on public.sync_log           for all using (auth.uid() = user_id);

-- ── INDEXES ──────────────────────────────────────────────────
create index if not exists idx_unified_user       on public.unified_data(user_id);
create index if not exists idx_unified_date       on public.unified_data(user_id, record_date desc);
create index if not exists idx_unified_source     on public.unified_data(source_id);
create index if not exists idx_unified_sku        on public.unified_data(user_id, sku);
create index if not exists idx_unified_channel    on public.unified_data(user_id, channel);
create index if not exists idx_sources_user       on public.connected_sources(user_id);
create index if not exists idx_sync_log_source    on public.sync_log(source_id, started_at desc);
create index if not exists idx_webhook_unprocessed on public.webhook_events(processed, received_at);
