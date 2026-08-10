-- ============================================================
-- Factory captures: activate pos_factory_production_runs + intermediates
-- ------------------------------------------------------------
-- pos_factory_production_runs and pos_factory_captures.production_run_id
-- (20260724000003) have shipped since July with zero consumers — this
-- migration is what actually activates them, for coffee.ts's dried
-- parchment coffee / rice_milling.ts's parboiled paddy: real, separately-
-- sellable mid-process intermediates that today have no way to be
-- correctly attributed against the batch they came from (a worker selling
-- part of an intake as an intermediate, then milling the rest, currently
-- makes the yield summary divide by the WHOLE original intake for both
-- outputs — see app/factory/production/page.tsx's yield math).
--
-- run_ref gives a production run the same human-typeable, find-or-create
-- reference that pos_factory_batches.batch_ref already provides for
-- batches — same UX pattern, so a worker already familiar with typing a
-- batch code has nothing new to learn.
-- ============================================================

ALTER TABLE public.pos_factory_production_runs ADD COLUMN IF NOT EXISTS run_ref text;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'pos_factory_production_runs_owner_run_ref_key'
      AND conrelid = 'public.pos_factory_production_runs'::regclass
  ) THEN
    ALTER TABLE public.pos_factory_production_runs
      ADD CONSTRAINT pos_factory_production_runs_owner_run_ref_key UNIQUE (owner_id, run_ref);
  END IF;
END $$;

-- Marks an 'output' capture as a real, separately-sellable mid-process
-- intermediate (parboiled paddy, dried parchment coffee) rather than a
-- final product — distinguishes it visually without inventing a whole new
-- capture type for what is still, mechanically, an output.
ALTER TABLE public.pos_factory_captures ADD COLUMN IF NOT EXISTS is_intermediate boolean NOT NULL DEFAULT false;
