import { AcademyArticle } from "@/types/academy";

export const batch201Articles: AcademyArticle[] = [
  {
    slug: "hiring-and-talent-acquisition-strategy",
    title: "Hiring and Talent Acquisition Strategy: Building High-Performance Teams",
    description: "Master hiring. Plan talent acquisition, optimize recruitment, and build strong teams efficiently.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "hiring strategy",
      "talent acquisition",
      "recruitment",
      "hiring plan",
      "cost per hire",
      "recruitment channels",
      "interview process",
      "candidate evaluation",
      "hiring efficiency",
      "employer branding"
    ],
    keyTakeaways: [
      "Hiring plan: Map to revenue. Example: £10M ARR, target £15M (50% growth), need 30% more people (40 → 52). By function: +4 engineers, +3 sales, +2 product, +2 marketing, +1 finance. Cost: 4 engineers × £120K = £480K (fully loaded). Hiring timeline: 3-month cycle (source → interview → offer → onboard), so start month 1 to fill by month 4. Early = better (ramp time), late = miss revenue targets.",
      "Cost per hire: £8-15K average (SaaS). Includes: Recruiter (agency 20-25% of salary, internal £50K salary / 10 hires = £5K), tools (LinkedIn, job boards £2K), time (hiring manager 20 hours × £100/hr = £2K). Example: Senior engineer £150K salary, 25% agency fee = £37.5K cost per hire (25% of first-year salary). ROI: If hire produces £1M revenue in year 1, £37.5K is 4% cost (excellent). Optimize: Internal recruiting (lower cost), referral program (£5K bonus, cheaper than agency), improve retention (don't replace people constantly).",
      "Hiring velocity: Ramp-up period 3 months. Productivity: Month 1 (50% productive), Month 2 (75%), Month 3 (100%). Example: Hire 4 engineers month 1, month 1 output 2 engineer-months, month 2 = 3, month 3 = 4 full. Total year 1: 2+3+4+4+4+4 = 25 engineer-months (vs expected 48 = 52% of plan). Plan conservatively (don't expect new hires to deliver immediately). Turnover: Every loss = 3-month cycle to replace = significant impact."
    ],
    content: [
      {
        heading: "Hiring Plan and Talent Forecasting",
        body: `Planning headcount aligned to growth.

**Building Annual Hiring Plan**

Starting point:
- Current headcount: 40 people
- Revenue target: £15M (from £10M, 50% growth)
- Headcount ratio: 3-4 people per £1M ARR (healthy for SaaS)
- Target headcount: £15M / 3.5 = ~43 people (minimal growth!)

Wait, that doesn't account for efficiency. Let me recalculate:
- Current: 40 people, £10M revenue = 4 people per £1M
- Industry benchmark: 3-3.5 people per £1M (better leverage)
- Target: £15M at 3.5 ratio = 53 people (13 net hires)

By function (current → target):
| Department | Current | Target | Net Hires |
|-----------|---------|--------|-----------|
| Engineering | 12 | 16 | +4 |
| Sales | 10 | 15 | +5 |
| Product/Design | 5 | 6 | +1 |
| Marketing | 5 | 7 | +2 |
| Finance/HR/Ops | 5 | 5 | 0 |
| CS/Support | 3 | 4 | +1 |
| **Total** | **40** | **53** | **+13** |

By quarter (spread hiring):
| Q | Eng | Sales | Product | Marketing | Other | Total |
|---|-----|-------|---------|-----------|-------|-------|
| Q1 | 1 | 2 | 0 | 1 | 0 | 4 |
| Q2 | 1 | 1 | 1 | 0 | 0 | 3 |
| Q3 | 1 | 1 | 0 | 1 | 1 | 4 |
| Q4 | 1 | 1 | 0 | 0 | 0 | 2 |

**Hiring Cost Analysis**

Cost per hire (fully loaded):
- Salary: Engineering senior £120K
- Recruiter fee: 20-25% of salary = £24-30K (if agency), or £5K if internal
- Tools/advertising: LinkedIn jobs £500, job boards £1K
- Internal time: 40 hours hiring manager time × £100/hr = £4K
- Total: £29.5-39K per senior engineer hire

If hire £150K salary:
- Cost per hire: £37.5K (25% agency) = 25% of first-year salary
- Fully-loaded cost: £37.5K hiring + £150K salary + £50K benefits = £237.5K year 1

Annual hiring budget (13 hires):
| Category | Headcount | Avg Salary | Hiring Cost | Salary + Benefits | Year 1 Cost |
|----------|-----------|-----------|------------|------------------|------------|
| Engineering | 4 | £120K | £35K each | £156K each | £764K |
| Sales | 5 | £70K | £18K each | £91K each | £545K |
| Other | 4 | £65K | £15K each | £85K each | £400K |
| **Total** | **13** | **£80K avg** | **£22.5K avg** | **£107K avg** | **£1.71M** |

This is significant (50% increase in payroll from £2.8M to £4.5M), offset by 50% revenue growth.

**Hiring Timeline and Ramp**

Typical hiring cycle: 3 months
- Week 1-2: Source candidates (recruiter outreach, job posting)
- Week 3-4: Screen + interview round 1
- Week 5-6: Interview round 2-3 (final rounds)
- Week 7-8: Offer + negotiation
- Week 9-10: Onboarding + ramp

Productivity ramp (months 1-6):
- Month 1: 50% productive (onboarding, learning)
- Month 2: 75% productive (ramping)
- Month 3: 90% productive (ramping down)
- Month 4+: 100% productive (full capacity)

Example: Hire 4 engineers in Q1
- Month 1 output: 4 engineers × 50% = 2 engineer-months
- Month 2 output: 4 engineers × 75% = 3 engineer-months
- Month 3 output: 4 engineers × 90% = 3.6 engineer-months
- Month 4-12 output: 4 engineers × 100% = 4 engineer-months per month
- Year 1 total: 2 + 3 + 3.6 + (9 × 4) = 48.6 engineer-months

But if hire in Q1, need to account for availability:
- Actually available: ~25 engineer-months in year 1 (2+3+3.6+4+4+4+..., vs needed 48)
- Gap: Plan for external hires or contractors to close gap

`
      },
      {
        heading: "Recruitment Channels and Sourcing",
        body: `Finding and attracting talent.

**Recruitment Channels**

1. Internal referrals:
   - Source: Employees refer friends, colleagues
   - Cost: £5K referral bonus (if hired)
   - Time: 4-6 weeks (faster than external)
   - Quality: Higher (referred by trusted employee)
   - Target: 30-50% of hires from referrals
   - Action: Active referral program, monthly competitions

2. Job boards (LinkedIn, Indeed, Glassdoor):
   - Cost: £100-500 per job posting, paid placements £3-5K/month
   - Time: 2-4 weeks (good volume)
   - Quality: Mixed (depends on filtering)
   - Target: 20-30% of hires
   - Action: Compelling job description, follow up quickly

3. Agency recruitment:
   - Cost: 20-25% of first-year salary (expensive!)
   - Time: 6-8 weeks (slower, but targeted)
   - Quality: Pre-screened (filtered)
   - Target: Use for hard-to-fill roles (senior eng, data scientist)
   - Action: Negotiate volume discounts (if hiring 10+ people)

4. Direct outreach:
   - Source: LinkedIn, Twitter, GitHub (identify candidates directly)
   - Cost: Internal recruiter time
   - Time: 4-12 weeks (slow, but targeted)
   - Quality: High (passive candidates often best)
   - Target: 10-20% of hires (senior/specialized roles)
   - Action: Personal message, not templated

5. Brand and employer marketing:
   - Source: Candidates apply inbound (company reputation)
   - Cost: Content marketing, events, company culture
   - Time: 6+ months to build (long-term)
   - Quality: Self-selecting (attracted to brand)
   - Target: 20-30% of hires (long-term benefit)
   - Action: Blog, conference talks, social media

**Optimal sourcing mix:**
- Small company (0-20 people): 40% referrals, 30% direct outreach, 30% job boards
- Growing company (20-50): 30% referrals, 25% job boards, 25% direct, 20% agencies
- Scale (50+): 25% referrals, 25% job boards, 20% direct, 15% agencies, 15% brand

**Cost per hire by channel:**
| Channel | Cost | Time | Quality |
|---------|------|------|---------|
| Referral | £5K bonus | 4-6 weeks | Excellent |
| Job board | £500-2K | 2-4 weeks | Good |
| Direct outreach | £3K recruiter time | 4-12 weeks | Excellent |
| Agency | £30-40K | 6-8 weeks | Good |
| Brand/inbound | £2K marketing | 4-8 weeks | Very good |

Optimize: Focus on referrals + direct = highest quality, moderate cost
Secondary: Job boards + brand = volume
Avoid: Agencies (unless desperate or senior role)

`
      },
      {
        heading: "Interview Process and Hiring Decisions",
        body: `Evaluating and selecting candidates.

**Interview Process**

Standard 3-round process:

Round 1: Screening (30 min, recruiter/hiring manager)
- Goal: Assess cultural fit, base competency, work history
- Questions:
  - Walk me through your background
  - Why interested in this role?
  - What's your experience with [key skill]?
- Evaluate: Enthusiasm, communication, relevant experience
- Pass/fail: 30-40% advance (screening is heavy)

Round 2: Technical/domain (60 min, hiring manager + peer)
- Goal: Deep skills assessment, problem-solving, communication
- For engineers: Coding exercise, design discussion, architecture questions
- For sales: Mock customer call, objection handling, discovery questions
- For product: Product sense, analytics, decision-making
- Evaluate: Depth of knowledge, thinking process, ability to communicate
- Pass/fail: 50% advance (filter for serious candidates)

Round 3: Final (60 min, department leader + cross-functional)
- Goal: Executive assessment, team fit, career alignment
- Questions:
  - Tell me about your biggest mistake and what you learned
  - How do you handle conflict with colleagues?
  - Where do you want to be in 5 years?
  - What questions do you have for us?
- Evaluate: Maturity, coachability, team fit, values alignment
- Pass/fail: 70-80% advance (final filtering)

**Evaluation and Decision**

Scoring system:
| Dimension | 1 (Poor) | 2 (Fair) | 3 (Good) | 4 (Excellent) |
|-----------|----------|---------|---------|--------------|
| Technical skills | Below threshold | Needs development | Solid | Expert |
| Communication | Unclear | Acceptable | Clear | Excellent |
| Culture fit | Misaligned | Neutral | Aligned | Highly aligned |
| Growth potential | Limited | Some | Good | High |

Hiring decision:
- Average 3+ across all dimensions = HIRE
- Any dimension <2 = PASS (red flag)
- Strong in 2 dimensions, weak in 1 = MAYBE (reference calls help)

Reference checks:
- Call 2-3 previous managers
- Ask: "Would you hire them again? Why/why not?"
- Red flag: Lukewarm response ("yes, they were fine")
- Green flag: "Absolutely, anytime"

**Time to fill and velocity**

Goal: Reduce time from open to offer
- Benchmark: 30-40 days to offer
- Target: <30 days (faster hiring = stay competitive)

Metrics to track:
- Time to fill (days from opening to offer)
- Offer acceptance rate (% of offers accepted)
- Time to productivity (months to full productivity)
- Retention rate (% still employed after 1 year)

Improve time to fill:
- More aggressive sourcing (day 1, not week 2)
- Parallel interviews (overlapping rounds, not sequential)
- Quick decisions (offer within 24 hours of final round)
- Good candidate experience (responsive, clear timeline)

`
      }
    ],
    relatedSlugs: [
      "sales-compensation-and-incentive-structures",
      "department-budgeting-and-headcount-planning",
      "organizational-structure-and-team-design",
      "employee-equity-and-stock-options",
      "financial-forecasting-modeling"
    ],
    faq: [
      {
        q: "How many people should I hire this year?",
        a: "Align to growth. Example: £10M → £15M revenue (50% growth). Headcount ratio 3-4 per £1M (healthy), so target 53 people (from 40) = 13 net hires. By function: +4 engineers, +5 sales, +1-2 product/marketing. Hire quarterly, not all at once. Cost: 13 hires × £22K avg cost per hire = £286K + £1.7M salary = major expense. Budget accordingly."
      },
      {
        q: "What's the cost per hire?",
        a: "Average: £8-15K (SaaS). Components: Recruiter fee (20-25% of salary for agency = £30K for £120K engineer), tools/advertising (£2K), internal time (£4K). For £120K engineer: ~£36K cost (30% of first-year salary). Optimize: Referrals (£5K bonus, cheaper), internal recruiting (lower fee), direct outreach (time-intensive but quality)."
      },
      {
        q: "How long does it take to hire someone?",
        a: "3-month cycle: Week 1-2 source, 3-4 interview round 1, 5-6 round 2-3, 7-8 offer, 9-10 onboard. Plus 3-month ramp: Month 1 (50% productive), Month 2 (75%), Month 3 (100%). Plan early (start hiring 6 months before you need them). Expect 30-40 day time to offer. Speed: Day 1 sourcing (not lazy), parallel interviews, quick decisions."
      },
      {
        q: "What's the best hiring channel?",
        a: "Mix: 30% referrals (£5K bonus, excellent quality), 25% job boards (£500-2K, good volume), 20% direct outreach (excellent quality, time-intensive), 20% brand/inbound (long-term). Avoid: Agencies (30-40K cost, use only for senior/hard roles). Optimize: Build referral culture, invest in brand, use job boards for volume."
      }
    ],
    videoUrl: ""
  }
];

export default batch201Articles;
