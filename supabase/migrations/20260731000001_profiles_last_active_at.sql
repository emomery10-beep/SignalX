-- Tracks when a business-owner account was last seen active in the app, so the
-- admin Users tab can show a real "online now" indicator instead of just "Joined".
-- Updated by a lightweight client heartbeat (POST /api/heartbeat), not on every request.
alter table profiles add column if not exists last_active_at timestamptz;

create index if not exists idx_profiles_last_active_at on profiles(last_active_at);
