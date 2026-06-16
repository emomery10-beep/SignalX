-- ============================================================
-- AskBiz Migration 051 — RLS for GDPR governance tables
-- Migration 028 created these PII-bearing tables with NO RLS.
-- Each has a not-null owner_id → scope every row to its owner.
-- Idempotent: safe to re-run.
-- ============================================================

ALTER TABLE public.pos_consent_log          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pos_data_requests        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pos_gdpr_deletion_log    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pos_transaction_history  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pos_customer_preferences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Owner manages consent log" ON public.pos_consent_log;
CREATE POLICY "Owner manages consent log"
  ON public.pos_consent_log FOR ALL USING (owner_id = auth.uid());

DROP POLICY IF EXISTS "Owner manages data requests" ON public.pos_data_requests;
CREATE POLICY "Owner manages data requests"
  ON public.pos_data_requests FOR ALL USING (owner_id = auth.uid());

DROP POLICY IF EXISTS "Owner manages deletion log" ON public.pos_gdpr_deletion_log;
CREATE POLICY "Owner manages deletion log"
  ON public.pos_gdpr_deletion_log FOR ALL USING (owner_id = auth.uid());

DROP POLICY IF EXISTS "Owner manages transaction history" ON public.pos_transaction_history;
CREATE POLICY "Owner manages transaction history"
  ON public.pos_transaction_history FOR ALL USING (owner_id = auth.uid());

DROP POLICY IF EXISTS "Owner manages customer preferences" ON public.pos_customer_preferences;
CREATE POLICY "Owner manages customer preferences"
  ON public.pos_customer_preferences FOR ALL USING (owner_id = auth.uid());
