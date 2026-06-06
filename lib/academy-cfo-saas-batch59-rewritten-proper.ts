import { AcademyArticle } from "@/types/academy";

export const batch59Articles: AcademyArticle[] = [
  {
    slug: "startup-runway-calculation-extension",
    title: "Runway Calculation and Extension: Knowing How Long Before You Need Capital",
    description: "Calculate and manage runway accurately. Know exactly how many months of operations you can sustain. Plan capital raises strategically.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 6,
    keywords: [
      "runway",
      "cash runway",
      "burn rate",
      "cash management",
      "capital raise",
      "cash runway calculation",
      "cash runway extension",
      "financial planning",
      "startup finance",
      "cash preservation"
    ],
    keyTakeaways: [
      "Runway = Cash on hand ÷ Monthly burn rate; if you have £2M cash and burn £100K/month, runway is 20 months; simple formula, but burn rate is the key variable to track (weekly, not monthly, to catch changes early)",
      "Critical runway thresholds: >12 months = comfortable, 6-12 months = start fundraising, <6 months = urgent, <3 months = emergency; companies should begin fundraising at 6-month runway (closing takes 2-3 months), not when runway is 1-2 months",
      "Extend runway without capital: Reduce burn rate (cut costs 20-30%), improve gross margin (COGS reduction), accelerate cash collection (customer payment timing), defer expenses (renegotiate vendor terms); extending runway by 3-6 months buys time for fundraising/profitability"
    ],
    content: [
      {
        heading: "Runway Calculation",
        body: `Runway is how many months you can operate with existing cash before you run out of money.

Formula: Runway (months) = Cash on hand ÷ Average monthly burn rate

Example:

Cash on hand: £1.5M
Monthly burn rate: £75K
Runway: £1.5M ÷ £75K = 20 months

Interpretation: Company can operate for 20 months without raising additional capital.

**Burn Rate Accuracy**

Burn rate = Monthly cash out - Monthly cash in

Example for £5M ARR SaaS:

Monthly cash in:
- Revenue: £416K (£5M ÷ 12)
- Actual cash from revenue: £250K (if customers pay with 30-day terms)
- Net cash in: £250K

Monthly cash out:
- Payroll: £300K
- AWS/hosting: £50K
- Contractors: £30K
- Tools/software: £20K
- Office: £10K
- Other: £10K
- Total: £420K

Burn rate: £420K - £250K = £170K per month

Cash on hand: £2M
Runway: £2M ÷ £170K = 11.8 months

Accuracy tips:

1. **Track weekly, not monthly**
   - Monthly burn can hide variance (e.g., quarter-end bonuses)
   - Weekly burn: Average daily spend × 7
   - Catch changes early (burn trending up/down)

2. **Include all cash out**
   - Don't forget: Taxes, insurance, benefits
   - Include: Contractor payments, vendor payments
   - Include: Upcoming commitments (annual contracts due next month)

3. **Account for seasonality**
   - Jan: Higher expenses (bonuses, budget refresh, conferences)
   - Dec: Lower expenses (year-end slowdown)
   - Use 12-month average, not single month

4. **Project future burn**
   - Hiring planned? Burn will increase
   - Planning to cut? Burn will decrease
   - Example: "If we hire 3 engineers (£300K annually), burn increases £25K/month"

**Runway Thresholds**

What runway means:

- >12 months: Comfortable (plenty of time to reach profitability or raise)
- 9-12 months: Monitor (start fundraising if growth stalling)
- 6-9 months: Start fundraising (closing takes 2-3 months)
- 3-6 months: Urgent (must close capital raise or cut costs)
- <3 months: Emergency (likely will run out of cash)

Timeline:

Month 0: Runway = 20 months (comfortable, focus on growth)
Month 6: Runway = 17 months (still comfortable, but start thinking about Series A)
Month 12: Runway = 14 months (can see profitability path, OR start Series A process)
Month 15: Runway = 11 months (good time to close Series A, if fundraising)

Key point: Start fundraising at 6-month runway, not 3-month.

Fundraising takes time:
- Month 1: Building relationships, meetings, pitches
- Month 2: Due diligence, discussions
- Month 3: Term sheet, closing

If you wait until 3-month runway to start, you'll run out before closing.

**Extending Runway Without Raising Capital**

Three ways to extend runway:

Lever 1: Reduce burn (cut costs)
- Example: Reduce from £100K to £75K/month (25% cut)
- Runway extension: £1.5M ÷ £75K = 20 months (vs. 15 months at £100K)
- +5 months runway from 25% cost cut

How to reduce burn:
- Hiring freeze (stop new hires)
- Headcount reduction (reduce team by 10-20%)
- Contractor cuts (eliminate non-essential contractors)
- Tool/vendor cuts (audit subscriptions, cancel unused)
- Defer non-essential expenses (events, conferences, fancy office)

Impact: 20-30% burn reduction possible without harming core business

Lever 2: Increase cash in (improve collections)
- Example: Move customers from monthly (30-day payment) to annual upfront
- Improve cash in from £250K to £350K/month (+£100K)
- New burn: £420K - £350K = £70K/month (vs. £170K)
- Runway extension: Massive (£2M ÷ £70K = 28.6 months vs. 11.8 months)

How to improve cash in:
- Move to annual upfront (offer 15% discount)
- Improve collection (follow up on overdue invoices)
- Accelerate renewals (negotiate early payment)
- Improve pricing (increase ACV)

Impact: 30-50% cash improvement possible (especially if currently monthly)

Lever 3: Improve gross margin (reduce COGS)
- Example: COGS from 30% to 25% of revenue
- At £416K monthly revenue, saves £416K × 5% = £20.8K monthly
- New burn: £170K - £20.8K = £149.2K (vs. £170K)
- Runway extension: £2M ÷ £149.2K = 13.4 months (vs. 11.8 months)
- Only +1.6 months, but every month helps

How to improve margin:
- Negotiate infrastructure costs (AWS, cloud spend)
- Optimize code (reduce database queries, server load)
- Automate support (reduce COGS per customer)
- Increase pricing (higher revenue, same COGS)

Impact: 5-10% margin improvement possible

**Example: Runway Extension Program**

Baseline (crisis scenario):
- Cash: £500K
- Burn: £100K/month
- Runway: 5 months (emergency)

Goal: Extend to 12 months without raising capital

Approach:

Month 1: Hiring freeze + contractor cuts
- Stop new hires (save £40K/month)
- Cut 1 FTE contractor (save £10K/month)
- New burn: £100K - £50K = £50K/month
- Runway extension: (£500K + £0) ÷ £50K = 10 months (vs. 5)
- +5 months runway

Month 2: Improve collections
- Move 50% of monthly customers to annual upfront (one-time boost)
- These customers prepay £250K (normally spread over year)
- New cash: £500K + £250K = £750K
- Runway: £750K ÷ £50K = 15 months

Month 3: COGS reduction
- AWS negotiation saves £5K/month
- Code optimization saves £3K/month (fewer servers)
- Support automation saves £2K/month
- New burn: £50K - £10K = £40K/month
- Runway: £750K ÷ £40K = 18.75 months

Result: Runway extended from 5 to 18 months through operational changes (no capital raise).

Trade-offs:
- Headcount cut: Lost growth capacity (can't hire)
- Payment term change: One-time cash boost (doesn't help month-to-month burn)
- Cost cuts: Leaner operations, but limited further improvement

Outcome: Company has 18 months runway to reach profitability or close funding round.

**Runway and Profitability Path**

Two paths to extend runway indefinitely:

Path 1: Profitability
- Year 1: Runway = 12 months, burn = £100K/month
- Cut costs to reach breakeven (burn = £0)
- Timeline: Reduce burn by £8.3K/month
- Month 12: Breakeven, runway = infinite

Path 2: Fundraising
- Raise capital at 6-month runway
- Use new capital to extend runway and fund growth
- Plan next fundraise for 6-month runway of new capital

Most SaaS: Combination
- Cut costs to slow burn (from £100K to £50K/month)
- Grow revenue (£5M ARR to £8M ARR, higher gross profit)
- Reach profitability or raise at higher valuation (more cash from fundraise)

**Runway Projection (12-month)**

Build forecast model:

| Month | Cash | Burn | Runway |
|-------|------|------|--------|
| Jan | £2.0M | £100K | 20 months |
| Feb | £1.9M | £105K | 18 months |
| Mar | £1.795M | £105K | 17 months |
| Apr | £1.69M | £110K | 15 months |
| May | £1.58M | £110K | 14 months |
| Jun | £1.47M | £100K | 14.7 months |
| Jul | £1.37M | £95K | 14.4 months |
| Aug | £1.275M | £90K | 14.2 months |
| Sep | £1.185M | £85K | 13.9 months |
| Oct | £1.1M | £80K | 13.75 months |
| Nov | £1.02M | £80K | 12.75 months |
| Dec | £0.94M | £75K | 12.5 months |

Key insight: Runway trending down, but stabilizing as burn improves.

At month 6 (June), runway = 14.7 months → Time to fundraise.

**Runway Monitoring**

Weekly checklist:

1. **Daily cash balance**
   - Know exactly how much cash you have
   - Track burn rate daily
   - Catch any anomalies

2. **Weekly burn rate calculation**
   - Calculate 4-week average burn
   - Compare to last week (trending up/down?)
   - If trending up, investigate why

3. **Monthly runway review**
   - Calculate runway
   - Update forecast
   - Adjust hiring/spending if needed

4. **Quarterly financial review**
   - Comprehensive analysis
   - Cash flow statement
   - Runway projection (12 months)

Runway is the #1 metric for startup finance. More important than revenue, growth rate, or profitability—because runway determines if you survive long enough to reach any other milestone.
`
      }
    ],
    relatedSlugs: [
      "cash-flow-management-for-saas",
      "burn-rate-management-cash-preservation",
      "profitability-targets-by-company-stage",
      "financial-modeling-for-saas",
      "startup-financial-health-checkup"
    ],
    faq: [
      {
        q: "When should I start fundraising?",
        a: "At 6-month runway, not 3-month. Fundraising takes 2-3 months to close. If you wait until 3 months, you'll run out before closing."
      },
      {
        q: "How can I extend runway without capital?",
        a: "Reduce burn (20-30% cost cut), improve collections (move to annual upfront), or cut COGS (5-10% margin improvement). Combination typically adds 3-6 months runway."
      },
      {
        q: "What's a dangerous runway level?",
        a: "<3 months is emergency. <6 months requires action (either cut costs, improve collections, or start fundraising). >12 months is comfortable."
      },
      {
        q: "Should I prioritize growth or profitability?",
        a: "If runway >12 months: prioritize growth (invest). If runway 6-12 months: balance (grow, but also improve unit economics). If runway <6 months: prioritize profitability (cut costs, improve margins)."
      }
    ],
    videoUrl: ""
  }
];

export default batch59Articles;
