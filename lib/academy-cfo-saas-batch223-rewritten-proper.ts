import { AcademyArticle } from "@/types/academy";

export const batch223Articles: AcademyArticle[] = [
  {
    slug: "data-driven-product-development",
    title: "Data-Driven Product Development: Building Products Based on Data",
    description: "Master data-driven development. Use metrics to drive product decisions.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["product development", "data-driven", "analytics", "feature usage", "metrics", "product metrics", "user behavior", "A/B testing", "instrumentation"],
    keyTakeaways: [
      "Instrumentation: Track everything. Example: Feature adoption (% users who tried), feature usage (frequency per user), conversion (% trying → regular use), satisfaction (NPS by feature). Tools: Amplitude, Mixpanel, Segment. Cost: £5-50K annually (depends on volume). Benefit: See what features customers use (vs what you thought), optimize product accordingly. Example: Feature A looks important (lots of requests) but only 10% adoption → problem (users don't like when see it). Feature B used by 80% daily → double down.",
      "Metrics-driven decisions: Product team owns decision. Use data to validate: Hypothesis = \"improving onboarding → increase conversion 5%\". Test: Build improvement, measure. Result: Conversion 4.5% (miss hypothesis). Decision: Not worth building (not enough upside). Alternative: Find different improvement (test 10, ship 3 winners).",
      "Feature lifecycle: Conception (idea from customer, metric opportunity), build (4 weeks), launch (limited rollout), monitor (track metrics), optimize (improve if needed), ship (full rollout or sunset). Metrics by stage: Pre-launch (% users would want?), launch (adoption %), month 3 (regular use %), month 6 (impact on churn/expansion). Kill signal: <20% adoption after 3 months = not resonating, consider sunset."
    ],
    content: [
      {
        heading: "Using Data to Drive Product Decisions",
        body: `Building products based on evidence.

**Key product metrics**

Feature adoption:
- % of users who have tried feature (vs total users)
- Goal: >50% adoption by month 3 (new feature)
- If <30%: Problem (users don't discover or don't value)
- Improve: Onboarding highlight, email promotion

Feature usage:
- Frequency: How often used per week/month
- Goal: Power users (1-2x weekly), casual users (1-2x monthly)
- If declining: Maybe competition, or feature became less useful

Feature retention:
- % of users still using 1 month later
- Goal: >70% (value retention)
- If declining: Feature not valuable, or better alternative

**A/B testing for product**

Test example: Onboarding improvement
- Control: Current onboarding (5 steps, 10 min)
- Variant: New onboarding (3 steps, 5 min)
- Metric: % completing onboarding
- Hypothesis: Faster onboarding → 20% increase in completion
- Result: 15% increase (good, but less than hoped)
- Decision: Ship (15% is still meaningful)

Test ROI:
- Cost: 1 week development
- Benefit: 15% × customer base × 3 year LTV
- Example: 1000 customers × 15% = 150 extra retained = 150 × £10K = £1.5M value
- ROI: £1 dev cost / £1.5M value = 1000x

`
      }
    ],
    relatedSlugs: ["metrics-dashboard-design-kpi-tracking", "decision-making-frameworks-and-data-analytics", "product-roadmap-planning-and-prioritization"],
    faq: [
      {
        q: "What metrics should I track for new features?",
        a: "Adoption: % of users who tried (goal >50%). Usage: Frequency per user (power users daily, casual weekly). Retention: % still using month 1 (goal >70%). Kill signal: <20% adoption after 3 months = consider sunset."
      },
      {
        q: "How do I test product improvements?",
        a: "A/B test: Control (current) vs variant (new). Metric: Conversion, adoption, retention. Sample: 1000+ users, 2 weeks. Confidence: 95% standard. ROI: Cost (dev) vs benefit (improvement × LTV) usually 100x+ if successful."
      }
    ],
    videoUrl: ""
  }
];

export default batch223Articles;
