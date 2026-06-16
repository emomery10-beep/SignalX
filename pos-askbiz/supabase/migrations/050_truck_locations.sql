-- ============================================================
-- AskBiz Migration 050 — Truck GPS Location Pings
-- Table: pos_truck_locations
-- Driver app streams {truck_id, lat, lng}; managers read latest/history.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.pos_truck_locations (
  id          uuid              PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id    uuid              NOT NULL REFERENCES auth.users(id)   ON DELETE CASCADE,
  truck_id    uuid              REFERENCES public.pos_trucks(id)     ON DELETE CASCADE,
  driver_id   uuid              REFERENCES public.pos_staff(id)      ON DELETE SET NULL,
  lat         double precision  NOT NULL,
  lng         double precision  NOT NULL,
  recorded_at timestamptz       NOT NULL DEFAULT now()
);

-- ── Indexes ────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_truck_locations_owner_truck
  ON public.pos_truck_locations (owner_id, truck_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_truck_locations_owner_recorded
  ON public.pos_truck_locations (owner_id, recorded_at DESC);

-- ── Row Level Security (mirrors other pos_ tables in 042_logistics.sql) ──
ALTER TABLE public.pos_truck_locations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Owner manages truck locations" ON public.pos_truck_locations;
CREATE POLICY "Owner manages truck locations"
  ON public.pos_truck_locations FOR ALL USING (owner_id = auth.uid());
