'use client'
import { useState, useEffect } from 'react'
import { useLang } from '@/components/LanguageProvider'

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

const PRIORITY_STYLE: Record<number, { color: string; bg: string }> = {
  1: { color: '#EF4444', bg: 'rgba(239,68,68,.08)' },
  2: { color: '#F59E0B', bg: 'rgba(245,158,11,.08)' },
  3: { color: '#6366F1', bg: 'rgba(99,102,241,.08)' },
}
const PRIORITY_KEY: Record<number, string> = { 1: 'priorityNow', 2: 'priorityToday', 3: 'priorityThisWeek' }

export default function DailyActions({ onAsk, limit, onViewAll }: { onAsk?: (prompt: string) => void; limit?: number; onViewAll?: () => void }) {
  const { tc } = useLang()
  const [actions, setActions] = useState<Action[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [dismissed, setDismissed] = useState<Set<number>>(new Set())
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetch('/api/daily-actions')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => setActions(data.actions || []))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      const res = await fetch('/api/daily-actions?refresh=true')
      if (res.ok) {
        const data = await res.json()
        setActions(data.actions || [])
        setDismissed(new Set())
        setError(false)
      }
    } catch {
      // silently ignore
    } finally {
      setRefreshing(false)
    }
  }

  const dismiss = (idx: number) => setDismissed(prev => new Set(prev).add(idx))

  const allVisible = actions.filter((_, i) => !dismissed.has(i))
  const visible = limit ? allVisible.slice(0, limit) : allVisible
  const hasMore = limit ? allVisible.length > limit : false

  if (loading) {
    return (
      <div style={{ padding: '16px 18px', borderRadius: 16, border: '1px solid var(--b)', background: 'var(--sf)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <div style={{ width: 3, height: 14, borderRadius: 2, background: '#8B5CF6' }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)', letterSpacing: '.02em' }}>{tc('intel_dailyactions.title')}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ height: 52, borderRadius: 12, background: 'var(--ev, #f3f2ef)', animation: 'pulse 1.5s infinite ease-in-out' }} />
          ))}
        </div>
      </div>
    )
  }

  if (error || allVisible.length === 0) return null

  const urgentCount = allVisible.filter(a => a.priority === 1).length

  return (
    <div style={{ padding: '16px 18px', borderRadius: 16, border: '1px solid var(--b)', background: 'linear-gradient(180deg, var(--sf) 0%, rgba(139,92,246,.02) 100%)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 3, height: 14, borderRadius: 2, background: '#8B5CF6' }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)', letterSpacing: '.02em' }}>{tc('intel_dailyactions.title')}</span>
          {urgentCount > 0 && (
            <span style={{ fontSize: 10, fontWeight: 700, color: '#EF4444', background: 'rgba(239,68,68,.1)', borderRadius: 6, padding: '1px 6px' }}>
              {tc('intel_dailyactions.urgentBadge', { n: urgentCount })}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11, color: 'var(--tx3)' }}>{allVisible.length !== 1 ? tc('intel_dailyactions.actionCountPlural', { n: allVisible.length }) : tc('intel_dailyactions.actionCount', { n: allVisible.length })}</span>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            title="Refresh"
            style={{
              width: 22, height: 22, borderRadius: '50%', border: '1px solid var(--b)',
              background: 'transparent', color: 'var(--tx3)', cursor: refreshing ? 'default' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, padding: 0, lineHeight: 1, fontFamily: 'inherit',
              opacity: refreshing ? 0.5 : 1,
              transition: 'opacity 150ms',
            }}
          >
            <span style={{ display: 'inline-block', animation: refreshing ? 'spin 0.7s linear infinite' : 'none' }}>↻</span>
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {visible.map((action, i) => {
          const p = PRIORITY_STYLE[action.priority] || PRIORITY_STYLE[3]
          const pLabel = tc('intel_dailyactions.' + (PRIORITY_KEY[action.priority] || PRIORITY_KEY[3]))
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
                  }}>{pLabel}</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--tx3)', lineHeight: 1.4 }}>{action.why}</div>
              </div>
              <div style={{ display: 'flex', gap: 4, flexShrink: 0, marginTop: 2 }}>
                {onAsk && action.type !== 'info' && (
                  <button
                    onClick={() => onAsk(tc('intel_dailyactions.askActionPrompt', { title: action.title, why: action.why }))}
                    style={{ fontSize: 10, color: '#6366F1', background: 'rgba(99,102,241,.08)', border: 'none', borderRadius: 6, padding: '3px 7px', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}
                  >{tc('intel_dailyactions.askAi')}</button>
                )}
                <button
                  onClick={() => dismiss(i)}
                  style={{ fontSize: 10, color: 'var(--tx3)', background: 'transparent', border: 'none', cursor: 'pointer', padding: '3px 4px', fontFamily: 'inherit' }}
                  title={tc('intel_dailyactions.dismiss')}
                >✕</button>
              </div>
            </div>
          )
        })}
      </div>

      {hasMore && onViewAll && (
        <button
          onClick={onViewAll}
          style={{
            display: 'block', width: '100%', marginTop: 10, padding: '8px 0',
            border: 'none', background: 'transparent', color: '#6366F1',
            fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
            textAlign: 'center',
          }}
        >
          {tc('intel_dailyactions.viewAll', { n: allVisible.length })}
        </button>
      )}
    </div>
  )
}
