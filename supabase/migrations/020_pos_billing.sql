-- ============================================================
-- AskBiz Migration 020 — POS seat billing
-- Adds pos_stripe_subscription_id to profiles
-- ============================================================

alter table public.profiles
  add column if not exists pos_stripe_subscription_id text;
