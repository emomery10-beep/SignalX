-- ============================================================
-- Migration: WaafiPay merchant config
-- Adds WaafiPay as a payment_provider option (single gateway
-- aggregating EVC Plus / WAAFI / Zaad / Sahal mobile wallets,
-- Somalia) and per-merchant credential columns.
-- ============================================================

alter table public.merchant_payment_config
  drop constraint if exists merchant_payment_config_payment_provider_check;
alter table public.merchant_payment_config
  add constraint merchant_payment_config_payment_provider_check
    check (payment_provider in ('none', 'paystack', 'stripe', 'waafipay'));

-- WaafiPay credentials (per merchant) — not self-serve, provisioned manually
-- once a merchant has a relationship with WAAFI HQ or a partner branch.
alter table public.merchant_payment_config
  add column if not exists waafipay_merchant_uid  text,   -- merchantUid
  add column if not exists waafipay_api_user_id    text,   -- apiUserId
  add column if not exists waafipay_api_key        text,   -- apiKey — bearer secret
  add column if not exists waafipay_webhook_secret text;   -- returned by WEBHOOK_REGISTER
