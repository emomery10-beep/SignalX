-- ============================================================
-- GoCardless payment/mandate data — doesn't fit unified_data (not an order)
-- or social_signals (not a content/ad metric), so it gets its own table.
-- Written by lib/sync/engine.ts's syncGoCardless().
-- ============================================================

create table if not exists public.gocardless_payments (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users on delete cascade,
  source_id     uuid references public.connected_sources on delete cascade,
  payment_id    text not null,
  mandate_id    text,
  amount        numeric default 0,
  currency      text default 'GBP',
  status        text default '',
  charge_date   date,
  description   text default '',
  raw_data      jsonb,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now(),

  unique(user_id, payment_id)
);

create index if not exists gocardless_payments_user_date_idx
  on public.gocardless_payments(user_id, charge_date desc);

alter table public.gocardless_payments enable row level security;

create policy "Users can view their own GoCardless payments"
  on public.gocardless_payments for select
  using (auth.uid() = user_id);
