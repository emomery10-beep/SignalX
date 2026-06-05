import { AcademyArticle } from "./academy-types";

export const ACADEMY_CFO_SAAS_BATCH_13_ARTICLES_121_TO_130: AcademyArticle[] = [
  {
    slug: "monthly-recurring-revenue-mrr-tracking-with-askbiz-automation",
    title: "Monthly Recurring Revenue (MRR): Real-Time Tracking vs. Month-End Guesses",
    description: "MRR is your business's heartbeat. Learn to track it in real-time with AskBiz instead of waiting for month-end.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 4,
    keywords: ["MRR", "monthly recurring revenue", "ARR", "revenue tracking", "SaaS metrics", "AskBiz"],
    keyTakeaways: [
      "MRR = Monthly Recurring Revenue. For SaaS: current active customers × average subscription price. Track MRR daily, not monthly.",
      "Month-end MRR calculation is manual: export Stripe, sum active subscriptions, account for churn mid-month. Takes 2-3 hours and you miss real-time trends.",
      "AskBiz updates MRR in real-time: see daily MRR position, track growth rate momentum, spot churn events instantly. No spreadsheets."
    ],
    content: [
      {
        heading: "What Is MRR and Why Daily Tracking Matters",
        body: "MRR = Total monthly revenue from active subscriptions at a point in time.\n\nExample:\n- 500 customers on €100/month plan = €50k\n- 100 customers on €500/month plan = €50k\n- **Total MRR: €100k**\n\nNote: MRR is a snapshot (point-in-time), not a total (like \"revenue in the month\"). \n- MRR on Jan 1: €100k\n- Customer churns Jan 5: MRR on Jan 5: €99.8k\n- New customer signs Jan 10: MRR on Jan 10: €99.9k\n\nTraditionally, CFOs calculate MRR once per month (month-end):\n- Dec 31 MRR: €100k\n- Jan 31 MRR: €103k\n- Growth: 3% month-over-month\n\nBut this misses the story:\n- What happened Jan 5-31 when a major customer churned?\n- Did you acquire enough customers to offset?\n- Is your churn accelerating or improving?\n\nDaily MRR tracking answers these questions."
      },
      {
        heading: "The Month-End Manual Process (and Why It Fails)",
        body: "Traditional MRR calculation:\n\n1. **Export Stripe data**: Download full customer list with current subscription status and MRR\n2. **Filter active subscriptions**: Remove churned, on-hold, cancelled customers\n3. **Sum MRR**: Add up all active monthly subscription values\n4. **Account for mid-month changes**: If it's Jan 10, account for churn/new signups since Jan 1\n5. **Cross-check with accounting**: Verify MRR math matches revenue accrued in QuickBooks\n6. **Document assumptions**: Document which customers are included/excluded\n7. **Create report**: Format for team/investors\n\n**Time required**: 2-4 hours\n**Frequency**: Monthly (too infrequent)\n\n**Problems**:\n1. **Lag**: You know Dec 31 MRR on Jan 5. By then, you've missed 5 days of Jan churn.\n2. **Manual errors**: Forgetting to filter out trial customers, miscounting, formula errors\n3. **Incomplete data**: Trial subscriptions might show in Stripe but shouldn't count as MRR\n4. **Currency confusion**: If you have multi-currency customers, manual conversion is error-prone\n5. **Churn blindness**: You don't see churn events as they happen. You only know \"MRR grew 3%\" without knowing churn was 5% offset by 8% new customers\n\n**Investor impact**: When you pitch, you say \"Our MRR is €100k and growing 3% MoM.\" But investors ask: \"What's your churn rate? Your net new customer rate? Your revenue per new customer?\" Without real-time tracking, you can't answer these with confidence."
      },
      {
        heading: "How AskBiz Tracks MRR in Real-Time (Daily Updates, No Manual Work)",
        body: "**Setup** (one-time, 5 minutes):\n1. Connect Stripe account to AskBiz\n2. AskBiz reads: All subscriptions, status (active/churned), monthly amount, churn date\n3. Define: What counts as \"active MRR\"? (Usually: all active subscriptions, exclude trials)\n\n**Real-Time MRR Tracking**:\nNavigate to: Dashboard > CFO > MRR Card\n\n**AskBiz Display**:\n```\nCurrent MRR:                €103,500\nMoM Change:                 +€3,200 (+3.2%)\nDaily Trend (last 30 days): [Chart showing daily MRR]\n\nBreakdown by Tier:\n  Starter (€29/month):     €18,500 (18% of MRR)\n  Pro (€99/month):         €52,000 (50% of MRR)\n  Enterprise (€500/month): €33,000 (32% of MRR)\n\nYesterday:\n  MRR at start: €103,200\n  New customers: €2,100 (7 new signups)\n  Churned: -€1,500 (3 customers)\n  MRR at end: €103,800\n```\n\n**Updated automatically** every morning at 6 AM (or whenever Stripe data syncs).\n\n**Drill-down available**:\n- Click \"Churned\": See which customers left and why\n- Click \"New customers\": See which came from which channel\n- Click \"Pro tier\": See all Pro subscribers and their churn risk (usage, engagement signals)\n\n**Comparison view**:\n- Today's MRR vs. 30 days ago: Track momentum\n- This month vs. last month: Seasonality check\n- Compare to forecast: \"Forecasted €105k, actual €103.5k. On track.\"\n\n**Alerts**:\n- \"MRR down €5k overnight. 4 Enterprise customers churned. Investigate now.\"\n- \"Churn rate accelerating: 2.5% this week vs. 2% last week. Check support tickets.\"\n- \"New customer MRR up 15% vs. last month. New marketing campaign working?\""
      },
      {
        heading: "Using Real-Time MRR for Daily Decision-Making",
        body: "**Real-time MRR enables decisions spreadsheets can't**:\n\n**Example 1: Spot Churn Events Immediately**\n- Jan 5, 9 AM: You see MRR dropped €3k overnight\n- AskBiz shows: Enterprise customer churned (their implementation didn't work)\n- You reach out immediately: \"I see you cancelled. Let's find a solution before it's too late.\"\n- Manual approach: You'd discover this on Feb 1 (month-end) when calculating MRR. Too late to save.\n\n**Example 2: Evaluate Marketing Channels in Real-Time**\n- You launch a new paid ads campaign on Jan 10\n- By Jan 12, AskBiz shows: 5 new customers from paid ads, €450 MRR\n- 3 days of data is enough to calculate: CAC €600 (€2k spend ÷ 5 customers), initial LTV trend\n- You either scale the campaign (if LTV looks good) or kill it (if CAC is too high)\n- Manual approach: You'd wait until month-end to evaluate. Campaign might have wasted €30k by then.\n\n**Example 3: Forecast Revenue Impact of Product Changes**\n- You announce a price increase (€99 → €109 for Pro tier) effective Feb 1\n- AskBiz models: \"Current Pro MRR €52k. If 10% churn due to price, new MRR €46.8k + higher prices = €52.9k (net +1.7%)\"\n- You can adjust the price, communicate proactively, or prepare for churn\n- Manual approach: You'd make the change and see the impact in March. By then, damage is done.\n\n**Weekly MRR check-in** (2 minutes with AskBiz):\n1. Open dashboard, check MRR change\n2. Read alerts (any churn spikes?)\n3. Review cohort MRR (are older cohorts contracting?)\n4. Done. All insights without a single Excel calculation."
      }
    ],
    relatedSlugs: [
      "net-revenue-retention-nrr-expansion-revenue-tracking",
      "saas-cohort-analysis-retention-curves-with-askbiz",
      "understanding-4-cfo-metric-cards"
    ],
    faq: [
      {
        q: "Should I track MRR or ARR?",
        a: "Both. MRR is your monthly recurring revenue (snapshot). ARR is MRR × 12 (annual projection). MRR shows momentum, ARR shows scale. Track both; AskBiz shows both."
      },
      {
        q: "What if my subscriptions are billed annually?",
        a: "MRR = Annual subscription value ÷ 12. If a customer pays €1,200/year, they contribute €100 to MRR. AskBiz handles this automatically."
      },
      {
        q: "How does AskBiz handle trials?",
        a: "Trials are excluded from MRR by default (they're not revenue yet). Once converted to paid, they're included. You can customize this in AskBiz settings."
      }
    ],
    videoUrl: ""
  }
];
