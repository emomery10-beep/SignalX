'use client'

import Link from 'next/link'
import { useState } from 'react'

const ACC = '#d08a59'
const BG  = '#f9f8f6'
const SF  = '#ffffff'
const TX  = '#1a1916'
const TX2 = '#6b6760'
const TX3 = '#a39e97'
const BD  = '#e8e6e1'

interface ChecklistItem {
  text: string
  note?: string
}
interface Checklist {
  id: string
  title: string
  subtitle: string
  icon: string
  color: string
  description: string
  sections: { heading: string; items: ChecklistItem[] }[]
}

const CHECKLISTS: Checklist[] = [
  {
    id: 'month-end-close',
    title: 'Month-End Close',
    subtitle: 'Finance & Accounting',
    icon: '📅',
    color: '#5b8dd9',
    description: 'A complete close process for SMEs — from reconciling bank accounts to locking the period and distributing management accounts.',
    sections: [
      {
        heading: 'Bank & Cash',
        items: [
          { text: 'Reconcile all bank accounts to statement' },
          { text: 'Clear outstanding bank items older than 30 days' },
          { text: 'Reconcile petty cash and credit card statements' },
          { text: 'Post bank charges and interest entries' },
        ],
      },
      {
        heading: 'Sales & Receivables',
        items: [
          { text: 'Ensure all sales invoices are raised and posted' },
          { text: 'Review debtors ledger — chase overdue invoices' },
          { text: 'Post any credit notes issued in the period' },
          { text: 'Reconcile accounts receivable control account' },
        ],
      },
      {
        heading: 'Purchases & Payables',
        items: [
          { text: 'Post all supplier invoices received' },
          { text: 'Accrue for invoices not yet received but costs incurred' },
          { text: 'Review creditors ledger for disputes or duplicates' },
          { text: 'Reconcile accounts payable control account' },
        ],
      },
      {
        heading: 'Payroll',
        items: [
          { text: 'Confirm payroll is processed and journals posted' },
          { text: 'Post employer NI and pension contributions' },
          { text: 'Reconcile PAYE liability to HMRC portal' },
        ],
      },
      {
        heading: 'Period-End Adjustments',
        items: [
          { text: 'Post depreciation for the period' },
          { text: 'Review and post prepayments and accruals' },
          { text: 'Post intercompany transactions if applicable' },
          { text: 'Review stock/inventory valuation if applicable' },
        ],
      },
      {
        heading: 'Review & Lock',
        items: [
          { text: 'Run trial balance — check for unusual items' },
          { text: 'Review P&L vs prior month and vs budget' },
          { text: 'Review balance sheet for unexpected movements' },
          { text: 'Lock the accounting period' },
          { text: 'Distribute management accounts pack' },
        ],
      },
    ],
  },
  {
    id: 'pre-fundraise',
    title: 'Pre-Fundraise Data Room',
    subtitle: 'Funding & Investment',
    icon: '🏦',
    color: '#1a5276',
    description: 'Everything investors will ask for before writing a cheque. Build this before the first meeting so you can move fast when interest is high.',
    sections: [
      {
        heading: 'Company & Legal',
        items: [
          { text: 'Certificate of Incorporation' },
          { text: 'Articles of Association (latest version)' },
          { text: 'Shareholders Agreement' },
          { text: 'Cap table — fully diluted, including options' },
          { text: 'Board meeting minutes (last 12 months)' },
          { text: 'Existing investor agreements and side letters' },
        ],
      },
      {
        heading: 'Financials',
        items: [
          { text: 'Statutory accounts (last 2–3 years)' },
          { text: 'Management accounts (last 12 months, month by month)' },
          { text: '3-year financial model with assumptions documented' },
          { text: '13-week cash flow forecast' },
          { text: 'Unit economics summary (CAC, LTV, payback period)' },
          { text: 'MRR/ARR history and cohort analysis if SaaS', note: 'SaaS/subscription businesses only' },
        ],
      },
      {
        heading: 'Commercial',
        items: [
          { text: 'Customer list (anonymised or with consent)' },
          { text: 'Top 10 customer contracts or summaries' },
          { text: 'Revenue by customer concentration analysis' },
          { text: 'Sales pipeline and CRM summary' },
          { text: 'Churn data and key customer case studies' },
        ],
      },
      {
        heading: 'Product & Technology',
        items: [
          { text: 'Product roadmap (12–18 months)' },
          { text: 'IP ownership confirmation (patents, trademarks, copyright)' },
          { text: 'Technology stack overview' },
          { text: 'Data security and privacy policy' },
          { text: 'Key supplier and vendor agreements' },
        ],
      },
      {
        heading: 'Team',
        items: [
          { text: 'Org chart (current and planned)' },
          { text: 'Founder and key management CVs / LinkedIn profiles' },
          { text: 'Employment contracts for key personnel' },
          { text: 'Option scheme rules and outstanding grants' },
        ],
      },
    ],
  },
  {
    id: 'product-launch',
    title: 'Product Launch',
    subtitle: 'Go-to-Market',
    icon: '🚀',
    color: '#e8734a',
    description: 'From internal sign-off to live — everything to check before, during, and after a product or feature launch.',
    sections: [
      {
        heading: 'Before Launch',
        items: [
          { text: 'Product QA completed and critical bugs resolved' },
          { text: 'Pricing confirmed and documented' },
          { text: 'Positioning and messaging agreed across team' },
          { text: 'Landing page / product page live and tested' },
          { text: 'Onboarding flow tested end-to-end' },
          { text: 'Support team briefed with FAQ and escalation path' },
          { text: 'Analytics and tracking events in place' },
          { text: 'Legal review completed (terms, privacy, disclaimers)' },
        ],
      },
      {
        heading: 'Launch Day',
        items: [
          { text: 'Email announcement sent to existing customers/waitlist' },
          { text: 'Social media posts scheduled or published' },
          { text: 'PR / press release distributed (if applicable)' },
          { text: 'Paid campaigns activated (if applicable)' },
          { text: 'All team members aware of launch and monitoring channels' },
          { text: 'On-call engineer confirmed for launch window' },
        ],
      },
      {
        heading: 'Post-Launch (48 hours)',
        items: [
          { text: 'Monitor error rates and performance metrics' },
          { text: 'Review sign-up / activation funnel data' },
          { text: 'Respond to all support tickets and social mentions' },
          { text: 'Capture early customer feedback' },
          { text: 'Log bugs and prioritise hotfixes' },
        ],
      },
      {
        heading: 'Post-Launch (1 week)',
        items: [
          { text: 'Review launch metrics vs targets (signups, activation, conversion)' },
          { text: 'Run retrospective with the team' },
          { text: 'Update roadmap based on early feedback' },
          { text: 'Send follow-up to early adopters' },
        ],
      },
    ],
  },
  {
    id: 'annual-business-review',
    title: 'Annual Business Review',
    subtitle: 'Strategy & Planning',
    icon: '🗓️',
    color: '#2c3e50',
    description: 'A structured end-of-year review to close out the year, assess performance, and set the direction for the next 12 months.',
    sections: [
      {
        heading: 'Financial Review',
        items: [
          { text: 'Revenue vs budget — explain the gap' },
          { text: 'Gross margin trend — improving or deteriorating?' },
          { text: 'EBITDA vs prior year and budget' },
          { text: 'Cash position and cash flow summary' },
          { text: 'Top 5 costs — are they proportionate to revenue growth?' },
          { text: 'Review outstanding debtors and creditors' },
        ],
      },
      {
        heading: 'Customer & Commercial',
        items: [
          { text: 'Total customers gained vs lost in the year' },
          { text: 'Net revenue retention / churn rate' },
          { text: 'Top 10 customers by revenue — any concentration risk?' },
          { text: 'Average order value or contract value trend' },
          { text: 'Customer satisfaction score (NPS or CSAT)' },
        ],
      },
      {
        heading: 'Team & Operations',
        items: [
          { text: 'Headcount change — hires, leavers, open roles' },
          { text: 'Revenue per employee trend' },
          { text: 'Key operational metrics vs targets' },
          { text: 'Major risks that materialised and how they were handled' },
          { text: 'Review all supplier contracts due for renewal' },
        ],
      },
      {
        heading: 'Strategy & Planning',
        items: [
          { text: 'Review goals set last year — achieved, partially achieved, missed' },
          { text: 'SWOT analysis for the year ahead' },
          { text: 'Set 3–5 strategic priorities for next year' },
          { text: 'Build annual budget and headcount plan' },
          { text: '3-year financial model updated' },
          { text: 'Key risks identified and mitigation plans drafted' },
        ],
      },
    ],
  },
  {
    id: 'new-hire-onboarding',
    title: 'New Hire Onboarding',
    subtitle: 'HR & People',
    icon: '👋',
    color: '#1e8449',
    description: 'A structured onboarding checklist to get a new team member productive, connected, and legally compliant from day one.',
    sections: [
      {
        heading: 'Before Start Date',
        items: [
          { text: 'Employment contract signed and returned' },
          { text: 'Right to work documents verified and copied' },
          { text: 'Equipment ordered and set up (laptop, phone, etc.)' },
          { text: 'System access requested (email, Slack, tools)' },
          { text: 'Payroll added to next payroll run' },
          { text: 'Pension auto-enrolment process initiated' },
          { text: 'Buddy or onboarding mentor assigned' },
          { text: 'Day 1 schedule prepared and shared' },
        ],
      },
      {
        heading: 'Day 1',
        items: [
          { text: 'Welcome meeting with manager and team' },
          { text: 'IT access confirmed and working' },
          { text: 'Company handbook and policies shared' },
          { text: 'Health and safety briefing completed' },
          { text: 'Office tour / remote setup walkthrough' },
          { text: 'GDPR and data handling training' },
        ],
      },
      {
        heading: 'Week 1',
        items: [
          { text: 'Introductions to all key stakeholders completed' },
          { text: 'Core tools and processes walked through' },
          { text: '30/60/90 day objectives agreed with manager' },
          { text: 'First 1:1 scheduled with manager' },
          { text: 'Access to all required systems confirmed' },
        ],
      },
      {
        heading: 'Month 1',
        items: [
          { text: 'Probation review meeting scheduled' },
          { text: '30-day check-in completed with manager and HR' },
          { text: 'Any training needs identified and booked' },
          { text: 'Performance goals documented in HR system' },
        ],
      },
    ],
  },
  {
    id: 'esg-readiness',
    title: 'ESG Readiness',
    subtitle: 'Sustainability',
    icon: '🌱',
    color: '#27ae60',
    description: 'Assess your business\'s ESG readiness and identify the quick wins and longer-term actions that matter to investors, enterprise customers, and regulators.',
    sections: [
      {
        heading: 'Environmental',
        items: [
          { text: 'Scope 1 emissions measured (direct: gas, company vehicles)' },
          { text: 'Scope 2 emissions measured (indirect: electricity)' },
          { text: 'Scope 3 emissions estimated (supply chain, business travel, waste)' },
          { text: 'Energy consumption tracked monthly' },
          { text: 'Waste reduction initiatives in place' },
          { text: 'Net zero or carbon reduction target set' },
        ],
      },
      {
        heading: 'Social',
        items: [
          { text: 'Pay gap analysis completed (gender, ethnicity)' },
          { text: 'DEI policy documented and communicated' },
          { text: 'Living wage (or above) paid to all employees' },
          { text: 'Supply chain labour standards checked' },
          { text: 'Community or charitable giving policy in place' },
          { text: 'Employee wellbeing programme in place' },
        ],
      },
      {
        heading: 'Governance',
        items: [
          { text: 'Board has appropriate diversity of skills and backgrounds' },
          { text: 'Anti-bribery and corruption policy documented' },
          { text: 'Whistleblowing policy in place' },
          { text: 'Data privacy policy (GDPR-compliant) current' },
          { text: 'Supplier code of conduct in place' },
          { text: 'Financial controls and audit process reviewed' },
        ],
      },
      {
        heading: 'Reporting',
        items: [
          { text: 'ESG data collected in a consistent, auditable way' },
          { text: 'ESG section included in annual report or website' },
          { text: 'Customer or investor ESG questionnaires completed' },
          { text: 'Roadmap for improvement published internally' },
        ],
      },
    ],
  },
]

export default function ChecklistsPageClient() {
  const [active, setActive] = useState<string | null>(null)
  const [checked, setChecked] = useState<Set<string>>(new Set())

  const activeChecklist = CHECKLISTS.find(c => c.id === active)

  function toggle(key: string) {
    setChecked(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  const totalItems = activeChecklist?.sections.reduce((acc, s) => acc + s.items.length, 0) ?? 0
  const checkedCount = activeChecklist
    ? activeChecklist.sections.reduce((acc, s, si) =>
        acc + s.items.filter((_, ii) => checked.has(`${activeChecklist.id}-${si}-${ii}`)).length, 0)
    : 0
  const pct = totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0

  return (
    <div style={{ fontFamily: 'DM Sans, system-ui', background: BG, minHeight: '100vh' }}>
      <style>{`
        .cl-card { cursor: pointer; transition: transform 140ms, box-shadow 140ms; }
        .cl-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.1) !important; }
        .cl-back { background: none; border: none; cursor: pointer; font-family: DM Sans, system-ui; }
        .cl-back:hover { text-decoration: underline; }
        .cl-item { display: flex; gap: 12px; padding: 11px 0; border-bottom: 1px solid ${BD}; align-items: flex-start; cursor: pointer; }
        .cl-item:last-child { border-bottom: none; }
        .cl-item:hover .cl-check { border-color: ${ACC} !important; }
      `}</style>

      {/* Nav */}
      <nav style={{ borderBottom: `1px solid ${BD}`, background: SF, padding: '0 clamp(16px,4vw,24px)', height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: TX }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: ACC, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="12" height="12" viewBox="0 0 32 32" fill="none">
              <rect x="3" y="22" width="5" height="7" rx="1.5" fill="white" opacity="0.5"/>
              <rect x="11" y="16" width="5" height="13" rx="1.5" fill="white" opacity="0.75"/>
              <rect x="19" y="9" width="5" height="20" rx="1.5" fill="white"/>
            </svg>
          </div>
          <span style={{ fontFamily: 'Sora, system-ui', fontSize: 15, fontWeight: 700, letterSpacing: '-.025em' }}>AskBiz</span>
        </Link>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <Link href="/academy" style={{ fontSize: 13, color: TX2, textDecoration: 'none' }}>← Academy</Link>
          <Link href="/signin" style={{ fontSize: 13, fontWeight: 600, color: SF, background: ACC, borderRadius: 9999, padding: '7px 18px', textDecoration: 'none' }}>Try free →</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: 'clamp(32px,4vw,56px) clamp(16px,4vw,32px)' }}>

        {/* Grid */}
        {!active && (
          <>
            <div style={{ marginBottom: 40 }}>
              <h1 style={{ fontFamily: 'Sora, system-ui', fontSize: 'clamp(24px,3vw,34px)', fontWeight: 700, color: TX, marginBottom: 10, letterSpacing: '-.025em' }}>
                Business Checklists
              </h1>
              <p style={{ fontSize: 15, color: TX2, maxWidth: 560, lineHeight: 1.6 }}>
                Practical, interactive checklists for the most important business processes. Click any item to mark it done — progress is saved in your session.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 18 }}>
              {CHECKLISTS.map(cl => {
                const total = cl.sections.reduce((a, s) => a + s.items.length, 0)
                const done  = cl.sections.reduce((a, s, si) =>
                  a + s.items.filter((_, ii) => checked.has(`${cl.id}-${si}-${ii}`)).length, 0)
                const p = total > 0 ? Math.round((done / total) * 100) : 0
                return (
                  <div
                    key={cl.id}
                    className="cl-card"
                    onClick={() => setActive(cl.id)}
                    style={{ background: SF, border: `1px solid ${BD}`, borderRadius: 14, padding: '22px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
                  >
                    <div style={{ fontSize: 28, marginBottom: 12 }}>{cl.icon}</div>
                    <div style={{ fontFamily: 'Sora, system-ui', fontSize: 15, fontWeight: 700, color: TX, marginBottom: 3 }}>{cl.title}</div>
                    <div style={{ fontSize: 12, color: TX3, marginBottom: 10 }}>{cl.subtitle}</div>
                    <p style={{ fontSize: 12, color: TX2, lineHeight: 1.55, marginBottom: 14 }}>
                      {cl.description.slice(0, 80)}…
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 11, color: TX3 }}>{total} items</span>
                      {done > 0 && (
                        <span style={{ fontSize: 11, color: '#27ae60', fontWeight: 600 }}>{p}% done</span>
                      )}
                    </div>
                    {done > 0 && (
                      <div style={{ height: 3, background: BD, borderRadius: 9999, marginTop: 8, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${p}%`, background: cl.color, borderRadius: 9999, transition: 'width 300ms' }} />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </>
        )}

        {/* Active checklist */}
        {active && activeChecklist && (
          <>
            <button className="cl-back" onClick={() => setActive(null)} style={{ fontSize: 13, color: ACC, fontWeight: 500, marginBottom: 28 }}>
              ← All checklists
            </button>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 20 }}>
              <div style={{ fontSize: 36, flexShrink: 0 }}>{activeChecklist.icon}</div>
              <div>
                <h1 style={{ fontFamily: 'Sora, system-ui', fontSize: 'clamp(20px,3vw,28px)', fontWeight: 700, color: TX, margin: 0, letterSpacing: '-.02em' }}>{activeChecklist.title}</h1>
                <div style={{ fontSize: 13, color: TX3, marginTop: 2 }}>{activeChecklist.subtitle} · {totalItems} items</div>
              </div>
            </div>

            <p style={{ fontSize: 14, color: TX2, lineHeight: 1.65, marginBottom: 28, maxWidth: 620 }}>{activeChecklist.description}</p>

            {/* Progress bar */}
            <div style={{ background: SF, border: `1px solid ${BD}`, borderRadius: 12, padding: '14px 18px', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ flex: 1, height: 8, background: BD, borderRadius: 9999, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: activeChecklist.color, borderRadius: 9999, transition: 'width 300ms' }} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: pct === 100 ? '#27ae60' : activeChecklist.color, flexShrink: 0 }}>
                {checkedCount}/{totalItems} {pct === 100 ? '✓ Complete' : `(${pct}%)`}
              </span>
            </div>

            {activeChecklist.sections.map((section, si) => (
              <div key={si} style={{ marginBottom: 28 }}>
                <h2 style={{ fontFamily: 'Sora, system-ui', fontSize: 15, fontWeight: 700, color: TX, marginBottom: 4, letterSpacing: '-.01em' }}>{section.heading}</h2>
                <div style={{ background: SF, border: `1px solid ${BD}`, borderRadius: 12, padding: '4px 16px' }}>
                  {section.items.map((item, ii) => {
                    const key = `${active}-${si}-${ii}`
                    const done = checked.has(key)
                    return (
                      <div key={ii} className="cl-item" onClick={() => toggle(key)}>
                        <div
                          className="cl-check"
                          style={{
                            width: 18, height: 18, borderRadius: 4, border: `2px solid ${done ? activeChecklist.color : BD}`,
                            background: done ? activeChecklist.color : 'transparent',
                            flexShrink: 0, marginTop: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 150ms',
                          }}
                        >
                          {done && (
                            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                              <polyline points="2 6 5 9 10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, color: done ? TX3 : TX, textDecoration: done ? 'line-through' : 'none', lineHeight: 1.45 }}>
                            {item.text}
                          </div>
                          {item.note && (
                            <div style={{ fontSize: 11, color: TX3, marginTop: 2 }}>{item.note}</div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}

            {pct === 100 && (
              <div style={{ padding: '20px 24px', background: '#f0faf4', border: '1px solid #a3e4b8', borderRadius: 12, textAlign: 'center', marginTop: 8 }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>✅</div>
                <div style={{ fontFamily: 'Sora, system-ui', fontSize: 16, fontWeight: 700, color: '#1e7e34', marginBottom: 4 }}>Checklist complete!</div>
                <div style={{ fontSize: 13, color: '#2d8a47' }}>All {totalItems} items checked off.</div>
              </div>
            )}
          </>
        )}
      </div>

      <footer style={{ borderTop: `1px solid ${BD}`, padding: '20px clamp(16px,4vw,32px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, background: SF, marginTop: 48 }}>
        <span style={{ fontSize: 12, color: TX3 }}>© 2026 AskBiz. AI-powered business intelligence for SMEs.</span>
        <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
          {([['/', 'Home'], ['/academy', 'Academy'], ['/help', 'Help'], ['/blog', 'Blog']] as [string,string][]).map(([href, label]) => (
            <Link key={href} href={href} style={{ fontSize: 12, color: TX3, textDecoration: 'none' }}>{label}</Link>
          ))}
        </div>
      </footer>
    </div>
  )
}
