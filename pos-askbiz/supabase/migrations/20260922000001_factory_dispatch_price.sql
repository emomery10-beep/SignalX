-- ============================================================
-- Factory captures: approver-set dispatch price
-- ------------------------------------------------------------
-- Dispatch captures need a per-unit price so approving a dispatch can pass
-- a real value into syncDispatchToInventory() (inventory.sale_price)
-- instead of always syncing 0. Requested directly by a real sesame-oil
-- factory owner who sells a single product: the approver should get an
-- auto-filled default (8000 KSh, see DEFAULT_DISPATCH_PRICE in
-- app/api/pos/factory/capture/route.ts) that they can amend while
-- approving.
--
-- Deliberately its OWN column, not the existing sale_price (which is
-- worker-entered, at capture time, for output/wastage captures — see
-- 20260809000001_factory_captures_packaging_and_sale.sql). dispatch_price
-- is set ONLY by the approver at approval time (PATCH, capture.approve
-- permission) and the API redacts it from any response reaching a role
-- without that permission, so the staff member who submitted the dispatch
-- can never see or set it — a hard requirement, not a preference.
--
-- Applied live via `supabase db query --linked` (no staging DB exists for
-- this project). Idempotent throughout so a replay against an
-- already-patched DB, or a fresh local `supabase db reset`, both land on
-- the same schema.
-- ============================================================

ALTER TABLE public.pos_factory_captures ADD COLUMN IF NOT EXISTS dispatch_price numeric;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'pos_factory_captures_dispatch_price_check'
      AND conrelid = 'public.pos_factory_captures'::regclass
  ) THEN
    ALTER TABLE public.pos_factory_captures
      ADD CONSTRAINT pos_factory_captures_dispatch_price_check
      CHECK (dispatch_price IS NULL OR dispatch_price >= 0);
  END IF;
END $$;
