-- ============================================================
-- Redirect URI domain-ownership verification for developer_apps.
--
-- redirect_uri has existed since 20260717000005_developer_apps.sql but is
-- confirmed (by direct code read) to be write-only today: collected with a
-- bare ^https:\/\// regex, stored, and never actually consumed anywhere —
-- app/connect/[token]/page.tsx doesn't even select it. That's inert, not a
-- live phishing vector, but wiring it into the real consent-flow redirect
-- (the whole point of collecting it) without ownership proof first would
-- create exactly that vector: anyone could register an app claiming any
-- redirect_uri and have merchants bounced there after "approving" access.
-- DNS TXT record proof, same idea as domain verification on every mature
-- platform (Google Search Console, SPF/DKIM, etc.) — no external provider
-- dependency, Node's own `dns` module is enough.
-- ============================================================

alter table public.developer_apps add column if not exists redirect_uri_verification_token text;
alter table public.developer_apps add column if not exists redirect_uri_verified_at timestamptz;
