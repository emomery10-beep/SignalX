-- ============================================================
-- AskBiz Migration 018 — Point of Sale System
-- Tables: pos_staff, pos_transactions, pos_items,
--         inventory, customers
-- Adds:   pos channel to unified_data, pos_enabled to profiles
-- ============================================================

-- ── POS STAFF ────────────────────────────────────────────────
-- Owner creates staff accounts; cashiers/inventory log in via phone OTP
create table if not exists public.pos_staff (
  id            uuid primary key default gen_random_uuid(),
  owner_id      uuid not null references auth.users on delete cascade,
  phone         text not null,
  name          text not null,
  role          text not null check (role in ('cashier', 'inventory')),
  pin           text,                    -- optional 4-digit pin for quick switch
  active        boolean default true,
  invited_at    timestamptz default now(),
  last_login_at timestamptz,
  created_at    timestamptz default now(),
  unique(owner_id, phone)
);

-- ── POS CUSTOMERS ────────────────────────────────────────────
-- Built from WhatsApp receipt numbers — no forced registration
create table if not exists public.pos_customers (
  id             uuid primary key default gen_random_uuid(),
  owner_id       uuid not null references auth.users on delete cascade,
  phone          text not null,
  name           text,
  first_seen_at  timestamptz default now(),
  last_seen_at   timestamptz default now(),
  total_spent    numeric default 0,
  visit_count    int default 0,
  created_at     timestamptz default now(),
  unique(owner_id, phone)
);

-- ── INVENTORY ────────────────────────────────────────────────
create table if not exists public.inventory (
  id                 uuid primary key default gen_random_uuid(),
  owner_id           uuid not null references auth.users on delete cascade,
  name               text not null,
  sku                text,
  cost_price         numeric default 0,
  sale_price         numeric not null default 0,
  stock_qty          int not null default 0,
  low_stock_threshold int default 5,
  unit               text default 'item',   -- item, kg, litre, etc.
  image_url          text,
  active             boolean default true,
  last_sold_at       timestamptz,
  created_at         timestamptz default now(),
  updated_at         timestamptz default now()
);

-- ── POS TRANSACTIONS ────────────────────────────────────────
create table if not exists public.pos_transactions (
  id              uuid primary key default gen_random_uuid(),
  owner_id        uuid not null references auth.users on delete cascade,
  cashier_id      uuid references public.pos_staff(id) on delete set null,
  customer_id     uuid references public.pos_customers(id) on delete set null,
  total           numeric not null,
  subtotal        numeric not null,
  tax_amount      numeric default 0,
  payment_type    text not null check (payment_type in ('cash', 'card', 'other')),
  status          text not null default 'completed' check (status in ('completed', 'refunded', 'partially_refunded', 'amended')),
  receipt_sent    boolean default false,
  notes           text,
  amended_from    uuid references public.pos_transactions(id) on delete set null,
  amended_at      timestamptz,
  amended_by      uuid references public.pos_staff(id) on delete set null,
  amend_reason    text,
  created_at      timestamptz default now()
);

-- ── POS ITEMS (line items per transaction) ───────────────────
create table if not exists public.pos_items (
  id               uuid primary key default gen_random_uuid(),
  transaction_id   uuid not null references public.pos_transactions(id) on delete cascade,
  inventory_id     uuid references public.inventory(id) on delete set null,
  name             text not null,          -- captured at time of sale
  qty              int not null default 1,
  unit_price       numeric not null,
  cost_price       numeric default 0,      -- captured at time of sale for margin tracking
  line_total       numeric not null,
  refunded         boolean default false,
  refunded_at      timestamptz,
  refund_reason    text
);

-- ── POS OTP (WhatsApp login codes for staff) ─────────────────
create table if not exists public.pos_otp (
  id         uuid primary key default gen_random_uuid(),
  phone      text not null,
  code       text not null,
  expires_at timestamptz not null,
  used       boolean default false,
  created_at timestamptz default now()
);

-- ── INVENTORY RESTOCK LOG ────────────────────────────────────
create table if not exists public.inventory_restock (
  id           uuid primary key default gen_random_uuid(),
  owner_id     uuid not null references auth.users on delete cascade,
  inventory_id uuid not null references public.inventory(id) on delete cascade,
  qty_added    int not null,
  cost_per_unit numeric,
  supplier     text,
  notes        text,
  created_by   uuid references public.pos_staff(id) on delete set null,
  created_at   timestamptz default now()
);

-- ── COLLECTIVE / MARKET INTELLIGENCE ────────────────────────
-- Anonymised nightly aggregates — never contains individual business data
create table if not exists public.market_benchmarks (
  id             uuid primary key default gen_random_uuid(),
  sector         text not null,            -- 'retail', 'restaurant', 'factory', etc.
  region         text not null,            -- 'United Kingdom', 'Kenya', 'Germany', etc.
  business_size  text not null check (business_size in ('micro', 'small', 'medium')),
  metric         text not null,            -- 'avg_margin', 'avg_basket', 'refund_rate', etc.
  value          numeric not null,
  sample_size    int not null,             -- how many businesses contributed
  period         text not null,            -- YYYY-MM
  created_at     timestamptz default now(),
  unique(sector, region, business_size, metric, period)
);

-- ── PROFILE UPDATES ─────────────────────────────────────────
alter table public.profiles
  add column if not exists pos_enabled          boolean default false,
  add column if not exists pos_seat_count       int default 0,
  add column if not exists collective_opt_in    boolean default false,
  add column if not exists collective_opted_at  timestamptz;

-- ── unified_data: ensure pos channel is supported ───────────
-- unified_data.channel already stores 'shopify','amazon','stripe' etc.
-- 'pos' is a new valid value — no schema change needed, just documenting.

-- ── ROW LEVEL SECURITY ──────────────────────────────────────
alter table public.pos_staff          enable row level security;
alter table public.pos_customers      enable row level security;
alter table public.inventory          enable row level security;
alter table public.pos_transactions   enable row level security;
alter table public.pos_items          enable row level security;
alter table public.pos_otp            enable row level security;
alter table public.inventory_restock  enable row level security;
alter table public.market_benchmarks  enable row level security;

-- pos_staff: owner manages, cashier reads own record
create policy "Owner manages staff"
  on public.pos_staff for all using (auth.uid() = owner_id);

-- pos_customers: owner only
create policy "Owner manages customers"
  on public.pos_customers for all using (auth.uid() = owner_id);

-- inventory: owner full access
create policy "Owner manages inventory"
  on public.inventory for all using (auth.uid() = owner_id);

-- pos_transactions: owner full access
create policy "Owner manages transactions"
  on public.pos_transactions for all using (auth.uid() = owner_id);

-- pos_items: via transaction ownership
create policy "Owner manages items"
  on public.pos_items for all using (
    transaction_id in (
      select id from public.pos_transactions where owner_id = auth.uid()
    )
  );

-- pos_otp: open insert for unauthenticated staff login flow
create policy "OTP insert open"
  on public.pos_otp for insert with check (true);
create policy "OTP read own"
  on public.pos_otp for select using (true);
create policy "OTP update open"
  on public.pos_otp for update using (true);

-- inventory_restock: owner only
create policy "Owner manages restock"
  on public.inventory_restock for all using (auth.uid() = owner_id);

-- market_benchmarks: read only for all authenticated users
create policy "Benchmarks readable"
  on public.market_benchmarks for select using (auth.role() = 'authenticated');

-- ── INDEXES ─────────────────────────────────────────────────
create index if not exists idx_pos_staff_owner        on public.pos_staff(owner_id);
create index if not exists idx_pos_staff_phone        on public.pos_staff(phone);
create index if not exists idx_pos_customers_owner    on public.pos_customers(owner_id);
create index if not exists idx_pos_customers_phone    on public.pos_customers(owner_id, phone);
create index if not exists idx_inventory_owner        on public.inventory(owner_id);
create index if not exists idx_inventory_active       on public.inventory(owner_id, active);
create index if not exists idx_pos_tx_owner           on public.pos_transactions(owner_id);
create index if not exists idx_pos_tx_cashier         on public.pos_transactions(cashier_id);
create index if not exists idx_pos_tx_created         on public.pos_transactions(owner_id, created_at desc);
create index if not exists idx_pos_items_tx           on public.pos_items(transaction_id);
create index if not exists idx_pos_otp_phone          on public.pos_otp(phone, expires_at);
create index if not exists idx_restock_inventory      on public.inventory_restock(inventory_id);
create index if not exists idx_benchmarks_lookup      on public.market_benchmarks(sector, region, metric, period);

-- ── TRIGGERS ────────────────────────────────────────────────
-- Ensure set_updated_at exists (defined in 001_init but redeclared here for safety)
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger set_inventory_updated_at
  before update on public.inventory
  for each row execute procedure public.set_updated_at();

-- Auto-deduct stock when a sale is completed
create or replace function public.deduct_inventory_on_sale()
returns trigger language plpgsql security definer as $$
begin
  if NEW.inventory_id is not null then
    update public.inventory
    set
      stock_qty    = greatest(stock_qty - NEW.qty, 0),
      last_sold_at = now(),
      updated_at   = now()
    where id = NEW.inventory_id;
  end if;
  return NEW;
end;
$$;

drop trigger if exists deduct_stock_on_sale on public.pos_items;
create trigger deduct_stock_on_sale
  after insert on public.pos_items
  for each row execute procedure public.deduct_inventory_on_sale();

-- Restore stock on refund
create or replace function public.restore_inventory_on_refund()
returns trigger language plpgsql security definer as $$
begin
  if NEW.refunded = true and OLD.refunded = false and NEW.inventory_id is not null then
    update public.inventory
    set stock_qty  = stock_qty + NEW.qty,
        updated_at = now()
    where id = NEW.inventory_id;
  end if;
  return NEW;
end;
$$;

drop trigger if exists restore_stock_on_refund on public.pos_items;
create trigger restore_stock_on_refund
  after update on public.pos_items
  for each row execute procedure public.restore_inventory_on_refund();

-- Write POS sales into unified_data for BI / health score
create or replace function public.sync_pos_to_unified_data()
returns trigger language plpgsql security definer as $$
declare
  v_margin numeric := 0;
  v_cost   numeric;
begin
  -- Calculate total cost from items
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
  on conflict (user_id, channel, record_date)
  do update set
    gross_revenue = unified_data.gross_revenue + excluded.gross_revenue,
    gross_margin  = round((unified_data.gross_margin + excluded.gross_margin) / 2, 2),
    updated_at    = now();

  return NEW;
end;
$$;

drop trigger if exists pos_to_unified_data on public.pos_transactions;
create trigger pos_to_unified_data
  after insert on public.pos_transactions
  for each row
  when (NEW.status = 'completed')
  execute procedure public.sync_pos_to_unified_data();
