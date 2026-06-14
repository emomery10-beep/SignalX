# Team B: Third-Party Platform Integrations Implementation Guide

## 🎯 Overview

Team B builds the integration infrastructure for Uber Eats, DoorDash, Grubhub, and regional platforms. This guide provides the complete roadmap, API contracts, and development workflow.

**Timeline**: 3 weeks (Phases 1-4)  
**Scope**: 5 major platform integrations + 2 regional platforms  
**Owner**: Backend/Integration Team

---

## 📦 Deliverables Checklist

### Phase 1: Foundation (Days 1-2)
- [x] Database migration created: `20260614_restaurant_integrations.sql`
- [x] TypeScript types defined: `/lib/types/integrations.ts`
- [x] Webhook receiver skeleton: `/app/api/pos/restaurant/integrations/webhook/route.ts`
- [ ] Webhook signature verification implemented (all platforms)
- [ ] Integration settings API: `GET /api/pos/restaurant/integrations`
- [ ] Platform connection flow documented

### Phase 2: Order Processing (Days 3-4)
- [ ] Order normalization engine
- [ ] Menu sync background job
- [ ] Status update webhook sender
- [ ] Mock integration tests passing

### Phase 3: Advanced Features (Days 5-6)
- [ ] Financial reconciliation engine
- [ ] Settings UI frontend
- [ ] OAuth callback handlers
- [ ] Integration dashboard

### Phase 4: Testing & Hardening (Days 7-8)
- [ ] E2E tests with sandbox APIs
- [ ] Webhook retry logic
- [ ] Error handling & monitoring
- [ ] Documentation for production

---

## 🛠️ Database Schema

### Tables Created

```sql
-- Main tables (created in migration 20260614)
pos_integrations              -- Platform connections
pos_order_financials          -- Financial breakdown per order
pos_integration_audit         -- Audit log of all API calls
pos_webhook_queue             -- Webhook queue for reliable delivery
pos_menu_sync_state           -- Menu sync state tracking
```

**Key Features:**
- Row-level security (owner-scoped access)
- Audit logging of all operations
- Webhook queue with retry logic
- Financial tracking with GENERATED columns

---

## 📝 TypeScript Types

### Main Interfaces (in `/lib/types/integrations.ts`)

```typescript
// Database models
PosIntegration
PosOrderFinancials
PosIntegrationAudit
PosWebhookQueue
PosMenuSyncState

// Webhook types
NormalizedWebhookPayload        // Unified across all platforms
UberEatsWebhookPayload          // Platform-specific
DoorDashWebhookPayload
GrubhubWebhookPayload
// ... etc for each platform

// API request/response types
IntegrationConnectionRequest
IntegrationConnectionResponse
MenuSyncRequest
MenuSyncResponse
OrderStatusUpdateRequest
OrderStatusUpdateResponse
FinancialReportRequest
FinancialReportResponse
```

**Use these types for:**
- Type-safe API contracts
- Database operations
- Webhook payload handling
- API responses to Team A

---

## 🔗 API Routes to Build

### Webhook Receiver (DONE - skeleton)
```
POST /api/pos/restaurant/integrations/webhook
├── Receives webhook from any platform
├── Validates signature
├── Stores in webhook_queue
└── Returns 200 OK immediately
```

**Implementation Status**: Skeleton created, needs signature verification

---

### Integration Settings Management
```
GET  /api/pos/restaurant/integrations
  └── List all integrations for owner

POST /api/pos/restaurant/integrations
  └── Connect new platform (OAuth or API key)

PATCH /api/pos/restaurant/integrations/:id
  └── Update integration settings (commission rate, etc.)

DELETE /api/pos/restaurant/integrations/:id
  └── Disconnect platform
```

**Status**: TODO

---

### Menu Synchronization
```
POST /api/pos/restaurant/integrations/sync-menu
  └── Trigger menu sync (can be run on-demand or hourly)

GET  /api/pos/restaurant/integrations/sync-menu/status
  └── Check sync status
```

**Status**: TODO

---

### Order Status Updates
```
PATCH /api/pos/restaurant/integrations/order-status
  └── Update order status (preparing → ready → dispatched)
  └── Automatically notify all connected platforms
```

**Status**: TODO

---

### Financial Reports
```
GET /api/pos/restaurant/integrations/financials
  └── Revenue breakdown by platform
  └── Commission tracking
  └── Payout calculations
```

**Status**: TODO

---

## 🔑 Platform Configuration

### Supported Platforms

```typescript
const PLATFORMS = {
  uber_eats: {
    name: 'Uber Eats',
    apiUrl: 'https://api.uber.com/v2',
    webhookPath: '/webhooks/uber-eats',
    requiresOAuth: true,
    supportsMenuSync: true,
  },
  doordash: {
    name: 'DoorDash',
    apiUrl: 'https://api.doordash.com',
    webhookPath: '/webhooks/doordash',
    requiresOAuth: false,
    supportsMenuSync: true,
  },
  grubhub: {
    name: 'Grubhub',
    apiUrl: 'https://api.grubhub.com/v1',
    webhookPath: '/webhooks/grubhub',
    requiresOAuth: false,
    supportsMenuSync: true,
  },
  // ... etc
}
```

### Platform-Specific Details

#### Uber Eats
- **API**: REST API + webhooks
- **Auth**: OAuth 2.0
- **Webhooks**: Signed with `X-Uber-Delivery-Signature` (HMAC-SHA256)
- **Restaurant ID**: `restaurant_uuid` in payload
- **Order Status Flow**: accepted → preparing → ready → pickup_complete

#### DoorDash
- **API**: REST API
- **Auth**: API key + secret (HMAC signing)
- **Webhooks**: Signed with `X-DoorDash-Signature`
- **Merchant ID**: In payload as `merchant_id`
- **Order Status**: Similar to Uber Eats

#### Grubhub
- **API**: XML-based + REST
- **Auth**: API key
- **Webhooks**: XML or JSON, RSA-signed
- **Restaurant ID**: `restaurantId`
- **Order Status**: Different field names

#### Just Eat
- **API**: REST API
- **Auth**: OAuth
- **Webhooks**: HMAC-SHA256
- **Restaurant ID**: `restaurant_id`

#### Swiggy (India)
- **API**: REST API
- **Auth**: OAuth
- **Webhooks**: Custom signing
- **Store ID**: `store_id`

#### Grab (SE Asia)
- **API**: REST API
- **Auth**: OAuth
- **Webhooks**: Signed
- **Merchant ID**: `merchant_id`

#### Meituan (China)
- **API**: REST API (Chinese documentation)
- **Auth**: Shop ID + secret
- **Webhooks**: Custom format
- **POI ID**: `poi_id`

---

## 🚀 Implementation Phases

### Phase 1: Foundation (Days 1-2)

**Deliverables:**
1. Database migration applied to Supabase
2. All API route skeletons created
3. Webhook signature verification implemented

**Tasks:**
```
B-1: Create database tables (DONE ✓)
  └── Run migration: supabase db push

B-1a: Implement webhook signature verification
  └── Uber Eats: HMAC-SHA256 with X-Uber-Delivery-Signature
  └── DoorDash: HMAC-SHA256 with X-DoorDash-Signature
  └── Grubhub: RSA-SHA256 with X-Grubhub-Signature
  └── Others: Platform-specific (see docs)

B-1b: Create integration settings endpoints
  └── GET /api/pos/restaurant/integrations
  └── POST /api/pos/restaurant/integrations (with OAuth flow)
  └── PATCH /api/pos/restaurant/integrations/:id
  └── DELETE /api/pos/restaurant/integrations/:id
```

---

### Phase 2: Order Processing (Days 3-4)

**Deliverables:**
1. Orders normalize correctly from all platforms
2. Menu sync working for at least 2 platforms
3. Status updates flow bidirectionally

**Tasks:**
```
B-2: Implement order normalization
  └── Create services/normalization.ts
  └── Test: Uber Eats → standard schema
  └── Test: DoorDash → standard schema
  └── Test: Grubhub → standard schema
  └── Handle platform-specific fields (modifiers, etc.)

B-3: Build menu sync engine
  └── Create services/menu-sync.ts
  └── Fetch menu from pos_menu_items
  └── Transform to platform format
  └── POST to each platform's API
  └── Handle errors and retries

B-4: Implement order status updates
  └── Create services/status-updates.ts
  └── Listen for order status changes (from kitchen)
  └── Send webhooks to all connected platforms
  └── Track delivery status
```

---

### Phase 3: Advanced Features (Days 5-6)

**Deliverables:**
1. Financial reconciliation running
2. Settings UI ready
3. OAuth flows working

**Tasks:**
```
B-5: Build financial reconciliation
  └── Create services/financial-reconciliation.ts
  └── Calculate: commission, fees, payout
  └── Store in pos_order_financials
  └── Reconcile against platform settlement reports
  └── Daily revenue reports

B-6: Build settings UI
  └── Create /restaurant/integrations page
  └── Platform connect buttons with OAuth
  └── Show connected status
  └── Commission rate config
  └── Sync buttons (manual trigger)
  └── Disconnect option

B-6a: Implement OAuth callbacks
  └── /api/pos/restaurant/integrations/oauth/callback
  └── Exchange code for token
  └── Store securely (Supabase Vault)
  └── Redirect to settings page
```

---

### Phase 4: Testing & Hardening (Days 7-8)

**Deliverables:**
1. All E2E tests passing
2. Webhook reliability verified
3. Production-ready error handling

**Tasks:**
```
B-7: End-to-end testing
  └── Uber Eats sandbox API
  └── DoorDash sandbox API
  └── Grubhub test environment
  └── Order flow: create → normalize → store → display
  └── Status flow: kitchen updates → notify platforms

B-7a: Webhook reliability
  └── Implement retry queue
  └── Exponential backoff
  └── Dead-letter queue for failed webhooks
  └── Monitoring alerts

B-7b: Error handling
  └── Graceful degradation (one platform failure ≠ all fail)
  └── User-friendly error messages
  └── Sentry/monitoring integration
  └── Runbooks for common issues

B-7c: Documentation
  └── Platform setup guides
  └── Webhook testing instructions
  └── Troubleshooting guide
  └── API documentation
```

---

## 📊 Data Flow

### Order Ingestion Flow

```
Platform Webhook
  ↓
POST /api/pos/restaurant/integrations/webhook
  ↓
✓ Verify signature
✓ Find integration by restaurant_id
✓ Normalize payload → NormalizedWebhookPayload
  ↓
Store in pos_webhook_queue
  ↓
Background job (runs every 30s)
  ↓
✓ Fetch from queue
✓ Create/update in pos_orders (or online_orders)
✓ Send to KDS (kitchen display)
✓ Update integration's last_webhook_received_at
  ↓
Team A sees order in hub
```

### Menu Sync Flow

```
Triggered: Manual button click OR Hourly schedule
  ↓
GET /api/pos/restaurant/integrations/sync-menu?integration_id=X
  ↓
Fetch pos_menu_items for this location
  ↓
For each integration:
  ├─ Transform menu to platform format
  ├─ POST/PATCH to platform API
  ├─ Handle errors & retries
  └─ Update pos_menu_sync_state
  ↓
Store audit log
  ↓
Return sync results to Team A UI
```

### Status Update Flow

```
Kitchen marks order "ready"
  ↓
Kitchen page calls PATCH /api/pos/restaurant/integrations/order-status
  ↓
Find all connected integrations
  ↓
For each platform:
  ├─ Look up external order ID in pos_order_financials
  ├─ Send status update webhook to platform
  ├─ Log in pos_integration_audit
  └─ Handle platform-specific status field names
  ↓
Customer sees "Order being prepared" in delivery app
```

---

## 🔐 Security Considerations

### API Key Storage
```typescript
// ✓ CORRECT: Use Supabase Vault
const secret = await supabase.rpc('get_integration_secret', {
  integration_id,
  secret_name: 'api_key'
})

// ✗ WRONG: Don't store in environment or plaintext
const secret = process.env.UBER_EATS_API_KEY
```

### Webhook Signature Verification
```typescript
// ✓ Every webhook must verify signature
// ✗ Never trust unsigned webhooks

// Prevent webhook replay attacks:
// - Store signature in DB
// - Reject duplicate webhook IDs
// - Include timestamp in verification
```

### Rate Limiting
- Implement rate limiting on webhook endpoint (prevent abuse)
- Respect platform API rate limits
- Exponential backoff on retries

### PII Handling
- Minimal PII storage (customer name, phone for orders only)
- Never log full request/response bodies with PII
- Comply with local data regulations (GDPR, etc.)

---

## 🧪 Testing Strategy

### Unit Tests
```typescript
// services/__tests__/normalization.test.ts
describe('Order normalization', () => {
  it('converts Uber Eats payload to standard schema', () => {
    const result = normalizeUberEatsPayload(mockUEPayload)
    expect(result).toMatchObject(expectedNormalizedSchema)
  })
})
```

### Integration Tests
```typescript
// Test with real Supabase instance
// Verify webhook → queue → order creation flow
```

### Sandbox Testing
```typescript
// Use platform sandbox environments:
// - Uber Eats: sandbox-api.uber.com
// - DoorDash: test.doordash.com
// - Grubhub: test.grubhubapi.com
```

### Load Testing
```typescript
// Simulate burst webhook traffic
// Verify webhook receiver handles 1000+ orders/min
// Check database performance
```

---

## 📞 Dependencies & Handoffs

### Depends On
- Team A: `online_orders` table schema (shared dependency)
- Team A: Hub UI to display platform badges
- Deep-research findings: Platform API best practices

### Hands Off To
- Team A: Populated `online_orders` table with real platform data
- Team A: Platform source badges, status updates
- Deployment team: Production secrets management

---

## 🚨 Troubleshooting

### Common Issues

**"Integration not found"**
- Check: Restaurant ID matches `metadata.restaurant_id`
- Verify: Platform account connected in settings
- Solution: Reconnect integration

**"Invalid signature"**
- Check: Webhook secret stored correctly
- Verify: Signature header name per platform
- Solution: Regenerate webhook secret in platform dashboard

**"Menu sync fails"**
- Check: API key still valid (tokens expire)
- Verify: Menu format matches platform spec
- Solution: Check audit logs, update credentials

**"Orders not showing up"**
- Check: Webhook being received (audit log)
- Verify: Order normalization working
- Solution: Check webhook queue for errors

---

## 📚 Resources

### Platform Documentation
- [Uber Eats API Docs](https://developer.uber.com/docs/eats)
- [DoorDash API Docs](https://developer.doordash.com)
- [Grubhub API Docs](https://developer.grubhub.com)
- [Just Eat API](https://justeat-api.herokuapp.com)

### Helpful Tools
- **Webhook Testing**: ngrok, RequestBin, Webhook.cool
- **API Testing**: Postman, Insomnia, REST Client
- **Signature Generation**: crypto library (Node.js built-in)

### Team Coordination
- **Sync Time**: Daily standup, 10am
- **Slack Channel**: #team-b-integrations
- **Decision Log**: /docs/integrations-decisions.md

---

## ✅ Success Criteria

By end of Week 3:
- ✅ All 7 platform integrations working with sandbox APIs
- ✅ Orders flowing end-to-end (webhook → normalization → display)
- ✅ Menu sync tested with 2+ platforms
- ✅ Status updates bidirectional
- ✅ Financial reconciliation accurate to $0.01
- ✅ 99.9% webhook reliability (with retries)
- ✅ <100ms API response times
- ✅ Comprehensive error logging
- ✅ Ready for production deployment

---

**Questions?** Reach out in #team-b-integrations or at the daily standup.

Happy building! 🚀
