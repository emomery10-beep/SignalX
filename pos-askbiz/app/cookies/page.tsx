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

export default function CookiesPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--pos-bg)', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ maxWidth: 'min(760px, 100%)', margin: '0 auto', padding: 'clamp(20px, 4vw, 48px) clamp(16px, 4vw, 24px) 80px' }}>

        {/* Header */}
        <div style={{ marginBottom: 44 }}>
          <Link href="/" style={{ fontSize: 13, color: 'var(--pos-hint)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>← Back to POS</Link>
          <h1 style={{ fontSize: 'clamp(26px, 6vw, 32px)', fontWeight: 700, marginBottom: 8, letterSpacing: '-.02em', color: 'var(--pos-ink)' }}>Cookie Policy</h1>
          <p style={{ fontSize: 14, color: 'var(--pos-hint)' }}>AskBiz POS · Last updated: 16 June 2026</p>
        </div>

        <Section title="The short version">
          <P>AskBiz POS uses <strong>minimal, essential storage only</strong>. We do not run advertising cookies, and we currently use <strong>no third-party analytics or tracking</strong>. There is nothing to opt out of — only the storage needed to keep you signed in and let the app work.</P>
        </Section>

        <Section title="What we store">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: 'var(--pos-accent-pale)' }}>
                  {['Name', 'Type', 'Purpose', 'Duration'].map(h => (
                    <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, borderBottom: '2px solid var(--pos-border)', color: 'var(--pos-ink)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['pos_staff', 'localStorage', 'Keeps your staff sign-in session active', 'Until sign-out / browser clear'],
                  ['pos_consent_ack', 'localStorage', 'Remembers you dismissed the privacy notice', 'Persistent'],
                  ['supabase auth token', 'Cookie / localStorage', 'Authenticates your account session (essential)', 'Session'],
                  ['Offline sale cache', 'localStorage', 'Stores cash sales during connectivity loss', 'Until synced, then cleared'],
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

        <Section title="No analytics or advertising">
          <P>We do not use Google Analytics, advertising pixels, or any third-party tracking cookies in the POS. We do not sell data or share it with advertisers. Because the only storage we use is strictly necessary to deliver the service you asked for, consent is not required for it under the ePrivacy / PECR rules — but we still show a notice so you know what is happening.</P>
          <P>If we ever add optional analytics, we will update this page and add a proper accept/reject control before any such storage is set.</P>
        </Section>

        <Section title="Managing storage">
          <P>You can clear this storage at any time by signing out of the POS or clearing your browser&apos;s site data. Clearing it will sign you out and may discard any unsynced offline sales.</P>
        </Section>

        <Section title="More information">
          <P>See our <Link href="/privacy" style={{ color: 'var(--pos-accent)', textDecoration: 'none' }}>Privacy Policy</Link> for full detail on the data we process, or contact privacy@askbiz.co.</P>
        </Section>

        <div style={{ marginTop: 8, paddingTop: 24, borderTop: '1px solid var(--pos-border)', display: 'flex', gap: 18, flexWrap: 'wrap' }}>
          <Link href="/privacy" style={{ fontSize: 14, color: 'var(--pos-accent)', textDecoration: 'none' }}>Privacy Policy</Link>
          <Link href="/terms" style={{ fontSize: 14, color: 'var(--pos-accent)', textDecoration: 'none' }}>Terms of Service</Link>
          <Link href="/" style={{ fontSize: 14, color: 'var(--pos-hint)', textDecoration: 'none' }}>← Back to POS</Link>
        </div>
      </div>
    </div>
  )
}
