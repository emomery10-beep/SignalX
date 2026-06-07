import { AcademyArticle } from "@/types/academy";

export const batch385Articles: AcademyArticle[] = [
  {
    slug: "saas-product-led-growth-finance",
    title: "Product-Led Growth Finance: Economics of Self-Serve SaaS",
    description: "Master PLG economics. Analyse freemium conversion, optimise self-serve unit economics, and scale efficiently.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["product-led growth", "PLG", "freemium", "self-serve", "conversion economics"],
    keyTakeaways: [
      "PLG unit economics: Free-to-paid conversion rates typically 2-5% (freemium) or 15-25% (free trial). Cost to serve free users: £0.50-2.00/month per user (hosting, support). Example: 10,000 free users × £1/month = £10K/month cost. 300 convert to paid at £50/month = £15K/month revenue. Net: £5K/month from free tier. Key metric: Cost to serve free users must be <50% of revenue from converted users. Time to conversion: Average 30-90 days (trial) or 6-12 months (freemium).",
      "Freemium vs free trial economics: Freemium: Unlimited free tier, monetise through upgrades. Pros: Large user base, organic growth, network effects. Cons: High cost to serve, low conversion. Free trial: Time-limited (14-30 days), full features. Pros: Higher conversion (15-25%), faster payback. Cons: Smaller funnel, requires onboarding investment. Hybrid: Free tier with limited features + trial of premium. Best for: Most SaaS companies. Decision: If viral coefficient >1.5, freemium. If product requires setup/onboarding, trial.",
      "PLG financial model: Different from sales-led. Key differences: (1) CAC is much lower (£50-500 vs £5,000-25,000 for sales-led), (2) ARPU is lower (£30-200/month vs £500-5,000/month), (3) Churn is higher (3-7% monthly vs 1-2% for sales-led), (4) LTV:CAC ratio can be excellent (5-10:1 due to low CAC). PLG efficiency: Measure cost per activated user (not just signups). Activation rate (users who reach 'aha moment') is the critical metric. Target: 30-60% signup-to-activation."
    ],
    content: [
      {
        heading: "Understanding the Financial Model of Product-Led Growth",
        body: `Building the financial framework for self-serve SaaS growth.

**PLG funnel economics**

The PLG funnel:

| Stage | Count | Conversion | Cost |
|---|---|---|---|
| Website visitors | 100,000 | - | £5K marketing |
| Signups | 5,000 | 5% visitor→signup | £0.10/visitor |
| Activated users | 2,000 | 40% signup→activated | £0.50/signup |
| Free active users | 1,500 | 75% stay active | £1/user/mo hosting |
| Paid conversion | 150 | 10% activated→paid | - |
| Monthly revenue | - | - | £7,500 (at £50/mo) |

Unit economics:

Cost to acquire one paying customer:
- Marketing: £5K / 150 conversions = £33 CAC
- Free user hosting: £1,500/month × 3 months avg / 150 = £30
- Total effective CAC: £63

Compare to sales-led CAC: £5,000-25,000
PLG advantage: 80-99% lower CAC

Revenue per paying customer:
- ARPU: £50/month
- Churn: 5% monthly
- LTV: £50 × 80% margin / 5% churn = £800
- LTV:CAC: £800 / £63 = 12.7:1 (excellent)

**Freemium financial model**

Cost to serve free users:

| Cost component | Per user/month | Total (10K users) |
|---|---|---|
| Cloud hosting | £0.30 | £3,000 |
| Storage | £0.10 | £1,000 |
| Support (self-serve) | £0.05 | £500 |
| Email/notifications | £0.05 | £500 |
| Total | £0.50 | £5,000 |

Annual cost of free tier: £60,000

Revenue from conversions:
- 10,000 free users × 3% conversion = 300 paying customers
- ARPU: £50/month
- Annual revenue from conversions: 300 × £50 × 12 = £180,000

Free tier ROI:
- Cost: £60,000
- Revenue: £180,000
- Net: £120,000
- ROI: 3x (good — free tier pays for itself)

Break-even conversion rate:
- Cost per free user: £0.50/month = £6/year
- Revenue per converted user: £50 × 12 × 80% margin = £480/year
- Break-even: £6 / £480 = 1.25% conversion rate
- Below 1.25%: Free tier loses money
- Above 1.25%: Free tier profitable

Freemium design principles:

What to include in free tier:
- Core product value (enough to demonstrate value)
- Usage limits (not feature limits when possible)
- Individual use (not team features)
- Basic integrations

What to gate behind paid:
- Team collaboration features
- Advanced analytics and reporting
- Premium integrations
- Priority support
- Higher usage limits
- Admin controls (SSO, audit logs)

**Free trial financial model**

14-day trial economics:

| Metric | Value |
|---|---|
| Trial signups per month | 500 |
| Activation rate (reach aha moment) | 60% (300) |
| Trial-to-paid conversion | 25% of activated (75) |
| ARPU | £100/month |
| Monthly new revenue | £7,500 |

Cost during trial:
- Full product access: £2/user for 14 days = £1,000/month
- Onboarding emails: £200/month
- Support: £500/month
- Total trial cost: £1,700/month

CAC: £1,700 / 75 = £22.67 per customer

30-day trial comparison:

| Metric | 14-day trial | 30-day trial |
|---|---|---|
| Signups | 500 | 500 |
| Activation | 60% (300) | 65% (325) |
| Conversion | 25% (75) | 20% (65) |
| Revenue | £7,500 | £6,500 |
| Trial cost | £1,700 | £3,000 |
| CAC | £22.67 | £46.15 |

Insight: 14-day trial has higher conversion rate and lower CAC
Reason: Urgency drives faster decision-making
However: Some products need 30 days for evaluation (complex B2B)

Trial optimisation levers:

1. Improve activation rate (40% → 60%):
   - Better onboarding flow
   - In-app guidance
   - Onboarding emails
   - Impact: 50% more conversions

2. Improve trial-to-paid conversion (20% → 30%):
   - End-of-trial nudges
   - Value demonstration during trial
   - Remove friction from payment
   - Impact: 50% more conversions

3. Reduce time to value:
   - Pre-populated demo data
   - Templates and quick-starts
   - Guided setup wizard
   - Impact: Faster activation, higher conversion

**PLG metrics framework**

Core PLG metrics:

| Metric | Definition | Target |
|---|---|---|
| Signup rate | Visitors → signups | 3-8% |
| Activation rate | Signups → activated | 30-60% |
| Free-to-paid conversion | Free → paid | 2-5% (freemium), 15-25% (trial) |
| Time to value | Signup → first value moment | <5 minutes (ideal) |
| Expansion rate | Paid → higher tier | 20-30% of paid users |
| Viral coefficient | Users inviting other users | >0.5 (good), >1.0 (viral) |
| Revenue per visitor | Revenue / website visitors | £0.05-0.50 |

Activation definition:

Define your product's "aha moment":

| Product type | Aha moment | Timeframe |
|---|---|---|
| Analytics | Created first dashboard | Day 1-3 |
| CRM | Added 10 contacts | Day 1-7 |
| Collaboration | Invited first team member | Day 1-3 |
| Developer tool | First API call | Day 1 |
| Design tool | Created first project | Day 1-3 |

Track activation rate by cohort:

| Cohort | Day 1 | Day 3 | Day 7 | Day 14 |
|---|---|---|---|---|
| Jan signups | 25% | 35% | 42% | 45% |
| Feb signups | 28% | 38% | 46% | 50% |
| Mar signups | 30% | 42% | 50% | 55% |

Improving activation = most impactful PLG lever

**PLG vs sales-led hybrid model**

Many companies combine PLG + sales:

| Segment | Motion | ARPU | CAC | LTV:CAC |
|---|---|---|---|---|
| Self-serve | PLG | £50/mo | £63 | 12.7:1 |
| SMB | PLG + inside sales | £200/mo | £1,500 | 8:1 |
| Mid-market | Sales-assisted | £1,000/mo | £8,000 | 6:1 |
| Enterprise | Sales-led | £5,000/mo | £30,000 | 5:1 |

Blended CAC: Weighted average across segments

Product-qualified leads (PQLs):
- Free users showing buying signals
- Signals: Usage above threshold, team features explored, billing page visited
- Route PQLs to sales team (not all free users)
- Conversion rate on PQLs: 15-30% (vs 1-3% cold leads)

PQL scoring example:

| Signal | Score |
|---|---|
| Created >5 projects | +20 |
| Invited team member | +25 |
| Hit usage limit | +30 |
| Visited pricing page | +15 |
| Used advanced feature | +10 |
| Score >50 | → Route to sales |

Financial impact:
- Sales team only talks to qualified leads
- Higher conversion rate
- Lower wasted sales time
- Blended CAC decreases

**PLG financial planning**

Revenue forecasting for PLG:

Model:
- Website traffic × signup rate × activation rate × conversion rate × ARPU = Revenue

Example:
- 100K visitors × 5% × 40% × 10% × £50 = £10K monthly new revenue
- Plus: Existing customers (£50K) - churn (5%) = £47.5K
- Total MRR: £57.5K

Growth levers (rank by impact):

| Lever | Current | Improved | Revenue impact |
|---|---|---|---|
| Traffic +50% | 100K → 150K | +£5K/month | Medium |
| Signup +2pp | 5% → 7% | +£4K/month | Medium |
| Activation +10pp | 40% → 50% | +£2.5K/month | High ROI |
| Conversion +5pp | 10% → 15% | +£2.5K/month | High ROI |
| ARPU +£20 | £50 → £70 | +£4K/month | High ROI |

Focus: Activation and conversion have highest ROI (no additional traffic cost)

**Cost structure of PLG companies**

PLG cost benchmarks (as % of revenue):

| Category | PLG company | Sales-led company |
|---|---|---|
| COGS (hosting + support) | 15-25% | 15-20% |
| R&D / Product | 25-35% | 15-25% |
| Sales & marketing | 15-30% | 35-55% |
| G&A | 8-12% | 10-15% |
| Operating margin | 5-25% | -20% to 10% |

PLG companies:
- Higher R&D spend (product IS the sales motion)
- Lower S&M spend (product acquires customers)
- Better operating margins at scale
- Higher CAC efficiency

Investment priority:
- PLG: Invest in product and growth engineering
- Sales-led: Invest in sales team and marketing
- Hybrid: Balance both, segment by customer size

`
      }
    ],
    relatedSlugs: ["saas-pricing-strategy-and-monetisation", "saas-unit-economics-deep-dive", "customer-acquisition-strategy-and-marketing-roi", "saas-churn-analysis-and-retention-strategy", "saas-metrics-benchmarking-and-peer-comparison"],
    faq: [
      { q: "What is the typical free-to-paid conversion rate?", a: "Freemium: 2-5% of free users convert to paid (over lifetime). Free trial (14-30 days): 15-25% conversion. Higher for activated users (those who reach 'aha moment'). Activation rate is key lever — targeting 30-60% signup-to-activation. Example: 10K free users × 3% conversion = 300 paying. Break-even conversion rate depends on cost to serve free users (typically need >1-2%)." },
      { q: "How does PLG unit economics compare to sales-led?", a: "PLG: Low CAC (£50-500), low ARPU (£30-200/month), higher churn (3-7%), excellent LTV:CAC (5-10:1). Sales-led: High CAC (£5-25K), high ARPU (£500-5K/month), lower churn (1-2%), good LTV:CAC (3-5:1). PLG has better CAC efficiency but lower revenue per customer. Hybrid model combines both: PLG for self-serve/SMB, sales-led for mid-market/enterprise." },
      { q: "Should I choose freemium or free trial?", a: "Freemium if: Product has viral potential (coefficient >1.5), low marginal cost to serve, network effects, simple onboarding. Free trial if: Product needs setup/configuration, complex B2B product, higher price point, faster conversion needed. Hybrid (free tier + premium trial): Best for most SaaS. 14-day trial typically outperforms 30-day (higher urgency, lower cost). Decision drives your entire cost structure and growth model." }
    ],
    videoUrl: ""
  }
];

export default batch385Articles;
