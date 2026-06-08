import { AcademyArticle } from "@/types/academy";

export const batch317Articles: AcademyArticle[] = [
  {
    slug: "cohort-economics-and-unit-profitability",
    title: "Cohort Economics and Unit Profitability: Understanding Customer Profitability",
    description: "Master cohort economics. Analyze profitability, identify efficient segments.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["cohort economics", "unit profitability", "customer economics", "profitability analysis", "cohort analysis"],
    keyTakeaways: [
      "Cohort profitability model: Track revenue and costs per customer cohort, calculate net profit by cohort. Example: 2024 Q1 cohort, 100 customers, £100K revenue (first 12 months), £50K CAC (£500 per customer), £30K CS cost, profit = £20K (£200 per customer). Insight: Is this cohort profitable? Compare to other cohorts (which are profitable?). Cost: Analytics setup. Benefit: Understand which customer acquisition strategies are profitable (vs which burn money).",
      "Economics by segment: High-ACV customers more profitable (more revenue per acquisition cost), long-lifetime customers better (extend revenue over time), low-churn customers better (don't need replacement). Track: By acquisition channel (organic vs paid), by customer size (SMB vs enterprise), by geography. Action: Invest more in profitable segments, reduce/improve unprofitable segments.",
      "Payback period by cohort: When does cohort break even on CAC? Example: £500 CAC, £100/month revenue, 70% margin = 7-month payback. Benchmark: <12 months good, <6 months excellent. Monitor: If payback increasing (acquisition getting more expensive or revenue decreasing), action needed. Optimize: Reduce CAC (more efficient marketing) or increase revenue (better pricing, expansion)."
    ],
    content: [
      {
        heading: "Analyzing Profitability by Customer Cohort",
        body: `Understanding unit economics across customer groups.

**Cohort profitability model**

What is cohort economics?
- Track: Revenue and costs grouped by acquisition cohort (month/quarter)
- Compare: Which cohorts profitable? Which burn money?
- Action: Invest in profitable cohorts, fix unprofitable ones

Example cohort:

Cohort: Jan 2024 (acquired in January)
- Customers: 100 acquired
- CAC: £500 per customer (£50K total)
- Months in dataset: 12 (Jan-Dec 2024)
- Revenue (12 months): £100K
- COGS (12 months): £20K
- CS cost: £15K (£150 per customer)
- Gross profit: £65K (£100K - £20K)
- Net profit: £50K (£65K - £15K)
- Profit per customer: £500

Breakdown:
- Revenue per customer (12mo): £1000
- CAC: £500
- CAC payback: 6 months (£500 / (£1000/12 × 0.7 margin))
- LTV: (£100K/100 customers) / 12 months = £83/month, 70% margin, ∞ lifetime (still there)

Analysis: Very profitable cohort (500% ROI on CAC in year 1)

**Cohort comparison**

Compare multiple cohorts:

| Cohort | Customers | CAC | Rev 12mo | Net Profit | Profit/Customer | Payback |
|---|---|---|---|---|---|---|
| Jan 2024 | 100 | £500 | £100K | £50K | £500 | 6 months |
| Feb 2024 | 120 | £520 | £95K | £40K | £333 | 7 months |
| Mar 2024 | 150 | £550 | £90K | £30K | £200 | 8 months |
| Apr 2024 | 140 | £600 | £85K | £20K | £143 | 10 months |
| May 2024 | 100 | £700 | £70K | £5K | £50 | 15 months |

Insights:
- Jan cohort: Best (£500 profit/customer, 6-month payback)
- Apr cohort: Concerning (£143 profit/customer, 10-month payback)
- May cohort: Terrible (£50 profit/customer, 15-month payback)
- Trend: Deteriorating (later cohorts less profitable)

Root causes:
- CAC increasing (£500 → £700): Paid ads getting more expensive
- Revenue decreasing (£100K → £70K): Lower ARPU or higher churn
- Likely: Ads targeting wider (less qualified), audience smaller (cheaper clicks = bad quality)

Actions:
- Marketing: Improve targeting (get back to Jan quality)
- Pricing: Increase price (offset CAC increase)
- Onboarding: Improve (reduce churn)

**Profitability by acquisition channel**

Compare organic vs paid:

Organic cohort (Jan 2024):
- Customers: 50 (referrals, content marketing)
- CAC: £200 (low, mostly organic)
- Revenue 12mo: £70K
- Profit per customer: £900
- Payback: 3 months (very fast)

Paid cohort (Jan 2024):
- Customers: 50 (paid ads)
- CAC: £800 (expensive)
- Revenue 12mo: £30K
- Profit per customer: £100
- Payback: 16 months (very slow)

Comparison:
- Organic: 9x more profitable per customer (£900 vs £100)
- Payback: 5x faster (3 vs 16 months)
- Same CAC base, but organic source dominates

Action: Double down on organic (referral program, content), reduce or optimize paid

**Profitability by customer segment**

SMB vs Enterprise:

| Segment | Customers | ACV | CAC | LTV (12mo) | Profit/Cust |
|---|---|---|---|---|---|
| SMB | 500 | £100 | £300 | £600 | £300 |
| Mid | 100 | £500 | £500 | £3,000 | £2,500 |
| Enterprise | 20 | £5K | £2000 | £15K | £13K |

Insights:
- Enterprise 43x more profitable per customer
- But lower volume (20 customers vs 500)
- Strategy: Invest in enterprise (higher payoff), maintain SMB (volume)

Unit economics:

| Segment | Annual Revenue | CAC/LTV | Payback | Strategy |
|---|---|---|---|---|---|
| SMB | £50K | 0.5x (bad) | 12+ months | Price increase? OR lower CAC? |
| Mid | £50K | 6x (good) | 4 months | Double down |
| Enterprise | £100K | 7.5x (excellent) | 2 months | Invest heavily |

**Payback period optimization**

Payback formula:
- Payback months = CAC / (Monthly revenue × Gross margin %)

Example calculation:

Scenario 1 (baseline):
- CAC: £500
- Monthly revenue: £100
- Gross margin: 70%
- Payback: £500 / (£100 × 0.70) = 7 months ✓ Good

Scenario 2 (expensive acquisition, low retention):
- CAC: £1000
- Monthly revenue: £80 (churn higher = lower revenue)
- Gross margin: 60% (older customers = different mix)
- Payback: £1000 / (£80 × 0.60) = 21 months ✗ Bad

To improve payback:

Reduce CAC:
- From £500 → £400 (better targeting, organic)
- New payback: £400 / (£100 × 0.70) = 5.7 months

Increase monthly revenue:
- From £100 → £150 (upsell, higher pricing)
- New payback: £500 / (£150 × 0.70) = 4.8 months

Improve margin:
- From 70% → 75% (reduce COGS)
- New payback: £500 / (£100 × 0.75) = 6.7 months

**Churn impact on profitability**

Same cohort, different churn:

Base case (3% churn = 33 month lifetime):
- Customers: 100
- Revenue 12 months: £1,200/customer × 100 = £120K
- CAC: £500 × 100 = £50K
- Profit: £70K (assuming 70% margin, no CS cost)
- Payback: 6 months

High churn (5% churn = 20 month lifetime):
- Customers: 100 (but only 61 remaining after 12mo due to churn)
- Revenue 12 months: £800/customer (lower due to churn losses)
- CAC: £50K (same upfront)
- Profit: £6K (much lower)
- Payback: 8 months

Low churn (2% churn = 50 month lifetime):
- Customers: 100 (but only 98 remaining after 12mo)
- Revenue 12 months: £1,400/customer (higher, less churn)
- CAC: £50K
- Profit: £130K (much higher)
- Payback: 5 months

Impact: 1% churn difference = 10% profit difference (huge lever)

**Profitability dashboard**

Monthly tracking:

| Cohort | Month | Cumulative Rev | Cumulative Cost | Net Profit | Breakeven | Status |
|---|---|---|---|---|---|---|
| Jan 2024 | Month 6 | £60K | £50K | £10K | Yes (M6) | ✓ |
| Jan 2024 | Month 12 | £120K | £50K | £70K | Confirmed | ✓ |
| May 2024 | Month 6 | £30K | £50K | -£20K | No | ⚠ Underwater |
| May 2024 | Month 12 | £50K | £50K | £0 | M12 | ❌ Barely |

Goal: All cohorts breakeven by month 12, profit by month 18

Quarterly analysis:

Cohort 2024 Q1:
- Profitability: £1.2M revenue, £500K CAC, £400K costs = £300K profit (25% margin) ✓
- Payback: 6 months average ✓
- Churn: 3% (acceptable) ✓

Cohort 2024 Q2:
- Profitability: £1.0M revenue, £600K CAC, £400K costs = £0K profit (0% margin) ⚠
- Payback: 8 months ⚠
- Churn: 4% (higher) ✗
- Action: Identify problem (market change? Product issue? Acquisition quality?)

**Optimizing cohort profitability**

Action framework:

Analyze:
1. Which cohorts most/least profitable?
2. Why? (CAC, revenue, churn, costs)
3. What changed? (market, product, marketing, customer fit)

Improve:
1. Most profitable cohorts: Double down (more acquisition here)
2. Marginal cohorts: Fix (reduce CAC or improve revenue)
3. Unprofitable cohorts: Pause (stop acquiring from this source)

Example optimization plan:

Current state:
- Q1 profitable (25% margin)
- Q2 breakeven (0% margin)
- Q3 negative (-10% margin projected)

Issues identified:
- CAC increasing (£500 → £700)
- Revenue decreasing (churn up, ARPU down)
- Cause: Paid ads targeting broader (cheaper clicks = worse quality)

Plan:
- Tighten targeting (reduce CAC back to £500)
- Improve onboarding (reduce churn to 3%)
- Increase ARPU (add upsell)
- Expected: Restore Q2 to 15% margin, Q3 to 20% margin

Timeline: Implement over 2-3 months, measure impact in Q3/Q4 results

**Common mistakes**

Mistake 1: Ignoring cohort economics
- Problem: Think "more revenue is better", don't track profitability
- Fix: Dashboard showing cohort profit, payback, metrics
- Impact: Know which customer acquisition is profitable

Mistake 2: Long payback periods accepted
- Problem: "Growth first" mentality, payback >18 months
- Fix: Target <12 months (or <6 for SMB SaaS)
- Impact: Sustainable growth (payback <12 months = can reinvest profits)

Mistake 3: Ignoring churn impact
- Problem: Focus on CAC, ignore that churn ruins profitability
- Fix: Improve churn (1% reduction = 10% profit improvement)
- Impact: More profitable customers

Mistake 4: Not tracking by cohort
- Problem: Blended metrics hide issues (Q1 good, Q2 bad averages out)
- Fix: Separate tracking (know which months profitable)
- Impact: Early detection of problems

`
      }
    ],
    relatedSlugs: ["unit-economics-ltv-cac-payback", "retention-and-churn-reduction-mechanics", "customer-lifetime-value-optimization", "profitability-analysis-and-operating-leverage", "metrics-dashboard-design-kpi-tracking"],
    faq: [
      { q: "How do I calculate cohort profitability?", a: "Track by acquisition cohort: Revenue (12-24 months), CAC (cost to acquire), COGS, support costs. Net profit = Revenue - CAC - COGS - Support. Profit per customer = Net profit / # customers. Compare cohorts: Which are profitable? Which money-losing? Action: Invest in profitable, fix unprofitable." },
      { q: "What's a healthy payback period?", a: "Target: <12 months (SaaS standard), <6 months (excellent). Payback = CAC / (Monthly revenue × Gross margin). If payback >12 months: Reduce CAC (cheaper acquisition) or increase revenue (higher pricing, expansion). Example: £500 CAC, £100/month revenue, 70% margin = 7-month payback (good)." },
      { q: "Why does churn matter for profitability?", a: "High churn reduces revenue (customers leave), extends payback period, hurts LTV. 1% churn difference = 10% profit difference. Example: 3% churn (33-month lifetime) vs 5% churn (20-month lifetime) = 50% less profit. Action: Reducing churn = highest ROI (1-2% reduction improves profitability 10-20%)." }
    ],
    videoUrl: ""
  }
];

export default batch317Articles;