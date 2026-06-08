import { AcademyArticle } from "@/types/academy";

export const batch209Articles: AcademyArticle[] = [
  {
    slug: "strategic-planning-and-quarterly-goal-setting",
    title: "Strategic Planning and Quarterly Goal Setting: Aligning Organization Around Goals",
    description: "Master strategic planning. Set goals, cascade OKRs, measure progress, and align teams.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "strategic planning",
      "quarterly planning",
      "OKR",
      "goal setting",
      "metrics",
      "annual planning",
      "roadmap",
      "execution",
      "alignment",
      "performance management"
    ],
    keyTakeaways: [
      "Annual goal-setting: Start with vision (5-year outlook), translate to 3-year plan (revenue, profitability, market), translate to annual goals (£15M ARR, 35% growth, 40% margin). Break into quarterly (Q1-Q4 focus areas). Example: Year 1 goal £3M ARR, 30% growth. Q1 focus: Customer acquisition (sales +3 reps), Q2 focus: Retention (CS program), Q3 focus: Product (launch new tier), Q4 focus: Profitability (cost control + revenue). Each quarter: 3-5 key goals (focus, not sprawl). Goal formula: Specific (£3M ARR), measurable (trackable), achievable (realistic), relevant (business priority), time-bound (by quarter). Bad goal: 'Improve sales' (vague). Good goal: 'Close 10 enterprise deals (£50K+ ACV) by Q4' (specific, measurable, time-bound).",
      "OKR framework: Objective (what we want) + Key Results (how we'll measure). Example: Objective 'Become market leader in enterprise segment'. Key results: (1) £10M enterprise ARR (vs current £2M), (2) NPS >60 (vs current 45), (3) Win 3 major accounts (vs competitors). Cascade: Company OKRs → Department OKRs (eng: ship roadmap to support sales, product: build enterprise features, sales: close enterprise deals). Benefit: Alignment (everyone working toward same goal), transparency (everyone knows priority), focus (not everything matters). Tracking: Monthly progress review (on track, at risk, off track), quarterly update (next quarter priorities).",
      "Execution discipline: Plan quarterly (90-day cycles), weekly team syncs (15 min status), monthly reviews (progress vs goal, variance analysis), quarterly retrospectives (what worked, what didn't). No goal tracking = no accountability. Example: Revenue goal Q1 £2M, actual £1.8M (10% miss). Review: Why? Sales rep onboarding slower (expected 4 hires, only 2 hired), product delays (feature launch 2 weeks late). Action: Accelerate hiring Q2, ramp faster, adjust Q2 target to £2.2M (conservative, account for ramp). Measure quarterly but adjust monthly (don't wait until end of quarter to address issues)."
    ],
    content: [
      {
        heading: "Strategic Planning Framework",
        body: `Setting company direction and goals.

**Planning hierarchy**

5-year vision (aspirational):
- Where do we want to be in 5 years?
- Example: "Become the leading finance platform for mid-market SaaS"
- Financial: £100M ARR, 50%+ operating margin, market leader (20%+ share)

3-year plan (strategic):
- Translate vision to 3-year financial and operational milestones
- Year 1: £3M ARR, build product-market fit, 2 main features
- Year 2: £8M ARR, enterprise go-to-market, 50% growth
- Year 3: £15M ARR, profitability path clear, 85% growth

Annual plan (operational):
- Translate 3-year plan to year targets
- Revenue: £3M (exact number, not range)
- Growth: 30%
- Margin: 10% (path to profitability)
- Headcount: 40 (from 30)

Quarterly objectives (tactical):
- Q1: Customer acquisition (launch enterprise sales)
- Q2: Retention (build CS program)
- Q3: Product (launch new tier)
- Q4: Profitability (cost control)

Monthly and weekly execution:
- Monthly: Progress review vs goal, variance analysis
- Weekly: Team syncs (status, blockers, support needed)

**Annual goal-setting template**

Revenue goals:
- MRR target: £250K (by year-end, from £200K start)
- ARR growth: 30% (MRR × 12)
- Key drivers: 30 new customers (average £5K ACV), expand 20% of base
- Confidence: 70% (achievable, bit of stretch)

Profitability goals:
- Gross margin target: 78% (improve from 75% via automation)
- OpEx target: £2.2M (from £2M, 10% growth vs 30% revenue growth)
- Operating margin target: 12% (from 8% current)

Retention goals:
- Churn target: 1.8% monthly (from 2.2% current)
- NPS target: 55 (from 48)
- Customer expansion: 25% of customers expand >10% (vs 20% current)

Customer goals:
- CAC target: £1.2K (from £1.5K, via improved targeting)
- LTV target: £8K (from £7K, via increased retention)
- LTV/CAC ratio: 6.7x (from current 4.7x)

Product goals:
- Launch 3 new features (most-requested)
- Achieve 80%+ adoption on new features
- Reduce support tickets 15% (via self-service improvements)

Team goals:
- Hire: 10 people (net, from 30 to 40)
- Retention: Keep 90%+ of team (vs 85% industry average)
- Employee NPS: 50+ (engagement score)

`
      },
      {
        heading: "OKR Framework and Cascading",
        body: `Organizing goals using OKRs.

**OKR structure**

OKR = Objective + Key Results

Company OKRs (Q1 example):
- Objective: "Become leading enterprise solution"
  - KR1: Close 3 enterprise deals (£50K+ ACV each)
  - KR2: Build enterprise-grade security features
  - KR3: Establish 5 enterprise reference accounts

- Objective: "Improve customer success and retention"
  - KR1: Reduce churn 2.2% → 1.8%
  - KR2: Improve NPS 48 → 52
  - KR3: Expand 20% of customer base

Department OKRs (aligned to company):

Sales OKRs:
- Objective: "Close enterprise deals and expand existing customer base"
  - KR1: Close 3 enterprise deals
  - KR2: Generate £500K expansion revenue
  - KR3: Improve sales cycle 90 → 75 days

Product OKRs:
- Objective: "Enable enterprise customers and improve security"
  - KR1: Ship enterprise SSO feature
  - KR2: Achieve SOC 2 compliance
  - KR3: Product launch launch >80% adoption from enterprise customers

CS OKRs:
- Objective: "Reduce churn and expand customer lifetime value"
  - KR1: Reduce churn 2.2% → 1.8%
  - KR2: Expand 20% of customer base (£500K expansion revenue)
  - KR3: Improve onboarding (time to first value <7 days)

**Tracking and adjustment**

Weekly check-in:
- Status: On track / at risk / off track
- Progress: % complete
- Blockers: What's needed to succeed
- Weekly status: 5 min sync per team

Monthly review:
- Detailed assessment: Are we on track to hit Q target?
- Variance analysis: If off track, why? Early action?
- Confidence: Increase or decrease confidence score

Quarterly retrospective:
- Did we achieve our goals? % completion
- What worked: Which initiatives succeeded?
- What didn't work: What should we stop doing?
- Learnings: What did we discover?
- Next quarter: Adjust based on learnings

Example Q1 → Q2 adjustment:
- Q1 goal: Close 3 enterprise deals (KR1)
- Q1 actual: Closed 1 deal (33% of target)
- Root cause: Sales cycle 120 days (vs 90 target), sales ramp slower
- Q2 adjustment: Target 2 deals (conservative), adjust sales hiring plan (add 1 more rep)
- KR adjusted to: "Close 5 total enterprise deals (cumulative, vs 3 per quarter)"

`
      }
    ],
    relatedSlugs: [
      "financial-forecasting-modeling",
      "metrics-dashboard-design-kpi-tracking",
      "quarterly-business-reviews-and-planning",
      "department-budgeting-and-headcount-planning",
      "board-reports-and-financial-statements"
    ],
    faq: [
      {
        q: "How do I set annual goals?",
        a: "Start: Vision (5-year where), 3-year plan (milestones), annual targets (£3M ARR, 30% growth, 10% margin). Break into quarterly themes: Q1 customer acquisition, Q2 retention, Q3 product, Q4 profitability. Goals: Specific (£3M ARR), measurable (trackable), achievable (realistic but stretch), relevant (priority), time-bound (by year-end). Cascade: Company goals → Department goals (each dept contributes to company goal)."
      },
      {
        q: "What's an OKR and how do I use it?",
        a: "OKR = Objective (what) + Key Results (how measured). Example: Objective 'Become enterprise leader'. KRs: Close 3 deals, build SSO feature, achieve SOC 2. Benefits: Alignment (everyone knows priority), focus (3-5 goals per team, not 20), transparency. Tracking: Monthly review (on track?), quarterly retrospective (did we achieve?). Adjust: Based on learnings, update next quarter."
      },
      {
        q: "How often should I review goals?",
        a: "Weekly: 5-min status check (on track, blockers?). Monthly: Deeper review (are we on track to hit quarterly target? Any early action needed?). Quarterly: Retrospective (did we achieve?), plan next quarter. Annual: Full strategic review (did we achieve annual targets? Adjust 3-year plan?). Cadence: Weekly pulse, monthly action, quarterly alignment."
      },
      {
        q: "What if I miss a goal?",
        a: "Analyze: Why did we miss? (Market, team, execution?). Learn: What would we do differently? Action: Adjust next quarter target (be more conservative), change strategy (different approach), add resources (if needed). Example: Miss sales goal (closed 1/3 deals). Reason: Longer sales cycle (120 vs 90 days). Adjust Q2: Target 2 deals (realistic), extend hiring timeline. Don't ignore, adjust."
      }
    ],
    videoUrl: ""
  }
];

export default batch209Articles;
