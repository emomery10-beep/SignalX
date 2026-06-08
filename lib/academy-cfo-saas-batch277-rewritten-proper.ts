import { AcademyArticle } from "@/types/academy";

export const batch277Articles: AcademyArticle[] = [
  {
    slug: "data-privacy-and-gdpr-compliance",
    title: "Data Privacy and GDPR Compliance: Protecting Customer Data",
    description: "Master data privacy. Understand GDPR, build compliance, protect data.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["GDPR", "data privacy", "compliance", "data protection", "DPA", "privacy policy", "data security"],
    keyTakeaways: [
      "GDPR basics: EU regulation (applies to companies handling EU resident data, even if company outside EU). Core rights: Right to access (customer can see their data), right to delete (right to be forgotten), data portability (customer can take data elsewhere), breach notification (notify within 30 days). Penalties: 4% of global revenue (huge for large companies, £40M+ for £1B+ revenue). Compliance: Privacy policy (explain data use), DPA (Data Processing Agreement, binding contract with customers), consent (get explicit permission), security (encryption, access controls). Cost: Legal audit (£10K), DPA implementation (£5-20K), ongoing compliance (£10-20K/year). ROI: Unlock EU market (30-40% of global opportunity), avoid fines (risk management).",
      "Implementation: Privacy policy (website, explain data use, required by GDPR). DPA (contract with each customer, how you process data). Data processing: Map what data collect, how stored, who accesses. Security: Encryption (at rest, in transit), access controls (who can access?), backups (data recovery), incident response (if breach). Audit: Annual (internal), third-party (SOC 2 type 2 = gold standard for enterprise). Cost: £20-50K setup, £10-20K/year ongoing. Penalty avoidance: 4% of revenue = major risk if non-compliant.",
      "Practical: Customers in EU = need GDPR compliance (not optional). Non-EU company: Still need to comply if EU customers. CCPA (California, similar but less strict). Apply GDPR practices to CCPA (best practice covers both). Contract: Include standard clauses (EU legal requirement for data transfers). Implement: Privacy by design (security first, not afterthought). Regular review: GDPR evolving, need to stay current (annual legal review)."
    ],
    content: [
      {
        heading: "GDPR Compliance for SaaS",
        body: `Understanding data privacy obligations.

**GDPR key concepts**

Scope:
- Applies to: Any company processing EU resident personal data
- Geography: Company location irrelevant (even US company with EU customers)
- Data subjects: Individual people (not companies)
- Processing: Collecting, storing, analyzing, transferring data

Key rights (data subjects):
1. Right to access: "Show me my data"
   - You must provide within 30 days
   - Format: Readable, machine-readable copy

2. Right to rectification: "Fix my data"
   - You must correct inaccurate data
   - Timeline: Reasonable effort

3. Right to erasure: "Delete my data"
   - Delete on request (right to be forgotten)
   - Exceptions: Legal obligation to retain (tax records)
   - Timeline: Without undue delay (typically 30 days)

4. Right to data portability: "Give me my data in format I can use elsewhere"
   - Provide in machine-readable format (CSV, JSON)
   - Timeline: 30 days

5. Right to object: "Stop processing my data"
   - Stop using data if no legitimate reason
   - Exception: Legal obligation

**GDPR compliance requirements**

Legal documents:
1. Privacy policy: Explain data use, transparency
   - What data collect: Names, emails, usage data
   - How use: Service delivery, analytics, marketing (if consented)
   - Who accesses: Internal team, third-party tools
   - How long retain: Until customer deletes (or legal requirement)
   - Customer rights: Access, delete, portability

2. Data Processing Agreement (DPA): Binding contract with customers
   - Specifies: How data processed, who has access, security measures
   - Required: For any customer (legally binding)
   - Standard: Use EU standard clauses (pre-approved)

Technical requirements:
1. Data security: Encryption, access controls, backups
   - At rest: Encrypted database (AES-256 standard)
   - In transit: HTTPS (TLS encryption)
   - Access: Minimal access (employees only need-to-know)
   - Backups: Encrypted, tested regularly

2. Incident response: Plan if breach happens
   - Detection: Monitor for unauthorized access
   - Notification: Notify EU supervisory authority within 72 hours
   - Customer communication: Inform data subjects if high risk
   - Investigation: Root cause analysis, prevent recurrence

3. Data retention: Keep only as long as necessary
   - Policy: Delete after customer leaves (or retention period)
   - Automated: Scheduled deletion (not manual, reduce error)
   - Exception: Legal holds (litigation, tax requirements)

**GDPR implementation checklist**

1. Privacy audit (2-4 weeks)
   - Map data flows: What data collect, store, process?
   - Identify transfers: Where does data go? (third parties, countries)
   - Document: What's the legal basis for each processing?

2. Privacy policy (1-2 weeks)
   - Write: Explain data use clearly (customer-facing)
   - Review: Legal counsel ensure compliant
   - Publish: On website (required)

3. DPA implementation (2-4 weeks)
   - Create: Standard DPA template (based on EU standard clauses)
   - Distribute: Send to all customers (required for all)
   - Collect: Document acceptance (audit trail)

4. Technical implementation (4-8 weeks)
   - Encryption: Implement at rest and in transit
   - Access controls: Document who accesses what
   - Backups: Encrypted, tested recovery
   - Monitoring: Logs for audit trail

5. Deletion process (1-2 weeks)
   - Manual request: Allow customer to request deletion
   - Automated: Scheduled deletion after account close
   - Verify: Confirm deletion complete (including backups)

**GDPR violations and penalties**

Violations (examples):
- No privacy policy: Lack of transparency
- No DPA: Illegal processing with customer
- No encryption: Security failure
- Slow breach notification: Notification after 72-hour window
- No deletion capability: Ignoring right to be forgotten

Penalties:
| Violation | Fine | Impact |
|---|---|---|
| Minor (no privacy policy) | £10K-50K | Operational disruption |
| Moderate (no encryption) | £50K-500K | Significant cost |
| Severe (no consent, selling data) | 4% of global revenue | Massive (£40M+ for £1B company) |

Risk management:
- Insurance: Cyber liability insurance (covers fines, legal)
- Audit: Annual compliance audit
- Updating: GDPR rules evolving (stay current)

`
      }
    ],
    relatedSlugs: ["compliance-and-regulatory-considerations", "risk-management-and-contingency-planning", "due-diligence-preparation-for-investment"],
    faq: [
      { q: "Do I need GDPR compliance?", a: "If: You have EU customers (yes, required). Non-EU company: Still applies if EU data. Cost: £10-50K setup, £10-20K/year ongoing. Must-haves: Privacy policy, DPA (contract with customers), encryption, deletion process, breach notification plan." },
      { q: "What's a Data Processing Agreement (DPA)?", a: "Binding contract with each customer specifying: What data you process, how secure, who accesses, data retention, customer rights. Standard template: EU-approved standard clauses. Requirement: GDPR requires DPA for all customers (legally binding)." },
      { q: "What are the penalties for GDPR violations?", a: "Minor: £10-50K (e.g., no privacy policy). Moderate: £50K-500K (e.g., no encryption). Severe: Up to 4% of global revenue (e.g., selling data without consent = £40M+ for large company). Protect: Insurance, annual audit, stay current on regulations." }
    ],
    videoUrl: ""
  }
];

export default batch277Articles;