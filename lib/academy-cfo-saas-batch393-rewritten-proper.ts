import { AcademyArticle } from "@/types/academy";

export const batch393Articles: AcademyArticle[] = [
  {
    slug: "saas-payroll-and-compensation-benchmarking",
    title: "Payroll and Compensation Benchmarking: Managing SaaS People Costs",
    description: "Master compensation strategy. Benchmark salaries, design comp structures, and control the largest expense line.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["payroll", "compensation", "salary benchmarking", "total compensation", "people costs"],
    keyTakeaways: [
      "Payroll as % of revenue: Typically 60-75% of total operating expenses. Target: 25-35% of revenue for overall payroll. By function: Engineering 12-18% of revenue, Sales 10-15% (including commission), Marketing 5-8%, CS 4-7%, G&A 5-8%. Example: £10M revenue company with £2.8M total payroll = 28% (healthy). Above 35% = hiring ahead of revenue growth. Below 25% = potentially under-investing in team.",
      "Compensation benchmarking: Use market data to set competitive pay. Sources: Glassdoor, Levels.fyi, Figures.hr, Ravio (UK-specific). UK SaaS salary ranges (2025): Junior engineer £35-50K, mid £55-75K, senior £75-110K, lead £100-130K, VP Engineering £130-180K. Sales: SDR £28-35K base, AE £40-60K base + OTE, VP Sales £100-150K + OTE. Benchmark at 50th-75th percentile (competitive without overpaying). Review annually.",
      "Total compensation design: Four components: (1) Base salary (60-70% of total), (2) Variable/bonus (10-20% for non-sales, higher for sales), (3) Equity (stock options, 10-30% of total comp for startups), (4) Benefits (pension, health, perks — 5-15%). Example: Senior engineer total comp: £90K base + £10K bonus + £30K equity value (over 4 years) + £8K benefits = £138K total. Communicate total comp, not just base, to show full value of package."
    ],
    content: [
      {
        heading: "Managing Compensation in a Growing SaaS Company",
        body: `Controlling your largest cost while attracting and retaining talent.

**Payroll cost management**

Payroll as percentage of revenue:

Healthy ranges by stage:

| Stage | Payroll/Revenue | Employee count | Rev/employee |
|---|---|---|---|
| Seed (<£1M ARR) | 50-80% | 5-10 | £100-200K |
| Series A (£1-5M) | 35-50% | 15-40 | £125-250K |
| Series B (£5-20M) | 28-38% | 40-100 | £150-300K |
| Series C+ (£20M+) | 25-32% | 100-300 | £200-400K |

Payroll by function (as % of revenue):

| Function | Seed | Series A | Series B | Series C+ |
|---|---|---|---|---|
| Engineering | 20-30% | 15-22% | 12-18% | 10-15% |
| Sales | 10-15% | 12-18% | 10-15% | 8-12% |
| Marketing | 5-10% | 5-8% | 5-8% | 4-6% |
| Customer success | 3-8% | 4-7% | 4-7% | 3-5% |
| G&A | 8-15% | 5-10% | 5-8% | 4-6% |
| Total | 46-78% | 41-65% | 36-56% | 29-44% |

Note: Includes base salary only. Commission and equity are additional.

Monitoring payroll efficiency:

Monthly dashboard:

| Metric | This month | Last month | Trend |
|---|---|---|---|
| Total payroll | £230K | £225K | ↑ 2.2% |
| Revenue | £800K | £770K | ↑ 3.9% |
| Payroll % | 28.8% | 29.2% | ↓ (improving) |
| Headcount | 55 | 54 | +1 hire |
| Rev/employee | £174K (ann.) | £171K | ↑ (improving) |

Rule: Revenue per employee should grow every quarter

**Salary benchmarking**

UK SaaS salary ranges (2025):

Engineering:

| Level | Base salary | Total comp |
|---|---|---|
| Junior (0-2 years) | £35-50K | £40-60K |
| Mid (2-5 years) | £55-75K | £65-95K |
| Senior (5-8 years) | £75-110K | £95-145K |
| Staff/Lead (8+ years) | £100-130K | £130-180K |
| VP/Head of Engineering | £130-180K | £180-280K |
| CTO | £140-200K | £200-400K+ |

Sales:

| Level | Base salary | OTE (base + commission) |
|---|---|---|
| SDR | £28-35K | £35-48K |
| Account Executive (SMB) | £35-50K | £55-80K |
| Account Executive (MM) | £50-70K | £80-120K |
| Account Executive (Enterprise) | £65-90K | £120-180K |
| Sales Manager | £70-90K | £110-160K |
| VP Sales | £100-150K | £180-300K |

Marketing:

| Level | Base salary | Total comp |
|---|---|---|
| Marketing Coordinator | £28-35K | £30-40K |
| Marketing Manager | £45-65K | £50-75K |
| Senior/Head of Marketing | £65-90K | £75-110K |
| VP Marketing/CMO | £100-150K | £130-220K |

Customer Success:

| Level | Base salary | OTE |
|---|---|---|
| CSM (Junior) | £30-40K | £33-45K |
| CSM (Mid) | £40-55K | £45-65K |
| Senior CSM | £55-70K | £60-82K |
| CS Manager | £60-80K | £70-95K |
| VP Customer Success | £90-130K | £110-170K |

Finance/Operations:

| Level | Base salary | Total comp |
|---|---|---|
| Finance Manager | £45-65K | £50-70K |
| Financial Controller | £65-90K | £70-100K |
| VP Finance | £90-120K | £100-160K |
| CFO | £120-200K | £160-350K+ |

London premium: +15-25% above UK average
Remote UK: -10-15% below London rates

**Benchmarking methodology**

Step 1: Define your compensation philosophy

Options:
- Lead: Pay at 75th percentile (attract top talent, higher cost)
- Match: Pay at 50th percentile (competitive, cost-effective)
- Lag: Pay at 25th percentile (lower cost, harder to recruit, more equity)

Most SaaS companies: 50th-65th percentile + equity

Step 2: Gather market data

Sources:
- Ravio (UK startup-specific, excellent)
- Figures.hr (European tech)
- Glassdoor (broad but imprecise)
- Levels.fyi (strong for engineering)
- Payscale/Salary.com (general)
- VC portfolio benchmarks (ask your investors)

Cost: £2-10K/year for premium data
Free: Glassdoor, LinkedIn salary insights

Step 3: Create salary bands

Example (Senior Software Engineer):

| Percentile | Salary |
|---|---|
| 25th | £75K |
| 50th (midpoint) | £90K |
| 75th | £105K |
| 90th | £120K |

Your band (targeting 50th-75th):
- Minimum: £80K
- Midpoint: £92K
- Maximum: £108K

New hires: Start at 85-95% of midpoint
Experienced hires: Start at 95-110% of midpoint

Step 4: Annual review

Frequency: Review bands annually
Market movement: Adjust 3-5% per year (inflation + market pressure)
Individual increases: 3-8% based on performance
Promotion increases: 10-15% (new band)

**Total compensation structure**

Components:

1. Base salary (60-70% of total comp)
- Fixed monthly pay
- Benchmarked to market
- Reviewed annually

2. Variable pay (0-50% depending on role)

Non-sales roles:
- Annual bonus: 5-15% of base
- Tied to company and individual performance
- Example: £90K base × 10% = £9K target bonus

Sales roles:
- Commission: 50-100% of base at target (OTE)
- Accelerators above quota (120-150% of standard rate)
- Example: £50K base + £50K commission at target = £100K OTE

3. Equity (10-30% of total comp for startups)

Stock options:
- Grant size by level (see equity compensation article)
- 4-year vesting, 1-year cliff
- Value depends on company growth

Communicating equity value:
- Current value: Options × current share price
- Projected value: Options × projected exit share price
- Example: 10,000 options, current value £2/share = £20K
  - At 3x growth: £60K
  - At 10x growth: £200K

4. Benefits (5-15% of base salary value)

Standard UK package:
- Employer pension contribution: 5-8% (above statutory 3%)
- Private health insurance: £500-1,500/year
- Life insurance: 2-4x salary
- Income protection: £300-600/year
- Learning budget: £1-2K/year
- Equipment budget: £1-2K
- Flexible working (value: Significant but hard to quantify)

Total benefits cost: £5-10K per employee (7-12% of salary)

Example total comp statement:

Senior Software Engineer:

| Component | Annual value |
|---|---|
| Base salary | £92,000 |
| Annual bonus (target) | £9,200 |
| Stock options (annual vest) | £15,000* |
| Pension (employer 5%) | £4,600 |
| Health insurance | £1,200 |
| Other benefits | £2,000 |
| Total compensation | £124,000 |

*Estimated value based on current share price

Communicate this to employees (many don't realise total comp is 35%+ above base)

**Compensation planning in budget**

Annual compensation budget:

Step 1: Current payroll run-rate
- 50 employees × £65K average = £3.25M base payroll
- Plus employer NI (13.8%): £448K
- Plus pension (5%): £162K
- Plus benefits: £400K
- Total people cost: £4.26M

Step 2: Planned increases
- Market adjustment (3%): £97.5K
- Performance increases (avg 2% additional): £65K
- Promotions (5 people, avg 12%): £39K
- Total increases: £201.5K

Step 3: New hires
- 10 new hires planned at avg £70K
- Ramp (start dates staggered through year): £525K (prorated)
- Plus NI/pension/benefits on new hires: £132K
- Total new hire cost: £657K

Step 4: Departures
- Assume 10% voluntary attrition: 5 departures
- Average salary of leavers: £60K
- Savings: £225K (prorated, avg 6 months)
- Replacement hiring cost: £100K (recruiter fees + ramp)

Total people budget:
Current: £4,260K
+ Increases: £201K
+ New hires: £657K
- Departures: -£125K
= Total: £4,993K

Year-over-year increase: £733K (17.2%)
This must be supported by revenue growth

`
      }
    ],
    relatedSlugs: ["hiring-and-team-building-economics", "sales-compensation-and-incentive-structures", "equity-compensation-and-stock-options", "operating-expense-management-and-control", "saas-budget-planning-and-variance-analysis"],
    faq: [
      { q: "What percentage of revenue should payroll be?", a: "Target: 25-35% of revenue for total payroll. By stage: Seed 50-80%, Series A 35-50%, Series B 28-38%, Series C+ 25-32%. By function: Engineering 12-18%, Sales 10-15%, Marketing 5-8%, CS 4-7%, G&A 5-8%. Above 35% = hiring ahead of revenue growth. Revenue per employee should grow quarter over quarter. Example: £10M ARR with £2.8M payroll = 28% (healthy)." },
      { q: "How do I benchmark SaaS salaries in the UK?", a: "Use market data: Ravio (UK startup-specific, best), Figures.hr (European tech), Glassdoor (free, less precise). Target 50th-75th percentile + equity. UK ranges (2025): Senior engineer £75-110K base, AE £50-70K base (£80-120K OTE), Finance Manager £45-65K. London premium: +15-25%. Create salary bands with min/mid/max. Review annually. Total comp (base + bonus + equity + benefits) is 30-40% above base." },
      { q: "How should I structure total compensation?", a: "Four components: (1) Base salary 60-70% of total, (2) Variable/bonus 10-20% (non-sales) or 50%+ (sales OTE), (3) Equity 10-30% (stock options, 4-year vest), (4) Benefits 5-15% (pension 5-8%, health, learning). Example senior engineer: £92K base + £9.2K bonus + £15K equity/year + £7.8K benefits = £124K total. Communicate total comp to employees — many don't realise true value is 35%+ above base salary." }
    ],
    videoUrl: ""
  }
];

export default batch393Articles;
