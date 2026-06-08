import { AcademyArticle } from "@/types/academy";

export const batch246Articles: AcademyArticle[] = [
  {
    slug: "customer-concentration-risk-and-mitigation",
    title: "Customer Concentration Risk and Mitigation: Diversifying Revenue",
    description: "Master concentration risk. Identify exposure, diversify customer base, reduce risk.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["customer concentration", "concentration risk", "customer diversification", "revenue diversification", "customer base", "risk management"],
    keyTakeaways: [
      "Concentration risk fundamentals: If top customer = >20% of revenue, high risk (customer leaves = big impact). Example: £5M ARR, top customer £1.5M (30%) = high risk. Formula: Herfindahl index = Sum(customer % of revenue)^2. If index >1500 = concentrated. Metrics: Top 10 customers % of revenue (target <80%, healthy 50-70%). Customer CAC return: How many quarters to payback CAC from customer. Example: CAC £10K, £5K MRR customer = 2 quarters payback. If top customer £500K ARR, payback <1 quarter (lower payback = less at-risk). Impact: Concentrated portfolio = harder to raise money (investors worried), harder to IPO (require diversification), higher valuation risk (customer leaves = company value drops).",
      "Diversification strategy: Expand customer base (grow number of customers, reduces % per customer). Expand use cases (same customer, new departments = lower risk of replacement). Expand geographies (enter new markets, not dependent on one market). Expand verticals (serve multiple industries, not dependent on one). Example: Starting £5M, top customer 30%. Grow to £10M (double revenue, same top customer still £1.5M = now 15%). Or grow with different customers (top customer stays 20% = diversified). Target: Top 10 customers <70% of revenue, no single customer >20%.",
      "Mitigation tactics: Multi-year contracts (lock in customer, less churn risk). Price locks (customer stays same price, less likely to leave for savings). Product stickiness (hard to replace, more switching costs). Expansion (grow customer, more committed = less likely to leave). Example: Top customer £1.5M/year, lock 3-year deal (£4.5M committed), expand with new product (£250K/year = £2M expanded deal = £6M total = more committed). Cost: Product work, incentives (discount for multi-year). Benefit: Risk mitigation (customer less likely to leave), improve unit economics (higher LTV, lower CAC)."
    ],
    content: [
      {
        heading: "Managing Customer Concentration Risk",
        body: `Building a healthy, diversified customer base.

**Measuring concentration risk**

Key metrics:
1. Top customer % of ARR
   - Healthy: <20% of revenue
   - Moderate risk: 20-30%
   - High risk: >30%

2. Top 10 customers % of ARR
   - Healthy: <70%
   - Moderate risk: 70-80%
   - High risk: >80%

3. Herfindahl Index (HHI)
   - Formula: Sum of (customer % of revenue)^2
   - <1500: Diversified
   - 1500-2500: Moderate concentration
   - >2500: High concentration

Example calculations:
Scenario A (concentrated):
- Top customer: 30% (£1.5M / £5M)
- Top 10: 80%
- HHI: 30^2 + 10% + 10% + ... = 1000+ (concentrated)

Scenario B (diversified):
- Top customer: 15%
- Top 10: 60%
- HHI: 15^2 + 5% + 5% + ... = 300 (diversified)

**Concentration risk by stage**

| Stage | Typical top customer | Top 10 % | Risk level |
|---|---|---|---|
| Early (£0-1M) | 30-50% | 90%+ | High (normal, small base) |
| Growth (£1-5M) | 20-30% | 70-80% | Moderate (growing base) |
| Scaling (£5-20M) | 15-20% | 60-70% | Moderate (maturing) |
| Mature (>£20M) | <15% | <60% | Low (diversified) |

Impact on valuation:
- Concentrated: 5-7x ARR multiple (risk discount)
- Diversified: 8-10x+ ARR multiple (less risk)

**Diversification tactics**

1. Expand customer base (more customers, lower % per customer)
   - Strategy: Grow from 20 customers (£250K ARR each) to 50 customers (£100K ARR each)
   - Impact: Same revenue, less concentrated
   - Cost: Scaling marketing, sales, CS
   - Timeline: 2-3 years

2. Expand use cases within customer
   - Strategy: Top customer uses product for finance, expand to operations
   - Impact: More integrated, less likely to leave, higher expansion revenue
   - Cost: Product work, sales
   - Timeline: 1-2 years

3. Expand geographies
   - Strategy: Grow in Europe, APAC (don't depend on one region)
   - Impact: Reduce geographic risk (recession in one region doesn't hurt all)
   - Cost: International expansion, new marketing spend
   - Timeline: 2-3 years

4. Expand verticals
   - Strategy: Serve multiple industries (not just finance)
   - Impact: Reduce industry risk (change in one industry doesn't hurt all)
   - Cost: Vertical-specific marketing, product features
   - Timeline: 2-3 years

**Mitigation and retention**

Lock customer (reduce churn risk):
- Multi-year contract (£1.5M over 3 years = less likely to churn)
- Price lock (same price 3 years = less incentive to find cheaper alternative)
- Expansion (grow customer value, more invested)

Example customer agreement:
- Year 1: £500K (standard)
- Year 2-3: £500K (locked pricing, no increase)
- Expansion opportunity: New product (£250K/year, negotiated)
- Total: £1.5M base + potential expansion = £2M over 3 years

Result:
- Customer commitment: Locked in 3 years
- Company benefit: Predictable revenue, lower churn risk
- Risk reduction: Top customer still 30%, but committed (less volatile)

`
      }
    ],
    relatedSlugs: ["unit-economics-ltv-cac-payback", "net-revenue-retention-and-expansion-metrics", "subscription-billing-models-and-pricing-architecture"],
    faq: [
      { q: "What's a dangerous level of customer concentration?", a: "Dangerous: Top customer >30% of ARR, top 10 >80%, HHI >2500. Moderate: Top 20-30%, top 10 70-80%. Healthy: Top <20%, top 10 <70%, HHI <1500. Stage matters: Early (concentration normal), mature (must diversify). Impact: Affects fundraising (investors worried), valuation (discount for risk), exit (require diversification)." },
      { q: "How do I diversify my customer base?", a: "1. Expand customers (grow number, lower % per customer). 2. Expand use cases (same customer, new departments). 3. Expand geographies (new markets). 4. Expand verticals (new industries). Typical timeline: 2-3 years to move from concentrated to diversified. Parallel: Lock top customers (multi-year deals, expansion)." },
      { q: "How do I protect against losing a top customer?", a: "1. Multi-year contracts (3-year deal reduces churn risk). 2. Expand customer (more use cases = more committed). 3. Price locks (lock pricing, less incentive to leave). 4. Product stickiness (hard to replace). 5. Relationship (executive sponsor, regular reviews). Combined: Reduce risk from 30% to 15% effective (diversified equivalent)." }
    ],
    videoUrl: ""
  }
];

export default batch246Articles;