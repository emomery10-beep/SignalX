import { AcademyArticle } from "@/types/academy";

export const batch256Articles: AcademyArticle[] = [
  {
    slug: "customer-acquisition-strategy-and-marketing-roi",
    title: "Customer Acquisition Strategy and Marketing ROI: Scaling Growth",
    description: "Master marketing ROI. Optimize channels, measure CAC, scale winners.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["marketing ROI", "customer acquisition", "CAC", "marketing channels", "demand generation", "channel optimization", "marketing spend"],
    keyTakeaways: [
      "Channel analysis: Rank by CAC, payback, LTV. Example: Paid search (CAC £2K, payback 8 mo), partnerships (CAC £500, payback 2 mo), content (CAC £1K, payback 4 mo), events (CAC £3K, payback 12 mo). Optimize: Kill high-CAC (events), scale low-CAC winners (partnerships). Budget: 15-20% of revenue for marketing. Allocation: 50% on CAC channels (paid, content), 30% brand/demand, 20% product marketing. Measurement: Track CAC, LTV, payback, CAC ratio (LTV/CAC target 3-5x). Math: £1M revenue, £150K marketing = 15% spend. If CAC £2K, can afford 75 new customers (£150K / £2K). If convert at 30%, need 250 SQLs (75 / 30%).",
      "Demand generation: Leads (inbound content, ads → leads) → SQLs (sales qualified, have budget) → opportunities (sales engaged) → customers. Funnel: 1000 leads → 100 SQLs (10%) → 30 opportunities (30%) → 10 customers (33%). CAC calculation: £1M spend / 10 customers = £100K per customer (if only track CAC from paid leads). Reality: Multiple touches (organic, reviews, word-of-mouth) before convert. Attribution: Multi-touch (credit all channels) vs first/last touch (credit first or last channel). Complex: Can't optimize if don't understand attribution. Tools: HubSpot, Marketo (attribution tracking).",
      "Channel scaling: Start 3-4 channels, measure CAC/payback/LTV. Double down on winners (3-6 months of data = pattern proven). Example: Email (CAC £500, payback 2 mo, repeatable) = scale. Content (CAC £1K, payback 4 mo, good ROI but slow) = keep but slower scaling. Events (CAC £5K, payback 18 mo, high risk) = deprioritize. Growth: 50% YoY needs to increase spend 50%. If CAC stays same, need 50% more customers (50% more leads). If CAC rising with scale (diminishing returns), adjust: better targeting, improve conversion, niches (new segments, lower CAC). Timeline: 6-12 months to mature channel (optimize, plateau in CAC)."
    ],
    content: [
      {
        heading: "Marketing Channel Analysis and ROI",
        body: `Optimizing marketing spending for growth.

**Channel CAC and payback analysis**

Rank channels by efficiency:

| Channel | CAC | Payback | LTV/CAC | Notes |
|---|---|---|---|---|
| Partnerships | £500 | 2 months | 40x | Best, limited scale |
| Content marketing | £1,000 | 4 months | 20x | Sustainable, scalable |
| Paid search | £2,000 | 8 months | 10x | Scalable, competitive |
| Direct sales | £2,500 | 10 months | 8x | Effective, expensive |
| Events | £5,000 | 20 months | 4x | Risky, low ROI |
| Affiliates | £1,500 | 6 months | 13x | Good, niche |

Decision framework:
- Payback <6 months: Scale (good ROI)
- Payback 6-12 months: Maintain (acceptable)
- Payback >12 months: Deprioritize (risky)
- LTV/CAC >5x: Excellent, scale
- LTV/CAC 3-5x: Good, maintain
- LTV/CAC <3x: Problem, optimize or kill

**Marketing funnel and attribution**

Funnel stages:
1. Awareness: Content, ads, word-of-mouth → Leads
2. Consideration: Demos, trials → SQLs (sales qualified)
3. Decision: Proposals, pricing → Opportunities
4. Close: Negotiation → Customers

Example funnel:
- Leads: 1,000 (inbound from all channels)
- SQLs: 100 (10% conversion, have budget)
- Opportunities: 30 (30% sales engagement)
- Customers: 10 (33% close rate)

CAC by channel:
| Channel | Leads | Cost | CAC |
|---|---|---|---|
| Paid search | 300 | £600K | £2,000 |
| Content | 400 | £400K | £1,000 |
| Partnerships | 200 | £100K | £500 |
| Events | 100 | £500K | £5,000 |
| Total | 1,000 | £1.6M | £1,600 blended |

Attribution challenge:
- Customer influenced by 5 touches (ad → content → demo → trial → close)
- First-touch: Credit ad (£2K CAC)
- Last-touch: Credit trial (£100 CAC)
- Multi-touch: Credit all (£4K CAC average)
- Truth: Likely 30% ad, 30% content, 20% demo, 20% trial = weighted attribution

Impact: If misattribute, optimize wrong channels (double down on low-performing, kill winners)

**Channel scaling strategy**

Phase 1: Test (month 1-3, each channel)
- Spend: £5-10K per channel (small experiment)
- Measure: CAC, payback, conversion rate
- Output: Identify best 2-3 channels

Phase 2: Optimize (month 3-6, top 2 channels)
- Spend: £20-50K per channel (growth mode)
- Improve: Targeting, messaging, conversion
- Output: Better CAC, proven pattern

Phase 3: Scale (month 6-12, proven winners)
- Spend: £50-200K per channel (scale mode)
- Expect: CAC rising (diminishing returns) but total customers growing
- Monitor: CAC ratio (should stay >3x LTV/CAC)

Example growth with scaling:
- Month 1-3: CAC £1K (best channel), 10 customers = £10K spend
- Month 4-6: CAC £1.2K (rising but scaled), 20 customers = £24K spend
- Month 7-12: CAC £1.5K (diminishing returns), 50 customers = £75K spend

Total: £109K spend, 80 customers = £1,362 blended CAC (slight rise, but scaled 8x)

`
      }
    ],
    relatedSlugs: ["metrics-dashboard-design-kpi-tracking", "unit-economics-ltv-cac-payback", "decision-making-frameworks-and-data-analytics"],
    faq: [
      { q: "How do I analyze marketing ROI by channel?", a: "Calculate CAC per channel (spend / customers acquired). Calculate payback (CAC / monthly contribution margin). Rank by payback (lower = better). Scale winners (<6 month payback), deprioritize losers (>12 month). Target: LTV/CAC ratio 3-5x+." },
      { q: "What's the right marketing budget?", a: "15-20% of revenue for marketing. Example: £1M revenue = £150-200K marketing spend. Allocation: 50% CAC channels (paid, content), 30% brand, 20% product marketing. Increase: If CAC channels have <6 month payback (good ROI), spend more. Decrease: If payback >12 months (risky ROI)." },
      { q: "How do I scale marketing?", a: "1. Test 3-4 channels (month 1-3), measure CAC. 2. Optimize top 2 (month 3-6), improve targeting/conversion. 3. Scale winners (month 6-12), expect CAC rise with scale. 4. Monitor: If CAC rising too fast (>30%/month), adjust strategy (new segments, channel diversification, improve product-fit)." }
    ],
    videoUrl: ""
  }
];

export default batch256Articles;