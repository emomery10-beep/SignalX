-- ============================================================
-- SignalX Migration 004 — Expansion Intelligence Tables
-- ============================================================

-- ── EXPANSION CANDIDATES ─────────────────────────────────────
create table if not exists public.expansion_candidates (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references auth.users on delete cascade,
  candidate_name      text not null,
  candidate_type      text check (candidate_type in ('variant_extension','adjacent_category','bundle','geographic','trend_led')),
  opportunity_score   numeric,
  why_it_fits         text,
  estimated_margin    numeric,
  cannibalization_risk text check (cannibalization_risk in ('low','medium','high')),
  recommended_launch  text,
  confidence          text check (confidence in ('low','medium','high')),
  status              text default 'candidate' check (status in ('candidate','shortlist','testing','launched','rejected')),
  raw_data            jsonb default '{}',
  created_at          timestamptz default now()
);

-- ── SIMULATION RUNS ──────────────────────────────────────────
create table if not exists public.simulation_runs (
  id                        uuid primary key default gen_random_uuid(),
  user_id                   uuid not null references auth.users on delete cascade,
  candidate_id              uuid references public.expansion_candidates on delete set null,
  sell_price                numeric,
  landed_cost               numeric,
  packaging_cost            numeric,
  shipping_cost             numeric,
  platform_fee_pct          numeric,
  expected_monthly_units    numeric,
  moq                       numeric,
  lead_time_days            int,
  gross_margin_pct          numeric,
  contribution_margin_pct   numeric,
  break_even_units          numeric,
  projected_monthly_profit  numeric,
  months_to_recover         numeric,
  stockout_risk             text,
  dead_stock_risk           text,
  verdict                   text,
  created_at                timestamptz default now()
);

-- ── RLS ──────────────────────────────────────────────────────
alter table public.expansion_candidates enable row level security;
alter table public.simulation_runs       enable row level security;

create policy "Own expansion candidates" on public.expansion_candidates for all using (auth.uid() = user_id);
create policy "Own simulation runs"      on public.simulation_runs       for all using (auth.uid() = user_id);

-- ── INDEXES ──────────────────────────────────────────────────
create index if not exists idx_expansion_user   on public.expansion_candidates(user_id);
create index if not exists idx_simulation_user  on public.simulation_runs(user_id);
