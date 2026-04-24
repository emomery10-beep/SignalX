'use client'
import { useEffect, useState } from 'react'

interface Brief {
  improved: string
  worsened: string
  action: string
  health_score: number
  date: string
}

interface Props {
  onAsk?: (prompt: string) => void
}

export default function DailyBrief({ onAsk }: Props) {
  const [brief, setBrief] = useState<Brief | null>(null)
  const [loading, setLoading] = useState(true)
  const [dismissed, setDismissed] = useState(false)

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
            <div style={{ fontSize: 12, fontWeight: 700, color: '#6366F1', letterSpacing: '.04em', textTransform: 'uppercase' }}>Daily Brief</div>
            <div style={{ fontSize: 11, color: 'var(--tx3)' }}>{today}</div>
          </div>
        </div>
        <button
          onClick={() => setDismissed(true)}
          style={{ width: 24, height: 24, borderRadius: '50%', border: 'none', background: 'var(--ev)', color: 'var(--tx3)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, padding: 0 }}>
          ✕
        </button>
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
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>🟢</span>
            <p style={{ fontSize: 13, color: 'var(--tx)', margin: 0, lineHeight: 1.5 }}>{brief.improved}</p>
          </div>

          {/* Worsened */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>🔴</span>
            <p style={{ fontSize: 13, color: 'var(--tx)', margin: 0, lineHeight: 1.5 }}>{brief.worsened}</p>
          </div>

          {/* Action */}
          <div style={{
            marginTop: 4, padding: '10px 12px', borderRadius: 10,
            background: 'rgba(99,102,241,.08)', border: '1px solid rgba(99,102,241,.15)',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#6366F1', margin: 0, flex: 1, lineHeight: 1.4 }}>
              Today: {brief.action}
            </p>
            {onAsk && (
              <button
                onClick={() => onAsk(brief.action)}
                style={{ fontSize: 11, color: '#6366F1', background: 'transparent', border: '1px solid rgba(99,102,241,.3)', borderRadius: 9999, padding: '3px 9px', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                Ask AskBiz
              </button>
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}
