-- ============================================================
-- AskBiz Migration 023 — POS schema verification & fixes
-- Ensures all POS tables are properly configured with RLS
-- Idempotent: safe to run multiple times
-- ============================================================

-- Verify pos_staff table structure
-- If pos_staff exists, ensure all columns are present
do $$
begin
  -- Ensure email column exists (from migration 021)
  if not exists(
    select 1 from information_schema.columns
    where table_name = 'pos_staff' and column_name = 'email'
  ) then
    alter table public.pos_staff add column email text;

    -- Add unique index for email if it doesn't exist
    if not exists(
      select 1 from pg_indexes
      where indexname = 'pos_staff_owner_email_unique'
    ) then
      create unique index pos_staff_owner_email_unique
        on public.pos_staff (owner_id, email)
        where email is not null;
    end if;

    -- Add constraint if it doesn't exist
    if not exists(
      select 1 from information_schema.table_constraints
      where table_name = 'pos_staff' and constraint_name = 'pos_staff_contact_required'
    ) then
      alter table public.pos_staff
        add constraint pos_staff_contact_required
          check (phone is not null or email is not null);
    end if;
  end if;
end $$;

-- Verify RLS is enabled on all POS tables
alter table public.pos_staff enable row level security;
alter table public.pos_customers enable row level security;
alter table public.inventory enable row level security;
alter table public.pos_transactions enable row level security;
alter table public.pos_items enable row level security;
alter table public.pos_otp enable row level security;
alter table public.inventory_restock enable row level security;
alter table public.market_benchmarks enable row level security;
alter table public.pos_image_recognition enable row level security;

-- Ensure RLS policies exist (drop and recreate to ensure they're correct)
drop policy if exists "Owner manages staff" on public.pos_staff;
create policy "Owner manages staff"
  on public.pos_staff for all using (auth.uid() = owner_id);

drop policy if exists "Owner manages customers" on public.pos_customers;
create policy "Owner manages customers"
  on public.pos_customers for all using (auth.uid() = owner_id);

drop policy if exists "Owner manages inventory" on public.inventory;
create policy "Owner manages inventory"
  on public.inventory for all using (auth.uid() = owner_id);

drop policy if exists "Owner manages transactions" on public.pos_transactions;
create policy "Owner manages transactions"
  on public.pos_transactions for all using (auth.uid() = owner_id);

drop policy if exists "Owner manages items" on public.pos_items;
create policy "Owner manages items"
  on public.pos_items for all using (
    transaction_id in (
      select id from public.pos_transactions where owner_id = auth.uid()
    )
  );

drop policy if exists "OTP insert open" on public.pos_otp;
create policy "OTP insert open"
  on public.pos_otp for insert with check (true);

drop policy if exists "OTP read own" on public.pos_otp;
create policy "OTP read own"
  on public.pos_otp for select using (true);

drop policy if exists "OTP update open" on public.pos_otp;
create policy "OTP update open"
  on public.pos_otp for update using (true);

drop policy if exists "Owner manages restock" on public.inventory_restock;
create policy "Owner manages restock"
  on public.inventory_restock for all using (auth.uid() = owner_id);

drop policy if exists "Benchmarks readable" on public.market_benchmarks;
create policy "Benchmarks readable"
  on public.market_benchmarks for select using (auth.role() = 'authenticated');

drop policy if exists "Owner manages image recognition" on public.pos_image_recognition;
create policy "Owner manages image recognition"
  on public.pos_image_recognition for all using (auth.uid() = owner_id);

-- Verify all indexes exist
create index if not exists idx_pos_staff_owner on public.pos_staff(owner_id);
create index if not exists idx_pos_staff_phone on public.pos_staff(phone);
create index if not exists idx_pos_customers_owner on public.pos_customers(owner_id);
create index if not exists idx_pos_customers_phone on public.pos_customers(owner_id, phone);
create index if not exists idx_inventory_owner on public.inventory(owner_id);
create index if not exists idx_inventory_active on public.inventory(owner_id, active);
create index if not exists idx_pos_tx_owner on public.pos_transactions(owner_id);
create index if not exists idx_pos_tx_cashier on public.pos_transactions(cashier_id);
create index if not exists idx_pos_tx_created on public.pos_transactions(owner_id, created_at desc);
create index if not exists idx_pos_items_tx on public.pos_items(transaction_id);
create index if not exists idx_pos_otp_phone on public.pos_otp(phone, expires_at);
create index if not exists idx_restock_inventory on public.inventory_restock(inventory_id);
create index if not exists idx_benchmarks_lookup on public.market_benchmarks(sector, region, metric, period);
create index if not exists idx_pos_image_owner_created on public.pos_image_recognition(owner_id, created_at desc);
