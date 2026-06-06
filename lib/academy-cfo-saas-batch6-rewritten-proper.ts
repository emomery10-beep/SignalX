import { AcademyArticle } from "./academy-types";

export const ACADEMY_CFO_SAAS_BATCH_6_REWRITTEN: AcademyArticle[] = [
  {
    slug: "reading-burn-rate-drill-down-askbiz",
    title: "Reading the Burn Rate Drill-Down: Understanding What's Driving Your Spend",
    description: "The burn rate card shows you're spending £15k/month. The drill-down shows which departments, projects, or cost categories are responsible. Learn to read it.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 5,
    keywords: ["burn rate", "cost analysis", "expense breakdown", "financial dashboard"],
    keyTakeaways: [
      "Burn rate drill-down breaks down costs by category (salaries, hosting, tools, contractors). Identify which category is eating the budget.",
      "Watch for surprises: \"Salaries should be £40k, but actual is £45k. Why? Two unexpected hires last month.\"",
      "Use drill-down to run scenarios: \"If we cut contractor spending 50%, save £3k/month, extend runway by 4 months.\""
    ],
    content: [
      {
        heading: "Sample Burn Rate Drill-Down",
        body: "**Monthly Burn: £85,000**\n\n**Breakdown by category:**\n- Salaries: £48,000 (56% of burn)\n- Hosting (AWS, etc.): £12,000 (14%)\n- Tools & SaaS subscriptions: £8,000 (9%)\n- Contractors/freelancers: £10,000 (12%)\n- Office & operations: £3,000 (4%)\n- Marketing & ads: £2,000 (2%)\n- Other: £2,000 (2%)\n\n**What this tells you:**\n- Salaries are your largest expense (56%). This is normal for SaaS.\n- Hosting is second (14%). Watch for AWS spikes; could mean usage is increasing (good) or inefficiency (bad).\n- Contractors are 12%. If this is growing month-over-month, you're scaling headcount without hiring full-time (risky)\n- Everything else is relatively small\n\n**Year-over-year trend:**\n- Last year same time: £72,000 burn (18% increase)\n- Drivers: Hired 2 engineers (+£8k), added 1 contractor (+£2k), AWS increased (+£2k)\n- Implication: Growing costs tracking with headcount growth. Healthy.\n\nIf burn was increasing faster than headcount, you'd have a problem (costs out of control)."
      },
      {
        heading: "Using Drill-Down for Decisions",
        body: "**Scenario: You need to extend runway by 2 months**\n\nCurrent burn: £85k/month, cash: £250k, runway: 2.9 months\n\nOption 1: Cut salaries 10%\n- Reduce burn to £76.2k/month\n- New runway: 3.3 months (only 0.4 months gained)\n- Impact: Cuts would hurt—lay off staff or reduce pay\n\nOption 2: Cut contractors 50%\n- Reduce burn to £80k/month\n- New runway: 3.1 months (0.2 months gained)\n- Impact: Low, if you can pause contractor work\n\nOption 3: Reduce hosting 20%\n- Reduce burn to £82.6k/month\n- New runway: 3.0 months (0.1 months gained)\n- Impact: Optimize infrastructure (no team reduction needed)\n\nOption 4: Cut salaries 10% + reduce contractors 50% + optimize hosting 20%\n- New burn: £76.2k + £80k + £82.6k = reduced to £71k/month\n- New runway: 3.5 months (0.6 months gained)\n- Impact: Combined measures are manageable; no single area feels the pain\n\nThe drill-down makes this analysis visible. You can model different cuts and their impact."
      }
    ],
    relatedSlugs: [
      "burn-rate-runway-how-long-can-you-operate",
      "understanding-4-cfo-metric-cards-dashboard",
      "financial-forecasting-scenario-planning-saas"
    ],
    faq: [
      {
        q: "How do I know if my burn rate breakdown is healthy?",
        a: "SaaS typical breakdown: Salaries 50-70%, hosting 5-15%, tools 5-10%, contractors 5-15%, everything else 5-10%. Your breakdown should align roughly with industry."
      },
      {
        q: "What if one category is growing much faster than others?",
        a: "Investigate. If salaries are growing faster than headcount (salary inflation), that's a concern. If hosting is growing while customer count is flat, investigate AWS efficiency."
      },
      {
        q: "Should I try to minimize every category?",
        a: "No. Salaries are intentionally high because you want good engineers. Minimize costs that don't directly support revenue growth (fancy office, unused tools, inefficient processes)."
      }
    ],
    videoUrl: ""
  },
  {
    slug: "cohort-retention-analysis-tracking-customer-quality",
    title: "Cohort Retention Analysis: Tracking Customer Quality Over Time",
    description: "Early cohorts might have 85% month-1 retention, but recent cohorts have 78%. Your acquisition quality is declining. Learn to spot and fix it.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 5,
    keywords: ["cohort retention", "customer quality", "acquisition quality", "retention analysis"],
    keyTakeaways: [
      "Compare retention curves across cohorts. If January cohort has 80% month-3 retention but June cohort has 75%, you're acquiring lower-quality customers.",
      "Declining cohort quality = either your product is declining, or you're attracting worse-fit customers with your marketing.",
      "Fix early: Revert to high-quality marketing channels, improve product onboarding, or refocus target customer profile."
    ],
    content: [
      {
        heading: "Cohort Quality Comparison: The Red Flag",
        body: "**Healthy scenario: Improving cohort quality**\n```\nJanuary cohort: 85% month-1, 78% month-3\nFebruary cohort: 86% month-1, 79% month-3\nMarch cohort: 87% month-1, 80% month-3\nTrend: Improving (each cohort is stickier than the last)\n```\n\nInterpretation: Your product and marketing are working better over time. Great signal.\n\n**Warning scenario: Declining cohort quality**\n```\nJanuary cohort: 85% month-1, 78% month-3\nFebruary cohort: 82% month-1, 74% month-3\nMarch cohort: 80% month-1, 71% month-3\nTrend: Declining (each cohort is worse than the last)\n```\n\nInterpretation: Something changed. Cohorts are stickier early (month 1 okay) but drop off faster (month 3 worse). Possible causes:\n- Customers signing up for wrong reasons (initial excitement fades)\n- Product getting worse (recent bug? bad update?)\n- Lower-quality customer acquisition (marketing channel changed)\n- Product-market fit weakening (competitors emerging)\n\n**Critical action:** Investigate what changed in February (when declining started). Did you:\n- Launch new marketing campaign?\n- Make product changes?\n- Change target customer profile?\n- Shift sales messaging?\n\nOne of these likely caused the cohort quality decline."
      }
    ],
    relatedSlugs: [
      "saas-cohort-analysis-retention-curves",
      "churn-management-real-time-customer-metrics",
      "net-revenue-retention-nrr-expansion"
    ],
    faq: [
      {
        q: "Should I aim for cohorts to have identical retention, or different?",
        a: "Improvement is great (newer cohorts better), but stability is also good (predictable LTV). Decline is the red flag. Either way, you want to understand why cohorts differ."
      },
      {
        q: "If old cohorts are better, should I revert to old marketing?",
        a: "Maybe. If January cohort (85% month-1 retention) came from organic/referral, and March cohort (80% retention) came from paid ads, switching marketing channels could improve. But test first."
      },
      {
        q: "How much cohort decline is acceptable?",
        a: "2-3% decline per cohort is natural. >5% decline is red flag. If you see 5%+ month-over-month, investigate immediately before it compounds."
      }
    ],
    videoUrl: ""
  },
  {
    slug: "unit-economics-by-customer-segment",
    title: "Unit Economics by Customer Segment: Enterprise vs. SMB vs. Freemium",
    description: "Your enterprise customers might have 12x LTV:CAC while your SMB customers have 3x. Learn which segments are profitable and double down on those.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Advanced",
    readTime: 6,
    keywords: ["unit economics", "customer segments", "profitability by segment", "CAC LTV"],
    keyTakeaways: [
      "Unit economics vary dramatically by segment. Enterprise 15x LTV:CAC, SMB 4x, Freemium 2x. Know which segments are profitable.",
      "Kill unprofitable segments (or fix them). If freemium conversion is <2%, it's a user acquisition channel, not a business model.",
      "Allocate marketing budget to high-ROI segments. If enterprise has 5x CAC payback but SMB has 12x, focus on enterprise."
    ],
    content: [
      {
        heading: "Unit Economics by Segment: Real Example",
        body: "**Segment 1: Enterprise (£500k+ annual contracts)**\n- ACV: £500k\n- CAC: £200k (6-month sales cycle, 2 sales reps)\n- Gross margin: 80%\n- Gross profit: £400k per year\n- Monthly gross: £33k\n- Monthly churn: 0.5%\n- LTV: £33k ÷ 0.005 = £6.6M\n- LTV:CAC: 33x (exceptional)\n- Payback: 6 months\n\n**Segment 2: SMB (£50k annual, self-serve + light sales)**\n- ACV: £50k\n- CAC: £2k (direct ads, content marketing)\n- Gross margin: 75%\n- Gross profit: £37.5k per year\n- Monthly gross: £3.1k\n- Monthly churn: 8%\n- LTV: £3.1k ÷ 0.08 = £38.75k\n- LTV:CAC: 19x (good)\n- Payback: 8 months\n\n**Segment 3: Freemium (£0 - £10k annual, mostly free users)**\n- CAC: £0 (free tier = CAC is cost to serve, not acquire)\n- Cost to serve: £10/month per free user\n- Paying users: 2% conversion rate\n- ACV: £5k (free users convert at low price)\n- Gross margin: 60% (high support costs)\n- Gross profit: £3k\n- Monthly churn: 15% (high)\n- LTV: (£3k ÷ 12) ÷ 0.15 = £1.67k\n- LTV:CAC: N/A (freemium is acquisition channel, not revenue)\n- Payback: Never (lose money)\n\n**Decision matrix:**\n- Enterprise: Highly profitable. Invest more. Scale sales team.\n- SMB: Profitable. Good balance. Optimize conversion rate.\n- Freemium: Not profitable on its own. Keep if it feeds enterprise. Kill if not."
      }
    ],
    relatedSlugs: [
      "saas-unit-economics-complete-guide",
      "customer-expansion-revenue-upselling-upsells",
      "growth-stage-saas-cfo-metrics-checklist"
    ],
    faq: [
      {
        q: "How do I track unit economics by segment if I don't have segmented customer data?",
        a: "Start with basic segmentation: enterprise (>£100k ACV) vs. SMB (<£50k ACV) vs. freemium. Track CAC and churn separately for each. Over time, add more nuance (by geography, industry, acquisition channel)."
      },
      {
        q: "Should I focus on the most profitable segment or the biggest segment?",
        a: "Focus on the most profitable, then expand. Enterprise is typically highest ROI. After scaling enterprise, diversify to SMB. Freemium is last resort (if profitable at all)."
      },
      {
        q: "If my SMB unit economics are bad, should I kill SMB?",
        a: "Not necessarily. Improve them first: reduce CAC (better targeting), improve retention (better onboarding), increase ACV (raise prices). If still unprofitable after optimization, pivot or kill."
      }
    ],
    videoUrl: ""
  },
  {
    slug: "nrr-growth-without-new-customers",
    title: "NRR >100%: Why This Metric Means You're Growing Without New Customers",
    description: "If your Net Revenue Retention is 120%, you could stop acquiring customers and still grow 20%. This is the holy grail of SaaS metrics.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 5,
    keywords: ["NRR", "net revenue retention", "organic growth", "expansion"],
    keyTakeaways: [
      "NRR >100% means existing customers generate more revenue this month than last month (through expansion). This is powerful because it scales without CAC.",
      "Most SaaS with NRR <100% are acquisition-dependent and fragile. NRR >100% is the sign of a strong product that customers love and expand within.",
      "Improving NRR from 95% to 105% = 30% faster revenue growth (exponential, not linear). Target NRR >110% for high-growth SaaS."
    ],
    content: [
      {
        heading: "Why NRR >100% Changes Everything",
        body: "**Scenario A: NRR 95% (common, acquisition-dependent)**\n\nMonth 1:\n- Revenue from existing customers: £100k\n- Expansion from upgrades: £2k\n- Churn (lost revenue): -£7k\n- NRR: (100 + 2 - 7) ÷ 100 = 95%\n- Month 2 revenue from existing customers: £95k\n\nNew customer acquisition needed to offset churn: 5-10 new customers/month just to stay flat.\n\nGrowth formula: New customers growth - churn loss = net growth\n\nIf you acquire 20% more customers but lose 5% to churn, net is 15% growth. You're dependent on constant acquisition.\n\n**Scenario B: NRR 110% (best-in-class)**\n\nMonth 1:\n- Revenue from existing customers: £100k\n- Expansion from upgrades: £12k\n- Churn (lost revenue): -£2k\n- NRR: (100 + 12 - 2) ÷ 100 = 110%\n- Month 2 revenue from existing customers: £110k\n\nGrowth formula: NRR growth rate = 10% compound monthly growth\n\nEven with ZERO new customer acquisition, you grow 10% monthly from existing customers.\n\n**Comparison over 12 months:**\n\nScenario A (NRR 95%, need 20% new customer acquisition):\n- Month 1: £100k revenue\n- Month 12: ~£320k revenue (3.2x growth)\n- Formula: £100k × (1.15)^12 ≈ £320k\n\nScenario B (NRR 110%, need zero new customer acquisition):\n- Month 1: £100k revenue\n- Month 12: ~£310k revenue (3.1x growth)\n- Formula: £100k × (1.10)^12 ≈ £310k\n\nSimilar total growth, but Scenario B gets there with no acquisition cost. Scenario B can double down on expansion instead of acquisition. Their LTV is higher, their business is stickier, their cash efficiency is better."
      }
    ],
    relatedSlugs: [
      "net-revenue-retention-nrr-expansion",
      "customer-expansion-revenue-upselling-upsells",
      "saas-cohort-analysis-retention-curves"
    ],
    faq: [
      {
        q: "How do I calculate NRR?",
        a: "NRR = (Starting month revenue + expansion revenue - churn revenue) ÷ starting month revenue. Expansion = upsells, upgrades, cross-sells. Churn = cancellations, downgrades."
      },
      {
        q: "What's a good NRR target?",
        a: "100%+ is essential. 100-110% is healthy. 110%+ is exceptional. SaaS unicorns typically have NRR >120%."
      },
      {
        q: "How do I improve NRR?",
        a: "Two levers: (1) Reduce churn (improve retention through product quality + support), (2) Increase expansion (upsells, add-ons, higher-tier plans). Start with churn reduction."
      }
    ],
    videoUrl: ""
  },
  {
    slug: "cap-table-dilution-equity-planning",
    title: "Cap Table and Dilution: Understanding Who Owns What and How Fundraising Dilutes You",
    description: "Your cap table shows ownership. Fundraising dilutes your ownership. Learn the math and plan accordingly.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Advanced",
    readTime: 6,
    keywords: ["cap table", "dilution", "ownership", "equity", "fundraising"],
    keyTakeaways: [
      "Cap table lists all shareholders, shares owned, and options. Fundraising dilutes all existing shareholders' ownership percentage (but not their absolute value if company grows).",
      "Typical Series A round dilutes founders 20-30%. Series B another 15-25%. Plan for 50%+ dilution by Series C if you raise at each round.",
      "Dilution is painful but necessary to grow. A founder with 80% of a £10M company is worse off than 40% of a £1B company."
    ],
    content: [
      {
        heading: "Cap Table Example: Tracking Ownership",
        body: "**Pre-seed (company formation):**\n```\nFounder A: 500,000 shares (50%)\nFounder B: 500,000 shares (50%)\nTotal issued: 1,000,000 shares\n```\n\n**Series A (raise £2M at £10M post-money valuation):**\n- Company needs to issue enough shares so investors get 20% ownership (standard)\n- Post-money valuation: £10M\n- Investor gets: 20% × £10M ÷ £10 per share = 200,000 shares\n- New total shares: 1,000,000 + 200,000 = 1,200,000\n- Founders' ownership: 1,000,000 ÷ 1,200,000 = 83.3% (was 100%, now diluted to 83.3%)\n\n**Series B (raise £8M at £50M post-money valuation):**\n- Investor gets: 20% × £50M ÷ £50 per share = 200,000 shares\n- New total shares: 1,200,000 + 200,000 = 1,400,000\n- Founders' ownership: 1,000,000 ÷ 1,400,000 = 71.4% (diluted from 83.3%)\n- Employee option pool: 5% × 1,400,000 = 70,000 shares\n\n**Cap table at Series B:**\n```\nFounder A: 500,000 shares (35.7%)\nFounder B: 500,000 shares (35.7%)\nSeries A investor: 200,000 shares (14.3%)\nSeries B investor: 200,000 shares (14.3%)\nEmployee option pool: 70,000 shares (5%)\n\nTotal: 1,400,000 shares\n```\n\n**The dilution math:**\n- Founders started at 100% ownership\n- After Series A: 83.3% ownership\n- After Series B: 71.4% ownership\n- Diluted by 28.6% total\n\nBUT: Company grew from £10M to £50M post-money (5x value growth). \n- Founder A's 500k shares worth: £5M pre-Series A, £25M post-Series B\n- Even at 35.7% ownership, their stake is now £17.9M (worth more in absolute dollars)\n\nDilution of percentage is offset by company growth. This is the deal."
      }
    ],
    relatedSlugs: [
      "series-a-prep-uk-cfo-requirements",
      "fundraising-financial-due-diligence"
    ],
    faq: [
      {
        q: "How much dilution should I expect from fundraising?",
        a: "Typical: Seed 20%, Series A 25%, Series B 20%, Series C 20%. Total dilution by Series C: ~60%. Plan for this when thinking about ownership retention."
      },
      {
        q: "Should I fight to minimize dilution or just accept it?",
        a: "Accept the standard terms (investors expect 20-25% per round). Fighting for less might mean you don't get funded, or you get worse terms elsewhere. Focus on company growth instead."
      },
      {
        q: "What about employee options?",
        a: "Typical: 10-15% option pool at Series A, additional pools at later rounds. Employee options are dilutive to founders but necessary to attract talent. Plan for 5-10% total dilution from options over 5 years."
      }
    ],
    videoUrl: ""
  }
];
