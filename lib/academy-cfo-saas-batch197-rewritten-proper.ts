import { AcademyArticle } from "@/types/academy";

export const batch197Articles: AcademyArticle[] = [
  {
    slug: "decision-making-frameworks-and-data-analytics",
    title: "Decision-Making Frameworks and Data Analytics: Making Informed Choices",
    description: "Master analytics-driven decisions. Build dashboards, analyze data, and make confident choices.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "analytics",
      "decision-making",
      "data-driven",
      "dashboard",
      "metrics",
      "data analysis",
      "business intelligence",
      "reporting",
      "A/B testing",
      "hypothesis testing"
    ],
    keyTakeaways: [
      "Decision framework: (1) Define decision to make (Expand to enterprise or stay mid-market focused?). (2) Identify key metrics (CAC enterprise vs mid-market, LTV, payback period). (3) Analyze current data (enterprise £5K CAC, 18-month payback; mid-market £1K CAC, 9-month payback). (4) Project scenarios (enterprise path: slower revenue, higher margin; mid-market path: faster revenue, lower margin). (5) Decide and monitor (choose path, set KPIs, track quarterly). Most decisions have imperfect data; use 60% confidence as threshold (don't wait for 90%, too late).",
      "Dashboard requirements: 4-6 KPIs max (too many = noise). Visualize: Actual vs target vs trend. Update: Daily or weekly (not monthly, too stale). Audience: Exec dashboard (revenue, churn, CAC/LTV) vs team dashboard (daily, specific to team). Example exec: MRR (£100K target, £95K actual, trending up), Churn (2% target, 2.2% actual, stable), CAC/LTV (3x target, 2.8x actual, improving). Tools: Mixpanel, Amplitude, custom dashboards (Tableau, Looker, Mode).",
      "A/B testing: Run small experiment (change 1 variable, measure outcome). Example: Test pricing (£100/month vs £150/month, measure conversions). Sample size (1000+ customers, 2-week test). Statistical significance (95% confidence needed before declaring winner). ROI: Test costs £10K (dev + analyst time), winner generates £200K additional revenue = 20x ROI. Culture: Run 4-8 tests per quarter (accumulate winners, compound gains)."
    ],
    content: [
      {
        heading: "Decision-Making Framework",
        body: `A structured approach to decisions.

**Decision Framework Process**

Step 1: Define the decision
- Clear question: "Should we expand to enterprise segment or stay mid-market focused?"
- Not: "Should we expand?" (too vague)
- Framing: What's the tradeoff? What's success?

Step 2: Identify key metrics
- What data answers the question?
- Example (expand to enterprise): CAC, LTV, payback period, deal cycle length, margin
- What do we know now? What's assumption vs fact?

Step 3: Analyze current data
- Gather data (sales, customer, financial data)
- Calculate metrics
- Example current state:
  - Mid-market: CAC £1K, LTV £10K (10-month payback)
  - Enterprise: CAC £5K, LTV £50K (12-month payback)
  - Observation: Enterprise has higher LTV but longer payback

Step 4: Model scenarios
- Scenario 1 (stay mid-market): Year 1 £10M revenue, year 3 £30M (90% margin decline, mature market)
- Scenario 2 (expand enterprise): Year 1 £8M revenue (slower due to longer sales cycle), year 3 £50M (high LTV compounds, better margin)
- Scenario 3 (both): Year 1 £10M (mid-market), add enterprise year 2 = year 3 £40M (balanced)

Step 5: Decide and commit
- Choose scenario (usually based on: market opportunity, team capability, capital available)
- Set KPIs to measure success (revenue growth, CAC/LTV ratio, cash position)
- Timeline: Quarterly reviews (are we on track? Adjust if needed)

Step 6: Monitor and adjust
- Track KPIs weekly, review quarterly
- If underperforming: Why? Adjust strategy, add resources, pivot
- If outperforming: Double down, accelerate

**Examples of Decisions with Data**

Decision 1: Raise price 10% or not?
- Data: Current customers (10,000), conversion rate (5%), ARPU (£100)
- Assumption: Price increase will reduce conversions to 4.5% (0.5% elasticity)
- Impact: Revenue increase (10% price × £100 × 10,000 × 4.5% / 5%) = still up 6% net
- Decision: Raise price, monitor churn (if churn spikes, roll back)
- Monitor: ARPU up 10%, but watch if churn increases >1% month

Decision 2: Hire 2 salespeople or 1?
- Data: Current sales team (5), revenue target (£15M), revenue per sales rep (£2M)
- Need: 7.5 salespeople to hit £15M
- Option 1: Hire 2 (total 7), miss target by £1M
- Option 2: Hire 3 (total 8), exceed target, but overhire
- Decision: Hire 2, miss target slightly (lower cost), evaluate after 6 months if hire 3rd

Decision 3: Expand to new market (UK) or focus on US?
- Data: US mature (50% market share), UK green field (2% market share)
- US expansion: CAC £1K, slow growth (saturating)
- UK expansion: CAC £1.5K (new market, slower), LTV £12K (great fit)
- UK payback: 8 months (vs US 10 months)
- Decision: Expand UK, allocate 3 people to build UK presence, measure 6 months

**Confidence Threshold**

In reality, most decisions have incomplete data:
- Confidence levels: 60% (reasonable data), 70% (solid data), 80% (strong data), 90%+ (data-rich decision)
- Decision rule: Make decision at 60%+ confidence
- Why: Waiting for 90% = analysis paralysis, lose competitive advantage
- Example: Decision to expand enterprise with 70% confidence vs waiting for 90% (6 more months of analysis, competitor enters market)

Cost of being wrong:
- Low-cost decision (wrong = small loss): Make at 50% confidence (quick decision)
- Medium-cost decision (wrong = moderate loss): Make at 60-70% confidence
- High-cost decision (wrong = company risk): Make at 80%+ confidence

`
      },
      {
        heading: "Dashboard Design and Analytics",
        body: `Building dashboards for visibility.

**Executive Dashboard Design**

Frequency: Daily or weekly update
Audience: CEO, CFO, board (5-minute review, not deep dive)
Format: Single page visual (traffic light - red/yellow/green)

Key metrics (pick 4-6):
1. Revenue (MRR or ARR)
   - Show: Actual vs target vs last month vs last year
   - Trend: Up/down/stable
   - Red flag: Below 90% of target

2. Churn (monthly % or annual %)
   - Show: Current churn vs target vs trend
   - Trend: Should be stable or improving
   - Red flag: Above 2.5%

3. CAC payback (months)
   - Show: Current vs target (12 months for SaaS)
   - Trend: Should improve (stable or decreasing)
   - Red flag: >15 months (unprofitable customer acquisition)

4. Cash runway (months)
   - Show: Current cash, monthly burn, months until zero
   - Trend: Should improve (reduce burn or grow revenue)
   - Red flag: <12 months runway (need to raise or cut costs)

5. NPS or CSAT
   - Show: Current score vs target (>50 NPS, >85% CSAT)
   - Trend: Should be stable or improving
   - Red flag: Declining (product/service issue)

6. Expansion NRR or customer count
   - Show: NRR % (target >100%) or customer growth
   - Trend: Should be up
   - Red flag: NRR declining (<110%), customer growth <10% monthly

Example dashboard:
\`\`\`
EXECUTIVE DASHBOARD | Last Updated: Monday

MRR: £95K (target £100K, -5%) ↗ Trending up 2% last 4 weeks
Churn: 2.2% monthly (target 2%) ↑ Slightly up, investigating
CAC Payback: 10 months (target 12, improving) ↓ Getting better
Cash Runway: 18 months (target 24, concern) ↓ Burn rate increasing, hiring impact
NPS: 52 (target 50, good) ↗ Up from 48 last quarter
NRR: 108% (target 110%) → Stable, good expansion
\`\`\`

**Team-Level Dashboard**

Sales dashboard:
- Pipeline (£, % by stage)
- Win rate (% of proposals closed)
- Average deal size
- Sales cycle length
- Forecast vs actual

Engineering dashboard:
- Sprint velocity (points completed)
- Bug count (open, in review, fixed)
- Build time (deploy frequency)
- Uptime/performance metrics

CS dashboard:
- Customer health scores
- At-risk customers (count)
- NPS trend
- Onboarding completion %
- Churn risk predictions

Finance dashboard:
- Cash position and burn rate
- Revenue recognition
- Headcount vs plan
- Vendor spend vs budget

**Building the Dashboard**

Tools:
- Simple: Google Sheets + data connectors (cheap, limited)
- Medium: Tableau, Looker, Mode (middle cost, professional)
- Complex: Custom dashboards (most expensive, most flexible)

Data sources:
- Revenue: Billing system (Stripe, Zuora, Salesforce)
- Usage: Analytics (Mixpanel, Amplitude)
- Customer: CRM (Salesforce, HubSpot)
- Financial: Accounting software (Xero, NetSuite)

Integration:
- Most tools have pre-built connectors (Stripe, Salesforce)
- Some require custom API integrations
- Frequency: Daily or weekly automated updates

Maintenance:
- Monthly review: Are metrics still relevant? Need to add/remove metrics?
- Quarterly refresh: Update targets based on reality
- Archive: Keep historical data (trend over time)

`
      },
      {
        heading: "A/B Testing and Experimentation",
        body: `Running small experiments to drive growth.

**A/B Testing Framework**

Test = hypothesis + control + measurement

Example test:
- Hypothesis: "Reducing price 10% will increase conversions by 15%"
- Control: Current price (£100/month)
- Variant: New price (£90/month)
- Sample: 5,000 new signups (2,500 each group)
- Duration: 2 weeks (long enough to gather data)
- Measurement: Conversion rate (% who sign up and become customer)

Statistical significance:
- Sample size: Need enough data to be confident
- Rule of thumb: 1,000+ sample size per variant (2,000 total for A/B test)
- Duration: 2 weeks minimum (account for weekly variations)
- Confidence: 95% (industry standard, means 5% chance result is random)

Example result:
- Control: 5% conversion (125 customers)
- Variant: 5.2% conversion (130 customers)
- Difference: 0.2% absolute, 4% relative increase
- Statistical significance: 60% confidence (not significant at 95%)
- Conclusion: No clear winner, continue testing or iterate

**Types of Tests**

Pricing tests:
- Question: Is £100, £150, or £200 optimal?
- Test: Show 3 different prices to different user segments
- Measure: Conversion rate and revenue
- Winner: Price that maximizes revenue (not just conversion)

Feature tests:
- Question: Should we redesign the dashboard?
- Test: 50% get old dashboard, 50% get new
- Measure: Usage, NPS, retention
- Winner: Whichever improves key metrics

Copy/messaging tests:
- Question: Which headline converts better?
- Test: Version A "Reduce costs by 50%" vs Version B "Save £10K annually"
- Measure: Click-through rate, sign-up rate
- Winner: Whichever drives more conversions

Landing page tests:
- Question: Should we add social proof (customer logos)?
- Test: Version with logos, version without
- Measure: Sign-up rate, trial conversion
- Winner: Version that converts more

**Building a Testing Culture**

Typical velocity: 4-8 tests per quarter
Success rate: 20-30% of tests are winners
Compounding effect: Run 10 tests/quarter, 3 winners = 3 improvements that stack

Example:
- Test 1: Pricing (winner, +5% conversion)
- Test 2: Onboarding (winner, +2% retention)
- Test 3: Email copy (loser, no impact)
- Test 4: Feature redesign (winner, +1% NPS)
- Combined impact: (1.05 × 1.02 × 1.00 × 1.01) = 8% overall improvement

Governance:
- Product manager: Propose test, hypothesis
- Engineer: Implement variant
- Analyst: Design test, measure results
- Stakeholder approval: Before launching test

Risk management:
- Don't test if: Would harm customer experience (core feature test risky)
- Do test if: Hypothesis grounded, sample size adequate, reversible
- Monitor: Watch for unintended side effects (churn spike, performance issues)

`
      }
    ],
    relatedSlugs: [
      "metrics-dashboard-design-kpi-tracking",
      "financial-forecasting-modeling",
      "unit-economics-ltv-cac-payback",
      "churn-analysis-retention-improvement",
      "pricing-strategy-and-price-optimization"
    ],
    faq: [
      {
        q: "How do I make data-driven decisions?",
        a: "Framework: (1) Define decision clearly, (2) Identify key metrics that answer question, (3) Analyze current data, (4) Model scenarios (outcomes for each choice), (5) Decide at 60%+ confidence (don't wait for perfect data), (6) Monitor and adjust quarterly. Example: 'Expand to enterprise?' CAC £5K vs mid-market £1K. Enterprise LTV £50K vs mid-market £10K. Decision: Expand, target 10 enterprise customers year 1, measure payback period."
      },
      {
        q: "What metrics should my executive dashboard show?",
        a: "Pick 4-6 max: (1) MRR/ARR (actual vs target), (2) Churn (target <2%), (3) CAC payback (target <12 months), (4) Cash runway (target >12 months), (5) NPS (target >50), (6) NRR (target >100%). Show: Actual, target, trend (up/down), red flags. Update daily/weekly. Format: Traffic light visual (red/yellow/green). Single page, 5-minute review."
      },
      {
        q: "Should I run A/B tests?",
        a: "Yes, if: Quick to implement, reversible, hypothesis-driven. Examples: Pricing (winner = higher revenue), messaging (winner = higher conversion), feature (winner = better retention). Sample size: 1000+ per variant. Duration: 2+ weeks. Cost: £10K dev/analyst time. ROI: If test wins, often 10-20x return (e.g., +5% conversion = £200K incremental revenue). Culture: Run 4-8 tests/quarter, expect 20-30% winners, compound gains."
      },
      {
        q: "How do I know if a test result is real or random?",
        a: "Use statistical significance (95% confidence standard). If sample size adequate (1000+ per variant) and result shows 5%+ difference, likely real. If result <3% difference or sample <500, could be random. Tools: Online calculators or analyst can determine. Don't launch if not significant (waste of effort). If borderline (80-90% confidence), run longer test or gather more data."
      }
    ],
    videoUrl: ""
  }
];

export default batch197Articles;
