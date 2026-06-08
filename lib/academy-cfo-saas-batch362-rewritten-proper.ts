import { AcademyArticle } from "@/types/academy";

export const batch362Articles: AcademyArticle[] = [
  {
    slug: "land-and-expand-strategy-and-expansion-revenue",
    title: "Land and Expand Strategy and Expansion Revenue: Growing Within Customers",
    description: "Master land and expand. Grow existing customers, increase expansion revenue, improve LTV.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["land and expand", "expansion revenue", "customer expansion", "upsell", "cross-sell", "net revenue retention"],
    keyTakeaways: [
      "Land and expand: Acquire customer (small initial contract) → expand within customer (upsell, cross-sell) → grow lifetime value. Example: Land at £2K/month → expand to £5K/month (add departments) → expand to £10K/month (full platform adoption). Cost: Customer success, implementation support. ROI: Massive (expansion revenue is high-margin, predictable, builds from existing relationships).",
      "Expansion revenue types: (1) Upsell (same product, higher tier), (2) Cross-sell (different product to same customer), (3) Usage-based (customer grows usage, automatic price increase), (4) New departments (same product used by different part of org). Target: NRR >120% (for every £1 of churn, gain £1.20 from expansion). Current for healthy SaaS: 110-120%.",
      "Implementation: Clear product tiers (land at entry level), expansion triggers (usage milestones, new departments), CSM engagement (proactive expansion conversations), self-serve upgrade (easy for customers to expand). Cost: CSM team, product features for expansion. Timeline: 3-6 months for customer to expand. ROI: Expansion revenue is 80-90% margin (vs 40-50% new customer acquisition)."
    ],
    content: [
      {
        heading: "Building Land and Expand into Growth Model",
        body: `Creating expansion revenue through existing customer relationships.

**Land and expand fundamentals**

What is land and expand:
- Acquire customer with small initial contract (land)
- Grow customer spend over time through upsells, cross-sells, expansion (expand)
- Goal: Increase lifetime value through expansion revenue

Why it matters:
- Existing customers are more likely to buy (relationship exists)
- Expansion revenue has no acquisition cost (no CAC)
- Expansion revenue is high-margin (no sales commission usually)
- Expansion revenue is predictable (easier to forecast than new sales)

Example customer journey:

Month 1 (Land):
- Company signs contract: £2K/month
- Use case: Finance department, expense reporting
- Contract length: 1 year

Months 2-6 (Early expansion):
- Customer uses product more
- Finance team loves it
- HR department wants to use it (different use case)
- Expansion conversation: HR department onboarding
- Contract updated: £3.5K/month (add HR module)

Months 7-12 (Further expansion):
- HR team using product extensively
- Operations sees value (travel, vendor management)
- Cross-sell conversation: New vertical/module for operations
- Contract updated: £5.5K/month (add operations module)

End of Year 1:
- Started: £2K/month
- Ending: £5.5K/month (2.75x increase!)
- LTV increased substantially

Expansion revenue: £5.5K - £2K = £3.5K/month = £42K additional revenue from same customer

**Types of expansion revenue**

Type 1: Upsell

Definition: Customer moves to higher tier/plan of same product

Example:
- Current: Starter plan (£500/month, 10 users)
- Upsell: Professional plan (£2K/month, 100 users)
- Trigger: Customer hits user limit, needs more features
- Revenue impact: +£1.5K/month

Implementation:
- Clear pricing tiers (Starter, Professional, Enterprise)
- Product limits (Starter capped at 10 users)
- In-app notifications (User limit warning: "Upgrade to add more users")
- CSM outreach ("Noticed you're hitting limits, let's discuss upgrade")

Type 2: Cross-sell

Definition: Customer adds different product/module to their contract

Example:
- Current: CRM product (£5K/month)
- Cross-sell: Add analytics module (£2K/month)
- Trigger: Customer needs analytics for CRM data
- Revenue impact: +£2K/month

Implementation:
- Product portfolio (main product + adjacent modules)
- Customer discovery (what other needs do they have?)
- CSM outreach ("Noticed you need analytics, we have a solution")
- In-product suggestion (recommend module based on usage)

Type 3: Usage-based expansion

Definition: Customer's usage grows, price automatically increases

Example:
- Current: £0.50 per API call, customer making 1M calls = £500K/month
- Next month: Customer scaling, 1.5M calls = £750K/month
- No negotiation, automatic
- Revenue impact: +£250K/month (no effort)

Implementation:
- Pricing model: Per-unit (API call, data processed, user, etc.)
- Transparent tracking: Show customer their usage
- Incentives: Discount for annual commitment (reduce month-to-month volatility)
- Communication: Regular usage reports ("Your usage increased 50% this month")

Type 4: New department/use case

Definition: New department in same company adopts product for different use case

Example:
- Current: Sales team using CRM (£5K/month)
- Expansion: Marketing team wants to use same CRM for lead management (new use case)
- Contract updated: £8K/month (covers both teams)
- Revenue impact: +£3K/month

Implementation:
- Multi-use product (can serve multiple departments)
- Sales motion: CSM identifies other departments
- POC process: Let new department trial for free/low-cost
- Expansion contract: Formalize the new use case in contract

**Measuring expansion revenue**

Key metric: Net Revenue Retention (NRR)

Definition:
NRR = (Beginning ARR + Expansion revenue - Churned revenue) / Beginning ARR

Example:

Beginning ARR (start of period): £1M
- Expansion revenue (customers grew): +£250K
- Churn (customers left): -£100K
- Ending ARR: £1.15M

NRR = (£1M + £250K - £100K) / £1M = 115%

Interpretation:
- 115% NRR means for every £1 of customer ARR, gained £1.15 (expansion revenue exceeded churn)
- Excellent for SaaS (shows strong expansion)

Benchmarks:

| NRR | Interpretation |
|---|---|
| <100% | Bad (churn exceeds expansion) |
| 100-110% | OK (growing but churn is issue) |
| 110-120% | Good (healthy expansion) |
| 120-130% | Excellent (strong expansion, low churn) |
| >130% | Exceptional (very strong expansion) |

Expansion revenue vs new revenue:

| Metric | Definition |
|---|---|
| New revenue | ARR from new customers acquired |
| Expansion revenue | ARR from existing customers growing |
| Net revenue growth | New revenue - churn + expansion |

Example:

Q1 metrics:
- Beginning ARR: £1M
- New customer revenue: £300K
- Expansion revenue: £150K
- Churn: -£80K
- Ending ARR: £1.37M

Net revenue growth: (£300K + £150K) - £80K = £370K
NRR: (£1M + £150K - £80K) / £1M = 107%

**Implementing land and expand**

Step 1: Product tier strategy

Create clear tiers for customers to graduate:

Tier 1 - Starter:
- Price: £500/month
- Users: Up to 10
- Features: Core functionality
- Use case: Small team/department

Tier 2 - Professional:
- Price: £2K/month
- Users: Up to 100
- Features: Advanced (reporting, integrations, API)
- Use case: Mid-size department/team

Tier 3 - Enterprise:
- Price: £10K+/month
- Users: Unlimited
- Features: Premium (custom integrations, dedicated support, SLA)
- Use case: Large company, multiple departments

Transition:
- Customer starts at Starter (low risk, easy land)
- Graduates to Professional (as they grow)
- Potentially expands to Enterprise (widespread adoption)

Step 2: Identify expansion triggers

Create internal alerts for expansion opportunities:

Trigger 1: Usage-based
- "Customer approaching user limit" → Upgrade conversation
- "Customer using API extensively" → Suggest higher tier
- "Customer using advanced features" → Suggest professional tier

Trigger 2: Time-based
- "Contract up for renewal" → Expansion conversation
- "Customer 6 months in" → Check-in for expansion needs

Trigger 3: Event-based
- "New department adopted product" → Formalize expansion contract
- "Customer added new integration" → Cross-sell analytics

Trigger 4: Behavior-based
- "Customer activity increasing" → Proactive expansion conversation
- "Customer asking advanced questions" → Suggest professional tier

Step 3: Customer success team structure

Assign CSMs to drive expansion:

CSM role:
- Regular check-ins (monthly QBRs)
- Expansion conversations ("What else do you need?")
- Feature education (teach customers about advanced features)
- Health scoring (who's ready to expand?)
- Expansion pitch ("You've been using this 6 months, let's expand to...")

CSM targets:
- NRR impact (CSM responsible for expansion)
- Revenue per customer (average contract growth)
- Expansion rate (% of customers expanding)

Step 4: Product capabilities for expansion

Build product features that facilitate expansion:

Feature 1: Add-ons/modules
- Make it easy for customer to add new modules
- Pricing visible (what will new module cost?)
- One-click upgrade (minimal friction)

Feature 2: Multi-department support
- Allow multiple teams/departments to use same account
- Role-based access (each team has different access)
- Usage tracking by department (show value by team)

Feature 3: Self-serve upgrade
- Allow customer to upgrade without calling sales
- Automatic upgrade when hitting limits (or warning first)
- Transparent pricing (customer knows cost before upgrading)

Feature 4: Usage dashboard
- Show customer their usage trend
- Highlight approaching limits
- Recommend upgrade path
- Celebrate milestones ("You're now using 80 users, 8 above your current limit")

**Expansion revenue by business model**

SaaS subscription model:

Land contract: £2K/month (1 department)
Expansion options:
- Upsell to higher tier: £5K/month (more features/users)
- Cross-sell: Add module for £2K/month
- Usage-based: Auto-increase with team growth

Target expansion revenue: 20-30% of new customer revenue

Usage-based model (API, data processing):

Land contract: £0.10 per unit, £5K/month (current usage)
Expansion: As customer scales, usage increases
- 3 months later: £0.10 per unit, £8K/month (+60%)
- 6 months later: £0.10 per unit, £12K/month (+140%)
- 12 months later: £0.10 per unit, £20K/month (+300%)

Target expansion revenue: 30-50% of original revenue (automatic with customer growth)

Enterprise/seat-based model:

Land contract: £1K per seat per month, 20 seats = £20K/month
Expansion options:
- Add seats: £1K per seat (20 → 50 seats = +£30K)
- Upgrade support tier: Add SLA, dedicated support
- Platform expansion: Add different modules

Target expansion revenue: 15-25% of new customer revenue

**Common expansion mistakes**

Mistake 1: Focus only on new customers
- Problem: Acquire customer at £2K/month, never expand (stay at £2K)
- Result: Lower LTV (expansion revenue never realized)
- Fix: CSM team focused on expansion, tracked metrics
- Impact: NRR >110% (healthy)

Mistake 2: Product doesn't support expansion
- Problem: Can't easily add seats, modules, or move to higher tier
- Result: Customers want to expand but can't (friction)
- Fix: Build product features for easy expansion
- Impact: Higher expansion rates

Mistake 3: No expansion motion
- Problem: Expansion opportunities exist but no one talks to customers about them
- Result: Lost expansion revenue
- Fix: CSM team (QBRs, conversations, education)
- Impact: Expansion revenue realized

Mistake 4: Land at wrong price point
- Problem: Land at enterprise price (£50K/month), no room to expand
- Result: Can't grow customer from there
- Fix: Land at lower tier (£5K/month), expand to £20K over time
- Impact: Higher LTV through expansion

Mistake 5: Don't measure expansion
- Problem: Don't track NRR, don't know expansion rate
- Result: Can't identify problems or improvements
- Fix: Track NRR monthly, monitor expansion rate by cohort
- Impact: Data-driven expansion improvements

`
      }
    ],
    relatedSlugs: ["unit-economics-ltv-and-cac-payback", "customer-lifetime-value-optimization", "retention-and-churn-reduction-mechanics", "customer-success-metrics-and-program-design", "metrics-dashboard-design-kpi-tracking"],
    faq: [
      { q: "What is land and expand and how does it work?", a: "Land: Acquire customer with small initial contract (low risk). Expand: Grow customer spend over time through upsells, cross-sells, new departments, or usage growth. Example: Start at £2K/month → expand to £5K → £10K. Cost: Customer success, expansion motion. ROI: High (expansion revenue is high-margin, no acquisition cost)." },
      { q: "What is net revenue retention and what's a healthy NRR?", a: "NRR = (Beginning ARR + Expansion revenue - Churn) / Beginning ARR. Example: £1M + £250K - £100K = £1.15M, NRR = 115%. Benchmarks: <100% bad, 100-110% OK, 110-120% good, 120-130% excellent, >130% exceptional. Healthy SaaS target: 110-120%." },
      { q: "What types of expansion revenue exist?", a: "Types: (1) Upsell (higher tier of same product), (2) Cross-sell (different product/module), (3) Usage-based (customer grows usage automatically), (4) New department (new team/department adopts product). Implementation: Clear pricing tiers, expansion triggers, CSM engagement, self-serve upgrade. Target: 20-30% of new customer revenue (usage-based can be 30-50%)." }
    ],
    videoUrl: ""
  }
];

export default batch362Articles;