-- ============================================================
-- APPLY THIS DIRECTLY IN SUPABASE SQL EDITOR
-- ============================================================
-- This updates the pos_staff role constraint to accept both
-- legacy roles AND new template IDs

-- Step 1: Drop the existing constraint
ALTER TABLE public.pos_staff DROP CONSTRAINT IF EXISTS pos_staff_role_check;

-- Step 2: Add the new constraint that accepts both legacy roles and template IDs
ALTER TABLE public.pos_staff ADD CONSTRAINT pos_staff_role_check
  CHECK (
    role IN (
      'cashier', 'inventory', 'repair', 'engineer', 'manager', 'supervisor',
      'handler', 'driver', 'dispatcher', 'branch_manager'
    ) OR
    role SIMILAR TO '(factory|restaurant|repair|salon|retail|logistics)-[a-z_]+'
  );

-- Step 3: Verify the constraint was added
SELECT constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'pos_staff' AND constraint_name = 'pos_staff_role_check';

-- ============================================================
-- VERIFY EACH ROLE WORKS
-- ============================================================

-- Test 1: Insert with legacy "inventory" role
INSERT INTO pos_staff (owner_id, name, phone, role, active)
VALUES (auth.uid(), 'Test Inventory', '+1234567890', 'inventory', true)
ON CONFLICT DO NOTHING;

-- Test 2: Insert with legacy "cashier" role
INSERT INTO pos_staff (owner_id, name, phone, role, active)
VALUES (auth.uid(), 'Test Cashier', '+0987654321', 'cashier', true)
ON CONFLICT DO NOTHING;

-- Test 3: Insert with new template "retail-inventory-manager"
INSERT INTO pos_staff (owner_id, name, phone, role, active)
VALUES (auth.uid(), 'Test Retail Inventory', '+1111111111', 'retail-inventory-manager', true)
ON CONFLICT DO NOTHING;

-- Test 4: Insert with new template "retail-cashier"
INSERT INTO pos_staff (owner_id, name, phone, role, active)
VALUES (auth.uid(), 'Test Retail Cashier', '+2222222222', 'retail-cashier', true)
ON CONFLICT DO NOTHING;

-- Step 4: Verify all roles are in the system
SELECT DISTINCT role FROM pos_staff ORDER BY role;

-- ============================================================
-- ROLE-TO-SECTOR MAPPING
-- ============================================================
-- This mapping ensures each role can access the correct sector

SELECT
  CASE
    -- Factory roles
    WHEN role LIKE 'factory-%' THEN 'factory'
    -- Restaurant roles
    WHEN role LIKE 'restaurant-%' THEN 'restaurant'
    -- Repair roles
    WHEN role LIKE 'repair-%' THEN 'repair'
    -- Salon roles
    WHEN role LIKE 'salon-%' THEN 'salon'
    -- Retail roles
    WHEN role LIKE 'retail-%' THEN 'retail'
    -- Logistics roles
    WHEN role LIKE 'logistics-%' THEN 'logistics'
    -- Legacy roles
    WHEN role IN ('cashier', 'inventory') THEN 'retail'
    WHEN role IN ('handler', 'driver', 'dispatcher', 'branch_manager') THEN 'logistics'
    WHEN role IN ('repair', 'engineer') THEN 'repair'
    WHEN role IN ('manager', 'supervisor') THEN NULL -- Can access all
    ELSE NULL
  END as mapped_sector,
  COUNT(*) as staff_count,
  role
FROM pos_staff
WHERE active = true
GROUP BY role, mapped_sector
ORDER BY mapped_sector, role;
