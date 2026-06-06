import { AcademyArticle } from "@/types/academy";

export const batch43Articles: AcademyArticle[] = [
  {
    slug: "risk-management-contingency-planning",
    title: "Risk Management & Contingency Planning: Preparing for Uncertainty and Threats",
    description: "How to identify business risks, develop contingency plans, and build resilience into your SaaS operating model.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Advanced",
    readTime: 7,
    keywords: [
      "risk management",
      "contingency planning",
      "business risk",
      "scenario planning",
      "crisis management",
      "business continuity",
      "risk mitigation",
      "disaster recovery",
      "business resilience",
      "risk assessment"
    ],
    keyTakeaways: [
      "Top SaaS risks: customer concentration (50%+ revenue from few customers), key person dependency (CEO leaves = company stuck), cash runway (burn rate threatens survival), competitive disruption, and market shift",
      "Contingency planning: For each risk, ask 'if this happens, how do we survive?' and document the plan; companies with contingency plans execute 3x faster in crises",
      "Risk probability × impact = priority; focus on high-impact, reasonable-probability risks; ignore low-probability/low-impact risks (analysis paralysis)"
    ],
    content: [
      {
        heading: "Identifying and Ranking SaaS-Specific Risks",
        body: `Most founders don't think about risks until they happen. By then, it's too late.

**Common SaaS Risks**:

1. **Customer Concentration Risk**:
Top 10 customers = >40% of revenue

Impact: If top customer churns, 40% revenue loss
Probability: 10-20% annual churn in top tier

Mitigation:
- Diversify customer base (reduce concentration to <25%)
- Increase switching costs (product lock-in, integrations)
- Executive relationship management (CEO owns top customer relationships)

Contingency: If top customer churns, what budget cuts immediately? (Have a plan)

2. **Key Person Risk**:
CEO departure (founder death, burnout, startup, etc.)

Impact: Company lacks direction, decision-making grinds to halt
Probability: 5-10% annually (depends on founder health, satisfaction)

Mitigation:
- Build strong team (not founder-dependent)
- Document processes and decisions
- Develop COO/VP who can run company
- Key person insurance (life insurance that pays company if founder dies)

Contingency: Who runs company if CEO leaves? (Name your successor)

3. **Cash Runway Risk**:
Burn rate exceeds capital, unable to raise next round

Impact: Forced shutdown or fire sale
Probability: 20-30% annually (fundraising environment shifts)

Mitigation:
- Maintain 18-24 month runway (buffer against funding uncertainty)
- Monthly cash monitoring (don't wait for surprise)
- Path to profitability (reduce burn rate if needed)
- Board relationships (investors can help in tight situations)

Contingency: If fundraising fails, how do you cut burn in half? (Have target)

4. **Competitive Disruption**:
New competitor emerges with better product, steals customers

Impact: Growth slows, churn accelerates, valuation declines
Probability: 50%+ over 3+ years (markets attract competitors)

Mitigation:
- Build strong product differentiation
- Create switching costs (customer relationships, integrations)
- Maintain innovation velocity (stay ahead)
- Understand your competitive advantage (why customers chose you)

Contingency: If competitor outmaneuvers you, what's your response? (Have strategic options)

5. **Market Shift Risk**:
Market category becomes less valuable (change in customer preferences, regulation, technology shift)

Impact: TAM shrinks, growth becomes difficult
Probability: 10-20% over 5+ years (markets evolve)

Example: Email marketing SaaS faces risk from SMS shift
Example: On-premise software vendors faced cloud shift

Mitigation:
- Monitor market trends (stay aware)
- Build adaptable product (pivoting is easier with flexible architecture)
- Stay close to customers (early signal of market shifts)

Contingency: If market shifts, what's your pivot plan? (Have vision for adjacent market)

6. **Data Breach/Security Risk**:
Customer data breached, regulatory fines, customer trust loss

Impact: Regulatory fines (£1-10M+), customer churn (50%+), brand damage
Probability: 5-10% annually for unprotected SaaS

Mitigation:
- SOC 2 certification (shows security maturity)
- Regular security audits (find vulnerabilities)
- Incident response plan (know what to do if breach happens)
- Cyber liability insurance (covers breach costs)

Contingency: Have incident response plan documented (communication, remediation, customer notification)

7. **Talent/Culture Risk**:
Key team members leave, culture deteriorates, burnout

Impact: Execution slows, knowledge loss, remaining team demoralized
Probability: 20-30% annually for critical roles

Mitigation:
- Competitive compensation
- Career development (clear paths)
- Culture investment (make workplace good)
- Knowledge sharing (don't let knowledge live in one person)

Contingency: If your VP Engineering leaves, who replaces them? (Have succession plan)

**Risk Assessment Matrix**:

Map risks by probability × impact:

| Risk | Probability | Impact | Priority |
|------|------------|--------|----------|
| Customer Concentration | Medium (20%) | High (40% revenue) | High |
| Key Person Risk | Low (5%) | Very High (company stops) | High |
| Cash Runway | Medium (25%) | Very High (shutdown) | High |
| Competitive Disruption | High (50%+) | Medium (slows growth) | Medium |
| Market Shift | Low (10%) | Medium (requires pivot) | Low |
| Data Breach | Low (10%) | High (brand, fines) | Medium |
| Talent Loss | Medium (25%) | Medium (slows execution) | Medium |

Focus on High priority risks (high impact + reasonable probability):
1. Customer concentration
2. Key person
3. Cash runway
4. Data security

Don't stress about Low priority risks (analysis paralysis).

**Building Contingency Plans**:

For each high-priority risk, document:

1. **Warning signs** (how will I know this is happening?)
   - Customer concentration: Monitor top 10, alert if any >15%
   - Key person: Monitor CEO satisfaction, health, options
   - Cash runway: Weekly cash tracking, alert at 18-month threshold
   - Data breach: Security monitoring, threat detection

2. **Response plan** (what do I do?)
   - Customer concentration: Diversification program, discount to retain top customer
   - Key person: Activate succession plan, board steps in
   - Cash runway: Cut expenses 30%, extend runway 6 months
   - Data breach: Activate incident response, notify customers, work with regulators

3. **Timeline** (how fast must we act?)
   - Customer churn: Days to weeks (prevent customer leaving)
   - Key person: Weeks to months (transition)
   - Cash runway: Months (but act before it becomes critical)
   - Data breach: Hours (contain breach, notify regulators)

4. **Owner** (who leads response?)
   - Customer concentration: VP Sales
   - Key person: Board/investors
   - Cash runway: CFO
   - Data breach: CTO + CEO

5. **Success criteria** (how do we know we fixed it?)
   - Customer concentration: Reduce top 10 to <30%
   - Key person: Successor ready to lead
   - Cash runway: Return to 18+ months
   - Data breach: Zero customer impact, incident resolved

**Crisis Management Playbook**:

When crisis hits (unexpected customer churn, market disruption, key person loss):

1. **Assess immediately** (24 hours): What's the size of problem? How long do we have?
2. **Communicate** (24-48 hours): Tell team, investors, key customers what you're doing
3. **Act decisively** (48-72 hours): Implement contingency plan
4. **Monitor closely** (weekly): Track metrics, adjust plan if needed
5. **Retrospective** (when crisis passes): What did we learn? How do we prevent next time?

Companies that have written contingency plans execute steps 1-5 in days.
Companies without plans waste time on steps 1-2, miss critical window.

**Insurance and Risk Transfer**:

Some risks can be transferred to insurance:

- Key person insurance: £1M policy on founder = £500K annual cost but protects company
- Cyber liability: Covers data breach costs = £100-500K annual cost
- Director & officer: Protects leadership from lawsuits = £50-200K annual cost
- Business interruption: Covers revenue loss if operations halt = £100-300K annual cost

Cost-benefit: Only insure risks where payout would be material (>£1M impact).

Most early-stage SaaS skips insurance (cost not justified). Series B+ companies typically carry key-person and cyber liability insurance.

The goal of risk management: Identify what could go wrong, plan for it, sleep better at night knowing you're prepared.
`
      }
    ],
    relatedSlugs: [
      "cash-flow-forecasting",
      "burn-rate-management-cash-preservation",
      "customer-concentration-risk",
      "organizational-culture-hiring",
      "business-continuity-planning"
    ],
    faq: [
      {
        q: "Which risks should I focus on?",
        a: "High impact + reasonable probability. Customer concentration, key person, cash runway, competitive threat. Ignore low-probability risks (analysis paralysis)."
      },
      {
        q: "How detailed should contingency plans be?",
        a: "Detailed enough to execute within hours of crisis. 1-2 page action plan per risk, with owner and timeline. Not a 100-page document."
      },
      {
        q: "Should I tell investors about risks?",
        a: "Yes. Investors respect founders who've thought through risks. Hiding risks = red flag. Transparent risk management builds confidence."
      },
      {
        q: "How often should I review risks?",
        a: "Quarterly. Add new risks as company evolves (new competitive threat, new customer concentration). Remove old risks as you mitigate them."
      },
      {
        q: "Should I buy insurance for every risk?",
        a: "Only for material risks (>£1M impact). Key person insurance and cyber liability are typical. Avoid low-probability, low-impact insurance (waste of money)."
      }
    ],
    videoUrl: ""
  },
  {
    slug: "enterprise-sales-strategy-tactics",
    title: "Enterprise Sales Strategy & Tactics: Building and Managing High-Value Deals",
    description: "How to build an enterprise sales organization, manage complex sales cycles, and structure deals for scalable growth.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Advanced",
    readTime: 8,
    keywords: [
      "enterprise sales",
      "complex sales",
      "sales strategy",
      "sales organization",
      "deal management",
      "sales process",
      "account management",
      "enterprise deals",
      "sales tactics",
      "sales leadership"
    ],
    keyTakeaways: [
      "Enterprise sales is fundamentally different from SMB: 6-18 month sales cycles, multiple stakeholders, custom implementations, £50K-5M+ contract values; it's not just a bigger version of SMB sales",
      "Enterprise sales org structure: VP Sales + team of specialized account executives (not generalist reps) + sales engineers + sales operations; typical ratio is 1 AE per £500K-1M annual pipeline coverage",
      "Deal qualification is critical: Spend time on qualified deals (MEDDIC: Metrics, Economic buyer, Decision criteria, Decision process, Identify pain, Champion) not pursuing every opportunity"
    ],
    content: [
      {
        heading: "Enterprise Sales Fundamentals and Structure",
        body: `Enterprise sales is a distinct discipline from SMB sales. Most SaaS companies fail in enterprise because they try to scale SMB playbook upmarket.

**Key Differences: SMB vs. Enterprise Sales**:

| Dimension | SMB | Enterprise |
|-----------|-----|-----------|
| Sales Cycle | 30-60 days | 6-18 months |
| Deal Size | £10K-50K ACV | £100K-5M+ ACV |
| Decision Maker | 1-2 people | 5-10+ people |
| Implementation | Self-serve | Custom, 6-12 months |
| Support | Email + self-serve | Dedicated success manager |
| Buying Criteria | Feature, price | ROI, security, risk mitigation |
| Contract Terms | Standard | Highly negotiated |

Enterprise sales requires:
- Longer runway (money to fund 12+ month sales cycles)
- Specialized sales team (not SDRs trying to close deals)
- Sales engineers (technical credibility)
- Customer success team (post-sale implementation and adoption)
- Procurement expertise (understanding enterprise buying process)

**Building Enterprise Sales Organization**:

Typical structure at £10M+ ARR with enterprise focus:

VP Sales (£120-150K salary):
- Owns sales strategy, pipeline, forecasting
- Manages account executive team
- Owns quarterly business reviews with key accounts
- Reports to CEO or CRO

Sales Engineers (£100-130K salary each):
- 2-3 per sales team of 5-6 account executives
- Handle technical evaluation, architecture, integration planning
- Pre-sales focus (hand off to implementation post-sale)
- Critical for enterprise credibility

Account Executives (£80-120K base + £100-200K commission):
- 5-6 AEs, each managing £3-5M pipeline
- Owns full sales cycle from initial meeting to close
- Responsible for qualifying opportunities
- Manages account relationships

Sales Development Reps (£40-60K + £10-20K commission):
- 2-3 per team of 5 AEs
- Generates and qualifies leads
- Books discovery meetings
- Entry-level position, path to AE

Sales Operations (£70-100K):
- Manages CRM, forecasting, reporting
- Supports deal management and closing

Total cost: £40-50 per £1M in pipeline (expensive, but necessary at enterprise scale)

**Enterprise Deal Management Process**:

Typical 6-month enterprise deal:

Month 1: **Discovery & Qualification**
- Initial meeting: Understand customer needs, business drivers
- MEDDIC qualification: Ensure deal is real (more on this below)
- Technical discovery: Determine architecture, integration needs
- Budget confirmation: "Do you have budget?" (many deals fail because no budget)

Month 2-3: **Evaluation & Proposal**
- Demo/POC: Customer evaluates your solution
- RFP response: Customer sends 50+ page requirement document, you respond
- References: Customer talks to existing customers
- Internal selection: Customer internally debates your solution vs. competitors

Month 4: **Negotiation**
- Pricing negotiation: You start at £500K, customer wants £300K
- Terms negotiation: Annual vs. multi-year, termination clauses, SLAs
- Security review: Customer security team reviews your systems
- Legal review: Customer legal reviews contract

Month 5: **Procurement & Legal**
- Purchase order: Customer generates PO, allocates budget
- Contract execution: Final signatures
- Insurance/compliance: Verification of coverage, compliance certifications

Month 6: **Closing & Implementation**
- Cash collection: Invoice and payment
- Implementation kickoff: Deploy resources, begin setup
- Go-live planning: Schedule go-live

This timeline explains why enterprise sales requires funding (you don't close a deal for 6 months, can't rely on cash flow to fund operations).

**Enterprise Deal Qualification: MEDDIC**:

Most failed enterprise deals could have been killed early if properly qualified. MEDDIC is the framework:

**Metrics**: What is customer trying to achieve? (revenue increase, cost reduction, risk mitigation?)
- Example: "Save 50% on implementation costs"
- Question: How will you measure success?

**Economic Buyer**: Who controls budget? (Often different from decision-maker)
- Example: CFO controls £500K budget, but VP Operations is decision-maker
- Question: Who has final approval on budget?

**Decision Criteria**: What's customer evaluating on?
- Example: Security, ease of use, price, integration capability
- Question: What's most important to you?

**Decision Process**: What's the buying timeline and approval process?
- Example: RFP in January, decision in March, contract in April
- Question: What's your expected timeline?

**Identify Pain**: What problem are they solving?
- Example: "We need to reduce implementation time from 6 months to 3 months"
- Question: What's the cost of not solving this?

**Champion**: Who inside customer is advocating for your solution?
- Example: VP Operations saw your demo and is pushing internally
- Question: Is there someone internally who will champion us?

If you can't satisfactorily answer all 6 MEDDIC questions, the deal isn't qualified. Move it to "prospect" stage, not "active opportunity."

Many sales teams claim 50+ opportunities in pipeline. With proper MEDDIC qualification, only 5-10 are truly qualified (rest are prospects, not deals).

**Deal Structuring and Contracts**:

Enterprise contracts are negotiated. Key terms to manage:

1. **Contract Length**: 1-year, 3-year, 5-year
   - Longer = customer lock-in, you get paid upfront
   - Shorter = customer flexibility, you get paid monthly
   - Sweet spot: 2-3 year agreements

2. **Payment Terms**: Upfront, 50/50 split, payment on go-live
   - Upfront: Best for cash flow
   - Payment on go-live: Customer wants to ensure success before full payment
   - 50/50 common compromise

3. **SLA and Service Credits**: Uptime guarantee (99.5%, 99.9%?)
   - Higher SLA = customer confidence, you take on risk
   - Service credits: If you miss SLA, customer gets discount
   - Enterprise contracts usually include 1-2% service credit cap

4. **Termination Clauses**: Can customer terminate early?
   - If yes, under what conditions?
   - Exit fee if terminated early? (Protects you)
   - Enterprise customers demand termination rights

5. **Data and Security**: Data residency, encryption, right to audit
   - Customer will ask about data security, compliance
   - Be prepared with security documentation, compliance certifications

6. **Pricing**: Total contract value (TCV) and customer expansion plans
   - Example: £1M TCV over 3 years = £333K annual
   - Plan for expansion: "Starting 5 seats, expanding to 20 seats over 3 years" = negotiate for increased pricing as they expand

**Sales Compensation in Enterprise**:

Commission structure is critical for enterprise sales motivation:

Base + Commission structure:
- Base salary: £80-120K (ensures stability)
- Commission: 30-50% of base (incentivizes closing)
- Example: £100K base + 40% commission = £140K average annual
- High performers can earn £300K+ (£100K base + £200K commission)

Commission on what?
- Bookings: More common (incentivizes contract value)
- Billings: Cash collected (incentivizes customer quality)

Booking commission example:
- £500K deal = 10% commission = £50K commission
- Pays over deal close (month 1-6 as deal progresses)
- Clawback if customer churns within first year

Commission structure drives behavior (carefully design what you want to incentivize).
`
      }
    ],
    relatedSlugs: [
      "sales-efficiency-metrics",
      "cac-payback-period-optimization",
      "customer-acquisition-cost",
      "sales-forecasting-pipeline",
      "revenue-operations-revops-strategy"
    ],
    faq: [
      {
        q: "When should I focus on enterprise vs. SMB?",
        a: "Enterprise: If product is complex, implementation is high-touch, or your unit economics require high ACV. SMB: If product is self-serve, lower friction."
      },
      {
        q: "How long should enterprise sales cycle be?",
        a: "6-12 months typical. 18 months is longer than it should be (slow decision). <6 months suggests not truly enterprise (or competitor is faster)."
      },
      {
        q: "What's a realistic enterprise conversion rate?",
        a: "10-20% from qualified opportunity (if using MEDDIC) to close. Without qualification, 2-5% (lots of wasted time)."
      },
      {
        q: "Should I negotiate enterprise contracts?",
        a: "Yes, but set boundaries. Negotiate within guardrails (SLA %, payment timing). Don't customize every clause (erodes margins)."
      },
      {
        q: "How do you manage enterprise customer relationships post-sale?",
        a: "Dedicated account manager, quarterly business reviews, executive sponsor (VP Sales owns relationship), proactive expansion planning."
      }
    ],
    videoUrl: ""
  }
];

export default batch43Articles;