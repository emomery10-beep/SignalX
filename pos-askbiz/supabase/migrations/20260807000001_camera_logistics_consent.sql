-- ============================================================
-- Migration: camera/logistics consent columns + full consent
-- audit trail (grant AND revoke) across all 6 consent purposes.
--
-- Context: Settings → Privacy already renders 4 toggles (data,
-- training, camera, logistics) but only data_consent/training_consent
-- have ever had a column. camera_consent/logistics_consent were
-- UI-only — GET /api/consent never returned them (frontend fell back
-- to a hardcoded `true`) and POST silently dropped them, so toggling
-- either off had no effect and always reset to "granted" on reload.
--
-- Separately, collective_opt_in/market_intelligence_opt_in (018_pos.sql,
-- 035_market_intelligence.sql) are written directly from the client
-- (Settings → Compliance) and never touch consent_log, so they aren't
-- demonstrable server-side the way data_consent/training_consent are.
--
-- And update_consent() only ever logged grants, never revokes, so
-- withdrawal wasn't demonstrable either (GDPR Art 7(3) — as easy to
-- withdraw as to give, and it must be provable either way).
--
-- SECURITY NOTE (caught in review before this ever ran): an earlier
-- draft of this migration used create-or-replace with a NEW parameter
-- list (6 optional params vs the live function's 4). Postgres matches
-- function identity by name + parameter TYPE signature, so that would
-- NOT have replaced the live, correctly-guarded 4-param update_consent
-- from 20260724000001_apply_missing_consent_financial_schema.sql — it
-- would have created a SECOND, separate overload, missing that
-- function's `auth.uid() = p_user_id` ownership check and its explicit
-- `revoke ... from public / grant ... to authenticated` lockdown.
-- Default Postgres behavior grants EXECUTE on a new function to PUBLIC,
-- which on Supabase means the anon role — i.e. anyone with the public
-- anon key (shipped in every page bundle) could have called the new
-- overload directly via POST /rest/v1/rpc/update_consent with an
-- arbitrary p_user_id and forged another user's consent state and
-- consent_log entries, entirely bypassing app/api/consent/route.ts.
-- Fixed below by dropping the old signature (avoiding two coexisting
-- overloads with overlapping optional-parameter footprints, which is
-- its own source of ambiguous-resolution risk) and carrying the
-- ownership check + search_path hardening + privilege lockdown forward
-- onto the new signature before this migration is ever applied.
-- ============================================================

-- ── ADD MISSING CONSENT COLUMNS ────────────────────────────────
alter table public.profiles
  add column if not exists camera_consent       boolean default false,
  add column if not exists camera_consent_at    timestamptz,
  add column if not exists logistics_consent    boolean default false,
  add column if not exists logistics_consent_at timestamptz;

comment on column public.profiles.camera_consent is
  'User explicitly consented to camera-based AI scanning (products, receipts, documents, plates). Column added 2026-08-07 — the Settings toggle existed before this with no backing column.';
comment on column public.profiles.logistics_consent is
  'User explicitly consented to logistics data processing (parcel tracking, vehicle inspections, driver GPS location). Column added 2026-08-07 — the Settings toggle existed before this with no backing column.';

-- ── DROP the old 4-param signature ─────────────────────────────
-- Superseded by the 6-optional-param version below, which is a strict
-- superset (coalesce-based, so a 2-field call behaves identically to
-- the old function). Dropping it avoids two live overloads whose
-- optional-parameter footprints overlap.
drop function if exists public.update_consent(uuid, boolean, boolean, text);

-- ── update_consent: full 6-purpose coverage + grant/revoke logging ──
-- All consent params (other than p_user_id) default to null and are
-- applied via coalesce, so:
--   * A caller can update just one purpose without wiping the others.
--   * Existing callers (pos-askbiz's /api/consent, which only ever sent
--     data_consent/training_consent before this migration) keep working —
--     the 4 new params they don't send simply stay null and touch nothing.
-- A consent_log row is written for EVERY purpose whose value actually
-- changes versus the prior row (comparing old vs new), covering both
-- granted and revoked transitions, not just grants.
create or replace function public.update_consent(
  p_user_id                    uuid,
  p_data_consent               boolean default null,
  p_training_consent           boolean default null,
  p_camera_consent             boolean default null,
  p_logistics_consent          boolean default null,
  p_collective_opt_in          boolean default null,
  p_market_intelligence_opt_in boolean default null,
  p_ip_hash                    text default null
) returns jsonb language plpgsql security definer set search_path = 'public' as $$
declare
  v_before public.profiles%rowtype;
begin
  if auth.uid() is distinct from p_user_id then
    raise exception 'not authorized to update consent for this user';
  end if;

  select * into v_before from public.profiles where id = p_user_id;
  if not found then
    return jsonb_build_object('success', false, 'error', 'profile not found');
  end if;

  update public.profiles set
    data_consent                 = coalesce(p_data_consent, data_consent),
    training_consent             = coalesce(p_training_consent, training_consent),
    camera_consent                = coalesce(p_camera_consent, camera_consent),
    logistics_consent             = coalesce(p_logistics_consent, logistics_consent),
    collective_opt_in             = coalesce(p_collective_opt_in, collective_opt_in),
    market_intelligence_opt_in    = coalesce(p_market_intelligence_opt_in, market_intelligence_opt_in),
    data_consent_at               = case when p_data_consent is not null and p_data_consent is distinct from v_before.data_consent then now() else data_consent_at end,
    training_consent_at           = case when p_training_consent is not null and p_training_consent is distinct from v_before.training_consent then now() else training_consent_at end,
    camera_consent_at             = case when p_camera_consent is not null and p_camera_consent is distinct from v_before.camera_consent then now() else camera_consent_at end,
    logistics_consent_at          = case when p_logistics_consent is not null and p_logistics_consent is distinct from v_before.logistics_consent then now() else logistics_consent_at end,
    collective_opted_at           = case when p_collective_opt_in is not null and p_collective_opt_in is distinct from v_before.collective_opt_in then now() else collective_opted_at end,
    market_intelligence_opted_at  = case when p_market_intelligence_opt_in is not null and p_market_intelligence_opt_in is distinct from v_before.market_intelligence_opt_in then now() else market_intelligence_opted_at end,
    consent_ip_hash               = coalesce(p_ip_hash, consent_ip_hash)
  where id = p_user_id;

  if p_data_consent is not null and p_data_consent is distinct from v_before.data_consent then
    insert into public.consent_log (user_id, consent_type, action, ip_hash)
    values (p_user_id, 'data_consent', case when p_data_consent then 'granted' else 'revoked' end, p_ip_hash);
  end if;
  if p_training_consent is not null and p_training_consent is distinct from v_before.training_consent then
    insert into public.consent_log (user_id, consent_type, action, ip_hash)
    values (p_user_id, 'training_consent', case when p_training_consent then 'granted' else 'revoked' end, p_ip_hash);
  end if;
  if p_camera_consent is not null and p_camera_consent is distinct from v_before.camera_consent then
    insert into public.consent_log (user_id, consent_type, action, ip_hash)
    values (p_user_id, 'camera_consent', case when p_camera_consent then 'granted' else 'revoked' end, p_ip_hash);
  end if;
  if p_logistics_consent is not null and p_logistics_consent is distinct from v_before.logistics_consent then
    insert into public.consent_log (user_id, consent_type, action, ip_hash)
    values (p_user_id, 'logistics_consent', case when p_logistics_consent then 'granted' else 'revoked' end, p_ip_hash);
  end if;
  if p_collective_opt_in is not null and p_collective_opt_in is distinct from v_before.collective_opt_in then
    insert into public.consent_log (user_id, consent_type, action, ip_hash)
    values (p_user_id, 'collective_opt_in', case when p_collective_opt_in then 'granted' else 'revoked' end, p_ip_hash);
  end if;
  if p_market_intelligence_opt_in is not null and p_market_intelligence_opt_in is distinct from v_before.market_intelligence_opt_in then
    insert into public.consent_log (user_id, consent_type, action, ip_hash)
    values (p_user_id, 'market_intelligence_opt_in', case when p_market_intelligence_opt_in then 'granted' else 'revoked' end, p_ip_hash);
  end if;

  return jsonb_build_object('success', true);
end;
$$;

-- Same lockdown pattern as the function this supersedes: only the
-- `authenticated` role may call it (not anon, not public generally),
-- and the ownership check above still applies on top of that even for
-- authenticated callers — defense in depth, not either/or.
revoke all on function public.update_consent(uuid, boolean, boolean, boolean, boolean, boolean, boolean, text) from public;
grant execute on function public.update_consent(uuid, boolean, boolean, boolean, boolean, boolean, boolean, text) to authenticated;

notify pgrst, 'reload schema';
