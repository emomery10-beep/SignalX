-- ============================================================
-- Verified Business (KYC/KYB) program — v1, manual admin review.
--
-- A business submits company details + supporting documents, an AskBiz
-- admin reviews and approves/rejects (gated through lib/admin-auth.ts,
-- same as every other admin action on developer accounts), and an
-- approved business gets a "Verified business" badge on the Connections
-- consent screen plus a rate-limit bump on its API keys.
--
-- Storage follows the exact vendor_captures / vendor-captures shape from
-- 20260712000001_vendor_enablement.sql — that migration's own comment
-- calls out "national IDs and licences — sensitive KYC", which is exactly
-- what this is. Same private-bucket-with-owner-namespaced-path pattern,
-- same signed-URL-only read model.
--
-- is_user_verified() lets the public /connect/[token] consent page (a
-- client-side page with no backend route of its own) check a business's
-- verified status without any RLS access to the verification row itself —
-- following the search_path-pinned, PUBLIC-revoked, explicitly-granted
-- SECURITY DEFINER pattern fixed repo-wide in the 20260720 security audit
-- (20260720000006/7/8), not the old unpinned/PUBLIC-open pattern those
-- migrations had to clean up after.
-- ============================================================

create table if not exists business_verifications (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references auth.users(id) on delete cascade,

  status              text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),

  legal_name          text,
  registration_number text,
  tax_id              text,
  address             text,

  submitted_at        timestamptz default now(),
  reviewed_at         timestamptz,
  reviewed_by         uuid references auth.users(id) on delete set null,
  rejection_reason    text,

  created_at          timestamptz default now(),
  unique(user_id)
);

create index if not exists idx_business_verifications_status on business_verifications(status);

alter table business_verifications enable row level security;

drop policy if exists "business_verifications_select_own" on business_verifications;
create policy "business_verifications_select_own" on business_verifications
  for select to authenticated
  using (user_id = auth.uid());

drop policy if exists "business_verifications_insert_own" on business_verifications;
create policy "business_verifications_insert_own" on business_verifications
  for insert to authenticated
  with check (user_id = auth.uid() and status = 'pending');

-- Owner can resubmit while pending or after a rejection, but the WITH CHECK
-- pins the resulting row's status to 'pending' regardless of what the
-- caller sends — an owner can never write 'approved' onto their own row,
-- even if a future direct-client write bypasses the backend route.
drop policy if exists "business_verifications_update_own" on business_verifications;
create policy "business_verifications_update_own" on business_verifications
  for update to authenticated
  using (user_id = auth.uid() and status in ('pending', 'rejected'))
  with check (user_id = auth.uid() and status = 'pending');

-- ---------- Supporting documents ----------
create table if not exists business_verification_documents (
  id              uuid primary key default gen_random_uuid(),
  verification_id uuid not null references business_verifications(id) on delete cascade,
  owner_id        uuid not null references auth.users(id) on delete cascade,
  kind            text not null check (kind in ('registration_certificate', 'proof_of_address', 'owner_id', 'ownership_disclosure')),
  storage_path    text not null,
  uploaded_at     timestamptz default now()
);

create index if not exists idx_business_verification_documents_verification on business_verification_documents(verification_id);

alter table business_verification_documents enable row level security;

drop policy if exists "business_verification_documents_select_own" on business_verification_documents;
create policy "business_verification_documents_select_own" on business_verification_documents
  for select to authenticated
  using (owner_id = auth.uid());

drop policy if exists "business_verification_documents_insert_own" on business_verification_documents;
create policy "business_verification_documents_insert_own" on business_verification_documents
  for insert to authenticated
  with check (owner_id = auth.uid());

-- ---------- Private bucket for KYC documents ----------
-- Same shape as 'vendor-captures': private, owner-namespaced path
-- (kyc-documents/{owner_id}/{timestamp}-{kind}.jpg), signed-URL-only read.
insert into storage.buckets (id, name, public)
values ('kyc-documents', 'kyc-documents', false)
on conflict (id) do nothing;

drop policy if exists "kyc_documents_read_own" on storage.objects;
create policy "kyc_documents_read_own" on storage.objects
  for select to authenticated
  using (bucket_id = 'kyc-documents' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "kyc_documents_insert_own" on storage.objects;
create policy "kyc_documents_insert_own" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'kyc-documents' and (storage.foldername(name))[1] = auth.uid()::text);

-- ---------- Public verified-status check (SECURITY DEFINER, minimal surface) ----------
create or replace function public.is_user_verified(target_user_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from business_verifications
    where user_id = target_user_id and status = 'approved'
  );
$$;

revoke execute on function public.is_user_verified(uuid) from public;
grant execute on function public.is_user_verified(uuid) to authenticated;

-- /connect/[token] only has a merchant-readable user_id to check when the
-- connection is grouped under a developer_apps row (readable via
-- developer_apps_connected_merchant_select). When it isn't, the only thing
-- the merchant can see is developer_connections.key_id — and api_keys is
-- owner-only RLS (api_keys_owner_all), so the merchant can't read
-- api_keys.user_id themselves to call is_user_verified() with it. This
-- SECURITY DEFINER function does that lookup on the merchant's behalf
-- without exposing api_keys itself.
create or replace function public.is_key_owner_verified(target_key_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from api_keys
    join business_verifications on business_verifications.user_id = api_keys.user_id
    where api_keys.id = target_key_id and business_verifications.status = 'approved'
  );
$$;

revoke execute on function public.is_key_owner_verified(uuid) from public;
grant execute on function public.is_key_owner_verified(uuid) to authenticated;
