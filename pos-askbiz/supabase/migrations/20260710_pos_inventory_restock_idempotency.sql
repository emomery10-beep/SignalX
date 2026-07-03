-- ============================================================
-- AskBiz Migration — offline-write idempotency for cumulative
-- UPDATE operations (inventory restock, repair job status
-- transitions) that mutate an existing row repeatedly. A single
-- client_tx_id column on the target row (the pattern used for
-- pos_parcels/restaurant_orders/pos_service_jobs/pos_factory_captures,
-- and for plain inventory field-edits) only works for INSERT-once
-- writes — it can't record "have I already applied tx X" for a row
-- that gets mutated many times over its life. pos_audit_log
-- (append-only, already logs inventory.restocked/job.status_change)
-- is the natural side-table for this instead.
--
-- Also creates increment_inventory_stock as a genuinely atomic RPC.
-- CONFIRMED via live schema query: this function did NOT previously
-- exist under this or any other name — app/api/pos/inventory/route.ts's
-- PATCH handler has always silently fallen back to a non-atomic
-- fetch-then-update on every restock in production. This migration
-- is a net-new atomicity fix, not a preservation of prior RPC logic.
-- ============================================================

alter table public.pos_audit_log
  add column if not exists client_tx_id text;

-- Scoped to the specific events that use this idempotency pattern —
-- keeps the index small and avoids an unrelated audit event sharing
-- an owner_id from colliding on client_tx_id (defensive; client_tx_ids
-- are generated with a per-resource prefix so collision is already
-- astronomically unlikely, but the extra predicate is cheap insurance).
create unique index if not exists idx_pos_audit_log_client_tx_id
  on public.pos_audit_log (owner_id, client_tx_id)
  where client_tx_id is not null
    and event in ('inventory.restocked', 'job.status_change');

create or replace function public.increment_inventory_stock(
  p_id uuid,
  p_owner_id uuid,
  p_qty numeric,
  p_client_tx_id text default null,
  p_staff_id uuid default null,
  p_staff_role text default null,
  p_staff_name text default null
)
returns setof public.inventory
language plpgsql
security definer
set search_path = public
as $$
declare
  v_existing_log_id uuid;
begin
  -- Idempotency: if this exact restock (by client_tx_id) was already
  -- applied, return the current row unchanged instead of incrementing
  -- again. This closes the retry-double-increment gap: a network
  -- timeout that actually succeeded server-side, then retried by the
  -- client (or replayed from the offline queue), converges to a
  -- single applied increment.
  if p_client_tx_id is not null then
    select id into v_existing_log_id
    from public.pos_audit_log
    where owner_id = p_owner_id
      and client_tx_id = p_client_tx_id
      and event = 'inventory.restocked'
    limit 1;

    if v_existing_log_id is not null then
      return query select * from public.inventory where id = p_id and owner_id = p_owner_id;
      return;
    end if;
  end if;

  -- Increment and audit-log insert happen in the same function
  -- invocation (implicitly one transaction) — this is the piece a
  -- two-request app-code version can't guarantee: no window where the
  -- increment succeeds but the audit row fails to record, which would
  -- otherwise leave a retry able to double-apply.
  update public.inventory
  set stock_qty  = greatest(0, stock_qty + p_qty),
      updated_at = now()
  where id = p_id and owner_id = p_owner_id;

  insert into public.pos_audit_log (
    owner_id, staff_id, staff_role, staff_name,
    event, entity_type, entity_id, to_value, metadata, client_tx_id
  ) values (
    p_owner_id, p_staff_id, p_staff_role, p_staff_name,
    'inventory.restocked', 'inventory', p_id, p_qty::text,
    jsonb_build_object('qty', p_qty), p_client_tx_id
  );

  return query select * from public.inventory where id = p_id and owner_id = p_owner_id;
end;
$$;
