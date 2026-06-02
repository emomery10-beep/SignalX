-- ============================================================
-- Salon & Spa schema
-- Dedicated tables for the salon sector: clients, appointments,
-- before/after photos, color formulas, and backbar product usage.
-- All rows are owner-scoped; POS staff access is enforced at the
-- API layer (resolvePosAuth + hasPermission).
-- ============================================================

-- ── Clients ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.salon_clients (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id        uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  location_id     uuid        REFERENCES public.pos_locations(id) ON DELETE SET NULL,

  name            text        NOT NULL,
  phone           text,
  email           text,
  birthday        date,
  notes           text,

  -- Denormalised rollups (maintained by the API for fast lists)
  total_visits    integer     NOT NULL DEFAULT 0,
  total_spend     numeric     NOT NULL DEFAULT 0,
  last_visit_at   timestamptz,

  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS salon_clients_owner_idx ON public.salon_clients (owner_id, created_at DESC);
CREATE INDEX IF NOT EXISTS salon_clients_phone_idx ON public.salon_clients (owner_id, phone);

-- ── Appointments ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.salon_appointments (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id         uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  location_id      uuid        REFERENCES public.pos_locations(id) ON DELETE SET NULL,
  client_id        uuid        REFERENCES public.salon_clients(id) ON DELETE SET NULL,
  stylist_id       uuid        REFERENCES public.pos_staff(id)     ON DELETE SET NULL,

  service_name     text        NOT NULL,
  service_category text,
  scheduled_at     timestamptz NOT NULL DEFAULT now(),
  duration_mins    integer     NOT NULL DEFAULT 60,
  price            numeric     NOT NULL DEFAULT 0,

  status           text        NOT NULL DEFAULT 'booked'
                               CHECK (status IN ('booked', 'confirmed', 'in_progress', 'completed', 'no_show', 'cancelled')),
  notes            text,

  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS salon_appointments_owner_idx    ON public.salon_appointments (owner_id, scheduled_at DESC);
CREATE INDEX IF NOT EXISTS salon_appointments_client_idx   ON public.salon_appointments (client_id);
CREATE INDEX IF NOT EXISTS salon_appointments_stylist_idx  ON public.salon_appointments (stylist_id);
CREATE INDEX IF NOT EXISTS salon_appointments_status_idx   ON public.salon_appointments (owner_id, status);

-- ── Client before/after photos ─────────────────────────────
CREATE TABLE IF NOT EXISTS public.salon_client_photos (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id        uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id       uuid        REFERENCES public.salon_clients(id)      ON DELETE CASCADE,
  appointment_id  uuid        REFERENCES public.salon_appointments(id) ON DELETE SET NULL,
  stylist_id      uuid        REFERENCES public.pos_staff(id)          ON DELETE SET NULL,

  photo_url       text        NOT NULL,
  storage         text        NOT NULL DEFAULT 'supabase' CHECK (storage IN ('supabase', 'fallback')),
  kind            text        NOT NULL DEFAULT 'before' CHECK (kind IN ('before', 'after')),
  service_type    text,
  notes           text,

  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS salon_client_photos_owner_idx  ON public.salon_client_photos (owner_id, created_at DESC);
CREATE INDEX IF NOT EXISTS salon_client_photos_client_idx ON public.salon_client_photos (client_id, created_at DESC);

-- ── Color formulas ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.salon_color_formulas (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id        uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id       uuid        REFERENCES public.salon_clients(id) ON DELETE CASCADE,
  stylist_id      uuid        REFERENCES public.pos_staff(id)     ON DELETE SET NULL,

  formula         text        NOT NULL,
  brand           text,
  developer       text,
  processing_mins integer,
  notes           text,

  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS salon_color_formulas_owner_idx  ON public.salon_color_formulas (owner_id, created_at DESC);
CREATE INDEX IF NOT EXISTS salon_color_formulas_client_idx ON public.salon_color_formulas (client_id, created_at DESC);

-- ── Backbar product usage (cost-per-service) ───────────────
CREATE TABLE IF NOT EXISTS public.salon_product_usage (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id        uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  appointment_id  uuid        REFERENCES public.salon_appointments(id) ON DELETE SET NULL,
  client_id       uuid        REFERENCES public.salon_clients(id)      ON DELETE SET NULL,
  inventory_id    uuid        REFERENCES public.inventory(id)          ON DELETE SET NULL,

  product_name    text        NOT NULL,
  amount_used     numeric     NOT NULL DEFAULT 0,
  unit            text        NOT NULL DEFAULT 'g',
  cost            numeric     NOT NULL DEFAULT 0,
  service_name    text,

  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS salon_product_usage_owner_idx ON public.salon_product_usage (owner_id, created_at DESC);
CREATE INDEX IF NOT EXISTS salon_product_usage_appt_idx  ON public.salon_product_usage (appointment_id);

-- ── updated_at triggers ────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_salon_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_salon_clients_updated_at ON public.salon_clients;
CREATE TRIGGER set_salon_clients_updated_at
  BEFORE UPDATE ON public.salon_clients
  FOR EACH ROW EXECUTE FUNCTION public.set_salon_updated_at();

DROP TRIGGER IF EXISTS set_salon_appointments_updated_at ON public.salon_appointments;
CREATE TRIGGER set_salon_appointments_updated_at
  BEFORE UPDATE ON public.salon_appointments
  FOR EACH ROW EXECUTE FUNCTION public.set_salon_updated_at();

-- ── RLS ────────────────────────────────────────────────────
-- Owner can read/write all their salon data. POS staff access is
-- controlled at the API layer (resolvePosAuth + hasPermission).
ALTER TABLE public.salon_clients        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salon_appointments   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salon_client_photos  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salon_color_formulas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salon_product_usage  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owner_all_salon_clients"        ON public.salon_clients        FOR ALL USING (owner_id = auth.uid());
CREATE POLICY "owner_all_salon_appointments"   ON public.salon_appointments   FOR ALL USING (owner_id = auth.uid());
CREATE POLICY "owner_all_salon_client_photos"  ON public.salon_client_photos  FOR ALL USING (owner_id = auth.uid());
CREATE POLICY "owner_all_salon_color_formulas" ON public.salon_color_formulas FOR ALL USING (owner_id = auth.uid());
CREATE POLICY "owner_all_salon_product_usage"  ON public.salon_product_usage  FOR ALL USING (owner_id = auth.uid());

-- ── Storage bucket for salon photos ────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('salon-photos', 'salon-photos', false)
ON CONFLICT (id) DO NOTHING;
