-- ============================================================
-- Migration: Add Stripe Onboarding Tracking
-- Tracks Stripe Connect onboarding state for merchants
-- ============================================================

-- Add Stripe onboarding columns to merchant_payment_config
alter table public.merchant_payment_config
  add column if not exists stripe_onboarding_url text,
  add column if not exists stripe_onboarding_complete boolean default false,
  add column if not exists stripe_charges_enabled boolean default false,
  add column if not exists stripe_payouts_enabled boolean default false;

-- Index for quick lookup of merchants needing onboarding
create index if not exists idx_merchant_stripe_onboarding
  on public.merchant_payment_config(payment_provider, stripe_onboarding_complete)
  where payment_provider = 'stripe';
