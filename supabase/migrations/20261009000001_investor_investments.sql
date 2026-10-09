-- Investor investments: one row per investor deal, tied to ONE investor login.
-- Isolation is enforced here by RLS, not only in the UI: an investor can read
-- only rows where investor_user_id = auth.uid(); the owner manages all rows of
-- their own business. Payments received are in investor_payments (same rules).
create table if not exists investor_investments (
  id                   uuid primary key default gen_random_uuid(),
  owner_id             uuid not null references auth.users(id) on delete cascade,
  investor_user_id     uuid references auth.users(id) on delete set null,   -- set when the invite is accepted
  investor_email       text not null,
  investor_name        text,
  type                 text not null check (type in ('equity','loan','revenue_share','profit_share','fixed_return')),
  amount               numeric not null check (amount > 0),
  invested_at          date not null,
  -- which part of the business the deal is about
  segment              text not null default 'all' check (segment in ('all','retail','factory')),
  factory_location_id  uuid references pos_locations(id) on delete set null,
  -- type-specific terms, validated in the API, e.g.
  --  equity:        {"equity_pct":6} or {"post_money_valuation":100000}
  --  loan:          {"rate_pct":12,"term_months":24}
  --  revenue_share: {"share_pct":5,"cap_multiple":1.5}
  --  profit_share:  {"share_pct":10,"cap_multiple":2}
  --  fixed_return:  {"payout":500,"every":"month"}
  terms                jsonb not null default '{}'::jsonb,
  show_company_figures boolean not null default true,
  status               text not null default 'active' check (status in ('active','closed')),
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);
create index if not exists idx_investor_inv_owner    on investor_investments(owner_id);
create index if not exists idx_investor_inv_investor on investor_investments(investor_user_id);

create table if not exists investor_payments (
  id            uuid primary key default gen_random_uuid(),
  investment_id uuid not null references investor_investments(id) on delete cascade,
  owner_id      uuid not null references auth.users(id) on delete cascade,
  paid_at       date not null,
  amount        numeric not null check (amount > 0),
  note          text,
  created_at    timestamptz not null default now()
);
create index if not exists idx_investor_pay_investment on investor_payments(investment_id);

alter table investor_investments enable row level security;
alter table investor_payments    enable row level security;

drop policy if exists "Owner manages investments" on investor_investments;
create policy "Owner manages investments" on investor_investments
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

drop policy if exists "Investor reads own investment" on investor_investments;
create policy "Investor reads own investment" on investor_investments
  for select using (investor_user_id is not null and auth.uid() = investor_user_id);

drop policy if exists "Owner manages investor payments" on investor_payments;
create policy "Owner manages investor payments" on investor_payments
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

drop policy if exists "Investor reads own payments" on investor_payments;
create policy "Investor reads own payments" on investor_payments
  for select using (exists (
    select 1 from investor_investments i
    where i.id = investor_payments.investment_id and i.investor_user_id = auth.uid()
  ));

revoke all on investor_investments from anon;
revoke all on investor_payments    from anon;
