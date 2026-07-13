'use client'
import { useState, useEffect } from 'react'
import { useLang } from '@/components/LanguageProvider'

interface Snapshot {
  week: string; avg_score: number; min_score: number; max_score: number
  label: string; samples: number; summary: string | null
}

interface Milestone {
  date: string; event: string; score_before: number; score_after: number
}

export default function HealthTimeMachine({ onAsk }: { onAsk?: (prompt: string) => void }) {
  const { tc } = useLang()
  const [snapshots, setSnapshots] = useState<Snapshot[]>([])
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [totalChange, setTotalChange] = useState(0)
  const [analysis, setAnalysis] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedWeek, setSelectedWeek] = useState<string | null>(null)
  const [loadingAnalysis, setLoadingAnalysis] = useState(false)

  useEffect(() => {
    fetch('/api/health-timemachine')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        setSnapshots(data.snapshots || [])
        setMilestones(data.milestones || [])
        setTotalChange(data.total_change || 0)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const compareWith = (week: string) => {
    setSelectedWeek(week)
    setLoadingAnalysis(true)
    fetch(`/api/health-timemachine?compare=${week}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => setAnalysis(data.analysis || null))
      .catch(() => setAnalysis(null))
      .finally(() => setLoadingAnalysis(false))
  }

  if (loading) {
    return (
      <div style={{ padding: '16px 18px', borderRadius: 16, border: '1px solid var(--b)', background: 'var(--sf)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <div style={{ width: 3, height: 14, borderRadius: 2, background: '#8B5CF6' }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)', letterSpacing: '.02em' }}>{tc('intel_healthtm.timeMachine')}</span>
        </div>
        <div style={{ height: 120, borderRadius: 10, background: 'var(--ev, #f3f2ef)', animation: 'pulse 1.5s infinite' }} />
      </div>
    )
  }

  if (snapshots.length < 2) return null

  const current = snapshots[snapshots.length - 1]
  const oldest = snapshots[0]
  const maxScore = Math.max(...snapshots.map(s => s.max_score), 1)
  const fmtWeek = (w: string) => new Date(w).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })

  return (
    <div style={{ padding: '16px 18px', borderRadius: 16, border: '1px solid var(--b)', background: 'linear-gradient(180deg, var(--sf) 0%, rgba(139,92,246,.02) 100%)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 3, height: 14, borderRadius: 2, background: '#8B5CF6' }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)', letterSpacing: '.02em' }}>{tc('intel_healthtm.timeMachine')}</span>
        </div>
        {onAsk && (
          <button
            onClick={() => onAsk(tc('intel_healthtm.askAiPrompt'))}
            style={{ fontSize: 10, color: '#6366F1', background: 'rgba(99,102,241,.08)', border: 'none', borderRadius: 6, padding: '3px 7px', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}
          >{tc('intel_healthtm.askAi')}</button>
        )}
      </div>

      {/* Journey summary */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 10, color: 'var(--tx3)' }}>{fmtWeek(oldest.week)}</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--tx3)' }}>{oldest.avg_score}</div>
          <div style={{ fontSize: 10, color: 'var(--tx3)' }}>{oldest.label}</div>
        </div>
        <div style={{ fontSize: 18, color: totalChange >= 0 ? '#10B981' : '#EF4444' }}>
          {totalChange >= 0 ? '→ ↑' : '→ ↓'}
        </div>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 10, color: 'var(--tx3)' }}>{tc('intel_healthtm.now')}</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: totalChange >= 0 ? '#10B981' : '#EF4444' }}>{current.avg_score}</div>
          <div style={{ fontSize: 10, color: totalChange >= 0 ? '#10B981' : '#EF4444' }}>
            {totalChange >= 0 ? '+' : ''}{tc('intel_healthtm.totalChangePts', { pts: totalChange })}
          </div>
        </div>
      </div>

      {/* Score sparkline */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'end', gap: 2, height: 50 }}>
          {snapshots.map((s, i) => {
            const h = Math.max(4, (s.avg_score / maxScore) * 46)
            const isSelected = selectedWeek === s.week
            const scoreColor = s.avg_score >= 70 ? '#10B981' : s.avg_score >= 50 ? '#F59E0B' : s.avg_score >= 30 ? '#F97316' : '#EF4444'
            return (
              <button
                key={i}
                onClick={() => compareWith(s.week)}
                title={tc('intel_healthtm.barTooltip', { date: fmtWeek(s.week), score: s.avg_score })}
                style={{
                  flex: 1, height: h, maxWidth: 24, borderRadius: 3, border: 'none',
                  background: isSelected ? '#8B5CF6' : scoreColor + '80',
                  cursor: 'pointer', padding: 0,
                  outline: isSelected ? '2px solid #8B5CF6' : 'none',
                  outlineOffset: 1,
                }}
              />
            )
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
          <span style={{ fontSize: 9, color: 'var(--tx3)' }}>{fmtWeek(snapshots[0].week)}</span>
          <span style={{ fontSize: 9, color: 'var(--tx3)' }}>{tc('intel_healthtm.clickBarToCompare')}</span>
          <span style={{ fontSize: 9, color: 'var(--tx3)' }}>{tc('intel_healthtm.now')}</span>
        </div>
      </div>

      {/* AI Analysis */}
      {loadingAnalysis && (
        <div style={{ padding: 10, borderRadius: 10, background: 'rgba(139,92,246,.04)', border: '1px solid rgba(139,92,246,.12)', fontSize: 12, color: 'var(--tx3)', textAlign: 'center' }}>
          {tc('intel_healthtm.analysingChanges', { date: selectedWeek ? fmtWeek(selectedWeek) : '' })}
        </div>
      )}

      {analysis && !loadingAnalysis && (
        <div style={{ padding: '10px 12px', borderRadius: 10, background: 'rgba(139,92,246,.04)', border: '1px solid rgba(139,92,246,.12)', marginBottom: milestones.length ? 12 : 0 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#8B5CF6', marginBottom: 6 }}>
            {tc('intel_healthtm.changesSince', { date: selectedWeek ? fmtWeek(selectedWeek) : '' })}
          </div>
          <div style={{ fontSize: 12, color: 'var(--tx2)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{analysis}</div>
        </div>
      )}

      {/* Milestones */}
      {milestones.length > 0 && (
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--tx3)', marginBottom: 6, letterSpacing: '.02em' }}>{tc('intel_healthtm.keyEvents')}</div>
          {milestones.slice(0, 4).map((m, i) => {
            const isUp = m.score_after > m.score_before
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: isUp ? '#10B981' : '#EF4444' }}>{isUp ? '📈' : '📉'}</span>
                <span style={{ fontSize: 11, color: 'var(--tx2)' }}>
                  {fmtWeek(m.date)} — {m.event}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
