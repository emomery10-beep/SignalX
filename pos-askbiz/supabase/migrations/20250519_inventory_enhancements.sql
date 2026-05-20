-- ============================================================
-- Migration: Inventory enhancements
-- Adds expiry_date, batch_number, supplier, brand, category
-- to the inventory table for retail POS requirements
-- ============================================================

ALTER TABLE public.inventory
  ADD COLUMN IF NOT EXISTS expiry_date   date,
  ADD COLUMN IF NOT EXISTS batch_number  text,
  ADD COLUMN IF NOT EXISTS supplier      text,
  ADD COLUMN IF NOT EXISTS brand         text,
  ADD COLUMN IF NOT EXISTS category      text;

-- Fast lookups for expiry alerts (items expiring in next N days)
CREATE INDEX IF NOT EXISTS idx_inventory_expiry
  ON public.inventory (owner_id, expiry_date)
  WHERE expiry_date IS NOT NULL AND active = true;

-- Category filtering/grouping
CREATE INDEX IF NOT EXISTS idx_inventory_category
  ON public.inventory (owner_id, category)
  WHERE category IS NOT NULL AND active = true;

-- Brand filtering
CREATE INDEX IF NOT EXISTS idx_inventory_brand
  ON public.inventory (owner_id, brand)
  WHERE brand IS NOT NULL AND active = true;

COMMENT ON COLUMN public.inventory.expiry_date  IS 'Product expiry/best-before date. Used for expiry alerts and reports.';
COMMENT ON COLUMN public.inventory.batch_number IS 'Batch/lot number for traceability and recall management.';
COMMENT ON COLUMN public.inventory.supplier     IS 'Supplier or vendor name this product is sourced from.';
COMMENT ON COLUMN public.inventory.brand        IS 'Product brand or manufacturer.';
COMMENT ON COLUMN public.inventory.category     IS 'Product category for grouping and filtering (e.g. Oils, Hair Care).';
