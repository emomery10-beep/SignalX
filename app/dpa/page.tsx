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

function P({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <p style={{ fontSize: 15, lineHeight: 1.85, color: 'var(--tx2)', marginBottom: 12, ...style }}>{children}</p>
}

function Li({ children }: { children: React.ReactNode }) {
  return <li style={{ fontSize: 15, lineHeight: 1.85, color: 'var(--tx2)', marginBottom: 6 }}>{children}</li>
}

const SUBPROCESSORS: [string, string, string][] = [
  ['Supabase', 'Database, authentication, and file storage (PostgreSQL)', 'EU / US'],
  ['Anthropic (Claude API)', 'AI processing of camera images and text — receipt, product, document, and number-plate scanning', 'United States'],
  ['Vercel', 'Application hosting and serverless compute', 'Global edge / US'],
  ['Stripe', 'Card payment processing', 'US / EU'],
  ['Paystack', 'Payment processing (Africa)', 'Nigeria / South Africa'],
  ['GoCardless', 'Bank debit payment processing', 'EU / UK'],
  ['PayPal', 'Payment processing', 'US / EU'],
  ['M-Pesa (Safaricom Daraja)', 'Mobile money payment processing', 'Kenya'],
  ['Twilio / WhatsApp (Meta)', 'Customer SMS and WhatsApp messaging (receipts, notifications)', 'United States'],
  ['Resend', 'Transactional email delivery', 'United States'],
  ['Tavily', 'Web search for business intelligence queries (no customer PII)', 'United States'],
]

export default function DpaPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'var(--font-dm, DM Sans)' }}>
      <div style={{ maxWidth: 'min(760px, 100%)', margin: '0 auto', padding: 'clamp(20px, 4vw, 48px) clamp(14px, 4vw, 24px) 80px' }}>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <Link href="/privacy" style={{ fontSize: 13, color: 'var(--tx3)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>← Back to Privacy Policy</Link>
          <h1 style={{ fontFamily: 'var(--font-sora)', fontSize: 32, fontWeight: 700, marginBottom: 8, letterSpacing: '-.025em' }}>Data Processing Agreement</h1>
          <p style={{ fontSize: 14, color: 'var(--tx3)' }}>AskBiz Ltd · Last updated: 16 June 2026</p>
        </div>

        <Section title="1. Roles of the Parties">
          <P>This Data Processing Agreement ("DPA") forms part of the agreement between AskBiz Ltd ("AskBiz", "we", "Processor") and the business customer that uses AskBiz ("you", "Controller").</P>
          <P>When you use AskBiz to handle your own customers' personal data — for example their names, phone numbers, purchase history, parcel details, or photographs — <strong>you act as the data controller</strong> and <strong>AskBiz acts as a data processor</strong> on your behalf. You decide what data is collected and why; we process it only to provide the service.</P>
          <P>For data about your own account (your name, email, billing), AskBiz is the controller — that processing is covered by our <Link href="/privacy" style={{ color: 'var(--ac, #d08a59)' }}>Privacy Policy</Link>.</P>
        </Section>

        <Section title="2. Subject Matter & Duration">
          <P><strong>Subject matter:</strong> AskBiz's processing of personal data on your behalf to provide the AskBiz POS and business-intelligence platform.</P>
          <P><strong>Duration:</strong> Processing continues for as long as your account is active, and thereafter only as required to comply with legal obligations (e.g. tax records are retained for up to 7 years; see Section 7).</P>
        </Section>

        <Section title="3. Nature & Purpose of Processing">
          <ul style={{ paddingLeft: 24 }}>
            <Li>Recording sales, transactions, and inventory</Li>
            <Li>Storing customer records and managing loyalty / consent preferences</Li>
            <Li>Sending receipts and notifications to your customers (subject to their consent)</Li>
            <Li>AI scanning of images you capture (products, receipts, documents, vehicle plates)</Li>
            <Li>Logistics: parcel tracking, vehicle inspections, and driver location for fleet management</Li>
            <Li>Generating reports and analytics for your business</Li>
          </ul>
        </Section>

        <Section title="4. Types of Data & Data Subjects">
          <P><strong>Categories of data subjects:</strong> your customers, your staff, and (for logistics) your drivers and parcel recipients.</P>
          <P><strong>Categories of personal data:</strong> names, phone numbers, email addresses, transaction and purchase history, staff roles and PINs (hashed), photographs (e.g. parcels, vehicle inspections, scanned documents), and driver GPS location. We do not require special-category data; please do not upload it.</P>
        </Section>

        <Section title="5. Our Obligations as Processor">
          <ul style={{ paddingLeft: 24 }}>
            <Li><strong>Documented instructions:</strong> we process personal data only on your documented instructions, which include your use of the platform's features.</Li>
            <Li><strong>Confidentiality:</strong> personnel authorised to process data are bound by confidentiality.</Li>
            <Li><strong>Security:</strong> we apply appropriate technical and organisational measures — encryption in transit, encryption of integration credentials at rest, hashed staff PINs, row-level security isolating each business's data, and access controls.</Li>
            <Li><strong>Assistance with data-subject requests:</strong> the platform provides tools to export and erase/anonymise customer records so you can fulfil access and erasure requests.</Li>
            <Li><strong>Breach notification:</strong> we will notify you without undue delay after becoming aware of a personal-data breach affecting your data.</Li>
            <Li><strong>Deletion / return:</strong> on termination, we delete or return personal data, subject to legal retention requirements.</Li>
          </ul>
        </Section>

        <Section title="6. Sub-processors">
          <P>You authorise AskBiz to engage the sub-processors listed below to help deliver the service. Each is bound by data-protection obligations consistent with this DPA. We will give you notice of any intended changes to this list so you may object.</P>
          <P style={{ fontSize: 13, color: 'var(--tx3)' }}>Note: customer data — including images you scan — is processed by Anthropic in the United States for AI features. International transfers rely on appropriate safeguards such as Standard Contractual Clauses (SCCs).</P>
          <div style={{ overflowX: 'auto', marginTop: 14 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: 'var(--ev)' }}>
                  {['Sub-processor', 'Purpose', 'Region'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, borderBottom: '2px solid var(--b2)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SUBPROCESSORS.map(([name, purpose, region]) => (
                  <tr key={name}>
                    <td style={{ padding: '10px 14px', borderBottom: '1px solid var(--b2)', fontWeight: 600 }}>{name}</td>
                    <td style={{ padding: '10px 14px', borderBottom: '1px solid var(--b2)', color: 'var(--tx2)' }}>{purpose}</td>
                    <td style={{ padding: '10px 14px', borderBottom: '1px solid var(--b2)', color: 'var(--tx2)', whiteSpace: 'nowrap' }}>{region}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="7. Retention & Deletion">
          <P>Customer records that become inactive are anonymised, and driver GPS location pings are purged, on an automated retention schedule. Transaction records are retained in anonymised form for up to 7 years to meet tax obligations. You may trigger erasure or export of an individual customer's data at any time from the customer management screen.</P>
        </Section>

        <Section title="8. International Transfers">
          <P>Some sub-processors process data outside the EU/UK (notably in the United States — see Section 6). Where this occurs, transfers are made under appropriate safeguards, principally the EU Standard Contractual Clauses and the UK International Data Transfer Addendum.</P>
        </Section>

        <Section title="9. Contact">
          <P>Questions about this DPA, or to request a counter-signed copy: <strong>dpa@askbiz.co</strong> · privacy@askbiz.co</P>
        </Section>

      </div>
    </div>
  )
}
