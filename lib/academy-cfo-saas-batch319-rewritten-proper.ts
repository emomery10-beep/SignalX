import { AcademyArticle } from "@/types/academy";

export const batch319Articles: AcademyArticle[] = [
  {
    slug: "net-promoter-score-and-customer-satisfaction",
    title: "Net Promoter Score and Customer Satisfaction: Measuring Customer Loyalty",
    description: "Master NPS. Calculate scores, interpret metrics, drive improvements.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["NPS", "net promoter score", "customer satisfaction", "CSAT", "customer loyalty"],
    keyTakeaways: [
      "NPS basics: Ask customers \"How likely recommend to peer?\" (0-10 scale). Score 9-10 = promoters (loyal), 7-8 = passives (satisfied), 0-6 = detractors (unhappy). NPS = % promoters - % detractors. Example: 50% promoters, 10% detractors = 40 NPS. Benchmark: >40 excellent, 20-40 good, <20 poor. Cost: Survey tool (£50-500/month). Benefit: Predict churn (detractors leave), referrals (promoters recommend).",
      "Interpretation: NPS >40 healthy (growth company), NPS 0-20 concerning (retention risk), NPS <0 critical (more detractors than promoters). Track: Monthly NPS (trend), by customer segment (who's unhappy?), by product (features causing issues?). Action: Follow up (why detractors unhappy?), improve (fix root causes), celebrate (promoters giving referrals).",
      "Implementation: Monthly survey (sample 50-100 customers), follow-up (interview detractors, understand why), dashboard (track trend), action plan (improve scores). Cost: Tool £100-300/month, time (interviewing, analysis). ROI: High (NPS predicts churn and growth, drives improvements)."
    ],
    content: [
      {
        heading: "Using NPS to Measure and Improve Customer Satisfaction",
        body: `Building customer loyalty through feedback.

**NPS fundamentals**

Definition:
- Question: "How likely are you to recommend us to a colleague/peer?" (0-10 scale)
- Segments:
  - 9-10 = Promoters (loyal, advocate, will refer)
  - 7-8 = Passives (satisfied, but not enthusiastic)
  - 0-6 = Detractors (unhappy, might churn, might discourage others)

Calculation:
- NPS = % Promoters - % Detractors
- Example: 50% promoters, 10% detractors = 40 NPS
- Range: -100 (all detractors) to +100 (all promoters)

Benchmarks by industry:

| Industry | Healthy | Good | Excellent |
|---|---|---|---|
| SaaS | 20-30 | 30-40 | 40+ |
| Fintech | 30-40 | 40-50 | 50+ |
| E-commerce | 30-40 | 40-50 | 50+ |
| B2B software | 30-40 | 40-50 | 50+ |

Target for SaaS: >40 (excellent), >30 (good), <20 (needs work)

**Survey methodology**

Timing:
- Frequency: Monthly (continuous feedback)
- Sample size: 50-100 customers (statistically significant)
- Population: Random sample of all customers (unbiased)

Implementation:
- Tool: Survicate, Delighted, GetFeedback (all include NPS survey)
- Delivery: Email survey (link), in-app survey (pop-up), post-purchase
- Incentive: Optional (gift card, discount, raffle)
- Timing: Best after positive interaction (successful implementation, feature launch)

Follow-up:
- Detractors: "Why did you rate us X? What would improve your experience?"
- Promoters: "Thank you! Who should we talk to at similar companies?"
- Open-ended: Allow feedback beyond the score

Example response rates:

| Method | Response Rate | Time to Respond |
|---|---|---|
| Email survey | 5-10% | 1-3 days |
| In-app survey | 20-30% | Immediate |
| Incentivized | 15-25% | Same day/next day |
| Interview (phone) | 50%+ | Within 1 week |

**NPS interpretation and action**

Score 40+: Excellent
- Healthy NPS (strong loyalty)
- Action: Capture reasons (what are we doing right?), scale it
- Referral: Ask promoters for referrals (easy growth)
- Engagement: Build advocate program (promoters help improve product)

Score 20-40: Good (but opportunity)
- Action: Understand gaps (interview passives: why not 9-10?)
- Improvement: Address top reasons (product, support, value)
- Timeline: Quarterly improvement plan

Score <20: Poor (risk)
- Action: Urgent (investigate churn risk)
- Interviews: Deep dive (why are customers unhappy?)
- Root cause: Product issues? Service? Pricing? Market?
- Plan: 30-day improvement plan (must improve quickly)

**Segmented NPS**

NPS by customer segment:

| Segment | NPS | Promoters | Detractors | Action |
|---|---|---|---|---|
| Enterprise | 45 | 55% | 5% | Good, grow |
| Mid-market | 35 | 40% | 10% | Needs improvement |
| SMB | 20 | 30% | 20% | Poor, at risk |

Insight: Enterprise happy, SMB unhappy
- Root cause: Product not scaled for SMB? Price too high? Features misaligned?
- Action: Improve SMB experience (product, pricing, support)

NPS by feature/product area:

| Product | NPS | Promoters | Detractors | Action |
|---|---|---|---|---|
| Core analytics | 50 | 65% | 5% | Excellent |
| Reports | 25 | 35% | 25% | Problem area |
| Integrations | 30 | 40% | 20% | Opportunity |

Insight: Reports feature causing issues
- Investigation: Slow? Confusing? Missing functionality?
- Action: Product roadmap (improve reports), or communication (help customers get more value)

NPS by customer tenure:

| Tenure | NPS | Issue |
|---|---|---|
| Month 1-3 | 15 | Early churn risk (onboarding problem) |
| Month 4-12 | 35 | Retention improving |
| Year 2+ | 55 | Stable, growing, loyal |

Insight: New customers unhappy
- Action: Improve onboarding (faster time-to-value, better education)
- Expected: Month 1-3 NPS improve 15 → 40 (retention improvement)

**Action on NPS results**

Detractor interviews (critical):

Sample: 5-10 detractors per month
Questions:
- "What would need to change for you to rate us 9 or 10?"
- "What's most frustrating about using [product]?"
- "Consider any alternatives? Why stay with us?"
- "Any feature missing that would help?"

Analysis:
- Themes: What's coming up repeatedly?
- Severity: Which issues impact most customers?
- Ownership: Who owns fix? (product, support, success?)

Action:
- Quick wins: Easy fixes (documentation, training, small product changes)
- Roadmap: Feature requests (add to product roadmap)
- Support: Training/coaching (help customer get more value)
- Churn risk: Watch (proactive outreach, special attention)

Promoter engagement:

Sample: Top 10% of promoters (high NPS)
Questions:
- "What do you love most about [product]?"
- "Have you referred us? Would you like to?"
- "Would you be willing to be a case study?"
- "Want to be an advisor/beta tester?"

Benefits:
- Understand success factors (what we do right)
- Referrals (ask directly, track source)
- Advocacy (case studies, testimonials, speaking)
- Feedback: Beta test new features

**Improving NPS**

Action plan:

Month 1: Baseline
- Survey 100 customers
- Identify top detractor reasons
- Plan improvements

Month 2: Quick wins
- Implement easy fixes (documentation, support improvements)
- Communicate changes (show you're listening)
- Re-survey (measure impact)

Month 3: Structural improvements
- Product roadmap: Implement feature requests
- Process: Improve onboarding, support
- Training: Better customer education

Month 6: Measurement
- Target: NPS increase 5-10 points (significant)
- Re-segment: Which segments improved?
- Celebrate: Share improvements with team/customers

Example improvement plan:

Baseline NPS: 25 (poor)
Target: 35 (good) by month 6

Issues identified:
- 40% detractors: Confusing interface (product)
- 30% detractors: Slow support (service)
- 20% detractors: Missing feature (roadmap)

Actions:
1. Interface redesign (3 months, engineering)
2. Support hiring (1 month, faster response)
3. Feature development (2 months, engineering)

Timeline:
- Month 1-2: Support hiring + documentation improvements (quick wins)
- Month 2-4: Interface redesign + feature development
- Month 5-6: Testing + rollout
- Re-survey month 6: Measure improvement

Expected NPS improvement:
- Support fixes: +3 points
- Interface redesign: +4 points
- Feature delivery: +3 points
- Total: +10 points (25 → 35)

**NPS vs other metrics**

NPS vs CSAT (Customer Satisfaction):
- CSAT: "How satisfied with [specific interaction]?" (1-5 or 1-7 scale)
- NPS: "How likely recommend overall?" (0-10 scale)
- Difference: CSAT transactional, NPS strategic
- Use both: CSAT for interactions, NPS for overall health

NPS vs retention:
- Correlation: High (NPS predicts churn)
- Detractors: 3-5x more likely to churn
- Promoters: 2-3x more likely to expand (higher LTV)
- Use: NPS as leading indicator (changes before churn)

NPS vs growth:
- Correlation: Strong (promoters refer, detractors discourage)
- High NPS companies: 2-3x revenue growth vs low NPS
- Referral rate: Promoters 5-10x more likely to refer
- Cost: Referrals have 25% lower CAC

**Dashboard and monitoring**

Monthly NPS dashboard:

| Metric | Current | Target | Trend |
|---|---|---|---|
| NPS overall | 32 | 40 | +2 points |
| Promoters | 42% | 50% | +1% |
| Detractors | 18% | 10% | -2% (improving) |
| Response rate | 8% | 10% | On track |
| Response count | 45 | 50 | Close |

Quarterly analysis:
- Trend: NPS changing up/down?
- Segments: Which improving, which declining?
- Themes: Common feedback themes?
- Actions: What improvements had impact?

**Common mistakes**

Mistake 1: Survey infrequently
- Problem: NPS survey once/year, miss trends
- Fix: Monthly survey (continuous feedback)
- Impact: Early warning of problems (before churn hits)

Mistake 2: Survey without action
- Problem: Collect feedback, don't act on it
- Fix: Every survey → action plan (quick wins, roadmap)
- Impact: Customers see improvement (likelihood to stay)

Mistake 3: Ignore detractors
- Problem: Focus on promoters (feel good), ignore detractors (churn risk)
- Fix: Priority on detractors (understand, fix, re-engage)
- Impact: Reduce churn, improve retention

Mistake 4: Not segment NPS
- Problem: Overall NPS = 30, seems okay, but SMB = 10 (problem hidden)
- Fix: Segment by customer type, product, tenure
- Impact: Identify problem areas, targeted fixes

`
      }
    ],
    relatedSlugs: ["customer-success-metrics-and-program-design", "retention-and-churn-reduction-mechanics", "metrics-dashboard-design-kpi-tracking", "product-market-fit-assessment-and-validation", "customer-lifetime-value-optimization"],
    faq: [
      { q: "How do I calculate NPS?", a: "Survey customers: \"How likely recommend to peer?\" (0-10 scale). Score 9-10 = promoters, 7-8 = passives, 0-6 = detractors. NPS = % promoters - % detractors. Example: 50% promoters, 10% detractors = 40 NPS. Benchmark: >40 excellent (SaaS), 20-40 good, <20 needs work." },
      { q: "What's a healthy NPS for SaaS?", a: "Target: 40+ (excellent), 30-40 (good), 20-30 (acceptable), <20 (poor/risk). Depends on stage: Early (30+), Growth (40+), Mature (50+). Track monthly (continuous feedback). Compare: to competitors, to own history (improving/declining?). Use: as leading indicator (predicts churn, growth, referrals)." },
      { q: "How do I improve low NPS?", a: "Interview detractors (understand why unhappy). Identify themes: Product issue? Support? Pricing? Quick wins: Document improvements, support training. Structural: Feature development, product redesign. Timeline: 3-month plan for 5-10 point improvement. Key: Act on feedback (show you're listening), measure impact (re-survey), celebrate improvements." }
    ],
    videoUrl: ""
  }
];

export default batch319Articles;