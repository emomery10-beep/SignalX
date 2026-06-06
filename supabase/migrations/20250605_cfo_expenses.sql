-- CFO Expenses table
-- Stores manually-entered and receipt-scanned expenses for the CFO Expenses tab

create table if not exists cfo_expenses (
  id           uuid          primary key default gen_random_uuid(),
  user_id      uuid          not null references auth.users(id) on delete cascade,
  vendor       text          not null,
  date         date          not null,
  amount       numeric(12,2) not null,
  category     text          not null default 'Other',
  notes        text,
  receipt_url  text,
  created_at   timestamptz   not null default now()
);

alter table cfo_expenses enable row level security;

-- Users can only see and modify their own expenses
drop policy if exists "Users own their expenses" on cfo_expenses;
create policy "Users own their expenses"
  on cfo_expenses for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists cfo_expenses_user_date_idx on cfo_expenses (user_id, date desc);
