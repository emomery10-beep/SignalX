-- ============================================================
-- Factory data model extension (6/8): Real production shift table
-- ------------------------------------------------------------
-- pos_shifts (031_pos_shift_management.sql + 045_shift_reconciliation.sql)
-- is the CASH-REGISTER reconciliation table (cashier_id, opening_balance,
-- closing_balance, expected_balance, variance_amount, ...) and has
-- nothing to do with factory production shifts. pos_factory_captures.
-- shift_id already points at it but nothing populates that column in
-- practice today — leave pos_shifts and that column exactly as they
-- are; do not repurpose either.
--
-- The Shift page (app/factory/shift/page.tsx) needs a genuinely
-- different concept: shift_name, custom_name, target_units,
-- start/end photos, live/actual output. pos_factory_production_shifts
-- is that table, named to avoid any collision with pos_shifts.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.pos_factory_production_shifts (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id          uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  location_id       uuid        REFERENCES public.pos_locations(id) ON DELETE SET NULL,

  -- Frontend Shift shape: { id, shift_name, custom_name, start_photo_url,
  -- end_photo_url, started_at, ended_at, duration_minutes, target_units,
  -- actual_output, live_output, status, started_by_staff }
  -- (app/factory/shift/page.tsx:24-38). shift_name values match
  -- buildShiftNames() (lines 40-47). live_output is NOT stored — it's a
  -- point-in-time aggregate an API route computes on read (see note on
  -- pos_factory_captures.production_shift_id below); actual_output is
  -- the value locked in at shift-end time.
  shift_name        text        NOT NULL CHECK (shift_name IN ('Morning', 'Afternoon', 'Night', 'Custom')),
  custom_name       text,
  target_units      numeric,
  actual_output     numeric,

  start_photo_url   text        NOT NULL,
  start_storage     text        NOT NULL DEFAULT 'supabase' CHECK (start_storage IN ('supabase', 'fallback')),
  end_photo_url     text,
  end_storage       text        CHECK (end_storage IS NULL OR end_storage IN ('supabase', 'fallback')),

  status            text        NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed')),

  started_by        uuid        REFERENCES public.pos_staff(id) ON DELETE SET NULL,
  ended_by          uuid        REFERENCES public.pos_staff(id) ON DELETE SET NULL,

  started_at        timestamptz NOT NULL DEFAULT now(),
  ended_at          timestamptz,
  duration_minutes  numeric,

  client_tx_id      text,       -- offline-write idempotency, same pattern as pos_factory_captures

  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS pos_factory_production_shifts_owner_idx
  ON public.pos_factory_production_shifts (owner_id, started_at DESC);
-- Defensive: a prior partial run of this migration (retried after a later
-- statement failed) may have created this table before this column was
-- added to the definition above. ADD COLUMN IF NOT EXISTS makes re-running
-- safe regardless of which shape the table currently has.
ALTER TABLE public.pos_factory_production_shifts ADD COLUMN IF NOT EXISTS client_tx_id text;

CREATE UNIQUE INDEX IF NOT EXISTS idx_pos_factory_production_shifts_client_tx_id
  ON public.pos_factory_production_shifts (owner_id, client_tx_id)
  WHERE client_tx_id IS NOT NULL;

-- The frontend already assumes a single active shift per owner (POST
-- returns 409 and reloads to show the existing one — see
-- app/factory/shift/page.tsx:198-201). This constraint enforces that at
-- the DB level too. It is scoped to owner_id only (not location_id)
-- because the current hub fetch (`/api/pos/factory/shift`, no location
-- param) has no location scoping either — if AskBiz later supports
-- concurrent per-location production shifts, this index will need to
-- move to (owner_id, location_id).
CREATE UNIQUE INDEX IF NOT EXISTS idx_pos_factory_production_shifts_one_active
  ON public.pos_factory_production_shifts (owner_id)
  WHERE status = 'active';

CREATE OR REPLACE FUNCTION public.set_factory_production_shift_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_factory_production_shift_updated_at ON public.pos_factory_production_shifts;
CREATE TRIGGER set_factory_production_shift_updated_at
  BEFORE UPDATE ON public.pos_factory_production_shifts
  FOR EACH ROW EXECUTE FUNCTION public.set_factory_production_shift_updated_at();

ALTER TABLE public.pos_factory_production_shifts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "owner_all_factory_production_shifts" ON public.pos_factory_production_shifts;
CREATE POLICY "owner_all_factory_production_shifts" ON public.pos_factory_production_shifts
  FOR ALL USING (owner_id = auth.uid());

-- ── Wire up the forward reference from production runs ──────────
-- pos_factory_production_runs.production_shift_id was added as a plain
-- uuid column earlier in this review batch (this table didn't exist
-- yet at that point); attach the real FK now.
ALTER TABLE public.pos_factory_production_runs
  DROP CONSTRAINT IF EXISTS pos_factory_production_runs_production_shift_id_fkey;
ALTER TABLE public.pos_factory_production_runs
  ADD CONSTRAINT pos_factory_production_runs_production_shift_id_fkey
  FOREIGN KEY (production_shift_id) REFERENCES public.pos_factory_production_shifts(id) ON DELETE SET NULL;

-- ── Link captures to the production shift they were logged during ──
-- Deliberately a NEW column, not a repurpose of the existing shift_id
-- (which stays pointed at the cash-register pos_shifts, untouched).
-- An API route should stamp this with the owner's current active
-- production shift (if any) at capture-submit time. live_output on the
-- Shift hub is then SUM(quantity) WHERE production_shift_id = <shift>
-- AND type = 'output' AND status <> 'rejected' — an on-read aggregate,
-- not a stored column. At shift-end, that same sum should be copied
-- into production_shifts.actual_output so a shift's headline number
-- doesn't drift if captures are approved/rejected after the shift closes.
ALTER TABLE public.pos_factory_captures
  ADD COLUMN IF NOT EXISTS production_shift_id uuid
  REFERENCES public.pos_factory_production_shifts(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS pos_factory_captures_production_shift_idx
  ON public.pos_factory_captures (production_shift_id);
