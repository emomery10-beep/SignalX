-- ============================================================
-- Migration 036 — Market Intelligence: default ON for new signups
-- Existing users are NOT affected (their false value is preserved)
-- Only new profile rows created after this migration will default to true
-- ============================================================

alter table public.profiles
  alter column market_intelligence_opt_in set default true;
