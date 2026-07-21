-- ============================================================
-- Connection lifecycle webhook events: connection.approved,
-- connection.revoked. A developer currently has no way to find out when a
-- merchant approves or revokes a Connection except polling
-- GET /api/v1/connections — and a merchant can now revoke from two places
-- (developer-askbiz's /connect/[token] page, and the new Connected Apps
-- card in app/(app)/settings/page.tsx), neither of which notifies anyone.
--
-- All three developer_connections status-changing writes (the two above,
-- plus the sandbox-fixture INSERT in app/api/v1/connections/route.ts) are
-- direct RLS-enforced client-side Supabase calls — there is no backend
-- route in the loop for any of them. A trigger is therefore the only
-- mechanism that catches all three uniformly, same rationale
-- 20260708000004_outbound_webhooks.sql gives for using triggers over
-- scattered application-code calls.
--
-- Unlike the three existing enqueue_*_webhook functions (which notify a
-- merchant about their OWN business events), the party who wants to know
-- about a connection event is the DEVELOPER who owns the API key, not the
-- merchant — owner_id is resolved via developer_connections.key_id ->
-- api_keys.user_id, not merchant_user_id.
-- ============================================================

create or replace function public.enqueue_connection_webhook()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_owner_id uuid;
  v_event text;
begin
  if (tg_op = 'INSERT' and new.status = 'active')
     or (tg_op = 'UPDATE' and new.status = 'active' and old.status is distinct from 'active') then
    v_event := 'connection.approved';
  elsif tg_op = 'UPDATE' and new.status = 'revoked' and old.status is distinct from 'revoked' then
    v_event := 'connection.revoked';
  else
    return new;
  end if;

  select user_id into v_owner_id from public.api_keys where id = new.key_id;
  if v_owner_id is null then
    return new;
  end if;

  if exists (
    select 1 from public.api_webhooks
    where user_id = v_owner_id and is_active = true and v_event = any(event_types)
  ) then
    insert into public.api_webhook_outbox (owner_id, event_type, payload)
    values (
      v_owner_id, v_event,
      case v_event
        when 'connection.approved' then jsonb_build_object(
          'connection_id', new.id, 'app_id', new.app_id, 'merchant_email', new.merchant_email,
          'scopes', new.scopes, 'test_mode', new.is_fixture, 'approved_at', new.approved_at
        )
        else jsonb_build_object(
          'connection_id', new.id, 'app_id', new.app_id, 'merchant_email', new.merchant_email,
          'revoked_at', new.revoked_at
        )
      end
    );
  end if;

  return new;
end;
$$;

revoke execute on function public.enqueue_connection_webhook() from public, anon, authenticated;

drop trigger if exists trg_connection_webhook on public.developer_connections;
create trigger trg_connection_webhook
  after insert or update on public.developer_connections
  for each row execute function public.enqueue_connection_webhook();
