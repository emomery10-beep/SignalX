-- ============================================================
-- Closes the "silent undercharge" gap in app/api/v1/whatsapp/send/route.ts:
-- if the atomic debit_api_credits UPDATE fails (balance was drained by a
-- concurrent request between the pre-check and the debit — a genuine race,
-- not a bug in the check itself), the WhatsApp message has ALREADY sent —
-- Meta doesn't support unsend — but the wallet was never actually charged.
-- Previously this was only console.error'd for manual reconciliation.
--
-- Fix: a p_force flag that skips the balance-sufficiency WHERE clause,
-- letting the balance go negative to accurately record the debt instead of
-- silently eating the cost. A negative balance is caught by every route's
-- existing pre-check (credit_balance_cents < price) on the caller's NEXT
-- request, so this doesn't open a way to keep spending for free — it just
-- makes the one unavoidable race-condition call honestly accounted for.
-- ============================================================

drop function if exists public.debit_api_credits(uuid, integer, text, text, text, jsonb);

create or replace function public.debit_api_credits(
  p_key_id uuid,
  p_amount_cents integer,
  p_endpoint text,
  p_request_id text,
  p_idempotency_key text default null,
  p_response_snapshot jsonb default null,
  p_force boolean default false
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

  if p_force then
    update public.api_keys
    set credit_balance_cents = credit_balance_cents - p_amount_cents
    where id = p_key_id
    returning * into v_key;
  else
    update public.api_keys
    set credit_balance_cents = credit_balance_cents - p_amount_cents
    where id = p_key_id
      and credit_balance_cents >= p_amount_cents
    returning * into v_key;
  end if;

  if v_key.id is not null then
    insert into public.api_credit_transactions
      (key_id, type, amount_cents, balance_after_cents, endpoint, request_id, idempotency_key, response_snapshot)
    values
      (p_key_id, case when p_force then 'adjustment' else 'debit' end, -p_amount_cents, v_key.credit_balance_cents, p_endpoint, p_request_id, p_idempotency_key, p_response_snapshot);
  end if;

  return v_key; -- null if the update matched no rows (insufficient balance, non-forced only)
end;
$$;

revoke execute on function public.debit_api_credits(uuid, integer, text, text, text, jsonb, boolean) from public;
grant execute on function public.debit_api_credits(uuid, integer, text, text, text, jsonb, boolean) to service_role;
