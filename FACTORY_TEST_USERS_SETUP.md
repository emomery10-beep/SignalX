# Factory Analytics Test Users Setup

This guide explains how to create test users for the Factory Analytics system.

## Overview

Three test user accounts are available:

| Email | Role | Permissions | Use Case |
|-------|------|-------------|----------|
| `factory-operator@test.local` | Worker | `camera.output`, `camera.wastage` | Capture photos, log production events |
| `factory-approver@test.local` | Supervisor | Above + `capture.approve` | Approve/reject captures |
| `factory-manager@test.local` | Manager | All factory permissions | Full system access, settings, exports |

All test passwords: `TestPassword123!@#`

---

## Quick Setup (Automated via Node.js)

### Prerequisites
- Supabase Service Role Key (from [Settings → API](https://supabase.com/dashboard/project/benptbfiudpfvmvwxcjm/settings/api))
- Node.js 16+ installed

### Steps

1. **Get your Service Role Key**
   - Go to [Supabase Dashboard → Settings → API Keys](https://supabase.com/dashboard/project/benptbfiudpfvmvwxcjm/settings/api)
   - Copy the "Service Role" key (long JWT token starting with `eyJ...`)

2. **Run the setup script**
   ```bash
   SUPABASE_SERVICE_ROLE_KEY="your_service_role_key_here" \
   node scripts/setup-factory-test-users.js
   ```

3. **Verify in Supabase Dashboard**
   - Go to [Authentication → Users](https://supabase.com/dashboard/project/benptbfiudpfvmvwxcjm/auth/users)
   - You should see 3 new users created

---

## Manual Setup (Via Supabase Dashboard)

If you prefer to create users manually:

### Step 1: Create Auth Users

1. Go to [Supabase Dashboard → Authentication → Users](https://supabase.com/dashboard/project/benptbfiudpfvmvwxcjm/auth/users)
2. Click **"Invite user"** and create these users:

   **User 1: Operator**
   - Email: `factory-operator@test.local`
   - Password: `TestPassword123!@#`

   **User 2: Approver**
   - Email: `factory-approver@test.local`
   - Password: `TestPassword123!@#`

   **User 3: Manager**
   - Email: `factory-manager@test.local`
   - Password: `TestPassword123!@#`

### Step 2: Get User IDs

After creating users, note their UUIDs from the Users list. You'll need these in the next step.

### Step 3: Run SQL Seed Script

1. Go to [Supabase Dashboard → SQL Editor](https://supabase.com/dashboard/project/benptbfiudpfvmvwxcjm/sql/new)
2. Open `scripts/seed-test-users.sql`
3. Replace placeholders with actual User IDs:
   - `{OWNER_UUID_1}` → Operator's user ID
   - `{OWNER_UUID_2}` → Approver's user ID
   - `{OWNER_UUID_3}` → Manager's user ID
4. Click **"Run"**

---

## Testing the Setup

### 1. Test Login

Open [pos.askbiz.co](https://pos.askbiz.co) and log in with:
- Email: `factory-operator@test.local`
- Password: `TestPassword123!@#`

You should land on the Factory hub dashboard.

### 2. Test Operator Permissions

With the operator account, you can:
- ✅ Take production capture photos (Intake, Output, Wastage)
- ✅ Report machine downtime
- ✅ Log defects
- ✅ Scan batch labels
- ✅ Start/end shifts
- ✅ Photograph waybills

But you **cannot**:
- ❌ Approve captures (only supervisors can)
- ❌ Manage settings
- ❌ Export data

### 3. Test Approver Permissions

Log in as `factory-approver@test.local` and go to `/factory/approvals`:
- ✅ See pending captures
- ✅ Approve or reject captures
- ✅ All operator permissions

### 4. Test Manager Permissions

Log in as `factory-manager@test.local`:
- ✅ All approver + operator permissions
- ✅ Export production logs (when available)
- ✅ Manage settings

---

## Available Factory Features to Test

Once logged in as any test user, you can test these 6 Factory Analytics stages:

### Stage 1: Production Captures
- **Route**: `/factory/capture`
- **Actions**: Log intake, output, wastage, dispatch photos
- **Permissions**: `camera.output`, `camera.wastage`

### Stage 2: Downtime Tracking
- **Route**: `/factory/downtime`
- **Actions**: Report machine downtime with reason + duration
- **Permissions**: `camera.output`, `camera.wastage`

### Stage 3: Quality Defect Tracking
- **Route**: `/factory/quality`
- **Actions**: Log defects by type (dimensional, surface, etc.) and severity (critical, major, minor)
- **Permissions**: `camera.output`, `camera.wastage`

### Stage 4: Batch Traceability
- **Route**: `/factory/batch`
- **Actions**: Scan batch labels at 5 checkpoints (intake → dispatch)
- **Permissions**: `camera.output`, `camera.wastage`

### Stage 5: Shift Output Verification
- **Route**: `/factory/shift`
- **Actions**: Start shift (morning/afternoon/night/custom) with floor photo, end with output photo
- **Permissions**: `camera.output`, `camera.wastage`

### Stage 6: Waybill On-Time Dispatch
- **Route**: `/factory/waybill`
- **Actions**: Photograph waybill before dispatch, track on-time delivery vs schedule
- **Permissions**: `camera.output`, `camera.wastage`

### Approvals Dashboard
- **Route**: `/factory/approvals`
- **Actions**: Review and approve/reject pending captures
- **Permissions**: `capture.approve`

---

## Permissions Reference

### Available Permissions
```
camera.output       — Capture production photos (intake, output, dispatch)
camera.wastage      — Capture waste/scrap photos
capture.approve     — Approve/reject captures as supervisor
data.export         — Export production logs (future feature)
settings.manage     — Modify factory settings (future feature)
```

### Role-Permission Mapping
```
worker:
  - camera.output
  - camera.wastage

supervisor:
  - camera.output
  - camera.wastage
  - capture.approve

manager:
  - camera.output
  - camera.wastage
  - capture.approve
  - data.export
  - settings.manage
```

---

## Troubleshooting

### "User already exists" error
If you run the setup script twice, it will skip existing users. To recreate, delete users from the Supabase dashboard first.

### Can't see Factory routes
Make sure you're logged in at [pos.askbiz.co](https://pos.askbiz.co), not askbiz.co (which is the owner dashboard).

### Permission denied on a feature
Check your user's role:
- Approvals require `capture.approve` (supervisor+ only)
- Captures require `camera.output` or `camera.wastage` (all roles)

### "pos_staff not found" error
Run the SQL seed script to create the staff records. The Node.js script does this automatically.

---

## Cleanup

To delete test users:

1. **Via Dashboard**:
   - Go to [Authentication → Users](https://supabase.com/dashboard/project/benptbfiudpfvmvwxcjm/auth/users)
   - Click the 3-dot menu on each test user → Delete user

2. **Via SQL**:
   ```sql
   DELETE FROM public.pos_staff
   WHERE email LIKE '%@test.local';
   
   -- Note: Deleting auth users requires dashboard UI
   ```

---

## Next Steps

After creating test users:

1. **Create a location** (the script does this automatically):
   - Factory Floor A
   - Address: 123 Industrial Avenue
   - City: Accra
   - Country: Ghana
   - Currency: GHS (Ghanaian Cedis)

2. **Run the 6 factory stages** to populate sample data

3. **Review production logs** at `/factory` hub to see aggregated stats

4. **Test approval workflow** by logging in as approver and reviewing captures

---

## Questions?

- **Supabase Docs**: https://supabase.com/docs
- **Factory Analytics Guide**: See README.md in project root
- **Permission System**: See `lib/pos-permissions.ts`
