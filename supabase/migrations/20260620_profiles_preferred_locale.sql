-- Persist the user's chosen interface language so it follows them across devices.
-- The language switcher writes here (via /api/locale); the app reads it on boot
-- as part of the locale resolution chain (URL → cookie → profile → geo → default).
-- Nullable: when unset, resolution falls through to geo/browser/default.

alter table public.profiles
  add column if not exists preferred_locale text;
