# 🚀 UNIFIED BUSINESS INTELLIGENCE SYSTEM
## Bloomberg Terminal for Small Businesses

### Vision
Every section of AskBiz POS feeds into ONE powerful search interface powered by Claude, Tivali, and Track17. Ask anything - get answers from all your business data instantly.

---

## 🏗️ Architecture

### Data Sources (All Integrated)

```
┌─────────────────┐
│   POS DATA      │  Transactions, Inventory, Sales
└────────┬────────┘
         │
         ├──> Unified Search Engine
         │
┌────────┴────────┐
│  CLAUDE AI      │  Analysis & Synthesis
└────────┬────────┘
         │
┌────────┴────────────────────────┐
│                                  │
├─ TIVALI (Suppliers)  £ Pricing  │
│                                  │
├─ TRACK17 (Shipping) 🚚 Timeline  │
│                                  │
└──────────────────────────────────┘
         │
    All → ONE Search Bar
         │
    Business Pulse Dashboard
```

---

## 📡 API Endpoints

### 1. **Unified Search** (The Bloomberg Terminal)
**POST** `/api/pos/intelligence/unified-search`

Searches across all data sources simultaneously:

```javascript
{
  "query": "low stock black hair soap",
  // or: "where to buy coconut oil"
  // or: "shipping prices to UK"
  // or: "revenue trend this week"
  "owner_id": "uuid",
  "owner_email": "user@example.com"
}
```

**Response:**
```javascript
{
  "query": "low stock black hair soap",
  "response": "COMPREHENSIVE ANSWER FROM:\n- POS: Item is at 1 unit...\n- Tivali: Best supplier is...\n- Track17: Shipping cost...\n- Claude: Recommendation is...",
  "sources": ["POS", "Tivali", "Track17", "Claude"],
  "timestamp": "2026-05-13T15:30:00Z"
}
```

### 2. **Enhanced Supplier Recommendations**
**POST** `/api/pos/ai/supplier-recommendations`

Now uses ALL THREE sources:

```javascript
{
  "low_stock_items": [
    {
      "id": "uuid",
      "name": "Black Hair Soap",
      "qty": 1,
      "reorder_qty": 10
    }
  ],
  "owner_email": "user@example.com"
}
```

**Response:**
```javascript
{
  "response": "URGENCY: CRITICAL\n\n1. Black Hair Soap (0 units)\n   ✓ Best Tivali Supplier: Beauty Wholesale Direct\n   ✓ Price: £1.80/unit\n   ✓ Lead: 2-3 days\n   ✓ Shipping (Track17): £15 to UK\n   ✓ Total cost: £28.80\n   ✓ Claude recommendation: Order today\n\nACTION PLAN:\n...",
  "items_analyzed": 1,
  "data_sources": {
    "claude": true,
    "tivali": true,
    "track17": true
  },
  "timestamp": "2026-05-13T15:30:00Z"
}
```

---

## 💻 Frontend Components

### **UnifiedSearch Component**

Full-page search interface (Bloomberg-style):

```tsx
import { UnifiedSearch } from '@/components/UnifiedSearch'

export default function SearchPage() {
  const staff = JSON.parse(localStorage.getItem('pos_staff') || '{}')
  
  return (
    <UnifiedSearch 
      ownerId={staff.owner_id}
      ownerEmail={staff.email}
      compact={false}
    />
  )
}
```

**Features:**
- 🔍 Powerful search bar that queries all sources
- 💾 Search history (last 5 queries)
- 💡 Quick suggestions:
  - "Where can I buy low stock items?"
  - "What is my revenue trend?"
  - "Where are my shipments?"
  - "What suppliers have best pricing?"
  - "Business health summary"
  - "Critical alerts"
- 📋 Results show all source data + AI synthesis
- 📋 Copy to clipboard functionality

### **Compact Mode** (For Embedding in Pulse Bar)

```tsx
<UnifiedSearch 
  ownerId={staff.owner_id}
  ownerEmail={staff.email}
  compact={true}  // Mini search bar for dashboards
/>
```

Renders as a single-line search bar that can be embedded in:
- Business Pulse dashboard header
- POS dashboard top bar
- Navigation menu

---

## 🔄 Example Queries & Responses

### Query 1: "Low Stock Black Hair Soap"
```
Sources queried: POS, Tivali, Track17, Claude

RESPONSE:
URGENCY: CRITICAL - Item out of stock

From POS: Currently 0 units, threshold is 10
From Tivali:
  - Beauty Wholesale Direct: £1.80/unit, 2-3 days
  - FMCG Direct: £1.95/unit, 1-2 days
  - Direct from Manufacturer: £1.50/unit, 5-7 days

From Track17: 
  - UK shipping: £15 standard, £25 express
  - EU shipping: £25 standard, £45 express

From Claude:
  Recommendation: Order 50 units from Beauty Wholesale Direct
  Reasoning: Best balance of price + speed + reliability
  Total cost: £90 + £15 shipping = £105
  Next order date: In 2 days
```

### Query 2: "Revenue Trend This Week"
```
Sources: POS, Claude

From POS:
  Monday: £245
  Tuesday: £312  (+27%)
  Wednesday: £289 (-7%)
  Thursday: £401  (+39%)
  Friday: £356
  Total: £1,603 (+18% vs last week)

From Claude:
  ANALYSIS: Upward trend
  - Peak on Thursday (likely market day or promotion?)
  - Average: £320/day
  - Forecast next week: £1,920 (projected)
  ACTION: Increase stock for Thursday, evaluate promotion effectiveness
```

### Query 3: "Where Are My Shipments?"
```
Sources: Track17

ACTIVE SHIPMENTS:
  1. Order #OD123 → UK
     Status: In Transit
     Expected: Tomorrow by 3pm
     Tracking: XYZ123456
     Shipping cost: £12.50
     
  2. Order #OD124 → London
     Status: Pending (ready to ship)
     Expected: In 2 days
     Contains: 50x Coconut Oil
     Estimated shipping: £8.50
```

---

## 🎯 Integration Points

### Where Unified Search Lives

1. **Main Search Page** - `/search` or `/intelligence`
   - Full-page interface like Bloomberg terminal
   - Quick suggestions, history, detailed results

2. **In Business Pulse Dashboard** - Top bar
   - Compact search bar
   - Feeds results into pulse insights

3. **In POS Dashboard** - Header
   - Quick access to business metrics
   - Low stock alerts trigger searches

4. **In Low Stock Modal** - "Ask Claude" button
   - Launches unified search for that item
   - Pre-fills query with item name

5. **Mobile** (Optional)
   - Voice search support
   - Optimized for touch

---

## 🔐 API Keys Required

Set in `.env.local`:

```env
TIVALI_API_KEY=your_tivali_key
TRACK17_API_KEY=your_track17_key
ANTHROPIC_API_KEY=your_claude_key
```

---

## 🚀 How It Powers Everything

### Low Stock Alert Flow (UPDATED)

```
User sees 19 low stock items
    ↓
Opens LowStockModal
    ↓
Clicks "Ask Claude for Suppliers"
    ↓
Sends to /api/pos/ai/supplier-recommendations
    ↓
Claude + Tivali + Track17 work together:
  
  Tivali finds suppliers with pricing
  ↓
  Track17 provides shipping costs
  ↓
  Claude synthesizes: "Order from X because..."
    ↓
Shows comprehensive recommendation with:
  - Supplier names & prices (Tivali)
  - Shipping costs & times (Track17)
  - AI reasoning (Claude)
```

---

## 📊 Data Flow Diagram

```
┌──────────────────────────────────────┐
│  USER SEARCH QUERY                   │
│  "Where can I buy low stock items?"  │
└──────────────┬───────────────────────┘
               │
        ┌──────▼─────────┐
        │ Unified Search │
        │    Engine      │
        └──────┬─────────┘
               │
      ┌────────┴────────┬─────────┬──────────┐
      │                 │         │          │
      ▼                 ▼         ▼          ▼
  ┌───────┐         ┌───────┐ ┌────────┐ ┌──────┐
  │  POS  │         │Claude │ │ Tivali │ │Track17
  │ (Low  │         │ (Why) │ │(Where) │ │(Cost)
  │stock) │         │       │ │(Price) │ │(Time)
  └───┬───┘         └───┬───┘ └────┬───┘ └──┬───┘
      │                 │          │        │
      │    1. Black     │  2. Best  │  3. Ship for
      │    Hair Soap    │  supplier │  £12.50
      │    is out       │  is Beauty│  in 2 days
      │    (0 units)    │  Wholesale│
      │                 │           │
      └─────────────────┴───────────┴──────┐
                                           │
                          ┌────────────────▼─────┐
                          │   CLAUDE SYNTHESIS   │
                          │                      │
                          │  "Order 50 units     │
                          │   from Beauty        │
                          │   Wholesale Direct   │
                          │   £90 + £12.50 ship  │
                          │   = £102.50 total    │
                          │   Arrives in 2 days" │
                          └────────────┬─────────┘
                                       │
                              ┌────────▼──────┐
                              │  USER SEES    │
                              │  DECISION     │
                              └───────────────┘
```

---

## ✨ Why This Matters

### Before (Siloed):
```
"Where can I buy this?"
  → Google search
  → Phone calls to suppliers
  → Manual comparison
  → Days of research
```

### After (Unified):
```
"Where can I buy low stock coconut oil?"
  → Instant answer from Tivali
  → Prices compared automatically
  → Shipping costs from Track17
  → Claude explains why to choose X
  → One second, complete decision
```

---

## 🎓 Usage Examples

### Example 1: Business Owner at 8 AM

```
Owner: "What do I need to do today?"
System: [Unified Search triggers]
  → POS shows yesterday: £1,200 revenue ✅
  → Low stock: 3 items (search opens)
  → Tivali suggests: Order coconut oil from X
  → Track17 shows: One shipment arriving today
  → Claude says: "Great day ahead, reorder coconut oil ASAP"
```

### Example 2: During Business Hours

```
Owner: "Can I negotiate with suppliers?"
System:
  → Tivali shows: Current supplier pricing
  → Shows: 5 other suppliers with better prices
  → Claude analyzes: "Switch to Supplier Y, save £2/unit"
  → Track17 compares: "Same 2-day lead time"
  → Result: Owner saves £100/month on one item
```

### Example 3: End of Day Review

```
Owner: "How did I do today?"
System:
  → POS: £1,500 revenue, 18 sales
  → Low stock alerts: 2 items (handled via unified search)
  → Shipments: 1 arrived (Track17), 2 pending
  → Health: Revenue up 12% vs last week
  → Claude insight: "Growth is consistent, maintain stock levels"
```

---

## 🔮 Future Enhancements

- **Voice Search**: "Alexa, what are my low stock items?"
- **Mobile App**: Native iOS/Android with push alerts
- **Predictive Ordering**: "You'll run out of X in 3 days, pre-order?"
- **Competitor Tracking**: Monitor supplier price changes
- **Auto-Ordering**: "Order when stock < 5"
- **Margin Analysis**: "Which suppliers have best margins?"

---

## 📖 Summary

**The Search Bar is Your Business Dashboard**

Instead of clicking between POS → Inventory → Suppliers → Shipping, you ask ONE question and get answers from all sources simultaneously, synthesized by Claude for human-readable insights.

This is Bloomberg Terminal for small business owners. 📊
