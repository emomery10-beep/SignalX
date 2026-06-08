import { AcademyArticle } from "@/types/academy";

export const batch345Articles: AcademyArticle[] = [
  {
    slug: "data-analytics-and-insights-for-decision-making",
    title: "Data Analytics and Insights for Decision-Making: Using Data Effectively",
    description: "Master data analytics. Collect data, generate insights, make decisions.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["data analytics", "business analytics", "data insights", "analytics tools", "decision-making"],
    keyTakeaways: [
      "Data strategy: Identify what matters (not all data). Key: Actionable (metric leads to decision). Example: CAC data actionable (spend more if <£500, less if >£1500). Vanity metric: \"10K page views\" not actionable (what do you do?). Process: (1) Identify metric, (2) Set target, (3) Decide action (if above/below target), (4) Execute, (5) Measure impact. Cost: Tools (£100-5000/month), time to set up. ROI: Huge (data-driven decisions > gut decisions).",
      "Analytics tools: Google Analytics (web traffic), Mixpanel/Amplitude (product usage), Tableau/Looker (dashboards), Segment (data collection). Choice: Start simple (GA + spreadsheet), graduate to specialized tools as scale. Integration: All tools feed to data warehouse (single source of truth). Key: Data quality (garbage in = garbage out).",
      "Analysis framework: (1) Descriptive (what happened?), (2) Diagnostic (why did it happen?), (3) Predictive (what will happen?), (4) Prescriptive (what should we do?). Most common: Descriptive (dashboard shows metric). Better: Diagnostic (why is churn up?). Best: Prescriptive (reduce churn by fixing onboarding, measure impact). Investment: Start descriptive, mature to prescriptive."
    ],
    content: [
      {
        heading: "Building Data Analytics Capabilities for Better Decisions",
        body: `Using data effectively to drive business strategy and execution.

**Data fundamentals**

Data strategy:
- Identify metrics that matter (actionable, not vanity)
- Collect systematically (not ad-hoc)
- Analyze regularly (dashboard, weekly/monthly review)
- Act on insights (metric → decision → action)
- Measure impact (did it work?)

Actionable vs vanity metrics:

Actionable metric: "CAC is £500"
- Decision: If > £1000, reduce marketing. If < £300, increase.
- Action: Adjust budget
- Impact: Measurable (revenue change)

Vanity metric: "10K page views"
- Decision: Unclear (is this good? What to do?)
- Action: Unclear
- Impact: Hard to measure

Real example:

Metric: "NPS is 32"
- Actionable: Yes (target 40, gap 8 points)
- Decision: Must improve retention/satisfaction
- Action: Interview detractors, improve onboarding
- Impact: NPS increases to 40 (measurable)

Metric: "We have 1000 active users"
- Actionable: Not really (compared to what? Growing?)
- Better metric: "Active users grow 20% MoM" (trend clear)
- Decision: Growth rate acceptable, continue current strategy
- Action: Maintain or accelerate

**Data collection and sources**

Data sources by topic:

Revenue:
- Billing system (Stripe, Recurly): Transaction data
- CRM (Salesforce): Pipeline, customer lifecycle
- Financial system (QuickBooks): Invoices, payments

Customer:
- Product database: Customer profiles, attributes
- Support tickets (Zendesk): Issues, sentiment
- Customer survey: NPS, CSAT, feedback

Product usage:
- Analytics tool (Mixpanel, Amplitude): User events, features
- Website analytics (Google Analytics): Traffic, conversions
- Log files: System performance, errors

Operations:
- HR system: Headcount, salaries
- Git (code repository): Development metrics
- Project management (Asana): Team productivity

Integration:
- Data warehouse (Snowflake, Redshift, BigQuery): Centralize all data
- API connections: Tools connect to warehouse
- Result: Single source of truth (all metrics from one place)

**Analytics tools by need**

Early stage (< £1M revenue):

Tools:
- Google Analytics: Web traffic (free)
- Stripe dashboard: Payment data (free)
- Spreadsheet (Google Sheets): Manual analysis (free)
- Segment: Event collection (free tier)

Cost: £0 (free tools)
Limitation: Manual, limited analysis

Growth stage (£1-10M revenue):

Tools:
- Mixpanel/Amplitude: Product usage analytics (£500-5000/month)
- Tableau/Looker: Dashboards (£500-2000/month)
- Data warehouse (Snowflake): Central data (£1000-5000/month)
- Custom queries (SQL): Ad-hoc analysis

Cost: £2-10K/month
Benefit: Automated, comprehensive, self-service

Mature stage (£10M+):

Tools:
- Enterprise analytics (same as above, scaled)
- Data scientist (hire): Advanced analytics
- ML/AI (build): Predictive models

Cost: £10K-100K+/month
Benefit: Advanced insights, predictive, competitive advantage

**Analytics frameworks**

Framework 1: Descriptive analytics

Question: "What happened?"

Examples:
- Revenue last month: £100K (down 10% from prior month)
- Churn: 5% (up from 3% prior month)
- NPS: 32 (down from 35)

Output: Dashboard (current state)

Limitation: Reactive (know problem after it happens)

Framework 2: Diagnostic analytics

Question: "Why did it happen?"

Examples:
- Revenue down 10%: Why? (check: churn up, new customers down)
- Churn 5% up: Why? (interview customers: missing features, poor support)
- NPS down: Why? (detractor reasons: slow response time, bugs)

Output: Root cause analysis (understand problem)

Improvement: More proactive (know cause, can address)

Framework 3: Predictive analytics

Question: "What will happen?"

Examples:
- If churn stays 5%, revenue will be £900K next month (down 10%)
- If CAC stays £500, payback period will be 14 months
- If NPS stays 32, predict 8% annual churn

Output: Forecast (future state)

Benefit: Predict consequences (easier to decide)

Framework 4: Prescriptive analytics

Question: "What should we do?"

Examples:
- Revenue declining → Recommendation: Reduce CAC or increase retention
- Churn 5% → Recommendation: Improve onboarding (interview says setup hard)
- NPS 32 → Recommendation: Faster support, product improvements

Output: Action recommendation (what to do)

Benefit: Actionable insights (decision is clearer)

**Building analytics capability**

Phase 1: Foundation (months 1-3)

Goal: Collect and visualize key metrics

Actions:
- Identify 5-7 key metrics (revenue, churn, CAC, NPS, runway, growth, margin)
- Set up collection (API integrations, manual data entry)
- Build dashboard (Google Sheets or Looker)
- Weekly review (CEO looks at metrics)

Cost: £0-1K (mostly tools, some setup time)

Output: One-page dashboard (understand current state)

Phase 2: Insight generation (months 4-9)

Goal: Move from descriptive to diagnostic

Actions:
- Monthly analysis: Why did metric move?
- Cohort analysis: Which customers/segments different?
- Correlation analysis: What drives which metrics? (churn + NPS related?)
- A/B tests: Test changes, measure impact

Cost: £2-5K (analytics tools, maybe analyst hire part-time)

Output: Insights (understand drivers)

Phase 3: Prediction (months 10-18)

Goal: Forecast, plan proactively

Actions:
- Build forecasts (revenue, churn, runway)
- Scenario planning: "If X, then Y"
- Identify leading indicators (what predicts future?)
- Trend analysis: Is trend improving or declining?

Cost: £5-20K (data scientist time, advanced tools)

Output: Foresight (predict future)

Phase 4: Prescription (18+ months)

Goal: Automated decision-making

Actions:
- Build models: "If churn up, send CS outreach" (automated)
- ML predictions: "Customer X is high churn risk" (flag for action)
- Optimization: Automated budget allocation to best channels
- Experimentation platform: Auto-test features, measure impact

Cost: £20-50K+ (data scientist team, infrastructure)

Output: Actionable intelligence (decisions made automatically)

**Data-driven decision process**

Weekly rhythm:

Monday: Collect
- Pull data from all systems
- Update dashboard
- Identify variances (metric off-target?)

Tuesday: Analyze
- If variance >5%, investigate
- Root cause analysis (dashboard → deep dive)
- Generate insights

Wednesday: Decide
- Review findings (leadership meeting)
- Decide on action (if needed)
- Assign owner

Thursday-Friday: Execute
- Implement decision
- Track impact (does action improve metric?)
- Report back (next week, was it effective?)

Example:

Monday:
- Dashboard shows churn 6% (target 3%)
- Variance: +3% (problem)

Tuesday:
- Analyze: Why up?
- Interview churned customers: "Product slow", "missing feature", "poor support"
- Root cause: Mix of product and support

Wednesday:
- Decide: (1) Fix performance (product team), (2) Hire support (ops)
- Owner: Product lead for perf, ops lead for support
- Timeline: 2-week plan

Thursday-Friday:
- Execution starts
- Measure: Track churn weekly

Following week:
- Churn: 5.5% (improving, not there yet)
- Continue actions
- Expect 3% in 4 weeks (when changes land)

**Common analytics mistakes**

Mistake 1: Too many metrics
- Problem: 50-metric dashboard (overload, don't know what matters)
- Fix: 5-7 key metrics (focus)
- Impact: Clear priorities, easier to manage

Mistake 2: No baseline
- Problem: "Churn is 5%, is that good?"
- Fix: Set target (target 3%), benchmark (industry 4-5%)
- Impact: Clear accountability (on-track or off-track)

Mistake 3: Measure without action
- Problem: Dashboard shows CAC £1500 (off-target), no action
- Fix: Metric → decision → action (improve channels, reduce CAC)
- Impact: Data drives real change

Mistake 4: No data quality
- Problem: Data incomplete, inconsistent (different systems show different numbers)
- Fix: Data warehouse (single source of truth), data validation (clean data)
- Impact: Trust in data (decisions are credible)

Mistake 5: Ignore outliers
- Problem: One customer churned (normal), but why?
- Fix: Investigate outliers (often signal bigger problem)
- Example: One customer churned because "feature broken" → affects everyone

`
      }
    ],
    relatedSlugs: ["metrics-dashboard-design-kpi-tracking", "unit-economics-ltv-cac-payback", "financial-planning-and-budgeting", "scenario-planning-and-sensitivity-analysis", "profitability-analysis-and-operating-leverage"],
    faq: [
      { q: "What metrics should I track?", a: "Key 5-7: Revenue (or MRR), Churn, CAC, NPS, Runway, Growth rate, Gross margin. Actionable: Metric leads to decision. Example: CAC £500 = good (spend more), CAC £1500 = expensive (optimize). Vanity: \"10K page views\" not actionable. Dashboard: One page, refresh weekly. Avoid: Too many metrics (50+ = overload)." },
      { q: "What analytics tools should I use?", a: "Early (£0-1M): Google Analytics (free), Stripe dashboard, Google Sheets. Growth (£1-10M): Mixpanel/Amplitude (product), Tableau (dashboards), Snowflake (warehouse). Cost scales: Free to £2K early, £2-10K mid, £10K+ mature. Key: Start simple, graduate to specialized. Integrate: All feed to data warehouse (single source of truth)." },
      { q: "How do I use data for decisions?", a: "Process: (1) Identify metric + target, (2) Collect data, (3) Analyze (why variance?), (4) Decide (action if off-target), (5) Execute, (6) Measure impact. Example: Churn 6% (target 3%), analyze (why?), improve onboarding, measure (churn drops to 3%), success. Key: Metric → Decision → Action (not just reporting)." }
    ],
    videoUrl: ""
  }
];

export default batch345Articles;
