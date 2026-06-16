# Role Wiring Verification & Fix Guide

## 🔧 Step 1: Apply Constraint Update in Supabase

**Go to:** [Supabase SQL Editor](https://supabase.com/dashboard/project/benptbfiudpfvmvwxcjm/sql)

**Copy & paste this SQL:**

```sql
ALTER TABLE public.pos_staff DROP CONSTRAINT IF EXISTS pos_staff_role_check;

ALTER TABLE public.pos_staff ADD CONSTRAINT pos_staff_role_check
  CHECK (
    role IN (
      'cashier', 'inventory', 'repair', 'engineer', 'manager', 'supervisor',
      'handler', 'driver', 'dispatcher', 'branch_manager'
    ) OR
    role SIMILAR TO '(factory|restaurant|repair|salon|retail|logistics)-[a-z_]+'
  );
```

**Then run:** Click the **Play** button to execute

Expected result: `ALTER TABLE` with no errors

---

## ✅ Step 2: Verify Constraint is Applied

Run this query to confirm:

```sql
SELECT constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'pos_staff' AND constraint_name = 'pos_staff_role_check';
```

Expected: Shows the constraint exists

---

## 🧪 Step 3: Test Each Role One By One

### Test 1: Legacy "cashier" (SHOULD WORK)
```sql
UPDATE pos_staff SET role = 'cashier' WHERE id = (
  SELECT id FROM pos_staff WHERE email = 'idirism@hotmail.com' LIMIT 1
);
```
Expected: ✅ Success

### Test 2: Legacy "inventory" (SHOULD WORK NOW)
```sql
UPDATE pos_staff SET role = 'inventory' WHERE id = (
  SELECT id FROM pos_staff WHERE email = 'email@example.com' LIMIT 1
);
```
Expected: ✅ Success (this was failing before)

### Test 3: Template "retail-cashier" (NEW)
```sql
UPDATE pos_staff SET role = 'retail-cashier' WHERE id = (
  SELECT id FROM pos_staff WHERE email = 'idirism@hotmail.com' LIMIT 1
);
```
Expected: ✅ Success (new template)

### Test 4: Template "retail-inventory-manager" (NEW)
```sql
UPDATE pos_staff SET role = 'retail-inventory-manager' WHERE id = (
  SELECT id FROM pos_staff WHERE email = 'email@example.com' LIMIT 1
);
```
Expected: ✅ Success (new template)

---

## 📊 Role-to-Sector Mapping

Each role should map to its correct sector:

```
LEGACY ROLES:
  ✅ cashier → retail
  ✅ inventory → retail
  ✅ handler → logistics
  ✅ driver → logistics
  ✅ dispatcher → logistics
  ✅ branch_manager → logistics
  ✅ repair → repair
  ✅ engineer → repair
  ✅ manager → all sectors
  ✅ supervisor → all sectors

FACTORY TEMPLATES (5 roles):
  factory-line-operator → factory
  factory-quality-inspector → factory
  factory-shift-supervisor → factory
  factory-production-manager → factory
  factory-inventory-manager → factory

RESTAURANT TEMPLATES (8 roles):
  restaurant-server → restaurant
  restaurant-lead-server → restaurant
  restaurant-host → restaurant
  restaurant-head-chef → restaurant
  restaurant-kitchen-manager → restaurant
  restaurant-line-cook → restaurant
  restaurant-operations-manager → restaurant
  restaurant-cashier → restaurant

REPAIR TEMPLATES (4 roles):
  repair-intake-specialist → repair
  repair-technician → repair
  repair-quality-checker → repair
  repair-manager → repair

SALON TEMPLATES (4 roles):
  salon-receptionist → salon
  salon-stylist → salon
  salon-esthetician → salon
  salon-manager → salon

RETAIL TEMPLATES (5 roles):
  retail-cashier → retail
  retail-floor-staff → retail
  retail-inventory-manager → retail
  retail-shift-supervisor → retail
  retail-manager → retail

LOGISTICS TEMPLATES (4 roles):
  logistics-handler → logistics
  logistics-driver → logistics
  logistics-dispatcher → logistics
  logistics-branch-manager → logistics
```

---

## 🔄 Step 4: Test in Admin UI

After applying the constraint:

1. **Hard refresh:** `Cmd+Shift+R`
2. **Go to:** `/pos?tab=staff`
3. **Click Edit** on any staff member
4. **Try each role type:**
   - Select "Inventory Manager" → Save ✅ (should work now)
   - Select "👷 Line Operator" → Save ✅ (factory template)
   - Select "🍽️ Server" → Save ✅ (restaurant template)
   - Select "💳 Cashier" → Save ✅ (retail template)

---

## 📋 Verification Checklist

- [ ] Supabase constraint updated via SQL
- [ ] Legacy "inventory" role works in admin
- [ ] Template "retail-inventory-manager" works in admin
- [ ] All 30 templates appear in dropdown
- [ ] Can switch between legacy and template roles
- [ ] Sectors match role types correctly
- [ ] pos.askbiz.co loads new roles in dropdown

---

## ❌ If Still Getting Errors

If you still see "violates check constraint", run this to debug:

```sql
-- Check the actual constraint
SELECT pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conname = 'pos_staff_role_check' AND contype = 'c';

-- Show all roles in system
SELECT DISTINCT role FROM pos_staff ORDER BY role;

-- Try to update manually
UPDATE pos_staff SET role = 'inventory' WHERE phone = '0797446343';
```

If the constraint shows old values, it didn't get updated. Re-run Step 1.

---

## 🚀 Once Verified

Once all roles work:
1. Both legacy and new templates fully functional
2. Admin UI shows all 30 templates
3. Each role has correct sector mapping
4. pos.askbiz.co updated with new dropdown

**Everything wired and production-ready!** ✅
