import { AcademyArticle } from "@/types/academy";

export const batch394Articles: AcademyArticle[] = [
  {
    slug: "saas-insurance-and-risk-transfer",
    title: "Insurance and Risk Transfer: Protecting Your SaaS Business",
    description: "Master SaaS insurance. Choose the right coverage, manage liability risk, and protect against cyber threats.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["insurance", "risk transfer", "cyber insurance", "liability", "business protection"],
    keyTakeaways: [
      "Essential SaaS insurance: (1) Cyber liability (£5-15K/year premium for £1-5M cover — covers data breach costs, notification, legal defence), (2) Professional indemnity (£3-10K/year for £1-5M cover — covers errors, omissions, negligence claims), (3) Directors & Officers (£5-20K/year for £1-5M cover — required by investors, covers board decisions), (4) Employers liability (mandatory UK, £500-2K/year). Total insurance cost: £15-50K/year for a £5M ARR SaaS company. This is 0.3-1% of revenue.",
      "Cyber insurance economics: Average data breach cost: £3.4M (UK average for mid-size companies). Cyber insurance covers: Investigation costs, legal fees, customer notification, credit monitoring, regulatory fines, business interruption. Example: Data breach affects 50,000 customers. Cost without insurance: £200K investigation + £100K notification + £150K legal + £50K credit monitoring + regulatory fine = £500K+. With cyber insurance: £5K deductible + premium already paid. ROI: Protection against existential risk.",
      "Insurance as sales enabler: Enterprise customers require vendors to carry specific insurance. Common requirements: Professional indemnity (£5M+), cyber liability (£5M+), public liability (£5M+). Without adequate insurance: Cannot close enterprise deals. Example: Enterprise RFP requires £5M professional indemnity. Your policy covers £2M. Cost to upgrade: £3K/year additional premium. Revenue at risk: £200K ACV deal. ROI: £3K investment protects £200K revenue."
    ],
    content: [
      {
        heading: "Managing Insurance and Risk Transfer for SaaS Companies",
        body: `Protecting against risks that could threaten your business.

**Essential insurance policies**

Policy 1: Cyber liability insurance

What it covers:
- Data breach investigation and response
- Customer notification costs
- Credit monitoring services
- Legal defence costs
- Regulatory fines and penalties
- Business interruption from cyber event
- Ransomware payments (some policies)
- Media liability

Coverage amounts:
- Minimum: £1M
- Recommended: £5M for £5M+ ARR companies
- Enterprise requirement: Often £5-10M

Premium range:
- £1M cover: £3-8K/year
- £5M cover: £8-20K/year
- £10M cover: £15-40K/year

Factors affecting premium:
- Revenue and number of data records
- Industry (healthcare/fintech = higher)
- Security posture (SOC 2 = lower premium)
- Claims history
- Data types handled (PII, financial, health)

Example scenario:

Data breach: Unauthorised access exposes 50,000 customer records

Without insurance:
| Cost item | Amount |
|---|---|
| Forensic investigation | £80K |
| Legal counsel | £50K |
| Customer notification | £25K |
| Credit monitoring (50K × £10) | £500K |
| Regulatory defence | £100K |
| ICO fine | £200K |
| Business interruption (2 weeks) | £150K |
| PR crisis management | £30K |
| Total | £1,135K |

With insurance (£5M policy, £10K deductible):
| Cost item | Amount |
|---|---|
| Deductible | £10K |
| Annual premium (already paid) | £12K |
| Total out-of-pocket | £22K |

Savings: £1.1M+

Policy 2: Professional indemnity (E&O)

What it covers:
- Errors in software (bugs causing financial loss)
- Omissions (failing to deliver contracted services)
- Negligence claims
- Intellectual property infringement
- Breach of confidentiality

Coverage amounts:
- Minimum: £1M
- Recommended: £5M
- Enterprise contracts often require: £5-10M

Premium range:
- £1M cover: £2-5K/year
- £5M cover: £5-15K/year
- £10M cover: £10-30K/year

Example scenario:

Software bug causes customer to lose £500K in revenue

Customer sues for:
- Direct losses: £500K
- Consequential losses: £200K
- Legal costs: £100K
- Total claim: £800K

Without PI insurance:
- Legal defence: £100K+
- Settlement/judgement: £200-800K
- Total: £300-900K

With PI insurance:
- Deductible: £5K
- Premium: Already paid (£8K/year)
- Insurance covers: Defence + settlement
- Total out-of-pocket: £13K

Policy 3: Directors & Officers (D&O)

What it covers:
- Claims against directors and officers personally
- Wrongful act in managing company
- Breach of duty, negligence, errors
- Employment practices (unfair dismissal, discrimination)
- Regulatory investigations

Who requires it:
- Investors (typically required as part of funding)
- Board members (won't serve without D&O)
- Required by most Series A+ term sheets

Coverage amounts:
- Minimum: £1M
- Typical: £5M
- Post-Series B: £5-10M

Premium range:
- £1M cover: £3-8K/year
- £5M cover: £8-25K/year
- £10M cover: £15-50K/year

Policy 4: Employers liability (mandatory UK)

What it covers:
- Employee claims for injury or illness at work
- Legal requirement in UK (if you have employees)

Coverage: Minimum £5M (statutory requirement)
Premium: £500-2K/year (based on headcount)

Policy 5: Public liability

What it covers:
- Third-party injury or property damage
- Office visitors, events, client sites

Coverage: £1-5M typical
Premium: £300-1K/year

**Insurance budget by stage**

| Policy | Seed | Series A | Series B+ |
|---|---|---|---|
| Cyber liability | £3K | £8K | £15K |
| Professional indemnity | £2K | £5K | £10K |
| D&O | £3K | £8K | £20K |
| Employers liability | £500 | £1K | £2K |
| Public liability | £300 | £500 | £1K |
| Total | £8.8K | £22.5K | £48K |

As % of revenue:
- Seed (£500K ARR): 1.8%
- Series A (£3M ARR): 0.75%
- Series B+ (£10M ARR): 0.48%

Insurance becomes cheaper relative to revenue as company scales

**Insurance as revenue enabler**

Enterprise procurement requirements:

Typical enterprise RFP insurance requirements:

| Policy | Minimum coverage | Common ask |
|---|---|---|
| Professional indemnity | £2M | £5-10M |
| Cyber liability | £2M | £5-10M |
| Public liability | £2M | £5M |
| Employers liability | £5M | £10M |

Impact on deals:

Scenario:
- Enterprise deal: £150K ACV
- Customer requires £5M PI (you have £1M)
- Upgrade cost: £3K additional premium/year
- Deal at risk without upgrade

Decision:
- Cost: £3K/year
- Revenue: £150K/year
- ROI: 50x return

Always upgrade insurance when it enables revenue

Certificates of insurance:
- Enterprise customers request certificate proving coverage
- Broker can issue within 24-48 hours
- Include: Policy type, coverage amount, effective dates
- Update: Annually (send to customers proactively)

**Cyber risk management**

Beyond insurance (risk reduction):

Security investments that reduce premiums:

| Investment | Cost | Premium reduction |
|---|---|---|
| SOC 2 Type II | £40-60K | 10-20% |
| ISO 27001 | £20-40K | 10-15% |
| MFA implementation | £2-5K | 5-10% |
| Endpoint protection | £5-10K | 5-10% |
| Security training | £3-5K | 5% |
| Total | £70-120K | 35-60% |

Net impact:
- Premium without security: £20K/year
- Premium with security: £10K/year
- Annual savings: £10K
- Plus: Reduced breach probability

Incident response plan:

Pre-incident:
- Incident response team identified
- Communication templates prepared
- Insurance broker on speed dial
- Legal counsel retained

During incident:
- Activate incident response team
- Notify insurance broker immediately
- Engage forensic investigators
- Contain the breach
- Document everything

Post-incident:
- Customer notification (within 72 hours for GDPR)
- Regulatory notification (ICO within 72 hours)
- Remediation plan
- Insurance claim submission
- Lessons learned review

**Reviewing and renewing insurance**

Annual review checklist:

| Check | Action |
|---|---|
| Revenue grown >25%? | Increase coverage proportionally |
| New product launched? | Review PI coverage scope |
| International expansion? | Add global coverage |
| New enterprise customers? | Check coverage meets their requirements |
| Hired >10 people? | Update employers liability |
| SOC 2 / ISO 27001 achieved? | Request premium reduction |
| Any claims this year? | Review exclusions and deductibles |
| Competitive quotes obtained? | Compare with 2-3 brokers |

Broker selection:
- Use specialist tech/SaaS insurance broker
- They understand SaaS risks better than general brokers
- Often get better coverage at lower premiums
- Examples: Embroker (US), Superscript (UK), Coalition

Shopping strategy:
- Get 3 quotes annually
- Don't just compare price — compare coverage, exclusions, deductibles
- Loyalty discount: Some insurers offer 5-10% for multi-year
- Bundle discount: Multiple policies with same insurer = 10-15% savings

`
      }
    ],
    relatedSlugs: ["risk-management-and-contingency-planning", "saas-compliance-and-regulatory-finance", "saas-contract-negotiation-and-commercial-terms", "operating-expense-management-and-control", "enterprise-vs-smb-economics-segment-strategy"],
    faq: [
      { q: "What insurance does a SaaS company need?", a: "Essential policies: (1) Cyber liability (£5-15K/year for £1-5M cover), (2) Professional indemnity (£3-10K/year), (3) Directors & Officers (£5-20K/year, required by investors), (4) Employers liability (mandatory UK, £500-2K/year), (5) Public liability (£300-1K/year). Total: £15-50K/year for £5M ARR company (0.3-1% of revenue). Cyber and PI are most critical for SaaS-specific risks." },
      { q: "Is cyber insurance worth it for SaaS companies?", a: "Yes. Average UK data breach cost: £3.4M for mid-size companies. Cyber insurance costs £5-20K/year for £1-5M cover. Example: 50K-record breach costs £1.1M+ without insurance, £22K with insurance. Even a small breach can be existential for a startup. Additionally: Enterprise customers require it (typically £5M+ cover). SOC 2 certification can reduce premiums by 10-20%." },
      { q: "How does insurance help close enterprise deals?", a: "Enterprise procurement requires vendors to carry: PI (£5-10M), cyber (£5-10M), public liability (£5M). Without adequate coverage: Deal blocked at procurement stage. Cost to upgrade: £3-5K/year additional premium. Revenue at risk: £100-500K ACV per deal. ROI: 30-100x return on insurance investment. Always ask prospects about insurance requirements early in sales cycle." }
    ],
    videoUrl: ""
  }
];

export default batch394Articles;
