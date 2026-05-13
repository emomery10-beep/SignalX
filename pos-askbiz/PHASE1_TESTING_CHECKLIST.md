# Phase 1 Testing Checklist — Local Development

Complete these tests BEFORE pushing to production. All tests should pass locally first.

---

## ✅ SETUP & PREREQUISITES

- [ ] Running `npm run dev` in `/Users/lee/Desktop/vercel-deploy` (backend)
- [ ] Running `npm run dev` in `/Users/lee/Desktop/pos-askbiz` (frontend)
- [ ] Database migration 027 applied locally
  ```bash
  # In vercel-deploy:
  npx supabase migration up  # Or your migration command
  ```
- [ ] Can access `http://localhost:3000` (frontend)
- [ ] Can access `http://localhost:3001` (backend API, if separate)

---

## 📋 BACKEND API TESTS

### 1. GET /api/pos/tax/get-jurisdictions

```bash
curl http://localhost:3000/api/pos/tax/get-jurisdictions | jq .
```

**Expected Response:** Array of 10+ jurisdictions including:
- [ ] UK with standard_rate: 20
- [ ] DE with standard_rate: 19
- [ ] US_CA with standard_rate: 7.25
- [ ] Each includes currency, filing_frequency, reduced_rates array

---

### 2. POST /api/pos/tax/calculate-item-tax

**Test 1: Book in UK (should be 0% tax)**
```bash
curl -X POST http://localhost:3000/api/pos/tax/calculate-item-tax \
  -H "Content-Type: application/json" \
  -H "x-staff-id: test_cashier_1" \
  -d '{
    "item_name": "Fiction Book",
    "price": 15.00,
    "quantity": 1,
    "category": "books",
    "jurisdiction": "UK",
    "customer_type": "B2C"
  }' | jq .
```

**Expected:**
- [ ] tax_amount: 0
- [ ] effective_tax_rate: 0
- [ ] tax_code: "VAT-0-EXEMPT"
- [ ] jurisdiction: "UK"

**Test 2: T-Shirt in UK (should be 20% tax)**
```bash
curl -X POST http://localhost:3000/api/pos/tax/calculate-item-tax \
  -H "Content-Type: application/json" \
  -H "x-staff-id: test_cashier_1" \
  -d '{
    "item_name": "T-Shirt",
    "price": 20.00,
    "quantity": 2,
    "category": "general_merchandise",
    "jurisdiction": "UK",
    "customer_type": "B2C"
  }' | jq .
```

**Expected:**
- [ ] tax_amount: 6.67 (approx £40 net @ 20%)
- [ ] effective_tax_rate: 20
- [ ] tax_code: "VAT-20-STANDARD"
- [ ] line_total: 48 (40 + 8 tax)

**Test 3: Food in UK (should be 5% tax)**
```bash
curl -X POST http://localhost:3000/api/pos/tax/calculate-item-tax \
  -H "Content-Type: application/json" \
  -H "x-staff-id: test_cashier_1" \
  -d '{
    "item_name": "Groceries",
    "price": 10.00,
    "quantity": 1,
    "category": "food",
    "jurisdiction": "UK",
    "customer_type": "B2C"
  }' | jq .
```

**Expected:**
- [ ] tax_amount: 0.48 (approx £10 net @ 5%)
- [ ] effective_tax_rate: 5

---

### 3. POST /api/pos/tax/validate-vat (optional)

```bash
curl -X POST http://localhost:3000/api/pos/tax/validate-vat \
  -H "Content-Type: application/json" \
  -d '{"vat_number": "GB123456789"}' | jq .
```

**Expected:**
- [ ] Returns valid: true or false
- [ ] If invalid, returns error message
- [ ] If VIES unavailable, returns fallback response with warning

---

### 4. POST /api/pos/transactions (Full Sale with Tax)

**First:** Get a valid staff token by logging in on frontend

**Then:** Create transaction:
```bash
curl -X POST http://localhost:3000/api/pos/transactions \
  -H "Content-Type: application/json" \
  -H "x-staff-id: YOUR_STAFF_ID" \
  -d '{
    "items": [
      {
        "name": "Book",
        "qty": 1,
        "unit_price": 10.00,
        "category": "books"
      },
      {
        "name": "T-Shirt",
        "qty": 1,
        "unit_price": 20.00,
        "category": "general_merchandise"
      }
    ],
    "payment_type": "cash",
    "location_id": null,
    "customer_phone": null
  }' | jq .
```

**Expected:**
- [ ] transaction_id returned
- [ ] total calculated correctly
- [ ] Verify in database:
  ```sql
  SELECT id, subtotal, total_tax, total, tax_jurisdiction FROM pos_transactions 
  WHERE id = 'TRANSACTION_ID';
  ```
  Should show:
  - subtotal: 30
  - total_tax: 4 (shirt only @ 20%)
  - total: 34

---

### 5. GET /api/pos/tax/report (Tax Report Generation)

```bash
curl "http://localhost:3000/api/pos/tax/report?jurisdiction=UK&start_date=2026-01-01T00:00:00Z&end_date=2026-12-31T23:59:59Z&format=json" \
  -H "x-staff-id: YOUR_STAFF_ID" | jq .
```

**Expected Response Structure:**
- [ ] reporting_period: "2026-01-01 to 2026-12-31"
- [ ] jurisdiction: "UK"
- [ ] transactions_count: number
- [ ] total_turnover: number
- [ ] total_vat_due: number
- [ ] vat_by_rate: array of {rate, net, tax, transactions}

**Test CSV Export:**
```bash
curl "http://localhost:3000/api/pos/tax/report?jurisdiction=UK&start_date=2026-01-01T00:00:00Z&end_date=2026-12-31T23:59:59Z&format=csv" \
  -H "x-staff-id: YOUR_STAFF_ID" > /tmp/report.csv && cat /tmp/report.csv
```

**Expected:**
- [ ] CSV file downloads without error
- [ ] Contains header: "Tax Report - UK"
- [ ] Contains summary section with totals
- [ ] Contains breakdown by rate table
- [ ] Contains detailed transactions

---

### 6. POST /api/pos/settings/save-tax-settings

```bash
curl -X POST http://localhost:3000/api/pos/settings/save-tax-settings \
  -H "Content-Type: application/json" \
  -H "x-staff-id: YOUR_STAFF_ID" \
  -d '{
    "jurisdiction_code": "UK",
    "tax_id": "GB123456789",
    "business_type": "retail"
  }' | jq .
```

**Expected:**
- [ ] success: true
- [ ] Returns saved settings
- [ ] Database check:
  ```sql
  SELECT jurisdiction_code, tax_id, business_type FROM pos_location_tax_settings 
  WHERE owner_id = 'YOUR_OWNER_ID';
  ```

---

## 🎨 FRONTEND UI TESTS

### 1. Login & Navigation

- [ ] Visit `http://localhost:3000`
- [ ] Login with test account (email + PIN)
- [ ] Land on /sell page
- [ ] Verify header shows "📊 Reports" and "⚙️ Settings" buttons
- [ ] Same buttons visible on /inventory page

---

### 2. Settings Page (/settings)

**Navigate:** Click "⚙️ Settings" from /sell

**Tax Settings Tab:**
- [ ] Page loads without errors
- [ ] "Primary Jurisdiction" dropdown populated with jurisdictions
- [ ] Select "UK" → shows standard rate 20%
- [ ] Select "DE" → shows standard rate 19%
- [ ] Reduced rates displayed correctly
- [ ] "Business Type" dropdown shows retail/restaurant/service/digital
- [ ] "Tax ID" input field accepts text (e.g., "GB123456789")
- [ ] Click "Save Tax Settings" → success message appears
- [ ] Refresh page → settings persist

**Compliance Checklist:**
- [ ] All 4 checklist items shown with checkmarks
- [ ] Message: "Tax jurisdiction configured" ✓
- [ ] Message: "Automatic tax calculation enabled" ✓

**Privacy Tab:**
- [ ] Click "Privacy" tab
- [ ] GDPR compliance notice displayed
- [ ] Consent checkboxes visible (email, WhatsApp, SMS, analytics)
- [ ] "Save Privacy Settings" button works

---

### 3. Reports Page (/reports)

**Navigate:** Click "📊 Reports" from /sell

**Tax Report Tab:**
- [ ] Page loads
- [ ] Report type buttons visible (Tax Report, Audit Trail, Payments)
- [ ] "Tax Report" button is active (highlighted)
- [ ] Jurisdiction dropdown populated (UK, DE, FR, US_CA, US_NY, etc.)
- [ ] Date pickers show current quarter
- [ ] Format selector shows "View in Browser" and "Download CSV" options
- [ ] Click "Generate Report" → loading state shows
- [ ] After load, tax summary cards appear:
  - [ ] Card 1: "Total Turnover" with amount
  - [ ] Card 2: "Total Tax Due" with amount
  - [ ] Card 3: "Transactions" with count
- [ ] Tax breakdown table shows:
  - [ ] Column headers: Rate | Net | Tax | Transactions
  - [ ] Row for each tax rate (0%, 5%, 20%)
- [ ] "Download JSON Report" button works
- [ ] Compliance note appears: "✅ This report is audit-ready"

**Test CSV Download:**
- [ ] Change format to "Download CSV"
- [ ] Click "Generate Report"
- [ ] Browser downloads CSV file
- [ ] File named: `tax_report_UK_YYYY-MM-DD.csv`
- [ ] File opens in text editor showing CSV format

---

### 4. Complete Transaction Flow

1. **On /sell page:**
   - [ ] Click "New Sale"
   - [ ] Scan/add items:
     - [ ] Add 1x Book (category: books, price: £10)
     - [ ] Add 2x T-Shirt (category: general_merchandise, price: £20 each)
   - [ ] Proceed to checkout
   - [ ] Verify subtotal: £50
   - [ ] Verify tax breakdown shows correctly
   - [ ] Complete sale

2. **Verify in Database:**
   ```sql
   SELECT id, subtotal, total_tax, total, tax_jurisdiction 
   FROM pos_transactions 
   ORDER BY created_at DESC LIMIT 1;
   ```
   - [ ] subtotal: 50
   - [ ] total_tax: 8 (shirts only)
   - [ ] total: 58
   - [ ] tax_jurisdiction: 'UK'

3. **Check Line Items:**
   ```sql
   SELECT name, qty, unit_price, tax_code, tax_rate, tax_amount 
   FROM pos_items 
   WHERE transaction_id = 'RECENT_TX_ID' 
   ORDER BY created_at;
   ```
   - [ ] Book: tax_code='VAT-0-EXEMPT', tax_rate=0, tax_amount=0
   - [ ] T-Shirt (1): tax_code='VAT-20-STANDARD', tax_rate=20, tax_amount=4
   - [ ] T-Shirt (2): tax_code='VAT-20-STANDARD', tax_rate=20, tax_amount=4

4. **View in Reports:**
   - [ ] Go to /reports
   - [ ] Generate report for current month
   - [ ] Verify "Total Turnover" ≥ £50
   - [ ] Verify "Total Tax Due" includes £8 from sale
   - [ ] Breakdown table shows 20% rate with £40 net, £8 tax

---

## 🔍 DATABASE VERIFICATION

### Check Migration Applied

```sql
-- Verify new tables exist
\dt pos_tax_*
\dt pos_location_tax_settings

-- Should show:
-- - pos_tax_rules
-- - pos_item_tax_codes
-- - pos_tax_audit_log
-- - pos_location_tax_settings
```

### Check Default Tax Codes

```sql
SELECT code, jurisdiction, category, rate 
FROM pos_item_tax_codes 
WHERE owner_id = 'test_owner_id' 
AND jurisdiction = 'UK' 
ORDER BY code;
```

**Expected Results:**
```
code                 | jurisdiction | category                | rate
---------------------+--------------+------------------------+------
VAT-0-EXEMPT        | UK           | books                  |    0
VAT-5-REDUCED       | UK           | food                   |    5
VAT-20-STANDARD     | UK           | general_merchandise    |   20
```

### Check Extended Columns

```sql
SELECT 
  id, 
  total_tax, 
  tax_jurisdiction, 
  tax_country_code, 
  tax_calculation_details_json
FROM pos_transactions 
WHERE id = 'recent_transaction_id';
```

**Expected:**
- [ ] total_tax: not null
- [ ] tax_jurisdiction: 'UK'
- [ ] tax_country_code: 'GB'
- [ ] tax_calculation_details_json: not null

---

## ⚠️ ERROR SCENARIOS TO TEST

### 1. Invalid Jurisdiction
```bash
curl -X POST http://localhost:3000/api/pos/tax/calculate-item-tax \
  -d '{"category":"books","jurisdiction":"INVALID",...}'
```
- [ ] Returns error: "No tax code found"
- [ ] Status code: 400

### 2. Missing Required Fields
```bash
curl -X POST http://localhost:3000/api/pos/tax/calculate-item-tax \
  -d '{"price":10}'  # Missing category, jurisdiction
```
- [ ] Returns error about missing fields
- [ ] Status code: 400

### 3. Unauthorized Request
```bash
curl http://localhost:3000/api/pos/tax/report  # No x-staff-id header
```
- [ ] Returns error: "Unauthorised"
- [ ] Status code: 401

### 4. Invalid VAT Number
```bash
curl -X POST http://localhost:3000/api/pos/tax/validate-vat \
  -d '{"vat_number":"INVALID"}'
```
- [ ] Returns valid: false
- [ ] Error message: "Invalid country code" or similar

---

## 🎯 FINAL CHECKLIST

Before marking Phase 1 complete:

- [ ] All API endpoints tested and working
- [ ] All UI pages load without console errors
- [ ] Complete transaction flow works (scan → checkout → tax calculated → report generated)
- [ ] Database shows correct tax fields in transactions and items
- [ ] Tax reports generate correctly (JSON and CSV)
- [ ] Settings persist after refresh
- [ ] No JavaScript errors in browser console
- [ ] No TypeScript compilation errors
- [ ] Navigation buttons visible and functional
- [ ] Responsive design works on mobile (test with /reports and /settings on mobile device)

---

## 📝 DOCUMENTATION

Refer to: `/Users/lee/Desktop/PHASE1_IMPLEMENTATION.md`

## 🚀 When Ready to Deploy

1. ✅ Confirm ALL checks above pass
2. ✅ Commit changes to git
3. ✅ Push to production branch
4. ✅ Run migration 027 on production database
5. ✅ Deploy new API endpoints
6. ✅ Deploy updated frontend
7. ✅ Smoke test on production (same tests as above)

---

**Last Updated:** 2026-05-13  
**Phase:** 1 of 6  
**Next Phase:** GDPR & Data Governance (Weeks 3-5)
