'use client'
import React from 'react'
import Link from 'next/link'
import { useLang } from '@/components/LanguageProvider'

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
  const { tc } = useLang()
  return (
    <div style={{ background: 'var(--pos-bg)', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ maxWidth: 'min(780px, 100%)', margin: '0 auto', padding: 'clamp(20px, 4vw, 48px) clamp(16px, 4vw, 24px) 80px' }}>

        {/* Header */}
        <div style={{ marginBottom: 44 }}>
          <Link href="/" style={{ fontSize: 13, color: 'var(--pos-hint)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>{tc('pos_terms.back_to_pos')}</Link>
          <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--pos-hint)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 12 }}>{tc('pos_terms.eyebrow')}</div>
          <h1 style={{ fontSize: 'clamp(28px, 6vw, 36px)', fontWeight: 700, letterSpacing: '-.025em', marginBottom: 12, color: 'var(--pos-ink)' }}>{tc('pos_terms.page_title')}</h1>
          <p style={{ fontSize: 15, color: 'var(--pos-muted)' }}>{tc('pos_terms.last_updated', { date: LAST_UPDATED })}</p>
          <div style={{ marginTop: 20, padding: '14px 18px', borderRadius: 12, background: 'var(--pos-accent-pale)', border: '1px solid var(--pos-accent-ring)', fontSize: 14, color: 'var(--pos-muted)', lineHeight: 1.65 }}>
            <strong style={{ color: 'var(--pos-ink)' }}>{tc('pos_terms.plain_english_label')}</strong> {tc('pos_terms.plain_english_body')}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>

          <Section title={tc('pos_terms.s1_title')}>
            <p>{tc('pos_terms.s1_p1_before', { company: COMPANY })}<Link href="/privacy" style={{ color: 'var(--pos-accent)' }}>{tc('pos_terms.s1_p1_link')}</Link>{tc('pos_terms.s1_p1_after')}</p>
            <p>{tc('pos_terms.s1_p2')}</p>
          </Section>

          <Section title={tc('pos_terms.s2_title')}>
            <p>{tc('pos_terms.s2_p1')}</p>
          </Section>

          <Section title={tc('pos_terms.s3_title')}>
            <p>{tc('pos_terms.s3_p1')}</p>
            <p>{tc('pos_terms.s3_p2')}</p>
          </Section>

          <Section title={tc('pos_terms.s4_title')}>
            <p>{tc('pos_terms.s4_p1')}</p>
            <p>{tc('pos_terms.s4_p2')}</p>
          </Section>

          <Section title={tc('pos_terms.s5_title')}>
            <p>{tc('pos_terms.s5_intro')}</p>
            <ul style={{ paddingLeft: 22, margin: 0 }}>
              <li>{tc('pos_terms.s5_item1')}</li>
              <li>{tc('pos_terms.s5_item2')}</li>
              <li>{tc('pos_terms.s5_item3')}</li>
              <li>{tc('pos_terms.s5_item4')}</li>
              <li>{tc('pos_terms.s5_item5')}</li>
            </ul>
          </Section>

          <Section title={tc('pos_terms.s6_title')}>
            <p>{tc('pos_terms.s6_p1')}</p>
            <p>{tc('pos_terms.s6_p2_before')}<strong>{tc('pos_terms.s6_p2_strong')}</strong>{tc('pos_terms.s6_p2_mid')}<Link href="/privacy" style={{ color: 'var(--pos-accent)' }}>{tc('pos_terms.s6_p2_link')}</Link>{tc('pos_terms.s6_p2_after')}</p>
          </Section>

          <Section title={tc('pos_terms.s7_title')}>
            <p>{tc('pos_terms.s7_p1')}</p>
          </Section>

          <Section title={tc('pos_terms.s8_title')}>
            <p>{tc('pos_terms.s8_p1')}</p>
          </Section>

          <Section title={tc('pos_terms.s9_title')}>
            <p>{tc('pos_terms.s9_p1')}</p>
          </Section>

          <Section title={tc('pos_terms.s10_title')}>
            <p>{tc('pos_terms.s10_p1')}</p>
          </Section>

          <Section title={tc('pos_terms.s11_title')}>
            <p>{tc('pos_terms.s11_legal_label')} <a href={`mailto:${EMAIL}`} style={{ color: 'var(--pos-accent)' }}>{EMAIL}</a> · {tc('pos_terms.s11_privacy_label')} <a href={`mailto:${PRIVACY_EMAIL}`} style={{ color: 'var(--pos-accent)' }}>{PRIVACY_EMAIL}</a></p>
            <p>{tc('pos_terms.s11_location', { company: COMPANY })}</p>
          </Section>

        </div>

        <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid var(--pos-border)', display: 'flex', gap: 18, flexWrap: 'wrap' }}>
          <Link href="/privacy" style={{ fontSize: 14, color: 'var(--pos-accent)', textDecoration: 'none' }}>{tc('pos_terms.footer_privacy')}</Link>
          <Link href="/cookies" style={{ fontSize: 14, color: 'var(--pos-accent)', textDecoration: 'none' }}>{tc('pos_terms.footer_cookies')}</Link>
          <Link href="/" style={{ fontSize: 14, color: 'var(--pos-hint)', textDecoration: 'none' }}>{tc('pos_terms.back_to_pos')}</Link>
        </div>

      </div>
    </div>
  )
}
