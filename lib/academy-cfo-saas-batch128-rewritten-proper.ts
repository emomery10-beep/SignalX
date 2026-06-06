import { AcademyArticle } from "@/types/academy";

export const batch128Articles: AcademyArticle[] = [
  {
    slug: "churn-analysis-and-retention-improvement",
    title: "Churn Analysis and Retention Improvement: Keeping Customers and Reducing Leakage",
    description: "Master churn analysis. Understand why customers leave, measure retention, and execute improvements to reduce churn.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "churn rate",
      "customer churn",
      "retention",
      "retention rate",
      "churn analysis",
      "customer retention",
      "repeat customers",
      "churn reduction",
      "cohort retention",
      "customer retention strategy"
    ],
    keyTakeaways: [
      "Monthly churn = # customers lost / # customers at month start. Example: 100 customers month 1, lose 3 = 3% churn. Annual churn differs: 1% monthly = 12% annual (approx). Benchmark: <2% monthly is excellent for SaaS, 2-5% is normal, >5% is concerning. High churn kills growth (need 100 new customers to gain 70 if churn 30%).",
      "Cohort retention: Track actual customers by acquisition cohort. Example: Jan cohort had 100 customers. After 12 months, only 60 remain (60% retention = 40% churn). Measure by what % of each cohort survives over time. Benchmark: Month 12 retention (% of customers who stay full year) >60% is good.",
      "Churn reasons: Product (feature gap, poor UX), support (slow response, low quality), price (too expensive, value unclear), success (customer achieved goal, no longer needs). Fix by understanding why customers churn (surveys, interviews). Example: 40% churn due to feature X missing → invest in feature. 30% due to price → improve value perception or revise pricing."
    ],
    content: [
      {
        heading: "Understanding and Measuring Churn",
        body: `Churn is the percentage of customers you lose each period (typically monthly).

**Churn Rate Calculation**

Monthly churn:
- Formula: (# customers lost this month) / (# customers at start of month) × 100%

Example:

Month start: 100 customers
Customers who canceled: 3
Churn rate: 3 / 100 = 3%

Month end: 97 customers (100 - 3)

Revenue churn (can differ from customer churn):
- Formula: (Revenue lost this month from cancels) / (Revenue at start of month) × 100%

Example:

Month start revenue: £100K MRR (from all customers)
Revenue churned: £4K (from 3 customers who left)
Revenue churn: 4 / 100 = 4%

Note: Different from customer churn (3%) because customers different sizes.

Large customer worth £3K, 2 small customers worth £500 each:
- Customer churn: 3 / 100 = 3%
- Revenue churn: (£3K + £500 + £500) / £100K = 4%

Track both (customer and revenue churn).

**Net Churn (with Expansion)**

If some customers expand (NRR >100%), gross churn offset by expansion:

Net churn = Gross churn - Expansion revenue

Example:

Gross churn: 4% (customers leaving)
Expansion: 6% (existing customers expanding usage)
Net churn: 4% - 6% = -2% (actually growing, expansion exceeds churn)

If net churn is negative, you're growing MRR without adding new customers (just expansion).

If net churn positive, losing MRR even with some expansion.

**Cohort Retention Analysis**

Most accurate churn measure: Track actual customer cohorts over time.

Example:

Jan 2024 cohort: 100 customers acquired in January
- Jan 31: 100 customers (0 months old)
- Feb 28: 98 customers (1 month old, 2% churn)
- Mar 31: 96 customers (2 months old, 4% cumulative churn)
- Apr 30: 93 customers (3 months old, 7% cumulative churn)
- May 31: 91 customers (4 months old, 9% cumulative churn)
- Jun 30: 90 customers (5 months old, 10% cumulative churn)
- ...continues

By month 12: 65 customers remain (65% retention, 35% cumulative churn)

Retention rate by month:
- Month 1: 98%
- Month 2: 96%
- Month 3: 93%
- ...
- Month 12: 65%

This shows shape of retention (when do customers churn?).

**Retention Benchmarks by Stage**

Early-stage SaaS (£0-1M ARR):
- Month 1 retention: 85-95%
- Month 3 retention: 70-85%
- Month 12 retention: 50-70%

Growth-stage SaaS (£1-10M ARR):
- Month 1 retention: 90-98%
- Month 3 retention: 80-90%
- Month 12 retention: 60-80%

Mature SaaS (£10M+ ARR):
- Month 1 retention: 95%+
- Month 3 retention: 88%+
- Month 12 retention: 75%+

Higher maturity = Higher retention (fewer surprises, stickier product).

**Churn by Segment**

Churn varies by customer type:

Enterprise (£100K+ ACV):
- Monthly churn: 0.5-1% (sticky, long contracts)
- Year 1 retention: 95%+

Mid-market (£20-100K ACV):
- Monthly churn: 1-2%
- Year 1 retention: 85-90%

SMB (£5-20K ACV):
- Monthly churn: 3-5% (price-sensitive, less committed)
- Year 1 retention: 70-80%

Self-serve/Freemium:
- Monthly churn: 5-15% (low switching cost)
- Year 1 retention: 40-60%

Track churn separately by segment (helps root cause analysis).

**Annual Churn Calculation**

Monthly churn vs annual churn:

If monthly churn is steady (e.g., 3% every month):
- Month 1: Lose 3%
- Month 2: Lose 3% of remaining (3% × 97%)
- Month 3: Lose 3% of remaining

After 12 months: 100 × (1-0.03)^12 = 70% remain (30% annual churn)

Rough rule: Monthly churn × 12 ≠ Annual churn (it's not linear).

Exact: 1 - (1 - monthly churn)^12 = annual churn

Examples:
- 1% monthly: 11.4% annual
- 2% monthly: 21.6% annual
- 3% monthly: 31.4% annual
- 5% monthly: 46.1% annual

High monthly churn compounds to dramatic annual churn.
`
      },
      {
        heading: "Root Cause Analysis: Why Customers Churn",
        body: `Understanding why customers leave is essential for fixing churn.

**Churn Reasons**

Typical categories:

1. Product (40-50% of churns)
   - Missing features (competitor has it)
   - Poor product quality (bugs, crashes)
   - Poor user experience (confusing, hard to use)
   - Doesn't solve their problem anymore

2. Support (15-20% of churns)
   - Slow response time (issues unresolved)
   - Poor quality support (doesn't fix problem)
   - No proactive help (customer struggles alone)

3. Price (10-15% of churns)
   - Too expensive (competitive alternative cheaper)
   - Pricing doesn't reflect value (customer doesn't see ROI)
   - Cost-cutting (budget cuts, not product issue)

4. Success (5-10% of churns)
   - Achieved their goal (no longer need product)
   - Temporary need (project complete)
   - Outgrew product (needs more advanced solution)

5. Switching (5% of churns)
   - Competitor with better solution
   - Consolidation (buying different product to replace multiple)

6. Other (5%)
   - Company closed
   - Leadership change, new priorities
   - Unknown

**Identifying Churn Reasons**

Method 1: Cancellation surveys
- When customer cancels, ask: "Why are you leaving?"
- Options: Product, support, price, other
- Open text: "More detail"

Insight: Identify patterns (if 40% say "missing feature X", invest in X).

Method 2: Customer interviews
- Call churned customers (especially large ones)
- 30-min conversation: "Tell us what we could have done better"
- Listen for themes

Insight: Often uncover issues not apparent from surveys (emotional reasons, miscommunication).

Method 3: Product analytics
- Track usage patterns of churned vs retained customers
- Churned customers: Low feature adoption, low login frequency
- Insight: If churned customers never used feature X, maybe product experience issue

Method 4: NPS and sentiment analysis
- Monthly NPS survey (Net Promoter Score)
- NPS <30 = high churn risk
- Read comment text: "Why score low?"

Example NPS comment: "Your support is slow, I'm looking at competitors"
→ Actionable: Improve support response time.

**Segmenting Churned Customers**

Not all churn is equal:

Segment A: High-value churned customers (£50K+ ACV)
- Small number (maybe 1-2 per quarter)
- Large impact (significant revenue)
- Action: Immediate intervention (call CEO, offer discounts, fix issues)

Example: £500K customer churned due to "missing feature X"
→ Budget to build feature
→ Try to win back customer

Segment B: Medium-value churned customers (£10K-50K ACV)
- Moderate number (maybe 5-10 per quarter)
- Material impact (£50-500K annual)
- Action: Understand pattern, fix systematically

Example: 5 customers at £25K each churned due to "price"
→ Analyze if pricing really expensive
→ Consider pricing adjustment or more value communication

Segment C: Low-value churned customers (<£10K ACV)
- Large number (many per quarter)
- Small individual impact
- Action: Pattern analysis, product improvements

Example: 100 SMB customers at £5K each churned
→ Understand single biggest reason
→ Fix that reason (product feature, support, etc.)

**Cohort Churn Analysis**

Churn patterns vary by cohort:

| Cohort | M1 | M2 | M3 | M6 | M12 |
|--------|-----|-----|-----|------|------|
| Jan 2023 | 98% | 95% | 92% | 80% | 65% |
| Apr 2023 | 99% | 97% | 95% | 85% | 72% |
| Jul 2023 | 97% | 94% | 91% | 80% | 68% |
| Oct 2023 | 96% | 93% | 89% | 75% | 60% |

Trends:
- Month 1-3: Fast churn (5-10% in first 3 months)
- Month 3-12: Slower churn (retention curve flattens)

Questions to ask:
1. Why is M1 retention declining over time? (Oct cohort 96% vs Jan 98%)
   → Onboarding quality declining? New product issues?

2. Why is early churn so high? (lose 5% in month 1)
   → Onboarding failure? Wrong customer profile?

3. Is later retention improving? (later cohorts have better M12 than earlier)
   → Product improvements helping? Or different customer mix?

This analysis uncovers specific issues by timing.

**Churn Prevention: Early Warning Signs**

Some customers show churn risk before they cancel:

Low engagement:
- Hasn't logged in for 2+ weeks
- Never used key features
- Support tickets about same issue repeatedly

Price sensitivity:
- Asks about discounts multiple times
- Compares to competitors
- Usage declining over time (less value perceived)

Product complaints:
- NPS <30 (likely to churn)
- Repeated feature requests
- Negative support interactions

Contract ending:
- Month before contract expiration date
- Customer hasn't renewed, renegotiating

Action: Assign at-risk customers to retention team
- Proactive outreach (don't wait for cancellation)
- Understand issues
- Offer solutions (discount, new features, enhanced support)

Example: Assign NPS <40 customers to CSM outreach
- Schedule 30-min call
- Understand needs
- Create action plan
- Follow up monthly

This can recover 20-30% of at-risk customers (better than losing them).
`
      },
      {
        heading: "Retention Improvement Programs",
        body: `How to systematically reduce churn and improve retention.

**Onboarding and Time-to-Value**

Biggest churn point: First 30 days.

Many customers who churn early (month 1-2) never got value from product.

Improvement: Faster time-to-value (TTV)

Current state:
- Day 1: Contract signed
- Day 30: First dashboard live (long setup)
- Day 60: Customer configured, understands value
- Month 2: Risk of churn (haven't seen value)

Improved state:
- Day 1: Contract signed, onboarding starts immediately
- Day 3: First dashboard live (quick setup)
- Day 7: Customer sees basic value
- Day 30: Customer fully configured
- Month 1+: Lower churn (saw value early)

Impact: Reduce month-1 churn from 5% to 2% (saves 3% of customers).

For 1000 customers: 30 customers retained (30 × £5K ACV = £150K).

**Customer Success Program**

Reactive support (only when customer has problem) → Proactive success (helping customer succeed).

Reactive:
- Customer calls with issue
- Support team responds
- Issue resolved (hopefully)
- Reactive, time-consuming

Proactive:
- CSM assigned to customer
- Monthly check-ins (no problem needed)
- Understand customer goals
- Recommend features, best practices
- Prevent issues before they happen

Implementation:

For enterprise customers (£50K+ ACV):
- 1 CSM per customer
- Monthly business reviews
- Quarterly strategy sessions
- Cost: £100K/CSM × number of CSMs

For mid-market:
- 1 CSM per 5-10 customers
- Quarterly check-ins
- Group training
- Cost: £50K/CSM × 0.1-0.2 CSMs per customer

Expected impact:
- Enterprise: Reduce churn 1% → 0.3% (significant)
- Mid-market: Reduce churn 2% → 1% (significant)

**Product Improvements**

Product issues are #1 churn cause.

If customers churn due to missing features:
- Map top 5 churn reasons (from interviews)
- Allocate engineering to top reasons
- Prioritize impact (will fixing this reduce churn?)

Example roadmap:

Churn analysis shows:
- 40% churn: "Missing real-time collaboration"
- 20% churn: "Poor reporting"
- 15% churn: "Confusing UX"
- 10% churn: "Slow performance"
- 15% churn: "Other"

Roadmap:
- Q1: Real-time collaboration (fix 40%)
- Q2: Reporting enhancements (fix 20%)
- Q3: UX improvements (fix 15%)
- Q4: Performance optimization (fix 10%)

Expected impact: If fix 80% of feature-based churn reasons, churn could drop 20-30%.

For 1000 customers at 4% monthly churn (40 customer losses):
- Reduce to 2.8% churn (28 losses, save 12 customers)
- Value: 12 × £5K ACV × 36-month lifetime = £2.16M.

High ROI for product improvements.

**Support Quality Improvements**

Poor support = churn.

Current state:
- Response time: 24 hours (slow for urgent issues)
- Resolution time: 5 days (takes time)
- Customer satisfaction: 3.5/5 (mediocre)

Improved state:
- Response time: <2 hours (fast, customer feels heard)
- Resolution time: 48 hours (quick)
- Customer satisfaction: 4.5/5 (happy)

Implementation:
- Hire more support staff (reduce ticket queue)
- Better support tools (AI, knowledgebase)
- Support training (faster resolution)
- Cost: Additional support team

Expected impact: Reduce support-driven churn 20-30%.

**Pricing and Value Communication**

Many customers churn due to "price" but real issue: Don't see value.

Instead of discounting, communicate value better:

Current: "Your subscription is £5K/month"
Customer thinks: "That's expensive"
Result: Churn

Better: "You're saving 10 hours/week (£2K/week value) vs manual process. ROI: 400%"
Customer thinks: "Only £5K/month for £2K/week savings? Great deal!"
Result: Renew

ROI communication + value realization = retention improvement.

**Win-Back Campaigns**

Even with best efforts, some churn.

Win-back strategy: Reach out to recently churned customers.

Month 1 after churn:
- Email: "We'd love to have you back. Tell us what we could improve."
- Offer: "30% discount if you come back"

Win-back rate: Typically 5-15% of churned customers (depends on why they left).

Cost: Low (email + discount)
Benefit: Some revenue recovery

Example:
- 10 customers churn (£50K/month revenue lost)
- Win back 2 customers at 20% discount = £8K/month recovered
- Value: £8K × 12 months = £96K annual revenue recovered.

Win-back is cheap insurance against permanent loss.
`
      },
      {
        heading: "Churn Targets and Metrics",
        body: `Setting churn targets and tracking progress.

**Churn Targets by Stage**

Early-stage (£0-1M ARR):
- Target: <5% monthly churn (or 50%+ year 1 retention)
- Minimum acceptable: <8% monthly

Growth-stage (£1-10M ARR):
- Target: <3% monthly churn
- Minimum acceptable: <5%

Mature (£10M+ ARR):
- Target: <2% monthly churn
- Minimum acceptable: <3%

Implied lifetime for each:
- 5% monthly = 20-month average customer life
- 3% monthly = 33-month average customer life
- 2% monthly = 50-month average customer life

**Monthly Churn Dashboard**

Track monthly:

| Metric | Target | Actual | Trend |
|--------|--------|--------|--------|
| Customer churn | <3% | 2.8% | ✓ |
| Revenue churn | <3% | 2.5% | ✓ |
| Month 1 retention | >90% | 88% | ↓ |
| Month 3 retention | >85% | 82% | ↓ |
| NRR | >100% | 105% | ✓ |
| Customers lost (reason) | | |
| - Product | | 4 | ↑ |
| - Support | | 2 | ↓ |
| - Price | | 1 | — |

This shows churn is on target (2.8% vs 3% target) but early retention declining.

Action: Investigate month 1 retention drop (onboarding issue?).

**Cohort Retention Tracking**

For each acquisition cohort, track:

| Cohort | M1 | M2 | M3 | M6 | M12 |
|--------|-----|-----|-----|------|------|
| Oct 2024 | 97% | 95% | 92% | — | — |
| Nov 2024 | 98% | — | — | — | — |

Plot cohort curves over time:
- If all cohorts converge to same M12 retention, predictable
- If newer cohorts diverging, something changed (onboarding, product, market)

**Churn Forecasting**

If monthly churn is steady at 3%:

Forecast customers retained:

Month 12: 100 × (1-0.03)^12 = 70% retained
Month 24: 100 × (1-0.03)^24 = 49% retained
Month 36: 100 × (1-0.03)^36 = 35% retained

This shows customer lifespan (if churn doesn't improve).

If improve churn to 2%:

Month 12: 100 × (1-0.02)^12 = 78% retained (+8%)
Month 24: 100 × (1-0.02)^24 = 61% retained (+12%)
Month 36: 100 × (1-0.02)^36 = 47% retained (+12%)

1% churn reduction = significant lifetime improvement.

Use forecasts to set improvement targets (1% reduction = 10-15% more lifetime value).
`
      }
    ],
    relatedSlugs: [
      "customer-lifetime-value-calculation",
      "net-revenue-retention-nrr-mastery",
      "customer-onboarding-time-to-value",
      "customer-success-metrics-health-scoring",
      "unit-economics-ltv-cac-payback"
    ],
    faq: [
      {
        q: "What's a healthy monthly churn rate for SaaS?",
        a: "<2% is excellent (50+ month customer life). 2-3% is normal for growth-stage. 3-5% is concerning. >5% is crisis (20-month or shorter life). Higher churn = shorter customer life = harder to achieve profitability. Focus on reducing churn first (retention ROI typically >acquisition ROI)."
      },
      {
        q: "How do I measure churn?",
        a: "Monthly churn = # customers lost / # customers at month start. Example: 100 customers, lost 3 = 3% churn. Track both customer churn and revenue churn (can differ). Most accurate: Cohort retention (track each acquisition cohort over time, see % who stay after 1, 3, 6, 12 months)."
      },
      {
        q: "What are the biggest churn drivers?",
        a: "Typically: Product (40%), support (15%), price (10%), success (10%), other (25%). Understand YOUR biggest reason via surveys and interviews with churned customers. Fix top reason first (product feature, support quality, etc.). Different for each company—don't assume."
      },
      {
        q: "How can I reduce churn?",
        a: "Three levers: (1) Better onboarding (faster time-to-value = lower early churn). (2) Proactive customer success (CS team prevents churn vs reactive support). (3) Fix product/support issues (address churn reasons). Expected impact: Each lever 1-3% reduction. Combined 3-5% improvement possible over 12 months."
      }
    ],
    videoUrl: ""
  }
];

export default batch128Articles;
