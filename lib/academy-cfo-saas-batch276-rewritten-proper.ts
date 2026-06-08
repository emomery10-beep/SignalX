import { AcademyArticle } from "@/types/academy";

export const batch276Articles: AcademyArticle[] = [
  {
    slug: "product-led-growth-and-free-tier-strategy",
    title: "Product-Led Growth and Free Tier Strategy: Growing Through Product",
    description: "Master product-led growth. Build free tier, drive conversions, scale through product.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["product-led growth", "PLG", "free tier", "freemium", "free trial", "product adoption", "viral growth"],
    keyTakeaways: [
      "Product-led growth (PLG): Let product sell itself (users try for free, convert if value clear). vs sales-led (salespeople sell). PLG advantages: (1) Lower CAC (marketing cost lower), (2) Faster adoption (try immediately), (3) Viral potential (happy free users recommend), (4) Product feedback (free users = larger user base, feedback). Disadvantages: (1) Lower ARPU (many free users), (2) Churn risk (free → paid conversion hard), (3) Support burden (free users need support). Best for: Self-serve products (low barrier to entry, quick value realization). Examples: Slack, Notion, Dropbox (all started freemium).",
      "Free tier strategy: Limit (storage, users, features), not time (free forever). Examples: Slack (limited history, 2 integrations), Notion (limited seats), Dropbox (2GB storage). Goal: Free tier generates 5-10% conversion to paid (if higher, maybe not limiting enough; if lower, value not clear). CAC: £0 for organic free users (virality), much lower than sales CAC. LTV: Free user lifetime value £10-100 (many don't convert, some become £10K+). Math: 1000 free users, 5% convert to paid at £500/year = 50 × £500 = £25K annual (£25 per free user).",
      "Conversion mechanics: Onboard free users quickly (first 15 min = critical). Activation (first value moment). Engagement (daily/weekly usage). Monetization (hit free tier limit, offer paid). Retention (keep using = higher LTV). Cost: Product time (onboarding flows, limits, upgrade CTAs). Benefit: PLG can achieve 10-20% NDR if free tier large (many free→paid converts). Example: Slack free tier 1M users, 5% convert to paid at £120/month = 50K × £120 = £6M ARR from free-tier conversions."
    ],
    content: [
      {
        heading: "Product-Led Growth Strategy",
        body: `Letting product drive adoption.

**Product-led vs sales-led**

| Dimension | Product-led | Sales-led |
|---|---|---|
| User journey | Sign up → try → convert | Demo → qualify → close |
| CAC | Low (£0-500) | High (£2K-50K) |
| Sales cycle | 1-4 weeks | 6-18 months |
| ARPU | Lower (£50-500/month) | Higher (£500-50K+/month) |
| Churn | Higher initially, stickier long-term | Lower if high switching cost |
| Target market | Self-serve, price-sensitive | Enterprise, complex |
| Best products | Simple, quick value | Complex, lots of support |

Examples:
- Product-led: Slack (freemium), Notion (freemium), Dropbox (freemium), Figma (free tier)
- Sales-led: Salesforce (enterprise), HubSpot (mid-market), Zendesk (enterprise)

**Free tier design**

Freemium models:
1. Feature-limited (free has fewer features, paid has more)
   - Example: Slack (limited integrations, history)
   - Advantage: Users experience value immediately
   - Disadvantage: Users might not hit limit, don't convert

2. Seat/usage-limited (free has fewer users or usage)
   - Example: Notion (limited seats), Dropbox (limited storage)
   - Advantage: Growing teams hit limit, need to upgrade
   - Disadvantage: Can use free forever if team doesn't grow

3. Time-limited (free for 14-30 days, then must upgrade)
   - Example: Old trial model
   - Advantage: Forces decision
   - Disadvantage: Many churn rather than upgrade

Best: Combination (feature + seat/usage limited, no time limit)

Example free tier design (project management):
- Features: Basic task management, limited integrations
- Users: Up to 5 team members (free), unlimited paid
- Storage: 1GB (free), unlimited (paid)
- Support: Community forum (free), email support (paid)
- Pricing: Free forever for <5 users, £10/user/month for teams >5

Conversion funnel:
- Sign up: 100% (free users)
- Active (month 1): 30% (many sign up but don't use)
- Hit limit: 15% (of those active, hit feature/seat/usage limit)
- Convert: 5% of total sign ups (small, but high volume = big revenue)

Volume math:
- 10,000 sign ups/month
- 3,000 active
- 450 hit limit
- 225 convert (5% conversion of total)
- 225 × £10/month = £2.25K/month

**Onboarding for conversion**

Critical first experience:
- Goal: First value within 15 minutes (activation)
- Timeline: Sign up → email confirm → login → first action = target 15 minutes
- Metric: % completing first action (track, optimize)

Onboarding flow:
| Step | Time | Action | Success metric |
|---|---|---|---|
| Sign up | 2 min | Email + password | 90% create account |
| Verification | 2 min | Click email link | 70% verify |
| First project | 5 min | Create first item | 50% complete |
| Invite team | 3 min | Add team members | 30% invite (optional) |
| First value | 15 min total | See something useful | 40% activation |

Conversion optimization:
- Skip questions (collect later, not upfront)
- Auto-fill (pre-populate defaults)
- Progress indication (show progress in onboarding)
- Help (in-app tips, tooltips)
- One-click upgrades (make purchase easy)

Monetization triggers:
- Seat limit (add 6th user → offer upgrade)
- Feature limit (try advanced feature → locked, offer upgrade)
- Storage limit (hit 1GB → offer upgrade)
- Usage limit (too many requests → offer upgrade)

Example CTA:
- Free tier full: "You've hit the team limit. Upgrade to add more people."
- With fallback: [Upgrade button] [Add as guest] [Learn more]
- Soft sell: Option to keep free or upgrade (not forced)

**Measuring PLG success**

Key metrics:
| Metric | Target | Formula |
|---|---|---|
| Free → paid conversion | 5-10% | Paying users / free sign ups |
| Time to value | <15 min | Time to first activation |
| NRR | 110%+ | (Including free-to-paid users) |
| CAC | <£500 | Marketing spend / customers acquired |
| LTV | £5K+ | Average customer value over lifetime |
| Payback | <12 months | CAC / (ARPU × gross margin) |

Example PLG SaaS metrics:
- Free sign ups: 100,000/month
- Activated: 30,000 (30%)
- Convert to paid: 5,000 (5% of total, 17% of activated)
- ARPU (paid): £50/month
- Monthly revenue: £250K
- NRR: 130% (many free users upgrade, expansion)

`
      }
    ],
    relatedSlugs: ["product-roadmap-planning-and-prioritization", "pricing-strategy-and-price-optimization", "customer-acquisition-strategy-and-marketing-roi"],
    faq: [
      { q: "Should I build a free tier?", a: "If: Self-serve product, quick value realization, target price-sensitive market. Avoid: Complex products, high CAC cheaper than free churn cost. Free tier design: Feature + seat/usage limited (not time-limited). Goal: 5-10% free-to-paid conversion." },
      { q: "What free tier should I offer?", a: "Limit by: Features (reduce advanced), users (cap team size), usage (storage, API calls), not time (free forever). Example: Slack (limited history + 2 integrations), Notion (limited seats), Dropbox (2GB storage). Design: Users can stay free forever (small scale), but hit limit if grow (upgrade incentive)." },
      { q: "How do I convert free to paid?", a: "Onboarding: First value in 15 minutes (critical). Monetization triggers: Hit free limit (seat, feature, usage). Soft sell: Offer upgrade, not forced. Metrics: 5-10% conversion target, <15 min time-to-value, 110%+ NRR (includes free→paid)." }
    ],
    videoUrl: ""
  }
];

export default batch276Articles;