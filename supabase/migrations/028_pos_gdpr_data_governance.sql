-- ============================================================
-- AskBiz Migration 028 — POS GDPR & Data Governance
-- Implements customer data export, deletion, consent logging
-- Immutable audit trail with SHA-256 hashing
-- ============================================================

-- Create pos_consent_log table (tracks marketing/email/SMS/WhatsApp consent)
create table if not exists public.pos_consent_log (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  customer_id uuid references public.pos_customers(id) on delete cascade,
  consent_type text not null, -- 'marketing_email', 'sms', 'whatsapp', 'loyalty', 'analytics'
  status text not null, -- 'granted', 'withdrawn', 'refused'
  timestamp timestamp default now(),
  ip_address text, -- For audit trail
  user_agent text, -- For audit trail
  request_source text, -- 'web', 'api', 'pos_terminal', 'import'
  notes text
);

-- Create pos_data_requests table (customer access/delete/rectify requests)
create table if not exists public.pos_data_requests (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  customer_id uuid not null references public.pos_customers(id) on delete cascade,
  request_type text not null, -- 'access', 'delete', 'rectify', 'export', 'portability'
  status text not null default 'pending', -- 'pending', 'approved', 'completed', 'rejected'
  requested_at timestamp default now(),
  completed_at timestamp,
  exported_to text, -- File path or S3 URL where data was exported
  processed_by uuid references public.profiles(id), -- Staff member who processed it
  completion_notes text,
  data_format text -- 'json', 'csv', 'xml'
);

-- Create pos_gdpr_deletion_log table (immutable record of deletions)
create table if not exists public.pos_gdpr_deletion_log (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  customer_id uuid not null,
  customer_phone text,
  deletion_type text, -- 'full_deletion', 'anonymization', 'right_to_be_forgotten'
  deletion_timestamp timestamp default now(),
  reason text,
  processed_by uuid references public.profiles(id),
  anonymous_transactions_kept_count integer, -- Transactions kept (anonymized) for tax compliance
  retention_period_years integer default 7, -- Tax retention requirement
  hash text -- SHA-256 hash for integrity verification
);

-- Create pos_transaction_history table (immutable version history with hashing)
create table if not exists public.pos_transaction_history (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  transaction_id uuid not null references public.pos_transactions(id) on delete cascade,
  version integer not null, -- 1 = original, 2+ = amendments/refunds
  state_json jsonb not null, -- Complete transaction state at this version
  hash text not null, -- SHA-256(previous_hash + current_state)
  previous_hash text, -- Hash of version-1 (for chain verification)
  changed_at timestamp default now(),
  changed_by uuid references public.pos_staff(id),
  change_reason text, -- 'created', 'refund', 'amendment', 'tax_rate_update', 'correction'
  change_details_json jsonb -- Details of what changed
);

-- Create pos_customer_preferences table
create table if not exists public.pos_customer_preferences (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  customer_id uuid not null references public.pos_customers(id) on delete cascade,
  data_retention_days integer default 2555, -- Default 7 years for tax
  allow_email_marketing boolean default false,
  allow_sms_marketing boolean default false,
  allow_whatsapp_marketing boolean default false,
  allow_analytics boolean default true,
  allow_profiling boolean default false,
  preferred_contact_method text, -- 'email', 'sms', 'whatsapp'
  updated_at timestamp default now(),
  unique(owner_id, customer_id)
);

-- Extend pos_customers with GDPR fields
alter table public.pos_customers
  add column if not exists data_export_requested_at timestamp,
  add column if not exists deletion_requested_at timestamp,
  add column if not exists is_anonymized boolean default false,
  add column if not exists anonymized_at timestamp,
  add column if not exists consent_granted_at timestamp,
  add column if not exists last_gdpr_request_at timestamp;

-- Create indices for quick lookups
create index if not exists idx_pos_consent_log_customer
  on public.pos_consent_log (owner_id, customer_id);

create index if not exists idx_pos_consent_log_type_status
  on public.pos_consent_log (consent_type, status);

create index if not exists idx_pos_consent_log_timestamp
  on public.pos_consent_log (owner_id, timestamp desc);

create index if not exists idx_pos_data_requests_customer
  on public.pos_data_requests (owner_id, customer_id, status);

create index if not exists idx_pos_data_requests_timestamp
  on public.pos_data_requests (owner_id, requested_at desc);

create index if not exists idx_pos_gdpr_deletion_timestamp
  on public.pos_gdpr_deletion_log (owner_id, deletion_timestamp desc);

create index if not exists idx_pos_transaction_history_transaction
  on public.pos_transaction_history (transaction_id, version);

create index if not exists idx_pos_transaction_history_chain
  on public.pos_transaction_history (owner_id, changed_at desc);

create index if not exists idx_pos_customer_prefs_lookup
  on public.pos_customer_preferences (owner_id, customer_id);
