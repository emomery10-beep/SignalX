-- ============================================================
-- Migration: close anon-EXECUTE + missing-ownership-check gap on
-- public.request_account_deletion() and public.cancel_account_deletion()
--
-- Found during the repo-wide SECURITY DEFINER audit prompted by the
-- update_consent() anon-privilege fix (20260807000003). Unlike
-- update_consent(), these two functions had NO internal ownership check
-- at all — p_user_id was trusted as-is, with no `auth.uid() = p_user_id`
-- comparison anywhere in the body.
--
-- Live impact before this fix: public.request_account_deletion(uuid, text)
-- and public.cancel_account_deletion(uuid) both had `anon` EXECUTE (the
-- same database-level ALTER DEFAULT PRIVILEGES auto-grant documented in
-- 20260807000003 — see pg_default_acl). Combined with zero internal
-- check, this meant ANY caller with just the public anon key — no login,
-- no session — could call:
--   POST /rest/v1/rpc/request_account_deletion {"p_user_id": "<any uuid>"}
-- and schedule ANY user's account for deletion in 30 days, or silently
-- cancel a real pending deletion request the account owner intentionally
-- filed. This was a live, directly exploitable vulnerability, not a
-- defense-in-depth gap — real user IDs are realistically obtainable in
-- this app (e.g. shared_insights.user_id is public-readable by design).
--
-- The app's own route (app/api/account/route.ts) always calls these with
-- p_user_id = the caller's own authenticated session ID, never
-- client-supplied — so adding the ownership check below changes nothing
-- for that legitimate path. It only blocks the raw-RPC bypass.
-- ============================================================

create or replace function public.request_account_deletion(
  p_user_id uuid,
  p_reason text default null
) returns jsonb language plpgsql security definer as $$
declare
  v_existing record;
  v_request_id uuid;
begin
  if auth.uid() is distinct from p_user_id then
    raise exception 'not authorized';
  end if;

  -- Check if there's already a pending request
  select * into v_existing
  from public.deletion_requests
  where user_id = p_user_id and status = 'pending';

  if found then
    return jsonb_build_object(
      'success', false,
      'error', 'A deletion request is already pending',
      'scheduled_for', v_existing.scheduled_for
    );
  end if;

  -- Create deletion request
  insert into public.deletion_requests (user_id, reason)
  values (p_user_id, p_reason)
  returning id into v_request_id;

  return jsonb_build_object(
    'success', true,
    'request_id', v_request_id,
    'scheduled_for', now() + interval '30 days',
    'message', 'Your account will be permanently deleted in 30 days. You can cancel this request at any time.'
  );
end;
$$;

create or replace function public.cancel_account_deletion(
  p_user_id uuid
) returns jsonb language plpgsql security definer as $$
begin
  if auth.uid() is distinct from p_user_id then
    raise exception 'not authorized';
  end if;

  update public.deletion_requests
  set status = 'cancelled', cancelled_at = now()
  where user_id = p_user_id and status = 'pending';

  if found then
    return jsonb_build_object('success', true, 'message', 'Deletion request cancelled. Your account is safe.');
  else
    return jsonb_build_object('success', false, 'error', 'No pending deletion request found');
  end if;
end;
$$;

revoke all on function public.request_account_deletion(uuid, text) from public;
revoke execute on function public.request_account_deletion(uuid, text) from anon;
grant execute on function public.request_account_deletion(uuid, text) to authenticated;

revoke all on function public.cancel_account_deletion(uuid) from public;
revoke execute on function public.cancel_account_deletion(uuid) from anon;
grant execute on function public.cancel_account_deletion(uuid) to authenticated;

notify pgrst, 'reload schema';
