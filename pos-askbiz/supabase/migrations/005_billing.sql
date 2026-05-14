-- ============================================================
-- SignalX Migration 005 — Revised Billing & Soft Controls
-- Free / Growth / Business (early adoption) / Enterprise
-- ============================================================

-- ── PLANS ────────────────────────────────────────────────────
create table if not exists public.plans (
  id                    text primary key,
  name                  text not null,
  tagline               text,
  price_monthly         numeric not null,
  currency              text default 'gbp',
  stripe_price_id       text,
  -- Soft limits (not hard walls)
  question_limit        int default 10,      -- -1 = no limit enforced
  upload_limit          int default 1,
  team_member_limit     int default 1,
  forecast_limit        int default 0,       -- 0 = feature locked
  alert_limit           int default 0,
  source_limit          int default 0,       -- connected sources
  -- Feature flags
  expansion_intel       boolean default false,
  live_sync             boolean default false,
  api_access            boolean default false,
  priority_support      boolean default false,
  early_adoption        boolean default false,
  features              text[] default '{}',
  sort_order            int default 0,
  is_active             boolean default true
);

insert into public.plans (
  id, name, tagline, price_monthly,
  question_limit, upload_limit, team_member_limit,
  forecast_limit, alert_limit, source_limit,
  expansion_intel, live_sync, api_access, priority_support,
  early_adoption, features, sort_order
) values
(
  'free', 'Free', 'See what SignalX can do', 0,
  10, 1, 1, 0, 0, 0,
  false, false, false, false, false,
  array[
    '10 AI questions per month',
    '1 file upload',
    'Basic business Q&A',
    'Dashboard overview',
    'Email support'
  ], 1
),
(
  'growth', 'Growth', 'Everything you need to run smarter', 19,
  500, 10, 1, 10, 10, 3,
  true, true, false, false, false,
  array[
    '500 AI questions per month',
    '10 file uploads',
    'Expansion intelligence',
    'Alerts & forecasts',
    'Live data sync (Shopify, Stripe, Sheets)',
    'Industry templates',
    'Priority email support'
  ], 2
),
(
  'business', 'Business', 'Early adoption — lock in this price forever', 49,
  2000, -1, 5, -1, -1, 10,
  true, true, true, true, true,
  array[
    '2,000 AI questions per month',
    'Unlimited file uploads',
    '5 team members',
    'API access',
    'All Growth features',
    'Dedicated support',
    'Early adopter pricing — guaranteed forever'
  ], 3
),
(
  'enterprise', 'Enterprise', 'For chains, franchises and large distributors', -1,
  -1, -1, -1, -1, -1, -1,
  true, true, true, true, false,
  array[
    'Unlimited everything',
    'Unlimited team members',
    'Custom integrations',
    'SSO & advanced security',
    'SLA guarantee',
    'Dedicated account manager',
    'Custom onboarding',
    'White-label option'
  ], 4
)
on conflict (id) do update set
  name = excluded.name,
  tagline = excluded.tagline,
  question_limit = excluded.question_limit,
  upload_limit = excluded.upload_limit,
  team_member_limit = excluded.team_member_limit,
  features = excluded.features;

-- ── SUBSCRIPTIONS ────────────────────────────────────────────
create table if not exists public.subscriptions (
  id                     uuid primary key default gen_random_uuid(),
  user_id                uuid not null references auth.users on delete cascade,
  plan_id                text not null references public.plans(id) default 'free',
  status                 text default 'active' check (status in ('active','cancelled','past_due','trialing','incomplete')),
  stripe_customer_id     text unique,
  stripe_subscription_id text unique,
  stripe_price_id        text,
  current_period_start   timestamptz,
  current_period_end     timestamptz,
  cancel_at_period_end   boolean default false,
  trial_ends_at          timestamptz,
  -- Soft control state
  soft_warning_sent      boolean default false,  -- sent 80% warning
  grace_questions        int default 0,          -- bonus questions granted
  created_at             timestamptz default now(),
  updated_at             timestamptz default now()
);

-- ── USAGE TRACKING ───────────────────────────────────────────
create table if not exists public.usage (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users on delete cascade,
  period      text not null,   -- YYYY-MM
  questions   int default 0,
  uploads     int default 0,
  exports     int default 0,
  forecasts   int default 0,
  alerts_run  int default 0,
  syncs_run   int default 0,
  updated_at  timestamptz default now(),
  unique(user_id, period)
);

-- ── UPGRADE TRIGGERS (feature-based, not limit-based) ────────
create table if not exists public.upgrade_triggers (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users on delete cascade,
  trigger     text not null,   -- 'expansion_question', 'forecast_attempt', 'sync_attempt', etc.
  feature     text not null,   -- what they tried to use
  plan_needed text not null,   -- 'growth' or 'business'
  converted   boolean default false,
  triggered_at timestamptz default now()
);

-- ── BILLING EVENTS ───────────────────────────────────────────
create table if not exists public.billing_events (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references auth.users on delete set null,
  event_type      text not null,
  plan_id         text,
  amount          numeric,
  currency        text,
  stripe_event_id text unique,
  metadata        jsonb default '{}',
  created_at      timestamptz default now()
);

-- ── AUTO-CREATE FREE SUBSCRIPTION ON SIGNUP ──────────────────
create or replace function public.create_free_subscription()
returns trigger language plpgsql security definer as $$
begin
  insert into public.subscriptions (user_id, plan_id, status)
  values (new.id, 'free', 'active')
  on conflict do nothing;
  return new;
end;
$$;

drop trigger if exists on_user_created_subscription on public.profiles;
create trigger on_user_created_subscription
  after insert on public.profiles
  for each row execute procedure public.create_free_subscription();

-- ── USAGE INCREMENT ──────────────────────────────────────────
create or replace function public.increment_usage(p_user_id uuid, p_field text)
returns void language plpgsql security definer as $$
declare p_period text := to_char(now(), 'YYYY-MM');
begin
  insert into public.usage (user_id, period) values (p_user_id, p_period)
  on conflict (user_id, period) do nothing;
  execute format('update public.usage set %I = %I + 1, updated_at = now() where user_id = $1 and period = $2', p_field, p_field)
  using p_user_id, p_period;
end;
$$;

-- ── RLS ──────────────────────────────────────────────────────
alter table public.plans             enable row level security;
alter table public.subscriptions     enable row level security;
alter table public.usage             enable row level security;
alter table public.billing_events    enable row level security;
alter table public.upgrade_triggers  enable row level security;

create policy "Plans public"          on public.plans            for select using (true);
create policy "Own subscription"      on public.subscriptions    for all    using (auth.uid() = user_id);
create policy "Own usage"             on public.usage            for all    using (auth.uid() = user_id);
create policy "Own billing events"    on public.billing_events   for select using (auth.uid() = user_id);
create policy "Own upgrade triggers"  on public.upgrade_triggers for all    using (auth.uid() = user_id);

-- ── INDEXES ──────────────────────────────────────────────────
create index if not exists idx_subscriptions_user   on public.subscriptions(user_id);
create index if not exists idx_subscriptions_stripe on public.subscriptions(stripe_customer_id);
create index if not exists idx_usage_user_period    on public.usage(user_id, period);
create index if not exists idx_triggers_user        on public.upgrade_triggers(user_id);

-- Add plan column to profiles for quick access
alter table public.profiles add column if not exists plan_id text default 'free' references public.plans(id);
