import { AcademyArticle } from "@/types/academy";

export const batch304Articles: AcademyArticle[] = [
  {
    slug: "predictive-analytics-for-churn",
    title: "Predictive Analytics for Churn: Modeling Customer Departure Risk",
    description: "Master churn prediction. Build models, identify at-risk customers, prevent losses.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["churn prediction", "predictive modeling", "customer retention", "churn modeling", "at-risk customers"],
    keyTakeaways: [
      "Churn prediction model: Use historical data (churned vs retained customers) to identify patterns. Features: Usage declining? Low engagement? Support tickets increasing? Predict: Probability customer will churn (0-100%). Action: High probability (70%+) = immediate outreach. Cost: Data scientist time (40-60 hours to build model), integration (20 hours). Benefit: Prevent churn (save 10-30% of at-risk customers = significant revenue). Example: 1000 customers, predict 100 at-risk, reach out, save 20 = £60K MRR (if £3K ACV).",
      "Model features: Usage trend (daily active declining past 30 days), engagement breadth (fewer features used), engagement frequency (less time in product), support sentiment (complaints in support tickets), payment (payment failures or friction), tenure (churn rate varies by customer age), competitive (if trackable). Quality: Model trained on past churned customers, validated on holdout set. Accuracy: 65-80% typical (trade-off between sensitivity and specificity).",
      "Operationalization: Score all customers weekly/monthly (update churn risk). Segment: High risk (70%+) → CS outreach immediately. Medium risk (40-70%) → engagement campaign. Low risk (<40%) → maintain normal. Automate: CRM flag high-risk accounts, trigger email/SMS, track outreach results. Measure: Model accuracy (compare predictions to actual churn), intervention effect (save % of at-risk customers), CAC vs retention cost (cost to save > cost to acquire new)."
    ],
    content: [
      {
        heading: "Building and Deploying Churn Prediction Models",
        body: `Creating early warning systems for customer departure.

**Understanding churn prediction**

What it does:
- Input: Customer data (usage, engagement, payment, support)
- Model: Machine learning model trained on historical churned customers
- Output: Churn probability (0-100%) for each current customer
- Action: Reach out to high-risk customers before they leave

Why it works:
- Customers give signals before they churn (declining usage, support issues)
- Historical data shows patterns (customers who churned had similar signals)
- Model learns these patterns, predicts new customers with those signals

When to build:
- Minimum: 100 churned customers (signal for model to learn)
- Ideal: 500+ churned customers (more data = better model)
- Timeline: 50-100 customers churning per month (recurring predictions)

**Model features**

Usage-based:
- Daily active users: Declining past 30 days (strong signal)
- Weekly active: <50% of weeks active (disengagement)
- Feature breadth: Using <2 core features (not realizing value)
- Session duration: Average session time declining
- Frequency: Days since last login (inactive = at-risk)

Engagement metrics:
- Feature adoption: Not adopted new features released
- Login frequency: <2 logins per week (low engagement)
- Feature diversity: Using <30% of available features (limited value)
- Depth: Not accessing advanced features (shallow usage)

Support signals:
- Ticket volume: Increasing support tickets (frustration)
- Ticket sentiment: Negative sentiment in tickets (complaints)
- Unresolved issues: Open tickets >7 days (problems not resolved)
- Feature requests: Multiple requests for same feature (mismatch)

Payment signals:
- Payment failures: Declined cards, bounced payments
- Billing frequency: Not auto-renewing (intentional pause)
- Payment delays: Slow to pay invoices
- Discount seeking: Requesting discounts (price sensitivity)

Firmographic:
- Tenure: Early-stage customers higher churn (adjust for age)
- Plan level: Lower-tier plans higher churn (less invested)
- Company size: SMB vs enterprise (different churn drivers)
- Industry: Certain industries higher churn (market dynamics)

Context:
- Competitive: Competitor tool mention in support tickets
- Market: Industry downturn, economic recession (macro factor)
- Product: Recent feature removal, price increase (can drive churn)

**Building the model**

Step 1: Data preparation
- Historical cohort: Customers from 12 months ago
- Outcome: Churned in past 12 months (yes/no)
- Features: Usage, engagement, support, payment data
- Split: 70% training, 30% test/validation
- Cost: 10-20 hours of data engineering

Step 2: Feature engineering
- Normalize: Convert features to 0-1 scale (model requirement)
- Time-based: Create trends (usage declining? yes/no)
- Interactions: Combine features (low engagement + high support = high risk)
- Selection: Identify top 10-15 features (avoid noise)
- Cost: 10-20 hours of data science

Step 3: Model training
- Algorithm: Logistic regression (interpretable), random forest (accurate), gradient boosting (best accuracy)
- Hyperparameters: Tune model (thousands of configurations tested)
- Validation: Test model on holdout set (validate accuracy)
- Metrics: Accuracy (% correct), precision (false positives), recall (false negatives)
- Cost: 10-20 hours of data science

Step 4: Model evaluation
- Confusion matrix:

| Predicted | Actually Churned | Actually Retained |
|---|---|---|
| Predicted churn | True positive (TP) | False positive (FP) |
| Predicted retain | False negative (FN) | True negative (TN) |

- Accuracy: (TP + TN) / Total = % correct predictions
- Precision: TP / (TP + FP) = % predicted churn that actually churn
- Recall: TP / (TP + FN) = % of actual churn identified
- Tradeoff: High precision (fewer false alarms) vs high recall (catch more churners)

Example results:
- Accuracy: 75% (good, baseline ~50%)
- Precision: 70% (70 of 100 predicted churn actually churn)
- Recall: 65% (65 of actual churners identified)
- Interpretation: Model good at identifying at-risk, but some false positives

Step 5: Integration and deployment
- Scoring system: Weekly/monthly run model on all customers
- Output: Churn score (0-100) for each customer
- CRM integration: Sync scores to CRM (flag high-risk accounts)
- Automated action: Trigger workflow (email, SMS, CS outreach)
- Monitoring: Track model accuracy over time (model drift = retrain)
- Cost: 20-30 hours integration

**Using the model for retention**

Scoring and segmentation:

| Churn Score | Action | Response | Expected Outcome |
|---|---|---|---|
| 80-100 | Immediate CS outreach | Call, email, special offer | Save 15-25% |
| 60-79 | CS engagement | Email campaign, feature tips | Save 5-10% |
| 40-59 | Monitor and nurture | Email newsletter, announcements | Natural retention |
| <40 | Maintain | Normal support | Expected retention |

Example at-risk customer:
- Score: 85 (high risk)
- Signals: Usage declining 40% past month, no feature use past 2 weeks, 3 support tickets, payment failed once
- Action: CS manager calls customer ("Noticed you haven't logged in, everything okay?")
- Conversation: Customer considering alternatives (cost), exploring competitor
- Offer: 20% discount renewal, onboarding to underutilized features
- Retention: Customer renews at discount
- Outcome: Saved from churn

Impact calculation:
- 1000 customers
- Model identifies 150 at-risk (churn score >70)
- Outreach to 120 customers (80% conversion rate on outreach)
- Save 20 customers (15-20% save rate typical)
- Benefit: 20 customers × £3K ACV = £60K MRR retained
- Cost: 1 week CS manager time + discounts (10% average = £6K)
- Net benefit: £54K (£60K retained - £6K cost)
- ROI: 9x (strong economics)

**Avoiding model pitfalls**

Pitfall 1: Unfairness/bias
- Problem: Model predicts higher churn for certain segments (gender, industry)
- Solution: Monitor by segment, adjust weights if biased
- Impact: Ethical issue, potential legal/reputational risk

Pitfall 2: Over-optimization to recent data
- Problem: Model trained on recent customers, ignores longer-term patterns
- Solution: Train on diverse cohorts, validate across time periods
- Impact: Predictions worse on new customer segments

Pitfall 3: Ignoring feature staleness
- Problem: Use features that change slowly (company size) vs rapidly (usage)
- Solution: Weight recent features more (recency bias)
- Impact: Model accuracy improves with fresh data

Pitfall 4: Feedback loops
- Problem: Overuse of model (always reaching out to high-risk customers) changes behavior
- Solution: Control group (don't reach out to 20% high-risk, measure natural churn)
- Impact: Validate model is actually preventing churn, not just selection bias

Pitfall 5: Model drift
- Problem: Model trained in year 1, accuracy degrades in year 2 (customer behavior changes)
- Solution: Retrain monthly/quarterly, monitor accuracy, alert if accuracy drops
- Impact: Keep model fresh and accurate

**Advanced techniques**

Propensity modeling:
- Instead of: Predicting who will churn
- Do: Predict who will respond to retention offer
- Benefit: Reach out to both at-risk AND responsive customers (higher save rate)

Causal models:
- Instead of: Correlational features (usage declining = churn)
- Do: Causal features (feature bugs cause frustration = churn)
- Benefit: Identify root causes (fix bugs = reduce churn), vs just predict

Segmented models:
- Instead of: One model for all customers
- Do: Different models by segment (SMB vs enterprise, new vs mature)
- Benefit: Better accuracy per segment, actionable insights per segment

Ensemble models:
- Instead of: Single model
- Do: Combine multiple models (average predictions, weighted voting)
- Benefit: Higher accuracy (9-10% typical improvement vs single model)

**Measurement and monitoring**

Metrics to track:

| Metric | Target | Current | Action |
|---|---|---|---|
| Model accuracy | >75% | 72% | Retrain, add features |
| Churn rate (overall) | <3% | 4% | Improve retention |
| Churn rate (high risk) | <20% | 25% | Improve outreach effectiveness |
| Churn rate (low risk) | <1% | 1.5% | Model accuracy issue? |
| Save rate | >15% | 12% | Improve offer, outreach |
| Cost per retention | <£500 | £550 | Lower discounts? |

Monthly/quarterly review:
- Model accuracy: Any degradation? (Model drift)
- Segment analysis: Which segments have highest save rate?
- Outreach effectiveness: Which messages drive best response?
- Offer analysis: Which discounts/offers most effective?
- ROI: Total churn prevented vs cost (justify investment)

**Implementation timeline**

Month 1: Data preparation
- Collect 12+ months historical data (churned vs retained)
- Clean and prepare data
- Identify key features
- Cost: 20-40 hours

Month 2: Model development
- Build model (test multiple algorithms)
- Validate accuracy
- Finalize features
- Cost: 40-60 hours

Month 3: Integration
- Connect to CRM/billing system
- Automate scoring (weekly/monthly)
- Set up alerting/workflows
- Cost: 20-40 hours

Month 4: Pilot
- Reach out to high-risk customers (small sample)
- Measure outcomes (save rate, offer effectiveness)
- Iterate on messaging/offers
- Cost: Training, outreach

Ongoing: Monitoring and optimization
- Monthly retrain (keep model fresh)
- Quarterly review (model performance, ROI)
- Continuous iteration (improve save rate)
- Cost: 10 hours/month

Total investment: 150-200 hours (1-1.5 FTE month 1-3, then 10 hrs/month ongoing)
Expected benefit: 15-25% improvement in retention (significant for many companies)
ROI: 5-10x (depending on company size and baseline churn)

`
      }
    ],
    relatedSlugs: ["retention-and-churn-reduction-mechanics", "customer-data-analytics-and-insights", "advanced-analytics-and-data-visualization", "metrics-dashboard-design-kpi-tracking", "customer-success-metrics-and-program-design"],
    faq: [
      { q: "What data do I need to build a churn prediction model?", a: "Minimum: 100 churned customers (historical). Features: Usage (daily active, login frequency), engagement (feature adoption, session duration), support (ticket volume, sentiment), payment (failures, delays), tenure, plan level. Ideal: 500+ churned customers for better model. Timeline: Gather 12+ months historical data, then build model (2-3 months total)." },
      { q: "How accurate are churn prediction models?", a: "Typical accuracy: 70-80% (depends on data quality, feature relevance, algorithms). Trade-off: High precision (fewer false alarms, 70% predicted churn actually churn) vs high recall (catch more churners, identify 60%+ of actual churners). Good model: 75% accuracy, 70% precision, 65% recall = workable for action." },
      { q: "What's the ROI of churn prediction?", a: "High: Prevent 10-20% of at-risk customers from churning. Example: 1000 customers, 100 at-risk, save 15 = £45K MRR retained (if £3K ACV). Cost: 200 hours build + 10 hours/month maintenance = £20K initial, £5K annually. Payback: 1-2 months. ROI: 10x+ typical for mature SaaS (strong business case)." }
    ],
    videoUrl: ""
  }
];

export default batch304Articles;