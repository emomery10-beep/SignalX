-- ============================================================
-- AskBiz Migration 021 — POS staff email login
-- Makes phone optional, adds email as alternative contact
-- ============================================================

alter table public.pos_staff
  alter column phone drop not null,
  add column if not exists email text;

-- Unique constraint for email per owner
create unique index if not exists pos_staff_owner_email_unique
  on public.pos_staff (owner_id, email)
  where email is not null;

-- At least one contact method required
alter table public.pos_staff
  drop constraint if exists pos_staff_contact_required,
  add constraint pos_staff_contact_required
    check (phone is not null or email is not null);
