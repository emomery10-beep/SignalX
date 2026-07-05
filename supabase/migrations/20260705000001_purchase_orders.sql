-- ============================================================
-- AskBiz Migration — Purchase Orders / Supplier Orders
-- Tables: pos_suppliers, purchase_orders, purchase_order_items
--
-- Purely additive. No changes to existing POS tables. Stock is
-- NOT moved by any trigger here — receiving increments inventory
-- at the app layer via the increment_inventory_stock RPC
-- (atomic + idempotent + audit-logged), keeping this feature
-- fully isolated from the deduct_stock_on_sale /
-- restore_stock_on_refund triggers, which fire on pos_items only.
--
-- Supplier is promoted from the free-text inventory.supplier /
-- inventory_restock.supplier fields to a real table so a PO can
-- be sent to a phone number over WhatsApp. The old free-text
-- columns are left untouched.
--
-- NOTE: This is a byte-identical mirror of pos-askbiz's
-- 20260705_purchase_orders.sql. Both POS apps share one Supabase
-- project (benptbfiudpfvmvwxcjm), so every statement is idempotent
-- (if-not-exists / drop-first) and safe to apply from either side.
-- ============================================================

-- ── POS SUPPLIERS ────────────────────────────────────────────
create table if not exists public.pos_suppliers (
  id             uuid primary key default gen_random_uuid(),
  owner_id       uuid not null references auth.users on delete cascade,
  name           text not null,
  phone          text,                     -- E.164 for WhatsApp send
  email          text,
  lead_time_days int,                       -- typical days from order to delivery
  notes          text,
  active         boolean default true,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

-- ── PURCHASE ORDERS ──────────────────────────────────────────
create table if not exists public.purchase_orders (
  id            uuid primary key default gen_random_uuid(),
  owner_id      uuid not null references auth.users on delete cascade,
  supplier_id   uuid references public.pos_suppliers(id) on delete set null,
  status        text not null default 'draft'
                  check (status in ('draft', 'ordered', 'partial', 'received', 'cancelled')),
  total_cost    numeric default 0,          -- sum of line totals, captured at build time
  notes         text,
  expected_at   timestamptz,                -- expected delivery date
  sent_at       timestamptz,                -- when it went to the supplier
  received_at   timestamptz,                -- when fully received
  created_by    uuid references public.pos_staff(id) on delete set null,
  client_tx_id  text,                       -- offline-write idempotency (INSERT-once)
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ── PURCHASE ORDER ITEMS (line items per PO) ─────────────────
create table if not exists public.purchase_order_items (
  id            uuid primary key default gen_random_uuid(),
  po_id         uuid not null references public.purchase_orders(id) on delete cascade,
  inventory_id  uuid references public.inventory(id) on delete set null,
  name          text not null,              -- captured at build time
  qty_ordered   numeric not null default 0, -- numeric to match decimal stock (kg/litre)
  qty_received  numeric not null default 0, -- back-order = qty_ordered - qty_received
  unit_cost     numeric default 0,
  line_total    numeric default 0,
  created_at    timestamptz default now()
);

-- ── ROW LEVEL SECURITY ──────────────────────────────────────
alter table public.pos_suppliers        enable row level security;
alter table public.purchase_orders       enable row level security;
alter table public.purchase_order_items  enable row level security;

-- drop-first so a re-apply (both POS apps share one DB) is safe.
-- pos_suppliers: owner only
drop policy if exists "Owner manages suppliers" on public.pos_suppliers;
create policy "Owner manages suppliers"
  on public.pos_suppliers for all using (auth.uid() = owner_id);

-- purchase_orders: owner only
drop policy if exists "Owner manages purchase orders" on public.purchase_orders;
create policy "Owner manages purchase orders"
  on public.purchase_orders for all using (auth.uid() = owner_id);

-- purchase_order_items: via PO ownership (mirrors pos_items policy)
drop policy if exists "Owner manages purchase order items" on public.purchase_order_items;
create policy "Owner manages purchase order items"
  on public.purchase_order_items for all using (
    po_id in (
      select id from public.purchase_orders where owner_id = auth.uid()
    )
  );

-- ── INDEXES ─────────────────────────────────────────────────
create index if not exists idx_pos_suppliers_owner    on public.pos_suppliers(owner_id);
create index if not exists idx_pos_suppliers_active    on public.pos_suppliers(owner_id, active);
create index if not exists idx_purchase_orders_owner   on public.purchase_orders(owner_id);
create index if not exists idx_purchase_orders_status  on public.purchase_orders(owner_id, status);
create index if not exists idx_purchase_orders_created on public.purchase_orders(owner_id, created_at desc);
create index if not exists idx_purchase_orders_supplier on public.purchase_orders(supplier_id);
create index if not exists idx_po_items_po             on public.purchase_order_items(po_id);
create index if not exists idx_po_items_inventory      on public.purchase_order_items(inventory_id);

-- Offline-write idempotency: a replayed PO create converges to one row.
-- Partial unique index so nulls (online creates) never collide.
create unique index if not exists idx_purchase_orders_client_tx_id
  on public.purchase_orders (owner_id, client_tx_id)
  where client_tx_id is not null;

-- ── TRIGGERS ────────────────────────────────────────────────
-- set_updated_at() defined in 001_init / redeclared in 018_pos.
-- drop-first so a re-apply (both POS apps share one DB) is safe.
drop trigger if exists set_pos_suppliers_updated_at on public.pos_suppliers;
create trigger set_pos_suppliers_updated_at
  before update on public.pos_suppliers
  for each row execute procedure public.set_updated_at();

drop trigger if exists set_purchase_orders_updated_at on public.purchase_orders;
create trigger set_purchase_orders_updated_at
  before update on public.purchase_orders
  for each row execute procedure public.set_updated_at();
