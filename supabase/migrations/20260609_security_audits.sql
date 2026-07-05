-- Security & GDPR audit reports table
-- Stores weekly automated audit results for compliance evidence
create table if not exists security_audits (
  id uuid primary key default gen_random_uuid(),
  run_id text unique not null,
  overall_status text not null check (overall_status in ('pass', 'warn', 'fail')),
  total_checks integer not null default 0,
  passed integer not null default 0,
  warnings integer not null default 0,
  failures integer not null default 0,
  duration_ms integer not null default 0,
  report jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_security_audits_created on security_audits (created_at desc);
create index if not exists idx_security_audits_status on security_audits (overall_status);

alter table security_audits enable row level security;

drop policy if exists "Service role only" on security_audits;
create policy "Service role only" on security_audits
  for all using (auth.role() = 'service_role');
