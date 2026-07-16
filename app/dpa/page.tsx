'use client'
import React from 'react'
import Link from 'next/link'
import { useLang } from '@/components/LanguageProvider'
import { localePath, toLocale } from '@/lib/i18n-locale'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 44 }}>
      <h2 style={{ fontFamily: 'var(--font-sora)', fontSize: 16, fontWeight: 700, marginBottom: 14, paddingBottom: 10, borderBottom: '2px solid rgba(208,138,89,.3)' }}>{title}</h2>
      {children}
    </div>
  )
}

function P({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <p style={{ fontSize: 13, lineHeight: 1.85, color: 'var(--tx2)', marginBottom: 12, ...style }}>{children}</p>
}

function Li({ children }: { children: React.ReactNode }) {
  return <li style={{ fontSize: 13, lineHeight: 1.85, color: 'var(--tx2)', marginBottom: 6 }}>{children}</li>
}

function buildSubprocessors(tc: (key: string) => string): [string, string, string][] {
  const keys = ['supabase', 'anthropic', 'vercel', 'stripe', 'paystack', 'gocardless', 'paypal', 'mpesa', 'twilio', 'resend', 'tavily']
  return keys.map(k => [
    tc('dpa.sp_' + k + '_name'),
    tc('dpa.sp_' + k + '_purpose'),
    tc('dpa.sp_' + k + '_region'),
  ])
}

export default function DpaPage() {
  const { tc, lang } = useLang()
  const SUBPROCESSORS = buildSubprocessors(tc)
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'var(--font-dm, DM Sans)' }}>
      <div style={{ maxWidth: 'min(760px, 100%)', margin: '0 auto', padding: 'clamp(20px, 4vw, 48px) clamp(14px, 4vw, 24px) 80px' }}>

        {lang !== 'en' && (
          <div style={{ marginBottom: 24, padding: '12px 16px', borderRadius: 10, background: 'rgba(234,179,8,.08)', border: '1px solid rgba(234,179,8,.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, color: 'var(--tx2)', lineHeight: 1.5 }}>⚠️ {tc('common.legal_mt_notice')}</span>
            <Link href={localePath('/dpa', toLocale(lang))} style={{ fontSize: 11, fontWeight: 600, color: 'var(--acc, #d08a59)', whiteSpace: 'nowrap', textDecoration: 'none' }}>{tc('common.legal_mt_link')}</Link>
          </div>
        )}

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <Link href={localePath('/privacy', toLocale(lang))} style={{ fontSize: 11, color: 'var(--tx3)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>{tc('dpa.back_to_privacy')}</Link>
          <h1 style={{ fontFamily: 'var(--font-sora)', fontSize: 30, fontWeight: 700, marginBottom: 8, letterSpacing: '-.025em' }}>{tc('dpa.title')}</h1>
          <p style={{ fontSize: 12, color: 'var(--tx3)' }}>{tc('dpa.meta')}</p>
        </div>

        <Section title={tc('dpa.s1_title')}>
          <P>{tc('dpa.s1_p1')}</P>
          <P>{tc('dpa.s1_p2_pre')}<strong>{tc('dpa.s1_p2_b1')}</strong>{tc('dpa.s1_p2_mid')}<strong>{tc('dpa.s1_p2_b2')}</strong>{tc('dpa.s1_p2_post')}</P>
          <P>{tc('dpa.s1_p3_pre')}<Link href={localePath('/privacy', toLocale(lang))} style={{ color: 'var(--ac, #d08a59)' }}>{tc('dpa.s1_p3_link')}</Link>{tc('dpa.s1_p3_post')}</P>
        </Section>

        <Section title={tc('dpa.s2_title')}>
          <P><strong>{tc('dpa.s2_p1_b')}</strong>{tc('dpa.s2_p1_text')}</P>
          <P><strong>{tc('dpa.s2_p2_b')}</strong>{tc('dpa.s2_p2_text')}</P>
        </Section>

        <Section title={tc('dpa.s3_title')}>
          <ul style={{ paddingLeft: 24 }}>
            <Li>{tc('dpa.s3_li1')}</Li>
            <Li>{tc('dpa.s3_li2')}</Li>
            <Li>{tc('dpa.s3_li3')}</Li>
            <Li>{tc('dpa.s3_li4')}</Li>
            <Li>{tc('dpa.s3_li5')}</Li>
            <Li>{tc('dpa.s3_li6')}</Li>
          </ul>
        </Section>

        <Section title={tc('dpa.s4_title')}>
          <P><strong>{tc('dpa.s4_p1_b')}</strong>{tc('dpa.s4_p1_text')}</P>
          <P><strong>{tc('dpa.s4_p2_b')}</strong>{tc('dpa.s4_p2_text')}</P>
        </Section>

        <Section title={tc('dpa.s5_title')}>
          <ul style={{ paddingLeft: 24 }}>
            <Li><strong>{tc('dpa.s5_li1_b')}</strong>{tc('dpa.s5_li1_text')}</Li>
            <Li><strong>{tc('dpa.s5_li2_b')}</strong>{tc('dpa.s5_li2_text')}</Li>
            <Li><strong>{tc('dpa.s5_li3_b')}</strong>{tc('dpa.s5_li3_text')}</Li>
            <Li><strong>{tc('dpa.s5_li4_b')}</strong>{tc('dpa.s5_li4_text')}</Li>
            <Li><strong>{tc('dpa.s5_li5_b')}</strong>{tc('dpa.s5_li5_text')}</Li>
            <Li><strong>{tc('dpa.s5_li6_b')}</strong>{tc('dpa.s5_li6_text')}</Li>
          </ul>
        </Section>

        <Section title={tc('dpa.s6_title')}>
          <P>{tc('dpa.s6_p1')}</P>
          <P style={{ fontSize: 11, color: 'var(--tx3)' }}>{tc('dpa.s6_note')}</P>
          <div style={{ overflowX: 'auto', marginTop: 14 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ background: 'var(--ev)' }}>
                  {[tc('dpa.s6_col_subprocessor'), tc('dpa.s6_col_purpose'), tc('dpa.s6_col_region')].map(h => (
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

        <Section title={tc('dpa.s7_title')}>
          <P>{tc('dpa.s7_p1')}</P>
        </Section>

        <Section title={tc('dpa.s8_title')}>
          <P>{tc('dpa.s8_p1')}</P>
        </Section>

        <Section title={tc('dpa.s9_title')}>
          <P>{tc('dpa.s9_p1_pre')}<strong>{tc('dpa.s9_p1_b')}</strong>{tc('dpa.s9_p1_post')}</P>
        </Section>

      </div>
    </div>
  )
}
