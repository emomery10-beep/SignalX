-- Follow-up to 20260725000001: sync_pos_to_unified_data() and
-- adjust_pos_daily_revenue() insert into unified_data without setting
-- source_type, which is NOT NULL live (003_sync.sql) — every completed cash
-- sale still fails (now with 23502, not 42P10) until this is set. Live
-- verification (direct SQL call) confirmed the omission reproduces the error.
--
-- IMPORTANT — do not reuse 'askbiz_pos' for this value. That tag is already
-- owned by a separate, properly-designed mechanism: lib/sync/engine.ts's
-- syncAskBizPOS() (gated by an active connected_sources row, source_type
-- 'askbiz_pos') writes one unified_data row per (transaction, line item),
-- with full product/sku/margin detail, keyed on the table's ORIGINAL unique
-- constraint (user_id, source_type, source_record_id). Live data confirms
-- it has actually run (54 real rows, 2026-05-12 to 2026-07-10). If this
-- trigger's coarse daily-aggregate rows also claimed 'askbiz_pos', both
-- mechanisms would contribute to the same channel='pos' revenue total under
-- an identical tag — any BI query summing gross_revenue by channel alone
-- would double-count the instant both are active for the same user/day.
-- Using a distinct tag doesn't resolve that architecture question (should
-- one of these be disabled? scoped differently?) — it just stops this
-- migration from making it silently worse. Left for a product decision,
-- same as the pos_integrations conflict already on record elsewhere.

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
    user_id, channel, source_type, gross_revenue, gross_margin, record_date
  ) values (
    NEW.owner_id, 'pos', 'askbiz_pos_daily_agg', NEW.total, v_margin, date(NEW.created_at)
  )
  on conflict (user_id, channel, record_date) where (channel = 'pos')
  do update set
    gross_revenue = unified_data.gross_revenue + excluded.gross_revenue,
    gross_margin  = round((unified_data.gross_margin + excluded.gross_margin) / 2, 2),
    updated_at    = now();

  return NEW;
end;
$$;

create or replace function public.adjust_pos_daily_revenue(
  p_owner_id uuid,
  p_amount   numeric,
  p_date     date default current_date
)
returns void language plpgsql security definer as $$
begin
  insert into public.unified_data (user_id, channel, source_type, gross_revenue, gross_margin, record_date)
  values (p_owner_id, 'pos', 'askbiz_pos_daily_agg', p_amount, 0, p_date)
  on conflict (user_id, channel, record_date) where (channel = 'pos')
  do update set
    gross_revenue = unified_data.gross_revenue + excluded.gross_revenue,
    updated_at    = now();
end;
$$;
