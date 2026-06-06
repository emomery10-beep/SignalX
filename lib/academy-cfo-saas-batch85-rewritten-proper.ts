import { AcademyArticle } from "@/types/academy";

export const batch85Articles: AcademyArticle[] = [
  {
    slug: "gross-margin-expansion",
    title: "Gross Margin Expansion: Improving Profitability by Reducing Cost of Goods Sold",
    description: "Understand gross margin and how to improve it through cost optimization. Gross margin expansion is the path to profitability.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 6,
    keywords: [
      "gross margin",
      "margin expansion",
      "COGS",
      "cost of goods sold",
      "profitability",
      "cost optimization",
      "pricing",
      "operating leverage",
      "SaaS margin",
      "unit economics"
    ],
    keyTakeaways: [
      "Gross margin = (Revenue − COGS) ÷ Revenue; example: £1M revenue, £300K COGS = (£1M − £300K) ÷ £1M = 70% GM; typical SaaS: 70-85% GM (COGS is 15-30% of revenue); high GM companies (>80%) are more profitable at scale; SaaS natural advantage: software is high margin (once built, cost of serving more customers is low, not like manufacturing)",
      "COGS includes: cloud infrastructure (AWS, hosting), payment processing (2-3%), 3rd party APIs/licenses, support costs (sometimes), cost of customer acquisition (sometimes in blended view); NOT: salaries, marketing, R&D (those are OpEx); track COGS per customer and total COGS as % of revenue (watch for increasing ratio = bad)",
      "Improve GM: Negotiate AWS rates (volume discount), optimize code (fewer servers), move to cheaper infrastructure, increase pricing (doesn't affect COGS, pure margin), or reduce support costs (automation, self-serve); typical roadmap: 70% GM → 75% → 80% as company scales; 5% GM improvement = 5-10% operating margin improvement at £10M+ ARR"
    ],
    content: [
      {
        heading: "Understanding Gross Margin",
        body: `Gross Margin (GM) is the percentage of revenue left after paying the direct costs of delivering your product.

**Gross Margin Formula**

\`\`\`
Gross margin = (Revenue − COGS) ÷ Revenue
\`\`\`

Or as percentage:
\`\`\`
Gross margin % = ((Revenue − COGS) ÷ Revenue) × 100
\`\`\`

**What's Included in COGS?**

COGS (Cost of Goods Sold) includes direct costs to deliver the service:

✓ Included in COGS:
- Cloud infrastructure (AWS, Azure, GCP)
- Payment processing fees (2-3% of payment)
- Third-party APIs (Stripe, Twilio, etc.)
- Support/customer success (sometimes, if labor-intensive)
- Cost of data (if data licensing)

✗ NOT included in COGS:
- Employee salaries (OpEx, not COGS)
- Marketing spend (OpEx, not COGS)
- R&D (OpEx, not COGS)
- G&A (OpEx, not COGS)
- Rent/facilities (OpEx, not COGS)

**Gross Margin Examples**

Example 1: Typical SaaS

Revenue: £1M
COGS: £250K (AWS £150K, payment processing £30K, APIs £40K, support £30K)
Gross profit: £750K
Gross margin: 75%

Example 2: High-scale SaaS

Revenue: £10M
COGS: £1.5M (AWS £800K, payment processing £150K, APIs £400K, support £150K)
Gross profit: £8.5M
Gross margin: 85%

Difference: Same product, same cost structure (per unit), but higher margin at scale (infrastructure better utilized).

Example 3: Low-margin SaaS (heavy support)

Revenue: £5M
COGS: £1.75M (AWS £500K, payment processing £200K, APIs £400K, support £650K)
Gross profit: £3.25M
Gross margin: 65%

Low margin due to labor-intensive support.

**Gross Margin by Company Stage**

| Stage | Typical GM | Why |
|-------|----------|-----|
| Early (£1M ARR) | 60-70% | High AWS spend relative to revenue, basic support |
| Growth (£5M ARR) | 70-75% | Better utilization, process improvements |
| Scale (£20M+ ARR) | 75-85% | High utilization, mature optimization |
| Mature (£100M+ ARR) | 80-90% | Near-optimal infrastructure, automation |

As you scale, gross margin improves naturally (economies of scale).

**Gross Margin vs. Operating Margin**

Don't confuse gross margin with operating margin:

| Metric | Formula | What it includes |
|--------|---------|----------|
| Gross margin | (Revenue − COGS) ÷ Revenue | After product costs, before OpEx |
| Operating margin | (Revenue − COGS − OpEx) ÷ Revenue | After all costs |

Example:

Revenue: £10M
COGS: £2M
Gross profit: £8M (80% GM)
OpEx: £6M (salaries, marketing, rent)
Operating profit: £2M (20% OM)

Gross margin: 80% (profit available for operations)
Operating margin: 20% (profit after all expenses)

Both matter: High GM provides cushion for OpEx, high OM shows profitable company.

**How to Improve Gross Margin**

Three levers:

**Lever 1: Reduce COGS per customer**

Option A: Negotiate better rates
- AWS: Volume discount (from £1/customer to £0.80/customer)
- Payment processor: Lower % fee (from 3% to 2.5%)
- APIs: Bulk contract (from per-call to flat monthly)
- Impact: 10-20% COGS reduction without revenue change

Option B: Optimize infrastructure
- Reduce servers: Better code, caching, optimization
- Consolidate tools: One analytics provider instead of three
- Auto-scaling: Only pay for compute when needed
- Impact: 15-30% COGS reduction

Option C: Reduce support costs
- Build self-serve help center (reduce live support)
- Implement chatbots (automate common questions)
- Improve product (fewer support tickets)
- Impact: 20-40% support cost reduction (if applicable)

**Lever 2: Increase prices** (doesn't change COGS, improves GM)

Current: £10/customer, £3 COGS = 70% GM
New: £12/customer, £3 COGS = 75% GM

Price increase 20%, but same COGS = 5% GM improvement.

But: Price increase may cause churn (elasticity).

Test: Raise prices 10% on new customers, measure churn impact.

If <5% churn: Revenue up 10% − churn impact = net positive.

**Lever 3: Change product mix** (shift toward high-margin features)

If product has multiple tiers:
- Basic: Low COGS, low price, 60% margin
- Pro: Medium COGS, medium price, 75% margin
- Enterprise: High COGS, high price, 80% margin

Shift customer mix toward Enterprise (higher margin):
- Reduce new acquisitions in Basic (lowest margin)
- Focus sales on Enterprise (highest margin)
- Overall product GM improves

**Improving Gross Margin: Implementation**

Typical roadmap to improve from 70% to 80% GM:

**Month 1-2: Audit COGS**
- Break down COGS by component (AWS, payment processing, support, etc.)
- Identify largest cost drivers
- Track COGS per customer

**Month 3-4: Quick wins** (10-15% reduction)
- Negotiate AWS volume discount (5% savings)
- Optimize code for fewer servers (5% savings)
- Implement chatbot for support (5% savings)
- New GM: 70% → 73-74%

**Month 5-6: Pricing optimization** (2-5% improvement)
- Test price increase on new customers (+10%)
- Measure churn impact (if <5%, net positive)
- Rollout if successful
- New GM: 74% → 75-76%

**Month 7-9: Product optimization** (2-3% improvement)
- Shift mix toward higher-margin tiers
- Consolidate APIs/tools
- Further infrastructure optimization
- New GM: 75-76% → 77-79%

**Month 10-12: Strategic improvements** (1-2% improvement)
- Consider building core infrastructure (vs. 3rd party)
- Automate more support
- Fine-tune pricing
- Target GM: 78-80%

**Gross Margin and Operating Leverage**

Improving GM feeds operating leverage:

Example: £10M ARR company

Current state:
- Revenue: £10M
- COGS: 30% = £3M
- Gross profit: £7M
- OpEx: £6M
- Operating margin: 10%

After GM improvement (COGS 25%):
- Revenue: £10M (same)
- COGS: 25% = £2.5M (saved £500K)
- Gross profit: £7.5M
- OpEx: £6M (same)
- Operating margin: 15% (improved!)

5% COGS reduction = 5% operating margin improvement (at same revenue scale).

This is how small operational improvements compound into significant profitability gains.

**Gross Margin by Business Model**

Different models have different natural margins:

| Model | Typical GM | Why |
|-------|----------|-----|
| Pure SaaS | 75-85% | High margin software |
| SaaS + support | 65-75% | Labor costs eat margin |
| SaaS + infrastructure-heavy | 60-70% | High compute/data costs |
| Marketplace | 50-70% | Transaction fees, platform costs |
| B2B SaaS | 75-85% | Enterprise pricing, lower support |
| B2C SaaS | 70-80% | Consumer pricing, higher support |

Understanding your model's natural margin helps set targets.

**Tracking Gross Margin**

Monitor monthly:

| Month | Revenue | COGS | COGS % | GM % | Trend |
|-------|---------|------|--------|------|-------|
| Jan | £500K | £160K | 32% | 68% | — |
| Feb | £520K | £166K | 32% | 68% | Flat |
| Mar | £550K | £165K | 30% | 70% | Improving |
| Apr | £580K | £174K | 30% | 70% | Stable |
| May | £600K | £180K | 30% | 70% | On track |
| Jun | £620K | £190K | 31% | 69% | Declining |

Red flag: COGS % increasing (June at 31% vs. target 30%). Investigate:
- New customer segment has higher support costs?
- AWS costs increased unexpectedly?
- New API partner more expensive?

Fix immediately to prevent margin erosion.

**Gross Margin and Valuation**

Higher GM companies command higher valuations:

70% GM company: Typically 5-7x ARR multiple
80% GM company: Typically 7-10x ARR multiple

Same growth, same churn, but 10% higher margin = 30-40% higher valuation.

This is why improving GM is a top CFO priority.
`
      }
    ],
    relatedSlugs: [
      "operating-leverage-and-scaling",
      "profitability-mechanics",
      "unit-economics-deep-dive",
      "pricing-strategy-tier-design",
      "cash-management-and-forecasting"
    ],
    faq: [
      {
        q: "What's a good gross margin?",
        a: "For SaaS: 70%+ is healthy, 75%+ is good, 80%+ is excellent. Different by model: pure SaaS 75-85%, SaaS + support 65-75%."
      },
      {
        q: "How do I calculate COGS?",
        a: "Include: cloud infrastructure, payment processing, APIs, support costs. Don't include: salaries, marketing, rent. Track per customer and as % of revenue."
      },
      {
        q: "How can I improve gross margin?",
        a: "Negotiate better infrastructure rates, optimize code/infrastructure, reduce support costs, increase prices, or shift product mix toward higher-margin tiers."
      },
      {
        q: "Does improving GM affect revenue?",
        a: "Depends on lever. Cost optimization (same revenue) = pure margin gain. Price increase = may cause churn. Test price elasticity before raising."
      }
    ],
    videoUrl: ""
  }
];

export default batch85Articles;
