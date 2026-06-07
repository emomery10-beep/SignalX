import { AcademyArticle } from "@/types/academy";

export const batch383Articles: AcademyArticle[] = [
  {
    slug: "saas-contract-negotiation-and-commercial-terms",
    title: "Contract Negotiation and Commercial Terms: SaaS Deal Structuring",
    description: "Master SaaS contracts. Negotiate payment terms, structure enterprise deals, and protect revenue.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["contract negotiation", "commercial terms", "enterprise deals", "payment terms", "SaaS contracts"],
    keyTakeaways: [
      "Standard SaaS contract terms: Auto-renewal (critical for retention), annual billing with net-30 payment, price escalation clause (3-5% annual increase), termination for convenience (30-90 day notice). Non-standard requests to push back on: Termination for convenience at any time, unlimited liability, most-favoured-nation pricing, broad indemnification. Example: Enterprise customer requests 6-month termination clause on 3-year deal — counter with 12-month minimum commitment + early termination fee.",
      "Pricing and payment negotiation: Never discount without getting something in return. Trade: Discount for annual prepayment, longer commitment, case study rights, referral commitment. Example: Customer asks for 20% discount. Counter: 15% discount for 2-year commitment with annual prepayment. Revenue impact: Higher TCV, better cash flow, lower churn risk. Discount authority: Rep can offer 10%, VP approval for 15%, CFO/CEO for >15%.",
      "Enterprise deal economics: Large deals require different analysis. Key metrics: (1) TCV (Total Contract Value) — include all committed revenue, (2) ACV (Annual Contract Value) — normalised annual value, (3) Implementation cost (often £20-50K for enterprise), (4) Gross margin per deal (after implementation and support costs). Example: £200K TCV over 3 years = £67K ACV. Implementation: £30K. Year 1 margin: (£67K - £30K - £15K support) / £67K = 33%. Year 2+: (£67K - £15K support) / £67K = 78%."
    ],
    content: [
      {
        heading: "Structuring and Negotiating SaaS Contracts",
        body: `Building contract frameworks that protect revenue and enable growth.

**Standard SaaS contract structure**

Key commercial terms:

Subscription term:
- Monthly: No commitment (month-to-month)
- Annual: 12-month commitment (standard)
- Multi-year: 2-3 year commitment (enterprise)
- Auto-renewal: Automatic renewal unless cancelled (critical)

Auto-renewal clause:
- Standard: Auto-renews for successive 12-month periods
- Notice period: 30-90 days before renewal to cancel
- Critical: Without auto-renewal, every contract is at risk
- Negotiation: Resist any attempt to remove auto-renewal

Payment terms:
- Self-serve: Prepaid (credit card at sign-up)
- SMB: Annual prepayment or monthly billing
- Mid-market: Annual prepayment, net-30 invoice
- Enterprise: Annual or quarterly, net-30 to net-60

Price escalation:
- Annual CPI increase (2-4% typical)
- Fixed annual increase (3-5%)
- Tied to usage growth
- Example clause: "Subscription fees may increase by up to 5% on each renewal anniversary"
- Importance: Without this, prices are locked for contract duration

Termination:
- For cause: Either party can terminate if other party breaches (with cure period)
- For convenience: Riskier — allows customer to leave without cause
- If must include: Add early termination fee (remaining contract value)
- Standard: 30-day cure period for breach, 90-day notice for non-renewal

**Liability and indemnification**

Liability cap:
- Standard: Liability limited to fees paid in prior 12 months
- Enterprise request: Unlimited liability (push back strongly)
- Compromise: 2x annual fees for standard claims, unlimited for specific carve-outs (IP infringement, data breach, wilful misconduct)

Example:
- Annual contract: £100K
- Standard liability cap: £100K
- Enterprise compromise: £200K (2x) for general, unlimited for IP/data

Indemnification:
- Vendor indemnifies for: IP infringement, data breach (caused by vendor)
- Customer indemnifies for: Misuse of product, customer data (caused by customer)
- Mutual: Each party indemnifies for own negligence

What to resist:
- Indemnification for third-party claims arising from product use (too broad)
- Consequential damages (loss of profits, revenue — exclude or cap)
- Unlimited indemnification (cap at liability limit)

**Discount negotiation framework**

Never discount without value exchange:

Discount tiers and trade-offs:

| Discount | What you get in return |
|---|---|
| 5-10% | Annual prepayment (instead of monthly/quarterly) |
| 10-15% | 2-year commitment + annual prepayment |
| 15-20% | 3-year commitment + annual prepayment + case study |
| 20-25% | 3-year commitment + prepayment + case study + referral commitment |
| >25% | Rarely justified (strategic exception only) |

Approval matrix:

| Discount level | Approver |
|---|---|
| 0-10% | Sales rep (standard) |
| 10-15% | VP Sales |
| 15-20% | CFO |
| 20-25% | CEO |
| >25% | Board (exceptional) |

Alternative to discounts:

Instead of reducing price, add value:
- Extra seats/users (low marginal cost)
- Premium support tier (limited cost)
- Extended trial period
- Priority feature requests
- Training and onboarding included
- These preserve revenue while addressing customer budget concerns

Example negotiation:

Customer: "We need 25% discount to close this deal."

Response: "I understand budget constraints. Here's what I can offer:
- 15% discount for a 2-year commitment with annual prepayment
- Plus: Premium support tier included (normally £5K/year)
- Plus: 5 additional seats at no charge
- Effective discount: ~22% in value, but 15% on headline price"

Result: Higher TCV, better retention, preserved pricing integrity

**Enterprise deal structuring**

Multi-year deal economics:

Example: Enterprise customer, 3-year deal

Option A: Annual pricing (no commitment)
- Year 1: £100K
- Year 2: £100K (may churn)
- Year 3: £100K (may churn)
- Expected revenue (assuming 85% retention): £100K + £85K + £72K = £257K
- Risk: High (customer can leave each year)

Option B: 3-year commitment with 15% discount
- Year 1: £85K
- Year 2: £85K
- Year 3: £85K
- Total: £255K (committed)
- Risk: Low (contractual commitment)

Option B is better despite discount:
- Committed revenue (no churn risk)
- Annual prepayment improves cash flow
- Lower renewal cost (no re-selling needed)
- Customer more invested (committed)

Implementation cost recovery:

Enterprise onboarding costs:
- Project management: £10K
- Data migration: £15K
- Custom configuration: £10K
- Training: £5K
- Total: £40K

Recovery options:
1. Implementation fee: Charge £30K upfront (customer pays)
2. Baked into subscription: Spread over contract (£10K/year premium)
3. Absorbed (if deal is strategic): Reduce gross margin year 1

Recommendation: Charge implementation fee (at least partial)
- Signals value of onboarding
- Improves year 1 economics
- Customer more committed (invested money in setup)

**SLA and service credits**

Standard SLA structure:

| Uptime | Service credit |
|---|---|
| ≥99.9% | None |
| 99.0-99.9% | 5% of monthly fees |
| 95.0-99.0% | 10% of monthly fees |
| <95.0% | 25% of monthly fees |

SLA considerations:
- Cap total service credits (25-50% of monthly fees maximum)
- Exclude: Scheduled maintenance, force majeure, customer-caused issues
- Measure: Monthly (not daily or hourly)
- Process: Customer must request credit (not automatic)

What to track:
- Actual uptime vs SLA commitment
- Service credit liability (include in financial forecasts)
- SLA breaches (trend and root cause)

Financial impact:
- If SLA is 99.9% and actual is 99.5%
- Service credits on £1M ARR at 5% = £4.2K/month
- Annual exposure: £50K (5% of ARR)
- Build into COGS forecast if SLA breaches are regular

**Contract management and renewal**

Renewal process timeline:

T-180 days: Health check
- Review customer health score
- Product usage analysis
- Support ticket history
- Identify expansion opportunities

T-120 days: Success review
- QBR with customer
- Present value delivered
- Discuss roadmap and future needs
- Identify any concerns

T-90 days: Renewal discussion
- Present renewal proposal
- Include price escalation
- Propose expansion (upsell)
- Address any objections

T-60 days: Negotiation
- Handle discount/term requests
- Finalise commercial terms
- Draft renewal contract

T-30 days: Signature
- Send renewal contract for signing
- Follow up for signature
- Process payment

T-0: Renewal date
- Contract renews (auto-renew if not signed manually)

Renewal KPIs:

| Metric | Target |
|---|---|
| Gross renewal rate | >90% |
| Net renewal rate (with expansion) | >110% |
| On-time renewal (signed before T-0) | >80% |
| Upsell on renewal | >30% of renewals |
| Average price increase | 3-5% |
| Downgrade on renewal | <10% |

**Common contract pitfalls**

1. No auto-renewal: Every contract must be re-sold
2. No price escalation: Prices locked forever
3. Unlimited liability: Existential risk for small company
4. Free termination: Customer can leave without penalty
5. Broad MFN clause: Must give best price to everyone
6. No payment terms: Customer pays whenever they want
7. IP assignment: Customer owns customisations (you lose IP)
8. Non-compete: Can't sell to customer's competitors
9. Exclusive territory: Can't sell to anyone in customer's market
10. Unlimited support SLA: Must respond in 1 hour, 24/7

`
      }
    ],
    relatedSlugs: ["saas-pricing-strategy-and-monetisation", "enterprise-vs-smb-economics-segment-strategy", "land-and-expand-strategy-expansion-revenue", "sales-compensation-and-incentive-structures", "revenue-recognition-and-deferred-revenue"],
    faq: [
      { q: "What are the most important SaaS contract terms?", a: "Critical terms: (1) Auto-renewal (protects revenue continuity), (2) Payment terms (annual prepay preferred, net-30 for enterprise), (3) Price escalation (3-5% annual increase clause), (4) Liability cap (12 months fees, resist unlimited), (5) Termination notice (90 days minimum). Push back on: Termination for convenience, unlimited liability, MFN pricing, broad indemnification." },
      { q: "How should I handle discount requests?", a: "Never discount without getting value in return. Framework: 5-10% for annual prepayment, 10-15% for 2-year commitment + prepay, 15-20% for 3-year + prepay + case study. Approval: Rep up to 10%, VP up to 15%, CFO up to 20%, CEO up to 25%. Alternative to discounts: Add value (extra seats, premium support, training) which preserves pricing integrity." },
      { q: "How do I structure a multi-year enterprise deal?", a: "Compare: Annual pricing (£100K/year, risk of churn) vs 3-year commitment with 15% discount (£85K/year × 3 = £255K committed). Multi-year is better: committed revenue, no churn risk, lower renewal cost. Charge implementation fees separately (£20-50K). Include price escalation on renewal. Add SLA with capped service credits (25-50% of monthly fees maximum)." }
    ],
    videoUrl: ""
  }
];

export default batch383Articles;
