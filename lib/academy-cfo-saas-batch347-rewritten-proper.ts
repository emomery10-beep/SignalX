import { AcademyArticle } from "@/types/academy";

export const batch347Articles: AcademyArticle[] = [
  {
    slug: "exit-strategy-and-acquisition-preparation",
    title: "Exit Strategy and Acquisition Preparation: Planning for Growth Outcomes",
    description: "Master exit planning. Prepare for acquisition, optimize value, plan ahead.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["exit strategy", "acquisition", "company valuation", "exit planning", "acquisition preparation"],
    keyTakeaways: [
      "Exit types: (1) Acquisition (buy by larger company, £10-1000M+ depending on size), (2) IPO (go public, £200M+ typical), (3) Management buyout (team buys back). Most common: Acquisition (90% of startups). Timeline: 5-10 years typical (build to £10-100M ARR, then acquired). Valuation: Revenue multiple (£50M revenue, 3x = £150M valuation). Factors: Growth, margins, retention, team quality, market.",
      "Acquisition-friendly best practices: (1) Keep books clean (audit-ready, organized), (2) Customer concentration low (no single customer >20%), (3) Key team in place (can run without founder), (4) Long contracts (2+ year = predictable), (5) No technical debt (code maintainable). Benefit: Easier to acquire (lower risk), higher valuation (less cleanup needed). Cost: Time to implement (1-2 years of discipline).",
      "Acquisition process: (1) Inbound (acquirer approaches) or outbound (you shop to acquirers), (2) NDA (confidentiality), (3) LOI (letter of intent, terms), (4) Due diligence (4-12 weeks, deep review), (5) Legal (lawyers negotiate), (6) Close (money, integration). Timeline: 6-12 months typical. Outcome: Usually earn-out (50% at close, 50% if hitting targets post-acquisition)."
    ],
    content: [
      {
        heading: "Planning Exit Strategies and Preparing for Acquisition",
        body: `Building company value and preparing for potential acquisition or exit.

**Exit fundamentals**

Exit definition:
- Founders and investors realize returns
- Company either acquired, goes public, or sold to team
- Timeline: Usually 5-10 years post-funding

Exit types:

Type 1: Acquisition (most common)
- Larger company buys you
- Valuation: £10-1000M+ depending on size
- Payment: Cash (or mix of cash + stock)
- Timeline: 6-12 months process
- Outcome: Team joins acquirer, usually earn-out (50% at close, 50% if hit targets)

Type 2: IPO (public offering)
- Company goes public
- Requires: £200M+ revenue typical, proven profitability, public market readiness
- Timeline: 10+ years typical (build to scale first)
- Outcome: Stock traded publicly, founders can sell shares

Type 3: Management buyout
- Team buys back company from investors
- Usually: VCs want exit, team wants to keep company
- Complex: Requires financing, usually private equity help

Type 4: Dividend/extension
- Company never exits
- Profitable, paying dividends to founders and investors
- Outcome: Ongoing business (no liquidity event)

**Valuation basics**

Acquisition valuation (typical multiples):

| Company size | Revenue multiple | Example |
|---|---|---|
| Early (£1-5M) | 5-10x | £5M revenue = £25-50M valuation |
| Growth (£5-50M) | 3-5x | £20M revenue = £60-100M valuation |
| Scale (£50M+) | 2-3x | £100M revenue = £200-300M valuation |

Factors affecting multiple:
- Growth rate (higher growth = higher multiple)
- Margins (higher margin = more valuable)
- Retention (lower churn = more valuable, more predictable)
- Team (strong team = higher multiple)
- Market (hot market = higher multiple)

Example valuation:

Company: £20M ARR, 50% growth, 75% margin, 5% churn, strong team

Multiple: 4x (base) + 1x (growth premium) + 0.5x (team/market) = 5.5x
Valuation: £20M × 5.5x = £110M

Breakdown might be:
- £60M cash at close (55%)
- £50M earnout if hit targets (45%)
- 4-year earnout (hit £30M ARR at year 3, keep 5% churn)

**Acquisition-friendly best practices**

Practice 1: Clean books

Requirements:
- Audited financials (or clean accounting records)
- Clear revenue recognition (easy to verify)
- Minimal legal issues (no lawsuits, compliance good)
- Well-organized contracts (easy to review)

Benefit:
- Faster due diligence (lower risk for acquirer)
- Higher valuation (less cleanup needed post-acquisition)

Action:
- Hire accountant early (start with clean records)
- Monthly close (not quarterly or annual)
- Keep organized files (contracts, financial records)

Practice 2: Low customer concentration

Current: Top 3 customers = 50% of revenue (risky, concentration risk)
Better: Top 3 customers = 20-30% of revenue

Strategy:
- Diversify customer base (don't over-rely on few)
- Long customer contracts (reduces risk of loss)
- Target: No single customer >15-20% of revenue

Benefit: Valuation doesn't have concentration discount (lower risk)

Practice 3: Key person independence

Risk: Company dependent on founder (if founder leaves, company struggles)

Better: Processes and team in place
- CEO can take vacation (team runs things)
- CTO can move on (tech team maintains product)
- Sales lead can leave (sales processes, documentation)

Benefit: Acquirer confidence (company runs without founder)

Practice 4: Long-term contracts

Current: Monthly contracts (customers can leave)
Better: Annual or multi-year contracts

Benefit:
- Revenue more predictable (contracts lock in)
- Churn reduced (cost to leave)
- Valuation higher (more certainty)

Strategy:
- Offer discount for annual commitment (e.g., 10%)
- Target: 50%+ of revenue on annual+ contracts

Practice 5: Minimal technical debt

Clean code:
- Well-documented
- Tested (automation, not manual)
- Maintainable (new people can understand)

Benefit:
- Easier integration (acquirer's team can work on code)
- Lower integration risk (fewer unknowns)
- Higher valuation (less cleanup work)

Action:
- Code reviews (maintain quality)
- Testing (comprehensive test coverage)
- Documentation (onboarding new engineers)

**Acquisition process**

Phase 1: Inbound or outbound (3-6 months)

Inbound:
- Acquirer approaches (usually strategic fit)
- Example: Slack acquired Soundwave (audio team), Stripe acquired TaxJar (tax integration)

Outbound:
- Company shops to acquirers (investment banker, direct outreach)
- Usually: When company wants exit, or board pressures exit

Outcome: Acquirer interested, ready to explore

Phase 2: NDA and initial discussion (1-2 months)

NDA (Non-Disclosure Agreement):
- Acquirer signs, can't share info publicly
- Mutual: Both parties confidential

Initial discussion:
- High-level overview (business model, growth, market)
- Valuation expectation (range you're comfortable with)
- Interest: Does acquirer still interested?

Outcome: Both parties willing to proceed to next phase

Phase 3: LOI (Letter of Intent) (2-4 weeks)

LOI:
- Non-binding document (outlines deal terms)
- Key terms:
  - Purchase price (valuation, structure: cash/stock/earnout)
  - Representations (what we're representing as true)
  - Conditions: What needs to be true to close
  - Timeline: When would close happen

Negotiation:
- Back-and-forth on key terms
- Usually: 3-5 iterations before agreement

Outcome: Both parties agree to terms, sign LOI

Phase 4: Due diligence (6-12 weeks)

Acquirer reviews:
- Financial records (audit, verify revenue, expenses)
- Legal documents (contracts, IP, litigation)
- Customer contracts (review for change of control clauses)
- Technology (code, infrastructure, security)
- Team (background checks, key person contracts)
- Market (competitive position, TAM)

Data room:
- Organized files (contracts, financials, customer list, code access)
- Regular access (provide documents as requested)
- Responsiveness (answer questions quickly)

Timeline:
- Light acquisition: 6-8 weeks (straightforward)
- Heavy acquisition: 12-16 weeks (complex, many questions)

Outcome: Acquirer confident in business, ready to negotiate final terms

Phase 5: Legal and negotiation (8-12 weeks)

Lawyers involved:
- Your lawyer (protect your interests)
- Acquirer's lawyer (protect their interests)

Key negotiation points:
- Purchase price (earn out? Any holdbacks?)
- Reps and warranties (what do we guarantee?)
- Indemnification (who covers if claims?)
- Earn-out terms (when do we get rest of money?)
- Non-compete (can founders compete after?)

Outcome: Legal agreement signed (both parties)

Phase 6: Close (1-2 weeks)

Final steps:
- Wire transfer (cash transfer)
- Equity transfer (stock ownership transfer)
- Employee agreements (transition, retention bonuses)
- Integration planning (how does team join acquirer?)

Timeline: Fast (usually 1-2 weeks of final paperwork)

Outcome: Deal closed, founders exit, team joins acquirer

**Earnout structure**

Example earnout:

Purchase price: £100M
- At close: £60M cash (60%)
- Earnout: £40M (40%)

Earnout terms:
- Duration: 4 years post-close
- Targets: Hit revenue and profitability targets

Year 1-2: Keep growing
- Revenue £25M (target), hit = £5M earnout
- Churn <5%, hit = £5M earnout
- Total possible Year 1-2: £10M earnout

Year 3-4: Profitability
- Revenue £40M (target), hit = £15M earnout
- EBITDA margins >20%, hit = £5M earnout
- Total possible Year 3-4: £20M earnout

Total: £100M - £60M cash at close + potential £40M earnout = £100M

Key: Earnout depends on achieving targets (risk/reward)

**Post-acquisition considerations**

Integration:
- Team joins acquirer (different culture, systems)
- Product roadmap changes (acquirer's priorities)
- Founder role (may be advisory, maybe leaves)

Earn-out risk:
- Team dispersion (people leave post-acquisition)
- Strategy mismatch (acquirer changes direction)
- Target miss (harder to hit if not aligned)

Golden handcuffs:
- Earnout locks in team (financial incentive to stay)
- But can create resentment (if targets unrealistic)

**Common acquisition mistakes**

Mistake 1: Not preparing early
- Problem: Approached by acquirer, unprepared (messy books, legal issues)
- Fix: Prepare years before (clean systems, organized files)
- Impact: Higher valuation (lower risk)

Mistake 2: Unrealistic valuation expectations
- Problem: Expect 10x multiple when market pays 3x
- Fix: Research comps (similar acquisitions, multiples paid)
- Impact: Realistic negotiation, deal closes

Mistake 3: Concentrated customer risk
- Problem: Top 3 customers = 60% of revenue
- Fix: Diversify (reduce concentration to <25%)
- Impact: Valuation higher (lower risk)

Mistake 4: No legal/accounting prep
- Problem: Discover legal issues during due diligence (delays, lower valuation)
- Fix: Clean up issues before acquisition (IP, contracts, compliance)
- Impact: Faster closing, higher valuation

`
      }
    ],
    relatedSlugs: ["financial-planning-and-budgeting", "due-diligence-preparation-for-investment", "investor-relations-and-stakeholder-communication", "cap-table-management-and-equity-tracking", "metrics-dashboard-design-kpi-tracking"],
    faq: [
      { q: "What's a typical exit timeline?", a: "Typical: 5-10 years post-founding (or post-funding). Most common: Acquisition (90% of startups). Process: 6-12 months (inbound interest → NDA → LOI → due diligence 6-12 weeks → legal → close). Exit types: Acquisition (90%), IPO (rare, 200M+ revenue), management buyout (1%). Valuation: 3-5x revenue typical (depends on growth, margins, team)." },
      { q: "How do I prepare for acquisition?", a: "Best practices: (1) Clean books (audited, organized), (2) Low customer concentration (no single customer >20%), (3) Key person independence (runs without founder), (4) Long-term contracts (2+ years, predictable), (5) Minimal tech debt (code clean, maintainable). Cost: Time and effort (1-2 years). Benefit: Higher valuation (lower risk), faster due diligence." },
      { q: "What happens in the acquisition process?", a: "Process: (1) Inbound interest or outreach, (2) NDA (confidentiality), (3) LOI (letter of intent, terms), (4) Due diligence (6-12 weeks, full review), (5) Legal (lawyers negotiate), (6) Close (1-2 weeks, money transfer). Typical: 6-12 months total. Payment structure: Often 60% at close, 40% earnout (if hit targets post-acquisition). Risk: Earnout depends on achieving targets." }
    ],
    videoUrl: ""
  }
];

export default batch347Articles;
