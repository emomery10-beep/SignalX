'use client'
import { useState, useEffect, useRef } from 'react'
import type { Signal, SignalSeverity } from '@/lib/signal-engine'

interface Props {
  onActionClick: (prompt: string) => void
}

const SEVERITY_COLORS: Record<SignalSeverity, { bg: string; border: string; dot: string; text: string }> = {
  red:    { bg: 'rgba(239,68,68,.06)',   border: 'rgba(239,68,68,.3)',   dot: '#ef4444', text: '#ef4444' },
  yellow: { bg: 'rgba(245,158,11,.06)',  border: 'rgba(245,158,11,.3)',  dot: '#f59e0b', text: '#f59e0b' },
  blue:   { bg: 'rgba(99,102,241,.06)',  border: 'rgba(99,102,241,.3)',  dot: '#6366f1', text: '#6366f1' },
}

function SignalCard({ signal, onAction, isNew }: { signal: Signal; onAction: (prompt: string) => void; isNew: boolean }) {
  const [dismissed, setDismissed] = useState(false)
  const [visible, setVisible] = useState(false)
  const c = SEVERITY_COLORS[signal.severity]

  useEffect(() => {
    // Slide in animation
    const t = setTimeout(() => setVisible(true), 50)
    return () => clearTimeout(t)
  }, [])

  if (dismissed) return null

  return (
    <div style={{
      background: c.bg,
      border: `1px solid ${c.border}`,
      borderRadius: 14,
      padding: '14px 14px 12px',
      marginBottom: 10,
      transform: visible ? 'translateY(0)' : 'translateY(-12px)',
      opacity: visible ? 1 : 0,
      transition: 'transform 300ms cubic-bezier(.16,1,.3,1), opacity 300ms ease',
      position: 'relative',
      boxShadow: isNew ? `0 0 0 1px ${c.border}, 0 4px 20px ${c.bg}` : 'none',
    }}>
      {/* Severity dot + title row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 7 }}>
        <div style={{
          width: 8, height: 8, borderRadius: '50%', background: c.dot,
          flexShrink: 0, marginTop: 5,
          boxShadow: isNew ? `0 0 6px ${c.dot}` : 'none',
          animation: signal.severity === 'red' ? 'pulse 1.5s infinite' : 'none',
        }}></div>
        <div style={{ fontFamily: 'var(--font-sora)', fontSize: 13, fontWeight: 600, color: 'var(--tx)', flex: 1, lineHeight: 1.4 }}>
          {signal.title}
        </div>
        {/* Metric badge */}
        {signal.metric && (
          <span style={{ fontSize: 10, fontWeight: 700, color: c.text, background: c.bg, border: `1px solid ${c.border}`, borderRadius: 9999, padding: '2px 7px', flexShrink: 0, whiteSpace: 'nowrap' }}>
            {signal.metric}
          </span>
        )}
      </div>

      {/* Description */}
      <p style={{ fontSize: 12, color: 'var(--tx2)', lineHeight: 1.65, margin: '0 0 10px 16px' }}>
        {signal.description}
      </p>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 6, marginLeft: 16 }}>
        <button
          onClick={() => onAction(signal.prompt)}
          style={{
            fontSize: 12, fontWeight: 600, padding: '5px 12px',
            borderRadius: 9999, border: 'none',
            background: c.dot, color: '#fff',
            cursor: 'pointer', fontFamily: 'inherit',
            transition: 'opacity 150ms',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          {signal.suggested_action} →
        </button>
        <button
          onClick={() => setDismissed(true)}
          style={{
            fontSize: 12, padding: '5px 10px',
            borderRadius: 9999, border: '1px solid var(--b)',
            background: 'transparent', color: 'var(--tx3)',
            cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          Dismiss
        </button>
      </div>

      {/* New indicator */}
      {isNew && (
        <div style={{ position: 'absolute', top: 10, right: 10, fontSize: 9, fontWeight: 700, color: c.text, background: c.bg, border: `1px solid ${c.border}`, borderRadius: 9999, padding: '2px 6px', letterSpacing: '.06em', textTransform: 'uppercase' }}>
          NEW
        </div>
      )}
    </div>
  )
}

export default function BusinessPulse({ onActionClick }: Props) {
  const [signals, setSignals] = useState<Signal[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(true)
  const [newIds, setNewIds] = useState<Set<string>>(new Set())
  const prevIdsRef = useRef<Set<string>>(new Set())
  const pollRef = useRef<NodeJS.Timeout | null>(null)

  const fetchSignals = async () => {
    try {
      const res = await fetch('/api/signals')
      if (!res.ok) return
      const data = await res.json()
      const incoming: Signal[] = data.signals || []

      // Detect new signals
      const fresh = new Set(incoming.filter(s => !prevIdsRef.current.has(s.id)).map(s => s.id))
      if (fresh.size > 0) setNewIds(prev => new Set([...prev, ...fresh]))

      prevIdsRef.current = new Set(incoming.map(s => s.id))
      setSignals(incoming)
    } catch { /* non-blocking */ } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSignals()
    // Poll every 5 minutes for new signals
    pollRef.current = setInterval(fetchSignals, 5 * 60 * 1000)
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [])

  // Clear "new" badge after 10 seconds
  useEffect(() => {
    if (newIds.size === 0) return
    const t = setTimeout(() => setNewIds(new Set()), 10000)
    return () => clearTimeout(t)
  }, [newIds])

  const hasSignals = signals.length > 0
  const redCount = signals.filter(s => s.severity === 'red').length

  return (
    <div style={{
      background: 'var(--sf)',
      borderLeft: '1px solid var(--b)',
      width: open ? 300 : 48,
      minWidth: open ? 300 : 48,
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 250ms cubic-bezier(.16,1,.3,1), min-width 250ms',
      overflow: 'hidden',
      height: '100%',
    }}>

      {/* Header toggle */}
      <div
        onClick={() => setOpen(v => !v)}
        style={{ padding: '12px 14px', borderBottom: '1px solid var(--b)', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', flexShrink: 0, userSelect: 'none', minHeight: 48 }}
        onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = 'var(--ev)'}
        onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}
      >
        {/* Pulse icon */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={hasSignals && redCount > 0 ? '#ef4444' : 'var(--tx3)'} strokeWidth="2" strokeLinecap="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
          {redCount > 0 && (
            <div style={{ position: 'absolute', top: -4, right: -4, width: 8, height: 8, borderRadius: '50%', background: '#ef4444', animation: 'pulse 1.5s infinite' }}></div>
          )}
        </div>

        {open && (
          <>
            <span style={{ fontFamily: 'var(--font-sora)', fontSize: 13, fontWeight: 600, flex: 1, whiteSpace: 'nowrap' }}>Business Pulse</span>
            {hasSignals && (
              <span style={{ fontSize: 11, fontWeight: 700, padding: '1px 7px', borderRadius: 9999, background: redCount > 0 ? '#ef4444' : '#f59e0b', color: '#fff' }}>
                {signals.length}
              </span>
            )}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--tx3)" strokeWidth="2" strokeLinecap="round">
              <path d={open ? 'M9 18l6-6-6-6' : 'M15 18l-6-6 6-6'}/>
            </svg>
          </>
        )}
      </div>

      {/* Signal list */}
      {open && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px 12px' }}>
          {loading ? (
            // Skeleton
            [1, 2].map(i => (
              <div key={i} style={{ height: 90, borderRadius: 14, background: 'var(--ev)', marginBottom: 10, opacity: 0.6 }}></div>
            ))
          ) : hasSignals ? (
            signals.map((signal, idx) => (
              <SignalCard
                key={signal.id}
                signal={signal}
                isNew={newIds.has(signal.id)}
                onAction={(prompt) => {
                  onActionClick(prompt)
                }}
              />
            ))
          ) : (
            // All clear state
            <div style={{ padding: '28px 16px', textAlign: 'center' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(34,197,94,.1)', border: '1px solid rgba(34,197,94,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              </div>
              <div style={{ fontFamily: 'var(--font-sora)', fontSize: 13, fontWeight: 600, color: '#22c55e', marginBottom: 6 }}>All clear</div>
              <p style={{ fontSize: 12, color: 'var(--tx3)', lineHeight: 1.65 }}>
                Your business is running smoothly. No urgent actions needed.
              </p>
              <p style={{ fontSize: 11, color: 'var(--tx3)', marginTop: 10, lineHeight: 1.5 }}>
                Upload fresh data to run a new health check.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Refresh button */}
      {open && (
        <div style={{ padding: '8px 12px', borderTop: '1px solid var(--b)', flexShrink: 0 }}>
          <button
            onClick={fetchSignals}
            style={{ width: '100%', padding: '7px', borderRadius: 9, border: '1px solid var(--b)', background: 'transparent', fontSize: 11, color: 'var(--tx3)', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--ev)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
            Run health check
          </button>
        </div>
      )}
    </div>
  )
}
