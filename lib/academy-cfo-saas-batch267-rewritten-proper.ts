import { AcademyArticle } from "@/types/academy";

export const batch267Articles: AcademyArticle[] = [
  {
    slug: "testing-framework-and-ab-testing-methodology",
    title: "Testing Framework and A/B Testing Methodology: Optimizing with Data",
    description: "Master A/B testing. Design experiments, analyze results, improve conversion.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["A/B testing", "testing", "experimentation", "conversion optimization", "statistical significance", "test design", "data-driven decisions"],
    keyTakeaways: [
      "A/B testing fundamentals: Control (existing) vs variant (new), measure metric (conversion, CAC, retention), run 2-4 weeks (sample size matters), measure statistical significance (95% confidence standard). Example: Pricing page test. Control: £99/month, Variant: £89/month, Metric: Conversion rate (%). Run: 2 weeks, 1000 users per variant. Result: Control 5%, Variant 5.5% (10% increase in conversion). Confidence: 95% (likely real, not random). Decision: 5.5% > 5%, and statistically significant, ship new price. Cost: Implementation (dev time), running test (opportunity cost: 50% users see old price). Benefit: 10% conversion improvement = huge revenue impact (1000x+ ROI).",
      "Test design: Hypothesis (what do you expect?), success metric (how measure?), sample size (how many users?), runtime (2-4 weeks typical), confidence level (95% standard). Avoid: Peeking (looking at results before complete, biases decision), multiple tests (run one at a time), low sample size (need 1000+ users per variant for significance). Tools: Optimizely, VWO (A/B testing platforms), Statsig (feature flags + testing). Cost: Tool (£500-5K/month), implementation (dev time), opportunity (test takes 2-4 weeks). Benefit: Data-driven decisions, 5-20% improvement per test typical.",
      "Testing culture: Regular cadence (ship 2-4 tests per quarter). Hypothesis-driven (not random tests). Documented (what tested, what learned). Sharing knowledge (team learns from tests). Expected: 25% of tests win (move metric), 50% neutral (no change), 25% lose (worse). Success rate: If <25% winning, tests are obvious (improve quality). If >50% winning, tests are safe (bigger bets). Most companies: 25-35% win rate (good balance)."
    ],
    content: [
      {
        heading: "A/B Testing and Experimentation",
        body: `Running effective experiments.

**A/B test structure**

Components:
1. Hypothesis: "If we [change X], then [metric Y] will improve by Z%"
   - Example: "If we reduce onboarding steps 5→3, conversion will improve 20%"

2. Success metric: Clear, measurable outcome
   - Primary: Main metric (conversion rate, CAC, retention)
   - Secondary: Metrics to watch (don't optimize, but track for side effects)

3. Sample and duration: Enough users, enough time
   - Sample: 1000-5000 per variant (depends on baseline conversion)
   - Duration: 2-4 weeks (enough data, not forever)

4. Confidence level: Standard 95% (1 in 20 chance of false positive)
   - Lower: 90% (faster, less reliable)
   - Higher: 99% (slower, more reliable)

Example test:
- Hypothesis: "Reduce pricing page complexity (remove feature list) → increase conversion 15%"
- Control: Current pricing page (feature list, £99/mo)
- Variant: Simple pricing page (no list, £99/mo)
- Primary metric: Conversion rate (visitors → trial signup)
- Secondary: CAC, trial-to-paid, NPS
- Sample: 2000 users per variant
- Duration: 3 weeks
- Confidence: 95%

**Sample size and statistical significance**

Calculation (simplified):
- Baseline conversion: 5%
- Expected improvement: 15% (5% → 5.75%)
- Confidence: 95%
- Power: 80% (standard)
- Sample per variant: ~2,000 users

Tools:
- Online calculators (statsig.com, optimizelysize.com)
- General rule: 1000-5000 per variant typical (SaaS)
- Larger lift (20%+): Smaller sample needed (500-1000)
- Smaller lift (5%): Larger sample needed (5000+)

Statistical significance:
- p-value < 0.05 = significant (95% confidence)
- p-value < 0.10 = borderline (90% confidence)
- p-value > 0.10 = not significant (random chance likely)

Avoid:
- Peeking (checking results weekly, biases decision)
- Low power (underpowered test, might miss real effect)
- Multiple variants (run A vs B, not A vs B vs C vs D)

**Testing examples and outcomes**

Example 1: Pricing page test
- Hypothesis: "Reduce pricing tiers 3 → 2 → increase conversion"
- Control: 3 tiers (Starter, Professional, Enterprise)
- Variant: 2 tiers (Professional, Enterprise) - remove cheap option
- Result: Conversion increased 8% (expected 15%, but good)
- Decision: Ship (8% improvement = £100K+ revenue if 1000 customers/month)

Example 2: Onboarding flow test
- Hypothesis: "Add video to onboarding → increase day-1 completion"
- Control: Text-based onboarding (5 steps)
- Variant: Video-based onboarding (3 steps + video)
- Result: Completion increased 20% (as expected)
- Decision: Ship (20% improvement = huge, clear win)

Example 3: CTA button color test
- Hypothesis: "Change CTA green → red → increase click rate"
- Control: Green button
- Variant: Red button
- Result: No difference (red -2%, within margin of error)
- Decision: Inconclusive (don't ship, not significant)

**Testing roadmap and culture**

Quarterly testing plan:
- Q1: 3-4 tests (onboarding, pricing, positioning)
- Q2: 3-4 tests (product features, messaging, CAC channel)
- Q3: 3-4 tests (retention feature, expansion, localization)
- Q4: 3-4 tests (EOY offers, new product, holiday messaging)

Expected outcomes:
- Win (15% of metric): 25-30% of tests
- Neutral (0-5% change): 50% of tests
- Loss (negative): 20-25% of tests

Tracking:
- Documented (every test recorded: hypothesis, result, learning)
- Shared (team learns from each test)
- Iterated (if win, test variations; if lose, pivot)

ROI example:
- Test: Pricing page (implementation 1 week dev time, £5K cost)
- Improvement: 8% conversion increase
- Company: 1000 visitors/month, 5% baseline conversion = 50 conversions
- 8% improvement: 4 additional customers/month
- LTV: £5K per customer (assuming 2-year LTV)
- Monthly value: 4 × £5K = £20K
- Annual value: £240K
- ROI: £240K / £5K = 48x (excellent)

`
      }
    ],
    relatedSlugs: ["decision-making-frameworks-and-data-analytics", "metrics-dashboard-design-kpi-tracking", "advanced-analytics-and-data-visualization"],
    faq: [
      { q: "How do I design an A/B test?", a: "1. Hypothesis: \"If X, then Y improves Z%.\" 2. Metrics: Primary (conversion), secondary (CAC, NPS). 3. Sample: 1000-5000 per variant. 4. Duration: 2-4 weeks. 5. Confidence: 95% standard. Run test, measure, decide." },
      { q: "How many users do I need?", a: "Depends on: Baseline conversion (higher = fewer needed), expected improvement (larger = fewer needed), confidence level (95% standard = 1000-5000 per variant typical). Use online calculator (statsig.com) to determine exact sample size." },
      { q: "What's a good test win rate?", a: "25-35% of tests should win (move metric positively). If <20%: Tests obvious (improve quality). If >50%: Tests safe (underoptimized). Typical: 25% win, 50% neutral, 25% loss. Most valuable: High-velocity testing (ship 2-4/quarter, learn fast)." }
    ],
    videoUrl: ""
  }
];

export default batch267Articles;