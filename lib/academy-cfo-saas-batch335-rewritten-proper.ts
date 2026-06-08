import { AcademyArticle } from "@/types/academy";

export const batch335Articles: AcademyArticle[] = [
  {
    slug: "retention-and-churn-reduction-mechanics",
    title: "Retention and Churn Reduction Mechanics: Building a Sticky Business",
    description: "Master retention. Understand churn, reduce it, build lasting relationships.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["churn", "retention", "customer churn", "retention metrics", "churn analysis"],
    keyTakeaways: [
      "Churn definition: % customers leaving per period (monthly churn typical). Formula: (Customers lost / Beginning customers) × 100. Example: 100 customers month 1, lose 5 in month 2 = 5% monthly churn. Benchmark: SaaS 3-7% monthly (depends on segment: SMB higher, Enterprise lower). Impact: 5% monthly = lose 50% of base in 13-14 months (churn compounds). Key: 1% improvement = huge impact (5 months lifetime extension at 5% base).",
      "Churn types: (1) Involuntary (payment failed, billing issue, not product-related), (2) Voluntary (customer chooses to leave, usually product/fit issue). Actions differ: Involuntary = fix billing/payment. Voluntary = improve product/support. Measure: Distinguish between two (ask why customer left). Typical: 20% involuntary (fixable), 80% voluntary (needs product/service improvement).",
      "Churn analysis: (1) Cohort analysis (track customers by signup month, measure retention curve), (2) Churn reasons (interview leaving customers, identify patterns), (3) Feature usage (low usage = high churn risk, intervene), (4) Support quality (poor support = churn). Systematic: Monthly churn review, quarterly actions (product improvements, CS increases, training), measure impact."
    ],
    content: [
      {
        heading: "Understanding and Reducing Customer Churn",
        body: `Building retention through systematic churn analysis and improvement.

**Churn fundamentals**

Definition:
- Percentage of customers lost in a period
- Formula: (Customers lost / Beginning customers) × 100
- Time period: Monthly churn typical (easier to track and act on)
- Alternative: Annual churn (aggregate, less actionable)

Calculation:

Month 1: 100 customers
Month 2: Gained 20 new, lost 5 existing
Month 2 total: 100 + 20 - 5 = 115 customers
Monthly churn rate: 5 / 100 = 5%

Churn impact (compounding):

5% monthly churn:
- Month 1: 100 customers
- Month 2: 95 customers (5 lost)
- Month 3: 90 customers (5 lost)
- Month 6: 73 customers (27% lost)
- Month 12: 54 customers (46% lost)
- Month 24: 29 customers (71% lost)

3% monthly churn:
- Month 1: 100 customers
- Month 2: 97 customers (3 lost)
- Month 3: 94 customers (3 lost)
- Month 6: 83 customers (17% lost)
- Month 12: 69 customers (31% lost)
- Month 24: 48 customers (52% lost)

Difference: 3% vs 5% churn = 23% more customers retained after 24 months!

Benchmark churn by segment:

| Segment | Typical Monthly Churn | Status |
|---|---|---|
| SMB (self-serve) | 7-10% | High, acceptable |
| Mid-market (sales-driven) | 3-5% | Acceptable |
| Enterprise (strategic) | 1-3% | Good |
| Bottom quartile | >10% | Poor, must improve |
| Top quartile | <2% | Excellent |

**Churn types and root causes**

Type 1: Involuntary churn

Definition:
- Customer wants to stay, but can't (payment failure, account issue)
- Recoverable (fix issue, customer returns)

Common causes:
- Failed payment (card declined, wrong payment method)
- Account issue (can't log in, data lost)
- Billing problem (wrong amount charged, invoice issue)
- System outage (service unavailable)

Recovery rate: 30-50% of involuntary churn can be recovered
- Better dunning (smart retries, clear communication)
- Proactive support (reach out before cancellation)
- Easy fix (self-serve payment method update)

Example:
- 100 monthly churns
- 20 involuntary (billing/payment/technical)
- 80 voluntary (chose to leave)
- Recovery: Recover 8-10 of involuntary (10% of 100 base = 0.5-1% monthly improvement)

Type 2: Voluntary churn

Definition:
- Customer chooses to leave
- Usually indicates product/service issue
- Harder to recover (need to fix root cause)

Common causes:
- Missing features (competitor has it, we don't)
- Poor product quality (bugs, slow, confusing)
- Competitor (found better alternative)
- Cost (too expensive for value received)
- Company change (acquired, shut down, pivoted)
- Customer success issue (no onboarding, poor support)

Recovery rate: 5-15% (harder to recover)
- Address specific issue (implement feature, improve UX)
- Offer alternative (different plan, extended trial)
- Win-back campaign (3-6 months after churn, offer improvement)

Example:
- 80 voluntary churns
- 40% due to missing features (32)
- 30% due to poor product (24)
- 20% due to price (16)
- 10% due to competitor (8)
- Action: Prioritize feature roadmap, improve onboarding, test pricing
- Recovery: 10% recovery rate = 8 customers recovered

**Churn analysis techniques**

Technique 1: Cohort retention analysis

Definition:
- Track customers by signup month (cohort)
- Measure retention rate at month 1, 3, 6, 12
- Shows: Retention pattern, product improvements over time

Example cohort table:

| Cohort | Signup | Month 1 | Month 3 | Month 6 | Month 12 |
|---|---|---|---|---|---|
| Jan 2024 | 100 | 95% | 85% | 72% | 54% |
| Feb 2024 | 100 | 96% | 87% | 75% | 58% |
| Mar 2024 | 100 | 97% | 90% | 80% | 65% |
| Apr 2024 | 100 | 98% | 92% | 85% | 72% |

Interpretation:
- Retention improving (Apr cohort better than Jan)
- Suggests: Product improvements, better onboarding, improved support
- Jan cohort: Only 54% retained at 12 months (46% annual churn)
- Apr cohort: 72% retained (28% annual churn, better!)

Action:
- What changed between Jan and Apr? (onboarding improvement? CS team hired? Product update?)
- Replicate that change across all cohorts
- Expected: Improve all cohorts by 10-15% retention

Technique 2: Churn reason analysis

Method:
- Interview churning customers (sample 10-20)
- Ask: "Why did you decide to leave?"
- Categorize reasons (feature, price, support, competitor, etc.)

Example results:

| Reason | Count | % | Severity |
|---|---|---|---|
| Missing feature | 12 | 30% | High (product) |
| Found competitor | 8 | 20% | High (market) |
| Too expensive | 6 | 15% | Medium (pricing) |
| Poor support | 5 | 12.5% | High (support) |
| Company pivot | 4 | 10% | Low (unavoidable) |
| Product quality | 4 | 10% | High (product) |
| Other | 1 | 2.5% | - |

Actions:
1. Missing feature (30%): Prioritize in roadmap
2. Poor support (12.5%): Hire/train CS team
3. Product quality (10%): QA testing, bug fixes
4. Competitor (20%): Messaging/positioning (can't solve)
5. Price (15%): Test new pricing, offer discount

Expected impact: Address top 3 = recover 30-40 of 100% of churn (3-4% reduction)

Technique 3: Usage-based churn prediction

Method:
- Track feature usage for each customer
- Low usage = churn risk
- Intervene before customer leaves

Example signals:

| Signal | Status | Action |
|---|---|---|
| No login in 30 days | High risk | Outreach email |
| Using only basic features | Medium risk | Feature training |
| Declining usage trend | Medium risk | Check-in call |
| Zero API calls (if API product) | High risk | Urgent support |

Intervention:
- Email: "We noticed you haven't logged in recently. Can we help?"
- Offer: Free training, new features, dedicated support trial
- Expected: 10-20% of at-risk customers re-engage

Technique 4: Support quality analysis

Method:
- High support quality = higher retention
- Metrics: Response time, resolution time, CSAT

Correlation:
- Average response time <1 hour = 5% better retention
- Average resolution <24 hours = 10% better retention
- Support CSAT >4.5/5 = 15% better retention

Action:
- Hire support team (reduce response time)
- Improve support processes (faster resolution)
- Training (improve CSAT)
- Expected: Invest £30-50K/year, recover 2-3% churn (payback in 1-2 months)

**Retention improvement roadmap**

Month 1: Baseline and analysis

Tasks:
- Calculate current churn (by cohort, by segment)
- Interview 20 churning customers (understand reasons)
- Measure involuntary vs voluntary churn

Deliverables:
- Churn analysis (current rate, cohort analysis)
- Churn reasons (categorized)
- Action plan (top 3 priorities)

Month 2-3: Quick wins (involuntary churn recovery)

Actions:
- Improve dunning (smart retries, reduce payment failures)
- Faster support response (hire support, improve processes)
- Product bug fixes (fix top issues from churn interviews)

Expected: Recover 0.5-1% churn (involuntary)

Month 4-6: Structural improvements (voluntary churn reduction)

Actions:
- Product roadmap: Implement missing features (30% of churn)
- Onboarding improvement: Week-1 personalization, training
- Customer success: Assign CS to top segments

Expected: Reduce 1-2% churn (voluntary)

Month 7-12: Measurement and optimization

Actions:
- Track cohort retention (is it improving?)
- Win-back campaigns (recover some churned customers)
- Continuous improvement (monthly churn review)

Expected: Achieve 2-3% net churn improvement (5% → 3%)

**Churn dashboard**

Monthly metrics:

| Metric | Current | Target | Trend |
|---|---|---|---|
| Monthly churn rate | 5% | 3% | Down |
| Involuntary churn | 1% | 0.5% | Down |
| Voluntary churn | 4% | 2.5% | Down |
| Churn reasons (top): Missing features | 30% | 15% | Down |
| Churn reasons: Poor support | 12.5% | 5% | Down |
| Cohort retention (month 6) | 72% | 80% | Up |
| Customer CSAT | 4.2 | 4.5 | Up |

Quarterly review:
- Churn trend (improving or worsening?)
- Cohort retention (is new onboarding working?)
- Churn reasons (are improvements working?)
- Financial impact (churn cost = £X per customer × monthly churn)

Example financial impact:
- 500 customers at £100/month = £50K MRR
- 5% monthly churn = 25 customers lost/month
- Revenue lost: 25 × £100 = £2.5K/month
- Annual impact: £30K revenue loss
- 3% churn achieves: 15 customers lost/month, £1.5K lost/month, £18K annual
- Improvement: £12K annual revenue saved (huge!)

**Common churn mistakes**

Mistake 1: Ignore involuntary churn
- Problem: Assume all churn is voluntary (product issue)
- Actually: 20% involuntary (fixable!)
- Fix: Better dunning, proactive payment method updates
- Impact: 1% easy improvement

Mistake 2: No churn analysis
- Problem: Know churn rate (5%), don't know why
- Result: Can't improve (don't know what to fix)
- Fix: Interview churning customers, categorize reasons
- Impact: Identify 2-3 high-impact improvements

Mistake 3: Optimize acquisition over retention
- Problem: Focus on new customers (growth), ignore churn
- Result: Leaky bucket (grow from top, leak from bottom)
- Fix: Balanced (acquisition + retention)
- Impact: Sustainable growth (not wasteful)

Mistake 4: Wait too long to act
- Problem: Churn issue emerging, wait for more data
- Result: Churn spreads, hard to recover
- Fix: Act on early signals (usage decline, support quality issue)
- Impact: Prevent small issue becoming big problem

`
      }
    ],
    relatedSlugs: ["customer-lifetime-value-optimization", "customer-success-metrics-and-program-design", "metrics-dashboard-design-kpi-tracking", "profitability-analysis-and-operating-leverage", "unit-economics-ltv-cac-payback"],
    faq: [
      { q: "What is churn and why does it matter?", a: "Churn: % customers lost per period (monthly typical). Formula: (Customers lost / Beginning customers) × 100. Example: 100 customers, lose 5/month = 5% churn. Compounds: 5% monthly = 50% base lost in 13 months (unsustainable). Impact: 1% improvement = 5-10 month lifetime extension = major LTV increase. Benchmark: SMB 7-10%, mid-market 3-5%, enterprise 1-3%." },
      { q: "How do I reduce churn?", a: "Two types: (1) Involuntary (payment failed, account issue), (2) Voluntary (customer chose to leave). Actions: Involuntary = better dunning, payment reminders. Voluntary = improve product (missing features), support (faster response), onboarding. Analyze: Interview 20 churning customers (identify reasons), fix top 3 causes. Expected: 1-2% reduction possible (6-12 months)." },
      { q: "How do I analyze churn?", a: "Methods: (1) Cohort retention (track by signup month, measure month-1/3/6/12 retention), (2) Churn reasons (interview customers, categorize), (3) Usage analysis (low usage = high risk, intervene), (4) Support quality (fast response/resolution = higher retention). Dashboard: Monthly churn rate, cohort retention, churn reasons. Quarterly review: Trend, improvements, financial impact (£X revenue saved per 1% reduction)." }
    ],
    videoUrl: ""
  }
];

export default batch335Articles;
