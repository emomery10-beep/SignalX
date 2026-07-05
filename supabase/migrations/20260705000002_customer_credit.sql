-- ============================================================
-- Migration: Customer credit (deni) — sell-on-account tracking
--
-- Lets a vendor track money customers owe them ("deni"), including
-- migrating balances from a paper notebook. A ledger, not a single
-- mutable balance column: every debt and repayment is its own row,
-- so history survives and concurrent writes can't corrupt the total.
-- pos_customers.balance_owed is a CACHE of that ledger, kept in sync
-- by a trigger — reads stay a single indexed column lookup.
-- ============================================================

-- 1. pos_customers: phone becomes optional. A notebook deni entry is
--    usually just a name ("Mama Njeri — 1,500"), no phone. The existing
--    UNIQUE(owner_id, phone) constraint is unaffected — Postgres treats
--    NULLs as distinct, so multiple phone-less customers can coexist;
--    de-duplication for those is by name, handled in application code.
alter table public.pos_customers
  alter column phone drop not null;

alter table public.pos_customers
  add constraint pos_customers_has_identifier
  check (phone is not null or name is not null);

alter table public.pos_customers
  add column if not exists balance_owed numeric(12,2) not null default 0;

-- Fast "who owes me" lookups — partial index, most customers owe nothing.
create index if not exists idx_pos_customers_balance_owed
  on public.pos_customers (owner_id, balance_owed desc)
  where balance_owed <> 0;

-- 2. The ledger itself.
create table if not exists public.pos_customer_credit (
  id             uuid primary key default gen_random_uuid(),
  owner_id       uuid not null references auth.users on delete cascade,
  customer_id    uuid not null references public.pos_customers(id) on delete cascade,
  -- 'debt'    — a credit sale (linked via transaction_id)
  -- 'opening' — a migrated balance with no sale behind it (from a notebook photo)
  -- 'payment' — a repayment, reduces the balance
  kind           text not null check (kind in ('debt', 'opening', 'payment')),
  amount         numeric(12,2) not null check (amount > 0),
  transaction_id uuid references public.pos_transactions(id) on delete set null,
  note           text,
  created_by     uuid,  -- pos_staff.id or owner's auth.uid(); nullable, no FK (staff and owner share this column)
  created_at     timestamptz default now()
);

create index if not exists idx_pos_customer_credit_customer
  on public.pos_customer_credit (owner_id, customer_id, created_at desc);

-- 3. Keep pos_customers.balance_owed in sync with the ledger.
-- Append-only ledger (no UPDATE/DELETE path in the API) — an AFTER INSERT
-- trigger is sufficient; there is nothing to reconcile on update/delete.
create or replace function public.apply_customer_credit_entry_fn()
returns trigger language plpgsql security definer as $$
begin
  update public.pos_customers
     set balance_owed = balance_owed
       + case when NEW.kind = 'payment' then -NEW.amount else NEW.amount end
   where id = NEW.customer_id
     and owner_id = NEW.owner_id;
  return NEW;
end;
$$;

drop trigger if exists trg_apply_customer_credit_entry on public.pos_customer_credit;
create trigger trg_apply_customer_credit_entry
  after insert on public.pos_customer_credit
  for each row execute function public.apply_customer_credit_entry_fn();

-- 4. Sell-on-account: allow 'credit' as a transaction payment type.
--    (Deliberately not used by the checkout flow yet — this migration only
--    unblocks it for a future slice; today 'credit' rows are created solely
--    via the migration-import and manual-opening-balance paths above.)
--    The existing check on payment_type was defined inline in 018_pos.sql
--    with no explicit name, so its name is whatever Postgres auto-generated.
--    Look it up instead of guessing, so this migration can't silently leave
--    the OLD check in place alongside the new one (which would still block
--    'credit' even after this migration "succeeds").
do $$
declare
  old_check text;
begin
  select con.conname into old_check
    from pg_constraint con
    join pg_class rel on rel.oid = con.conrelid
   where rel.relname = 'pos_transactions'
     and con.contype = 'c'
     and pg_get_constraintdef(con.oid) ilike '%payment_type%';

  if old_check is not null then
    execute format('alter table public.pos_transactions drop constraint %I', old_check);
  end if;
end $$;

-- Includes 'mobile'/'mpesa' (added by 20260606_add_mobile_payment_type.sql,
-- and in real use in production) alongside the original set — this constraint
-- replaces whatever was there, so it must be a superset, not just +credit.
alter table public.pos_transactions
  add constraint pos_transactions_payment_type_check
  check (payment_type in ('cash', 'card', 'mobile', 'mpesa', 'other', 'credit'));

-- 5. RLS — same owner-only pattern as every other POS table.
alter table public.pos_customer_credit enable row level security;

create policy "Owner manages customer credit"
  on public.pos_customer_credit for all using (auth.uid() = owner_id);
