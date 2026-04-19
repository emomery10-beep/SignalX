'use client'
import React from 'react'
import Link from 'next/link'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 44 }}>
      <h2 style={{ fontFamily: 'var(--font-sora)', fontSize: 18, fontWeight: 700, marginBottom: 14, paddingBottom: 10, borderBottom: '2px solid rgba(208,138,89,.3)' }}>{title}</h2>
      {children}
    </div>
  )
}

function P({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 15, lineHeight: 1.85, color: 'var(--tx2)', marginBottom: 12 }}>{children}</p>
}

function Li({ children }: { children: React.ReactNode }) {
  return <li style={{ fontSize: 15, lineHeight: 1.85, color: 'var(--tx2)', marginBottom: 6 }}>{children}</li>
}

function ConsentBox({ type, label, description, stored, notStored }: {
  type: string; label: string; description: string; stored: string[]; notStored: string[]
}) {
  return (
    <div style={{ padding: '18px 20px', borderRadius: 14, border: '1px solid var(--b2)', background: 'var(--ev)', marginBottom: 14 }}>
      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{label}</div>
      <p style={{ fontSize: 13, color: 'var(--tx2)', marginBottom: 10, lineHeight: 1.65 }}>{description}</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 12 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#22c55e', marginBottom: 4 }}>✓ What is stored</div>
          {stored.map((s, i) => <div key={i} style={{ fontSize: 12, color: 'var(--tx2)', marginBottom: 3 }}>• {s}</div>)}
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#f48080', marginBottom: 4 }}>✗ Never stored</div>
          {notStored.map((s, i) => <div key={i} style={{ fontSize: 12, color: 'var(--tx2)', marginBottom: 3 }}>• {s}</div>)}
        </div>
      </div>
    </div>
  )
}

function DeleteSection() {
  const [status, setStatus] = React.useState<'idle'|'loading'|'requested'|'cancelled'>('idle')
  const [scheduledFor, setScheduledFor] = React.useState<string|null>(null)
  const [error, setError] = React.useState('')

  React.useEffect(() => {
    fetch('/api/account').then(r => r.json()).then(d => {
      if (d.deletionRequest) { setStatus('requested'); setScheduledFor(d.deletionRequest.scheduled_for) }
    }).catch(() => {})
  }, [])

  if (status === 'requested') return (
    <div style={{ padding: '16px 20px', borderRadius: 14, border: '1px solid rgba(244,128,128,.3)', background: 'rgba(244,128,128,.06)' }}>
      <div style={{ fontWeight: 600, marginBottom: 6, color: '#f48080' }}>⚠ Deletion scheduled</div>
      <P>Your account is scheduled for permanent deletion on <strong>{scheduledFor ? new Date(scheduledFor).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '30 days from now'}</strong>.</P>
      <button onClick={async () => { setStatus('loading'); const d = await fetch('/api/account', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ action: 'cancel_deletion' }) }).then(r=>r.json()); if(d.success) setStatus('cancelled'); else { setError(d.error); setStatus('requested') } }}
        style={{ padding: '9px 20px', borderRadius: 9999, border: 'none', background: '#22c55e', color: '#fff', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
        Cancel deletion — keep my account
      </button>
    </div>
  )

  if (status === 'cancelled') return (
    <div style={{ padding: '14px 18px', borderRadius: 12, border: '1px solid rgba(34,197,94,.3)', background: 'rgba(34,197,94,.06)', fontSize: 14, color: '#22c55e', fontWeight: 500 }}>
      ✓ Deletion cancelled — your account is safe
    </div>
  )

  return (
    <div style={{ padding: '18px 20px', borderRadius: 14, border: '1px solid var(--b2)', background: 'var(--ev)' }}>
      {error && <P>{error}</P>}
      <P>Deleting your account will permanently remove all your data after a 30-day grace period. You can cancel the request at any time during those 30 days.</P>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 4 }}>
        <button onClick={async () => { if(!confirm('Request account deletion? You have 30 days to cancel.')) return; setStatus('loading'); const d = await fetch('/api/account', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ action: 'request_deletion' }) }).then(r=>r.json()); if(d.success) { setStatus('requested'); setScheduledFor(d.scheduled_for) } else { setError(d.error); setStatus('idle') } }}
          disabled={status === 'loading'}
          style={{ padding: '9px 18px', borderRadius: 9999, border: '1px solid rgba(244,128,128,.5)', background: 'transparent', color: '#f48080', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          {status === 'loading' ? 'Processing…' : 'Request account deletion'}
        </button>
        <a href="mailto:privacy@askbiz.co" style={{ padding: '9px 18px', borderRadius: 9999, border: '1px solid var(--b2)', background: 'transparent', color: 'var(--tx2)', fontFamily: 'inherit', fontSize: 13, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
          Email privacy@askbiz.co
        </a>
      </div>
    </div>
  )
}

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'var(--font-dm, DM Sans)' }}>
      <div style={{ maxWidth: 'min(760px, 100%)', margin: '0 auto', padding: 'clamp(20px, 4vw, 48px) clamp(14px, 4vw, 24px) 80px' }}>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <Link href="/" style={{ fontSize: 13, color: 'var(--tx3)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>← Back to AskBiz</Link>
          <h1 style={{ fontFamily: 'var(--font-sora)', fontSize: 32, fontWeight: 700, marginBottom: 8, letterSpacing: '-.025em' }}>Privacy Policy</h1>
          <p style={{ fontSize: 14, color: 'var(--tx3)' }}>AskBiz Ltd · Effective date: 10 April 2026 · Last updated: 13 April 2026</p>
        </div>

        <Section title="1. Who We Are">
          <P>AskBiz Ltd ("AskBiz", "we", "us") operates the AI-powered business intelligence platform at askbiz.co. We are the data controller for personal data processed through our platform.</P>
          <P>Contact: privacy@askbiz.co · legal@askbiz.co</P>
        </Section>

        <Section title="2. Data We Collect">
          <P><strong>Account data:</strong> Your name, email address, business type, and country when you register.</P>
          <P><strong>Usage data:</strong> Questions asked, files uploaded (metadata only — not content), features used, and session information.</P>
          <P><strong>Technical data:</strong> IP address hash (SHA-256 — raw IP never stored), browser type, and device information for fraud prevention and security.</P>
          <P><strong>Payment data:</strong> Processed entirely by Stripe. We never see or store your card details.</P>
          <P><strong>With your consent only — Financial data:</strong> If you opt in to financial data personalisation (see Section 6), we store aggregated financial metrics from your uploaded files.</P>
        </Section>

        <Section title="3. How We Use Your Data">
          <ul style={{ paddingLeft: 24 }}>
            <Li>Providing and improving the AskBiz service</Li>
            <Li>Authenticating your identity and securing your account</Li>
            <Li>Processing your subscription payments via Stripe</Li>
            <Li>Preventing fraud and abuse (IP hash analysis)</Li>
            <Li>Sending service-related emails (account confirmations, billing receipts)</Li>
            <Li>With your consent: personalising AI answers using your financial data</Li>
            <Li>With your consent: improving AI accuracy using anonymised sector data</Li>
          </ul>
        </Section>

        <Section title="4. Legal Basis for Processing">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: 'var(--ev)' }}>
                  {['Processing activity', 'Legal basis', 'Regulation'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, borderBottom: '2px solid var(--b2)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Account creation and authentication', 'Contract performance', 'GDPR Art. 6(1)(b)'],
                  ['AI analysis of your uploaded data', 'Contract performance', 'GDPR Art. 6(1)(b)'],
                  ['Fraud prevention via IP hashing', 'Legitimate interest', 'GDPR Art. 6(1)(f)'],
                  ['Payment processing', 'Contract performance', 'GDPR Art. 6(1)(b)'],
                  ['Financial data personalisation', 'Explicit consent', 'GDPR Art. 6(1)(a)'],
                  ['AI training and sector trends', 'Explicit consent', 'GDPR Art. 6(1)(a)'],
                  ['Service improvement analytics', 'Legitimate interest', 'GDPR Art. 6(1)(f)'],
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--b)', background: i % 2 === 0 ? 'var(--sf)' : 'var(--bg)' }}>
                    {row.map((cell, j) => (
                      <td key={j} style={{ padding: '9px 14px', fontSize: 13, color: 'var(--tx2)' }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="5. Anonymised Upload Analytics">
          <P>To improve AskBiz, we collect the following <strong>anonymised metadata</strong> when you upload files. This does not require separate consent as it falls under legitimate interest:</P>
          <ul style={{ paddingLeft: 24 }}>
            <Li>File type (CSV or Excel)</Li>
            <Li>Number of rows and columns</Li>
            <Li>Column header names only (e.g. "Revenue", "Stock") — never the data values</Li>
            <Li>Your business type and country from your profile</Li>
          </ul>
          <P><strong>We never store your actual data values, business names, customer records, or financial figures</strong> as part of standard analytics.</P>
        </Section>

        <Section title="6. Financial Data — Consent-Based Processing">
          <P>If you choose to enable financial data personalisation in Settings → Privacy, we store additional data to improve your AI experience. This processing is based entirely on your <strong>explicit, freely given consent</strong> which you can withdraw at any time.</P>

          <ConsentBox
            type="financial"
            label="Financial data personalisation (opt-in)"
            description="Stores aggregated financial metrics from your uploaded files to personalise AI answers and track your business trends over time."
            stored={[
              'Total revenue figures',
              'Average margin percentages',
              'Product category names',
              'Stock level summaries',
              'Product count',
            ]}
            notStored={[
              'Individual customer data',
              'Customer names or contacts',
              'Bank account details',
              'Employee information',
              'Supplier names or contracts',
              'Individual transaction records',
            ]}
          />

          <ConsentBox
            type="training"
            label="AI improvement and sector trends (opt-in)"
            description="Uses fully anonymised, aggregated data to improve AI answer quality and generate sector trend alerts for businesses in your industry."
            stored={[
              'Anonymised sector averages',
              'Industry trend indicators',
              'Regional performance patterns',
            ]}
            notStored={[
              'Any individually identifiable data',
              'Your business name',
              'Specific revenue figures',
              'Any data from fewer than 5 businesses',
            ]}
          />

          <P>Financial data is retained for <strong>24 months</strong> then automatically deleted. You can delete it sooner at any time in the Privacy section of our website.</P>
          <P>You can manage your consent settings at any time at <Link href="/settings" style={{ color: 'var(--acc)', textDecoration: 'none' }}>askbiz.co/settings</Link>.</P>
        </Section>

        <Section title="7. Sector Trend Alerts">
          <P>When you consent to AI improvement, you may receive alerts about trends detected across businesses in your sector — for example "UK retail margins have declined 8% this month." These alerts are:</P>
          <ul style={{ paddingLeft: 24 }}>
            <Li><strong>Fully anonymised</strong> — your business is never identifiable in any alert</Li>
            <Li><strong>Statistically protected</strong> — only generated when at least 5 businesses contribute to the signal</Li>
            <Li><strong>Sector-specific</strong> — you only receive alerts relevant to your business type and country</Li>
            <Li><strong>Not shared externally</strong> — sector trend data is never sold or shared with third parties</Li>
          </ul>
        </Section>

        <Section title="8. Data Sharing">
          <P>We share your data only with the following processors, all bound by appropriate data processing agreements:</P>
          <ul style={{ paddingLeft: 24 }}>
            <Li><strong>Supabase</strong> — database hosting (AWS EU West)</Li>
            <Li><strong>Anthropic</strong> — AI processing of your questions (USA — Standard Contractual Clauses apply)</Li>
            <Li><strong>Vercel</strong> — hosting and CDN (global edge)</Li>
            <Li><strong>Stripe</strong> — payment processing (PCI DSS Level 1)</Li>
          </ul>
          <P>We never sell your data. We never share your data with advertisers. We never share individual business data with other AskBiz users.</P>
        </Section>

        <Section title="9. Data Retention">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: 'var(--ev)' }}>
                  {['Data type', 'Retention period', 'Deletion'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, borderBottom: '2px solid var(--b2)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Account and profile data', '2 years after last activity', 'Automated'],
                  ['Uploaded files and parsed data', '12 months', 'Automated'],
                  ['Chat conversations', '12 months (or on request)', 'User-controlled'],
                  ['Financial snapshots (consented)', '24 months', 'Automated or on request'],
                  ['Billing and payment records', '7 years', 'Legal requirement'],
                  ['IP hash records', '12 months', 'Automated'],
                  ['Consent audit log', '3 years', 'Required for compliance'],
                  ['Deleted account data', '30-day grace period', 'Permanent after 30 days'],
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--b)', background: i % 2 === 0 ? 'var(--sf)' : 'var(--bg)' }}>
                    {row.map((cell, j) => (
                      <td key={j} style={{ padding: '9px 14px', fontSize: 13, color: 'var(--tx2)' }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="10. Your Rights">
          <P>Under UK GDPR, EU GDPR, and CCPA you have the following rights:</P>
          <ul style={{ paddingLeft: 24 }}>
            <Li><strong>Right of access</strong> — Request a copy of all data we hold about you</Li>
            <Li><strong>Right to erasure</strong> — Request deletion of your account and all data (30-day grace period applies)</Li>
            <Li><strong>Right to rectification</strong> — Correct inaccurate data in your profile</Li>
            <Li><strong>Right to portability</strong> — Receive your data in a machine-readable format</Li>
            <Li><strong>Right to object</strong> — Object to processing based on legitimate interest</Li>
            <Li><strong>Right to withdraw consent</strong> — Withdraw consent for financial data and AI training at any time via Settings → Privacy</Li>
            <Li><strong>CCPA opt-out</strong> — We do not sell personal data. There is nothing to opt out of.</Li>
          </ul>
          <P>To exercise any right, email privacy@askbiz.co. We respond within 30 days.</P>
        </Section>

        <Section title="11. Delete Your Account and Data">
          <P>You can request deletion of your account and all associated data below. There is a <strong>30-day grace period</strong> before permanent deletion to protect against accidental requests. You can cancel at any time during this period.</P>
          <P><strong>What gets deleted:</strong> Profile, conversations, uploads, financial snapshots, IP hashes, and all associated data. Billing records are retained for 7 years as required by law.</P>
          <DeleteSection />
        </Section>

        <Section title="12. Cookies">
          <P>AskBiz uses only essential cookies required for authentication. We do not use advertising cookies or third-party tracking cookies.</P>
          <ul style={{ paddingLeft: 24 }}>
            <Li><strong>supabase-auth-token</strong> — Authentication session (essential, session duration)</Li>
            <Li><strong>sb-refresh-token</strong> — Keeps you signed in (essential, 1 week)</Li>
          </ul>
        </Section>

        <Section title="13. Changes to This Policy">
          <P>We will notify you by email of any material changes to this policy at least 14 days before they take effect. Continued use of AskBiz after changes take effect constitutes acceptance of the updated policy.</P>
        </Section>

        <div style={{ padding: '20px', borderRadius: 14, background: 'var(--ev)', border: '1px solid var(--b)', fontSize: 13, color: 'var(--tx2)' }}>
          <strong>Contact us</strong><br/>
          Privacy queries: privacy@askbiz.co<br/>
          Legal matters: legal@askbiz.co<br/>
          General: hello@askbiz.co<br/>
          AskBiz Ltd, England and Wales
        </div>
      </div>
    </div>
  )
}
