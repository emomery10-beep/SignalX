-- ============================================================
-- Wallet top-up (dashboard UI Phase, app/api/v1/wallet/topup) needed the
-- same double-processing guard as developer_charges got in
-- 20260708000004's stripe-billing webhook fix — but top-ups have no
-- 'status' column to gate an atomic UPDATE...WHERE on, so that exact
-- pattern doesn't apply here. A duplicate/replayed Stripe webhook (this
-- app and pos-askbiz's identical copy can both receive the same event —
-- see that file's header) would call topup_api_credits twice for the same
-- checkout session and double-credit the wallet.
--
-- Fix: make provider_ref (the Stripe checkout session id) unique, and
-- insert the ledger row FIRST — the unique constraint makes a replayed
-- webhook's insert fail atomically, which is the real idempotency guard.
-- The balance update only happens if that insert actually landed.
-- ============================================================

create unique index if not exists api_credit_transactions_provider_ref_unique
  on public.api_credit_transactions(provider_ref) where provider_ref is not null;

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
  v_inserted boolean;
begin
  if p_amount_cents <= 0 then
    raise exception 'topup amount must be positive';
  end if;

  begin
    insert into public.api_credit_transactions (key_id, type, amount_cents, balance_after_cents, provider, provider_ref)
    values (p_key_id, 'topup', p_amount_cents, 0, p_provider, p_provider_ref);
    v_inserted := true;
  exception when unique_violation then
    -- Same provider_ref already recorded — this is a replayed webhook for
    -- a checkout session already credited. Return current state as a
    -- no-op rather than crediting twice.
    v_inserted := false;
  end;

  if not v_inserted then
    select * into v_key from public.api_keys where id = p_key_id;
    return v_key;
  end if;

  update public.api_keys
  set credit_balance_cents = credit_balance_cents + p_amount_cents
  where id = p_key_id
  returning * into v_key;

  update public.api_credit_transactions
  set balance_after_cents = v_key.credit_balance_cents
  where key_id = p_key_id and provider_ref = p_provider_ref and type = 'topup';

  return v_key;
end;
$$;
