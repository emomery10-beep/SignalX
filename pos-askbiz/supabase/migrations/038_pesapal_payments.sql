-- PesaPal payment tracking (Kenya — M-Pesa, Airtel Money, cards)
create table if not exists public.pesapal_payments (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid references auth.users(id) on delete cascade not null,
  order_tracking_id   text unique not null,
  merchant_reference  text,
  amount              numeric not null,
  plan                text not null,
  status              text default 'pending',
  payment_method      text,
  confirmation_code   text,
  completed_at        timestamptz,
  created_at          timestamptz default now()
);

create index if not exists idx_pesapal_payments_user    on public.pesapal_payments(user_id);
create index if not exists idx_pesapal_payments_tracking on public.pesapal_payments(order_tracking_id);

alter table public.pesapal_payments enable row level security;

create policy "Users can view own pesapal payments"
  on public.pesapal_payments for select
  using (auth.uid() = user_id);
