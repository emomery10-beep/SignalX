-- Follow-up to 20260720000007: Postgres grants EXECUTE to the PUBLIC pseudo-role
-- by default when a function is created, unless explicitly revoked at creation
-- time. Revoking from the named roles `anon`/`authenticated` doesn't remove that
-- separate PUBLIC grant, and anon/authenticated both inherit through PUBLIC —
-- confirmed via pg_proc.proacl still showing a bare `=X/postgres` entry (PUBLIC)
-- on 17 of the 22 functions after the previous migration. This closes that gap.
revoke execute on function public.apply_customer_credit_entry_fn() from public;
revoke execute on function public.check_and_increment_rate_limit(uuid, integer) from public;
revoke execute on function public.create_free_subscription() from public;
revoke execute on function public.create_service_warranty_on_collect() from public;
revoke execute on function public.debit_api_credits(uuid, integer, text, text, text, jsonb, boolean) from public;
revoke execute on function public.deduct_service_parts_from_inventory() from public;
revoke execute on function public.deduct_stock_on_sale_fn() from public;
revoke execute on function public.enqueue_po_received_webhook() from public;
revoke execute on function public.enqueue_sale_created_webhook() from public;
revoke execute on function public.enqueue_stock_low_webhook() from public;
revoke execute on function public.handle_new_user() from public;
revoke execute on function public.increment_inventory_stock(uuid, uuid, numeric, text, uuid, text, text) from public;
revoke execute on function public.increment_usage(uuid, text) from public;
revoke execute on function public.increment_voice_nav_hit_count(text, text) from public;
revoke execute on function public.log_parcel_status_change() from public;
revoke execute on function public.log_service_job_status_change() from public;
revoke execute on function public.restore_stock_on_refund_fn() from public;
revoke execute on function public.sync_parcel_to_unified_data() from public;
revoke execute on function public.sync_service_job_to_unified_data() from public;
revoke execute on function public.topup_api_credits(uuid, integer, text, text) from public;
revoke execute on function public.update_truck_status_on_dispatch() from public;
revoke execute on function public.upsert_voice_nav_learned_phrase(text, text, text) from public;
