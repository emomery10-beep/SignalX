# Actual Staff Setup & Credentials

This guide documents the real staff members created for both Factory and Restaurant sections with their roles, permissions, and login credentials.

---

## 🏭 **FACTORY STAFF**

### 1. Chef Weighter (Production Supervisor)
```
Name:        Chef Weighter
Email:       chef.weighter@factory.local
Password:    ChefWeighter123!@#
Phone:       +1-555-0101
Role:        Supervisor
Job Title:   Production Supervisor

Permissions:
  ✓ camera.output      (Capture production photos)
  ✓ camera.wastage     (Log wastage)
  ✓ capture.approve    (Approve/reject captures)

Access:      https://pos.askbiz.co/factory
```

**What Chef Weighter can do:**
- Capture production photos (intake, output, dispatch)
- Log and track wastage
- Approve or reject capture submissions
- View downtime and quality reports
- Track shift output
- View batch traceability
- Manage waybills and on-time dispatch

**Cannot do:**
- Export data
- Manage factory settings
- Assign staff roles

---

### 2. Maria Santos (Line Operator)
```
Name:        Maria Santos
Email:       maria.santos@factory.local
Password:    MariaProduction123!@#
Phone:       +1-555-0102
Role:        Worker
Job Title:   Line Operator

Permissions:
  ✓ camera.output      (Capture production photos)
  ✓ camera.wastage     (Log wastage)

Access:      https://pos.askbiz.co/factory
```

**What Maria can do:**
- Capture production photos
- Log wastage
- Report machine downtime
- Log quality defects
- Scan batch labels
- Start/end shifts
- Photograph waybills

**Cannot do:**
- Approve captures
- Export data
- Manage settings

---

### 3. Robert Chen (Quality Inspector)
```
Name:        Robert Chen
Email:       robert.chen@factory.local
Password:    RobertQuality123!@#
Phone:       +1-555-0103
Role:        Supervisor
Job Title:   Quality Inspector

Permissions:
  ✓ camera.output      (Capture production photos)
  ✓ camera.wastage     (Log wastage)
  ✓ capture.approve    (Approve/reject captures)

Access:      https://pos.askbiz.co/factory
```

**What Robert can do:**
- All line operator tasks
- Approve/reject quality defect captures
- Review and approve production captures
- Access quality dashboards
- Track defect trends

---

### 4. Amara Okafor (Production Manager)
```
Name:        Amara Okafor
Email:       amara.okafor@factory.local
Password:    AmaraFactory123!@#
Phone:       +1-555-0104
Role:        Manager
Job Title:   Production Manager

Permissions:
  ✓ camera.output         (Capture production photos)
  ✓ camera.wastage        (Log wastage)
  ✓ capture.approve       (Approve/reject captures)
  ✓ data.export           (Export reports & logs)
  ✓ settings.manage       (Manage factory settings)

Access:      https://pos.askbiz.co/factory
```

**What Amara can do:**
- All supervisor/operator tasks
- Export production logs and analytics
- Manage factory settings
- Configure integrations
- Assign factory staff roles
- Full factory configuration

---

### 5. James Kozlov (Shift Operator)
```
Name:        James Kozlov
Email:       james.kozlov@factory.local
Password:    JamesShift123!@#
Phone:       +1-555-0105
Role:        Worker
Job Title:   Shift Operator

Permissions:
  ✓ camera.output      (Capture production photos)
  ✓ camera.wastage     (Log wastage)

Access:      https://pos.askbiz.co/factory
```

**What James can do:**
- Same as Line Operator
- Primary focus on shift management
- Output verification
- Handoff documentation

---

## 🍽️ **RESTAURANT STAFF**

### 1. Marcus Thompson (Head Chef)
```
Name:        Marcus Thompson
Email:       chef.marcus@restaurant.local
Password:    ChefMarcus123!@#
Phone:       +1-555-0201
Role:        Manager
Job Title:   Head Chef

Permissions:
  ✓ orders.view        (View all orders)
  ✓ orders.take        (Create/modify orders)
  ✓ orders.print       (Print tickets)
  ✓ staff.manage       (Manage kitchen staff)
  ✓ analytics.view     (View performance)
  ✓ settings.manage    (Configure kitchen)

Access:      https://pos.askbiz.co/restaurant
```

**What Marcus can do:**
- View all orders
- Create and modify orders
- Print kitchen tickets
- Manage kitchen staff
- View kitchen analytics and performance
- Configure kitchen display settings
- Menu management

---

### 2. Sophie Martin (Kitchen Manager)
```
Name:        Sophie Martin
Email:       sophie.martin@restaurant.local
Password:    SophieKitchen123!@#
Phone:       +1-555-0202
Role:        Manager
Job Title:   Kitchen Manager

Permissions:
  ✓ orders.view        (View all orders)
  ✓ orders.take        (Create/modify orders)
  ✓ orders.print       (Print tickets)
  ✓ staff.manage       (Manage kitchen staff)
  ✓ analytics.view     (View performance)
  ✓ settings.manage    (Configure kitchen)

Access:      https://pos.askbiz.co/restaurant
```

**What Sophie can do:**
- Same as Head Chef
- Coordinate kitchen operations
- Manage prep stations
- Track food costs
- Manage waste

---

### 3. Elena Garcia (Lead Server)
```
Name:        Elena Garcia
Email:       elena.garcia@restaurant.local
Password:    ElenaServer123!@#
Phone:       +1-555-0203
Role:        Server
Job Title:   Lead Server

Permissions:
  ✓ orders.view        (View orders)
  ✓ orders.take        (Create/modify orders)
  ✓ orders.print       (Print tickets)

Access:      https://pos.askbiz.co/restaurant
```

**What Elena can do:**
- View all orders on her section
- Take new orders from tables
- Modify orders (before kitchen)
- Print guest checks
- View bill status
- Manage table reservations

**Cannot do:**
- Manage staff
- View analytics
- Change settings

---

### 4. David Kim (Server)
```
Name:        David Kim
Email:       david.kim@restaurant.local
Password:    DavidServer123!@#
Phone:       +1-555-0204
Role:        Server
Job Title:   Server

Permissions:
  ✓ orders.view        (View orders)
  ✓ orders.take        (Create/modify orders)
  ✓ orders.print       (Print tickets)

Access:      https://pos.askbiz.co/restaurant
```

**What David can do:**
- Same as Lead Server
- Focused on table service
- Order entry and management

---

### 5. Yuki Tanaka (Operations Manager)
```
Name:        Yuki Tanaka
Email:       yuki.tanaka@restaurant.local
Password:    YukiManager123!@#
Phone:       +1-555-0205
Role:        Manager
Job Title:   Operations Manager

Permissions:
  ✓ orders.view        (View all orders)
  ✓ orders.take        (Create/modify orders)
  ✓ orders.print       (Print tickets)
  ✓ staff.manage       (Manage all staff)
  ✓ analytics.view     (View all analytics)
  ✓ settings.manage    (Configure system)

Access:      https://pos.askbiz.co/restaurant
```

**What Yuki can do:**
- All server tasks
- Manage all restaurant staff
- View full analytics and reports
- Configure restaurant settings
- Manage integrations with delivery platforms
- Labor cost tracking
- Price management

---

## 🚀 **HOW TO SET UP**

### Prerequisites
- Supabase Service Role Key from [Settings → API](https://supabase.com/dashboard/project/benptbfiudpfvmvwxcjm/settings/api)
- Node.js 16+ installed

### Setup Command

```bash
SUPABASE_SERVICE_ROLE_KEY="your_service_role_key_here" npm run setup:staff
```

This will:
1. ✅ Create 5 factory staff accounts
2. ✅ Create 5 restaurant staff accounts
3. ✅ Assign appropriate roles and permissions
4. ✅ Create locations for each
5. ✅ Print credentials for distribution

---

## 📋 **STAFF DIRECTORY**

| Name | Section | Role | Email | Status |
|------|---------|------|-------|--------|
| Chef Weighter | Factory | Supervisor | chef.weighter@factory.local | ✅ |
| Maria Santos | Factory | Worker | maria.santos@factory.local | ✅ |
| Robert Chen | Factory | Supervisor | robert.chen@factory.local | ✅ |
| Amara Okafor | Factory | Manager | amara.okafor@factory.local | ✅ |
| James Kozlov | Factory | Worker | james.kozlov@factory.local | ✅ |
| Marcus Thompson | Restaurant | Manager | chef.marcus@restaurant.local | ✅ |
| Sophie Martin | Restaurant | Manager | sophie.martin@restaurant.local | ✅ |
| Elena Garcia | Restaurant | Server | elena.garcia@restaurant.local | ✅ |
| David Kim | Restaurant | Server | david.kim@restaurant.local | ✅ |
| Yuki Tanaka | Restaurant | Manager | yuki.tanaka@restaurant.local | ✅ |

---

## 🔐 **SECURITY NOTES**

### Credential Distribution
- ⚠️ **DO NOT** commit credentials to Git
- Share credentials via secure channel (encrypted email, password manager, etc.)
- Use temporary initial passwords — users should change on first login
- For production: use single-sign-on (SSO) instead of local passwords

### First Login
Each staff member should:
1. Log in at https://pos.askbiz.co
2. Change password immediately
3. Set up 2FA (when available)
4. Review their assigned permissions

### Password Policy
- Minimum 12 characters (recommended)
- Include: uppercase, lowercase, numbers, symbols
- Change every 90 days
- Never reuse previous passwords

---

## 📱 **QUICK REFERENCE**

### Factory Entry Points
- **Hub Dashboard**: `/factory`
- **Production Captures**: `/factory/capture`
- **Downtime Tracking**: `/factory/downtime`
- **Quality Defects**: `/factory/quality`
- **Batch Traceability**: `/factory/batch`
- **Shift Management**: `/factory/shift`
- **Waybill Dispatch**: `/factory/waybill`
- **Approvals**: `/factory/approvals` (supervisors only)
- **Staff Management**: `/factory/staff` (manager only)

### Restaurant Entry Points
- **Hub Dashboard**: `/restaurant`
- **Floor Plan**: `/restaurant/floor`
- **Orders**: `/restaurant/orders`
- **Kitchen Display**: `/restaurant/kitchen`
- **Staff Performance**: `/restaurant/staff`
- **Analytics**: `/restaurant/analytics`
- **Integrations**: `/restaurant/integrations` (managers only)

---

## ✅ **VERIFICATION CHECKLIST**

After setup, verify:
- [ ] All 10 staff accounts created in Supabase Auth
- [ ] All staff records appear in pos_staff table
- [ ] Each staff has correct role and permissions
- [ ] Factory staff can access `/factory`
- [ ] Restaurant staff can access `/restaurant`
- [ ] Credentials are distributed securely
- [ ] Staff have changed initial passwords
- [ ] All staff can log in successfully

---

## ❓ **TROUBLESHOOTING**

### "User already exists" error
- Run the script again (will skip duplicates)
- Or manually delete accounts from Supabase Auth first

### Can't log in after setup
- Verify email is correct (case-sensitive in some systems)
- Check that pos_staff record exists
- Try resetting password in Supabase dashboard

### Missing permissions
- Check the staff member's role in pos_staff table
- Verify metadata.permissions field has correct values
- Refresh browser and try again

---

## 🎯 **NEXT STEPS**

1. **Run setup script**:
   ```bash
   SUPABASE_SERVICE_ROLE_KEY=$KEY npm run setup:staff
   ```

2. **Distribute credentials** to each team member securely

3. **Have each staff member** log in and change password

4. **Test workflows** in factory and restaurant sections

5. **Fine-tune permissions** as needed based on actual usage

---

**Questions?** Contact your system administrator or check the respective section guides:
- Factory: `/FACTORY_TEST_USERS_SETUP.md`
- Restaurant: `/RESTAURANT_TEST_USERS_SETUP.md`

Happy operating! 🚀
