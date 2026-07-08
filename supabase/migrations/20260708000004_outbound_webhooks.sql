-- ============================================================
-- Phase 2 of the developer platform: outbound webhooks. Lets a third-party
-- app react to AskBiz activity (sale.created, purchase_order.received,
-- stock.low) instead of polling — the piece that turns the read-only v1 API
-- into something Zapier-style integrations can build on.
--
-- Capture vs delivery are deliberately split:
--  - Capture (this migration): DB triggers write to an outbox table. This
--    guarantees an event is recorded no matter which app/code path wrote
--    the underlying row — pos_transactions is written by both the main app
--    and pos-askbiz, and a trigger can't be "forgotten" the way an
--    application-level emitWebhookEvent() call at N call sites could be.
--  - Delivery (app/api/cron/webhook-delivery): a 5-minute cron sweep
--    (vercel.json) rather than instant delivery from the trigger itself —
--    simpler and safer than wiring pg_net + HMAC signing into PL/pgSQL.
--    That means webhook delivery latency is bounded by ~5 minutes, not
--    real-time. Tightening this (pg_net for instant delivery straight from
--    the trigger) is a follow-up, not done here.
-- ============================================================

create table if not exists public.api_webhooks (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  url          text not null,
  secret       text not null,                 -- HMAC-SHA256 key for the x-askbiz-signature header
  event_types  text[] not null default '{}',  -- subset of: sale.created | purchase_order.received | stock.low
  is_active    boolean not null default true,
  created_at   timestamptz not null default now()
);
create index if not exists api_webhooks_user_id_idx on public.api_webhooks(user_id);

alter table public.api_webhooks enable row level security;
drop policy if exists "api_webhooks_owner_all" on public.api_webhooks;
create policy "api_webhooks_owner_all" on public.api_webhooks for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table if not exists public.api_webhook_outbox (
  id                uuid primary key default gen_random_uuid(),
  owner_id          uuid not null references auth.users(id) on delete cascade,
  event_type        text not null,
  payload           jsonb not null,
  status            text not null default 'pending' check (status in ('pending', 'delivered', 'failed', 'dead')),
  attempts          integer not null default 0,
  last_attempted_at timestamptz,
  created_at        timestamptz not null default now()
);
create index if not exists api_webhook_outbox_pending_idx on public.api_webhook_outbox(status, created_at) where status = 'pending';
create index if not exists api_webhook_outbox_owner_id_idx on public.api_webhook_outbox(owner_id);

alter table public.api_webhook_outbox enable row level security;
-- Read-only for the owner (a future "recent events" view in the dashboard);
-- all writes come from trigger functions (security definer) or the cron's
-- service client, never directly from the browser.
drop policy if exists "api_webhook_outbox_owner_select" on public.api_webhook_outbox;
create policy "api_webhook_outbox_owner_select" on public.api_webhook_outbox for select
  using (auth.uid() = owner_id);

-- ── sale.created ──────────────────────────────────────────────────────────
create or replace function public.enqueue_sale_created_webhook()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status = 'completed' then
    insert into public.api_webhook_outbox (owner_id, event_type, payload)
    values (
      new.owner_id, 'sale.created',
      jsonb_build_object(
        'transaction_id', new.id, 'total', new.total, 'subtotal', new.subtotal,
        'tax_amount', new.tax_amount, 'payment_type', new.payment_type, 'created_at', new.created_at
      )
    );
  end if;
  return new;
end;
$$;

drop trigger if exists trg_sale_created_webhook on public.pos_transactions;
create trigger trg_sale_created_webhook
  after insert on public.pos_transactions
  for each row execute function public.enqueue_sale_created_webhook();

-- ── purchase_order.received ─────────────────────────────────────────────
create or replace function public.enqueue_po_received_webhook()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status = 'received' and (old.status is distinct from 'received') then
    insert into public.api_webhook_outbox (owner_id, event_type, payload)
    values (
      new.owner_id, 'purchase_order.received',
      jsonb_build_object(
        'purchase_order_id', new.id, 'supplier_id', new.supplier_id,
        'total_cost', new.total_cost, 'received_at', new.received_at
      )
    );
  end if;
  return new;
end;
$$;

drop trigger if exists trg_po_received_webhook on public.purchase_orders;
create trigger trg_po_received_webhook
  after update on public.purchase_orders
  for each row execute function public.enqueue_po_received_webhook();

-- ── stock.low — fires once on the crossing, not on every update while low ──
create or replace function public.enqueue_stock_low_webhook()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.stock_qty <= new.low_stock_threshold
     and (old.stock_qty is null or old.stock_qty > old.low_stock_threshold) then
    insert into public.api_webhook_outbox (owner_id, event_type, payload)
    values (
      new.owner_id, 'stock.low',
      jsonb_build_object(
        'inventory_id', new.id, 'name', new.name,
        'stock_qty', new.stock_qty, 'low_stock_threshold', new.low_stock_threshold
      )
    );
  end if;
  return new;
end;
$$;

drop trigger if exists trg_stock_low_webhook on public.inventory;
create trigger trg_stock_low_webhook
  after update on public.inventory
  for each row execute function public.enqueue_stock_low_webhook();
