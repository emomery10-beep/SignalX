-- ============================================================
-- Factory captures: packaging type + sale annotation
-- ------------------------------------------------------------
-- Two additive extensions to pos_factory_captures, both requested
-- directly by a real sesame-oil-pressing factory owner reviewing
-- the live product against their actual 6-step workflow (intake ->
-- press -> weigh+sell waste -> package into sized containers ->
-- wholesale -> ship), cross-checked against all 12 factory-type
-- templates for the same pattern (pos-askbiz/lib/factory-templates/):
--
-- 1. 'packaging' capture type -- packaging bulk output into
--    discrete, sized sellable units (e.g. 25 x 20L jerry cans).
--    Every template that reaches a finished product describes an
--    explicit Packaging stage distinct from Output and Dispatch
--    (water, maize_milling, rice_milling, dairy, bakery, soap,
--    concrete_blocks, poultry, fish_smoking templates). Reuses the
--    existing product_name/quantity/batch_ref(unit) shape exactly
--    like every other type -- quantity = container count,
--    batch_ref = container size e.g. "20L" -- so no new column is
--    needed for it.
--
-- 2. sale_price / buyer_name -- lets a wastage OR output capture be
--    marked as sold. Covers two related real needs found across
--    the template audit: (a) true waste sold as a byproduct (e.g.
--    sesame husks), and (b) a genuine co-product wrongly at risk of
--    being logged as wastage -- sesame_oil.ts's press-cake,
--    maize_milling.ts's bran/germ, and dairy.ts's whey are each
--    explicitly flagged in their own template text as "a real,
--    sellable co-product... do not log it under wastage" -- so
--    both fields are made available on 'output' captures too, not
--    just 'wastage' ones. Both nullable/optional -- a capture with
--    neither set behaves exactly as it does today.
--
-- Applied live via `supabase db query --linked` (no staging DB
-- exists for this project -- see the "no staging environment"
-- note elsewhere in this codebase's docs). Idempotent throughout
-- so a replay against an already-patched DB, or a fresh local
-- `supabase db reset`, both land on the same schema.
-- ============================================================

-- 1. Widen the capture type CHECK to include 'packaging'.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'pos_factory_captures_type_check'
      AND conrelid = 'public.pos_factory_captures'::regclass
  ) THEN
    ALTER TABLE public.pos_factory_captures DROP CONSTRAINT pos_factory_captures_type_check;
  END IF;
END $$;

ALTER TABLE public.pos_factory_captures
  ADD CONSTRAINT pos_factory_captures_type_check
  CHECK (type IN ('intake', 'output', 'wastage', 'dispatch', 'packaging'));

-- 2. Sale annotation -- nullable, additive, no default behaviour change.
ALTER TABLE public.pos_factory_captures ADD COLUMN IF NOT EXISTS sale_price numeric;
ALTER TABLE public.pos_factory_captures ADD COLUMN IF NOT EXISTS buyer_name text;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'pos_factory_captures_sale_price_check'
      AND conrelid = 'public.pos_factory_captures'::regclass
  ) THEN
    ALTER TABLE public.pos_factory_captures
      ADD CONSTRAINT pos_factory_captures_sale_price_check
      CHECK (sale_price IS NULL OR sale_price >= 0);
  END IF;
END $$;
