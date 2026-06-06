import { AcademyArticle } from "@/types/academy";

export const batch50Articles: AcademyArticle[] = [
  {
    slug: "marketing-roi-and-attribution",
    title: "Marketing ROI and Attribution: Measuring Campaign Performance and Impact",
    description: "Master marketing ROI measurement and multi-touch attribution. Track which campaigns drive revenue, optimize spend, and prove marketing's business value.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "marketing ROI",
      "attribution",
      "marketing analytics",
      "campaign performance",
      "marketing metrics",
      "cost per lead",
      "conversion tracking",
      "marketing spend",
      "revenue attribution",
      "marketing efficiency"
    ],
    keyTakeaways: [
      "Marketing ROI = (Revenue attributed to marketing - Marketing spend) ÷ Marketing spend; most SaaS target 3-5x ROI (spend £1M to generate £4-5M revenue); anything below 3x is questioned by CFO/board",
      "Attribution models vary: first-touch (credit initial touchpoint), last-touch (credit deal-closer), linear (equal credit), time-decay (credit closer to conversion); most SaaS use multi-touch with 40% credit to first-touch, 40% last-touch, 20% middle touches",
      "Marketing efficiency ratio = New ARR ÷ Marketing spend; healthy ratio is 3-5x (earn £3-5 per £1 spent); ratios below 2x trigger cost-reduction questions; above 5x suggests underinvestment in marketing"
    ],
    content: [
      {
        heading: "Marketing ROI Calculation",
        body: `Marketing ROI measures whether marketing spending generates profitable revenue growth.

Formula: ROI = (Revenue attributed to marketing - Marketing spend) ÷ Marketing spend

Example for £5M ARR SaaS:

Annual marketing spend: £1.5M
- Content marketing: £300K
- Paid advertising (Google, LinkedIn): £600K
- Events: £300K
- Marketing tools, software: £200K
- Marketing team (3 people): £200K

Revenue attributed to marketing: £4.5M
- New customer revenue: £3M (from marketing-sourced leads)
- Expansion revenue: £1.5M (from existing customers, partially attributed to marketing content)

Marketing ROI = (£4.5M - £1.5M) ÷ £1.5M = 2.0 (or 200%)

Interpretation: For every £1 spent on marketing, company generates £2 in profit (£3 gross revenue, £1 cost).

Is this good? For SaaS:
- <2x ROI: Poor (CFO questions if marketing spend justified)
- 2-3x ROI: Acceptable (break-even to modest profit)
- 3-5x ROI: Healthy (strong growth, reinvest to expand)
- >5x ROI: Excellent (underinvested, increase spend to capture more market)

Most SaaS targets 3-5x marketing ROI.

**Cost Per Lead and Cost Per Customer Acquired**

Cost per lead (CPL): Total marketing spend ÷ Total qualified leads generated

Example:
- Marketing spend: £1.5M
- Qualified leads: 3,000
- CPL: £1.5M ÷ 3,000 = £500 per lead

Cost per customer acquired: Marketing spend ÷ Customers acquired from marketing

Example:
- Marketing spend: £1.5M
- Customers from marketing: 150
- Cost per customer: £1.5M ÷ 150 = £10K per customer

Note: This is different from CAC (which includes sales spend). This is marketing-influenced CAC.

**Cohort Analysis by Marketing Channel**

Track which marketing channels drive best customers:

| Channel | CPL | Conversion rate | Cost per customer | 12-month retention | LTV |
|---------|-----|----------|----------|----------|----------|
| Content (organic) | £50 | 15% | £333 | 85% | £85K |
| Paid search | £200 | 8% | £2,500 | 75% | £70K |
| LinkedIn ads | £150 | 10% | £1,500 | 80% | £78K |
| Events | £300 | 12% | £2,500 | 82% | £82K |
| Referrals | £0 | 20% | £0 | 90% | £95K |

Insights:
- Content drives highest-quality customers (lowest cost, highest retention)
- Paid search most expensive but still profitable
- Referrals have best LTV but limited volume
- Invest more in content, maintain paid search, grow referrals

**Marketing Efficiency Ratio**

Marketing efficiency ratio = New ARR from marketing ÷ Marketing spend

Example:

Marketing spend: £1.5M
New ARR attributed to marketing: £4.5M
Efficiency ratio: £4.5M ÷ £1.5M = 3.0

Interpretation: For every £1 spent, company generates £3 in new ARR.

Benchmarks:
- <2x: Low efficiency (reduce spend or improve conversion)
- 2-3x: Acceptable (but optimization needed)
- 3-5x: Healthy (continue current spend, optimize incrementally)
- >5x: Excellent (increase budget to capture more market)

**Attribution Models**

How do you credit marketing when customer touches multiple channels before buying?

Scenario: Enterprise customer journey
- Month 1: Reads blog post (organic content)
- Month 2: Sees LinkedIn ad (paid)
- Month 3: Attends webinar (event)
- Month 4: Speaks to sales rep (direct)
- Month 5: Closes deal (£100K ACV)

Question: Which channel deserves credit?

Attribution models:

1. **First-touch**: Blog post gets 100% credit
   - Assumes blog post was critical first impression
   - Good for: Understanding customer awareness

2. **Last-touch**: Sales rep gets 100% credit
   - Assumes direct conversation closed deal
   - Problem: Undervalues marketing efforts
   - Only 20% of companies use this (it's unfair to marketing)

3. **Linear**: All channels share equally
   - Blog (25%), LinkedIn (25%), Webinar (25%), Sales (25%)
   - Each channel gets £25K credit
   - Fair, but assumes equal importance (wrong assumption)

4. **Time-decay**: Recent channels get more credit
   - Blog (10%), LinkedIn (15%), Webinar (25%), Sales (50%)
   - Assumes customer ready to buy = sales/event critical
   - Most realistic for B2B SaaS

5. **Position-based (most common in SaaS)**:
   - First-touch: 40% credit
   - Middle touches: 20% credit
   - Last-touch: 40% credit
   - Applied: Blog (40%), LinkedIn (10%), Webinar (10%), Sales (40%)
   - Rationale: Blog started interest, sales closed, middle touches helped nurture

Most SaaS use position-based attribution because it balances:
- Credit to awareness (first touch)
- Credit to decision (last touch)
- Acknowledgment of nurturing (middle touches)

**Multi-Channel ROI**

Calculate ROI by channel to optimize spend allocation:

| Channel | Spend | New ARR | Gross Margin | Net contribution | ROI |
|---------|-------|---------|----------|----------|----------|
| Content | £300K | £1.5M | £1.05M | £750K | 2.5x |
| Paid search | £600K | £2.0M | £1.4M | £800K | 1.33x |
| LinkedIn ads | £400K | £1.5M | £1.05M | £650K | 1.625x |
| Events | £200K | £0.5M | £0.35M | £150K | 0.75x |
| Total | £1.5M | £5.5M | £3.85M | £2.35M | 1.57x |

Insights:
- Content has best ROI (2.5x), invest more
- Paid search profitable but declining (mature channel)
- LinkedIn ads decent ROI, room to scale
- Events not profitable (reconsider, reduce, or improve targeting)

Action: Shift £200K from events to content (higher ROI) and £100K to LinkedIn ads (scaling).

New allocation:
- Content: £500K (was £300K)
- Paid search: £600K (unchanged)
- LinkedIn ads: £500K (was £400K)
- Events: £0K (eliminated)
- Total: Still £1.5M, but optimized for ROI

**Tracking Marketing ROI in Practice**

Implement systems to track:

1. **Lead source attribution**: Every lead should be tagged with source
   - Organic (content)
   - Paid (advertising)
   - Direct (referral)
   - Event
   - Inbound (demo request)

2. **Campaign tracking**: Each campaign gets unique identifier (UTM parameters)
   - utm_source=linkedin_ad_aug2024
   - utm_campaign=product_launch
   - Allows granular ROI by campaign

3. **Revenue attribution**: Link each customer back to original lead source
   - CRM integration: Lead source → Customer source → Revenue
   - Example: Salesforce records lead source, tracks to closed deal

4. **Cohort analysis**: Group customers by acquisition channel, track LTV
   - Content customers: 85% 12-month retention
   - Paid customers: 75% 12-month retention
   - Content customers are stickier

**Common Marketing ROI Mistakes**

1. **Double-counting**: Attributing same revenue to multiple channels
   - Example: Blog gets credit AND LinkedIn gets credit for same customer
   - Use consistent attribution model (first-touch, last-touch, or position-based)

2. **Ignoring churn**: ROI based on new ARR, not net ARR
   - Better measure: (New ARR - Churned ARR) ÷ Marketing spend
   - Accounts for customer quality (high-churn customers are less valuable)

3. **Long sales cycles ignored**: B2B customers take 6+ months to close
   - November marketing spend closes in February
   - Attribution needs time lag (track by cohort, not calendar month)

4. **Indirect revenue ignored**: Marketing helps renewals, not just new customers
   - Content helps customers adopt product more
   - Leads to higher expansion revenue
   - Should be attributed to marketing (partial credit)

5. **Comparing across channels unfairly**: Paid search is last-touch (closes deals), content is first-touch (builds awareness)
   - Don't compare CPL (cost per lead) across channels
   - Use consistent ROI model

**Optimizing Marketing ROI**

Levers to improve ROI:

Lever 1: Increase conversion rate
- From: 2% of leads → customers
- To: 3% (50% improvement)
- Same spend, 50% more revenue = 50% higher ROI

Lever 2: Reduce cost per lead
- From: £500 CPL
- To: £400 CPL (20% reduction)
- Same conversion, 20% lower cost = 20% higher ROI

Lever 3: Increase customer LTV
- From: 3-year average LTV of £105K
- To: £140K (better retention, expansion)
- Same cost, higher LTV = better ROI long-term

Most impactful: Improve LTV (retention + expansion). This compounds over time.

**Marketing ROI Reporting**

For board/investors, report:

- Marketing spend: Total budget (£1.5M)
- New ARR: Total revenue attributed to marketing (£4.5M)
- Marketing efficiency: New ARR ÷ spend (3.0x)
- ROI: (Revenue - spend) ÷ spend (2.0x)
- CAC payback: How fast does customer pay back CAC (12-18 months)
- Channel breakdown: Which channels drive best ROI

Avoid: Vanity metrics (impressions, clicks, engagement) unless tied to revenue.

Marketing ROI is the language CFOs and boards understand. Master it, and marketing earns credibility for budget allocation.
`
      }
    ],
    relatedSlugs: [
      "demand-generation-roi",
      "customer-acquisition-cost-optimization",
      "sales-efficiency-magic-number",
      "revenue-operations-revops-strategy",
      "data-driven-decision-making-analytics"
    ],
    faq: [
      {
        q: "What's a good marketing ROI?",
        a: "3-5x is healthy for SaaS. Below 2x is questioned. Above 5x suggests underinvestment. Varies by stage: early-stage more aggressive (2x acceptable), mature (3-5x expected)."
      },
      {
        q: "How do I attribute revenue with long sales cycles?",
        a: "Use cohort analysis: group customers by acquisition month, track to close month (4-6 month lag common for B2B). Compare Dec acquisition cohort to April closed revenue, not calendar alignment."
      },
      {
        q: "Should I include brand/awareness spending in ROI?",
        a: "Yes, but separately. Brand spending has long ROI tail (builds over years). Calculate direct ROI for campaigns, estimate indirect lift for brand (hard to measure precisely)."
      },
      {
        q: "What if multiple channels contribute to a deal?",
        a: "Use multi-touch attribution. Position-based (40% first, 40% last, 20% middle) is industry standard. CRM tools can automate this."
      }
    ],
    videoUrl: ""
  },
  {
    slug: "sales-pipeline-health-and-forecasting",
    title: "Sales Pipeline Health and Forecasting: Predicting Revenue with Confidence",
    description: "Build healthy sales pipelines and accurate revenue forecasts. Track pipeline stages, win rates, and cycle times to predict quarterly revenue.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "sales pipeline",
      "pipeline health",
      "sales forecast",
      "revenue forecast",
      "win rate",
      "sales cycle",
      "pipeline stages",
      "pipeline management",
      "forecast accuracy",
      "sales metrics"
    ],
    keyTakeaways: [
      "Healthy pipeline = 3x quarterly revenue target in qualified opportunities; if Q1 target is £1M, pipeline should have £3M in opportunities; 3x ratio accounts for average 33% win rate (£3M × 33% = £1M forecast)",
      "Sales cycle length varies by segment: SMB 6-8 weeks, mid-market 8-12 weeks, enterprise 16-26 weeks; forecast should age pipeline (only count deals close to close date); deals in early stages are speculative",
      "Win rate trending matters: If win rate drops from 40% to 30%, that's a red flag (loss of differentiation, new competition, sales enablement issue); track by rep, by product, by segment to isolate causes"
    ],
    content: [
      {
        heading: "Sales Pipeline Fundamentals",
        body: `Sales pipeline is the lifeblood of SaaS revenue forecasting.

Pipeline is inventory of potential deals at different stages.

Stages typically:
1. **Prospecting**: Sales rep identifies potential customer (no contact yet or first touch)
2. **Qualified**: Customer agreed to talk, has budget, is in buying cycle
3. **Discovery**: Sales rep understands customer's problem
4. **Proposal**: Sales rep sent proposal/demo
5. **Negotiation**: Customer is evaluating, discussing pricing/terms
6. **Closed Won**: Customer signed (revenue recognized)
7. **Closed Lost**: Customer declined or went to competitor

Pipeline value at each stage:

| Stage | Count | Avg ACV | Stage value | Win rate* | Adjusted value |
|-------|-------|---------|----------|----------|----------|
| Prospecting | 50 | £50K | £2.5M | 5% | £125K |
| Qualified | 30 | £50K | £1.5M | 20% | £300K |
| Discovery | 20 | £50K | £1.0M | 35% | £350K |
| Proposal | 10 | £50K | £500K | 50% | £250K |
| Negotiation | 5 | £50K | £250K | 70% | £175K |
| Total | 115 | - | £5.75M | - | £1.2M |

*Win rate = % of deals in this stage that eventually close

Weighted pipeline value = Sum of (Stage value × Win rate) = £1.2M

If quarterly revenue target is £1M, forecast is £1.2M (109% of target, comfortable).

If only looking at Negotiation stage (most confident), forecast would be £175K (only 17% of target, risky).

This is why you need multiple stages: early stages build confidence in future revenue.

**Pipeline Health Metrics**

1. **Pipeline ratio**: Total pipeline value ÷ Quarterly revenue target
   - Healthy ratio: 2.5-3.5x
   - If ratio <2x: Pipeline under-filled (won't hit target)
   - If ratio >4x: Pipeline over-stuffed (deals not moving, or inflated sizes)

Example: Q1 target £1M
- Pipeline should be £2.5M-3.5M
- If pipeline £2M: Risky (likely to miss)
- If pipeline £5M: Either great opportunity or deals are stalled

2. **Win rate**: % of deals that close
   - Overall win rate should be 25-40%
   - If <20%: Sales productivity issue or sales quality issue
   - If >50%: Pipeline might be inflated (reps are logging deals they shouldn't)

3. **Sales cycle length**: Average days from prospecting to closed
   - SMB: 45-60 days
   - Mid-market: 60-90 days
   - Enterprise: 120-180 days
   - Longer cycles require larger pipeline (more deals in flight)

4. **Pipeline coverage by stage**: What % of opportunities are in each stage?
   - Healthy: 30% prospecting/qualified, 30% discovery, 20% proposal, 20% negotiation+
   - Skewed toward early stages: Pipeline isn't progressing
   - Skewed toward late stages: Not enough prospecting

**Forecasting Revenue**

Method 1: Weighted pipeline approach

Total pipeline value × Blended win rate = Revenue forecast

Example:
- Total pipeline: £5.75M
- Blended win rate: 33% (1.2M ÷ 5.75M)
- Forecast: £5.75M × 33% = £1.9M

This is optimistic. Better approach:

Method 2: Stage-based forecast

Forecast = Sum of (Stage value × Stage-specific win rate)

| Stage | Value | Win rate | Forecast |
|-------|-------|----------|----------|
| Prospecting | £2.5M | 5% | £125K |
| Qualified | £1.5M | 20% | £300K |
| Discovery | £1.0M | 35% | £350K |
| Proposal | £500K | 50% | £250K |
| Negotiation | £250K | 70% | £175K |
| **Total** | **£5.75M** | - | **£1.2M** |

More conservative and realistic.

Method 3: Rep-specific forecast

Get each rep's forecast separately, aggregate:

Rep 1 (enterprise, long sales cycles):
- 2 deals in negotiation: 1 × £500K + 1 × £300K = £800K
- Win rate for negotiation deals: 70% = £560K forecast
- 1 deal in proposal: £400K × 50% = £200K
- Rep 1 forecast: £760K

Rep 2 (SMB, short sales cycles):
- 4 deals in proposal: 4 × £50K × 50% = £100K
- 6 deals in discovery: 6 × £50K × 35% = £105K
- 8 deals in qualified: 8 × £50K × 20% = £80K
- Rep 2 forecast: £285K

Total forecast: £760K + £285K = £1.045M

**Forecast Accuracy Measurement**

Compare forecast vs. actual revenue:

| Quarter | Forecast | Actual | Accuracy |
|---------|----------|--------|----------|
| Q1 2024 | £1.2M | £1.05M | 88% (underperformed by 12%) |
| Q2 2024 | £1.4M | £1.55M | 110% (outperformed by 10%) |
| Q3 2024 | £1.3M | £1.25M | 96% (underperformed by 4%) |
| Q4 2024 | £1.5M | £1.48M | 99% (nearly perfect) |
| Average accuracy | - | - | 98% |

Good forecasting: ±10% of target.
Bad forecasting: >20% variance.

If accuracy is poor (e.g., 70% or 130%), reps are either:
- Under-reporting deals (forecast too low, actual high)
- Over-reporting deals (forecast too high, actual low)
- Sandbagging (deliberately low forecast to beat target)

Address by:
- Sales training: Teach reps how to qualify deals properly
- CRM discipline: Require stage updates, deal documentation
- Weekly pipeline reviews: Managers challenge forecast vs. pipeline activity
- Compensation alignment: Bonus on accuracy, not just on closes

**Red Flags in Sales Pipeline**

1. **Stalled deals**: Deals stuck in same stage for 2+ months
   - Indicates: Customer not moving (may not be ready), or sales rep not pushing
   - Action: Manager review, customer call, or move to closed lost

2. **Dropping win rate**: Win rate was 40%, now 30%
   - Indicates: Market shift, new competitor, sales quality declining
   - Action: Investigate customer feedback, competitive analysis, sales training

3. **Inflation**: Pipeline value keeps growing, but revenue flat
   - Indicates: Reps adding low-probability deals, inflating sizes
   - Action: CRM audit, enforce deal qualification criteria

4. **Pipeline gap**: Pipeline too small relative to target
   - Indicates: Not enough prospecting, sales productivity down
   - Action: Hiring, process improvement, lead generation

5. **Uneven distribution**: All deals with 1 rep, none with others
   - Indicates: Rep hoarding deals, or others underperforming
   - Action: Territory realignment, underperforming rep coaching

**Managing Pipeline Weekly**

Sales managers should review pipeline weekly:

- **Deal progression**: Did deals move stages? If not, why?
- **New deals added**: How many new deals in prospecting? (Feed pipeline)
- **Deal health**: Any at-risk deals? Any about to close?
- **Win rate trend**: Is it holding steady or declining?
- **Forecast**: Adjust forecast based on new information

Weekly format:

| Rep | Pipeline Value | Stage breakdown | Forecast | Notes |
|-----|-----------------|----------|----------|--------|
| Rep 1 | £2M | £500K prospect, £700K qualified, £800K proposal | £800K | Strong quarter, deal closing next week |
| Rep 2 | £1M | £300K prospect, £400K qualified, £300K negotiation | £500K | Pipeline light, need prospecting activity |
| Rep 3 | £1.5M | £600K prospect, £500K qualified, £400K proposal | £450K | Average, on track |
| **Total** | **£4.5M** | - | **£1.75M** | Q target £1.5M, comfortable |

This ritual keeps pipeline health in focus.

**Sales Forecasting Models**

Advanced teams build forecasting models:

Model 1: Historical win rates by rep
- Rep 1 historically closes 45% of proposals
- Rep 1 has £1M in proposal stage
- Forecast: £1M × 45% = £450K

Model 2: Sales cycle by segment
- Enterprise deals: 150-day cycle on average
- If deal was added to pipeline 60 days ago, probability of closing this quarter = 30%
- Adjust forecast accordingly

Model 3: Customer fit score
- Companies with annual budgets >£100K: 50% close rate
- Companies with <£50K budget: 20% close rate
- Weight forecast by customer budget

Model 4: Cohort analysis
- Q1 2023 cohort closed 35% of pipeline value
- Q2 2023 cohort closed 32%
- Average: 33.5%
- Use 33.5% to forecast current pipeline

Most SaaS use simple stage-based forecast (Method 2 above) with manual adjustments.

**Forecast Accuracy as Competitive Advantage**

Companies that forecast well have advantages:
- Accurate financial guidance (investors trust company)
- Confident planning (can commit to expenses)
- Early warning signs (can course-correct quickly)
- Better cash management (know when cash arrives)

Companies that forecast poorly:
- Miss guidance (investor confidence drops)
- Surprise layoffs (didn't see revenue decline)
- Cash crunches (can't plan spend)

Pipeline health and forecasting accuracy is often the difference between funded growth and struggling for capital.
`
      }
    ],
    relatedSlugs: [
      "sales-efficiency-magic-number",
      "revenue-operations-revops-strategy",
      "forecasting-accuracy-planning",
      "sales-compensation-commissions",
      "enterprise-sales-strategy-tactics"
    ],
    faq: [
      {
        q: "What's the right pipeline ratio?",
        a: "2.5-3.5x quarterly revenue target. Below 2x = risky (likely to miss). Above 4x = either great (scaling) or inflated (deals not real)."
      },
      {
        q: "How long should I keep deals in pipeline before marking lost?",
        a: "Remove if no activity in 60 days. If deal hasn't moved in 60+ days, it's likely dead. Mark as closed lost to maintain pipeline hygiene."
      },
      {
        q: "What win rate should I target?",
        a: "25-40% is typical for SaaS. <20% indicates sales productivity or messaging issues. >50% suggests pipeline inflated."
      },
      {
        q: "How accurate should my forecast be?",
        a: "Target ±10% of actual. If you forecast £1M, actual should be £900K-1.1M. Use weekly reviews to adjust forecast as deals progress."
      }
    ],
    videoUrl: ""
  }
];

export default batch50Articles;
