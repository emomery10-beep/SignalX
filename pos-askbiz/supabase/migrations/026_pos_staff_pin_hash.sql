-- ============================================================
-- AskBiz Migration 026 — POS staff PIN hashing
-- Adds pin_hash field for secure PIN storage
-- ============================================================

-- Add pin_hash column (remove old plain-text pin column)
alter table public.pos_staff
  drop column if exists pin,
  add column if not exists pin_hash text;

-- Index for quick lookups by email (used in auth flow)
create index if not exists idx_pos_staff_email
  on public.pos_staff (email)
  where email is not null;

-- Index for quick lookups by owner_id
create index if not exists idx_pos_staff_owner
  on public.pos_staff (owner_id);
