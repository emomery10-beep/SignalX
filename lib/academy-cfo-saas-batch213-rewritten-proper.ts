import { AcademyArticle } from "@/types/academy";

export const batch213Articles: AcademyArticle[] = [
  {
    slug: "customer-acquisition-strategy-and-marketing-roi",
    title: "Customer Acquisition Strategy and Marketing ROI: Optimizing Growth Channels",
    description: "Master customer acquisition. Analyze channels, optimize ROI, and scale efficiently.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["customer acquisition", "marketing ROI", "CAC", "marketing channels", "growth", "paid ads", "content marketing", "conversion", "channel optimization", "marketing funnel"],
    keyTakeaways: [
      "Channel mix: Paid ads (fast, expensive, CAC £1-3K), organic (slow, cheap, CAC £500), referral (fastest, lowest CAC £500), partnerships (medium). Allocate budget by ROI: Organic (highest), referral (highest), partnerships (medium), paid (medium-low). Example: £100K marketing budget = 40% organic (content, SEO), 20% referral program, 20% partnerships, 20% paid ads. Iterate: Test new channels (allocate 10% budget), scale winners. Target: CAC <3x of monthly price (payback <12 months).",
      "Marketing funnel: Awareness (top of funnel, get attention) → Consideration (compare options) → Decision (close). Metrics: TOFU (£1M ad spend, 100K impressions = £10 CPM). MOFU (100K impressions, 5K clicks = 5% CTR). BOFU (5K clicks, 250 trials = 5% conversion). Overall: £1M spend → 250 customers = £4K CAC. Optimize: Each stage has levers (awareness = better messaging, consideration = product demos, decision = pricing). Measure: Improve CTR 1% = £10K savings (100K × 1% × £10 average deal).  ",
      "Channel ROI analysis: Track CAC per channel + LTV. Organic: CAC £500, LTV £10K = 20x ROI (best). Paid: CAC £2K, LTV £10K = 5x ROI (acceptable). Referral: CAC £300, LTV £10K = 33x ROI (best). Decision: Allocate budget to highest ROI channels. Scale: As channel grows, CAC usually increases (competition, saturation). Plan: Mix channels (not all eggs in one basket). Example: Organic growing slower, paid ROI declining → test partnerships (new channel)."
    ],
    content: [
      {
        heading: "Channel Analysis and ROI",
        body: `Evaluating customer acquisition channels.

**Channel types and typical CAC**

Paid advertising (Google, LinkedIn, Facebook):
- CAC: £1.5-3K (varies by industry, targeting)
- Speed: Fast (campaigns run, traffic immediate)
- Scale: Unlimited (more spend = more customers)
- Disadvantage: Expensive, stops when budget stops

Organic (content, SEO):
- CAC: £300-800 (content production cost spread over customers)
- Speed: Slow (6-12 months to see traffic)
- Scale: Limited (SEO has ceiling, but evergreen)
- Advantage: Low CAC, sustainable long-term

Referral (customers refer friends):
- CAC: £200-500 (referral bonus £100-500, lower cost)
- Speed: Depends on program (incentives accelerate)
- Scale: Grows with customer base (more customers = more referrals)
- Advantage: Lowest CAC, highest-quality customers (referred)

Partnerships (integrations, resellers):
- CAC: £500-1500 (depends on partner channel)
- Speed: Medium (take time to build partnerships)
- Scale: Depends on partner's reach
- Advantage: Expand through partner network

**ROI calculation per channel**

Revenue per channel:
| Channel | New customers | Avg ACV | Revenue | CAC | Total CAC cost | CAC ROI |
|---|---|---|---|---|---|---|
| Paid ads | 30 | £10K | £300K | £2K | £60K | 5x |
| Organic | 15 | £10K | £150K | £600 | £9K | 16.7x |
| Referral | 10 | £10K | £100K | £400 | £4K | 25x |
| Partnerships | 5 | £10K | £50K | £1K | £5K | 10x |
| **Total** | **60** | **£10K** | **£600K** | | **£78K** | **7.7x** |

Analysis:
- Referral highest ROI (25x), but lowest volume (10 customers)
- Organic high ROI (16.7x), medium volume (15), sustainable
- Paid lowest ROI (5x), highest volume (30), expensive but scalable

**LTV-weighted ROI**

If channels have different LTV:
- Organic customers stickier (higher LTV, attracted by content)
- Paid customers less sticky (converted by ad, may churn faster)

Example:
| Channel | CAC | Customer LTV | Payback period | Lifetime profit |
|---|---|---|---|---|
| Paid ads | £2K | £8K | 3 months | £6K |
| Organic | £600 | £12K | 2 months | £11.4K |
| Referral | £400 | £13K | 1.5 months | £12.6K |

Better analysis: Organic + referral have higher lifetime profit, despite lower volume

`
      }
    ],
    relatedSlugs: ["unit-economics-ltv-cac-payback", "metrics-dashboard-design-kpi-tracking", "pricing-strategy-and-price-optimization"],
    faq: [
      {
        q: "What's a good CAC?",
        a: "Rule of thumb: CAC < Monthly price × 12 months (payback <1 year). Example: £10K ACV = CAC <£833. Acceptable: 0.5-1.5 year payback (depends on LTV). Organic CAC £500-1K (best). Paid CAC £1.5-3K (acceptable if volume high). Channel mix: 40% organic, 20% referral, 20% partnerships, 20% paid (balanced)."
      },
      {
        q: "How do I improve marketing ROI?",
        a: "Optimize each channel: Organic (improve content quality, SEO), Paid (better targeting, landing pages), Referral (increase incentives, ease of sharing), Partnerships (recruit partners). Measure: CAC per channel, LTV, payback period. Scale winners: Organic and referral often best ROI. Test: Allocate 10% budget to new channels, scale if ROI >5x."
      },
      {
        q: "Should I focus on one channel or diversify?",
        a: "Diversify: Different channels have different risks (paid ads algorithm change, organic SEO volatility). Portfolio: 40% organic (stable), 20% referral (growing), 20% partnerships (medium), 20% paid (scalable). Timing: Early stage (one strong channel), mature (diversified). Risk: Relying on one channel (algorithm change = catastrophic)."
      }
    ],
    videoUrl: ""
  }
];

export default batch213Articles;
