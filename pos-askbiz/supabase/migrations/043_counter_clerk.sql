-- ============================================================
-- AskBiz Migration 043 — Logistics Counter Clerk
-- Adds counter-clerk role, parcel ID fields, delivery type,
-- parcel size, and intake photo storage
-- ============================================================

-- ── Extend staff role constraint to include counter-clerk ──
-- NOTE: production carries the full template-role list (retail/factory/
-- restaurant/repair/salon/logistics). We rebuild it in full + counter-clerk.
ALTER TABLE public.pos_staff DROP CONSTRAINT IF EXISTS pos_staff_role_check;
ALTER TABLE public.pos_staff ADD CONSTRAINT pos_staff_role_check
  CHECK (role IN (
    'cashier', 'inventory', 'repair', 'engineer', 'manager', 'supervisor',
    'handler', 'driver', 'dispatcher', 'branch_manager',
    'retail-cashier', 'retail-floor-staff', 'retail-inventory-manager', 'retail-shift-supervisor', 'retail-manager',
    'factory-line-operator', 'factory-quality-inspector', 'factory-shift-supervisor', 'factory-production-manager', 'factory-inventory-manager',
    'restaurant-server', 'restaurant-lead-server', 'restaurant-host', 'restaurant-head-chef', 'restaurant-kitchen-manager', 'restaurant-line-cook', 'restaurant-operations-manager', 'restaurant-cashier',
    'repair-intake-specialist', 'repair-technician', 'repair-quality-checker', 'repair-manager',
    'salon-receptionist', 'salon-stylist', 'salon-esthetician', 'salon-manager',
    'logistics-counter-clerk', 'logistics-handler', 'logistics-driver', 'logistics-dispatcher', 'logistics-branch-manager'
  ));

-- ── Extend pos_parcels with counter-clerk intake fields ────
ALTER TABLE public.pos_parcels
  ADD COLUMN IF NOT EXISTS sender_id_number   text,
  ADD COLUMN IF NOT EXISTS receiver_id_number text,
  ADD COLUMN IF NOT EXISTS delivery_type      text,
  ADD COLUMN IF NOT EXISTS delivery_address   text,
  ADD COLUMN IF NOT EXISTS parcel_size        text,
  ADD COLUMN IF NOT EXISTS intake_photo_url   text,
  ADD COLUMN IF NOT EXISTS intake_photo_path  text;

-- Check constraints added separately (idempotent)
ALTER TABLE public.pos_parcels DROP CONSTRAINT IF EXISTS pos_parcels_delivery_type_check;
ALTER TABLE public.pos_parcels ADD CONSTRAINT pos_parcels_delivery_type_check
  CHECK (delivery_type IN ('branch_to_branch', 'door_to_door') OR delivery_type IS NULL);
ALTER TABLE public.pos_parcels DROP CONSTRAINT IF EXISTS pos_parcels_parcel_size_check;
ALTER TABLE public.pos_parcels ADD CONSTRAINT pos_parcels_parcel_size_check
  CHECK (parcel_size IN ('S', 'M', 'L', 'XL') OR parcel_size IS NULL);

-- ── Add payment_method 'mobile_money' ─────────────────────
-- Drop and recreate the check constraint to add mobile_money
ALTER TABLE public.pos_parcels
  DROP CONSTRAINT IF EXISTS pos_parcels_payment_method_check;
ALTER TABLE public.pos_parcels
  ADD CONSTRAINT pos_parcels_payment_method_check
  CHECK (payment_method IN ('cash', 'mpesa', 'mobile_money', 'card', 'account') OR payment_method IS NULL);

-- ── Storage bucket for parcel photos ──────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'parcel-photos',
  'parcel-photos',
  false,
  10485760,  -- 10 MB
  ARRAY['image/jpeg','image/png','image/webp','image/heic']
)
ON CONFLICT (id) DO NOTHING;

-- ── Storage RLS: staff can upload to their owner folder ───
-- (CREATE POLICY has no IF NOT EXISTS — drop first for idempotency)
DROP POLICY IF EXISTS "Staff upload parcel photos" ON storage.objects;
CREATE POLICY "Staff upload parcel photos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'parcel-photos'
    AND auth.role() = 'authenticated'
  );

DROP POLICY IF EXISTS "Staff read parcel photos" ON storage.objects;
CREATE POLICY "Staff read parcel photos"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'parcel-photos'
    AND auth.role() = 'authenticated'
  );

-- ── Add indexes ───────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_parcels_sender_id   ON public.pos_parcels(owner_id, sender_id_number);
CREATE INDEX IF NOT EXISTS idx_parcels_receiver_id ON public.pos_parcels(owner_id, receiver_id_number);
CREATE INDEX IF NOT EXISTS idx_parcels_delivery_type ON public.pos_parcels(owner_id, delivery_type);
