import { AcademyArticle } from "@/types/academy";

export const batch177Articles: AcademyArticle[] = [
  {
    slug: "contract-management-and-service-level-agreements",
    title: "Contract Management and Service Level Agreements: Protecting Your Business",
    description: "Master contracts and SLAs. Draft customer agreements, set SLAs, and manage contractual risks.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "contract management",
      "service level agreements",
      "SLA",
      "customer contract",
      "legal agreements",
      "liability",
      "uptime guarantee",
      "performance metrics",
      "contractual terms",
      "SLA penalties"
    ],
    keyTakeaways: [
      "Core contract terms: (1) Service description (what you provide), (2) Payment (price, term, billing cycle), (3) Term (how long contract lasts), (4) Auto-renewal (does it renew?), (5) Termination (how to exit?), (6) SLA (uptime guarantee), (7) Liability (what's your max liability?). Example: SMB SaaS contract: £1K/month, annual term, auto-renews monthly after, can cancel with 30-day notice, 99.5% uptime SLA, liability capped at 3 months fees.",
      "SLA structure: Example 99.5% uptime = 21.9 minutes downtime per month (allowed). If exceed, customer gets credit (% of month's fee, typically 5-10%). Example: 99% uptime = 7.2 hours/month downtime. Missing SLA = credit (usually 5% of month, minimum). Document: What counts as downtime (not customer error), how measured (automated), how credited (automatic or request). Transparency: Publish status page (shows uptime, outages).",
      "Liability caps: Limit your exposure. Typical: Liability capped at 12 months of customer fees (max you could lose if sued). Example: £1K/month customer, liability cap £12K (can't be sued for more than this). Exclude: Consequential damages (their lost revenue, not your problem). Include: Customer obligated to mitigate (not your fault if they lost all data)."
    ],
    content: [
      {
        heading: "Essential Contract Terms",
        body: `Building customer agreements that protect you.

**Core Sections**

1. Service Description
   - What exactly you provide
   - Features included/excluded
   - Example: "Cloud project management SaaS, including tasks, files, team messaging"

2. Payment Terms
   - Price (per user, per month, or flat)
   - Billing cycle (monthly, annual)
   - Payment method (credit card, invoice)
   - Late payment consequences (can suspend service)
   - Example: "£500/month, billed monthly via credit card, due on invoice date"

3. Term and Renewal
   - Contract length (1 year, month-to-month)
   - Auto-renewal (does it renew automatically?)
   - Renewal terms (do terms change?)
   - Example: "12-month initial term, auto-renews monthly thereafter unless 30-day notice"

4. Termination
   - How to end contract (email, written, 30-day notice)
   - Termination charges (early termination fee?)
   - Data after termination (30-day data export, then delete)
   - Example: "Either party can terminate with 30-day notice. No early termination fees for month-to-month."

5. Service Level Agreement (SLA)
   - Uptime guarantee (99.5%, 99.9%, etc)
   - Downtime credits if miss SLA
   - Exclusions (customer error, third-party issues, force majeure)
   - Example: "99.5% monthly uptime. If miss, customer gets 5% monthly fee credit."

6. Liability
   - What you're liable for (breach of SLA, data loss)
   - Cap on liability (typically 12 months fees)
   - Exclusions (consequential damages, lost profits)
   - Example: "Liability capped at 12 months of fees. Excludes consequential damages."

7. Data and Privacy
   - You will not access customer data
   - You will protect data (encryption, access controls)
   - You comply with GDPR, CCPA, etc
   - Example: "We protect customer data with encryption. Customer owns all data. You can export/delete anytime."

8. Warranties
   - What you guarantee (product works as described)
   - What you don't guarantee (perfect functionality, specific results)
   - Example: "We warrant product will operate substantially as described. We don't warrant specific business results."

`
      },
      {
        heading: "Service Level Agreements (SLAs)",
        body: `Setting performance guarantees and credits.

**Uptime SLA**

Uptime percentage: % of time service is available.

Calculations:
- 99.9% monthly = 43.2 minutes downtime allowed
- 99.5% monthly = 21.6 minutes downtime allowed
- 99.0% monthly = 7.2 hours downtime allowed

What counts as downtime:
- Service unavailable to customer (can't login, use features)
- Not: Scheduled maintenance (often excluded)
- Not: Customer error (not your responsibility)
- Not: Third-party issues (payment provider down, not you)

Measurement:
- Automated monitoring (ping your service every minute)
- External monitors (third-party confirming uptime)
- Status page (public dashboard showing uptime, outages)

Example calculation:
- Month has 30 days × 24 hours = 720 hours = 43,200 minutes
- 99.5% uptime = 99.5% × 43,200 = 42,912 minutes available
- Downtime allowed = 43,200 - 42,912 = 288 minutes (4.8 hours)

**SLA Credits**

If you miss SLA, customer gets credit.

Example structure:
| Uptime | Credit |
|--------|--------|
| 99.0-99.5% | 5% of monthly fee |
| 98.0-99.0% | 10% of monthly fee |
| 95.0-98.0% | 25% of monthly fee |
| <95.0% | 50% of monthly fee |

Example:
- Customer pays £1K/month
- Month 1: 99.2% uptime (miss 99.5% target)
- Credit: 5% × £1K = £50 credit (applied to next month)

Automatic or request:
- Automatic: Monitor tracks uptime, automatically applies credit
- Request: Customer requests credit, you verify and apply

Benefits:
- Transparent: Clear what customers get if you underperform
- Fair: Customers not penalized for your issues
- Incentive: Drives you to maintain uptime

**Response Time SLA**

Alternative/additional: Response time guarantee.

Example:
- Support ticket SLA: Respond within 24 hours
- Critical issue SLA: Respond within 1 hour
- Resolution SLA: Resolve within 48 hours

Measured:
- First response time (how quickly you respond)
- Time to resolution (how quickly you fix)

Credits:
- Miss SLA: 5-10% credit (applies to support/product tier)

`
      },
      {
        heading: "Liability and Risk Management",
        body: `Protecting your company from legal exposure.

**Limitation of Liability**

Cap on liability: Maximum you could be liable for.

Typical:
- Cap at 12 months of customer fees
- If customer pays £1K/month, max liability £12K
- If sued, can't win more than this

Rationale:
- If customer lost £1M, can claim you owe £1M (unlimited exposure)
- Cap protects you: You know max possible loss
- Fair: Cap is 12x annual fee (reasonable multiple)

Example clause:
"Except for data breach or gross negligence, liability is capped at 12 months of fees paid."

Exclusions from liability:
- Consequential damages: Customer's lost revenue, lost profits
- Indirect damages: Customer's customer lost business
- Punitive damages: Punishment for wrongdoing

Example:
- You have 24-hour outage
- Customer lost £500K in revenue (they were selling)
- You liable: Cap of 12 months fees (£12K)
- You NOT liable: Their lost profits (£500K), that's consequential

**Indemnification**

You defend customer against third-party claims.

Example:
- Customer sued for using your product
- Customer claims you (product infringed someone's patent)
- You agree to defend and pay legal fees

Protections:
- Only if claim is valid (you actually infringed)
- Customer helps defense (cooperate, no settling without you)

**Insurance**

Protect against liability:
- General liability: £1-5M coverage
- Professional liability (E&O): £2-5M coverage
- Cyber liability: £1-2M coverage
- Cost: £5-50K annually (depends on size)

Types covered:
- General liability: Someone injured using your product
- Professional liability: Sued for breach of contract, SLA failure
- Cyber: Data breach, ransomware, security issues

Worth it: If sued, insurance covers legal fees and settlement.

`
      },
      {
        heading: "Managing Contracts",
        body: `Operational aspects of contract management.

**Contract Lifecycle**

Negotiation:
- Customer proposes (or you do)
- Discuss terms (price, term, SLA, liability)
- Iterate until agreement
- Timeline: 2-8 weeks typical (enterprise longer)

Signature:
- Both parties sign (electronically or physical)
- Start date specified (effective immediately or future date)
- Payment starts per term

Execution:
- Provide service per contract
- Monitor SLA compliance
- Send invoices on schedule
- Handle support requests

Renewal:
- 30-60 days before expiration, outreach
- Negotiate renewal terms (price change, new features)
- Get new signature
- Continue service

Termination:
- Customer wants to cancel (per termination clause)
- Notice period (30-day notice, etc)
- Final payment (pro-rata if mid-month)
- Data export and deletion (per agreement)

**Contract Templates**

Standard template for each customer type:

- SMB SaaS: Standard terms, limited negotiation
  - Auto-renews monthly, can cancel anytime
  - 99.5% uptime SLA
  - Liability capped at 3 months fees

- Mid-market: Some negotiation
  - 1-year terms, auto-renew
  - 99.9% uptime SLA
  - Custom liability cap (negotiate)

- Enterprise: Heavy negotiation
  - Custom terms
  - Custom SLA (may request higher uptime)
  - Custom liability cap (often higher)

Template: Reduces time to negotiation, starts with your ideal terms.

**Contract Repository**

Maintain central repository:
- Signed contracts (all versions)
- Renewal dates (calendar reminder for renewals)
- Key dates (termination notice deadlines, renewal dates)
- Custom terms (changes from standard)

Tool: Contract management platform (Ironclad, DocuSign, etc) or shared drive.

Benefit:
- Find contract quickly
- Don't miss renewal deadlines
- Track special terms

`
      }
    ],
    relatedSlugs: [
      "customer-data-privacy-and-gdpr-compliance",
      "financial-controls-and-audit-readiness",
      "exit-planning-and-m-and-a-preparation",
      "partnership-and-channel-strategy",
      "customer-success-metrics-and-program-design"
    ],
    faq: [
      {
        q: "What should a standard customer contract include?",
        a: "Service description (what you provide), payment terms (price, billing cycle), term and renewal (how long, auto-renew?), termination (how to exit), SLA (uptime guarantee), liability (capped at 12 months fees), data and privacy (protect data, GDPR), warranties (product works as described). Use template starting with these, negotiate from there."
      },
      {
        q: "What SLA should I offer?",
        a: "99.5% uptime reasonable (allows ~22 minutes downtime/month). Offer credits if miss: 5-10% of fee if miss SLA. Exclude: Scheduled maintenance, customer error, third-party issues. Measure automatically (monitoring service, status page). Tier by plan: SMB 99.5%, Enterprise 99.9% (if pay more)."
      },
      {
        q: "How do I cap my liability?",
        a: "Standard: Liability capped at 12 months of customer fees. Fair to both sides (you know max exposure, customer gets reasonable recovery). Exclude: Consequential damages (their lost revenue), indirect damages. Example: £1K/month customer, max liability £12K (can't be sued for more). Essential protection."
      },
      {
        q: "How do I manage contracts operationally?",
        a: "Maintain central repository (Ironclad, DocuSign, or shared drive). Track: Renewal dates (calendar reminder), key dates (termination deadlines), custom terms (track special terms). 30-60 days before renewal, outreach customer. Standard template for SMB, allow negotiation for enterprise. Reduce friction with templates."
      }
    ],
    videoUrl: ""
  }
];

export default batch177Articles;
