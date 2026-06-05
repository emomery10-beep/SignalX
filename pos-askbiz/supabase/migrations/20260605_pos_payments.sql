-- ============================================================
-- Migration: POS Payments Tracking
-- Tracks all digital payments (M-Pesa, cards, Apple Pay) linked to transactions
-- ============================================================

-- ── POS PAYMENTS ─────────────────────────────────────────────
-- Record of every digital payment attempt and completion
create table if not exists public.pos_payments (
  id                      uuid primary key default gen_random_uuid(),
  owner_id                uuid not null references auth.users on delete cascade,
  transaction_id          uuid not null references public.pos_transactions(id) on delete cascade,
  cashier_id              uuid references public.pos_staff(id) on delete set null,

  -- Payment details
  customer_phone          text,                          -- who's paying (for M-Pesa STK Push)
  amount                  numeric not null,              -- in merchant's local currency
  payment_method          text not null check (payment_method in ('mpesa', 'card', 'apple_pay', 'google_pay')),

  -- Provider references
  provider                text not null check (provider in ('paystack', 'stripe')),
  external_reference      text,                          -- Paystack reference or Stripe payment intent ID
  external_receipt        text,                          -- M-Pesa receipt number or Stripe charge ID

  -- Status tracking
  status                  text not null default 'pending' check (status in ('pending', 'completed', 'failed', 'cancelled')),
  error_message           text,                          -- if failed, why

  -- Timing
  initiated_at            timestamptz default now(),
  completed_at            timestamptz,
  created_at              timestamptz default now(),
  updated_at              timestamptz default now()
);

alter table public.pos_payments enable row level security;

create policy "Users can view own payments"
  on public.pos_payments for select using (auth.uid() = owner_id);

create policy "Users can insert own payments"
  on public.pos_payments for insert with check (auth.uid() = owner_id);

create policy "Users can update own payments"
  on public.pos_payments for update using (auth.uid() = owner_id);

create index if not exists idx_pos_payments_owner
  on public.pos_payments(owner_id);

create index if not exists idx_pos_payments_transaction
  on public.pos_payments(transaction_id);

create index if not exists idx_pos_payments_status
  on public.pos_payments(status);

create index if not exists idx_pos_payments_provider
  on public.pos_payments(provider);

create index if not exists idx_pos_payments_external_ref
  on public.pos_payments(external_reference);

-- ── TRIGGER: auto-update updated_at ─────────────────────────
create trigger set_pos_payments_updated_at
  before update on public.pos_payments
  for each row execute procedure public.set_updated_at();
