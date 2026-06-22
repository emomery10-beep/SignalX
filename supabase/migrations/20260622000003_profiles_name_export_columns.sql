-- ============================================================
-- profiles: add columns the app references but that exist in neither
-- production nor the migration history (a migration was never written).
-- Affected features that were silently broken:
--   • Settings name editing — app/api/profile/route.ts whitelists
--     first_name/last_name; settings/page.tsx reads & PATCHes them.
--   • Intelligence greeting — reads profiles.first_name.
--   • Onboarding finish() — writes first_name/export_markets/wants_export
--     (the whole UPDATE 400'd on these unknown columns, so onboarding
--      data was never saved).
-- All idempotent (add column if not exists). full_name and onboarded
-- already exist and are left as-is.
-- ============================================================

alter table public.profiles add column if not exists first_name text;
alter table public.profiles add column if not exists last_name text;
alter table public.profiles add column if not exists export_markets text;
alter table public.profiles add column if not exists wants_export boolean default false;
