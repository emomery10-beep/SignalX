-- ============================================================
-- Migration 044 — Fix signup trigger ("Database error saving new user")
--
-- Root issue: handle_new_user or create_free_subscription was
-- raising an unhandled exception, causing Supabase GoTrue to
-- return "Database error saving new user" for ALL auth methods.
--
-- Fix: add ON CONFLICT + EXCEPTION handling so auth never fails
-- even if the profile/subscription insert hits a constraint.
-- ============================================================

-- ── 1. HARDENED handle_new_user ──────────────────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;   -- safe if user already exists (e.g. email re-confirm)
  return new;
exception when others then
  -- Never block auth. Log and continue.
  raise warning 'handle_new_user failed for user %: % (%)', new.id, sqlerrm, sqlstate;
  return new;
end;
$$;

-- ── 2. HARDENED create_free_subscription ─────────────────────
-- Ensure 'free' plan exists before the FK fires
insert into public.plans (id, name, tagline, price_monthly, question_limit, features, sort_order)
values ('free', 'Free', 'Get started', 0, 10, array['10 AI questions per month'], 1)
on conflict (id) do nothing;

create or replace function public.create_free_subscription()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.subscriptions (user_id, plan_id, status)
  values (new.id, 'free', 'active')
  on conflict do nothing;
  return new;
exception when others then
  raise warning 'create_free_subscription failed for user %: % (%)', new.id, sqlerrm, sqlstate;
  return new;
end;
$$;

-- ── 3. Recreate triggers (idempotent) ────────────────────────
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

drop trigger if exists on_user_created_subscription on public.profiles;
create trigger on_user_created_subscription
  after insert on public.profiles
  for each row execute procedure public.create_free_subscription();

-- ── 4. Backfill any auth users that have no profile yet ──────
-- (catches users who tried to sign up and got the error)
insert into public.profiles (id, full_name)
select
  au.id,
  coalesce(au.raw_user_meta_data->>'full_name', split_part(au.email, '@', 1))
from auth.users au
where not exists (select 1 from public.profiles p where p.id = au.id)
on conflict (id) do nothing;

-- Backfill missing subscriptions for any existing profiles
insert into public.subscriptions (user_id, plan_id, status)
select p.id, 'free', 'active'
from public.profiles p
where not exists (select 1 from public.subscriptions s where s.user_id = p.id)
on conflict do nothing;
