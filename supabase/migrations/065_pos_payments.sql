-- Migration 065: POS Payments Tracking Table
-- Tracks all digital payment attempts and completions (M-Pesa, cards, Apple Pay)
-- Required for Paystack webhook processing and payment recovery (dunning)

CREATE TABLE IF NOT EXISTS public.pos_payments (
  id                      uuid primary key default gen_random_uuid(),
  owner_id                uuid not null references auth.users on delete cascade,
  transaction_id          uuid not null references public.pos_transactions(id) on delete cascade,
  cashier_id              uuid references public.pos_staff(id) on delete set null,

  -- Payment details
  customer_phone          text,
  amount                  numeric not null,
  payment_method          text not null default 'card',

  -- Provider references
  provider                text not null default 'paystack',
  external_reference      text,
  external_receipt        text,

  -- Status tracking
  status                  text not null default 'pending' check (status in ('pending', 'completed', 'failed', 'cancelled')),
  error_message           text,

  -- Timing
  initiated_at            timestamptz default now(),
  completed_at            timestamptz,
  created_at              timestamptz default now(),
  updated_at              timestamptz default now()
);

ALTER TABLE public.pos_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payments"
  ON public.pos_payments FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert own payments"
  ON public.pos_payments FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own payments"
  ON public.pos_payments FOR UPDATE USING (auth.uid() = owner_id);

-- Service role needs full access for webhooks
CREATE POLICY "Service role full access on pos_payments"
  ON public.pos_payments
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_pos_payments_owner ON public.pos_payments(owner_id);
CREATE INDEX IF NOT EXISTS idx_pos_payments_transaction ON public.pos_payments(transaction_id);
CREATE INDEX IF NOT EXISTS idx_pos_payments_status ON public.pos_payments(status);
CREATE INDEX IF NOT EXISTS idx_pos_payments_provider ON public.pos_payments(provider);
CREATE INDEX IF NOT EXISTS idx_pos_payments_external_ref ON public.pos_payments(external_reference);
