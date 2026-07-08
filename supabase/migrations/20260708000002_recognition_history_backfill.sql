-- ============================================================
-- Backfill for migration 034 (034_product_recognition_learning.sql), which
-- is marked "applied" in the remote migration ledger but whose objects
-- (recognition_history, product_hot_list) do not actually exist in
-- production — confirmed via `supabase db dump --linked` while debugging
-- the 20260708000002 migration, which failed with
-- "relation public.recognition_history does not exist".
--
-- Practical impact this was silently causing: app/api/pos/scan/route.ts
-- (the live internal POS camera scanner, not just the new public
-- /api/v1/scan) writes to recognition_history in a fire-and-forget
-- .then() that swallows errors, and reads product_hot_list with no error
-- check — so recognition logging and hot-list-based accuracy boosting have
-- been silent no-ops in production this whole time.
--
-- Reproduces 034's DDL verbatim (idempotent — safe if 034 partially ran
-- elsewhere), and additionally adds RLS, which 034 never had — every other
-- owner-scoped table in this schema has it; recognition_history using the
-- service client today masked the gap, but the new anon-callable-in-spirit
-- public API makes this worth closing now rather than carrying the gap
-- forward.
-- ============================================================

create table if not exists public.recognition_history (
  id                uuid primary key default gen_random_uuid(),
  owner_id          uuid not null references auth.users on delete cascade,
  inventory_id      uuid references public.inventory(id) on delete set null,
  recognized_name   text not null,
  confidence        int,
  is_match          boolean,
  confirmed         boolean default false,
  source            text check (source in ('inventory', 'cashier', 'api')),
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

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

create index if not exists idx_recognition_history_owner_created
  on public.recognition_history(owner_id, created_at desc);
create index if not exists idx_recognition_history_inventory
  on public.recognition_history(inventory_id);

alter table public.recognition_history enable row level security;
drop policy if exists "recognition_history_owner_all" on public.recognition_history;
create policy "recognition_history_owner_all" on public.recognition_history for all
  using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
