-- ============================================================
-- Offline-write idempotency for pos_customer_credit (the "deni"
-- ledger — real customer debt/payment amounts).
--
-- Every other money-moving POS write path already has this
-- (pos_transactions, pos_parcels, restaurant_orders, pos_service_jobs,
-- pos_factory_captures — see 20260702_pos_tx_client_id.sql and
-- 20260703_pos_offline_client_tx_id.sql) but this one was missed:
-- a duplicate submit/retry on a flaky connection (payment/opening
-- actions in app/api/pos/customer-credit/route.ts) currently double-
-- records a debt or repayment with no protection at all. Same
-- pattern: nullable column + partial unique index, zero-downtime,
-- zero-backfill.
-- ============================================================

alter table public.pos_customer_credit
  add column if not exists client_tx_id text;

create unique index if not exists idx_pos_customer_credit_client_tx_id
  on public.pos_customer_credit (owner_id, client_tx_id)
  where client_tx_id is not null;
