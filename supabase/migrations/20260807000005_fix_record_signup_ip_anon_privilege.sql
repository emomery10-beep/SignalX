-- ============================================================
-- Migration: revoke anon/authenticated EXECUTE on public.record_signup_ip()
--
-- Found during the repo-wide SECURITY DEFINER audit (see
-- 20260807000003/000004). record_signup_ip(p_user_id, p_ip_hash,
-- p_country) has no internal ownership check, and writes directly to
-- public.ip_registry (fraud/abuse signal registry) and
-- public.profiles.is_suspicious / registration_ip_hash /
-- registration_country for the given p_user_id.
--
-- Live impact before this fix: `anon` had EXECUTE (same database-level
-- ALTER DEFAULT PRIVILEGES auto-grant as 20260807000003). With no
-- ownership check, anyone with just the public anon key could call this
-- for an arbitrary p_user_id and: (a) forge registration_ip_hash /
-- registration_country / is_suspicious on any profile, or (b) flip an
-- arbitrary victim's is_suspicious flag by replaying the same
-- attacker-chosen ip_hash across >3 calls, since v_is_suspicious is
-- derived from ip_registry.signup_count. This directly undermines the
-- anti-abuse system it exists to power.
--
-- No ownership check is added here (unlike request_account_deletion) —
-- the only real caller is app/auth/callback/route.ts, which calls this
-- via a SERVICE-ROLE client (createServiceClient()) immediately after
-- Supabase's own exchangeCodeForSession()/verifyOtp() resolves the new
-- user, never from a user-session client. auth.uid() is not meaningfully
-- set in that context, and this data (fraud signals derived from the
-- request's own IP) is exactly the kind of thing the user themselves
-- should never be able to self-report, so "authenticated + auth.uid()
-- check" is the wrong model here. service_role already has EXECUTE via
-- the same default-privileges rule and needs no explicit grant — this
-- migration simply removes the anon/authenticated access nothing
-- legitimate ever used.
-- ============================================================

revoke all on function public.record_signup_ip(uuid, text, text) from public;
revoke execute on function public.record_signup_ip(uuid, text, text) from anon;
revoke execute on function public.record_signup_ip(uuid, text, text) from authenticated;

notify pgrst, 'reload schema';
