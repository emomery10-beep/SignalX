-- ============================================================
-- AskBiz Migration 045 — Shift reconciliation columns
-- The shift-close API (/api/pos/shift/close) reconciles cash and
-- writes expected_balance / variance / status, and logs to
-- pos_shift_audit_log — but those columns/table were never created.
-- This adds them so Close Shift works for every cashier role.
-- ============================================================

ALTER TABLE public.pos_shifts
  ADD COLUMN IF NOT EXISTS expected_balance numeric,
  ADD COLUMN IF NOT EXISTS variance_amount  numeric,
  ADD COLUMN IF NOT EXISTS variance_reason  text,
  ADD COLUMN IF NOT EXISTS status           text NOT NULL DEFAULT 'open';

COMMENT ON COLUMN public.pos_shifts.expected_balance IS 'Opening float + cash sales — what the drawer should hold at close.';
COMMENT ON COLUMN public.pos_shifts.variance_amount  IS 'Physical count − expected (negative = short).';
COMMENT ON COLUMN public.pos_shifts.status            IS 'open | reconciled | reconciled_with_variance.';

CREATE TABLE IF NOT EXISTS public.pos_shift_audit_log (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id     uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  shift_id     uuid        REFERENCES public.pos_shifts(id) ON DELETE CASCADE,
  event        text        NOT NULL,
  details_json jsonb,
  logged_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_shift_audit_owner ON public.pos_shift_audit_log(owner_id, logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_shift_audit_shift ON public.pos_shift_audit_log(shift_id);

ALTER TABLE public.pos_shift_audit_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Owner manages shift audit log" ON public.pos_shift_audit_log;
CREATE POLICY "Owner manages shift audit log"
  ON public.pos_shift_audit_log FOR ALL USING (owner_id = auth.uid());
