import { AcademyArticle } from "@/types/academy";

export const batch143Articles: AcademyArticle[] = [
  {
    slug: "product-roadmap-planning-and-prioritization",
    title: "Product Roadmap Planning and Prioritization: Building What Matters Most for Growth",
    description: "Master product planning. Prioritize features, align roadmap with business goals, measure impact, and avoid build-driven waste.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "product roadmap",
      "feature prioritization",
      "product strategy",
      "feature ROI",
      "development prioritization",
      "roadmap planning",
      "product goals",
      "build vs buy",
      "technical debt",
      "release planning"
    ],
    keyTakeaways: [
      "Feature ROI = (Projected revenue impact / Development cost). Example: Feature A = £50K revenue impact / 4 weeks dev = £12.5K per week value. Feature B = £20K impact / 1 week dev = £20K per week value. Do Feature B first (higher ROI). Many teams build wrong features (founder ego, competitor copying, cool tech) wasting development. CFO should push for business case before build.",
      "Cost of slowness: Feature planned 6 months ago, 4 weeks dev, deployed 6.5 months from request = stale by launch. Market moved, customer need changed, competitor launched similar. Time-to-market matters: 1-week features <2% of revenue loss. 12-week features >20% revenue loss. Argue for smaller, faster releases (2-week sprints vs 3-month releases).",
      "Roadmap alignment with business plan: Roadmap should ladder to quarterly goals (OKRs). Q2 goal \"reduce churn to 2%\" → roadmap features = (1) In-app onboarding, (2) Usage analytics, (3) Email engagement. Each feature drives specific churn reduction. Without alignment, product builds random features, misses business targets."
    ],
    content: [
      {
        heading: "Feature Prioritization Framework",
        body: `How to decide what to build and in what order.

**Prioritization Criteria**

1. Business impact (40% weight)
   - Revenue impact: Will this increase MRR?
   - Retention impact: Will this reduce churn?
   - Market perception: Strategic positioning vs competitor?

2. Strategic alignment (30% weight)
   - Roadmap alignment: Does it support quarterly goals?
   - Market opportunity: Is this a growth market?
   - Customer requests: How many customers need this?

3. Technical feasibility (20% weight)
   - Development effort: How many weeks?
   - Technical risk: Known tech or experimental?
   - Maintenance burden: Ongoing support cost?

4. Speed to market (10% weight)
   - Time to build: Faster is better
   - Time to value: When do customers benefit?
   - Dependencies: Blocked by other work?

**Prioritization Matrix: Impact vs Effort**

Plot features on 2x2 grid:

High impact, low effort (Quick wins):
- Do immediately
- Examples: Bug fixes, customer requests, simple features
- List: Email unsubscribe link (1 day, prevents customer loss)

High impact, high effort (Major initiatives):
- Do next (breaking into smaller chunks)
- Examples: New product, platform rebuild
- List: Real-time analytics (10 weeks, £200K revenue impact)

Low impact, low effort (Nice to have):
- Do if time allows
- Examples: UI polish, cosmetic improvements
- List: Dark mode (1 week, 0 business impact)

Low impact, high effort (Avoid):
- Don't do
- Examples: Technical refactors that don't affect customers
- List: Database migration (6 weeks, no customer benefit)

**Feature Scorecard**

Rate each feature 1-10 on criteria:

Feature: Real-time reporting
- Business impact: 8 (helps retention, enables expansion)
- Strategic fit: 7 (supports Q2 goals)
- Effort: 4/10 effort (means high-effort = score inverted to 6)
- Speed to value: 8 (customer benefits immediately)
- Score: (8×0.4) + (7×0.3) + (6×0.2) + (8×0.1) = 7.5

Feature: Dark mode
- Business impact: 2 (nice-to-have, no revenue)
- Strategic fit: 3 (not in goals)
- Effort: 9/10 (low effort = score 8)
- Speed to value: 9 (immediate)
- Score: (2×0.4) + (3×0.3) + (8×0.2) + (9×0.1) = 3.4

Real-time reporting (7.5) >> Dark mode (3.4). Build real-time first.

**Feature ROI Calculation**

Baseline:
- Current: £100K MRR, 50% gross margin
- Current NRR: 105%

Feature impact (estimate):
- Real-time reporting: Retention improves 1% (churn 2% → 1%)
- That 1% = 10 customers saved (2% of 500 customers) × £100 MRR × 12 months = £12K annual
- Dev cost: 8 weeks × 1 engineer × £2K/week = £16K

Feature ROI: £12K benefit / £16K cost = 75% return in year 1 (marginal)

But: Benefit compounds (saved customers stay years longer, NRR compounds):
- Year 1: £12K benefit
- Year 2: £12K + (£12K × 105% NRR) = £24.6K benefit
- Multi-year: ROI 150%+

Decide: Worth building.

**Roadmap Planning by Quarter**

Q2 theme: "Reduce churn and improve retention"

Quarterly goal: Reduce churn from 2.5% to 2%, improve NRR from 105% to 110%

Features supporting:
1. In-app onboarding (4 weeks)
   - Impact: Improve M1 retention 85% → 90% (save 5% of cohort)
   - Revenue: On 150 new customers/month = 7.5 customers saved × £100 × 12 = £9K annual

2. Usage analytics dashboard (3 weeks)
   - Impact: Help CS identify at-risk customers (health score)
   - Revenue: Enables CS intervention, save 10 more at-risk customers = £12K annual

3. Engagement email campaigns (2 weeks)
   - Impact: Automated re-engagement for inactive users
   - Revenue: Save 5 inactive customers from churning = £6K annual

Total: 9 weeks development, £27K revenue impact (3x payback)

Q2 roadmap: All three features fit in sprint (2-3 month cycle), aligned to goal.

**Build vs Buy vs Partner**

Three options for each feature:

Build (custom in-house):
- Cost: High (dev time)
- Control: High (customize to needs)
- Speed: Slow (weeks)
- Timeline: Analytics dashboard = 4 weeks dev

Buy (third-party tool):
- Cost: Moderate (subscription)
- Control: Medium (limited customization)
- Speed: Fast (days to setup)
- Timeline: Amplitude analytics = 1 day to integrate

Partner (white-label / API):
- Cost: Moderate (revenue share or license)
- Control: Low (depends on partner)
- Speed: Medium (few weeks)
- Timeline: Zapier integration = 2 weeks

Decision framework:
- Core capability (everyone needs): Build (control, differentiation)
- Commodity (standard need): Buy (speed, cost)
- Differentiator: Build or partner (avoid commodity, own advantage)

Example:
- Email system: Buy (Sendgrid, commodity)
- Payment processing: Partner (Stripe, standard)
- Churn prediction: Build (proprietary, competitive advantage)

**Roadmap Communication**

Share roadmap with:
- Customers (marketing): Sets expectations, gathers feedback
- Sales team: Enables them to sell forward roadmap
- Board/investors: Shows product direction, execution capability
- Team: Motivates with visible impact

Format: Quarterly roadmap, not detailed
- Q2 themes (2-3 major initiatives)
- Features (5-10 at high level)
- NOT detailed specs (changes too often)

Example public roadmap message:
"Q2 roadmap focused on retention: (1) In-app onboarding to help new customers get started faster, (2) Analytics dashboards for customer success team, (3) Automated engagement campaigns. These will help us reduce churn and improve customer lifetime value."

`
      },
      {
        heading: "Measuring Feature Impact and Learning",
        body: `Track whether features deliver expected value.

**Measuring Feature Success**

Post-launch, measure:

In-app onboarding feature:
- Metric: M1 retention (% of cohort still active month 1)
- Pre-launch: 85%
- Post-launch (4 weeks after): 88%
- Success: +3 percentage points
- Annualized: 3% × 150 new customers × £100 × 12 = £54K annual benefit
- Expected: £9K (forecast underestimated impact, good)

Analytics dashboard:
- Metric: CS team proactive interventions
- Pre-launch: 5 at-risk interventions per month
- Post-launch: 15 at-risk interventions per month
- Success: 3x increase in proactive saves
- Revenue: 10 additional customers saved × £100 × 12 = £12K annual
- Expected: £12K (on target)

Engagement campaigns:
- Metric: Re-engagement email open rate, click rate
- Pre-launch: N/A (new feature)
- Post-launch: 25% open rate, 5% click rate
- Impact: Depends on conversion (need to track conversions to revenue)

**Establishing Measurement Early**

Before building feature:
1. Define success metric (what will we measure?)
2. Establish baseline (what's the current state?)
3. Set target (what improvement do we want?)
4. Plan measurement (how will we capture data?)

Example:

Feature: In-app onboarding
- Metric: Time to first valuable action (TTFVA)
- Baseline: 5 days average before feature
- Target: 1 day average with feature
- Measurement: Track in-app event "completed setup step 1" within 1 day of signup

Post-launch: Measure actual TTFVA, confirm feature working.

**Feature Roadmap ROI Tracking**

Maintain spreadsheet of all features shipped:

| Feature | Launch Date | Est. Impact | Actual Impact | ROI | Status |
|---------|-------------|------------|---------------|-----|--------|
| Onboarding | Feb | £9K | £54K | 6x | Win |
| Analytics | Feb | £12K | £12K | 1x | On target |
| Campaigns | Feb | £6K | £2K | 0.3x | Miss |
| Dark mode | Mar | £0 | £0 | 0x | Skip |

Patterns:
- Onboarding: Exceeded expectations (forecast 6x better)
- Analytics: On target (forecast accurate)
- Campaigns: Missed (technical issues, adoption low)
- Dark mode: Skipped correctly (no impact)

Learn: Forecast accuracy improves with pattern.

**Killing Features That Don't Work**

Not all features succeed. Kill them quickly:

Campaigns feature:
- Launched with 0.3x ROI (miss)
- Root cause: Adoption low, customers didn't enable campaigns
- Options: (1) Invest more to improve, (2) Kill and invest elsewhere
- Decision: Kill (better use of resources)
- Cost: 2 weeks support load to maintain, then shutdown
- Better: Kill early, avoid 2 weeks ongoing support

Rule: If feature doesn't hit 50% of target impact within 4 weeks, kill it and pivot.

**Feature Debt**

Track technical debt from features:
- Launched feature with temporary code (planned to refactor)
- Never refactored (new features prioritized)
- Now causes 2 bugs per month, requires extra support

Cost: 2 bugs × 4 hours support = 8 hours/month = £2K/year debt

Decision: Refactor or live with cost?
- Refactor: 2 weeks dev = £8K cost (4x annual debt)
- Live with it: 2+ years of debt = £4K+ cost

Refactor (short-term pain saves long-term cost).

Build technical debt only if short-term business impact justifies. Payoff within 2-3 quarters.

`
      },
      {
        heading: "Resource Allocation and Sprint Planning",
        body: `How to execute roadmap with limited resources.

**Development Capacity Planning**

Team size: 5 engineers
- Current: 40% supporting customers (bugs, support), 60% on roadmap
- Capacity: 3 engineers on roadmap, 2 on support

Roadmap for Q2 (12 weeks):
- Feature A: 4 weeks (1 engineer)
- Feature B: 3 weeks (1 engineer)
- Feature C: 2 weeks (1 engineer)
- Buffer: 2 weeks (unexpected issues, tech debt)
- Total: 11 weeks (within 12-week quarter capacity)

Plus: 2 engineers support (40% of work) = 6 weeks support work

**Sprint Planning (2-week sprints)**

Q2 Sprint breakdown:
- Sprints 1-2: Feature A (first 4 weeks)
- Sprints 3-4: Feature B (next 4 weeks)
- Sprints 5-6: Feature C (last 4 weeks)
- Buffer: Handle scope creep, tech debt

Each sprint:
- Planning (2 hours): Define work for sprint
- Daily standups (15 min): Status, blockers
- Demo (1 hour): Show what shipped
- Retro (1 hour): What went well, what improve

**Velocity Tracking**

Measure how much the team completes per sprint:

| Sprint | Planned (weeks) | Completed (weeks) | Velocity | Utilization |
|--------|-----------------|-------------------|----------|------------|
| 1 | 2 | 2 | 100% | Good |
| 2 | 2 | 1.8 | 90% | Good |
| 3 | 2 | 1.5 | 75% | Issues |
| Avg | 2 | 1.77 | 88% | — |

Velocity 88% = team completes ~1.75 weeks of work per 2-week sprint (typical).

Use velocity for forecasting:
- Planned feature: 4 weeks dev
- Velocity: 88% per sprint = 1.75 weeks per 2-week sprint
- Actual time needed: 4 weeks / (1.75 weeks/sprint) = 2.3 sprints = 4.6 weeks actual
- Plan: Add buffer to forecast

**Managing Scope Creep**

Scope creep: Adding features mid-project

Example:
- Original: Analytics dashboard, 3 weeks dev
- During build: "Can we also add export to CSV?" (1 week)
- During build: "Can we add custom date filters?" (1 week)
- Total: 5 weeks (2 week overrun)

Prevention:
- Define scope early (acceptance criteria)
- No scope changes mid-sprint
- New requests: Add to next sprint/roadmap
- Big requests: Cut scope vs timeline

Example conversation:
- PM: "Can we add CSV export?"
- Engineer: "That's 1 week additional. Options: (1) Add 1 week to timeline, (2) Remove another feature, (3) Do in next sprint."
- PM: "Do next sprint" (preserve timeline)

**Roadmap Adjustment Process**

Quarterly review (every 3 months):
- What did we ship? (Planned vs actual)
- What worked? (High-impact features)
- What didn't work? (Low-impact features to avoid)
- What changed? (Market, customer needs)
- Adjusted roadmap: Next quarter based on learnings

Example adjustment:
- Q1 shipped: Onboarding (great), analytics (good), campaigns (miss)
- Q2 focus: Cut features that are commodity (campaigns), double down on core (retention)
- Q2 new roadmap: Churn prediction (strategic), usage alerts (retention), mobile app (customer request)

**Executive Oversight**

CFO role in product:
1. Question assumptions (Why build this? What's the ROI?)
2. Insist on measurement (How will we measure success?)
3. Hold team accountable (Did feature deliver expected impact?)
4. Make hard calls (Approve/kill based on business case)
5. Manage trade-offs (This feature vs that feature = company priority?)

CFO should attend:
- Monthly product planning (understand roadmap, question priorities)
- Quarterly reviews (review impact of shipped features)
- Roadmap prioritization (weigh business impact of options)
- Kill decisions (should a feature be killed? CFO has say)

This ensures product aligns with business strategy.

`
      },
      {
        heading: "Avoiding Product Pitfalls",
        body: `Common mistakes in product planning and how to avoid them.

**Mistake 1: Building Cool Features Instead of Business Features**

Pitfall: Engineer says "Let's add AI" or "Let's build real-time sync" (cool tech, no customer demand)

Cost: 8 weeks dev, 0 revenue impact = £16K waste

Prevention:
- All features must have business case
- Before dev starts: "What problem does this solve? Who has it? How many? What's revenue impact?"
- If no clear answer: Don't build

**Mistake 2: Competitor Copying**

Pitfall: Competitor launches feature, panic, build same feature immediately

Cost: Distracted from roadmap, feature launches late (competitive gap remains)

Example:
- Competitor launches SMS notifications (claimed as game-changer)
- Company panic, diverts 2 engineers for 4 weeks to copy
- By launch: Competitor feature adoption low (not actually wanted)
- Company wasted 4 weeks, missed real priorities

Prevention:
- Wait 4 weeks for customer feedback
- Do customers actually want this? (Ask 10 customers)
- If yes, prioritize. If no, ignore.

**Mistake 3: Long Release Cycles**

Pitfall: 3-month release cycle, planning 6 months ahead, releasing outdated features

Cost: Feature planned in month 0, built months 2-4, released month 5 = market changed, no longer wanted

Prevention:
- Short release cycles (2-week sprints, release biweekly)
- Rolling roadmap (plan 6 weeks out, not 6 months)
- Feature flags (release features early, controlled rollout)

Impact: 2-week cycles = 12x faster feedback = can course-correct vs wasting 3 months on wrong feature.

**Mistake 4: No Roadmap Transparency**

Pitfall: Product team builds roadmap in secret, launches feature customers don't want

Prevention:
- Publish roadmap quarterly (themes, not detailed specs)
- Gather customer feedback (what would be most valuable?)
- Sales team inputs (what are customers asking for?)
- Board alignment (does roadmap support business plan?)

Transparency = alignment.

**Mistake 5: Technical Debt Accumulation**

Pitfall: Launch features with temporary code (planned to refactor), never refactor

Cost: Tech debt compounds, velocity declines, bugs increase

Example:
- Year 1: 3 features with shortcuts
- Year 2: Trying to build 3 more features, but bugs in old features eat 30% velocity
- Year 3: Can barely ship, velocity 50% of year 1

Prevention:
- Only take shortcuts if short-term business urgency
- Allocate 20% of capacity to technical debt payoff
- Refactor within 2-3 quarters, not "later"
- Monthly: Review tech debt, prioritize payoff

**Mistake 6: Missing Customer Input**

Pitfall: Build feature you think customers want, launch, adoption low

Prevention:
- Validate with customers before building (not after)
- Interview 10 target customers: "Would you use this?"
- Ship MVPs (minimal viable product): simplest version, launch early, iterate

Example:
- Theory: "Customers want offline mode"
- Validate: Ask 10 customers, 2 say yes, 8 say no (not important)
- Decision: Don't build, save 6 weeks dev
- Better approach: Ask what IS important, build that instead

`
      }
    ],
    relatedSlugs: [
      "product-market-fit",
      "financial-forecasting-modeling",
      "metrics-dashboard-design-kpi-tracking",
      "unit-economics-ltv-cac-payback",
      "quarterly-business-reviews-and-planning"
    ],
    faq: [
      {
        q: "How should I prioritize features?",
        a: "Use scorecard: Business impact (40%) + Strategic alignment (30%) + Technical effort (20%) + Speed to market (10%). Score each feature 1-10, total = priority ranking. Also consider ROI: Impact / Effort. Example: Feature A = 8 impact / 4 weeks = 2 per week, Feature B = 5 impact / 2 weeks = 2.5 per week. Do Feature B first (higher ROI)."
      },
      {
        q: "How do I know if a feature is worth building?",
        a: "Define success metric, baseline, and target BEFORE building. Example: Feature should improve M1 retention 85% → 90% (target: +5 percentage points). Measure 4 weeks post-launch. If you hit target, it was worth it. If you miss, kill it and move on. Track ROI: Expected revenue impact / dev cost. Target: 1x ROI minimum (payback in 1 year)."
      },
      {
        q: "What's the right roadmap timeline?",
        a: "Plan in rolling quarters: Current quarter + next quarter detailed, quarter 3+ at high level only. Example: Q2 detailed (specific features), Q3 themes (directions, not features), Q4 vision (where heading). Adjust monthly based on market changes. Detailed planning >6 months is wasteful (plans change faster than you can execute)."
      },
      {
        q: "How often should we release features?",
        a: "Goal: Biweekly or monthly releases. Benefits: Faster feedback, can kill bad features early, team velocity improves (shorter feedback loops). Typical: 2-week sprints, release every 2 weeks. If currently quarterly releases, migrate to biweekly (10x faster learning). Use feature flags (release, but hidden until ready)."
      }
    ],
    videoUrl: ""
  }
];

export default batch143Articles;
