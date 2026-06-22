'use client'
import React from 'react'
import Link from 'next/link'
import { useLang } from '@/components/LanguageProvider'

type Tc = (key: string, vars?: Record<string, string | number>) => string

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

const buildTableHeaders = (tc: Tc) => [
  tc('pos_cookies.table_header_name'),
  tc('pos_cookies.table_header_type'),
  tc('pos_cookies.table_header_purpose'),
  tc('pos_cookies.table_header_duration'),
]

const buildTableRows = (tc: Tc) => [
  [tc('pos_cookies.row_staff_name'), tc('pos_cookies.row_staff_type'), tc('pos_cookies.row_staff_purpose'), tc('pos_cookies.row_staff_duration')],
  [tc('pos_cookies.row_consent_name'), tc('pos_cookies.row_consent_type'), tc('pos_cookies.row_consent_purpose'), tc('pos_cookies.row_consent_duration')],
  [tc('pos_cookies.row_auth_name'), tc('pos_cookies.row_auth_type'), tc('pos_cookies.row_auth_purpose'), tc('pos_cookies.row_auth_duration')],
  [tc('pos_cookies.row_offline_name'), tc('pos_cookies.row_offline_type'), tc('pos_cookies.row_offline_purpose'), tc('pos_cookies.row_offline_duration')],
]

export default function CookiesPage() {
  const { tc } = useLang()
  return (
    <div style={{ minHeight: '100vh', background: 'var(--pos-bg)', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ maxWidth: 'min(760px, 100%)', margin: '0 auto', padding: 'clamp(20px, 4vw, 48px) clamp(16px, 4vw, 24px) 80px' }}>

        {/* Header */}
        <div style={{ marginBottom: 44 }}>
          <Link href="/" style={{ fontSize: 13, color: 'var(--pos-hint)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>{tc('pos_cookies.back_to_pos')}</Link>
          <h1 style={{ fontSize: 'clamp(26px, 6vw, 32px)', fontWeight: 700, marginBottom: 8, letterSpacing: '-.02em', color: 'var(--pos-ink)' }}>{tc('pos_cookies.page_title')}</h1>
          <p style={{ fontSize: 14, color: 'var(--pos-hint)' }}>{tc('pos_cookies.last_updated', { date: '16 June 2026' })}</p>
        </div>

        <Section title={tc('pos_cookies.short_version_title')}>
          <P>{tc('pos_cookies.short_version_body')}</P>
        </Section>

        <Section title={tc('pos_cookies.what_we_store_title')}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: 'var(--pos-accent-pale)' }}>
                  {buildTableHeaders(tc).map(h => (
                    <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, borderBottom: '2px solid var(--pos-border)', color: 'var(--pos-ink)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {buildTableRows(tc).map((row, i) => (
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

        <Section title={tc('pos_cookies.no_analytics_title')}>
          <P>{tc('pos_cookies.no_analytics_body_1')}</P>
          <P>{tc('pos_cookies.no_analytics_body_2')}</P>
        </Section>

        <Section title={tc('pos_cookies.managing_storage_title')}>
          <P>{tc('pos_cookies.managing_storage_body')}</P>
        </Section>

        <Section title={tc('pos_cookies.more_info_title')}>
          <P>
            {tc('pos_cookies.more_info_body_before')}
            <Link href="/privacy" style={{ color: 'var(--pos-accent)', textDecoration: 'none' }}>{tc('pos_cookies.more_info_privacy_link')}</Link>
            {tc('pos_cookies.more_info_body_after')}
          </P>
        </Section>

        <div style={{ marginTop: 8, paddingTop: 24, borderTop: '1px solid var(--pos-border)', display: 'flex', gap: 18, flexWrap: 'wrap' }}>
          <Link href="/privacy" style={{ fontSize: 14, color: 'var(--pos-accent)', textDecoration: 'none' }}>{tc('pos_cookies.footer_privacy')}</Link>
          <Link href="/terms" style={{ fontSize: 14, color: 'var(--pos-accent)', textDecoration: 'none' }}>{tc('pos_cookies.footer_terms')}</Link>
          <Link href="/" style={{ fontSize: 14, color: 'var(--pos-hint)', textDecoration: 'none' }}>{tc('pos_cookies.back_to_pos')}</Link>
        </div>
      </div>
    </div>
  )
}
