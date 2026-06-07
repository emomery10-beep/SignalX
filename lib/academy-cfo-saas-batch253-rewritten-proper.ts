import { AcademyArticle } from "@/types/academy";

export const batch253Articles: AcademyArticle[] = [
  {
    slug: "due-diligence-preparation-for-investment",
    title: "Due Diligence Preparation for Investment: Getting Investor-Ready",
    description: "Master due diligence. Organize data room, prepare materials, pass investor scrutiny.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["due diligence", "fundraising", "data room", "investor due diligence", "fundraising preparation", "legal documents", "financials"],
    keyTakeaways: [
      "Due diligence timeline: Series A (2-4 weeks due diligence), Series B (4-6 weeks), Series C (6-8 weeks). Phases: Initial (investor reviews basic docs, decides to advance), management (call with founder/team), technical (engineer reviews code, architecture), financial (accountant reviews financials, contracts), legal (lawyer reviews contracts, IP, employment). Prepare: Expected questions, clean materials (audited financials, contracts organized). Pain points: Messy accounting (reconcile early), missing contracts (find and organize), employment issues (resolve now), IP (ensure company owns). Cost: Due diligence support (lawyer, accountant) £20-50K, time 100+ hours CEO/CFO.",
      "Data room organization: Virtual data room (Intralinks, Merrill DataSite) = secure document repository. Structure: Company info (articles, cap table, cap management), financial (P&L, balance sheet, cash, projections), customers (contracts, top 10 customers, churn), product (roadmap, features, tech stack), team (org chart, resumes, employment agreements), legal (IP assignments, contracts, litigation, regulatory). Goal: Any investor question answered within 30 seconds (find document quickly). Update: As fundraising progresses, add new info (no hiding documents = trust killer).",
      "Common issues found in due diligence: Accounting (deferred revenue not tracked, revenue recognition wrong), contracts (customer contracts missing or poor terms, vendor contracts unfavorable), IP (employees didn't assign IP to company, third-party IP not licensed), employment (no employment agreements, stock options not issued properly), cap table (complicated, messy, need clean version). Cost to fix: £5-20K per issue (lawyer time, negotiations). Typical fix time: 2-8 weeks. Recommendation: Fix proactively before starting fundraising (much faster, better outcome)."
    ],
    content: [
      {
        heading: "Preparing for Investment Due Diligence",
        body: `Getting investment-ready.

**Due diligence timeline and process**

Series A (£1-3M round):
- Week 1-2: Initial diligence (basic docs, team calls)
- Week 2-3: Management presentation (business, financials)
- Week 3-4: Technical/financial review (deep dive)
- Week 4-6: Negotiations (terms, conditions)

Series B (£5-15M round):
- Week 1-2: Initial (review materials, decide to advance)
- Week 2-4: Management (multiple calls, deep questions)
- Week 4-6: Technical/financial (thorough review)
- Week 6-8: Legal (contracts, IP, employment)
- Week 8-10: Negotiations

Phases (typical):
1. Initial: Investor reads materials (weeks 1-2)
2. Management: Founder presents, answers questions (week 2-3)
3. Technical: Engineer reviews code, architecture (weeks 3-4)
4. Financial: Accountant reviews P&L, contracts, projections (weeks 3-4)
5. Legal: Lawyer reviews cap table, IP, employment, contracts (weeks 4-6)
6. Reference calls: Talk to customers, employees (weeks 4-6)

**Data room setup**

Virtual data room (example structure):
\`\`\`
1. Company & Governance
   - Articles of incorporation/bylaws
   - Board resolutions
   - Cap table (current, fully-diluted)
   - Cap management documents (grants, valuations)

2. Financial
   - P&L (monthly, last 2 years)
   - Balance sheet (quarterly)
   - Cash flow (monthly)
   - Audited financials (if available)
   - Tax returns

3. Customers
   - Top 10 customer contracts
   - Pricing history
   - Churn analysis (by cohort)
   - NRR calculation
   - Customer concentration risk

4. Product
   - Product roadmap (12-month)
   - Technical architecture diagram
   - Security documentation (SOC 2 if applicable)
   - Scalability analysis
   - Dependencies (third-party, open source)

5. Legal
   - Material contracts (customer, vendor, partnership)
   - IP assignment agreements (employees must assign)
   - Employment agreements (all employees)
   - Stock option plans
   - Any litigation or disputes

6. Team
   - Org chart
   - Employee list (names, titles, comp)
   - Advisor/investor list
   - Board composition

7. Regulatory
   - Compliance (GDPR, SOC 2, etc.)
   - Insurance (cyber, E&O)
   - Any regulatory issues
\`\`\`

Organization:
- Clear naming (Document_Name_Date.pdf)
- Version control (old versions archived)
- Index document (table of contents with timestamps)
- Updates (flag new documents)

**Common due diligence issues**

Financial issues:
- Problem: Accounting not ASC 606 compliant
- Fix: Hire accountant to restate (2-4 weeks, £10-20K)
- Prevent: Use Stripe, NetSuite (built-in ASC 606)

- Problem: Revenue not reconciled to bank deposits
- Fix: Accountant reconciles, explains variances (1-2 weeks, £5-10K)
- Prevent: Monthly reconciliation (routine practice)

Legal issues:
- Problem: Employees didn't assign IP to company
- Fix: Get assignments now (2-4 weeks, £2-5K per employee)
- Prevent: IP assignment in offer letter/agreement

- Problem: Customer contracts missing or poor terms
- Fix: Find contracts, renegotiate if needed (2-6 weeks, £5-20K)
- Prevent: Centralized contract management, legal review

Cap table issues:
- Problem: Complicated cap table, unclear ownership
- Fix: Hire cap table manager to clean up (2-4 weeks, £5-10K)
- Prevent: Use cap table software (Pulley, Carta)

Timeline to fix:
- Simple issues (financial cleanup): 1-2 weeks
- Legal issues (contracts, IP): 2-6 weeks
- Cap table issues: 2-4 weeks
- Complex issues (litigation, regulatory): 4-8 weeks

Recommendation: Fix proactively (before fundraising) = much faster

`
      }
    ],
    relatedSlugs: ["financial-planning-and-budgeting", "revenue-recognition-and-accounting-standards", "board-governance-and-fiduciary-duties"],
    faq: [
      { q: "How long does due diligence take?", a: "Series A: 2-4 weeks. Series B: 4-6 weeks. Series C: 6-8 weeks. Preparation: 2-4 weeks organizing data room before starting. Total: Expect 6-12 weeks from start of fundraising to close." },
      { q: "What documents do I need for due diligence?", a: "Financial: P&L, balance sheet, cash flow, tax returns. Customers: Top 10 contracts, churn, NRR. Legal: All material contracts, IP assignments, employment agreements. Cap table: Current and fully-diluted. Team: Org chart, employee list. Product: Roadmap, technical architecture. Compliance: GDPR, SOC 2, insurance." },
      { q: "What issues commonly come up in due diligence?", a: "Accounting: Revenue not ASC 606 compliant (fix: 2-4 weeks). Contracts: Missing customer/vendor contracts (fix: 1-2 weeks). IP: Employees didn't assign IP to company (fix: 2-4 weeks per employee). Cap table: Messy, unclear (fix: 2-4 weeks). Fix proactively before fundraising = much faster (don't wait for investor to find issues)." }
    ],
    videoUrl: ""
  }
];

export default batch253Articles;