import { AcademyArticle } from "./academy-types";

export const ACADEMY_CFO_SAAS_BATCH_10_REWRITTEN: AcademyArticle[] = [
  {
    slug: "financial-controls-fraud-prevention-saas",
    title: "Financial Controls: Preventing Fraud and Catching Mistakes Early",
    description: "Basic financial controls (approval processes, reconciliation, segregation of duties) prevent fraud and catch errors before they become expensive.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 5,
    keywords: ["financial controls", "fraud prevention", "internal controls", "risk management"],
    keyTakeaways: [
      "Three controls prevent 95% of financial issues: (1) expense approval (no purchase >£5k without two approvals), (2) monthly reconciliation (catch errors early), (3) segregation of duties (one person can't spend and approve).",
      "Most SaaS fraud is from insiders (expense padding, duplicate invoices, misuse of company cards). Controls prevent this.",
      "One £50k fraud from a trusted employee costs 50x more in lost cash + recovery than the cost of approval processes."
    ],
    content: [
      {
        heading: "The Three Critical Controls",
        body: "**Control 1: Expense Approval Process**\n\nRule: Any expense >£5k requires:\n- Requestor submits request with business case\n- Manager approves (confirms it's legitimate business)\n- Finance approves (confirms it fits budget)\n- Finally execute the purchase\n\nExample: You want to hire a contractor for £15k.\n- You submit: \"Hire contractor for Q1 product work, estimated cost £15k\"\n- Your manager approves: \"Looks good, aligns with roadmap\"\n- Finance approves: \"We have £25k contractor budget remaining, approve\"\n- You hire the contractor\n\nThis prevents: Unauthorized spending, budget overruns, wasted money on low-priority items.\n\n**Control 2: Monthly Reconciliation**\n\nRule: Every month, reconcile:\n- Bank statement vs. accounting software\n- Credit card statement vs. accounting software\n- Invoices issued vs. revenue in accounting\n\nExample: Bank shows £50k, accounting shows £48k. Investigate the £2k difference.\n- Found: One customer invoice not recorded in accounting (£2k)\n- Fix: Add invoice to accounting\n- Result: Caught a missing £2k before it became a bigger problem\n\nThis prevents: Fraud, duplicate invoices, invoice write-offs without justification.\n\n**Control 3: Segregation of Duties**\n\nRule: No one person should both request AND approve a large expense.\n\nBad: Founder can spend money and approve it (too much power).\nGood: Founder requests spend, CFO approves.\n\nExample: Founder wants to purchase a tool for £10k.\n- Bad: Founder buys it, puts it on corporate card, no one questions it\n- Good: Founder submits request, CFO reviews (is this really needed? Does it fit budget?), CFO approves or denies\n\nThis prevents: Self-dealing, wasteful spend, unauthorized purchases."
      }
    ],
    relatedSlugs: [
      "understanding-4-cfo-metric-cards-dashboard",
      "rolling-cash-forecast-101-saas-cfos"
    ],
    faq: [
      {
        q: "What's the right approval limit (£5k, £10k, £25k)?",
        a: "Depends on your burn rate. If monthly burn is £100k, £5k limit is 5% (reasonable). If monthly burn is £20k, £5k is 25% (too high). Use 2-5% of monthly burn as the limit."
      },
      {
        q: "Do I need these controls in a small startup?",
        a: "Yes, even more so. Small startups can be destroyed by a single £20k fraud. The controls take 30 minutes per purchase; worth it."
      }
    ],
    videoUrl: ""
  },
  {
    slug: "financial-statement-basics-cfo",
    title: "Financial Statements 101: Understanding the P&L, Balance Sheet, and Cash Flow",
    description: "The three core financial statements tell different stories. Learn what each shows and why all three matter.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 5,
    keywords: ["financial statements", "P&L", "balance sheet", "cash flow statement"],
    keyTakeaways: [
      "P&L (income statement): Shows revenue minus expenses = profit. Answer: \"Did we make money this period?\"",
      "Balance sheet: Shows assets minus liabilities = equity. Answer: \"What do we own, owe, and how much is it worth?\"",
      "Cash flow: Shows actual cash in and out. Answer: \"Do we have enough cash to pay bills?\" (Different from profit.)"
    ],
    content: [
      {
        heading: "The Three Statements Explained",
        body: "**Statement 1: P&L (Profit & Loss, aka Income Statement)**\n\nShows: Revenue - Expenses = Profit\n\nExample:\n```\nRevenue: £100,000\nCOGS: -£25,000\nGross profit: £75,000\nOperating expenses: -£60,000\nOperating income: £15,000\nTaxes: -£3,000\nNet income: £12,000\n```\n\nAnswer: We made £12k profit this month (after all costs and taxes).\n\n**Statement 2: Balance Sheet**\n\nShows: Assets = Liabilities + Equity\n\nExample:\n```\nAssets:\n- Cash: £50,000\n- Accounts receivable: £30,000\n- Equipment: £20,000\nTotal assets: £100,000\n\nLiabilities:\n- Accounts payable: £20,000\n- Deferred revenue: £30,000\nTotal liabilities: £50,000\n\nEquity (net worth): £50,000\n```\n\nAnswer: We have £100k in assets. We owe £50k, so equity (what's ours) is £50k.\n\n**Statement 3: Cash Flow**\n\nShows: Cash in - Cash out = net cash change\n\nExample:\n```\nOperating cash: +£50k (profit + adjustments)\nInvesting cash: -£10k (bought equipment)\nFinancing cash: +£0 (no loans)\nNet change: +£40k\nEnding cash: £90k\n```\n\nAnswer: We had £50k in cash at the start, net change +£40k, ending cash £90k.\n\n**Why all three matter:**\n\nYou can have:\n- Profit but no cash (customers haven't paid invoices)\n- Cash but no profit (collected annual payments upfront)\n- Positive cash flow but negative profit (high upfront costs)\n\nEach statement tells part of the story. Together, they show financial health."
      }
    ],
    relatedSlugs: [
      "cash-flow-vs-profit-why-you-need-both",
      "accrual-vs-cash-accounting-saas-difference"
    ],
    faq: [
      {
        q: "Which statement is most important?",
        a: "P&L for profitability analysis. Cash flow for survival (you need cash to pay bills). Balance sheet for valuation. Don't ignore any of them."
      },
      {
        q: "How often should I review financial statements?",
        a: "Monthly minimum. Weekly is better (especially cash flow). Review them the week after month closes."
      }
    ],
    videoUrl: ""
  },
  {
    slug: "metrics-that-matter-what-not-to-track",
    title: "Metrics That Matter vs. Vanity Metrics: Which Numbers Actually Drive Decisions",
    description: "Most SaaS founders track useless vanity metrics (total signups, page views). Learn which metrics actually predict business success.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 5,
    keywords: ["vanity metrics", "actionable metrics", "key metrics", "KPIs"],
    keyTakeaways: [
      "Vanity metrics go up and feel good but don't predict revenue (total users, page views, downloads). Actionable metrics predict business outcomes (churn, CAC, LTV).",
      "Focus on metrics that tie directly to revenue or survival. If a metric doesn't change your decisions, stop tracking it.",
      "Avoid metric gaming (optimizing the metric rather than the business). Example: Paying users to sign up increases signups but destroys unit economics."
    ],
    content: [
      {
        heading: "Vanity Metrics vs. Actionable Metrics",
        body: "**Vanity Metrics (feel good, don't predict success):**\n\n1. Total signups (10,000)\n   - Tells you: Many people tried your product\n   - Doesn't tell you: How many stayed? Do they pay? Do they see value?\n   - Problem: If 95% are free tier users who churn in week 1, signups are meaningless\n\n2. Page views (100,000)\n   - Tells you: Content gets traffic\n   - Doesn't tell you: Do visitors convert to customers? Do they care?\n   - Problem: Bots generate fake traffic. Visitors might be on the wrong page.\n\n3. Monthly active users (5,000)\n   - Tells you: 5k users visited this month\n   - Doesn't tell you: What % are paying? What % will stay next month?\n   - Problem: 4,900 might be free users; only 100 paying.\n\n**Actionable Metrics (predict success):**\n\n1. Paying customer churn (2% monthly)\n   - Tells you: Business health (low churn = sticky product)\n   - Drives decisions: \"2% is healthy, focus on growth\"\n   - Test: If we improve onboarding, does churn drop? Measurable.\n\n2. CAC payback period (8 months)\n   - Tells you: Capital efficiency\n   - Drives decisions: \"8 months is good, can scale acquisition\"\n   - Test: If we switch marketing channels, does payback improve?\n\n3. NRR (105%)\n   - Tells you: Expansion revenue growing\n   - Drives decisions: \"105% NRR, focus on organic growth, reduce new CAC\"\n   - Test: If we add premium tier, does NRR improve?\n\n**The difference:**\n\nVanity metric story: \"We have 10,000 signups! Business is booming!\"\nReality: 9,500 free tier, 1% monthly churn, £0 revenue.\n\nActionable metric story: \"We have 500 paying customers, 2% churn, £50k MRR, NRR 110%.\"\nReality: Sustainable business, growing, predictable.\n\nOne feels good. One actually works."
      }
    ],
    relatedSlugs: [
      "growth-stage-saas-cfo-metrics-checklist",
      "saas-metrics-by-stage-what-to-track"
    ],
    faq: [
      {
        q: "How many metrics should I track?",
        a: "Core metrics daily (4-5: MRR, churn, CAC, retention, burn). Secondary metrics weekly (8-10 more). Vanity metrics never. More metrics = less focus."
      },
      {
        q: "What if a vanity metric is decreasing?",
        a: "Good! Stop obsessing over it. Focus on actionable metrics instead. Example: total signups down 20% is fine if paying customers and churn are stable."
      }
    ],
    videoUrl: ""
  },
  {
    slug: "pricing-psychology-anchoring-willingness-to-pay",
    title: "Pricing Psychology: Anchoring and Understanding Customer Willingness to Pay",
    description: "The first price customers see anchors expectations. Charge too low initially, hard to raise later. Learn psychological pricing principles.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 5,
    keywords: ["pricing psychology", "price anchoring", "willingness to pay", "pricing strategy"],
    keyTakeaways: [
      "Price anchoring: First price customers see sets their expectation. Announce high price (can discount later). Start low (hard to raise without churn).",
      "Willingness to pay varies by customer. Enterprise customers pay 10x more for same value. Segment pricing to capture value from each segment.",
      "Raise prices 10-20% per year for existing customers (they won't churn). Raise 30-50% for new customer pricing (market hasn't anchored to old price)."
    ],
    content: [
      {
        heading: "Price Anchoring: The First Number Matters",
        body: "**Example: Anchoring effect**\n\nScenario A: Start at £50/month\n- Customers anchor to £50\n- Raise to £65 later (30% increase)\n- Churn: 8% (price increase makes customers leave)\n- New customers see £65 and think \"standard price\"\n\nScenario B: Start at £100/month\n- Customers anchor to £100\n- Raise to £80 later (20% decrease, positioning it as \"discount\")\n- Churn: 1% (feels like a deal)\n- New customers see £80 and think \"standard price\"\n\nBoth scenarios end at similar price (£65 vs. £80), but:\n- Scenario A: Lost 8% customers, now seen as expensive\n- Scenario B: No churn, seen as discounted from \"normal\"\n\nThe psychology is powerful. Start high; you can always discount. Start low; hard to raise.\n\n**Willingness to pay varies by segment:**\n\n- Accountant using SaaS: Willing to pay £200/month (saves 10 hours @ £150/hour = £1,500 value)\n- Freelancer using same SaaS: Willing to pay £50/month (saves 5 hours @ £100/hour = £500 value)\n- Student: Willing to pay £5/month (learning, not core business)\n\nThey're all using the same product. But value to them differs 40x.\n\n**Pricing strategy:**\n- Segment A (accountants): £200/month tier (target them, high willingness)\n- Segment B (freelancers): £50/month tier (capture them, lower willingness)\n- Segment C (students): Free tier with ads (monetize later when employed)\n\nCapture value from each segment at their willingness to pay."
      }
    ],
    relatedSlugs: [
      "saas-pricing-strategy-value-based-vs-cost-based",
      "customer-expansion-revenue-upselling-upsells"
    ],
    faq: [
      {
        q: "Should I do annual discount (pay annually, get 20% off)?",
        a: "Depends. Annual discount locks in revenue (you have cash upfront, can't raise prices mid-year). But it increases churn when renewal comes (customer feels anchored to lower price). Use sparingly, only for key segments."
      },
      {
        q: "Is it ever okay to lower prices?",
        a: "For new tiers (add lower tier for new segment), yes. For existing customers, rarely. If competitors force it, position as \"competitive adjustment\" not a permanent lower price."
      }
    ],
    videoUrl: ""
  },
  {
    slug: "forecasting-revenue-seasonal-trends",
    title: "Revenue Forecasting: Accounting for Seasonality, Holidays, and Demand Trends",
    description: "Linear growth assumption is wrong. Most SaaS has seasonal trends (back-to-school, year-end, summer dip). Learn to forecast with seasonality.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 5,
    keywords: ["revenue forecasting", "seasonality", "demand forecasting", "revenue trends"],
    keyTakeaways: [
      "Assume linear growth is wrong. Analyze 12+ months of data to find seasonal patterns (some months 30% higher/lower than average).",
      "Back-to-school (Aug/Sep), year-end (Nov/Dec), and summer (Jun/Jul dips) are common seasonal patterns. Factor them into budgets.",
      "Seasonal forecasts help with cash planning (know when you'll be tight), hiring timing (hire before busy season), and marketing spend allocation."
    ],
    content: [
      {
        heading: "Identifying and Using Seasonal Patterns",
        body: "**Analyzing historical data (example e-learning SaaS):**\n\n```\nMonth-by-month MRR for 12 months:\nJan: £80k  (high, back-to-school for spring term)\nFeb: £75k  (declining)\nMar: £72k  (declining)\nApr: £70k  (low point, summer break)\nMay: £71k  (low)\nJun: £73k  (summer vacation begins)\nJul: £68k  (summer dip, lowest)\nAug: £75k  (back-to-school spike begins)\nSep: £95k  (peak, back-to-school)\nOct: £92k  (still high)\nNov: £100k (year-end prep, budget spending)\nDec: £98k  (year-end)\n```\n\nAverage: £81.7k\nPattern:\n- Low point: Jul (£68k, -17% vs. average)\n- High point: Nov (£100k, +22% vs. average)\n- Seasonal range: 32% variation (17% below to 22% above)\n\n**Using this for forecasting:**\n\nIf you assume 8% monthly growth from £80k starting point:\n- Jan: £80k\n- Feb: £86.4k (8% growth)\n- Mar: £93.3k\n- ...\n- Dec: £172k\n\nBut reality (with seasonality):\n- Jan: £80k\n- Feb: £75k (seasonal dip, below trend)\n- Mar: £72k (deeper dip)\n- ...\n- Dec: £98k (seasonal boost, but much less than £172k))\n\nLinear forecast (£172k) is 75% too high. Seasonal forecast (£98k + 8% trend = £106k) is accurate.\n\nThis affects:\n- Cash planning (you know Jul is tight, need buffer)\n- Hiring (hire BEFORE Sep to handle spike)\n- Marketing (increase spend Jul/Aug to capture Sep demand)"
      }
    ],
    relatedSlugs: [
      "financial-forecasting-scenario-planning-saas",
      "rolling-cash-forecast-101-saas-cfos"
    ],
    faq: [
      {
        q: "How much historical data do I need to identify seasonality?",
        a: "12 months minimum (one full year). 24 months is better (see if pattern repeats). Less than 12 and you're guessing."
      },
      {
        q: "What if I don't have seasonal patterns?",
        a: "B2B enterprise SaaS often has less seasonality (big deals close randomly). B2C SaaS almost always has seasonality (holidays, school calendars). Analyze your data; don't assume."
      }
    ],
    videoUrl: ""
  }
];
