-- ============================================================
-- SignalX Migration 006 — IP Fraud Prevention
-- Tracks registration IPs to prevent free tier abuse
-- ============================================================

-- ── IP REGISTRY ──────────────────────────────────────────────
create table if not exists public.ip_registry (
  id            uuid primary key default gen_random_uuid(),
  ip_hash       text not null,           -- SHA256 of IP — never store raw IP (GDPR)
  ip_country    text,
  first_seen_at timestamptz default now(),
  signup_count  int default 1,           -- how many signups from this IP
  last_signup_at timestamptz default now(),
  is_flagged    boolean default false,   -- manually flagged for review
  notes         text
);

create unique index if not exists idx_ip_registry_hash on public.ip_registry(ip_hash);
create index if not exists idx_ip_registry_flagged on public.ip_registry(is_flagged);

-- ── LINK USER TO IP ───────────────────────────────────────────
alter table public.profiles 
  add column if not exists registration_ip_hash text,
  add column if not exists registration_country text,
  add column if not exists is_suspicious boolean default false;

-- ── FUNCTION: check and record signup IP ─────────────────────
create or replace function public.record_signup_ip(
  p_user_id uuid,
  p_ip_hash text,
  p_country text default null
) returns jsonb language plpgsql security definer as $$
declare
  v_existing record;
  v_is_suspicious boolean := false;
  v_signup_count int := 1;
begin
  -- Check existing record for this IP
  select * into v_existing from public.ip_registry where ip_hash = p_ip_hash;

  if found then
    v_signup_count := v_existing.signup_count + 1;

    -- Flag if more than 3 signups from same IP
    if v_signup_count > 3 then
      v_is_suspicious := true;
    end if;

    -- Update registry
    update public.ip_registry set
      signup_count = v_signup_count,
      last_signup_at = now(),
      is_flagged = v_is_suspicious or v_existing.is_flagged
    where ip_hash = p_ip_hash;
  else
    -- First signup from this IP
    insert into public.ip_registry (ip_hash, ip_country, signup_count)
    values (p_ip_hash, p_country, 1)
    on conflict (ip_hash) do nothing;
  end if;

  -- Link to user profile
  update public.profiles set
    registration_ip_hash = p_ip_hash,
    registration_country = p_country,
    is_suspicious = v_is_suspicious
  where id = p_user_id;

  return jsonb_build_object(
    'signup_count', v_signup_count,
    'is_suspicious', v_is_suspicious,
    'action', case
      when v_is_suspicious then 'flag'
      else 'allow'
    end
  );
end;
$$;

-- ── DEVICE FINGERPRINTS (browser-level abuse prevention) ─────
create table if not exists public.device_fingerprints (
  id            uuid primary key default gen_random_uuid(),
  fingerprint   text not null unique,    -- canvas/audio fingerprint hash
  user_id       uuid references auth.users on delete set null,
  signup_count  int default 1,
  first_seen_at timestamptz default now(),
  last_seen_at  timestamptz default now(),
  is_blocked    boolean default false
);

create index if not exists idx_device_fp on public.device_fingerprints(fingerprint);

-- ── FREE ACCOUNT COOLDOWN ─────────────────────────────────────
-- Prevent same email domain from signing up more than 10 times
create table if not exists public.email_domain_registry (
  id           uuid primary key default gen_random_uuid(),
  domain       text not null unique,
  signup_count int default 1,
  is_blocked   boolean default false,
  notes        text,
  updated_at   timestamptz default now()
);

-- ── ADMIN VIEW: suspicious accounts ──────────────────────────
create or replace view public.suspicious_accounts as
select 
  p.id,
  p.full_name,
  p.registration_country,
  p.is_suspicious,
  p.plan_id,
  p.created_at,
  ir.signup_count as ip_signup_count,
  ir.is_flagged as ip_flagged
from public.profiles p
left join public.ip_registry ir on ir.ip_hash = p.registration_ip_hash
where p.is_suspicious = true or ir.is_flagged = true
order by p.created_at desc;

-- ── RLS ──────────────────────────────────────────────────────
alter table public.ip_registry           enable row level security;
alter table public.device_fingerprints   enable row level security;
alter table public.email_domain_registry enable row level security;

-- Only service role can read/write these (no user access)
create policy "Service only ip_registry"           on public.ip_registry           for all using (false);
create policy "Service only device_fingerprints"   on public.device_fingerprints   for all using (false);
create policy "Service only email_domain_registry" on public.email_domain_registry for all using (false);
