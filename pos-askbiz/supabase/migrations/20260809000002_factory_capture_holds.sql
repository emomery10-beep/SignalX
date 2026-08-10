-- ============================================================
-- Factory capture holds: batch-not-yet-releasable gate
-- ------------------------------------------------------------
-- Cross-template audit found the same real pattern in 4 of the 12
-- factory-type templates (pos-askbiz/lib/factory-templates/):
--   - water.ts    : a required regulatory lab-clearance gate, no
--                   fixed duration (NAFDAC/Ghana FDA/KEBS)
--   - soap.ts     : a 35-day cure
--   - concrete_blocks.ts : a 7-day minimum-handling cure AND a
--                   separate, later 28-day full-strength milestone
--   - dairy.ts    : a 14-day ripen, but ONLY on the cheese path —
--                   yoghurt and ghee/butter are same-day, unaffected
--
-- One row per gate rather than columns on pos_factory_captures,
-- because concrete_blocks alone already proves "one hold per
-- capture" doesn't hold up (a real batch needs two: a blocking
-- minimum-cure gate and an informational full-strength milestone).
-- Anchored to pos_factory_captures (not pos_factory_batches or
-- pos_factory_production_runs) because captures are the one path
-- every factory owner already reliably uses regardless of which
-- other factory tools (Batch scan, production runs) they've
-- adopted — see the schema-drift note on 20260725000003 for why
-- pos_factory_batches specifically isn't a safe foundation to build
-- more on top of without its own live-reliability check first.
--
-- Design (agreed with user 2026-08-09): warn-and-require-explicit-
-- override at dispatch, never a hard block — hence is_blocking
-- defaults false and nothing in this migration enforces a gate at
-- the database level; that's UI/API behaviour layered on top.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.pos_factory_capture_holds (
  id                    uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id              uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  capture_id            uuid        NOT NULL REFERENCES public.pos_factory_captures(id) ON DELETE CASCADE,

  label                 text        NOT NULL,   -- "Curing", "Quality hold (NAFDAC)", "Full strength"

  -- Duration-based holds set releasable_at (capture time + N days) and
  -- clear themselves once that passes, no action needed. Regulatory holds
  -- (no fixed duration) leave this null and can only resolve via cleared_at.
  releasable_at         timestamptz,

  -- Manual clearance — the only way a regulatory hold ever resolves, and
  -- also usable to clear a duration hold early (e.g. a rush order). Camera-
  -- first: a photo is required at the API layer (not enforced here) so
  -- there's always a visual record of what justified an early/regulatory
  -- clearance, same evidentiary pattern as every other factory capture.
  cleared_at            timestamptz,
  cleared_by            uuid        REFERENCES public.pos_staff(id) ON DELETE SET NULL,
  clearance_photo_url   text,

  -- false = informational only (e.g. concrete's "full strength" milestone),
  -- never triggers the dispatch warn-and-override flow. true = the primary
  -- gate that does. Both kinds are equally non-blocking at the DB level —
  -- this only controls whether the UI surfaces a dispatch-time interruption.
  is_blocking           boolean     NOT NULL DEFAULT true,

  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS pos_factory_capture_holds_owner_idx
  ON public.pos_factory_capture_holds (owner_id, cleared_at);
CREATE INDEX IF NOT EXISTS pos_factory_capture_holds_capture_idx
  ON public.pos_factory_capture_holds (capture_id);

CREATE OR REPLACE FUNCTION public.set_factory_capture_hold_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_factory_capture_hold_updated_at ON public.pos_factory_capture_holds;
CREATE TRIGGER set_factory_capture_hold_updated_at
  BEFORE UPDATE ON public.pos_factory_capture_holds
  FOR EACH ROW EXECUTE FUNCTION public.set_factory_capture_hold_updated_at();

ALTER TABLE public.pos_factory_capture_holds ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "owner_all_factory_capture_holds" ON public.pos_factory_capture_holds;
CREATE POLICY "owner_all_factory_capture_holds" ON public.pos_factory_capture_holds
  FOR ALL USING (owner_id = auth.uid());

-- ── Manual hold override, for factory types outside the 12-template
-- library (profiles.factory_type = 'other' or unset) ─────────────
-- A known template's hold rule is auto-detected per-recipe (see
-- lib/factory-templates' new `holdRule` field) and needs no owner
-- input. This is the fallback for a business this template library
-- has never seen — self-service, applies factory-type-wide (not
-- per-recipe, since there's no recipe data to be precise with for
-- an unmodelled business) rather than doing nothing at all for
-- anyone outside the 4 types this migration was researched against.
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS factory_hold_enabled boolean NOT NULL DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS factory_hold_days integer;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS factory_hold_label text;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'profiles_factory_hold_days_check'
      AND conrelid = 'public.profiles'::regclass
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_factory_hold_days_check
      CHECK (factory_hold_days IS NULL OR factory_hold_days > 0);
  END IF;
END $$;
