import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Changelog — AskBiz POS',
  description: 'What changed recently in AskBiz POS: new features, fixes, and improvements.',
  alternates: { canonical: 'https://pos.askbiz.co/changelog' },
}

type ChangeType = 'new' | 'improved' | 'fixed'

interface Change { type: ChangeType; text: string }
interface Release { version: string; date: string; summary: string; changes: Change[] }

const TYPE_STYLE: Record<ChangeType, { label: string; bg: string; color: string; border: string }> = {
  new:      { label: 'New',      bg: '#e8f5e9', color: '#2e7d32', border: '#a5d6a7' },
  improved: { label: 'Improved', bg: '#e3f2fd', color: '#1565c0', border: '#90caf9' },
  fixed:    { label: 'Fixed',    bg: '#fff8e1', color: '#e65100', border: '#ffcc80' },
}

const RELEASES: Release[] = [
  {
    version: '2026.07', date: '2026-07-02',
    summary: 'Zakat-aware finance tools and trustworthy purchase-order payment tracking.',
    changes: [
      { type: 'new', text: 'Cash and payables now feed a zakat calculator with dual-metal nisab thresholds.' },
      { type: 'new', text: 'Purchase orders track supplier payment status end-to-end.' },
      { type: 'improved', text: 'Nisab currency now follows the business profile currency instead of guessing from country code.' },
    ],
  },
  {
    version: '2026.06.3', date: '2026-06-27',
    summary: 'Kiswahili added, welcome emails on upgrade, purchase-order rollout finished.',
    changes: [
      { type: 'new', text: 'Full Kiswahili translation — the entire staff app is now usable in Kiswahili.' },
      { type: 'new', text: 'A CEO-signed welcome email now goes out automatically on a plan or POS-seat upgrade.' },
      { type: 'new', text: 'Geo-aware currency and per-country live-demo pages for the public preview.' },
      { type: 'improved', text: 'Back-orders filter and a low-stock reorder nudge added to inventory.' },
    ],
  },
  {
    version: '2026.06.2', date: '2026-06-17',
    summary: 'Purchase orders shipped end-to-end: create, send to suppliers, receive stock.',
    changes: [
      { type: 'new', text: 'Create purchase orders from the inventory tab.' },
      { type: 'new', text: 'Send purchase orders to suppliers directly over WhatsApp.' },
      { type: 'new', text: 'Receive stock against an open purchase order, updating inventory automatically.' },
      { type: 'improved', text: 'Purchase-order writes are now idempotent against duplicate submissions.' },
    ],
  },
  {
    version: '2026.06.1', date: '2026-06-16',
    summary: 'Fixes to repair-sector reporting and card-charge routing.',
    changes: [
      { type: 'fixed', text: 'Repair Services metrics no longer show up for non-repair-sector businesses.' },
      { type: 'fixed', text: 'Fixed two bugs in the card-charge route shared with the main app.' },
    ],
  },
  {
    version: '2026.05', date: '2026-05-20',
    summary: 'Offline-first checkout and a realistic staff-preview demo.',
    changes: [
      { type: 'new', text: 'Cash sales now work fully offline with a sync queue, including inventory and repair tickets.' },
      { type: 'new', text: 'A real, functional staff-screen demo for cashier, inventory, manager, and logistics roles.' },
      { type: 'fixed', text: 'Checkout no longer hangs when the connection drops mid-sale.' },
      { type: 'fixed', text: 'Fixed an infinite pagination loop in the offline cache.' },
      { type: 'fixed', text: 'Fixed camera access on iOS and a language-toggle scoping bug.' },
    ],
  },
  {
    version: '2026.04', date: '2026-04-15',
    summary: 'Usability and resilience pass: practice mode, refunds, offline queueing.',
    changes: [
      { type: 'new', text: 'Practice mode lets new staff try the till without touching real stock or sales.' },
      { type: 'new', text: 'Refund flow added to the cashier screen.' },
      { type: 'improved', text: 'Tax handling re-enabled and hardened across checkout.' },
      { type: 'improved', text: 'Vision routes now fall back to Claude Haiku when the primary model is unavailable.' },
      { type: 'fixed', text: 'Robust JSON extraction from AI scan responses, fixing occasional scan failures.' },
    ],
  },
]

function TypeBadge({ type }: { type: ChangeType }) {
  const s = TYPE_STYLE[type]
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em',
      padding: '3px 10px', borderRadius: 6,
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      flexShrink: 0, lineHeight: 1, display: 'inline-block', whiteSpace: 'nowrap',
    }}>
      {s.label}
    </span>
  )
}

export default function ChangelogPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--pos-bg)', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: 'clamp(20px,4vw,48px) clamp(16px,4vw,24px) 80px' }}>

        <div style={{ marginBottom: 40 }}>
          <Link href="/" style={{ fontSize: 13, color: 'var(--pos-hint)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>← Back to AskBiz POS</Link>
          <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--pos-accent)', textTransform: 'uppercase', letterSpacing: '.1em', margin: '0 0 12px' }}>Changelog</p>
          <h1 style={{ fontSize: 'clamp(26px,6vw,32px)', fontWeight: 700, marginBottom: 8, letterSpacing: '-.02em', color: 'var(--pos-ink)' }}>What's new in AskBiz POS</h1>
          <p style={{ fontSize: 15, color: 'var(--pos-muted)', lineHeight: 1.6 }}>New features, fixes, and improvements to the till, inventory, and back office.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          {RELEASES.map((rel, i) => (
            <article key={rel.version} style={{
              background: 'var(--pos-surface)',
              border: `1px solid ${i === 0 ? 'var(--pos-accent)' : 'var(--pos-border)'}`,
              borderRadius: 14,
              padding: 'clamp(18px,3vw,24px)',
              boxShadow: i === 0 ? '0 0 0 1px var(--pos-accent-ring), 0 4px 20px rgba(0,0,0,.06)' : '0 1px 4px rgba(0,0,0,.04)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--pos-ink)', letterSpacing: '-.01em' }}>{rel.version}</span>
                <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--pos-hint)', flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: 'var(--pos-hint)', fontWeight: 500 }}>
                  {new Date(rel.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
                {i === 0 && (
                  <span style={{
                    fontSize: 10, fontWeight: 700, color: '#fff', background: 'var(--pos-accent)',
                    padding: '3px 10px', borderRadius: 9999, letterSpacing: '.06em', textTransform: 'uppercase',
                    marginLeft: 'auto',
                  }}>
                    Latest
                  </span>
                )}
              </div>

              <p style={{ fontSize: 14, color: 'var(--pos-muted)', margin: '0 0 16px', lineHeight: 1.6 }}>{rel.summary}</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {rel.changes.map((c, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '8px 12px', background: 'var(--pos-bg)', borderRadius: 8 }}>
                    <div style={{ paddingTop: 2, flexShrink: 0 }}><TypeBadge type={c.type} /></div>
                    <span style={{ fontSize: 13, color: 'var(--pos-ink)', lineHeight: 1.55, flex: 1 }}>{c.text}</span>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div style={{ marginTop: 44, paddingTop: 24, borderTop: '1px solid var(--pos-border)', textAlign: 'center' }}>
          <p style={{ fontSize: 13, color: 'var(--pos-hint)', margin: '0 0 12px' }}>
            Questions about a change? <a href="mailto:hello@askbiz.co" style={{ color: 'var(--pos-accent)', textDecoration: 'none', fontWeight: 600 }}>Get in touch</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
