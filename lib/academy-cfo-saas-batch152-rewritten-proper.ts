import { AcademyArticle } from "@/types/academy";

export const batch152Articles: AcademyArticle[] = [
  {
    slug: "customer-data-privacy-and-gdpr-compliance",
    title: "Customer Data Privacy and GDPR Compliance: Protecting Customer Data and Your Company",
    description: "Master data privacy. Understand GDPR, build privacy-by-design, handle data requests, and protect company from regulatory risk.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "GDPR",
      "data privacy",
      "data protection",
      "privacy compliance",
      "data residency",
      "DPA",
      "data processing",
      "customer data",
      "privacy policy",
      "data breach"
    ],
    keyTakeaways: [
      "GDPR applies if: Serving EU customers (data residency required in EU). Penalties: £18M or 4% annual revenue (whichever higher). Example: £10M revenue company = £400K maximum fine per violation. Takes seriously. Requirements: Lawful basis for processing, consent, data processing agreement (DPA), privacy policy, data deletion rights, breach notification.",
      "Data processing agreement (DPA): Contract between you (data processor) and customer (data controller). Customer owns data, you store/process it. DPA covers: What data, how used, security measures, sub-processors (contractors you hire). Example: You process customer emails for analytics, DPA specifies you won't sell data, won't use for other purposes.",
      "Right to deletion: Customer can request \"erase all my data\". You must comply within 30 days (with exceptions: legal obligation to keep, automated backups). Impact: Cost to build deletion pipeline (3-4 weeks dev), comply with requests (process monthly). Budget: £10-20K setup, £500/month operations."
    ],
    content: [
      {
        heading: "GDPR Fundamentals",
        body: `Understanding the regulation and requirements.

**Who is affected?**

GDPR applies to:
- Companies serving EU customers (if you have EU users, GDPR applies)
- Personal data processing (names, emails, IPs, cookies = personal data)
- Data controller (customer, owns data) and processor (you, store data)

NOT affected by GDPR:
- Only US customers (no EU data)
- Anonymous data only (can't identify individuals)

**Key Principles**

Lawful basis for processing:
- You need legal reason to collect and process customer data
- Reasons: Consent (customer opts in), contract (needed for service), legal obligation
- Example: Collect email to send password reset = contract basis (needed for service)

Consent:
- Must be explicit, informed, easy to withdraw
- NOT: Opt-out (customer must say no), pre-checked boxes
- YES: Opt-in (customer says yes), clear explanation

Transparency:
- Privacy policy must explain: What data collected, why, how long kept, rights
- Must be clear (not legalese)

Security:
- Reasonable security measures to protect data
- Encryption, access controls, regular backups

Data minimization:
- Collect only what you need
- Don't collect "just in case"

**GDPR Rights**

Right to access:
- Customer can request "give me all data you have about me"
- You must provide within 30 days (usually)
- Cost: Build data export feature (3-4 weeks dev)

Right to rectification:
- Customer can correct wrong data
- You must update

Right to deletion ("right to be forgotten"):
- Customer can request "erase all my data"
- You must delete (with exceptions: legal obligation)
- Cost: Build deletion pipeline

Right to data portability:
- Customer can download data in standard format
- Enable switching to competitor

Right to restrict processing:
- Customer can say "don't use my data yet"
- You must pause processing, keep data safe

**Data Residency**

EU data must stay in EU:
- Server location matters
- AWS EU-Ireland, Google Cloud eu-west-1, etc.
- NOT: US data centers (violates GDPR)

Cost:
- EU servers more expensive (20-30% premium vs US)
- Infrastructure: Add cost, not optional

`
      },
      {
        heading: "Building Privacy-by-Design",
        body: `Making privacy a core part of product and operations.

**Privacy-by-Design Principles**

1. Data minimization
   - Collect only what needed
   - Example: Don't collect phone number if not used
   - Impact: Less data = lower risk if breached

2. Encryption
   - Data at rest (stored): Encrypted on servers
   - Data in transit (moving): HTTPS, TLS encryption
   - Example: Customer password encrypted, not stored as plain text

3. Access controls
   - Only employees who need data can access it
   - Example: Support can see customer account, but not CEO
   - Audit log: Track who accessed what, when

4. Data retention limits
   - Delete data after no longer needed
   - Example: Delete user account = delete all personal data within 30 days
   - Policy: Keep customer data 1 year post-churn, then delete

5. Privacy by default
   - Settings default to more private
   - Example: Email marketing opted-out by default (customer opts in)
   - NOT: Opted in by default (customer must opt out)

**Implementing Privacy**

Product design:
- Ask: Do we need this data? (if not, don't collect)
- Ask: How long to keep it? (if not forever, set retention)
- Implement: Data export feature, account deletion, consent management

Data processing:
- Document: What data we have, why, how long, who accesses
- Controls: Encryption, backups, access logs
- Incident plan: What if data breaches?

Employee access:
- Principle: Least privilege (access only what needed)
- Example: Support accesses customer account, not account password
- Audit: Monthly review of who has access to what

**Data Processing Agreement (DPA)**

Template sections:

1. Scope
   - What data (customer emails, usage logs, etc)
   - What processing (storage, analytics, backups)

2. Security
   - Encryption measures
   - Access controls
   - Incident response

3. Sub-processors
   - Contractors you hire (AWS, Salesforce, etc)
   - Customer must approve before hiring new processor

4. Data deletion
   - When data deleted (on request or retention period)
   - How deleted (encrypted, then destroyed)

5. Liability
   - Who liable if data breaches (usually you as processor)

Example clause: "Data will be encrypted both at rest and in transit using industry-standard methods. Access will be restricted to authorized personnel on a need-to-know basis. Customer can request data deletion within 30 days of request."

`
      },
      {
        heading: "Data Breach Response and Notification",
        body: `Handling incidents when data is compromised.

**Incident Response Plan**

Step 1: Detect (0-24 hours)
- Monitoring alerts: Unauthorized access, unusual data export
- Example: Someone downloaded 1M customer emails overnight
- Immediate action: Shut down access, investigate

Step 2: Investigate (24-48 hours)
- Determine scope: What data was accessed? Who accessed?
- Example: Intruder copied customer names and emails (no passwords)
- Assess: Could be used for phishing?

Step 3: Notify (within 72 hours)
- Notify regulator (data protection authority) if high risk
- Notify customers (if data could harm them)
- Example: If passwords exposed, notify customers to change password
- If only name/email (low risk), may not need to notify customers

Step 4: Remediate (ongoing)
- Fix the vulnerability (patch server, update code)
- Example: Change all passwords, enforce 2FA
- Monitor: Look for further suspicious activity

Step 5: Document
- Record what happened, how fixed, what learned
- Use to improve security going forward

**Notification Requirements**

Notify if:
- High-risk data (passwords, payment info, medical records)
- Large number of people affected (100+)
- Significant impact (data could be used for fraud)

NOT required if:
- Encrypted data (can't read without key)
- Low-risk data (public info like name)
- No evidence of actual harm

Example: Customer password database encrypted and stolen
- Encrypted = notification likely NOT required
- But update privacy policy anyway (transparency)

Notify customers: Email within 72 hours
- "We discovered unauthorized access, here's what was accessed"
- "Here's what we're doing to prevent future incidents"
- "Here's how to protect yourself"

Cost of breach:
- Notification: £10K-50K (legal, communication)
- Remediation: £50K-500K (security fixes, audit)
- Reputation: Variable (hard to measure)

Prevention > Cure (invest in security upfront).

`
      },
      {
        heading: "GDPR Compliance Timeline and Costs",
        body: `Getting compliant and staying compliant.

**Pre-launch checklist (before serving EU customers)**

2-3 months before launch:
- [ ] Privacy policy written (legal review)
- [ ] Data Processing Agreement (DPA) drafted
- [ ] Infrastructure in EU (data residency)
- [ ] Encryption enabled (data at rest and transit)
- [ ] Data deletion feature built
- [ ] Data export feature built
- [ ] Access controls documented
- [ ] Vendor review (sub-processors approved)
- [ ] Incident response plan written
- [ ] Data Protection Officer hired (or consultant engaged)

Cost: £20-50K (legal, engineering, process)

**Ongoing compliance (annual)**

- Quarterly: Audit access logs (who accessed what)
- Monthly: Test backups, verify retention policy
- Semi-annual: Security audit (internal or external)
- Annual: Update privacy policy (if processes change)
- As-needed: Process data deletion/export requests (in <30 days)

Cost: £10-20K annually (DPO part-time, audit, updates)

**Scaling (at £10M+ revenue)**

Hire dedicated role:
- Data Protection Officer (DPO) or Privacy Manager
- Responsible: Privacy policy, DPA, data handling, breaches
- Cost: £100-150K salary + benefits

Build team:
- Privacy engineer (security, encryption, access)
- Data governance (data catalog, retention policy)
- Incident response team (on-call for breaches)

Cost: £200-300K annually (team salaries)

**Common Mistakes**

Mistake 1: Pre-checked opt-in
- "Yes, send me marketing emails" checked by default
- GDPR violation: Must be unchecked, customer must opt in
- Fix: Uncheck by default, customer actively consents

Mistake 2: Vague privacy policy
- "We collect data to improve service"
- Too vague, doesn't explain what data or how
- Fix: Specific (we collect email, name, usage logs to X, Y, Z purposes)

Mistake 3: No data deletion
- "We keep all data forever"
- GDPR violation: Right to deletion after retention period
- Fix: Delete after 1 year post-churn or customer request

Mistake 4: Sub-processors not disclosed
- Hire Salesforce to store customer data, don't tell customer
- GDPR violation: Customer must approve sub-processors
- Fix: List all vendors in DPA, get approval

Mistake 5: No incident plan
- Data breaches happen, unprepared scramble
- Violate 72-hour notification requirement
- Fix: Have incident response plan, test annually

`
      }
    ],
    relatedSlugs: [
      "tax-planning-for-saas-and-startups",
      "financial-controls-audit-readiness",
      "international-expansion-and-multi-currency",
      "contract-management-and-service-level-agreements",
      "exit-planning-and-m-and-a-preparation"
    ],
    faq: [
      {
        q: "Do I need to comply with GDPR?",
        a: "If you have ANY EU customers, yes. Applies to companies processing personal data of EU residents, regardless of where your company is located. Personal data = name, email, IP, cookies, usage logs. Penalties: £18M or 4% revenue (whichever higher). Takes seriously. Even early-stage companies must comply."
      },
      {
        q: "What do I need to do to be GDPR compliant?",
        a: "Pre-launch: Privacy policy, DPA with customers, EU data residency, encryption, data export/deletion features. Ongoing: Audit access logs, handle deletion requests, respond to data export requests within 30 days, handle breaches within 72 hours. Cost: £20-50K setup, £10-20K annually. Hire DPO or consultant if not expertise in-house."
      },
      {
        q: "What if a customer asks to delete their data?",
        a: "You must comply within 30 days (exceptions: legal obligation, backup). Process: Delete from live database, delete from backups (or wait for backup expiry), confirm deletion to customer. Cost: Build automation to handle requests, takes time. Budget: 3-4 weeks engineering to build, ongoing operational cost."
      },
      {
        q: "What happens if I have a data breach?",
        a: "Steps: (1) Detect, (2) Investigate scope, (3) Notify regulator if high-risk within 72 hours, (4) Notify customers if data could harm them, (5) Fix vulnerability. Cost: £10K-500K depending on scope. Prevention: Invest in security (encryption, access controls, monitoring). Have incident response plan and test annually."
      }
    ],
    videoUrl: ""
  }
];

export default batch152Articles;
