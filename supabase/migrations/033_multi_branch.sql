-- ══════════════════════════════════════════════════════════════
-- MULTI-BRANCH POS SUPPORT
-- Allows owners to run multiple store locations with separate
-- inventory per branch, while seeing consolidated data as admin.
-- ══════════════════════════════════════════════════════════════

-- ── 1. Ensure pos_locations table exists ─────────────────────
CREATE TABLE IF NOT EXISTS pos_locations (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id   uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name       text NOT NULL,
  address    text,
  phone      text,
  is_active  boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(owner_id, name)
);

ALTER TABLE pos_locations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Owner manages locations" ON pos_locations;
CREATE POLICY "Owner manages locations"
  ON pos_locations FOR ALL USING (auth.uid() = owner_id);

CREATE INDEX IF NOT EXISTS idx_locations_owner ON pos_locations(owner_id);

-- ── 2. Add location_id to inventory (nullable for backwards compat) ──
ALTER TABLE inventory ADD COLUMN IF NOT EXISTS location_id uuid REFERENCES pos_locations(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_inventory_location ON inventory(owner_id, location_id);

-- ── 3. Add location_id to pos_staff (nullable = can work any branch) ──
ALTER TABLE pos_staff ADD COLUMN IF NOT EXISTS location_id uuid REFERENCES pos_locations(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_staff_location ON pos_staff(owner_id, location_id);

-- ── 4. pos_transactions already has pos_location_id from migration 031 ──
-- Just ensure the index exists
CREATE INDEX IF NOT EXISTS idx_tx_location ON pos_transactions(owner_id, pos_location_id);

-- ── 5. Stock transfer table ──────────────────────────────────
CREATE TABLE IF NOT EXISTS pos_stock_transfers (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id          uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  from_location_id  uuid NOT NULL REFERENCES pos_locations(id) ON DELETE CASCADE,
  to_location_id    uuid NOT NULL REFERENCES pos_locations(id) ON DELETE CASCADE,
  inventory_id      uuid NOT NULL REFERENCES inventory(id) ON DELETE CASCADE,
  product_name      text NOT NULL,
  qty               int NOT NULL CHECK (qty > 0),
  status            text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_transit', 'received', 'cancelled')),
  initiated_by      text,
  received_by       text,
  notes             text,
  created_at        timestamptz DEFAULT now(),
  completed_at      timestamptz,
  CHECK (from_location_id != to_location_id)
);

ALTER TABLE pos_stock_transfers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owner manages transfers"
  ON pos_stock_transfers FOR ALL USING (auth.uid() = owner_id);

CREATE INDEX IF NOT EXISTS idx_transfers_owner ON pos_stock_transfers(owner_id, status);
CREATE INDEX IF NOT EXISTS idx_transfers_from ON pos_stock_transfers(from_location_id);
CREATE INDEX IF NOT EXISTS idx_transfers_to ON pos_stock_transfers(to_location_id);

-- ── 6. Auto-create "Main" location for existing owners ───────
-- Owners with POS data but no location get a default one
INSERT INTO pos_locations (owner_id, name, address)
SELECT DISTINCT owner_id, 'Main', 'Default location'
FROM pos_transactions
WHERE owner_id NOT IN (SELECT owner_id FROM pos_locations)
ON CONFLICT (owner_id, name) DO NOTHING;

-- Also for owners who only have inventory
INSERT INTO pos_locations (owner_id, name, address)
SELECT DISTINCT owner_id, 'Main', 'Default location'
FROM inventory
WHERE owner_id NOT IN (SELECT owner_id FROM pos_locations)
ON CONFLICT (owner_id, name) DO NOTHING;

-- ── 7. Backfill existing data to "Main" location ────────────
-- Inventory
UPDATE inventory i
SET location_id = l.id
FROM pos_locations l
WHERE i.owner_id = l.owner_id
  AND l.name = 'Main'
  AND i.location_id IS NULL;

-- Transactions (uses pos_location_id column from migration 031)
UPDATE pos_transactions t
SET pos_location_id = l.id
FROM pos_locations l
WHERE t.owner_id = l.owner_id
  AND l.name = 'Main'
  AND t.pos_location_id IS NULL;

-- Staff
UPDATE pos_staff s
SET location_id = l.id
FROM pos_locations l
WHERE s.owner_id = l.owner_id
  AND l.name = 'Main'
  AND s.location_id IS NULL;
