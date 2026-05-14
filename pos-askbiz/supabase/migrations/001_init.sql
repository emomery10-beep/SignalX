-- ============================================================
-- SignalX Database Schema
-- Run via: supabase db push
-- ============================================================

-- ── PROFILES (extends auth.users) ──────────────────────────
create table if not exists public.profiles (
  id              uuid primary key references auth.users on delete cascade,
  full_name       text,
  avatar_url      text,
  business_type   text check (business_type in ('retail','ecommerce','distributor','exporter')) default 'retail',
  currency        text default 'USD',
  currency_symbol text default '$',
  country_code    text,
  region          text,
  sector_hints    text,
  plan            text check (plan in ('starter','growth','business')) default 'starter',
  onboarded       boolean default false,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- ── CONVERSATIONS ────────────────────────────────────────────
create table if not exists public.conversations (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users on delete cascade,
  title      text not null default 'New conversation',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ── MESSAGES ────────────────────────────────────────────────
create table if not exists public.messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations on delete cascade,
  role            text not null check (role in ('user','assistant')),
  content         text not null,
  result_json     jsonb,           -- structured AI response stored here
  created_at      timestamptz default now()
);

-- ── UPLOADS ─────────────────────────────────────────────────
create table if not exists public.uploads (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users on delete cascade,
  conversation_id uuid references public.conversations on delete set null,
  filename        text not null,
  storage_path    text,
  file_size       bigint,
  row_count       int,
  column_names    text[],
  parsed_sample   jsonb,           -- first 100 rows for AI context
  status          text default 'pending' check (status in ('pending','parsed','error')),
  created_at      timestamptz default now()
);

-- ── DASHBOARDS ───────────────────────────────────────────────
create table if not exists public.dashboards (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users on delete cascade,
  title      text not null default 'My Dashboard',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ── DASHBOARD TILES ─────────────────────────────────────────
create table if not exists public.dashboard_tiles (
  id           uuid primary key default gen_random_uuid(),
  dashboard_id uuid not null references public.dashboards on delete cascade,
  tile_type    text not null check (tile_type in ('chart','kpi','table','text')),
  title        text,
  config       jsonb not null default '{}',  -- chart data, kpi values, etc.
  position     int default 0,
  created_at   timestamptz default now()
);

-- ── AUDIT LOG ────────────────────────────────────────────────
create table if not exists public.audit_log (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users on delete set null,
  event      text not null,
  metadata   jsonb default '{}',
  created_at timestamptz default now()
);

-- ── GEO CACHE (IP → geo data cache to reduce API calls) ────
create table if not exists public.geo_cache (
  ip_hash    text primary key,   -- hashed IP for privacy
  country    text,
  country_code text,
  city       text,
  currency   text,
  sector     text,
  cached_at  timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.profiles       enable row level security;
alter table public.conversations  enable row level security;
alter table public.messages       enable row level security;
alter table public.uploads        enable row level security;
alter table public.dashboards     enable row level security;
alter table public.dashboard_tiles enable row level security;
alter table public.audit_log      enable row level security;

-- Profiles
create policy "Users can view own profile"   on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- Conversations
create policy "Own conversations" on public.conversations for all using (auth.uid() = user_id);

-- Messages — via conversation ownership
create policy "Own messages" on public.messages for all using (
  conversation_id in (select id from public.conversations where user_id = auth.uid())
);

-- Uploads
create policy "Own uploads" on public.uploads for all using (auth.uid() = user_id);

-- Dashboards
create policy "Own dashboards" on public.dashboards for all using (auth.uid() = user_id);

-- Dashboard tiles — via dashboard ownership
create policy "Own dashboard tiles" on public.dashboard_tiles for all using (
  dashboard_id in (select id from public.dashboards where user_id = auth.uid())
);

-- Audit log — users can read their own events
create policy "Own audit events" on public.audit_log for select using (auth.uid() = user_id);

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Auto-create profile when user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger set_profiles_updated_at       before update on public.profiles       for each row execute procedure public.set_updated_at();
create trigger set_conversations_updated_at  before update on public.conversations  for each row execute procedure public.set_updated_at();
create trigger set_dashboards_updated_at     before update on public.dashboards     for each row execute procedure public.set_updated_at();

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================
insert into storage.buckets (id, name, public) values ('uploads', 'uploads', false) on conflict do nothing;

create policy "Users upload own files" on storage.objects for insert with check (
  bucket_id = 'uploads' and auth.uid()::text = (storage.foldername(name))[1]
);
create policy "Users read own files" on storage.objects for select using (
  bucket_id = 'uploads' and auth.uid()::text = (storage.foldername(name))[1]
);
create policy "Users delete own files" on storage.objects for delete using (
  bucket_id = 'uploads' and auth.uid()::text = (storage.foldername(name))[1]
);

-- ============================================================
-- INDEXES
-- ============================================================
create index if not exists idx_conversations_user_id  on public.conversations(user_id);
create index if not exists idx_messages_conversation   on public.messages(conversation_id);
create index if not exists idx_uploads_user_id         on public.uploads(user_id);
create index if not exists idx_dashboards_user_id      on public.dashboards(user_id);
create index if not exists idx_audit_user_id           on public.audit_log(user_id);
create index if not exists idx_audit_created_at        on public.audit_log(created_at desc);
