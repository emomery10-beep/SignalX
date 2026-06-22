-- ============================================================
-- Stage 6: Waybill camera scan + on-time dispatch tracking
-- Workers photograph the waybill before goods leave the floor.
-- Scheduled vs actual dispatch times compute the on-time rate.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.pos_factory_waybills (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id        uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  location_id     uuid        REFERENCES public.pos_locations(id) ON DELETE SET NULL,

  waybill_ref     text,
  destination     text        NOT NULL,
  product_name    text,
  quantity        numeric     CHECK (quantity > 0),

  -- Camera evidence (required — the waybill photograph)
  photo_url       text        NOT NULL,
  storage         text        NOT NULL DEFAULT 'fallback'
                              CHECK (storage IN ('supabase', 'fallback')),

  -- On-time tracking
  scheduled_at    timestamptz,
  dispatched_at   timestamptz NOT NULL DEFAULT now(),

  -- is_on_time: null if no schedule, true/false if schedule set (15-min grace).
  -- Use timestamptz subtraction (IMMUTABLE) instead of scheduled_at + interval —
  -- timestamptz + interval is only STABLE, which a generated column rejects.
  -- Algebraically identical to: dispatched_at <= scheduled_at + 15min.
  is_on_time      boolean     GENERATED ALWAYS AS (
    CASE
      WHEN scheduled_at IS NOT NULL
      THEN (dispatched_at - scheduled_at) <= INTERVAL '15 minutes'
      ELSE NULL
    END
  ) STORED,

  vehicle_ref     text,
  notes           text,
  dispatched_by   uuid        REFERENCES public.pos_staff(id) ON DELETE SET NULL,

  status          text        NOT NULL DEFAULT 'dispatched'
                              CHECK (status IN ('dispatched', 'cancelled')),

  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS pos_factory_waybills_owner_idx
  ON public.pos_factory_waybills (owner_id, dispatched_at DESC);

CREATE INDEX IF NOT EXISTS pos_factory_waybills_on_time_idx
  ON public.pos_factory_waybills (owner_id, is_on_time, dispatched_at DESC);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.set_factory_waybills_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS set_factory_waybills_updated_at ON public.pos_factory_waybills;
CREATE TRIGGER set_factory_waybills_updated_at
  BEFORE UPDATE ON public.pos_factory_waybills
  FOR EACH ROW EXECUTE FUNCTION public.set_factory_waybills_updated_at();

-- RLS
ALTER TABLE public.pos_factory_waybills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owner_all_factory_waybills" ON public.pos_factory_waybills
  FOR ALL USING (owner_id = auth.uid());
