-- ============================================================
-- Migration: Merchant Payment Configuration
-- Adds payment provider setup for Paystack and Stripe integration
-- ============================================================

-- ── MERCHANT PAYMENT CONFIG ──────────────────────────────────
-- Stores payment provider credentials and settings per merchant
-- One row per business owner
create table if not exists public.merchant_payment_config (
  id                        uuid primary key default gen_random_uuid(),
  owner_id                  uuid not null unique references auth.users on delete cascade,
  country                   text not null,                -- 'KE', 'GB', 'US', etc.
  payment_provider          text not null default 'none' check (payment_provider in ('none', 'paystack', 'stripe')),

  -- Paystack
  paystack_subaccount_id    text,                         -- encrypted subaccount ID
  paystack_business_name    text,                         -- for verification

  -- Stripe Connect
  stripe_connected_account_id text,                       -- connected account ID (not encrypted, Stripe's own ID)
  stripe_onboarding_complete boolean default false,

  -- Settlement preferences
  settlement_account        jsonb,                        -- {type: 'mpesa' | 'bank', phone: '...', account: '...'}
  settlement_enabled        boolean default true,

  -- Status
  is_active                 boolean default false,        -- merchant has enabled payments
  created_at                timestamptz default now(),
  updated_at                timestamptz default now()
);

alter table public.merchant_payment_config enable row level security;

create policy "Users can manage own payment config"
  on public.merchant_payment_config for all using (auth.uid() = owner_id);

create index if not exists idx_merchant_payment_owner
  on public.merchant_payment_config(owner_id);

create index if not exists idx_merchant_payment_provider
  on public.merchant_payment_config(payment_provider);

-- ── TRIGGER: auto-update updated_at ─────────────────────────
create trigger set_merchant_payment_config_updated_at
  before update on public.merchant_payment_config
  for each row execute procedure public.set_updated_at();
