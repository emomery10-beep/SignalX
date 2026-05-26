-- ============================================================
-- AskBiz Migration 037 — POS Service Jobs (Repair Workflow)
-- Tables: pos_service_jobs, pos_service_presets,
--         pos_service_job_history, pos_service_parts,
--         pos_engineer_skills, pos_service_warranties
-- Extends: pos_staff role check to include 'repair' + 'engineer'
-- ============================================================

-- ── Extend staff roles to include repair & engineer ─────────
ALTER TABLE public.pos_staff DROP CONSTRAINT IF EXISTS pos_staff_role_check;
ALTER TABLE public.pos_staff ADD CONSTRAINT pos_staff_role_check
  CHECK (role IN ('cashier', 'inventory', 'repair', 'engineer'));

-- ── SERVICE PRESETS (common repairs with standard pricing) ──
CREATE TABLE IF NOT EXISTS public.pos_service_presets (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id        uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name            text NOT NULL,
  category        text NOT NULL DEFAULT 'general',
  price           numeric NOT NULL DEFAULT 0,
  estimated_minutes int DEFAULT 60,
  parts_required  jsonb DEFAULT '[]'::jsonb,
  active          boolean DEFAULT true,
  location_id     uuid REFERENCES public.pos_locations(id) ON DELETE SET NULL,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

-- ── SERVICE JOBS (the core repair ticket) ───────────────────
CREATE TABLE IF NOT EXISTS public.pos_service_jobs (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id              uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ticket_number         text NOT NULL,
  status                text NOT NULL DEFAULT 'intake'
    CHECK (status IN ('intake', 'quoted', 'accepted', 'in_progress', 'completed', 'collected', 'cancelled')),

  -- Customer
  customer_id           uuid REFERENCES public.pos_customers(id) ON DELETE SET NULL,
  customer_phone        text,
  customer_name         text,

  -- Device info
  device_model          text,
  device_serial         text,
  device_description    text,
  fault_description     text NOT NULL,

  -- Photos
  intake_photo_url      text,
  checkout_photo_url    text,

  -- Pricing
  preset_id             uuid REFERENCES public.pos_service_presets(id) ON DELETE SET NULL,
  original_quoted_price numeric,
  quoted_price          numeric,

  -- Assignment
  checked_in_by         uuid REFERENCES public.pos_staff(id) ON DELETE SET NULL,
  assigned_to           uuid REFERENCES public.pos_staff(id) ON DELETE SET NULL,
  checked_out_by        uuid REFERENCES public.pos_staff(id) ON DELETE SET NULL,

  -- Engineer
  engineer_notes        text,
  additional_issues     text,

  -- SLA / timing
  estimated_minutes     int,
  due_by                timestamptz,

  -- Payment link
  paid_by_transaction   uuid REFERENCES public.pos_transactions(id) ON DELETE SET NULL,

  -- Location (geo-tagged at intake)
  location_id           uuid REFERENCES public.pos_locations(id) ON DELETE SET NULL,
  intake_lat            numeric,
  intake_lng            numeric,

  -- Cancellation
  cancel_reason         text,

  -- Warranty
  warranty_expires_at   timestamptz,
  warranty_job_id       uuid REFERENCES public.pos_service_jobs(id) ON DELETE SET NULL,

  created_at            timestamptz DEFAULT now(),
  updated_at            timestamptz DEFAULT now(),

  UNIQUE(owner_id, ticket_number)
);

-- ── SERVICE JOB HISTORY (audit trail) ───────────────────────
CREATE TABLE IF NOT EXISTS public.pos_service_job_history (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id          uuid NOT NULL REFERENCES public.pos_service_jobs(id) ON DELETE CASCADE,
  from_status     text,
  to_status       text NOT NULL,
  changed_by      uuid REFERENCES public.pos_staff(id) ON DELETE SET NULL,
  notes           text,
  metadata        jsonb DEFAULT '{}'::jsonb,
  created_at      timestamptz DEFAULT now()
);

-- ── SERVICE PARTS (inventory items used in a repair) ────────
CREATE TABLE IF NOT EXISTS public.pos_service_parts (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id          uuid NOT NULL REFERENCES public.pos_service_jobs(id) ON DELETE CASCADE,
  inventory_id    uuid REFERENCES public.inventory(id) ON DELETE SET NULL,
  name            text NOT NULL,
  qty             int NOT NULL DEFAULT 1,
  unit_cost       numeric DEFAULT 0,
  line_total      numeric DEFAULT 0,
  created_at      timestamptz DEFAULT now()
);

-- ── ENGINEER SKILLS (which engineers can do which repairs) ──
CREATE TABLE IF NOT EXISTS public.pos_engineer_skills (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id        uuid NOT NULL REFERENCES public.pos_staff(id) ON DELETE CASCADE,
  preset_id       uuid NOT NULL REFERENCES public.pos_service_presets(id) ON DELETE CASCADE,
  proficiency     text DEFAULT 'standard' CHECK (proficiency IN ('standard', 'specialist')),
  created_at      timestamptz DEFAULT now(),
  UNIQUE(staff_id, preset_id)
);

-- ── SERVICE WARRANTIES ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.pos_service_warranties (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id        uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  original_job_id uuid NOT NULL REFERENCES public.pos_service_jobs(id) ON DELETE CASCADE,
  warranty_job_id uuid REFERENCES public.pos_service_jobs(id) ON DELETE SET NULL,
  warranty_days   int NOT NULL DEFAULT 90,
  expires_at      timestamptz NOT NULL,
  claimed         boolean DEFAULT false,
  claimed_at      timestamptz,
  claim_reason    text,
  created_at      timestamptz DEFAULT now()
);

-- ── TICKET NUMBER SEQUENCE ──────────────────────────────────
CREATE SEQUENCE IF NOT EXISTS pos_service_job_seq START 1;

-- ── ROW LEVEL SECURITY ──────────────────────────────────────
ALTER TABLE public.pos_service_presets     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pos_service_jobs        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pos_service_job_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pos_service_parts       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pos_engineer_skills     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pos_service_warranties  ENABLE ROW LEVEL SECURITY;

-- Owner manages all service tables
CREATE POLICY "Owner manages service presets"
  ON public.pos_service_presets FOR ALL USING (auth.uid() = owner_id);

CREATE POLICY "Owner manages service jobs"
  ON public.pos_service_jobs FOR ALL USING (auth.uid() = owner_id);

CREATE POLICY "Owner manages service job history"
  ON public.pos_service_job_history FOR ALL USING (
    job_id IN (SELECT id FROM public.pos_service_jobs WHERE owner_id = auth.uid())
  );

CREATE POLICY "Owner manages service parts"
  ON public.pos_service_parts FOR ALL USING (
    job_id IN (SELECT id FROM public.pos_service_jobs WHERE owner_id = auth.uid())
  );

CREATE POLICY "Owner manages engineer skills"
  ON public.pos_engineer_skills FOR ALL USING (
    staff_id IN (SELECT id FROM public.pos_staff WHERE owner_id = auth.uid())
  );

CREATE POLICY "Owner manages service warranties"
  ON public.pos_service_warranties FOR ALL USING (auth.uid() = owner_id);

-- ── INDEXES ─────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_service_presets_owner    ON public.pos_service_presets(owner_id);
CREATE INDEX IF NOT EXISTS idx_service_presets_category ON public.pos_service_presets(owner_id, category);

CREATE INDEX IF NOT EXISTS idx_service_jobs_owner       ON public.pos_service_jobs(owner_id);
CREATE INDEX IF NOT EXISTS idx_service_jobs_status      ON public.pos_service_jobs(owner_id, status);
CREATE INDEX IF NOT EXISTS idx_service_jobs_assigned    ON public.pos_service_jobs(assigned_to);
CREATE INDEX IF NOT EXISTS idx_service_jobs_location    ON public.pos_service_jobs(location_id);
CREATE INDEX IF NOT EXISTS idx_service_jobs_ticket      ON public.pos_service_jobs(owner_id, ticket_number);
CREATE INDEX IF NOT EXISTS idx_service_jobs_created     ON public.pos_service_jobs(owner_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_service_jobs_customer    ON public.pos_service_jobs(customer_id);
CREATE INDEX IF NOT EXISTS idx_service_jobs_warranty    ON public.pos_service_jobs(warranty_expires_at)
  WHERE warranty_expires_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_service_history_job      ON public.pos_service_job_history(job_id);
CREATE INDEX IF NOT EXISTS idx_service_history_created  ON public.pos_service_job_history(job_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_service_parts_job        ON public.pos_service_parts(job_id);
CREATE INDEX IF NOT EXISTS idx_service_parts_inventory  ON public.pos_service_parts(inventory_id);

CREATE INDEX IF NOT EXISTS idx_engineer_skills_staff    ON public.pos_engineer_skills(staff_id);
CREATE INDEX IF NOT EXISTS idx_engineer_skills_preset   ON public.pos_engineer_skills(preset_id);

CREATE INDEX IF NOT EXISTS idx_service_warranties_owner ON public.pos_service_warranties(owner_id);
CREATE INDEX IF NOT EXISTS idx_service_warranties_job   ON public.pos_service_warranties(original_job_id);
CREATE INDEX IF NOT EXISTS idx_service_warranties_exp   ON public.pos_service_warranties(expires_at)
  WHERE claimed = false;

-- ── TRIGGERS ────────────────────────────────────────────────

-- Auto-generate ticket number on insert
CREATE OR REPLACE FUNCTION public.generate_service_ticket_number()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.ticket_number IS NULL OR NEW.ticket_number = '' THEN
    NEW.ticket_number := 'SJ-' || LPAD(nextval('pos_service_job_seq')::text, 5, '0');
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_service_ticket_number ON public.pos_service_jobs;
CREATE TRIGGER set_service_ticket_number
  BEFORE INSERT ON public.pos_service_jobs
  FOR EACH ROW EXECUTE PROCEDURE public.generate_service_ticket_number();

-- Auto-update updated_at
DROP TRIGGER IF EXISTS set_service_jobs_updated_at ON public.pos_service_jobs;
CREATE TRIGGER set_service_jobs_updated_at
  BEFORE UPDATE ON public.pos_service_jobs
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

DROP TRIGGER IF EXISTS set_service_presets_updated_at ON public.pos_service_presets;
CREATE TRIGGER set_service_presets_updated_at
  BEFORE UPDATE ON public.pos_service_presets
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

-- Auto-log status changes to history
CREATE OR REPLACE FUNCTION public.log_service_job_status_change()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.pos_service_job_history (job_id, from_status, to_status, changed_by, notes)
    VALUES (
      NEW.id,
      OLD.status,
      NEW.status,
      COALESCE(NEW.checked_out_by, NEW.assigned_to, NEW.checked_in_by),
      NULL
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS log_service_status_change ON public.pos_service_jobs;
CREATE TRIGGER log_service_status_change
  AFTER UPDATE ON public.pos_service_jobs
  FOR EACH ROW EXECUTE PROCEDURE public.log_service_job_status_change();

-- Deduct parts from inventory when added to a service job
CREATE OR REPLACE FUNCTION public.deduct_service_parts_from_inventory()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF NEW.inventory_id IS NOT NULL THEN
    UPDATE public.inventory
    SET stock_qty  = GREATEST(stock_qty - NEW.qty, 0),
        updated_at = now()
    WHERE id = NEW.inventory_id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS deduct_service_parts ON public.pos_service_parts;
CREATE TRIGGER deduct_service_parts
  AFTER INSERT ON public.pos_service_parts
  FOR EACH ROW EXECUTE PROCEDURE public.deduct_service_parts_from_inventory();

-- Auto-create warranty record when job is collected
CREATE OR REPLACE FUNCTION public.create_service_warranty_on_collect()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF NEW.status = 'collected' AND OLD.status != 'collected' AND NEW.warranty_job_id IS NULL THEN
    INSERT INTO public.pos_service_warranties (owner_id, original_job_id, warranty_days, expires_at)
    VALUES (NEW.owner_id, NEW.id, 90, now() + interval '90 days');

    UPDATE public.pos_service_jobs
    SET warranty_expires_at = now() + interval '90 days'
    WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS create_warranty_on_collect ON public.pos_service_jobs;
CREATE TRIGGER create_warranty_on_collect
  AFTER UPDATE ON public.pos_service_jobs
  FOR EACH ROW EXECUTE PROCEDURE public.create_service_warranty_on_collect();

-- Sync service job revenue into unified_data (same pattern as pos_transactions)
CREATE OR REPLACE FUNCTION public.sync_service_job_to_unified_data()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_parts_cost numeric := 0;
  v_margin     numeric := 0;
BEGIN
  IF NEW.status = 'collected' AND OLD.status != 'collected' AND NEW.quoted_price IS NOT NULL THEN
    SELECT COALESCE(SUM(line_total), 0) INTO v_parts_cost
    FROM public.pos_service_parts WHERE job_id = NEW.id;

    IF NEW.quoted_price > 0 THEN
      v_margin := ROUND(((NEW.quoted_price - v_parts_cost) / NEW.quoted_price) * 100, 2);
    END IF;

    INSERT INTO public.unified_data (user_id, source_type, source_record_id, channel, gross_revenue, gross_margin, record_date)
    VALUES (NEW.owner_id, 'pos_repair', NEW.id::text, 'pos_repair', NEW.quoted_price, v_margin, date(now()))
    ON CONFLICT (user_id, source_type, source_record_id)
    DO UPDATE SET
      gross_revenue = excluded.gross_revenue,
      gross_margin  = excluded.gross_margin,
      updated_at    = now();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS service_job_to_unified_data ON public.pos_service_jobs;
CREATE TRIGGER service_job_to_unified_data
  AFTER UPDATE ON public.pos_service_jobs
  FOR EACH ROW EXECUTE PROCEDURE public.sync_service_job_to_unified_data();

-- Note: notification settings rows are created per-user by migration 032.
-- Service job notifications use the existing pos/notifications/send API
-- with new template types: 'service_ready', 'service_quote', 'service_warranty'.
