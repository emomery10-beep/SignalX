import { AcademyArticle } from "@/types/academy";

export const batch376Articles: AcademyArticle[] = [
  {
    slug: "saas-churn-analysis-and-retention-strategy",
    title: "Churn Analysis and Retention Strategy: Reducing SaaS Revenue Loss",
    description: "Master churn analysis. Identify churn drivers, build retention models, and reduce revenue leakage.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["churn analysis", "retention", "customer churn", "revenue retention", "churn prediction"],
    keyTakeaways: [
      "Churn types and measurement: Logo churn (% customers lost) vs revenue churn (% ARR lost). They differ because large/small customers churn at different rates. Example: Lose 10 of 100 customers (10% logo churn), but they were small accounts worth £50K of £1M ARR (5% revenue churn). Track both monthly and annually. Gross churn excludes expansion; net churn includes it. Target: <5% annual gross revenue churn (enterprise), <10% (mid-market), <15% (SMB).",
      "Churn drivers analysis: Categorise every churned customer by reason. Common drivers: (1) Product fit (30-40% of churn — didn't solve their problem), (2) Price sensitivity (15-25% — too expensive relative to value), (3) Competitor switch (10-20% — found better alternative), (4) Business closure (10-15% — company failed), (5) Champion left (10-15% — internal advocate departed). Action: Product fit and price are controllable. Business closure is not. Focus retention efforts on controllable drivers.",
      "Churn prediction model: Build health score from usage signals. Key signals: (1) Login frequency (declining = risk), (2) Feature adoption (using <30% of features = risk), (3) Support ticket sentiment (negative trend = risk), (4) Payment failures (involuntary churn risk), (5) Contract renewal date (90 days out = intervention window). Score 0-100. Below 40 = high risk (proactive outreach). Example: Company with health score dropping from 80 to 45 over 3 months = intervention needed."
    ],
    content: [
      {
        heading: "Analysing and Reducing SaaS Churn",
        body: `A systematic approach to understanding and reducing customer loss.

**Churn measurement framework**

Types of churn:

1. Logo churn (customer churn):
   - Customers lost ÷ Starting customers
   - Example: 5 churned ÷ 200 starting = 2.5% monthly
   - Annual: 1 - (1 - 2.5%)^12 = 26.1%

2. Gross revenue churn:
   - ARR lost (churn + contraction) ÷ Starting ARR
   - Example: £30K lost ÷ £1,000K starting = 3.0% monthly
   - Excludes expansion revenue

3. Net revenue churn:
   - (ARR lost - Expansion ARR) ÷ Starting ARR
   - Example: (£30K lost - £20K expansion) ÷ £1,000K = 1.0% monthly
   - Can be negative (net expansion > churn)

4. Net revenue retention (NRR):
   - 100% - Net revenue churn
   - Example: 100% - 1.0% = 99% monthly, 88% annual
   - Target: >100% annual (expansion exceeds churn)

Benchmarks by segment:

| Metric | Enterprise | Mid-market | SMB | Self-serve |
|---|---|---|---|---|
| Monthly logo churn | <0.5% | <1% | <3% | <5% |
| Annual logo churn | <6% | <12% | <30% | <45% |
| Annual gross rev churn | <5% | <10% | <15% | <20% |
| Annual NRR | >120% | >110% | >100% | >95% |

**Churn driver analysis**

Step 1: Categorise every churned account

Exit survey + CSM notes for each churn:

| Reason category | Q1 churns | % of total | ARR lost |
|---|---|---|---|
| Product fit / missing features | 8 | 32% | £120K |
| Price / perceived value | 6 | 24% | £80K |
| Competitor switch | 4 | 16% | £65K |
| Business closed / downsized | 3 | 12% | £30K |
| Champion left | 2 | 8% | £25K |
| Implementation failure | 2 | 8% | £20K |
| Total | 25 | 100% | £340K |

Step 2: Analyse controllable vs uncontrollable

Controllable (can reduce with action):
- Product fit: 32% → Roadmap prioritisation, better qualification
- Price: 24% → Pricing review, value communication
- Competitor: 16% → Competitive intelligence, feature parity
- Implementation: 8% → Better onboarding
- Total controllable: 80% of churn

Uncontrollable:
- Business closed: 12%
- Champion left: 8% (partially controllable — multi-thread relationships)
- Total uncontrollable: 20%

Step 3: Prioritise interventions

| Intervention | Churn addressed | Cost | Expected reduction |
|---|---|---|---|
| Better onboarding programme | Product fit (32%) | £50K | 25% reduction |
| Value-based pricing review | Price (24%) | £20K | 15% reduction |
| Competitive feature parity | Competitor (16%) | £200K | 30% reduction |
| Multi-threading accounts | Champion left (8%) | £10K | 50% reduction |

ROI calculation:

Better onboarding:
- Churn addressed: £120K × 25% = £30K ARR saved
- Cost: £50K one-time
- Payback: 20 months
- Ongoing: £30K/year saved

Value-based pricing review:
- Churn addressed: £80K × 15% = £12K ARR saved
- Cost: £20K one-time
- Payback: 20 months

**Customer health scoring**

Building a health score model:

Input signals (weighted):

| Signal | Weight | Scoring | Data source |
|---|---|---|---|
| Login frequency | 25% | Daily=100, Weekly=70, Monthly=30, None=0 | Product analytics |
| Feature adoption | 20% | >70% features=100, 50-70%=70, <50%=30 | Product analytics |
| Support sentiment | 15% | Positive=100, Neutral=60, Negative=20 | Support tickets |
| NPS/CSAT score | 15% | Promoter=100, Passive=50, Detractor=10 | Survey data |
| Usage trend | 15% | Growing=100, Stable=60, Declining=20 | Product analytics |
| Payment health | 10% | Current=100, Late=30, Failed=0 | Billing system |

Health score calculation example:

Customer X:
- Login frequency: Weekly (70) × 25% = 17.5
- Feature adoption: 45% (30) × 20% = 6.0
- Support sentiment: Negative (20) × 15% = 3.0
- NPS: Passive (50) × 15% = 7.5
- Usage trend: Declining (20) × 15% = 3.0
- Payment: Current (100) × 10% = 10.0

Health score: 47/100 (At Risk)

Score ranges:
- 80-100: Healthy (low churn risk)
- 60-79: Monitor (moderate risk)
- 40-59: At Risk (high risk, proactive outreach)
- 0-39: Critical (very high risk, urgent intervention)

Distribution targets:
- Healthy: >60% of customers
- Monitor: 20-30%
- At Risk: <10%
- Critical: <5%

**Retention playbooks by risk level**

Healthy customers (80-100):
- Quarterly business reviews
- Share product roadmap updates
- Identify expansion opportunities
- Ask for referrals and case studies
- Touch frequency: Quarterly

Monitor customers (60-79):
- Monthly check-in calls
- Review usage and adoption
- Identify unused features (drive adoption)
- Address any support issues
- Touch frequency: Monthly

At Risk customers (40-59):
- Weekly check-ins
- Executive sponsor engagement
- Custom success plan (30-60-90 day)
- Product team involvement (if feature gap)
- Discount or contract renegotiation if price-driven
- Touch frequency: Weekly

Critical customers (0-39):
- Immediate executive outreach
- Emergency success plan
- Consider concessions (pricing, features)
- If churning: Exit interview and feedback
- Touch frequency: Daily until resolved

**Involuntary churn reduction**

Involuntary churn (failed payments):

Typical involuntary churn: 20-40% of total churn

Causes:
- Expired credit cards
- Insufficient funds
- Bank declines
- Changed payment details

Dunning strategy:

| Day | Action | Success rate |
|---|---|---|
| Day 0 | Auto-retry payment | 40% recovered |
| Day 1 | Email: "Payment failed, update card" | 15% recovered |
| Day 3 | Email: "Action needed" + in-app banner | 10% recovered |
| Day 7 | Email: "Account at risk" | 5% recovered |
| Day 14 | Final email: "Account will be suspended" | 3% recovered |
| Day 21 | Account suspended (read-only access) | 2% recovered |
| Day 30 | Account cancelled | - |

Total recovery rate: ~75% of failed payments

Tools: Stripe smart retries, Recurly, Chargebee

Additional tactics:
- Card updater services (auto-update expired cards)
- Multiple payment methods on file
- Annual billing (fewer payment events)
- Direct debit (more reliable than cards)

**Cohort retention analysis**

Track retention by customer cohort:

| Cohort | Month 0 | Month 3 | Month 6 | Month 12 | Month 24 |
|---|---|---|---|---|---|
| 2024 Q1 | 100% | 90% | 82% | 70% | 58% |
| 2024 Q2 | 100% | 88% | 80% | 68% | - |
| 2024 Q3 | 100% | 85% | 78% | - | - |
| 2024 Q4 | 100% | 92% | - | - | - |

Analysis:
- Q4 cohort retaining better at month 3 (92% vs 90%)
- Possible reasons: Better onboarding, improved product, seasonal effect
- If improvement sustains, indicates successful retention initiatives

Cohort revenue retention:

| Cohort | Month 0 ARPA | Month 12 ARPA | Revenue retention |
|---|---|---|---|
| 2024 Q1 | £400 | £350 (70% retained × £500 expanded) | 87.5% |
| 2024 Q2 | £420 | £340 | 81.0% |
| 2024 Q3 | £450 | £382 | 84.9% |

Revenue retention includes both churn and expansion effects

**Churn reduction ROI**

Impact of 1% churn reduction:

Starting ARR: £5M
Current annual churn: 10% (£500K lost/year)
Target: 9% (£450K lost/year)

Year 1 savings: £50K
Year 2 savings: £100K (compounding — larger base retained)
Year 3 savings: £155K (compounding further)

5-year NPV of 1% churn reduction: ~£350K

At 8x revenue multiple, reducing churn 1% increases company value by:
£50K × 8 = £400K in year 1

If churn reduction costs £100K to implement:
ROI: £400K / £100K = 4x return on investment

`
      }
    ],
    relatedSlugs: ["saas-unit-economics-deep-dive", "customer-acquisition-strategy-and-marketing-roi", "land-and-expand-strategy-expansion-revenue", "metrics-dashboard-design-kpi-tracking", "saas-metrics-benchmarking-and-peer-comparison"],
    faq: [
      { q: "What is the difference between logo churn and revenue churn?", a: "Logo churn: % of customers lost. Revenue churn: % of ARR lost. They differ because customer sizes vary. Example: Lose 10 of 100 customers (10% logo churn), but those were small accounts worth £50K of £1M ARR (5% revenue churn). Track both. Net revenue retention (NRR) = 100% - net revenue churn (includes expansion). Target NRR: >100% (expansion exceeds churn)." },
      { q: "How do I build a customer health score?", a: "Weight key signals: Login frequency (25%), feature adoption (20%), support sentiment (15%), NPS/CSAT (15%), usage trend (15%), payment health (10%). Score 0-100. Ranges: 80-100 healthy, 60-79 monitor, 40-59 at risk, 0-39 critical. Target: >60% of customers healthy, <10% at risk. Trigger proactive outreach when score drops below 60 or declines >20 points in a month." },
      { q: "What percentage of churn is involuntary?", a: "Typically 20-40% of total churn is involuntary (failed payments). Causes: Expired cards, insufficient funds, bank declines. Recovery: Dunning sequence (auto-retry, emails day 1/3/7/14) recovers ~75% of failed payments. Additional tactics: Card updater services, multiple payment methods, annual billing, direct debit. Reducing involuntary churn is often the quickest win." }
    ],
    videoUrl: ""
  }
];

export default batch376Articles;
