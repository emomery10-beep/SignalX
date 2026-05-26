-- ============================================================
-- Stage 3: Factory camera captures
-- Each capture (intake / output / wastage / dispatch) is
-- submitted by a floor worker and approved by a supervisor+.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.pos_factory_captures (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id        uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  location_id     uuid        REFERENCES public.pos_locations(id) ON DELETE SET NULL,
  shift_id        uuid        REFERENCES public.pos_shifts(id)    ON DELETE SET NULL,
  captured_by     uuid        REFERENCES public.pos_staff(id)     ON DELETE SET NULL,
  approved_by     uuid        REFERENCES public.pos_staff(id)     ON DELETE SET NULL,

  -- Capture classification
  type            text        NOT NULL CHECK (type IN ('intake', 'output', 'wastage', 'dispatch')),
  status          text        NOT NULL DEFAULT 'pending'
                              CHECK (status IN ('pending', 'approved', 'rejected')),

  -- Photo
  photo_url       text        NOT NULL,
  storage         text        NOT NULL DEFAULT 'supabase' CHECK (storage IN ('supabase', 'fallback')),

  -- Optional metadata
  product_name    text,
  batch_ref       text,
  quantity        numeric,
  notes           text,

  -- Approval
  rejection_reason text,
  approved_at     timestamptz,

  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- Index for common list queries
CREATE INDEX IF NOT EXISTS pos_factory_captures_owner_idx    ON public.pos_factory_captures (owner_id, created_at DESC);
CREATE INDEX IF NOT EXISTS pos_factory_captures_shift_idx    ON public.pos_factory_captures (shift_id);
CREATE INDEX IF NOT EXISTS pos_factory_captures_status_idx   ON public.pos_factory_captures (owner_id, status);
CREATE INDEX IF NOT EXISTS pos_factory_captures_type_idx     ON public.pos_factory_captures (owner_id, type);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.set_factory_capture_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_factory_capture_updated_at ON public.pos_factory_captures;
CREATE TRIGGER set_factory_capture_updated_at
  BEFORE UPDATE ON public.pos_factory_captures
  FOR EACH ROW EXECUTE FUNCTION public.set_factory_capture_updated_at();

-- RLS
ALTER TABLE public.pos_factory_captures ENABLE ROW LEVEL SECURITY;

-- Owner (SaaS owner) can read/write all their captures via service role
-- POS staff access is controlled at the API layer (resolvePosAuth + hasPermission)
CREATE POLICY "owner_all_factory_captures" ON public.pos_factory_captures
  FOR ALL USING (owner_id = auth.uid());

-- ── Storage bucket (run manually in Supabase dashboard if not using CLI) ──
-- INSERT INTO storage.buckets (id, name, public) VALUES ('factory-captures', 'factory-captures', false)
-- ON CONFLICT (id) DO NOTHING;
