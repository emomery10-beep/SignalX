import { AcademyArticle } from "./academy-types";

export const ACADEMY_CFO_SAAS_BATCH_9_REWRITTEN: AcademyArticle[] = [
  {
    slug: "customer-acquisition-cost-cac-calculation",
    title: "Customer Acquisition Cost (CAC): How to Calculate It Accurately (Not the Easy Wrong Way)",
    description: "Most SaaS founders calculate CAC wrong, leaving money on the table. Learn the complete formula including all hidden costs.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 6,
    keywords: ["CAC", "customer acquisition cost", "sales efficiency", "unit economics"],
    keyTakeaways: [
      "CAC = all S&M spend ÷ new customers acquired. But 'all S&M' includes salaries, tools, events, and overhead. Most founders undercount.",
      "Blended CAC (across all channels) hides problems. Calculate CAC by channel: Paid ads, organic, referral, sales. One channel might be 3x more expensive than another.",
      "CAC payback period (months to recover CAC) matters more than CAC absolute number. 6-month payback is healthy; 18-month is too long."
    ],
    content: [
      {
        heading: "The Complete CAC Formula (Not Just Ad Spend)",
        body: "**Wrong (incomplete) CAC calculation:**\nCAC = Ad spend ÷ customers acquired\nExample: £50,000 Google Ads ÷ 100 customers = £500 CAC\n\nProblem: Ignores salaries, tools, events, overhead.\n\n**Right (complete) CAC calculation:**\nCAC = (All S&M spend including salaries, tools, events, overhead) ÷ customers acquired\n\n**Example breakdown (monthly):**\n- Google Ads: £50,000\n- Sales team salaries: £60,000\n- Marketing tools (HubSpot, email, analytics): £5,000\n- Events & sponsorships: £10,000\n- Customer success onboarding (bringing customers to value): £15,000\n- Marketing overhead (office, benefits, etc.): £10,000\n- **Total S&M spend: £150,000**\n\nNew customers this month: 100\n\n**Complete CAC: £150,000 ÷ 100 = £1,500 per customer**\n\nVs. the incomplete \"£500\" calculation, the real CAC is 3x higher. This changes your unit economics dramatically.\n\nIf LTV is £3,000, then:\n- Wrong calculation: LTV:CAC = 6x (looks great)\n- Right calculation: LTV:CAC = 2x (not sustainable)\n\nThe complete CAC shows your business model doesn't work at scale. The wrong calculation hides this."
      },
      {
        heading: "CAC by Channel: Where Your Real Problems Hide",
        body: "Blended CAC (all channels together) is misleading. You need CAC by channel to see which are profitable.\n\n**Example: Blended CAC £1,500 hides channel problems**\n\n```\nChannel 1: Paid ads (Google)\n- Spend: £80k\n- Customers: 40\n- CAC: £2,000 per customer\n- Payback: 12 months (LTV £3k, gross margin 60%)\n\nChannel 2: Sales team\n- Spend: £60k (salaries)\n- Customers: 30\n- CAC: £2,000 per customer\n- Payback: 12 months\n\nChannel 3: Organic/referral\n- Spend: £10k (content creation)\n- Customers: 30\n- CAC: £333 per customer\n- Payback: 2 months\n\nTotal: £150k spend, 100 customers, blended CAC £1,500\n```\n\n**Insight:** Organic/referral is 6x cheaper than paid ads (£333 vs £2,000). But blended metric hides this.\n\n**Action:** Double down on organic/referral. Kill or optimize paid ads.\n\nIf you increase organic customers from 30 to 60 per month, blended CAC drops to ~£1,000 (much healthier). But you'd never know this from blended metric alone."
      }
    ],
    relatedSlugs: [
      "saas-unit-economics-complete-guide",
      "financial-modeling-templates-saas-founders"
    ],
    faq: [
      {
        q: "Should I include customer success in CAC?",
        a: "Yes. CS team that gets customers to value is part of acquisition cost. Without them, acquired customers churn faster and LTV drops."
      },
      {
        q: "What's a healthy CAC?",
        a: "Depends on LTV. Rule of thumb: LTV:CAC > 3x. So if LTV is £3k, CAC should be <£1k. If CAC is £2k and LTV £3k, you're barely sustainable."
      }
    ],
    videoUrl: ""
  },
  {
    slug: "lifetime-value-ltv-calculation-saas",
    title: "Lifetime Value (LTV): Calculating Customer Profit Over Their Lifetime",
    description: "LTV = what a customer generates in profit before they churn. Learn to calculate it with expansion revenue and different cohort scenarios.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 6,
    keywords: ["LTV", "lifetime value", "customer value", "unit economics"],
    keyTakeaways: [
      "LTV = (monthly ARPU × gross margin %) ÷ monthly churn rate. High churn (5%) = low LTV. Low churn (2%) = high LTV.",
      "LTV varies by cohort, segment, and acquisition channel. Organic customers might have 30% higher LTV than paid ads customers.",
      "Improving LTV through retention is 5x cheaper than through CAC reduction. Focus on retention first."
    ],
    content: [
      {
        heading: "Simple LTV Formula",
        body: "**Formula:**\nLTV = (Monthly ARPU × gross margin %) ÷ monthly churn rate\n\n**Example 1: Healthy SaaS**\n- ARPU: £100/month\n- Gross margin: 75%\n- Monthly gross profit: £75\n- Monthly churn: 3%\n- LTV: £75 ÷ 0.03 = £2,500\n\n**Example 2: High-churn SaaS**\n- ARPU: £100/month\n- Gross margin: 75%\n- Monthly gross profit: £75\n- Monthly churn: 8%\n- LTV: £75 ÷ 0.08 = £938\n\n**Difference:** Same ARPU, but 5% higher churn = 62% lower LTV. Churn kills profitability more than any other metric.\n\n**Example 3: With expansion revenue**\n\nIf customers upgrade 10% of customers per month (expansion), add that:\n- Monthly ARPU from base: £100\n- Monthly expansion revenue (upgrades): £15\n- Total gross profit: £86.25 (75% margin)\n- Monthly churn: 3%\n- LTV: £86.25 ÷ 0.03 = £2,875 (+15% vs. no expansion)\n\nExpansion revenue adds £375 to LTV. This is why NRR >100% is so valuable."
      }
    ],
    relatedSlugs: [
      "saas-unit-economics-complete-guide",
      "net-revenue-retention-nrr-expansion"
    ],
    faq: [
      {
        q: "Should I calculate LTV from historical data or projected?",
        a: "Historical (for cohorts that have mostly churned) is most accurate. But projected (based on current cohort retention) is more useful for decisions. Calculate both and compare."
      },
      {
        q: "What if I don't have 24 months of data?",
        a: "Use 12 months and project. Example: 6-month cohort shows 70% retention, project that to 24-month (~50% retention). Then calculate LTV based on 50% stabilized retention."
      }
    ],
    videoUrl: ""
  },
  {
    slug: "payback-period-customer-acquisition",
    title: "Payback Period: How Many Months to Recover Your Customer Acquisition Cost",
    description: "Payback period tells you how long before a customer becomes profitable. 6 months is good; 18 months is too long.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 4,
    keywords: ["payback period", "CAC payback", "unit economics"],
    keyTakeaways: [
      "Payback period = CAC ÷ (monthly gross profit). 6-month payback is healthy; <3 months is exceptional; >12 months is risky.",
      "Short payback = capital efficient (you recover investment quickly, can reinvest). Long payback = capital intensive (need cash to fund growth).",
      "Improve payback by: reducing CAC (cheaper acquisition) or increasing gross margin (charge more, reduce COGS)."
    ],
    content: [
      {
        heading: "Payback Period Calculation & Implications",
        body: "**Formula:**\nPayback period = CAC ÷ monthly gross profit\n\n**Example:**\n- CAC: £1,200\n- ARPU: £100/month\n- Gross margin: 75%\n- Monthly gross profit: £75\n- Payback: £1,200 ÷ £75 = 16 months\n\nInterpretation: Takes 16 months of customer profit to pay back acquisition cost. Then the next 8 months (until typical 24-month churn) is pure profit.\n\n**Payback period implications:**\n\n- <3 months: Exceptional (can reinvest quickly, capital efficient)\n- 3-6 months: Healthy (good balance)\n- 6-12 months: Acceptable (capital intensive but manageable)\n- >12 months: Risky (takes too long to recover, hard to scale)\n\n**Why it matters for fundraising:**\n\nInvestors want payback <6 months ideally, <12 months acceptably.\n\nIf your payback is 18 months, you need:\n- £1,200 × 100 customers = £120k CAC spend per month\n- 18 months to payback = £2.16M cash needed just to pay for customer acquisition\n- By month 18, some of your month 1 customers are churning\n- You're in a cash death trap\n\nInvestors won't fund this business model. You need to either:\n1. Reduce CAC (cheaper marketing)\n2. Increase gross margin (charge more)\n3. Increase ARPU (sell more per customer)\n\nOne or more of these must happen."
      }
    ],
    relatedSlugs: [
      "customer-acquisition-cost-cac-calculation",
      "saas-unit-economics-complete-guide"
    ],
    faq: [
      {
        q: "Is payback period more important than LTV:CAC?",
        a: "They tell different stories. LTV:CAC shows ultimate profitability. Payback shows capital efficiency. Both matter. A company with 5x LTV:CAC but 24-month payback needs massive capital. A company with 3x LTV:CAC but 4-month payback is more fundable."
      },
      {
        q: "What if payback period is negative (customer is unprofitable)?",
        a: "Stop acquiring those customers. Either improve unit economics (raise prices, reduce costs) or focus on different customer segment. A negative payback customer is a net loss every month they're active."
      }
    ],
    videoUrl: ""
  },
  {
    slug: "dau-mau-ratio-engagement-metric",
    title: "DAU/MAU Ratio: Measuring User Engagement (Daily vs. Monthly Active Users)",
    description: "DAU/MAU ratio tells you how frequently users engage. >50% is excellent; <20% is concerning.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 5,
    keywords: ["DAU", "MAU", "user engagement", "product metrics"],
    keyTakeaways: [
      "DAU/MAU = daily active users ÷ monthly active users. High ratio (>50%) means users are highly engaged. Low ratio (<20%) means users are dormant.",
      "DAU/MAU trends matter more than absolute numbers. If DAU/MAU declines month-over-month, something is broken (product change, competitor, market shift).",
      "High DAU/MAU companies have lower churn (engaged users stay) and higher expansion revenue (they see more features to buy)."
    ],
    content: [
      {
        heading: "DAU/MAU Examples & Interpretation",
        body: "**Scenario A: High engagement product**\n- MAU: 10,000 users\n- DAU: 6,000 users\n- DAU/MAU: 60%\n\nInterpretation: 60% of users who visit monthly also visit daily. These are highly engaged users. Typical for communication tools (Slack, Telegram) or daily-use products.\n\n**Scenario B: Weekly-use product**\n- MAU: 10,000 users\n- DAU: 2,000 users\n- DAU/MAU: 20%\n\nInterpretation: Only 20% of monthly users visit daily. Most visit weekly. Typical for project management (Asana), accounting (Wave), or tools used \"as needed.\"\n\n**Scenario C: Declining engagement (red flag)**\n- Last month: MAU 10,000, DAU 5,000, DAU/MAU 50%\n- This month: MAU 10,000, DAU 3,000, DAU/MAU 30%\n\nInterpretation: Same monthly users, but daily engagement dropped 40%. Something changed:\n- Product bug? Feature removed? Competitor launched? UX got worse?\n\nThis decline predicts churn (engaged users stay; dormant users leave). Fix this immediately."
      }
    ],
    relatedSlugs: [
      "churn-management-real-time-customer-metrics",
      "saas-cohort-analysis-retention-curves"
    ],
    faq: [
      {
        q: "What's a good DAU/MAU ratio?",
        a: "Depends on product type. Daily-use tools: >40%. Weekly-use tools: 15-30%. Monthly-use tools: <10%. Compare against your product category, not across categories."
      },
      {
        q: "Should I optimize for high DAU/MAU?",
        a: "Yes, but naturally. Don't artificially inflate DAU (e.g., sending fake notifications to get users to open). Focus on product quality; high engagement follows."
      }
    ],
    videoUrl: ""
  },
  {
    slug: "viral-coefficient-network-effects",
    title: "Viral Coefficient: Measuring Word-of-Mouth Growth (K-Factor)",
    description: "Viral coefficient (K) measures how many new users each customer brings. K >1 means exponential growth; K <1 means manual growth needed.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Advanced",
    readTime: 6,
    keywords: ["viral coefficient", "k-factor", "virality", "network effects", "organic growth"],
    keyTakeaways: [
      "Viral coefficient K = users invited per customer × conversion rate. K >1 = exponential growth (you acquire 1 customer, they bring >1 new customer). K <1 = requires paid acquisition.",
      "Most SaaS has K <1 (0.2-0.5). K >1 is rare (Slack, Dropbox, Zoom). Achieve K 0.3-0.5 and supplement with paid acquisition.",
      "Improving K from 0.3 to 0.5 doesn't sound like much, but compounds into massive growth multiplier over time."
    ],
    content: [
      {
        heading: "Viral Coefficient Formula & Impact",
        body: "**Formula:**\nK = (# invitations per user) × (conversion rate of invitations)\n\n**Example 1: Low virality**\n- Average user invites 5 friends\n- 10% of invites convert to paid customers\n- K = 5 × 0.10 = 0.5\n\nInterpretation: Each paying customer brings 0.5 new paying customers. Not viral (K <1). Requires paid acquisition to scale.\n\n**Example 2: High virality**\n- Average user invites 10 friends\n- 15% of invites convert\n- K = 10 × 0.15 = 1.5\n\nInterpretation: Each paying customer brings 1.5 new paying customers. Super viral (K >1). Exponential growth without paid acquisition.\n\n**Impact on growth:**\n\nWith K=0.5 (low virality):\n- Month 1: 100 customers (from paid acquisition)\n- Month 2: 100 × 0.5 = 50 from virality + 100 new paid = 150 total\n- Month 3: 150 × 0.5 = 75 from virality + 100 new paid = 175 total\n- Growth is linear (add 100 paid each month)\n\nWith K=1.5 (high virality):\n- Month 1: 100 customers\n- Month 2: 100 × 1.5 = 150 from virality + 100 new paid = 250 total\n- Month 3: 250 × 1.5 = 375 from virality + 100 new paid = 475 total\n- Growth is exponential (compounding)\n\nBy month 12:\n- K=0.5: ~1,300 customers\n- K=1.5: ~180k customers\n\nThe difference is staggering."
      }
    ],
    relatedSlugs: [
      "growth-stage-saas-cfo-metrics-checklist",
      "saas-metrics-by-stage-what-to-track"
    ],
    faq: [
      {
        q: "How do I measure viral coefficient?",
        a: "Track: (1) How many users invite friends (% of active users), (2) How many friends they invite (average), (3) Conversion rate of invites to paid. Multiply those three."
      },
      {
        q: "Can I improve viral coefficient?",
        a: "Yes. Make inviting easier (1-click referral). Incentivize invites (rewards for both referrer and invitee). Improve product so users naturally want to share."
      }
    ],
    videoUrl: ""
  },
  {
    slug: "expansion-arro-annual-recurring-revenue-expansion",
    title: "Expansion ARR: How Much Revenue Comes from Existing Customers (Not New Acquisition)",
    description: "Expansion ARR (annual recurring revenue from existing customers upgrading) is often 30-50% of total ARR in healthy SaaS.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 5,
    keywords: ["expansion ARR", "expansion revenue", "upsell", "upgrades"],
    keyTakeaways: [
      "Expansion ARR = revenue from existing customers (upgrades, upsells, add-ons). New ARR = revenue from new customers. Expansion ARR is often higher ROI than new ARR.",
      "Track expansion as % of total ARR growth. If 50% of growth is from expansion, you're efficiently leveraging existing customer base.",
      "Improve expansion ARR by: (1) building high-value features, (2) creating pricing tiers, (3) bundling add-ons, (4) proactive customer success."
    ],
    content: [
      {
        heading: "Expansion ARR Breakdown: Real Example",
        body: "**Month 1 ending state:**\n- ARR: £1M\n- Composed of: 200 customers × £5k avg = £1M\n\n**Month 2 ending state:**\n- ARR: £1.15M (15% growth)\n- Breakdown:\n  - Existing 200 customers: £4.8M (2% churn, some expansion)\n  - New customers acquired: +£500k (30 new customers × £16.7k avg)\n  - Expansion from existing: +£50k (5% of existing ARR grew)\n  - Total: £1.15M\n\n**Growth composition:**\n- New ARR: £500k (54% of growth)\n- Expansion ARR: £50k (5% of growth... wait, that's only 5%, not great)\n- Churn: -£200k (offset by new and expansion)\n- Net: +£150k\n\nActually, let me recalculate to be clearer:\n\n**Clearer breakdown:**\n- Starting ARR: £1M\n- New customer ARR: +£400k\n- Expansion ARR: +£100k (customers upgraded)\n- Churn ARR: -£300k\n- Ending ARR: £1.2M (20% growth)\n\nExpansion ARR (£100k) is 25% of total growth. This is healthy.\n\n**Why expansion matters:**\n\nFor every £1 spent acquiring new customers, expansion revenue grows 25% as fast. But expansion CAC = £0 (you already have the customer). So expansion has 5-10x better ROI than new customer acquisition."
      }
    ],
    relatedSlugs: [
      "customer-expansion-revenue-upselling-upsells",
      "net-revenue-retention-nrr-expansion"
    ],
    faq: [
      {
        q: "What's a healthy expansion ARR as % of total growth?",
        a: "20-30% is healthy. >30% is excellent (most growth from existing customers). <10% means you're not leveraging your base (focus on expansion)."
      },
      {
        q: "How do I increase expansion ARR?",
        a: "Create upsell opportunities: (1) higher tiers (more features), (2) add-ons (à la carte features), (3) usage-based pricing (grow as they grow), (4) bundling (package features together at premium)."
      }
    ],
    videoUrl: ""
  }
];
