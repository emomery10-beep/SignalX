import { AcademyArticle } from "@/types/academy";

export const batch148Articles: AcademyArticle[] = [
  {
    slug: "contract-management-and-service-level-agreements",
    title: "Contract Management and Service Level Agreements: Protecting Revenue and Managing Risk",
    description: "Master contracts and SLAs. Negotiate terms, manage risk, set realistic service levels, and protect company finances.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "contracts",
      "service level agreements",
      "SLA",
      "terms and conditions",
      "payment terms",
      "contract terms",
      "uptime SLA",
      "liability",
      "contract negotiation",
      "customer agreements"
    ],
    keyTakeaways: [
      "Standard contract terms: Annual contract, net-30 payment terms (you get paid 30 days after invoice). Example: Customer signs Jan 1, uses product Jan-Dec, you invoice Jan 31, paid by Feb 28 = 59-day delay in cash. Negotiate better: Upfront annual payment (Jan 1 → paid Jan 1), net-15 (paid Feb 15), or monthly auto-billing (cash monthly). More upfront payment = better cash flow.",
      "SLA commitment: Uptime target (99%, 99.5%, 99.9%). Cost: 99% = basic (no credits), 99.5% = medium (5% credit for outages), 99.9% = premium (need redundancy, £50-100K extra infra cost). Example: £100K customer, 99% SLA = company saves £50K infra cost. 99.9% SLA = company spends £50K extra (net -£50K margin on that deal). Don't overpromise SLA (unprofitable).",
      "Contract red flags: Unlimited liability (if service breaks, customer can sue for unlimited damages), termination for convenience (customer can leave anytime, unpredictable revenue), auto-renewal with low thresholds (customer might auto-renew without wanting), unfavorable dispute resolution (customer wants arbitration in their location). Push back on these, or accept lower price (discount 10-20% for unfavorable terms)."
    ],
    content: [
      {
        heading: "Core Contract Terms and Negotiation",
        body: `Key elements of a SaaS contract.

**Payment Terms**

Standard: Net-30 (invoice end of month, paid 30 days later)

Example:
- Customer subscribes Jan 1, monthly billing
- You invoice Jan 31 (month 1 service rendered)
- Customer pays Feb 28 (net-30)
- You receive cash: 59 days after service delivery (Jan 1 to Feb 28)

Cash flow impact:
- MRR: £100K / month, net-30 terms
- Monthly cash in: £100K received around day 60
- With growth: Revenue growing £5K/month
- Outstanding receivables: ~£135K (2 months revenue)

Better terms:
- Net-15: Paid 15 days after invoice (cuts receivables in half)
- Upfront billing: Annual payment on day 1 of service (ideal)
- Automatic monthly billing: Charged card automatically (fast payment)

Negotiation:
- SMB: Annual upfront (best for company, customer wants discount 10-15%)
- Mid-market: Monthly auto-billing or net-15 (standard)
- Enterprise: Net-30 to net-45 (customer negotiates harder, accept but build into price)

Template: "Standard net-30, but available for 15% discount if net-15 or upfront annual."

**Contract Length**

Monthly: Flexibility (customer can cancel monthly)
- Risk: Unpredictable revenue, high churn risk
- Advantage: Low friction for customer adoption

Annual: Commitment (customer locks in for 1 year)
- Risk: Lower adoption (bigger commitment for customer)
- Advantage: Predictable revenue (can forecast), lower churn

Multi-year: Longer commitment (2-3 years)
- Risk: Very low adoption (big commitment)
- Advantage: Very predictable revenue, pricing power

Typical mix:
- SMB: Monthly or annual (option at signup)
- Mid-market: Annual (some monthly)
- Enterprise: Multi-year (negotiated)

Revenue recognition:
- Monthly: Recognize monthly (cash comes monthly)
- Annual prepaid: Recognize monthly over 12 months (deferred revenue decreases monthly)

**Auto-Renewal Terms**

Auto-renewal: Contract automatically renews unless customer cancels.

Good for company:
- Reduces churn from inertia (customer forgets, stays)
- Predicts revenue (contract renews automatically)

Risk:
- Customer angry if unintentional renewal (regulatory risk)
- Reputation damage if surprise billing
- Legal requirement (many jurisdictions require explicit consent to auto-renewal)

Best practice:
- Explicit auto-renewal (customer agrees in writing)
- Reminder emails 30 days before renewal (chance to cancel)
- Easy cancellation (one-click, no friction)

Non-renewal handling:
- If customer doesn't renew: Don't surprise bill
- Access disabled on renewal date
- Exit data: Provide export within 30 days

**Termination Clauses**

For cause:
- Company can terminate if customer breaches (doesn't pay, violates terms)
- Requires notice (30-60 days) to cure
- Risk: Customer disputes (was it really a breach?)

Without cause (termination for convenience):
- Either party can terminate anytime
- Red flag: Unpredictable revenue
- Mitigation: Charge termination fee (30-50% of annual contract value)
- Example: £10K annual contract, terminate at month 6, owe £5K termination fee

Typical structure:
- Year 1: Only for cause (lock in full year)
- Year 2-3: Can terminate without cause with 30-60 days notice + fee
- Never: Allow year 1 termination without cause (too risky)

Enterprise negotiation:
- Customer wants "termination for convenience" (exit anytime)
- Counter: 6-month notice + remaining contract fee due
- Example: 3-year contract £10K/year, terminate year 1 month 6, owe 1.5 years × £10K = £15K

`
      },
      {
        heading: "Service Level Agreements (SLAs)",
        body: `Defining and managing uptime commitments.

**SLA Commitment Levels**

99% uptime:
- Allowed downtime: 7.2 hours/month, 87.6 hours/year
- Status: Basic SLA, no compensation
- Cost to build: Minimal (single datacenter OK)
- Customer: Non-critical users
- Example: Basic tier customers

99.5% uptime:
- Allowed downtime: 3.6 hours/month, 43.8 hours/year
- Status: Standard SLA, automatic 5% service credit if breached
- Cost to build: Moderate (redundancy needed)
- Customer: Mid-market, important systems
- Example: Pro tier customers

99.9% uptime:
- Allowed downtime: 43 minutes/month, 8.8 hours/year
- Status: Premium SLA, automatic 10% service credit if breached
- Cost to build: High (multi-region, failover)
- Customer: Enterprise, mission-critical
- Example: Enterprise tier customers

**Service Credits (Compensation)**

How to compensate customer for SLA breaches:

99.5% SLA, 5% service credit:
- Customer pays £10K annual
- Downtime 3.7 hours in month (breaches 3.6 hour limit)
- Credit: 5% × (£10K / 12) = £42

Customer doesn't get money back, credit applied to next month's billing.

Higher uptime = higher cost but more compelling to enterprise customers.

**Calculating Uptime**

Uptime = (Total time - Downtime) / Total time × 100%

Example:
- Month: 30 days = 43,200 minutes
- Downtime: 40 minutes (system unavailable)
- Uptime: (43,200 - 40) / 43,200 = 99.91%

Measurement:
- Automated monitoring (pingdom, monitoring tool)
- Excludes: Planned maintenance, customer-side issues
- Includes: All unplanned outages

**Realistic SLA Setting**

Mistake: Promising 99.9% when can only deliver 99.5%
- Result: Constant breaches, customer complaints, credits paid out
- Negative: Reputation damage, expensive

Better: Promise 99% / 99.5%, over-deliver 99.7%
- Customer happy (expectations exceeded)
- Company profitable (credits rare)

Rule: Set SLA 0.5-1% lower than actual capability.

**Documenting SLA**

In contract:
"Company commits to 99% uptime measured monthly. Uptime excludes planned maintenance (max 4 hours/month) and events outside Company control (infrastructure failures). If uptime falls below 99%, Customer entitled to 5% service credit applied to next month. Credit is exclusive remedy (no other compensation)."

Key elements:
- Uptime percentage
- Measurement method
- Exclusions (planned maintenance, customer issues)
- Compensation (service credit)
- Exclusive remedy (limits company liability)

**High-Availability Infrastructure**

To meet 99.9% SLA:

Multi-region:
- Primary datacenter (US East)
- Backup datacenter (US West)
- Automatic failover if primary fails
- Cost: ~2x infrastructure (redundancy expensive)

Load balancing:
- Multiple servers per region
- Distribute traffic (no single point of failure)
- Automatic health checks

Database redundancy:
- Primary database + replica
- If primary fails, replica takes over
- Sync replication (zero data loss)

Monitoring:
- 24/7 monitoring (automated alerts)
- On-call team (engineer responds to alerts)
- Automated incident response (scripts to restart, failover)

Cost: £50-100K/month extra for 99.9% vs 99%.

Price accordingly: Charge £1000/month for 99.9% premium tier (vs £100/month basic 99%).

`
      },
      {
        heading: "Liability and Risk Management",
        body: `Protecting company from financial exposure.

**Liability Limitations**

Mistake: No liability cap
- Product breaks, customer loses £1M in revenue
- Customer sues for £1M
- Company pays (could bankrupt company)

Protection: Liability cap
- Example: "Company liability capped at 12 months of fees paid"
- Customer pays £10K annual, max liability = £10K
- If customer loses £100K due to service failure, recovers only £10K

Negotiation:
- SMB/mid-market: Accept liability cap at 12-month fees (standard)
- Enterprise: Negotiate cap (might accept 24-month for big contracts)
- Never: Unlimited liability (impossible risk)

**Consequential Damages Exclusion**

Types of damages:
- Direct: Customer can't access data (direct consequence)
- Consequential: Lost business revenue (indirect consequence)

Example:
- Product down 2 hours
- Customer's business lost £10K in sales (consequence of downtime)
- Could customer sue for £10K?

Protection: Exclude consequential damages
"Company not liable for lost profits, lost revenue, lost data, or other indirect damages, regardless of cause."

Limits company risk (only pays direct damages).

**Indemnification**

Indemnity: Company agrees to pay customer's legal fees if sued by third party.

Example:
- Your product uses open-source library (unlicensed)
- Library author sues customer for copyright infringement
- You indemnify customer: Company pays legal fees + damages

Typical indemnification:
- IP infringement: Company indemnifies (company's responsibility)
- Customer misuse: Customer indemnifies (customer's responsibility)

Limit indemnification to reasonable scope (don't agree to indemnify for anything).

**Insurance**

Professional liability insurance (errors and omissions):
- Covers legal liability if service failure causes customer loss
- Example policy: £1M coverage for £5K annual premium
- Triggered if sued for negligence, service failure

Directors and officers insurance:
- Covers company leadership from personal liability
- Relevant if lawsuit names CEO personally

Key person insurance:
- Covers loss of key employee (death, disability)
- Payout allows company to hire replacement

Early stage: Skip (expensive, not required).
Growth stage: Add once funding secured (investors typically require).
Mature: Essential (legally required in some jurisdictions).

**Dispute Resolution**

Litigation: Sue in court
- Time: 1-3 years to resolve
- Cost: £100K-500K+ in legal fees
- Outcome: Uncertain

Arbitration: Neutral arbitrator decides
- Time: 6-12 months
- Cost: £30-100K
- Outcome: Binding (must accept)

Mediation: Neutral mediator helps negotiate
- Time: 2-3 months
- Cost: £10-30K
- Outcome: Agreement only if both parties agree

Typical: Arbitration (faster, cheaper, confidential).

In contract: "Disputes resolved through binding arbitration under AAA rules, location [choose yours]."

Avoid: Litigation in customer's location (expensive for you).

`
      },
      {
        heading: "Contract Templates and Processes",
        body: `Building scalable contract management.

**Standard Contract Template**

Critical sections:
1. Definitions (what is service, what is customer data)
2. Service description (what company provides)
3. Payment terms (pricing, billing, late fees)
4. Term and renewal (contract length, renewal)
5. SLA (uptime commitment, credits)
6. Data privacy (GDPR, data handling)
7. Limitation of liability (cap, exclusions)
8. Confidentiality (protecting trade secrets)
9. IP rights (who owns what)
10. Termination (for cause, without cause, notice)
11. Dispute resolution (arbitration, location)

Early stage: Use standard template (from Termly, LawDepot, lawyer).

Cost: £500-2000 for lawyer to draft custom template.

Update annually: Law changes, add new terms (GDPR, cookie consent, etc.).

**Electronic Signature**

E-signature (Docusign, HelloSign):
- Customer signs digitally (no printing, scanning)
- Legally binding
- Faster process (sign in minutes vs days mailing)

Implementation: All new contracts signed electronically.

Impact: Faster sales cycles, faster cash (fewer delays).

**Contract Management System**

As contracts grow (100+), need system to track:
- Customer, contract value, start/end date
- Renewal dates (so you don't miss renewals)
- Payment status (who owes what)
- Amendments (price changes, scope changes)

Tools: Salesforce, Airtable, custom spreadsheet.

Benefit:
- Predictable renewals (know when contracts expire)
- Revenue forecasting (can forecast renewal revenue)
- Reduce surprises (no forgotten renewals)

**Contract Negotiation Best Practices**

Listen:
- Understand customer concerns (not just their demands)
- Build rapport (negotiation is conversation, not battle)

Educate:
- Explain why terms matter (e.g., "liability cap protects both of us")
- Trade-offs ("If you want 99.9% SLA, cost increases 50%")

Offer options:
- Multiple packages at different price points
- Let customer choose (Starter, Professional, Enterprise)
- Each tier has different terms (SLA, liability, support)

Stand firm on principle:
- Liability cap: Non-negotiable (risk management)
- IP ownership: Non-negotiable (company assets)
- Data security: Non-negotiable (customer trust)
- Nice-to-have: Negotiable (payment terms, contract length)

Close:
- Once agreed, document and get signature quickly
- Don't re-negotiate after signed (wastes time)

`
      },
      {
        heading: "Financial Impact of Contract Terms",
        body: `How contract terms affect cash flow and revenue recognition.

**Cash Flow Impact**

Payment term differences:

Scenario A: Monthly auto-billing
- Customer uses Jan 1-31
- Billed Jan 31
- Paid Feb 1 (automatic)
- Cash received: Day 32

Scenario B: Net-30
- Customer uses Jan 1-31
- Invoiced Jan 31
- Paid Feb 28
- Cash received: Day 59

Scenario C: Annual upfront
- Customer uses Jan 1-Dec 31
- Paid Jan 1
- Cash received: Day 1

Impact on cash:
- Monthly auto-billing: £10K MRR = £10K cash monthly
- Net-30: £10K MRR = £10K cash 2 months later (£20K receivables outstanding)
- Annual upfront: £120K MRR = £120K cash Jan 1 (entire year upfront!)

Cash difference:
- Auto-billing vs Net-30: £10K difference (2 months payables shift)
- Monthly vs Annual: £110K difference (leverage for annual)

Implication: Negotiate shorter payment terms to improve cash flow.

**Revenue Recognition (Accounting)**

Monthly subscription (customer pays £100/month):
- Jan: Recognize £100 revenue
- Feb: Recognize £100 revenue
- Monthly recognition

Annual upfront (customer pays £1,200):
- Jan: Record £1,200 as "deferred revenue" (liability)
- Jan-Dec: Recognize £100/month as revenue earned
- Same total recognition, but timing different

Deferred revenue:
- Liability on balance sheet (money you owe customer service)
- As you deliver service, revenue recognized
- Deferred revenue decreases monthly

Impact:
- Annual contracts = higher cash upfront (good!)
- But revenue recognized gradually (accounting spreads it)
- Business metrics: MRR/ARR captures deferred revenue properly

**Impact on Valuation**

Investors value recurring revenue multiples:

ARR × Valuation multiple = company value

Example:
- £10M ARR, 10x multiple = £100M valuation

Contract terms affect multiple:
- Annual contracts: Higher multiple (more predictable, lower churn)
- Monthly contracts: Lower multiple (less predictable, higher churn)

Example comparison:
- Company A: £10M ARR, 50% annual contracts, 2% monthly churn = 12x multiple = £120M valuation
- Company B: £10M ARR, 100% monthly contracts, 5% monthly churn = 8x multiple = £80M valuation

Same revenue, but Company A worth £40M more (due to contract terms).

Strategy: Incentivize annual contracts with discounts (worth it long-term).

`
      }
    ],
    relatedSlugs: [
      "bookings-vs-revenue-recognition",
      "financial-controls-audit-readiness",
      "pricing-strategy-and-price-optimization",
      "exit-planning-m-a-preparation",
      "tax-planning-for-saas-and-startups"
    ],
    faq: [
      {
        q: "What payment terms should I negotiate?",
        a: "Best to worst: Upfront annual (day 1), monthly auto-billing (day 1), net-15 (day 15), net-30 (day 30). Upfront = best cash flow (59-day difference). Offer discount for upfront: Annual £1,200 vs Monthly £100 × 12 = £1,200, offer annual £1,080 (10% discount). Customer saves money, you get cash upfront."
      },
      {
        q: "Should I offer an SLA?",
        a: "Yes, but match to customer segment and cost. 99% uptime: Basic (minimal cost), no credits. 99.5%: Standard (moderate cost), 5% credits. 99.9%: Premium (high cost, £50K+ infra), 10% credits. Only promise uptime you can deliver. Set SLA 0.5% below capability (over-deliver). Tier pricing by SLA: Starter 99%, Pro 99.5%, Enterprise 99.9%."
      },
      {
        q: "What liability protections do I need?",
        a: "Liability cap: Non-negotiable (cap at 12 months fees). Exclude consequential damages (lost profits, lost revenue). Indemnity: Company indemnifies for IP infringement, customer indemnifies for misuse. These three protect company from unlimited financial exposure. Early stage: Ensure template includes all three."
      },
      {
        q: "How do contract terms affect valuation?",
        a: "Investors value recurring revenue (ARR × multiple). Contract terms affect multiple: Annual contracts = higher multiple (12x), monthly contracts = lower multiple (8x). Same ARR, but annual contracts worth 50% more due to predictability. Negotiate annual contracts, offer discounts to incentivize (worth the discount long-term)."
      }
    ],
    videoUrl: ""
  }
];

export default batch148Articles;
