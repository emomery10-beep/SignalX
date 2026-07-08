-- ============================================================
-- Pay-per-use credit wallet for the developer API (Phase 0 of the
-- developers.askbiz.co platform). Extends api_keys (20260622000004) with a
-- prepaid balance instead of relying solely on the monthly quota, and adds
-- an append-only ledger so every debit/topup is auditable back to the
-- request or payment that caused it.
--
-- Prepaid, not postpaid-metered: M-Pesa/PesaPal don't support Stripe-style
-- recurring usage invoicing, and prepaid removes collection/credit risk
-- entirely. request_limit_month/minute are kept as-is for abuse/rate
-- limiting — the credit balance is a separate floor, not a replacement.
-- Idempotent (add ... if not exists, drop-then-create policies).
-- ============================================================

alter table public.api_keys add column if not exists credit_balance_cents integer not null default 0;
alter table public.api_keys add column if not exists low_balance_threshold_cents integer not null default 500;

create table if not exists public.api_credit_transactions (
  id                 uuid primary key default gen_random_uuid(),
  key_id             uuid not null references public.api_keys(id) on delete cascade,
  type               text not null check (type in ('topup', 'debit', 'refund', 'adjustment')),
  amount_cents       integer not null,          -- positive for topup/refund, negative for debit/adjustment
  balance_after_cents integer not null,
  endpoint           text,                       -- e.g. '/api/v1/scan' — null for topups
  request_id         text,                       -- ties back to the api_usage row for that call
  provider           text,                       -- 'mpesa' | 'pesapal' | 'stripe' | 'system'
  provider_ref       text,                       -- external transaction id, for topup reconciliation
  created_at         timestamptz not null default now()
);
create index if not exists api_credit_transactions_key_id_idx on public.api_credit_transactions(key_id);
create index if not exists api_credit_transactions_provider_ref_idx on public.api_credit_transactions(provider_ref);

alter table public.api_credit_transactions enable row level security;
-- Read-only for the owning user (via their key); all writes happen through
-- the service client from API route handlers (debit-on-success, topup
-- webhooks), never directly from the browser — mirrors how api_usage rows
-- are written today.
drop policy if exists "api_credit_transactions_owner_select" on public.api_credit_transactions;
create policy "api_credit_transactions_owner_select" on public.api_credit_transactions for select
  using (
    exists (
      select 1 from public.api_keys
      where api_keys.id = api_credit_transactions.key_id
        and api_keys.user_id = auth.uid()
    )
  );

-- Atomic debit — the read-check-then-write for "balance >= cost" must happen
-- in one statement, not two round-trips from the app server, or concurrent
-- requests on the same key can both pass the check before either debits
-- (classic check-then-act race). Returns the resulting row so the caller
-- can tell a real debit from a rejected one (0 rows = insufficient balance).
create or replace function public.debit_api_credits(
  p_key_id uuid,
  p_amount_cents integer,
  p_endpoint text,
  p_request_id text
) returns public.api_keys
language plpgsql
security definer
set search_path = public
as $$
declare
  v_key public.api_keys;
begin
  if p_amount_cents <= 0 then
    raise exception 'debit amount must be positive';
  end if;

  update public.api_keys
  set credit_balance_cents = credit_balance_cents - p_amount_cents
  where id = p_key_id
    and credit_balance_cents >= p_amount_cents
  returning * into v_key;

  if v_key.id is not null then
    insert into public.api_credit_transactions (key_id, type, amount_cents, balance_after_cents, endpoint, request_id)
    values (p_key_id, 'debit', -p_amount_cents, v_key.credit_balance_cents, p_endpoint, p_request_id);
  end if;

  return v_key; -- null if the update matched no rows (insufficient balance)
end;
$$;

create or replace function public.topup_api_credits(
  p_key_id uuid,
  p_amount_cents integer,
  p_provider text,
  p_provider_ref text
) returns public.api_keys
language plpgsql
security definer
set search_path = public
as $$
declare
  v_key public.api_keys;
begin
  if p_amount_cents <= 0 then
    raise exception 'topup amount must be positive';
  end if;

  update public.api_keys
  set credit_balance_cents = credit_balance_cents + p_amount_cents
  where id = p_key_id
  returning * into v_key;

  if v_key.id is not null then
    insert into public.api_credit_transactions (key_id, type, amount_cents, balance_after_cents, provider, provider_ref)
    values (p_key_id, 'topup', p_amount_cents, v_key.credit_balance_cents, p_provider, p_provider_ref);
  end if;

  return v_key;
end;
$$;

-- Both functions are security definer (they must bypass RLS to write the
-- ledger + balance), which makes them exactly the kind of function Supabase
-- auto-exposes as a public RPC endpoint (postgrest /rest/v1/rpc/<name>).
-- Without this revoke, any authenticated user could call
-- rpc/topup_api_credits directly with an arbitrary key_id and mint
-- themselves free credits, or debit a key they don't own. Only the service
-- role (used exclusively from trusted server-side route handlers) may call
-- these — never the browser/anon/authenticated roles.
revoke execute on function public.debit_api_credits(uuid, integer, text, text) from public;
revoke execute on function public.topup_api_credits(uuid, integer, text, text) from public;
grant execute on function public.debit_api_credits(uuid, integer, text, text) to service_role;
grant execute on function public.topup_api_credits(uuid, integer, text, text) to service_role;
