import { AcademyArticle } from "@/types/academy";

export const batch241Articles: AcademyArticle[] = [
  {
    slug: "retention-and-churn-reduction-mechanics",
    title: "Retention and Churn Reduction Mechanics: Building a Sticky Product",
    description: "Master churn reduction. Identify reasons, fix drivers, improve retention.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["churn", "retention", "churn reduction", "retention mechanics", "customer retention", "at-risk customers", "churn analysis", "retention strategy"],
    keyTakeaways: [
      "Churn fundamentals: Monthly churn rate = (Customers lost / Starting customers) × 100. Example: 100 customers start, 3 churn = 3% monthly churn. Annual: (1 - 0.97^12) = 30% annual churn. Target: <2% monthly (healthy SaaS). Impact: 3% monthly = 30% annual (shrinking). Measure: Cohort retention (% from cohort still active). Diagnosis: Why customers leave? Support, survey, call customers. Top reasons: Product doesn't solve problem, cost (cheaper alternative), replacing with internal (build themselves). Action: Fix product (add features), improve customer success (onboarding, support), adjust pricing.",
      "Churn analysis: Voluntary (customer cancels, communication) vs involuntary (payment failure, no action). Voluntary churn reasons: Lack of ROI (didn't realize value), product issues (product doesn't work), found alternative (better competitor), cost (too expensive). Cost: Most common. Fix: Support/CS team reduces 1-2% churn (cost: £500K team, value: £1M+ ARR save). Involuntary: Payment failure + dunning = 10-15% of potential churn. Fix: Automatic retry + dunning = recover 30-40% (save £100K-500K).",
      "Churn reduction playbook: Early warning (health score, at-risk flagging, proactive outreach). Recovery (CSM calls at-risk, understands problem, fixes or negotiates extension). Win-back (win-back campaigns for past churned customers, 10-30% can be reactivated for lower cost than new CAC). Retention focus (CS metrics: NRR, churn, expansion, NPS). Investment: CS team cost scales with revenue. Payback: Good CS = 1-2% churn reduction = £100K-1M+ ARR value (100x+ ROI for mid-size SaaS)."
    ],
    content: [
      {
        heading: "Measuring and Reducing Churn",
        body: `Keeping customers and growing revenue.

**Churn measurement**

Monthly churn rate:
- Formula: Customers lost / Starting customers
- Example: 100 → 97 = 3% monthly churn
- Annual: (1 - 0.97^12) = 30% annual churn

Churn by type:
| Type | % | Impact | Fix |
|---|---|---|---|
| Voluntary (cancellation) | 70% | Customer actively leaves | Product, price, support |
| Involuntary (payment fail) | 15% | Payment failure not recovered | Dunning, retry logic |
| Pause/downgrade | 15% | Reduces revenue, may re-engage | Win-back, expand |

Cohort retention:
- Track % of cohort still active month 1, 3, 6, 12
- Healthy: 80% month 1, 60% month 6, 40%+ month 12
- Poor: <70% month 1 (onboarding issue), declining fast

**Churn root cause analysis**

Survey churned customers:
- "Why did you cancel?" (open-ended)
- Options: Product didn't work, found alternative, too expensive, no longer needed
- Pattern: If 40% say product issue, prioritize product fixes

Interview customers:
- Call 10% of churned customers (sample)
- Deep dive: What would have kept you? What does alternative offer?
- Insights: Competitive feature, price point, use case mismatch

Analyze patterns:
| Reason | % | Action |
|---|---|---|
| Product limits | 35% | Prioritize roadmap features |
| Price too high | 30% | Review pricing strategy |
| Found alternative | 20% | Competitive positioning |
| No longer needed | 15% | Segment/focus issue |

**Churn reduction tactics**

Prevent churn:
1. Onboarding (first 90 days critical, set customers up for success)
2. Early wins (deliver value in first month, build confidence)
3. Proactive support (check-in at week 4, month 3, month 6)
4. Health monitoring (track engagement, flag at-risk)

Recover at-risk:
1. Identify (health score <60, engagement dropping)
2. Contact (CSM calls within 3 days)
3. Understand (root cause: product, price, alternatives?)
4. Fix (add missing features, reduce price, prove ROI)

Win-back:
1. Historical churn data (which customers left, when)
2. Campaign (email offer: "Come back for 50% off")
3. Reactivation: 10-30% of past customers can be reactivated
4. CAC: Cheaper than new customer (already know product)

Investment and ROI:
- CS team: £500K/year (5 CSMs)
- Expected impact: 1-2% churn reduction (£100K-1M value)
- ROI: 100-500x (one of best investments for SaaS)

`
      }
    ],
    relatedSlugs: ["customer-success-metrics-and-program-design", "net-revenue-retention-and-expansion-metrics", "cohort-analysis-and-customer-lifecycle"],
    faq: [
      { q: "What's a good churn rate?", a: "Monthly: <2% healthy, <1% excellent, 3-5% needs improvement. Annual: <20% healthy, <10% excellent. Depends on segment: Enterprise <1%, SMB 3-5% typical. Track: By cohort (month 1 retention higher than month 12)." },
      { q: "How do I reduce churn?", a: "1. Identify root cause (survey, interviews). 2. Address #1 reason (product, price, support). 3. Improve onboarding (first 90 days critical). 4. Proactive support (check-ins, health monitoring). 5. Win-back campaigns. Cost: CS investment £500K. Benefit: 1% churn reduction = £100K+ value." },
      { q: "Should I focus on preventing churn or acquiring new customers?", a: "Both, but retention is leverage: Keeping 1 customer 3 extra months = LTV increase 25%. Acquiring costs CAC (payback 6-12 months). Retention improvement: Faster payback, lower cost. For every 1% churn reduction = 0.5 year LTV extension (huge impact)." }
    ],
    videoUrl: ""
  }
];

export default batch241Articles;