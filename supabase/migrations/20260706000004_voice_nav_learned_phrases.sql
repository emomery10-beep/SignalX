-- ============================================================
-- Voice-nav learning cache: a SHARED, ANONYMOUS, AGGREGATE table of
-- human-confirmed transcript->route mappings. Populated only when a user
-- explicitly clicks "Yes" on a low-confidence voice-nav "did you mean"
-- popover (see app/api/voice-nav/confirm/route.ts). This is the SAME
-- category of data as VALID_ROUTES in lib/voiceRoutes.ts -- a public,
-- non-personal, aggregate usage signal -- NOT user activity history.
--
-- Hard privacy invariants enforced by this schema (do not weaken without a
-- deliberate, separate privacy sign-off):
--   * NO user_id / owner_id / session_id / ip / device_id / request_id column
--     of any kind, anywhere in this table.
--   * NO foreign key to auth.users, profiles, or any other identity-bearing
--     table. The only "identity" column is `id`, a gen_random_uuid() value
--     generated independently per row, never derived from or equal to any
--     user/session identifier, and never returned to any client.
--   * RLS enabled with ZERO policies for anon/authenticated -- default-deny.
--     Only the service-role client (lib/supabase/server.ts's
--     createServiceClient(), which bypasses RLS by design) may ever read or
--     write this table. It must never be reachable from a client-side
--     (anon-key) Supabase call. If a future migration ever adds a policy
--     here, that is a deliberate scope change requiring its own privacy
--     review -- do not add one casually.
--   * The row is inherently many-to-one: (phrase_key, language) is UNIQUE,
--     so a row confirmed 500 times by 500 different people is exactly one
--     row with hit_count = 500, indistinguishable from one person confirming
--     it 500 times. There is no per-event/per-confirmation row at all.
--
-- Idempotent: safe to re-run against a database that already has this table
-- (create-if-not-exists table/index, create-or-replace function).
-- ============================================================

create table if not exists public.voice_nav_learned_phrases (
  id           uuid primary key default gen_random_uuid(),
  phrase_key   text not null,                 -- normalized transcript, see lib/voiceLearning.ts normalizePhrase()
  language     text not null,                 -- one of: en, fr, es, nl, de, sw (app-level enforced, see below)
  route        text not null,                 -- must be one of VALID_ROUTE_PATHS at write time (app-level enforced; no FK, no routes table exists)
  hit_count    integer not null default 1,    -- incremented on repeat confirmation of the same (phrase_key, language) for the SAME route; see tie-break rule in the function below
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  constraint voice_nav_learned_phrases_phrase_lang_key unique (phrase_key, language)
);

comment on table public.voice_nav_learned_phrases is
  'Anonymous aggregate cache of human-confirmed voice-nav transcript->route mappings. No user/session/IP linkage of any kind -- see migration header for the privacy invariants this table must uphold. Written and read exclusively via the service-role client from app/api/voice-nav/route.ts and app/api/voice-nav/confirm/route.ts.';

comment on column public.voice_nav_learned_phrases.phrase_key is
  'Output of lib/voiceLearning.ts normalizePhrase() applied to an already-sanitized transcript. Not the raw transcript verbatim, but the normalized text content itself (not hashed) -- the privacy property protected here is unlinkability to a person/session/request, not secrecy of the phrase content, which is conceptually public in the same sense route labels are.';

-- Fast-path lookup is `WHERE phrase_key = $1 ORDER BY hit_count DESC LIMIT 1`
-- (no language filter -- language is only known once a row is found). This
-- index covers that access pattern directly.
create index if not exists voice_nav_learned_phrases_lookup_idx
  on public.voice_nav_learned_phrases (phrase_key, hit_count desc);

-- Few-shot example selection is `ORDER BY hit_count DESC LIMIT 15/20 WHERE hit_count >= 2`.
create index if not exists voice_nav_learned_phrases_hit_count_idx
  on public.voice_nav_learned_phrases (hit_count desc);

alter table public.voice_nav_learned_phrases enable row level security;
-- Default-deny: intentionally ZERO policies for anon/authenticated roles.
-- See migration header for why "no policy" is preferred over a
-- perpetually-false policy: it is a more legible, greppable invariant.

-- ------------------------------------------------------------------
-- Atomic upsert with the tie-break rule baked in. security definer so it can
-- write to a table that has no policies for the calling role; only
-- service_role gets EXECUTE (never anon/authenticated), and this function
-- does nothing but write to this one RLS-locked-down table.
--
-- TIE-BREAK RULE (final, single rule): when (phrase_key, language) already
-- exists:
--   * If the new confirmation is for the SAME route as the existing row:
--     reinforce it -- hit_count = hit_count + 1.
--   * If the new confirmation is for a DIFFERENT route:
--       - If the existing row's hit_count <= 1 (i.e. the incumbent has never
--         been reconfirmed -- it was written once and nothing since agreed
--         with it), the challenger DISPLACES it: route is overwritten and
--         hit_count resets to 1 (the new route's first confirmation).
--       - If the existing row's hit_count >= 2 (the incumbent has been
--         independently reconfirmed at least once), the conflicting
--         confirmation is DROPPED silently -- route and hit_count are left
--         untouched, updated_at is not bumped. The incumbent can only ever
--         be displaced by first decaying back to hit_count 1, which cannot
--         happen via this function (hit_count never decreases), so in
--         practice an established (>=2) mapping is stable and requires
--         sustained, independent, rate-limited re-confirmation pressure
--         under a different phrase/language pairing to ever change, which
--         does not happen here -- a genuinely stale established mapping is a
--         product/data-quality issue to fix via manual intervention, not
--         something a single new user click should silently override.
--
-- Justification for this rule over pure "newest wins": since this cache is
-- shared, a successful poisoning write affects every future user who says
-- something similar, not just the attacker. Requiring the incumbent to be
-- unreinforced (hit_count <= 1) before a challenger can take over means a
-- genuinely first-time-wrong classification is still cheaply, instantly
-- correctable (the common, benign case), while an established mapping
-- cannot be silently flipped by any single new confirmation -- exactly the
-- shared-blast-radius property that needs protecting -- without requiring
-- any additional counters, sub-rows, or weighted-voting scheme.
-- ------------------------------------------------------------------
create or replace function public.upsert_voice_nav_learned_phrase(
  p_phrase_key text,
  p_language   text,
  p_route      text
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_existing_route     text;
  v_existing_hit_count integer;
begin
  select route, hit_count
    into v_existing_route, v_existing_hit_count
    from public.voice_nav_learned_phrases
   where phrase_key = p_phrase_key
     and language = p_language
   for update;

  if not found then
    insert into public.voice_nav_learned_phrases (phrase_key, language, route, hit_count, created_at, updated_at)
    values (p_phrase_key, p_language, p_route, 1, now(), now());
    return;
  end if;

  if v_existing_route = p_route then
    update public.voice_nav_learned_phrases
       set hit_count = v_existing_hit_count + 1,
           updated_at = now()
     where phrase_key = p_phrase_key
       and language = p_language;
  elsif v_existing_hit_count <= 1 then
    update public.voice_nav_learned_phrases
       set route = p_route,
           hit_count = 1,
           updated_at = now()
     where phrase_key = p_phrase_key
       and language = p_language;
  end if;
  -- else: established (hit_count >= 2) incumbent under a different route --
  -- silently drop the conflicting confirmation, no row change at all.
end;
$$;

revoke all on function public.upsert_voice_nav_learned_phrase(text, text, text) from public;
grant execute on function public.upsert_voice_nav_learned_phrase(text, text, text) to service_role;

-- ------------------------------------------------------------------
-- Fast-path hit-count increment, used ONLY when the fast-path lookup found a
-- trusted (hit_count >= 2) match and is about to serve it. Fire-and-forget
-- from the caller -- this function's own success/failure never affects the
-- response already being returned to the user.
-- ------------------------------------------------------------------
create or replace function public.increment_voice_nav_hit_count(
  p_phrase_key text,
  p_language   text
) returns void
language sql
security definer
set search_path = public
as $$
  update public.voice_nav_learned_phrases
     set hit_count = hit_count + 1,
         updated_at = now()
   where phrase_key = p_phrase_key
     and language = p_language;
$$;

revoke all on function public.increment_voice_nav_hit_count(text, text) from public;
grant execute on function public.increment_voice_nav_hit_count(text, text) to service_role;
