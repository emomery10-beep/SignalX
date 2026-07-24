-- ============================================================
-- Factory data model extension (7/8): Waybill backend
-- ------------------------------------------------------------
-- The Waybill page (app/factory/waybill/page.tsx) is a complete
-- dispatch-logging UI with zero backend. Frontend Waybill shape:
-- { id, waybill_ref, destination, product_name, quantity, photo_url,
-- scheduled_at, dispatched_at, is_on_time, vehicle_ref }
-- (app/factory/waybill/page.tsx:22-33).
-- ============================================================

CREATE TABLE IF NOT EXISTS public.pos_factory_waybills (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id       uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  location_id    uuid        REFERENCES public.pos_locations(id) ON DELETE SET NULL,

  destination    text        NOT NULL,   -- required in the UI (details_title CTA is disabled without it)
  waybill_ref    text,
  product_name   text,
  quantity       numeric,
  vehicle_ref    text,

  scheduled_at   timestamptz,            -- optional — when set, dispatched_at is compared against it
  dispatched_at  timestamptz NOT NULL DEFAULT now(),
  is_on_time     boolean,                -- NULL when scheduled_at is NULL ("no schedule" badge in the UI);
                                          -- otherwise computed at insert time by the API route (see below)

  notes          text,
  photo_url      text        NOT NULL,
  storage        text        NOT NULL DEFAULT 'supabase' CHECK (storage IN ('supabase', 'fallback')),

  dispatched_by  uuid        REFERENCES public.pos_staff(id) ON DELETE SET NULL,
  client_tx_id   text,       -- offline-write idempotency, same pattern as pos_factory_captures

  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS pos_factory_waybills_owner_idx
  ON public.pos_factory_waybills (owner_id, dispatched_at DESC);
CREATE INDEX IF NOT EXISTS pos_factory_waybills_on_time_idx
  ON public.pos_factory_waybills (owner_id, is_on_time);
-- Defensive: a prior partial run of this migration (retried after a later
-- statement failed) may have created this table before this column was
-- added to the definition above. ADD COLUMN IF NOT EXISTS makes re-running
-- safe regardless of which shape the table currently has.
ALTER TABLE public.pos_factory_waybills ADD COLUMN IF NOT EXISTS client_tx_id text;

CREATE UNIQUE INDEX IF NOT EXISTS idx_pos_factory_waybills_client_tx_id
  ON public.pos_factory_waybills (owner_id, client_tx_id)
  WHERE client_tx_id IS NOT NULL;

CREATE OR REPLACE FUNCTION public.set_factory_waybill_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_factory_waybill_updated_at ON public.pos_factory_waybills;
CREATE TRIGGER set_factory_waybill_updated_at
  BEFORE UPDATE ON public.pos_factory_waybills
  FOR EACH ROW EXECUTE FUNCTION public.set_factory_waybill_updated_at();

ALTER TABLE public.pos_factory_waybills ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "owner_all_factory_waybills" ON public.pos_factory_waybills;
CREATE POLICY "owner_all_factory_waybills" ON public.pos_factory_waybills
  FOR ALL USING (owner_id = auth.uid());
