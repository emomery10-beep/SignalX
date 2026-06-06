import { AcademyArticle } from "@/types/academy";

export const batch45Articles: AcademyArticle[] = [
  {
    slug: "customer-success-operations",
    title: "Customer Success Operations: Building a Scalable CS Machine",
    description: "How to structure and scale customer success to improve retention, expansion revenue, and customer lifetime value.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Advanced",
    readTime: 8,
    keywords: [
      "customer success",
      "customer success operations",
      "CS operations",
      "customer retention",
      "customer support",
      "customer management",
      "success metrics",
      "customer engagement",
      "retention operations",
      "customer health"
    ],
    keyTakeaways: [
      "CS is not support: Support fixes problems (reactive), CS drives adoption and expansion (proactive); misalignment destroys retention",
      "CS ROI is measurable: £1 invested in CS for £10K ACV customer reduces churn 15-25%, generates £3-5K expansion revenue, delivers 5-10x ROI",
      "Segment CS delivery by customer size: Enterprise (dedicated CSM), mid-market (shared CSM 50-75 customers), SMB (product-led or email-based); one-size-fits-all CS is inefficient"
    ],
    content: [
      {
        heading: "Customer Success Fundamentals and Segmentation",
        body: `Customer Success (CS) is the function responsible for ensuring customers achieve their desired outcomes using your product.

This is fundamentally different from Support (which fixes problems) or Sales (which closes deals).

CS is proactive (help customer succeed) vs. reactive (wait for customer to ask).

**CS Impact on Metrics**:

Without CS:
- Churn: 5-8% monthly (customers don't know how to use product)
- Expansion revenue: 2-3% of existing customer base (customers not encouraged to expand)
- NRR: 95-100% (low expansion, normal churn)
- LTV: 12-15 months customer lifespan (customers churn when value drops)

With CS:
- Churn: 2-4% monthly (customers are trained, engaged)
- Expansion revenue: 8-12% of existing customer base (CSM actively identifies expansion)
- NRR: 110-120% (good expansion + low churn)
- LTV: 24-36 months customer lifespan (customers stay longer, expand more)

The CS investment (£0.5-2M annually) pays for itself through:
- Churn reduction: 3% churn reduction on 100 customers at £50K ACV = £150K recovered annually
- Expansion revenue: 5-8% expansion increase = £250K-400K additional revenue
- Total impact: £400-550K recovered, vs. £0.5-2M CS investment (2-10x ROI depending on scale)

**Customer Success Segmentation**:

Different customers need different CS intensity.

Enterprise (£100K+ ACV):
- 1 dedicated CSM per 5-10 customers
- Quarterly business reviews
- Proactive outreach weekly
- Cost: £150-200K CSM per customer per year (1-2 CSMs per enterprise customer)
- Justification: High value, high risk (loss of one customer = £100K+ impact)

Mid-Market (£20-100K ACV):
- 1 CSM per 50-75 customers
- Quarterly business reviews for top half, bi-annual for bottom half
- Monthly outreach
- Cost: £3-5K CSM per customer per year
- Justification: Reasonable value, moderate risk

SMB (£5-20K ACV):
- Product-led (in-app guidance, email tips) or shared CSM 200-300 customers
- No direct CSM contact, or annual check-in
- Email-based engagement
- Cost: £0-500 per customer per year
- Justification: Low value, scale via automation

**Building the CS Function**:

Startup (£0-1M ARR):
- VP Customer Success wears multiple hats (CS, support, onboarding)
- Responsibility: 50-100 customers
- Focus: Onboarding and early adoption

Growth (£1-5M ARR):
- VP CS + 2-4 CSMs
- Average CSM coverage: 50-75 mid-market customers
- Specialization: Onboarding, adoption, expansion, retention (separate responsibilities)

Scale (£5M+ ARR):
- VP CS + CSM team (8-20 people) segmented by:
  - Enterprise CSMs (5-10 customers each)
  - Mid-market CSMs (50-75 customers each)
  - Renewal specialists (manage annual contracts)
  - Onboarding specialists (manage first 90 days)
  - Technical success (implementation, integrations)
  - Operations (tools, data, reporting)

**CS Metrics Dashboard**:

Key metrics every CS leader should monitor:

1. **Health Score**: Composite metric (0-100) predicting churn risk
   - Usage frequency (logins, feature adoption)
   - Engagement level (support tickets, feature expansion)
   - Product adoption (% of features used)
   - Formula: (Usage score × 0.4) + (Engagement score × 0.3) + (Adoption score × 0.3)

2. **NPS (Net Promoter Score)**: Customer satisfaction metric
   - "How likely are you to recommend us?" (0-10 scale)
   - Score 9-10 = Promoters (loyal, refer)
   - Score 7-8 = Passives (satisfied but not loyal)
   - Score 0-6 = Detractors (dissatisfied, churn risk)
   - Target: NPS > 50 is excellent

3. **CSAT (Customer Satisfaction)**: Transactional satisfaction
   - "How satisfied with [feature/support]?" (1-5 scale)
   - Target: >4.0 average

4. **Churn Rate**: % of customers churned monthly
   - Track by segment (enterprise, mid-market, SMB)
   - Target: <5% monthly enterprise, <5% mid-market, <10% SMB

5. **Expansion Rate**: % of customers expanding spending
   - Track by segment (enterprise 30-50%, mid-market 15-25%, SMB 5-10%)
   - Target: Higher is better

6. **Time to Value (TTV)**: Days to customer's first key action
   - Target: <7 days for product-led, <30 days for sales-led

7. **CSM Workload**: Customers per CSM
   - Enterprise: 5-10 per CSM
   - Mid-market: 50-75 per CSM
   - SMB: 200-300 per CSM

Monitor these monthly. Alert when health scores drop or churn accelerates.

**CS Playbooks by Stage**:

**Onboarding (Days 1-30)**:
- Day 1: Kickoff call (product orientation, success metrics, timeline)
- Day 3: Implementation plan (integration, data setup)
- Day 7: Check-in (any blockers? Early value signal?)
- Day 14: Training (power user training, best practices)
- Day 30: First review (achieved key metrics? Plan next steps)

Target: Customer achieves "time to value" by day 30 (first meaningful benefit)

**Adoption (Days 31-90)**:
- Weekly: Monitor feature adoption (are they using core features?)
- Bi-weekly: Office hours (questions, troubleshooting)
- Monthly: Business review (progress toward goals?)
- Day 90: Renewal decision (will they renew? Are they expanding?)

Target: 60%+ of customers using core features by day 90

**Expansion (Month 4+)**:
- Quarterly: Business reviews (business metrics, expansion opportunities)
- Monthly: Outreach (product updates, new features, expansion ideas)
- Continuous: Identify expansion signals (new team members, increased usage, adjacent use case)

Target: 20-30% of customers expanding annually (modules, seats, advanced features)

**CS Investment Justification**:

Build simple model showing ROI:

Current state (no CS):
- 100 customers at £50K ACV = £5M ARR
- 5% monthly churn (50% annual) = £2.5M annual churn
- 3% annual expansion = £150K expansion revenue
- NRR = 98%

CS Investment (£500K annually):
- 1 VP CS (£120K) + 4 CSMs (£80K each) = £440K
- Tools and overhead = £60K
- Total = £500K

New state (with CS):
- 100 customers at £50K ACV = £5M ARR
- 3% monthly churn (35% annual) = £1.75M annual churn (saved £750K)
- 10% annual expansion = £500K expansion revenue (gained £350K)
- NRR = 107%

Value creation:
- Churn reduction: £750K saved
- Expansion revenue: £350K gained
- Total value: £1.1M
- CS investment: £500K
- Net ROI: £600K (120% first-year ROI)

By year 2, the model improves because CS is already in place (no additional startup cost).

CS is not a cost center (expense to minimize), it's a revenue generator (investment that returns multiples).
`
      }
    ],
    relatedSlugs: [
      "customer-lifetime-value-calculation",
      "churn-cohort-analysis",
      "expansion-revenue-strategies",
      "nps-customer-satisfaction",
      "retention-strategy-deep-dive"
    ],
    faq: [
      {
        q: "When should I hire my first CSM?",
        a: "At £1-2M ARR with 20-30 customers. Founder or VP can do CS earlier, but once you have real customer base, need dedicated resource."
      },
      {
        q: "What's the ideal CSM-to-customer ratio?",
        a: "Enterprise: 5-10 customers per CSM. Mid-market: 50-75. SMB: 200-300 (or product-led). Scale based on customer complexity and value."
      },
      {
        q: "How do you measure CS effectiveness?",
        a: "Primary: Churn, NRR, expansion rate. Secondary: Health score, NPS, CSAT, time-to-value. Track monthly, review quarterly."
      },
      {
        q: "Should CS report to Sales or CEO?",
        a: "Ideally to CEO or CRO (Chief Revenue Officer) if no CRO. If reporting to Sales VP, CS gets pressured to focus on new sales vs. retention (conflict)."
      },
      {
        q: "How do you prevent churn during CS ramp?",
        a: "Layer CS gradually (don't fire everyone at once). Start with onboarding, expand to adoption, then add expansion. Each layer builds on previous."
      }
    ],
    videoUrl: ""
  },
  {
    slug: "api-monetization-strategy",
    title: "API Monetization: Turning Your API Into a Revenue Stream",
    description: "How to monetize your API, create tiered API pricing, and build developer platforms that generate recurring revenue.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Advanced",
    readTime: 7,
    keywords: [
      "API monetization",
      "API strategy",
      "developer platform",
      "API pricing",
      "API revenue",
      "developer tools",
      "platform monetization",
      "API business model",
      "usage-based pricing",
      "integration revenue"
    ],
    keyTakeaways: [
      "API monetization models: per-request pricing (£0.01-0.10 per API call), tiered access (free/pro/enterprise tiers), usage-based (pay for bandwidth or compute), premium features (advanced analytics at £500/month+)",
      "Successful API monetization requires: clear pricing, easy integration, good documentation, reliable service (uptime SLA), and dedicated developer support; most SaaS companies give away APIs (free), missing revenue opportunity",
      "Developer platform economics: High friction to switch (developers invest time in integration), high CAC (need to reach developer community), but high LTV (once integrated, hard to remove); target 15-20% gross margin after infrastructure costs"
    ],
    content: [
      {
        heading: "Understanding API Business Models",
        body: `Many SaaS companies provide APIs for free (as a feature of their product). This is leaving money on the table.

API monetization is different from API-as-a-service (which is your entire product). Monetization is charging for API access/usage.

**Types of API Revenue Models**:

1. **Per-Request Pricing**:
Charge per API call
- Example: Stripe charges 2.4% per transaction, Twilio charges £0.0065-0.04 per API call
- Pros: Simple, scales with usage, customers pay for what they use
- Cons: Unpredictable billing, friction for high-volume users
- Typical pricing: £0.01-0.10 per request

Example: SaaS company charges £0.01 per API request
- Customer A: 100,000 API requests/month = £1,000/month
- Customer B: 10,000 API requests/month = £100/month
- Revenue scales with usage

2. **Tiered Access**:
Free, basic, professional, enterprise tiers with request limits
- Example: Stripe free tier (free), metered tier (unlimited, £0.25%), S&M tier (direct sales)
- Pros: Predictable billing, tiers customers into buckets
- Cons: Customers might not know which tier they need
- Typical structure: Free (100K requests/month), Pro (1M requests/month for £99/month), Enterprise (custom)

3. **Hybrid Model**:
Monthly fee + usage overages
- Example: £99/month for 1M requests + £0.01 per request beyond 1M
- Pros: Predictable base revenue + upside from heavy users
- Cons: Billing complexity
- Typical structure: Used by Twilio, AWS, Stripe

4. **Freemium Model**:
Free tier (generous, loss-leader), paid tiers (premium features)
- Example: Free tier (unlimited requests), Pro tier (advanced analytics, priority support)
- Pros: Low friction to adoption, builds developer base
- Cons: High churn from free tier (developers never convert)
- Conversion rate: Typically 1-5% of free tier converts to paid

**Monetization Case Study**:

Imagine a data platform SaaS company with £2M ARR.

Current state (free API):
- 500 customers use API
- Estimated 50M API requests/month across all customers
- API generates £0 revenue (free feature)
- API infrastructure cost: £5K/month (AWS compute)

Monetized state (per-request pricing):

Tier 1: Free (100K requests/month)
- 300 customers on free tier
- No revenue, but low-friction onboarding

Tier 2: Pro (£50/month for 1M requests, £0.01/request overage)
- 150 customers on pro tier
- Average usage: 500K requests/month = 50% overage
- Revenue per customer: £50 + (50K × £0.01) = £75/month
- Total revenue: 150 × £75 = £11.25K/month

Tier 3: Enterprise (custom pricing, direct sales)
- 50 customers on enterprise tier
- Average: 5M requests/month
- Custom pricing: Average £5K/month per customer
- Total revenue: 50 × £5K = £250K/month

Total API revenue: £11.25K + £250K = £261K/month = £3.1M annually

The company just added £1.1M in annual revenue (50% growth) by monetizing the API.

**Challenges in API Monetization**:

1. **Developer backlash**: "You're now charging for something that was free? Switching to competitor."
   - Mitigation: Grandfather existing users (free until they want to expand), introduce pricing for new APIs only, provide clear upgrade path

2. **Billing complexity**: Predicting API usage is hard, customers get surprise bills
   - Mitigation: Show usage dashboard in real-time, set spending caps, allow customers to purchase usage credits upfront

3. **Support burden**: High-volume API users need support, increases CS costs
   - Mitigation: Tier support (free tier = community forum, paid tier = email support, enterprise = dedicated support)

4. **Compliance and legal**: Different payment terms for API revenue, need clear API terms of service
   - Mitigation: Work with legal, create clear T&Cs

**Building a Monetized API**:

Phase 1: Pricing and Strategy (Month 1-2)
- Determine pricing model (per-request, tiered, hybrid?)
- Analyze customer usage (which customers use API, how much?)
- Project revenue (£100K-1M annually is typical)
- Decide on grandfathering (existing users free or charged?)

Phase 2: Infrastructure and Billing (Month 2-4)
- Implement API usage tracking (metering)
- Set up billing system (Stripe, Zuora)
- Create usage dashboard (customers see real-time usage)
- Test billing accuracy (audit logs of API calls vs. charges)

Phase 3: Messaging and Launch (Month 4-5)
- Create developer documentation explaining pricing
- Launch with announcement (explain benefits: more investment in reliability, new features)
- Support migration (help customers understand their tier, upgrade if needed)

Phase 4: Optimization (Month 5+)
- Monitor adoption and revenue
- Adjust pricing if needed (too low = leaving money on table, too high = poor adoption)
- Identify high-value use cases and create premium tiers
- Build integrations and partner ecosystem

**API Monetization Economics**:

Calculate ROI:

Cost to monetize:
- Engineering (metering, billing): £50-100K
- Infrastructure (scaling, monitoring): £10-20K annually
- Support: £30-50K annually
- Total year 1: £90-170K

Expected revenue:
- Conservative: £100K annually
- Moderate: £300-500K annually
- Optimistic: £1M+ annually

ROI:
- Conservative: 0.6-1.1x (break-even first year)
- Moderate: 1.8-5x (very good)
- Optimistic: 5.9-11x (excellent)

Most companies see moderate to optimistic results, making API monetization a high-ROI investment.

The key: Start with tiered or freemium model, monitor adoption, optimize pricing based on demand.
`
      }
    ],
    relatedSlugs: [
      "pricing-strategy-saas",
      "product-adoption-feature-analytics",
      "revenue-operations-revops-strategy",
      "customer-segmentation-economics",
      "expansion-revenue-strategies"
    ],
    faq: [
      {
        q: "Should I monetize my API immediately or start free?",
        a: "Start free to build adoption. Monetize once you have 100+ API users and understand usage patterns (after 6-12 months). Premature monetization kills adoption."
      },
      {
        q: "What's a good per-request API pricing?",
        a: "Depends on complexity. Simple API: £0.001-0.01 per request. Complex (ML, compute-heavy): £0.10-1.00 per request. Reference competitor pricing."
      },
      {
        q: "How do you prevent customers from gaming the API pricing?",
        a: "Spending caps (limit their monthly bill), usage analytics (show them overage coming), clear T&Cs. Most customers are honest; bad actors are rare."
      },
      {
        q: "Should I offer free tier for API?",
        a: "Yes. Freemium tier (generous free limit) drives adoption. 1-5% convert to paid tier. Free tier is acquisition channel for API revenue."
      },
      {
        q: "What API monetization revenue is realistic?",
        a: "Conservative: 5-10% of total SaaS revenue. Aggressive: 15-20%. At £5M SaaS, £250K-1M API revenue is reasonable goal."
      }
    ],
    videoUrl: ""
  },
  {
    slug: "vendor-management-cost-optimization",
    title: "Vendor Management & Cost Optimization: Reducing Operational Expenses",
    description: "How to manage vendor relationships, negotiate contracts, consolidate tools, and optimize costs without sacrificing quality.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "vendor management",
      "cost optimization",
      "expense management",
      "contract negotiation",
      "vendor negotiation",
      "tool consolidation",
      "software spend",
      "operational costs",
      "budget optimization",
      "vendor strategy"
    ],
    keyTakeaways: [
      "Most SaaS companies waste 30-50% on redundant or poorly-negotiated vendor contracts; annual audit can save £50-500K without impacting business",
      "Negotiation leverage: At £1M+ annual spend with a vendor, you have leverage to negotiate 10-30% discounts; most companies pay list price (leaving discounts on table)",
      "Tool consolidation: Every software subscription is an obligation; consolidating from 50 tools to 30 tools (removing low-usage) saves £1-5K/month and improves productivity"
    ],
    content: [
      {
        heading: "Understanding Your Vendor Landscape",
        body: `Most CFOs can't quickly answer: "What are we spending on software and services?"

This is a problem. Vendor spend is typically 20-40% of operating expenses at growth-stage SaaS (after payroll).

£5M ARR company with 50 people:
- Total operating expenses: £3.5M annually
- Payroll: £2M (salary, benefits, taxes)
- Facilities: £300K (rent, utilities, office)
- Vendor spend: £1.2M annually (everything else)

Vendor spend breakdown:
- SaaS tools: £400K (Salesforce, Slack, Google, etc.)
- Cloud infrastructure: £300K (AWS, hosting)
- Services: £250K (legal, accounting, consulting)
- Other: £250K (insurance, contractors, miscellaneous)

Most companies don't optimize this category, leaving 20-30% savings on the table.

**Vendor Audit Process**:

Step 1: Inventory all vendors (month 1)
- Go through last 12 months of bank and credit card statements
- List every vendor with: name, description, annual cost, renewal date
- Create spreadsheet: Vendor, Cost, Renewal Date, Owner, Business Impact, Replacement Cost
- Expected findings: 80-150 vendors, 30-50% are redundant or low-usage

Step 2: Categorize vendors (week 2)
- Critical: Cannot operate without (Salesforce, AWS, Slack)
- Important: Significantly improve operations (analytics, legal, accounting)
- Optional: Nice-to-have, low impact if removed (stock photos, design tools)
- Redundant: Same function as another vendor (two email tools, two CRMs)

Step 3: Identify savings opportunities (week 3)

Opportunity 1: Redundant tools
- Example: Company uses HubSpot AND Salesforce (both £2K+/month)
- Action: Consolidate to one CRM, eliminate redundancy
- Savings: £24-48K annually

Opportunity 2: Unused licenses
- Example: 50 Salesforce licenses, only 35 people use it
- Action: Remove unused licenses, reduce to 35
- Savings: £500-1K per license × 15 licenses = £7.5-15K annually

Opportunity 3: Negotiation leverage
- Example: Paying £2K/month for vendor, at £24K annual spend
- Action: Negotiate volume discount (£24K spend merits 15-20% discount)
- Savings: £3.6-4.8K annually

Opportunity 4: Cheaper alternatives
- Example: Current tool costs £5K/month but newer competitor costs £2K/month with better features
- Action: Migrate to new tool (if switching cost is low)
- Savings: £36K annually

Step 4: Execute savings (month 2-3)
- Consolidate redundant tools (migrate off one, keep other)
- Remove unused licenses (contact vendor, adjust contract)
- Negotiate discounts (contact vendor, reference competitive alternatives)
- Migrate to cheaper alternatives (evaluate switching cost vs. savings, execute if justified)

Expected outcomes:
- Conservative: 15-20% spend reduction = £180K-240K savings
- Aggressive: 25-35% spend reduction = £300-420K savings
- Typical: 20% savings = £240K annually

**Vendor Negotiation Strategy**:

Most vendors expect negotiation (especially for multi-year contracts).

Step 1: Research alternatives
- Identify 2-3 competitive alternatives to your current vendor
- Get quotes from competitors (gives you pricing anchor)
- Have competitive quotes ready before calling vendor

Step 2: Contact vendor
- "We love your product, but we got a quote from [competitor] at [price]. Can you match or beat that?"
- Most vendors will negotiate rather than lose customer

Step 3: Negotiate terms
- Price: "Can you do 20% discount for 2-year commitment?"
- Payment: "Can we pay annually upfront for additional discount?"
- Features: "If we upgrade tier, can you discount the bundle?"

Step 4: Lock in savings
- Get written contract with new pricing
- Set renewal reminder 90 days before expiration
- Annually renegotiate (vendor pricing goes up, you re-negotiate)

Example negotiation:
- Current: £2K/month (£24K annual)
- Competitor offer: £1,600/month (£19.2K annual = 20% discount)
- Your ask: "Can you match £1,600/month for 2-year contract?"
- Vendor response: "We can do £1,750/month (12.5% discount) for 2 years"
- Your decision: Accept £1,750 = save £3K annually

Across 10 vendors, negotiating 12.5% discounts saves ~£30K annually.

**Tool Consolidation Strategy**:

Review your tech stack quarterly. Ask: "Can we do with fewer tools?"

Example stack:
- Email: Gmail + Mailchimp
- CRM: Salesforce + HubSpot (redundant!)
- Analytics: Google Analytics + Mixpanel + Amplitude
- Project management: Asana + Monday + Jira (redundant!)
- Communication: Slack + Microsoft Teams (redundant!)
- Document storage: Google Drive + Dropbox (redundant!)

Consolidated stack:
- Email: Gmail (all internal + marketing)
- CRM: Salesforce (single source of truth)
- Analytics: Mixpanel (most comprehensive)
- Project management: Asana (most mature)
- Communication: Slack (most popular)
- Document storage: Google Drive (integrated with Gmail/Workspace)

Cost before consolidation: £400K annually
Cost after consolidation: £250K annually
Savings: £150K annually

Plus non-financial benefits:
- Simpler stack (easier to train people)
- Better integrations (fewer tools to connect)
- Higher adoption (people don't switch between tools)

**Vendor Management Discipline**:

Implement quarterly vendor review:
- Every 3 months: Review top 20 vendors by spend
- Ask: Is this still delivering value?
- Benchmark against alternatives
- Renegotiate or replace underperforming vendors

Set spending cap:
- No new vendor contracts >£5K annually without CFO approval
- No new vendor contracts >£1K/month without business owner approval
- This prevents shadow spending (random tools purchased without oversight)

Annual budget review:
- Project vendor spend for next year
- Identify renegotiation opportunities
- Plan consolidations
- Budget for new tools strategically

Most companies save £100-500K annually through vendor management, without impacting business quality. It's one of the highest-ROI activities a finance team can do.
`
      }
    ],
    relatedSlugs: [
      "cost-management-optimization",
      "gross-margin-expansion",
      "burn-rate-management-cash-preservation",
      "annual-planning-budgets",
      "operational-efficiency-metrics"
    ],
    faq: [
      {
        q: "How often should I audit vendors?",
        a: "Annually minimum. Quarterly review of top 20 vendors by spend. At £5M+ ARR, consider quarterly full audit (one manager dedicated)."
      },
      {
        q: "What's a good target for negotiated discounts?",
        a: "10-20% off list price is typical for multi-year contracts. 20-30% if you have competitive alternatives. Some vendors offer 50%+ discounts if locked into 3-year."
      },
      {
        q: "Should I consolidate to fewer vendors or keep specialized tools?",
        a: "Balance: Consolidate redundant tools, keep specialized tools if they deliver clear ROI. Rule: No tool without clear owner and ROI justification."
      },
      {
        q: "How do you prevent team from buying unauthorized tools?",
        a: "Enforce spending cap (approval required for >£1K/month). Monthly credit card audit. Team policy (can't subscribe to new tools without approval)."
      },
      {
        q: "What's realistic vendor spend for a SaaS company?",
        a: "15-25% of operating expenses is typical. At £5M ARR with £3.5M opex, target £525-875K vendor spend. If higher, consolidation opportunity exists."
      }
    ],
    videoUrl: ""
  }
];

export default batch45Articles;