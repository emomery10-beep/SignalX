-- ============================================================
-- Stage 5: POS Audit Log
-- Every meaningful staff action is recorded here with:
--   who (staff_id + role), what (event + entity), outcome,
--   before/after state, IP hint, and timestamp.
-- This table is append-only — no UPDATE or DELETE allowed.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.pos_audit_log (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id      uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  staff_id      uuid        REFERENCES public.pos_staff(id)    ON DELETE SET NULL,
  staff_role    text,         -- snapshot of role at time of action
  staff_name    text,         -- snapshot of name (denormalised for historic accuracy)

  -- What happened
  event         text        NOT NULL,   -- e.g. 'job.status_change', 'capture.approved'
  entity_type   text,                   -- e.g. 'service_job', 'factory_capture', 'transaction'
  entity_id     uuid,                   -- FK to the affected row (soft — no constraint)

  -- Change detail
  from_value    text,                   -- previous state (e.g. old status)
  to_value      text,                   -- new state
  metadata      jsonb DEFAULT '{}',     -- any extra context

  -- Request context
  ip_hint       text,                   -- first octet only, e.g. '192.x.x.x' — no full IP stored

  created_at    timestamptz NOT NULL DEFAULT now()
);

-- Indexes for the read API
CREATE INDEX IF NOT EXISTS pos_audit_log_owner_idx   ON public.pos_audit_log (owner_id, created_at DESC);
CREATE INDEX IF NOT EXISTS pos_audit_log_staff_idx   ON public.pos_audit_log (owner_id, staff_id, created_at DESC);
CREATE INDEX IF NOT EXISTS pos_audit_log_entity_idx  ON public.pos_audit_log (owner_id, entity_type, entity_id);
CREATE INDEX IF NOT EXISTS pos_audit_log_event_idx   ON public.pos_audit_log (owner_id, event);

-- RLS — owner can read their own logs; no one can update or delete
ALTER TABLE public.pos_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owner_read_pos_audit_log" ON public.pos_audit_log
  FOR SELECT USING (owner_id = auth.uid());

-- No INSERT policy via RLS — inserts only via service role (API layer)
-- No UPDATE / DELETE policies intentionally omitted (append-only)
