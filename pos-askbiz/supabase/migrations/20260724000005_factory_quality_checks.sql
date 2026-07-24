-- ============================================================
-- Factory data model extension (4/8): Quality-hold before dispatch
-- ------------------------------------------------------------
-- The Quality page (app/factory/quality/page.tsx) already has a full
-- "log a defect" UI — defect_type, severity, quantity_affected,
-- product_name, notes, photo — but it is freestanding: no link to a
-- batch or capture, and there is no pass/fail gate at all, only ever
-- a defect log. There is no way to say "this batch passed its test,
-- cleared for dispatch" — directly relevant for water/dairy where a
-- regulator requires batch testing before sale.
--
-- pos_factory_quality_checks is linked (both optionally, nullable)
-- to a batch and/or a capture, and carries a required pass/fail
-- outcome. batch_id/capture_id are nullable because the current
-- quality/page.tsx UI does not yet collect a batch reference — the
-- table supports it so a future UI revision (batch selector on the
-- quality flow) can start populating it without another migration.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.pos_factory_quality_checks (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id            uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  location_id         uuid        REFERENCES public.pos_locations(id) ON DELETE SET NULL,

  batch_id            uuid        REFERENCES public.pos_factory_batches(id)  ON DELETE SET NULL,
  capture_id          uuid        REFERENCES public.pos_factory_captures(id) ON DELETE SET NULL,

  -- Required pass/fail gate. The existing quality/page.tsx UI only ever
  -- logs a defect (there is no "log a pass" flow yet), so an API route
  -- built against this table should default outcome = 'fail' for
  -- submissions coming from that page; 'pass' is here for a future
  -- explicit QC-clearance flow (e.g. a "clear for dispatch" action on
  -- the batch page).
  outcome             text        NOT NULL CHECK (outcome IN ('pass', 'fail')),

  -- Nullable: a 'pass' outcome has no defect. Values match
  -- buildDefectTypes()/buildSeverities() in app/factory/quality/page.tsx:28-45.
  defect_type         text        CHECK (defect_type IS NULL OR defect_type IN
                                    ('dimensional', 'surface', 'contamination', 'assembly', 'packaging', 'other')),
  severity            text        CHECK (severity IS NULL OR severity IN ('critical', 'major', 'minor')),

  quantity_affected   numeric,
  product_name        text,

  photo_url           text        NOT NULL,
  storage              text        NOT NULL DEFAULT 'supabase' CHECK (storage IN ('supabase', 'fallback')),
  notes               text,

  inspected_by        uuid        REFERENCES public.pos_staff(id) ON DELETE SET NULL,
  client_tx_id        text,       -- offline-write idempotency, same pattern as pos_factory_captures

  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS pos_factory_quality_checks_owner_idx
  ON public.pos_factory_quality_checks (owner_id, created_at DESC);
CREATE INDEX IF NOT EXISTS pos_factory_quality_checks_batch_idx
  ON public.pos_factory_quality_checks (batch_id);
CREATE INDEX IF NOT EXISTS pos_factory_quality_checks_capture_idx
  ON public.pos_factory_quality_checks (capture_id);
CREATE INDEX IF NOT EXISTS pos_factory_quality_checks_outcome_idx
  ON public.pos_factory_quality_checks (owner_id, outcome);
-- Defensive: a prior partial run of this migration (retried after a later
-- statement failed) may have created this table before this column was
-- added to the definition above. ADD COLUMN IF NOT EXISTS makes re-running
-- safe regardless of which shape the table currently has.
ALTER TABLE public.pos_factory_quality_checks ADD COLUMN IF NOT EXISTS client_tx_id text;

CREATE UNIQUE INDEX IF NOT EXISTS idx_pos_factory_quality_checks_client_tx_id
  ON public.pos_factory_quality_checks (owner_id, client_tx_id)
  WHERE client_tx_id IS NOT NULL;

CREATE OR REPLACE FUNCTION public.set_factory_quality_check_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_factory_quality_check_updated_at ON public.pos_factory_quality_checks;
CREATE TRIGGER set_factory_quality_check_updated_at
  BEFORE UPDATE ON public.pos_factory_quality_checks
  FOR EACH ROW EXECUTE FUNCTION public.set_factory_quality_check_updated_at();

ALTER TABLE public.pos_factory_quality_checks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "owner_all_factory_quality_checks" ON public.pos_factory_quality_checks;
CREATE POLICY "owner_all_factory_quality_checks" ON public.pos_factory_quality_checks
  FOR ALL USING (owner_id = auth.uid());
