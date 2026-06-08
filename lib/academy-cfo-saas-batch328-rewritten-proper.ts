import { AcademyArticle } from "@/types/academy";

export const batch328Articles: AcademyArticle[] = [
  {
    slug: "scenario-planning-and-sensitivity-analysis",
    title: "Scenario Planning and Sensitivity Analysis: Testing Your Plan",
    description: "Master scenario planning. Model outcomes, test assumptions, prepare contingencies.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["scenario planning", "sensitivity analysis", "financial modeling", "contingency planning", "risk planning"],
    keyTakeaways: [
      "Scenario planning: Build multiple versions of financial plan (base, upside, downside). Base case: Most likely (50% probability). Upside: Everything goes well (20% probability). Downside: Market slowdown (30% probability). Benefit: Prepare for range of outcomes (not surprised). Identify risks early (what could derail plan?). Decision-making (adjust strategy if downside likely). Example: Base case £1.5M revenue, Upside £2.2M, Downside £1M.",
      "Sensitivity analysis: Test which assumptions matter most. Question: If growth assumption wrong by 10%, how much does revenue change? Example: Revenue sensitivity to growth rate (±10% growth = ±£150K revenue change). Payroll sensitivity (±10% headcount = ±£90K impact). Identify: Which assumptions are critical? Where should you focus? Which assumptions can be wrong and still be okay?",
      "Building models: Start simple (Excel spreadsheet, monthly P&L × 12 months). Inputs: Revenue assumptions (growth), expense assumptions (payroll headcount, tool costs). Outputs: Projected P&L, runway, profitability date. Sensitivity: Change inputs 10-20%, see output change. Share: With team/board (transparency), use for decision-making (should we hire? Fundraise? Expand?)."
    ],
    content: [
      {
        heading: "Using Scenario Planning and Sensitivity Analysis for Decision-Making",
        body: `Building contingency plans and stress-testing your financial model.

**Scenario planning fundamentals**

Definition:
- Create multiple versions of financial plan
- Each version represents different assumption set
- Prepare for range of outcomes
- Make contingency plans for each

Typical scenarios:

Base case (most likely, ~50% probability):
- Growth assumptions: Realistic based on current trajectory
- Revenue: £1.5M annual (£100K → £150K MRR)
- Expenses: Planned hiring (7 → 12 people)
- Outcome: Breakeven month 12, £200K cash remaining

Upside case (everything goes well, ~20% probability):
- Growth assumptions: Strong PMF, viral growth
- Revenue: £2.2M annual (£100K → £200K MRR)
- Expenses: Same (don't increase burn chasing growth)
- Outcome: Profitable month 9, £500K cash remaining

Downside case (market slowdown, ~30% probability):
- Growth assumptions: Churn increases, sales slow
- Revenue: £1M annual (£100K → £85K MRR, declining)
- Expenses: Still £1.2M (payroll committed)
- Outcome: Bankrupt month 8 (need to cut costs or fundraise)

**Building a base case model**

Inputs (assumptions):

Revenue drivers:
- Current MRR: £100K
- New customer acquisition: +5 per month
- Average customer value: £2K per month
- Churn rate: 5% monthly
- Price increase: 3% mid-year

Expense drivers:
- Current payroll: £60K/month (7 people)
- Planned hires: 2 eng (Apr), 1 sales (Jul), 1 ops (Oct)
- Salary increase: 5% mid-year
- Tools/infrastructure: £9K/month (growing 2% with scale)
- Marketing: £10K/month (consistent)
- Operations: £6K/month (consistent)

Output example (monthly):

Month 1 (Jan):
- Beginning revenue: £100K
- New customers: +5 × £2K = +£10K
- Expansion: +£3K
- Churn: -5% × £100K = -£5K
- Ending revenue: £108K

- Payroll: £60K
- Tools: £9K
- Marketing: £10K
- Operations: £6K
- Total expenses: £85K
- Operating income: £108K - £85K = +£23K
- Cash position: £600K + £23K = £623K

Month 2:
- Repeat with new revenue base (£108K)
- Beginning revenue: £108K
- Similar pattern = £116.6K revenue
- Expenses: £85K
- Operating income: +£31.6K
- Cash: £654.6K

Year-end projection (12 months):
- Month 1-12: Revenue grows from £100K to ~£145K
- Average monthly revenue: ~£121K
- Average monthly expenses: £92K (rising due to payroll increases)
- Average monthly profit: ~£29K
- Year end cash: £600K + (£29K × 12) = £948K

Results:
- Revenue: ~£1.45M (close to £1.5M plan)
- Runway end of year: >12 months (comfortable)
- Profitability: Still losing money (operating loss ~£30K), but improving

**Building upside and downside scenarios**

Upside scenario:

Assumptions change:
- New customers: +10 per month (double)
- Churn: 3% (better retention)
- Price increase: 5% (higher value perception)

Results:
- Revenue growth: Much faster (£100K → £200K by month 12)
- Expenses: Same (don't increase spend to match revenue, run lean)
- Operating income: Positive by month 8
- Year-end cash: £600K + (strong profits) = £500K+ remaining
- Profitability: Achieved month 8
- Outcome: Self-funding possible, strong position for fundraising

Downside scenario:

Assumptions change:
- New customers: +2 per month (slower sales)
- Churn: 8% (product issues, customer unhappy)
- Market shift: Slowdown (fewer people buying)
- Revenue declining after month 6

Results:
- Revenue decline: £100K → £85K by month 12 (contracting)
- Expenses: Still £85K/month (fixed payroll)
- Operating income: Negative (-£5K/month by month 12)
- Year-end cash: £600K - (£30K average monthly loss × 12) = £240K
- Runway: Only 3-4 months at current burn
- Outcome: Crisis (need to cut costs immediately or fundraise)

**Sensitivity analysis**

Definition:
- Test "what if" scenarios
- Change one assumption at a time
- Measure impact on outcome

Example 1: Revenue growth sensitivity

Base case assumption: 50% annual growth (£100K → £150K)

Test variations:
- -10% growth (40% growth): £100K → £140K (-£10K impact)
- -5% growth (45% growth): £100K → £145K (-£5K impact)
- Base case (50% growth): £100K → £150K (baseline)
- +5% growth (55% growth): £100K → £155K (+£5K impact)
- +10% growth (60% growth): £100K → £160K (+£10K impact)

Sensitivity chart:

Growth assumption | Year-end revenue | Runway impact |
|---|---|---|
| 40% | £140K | -1 month |
| 45% | £145K | -0.5 month |
| 50% (base) | £150K | baseline |
| 55% | £155K | +0.5 month |
| 60% | £160K | +1 month |

Interpretation:
- ±10% growth = ±1 month runway impact
- If actual growth 40%, runway reduced 1 month (critical to monitor)
- Growth is high-leverage assumption (big impact on outcome)

Example 2: Payroll expense sensitivity

Base case assumption: 12 people by year-end (£96K/month)

Test variations:
- 10 people: £80K/month (-£16K/month)
- 11 people: £88K/month (-£8K/month)
- 12 people (base): £96K/month (baseline)
- 13 people: £104K/month (+£8K/month)
- 14 people: £112K/month (+£16K/month)

Sensitivity impact:

Headcount | Monthly payroll | Annual impact | Runway change |
|---|---|---|---|
| 10 | £80K | -£192K | +2 months |
| 11 | £88K | -£96K | +1 month |
| 12 (base) | £96K | baseline | baseline |
| 13 | £104K | +£96K | -1 month |
| 14 | £112K | +£192K | -2 months |

Interpretation:
- Each person = ~£16K annual impact (high leverage)
- Hiring freeze could extend runway 2+ months
- But impacts growth (fewer people = slower product)
- Trade-off: Growth vs. runway

Example 3: Churn rate sensitivity

Base case assumption: 5% monthly churn

Test variations:
- 3% churn: Revenue impact +20% (better retention = higher MRR)
- 5% (base): baseline
- 8% churn: Revenue impact -15% (worse retention = declining)

Impact on year-end revenue:

Churn rate | Year-end MRR | Annual revenue |
|---|---|---|
| 3% | £165K | £1.65M |
| 5% (base) | £145K | £1.45M |
| 8% | £130K | £1.30M |

Interpretation:
- 2% change in churn = ±£200K annual revenue
- Churn is high-leverage (focus here for impact)
- Improving retention has big payoff (NRR >100%)

**Building decision rules from scenarios**

Rule 1: Hiring decisions

Decision rule:
- If upside case likely (revenue >£180K): Hire aggressively
- If base case likely (revenue £140-160K): Hire cautiously
- If downside case likely (revenue <£130K): Hiring freeze

Application:
- Month 3: Actual revenue £104K (on track for base case)
- Decision: Hire engineering (planned)
- Month 6: Actual revenue £128K (below base, downside trajectory)
- Decision: Hiring freeze (preserve cash)

Rule 2: Fundraising decisions

Decision rule:
- If base case: Fundraise on schedule (month 9)
- If upside case: Can reduce raise amount (less dilution needed)
- If downside case: Fundraise earlier (month 6, before cash crisis)

Application:
- Month 3: Downside signals emerging (churn high, growth slow)
- Decision: Start fundraising conversations month 4 (earlier than planned)
- Goal: Close by month 7 (before cash emergency)

Rule 3: Product/market decisions

Decision rule:
- If churn increasing (heading to downside): Change product
- If new customer CAC increasing: Market saturation (change GTM)
- If NRR falling: Reduce revenue (not sustainable)

Application:
- Month 6: Churn increased from 5% to 7% (downside risk)
- Decision: Pause new features, focus on retention
- Timeline: Improve churn by month 9 or major decision needed

**Contingency planning**

For each scenario, identify:
1. Trigger (how will you know scenario happening?)
2. Timeline (when will you need to act?)
3. Action (what will you do?)
4. Owner (who is responsible?)

Downside contingency plan:

Trigger:
- Churn increases to >6% for 2 consecutive months
- Revenue growth falls below 2% MoM for 2 months
- NRR falls below 95%

Timeline:
- Month 1-2 of trigger: Investigate root cause
- Month 3: Implement response
- Month 6: Measure improvement

Actions:
1. Product: Reduce churn (improve onboarding, fix bugs)
2. Payroll: Hiring freeze immediately
3. Spending: Cut marketing 30% (reduce burn)
4. Fundraising: Start conversations (plan to close month 6-7)

Owner:
- Product team: Product improvements
- CEO: Hiring freeze, fundraising
- CFO: Spending cuts

Expected outcome:
- Reduce burn by 20-30% (extend runway)
- Implement fundraising (raise bridge round if needed)
- Improve product (recover churn)

Upside contingency plan:

Trigger:
- Revenue growth >60% YoY
- Churn <3%
- Inbound pipeline exceeds capacity

Timeline:
- Month 1-2: Confirm trend
- Month 3+: Scale spending

Actions:
1. Sales: Increase acquisition (hire sales team)
2. Product: Accelerate roadmap (more features)
3. Infrastructure: Scale systems (support higher volume)
4. Finance: Plan Series B (capitalize on momentum)

Owner:
- Sales team: Hiring, campaigns
- Product team: Roadmap acceleration
- Ops: Infrastructure scaling
- CEO: Investor conversations

Expected outcome:
- Accelerate growth (maintain momentum)
- Raise larger round (higher valuation)
- Capture market opportunity

`
      }
    ],
    relatedSlugs: ["financial-planning-and-budgeting", "metrics-dashboard-design-kpi-tracking", "burn-rate-optimization-and-runway-extension", "profitability-analysis-and-operating-leverage", "cash-runway-and-burn-rate-management"],
    faq: [
      { q: "What is scenario planning?", a: "Scenario planning: Create multiple versions of financial plan (base, upside, downside). Base (50%): Most likely outcome. Upside (20%): Everything goes well. Downside (30%): Market slowdown. Example: Base revenue £1.5M, Upside £2.2M, Downside £1M. Benefit: Prepare for range of outcomes, identify risks early, make contingency plans. Key: All based on explicit assumptions (growth rate, churn, hiring)." },
      { q: "What is sensitivity analysis?", a: "Sensitivity analysis: Test \"what if\" scenarios by changing one assumption. Example: If growth assumption 40% instead of 50%, revenue drops by £10K (year-end). Purpose: Identify critical assumptions (which matter most?). Results: Revenue most sensitive to growth rate and churn. Expenses most sensitive to headcount decisions. Action: Focus on high-leverage items (growth, retention)." },
      { q: "How do I use scenarios for decision-making?", a: "Build decision rules tied to scenarios: If revenue on track for upside → hire aggressively. If on downside track → hiring freeze. Trigger for action: When actual results differ from plan by >10%. Timeline: Monthly checks (is trajectory changing?). Actions: Hire/freeze, fundraise early/late, adjust marketing spend. Key: Don't panic with one bad month (trends matter), but act quickly if pattern changes." }
    ],
    videoUrl: ""
  }
];

export default batch328Articles;
