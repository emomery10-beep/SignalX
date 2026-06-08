import { AcademyArticle } from "@/types/academy";

export const batch323Articles: AcademyArticle[] = [
  {
    slug: "revenue-recognition-and-accounting-standards",
    title: "Revenue Recognition and Accounting Standards: Accurate Financial Reporting",
    description: "Master revenue recognition. Apply standards, avoid errors, ensure compliance.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["revenue recognition", "ASC 606", "GAAP", "accrual accounting", "accounting standards"],
    keyTakeaways: [
      "Revenue recognition principle: Recognize revenue when earned, not when cash received. ASC 606 standard: (1) Identify contract, (2) Identify performance obligations, (3) Determine transaction price, (4) Allocate price, (5) Recognize when obligation satisfied. Example: 12-month £12K contract. Recognize £1K monthly (not £12K upfront). Cost: Accounting complexity, potentially need consultants. Benefit: Accurate financials (not overstated), audit-ready, avoid restatements.",
      "Common mistakes: (1) Recognizing subscription upfront (wrong: £12K month 1, should be £1K × 12 months), (2) Shipping = revenue (actually revenue when customer receives and accepts), (3) Multi-year contracts (allocate evenly unless specific performance obligations), (4) Free trials (not revenue). Impact: Overstated revenue (misleads investors, auditors). Fix: Document revenue recognition policy (when does each revenue stream get recognized?), implement controls (invoice date ≠ recognition date).",
      "Implementation: Document policy for each revenue type (subscription, one-time, professional services, licensing). Example subscriptions: Monthly SaaS = recognize monthly. Example services: Professional services = recognize as services delivered (monthly if delivered monthly). Example licenses: Perpetual license = recognize upfront. Combine with controls: Monthly reconciliation (billing vs revenue recognized should match after adjustments)."
    ],
    content: [
      {
        heading: "Mastering Revenue Recognition and Accounting Standards",
        body: `Understanding and applying revenue recognition principles correctly.

**Revenue recognition fundamentals**

Definition:
- Core principle: Recognize revenue when earned, not when cash received
- Standard: ASC 606 (GAAP requirement for public companies, best practice for all)
- Benefit: Accurate financial reporting (not overstated), audit-ready, avoid restatements

Key difference:
- Cash basis: Record revenue when cash received (simple, but misleading)
- Accrual basis: Record revenue when earned (accurate, required)

Example:
- Customer signs 12-month £12K contract (month 1)
- Cash basis: Record £12K in month 1 (overstates revenue)
- Accrual basis: Record £1K/month for 12 months (accurate)
- Result: Month 1 revenue £1K (not £12K), month 12 complete, no revenue beyond month 12

**ASC 606 five-step model**

Step 1: Identify the contract
- Is there a written/verbal agreement?
- Is there commercial substance (both parties committed)?
- Example: Customer signs SaaS subscription agreement (yes, contract exists)

Step 2: Identify performance obligations
- What is the company promising to deliver?
- Example: Monthly access to software (performance obligation)
- Can be multiple: Software access + implementation + support

Step 3: Determine transaction price
- What is the customer paying?
- Fixed price (£100/month) or variable (£1 per transaction)?
- Example: £100/month subscription

Step 4: Allocate the price
- If multiple performance obligations, allocate price to each
- Example: £80 software + £20 support (if separately identifiable)

Step 5: Recognize revenue
- When is each obligation satisfied?
- Over time (performance obligation satisfied gradually) or point in time (delivered)?
- Example: SaaS software access = over time (recognize monthly)

**Revenue recognition by business model**

Model 1: Subscription (recurring revenue)
- Performance obligation: Monthly/annual software access
- Timing: Satisfied over time (monthly)
- Recognition: Monthly (£100/month for 12-month contract = £1K/month)
- Journal entry: Dr. Cash £100, Cr. Revenue £100 (monthly)
- Accounting: Deferred revenue on balance sheet (liability for future months)
- Example: 100 customers × £100/month = £100K MRR revenue recognized monthly

Model 2: Perpetual software license
- Performance obligation: Ownership of software
- Timing: Satisfied at point in time (delivery/installation)
- Recognition: All at once when delivered
- Journal entry: Dr. Cash £10K, Cr. Revenue £10K (on delivery date)
- Example: Customer buys £10K perpetual license, recognize all month 1

Model 3: Professional services
- Performance obligation: Delivery of services
- Timing: Satisfied over time (as work progresses)
- Recognition: Monthly/weekly as work delivered (by % complete)
- Example: 3-month implementation project (£30K total)
  - Month 1: 30% complete = recognize £9K
  - Month 2: 50% complete = recognize £15K
  - Month 3: 20% complete = recognize £6K
  - Total: £30K over 3 months (matches work)

Model 4: Usage-based/transaction
- Performance obligation: Each transaction/use
- Timing: Satisfied at each transaction
- Recognition: When transaction occurs
- Example: Payment processing (2% per transaction)
  - Customer processes £10K transaction
  - Recognize £200 revenue (2% × £10K) immediately

Model 5: Maintenance/support contracts
- Performance obligation: Standing ready to provide support
- Timing: Satisfied over time (throughout contract term)
- Recognition: Ratably over contract period
- Example: Year-long support contract (£12K)
  - Recognize £1K/month (even if no support request that month)

**Common revenue recognition errors**

Error 1: Recognizing subscription upfront

Example (wrong):
- Customer signs 12-month contract (£12K, received £12K cash month 1)
- Record: Dr. Cash £12K, Cr. Revenue £12K (month 1)
- Result: Month 1 revenue £12K (overstated!)
- Month 2-12: No revenue recognized (but customer still getting service)

Correct:
- Dr. Cash £12K, Cr. Deferred revenue £12K (month 1)
- Each month 1-12: Dr. Deferred revenue £1K, Cr. Revenue £1K
- Result: £1K revenue/month (accurate), deferred revenue decreases

Impact: Overstated revenue (month 1 revenue is 12x actual), misleads investors/auditors

Error 2: Recognizing at invoice date instead of delivery

Example (wrong):
- Invoice sent: June 1 (12-month service)
- Recognize: £12K in June
- Service delivered: June 1 - May 31 next year
- Result: June revenue includes July-May service (wrong timing)

Correct:
- June revenue: £1K (June service only)
- July-May revenue: £1K each month (as service delivered)

Error 3: Recognizing one-time fees in wrong period

Example (wrong):
- Setup fee (£2K) charged with monthly subscription
- Both recognized when cash received
- Result: Overstated first month revenue

Correct:
- Setup fee: Recognize when setup completed (may be before/after invoice)
- Monthly fee: Recognize monthly
- Example: Setup done April, monthly starts May
  - April revenue: £2K (setup)
  - May-April next year: £100/month (subscription)

Error 4: Free trials and discounts

Example (wrong):
- Free trial period: Don't record anything
- Paying period: Recognize full amount
- Result: Inconsistent (trial = no revenue, post-trial = revenue)

Correct:
- Record free trial at fair value (as revenue, contra'd by service expense)
- OR: Don't record trial, start revenue when payment starts
- Consistency: Measure full economic value

**Revenue accounting examples**

Company: B2B SaaS
Customer A: 12-month subscription, £12K/year (invoiced upfront)
- Month 1: Cash in £12K, Deferred revenue liability £12K
- Month 1-12: Revenue £1K/month, Deferred revenue decreases £1K/month
- Year-end: Revenue £12K (not £12K month 1), Deferred revenue £0

Customer B: Professional implementation, £30K (3 months, invoiced monthly)
- Month 1: Invoice £10K, Revenue £9K (30% completion), Deferred revenue £1K (future work)
- Month 2: Invoice £10K, Revenue £15K (50% completion), Deferred revenue -£5K
- Month 3: Invoice £10K, Revenue £6K (20% completion), Deferred revenue $0
- Total: £30K revenue over 3 months (matches work)

Customer C: Enterprise license, £100K perpetual (invoiced month 1)
- Month 1: Cash in £100K, Revenue £100K (complete, point-in-time)
- Months 2-12: No further revenue (already recognized)

**Audit readiness for revenue**

Preparation:
1. Document revenue recognition policy (written, by revenue type)
2. Test revenue (sample transactions, verify correct timing)
3. Reconcile: Billing system vs accounting revenue
4. Review: Deferred revenue schedule (future revenue obligations)
5. Judgments: Document any complex decisions (ASC 606 requires judgment)

Example controls:
- Revenue recognition policy document (signed by CFO)
- Billings reconciliation (invoiced = billed to customer, not necessarily revenue)
- Deferred revenue review (monthly check: balance declining as revenue recognized?)
- Journal entry support (all revenue entries have supporting documentation)

**Key metrics and monitoring**

Monthly dashboard:

| Metric | Definition | Monitoring |
|---|---|---|
| Recognized revenue | Cash billing adjusted for timing (accrual) | Should trend up with business growth |
| Deferred revenue | Future revenue not yet recognized (liability) | Should be growing (customer prepays) |
| Revenue: Billing ratio | Recognized revenue / Billed revenue | Should be ~1.0 (same per customer, different accounting) |
| Billings | Cash received (aggressive metric) | Should be ≥ Recognized revenue |

Example:
- Billings: £100K/month (aggressive, cash basis)
- Recognized revenue: £80K/month (conservative, accrual basis)
- Ratio: 80% (means 20% is deferred, which makes sense for upfront billing)

**Common mistakes to avoid**

Mistake 1: No documented policy
- Problem: Each person recognizes revenue differently (inconsistent)
- Fix: Written policy (when is revenue recognized for each type?)
- Impact: Auditor confidence, consistency, audit-ready

Mistake 2: No reconciliation
- Problem: Billing doesn't match revenue (can't explain differences)
- Fix: Monthly billing vs revenue reconciliation
- Impact: Auditors caught issues, can explain everything

Mistake 3: Not tracking deferred revenue
- Problem: Don't know future revenue obligations
- Fix: Track deferred revenue schedule (monthly rollforward)
- Impact: Better forecasting (known future revenue)

Mistake 4: Complex arrangements without documentation
- Problem: Multi-year contracts, discounts, bundle deals = unclear revenue timing
- Fix: Analyze each contract (when obligations satisfied?)
- Impact: Correct revenue, audit-ready

`
      }
    ],
    relatedSlugs: ["financial-controls-and-audit-readiness", "subscription-billing-models-and-pricing-architecture", "accounting-for-startups-and-small-businesses", "financial-planning-and-budgeting", "metrics-dashboard-design-kpi-tracking"],
    faq: [
      { q: "What does revenue recognition mean?", a: "Revenue recognition: Record revenue when earned, not when cash received (accrual accounting). ASC 606 standard: (1) Identify contract, (2) Identify obligations, (3) Determine price, (4) Allocate price, (5) Recognize when satisfied. Example: 12-month £12K subscription = recognize £1K monthly (not £12K upfront). Impact: Accurate financial reporting (prevents overstating revenue)." },
      { q: "How do I recognize subscription revenue?", a: "Subscription = performance obligation satisfied over time. Recognize monthly (or per billing period). Example: 100 customers at £100/month = £100K MRR recognized monthly. Accounting: Dr. Cash (full amount), Cr. Deferred revenue (liability), then monthly: Dr. Deferred revenue, Cr. Revenue. Result: Deferred revenue decreases each month as revenue recognized." },
      { q: "What's the difference between billing and revenue?", a: "Billing = cash received (aggressive metric). Revenue = cash adjusted for timing (conservative, accurate). Example: Invoice 12-month contract month 1 = £12K billed, but only £1K revenue (month 1). Rest (£11K) is deferred revenue (liability). Monthly: Billed stays £12K, Revenue increases £1K/month for 12 months. Key: Reconcile monthly (billed vs revenue, explain differences)." }
    ],
    videoUrl: ""
  }
];

export default batch323Articles;
