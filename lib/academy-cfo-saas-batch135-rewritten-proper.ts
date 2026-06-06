import { AcademyArticle } from "@/types/academy";

export const batch135Articles: AcademyArticle[] = [
  {
    slug: "growth-accounting-and-advanced-unit-economics",
    title: "Growth Accounting and Advanced Unit Economics: Understanding How Your Business Grows",
    description: "Master growth accounting. Understand organic vs acquired growth, segment analytics, and optimize growth levers.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "growth accounting",
      "organic growth",
      "growth rate",
      "unit economics",
      "growth levers",
      "cohort analysis",
      "retention curves",
      "expansion revenue",
      "growth attribution",
      "growth metrics"
    ],
    keyTakeaways: [
      "Growth accounting equation: Beginning revenue + New customers revenue + Expansion revenue - Churn revenue = Ending revenue. Example: £1M start + £300K new - £100K churn + £50K expansion = £1.25M end (25% growth). Breaks down WHERE growth comes from (new, expansion, or lost to churn). Different from \"growth rate\" (lagging indicator, shows result) vs growth accounting (leading, shows drivers).",
      "Growth rate vs organic growth: Growth rate = (Ending - Beginning) / Beginning = 25% (total). Organic = growth without acquisitions/external events. Example: 25% growth = 15% organic + 10% from acquisition of competitor. Investors care about sustainability (organic growth repeatable, acquisition one-time). Show both.",
      "Magic Number = (Month N revenue - Month N-1 revenue) / Month N-1 S&M spend. Example: Revenue £100K to £110K (gain £10K) / Prior month £50K S&M = 0.2x magic number. Benchmark: >0.75x efficient, >1.0x very efficient. This shows how much incremental revenue per dollar S&M spend (efficiency metric)."
    ],
    content: [
      {
        heading: "Understanding Growth Accounting",
        body: `Growth accounting breaks down your revenue growth into components.

**Growth Accounting Equation**

Beginning MRR + New customer MRR - Churned MRR + Expansion MRR = Ending MRR

Example:

Beginning MRR: £100K (from existing customers)
New customers: +£30K (10 new customers at £3K MRR each)
Churn: -£8K (£100K × 8% monthly churn)
Expansion: +£5K (existing customers upgrading)

Ending MRR: £100K + £30K - £8K + £5K = £127K

Growth rate: (£127K - £100K) / £100K = 27% MoM

**Analyzing Each Component**

New customer revenue:
- Most visible (marketing/sales talking point)
- But churn offset it

Churn revenue:
- Not obvious (easy to overlook)
- Large drag on growth (high churn kills momentum)
- Must be addressed (can't grow fast enough to offset)

Expansion revenue:
- Pure profit (no customer acquisition cost)
- Reflects customer satisfaction
- Most profitable part of growth

Example 1 (healthy):
- New: +£30K
- Churn: -£8K (low churn)
- Expansion: +£5K
- Net: +£27K growth (efficient)

Example 2 (unhealthy):
- New: +£30K
- Churn: -£20K (high churn, killing growth)
- Expansion: +£2K (low expansion)
- Net: +£12K growth (inefficient, need major new customer growth just to offset churn)

Company 2 must fix churn (retention) to be healthy long-term.

**Waterfall Analysis**

Visual breakdown of MRR changes:

Month 1: £100K
New customers: +£30K (becomes £130K)
Churn: -£8K (becomes £122K)
Expansion: +£5K (becomes £127K)
Month 2: £127K

This waterfall shows contribution of each lever.

**Growth Accounting by Segment**

Different segments might have different dynamics:

| Segment | Start MRR | New | Churn | Expansion | End MRR | Growth |
|---------|-----------|-----|-------|-----------|---------|---------|
| Enterprise | £50K | £10K | -£1K | £3K | £62K | 24% |
| Mid-market | £30K | £12K | -£2K | £1K | £41K | 37% |
| SMB | £20K | £8K | -£5K | £1K | £24K | 20% |
| **Total** | **£100K** | **£30K** | **-£8K** | **£5K** | **£127K** | **27%** |

Insights:
- Enterprise: Low growth but high value (£62K from one segment)
- Mid-market: Highest growth (37%), most dynamic
- SMB: High churn (5% monthly, £5K on £20K), must improve retention

Segment accounting helps identify where to focus (which segment is struggling?).

**Organic vs Acquired Growth**

Organic growth: Customer acquisition through normal sales/marketing
Acquired growth: Revenue from acquisitions, partnerships, or external events

Example:

Month growth: 40% (£100K to £140K)
- Organic: 30% (£130K from own sales/marketing)
- Acquired: 10% (£10K from partnership deal)

Investors prefer organic (sustainable, repeatable).
Acquired is one-time (can't rely on for future growth).

Report both to show sustainability.

Example problematic:
- Company shows 50% growth
- But 40% from one big contract (acquired)
- Only 10% organic growth (concerning)
- Once big contract saturates, growth cliff

Transparency on organic vs acquired helps investors assess sustainability.

**Growth Rate Trends**

Track growth month-over-month:

| Month | MRR | Growth |
|-------|-----|--------|
| Jan | £100K | — |
| Feb | £110K | 10% |
| Mar | £123K | 12% |
| Apr | £139K | 13% |
| May | £157K | 13% |
| Jun | £171K | 9% |
| Jul | £179K | 5% |

Trend: Growth accelerating Jan-May (10% → 13%), then decelerating June-July (13% → 5%).

Question: Why did growth slow June? (Lost big customer? Marketing spend reduced? Competition?)

**Predictability of Growth**

If growth consistent month-over-month: Predictable, easier to forecast

If growth volatile: Unpredictable, harder to forecast

Example:

Consistent: 12% growth, every month (predictable, 50% YoY)
Volatile: 5-20% growth, varies by month (unpredictable, hard to forecast)

Consistent growth preferred (easier to model, less surprising to investors).

If volatile, find root cause (seasonal? customer concentration? market dependent?).
`
      },
      {
        heading: "Advanced Unit Economics and Levers",
        body: `Beyond LTV/CAC, advanced analysis of what drives economics.

**The Four Levers of SaaS Growth**

Lever 1: CAC reduction (spend less to acquire)
Lever 2: LTV increase (customers worth more)
Lever 3: Payback period (recover investment faster)
Lever 4: Churn reduction (customers stay longer)

Most impactful lever: Churn reduction (affects all others, biggest multiplier).

Example:

Current state:
- CAC: £5K
- LTV: £240K (assuming 3-year life)
- LTV/CAC: 48x
- Payback: 0.6 months

Lever 1: Reduce CAC 20% (£5K → £4K)
- New LTV/CAC: 60x
- Impact: +25% improvement

Lever 2: Increase LTV 20% (£240K → £288K, via ARPU increase)
- New LTV/CAC: 58x
- Impact: +20%

Lever 3: Reduce payback from 0.6 to 0.3 months (via efficiency)
- Can scale acquisition (payback faster = can spend more)
- Indirect impact: More growth

Lever 4: Reduce churn 20% (via retention)
- New LTV: £332K (better retention = longer lifetime)
- New LTV/CAC: 66x
- Impact: +37%

Churn reduction has largest impact (affects lifetime directly).

**Cohort Analysis Deep Dive**

Track customer cohorts over full lifetime:

| Cohort | M1 Rev | M6 Rev | M12 Rev | M24 Rev | Implied LTV |
|--------|--------|--------|---------|---------|------------|
| Jan 2022 | £1M | £950K | £880K | £750K | £10.5M (annualized) |
| Apr 2022 | £1.2M | £1.1M | £1M | £890K | £11.3M |
| Jul 2022 | £1.3M | £1.3M | £1.25M | £1.1M | £13.2M |
| Oct 2022 | £1.5M | £1.5M | £1.45M | — | TBD |

Trends:
- Newer cohorts (Jul, Oct) have higher M6 revenue (better expansion)
- Later cohorts might have higher LTV (if trend continues)
- Better customer quality (higher ARPU, lower churn)

Lesson: Product improvements or marketing changes in newer cohorts producing better customers.

**Magic Number and S&M Efficiency**

Magic Number = (MRR month N - MRR month N-1) / S&M spend month N-1

Example:

Month 1: MRR £100K, S&M spend £40K
Month 2: MRR £110K, S&M spend £40K

Magic number: (£110K - £100K) / £40K = 0.25x

Interpretation: £1 S&M spend in month 1 generates £0.25 incremental MRR in month 2.

Benchmarks:
- 0.75x: Efficient
- 1.0x+: Very efficient
- 0.3x: Concerning

Magic number captures efficiency of spend (how much revenue per dollar).

Different from CAC (which is average cost to acquire customer, longer cycle).

**Growth Efficiency Score**

Combines growth rate + unit economics:

Formula: (Growth % + Operating Margin %) = Efficiency score

Example:

Company A: 50% growth, -10% margin = 40 score
Company B: 30% growth, +10% margin = 40 score
Company C: 60% growth, -30% margin = 30 score

Company A and B same score (different approaches).
Company C higher growth but worse margin (lower score).

Investors like >40 score (balance of growth and profitability).

**Predicting Future Growth**

Using current cohort data, predict future:

Current MRR: £100K (1000 customers)
New customer acquisition: 150/month
Monthly churn: 2%
NRR: 110% (5% expansion)

Forecast Month 3:

Month 1:
- Existing customers: 1000 × (1 - 2%) = 980
- Expansion: £100K × 5% = £5K new revenue
- New customers: 150 × £100 ARPU = £15K
- End: 980 + 150 = 1130 customers, £120K MRR

Month 2:
- Existing: 1130 × 98% = 1108
- Expansion: £120K × 5% = £6K
- New: 150 × £100 = £15K
- End: 1258 customers, £141K MRR

This is forecasting from unit metrics (customer count, churn, ARPU, expansion).

More accurate than purely extrapolating growth rate.
`
      },
      {
        heading: "Measuring and Optimizing Growth Levers",
        body: `How to systematically improve each growth driver.

**CAC Reduction (Lever 1)**

Current: £5K CAC
Goal: £3K CAC

Tactics:
- Improve website conversion (A/B testing) → Lower CAC 10%
- Optimize paid channels (shift from expensive to cheap channels) → Lower CAC 20%
- Leverage word-of-mouth (customer referral program) → Lower CAC 30% for referrals

Expected impact:
- Blended CAC reduction: 15%
- New CAC: £4.25K
- Profitability: Better ROI on S&M spend

**LTV Increase (Lever 2)**

Current: £240K LTV
Goal: £300K LTV (+25%)

Tactics:
- Increase ARPU 10% (price increase)
- Reduce churn 0.5% (CS improvements)
- Increase NRR from 105% to 115% (expansion focus)

Expected impact:
- ARPU increase: +10% to LTV
- Churn reduction: +15% to LTV
- NRR increase: +8% to LTV
- Combined: +33% improvement (more than target)

**Payback Period (Lever 3)**

Current: 0.6 months
Goal: 0.4 months (faster)

Tactics:
- Increase customer ARPU (high-value customers) → Faster payback
- Reduce S&M spend (more efficient acquisition) → Faster payback
- Improve gross margin (more profit per customer) → Faster payback

Expected impact:
- Can double customer acquisition spend (payback still fast)
- Revenue acceleration

**Churn Reduction (Lever 4)**

Current: 2% monthly churn
Goal: 1.5% monthly churn (-25%)

Tactics:
- Improve onboarding (faster time-to-value)
- Customer success program (proactive, not reactive)
- Product improvements (address top churn reasons)

Expected impact:
- Customer lifetime: From 50 months to 67 months (+33%)
- LTV: +33% increase
- Compound effect: Most valuable single improvement

**Prioritizing Levers**

Which lever to focus on first?

Rule: Impact × Effort

High impact, low effort: Quick wins
- Improve website conversion (A/B test, quick)
- Implement referral program (set up, minimal effort)
- Optimize paid channels (reallocate spend, immediate)

High impact, medium effort:
- Customer success program (hire CSM, build program)
- Product roadmap for churn (development effort)
- Pricing increase (test with segments first)

High impact, high effort:
- Full product rewrite (low priority unless current is broken)
- International expansion (logistical, slow)

Usually prioritize: Churn reduction (highest impact, medium effort) → CAC reduction (quick wins) → LTV increase (sustained).

**Dashboard for Growth Optimization**

| Lever | Metric | Current | Target | Initiative | ETA |
|-------|--------|---------|--------|-----------|-----|
| Churn | 2% monthly | 1.5% | CS program launch | Mar |
| CAC | £5K | £4K | Channel optimization | Feb |
| LTV | £240K | £300K | Pricing increase | Apr |
| Payback | 0.6 mo | 0.4 mo | ARPU increase | Apr |
| Growth rate | 27% | 35% | All levers | Jun |

This dashboard shows progress on each lever.

Most important: Growth rate (final outcome) = result of all levers improving.
`
      }
    ],
    relatedSlugs: [
      "unit-economics-ltv-cac-payback",
      "customer-lifetime-value-calculation",
      "churn-analysis-retention-improvement",
      "financial-forecasting-modeling",
      "saas-benchmarking-peer-comparison"
    ],
    faq: [
      {
        q: "What's growth accounting and why does it matter?",
        a: "Growth accounting breaks down MRR change into: new customers + expansion - churn. Shows WHERE growth comes from. Example: 25% growth = 30K new - 8K churn + 5K expansion. Helps identify issues (high churn destroying growth? Low expansion?) and where to focus. Different from growth rate (lagging) vs accounting (shows drivers, leading)."
      },
      {
        q: "What's the magic number and why is it important?",
        a: "Magic number = (MRR gain this month) / (S&M spend last month). Shows revenue generated per dollar S&M spend. Benchmark: >0.75x efficient, >1.0x very efficient, <0.5x concerning. Helps assess sales/marketing ROI (is spend generating returns?). Track monthly to optimize spend efficiency."
      },
      {
        q: "Which growth lever has biggest impact?",
        a: "Churn reduction (lever 4) has largest impact on LTV. 1% churn reduction can increase LTV 20-30%. Also lowest CAC (retention customer cheaper than new). Second: CAC reduction (efficiency). Third: LTV increase (ARPU, expansion). Focus on churn first (biggest multiplier)."
      },
      {
        q: "How do I forecast growth using unit metrics?",
        a: "Model from components: Starting customers × (1 - churn) + new customers = ending customers. Multiply by ARPU = MRR. Add expansion revenue. Example: 1000 customers × 98% (2% churn) + 150 new = 1130 customers × £100 ARPU = £113K MRR. More accurate than extrapolating growth rate (accounts for churn, expansion separately)."
      }
    ],
    videoUrl: ""
  }
];

export default batch135Articles;
