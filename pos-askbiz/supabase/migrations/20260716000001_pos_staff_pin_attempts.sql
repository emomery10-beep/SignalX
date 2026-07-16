-- Staff PIN-switch login — tracks failed attempts per staff row so lockout
-- is real and durable (unlike the old in-memory Map in
-- app/api/pos/otp/route.ts, which reset on every serverless cold start and
-- didn't share state across instances). Mirrors phone_pin_attempts in the
-- root app (supabase/migrations/20260703000001_phone_pin_auth.sql). All
-- reads/writes go through /api/pos/otp using the service-role key, which
-- bypasses RLS by design — the "using (false)" policy below only blocks
-- direct anon/authenticated access.
create table if not exists pos_staff_pin_attempts (
  staff_id uuid primary key references pos_staff(id) on delete cascade,
  failed_count int not null default 0,
  locked_until timestamptz,
  updated_at timestamptz not null default now()
);

alter table pos_staff_pin_attempts enable row level security;

drop policy if exists "no direct client access" on pos_staff_pin_attempts;
create policy "no direct client access" on pos_staff_pin_attempts
  for all using (false);
