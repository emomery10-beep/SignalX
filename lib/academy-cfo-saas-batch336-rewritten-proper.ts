import { AcademyArticle } from "@/types/academy";

export const batch336Articles: AcademyArticle[] = [
  {
    slug: "customer-acquisition-strategy-and-marketing-roi",
    title: "Customer Acquisition Strategy and Marketing ROI: Scaling Growth Efficiently",
    description: "Master acquisition strategy. Plan channels, measure ROI, optimize spending.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["customer acquisition", "marketing ROI", "acquisition channels", "customer acquisition cost", "channel optimization"],
    keyTakeaways: [
      "Acquisition strategy: (1) Identify best channels (where are target customers?), (2) Test each channel (small budget, measure ROI), (3) Scale winners (increase spend on profitable channels), (4) Optimize losers (improve CAC, LTV, or kill). Channels: Paid ads (Facebook, Google, LinkedIn), organic (SEO, content), sales (direct), partnerships, referrals. Cost varies: Organic £0 CAC (slow), paid ads £500-1500 CAC (faster, variable ROI), sales £2000+ CAC (slow, high-touch).",
      "Channel testing process: (1) Set budget (£5-10K per channel, 4-week test), (2) Run campaign (optimized, track carefully), (3) Measure results (conversion rate, CAC, payback), (4) Analyze ROI (does CAC payback <12 months?), (5) Scale or kill (scale winners, improve or stop losers). Typical: Test 5 channels, 2 become profitable, scale those. Expected: 50% test failure rate (normal).",
      "Portfolio approach: Different channels, different payback periods. Organic: Slow (6-12 months), but sustainable (no ongoing cost). Paid ads: Fast (30 days), but CAC increases with scale. Sales: Long (12-18 months), but high LTV. Mix: Combination = balanced risk/reward. Allocation: Early stage invest in organic (long-term), growth stage add paid ads, mature stage build sales team."
    ],
    content: [
      {
        heading: "Developing and Executing Customer Acquisition Strategy",
        body: `Building efficient growth through channel optimization and ROI focus.

**Acquisition fundamentals**

Definition:
- Process of bringing new customers into business
- Two dimensions: (1) Cost (CAC), (2) Speed (how fast?)
- Trade-off: Organic cheap/slow, paid ads expensive/fast, sales expensive/slow

Acquisition channels:

1. Organic (owned)
- SEO (search engine optimization)
- Content marketing (blog, webinars, guides)
- Community (Reddit, forums, Slack communities)
- Referrals (existing customers refer)

Pros:
- Zero or low CAC (once established)
- Compounding (builds over time)
- Trust (people trust word-of-mouth)

Cons:
- Slow (takes 6-12 months to see traction)
- Unpredictable (search algorithms change)
- Requires content creation (ongoing effort)

2. Paid ads (rented)
- Google Ads (search advertising)
- Facebook/Instagram Ads (social)
- LinkedIn Ads (B2B)
- Programmatic display (retargeting)

Pros:
- Fast (results in weeks)
- Scalable (increase budget = more customers)
- Measurable (track every click, conversion)

Cons:
- Expensive (£500-5000+ CAC depending on industry)
- CAC increases with scale (budget inflation)
- Requires optimization (bad targeting = wasted spend)

3. Sales (people-driven)
- Outbound sales (SDRs, cold outreach)
- Inside sales (phone, email)
- Enterprise sales (long sales cycle)

Pros:
- High-value deals (complex/enterprise)
- Relationship-driven (hard to copy)
- Can command premium pricing

Cons:
- Expensive (sales team salary + commissions)
- Slow (long sales cycles, 3-12 months)
- Doesn't scale linearly (can't hire infinitely)

4. Partnerships and channels
- Affiliate programs (partners sell for you)
- Resellers (third-party distribution)
- Strategic partnerships (co-marketing)

Pros:
- Leverage (use partner's reach)
- Shared risk (partners invest in sales)
- Access new markets

Cons:
- Less control (partners may not prioritize)
- Revenue share (lower margins)
- Relationship dependent

**Channel selection and testing**

Step 1: Identify target customer and channels

Question: Where are my target customers?

If B2B:
- LinkedIn (professionals)
- Google Ads (problem search)
- Content/SEO (thought leadership)

If B2C:
- Facebook/Instagram (consumer targeting)
- Google Ads (purchase intent)
- TikTok (younger demographic)

If high-touch/enterprise:
- LinkedIn Sales Navigator
- Cold outreach (SDRs)
- Conferences/events

If self-serve SaaS:
- Google Ads (high intent)
- Content/SEO (organic)
- Freemium model (product-led)

Step 2: Define test parameters

For each channel:
- Budget: £5K-10K (enough to get data)
- Duration: 4 weeks minimum (full sales cycle)
- Target: 100+ conversions (statistical significance)
- Metric: CAC payback period
- Success criteria: CAC payback <12 months

Example test setup:

Channel: Google Ads
- Budget: £8K
- Target: Get 50 new customers
- Expected CAC: £160
- Expected payback: 8 months (at 70% margin, £70 monthly profit)
- Success: If payback <12 months, scale

Step 3: Run test

Execution:
- Create campaigns (ads, landing pages)
- Target audience (who should see ads?)
- Optimize (bid adjustments, creative testing)
- Track (UTM parameters, conversion pixels)

Monitoring:
- Weekly check-in (is it on track?)
- Adjust if performing poorly (pause, adjust targeting)
- Continue if good (don't kill early)

Step 4: Measure and analyze

Key metrics:

| Metric | Definition | Example |
|---|---|---|
| Cost per click | How much per click? | £1.50 |
| Click-through rate | % people clicking | 2.5% |
| Cost per lead | How much per lead (email signup)? | £25 |
| Conversion rate | % of leads → paying customers | 10% |
| Cost per acquisition | How much per customer? | £250 |
| Payback period | Months to recover CAC | 6 months |

Calculation:
- Total spend: £8K
- Conversions: 32 customers (32/50 target, good)
- CAC: £8K / 32 = £250 per customer
- Monthly revenue per customer: £100 × 70% = £70 profit
- Payback: £250 / £70 = 3.6 months (excellent!)

Step 5: Decide (scale, optimize, or kill)

Decision framework:

| Payback | Decision | Action |
|---|---|---|
| <6 months | Scale | 2-3x budget immediately |
| 6-12 months | Scale gradually | +50% budget monthly |
| 12-18 months | Optimize | Improve conversion, CAC |
| >18 months | Kill or rethink | Move to different channel |

Example decisions:
- Google Ads 3.6-month payback: Scale to £20K/month
- Facebook Ads 10-month payback: Scale to £15K/month
- LinkedIn Ads 14-month payback: Optimize (improve conversion) or reduce
- Cold outreach 18-month payback: Optimize or kill

**Portfolio approach**

Balanced channel mix:

| Channel | CAC | Speed | Status | Allocation |
|---|---|---|---|---|
| Organic/SEO | £0 (long-term) | Slow (6-12 mo) | Building | 20% |
| Google Ads | £200 | Fast (30 days) | Profitable | 30% |
| Facebook Ads | £250 | Fast (30 days) | Testing | 20% |
| Content | £50 (long-term) | Slow | Building | 15% |
| Referrals | £100 (via CAC) | Medium | Scaling | 10% |
| Sales/enterprise | £2000 | Slow (3-12 mo) | Starting | 5% |

Expected blend:
- Fast channels (ads): 50% of marketing spend, 60% of customers (quick)
- Medium channels (referrals): 10% spend, 15% customers
- Slow/organic: 40% spend, 25% customers (long-term)

Result: Balanced portfolio = predictable growth (not dependent on one channel)

**Channel optimization over time**

Stage 1: Early (pre-product-market fit)
- Budget: £5-20K/month
- Focus: Find working channel (test all)
- Channels: Content (organic), paid ads (Facebook, Google)
- CAC target: <3x LTV acceptable (proving model)
- Expected: 1-2 profitable channels emerging

Stage 2: Growth (product-market fit, scaling)
- Budget: £50-200K/month
- Focus: Scale winners, optimize losers
- Channels: Add sales, scale paid ads, invest in content
- CAC target: <3x LTV (scale), <5x LTV if long payback
- Expected: 3-4 channels profitable, 5-10 CAC variations

Stage 3: Mature (market saturation)
- Budget: £200K+/month
- Focus: Efficiency, new channels, international
- Channels: Mature channels optimize, test new (partnerships, direct)
- CAC target: <2x LTV (mature, more competitive)
- Expected: Mixed portfolio, some channels saturated

**Measuring marketing ROI**

Monthly marketing ROI:

| Item | Amount |
|---|---|
| Marketing spend | £50K |
| New customers acquired | 100 |
| CAC | £500 |
| Customer value (LTV) | £1,500 |
| Gross margin on revenue | 60% |
| Payback period | 12 months |
| ROI (LTV - CAC) / CAC | 200% |
| Annual revenue from cohort | £120K (100 × £100 × 12 months) |
| Annual profit | £72K (120 × 60%) |
| Profit vs spend | 144% ROI (£72K profit / £50K spend) |

Interpretation:
- CAC £500, LTV £1,500 = 3:1 ratio (healthy)
- Payback 12 months (acceptable, full payback in year 1)
- Year 1 profit £72K on £50K spend = 144% ROI (excellent)
- Year 2+ profit (if retained) = additional £72K (compounding)

**Common acquisition mistakes**

Mistake 1: Spend without testing
- Problem: Launch campaign, spend £50K, hope it works
- Fix: Test small (£5K), measure, scale
- Impact: Avoid wasted spend, focus on winners

Mistake 2: Wrong metric
- Problem: Optimize for clicks (not conversions)
- Fix: Track CAC, payback, LTV (not just top-funnel metrics)
- Impact: Optimize for profitability (not vanity metrics)

Mistake 3: Ignore CAC increase with scale
- Problem: Assume £250 CAC holds at £50K spend (it doesn't)
- Fix: Budget for CAC inflation (expect 50-100% increase at 2-3x spend)
- Impact: Better budget planning (don't expect linear scaling)

Mistake 4: Single-channel dependency
- Problem: 80% of customers from Google Ads only
- Fix: Diversify (multiple channels, less risk)
- Impact: Sustainable growth (not dependent on one platform change)

`
      }
    ],
    relatedSlugs: ["unit-economics-ltv-cac-payback", "customer-lifetime-value-optimization", "marketing-roi-measurement-and-attribution", "metrics-dashboard-design-kpi-tracking", "growth-rate-analysis-and-benchmarking"],
    faq: [
      { q: "What is CAC and what's a good CAC payback?", a: "CAC (Customer Acquisition Cost) = Total marketing spend / New customers. Example: £50K spend, 100 customers = £500 CAC. Payback period = CAC / Monthly profit. Example: £500 CAC / £50 monthly profit = 10 months. Good payback: <12 months (fast recovery), acceptable 12-18 months, poor >18 months. Bench: If LTV £1500, CAC should be <£500 (3:1 ratio healthy)." },
      { q: "How do I test new acquisition channels?", a: "Process: (1) Set budget (£5-10K), (2) Run 4-week test, (3) Measure CAC and payback, (4) Decide: <6 month payback = scale, 6-12 months = scale gradually, 12-18 months = optimize, >18 months = kill. Expected: 50% test failure (normal). Typical: Test 5 channels, 2-3 become profitable. Key: Don't spend big before testing." },
      { q: "What's the best customer acquisition channel?", a: "Depends on business: B2B = LinkedIn/Google Ads, B2C = Facebook/TikTok, Enterprise = Sales. Trade-offs: Organic (£0 CAC, slow 6-12 mo), Paid ads (£500-2000 CAC, fast 30 days), Sales (£2000+ CAC, slow 3-12 mo). Recommendation: Portfolio (multiple channels, balanced risk). Allocation: 50% fast (ads), 50% medium/long-term (organic, content, referrals)." }
    ],
    videoUrl: ""
  }
];

export default batch336Articles;
