import { AcademyArticle } from "./academy-types";

export const ACADEMY_CFO_SAAS_BATCH_19_REWRITTEN: AcademyArticle[] = [
  {
    slug: "customer-acquisition-funnel-lead-to-customer",
    title: "Customer Acquisition Funnel: From Lead to Customer",
    description: "Every customer starts as a lead. Learn to build, measure, and optimize your acquisition funnel.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["sales funnel", "conversion funnel", "acquisition funnel", "lead generation", "funnel optimization"],
    keyTakeaways: [
      "Typical SaaS funnel: 100 leads → 20 free trials → 5 qualified prospects → 2-3 closes (2-3% conversion). Each stage has drop-off. Optimize highest-drop stage first (biggest ROI).",
      "Funnel stages vary by product: Product-led (leads → signups → paid users) vs. Sales-led (leads → demos → proposals → closes). Different shapes, different metrics matter. Know your funnel type.",
      "Funnel conversion metrics: Lead to trial 20-30%, trial to paid 3-5%, paid to expansion 10-20% per month. If below benchmark for your stage, diagnose which stage is bottleneck."
    ],
    content: [
      {
        heading: "Typical SaaS Acquisition Funnel",
        body: "**Product-Led Funnel (Freemium/Free Trial Model)**\n\nTop of funnel: 1,000 monthly website visitors\n↓\nStage 1: Awareness → Trial\n- Visitors who signup for trial: 200 (20% conversion)\n- Metric: Trial signup rate\n- Benchmark: 10-30%\n\nStage 2: Trial → Activated\n- Users who hit aha moment: 100 (50% of trial signups)\n- Metric: Activation rate\n- Benchmark: 40-60%\n\nStage 3: Activated → Paid\n- Users who convert from trial to paid: 5 (5% of activated)\n- Metric: Trial-to-paid conversion\n- Benchmark: 3-8%\n\nStage 4: Paid → Expansion\n- Paid customers who expand tier or add seats: 1 (20% of paid)\n- Metric: Expansion rate\n- Benchmark: 10-30%\n\nFinal: 1,000 visitors → 5 paying customers (0.5% visitor-to-customer)\n\n**Sales-Led Funnel (B2B, Enterprise)**\n\nTop of funnel: 100 monthly qualified leads (from marketing)\n↓\nStage 1: Lead → Meeting\n- Leads that agree to demo: 30 (30% conversion)\n- Metric: Demo booking rate\n- Benchmark: 20-40%\n\nStage 2: Meeting → Proposal\n- Demos that result in proposal: 15 (50% conversion)\n- Metric: Proposal rate\n- Benchmark: 40-60%\n\nStage 3: Proposal → Closed\n- Proposals that close: 5 (33% conversion)\n- Metric: Close rate\n- Benchmark: 20-40%\n\nStage 4: Closed → Expansion\n- Customers who expand: 1 (20%)\n- Metric: Expansion rate\n- Benchmark: 20-30%\n\nFinal: 100 leads → 5 customers (5% lead-to-customer)\n\n**Identifying Funnel Bottlenecks**\n\nExample: Not enough paid customers\n\nDiagnose which stage is broken:\n\nOption A: Trial signup rate is low (10% vs. 20% benchmark)\n- Problem: Marketing not targeting right audience or landing page sucks\n- Fix: Improve ad targeting, landing page, or marketing message\n\nOption B: Activation rate is low (20% vs. 50% benchmark)\n- Problem: Onboarding is broken (users don't get to aha)\n- Fix: Improve onboarding, clarify aha moment, guide to first use\n\nOption C: Trial-to-paid conversion is low (1% vs. 5% benchmark)\n- Problem: Trial doesn't demonstrate value or pricing is wrong\n- Fix: Extend trial, improve product features, lower entry price\n\nOption D: All stages are low\n- Problem: Product-market fit issue (broader problem)\n- Fix: Back to product development\n\nApproach: Track each stage separately, identify weakest link, fix."
      }
    ],
    relatedSlugs: [
      "customer-acquisition-cost-by-channel",
      "product-market-fit-metrics-validation",
      "sales-pipeline-math-velocity-forecasting"
    ],
    faq: [
      {
        q: "What's a healthy funnel conversion rate?",
        a: "Depends on stage. Product-led: 0.5-2% visitor-to-customer. Sales-led: 3-10% lead-to-customer. If below, diagnose which stage is bottleneck."
      },
      {
        q: "Should I focus on top or bottom of funnel?",
        a: "Fix bottom first (convert trial to paid). Top (awareness) is easy (throw money). Bottom (conversion) is where real ROI is. Only do top when bottom is optimized."
      }
    ],
    videoUrl: ""
  },
  {
    slug: "expansion-arr-tracking-maximizing",
    title: "Expansion ARR: Tracking and Maximizing Growth from Existing Customers",
    description: "Expansion revenue is cheaper than acquisition. Learn to measure and grow it.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 6,
    keywords: ["expansion revenue", "expansion ARR", "upsell", "cross-sell", "account expansion"],
    keyTakeaways: [
      "Expansion ARR = New ARR from existing customers (upgrades + additional seats + new use cases). Should be 20-40% of total new ARR by Series B. If <15%, expansion motion isn't working.",
      "Three expansion paths: (1) Seat expansion (more users, £30/user/month), (2) Tier upgrades (Starter £100/month → Pro £300/month), (3) Use case expansion (sales team → marketing team). All three compound.",
      "Expansion CAC is 5-10x cheaper than new customer CAC. Cost to expand: CS touchpoint (~£100). Expansion revenue: £2-5k. ROI is exceptional. Make expansion a dedicated motion (separate from sales)."
    ],
    content: [
      {
        heading: "Expansion Revenue Tracking and Growth Strategies",
        body: "**Expansion ARR Calculation**\n\nNew ARR = New customer ARR + Expansion ARR + Contraction ARR\n\nExample month:\n- New customers: 10 × £10k = £100k new ARR\n- Expansions: 15 customers × £2k avg = £30k expansion ARR\n- Contractions: 5 customers × -£3k avg = -£15k contraction\n- Net new ARR: £100k + £30k - £15k = £115k\n\nExpansion rate = Expansion ARR / Starting ARR\n- Example: £30k / £500k = 6% monthly = 72% annually\n\nBenchmark:\n- Seed: 5-10% monthly\n- Series A: 5-15% monthly\n- Series B: 10-20% monthly\n- Series C+: 15-30% monthly\n\n**Expansion Motion Framework**\n\nThree parts: Identify → Engage → Convert\n\n1. Identify expansion opportunities\n   - Which customers are using 50%+ of features?\n   - Which departments use the product?\n   - What's the next natural expansion?\n   - Who's growing (hiring, revenue expanding)?\n\n2. Engage CS team\n   - QBR (Quarterly business review) with account manager\n   - Demo expansion opportunities\n   - Show ROI (how expansion pays for itself)\n\n3. Convert\n   - Present upgrade option\n   - Easy purchasing (no friction)\n   - Incentive (10% off annual renewal if upgrade now)\n\n**Three Expansion Paths**\n\nPath 1: Seat Expansion\n- Product: Per-user pricing (£30/user/month)\n- Initial: 10 users\n- Expansion: Add 5 new users (new department, team growth)\n- ARR increase: £50 × 12 = £600/year\n- Trigger: Customer hits user limit on tier\n\nPath 2: Tier Upgrade\n- Product: Feature-based tiers (Starter £100, Pro £300)\n- Initial: Customer on Starter\n- Expansion: Upgrade to Pro (need more features)\n- ARR increase: £200 × 12 = £2,400/year\n- Trigger: Customer uses 80%+ of Starter features\n\nPath 3: Use Case Expansion\n- Product: Works for multiple use cases (teams, departments)\n- Initial: Sales team using product\n- Expansion: Marketing team adopts (same product, different use case)\n- ARR increase: £5k × 12 = £60k/year (another team, similar spend)\n- Trigger: Success in first team, ask team lead if other teams need it\n\n**Expansion vs. New Customer CAC**\n\nNew customer acquisition:\n- CAC: £3-5k (sales effort, marketing spend)\n- Payback: 12-18 months\n- Risk: Customer may churn\n\nExpansion:\n- Cost: £100-500 (CS touchpoint)\n- Revenue: £2-10k\n- Payback: 1-3 months\n- Risk: Low (customer already using product)\n\nROI difference: 5-10x better for expansion\n\nImplication: Every pound spent on expansion has 5-10x return vs. acquisition.\n\n**Expansion Revenue Levers**\n\nLever 1: Increase % of customers expanding\n- Current: 20% of customers expand per quarter\n- Target: 30% (50% improvement)\n- Method: Better product, regular engagement, education\n- Impact: +50% expansion revenue\n\nLever 2: Increase expansion size (ARR per expansion)\n- Current: £2k average expansion\n- Target: £3k (seat price increase, bigger upgrades)\n- Method: Premium tier, larger seat counts, bundle features\n- Impact: +50% expansion revenue\n\nLever 3: Increase expansion frequency\n- Current: Once per year\n- Target: Twice per year (seasonal expansions)\n- Method: Regular QBRs, proactive offers, seasonal needs\n- Impact: 2x expansion revenue\n\nAll three combined: 3-4x expansion revenue growth without new CAC spending."
      }
    ],
    relatedSlugs: [
      "net-revenue-retention-nrr-100-percent",
      "land-and-expand-strategy",
      "customer-success-economics-roi"
    ],
    faq: [
      {
        q: "What's a healthy expansion rate?",
        a: "Monthly: Seed 5-10%, Series A 5-15%, Series B 10-20%. If <5%, expansion motion needs work."
      },
      {
        q: "How do I organize expansion?",
        a: "Dedicated expansion team (sales background) or CS-driven. Expansion AE works with CS to identify, engage, close. Not same as land AE."
      }
    ],
    videoUrl: ""
  },
  {
    slug: "financial-modeling-saas-3-year",
    title: "Financial Modeling for SaaS: 3-Year Projections",
    description: "Build credible 3-year financial models that investors believe. Learn the framework and key assumptions.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Advanced",
    readTime: 8,
    keywords: ["financial model", "projections", "forecasting", "3-year plan", "revenue forecast"],
    keyTakeaways: [
      "3-year model structure: (1) Revenue assumptions (growth rate, customer count, ACV), (2) COGS (direct delivery cost), (3) OpEx (S&M, R&D, G&A), (4) Bottom line (operating income, margin). Each line should tie to operational metric.",
      "Key assumption credibility: If Year 1 50% growth, Year 2 should be 35-45% (not 50%+). Assume improvement flattens (realistic). NRR improvement Year 1 2-3 points, then stabilizes. Conservative assumptions are more believable.",
      "Build two versions: (1) Base case (most likely), (2) Upside/Downside. Investors want to see you've thought about outcomes. Show path to profitability (when positive operating income?) to demonstrate unit economics improve."
    ],
    content: [
      {
        heading: "Building Credible 3-Year Financial Model",
        body: "**Model Structure and Key Components**\n\nYear 1 through Year 3\n\nRevenue section:\n- Starting ARR (Year 1, Month 1)\n- Monthly growth rate (compound each month)\n- New customer additions\n- Expansion revenue\n- Churn impact\n- Ending ARR\n\nCOGS section:\n- Gross margin assumption (% of revenue)\n- Calculate COGS, gross profit\n- Gross margin should improve 1-2 points per year (scale)\n\nOperating Expense section:\n- S&M: % of revenue\n- R&D: % of revenue\n- G&A: % of revenue\n- Should decrease as % of revenue (leverage)\n\nBottom line:\n- Operating income (GP - OpEx)\n- Operating margin %\n- Should approach 0% by Year 3 (path to profitability)\n\n**Example 3-Year Model**\n\nYear 1 (£1M ARR starting, 50% growth target):\n\nRevenue:\n- Starting ARR: £1M\n- Monthly growth rate: 3% (compound)\n- Month 1-12 revenue: £1M to £1.4M\n- Year 1 ending ARR: £1.4M\n\nCOGS:\n- COGS: 25% of revenue\n- Gross profit: 75%\n\nOpEx:\n- S&M: 45% of revenue = £630k (if avg revenue £1.2M)\n- R&D: 30% of revenue = £420k\n- G&A: 15% of revenue = £210k\n- Total OpEx: £1.26M\n\nOperating income:\n- GP: £900k (75% × 1.2M)\n- OpEx: £1.26M\n- Operating income: -£360k\n- Margin: -30%\n\nYear 2 (£1.4M ARR starting, 40% growth):\n\nRevenue:\n- Starting ARR: £1.4M\n- Growth rate: 2.8% monthly (compound)\n- Year 2 ending ARR: £1.96M\n\nCOGS:\n- COGS: 24% of revenue (1 point improvement)\n- Gross margin: 76%\n\nOpEx (leverage kicks in):\n- S&M: 40% of revenue = £780k (4k ops, 2 reps)\n- R&D: 25% of revenue = £485k\n- G&A: 12% of revenue = £220k\n- Total: £1.485M\n\nOperating income:\n- GP: £1.26M (76% × 1.68M avg)\n- OpEx: £1.485M\n- Operating income: -£225k\n- Margin: -13% (improving)\n\nYear 3 (£1.96M ARR starting, 30% growth):\n\nRevenue:\n- Starting ARR: £1.96M\n- Growth rate: 2.2% monthly (more conservative)\n- Year 3 ending ARR: £2.55M\n\nCOGS:\n- COGS: 22% of revenue (2 more points)\n- Gross margin: 78%\n\nOpEx (major leverage):\n- S&M: 35% of revenue = £860k\n- R&D: 20% of revenue = £490k\n- G&A: 10% of revenue = £230k\n- Total: £1.58M\n\nOperating income:\n- GP: £1.85M (78% × 2.25M avg)\n- OpEx: £1.58M\n- Operating income: +£270k\n- Margin: +12% (profitable!)\n\n**Key Assumptions and Credibility**\n\nGrowth rate assumption:\n- Year 1: Assume 50% (from Series A raise, momentum)\n- Year 2: Assume 40% (market saturation, slower growth)\n- Year 3: Assume 30% (mature, slowing)\n- Realistic: Decreases over time (growth slows as base gets bigger)\n\nUnit economics assumption:\n- Year 1: CAC £5k, LTV £10k, payback 18 months\n- Year 2: CAC £4k, LTV £15k, payback 12 months (improving)\n- Year 3: CAC £3.5k, LTV £20k, payback 10 months\n- Realistic: Improve as product matures, CAC becomes efficient\n\nGross margin assumption:\n- Year 1: 75% (learning phase)\n- Year 2: 76% (slight improvement)\n- Year 3: 78% (infrastructure optimization)\n- Realistic: 1-2 point improvement per year (not dramatic)\n\nOpEx assumption:\n- S&M: 45% → 40% → 35% (leveraging organic, brand)\n- R&D: 30% → 25% → 20% (leverage, fewer engineers per revenue)\n- G&A: 15% → 12% → 10% (fixed costs spread)\n- Realistic: Decreases because growth but not proportional hiring\n\n**Model Sensitivity Analysis**\n\nTest: What if growth slows 10%?\n\nBase case: Year 3 ARR £2.55M, margin +12%\nDownside (10% lower growth): Year 3 ARR £2.3M, margin +8%\n\nConclusion: Still path to profitability, just slower.\n\nTest: What if CAC doesn't improve?\n\nBase case: Year 3 CAC £3.5k\nDownside (CAC stays £5k): Year 3 profitability delayed (Year 4 instead)\n\nConclusion: Unit economics must improve, or profitability delayed.\n\n**Model Usage and Investor Communication**\n\nBase case model: Most likely scenario\n- Use for operational planning\n- Share with investors (your plan)\n\nUpside case: Aggressive growth\n- Same model, but 60% growth Year 1, 50% Year 2\n- Outcomes: Earlier profitability, higher ARR\n- Probability: 20-30% (optimistic but possible)\n\nDownside case: Conservative growth\n- 30% growth Year 1, 20% Year 2\n- Outcomes: Breakeven pushed to Year 4\n- Probability: 20-30% (could happen)\n\nPresent all three to investors: \"Most likely £2.55M, upside £4M, downside £1.5M by Year 3.\""
      }
    ],
    relatedSlugs: [
      "financial-planning-budgeting-saas-team",
      "burn-rate-playbooks-scenario-planning",
      "series-b-metrics-financing-readiness"
    ],
    faq: [
      {
        q: "What growth rate should I model?",
        a: "Year 1: Match plan or Series A raise thesis. Year 2: 70-80% of Year 1. Year 3: 70-80% of Year 2. Conservative (decreasing growth) is more credible than flat or increasing."
      },
      {
        q: "Should my model show profitability?",
        a: "Yes. All models should show path to profitability by Year 3-4 (or investors will question sustainability). If not profitable by Year 4, business model is wrong."
      }
    ],
    videoUrl: ""
  },
  {
    slug: "seasonality-in-saas-planning",
    title: "Seasonality in SaaS: Planning for Revenue Swings",
    description: "Many SaaS products have seasonal revenue patterns. Learn to predict and manage them.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 6,
    keywords: ["seasonality", "seasonal revenue", "revenue forecasting", "revenue patterns", "budget planning"],
    keyTakeaways: [
      "Common SaaS seasonality: Q4 spike (year-end budgets), Q1 slight dip (budget exhaustion), Q2-Q3 flat. HR/fintech products: Strong Q1/Q4, weak Q3. Avoid assuming smooth growth (quarterly variance 15-30% normal).",
      "Causes: Customer budget cycles (fiscal year-end), holiday hiring freezes, seasonal business needs (tax software Q3-Q4). Understanding cause helps plan. Example: If customers' fiscal year is June, your seasonality is opposite (weak Q4, strong Q2).",
      "Plan for 20-30% quarterly variance: Don't miss quarterly targets if Q3 is naturally 15% lower (understand trend line, not just current month). Use rolling 12-week forecasts to account for seasonality."
    ],
    content: [
      {
        heading: "Identifying and Managing Seasonality Patterns",
        body: "**Common SaaS Seasonality Patterns**\n\nPattern 1: Calendar Year Budget Cycle (Most common)\n- Q1: Strong (New Year, new budgets)\n- Q2: Moderate (budget exhaustion, slowing)\n- Q3: Weak (lowest budget availability)\n- Q4: Strong (year-end urgency, use it or lose it budgets)\n\nVariance: Q3 might be 20% below average, Q1/Q4 20% above.\n\nExample:\n- Average quarterly revenue: £500k\n- Q1: £600k (+20%)\n- Q2: £475k (-5%)\n- Q3: £400k (-20%)\n- Q4: £625k (+25%)\n- Total: £2.1M (same as 4 × £500k)\n\nPattern 2: Fiscal Year Budget Cycle (Enterprise focus)\n- Varies by industry\n- Finance/accounting: Fiscal year 1/31 (December-January peak)\n- Retail: Fiscal year 2/29 (January-February peak)\n- Technology: Fiscal year 1/31 or 3/31 (varies)\n\nIf targeting companies with June fiscal year:\n- Q3 (July-September) is their Q1 → Your spike\n- Q4 (October-December) is their Q2 → Your dip\n- Opposite of calendar seasonality\n\nPattern 3: Holiday Hiring Freeze\n- Thanksgiving-December: No hiring (budget freeze)\n- January: Hiring resumes\n- Impact: HR/recruiting products flat Nov-Dec, spike January\n\n**Forecasting with Seasonality**\n\nSimple approach: Apply seasonal factor\n\nExample:\n- Historical data shows Q3 is 80% of average (20% seasonal dip)\n- Average quarterly revenue £500k\n- Q3 forecast: £500k × 80% = £400k\n\nMulti-year view:\n- Year 1: £2M (4 × £500k, ignore seasonality)\n- Year 2: £2.6M (growth 30%)\n  - Q1: £650k (£500k + 30% growth × 80% seasonal)\n  - Q2: £612k (£500k + 30% growth × 95% seasonal)\n  - Q3: £520k (£500k + 30% growth × 80% seasonal)\n  - Q4: £815k (£500k + 30% growth × 105% seasonal)\n  - Total: £2.6M\n\n**Managing Seasonality Financially**\n\nCash flow impact:\n- Q1: Strong revenue + cash inflow\n- Q2-Q3: Weak cash, increased burn risk\n- Q4: Strong cash recovery\n\nExample: £500k average quarterly\n- Q1: +£600k cash, -£400k burn = +£200k net\n- Q2: +£475k cash, -£400k burn = +£75k net\n- Q3: +£400k cash, -£400k burn = £0 (break even)\n- Q4: +£625k cash, -£400k burn = +£225k net\n- Year net: +£500k (buffered, but lumpy)\n\nAction: Maintain extra cash buffer (£300-500k) to cover Q3 dip without fundraising.\n\n**Communicating Seasonality to Investors**\n\nWrong: \"Q3 revenue was £400k, miss!\"\n- Looks like failure (investor confidence drops)\n\nRight: \"Q3 revenue was £400k, in line with 80% seasonal factor (expected). Year-to-date £2M, on track for £2.4M annual goal.\"\n- Shows understanding of seasonality\n- Shows Q3 is planned, not a surprise\n\nInclusion in forecasts: Show seasonal variance explicitly\n- \"Q1 target: £600k (includes +20% seasonal)\"\n- \"Q3 target: £400k (includes -20% seasonal)\"\n- Annual target: £2.4M\n\nAvoid flat quarterly targets (unrealistic if seasonal)."
      }
    ],
    relatedSlugs: [
      "financial-planning-budgeting-saas-team",
      "financial-modeling-saas-3-year",
      "revenue-forecasting-seasonality-trends"
    ],
    faq: [
      {
        q: "How do I forecast with seasonality?",
        a: "Historical data: Look at last 8-12 quarters, identify seasonal pattern (as % of quarterly average). Apply that factor to projected quarter. Example: Q3 is always 80% of average, so apply 80% to Q3 forecast."
      },
      {
        q: "Is strong Q4 always seasonal?",
        a: "Often yes (year-end budgets), but sometimes growth is just accelerating. Compare to last year Q4 (same season, different growth). Growth + seasonality combined explain the spike."
      }
    ],
    videoUrl: ""
  },
  {
    slug: "customer-data-strategy-analytics",
    title: "Customer Data Strategy: Building Your Analytics Foundation",
    description: "Data drives decisions. Learn to instrument your product for tracking and analysis.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Advanced",
    readTime: 7,
    keywords: ["analytics", "product metrics", "data tracking", "event tracking", "data infrastructure"],
    keyTakeaways: [
      "Three analytics levels: (1) Product analytics (feature usage, user behavior), (2) Business analytics (revenue, churn, CAC), (3) Operational analytics (performance, efficiency). Founder focuses on business analytics, product team on product analytics.",
      "Must-track events: Signup, login, feature use, error, upgrade, churn. Each event should have customer ID, timestamp, value. Without good event tracking, you can't analyze retention, feature adoption, or CAC by segment.",
      "Analytics tools: Segment (event routing), Mixpanel/Amplitude (product analytics), or Salesforce CDP. Don't build custom (expensive). Pick one tool per layer (product, business) and instrument from day 1 (retrofitting is painful)."
    ],
    content: [
      {
        heading: "Building an Analytics Stack and Instrumenting Core Events",
        body: "**Three Layers of Analytics**\n\nLayer 1: Product Analytics\nWhat: How users interact with product\nMetrics: Feature usage, DAU, activation rate, feature adoption\nOwner: Product team\nTools: Mixpanel, Amplitude, PostHog\nUsage: Decide what to build\n\nLayer 2: Business Analytics\nWhat: Revenue, growth, unit economics\nMetrics: MRR, churn, CAC, LTV, NRR\nOwner: Finance/CEO\nTools: Tableau, Looker, custom dashboards\nUsage: Decide capital allocation, pricing\n\nLayer 3: Operational Analytics\nWhat: Team performance, efficiency\nMetrics: Sales rep close rate, CS efficiency, engineering velocity\nOwner: Department heads\nTools: Salesforce for sales, Jira for engineering, Zendesk for CS\nUsage: Manage team performance\n\n**Core Events to Track**\n\nRequired events (track from day 1):\n\n1. User signup\n   - When: User creates account\n   - Data: User ID, email, source (organic, paid, referral), plan_selected\n   - Use: Acquisition source, activation funnel\n\n2. Aha moment trigger\n   - When: User completes core action (creates project, builds dashboard)\n   - Data: User ID, feature used, time to aha (in days)\n   - Use: Identify retained vs. churned users\n\n3. Feature usage\n   - When: User uses any feature\n   - Data: User ID, feature name, frequency (daily, weekly)\n   - Use: Feature adoption, engagement depth\n\n4. Upgrade event\n   - When: User upgrades tier or adds seats\n   - Data: User ID, from_plan, to_plan, revenue_change\n   - Use: Expansion tracking, willingness to pay\n\n5. Churn event\n   - When: Subscription ends or cancels\n   - Data: User ID, reason (if available), LTV, retention (days)\n   - Use: Churn analysis, cohort retention curves\n\n6. Support event\n   - When: User creates support ticket\n   - Data: User ID, issue, resolution time, sentiment\n   - Use: Health scoring, at-risk customer identification\n\n**Analytics Stack Architecture**\n\nOption 1: Event platform (Recommended for most SaaS)\n- Segment (event router) or Mixpanel (event store)\n- Product tracks events via SDK\n- Events routed to: warehouse + analytics tool + CRM\n- Cost: £100-500/month\n- Benefit: Centralized, flexible routing\n\nOption 2: Custom events (NOT recommended)\n- Build tracking in product\n- Store in database\n- Query for analysis\n- Cost: Engineer time (£20-50k setup)\n- Benefit: Full control\n- Risk: Missing events, data quality issues\n\nOption 3: CRM-only (Limited analytics)\n- Salesforce/HubSpot tracks deal events\n- Works for sales metrics\n- Missing: Product usage, feature adoption\n- Limited for product-driven decisions\n\n**Implementing Event Tracking**\n\nStep 1: Define events\n- List all critical actions in product\n- Example: Signup, create project, invite team, generate report, upgrade, cancel\n- Prioritize: Which 10 events matter most?\n\nStep 2: Instrument in product\n- Add event tracking SDK (Segment, Mixpanel SDK)\n- Fire event on each action\n- Include user ID, event name, properties\n\nStep 3: Validate data quality\n- Check: Are events firing? Count looks right?\n- Sample: Export 100 events, audit manually\n- Fix bugs before going live\n\nStep 4: Analyze\n- Build funnel: Signup → Aha → Upgrade\n- Measure retention by cohort\n- Track features used by churned vs. retained\n\n**Common Tracking Mistakes**\n\n❌ Missing user ID\n- Can't track user journey (don't know who's doing what)\n- Fix: Ensure every event has user ID\n\n❌ Loose event naming\n- \"feature_used\" (ambiguous, which feature?)\n- Better: \"dashboard_created\", \"report_generated\"\n\n❌ Too many events\n- Track everything = data overload\n- Focus: 15-20 core events, ignore the rest\n\n❌ No event timestamp\n- Can't determine when action happened\n- Fix: All events include server timestamp\n\n❌ Retroactively implementing\n- Product live 6 months, then add tracking\n- Can't analyze historical retention\n- Fix: Instrument at launch, not later"
      }
    ],
    relatedSlugs: [
      "saas-metrics-dashboard-design",
      "customer-retention-churn-economics",
      "product-market-fit-metrics-validation"
    ],
    faq: [
      {
        q: "What analytics tool should I use?",
        a: "Segment (event router) + Mixpanel (product analytics) is standard. Alternative: Amplitude (all-in-one). Custom is expensive, avoid unless >£1M revenue and complex needs."
      },
      {
        q: "What events should I track?",
        a: "Core 10: Signup, aha, feature_use, upgrade, churn, support, payment, error, login, logout. Don't overdo it; pick events you'll analyze."
      }
    ],
    videoUrl: ""
  },
  {
    slug: "competitive-pricing-analysis-positioning",
    title: "Competitive Pricing Analysis: Market Positioning",
    description: "Know your competitors' prices. Learn to position your pricing competitively without race-to-bottom.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 6,
    keywords: ["competitive analysis", "pricing", "market positioning", "pricing strategy", "competitor pricing"],
    keyTakeaways: [
      "Don't price based on competitors. Price based on value you deliver. Competitors have different unit economics (might be unprofitable). Research competitor pricing for context, but let willingness-to-pay and unit economics drive your price.",
      "Pricing ladder: Know competitor's entry, mid, and premium pricing. If competitor is £50/£200/£500, you have options: Undercut at £40/£150/£400, match at £50/£200/£500, or premium at £60/£250/£600. Choice depends on positioning (cheaper or better).",
      "Red flag: If all competitors have 3 tiers at similar price, and you have 5 tiers, reconsider. Market has established price expectations. Deviating too far (10x cheaper or 10x more expensive) signals either amazing value or overpriced."
    ],
    content: [
      {
        heading: "Competitive Pricing Research and Positioning",
        body: "**Competitive Landscape Analysis**\n\nStep 1: Identify direct competitors\n- 3-5 companies solving same problem\n- At similar market maturity (don't compare to Google)\n- Example for project management: Asana, Monday.com, Notion, Jira, ClickUp\n\nStep 2: Document pricing\n\nExample landscape:\n\nAsana:\n- Basic: Free\n- Pro: £10/user/month\n- Business: £25/user/month\n- Enterprise: Custom\n\nMonday.com:\n- Basic: Free\n- Pro: £9/seat/month\n- Business: £16/seat/month\n- Enterprise: Custom\n\nNotion:\n- Plus: £10/user/month\n- Business: £25/user/month\n- Enterprise: Custom\n\nObservation: All have entry price £9-10, mid £16-25, premium custom.\n\n**Competitive Positioning Strategies**\n\nStrategy 1: Premium Positioning (Higher than competition)\n- Your price: £15/user/month (vs. competitor £10)\n- Requires: Better features, better support, or brand premium\n- Example: Slack vs. Slack competitors (charged more due to brand)\n- Risk: Harder to land (price objections)\n- Upside: Better margins, fewer price-sensitive customers\n\nStrategy 2: Competitive Pricing (Match competition)\n- Your price: £10/user/month (match Asana/Monday)\n- Requires: Feature parity or differentiation on non-price dimensions\n- Example: New entrant at price parity (no price excuse, must differentiate on product)\n- Risk: Commodity play (hard to win on price if matched)\n- Upside: Easy to compare, no pricing objection\n\nStrategy 3: Value-Based Pricing (Charge based on customer ROI)\n- Your price: Varies by customer (£5-50/user)\n- Requires: Demonstrated ROI (time savings, revenue increase)\n- Example: If your product saves customer £100/month, charge £30/month (3x ROI)\n- Risk: Complex to communicate, requires sales conversation\n- Upside: Align pricing with value (customers feel like good deal)\n\n**Pricing Decision Framework**\n\nQuestion 1: Are you cheaper, same price, or premium?\n- Better product or brand? → Premium\n- Commodity product? → Competitive\n- New entrant? → Competitive or slightly cheaper (to gain traction)\n\nQuestion 2: What's your unit economics goal?\n- Need high gross margin (80%+)? → Premium\n- Accepting 60% margin? → Competitive\n- Aggressive on volume (50% margin)? → Undercut\n\nQuestion 3: What's customer's willingness to pay?\n- Enterprise: £50-500/month (high willingness)\n- Mid-market: £10-50/month\n- SMB: £5-20/month (price-sensitive)\n- Price at customer's willingness, not competitor\n\n**Pricing Ladder Optimization**\n\nBad: Too many tiers\n- Free, Starter (£9), Pro (£20), Business (£45), Premium (£99), Enterprise (custom)\n- Decision paralysis (which do I pick?)\n- Conversion: 30% (low, hard to choose)\n\nGood: 3-4 tiers\n- Free, Pro (£10), Business (£30), Enterprise (custom)\n- Clear progression\n- Conversion: 50%+ (easier choice)\n\nBetter: Price ladder matched to customer value\n- SMB use case: Free, Pro £10\n- Mid-market: Pro £10, Business £50\n- Enterprise: Business £50+, Custom\n- Customers move through ladder as needs grow\n\n**Competitive Responses**\n\nScenario: Competitor drops price 30%\n\nWrong response: Match price immediately\n- Sacrifices margin\n- Starts price war\n- Race to bottom\n\nRight response: Understand why\n- Did they change positioning?\n- Do they have lower costs?\n- Are they desperate (running out of cash)?\n- If temporary promo, ignore\n- If permanent, evaluate: Match, reposition, or stay premium\n\nUsually: Don't match. Reposition (emphasize value, feature differences) or stay premium (some customers value quality over price)."
      }
    ],
    relatedSlugs: [
      "saas-pricing-strategy-value-based-vs-cost-based",
      "pricing-psychology-anchoring-willingness",
      "pricing-tiering-strategy-monetization"
    ],
    faq: [
      {
        q: "Should I price like my competitors?",
        a: "No. Use competitor prices for context, not anchoring. Price based on your value, unit economics, and willingness-to-pay. Match if commodity, undercut if better and cheaper, premium if better."
      },
      {
        q: "What if a competitor prices way lower?",
        a: "Don't panic. Cheap competitor ≠ winning competitor. If they're unprofitable (burning cash), ignore. If profitable, understand their advantage (cost structure, positioning). Reposition (emphasize value), don't race to bottom."
      }
    ],
    videoUrl: ""
  },
  {
    slug: "cohort-retention-analysis-product",
    title: "Cohort Retention Analysis: Using Cohorts to Drive Product",
    description: "Cohorts reveal which customers are your best and worst fits. Use cohort data to improve retention and product.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Advanced",
    readTime: 7,
    keywords: ["cohort analysis", "retention analysis", "cohort retention", "customer retention", "product improvement"],
    keyTakeaways: [
      "Cohort = Group of customers acquired in same month/channel. Comparing cohorts reveals: (1) Acquisition quality change (newer cohorts worse retention?), (2) Product impact (onboarding change improved retention?), (3) Churn pattern (which month do customers leave?).",
      "Healthy cohort: Day 7 retention 40%, Day 30 50%, Day 90 40%, Day 180 30%, Year 1 20%. Declining retention: Day 7 40%, Day 30 40% (no improvement), signal: product isn't delivering value post-aha.",
      "Use cohorts to find product wins: If January cohort (after feature X launch) has 10% higher retention than December cohort, feature X works (proves hypothesis). Run 3-4 product experiments per quarter, measure cohort impact."
    ],
    content: [
      {
        heading: "Reading Cohort Retention Tables and Extracting Insights",
        body: "**Cohort Retention Table**\n\nExample: Retention by acquisition cohort (% of original customers retained)\n\n         Month 1  Month 3  Month 6  Month 12\nJan 2024  100%     75%      50%      25%\nFeb 2024  100%     70%      42%      20%\nMar 2024  100%     65%      35%      15%\nApr 2024  100%     60%      30%      10%\nMay 2024  100%     55%      (future)\n\nObservation: Retention is declining cohort-to-cohort (Jan > Feb > Mar > Apr)\n\nInterpretation:\n- Jan cohort: Strong retention (25% at 12 months)\n- Apr cohort: Weak retention (10% at 12 months)\n- Possible causes: (1) Acquisition quality declining (newer customers worse fit), (2) Product got worse (launch broke something), (3) Market changed (harder to retain), (4) Churn definition changed\n\n**Diagnosing Cohort Decline**\n\nTest 1: Is early retention declining (Month 1-3)?\n- Jan: 75% at 3 months\n- Apr: 55% at 3 months\n- Yes, declining\n- Cause: Likely onboarding or product (early experience is degrading)\n- Fix: Improve onboarding, aha moment\n\nTest 2: Is late retention declining (Month 6-12)?\n- Jan: 50%→25% (25% drop from month 6 to 12)\n- Apr: 30%→10% (20% drop)\n- Similar drop rate\n- Cause: Likely seasonal churn or market (not product issue)\n- Fix: Improve retention engagement (CSM, product features)\n\n**Cohort Analysis by Feature Launch**\n\nUse cohorts to test product changes:\n\nBefore feature launch (Dec cohort, without feature):\n- Day 7 retention: 40%\n- Month 3: 65%\n- Month 6: 50%\n- Month 12: 25%\n\nAfter feature launch (Jan cohort, with feature):\n- Day 7 retention: 45% (+5 points improvement)\n- Month 3: 72% (+7 points)\n- Month 6: 58% (+8 points)\n- Month 12: 32% (+7 points)\n\nConclusion: Feature improved retention 5-8 points across all months (proven win!)\n\n**Cohort Analysis by Acquisition Channel**\n\nOrganic channel cohort (Jan):\n- Month 1: 100%\n- Month 3: 80% (good activation)\n- Month 12: 35% (good retention)\n\nPaid ads channel cohort (Jan same month):\n- Month 1: 100%\n- Month 3: 60% (worse activation)\n- Month 12: 20% (worse retention)\n\nConclusion: Organic customers are 75% better quality (80% vs. 60% at month 3). Should invest more in organic (lower CAC too).\n\n**Cohort-Driven Product Roadmap**\n\nUse cohort insights to prioritize:\n\nInsight 1: Cohort retention drops sharply month 2-3 (aha not hit)\n- Action: Improve onboarding, guided tour, aha moment faster\n- Timeline: 2-3 weeks\n- Expected impact: +10-15% retention\n\nInsight 2: Cohort retention stable at month 6+ (no engagement)\n- Action: Engagement features (notifications, gamification, use case expansion)\n- Timeline: 4-8 weeks\n- Expected impact: +5-10% retention\n\nInsight 3: Specific cohort (March) has worse retention than peers\n- Action: Investigate: What changed in March? (Product release? Marketing change? Market?)\n- Timeline: 1 week investigation\n- Expected impact: Identify and fix root cause\n\n**Building and Monitoring Cohort Dashboard**\n\nMinimum dashboard:\n- Cohort table (months acquired vs. retention months)\n- Show 12-month retention for each cohort\n- Highlight: Is trend stable, improving, or declining?\n- Mark product launches to correlate with retention improvements\n\nExample dashboard:\n- Last 12 cohorts (one year of data)\n- Highlight improving cohorts (feature worked)\n- Highlight declining cohorts (investigate)\n- Overlay: Feature launches, team changes, market events\n\nReview cadence: Monthly\n- Check: Are new cohorts improving or declining?\n- Compare to benchmark (peer products, your historical)\n- Investigate any cohort >2 points off trend"
      }
    ],
    relatedSlugs: [
      "customer-retention-churn-economics",
      "cohort-analysis-retention-curves-saas",
      "product-market-fit-metrics-validation"
    ],
    faq: [
      {
        q: "What's a healthy cohort retention curve?",
        a: "Day 7: 40%+. Day 30: 50%+. Day 90: 40%+. Year 1: 20%+. If Month 3 retention is <50%, onboarding/product issue. If Month 6+ declining >10% per month, churn is too high."
      },
      {
        q: "Why are older cohorts always worse?",
        a: "Natural: Earlier customers are more committed (high bar to switch). Newer cohorts are younger (more time to churn). But if trend is declining >2 points per cohort, something changed (product, market, acquisition quality)."
      }
    ],
    videoUrl: ""
  }
];
