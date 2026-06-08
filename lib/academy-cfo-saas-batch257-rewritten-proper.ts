import { AcademyArticle } from "@/types/academy";

export const batch257Articles: AcademyArticle[] = [
  {
    slug: "vendor-management-and-procurement-strategy",
    title: "Vendor Management and Procurement Strategy: Managing Spend",
    description: "Master vendor management. Negotiate contracts, manage relationships, optimize spend.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["vendor management", "procurement", "vendor negotiations", "vendor relationships", "cost negotiation", "vendor contracts"],
    keyTakeaways: [
      "Vendor categorization: Strategic (core business, hard to replace, negotiate hard), standard (commodity, many alternatives, optimize cost), at-risk (sole supplier, high switching cost, build relationship). Example: AWS (strategic = core infrastructure, negotiate volume discount), Slack (standard = communications, many alternatives), IP vendor (at-risk = only source, lock in with good terms). Strategy: Strategic = lock in long-term (3 years), standard = negotiate lowest cost (annual bids), at-risk = build redundancy (find alternative supplier). Cost: Vendor negotiation (£1-2K per contract), reducing spend (1-5% per vendor) = net positive ROI.",
      "Negotiation framework: RFP (request for proposal, formal process with multiple vendors). Selection: Evaluate cost, quality, support. Terms: Payment (net 30 vs net 60), volume discounts (5-10% at £1M+ annual), multi-year (discount for 3-year lock). Example: SaaS tool costs £1,000/month. Negotiate: (1) net 60 terms (£60K float = cash benefit), (2) 10% annual discount (lower price), (3) 2-year lock (£21,600 total vs £24,000 = £2,400 savings). Cost: 2 hours negotiation (£100 cost). Savings: £2,400 (24x payback).",
      "Vendor relationship management: Review quarterly (are they meeting SLAs? giving best pricing?). Alternative sourcing (always have backup vendor, drives negotiation). Volume leverage (consolidate spend, negotiate volume discount). Example: Using 10 tools at £500/mo each = £5K/mo. Consolidate: Merge to 5 tools (£1K/mo) = £4K/month savings. Effort: Implementation (1 month transition), negotiation (1 week). Cost: £5-10K. Savings: £48K/year (5-10x payback)."
    ],
    content: [
      {
        heading: "Vendor Management and Cost Negotiation",
        body: `Building efficient vendor relationships.

**Vendor categorization and strategy**

Strategic vendors (core business):
- Examples: AWS (infrastructure), Salesforce (CRM), Snowflake (data warehouse)
- Characteristics: Hard to replace, high switching cost, mission-critical
- Strategy: Long-term relationships (3-year contracts), negotiate volume discounts
- Negotiation: Focus on volume + term length discounts
- Example: AWS annual spend £500K → negotiate 10-15% discount = £50-75K savings

Standard vendors (commodity):
- Examples: Email (Slack), productivity (Notion), video (Zoom)
- Characteristics: Many alternatives, easy to switch, relatively cheap
- Strategy: Competitive bidding (annual RFP), lowest cost
- Negotiation: Focus on cost (find alternatives, use as leverage)
- Example: Slack £100/month → find alternative (HipChat £80/month) → negotiate Slack to £85

At-risk vendors (sole supplier):
- Examples: Specialized software, proprietary integrations, key consultants
- Characteristics: Hard to replace, high switching cost, limited alternatives
- Strategy: Build relationship (friendly, collaborative), find alternatives (reduce risk)
- Negotiation: Long-term partner focus (improve service, mutual growth)
- Example: Key consultant £200/hour → lock 2-year contract (£100K commitment) → get rate reduction + priority access

**RFP and negotiation process**

RFP (Request for Proposal):
1. Define requirements (what do we need?)
2. Send to 3-5 vendors (competitive process)
3. Evaluate (cost, quality, support, terms)
4. Shortlist (2-3 best)
5. Negotiate (final terms)
6. Contract (sign and implement)

Timeline: 6-8 weeks (if new vendor), 2-4 weeks (if renewal)

Negotiation tactics:
| Tactic | Example | Savings |
|---|---|---|
| Volume discount | Spend >£100K → 5-10% off | 5-10% |
| Multi-year | 3-year deal → 10% discount | 10% |
| Payment terms | Net 60 vs net 30 | Working capital benefit |
| Features | Include X for no extra cost | 5-15% value add |
| Bundling | Multiple products → package deal | 10-20% |
| Timing | Negotiate end of vendor fiscal year | 5-10% (budget pressure) |

Combined: 20-30% negotiation typical (each tactic compounds)

Example negotiation:
- Base price: £10,000/year (1 year, net 30)
- Volume discount (spending £500K): -10% = £9,000
- Multi-year discount (3-year): -8% = £8,280
- Payment terms (net 60): 2-month float = working capital benefit
- Final: £8,280/year (17% discount) on 3-year contract (£24,840 total)

**Vendor relationship management**

Quarterly vendor review:
- SLA compliance: Are they meeting uptime, support response?
- Pricing: Is this still competitive?
- Value: Are we getting value from spend?
- Satisfaction: NPS with vendor

Review template:
| Vendor | Spend | SLA | Performance | Next action |
|---|---|---|---|---|
| AWS | £50K/mo | 99.9% | 98% uptime (good) | Negotiate volume |
| Slack | £2K/mo | 24h response | 2h response (excellent) | Renew |
| Notion | £500/mo | None | Works fine | Consolidate (alternative?) |

Consolidation opportunities:
- 10 different vendors, £2K/month → Find overlaps (communications, productivity, analytics)
- Consolidate to 5 vendors, £800/month → Net £1,200/month savings

Cost reduction program:
1. Audit all vendors (spend, usage, value)
2. Identify consolidation (overlap, redundancy)
3. Negotiate (volume, multi-year, bundling)
4. Implement (switch low-value, improve high-value)
5. Monitor (track savings, relationship health)

`
      }
    ],
    relatedSlugs: ["financial-planning-and-budgeting", "cash-flow-management-and-working-capital", "contract-negotiation-and-terms-optimization"],
    faq: [
      { q: "How do I negotiate with vendors?", a: "1. Do RFP (competitive process, 3-5 vendors). 2. Evaluate (cost, quality, support, terms). 3. Negotiate: volume discount (5-10%), multi-year (5-10%), payment terms, bundling. 4. Contract (sign). Typical: 15-25% negotiation discount possible." },
      { q: "How often should I renegotiate vendor contracts?", a: "Annual: For key vendors (strategic). Quarterly: Review SLA, pricing, value. When: Contract renewal (easy to renegotiate), change in volume (leverage for discount), new vendors available (use as leverage). Typical: 10-15% improvement on renegotiation (or find alternative)." },
      { q: "Should I consolidate vendors?", a: "Yes, if: You have overlapping tools (10 communication tools instead of 1-2). Consolidation saves: 20-30% on consolidated spend (volume discount + simpler management). Cost: 1-2 weeks transition per tool, implementation cost (£1-5K). Savings: Usually 3-6 months payback. Example: £5K/month (10 tools) → £3K/month (5 tools) = £24K/year savings." }
    ],
    videoUrl: ""
  }
];

export default batch257Articles;