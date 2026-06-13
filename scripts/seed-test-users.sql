-- ============================================================
-- Factory Analytics Test Users Seed
-- This script creates test users and staff accounts for the Factory Analytics system
--
-- Usage:
--   1. Run this SQL in Supabase SQL Editor (replace {OWNER_UUID} with your auth.users id)
--   2. Or use: psql -h <host> -U postgres -d postgres -f seed-test-users.sql
--
-- Test Users Created:
--   - factory_operator@test.local (camera.output permission)
--   - factory_approver@test.local (capture.approve permission)
--   - factory_manager@test.local (all factory permissions)
-- ============================================================

-- NOTE: You'll need to first create auth users via Supabase dashboard or CLI,
-- then replace {OWNER_UUID_1}, {OWNER_UUID_2}, {OWNER_UUID_3} below with actual auth user IDs

-- Insert test staff accounts (replace {OWNER_UUID_*} with real user IDs from auth.users)
INSERT INTO public.pos_staff (owner_id, id, name, role, email, phone)
VALUES
  (
    '{OWNER_UUID_1}'::uuid,
    gen_random_uuid(),
    'Alex Operator',
    'worker',
    'operator@factory.local',
    '+1234567890'
  ),
  (
    '{OWNER_UUID_2}'::uuid,
    gen_random_uuid(),
    'Blake Approver',
    'supervisor',
    'approver@factory.local',
    '+1234567891'
  ),
  (
    '{OWNER_UUID_3}'::uuid,
    gen_random_uuid(),
    'Casey Manager',
    'manager',
    'manager@factory.local',
    '+1234567892'
  )
ON CONFLICT (owner_id, email) DO NOTHING;

-- Insert pos_locations for these staff (Factory Floor location)
INSERT INTO public.pos_locations (owner_id, name, address, city, country, currency_code)
VALUES
  ('{OWNER_UUID_1}'::uuid, 'Factory Floor A', '123 Industrial Ave', 'Accra', 'Ghana', 'GHS'),
  ('{OWNER_UUID_2}'::uuid, 'Factory Floor A', '123 Industrial Ave', 'Accra', 'Ghana', 'GHS'),
  ('{OWNER_UUID_3}'::uuid, 'Factory Floor A', '123 Industrial Ave', 'Accra', 'Ghana', 'GHS')
ON CONFLICT (owner_id, name) DO NOTHING;

-- Insert pos_role_permissions for each staff member
-- Camera Output permissions (for operators)
INSERT INTO public.pos_role_permissions (role, permission)
VALUES
  ('worker', 'camera.output'),
  ('worker', 'camera.wastage'),
  ('supervisor', 'camera.output'),
  ('supervisor', 'camera.wastage'),
  ('supervisor', 'capture.approve'),
  ('manager', 'camera.output'),
  ('manager', 'camera.wastage'),
  ('manager', 'capture.approve'),
  ('manager', 'data.export'),
  ('manager', 'settings.manage')
ON CONFLICT (role, permission) DO NOTHING;

-- Verify the data was inserted
SELECT
  'Staff Accounts' as type,
  COUNT(*) as count
FROM public.pos_staff
WHERE owner_id IN ('{OWNER_UUID_1}'::uuid, '{OWNER_UUID_2}'::uuid, '{OWNER_UUID_3}'::uuid)

UNION ALL

SELECT
  'Locations' as type,
  COUNT(*) as count
FROM public.pos_locations
WHERE owner_id IN ('{OWNER_UUID_1}'::uuid, '{OWNER_UUID_2}'::uuid, '{OWNER_UUID_3}'::uuid)

UNION ALL

SELECT
  'Role Permissions' as type,
  COUNT(*) as count
FROM public.pos_role_permissions;
