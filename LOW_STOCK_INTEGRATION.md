# Low Stock Alert System Integration Guide

## Overview
This guide covers integrating the new low stock alert system with Claude AI supplier recommendations into your POS dashboard.

## Components Created

### 1. Frontend Component
**File:** `/components/LowStockModal.tsx`
- Modal that displays all low stock items
- Multi-select items to ask Claude about specific items
- Shows Claude's supplier recommendations
- Click items to toggle selection

### 2. Backend APIs

#### GET `/api/pos/inventory/low-stock`
Returns all low stock items for the authenticated owner:
```javascript
{
  items: [
    {
      id: "uuid",
      name: "Black Hair Soap",
      qty: 1,
      reorder_qty: 10,
      cost_price: 2.50,
      qty_deficit: 9,
      urgency: "critical"  // "critical" | "high" | "medium"
    },
    ...
  ],
  total_low_stock_items: 19
}
```

#### POST `/api/pos/ai/supplier-recommendations`
Gets Claude AI recommendations for supplier sources:

**Request:**
```javascript
{
  owner_id: "uuid",
  owner_email: "user@example.com",
  low_stock_items: [
    {
      id: "uuid",
      name: "Black Hair Soap",
      qty: 1,
      reorder_qty: 10
    }
  ]
}
```

**Response:**
```javascript
{
  response: "Claude's detailed recommendations with:\n- Urgency Assessment\n- Per-item supplier recommendations\n- Local distributor suggestions\n- Lead times\n- Cost considerations\n- Priority ordering plan",
  items_analyzed: 3,
  timestamp: "2026-05-13T15:30:00Z"
}
```

## Integration Steps

### Step 1: Import Component
In your POS dashboard page (`/app/(app)/pos/page.tsx`):

```typescript
import { LowStockModal } from '@/components/LowStockModal'
```

### Step 2: Add State
Add modal state to the component:

```typescript
const [lowStockOpen, setLowStockOpen] = useState(false)

// Get owner info from user data
const [userEmail, setUserEmail] = useState('')
const [userId, setUserId] = useState('')
```

### Step 3: Get Staff Email
Update your useEffect that loads user data:

```typescript
useEffect(() => {
  const storedStaff = localStorage.getItem('pos_staff')
  if (storedStaff) {
    const staff = JSON.parse(storedStaff)
    setUserEmail(staff.email)
    setUserId(staff.owner_id)
  }
}, [])
```

### Step 4: Make Low Stock Alert Clickable
Find the KPI grid section (around line 551) and modify the low stock card:

**Before:**
```javascript
{ label: 'Low stock alerts', 
  value: (lowStock.length + outOfStock.length).toString(),    
  color: (lowStock.length + outOfStock.length) > 0 ? '#dc2626' : '#16a34a' 
}
```

**After:**
```javascript
{
  label: 'Low stock alerts', 
  value: (lowStock.length + outOfStock.length).toString(),    
  color: (lowStock.length + outOfStock.length) > 0 ? '#dc2626' : '#16a34a',
  onClick: () => (lowStock.length + outOfStock.length > 0) && setLowStockOpen(true),
  clickable: lowStock.length + outOfStock.length > 0
}
```

### Step 5: Update KPI Card Rendering
Make the KPI cards respond to click:

```javascript
{[...kpis].map((kpi, i) => (
  <div 
    key={i} 
    onClick={kpi.onClick}
    style={{ 
      padding: '16px', 
      borderRadius: 12, 
      border: '1px solid var(--b)', 
      background: 'var(--sf)',
      cursor: kpi.clickable ? 'pointer' : 'default',
      opacity: kpi.clickable ? 1 : 0.7
    }}
  >
    <div style={{ fontSize: 11, color: 'var(--tx3)', marginBottom: 6 }}>
      {kpi.label}
    </div>
    <div style={{ fontSize: 26, fontWeight: 800, color: kpi.color, letterSpacing: '-.02em' }}>
      {kpi.value}
    </div>
  </div>
))}
```

### Step 6: Add Modal to Page
Add the modal component at the end of the component JSX:

```typescript
<LowStockModal
  isOpen={lowStockOpen}
  onClose={() => setLowStockOpen(false)}
  ownerId={userId}
  ownerEmail={userEmail}
/>
```

## How It Works

1. **User clicks "Low stock alerts" card** (e.g., "19" items)
2. **Modal opens** showing all low stock items
3. **Items display:**
   - Item name
   - Current quantity
   - Reorder threshold
   - Quantity deficit (highlighted in red)
4. **User selects items** (or all items auto-selected)
5. **User clicks "Ask Claude for Suppliers"**
6. **Claude analyzes:**
   - Business type and location
   - Item categories
   - Urgency level (out of stock = CRITICAL)
   - Creates supplier recommendations
7. **Recommendations include:**
   - Local supplier options
   - Reorder quantities
   - Lead times
   - Cost implications
   - Priority action plan

## Claude's Analysis

The AI considers:
- **Business Type:** Retail, Food Service, Beauty, etc.
- **Location:** Country and region for local suppliers
- **Urgency:** Out of stock (CRITICAL), Low qty (HIGH), Below threshold (MEDIUM)
- **Item Categories:** Electronics, FMCG, Cosmetics, Food, etc.
- **Volume Discounts:** Reorder quantities for cost optimization

## Example Output

When user asks Claude about low stock items, response includes:

```
⚠️ URGENCY: CRITICAL
- 1 item is OUT OF STOCK (Black Hair Soap)
- 2 items are LOW (Coconut Oil, Cooling Balm)

IMMEDIATE ACTIONS:
1. Black Hair Soap (0 units, need 10)
   ✓ Supplier: Beauty Wholesale Direct (UK)
   ✓ Lead time: 2-3 days, Min order: 12 units
   ✓ Cost: £1.80/unit wholesale
   
2. Coconut Oil 30ml (3 units, need 10)
   ✓ Supplier: FMCG UK Distributors
   ✓ Lead time: 1-2 days
   ✓ Cost: £0.65/unit

ACTION PLAN:
1. TODAY: Order Black Hair Soap + Coconut Oil together
2. TOMORROW: Order Cooling Balm once order confirmed
3. SETUP: Add these to auto-reorder list for future

TOTAL COST ESTIMATE: £65-80 for all items
```

## Testing

1. Go to POS dashboard
2. Verify low stock items are shown (should be at least one)
3. Click the "Low stock alerts" card
4. Modal should open showing items
5. Select items or use auto-select-all
6. Click "Ask Claude for Suppliers"
7. Wait for Claude response with supplier recommendations
8. Review recommendations and take action

## Integration Checklist

- [ ] Import LowStockModal component
- [ ] Add lowStockOpen state variable
- [ ] Get userId and userEmail from staff session
- [ ] Make low stock KPI card clickable
- [ ] Update KPI card styling for hover/cursor
- [ ] Add LowStockModal component JSX
- [ ] Test modal opening/closing
- [ ] Test Claude recommendations loading
- [ ] Test multi-select and single-select
- [ ] Verify supplier suggestions are relevant to business

## Notes

- Modal auto-loads on open
- All low stock items included by default
- User can select specific items for targeted Claude analysis
- Claude response includes actionable supplier names
- Recommendations consider local suppliers for faster fulfillment
- System handles out-of-stock (qty=0) as CRITICAL urgency

## Next Steps

1. Integrate modal into POS dashboard
2. Test with real low stock data
3. Optionally: Add "Mark as Ordered" button to items
4. Optionally: Store Claude recommendations for history
5. Optionally: Auto-generate purchase orders from recommendations
