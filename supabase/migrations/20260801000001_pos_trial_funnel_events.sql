-- ============================================================
-- Lightweight funnel instrumentation for the POS trial path:
-- onboarding "done" screen -> /pos/setup (catalogue build) ->
-- /pos/activate (trial or payment). No dashboard reads this
-- table via RLS — only the admin API (service role) does — so
-- there is no select policy for regular users, insert-only.
-- ============================================================

create table if not exists public.pos_trial_funnel_events (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  event         text not null,
  business_type text,
  metadata      jsonb default '{}',
  created_at    timestamptz not null default now()
);

create index if not exists pos_trial_funnel_events_event_idx
  on public.pos_trial_funnel_events (event, created_at desc);
create index if not exists pos_trial_funnel_events_user_idx
  on public.pos_trial_funnel_events (user_id, created_at desc);

alter table public.pos_trial_funnel_events enable row level security;

create policy "Users can log their own funnel events"
  on public.pos_trial_funnel_events for insert
  with check (auth.uid() = user_id);
