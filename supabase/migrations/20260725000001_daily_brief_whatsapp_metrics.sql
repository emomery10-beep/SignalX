-- The daily-brief cron now sends a WhatsApp sales/profit/loss report instead of an
-- email narrative. Adds rolling-window P&L columns + a delivery flag. The existing
-- improved/worsened/action/health_score/opened_at columns are untouched — the
-- in-app /api/daily-brief endpoint still reads and writes them independently.
alter table public.daily_briefs
  add column if not exists sales_24h     numeric,
  add column if not exists profit_24h    numeric,
  add column if not exists losses_24h    numeric,
  add column if not exists sales_7d      numeric,
  add column if not exists profit_7d     numeric,
  add column if not exists losses_7d     numeric,
  add column if not exists whatsapp_sent boolean default false;
