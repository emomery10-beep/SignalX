-- ============================================================
-- Stage 2: Factory downtime tracking
-- Workers photograph a stopped machine to start a downtime
-- event. A second photo of the running machine closes it.
-- OEE Availability is derived from today's completed events.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.pos_factory_downtime (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id        uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  location_id     uuid        REFERENCES public.pos_locations(id) ON DELETE SET NULL,

  -- Machine identification
  machine_name    text        NOT NULL DEFAULT 'Machine',

  -- Reason (icon-selected on worker app)
  reason          text        NOT NULL
                              CHECK (reason IN (
                                'breakdown',
                                'changeover',
                                'no_materials',
                                'quality_hold',
                                'planned_maintenance',
                                'other'
                              )),
  notes           text,

  -- Photo evidence
  start_photo_url text        NOT NULL,
  end_photo_url   text,
  storage         text        NOT NULL DEFAULT 'fallback'
                              CHECK (storage IN ('supabase', 'fallback')),

  -- Who reported it
  reported_by     uuid        REFERENCES public.pos_staff(id) ON DELETE SET NULL,
  closed_by       uuid        REFERENCES public.pos_staff(id) ON DELETE SET NULL,

  -- Timestamps
  started_at      timestamptz NOT NULL DEFAULT now(),
  ended_at        timestamptz,

  -- Computed on close (minutes)
  duration_minutes numeric     GENERATED ALWAYS AS (
    CASE
      WHEN ended_at IS NOT NULL
      THEN EXTRACT(EPOCH FROM (ended_at - started_at)) / 60.0
      ELSE NULL
    END
  ) STORED,

  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS pos_factory_downtime_owner_idx
  ON public.pos_factory_downtime (owner_id, started_at DESC);

CREATE INDEX IF NOT EXISTS pos_factory_downtime_active_idx
  ON public.pos_factory_downtime (owner_id, ended_at)
  WHERE ended_at IS NULL;

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.set_factory_downtime_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_factory_downtime_updated_at ON public.pos_factory_downtime;
CREATE TRIGGER set_factory_downtime_updated_at
  BEFORE UPDATE ON public.pos_factory_downtime
  FOR EACH ROW EXECUTE FUNCTION public.set_factory_downtime_updated_at();

-- RLS
ALTER TABLE public.pos_factory_downtime ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owner_all_factory_downtime" ON public.pos_factory_downtime
  FOR ALL USING (owner_id = auth.uid());
