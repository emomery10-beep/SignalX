import { AcademyArticle } from "@/types/academy";

export const batch139Articles: AcademyArticle[] = [
  {
    slug: "expansion-revenue-and-upsell-strategy",
    title: "Expansion Revenue and Upsell Strategy: Growing Revenue from Existing Customers",
    description: "Master expansion revenue. Understand upsells, cross-sells, and how to grow revenue from existing customers faster than acquiring new ones.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "expansion revenue",
      "upsell strategy",
      "cross-sell",
      "NRR",
      "net revenue retention",
      "customer expansion",
      "account growth",
      "revenue per customer",
      "customer success",
      "upgrade path"
    ],
    keyTakeaways: [
      "Expansion revenue = revenue growth from existing customers (upgrades, add-ons, increased usage). Example: £100K MRR year 1 → £110K year 2 = 10% growth. Breakdown: 15% from new customers, -5% from churn = 10% net. Of that 10%, 5% is expansion (upgrades/add-ons from existing). Expansion is most profitable (no CAC, happy customer = longer lifetime).",
      "NRR (Net Revenue Retention) = (Ending MRR + Expansion + Contraction - Churn) / Beginning MRR. Example: Start £100K + £5K expansion - £10K churn = £95K, NRR 95% (bad, shrinking). Vs Start £100K + £8K expansion - £3K churn = £105K, NRR 105% (good, growing). Healthy SaaS NRR >110% (growing faster than churn).",
      "Upsell mechanics: (1) Expand within tier (£99 Starter customer adds 5 more users = £495), (2) Upgrade tiers (£99 Starter → £499 Pro = +£400), (3) Add modules (base product + analytics add-on = +£99). Target: 30-50% of customers expand annually. Each expanded customer = 20-30% more LTV."
    ],
    content: [
      {
        heading: "Understanding Expansion Revenue",
        body: `Expansion revenue is revenue growth from existing customers without acquiring new ones.

**Components of MRR Growth**

MRR changes from five sources:

Beginning MRR: £100K

1. New customers: +£15K (acquisition)
2. Expansion: +£8K (existing customers adding value)
3. Churn: -£10K (customers leaving)
4. Contraction: -£2K (downgrading tiers, removing users)
5. Win-back: +£1K (returning customers)

Ending MRR: £100K + £15K + £8K - £10K - £2K + £1K = £112K

Growth: 12% month-over-month

Breakdown:
- New acquisition: 15K / 112K = 13% of growth
- Expansion: 8K / 112K = 7% of growth
- Churn impact: -10K / 112K = -9% offset
- Contraction: -2K / 112K = -2% offset
- Win-back: 1K / 112K = 1% of growth

Healthy company: New + expansion > churn + contraction

**Net Revenue Retention (NRR)**

NRR shows revenue change from existing customers (excluding new).

Formula:

NRR = (Beginning MRR + Expansion - Churn - Contraction) / Beginning MRR

Example 1 (healthy):

Beginning: £100K
Expansion: +£8K (upgrades, add-ons)
Churn: -£5K (3% monthly churn)
Contraction: -£2K (downgrades)
Ending: £101K

NRR = (£100K + £8K - £5K - £2K) / £100K = 101% (growing from existing)

Example 2 (unhealthy):

Beginning: £100K
Expansion: +£2K (low upsells)
Churn: -£15K (high churn)
Contraction: -£3K
Ending: £84K

NRR = (£100K + £2K - £15K - £3K) / £100K = 84% (shrinking from existing)

**NRR Benchmarks**

Healthy SaaS:
- <100% NRR: Red flag (shrinking without new sales)
- 100-105% NRR: Okay (stable, growth dependent on new)
- 105-110% NRR: Good (expansion offsetting churn)
- >110% NRR: Excellent (growing faster than acquisition rate)

Enterprise SaaS typical: 120%+ NRR (high expansion from upsells)
Mid-market SaaS typical: 105-115% NRR
SMB SaaS typical: 95-105% NRR (lower expansion, higher churn)

**Why Expansion Matters**

Expansion revenue is most profitable:

CAC: £500 (one-time cost to acquire customer)
LTV calculation:

Without expansion:
- ARPU: £100/month
- Lifetime: 50 months (2% churn)
- LTV: £5,000

With expansion (add £20/month per customer):
- ARPU: £100 → £120 (20% increase from expansion)
- Lifetime: 60 months (lower churn due to higher engagement)
- LTV: £7,200

Difference: £2,200 (44% LTV increase) from expansion alone.

Impact: Can acquire 44% more customers at same payback (expansion improves unit economics).

**Growth Rate vs NRR**

Confusion: Growth rate ≠ NRR.

Growth rate = (New + Expansion) / Beginning (shows total growth)
NRR = (Expansion - Churn) / Beginning (shows existing customer health)

Example:

Growth rate 20% might come from:
- Scenario A: 30% new + 105% NRR (healthy, balanced)
- Scenario B: 50% new + 70% NRR (red flag: high acquisition hiding churn)

Always look at both. High growth with low NRR = unsustainable (need to replace churn constantly).

`
      },
      {
        heading: "Upsell and Expansion Mechanics",
        body: `How to grow revenue from existing customers.

**Types of Expansion**

1. Horizontal expansion (more of same):
   - User adds 5 more team members
   - Example: Starter £99 (1 user) → Starter £495 (5 users)
   - ARPU: +£396

2. Vertical expansion (upgrade tier):
   - Customer upgrades from Starter to Pro
   - Example: Starter £99 → Pro £499
   - ARPU: +£400

3. Add-on expansion (new module):
   - Customer adds analytics module to base product
   - Example: Base £99 + Analytics £49 = £148
   - ARPU: +£49

4. Usage-based expansion:
   - Customer's usage increases, bill increases
   - Example: API calls 100K/month → 500K/month
   - Auto-scaling pricing: £100 → £500
   - ARPU: +£400

**Identifying Expansion Opportunities**

Monitor customer health:

Daily Active Users (DAU):
- Low DAU: Under-utilizing product (no expansion opportunity)
- Medium DAU: Ready to expand (more users, more features)
- High DAU: Should be on higher tier

Feature usage:
- Using <40% of features: Upsell to Pro (more features)
- Using >80% of features: Ready for higher tier or add-on

Usage trending:
- Flat usage: Mature customer (stable, low churn risk)
- Growing usage: Ready to expand (more users, higher tier)

Measure customer health score:

Score = (DAU growth % × 0.4) + (Feature usage % × 0.3) + (Tenure in months × 0.2) + (Support tickets × 0.1)

Score >75: Expansion ready
Score 50-75: Engagement needed
Score <50: Churn risk

**Upsell Playbooks**

Horizontal expansion (add users):

Trigger: Power user on Starter (1 user) wanting to share
Approach: CS rep outreach: "We see you're using heavily, your team would benefit from collaborative features"
Offer: +4 users at discounted rate (+£99 = £396 total for 5 users vs £495 normal)
Close rate: 30-40%
Expansion size: +£300-400 ARPU

Vertical expansion (upgrade tier):

Trigger: Customer hitting limits of Starter (5 user limit reached)
Approach: Automated notification: "You've hit your user limit, upgrade to Pro for unlimited users"
Offer: Pro tier £499/month (upgrade from Starter £99)
Close rate: 50-60% (inbound, not sales)
Expansion size: +£400 ARPU

Add-on expansion:

Trigger: Power user likely to benefit from feature
Approach: In-app notification: "Try analytics add-on (used by 60% of Pro customers)"
Offer: Free trial of add-on, then £49/month
Close rate: 20-30% (low-friction)
Expansion size: +£49 ARPU

Account expansion (new departments):

Trigger: Customer grows (employees increase, new department forms)
Approach: Sales rep lands with new department: "We see you're growing, another team could benefit"
Offer: New team license, shared infrastructure
Close rate: 40-50% (high value)
Expansion size: +£500-2000 ARPU

**Expansion Playbook Metrics**

Track efficiency:

| Playbook | Customers Targeted | Conversion | Avg Expansion | Expansion Revenue | ROI |
|----------|-------------------|------------|---------------|--------------------|-----|
| Horizontal | 100 | 40% | £300 | £12K | 10x |
| Vertical | 150 | 50% | £400 | £30K | 20x |
| Add-on | 200 | 25% | £49 | £2.45K | 5x |
| Account | 50 | 45% | £1500 | £33.75K | 50x |

Account expansion highest ROI (high-touch but high payoff).

**Expansion vs CAC Trade-off**

Expansion is cheaper than acquisition:

CAC: £500 (fully-loaded cost to acquire customer)
Expansion cost: £0-100 (CS time to upsell, no marketing spend)

CAC payback: 5 months (£500 CAC / £100 ARPU)
Expansion payback: Immediate (no CAC)

Resource allocation: Spend 30% on new acquisition, 70% on existing expansion (higher ROI).

Most SaaS under-invest in expansion (focus too much on acquisition).

`
      },
      {
        heading: "Building a Successful Expansion Program",
        body: `How to systematize expansion revenue growth.

**Segment by Expansion Likelihood**

Create tiers based on expansion potential:

Tier 1 (High expansion potential):
- Power users (high usage, many features)
- Growing customers (DAU trending up)
- Long tenure (>6 months, proven stickers)
- Enterprise/mid-market (larger budgets)

Approach: High-touch (dedicated CSM, quarterly business reviews, proactive outreach)
Target expansion: 5-10% of customer ARPU annually

Tier 2 (Moderate expansion potential):
- Medium usage customers
- Stable tenure
- SMB segment

Approach: Low-touch (in-app prompts, automated email, self-service)
Target expansion: 2-5% of ARPU

Tier 3 (Low expansion potential):
- Light users
- New customers (<3 months)
- Price-sensitive SMB

Approach: Engagement focus (not expansion). Try to move to Tier 2
Target expansion: 0-2% of ARPU

**Expansion Program Structure**

Monthly expansion targeting process:

Month 1: Identify targets
- Query: Customers with >80% feature usage + >6 months tenure
- Segment: By tier, company size, expansion potential
- List: Top 50 candidates for expansion

Month 2: Outreach
- 50 targeted customers
- Contact: Email (tier 2/3), call (tier 1)
- Message: "We see you're using X heavily, Y feature/tier would help"

Month 3: Close
- Track conversion: 20-40% typical
- Expansion: Average £400-800 per customer
- Revenue: 50 × 30% × £600 = £9,000 new MRR

Monthly system:
- Identify 50 targets
- Close 15 (30%)
- Expansion revenue: £9,000-12,000/month
- Annual expansion: £108K-144K

**Expansion Metrics Dashboard**

Track expansion program health:

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Expansion customers/month | 15 | 14 | 93% |
| Expansion rate (% of customers) | 3% | 2.8% | 93% |
| Avg expansion amount | £600 | £550 | 92% |
| Expansion revenue/month | £9K | £7.7K | 86% |
| NRR (excl. churn) | 110% | 107% | 97% |

Set targets:
- 3-5% of customer base expands monthly (15-25 customers for 500-customer base)
- Average expansion amount £500-1000
- Expansion revenue 5-10% of total MRR growth

**Incentivizing Customer Success Teams**

Align compensation with expansion:

Old model: CS paid for retention only
- Result: Minimize work (low touch)
- Expansion: Missed

New model: CS paid for retention + expansion
- Base: Retention bonus (no churn = bonus)
- Variable: Expansion commission (5-10% of new MRR)

Example:

CSM managing 50 customers:
- Base salary: £40K
- Retention bonus: £10K (if retention >90%)
- Expansion commission: 10% of new MRR created
- 50 customers, 3 expand monthly = £1.8K new MRR/month × 10% commission = £180/month (£2,160 annually)
- Total: £40K + £10K + £2.2K = £52.2K

Incentive drives behavior: CS team proactively pursues expansion.

**Expansion Playbook Document**

Create internal playbook for all team:

**Expansion Playbook: SMB Horizontal Expansion**

Trigger: Customer on Starter with 1 user for >3 months, daily active

Target customer: Sarah (1-user company, daily active, 4 months in)

Approach:
1. In-app notification: "Your team is using heavily, invite team members to collaborate"
2. Email: "We see you're heavily using [feature], your team would benefit"
3. CS outreach: Call Sarah, explain benefits of multi-user collaboration

Offer:
- Current: £99/month (1 user)
- Expand to: £299/month (3 users)
- Discount: 20% off (£239 vs £297)

Close approach:
- Lead with problem: "We see you're managing everything alone"
- Show benefit: "Teams using 3+ users get 40% more productivity"
- Make easy: "One click to add team members"

Success metric:
- Close rate target: 30%
- Average expansion: £200/month
- Revenue: 100 SMB customers × 30% × £200 = £6,000 monthly

Playbook document ensures all team members execute consistently.

**Cohort Expansion Tracking**

Track expansion by cohort:

| Cohort | Start | 6M Expansion | 12M Expansion | 24M Expansion |
|--------|-------|--------------|---------------|--------------|
| Jan 2023 | £100K | +£3K (3%) | +£10K (10%) | +£25K (25%) |
| Jul 2023 | £150K | +£4K (2.7%) | +£14K (9%) | — |
| Jan 2024 | £200K | +£5K (2.5%) | — | — |

Trend: Older cohorts expand more (more time to discover needs, grow company).

Impact: Jan 2023 cohort LTV 25% higher than initial (expansion impact).

Set expansion targets per cohort:
- M6: 2-3% expansion
- M12: 8-12% expansion
- M24: 20-30% expansion
`
      },
      {
        heading: "Expansion Revenue Impact on Growth",
        body: `How expansion revenue scales company growth.

**Expansion Revenue Formula**

Expansion MRR = Active customers × Expansion rate × Avg expansion amount

Example:

Active customers: 500
Expansion rate: 3% of customers per month = 15 customers
Avg expansion: £400 per customer
Monthly expansion MRR: 15 × £400 = £6,000

Annually: £6,000 × 12 = £72,000 expansion MRR

Impact on growth:

Base MRR: £100K
New acquisition: £15K (acquisition MRR)
Expansion: +£6K (expansion MRR)
Churn: -£10K
Net growth: +£11K → £111K (11% growth)

Without expansion: £100K + £15K - £10K = £105K (5% growth)

Expansion doubles growth rate (5% → 11%).

**Reducing Customer Acquisition Dependency**

Most fast-growing SaaS: 50%+ dependent on new acquisition.

Risk: Acquisition efficiency decreases at scale (CAC increases).

Solution: Grow expansion revenue.

Scenario A (acquisition-heavy):
- Base: £1M MRR
- New acquisition (40% CAC increase needed at scale): £300K MRR
- Expansion: £30K (3% of base)
- Churn: -£100K
- Net: +£230K → £1.23M growth (23%)

CAC efficiency declining: Need higher CAC to grow.

Scenario B (balanced):
- Base: £1M MRR
- New acquisition: £150K (lower, selective)
- Expansion: £80K (8% of base, improved program)
- Churn: -£100K
- Net: +£130K → £1.13M growth (13%)

But CAC stays constant, better sustainability.

Strategy: As company matures, shift from acquisition to expansion (more sustainable growth).

**Expansion Revenue vs New Customer Growth**

Comparison:

New customer:
- CAC: £500 (one-time)
- CAC payback: 5 months
- Time to productivity: 2-3 months (onboarding overhead)

Expansion customer:
- CAC: £0 (no marketing cost)
- CAC payback: Immediate
- Time to productivity: Days (already trained)
- Plus: Relationship already strong (lower churn)

Economics: Expansion customer 5-10x better ROI than new customer.

Ideal mix:
- 50-60% of growth from new customers (maintain growth)
- 40-50% of growth from expansion (improve unit economics, reduce churn impact)

**Expansion Waterfall**

Visual breakdown of MRR changes:

| Month | MRR | New | Expansion | Churn | Contraction | End MRR | Growth |
|-------|-----|-----|-----------|-------|------------|---------|--------|
| Jan | £100K | +£12K | +£5K | -£8K | -£1K | £108K | 8% |
| Feb | £108K | +£13K | +£6K | -£8.6K | -£1K | £117.4K | 8.7% |
| Mar | £117.4K | +£14K | +£7K | -£9.4K | -£1.2K | £127.8K | 9% |

Pattern:
- New acquisition: Growing (10% monthly increase in new CAC efficiency declines over time)
- Expansion: Growing (better program, more mature customers)
- Churn: Growing (% of base stays constant 8%)
- Growth rate: Stable 8-9%

This is healthy, sustainable growth (driven by mix of new and expansion).

**Expansion Revenue as % of Total Growth**

Industry benchmarks:

Healthy SaaS: 30-50% of growth from expansion
- Example: 10% growth = 3-5% from new, 3-5% from expansion (net), -4% from churn

Mature SaaS: 50-70% of growth from expansion
- Example: 10% growth = 2% from new, 6% from expansion (net), -8% from churn

Early-stage SaaS: 10-30% of growth from expansion
- Example: 30% growth = 25% from new, 5% from expansion (net), -5% from churn

Track this metric. If expansion declining, it signals:
- Product not meeting needs (low expansion opportunity)
- CS not engaged (not driving upsells)
- Pricing not attractive (customers don't see value in more)

Investigate and fix.
`
      }
    ],
    relatedSlugs: [
      "customer-lifetime-value-calculation",
      "churn-analysis-retention-improvement",
      "pricing-strategy-and-price-optimization",
      "unit-economics-ltv-cac-payback",
      "financial-forecasting-modeling"
    ],
    faq: [
      {
        q: "What's a good NRR and why does it matter?",
        a: "Good NRR: >100% (stable), >105% (healthy), >110% (excellent). NRR shows if existing customers expand faster than they churn. Example: NRR 110% means for every £100 of existing revenue, you get £110 back (£10 from expansion, net of churn). NRR <100% = shrinking from existing (red flag). Track it monthly — it's best leading indicator of long-term health."
      },
      {
        q: "How much of my growth should come from expansion vs new customers?",
        a: "Healthy SaaS: 30-50% from expansion, 50-70% from new. Early stage: More from new. Mature: More from expansion. Example: 20% total growth = 12% from new, 8% from expansion (net of churn). Expansion is most profitable (no CAC), so shift toward it as you mature. If expansion <20% of growth, your CS program isn't working."
      },
      {
        q: "What's the best way to upsell existing customers?",
        a: "Identify expansion opportunities: customers with high usage, long tenure, growing company size. Approach: (1) Inbound notification (in-app), (2) CS team outreach (1-1 conversation), (3) Sales involvement (enterprise). Close rate 30-50% typical. Average expansion £300-600 per customer. Make easy: show value, offer discount, reduce friction. Incentivize CS team (commission on expansion)."
      },
      {
        q: "How do I increase my expansion rate?",
        a: "Steps: (1) Identify high-expansion-potential customers (power users, growing, enterprise), (2) Build clear upgrade path (horizontal/vertical/add-ons), (3) Empower CS team (training, incentives), (4) Create playbooks (standardized approach), (5) Measure and iterate. Target: 3-5% of customers expanding monthly, average £400-600 per expansion. Track monthly and adjust playbooks."
      }
    ],
    videoUrl: ""
  }
];

export default batch139Articles;
