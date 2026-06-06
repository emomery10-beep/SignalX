import { AcademyArticle } from "@/types/academy";

export const batch115Articles: AcademyArticle[] = [
  {
    slug: "exit-planning-m-a-preparation",
    title: "Exit Planning and M&A Preparation: Preparing Your Company for Acquisition or IPO",
    description: "Master exit planning. Prepare your company for acquisition or IPO. Understand what acquirers look for and how to maximize valuation.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "exit planning",
      "M&A preparation",
      "acquisition",
      "IPO preparation",
      "company valuation",
      "due diligence",
      "acquisition readiness",
      "data room",
      "cap table",
      "investor relations"
    ],
    keyTakeaways: [
      "Acquirer metrics: look at revenue (£10M+ target most), growth (30%+ YoY preferred), profitability (path to profitability matters more than current profit), NRR (expansion signal), customer concentration (want diversified, <30% top 3), quality of metrics (audited financials, clean reporting). Example: £50M revenue, 40% growth, 120% NRR, £1B valuation = strong acquisition target (multiple markets want it)",
      "IPO readiness: £100M+ revenue (rare <that), 3 years audited financials, public company infrastructure (CFO, audit committee, compliance), clean financials (predictable growth, margins improving), market demand (investor appetite), no major risks (concentration, litigation, tech debt). IPO path: Take VC funding (£20-50M Series C/D), profitability or clear path (break-even by IPO), then work with bankers on S-1 filing (9-12 month process)",
      "Acquisition value: Multiple calculation: (revenue × acquisition multiple) + product synergies − liabilities; example: £50M revenue × 8x = £400M + £50M synergies − £10M debt = £440M valuation. Multiples vary by buyer (financial buyers 5-7x, strategic 8-15x), growth (50%+ growth gets higher multiples), profitability (profitable gets higher multiples). Prepare data room with 3 years documents (financials, contracts, legal, IP)"
    ],
    content: [
      {
        heading: "Exit Planning and Valuation",
        body: `Exit planning means preparing your company for either acquisition or IPO.

**Types of Exits**

Exit 1: Acquisition (Strategic)

Buyer: Large company in your space or adjacent
Valuation: 8-15x revenue (depends on growth, profitability)
Timeline: 6-12 months from first conversation to close
Process: LOI (letter of intent) → Due diligence → Negotiation → Close
Payoff: Founders get cash/stock, employees get retention packages

Example:
- Acquired company: £50M revenue, 40% growth, 120% NRR
- Buyer (strategic): £400M revenue, wants to consolidate space
- Valuation: £50M × 10x = £500M
- Acquirer synergies: Eliminate duplicate costs (£50M estimated)
- Total value to buyer: £550M − £500M paid = £50M synergies
- Closing: 9 months, founders lead process with bankers

Exit 2: Acquisition (Financial)

Buyer: Private equity firm, looking for cash returns
Valuation: 5-8x revenue (lower than strategic)
Timeline: 4-9 months
Process: Similar to strategic but with more focus on cash flow
Payoff: Founders get cash, PE often wants founders to stay 2-3 years for earnout

Example:
- Acquired company: £30M revenue, 25% growth, profitable (£5M EBITDA)
- Buyer (PE firm): Looking for 3-5x cash-on-cash return
- Valuation: £30M × 6x = £180M
- PE plans: Cut costs, improve margins, resell in 5 years
- Earnout: If hit growth targets, founders get additional £20M

Exit 3: IPO (Initial Public Offering)

Buyer: Public capital markets (investors buy public stock)
Valuation: Market cap based on public market comparables
Timeline: Very long (2-3 years prep, then 6-9 months IPO process)
Requirements: £100M+ revenue, public company infrastructure
Process: Hire bankers, file S-1, roadshow, IPO pricing, trading

Example:
- Company: £150M revenue, 30% growth, £15M EBITDA, £50M cash
- IPO comparable multiples: 8-12x revenue (Salesforce, Workday precedent)
- IPO valuation: £150M × 10x = £1.5B
- Shares outstanding: 100M (fully diluted)
- Price per share: £15 (£1.5B ÷ 100M)
- Founder ownership: 20% = £300M value (was £0 pre-funding)

**Factors Acquirers Look For**

Revenue and Growth:
- Minimum: £10-20M revenue (depends on buyer)
- Growth: 30%+ YoY preferred (shows traction)
- Predictability: Revenue should be recurring (SaaS ideal)
- Quality: Organic growth better than one-time deals

Example: Two companies, £50M revenue
- Company A: 50% growth, recurring SaaS → higher valuation
- Company B: 10% growth, project-based → lower valuation

NRR (Net Revenue Retention):
- >100% NRR = expansion revenue (very attractive)
- 100% NRR = flat (acceptable)
- <100% = declining (red flag)

Example: NRR 120%
- Shows customers expanding (happy, locked-in)
- Signals recurring revenue quality
- Predicts growth will continue

Unit Economics:
- CAC Payback: <12 months (ideally <6)
- LTV/CAC: >3x (ideally >5x)
- Churn: <5% monthly (ideally <2%)

Example: Strong unit economics
- CAC: £5K
- LTV: £50K (10x CAC, excellent)
- Payback: 2.4 months (very fast)
- Churn: 2% monthly

Customer Concentration:
- Top 3 customers should be <30% of revenue (ideally <20%)
- Avoid single customer >20% (acquisition risk if customer leaves)

Profitability:
- Not required (many acquirers take losses)
- Path to profitability matters (shows unit economics work)
- Margins should be improving (operating leverage)

Example:
- Year 1: £50M revenue, −10% margin (acceptable for growth)
- Year 2: £70M revenue, 0% margin (improving)
- Year 3: £100M revenue, +10% margin (clearly profitable)
- This trajectory shows path to profitability

Team:
- Strong CEO and management team
- Experienced CFO and leadership
- Deep domain expertise
- Low key-person risk (not dependent on one person)

Technology and IP:
- Proprietary tech/algorithm
- Patents (if valuable)
- No tech debt (clean code)
- IP clearly owned by company

Culture:
- Low turnover (happy employees)
- Strong company values
- Diversity and inclusion

Legal/Compliance:
- No major litigation
- GDPR/compliance compliant
- Clean cap table (no messy investor relations)
- IP ownership documented

**Preparing for Exit**

1-2 Years Before Target Exit:

Q1-2: Build foundation
- Hire experienced CFO
- Implement strong financial controls
- Get audited financials
- Clean up cap table (resolve any issues)
- Document all IP (who owns what)

Q3-4: Financial preparation
- Build 3 years audited financials
- Build detailed unit economics model
- Build customer contract repository
- Document customer concentration
- Build metrics dashboard (what acquirers will see)

6 Months Before:

Q1: Organize legal
- IP audit (do you own all your technology?)
- Litigation review (any pending lawsuits?)
- Material contracts review (any deal-killers?)
- Regulatory compliance review (GDPR, data protection, etc.)

Q2: Build data room
- Organize by section:
  - Financial (P&L, balance sheet, cash flow, 3 years)
  - Unit economics (CAC, LTV, payback, churn)
  - Customers (list, contracts, net retention)
  - Employees (org chart, equity, employment contracts)
  - IP (patents, trademarks, code ownership)
  - Legal (litigation, compliance, major contracts)
  - Meetings (board minutes, cap table, investor materials)
- Digitize everything (PDF, standardized naming)
- Make easily searchable (good data room gets 90%+ document requests answered in <1 hour)

3 Months Before:

- Hire investment banker (M&A advisor)
- Banker creates "pitch book" (overview of company, market, growth)
- Banker creates target list (potential acquirers)
- Prepare management to answer diligence questions
- Get liability insurance (reps and warranties insurance)

**Valuation Calculation**

SaaS acquisition multiple: 5-15x revenue (depends on buyer type)

Example:

Company metrics:
- Revenue: £50M
- Growth: 40% YoY
- NRR: 120%
- Churn: 2% monthly
- Profitability: +15% EBITDA margin (£7.5M)
- CAC Payback: 8 months
- Top 3 customers: 20% of revenue

Acquirer analysis:
- Strategic buyer (large company) values growth + NRR high
- Multiple: 10x revenue (premium for growth + NRR)
- Base valuation: £50M × 10 = £500M

Adjustments:
- Profitability premium: +10% (add £50M)
- Concentration discount: −5% (slight concern)
- Adjusted: £495M

Synergies:
- Eliminate duplicate costs: £10M EBITDA savings
- Cross-sell opportunity: £5M annual revenue uplift
- Synergy value: £15M × 5x = £75M

Total value to buyer: £495M + £75M = £570M
Final negotiated price: £520M (split synergies)

**Earnout Structure**

Often, acquisition not all cash at close. Instead:

Cash at close: £400M
Earnout: £120M (if achieve targets)

Earnout targets (next 2 years):
- Revenue: £100M (from £50M) = +100% growth
- NRR: Maintain >110%
- Churn: Stay below 3% monthly
- Team retention: Keep 90% of employees

If hit all targets: Get full £120M earnout (total £520M)
If miss revenue: Get £90M earnout (total £490M)
If hit some targets: Pro-rata earnout

Earnout aligns seller and buyer (seller motivated to execute post-close).

**Exit Timeline**

12 months pre-exit: Strategic planning
6 months pre-exit: Legal, data room, banker hiring
3 months pre-exit: Management preparation, pitch book
0-6 months: Buyer conversations, LOI, due diligence
6-9 months: Final negotiation, legal docs, closing

IPO timeline (much longer):
- Year 1: Decide to go public, hire bankers
- Year 2: Prepare financials, hire CFO, build public company infrastructure
- Year 3: S-1 filing (regulatory process), roadshow, IPO pricing

**Common Exit Mistakes**

Mistake 1: Too much customer concentration
- Problem: 40% of revenue from one customer
- Impact: Major valuation discount or acquirer non-interest
- Fix: Diversify customer base 2-3 years before exit

Mistake 2: Weak financial controls
- Problem: Auditors find issues, financials not reliable
- Impact: Delayed close, valuation hit
- Fix: Implement strong controls 1-2 years before exit

Mistake 3: Key person dependency
- Problem: CEO owns the relationships, not scalable
- Impact: Acquirer concerned about retention
- Fix: Build strong management team, reduce CEO dependency

Mistake 4: Messy cap table
- Problem: Complex investor agreements, disputes
- Impact: Legal complications, delayed close
- Fix: Resolve cap table issues 1-2 years before exit

Mistake 5: Picking wrong buyer
- Problem: Chose buyer willing to pay most, but cultural misfit
- Impact: Earnout targets missed (buyer changes strategy)
- Fix: Pick buyer aligned with company values/strategy, not just price

**After the Exit**

Retention agreements:
- Management usually stays 2-3 years post-close
- Earnout incentivizes performance
- Stock options may have acceleration (good for employees)

Post-close integration:
- Acquirer integrates product, go-to-market, operations
- Former founders often take new role in larger company
- Many found the post-close slower than expected

Founder life after exit:
- Small exits (£50-100M): Founders often invest in other startups
- Large exits (£500M+): Founders often start new company, take advisory roles
- IPO: Often founders stay as CEO (public company benefits)

Exit planning is the endgame of building a company. Do it right, and everyone wins.
`
      }
    ],
    relatedSlugs: [
      "m-a-acquisition-strategy",
      "saas-valuation-and-multiples",
      "funding-and-investment-strategy",
      "board-reporting-investor-communications",
      "financial-controls-audit-readiness"
    ],
    faq: [
      {
        q: "What's a typical SaaS acquisition multiple?",
        a: "5-15x revenue depending on buyer and growth. Strategic buyers pay 8-15x, financial buyers pay 5-8x. Higher growth (50%+) and higher NRR (120%+) command premium multiples."
      },
      {
        q: "What do acquirers look for in due diligence?",
        a: "Revenue and growth, unit economics, customer concentration, profitability/path to profitability, team, IP ownership, legal issues, financial controls. Clean data room helps close deals faster."
      },
      {
        q: "Should I prepare for exit from day one?",
        a: "Yes. Clean cap table, strong financials, clear IP ownership, documented customer contracts. These are good practices anyway, but essential for exit. Start 1-2 years before target exit."
      },
      {
        q: "Is an earnout common in acquisitions?",
        a: "Yes, especially for smaller deals. Often 30-50% of deal is earnout (paid if targets hit). Aligns seller incentives with buyer post-close execution."
      }
    ],
    videoUrl: ""
  }
];

export default batch115Articles;
