-- Generic AI daily cache. Replaces the in-process Map() caches in API routes.
-- In-process Maps are lost on every Vercel cold start, so any new function instance
-- re-calls the AI even if the same user already received a response today.
-- This table persists responses across all instances: one AI call per user per route per day.
--
-- Used by: /api/daily-actions, /api/cfo/ai-insight (and any future daily AI routes)

create table if not exists public.ai_daily_cache (
  user_id    uuid        not null references auth.users(id) on delete cascade,
  route      text        not null,
  cache_date date        not null default current_date,
  response   jsonb       not null,
  created_at timestamptz not null default now(),
  primary key (user_id, route, cache_date)
);

alter table public.ai_daily_cache enable row level security;

drop policy if exists "ai_daily_cache_own" on public.ai_daily_cache;
create policy "ai_daily_cache_own" on public.ai_daily_cache
  for all using (auth.uid() = user_id);
