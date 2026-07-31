-- ============================================================
-- pos_transactions / pos_items money columns (018_pos.sql) use bare
-- `numeric` — unbounded precision/scale — unlike newer POS tables
-- (pos_customer_credit, purchase_orders line items, etc.) which
-- correctly use numeric(12,2). Bare numeric isn't a rounding bug by
-- itself (Postgres stores the exact value), but it means nothing at
-- the DB layer stops a future bug from writing e.g. 3-decimal cents
-- into a checkout total, which different app-code paths may then
-- round differently when displaying/summing.
--
-- Guarded: aborts instead of silently rounding if any existing row
-- already has more than 2 decimal places, which a numeric(12,2) cast
-- would otherwise truncate without warning. qty is deliberately left
-- alone — already numeric(10,3) for fractional/weight-sold items
-- (20250520_decimal_qty.sql).
-- ============================================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.pos_transactions WHERE scale(total) > 2)
     OR EXISTS (SELECT 1 FROM public.pos_transactions WHERE scale(subtotal) > 2)
     OR EXISTS (SELECT 1 FROM public.pos_transactions WHERE tax_amount IS NOT NULL AND scale(tax_amount) > 2)
  THEN
    RAISE EXCEPTION 'pos_transactions has money values with >2 decimal places — resolve manually before applying numeric(12,2)';
  END IF;
END $$;

ALTER TABLE public.pos_transactions
  ALTER COLUMN total       TYPE numeric(12,2),
  ALTER COLUMN subtotal    TYPE numeric(12,2),
  ALTER COLUMN tax_amount  TYPE numeric(12,2);

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.pos_items WHERE scale(unit_price) > 2)
     OR EXISTS (SELECT 1 FROM public.pos_items WHERE cost_price IS NOT NULL AND scale(cost_price) > 2)
     OR EXISTS (SELECT 1 FROM public.pos_items WHERE scale(line_total) > 2)
  THEN
    RAISE EXCEPTION 'pos_items has money values with >2 decimal places — resolve manually before applying numeric(12,2)';
  END IF;
END $$;

ALTER TABLE public.pos_items
  ALTER COLUMN unit_price  TYPE numeric(12,2),
  ALTER COLUMN cost_price  TYPE numeric(12,2),
  ALTER COLUMN line_total  TYPE numeric(12,2);
