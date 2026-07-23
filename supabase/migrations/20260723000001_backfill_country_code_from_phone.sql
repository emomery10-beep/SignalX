-- One-time backfill: derive profiles.country_code from the signup phone's
-- E.164 dial code for existing accounts that never got one. country_code
-- has only ever been written by onboarding's location-confirm step (added
-- 2026-07-17) and, as of this migration, by phone-PIN signup itself — so
-- pre-existing accounts (or anyone who hit "skip" during onboarding) are
-- stuck at null forever with no other path to fill it in. lib/get-currency.ts's
-- getUserLocale() already derives this at read time from the same phone
-- signal, but a few call sites (e.g. app/api/admin/route.ts's
-- registration_country column) read profiles.country_code directly, so
-- those stay null unless the column itself is backfilled.
--
-- Only ever sets country_code where it is currently null — never
-- overwrites a value onboarding or the user already set. Mirrors
-- countryFromPhone()'s longest-dial-prefix match in lib/geo/index.ts
-- (COUNTRY_DIAL), including its documented +1 tie-break (US wins over CA).
-- Read-only dry run before this migration was written: of 66 profiles
-- with a null country_code, 19 had any phone in auth.users metadata and
-- 18 resolved via a dial prefix — the rest are email/OAuth signups with
-- no phone at all, which this cannot help (matches lib/get-currency.ts's
-- own documented coverage limit).
update public.profiles p
set country_code = derived.country_code
from (
  select
    u.id,
    case
      when u.raw_user_meta_data->>'phone' like '+254%' then 'KE'
      when u.raw_user_meta_data->>'phone' like '+234%' then 'NG'
      when u.raw_user_meta_data->>'phone' like '+256%' then 'UG'
      when u.raw_user_meta_data->>'phone' like '+255%' then 'TZ'
      when u.raw_user_meta_data->>'phone' like '+233%' then 'GH'
      when u.raw_user_meta_data->>'phone' like '+250%' then 'RW'
      when u.raw_user_meta_data->>'phone' like '+260%' then 'ZM'
      when u.raw_user_meta_data->>'phone' like '+251%' then 'ET'
      when u.raw_user_meta_data->>'phone' like '+252%' then 'SO'
      when u.raw_user_meta_data->>'phone' like '+253%' then 'DJ'
      when u.raw_user_meta_data->>'phone' like '+263%' then 'ZW'
      when u.raw_user_meta_data->>'phone' like '+265%' then 'MW'
      when u.raw_user_meta_data->>'phone' like '+258%' then 'MZ'
      when u.raw_user_meta_data->>'phone' like '+353%' then 'IE'
      when u.raw_user_meta_data->>'phone' like '+351%' then 'PT'
      when u.raw_user_meta_data->>'phone' like '+358%' then 'FI'
      when u.raw_user_meta_data->>'phone' like '+971%' then 'AE'
      when u.raw_user_meta_data->>'phone' like '+27%'  then 'ZA'
      when u.raw_user_meta_data->>'phone' like '+44%'  then 'GB'
      when u.raw_user_meta_data->>'phone' like '+49%'  then 'DE'
      when u.raw_user_meta_data->>'phone' like '+33%'  then 'FR'
      when u.raw_user_meta_data->>'phone' like '+34%'  then 'ES'
      when u.raw_user_meta_data->>'phone' like '+39%'  then 'IT'
      when u.raw_user_meta_data->>'phone' like '+31%'  then 'NL'
      when u.raw_user_meta_data->>'phone' like '+32%'  then 'BE'
      when u.raw_user_meta_data->>'phone' like '+43%'  then 'AT'
      when u.raw_user_meta_data->>'phone' like '+91%'  then 'IN'
      when u.raw_user_meta_data->>'phone' like '+65%'  then 'SG'
      when u.raw_user_meta_data->>'phone' like '+61%'  then 'AU'
      when u.raw_user_meta_data->>'phone' like '+52%'  then 'MX'
      when u.raw_user_meta_data->>'phone' like '+55%'  then 'BR'
      when u.raw_user_meta_data->>'phone' like '+1%'   then 'US'
      else null
    end as country_code
  from auth.users u
) derived
where derived.id = p.id
  and p.country_code is null
  and derived.country_code is not null;
