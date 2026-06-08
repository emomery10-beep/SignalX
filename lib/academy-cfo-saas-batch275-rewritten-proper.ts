import { AcademyArticle } from "@/types/academy";

export const batch275Articles: AcademyArticle[] = [
  {
    slug: "enterprise-sales-process-and-cycles",
    title: "Enterprise Sales Process and Cycles: Selling to Large Companies",
    description: "Master enterprise sales. Build process, extend cycles, close large deals.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["enterprise sales", "sales cycle", "procurement", "deal management", "B2B sales", "sales process"],
    keyTakeaways: [
      "Enterprise vs SMB: Enterprise (larger deal £50K-500K+, longer cycle 6-18 months, multiple buyers/stakeholders, RFP process, higher CAC), SMB (smaller deal £1-10K, shorter cycle 2-8 weeks, single buyer, easier close, lower CAC). Strategy: Different sales motion per segment (SMB = inside sales, enterprise = field sales). Cost: Enterprise AE £150-200K salary, 1-2 deals/quarter expected. Benefit: Higher ACV (£100K+ vs £5K), longer LTV (enterprise > 5 years). ROI: Enterprise deal (£100K ACV, 18-month cycle) costs £30K CAC = 3x payback, but high variance (can take 24 months).",
      "Enterprise sales cycle stages: Prospecting (identify targets, outreach). Qualification (understand needs, budget). Discovery (deep dive, pain points). Proposal (RFP response, pricing). Negotiation (terms, legal, procurement). Close (signature, setup). Timeline: 2-3 months prospecting + qualification, 2-3 months discovery + proposal, 2-6 months negotiation + close = 6-18 months total. Multiple stakeholders: Technical (CTO, can veto), business (CFO/CEO, budget), operational (end user, adoption). Selling: Tailor messaging per stakeholder (technical features for CTO, ROI for CFO, ease-of-use for end user).",
      "Deal management: Weighted pipeline (assume x% close rate per stage). RFP process: Build, track, respond (3-4 weeks to respond well). Relationship building: C-suite dinner, exec sponsorship, reference calls. Legal: Negotiate contract terms (data processing, SLA, termination). Procurement: Navigate approval process (can take months). Playbook: Standard positioning, pricing by tier, objection handling. ROI: Enterprise sales expensive (time, travel, legal) but higher margin (higher price, longer LTV = profitable)."
    ],
    content: [
      {
        heading: "Enterprise Sales Strategy and Execution",
        body: `Selling to large organizations.

**Enterprise vs SMB sales**

| Dimension | Enterprise | SMB |
|---|---|---|
| Deal size | £50K-500K+ | £1-10K |
| Sales cycle | 6-18 months | 2-8 weeks |
| Buyers | Multiple (3-5) | Single (1-2) |
| Process | RFP, legal, procurement | Demo, trial, agree |
| CAC | £20-50K | £500-2K |
| LTV | £300K-2M+ | £10-20K |
| Sales motion | Field sales | Inside sales |
| AE productivity | 1-2 deals/quarter | 10-20 deals/quarter |

Enterprise deal example:
- Deal: £200K annual (5-year = £1M lifetime)
- CAC: £40K (extended sales cycle, legal, multiple stakeholders)
- Payback: 2.4 months (£200K / 12 = £16.7K/month, £40K / £16.7K)
- LTV/CAC: 25x (excellent, typical enterprise is 10-30x)

**Enterprise sales cycle**

Stages:
| Stage | Activities | Timeline | Owner | Outcome |
|---|---|---|---|---|
| Prospecting | Research, cold outreach, inbound | 1-2 months | AE/SDR | Initial interest |
| Qualification | Call, understand business, budget | 1-2 months | AE | Budget confirmed |
| Discovery | Deep dive, pain points, requirements | 2-3 months | AE + technical | Understand needs |
| Proposal | RFP response, pricing, positioning | 2-4 weeks | AE + sales eng | Formal bid |
| Negotiation | Contract terms, legal, procurement | 1-6 months | AE + legal | Approved deal |
| Close | Signature, setup, kickoff | 1-2 weeks | AE + CS | Revenue recognition |

Total timeline: 6-18 months (can stretch to 24+)

Stakeholder mapping:
| Stakeholder | Motivation | Concerns | Messaging |
|---|---|---|---|
| CTO/VP Eng | Technical fit, scalability | Integration effort, performance | Architecture, roadmap, support |
| CFO/VP Finance | ROI, cost control | Price, budget impact | Cost savings, ROI, payback |
| CEO/President | Strategic alignment, growth | Market fit, risk, timing | Competitive advantage, growth |
| End user | Ease of use, adoption | Training, change management | Usability, training, support |

Selling approach:
- Tailor: Different messaging per stakeholder (not one pitch)
- CTO: Technical depth (integrations, scalability, security)
- CFO: Business metrics (ROI, payback, savings)
- CEO: Strategic (competitive advantage, market position)
- End user: Practical (training, support, ease)

**RFP management**

RFP process:
1. Request: Customer issues RFP (questions, requirements)
2. Preparation: Internal team reviews RFP (2-3 days)
3. Response: Build answer document (2-3 weeks typical)
4. Review: Customer evaluates responses (1-2 weeks)
5. Selection: Customer chooses finalists (typically 2-3)
6. Final round: Presentation, reference calls, negotiation (1-2 weeks)

Response strategy:
- Cover every question (be comprehensive)
- Position strengths (where unique/superior)
- Handle gaps (where you don't match, position value elsewhere)
- ROI focus (not just features, show impact)
- Executive summary (CFO-focused, business case)

Cost to respond:
- Internal time (AE, sales eng, product, legal): 40-60 hours
- External costs (if using consultant): £2-5K
- Total: Typically £10-20K in time cost

Timeline:
- RFP issued: Start day 1
- Response due: 3-4 weeks typical (rush if shorter deadline)
- Evaluation: 2-4 weeks
- Decision: 1 week
- Total: 6-8 weeks (after RFP issued)

**Contract negotiation**

Standard terms:
- Contract value: Negotiated upfront
- Payment: Annual upfront vs quarterly (customer prefers quarterly, you prefer annual)
- Term: 1-3 year (longer = better pricing discount)
- Price locks: Lock price X years (no increase)
- Termination: For convenience (customer can exit), for cause (breach)
- SLA: 99.5-99.9% uptime, response times
- Support: Dedicated CSM (often included for enterprise)

Negotiation strategy:
- Start high (pricing, terms favorable to you)
- Concede on price (not value), not structure
- Lock long-term (1-3 years, benefits you)
- Get escalation (C-suite approval required for large deals)

Typical negotiation:
- Your offer: £200K/year, 3-year deal, 99.9% SLA, no price increase
- Customer counter: £150K/year, 1-year deal, 99.5% SLA, 5% annual increase
- Final: £180K/year, 2-year deal, 99.7% SLA, no increase (compromise)

Legal complexity:
- Data processing agreement (GDPR compliance)
- Security terms (ISO, SOC 2, audit rights)
- Indemnification (protection if sued)
- Liability caps (limit your exposure)

Time to negotiate: 4-12 weeks typical (depends on customer legal team)

`
      }
    ],
    relatedSlugs: ["sales-pipeline-management-and-forecasting", "contract-negotiation-and-terms-optimization", "customer-acquisition-strategy-and-marketing-roi"],
    faq: [
      { q: "What's different about enterprise sales?", a: "Longer cycle (6-18 months vs 2-8 weeks for SMB), multiple buyers (technical, finance, business), RFP process, higher deal size (£50K-500K+), higher CAC (£20-50K). Selling: Tailor per stakeholder, show ROI, navigate procurement, negotiate terms." },
      { q: "How long is enterprise sales cycle?", a: "Typical: 6-18 months. Prospecting + qualification: 2-3 months. Discovery + proposal: 2-3 months. Negotiation + close: 2-6+ months. Can extend to 24 months if customer's own process slow. Manage: Have pipeline 3x annual quota (to account for length + variance)." },
      { q: "What's important in enterprise contracts?", a: "Key terms: Price, payment (annual vs quarterly), term length (1-3 years), price locks, SLA (99.5-99.9%), data processing, security, termination. Negotiate: Start high, concede on price not structure. Long-term better for you (revenue certainty). Typical: 4-12 weeks to finalize." }
    ],
    videoUrl: ""
  }
];

export default batch275Articles;