-- ============================================================
-- Factory data model extension (5/8): Machine/equipment identity
-- + Downtime backend
-- ------------------------------------------------------------
-- The Downtime page (app/factory/downtime/page.tsx) has a full
-- report/close UI but zero backend, and its machine_name is free
-- text (with quick-pick pills: Mixer/Cutter/Press/Conveyor/Packer/
-- Boiler — see lines 459-465). This migration adds a small machine
-- registry and the downtime events table itself, with downtime
-- events referencing machine_id instead of only a bare string.
--
-- machine_name is KEPT alongside machine_id (not replaced) because
-- the current UI always sends a name and never a ready-made id — an
-- API route should look up-or-create a pos_factory_machines row by
-- (owner_id, name) the same way the batch route already does
-- find-or-create by batch_ref, then store both the resolved
-- machine_id and the original machine_name (so the UI never needs a
-- join just to render a downtime card).
-- ============================================================

-- ── Machine registry ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.pos_factory_machines (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id      uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  location_id   uuid        REFERENCES public.pos_locations(id) ON DELETE SET NULL,

  name          text        NOT NULL,
  type          text,       -- free text, e.g. 'press', 'mixer', 'boiler' — optional categorisation
  is_active     boolean     NOT NULL DEFAULT true,

  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),

  -- Supports find-or-create by name (mirrors pos_locations' own
  -- UNIQUE(owner_id, name) in 033_multi_branch.sql).
  UNIQUE (owner_id, name)
);

CREATE INDEX IF NOT EXISTS pos_factory_machines_owner_idx
  ON public.pos_factory_machines (owner_id, is_active);

CREATE OR REPLACE FUNCTION public.set_factory_machine_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_factory_machine_updated_at ON public.pos_factory_machines;
CREATE TRIGGER set_factory_machine_updated_at
  BEFORE UPDATE ON public.pos_factory_machines
  FOR EACH ROW EXECUTE FUNCTION public.set_factory_machine_updated_at();

ALTER TABLE public.pos_factory_machines ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "owner_all_factory_machines" ON public.pos_factory_machines;
CREATE POLICY "owner_all_factory_machines" ON public.pos_factory_machines
  FOR ALL USING (owner_id = auth.uid());

-- ── Downtime events ───────────────────────────────────────────
-- Frontend ActiveDowntime shape: { id, machine_name, reason,
-- started_at, start_photo_url } (app/factory/downtime/page.tsx:29-35).
-- reason values match buildReasons() (lines 37-46). The close flow
-- (PATCH { id, image }) sets end_photo_url/ended_at/status.
CREATE TABLE IF NOT EXISTS public.pos_factory_downtime_events (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id          uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  location_id       uuid        REFERENCES public.pos_locations(id) ON DELETE SET NULL,

  machine_id        uuid        REFERENCES public.pos_factory_machines(id) ON DELETE SET NULL,
  machine_name      text        NOT NULL,   -- kept for compat/display — see header note

  reason            text        NOT NULL CHECK (reason IN
                                  ('breakdown', 'changeover', 'no_materials', 'quality_hold', 'planned_maintenance', 'other')),
  status            text        NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),

  start_photo_url   text        NOT NULL,
  start_storage     text        NOT NULL DEFAULT 'supabase' CHECK (start_storage IN ('supabase', 'fallback')),
  end_photo_url     text,
  end_storage       text        CHECK (end_storage IS NULL OR end_storage IN ('supabase', 'fallback')),

  started_by        uuid        REFERENCES public.pos_staff(id) ON DELETE SET NULL,
  closed_by         uuid        REFERENCES public.pos_staff(id) ON DELETE SET NULL,

  started_at        timestamptz NOT NULL DEFAULT now(),
  ended_at          timestamptz,
  duration_minutes  numeric,    -- computed at close time: (ended_at - started_at) in minutes

  client_tx_id      text,       -- offline-write idempotency, same pattern as pos_factory_captures

  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS pos_factory_downtime_events_owner_idx
  ON public.pos_factory_downtime_events (owner_id, created_at DESC);
CREATE INDEX IF NOT EXISTS pos_factory_downtime_events_active_idx
  ON public.pos_factory_downtime_events (owner_id, status);
CREATE INDEX IF NOT EXISTS pos_factory_downtime_events_machine_idx
  ON public.pos_factory_downtime_events (machine_id);
-- Defensive: a prior partial run of this migration (retried after a later
-- statement failed) may have created this table before this column was
-- added to the definition above. ADD COLUMN IF NOT EXISTS makes re-running
-- safe regardless of which shape the table currently has.
ALTER TABLE public.pos_factory_downtime_events ADD COLUMN IF NOT EXISTS client_tx_id text;

CREATE UNIQUE INDEX IF NOT EXISTS idx_pos_factory_downtime_events_client_tx_id
  ON public.pos_factory_downtime_events (owner_id, client_tx_id)
  WHERE client_tx_id IS NOT NULL;

CREATE OR REPLACE FUNCTION public.set_factory_downtime_event_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_factory_downtime_event_updated_at ON public.pos_factory_downtime_events;
CREATE TRIGGER set_factory_downtime_event_updated_at
  BEFORE UPDATE ON public.pos_factory_downtime_events
  FOR EACH ROW EXECUTE FUNCTION public.set_factory_downtime_event_updated_at();

ALTER TABLE public.pos_factory_downtime_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "owner_all_factory_downtime_events" ON public.pos_factory_downtime_events;
CREATE POLICY "owner_all_factory_downtime_events" ON public.pos_factory_downtime_events
  FOR ALL USING (owner_id = auth.uid());
