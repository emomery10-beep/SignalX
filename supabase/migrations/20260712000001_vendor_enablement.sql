-- ============================================================
-- Vendor enablement ("Listability Readiness") + provenance-first capture
--
-- Two jobs in one migration:
--   1. vendor_captures        — the raw-capture provenance layer that the
--      camera pipeline has never had. Every photo (menu board, ID, permit,
--      food) is retained WITH its extraction model + confidence + raw JSON,
--      so history can be re-extracted for free as models improve, and so
--      the data is trustworthy enough to power both the vendor's own
--      intelligence AND (aggregated + consented) external value.
--   2. restaurant_vendor_readiness — the low-literacy onboarding state:
--      which formality gates a food stall has cleared on its way to being
--      listable on Glovo / Bolt Food, plus its data-sharing consent.
--
-- Both are owner-scoped with the same RLS pattern as the rest of the POS.
-- Delivery SALES will later flow into unified_data (channel='glovo'|'bolt')
-- so the existing intelligence + market layers light up with no new code —
-- that wiring is a separate step, not part of this migration.
-- ============================================================

-- ---------- 1. Provenance-first raw capture log ----------
create table if not exists vendor_captures (
  id            uuid primary key default gen_random_uuid(),
  owner_id      uuid not null references auth.users(id) on delete cascade,
  location_id   uuid references pos_locations(id) on delete set null,
  kind          text not null,             -- 'menu_photo' | 'food' | 'id' | 'permit' | 'health_cert' | 'food_handler' | 'other'
  storage_path  text,                      -- path in PRIVATE 'vendor-captures' bucket; null if not retained
  model         text,                      -- extraction model id (provenance)
  confidence    int,                       -- 0-100
  raw_json      jsonb,                      -- full raw extraction output (provenance / re-extraction)
  status        text default 'captured',   -- 'captured' | 'confirmed' | 'discarded'
  created_at    timestamptz default now()
);

create index if not exists idx_vendor_captures_owner   on vendor_captures(owner_id);
create index if not exists idx_vendor_captures_kind    on vendor_captures(owner_id, kind);
create index if not exists idx_vendor_captures_created on vendor_captures(created_at desc);

alter table vendor_captures enable row level security;
drop policy if exists "owner_rls_vendor_captures" on vendor_captures;
create policy "owner_rls_vendor_captures" on vendor_captures
  using (owner_id = auth.uid());

-- ---------- 2. Listability readiness (onboarding state) ----------
create table if not exists restaurant_vendor_readiness (
  id                 uuid primary key default gen_random_uuid(),
  owner_id           uuid not null references auth.users(id) on delete cascade,
  location_id        uuid references pos_locations(id) on delete set null,

  stage              text default 'menu',   -- current wizard stage
  readiness_score    int  default 0,        -- 0-100, drives the visual gauge

  -- per-gate status: 'missing' | 'captured' | 'confirmed' | 'not_applicable'
  gate_menu          text default 'missing',
  gate_id            text default 'missing',
  gate_payout        text default 'missing',
  gate_permit        text default 'missing',
  gate_health        text default 'missing',
  gate_food_handler  text default 'missing',

  -- links to the raw captures that satisfied the document gates
  id_capture_id      uuid references vendor_captures(id) on delete set null,
  permit_capture_id  uuid references vendor_captures(id) on delete set null,
  health_capture_id  uuid references vendor_captures(id) on delete set null,

  -- payout
  payout_method      text,                  -- 'mpesa' | 'bank'
  payout_number      text,                  -- M-Pesa number or masked bank ref

  -- per-platform submission: 'not_started' | 'submitted' | 'approved' | 'rejected'
  submitted_glovo    text default 'not_started',
  submitted_bolt     text default 'not_started',
  submitted_uber     text default 'not_started',

  -- NOTE: data-sharing consent is NOT captured here. It is captured at
  -- sign-up / sign-in and stored on the profile (collective_opt_in /
  -- market_intelligence_opt_in). Aggregate/external use always honours that
  -- profile flag + the >=3 privacy floor and never sells a named vendor.
  -- Identifiable records are still RETAINED (service-role/admin readable) so
  -- they remain accessible to authorities for fraud prevention / abuse cases.

  updated_at         timestamptz default now(),
  created_at         timestamptz default now(),
  unique(owner_id, location_id)
);

create index if not exists idx_vendor_readiness_owner on restaurant_vendor_readiness(owner_id);

alter table restaurant_vendor_readiness enable row level security;
drop policy if exists "owner_rls_vendor_readiness" on restaurant_vendor_readiness;
create policy "owner_rls_vendor_readiness" on restaurant_vendor_readiness
  using (owner_id = auth.uid());

drop trigger if exists update_vendor_readiness_updated_at on restaurant_vendor_readiness;
create trigger update_vendor_readiness_updated_at
  before update on restaurant_vendor_readiness
  for each row
  execute function public.update_updated_at_column();

-- ---------- 3. Private bucket for raw captures ----------
-- PRIVATE (unlike product-photos which is public): these captures include
-- national IDs and licences — sensitive KYC. Files namespaced per owner:
-- vendor-captures/{owner_id}/{timestamp}-{kind}.jpg. Read via signed URLs.
insert into storage.buckets (id, name, public)
values ('vendor-captures', 'vendor-captures', false)
on conflict (id) do nothing;

drop policy if exists "vendor_captures_read_own" on storage.objects;
create policy "vendor_captures_read_own" on storage.objects
  for select to authenticated
  using (bucket_id = 'vendor-captures' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "vendor_captures_insert_own" on storage.objects;
create policy "vendor_captures_insert_own" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'vendor-captures' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "vendor_captures_delete_own" on storage.objects;
create policy "vendor_captures_delete_own" on storage.objects
  for delete to authenticated
  using (bucket_id = 'vendor-captures' and (storage.foldername(name))[1] = auth.uid()::text);
