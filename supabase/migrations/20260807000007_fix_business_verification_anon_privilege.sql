-- ============================================================
-- Migration: explicitly revoke anon EXECUTE on public.is_user_verified()
-- and public.is_key_owner_verified()
--
-- Found during the repo-wide SECURITY DEFINER audit (see
-- 20260807000003/000004/000005/000006). 20260721000001_business_verification.sql
-- already tried to lock both functions to authenticated-only:
--   revoke execute on function public.is_user_verified(uuid) from public;
--   grant execute on function public.is_user_verified(uuid) to authenticated;
-- (same for is_key_owner_verified) — but per 20260807000003, `revoke ...
-- from public` does not remove `anon`'s own direct grant on this
-- project's database (ALTER DEFAULT PRIVILEGES auto-grants EXECUTE to
-- anon/authenticated/service_role at function-creation time,
-- independent of the PUBLIC pseudo-role). So `anon` silently kept
-- EXECUTE on both functions the whole time, contrary to that migration's
-- own stated intent.
--
-- Severity: low. Both functions only ever return a boolean ("is this
-- user/api-key's owner an approved verified business") with no other
-- data exposed, and the only real caller
-- (developer-askbiz/app/connect/[token]/page.tsx) already requires an
-- authenticated session before calling — confirmed no legitimate
-- anonymous caller exists. This closes a confidentiality gap (anon could
-- probe verification status for an arbitrary user/key id) that was
-- always meant to be closed, not a functional change.
-- ============================================================

revoke execute on function public.is_user_verified(uuid) from anon;
revoke execute on function public.is_key_owner_verified(uuid) from anon;

notify pgrst, 'reload schema';
