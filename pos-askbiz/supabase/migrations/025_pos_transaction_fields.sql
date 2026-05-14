-- ============================================================
-- AskBiz Migration 025 — Add missing POS transaction fields
-- Adds: discount_amount, amount_tendered to pos_transactions
-- ============================================================

-- Add discount_amount column
alter table public.pos_transactions
  add column if not exists discount_amount numeric default 0;

-- Add amount_tendered column (for cash payment tracking)
alter table public.pos_transactions
  add column if not exists amount_tendered numeric;

-- Create index on created_at for transaction queries
create index if not exists idx_pos_tx_created_at 
  on public.pos_transactions(created_at desc);

-- Document the fields:
-- discount_amount: Amount of discount applied (0 if none)
-- amount_tendered: Cash amount given by customer (null if card payment)
