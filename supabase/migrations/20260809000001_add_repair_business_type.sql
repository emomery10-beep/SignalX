-- Adds 'repair' to the allowed profiles.business_type values.
--
-- pos-askbiz has a fully-built repair sector (job tickets, intake, parts,
-- engineer assignment) and the marketing site already advertises repair-shop
-- support, but account onboarding never offered "repair" as a business type
-- — there was nothing to add here until now. Without this, the onboarding
-- UI change that adds a repair tile would silently fail to save (23514
-- check-constraint violation) exactly like the bug fixed in
-- 20260704000001_fix_business_type_check.sql — same class of mistake,
-- caught before shipping this time.
--
-- Purely additive: widens an allow-list by one value, no existing value
-- removed, no RLS/auth/billing logic touched.
alter table public.profiles drop constraint if exists profiles_business_type_check;
alter table public.profiles add constraint profiles_business_type_check
  check (business_type in (
    'retail', 'market_stall', 'food_bev', 'salon', 'courier',
    'ecommerce', 'services', 'distributor', 'manufacturer', 'importer', 'exporter',
    'repair'
  ));
