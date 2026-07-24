-- ============================================================
-- Factory data model extension (2/8): Co-products / production runs
-- ------------------------------------------------------------
-- One production run commonly yields two sellable outputs (oil +
-- press-cake, flour + bran, cheese + whey). Today one capture =
-- one product, with no way to say two captures came from the same
-- event.
--
-- pos_factory_production_runs is a lightweight grouping row (not a
-- new capture type) that two or more output captures can share via
-- the new pos_factory_captures.production_run_id column below, so
-- co-products from one event are linked instead of orphaned.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.pos_factory_production_runs (
  id                    uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id              uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  location_id           uuid        REFERENCES public.pos_locations(id) ON DELETE SET NULL,

  -- Optional link to the production shift this run happened during
  -- (pos_factory_production_shifts is created by a later migration in
  -- this series — the FK is added here as a forward reference since
  -- both tables ship in the same review batch).
  production_shift_id   uuid,

  -- Optional pointer to the primary raw-material batch fed into this
  -- run. Full many-to-many traceability (a run/capture consuming
  -- several batches) is handled by pos_factory_batch_captures in the
  -- batches migration — this column is just a convenience shortcut for
  -- "what mainly went in", not the source of truth for traceability.
  input_batch_id        uuid,

  input_product_name    text,
  notes                 text,
  created_by            uuid        REFERENCES public.pos_staff(id) ON DELETE SET NULL,

  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS pos_factory_production_runs_owner_idx
  ON public.pos_factory_production_runs (owner_id, created_at DESC);

CREATE OR REPLACE FUNCTION public.set_factory_production_run_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_factory_production_run_updated_at ON public.pos_factory_production_runs;
CREATE TRIGGER set_factory_production_run_updated_at
  BEFORE UPDATE ON public.pos_factory_production_runs
  FOR EACH ROW EXECUTE FUNCTION public.set_factory_production_run_updated_at();

ALTER TABLE public.pos_factory_production_runs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "owner_all_factory_production_runs" ON public.pos_factory_production_runs;
CREATE POLICY "owner_all_factory_production_runs" ON public.pos_factory_production_runs
  FOR ALL USING (owner_id = auth.uid());

-- ── Link captures to a production run ──────────────────────────
-- Nullable, additive. Two output captures (e.g. oil + press-cake)
-- submitted for the same event share a production_run_id so they can
-- be queried/displayed together instead of appearing as unrelated rows.
ALTER TABLE public.pos_factory_captures
  ADD COLUMN IF NOT EXISTS production_run_id uuid
  REFERENCES public.pos_factory_production_runs(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS pos_factory_captures_production_run_idx
  ON public.pos_factory_captures (production_run_id);
