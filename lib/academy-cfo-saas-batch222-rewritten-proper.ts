import { AcademyArticle } from "@/types/academy";

export const batch222Articles: AcademyArticle[] = [
  {
    slug: "customer-segmentation-and-personalization",
    title: "Customer Segmentation and Personalization: Tailoring Customer Experience",
    description: "Master segmentation. Divide customers, personalize experience, optimize by segment.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["segmentation", "personalization", "customer segments", "targeting", "customer experience", "cohort", "personalized", "messaging", "customization", "segments"],
    keyTakeaways: [
      "Segment types: By size (SMB vs enterprise, different pricing/support), by industry (finance vs healthcare, different needs), by use case (power users vs explorers, different feature adoption), by behavior (high engagement vs at-risk). Strategy: Start 3-4 segments, manage separately (different sales motions, pricing, CS approach). Example: SMB (self-serve, £50/mo, email support), mid-market (dedicated AE, £500/mo, 24hr support), enterprise (custom, £5K+/mo, executive relationship). ROI: Personalization increases conversion 15-30%, retention 10-20%, NPS 5-10 points.",
      "Personalization mechanics: Website (show relevant features based on segment), email (tailor messaging), product (show/hide features by tier), pricing (different for segments). Example: Enterprise visits = show enterprise features, customer success story, contact sales. SMB visits = show quick start, pricing, 14-day trial. Cost: Simple personalization (rules-based) = low cost (1 week dev). Advanced (ML-based) = higher cost (2-3 weeks dev, analyst support). ROI: Conversion increase 5-15% (huge uplift).",
      "Segment metrics and optimization: Track by segment: churn (enterprise 0.5%, SMB 3%), CAC (enterprise £5K, SMB £500), LTV (enterprise £100K, SMB £5K), payback (enterprise 14 months, SMB 6 months). Optimize each: Enterprise = high touch, long payback acceptable. SMB = low touch, short payback required. Pricing: Enterprise 10x SMB pricing (different willingness to pay). Example: £50/mo SMB = £500/mo mid-market = £5K+/mo enterprise (10-100x leverage based on value, not just cost)."
    ],
    content: [
      {
        heading: "Segmentation Strategy",
        body: `Dividing customers strategically.

**Segmentation approaches**

By size (most common):
- SMB: <50 employees, <£1M revenue, price-sensitive
- Mid-market: 50-500 employees, £1-100M revenue, ROI-focused
- Enterprise: >500 employees, >£100M revenue, feature-rich, support-focused

By industry (vertical segmentation):
- Finance: Regulatory requirements, high CAC, high LTV
- Healthcare: Compliance (HIPAA), slow sales, high pricing power
- Retail: Seasonal, integration-heavy, commodity pricing

By use case (how customer uses product):
- Power users: Use 80%+ features, high retention, expansion opportunity
- Casual users: Use 20% features, at-risk churn
- Explorers: Trying product, conversion focus

**Segment characteristics**

| Segment | SMB | Mid-market | Enterprise |
|---|---|---|---|
| ACV | £500-5K | £5-50K | £50K+ |
| Sales motion | Self-serve + trial | Sales demo + trial | Complex RFP |
| Sales cycle | 2-4 weeks | 4-12 weeks | 6-12+ months |
| Churn | 3-5% monthly | 1-2% monthly | <1% monthly |
| CAC | £500-1K | £2-5K | £5-20K |
| LTV | £5-10K | £30-100K | £100K+ |
| Support | Email, in-app | 24hr support, QBR | Dedicated CSM |

**Personalization by segment**

Website:
- SMB: Show quick start, free trial, pricing
- Mid-market: ROI calculator, case study, book demo
- Enterprise: Compliance features, security, contact sales

Email:
- SMB: Product tips, feature announcements, upsell
- Mid-market: Industry trends, best practices, expansion opportunities
- Enterprise: Strategic value, quarterly business reviews, thought leadership

Product:
- SMB: Self-serve, limited customization, standard features
- Mid-market: Some customization, advanced features, API access
- Enterprise: Full customization, dedicated support, premium SLAs

Pricing:
- SMB: Simple tiering, month-to-month option
- Mid-market: Volume discounts, annual commitment
- Enterprise: Custom pricing, multi-year deals, service agreement

`
      }
    ],
    relatedSlugs: ["pricing-strategy-and-price-optimization", "customer-success-metrics-and-program-design", "unit-economics-ltv-cac-payback"],
    faq: [
      {
        q: "How many segments should I have?",
        a: "Start: 3-4 segments (manageable, avoid over-complication). Typical: SMB, mid-market, enterprise. Can add: By industry if serves multiple verticals. Too many: >6 segments = hard to manage, abandon. Measure: Each segment separately (churn, CAC, LTV, payback period). Optimize: Tailor sales/marketing/CS to each."
      },
      {
        q: "What's the ROI of personalization?",
        a: "Conversion: +15-30% (stronger message, relevant features). Retention: +10-20% (right product for customer). NPS: +5-10 points. Cost: Low-cost (rules-based, rule-based, 1 week dev), advanced (ML, 2-3 weeks). ROI: Conversion increase 10% = £1M+ revenue for growing company."
      },
      {
        q: "How do I price differently by segment?",
        a: "Willingness to pay: Enterprise 10x SMB (same feature = different value). Example: £50/mo SMB = £500/mo mid-market = £5K+ enterprise. Justification: Enterprise gets dedicated support, SLAs, customization. SMB = self-serve, community support. Price positioning: Anchor high (enterprise), discount SMB (affordability)."
      }
    ],
    videoUrl: ""
  }
];

export default batch222Articles;
