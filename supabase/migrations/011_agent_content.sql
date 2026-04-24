-- Migration 011: AskBiz Autonomous Growth Agent
-- Stores agent-generated content pending review

create table if not exists public.agent_content (
  id            uuid primary key default gen_random_uuid(),
  run_id        text not null,                    -- groups blog+thread+replies from one run
  type          text not null check (type in ('blog','thread','smart_reply')),
  status        text not null default 'pending'
                  check (status in ('pending','published','rejected')),
  content       jsonb not null,
  source_url    text,
  source_title  text,
  source_query  text,
  verdict       text,
  verdict_sentence text,
  scenario      text,
  pulse_signal  text,
  key_insight   text,
  created_at    timestamptz default now(),
  reviewed_at   timestamptz,
  reviewed_by   text
);

-- Only service role can insert (agent uses service key)
alter table public.agent_content enable row level security;

create policy "Service role full access"
  on public.agent_content
  using (true)
  with check (true);

create policy "Authenticated users can read"
  on public.agent_content for select
  to authenticated
  using (true);

-- Index for admin panel queries
create index if not exists agent_content_status_idx on public.agent_content(status, created_at desc);
create index if not exists agent_content_run_id_idx on public.agent_content(run_id);
