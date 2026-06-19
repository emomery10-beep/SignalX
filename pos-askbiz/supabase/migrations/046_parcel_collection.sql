-- ============================================================
-- AskBiz Migration 046 — Destination receipt & customer collection
-- Adds the 'awaiting_collection' status (handler-received at the
-- destination branch, waiting for the customer) and the columns the
-- clerk's Incoming/collection flow records at handover.
-- ============================================================

-- ── Status: add awaiting_collection ───────────────────────
ALTER TABLE public.pos_parcels DROP CONSTRAINT IF EXISTS pos_parcels_status_check;
ALTER TABLE public.pos_parcels ADD CONSTRAINT pos_parcels_status_check
  CHECK (status IN (
    'received', 'at_branch', 'assigned', 'loaded', 'in_transit',
    'at_destination', 'awaiting_collection', 'out_for_delivery',
    'delivered', 'collected', 'failed_delivery', 'returned'
  ));

-- ── Destination receipt (handler) ─────────────────────────
ALTER TABLE public.pos_parcels
  ADD COLUMN IF NOT EXISTS received_at_dest_by uuid REFERENCES public.pos_staff(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS received_at_dest_at timestamptz,
  -- Collection / handover (clerk)
  ADD COLUMN IF NOT EXISTS collected_by         uuid REFERENCES public.pos_staff(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS collection_photo_url  text,
  ADD COLUMN IF NOT EXISTS collection_photo_path text;

COMMENT ON COLUMN public.pos_parcels.received_at_dest_by IS 'Handler who received the parcel into the destination branch.';
COMMENT ON COLUMN public.pos_parcels.collected_by        IS 'Clerk who released the parcel to the receiver.';
COMMENT ON COLUMN public.pos_parcels.collection_photo_url IS 'Photo of the parcel at customer handover (proof of release).';
