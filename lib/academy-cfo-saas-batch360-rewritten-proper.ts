import { AcademyArticle } from "@/types/academy";

export const batch360Articles: AcademyArticle[] = [
  {
    slug: "magic-number-and-sales-efficiency",
    title: "Magic Number and Sales Efficiency: Measuring Sales Productivity",
    description: "Master the Magic Number. Measure sales efficiency, optimize sales spend, forecast growth.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["Magic Number", "sales efficiency", "sales metrics", "growth efficiency ratio", "SaaS efficiency"],
    keyTakeaways: [
      "Magic Number: (Quarterly ARR increase) / (Sales & marketing spend from prior quarter). Target: >0.5 (every £1 spent yields >£0.5 ARR), excellent >1.0, exceptional >1.5. Example: £100K new ARR in Q2, spent £200K on sales/marketing in Q1 = 0.5 (at target). Cost: Tracking S&M spend carefully. ROI: Understand if sales team is efficient (hit targets but wasteful = bad Magic Number).",
      "Calculation: (Q2 ARR - Q1 ARR) / Q1 S&M spend. This shows the 1-quarter lag (Q1 spend drives Q2 sales). Track monthly too (30-day lag). Example: Spend £50K, acquire 10 customers averaging £5K = 1.0 Magic Number (excellent). Compare across periods (Q1 = 0.5, Q2 = 0.7, Q3 = 0.9 = improving!).",
      "Interpretation: <0.5 bad (spend too much for growth), 0.5-1.0 good (efficient), >1.0 excellent (every sales £ multiplies to >1.0 growth). Declining Magic Number (Q1 = 0.8, Q2 = 0.6) = red flag (market saturation, cost inflation, or declining conversion). Cost: Quarterly review. ROI: High (understand if spending on sales is paying off)."
    ],
    content: [
      {
        heading: "Tracking Sales Efficiency with Magic Number",
        body: `Measuring the return on sales and marketing investments.

**Magic Number definition and fundamentals**

What is Magic Number:
- A metric for sales efficiency
- Shows how much ARR is generated per £1 of sales/marketing spend
- Quarterly metric (quarterly ARR growth ÷ prior quarter S&M spend)

Why it matters:
- Validates sales team spending (are we efficient?)
- Forecasts future growth (if Magic Number = 1.0, spend £1M → £1M ARR next quarter)
- Identifies trends (Magic Number declining = problem)
- Compares across companies (benchmark against competitors)

Formula:

Magic Number = (Current quarter ARR - Prior quarter ARR) / Prior quarter S&M spend

Example:

Q1:
- ARR: £500K
- S&M spend: £100K

Q2:
- ARR: £550K (£50K increase)
- S&M spend: £100K

Magic Number = (£550K - £500K) / £100K = 0.5

Interpretation:
- For every £1 spent on sales/marketing, gained £0.50 ARR
- Meets target (0.5 is minimum), but not exceptional

**Magic Number benchmarks**

Benchmark by efficiency level:

| Magic Number | Interpretation | Status |
|---|---|---|
| <0.3 | Very inefficient | Poor (spending too much) |
| 0.3-0.5 | Inefficient | Below target |
| 0.5-0.75 | Acceptable | At minimum target |
| 0.75-1.0 | Good | Efficient |
| 1.0-1.5 | Excellent | Very efficient |
| >1.5 | Exceptional | Remarkable (rare) |

Context by stage:

Early stage (Series A):
- Target: 0.5-1.0 (spending on growth, still building efficiency)
- Reality: Often 0.3-0.7 (investing heavily in sales motion)

Growth stage (Series B):
- Target: 0.75-1.5 (more mature, proven sales motion)
- Reality: Often 0.5-1.0 (hiring sales team, scaling what works)

Mature stage (Series C+):
- Target: 1.0+ (optimized, efficient sales machine)
- Reality: Often 0.75-1.2 (large team, harder to improve)

Rule of 40 connection:

Magic Number connects to Rule of 40:
- High Magic Number (>1.0) + high growth can sustain Rule of 40
- Low Magic Number (<0.5) requires efficiency gains to hit Rule of 40

Example:

Company A:
- Magic Number: 1.2
- Can afford to spend aggressively on sales
- If £1M S&M spend → £1.2M new ARR
- Sustainable growth driver

Company B:
- Magic Number: 0.3
- Inefficient (spend £1M → £0.3M new ARR)
- Need to reduce spend or improve efficiency

**Calculating Magic Number correctly**

Data needed:

1. ARR at start of quarter (Q1 end)
2. ARR at end of quarter (Q2 end)
3. S&M spend in prior quarter (Q1)

Example company:

Q1 ARR: £400K
Q2 ARR: £450K
Q1 S&M spend: £150K

Magic Number = (£450K - £400K) / £150K = 0.33

Timing and lag:

Why prior quarter S&M spend?
- Sales cycles are 60-90 days typical
- Marketing campaigns take 4-8 weeks
- So Q1 spend drives Q2 results (1 quarter lag)

Visualized:

Q1:
- Sales hires 5 people
- Marketing launches campaign
- Spend: £150K

Q2 (results):
- Previous Q1 investments pay off
- New customers close
- ARR growth: £50K

Magic Number = £50K / £150K = 0.33

Monthly variant:

Some companies calculate monthly (30-day lag):

Magic Number (monthly) = (This month ARR - Last month ARR) / (Last month S&M spend)

Example:

January ARR: £100K
February ARR: £110K
January S&M spend: £50K

Magic Number = £10K / £50K = 0.2 (monthly)

Annualized: 0.2 × 12 = 2.4 (annual) [Note: doesn't work this way, use quarterly for smoothing]

**Magic Number drivers and improvement**

What drives Magic Number up (improvement):

Driver 1: Increase conversion rates
- Current: 10% of prospects convert (100 demos → 10 customers)
- Improve: Landing page, sales training, product improvements
- New: 15% conversion (100 demos → 15 customers)
- Impact: More customers from same spend, Magic Number increases

Driver 2: Increase deal size
- Current: Average deal £10K
- Improve: Upsell, land enterprise customers, bundling
- New: Average deal £15K
- Impact: More ARR from same customer, Magic Number increases

Driver 3: Reduce sales friction
- Current: Sales cycle 90 days (slow close)
- Improve: Streamline process, faster contracting, faster demos
- New: Sales cycle 60 days (30% faster)
- Impact: Close more deals per quarter, Magic Number increases

Driver 4: Improve sales productivity
- Current: Each salesperson closes £50K ARR per quarter
- Improve: Training, tools, playbooks, support
- New: Each salesperson closes £75K ARR per quarter
- Impact: Same spend, more output, Magic Number increases

Driver 5: Shift to lower-cost channels
- Current: £150K S&M spend, primarily direct sales (expensive)
- Improve: Add self-serve, product-led growth, content marketing
- New: £100K spend achieves same results
- Impact: Same output, lower spend, Magic Number increases

**Interpreting Magic Number trends**

Increasing Magic Number (good):

Q1: 0.5
Q2: 0.6
Q3: 0.75
Q4: 0.9

Interpretation:
- Sales team getting more efficient
- Playbooks improving
- Product-market fit strengthening
- Trend is positive

Action: Continue investing in sales

Declining Magic Number (warning):

Q1: 1.2
Q2: 1.0
Q3: 0.8
Q4: 0.6

Interpretation:
- Sales team becoming less efficient
- Possible causes: (1) Market saturation (harder to find customers), (2) Cost inflation (hiring more expensive), (3) Conversion declining (product issue or competition), (4) Large team additions (ramp-up period)
- Trend is negative

Action: Investigate root cause

Common root causes:

Cause 1: Market saturation
- Symptom: Sales cycle lengthening (takes longer to close)
- Solution: Enter new market, new product line, expand internationally

Cause 2: Conversion decline
- Symptom: Demo-to-close rate declining
- Solution: Product improvements, sales training, competitive positioning

Cause 3: Cost inflation
- Symptom: Hiring costs increasing, marketing CPC increasing
- Solution: Improve recruiting, optimize marketing, shift channels

Cause 4: Large hiring cohort
- Symptom: New salespeople added (ramp-up period is lower productivity)
- Solution: Normal, expect recovery in 2-3 quarters

**Using Magic Number for forecasting**

Forecast future growth:

If Magic Number = 0.75 and planning to spend £200K on S&M next quarter:

Predicted ARR increase = £200K × 0.75 = £150K new ARR

If current ARR is £500K:
Projected Q3 ARR = £500K + £150K = £650K

Forecast revenue impact:

If ARR projected at £650K and average deal is 1-year contract:
Revenue forecast for Q3 = £650K (plus prior contracts)

But for annual revenue forecast:
Year 1: (£500K + £650K) / 2 × 4 quarters = ~£2.3M

Multi-quarter forecast:

If improving Magic Number (0.5 → 0.75 → 1.0):

Q1 ARR: £400K, S&M spend: £150K
Q2 projected: £400K + (£150K × 0.5) = £475K

Q2 actual: £475K, S&M spend: £150K (same)
Q3 projected: £475K + (£150K × 0.75) = £587.5K

Q3 actual: £587.5K, S&M spend: £150K (same)
Q4 projected: £587.5K + (£150K × 1.0) = £737.5K

This shows compound impact of improving efficiency

**Magic Number vs other sales metrics**

Magic Number vs CAC payback:

CAC Payback Period:
- Average deal size / (Monthly sales & marketing spend / customers acquired)
- Measure: How many months to recover customer acquisition cost
- Example: Average deal £10K, 10 customers/month from £50K spend = £5K CAC
- CAC payback: £5K / (£10K/12 months) = 6 months

Magic Number:
- Same inputs, different focus
- Shows efficiency ratio (how much revenue per £1 spent)
- Example: £50K spend → 10 customers × £10K = £100K new ARR
- Magic Number: £100K / £50K = 2.0 (annualized)

Connection:
- High Magic Number (>1.0) generally means good CAC payback
- Low Magic Number (<0.5) means long CAC payback

**Common Magic Number mistakes**

Mistake 1: Include non-S&M spend
- Problem: Include product, engineering in "sales & marketing" cost
- Fix: Only S&M spend (salaries, commissions, marketing, tools)
- Impact: Accurate metric

Mistake 2: Wrong timing (same-quarter)
- Problem: Calculate (Q2 ARR - Q1 ARR) / Q2 S&M spend (same quarter)
- Fix: Use prior quarter S&M spend (1-quarter lag)
- Impact: Accurate lag correlation

Mistake 3: Ignore seasonal variation
- Problem: Q4 is busy season (higher results), compare to Q3 (slower)
- Fix: Compare YoY (Q4 this year vs Q4 last year)
- Impact: Fair comparison

Mistake 4: Don't act on declining trend
- Problem: Magic Number declining for 3 quarters, no action
- Fix: Investigate (market saturation? Cost inflation? Product issue?)
- Impact: Address problem early

Mistake 5: Only track quarterly
- Problem: Quarterly is too slow to catch trends
- Fix: Calculate monthly too (rolling 3-month for smoothing)
- Impact: Earlier intervention

`
      }
    ],
    relatedSlugs: ["unit-economics-ltv-and-cac-payback", "customer-acquisition-strategy-and-marketing-roi", "metrics-dashboard-design-kpi-tracking", "profitability-analysis-and-operating-leverage", "financial-planning-and-budgeting"],
    faq: [
      { q: "What is Magic Number and how do I calculate it?", a: "Magic Number = (Current quarter ARR - Prior quarter ARR) / Prior quarter S&M spend. Example: £100K new ARR / £200K spend = 0.5 (for every £1 spent, £0.50 ARR growth). Target: >0.5 acceptable, 0.75-1.0 good, >1.0 excellent. Use 1-quarter lag (Q1 spend drives Q2 results)." },
      { q: "What are good Magic Number benchmarks?", a: "Benchmarks: <0.3 poor, 0.3-0.5 below target, 0.5-0.75 acceptable, 0.75-1.0 good, 1.0-1.5 excellent, >1.5 exceptional. Early stage targets 0.5-1.0 (investing), growth stage 0.75-1.5 (scaling), mature 1.0+ (optimized). Declining Magic Number = red flag (investigate root cause)." },
      { q: "What drives Magic Number up or down?", a: "Improves: Better conversion rates, higher deal sizes, shorter sales cycles, improved sales productivity, lower-cost channels. Declines: Market saturation, conversion decline, cost inflation, large new team (ramp period). Monitor quarterly (or monthly rolling). If declining for 2+ quarters, investigate root cause (saturation, product, competition, hiring)." }
    ],
    videoUrl: ""
  }
];

export default batch360Articles;