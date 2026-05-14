-- ============================================================
-- AskBiz Migration 027 — POS tax automation & compliance
-- Adds global tax engine with jurisdiction support
-- ============================================================

-- Create pos_tax_rules table (jurisdiction-specific tax rates)
create table if not exists public.pos_tax_rules (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  jurisdiction_code text not null, -- 'UK', 'DE', 'US_CA', 'US_NY', etc.
  tax_type text not null, -- 'VAT', 'GST', 'Sales_Tax', 'Digital_Services_Tax'
  standard_rate numeric(5,2) not null, -- e.g., 20.00 for 20%
  reduced_rates jsonb, -- [ { rate: 5.00, applies_to: ['food', 'books', 'kids_items'] } ]
  effective_date timestamp default now(),
  rule_version text, -- 'Jan2025', 'Q1_2025'
  is_active boolean default true,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Create pos_item_tax_codes table (item category to tax mapping)
create table if not exists public.pos_item_tax_codes (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  code text not null, -- 'VAT-20-STANDARD', 'VAT-5-REDUCED', 'VAT-0-EXEMPT'
  jurisdiction text not null, -- 'UK', 'DE', 'US_CA'
  category text not null, -- 'general_merchandise', 'food', 'books', 'digital_services'
  rate numeric(5,2) not null,
  label text, -- 'Standard rate 20%'
  is_active boolean default true,
  created_at timestamp default now(),
  updated_at timestamp default now(),
  unique(owner_id, code, jurisdiction)
);

-- Create pos_tax_audit_log table (immutable record of every tax calculation)
create table if not exists public.pos_tax_audit_log (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  transaction_id uuid references public.pos_transactions(id) on delete cascade,
  items_json jsonb not null, -- [ { name, qty, unit_price, tax_code, tax_rate, tax_amount } ]
  subtotal numeric(12,2) not null,
  total_tax numeric(12,2) not null,
  total numeric(12,2) not null,
  jurisdiction text not null,
  tax_calculation_version text, -- version of tax engine used
  created_at timestamp default now()
);

-- Create pos_location_tax_settings table (per-location tax configuration)
create table if not exists public.pos_location_tax_settings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  location_id uuid references public.pos_locations(id) on delete cascade,
  jurisdiction_code text not null, -- 'UK', 'DE', 'US_NY'
  tax_id text, -- VAT number for EU, FEIN for US, etc.
  business_type text, -- 'retail', 'restaurant', 'service', 'digital'
  local_config_json jsonb, -- jurisdiction-specific config
  is_active boolean default true,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Extend pos_transactions table with tax fields
alter table public.pos_transactions
  add column if not exists tax_jurisdiction text,
  add column if not exists tax_country_code text,
  add column if not exists customer_vat_number text,
  add column if not exists tax_calculation_details_json jsonb,
  add column if not exists total_tax numeric(12,2),
  add column if not exists amount_tendered numeric(12,2),
  add column if not exists tax_calculation_version text;

-- Extend pos_items table with line-level tax
alter table public.pos_items
  add column if not exists tax_code text,
  add column if not exists tax_rate numeric(5,2),
  add column if not exists tax_amount numeric(12,2);

-- Create indices for quick lookups
create index if not exists idx_pos_tax_rules_jurisdiction
  on public.pos_tax_rules (owner_id, jurisdiction_code, is_active);

create index if not exists idx_pos_item_tax_codes_lookup
  on public.pos_item_tax_codes (owner_id, jurisdiction, category, is_active);

create index if not exists idx_pos_tax_audit_transaction
  on public.pos_tax_audit_log (transaction_id);

create index if not exists idx_pos_tax_audit_owner_date
  on public.pos_tax_audit_log (owner_id, created_at);

create index if not exists idx_pos_location_tax_settings_location
  on public.pos_location_tax_settings (owner_id, location_id);

-- Create default UK tax codes for quick setup
insert into public.pos_item_tax_codes (owner_id, code, jurisdiction, category, rate, label, is_active)
select
  id,
  'VAT-20-STANDARD',
  'UK',
  'general_merchandise',
  20.00,
  'Standard rate 20%',
  true
from public.profiles
where role = 'business'
on conflict (owner_id, code, jurisdiction) do nothing;

insert into public.pos_item_tax_codes (owner_id, code, jurisdiction, category, rate, label, is_active)
select
  id,
  'VAT-5-REDUCED',
  'UK',
  'food',
  5.00,
  'Reduced rate 5% (food)',
  true
from public.profiles
where role = 'business'
on conflict (owner_id, code, jurisdiction) do nothing;

insert into public.pos_item_tax_codes (owner_id, code, jurisdiction, category, rate, label, is_active)
select
  id,
  'VAT-0-EXEMPT',
  'UK',
  'books',
  0.00,
  'Zero rate 0% (books)',
  true
from public.profiles
where role = 'business'
on conflict (owner_id, code, jurisdiction) do nothing;
