import { AcademyArticle } from "@/types/academy";

export const batch372Articles: AcademyArticle[] = [
  {
    slug: "financial-due-diligence-for-saas-acquisitions",
    title: "Financial Due Diligence for SaaS Acquisitions: Evaluating Targets",
    description: "Master financial due diligence. Evaluate SaaS acquisition targets, identify risks, and validate valuations.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["due diligence", "M&A", "acquisition", "valuation", "financial analysis"],
    keyTakeaways: [
      "Revenue quality assessment: Verify ARR is genuine recurring revenue. Check: (1) Contract terms (auto-renew vs manual), (2) Revenue concentration (top 10 customers <30%), (3) Cohort retention (each cohort should retain >85%), (4) Revenue recognition (IFRS 15 compliant). Red flags: One-off revenue classified as recurring, implementation fees in ARR, gross-to-net adjustments >5%. Example: Stated £5M ARR, after adjustment for one-off fees and non-renewing contracts = £4.2M quality ARR.",
      "Normalised EBITDA: Adjust reported EBITDA for non-recurring items. Common adjustments: (1) Founder salary normalisation (add back above-market or below-market difference), (2) One-off costs (legal, restructuring), (3) Related-party transactions (adjust to market rate), (4) Run-rate cost savings (post-acquisition synergies). Example: Reported EBITDA £500K + £200K founder overpay + £100K one-off legal = £800K normalised EBITDA.",
      "Valuation multiples: SaaS typically valued on revenue multiples. Median: 5-8x ARR (private companies). High growth (>50% YoY): 10-15x ARR. Low growth (<20% YoY): 3-5x ARR. Rule of 40 premium: Companies scoring >40% command 2-3x premium. Example: £5M ARR, 40% growth, Rule of 40 = 50% → Premium multiple 8-10x → Valuation £40-50M. Verify with DCF model (not just multiples)."
    ],
    content: [
      {
        heading: "Conducting Financial Due Diligence on SaaS Targets",
        body: `A systematic approach to evaluating SaaS acquisition targets.

**Revenue quality analysis**

Step 1: Verify ARR definition

What counts as ARR:
- Contractually recurring subscription revenue
- Annualised from monthly contracts
- Excludes: One-time fees, implementation, consulting, overages

Common misrepresentations:
- Including implementation fees in ARR
- Counting non-recurring revenue as recurring
- Including churned customers who haven't formally cancelled
- Gross vs net revenue differences

Adjustment example:

Stated ARR: £5,000,000

Adjustments:
- Remove implementation fees: -£300K
- Remove non-renewing contracts: -£200K
- Gross-to-net adjustment (discounts): -£150K
- Churned but not cancelled: -£100K
- Currency adjustment: -£50K

Quality ARR: £4,200,000 (16% lower than stated)

Impact on valuation:
- At 8x multiple: £33.6M (vs £40M on stated ARR)
- Difference: £6.4M

Step 2: Analyse revenue concentration

Customer concentration:
- Top 1 customer: Should be <15% of ARR
- Top 5 customers: Should be <30% of ARR
- Top 10 customers: Should be <40% of ARR

Example:

| Customer | ARR | % of total |
|---|---|---|
| Customer A | £800K | 16% | ← Risk: >15% |
| Customer B | £500K | 10% |
| Customer C | £400K | 8% |
| Top 3 total | £1,700K | 34% | ← Risk: >30% |
| Remaining 200 | £3,300K | 66% |
| Total | £5,000K | 100% |

Risk: If Customer A churns, ARR drops 16% immediately

Step 3: Cohort analysis

Analyse each customer cohort (by sign-up date):

| Cohort | Start ARR | Month 12 ARR | Retention |
|---|---|---|---|
| 2023 Q1 | £500K | £450K | 90% |
| 2023 Q2 | £600K | £510K | 85% |
| 2023 Q3 | £700K | £665K | 95% |
| 2023 Q4 | £800K | £680K | 85% |

Analysis:
- Average retention: 89% (acceptable but not great)
- Q2 and Q4 cohorts weaker (investigate why)
- Trend: Mixed (no clear improvement)

Step 4: Contract analysis

Review contract terms:
- Auto-renewal clauses (what % auto-renew?)
- Notice periods (30, 60, 90 days?)
- Price escalation clauses
- Termination for convenience
- SLA commitments and penalties

Red flags:
- Contracts without auto-renewal
- Short notice periods (30 days)
- No price escalation clauses
- Unlimited SLA commitments
- Favourable terms for early customers that can't be changed

**Cost and margin analysis**

Gross margin validation:

Reported gross margin: 78%

COGS breakdown:
| Item | Amount | % of revenue |
|---|---|---|
| Cloud hosting | £400K | 8% |
| Support team | £300K | 6% |
| Customer success | £200K | 4% |
| Third-party APIs | £100K | 2% |
| DevOps team | £100K | 2% |
| Total COGS | £1,100K | 22% |
| Gross margin | £3,900K | 78% |

Adjustments:
- Are DevOps costs correctly classified? (sometimes in R&D)
- Support team: Full cost including benefits?
- Cloud costs: Will they scale linearly? (check committed spend)
- Third-party APIs: Are contracts renegotiable?

Adjusted gross margin: May differ by 2-5%

Operating cost analysis:

| Category | Amount | % revenue | Benchmark | Status |
|---|---|---|---|---|
| R&D | £1,500K | 30% | 20-30% | At ceiling |
| Sales & marketing | £2,000K | 40% | 30-50% | In range |
| G&A | £800K | 16% | 10-15% | Above |
| Total opex | £4,300K | 86% | 75-95% | In range |

Key questions:
- R&D: How much is maintenance vs new development?
- S&M: CAC payback period? Sales efficiency?
- G&A: Any costs that will be eliminated post-acquisition?

**Normalised EBITDA calculation**

Reported P&L:
- Revenue: £5,000K
- COGS: -£1,100K
- Gross profit: £3,900K
- R&D: -£1,500K
- S&M: -£2,000K
- G&A: -£800K
- EBITDA: -£400K

Normalisation adjustments:

| Adjustment | Amount | Rationale |
|---|---|---|
| Founder salary normalisation | +£150K | Founders paid £250K vs £100K market |
| One-off legal fees | +£100K | M&A preparation costs |
| Redundant office lease | +£80K | Post-acquisition, relocate team |
| Non-recurring consulting | +£50K | Strategy project, won't repeat |
| Below-market rent to related party | -£30K | Adjust to market rate |
| Total adjustments | +£350K | |

Normalised EBITDA: -£400K + £350K = -£50K

Run-rate adjustments (post-acquisition synergies):
- Eliminate duplicate tools: +£100K
- Shared infrastructure: +£50K
- Combined G&A savings: +£200K

Pro-forma EBITDA: -£50K + £350K = £300K

**Valuation analysis**

Revenue multiple approach:

SaaS valuation multiples (private companies):

| Growth rate | Typical multiple | Premium factors |
|---|---|---|
| >100% YoY | 15-25x ARR | Exceptional growth |
| 50-100% | 8-15x ARR | High growth |
| 30-50% | 5-10x ARR | Moderate growth |
| 15-30% | 3-7x ARR | Low growth |
| <15% | 2-5x ARR | Minimal growth |

Adjustments to multiple:
- Net retention >120%: +1-2x premium
- Gross margin >80%: +1x premium
- Rule of 40 >50%: +1-2x premium
- Customer concentration >30%: -1-2x discount
- High churn (>15%): -1-2x discount

Example valuation:

Company: £5M ARR, 40% growth, 115% NRR, 78% gross margin

Base multiple (40% growth): 7x ARR = £35M
- NRR premium (>110%): +1x = £5M
- Gross margin (average): +0x
- Rule of 40 (40% + (-8%) = 32%): -0.5x = -£2.5M

Indicated value: £37.5M (7.5x ARR)

DCF validation:

Project 5-year cash flows:
- Year 1: -£50K (normalised EBITDA)
- Year 2: £500K (growth + synergies)
- Year 3: £1,200K
- Year 4: £2,000K
- Year 5: £3,000K
- Terminal value: £3M × 15x = £45M

DCF (15% discount rate):
- PV of cash flows: £4.8M
- PV of terminal value: £22.4M
- Enterprise value: £27.2M

Range: £27-38M (DCF to multiples)

**Due diligence checklist**

Financial:
- 3 years audited financial statements
- Monthly P&L for last 24 months
- ARR bridge (new, expansion, churn, contraction)
- Customer-level revenue data
- Cap table and option pool
- Debt and contingent liabilities
- Tax returns and compliance status

Operational:
- Key customer contracts (top 20)
- Employee list with compensation
- Technology stack and infrastructure costs
- Vendor contracts and commitments
- IP ownership and assignments

Legal:
- Corporate structure
- Material litigation
- Regulatory compliance
- Data protection (GDPR)
- Insurance policies

**Common due diligence red flags**

1. Revenue quality: ARR includes non-recurring items
2. Customer concentration: Top 3 customers >40% of revenue
3. Cohort degradation: Recent cohorts retain worse than old
4. Unsustainable pricing: Below-market pricing to acquire customers
5. Technical debt: High maintenance cost, aging infrastructure
6. Key person risk: Product/revenue depends on 1-2 people
7. Pending litigation: Material unresolved legal issues
8. Tax non-compliance: Unpaid taxes or unfiled returns
9. IP ownership: Unclear ownership of core technology
10. Hidden liabilities: Off-balance-sheet commitments

`
      }
    ],
    relatedSlugs: ["post-acquisition-integration-and-success", "financial-modeling-and-forecasting-techniques", "saas-metrics-benchmarking-and-peer-comparison", "fundraising-and-investor-relations", "revenue-recognition-and-deferred-revenue"],
    faq: [
      { q: "How do I verify ARR quality in due diligence?", a: "Check: (1) Only contractually recurring revenue counts (exclude one-time fees, implementation, consulting), (2) Review top 20 customer contracts, (3) Run cohort retention analysis, (4) Verify gross-to-net adjustments, (5) Confirm revenue recognition is IFRS 15 compliant. Common adjustment: Stated ARR typically 10-20% higher than quality ARR after removing non-recurring items." },
      { q: "What multiples do SaaS companies trade at?", a: "Private SaaS: 2-25x ARR depending on growth. >100% growth: 15-25x. 50-100%: 8-15x. 30-50%: 5-10x. <30%: 2-7x. Premiums for: NRR >120% (+1-2x), gross margin >80% (+1x), Rule of 40 >50% (+1-2x). Discounts for: customer concentration, high churn, low margins. Always validate multiples with DCF analysis." },
      { q: "What are the biggest due diligence red flags?", a: "Top red flags: (1) Non-recurring revenue in ARR (inflated metrics), (2) Customer concentration >40% in top 3, (3) Declining cohort retention, (4) Key person dependency, (5) Unclear IP ownership, (6) Tax non-compliance, (7) Hidden liabilities, (8) Technical debt requiring rebuild. Each can reduce valuation 10-30% or kill the deal entirely." }
    ],
    videoUrl: ""
  }
];

export default batch372Articles;
