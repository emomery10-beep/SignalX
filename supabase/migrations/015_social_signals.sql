-- ── SOCIAL SIGNALS ────────────────────────────────────────────────────────────
-- Stores engagement and commerce data from TikTok Shop, Instagram, Pinterest.
-- Separate from unified_data so social metrics (saves, viral_score, etc.)
-- can be queried independently without polluting the order/revenue table.
create table if not exists public.social_signals (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users on delete cascade,
  source_id        uuid references public.connected_sources on delete cascade,
  source_type      text not null,
  platform         text not null,
  content_id       text not null,
  content_type     text,
  product_name     text,
  sku              text,
  record_date      date,
  views            numeric default 0,
  likes            numeric default 0,
  comments         numeric default 0,
  shares           numeric default 0,
  saves            numeric default 0,
  clicks           numeric default 0,
  impressions      numeric default 0,
  orders           numeric default 0,
  units_sold       numeric default 0,
  gross_revenue    numeric default 0,
  conversion_rate  numeric default 0,
  avg_order_value  numeric default 0,
  save_rate        numeric default 0,
  engagement_rate  numeric default 0,
  viral_score      numeric default 0,
  creator_handle   text,
  campaign_name    text,
  is_paid          boolean default false,
  ad_spend         numeric default 0,
  roas             numeric default 0,
  currency         text default 'GBP',
  raw_data         jsonb default '{}',
  synced_at        timestamptz default now(),
  updated_at       timestamptz default now()
);

create unique index if not exists idx_social_signals_dedup
  on public.social_signals(user_id, source_type, content_id);

create index if not exists idx_social_signals_user
  on public.social_signals(user_id, record_date desc);

alter table public.social_signals enable row level security;

create policy "Own social signals"
  on public.social_signals for all
  using (user_id = auth.uid());
