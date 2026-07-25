-- Fix: sync_pos_to_unified_data() (018_pos.sql) upserts into unified_data with
-- `on conflict (user_id, channel, record_date)`, but unified_data's only unique
-- constraint is (user_id, source_type, source_record_id) — see 003_sync.sql.
-- That trigger fires AFTER INSERT ... WHEN (NEW.status = 'completed'), i.e. on
-- every cash sale, and Postgres raises 42P10 ("no unique or exclusion
-- constraint matching the ON CONFLICT specification") since no index matches
-- its conflict target. Because the trigger runs in the same transaction as
-- the pos_transactions insert, that error rolls the whole sale back — cash
-- checkout can never complete.
--
-- Scoped to channel='pos' only (partial index) so per-record rows from other
-- synced channels (shopify, amazon, stripe, etc. — one row per source_record_id
-- or per sync batch, legitimately many per day) aren't forced into this
-- one-row-per-day-per-channel shape. (Confirmed live: 'stripe' alone already
-- has 20 user/day groups with >1 row — a table-wide constraint would break it.)

-- Step 1 — consolidate pre-existing 'pos' rows that predate this constraint,
-- so the unique index below can actually be created. Sums gross_revenue
-- (preserves the true net total) and averages gross_margin across the group,
-- onto the earliest row; drops the rest. Idempotent — a rerun with no more
-- duplicates touches zero rows.
with grouped as (
  select user_id, record_date,
         sum(gross_revenue) as total_revenue,
         avg(gross_margin)  as avg_margin,
         (array_agg(id order by created_at asc))[1] as keep_id
  from public.unified_data
  where channel = 'pos'
  group by user_id, record_date
  having count(*) > 1
)
update public.unified_data u
set gross_revenue = g.total_revenue,
    gross_margin  = round(g.avg_margin, 2),
    updated_at    = now()
from grouped g
where u.id = g.keep_id;

with grouped as (
  select user_id, record_date,
         (array_agg(id order by created_at asc))[1] as keep_id
  from public.unified_data
  where channel = 'pos'
  group by user_id, record_date
  having count(*) > 1
)
delete from public.unified_data u
using grouped g
where u.channel = 'pos'
  and u.user_id = g.user_id
  and u.record_date = g.record_date
  and u.id <> g.keep_id;

-- Step 2 — the constraint the trigger's ON CONFLICT was always missing.
create unique index if not exists unified_data_pos_daily_uniq
  on public.unified_data (user_id, channel, record_date)
  where (channel = 'pos');

-- Step 3 — match the trigger's ON CONFLICT to the (partial) index above.
-- A conflict_target with no predicate only matches non-partial indexes, so
-- the `where` clause here is required, not cosmetic.
create or replace function public.sync_pos_to_unified_data()
returns trigger language plpgsql security definer as $$
declare
  v_margin numeric := 0;
  v_cost   numeric;
begin
  select coalesce(sum(cost_price * qty), 0)
  into v_cost
  from public.pos_items
  where transaction_id = NEW.id;

  if NEW.total > 0 then
    v_margin := round(((NEW.total - v_cost) / NEW.total) * 100, 2);
  end if;

  insert into public.unified_data (
    user_id, channel, gross_revenue, gross_margin, record_date
  ) values (
    NEW.owner_id, 'pos', NEW.total, v_margin, date(NEW.created_at)
  )
  on conflict (user_id, channel, record_date) where (channel = 'pos')
  do update set
    gross_revenue = unified_data.gross_revenue + excluded.gross_revenue,
    gross_margin  = round((unified_data.gross_margin + excluded.gross_margin) / 2, 2),
    updated_at    = now();

  return NEW;
end;
$$;

-- Step 4 — refund/amend routes (both pos-askbiz and root trees) also write
-- pos-channel revenue adjustments into unified_data, via a plain `.insert()`
-- with no conflict handling at all. Once the partial index above exists, that
-- bare insert 23505s the instant it lands on the same (owner, today) bucket
-- the sale trigger already created — which is every time, since a refund
-- always follows a completed sale on the same table. Give app code a safe,
-- shared way to apply a revenue delta without needing to know about the
-- partial-index predicate (PostgREST's upsert can't express a `where` on the
-- conflict target, so this can't just be a `.upsert()` call from the client).
create or replace function public.adjust_pos_daily_revenue(
  p_owner_id uuid,
  p_amount   numeric,
  p_date     date default current_date
)
returns void language plpgsql security definer as $$
begin
  insert into public.unified_data (user_id, channel, gross_revenue, gross_margin, record_date)
  values (p_owner_id, 'pos', p_amount, 0, p_date)
  on conflict (user_id, channel, record_date) where (channel = 'pos')
  do update set
    gross_revenue = unified_data.gross_revenue + excluded.gross_revenue,
    updated_at    = now();
end;
$$;
