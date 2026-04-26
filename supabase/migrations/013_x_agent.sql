-- ============================================================
-- Migration 013 — X (Twitter) Agent Activity Table
-- ============================================================

create table if not exists public.x_agent_activity (
  id               uuid primary key default gen_random_uuid(),
  tweet_id         text not null,
  tweet_text       text not null,
  tweet_author     text,
  tweet_author_id  text,
  tweet_likes      integer default 0,
  tweet_replies    integer default 0,
  generated_reply  text not null,
  edited_reply     text,
  keyword_query    text,
  status           text not null default 'pending' check (status in ('pending','posted','rejected','skipped')),
  posted_reply_id  text,
  posted_at        timestamptz,
  created_at       timestamptz default now()
);

create index if not exists x_agent_activity_status on public.x_agent_activity(status, created_at desc);
create index if not exists x_agent_activity_tweet_id on public.x_agent_activity(tweet_id);

-- Prevent duplicate replies to the same tweet
create unique index if not exists x_agent_activity_tweet_unique
  on public.x_agent_activity(tweet_id)
  where status = 'posted';

alter table public.x_agent_activity enable row level security;

-- Only service role can access (admin only via API)
create policy "Service role only"
  on public.x_agent_activity
  for all
  using (false);

-- Add metadata column to agent_content if not exists
alter table public.agent_content
  add column if not exists published_at timestamptz,
  add column if not exists metadata jsonb;
