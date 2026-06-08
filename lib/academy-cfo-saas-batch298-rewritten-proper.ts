import { AcademyArticle } from "@/types/academy";

export const batch298Articles: AcademyArticle[] = [
  {
    slug: "feature-adoption-and-usage-metrics",
    title: "Feature Adoption and Usage Metrics: Measuring Product Impact",
    description: "Master usage analytics. Track feature adoption, identify gaps, optimize product.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["feature adoption", "product usage", "user engagement", "product analytics", "feature usage"],
    keyTakeaways: [
      "Feature adoption metrics: % of customers using feature (adoption %), frequency (how often), stickiness (% weekly users / total). Example: New reporting feature: 60% adoption, 40% weekly users (stickiness). Cost: Analytics tool (£200-2K/month). Benefit: Visibility into what customers value, what's not used (opportunity). Red flag: Feature released, <30% adoption = maybe not valuable or hard to discover.",
      "Good vs bad adoption: Bad adoption: Feature released, 30% adoption after 3 months (not sticking). Why: Hidden (hard to find), confusing (not clear how to use), not valuable (doesn't solve problem). Action: Onboarding (help people find), improve UX (clearer), kill feature (if not needed). Good adoption: Feature released, 70%+ adoption, 60%+ weekly active (sticky, valuable).",
      "Using adoption data: Prioritization: Features with low adoption = low priority for enhancements. Features high adoption = invest more (upsell, expand). Health check: Declining adoption = feature broken? Alternative appeared? Investigate. Customer success: Help struggling customers use key features (drives expansion revenue). Cost: Analysis time, potential UX investment. Benefit: Better product-market fit, higher engagement, lower churn."
    ],
    content: [
      {
        heading: "Tracking and Optimizing Feature Usage",
        body: `Understanding how customers use your product.

**Feature adoption metrics**

Definition:
- Adoption: % of customers who used feature (at least once)
- Usage frequency: How often per week/month (active)
- Stickiness: % of weekly active users / total users (returning)
- Time to adopt: Days from signup to first feature use
- Depth: % of feature capabilities used (core vs advanced)

Example feature metrics:

Feature: Advanced reporting
- Adoption: 65% (65 of 100 customers used at least once)
- Monthly active: 40% (40 of 100 use monthly)
- Weekly active: 25% (25 of 100 use weekly)
- Stickiness: 40/65 = 62% (of adopters, 62% use weekly)
- Time to adopt: 8 days (average days to first use after signup)

Benchmarks by type:
| Feature | Healthy Adoption | Healthy Weekly | Interpretation |
|---|---|---|---|
| Core feature | 80%+ | 70%+| Critical to product |
| Important feature | 50-70% | 30-50% | Valuable, not essential |
| Nice-to-have | 20-40% | 5-20% | Niche use cases |
| Underused | <20% | <5% | Low value, confusing, or hidden |

Tracking over time:

| Month | Feature A | Feature B | Feature C | Trend |
|---|---|---|---|---|
| Launch | 50% | 40% | 25% | All new |
| +1 month | 60% | 55% | 35% | Growing |
| +3 months | 70% | 65% | 40% | Steady |
| +6 months | 72% | 70% | 42% | Plateauing |

Insights:
- Feature A: Healthy adoption (70%+)
- Feature B: Growing to maturity (70% adoption, good trend)
- Feature C: Slow adoption (42%), below benchmark

**Diagnosing low adoption**

Low adoption (<30%):

Possible causes:
1. Hidden: Customers don't know about feature
   - Check: Does feature appear in product? In docs? In onboarding?
   - Fix: In-app guide, email announcement, onboarding flow

2. Confusing: Feature works but unclear how to use
   - Check: Usage data (do people use correctly or abandon?)
   - Fix: Better UI, contextual help, tutorial

3. Not valuable: Solving wrong problem or not important
   - Check: Customer feedback (do they want this feature?)
   - Fix: Validate before next iteration, consider killing

4. Timing: Customers will use later (not immediate need)
   - Check: When do customers typically adopt? (early vs late)
   - Fix: Re-promote at right time in customer lifecycle

Action triggers:
- Adoption <30% after 3 months: Investigate
- Adoption declining: Something broke (bug? UI change?)
- Adoption by segment: Some segments use, others don't (product-market fit by segment)

Example diagnosis:
- Feature: Auto-billing
- Adoption: 15% after 2 months
- Investigation: Survey users
  - 40% don't know it exists (hidden problem)
  - 35% don't need it yet (only relevant later in lifecycle)
  - 15% tried it, confusing (UX problem)
  - 10% other
- Action: Promote feature in onboarding (20% of adopters), improve UX (15% of adopters), wait for lifecycle maturity (35% of adopters) = Expected adoption improvement to 40-50%

**Using adoption data to guide product**

Roadmap prioritization:

High adoption, increasing:
- Action: Keep enhancing, this is value
- Example: Dashboard feature 75% adoption, 60% weekly
- Invest: Add more dashboard options, performance improvements

High adoption, declining:
- Action: Investigate! (Bug? Competitor? Alternatives?)
- Example: Email sync 80% adoption, now 70% declining
- Investigate: Did we change? Alternative tool available? Competitor feature better?

Low adoption, stable:
- Action: Can kill or document as niche
- Example: Advanced scheduling 10% adoption, flat
- Decide: Is it important to those 10%? If not, consider deprecating

Low adoption, but requested:
- Action: Customer actively asking for = important
- Example: White-label feature 5% adoption, but 5+ customers specifically want
- Invest: Roll out to more customers, could drive expansion

Decisions:
- Investing in high-adoption features: More engagement → higher retention
- Killing low-adoption features: Reduce maintenance, focus team
- Timing investments: When to ship vs when to wait

**Engagement cohort analysis**

Example: Correlate feature usage with retention

| Segment | New Feature Adopters | Non-Adopters | Churn (12mo) |
|---|---|---|---|
| Adopted feature | 150 | - | 10% |
| Didn't adopt | - | 150 | 25% |
| Overall | - | - | 17.5% |

Insight: Adopters have 2.5x better retention (10% vs 25% churn)
Action: Push adoption of this feature (drives retention)

By segment:
| Segment | Adoption | Retention | CAC | Value |
|---|---|---|---|---|
| Enterprise | 80% | 95% | £8K | £100K LTV |
| Mid-market | 60% | 90% | £5K | £40K LTV |
| SMB | 40% | 80% | £2K | £15K LTV |

Insight: Feature more valuable to enterprise (higher adoption, retention, LTV)
Action: Focus feature on enterprise segment (pricing, marketing)

**User onboarding and feature discovery**

Goal: Reduce time-to-first-use for key features

Onboarding tactics:

In-app guidance:
- Tutorial: Step-by-step walkthrough (reduce friction)
- Tooltips: Context-sensitive help ("Click here to set up dashboard")
- Progress: Show completion state ("You've completed 3 of 5 setup steps")
- Cost: 1-2 weeks development, asset design
- Impact: +10-20% faster adoption, +5-10% adoption rate

Email education:
- Sequence: Automated emails teaching features (spaced out)
- Example: Day 1: "Here's your dashboard", Day 3: "Pro tip: Customize it", Day 7: "Advanced features"
- Cost: Marketing automation setup (1 week)
- Impact: +10-15% adoption, +20% time-to-adopt improvement

In-product announcements:
- Banner: "New feature available" (announce, educate, drive adoption)
- Timing: Show when relevant (context matters)
- Cost: Templates, minimal development
- Impact: +5-20% adoption depending on prominence

Success: Comparison
| Tactic | Adoption Lift | Cost | Speed |
|---|---|---|---|
| In-app tutorial | +15% | Low | 1-2 weeks |
| Email sequence | +10% | Low | 2 weeks |
| In-product banner | +8% | Very low | 1 day |
| Webinar | +20% | Medium | 2 weeks |

**Monitoring and optimization**

Monthly metrics:

| Feature | Adoption | Prev Mo | Trend | Weekly Active | Health |
|---|---|---|---|---|---|
| Dashboard | 72% | 68% | +4% | 65% | ✓ Healthy |
| Reports | 85% | 84% | +1% | 70% | ✓ Healthy |
| Automation | 35% | 30% | +5% | 15% | ⚠ Investigate |
| Integrations | 45% | 43% | +2% | 28% | ⚠ Below benchmark |
| Advanced | 10% | 10% | 0% | 2% | ❌ Underused |

Actions:
- Dashboard, Reports: Healthy, maintain
- Automation: Growing adoption but low weekly active (hard to use?) - improve UX
- Integrations: Below 50% target - promote in onboarding
- Advanced: Very low usage - kill or narrow focus?

Quarterly deep dive:

Analysis:
- Feature by customer segment (enterprise vs SMB adoption different?)
- Feature by use case (specific industries adoption different?)
- Feature correlation with retention (which features drive longer customers?)
- Feature correlation with expansion (which features drive upsells?)

Insights drive:
- Product strategy: Where to invest
- Customer success strategy: Which features to push for retention
- Marketing strategy: Which features to emphasize in messaging
- Sales strategy: Which features to lead with (highest adoption = social proof)

`
      }
    ],
    relatedSlugs: ["product-roadmap-planning-and-prioritization", "metrics-dashboard-design-kpi-tracking", "customer-success-metrics-and-program-design", "retention-and-churn-reduction-mechanics", "product-market-fit-assessment-and-validation"],
    faq: [
      { q: "How do I measure feature adoption?", a: "Adoption % = Customers who used feature / Total customers. Track: Monthly active (use in month), weekly active (use in week), stickiness = weekly/total (returning users). Healthy: Core features 70%+ adoption, 60%+ weekly active. Low adoption <30% after 3 months = investigate (hidden, confusing, or not valuable)." },
      { q: "What should I do if a feature has low adoption?", a: "First: Diagnose. Is it hidden (customers don't know about it)? Confusing (unclear how to use)? Not valuable (doesn't solve problem)? Timing (early lifecycle feature, adopt later). Action: Promote (in-app guide, email), improve UX (clearer), or kill if truly unwanted. Target adoption >50% for important features." },
      { q: "How does feature adoption relate to customer retention?", a: "Customers who adopt key features have 2-3x better retention (data-dependent). Action: Promote adoption of high-correlation features in onboarding. Strategy: Identify which features drive retention, push adoption. Expected: 1% improvement in retention adoption = 5-10% improvement in overall retention." }
    ],
    videoUrl: ""
  }
];

export default batch298Articles;