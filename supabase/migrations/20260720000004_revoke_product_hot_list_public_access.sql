-- SECURITY FIX: product_hot_list is a materialized view grouped by owner_id —
-- materialized views don't support RLS, so it was readable by anon/authenticated
-- via schema-level default grants (confirmed live: has_table_privilege('anon', ...)
-- = true), meaning any business could see every OTHER business's product-recognition
-- analytics (recognized_name, recognition_count, success_rate per owner_id).
--
-- Verified before revoking: all 3 real call sites (app/api/pos/scan/route.ts,
-- app/api/pos/recognize-inventory/route.ts, app/api/v1/scan/route.ts) read this
-- view via createServiceClient() (service_role), which is unaffected by REVOKE.
revoke select on public.product_hot_list from anon, authenticated;
