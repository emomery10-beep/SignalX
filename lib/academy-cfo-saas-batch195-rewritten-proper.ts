import { AcademyArticle } from "@/types/academy";

export const batch195Articles: AcademyArticle[] = [
  {
    slug: "vendor-management-and-procurement-strategy",
    title: "Vendor Management and Procurement Strategy: Optimizing Costs and Relationships",
    description: "Master vendor management. Negotiate contracts, manage costs, and build strategic partnerships.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "vendor management",
      "procurement",
      "contract negotiation",
      "vendor selection",
      "cost optimization",
      "vendor risk",
      "supplier management",
      "RFP",
      "vendor relationships",
      "negotiation strategy"
    ],
    keyTakeaways: [
      "Vendor categories: Infrastructure (AWS, GCP, cloud = 40% of OpEx), Tools (Salesforce, Slack, productivity = 15% of OpEx), Professional services (accountants, lawyers = 5% of OpEx), Other (10% of OpEx). Optimize big buckets first (AWS from £1M to £600K saves £400K). Process: RFP (request for proposal), evaluate (price, features, risk), negotiate (terms, pricing, SLA), contract (lock in). Savings target: 10-20% through consolidation and negotiation.",
      "Negotiation tactics: Competition (get 2-3 bids), volume (commit to 3-year contract for 20% discount), bundling (combine products, get discount), payment terms (pay upfront for 10-15% discount), SLA guarantees (uptime SLA 99.9%, credits if down). Example: AWS £1M/year → 20% early renewal discount + volume commitment = £800K (£200K savings). Consolidation: Reduce vendor count (was 50 vendors, consolidate to 15) = easier management + volume discounts.",
      "Risk management: Single vendor risk (if AWS down, you're down). Mitigation: Multi-cloud (AWS + GCP), contract backup suppliers. Vendor financial health: Monitor (if key vendor goes bankrupt, find replacement fast). Data ownership: Ensure you own data (not vendor lock-in). SLA and support: Define what \"up\" means (99.9% uptime = 43 min/month downtime acceptable?)."
    ],
    content: [
      {
        heading: "Vendor Categorization and Optimization",
        body: `Understanding vendor landscape and priorities.

**Vendor Cost Breakdown**

Typical £10M revenue SaaS company:
- Total OpEx: £3.5M (35% of revenue)
- Breakdown:

| Category | Cost | % of OpEx | Examples |
|----------|------|----------|----------|
| Payroll (salaries + benefits) | £2.0M | 57% | Engineering, sales, ops |
| Infrastructure (cloud) | £400K | 11% | AWS, GCP, Heroku |
| Tools (SaaS subscriptions) | £500K | 14% | Salesforce, Slack, Zendesk |
| Professional services | £200K | 6% | Accountants, lawyers, consultants |
| Facilities | £150K | 4% | Office rent, utilities |
| Marketing/travel | £150K | 4% | Ads, events, travel |
| Misc | £100K | 3% | Insurance, licenses, subscriptions |
| **Total** | **£3.5M** | **100%** | |

Priorities (optimize biggest buckets first):
1. Payroll (57%): Not easily reduced (core team), focus on productivity
2. Infrastructure (11%): £400K spend, potential 20% savings = £80K
3. Tools (14%): £500K spend, potential 15% savings = £75K
4. Professional services (6%): £200K spend, potential 25% savings = £50K
5. Others: Smaller impact

Quick wins: Infrastructure + Tools = potential £150K savings with effort

**Vendor Categories**

1. Critical vendors (business can't function):
   - Cloud infrastructure (AWS, GCP, Azure)
   - Payment processor (Stripe, PayPal)
   - Main business tools (CRM, ERP)
   - Management: Close relationships, regular reviews, contract negotiation

2. Important vendors (significant cost impact):
   - Collaboration tools (Slack, Asana, Figma)
   - Analytics (Mixpanel, Amplitude)
   - Support tools (Zendesk, Intercom)
   - Management: Annual reviews, negotiate renewals

3. Commodity vendors (easily replaceable):
   - Office supplies, shipping, logistics
   - Managed: Autopay, minimal review

4. Strategic vendors (long-term partnerships):
   - Key consultants, agencies, development partners
   - Management: Quarterly business reviews, multi-year agreements

**Consolidation Strategy**

Before consolidation:
- 50+ vendors (sprawl)
- Multiple redundant tools (3 analytics tools, 2 CRMs)
- No volume discounts
- High management overhead
- Cost: £600K tools + services

After consolidation:
- 15-20 core vendors (focus)
- Best-of-breed tools (1 analytics, 1 CRM, 1 project tool)
- Volume discounts negotiated
- Easier to manage and audit
- Cost: £450K tools + services (25% reduction)

Consolidation process:
1. Audit all vendors (list all subscriptions, contract dates, costs)
2. Categorize by criticality (must-have, nice-to-have, replace)
3. Identify duplicates (multiple tools doing same thing)
4. Consolidate: Keep best, cancel rest
5. Renegotiate: Leverage consolidated spend for discounts

`
      },
      {
        heading: "RFP Process and Vendor Selection",
        body: `Evaluating and selecting vendors.

**Request for Proposal (RFP)**

When to use RFP:
- High-cost vendors (>£50K annually)
- Critical to business (payment processor, cloud)
- Complex requirements (need custom features)
- Changing vendors (current contract ending)

RFP structure:

1. Scope:
   - What problem are we solving?
   - Example: "Need payment processing for SaaS subscriptions (monthly, variable amounts, international)"

2. Requirements:
   - Functional: Which features must we have?
     - Example: "Support recurring billing, 30+ payment methods, fraud detection"
   - Non-functional: Performance, security, compliance
     - Example: "99.9% uptime SLA, PCI DSS compliance, SOC 2 certified"
   - Support: What support do we need?
     - Example: "24/7 support, dedicated account manager for >£100K annual spend"

3. Evaluation criteria:
   - Price (40% weight): Total cost of ownership
   - Features (30% weight): Does it meet requirements?
   - Vendor stability (15% weight): Financial health, roadmap
   - Support (15% weight): Responsiveness, SLA
   - Example scoring table:

| Vendor | Price (0-100) | Features (0-100) | Stability (0-100) | Support (0-100) | Weighted |
|--------|---------------|------------------|------------------|-----------------|----------|
| Stripe | 90 | 95 | 100 | 95 | 94.5 |
| Square | 85 | 80 | 90 | 80 | 84.5 |
| Adyen | 75 | 90 | 95 | 85 | 85 |

4. Timeline:
   - Week 1: Publish RFP, give 2 weeks for response
   - Week 3: Evaluate responses, score
   - Week 4: Demo sessions with top 2-3 vendors
   - Week 5: Final negotiation, contract
   - Week 6: Sign and onboard

**Evaluation Process**

Shortlist (top 2-3 from RFP):
- Request demos (30-60 min)
- Have key users attend (product team, ops, finance)
- Ask: "Can this do X?" (functional questions), "How do you handle Y?" (edge cases)

Reference calls:
- Request customer references from vendor
- Call 2-3 customers (similar company size, use case)
- Ask: "Are they responsive? Do they meet SLA? Would you recommend?"
- Red flag: Vendor can't provide references or references say "okay but..." (lukewarm)

Trial period:
- If possible, get 30-day trial
- Test: Set up test account, try core features
- Assess: Is UX good? Integration easy? Support responsive?

Negotiation:
- Coming next section

**Switching Costs**

Evaluate cost to switch:
- Data migration (one-time cost)
- Training (one-time cost, team time)
- Integration (development time)
- Disruption (operational risk)

Example (switching CRM from Salesforce to Hubspot):
- Data migration: £20K (consultants to export/import)
- Training: £10K (team time)
- Integration: £5K (development to sync with systems)
- Disruption: 1 month lower productivity (sales team learning new system)
- Total cost: £35K + lost productivity

Factor into decision:
- "New vendor is 10% cheaper (£50K savings), but switching cost £35K, net savings £15K (break-even first year)"
- "New vendor is 10% cheaper, but switching cost £35K + disruption. Not worth it." (stick with current)

`
      },
      {
        heading: "Contract Negotiation and Management",
        body: `Negotiating terms and managing relationships.

**Negotiation Strategies**

1. Competitive bids:
   - Get 2-3 proposals from different vendors
   - Use to create competition
   - Example: "Vendor A quotes £100K, Vendor B quotes £80K"
   - Negotiate: "Vendor A, can you match £80K?" (usually yes to win the deal)
   - Savings: From £100K to £85K (15% reduction)

2. Volume commitment:
   - Offer: 3-year contract (vs annual)
   - Discount: 20% off annual price (pay same total, get longer commitment)
   - Example: £100K annual = £300K over 3 years
   - With discount: £80K annual = £240K over 3 years (£60K savings)
   - Vendor wins: Locked-in customer, revenue certainty
   - You win: Lower price, budget certainty

3. Upfront payment:
   - Offer: Pay full year upfront (vs monthly)
   - Discount: 10-15% off (vendor gets cash flow certainty)
   - Example: £100K annual = £85K paid upfront (15% savings)
   - Use if: Cash position good, vendor solid

4. Bundling:
   - Example: Need CRM + Email tool + Analytics
   - Negotiate: "If we take all 3 from HubSpot (CRM + email + analytics bundle) vs separate vendors, what discount?"
   - Often: 20-30% bundle discount
   - Savings: £300K separate → £210K bundled (30% reduction)

5. Performance guarantees:
   - Negotiate: Uptime SLA (99.9% availability)
   - If down more than SLA: Vendor credits (e.g., 5% discount if fails SLA)
   - Example: AWS down 1 hour = breaches 99.9% SLA = 5% credit (£20K credit if £400K annual)
   - Incentivizes vendor to maintain uptime

6. Non-standard terms:
   - Auto-renewal cancellation: Allow 60-day cancellation (vs locked-in)
   - Price lock: Lock price for 3 years (vs increases with inflation)
   - Flexibility: Scale up/down usage without penalty
   - Example: "If we scale from 50 to 100 users, prorate (don't charge additional setup fee)"

**Contract Management**

Maintain vendor spreadsheet:
- Vendor name, category, contract start/end, renewal date
- Cost (annual), payment terms (monthly/upfront/annual)
- Key terms (SLA, data ownership, IP)
- Renewal date: Flag 3 months before (time to evaluate alternatives, negotiate)

Calendar reminders:
- 3 months before renewal: Evaluate alternatives, start RFP if switching
- 1 month before: Finalize terms, approve new contract
- At renewal: Execute, update records
- Quarterly: Review vendor performance (is it delivering value?)

Escalation process:
- If vendor not meeting SLA: Escalate to account manager
- If vendor support slow: Escalate to VP
- If vendor not fixing issues: Prepare to switch

Quarterly business reviews (for important vendors):
- Schedule call with vendor (30 min)
- Review: Usage metrics, support tickets, roadmap alignment
- Feedback: What's working? What could improve?
- Plan: Any changes needed for next quarter?

**Vendor Risk Management**

Single vendor risk:
- If critical vendor goes down, business affected
- Mitigation: Multi-vendor strategy (backup)
- Example: Stripe + Square (if Stripe down, use Square)
- Cost: 10% higher (pay for 2 solutions), worth for critical services

Financial health:
- Monitor vendor stability (are they profitable? Raising funding? Going public?)
- Risk: If vendor shuts down, lose service
- Protection: Data ownership clause (own your data, can export anytime)

Data ownership:
- Ensure contract states: "You own all data, can export anytime"
- Red flag: "We own data" or complex export process
- Why: If vendor shuts down or you switch, you need your data

Support and SLA:
- Define uptime SLA (99.9%, 99.95%, 99.99%)
- Define support response time (1 hour critical, 4 hour normal, 24 hour low)
- Include: Credits/penalties if SLA breached
- Why: Ensures vendor stays responsive and stable

`
      }
    ],
    relatedSlugs: [
      "financial-controls-and-audit-readiness",
      "burn-rate-and-cash-runway-analysis",
      "p-l-statement-architecture-profitability",
      "gross-margin-expansion-and-cost-optimization",
      "cash-flow-management-and-working-capital"
    ],
    faq: [
      {
        q: "How do I identify which vendors to optimize?",
        a: "Audit all vendors, cost. Optimize big buckets first. Example: Infrastructure (11% of OpEx, £400K) = priority 1. Tools (14% of OpEx, £500K) = priority 2. Professional services (6% of OpEx, £200K) = priority 3. Target savings: 20% from infrastructure (£80K), 15% from tools (£75K), 25% from services (£50K) = £205K total (6% of OpEx reduction). Focus on vendors where you have leverage (large spend or easy to switch)."
      },
      {
        q: "How do I negotiate better vendor contracts?",
        a: "Tactics: (1) Competitive bids (get 2-3 quotes, use competition to reduce price), (2) Volume commitment (3-year contract for 20% discount), (3) Upfront payment (pay annually for 10-15% discount), (4) Bundling (multiple products for 20-30% bundle discount), (5) SLA guarantees (credits if vendor fails to meet uptime). Example: £100K annual → £80K with competitive bid → £64K with 3-year commitment (36% total reduction)."
      },
      {
        q: "When should I consolidate vendors?",
        a: "If: Vendor sprawl (50+ vendors), multiple redundant tools, high management overhead. Goal: Reduce to 15-20 core vendors (best-of-breed). Process: Audit all, identify duplicates, keep best, cancel rest. Savings: 20-25% cost reduction through consolidation + volume discounts. Example: £600K in tools → £450K after consolidation."
      },
      {
        q: "What should my vendor contract include?",
        a: "Key terms: (1) SLA (99.9% uptime, credits if failed), (2) Data ownership (you own, can export anytime), (3) Support (24/7 for critical, SLA response times), (4) Term (3-year commitment for discount), (5) Price lock (fixed price, no increases), (6) Non-standard terms (60-day cancellation, flexibility to scale). Red flags: Vendor owns data, locked-in (no exit), no SLA, no support guarantees."
      }
    ],
    videoUrl: ""
  }
];

export default batch195Articles;
