import { AcademyArticle } from "@/types/academy";

export const batch333Articles: AcademyArticle[] = [
  {
    slug: "unit-economics-ltv-cac-payback",
    title: "Unit Economics, LTV and CAC Payback: Building Efficient Growth",
    description: "Master unit economics. Calculate LTV/CAC, measure payback, build sustainable growth.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["unit economics", "LTV", "CAC", "customer acquisition cost", "payback period"],
    keyTakeaways: [
      "LTV (Lifetime Value): Total profit from customer over lifetime. Formula: (ARPU × Gross margin × Lifetime months) - Acquisition cost. Example: £100/month × 70% × 30 months - £500 acquisition = £2100 - £500 = £1600 LTV. Benchmark: Healthy LTV:CAC >3:1 (earn back acquisition cost 3x). Impact: If LTV only £500, can't spend £500 acquiring (break-even), need high LTV first.",
      "CAC (Customer Acquisition Cost): How much spent to acquire 1 customer. Calculation: Total marketing spend / New customers acquired. Example: £100K marketing, 100 customers = £1000 CAC. Benchmark: CAC <1/3 of LTV (see example: £1600 LTV, £500 CAC = 32% of LTV). Rule: If CAC payback <12 months, sustainable. If >18 months, expensive (use another channel).",
      "Payback period: Months to recover acquisition cost. Formula: CAC / (ARPU × Gross margin). Example: £1000 CAC / (£100 × 70%) = £1000/£70 = 14.3 months payback. Benchmark: <12 months excellent (quick payback), 12-18 months acceptable, >18 months unsustainable (too slow). Action: If payback >18 months, improve (increase ARPU, reduce churn, lower CAC)."
    ],
    content: [
      {
        heading: "Analyzing and Improving Unit Economics",
        body: `Building sustainable growth through unit economics discipline.

**Unit economics fundamentals**

Definition:
- Profit per customer over their lifetime
- Key to understanding if business is scalable
- If unit economics bad, growth burns cash fast
- If unit economics good, growth compounds

Three key metrics:

1. CAC (Customer Acquisition Cost)
- What does it cost to acquire 1 customer?
- Includes: Sales, marketing, commissions, tools
- Formula: Marketing spend / Customers acquired

2. LTV (Lifetime Value)
- Total profit from customer over lifetime
- Includes: Revenue from customer, minus service costs
- Formula: Profit per month × Customer lifetime (months)

3. Payback period
- How long to recover acquisition cost from customer profit?
- Formula: CAC / Monthly profit
- Key metric: If <12 months, sustainable

Relationship:
- LTV must be > CAC (earn back acquisition cost)
- Ideally LTV > 3 × CAC (earn back 3x)
- If LTV < CAC, you're losing money on each customer

**CAC calculation and analysis**

CAC formula:

CAC = Total marketing spend / New customers acquired

Components of marketing spend:

Sales and marketing salaries:
- Sales team: 2 people × £50K salary = £100K/year
- Marketing team: 1 person × £40K = £40K/year
- Total: £140K/year

Advertising spend:
- Google Ads: £5K/month = £60K/year
- Facebook Ads: £2K/month = £24K/year
- LinkedIn Ads: £1K/month = £12K/year
- Total: £96K/year

Tools and software:
- CRM (Salesforce): £2K/month = £24K/year
- Marketing automation: £1K/month = £12K/year
- Analytics: £500/month = £6K/year
- Total: £42K/year

Total annual spend: £140K + £96K + £42K = £278K

New customers acquired (annually): 200 customers

CAC = £278K / 200 = £1,390 per customer

CAC by channel:

| Channel | Spend | Customers | CAC |
|---|---|---|---|
| Google Ads | £60K | 80 | £750 |
| Facebook Ads | £24K | 40 | £600 |
| LinkedIn Ads | £12K | 20 | £600 |
| Sales team | £100K | 50 | £2000 |
| Organic/inbound | £0 | 10 | £0 |
| **Total** | **£278K** | **200** | **£1390** |

Insights:
- Organic: £0 CAC (free, but small volume)
- Paid ads: £600-750 CAC (efficient)
- Sales: £2000 CAC (expensive, but high-value deals?)
- Blended: £1390 (reasonable, but varies by channel)

Optimization opportunities:
- Increase organic (save CAC)
- Shift from sales to ads (lower CAC)
- Improve ad targeting (lower CAC, same volume)

**LTV calculation and analysis**

LTV formula:

LTV = (ARPU × Gross margin × Customer lifetime) - Acquisition cost

Components:

ARPU (Average Revenue Per User):
- Current: £100/month
- Growing: 2-3% annually
- Calculate: Total revenue / Number of customers

Gross margin:
- Revenue: £100
- COGS (hosting, support, payment processing): £30
- Gross profit: £70
- Gross margin: 70%

Customer lifetime:
- Monthly churn: 5%
- Expected lifetime: 1 / 0.05 = 20 months
- Alternative: Retention rate 95%, year 1-3 retention improves to 98%
- Assume: 25 months average (blended)

Acquisition cost:
- Calculated above: £1,390

LTV calculation:

LTV = (£100 × 70% × 25 months) - £1,390
LTV = (£70/month × 25 months) - £1,390
LTV = £1,750 - £1,390
LTV = £360

Wait, that's low! Let's recalculate with more realistic numbers:

Alternative (higher LTV):

ARPU: £150 (higher-tier customers)
Gross margin: 75% (improved ops)
Lifetime: 30 months (lower churn)
CAC: £1,200 (more efficient)

LTV = (£150 × 75% × 30) - £1,200
LTV = (£112.50/month × 30 months) - £1,200
LTV = £3,375 - £1,200
LTV = £2,175

Much healthier! LTV £2,175 vs CAC £1,200 = ratio 1.8:1 (decent, target 3:1)

**Payback period**

Definition:
- How long until customer profit covers acquisition cost?
- After payback, customer is profitable
- Before payback, you're burning cash

Formula:

Payback period = CAC / Monthly gross profit

Example:

CAC: £1,200
Monthly gross profit: £150 × 75% = £112.50
Payback: £1,200 / £112.50 = 10.7 months

Interpretation:
- Payback in 10.7 months
- After month 11, customer is profitable
- Lifetime: 30 months, payback month 11
- Profitable months: 30 - 11 = 19 months profit = £2,137.50 profit (rough)
- Plus profit from referrals (promoters refer)

Benchmark payback by stage:

| Stage | Payback | Status | Action |
|---|---|---|---|
| Seed | <6 months | Excellent | Scale acquisition |
| Series A | 6-12 months | Good | Sustainable |
| Series B | 12-18 months | Acceptable | Monitor closely |
| Mature | 18-24 months | Concerning | Optimize urgently |
| >24 months | Crisis | Must improve | Change model |

**LTV:CAC ratio and decision-making**

Ratio benchmark:

| Ratio | Status | Action |
|---|---|---|
| >5:1 | Excellent | Can spend 20% of LTV on CAC |
| 3-5:1 | Healthy | Sustainable growth |
| 1.5-3:1 | Acceptable | Must improve to scale |
| 1-1.5:1 | Poor | Unprofitable, must fix |
| <1:1 | Disaster | Losing money on each customer |

Example analysis:

Company A:
- LTV: £2,000
- CAC: £500
- Ratio: 4:1 (healthy)
- Can spend more on CAC (up to £600-700 while staying healthy)

Company B:
- LTV: £1,500
- CAC: £1,200
- Ratio: 1.25:1 (poor)
- Must improve LTV or reduce CAC
- Actions: Increase ARPU, reduce churn, improve retention

**Improving unit economics**

Lever 1: Increase ARPU

Tactics:
- Upsell (upgrade customers to higher tier): +20-30% ARPU
- Cross-sell (sell additional products): +10-20% ARPU
- Price increase (raise prices annually): +3-5% ARPU
- Product-led growth (self-serve, higher tier): +10-15% ARPU

Example impact:
- Current ARPU: £100
- Upsell: Increase 30% → £130 ARPU
- LTV impact: (£130 × 70% × 25) - £1,200 = £2,275 - £1,200 = £1,075 (+£280)
- Ratio improvement: 1.8:1 → 2.3:1

Lever 2: Improve retention (reduce churn)

Tactics:
- Better onboarding: -1% churn (20 month lifetime → 25 month)
- Customer success: -1% churn
- Product improvements: -2% churn

Example impact:
- Current churn: 5% (20-month lifetime)
- Improve to 3% (33-month lifetime)
- LTV: (£100 × 70% × 33) - £1,200 = £2,310 - £1,200 = £1,110 (+£750)
- Huge impact! (churn is high-leverage)

Lever 3: Reduce CAC

Tactics:
- Improve ad targeting: -20% CAC
- Increase organic: Shift budget
- Improve sales efficiency: -15% CAC
- Channel optimization: Focus on efficient channels

Example impact:
- Current CAC: £1,200
- Improve to £1,000 (-17%)
- LTV: (£100 × 70% × 25) - £1,000 = £750 - £1,000 = -£250 (still negative)
- CAC reduction alone not enough, combine with other levers

Lever 4: Improve gross margin

Tactics:
- Reduce hosting costs: -2% COGS
- Reduce support costs: -1% COGS
- Improve pricing: +5% ARPU

Example impact:
- Current: 70% margin
- Improve to 75%
- LTV: (£100 × 75% × 25) - £1,200 = £1,875 - £1,200 = £675 (+£125)

**Dashboard and monitoring**

Monthly metrics:

| Metric | Current | Target | Status |
|---|---|---|---|
| CAC | £1,200 | £1,000 | Monitor |
| LTV | £675 | £2,000 | Low |
| LTV:CAC | 0.6:1 | 3:1 | Poor |
| Payback | 17 months | <12 months | Long |
| ARPU | £100 | £120 | Growing |
| Churn | 5% | 3% | High |
| Gross margin | 70% | 75% | Good |

Actions:
- Increase ARPU: Implement upsell program
- Reduce churn: Improve onboarding
- Optimize CAC: Focus on high-efficiency channels
- Improve margin: Negotiate hosting costs

**Common unit economics mistakes**

Mistake 1: Only CAC focus
- Problem: Reduce CAC to £500, forget LTV is £600 (still unprofitable)
- Fix: Monitor both CAC and LTV (ratio matters)
- Impact: Avoid unprofitable growth

Mistake 2: Ignore churn
- Problem: Acquire 100 customers, lose 5/month
- Impact: Can't build stable business
- Fix: Reduce churn (highest-leverage improvement)

Mistake 3: Average metrics
- Problem: Average CAC £1,000, but channels range £300-3,000
- Fix: Track by channel (optimize mix)
- Impact: Reallocate to efficient channels

Mistake 4: Forget acquisition cost in LTV
- Problem: Calculate LTV £2,000 (exclude CAC of £1,200)
- Result: Think profitable when actually LTV net = £800
- Fix: Always subtract CAC from LTV
- Impact: Accurate unit economics

`
      }
    ],
    relatedSlugs: ["customer-lifetime-value-optimization", "customer-acquisition-strategy-and-marketing-roi", "retention-and-churn-reduction-mechanics", "metrics-dashboard-design-kpi-tracking", "pricing-strategy-and-price-optimization"],
    faq: [
      { q: "What is CAC and how do I calculate it?", a: "CAC = Customer Acquisition Cost = Total marketing spend / New customers acquired. Example: £100K marketing, 100 customers = £1,000 CAC. Includes: Sales team salaries, advertising, marketing tools, commissions. Track by channel: Google Ads (£500 CAC), Facebook (£600), Sales (£2000). Optimize: Focus on low-CAC channels, increase efficiency." },
      { q: "What is LTV and what's a healthy ratio?", a: "LTV = Lifetime Value = (ARPU × Gross margin × Customer lifetime) - CAC. Example: (£100 × 70% × 25 months) - £1,200 = £750. Healthy ratio: LTV:CAC > 3:1 (earn back acquisition cost 3x). If <3:1: must improve (increase ARPU, reduce churn, reduce CAC). If <1:1: losing money on each customer (unsustainable)." },
      { q: "How do I improve unit economics?", a: "Four levers: (1) Increase ARPU (upsell, price increase, +3-5%), (2) Reduce churn (improve onboarding, retention, can add 5-10 months lifetime), (3) Lower CAC (optimize channels, improve targeting), (4) Improve margin (reduce COGS). Churn is highest-leverage (1% improvement = 5-10 month lifetime increase = huge LTV impact). Monitor monthly: Track ratio, payback period, by channel." }
    ],
    videoUrl: ""
  }
];

export default batch333Articles;
