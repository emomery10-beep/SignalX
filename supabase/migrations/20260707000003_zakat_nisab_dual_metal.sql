-- ============================================================
-- Zakat: cache gold AND silver nisab prices independently, instead of
-- one shared pair of columns for whichever metal was checked last.
-- Lets a user toggle gold/silver in the UI without losing the other
-- metal's last-checked price. `zakat_nisab_metal` remains the user's
-- currently-selected/preferred metal.
--
-- One-time backfill of the single old pair into whichever metal
-- column matches the current selection, then the old columns are
-- dropped (nothing else reads them after this ships). Guarded so a
-- re-apply against a DB that's already been migrated is a no-op.
-- ============================================================

alter table public.profiles
  add column if not exists zakat_nisab_gold_value       numeric(14,2),
  add column if not exists zakat_nisab_gold_checked_at   timestamptz,
  add column if not exists zakat_nisab_silver_value      numeric(14,2),
  add column if not exists zakat_nisab_silver_checked_at timestamptz;

do $$ begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'profiles' and column_name = 'zakat_nisab_cached_value'
  ) then
    update public.profiles
       set zakat_nisab_silver_value = zakat_nisab_cached_value,
           zakat_nisab_silver_checked_at = zakat_nisab_checked_at
     where zakat_nisab_metal = 'silver' and zakat_nisab_cached_value is not null;

    update public.profiles
       set zakat_nisab_gold_value = zakat_nisab_cached_value,
           zakat_nisab_gold_checked_at = zakat_nisab_checked_at
     where zakat_nisab_metal = 'gold' and zakat_nisab_cached_value is not null;

    alter table public.profiles
      drop column zakat_nisab_cached_value,
      drop column zakat_nisab_checked_at;
  end if;
end $$;
