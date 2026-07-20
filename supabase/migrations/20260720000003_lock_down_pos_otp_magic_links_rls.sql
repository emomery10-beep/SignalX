-- SECURITY FIX: pos_otp and pos_magic_links had RLS policies open to the
-- `public` role (anon + authenticated) for SELECT/INSERT/UPDATE with no real
-- filter (USING/WITH CHECK = true). Any unauthenticated client could read
-- every row via the REST API:
--   pos_otp:         phone, code, expires_at, used  — live OTP codes readable by anyone
--   pos_magic_links: staff_id, token, email, used    — live login tokens readable by anyone
--
-- Verified before removing: every legitimate read/write in the app goes through
-- createServiceClient() (service_role, which bypasses RLS entirely regardless of
-- policy) — app/api/pos/callback/route.ts (both apps) inserts pos_magic_links via
-- service role; the only pos_otp reference left is a service-role connectivity
-- check in app/api/pos/audit/route.ts. No client-side/anon code path reads either
-- table, so removing the public policies has no functional impact.
drop policy if exists "OTP insert open" on public.pos_otp;
drop policy if exists "OTP read own" on public.pos_otp;
drop policy if exists "OTP update open" on public.pos_otp;

drop policy if exists "Magic links insert open" on public.pos_magic_links;
drop policy if exists "Magic links read by token" on public.pos_magic_links;
drop policy if exists "Magic links update open" on public.pos_magic_links;

-- RLS stays enabled on both tables (already was) with zero permissive policies
-- left for anon/authenticated — default-deny. service_role is unaffected since
-- it bypasses RLS at the role level.
