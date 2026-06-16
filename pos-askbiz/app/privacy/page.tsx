'use client'
import React from 'react'
import Link from 'next/link'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 14, paddingBottom: 10, borderBottom: '2px solid var(--pos-accent-ring)', color: 'var(--pos-ink)' }}>{title}</h2>
      {children}
    </div>
  )
}

function P({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <p style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--pos-muted)', marginBottom: 12, ...style }}>{children}</p>
}

function Li({ children }: { children: React.ReactNode }) {
  return <li style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--pos-muted)', marginBottom: 6 }}>{children}</li>
}

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--pos-bg)', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ maxWidth: 'min(760px, 100%)', margin: '0 auto', padding: 'clamp(20px, 4vw, 48px) clamp(16px, 4vw, 24px) 80px' }}>

        {/* Header */}
        <div style={{ marginBottom: 44 }}>
          <Link href="/" style={{ fontSize: 13, color: 'var(--pos-hint)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>← Back to POS</Link>
          <h1 style={{ fontSize: 'clamp(26px, 6vw, 32px)', fontWeight: 700, marginBottom: 8, letterSpacing: '-.02em', color: 'var(--pos-ink)' }}>Privacy Policy</h1>
          <p style={{ fontSize: 14, color: 'var(--pos-hint)' }}>AskBiz POS · AskBiz Ltd · Effective date: 16 June 2026 · Last updated: 16 June 2026</p>
        </div>

        <Section title="1. Who We Are & Our Role">
          <P>AskBiz POS (pos.askbiz.co) is a point-of-sale, inventory and logistics application operated by AskBiz Ltd ("AskBiz", "we", "us"). It is used by business owners to run sales, manage staff, track stock and coordinate deliveries.</P>
          <P><strong>The business owner is the data controller</strong> for the staff and customer personal data processed through their POS account — they decide what data is entered and why. <strong>AskBiz acts as the data processor</strong>, handling that data only to provide the service on the business owner&apos;s instructions.</P>
          <P>For data we collect directly to run our platform (account details, billing, security logs), AskBiz is the controller.</P>
          <P>Contact: privacy@askbiz.co</P>
        </Section>

        <Section title="2. Data We Process">
          <P><strong>Business owner / account data:</strong> Name, email, business type, country, and subscription details when an account is created.</P>
          <P><strong>Staff data:</strong> Staff names, roles, and PINs used to sign in to the POS. PINs are hashed (bcrypt) and never stored in plain text.</P>
          <P><strong>Customer data:</strong> Customer names and phone numbers (when provided for receipts or records), and the transaction history linked to them.</P>
          <P><strong>Transaction & inventory data:</strong> Products sold, quantities, prices, discounts, payment methods, timestamps, stock levels, and product details.</P>
          <P><strong>Photos & images:</strong> Camera images of products, barcodes, price tags, number plates, and vehicle inspections. Scan images are processed in real time — raw images are not retained on our servers; only the extracted data (e.g. product name, price, plate number) is kept.</P>
          <P><strong>Driver GPS / location data:</strong> If the logistics module is used, driver location and delivery routes are processed to track parcels and manage deliveries.</P>
          <P><strong>Technical data:</strong> Session information, device type, and security logs (e.g. failed login attempts) for fraud prevention.</P>
          <P><strong>Locally stored data:</strong> Your signed-in staff session is stored in your browser&apos;s local storage (key <code>pos_staff</code>) so the POS keeps you logged in. Offline cash sales are also held locally until they sync.</P>
        </Section>

        <Section title="3. Why We Process It (Purposes)">
          <ul style={{ paddingLeft: 22, marginTop: 0 }}>
            <Li>Operating the POS: sales, receipts, inventory and reporting</Li>
            <Li>Authenticating staff and securing the business account</Li>
            <Li>Processing payments via card and mobile money providers</Li>
            <Li>Scanning products, barcodes, price tags and number plates with AI</Li>
            <Li>Managing logistics: parcel tracking, routes, driver location and vehicle inspections</Li>
            <Li>Sending sales receipts via WhatsApp/SMS when a customer opts in</Li>
            <Li>Preventing fraud and abuse, and keeping the service secure</Li>
          </ul>
        </Section>

        <Section title="4. Lawful Basis">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: 'var(--pos-accent-pale)' }}>
                  {['Processing activity', 'Lawful basis', 'GDPR'].map(h => (
                    <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, borderBottom: '2px solid var(--pos-border)', color: 'var(--pos-ink)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Running the POS service for the business', 'Contract performance', 'Art. 6(1)(b)'],
                  ['Processing customer & transaction records', 'Controller (business) instruction', 'Art. 28'],
                  ['Sending receipts to customers', 'Customer consent', 'Art. 6(1)(a)'],
                  ['Camera / number-plate scanning', 'Contract performance', 'Art. 6(1)(b)'],
                  ['Driver GPS & delivery tracking', 'Contract performance', 'Art. 6(1)(b)'],
                  ['Fraud prevention & security logs', 'Legitimate interest', 'Art. 6(1)(f)'],
                  ['Payment processing', 'Contract performance', 'Art. 6(1)(b)'],
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--pos-border)', background: i % 2 === 0 ? 'var(--pos-surface)' : 'var(--pos-bg)' }}>
                    {row.map((cell, j) => (
                      <td key={j} style={{ padding: '9px 12px', fontSize: 13, color: 'var(--pos-muted)' }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="5. Data Retention">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: 'var(--pos-accent-pale)' }}>
                  {['Data type', 'Retention'].map(h => (
                    <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, borderBottom: '2px solid var(--pos-border)', color: 'var(--pos-ink)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Transaction & inventory history', 'Retained for accounting/tax compliance (typically 7 years); exportable or deletable on request'],
                  ['Customer phone numbers', '30 days, then automatically deleted'],
                  ['Staff PIN records', 'Hashed; failed-login logs kept 90 days then deleted'],
                  ['Camera scan images', 'Not stored — processed in real time only'],
                  ['Number-plate & vehicle inspection photos', '6 months'],
                  ['Logistics & delivery / GPS data', '12 months after delivery completion'],
                  ['Locally stored session (pos_staff)', 'Cleared on sign-out / browser clear'],
                  ['Offline sale data', 'Until synced to server, then cleared locally'],
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--pos-border)', background: i % 2 === 0 ? 'var(--pos-surface)' : 'var(--pos-bg)' }}>
                    {row.map((cell, j) => (
                      <td key={j} style={{ padding: '9px 12px', fontSize: 13, color: 'var(--pos-muted)' }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="6. Your Data-Subject Rights">
          <P>You have the right to access, correct, delete, restrict, port, and object to the processing of your personal data, and to withdraw consent at any time. These satisfy EU/UK GDPR and most other applicable privacy laws.</P>
          <P><strong>If you are a customer or staff member</strong> of a business that uses AskBiz POS, that business is the data controller. To access or erase your data, contact the business owner directly — they decide what data is held and can action your request in the POS.</P>
          <P><strong>AskBiz (as processor)</strong> will support any controller in fulfilling these requests, and will action requests relating to data we control (such as account or billing data). Email <strong>privacy@askbiz.co</strong> and we respond within 30 days.</P>
          <P>You may also lodge a complaint with your local data protection authority.</P>
        </Section>

        <Section title="7. Sub-Processors">
          <P>We use the following sub-processors, each bound by a data processing agreement and appropriate transfer safeguards (Standard Contractual Clauses where data leaves the EU/UK):</P>
          <ul style={{ paddingLeft: 22, marginTop: 0 }}>
            <Li><strong>Supabase</strong> — database & authentication hosting (AWS, EU West)</Li>
            <Li><strong>Anthropic</strong> — AI processing of scan images for product, price-tag and number-plate recognition (USA)</Li>
            <Li><strong>Stripe</strong> — card payment processing (PCI DSS Level 1)</Li>
            <Li><strong>Paystack</strong> — card & local payment processing (Africa)</Li>
            <Li><strong>WhatsApp / Meta</strong> — receipt delivery when a customer opts in (USA)</Li>
            <Li><strong>Twilio</strong> — SMS receipt and notification delivery (USA)</Li>
            <Li><strong>Vercel</strong> — application hosting and CDN (global edge)</Li>
          </ul>
          <P>We never sell your data and never share it with advertisers.</P>
        </Section>

        <Section title="8. Security">
          <P>We protect data using encrypted connections (TLS), bcrypt-hashed staff PINs, row-level security on our database, and scoped access controls. If a breach occurs that is likely to risk your rights, we notify the relevant authority within 72 hours and affected users without undue delay. Report security concerns to security@askbiz.co.</P>
        </Section>

        <Section title="9. Cookies & Local Storage">
          <P>The POS uses minimal essential storage only — it does not run advertising or third-party analytics cookies. See our <Link href="/cookies" style={{ color: 'var(--pos-accent)', textDecoration: 'none' }}>Cookie Policy</Link> for full detail.</P>
        </Section>

        <Section title="10. Changes">
          <P>We will notify business owners of any material changes to this policy before they take effect. Continued use of AskBiz POS after changes constitutes acceptance.</P>
        </Section>

        <div style={{ padding: '20px', borderRadius: 14, background: 'var(--pos-accent-pale)', border: '1px solid var(--pos-border)', fontSize: 13, color: 'var(--pos-muted)', lineHeight: 1.7 }}>
          <strong style={{ color: 'var(--pos-ink)' }}>Contact us</strong><br/>
          Privacy &amp; data rights: privacy@askbiz.co<br/>
          Security incidents: security@askbiz.co<br/>
          AskBiz Ltd · pos.askbiz.co
        </div>

        <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid var(--pos-border)', display: 'flex', gap: 18, flexWrap: 'wrap' }}>
          <Link href="/terms" style={{ fontSize: 14, color: 'var(--pos-accent)', textDecoration: 'none' }}>Terms of Service</Link>
          <Link href="/cookies" style={{ fontSize: 14, color: 'var(--pos-accent)', textDecoration: 'none' }}>Cookie Policy</Link>
          <Link href="/" style={{ fontSize: 14, color: 'var(--pos-hint)', textDecoration: 'none' }}>← Back to POS</Link>
        </div>
      </div>
    </div>
  )
}
