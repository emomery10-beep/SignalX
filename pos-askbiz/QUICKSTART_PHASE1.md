# Phase 1 Quick Start — Local Testing

## 🚀 Get Started in 5 Minutes

### Step 1: Apply Database Migration

In `/Users/lee/Desktop/vercel-deploy`:

```bash
# Option A: Using Supabase CLI
npx supabase migration up

# Option B: Manual SQL (copy migration 027_pos_tax_automation.sql into Supabase SQL editor)
```

**Verify:**
```sql
-- Should return 4 rows
SELECT table_name FROM information_schema.tables 
WHERE table_name LIKE 'pos_tax_%' OR table_name = 'pos_location_tax_settings';
```

---

### Step 2: Start Development Servers

**Terminal 1 - Backend:**
```bash
cd /Users/lee/Desktop/vercel-deploy
npm run dev
# Should show: ✓ Ready on http://localhost:3001
```

**Terminal 2 - Frontend:**
```bash
cd /Users/lee/Desktop/pos-askbiz
npm run dev
# Should show: ✓ Ready on http://localhost:3000
```

---

### Step 3: Test the Feature

**Quick Manual Test:**

1. Open `http://localhost:3000` → Login
2. Click "⚙️ Settings" → Configure tax for UK
3. Make a sale with mixed items (book + shirt)
4. Click "📊 Reports" → Generate tax report
5. Verify tax calculated correctly

**Quick API Test:**

```bash
curl http://localhost:3000/api/pos/tax/get-jurisdictions | jq '.jurisdictions | length'
# Should return: 10
```

---

## 📋 Key Files Created

### Database
- `supabase/migrations/027_pos_tax_automation.sql` (580 lines)
  - 4 new tables
  - 6 indices
  - Default UK tax codes

### API Endpoints
- `app/api/pos/tax/calculate-item-tax/route.ts` — Calculate tax per item
- `app/api/pos/tax/get-jurisdictions/route.ts` — List all supported jurisdictions
- `app/api/pos/tax/validate-vat/route.ts` — Validate EU VAT numbers
- `app/api/pos/tax/report/route.ts` — Generate tax reports (JSON/CSV)
- `app/api/pos/settings/save-tax-settings/route.ts` — Save user tax config
- `app/api/pos/transactions/route.ts` — **MODIFIED** (tax calculation added)

### Frontend Pages
- `app/settings/page.tsx` (820 lines) — Tax & compliance configuration
- `app/reports/page.tsx` (1100 lines) — Tax report generator
- `app/sell/page.tsx` — **MODIFIED** (added Reports/Settings buttons)
- `app/inventory/page.tsx` — **MODIFIED** (added Reports/Settings buttons)

---

## ✅ What Works Now

✅ **Tax Calculation**
- Automatic per-item tax based on category (books 0%, shirts 20%, food 5%)
- Support for 10+ jurisdictions (UK, DE, FR, US, AU, CA, etc.)
- Stored per-line item (tax_code, tax_rate, tax_amount)
- Stored at transaction level (total_tax, tax_jurisdiction)

✅ **Compliance**
- GDPR privacy notice on login
- Compliance checklist in settings
- Audit trail foundation (table created)

✅ **Reporting**
- Tax reports formatted for HMRC, IRS, EU VAT
- CSV export for filing
- Tax breakdown by rate

✅ **User Interface**
- Settings page for jurisdiction configuration
- Reports page for viewing tax summaries
- Navigation buttons on sell/inventory pages

---

## ⚠️ Not Yet Implemented (Phase 2+)

- ❌ Stripe payment integration (Phase 4)
- ❌ GDPR data export/deletion endpoints (Phase 2)
- ❌ Hash chain audit verification (Phase 2)
- ❌ Direct filing to HMRC/IRS (Phase 3)
- ❌ Xero/QuickBooks sync (Phase 3)
- ❌ Shift tracking (Phase 6)

---

## 🧪 Run Full Test Suite

See: `/Users/lee/Desktop/PHASE1_TESTING_CHECKLIST.md`

Key tests:
```bash
# 1. Check jurisdictions
curl http://localhost:3000/api/pos/tax/get-jurisdictions | jq '.jurisdictions[0]'

# 2. Calculate tax
curl -X POST http://localhost:3000/api/pos/tax/calculate-item-tax \
  -H "Content-Type: application/json" \
  -d '{"item_name":"Book","price":10,"category":"books","jurisdiction":"UK"}'

# 3. Generate report
curl "http://localhost:3000/api/pos/tax/report?jurisdiction=UK&start_date=2026-01-01T00:00:00Z&end_date=2026-12-31T23:59:59Z" \
  -H "x-staff-id: YOUR_STAFF_ID"
```

---

## 📊 Architecture Overview

```
┌─────────────────────────────────────────────┐
│  Frontend (pos-askbiz)                      │
│  ┌──────────────────────────────────────┐   │
│  │ Login Page (/page.tsx)               │   │
│  ├──────────────────────────────────────┤   │
│  │ Sell Page (/sell)                    │   │  + Reports & Settings buttons
│  │ Inventory Page (/inventory)          │   │  + Reports & Settings buttons
│  │ NEW: Settings Page (/settings)       │   │  Jurisdiction, Tax ID config
│  │ NEW: Reports Page (/reports)         │   │  Tax reports & CSV export
│  └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
            ↓ API Calls ↓
┌─────────────────────────────────────────────┐
│  Backend API (vercel-deploy)                │
│  ┌──────────────────────────────────────┐   │
│  │ NEW: /api/pos/tax/calculate-item-tax │   │
│  │ NEW: /api/pos/tax/get-jurisdictions  │   │
│  │ NEW: /api/pos/tax/validate-vat       │   │
│  │ NEW: /api/pos/tax/report             │   │
│  │ NEW: /api/pos/settings/*             │   │
│  │ MODIFIED: /api/pos/transactions      │   │  Tax calculation logic added
│  └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
            ↓ Database ↓
┌─────────────────────────────────────────────┐
│  Supabase PostgreSQL                        │
│  ┌──────────────────────────────────────┐   │
│  │ NEW: pos_tax_rules                   │   │  Jurisdiction rates
│  │ NEW: pos_item_tax_codes              │   │  Category→tax mapping
│  │ NEW: pos_tax_audit_log               │   │  Audit trail
│  │ NEW: pos_location_tax_settings       │   │  User config
│  │ MODIFIED: pos_transactions           │   │  + tax fields
│  │ MODIFIED: pos_items                  │   │  + tax fields
│  └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

---

## 💡 How Tax Calculation Works

**Example Transaction:**
```
Input Items:
  1x Book (£10) → category: books
  2x T-Shirt (£20 each) → category: general_merchandise

Processing:
  1. Fetch user location tax settings → jurisdiction = 'UK'
  2. Lookup tax codes:
     - books in UK → VAT-0-EXEMPT (0%)
     - general_merchandise in UK → VAT-20-STANDARD (20%)
  3. Calculate per item:
     - Book: £10 net × 0% = £0 tax, subtotal = £10
     - T-Shirt×2: £40 net × 20% = £8 tax, subtotal = £48
  4. Store in database:
     - pos_transactions: subtotal=50, total_tax=8, total=58
     - pos_items[0]: name=Book, tax_code=VAT-0-EXEMPT, tax_rate=0, tax_amount=0
     - pos_items[1]: name=T-Shirt, tax_code=VAT-20-STANDARD, tax_rate=20, tax_amount=8
  5. Audit log created with full calculation details
```

---

## 🎯 Success Criteria

Phase 1 is complete when:

✅ All 6 API endpoints respond correctly  
✅ /settings page works end-to-end  
✅ /reports page generates valid CSV/JSON  
✅ Complete transaction flow with tax calculation  
✅ Database migration applied successfully  
✅ No console errors in browser or server logs  
✅ Tax calculations verified in 3+ jurisdictions  

---

## 🔄 Next Phase (Phase 2)

After local testing confirms Phase 1 works:

1. Push to production
2. Start Phase 2: GDPR & Data Governance (Weeks 3-5)
   - Data export endpoints
   - Customer deletion workflows
   - Consent logging
   - Immutable audit trail with hashing

---

## 📞 Troubleshooting

**Issue:** "Cannot find module" errors
- [ ] Run `npm install` in both directories

**Issue:** Migration fails
- [ ] Check Supabase CLI is installed: `npx supabase --version`
- [ ] Ensure database connection working: `npx supabase projects list`

**Issue:** Tax endpoints return 401
- [ ] Check x-staff-id header is set
- [ ] Verify staff login completed

**Issue:** Settings page not navigating
- [ ] Check router.push imports at top of file
- [ ] Verify next/navigation is imported correctly

**Issue:** Reports page shows no data
- [ ] Make at least one test sale first
- [ ] Check date range includes recent sales
- [ ] Verify tax_jurisdiction was set on transactions

---

## 📖 Full Documentation

- Implementation Details: `/Users/lee/Desktop/PHASE1_IMPLEMENTATION.md`
- Testing Checklist: `/Users/lee/Desktop/PHASE1_TESTING_CHECKLIST.md`
- Product Plan: `/Users/lee/.claude/plans/modular-crafting-lamport.md`

---

**Time to first test:** 5 minutes  
**Time to full testing:** 30 minutes  
**Time to production deployment:** (after testing) ~15 minutes  

**Happy testing!** 🎉
