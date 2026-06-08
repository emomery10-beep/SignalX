import { AcademyArticle } from "@/types/academy";

export const batch172Articles: AcademyArticle[] = [
  {
    slug: "exit-planning-and-m-and-a-preparation",
    title: "Exit Planning and M&A Preparation: Preparing Your Company for Acquisition",
    description: "Master exit planning. Prepare for acquisition, understand deal structures, negotiate terms, and maximize valuation.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Advanced",
    readTime: 8,
    keywords: [
      "exit planning",
      "M&A",
      "acquisition",
      "company sale",
      "deal structure",
      "valuation",
      "due diligence",
      "negotiation",
      "earnout",
      "acquisition terms"
    ],
    keyTakeaways: [
      "Exit timeline: Build for exit 3-5 years out (gives time to improve metrics, show growth). 18 months before desired exit, start cleanup (fix financials, improve metrics, document everything). 6 months before, engage advisors (M&A banker, legal). 3 months before, prepare data room (customer contracts, financials, IP docs). Acquirers want: Clean financials (GAAP compliant, audited), strong metrics (growth, churn, CAC, LTV), defensible IP (patents, trademarks), recurring revenue (SaaS = sticky).",
      "Valuation in M&A: Different than VC valuation. Acquirers value based on: Strategic fit (does it fit our business?), synergies (cost savings, cross-sell), multiple of EBITDA or revenue. Example: £2M revenue, 4x multiple (generous for SaaS) = £8M valuation. But add synergies (could save £500K via integration) = £10M valuation. Negotiation: Start high (ask £12M), buyer low (offer £6M), land at £8-9M.",
      "Deal structure: All-cash upfront rare. Typical: 60% upfront at close, 40% earnout (tied to performance). Example: £8M deal = £4.8M at close, £3.2M over 2 years if hit targets. Earnout risk: Buyer controls targets, hard to achieve. Negotiate: Clear targets, accelerated earnout, caps/floors."
    ],
    content: [
      {
        heading: "Preparing for Acquisition",
        body: `Steps to make your company acquisition-ready.

**18 Months Before Exit: Cleanup**

Financial cleanup:
- Ensure GAAP/IFRS compliant accounting (audited preferred)
- Fix any prior issues (restatements, errors)
- Document all revenue contracts (SaaS agreements, licensing)
- Reconcile cash position
- Prepare 3 years of historical financials

Legal cleanup:
- Review and document all customer contracts
- Review and document employee agreements (vesting, IP assignments)
- File all IP (patents, trademarks, copyrights)
- Clean up cap table (resolve any options issues)
- Ensure no litigation/disputes pending

Operational cleanup:
- Reduce customer concentration (no single customer >20% revenue)
- Document all vendor contracts (key person dependencies)
- Ensure HR documentation complete (no employment issues)

Metric improvement:
- Grow revenue (higher valuation)
- Reduce churn (sticky = more valuable)
- Improve margins (more profitable = more valuable)
- Build NRR >110% (expansion = valuable)

**6 Months Before: Data Room**

Prepare buyer data room (secure online folder with all documents):

1. Financials
   - 3-year P&L, Balance Sheet, Cash Flow
   - Monthly financials (last 12 months)
   - Budget and forecast
   - Tax returns

2. Customer information
   - Customer list (name, ARR, contract term, renewal date)
   - Top 20 customers detail
   - Customer contract templates
   - Churn analysis

3. Operations
   - Organizational chart
   - Employee list (names, roles, comp, vesting)
   - Vendor contracts (top 10)
   - Insurance policies

4. Legal and IP
   - Corporate documents (articles, bylaws)
   - IP assignments (patents, trademarks, copyrights)
   - Customer agreements (templates + signed)
   - Employment agreements
   - Litigation summary (if any)

5. Product and tech
   - Product roadmap
   - Tech stack (architecture, databases)
   - Security docs (penetration tests, certifications)
   - Customer onboarding docs

Organize clearly, update monthly.

**3 Months Before: Engage Advisors**

M&A banker:
- Identify potential acquirers
- Run initial meetings (teaser)
- Coordinate due diligence
- Negotiate deal terms
- Close transaction
- Cost: Typically 1-2% of deal value

Legal counsel:
- Review potential acquirer
- Negotiate LOI (letter of intent)
- Prepare definitive agreements
- Handle closing items
- Cost: £50-200K typically

Accountant:
- Prepare financials (audited if possible)
- Tax planning (deal structure tax impact)
- Cost: £10-30K

Total advisor cost: 2-3% of deal value (worth it).

`
      },
      {
        heading: "Deal Structure and Valuation",
        body: `Understanding M&A economics.

**Revenue Multiple Valuation**

Acquirers typically use revenue multiple:

Valuation = Revenue × Multiple

Multiples by business health:
- High growth (>50%), strong churn (<2%), NRR>110%: 4-6x revenue
- Moderate growth (30-50%), healthy churn (2-3%), NRR 100-110%: 2-4x revenue
- Slow growth (<30%), poor churn (>3%), NRR <100%: 1-2x revenue

Example:
- £2M revenue, 40% growth, 2% churn, 105% NRR
- Multiple: 3.5x (middle of range)
- Valuation: £7M

**Synergy Value**

Acquirer willing to pay more if synergies exist:

Example synergies:
- Cost savings: Consolidate data centers (save £300K/year)
- Cross-sell: Sell to existing customer base (£1M/year)
- Revenue uplift: Integrate technology (£2M/year)
- Total synergies: £3.3M/year

Synergy value: Acquirer values at 3x = £9.9M

Added to base valuation:
- Base: £7M
- Synergies: £10M
- Total: £17M (acquirer willing to pay this if synergies real)

Negotiation: You want credit for synergies. Acquirer skeptical (may not realize). Agree on $10-12M.

**All-Cash vs Earnout**

All-cash (rare):
- Full amount at close
- Risk: Buyer cancels deal before close (less likely)
- Benefit: Certainty, no future risk

Earnout (typical):
- 60-70% at close
- 30-40% over 2-3 years tied to hitting targets
- Example: £10M deal = £6M at close, £4M in earnout

Earnout example:
- Target: Hit £3M revenue by end of year 2
- If hit: Get £4M
- If miss by 10% (£2.7M): Get £3M
- If miss by 20% (£2.4M): Get £2M

Risk: Buyer controls business after close, hard to hit targets.

Negotiate earnout:
- Clear, achievable targets (not stretched)
- Automatic earnout (not buyer discretion)
- Maximum discount (clear floor, e.g., 50% minimum)
- Escrow (hold back portion for disputes)

`
      },
      {
        heading: "Due Diligence Process",
        body: `What acquirers investigate.

**Financial Due Diligence**

Acquirer investigates:
- Revenue recognition (is revenue real and recurring?)
- Customer concentration (no single customer >20%)
- Churn (are customers sticky?)
- Unit economics (CAC, LTV, payback)
- Gross margin (healthy or declining?)
- Burn rate (path to profitability?)

Red flags:
- Revenue from non-recurring sources (one-time deals)
- Customer concentration (loss of top customer = problem)
- High churn (indicates issues)
- Weak unit economics (can't scale profitably)
- Rising burn (accelerating toward insolvency)

How to prepare:
- Document revenue (which is recurring, which one-time)
- Show customer retention (cohort analysis)
- Show improving unit economics
- Show path to profitability

**Legal Due Diligence**

Acquirer investigates:
- IP ownership (do you own the patents/code?)
- Customer contracts (any issues, cancellation rights?)
- Employee agreements (vesting, IP assignments)
- Litigation (any lawsuits or disputes?)
- Regulatory compliance (licenses, certifications)

Red flags:
- IP disputes (someone claims they own your tech)
- Customer cancellation clauses (easy to cancel)
- Employee vesting cliffs (could cause departures)
- Litigation pending (financial exposure)
- Non-compliance (regulatory issues)

How to prepare:
- Document IP assignment (all founders signed)
- Clean up employee agreements
- Resolve any pending litigation
- Ensure all licenses/certifications current

**Commercial Due Diligence**

Acquirer investigates:
- Market opportunity (real and large?)
- Competitive position (defensible?)
- Product roadmap (interesting?)
- Customer satisfaction (NPS, references)
- Vendor relationships (dependencies?)

How to prepare:
- Prepare customer references (get buy-in in advance)
- Document competitive advantages (moat)
- Show product roadmap (vision)
- Improve NPS (survey customers, address issues)

`
      },
      {
        heading: "Negotiation and Closing",
        body: `Getting the best deal possible.

**Negotiation Framework**

Start high, buyer starts low, negotiate to middle.

Example:
- Your ask: £15M (stretch, but anchor high)
- Buyer offer: £8M (low ball)
- Market reality: £10-11M (based on comps)
- Negotiations: 3-4 rounds
- Final deal: £11M (closer to market)

Leverage:
- Multiple acquirers bidding (increases value)
- Strong metrics (growth, profitability)
- Strategic value (platform fit for buyer)
- Walk-away ability (not desperate)

Use advisors (banker, lawyer) to negotiate. Don't negotiate directly.

**LOI (Letter of Intent)**

Non-binding document summarizing deal:
- Purchase price: £11M
- Structure: 60% cash (£6.6M), 40% earnout (£4.4M)
- Earnout terms: Hit £3M revenue year 2
- Closing conditions: Standard reps and warranties, employee retention
- Timeline: 60 days to close

LOI not binding but sets expectations. If buyer backs out after LOI, reputation damage.

**Definitive Agreements**

Binding documents:
- Purchase agreement (main deal doc)
- Rep and warranties (representations about company)
- Escrow (holdback for indemnification)
- Employment/consulting agreements (key people)
- Non-competes (you can't compete after)

Typical escrow: 10-15% of deal value, held 12-18 months for claims.

**Closing**

Final day:
- Buyer wires cash (60% at close)
- Seller signs docs, board approves
- Earnout registered (details, timeline)
- Key employees stay (retention agreements)

Post-close:
- Earnout payments (usually 6-month intervals)
- Integration planning
- Consulting agreement (if founder involved)

**Tax Planning**

Work with tax advisor on deal structure:
- Stock sale vs asset sale (tax implications)
- Timing of payment (earnout vs upfront)
- Holdback for taxes
- Personal tax (capital gains tax planning)

Can be substantial (20-40% of gain).

`
      }
    ],
    relatedSlugs: [
      "saas-valuation-and-multiples",
      "growth-accounting-and-advanced-unit-economics",
      "unit-economics-ltv-cac-payback",
      "financial-forecasting-modeling",
      "board-reports-and-financial-statements"
    ],
    faq: [
      {
        q: "How do I prepare my company for acquisition?",
        a: "18 months out: Clean financials (GAAP compliant), improve metrics (grow revenue, reduce churn). 6 months out: Prepare data room (customer list, contracts, financials, IP docs). 3 months out: Engage M&A banker and legal counsel. Continue improving metrics (higher valuation). 3 months to close: Due diligence, negotiate deal, close."
      },
      {
        q: "What valuation should I expect?",
        a: "Revenue multiple model: 2-6x revenue depending on growth and health. Example: £2M revenue, 40% growth = 3.5x = £7M. Add synergy value (cost savings, cross-sell = +£3M). Earnout: Typically 60% upfront, 40% over 2-3 years tied to targets. Negotiate from there."
      },
      {
        q: "What's an earnout and should I accept it?",
        a: "Earnout: 30-40% of deal value paid over time if you hit targets. Pro: Align seller/buyer interests. Con: Buyer controls business post-close, hard to hit targets. Negotiate: Clear targets, automatic payment (no buyer discretion), minimum floor (cap discount). Accept if targets realistic and buyer credible."
      },
      {
        q: "What do acquirers care about?",
        a: "Financial: Revenue, churn, CAC, LTV, margins (profitability). Product: IP ownership, tech quality, roadmap. Operational: Clean financials (audited), customer contracts (recurring), employee agreements. Legal: No litigation, IP clear, licenses current. Customer: Stickiness (NPS), references, concentration (not too dependent on few)"
      }
    ],
    videoUrl: ""
  }
];

export default batch172Articles;
