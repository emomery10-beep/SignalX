import { AcademyArticle } from "./academy-types";

export const ACADEMY_CFO_SAAS_BATCH_5_ARTICLES_41_TO_50: AcademyArticle[] = [
  {
    slug: "saas-cash-flow-fundamentals-inflows-outflows",
    title: "SaaS Cash Flow Fundamentals: Inflows, Outflows, and Timing",
    description: "SaaS cash flow is different from traditional business. Learn how to forecast inflows and outflows accurately.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 4,
    keywords: ["cash flow", "SaaS", "inflows", "outflows", "forecasting", "financial planning"],
    keyTakeaways: [
      "SaaS inflows: MRR (recurring), upfront annual payments, expansion revenue. Outflows: salaries, hosting, tools, marketing.",
      "Timing mismatches create cash flow problems: customers pay monthly but you pay hosting providers quarterly upfront.",
      "Real-time cash flow visibility shows when money actually arrives and leaves, not when it's invoiced or accrued."
    ],
    content: [
      {
        heading: "Cash Inflows: When Money Actually Arrives",
        body: "SaaS revenue comes in three forms:\n\n**1. Monthly Recurring Revenue (MRR)**: Customers on monthly plans pay at the start of each month. If you have 100 customers at €100/month, you collect €10k on day 1 of the month.\n\n**2. Upfront Annual Payments**: Some customers prepay annually (€1,200/year instead of €100/month). You collect €1,200 immediately, but you've earned it over 12 months. For cash flow purposes, this is great (cash in, expenses spread across the year). For accounting purposes, this is deferred revenue (a liability until you deliver the service).\n\n**3. Expansion Revenue**: Existing customers upgrade to higher plans. This shows as new revenue but is easier to collect (you already have their payment method on file).\n\nThe timing of inflows matters enormously. A SaaS company with €100k MRR and 50% of customers on annual plans collects €150k on day 1 of January, €100k on day 1 of February, etc. That January spike looks good on a cash balance sheet but is an accounting mirage (you owe delivery of service across 12 months).\n\nBetter question for cash planning: How much cash will actually hit my bank account this week, and when? Real-time systems show you this precisely."
      },
      {
        heading: "Cash Outflows: Fixed Costs, Variable Costs, and Surprises",
        body: "SaaS outflows are more predictable than consumer businesses but still complex:\n\n**Fixed Costs (monthly, predictable)**:\n- Salaries and payroll: €50k–€100k+/month\n- Hosting (cloud infrastructure): €5k–€20k/month\n- Tools and software subscriptions: €5k–€15k/month\n- Office rent: €2k–€10k/month\n- Insurance: €1k–€5k/month\n\n**Variable Costs (scale with revenue)**:\n- Payment processing fees: 2.9% of revenue (€2.9k on €100k revenue)\n- Customer success (contractors, support staff): €5k–€20k/month\n- Marketing spend: €10k–€30k+/month (highly variable, founder-controlled)\n\n**One-Time/Seasonal Costs**:\n- Annual software licenses (often billed in Q1): €20k–€50k\n- Tax payments (quarterly or annually): €10k–€50k\n- Team bonuses: €5k–€30k (often December)\n\nThe challenge: Fixed costs are predictable, but when they're due creates timing gaps. If you pay hosting on the 1st, salaries on the 15th, and taxes on the 20th, you have three separate cash outflow events in a month. A monthly snapshot misses these timing mismatches."
      },
      {
        heading: "The Timing Problem: Why Cash Flow ≠ Profit",
        body: "Here's a realistic scenario:\n\n**January**:\n- Revenue invoiced: €100k (100 customers × €1k/month)\n- Revenue actually collected: €150k (100 customers pay €1k/month + 50 annual customers prepay €1k upfront)\n- Cash in: €150k\n- Operating costs: €60k\n- Cash out: €60k\n- **Net cash in January: +€90k**\n\n**February**:\n- Revenue invoiced: €100k (recurring)\n- Revenue actually collected: €100k (monthly customers, no annual prepayments)\n- Cash in: €100k\n- Operating costs: €60k (plus €50k annual software license due)\n- Cash out: €110k\n- **Net cash February: -€10k (despite being a \"normal\" revenue month)**\n\n**March**:\n- Revenue invoiced: €100k\n- Revenue collected: €100k\n- Cash in: €100k\n- Operating costs: €60k\n- Cash out: €60k\n- **Net cash March: +€40k**\n\nOver Q1, you've invoiced €300k and spent €180k, so profit is €120k. But your actual cash moved: +€90k, -€10k, +€40k = +€120k. In this case, profit and cash match. But if you had churn (customers leaving) or invoice delays (customers not paying on time), profit and cash would diverge significantly.\n\nThis is why real-time cash flow forecasting is critical. A monthly profit report says \"You're healthy,\" but a weekly cash forecast says \"Cash dips negative week 2 of February.\" Prepare accordingly."
      },
      {
        heading: "Forecasting Cash Flow: Building a Rolling Forecast",
        body: "A rolling cash flow forecast answers: \"How much cash will I have each day for the next 13 weeks?\"\n\n**Inputs**:\n- Daily/weekly customer additions (from sales pipeline)\n- Daily/weekly churn (from historical data)\n- Expected expansion revenue (upgrades)\n- Fixed cost calendar (salaries, hosting, tools due dates)\n- Variable cost estimates (% of revenue, or specific items due)\n- Tax and one-time cost calendar\n\n**Example 13-week forecast**:\n```\nWeek 1 (Jan 1-7):\n- Opening cash: €100k\n- Inflows (MRR + annual prepays): €40k\n- Outflows (salaries, hosting, tools): €18k\n- Closing: €122k\n\nWeek 2 (Jan 8-14):\n- Opening: €122k\n- Inflows: €30k\n- Outflows: €18k\n- Closing: €134k\n\n(continue for 13 weeks)\n```\n\n**Key metrics from forecast**:\n- Minimum cash position (lowest point in 13 weeks): €95k on Week 8\n- Cash runway: If burn continues, how many months until zero? ~8 months\n- Weeks where outflows exceed inflows: Weeks 6, 11 (prepare for these)\n\n**Real-time advantages**:\n- System updates forecast daily as new transactions clear\n- If a customer churns, forecast immediately updates (cash dip in 3–4 weeks when their payment is missed)\n- If a customer prepays for a year, cash spike is captured immediately\n- Alerts you 2–3 weeks before a negative cash week so you can take corrective action (pause marketing, delay hiring, chase payments)"
      },
      {
        heading: "Common Cash Flow Mistakes in SaaS",
        body: "**Mistake 1: Assuming annual revenue = annual cash inflow**\nIf you have 100 customers paying €1k/month, you'll invoice €1.2M annually. But if 30% churn each year and you add 30 new customers (net flat), your actual cash collected is closer to €1.1M (because churned customers paid for 6 months, not 12). Don't assume revenue = cash.\n\n**Mistake 2: Forgetting about unearned revenue (deferred revenue)**\nWhen a customer pays €12k upfront for annual access, you have the cash, but it's a liability. Accounting says you've earned €0 (you owe delivery). This creates a confusing gap between cash and profit for new SaaS founders.\n\n**Mistake 3: Not forecasting quarterly costs**\nAnnual software licenses, quarterly tax payments, annual insurance renewals hide in Q1. Founders forget these are coming and run out of cash in March despite being profitable.\n\n**Mistake 4: Assuming customer payment timing is consistent**\nSome customers pay on day 1 of the month. Others pay on the 15th. Some US businesses might pay on the 30th (end of month). If 50% of your revenue is slow to pay, your cash position is much worse than your invoice list suggests.\n\n**Mistake 5: Not tracking cash conversion cycle**\nHow many days between when you incur a cost and when you collect revenue to cover it? If you pay developers on the 1st to build features, but customers don't pay for them until month-end, you have a 30-day gap. For a SaaS with €100k monthly spend, that's €100k of cash tied up in the gap. Awareness of this lets you model it into forecasts."
      },
      {
        heading: "Taking Action: Cash Flow Controls",
        body: "Once you understand your cash flow, take three actions:\n\n**1. Adjust payment timing to your advantage**\n- Invoice customers at the start of the month (not mid-month)\n- Ask customers to pay on the 1st (offer small discount if needed)\n- Negotiate with suppliers to pay net 30 or net 60 (vs. upfront)\n\n**2. Maintain a cash buffer**\n- Keep 2–3 months of operating costs in reserve\n- For €60k monthly costs, that's €120k–€180k buffer\n- This prevents emergency fundraising if an unexpected cost hits\n\n**3. Build cash flow into your financial model**\n- When deciding to hire someone (€5k/month cost), model the cash impact: immediate\n- When launching a marketing campaign (€10k spend), model when you expect revenue (60 days later)\n- Decisions that extend your cash cycle are riskier than ones that tighten it\n\nReal-time systems help by showing you the impact of decisions on your cash position before you make them. \"If I hire this person, my cash position drops by €5k/month. How does that affect my 13-week forecast?\" Answer: in 10 weeks, instead of €150k cash, you'd have €100k. Decision: hire or wait?"
      }
    ],
    relatedSlugs: [
      "what-is-cash-flow",
      "understanding-4-cfo-metric-cards",
      "what-is-cash-runway-and-how-calculated"
    ],
    faq: [
      {
        q: "Should I focus on profit or cash flow?",
        a: "Both, but cash flow is more urgent. A profitable business that runs out of cash goes bankrupt. A slightly unprofitable business with cash in the bank survives. In early growth stages, prioritize cash. Once profitable, profit and cash alignment matters."
      },
      {
        q: "How often should I update my cash flow forecast?",
        a: "Weekly. Inputs change constantly (new customers, churn, unexpected costs). A forecast that's 2 weeks old might be significantly off. Real-time systems update automatically."
      },
      {
        q: "What if my forecast shows I'll run out of cash?",
        a: "Three options: (1) Accelerate revenue (sales push, price increase, expansion), (2) Reduce costs (pause marketing, defer hiring), (3) Raise money (investor capital, debt). Act with 4–6 weeks of runway left, not at zero."
      }
    ],
    videoUrl: ""
  }
];
