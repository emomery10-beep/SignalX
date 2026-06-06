import { AcademyArticle } from "./academy-types";

export const ACADEMY_CFO_SAAS_BATCH_5_REWRITTEN: AcademyArticle[] = [
  {
    slug: "understanding-4-cfo-metric-cards-dashboard",
    title: "Understanding the 4 CFO Metric Cards: Your Financial Dashboard at a Glance",
    description: "Every SaaS CFO needs 4 core metric cards: Cash Balance, Daily Burn, Cash Runway, and Revenue Growth. Learn to read them daily.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 5,
    keywords: ["CFO metrics", "dashboard", "financial metrics", "KPIs"],
    keyTakeaways: [
      "Four metrics tell your financial story: Cash Balance (where you are now), Daily Burn (how fast you're spending), Cash Runway (how long you last), Revenue Growth (are you scaling).",
      "Check these four daily (2 minutes). If any is red, investigate and act. These metrics are early warning systems.",
      "Real-time dashboards calculate these automatically. Manual spreadsheets are always 1-2 weeks behind."
    ],
    content: [
      {
        heading: "Card 1: Cash Balance (The Current Position)",
        body: "**What it shows:** How much cash you have in the bank right now.\n\n**Example dashboard:**\n```\nCash Balance: £284,200\nStatus: 🟢 Healthy (>3 months runway)\nChange this month: +£15,400 (profitable)\nChange today: +£2,100 (positive cash day)\n```\n\n**What to do:**\n- >12 months runway = safe, focus on growth\n- 6-12 months runway = healthy, watch closely\n- 3-6 months runway = caution, consider fundraising\n- <3 months = critical, fundraise or cut costs immediately\n\n**Red flags:**\n- Declining when revenue is flat (increasing burn)\n- Dropping faster than your forecast predicted (something's wrong)\n- Approaching £0 faster than 6 months (emergency)\n\n**Action:** If cash drops unexpectedly, investigate why (churn spike? higher expenses? payment delays?)"
      },
      {
        heading: "Card 2: Daily Burn Rate (The Velocity)",
        body: "**What it shows:** How much cash you're losing (or gaining) per day.\n\n**Example dashboard:**\n```\nDaily Burn: -£9,400\nStatus: 🟢 Sustainable (burn < 10% of cash/month)\n7-day avg: -£9,200 (trend: improving ↘)\n30-day avg: -£9,500 (stable)\n```\n\n**What to do:**\n- Positive number = gaining cash daily (profitable!)\n- Negative number = losing cash daily (burning)\n- Watch the trend (improving ↘ or worsening ↗)\n\n**Red flags:**\n- Burn rate increasing (↗) = costs rising or revenue falling\n- Burn rate > 10% of cash per month = not sustainable\n- Sudden spike = investigation needed\n\n**Action:** If burn increases, ask why: New hires? Price drop? Increased marketing? Cut back if unsustainable."
      },
      {
        heading: "Card 3: Cash Runway (The Deadline)",
        body: "**What it shows:** How many months until you run out of cash at current burn rate.\n\n**Example dashboard:**\n```\nCash Runway: 30.2 months\nStatus: 🟢 Healthy\nAt current burn: 30.2 months until £0\nIf burn increases 20%: 25 months\nIf revenue grows 10%: 33 months\n```\n\n**What to do:**\n- >12 months = safe, no immediate pressure\n- 6-12 months = plan fundraising\n- 3-6 months = start fundraising actively\n- <3 months = emergency, fundraise or cut aggressively\n\n**Red flags:**\n- Runway declining faster than your forecast\n- Runway <6 months while still pre-revenue/early-revenue\n- Runway shrinking week-over-week\n\n**Action:** When runway approaches 3 months, begin fundraising conversations. Better to raise from strength than desperation."
      },
      {
        heading: "Card 4: Revenue Growth (The Trajectory)",
        body: "**What it shows:** Is your revenue growing month-over-month?\n\n**Example dashboard:**\n```\nMRR: £251,400\nMonthly growth: +8.2% (vs. last month)\n3-month trend: 8%, 7%, 8% (consistent)\nOntrack for: 12% annual growth\n\nBreakdown:\n- New customers: +£18,300\n- Expansion: +£6,200\n- Churn: -£9,400\n- Net: +£15,100\n```\n\n**What to do:**\n- >20% MoM growth = fast scaling (invest aggressively)\n- 10-20% growth = healthy scaling (balance growth & sustainability)\n- 5-10% = slower scaling (improve product/marketing)\n- <5% = stalled (fix growth problem)\n\n**Red flags:**\n- Declining growth trend (8% → 6% → 4%)\n- Churn increasing while new customer growth flat\n- Large customer churn events\n\n**Action:** If growth is declining, investigate: Is it churn? Slower sales? Market saturation? Fix the root cause."
      }
    ],
    relatedSlugs: [
      "daily-burn-rate-explained-saas-founders",
      "cash-runway-calculation-and-interpretation",
      "saas-unit-economics-complete-guide"
    ],
    faq: [
      {
        q: "Should I check these metrics daily or weekly?",
        a: "Check daily (2 minutes). A sudden change in any metric is early warning. Weekly review (30 minutes) to drill into causes. Monthly strategic review (1-2 hours) to plan."
      },
      {
        q: "What if my burn rate is positive (gaining cash)?",
        a: "Congrats, you're profitable! Focus on growth while maintaining profitability. Positive burn rate = cash accumulation rate. You can invest in growth from cash generation."
      },
      {
        q: "How accurate is the runway forecast?",
        a: "Depends on churn predictability. Stable churn (±0.5%) = runway accurate to ±3-5%. Volatile churn (±2%) = runway has wider range. Always plan conservatively (assume churn is higher than expected)."
      }
    ],
    videoUrl: ""
  },
  {
    slug: "rolling-cash-forecast-101-saas-cfos",
    title: "Rolling Cash Forecast 101: Building a 12-Week Cash Forecast That Actually Works",
    description: "A rolling cash forecast shows when you'll hit cash shortfalls weeks in advance. Learn to build one that guides hiring, spending, and fundraising.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 6,
    keywords: ["cash forecast", "cash planning", "weekly forecast", "financial planning"],
    keyTakeaways: [
      "Rolling 12-week cash forecast shows weekly cash position, alerts you to cash shortfalls in advance, and guides operational decisions.",
      "Update weekly with actual numbers (not estimates). Forecast accuracy improves after 4-6 weeks of tracking.",
      "Use forecast for three decisions: (1) When to pay large bills (batch them to cash-positive weeks), (2) When to hire (wait for positive cash week), (3) When to fundraise (before shortfall hits)."
    ],
    content: [
      {
        heading: "12-Week Rolling Forecast Structure",
        body: "**Column headings:**\n- Week number (W1-W12)\n- Starting cash balance\n- Cash inflows (revenue, financing)\n- Cash outflows (payroll, hosting, contractors)\n- Net weekly change\n- Ending cash balance\n\n**Example 12-week forecast:**\n\n```\nWeek | Start Cash | Inflows | Outflows | Net Change | End Cash | Notes\nW1   | £250,000   | £18,000 | -£22,000 | -£4,000    | £246,000 | Normal week\nW2   | £246,000   | £12,000 | -£22,000 | -£10,000   | £236,000 | Contractor payment\nW3   | £236,000   | £20,000 | -£22,000 | -£2,000    | £234,000 | Good week\nW4   | £234,000   | £25,000 | -£42,000 | -£17,000   | £217,000 | Annual hosting renewal\nW5   | £217,000   | £15,000 | -£22,000 | -£7,000    | £210,000 | Slower week\nW6   | £210,000   | £22,000 | -£22,000 | £0         | £210,000 | Breakeven week\nW7   | £210,000   | £28,000 | -£22,000 | +£6,000    | £216,000 | Good growth\nW8   | £216,000   | £20,000 | -£22,000 | -£2,000    | £214,000 | Normal\nW9   | £214,000   | £18,000 | -£22,000 | -£4,000    | £210,000 | Normal\nW10  | £210,000   | £25,000 | -£22,000 | +£3,000    | £213,000 | Growth\nW11  | £213,000   | £16,000 | -£22,000 | -£6,000    | £207,000 | Slower\nW12  | £207,000   | £30,000 | -£72,000 | -£42,000   | £165,000 | Annual AWS renewal\n```\n\n**What this forecast tells you:**\n- Week 4: Cash dips £17k (hosting renewal) but stays positive\n- Week 6: Breakeven week (if you hit this exactly, it's a sign your growth is stalling)\n- Week 12: Large outflow (annual AWS renewal). Start saving or ensure revenue is strong\n- Lowest point: Week 5 at £210k (still 2+ months of runway at current burn)\n\nEverything looks healthy. No immediate cash crisis."
      },
      {
        heading: "Updating the Forecast Weekly",
        body: "**Every Friday afternoon:**\n1. Compare actual results vs. forecast\n2. Note variances (\"revenue was £18k, forecast said £20k, missed by £2k\")\n3. Update Week 1 with actuals\n4. Roll off Week 1, add Week 13 with new assumptions\n5. Adjust Weeks 2-12 if patterns have changed\n\n**Real update example:**\n\nForecast said Week 1 inflow = £18k. Actual = £15k (£3k miss).\n\nWhy? One customer delayed payment (due next week now).\n\nAction: Move that £15k inflow from Week 2 to Week 3 (customer said they'd pay in 2 weeks).\n\nThis cascades:\n- Week 2 forecast was £12k in, now £10k in (one customer paid, but the delayed one isn't here)\n- Week 3 forecast was £20k in, now £25k in (delayed customer + normal week)\n- Net impact: Same total over 3 weeks, but timing has shifted\n\nWith weekly updates, you're always planning with current reality, not stale assumptions."
      }
    ],
    relatedSlugs: [
      "burn-rate-runway-how-long-can-you-operate",
      "cash-flow-vs-profit-why-you-need-both",
      "understanding-4-cfo-metric-cards-dashboard"
    ],
    faq: [
      {
        q: "How accurate is a 12-week forecast?",
        a: "Weeks 1-4: 80-90% accurate (short enough to see clearly). Weeks 5-8: 60-70% accurate (more uncertainty). Weeks 9-12: 40-50% accurate (longer-term assumptions). Use forecasts as guides, not gospel, and update weekly."
      },
      {
        q: "Should I include customer payments that are late?",
        a: "Model two scenarios: (1) Optimistic (customer pays on time), (2) Conservative (customer pays 1-2 weeks late). Plan spending for conservative scenario. If optimistic hits, it's upside."
      },
      {
        q: "What if my cash inflows are irregular (some months high, some low)?",
        a: "Build forecast based on historical patterns by week of month. \"Weeks 1-2 are usually slow (customer payments pending), weeks 3-4 are strong (payments arriving).\" Use patterns from prior 3 months to guide assumptions."
      }
    ],
    videoUrl: ""
  },
  {
    slug: "burn-rate-runway-how-long-can-you-operate",
    title: "Burn Rate and Runway: How Long Until You Run Out of Cash?",
    description: "Monthly burn rate and cash runway are the most critical metrics for survival. Learn to calculate, track, and improve both.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 5,
    keywords: ["burn rate", "runway", "cash runway", "survival", "financial planning"],
    keyTakeaways: [
      "Burn rate = monthly burn rate (cash out - cash in). Runway = cash balance ÷ monthly burn. These two numbers determine if you survive or fail.",
      "Every £1,000 reduction in monthly burn extends runway by 4 weeks. Hiring decisions directly impact runway.",
      "When runway <6 months, start fundraising. When runway <3 months, cut costs aggressively or face shutdown risk."
    ],
    content: [
      {
        heading: "Calculating Burn Rate and Runway",
        body: "**Burn rate calculation:**\nBurn rate = (Monthly expenses - Monthly revenue) ÷ 30 days\n\n**Example:**\n- Monthly expenses: £150,000\n- Monthly revenue: £50,000\n- Monthly burn: £100,000\n- Daily burn: £100,000 ÷ 30 = £3,333/day\n\n**Runway calculation:**\nRunway = Cash balance ÷ Monthly burn rate\n\n**Example (continued):**\n- Cash balance: £600,000\n- Monthly burn: £100,000\n- Runway: £600,000 ÷ £100,000 = 6 months\n\nAt current burn, you have 6 months before hitting £0 cash.\n\n**Impact of changes:**\n\nIf you hire an engineer (+£5k/month): Burn goes to £105k/month, runway drops to 5.7 months (5 weeks shorter).\n\nIf you raise prices 10% (+£5k/month revenue): Burn goes to £95k/month, runway extends to 6.3 months (5 weeks longer).\n\nSmall changes to burn compound into months of runway difference."
      }
    ],
    relatedSlugs: [
      "daily-burn-rate-explained-saas-founders",
      "cash-flow-vs-profit-why-you-need-both",
      "understanding-4-cfo-metric-cards-dashboard"
    ],
    faq: [
      {
        q: "What's a healthy runway for a SaaS company?",
        a: "Bootstrapped/pre-revenue: 12+ months (need time to build and launch). Early revenue: 12-18 months (time to scale). Growth stage: 6-12 months (faster cash burn due to scaling, but revenue growing). Mature: <6 months (should be profitable). If below target, fundraise."
      },
      {
        q: "Should I cut costs to extend runway, or invest to grow faster?",
        a: "Balance. If runway <6 months, cut. If runway >12 months and growth <10% MoM, invest (you're underutilizing capital). If runway 6-12 months and growth >15% MoM, keep investing (growth is worth more than cash safety). The exact balance depends on risk tolerance."
      },
      {
        q: "How do I forecast runway if revenue is unpredictable?",
        a: "Model three scenarios: (1) Conservative (revenue stays flat, burn increases from hiring), (2) Base (revenue grows 10% MoM, burn increases 5% MoM), (3) Optimistic (revenue grows 20% MoM, burn flat). Plan for conservative scenario."
      }
    ],
    videoUrl: ""
  },
  {
    slug: "what-is-cash-runway-and-how-calculated",
    title: "What is Cash Runway and How It's Calculated (With Real Examples)",
    description: "Cash runway is the most important metric for early-stage SaaS survival. Learn to calculate it accurately and track it weekly.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 5,
    keywords: ["cash runway", "runway calculation", "cash survival", "burn rate"],
    keyTakeaways: [
      "Runway = months of cash remaining at current burn rate. It's your deadline for profitability or fundraising.",
      "Update runway weekly with current burn rate and cash balance. Monthly updates are too slow.",
      "When runway hits 3-6 months, start fundraising conversations. When it hits 3 months, fundraise actively or prepare to shut down."
    ],
    content: [
      {
        heading: "Three Scenarios: How Runway Changes",
        body: "**Scenario 1: Pre-revenue startup**\n- Cash: £80,000\n- Monthly burn: £8,000\n- Runway: 10 months\n- Action: You have 10 months to ship, launch, and achieve product-market fit\n\n**Scenario 2: Early revenue, growing**\n- Cash: £300,000\n- Monthly burn: £50,000 (from revenue of £20k)\n- Runway: 6 months\n- Action: Start fundraising conversations (runway <6 months)\n\n**Scenario 3: Growth stage, still burning**\n- Cash: £1,000,000\n- Monthly burn: £150,000 (from revenue of £100k, growing 20% MoM)\n- Runway: 6.7 months\n- Action: Fundraising window is closing. Decide: reach profitability in 6 months, or raise capital\n\nNotice: Same 6-month runway in scenarios 2 and 3, but different situations. Scenario 2 is worried. Scenario 3 has growth momentum but is in a fundraising race."
      }
    ],
    relatedSlugs: [
      "burn-rate-runway-how-long-can-you-operate",
      "understanding-4-cfo-metric-cards-dashboard"
    ],
    faq: [
      {
        q: "Should I calculate runway monthly or weekly?",
        a: "Weekly is better. Burn rate changes daily as you log expenses. Weekly updates give you early warning if runway is shrinking faster than expected."
      },
      {
        q: "What if my revenue is growing faster than my burn?",
        a: "Congratulations, you're on path to profitability. Runway is no longer your constraint; growth is. Focus on scaling without blowing up profitability."
      }
    ],
    videoUrl: ""
  },
  {
    slug: "how-to-read-cash-runway-card-askbiz",
    title: "How to Read the Cash Runway Card: Your Survival Deadline at a Glance",
    description: "The Cash Runway card on your financial dashboard tells you when you run out of money. Learn to read it and act on it.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 4,
    keywords: ["runway card", "cash runway", "dashboard", "financial metrics"],
    keyTakeaways: [
      "Cash Runway card shows: current runway, trend (improving or worsening), and what-if scenarios (if you change burn or revenue).",
      "Green = >12 months (safe). Yellow = 6-12 months (start planning). Red = <6 months (urgent).",
      "Use what-if scenarios to model decisions before you make them. \"If I hire this person, runway goes from 8 to 7 months. Worth it?\""
    ],
    content: [
      {
        heading: "Reading the Card: Example",
        body: "**Display:**\n```\nCash Runway: 8.4 months\nStatus: 🟡 Caution (below 12 months)\nTrend: ↘ Improving (was 8.1 months last week)\n\nWhat-if scenarios:\nIf burn reduces 20%: 10.5 months\nIf revenue grows 10%: 9.2 months\nIf you hire 2 engineers: 7.1 months\n```\n\n**Interpretation:**\n- Current runway is 8.4 months (less than 12 months = caution)\n- Trend is improving (↘) = burn is decreasing or revenue increasing (good sign)\n- Hiring 2 engineers would reduce runway to 7.1 months (new breakeven = month 7)\n- Reducing burn 20% could extend runway to 10.5 months (more comfortable)\n\n**Action:**\nYou're in the fundraising window. You have 8-10 months before you're forced to cut costs or shut down. Start conversations with investors now while you have time to negotiate properly."
      }
    ],
    relatedSlugs: [
      "burn-rate-runway-how-long-can-you-operate",
      "understanding-4-cfo-metric-cards-dashboard"
    ],
    faq: [
      {
        q: "How often is the runway card updated?",
        a: "In real-time systems like AskBiz, the runway card updates daily as you log expenses and track revenue. This gives you the most current deadline."
      },
      {
        q: "What if runway is negative?",
        a: "You've run out of cash (or are about to). Emergency mode: cut costs immediately, accelerate revenue collection, or raise emergency capital. This shouldn't surprise you if you're monitoring weekly."
      }
    ],
    videoUrl: ""
  }
];
