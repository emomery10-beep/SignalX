# Staff Role Templates — Summary

You now have a complete **staff role template system** for onboarding new restaurants and factories. This is NOT individual user accounts — these are reusable role/permission templates that customers can select during signup.

---

## What Was Created

### 1. **Staff Template Data** (`lib/staff-templates.ts`)
   - **5 Factory templates:** Line Operator, Quality Inspector, Shift Supervisor, Production Manager, Inventory Manager
   - **8 Restaurant templates:** Server, Lead Server, Host, Head Chef, Kitchen Manager, Line Cook, Operations Manager, Cashier
   - Each template includes:
     - Pre-configured permissions
     - Job responsibilities
     - Suggested team size
     - Visual branding (icon, color)
   - Quick-start recommendations by business type & size

### 2. **Template Selector Component** (`components/staff-template-selector.tsx`)
   - Interactive React component for role selection
   - Displays all available templates for a business type
   - Shows quick-start recommendations
   - Expandable template details (responsibilities, permissions)
   - Multi-select with summary

### 3. **Onboarding Flow** (`app/onboarding/staff-setup/page.tsx`)
   - 4-step wizard:
     1. **Select Business Type** (Factory or Restaurant)
     2. **Select Team Size** (Small, Medium, Large)
     3. **Select Role Templates** (with quick-start recommendation)
     4. **Confirm & Create**

### 4. **Complete Documentation** (`docs/STAFF_TEMPLATES_GUIDE.md`)
   - Template-by-template reference
   - Frontend usage examples
   - Backend integration guide
   - Database schema
   - API endpoint specifications
   - Best practices & customization examples

---

## How It Works

### For New Customers

1. **Sign Up**
   - Create account
   - Choose business type (Factory or Restaurant)

2. **Configure Team**
   - Choose team size (small, medium, large)
   - See recommended roles for their size
   - Browse all available roles
   - Select which roles they need
   - Confirm selection

3. **Start Operating**
   - Roles are created with pre-configured permissions
   - Can customize permissions anytime
   - Invite team members and assign them to roles

### For Your System

```
New Signup
   ↓
Choose Business Type (Factory/Restaurant)
   ↓
Choose Team Size (S/M/L)
   ↓
Select Role Templates → Save to Database as pos_staff_roles
   ↓
Customers invite team members → Assign to created roles
   ↓
Team members log in with role-based permissions
```

---

## File Structure

```
lib/
  └── staff-templates.ts                    # Template data & helpers
  
components/
  └── staff-template-selector.tsx          # React UI component
  
app/
  └── onboarding/
      └── staff-setup/
          └── page.tsx                     # 4-step onboarding flow
  
docs/
  └── STAFF_TEMPLATES_GUIDE.md             # Complete reference
  
STAFF_TEMPLATES_SUMMARY.md                 # This file
```

---

## Factory Templates

| Role | Permissions | Team Size | Focus |
|------|-------------|-----------|-------|
| **Line Operator** 👷 | camera.output, camera.wastage | 3-8/shift | Production floor capture |
| **Quality Inspector** 🔍 | + capture.approve | 1-2/shift | QA & approval |
| **Shift Supervisor** 👔 | + capture.approve | 1/shift | Shift management |
| **Production Manager** 🎯 | + data.export, settings.manage | 1-2 total | Full operations |
| **Inventory Manager** 📦 | camera.output, camera.wastage | 2-4/shift | Batch tracking |

---

## Restaurant Templates

| Role | Permissions | Team Size | Focus |
|------|-------------|-----------|-------|
| **Server** 🍽️ | orders.view, orders.take, orders.print | 4-8/shift | Table service |
| **Lead Server** ⭐ | Same as server | 1-2/shift | Floor coordination |
| **Host** 🎫 | orders.view | 1-2/shift | Seating & reservations |
| **Head Chef** 👨‍🍳 | orders.*, staff.manage, analytics.view, settings.manage | 1 total | Kitchen mgmt |
| **Kitchen Manager** 🍳 | Same as Head Chef | 1/shift | Kitchen ops |
| **Line Cook** 🔪 | orders.view | 2-5/shift | Station prep |
| **Operations Manager** 🎯 | orders.*, staff.manage, analytics.view, settings.manage | 1-2 total | Full operations |
| **Cashier** 💳 | orders.view | 1-3/shift | POS & payments |

---

## Quick Start Recommendations

### Small Factory (1-15 people)
- Line Operator
- Quality Inspector
- Production Manager

### Medium Factory (15-50 people)
- Line Operator
- Quality Inspector
- Shift Supervisor
- Production Manager
- Inventory Manager

### Small Restaurant (1-15 people)
- Server
- Head Chef
- Operations Manager

### Medium Restaurant (15-50 people)
- Server
- Lead Server
- Head Chef
- Kitchen Manager
- Operations Manager

### Large Restaurant (50+ people)
- Server
- Lead Server
- Host
- Head Chef
- Kitchen Manager
- Line Cook
- Cashier
- Operations Manager

---

## Key Features

✅ **Pre-configured** — Roles come with industry-standard permissions
✅ **Recommended** — Quick-start combinations based on team size
✅ **Flexible** — Customers can pick any combination of roles
✅ **Customizable** — Permissions can be modified after creation
✅ **Scalable** — Works for teams of any size
✅ **Reusable** — Template data never changes; customers select from pool
✅ **Well-documented** — Each template explains responsibilities and team sizing

---

## What It Replaces

**Previous approach** ❌
- Individual user account setup scripts
- Hardcoded test users (Chef Weighter, Maria Santos, etc.)
- Manual role creation per customer

**New approach** ✅
- Reusable role templates
- Customers self-select during onboarding
- Scalable, one-template-per-role-type system
- No hardcoded individual accounts

---

## Next Steps

### To integrate into your signup flow:

1. **Link to onboarding page**
   ```typescript
   // After user creates account
   router.push('/onboarding/staff-setup')
   ```

2. **Create API endpoint to save templates**
   ```typescript
   POST /api/onboarding/staff-setup
   {
     locationId: "loc_123",
     templateIds: ["factory-line-operator", "factory-quality-inspector"]
   }
   ```

3. **Insert roles into database**
   ```sql
   INSERT INTO pos_staff_roles (location_id, name, permissions, metadata)
   VALUES (...)
   ```

4. **Let customers invite team members**
   - Assign team members to the created roles
   - Roles provide permissions

### To customize:

- **Add new template:** Update `FACTORY_TEMPLATES` or `RESTAURANT_TEMPLATES` in `lib/staff-templates.ts`
- **Change permissions:** Edit `defaultPermissions` array in any template
- **Modify onboarding:** Update `app/onboarding/staff-setup/page.tsx`
- **Adjust UI:** Modify `components/staff-template-selector.tsx`

---

## Permission Reference

### Factory Permissions
- `camera.output` — Capture production photos
- `camera.wastage` — Log wastage tracking
- `capture.approve` — Approve/reject captures
- `data.export` — Export reports
- `settings.manage` — Manage factory settings

### Restaurant Permissions
- `orders.view` — View orders
- `orders.take` — Create/modify orders
- `orders.print` — Print receipts/tickets
- `staff.manage` — Manage staff
- `analytics.view` — View reports
- `settings.manage` — Manage settings

---

## Database Integration

### Create Roles from Selected Templates

```typescript
const selectedTemplateIds = ['factory-line-operator', 'factory-quality-inspector']

for (const templateId of selectedTemplateIds) {
  const template = getTemplateById(templateId, 'factory')
  
  await supabase
    .from('pos_staff_roles')
    .insert({
      location_id: locationId,
      name: template.name,
      description: template.description,
      permissions: template.defaultPermissions,
      metadata: {
        template_id: templateId,
        icon: template.icon,
        color: template.color,
        responsibilities: template.responsibilities,
      }
    })
}
```

### Assign Staff Member to Role

```typescript
await supabase
  .from('pos_staff')
  .insert({
    location_id: locationId,
    role_id: roleId,
    name: staffName,
    email: staffEmail,
    permissions: role.permissions, // Inherited from template
  })
```

---

## Files Reference

| File | Purpose |
|------|---------|
| `lib/staff-templates.ts` | Template data, types, helpers |
| `components/staff-template-selector.tsx` | Role selection UI |
| `app/onboarding/staff-setup/page.tsx` | Onboarding wizard |
| `docs/STAFF_TEMPLATES_GUIDE.md` | Complete documentation |
| `STAFF_TEMPLATES_SUMMARY.md` | This summary |

---

## Questions?

Refer to:
- **How to use templates?** → `docs/STAFF_TEMPLATES_GUIDE.md`
- **How to customize?** → `lib/staff-templates.ts`
- **How to integrate?** → `docs/STAFF_TEMPLATES_GUIDE.md` (Backend Usage section)
- **How does UI work?** → `components/staff-template-selector.tsx`

---

## Summary

You now have:

✅ **13 pre-configured staff role templates** (5 factory, 8 restaurant)
✅ **Interactive template selector component** for choosing roles
✅ **4-step onboarding flow** for new customers
✅ **Quick-start recommendations** based on team size
✅ **Complete documentation** for frontend & backend integration
✅ **Reusable, scalable system** for customer onboarding

This is a complete role-template system ready to integrate into your signup flow. Customers select roles, roles get created with pre-configured permissions, team members are assigned to roles.

No individual account setup. No hardcoded test users. Just templates that customers can reuse and customize.
