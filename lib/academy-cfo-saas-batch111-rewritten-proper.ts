import { AcademyArticle } from "@/types/academy";

export const batch111Articles: AcademyArticle[] = [
  {
    slug: "customer-success-metrics-health-scoring",
    title: "Customer Success Metrics and Health Scoring: Predicting and Preventing Churn",
    description: "Master customer success metrics. Build health scores to predict churn and prioritize retention efforts before customers leave.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "customer success",
      "health score",
      "churn prediction",
      "customer metrics",
      "customer engagement",
      "NPS",
      "customer satisfaction",
      "retention",
      "at-risk customers",
      "customer health indicators"
    ],
    keyTakeaways: [
      "Health score = predictive model of churn risk; build using: usage metrics (active users, feature adoption, login frequency), engagement (tickets opened, support responses, training attended), business metrics (contract value, expansion likelihood), satisfaction (NPS, support sentiment); example: score 0-100, >80 = healthy, 50-80 = at-risk, <50 = churn risk; score should predict actual churn with 80%+ accuracy",
      "Usage metrics drive churn: customers who use product daily have <1% monthly churn, customers who use <1x/week have 5-10% monthly churn; implement usage tracking (dashboard logins, feature usage, API calls) to identify inactive accounts; engage inactive users: email campaigns, in-app notifications, support outreach; reactivation rate: if catch users early, can prevent 20-30% of churn",
      "NPS (Net Promoter Score) survey: ask 'would you recommend us?' on 1-10 scale; 9-10 = promoters, 7-8 = passives, 0-6 = detractors; NPS = (promoters − detractors) / total; benchmark: >50 is excellent, 0-30 healthy, <0 concerning; follow up with open question 'why?' to understand issues; use NPS + health score to identify at-risk segments, prioritize CS resources"
    ],
    content: [
      {
        heading: "Building a Customer Health Score",
        body: `A health score predicts likelihood of churn, allowing you to intervene before customers leave.

**Why Health Scores Matter**

Example: SaaS company with 1000 customers

Without health scoring:
- Discover churn after customer cancels
- No way to prevent it
- Monthly churn: 5% (50 customers lost)
- Cost: 50 × £20K LTV = £1M lost revenue

With health scoring:
- Identify at-risk customers 30 days before churn
- Intervene with CS outreach, product improvements, discounts
- Prevent 50% of at-risk churn (25 customers saved)
- Monthly churn: 2.5% (25 customers lost)
- Savings: 25 × £20K = £500K saved annually

This is massive ROI. Building health score costs £20-50K but saves £500K+.

**Components of a Health Score**

Build health score from 4 categories:

1. Usage Metrics (40% weight)
   - Daily active users (% of user licenses using product)
   - Feature adoption (% using advanced features)
   - Login frequency (days since last login)
   - Session duration (minutes per session)

Example scoring:
- Active daily: +25 points
- Active weekly: +15 points
- Active monthly: +5 points
- Inactive 30+ days: -10 points (churn risk)

2. Support and Engagement (20% weight)
   - Support tickets (quality of tickets, resolution time)
   - Training attendance (did customer attend onboarding?)
   - Feedback surveys (positive/negative sentiment)
   - Executive engagement (does customer meet with your team?)

Example scoring:
- No support tickets in 3 months: -5 points (low engagement)
- Support tickets resolved >95%: +10 points (success)
- Positive NPS: +15 points
- Negative NPS: -20 points

3. Business Metrics (25% weight)
   - Contract value (higher value = more churn risk monitoring)
   - Growth trajectory (is customer expanding?)
   - Usage growth (increasing usage month-over-month)
   - Payment health (on-time payment, not declining)

Example scoring:
- Payment always on time: +10 points
- Payment late 30+ days: -15 points (financial stress, churn risk)
- Expansion revenue this quarter: +15 points
- Declining usage trend: -20 points

4. Competitive/Market Factors (15% weight)
   - Competitor mentions (did customer mention competitor in survey?)
   - Contract renewal date (imminent renewals = risk)
   - Market disruption (is customer's industry changing?)
   - Reference-ability (willing to be customer reference?)

Example scoring:
- Within 30 days of renewal: +5 points (attention needed)
- Within 7 days of renewal: -10 points (critical)
- Competitor mentioned: -20 points
- Willing to be reference: +10 points

**Calculating Health Score**

Total score: Sum of weighted components (0-100)

Example customer calculation:

Usage (40% weight):
- Active daily (+25), feature adoption (+15) = 40 points × 40% = 16 points

Engagement (20% weight):
- Recent support tickets (+10), positive feedback (+10) = 20 points × 20% = 4 points

Business (25% weight):
- On-time payment (+10), expansion revenue (+10) = 20 points × 25% = 5 points

Competitive (15% weight):
- 45 days to renewal (+5), no competitor mention (0) = 5 points × 15% = 0.75 points

Total score: 16 + 4 + 5 + 0.75 = 25.75 (out of 100)

Wait, this seems low. Let me recalculate with better baseline scoring.

Better approach: Start at 50 (neutral) and adjust:

Base score: 50

Usage factors:
- Active last 7 days: +20
- Active last 30 days: +10
- Inactive 30+ days: -20
- Total adjustment: +20

Engagement factors:
- NPS >7: +15
- NPS <5: -20
- Support tickets in good health: +10
- Total adjustment: +15

Business factors:
- On-time payment: +10
- Contract renewal <30 days: -5
- Expansion revenue: +10
- Total adjustment: +15

Final score: 50 + 20 + 15 + 15 = 100

This customer is very healthy (100/100).

Another customer:
- Inactive 30+ days: -20
- No support tickets (low engagement): -10
- Payment late: -15
- Renewal in 10 days: -10
- Final score: 50 - 20 - 10 - 15 - 10 = -5 (below 0, should cap at 0)

This customer is at very high churn risk.

**Health Score Thresholds**

Define action levels:

Score >80: Healthy
- No action needed
- Monitor quarterly
- Consider for upsell/expansion

Score 60-80: At-risk
- Monitor monthly
- Check in via email/call
- Identify pain points
- Offer additional training

Score 40-60: High-risk
- Weekly monitoring
- Immediate CS outreach
- Escalate to leadership
- Offer customer success call

Score <40: Critical
- Daily monitoring
- Emergency CS outreach
- Offer immediate support
- Consider discounts/extended trial to save

**Implementing Health Scoring**

Step 1: Choose metrics (2-3 months data collection)
- Pull historical data on usage, engagement, churn
- Test which metrics predict churn best
- Iterate until accuracy >80%

Step 2: Assign weights (1-2 weeks)
- Rank metrics by churn correlation
- Highest correlation = highest weight
- Test different weight combinations

Step 3: Automate calculation (2-4 weeks engineering)
- Build dashboard or use integration (many tools have health scores)
- Calculate score weekly or monthly
- Set alerts when score drops

Step 4: Implement CS processes (ongoing)
- Define actions for each score level
- Train CS team on thresholds
- Create playbooks for at-risk customers

Step 5: Monitor and improve (quarterly)
- Compare predicted churn vs. actual churn
- Adjust weights if accuracy drifts
- Add new metrics if discovered

Cost:
- Tools (Gainsight, Totangi, Planhat): £5-20K/month
- Or custom build: £20-50K one-time + £2K/month maintenance
- Payoff: If prevent 20-30% of churn, saves £500K+ annually

**NPS (Net Promoter Score)**

Definition: Measures customer satisfaction with one question.

Survey:
"On a scale of 0-10, how likely are you to recommend [Company] to a colleague?"

Scoring:
- 9-10 = Promoters (loyal, will refer)
- 7-8 = Passives (satisfied but not loyal)
- 0-6 = Detractors (unhappy, will discourage others)

NPS = (# Promoters − # Detractors) / Total responses × 100

Example:
- 100 responses
- 50 promoters (9-10)
- 30 passives (7-8)
- 20 detractors (0-6)
- NPS = (50 − 20) / 100 × 100 = 30

Benchmarks:
- <0: Poor (high churn)
- 0-30: Good (acceptable)
- 30-50: Very good (healthy)
- >50: Excellent (industry-leading)

Use NPS in health score:
- Promoters: +15 points
- Passives: +0 points
- Detractors: -20 points

Follow-up questions:
- "Why did you give this score?"
- "What could we improve?"
- "What do you value most?"

Use feedback to improve product and identify issues.

**At-Risk Customer Playbook**

When health score drops or customer is at-risk:

Week 1: Triage
- Call customer immediately (within 48 hours)
- Ask: "How are things going?"
- Listen for issues
- Document findings

Week 2: Assess
- Understand root cause (product issue? Cost? Competitor?)
- Identify if fixable or not
- Get buy-in from leadership

Week 3: Action
- If fixable: Propose solution (extra training, features, custom work)
- If competitor threat: Demonstrate differentiation, offer trial of new features
- If cost: Discuss pricing options, discounts, extended trial

Week 4: Follow-up
- Check if issues resolved
- Offer additional support
- Schedule check-in for future

Success rate:
- If intervene when score drops from 70 to 60: 70% can be saved
- If intervene when score at 40: 30% can be saved
- If intervene when cancellation requested: 10% can be saved

Early intervention is key.

**Predicting Churn with Cohort Analysis**

Build churn prediction by customer cohort:

Cohort = customers acquired in same month

Example:

January 2024 cohort (100 customers):
- Month 0 (Jan): 100 customers (base)
- Month 1 (Feb): 98 customers (-2% churn)
- Month 2 (Mar): 94 customers (-2% churn)
- Month 3 (Apr): 92 customers (-2% churn)
- Month 12 (Dec): 77 customers (-15% cumulative churn)

This cohort has 2% monthly churn.

Compare across cohorts:

January 2024 cohort: 2% monthly churn
February 2024 cohort: 3% monthly churn (worse)
March 2024 cohort: 4% monthly churn (even worse)

Question: Why is March cohort churning faster?
- Product change in March? (feature removed, UX change)
- Sales quality changed? (lower-quality leads)
- Market change? (economic downturn)

Investigate and fix before April cohort becomes worse.

This is how you use data to improve retention.
`
      }
    ],
    relatedSlugs: [
      "churn-analysis-retention-improvement",
      "net-revenue-retention-nrr-mastery",
      "customer-lifetime-value-calculation",
      "customer-acquisition-cost-optimization",
      "metrics-dashboard-design-kpi-tracking"
    ],
    faq: [
      {
        q: "What should a health score include?",
        a: "Usage metrics (40%), engagement/support (20%), business metrics (25%), competitive factors (15%). Build with 2-3 historical metrics, test correlation to churn, iterate."
      },
      {
        q: "What are good health score thresholds?",
        a: ">80 healthy, 60-80 at-risk, 40-60 high-risk, <40 critical. Actions should match score (higher risk = faster response)."
      },
      {
        q: "How do I use NPS in health scoring?",
        a: "Survey customers quarterly (9-10 promoter +15 pts, 7-8 passive 0 pts, 0-6 detractor -20 pts). Follow up with detractors to understand issues. Use NPS as 20-30% of health score."
      },
      {
        q: "When should I intervene with at-risk customers?",
        a: "As soon as health score drops or signals warning. Early intervention (score 70→60) saves 70% of customers. Late intervention (cancellation notice) saves 10%."
      }
    ],
    videoUrl: ""
  }
];

export default batch111Articles;
