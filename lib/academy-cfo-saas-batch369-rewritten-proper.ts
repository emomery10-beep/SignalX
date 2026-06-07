import { AcademyArticle } from "@/types/academy";

export const batch369Articles: AcademyArticle[] = [
  {
    slug: "saas-pricing-strategy-and-monetisation",
    title: "SaaS Pricing Strategy and Monetisation: Maximising Revenue per Customer",
    description: "Master SaaS pricing. Design pricing tiers, optimise monetisation, increase ARPU.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["pricing strategy", "monetisation", "ARPU", "pricing tiers", "value-based pricing"],
    keyTakeaways: [
      "Value-based pricing: Price based on customer value delivered, not cost. Example: Your tool saves customers 10 hours/week (£500 value at £50/hour). Price: £200/month (40% of value = reasonable). Cost-plus pricing (markup on costs) typically underprices SaaS. Willingness-to-pay research: Survey customers at different price points. Van Westendorp analysis gives price range. ROI: 10-30% revenue increase from pricing optimisation.",
      "Pricing tier design: Good-Better-Best model (3 tiers). Free/Starter: Limited features, usage caps (acquisition). Professional: Core features, moderate usage (main revenue). Enterprise: Full features, unlimited usage, support (high ARPU). Example: Starter £0, Pro £49/month, Enterprise £199/month. Anchor effect: Enterprise price makes Pro look reasonable. Target: 60-70% of paying customers on middle tier.",
      "Usage-based pricing: Charge per unit of consumption (API calls, seats, storage). Hybrid model: Base platform fee + usage. Example: £99/month base + £0.01 per API call. Benefits: Revenue grows with customer usage, lower barrier to entry. Risks: Revenue volatility, harder to forecast. Best for: Infrastructure, developer tools, data platforms. Track net dollar retention (target >120% with usage growth)."
    ],
    content: [
      {
        heading: "Designing and Optimising SaaS Pricing Strategy",
        body: `Building pricing that maximises revenue and customer lifetime value.

**Pricing model fundamentals**

Pricing approaches:

Cost-plus pricing:
- Calculate cost to serve customer, add margin
- Example: Cost £10/month per customer, price at £30 (3x markup)
- Problem: Ignores value delivered (usually underprices)
- When to use: Commodity products, competitive markets

Competitor-based pricing:
- Price relative to competitors
- Example: Competitor charges £50/month, price at £45 (slight undercut)
- Problem: Race to bottom, ignores your unique value
- When to use: Commoditised market, switching costs low

Value-based pricing:
- Price based on value delivered to customer
- Example: Save customer 10 hours/week = £500/week value
- Price: £200/month (capture 10% of monthly value)
- When to use: Differentiated product, clear ROI

How to determine value:

Step 1: Identify value metrics
- Time saved (hours per week × hourly rate)
- Revenue generated (additional revenue attributable to product)
- Cost avoided (expenses eliminated by using product)
- Risk reduced (potential losses prevented)

Step 2: Quantify value
- Survey customers: "How much time does our product save you?"
- Analyse data: Before/after customer outcomes
- Case studies: Document specific ROI examples

Step 3: Set price at 10-30% of value
- Example: Product delivers £1,000/month value
- Price: £100-300/month (10-30% value capture)
- Below 10%: Leaving money on table
- Above 30%: Customers question ROI

**Good-Better-Best tier design**

Three-tier pricing:

Tier 1 — Starter/Basic:
- Purpose: Acquisition (get customers in the door)
- Features: Core functionality, limited usage
- Price: Free or low (£0-29/month)
- Target: Small teams, individual users
- Revenue: 10-15% of total

Tier 2 — Professional/Growth:
- Purpose: Main revenue driver
- Features: Full core features, moderate usage limits
- Price: Mid-range (£49-199/month)
- Target: Growing teams, SMBs
- Revenue: 60-70% of total

Tier 3 — Enterprise/Scale:
- Purpose: High ARPU, anchor pricing
- Features: Everything + advanced features, unlimited usage, priority support
- Price: Premium (£199-999+/month)
- Target: Large companies, regulated industries
- Revenue: 20-30% of total

Feature gating strategy:

What to include in each tier:

Starter:
- Core product functionality
- Limited seats (1-3 users)
- Basic integrations
- Community support
- Usage limits (e.g., 1,000 API calls/month)

Professional:
- Everything in Starter
- More seats (5-25 users)
- Advanced features (analytics, reporting)
- Standard integrations
- Email support
- Higher usage limits (10,000 API calls/month)

Enterprise:
- Everything in Professional
- Unlimited seats
- Premium features (SSO, audit logs, custom roles)
- Advanced integrations (custom API)
- Priority support (SLA)
- Unlimited usage

Pricing page design:

Highlight middle tier:
- "Most Popular" or "Best Value" badge
- Visual emphasis (larger, different colour)
- Anchoring: Enterprise price makes Pro look affordable

Example pricing page:

| Feature | Starter (£0) | Pro (£49/mo) | Enterprise (£199/mo) |
|---|---|---|---|
| Users | 3 | 25 | Unlimited |
| Projects | 5 | 50 | Unlimited |
| API calls | 1K/mo | 10K/mo | Unlimited |
| Integrations | Basic | Standard | Custom |
| Support | Community | Email | Priority |
| SSO | — | — | Yes |
| Analytics | Basic | Advanced | Custom |

**Usage-based pricing models**

Pure usage-based:
- Charge only for consumption
- Example: £0.01 per API call, £0.10 per GB stored
- Pros: Low barrier, revenue grows with usage
- Cons: Revenue volatile, hard to forecast

Hybrid (platform + usage):
- Base platform fee + usage charges
- Example: £99/month + £0.005 per API call
- Pros: Predictable base + growth upside
- Cons: More complex pricing page

Tiered usage:
- Different rates at different usage levels
- Example: First 1,000 calls free, next 10,000 at £0.01, above 10,000 at £0.005
- Pros: Encourages usage, rewards growth
- Cons: Complex billing

Per-seat pricing:
- Charge per user
- Example: £15/user/month
- Pros: Simple, predictable, grows with team
- Cons: Discourages broad adoption, teams share logins

Which model to choose:

| Product type | Recommended model | Example |
|---|---|---|
| Collaboration tool | Per-seat | Slack, Notion |
| Developer tool | Usage-based | AWS, Stripe |
| Analytics | Hybrid | Mixpanel, Amplitude |
| CRM | Per-seat | Salesforce, HubSpot |
| Infrastructure | Usage-based | Twilio, SendGrid |
| Security | Tiered | Okta, CrowdStrike |

**Pricing optimisation techniques**

Annual vs monthly pricing:

Monthly: £100/month (£1,200/year)
Annual: £80/month (£960/year, 20% discount)

Why offer annual discount:
- Cash flow: Collect upfront
- Retention: Lower annual churn
- LTV: Higher despite discount

Optimal discount: 15-25% for annual

Price anchoring:

Show highest price first (or prominently)
- Enterprise at £499 makes Pro at £149 look reasonable
- "Was £199, now £149" for limited time offer

Decoy pricing:

Add a tier that makes target tier look better
- Starter: £29 (5 features)
- Pro: £49 (15 features) ← target
- Pro+: £59 (16 features) ← decoy (only 1 more feature for £10)
- Makes Pro look like best value

Psychological pricing:

£49 vs £50 (charm pricing)
- Studies show 8-15% higher conversion at £49
- Use .99 for B2C, whole numbers for B2B enterprise

Bundling:

Combine products for perceived value
- Product A: £30/month
- Product B: £30/month
- Bundle: £45/month (25% savings)
- Impact: Higher ARPU, cross-sell

**Pricing experiments**

How to test pricing:

A/B testing pricing pages:
- Show different prices to different cohorts
- Measure conversion rate and revenue per visitor
- Example: Test £49 vs £59 for Pro tier
- If £59 has 10% lower conversion but 20% higher revenue = net positive

Grandfathering:
- New price for new customers
- Existing customers keep old price (for period)
- Reduces churn risk from price increase

Price increase communication:
- 60-90 days notice (contractual minimum)
- Explain value added since last pricing
- Offer annual lock-in at old price
- Example email: "We're updating pricing to reflect new features. Your new price: £59/month (from £49). Lock in current price with annual plan."

**Metrics to track**

ARPU (Average Revenue Per User):
- Total MRR / Total customers
- Track monthly, segment by tier
- Target: Growing ARPU over time

Price elasticity:
- % change in demand / % change in price
- If demand drops 5% for 10% price increase = 0.5 elasticity (inelastic, good)
- If demand drops 15% for 10% price increase = 1.5 elasticity (elastic, careful)

Conversion by tier:
- % of visitors who convert to each tier
- Healthy: 2-5% visitor-to-trial, 20-40% trial-to-paid
- Track which tier converts best

Expansion revenue:
- Revenue from upsells and upgrades
- Target: 20-40% of new MRR from existing customers
- Indicates pricing has room to grow

`
      }
    ],
    relatedSlugs: ["unit-economics-ltv-and-cac-payback", "revenue-recognition-and-deferred-revenue", "customer-acquisition-strategy-and-marketing-roi", "land-and-expand-strategy-expansion-revenue", "metrics-dashboard-design-kpi-tracking"],
    faq: [
      { q: "How should I price my SaaS product?", a: "Use value-based pricing: Price at 10-30% of the value you deliver. Example: Save customers £1,000/month → price £100-300/month. Use Good-Better-Best tiers: Starter (acquisition), Pro (main revenue, 60-70% of customers), Enterprise (high ARPU). Highlight middle tier as 'Most Popular'. Test pricing with A/B experiments." },
      { q: "Should I use per-seat or usage-based pricing?", a: "Depends on product type. Per-seat: Best for collaboration tools (Slack, CRM). Usage-based: Best for infrastructure/developer tools (API, storage). Hybrid (base + usage): Best balance for most SaaS. Per-seat is simpler to understand; usage-based grows with customer but is harder to forecast. Consider your customers' mental model of value." },
      { q: "How much discount for annual billing?", a: "Optimal: 15-25% discount for annual prepayment. Example: Monthly £100/month (£1,200/year), Annual £80/month (£960/year, 20% off). ROI: Upfront cash flow + lower churn outweighs discount. Target: 40-60% of customers on annual plans. Above 25% discount usually unnecessary — test incrementally." }
    ],
    videoUrl: ""
  }
];

export default batch369Articles;
