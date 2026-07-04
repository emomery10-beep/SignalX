-- ============================================================
-- POS staff drafts ("ghost" team members)
-- During the pre-payment setup flow the owner builds their team.
-- Drafts are NOT real pos_staff rows, so they don't consume seats or
-- hit the sell gate before payment. On payment they're provisioned into
-- real pos_staff accounts (up to the seats paid for) and deleted.
-- PIN is hashed at draft time (same scrypt as pos_staff) — never stored
-- in plaintext.
-- ============================================================

create table if not exists public.pos_staff_drafts (
  id         uuid primary key default gen_random_uuid(),
  owner_id   uuid not null references auth.users(id) on delete cascade,
  name       text not null,
  role       text not null default 'cashier',
  phone      text,
  email      text,
  pin_hash   text not null,
  created_at timestamptz default now(),
  -- same "at least one login identifier" rule as pos_staff
  constraint pos_staff_drafts_contact_required check (phone is not null or email is not null)
);

alter table public.pos_staff_drafts enable row level security;

drop policy if exists "Owner manages staff drafts" on public.pos_staff_drafts;
create policy "Owner manages staff drafts"
  on public.pos_staff_drafts for all using (auth.uid() = owner_id);

create index if not exists idx_staff_drafts_owner on public.pos_staff_drafts(owner_id);
