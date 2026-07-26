-- ── SPOTLIGHT ADVERTISING UPGRADE ───────────────────────────────────────
-- Turns business_spotlights from a free, untracked, indefinite listing into
-- a real advertising product: a banner creative, an explicit terms-of-use
-- acceptance gate, admin-recorded deal terms (price/duration), basic
-- impression/click counters, and an optional expiry. All new columns are
-- nullable/zero-defaulted so existing approved rows (submitted under the
-- old free flow) keep working unchanged — nothing here is retroactively
-- enforced on them.
alter table public.business_spotlights
  add column if not exists banner_url        text,
  add column if not exists price_tier         text,
  add column if not exists amount_charged     numeric,
  add column if not exists currency           text,
  add column if not exists duration_days      integer,
  add column if not exists starts_at          timestamptz,
  add column if not exists ends_at            timestamptz,
  add column if not exists terms_accepted_at  timestamptz,
  add column if not exists terms_version      text,
  add column if not exists impressions        integer not null default 0,
  add column if not exists clicks             integer not null default 0;

-- Public carousel query (app/api/spotlight/public) now also needs to skip
-- expired placements — ends_at is null for anything with no agreed
-- duration (the old free flow, or an open-ended deal), so this is additive
-- to the existing status/is_active filter, not a replacement for it.
create index if not exists idx_business_spotlights_ends_at on public.business_spotlights (ends_at);

-- ── ADVERTISE INQUIRIES: explicit marketing consent ─────────────────────
-- POPIA §69 and Nigeria's NDPA both require opt-in consent captured before
-- first marketing contact, not implied from form submission alone. This
-- records that the visitor explicitly ticked a (default-unchecked) consent
-- box, distinct from consenting to be contacted about their own inquiry.
alter table public.advertise_inquiries
  add column if not exists consent_at timestamptz;

-- ── ATOMIC IMPRESSION/CLICK COUNTERS ─────────────────────────────────────
-- security definer so the counter can be bumped without granting the
-- caller UPDATE on the whole table; called only from the server-side
-- service-role client (app/api/spotlight/track), never from browser JS
-- directly, so — unlike the PUBLIC-EXECUTE gotcha from the 2026-07-20
-- security audit — this is deliberately NOT granted to anon/authenticated.
create or replace function public.increment_spotlight_metric(p_id uuid, p_metric text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_metric = 'impression' then
    update public.business_spotlights set impressions = impressions + 1 where id = p_id;
  elsif p_metric = 'click' then
    update public.business_spotlights set clicks = clicks + 1 where id = p_id;
  end if;
end;
$$;

revoke all on function public.increment_spotlight_metric(uuid, text) from public;
revoke all on function public.increment_spotlight_metric(uuid, text) from anon;
revoke all on function public.increment_spotlight_metric(uuid, text) from authenticated;
