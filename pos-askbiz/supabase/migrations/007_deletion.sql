-- ============================================================
-- Migration 007 — Account Deletion with 30-day delay
-- GDPR compliant deletion flow
-- ============================================================

-- ── DELETION REQUESTS TABLE ───────────────────────────────────
create table if not exists public.deletion_requests (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references auth.users on delete cascade,
  requested_at    timestamptz default now(),
  scheduled_for   timestamptz default now() + interval '30 days',
  status          text default 'pending', -- pending | cancelled | completed
  reason          text,
  cancelled_at    timestamptz
);

create index if not exists idx_deletion_requests_user on public.deletion_requests(user_id);
create index if not exists idx_deletion_requests_scheduled on public.deletion_requests(scheduled_for) where status = 'pending';

alter table public.deletion_requests enable row level security;

-- User can see their own deletion request
create policy "User owns deletion request"
  on public.deletion_requests for all
  using (auth.uid() = user_id);

-- ── FUNCTION: request deletion ────────────────────────────────
create or replace function public.request_account_deletion(
  p_user_id uuid,
  p_reason text default null
) returns jsonb language plpgsql security definer as $$
declare
  v_existing record;
  v_request_id uuid;
begin
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

-- ── FUNCTION: cancel deletion ─────────────────────────────────
create or replace function public.cancel_account_deletion(
  p_user_id uuid
) returns jsonb language plpgsql security definer as $$
begin
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

-- ── UPLOAD ANALYTICS TABLE (anonymised, GDPR safe) ────────────
create table if not exists public.upload_analytics (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references auth.users on delete cascade,
  -- Anonymised metadata only — no actual data values
  file_type       text,                    -- csv | xlsx
  row_count       int,
  column_count    int,
  column_names    text[],                  -- column headers only, not values
  business_type   text,                    -- from user profile
  country         text,                    -- from user profile
  created_at      timestamptz default now()
);

create index if not exists idx_upload_analytics_user on public.upload_analytics(user_id);
create index if not exists idx_upload_analytics_country on public.upload_analytics(country);
create index if not exists idx_upload_analytics_business on public.upload_analytics(business_type);

alter table public.upload_analytics enable row level security;
create policy "Service only upload_analytics" on public.upload_analytics for all using (false);

comment on table public.upload_analytics is 'Anonymised upload metadata for product analytics. No actual business data, customer records, or financial values stored. GDPR compliant.';
