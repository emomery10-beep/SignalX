-- ============================================================
-- Migration — Free Trials (3-month, no card required)
-- Supports: PoS trial (up to 5 seats) and Growth plan trial
-- ============================================================

create table if not exists public.trials (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users on delete cascade,
  trial_type  text not null check (trial_type in ('pos', 'growth')),
  started_at  timestamptz not null default now(),
  ends_at     timestamptz not null default (now() + interval '90 days'),
  converted   boolean default false,
  created_at  timestamptz default now(),
  unique(user_id, trial_type)
);

alter table public.trials enable row level security;

create policy "Own trials" on public.trials
  for all using (auth.uid() = user_id);

create index if not exists idx_trials_user on public.trials(user_id);
create index if not exists idx_trials_active on public.trials(user_id, trial_type) where converted = false;
