-- ============================================================
-- AskBiz Migration — offline-write idempotency for parcels,
-- restaurant orders, service jobs, and factory captures.
-- Same pattern as pos_transactions (20260702_pos_tx_client_id.sql):
-- a client_tx_id lets a request retried after a network timeout,
-- or replayed from an offline queue, be recorded at most once.
-- Nullable column + partial unique index = zero-downtime,
-- zero-backfill; existing rows and non-offline insert paths
-- (e.g. restaurant online-orders) are unaffected.
-- ============================================================

alter table public.pos_parcels
  add column if not exists client_tx_id text;
alter table public.restaurant_orders
  add column if not exists client_tx_id text;
alter table public.pos_service_jobs
  add column if not exists client_tx_id text;
alter table public.pos_factory_captures
  add column if not exists client_tx_id text;

create unique index if not exists idx_pos_parcels_client_tx_id
  on public.pos_parcels (owner_id, client_tx_id)
  where client_tx_id is not null;

create unique index if not exists idx_restaurant_orders_client_tx_id
  on public.restaurant_orders (owner_id, client_tx_id)
  where client_tx_id is not null;

create unique index if not exists idx_pos_service_jobs_client_tx_id
  on public.pos_service_jobs (owner_id, client_tx_id)
  where client_tx_id is not null;

create unique index if not exists idx_pos_factory_captures_client_tx_id
  on public.pos_factory_captures (owner_id, client_tx_id)
  where client_tx_id is not null;
