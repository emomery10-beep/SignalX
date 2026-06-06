import { AcademyArticle } from "@/types/academy";

export const batch82Articles: AcademyArticle[] = [
  {
    slug: "data-driven-decision-making-analytics",
    title: "Data-Driven Decision Making and Analytics: Using Data to Drive Business Strategy",
    description: "Make decisions based on data, not intuition. Understand how to analyze data and avoid common analytics mistakes.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 6,
    keywords: [
      "data-driven decisions",
      "analytics",
      "data analysis",
      "business intelligence",
      "decision making",
      "metrics",
      "insights",
      "A/B testing",
      "experimentation",
      "hypothesis testing"
    ],
    keyTakeaways: [
      "Data-driven decision = decision backed by data analysis; process: form hypothesis (e.g., 'raising prices will increase revenue'), test with data (A/B test: 10% of users see higher price), measure impact (compare revenue), decide; avoids gut-feel decisions that fail half the time; most decisions are reversible (low cost), test both and measure before committing to big decisions",
      "Common analytics mistakes: correlation ≠ causation (high churn in Q4 doesn't mean seasonal, might be competition), vanity metrics (growth looks good but unprofitable), cherry-picking data (showing only what supports hypothesis), ignoring base rates (conversion 5% looks great until you realize it's 50% below benchmark), small sample size (1 customer churned isn't a trend)",
      "Decision framework: (1) Define what success looks like (metric, threshold), (2) form hypothesis ('X will improve Y by Z%'), (3) test (A/B test or natural experiment), (4) measure (compare metric between test and control), (5) decide (if improvement significant, roll out; otherwise iterate); most hypotheses are wrong (that's OK, you learn from failure)"
    ],
    content: [
      {
        heading: "What Is Data-Driven Decision Making?",
        body: `Data-driven decisions are decisions backed by analysis, not intuition.

**Intuition vs. Data**

Intuition-driven decision:
- "I think customers want feature X"
- Build feature X
- Customers don't use it
- Wasted 3 months

Data-driven decision:
- Hypothesis: "If we add feature X, usage will increase 20%"
- Test: Build feature for 10% of users
- Measure: Usage +8% (less than hoped, but validated)
- Decide: Feature helps, but not as much as expected. Should we build it anyway?

Data-driven approach reduces risk (test before full commitment).

**Decision Types**

1. **Reversible decisions** (low cost, can undo)
   - Pricing change
   - Feature addition
   - Marketing campaign
   - Best approach: Test small, measure, decide

2. **Irreversible decisions** (high cost, can't easily undo)
   - Hiring/firing
   - Major product pivot
   - Enter new market
   - Best approach: Careful analysis, strong conviction

Most SaaS decisions are reversible (test and learn).

**Data-Driven Decision Process**

Step 1: **Form hypothesis**
- "If we [do X], then [metric] will [change]"
- Example: "If we raise prices 20%, monthly churn will increase 5%, but revenue will increase 14% (net positive)"

Step 2: **Design test**
- How will you test? (A/B test, natural experiment, pilot)
- How long? (usually 2-4 weeks to reach statistical significance)
- How many users? (need enough for statistical confidence)

Step 3: **Run test**
- 50% of new customers see old price (£200/month)
- 50% of new customers see new price (£240/month)
- Run for 4 weeks

Step 4: **Measure**
- Old price: 100 customers, 3% churn = 97 customers
- New price: 95 customers, 4% churn = 91 customers
- Difference: Price increased 20%, customers decreased 6% (vs. expected 0%)
- Revenue: (97 × £200) + (91 × £240) = £43,420 (vs. baseline £38,800)
- Net: 11% revenue increase, 6% customer decrease

Step 5: **Decide**
- Hypothesis partially validated (revenue up, but churn higher than expected)
- Decision: Rollout at new price but monitor churn carefully
- Learning: Price elasticity is 0.3 (10% price increase → 3% customer loss)

**The Scientific Method in Business**

Good data-driven decisions follow the scientific method:

1. **Hypothesis**: Testable prediction
   - Good: "Improving onboarding reduces churn by 10%"
   - Bad: "Onboarding is important" (vague, not testable)

2. **Null hypothesis**: Default (opposite of hypothesis)
   - If your hypothesis fails, null hypothesis is true
   - Null: "Onboarding doesn't affect churn"

3. **Test design**: How to prove/disprove hypothesis
   - Control group: Old onboarding (baseline)
   - Test group: New onboarding
   - Measure: Churn rate after 30 days

4. **Measurement**: Did hypothesis hold true?
   - Control: 5% churn
   - Test: 4.2% churn (0.8% improvement)
   - Is 0.8% difference significant? (run statistical test)

5. **Conclusion**: Hypothesis confirmed/rejected
   - If p-value <0.05: Statistically significant, rollout
   - If p-value >0.05: Not significant, reject hypothesis

This is how rigorous decisions are made.

**Common Analytics Mistakes**

Mistake 1: Correlation ≠ Causation

- Observation: High churn in Q4
- Wrong conclusion: "Q4 is bad seasonally"
- Correct analysis: What else changed in Q4? (competitors, pricing, product issue?)
- Example: Q4 churn high because you raised prices in October (causation), not because December is seasonal

Fix: Always ask "Why?" multiple times. Find root cause, not just correlation.

Mistake 2: Vanity metrics

- Metric: "We have 100K users!"
- Vanity: Growth looks good
- Reality: 90K are free tier (unmonetized), 10K paying (£500K ARR)
- Real metric: Paying customer growth (10K → 15K next quarter)

Fix: Focus on metrics that drive revenue/profitability, not just volume.

Mistake 3: Cherry-picking data

- Hypothesis: "Our pricing is good"
- Cherry-pick: Show months where churn was low
- Ignore: Months where churn was 10%+
- Biased conclusion: "Pricing is fine"

Fix: Show full data. Use averages/medians over longer periods.

Mistake 4: Small sample size

- "2 customers said they want feature X"
- Conclusion: Build feature X
- Reality: 2 customers ≠ trend
- Better: Survey 100 customers, ask what they want

Fix: Require minimum sample size (usually 30+ observations for significance).

Mistake 5: Ignoring base rates

- New feature: 5% of users tried it
- Conclusion: "Low adoption!"
- Reality: Base rate for new features is 3-5% (normal)
- Better comparison: 5% vs. benchmark 4% (actually good!)

Fix: Always compare to benchmark/historical baseline.

Mistake 6: P-hacking

- Run 20 different tests, one shows significant result
- Publish that one result (hide other 19)
- False conclusion: Effect is real (statistically)

Fix: Decide on test size before running test. Don't run until significance.

**Types of Tests**

1. **A/B test** (controlled experiment)
   - Gold standard for decisions
   - Example: 50% users see feature A, 50% see feature B
   - Measure: Which has better engagement?
   - Strength: Eliminates confounding variables
   - Weakness: Can take weeks to reach significance

2. **Natural experiment** (observational)
   - Look at customers in different segments
   - Example: Enterprise customers have lower churn than SMB
   - Measure: What's the difference?
   - Strength: Fast (no waiting for test)
   - Weakness: Can't control for other variables (correlation)

3. **Cohort analysis** (time-based comparison)
   - Compare cohorts acquired in different periods
   - Example: January 2024 cohort vs. January 2025 cohort
   - Measure: Which has better retention?
   - Strength: Shows product improvement over time
   - Weakness: Can't isolate what changed

4. **Survey** (ask customers)
   - Ask customers what they want/think
   - Example: "Would you pay £300/month?"
   - Measure: % who say yes
   - Strength: Direct feedback
   - Weakness: People say yes but don't buy (intention ≠ action)

Most important: Match test type to decision.
- High-stakes decision: Use A/B test (most rigorous)
- Quick decision: Use cohort analysis or natural experiment
- Learning: Use survey + data combined
`
      },
      {
        heading: "Building an Analytical Culture",
        body: `Data-driven culture means everyone makes decisions with data.

**Characteristics of data-driven culture:**

1. **Accessible data**
   - All teams have access to dashboards
   - Data is shared, not hoarded
   - Weekly company meeting: Review metrics together

2. **Hypothesis-first meetings**
   - Before deciding: "What's your hypothesis?"
   - Before claiming success: "What's the evidence?"
   - "I think" becomes "Data shows"

3. **Experimentation norm**
   - Testing is the default
   - Failures are learning, not punishment
   - 50-70% of experiments fail (that's normal)

4. **Metrics clarity**
   - Everyone knows the OKRs (objectives/key results)
   - Everyone knows which metrics matter
   - Alignment across teams

**Implementing Data Culture**

1. **Start with dashboard**
   - Weekly metrics review (Monday mornings)
   - CEO leads: "Here's what the data says"
   - Discuss implications and actions

2. **Establish decision framework**
   - Reversible decision: "Let's test it"
   - Irreversible decision: "Let's analyze thoroughly"
   - Everyone learns the process

3. **Reward experimentation**
   - Don't punish failed experiments (learning)
   - Celebrate successful tests (scaling)
   - Share learnings with team

4. **Train on analytics**
   - Help team read dashboards
   - Teach statistical significance
   - Show common mistakes to avoid

**From Data to Action**

Good analytics loop:

1. **Measure**: Track metrics weekly
2. **Analyze**: Find anomalies/trends
3. **Hypothesize**: "Why did this change?"
4. **Test**: Design experiment
5. **Decide**: Act on results
6. **Iterate**: Measure new outcome, repeat

Example:

Week 1: ARR growth slowed from 8% to 5%
Week 2: Analyze data
- Sales pipeline down 30%
- Hypothesis: Market downturn? Or sales team issue?

Week 3-4: Deeper analysis
- Enterprise deals: Down 40% (market)
- SMB deals: Down 10% (sales efficiency issue)

Week 5: Test solution
- Add new sales playbook for SMB
- A/B test messaging with 3 AEs

Week 6-8: Measure
- New playbook AEs: 8% growth
- Old playbook AEs: 3% growth
- Difference: Statistically significant (p <0.05)

Week 9: Decide
- Rollout new playbook to all AEs
- Expected ARR growth recovery: 6-7% next month

This is how data drives action.
`
      }
    ],
    relatedSlugs: [
      "metrics-dashboard-design-kpi-tracking",
      "financial-forecasting-modeling",
      "cohort-analysis-retention-curves",
      "saas-benchmarking-metrics-comparison",
      "unit-economics-deep-dive"
    ],
    faq: [
      {
        q: "How do I know if a decision is data-driven?",
        a: "You can answer: What metric did you measure? What was the baseline? What was the result? Is the difference statistically significant? If you can't answer these, it's not data-driven."
      },
      {
        q: "How long should a test run?",
        a: "Until you reach statistical significance. Usually 2-4 weeks for SaaS metrics. Use power calculator to estimate sample size needed (if doing A/B test)."
      },
      {
        q: "What if my test fails?",
        a: "That's good—you learned something. Document learning, adjust hypothesis, test again. Most hypotheses fail (50-70% failure rate is normal). Each failure teaches you what doesn't work."
      },
      {
        q: "How do I avoid analytics mistakes?",
        a: "Ask: Could this be correlation not causation? Am I cherry-picking data? Is my sample size large enough? Am I comparing to the right benchmark? Am I looking at vanity metrics?"
      }
    ],
    videoUrl: ""
  }
];

export default batch82Articles;
