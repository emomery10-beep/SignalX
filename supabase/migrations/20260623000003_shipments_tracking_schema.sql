-- ============================================================
-- Shipment-tracking schema completion. The shipments table exists in prod, and
-- the feature is fully built (shipments UI, /api/webhooks/17track, /api/track,
-- chat/ask integration, carrier scoring) — but several columns and two whole
-- tables it depends on were never migrated, so the 17track webhook's writes and
-- the dashboard reads 400/return undefined. Shapes derived from the code's
-- insert/upsert objects (authoritative) and verified against every read site.
-- Idempotent: add-column / create-table if not exists, drop-then-create policies.
-- ============================================================

-- ── shipments: columns the tracking feature reads/writes but prod lacks ──
alter table public.shipments add column if not exists carrier_name text;
alter table public.shipments add column if not exists delay_days integer;
alter table public.shipments add column if not exists origin_country text;
alter table public.shipments add column if not exists destination_country text;

-- ── shipment_alerts — critical/customs/delay alerts raised by the 17track webhook ──
create table if not exists public.shipment_alerts (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users(id) on delete cascade,
  shipment_id      uuid references public.shipments(id) on delete cascade,
  tracking_number  text,
  alert_type       text,                         -- 'critical' | 'customs_hold' | 'delay'
  alert_level      text,                         -- 'critical' | 'warning'
  message          text,
  financial_impact numeric(12,2),
  delay_days       integer,
  is_read          boolean not null default false,
  created_at       timestamptz not null default now()
);
create index if not exists shipment_alerts_user_id_idx on public.shipment_alerts(user_id);
create index if not exists shipment_alerts_shipment_id_idx on public.shipment_alerts(shipment_id);
create index if not exists shipment_alerts_unread_idx on public.shipment_alerts(user_id, is_read);
alter table public.shipment_alerts enable row level security;
drop policy if exists "shipment_alerts_owner_all" on public.shipment_alerts;
create policy "shipment_alerts_owner_all" on public.shipment_alerts for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ── carrier_performance — per-route carrier transit/on-time scoring ──
create table if not exists public.carrier_performance (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references auth.users(id) on delete cascade,
  carrier_code      text,
  carrier_name      text,
  route_origin      text,
  route_destination text,
  transit_days      integer,
  on_time           boolean,
  had_customs_hold  boolean,
  recorded_at       timestamptz not null default now(),
  created_at        timestamptz not null default now(),
  unique (user_id, carrier_code, route_origin, route_destination)
);
create index if not exists carrier_performance_user_id_idx on public.carrier_performance(user_id);
alter table public.carrier_performance enable row level security;
drop policy if exists "carrier_performance_owner_all" on public.carrier_performance;
create policy "carrier_performance_owner_all" on public.carrier_performance for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
