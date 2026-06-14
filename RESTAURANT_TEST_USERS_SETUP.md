# Restaurant Test Users Setup

This guide explains how to create test users for the Restaurant section (pos.askbiz.co/restaurant).

## Overview

Three test user accounts are available:

| Email | Role | Permissions | Use Case |
|-------|------|-------------|----------|
| `restaurant-server@test.local` | Server | Take orders, view orders, print | Floor staff, order entry |
| `restaurant-manager@test.local` | Manager | Staff mgmt, analytics, settings | Operations management |
| `restaurant-owner@test.local` | Owner | Full access (*) | Complete control |

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
   npm run setup:restaurant-users
   ```

3. **Verify in Supabase Dashboard**
   - Go to [Authentication → Users](https://supabase.com/dashboard/project/benptbfiudpfvmvwxcjm/auth/users)
   - You should see 3 new users created

---

## Testing the Setup

### 1. Test Server Login

Open [pos.askbiz.co](https://pos.askbiz.co) and log in with:
- Email: `restaurant-server@test.local`
- Password: `TestPassword123!@#`

You should land on the Restaurant hub dashboard.

### 2. Test Server Permissions

With the server account, you can:
- ✅ View orders
- ✅ Take new orders
- ✅ Print tickets
- ✅ Access floor plan
- ✅ Access kitchen display
- ✅ Access menu

But you **cannot**:
- ❌ Manage staff
- ❌ View analytics
- ❌ Change settings

### 3. Test Manager Permissions

Log in as `restaurant-manager@test.local` and you can:
- ✅ All server permissions
- ✅ Staff management (/restaurant/staff)
- ✅ View analytics & reports
- ✅ Access settings
- ✅ Manage locations

### 4. Test Owner Permissions

Log in as `restaurant-owner@test.local`:
- ✅ Full access to all features
- ✅ All settings available
- ✅ Can view all data

---

## Available Restaurant Features to Test

Once logged in as any test user, you can test these sections:

### Floor Plan
- **Route**: `/restaurant/floor`
- **Actions**: View table status, manage reservations
- **Permissions**: `orders.view`, `orders.take`

### Orders
- **Route**: `/restaurant/orders`
- **Actions**: Take orders, modify, cancel
- **Permissions**: `orders.take`, `orders.print`

### Kitchen Display (KDS)
- **Route**: `/restaurant/kitchen`
- **Actions**: View pending orders, mark ready
- **Permissions**: `orders.view` (read-only for non-kitchen staff)

### Menu
- **Route**: `/restaurant/menu`
- **Actions**: View menu, search items
- **Permissions**: `orders.view` (read-only for non-managers)

### Analytics & Staff Performance
- **Route**: `/restaurant/staff`
- **Actions**: View server performance, shifts, revenue
- **Permissions**: `analytics.view` (managers+)

### Reservations
- **Route**: `/restaurant/reservations`
- **Actions**: Manage bookings, covers
- **Permissions**: `orders.view`, `orders.take`

### Labour (Shift Management)
- **Route**: `/restaurant/labor`
- **Actions**: Clock in/out, track hours
- **Permissions**: `orders.view`

### Waste Tracking
- **Route**: `/restaurant/waste`
- **Actions**: Log food waste by category
- **Permissions**: `orders.view` (managers can manage)

### Online Orders
- **Route**: `/restaurant/online-orders`
- **Actions**: Manage Uber Eats, DoorDash, Grubhub orders (when Team B integrations ready)
- **Permissions**: `orders.view`, `orders.take`

### Settings
- **Route**: `/restaurant/settings`
- **Actions**: Configure restaurant, integrations, payment
- **Permissions**: `settings.manage` (managers+)

---

## Permissions Reference

### Available Permissions
```
orders.view         — View orders and order status
orders.take         — Take new orders, modify
orders.print        — Print receipts/tickets
staff.manage        — Manage staff, assign roles
analytics.view      — View reports and analytics
settings.manage     — Modify restaurant settings
*                   — Full access (owner only)
```

### Role-Permission Mapping
```
server:
  - orders.view
  - orders.take
  - orders.print

manager:
  - orders.view
  - orders.take
  - orders.print
  - staff.manage
  - analytics.view
  - settings.manage

owner:
  - *
```

---

## Design Testing

The Restaurant section uses:
- **Dark theme** by default (#0f172a background)
- **Light theme** coming in Phase A-3 (per Team A plan)
- **Responsive design** for iPad, tablet, desktop
- **Real-time updates** (30-second polling on hub)

### Test Theme Toggle
```javascript
// In browser console:
localStorage.setItem('theme', 'light'); // or 'dark'
location.reload();
```

---

## Troubleshooting

### "User already exists" error
If you run the setup script twice, it will skip existing users. To recreate:
1. Delete users from [Supabase Dashboard → Authentication → Users](https://supabase.com/dashboard/project/benptbfiudpfvmvwxcjm/auth/users)
2. Run the script again

### Can't see Restaurant routes
Make sure you're logged in at [pos.askbiz.co](https://pos.askbiz.co), not askbiz.co (which is the owner dashboard).

### Permission denied on a feature
Check your user's role:
- Server: orders only (no staff, analytics, settings)
- Manager: full restaurant features (no accounting)
- Owner: everything

### "pos_staff not found" error
The setup script creates staff records automatically. If you get this error:
1. Check that the script ran successfully (look for "✅ Staff record created")
2. Verify in Supabase that the user exists in pos_staff table
3. Run the script again

---

## Integration Testing (Team B)

Once Team B completes Phase B-6 (integrations settings UI), you can:

1. **Log in as manager**: `restaurant-manager@test.local`
2. **Go to `/restaurant/integrations`** (once built)
3. **Connect platform**:
   - Click "Connect Uber Eats"
   - Redirect to Uber sandbox OAuth
   - Authorize
   - Credentials saved

4. **Test order flow**:
   - Uber Eats sends test order webhook
   - Order appears in `/restaurant/orders`
   - Mark ready → Uber notified
   - Driver picks up

---

## Performance Testing

Use the **server** account for realistic testing:
- Open Floor Plan
- Take 3-4 orders
- View them in Kitchen
- Mark as ready
- Close orders

Monitor:
- Page load time (<3s)
- Order creation latency (<500ms)
- Hub refresh (30s polling)
- No jank during transitions

---

## Next Steps

After creating test users:

1. **For Team A**: Use server account to test UI polish changes
2. **For Team B**: Use manager account to test integrations once ready
3. **For QA**: Use all three roles to test permission enforcement

---

## Questions?

- **Supabase Docs**: https://supabase.com/docs
- **Restaurant Feature Guide**: See `/RESTAURANT_DESIGN_RESEARCH_SYNTHESIS.md`
- **Permission System**: See `lib/pos-permissions.ts`

Happy testing! 🍽️
