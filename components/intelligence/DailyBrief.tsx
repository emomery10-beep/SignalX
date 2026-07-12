'use client'
import { useEffect, useState } from 'react'
import { useLang } from '@/components/LanguageProvider'

interface Brief {
  improved: string
  worsened: string
  action: string
  health_score: number
  date: string
}

interface Props {
  onAsk?: (s: string) => void
}

export default function DailyBrief({ onAsk }: Props) {
  const { tc } = useLang()
  const [brief, setBrief] = useState<Brief | null>(null)
  const [loading, setLoading] = useState(true)
  const [dismissed, setDismissed] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    const fetchBrief = async () => {
      try {
        const res = await fetch('/api/daily-brief')
        if (res.ok) {
          const data = await res.json()
          setBrief(data.brief)
        }
      } catch (e) {
        console.error('Daily brief fetch failed:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchBrief()
  }, [])

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      const res = await fetch('/api/daily-brief?refresh=true')
      if (res.ok) {
        const data = await res.json()
        setBrief(data.brief)
      }
    } catch {
      // silently ignore
    } finally {
      setRefreshing(false)
    }
  }

  if (dismissed || (!loading && !brief)) return null

  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className="animate-fade-down" style={{
      borderRadius: 16,
      border: '1px solid rgba(99,102,241,.2)',
      background: 'linear-gradient(135deg, rgba(99,102,241,.04), rgba(139,92,246,.03))',
      overflow: 'hidden',
      marginBottom: 16,
    }}>
      {/* Header */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(99,102,241,.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#6366F1' }}>{tc('intel_dailybrief.title')}</div>
            <div style={{ fontSize: 9, color: 'var(--tx3)' }}>{today}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            title="Refresh"
            style={{
              width: 24, height: 24, borderRadius: '50%', border: 'none',
              background: 'var(--ev)', color: 'var(--tx3)', cursor: refreshing ? 'default' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, padding: 0, lineHeight: 1,
              opacity: refreshing ? 0.5 : 1,
              transition: 'opacity 150ms',
            }}
          >
            <span style={{ display: 'inline-block', animation: refreshing ? 'spin 0.7s linear infinite' : 'none' }}>↻</span>
          </button>
          <button
            onClick={() => setDismissed(true)}
            style={{ width: 24, height: 24, borderRadius: '50%', border: 'none', background: 'var(--ev)', color: 'var(--tx3)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, padding: 0 }}>
            ✕
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '16px', display: 'flex', gap: 8, flexDirection: 'column' }}>
          <div className="skeleton" style={{ height: 14, width: '80%', borderRadius: 7 }}></div>
          <div className="skeleton" style={{ height: 14, width: '65%', borderRadius: 7 }}></div>
          <div className="skeleton" style={{ height: 14, width: '70%', borderRadius: 7 }}></div>
        </div>
      ) : brief ? (
        <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Improved */}
          <div
            onClick={() => onAsk?.(tc('intel_dailybrief.improvedPrompt', { detail: brief.improved }))}
            style={{ display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer', borderRadius: 8, padding: '6px 8px', margin: '-6px -8px', transition: 'background 150ms' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(34,197,94,.06)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
          >
            <span style={{ fontSize: 12, flexShrink: 0, marginTop: 1 }}>🟢</span>
            <p style={{ fontSize: 11, color: 'var(--tx)', margin: 0, lineHeight: 1.5 }}>{brief.improved}</p>
          </div>

          {/* Worsened */}
          <div
            onClick={() => onAsk?.(tc('intel_dailybrief.worsenedPrompt', { detail: brief.worsened }))}
            style={{ display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer', borderRadius: 8, padding: '6px 8px', margin: '-6px -8px', transition: 'background 150ms' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,.04)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
          >
            <span style={{ fontSize: 12, flexShrink: 0, marginTop: 1 }}>🔴</span>
            <p style={{ fontSize: 11, color: 'var(--tx)', margin: 0, lineHeight: 1.5 }}>{brief.worsened}</p>
          </div>

          {/* Action */}
          <div style={{
            marginTop: 4, padding: '10px 12px', borderRadius: 10,
            background: 'rgba(99,102,241,.08)', border: '1px solid rgba(99,102,241,.15)',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            <p style={{ fontSize: 10, fontWeight: 600, color: '#6366F1', margin: 0, flex: 1, lineHeight: 1.4 }}>
              {tc('intel_dailybrief.todayPrefix')} {brief.action}
            </p>
            {onAsk && (
              <button
                onClick={() => onAsk(brief.action)}
                style={{ fontSize: 9, color: '#6366F1', background: 'transparent', border: '1px solid rgba(99,102,241,.3)', borderRadius: 6, padding: '3px 9px', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                {tc('intel_dailybrief.askAskBiz')}
              </button>
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}
