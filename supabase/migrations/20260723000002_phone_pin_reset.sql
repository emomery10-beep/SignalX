-- Self-service phone-PIN reset. Until now the only recovery path was
-- fully manual: a locked-out user was told to email/WhatsApp support, and
-- an admin generated a temp PIN by hand and relayed it out of band (see
-- app/api/admin/route.ts action=reset_pin). This adds a real "forgot PIN"
-- flow, verified over WhatsApp (lib/whatsapp.ts's sendOTP, already built
-- but previously unused).
--
-- phone_pin_identities is deliberately its OWN table rather than reusing
-- profiles.phone: that column is a general, user-editable contact field
-- (see app/api/profile/route.ts PATCH's allowlist) with no uniqueness
-- guarantee, so it cannot safely answer "which account owns this login
-- phone". This table is written only at phone-pin signup (and backfilled
-- below) and is never touched by unrelated settings writes, so a phone
-- number can map to at most one account by construction.
create table if not exists phone_pin_identities (
  phone      text primary key,
  user_id    uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
create unique index if not exists phone_pin_identities_user_id_idx on phone_pin_identities(user_id);

alter table phone_pin_identities enable row level security;
drop policy if exists "no direct client access" on phone_pin_identities;
create policy "no direct client access" on phone_pin_identities
  for all using (false);

-- Backfill existing phone-pin accounts (created before this table existed).
-- Restricted to the synthetic-email domain so this can never pick up a
-- stray "phone" metadata field from an unrelated signup path (e.g. OAuth).
-- Matches the phone value lib/phone-auth.ts's phoneToSyntheticEmail()
-- already derived it from, so it's the exact same identity, not a guess.
insert into phone_pin_identities (phone, user_id)
select u.raw_user_meta_data->>'phone', u.id
from auth.users u
where u.email like '%@phone.askbiz.internal'
  and u.raw_user_meta_data->>'phone' is not null
on conflict (phone) do nothing;

-- One row per phone: a fresh request overwrites (invalidates) any code
-- still outstanding for that number. code_hash is sha256(code) — like
-- PINs themselves, the raw code is never persisted.
create table if not exists phone_pin_resets (
  phone      text primary key,
  code_hash  text not null,
  attempts   int not null default 0,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

alter table phone_pin_resets enable row level security;
drop policy if exists "no direct client access" on phone_pin_resets;
create policy "no direct client access" on phone_pin_resets
  for all using (false);
