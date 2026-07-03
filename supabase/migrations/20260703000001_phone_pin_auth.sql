-- Phone + PIN login — tracks failed attempts per phone number so lockout
-- is real and durable (unlike pos_staff's in-memory rate limiter, which
-- resets on every serverless cold start and doesn't share state across
-- instances). All reads/writes go through the /api/auth/phone-pin route
-- using the service-role key, which bypasses RLS by design — the "using
-- (false)" policy below only blocks direct anon/authenticated access.
create table if not exists phone_pin_attempts (
  phone text primary key,
  failed_count int not null default 0,
  locked_until timestamptz,
  updated_at timestamptz not null default now()
);

alter table phone_pin_attempts enable row level security;

create policy "no direct client access" on phone_pin_attempts
  for all using (false);
