import { AcademyArticle } from "@/types/academy";

export const batch229Articles: AcademyArticle[] = [
  {
    slug: "unit-economics-ltv-cac-payback",
    title: "Unit Economics: LTV, CAC, and Payback Period",
    description: "Master unit economics. Calculate LTV, CAC, payback period, and optimize for profitable growth.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["LTV", "CAC", "unit economics", "payback period", "customer lifetime value", "customer acquisition cost", "profitability", "growth efficiency"],
    keyTakeaways: [
      "Unit economics fundamentals: LTV (total customer profit over lifetime, typically 3-7 years for SaaS) = ARPU (average revenue per user monthly) × Gross margin % × Lifetime months. CAC (total cost to acquire customer) = Sales + marketing spend / customers acquired. Payback (months to recoup acquisition cost) = CAC / (ARPU × gross margin). Example: ARPU £500/month, 60% gross margin = £300 monthly profit. CAC £3K. Payback = 10 months. LTV (assuming 5-year life) = £300 × 60 months = £18K. LTV/CAC = 6x (healthy 3-5x+).",
      "Improving LTV: Increase ARPU (raise prices 5-10%, expand features, upsell/cross-sell). Reduce churn (CS improvements, product quality, retention programs). Extend lifetime (sticky products, switching costs, community). Example: Reduce churn 2% → add 12 months to lifetime = 20% LTV increase. Upsell 20% of customers = 20% ARPU increase. Combined = 44% LTV improvement. Cost: Low (CS team, product). ROI: 100x+ for growing company.",
      "CAC optimization: Reduce CAC by channel (marketing efficiency). Choose high ROI channels (CAC 3-4 month payback). Avoid low ROI (CAC 18+ month payback). Scale winners (channel working, pour budget). Optimize: Better targeting (lower CAC), improve conversion (same spend, more customers), negotiate volume discounts. Example: Paid ads (CAC £2K, 7 month payback), partnerships (CAC £500, 2 month payback). Shift budget from ads to partnerships = blended CAC £750, 2.5 month payback. Cost: Marketing ops. Impact: 30-40% CAC reduction possible."
    ],
    content: [
      {
        heading: "Calculating and Optimizing Unit Economics",
        body: `Understanding the financial health of your business.

**Core unit economics metrics**

LTV (Customer Lifetime Value):
- Formula: ARPU × Gross margin % × Lifetime months
- Example: £500/month × 60% × 60 months = £18,000
- Interpretation: Total profit from average customer over their lifetime

CAC (Customer Acquisition Cost):
- Formula: (Sales + Marketing spend) / Customers acquired
- Example: £100K spend / 50 customers = £2,000 CAC
- Interpretation: Cost to acquire one customer

Payback Period:
- Formula: CAC / (ARPU × Gross margin %)
- Example: £2,000 / (£500 × 60%) = 6.7 months
- Interpretation: Months to recoup acquisition investment
- Healthy range: 3-12 months (depends on industry)

LTV/CAC Ratio:
- Formula: LTV / CAC
- Example: £18,000 / £2,000 = 9x
- Healthy range: 3x+ (5x+ is excellent)
- Interpretation: Returns per acquisition dollar

**Unit economics by company stage**

| Stage | ARPU | Churn | LTV | CAC | Payback | LTV/CAC |
|---|---|---|---|---|---|---|
| Early (0-£1M ARR) | £500-2K | 5% | £5-15K | £1-3K | 6-18 months | 2-5x |
| Growth (£1-10M) | £2-5K | 2-3% | £20-60K | £2-5K | 4-12 months | 4-8x |
| Scaling (£10-50M) | £5-10K | 1-2% | £50-150K | £3-8K | 3-8 months | 6-15x |
| Mature (>£50M) | £10K+ | <1% | £150K+ | £5-15K | 2-6 months | 10x+ |

**Improving profitability**

Increase LTV:
1. Raise prices (+5-10% = +5-10% LTV)
2. Expand features / upsell (+10-20% ARPU)
3. Reduce churn (-1% churn = +12 months lifetime)
4. Extend contracts (annual vs monthly)

Reduce CAC:
1. Improve targeting (same spend, better customers)
2. Optimize conversion (lower CAC per customer)
3. Focus on efficient channels (partnership vs ads)
4. Volume discounts at scale

Example optimization:
- Baseline: £500 ARPU, 3% churn, £2K CAC, 8 month payback
- Change 1: Reduce churn to 2% (+£300 LTV)
- Change 2: Raise price to £550 (+50 LTV, minor churn increase)
- Change 3: Lower CAC to £1.5K (better marketing)
- Result: £3.5K LTV (2x), £1.5K CAC, 4.3 month payback (better than most SaaS)

`
      }
    ],
    relatedSlugs: ["customer-segmentation-and-personalization", "pricing-strategy-and-price-optimization", "cash-flow-management-and-working-capital"],
    faq: [
      { q: "What's a good LTV/CAC ratio?", a: "Healthy: 3x+ (minimum), 5x+ (good). Early stage SaaS: 2-3x acceptable (build customer base). Growth stage: 5x+ expected. Mature: 10x+ common. Too low (<2x): Not profitable at scale. Too high (>15x): May indicate underinvestment in growth." },
      { q: "How do I improve unit economics?", a: "LTV: Reduce churn (CS investment), raise prices (5-10%), expand features (upsell). CAC: Optimize channels (higher ROI), improve conversion (better targeting), negotiate volume. Payback: Reduce CAC or increase ARPU. Cost: Usually £50-200K investment, 100x+ ROI." },
      { q: "What payback period should I target?", a: "Ideal: 6-12 months. Early stage: 12-18 months acceptable. Scaling: 3-9 months. Very long (>18 months): Hard to scale efficiently, high risk. Very short (<3 months): Underspending on acquisition, possible growth opportunity." }
    ],
    videoUrl: ""
  }
];

export default batch229Articles;