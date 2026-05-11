-- ── NOTIFICATIONS ─────────────────────────────────────────────────────────────
-- Central inbox for alerts, shipment events, AI insights, system messages.
create table if not exists public.notifications (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users on delete cascade,
  type        text not null check (type in ('alert','shipment','insight','brief','system')),
  title       text not null,
  body        text not null,
  metadata    jsonb default '{}',
  read_at     timestamptz,
  created_at  timestamptz default now()
);

create index if not exists idx_notifications_user
  on public.notifications(user_id, created_at desc);

alter table public.notifications enable row level security;

create policy "Own notifications"
  on public.notifications for all
  using (user_id = auth.uid());
