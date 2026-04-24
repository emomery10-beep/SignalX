-- ============================================================
-- SignalX Migration 002 — Month 3 + 4 features
-- Alerts, forecasts, templates, projects, team collaboration
-- ============================================================

-- ── PROJECTS (saved workspaces with multiple datasets) ───────
create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users on delete cascade,
  name        text not null,
  description text,
  color       text default '#1ed4ca',
  is_default  boolean default false,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Link uploads to projects
alter table public.uploads add column if not exists project_id uuid references public.projects on delete set null;

-- Link conversations to projects
alter table public.conversations add column if not exists project_id uuid references public.projects on delete set null;

-- ── ALERTS ───────────────────────────────────────────────────
create table if not exists public.alerts (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users on delete cascade,
  upload_id     uuid references public.uploads on delete cascade,
  name          text not null,
  alert_type    text not null check (alert_type in ('stock_low','margin_drop','revenue_spike','price_change','custom')),
  condition     text not null,   -- e.g. "stock < 10"
  threshold     numeric,
  column_name   text,
  is_active     boolean default true,
  last_fired_at timestamptz,
  fire_count    int default 0,
  notify_email  boolean default true,
  created_at    timestamptz default now()
);

-- ── ALERT EVENTS (history of fired alerts) ───────────────────
create table if not exists public.alert_events (
  id         uuid primary key default gen_random_uuid(),
  alert_id   uuid not null references public.alerts on delete cascade,
  message    text not null,
  data       jsonb default '{}',
  fired_at   timestamptz default now()
);

-- ── FORECASTS ────────────────────────────────────────────────
create table if not exists public.forecasts (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users on delete cascade,
  upload_id       uuid references public.uploads on delete cascade,
  name            text not null,
  target_column   text not null,
  date_column     text,
  method          text default 'linear' check (method in ('linear','moving_avg','seasonal')),
  horizon_days    int default 30,
  result          jsonb,          -- { labels[], actual[], predicted[], confidence[] }
  accuracy        numeric,        -- MAE or MAPE
  created_at      timestamptz default now()
);

-- ── INDUSTRY TEMPLATES ───────────────────────────────────────
create table if not exists public.templates (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text,
  biz_type    text not null,      -- retail, ecommerce, distributor, exporter
  questions   text[] not null,    -- pre-built question set
  icon        text default '📊',
  is_active   boolean default true,
  created_at  timestamptz default now()
);

-- ── TEAM COLLABORATION ───────────────────────────────────────
create table if not exists public.teams (
  id         uuid primary key default gen_random_uuid(),
  owner_id   uuid not null references auth.users on delete cascade,
  name       text not null,
  created_at timestamptz default now()
);

create table if not exists public.team_members (
  id        uuid primary key default gen_random_uuid(),
  team_id   uuid not null references public.teams on delete cascade,
  user_id   uuid references auth.users on delete set null,
  email     text not null,
  role      text default 'viewer' check (role in ('owner','editor','viewer')),
  status    text default 'pending' check (status in ('pending','active','declined')),
  invited_at timestamptz default now(),
  joined_at  timestamptz
);

-- Share dashboards with team
alter table public.dashboards add column if not exists team_id uuid references public.teams on delete set null;
alter table public.dashboards add column if not exists is_public boolean default false;

-- ── EXPORT HISTORY ───────────────────────────────────────────
create table if not exists public.exports (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users on delete cascade,
  export_type  text not null check (export_type in ('csv','xlsx','pdf','png')),
  source       text,
  file_url     text,
  created_at   timestamptz default now()
);

-- ── RLS POLICIES ─────────────────────────────────────────────
alter table public.projects      enable row level security;
alter table public.alerts        enable row level security;
alter table public.alert_events  enable row level security;
alter table public.forecasts     enable row level security;
alter table public.templates     enable row level security;
alter table public.teams         enable row level security;
alter table public.team_members  enable row level security;
alter table public.exports       enable row level security;

create policy "Own projects"     on public.projects     for all using (auth.uid() = user_id);
create policy "Own alerts"       on public.alerts       for all using (auth.uid() = user_id);
create policy "Own alert events" on public.alert_events for all using (alert_id in (select id from public.alerts where user_id = auth.uid()));
create policy "Own forecasts"    on public.forecasts    for all using (auth.uid() = user_id);
create policy "Templates public" on public.templates    for select using (is_active = true);
create policy "Own teams"        on public.teams        for all using (auth.uid() = owner_id);
create policy "Team members"     on public.team_members for all using (auth.uid() = user_id or team_id in (select id from public.teams where owner_id = auth.uid()));
create policy "Own exports"      on public.exports      for all using (auth.uid() = user_id);

-- ── SEED INDUSTRY TEMPLATES ──────────────────────────────────
insert into public.templates (name, description, biz_type, questions, icon) values
('Retail Stock Manager',  'Track inventory levels, restock urgency, and slow-moving items', 'retail',
  array['Which items should I restock urgently?','What is my best margin product?','Show me my slowest-moving stock','Can I safely increase prices by 5%?','Which items have the lowest margin?','What is my total stock value?'],
  '🏪'),
('Ecommerce Analyser',    'SKU performance, return rates, and fulfilment costs',            'ecommerce',
  array['Which SKUs have the highest return rate?','Show me my best-performing category','What is my average fulfilment cost per order?','Which products should I discount?','What is my revenue by channel?','Show me my top 10 products by margin'],
  '🛒'),
('Distributor Dashboard', 'Route profitability, regional demand, and customer payments',    'distributor',
  array['Which routes are most profitable?','Show me margin trends by region','Where is demand growing fastest?','Which customers are behind on payment?','What is my cost per delivery?','Show me my top 5 customers by revenue'],
  '🚚'),
('Export Intelligence',   'FX impact, destination market demand, and shipment analysis',    'exporter',
  array['How is FX affecting my margins?','Which destination market has the highest demand?','What is my average cost per shipment?','Show me my top export products by value','Which products have the best export margin?','How has demand changed by market this quarter?'],
  '🌍')
on conflict do nothing;

-- ── TRIGGERS ─────────────────────────────────────────────────
create trigger set_projects_updated_at before update on public.projects for each row execute procedure public.set_updated_at();

-- ── INDEXES ──────────────────────────────────────────────────
create index if not exists idx_projects_user     on public.projects(user_id);
create index if not exists idx_alerts_user       on public.alerts(user_id);
create index if not exists idx_alerts_active     on public.alerts(user_id, is_active);
create index if not exists idx_forecasts_user    on public.forecasts(user_id);
create index if not exists idx_alert_events      on public.alert_events(alert_id, fired_at desc);
create index if not exists idx_team_members_user on public.team_members(user_id);
