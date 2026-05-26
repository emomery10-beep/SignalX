'use client'
import { useState, useEffect } from 'react'

interface Action {
  title: string
  why: string
  priority: 1 | 2 | 3
  type: 'restock' | 'followup' | 'alert' | 'sync' | 'customer' | 'decision' | 'info'
}

const TYPE_ICON: Record<string, string> = {
  restock: '📦', followup: '📞', alert: '⚠️', sync: '🔄',
  customer: '👤', decision: '🎯', info: '✅',
}

const PRIORITY_LABEL: Record<number, { label: string; color: string; bg: string }> = {
  1: { label: 'Now', color: '#EF4444', bg: 'rgba(239,68,68,.08)' },
  2: { label: 'Today', color: '#F59E0B', bg: 'rgba(245,158,11,.08)' },
  3: { label: 'This week', color: '#6366F1', bg: 'rgba(99,102,241,.08)' },
}

export default function DailyActions({ onAsk }: { onAsk?: (prompt: string) => void }) {
  const [actions, setActions] = useState<Action[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [dismissed, setDismissed] = useState<Set<number>>(new Set())

  useEffect(() => {
    fetch('/api/daily-actions')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => setActions(data.actions || []))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  const dismiss = (idx: number) => setDismissed(prev => new Set(prev).add(idx))

  const visible = actions.filter((_, i) => !dismissed.has(i))

  if (loading) {
    return (
      <div style={{ padding: '16px 18px', borderRadius: 16, border: '1px solid var(--b)', background: 'var(--sf)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <div style={{ width: 3, height: 14, borderRadius: 2, background: '#8B5CF6' }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)', letterSpacing: '.02em' }}>Today&apos;s Actions</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ height: 52, borderRadius: 12, background: 'var(--ev, #f3f2ef)', animation: 'pulse 1.5s infinite ease-in-out' }} />
          ))}
        </div>
      </div>
    )
  }

  if (error || visible.length === 0) return null

  const urgentCount = visible.filter(a => a.priority === 1).length

  return (
    <div style={{ padding: '16px 18px', borderRadius: 16, border: '1px solid var(--b)', background: 'linear-gradient(180deg, var(--sf) 0%, rgba(139,92,246,.02) 100%)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 3, height: 14, borderRadius: 2, background: '#8B5CF6' }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)', letterSpacing: '.02em' }}>Today&apos;s Actions</span>
          {urgentCount > 0 && (
            <span style={{ fontSize: 10, fontWeight: 700, color: '#EF4444', background: 'rgba(239,68,68,.1)', borderRadius: 6, padding: '1px 6px' }}>
              {urgentCount} urgent
            </span>
          )}
        </div>
        <span style={{ fontSize: 11, color: 'var(--tx3)' }}>{visible.length} action{visible.length !== 1 ? 's' : ''}</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {visible.map((action, i) => {
          const p = PRIORITY_LABEL[action.priority] || PRIORITY_LABEL[3]
          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: 10,
              padding: '10px 12px', borderRadius: 12,
              border: `1px solid ${action.priority === 1 ? 'rgba(239,68,68,.15)' : 'var(--b)'}`,
              background: action.priority === 1 ? 'rgba(239,68,68,.03)' : 'var(--sf)',
              transition: 'opacity 200ms',
            }}>
              <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{TYPE_ICON[action.type] || '📋'}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--tx)' }}>{action.title}</span>
                  <span style={{
                    fontSize: 9, fontWeight: 700, color: p.color, background: p.bg,
                    borderRadius: 4, padding: '1px 5px', textTransform: 'uppercase', letterSpacing: '.04em', flexShrink: 0,
                  }}>{p.label}</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--tx3)', lineHeight: 1.4 }}>{action.why}</div>
              </div>
              <div style={{ display: 'flex', gap: 4, flexShrink: 0, marginTop: 2 }}>
                {onAsk && action.type !== 'info' && (
                  <button
                    onClick={() => onAsk(`Help me with this action: ${action.title}. Context: ${action.why}`)}
                    style={{ fontSize: 10, color: '#6366F1', background: 'rgba(99,102,241,.08)', border: 'none', borderRadius: 6, padding: '3px 7px', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}
                  >Ask AI</button>
                )}
                <button
                  onClick={() => dismiss(i)}
                  style={{ fontSize: 10, color: 'var(--tx3)', background: 'transparent', border: 'none', cursor: 'pointer', padding: '3px 4px', fontFamily: 'inherit' }}
                  title="Dismiss"
                >✕</button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
