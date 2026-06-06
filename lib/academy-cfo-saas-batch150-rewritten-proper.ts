import { AcademyArticle } from "@/types/academy";

export const batch150Articles: AcademyArticle[] = [
  {
    slug: "exit-planning-and-m-and-a-preparation",
    title: "Exit Planning and M&A Preparation: Maximizing Value When Selling Your Company",
    description: "Master exit planning. Prepare for acquisition or IPO, maximize valuation, manage tax implications, and negotiate favorable terms.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "exit strategy",
      "acquisition",
      "IPO",
      "M&A",
      "valuation",
      "due diligence",
      "earnout",
      "escrow",
      "transaction structure",
      "pre-exit planning"
    ],
    keyTakeaways: [
      "Exit timing: 7-10 years from founding is typical. At that point: Company mature (£20-100M ARR), profitable or close, team in place, customers diversified. Earlier (year 3-4) acquisition possible but valuation lower (higher risk). Later (year 10+) IPO more likely. Signal: Once strategic fit and valuation attractive, acquirer approaches (not planned years ahead). Rule: Build for 10-year horizon, be ready to exit if compelling offer comes.",
      "Valuation multiples: SaaS valued at revenue multiples (ARR × multiple). 3-5x = struggling SaaS, 10-15x = healthy growth, 20-30x = high-growth, 40x+ = hypergrowth. Example: £10M ARR × 10x = £100M valuation. Multiples driven by: Growth rate (faster = higher multiple), profitability (more profit = higher multiple), churn (lower churn = higher), NRR (>100% = higher).",
      "Due diligence: Acquirer investigates company (3-6 months). Red flags: Founder-dependent (founder leaves = company crashes), customer concentration (top 5 = 50%+ revenue = risky), tech debt (ancient codebase, high maintenance), legal issues (IP disputes, litigation). Solution: 1-2 years pre-exit, fix these. Remove founder dependency, diversify customers, modernize tech, resolve issues. Clean company = easier sale, better valuation."
    ],
    content: [
      {
        heading: "Exit Strategy and Timeline",
        body: `Planning the endgame from the beginning.

**Exit Paths**

Acquisition (most common):
- Acquirer buys company for cash and/or stock
- Timeline: 3-6 months from LOI to close
- Founder: Usually retained for 1-2 years post-close (earnout, retention)
- Return: Founder gets proceeds, loses control

IPO (less common, requires scale):
- Company goes public (raises capital, trades on stock exchange)
- Timeline: 1-2 years preparation before IPO
- Founder: Retains stake, subject to lockup (can't sell for 6 months)
- Return: Founder can sell gradually post-IPO

Recapitalization:
- PE firm buys majority stake
- Founder retains minority, takes dividend
- Timeline: 6-12 months

Merge with peer:
- Two companies merge (1:1 or weighted)
- Timeline: 12-18 months (complex, regulatory)

**Timeline: From Founding to Exit**

Typical venture-backed SaaS:

Year 1-2: Validate product, reach PMF
- ARR: £0-1M
- Growth: High (500%+)
- Exit readiness: None (too early)

Year 3-4: Reach initial scale
- ARR: £1-10M
- Growth: High (100-200%)
- Exit readiness: Possible acquisition (if strategic fit), but valuation limited

Year 5-7: Scale aggressively
- ARR: £10-50M
- Growth: Moderate (30-50%)
- Exit readiness: Attractive to acquirers, good valuation

Year 8-10: Mature business
- ARR: £50-200M
- Growth: Slowing (15-30%)
- Exit readiness: IPO possible, or strategic acquisition at high valuation
- Profitability: Often breakeven or profitable

Most exits: Year 6-9 (sweet spot for valuation and strategic fit).

**Acquisition Interest Signals**

Unsolicited interest:
- Acquirer approaches (often informal call from business dev)
- "We love your product, ever thought about being acquired?"
- Signal: Company strategically valuable, timing good

What triggers interest:
- Market position (you're #2 in niche market they want)
- Customer overlap (your customers useful to them)
- Tech/IP (proprietary technology valuable)
- Talent (engineering team strong)
- Traction (growing fast, proven business model)

Response:
- Don't dismiss casually (could be 10x outcome)
- Don't commit (not in-market to sell, just explore)
- Get engaged: Understand their strategy, valuation expectations
- Legal: Hire M&A advisor early (before negotiations, get advice)

**Strategic vs Financial Acquirers**

Strategic (most likely):
- Competitor (buys to consolidate market)
- Adjacent player (buys to enter new market)
- Example: Slack acquires Slack competitor = get customers + team
- Synergies: Can cut costs (sales team, infrastructure overlap)
- Valuation: Often higher (willing to pay for synergies)

Financial:
- PE firm (buys to optimize and resell)
- Growth equity (buys to accelerate growth)
- Example: General Atlantic buys SaaS company, reinvests in growth, sells in 4 years
- Synergies: Operational, financial (better cost structure)
- Valuation: Often lower (purely financial return)

Preferred: Strategic (more flexibility, often higher valuation).

`
      },
      {
        heading: "Valuation and Deal Structure",
        body: `Understanding what your company is worth.

**Valuation Methods**

Revenue multiple (most common for SaaS):
- Multiple = Valuation / ARR
- Example: £10M ARR, 10x multiple = £100M valuation

Drivers of multiple:
- Growth rate: 50% growth = 15x, 30% growth = 10x, 10% growth = 5x
- Profitability: EBITDA margin >40% = premium multiple
- Churn: 2% monthly = higher multiple than 5% monthly
- NRR: >110% = higher multiple (expansion-driven)
- Market: Faster-growing market = higher multiples

Example comparables:
- Slack (2013, IPO): ~£5B revenue × 10x = £50B valuation (pre-IPO)
- Stripe (2024, latest funding): ~£10B revenue × 15x = £150B valuation (private)
- Atlassian (2015, IPO): ~£400M revenue × 15x = £6B valuation (public)

**Deal Structure: Cash vs Stock**

All-cash acquisition:
- Example: £100M cash for company
- Pro: Certain (cash in bank)
- Con: Founder loses equity upside if acquirer stock goes up

Part cash, part stock:
- Example: £60M cash + £40M acquirer stock
- Pro: Founder participates in upside (if acquirer does well)
- Con: Risk (if acquirer stock declines, real loss)

Typical: 60% cash, 40% stock (balance of certainty and upside).

**Earnouts and Retention**

Earnout: Additional payment if company hits targets post-close.

Example:
- Purchase price: £100M cash at close
- Earnout: Additional £20M if hit £20M ARR by 2026
- Founder incentive: Hit target = get £20M more (stay focused)

Retention bonus:
- Founder locked in for 2 years post-close
- If leave early: Forfeit earnout (incentive to stay)

Typical earnout structure:
- 20-30% of purchase price
- Based on revenue, profitability, or customer retention targets
- 1-3 years to earn (aligns founder with post-acquisition success)

**Escrow (Holdback)**

Escrow: Portion of purchase price held back for 12-18 months (insurance against breaches).

Example:
- Purchase price: £100M
- Escrow: 10% = £10M held back
- Close: Founder gets £90M
- Post-close: If no issues, gets £10M in 18 months

Purpose: Protect buyer from post-close discoveries
- Revenue misrepresentation (told you'd hit £10M, only hit £8M)
- Customer churn (told you'd keep 95%, only 80%)
- Liabilities (hidden debt, lawsuits)

Typical: 5-15% escrow, 12-18 month holdback period.

**Valuation Example**

Company: £10M ARR, 40% growth, 1.5% monthly churn, 110% NRR, £8M EBITDA (80% margin)

Valuation estimate:
- Base multiple: 10x (healthy SaaS)
- Growth premium: +3x (40% growth excellent)
- Profitability premium: +2x (80% margin, rare)
- Churn discount: -1x (1.5% monthly slightly high)
- **Estimated valuation: 14x = £140M**

Negotiation range: £120M (conservative) to £160M (aggressive).

`
      },
      {
        heading: "Preparing for Due Diligence",
        body: `Getting company acquisition-ready.

**Red Flags Acquirers Hate**

#1: Founder dependency
- Problem: Key person is founder, no one else can run business
- Impact: Founder leaves = company tanks
- Fix: Empower #2, transition founder to advisory role (2 years pre-exit)

#2: Customer concentration
- Problem: Top 5 customers = 50% of revenue
- Impact: Loss of 1 customer = material revenue drop
- Fix: Diversify (target many small customers, balance large accounts)

#3: Tech debt
- Problem: Code is legacy, slow to add features, high maintenance costs
- Impact: Post-acquisition, requires expensive rewrite
- Fix: Modernize (invest in refactoring, tech debt paydown)

#4: Legal issues
- Problem: IP disputes, litigation, regulatory violations
- Impact: Acquirer assumes liabilities
- Fix: Resolve before exit (settle disputes, fix compliance)

#5: Customer churn
- Problem: Monthly churn >3%, customers leaving
- Impact: Revenue declining, quality of customer base questioned
- Fix: Improve retention (CS program, product improvements)

#6: Unresolved liability
- Problem: Debt, taxes owed, employee claims, warranty issues
- Impact: Escrow used to settle
- Fix: Pay down debt, ensure taxes filed, resolve employee issues

**Data Room Preparation**

Acquirer due diligence requires:
- Cap table (who owns what percentage)
- Financial statements (3 years audited, monthly current year)
- Customer list (names, contract values, retention history)
- Key contracts (customer, partner, vendor agreements)
- Employee agreements (equity grants, vesting, severance)
- IP documentation (code ownership, patents, trademarks)
- Tax filings (federal, state, international)
- Insurance (policies, claims history)
- Compliance (SOC 2, GDPR, certifications)
- Litigation (pending lawsuits, settlements)
- Board minutes (governance, major decisions)
- Auditor reports (financial audit, tax audit results)

Organize: Virtual data room (Intralinks, Merrill DataSite) with searchable access.

Impact: Clean data room = faster diligence = faster close.

Messy data room = delay, acquirer frustration, lower valuation (risk discount).

**Cleaning Up Pre-Exit**

1-2 years before anticipated exit:

Month 1-3: Fix legal issues
- Resolve IP disputes
- Settle pending litigation
- Cure regulatory violations

Month 4-6: Improve financials
- Diversify customers (reduce concentration)
- Improve margins (cut underperforming segments)
- Strengthen retention (reduce churn)

Month 7-9: De-risk business
- Promote #2-in-command (reduce founder dependency)
- Modernize tech (reduce technical risk)
- Document everything (prepare data room)

Month 10-12: Hire advisors
- M&A lawyer (negotiate terms)
- Investment banker (manage process, solicit buyers)
- CFO (financial diligence)
- Tax advisor (structure exit)

Expected cost: £200-500K in advisor fees (worth 1-2% valuation upside).

`
      },
      {
        heading: "Negotiating the Deal",
        body: `Maximizing purchase price and favorable terms.

**Typical Deal Process**

Phase 1: Mutual NDA + Initial Meeting (2 weeks)
- Acquirer signs NDA
- Meet to discuss strategic fit, initial valuation

Phase 2: LOI (Letter of Intent) (2-4 weeks)
- Acquirer makes non-binding offer
- Valuation, structure, timing, conditions
- Founder gets legal review, negotiates

Phase 3: Exclusivity (2-4 weeks)
- Deal goes exclusive (acquirer alone, no other buyers)
- Formal due diligence begins
- Buyer conducts investigation (3-6 months)

Phase 4: Definitive Agreements (4 weeks)
- Final purchase agreement negotiated
- Legal, reps & warranties, escrow terms
- Both sign

Phase 5: Closing (2 weeks)
- Final docs executed
- Money wired
- Employee/customer notifications

Total time: 4-9 months from LOI to close.

**Key Terms to Negotiate**

Valuation: Most important
- Typically negotiated ±10% (£100M ±£10M)
- Depends on growth, profitability, risk

Earnout conditions: Ensure achievable
- Example: "Hit £20M ARR by 2026" = realistic given current trajectory
- Don't accept impossible targets (acquirer wants discount via unachievable earnout)

Holdback period: Shorter = better
- 12 months: Better (get escrow back sooner)
- 18 months: Acceptable
- 24 months: Avoid (too long)

Founder role: Clarity on expectations
- Exactly what role post-close?
- For how long?
- Compensation?
- Decision-making authority?

Non-compete: How restrictive?
- Cannot do competitive business for X years in Y geography
- Too restrictive = limits founder's future ventures
- Negotiate: 1 year, specific geography, narrow definition

**Using Investment Banker**

Role of banker:
- Manage buying process (solicit multiple buyers)
- Valuation guidance (what can you really get?)
- Negotiation support (expert on terms, process)
- Deal closure (ensure all parties align)

Cost: Typically 5-7% of purchase price
- Example: £100M deal, banker gets £5-7M (paid from proceeds)

Worth it if:
- Can generate bidding competition (higher valuation outweighs fee)
- Valuation increase > fee (£120M valuation with banker vs £100M alone)

Skip if:
- Already have buyer lined up (no competition)
- Deal straightforward (banker fee not worth it)

**Walk Away Decision**

Know your walk-away price before negotiating.

Example:
- Company worth £100M (your valuation)
- Minimum acceptable: £80M (20% below, willing to walk)
- Target: £120M (20% above, aggressive but worth pursuing)

If offer below walk-away:
- Walk away (not worth selling at discount)
- Continue building (independent path)

If offer at target:
- Accept (achieved goal)

If offer between walk-away and target:
- Negotiate (counteroffers, earnouts, stock)
- Decide based on terms (pure cash lower than stock deal is worse)

`
      },
      {
        heading: "Post-Exit and Tax Implications",
        body: `What happens after you sell, tax planning.

**Earnout Management**

Earnout hit 100%:
- Founder + team excited (everyone gets paid)
- Note: Earned amount is income (taxable year earned, not received)
- Plan: Set aside cash for taxes on earnout

Earnout hit 50%:
- Founder disappointed (lost half)
- Evaluate: Was realistic target set?
- Lesson: Future deals, negotiate achievable earnouts

Earnout miss:
- Founder loses money
- Analyze: Why didn't we hit target?
- Lesson: Ensure team incentives align with earnout targets

**Tax on Exit**

Capital gains:
- Founder bought shares at £0 (founder equity)
- Sell at £10/share (acquisition)
- Gain: £10/share × 1M shares = £10M
- Tax: £10M × 20% (capital gains) = £2M owed

Timing:
- Founder loses £10M proceeds to tax liability
- Must plan for cash to pay taxes

Strategies (US, consult tax advisor):
- ISO exercise timing (exercise early to reduce spread)
- Hold period: Hold stock 1+ year for long-term capital gains (lower tax)
- Charitable donations: Donate appreciated stock (avoid gains tax)
- Installment sales: Spread gains over time (if payment structured)

Post-exit liquidity:
- If acquisition pays in cash over 2 years (earnout): Taxes due year 1 (even if payment deferred)
- Plan: Set aside escrow for tax liability

**Founder Retention Post-Exit**

Typical: Founder retained for 1-2 years post-acquisition.

During retention:
- Salary: Usually increase (£200-300K+)
- Earnout: Incentive to hit targets
- RSUs: Acquirer stock grants (equity stake in new company)
- Role: Usually reporting to CEO or exec team (loss of control)

Challenges:
- Founder frustrated (no longer "the boss")
- Culture clash (acquirer's way vs founder's way)
- Boredom (problem-solving done, now execution)

Success factors:
- Clear role and expectations (what are you responsible for?)
- Autonomy (let founder own area, not micromanaged)
- Upside opportunity (earnout achievable, motivating)
- Exit clause (if things don't work out, can leave)

Typical outcome: 1-2 years, then founder departs (takes earnout, moves on).

**Life After Exit**

Options for founder post-acquisition:

Take break:
- Spend time with family
- Travel, explore
- Usually 6-12 months (boredom sets in)

Angel investing:
- Invest in early-stage startups
- Learn other businesses
- Typical: £10K-100K per deal, portfolio of 5-10 companies
- Return: 1-5 year hold, exit via IPO or acquisition

Start new company:
- Apply lessons learned
- Reduce mistakes (known what to do/not do)
- Faster path to success (previous success credibility)
- Typical: 3-5x better outcomes on second venture

Corporate role:
- CEO/exec at larger company
- Rare for founders (different skills required)
- Usually passes (prefers independence)

Most successful founders: Angel investing + advisoring + starting next venture (portfolio approach).

`
      }
    ],
    relatedSlugs: [
      "saas-valuation-and-multiples",
      "financial-forecasting-modeling",
      "tax-planning-for-saas-and-startups",
      "funding-strategy-and-investor-relations",
      "financial-controls-audit-readiness"
    ],
    faq: [
      {
        q: "What's my company worth?",
        a: "SaaS valued at revenue multiples: ARR × multiple = valuation. Multiple driven by growth (50% growth = 15x, 30% = 10x), profitability (>80% margin = premium), churn (<2% = higher). Example: £10M ARR, 40% growth, 80% margin = 14x = £140M valuation. Get formal valuation from banker if considering exit."
      },
      {
        q: "How should I structure the deal?",
        a: "Typical: 60% cash, 40% acquirer stock. Plus earnout (20-30% of purchase price) if hit targets. Escrow (10%) held for 12-18 months insurance. Example: £100M deal = £60M cash + £25M earnout + £15M escrow. Negotiate: Minimize escrow (get money sooner), earnout achievable (hit targets), founder role clear."
      },
      {
        q: "What's the timeline from LOI to close?",
        a: "Typical 4-9 months. Phase 1: Initial meeting + NDA (2 weeks). Phase 2: LOI negotiation (2-4 weeks). Phase 3: Exclusivity + due diligence (3-6 months). Phase 4: Definitive agreement (4 weeks). Phase 5: Closing (2 weeks). Longer if complex (multiple locations, regulatory), shorter if clean."
      },
      {
        q: "What should I fix before selling?",
        a: "Fix 1-2 years pre-exit: (1) Founder dependency—promote #2-in-command, (2) Customer concentration—diversify to many customers, (3) Tech debt—modernize code, (4) Legal issues—resolve disputes/litigation, (5) Churn—improve retention, (6) Financials—clean books, audit-ready. Clean company sells 10-20% higher valuation."
      }
    ],
    videoUrl: ""
  }
];

export default batch150Articles;
