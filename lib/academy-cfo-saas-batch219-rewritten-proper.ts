import { AcademyArticle } from "@/types/academy";

export const batch219Articles: AcademyArticle[] = [
  {
    slug: "public-company-readiness-and-ipo-preparation",
    title: "Public Company Readiness and IPO Preparation: Preparing for Going Public",
    description: "Master IPO preparation. Build compliant operations, plan public readiness, understand requirements.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["IPO", "public company", "SEC", "sarbanes-oxley", "compliance", "governance", "audit", "disclosure", "financial reporting", "registration"],
    keyTakeaways: [
      "IPO readiness timeline: 3-5 years before IPO, start compliance build. IPO timeline: 12-18 months S-1 to listing. Requirements: (1) Financial (3 years audited, SOX 404), (2) Governance (independent board, audit committee, 50% independent directors), (3) Size (£100M+ revenue or £1B+ valuation typical), (4) Profitability (not required, but expected >20% gross margin, path to profitability). Cost: £10-30M (underwriting fees, legal, audit, compliance). Timeline: After Series D/E (£10-50M fundraised). Decision: IPO vs staying private (Stripe, Figma chose private longer) vs acquisition (most exits).",
      "Financial audit requirements (SOX): Auditor attests to internal controls (404), financial statements audited by Big 4 firm (KPMG, Deloitte, EY, PwC). Cost: £500K-2M annually (depends on complexity). Quarterly reporting: 10-Q (filing with SEC within 45 days of quarter), Annual: 10-K (filing within 60 days of year-end). Requirements: Certification by CEO/CFO (criminal liability if false), MD&A (management discussion of results), Risk factors (what could go wrong), Executive compensation disclosure. Burden: Significant (distracts management, costs).",
      "Private companies longer: Stripe (£80B valuation, staying private), Figma (£10B, private), DuckDuckGo (private). Rationale: Avoid regulatory burden, maintain control, easier capital raises. Alternative: Secondary market (Forge, EquityZen) = liquidity without IPO. Conclusion: IPO no longer only path to success. Evaluate: Do you want public markets, or can you raise private capital, or sell, or stay bootstrapped?"
    ],
    content: [
      {
        heading: "IPO Requirements and Preparation",
        body: `Understanding public company readiness.

**IPO eligibility**

Size thresholds:
- Revenue: £100M+ typical (some <£100M IPO, but rare)
- Profitability: Not required, but 20%+ gross margin expected
- Valuation: £1B+ (market confidence in growth)
- Cash: £50M+ (cover costs, working capital)

Governance:
- Board: 50%+ independent directors (at least 3)
- Audit committee: All independent, financial expert required
- Compensation committee: All independent, review executive pay
- Nominating committee: All independent, recruit board members

Financial controls (SOX 404):
- Documented processes (all key controls documented)
- Testing (auditor tests controls operate effectively)
- Attestation: CFO certifies controls effective (criminal liability)

**Timeline and process**

Phase 1: Preparation (12 months before S-1 filing)
- Hire investment bank (Goldman, Morgan Stanley, etc.)
- Audit firm engagement (Big 4: KPMG, Deloitte, EY, PwC)
- Build financial controls (document processes)
- Legal review (contracts, litigation, IP)

Phase 2: Registration (6-9 months)
- Draft S-1 (registration statement, 100-200 pages)
- SEC comments (back-and-forth, typically 2-3 rounds)
- Refine financials (auditor finalizes)
- Road show (CEO/CFO pitch to investors)

Phase 3: Pricing and listing (2-4 weeks)
- Determine offer price (investment bank, supply/demand)
- Pricing meeting (final decision)
- Trading begins (stock listed, lock-up 180 days)

**Cost and burden**

Upfront costs:
- Investment banker: 3-7% of offer proceeds (if raise £100M, pay £3-7M)
- Legal: £2-5M (SEC counsel, local counsel)
- Audit: £1-2M (big 4 audit, controls testing)
- Compliance: £1-2M (policies, training, systems)
- Total: £10-30M (significant, but worth if raise £100M+)

Ongoing costs (annual):
- Audit: £1-2M (now Big 4 required)
- Disclosure: £500K (legal, investor relations)
- Compliance: £1M+ (regulatory, HR, finance roles)
- Total: £2.5-5M annually

Burden:
- Public reporting (10-Q quarterly, 10-K annual)
- Earnings calls (explain results to analysts)
- Investor relations (manage shareholder expectations)
- Board meetings (quarterly, more formal)
- Risk disclosure (must disclose all risks)

Opportunity:
- Currency for M&A (use stock, don't cash)
- Liquidity (employees can sell, retention easier)
- Brand (credibility, prestige)
- Capital (no equity dilution for growth funding)

**Going public decision**

When to IPO:
- If want to acquire with stock (currency advantage)
- If need unlimited capital (public markets deeper than private)
- If want employee liquidity (they can sell)

When NOT to IPO:
- If profitable, don't need capital (Stripe, Figma choice)
- If want control (private easier, fewer stakeholders)
- If regulatory burden too high (certain industries)
- If prefer stable (private less scrutiny)

Alternatives to IPO:
- Stay private (raise from private equity, growth capital)
- Secondary market (Forge, EquityZen, insider liquidity without IPO)
- Acquisition (exit event, founders/employees get liquidity)
- Bootstrap (self-funded, no outside capital)

`
      }
    ],
    relatedSlugs: ["exit-planning-and-m-and-a-preparation", "financial-controls-and-audit-readiness", "board-reports-and-financial-statements"],
    faq: [
      {
        q: "What's the minimum size to IPO?",
        a: "Typical: £100M+ revenue, £1B+ valuation. Some <£100M IPO (rare, special circumstances). Requirements: 3 years audited financials, SOX 404 controls, 50%+ independent board, path to profitability (or strong growth story). Cost: £10-30M. Consider: Not all profitable or fast-growing companies should IPO (Stripe staying private at £80B valuation)."
      },
      {
        q: "How long does IPO process take?",
        a: "Total: 18-24 months (preparation 12 months, registration 6-9 months). S-1 to listing: 3-4 months typical. Depends on: SEC review rounds (usually 2-3), market conditions (easy markets faster), complexity of business. Lock-up: 180 days after listing (can't sell insider shares). Continued reporting: Annual 10-K, quarterly 10-Q."
      },
      {
        q: "What are the ongoing costs and burdens?",
        a: "Annual costs: £2.5-5M (audit, legal, compliance, investor relations). Burden: Quarterly earnings calls, 10-Q / 10-K filings, board oversight, risk disclosure. Transparency: All material facts disclosed (can't hide). Advantage: Currency for M&A (use stock), liquidity for employees, credibility. Disadvantage: Regulatory burden, short-term focus (quarterly earnings pressure)."
      },
      {
        q: "Should I stay private or go public?",
        a: "Stay private if: Profitable, don't need capital (save £10-30M upfront cost). Advantages: Control, less scrutiny, flexibility. Go public if: Want stock currency (M&A), need unlimited capital, want employee liquidity. Trends: More unicorns staying private longer (Stripe £80B, Figma £10B, staying private). Alternative: Secondary market for employee liquidity without IPO."
      }
    ],
    videoUrl: ""
  }
];

export default batch219Articles;
