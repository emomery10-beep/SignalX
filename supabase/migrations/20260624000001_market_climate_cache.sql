-- ============================================================
-- Market Climate persistent cache. The /api/market-climate route fans out to
-- Tavily (live signals + freight) and Claude (signal selection + narrative) on
-- every cache miss — expensive, and the in-memory cache doesn't survive Vercel
-- cold starts, so it refetched far more than intended. This table persists the
-- computed result per business (keyed by what they trade + how they sell) so the
-- API work runs at most ~twice a day. Cheap derived fields (severity, exposure,
-- runway) are still recomputed per request from the cached signals.
-- Idempotent: create-table if not exists, drop-then-create policy.
-- ============================================================

create table if not exists public.market_climate_cache (
  user_id    uuid        not null references auth.users(id) on delete cascade,
  cache_key  text        not null,
  payload    jsonb       not null,
  fetched_at timestamptz not null default now(),
  primary key (user_id, cache_key)
);

alter table public.market_climate_cache enable row level security;

drop policy if exists "market_climate_cache_own" on public.market_climate_cache;
create policy "market_climate_cache_own" on public.market_climate_cache
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
