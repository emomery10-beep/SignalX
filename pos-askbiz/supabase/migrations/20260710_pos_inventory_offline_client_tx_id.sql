-- ============================================================
-- AskBiz Migration — offline-write idempotency for plain
-- inventory field edits and bulk imports (INSERT/field-set
-- shaped writes only). Restock (an INCREMENT, not a field-set)
-- is handled separately — see 20260710_pos_inventory_restock_idempotency.sql,
-- since a single client_tx_id column here can't represent "have I
-- applied this specific increment before" for a row mutated many
-- times over its life.
-- ============================================================

alter table public.inventory
  add column if not exists client_tx_id text;

create unique index if not exists idx_inventory_client_tx_id
  on public.inventory (owner_id, client_tx_id)
  where client_tx_id is not null;
