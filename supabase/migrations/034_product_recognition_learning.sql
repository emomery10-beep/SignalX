-- ============================================================
-- Migration 034 — Product Recognition Learning System
-- Tracks Claude's product recognition patterns to improve
-- future identification accuracy
-- ============================================================

-- ── RECOGNITION HISTORY ──────────────────────────────────────
-- Logs each product recognition attempt and confirmation
create table if not exists public.recognition_history (
  id                uuid primary key default gen_random_uuid(),
  owner_id          uuid not null references auth.users on delete cascade,
  inventory_id      uuid references public.inventory(id) on delete set null,
  recognized_name   text not null,                    -- what Claude identified
  confidence        int,                              -- Claude's confidence (0-100)
  is_match          boolean,                          -- did it match inventory?
  confirmed         boolean default false,            -- did user confirm the match?
  source            text check (source in ('inventory', 'cashier')), -- which camera
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

-- ── PRODUCT HOT LIST ─────────────────────────────────────────
-- Materialized view of most-frequently-recognized products per owner
create materialized view if not exists public.product_hot_list as
select
  owner_id,
  inventory_id,
  recognized_name,
  count(*) as recognition_count,
  count(*) filter (where confirmed) as confirmed_count,
  round(100.0 * count(*) filter (where confirmed) / count(*), 0)::int as success_rate
from public.recognition_history
where confirmed = true
group by owner_id, inventory_id, recognized_name
order by recognition_count desc;

-- Index for fast lookups
create index if not exists idx_recognition_history_owner_created
  on public.recognition_history(owner_id, created_at desc);

create index if not exists idx_recognition_history_inventory
  on public.recognition_history(inventory_id);
