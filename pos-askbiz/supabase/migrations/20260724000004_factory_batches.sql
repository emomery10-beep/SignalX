-- ============================================================
-- Factory data model extension (3/8): Batch traceability
-- ------------------------------------------------------------
-- The Batch page (app/factory/batch/page.tsx) already has a full
-- scan-a-checkpoint UI, but batch_ref is just free text a worker
-- retypes by hand at each checkpoint (intake / in_progress /
-- qc_pass / qc_fail / dispatch) with no real backing row, no
-- identity, and no way to say "this output consumed these specific
-- intake batch(es)".
--
-- This migration gives the Batch page a real backing table
-- (pos_factory_batches + pos_factory_batch_events, matching the
-- frontend's Batch / BatchEvent shapes exactly) and adds a join
-- table (pos_factory_batch_captures) so any capture can record
-- which raw-material batch(es) it consumed — a join table rather
-- than a single FK because consumption is genuinely many-to-many:
-- one output can blend several intake batches, and one intake batch
-- can be partially consumed across several output events.
-- ============================================================

-- ── Batch identity ──────────────────────────────────────────────
-- Frontend Batch shape: { id, batch_ref, product_name, status,
-- updated_at, events: BatchEvent[] } (app/factory/batch/page.tsx:29-32)
CREATE TABLE IF NOT EXISTS public.pos_factory_batches (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id      uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  location_id   uuid        REFERENCES public.pos_locations(id) ON DELETE SET NULL,

  batch_ref     text        NOT NULL,   -- the human-entered code, e.g. "SB-2607"
  product_name  text,

  -- Mirrors the 5 checkpoint ids the Batch page already uses
  -- (buildCheckpoints() in app/factory/batch/page.tsx:34-42) — this is
  -- "latest checkpoint reached", updated each time a new batch event
  -- is logged.
  status        text        NOT NULL DEFAULT 'intake'
                            CHECK (status IN ('intake', 'in_progress', 'qc_pass', 'qc_fail', 'dispatch')),

  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),

  -- A worker retypes the same batch_ref to add checkpoints to the same
  -- batch (POST body already sends create_if_missing: true — see
  -- app/factory/batch/page.tsx:174) — unique per owner so that lookup
  -- is unambiguous.
  UNIQUE (owner_id, batch_ref)
);

CREATE INDEX IF NOT EXISTS pos_factory_batches_owner_idx
  ON public.pos_factory_batches (owner_id, status);

CREATE OR REPLACE FUNCTION public.set_factory_batch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_factory_batch_updated_at ON public.pos_factory_batches;
CREATE TRIGGER set_factory_batch_updated_at
  BEFORE UPDATE ON public.pos_factory_batches
  FOR EACH ROW EXECUTE FUNCTION public.set_factory_batch_updated_at();

ALTER TABLE public.pos_factory_batches ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "owner_all_factory_batches" ON public.pos_factory_batches;
CREATE POLICY "owner_all_factory_batches" ON public.pos_factory_batches
  FOR ALL USING (owner_id = auth.uid());

-- ── Batch checkpoint photo trail ─────────────────────────────────
-- Frontend BatchEvent shape: { id, checkpoint, photo_url, created_at }
-- (app/factory/batch/page.tsx:28) — owner_id is denormalised onto this
-- table (rather than requiring a join through pos_factory_batches for
-- every RLS check) to match the scoping style already used across the
-- other factory tables.
CREATE TABLE IF NOT EXISTS public.pos_factory_batch_events (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id      uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  batch_id      uuid        NOT NULL REFERENCES public.pos_factory_batches(id) ON DELETE CASCADE,

  checkpoint    text        NOT NULL
                            CHECK (checkpoint IN ('intake', 'in_progress', 'qc_pass', 'qc_fail', 'dispatch')),
  photo_url     text        NOT NULL,
  storage       text        NOT NULL DEFAULT 'supabase' CHECK (storage IN ('supabase', 'fallback')),

  logged_by     uuid        REFERENCES public.pos_staff(id) ON DELETE SET NULL,
  client_tx_id  text,       -- offline-write idempotency, same pattern as pos_factory_captures

  created_at    timestamptz NOT NULL DEFAULT now()
);

-- Defensive: a prior partial run of this migration (retried after a later
-- statement failed) may have created this table before this column was
-- added to the definition above. ADD COLUMN IF NOT EXISTS makes re-running
-- safe regardless of which shape the table currently has.
ALTER TABLE public.pos_factory_batch_events ADD COLUMN IF NOT EXISTS client_tx_id text;

CREATE INDEX IF NOT EXISTS pos_factory_batch_events_batch_idx
  ON public.pos_factory_batch_events (batch_id, created_at);
CREATE INDEX IF NOT EXISTS pos_factory_batch_events_owner_idx
  ON public.pos_factory_batch_events (owner_id, created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS idx_pos_factory_batch_events_client_tx_id
  ON public.pos_factory_batch_events (owner_id, client_tx_id)
  WHERE client_tx_id IS NOT NULL;

ALTER TABLE public.pos_factory_batch_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "owner_all_factory_batch_events" ON public.pos_factory_batch_events;
CREATE POLICY "owner_all_factory_batch_events" ON public.pos_factory_batch_events
  FOR ALL USING (owner_id = auth.uid());

-- ── Traceability join: capture ↔ batch(es) consumed ──────────────
-- A capture (typically an 'output' or 'dispatch' capture) can consume
-- one or more raw-material batches; a batch can also be partially
-- consumed across several captures over time — genuinely many-to-many,
-- hence a join table rather than a single FK column on either side.
CREATE TABLE IF NOT EXISTS public.pos_factory_batch_captures (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id            uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  batch_id            uuid        NOT NULL REFERENCES public.pos_factory_batches(id) ON DELETE CASCADE,
  capture_id          uuid        NOT NULL REFERENCES public.pos_factory_captures(id) ON DELETE CASCADE,

  quantity_consumed   numeric,    -- optional: how much of batch_id went into capture_id

  created_at          timestamptz NOT NULL DEFAULT now(),

  UNIQUE (batch_id, capture_id)
);

CREATE INDEX IF NOT EXISTS pos_factory_batch_captures_batch_idx
  ON public.pos_factory_batch_captures (batch_id);
CREATE INDEX IF NOT EXISTS pos_factory_batch_captures_capture_idx
  ON public.pos_factory_batch_captures (capture_id);

ALTER TABLE public.pos_factory_batch_captures ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "owner_all_factory_batch_captures" ON public.pos_factory_batch_captures;
CREATE POLICY "owner_all_factory_batch_captures" ON public.pos_factory_batch_captures
  FOR ALL USING (owner_id = auth.uid());

-- ── Wire up the forward reference from production runs ──────────
-- pos_factory_production_runs.input_batch_id was added as a plain
-- uuid column in the previous migration (this table didn't exist yet
-- at that point in the review batch); attach the real FK now.
ALTER TABLE public.pos_factory_production_runs
  DROP CONSTRAINT IF EXISTS pos_factory_production_runs_input_batch_id_fkey;
ALTER TABLE public.pos_factory_production_runs
  ADD CONSTRAINT pos_factory_production_runs_input_batch_id_fkey
  FOREIGN KEY (input_batch_id) REFERENCES public.pos_factory_batches(id) ON DELETE SET NULL;
