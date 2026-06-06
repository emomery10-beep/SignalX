import { AcademyArticle } from "@/types/academy";

export const batch145Articles: AcademyArticle[] = [
  {
    slug: "subscription-metrics-and-mrr-calculations",
    title: "Subscription Metrics and MRR Calculations: The Foundation of SaaS Financial Planning",
    description: "Master subscription metrics. Calculate MRR accurately, understand cohort dynamics, and use metrics to drive business decisions.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "MRR",
      "monthly recurring revenue",
      "ARR",
      "annual recurring revenue",
      "subscription metrics",
      "customer count",
      "ARPU",
      "average revenue per user",
      "churn",
      "retention"
    ],
    keyTakeaways: [
      "MRR = sum of all recurring revenue from subscriptions that started on/before current month and haven't churned. Example: 100 customers × £100/month = £10K MRR (not accounting for churn, which reduces it). Accurate calculation: Count only customers active at month-end. Track two ways: (1) Starting balance + new - churn = ending (check), (2) Count active customers × ARPU = revenue (verification).",
      "ARR = MRR × 12 (simple conversion, assumes stable month-over-month). Example: £10K MRR = £120K ARR. But cohort analysis shows reality: Jan cohort worth £120K lifetime, Feb £140K (growing customer quality). For investor reporting, show both MRR (current monthly burn) and ARR (annualized, but note volatility if churn high).",
      "MRR breakdown: Logos (customer count) × ARPU (average revenue per user). Example: 500 customers × £200/customer = £100K MRR. Improve MRR: (1) Add logos (acquisition), (2) Increase ARPU (pricing, expansion). Most underappreciated: ARPU growth (add-ons, upsells, price increases). 5% ARPU increase = same effort as 5% customer growth, but lower CAC cost (expansion customer = no CAC)."
    ],
    content: [
      {
        heading: "Calculating MRR Accurately",
        body: `Foundation metric that everything else builds on.

**MRR Definition**

MRR = Monthly Recurring Revenue = Sum of all subscription revenue from active customers in a given month.

Key: Recurring (must be ongoing subscriptions, not one-time)
Key: From active customers (must not have churned)
Key: Counted once per month (not double-counted if customer is active all month)

**Calculation Method 1: Starting + Net Changes**

Beginning MRR: £100K (from prior month)

New customers:
- 20 new customers × £100/month = £2K

Expansion (upgrades, add-ons):
- 5 customers upgrade £50 → £150 = £500 more
- 10 customers add-on (£50 add-on) = £500 more
- Total expansion: £1K

Churn:
- 5 customers cancel (£100 each) = -£0.5K

Contraction (downgrades):
- 2 customers downgrade £100 → £50 = -£100

Ending MRR: £100K + £2K + £1K - £0.5K - £0.1K = £102.4K

Growth rate: £2.4K / £100K = 2.4% MoM

**Calculation Method 2: Logos × ARPU**

Active customers (logos): 500
Average Revenue Per User (ARPU): £200/month

MRR: 500 × £200 = £100K

Verify: Both methods should yield same result (sanity check).

**Accounting for Churn**

Most accurate: Count only customers active at month-end

Month 1:
- Customers active: 500
- ARPU: £100/month
- MRR: £50K

During month:
- New: 20 customers
- Churn: 10 customers
- Net: +10 customers

Month 2:
- Customers active: 510
- ARPU: £100/month
- MRR: £51K
- Growth: £1K MRR / £50K = 2% MoM

**Annual Recurring Revenue (ARR)**

Simple calculation: ARR = MRR × 12

Example: £50K MRR × 12 = £600K ARR

Note: Assumes MRR stays constant for 12 months (often not true)

More accurate: ARR = (Beginning customer base × ARPU × 12) + (Expected expansion) - (Expected churn)

Example:
- Baseline: 500 customers × £100 × 12 = £600K
- Expected expansion (5% of base): +£30K
- Expected churn (2% monthly = 24% annually on cohort): -£144K
- Adjusted ARR: £486K

This accounts for organic changes within the year.

**Year-to-Date (YTD) Revenue**

Sum of all MRR for months so far:

Jan: £50K
Feb: £51K
Mar: £52.5K
Apr: £54K
May: £55.5K
YTD: £263K

Not the same as £50K × 5 months = £250K (because MRR growing each month).

Average MRR YTD: £263K / 5 = £52.6K

**Bookings vs Revenue Recognition**

Important distinction:
- Booking: Customer signs contract (upfront recognition)
- Revenue: Over service delivery period (GAAP recognition)

Example:

Customer signs annual contract: £1,200/year upfront payment on Jan 1

Booking (Jan): £1,200 (cash received)
Revenue (monthly):
- Jan: £100 (1 month service)
- Feb: £100 (1 month service)
- ... through Dec: £100

Cash flow: +£1,200 in January (big boost)
Revenue: Spread over 12 months (£100/month for 12 months)

Most SaaS: Mix of monthly billing (daily revenue) and annual billing (lump cash + deferred revenue).

For MRR calculation: Use revenue (not booking), spread over billing period.

**Expansion MRR**

Subset of MRR growth from existing customers:

Expansion breakdown:
- Horizontal expansion: Customers add seats/licenses
- Vertical expansion: Customers upgrade tiers
- Add-on expansion: Customers add features/modules

Example:

Month 1 MRR: £50K
- 500 customers × £100 = £50K

Month 2 MRR change:
- New customers: +£2K
- Expansion: +£1K (upsells/upgrades)
- Churn: -£0.5K
- End MRR: £52.5K

Expansion MRR: £1K out of £2.5K growth = 40% of growth from expansion

Healthy: 30-50% of growth from expansion (vs new customers).

**MRR Leakage**

Track MRR lost to churn and contraction:

Monthly churn: -£0.5K (lost customers)
Monthly contraction: -£0.1K (customers downgrades)
Total MRR leakage: -£0.6K / £50K = 1.2% monthly

If not offset by new MRR, company shrinks.

Growth requires:
- New MRR + expansion MRR > churn + contraction

Example:
- New: £2K
- Expansion: £1K
- Churn: -£0.5K
- Contraction: -£0.1K
- Net: +£2.4K (growing)

Monitor leakage quarterly. Target: <1% monthly churn.

`
      },
      {
        heading: "MRR by Segment and Cohort",
        body: `Understand which customers/segments drive revenue.

**MRR by Segment**

Segment MRR: Revenue from that customer segment only

Example:

| Segment | Customers | ARPU | MRR | % of Total |
|---------|-----------|------|-----|-----------|
| SMB | 400 | £50 | £20K | 40% |
| Mid-market | 80 | £250 | £20K | 40% |
| Enterprise | 20 | £500 | £10K | 20% |
| **Total** | **500** | **£100** | **£50K** | **100%** |

Insights:
- SMB: High volume, low ACV, commodity pricing
- Mid-market: Medium volume, medium ACV, stable
- Enterprise: Low volume, high ACV, customized

Risk: 20% of revenue from 4% of customers (concentration risk).
- If one enterprise customer churns: -£0.5K MRR (1% of total)
- Mitigate: Expand to more enterprise customers (diversify)

**MRR by Acquisition Channel**

| Channel | Customers | ARPU | MRR | CAC | LTV | Ratio |
|---------|-----------|------|-----|-----|-----|-------|
| Organic | 200 | £80 | £16K | £500 | £40K | 80x |
| Paid ads | 150 | £100 | £15K | £2K | £50K | 25x |
| Partnerships | 100 | £120 | £12K | £1.5K | £60K | 40x |
| Sales | 50 | £300 | £15K | £15K | £150K | 10x |
| **Total** | **500** | **£100** | **£50K** | — | — | — |

Best channel: Organic (highest LTV/CAC ratio, but low volume)
Most efficient: Partnerships (good balance)
Worst: Sales (low ratio, though high ACV)

Strategy: Scale organic + partnerships. Sales = only for enterprise (high ACV justifies high CAC).

**MRR Cohort Analysis**

Revenue by acquisition cohort (month customer acquired):

| Cohort | M1 | M6 | M12 | Lifetime |
|--------|----|----|-----|----------|
| Jan 2023 | £1K | £950 | £850 | £10K |
| Jul 2023 | £1.2K | £1.15K | — | £8K+ |
| Jan 2024 | £1.3K | — | — | £7.8K+ |

Trend: Newer cohorts higher starting MRR (better ACV, product improved) but unknown lifetime.

Jan 2023 cohort: Lost 15% of revenue from M1 to M12 (churn + downgrades)

Lesson: M1 MRR predicts lifetime MRR (strong customers retained over time).

**Monthly Recurring Revenue Waterfall**

Visual showing MRR changes month-to-month:

| Component | Amount |
|-----------|--------|
| Prior month MRR | £50K |
| New customer MRR | +£2K |
| Expansion MRR | +£1K |
| Churn MRR | -£0.5K |
| Contraction MRR | -£0.1K |
| **Current month MRR** | **£52.4K** |

Shows all drivers of MRR change.

`
      },
      {
        heading: "Key Metrics Built on MRR",
        body: `Derived metrics from MRR enable analysis and forecasting.

**Customer Count (Logos)**

Total active customers:
- Start: 500
- New: 20
- Churn: 10
- End: 510

Logos growth: 2% MoM

Note: 2% logos growth ≠ 2% MRR growth (different if ARPU changing)

Example:
- Logos growth: 2% (510 vs 500)
- MRR growth: 4.8% (£52.4K vs £50K)
- Reason: Mix shift (acquired higher-ARPU customers or expansion)

**Average Revenue Per User (ARPU)**

ARPU = MRR / Logos

£52.4K / 510 = £102.75 per customer per month

Trend ARPU over time:

| Month | MRR | Logos | ARPU |
|-------|-----|-------|------|
| Jan | £50K | 500 | £100 |
| Feb | £51K | 505 | £101 |
| Mar | £52.5K | 515 | £102 |
| Apr | £54K | 524 | £103 |

ARPU growing 1% per month (expansion, price increases, better mix).

Impact: 1% ARPU growth ≈ 1% revenue growth (if logos flat), but no CAC (expansion revenue).

**Growth Rate**

Month-over-month (MoM) growth:
(Current MRR - Prior MRR) / Prior MRR

£52.4K - £50K = £2.4K
£2.4K / £50K = 4.8% MoM growth

**Annualized**: If 4.8% MoM growth sustained for 12 months:
- Start: £50K
- End: £50K × (1.048)^12 = £80K (60% annual growth)

Year-over-year (YoY) growth:
Current month vs same month last year

Year 1 April MRR: £54K
Year 2 April MRR: £80K
YoY growth: (£80K - £54K) / £54K = 48%

**Net Dollar Retention (NDR)**

Also called NRR (Net Revenue Retention):
(Ending MRR from cohort - Churn) / Beginning MRR

Example cohort (Jan customers):

Beginning MRR (Jan): £1K from 10 customers × £100

Ending MRR (June):
- 6 customers remain (4 churned) = £600 base
- 2 customers expanded to £150 = £300 extra
- Total: £900

Churn: £400 (4 customers × £100)

NDR: (£900 - £0) / £1K = 90% (actually contraction, not retention)

Wait, let me recalculate:

NDR = (Ending MRR including expansion) / Beginning MRR
= £900 / £1K = 90% (losses offset partially by expansion)

Healthy: >100% NDR (expansion offsets churn)
- Example: £1K start, 20% churn (-£200), 30% expansion (+£300) = £1.1K NDR (110%)

**Calculating NRR Properly**

NRR = (Expansion MRR + Contraction MRR - Churn MRR) / Beginning MRR

Example (whole company):
- Beginning MRR: £50K
- Expansion: +£1K
- Contraction: -£0.1K
- Churn: -£0.5K
- Net change: £0.4K
- NRR: (£1K - £0.1K - £0.5K) / £50K = £0.4K / £50K = 100.8%

NRR >100% means existing customers generate more MRR than they started (healthy).
NRR <100% means shrinking from existing (red flag).

`
      },
      {
        heading: "Using MRR for Planning and Forecasting",
        body: `MRR metrics feed financial forecasts and strategic decisions.

**Forecasting MRR**

Starting point: Current MRR and known changes

Current MRR: £50K
Known changes:

New customer acquisition:
- Sales pipeline: 10 deals in "negotiation" stage, expected close: 8 × £200 = £1.6K

Expansion:
- CS program targets 20 customers to upsell
- Expected: 8 expand × £50 average = £0.4K

Churn:
- Historical: 2% monthly = £1K

Expected next month MRR:
£50K + £1.6K + £0.4K - £1K = £51K (2% growth)

Build this bottom-up by segment/channel for more accuracy.

**Forecasting 12 Months**

Project MRR forward quarter-by-quarter:

| Quarter | MRR Start | New | Expansion | Churn | MRR End | Growth |
|---------|-----------|-----|-----------|-------|---------|--------|
| Q1 | £50K | £5K | £0.8K | -£3K | £52.8K | 5.6% |
| Q2 | £52.8K | £6K | £1K | -£3.2K | £56.6K | 7.2% |
| Q3 | £56.6K | £7K | £1.2K | -£3.4K | £61.4K | 8.5% |
| Q4 | £61.4K | £8K | £1.4K | -£3.7K | £67.1K | 9.3% |
| **Ending** | — | — | — | — | **£67.1K** | **34.2% annual** |

Note: Growth accelerating (new customer acquisition ramping, expansion growing).

**Decision-Making with MRR Metrics**

MRR metrics inform strategic decisions:

1. Hiring decisions
   - Current: £50K MRR
   - Forecast: £67K by year-end (34% growth)
   - Hiring needed: Sales team (to reach £8K quarterly new MRR)
   - Cost: 2 new sales reps × £80K = £160K
   - Payoff: Extra £17K MRR × 12 = £204K new annual revenue
   - ROI: (£204K - £160K) / £160K = 27.5%

2. Pricing decisions
   - Current ARPU: £100/month
   - Raise to: £110/month (+10%)
   - Impact on logos (assume 5% churn from price increase)
   - New MRR: (500 × 95%) × £110 = £51.7K
   - Old MRR: £50K
   - Net: +£1.7K MRR (3.4% gain despite churn)
   - Decision: Raise prices (net positive)

3. Product decisions
   - Feature: Expansion opportunities (expansion currently only £0.8K)
   - Goal: Increase to £1.2K (50% increase)
   - Impact: NRR improves from 102% to 105%
   - Over time: LTV increases 10-15%
   - Worth investing 4 weeks dev (£8K)

**Communicating MRR to Stakeholders**

To investors:
- "MRR: £50K, growing 5% monthly = 60% annualized"
- "ARR: £600K (£50K × 12)"
- "Growth acceleration: 4% → 6% → 8% quarterly (ramping up)"

To team:
- "Each new customer: £100/month to MRR target"
- "Each expansion: £50/month helps hit growth"
- "Each churn: £100/month lost (prevent it)"
- "Team target: £5K new MRR this month = 50 new customers OR 100 existing upselling to average"

To board:
- MRR trend (chart)
- NRR (% growth from existing)
- CAC payback (months to recover cost)
- Path to profitability (when does net income turn positive?)

MRR is the foundation metric. Everything else builds from it.

`
      }
    ],
    relatedSlugs: [
      "unit-economics-ltv-cac-payback",
      "churn-analysis-retention-improvement",
      "financial-forecasting-modeling",
      "metrics-dashboard-design-kpi-tracking",
      "p-l-statement-architecture-profitability"
    ],
    faq: [
      {
        q: "How do I calculate MRR accurately?",
        a: "Method 1: Count active customers × ARPU. Method 2: Prior MRR + new MRR - churn - contraction. Both should match (verification). Important: Count only customers active at month-end (prevents double-counting). For annual billing (customers prepay), recognize monthly (not upfront). Example: 500 customers × £100 = £50K MRR."
      },
      {
        q: "What's the difference between MRR and ARR?",
        a: "MRR = current month's recurring revenue. ARR = MRR × 12 (annualized, but assumes stable growth). ARR useful for investors (shows scale), MRR useful for operations (shows monthly trends). Example: £50K MRR = £600K ARR. Note: If growing 5% monthly, actual ARR path = £50K → £600K in Jan, but £630K projected by Dec (growth compounds)."
      },
      {
        q: "How do I improve MRR?",
        a: "Two levers: (1) Add customers (logos), (2) Increase ARPU (per-customer revenue). New customer adds: £100 CAC cost (acquisition). ARPU increase: £0 CAC (expansion, pricing). Focus on ARPU first (lower cost, faster impact). Example: 500 customers × £100 ARPU. Increase ARPU 10% = £5K more MRR (no CAC). Acquire customers at 5% growth = £2.5K more (plus £500 CAC cost)."
      },
      {
        q: "What MRR growth rate should I target?",
        a: "Early stage (<£1M ARR): 10-20% monthly growth (steep). Growth stage (£1-10M): 5-10% monthly (compound). Scale stage (>£10M): 2-5% monthly (hard to accelerate). Target: Growth rate supporting burn rate / profitability timeline. Example: £100K monthly burn, £50K MRR, 5% growth. Need 8 months to profitability (if growth continues). Accelerate growth or reduce burn."
      }
    ],
    videoUrl: ""
  }
];

export default batch145Articles;
