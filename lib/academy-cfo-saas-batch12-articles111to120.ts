import { AcademyArticle } from "./academy-types";

export const ACADEMY_CFO_SAAS_BATCH_12_ARTICLES_111_TO_120: AcademyArticle[] = [
  {
    slug: "saas-cohort-analysis-retention-curves-with-askbiz",
    title: "SaaS Cohort Analysis: Understanding Retention Curves (and Why Spreadsheets Fail)",
    description: "Cohort analysis reveals which customer groups stay vs. churn. Learn to analyze retention curves and spot problems early.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 4,
    keywords: ["cohort analysis", "retention", "churn", "SaaS metrics", "customer retention", "AskBiz"],
    keyTakeaways: [
      "Cohort analysis groups customers by acquisition month and tracks their retention over time. This reveals product-market fit and retention trends.",
      "A healthy SaaS retains 90%+ of customers in month 1, 85%+ in month 3, 70%+ in month 12. Below these benchmarks signals problems.",
      "AskBiz automates cohort tracking: you see retention curves updated daily without manual Excel calculations. Spot retention problems weeks earlier than spreadsheets."
    ],
    content: [
      {
        heading: "What Is Cohort Analysis and Why It Matters",
        body: "Cohort analysis groups customers by when they signed up (acquisition cohort) and tracks their behavior over time.\n\n**Example cohort table**:\n```\nCohort      Month 1  Month 3  Month 6  Month 12\n2023-Q1     100%     92%      80%      68%\n2023-Q2     100%     89%      75%      60%\n2023-Q3     100%     95%      88%      —\n2023-Q4     100%     94%      —        —\n```\n\nThis shows:\n- Q1 cohort had 92% retention after 3 months, dropped to 68% by month 12\n- Q3 cohort already at 95% after 3 months (better retention than Q1)\n- Retention is improving over time (newer cohorts retain better)\n\n**Why this matters**:\n- Blended churn rate (e.g., \"3% monthly churn\") hides problem cohorts. Cohort analysis reveals which acquisition periods have retention issues.\n- Improving product onboarding affects all future cohorts. Cohort analysis shows the improvement month-by-month.\n- New marketing channels might attract lower-quality customers. Cohort analysis by channel shows CAC vs. LTV differences.\n\n**Without cohort analysis**: You see \"churn is 3% this month\" and don't know if it's consistent across all cohorts or if some cohorts are degrading while others improve."
      },
      {
        heading: "The Spreadsheet Problem: Manual Cohorts Take Hours",
        body: "Building a cohort table manually:\n\n1. Export customer list from billing system (Stripe, Chargebee)\n2. Export transaction/churn data\n3. Create pivot table in Excel grouping by signup month\n4. Calculate retention % for each month/cohort\n5. Compare across cohorts\n6. Create visualization\n\n**Time required**: 3–5 hours per month\n\n**Problems**:\n- Lag: By the time cohort analysis is done, it's outdated. Month 1 cohorts from last month already have month 2 data.\n- Errors: Manual calculations, pivot table mistakes, missing customers\n- No trends: Each month's analysis is static. Hard to see if retention is improving or degrading trend.\n- Channel data missing: Which marketing channel each customer came from isn't in your billing system. Manual tagging is required.\n\n**Result**: Most SaaS CFOs don't do cohort analysis because it's too tedious. They use blended churn rate instead, missing critical insights.\n\n**AskBiz advantage**: Connect your billing system once. AskBiz automatically builds cohort tables and updates daily. No manual work."
      },
      {
        heading: "How AskBiz Automates Cohort Analysis",
        body: "**Step 1: Connect Billing System**\n- Link Stripe, Chargebee, or manual customer list\n- AskBiz imports customer signup date, MRR, churn events\n\n**Step 2: Automatic Cohort Grouping**\n- AskBiz automatically groups customers by signup month (or week, depending on preference)\n- Tracks month-by-month retention through churn events\n\n**Step 3: Real-Time Cohort Dashboard**\nNavigate to: Metrics > Cohort Analysis\n- View cohort table updated daily\n- See retention curve for each cohort\n- Filter by: Cohort period, pricing tier, customer segment\n\n**Example AskBiz Cohort View**:\n```\nCohort      M1    M2    M3    M6    M12   Current LTV\n2024-Q1     100%  95%   92%   85%   —     €3,200\n2024-Q2     100%  97%   94%   —     —     €3,500\n2024-Q3     100%  93%   —     —     —     (pending)\n```\n\nEach row is clickable:\n- Click \"2024-Q1\": See individual customers in this cohort, their churn reasons, expansion revenue\n- Click \"M6\" retention: See which customers from Q1 are still active at month 6\n\n**Real-time alerts**:\n- \"Q2 cohort showing higher month-2 churn (3%) vs. Q1 (5% still active). Investigate onboarding changes.\"\n- \"Q3 cohort tracking better than historical average. Marketing channel change working.\"\n\n**No manual Excel required.**"
      },
      {
        heading: "Reading Cohort Curves: Healthy vs. Unhealthy Patterns",
        body: "**Healthy curve** (steep initial drop, then plateau):\n```\n100% → 95% → 92% → 90% → 89% → 89% (Month 1-6)\n```\nInterpretation: Lose 5-10% in month 1 (bad product-market fit or wrong segmentation). Then stabilize at 90% (good retention).\n\n**Unhealthy curve** (continuous decline):\n```\n100% → 95% → 85% → 70% → 50% (Month 1-12)\n```\nInterpretation: Product isn't sticky. Customers are leaving every month. LTV is low.\n\n**Improving curve** (earlier cohorts worse, newer cohorts better):\n```\n2023-Q1: 68% at month 12\n2023-Q4: 85% at month 9\n2024-Q1: 91% at month 6 (trending up)\n```\nInterpretation: Product improvements working. Newer cohorts are stickier.\n\n**Seasonal curve** (months 5-7 always have churn spike):\n```\n2023-Q1: 95% → 90% → 88% → 70% (spike) → 75% → 78%\n2023-Q2: 97% → 92% → 89% → 68% (spike) → 77% → 80%\n```\nInterpretation: Seasonal business. Customers churn in summer (vacation industry example). Plan for this.\n\n**AskBiz comparison view**:\n- Select two cohorts, overlay their curves\n- See instantly if newer cohort is retaining better\n- Measure impact of product/onboarding changes: \"Q2 onboarding improvement → Q3 cohort shows 5% better month-3 retention\""
      },
      {
        heading: "Cohort Analysis by Channel: Find Your Best Customers",
        body: "Different marketing channels attract different customer quality:\n\n**Organic search** (high intent)\n- Signup: 1,000 customers\n- Month 1 retention: 96%\n- Month 6 retention: 88%\n- CAC: €100\n- LTV: €4,000\n- **LTV:CAC: 40:1** (Excellent)\n\n**Paid ads** (medium intent)\n- Signup: 500 customers\n- Month 1 retention: 92%\n- Month 6 retention: 75%\n- CAC: €300\n- LTV: €2,500\n- **LTV:CAC: 8:1** (Good)\n\n**Referral** (warm)\n- Signup: 200 customers\n- Month 1 retention: 98%\n- Month 6 retention: 92%\n- CAC: €50 (referral bonus)\n- LTV: €4,200\n- **LTV:CAC: 84:1** (Exceptional)\n\n**Problem**: Manually tagging which channel each customer came from is tedious. Most CFOs skip this.\n\n**AskBiz solution**:\n- Connect UTM parameters from your marketing (AskBiz reads utm_source, utm_campaign from signup flow)\n- Automatically cohort by channel\n- Dashboard shows: \"Organic search cohorts have 40:1 LTV:CAC. Paid ads cohorts have 8:1. Double down on organic.\"\n- Alerts: \"Paid ads LTV:CAC dropped from 8:1 to 5:1. Ad quality degrading?\"\n\n**Result**: You can optimize marketing spend based on actual unit economics by channel, not guessing."
      }
    ],
    relatedSlugs: [
      "saas-unit-economics-cac-ltv-payback-period",
      "churn-management-real-time-customer-metrics",
      "understanding-4-cfo-metric-cards"
    ],
    faq: [
      {
        q: "Should I analyze cohorts by week or by month?",
        a: "Month is standard for most SaaS (easier to see trends). Use weeks only if you have very high signup velocity (100+ new customers/week). AskBiz lets you toggle between granularities."
      },
      {
        q: "What if my cohorts are too small to draw conclusions?",
        a: "If a cohort has <20 customers, retention % is noisy. AskBiz flags cohorts with insufficient sample size. Combine small cohorts or accept wider confidence intervals."
      },
      {
        q: "How do I improve retention for existing cohorts?",
        a: "You can't (cohorts are fixed). But you can improve future cohorts through product/onboarding changes. AskBiz shows the impact: compare new cohort retention to prior baseline."
      }
    ],
    videoUrl: ""
  },
  {
    slug: "net-revenue-retention-nrr-expansion-revenue-tracking",
    title: "Net Revenue Retention (NRR): The Most Important SaaS Metric (Automated in AskBiz)",
    description: "NRR measures if existing customers expand faster than they churn. It's the single best predictor of SaaS profitability.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Advanced",
    readTime: 4,
    keywords: ["NRR", "net revenue retention", "expansion revenue", "churn", "SaaS metrics", "AskBiz"],
    keyTakeaways: [
      "NRR = (Revenue from existing customers at month 12 + expansion) ÷ Revenue at month 0. NRR > 120% means customers expand faster than churn.",
      "NRR is the strongest predictor of IPO success for SaaS. Investors obsess over it. >130% NRR is exceptional.",
      "AskBiz calculates NRR automatically: no manual tracking, no spreadsheets. Updated monthly with breakdown by customer segment."
    ],
    content: [
      {
        heading: "Why NRR Matters More Than Growth Rate",
        body: "Two SaaS companies, both growing 30% YoY:\n\n**Company A (High NRR)**\n- Start of year: 100 customers at €100/month = €10k MRR\n- Churn: 2% (lose 2 customers/month on average)\n- New customers acquired: 30 per month (30% growth)\n- Expansion: Existing customers upgrade, €200/month additional\n- **End of year MRR: €15k**\n- NRR: 150% (existing €10k → €12k after churn + expansion, new add €3k)\n\n**Company B (Low NRR)**\n- Start of year: 100 customers at €100/month = €10k MRR\n- Churn: 5% (lose 5 customers/month)\n- New customers acquired: 40 per month (to offset churn + grow)\n- Expansion: Minimal (€50/month additional)\n- **End of year MRR: €13k**\n- NRR: 95% (existing €10k → €8k after churn + expansion)\n\n**Both grew 30%, but:**\n- Company A is profitable (can support team growth through expansion alone)\n- Company B is growth-dependent (must keep acquiring just to maintain, let alone grow)\n\n**Investor perspective**:\n- Company A at €15k MRR is worth more than Company B at €13k MRR\n- Company A can likely raise at better terms (lower dilution)\n- Company A can scale to profitability faster\n\n**This is why investors ask: \"What's your NRR?\" before asking \"What's your growth rate?\"\n\nNRR > 120% means your business has built-in growth momentum. Every year, existing customers expand to replace churn AND grow the base. This is the most valuable dynamic in SaaS."
      },
      {
        heading: "Calculating NRR: The Manual Nightmare",
        body: "Manual NRR calculation:\n\n1. Get list of customers at start of year (Jan 1)\n2. Track each customer's MRR throughout the year\n3. Calculate their end-of-year MRR (includes churn, expansion, downgrades)\n4. Sum end-of-year MRR from original cohort\n5. Divide by start-of-year MRR\n6. Breakdown expansion by reason (upsells, new features, price increases)\n\n**Time required**: 4–8 hours per month\n\n**Problems**:\n- Defining \"original customer\" is hard (what if they downgrade and churn partway through?)\n- Expansion tracking requires manual tagging (which upsell? which feature?)\n- Churned customers complicate the math (do you include them as €0 or exclude them?)\n- Downgrades are tricky (customer goes from €1k to €500/month, is that -€500 expansion or partial churn?)\n- Formula variance: Different companies calculate NRR differently, making benchmarking hard\n\n**Result**: Most SaaS companies don't track NRR because it's too complex. Or they calculate it wrong.\n\n**AskBiz advantage**: One click, automated NRR calculation. Accounts for all scenarios (churn, expansion, downgrades). Standardized methodology that matches investor expectations."
      },
      {
        heading: "How AskBiz Calculates NRR Automatically",
        body: "**Input**: Connect billing system (Stripe, Chargebee)\nAskBiz ingests: Customer signup date, monthly MRR, churn events, pricing changes\n\n**Process**:\n1. Take cohort of customers from exactly 12 months ago\n2. Track their MRR today (accounting for churn, expansion, downgrades)\n3. Calculate NRR = Current cohort MRR ÷ Original cohort MRR\n4. Break down expansion by type:\n   - Upsells (customer moved to higher tier)\n   - Expansion (feature upgrades within same tier)\n   - Price increases (annual increase)\n   - Net of downgrades and churn\n\n**AskBiz NRR Dashboard** (Metrics > NRR):\n```\nMetric                  Value\n————————————————————————————\nNRR (last 12 months)    127%\nGross Churn             -15%\nExpansion Revenue       +42%\nDowngrades              -8%\n\nBy Segment:\nStartup                 145%\nMid-Market              118%\nEnterprise              102%\n\nBy Expansion Type:\nUpsells                 €25k (+20%)\nFeature Additions       €8k (+6%)\nPrice Increases         €4k (+3%)\nDowngrades              -€3k (-2%)\n```\n\n**Real-time**: Updated monthly as new data comes in. No manual calculation.\n\n**Benchmark comparison**: AskBiz shows \"Your NRR: 127%. SaaS median: 110%. You're above average.\"\n\n**Alerts**:\n- \"NRR dropped to 115% (down from 127% last month). Churn spike in mid-market segment?\"\n- \"Expansion revenue down 8% vs. last month. New upsell feature not converting?\"\n- \"Startup segment NRR jumped to 160%. Investigate what changed in onboarding or product.\""
      },
      {
        heading: "Using NRR to Predict Revenue and Raise Capital",
        body: "NRR is the foundation of SaaS financial modeling.\n\n**Revenue projection with NRR**:\n- Current MRR: €100k\n- New customer growth: 15% per month\n- NRR: 120% (existing customers retain and expand)\n- **Projected MRR in 12 months: €100k × (existing cohort growing at 120%) + (new cohort additions)**\n\nExample:\n- Jan MRR: €100k\n- Jan new customers generate: €10k MRR (15% growth from new)\n- Feb MRR: €100k × 120% (existing cohort) + €10k (Jan new, retained) + €10.5k (Feb new, 15% growth)\n- **Feb MRR: €130.5k**\n- Continue this for 12 months → €165k+ MRR at year-end\n\n**Why investors care**:\n- NRR > 120% = automatic growth, even if you stop acquiring (in theory)\n- NRR < 100% = you're shrinking despite acquisitions (leaky bucket)\n- NRR trending up = product-market fit improving (product becomes stickier)\n\n**In pitch meetings**:\n- \"We're growing 30% YoY from new customers\"\n- \"Plus, our NRR is 127%, meaning existing customers are growing our MRR by 27% year-over-year\"\n- \"So our true growth rate is 30% + 27% = 57% effective growth, much of it from existing customers\"\n\n**AskBiz in fundraising**:\n- Export NRR dashboard to share with investors\n- Show NRR trend over last 12 months (proving improvement)\n- Breakdown by segment (investors want to see if some segments are \"money machines\")\n- Forecast NRR given your product roadmap (\"Launching feature X will drive expansion, we project NRR to 140%\")"
      }
    ],
    relatedSlugs: [
      "saas-unit-economics-cac-ltv-payback-period",
      "saas-cohort-analysis-retention-curves-with-askbiz",
      "understanding-4-cfo-metric-cards"
    ],
    faq: [
      {
        q: "What's a good NRR for Series A?",
        a: ">110% is healthy. >120% is excellent. <100% is a red flag (shrinking business). Series A investors expect >110%; Series B/C expect >130%."
      },
      {
        q: "Should I include new customers in NRR calculation?",
        a: "No. NRR is specifically the growth from existing customers. New customer growth is tracked separately as \"new customer revenue\" or included in overall growth rate."
      },
      {
        q: "What if my NRR is below 100%?",
        a: "Your existing customer base is shrinking despite expansion. Churn is outpacing expansion. Action: (1) Improve product retention, (2) Reduce churn reasons, (3) Increase expansion through upsells."
      }
    ],
    videoUrl: ""
  }
];
