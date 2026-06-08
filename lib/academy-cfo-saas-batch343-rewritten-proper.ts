import { AcademyArticle } from "@/types/academy";

export const batch343Articles: AcademyArticle[] = [
  {
    slug: "product-market-fit-assessment-and-validation",
    title: "Product-Market Fit Assessment and Validation: Proving Traction",
    description: "Master PMF assessment. Measure fit, validate demand, prove traction.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["product-market fit", "PMF", "market validation", "traction metrics", "demand validation"],
    keyTakeaways: [
      "Product-market fit (PMF): When product satisfies strong market demand. Signals: (1) Organic growth (20%+ MoM without heavy marketing), (2) High NPS (>40), (3) Low churn (<5% monthly), (4) Positive unit economics (LTV > 3x CAC), (5) Customers pulling you in (inbound demand). Importance: Investors require PMF before Series A, company credibility. Timeline: 1-3 years to achieve (some lucky, some struggle).",
      "PMF assessment metrics: (1) Growth rate (20%+ MoM = PMF signal), (2) NPS (>40 good, >50 excellent), (3) Churn (5% bad, 3% good, 1% excellent), (4) Unit economics (LTV:CAC ratio >3:1), (5) Retention curves (cohort retention improving month-to-month). Assess: Multiple metrics together (no single metric = PMF). Growth without retention = bad PMF (acquisition not sticking).",
      "Validation process: (1) Interview customers (why did you buy? Would you be upset if we shut down?), (2) NPS survey (>40 = fit), (3) Usage analysis (are they using product?), (4) Churn monitoring (are they staying?), (5) Unit economics (LTV exceeds CAC?). Red flags: High churn (>10%), low NPS (<20), poor unit economics (CAC > LTV), declining retention (cohorts worse over time)."
    ],
    content: [
      {
        heading: "Assessing and Validating Product-Market Fit",
        body: `Understanding and measuring market acceptance of your product.

**Product-market fit fundamentals**

Definition:
- Product satisfies strong market demand
- Customers want product, actively use it, recommend it
- Business metrics reflect this (growth, retention, unit economics good)

Why it matters:
- Pre-PMF: Struggle to grow, high churn, weak unit economics
- Post-PMF: Growth easier, retention better, unit economics good
- Fundraising: Investors won't fund pre-PMF (no proof of concept)

Timeline: 1-3 years typical to achieve (Airbnb took 2 years)

**PMF signals**

Signal 1: Growth (20%+ MoM)

Metrics:
- Monthly user growth: 20%+ month-over-month
- Customer acquisition: Consistent growth without 3x marketing spend increases
- Example: Month 1: 10 customers, Month 2: 12 customers (20% growth)

Interpretation:
- 20%+ MoM growth for 6+ months = strong signal
- Growth without heavy marketing = organic, sustainable
- Compare to typical SaaS (3-10% MoM at scale)

Signal 2: NPS (>40)

Metrics:
- Net Promoter Score: 9-10 (promoters) vs 0-6 (detractors)
- Benchmark: >40 good, >50 excellent
- Improvement: NPS increasing month-to-month (getting better)

Interpretation:
- >40 NPS: Customers likely to recommend (viral potential)
- <20 NPS: Customers may discourage others (bad sign)
- Score of 60+: Exceptional loyalty

Signal 3: Low churn (<5% monthly)

Metrics:
- Monthly churn: 5% or below (excellent), 3% great, 1% exceptional
- Cohort retention: Retention curves stable/improving
- Example: 100 customers month 1, 97+ retained month 2 (3%+ retention)

Interpretation:
- <5% churn: Product sticks, customers see value
- >10% churn: Product not sticky, fit questionable
- Improving retention: Signal product getting better

Signal 4: Unit economics (LTV > 3x CAC)

Metrics:
- LTV:CAC ratio: 3:1 or better
- Payback: <12 months (recover CAC quickly)
- Example: £1,500 LTV, £500 CAC = 3:1 ratio (healthy)

Interpretation:
- >3:1: Sustainable growth (earn back 3x acquisition cost)
- 1-3:1: Borderline (must improve)
- <1:1: Unsustainable (losing money on customers)

Signal 5: Organic/inbound demand

Metrics:
- Inbound leads: % of customers coming inbound (referral, organic)
- Benchmark: 30%+ inbound = strong signal (less dependent on paid marketing)
- Customer effort: How much effort to close deals? Easy = good fit

Interpretation:
- High inbound: Customers actively seeking (product-market fit)
- All outbound: Must convince (weak fit, may be forcing product)

**PMF validation process**

Step 1: Customer interviews (qualitative)

Approach:
- Interview 20-30 customers (random sample)
- Ask open-ended questions (not leading)

Key questions:
1. "How did you discover us?"
   - Inbound (referral, organic) = PMF signal
   - Outbound (we reached out) = less signal

2. "Why did you decide to buy?"
   - Strong reason (solved big problem) = PMF
   - Weak reason (nice-to-have) = no fit

3. "Would you be upset if we shut down?"
   - Yes, very upset = strong PMF
   - Not really = weak PMF
   - (Same question as Rahul Vohra "must-have" test)

4. "How does this compare to alternatives?"
   - "Much better" = PMF
   - "About the same" = commoditized, no fit
   - "Worse" = problem (fix or reposition)

5. "Who else should I talk to?"
   - Willing to refer = promoter = PMF signal

Analysis:
- Count: How many would be "very upset"?
- Benchmark: 40%+ "must-have" = PMF signal
- <10% = pre-PMF (explore pivot)

Step 2: NPS survey (quantitative)

Approach:
- Email survey to 100+ customers
- "How likely to recommend to colleague?" (0-10)
- Follow-up question (why that score?)

Score analysis:
- 9-10 (promoters): % of base
- 7-8 (passives): % of base
- 0-6 (detractors): % of base
- NPS = %promoters - %detractors

Example result:
- Promoters: 50%
- Passives: 30%
- Detractors: 20%
- NPS: 30 (50 - 20)

Benchmark:
- >40: Strong PMF signal
- 20-40: Okay, room for improvement
- <20: Weak PMF, fix product or pivot

Step 3: Usage analysis (behavioral)

Approach:
- Track product usage (events, features, sessions)
- Identify power users vs inactive

Metrics:
- Daily active users (DAU): % of customers using daily
- Feature adoption: % using core feature
- Time to value: Days until customer sees ROI

Benchmark:
- DAU >30%: Good (customers actively using)
- Feature adoption >80%: Good (customers using core)
- Time to value <7 days: Good (quick ROI)

Interpretation:
- High engagement = PMF
- Low engagement = may not see value, pre-PMF

Step 4: Retention curves (cohort analysis)

Approach:
- Track cohort retention month-by-month
- Look for stable/improving curves

Metrics:
- Month 1 retention: 90%+ (good onboarding)
- Month 3 retention: 80%+ (product works)
- Month 6 retention: 70%+ (sticky)
- Month 12 retention: 50%+ (sustainable)

Benchmark:
- Improving cohorts = PMF improving
- Flat cohorts = stable PMF
- Declining cohorts = PMF declining (problem)

Step 5: Unit economics (financial)

Approach:
- Calculate LTV, CAC, payback
- Check ratio and trend

Metrics:
- LTV:CAC >3:1 = good
- Payback <12 months = sustainable
- Trend: Improving over time? = PMF strengthening

**PMF timeline and examples**

Company A: Fast PMF (6 months)

Month 1-3: Build MVP, get first 10 customers
- Growth: 50% MoM (small base)
- NPS: 35 (okay, some bugs)
- Churn: 20% (product new, learning)

Month 4-6: Iterate, fix bugs
- Growth: 20% MoM (picking up)
- NPS: 45 (improving)
- Churn: 5% (stabilizing)
- Signal: PMF achieved! (growth, NPS, churn all good)

Company B: Slow PMF (2 years)

Year 1:
- Growth: 5% MoM (slow)
- NPS: 20 (weak)
- Churn: 15% (sticky problem)
- Signal: Pre-PMF, need to iterate

Year 2:
- Major product redesign (based on customer feedback)
- Growth: 15% MoM (improving)
- NPS: 40 (much better)
- Churn: 5% (fixed!)
- Signal: PMF achieved! (took longer, but got there)

**Common PMF mistakes**

Mistake 1: Confuse revenue with PMF
- Problem: "We have £1M revenue, must have PMF"
- Reality: Can have revenue without fit (unsustainable model)
- Fix: Check retention, churn, NPS (not just revenue)
- Example: High-CAC model (£500 CAC, but 20% monthly churn = bad fit)

Mistake 2: No measurement
- Problem: "We feel like we have PMF"
- Fix: Measure (NPS, retention, unit economics)
- Impact: Avoid false confidence, catch problems early

Mistake 3: Ignore red flags
- Problem: NPS 25, churn 10%, ignore (hope things improve)
- Fix: Address (interview customers, iterate product)
- Impact: Catch problems early (easier to fix)

Mistake 4: Optimize before PMF
- Problem: Scale marketing before fixing product
- Fix: Achieve PMF first (product works), then scale
- Impact: Efficient scaling (not burning money on bad product)

**PMF assessment framework**

Scoring system:

| Metric | Strong (3) | Okay (2) | Weak (1) |
|---|---|---|---|
| Growth | 20%+ MoM | 10-20% MoM | <10% MoM |
| NPS | >40 | 20-40 | <20 |
| Churn | <3% | 3-7% | >7% |
| LTV:CAC | >5:1 | 3-5:1 | <3:1 |
| Retention | Improving | Stable | Declining |

Interpretation:
- Score 13-15: PMF confirmed
- Score 10-12: Near PMF (close)
- Score 7-9: Pre-PMF (work needed)
- Score <7: Major issues (consider pivot)

Action by score:
- 13+: Scale (growth focus)
- 10-12: Polish (small improvements, near PMF)
- 7-9: Iterate (fix product, not ready to scale)
- <7: Pivot or exit (fundamental issues)

`
      }
    ],
    relatedSlugs: ["growth-rate-analysis-and-benchmarking", "metrics-dashboard-design-kpi-tracking", "customer-success-metrics-and-program-design", "net-promoter-score-and-customer-satisfaction", "unit-economics-ltv-cac-payback"],
    faq: [
      { q: "What is product-market fit and how do I know if I have it?", a: "PMF: Product satisfies strong market demand. Signals: (1) 20%+ MoM growth, (2) NPS >40, (3) Churn <5%, (4) LTV:CAC >3:1, (5) Organic demand high. Validate: Interview customers (would you be upset if shut down?), measure metrics together (no single metric). Pre-PMF: <20% growth, NPS <20, high churn, poor unit economics." },
      { q: "How do I measure product-market fit?", a: "Quantitative: Growth rate (20%+ MoM), NPS survey (>40 = fit), retention curves (stable/improving cohorts), unit economics (LTV:CAC >3:1). Qualitative: Customer interviews (40%+ \"must-have\" = fit), feedback (strong problem solved). Assess together (no single metric = PMF). Monthly tracking: Monitor all, improve weak areas." },
      { q: "What if I don't have PMF?", a: "Pre-PMF signals: <20% growth, NPS <20, churn >10%, poor unit economics, low engagement. Actions: (1) Interview customers (understand what's not working), (2) Iterate product (fix core issues), (3) Improve messaging (maybe problem understood differently), (4) Consider pivot (wrong market?). Timeline: 1-3 years typical, some faster, some pivot. Key: Don't scale before PMF (wastes money)." }
    ],
    videoUrl: ""
  }
];

export default batch343Articles;
