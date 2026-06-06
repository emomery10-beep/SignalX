import { AcademyArticle } from "@/types/academy";

export const batch83Articles: AcademyArticle[] = [
  {
    slug: "customer-lifetime-value-ltv-calculation",
    title: "Customer Lifetime Value (LTV) Calculation: Understanding How Much Each Customer Is Worth",
    description: "Calculate the lifetime value of your customers. Use LTV to determine pricing, CAC budget, and customer profitability.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 6,
    keywords: [
      "customer lifetime value",
      "LTV",
      "customer profitability",
      "lifetime revenue",
      "customer value",
      "LTV/CAC ratio",
      "unit economics",
      "customer ROI",
      "LTV calculation",
      "payback period"
    ],
    keyTakeaways: [
      "LTV formula: (Average monthly revenue per customer × Gross margin %) ÷ Monthly churn rate; example: £200/month revenue, 70% GM, 2% monthly churn = (£200 × 0.70) ÷ 0.02 = £7,000 LTV; same customer without churn (0%) = infinite LTV (unrealistic); lower churn dramatically increases LTV (3% churn = £4.7K, 2% = £7K, 1% = £14K); churn is LTV killer",
      "LTV varies by segment: Enterprise (1% churn) = £25-50K LTV, Mid-market (2% churn) = £5-15K LTV, SMB (5% churn) = £1-3K LTV; same price, wildly different LTV; CAC budget should be 20-30% of LTV (so CAC=£1,500 with £7K LTV = 21%, healthy); 10% LTV increase = 10% CAC budget increase (same proportional spending)",
      "LTV determines company economics: LTV £7K ÷ CAC £1.5K = 4.7x ratio (healthy >3x); LTV £3K ÷ CAC £5K = 0.6x ratio (bad, losing money); if you can't reach 3x LTV/CAC with reasonable CAC, business model is broken; fix by reducing churn (most impactful), increasing revenue (harder), or reducing CAC (hardest)"
    ],
    content: [
      {
        heading: "Understanding Customer Lifetime Value (LTV)",
        body: `Customer Lifetime Value (LTV) is the total profit you expect to make from a customer over their lifetime.

**LTV Formula**

Simple formula (assumes constant monthly revenue):
\`\`\`
LTV = (Monthly revenue per customer × Gross margin %) ÷ Monthly churn rate
\`\`\`

Or in different terms:
\`\`\`
LTV = (ARPU × GM) ÷ Monthly churn %
\`\`\`

Where:
- ARPU: Average revenue per user per month
- GM: Gross margin (% of revenue after COGS)
- Monthly churn: % of customers lost monthly

**LTV Examples**

Example 1: Basic SaaS customer

Monthly revenue: £200
Gross margin: 70%
Monthly churn: 2%

LTV = (£200 × 0.70) ÷ 0.02 = £140 ÷ 0.02 = £7,000

Interpretation: You expect to make £7,000 profit from this customer over their lifetime.

Example 2: Enterprise customer (low churn)

Monthly revenue: £5,000
Gross margin: 75% (higher for enterprise)
Monthly churn: 0.5% (very low, sticky)

LTV = (£5,000 × 0.75) ÷ 0.005 = £3,750 ÷ 0.005 = £750,000

Interpretation: Enterprise customer is worth £750K to you (assuming they stay).

Example 3: SMB customer (high churn)

Monthly revenue: £50
Gross margin: 60% (lower for SMB, more support)
Monthly churn: 5% (high, easy to switch)

LTV = (£50 × 0.60) ÷ 0.05 = £30 ÷ 0.05 = £600

Interpretation: SMB customer is worth £600 to you.

**The Impact of Churn on LTV**

Churn is the LTV killer. Same customer, different churn rates:

Monthly revenue: £200, 70% GM

| Monthly churn | Months to lose 50% | LTV |
|---|---|---|
| 1% | 69 months | £14,000 |
| 2% | 35 months | £7,000 |
| 3% | 23 months | £4,667 |
| 5% | 14 months | £2,800 |
| 10% | 7 months | £1,400 |

At 1% monthly churn, customer lasts 69 months (5.75 years). LTV is £14K.
At 10% monthly churn, customer lasts 7 months. LTV is £1.4K (10x less valuable!).

**This shows: Reducing churn is the highest-impact lever for improving LTV.**

Reducing churn from 3% to 2%:
- LTV increases: £4,667 → £7,000 (50% increase)
- Same CAC but 50% more profit
- Can justify higher CAC (higher budget for sales/marketing)

**LTV vs. CAC Ratio**

LTV is most useful when compared to CAC (Customer Acquisition Cost):

LTV/CAC ratio shows how much profit you make relative to acquisition cost.

| LTV/CAC | Status | Health |
|---|---|---|
| <1 | Losing money | Broken (can't pay back CAC) |
| 1-2 | Marginal | Barely viable |
| 2-3 | Acceptable | OK but tight |
| 3-5 | Healthy | Good business |
| 5+ | Excellent | Very profitable |

Example:

Customer LTV: £7,000
Customer CAC: £1,500
Ratio: £7,000 ÷ £1,500 = 4.67x

Interpretation: You make £4.67 in profit for every £1 spent acquiring a customer.

If ratio is 4.67x:
- After payback (9 months), you have 5.75 years of profit
- Can reinvest those profits
- Business is scalable

If ratio is 1.5x:
- After payback (20 months), you have 2 years of profit
- Tight margins, hard to reinvest
- Business is marginal

Most SaaS aim for 3x+ LTV/CAC ratio.

**LTV Calculation with Expansion**

LTV formula above assumes flat revenue per customer.

More realistic: Customers expand over time (upsells, seat growth).

Adjusted LTV formula:
\`\`\`
LTV = Sum of (Monthly contribution margin × Probability of customer active in that month)
\`\`\`

Or simpler, accounting for expansion:

\`\`\`
LTV = (Initial monthly revenue × 1.1^months + Expansion × months) × GM ÷ 12 ÷ Monthly churn
\`\`\`

Example with expansion:

Customer acquired at £200/month, expands 10% annually (grows to £220, £240, etc.)

Assumption: 2% monthly churn

Month 1-12:
- Average revenue: £210 (£200 + 5% growth mid-year)
- Annual contribution: £210 × 12 × 0.70 = £1,764

Month 13-24:
- Average revenue: £230 (starting higher, growing 5%)
- Annual contribution: £230 × 12 × 0.70 = £1,932

And so on...

With expansion, LTV increases beyond simple calculation.

**LTV by Customer Segment**

LTV varies dramatically by segment:

| Segment | ARPU | GM | Churn | LTV |
|---------|------|----|----|-----|
| Enterprise | £5,000 | 75% | 0.5% | £750K |
| Mid-market | £500 | 70% | 2% | £17.5K |
| SMB | £100 | 65% | 5% | £1.3K |
| Freemium | £5 | 80% | 15% | £267 |

Enterprise is 2,800x more valuable than freemium (same effort to support, vastly different value).

This drives strategy:
- Enterprise: Invest heavily in sales/CS (worth it)
- Mid-market: Balanced approach
- SMB: Self-serve only (can't support with expensive team)
- Freemium: Minimal support, focus on conversion to paid

**LTV and Pricing Strategy**

LTV determines pricing power:

If LTV = £7,000 and CAC = £1,500, you can afford to pay up to £1,500 in acquisition costs.

If you raise prices 20%:
- New ARPU: £240 (from £200)
- New LTV: (£240 × 0.70) ÷ 0.02 = £8,400
- New CAC budget: Up to £2,520 (if maintaining 3.3x ratio)
- Additional CAC budget: £1,020 (£2,520 − £1,500)

Price increase → Higher LTV → Higher CAC budget → Can afford more expensive sales.

But: Price increase may reduce customers (elasticity). Measure impact.

**Improving LTV**

Three levers to improve LTV:

1. **Reduce churn** (highest impact)
   - Current: 2%/month = £7K LTV
   - Target: 1%/month = £14K LTV
   - Effort: Build retention features, improve onboarding

2. **Increase revenue per customer** (expansion)
   - Current: £200/month
   - Target: £250/month (through upsells, seat growth)
   - New LTV: (£250 × 0.70) ÷ 0.02 = £8,750 (25% improvement)
   - Effort: Product development, pricing structure

3. **Improve gross margin**
   - Current: 70% = £7K LTV
   - Target: 75% = £7.5K LTV (7% improvement)
   - Effort: Optimize infrastructure, negotiate vendor costs

Most impactful: Reduce churn (can double LTV by cutting churn in half).

**LTV and Payback Period Connection**

LTV and payback period are related:

Payback = CAC ÷ (Monthly revenue × GM)
LTV = (Monthly revenue × GM) ÷ Monthly churn

If payback is 10 months and churn is 2%/month:
- Customer lifetime: ~50 months (2% × 50 = 100%)
- LTV: 5x the payback period

High churn (5%/month) = short lifetime = only 20 months life:
- If payback is 10 months, customer lasts 2x the payback (marginal)

Low churn (1%/month) = long lifetime = 100 months life:
- If payback is 10 months, customer lasts 10x the payback (healthy)

Goal: Payback <12 months, lifetime >30 months (LTV 2.5x+ payback period).
`
      }
    ],
    relatedSlugs: [
      "customer-acquisition-cost-optimization",
      "churn-analysis-retention-improvement",
      "unit-economics-deep-dive",
      "customer-segmentation-ltv-by-segment",
      "profitability-mechanics"
    ],
    faq: [
      {
        q: "How do I calculate LTV?",
        a: "LTV = (Monthly revenue × Gross margin %) ÷ Monthly churn rate. Example: £200 revenue, 70% GM, 2% churn = (£140) ÷ 0.02 = £7,000 LTV."
      },
      {
        q: "What's a good LTV/CAC ratio?",
        a: "3x or higher is healthy. <2x means you're barely breaking even. >5x means you're very efficient. Target 3-5x."
      },
      {
        q: "How does churn affect LTV?",
        a: "Dramatically. Reducing churn from 3% to 2% increases LTV by 50%. Reducing churn is the highest-impact lever for improving LTV."
      },
      {
        q: "How does expansion affect LTV?",
        a: "Expansion increases LTV beyond base calculation. If customers upgrade/add seats, monthly revenue increases, which increases LTV. Track expansion rate to refine LTV."
      }
    ],
    videoUrl: ""
  }
];

export default batch83Articles;
