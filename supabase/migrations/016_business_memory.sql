-- ── BUSINESS MEMORY ───────────────────────────────────────────────────────────
-- Persistent facts about each user's business, extracted from conversations.
-- The AI reads these at query time so it knows the user's business deeply
-- without them having to repeat themselves every session.
create table if not exists public.business_memory (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users on delete cascade,
  category     text not null check (category in (
    'finance', 'product', 'operations', 'market', 'goal', 'challenge', 'context'
  )),
  key          text not null,        -- e.g. "gross_margin", "main_product", "target_market"
  value        text not null,        -- e.g. "18%", "leather wallets", "UK and Nigeria"
  source       text default 'conversation', -- 'conversation' | 'profile' | 'data'
  confidence   text default 'medium' check (confidence in ('high','medium','low')),
  updated_at   timestamptz default now(),
  created_at   timestamptz default now()
);

-- One fact per user per key — upsert on (user_id, key)
create unique index if not exists idx_business_memory_key
  on public.business_memory(user_id, key);

create index if not exists idx_business_memory_user
  on public.business_memory(user_id, category);

alter table public.business_memory enable row level security;

create policy "Own business memory"
  on public.business_memory for all
  using (user_id = auth.uid());
