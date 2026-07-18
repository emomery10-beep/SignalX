-- ============================================================
-- Durable per-minute rate limiting for /api/v1/*. The previous limiter
-- (an in-process JS Map in lib/api-v1-auth.ts and a duplicate copy in
-- app/api/v1/ask/route.ts) resets per serverless instance — on Vercel,
-- concurrent requests landing on different warm lambdas each get their own
-- counter, so the advertised per-plan limit (5/60/120 per minute) is not
-- actually enforced under real multi-instance traffic, and the
-- X-RateLimit-Remaining header added this session could report a number
-- that isn't true. This closes that gap with a DB-backed atomic counter —
-- same "one atomic UPDATE...WHERE, not a check-then-act race" shape as
-- debit_api_credits (20260708000001_api_credit_wallet.sql).
--
-- Wall-clock-minute buckets (date_trunc('minute', now())) rather than a
-- rolling window from first request — simpler to reason about in SQL,
-- matches how GitHub/Twitter rate limiting works, and avoids clock-skew
-- edge cases a rolling window would need extra bookkeeping to avoid.
-- ============================================================

create table if not exists public.api_rate_limit_windows (
  key_id       uuid primary key references public.api_keys(id) on delete cascade,
  window_start timestamptz not null,
  count        integer not null default 0
);

alter table public.api_rate_limit_windows enable row level security;
-- No policies granted to anon/authenticated — this table is purely an
-- internal counter, written and read only via the service-role RPC below.

create or replace function public.check_and_increment_rate_limit(
  p_key_id uuid,
  p_limit integer
) returns table(allowed boolean, remaining integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_window timestamptz := date_trunc('minute', now());
  v_count integer;
begin
  insert into public.api_rate_limit_windows (key_id, window_start, count)
  values (p_key_id, v_window, 1)
  on conflict (key_id) do update
    set count = case
          when public.api_rate_limit_windows.window_start = v_window
            then public.api_rate_limit_windows.count + 1
          else 1
        end,
        window_start = v_window
  returning public.api_rate_limit_windows.count into v_count;

  if v_count > p_limit then
    return query select false, 0;
  else
    return query select true, greatest(0, p_limit - v_count);
  end if;
end;
$$;

revoke execute on function public.check_and_increment_rate_limit(uuid, integer) from public;
grant execute on function public.check_and_increment_rate_limit(uuid, integer) to service_role;
