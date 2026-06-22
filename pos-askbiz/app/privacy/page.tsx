'use client'
import React from 'react'
import Link from 'next/link'
import { useLang } from '@/components/LanguageProvider'

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
  const { tc } = useLang()
  return (
    <div style={{ minHeight: '100vh', background: 'var(--pos-bg)', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ maxWidth: 'min(760px, 100%)', margin: '0 auto', padding: 'clamp(20px, 4vw, 48px) clamp(16px, 4vw, 24px) 80px' }}>

        {/* Header */}
        <div style={{ marginBottom: 44 }}>
          <Link href="/" style={{ fontSize: 13, color: 'var(--pos-hint)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>{tc('pos_privacy.back_to_pos')}</Link>
          <h1 style={{ fontSize: 'clamp(26px, 6vw, 32px)', fontWeight: 700, marginBottom: 8, letterSpacing: '-.02em', color: 'var(--pos-ink)' }}>{tc('pos_privacy.title')}</h1>
          <p style={{ fontSize: 14, color: 'var(--pos-hint)' }}>{tc('pos_privacy.meta')}</p>
        </div>

        <Section title={tc('pos_privacy.s1_title')}>
          <P>{tc('pos_privacy.s1_p1')}</P>
          <P><strong>{tc('pos_privacy.s1_p2_controller')}</strong>{tc('pos_privacy.s1_p2_mid')}<strong>{tc('pos_privacy.s1_p2_processor')}</strong>{tc('pos_privacy.s1_p2_end')}</P>
          <P>{tc('pos_privacy.s1_p3')}</P>
          <P>{tc('pos_privacy.s1_p4')}</P>
        </Section>

        <Section title={tc('pos_privacy.s2_title')}>
          <P><strong>{tc('pos_privacy.s2_p1_label')}</strong>{tc('pos_privacy.s2_p1_text')}</P>
          <P><strong>{tc('pos_privacy.s2_p2_label')}</strong>{tc('pos_privacy.s2_p2_text')}</P>
          <P><strong>{tc('pos_privacy.s2_p3_label')}</strong>{tc('pos_privacy.s2_p3_text')}</P>
          <P><strong>{tc('pos_privacy.s2_p4_label')}</strong>{tc('pos_privacy.s2_p4_text')}</P>
          <P><strong>{tc('pos_privacy.s2_p5_label')}</strong>{tc('pos_privacy.s2_p5_text')}</P>
          <P><strong>{tc('pos_privacy.s2_p6_label')}</strong>{tc('pos_privacy.s2_p6_text')}</P>
          <P><strong>{tc('pos_privacy.s2_p7_label')}</strong>{tc('pos_privacy.s2_p7_text')}</P>
          <P><strong>{tc('pos_privacy.s2_p8_label')}</strong>{tc('pos_privacy.s2_p8_text1')}<code>pos_staff</code>{tc('pos_privacy.s2_p8_text2')}</P>
        </Section>

        <Section title={tc('pos_privacy.s3_title')}>
          <ul style={{ paddingLeft: 22, marginTop: 0 }}>
            <Li>{tc('pos_privacy.s3_li1')}</Li>
            <Li>{tc('pos_privacy.s3_li2')}</Li>
            <Li>{tc('pos_privacy.s3_li3')}</Li>
            <Li>{tc('pos_privacy.s3_li4')}</Li>
            <Li>{tc('pos_privacy.s3_li5')}</Li>
            <Li>{tc('pos_privacy.s3_li6')}</Li>
            <Li>{tc('pos_privacy.s3_li7')}</Li>
          </ul>
        </Section>

        <Section title={tc('pos_privacy.s4_title')}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: 'var(--pos-accent-pale)' }}>
                  {[tc('pos_privacy.s4_th_activity'), tc('pos_privacy.s4_th_basis'), tc('pos_privacy.s4_th_gdpr')].map(h => (
                    <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, borderBottom: '2px solid var(--pos-border)', color: 'var(--pos-ink)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  [tc('pos_privacy.s4_r1_activity'), tc('pos_privacy.s4_r1_basis'), 'Art. 6(1)(b)'],
                  [tc('pos_privacy.s4_r2_activity'), tc('pos_privacy.s4_r2_basis'), 'Art. 28'],
                  [tc('pos_privacy.s4_r3_activity'), tc('pos_privacy.s4_r3_basis'), 'Art. 6(1)(a)'],
                  [tc('pos_privacy.s4_r4_activity'), tc('pos_privacy.s4_r4_basis'), 'Art. 6(1)(b)'],
                  [tc('pos_privacy.s4_r5_activity'), tc('pos_privacy.s4_r5_basis'), 'Art. 6(1)(b)'],
                  [tc('pos_privacy.s4_r6_activity'), tc('pos_privacy.s4_r6_basis'), 'Art. 6(1)(f)'],
                  [tc('pos_privacy.s4_r7_activity'), tc('pos_privacy.s4_r7_basis'), 'Art. 6(1)(b)'],
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

        <Section title={tc('pos_privacy.s5_title')}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: 'var(--pos-accent-pale)' }}>
                  {[tc('pos_privacy.s5_th_type'), tc('pos_privacy.s5_th_retention')].map(h => (
                    <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, borderBottom: '2px solid var(--pos-border)', color: 'var(--pos-ink)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  [tc('pos_privacy.s5_r1_type'), tc('pos_privacy.s5_r1_retention')],
                  [tc('pos_privacy.s5_r2_type'), tc('pos_privacy.s5_r2_retention')],
                  [tc('pos_privacy.s5_r3_type'), tc('pos_privacy.s5_r3_retention')],
                  [tc('pos_privacy.s5_r4_type'), tc('pos_privacy.s5_r4_retention')],
                  [tc('pos_privacy.s5_r5_type'), tc('pos_privacy.s5_r5_retention')],
                  [tc('pos_privacy.s5_r6_type'), tc('pos_privacy.s5_r6_retention')],
                  [tc('pos_privacy.s5_r7_type'), tc('pos_privacy.s5_r7_retention')],
                  [tc('pos_privacy.s5_r8_type'), tc('pos_privacy.s5_r8_retention')],
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

        <Section title={tc('pos_privacy.s6_title')}>
          <P>{tc('pos_privacy.s6_p1')}</P>
          <P><strong>{tc('pos_privacy.s6_p2_label')}</strong>{tc('pos_privacy.s6_p2_text')}</P>
          <P><strong>{tc('pos_privacy.s6_p3_label')}</strong>{tc('pos_privacy.s6_p3_text1')}<strong>{tc('pos_privacy.s6_p3_email')}</strong>{tc('pos_privacy.s6_p3_text2')}</P>
          <P>{tc('pos_privacy.s6_p4')}</P>
        </Section>

        <Section title={tc('pos_privacy.s7_title')}>
          <P>{tc('pos_privacy.s7_p1')}</P>
          <ul style={{ paddingLeft: 22, marginTop: 0 }}>
            <Li><strong>{tc('pos_privacy.s7_li1_name')}</strong>{tc('pos_privacy.s7_li1_text')}</Li>
            <Li><strong>{tc('pos_privacy.s7_li2_name')}</strong>{tc('pos_privacy.s7_li2_text')}</Li>
            <Li><strong>{tc('pos_privacy.s7_li3_name')}</strong>{tc('pos_privacy.s7_li3_text')}</Li>
            <Li><strong>{tc('pos_privacy.s7_li4_name')}</strong>{tc('pos_privacy.s7_li4_text')}</Li>
            <Li><strong>{tc('pos_privacy.s7_li5_name')}</strong>{tc('pos_privacy.s7_li5_text')}</Li>
            <Li><strong>{tc('pos_privacy.s7_li6_name')}</strong>{tc('pos_privacy.s7_li6_text')}</Li>
            <Li><strong>{tc('pos_privacy.s7_li7_name')}</strong>{tc('pos_privacy.s7_li7_text')}</Li>
          </ul>
          <P>{tc('pos_privacy.s7_p2')}</P>
        </Section>

        <Section title={tc('pos_privacy.s8_title')}>
          <P>{tc('pos_privacy.s8_p1')}</P>
        </Section>

        <Section title={tc('pos_privacy.s9_title')}>
          <P>{tc('pos_privacy.s9_p1_text')}<Link href="/cookies" style={{ color: 'var(--pos-accent)', textDecoration: 'none' }}>{tc('pos_privacy.s9_p1_link')}</Link>{tc('pos_privacy.s9_p1_end')}</P>
        </Section>

        <Section title={tc('pos_privacy.s10_title')}>
          <P>{tc('pos_privacy.s10_p1')}</P>
        </Section>

        <div style={{ padding: '20px', borderRadius: 14, background: 'var(--pos-accent-pale)', border: '1px solid var(--pos-border)', fontSize: 13, color: 'var(--pos-muted)', lineHeight: 1.7 }}>
          <strong style={{ color: 'var(--pos-ink)' }}>{tc('pos_privacy.contact_title')}</strong><br/>
          {tc('pos_privacy.contact_privacy')}<br/>
          {tc('pos_privacy.contact_security')}<br/>
          {tc('pos_privacy.contact_company')}
        </div>

        <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid var(--pos-border)', display: 'flex', gap: 18, flexWrap: 'wrap' }}>
          <Link href="/terms" style={{ fontSize: 14, color: 'var(--pos-accent)', textDecoration: 'none' }}>{tc('pos_privacy.footer_terms')}</Link>
          <Link href="/cookies" style={{ fontSize: 14, color: 'var(--pos-accent)', textDecoration: 'none' }}>{tc('pos_privacy.footer_cookies')}</Link>
          <Link href="/" style={{ fontSize: 14, color: 'var(--pos-hint)', textDecoration: 'none' }}>{tc('pos_privacy.footer_back')}</Link>
        </div>
      </div>
    </div>
  )
}
