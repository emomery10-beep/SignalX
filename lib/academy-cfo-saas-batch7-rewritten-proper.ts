import { AcademyArticle } from "./academy-types";

export const ACADEMY_CFO_SAAS_BATCH_7_REWRITTEN: AcademyArticle[] = [
  {
    slug: "saas-metrics-by-stage-what-to-track",
    title: "SaaS Metrics by Stage: What to Track at Pre-Product, Early-Revenue, and Growth",
    description: "Metrics that matter at £100k MRR differ from £10M. Learn which metrics to focus on at each stage.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 6,
    keywords: ["SaaS metrics", "metrics by stage", "growth metrics", "KPIs"],
    keyTakeaways: [
      "Pre-product stage: Track runway, burn rate, early customer feedback. Skip fancy metrics.",
      "Early revenue (£10-500k MRR): Track MRR, churn, CAC, retention curves. Skip unit economics optimization.",
      "Growth stage (£500k-5M): Track NRR, unit economics by segment, cohort quality. Skip day-to-day cash (you have months of runway)."
    ],
    content: [
      {
        heading: "Stage 1: Pre-Product (Before Launch)",
        body: "**Metrics that matter:**\n- Cash runway (when do you run out?)\n- Daily burn rate (how fast?)\n- Time to launch (on track?)\n\n**Metrics that don't matter:**\n- MRR (you don't have any)\n- Churn (no customers)\n- CAC (not spending on acquisition yet)\n- Unit economics (premature)\n\n**Why:** You're in \"get to product-market fit\" mode. The only metric that matters is: \"How long do I have to validate the idea before I run out of money?\"\n\nBudget 6-12 months for pre-product. Track weekly burn, monthly runway. Everything else is distraction.\n\n**Red flag:** Burn rate increasing (more people, more spend, but still no product). Be aggressive about cost control."
      },
      {
        heading: "Stage 2: Early Revenue (£10-500k MRR)",
        body: "**Metrics that matter:**\n- MRR and MoM growth rate (is traction real?)\n- CAC (how much does acquisition cost?)\n- Churn rate (what % leave?)\n- Retention curves by cohort (are people sticking?)\n- Gross margin (can we be profitable?)\n\n**Metrics that are secondary:**\n- NRR (too early to optimize expansion)\n- Unit economics by segment (only have 1-2 segments)\n- LTV:CAC ratio (focus on absolute churn, not ratios)\n\n**Why:** You're in \"prove the unit economics work\" mode. Does CAC < 33% of LTV? Is churn <3% monthly? Can you be profitable at scale?\n\nThese questions determine if you have a real business.\n\n**Red flag:** Churn increasing (your product isn't sticky), or CAC increasing (market saturation). Both are hard to fix later."
      },
      {
        heading: "Stage 3: Growth (£500k-5M MRR)",
        body: "**Metrics that matter:**\n- NRR (organic growth from existing customers)\n- Unit economics by segment (are all segments profitable?)\n- Cohort quality (are newer cohorts as good as older?)\n- Magic number (sales efficiency)\n- Payback period (how long to recover CAC)\n\n**Metrics that are secondary:**\n- Daily cash runway (you have 12+ months, stop worrying)\n- Individual MRR (trends matter more than snapshots)\n- Churn (assume it's stable; focus on cohort quality instead)\n\n**Why:** You're in \"scale the machine\" mode. The business model works; now scale it profitably. NRR tells you if you can scale without customer acquisition. Unit economics by segment tells you which segments to double down on.\n\n**Red flag:** NRR <100% (losing revenue to churn faster than gaining from expansion), or cohort quality declining (acquisition getting worse)."
      }
    ],
    relatedSlugs: [
      "growth-stage-saas-cfo-metrics-checklist",
      "saas-unit-economics-complete-guide",
      "net-revenue-retention-nrr-expansion"
    ],
    faq: [
      {
        q: "At what MRR should I shift from early-revenue to growth stage focus?",
        a: "Around £500k-1M MRR. By then, you have 12+ months of churn data (retention curves are stable), enough customers to segment, and clear unit economics. Time to optimize."
      },
      {
        q: "Should I track all metrics, or just core metrics?",
        a: "Track core metrics daily (2 minutes). Secondary metrics weekly (10 minutes). Tertiary metrics monthly (if at all). Too many metrics = paralysis."
      }
    ],
    videoUrl: ""
  },
  {
    slug: "financial-modeling-templates-saas-founders",
    title: "Financial Modeling for SaaS: Building a 3-Year Projection That Investors Believe",
    description: "Investors want to see 3-year projections. Learn to build models that are realistic, detailed, and defensible.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Advanced",
    readTime: 7,
    keywords: ["financial modeling", "projections", "investor presentations", "forecasting"],
    keyTakeaways: [
      "3-year model should have: month 1-24 detailed, months 25-36 quarterly. Show revenue build-up, cost structure, profitability timeline.",
      "Investors look at the model to see: (1) Do your assumptions make sense? (2) When do you break even? (3) What's your margin structure?",
      "Detailed models that match reality are worth far more than optimistic models. Build conservatively, then show sensitivities."
    ],
    content: [
      {
        heading: "3-Year SaaS Financial Model Structure",
        body: "**Rows (line items):**\n\n*Revenue:*\n- Starting MRR (month 1)\n- Monthly growth rate (assumption: e.g., 10% MoM)\n- Projected MRR by month\n- Churn assumption (e.g., 2% monthly)\n- Net MRR (after churn)\n\n*Costs:*\n- Salaries (base team, hires per quarter)\n- Hosting (as % of revenue)\n- Tools/SaaS (fixed + variable)\n- Contractors\n- Marketing (% of revenue)\n- G&A (finance, legal, admin)\n\n*Profitability:*\n- Gross profit (revenue - COGS)\n- Gross margin %\n- Operating income (gross profit - OpEx)\n- Burn rate (if unprofitable)\n- Cumulative cash (cash on hand + monthly burn/profit)\n\n**Columns:**\n- Month 1-24 (detailed monthly)\n- Quarters 25-36 (quarterly)\n\n**Example model:**\n```\nMonth 1:\n- MRR: £50,000\n- Growth assumption: 8% MoM\n- Monthly revenue (accrual): £50,000\n\nMonth 2:\n- MRR: £54,000 (£50k × 1.08)\n- Monthly revenue: £54,000\n\nMonth 12:\n- MRR: £110,700 (£50k × 1.08^11)\n- Monthly revenue: £110,700\n\nYear 2 revenue:\n- Assume growth slows to 5% MoM\n- Year 2 ending MRR: £180k\n\nYear 3 revenue:\n- Assume growth slows to 3% MoM\n- Year 3 ending MRR: £250k\n\nBreakeven:\n- Month 18: Operating income turns positive (costs ≤ revenue)\n```\n\nThis model shows:\n- Clear growth assumptions (8% slowing to 5%, then 3%)\n- Specific breakeven timing (month 18)\n- Revenue trajectory (£50k → £180k → £250k)\n- Path to profitability"
      }
    ],
    relatedSlugs: [
      "series-a-prep-uk-cfo-requirements",
      "financial-forecasting-scenario-planning-saas"
    ],
    faq: [
      {
        q: "How detailed should my model be?",
        a: "Months 1-24 as monthly (24 rows). Months 25-36 as quarterly (4 rows). More detail is harder to defend (assumptions get too specific). Less detail looks unprepared."
      },
      {
        q: "What growth rate should I assume?",
        a: "Depends on your stage and product. Pre-launch: start at 5-10% MoM. Early product-market fit: 10-30% MoM. Post-PMF: 20-50% MoM. Model realistically, then show downside scenario (-30% growth)."
      },
      {
        q: "Should I model churn?",
        a: "Yes. Assume 2-5% monthly churn (typical for SaaS). Model net MRR after churn. This shows you understand unit economics."
      }
    ],
    videoUrl: ""
  },
  {
    slug: "profitability-path-when-do-you-break-even",
    title: "Path to Profitability: When Will Your SaaS Actually Break Even?",
    description: "Most SaaS founders don't know when they'll be profitable. Learn to calculate it and plan accordingly.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 5,
    keywords: ["profitability", "breakeven", "financial planning", "unit economics"],
    keyTakeaways: [
      "Breakeven = when monthly revenue ≥ monthly expenses. Calculate it in your 3-year model.",
      "Path to profitability depends on growth rate and cost structure. Fast-growing SaaS might not break even for 2-3 years (intentional).",
      "Investors like seeing a path to profitability, even if you don't reach it immediately. It shows the model is sustainable."
    ],
    content: [
      {
        heading: "Calculating Breakeven",
        body: "**Formula:**\nBreakeven month = when Revenue ≥ Operating Expenses\n\n**Example:**\n- Month 1: Revenue £30k, OpEx £50k, Loss £20k\n- Month 6: Revenue £60k, OpEx £55k, Profit £5k\n- Breakeven: Month 5-6 (revenue and expenses roughly equal)\n\n**3-year breakeven scenarios:**\n\n**Scenario A: Fast growth, breakeven year 2**\n- Year 1: £600k revenue, £1.2M expenses, -£600k loss\n- Year 2: £2.4M revenue, £1.8M expenses, +£600k profit\n- Breakeven: Month 16 (year 2, month 4)\n\n**Scenario B: Slow growth, breakeven year 3**\n- Year 1: £300k revenue, £600k expenses, -£300k loss\n- Year 2: £600k revenue, £750k expenses, -£150k loss\n- Year 3: £1.2M revenue, £900k expenses, +£300k profit\n- Breakeven: Month 25 (year 3, month 1)\n\n**Scenario C: Already profitable (mature SaaS)**\n- Month 1: Revenue £500k, OpEx £400k, Profit £100k\n- Breakeven: Month 1 (already profitable)\n\nInvestors prefer scenarios with clear breakeven timeline. Ambiguity is red flag."
      }
    ],
    relatedSlugs: [
      "financial-modeling-templates-saas-founders",
      "saas-metrics-by-stage-what-to-track"
    ],
    faq: [
      {
        q: "Should I aim for profitability quickly, or growth first?",
        a: "Growth first. Build unit economics that can scale; optimize for profitability later. VCs fund growth, not profitability. But show a path to profitability."
      },
      {
        q: "What if I'll never be profitable with current cost structure?",
        a: "Change the model. Either reduce costs (OpEx) or increase revenue (higher pricing, more expansion). Never accept a business model that can't be profitable at scale."
      }
    ],
    videoUrl: ""
  }
];
