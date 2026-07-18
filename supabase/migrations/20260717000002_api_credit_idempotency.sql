-- ============================================================
-- Idempotency for the pay-per-use API billing path (/api/v1/scan,
-- /api/v1/whatsapp/send). Closes a real double-charge/double-send bug: a
-- client-side timeout followed by a retry currently re-runs the billable
-- side effect (a second Groq call, or worse, a second real WhatsApp
-- message) and debits twice, because nothing checks for a prior identical
-- request before the side effect runs.
--
-- Mirrors the existing provider_ref idempotency pattern from
-- 20260708000008_wallet_topup_idempotency.sql rather than inventing a new
-- shape. Same Idempotency-Key header convention as Stripe.
-- ============================================================

alter table public.api_credit_transactions add column if not exists idempotency_key text;
alter table public.api_credit_transactions add column if not exists response_snapshot jsonb;

create unique index if not exists api_credit_transactions_key_idem_uidx
  on public.api_credit_transactions(key_id, idempotency_key)
  where idempotency_key is not null;

-- Postgres identifies functions by name + parameter types, so adding two
-- new (defaulted) params via CREATE OR REPLACE would leave the original
-- 4-arg overload in place alongside this one — a call with exactly 4
-- positional args would then be ambiguous between them. Drop the old
-- overload explicitly first.
drop function if exists public.debit_api_credits(uuid, integer, text, text);

-- debit_api_credits now accepts an optional client idempotency key + the
-- response body to snapshot. On a genuine idempotency-key collision (the
-- unique index above), the insert is skipped and the ALREADY-committed row
-- is returned instead — the route handler distinguishes "fresh debit" from
-- "replay" by comparing p_idempotency_key against what it already checked
-- via a SELECT before doing any billable work (see lib/api-v1-auth.ts
-- checkIdempotency). This function stays the atomic source of truth for the
-- balance mutation; the pre-check in the route is what actually prevents a
-- second real Groq/WhatsApp call, not this function alone.
create or replace function public.debit_api_credits(
  p_key_id uuid,
  p_amount_cents integer,
  p_endpoint text,
  p_request_id text,
  p_idempotency_key text default null,
  p_response_snapshot jsonb default null
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
    insert into public.api_credit_transactions
      (key_id, type, amount_cents, balance_after_cents, endpoint, request_id, idempotency_key, response_snapshot)
    values
      (p_key_id, 'debit', -p_amount_cents, v_key.credit_balance_cents, p_endpoint, p_request_id, p_idempotency_key, p_response_snapshot);
  end if;

  return v_key; -- null if the update matched no rows (insufficient balance)
end;
$$;

revoke execute on function public.debit_api_credits(uuid, integer, text, text, text, jsonb) from public;
grant execute on function public.debit_api_credits(uuid, integer, text, text, text, jsonb) to service_role;
