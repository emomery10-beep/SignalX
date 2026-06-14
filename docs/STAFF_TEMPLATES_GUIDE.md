# Staff Role Templates Guide

A complete reference for using pre-configured staff role templates for customer onboarding.

## Overview

Staff role templates are **reusable permission configurations** that new restaurants and factories can select during signup to quickly establish their team structure. Instead of creating custom roles from scratch, customers choose from pre-configured templates like "Server," "Head Chef," "Line Operator," etc.

Each template includes:
- ✅ Role name and description
- ✅ Pre-configured permissions
- ✅ Suggested responsibilities
- ✅ Team size recommendation
- ✅ Visual branding (icon, color)

## Architecture

### Files

```
lib/staff-templates.ts
├── FACTORY_TEMPLATES (5 templates)
│   ├── Line Operator
│   ├── Quality Inspector
│   ├── Shift Supervisor
│   ├── Production Manager
│   └── Inventory Manager
│
├── RESTAURANT_TEMPLATES (8 templates)
│   ├── Server
│   ├── Lead Server
│   ├── Host
│   ├── Head Chef
│   ├── Kitchen Manager
│   ├── Line Cook
│   ├── Operations Manager
│   └── Cashier
│
├── QUICK_START_RECOMMENDATIONS
│   └── Pre-selected template combinations by business type & size
│
└── Helper Functions
    ├── getTemplateById(id, type)
    ├── getTemplatesByType(type)
    └── getTemplateColor(template)

components/staff-template-selector.tsx
└── React component for template selection UI

app/onboarding/staff-setup/page.tsx
└── Multi-step onboarding flow (type → size → templates → confirm)
```

## Factory Templates

### 1. Line Operator 👷

**Description:** Production floor staff capturing output and logging wastage

**Default Permissions:**
- `camera.output` — Capture production photos
- `camera.wastage` — Log wastage tracking

**Responsibilities:**
- Capture production photos (intake, output, dispatch)
- Log and track wastage
- Report machine downtime
- Log quality defects
- Scan batch labels
- Start and end shifts
- Photograph waybills

**Suggested Team Size:** 3-8 per shift

---

### 2. Quality Inspector 🔍

**Description:** QA staff reviewing and approving production captures

**Default Permissions:**
- `camera.output` — Capture production photos
- `camera.wastage` — Log wastage
- `capture.approve` — Approve/reject captures

**Responsibilities:**
- Approve or reject production captures
- Review quality defect reports
- Track defect trends and patterns
- Inspect batch quality at checkpoints
- Manage 86 board (out-of-stock items)
- Generate quality reports

**Suggested Team Size:** 1-2 per shift

---

### 3. Shift Supervisor 👔

**Description:** Shift lead coordinating team and approving data

**Default Permissions:**
- `camera.output`
- `camera.wastage`
- `capture.approve`

**Responsibilities:**
- Oversee production floor operations
- Approve staff captures and reports
- Manage shift coordination
- Handle escalations and issues
- Track shift performance metrics
- Coordinate with next shift

**Suggested Team Size:** 1 per shift

---

### 4. Production Manager 🎯

**Description:** Management staff overseeing all factory operations

**Default Permissions:**
- `camera.output`
- `camera.wastage`
- `capture.approve`
- `data.export` — Export reports and analytics
- `settings.manage` — Manage factory settings

**Responsibilities:**
- Oversee all production operations
- Review and approve captures
- Export reports and analytics
- Configure factory settings
- Manage staff and assign roles
- Handle integrations with delivery platforms
- Strategic production planning

**Suggested Team Size:** 1-2 total

---

### 5. Inventory Manager 📦

**Description:** Staff managing batch traceability and stock

**Default Permissions:**
- `camera.output`
- `camera.wastage`

**Responsibilities:**
- Scan batch labels at checkpoints
- Track batch traceability
- Manage intake and dispatch
- Monitor batch status transitions
- Log batch-level quality issues
- Coordinate batch movement

**Suggested Team Size:** 2-4 per shift

---

## Restaurant Templates

### 1. Server 🍽️

**Description:** Floor staff taking orders and serving tables

**Default Permissions:**
- `orders.view` — View orders and status
- `orders.take` — Create and modify orders
- `orders.print` — Print tickets and checks

**Responsibilities:**
- Take orders from tables
- Manage table reservations
- View order status and kitchen progress
- Print guest checks and receipts
- Process payments
- Manage customer requests
- Upsell menu items

**Suggested Team Size:** 4-8 per shift

---

### 2. Lead Server ⭐

**Description:** Senior server coordinating floor operations

**Default Permissions:**
- `orders.view`
- `orders.take`
- `orders.print`

**Responsibilities:**
- All server responsibilities
- Coordinate server team
- Handle VIP tables and requests
- Resolve customer issues
- Train junior servers
- Monitor table flow and timing

**Suggested Team Size:** 1-2 per shift

---

### 3. Host 🎫

**Description:** Front-of-house staff managing seating and reservations

**Default Permissions:**
- `orders.view`

**Responsibilities:**
- Manage table reservations
- Greet guests
- Manage waiting list
- Coordinate with servers on table readiness
- Handle cancellations
- Track wait times

**Suggested Team Size:** 1-2 per shift

---

### 4. Head Chef 👨‍🍳

**Description:** Kitchen management overseeing all food production

**Default Permissions:**
- `orders.view`
- `orders.take`
- `orders.print`
- `staff.manage` — Manage kitchen staff
- `analytics.view` — View performance reports
- `settings.manage` — Configure kitchen

**Responsibilities:**
- Oversee all kitchen operations
- Create and manage menu
- Manage kitchen staff
- Ensure food quality and consistency
- Handle food costs and inventory
- Plan special menus and events
- Train kitchen staff

**Suggested Team Size:** 1 total

---

### 5. Kitchen Manager 🍳

**Description:** Kitchen operations coordinator

**Default Permissions:**
- `orders.view`
- `orders.take`
- `orders.print`
- `staff.manage`
- `analytics.view`
- `settings.manage`

**Responsibilities:**
- Coordinate kitchen prep and cooking
- Manage kitchen staff during shift
- Ensure order timing and quality
- Track food costs
- Manage kitchen equipment
- Handle quality issues
- Monitor kitchen performance

**Suggested Team Size:** 1 per shift

---

### 6. Line Cook 🔪

**Description:** Kitchen staff preparing food at specific stations

**Default Permissions:**
- `orders.view`

**Responsibilities:**
- Prepare food at assigned station
- Follow recipes and plating standards
- Manage station inventory
- Work as part of team
- Maintain kitchen cleanliness
- Report ingredient shortages
- Coordinate with other cooks

**Suggested Team Size:** 2-5 per shift

---

### 7. Operations Manager 🎯

**Description:** Overall restaurant management and administration

**Default Permissions:**
- `orders.view`
- `orders.take`
- `orders.print`
- `staff.manage`
- `analytics.view`
- `settings.manage`

**Responsibilities:**
- Oversee all restaurant operations
- Manage staff scheduling and roles
- Review financial and sales reports
- Handle customer complaints
- Configure restaurant settings
- Manage integrations with delivery platforms
- Plan promotions and menus
- Ensure compliance and standards

**Suggested Team Size:** 1-2 total

---

### 8. Cashier 💳

**Description:** Point-of-sale and payment processing

**Default Permissions:**
- `orders.view`

**Responsibilities:**
- Process payments
- Issue receipts
- Handle cash drawer
- Reconcile sales
- Manage refunds and adjustments
- Process gift cards
- Handle customer inquiries

**Suggested Team Size:** 1-3 per shift

---

## Quick Start Recommendations

Customers can use pre-configured role combinations based on their business type and size:

### Factory Quick Start

**Small Factory (1-15 people):**
- Line Operator
- Quality Inspector
- Production Manager

**Medium Factory (15-50 people):**
- Line Operator
- Quality Inspector
- Shift Supervisor
- Production Manager
- Inventory Manager

**Large Factory (50+ people):**
- Line Operator
- Quality Inspector
- Shift Supervisor
- Production Manager
- Inventory Manager

### Restaurant Quick Start

**Small Restaurant (1-15 people):**
- Server
- Head Chef
- Operations Manager

**Medium Restaurant (15-50 people):**
- Server
- Lead Server
- Head Chef
- Kitchen Manager
- Operations Manager

**Large Restaurant (50+ people):**
- Server
- Lead Server
- Host
- Head Chef
- Kitchen Manager
- Line Cook
- Cashier
- Operations Manager

---

## Usage in Frontend

### 1. Import Templates

```typescript
import {
  FACTORY_TEMPLATES,
  RESTAURANT_TEMPLATES,
  getTemplateById,
  getTemplatesByType,
  QUICK_START_RECOMMENDATIONS,
} from '@/lib/staff-templates'
```

### 2. Use Template Selector Component

```typescript
import { StaffTemplateSelector } from '@/components/staff-template-selector'

export function MyOnboarding() {
  const handleSelect = (templateIds: string[]) => {
    // templateIds: ['factory-line-operator', 'factory-quality-inspector', ...]
    // Send to API to create roles
  }

  return (
    <StaffTemplateSelector
      type="factory"
      businessSize="medium"
      onSelect={handleSelect}
      onQuickStart={handleSelect}
    />
  )
}
```

### 3. Display Individual Template

```typescript
const template = getTemplateById('factory-line-operator', 'factory')

return (
  <div>
    <h3>{template.name}</h3>
    <p>{template.description}</p>
    <span>{template.icon}</span>
    <ul>
      {template.responsibilities.map(r => <li key={r}>{r}</li>)}
    </ul>
    <div>
      Permissions: {template.defaultPermissions.join(', ')}
    </div>
  </div>
)
```

---

## Usage in Backend

### 1. Create Staff Role from Template

When a customer selects templates, create actual staff roles in the database:

```typescript
// pages/api/onboarding/staff-setup.ts
import { getTemplateById } from '@/lib/staff-templates'

export async function POST(req: Request) {
  const { locationId, templateIds } = await req.json()

  for (const templateId of templateIds) {
    const template = getTemplateById(templateId, 'factory') // or 'restaurant'

    // Insert into pos_staff_roles table
    await supabase
      .from('pos_staff_roles')
      .insert({
        location_id: locationId,
        name: template.name,
        description: template.description,
        permissions: template.defaultPermissions,
        metadata: {
          template_id: templateId,
          responsibilities: template.responsibilities,
          suggested_team_size: template.suggestedTeamSize,
          icon: template.icon,
          color: template.color,
        },
      })
  }

  return { success: true }
}
```

### 2. Assign Role to Staff Member

```typescript
// When creating a new staff member, assign them a role
await supabase
  .from('pos_staff')
  .insert({
    location_id: locationId,
    role_id: roleId, // From the created role above
    name: 'John Doe',
    email: 'john@example.com',
    permissions: role.permissions, // From the template
  })
```

### 3. Customize Permissions After Setup

```typescript
// Customer can customize role permissions
await supabase
  .from('pos_staff_roles')
  .update({
    permissions: ['orders.view', 'orders.take'], // Add/remove as needed
  })
  .eq('id', roleId)
```

---

## Database Schema

### Relationship Diagram

```
Location
  ├── pos_staff_roles (created from templates)
  │   ├── template_id (e.g., 'factory-line-operator')
  │   ├── name (e.g., 'Line Operator')
  │   ├── permissions (array of strings)
  │   └── metadata (icon, color, responsibilities, etc.)
  │
  └── pos_staff (team members)
      ├── role_id → pos_staff_roles
      └── permissions (inherited from role)
```

### Create Roles from Template

```sql
INSERT INTO pos_staff_roles (location_id, name, permissions, metadata)
VALUES (
  'loc_123',
  'Line Operator',
  ARRAY['camera.output', 'camera.wastage'],
  jsonb_build_object(
    'template_id', 'factory-line-operator',
    'icon', '👷',
    'color', '#3b82f6',
    'responsibilities', ARRAY[
      'Capture production photos',
      'Log and track wastage',
      ...
    ]
  )
);
```

---

## Frontend Onboarding Flow

The `app/onboarding/staff-setup/page.tsx` implements a 4-step flow:

### Step 1: Select Business Type
- User chooses Factory or Restaurant
- Each shows sample roles and responsibilities

### Step 2: Select Team Size
- Small, Medium, or Large
- Determines recommended roles in next step

### Step 3: Select Role Templates
- Display all templates for the selected type
- Show quick-start recommendations
- Allow custom selection
- Expand individual templates to view details

### Step 4: Confirm & Create
- Review selected templates
- Show what will be created
- Explain next steps (customize, invite team)

---

## API Endpoints (TODO)

### Create Roles from Templates

```
POST /api/onboarding/staff-setup

Request:
{
  "locationId": "loc_123",
  "businessType": "factory",
  "businessSize": "medium",
  "templateIds": ["factory-line-operator", "factory-quality-inspector"]
}

Response:
{
  "success": true,
  "rolesCreated": [
    {
      "id": "role_123",
      "name": "Line Operator",
      "permissions": [...]
    },
    ...
  ]
}
```

### Get Templates

```
GET /api/staff-templates?type=factory

Response:
{
  "templates": [
    {
      "id": "factory-line-operator",
      "name": "Line Operator",
      "description": "...",
      "defaultPermissions": [...],
      "responsibilities": [...]
    },
    ...
  ]
}
```

---

## Best Practices

### ✅ DO

- **Provide quick-start recommendations** based on team size
- **Allow full customization** after setup
- **Store template_id in metadata** so roles can be updated when templates evolve
- **Document permissions** clearly for each role
- **Let customers modify permissions** even after choosing a template
- **Show responsibilities** to help customers understand what each role does
- **Use icons and colors** for visual clarity

### ❌ DON'T

- **Lock roles** after creation — customers must be able to customize
- **Force all templates** — let them pick and choose
- **Hide template metadata** — store it for auditing and future updates
- **Create staff members automatically** — templates create roles, not people
- **Require all roles** — let small teams use minimal roles

---

## Customization Examples

### Example 1: Add Permission to Existing Role

```typescript
const role = await getRole('role_123')
const template = getTemplateById(role.metadata.template_id, 'factory')

// Add new permission
const updatedPermissions = [
  ...role.permissions,
  'data.export'
]

await updateRole('role_123', {
  permissions: updatedPermissions
})
```

### Example 2: Create Custom Role Based on Template

```typescript
const baseTemplate = getTemplateById('factory-line-operator', 'factory')

// Create custom role with additional permissions
await createRole({
  name: 'Senior Line Operator',
  description: baseTemplate.description + ' (Senior)',
  permissions: [...baseTemplate.defaultPermissions, 'capture.approve'],
  metadata: {
    based_on_template: baseTemplate.id,
    customized: true,
  }
})
```

### Example 3: Clone and Modify Template

```typescript
const template = getTemplateById('restaurant-server', 'restaurant')

// Create a custom "Shift Lead" role
await createRole({
  name: 'Shift Lead Server',
  permissions: [
    ...template.defaultPermissions,
    'staff.manage', // Can manage other servers
    'analytics.view', // Can see shift analytics
  ],
  metadata: {
    based_on_template: template.id,
    role_level: 'lead',
  }
})
```

---

## Future Enhancements

- [ ] **Template versioning** — Track template evolution, migrate roles when templates change
- [ ] **Custom templates** — Let enterprise customers save their own role templates
- [ ] **Role inheritance** — Create role hierarchies
- [ ] **Permission groups** — Group related permissions (e.g., "analytics" includes view, export, etc.)
- [ ] **Role recommendations** — AI-based suggestions based on business metrics
- [ ] **Template marketplace** — Share templates between customers
- [ ] **Audit trail** — Track role and permission changes

---

## Questions?

Refer to:
- **Component usage:** `components/staff-template-selector.tsx`
- **Template data:** `lib/staff-templates.ts`
- **Onboarding flow:** `app/onboarding/staff-setup/page.tsx`
