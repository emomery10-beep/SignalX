-- WaafiPay payment tracking for AskBiz's OWN subscription billing (Somalia).
-- Distinct from merchant_payment_config, which is per-POS-merchant and used
-- for Section 1 (merchant collects payments from their own customers).
-- This table is AskBiz collecting FROM the business owner, mirroring
-- pesapal_payments (038_pesapal_payments.sql) for Kenya.
create table if not exists public.waafipay_billing_payments (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid references auth.users(id) on delete cascade not null,
  reference_id        text unique not null,
  amount              numeric not null,
  currency            text not null default 'USD',
  plan                text not null,
  phone               text,
  status              text default 'pending',
  external_receipt    text,
  completed_at        timestamptz,
  created_at          timestamptz default now()
);

create index if not exists idx_waafipay_billing_user      on public.waafipay_billing_payments(user_id);
create index if not exists idx_waafipay_billing_reference on public.waafipay_billing_payments(reference_id);

alter table public.waafipay_billing_payments enable row level security;

create policy "Users can view own waafipay billing payments"
  on public.waafipay_billing_payments for select
  using (auth.uid() = user_id);

-- The submit_order route inserts via the user's own session client (RLS-bound,
-- not service role), so an insert policy is required — unlike pesapal_payments
-- (038_pesapal_payments.sql), which only has a select policy and silently
-- swallows its insert's result; not copying that gap here.
create policy "Users can insert own waafipay billing payments"
  on public.waafipay_billing_payments for insert
  with check (auth.uid() = user_id);
