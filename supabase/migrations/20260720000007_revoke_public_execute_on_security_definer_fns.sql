-- SECURITY FIX (critical): 22 SECURITY DEFINER functions were EXECUTE-granted
-- to anon and authenticated, callable directly via /rest/v1/rpc/<name> with no
-- internal ownership/authorization checks. Two are direct financial-fraud
-- vectors as they stood:
--   topup_api_credits(p_key_id, p_amount_cents, p_provider, p_provider_ref)
--     — adds credits to ANY api_keys balance with no verification a real
--       payment occurred. Confirmed live: anon could call it and mint
--       unlimited free credit for any key_id.
--   debit_api_credits(p_key_id, p_amount_cents, ...)
--     — confirmed live: anon could drain any other developer's balance.
-- Also locked down: check_and_increment_rate_limit (anon could grief any
-- key's rate-limit window) and increment_inventory_stock (anon could tamper
-- with any business's stock levels — no owner_id check). The remaining 18 are
-- either pure trigger functions (reference NEW/OLD, only valid inside a
-- trigger — apply_customer_credit_entry_fn, create_free_subscription,
-- create_service_warranty_on_collect, deduct_service_parts_from_inventory,
-- deduct_stock_on_sale_fn, enqueue_po_received_webhook,
-- enqueue_sale_created_webhook, enqueue_stock_low_webhook, handle_new_user,
-- log_parcel_status_change, log_service_job_status_change,
-- restore_stock_on_refund_fn, sync_parcel_to_unified_data,
-- sync_service_job_to_unified_data, update_truck_status_on_dispatch) or have
-- zero references anywhere in either app's codebase right now
-- (increment_usage, increment_voice_nav_hit_count,
-- upsert_voice_nav_learned_phrase) — revoked for the same reason: nothing
-- legitimate calls them via anon/authenticated.
--
-- Verified before revoking: every real call site (lib/api-v1-auth.ts,
-- app/api/webhooks/stripe-billing/route.ts, app/api/admin/developers/route.ts,
-- app/api/pos/inventory/route.ts, app/api/pos/purchase-orders/[id]/receive/route.ts)
-- uses createServiceClient() (service_role), which has its own independent
-- EXECUTE grant on all of these (confirmed via has_function_privilege) and is
-- entirely unaffected by this revoke.

revoke execute on function public.apply_customer_credit_entry_fn() from anon, authenticated;
revoke execute on function public.check_and_increment_rate_limit(uuid, integer) from anon, authenticated;
revoke execute on function public.create_free_subscription() from anon, authenticated;
revoke execute on function public.create_service_warranty_on_collect() from anon, authenticated;
revoke execute on function public.debit_api_credits(uuid, integer, text, text, text, jsonb, boolean) from anon, authenticated;
revoke execute on function public.deduct_service_parts_from_inventory() from anon, authenticated;
revoke execute on function public.deduct_stock_on_sale_fn() from anon, authenticated;
revoke execute on function public.enqueue_po_received_webhook() from anon, authenticated;
revoke execute on function public.enqueue_sale_created_webhook() from anon, authenticated;
revoke execute on function public.enqueue_stock_low_webhook() from anon, authenticated;
revoke execute on function public.handle_new_user() from anon, authenticated;
revoke execute on function public.increment_inventory_stock(uuid, uuid, numeric, text, uuid, text, text) from anon, authenticated;
revoke execute on function public.increment_usage(uuid, text) from anon, authenticated;
revoke execute on function public.increment_voice_nav_hit_count(text, text) from anon, authenticated;
revoke execute on function public.log_parcel_status_change() from anon, authenticated;
revoke execute on function public.log_service_job_status_change() from anon, authenticated;
revoke execute on function public.restore_stock_on_refund_fn() from anon, authenticated;
revoke execute on function public.sync_parcel_to_unified_data() from anon, authenticated;
revoke execute on function public.sync_service_job_to_unified_data() from anon, authenticated;
revoke execute on function public.topup_api_credits(uuid, integer, text, text) from anon, authenticated;
revoke execute on function public.update_truck_status_on_dispatch() from anon, authenticated;
revoke execute on function public.upsert_voice_nav_learned_phrase(text, text, text) from anon, authenticated;
