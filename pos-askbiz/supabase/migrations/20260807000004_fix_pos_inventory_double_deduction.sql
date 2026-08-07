-- Fix: pos_items triggers deduct_stock_on_sale / restore_stock_on_refund
-- double-count stock alongside the app-level updates already done in
-- app/api/pos/transactions/route.ts and app/api/pos/refund/route.ts.
--
-- Root cause: 018_pos.sql defines three triggers together (deduct_stock_on_sale,
-- restore_stock_on_refund, pos_to_unified_data). On 2026-07-25, the fix for the
-- unified_data ON CONFLICT bug (20260725000001_fix_unified_data_pos_conflict.sql)
-- replayed 018_pos.sql's DDL live to install the missing pos_to_unified_data
-- trigger — which, as a side effect, also (re)installed these two stock triggers
-- for the first time (see migration-drift history: 018_pos.sql was recorded
-- "applied" in schema_migrations well before its DDL actually ran live).
--
-- The app-level code already deducts/restores inventory.stock_qty itself, on
-- the explicit assumption (see its own comment) that no DB trigger runs in
-- parallel. That assumption silently broke on 2026-07-25: every sale since has
-- double-deducted stock_qty, and every refund has double-restored it.
--
-- Fix: drop just the two stock triggers. pos_to_unified_data is left alone —
-- that one is intentional and needed for BI/CFO sync. App-level code remains
-- the single source of truth for inventory.stock_qty. Functions are left in
-- place (harmless, unused) rather than dropped, to keep this change minimal.
--
-- Confirmed live before this fix (2026-08-07): both triggers present and
-- enabled (tgenabled='O') via direct query against the production DB.

drop trigger if exists deduct_stock_on_sale on public.pos_items;
drop trigger if exists restore_stock_on_refund on public.pos_items;
