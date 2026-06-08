import { AcademyArticle } from "@/types/academy";

export const batch303Articles: AcademyArticle[] = [
  {
    slug: "customer-data-analytics-and-insights",
    title: "Customer Data Analytics and Insights: Leveraging Customer Intelligence",
    description: "Master customer analytics. Analyze data, identify patterns, drive decisions.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["customer analytics", "customer insights", "data analysis", "customer data", "behavioral analytics"],
    keyTakeaways: [
      "Customer data strategy: Collect (events, attributes, transactions), organize (data warehouse), analyze (identify patterns), act (improve product/marketing). Cost: Tools (analytics platform £500-5K/month), engineering (data pipeline £50K), analysis time. Benefit: Understand customer behavior (drive product), identify at-risk customers (save with retention), target marketing (higher conversion). Example: 1000 customers, analyze behavior → identify 50 at-risk (churn score high) → outreach saves 20 (4% revenue retention = £12K/month if £3K ACV).",
      "Analytics metrics: Activation (% completing key action), engagement (frequency, breadth of feature use), retention (weekly/monthly active), expansion (usage growth), churn risk (usage declining). Segmentation: By value (ACV tiers), by behavior (active vs inactive), by fit (industry, company size). Action: Customers with high activation + high engagement + growing usage = healthy. Declining usage = at-risk → CS intervention.",
      "Predictive analytics: Score churn risk (model based on historical data), identify expansion opportunity (customers likely to upgrade), score sales readiness (trial users ready to convert). Cost: Data science (£60-100K for model), implementation. Benefit: Proactive (reach out before churn), higher conversion (target ready buyers), LTV optimization. Example: Predict churn with 70% accuracy → reach out to 70% of at-risk customers, save 20% = significant revenue impact."
    ],
    content: [
      {
        heading: "Analyzing Customer Data for Strategic Decisions",
        body: `Building customer intelligence capabilities.

**Customer data fundamentals**

Data types:

Events (what customers do):
- Login, feature use, export, etc.
- Frequency (how often per day/week)
- Recency (when last used)
- Depth (which features used)

Attributes (who they are):
- Company size, industry, location
- Signup date, plan level, contract terms
- Role, team size, seniority

Transactions:
- Revenue (contract value, expansion, upsell)
- Payment history (on-time, late, charged-back)
- Usage (API calls, data volume, users)

Data sources:
- Product (in-app events, page views, feature usage)
- Billing system (subscription, payments, invoices)
- CRM (interactions, campaigns, notes)
- Support (tickets, NPS, satisfaction)
- Customer data platform (unified view)

Data warehouse:
- Tool: Snowflake, BigQuery, Redshift
- Purpose: Centralize all data (single source of truth)
- Cost: £500-2K/month
- Time: 2-4 weeks to set up, ongoing maintenance

**Customer segmentation and cohorts**

Segment by value:

| ACV | Customers | % of Revenue | Strategy |
|---|---|---|---|
| <£1K | 500 | 10% | Self-serve, minimal support |
| £1-5K | 200 | 30% | Strong onboarding, basic CS |
| £5-10K | 50 | 30% | Dedicated support, quarterly reviews |
| £10K+ | 10 | 30% | White-glove service, executive sponsorship |

Action:
- High ACV: Invest in retention (cost to lose vs cost to save)
- Low ACV: Invest in activation (convert trial to paid)
- All: Understand what drives expansion (upsell opportunities)

Segment by engagement:

| Engagement | % of Users | Traits | Status |
|---|---|---|---|
| High | 30% | Weekly+ active, multi-feature usage | Healthy, expansion ready |
| Medium | 40% | Monthly active, 2-3 features | Stable, retention focus |
| Low | 20% | <Monthly, single feature | At-risk, intervention needed |
| Inactive | 10% | No activity past month | Churned or soon to churn |

Actions:
- High: Identify expansion revenue opportunity (upsell, add-ons)
- Medium: Maintain engagement (feature announcements, support)
- Low: Diagnose (missing value? Confusing? Competition?)
- Inactive: Reactivation campaign, if fails → churn

Segment by tenure:

| Tenure | Churn Risk | NRR | Strategy |
|---|---|---|---|
| <3 months | High | N/A | Onboarding focus, reduce early churn |
| 3-12 months | Medium | Low (<100%) | Value realization, feature education |
| 1-2 years | Low | >110% | Expansion revenue focus |
| 2+ years | Very low | >120% | Enterprise upsell, strategic accounts |

Actions:
- Early tenure: Fix onboarding (biggest leverage)
- Established: Focus on expansion revenue (NRR improvement)
- Long-term: Deepen relationships (account growth)

**Predictive analytics**

Churn prediction:

Model features (predict likelihood to churn):
- Usage trend: Declining usage past 30 days
- Engagement: Low weekly active ratio
- Support: Increasing support tickets
- Product adoption: Not using recent features
- Competitive: Increased alternative tools use (if trackable)

Scoring:
- High risk (>70%): 20% of customer base
- Medium risk (40-70%): 30% of customer base
- Low risk (<40%): 50% of customer base

Action:
- High risk: Immediate CS outreach (prevent churn)
- Medium risk: Engagement campaign (feature tips, education)
- Low risk: Maintain relationship

Example impact:
- 1000 customers, 200 high-risk
- Outreach to 150 (save 20% = 30 customers)
- Cost: 5 hours × 150 customers = 750 hours / 160 hrs/month = 5 weeks FTE
- Benefit: 30 customers × £3K ACV = £90K retained
- ROI: £90K value, £10K cost (annual CS time) = 9x ROI

Expansion prediction:

Identify customers likely to expand:
- High usage (hitting limits, need more)
- High NRR (already expanding some)
- Growing company (hiring, expanding TAM for them)
- Feature adoption: Using advanced features (ready for premium tier)

Actions:
- Target for upsell (higher-tier plans)
- Offer add-ons (additional modules)
- Executive engagement (strategic account growth)

Example:
- 1000 customers, analyze usage
- 200 customers showing expansion signals
- Target with upsell campaign
- 10% conversion (20 customers) × £2K ARPU increase = £40K MRR expansion
- Cost: Marketing campaign (£5K), CS outreach (20 hours)
- ROI: £480K annual revenue for £5K + £2K cost = ~50x ROI

Sales-ready prediction:

For trial users, predict likelihood to convert:
- Features used: Accessing core features frequently
- Engagement: Daily+ usage, trying multiple features
- Time-to-value: Days to first aha moment
- Support: Asking relevant questions (engaged, not confused)

Actions:
- Ready to convert (>70%): Sales outreach, focus on closing
- Likely to convert (40-70%): CS support, education to increase readiness
- Unlikely (<40%): Better onboarding, resolve friction

Example:
- 100 trial users, predict conversion
- 20 high-readiness users
- Sales focus on 20 → 5 conversions (25% close rate)
- 30 medium-readiness users
- CS education campaign → 2 conversions
- 50 low-readiness users
- Improve trial onboarding
- Total: 7 conversions (7%, vs 2% baseline) = 3.5x improvement

**Implementation roadmap**

Phase 1: Collect and integrate (month 1-2)
- Set up event tracking (product analytics)
- Connect data sources (CRM, billing, support)
- Build data warehouse
- Cost: £20-30K (setup, engineering time)
- Output: Unified customer data

Phase 2: Basic dashboards (month 2-3)
- Dashboard: Activation funnel (signup → trial → paid)
- Dashboard: Engagement (weekly active, feature usage)
- Dashboard: Churn risk (declining usage, support issues)
- Cost: £5K (tool setup, design)
- Output: Visibility into customer health

Phase 3: Segmentation and cohorts (month 3-4)
- Segment customers (value, engagement, tenure)
- Build cohort views (by acquisition date, source, plan)
- Identify at-risk and expansion-ready segments
- Cost: £10K (analysis, tooling)
- Output: Actionable customer segments

Phase 4: Predictive models (month 4-6)
- Build churn prediction model
- Build expansion prediction model
- Implement scoring (all customers get scores)
- Cost: £30-50K (data science, integration)
- Output: Proactive customer management

Phase 5: Automation and action (month 6+)
- Automate outreach (CS triggered by churn score)
- Automate segmentation (customers auto-assigned)
- Integrate with CRM (workflow automation)
- Cost: £10K (integration, automation)
- Output: Scalable customer intelligence operations

**ROI and success metrics**

Metrics tracking:

| Initiative | Investment | Benefit | Payback |
|---|---|---|---|
| Churn prevention | £10K/yr | £90K retained | 1.3 months |
| Expansion upsell | £5K/yr | £480K MRR expansion | 0.1 months |
| Trial optimization | £15K | £70K additional conversions | 2.5 months |
| Retention efforts | £20K/yr | £150K retention improvement | 1.6 months |
| Total | £50K/yr | £790K impact | ~1 month |

ROI: 15x return on investment (£790K benefit, £50K cost)

Success metrics:
- Churn rate: Reduce by 20% (predictive outreach)
- NRR: Improve from 105% to 115% (expansion focus)
- Trial conversion: Improve from 5% to 8% (early warning intervention)
- Customer lifetime value: Increase through retention + expansion
- Support efficiency: Reduce tickets through proactive support

**Data privacy and governance**

Regulations:
- GDPR (EU): Data protection, right to be forgotten
- CCPA (California): Similar to GDPR, opt-out rights
- Other: Industry-specific (HIPAA for healthcare, PCI for payments)

Compliance:
- Data collection: Transparent (tell customers you collect)
- Data storage: Secure, encrypted
- Data access: Limited to need-to-know
- Data deletion: Respect opt-outs, right to deletion

Best practices:
- Anonymize (where possible, use segments not individuals)
- Minimize (collect only what needed)
- Secure (encrypt, access controls)
- Audit (regular reviews, compliance check)

Cost: Compliance oversight (0.25 FTE) = £20K/year

`
      }
    ],
    relatedSlugs: ["metrics-dashboard-design-kpi-tracking", "advanced-analytics-and-data-visualization", "retention-and-churn-reduction-mechanics", "customer-success-metrics-and-program-design", "account-management-and-expansion-revenue"],
    faq: [
      { q: "How do I get started with customer analytics?", a: "Phase 1: Set up product analytics (Amplitude, Mixpanel, or custom) to track events. Phase 2: Connect to data warehouse (unify CRM, billing, support data). Phase 3: Build dashboards (activation funnel, engagement, churn risk). Phase 4: Segment customers (by value, engagement, tenure). Phase 5: Predictive models (churn prediction, expansion opportunity). Timeline: 2-6 months to maturity." },
      { q: "What's the ROI of customer analytics?", a: "High: Churn prevention (reach out before churn, save 20% = £90K for 1000 customers at £3K ACV). Expansion (identify ready-to-upsell customers, 5-10% convert = £40K+). Trial optimization (predict conversion-ready users, 50% efficiency improvement). Total: 10-15x ROI typical for £50-100K investment." },
      { q: "How do I use analytics to improve retention?", a: "Identify at-risk customers: Build churn score (declining usage, support issues, feature adoption down). Outreach: CS contacts high-risk customers proactively (ask about challenges, offer help). Segment: Different retention strategies by tenure (early-stage focus onboarding vs mature focus expansion). Measure: Track churn reduction (target: -20%), NRR improvement (target: +5 percentage points)." }
    ],
    videoUrl: ""
  }
];

export default batch303Articles;