import { AcademyArticle } from "@/types/academy";

export const batch235Articles: AcademyArticle[] = [
  {
    slug: "net-revenue-retention-and-expansion-metrics",
    title: "Net Revenue Retention and Expansion Metrics: Growing Existing Customers",
    description: "Master NRR. Grow existing customers, reduce churn, build expansion revenue.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["NRR", "net revenue retention", "expansion revenue", "churn", "gross retention", "upsell", "cross-sell", "customer growth"],
    keyTakeaways: [
      "NRR fundamentals: Formula = (Revenue start of period - churn + expansion) / Revenue start of period. Example: £1M starting ARR, £50K churn, £150K expansion = (£1M - £50K + £150K) / £1M = 110% NRR. Interpretation: 110% = every £1 at start = £1.10 at end (growing). 100% = flat (churn = expansion). <100% = shrinking (churn > expansion). Target: 120%+ (sustainable growth without new customer acquisition). Enterprise SaaS: 130-150% typical (deep expansion). SMB: 100-110% typical (lower expansion, higher churn).",
      "Expansion revenue drivers: Upsell (upgrade to higher tier), cross-sell (add new product), price increases, seat growth (more users), usage growth (pay more for more usage). Example: Customer starts at £5K/year. Year 1 add 10 seats (+£2K = £7K). Year 2 upgrade product tier (+£3K = £10K). Year 3 price increase (+£0.5K = £10.5K). Total: Expansion revenue £5.5K on initial £5K (110% expansion %, grows lifetime value 40%). Cost: CS/product team identifying opportunities, relatively low cost vs new CAC.",
      "Improving NRR: Target: Reduce churn to <1% monthly (invest in CS onboarding, product quality). Expansion: Identify expansion triggers (customer has achieved initial ROI, seasonal needs, complementary use case). Example: E-commerce customer → triggers: upsell when using 80%+ of current features, cross-sell inventory product when ready for expansion. Account mapping: Identify multiple buyers (finance, operations, procurement) = expansion surface. Track: NRR by cohort (newer customers may have lower expansion), by segment (enterprise > SMB expansion). Payback: £500K investment in CS/product team, 2-3% NRR improvement = £1M+ revenue impact, 2-3x payback."
    ],
    content: [
      {
        heading: "Driving Net Revenue Retention",
        body: `Growing revenue from existing customers.

**NRR calculation and interpretation**

Formula:
NRR = (Beginning ARR - Churn + Expansion) / Beginning ARR

Example calculation:
- Beginning ARR: £1,000,000
- Churn: -£50,000 (5% customer loss)
- Expansion: +£150,000 (upsell, cross-sell, price increase)
- Ending ARR: £1,100,000
- NRR: 1,100,000 / 1,000,000 = 110%

Gross Retention Rate (GRR):
- Formula: (Beginning ARR - Churn) / Beginning ARR
- Example: (£1,000,000 - £50,000) / £1,000,000 = 95% GRR
- Expansion revenue = NRR - GRR = 110% - 95% = 15%

Interpretation:
| NRR | Meaning | Trajectory |
|---|---|---|
| <100% | Shrinking (churn > expansion) | Declining (unsustainable) |
| 100% | Flat (churn = expansion) | Flat growth |
| 100-120% | Growing (expansion > churn) | Moderate growth |
| 120%+ | Strong growth (high expansion) | Sustainable, doubling every 3-4 years |
| 130%+ | Exceptional (very high expansion) | Scaling rapidly |

**Expansion revenue mechanics**

Upsell strategies:
- Product tier upgrade (more features, higher capacity)
- Example: Customer starts "Pro" (£500/month), upgrades to "Enterprise" (£2K/month)
- Trigger: Customer hitting feature limits, usage milestones, ROI realization

Cross-sell:
- Sell complementary product to existing customer
- Example: CRM customer → add "Sales Automation" product
- Trigger: Customer has matured on core product, adjacent need

Price increases:
- Annual price raise (5-10%)
- Example: Customer base at £500/month, raise to £540/month, existing customers at old price
- Impact: 8% increase on new customers, locked existing (impacts next year)

Seat/usage growth:
- Customer adds more users or usage
- Example: Customer starts with 10 users, grows to 50 users (5x)
- Formula: (New users - old users) × monthly ARPU per user

**NRR improvement plan**

Reduce churn:
- Investment: CS onboarding, product quality
- Target: <1% monthly churn
- Example: 3% monthly → 1% monthly = 24% annual churn reduction
- Impact: +2% NRR directly

Increase expansion:
- Triggers: Customer ROI achieved, feature limit hit, seasonal need
- Account mapping: Multiple buyers, expansion paths
- Example: £1K customer, identify 3 expansion paths, 30% uptake = £900 expansion per customer

Measure and optimize:
- NRR by cohort (track cohort expansion vs historical)
- NRR by segment (enterprise vs SMB)
- Expansion rate by product/feature

`
      }
    ],
    relatedSlugs: ["account-management-and-expansion-revenue", "customer-success-metrics-and-program-design", "cohort-analysis-and-customer-lifecycle"],
    faq: [
      { q: "What's a good NRR target?", a: "Enterprise SaaS: 130-150%+ (deep expansion). Growth SaaS: 120-130% (healthy). SMB SaaS: 100-110% (limited expansion). Below 100%: Shrinking (problem). To measure: Track churn + expansion revenue separately. NRR = (Start ARR - churn + expansion) / Start ARR." },
      { q: "How do I improve NRR?", a: "Reduce churn: CS investment in onboarding, product quality. Target: <1% monthly. Increase expansion: Upsell (upgrade tiers), cross-sell (new products), price increases, seat growth. Identify triggers: ROI achieved, feature limits hit, seasonal needs. Expected: 2-3% NRR improvement = £1M+ revenue for growing SaaS." },
      { q: "What drives high NRR?", a: "Product quality: Sticky product, hard to replace. Customer success: Continuous value realization. Expansion opportunities: Multiple products, multiple users, usage growth. Pricing: Pricing aligned with customer value growth. Example: Land £5K customer, grow 50%/year → £5K → £7.5K → £11K (expansion-driven growth)." }
    ],
    videoUrl: ""
  }
];

export default batch235Articles;