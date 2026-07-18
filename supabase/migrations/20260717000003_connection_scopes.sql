-- ============================================================
-- Scoped permissions for developer_connections (20260708000007). Today a
-- connection is a single binary "active" grant — the merchant approving one
-- has no idea what they're actually authorizing, and every connection-gated
-- endpoint implicitly gets full access to whatever it chooses to read. This
-- adds a real scope list, matching the ALLOWED_EVENTS pattern already used
-- for webhooks (app/api/v1/webhooks/route.ts) rather than a DB enum.
--
-- Only one scope exists today — read_inventory — because that's the only
-- thing any connection-gated endpoint (app/api/v1/scan) actually reads.
-- Don't invent scopes for endpoints that don't exist yet; add read_sales /
-- write_stock when an endpoint actually needs to check them.
-- ============================================================

alter table public.developer_connections add column if not exists scopes text[] not null default '{}';

-- Backfill: every connection created before this migration implicitly
-- granted read_inventory (that was the only thing scan/route.ts checked),
-- so an empty scopes array on an already-active row must not silently
-- revoke access it used to have.
update public.developer_connections
set scopes = array['read_inventory']
where status = 'active' and scopes = '{}';
