import { AcademyArticle } from "@/types/academy";

export const batch265Articles: AcademyArticle[] = [
  {
    slug: "public-company-readiness-and-ipo-preparation",
    title: "Public Company Readiness and IPO Preparation: Path to Going Public",
    description: "Master IPO readiness. Understand requirements, prepare financials, plan for public markets.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["IPO", "public company", "IPO preparation", "SEC compliance", "Sarbanes-Oxley", "going public", "public readiness"],
    keyTakeaways: [
      "IPO requirements: £100M+ revenue (US typical, £50M+ for UK/EU), 3+ years public financials (audited), Sarbanes-Oxley 404 compliance (internal control audit), board independence (majority independent directors), audit committee (all independent). Timeline: 2-3 years preparation (complex, slow). Cost: Underwriters (3-7% of proceeds), legal (£1-5M), audit (£500K-1M annually), compliance infrastructure (£500K-1M upfront). ROI: Access to capital (billion-dollar valuations), currency (use stock to acquire), liquidity (founders can sell). Example: £100M revenue SaaS at 5x = £500M valuation IPO. Benefit: Unlock value, optionality. Cost: Loss of privacy (public reporting), governance burden (Sarbanes-Oxley expensive).",
      "Preparation timeline: Year 1 (build foundation: audit-ready financials, independent board, strong finance team). Year 2 (build systems: internal controls, SOX 404 framework, draft prospectus). Year 3 (execute IPO: roadshow, underwriter process, listing). Parallel: Grow revenue (scaling matters), improve unit economics (margins), diversify customer base (reduce concentration risk). Requirement: Show 3 years of growth (accelerating or stable profitability, <100% growth not necessary but preferred). Avoid: Going public on upslope (growth slowing, churn rising, customer concentration >30%).",
      "Alternatives to IPO: Direct listing (no underwriter, cheaper, faster, but only for pre-IPO track record). SPAC (special purpose acquisition company, faster, more control, but reputational risk). Stay private (grow profitably, use debt for capital needs). Timing: IPO when: Growth story clear (investors understand value), market receptive (SaaS IPO window open), business ready (systems, controls). Avoid: Going public in bear market (bad timing), when growth decelerating (market punishes), during market downturns (hard to raise capital)."
    ],
    content: [
      {
        heading: "Preparing for an IPO",
        body: `Understanding the path to going public.

**IPO readiness checklist**

Financial requirements:
- Revenue: £100M+ (US standard, £50M+ for UK/EU)
- Profitability path: Not required profitable, but trajectory matters (growth rate, EBITDA margin)
- Audited financials: 3+ years (SOX 404 compliant)
- Diversification: Top 10 customers <70% revenue, no single >20%
- Working capital: Stable or improving (show efficiency)

Governance requirements:
- Board: Majority independent directors (5+ directors typical)
- Audit committee: All independent directors, financial expert
- Compensation committee: Independent, oversee exec pay
- Nominating committee: Independent, board composition
- Conflicts policy: Clear conflict resolution
- Whistle-blower policy: Anonymous reporting mechanism

Infrastructure requirements:
- Finance team: CFO, controller, FP&A (dedicated, not shared)
- Audit capability: Auditor-ready (clean books, documentation)
- Systems: ERP, accounting software (Salesforce, NetSuite, etc.)
- Controls: SOX 404 framework (internal controls documented, tested)

Timeline to readiness:
| Year | Focus | Milestones |
|---|---|---|
| Year 1 | Foundation | Audit-ready financials, independent board, hire CFO |
| Year 2 | Systems | SOX 404 framework, internal controls, draft prospectus |
| Year 3 | Execute | Roadshow, underwriters, listing process |

**IPO process and timeline**

Phase 1: Preparation (6-12 months before filing)
- Underwriter: Select investment bank (Goldman, Morgan Stanley, etc.)
- Legal: SEC counsel (prepare for SEC review)
- Audit: Continue auditor relationship (will audit public company)
- Communications: Plan messaging for public markets

Phase 2: Registration (4-6 months)
- S-1 filing: Submit prospectus to SEC
- SEC review: Back and forth on disclosure (2-3 rounds typical)
- Pricing: Underwriter determines price range
- Quiet period: No marketing (regulatory restriction)

Phase 3: Roadshow (2-4 weeks)
- Meetings: CEO/CFO meet institutional investors
- Feedback: Investors ask questions, provide feedback
- Demand: Gauge interest, adjust pricing

Phase 4: Pricing and listing (1 week)
- Final pricing: Set IPO price (underwriter, company, market conditions)
- Listing: Stock trades on exchange (Nasdaq, NYSE)
- First day: Volatility (often pops 10-30%)

Total timeline: 12-18 months from decision to listing

**Costs and considerations**

Direct costs:
- Underwriter fees: 3-7% of proceeds (£100M IPO = £3-7M cost)
- Legal fees: £1-5M (SEC counsel, corporate counsel)
- Audit fees: £500K-1M (IPO audit)
- Printing/miscellaneous: £500K

One-time costs: £5-15M typical

Ongoing costs (annual):
- Audit: £300-500K/year (increased from private)
- Sarbanes-Oxley 404: £200-500K/year
- SEC compliance: £100-200K/year (investor relations)
- Insurance (D&O): £1-3M/year
- Total: £600K-1.2M additional annually

Benefit:
- Capital raised: £100M-500M+ depending on IPO size
- Liquidity: Founders can sell shares (unlock value)
- Currency: Use stock for acquisitions (no cash outlay)
- Credibility: Public company status (enterprise sales benefit)

**Alternatives to IPO**

Direct listing:
- No underwriter (cheaper, 1-2% cost vs 3-7%)
- No secondary offering (no new capital raised, just existing share trading)
- Faster (6-9 months vs 12-18 months)
- Best for: Companies pre-IPO ready (already valued, don't need capital)

SPAC:
- Special purpose acquisition company (pool of capital raises money then acquires company)
- Faster than IPO (6-12 months)
- More control (negotiate terms directly, not underwriter)
- Risks: SPAC reputation (flash valuations, underperformance), investor backlash
- Best for: Company wants speed, willing to accept SPAC baggage

Stay private:
- Growth + profitability (prove economics)
- Debt financing (borrow instead of equity)
- Dividend recaps (take profit without going public)
- Best for: Not growth obsessed, prefer privacy, can bootstrap

`
      }
    ],
    relatedSlugs: ["financial-planning-and-budgeting", "board-governance-and-fiduciary-duties", "due-diligence-preparation-for-investment"],
    faq: [
      { q: "When should I consider going public?", a: "Requirements: £100M+ revenue (US), 3+ years audited financials, path to profitability or clear growth trajectory. Timing: When growth story clear (investors understand), market receptive (SaaS IPO window), business ready (systems, controls). Avoid: Going public when growth decelerating, customer concentration high (>30%), or market downturn." },
      { q: "How long does IPO preparation take?", a: "Typical: 12-18 months from decision to listing. Phases: Preparation (6-12 mo), SEC review (4-6 mo), roadshow (2-4 weeks), pricing/listing (1 week). Critical: Build systems/controls early (Year 1), file Year 2, list Year 3." },
      { q: "What are IPO costs?", a: "One-time: Underwriters (3-7% of proceeds), legal (£1-5M), audit (£500K-1M), printing (£500K) = £5-15M total. Ongoing: Audit (£300-500K/year), SOX 404 (£200-500K/year), compliance (£100-200K/year) = £600K-1.2M annually. Benefit: Capital raised (£100M+), liquidity, credibility." }
    ],
    videoUrl: ""
  }
];

export default batch265Articles;