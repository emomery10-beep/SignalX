-- ============================================================
-- freight_quotes — backs /api/freight (ocean/air freight rate comparison) and is
-- read by /api/export. Fully implemented but never migrated, so the insert 400s
-- and no quote is saved. Shape from the route's insert object; reads are a subset.
-- Idempotent.
-- ============================================================
create table if not exists public.freight_quotes (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references auth.users(id) on delete cascade,
  origin_port         text,
  destination_port    text,
  origin_country      text,
  destination_country text,
  weight_kg           numeric,
  volume_cbm          numeric,
  shipment_mode       text,
  cheapest_rate       numeric,
  market_avg_rate     numeric,
  user_paid_rate      numeric,
  overpaying_amount   numeric,
  rates_snapshot      jsonb,
  quoted_at           timestamptz not null default now(),
  created_at          timestamptz not null default now()
);
create index if not exists freight_quotes_user_id_idx on public.freight_quotes(user_id);
alter table public.freight_quotes enable row level security;
drop policy if exists "freight_quotes_owner_all" on public.freight_quotes;
create policy "freight_quotes_owner_all" on public.freight_quotes for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
