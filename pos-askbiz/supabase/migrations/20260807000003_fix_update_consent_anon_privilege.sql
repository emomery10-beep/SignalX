-- ============================================================
-- Migration: explicitly revoke update_consent() EXECUTE from anon
--
-- Follow-up to 20260807000001_camera_logistics_consent.sql. After that
-- migration was applied, a live-DB check showed `anon` still had EXECUTE
-- on public.update_consent() despite that migration's own
-- `revoke all on function ... from public`.
--
-- Root cause, confirmed by querying pg_default_acl on this project: the
-- public schema has a database-level ALTER DEFAULT PRIVILEGES rule that
-- grants EXECUTE on every newly created function to anon/authenticated/
-- service_role automatically, independent of any per-migration
-- `revoke ... from public` (default privileges apply at object-creation
-- time; a later REVOKE targeting the PUBLIC pseudo-role does not remove
-- a privilege that was granted directly to a named role like anon). This
-- is a standing characteristic of this database, not a one-off mistake —
-- any future SECURITY DEFINER function in this project needs an
-- EXPLICIT `revoke execute on function ... from anon;`, not just
-- `from public`, if anon access is meant to be denied.
--
-- Not an active exploit: update_consent()'s `auth.uid() is distinct from
-- p_user_id` check (see 20260807000001) still blocks anon callers on its
-- own — auth.uid() is null with no JWT, which is distinct from any real
-- target UUID, so the exception fires regardless of raw EXECUTE access.
-- This migration is defense-in-depth, closing the gap between stated
-- intent and actual grant so a future edit to the function body isn't
-- the only thing standing between anon and this data.
-- ============================================================

revoke execute on function public.update_consent(uuid, boolean, boolean, boolean, boolean, boolean, boolean, text) from anon;

notify pgrst, 'reload schema';
