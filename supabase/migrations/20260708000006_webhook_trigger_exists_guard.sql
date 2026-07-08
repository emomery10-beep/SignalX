-- ============================================================
-- Fix for 20260708000004_outbound_webhooks.sql: the three trigger
-- functions unconditionally insert into api_webhook_outbox on every
-- matching sale/PO/stock-change across the ENTIRE platform, regardless of
-- whether that owner has ever registered a webhook. The overwhelming
-- majority of merchants aren't using the developer platform at all, so in
-- practice nearly every enqueued row would be picked up by the delivery
-- cron only to be immediately marked 'dead' (no matching subscriber) —
-- wasted writes on every single POS transaction platform-wide, not a rare
-- edge case. Add an EXISTS guard so the outbox only grows for owners who
-- actually have an active webhook subscribed to that event type.
-- (Never edit an already-applied migration — this is a follow-up, not an
-- edit to 20260708000004.)
-- ============================================================

create or replace function public.enqueue_sale_created_webhook()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status = 'completed'
     and exists (
       select 1 from public.api_webhooks
       where user_id = new.owner_id and is_active = true and 'sale.created' = any(event_types)
     ) then
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

create or replace function public.enqueue_po_received_webhook()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status = 'received' and (old.status is distinct from 'received')
     and exists (
       select 1 from public.api_webhooks
       where user_id = new.owner_id and is_active = true and 'purchase_order.received' = any(event_types)
     ) then
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

create or replace function public.enqueue_stock_low_webhook()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.stock_qty <= new.low_stock_threshold
     and (old.stock_qty is null or old.stock_qty > old.low_stock_threshold)
     and exists (
       select 1 from public.api_webhooks
       where user_id = new.owner_id and is_active = true and 'stock.low' = any(event_types)
     ) then
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
