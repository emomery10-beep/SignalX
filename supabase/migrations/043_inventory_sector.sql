-- ============================================================
-- Migration 043: Add sector tag to inventory items
-- Allows each product/material to be tagged to a specific sector
-- (retail, repair, factory, restaurant, logistics, salon)
-- so that each sector only counts and shows its own inventory.
-- NULL = item is shared across all sectors (backwards compatible).
-- ============================================================

ALTER TABLE public.inventory
  ADD COLUMN IF NOT EXISTS sector text DEFAULT NULL
  CHECK (sector IS NULL OR sector IN ('retail', 'repair', 'factory', 'restaurant', 'logistics', 'salon'));

COMMENT ON COLUMN public.inventory.sector IS
  'Optional sector tag. NULL means item appears in all sectors. '
  'Allowed: retail, repair, factory, restaurant, logistics, salon.';

CREATE INDEX IF NOT EXISTS idx_inventory_sector
  ON public.inventory (owner_id, sector)
  WHERE sector IS NOT NULL;
