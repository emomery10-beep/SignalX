-- ─────────────────────────────────────────────────────────────────
-- RESTAURANT / FOOD SERVICE MODULE
-- Covers: restaurants, cafes, bars, food stalls, catering, takeaways
-- ─────────────────────────────────────────────────────────────────

-- ── 1. FLOOR PLAN — physical tables ────────────────────────────────
create table if not exists restaurant_tables (
  id            uuid primary key default gen_random_uuid(),
  owner_id      uuid not null references auth.users(id) on delete cascade,
  location_id   uuid references pos_locations(id) on delete set null,
  name          text not null,                     -- "Table 1", "Bar Stool 3", "Terrace A"
  section       text default 'Main',               -- "Indoor" | "Outdoor" | "Bar" | "Terrace"
  capacity      int  default 4,
  shape         text default 'rectangle',          -- "rectangle" | "circle" | "square"
  x_pos         int  default 0,                    -- floor plan grid position
  y_pos         int  default 0,
  width         int  default 2,
  height        int  default 2,
  status        text default 'available',          -- "available" | "occupied" | "reserved" | "cleaning" | "closed"
  current_order_id uuid,
  server_id     uuid references pos_staff(id) on delete set null,
  seated_at     timestamptz,
  reservation_name text,
  reservation_at   timestamptz,
  created_at    timestamptz default now()
);

-- ── 2. MENU CATEGORIES ──────────────────────────────────────────────
create table if not exists restaurant_menu_categories (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null references auth.users(id) on delete cascade,
  location_id uuid references pos_locations(id) on delete set null,
  name        text not null,                       -- "Starters", "Mains", "Desserts", "Drinks", "Specials"
  sort_order  int  default 0,
  available   bool default true,
  color       text default '#d08a59',              -- display colour for UI
  icon        text default '🍽️',
  created_at  timestamptz default now()
);

-- ── 3. MENU ITEMS ───────────────────────────────────────────────────
create table if not exists restaurant_menu_items (
  id            uuid primary key default gen_random_uuid(),
  owner_id      uuid not null references auth.users(id) on delete cascade,
  category_id   uuid references restaurant_menu_categories(id) on delete set null,
  name          text not null,
  description   text,
  price         decimal(10,2) not null default 0,
  food_cost     decimal(10,2) default 0,           -- cost to make (COGS)
  station       text default 'all',               -- "grill" | "fryer" | "cold" | "drinks" | "dessert" | "all"
  prep_time_mins int default 10,                  -- estimated prep, used for wait time
  available     bool default true,
  eighty_sixed  bool default false,               -- out for today (86'd)
  image_url     text,
  calories      int,
  allergens     text[] default '{}',              -- ["gluten","dairy","nuts","shellfish","soy","eggs"]
  tags          text[] default '{}',              -- ["popular","spicy","vegan","gluten-free","new"]
  sort_order    int  default 0,
  created_at    timestamptz default now()
);

-- ── 4. MODIFIER GROUPS ──────────────────────────────────────────────
-- e.g. "How would you like your steak?" or "Choose your sides"
create table if not exists restaurant_modifier_groups (
  id              uuid primary key default gen_random_uuid(),
  owner_id        uuid not null references auth.users(id) on delete cascade,
  name            text not null,                   -- "Doneness", "Extras", "Sauce"
  selection_type  text default 'single',           -- "single" | "multiple"
  required        bool default false,
  min_selections  int  default 0,
  max_selections  int  default 1,
  created_at      timestamptz default now()
);

-- ── 5. MODIFIER OPTIONS ─────────────────────────────────────────────
create table if not exists restaurant_modifiers (
  id                uuid primary key default gen_random_uuid(),
  group_id          uuid not null references restaurant_modifier_groups(id) on delete cascade,
  owner_id          uuid not null references auth.users(id) on delete cascade,
  name              text not null,                 -- "Rare", "Extra Cheese", "No Onions"
  price_adjustment  decimal(10,2) default 0,       -- 0 = free, positive = extra charge
  sort_order        int default 0
);

-- ── 6. ITEM → MODIFIER GROUP MAPPING ───────────────────────────────
create table if not exists restaurant_item_modifier_groups (
  item_id   uuid not null references restaurant_menu_items(id) on delete cascade,
  group_id  uuid not null references restaurant_modifier_groups(id) on delete cascade,
  primary key (item_id, group_id)
);

-- ── 7. ORDERS ───────────────────────────────────────────────────────
create table if not exists restaurant_orders (
  id                uuid primary key default gen_random_uuid(),
  owner_id          uuid not null references auth.users(id) on delete cascade,
  location_id       uuid references pos_locations(id) on delete set null,
  table_id          uuid references restaurant_tables(id) on delete set null,
  server_id         uuid references pos_staff(id) on delete set null,
  status            text default 'open',           -- "open" | "sent" | "all_served" | "paid" | "void"
  order_type        text default 'dine_in',        -- "dine_in" | "takeaway" | "online" | "kiosk" | "phone" | "catering"
  covers            int  default 1,
  subtotal          decimal(10,2) default 0,
  discount_amount   decimal(10,2) default 0,
  tax_amount        decimal(10,2) default 0,
  total             decimal(10,2) default 0,
  payment_type      text,
  customer_id       uuid references pos_customers(id) on delete set null,
  customer_name     text,
  customer_phone    text,
  notes             text,
  source_ref        text,                          -- online platform order ref, reservation id
  pos_transaction_id uuid,                        -- linked to pos_transactions on payment
  -- timings
  seated_at         timestamptz default now(),
  first_item_sent_at timestamptz,
  last_item_ready_at timestamptz,
  paid_at           timestamptz,
  created_at        timestamptz default now()
);

-- ── 8. ORDER ITEMS ──────────────────────────────────────────────────
create table if not exists restaurant_order_items (
  id            uuid primary key default gen_random_uuid(),
  order_id      uuid not null references restaurant_orders(id) on delete cascade,
  owner_id      uuid not null references auth.users(id) on delete cascade,
  menu_item_id  uuid references restaurant_menu_items(id) on delete set null,
  name          text not null,                     -- snapshot at time of order
  unit_price    decimal(10,2) not null,
  food_cost     decimal(10,2) default 0,
  qty           int  default 1,
  status        text default 'pending',            -- "pending" | "sent" | "preparing" | "ready" | "served" | "void"
  course        text default 'main',               -- "starter" | "main" | "dessert" | "drink" | "side"
  station       text default 'all',               -- KDS station routing
  notes         text,                             -- customer notes e.g. "no onions"
  void_reason   text,
  voided_by     uuid references pos_staff(id) on delete set null,
  sent_at       timestamptz,
  ready_at      timestamptz,
  served_at     timestamptz,
  created_at    timestamptz default now()
);

-- ── 9. ORDER ITEM MODIFIERS (snapshot) ─────────────────────────────
create table if not exists restaurant_order_item_modifiers (
  id              uuid primary key default gen_random_uuid(),
  order_item_id   uuid not null references restaurant_order_items(id) on delete cascade,
  modifier_id     uuid references restaurant_modifiers(id) on delete set null,
  group_name      text,
  name            text not null,                   -- snapshot
  price_adjustment decimal(10,2) default 0
);

-- ── 10. KITCHEN DISPLAY TICKETS ─────────────────────────────────────
create table if not exists restaurant_kitchen_tickets (
  id            uuid primary key default gen_random_uuid(),
  owner_id      uuid not null references auth.users(id) on delete cascade,
  order_id      uuid not null references restaurant_orders(id) on delete cascade,
  location_id   uuid references pos_locations(id) on delete set null,
  station       text not null,                     -- "grill" | "fryer" | "cold" | "drinks" | "dessert" | "all"
  status        text default 'pending',            -- "pending" | "in_progress" | "done"
  items_json    jsonb not null default '[]',       -- snapshot of items for this station
  table_name    text,
  covers        int  default 1,
  server_name   text,
  order_type    text default 'dine_in',
  sent_at       timestamptz default now(),
  started_at    timestamptz,
  completed_at  timestamptz,
  bump_count    int default 0                      -- recalls after bump
);

-- ── 11. LABOR SHIFTS ────────────────────────────────────────────────
create table if not exists restaurant_labor_shifts (
  id            uuid primary key default gen_random_uuid(),
  owner_id      uuid not null references auth.users(id) on delete cascade,
  location_id   uuid references pos_locations(id) on delete set null,
  staff_id      uuid not null references pos_staff(id) on delete cascade,
  role          text not null,                     -- "chef" | "waiter" | "bartender" | "manager" | "cashier" | "runner"
  hourly_rate   decimal(10,2) default 0,
  clock_in      timestamptz not null default now(),
  clock_out     timestamptz,
  break_mins    int default 0,
  total_hours   decimal(5,2),                     -- calculated on clock-out
  total_cost    decimal(10,2),                    -- hourly_rate * total_hours
  notes         text,
  status        text default 'active'             -- "active" | "completed"
);

-- ── 12. 86 BOARD (out of stock items) ──────────────────────────────
create table if not exists restaurant_eighty_six (
  id              uuid primary key default gen_random_uuid(),
  owner_id        uuid not null references auth.users(id) on delete cascade,
  location_id     uuid references pos_locations(id) on delete set null,
  menu_item_id    uuid references restaurant_menu_items(id) on delete cascade,
  item_name       text not null,
  eighty_sixed_at timestamptz default now(),
  eighty_sixed_by uuid references pos_staff(id) on delete set null,
  restored_at     timestamptz,
  reason          text
);

-- ── 13. ONLINE ORDERS ───────────────────────────────────────────────
create table if not exists restaurant_online_orders (
  id              uuid primary key default gen_random_uuid(),
  owner_id        uuid not null references auth.users(id) on delete cascade,
  location_id     uuid references pos_locations(id) on delete set null,
  order_id        uuid references restaurant_orders(id) on delete set null,
  status          text default 'pending',          -- "pending" | "accepted" | "rejected" | "ready" | "collected"
  customer_name   text,
  customer_phone  text,
  customer_email  text,
  items_json      jsonb not null default '[]',
  subtotal        decimal(10,2) default 0,
  total           decimal(10,2) default 0,
  requested_time  timestamptz,
  accepted_at     timestamptz,
  ready_at        timestamptz,
  collected_at    timestamptz,
  source          text default 'website',          -- "website" | "phone" | "uber_eats" | "deliveroo" | "just_eat"
  created_at      timestamptz default now()
);

-- ── 14. RESERVATIONS ────────────────────────────────────────────────
create table if not exists restaurant_reservations (
  id              uuid primary key default gen_random_uuid(),
  owner_id        uuid not null references auth.users(id) on delete cascade,
  location_id     uuid references pos_locations(id) on delete set null,
  table_id        uuid references restaurant_tables(id) on delete set null,
  customer_name   text not null,
  customer_phone  text,
  customer_email  text,
  covers          int  default 2,
  reserved_at     timestamptz not null,
  duration_mins   int  default 90,
  status          text default 'confirmed',        -- "pending" | "confirmed" | "seated" | "completed" | "no_show" | "cancelled"
  notes           text,
  created_at      timestamptz default now()
);

-- ── 15. WASTE LOG ───────────────────────────────────────────────────
create table if not exists restaurant_waste_log (
  id            uuid primary key default gen_random_uuid(),
  owner_id      uuid not null references auth.users(id) on delete cascade,
  location_id   uuid references pos_locations(id) on delete set null,
  menu_item_id  uuid references restaurant_menu_items(id) on delete set null,
  item_name     text not null,
  qty           decimal(8,2) default 1,
  unit          text default 'portion',            -- "portion" | "kg" | "litre"
  cost_per_unit decimal(10,2) default 0,
  total_cost    decimal(10,2) default 0,
  reason        text,                             -- "expired" | "dropped" | "overcooked" | "returned"
  logged_by     uuid references pos_staff(id) on delete set null,
  created_at    timestamptz default now()
);

-- ── INDEXES ─────────────────────────────────────────────────────────
create index if not exists idx_restaurant_tables_owner    on restaurant_tables(owner_id);
create index if not exists idx_restaurant_tables_status   on restaurant_tables(status);
create index if not exists idx_restaurant_menu_items_cat  on restaurant_menu_items(category_id);
create index if not exists idx_restaurant_menu_items_owner on restaurant_menu_items(owner_id);
create index if not exists idx_restaurant_orders_owner    on restaurant_orders(owner_id);
create index if not exists idx_restaurant_orders_status   on restaurant_orders(status);
create index if not exists idx_restaurant_orders_table    on restaurant_orders(table_id);
create index if not exists idx_restaurant_orders_created  on restaurant_orders(created_at desc);
create index if not exists idx_restaurant_order_items_ord on restaurant_order_items(order_id);
create index if not exists idx_restaurant_ktickets_owner  on restaurant_kitchen_tickets(owner_id);
create index if not exists idx_restaurant_ktickets_status on restaurant_kitchen_tickets(status);
create index if not exists idx_restaurant_labor_owner     on restaurant_labor_shifts(owner_id);
create index if not exists idx_restaurant_labor_status    on restaurant_labor_shifts(status);
create index if not exists idx_restaurant_86_owner        on restaurant_eighty_six(owner_id);
create index if not exists idx_restaurant_online_owner    on restaurant_online_orders(owner_id);
create index if not exists idx_restaurant_reservations_at on restaurant_reservations(reserved_at);

-- ── ROW LEVEL SECURITY ──────────────────────────────────────────────
alter table restaurant_tables                enable row level security;
alter table restaurant_menu_categories       enable row level security;
alter table restaurant_menu_items            enable row level security;
alter table restaurant_modifier_groups       enable row level security;
alter table restaurant_modifiers             enable row level security;
alter table restaurant_item_modifier_groups  enable row level security;
alter table restaurant_orders                enable row level security;
alter table restaurant_order_items           enable row level security;
alter table restaurant_order_item_modifiers  enable row level security;
alter table restaurant_kitchen_tickets       enable row level security;
alter table restaurant_labor_shifts          enable row level security;
alter table restaurant_eighty_six            enable row level security;
alter table restaurant_online_orders         enable row level security;
alter table restaurant_reservations          enable row level security;
alter table restaurant_waste_log             enable row level security;

-- Owner-only RLS policies
do $$ declare t text; begin
  foreach t in array array[
    'restaurant_tables','restaurant_menu_categories','restaurant_menu_items',
    'restaurant_modifier_groups','restaurant_modifiers','restaurant_orders',
    'restaurant_order_items','restaurant_kitchen_tickets','restaurant_labor_shifts',
    'restaurant_eighty_six','restaurant_online_orders','restaurant_reservations',
    'restaurant_waste_log'
  ] loop
    execute format(
      'drop policy if exists "owner_rls_%s" on %s',
      t, t
    );
    execute format(
      'create policy "owner_rls_%s" on %s using (owner_id = auth.uid())',
      t, t
    );
  end loop;
end $$;

-- item_modifier_groups uses item's owner — allow via service role only
drop policy if exists "owner_rls_item_modifier_groups" on restaurant_item_modifier_groups;
create policy "owner_rls_item_modifier_groups"
  on restaurant_item_modifier_groups
  using (
    item_id in (select id from restaurant_menu_items where owner_id = auth.uid())
  );

drop policy if exists "owner_rls_order_item_modifiers" on restaurant_order_item_modifiers;
create policy "owner_rls_order_item_modifiers"
  on restaurant_order_item_modifiers
  using (
    order_item_id in (select id from restaurant_order_items where owner_id = auth.uid())
  );
