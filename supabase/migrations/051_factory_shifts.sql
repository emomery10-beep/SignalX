-- ============================================================
-- Stage 5: Shift output photo verification
-- Workers photograph the floor at shift start and the output
-- pile at shift end — creating a camera-backed shift record.
-- Actual output is computed from captures in the shift window.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.pos_factory_shifts (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id          uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  location_id       uuid        REFERENCES public.pos_locations(id) ON DELETE SET NULL,

  shift_name        text        NOT NULL DEFAULT 'Morning'
                                CHECK (shift_name IN ('Morning', 'Afternoon', 'Night', 'Custom')),
  custom_name       text,

  -- Camera evidence (camera-first: start photo required to open shift)
  start_photo_url   text        NOT NULL,
  end_photo_url     text,
  storage           text        NOT NULL DEFAULT 'fallback'
                                CHECK (storage IN ('supabase', 'fallback')),

  -- Who opened / closed
  started_by        uuid        REFERENCES public.pos_staff(id) ON DELETE SET NULL,
  ended_by          uuid        REFERENCES public.pos_staff(id) ON DELETE SET NULL,

  -- Time window
  started_at        timestamptz NOT NULL DEFAULT now(),
  ended_at          timestamptz,

  -- Computed duration in minutes on close
  duration_minutes  numeric     GENERATED ALWAYS AS (
    CASE
      WHEN ended_at IS NOT NULL
      THEN EXTRACT(EPOCH FROM (ended_at - started_at)) / 60.0
      ELSE NULL
    END
  ) STORED,

  -- Optional shift target (for Performance OEE — Stage 3 stub)
  target_units      numeric,
  notes             text,

  status            text        NOT NULL DEFAULT 'active'
                                CHECK (status IN ('active', 'completed', 'abandoned')),

  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS pos_factory_shifts_owner_idx
  ON public.pos_factory_shifts (owner_id, started_at DESC);

CREATE INDEX IF NOT EXISTS pos_factory_shifts_active_idx
  ON public.pos_factory_shifts (owner_id, status)
  WHERE status = 'active';

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.set_factory_shifts_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS set_factory_shifts_updated_at ON public.pos_factory_shifts;
CREATE TRIGGER set_factory_shifts_updated_at
  BEFORE UPDATE ON public.pos_factory_shifts
  FOR EACH ROW EXECUTE FUNCTION public.set_factory_shifts_updated_at();

-- RLS
ALTER TABLE public.pos_factory_shifts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owner_all_factory_shifts" ON public.pos_factory_shifts
  FOR ALL USING (owner_id = auth.uid());
