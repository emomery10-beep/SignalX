import { AcademyArticle } from "@/types/academy";

export const batch106Articles: AcademyArticle[] = [
  {
    slug: "pricing-psychology-packaging",
    title: "Pricing Psychology and Packaging: Optimizing Price Points and Tiers",
    description: "Master pricing psychology and product packaging. Design pricing tiers to maximize revenue and align with customer value.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "pricing psychology",
      "pricing tiers",
      "product packaging",
      "value-based pricing",
      "price optimization",
      "willingness to pay",
      "anchoring",
      "pricing strategy",
      "customer segments",
      "revenue optimization"
    ],
    keyTakeaways: [
      "Price anchoring: First price customers see becomes reference point; example: Show £500/mo plan first (anchor), then £200/mo (looks cheap), then £1000/mo (looks premium) = customers cluster around £200-500 (middle tier). If show £200/mo first, customers anchor lower. First price displayed drives perception of all prices. Use higher anchor to shift perception upward",
      "Tiering strategy: Create good/better/best (3 tiers typical); eliminate lowest tier price resistance (customers feel they need to upgrade); include feature differences (storage, users, integrations) not just capacity; typical pricing: £50/mo (starter), £200/mo (growth, 4x), £500/mo (enterprise). Price difference drives tier adoption. If tiers too close (£50, £75, £100), customers stuck in bottom tier",
      "Willingness to pay varies by segment: SMB willing to pay £100/mo max (budget constrained), mid-market £500-2K/mo, enterprise £5K+/mo (value-based, ROI justifies); research WTP by segment (surveys, pricing experiments), then set tiers accordingly. Misaligned pricing (charge SMB £5K/mo) = no adoption; (charge enterprise £100/mo) = leaving revenue on table (should charge 10-50x more)"
    ],
    content: [
      {
        heading: "Pricing Psychology Fundamentals",
        body: `Pricing is psychology as much as economics. Small changes in how you present prices drive large changes in customer behavior.

**Anchoring Effect**

Definition: First price customers see becomes mental reference point. All other prices judged relative to anchor.

Example:

Scenario A (High anchor):
- Show three tiers: £500/mo, £1000/mo, £2000/mo
- Most customers choose £500/mo (lowest visible price)
- Average price per customer: £800/mo

Scenario B (Low anchor):
- Show three tiers: £200/mo, £400/mo, £600/mo
- Most customers choose £200/mo (lowest visible price)
- Average price per customer: £350/mo

Same product, same value, 2.3x revenue difference just from anchor.

The £500/mo price in Scenario A anchors customers high (£500 looks reasonable vs £2000). The £200/mo in Scenario B anchors customers low (£200 looks like the base).

Application:
- Always show highest-value plan first (anchors customers high)
- Then show mid-tier plan (where most customers choose)
- Then show low-tier plan (for price-sensitive)

This increases adoption of mid-tier (highest margin plan).

**Charm Pricing (Price Ending Bias)**

Definition: Prices ending in .99 feel cheaper than round numbers, even though difference is minimal.

Example:

£199/mo vs £200/mo:
- £199 feels significantly cheaper (customer reads as "£1XX", not £2XX)
- Adoption of £199 plan: 30% higher than £200
- Revenue per customer: Only 0.5% lower (£199 vs £200)
- Net: +29.5% more customers for 0.5% lower price per customer

This is counter-intuitive but well-tested in pricing research.

Application:
- Use .99, .95, .97 pricing (not .00)
- Psychological price brackets matter more than actual pence

**The Decoy Effect**

Definition: Adding a third option (decoy) changes customer preference between two options.

Example:

Two plans originally:
- Plan A (Basic): £100/mo, 100 users
- Plan B (Pro): £300/mo, unlimited users
- 40% choose Plan A, 60% choose Plan B
- ARPU: £220/mo

Add a decoy plan:
- Plan A (Basic): £100/mo, 100 users
- Plan B (Decoy): £280/mo, unlimited users (almost as good as Pro, cheaper)
- Plan C (Pro): £300/mo, 2x features + unlimited users

New customer distribution:
- Plan A: 30%
- Plan B: 20% (the decoy)
- Plan C: 50%
- ARPU: £245/mo

By adding a plan that's slightly worse but cheaper than the premium plan, more customers upgrade to the premium plan (to avoid the decoy that's "not quite good enough").

Application:
- Add a mid-tier plan that's less attractive than your top plan
- Increases adoption of your premium plan
- Works better than just having two options

**Tiering Strategy: Good/Better/Best**

Standard SaaS pricing uses three tiers:

Good (Basic): Low price, essential features
- Goal: Attract price-sensitive customers
- Example: £50/mo, 1 user, 100GB storage, email support
- Why needed: Converts SMB customers who can't afford mid-tier

Better (Growth): Mid-price, most features
- Goal: Maximize revenue (where most customers land)
- Example: £200/mo, 5 users, unlimited storage, priority support
- Why needed: Sweet spot for growing companies
- Typically: 50-60% of customers in this tier

Best (Enterprise): High price, all features + custom
- Goal: Capture enterprise customers (high LTV)
- Example: £500+/mo, unlimited users, custom features, dedicated support
- Why needed: Enterprise customers have different needs and budget

Pricing ratios:
- Good to Better: 4x (£50 → £200)
- Better to Best: 2.5x (£200 → £500)
- Good to Best: 10x (£50 → £500)

These ratios prevent customers from skipping mid-tier.

**Feature Packaging by Tier**

Don't differentiate tiers by capacity alone. Include:

Plan A (Basic):
- Features: Core product only
- Users: 1 user
- Storage: 100GB
- Integrations: 5 integrations
- Support: Email only
- Updates: Standard release cycle

Plan B (Growth):
- Features: Core + advanced features
- Users: 5 users
- Storage: Unlimited
- Integrations: 50 integrations
- Support: Chat + email, 1-hour response
- Updates: Priority features

Plan C (Enterprise):
- Features: Everything + custom
- Users: Unlimited
- Storage: Unlimited
- Integrations: Unlimited + custom
- Support: Dedicated account manager
- Updates: Custom feature development

By tier, also vary:
- Speed of feature updates (enterprise gets priority)
- Support response time (enterprise gets fastest)
- Customization (enterprise gets most)

This justifies 10x price difference (not just more storage).

**Willingness to Pay by Segment**

Research shows different segments have different budgets:

SMB (1-50 employees):
- Monthly budget for software: £100-500/mo
- Decision speed: Fast (1-2 decision-makers)
- Example pricing: £50-200/mo works

Mid-Market (50-1000 employees):
- Monthly budget for software: £500-5K/mo
- Decision speed: Moderate (3-5 decision-makers)
- Example pricing: £200-2K/mo works

Enterprise (1000+ employees):
- Monthly budget for software: £5K-50K+/mo
- Decision speed: Slow (5+ decision-makers, procurement)
- Example pricing: £2K-50K+/mo works

Pricing mismatch examples:

Charge SMB £5K/mo: No adoption (outside budget)
Charge Enterprise £100/mo: High adoption but leaving £10K/mo on table (underpriced)

Solution: Segment-based pricing
- SMB plan: £50-200/mo (affordable)
- Mid-Market plan: £500-2K/mo (more features)
- Enterprise plan: £5K+/mo or custom

OR: Dynamic pricing based on employee count
- 1-10 employees: £50/mo
- 11-50 employees: £200/mo
- 51-500 employees: £1K/mo
- 500+ employees: Custom pricing

**Price Testing Methods**

Method 1: Van Westendorp Price Sensitivity Meter
- Ask customers: What price is too cheap? Too expensive? Good price? Won't buy?
- Plot responses, find optimal price point
- Time-intensive but accurate

Method 2: A/B Testing
- Show Segment A pricing of £100/mo
- Show Segment B pricing of £200/mo
- Compare conversion rates
- Optimal price = highest revenue per visitor

Example result:
- £100/mo: 20% conversion, ARPU £100
- £200/mo: 10% conversion, ARPU £200
- Net revenue: £100 (same)
- But customer lifetime value differs (higher price = more serious customers)

Method 3: Price Testing via Competitor Research
- Look at 5-10 similar SaaS products
- Note their pricing
- Position yourself higher/lower based on differentiation
- If better product, charge more
- If worse product, charge less

Method 4: Customer Survey
- Direct question: "What's the maximum you'd pay?"
- Usually over-estimates (customers say higher than actual WTP)
- But gives directional guidance

**Common Pricing Mistakes**

Mistake 1: All customers on same price
- Problem: Charge £100/mo for all
- SMB happy, but Enterprise only pays £100 (should be £5K)
- Solution: Segment-based pricing

Mistake 2: Tiers too close together
- Problem: £100, £150, £200/mo (tiers only 1.5x apart)
- Result: Most customers stick with cheapest
- Solution: Make tiers 3-4x apart (£100, £300, £1000)

Mistake 3: Too many tiers
- Problem: 5-6 pricing tiers (confusing)
- Result: Decision paralysis, lower conversion
- Solution: 3 tiers (good/better/best)

Mistake 4: Features too similar across tiers
- Problem: Basic and Growth are almost identical
- Result: No incentive to upgrade
- Solution: Clear feature differences per tier

Mistake 5: Not adjusting for customer segment
- Problem: Charge same price to SMB and enterprise
- Result: Lose enterprise (underpriced) or SMB (overpriced)
- Solution: Different price tiers or dynamic pricing

**Psychological Pricing Tactics**

1. Show value first, price second
- Say: "Get unlimited storage, priority support, and advanced analytics for £200/mo"
- Don't say: "£200/mo"
- Anchors customer on value, not price

2. Show savings
- "Save 20% with annual billing: £200/mo × 10 months = £2000/year"
- Anchors on annual number (feels like savings)

3. Use relative pricing
- "1.5x the features for 0.5x more price"
- Customers like relative deals

4. Trial pricing
- Offer 14-day free trial (removes price barrier)
- Most free trial users convert to paying customers
- Price sticker shock removed during free trial

5. Money-back guarantee
- "30-day money-back guarantee if not satisfied"
- Removes purchase risk
- Increases conversion (customers more willing to try)

The psychology of pricing is powerful. Small tweaks in price presentation drive 20-50% changes in revenue per customer.
`
      }
    ],
    relatedSlugs: [
      "pricing-strategy-and-tier-design",
      "customer-acquisition-cost-optimization",
      "unit-economics-deep-dive",
      "sales-pipeline-management-forecasting",
      "financial-forecasting-modeling"
    ],
    faq: [
      {
        q: "How many pricing tiers should I have?",
        a: "Three is optimal: Good/Better/Best. Two is too simple (leaves revenue on table). Four+ is confusing. Three maximizes revenue and minimizes decision paralysis."
      },
      {
        q: "Should I use charm pricing (.99)?",
        a: "Yes. £199/mo converts 30% better than £200/mo with <1% revenue loss. Psychological price brackets matter more than actual amount."
      },
      {
        q: "How do I price for different segments?",
        a: "Research willingness to pay by segment (SMB, mid-market, enterprise). Create segment-specific tiers or use dynamic pricing based on company size."
      },
      {
        q: "What pricing ratio should I use between tiers?",
        a: "3-4x between tiers (e.g., £100, £300, £1000). Too close (<2x) and everyone buys cheapest. Too far (>5x) and few upgrade."
      }
    ],
    videoUrl: ""
  }
];

export default batch106Articles;
