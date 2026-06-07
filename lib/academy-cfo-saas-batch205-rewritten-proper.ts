import { AcademyArticle } from "@/types/academy";

export const batch205Articles: AcademyArticle[] = [
  {
    slug: "due-diligence-preparation-for-investment",
    title: "Due Diligence Preparation for Investment: Preparing for Investor Scrutiny",
    description: "Master due diligence. Prepare documents, organize data, and pass investor scrutiny.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "due diligence",
      "investor due diligence",
      "data room",
      "fundraising",
      "document preparation",
      "financial diligence",
      "legal diligence",
      "technical diligence",
      "background check",
      "investment preparation"
    ],
    keyTakeaways: [
      "Due diligence timeline: Announcement (week 1, term sheet agreed) → Data room open (week 2) → Investor review (weeks 2-4) → Close (week 5-6). Items: Financials (3 years audited, monthly last 12 months), cap table (fully diluted), customer contracts (top 20), employee agreements (equity, NDA), IP (patents, trademarks), compliance (licenses, insurance). Incomplete = red flags (suggests hidden issues). Complete = confidence (company has nothing to hide). Budget: Legal + accounting fees £20-50K (CPA to prepare financials, lawyer to organize).",
      "Data room structure: Organized folders (financials, legal, customers, team, tech). 200-300 documents typical. Indexed (document list with descriptions). Password protected (only investors get access). Tracked (see who viewed what). Tools: Intralinks, Merrill DataSite, Citrix (costs £3-10K, or DIY with Dropbox/Google Drive). Access: Open to lead investor week 2, other investors week 3. Not shared: Pre-diligence (don't leak materials). Red flags if investor asks for docs not provided = time waster (walk away).",
      "Common issues found in due diligence: (1) Cap table errors (shares not properly issued = dilution surprises), (2) Incomplete documentation (contracts missing, verbal agreements), (3) Financial inconsistency (tax return vs. operating model, need explanation), (4) Employee issues (non-compete violations, equity disputes), (5) IP concerns (customer claims ownership, unclear founders own IP), (6) Compliance gaps (no business license, privacy policy wrong). Expect 10-20 issues, resolve 80% before close. If major issues (fraud, IP theft, not yours), deal dies."
    ],
    content: [
      {
        heading: "Due Diligence Process and Timeline",
        body: `Understanding the investor review process.

**Fundraising and DD Timeline**

Week 1: Announcement
- Term sheet signed (valuation, investment amount agreed)
- Announce to team (confidentiality required)
- Data room preparation begins (assign someone to organize)

Week 2-3: Data room opens
- Invite lead investor to access data room
- They begin review, ask clarifying questions
- Co-investors invited (week 3)
- Company answers questions in real-time (weekly call)

Week 4-5: Diligence deepening
- Investor conducts deep dives (financials, tech, contracts)
- Calls with CEO, CFO, CTO, head of sales
- Reference calls with customers (top 3-5)
- Technical audit (for tech companies)

Week 5-6: Final review and issues resolution
- Investor list issues (cap table, contracts, compliance)
- Company resolves (fixes, explains, provides docs)
- Deal dynamics: Major issues = renegotiate terms or walk
- Final approval from investor legal/compliance

Week 6: Closing
- Docs signed (investment agreement, cap table update)
- Funds transferred
- Announcement to market

Total timeline: 4-6 weeks typical (can extend if issues)

**Diligence workstreams**

1. Financial diligence (CFO led)
   - 3 years audited financial statements (P&L, balance sheet, cash flow)
   - Monthly actuals last 12 months (unaudited, but detail)
   - Revenue schedule (by customer, by tier, by cohort)
   - Headcount and payroll details
   - Burn rate and runway calculation
   - Key metrics (MRR, churn, CAC, LTV, NRR)

2. Legal diligence (lawyer led)
   - Cap table (cap table.xlsx, fully diluted)
   - Stock options/equity plan (board-approved)
   - Employment agreements (all employees, contractors)
   - IP assignment agreements (all team members own IP)
   - Customer contracts (top 20, master service agreements)
   - Vendor contracts (key vendors, payment terms)
   - Incorporation docs (certificate of incorporation, bylaws)
   - Board consents (all major decisions documented)
   - Compliance (business licenses, registrations, insurance)

3. Technical diligence (CTO led, or advisor)
   - Code repository (access to GitHub, BitBucket)
   - Architecture overview (system design, scalability)
   - Tech stack (languages, frameworks, dependencies)
   - Open source compliance (licenses, attribution)
   - Security practices (encryption, access controls, backups)
   - Uptime and reliability (SLA, monitoring, incident log)
   - Roadmap (planned improvements, tech debt)

4. Customer/operational diligence
   - Top customers (contracts, likelihood to stay)
   - Customer concentration (top 5 = % of revenue)
   - Churn history (monthly churn trend, reasons)
   - Sales pipeline (forecast accuracy, deal stage validation)
   - Team composition (org chart, key people)
   - Hiring plan (headcount plan, retention risk)

**Data room organization**

Typical structure (200-300 documents):

\`\`\`
DATA_ROOM/
├── Financial Documents/
│   ├── 2022 Audited Financials
│   ├── 2023 Audited Financials
│   ├── 2024 Monthly Actuals
│   ├── Budget vs Actual Analysis
│   ├── Revenue Schedule
│   ├── Headcount & Payroll
│   └── Metrics Dashboard
├── Legal Documents/
│   ├── Cap Table (fully diluted)
│   ├── Stock Ledger
│   ├── Equity Plan Documents
│   ├── Stock Option Agreements
│   ├── Employment Agreements (all)
│   ├── IP Assignment Agreements
│   ├── Incorporation Documents
│   └── Board Resolutions
├── Customer Documents/
│   ├── Top 20 Customer Contracts
│   ├── Master Service Agreement
│   ├── Customer Revenue Schedule
│   ├── Customer Concentration Analysis
│   └── Churn Analysis
├── Technical Documents/
│   ├── Architecture Overview
│   ├── Tech Stack Documentation
│   ├── Security Assessment
│   ├── Open Source License Compliance
│   └── Infrastructure & Uptime Report
├── Compliance Documents/
│   ├── Business Licenses & Registrations
│   ├── Insurance Policies
│   ├── Privacy Policy & GDPR Compliance
│   ├── Tax Returns (last 2 years)
│   └── Audit Reports (any)
└── Management Team/
    ├── Org Chart
    ├── Key Employee Info
    ├── Advisor List
    └── Board Member Info
\`\`\`

Document list (index):
- Excel sheet with columns: Document name, folder, description, status (complete/missing)
- Status: Complete = ready, Missing = not yet ready, In Progress = being prepared

`
      },
      {
        heading: "Common Issues and Resolution",
        body: `Identifying and fixing due diligence red flags.

**Top 10 DD Issues**

1. Cap table errors
   - Issue: Shares issued without proper board approval, equity not fully allocated
   - Impact: Investor concerned about ownership % and control
   - Fix: Cap table 3-way reconciliation (cap table sheet vs stock ledger vs equity plan), get missing board approvals
   - Timeline: 2-3 weeks

2. Missing or incorrect IP assignment
   - Issue: Employee doesn't have IP assignment agreement, unclear who owns code/patents
   - Impact: Investor concerned about IP ownership, customer risk
   - Fix: Get IP assignment from any missing employees, document all IP in assignment letter
   - Timeline: 1-2 weeks (if cooperative) or months (if dispute)

3. Incomplete financial records
   - Issue: Monthly actuals missing, unclear revenue calculation, no audit
   - Impact: Can't verify financial claims
   - Fix: Prepare last 12 months monthly actuals, get audit done (2-3 months) or accountant review (4-6 weeks)
   - Timeline: 4-6 weeks minimum

4. Customer concentration
   - Issue: Top 5 customers = 60% of revenue
   - Impact: Investor concerned about risk (if loses customers, major revenue loss)
   - Fix: Explain diversification plan, get customer references from tier 2-5 customers (showing they're sticky)
   - Timeline: 2-3 weeks

5. Revenue discrepancies
   - Issue: Revenue reported to investor differs from tax return or bank statements
   - Impact: Investor questions accuracy of financial reporting
   - Fix: Reconcile (explain timing differences, accruals, deferred revenue), provide documentation
   - Timeline: 1-2 weeks

6. Employment/contractor issues
   - Issue: Contractor without proper agreement, employee non-compete violations
   - Impact: Investor concerned about team stability, legal liability
   - Fix: Get all contractors/employees to sign agreements (non-compete, confidentiality, IP assignment)
   - Timeline: 2-4 weeks

7. Open source/IP compliance
   - Issue: Code uses open source licenses that aren't disclosed or tracked
   - Impact: Investor concerned about GPL violations, patent liability
   - Fix: Audit code for open source, document all licenses, get compliance review
   - Timeline: 2-4 weeks

8. Customer contract issues
   - Issue: Key customer has unusual terms (extended payment, price locks, early termination rights)
   - Impact: Revenue quality questions, margin impact
   - Fix: Provide context (explain why terms necessary for deal), get customer references, show long-term relationship
   - Timeline: 1-2 weeks

9. Compliance gaps
   - Issue: Missing business licenses, insurance, privacy policy, GDPR non-compliance
   - Impact: Regulatory risk, liability
   - Fix: Get licenses, insurance policies, update privacy policy, GDPR assessment
   - Timeline: 1-4 weeks

10. Key person risk
    - Issue: CTO/CEO has non-compete, resignation risk, or unclear role
    - Impact: Investor concerned about execution risk, key person departure
    - Fix: Get non-compete released/accepted, extend employment agreements, founder equity vesting
    - Timeline: 2-4 weeks

**Issue resolution process**

When investor raises issue:
1. Acknowledge: "We'll look into this and provide documentation by [date]"
2. Investigate: Talk to team, gather docs, understand root cause
3. Respond: Email with explanation + supporting docs
4. Confirm: "Does this address your concern?" (get investor confirmation)

Example:
- Issue raised: "We can't find IP assignment from engineer Smith"
- Investigation: He was hired month 1, no onboarding packet, IP assignment never signed
- Response: Email engineer, get signed IP assignment, send to investor
- Confirm: "IP assignment now on file, all 25 employees have IP assignments"

Major issues that kill deals:
- Fraud (financial misrepresentation)
- IP not owned by company (customer owns, or prior employer owns)
- Undisclosed litigation
- Material customer likely to churn
- Team departures (loss of key people)
- Regulatory violations (serious non-compliance)

If major issue found:
- Investor may walk away (deal dies)
- Or renegotiate (lower valuation, escrow money for liability)
- Honest companies: Disclose upfront (reduces surprise, easier negotiation)

`
      }
    ],
    relatedSlugs: [
      "funding-and-investment-rounds",
      "board-reports-and-financial-statements",
      "financial-controls-and-audit-readiness",
      "exit-planning-and-m-and-a-preparation",
      "investor-relations-and-communications"
    ],
    faq: [
      {
        q: "What documents do investors want in due diligence?",
        a: "Financial: 3 years audited, last 12 months monthly. Legal: Cap table (fully diluted), equity plans, employment agreements, IP assignments, top 20 customer contracts. Tech: Architecture, code repo access, security. Compliance: Licenses, insurance, privacy policy. Operational: Org chart, headcount plan, customer metrics. Total: 200-300 documents organized in data room. Missing docs = red flag (suggests hidden issues)."
      },
      {
        q: "How long does due diligence take?",
        a: "Timeline: Week 1 term sheet → Week 2-3 data room open → Week 4-5 deep diligence → Week 5-6 issue resolution → Week 6 close. Total: 4-6 weeks. Acceleration: Keep data room organized and complete, answer investor questions quickly. Delays: Missing docs, unresolved issues, team availability."
      },
      {
        q: "What are the most common due diligence issues?",
        a: "Top 10: (1) Cap table errors (missing approvals), (2) IP not assigned (employees don't have agreements), (3) Financials incomplete (no audit, inconsistencies), (4) Revenue concentration (top 5 = 60%), (5) Revenue discrepancies (tax vs reported), (6) Employee/contractor issues (no agreements), (7) Open source/IP compliance (GPL licenses), (8) Customer terms issues (extended payment, early exit), (9) Compliance gaps (licenses, GDPR), (10) Key person risk. Expect 10-20 issues, resolve 80% before close."
      },
      {
        q: "What should I do to prepare for due diligence?",
        a: "1-3 months before fundraising: (1) Clean up cap table (get all shares issued, board approvals documented), (2) Get IP assignments from all team (employees, contractors), (3) Prepare financials (last 3 years audited, last 12 months monthly), (4) Organize customer contracts (top 20 on file), (5) Ensure compliance (licenses, insurance, privacy policy). Build data room (organized folders, 200-300 docs). Budget: £20-50K for legal + accounting prep."
      }
    ],
    videoUrl: ""
  }
];

export default batch205Articles;
