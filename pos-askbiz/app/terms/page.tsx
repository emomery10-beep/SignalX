'use client'
import React from 'react'
import Link from 'next/link'

const COMPANY = 'AskBiz Ltd'
const EMAIL = 'legal@askbiz.co'
const PRIVACY_EMAIL = 'privacy@askbiz.co'
const LAST_UPDATED = '16 June 2026'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 style={{ fontSize: 19, fontWeight: 700, marginBottom: 14, letterSpacing: '-.01em', paddingBottom: 10, borderBottom: '1px solid var(--pos-border)', color: 'var(--pos-ink)' }}>{title}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 15, lineHeight: 1.75, color: 'var(--pos-muted)' }}>
        {children}
      </div>
    </div>
  )
}

export default function TermsPage() {
  return (
    <div style={{ background: 'var(--pos-bg)', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ maxWidth: 'min(780px, 100%)', margin: '0 auto', padding: 'clamp(20px, 4vw, 48px) clamp(16px, 4vw, 24px) 80px' }}>

        {/* Header */}
        <div style={{ marginBottom: 44 }}>
          <Link href="/" style={{ fontSize: 13, color: 'var(--pos-hint)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>← Back to POS</Link>
          <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--pos-hint)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 12 }}>Legal</div>
          <h1 style={{ fontSize: 'clamp(28px, 6vw, 36px)', fontWeight: 700, letterSpacing: '-.025em', marginBottom: 12, color: 'var(--pos-ink)' }}>Terms of Service</h1>
          <p style={{ fontSize: 15, color: 'var(--pos-muted)' }}>AskBiz POS · Last updated: {LAST_UPDATED}</p>
          <div style={{ marginTop: 20, padding: '14px 18px', borderRadius: 12, background: 'var(--pos-accent-pale)', border: '1px solid var(--pos-accent-ring)', fontSize: 14, color: 'var(--pos-muted)', lineHeight: 1.65 }}>
            <strong style={{ color: 'var(--pos-ink)' }}>Plain English:</strong> Use AskBiz POS fairly and legally. Your business data is yours. You are responsible for the staff and customer data you enter. We provide the service as-is. Either party can end the relationship. Disputes are resolved in England and Wales.
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>

          <Section title="1. Agreement">
            <p>These Terms of Service ("Terms") are a binding agreement between you ("you", the business owner) and {COMPANY}, incorporated in England and Wales ("AskBiz", "we", "us"), governing your use of the AskBiz POS application and related services (the "Service"). By creating an account or using the Service, you agree to these Terms and our <Link href="/privacy" style={{ color: 'var(--pos-accent)' }}>Privacy Policy</Link>. If you do not agree, do not use the Service.</p>
            <p>If you use the Service on behalf of a business, you confirm you have authority to bind that business to these Terms.</p>
          </Section>

          <Section title="2. The Service">
            <p>AskBiz POS provides point-of-sale, inventory, staff management, AI camera scanning, and logistics tools. We may add, change, or remove features over time. We aim for reliable uptime but do not guarantee uninterrupted access.</p>
          </Section>

          <Section title="3. Accounts & Staff Access">
            <p>You must provide accurate registration information and keep it current. You are responsible for all activity under your account, for issuing and securing staff PINs, and for ensuring your staff use the Service in line with these Terms.</p>
            <p>You must be at least 18 years old (or the age of majority in your jurisdiction) to open a business account. We may suspend or terminate accounts used fraudulently, abusively, or in breach of these Terms.</p>
          </Section>

          <Section title="4. Subscriptions & Payment">
            <p>Paid plans and per-seat pricing are described at checkout and billed in advance. Payments are processed by Stripe and Paystack. You authorise recurring charges to your payment method. You may cancel at any time, effective at the end of the current billing period. We do not refund partial periods except where required by law.</p>
            <p>If payment fails, we may retry and, after a grace period, downgrade or suspend access until payment succeeds.</p>
          </Section>

          <Section title="5. Acceptable Use">
            <p>You agree not to:</p>
            <ul style={{ paddingLeft: 22, margin: 0 }}>
              <li>Use the Service to process personal data without a lawful basis</li>
              <li>Upload malicious code or attempt to breach security</li>
              <li>Reverse engineer, scrape, or resell the Service without our consent</li>
              <li>Circumvent usage limits, authentication, or seat licensing</li>
              <li>Use the Service for any unlawful purpose</li>
            </ul>
          </Section>

          <Section title="6. Your Data & Data Protection">
            <p>You retain full ownership of your business data, including your inventory, transaction, staff, and customer records. You grant AskBiz a limited licence to process this data solely to provide the Service. We will never sell your data or use it to train AI models for unrelated purposes.</p>
            <p>Where you enter personal data of staff or customers, <strong>you are the data controller and AskBiz acts as your data processor.</strong> You are responsible for having a lawful basis and giving appropriate notices to those individuals. We process such data only on your instructions, as described in our <Link href="/privacy" style={{ color: 'var(--pos-accent)' }}>Privacy Policy</Link>. Sub-processors are listed there.</p>
          </Section>

          <Section title="7. AI Scanning & Outputs">
            <p>The Service uses AI to recognise products, price tags, and number plates from camera images. These outputs may contain errors. You are responsible for verifying scanned data (prices, products, plates) before relying on it. AskBiz does not guarantee accuracy and is not liable for decisions made solely on AI outputs without human review.</p>
          </Section>

          <Section title="8. Disclaimers & Liability">
            <p>The Service is provided "as is". To the maximum extent permitted by law, AskBiz&apos;s total liability for any claim is limited to the greater of the fees you paid in the prior 12 months or £100. We are not liable for indirect or consequential losses, including lost profits, revenue, or data. Nothing limits liability for death or personal injury caused by negligence, fraud, or anything that cannot be excluded by law.</p>
          </Section>

          <Section title="9. Termination">
            <p>You may close your account at any time. We may suspend or terminate your access if you materially breach these Terms or fail to pay. On termination, your access ends and we delete your data as described in the Privacy Policy, subject to legal retention requirements.</p>
          </Section>

          <Section title="10. Changes & Governing Law">
            <p>We may update these Terms and will notify you of material changes before they take effect. These Terms are governed by the laws of England and Wales, and disputes are subject to the exclusive jurisdiction of its courts.</p>
          </Section>

          <Section title="11. Contact">
            <p>Legal: <a href={`mailto:${EMAIL}`} style={{ color: 'var(--pos-accent)' }}>{EMAIL}</a> · Privacy: <a href={`mailto:${PRIVACY_EMAIL}`} style={{ color: 'var(--pos-accent)' }}>{PRIVACY_EMAIL}</a></p>
            <p>{COMPANY}, London, United Kingdom</p>
          </Section>

        </div>

        <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid var(--pos-border)', display: 'flex', gap: 18, flexWrap: 'wrap' }}>
          <Link href="/privacy" style={{ fontSize: 14, color: 'var(--pos-accent)', textDecoration: 'none' }}>Privacy Policy</Link>
          <Link href="/cookies" style={{ fontSize: 14, color: 'var(--pos-accent)', textDecoration: 'none' }}>Cookie Policy</Link>
          <Link href="/" style={{ fontSize: 14, color: 'var(--pos-hint)', textDecoration: 'none' }}>← Back to POS</Link>
        </div>

      </div>
    </div>
  )
}
