-- ============================================================
-- Migration: revoke anon/authenticated EXECUTE on
-- public.adjust_pos_daily_revenue()
--
-- Found during the repo-wide SECURITY DEFINER audit (see
-- 20260807000003/000004/000005). adjust_pos_daily_revenue(p_owner_id,
-- p_amount, p_date) has no internal ownership check and directly
-- upserts public.unified_data.gross_revenue for the given p_owner_id —
-- the table CFO reports, the Sources tab, and other BI surfaces read
-- from.
--
-- Live impact before this fix: `anon` (and `authenticated`) had EXECUTE
-- (same database-level ALTER DEFAULT PRIVILEGES auto-grant as
-- 20260807000003). With no ownership check and p_amount accepting any
-- numeric value including negative, anyone with just the public anon key
-- could set or corrupt ANY business's recorded daily revenue —
-- inflating, zeroing, or deflating the real financial figures an owner
-- sees in their own CFO/BI dashboards, with no auth required at all.
--
-- No ownership check is added — the only real callers are
-- app/api/pos/refund/route.ts and app/api/pos/amend/route.ts, both of
-- which resolve and authorize the caller themselves first (POS staff PIN
-- auth via resolvePosAuth() + hasPermission(), or an owner web session —
-- neither of which is a Supabase auth session with a stable auth.uid()
-- tied to p_owner_id, since POS till staff authenticate via PIN, not
-- Supabase auth) and only then call this via a SERVICE-ROLE client
-- (createServiceClient()). There is no legitimate direct client call —
-- this is a service-role-only internal helper. service_role already has
-- EXECUTE via the same default-privileges rule and needs no explicit
-- grant — this migration removes the anon/authenticated access nothing
-- legitimate ever used.
-- ============================================================

revoke all on function public.adjust_pos_daily_revenue(uuid, numeric, date) from public;
revoke execute on function public.adjust_pos_daily_revenue(uuid, numeric, date) from anon;
revoke execute on function public.adjust_pos_daily_revenue(uuid, numeric, date) from authenticated;

notify pgrst, 'reload schema';
