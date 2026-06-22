-- ============================================================
-- Public API v1 backing schema. The /api/v1 routes (ask, keys, usage) and the
-- settings UI (components/settings/ApiKeys.tsx) are fully implemented and the
-- paid plans advertise "API access", but the backing tables/columns were never
-- migrated, so every v1 route 400s. This creates them. Column shapes derived
-- directly from how the routes read/write them.
-- Idempotent (create/add ... if not exists, drop-then-create policies).
-- ============================================================

-- ── api_keys — developer API keys ──
create table if not exists public.api_keys (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid not null references auth.users(id) on delete cascade,
  key                  text not null unique,           -- abz_live_<hex> token
  name                 text not null default 'My API Key',
  mode                 text not null default 'generic',-- 'generic' | 'account'
  plan                 text not null default 'free',   -- free | starter | growth | enterprise
  is_active            boolean not null default true,
  requests_month       integer not null default 0,     -- rolling monthly counter
  request_limit_month  integer not null default 100,
  request_limit_minute integer not null default 5,
  last_used_at         timestamptz,
  created_at           timestamptz not null default now()
);
create index if not exists api_keys_user_id_idx on public.api_keys(user_id);
create index if not exists api_keys_key_idx on public.api_keys(key);

alter table public.api_keys enable row level security;
-- Logged-in users manage their own keys (keys/usage routes use the auth client).
-- The external ask route validates keys with the service client (bypasses RLS)
-- and scopes every query manually by the key's user_id.
drop policy if exists "api_keys_owner_all" on public.api_keys;
create policy "api_keys_owner_all" on public.api_keys for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ── api_usage — add the per-request v1 columns ──
-- api_usage already exists (internal token-cost logger: route/model/tokens/
-- cost_usd via lib/log-usage.ts — left untouched). The v1 ask route additionally
-- records key_id/endpoint/question/status/latency_ms, and the usage dashboard
-- reads them. Add idempotently; nullable so the internal logger's inserts are
-- unaffected.
alter table public.api_usage add column if not exists key_id uuid references public.api_keys(id) on delete set null;
alter table public.api_usage add column if not exists endpoint text;
alter table public.api_usage add column if not exists question text;
alter table public.api_usage add column if not exists status integer;
alter table public.api_usage add column if not exists latency_ms integer;
create index if not exists api_usage_key_id_idx on public.api_usage(key_id);
