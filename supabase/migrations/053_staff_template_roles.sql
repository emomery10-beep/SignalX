-- ============================================================
-- AskBiz Migration 053 — Staff Role Templates
-- Update pos_staff role constraint to accept template IDs
-- Tables: pos_staff (constraint update)
-- ============================================================

-- ── Update staff roles constraint to accept template IDs ─────
-- Previous constraint only allowed legacy roles
-- New constraint allows:
--   - Legacy roles: cashier, inventory, repair, engineer, manager, supervisor, handler, driver, dispatcher, branch_manager
--   - Template IDs: factory-*, restaurant-*, repair-*, salon-*, retail-*, logistics-*

ALTER TABLE public.pos_staff DROP CONSTRAINT IF EXISTS pos_staff_role_check;

-- Using a more flexible pattern that matches both legacy roles and template IDs
-- Template IDs are validated at API layer with regex: /^(factory|restaurant|repair|salon|retail|logistics)-/
ALTER TABLE public.pos_staff ADD CONSTRAINT pos_staff_role_check
  CHECK (
    role IN (
      'cashier', 'inventory', 'repair', 'engineer', 'manager', 'supervisor',
      'handler', 'driver', 'dispatcher', 'branch_manager'
    ) OR
    -- Allow template IDs with format: business_type-role_name
    role SIMILAR TO '(factory|restaurant|repair|salon|retail|logistics)-[a-z_]+'
  );

-- ════════════════════════════════════════════════════════════
-- COMPLETED
-- ════════════════════════════════════════════════════════════
