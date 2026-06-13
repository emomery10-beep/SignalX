-- ============================================================
-- Stage 4: Batch camera scan + traceability
-- Workers photograph a batch label at each checkpoint.
-- Every scan is an event; together they form the visual trail.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.pos_factory_batches (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id        uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  location_id     uuid        REFERENCES public.pos_locations(id) ON DELETE SET NULL,

  batch_ref       text        NOT NULL,
  product_name    text,

  status          text        NOT NULL DEFAULT 'active'
                              CHECK (status IN ('active', 'completed', 'on_hold')),

  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.pos_factory_batch_events (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id        uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  batch_id        uuid        NOT NULL REFERENCES public.pos_factory_batches(id) ON DELETE CASCADE,

  checkpoint      text        NOT NULL
                              CHECK (checkpoint IN (
                                'intake',
                                'in_progress',
                                'qc_pass',
                                'qc_fail',
                                'dispatch'
                              )),

  photo_url       text        NOT NULL,
  storage         text        NOT NULL DEFAULT 'fallback'
                              CHECK (storage IN ('supabase', 'fallback')),
  notes           text,

  scanned_by      uuid        REFERENCES public.pos_staff(id) ON DELETE SET NULL,
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS pos_factory_batches_owner_idx
  ON public.pos_factory_batches (owner_id, created_at DESC);

CREATE INDEX IF NOT EXISTS pos_factory_batches_ref_idx
  ON public.pos_factory_batches (owner_id, batch_ref);

CREATE INDEX IF NOT EXISTS pos_factory_batch_events_batch_idx
  ON public.pos_factory_batch_events (batch_id, created_at ASC);

-- updated_at trigger for batches
CREATE OR REPLACE FUNCTION public.set_factory_batches_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS set_factory_batches_updated_at ON public.pos_factory_batches;
CREATE TRIGGER set_factory_batches_updated_at
  BEFORE UPDATE ON public.pos_factory_batches
  FOR EACH ROW EXECUTE FUNCTION public.set_factory_batches_updated_at();

-- RLS
ALTER TABLE public.pos_factory_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pos_factory_batch_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owner_all_factory_batches" ON public.pos_factory_batches
  FOR ALL USING (owner_id = auth.uid());

CREATE POLICY "owner_all_factory_batch_events" ON public.pos_factory_batch_events
  FOR ALL USING (owner_id = auth.uid());
