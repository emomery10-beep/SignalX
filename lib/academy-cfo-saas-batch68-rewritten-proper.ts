import { AcademyArticle } from "@/types/academy";

export const batch68Articles: AcademyArticle[] = [
  {
    slug: "customer-acquisition-funnel-optimization",
    title: "Customer Acquisition Funnel: Optimizing Each Stage for Conversion",
    description: "Map your customer acquisition funnel. Measure conversion at each stage and identify bottlenecks to improve overall conversion rate.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "acquisition funnel",
      "customer funnel",
      "conversion funnel",
      "funnel optimization",
      "conversion rate",
      "sales funnel",
      "lead funnel",
      "funnel metrics",
      "bottleneck analysis",
      "conversion optimization"
    ],
    keyTakeaways: [
      "Typical funnel: Awareness (1000) → Interest (300, 30%) → Consideration (100, 33% of interest) → Purchase (20, 20% of consideration) = 2% overall conversion; each 10% improvement at any stage multiplies through (improving interest from 30% to 33% = 3% gain, cascades to 2.2% overall conversion, 10% uplift)",
      "Identify bottleneck: If awareness high but interest low, messaging/positioning issue (product doesn't match expectations). If interest high but consideration low, pricing/feature fit issue (can't justify cost). If consideration high but purchase low, sales friction (process too complex, terms unfavorable). Fix the bottleneck, not the stage with lowest absolute numbers",
      "Funnel varies by segment and channel: Self-serve funnel (high awareness, low consideration due to low-touch) vs. sales-led funnel (low awareness but high consideration due to sales qualification). Don't compare self-serve funnel to sales-led funnel; optimize within each channel"
    ],
    content: [
      {
        heading: "Mapping Your Funnel",
        body: `A customer acquisition funnel tracks the journey from awareness (someone knows you exist) to purchase (they buy).

Typical B2B SaaS funnel:

1. **Awareness**: People know your product exists
2. **Interest**: They engage (visit website, download content, attend webinar)
3. **Consideration**: They evaluate your product (demo, trial, case studies)
4. **Decision/Purchase**: They buy

Example with 10,000 potential customers in your market:

| Stage | Count | % of previous | Conversion to purchase |
|-------|-------|----------|----------|
| Awareness | 1,000 | 10% of market | 100% (baseline) |
| Interest | 300 | 30% of aware | 30% of market aware |
| Consideration | 100 | 33% of interested | 10% of market aware |
| Purchase | 20 | 20% of considering | 2% of market aware |

Overall conversion: 20 customers ÷ 1,000 aware = 2%

This is typical for B2B SaaS self-serve. Sales-led funnels may have lower awareness but higher consideration/purchase rates.

**Stage-by-Stage Optimization**

Stage 1: Awareness (Getting noticed)

Current: 1,000 aware of your product

Levers:
- Content marketing: Blog, guides, videos (SEO-driven awareness)
- Paid advertising: Google Ads, LinkedIn Ads, Facebook
- PR/press: News coverage, analyst mentions
- Events: Conferences, webinars, community
- Partnerships: Co-marketing, affiliate programs
- Product-led: Free tier that drives word-of-mouth

Metrics to track:
- Reach: How many people see your messaging?
- Impression: How many impressions (ad, content view)?
- Cost per impression/reach
- Brand awareness (surveys, search volume)

Optimization:
- If cost per reach too high, shift channels (away from paid ads toward content)
- If reach high but engagement low, messaging issue (what people see doesn't resonate)

Stage 2: Interest (Engagement)

Current: 300 interested (30% of aware)

Definition: Took an action showing interest (visited website, clicked ad, downloaded content, attended webinar, signed up for trial)

Levers:
- Landing page optimization: Clear value prop, low friction signup
- Content quality: People engage if content is valuable
- Email nurture: Follow-up sequence to keep interested
- Retargeting: Ads to people who visited but didn't convert
- Community: Forums, Slack, engaging people
- Gateable content: Free guides, templates, tools (require email)

Metrics:
- Click-through rate (CTR): % of ads/content people click
- Landing page conversion: % of visitors who take action
- Email open/click rate
- Event attendance/signup rate

Optimization:
- CTR low: Messaging/creative issue (not compelling enough)
- Landing page conversion low: Too many fields, unclear CTA, page loads slow
- Email open low: Subject line issue or sending too often
- Community engagement low: Content not valuable

Stage 3: Consideration (Evaluation)

Current: 100 considering (33% of interested)

Definition: Took action showing evaluation (requested demo, started trial, read case studies, talked to sales)

Levers:
- Trial/freemium: Low-friction way to evaluate
- Demo video: Recorded demo for self-serve evaluation
- Case studies: Social proof from similar companies
- Comparison content: How you compare to alternatives
- Sales demo: AE conducts personalized demo
- ROI calculator: Show financial impact

Metrics:
- Demo request rate (% of interested who request demo)
- Trial signup rate
- Trial usage depth (features tried, time in product)
- Trial to paid conversion
- Case study/comparison download rate

Optimization:
- Demo request low: Barrier to getting demo too high (phone call required? Complex form?) Lower friction
- Trial signup low: Trial offer not compelling, friction in signup process
- Trial usage depth low: Onboarding poor, trial doesn't show value quickly
- Trial to paid low: Too expensive, product doesn't deliver promised value, or wrong tier offered

Stage 4: Purchase (Decision)

Current: 20 purchase (20% of considering)

Levers:
- Pricing: Is it affordable? Clear pricing or custom quote?
- Terms: Annual discount incentivizes commitment
- Friction: Is checkout easy? Can buy immediately or need approval?
- Social proof: Testimonials, logos of customers
- Guarantee: 30-day money-back guarantee reduces risk
- Incentive: Limited-time offer, first-month discount

Metrics:
- Proposal-to-close rate: % of proposals that close
- Sales cycle length: Days from demo to signature
- Average deal size: Are customers signing up at expected ACV?
- Close rate by segment: Enterprise vs. SMB closing at different rates
- Churn from trial: % of trial users who don't convert

Optimization:
- Proposal-to-close low: Pricing objection? Competing with alternative? Long approval process?
- Sales cycle long: Too many stakeholders, decision-maker not engaged, procurement delays
- Deal size below target: Sales team discounting too much, or attracting wrong customer segment
- Trial churn high: Product didn't deliver value, or wrong use case
`
      }
    ],
    relatedSlugs: [
      "conversion-funnel-optimization",
      "free-trial-freemium-conversion-optimization",
      "customer-acquisition-cost-optimization",
      "sales-pipeline-health-forecasting",
      "marketing-roi-and-attribution"
    ],
    faq: [
      {
        q: "What's a healthy overall conversion rate?",
        a: "Self-serve SaaS: 1-3% (low touch). Sales-led SaaS: 5-15% (high touch). Better rates if you target warm leads. Typical 2% means of 1000 aware, 20 buy."
      },
      {
        q: "Which stage should I optimize first?",
        a: "Start with the biggest bottleneck (lowest conversion %). If awareness high but interest low, fix messaging. If interest high but purchase low, fix pricing/terms."
      },
      {
        q: "How do I calculate cost per acquisition by stage?",
        a: "CPL (cost per lead) = marketing spend ÷ leads. CPC (cost per consideration) = spend ÷ trials/demos. CPA (cost per acquisition) = spend ÷ customers."
      },
      {
        q: "Should I optimize for volume or conversion rate?",
        a: "Both, but conversion rate first. A 2% funnel at 1000 aware = 20 customers. A 4% funnel at 1000 aware = 40 customers (100% more). Doubling conversion is better than doubling awareness spend."
      }
    ],
    videoUrl: ""
  }
];

export default batch68Articles;
