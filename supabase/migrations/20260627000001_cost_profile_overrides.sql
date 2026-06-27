-- ── Migration: cost_profile_overrides ────────────────────────────────────────
-- Stores per-user manual overrides for cost profiling and supplier context.
-- Used by /api/cost-profile, /api/supplier-context, /api/cfo/snapshot, etc.
-- The overrides JSONB column holds a flexible map:
--   { supplier_sources, monthly_fixed_costs, cash_balance, ... }
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.cost_profile_overrides (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  overrides  jsonb       NOT NULL DEFAULT '{}',
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

ALTER TABLE public.cost_profile_overrides ENABLE ROW LEVEL SECURITY;

CREATE POLICY cpo_own ON public.cost_profile_overrides
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS cost_profile_overrides_user_id_idx
  ON public.cost_profile_overrides (user_id);
