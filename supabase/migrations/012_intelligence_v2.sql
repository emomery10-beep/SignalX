-- Migration 012: Next-Level Intelligence Features
-- Health Score, Decision Memory, Anomaly Log, Daily Brief, Team Members

-- ── Business Health Score history ────────────────────────────────────────────
create table if not exists public.health_scores (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references auth.users(id) on delete cascade not null,
  score        integer not null check (score between 0 and 100),
  label        text not null,   -- 'Healthy' | 'At Risk' | 'Critical'
  color        text not null,   -- 'green' | 'amber' | 'red'
  components   jsonb not null,  -- {margin, cashflow, stock, revenue, market}
  summary      text,            -- plain English one-liner
  created_at   timestamptz default now()
);
create index if not exists health_scores_user_date on public.health_scores(user_id, created_at desc);

-- ── Anomaly log ───────────────────────────────────────────────────────────────
create table if not exists public.anomalies (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid references auth.users(id) on delete cascade not null,
  type           text not null,  -- 'margin_drop' | 'velocity_spike' | 'stockout_risk' | 'cost_increase' | 'revenue_anomaly'
  severity       text not null,  -- 'critical' | 'warning' | 'info'
  title          text not null,
  body           text not null,
  product        text,
  metric         text,
  value          numeric,
  threshold      numeric,
  prompt         text,           -- auto-fires into chat when clicked
  seen           boolean default false,
  created_at     timestamptz default now()
);
create index if not exists anomalies_user_unseen on public.anomalies(user_id, seen, created_at desc);

-- ── Decision memory ───────────────────────────────────────────────────────────
create table if not exists public.decisions (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid references auth.users(id) on delete cascade not null,
  title          text not null,           -- "Raised price on Wireless Earbuds by £1.50"
  description    text,                    -- context at decision time
  decision_type  text not null,           -- 'pricing' | 'stock' | 'supplier' | 'product' | 'strategy'
  product        text,
  before_value   text,                    -- e.g. "£12.99"
  after_value    text,                    -- e.g. "£14.49"
  context_snapshot jsonb,                 -- AI result that led to decision
  review_at      timestamptz,             -- when to check results (default +42 days)
  reviewed       boolean default false,
  review_result  text,                    -- AI-generated outcome summary
  review_verdict text,                    -- 'good_call' | 'bad_call' | 'neutral'
  created_at     timestamptz default now()
);
create index if not exists decisions_user_review on public.decisions(user_id, review_at, reviewed);

-- ── Team members ──────────────────────────────────────────────────────────────
create table if not exists public.team_members (
  id          uuid primary key default gen_random_uuid(),
  org_id      uuid not null,             -- owner's user_id acts as org
  user_id     uuid references auth.users(id) on delete cascade,
  email       text not null,
  role        text not null default 'viewer',  -- 'owner' | 'admin' | 'analyst' | 'viewer' | 'accountant' | 'buyer'
  name        text,
  invited_at  timestamptz default now(),
  accepted_at timestamptz,
  status      text default 'pending'     -- 'pending' | 'active' | 'removed'
);
create index if not exists team_members_org on public.team_members(org_id, status);
create index if not exists team_members_user on public.team_members(user_id);

-- ── Daily brief log ───────────────────────────────────────────────────────────
create table if not exists public.daily_briefs (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  date        date not null,
  improved    text,       -- one thing that improved
  worsened    text,       -- one thing that got worse
  action      text,       -- single most important action today
  health_score integer,
  sent_at     timestamptz,
  opened_at   timestamptz,
  created_at  timestamptz default now(),
  unique(user_id, date)
);

-- RLS
alter table public.health_scores  enable row level security;
alter table public.anomalies       enable row level security;
alter table public.decisions       enable row level security;
alter table public.team_members    enable row level security;
alter table public.daily_briefs    enable row level security;

create policy "Users own health scores"  on public.health_scores  for all using (auth.uid() = user_id);
create policy "Users own anomalies"      on public.anomalies       for all using (auth.uid() = user_id);
create policy "Users own decisions"      on public.decisions       for all using (auth.uid() = user_id);
create policy "Users see their team"     on public.team_members    for all using (auth.uid() = org_id or auth.uid() = user_id);
create policy "Users own daily briefs"   on public.daily_briefs    for all using (auth.uid() = user_id);

-- Add invite token to team_members
alter table public.team_members
  add column if not exists invite_token text unique,
  add column if not exists invite_expires_at timestamptz;

create index if not exists team_members_token on public.team_members(invite_token);
