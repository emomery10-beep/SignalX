# Staff Templates — Admin Integration Guide

This guide shows how to integrate staff templates into your existing POS admin interface at `/pos?tab=staff`.

## Current Status

✅ **Created:**
- Staff template data (`lib/staff-templates.ts`)
- Staff templates admin component (`components/pos/StaffTemplatesTab.tsx`)
- API endpoint to create staff from templates (`app/api/pos/staff-templates/route.ts`)
- Onboarding flow (`app/onboarding/staff-setup/page.tsx`)

❌ **Not Yet Integrated:**
- Staff templates tab not added to `/pos?tab=staff`
- Template selection not wired into the staff creation form
- Permissions not being saved with staff records

## Integration Steps

### Step 1: Add Staff Templates Tab to POS Admin

In `/app/(app)/pos/page.tsx`, add the import:

```typescript
import StaffTemplatesTab from '@/components/pos/StaffTemplatesTab'
```

Add to the Tab type:
```typescript
type Tab = 'overview' | 'services' | 'staff' | 'inventory' | ... | 'staff_templates' | ...
```

In the tab navigation (around line 1700), add a new tab button:

```typescript
<button
  onClick={() => handleSetTab('staff_templates')}
  style={{
    ...tab === 'staff_templates' ? activeTabStyle : inactiveTabStyle
  }}
>
  🧑‍💼 Staff Templates
</button>
```

Add the tab content panel:

```typescript
{tab === 'staff_templates' && (
  <StaffTemplatesTab
    businessType={businessType === 'restaurant' ? 'restaurant' : 'factory'}
    onSelectTemplate={(template) => {
      // When user clicks "Use This Template"
      // Pre-fill the role selection dropdown
      // Set it to use this template's permissions
      setShowAddStaff(true)
      setNewRole(template.id as any) // Store template ID
      // In the form UI, show template details
    }}
  />
)}
```

### Step 2: Update Staff Creation Form

In the "Add Staff" form (around line 1750), modify the role selection dropdown:

**Current:**
```typescript
<select value={newRole} onChange={(e) => setNewRole(e.target.value as any)}>
  <option value="cashier">Cashier</option>
  <option value="inventory">Inventory</option>
  ...
</select>
```

**Updated:**
```typescript
<div>
  <label>Role (select from templates or choose custom)</label>
  <select value={newRole} onChange={(e) => setNewRole(e.target.value as any)}>
    <optgroup label="— Factory Roles —">
      <option value="factory-line-operator">Line Operator</option>
      <option value="factory-quality-inspector">Quality Inspector</option>
      <option value="factory-shift-supervisor">Shift Supervisor</option>
      <option value="factory-production-manager">Production Manager</option>
      <option value="factory-inventory-manager">Inventory Manager</option>
    </optgroup>
    <optgroup label="— Restaurant Roles —">
      <option value="restaurant-server">Server</option>
      <option value="restaurant-lead-server">Lead Server</option>
      <option value="restaurant-host">Host</option>
      <option value="restaurant-head-chef">Head Chef</option>
      <option value="restaurant-kitchen-manager">Kitchen Manager</option>
      <option value="restaurant-line-cook">Line Cook</option>
      <option value="restaurant-operations-manager">Operations Manager</option>
      <option value="restaurant-cashier">Cashier</option>
    </optgroup>
    <optgroup label="— Legacy Roles —">
      <option value="cashier">Cashier (Legacy)</option>
      <option value="inventory">Inventory (Legacy)</option>
      <option value="repair">Repair (Legacy)</option>
      <option value="engineer">Engineer (Legacy)</option>
      <option value="supervisor">Supervisor (Legacy)</option>
      <option value="manager">Manager (Legacy)</option>
    </optgroup>
  </select>
</div>

{/* Show template details when a template is selected */}
{newRole && newRole.includes('-') && (
  <div style={{ background: '#f0f8ff', padding: 12, borderRadius: 8, marginTop: 12 }}>
    {(() => {
      const template = getTemplateById(newRole, 'factory')
      return template ? (
        <>
          <p><strong>Template:</strong> {template.name}</p>
          <p><strong>Description:</strong> {template.description}</p>
          <p><strong>Permissions:</strong> {template.defaultPermissions.join(', ')}</p>
        </>
      ) : null
    })()}
  </div>
)}
```

### Step 3: Update handleAddStaff to Use Templates

Modify the `handleAddStaff` function (around line 550):

```typescript
const handleAddStaff = async () => {
  if ((!newPhone && !newEmail) || !newName) return
  if (newPin && (newPin.length < 4 || newPin.length > 6 || !/^\d+$/.test(newPin))) {
    notify('PIN must be 4-6 digits', false)
    return
  }

  setAddingStaff(true)
  try {
    // Check if using a template (has dash in role ID)
    if (newRole.includes('-')) {
      // Use template-based creation
      const isFactory = newRole.startsWith('factory-')
      const res = await fetch('/api/pos/staff-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName,
          email: newEmail || undefined,
          phone: newPhone || undefined,
          pin: newPin || undefined,
          templateId: newRole,
          businessType: isFactory ? 'factory' : 'restaurant',
          location_id: newLocationId || undefined,
          sector: selectedSector !== 'all' ? selectedSector : undefined,
        }),
      })
      const data = await res.json()
      if (data.staff) {
        setStaff((prev) => [...prev, data.staff])
        setNewPhone('')
        setNewEmail('')
        setNewName('')
        setNewRole('cashier')
        setNewPin('')
        setNewLocationId('')
        setShowAddStaff(false)
        notify(`${data.staff.name} added with ${data.staff.template?.name} permissions`)
      } else {
        notify(data.error || 'Failed to add staff', false)
      }
    } else {
      // Use legacy creation (existing behavior)
      const sectorForRole = ['handler', 'driver', 'dispatcher', 'branch_manager'].includes(newRole)
        ? 'logistics'
        : selectedSector !== 'all'
          ? selectedSector
          : undefined
      const res = await fetch('/api/pos/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: newPhone || undefined,
          email: newEmail || undefined,
          name: newName,
          role: newRole,
          pin: newPin || undefined,
          location_id: newLocationId || undefined,
          sector: sectorForRole,
        }),
      })
      const data = await res.json()
      if (data.staff) {
        setStaff((prev) => [...prev, data.staff])
        setNewPhone('')
        setNewEmail('')
        setNewName('')
        setNewRole('cashier')
        setNewPin('')
        setNewLocationId('')
        setShowAddStaff(false)
        notify(`${data.staff.name} added`)
      } else if (data.seat_limit) {
        notify(data.error, false)
      } else if (data.error) {
        notify(data.error, false)
      }
    }
  } catch (error) {
    notify('Failed to add staff', false)
  }
  setAddingStaff(false)
}
```

### Step 4: Import Template Helper

At the top of `/app/(app)/pos/page.tsx`, add:

```typescript
import { getTemplateById } from '@/lib/staff-templates'
```

## Files Ready for Integration

| File | Purpose | Status |
|------|---------|--------|
| `lib/staff-templates.ts` | Template data & types | ✅ Ready |
| `components/pos/StaffTemplatesTab.tsx` | Admin templates view | ✅ Ready |
| `app/api/pos/staff-templates/route.ts` | Create staff from templates | ✅ Ready |
| `app/(app)/pos/page.tsx` | Main POS admin page | ⏳ Needs integration |

## What This Achieves

After integration:

1. **New "Staff Templates" Tab** in POS admin
   - View all available templates
   - See permissions for each template
   - See responsibilities
   - One-click selection

2. **Template-Based Staff Creation**
   - When creating staff, can choose from templates
   - Templates pre-populate permissions
   - Staff created with template metadata

3. **Full Permissions Support**
   - Permissions saved in staff record's metadata
   - Can be queried and enforced by RLS policies
   - Can be customized after creation

4. **Backward Compatibility**
   - Old role types still work (cashier, inventory, repair, etc.)
   - Templates work alongside legacy roles
   - No breaking changes

## Testing After Integration

1. **Navigate to `/pos?tab=staff_templates`**
   - See all available templates
   - View template details
   - Click "Use This Template"

2. **Create a staff member from template**
   - Form pre-fills with template
   - Shows template details (name, permissions, responsibilities)
   - Click "Add staff member"
   - Staff is created with template permissions

3. **Verify permissions saved**
   - Check Supabase `pos_staff` table
   - Staff record should have:
     ```
     metadata: {
       template_id: "factory-line-operator",
       template_name: "Line Operator",
       permissions: ["camera.output", "camera.wastage"],
       responsibilities: [...]
     }
     ```

4. **Edit existing staff**
   - Can change their template/permissions
   - Changes are saved to metadata

## API Reference

### POST /api/pos/staff-templates

Create a staff member from a template.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "templateId": "factory-line-operator",
  "businessType": "factory",
  "location_id": "loc_123",
  "pin": "1234",
  "sector": "production"
}
```

**Response:**
```json
{
  "success": true,
  "staff": {
    "id": "staff_123",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "factory-line-operator",
    "permissions": ["camera.output", "camera.wastage"],
    "template": {
      "id": "factory-line-operator",
      "name": "Line Operator",
      "permissions": ["camera.output", "camera.wastage"]
    }
  }
}
```

## Next Steps

1. **Integrate into POS admin page** (Follow Step 1-4 above)
2. **Test staff creation from templates**
3. **Wire up RLS policies** to use template permissions
4. **Deploy** to production

## Troubleshooting

### Templates not showing in dropdown

**Check:** Are you importing `getTemplateById` at the top of page.tsx?

```typescript
import { getTemplateById } from '@/lib/staff-templates'
```

### Staff created but permissions not saved

**Check:** Verify the API response includes permissions in metadata:

```bash
curl http://localhost:3000/api/pos/staff-templates -X POST -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "test@example.com",
    "templateId": "factory-line-operator",
    "businessType": "factory"
  }'
```

### "Role not found" error

**Check:** Template ID might be incorrect. Verify in `lib/staff-templates.ts`:

```typescript
// Factory templates
export const FACTORY_TEMPLATES: StaffTemplate[] = [
  { id: 'factory-line-operator', ... },
  { id: 'factory-quality-inspector', ... },
  ...
]
```

## Questions?

Refer to:
- Template data: `lib/staff-templates.ts`
- Admin component: `components/pos/StaffTemplatesTab.tsx`
- API endpoint: `app/api/pos/staff-templates/route.ts`
- Onboarding: `app/onboarding/staff-setup/page.tsx`
- Documentation: `docs/STAFF_TEMPLATES_GUIDE.md`
