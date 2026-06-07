import { AcademyArticle } from "@/types/academy";

export const batch80Articles: AcademyArticle[] = [
  {
    slug: "metrics-dashboard-design-kpi-tracking",
    title: "Metrics Dashboard Design and KPI Tracking: Monitoring the Numbers That Matter",
    description: "Design a metrics dashboard that tracks the KPIs that drive your business. Know which metrics matter and how to act on them.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 6,
    keywords: [
      "metrics dashboard",
      "KPI tracking",
      "key performance indicators",
      "dashboard design",
      "business metrics",
      "analytics dashboard",
      "metric monitoring",
      "performance tracking",
      "SaaS metrics",
      "data-driven decisions"
    ],
    keyTakeaways: [
      "Design dashboard with 5-8 KPIs max (more = noise): ARR, MRR, churn rate, CAC payback, burn rate, runway, NRR, magic number; each KPI should have target (goal), trend (improving?), and actual; red/yellow/green indicator (actual vs. target); different dashboards for different roles: CEO (ARR, runway, growth rate), sales (MRR, CAC, pipeline), product (churn, activation, DAU/WAU)",
      "Update frequency matters: Daily (burn rate, cash runway, sales pipeline), weekly (MRR, churn, activation), monthly (CAC, LTV, forecasts), quarterly (Rule of 40, benchmarking); too often = noise, too infrequent = missed signals; weekly reviews most common for operational metrics",
      "Dashboard red flags: Metric declining 3 months in a row = investigate; metric not aligned with strategy = remove it; no one checks the dashboard = wrong metrics chosen; different departments calculating same metric = standardize definition; metrics dashboard useless if you don't act on it (check monthly, discuss trends, adjust strategy)"
    ],
    content: [
      {
        heading: "Designing an Effective Metrics Dashboard",
        body: `A metrics dashboard displays your most important KPIs in real-time. It's the central source of truth for business health.

**Why a Dashboard Matters**

Without dashboard:
- Metrics scattered across spreadsheets
- Different teams use different numbers (sales says £3M revenue, accounting says £2.8M)
- No clear picture of business health
- Reactive decisions (address problems after they've developed)

With dashboard:
- Single source of truth
- Everyone sees same numbers
- Clear health picture
- Proactive decisions (address issues early)

**Choosing Your KPIs**

Most founders track too many metrics (vanity metrics, outdated metrics, metrics you don't act on).

Start with 5-8 core KPIs:

**Level 1: Health metrics** (everyone should track)
1. **ARR (Annual Recurring Revenue)**
   - What: Total annual recurring revenue
   - Why: Shows business size and growth
   - Target: Grow 30-50% YoY

2. **MRR (Monthly Recurring Revenue)**
   - What: Recurring revenue that month
   - Why: Shows month-to-month momentum
   - Target: Increase 3-7% month-over-month

3. **Burn rate**
   - What: Monthly cash spend
   - Why: Shows runway and burn trajectory
   - Target: Declining as % of revenue (operating leverage)

4. **Runway**
   - What: Months until cash runs out
   - Why: Shows financial risk
   - Target: 12+ months healthy, <6 months crisis

5. **Churn rate**
   - What: % of customers lost monthly
   - Why: Shows customer satisfaction
   - Target: <3% monthly (enterprise <1%)

**Level 2: Growth metrics** (if focused on growth)
6. **CAC (Customer Acquisition Cost)**
   - What: Cost to acquire one customer
   - Why: Shows efficiency of sales/marketing
   - Target: CAC payback <12 months

7. **Magic number**
   - What: Revenue growth vs. sales spend
   - Why: Shows sales efficiency
   - Target: 0.7-1.0+ (higher is better)

8. **NRR (Net Revenue Retention)**
   - What: Organic growth from existing customers
   - Why: Shows expansion and churn balance
   - Target: >100% (ideally 120%+)

Pick 3-5 from above, depending on stage and strategy.

**Dashboard Layout**

Effective dashboard has:

1. **KPI card** (for each metric)
   - Current value (large, prominent)
   - Target value (what you're aiming for)
   - Variance (actual vs. target, % or £)
   - Trend (arrow up/down, is it improving?)
   - Status (red/yellow/green indicator)

2. **Sparkline** (mini chart showing last 12 months)
   - Visual trend (is metric improving or declining?)
   - Pattern recognition (seasonal, declining, flat)

3. **Goal/target** (what you're aiming for)
   - Defined goal
   - Current progress toward goal
   - % of goal achieved

Example dashboard layout:

\`\`\`
┌─────────────────────────────────────────────────────────┐
│  ARR                │  MRR               │  Churn rate    │
│  £5.2M → £5.8M      │  £433K → £450K     │  3.2% → 2.8%   │
│  +12% vs target     │  +4% vs target     │  −0.4% vs tgt  │
│  ↑ improving        │  ↑ improving       │  ↓ improving   │
│  [████████░░] 85%   │  [████░░░░░] 40%   │  [████████░░] 80% │
├─────────────────────────────────────────────────────────┤
│  Burn rate          │  Runway            │  CAC payback   │
│  £80K → £75K        │  10.3 months       │  8.2 months    │
│  −6% vs last month  │  +1.5 months       │  Target: 12mo  │
│  ↓ improving        │  ↑ healthy         │  ↓ improving   │
│  [███░░░░░░] 30%    │  [██████░░░░] 86%  │  [███████░░░░] 68% │
└─────────────────────────────────────────────────────────┘
\`\`\`

Red/yellow/green status:
- Green: On track or better (within 10% of target)
- Yellow: Caution (10-20% off target)
- Red: Alert (>20% off target or declining)

**Role-Specific Dashboards**

Different roles need different dashboards:

**CEO dashboard** (strategic health)
- ARR, growth rate
- Burn rate, runway
- Rule of 40 (growth + margin)
- CAC, LTV, LTV/CAC ratio
- Churn rate
- NRR

**Sales dashboard** (sales performance)
- Pipeline (qualified deals)
- Deal velocity (days to close)
- Win rate (% of proposals that close)
- Sales cycle length
- Revenue by AE
- CAC by channel

**Product dashboard** (product health)
- Activation rate (% of users who take key action)
- DAU/WAU/MAU (engagement)
- Churn rate
- Feature adoption (% using key features)
- Time to activation
- NRR/expansion rate

**CS dashboard** (retention/expansion)
- Churn rate by segment
- Health score (at-risk customers)
- Expansion rate
- Customer satisfaction (NPS, CSAT)
- Support response time
- Escalation rate

Each team has role-specific dashboard, but CEO dashboard is the source of truth for overall health.

**Update Frequency**

| Metric | Update frequency | Who checks | When to act |
|--------|----------|----------|----------|
| Burn rate, runway | Daily | CFO | If runway <6 months, escalate |
| ARR, MRR | Weekly | CEO, finance | Every Monday morning |
| Churn, activation | Weekly | Product, CS | If >0.5% deviation, investigate |
| CAC, pipeline | Weekly | Sales leader | Every Friday review |
| NRR | Monthly | CEO, product | Monthly board meeting |
| Rule of 40 | Quarterly | Board | Quarterly board meeting |

**Too frequent** = noise and overreaction
**Too infrequent** = miss trends (month 1 issue isn't seen until month 3)

Weekly reviews are standard for operational metrics.

**Metric Targets and Alerts**

Set targets and create alerts:

| Metric | Target | Alert (yellow) | Alert (red) |
|--------|--------|----------|----------|
| Burn rate | £80K | >£100K | >£120K |
| Runway | 12 months | <10 months | <6 months |
| ARR growth | 50% YoY | <40% | <25% |
| Churn rate | 2% monthly | >3% | >5% |
| CAC payback | 9 months | >12 months | >18 months |
| Activation | 60% | <50% | <35% |

When metric hits yellow: Investigate and discuss (is this trend or one-month variance?)
When metric hits red: Take action (reduce burn, increase sales, improve product)

**Common Dashboard Mistakes**

Mistake 1: Too many metrics
- Track 20+ metrics
- Dilutes focus, increases noise
- Fix: Limit to 5-8 core KPIs

Mistake 2: Metrics without context
- Show number without trend, target, or status
- Can't tell if metric is good or bad
- Fix: Always show target and trend

Mistake 3: Vanity metrics
- Track metrics that make you feel good but don't drive decisions
- Example: total users (if you only care about paid customers)
- Fix: Track only metrics you'd change strategy on

Mistake 4: Different definitions
- Sales team says "leads" = inquiries
- Marketing team says "leads" = qualified prospects
- Same word, different meaning
- Fix: Standardize definitions across org

Mistake 5: No action on insights
- Beautiful dashboard, no one checks it
- Metrics decline for 3 months, no one notices
- Fix: Weekly reviews, discuss trends, adjust strategy

**Building Your Dashboard**

Tool options:

| Tool | Cost | Ease | Customization |
|------|------|------|----------|
| Google Sheets | Free | Easy | Limited |
| Data Studio | Free | Easy | Good |
| Tableau | £70/person/month | Medium | Excellent |
| Looker | £200+/month | Medium | Excellent |
| Metabase | Free (open source) | Medium | Good |

For most startups: Google Sheets or Data Studio (free, easy, adequate).

For mature SaaS: Tableau or Looker (better integrations, automation).

**Dashboard Best Practices**

1. **One source of truth**
   - Pull from single system (not multiple spreadsheets)
   - Automate updates (no manual entry, reduces errors)
   - Real-time or daily refresh

2. **Define success**
   - For each metric, define what "good" looks like
   - Red/yellow/green thresholds
   - Clear targets

3. **Share widely**
   - Every team member should see dashboard
   - Weekly reviews (Monday morning = standard)
   - Discuss trends and action items

4. **Act on insights**
   - If churn ↑, escalate to CS team
   - If ARR growth ↓, escalate to sales
   - If burn rate ↑, escalate to CFO
   - Don't track metrics you won't act on

5. **Update targets regularly**
   - As business scales, targets change
   - Quarterly target review (board meeting)
   - Ensure targets are ambitious but realistic

**From Data to Decision**

Effective dashboard workflow:

Monday 9am: CEO reviews dashboard
- ARR up 5% WoW ✓
- Churn down to 2.8% ✓
- Burn rate up to £85K ⚠️ (investigate)

Monday 10am: Finance reviews with CEO
- Burn spike due to annual AWS renewal (expected)
- Adjusted forecast shows return to £75K next month
- Status: Yellow → Green

Monday 11am: CEO communicates to team
- "Great week on ARR and churn"
- "Spend will be back to normal next month"
- "Stay on course for Q4 targets"

This is how metrics drive decisions.
`
      }
    ],
    relatedSlugs: [
      "data-driven-decision-making-analytics",
      "financial-forecasting-modeling",
      "burn-rate-runway-planning",
      "saas-benchmarking-metrics-comparison",
      "unit-economics-deep-dive"
    ],
    faq: [
      {
        q: "How many KPIs should I track?",
        a: "5-8 maximum. Too many = noise. Choose metrics you'll actually act on. CEO dashboard: ARR, burn, runway, churn, growth rate. Different teams have role-specific dashboards."
      },
      {
        q: "How often should I review metrics?",
        a: "Daily: Burn rate, runway. Weekly: ARR, MRR, churn, activation. Monthly: CAC, LTV. Quarterly: Rule of 40. Weekly reviews are standard for operational health."
      },
      {
        q: "What tools should I use?",
        a: "Early stage: Google Sheets or Data Studio (free). Growth stage: Tableau or Looker (enterprise features). Most important: Automate updates, single source of truth."
      },
      {
        q: "What if a metric is red?",
        a: "Investigate first (is this one-month variance or a trend?). Discuss with relevant team. If trend, take action (adjust strategy, increase resources, pivot).  Don't ignore red flags."
      }
    ],
    videoUrl: ""
  }
];

export default batch80Articles;
