import { AcademyArticle } from "@/types/academy";

export const batch375Articles: AcademyArticle[] = [
  {
    slug: "saas-unit-economics-deep-dive",
    title: "SaaS Unit Economics Deep Dive: LTV, CAC, and Payback Mastery",
    description: "Master SaaS unit economics. Calculate LTV accurately, optimise CAC, and shorten payback periods.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["unit economics", "LTV", "CAC", "payback period", "customer profitability"],
    keyTakeaways: [
      "LTV calculation methods: Simple: ARPA × gross margin ÷ monthly churn rate. Example: £500 ARPA × 80% margin ÷ 2% churn = £20,000 LTV. With expansion: ARPA × gross margin ÷ (churn rate - expansion rate). Example: £500 × 80% ÷ (2% - 1%) = £40,000 LTV (doubles with 1% monthly expansion). DCF method (most accurate): Sum discounted future gross profit per customer. Use cohort-specific churn curves, not single average rate.",
      "CAC calculation: Fully-loaded CAC = (Sales + Marketing spend) ÷ new customers acquired. Include: Salaries, commissions, tools, advertising, events, content creation. Example: £200K quarterly S&M spend ÷ 40 new customers = £5,000 CAC. Blended CAC vs channel-specific: Organic CAC (£500) vs paid CAC (£8,000) — blended hides channel inefficiency. Track CAC by channel, segment, and geography separately.",
      "Payback period: CAC ÷ (monthly ARPA × gross margin). Example: £5,000 CAC ÷ (£500 × 80%) = 12.5 months. Target: <12 months (excellent), <18 months (good), <24 months (acceptable). Above 24 months = unit economics broken. Payback with expansion: Factor in upsell revenue reducing effective payback. Example: If customer expands 20% in year 1, effective payback drops from 12.5 to 10.4 months."
    ],
    content: [
      {
        heading: "Deep Dive into SaaS Unit Economics",
        body: `Understanding the economics of acquiring and serving each customer.

**LTV calculation methods**

Method 1: Simple LTV

Formula: ARPA × Gross Margin ÷ Monthly Churn Rate

Where:
- ARPA = Average Revenue Per Account (monthly)
- Gross Margin = Revenue less COGS as %
- Monthly Churn Rate = % of customers lost per month

Example:

ARPA: £500/month
Gross margin: 80%
Monthly churn: 2%

LTV = £500 × 80% ÷ 2% = £20,000

Implied customer lifetime: 1 ÷ 2% = 50 months (4.2 years)
Lifetime gross profit: £500 × 80% × 50 = £20,000

Limitation: Assumes constant churn rate (reality: churn decreases over time)

Method 2: LTV with expansion

Formula: ARPA × Gross Margin ÷ (Churn Rate - Net Expansion Rate)

Example:

ARPA: £500/month
Gross margin: 80%
Monthly churn: 2%
Monthly expansion rate: 1% (upsells from existing customers)

LTV = £500 × 80% ÷ (2% - 1%) = £40,000

Impact: 1% expansion rate doubles LTV (from £20K to £40K)

If expansion > churn (net negative churn):
- LTV becomes theoretically infinite
- Use DCF method instead
- Example: 2% churn, 3% expansion = -1% net churn
- Revenue from existing customers grows over time

Method 3: Cohort-based LTV (most accurate)

Track actual revenue from each customer cohort over time:

| Month | Cohort revenue | Retention | Cumulative GP |
|---|---|---|---|
| 1 | £500 | 100% | £400 |
| 3 | £475 | 95% | £1,160 |
| 6 | £440 | 88% | £2,240 |
| 12 | £380 | 76% | £4,080 |
| 18 | £350 | 70% | £5,760 |
| 24 | £330 | 66% | £7,200 |
| 36 | £310 | 62% | £9,840 |

Observation: Churn rate declines over time (survivors are stickier)
- Month 1-6: ~2% monthly churn
- Month 6-12: ~1.5% monthly churn
- Month 12-24: ~1% monthly churn
- Month 24+: ~0.5% monthly churn

Projected LTV using cohort curve: £15,000-25,000 range

This is more accurate than simple formula because it reflects actual retention patterns

Method 4: DCF-based LTV

Discount future cash flows at appropriate rate:

| Year | Revenue | Gross profit | Discount factor (15%) | PV |
|---|---|---|---|---|
| 1 | £6,000 | £4,800 | 0.87 | £4,174 |
| 2 | £5,400 | £4,320 | 0.76 | £3,283 |
| 3 | £4,860 | £3,888 | 0.66 | £2,566 |
| 4 | £4,374 | £3,499 | 0.57 | £1,995 |
| 5 | £3,937 | £3,149 | 0.50 | £1,575 |

DCF LTV: £13,593

Lower than simple method because:
- Accounts for time value of money
- More conservative (doesn't assume infinite horizon)

**CAC deep dive**

Fully-loaded CAC components:

Sales costs:
- Sales team salaries: £200K/quarter
- Commissions: £50K/quarter
- Sales tools (CRM, prospecting): £10K/quarter
- Travel and entertainment: £5K/quarter
- Sales subtotal: £265K/quarter

Marketing costs:
- Marketing team salaries: £80K/quarter
- Paid advertising: £50K/quarter
- Content creation: £15K/quarter
- Events and conferences: £20K/quarter
- Marketing tools: £10K/quarter
- Marketing subtotal: £175K/quarter

Total S&M: £440K/quarter
New customers acquired: 55

Blended CAC: £440K ÷ 55 = £8,000

CAC by channel:

| Channel | Spend | Customers | CAC | % of total |
|---|---|---|---|---|
| Organic/inbound | £80K | 25 | £3,200 | 45% |
| Paid search | £60K | 10 | £6,000 | 18% |
| Outbound sales | £200K | 12 | £16,667 | 22% |
| Events | £40K | 5 | £8,000 | 9% |
| Referrals | £10K | 3 | £3,333 | 6% |
| Total | £390K* | 55 | £7,091 | 100% |

*Remaining £50K is overhead/unattributed

Insight: Outbound sales has 5x higher CAC than organic. If company can shift more to organic, blended CAC drops significantly.

CAC by segment:

| Segment | CAC | ARPA | LTV | LTV:CAC |
|---|---|---|---|---|
| Enterprise | £25,000 | £2,000/mo | £80,000 | 3.2:1 |
| Mid-market | £8,000 | £500/mo | £20,000 | 2.5:1 |
| SMB | £2,000 | £100/mo | £4,000 | 2.0:1 |
| Self-serve | £200 | £30/mo | £900 | 4.5:1 |

Observation: Self-serve has best LTV:CAC ratio (low-touch, low-cost acquisition). Enterprise has high absolute LTV but expensive to acquire.

**Payback period analysis**

Basic payback:

CAC ÷ (Monthly ARPA × Gross Margin)

| Segment | CAC | Monthly GM | Payback |
|---|---|---|---|
| Enterprise | £25,000 | £1,600 | 15.6 months |
| Mid-market | £8,000 | £400 | 20.0 months |
| SMB | £2,000 | £80 | 25.0 months |
| Self-serve | £200 | £24 | 8.3 months |

Issue: SMB payback is 25 months (above 24-month threshold)
Action: Either reduce SMB CAC or increase SMB ARPA

Payback with expansion:

If mid-market customers expand 25% in year 1:

Month 1-6 ARPA: £500 (original)
Month 7-12 ARPA: £625 (after expansion)

Adjusted payback:
- Months 1-6 contribution: 6 × (£500 × 80%) = £2,400
- Remaining CAC: £8,000 - £2,400 = £5,600
- Month 7+ contribution: £625 × 80% = £500/month
- Additional months: £5,600 ÷ £500 = 11.2 months
- Total payback: 6 + 11.2 = 17.2 months (vs 20 without expansion)

**LTV:CAC ratio analysis**

Target ratios:

| LTV:CAC | Interpretation | Action |
|---|---|---|
| <1:1 | Losing money per customer | Fix immediately |
| 1-2:1 | Barely viable | Improve urgently |
| 2-3:1 | Acceptable | Optimise |
| 3-5:1 | Good | Invest in growth |
| >5:1 | Excellent (or under-investing) | Accelerate spend |

LTV:CAC too high (>5:1) may indicate:
- Under-spending on growth
- Could grow faster with more S&M investment
- Missing market opportunity

Example assessment:

Company LTV:CAC: 6.5:1
- This seems great but may indicate under-investment
- Test: Increase marketing spend 20%
- If LTV:CAC stays above 3:1, continue increasing
- Find the marginal LTV:CAC that's still profitable

**Improving unit economics**

Improve LTV:

| Lever | Current | Target | LTV impact |
|---|---|---|---|
| Reduce churn (2% → 1.5%) | £20,000 | £26,667 | +33% |
| Increase ARPA (£500 → £600) | £20,000 | £24,000 | +20% |
| Improve gross margin (80% → 85%) | £20,000 | £21,250 | +6% |
| Add expansion (0% → 1%) | £20,000 | £40,000 | +100% |

Biggest lever: Expansion revenue (doubles LTV)
Second: Reducing churn
Third: Increasing ARPA

Reduce CAC:

| Lever | Current CAC | New CAC | Impact |
|---|---|---|---|
| Shift to organic (40% → 60%) | £8,000 | £6,000 | -25% |
| Improve conversion (2% → 3%) | £8,000 | £5,333 | -33% |
| Reduce sales cycle (90 → 60 days) | £8,000 | £6,500 | -19% |
| Product-led growth | £8,000 | £4,000 | -50% |

Biggest lever: Product-led growth (self-serve acquisition)

**Unit economics dashboard**

Monthly tracking:

| Metric | Jan | Feb | Mar | Target |
|---|---|---|---|---|
| ARPA | £485 | £492 | £500 | £500 |
| Gross margin | 78% | 79% | 80% | 80% |
| Monthly churn | 2.1% | 1.9% | 2.0% | <2% |
| Expansion rate | 0.8% | 0.9% | 1.0% | >1% |
| LTV | £18.5K | £20.7K | £20.0K | >£20K |
| Blended CAC | £8.2K | £7.8K | £8.0K | <£8K |
| LTV:CAC | 2.3:1 | 2.7:1 | 2.5:1 | >3:1 |
| Payback | 21mo | 20mo | 20mo | <18mo |

Action items based on dashboard:
1. LTV:CAC below 3:1 target → Focus on reducing churn and increasing expansion
2. Payback above 18 months → Reduce CAC through channel optimisation
3. ARPA at target → Maintain pricing strategy

`
      }
    ],
    relatedSlugs: ["unit-economics-ltv-and-cac-payback", "customer-acquisition-strategy-and-marketing-roi", "saas-pricing-strategy-and-monetisation", "saas-metrics-benchmarking-and-peer-comparison", "profitability-analysis-and-operating-leverage"],
    faq: [
      { q: "How do I calculate LTV accurately for SaaS?", a: "Four methods: (1) Simple: ARPA × margin ÷ churn rate. (2) With expansion: ARPA × margin ÷ (churn - expansion). (3) Cohort-based: Track actual revenue per cohort over time (most accurate). (4) DCF: Discount future cash flows at 15% rate. Simple method overestimates because it assumes constant churn. Cohort method captures churn curve (early churn is higher, survivors are stickier)." },
      { q: "What is a good LTV:CAC ratio?", a: "Target 3-5:1. Below 2:1 = barely viable (fix urgently). 2-3:1 = acceptable (optimise). 3-5:1 = good (invest in growth). Above 5:1 = possibly under-investing in growth. Track by segment: Enterprise may be 3:1, self-serve may be 5:1. Biggest levers to improve: Add expansion revenue (can double LTV), reduce churn, shift to lower-cost acquisition channels." },
      { q: "How do I reduce CAC payback period?", a: "Formula: CAC ÷ (monthly ARPA × gross margin). Target: <18 months. Reduce by: (1) Lower CAC — shift to organic/product-led (50% cheaper), improve conversion rates, shorten sales cycle. (2) Increase ARPA — price increases, upsells. (3) Improve gross margin. (4) Factor expansion — if customers expand 25% in year 1, payback drops 15-20%. Track by segment separately." }
    ],
    videoUrl: ""
  }
];

export default batch375Articles;
