-- ============================================================
-- Factory data model extension (8/8): Factory-type selector
-- ------------------------------------------------------------
-- Separately from the schema above, we need a lightweight way to
-- store, per owner, which "factory type" they picked (sesame_oil,
-- water, maize_milling, cassava, rice_milling, dairy, bakery, soap,
-- concrete_blocks, poultry, coffee, fish_smoking, or "other"). This
-- will later drive default production stages and role suggestions
-- during onboarding and in admin settings — it is a simple selector
-- value, not a relational structure, so a single nullable column is
-- enough.
--
-- Landed on public.profiles: app/api/pos/config/route.ts already
-- reads `business_type`, `business_name`, `currency_symbol` off this
-- exact table (SELECT ... FROM profiles WHERE id = ownerId) as the
-- one place POS-wide business-level config lives, and pos-askbiz
-- already has precedent for altering profiles from its own migrations
-- folder despite profiles being canonically defined in the root app's
-- supabase/migrations (both point at the same shared production
-- Supabase project) — see 20260722000001_fix_profiles_plan_check_constraint.sql.
--
-- factory_type is intentionally a NEW column, not a value inside the
-- existing business_type (whose check constraint, fixed in
-- supabase/migrations/20260704000001_fix_business_type_check.sql, tops
-- out at the coarse 'manufacturer'). factory_type is a sub-classification
-- that only applies when business_type = 'manufacturer', so it stays
-- NULL for every other business type and also NULL for manufacturers
-- who haven't picked one yet.
-- ============================================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS factory_type text;

ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_factory_type_check;
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_factory_type_check
  CHECK (factory_type IS NULL OR factory_type IN (
    'sesame_oil', 'water', 'maize_milling', 'cassava', 'rice_milling',
    'dairy', 'bakery', 'soap', 'concrete_blocks', 'poultry', 'coffee',
    'fish_smoking', 'other'
  ));

COMMENT ON COLUMN public.profiles.factory_type IS
  'Factory-sector sub-classification picked during onboarding or in admin settings (e.g. sesame_oil, water, dairy). NULL for non-factory businesses and for factory owners who have not picked one yet. Drives default production stages/role suggestions — see the factory-type template feature.';
