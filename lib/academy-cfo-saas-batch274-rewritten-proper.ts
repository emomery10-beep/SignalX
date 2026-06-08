import { AcademyArticle } from "@/types/academy";

export const batch274Articles: AcademyArticle[] = [
  {
    slug: "upsell-and-cross-sell-strategy",
    title: "Upsell and Cross-Sell Strategy: Growing Revenue from Existing Customers",
    description: "Master upselling. Identify opportunities, position offers, execute playbooks.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["upsell", "cross-sell", "expansion", "revenue growth", "customer expansion", "product expansion"],
    keyTakeaways: [
      "Upsell vs cross-sell: Upsell (upgrade to higher tier, more features), cross-sell (buy new product). Example: Customer on Slack Pro → upgrade to Enterprise (upsell), add Slack Workflow Builder add-on (cross-sell). Timing: After customer has achieved ROI (typically month 3-4). Trigger: Usage milestone (80%+ feature adoption), time-based (quarterly review), request-based (customer asks for advanced feature). Cost: CS/sales time identifying opportunities. Benefit: 10-20% ACV expansion per customer (huge impact on NRR). Expected: 30-50% of customers upsell annually, 20-30% cross-sell. ROI: Expansion revenue often 50%+ of new customer revenue (easier to sell existing customers).",
      "Upsell playbook: Identify (customer ready? achieved ROI?). Position (what problem does higher tier solve?). Propose (offer better tier, show ROI). Close (negotiate, get signature). Onboard (ensure transition smooth). Example: Customer using 80% of features → propose Enterprise (more seats, advanced support, custom integrations). ROI: Save £2K/mo in support time = worth £24K/year (easy sell). Close rate: 40-60% (existing customers more likely to buy). Implementation: Sales + CS time (1-2 hours per customer per proposal). Benefit: 20% expansion ARR if convert 50% of base annually.",
      "Cross-sell strategy: Identify complementary products (product roadmap, customer interviews). Recommend (personalized, relevant to customer use case). Timing: After customer mature on core product. Success rate: 20-30% (lower than upsell, less obvious need). Example: CRM customer (your core) → Analytics product (cross-sell, helps CRM customers). Expected: £2K/month additional ARPU. Cost: Sales time, product training (CS needs to understand to sell). Benefit: Higher LTV (customer spends more), higher NRR (expansion revenue beats churn)."
    ],
    content: [
      {
        heading: "Upsell and Cross-Sell Execution",
        body: `Expanding revenue from existing customers.

**Upsell playbook**

Triggers for upsell readiness:
| Trigger | Signal | Timing |
|---|---|---|
| Usage milestone | Using 80%+ features | Month 3-4 |
| Time-based | At quarterly business review | Every Q |
| Request-based | Customer asks for advanced feature | On-demand |
| Pain-based | Customer mentions limitation | On-demand |
| Competitive | Competitor has feature we have in tier | Event-driven |

Upsell positioning:
- Problem: "You're using 80% of Pro features, advanced use cases limited"
- Solution: "Enterprise tier unlocks: custom integrations, advanced automation, dedicated support"
- ROI: "Estimated value: £5K/month (better support, advanced features pay for themselves)"

Example proposal:
- Current: Pro tier (£2K/month)
- Proposed: Enterprise tier (£5K/month)
- Additional cost: £3K/month (£36K/year)
- Justification: New features, dedicated support, 40% ROI to customer

Close strategy:
- Soft ask: "Would Enterprise features be valuable?"
- Handle objections: "Cost too high? Let's calculate ROI together."
- Propose trial: "Try Enterprise for 1 month free?"
- Close: "I'll get contract ready for you to sign"

Timeline:
- Identify: Weekly (ongoing)
- Propose: As triggers occur
- Close: 1-2 weeks (existing relationship, faster)

Success rates:
- Soft ask (no strong positioning): 10-20% close
- ROI-based positioning (show value): 40-50% close
- Trial + positioning: 50-70% close

Expected annual impact:
- Base: 100 customers, 20% at upsell opportunity
- Close rate 40%: 8 upsells × £36K = £288K new ARR
- Implementation cost: 2 hours per × £150/hour × 20 = £6K
- Net: £282K new ARR (47x ROI)

**Cross-sell playbook**

Cross-sell opportunities:
| Core product | Cross-sell | Why | Typical ARPU |
|---|---|---|---|
| CRM | Analytics | Understand customer insights | +£500-1K/mo |
| Project mgmt | Time tracking | Track team productivity | +£300-500/mo |
| Email platform | SMS | Multi-channel messaging | +£200-500/mo |
| Help desk | Community | Self-service knowledge | +£200-400/mo |

Readiness signals:
- Core product adoption high (90%+ features used)
- Customer segment (larger companies more likely)
- Use case fit (product solves real problem)
- Willingness to buy (high NPS, quick to adopt)

Positioning:
- Problem: "You manage CRM, but lack visibility into customer behavior"
- Solution: "Analytics product helps you understand what drives conversions"
- ROI: "Typical customer saves 5 hours/week = £2K/month value"

Sales approach:
- Personalized (research customer use case first)
- Value-driven (show specific benefit, not generic pitch)
- Low-pressure (recommend but don't push)
- Free trial (let customer try, see value)

Implementation:
- Identify target (research customers, prioritize high-potential)
- Prepare (understand customer use case, customize pitch)
- Reach out (CS or sales, depending on relationship)
- Trial (offer free trial, 2-4 weeks)
- Purchase (follow up, close if interested)

Timeline: 2-4 weeks per customer (longer than upsell, lower urgency)

Success rates:
- Generic offer: 10-15% conversion
- Personalized pitch: 20-30% conversion
- Free trial + personalized: 30-50% conversion

Expected annual impact:
- Base: 100 customers, 30% at cross-sell opportunity
- Close rate 25%: 7.5 cross-sells × £6K annual ARPU = £45K new ARR
- Implementation cost: 3 hours × 150/hour × 30 = £13.5K
- Net: £31.5K new ARR (2.3x ROI, but lower than upsell)

**Metrics and optimization**

Track:
- Upsell rate: % of customer base upgraded annually (target >20%)
- Cross-sell rate: % of customer base that buy new product (target >10-15%)
- Expansion revenue: Total new ARR from upsell + cross-sell (target 10-20% of total revenue)
- Time to upsell/cross-sell: Days from trigger to close (optimize to speed)

Improve:
- Increase triggers (better usage monitoring, more QBRs)
- Improve positioning (test messaging, ROI calculations)
- Faster closes (reduce negotiation time, clear pricing)
- Higher conversion (trial offers, personalization)

`
      }
    ],
    relatedSlugs: ["account-management-and-expansion-revenue", "net-revenue-retention-and-expansion-metrics", "pricing-strategy-and-price-optimization"],
    faq: [
      { q: "When should I upsell a customer?", a: "Triggers: Usage 80%+ features, quarterly business review, customer requests feature. Timing: Month 3+ (after ROI achieved). Approach: Position value (ROI, missing capabilities), soft ask (would Enterprise be valuable?), handle objections, propose trial. Close rate: 40-50% (higher for existing customers)." },
      { q: "What's a good upsell rate?", a: "Target: 20%+ of customer base annually. Expected: 40-60% close rate on qualified opportunities. Impact: 20% upsell rate = 15-20% expansion revenue (huge NRR impact). Effort: 1-2 hours per customer for qualifying + proposing." },
      { q: "How do I cross-sell effectively?", a: "Identify complement products (solve adjacent problems). Position personalized (show specific value, not generic). Free trial (2-4 weeks, let customer see value). Close rate lower than upsell (20-30% vs 40-50%). Impact: Lower than upsell but still valuable (5-10% expansion revenue possible)." }
    ],
    videoUrl: ""
  }
];

export default batch274Articles;