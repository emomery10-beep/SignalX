import { AcademyArticle } from "@/types/academy";

export const batch202Articles: AcademyArticle[] = [
  {
    slug: "customer-concentration-risk-and-mitigation",
    title: "Customer Concentration Risk and Mitigation: Diversifying Revenue",
    description: "Master customer concentration. Identify risk, diversify revenue, and build resilience.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "customer concentration",
      "concentration risk",
      "customer diversification",
      "revenue concentration",
      "top customer risk",
      "customer dependency",
      "revenue stability",
      "concentration metrics",
      "risk mitigation",
      "customer portfolio"
    ],
    keyTakeaways: [
      "Concentration risk: Top 5 customers >50% of revenue = risky (one loss = major impact). Healthy: Top 5 customers <40% of revenue. Metric: Herfindahl index (concentration score 0-1, 0 = perfect diversity, 1 = one customer). Example: Top customer 20%, #2 15%, #3 10%, #4 8%, #5 7% = HHI 0.1, sum 60% (risky). Fix: Acquire 10+ new customers at similar ACV (dilute top 5 to <40%). Timeline: 12-18 months to diversify.",
      "Risks: If top customer (30% revenue) leaves = 30% loss overnight. Chained: If top 2 customers from same industry (banking) and recession hits, both leave (correlated risk). Mitigation: Diversify by industry (not just new customers). Example: Across 10 industries (finance, HR, ops, etc.), no single customer >10% = safer. Downsides: Sales must adapt to different verticals (messaging, features, support model changes).",
      "Monitoring and action: Track top 10 customer concentration monthly. Alert if: Top 5 >50%, or any customer >20% of revenue. Actions: (1) Build tier-down plan (if top customer at risk, which tier 2-5 customers could grow 50% to offset). (2) Diversify proactively (acquire 15+ new customers to reduce top 5 %). (3) Retention focus (top customers = more engagement, QBRs, CS investment). (4) Product adaptation (ensure top customer needs aren't outliers, else product becomes too customized)."
    ],
    content: [
      {
        heading: "Understanding and Measuring Concentration Risk",
        body: `Quantifying customer dependency.

**Concentration Metrics**

Simple metric - Top 5 concentration:
- Sum % of revenue from top 5 customers
- Healthy: <40%
- Acceptable: 40-50%
- Risk: >50%

Example companies:
- Well-diversified: Top 5 = 25% (each ~5%), 20 customers needed to make 50% revenue
- Moderate risk: Top 5 = 45% (customer 1 at 15%, 2 at 12%, etc.)
- High risk: Top 5 = 60% (customer 1 at 25%, 2 at 15%, etc.)

Herfindahl-Hirschman Index (HHI):
- Formula: HHI = Σ(market share%)²
- Range: 0 (perfect diversity) to 1 (monopoly)
- Example: Top 5 customers = 20%, 15%, 10%, 8%, 7%, rest = 40%
  - HHI = 0.20² + 0.15² + 0.10² + 0.08² + 0.07² + (0.40/remaining)²
  - HHI = 0.04 + 0.0225 + 0.01 + 0.0064 + 0.0049 + 0.0016 = 0.0954 (9.54%)
- Interpretation:
  - <0.05 (5%): Well-diversified (healthy)
  - 0.05-0.10 (5-10%): Moderate concentration
  - >0.10 (10%+): High concentration (risky)

Gini coefficient:
- Measures inequality in distribution
- Range: 0 (equal, all customers same size) to 1 (unequal, one customer)
- High Gini (>0.6) = concentration risk

**Customer Portfolio Analysis**

Segment customers by size and count:

| Segment | Customers | Avg ACV | Total Revenue | % of Revenue | Concentration |
|---------|-----------|---------|----------------|--------------|-----------------|
| Tier 1 (Enterprise) | 2 | £100K | £200K | 20% | HIGH |
| Tier 2 (Mid-market) | 8 | £30K | £240K | 24% | MEDIUM |
| Tier 3 (SMB) | 50 | £5K | £250K | 25% | LOW |
| Tier 4 (Self-serve) | 200 | £2K | £400K | 40% | VERY LOW |
| **Total** | **260** | **£3.8K** | **£1.09M** | **100%** | |

Analysis:
- Top 2 customers (Enterprise): 20% of revenue
- Top 10 customers: 44% of revenue
- Risk: If lose top 2 = 20% revenue loss (severe)
- Mitigation: Build tier 2 (mid-market) to 35%+ of revenue

**Correlated Risk**

Risk: Customers in same industry, same geography, or same use case fail together

Example: Fintech concentration
- Customer 1: Payment processor (20% revenue)
- Customer 2: Lending platform (15% revenue)
- Customer 3: Investment app (10% revenue)
- Total fintech: 45% of revenue
- Risk: Fintech downturn = all three at risk (correlated)

If recession hits fintech:
- Stress scenario: All 3 lose 50% usage (reduce customer spending)
- Impact: 45% × 50% = 22.5% revenue loss (catastrophic)

Mitigation:
- Diversify by industry (finance, HR, operations, sales)
- Diversify by geography (US, Europe, Asia)
- Diversify by use case (different problems solved)

Example well-diversified:
- Industry: 20% finance, 15% HR, 15% operations, 15% sales, 35% other
- Geography: 50% US, 30% Europe, 20% rest
- No single customer >10%
- Correlated risk: Lower (failure in one segment doesn't trigger cascade)

`
      },
      {
        heading: "Mitigation Strategies and Diversification",
        body: `Reducing concentration risk.

**Diversification Strategy**

Current state: Top 5 = 60% revenue, Top customer 25%

Goal: Top 5 = 40% revenue, no customer >10%

Timeline: 18 months

Actions:
1. Acquire new customers (growth)
   - Target: Add 20 new mid-market customers (£5K ACV each = £100K new revenue)
   - Timeline: Months 1-12 (sustained new sales)
   - Impact: Dilutes top 5 from 60% to 55% (slow)

2. Expand existing tier 2-5 customers
   - Target: Grow 10 mid-market customers 30% (£3K → £4K ACV)
   - Value: +£10K revenue
   - Timeline: Months 6-18 (CS + product)
   - Impact: Faster tier-down effect

3. Reduce dependency on top customer
   - Understand: Why are they 25%? Single use case? All teams?
   - Plan: Product additions for adjacent use cases (sell them more)
   - Alternative: Help customer consolidate competitors (keep them, serve more needs)

Result after 18 months:
- Top customer: Still 20-22% (grew, but slower than company)
- Top 5: 40-42% (improved)
- HHI: 0.08 (from 0.12, improved)
- Risk profile: Reduced from high to moderate

**Tiering Down Top Customers**

Scenario: Top customer at risk of losing 25% revenue

Mitigation plan:
- Tier 2 customer (currently 12% revenue) → grow to 17% (+5%)
- Tier 3 customer (currently 8%) → grow to 13% (+5%)
- Tier 4 customer (currently 6%) → grow to 9% (+3%)
- Tier 5 customer (currently 4%) → grow to 6% (+2%)
- New customer (currently 0%) → grow to 5% (+5%)
- Total offset: 5 + 5 + 3 + 2 + 5 = 20% (covers 80% of lost revenue)

Cost: CS, product, support investment = £100K
Result: Reduced impact of top customer loss from -25% to -5%

**Product and Positioning Diversification**

Risk: Product optimized only for top customer (one-customer product)

Solution: Broaden use cases
- Current: Built for customer 1's specific workflow
- Problem: Product alienates other customers (features they don't need, missing features they do)
- Action: Add adjacent use cases (customer 1 uses feature A, tier 2 needs feature B, combine)

Example:
- Top customer (25%): Wants custom reporting
- Tier 2 customer (12%): Wants integration with accounting software
- Tier 3 customer (8%): Wants mobile app
- Solution: Build reporting (satisfies 1), integration API (satisfies 2), mobile roadmap (satisfies 3)
- Result: All three happy, product more generic, less dependent on customer 1 requirements

**Retention and Engagement**

For top customers (concentration risk):
- More investment justified (high value)
- Quarterly business reviews (mandatory)
- Executive sponsor (CEO/board relationship)
- Customization (within reason, but try to genericize)
- Pricing: Lock in 2-3 year deals (reduce churn risk)

Example: Top customer negotiation
- Currently: Monthly billing, £250K/year, at-will cancellation
- Offer: Annual commitment £240K (5% discount), 2-year term
- Benefit: Locks in revenue, gives time to diversify if needed

Monitoring:
- Monthly: Health score, usage trends, NPS
- Quarterly: QBR, ensure relationship strong
- Alert: If any sign of dissatisfaction (usage drop, missed QBR, complaints)

`
      }
    ],
    relatedSlugs: [
      "metrics-dashboard-design-kpi-tracking",
      "churn-analysis-retention-improvement",
      "customer-success-metrics-and-program-design",
      "unit-economics-ltv-cac-payback",
      "financial-forecasting-modeling"
    ],
    faq: [
      {
        q: "What's a healthy customer concentration level?",
        a: "Metric: Top 5 customers <40% of revenue. Benchmark: Top customer typically 10-15% (healthy), top 5 = 25-40% (acceptable). Risk: Top 5 >50% (vulnerable to loss). Herfindahl Index: <0.05 (5%) = well-diversified, >0.10 (10%) = risky. Monthly monitoring: Track top 10 customer concentration. Alert if top 5 >50% or any customer >20%."
      },
      {
        q: "How do I reduce customer concentration risk?",
        a: "Three tactics: (1) Acquire new customers in adjacent segments (20+ new customers over 18 months), (2) Expand tier 2-5 customers (30% growth = tier down), (3) Cross-sell existing top customers (new products/use cases, reduce dependency on single use case). Timeline: 18 months to improve from top 5 = 60% to 40%. Cost: £100K in expansion investment. ROI: Reduces risk of -25% revenue loss to -5%."
      },
      {
        q: "What if my top customer is in the same industry as other top customers?",
        a: "Correlated risk: If industry downturn, all fail together. Example: 3 fintech customers = 45% revenue at risk. Mitigation: Diversify by industry. Ideal: No single customer >10%, spread across 10+ industries. Monitor: Track concentration by industry, geography, use case. Alert: If any segment >40% of revenue or any customer >15%."
      },
      {
        q: "How much should I invest in top customer retention?",
        a: "High investment justified (high-value customers). Quarterly QBRs (mandatory), executive sponsor (CEO relationship), dedicated CS/support. Pricing: Lock in 2-3 year deals (reduce churn risk, lock in revenue). Customization: Yes, but try to genericize (other customers benefit). Balance: Invest in retention, but also diversify (don't become one-customer company)."
      }
    ],
    videoUrl: ""
  }
];

export default batch202Articles;
