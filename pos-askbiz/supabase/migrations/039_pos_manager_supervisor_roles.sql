-- ============================================================
-- Stage 1: Add manager + supervisor roles to pos_staff
-- Extends the role CHECK constraint — additive only,
-- no existing data is changed.
-- ============================================================

-- Drop the constraint set by 037 and re-add with 2 new roles
ALTER TABLE public.pos_staff DROP CONSTRAINT IF EXISTS pos_staff_role_check;
ALTER TABLE public.pos_staff ADD CONSTRAINT pos_staff_role_check
  CHECK (role IN ('cashier', 'inventory', 'repair', 'engineer', 'manager', 'supervisor'));

-- Role reference for documentation:
-- cashier    — process sales, accept payments
-- inventory  — scan/add products, manage stock
-- repair     — create & manage service jobs
-- engineer   — execute assigned repair jobs
-- manager    — approve transactions, see shift reports, manage staff
-- supervisor — approve worker camera submissions, see their shift only
