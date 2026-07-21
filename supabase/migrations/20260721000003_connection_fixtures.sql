-- ============================================================
-- Sandbox fixture connections. POST /api/v1/connections has hard-blocked
-- every test key with a 403 since sandbox mode shipped — the code's own
-- comment calls this out as a tracked fast-follow: "no safe way to
-- simulate [a real merchant consent] without a fixture merchant account,
-- which doesn't exist yet." This column lets a test-key POST create an
-- instant, fake, already-active connection instead of failing outright —
-- no real merchant email, no real consent screen, nothing DB-adjacent to
-- a real business. is_fixture is denormalized onto the connection row
-- itself (rather than inferred from key_env via a join) so the
-- developer's own Connections dashboard and the admin panel can flag it
-- at a glance.
-- ============================================================

alter table public.developer_connections add column if not exists is_fixture boolean not null default false;
