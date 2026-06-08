import { AcademyArticle } from "@/types/academy";

export const batch210Articles: AcademyArticle[] = [
  {
    slug: "compliance-and-regulatory-considerations",
    title: "Compliance and Regulatory Considerations: Staying on the Right Side of the Law",
    description: "Master compliance. Understand key regulations, build compliance program, and manage risk.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "compliance",
      "regulatory",
      "GDPR",
      "data privacy",
      "SOC 2",
      "risk management",
      "legal compliance",
      "audit",
      "data protection",
      "regulatory framework"
    ],
    keyTakeaways: [
      "Key regulations: GDPR (EU, protects personal data, £20M fine or 4% revenue), CCPA (California, similar to GDPR), SOC 2 (security/availability/integrity, required for enterprise customers, 6-9 month audit), HIPAA (health data, if health customers), PCI DSS (payment data, if storing cards). Priority: Understand which apply to you (data type, customer location). GDPR critical if EU customers (required by law). SOC 2 required if targeting enterprise (customers won't buy without). Build: Privacy policy (required by GDPR), DPA (data processing agreement), record of processing. Cost: Legal £5-10K, compliance program £20-50K (ongoing), audit £30-100K. Delay = risk (fines up to £20M or 4% revenue if breach).",
      "Data privacy by design: Collect only necessary data (minimize risk), encryption (data at rest + in transit), access controls (who can see data), audit logs (track access), retention policy (delete when no longer needed). GDPR principles: Lawful basis (why collecting?), consent (ask customer), transparency (tell them what data you keep), right to deletion (allow customers to delete). Documentation: Privacy policy, data flow diagram, risk assessment, breach response plan. Violations: Fines 2-4% revenue (depending on severity). Prevention: Better than paying fine.",
      "Audit and certification: SOC 2 Type II (most common for SaaS), requires: Security controls, change management, access controls, encryption. 6-month audit (3-month operations + 3-month testing), annual renewal. Cost: £30-100K (first year, £10-30K renew). Time: Start 6-9 months before selling to enterprise. Alternative: Start SOC 2 Type I (1-month audit, easier, less credible, but cheaper £10-20K to start). Insurance: D&O + cyber liability £500K-2M, 1-2% of revenue cost. Protects: Covers breach costs, legal fees, customer claims. Essential: By Series A investors require it."
    ],
    content: [
      {
        heading: "Key Regulations and Compliance Landscape",
        body: `Understanding regulatory requirements.

**Global data protection regulations**

GDPR (General Data Protection Regulation, EU):
- Scope: Any company collecting data from EU residents
- Requirements:
  - Privacy policy (clearly state what data you collect, why, how long kept)
  - Consent (ask permission before collecting personal data)
  - Data processing agreement (DPA, document with customers)
  - Breach notification (notify within 72 hours if data breached)
  - Right to deletion (customer can request data deletion)
  - Data minimization (collect only what necessary)
- Penalties: €10-20M or 4% of global revenue (whichever higher)
- Timeline: Compliance required before selling to EU customers

CCPA (California Consumer Privacy Act, US):
- Scope: Any company with California residents' data
- Requirements: Similar to GDPR (privacy policy, right to deletion, transparency)
- Penalties: Up to £2500 per violation (£7500 if intentional)
- Timeline: Started Jan 2020, now enforced

CPRA (California Privacy Rights Act, expansion of CCPA):
- Scope: California residents (similar to CCPA)
- Additional: More privacy rights, higher penalties (£2500-£7500)
- Timeline: Starting 2023 enforcement

Other regulations:
- HIPAA (US healthcare, if handling health data): PHI encryption, audit logs, breach notification
- FINRA (US financial, if fintech customers): Data security, surveillance, compliance
- State laws: Many states have privacy laws (NY, Virginia, Colorado, etc.)

**Compliance by industry**

Finance/fintech:
- Regulations: CCPA, GDPR, FINRA, PCI DSS (if storing payment data)
- Requirements: Encryption, audit logs, annual compliance audit
- Burden: High (multiple regulations)

Healthcare:
- Regulations: GDPR (if EU), HIPAA (if US health data), CCPA
- Requirements: PHI encryption, audit logs, BAA (Business Associate Agreement)
- Burden: Very high (regulated industry)

SaaS (general):
- Regulations: GDPR (if EU customers), CCPA (if CA customers), SOC 2 (for enterprise)
- Requirements: Privacy policy, data security, breach notification
- Burden: Medium (depends on customer base)

`
      },
      {
        heading: "Building Compliance Program",
        body: `Establishing controls and processes.

**Privacy and security controls**

Data collection:
- Only collect necessary data (privacy by design)
- Get consent before collecting personal data (GDPR requirement)
- Privacy policy (document what you collect, why, how long kept)
- Consent mechanism (checkbox, form, opt-in)

Data protection:
- Encryption at rest (data stored encrypted in database)
- Encryption in transit (HTTPS, TLS for data transmission)
- Access controls (only authorized people can see data)
- Audit logs (track who accessed what, when)
- Backups (regular backups for recovery)

Data retention:
- Retention policy (keep data X months, then delete)
- Automatic deletion (set expiration, auto-delete after period)
- Customer deletion requests (right to deletion, fulfill within 30 days)
- Document: Why kept, how long, deletion process

Breach response plan:
- Incident response (what to do if breach detected)
- Investigation (determine scope, severity)
- Notification (notify customers within 72 hours per GDPR)
- Remediation (fix security issue, prevent recurrence)
- Documentation (log incident, learnings)

**SOC 2 audit and certification**

What is SOC 2:
- Security audit standard for SaaS companies
- Types: Type I (point-in-time assessment), Type II (6+ months of operations)
- Trust services criteria: Security (protection), availability (uptime), processing integrity (accuracy), confidentiality (privacy), privacy (compliance)
- Required by: Enterprise customers (majority won't buy without SOC 2)

SOC 2 Type I process (simpler, faster):
- Timeline: 1-2 months
- Effort: Document current controls, have auditor assess
- Cost: £10-20K
- Result: Assessment of your current controls
- Limitation: Doesn't demonstrate operational effectiveness (newer controls may not be tested)

SOC 2 Type II process (full, credible):
- Timeline: 6+ months (minimum 6 months of operations to audit)
- Effort: Document controls, operate for 6 months, auditor tests effectiveness
- Cost: £30-100K (initial), £10-30K annual renewal
- Result: Full report on security and controls
- Credibility: Industry standard for enterprise SaaS

Implementation steps:
1. Identify controls needed (access, encryption, monitoring, change management)
2. Document processes (how controls are implemented)
3. Implement controls (make sure they're actually in place)
4. Operate for 6 months (if Type II)
5. Engage auditor (external firm conducts audit)
6. Fix issues (auditor finds gaps, fix them)
7. Get report (SOC 2 report issued, use for sales)

**Documentation and compliance calendar**

Documents to maintain:
- Privacy policy (public-facing, what data you collect)
- Data processing agreement (DPA, with customers, GDPR requirement)
- Terms of service (customer agreement, includes liability, data handling)
- Incident response plan (what to do if breach)
- Vendor management (track vendors who process data, get DPA from them)
- Access control policy (who can see what data)
- Data retention policy (how long you keep data)
- Audit logs (regularly review, store for years)

Compliance calendar:
- Q1: Privacy policy review (update if changed)
- Q2: Data processing agreements (update with all customers)
- Q3: Security audit (internal, check controls)
- Q4: Incident response drill (test plan, identify gaps)
- Annual: GDPR/CCPA compliance review (am I still compliant?)
- As needed: SOC 2 (start 6-9 months before selling to enterprise)

**Insurance and risk mitigation**

Cyber liability insurance:
- Covers: Data breach costs, legal fees, customer notification, business interruption
- Coverage: £500K-£5M
- Cost: 1-2% of revenue (£1-2K for early stage, £20-50K for mature)
- Providers: Chubb, AIG, Beazley, Marsh
- Essential: By Series A, investors require it

D&O (Directors and Officers) insurance:
- Covers: Management liability, regulatory fines (partially), shareholder lawsuits
- Often bundles with cyber liability
- Cost: Similar to cyber (1-2% of revenue)

Claims examples:
- Data breach: Insurance covers notification costs (£100K+), legal fees, customer claims
- GDPR fine: May cover portion of fine (depending on policy)
- ROI: If £1 million data breach, £20K insurance cost is small

`
      }
    ],
    relatedSlugs: [
      "customer-data-privacy-and-gdpr-compliance",
      "financial-controls-and-audit-readiness",
      "contract-management-and-service-level-agreements",
      "risk-management-and-contingency-planning",
      "board-governance-and-fiduciary-duties"
    ],
    faq: [
      {
        q: "Do I need to comply with GDPR?",
        a: "If you have EU customers or collect data from EU residents: YES. GDPR is mandatory (not optional). Penalties: Up to £20M or 4% of global revenue if violated. Required: Privacy policy, customer consent, data processing agreement (DPA), breach notification plan. Start: Document privacy practices, get legal review, update privacy policy before selling to EU customers."
      },
      {
        q: "What's SOC 2 and do I need it?",
        a: "SOC 2 = security audit certification. Required if: Targeting enterprise customers (won't buy without it). Optional but helpful: If competing with larger companies. Two types: Type I (1-2 months, £10-20K, limited credibility), Type II (6+ months, £30-100K, industry standard). Timeline: Start 6-9 months before enterprise sales. ROI: Opens enterprise market (£100K+ deals worth investment)."
      },
      {
        q: "What's the minimum compliance program?",
        a: "Essential: (1) Privacy policy (public, what data you collect), (2) Terms of service (liability, data handling), (3) DPA for customers (GDPR requirement), (4) Encryption (data at rest + transit), (5) Access controls (who can see data), (6) Audit logs (track access), (7) Incident response plan (what if breach?). Cost: £5-10K legal setup, then maintenance. Insurance: Get cyber liability (£500K min), D&O coverage. Timeline: Do before raising Series A."
      },
      {
        q: "What happens if I don't comply?",
        a: "GDPR violations: Fines up to £20M or 4% of revenue (depending on severity). CCPA: £2500-£7500 per violation. SOC 2 missing: Can't sell to enterprise (lose market). Incident: If breach without proper incident response, fines higher + reputation damage. Insurance: Claims may be denied if you ignored warnings. Recommendation: Take compliance seriously, especially if handling sensitive data (health, finance, personal). Budget: 1-2% of revenue for compliance (insurance, legal, audit)."
      }
    ],
    videoUrl: ""
  }
];

export default batch210Articles;
