import { AcademyArticle } from "@/types/academy";

export const batch174Articles: AcademyArticle[] = [
  {
    slug: "customer-data-privacy-and-gdpr-compliance",
    title: "Customer Data Privacy and GDPR Compliance: Protecting Customer Data",
    description: "Master data privacy and GDPR. Build compliant systems, protect customer data, and avoid costly fines.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "GDPR",
      "data privacy",
      "customer data",
      "compliance",
      "data protection",
      "privacy policy",
      "data breach",
      "consent",
      "right to be forgotten",
      "data processing"
    ],
    keyTakeaways: [
      "GDPR basics: EU regulation protecting personal data. Applies to any company handling EU customer data (not just EU companies). Key rules: (1) Only collect necessary data, (2) Get explicit consent, (3) Allow deletion (right to be forgotten), (4) Transparent about use, (5) Secure storage. Violation penalties: Up to £20M or 4% of global revenue (whichever higher). Example: Fine for company collecting birthday without consent = £50K+ fine.",
      "Practical compliance: (1) Privacy policy (clear, readable, posted), (2) Data processing agreement (customer data processing documented), (3) Consent forms (checkbox, explicit opt-in), (4) Data retention policy (delete old data), (5) Security (encrypted storage, access controls). For SaaS: Customer data = gold, protect it (both legally and ethically).",
      "Breach response: If you lose customer data, 72-hour notification required (to affected customers, regulators). Not reporting = bigger fine. Have plan: Detection (monitoring), containment (stop leak), notification (templates ready), recovery (reset passwords, compensation). Cyber insurance: £500K-1M coverage typical, worth it."
    ],
    content: [
      {
        heading: "GDPR Fundamentals",
        body: `Understanding the regulation and who it applies to.

**What is GDPR?**

General Data Protection Regulation (GDPR):
- EU regulation (effective May 2018)
- Applies to any company handling EU resident personal data
- Strict penalties for violations

Scope:
- You're a US company with EU customers: GDPR applies
- You're an EU company with US customers: US law applies (CCPA in California)
- You're using EU cloud provider: Still GDPR applies to your data

Key rights (customer rights):
1. Right to be informed (know what data you have)
2. Right of access (customer can request data you have)
3. Right to rectification (customer can correct wrong data)
4. Right to erasure ("right to be forgotten")
5. Right to restrict processing (limit how you use data)
6. Right to data portability (export their data)

**Personal Data Definition**

Personal data: Any information identifying a person.

Includes:
- Name, email, phone
- IP address
- Customer ID
- Location data
- Payment info
- User behavior (what they click, when)

Not personal data:
- Anonymous data (truly anonymized, can't identify)
- Aggregated data (trends across users, not identifying)

**Consent Requirements**

You MUST get consent before:
- Collecting personal data
- Using data for email marketing
- Sharing data with third parties
- Using data for purposes beyond original intent

Consent requirements:
- Explicit (clear checkbox, not pre-checked)
- Informed (customer knows what they're consenting to)
- Specific (one consent per purpose, not blanket)
- Freely given (customer can withdraw)

Example consent:
❏ "I agree to receive marketing emails about new features"
❏ "I agree to share my data with analytics partners"

NOT compliant:
"I agree to the terms" (with GDPR buried in legal)

`
      },
      {
        heading: "Building GDPR Compliance",
        body: `Practical steps to comply with the regulation.

**Privacy Policy**

Required document:
- Clear language (not legal jargon)
- Explain what data you collect
- Explain why you collect it
- Explain how long you keep it
- Explain customer rights
- Explain how to contact you

Example structure:
1. What personal data do we collect?
   - Name, email, company, usage data
2. Why do we collect it?
   - To provide service, improve product, send updates
3. How long do we keep it?
   - Deleted 30 days after account closure
4. Who do we share it with?
   - Analytics providers, payment processors
5. What are your rights?
   - Request access, deletion, export, correction
6. How to contact us?
   - privacy@company.com

**Data Processing Agreement (DPA)**

Contract with customers (if B2B SaaS):
- Customer is "data controller" (owns data)
- You are "data processor" (process on their behalf)
- DPA defines how you process their data

Example clauses:
- Data categories (what data, how much)
- Processing activities (what you do with data)
- Retention period (how long you keep)
- Security measures (how protected)
- Sub-processors (who else has access)
- Rights (customer can audit, request deletion)

**Consent Management**

Track customer consent:
- When consent given (timestamp)
- What they consented to (which purposes)
- Proof (email confirmation)
- Easy withdrawal (one-click unsubscribe)

System: Consent management platform (OneTrust, TrustArc)
- Collect consent
- Store proof
- Track changes
- Report to regulators

**Data Retention Policy**

Define how long you keep data:

Example policy:
| Data Type | Retention | Reason |
|-----------|-----------|--------|
| Customer account | Until deletion | Needed for service |
| Transaction records | 7 years | Legal requirement |
| Marketing consent | Until withdrawn | Compliance |
| Failed logins | 90 days | Security |
| Usage logs | 12 months | Analytics |

Process:
- Store data with deletion date
- Automated deletion (after 12 months, delete)
- Exception handling (legal hold, customer request)

**Data Security**

Must protect data (encryption, access controls):

Technical:
- Encryption at rest (database encryption)
- Encryption in transit (HTTPS, SSL)
- Access controls (who can access what)
- Audit logs (track access, changes)

Organizational:
- Employee training (data sensitivity)
- Vendor agreements (require their compliance)
- Incident response plan (what to do if breach)

`
      },
      {
        heading: "Data Rights and Breach Response",
        body: `Handling customer requests and breaches.

**Right to Access**

Customer request: "Give me all data you have about me"

Your response:
- Provide within 30 days
- Include: All personal data in readable format (CSV, PDF)
- Include: How you use their data
- Include: Who you shared with

Format:
- Machine-readable (CSV, JSON)
- Human-readable (PDF summary)
- Complete (nothing excluded)

Cost: Free (can't charge for access).

**Right to Erasure**

Customer request: "Delete all my data"

Your obligations:
- Delete within 30 days
- Delete from all systems
- Tell third parties to delete (sub-processors)
- Exception: Legal requirement to keep (taxes, fraud)

Example:
- Customer deletes account
- You delete: Profile, usage history, payment info
- Keep: Transaction records (tax records, 7 years)
- Tell: Analytics provider to delete their copy

**Right to Data Portability**

Customer request: "Export all my data to use elsewhere"

Your response:
- Export within 30 days
- Machine-readable format (CSV, JSON, API)
- Include: All personal data customer provided
- Allow: Transfer to competitor if requested

**Breach Response**

If you lose customer data:

Timeline:
- Day 1: Discover breach (or notification)
- Day 1-3: Contain (stop the leak)
- Day 3: Notify regulators (must within 72 hours)
- Day 3-7: Notify customers (if high risk to them)

Notification must include:
- What happened (breach description)
- What data was affected (which customers)
- What you're doing (containment steps)
- What they should do (change password)

Regulators you notify:
- Country's data protection authority (UK = ICO)
- Affected customers

Cost of breach:
- Notification costs (letters, credit monitoring)
- Regulatory fines (up to 4% revenue)
- Reputation damage
- Cyber insurance claims

Prevention: Better than cure.

`
      },
      {
        heading: "GDPR Compliance Checklist",
        body: `Practical checklist for compliance.

**Documentation**

☑ Privacy policy (published on website)
☑ Data processing agreement (signed by customers)
☑ Consent management (tracking consent)
☑ Data inventory (what data, where stored)
☑ Data retention policy (how long kept)
☑ Data deletion process (automated, logged)
☑ Vendor agreements (require their compliance)
☑ Incident response plan (what to do if breach)

**Technical**

☑ Encryption at rest (database encrypted)
☑ Encryption in transit (HTTPS everywhere)
☑ Access controls (who can access what)
☑ Audit logs (track access, changes)
☑ Backups (for recovery, encrypted)
☑ Monitoring (detect unusual access)
☑ Penetration testing (find vulnerabilities)

**Organizational**

☑ Data protection officer (if required, depends on company size)
☑ Employee training (data sensitivity)
☑ Privacy impact assessment (for new features)
☑ Vendor audits (check their compliance)
☑ Regular reviews (annually)

**Status**

Fully compliant = all checked.

`
      }
    ],
    relatedSlugs: [
      "financial-controls-and-audit-readiness",
      "exit-planning-and-m-and-a-preparation",
      "board-reports-and-financial-statements",
      "unit-economics-ltv-cac-payback",
      "metrics-dashboard-design-kpi-tracking"
    ],
    faq: [
      {
        q: "Does GDPR apply to my company?",
        a: "If you handle ANY data of EU residents, GDPR applies. Not just EU companies. Example: US SaaS with EU customers = GDPR applies. If you have 250+ employees or process large amounts of personal data regularly, additional requirements apply (data protection officer, privacy impact assessments)."
      },
      {
        q: "What must I include in a privacy policy?",
        a: "Explain: What personal data you collect, why you collect it, how long you keep it, who you share with, customer rights (access, deletion, export, correction). Use plain language (not legal jargon). Make it easy to find (not buried in 50-page terms). Provide contact (privacy@company.com) for questions."
      },
      {
        q: "How do I get customer consent?",
        a: "Explicit (clear checkbox, not pre-checked). Informed (customer knows what they're consenting to). Specific (separate consent per purpose, not blanket). Freely given (customer can withdraw). Example: ☑ I agree to receive marketing emails. NOT: I agree to terms (GDPR buried inside). Track consent (timestamp, what they consented to, proof)."
      },
      {
        q: "What happens if I have a data breach?",
        a: "Notify regulators within 72 hours (no exceptions). Notify affected customers if high risk to them. Cost: Notification letters, credit monitoring, fines (up to 4% global revenue or £20M). Prevention: Encryption, access controls, monitoring, incident response plan. Cyber insurance: £500K-1M coverage typical."
      }
    ],
    videoUrl: ""
  }
];

export default batch174Articles;
