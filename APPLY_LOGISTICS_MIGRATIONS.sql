-- ============================================================
-- AskBiz — Logistics schema setup (run in Supabase SQL Editor)
-- Project: benptbfiudpfvmvwxcjm
-- NOTE: the pos_staff_role_check constraint block from 042 was
-- REMOVED — your constraint already allows all template roles, and
-- re-adding the old 10-role version would reject existing staff.
-- Safe to re-run: everything uses IF NOT EXISTS.
-- ============================================================

-- ============================================================
-- AskBiz Migration 042 — Logistics / Courier Operations
-- Tables: pos_parcels, pos_parcel_photos, pos_parcel_history,
--         pos_trucks, pos_routes, pos_vehicle_inspections,
--         pos_logistics_invoices, pos_logistics_payments
-- Extends: pos_staff roles to include logistics roles
-- ============================================================

-- ── Extend staff roles ─────────────────────────────────────

-- ── Extend sector values ───────────────────────────────────
-- (no constraint existed before — sectors are checked at API layer)

-- ── Ensure the shared updated_at trigger fn exists (idempotent) ──
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- ── TRACKING NUMBER SEQUENCE ───────────────────────────────
CREATE SEQUENCE IF NOT EXISTS pos_parcel_tracking_seq START 1000;

-- ── TRUCKS / VEHICLES ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.pos_trucks (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id        uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  location_id     uuid        REFERENCES public.pos_locations(id) ON DELETE SET NULL,
  plate_number    text        NOT NULL,
  make_model      text,
  status          text        NOT NULL DEFAULT 'available'
                              CHECK (status IN ('available', 'in_transit', 'maintenance', 'decommissioned')),
  notes           text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE(owner_id, plate_number)
);

-- ── ROUTES ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.pos_routes (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id            uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  origin_branch_id    uuid        NOT NULL REFERENCES public.pos_locations(id) ON DELETE CASCADE,
  destination_branch_id uuid      NOT NULL REFERENCES public.pos_locations(id) ON DELETE CASCADE,
  name                text,
  distance_km         numeric,
  price_per_kg        numeric     DEFAULT 0,
  flat_rate           numeric     DEFAULT 0,
  estimated_hours     numeric,
  active              boolean     DEFAULT true,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now(),
  UNIQUE(owner_id, origin_branch_id, destination_branch_id)
);

-- ── PARCELS (core table) ───────────────────────────────────
CREATE TABLE IF NOT EXISTS public.pos_parcels (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id            uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tracking_number     text        NOT NULL,

  -- Sender
  sender_name         text,
  sender_phone        text,
  sender_branch_id    uuid        REFERENCES public.pos_locations(id) ON DELETE SET NULL,

  -- Receiver
  receiver_name       text,
  receiver_phone      text,
  destination_branch_id uuid      REFERENCES public.pos_locations(id) ON DELETE SET NULL,
  destination_city    text,

  -- Parcel details
  description         text,
  weight_kg           numeric,
  declared_value      numeric     DEFAULT 0,
  fee_charged         numeric     DEFAULT 0,
  payment_status      text        DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'partial')),
  payment_method      text        CHECK (payment_method IN ('cash', 'mpesa', 'card', 'account', NULL)),

  -- Lifecycle
  status              text        NOT NULL DEFAULT 'received'
    CHECK (status IN (
      'received',
      'at_branch',
      'assigned',
      'loaded',
      'in_transit',
      'at_destination',
      'out_for_delivery',
      'delivered',
      'collected',
      'failed_delivery',
      'returned'
    )),

  -- Assignment
  assigned_truck_id   uuid        REFERENCES public.pos_trucks(id)  ON DELETE SET NULL,
  assigned_driver_id  uuid        REFERENCES public.pos_staff(id)   ON DELETE SET NULL,
  route_id            uuid        REFERENCES public.pos_routes(id)  ON DELETE SET NULL,

  -- Received / released by
  received_by         uuid        REFERENCES public.pos_staff(id)   ON DELETE SET NULL,
  released_by         uuid        REFERENCES public.pos_staff(id)   ON DELETE SET NULL,
  delivered_by        uuid        REFERENCES public.pos_staff(id)   ON DELETE SET NULL,

  -- Current location (last known)
  current_branch_id   uuid        REFERENCES public.pos_locations(id) ON DELETE SET NULL,
  current_lat         numeric(9,6),
  current_lng         numeric(9,6),

  -- Delivery outcome
  delivery_notes      text,
  fail_reason         text,
  return_reason       text,
  collected_by_name   text,

  -- Timestamps
  dispatched_at       timestamptz,
  delivered_at        timestamptz,
  collected_at        timestamptz,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now(),

  UNIQUE(owner_id, tracking_number)
);

-- ── PARCEL PHOTOS ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.pos_parcel_photos (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id        uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parcel_id       uuid        REFERENCES public.pos_parcels(id)  ON DELETE CASCADE,

  photo_type      text        NOT NULL
    CHECK (photo_type IN (
      'waybill', 'condition', 'loading', 'checkpoint',
      'pickup_proof', 'delivery_proof', 'failed_delivery',
      'collection_proof', 'return', 'other'
    )),
  photo_url       text        NOT NULL,
  storage         text        NOT NULL DEFAULT 'supabase' CHECK (storage IN ('supabase', 'fallback')),

  -- AI extraction (Claude Vision output)
  document_type   text        CHECK (document_type IN ('waybill', 'invoice', 'receipt', NULL)),
  extracted_data  jsonb       DEFAULT '{}'::jsonb,
  confidence      numeric,

  -- Geo
  lat             numeric(9,6),
  lng             numeric(9,6),

  captured_by     uuid        REFERENCES public.pos_staff(id)    ON DELETE SET NULL,
  branch_id       uuid        REFERENCES public.pos_locations(id) ON DELETE SET NULL,
  notes           text,

  created_at      timestamptz NOT NULL DEFAULT now()
);

-- ── PARCEL HISTORY (audit trail) ───────────────────────────
CREATE TABLE IF NOT EXISTS public.pos_parcel_history (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  parcel_id       uuid        NOT NULL REFERENCES public.pos_parcels(id) ON DELETE CASCADE,
  from_status     text,
  to_status       text        NOT NULL,
  changed_by      uuid        REFERENCES public.pos_staff(id) ON DELETE SET NULL,
  photo_id        uuid        REFERENCES public.pos_parcel_photos(id) ON DELETE SET NULL,
  lat             numeric(9,6),
  lng             numeric(9,6),
  notes           text,
  metadata        jsonb       DEFAULT '{}'::jsonb,
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- ── LOGISTICS INVOICES (camera-captured) ───────────────────
CREATE TABLE IF NOT EXISTS public.pos_logistics_invoices (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id        uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  photo_id        uuid        REFERENCES public.pos_parcel_photos(id) ON DELETE SET NULL,
  branch_id       uuid        REFERENCES public.pos_locations(id) ON DELETE SET NULL,
  truck_id        uuid        REFERENCES public.pos_trucks(id)    ON DELETE SET NULL,

  vendor_name     text,
  invoice_number  text,
  items           jsonb       DEFAULT '[]'::jsonb,
  total_amount    numeric     NOT NULL DEFAULT 0,
  currency        text        DEFAULT 'KES',
  invoice_date    date,
  category        text        CHECK (category IN ('fuel', 'maintenance', 'toll', 'loading', 'other', NULL)),
  notes           text,

  captured_by     uuid        REFERENCES public.pos_staff(id) ON DELETE SET NULL,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- ── LOGISTICS PAYMENTS (camera-captured receipts) ──────────
CREATE TABLE IF NOT EXISTS public.pos_logistics_payments (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id        uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  photo_id        uuid        REFERENCES public.pos_parcel_photos(id) ON DELETE SET NULL,
  parcel_id       uuid        REFERENCES public.pos_parcels(id)  ON DELETE SET NULL,
  branch_id       uuid        REFERENCES public.pos_locations(id) ON DELETE SET NULL,

  amount          numeric     NOT NULL DEFAULT 0,
  currency        text        DEFAULT 'KES',
  payment_method  text        CHECK (payment_method IN ('cash', 'mpesa', 'card', 'account', NULL)),
  receipt_number  text,
  payer_name      text,
  payee_name      text,
  payment_date    date,
  notes           text,

  captured_by     uuid        REFERENCES public.pos_staff(id) ON DELETE SET NULL,
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- ── VEHICLE INSPECTIONS ────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.pos_vehicle_inspections (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id        uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  truck_id        uuid        NOT NULL REFERENCES public.pos_trucks(id) ON DELETE CASCADE,
  driver_id       uuid        NOT NULL REFERENCES public.pos_staff(id)  ON DELETE CASCADE,
  branch_id       uuid        REFERENCES public.pos_locations(id) ON DELETE SET NULL,

  type            text        NOT NULL CHECK (type IN ('pre_trip', 'post_trip')),
  status          text        NOT NULL DEFAULT 'complete'
                              CHECK (status IN ('complete', 'flagged')),

  -- 6 guided photos
  photo_front     text,
  photo_rear      text,
  photo_left      text,
  photo_right     text,
  photo_tyres     text,
  photo_cargo     text,

  flagged_issues  jsonb       DEFAULT '[]'::jsonb,
  notes           text,
  lat             numeric(9,6),
  lng             numeric(9,6),

  created_at      timestamptz NOT NULL DEFAULT now()
);

-- ════════════════════════════════════════════════════════════
-- INDEXES
-- ════════════════════════════════════════════════════════════

-- Trucks
CREATE INDEX IF NOT EXISTS idx_trucks_owner      ON public.pos_trucks(owner_id);
CREATE INDEX IF NOT EXISTS idx_trucks_location    ON public.pos_trucks(location_id);
CREATE INDEX IF NOT EXISTS idx_trucks_status      ON public.pos_trucks(owner_id, status);

-- Routes
CREATE INDEX IF NOT EXISTS idx_routes_owner       ON public.pos_routes(owner_id);
CREATE INDEX IF NOT EXISTS idx_routes_origin      ON public.pos_routes(origin_branch_id);
CREATE INDEX IF NOT EXISTS idx_routes_dest        ON public.pos_routes(destination_branch_id);

-- Parcels
CREATE INDEX IF NOT EXISTS idx_parcels_owner      ON public.pos_parcels(owner_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_parcels_status      ON public.pos_parcels(owner_id, status);
CREATE INDEX IF NOT EXISTS idx_parcels_tracking    ON public.pos_parcels(owner_id, tracking_number);
CREATE INDEX IF NOT EXISTS idx_parcels_sender      ON public.pos_parcels(sender_phone);
CREATE INDEX IF NOT EXISTS idx_parcels_receiver    ON public.pos_parcels(receiver_phone);
CREATE INDEX IF NOT EXISTS idx_parcels_driver      ON public.pos_parcels(assigned_driver_id);
CREATE INDEX IF NOT EXISTS idx_parcels_truck       ON public.pos_parcels(assigned_truck_id);
CREATE INDEX IF NOT EXISTS idx_parcels_origin      ON public.pos_parcels(sender_branch_id);
CREATE INDEX IF NOT EXISTS idx_parcels_dest        ON public.pos_parcels(destination_branch_id);
CREATE INDEX IF NOT EXISTS idx_parcels_current     ON public.pos_parcels(current_branch_id, status);

-- Parcel photos
CREATE INDEX IF NOT EXISTS idx_parcel_photos_parcel   ON public.pos_parcel_photos(parcel_id);
CREATE INDEX IF NOT EXISTS idx_parcel_photos_owner    ON public.pos_parcel_photos(owner_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_parcel_photos_type     ON public.pos_parcel_photos(parcel_id, photo_type);
CREATE INDEX IF NOT EXISTS idx_parcel_photos_doc_type ON public.pos_parcel_photos(owner_id, document_type)
  WHERE document_type IS NOT NULL;

-- Parcel history
CREATE INDEX IF NOT EXISTS idx_parcel_history_parcel  ON public.pos_parcel_history(parcel_id, created_at DESC);

-- Logistics invoices
CREATE INDEX IF NOT EXISTS idx_logistics_inv_owner    ON public.pos_logistics_invoices(owner_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_logistics_inv_branch   ON public.pos_logistics_invoices(branch_id);
CREATE INDEX IF NOT EXISTS idx_logistics_inv_truck    ON public.pos_logistics_invoices(truck_id);
CREATE INDEX IF NOT EXISTS idx_logistics_inv_category ON public.pos_logistics_invoices(owner_id, category);

-- Logistics payments
CREATE INDEX IF NOT EXISTS idx_logistics_pay_owner    ON public.pos_logistics_payments(owner_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_logistics_pay_parcel   ON public.pos_logistics_payments(parcel_id);
CREATE INDEX IF NOT EXISTS idx_logistics_pay_branch   ON public.pos_logistics_payments(branch_id);

-- Vehicle inspections
CREATE INDEX IF NOT EXISTS idx_inspections_owner      ON public.pos_vehicle_inspections(owner_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inspections_truck      ON public.pos_vehicle_inspections(truck_id);
CREATE INDEX IF NOT EXISTS idx_inspections_driver     ON public.pos_vehicle_inspections(driver_id);

-- ════════════════════════════════════════════════════════════
-- TRIGGERS
-- ════════════════════════════════════════════════════════════

-- Auto-generate tracking number on insert
CREATE OR REPLACE FUNCTION public.generate_parcel_tracking_number()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.tracking_number IS NULL OR NEW.tracking_number = '' THEN
    NEW.tracking_number := 'PKL-' || LPAD(nextval('pos_parcel_tracking_seq')::text, 6, '0');
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_parcel_tracking_number ON public.pos_parcels;
CREATE TRIGGER set_parcel_tracking_number
  BEFORE INSERT ON public.pos_parcels
  FOR EACH ROW EXECUTE PROCEDURE public.generate_parcel_tracking_number();

-- Auto-update updated_at on parcels
DROP TRIGGER IF EXISTS set_parcels_updated_at ON public.pos_parcels;
CREATE TRIGGER set_parcels_updated_at
  BEFORE UPDATE ON public.pos_parcels
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

-- Auto-update updated_at on trucks
DROP TRIGGER IF EXISTS set_trucks_updated_at ON public.pos_trucks;
CREATE TRIGGER set_trucks_updated_at
  BEFORE UPDATE ON public.pos_trucks
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

-- Auto-update updated_at on routes
DROP TRIGGER IF EXISTS set_routes_updated_at ON public.pos_routes;
CREATE TRIGGER set_routes_updated_at
  BEFORE UPDATE ON public.pos_routes
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

-- Auto-update updated_at on logistics invoices
DROP TRIGGER IF EXISTS set_logistics_inv_updated_at ON public.pos_logistics_invoices;
CREATE TRIGGER set_logistics_inv_updated_at
  BEFORE UPDATE ON public.pos_logistics_invoices
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

-- Auto-log parcel status changes to history
CREATE OR REPLACE FUNCTION public.log_parcel_status_change()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.pos_parcel_history (
      parcel_id, from_status, to_status, changed_by,
      lat, lng, notes
    ) VALUES (
      NEW.id,
      OLD.status,
      NEW.status,
      COALESCE(NEW.delivered_by, NEW.released_by, NEW.assigned_driver_id, NEW.received_by),
      NEW.current_lat,
      NEW.current_lng,
      NULL
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS log_parcel_status_change ON public.pos_parcels;
CREATE TRIGGER log_parcel_status_change
  AFTER UPDATE ON public.pos_parcels
  FOR EACH ROW EXECUTE PROCEDURE public.log_parcel_status_change();

-- Sync parcel revenue into unified_data when delivered/collected
CREATE OR REPLACE FUNCTION public.sync_parcel_to_unified_data()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF NEW.status IN ('delivered', 'collected') AND OLD.status NOT IN ('delivered', 'collected')
     AND NEW.fee_charged IS NOT NULL AND NEW.fee_charged > 0 THEN
    INSERT INTO public.unified_data (
      user_id, source_type, source_record_id, channel,
      gross_revenue, record_date
    ) VALUES (
      NEW.owner_id, 'pos_logistics', NEW.id::text, 'pos_logistics',
      NEW.fee_charged, date(COALESCE(NEW.delivered_at, NEW.collected_at, now()))
    )
    ON CONFLICT (user_id, source_type, source_record_id)
    DO UPDATE SET
      gross_revenue = excluded.gross_revenue,
      updated_at    = now();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS parcel_to_unified_data ON public.pos_parcels;
CREATE TRIGGER parcel_to_unified_data
  AFTER UPDATE ON public.pos_parcels
  FOR EACH ROW EXECUTE PROCEDURE public.sync_parcel_to_unified_data();

-- Update truck status when parcels assigned/delivered
CREATE OR REPLACE FUNCTION public.update_truck_status_on_dispatch()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF NEW.status = 'in_transit' AND OLD.status != 'in_transit' AND NEW.assigned_truck_id IS NOT NULL THEN
    UPDATE public.pos_trucks SET status = 'in_transit' WHERE id = NEW.assigned_truck_id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS truck_status_on_dispatch ON public.pos_parcels;
CREATE TRIGGER truck_status_on_dispatch
  AFTER UPDATE ON public.pos_parcels
  FOR EACH ROW EXECUTE PROCEDURE public.update_truck_status_on_dispatch();

-- ════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ════════════════════════════════════════════════════════════

ALTER TABLE public.pos_trucks              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pos_routes              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pos_parcels             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pos_parcel_photos       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pos_parcel_history      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pos_logistics_invoices  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pos_logistics_payments  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pos_vehicle_inspections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Owner manages trucks" ON public.pos_trucks;
CREATE POLICY "Owner manages trucks"
  ON public.pos_trucks FOR ALL USING (owner_id = auth.uid());

DROP POLICY IF EXISTS "Owner manages routes" ON public.pos_routes;
CREATE POLICY "Owner manages routes"
  ON public.pos_routes FOR ALL USING (owner_id = auth.uid());

DROP POLICY IF EXISTS "Owner manages parcels" ON public.pos_parcels;
CREATE POLICY "Owner manages parcels"
  ON public.pos_parcels FOR ALL USING (owner_id = auth.uid());

DROP POLICY IF EXISTS "Owner manages parcel photos" ON public.pos_parcel_photos;
CREATE POLICY "Owner manages parcel photos"
  ON public.pos_parcel_photos FOR ALL USING (owner_id = auth.uid());

DROP POLICY IF EXISTS "Owner manages parcel history" ON public.pos_parcel_history;
CREATE POLICY "Owner manages parcel history"
  ON public.pos_parcel_history FOR ALL USING (
    parcel_id IN (SELECT id FROM public.pos_parcels WHERE owner_id = auth.uid())
  );

DROP POLICY IF EXISTS "Owner manages logistics invoices" ON public.pos_logistics_invoices;
CREATE POLICY "Owner manages logistics invoices"
  ON public.pos_logistics_invoices FOR ALL USING (owner_id = auth.uid());

DROP POLICY IF EXISTS "Owner manages logistics payments" ON public.pos_logistics_payments;
CREATE POLICY "Owner manages logistics payments"
  ON public.pos_logistics_payments FOR ALL USING (owner_id = auth.uid());

DROP POLICY IF EXISTS "Owner manages vehicle inspections" ON public.pos_vehicle_inspections;
CREATE POLICY "Owner manages vehicle inspections"
  ON public.pos_vehicle_inspections FOR ALL USING (owner_id = auth.uid());

-- ── Storage bucket for parcel photos ───────────────────────
-- INSERT INTO storage.buckets (id, name, public) VALUES ('parcel-photos', 'parcel-photos', false)
-- ON CONFLICT (id) DO NOTHING;


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
