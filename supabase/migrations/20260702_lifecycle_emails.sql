-- ============================================================
-- Lifecycle emails — welcome + re-engagement
-- One row per (user, email type); the unique constraint IS the
-- dedupe: the cron claims a row before sending, so a crashed or
-- concurrent run can never email the same person twice.
-- ============================================================

create table if not exists public.lifecycle_emails (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  email_type text not null check (email_type in ('welcome', 're_engagement')),
  sent_at    timestamptz default now(),
  unique (user_id, email_type)
);

create index if not exists idx_lifecycle_emails_user
  on public.lifecycle_emails (user_id);

-- Service-role only — no user-facing access needed.
alter table public.lifecycle_emails enable row level security;

-- Marketing consent. Welcome is a service message; the re-engagement
-- email is marketing and must respect this flag + the unsubscribe link.
alter table public.profiles
  add column if not exists marketing_emails boolean default true;
