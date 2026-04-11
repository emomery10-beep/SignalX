import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy — AskBiz',
  description: 'How AskBiz collects, uses, and protects your personal data. GDPR, UK GDPR, and CCPA compliant.',
}

const LAST_UPDATED = '10 April 2026'
const COMPANY = 'AskBiz Ltd'
const EMAIL = 'privacy@askbiz.co'
const ADDRESS = 'AskBiz Ltd, London, United Kingdom'

export default function PrivacyPage() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', fontFamily: 'var(--font-dm, DM Sans, sans-serif)' }}>

      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, background: 'rgba(249,248,246,.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--b)', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 50 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: 'var(--tx)' }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: 'linear-gradient(135deg,#d08a59,#8c6fe0)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="11" height="11" viewBox="0 0 18 18" fill="none" stroke="#fff" strokeWidth="2.3" strokeLinecap="round"><polyline points="2,14 6,8 10,11 14,4"/></svg>
          </div>
          <span style={{ fontFamily: 'var(--font-sora, Sora)', fontSize: 15, fontWeight: 700 }}>AskBiz</span>
        </Link>
        <Link href="/signin" style={{ padding: '7px 16px', borderRadius: 9999, border: 'none', background: 'var(--acc)', color: '#fff', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
          Get started free
        </Link>
      </nav>

      <div style={{ maxWidth: 780, margin: '0 auto', padding: '52px 24px 80px' }}>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 12 }}>Legal</div>
          <h1 style={{ fontFamily: 'var(--font-sora, Sora)', fontSize: 36, fontWeight: 700, letterSpacing: '-.025em', marginBottom: 12 }}>Privacy Policy</h1>
          <p style={{ fontSize: 15, color: 'var(--tx2)' }}>Last updated: {LAST_UPDATED} · Effective date: {LAST_UPDATED}</p>
          <div style={{ marginTop: 20, padding: '14px 18px', borderRadius: 12, background: 'rgba(208,138,89,.06)', border: '1px solid rgba(208,138,89,.2)', fontSize: 14, color: 'var(--tx2)', lineHeight: 1.65 }}>
            <strong style={{ color: 'var(--tx)' }}>Plain English summary:</strong> We collect only what we need to run the service. We never sell your data. Your business data stays yours. You can delete everything at any time.
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>

          <Section title="1. Who we are">
            <p>{COMPANY} ("AskBiz", "we", "us", "our") is the data controller responsible for your personal data.</p>
            <p>Registered address: {ADDRESS}</p>
            <p>Data Protection contact: <a href={`mailto:${EMAIL}`} style={{ color: 'var(--acc)' }}>{EMAIL}</a></p>
            <p>AskBiz operates a business intelligence platform that allows users to upload business data and receive AI-powered analytical insights. We are subject to the UK General Data Protection Regulation (UK GDPR), the EU General Data Protection Regulation (EU GDPR 2016/679), and the California Consumer Privacy Act (CCPA) where applicable.</p>
          </Section>

          <Section title="2. Data we collect and why">
            <SubSection title="2.1 Account data">
              <p>When you create an account we collect: name, email address, business type, and country. Legal basis: <strong>Contract</strong> — necessary to provide the service.</p>
            </SubSection>
            <SubSection title="2.2 Business data you upload">
              <p>CSV, XLSX, or other files you upload ("Business Data") are processed solely to provide you with analytical responses. We do not use your Business Data to train AI models, sell to third parties, or share with any other user. Legal basis: <strong>Contract</strong>.</p>
              <p>Business Data is encrypted at rest (AES-256) and in transit (TLS 1.3). Files are stored in isolated per-user storage and are not accessible to other users or AskBiz employees without your explicit request.</p>
            </SubSection>
            <SubSection title="2.3 Usage data">
              <p>We collect anonymised usage data including: pages visited, features used, query counts, and session duration. This helps us improve the product. Legal basis: <strong>Legitimate interests</strong>.</p>
            </SubSection>
            <SubSection title="2.4 Payment data">
              <p>Payments are processed by Stripe, Inc. We do not store card numbers, CVV codes, or full payment details. We receive a tokenised reference and subscription status from Stripe. Stripe's privacy policy governs payment data handling.</p>
            </SubSection>
            <SubSection title="2.5 Communication data">
              <p>If you contact us by email, we retain that correspondence for up to 3 years to resolve disputes and improve support quality.</p>
            </SubSection>
            <SubSection title="2.6 Technical data">
              <p>IP address, browser type, device type, operating system, and referral source. Used for security monitoring, fraud prevention, and service improvement. Legal basis: <strong>Legitimate interests</strong>.</p>
            </SubSection>
          </Section>

          <Section title="3. How we use your data">
            <p>We use your data exclusively to:</p>
            <ul>
              <li>Provide and maintain the AskBiz platform</li>
              <li>Process your AI queries and return analytical responses</li>
              <li>Manage your account and subscription</li>
              <li>Send transactional emails (confirmations, alerts, invoices)</li>
              <li>Detect and prevent fraud or abuse</li>
              <li>Comply with legal obligations</li>
              <li>Improve the product through aggregated, anonymised analytics</li>
            </ul>
            <p>We do <strong>not</strong> use your data to: train AI models on your business data, serve advertising, sell or rent your data to any third party, or make automated decisions with legal or significant effects without human review.</p>
          </Section>

          <Section title="4. Data sharing and third parties">
            <p>We share data only with the following categories of processors, all bound by data processing agreements:</p>
            <Table
              headers={['Processor', 'Purpose', 'Location', 'Safeguard']}
              rows={[
                ['Supabase, Inc.', 'Database and authentication', 'USA / EU', 'SCCs + SOC2 Type II'],
                ['Anthropic, PBC', 'AI query processing', 'USA', 'SCCs + enterprise DPA'],
                ['Stripe, Inc.', 'Payment processing', 'USA / EU', 'SCCs + PCI-DSS Level 1'],
                ['Vercel, Inc.', 'Hosting and delivery', 'USA / EU', 'SCCs + SOC2 Type II'],
                ['Resend, Inc.', 'Transactional email', 'USA', 'SCCs'],
              ]}
            />
            <p>We do not transfer data to countries without adequate protection unless appropriate safeguards (Standard Contractual Clauses or equivalent) are in place.</p>
          </Section>

          <Section title="5. Data retention">
            <p>We retain your data for as long as your account is active. Upon account deletion:</p>
            <ul>
              <li>Account and profile data: deleted within <strong>30 days</strong></li>
              <li>Uploaded Business Data: deleted within <strong>7 days</strong></li>
              <li>Conversation history: deleted within <strong>30 days</strong></li>
              <li>Payment records: retained for <strong>7 years</strong> (legal obligation)</li>
              <li>Anonymised usage analytics: retained indefinitely (no personal data)</li>
            </ul>
            <p>You can request immediate deletion of your Business Data at any time from Settings → Delete my data, or by emailing <a href={`mailto:${EMAIL}`} style={{ color: 'var(--acc)' }}>{EMAIL}</a>.</p>
          </Section>

          <Section title="6. Your rights">
            <p>Depending on your location, you have the following rights:</p>
            <Table
              headers={['Right', 'What it means', 'Applies under']}
              rows={[
                ['Access', 'Receive a copy of your personal data', 'GDPR, UK GDPR, CCPA'],
                ['Rectification', 'Correct inaccurate data', 'GDPR, UK GDPR'],
                ['Erasure', 'Delete your account and all data', 'GDPR, UK GDPR, CCPA'],
                ['Portability', 'Export your data in machine-readable format', 'GDPR, UK GDPR'],
                ['Restriction', 'Limit how we process your data', 'GDPR, UK GDPR'],
                ['Objection', 'Object to legitimate interests processing', 'GDPR, UK GDPR'],
                ['Opt-out of sale', 'We do not sell data — right automatically met', 'CCPA'],
                ['Non-discrimination', 'Equal service regardless of privacy choices', 'CCPA'],
              ]}
            />
            <p>To exercise any right, email <a href={`mailto:${EMAIL}`} style={{ color: 'var(--acc)' }}>{EMAIL}</a>. We will respond within 30 days. We may ask you to verify your identity before fulfilling a request.</p>
            <p>If you are in the EU or UK and believe we have handled your data unlawfully, you have the right to lodge a complaint with your local supervisory authority (UK: ICO at ico.org.uk; EU: your national DPA).</p>
          </Section>

          <Section title="7. Cookies">
            <p>We use the following cookies:</p>
            <Table
              headers={['Cookie', 'Purpose', 'Duration']}
              rows={[
                ['sb-auth-token', 'Authentication session', 'Session'],
                ['signalx-preferences', 'User settings (currency, theme)', '1 year'],
                ['_vercel_analytics', 'Anonymous usage analytics', '30 days'],
              ]}
            />
            <p>We do not use advertising cookies or third-party tracking cookies. You can clear cookies in your browser settings at any time. Clearing the authentication cookie will sign you out.</p>
          </Section>

          <Section title="8. Security">
            <p>We implement industry-standard security measures including:</p>
            <ul>
              <li>TLS 1.3 encryption for all data in transit</li>
              <li>AES-256 encryption for data at rest</li>
              <li>Row-level security (RLS) in our database — users can only access their own data</li>
              <li>SOC 2 Type II compliant infrastructure providers</li>
              <li>Regular security reviews and penetration testing</li>
              <li>Staff access controls on a need-to-know basis</li>
              <li>Multi-factor authentication for all internal systems</li>
            </ul>
            <p>In the event of a data breach that is likely to result in a risk to your rights and freedoms, we will notify the relevant supervisory authority within 72 hours and affected users without undue delay, as required by GDPR Article 33.</p>
          </Section>

          <Section title="9. Children's privacy">
            <p>AskBiz is not directed at children under the age of 16. We do not knowingly collect personal data from children. If you believe we have inadvertently collected data from a child, please contact us immediately at <a href={`mailto:${EMAIL}`} style={{ color: 'var(--acc)' }}>{EMAIL}</a> and we will delete it promptly.</p>
          </Section>

          <Section title="10. Changes to this policy">
            <p>We may update this Privacy Policy from time to time. We will notify you of material changes by email and by displaying a prominent notice in the app at least 14 days before the changes take effect. Continued use of AskBiz after the effective date constitutes acceptance of the updated policy.</p>
            <p>All previous versions of this policy are archived and available on request.</p>
          </Section>

          <Section title="11. Contact us">
            <p>For any privacy-related questions, requests, or concerns:</p>
            <p><strong>Email:</strong> <a href={`mailto:${EMAIL}`} style={{ color: 'var(--acc)' }}>{EMAIL}</a></p>
            <p><strong>Post:</strong> {ADDRESS}</p>
            <p>We aim to respond to all privacy enquiries within 5 business days.</p>
          </Section>

        </div>

        {/* Footer links */}
        <div style={{ marginTop: 56, paddingTop: 28, borderTop: '1px solid var(--b)', display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          <Link href="/terms" style={{ fontSize: 14, color: 'var(--acc)', textDecoration: 'none' }}>Terms of Service</Link>
          <Link href="/" style={{ fontSize: 14, color: 'var(--tx3)', textDecoration: 'none' }}>← Back to AskBiz</Link>
        </div>

      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-sora, Sora)', fontSize: 20, fontWeight: 700, marginBottom: 16, letterSpacing: '-.01em', paddingBottom: 10, borderBottom: '1px solid var(--b)' }}>{title}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 15, lineHeight: 1.75, color: 'var(--tx2)' }}>
        {children}
      </div>
    </div>
  )
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 8 }}>
      <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--tx)', marginBottom: 8 }}>{title}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{children}</div>
    </div>
  )
}

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div style={{ overflowX: 'auto', margin: '8px 0' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr>
            {headers.map(h => <th key={h} style={{ padding: '8px 12px', textAlign: 'left', background: 'var(--ev)', borderBottom: '1px solid var(--b)', fontWeight: 600, color: 'var(--tx)', fontSize: 12, whiteSpace: 'nowrap' }}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--ev)' }}>
              {row.map((cell, j) => <td key={j} style={{ padding: '8px 12px', borderBottom: '1px solid var(--b)', color: 'var(--tx2)', lineHeight: 1.5 }}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
