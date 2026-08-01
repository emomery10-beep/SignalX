-- ============================================================
-- Lets a user flag an AI answer in /ask as helpful or not, with
-- an optional comment. Insert-only from the client (own rows
-- only) — no dashboard reads this via RLS, only the admin API
-- (service role), matching the pos_trial_funnel_events pattern.
-- ============================================================

create table if not exists public.chat_message_feedback (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  conversation_id uuid references public.conversations(id) on delete set null,
  question        text not null,
  rating          text not null check (rating in ('helpful', 'not_helpful')),
  comment         text,
  created_at      timestamptz not null default now()
);

create index if not exists chat_message_feedback_user_idx
  on public.chat_message_feedback (user_id, created_at desc);
create index if not exists chat_message_feedback_rating_idx
  on public.chat_message_feedback (rating, created_at desc);

alter table public.chat_message_feedback enable row level security;

create policy "Users can log their own message feedback"
  on public.chat_message_feedback for insert
  with check (auth.uid() = user_id);
