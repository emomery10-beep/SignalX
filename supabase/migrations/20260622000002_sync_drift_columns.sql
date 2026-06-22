-- ============================================================
-- Schema-drift sync (columns): columns that exist in PRODUCTION but
-- are missing from the migration definitions of these tables. Taken
-- verbatim from the prod schema (supabase db dump --linked) so a fresh
-- replay and the generated types match prod. All idempotent — no-ops in
-- prod and on any DB that already has these columns/constraints.
-- ============================================================

-- ── inventory: per-row sales channel ──
alter table public.inventory add column if not exists channel text default 'both';

-- ── pos_parcels: door-to-door delivery, ID capture, consent, collection ──
alter table public.pos_parcels add column if not exists sender_id_number text;
alter table public.pos_parcels add column if not exists receiver_id_number text;
alter table public.pos_parcels add column if not exists delivery_type text;
alter table public.pos_parcels add column if not exists delivery_address text;
alter table public.pos_parcels add column if not exists parcel_size text;
alter table public.pos_parcels add column if not exists intake_photo_url text;
alter table public.pos_parcels add column if not exists intake_photo_path text;
alter table public.pos_parcels add column if not exists sender_consent boolean not null default false;
alter table public.pos_parcels add column if not exists receipt_consent boolean not null default false;
alter table public.pos_parcels add column if not exists consent_at timestamptz;
alter table public.pos_parcels add column if not exists consent_by uuid;
alter table public.pos_parcels add column if not exists received_at_dest_by uuid;
alter table public.pos_parcels add column if not exists received_at_dest_at timestamptz;
alter table public.pos_parcels add column if not exists collected_by uuid;
alter table public.pos_parcels add column if not exists collection_photo_url text;
alter table public.pos_parcels add column if not exists collection_photo_path text;

-- Check constraints (guarded — Postgres has no ADD CONSTRAINT IF NOT EXISTS)
do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'pos_parcels_delivery_type_check') then
    alter table public.pos_parcels add constraint pos_parcels_delivery_type_check
      check (delivery_type = any (array['branch_to_branch','door_to_door']) or delivery_type is null);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'pos_parcels_parcel_size_check') then
    alter table public.pos_parcels add constraint pos_parcels_parcel_size_check
      check (parcel_size = any (array['S','M','L','XL']) or parcel_size is null);
  end if;
end $$;
