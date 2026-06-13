-- ============================================================
-- Stage 3: Factory quality defect tracking
-- Workers photograph a defect to open a quality event.
-- Feeds OEE Quality score and owner defect-rate dashboard.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.pos_factory_quality (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id        uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  location_id     uuid        REFERENCES public.pos_locations(id) ON DELETE SET NULL,

  -- Classification
  defect_type     text        NOT NULL
                              CHECK (defect_type IN (
                                'dimensional',
                                'surface',
                                'contamination',
                                'assembly',
                                'packaging',
                                'other'
                              )),
  severity        text        NOT NULL DEFAULT 'major'
                              CHECK (severity IN ('critical', 'major', 'minor')),

  -- What was affected
  product_name    text,
  batch_ref       text,
  quantity_affected numeric   CHECK (quantity_affected >= 0),

  -- Photo evidence (required — camera first)
  photo_url       text        NOT NULL,
  storage         text        NOT NULL DEFAULT 'fallback'
                              CHECK (storage IN ('supabase', 'fallback')),

  notes           text,

  -- Who / status
  reported_by     uuid        REFERENCES public.pos_staff(id) ON DELETE SET NULL,
  status          text        NOT NULL DEFAULT 'open'
                              CHECK (status IN ('open', 'resolved', 'accepted_risk')),

  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS pos_factory_quality_owner_idx
  ON public.pos_factory_quality (owner_id, created_at DESC);

CREATE INDEX IF NOT EXISTS pos_factory_quality_severity_idx
  ON public.pos_factory_quality (owner_id, severity, created_at DESC);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.set_factory_quality_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_factory_quality_updated_at ON public.pos_factory_quality;
CREATE TRIGGER set_factory_quality_updated_at
  BEFORE UPDATE ON public.pos_factory_quality
  FOR EACH ROW EXECUTE FUNCTION public.set_factory_quality_updated_at();

-- RLS
ALTER TABLE public.pos_factory_quality ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owner_all_factory_quality" ON public.pos_factory_quality
  FOR ALL USING (owner_id = auth.uid());
