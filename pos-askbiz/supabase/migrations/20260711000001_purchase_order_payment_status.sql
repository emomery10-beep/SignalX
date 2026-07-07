-- ============================================================
-- Purchase order payment tracking — lets a received order be marked
-- paid/partially paid, distinct from `status` (which tracks STOCK
-- receipt, not invoice payment). Needed so the Zakat calculator (root
-- app) can treat a genuinely-unpaid received order as a real
-- deductible short-term payable, instead of guessing.
--
-- Byte-identical mirror of the root app's matching migration — both
-- POS apps share one Supabase project (benptbfiudpfvmvwxcjm).
-- Purely additive + idempotent.
-- ============================================================

alter table public.purchase_orders
  add column if not exists payment_status text not null default 'unpaid',
  add column if not exists paid_at         timestamptz,
  add column if not exists amount_paid     numeric(12,2) not null default 0;

do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'purchase_orders_payment_status_check') then
    alter table public.purchase_orders add constraint purchase_orders_payment_status_check
      check (payment_status in ('unpaid', 'partial', 'paid'));
  end if;
end $$;
