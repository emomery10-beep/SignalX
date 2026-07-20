-- SECURITY FIX: 23 functions had no explicit search_path, so they resolved
-- unqualified table/function references using whatever search_path the CALLING
-- session had set. For SECURITY DEFINER functions (several of these touch money/
-- stock/credit logic: apply_customer_credit_entry_fn, deduct_stock_on_sale_fn,
-- increment_usage, restore_stock_on_refund_fn, etc.) that's the classic
-- search-path-injection vector: a caller who can get an earlier schema onto their
-- own search_path could make the function resolve to a different, attacker-
-- controlled object instead of the real public.* table/function.
--
-- Pinning to 'public' (rather than '' fully-qualified) preserves current
-- behavior exactly — every one of these already assumes public-schema
-- resolution — while closing the injection vector.
alter function public.apply_customer_credit_entry_fn() set search_path = 'public';
alter function public.create_service_warranty_on_collect() set search_path = 'public';
alter function public.deduct_service_parts_from_inventory() set search_path = 'public';
alter function public.deduct_stock_on_sale_fn() set search_path = 'public';
alter function public.generate_parcel_tracking_number() set search_path = 'public';
alter function public.generate_service_ticket_number() set search_path = 'public';
alter function public.increment_usage(p_user_id uuid, p_field text) set search_path = 'public';
alter function public.log_parcel_status_change() set search_path = 'public';
alter function public.log_service_job_status_change() set search_path = 'public';
alter function public.normalize_timestamp(raw_ts text) set search_path = 'public';
alter function public.restore_stock_on_refund_fn() set search_path = 'public';
alter function public.set_factory_batches_updated_at() set search_path = 'public';
alter function public.set_factory_capture_updated_at() set search_path = 'public';
alter function public.set_factory_downtime_updated_at() set search_path = 'public';
alter function public.set_factory_quality_updated_at() set search_path = 'public';
alter function public.set_factory_shifts_updated_at() set search_path = 'public';
alter function public.set_salon_updated_at() set search_path = 'public';
alter function public.set_updated_at() set search_path = 'public';
alter function public.stamp_service_completed_at() set search_path = 'public';
alter function public.sync_parcel_to_unified_data() set search_path = 'public';
alter function public.sync_service_job_to_unified_data() set search_path = 'public';
alter function public.update_truck_status_on_dispatch() set search_path = 'public';
alter function public.update_updated_at_column() set search_path = 'public';
