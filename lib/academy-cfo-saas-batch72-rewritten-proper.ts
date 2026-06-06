import { AcademyArticle } from "@/types/academy";

export const batch72Articles: AcademyArticle[] = [
  {
    slug: "pricing-strategy-tier-design",
    title: "Pricing Strategy and Tier Design: Maximizing Revenue from Your Product Tiers",
    description: "Design pricing tiers that maximize revenue while remaining competitive. Understand value-based pricing, tier gaps, and expansion mechanics through pricing.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "pricing strategy",
      "SaaS pricing",
      "pricing tiers",
      "tier design",
      "value-based pricing",
      "pricing psychology",
      "price optimization",
      "customer segments",
      "willingness to pay",
      "revenue optimization"
    ],
    keyTakeaways: [
      "Pricing strategy must reflect value, not costs; value-based pricing (customer's willingness to pay) > cost-plus; example: if product saves customer £50K/year, can price at £10K-15K/year; if costs £5K to build/operate, £10K price = 100% margin (very healthy); most founders underprice initially (trap of cost-plus thinking), should raise pricing 20-30% once PMF proven",
      "Tier design creates expansion mechanics: Basic (£50/month, core users), Pro (£200/month, growing teams, 4x base feature), Enterprise (custom, dedicated support); gaps between tiers should be 3-5x (not 10x, too big jump; not 1.5x, no incentive to upgrade); example: £50 → £200 (4x) → £1000 (5x) is optimal structure; feature gating matters more than price—gate valuable features at higher tiers",
      "Pricing optimization continuous: Test price increases (elasticity check: how many customers lost?), optimize tier gaps (are customers stuck between tiers?), adjust for segments (enterprise happy to pay £2K, SMB churn if >£100), measure price realization (actual vs. list price); most SaaS leaves 10-30% revenue on table through suboptimal pricing"
    ],
    content: [
      {
        heading: "Value-Based Pricing Framework",
        body: `Pricing should reflect the value your product creates for customers, not your costs.

**Cost-Plus Pricing (Wrong)**

Cost-plus: Price = Cost + margin

Example:
- Product costs £1,000/customer/year to build and operate
- Add 50% margin = £1,500 price
- Profit: £500/customer/year

Problem: Ignores customer's willingness to pay.

If customer gets £100K value, they'll happily pay £50K. If you only charge £1,500, you're leaving £48,500 on the table.

Cost-plus works for commodities (milk, gas) where price is set by market.
Cost-plus fails for software (price determined by value, not cost).

**Value-Based Pricing (Right)**

Value-based: Price = Customer's willingness to pay (based on value created)

Example:
- Customer is an accountant
- Your product saves 10 hours/week of manual work
- At £100/hour, that's £50K/year value
- Can price: £5K-15K/year (10-30% of value created)
- Customer gets £35K-45K value, you capture £5K-15K

Key insight: Price should be a fraction of value created, not based on cost.

**How to Find Customer's Willingness to Pay**

1. **Talk to customers directly** (most accurate)
   - Ask: "What's the annual value of this problem we solve?"
   - Ask: "What's the highest price you'd pay for this?"
   - Ask: "At what price would you not buy?"
   - Document answers across 20-30 customers

2. **Analyze customer lifetime value** (economic anchor)
   - Customer LTV = (ACV × 70% gross margin) ÷ monthly churn
   - Example: £5K ACV, 70% GM, 2% monthly churn
   - LTV = (£5K × 0.70) ÷ 0.02 = £175K
   - Price should be 5-10% of LTV = £8.75K-17.5K ACV

3. **Benchmark against alternatives** (competitive anchor)
   - What does customer currently pay for workaround?
   - If using manual process: Time cost
   - If using competitor: Competitor's price
   - Price 10-30% lower than alternative (better value)

4. **Test price increases** (price elasticity)
   - Raise price 10% on new customers
   - Track how many fewer customers acquired
   - If lose <5%, demand is inelastic (can raise more)
   - If lose 20-30%, demand is elastic (price-sensitive)

Example price elasticity test:

Test 1: £200/month (baseline, 100 customers/month)
Test 2: £220/month (10% increase, 97 customers/month, 3% loss)
- Result: Inelastic at 10%

Test 3: £250/month (25% increase, 85 customers/month, 15% loss)
- Result: Starting to become elastic at 25%

Test 4: £300/month (50% increase, 60 customers/month, 40% loss)
- Result: Very elastic at 50%

Sweet spot: £250/month (25% price increase, only 15% customer loss, net +12.5% revenue)

**Pricing and Profit Margins**

Price determines profit margin:

| Customer value | Price | Your margin | Customer benefit |
|---|---|---|---|
| £100K/year | £10K | £10K ACV, assume 70% GM = £7K | 90% to customer |
| £100K/year | £30K | £30K ACV, assume 70% GM = £21K | 70% to customer |
| £100K/year | £50K | £50K ACV, assume 70% GM = £35K | 50% to customer |

Higher price = Higher profit, but lower customer benefit. You're capturing more value.

The sweet spot: Price where customer still feels they got great deal (70%+ of value to them) but you capture meaningful margin (£3K-10K ACV).

**Pricing by Company Stage**

Different pricing strategies at different stages:

1. **Pre-product (research)**
   - Talk to customers about value
   - Research competitor pricing
   - Develop initial price hypothesis

2. **MVP/early customers**
   - Underprice intentionally (£1-5K/year)
   - Focus on customer feedback, not revenue
   - Goal: Validate product-market fit

3. **Product-market fit (Series A)**
   - Raise price 2-3x (£3-15K/year, now reflecting real value)
   - Implement pricing tiers
   - Start testing price elasticity

4. **Growth/scaling (Series B)**
   - Raise price another 1.5-2x through tier restructuring
   - Higher price tiers increase ARPU
   - Bundle features to justify pricing

5. **Mature/profitable (Series C+)**
   - Pricing mostly stable
   - Minor optimization (test 5-10% increases)
   - Focus on segmented pricing (enterprise vs. SMB)

Typical price evolution:
- Launch: £1K/year
- Series A: £5K/year (5x)
- Series B: £10K/year (2x)
- Series C+: £12-15K/year (1.5x)

Total 12-15x price increase from launch to maturity.

Most founders underprice early. Increase price aggressively once PMF proven.
`
      },
      {
        heading: "Tier Design and Feature Gating",
        body: `Your pricing tiers determine expansion mechanics and revenue potential. Good tier design drives customers to upgrade naturally.

**Three-Tier Structure (Most Common)**

Basic tier:
- £50-100/month
- Core features only (what every customer needs)
- 1 user, basic support
- Goal: Acquire price-sensitive customers, convert to higher tiers

Pro tier:
- £200-500/month
- Advanced features (what growing customers need)
- 3-5 users, email support
- Goal: Land in this tier, upsell to Enterprise
- Should be 3-5x price of Basic

Enterprise tier:
- £2,000-10,000+/month (or custom)
- All features + premium features
- Unlimited users, dedicated support, SLAs
- Goal: Capture high-value customers
- Should be 5-10x price of Pro

Example structure for £50/month Basic:
- Basic: £50/month
- Pro: £200/month (4x)
- Enterprise: £2,000/month (10x)

Gaps are reasonable (3-10x). If gap Basic-Pro is only 2x (£50→£100), no incentive to upgrade. If gap Basic-Pro is 10x (£50→£500), most won't jump.

**Feature Gating by Tier**

Features that gate (are tier-locked) drive tier upgrade more than price.

Example SaaS feature gating:

| Feature | Basic | Pro | Enterprise |
|---------|-------|-----|-----------|
| Core reporting | ✓ | ✓ | ✓ |
| Advanced reporting | — | ✓ | ✓ |
| Custom fields | — | ✓ | ✓ |
| Integrations | 1 | 5 | Unlimited |
| Users | 1 | 10 | Unlimited |
| API access | — | ✓ | ✓ |
| Dedicated support | — | — | ✓ |
| SLAs | — | — | ✓ |

Key gates:
1. **Users**: Most common lever. As team grows, need more users = upgrade pressure
2. **Integrations**: As use cases expand, need more integrations = upgrade trigger
3. **Features**: Premium features (advanced reporting, APIs) gate at higher tiers
4. **Support**: Dedicated support (human, priority) only at Enterprise

Gating drives natural expansion:
- Customer starts at Basic (1 user)
- Team grows to 3 users → upgrade pressure (Basic is 1 user only)
- Upgrade to Pro (10 users, advanced features)
- Team grows to 15 users + need API → upgrade to Enterprise (unlimited users, API)

Each gate is a revenue increase without sales effort.

**Pricing Psychology**

Small pricing adjustments drive big behavior changes:

1. **Anchor pricing**
   - Present highest price first (anchors perception)
   - £2,000 Enterprise → £500 Pro → £200 Basic
   - Creates perception that £200 is affordable
   - If presented as: £200 → £500 → £2,000
   - Perception flips (each upgrade seems expensive)

2. **Relative pricing**
   - "Choose your plan" with cost-per-user-per-month
   - Enterprise: £2,000/month ÷ 50 users = £40/user
   - Pro: £500/month ÷ 10 users = £50/user
   - Enterprise looks cheaper per unit (even though pricier total)

3. **Annual vs. monthly**
   - Monthly: £200/month
   - Annual: £2,000/year = £166.67/month (17% discount)
   - Annual prepay improves CAC payback, locks in customers
   - Offer 20% discount for annual (standard: 20% = 2 months free)

4. **Pricing tiers vs. usage-based**
   - Tier: Predict usage upfront (£200 = unlimited for "pro" level)
   - Usage: Pay for what you use (£0.01 per API call)
   - Tier is more predictable for customer (budget planning)
   - Usage is more scalable for you (customer success-aligned)
   - Hybrid: Tier + overage fees (best of both)

**Pricing Optimization: Real Examples**

Example 1: Feature-gating improvement

Before:
- Basic: £50/month (20 features)
- Pro: £200/month (30 features)
- Only 10% of customers upgrade

Problem: Pro features not differentiated enough. Only 10 features difference.

After:
- Basic: £50/month (15 core features)
- Pro: £200/month (30 features, including 5 critical premium features)
- Upgrade rate: 25% (2.5x improvement)

Result: Same price, better gating = 2.5x more upgrades.

Example 2: Tier gap optimization

Before:
- Basic: £50/month
- Pro: £150/month (3x gap)
- Enterprise: £1,500/month (10x gap from Pro)

Problem: Huge gap Pro→Enterprise. Only 5% land in Enterprise (jump too big).

After:
- Basic: £50/month
- Pro: £200/month (4x gap)
- Enterprise: £1,000/month (5x gap from Pro)

Result: 15% land in Enterprise (3x improvement).

Gap optimization: 3-5x between tiers is sweet spot. Too small = no upgrade incentive, too large = customers skip tier.

Example 3: Price increase with segmentation

Before:
- All customers: £200/month
- ARPU: £200/month

Problem: SMB and enterprise paying same price. Enterprise gets huge discount relative to value. Missing revenue.

After:
- SMB: £150/month (25% price decrease, target budget-conscious)
- Mid-market: £400/month (same value, 2x price)
- Enterprise: £2,000/month (custom, value-based)
- Weighted ARPU: £380/month (90% improvement)

Result: Raise average price by segmenting. SMB gets better price, enterprise pays for value.

**Pricing Metrics to Track**

Monthly:
- Average selling price (ASP)
- Annual contract value (ACV)
- Price realization (% of list price, actual vs. discounted)
- Tier distribution (% of customers at each tier)
- Upgrade rate (% customers moving to higher tier)

If tracking poorly:
- ASP declining → Customers being discounted too much
- Tier distribution skewed to Basic → Need stronger features in Pro
- Upgrade rate low → Gating not strong enough
- Price realization <90% → Sales team discounting aggressively (fix pricing strategy, not discounting)

Monthly review:
- Is ARPU growing? (Yes = pricing working, No = fix pricing)
- Are upgrades increasing? (Yes = gating good, No = improve gating)
- Are discounts increasing? (No = good, Yes = pricing too high or weak product)

Price is a leverage point: 5% price increase = 10-20% profit improvement (if customer count stable).
`
      },
      {
        heading: "Segmented Pricing and Price Testing",
        body: `Advanced pricing strategies: Segment customers by willingness to pay and test price increases.

**Segmented Pricing**

Different customer segments have different willingness to pay.

Example:

Freelancer segment:
- Willingness to pay: £20-50/month
- Volume: High (many freelancers)
- Use case: Solo, simple needs

SMB (5-50 employees):
- Willingness to pay: £100-500/month
- Volume: Medium (many SMBs, but fewer than freelancers)
- Use case: Team collaboration, some advanced features

Mid-market (50-500 employees):
- Willingness to pay: £500-2,000/month
- Volume: Low (fewer mid-market companies)
- Use case: Advanced features, integrations, support

Enterprise (500+ employees):
- Willingness to pay: £2,000-10,000+/month
- Volume: Very low (few large enterprises)
- Use case: Custom features, dedicated support, compliance

Strategy: Offer different tiers for different segments

| Tier | Freelancer | SMB | Mid-market | Enterprise |
|------|-----------|-----|-----------|-----------|
| Starter | £30/month | — | — | — |
| Professional | — | £200/month | — | — |
| Business | — | — | £800/month | — |
| Enterprise | — | — | — | Custom |

Result:
- Freelancers get affordable option (you capture price-sensitive segment)
- SMB pays market rate (good value, company can afford)
- Mid-market pays premium (complex needs justify price)
- Enterprise pays custom (high value, complex requirements)

Revenue impact:
- Freelancer: 100 customers × £30 = £3K/month
- SMB: 50 customers × £200 = £10K/month
- Mid-market: 10 customers × £800 = £8K/month
- Enterprise: 2 customers × £5K = £10K/month
- **Total: £31K/month from same 162 customers**

Without segmentation (flat £200 pricing):
- 162 customers × £200 = £32.4K/month

Segmentation: Slightly lower total, but captures market segments that wouldn't buy at £200 (freelancers). Trade-off often worthwhile (more customers, lower churn, better market fit).

**A/B Testing Price**

Test price increases on cohorts:

Test framework:
1. **Baseline**: Current price (£200/month)
2. **Test cohort 1**: £220/month (10% increase)
3. **Test cohort 2**: £250/month (25% increase)
4. **Test cohort 3**: £300/month (50% increase)

Run for 3 months, measure:
- Customers acquired (volume impact)
- Revenue impact (price × volume)
- Churn rate (is higher price causing churn?)

Results:

| Price | Customers/month | Revenue/month | Churn | Net revenue (accounting for churn) |
|-------|--------|---------|-------|------|
| £200 (baseline) | 100 | £20K | 2% | £19.6K |
| £220 | 97 | £21.3K | 2.1% | £20.8K |
| £250 | 85 | £21.3K | 2.5% | £20.8K |
| £300 | 60 | £18K | 3.5% | £17.4K |

Finding: £220-250 is optimal (maximum revenue, acceptable churn). £300 is too high (loses more customers than revenue gain).

Recommendation: Increase price to £250 (25% increase, +5.5% net revenue with same effort).

**Price Increase Rollout**

Once you've tested and optimized pricing:

1. **Grandfather existing customers** (optional, good for retention)
   - Existing customers keep old price
   - New customers at new price
   - Eventually, all customers at new price (as old customers churn, upgrade)

2. **Increase for all new customers immediately**
   - Easiest to implement
   - No grandfathered pricing complexity

3. **Increase for all existing customers (controversial)**
   - Maximizes revenue immediately
   - Risk: Higher churn
   - Only do if price increase is justified (major feature addition, cost increases)

4. **Increase pricing tiers, not base price**
   - Move features to higher tiers
   - Create new lower tier for price-sensitive customers
   - Effective price increase for existing customers, but they get more options

Most common: Grandfather existing, increase for new customers.

Timeline:
- Q1: Test price (new customers only)
- Q2: Rollout tested price (all new customers)
- Q3-Q4: Existing customers naturally upgrade to new prices (as they expand or renew)
- By end of year: 40-60% of customer base at new price, average price up 10-15%

**Price and Go-to-Market Fit**

Price is tied to go-to-market:

| Go-to-market | Typical price | Customer size | Payback |
|---|---|---|---|
| Self-serve | £50-300/month | Freelancer, SMB | 3-6 months |
| Marketing-led | £200-1,000/month | SMB | 6-12 months |
| Sales-led | £1,000-5,000+/month | Mid-market | 12-18 months |
| Enterprise sales | £5,000-50,000+/month | Enterprise | 18-24 months |

If you're selling to freelancers with a sales team, price will be too high (CAC unaffordable, payback too long).

If you're selling to SMBs with self-serve, price will be too low (leaving money on table, not enough margin to support sales team).

Match your go-to-market to your price:
- Self-serve GTM = £50-300 price = Low CAC, high volume
- Sales-led GTM = £1,000+ price = High CAC, lower volume

If changing go-to-market (adding sales team to self-serve), increase price to support CAC.
`
      }
    ],
    relatedSlugs: [
      "customer-acquisition-cost-optimization",
      "expansion-revenue-upsell-cross-sell",
      "unit-economics-deep-dive",
      "customer-lifetime-value-ltv-calculation",
      "sales-efficiency-magic-number"
    ],
    faq: [
      {
        q: "How much should I raise prices after Series A?",
        a: "Typically 2-3x. If launched at £1K/year, move to £3-5K/year post-Series A. Price reflects value once PMF proven. Most SaaS founders underprice; raise aggressively."
      },
      {
        q: "What's the right tier structure?",
        a: "3 tiers for most SaaS: Basic (entry), Pro (growth), Enterprise (high-value). Gaps should be 3-5x (not too big, not too small). Feature gates matter more than pure price."
      },
      {
        q: "Should I grandfather old customers on old pricing?",
        a: "Yes, usually. It improves retention, reduces churn during price increase. New customers get new price. After 12-18 months, most customers will be on new pricing."
      },
      {
        q: "How do I know if my price is too high?",
        a: "If churn increases >0.5% above baseline when you raise price, price may be too high. If upgrade rate drops <50%, gating may be poor. Test with 5-10% increase first."
      }
    ],
    videoUrl: ""
  }
];

export default batch72Articles;
