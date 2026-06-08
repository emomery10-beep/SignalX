import { AcademyArticle } from "@/types/academy";

export const batch273Articles: AcademyArticle[] = [
  {
    slug: "customer-retention-playbook-and-programs",
    title: "Customer Retention Playbook and Programs: Keeping Customers Happy",
    description: "Master retention programs. Build playbooks, measure success, reduce churn.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["retention", "retention playbook", "customer programs", "churn reduction", "retention marketing", "loyalty programs"],
    keyTakeaways: [
      "Retention playbook: Document what works to keep customers. Includes: (1) Onboarding (first 90 days critical, set up for success), (2) Regular engagement (CS check-ins, training, updates), (3) At-risk recovery (health score, proactive outreach), (4) Expansion (identify upsell opportunities), (5) Win-back (campaigns for past churned). Cost: Time to build playbook (2-4 weeks). Benefit: Repeatable process (anyone can execute, not dependent on star CSM). Example: Dental practice software. Playbook: Day 1 onboarding call → Week 2 live training → Week 4 setup complete check-in → Month 2 first patient milestone → Month 3 ROI review (proves value, reduces churn). Outcome: 90% month 1 retention (vs 60% without playbook).",
      "Programs to reduce churn: Success programs (dedicated CS, check-ins, support). Loyalty programs (rewards for long-term customers, reduce price sensitivity). Community programs (users connect, share best practices, sticky). Advocacy programs (customers become promoters, NPS improves, upsell easier). Cost: £50-200K per program annually. Benefit: 0.5-2% churn reduction = £100K-1M value for mid-size SaaS.",
      "Measuring playbook effectiveness: Track: Cohort retention (customers from playbook cohorts retain better?), cost per retention (playbook cost / churn reduction), NPS (customers going through playbook have higher NPS?), expansion (playbook customers expand more?). Goal: Show ROI (program investment < value of churn reduction). Example: £100K retention program, prevents 10 customer churn (£50K ARR each) = £500K value, 5x ROI."
    ],
    content: [
      {
        heading: "Building Effective Retention Playbooks",
        body: `Systematizing customer success.

**Retention playbook components**

Onboarding playbook (first 90 days):
| Phase | Timeframe | Action | Owner | Success metric |
|---|---|---|---|---|
| Welcome | Day 1 | Intro call, account setup | CSM | Customer calls in |
| Training | Week 1 | Live training, resources | CSM | Customer understands product |
| Implementation | Week 2-3 | Setup, data import | Customer + CSM | System configured |
| First win | Week 4 | First success milestone | Customer | Customer sees value |
| Expansion | Month 2 | Identify expansion opportunity | CSM | Customer engaged with advanced features |
| ROI review | Month 3 | Validate ROI, plan next steps | CSM | Customer confident in value |

Engagement playbook (ongoing):
- Monthly check-in (health check, ask for feedback)
- Quarterly business review (outcomes, roadmap, expansion)
- Training updates (new features, best practices)
- Community engagement (newsletter, webinars, user groups)

At-risk playbook:
- Health score alert (email to CSM, flag customer)
- Outreach (CSM calls within 3 days, understand issue)
- Recovery plan (address concern, offer support)
- Follow-up (weekly until restored to healthy)

Win-back playbook:
- Identify churned customers (last 6-12 months)
- Segment (why did they leave? price vs product vs competitive)
- Campaign (email + offer, win them back)
- Reactivation (lower price for trial, prove value)

**Retention programs**

Success program (CS team, playbooks):
- Cost: £80-150K per CSM, 1:15-20 customer ratio
- Benefit: Churn -1-2%, NRR improvement
- ROI: 5-10x (depending on LTV)

Loyalty program (rewards for tenure):
- Example: 2-year discount (5% off annual renewal), 5-year VIP tier (10% off + priority support)
- Cost: £20-50K annually (discount costs)
- Benefit: Reduce price-driven churn (0.5%), improve NPS (5 points)

Community program (user groups, online):
- Cost: £20-50K annually (platform, events, moderation)
- Benefit: Sticky product (community engagement reduces churn 0.5-1%), NPS increase, word-of-mouth

Advocacy program (customers as promoters):
- Identify promoters (NPS 9-10, happy customers)
- Provide (content, events, case study opportunities)
- Reward (discounts, free annual, exclusive access)
- Cost: £10-30K annually
- Benefit: Referral revenue (customers recommend), case studies (faster sales), NPS increase

**Measuring playbook effectiveness**

Cohort comparison:
- Playbook cohort (went through retention playbook)
- Control cohort (no playbook, typical experience)
- Compare: Month 1 retention, Month 3, Month 6, Month 12

Example metrics:
| Milestone | Control | Playbook | Improvement |
|---|---|---|---|
| Month 1 retention | 85% | 92% | +7% |
| Month 3 retention | 70% | 80% | +10% |
| Month 6 retention | 55% | 70% | +15% |
| Month 12 retention | 40% | 60% | +20% |

ROI calculation:
- Playbook cost: £100K annually (CSM time, tools)
- Improvement: 15% month 6 retention (100 customers, 15 saved)
- Customer LTV: £50K
- Value: 15 customers × £50K = £750K
- ROI: £750K / £100K = 7.5x (excellent)

**Implementation roadmap**

Phase 1: Document (2-4 weeks)
- Interview successful CSMs (what works?)
- Document playbooks (onboarding, engagement, at-risk, win-back)
- Create templates (email, slides, checklists)

Phase 2: Pilot (1-2 months)
- Run playbook with 5-10 new customers
- Measure retention (compare to baseline)
- Refine based on feedback

Phase 3: Rollout (1 month)
- Train CS team (playbook, expectations)
- Launch to all new customers
- Track metrics (cohort retention)

Phase 4: Optimize (ongoing)
- Quarterly review (what's working, what's not)
- Refine playbooks (based on data)
- Expand (add programs as ROI proven)

`
      }
    ],
    relatedSlugs: ["customer-success-metrics-and-program-design", "retention-and-churn-reduction-mechanics", "net-revenue-retention-and-expansion-metrics"],
    faq: [
      { q: "What should my retention playbook include?", a: "Onboarding (first 90 days, set up for success), engagement (monthly check-ins, QBRs), at-risk recovery (health score, proactive outreach), expansion (upsell opportunities), win-back (campaigns for churned). Cost: 2-4 weeks to document, then repeatable for all customers." },
      { q: "What retention programs should I build?", a: "Success program (CS team, playbooks = 1-2% churn reduction), loyalty program (tenure rewards = 0.5% churn reduction), community (engagement, sticky = 0.5-1% reduction), advocacy (customers as promoters = word-of-mouth). Pick 1-2 to start, expand as ROI proven." },
      { q: "How do I measure playbook ROI?", a: "Cohort analysis: Customers through playbook vs control. Track retention (month 1, 3, 6, 12). Calculate: Cost of playbook / value of churn reduction. Example: £100K cost, prevent 15 churned customers (£50K LTV each) = £750K value = 7.5x ROI." }
    ],
    videoUrl: ""
  }
];

export default batch273Articles;