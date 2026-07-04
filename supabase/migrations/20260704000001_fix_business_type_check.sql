-- The original check constraint (001_init.sql) only allowed
-- 'retail','ecommerce','distributor','exporter'. The onboarding UI has since
-- offered 11 business types (market_stall, food_bev, salon, courier,
-- services, manufacturer, importer included) that were never added here —
-- so saving any of those has been silently failing with a 23514 violation
-- ever since (the onboarding page didn't check the update's error, so users
-- picking e.g. "Market stall" or "Restaurant / Food stand" got bounced back
-- to onboarding with no visible error).
alter table public.profiles drop constraint if exists profiles_business_type_check;
alter table public.profiles add constraint profiles_business_type_check
  check (business_type in (
    'retail', 'market_stall', 'food_bev', 'salon', 'courier',
    'ecommerce', 'services', 'distributor', 'manufacturer', 'importer', 'exporter'
  ));
