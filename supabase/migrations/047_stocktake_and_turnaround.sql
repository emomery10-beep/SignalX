-- ============================================================
-- Stocktake adjustments + repair turnaround tracking
--   1. pos_stock_adjustments — variance trail for stocktakes
--   2. pos_service_jobs.completed_at — accurate repair turnaround
-- ============================================================

-- ── 1. Stock adjustments (stocktake variance trail) ────────
CREATE TABLE IF NOT EXISTS public.pos_stock_adjustments (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id        uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  location_id     uuid        REFERENCES public.pos_locations(id) ON DELETE SET NULL,
  inventory_id    uuid        REFERENCES public.inventory(id)     ON DELETE SET NULL,
  adjusted_by     uuid        REFERENCES public.pos_staff(id)     ON DELETE SET NULL,

  product_name    text,
  system_qty      numeric     NOT NULL DEFAULT 0,   -- stock on record before the count
  counted_qty     numeric     NOT NULL DEFAULT 0,   -- physically counted quantity
  variance        numeric     NOT NULL DEFAULT 0,   -- counted - system
  unit_cost       numeric     NOT NULL DEFAULT 0,   -- cost at time of count
  variance_value  numeric     NOT NULL DEFAULT 0,   -- variance * unit_cost
  reason          text,
  session_ref     text,                             -- groups a single stocktake run

  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS pos_stock_adjustments_owner_idx   ON public.pos_stock_adjustments (owner_id, created_at DESC);
CREATE INDEX IF NOT EXISTS pos_stock_adjustments_session_idx ON public.pos_stock_adjustments (owner_id, session_ref);

ALTER TABLE public.pos_stock_adjustments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owner_all_stock_adjustments" ON public.pos_stock_adjustments
  FOR ALL USING (owner_id = auth.uid());

-- ── 2. Repair turnaround: completed_at stamp ───────────────
ALTER TABLE public.pos_service_jobs
  ADD COLUMN IF NOT EXISTS completed_at timestamptz;

-- Stamp completed_at the first time a job enters completed/collected,
-- and clear it if the job is reopened to an earlier status.
CREATE OR REPLACE FUNCTION public.stamp_service_completed_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.status IN ('completed', 'collected')
     AND (OLD.status IS DISTINCT FROM NEW.status)
     AND NEW.completed_at IS NULL THEN
    NEW.completed_at = now();
  ELSIF NEW.status NOT IN ('completed', 'collected') THEN
    NEW.completed_at = NULL;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS stamp_service_completed_at ON public.pos_service_jobs;
CREATE TRIGGER stamp_service_completed_at
  BEFORE UPDATE ON public.pos_service_jobs
  FOR EACH ROW EXECUTE FUNCTION public.stamp_service_completed_at();

-- Backfill existing completed/collected jobs using updated_at as the best
-- available proxy (only where not already set).
UPDATE public.pos_service_jobs
  SET completed_at = updated_at
  WHERE status IN ('completed', 'collected') AND completed_at IS NULL;
