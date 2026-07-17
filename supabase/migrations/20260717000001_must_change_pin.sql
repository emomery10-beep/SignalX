-- Admin-triggered PIN reset: when an admin resets a user's PIN to a
-- temporary value (app/api/admin/route.ts action=reset_pin), this flag
-- forces them to set a new one before using the app. Checked in
-- app/(app)/layout.tsx, cleared by app/api/auth/change-pin/route.ts once
-- the user picks a real replacement.
alter table profiles add column if not exists must_change_pin boolean not null default false;
