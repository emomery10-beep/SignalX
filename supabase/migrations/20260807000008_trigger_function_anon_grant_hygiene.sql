-- ============================================================
-- Migration: revoke anon/public EXECUTE on trigger functions that had it
-- as a leftover of the ALTER DEFAULT PRIVILEGES auto-grant
--
-- Found during the repo-wide SECURITY DEFINER audit (see
-- 20260807000003 through 000007). Three RETURNS TRIGGER functions —
-- deduct_inventory_on_sale(), restore_inventory_on_refund(), and
-- sync_pos_to_unified_data() — had `anon` (and PUBLIC) EXECUTE, same
-- root cause as every other fix in this series.
--
-- NOT exploitable, confirmed empirically: Postgres refuses to invoke a
-- function whose return type is the `trigger` pseudo-type outside of an
-- actual trigger firing —
--   select deduct_inventory_on_sale();
--   ERROR: 0A000: trigger functions can only be called as triggers
-- — regardless of the caller's EXECUTE grant. This is a language/executor
-- level restriction, not a privilege check, so the grant was always
-- inert for direct RPC access. Trigger firing itself is unaffected by
-- this revoke — it runs via the trigger manager under the function's own
-- SECURITY DEFINER context, never through the routine_privileges ACL.
--
-- This is pure hygiene: the grant didn't match anyone's intent (nothing
-- calls these directly) and its presence was confusing to audit, not a
-- live vulnerability. Included for completeness so every SECURITY
-- DEFINER function's grants now match actual intended access.
-- ============================================================

revoke all on function public.deduct_inventory_on_sale() from public;
revoke execute on function public.deduct_inventory_on_sale() from anon;

revoke all on function public.restore_inventory_on_refund() from public;
revoke execute on function public.restore_inventory_on_refund() from anon;

revoke all on function public.sync_pos_to_unified_data() from public;
revoke execute on function public.sync_pos_to_unified_data() from anon;

notify pgrst, 'reload schema';
