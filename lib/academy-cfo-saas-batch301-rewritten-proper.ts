import { AcademyArticle } from "@/types/academy";

export const batch301Articles: AcademyArticle[] = [
  {
    slug: "api-monetization-strategies",
    title: "API Monetization Strategies: Generating Revenue From Your Platform",
    description: "Master API monetization. Build revenue streams, manage usage, optimize pricing.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["API monetization", "usage-based pricing", "API pricing", "developer monetization", "platform revenue"],
    keyTakeaways: [
      "API monetization models: (1) Free tier (limited usage, lead to paid), (2) Usage-based (pay per call/request), (3) Tiered (starter/pro/enterprise with limits), (4) Hybrid (base fee + overage). Example: £0 free tier (1000 calls/month), £50/month pro (100K calls/month), overage £0.10 per 1000 calls. Cost: Infrastructure (hosting API), billing system (metering, billing). Benefit: Additional revenue stream, aligns costs with customer value.",
      "Pricing structure: Transparent (clear pricing table), predictable (no surprises), fair (match customer usage). Watch: Not too cheap (leave money on table), not too expensive (lose customers). Benchmarking: Similar APIs in market (AWS API Gateway £3-50/million requests, Stripe £0.5% transaction, Twilio £0.01-0.15 per request). Strategy: Start low (build adoption), raise later (once sticky).",
      "Adoption and scaling: Lead with free tier (volume), monetize on enterprise (high usage). Monitor: Usage by customer (which customers drive revenue?), API abuse (prevent free-tier abuse), efficiency (how to reduce hosting costs per customer?). Example: Free tier 90% of signups but 5% revenue. Enterprise 10% of users but 95% of API revenue. Focus: High-usage customers, self-serve billing."
    ],
    content: [
      {
        heading: "Monetizing Your API and Developer Platform",
        body: `Building sustainable API revenue.

**API monetization models**

Model 1: Free + paid tiers

Free tier:
- Limit: 1,000 requests/month (example)
- Use case: Evaluate product, small projects
- Goal: Generate leads, reduce sales friction
- Cost: Minimal (small infrastructure cost)

Paid tier:
- Tier A (Starter): 10K requests/month, £50/month
- Tier B (Pro): 100K requests/month, £500/month
- Tier C (Enterprise): Unlimited, custom pricing

Example revenue:
- 100 free tier users → 10% convert (10 to paid)
- 5 Starter (£50/month = £250)
- 3 Pro (£500/month = £1,500)
- 2 Enterprise (£2,000/month = £4,000)
- Total: £5,750/month

Model 2: Pure usage-based

Pay-as-you-go:
- £0.01 per request (example)
- No upfront commitment
- Bill monthly (or real-time)

Example usage:
- Light user: 10K requests = £100/month
- Medium user: 100K requests = £1,000/month
- Heavy user: 1M requests = £10,000/month

Pros: Align cost with value (fair perception)
Cons: Unpredictable revenue (customer usage varies)
Best for: Variable-usage products

Model 3: Hybrid (base + overage)

Structure:
- Base: £100/month (10K requests included)
- Overage: £0.01 per request above 10K

Example customer:
- Uses 25K requests
- Cost: £100 + (25K-10K) × £0.01 = £100 + £150 = £250/month
- Cheaper than tier model for this usage

Pros: Predictable base, fair overage
Cons: Complex to communicate
Best for: Predictable baseline + variable usage

Model 4: Enterprise commitment

Large customers:
- Volume discount (negotiate)
- Example: 1M requests/month
  - Tiered model: £5,000/month
  - Negotiated: £3,000/month (40% discount)

Rationale: Lock in customer, high volume justifies discount
Best for: High-value accounts (£1,000+/month)

**Pricing structure design**

Step 1: Estimate costs
- Infrastructure: Hosting, CDN, database
- Example: £500/month base cost
- Variable cost: £0.001 per request (as scale grows)

Step 2: Determine margin
- Model: Cost + margin (Margin = 50-80% typically)
- Example: £0.001 cost per request
  - 50% margin: £0.002 per request price
  - 70% margin: £0.0033 per request

Step 3: Simplify pricing
- Round to easy numbers (£0.01 per 1000 requests)
- Create tiers (avoid price confusion)
- Test: 3-5 tiers typically (Starter, Pro, Enterprise)

Step 4: Benchmark and test
- Research: How do competitors price?
- Test: Incrementally increase prices (50% test group)
- Measure: Price elasticity (does demand change?)

Example pricing matrix:

| Tier | Requests/mo | Price | $/M Requests | Use Case |
|---|---|---|---|---|
| Free | 1,000 | £0 | N/A | Trial |
| Starter | 10,000 | £50 | £5,000 | Small app |
| Pro | 100,000 | £500 | £5,000 | Medium app |
| Enterprise | Unlimited | Custom | Variable | Large app |

Observation: Price per million requests same for Starter/Pro (good for consistency)

**Preventing abuse and managing costs**

Rate limiting:
- Limit: 100 requests/second per customer
- Burst: Allow 1,000 requests per minute (handle spikes)
- Override: Enterprise can negotiate higher
- Goal: Prevent single customer from overwhelming system

Usage metering:
- Track: Requests per customer per day/month
- Dashboard: Show customer their current usage (transparency)
- Alerts: "You're near 80% of limit" (prevent surprise overages)

Fraud detection:
- Patterns: Detect unusual spikes (possible abuse)
- Validation: Require valid API key for all requests
- Monitoring: Daily review of top usage accounts (prevent runaway costs)

Cost optimization:
- Caching: Cache common requests (reduce compute)
- Compression: Compress responses (reduce bandwidth)
- CDN: Distribute data (reduce latency, cost)
- Cost savings: Can reduce hosting cost 30-50% via optimization

Example cost scenario:

Current state:
- 1000 requests/day average
- Hosting cost: £100/month
- Revenue: £50/month (free tier mostly)
- Loss: £50/month

Issue:
- Free tier too generous (no monetization)
- Some customers heavy users (high cost)

Solution:
- Reduce free tier (1000/month instead of 10,000)
- Implement rate limiting (prevent abuse)
- Optimize caching (reduce cost 30%)
- Expected result: Cost £70, revenue £500 (profitable)

**Adoption and growth strategy**

Phase 1: Launch free tier (adoption focus)
- Generous free tier (attract developers)
- Promotion: Devrel (dev community building, talks)
- Timing: 3-6 months (build critical mass)
- Goal: 1,000+ free tier users

Phase 2: Monetize (conversion focus)
- Introduce paid tiers (for high-usage customers)
- Email: "You're on track to exceed free tier, consider Pro?"
- Timing: 6-12 months in (after adoption plateau)
- Goal: 10% free tier convert to paid (100 paid customers)

Phase 3: Enterprise (expansion focus)
- High-touch sales for large customers
- Custom pricing negotiations
- SLAs, support, uptime guarantees
- Timing: 12+ months (once product-market fit proven)
- Goal: 5-10 enterprise customers (£100K+ ARR)

**Monitoring and optimization**

Dashboard metrics:

| Metric | Current | Target | Status |
|---|---|---|---|
| API requests/day | 50K | 100K | 50% |
| Free tier users | 500 | 1000 | 50% |
| Paid customers | 8 | 25 | 32% |
| MRR (API) | £1500 | £5000 | 30% |
| Hosting cost | £300 | £400 | 75% |
| Margin | 80% | 70% | 114% |

Analysis:
- Low adoption (50% of target)
- Very few paid customers (32% of target)
- Margin too high (opportunity to invest in growth)
- Action: Increase free tier limit (boost adoption), better pricing (convert more)

Customer segmentation:

| Segment | Users | Avg Usage | ARPU | Retention |
|---|---|---|---|---|
| Free tier | 500 | 2K req/mo | £0 | 40% |
| Starter | 5 | 10K req/mo | £50 | 80% |
| Pro | 2 | 80K req/mo | £500 | 90% |
| Enterprise | 1 | 5M req/mo | £2000 | 95% |

Insights:
- Free tier high churn (40% retention) = convert more before lose
- Enterprise highly sticky (95% retention) = focus here
- Large gap between Pro and Enterprise = opportunity tier?

Actions:
- Build Enterprise-lite tier (£1000/month, 500K requests) = bridge gap
- Improve free-to-Starter conversion (enhance Pro features)
- Enterprise sales effort (1 customer = £2000/month = priority)

Pricing optimization:

Test: Increase Pro from £500 to £750/month (50% test group)
- A (current): 2 Pro customers
- B (test): Try 50% of new signups at £750
- Result: 1 customer at £750, 1 at £500 (break-even price sensitivity)
- Decision: Keep at £500 (maximize adoption, grow volume)

vs. Test: Free tier 1K→500 requests (reduce free tier)
- A (current): 500 free users
- B (test): 50% of new signups limited to 500 req/mo
- Result: B group converts faster (higher % to paid)
- Decision: Reduce free tier limit (boost paid conversions)

Revenue projection:

Year 1:
- Free tier: 500 users, 0 revenue
- Starter: 5 users × £50 = £250/month
- Pro: 2 users × £500 = £1000/month
- Enterprise: 1 user × £2000 = £2000/month
- Total MRR: £3250, ARR: £39K

Year 2 (with optimization):
- Free tier: 1000 users, still £0
- Starter: 50 users × £50 = £2500/month (10% free conversion)
- Pro: 10 users × £500 = £5000/month (better conversion)
- Enterprise: 3 users × £2000 = £6000/month (sales effort)
- Total MRR: £13500, ARR: £162K (4x growth)

`
      }
    ],
    relatedSlugs: ["pricing-strategy-and-price-optimization", "product-led-growth-and-free-tier-strategy", "subscription-billing-models-and-pricing-architecture", "unit-economics-ltv-cac-payback", "metrics-dashboard-design-kpi-tracking"],
    faq: [
      { q: "How should I price my API?", a: "Consider: (1) Your costs (hosting per request), (2) Value to customer (willing to pay how much?), (3) Competitors (market rate?). Models: Free tier + tiered pricing (popular), pure usage-based (£0.01 per 1000 requests typical), hybrid base + overage. Test: Start low (adoption), raise incrementally (measure price elasticity). Example: Free tier (lead), Starter £50/month (10K calls), Pro £500/month (100K calls)." },
      { q: "Should I have a free API tier?", a: "Yes (usually): Free tier attracts developers, reduces sales friction, generates leads. Generous free tier (1K-10K requests) converts 10-20% to paid at high usage. Watch: Prevent abuse (rate limiting, monitoring). Strategy: Free tier drive adoption, monetize enterprise (high-usage customers pay premium)." },
      { q: "How do I monetize API customers?", a: "Free tier (evaluate). Upsell to Starter (small projects). Upgrade to Pro (moderate usage). Enterprise/custom (high-volume, negotiated). Key: Show usage dashboard (transparency), alert when approaching limits (promote upgrade), support tier (professional support = premium price). Typical: 5-10% free → paid, 2-3% Starter → Pro, Enterprise sales-driven." }
    ],
    videoUrl: ""
  }
];

export default batch301Articles;