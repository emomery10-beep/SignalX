import { AcademyArticle } from "@/types/academy";

export const batch42Articles: AcademyArticle[] = [
  {
    slug: "revenue-operations-revops-strategy",
    title: "Revenue Operations (RevOps): Aligning Sales, Marketing, and Finance for Growth",
    description: "How to structure and implement Revenue Operations to improve sales efficiency, increase win rates, and accelerate growth.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Advanced",
    readTime: 8,
    keywords: [
      "revenue operations",
      "RevOps",
      "sales operations",
      "sales efficiency",
      "sales enablement",
      "pipeline management",
      "go-to-market strategy",
      "sales process",
      "revenue growth",
      "sales systems"
    ],
    keyTakeaways: [
      "RevOps alignment multiplies growth: Sales that's aligned with finance/marketing can improve win rates 15-25%; misaligned sales becomes chaotic and inefficient",
      "RevOps requires data visibility: Clear pipeline, accurate forecasting, and real-time metrics enable daily management; without visibility, you're flying blind",
      "RevOps spans three functions: Sales (pipeline generation), Marketing (lead quality), Finance (forecasting/metrics); connecting these three functions is where RevOps value lives"
    ],
    content: [
      {
        heading: "What is Revenue Operations and Why It Matters",
        body: `Revenue Operations (RevOps) is the strategic alignment and orchestration of sales, marketing, and finance to maximize revenue growth.

Traditional silos:
- Sales team: Focused on closing deals, not worried about lead quality or metrics
- Marketing team: Focused on lead generation, not worried if leads actually convert
- Finance team: Focused on reporting, not involved in pipeline or forecasting

This creates dysfunction:
- Sales complains: \"Marketing gives us garbage leads\"
- Marketing complains: \"Sales can't close anything\"
- Finance complains: \"Nobody tells me what's happening, can't forecast\"
- Result: Inefficiency, slow growth, missed forecasts

RevOps aligns these functions:
- Sales + Marketing: Marketing owns lead quality targets, Sales owns conversion targets, both are accountable
- Sales + Finance: Sales provides accurate pipeline data, Finance provides forecasting and analysis to guide strategy
- Marketing + Finance: Marketing spend is tied to ROI metrics, Finance tracks efficiency by channel
- All three: United around revenue goals, transparent metrics, shared accountability

**RevOps Impact on Growth**:

Company A (no RevOps):
- Sales: 50 leads/month, 20% conversion = 10 customers/month
- Payoff: High churn (no lead quality), inconsistent forecasting, sales/marketing tension
- Result: Stagnant growth at £2M ARR

Company B (with RevOps):
- Sales: 50 leads/month, 30% conversion = 15 customers/month (50% improvement from higher quality leads)
- Payoff: Lower churn (better customer fit), accurate forecasting, aligned team
- Result: Accelerated growth to £4M ARR

Same lead volume, but aligned teams generate 50% more revenue.

This is the RevOps value proposition: Alignment multiplies efficiency.

**RevOps Structure**:

Most B2B SaaS companies implement RevOps with:

1. **VP Sales**: Owns pipeline, win rates, forecasting (tactical execution)
2. **VP Marketing**: Owns lead quality, pipeline fill, attribution (strategy + execution)
3. **VP Finance/FP&A**: Owns metrics, forecasting, ROI analysis (visibility + strategy)
4. **RevOps Manager**: Bridges the three, manages CRM, data, processes (operations)

The RevOps Manager role is critical—they're the connective tissue ensuring all three functions are aligned.

Responsibilities:
- CRM ownership (Salesforce configuration and data quality)
- Pipeline management (stage definitions, forecast accuracy)
- Lead scoring (marketing hands off leads that meet sales criteria)
- Reporting and analytics (visibility into metrics across all functions)
- Process improvement (eliminating friction, automating where possible)

For companies under £5M ARR, a single RevOps leader (or shared FP&A/RevOps role) is sufficient. Larger companies need dedicated RevOps team.

**RevOps Tooling**:

Core tools:
- CRM: Salesforce, HubSpot (pipeline, deal tracking)
- Marketing automation: Marketo, Hubspot (lead nurturing, lead scoring)
- Data warehouse: Snowflake, BigQuery (centralized data)
- BI tool: Tableau, Looker (analytics and dashboards)
- Analytics: Amplitude, Mixpanel (product analytics)

These tools are expensive (£10K-100K+ per year total), but enable visibility that drives better decisions.

The key: All tools feed one truth (the data warehouse) so everyone sees the same metrics.

**RevOps Metrics Dashboard**:

Unified dashboard across sales, marketing, and finance:

| Metric | Value | Target | Status | Trend |
|--------|-------|--------|--------|-------|
| Monthly Bookings | £250K | £300K | Yellow | ↗ |
| Opps in Pipeline | 30 | 40 | Red | ↘ |
| Win Rate | 25% | 30% | Yellow | Stable |
| Sales Cycle | 60 days | 45 days | Red | ↗ |
| CAC | £8K | £6K | Red | ↗ |
| Lead Cost | £200 | £150 | Red | ↗ |
| Marketing Qualified Leads | 150 | 200 | Yellow | Stable |
| Lead-to-Customer Conversion | 3% | 5% | Yellow | Stable |

This dashboard shows everything at a glance:
- Bookings are below target (red flag)
- Pipeline is thin (red flag)
- Sales cycle is extending (red flag)
- CAC is rising (red flag)

Leadership can see this dashboard and immediately identify issues (need more leads, better lead quality, improve sales execution).

Without RevOps dashboard: These issues go undetected for months until revenue misses.

**Implementing RevOps**:

Phase 1 (Month 1-2): Data foundation
- Audit current data (CRM, marketing automation, finance systems)
- Identify gaps and inconsistencies
- Define standard metrics and calculations
- Build initial unified dashboard

Phase 2 (Month 3-4): Process alignment
- Marketing and Sales agree on lead scoring and qualification
- Sales and Finance align on pipeline definitions and forecasting
- All three agree on key metrics and cadence
- Implement weekly RevOps meeting (15 min sync)

Phase 3 (Month 5-6): Optimization
- Use metrics to drive decisions
- Experiment with process improvements
- Measure and iterate on what works
- Build new reports based on learnings

Timeline: Expect 6+ months to realize full RevOps benefits, but improvements visible in month 1-2.

**RevOps ROI**:

Cost: £150K-300K annually (RevOps role + tools + implementation)

Benefits:
- Sales efficiency: 10-15% improvement in win rates = 10-15% more revenue from same pipeline
- Forecasting accuracy: 90%+ accuracy (vs. 60% without RevOps) = better planning, fewer surprises
- Alignment: Fewer conflicts, faster decision-making = faster execution
- Data-driven decisions: Replace opinion with facts = better outcomes

A company with £5M ARR and 40 customers:
- 10% improvement in win rates = 4 more customers/month = £40K annual impact (assuming £10K ACV)
- Better forecasting prevents miss = £50K+ in avoided surprises/overheads
- Faster decision-making = 2 months acceleration on growth initiatives
- Total annual value: £100K+ (vs. £200K RevOps cost in year 1)

ROI improves year 2+ when RevOps infrastructure is mature and primarily operates/optimizes rather than building.

Most companies see RevOps as investment (year 1 cost, year 2+ payoff), not immediate profit center.
`
      }
    ],
    relatedSlugs: [
      "sales-efficiency-metrics",
      "sales-forecasting-pipeline",
      "marketing-funnel-attribution",
      "data-driven-decision-making",
      "organizational-scaling-headcount"
    ],
    faq: [
      {
        q: "When should I implement RevOps?",
        a: "At £1-2M ARR with clear sales process. Too early (pre-£500K) and you don't have data volume. Later implementation (£5M+) means years of inefficiency."
      },
      {
        q: "Do I need a dedicated RevOps person?",
        a: "Not always. <£2M ARR: VP Sales can own RevOps part-time. £2-5M ARR: Consider dedicated role. £5M+: Dedicated team (RevOps manager + analysts)."
      },
      {
        q: "What's most important: CRM, dashboards, or process?",
        a: "Process first (how you work). CRM second (captures process). Dashboards third (visualize results). Don't buy tools before defining process."
      },
      {
        q: "How long to see RevOps benefits?",
        a: "Month 1-2: Initial visibility. Month 3-4: Process improvements. Month 6+: Compounding benefits. Most see 10-15% efficiency gain by month 6."
      },
      {
        q: "Should RevOps report to Sales, Marketing, or Finance?",
        a: "Ideally to CRO (Chief Revenue Officer) or CEO if no CRO. RevOps is cross-functional, reporting to one function creates bias."
      }
    ],
    videoUrl: ""
  },
  {
    slug: "product-adoption-feature-analytics",
    title: "Product Adoption & Feature Analytics: Measuring and Improving Product Usage",
    description: "How to track product adoption, identify feature gaps, and use analytics to improve customer success and reduce churn.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "product adoption",
      "feature analytics",
      "product usage",
      "user analytics",
      "engagement metrics",
      "feature adoption",
      "product improvement",
      "usage analytics",
      "customer success",
      "retention metrics"
    ],
    keyTakeaways: [
      "Early adoption signals: If 30%+ of new users engage with core feature within 7 days, product-market fit is likely; if <10%, product has onboarding or feature-fit problems",
      "Feature adoption follows power law: 20% of features typically drive 80% of value for users; focus on getting users to core features, not building features users don't need",
      "Usage clustering: Segment customers by feature adoption (power users, casual users, inactive); tailor success strategy per segment (high-touch for power users, self-serve for casual)"
    ],
    content: [
      {
        heading: "Understanding Product Adoption Metrics",
        body: `Product adoption measures how quickly and deeply customers use your product. It directly correlates with retention and NRR.

**Core Adoption Metrics**:

1. **Time to First Key Action (TTFKA)**:
How long before a new user reaches "aha moment" (first meaningful use)?

Example: For project management SaaS, first meaningful action might be "create and assign task."

- Good: Average TTFKA = 5 days (users quickly find value)
- Poor: Average TTFKA = 30 days (users struggle to find value)

Target: <7 days for product-led growth, <14 days for sales-led (given sales onboarding).

If TTFKA is >14 days, investigate:
- Onboarding flow: Is it clear what to do first?
- Product complexity: Is core feature hidden behind menus?
- Customer job-to-be-done: Are we solving the right problem?

Improvement: Simplify onboarding flow, highlight core feature, reduce friction to first action.

2. **Feature Adoption Rate**:
% of active users who engage with specific feature.

Example dashboard:

| Feature | Active Users | Users Adopted | Adoption % |
|---------|--------------|---------------|-----------|
| Create Task | 1,000 | 950 | 95% |
| Assign Task | 1,000 | 800 | 80% |
| Due Dates | 1,000 | 600 | 60% |
| Recurring Tasks | 1,000 | 200 | 20% |
| API Integration | 1,000 | 50 | 5% |

This tells you:
- "Create Task" and "Assign Task" are core (95% and 80% adoption)
- "Due Dates" is secondary (60% adoption, useful but not critical)
- "Recurring Tasks" is advanced (20% adoption)
- "API Integration" is niche (5% adoption)

Resource allocation based on adoption:
- Don't over-invest in low-adoption features (API integration)
- Do invest in improving high-adoption features (task creation/assignment)
- Investigate why 20% of users don't use due dates (missing their use case? Confusing UX?)

3. **Depth of Adoption**:
How many features does an average customer use?

Example:

Shallow adoption: Average customer uses 3 out of 20 features (15%)
- Risk: Customer might churn if better product adds the 3 features they use
- Opportunity: Expand adoption to adjacent features, increase stickiness

Deep adoption: Average customer uses 12 out of 20 features (60%)
- Strong stickiness: Hard to switch (integrated into workflow)
- Opportunity: Add more advanced features, expand to adjacent modules

Target: >40% of available features per customer (threshold for strong stickiness).

**Adoption Cohort Analysis**:

Cohorts adopted in different months often show different adoption patterns:

| Cohort | Days to Core Feature | Feature Adoption | Retention at 6mo |
|--------|-------------------|-----------------|-----------------|
| Jan 2024 | 5 days | 70% avg | 90% |
| Apr 2024 | 8 days | 65% avg | 85% |
| Jul 2024 | 12 days | 55% avg | 75% |
| Oct 2024 | 15 days | 45% avg | 60% |

Trend: Adoption is declining (cohorts getting slower), which predicts declining retention.

Root cause investigation:
- Did onboarding process change?
- Did product add complexity?
- Did customer profile change (less sophisticated buyers)?
- Did competition introduce better onboarding?

Fix: Improve onboarding, simplify core flow, or target better customer profile.

**Product Adoption Tools**:

To track adoption, use analytics platforms:
- Amplitude, Mixpanel: Event-based analytics (track specific user actions)
- Segment: Data collection (unified event tracking across all tools)
- Heap: Automatic event tracking (don't need to instrument code)

Cost: £1K-10K/month depending on volume.

These tools tell you:
- When users do specific actions (created task, added assignee, etc.)
- How many users perform each action
- Cohort patterns (when they do actions in customer lifecycle)
- Retention correlation (do users who adopt core features early churn less?)

**Using Adoption Insights to Improve Retention**:

Correlation: Users who adopt core features by day 5 have 85% 6-month retention.
Users who don't adopt by day 10 have 40% 6-month retention.

Action: Build onboarding flow that gets 80%+ of users to core feature by day 5.

Implementation:
- Simplify signup (reduce fields, pre-fill where possible)
- In-app tour: Guide to core feature on day 1
- Email sequence: Send tips on days 2-5, focused on core feature
- Proactive support: CSM reaches out if user hasn't adopted by day 4

Result: Shift adoption curve earlier, improve retention.

Measurement: Track TTFKA monthly, target improvement to <5 days.

**Feature Adoption: Building Features Users Actually Use**:

The danger: Building features nobody uses.

Example: Feature launch with <10% adoption after 30 days.

Options:
1. Improve feature (maybe UX is confusing)
2. Remove feature (users don't need it)
3. Pivot feature (change it based on usage patterns)

Most teams don't kill features (psychological attachment). Better to kill features that don't drive retention than keep them and dilute product focus.

Decision framework:
- <5% adoption + no growth potential = Consider removing
- 5-20% adoption + growing + roadmap fit = Improve and promote
- >20% adoption = Core feature, invest in

This ruthless prioritization prevents product bloat.
`
      }
    ],
    relatedSlugs: [
      "customer-success-economics",
      "product-roadmap-prioritization",
      "churn-cohort-analysis",
      "feature-driven-growth",
      "data-driven-decision-making"
    ],
    faq: [
      {
        q: "What's a good time-to-first-key-action target?",
        a: "Product-led: <7 days. Sales-led (with onboarding): <14 days. If you're regularly >14 days, investigate onboarding or product clarity."
      },
      {
        q: "How do you balance building new features vs. improving adoption of existing?",
        a: "20/80 split: 20% effort on new features, 80% on improving adoption/retention. Most SaaS under-invests in adoption improvement."
      },
      {
        q: "Should you remove low-adoption features?",
        a: "Consider it. If <10% adoption and no growth potential, it's technical debt. Remove if: replacement feature exists, or problem solved differently."
      },
      {
        q: "How do you measure feature success?",
        a: "Two metrics: (1) Adoption % (does anyone use it?), (2) Retention correlation (do users who use it churn less?). If either is low, feature is unsuccessful."
      },
      {
        q: "What tools should I use to track adoption?",
        a: "Amplitude or Mixpanel for most SaaS (both excellent). Smaller teams can use free tools (Plausible). Price/complexity grows with data volume."
      }
    ],
    videoUrl: ""
  },
  {
    slug: "metrics-by-lifecycle-stage",
    title: "Metrics That Matter by Lifecycle Stage: What to Focus on at Each Growth Phase",
    description: "How to choose the right metrics to focus on based on your company's current stage and prioritize accordingly.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Advanced",
    readTime: 7,
    keywords: [
      "growth stage metrics",
      "company metrics by stage",
      "metrics by lifecycle",
      "early stage metrics",
      "growth stage metrics",
      "maturity stage metrics",
      "stage-specific metrics",
      "key performance indicators",
      "business metrics",
      "performance tracking"
    ],
    keyTakeaways: [
      "Pre-PMF stage: Focus on churn and NRR (is product sticky?), not ARR growth (market is still being searched); wrong metric focus kills companies here",
      "Growth stage (£1-10M ARR): CAC, payback, and growth rate matter most; profitability is secondary; focus on unit economics quality while scaling",
      "Mature stage (£10M+ ARR): Profitability, NRR, and efficiency become primary; growth rate is secondary; focus on margin expansion and shareholder returns"
    ],
    content: [
      {
        heading: "Metrics by Company Lifecycle",
        body: `Different metrics matter at different stages. Optimizing for the wrong metric at your stage wastes time and can kill your company.

**Stage 1: Pre-Product-Market Fit (£0-100K ARR)**

Focus: Finding product-market fit (does anyone want this?)

Primary metrics:
- **Retention/Churn**: Are customers using the product? If churn >10% monthly, product isn't sticky.
- **NRR**: Are customers expanding or contracting? If NRR <100%, customers aren't finding value.
- **Customer feedback**: Qualitative (what do customers love? What's missing?)

Secondary metrics:
- **Feature adoption**: Are customers using core features? Low adoption suggests product-market misalignment.
- **CAC**: Track but don't optimize. You're finding market, not scaling yet.

Ignore at this stage:
- **ARR growth rate**: Don't care if you're growing 50% or 100%; absolute numbers are small.
- **Operating margin**: Not relevant yet.
- **Sales cycle length**: Still finding repeatable process.

Decision framework:
- Churn <5% monthly + NRR >100% = Product-market fit signals, scale
- Churn >10% monthly + NRR <100% = Pivot product or market, don't scale yet

Most founders optimize for ARR growth at this stage (wrong metric), leading to scaling a product customers don't want.

**Stage 2: Early Growth (£100K-2M ARR)**

Focus: Finding repeatable, scalable acquisition

Primary metrics:
- **CAC**: How much does it cost to acquire one customer? Optimize for lowest CAC.
- **Payback period**: Can you recover CAC in <18 months? Longer = unsustainable.
- **Churn**: Still critical (unit economics don't work if customers leave fast).

Secondary metrics:
- **ARR growth rate**: 30-50% YoY is healthy target.
- **NRR**: 100%+ is healthy (customers not contracting).
- **Magic Number**: 0.5-0.8 shows efficient growth.

Ignore at this stage:
- **Operating margin**: You're burning cash to scale; margin is secondary.
- **Market share**: You have minuscule market share; irrelevant.
- **Enterprise vs. SMB mix**: Focus on what's working, not strategic market positioning yet.

Decision framework:
- CAC payback <12 months + growth 30%+ = You've found repeatable acquisition, scale hard
- CAC payback >18 months or growth <20% = Acquisition is expensive or market is slow, optimize before scaling

Many companies raise Series A here (£1-2M ARR) to fund growth, but Series A is only good if unit economics support it.

**Stage 3: Growth Stage (£2-10M ARR)**

Focus: Scaling proven unit economics, approaching profitability

Primary metrics:
- **NRR**: Must be 100%+. Your ability to expand existing customers is critical to growth trajectory.
- **CAC payback**: Should be 12-16 months (improving from earlier stage).
- **Growth rate**: Maintain 25-50% YoY while improving unit economics.
- **Operating leverage**: Headcount growth should be slower than revenue growth.

Secondary metrics:
- **Churn**: 3-5% monthly is healthy (for most SaaS).
- **Magic Number**: 0.7-1.0 shows healthy efficiency.
- **Gross margin**: Should be improving (60%+, targeting 70%+).

Ignore at this stage:
- **Market share**: Still early, don't matter yet.
- **Brand awareness**: Credibility matters more than brand.

Decision framework:
- NRR >110% + CAC payback <14 months + growth 30%+ = Healthy unit economics, scale
- NRR <100% or CAC payback >18 months = Unit economics deteriorating, focus on improving before scaling further

Series B-C happen here (£5-10M ARR) based on healthy metrics at this stage.

**Stage 4: Maturity/Scale (£10M+ ARR)**

Focus: Profitability, efficiency, shareholder returns

Primary metrics:
- **Operating margin/EBITDA**: Can you be profitable? Target path to 20%+ margins.
- **NRR**: Must remain >100%. Company is primarily expanding existing customers.
- **Cash flow**: Positive cash flow is now critical (funding growth from operations).

Secondary metrics:
- **Growth rate**: 15-30% YoY is healthy (growth slows at scale).
- **CAC payback**: Should be 10-12 months (optimized).
- **Churn**: 2-3% monthly (low, indicating strong product-market fit).

Ignore at this stage:
- **Growth rate obsession**: Market cap driven by profitability at this stage, not growth rate.
- **New product launches**: Focus on optimizing core product, not diversifying.

Decision framework:
- Margin >10% + NRR >100% + growth 20%+ = Healthy mature company, can be profitable
- Margin <5% or declining NRR = Core business deteriorating, fix before expanding

IPO or acquisition happens here (£20M+ ARR) based on profitability and market position.

**The Metric Progression**:

Pre-PMF → Early growth → Growth stage → Mature stage

Retention focus → Acquisition focus → Retention + expansion focus → Profitability focus

Primary metric: Churn → CAC → NRR → Margin

This progression reflects changing priorities as company scales.

**Common Metric Mistakes by Stage**:

Mistake 1: Pre-PMF founder focusing on ARR growth
- "We're growing 100%!"
- Reality: £50K → £100K annual growth is not impressive if churn is 10%
- Fix: Focus on retention first, growth is secondary

Mistake 2: Early-growth founder optimizing for growth while ignoring CAC payback
- "Sales are growing 50%!"
- Reality: But CAC is £30K and payback is 30 months (unsustainable)
- Fix: Optimize unit economics before scaling

Mistake 3: Growth-stage founder obsessing over profitability
- "We're spending £2M to scale"
- Reality: At £5M ARR with 40% growth, investing to scale is right
- Fix: Care about margins, but not at expense of growth opportunity

Mistake 4: Mature company still obsessing over growth rate
- "We're only growing 15%!"
- Reality: At £50M ARR, 15% growth + 25% margins = healthy business worth £500M+
- Fix: Optimize for profitability and cash flow, not growth rate

The metric you optimize for should match your stage. Optimizing for wrong metric is the fastest way to destroy value.
`
      }
    ],
    relatedSlugs: [
      "unit-economics-saas",
      "saas-metrics-dashboard-design",
      "growth-vs-profitability-tradeoff",
      "profitability-mechanics",
      "data-driven-decision-making"
    ],
    faq: [
      {
        q: "What metric should a pre-PMF founder focus on?",
        a: "Churn and retention. If customers love product, everything else follows. If they don't, growth is pointless."
      },
      {
        q: "At what ARR should I worry about profitability?",
        a: "£5M+ ARR you should have clear path. £10M+ ARR you should be profitable or very close. Before £5M, focus on unit economics quality."
      },
      {
        q: "How do you know when to shift metric focus?",
        a: "When you've mastered current focus (e.g., retention is healthy at <5% churn), shift focus to next metric (acquisition efficiency)."
      },
      {
        q: "Is it possible to optimize for two metrics simultaneously?",
        a: "Yes, but risky. Series B is when you start balancing retention + growth. Earlier, pick one to focus on."
      },
      {
        q: "What if your metrics don't match your stage?",
        a: "Red flag. Pre-PMF company with good growth but bad retention is scaling broken product. Fix retention before scaling."
      }
    ],
    videoUrl: ""
  }
];

export default batch42Articles;