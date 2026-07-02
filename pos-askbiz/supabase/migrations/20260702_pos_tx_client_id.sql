-- ============================================================
-- AskBiz Migration — POS transaction idempotency
-- Adds client_tx_id so a checkout retried after a network
-- timeout (or replayed from the offline queue) can never be
-- recorded twice. The API dedupes on (owner_id, client_tx_id).
-- ============================================================

alter table public.pos_transactions
  add column if not exists client_tx_id text;

-- Partial unique index: only enforced when a client id is sent,
-- so legacy rows and non-POS inserts are unaffected.
create unique index if not exists idx_pos_transactions_client_tx_id
  on public.pos_transactions (owner_id, client_tx_id)
  where client_tx_id is not null;
