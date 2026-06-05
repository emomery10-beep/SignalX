-- ============================================================
-- Migration: Update POS Transactions Payment Types
-- Adds 'mpesa' and 'mobile_pay' to payment_type enum
-- ============================================================

-- Add new payment types to pos_transactions
-- Note: This drops and recreates the constraint to add new values
-- Existing data is preserved

alter table public.pos_transactions
  drop constraint if exists pos_transactions_payment_type_check;

alter table public.pos_transactions
  add constraint pos_transactions_payment_type_check
    check (payment_type in ('cash', 'card', 'mpesa', 'mobile_pay', 'other'));

-- Add payment_status column if it doesn't exist
-- Tracks: pending, paid, refunded, partial_refund
alter table public.pos_transactions
  add column if not exists payment_status text default 'pending'
    check (payment_status in ('pending', 'paid', 'refunded', 'partial_refund'));

-- Index for quick lookup of paid transactions
create index if not exists idx_pos_transactions_payment_status
  on public.pos_transactions(owner_id, payment_status);
