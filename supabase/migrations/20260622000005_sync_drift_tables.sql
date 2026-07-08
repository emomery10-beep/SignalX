-- ============================================================
-- Schema-drift sync: three tables that exist in PRODUCTION but were
-- never captured in the migration history. Reconstructed verbatim from
-- the production schema (supabase db dump --linked) so a fresh DB / CI
-- replay and the generated types match prod. Fully idempotent — a no-op
-- in production (these tables already exist) and on any DB that has them.
-- ============================================================

-- ── shipments — inbound/outbound tracking + working-capital risk ──
create table if not exists public.shipments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  tracking_number text not null,
  carrier_code text,
  supplier_name text,
  sku text,
  quantity integer,
  unit_cost numeric(12,2),
  total_value numeric(12,2),
  order_date date,
  expected_arrival date,
  actual_arrival date,
  shipment_type text default 'inbound' check (shipment_type in ('inbound','outbound')),
  track_status text default 'Pending',
  track_sub_status text,
  last_event text,
  last_location text,
  last_update timestamptz,
  unit_cost_currency text default 'USD',
  total_value_currency text default 'USD',
  daily_financing_cost numeric(12,2) default 0,
  working_capital_days integer default 0,
  financial_impact numeric(12,2) default 0,
  purchase_order_ref text,
  is_at_risk boolean default false,
  customs_hold boolean default false,
  stockout_risk boolean default false,
  risk_score numeric(3,1),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists shipments_user_id_idx on public.shipments(user_id);
create index if not exists shipments_created_at_idx on public.shipments(created_at desc);
create index if not exists shipments_is_at_risk_idx on public.shipments(is_at_risk);
create index if not exists shipments_track_status_idx on public.shipments(track_status);
alter table public.shipments enable row level security;
drop policy if exists "shipments_select" on public.shipments;
create policy "shipments_select" on public.shipments for select using (user_id = auth.uid());
drop policy if exists "shipments_insert" on public.shipments;
create policy "shipments_insert" on public.shipments for insert with check (user_id = auth.uid());
drop policy if exists "shipments_update" on public.shipments;
create policy "shipments_update" on public.shipments for update using (user_id = auth.uid());
drop policy if exists "shipments_delete" on public.shipments;
create policy "shipments_delete" on public.shipments for delete using (user_id = auth.uid());

-- ── pos_magic_links — passwordless staff login tokens ──
create table if not exists public.pos_magic_links (
  id uuid primary key default gen_random_uuid(),
  staff_id uuid not null,
  token text not null,
  email text not null,
  expires_at timestamptz not null,
  used boolean default false,
  used_at timestamptz,
  created_at timestamptz default now()
);
create index if not exists idx_pos_magic_links_expires on public.pos_magic_links(expires_at);
create index if not exists idx_pos_magic_links_staff_id on public.pos_magic_links(staff_id);
create index if not exists idx_pos_magic_links_token on public.pos_magic_links(token);
alter table public.pos_magic_links enable row level security;
drop policy if exists "Magic links insert open" on public.pos_magic_links;
create policy "Magic links insert open" on public.pos_magic_links for insert with check (true);
drop policy if exists "Magic links read by token" on public.pos_magic_links;
create policy "Magic links read by token" on public.pos_magic_links for select using (true);
drop policy if exists "Magic links update open" on public.pos_magic_links;
create policy "Magic links update open" on public.pos_magic_links for update using (true);

-- ── pos_truck_locations — logistics GPS breadcrumbs ──
create table if not exists public.pos_truck_locations (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null,
  truck_id uuid,
  driver_id uuid,
  lat double precision not null,
  lng double precision not null,
  recorded_at timestamptz not null default now()
);
create index if not exists idx_truck_locations_owner_recorded on public.pos_truck_locations(owner_id, recorded_at desc);
create index if not exists idx_truck_locations_owner_truck on public.pos_truck_locations(owner_id, truck_id, recorded_at desc);
alter table public.pos_truck_locations enable row level security;
drop policy if exists "Owner manages truck locations" on public.pos_truck_locations;
create policy "Owner manages truck locations" on public.pos_truck_locations using (owner_id = auth.uid());
