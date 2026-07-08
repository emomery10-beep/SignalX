-- app/api/v1/scan (new public vision endpoint, Phase 1 of the developer
-- platform) logs recognitions with source='api', but the original CHECK
-- constraint (034_product_recognition_learning.sql) only allows
-- 'inventory' | 'cashier' — every API-sourced insert would silently fail
-- (fire-and-forget .then() swallows the error). Widen the constraint
-- instead of mislabeling API scans as 'cashier'.
alter table public.recognition_history drop constraint if exists recognition_history_source_check;
alter table public.recognition_history add constraint recognition_history_source_check
  check (source in ('inventory', 'cashier', 'api'));
