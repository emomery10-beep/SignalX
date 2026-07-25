-- ============================================================
-- Google Analytics session/conversion data — doesn't fit unified_data
-- (order-shaped) or social_signals (content/ad-metric-shaped), so it gets
-- its own table. Written by lib/sync/engine.ts's syncGoogleAnalytics().
-- ============================================================

create table if not exists public.ga_sessions (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references auth.users on delete cascade,
  source_id         uuid references public.connected_sources on delete cascade,
  record_date       date not null,
  channel           text not null default '',
  sessions          integer default 0,
  users             integer default 0,
  conversions       integer default 0,
  conversion_rate   numeric default 0,
  bounce_rate       numeric default 0,
  avg_session_secs  numeric default 0,
  revenue           numeric default 0,
  currency          text default 'GBP',
  raw_data          jsonb,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now(),

  unique(user_id, source_id, record_date, channel)
);

create index if not exists ga_sessions_user_date_idx
  on public.ga_sessions(user_id, record_date desc);

alter table public.ga_sessions enable row level security;

create policy "Users can view their own GA sessions"
  on public.ga_sessions for select
  using (auth.uid() = user_id);
