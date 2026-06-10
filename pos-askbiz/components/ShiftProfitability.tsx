'use client'
import { useState, useEffect } from 'react'

const ACC = '#d08a59'

interface ScoredShift {
  shift_id: string
  cashier: string
  opened_at: string
  closed_at: string
  duration_hours: number
  tx_count: number
  revenue: number
  gross_profit: number
  margin_pct: number
  revenue_per_hour: number
  profit_per_hour: number
  tx_per_hour: number
  discounts: number
  variance: number
  score: number
  grade: string
}

interface LeaderboardEntry {
  name: string
  shifts: number
  avg_score: number
  total_revenue: number
  rev_per_hour: number
}

const GRADE_COLOR: Record<string, string> = {
  A: '#10B981', B: '#6366F1', C: '#F59E0B', D: '#F97316', F: '#EF4444',
}

export default function ShiftProfitability({ ownerId, staffId, sym = '£' }: { ownerId?: string; staffId?: string; sym?: string }) {
  const [shifts, setShifts] = useState<ScoredShift[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [summary, setSummary] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [days, setDays] = useState(30)
  const [view, setView] = useState<'shifts' | 'leaderboard'>('shifts')

  useEffect(() => {
    setLoading(true)
    const headers: Record<string, string> = {}
    if (ownerId) headers['x-owner-id'] = ownerId
    if (staffId) headers['x-staff-id'] = staffId
    fetch(`/api/pos/shift/profitability?days=${days}`, { headers })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        setShifts(data.shifts || [])
        setLeaderboard(data.leaderboard || [])
        setSummary(data.summary || null)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [ownerId, staffId, days])

  if (loading) {
    return (
      <div style={{ padding: 20 }}>
        <div style={{ height: 200, borderRadius: 16, background: '#2a2a2a', animation: 'pulse 1.5s infinite' }} />
      </div>
    )
  }

  if (!summary || shifts.length === 0) {
    return (
      <div style={{ padding: 20, textAlign: 'center', color: '#999', fontSize: 14 }}>
        No closed shifts in the last {days} days.
      </div>
    )
  }

  const fmt = (n: number) => `${sym}${n.toFixed(0)}`
  const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  const fmtTime = (d: string) => new Date(d).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="pos-screen" style={{ padding: '16px 20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>Shift Scores</div>
          <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>{summary.total_shifts} shifts • Avg score: {summary.avg_score}/100</div>
        </div>
        <select
          value={days}
          onChange={e => setDays(parseInt(e.target.value))}
          style={{ padding: '6px 10px', borderRadius: 8, background: '#2a2a2a', border: '1px solid #444', color: '#ccc', fontSize: 12 }}
        >
          <option value={7}>7 days</option>
          <option value={14}>14 days</option>
          <option value={30}>30 days</option>
        </select>
      </div>

      {/* Summary cards */}
      <div className="pos-reveal" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
        <StatBox label="Avg Score" value={`${summary.avg_score}`} sub="/100" color={GRADE_COLOR[summary.avg_score >= 80 ? 'A' : summary.avg_score >= 65 ? 'B' : summary.avg_score >= 50 ? 'C' : 'D']} />
        <StatBox label="Rev/Hour" value={fmt(summary.avg_rev_per_hour)} color="#6366F1" />
        <StatBox label="Avg Margin" value={`${summary.avg_margin}%`} color={summary.avg_margin >= 40 ? '#10B981' : '#F59E0B'} />
      </div>

      {/* View toggle */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
        {(['shifts', 'leaderboard'] as const).map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            style={{
              flex: 1, padding: '8px', borderRadius: 8, border: 'none',
              background: view === v ? ACC : '#2a2a2a', color: view === v ? '#fff' : '#999',
              fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
            }}
          >{v === 'shifts' ? 'Recent Shifts' : 'Leaderboard'}</button>
        ))}
      </div>

      {/* Shifts list */}
      {view === 'shifts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {shifts.slice(0, 15).map((sh, idx) => (
            <div key={sh.shift_id} className="pos-item" style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', borderRadius: 12,
              background: '#1e1e1e', border: '1px solid #2a2a2a',
              animationDelay: `${Math.min(idx, 8) * 40}ms`,
            }}>
              {/* Grade badge */}
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: GRADE_COLOR[sh.grade] + '15',
                border: `2px solid ${GRADE_COLOR[sh.grade]}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, fontWeight: 800, color: GRADE_COLOR[sh.grade],
                flexShrink: 0,
              }}>{sh.grade}</div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{sh.cashier}</span>
                  <span style={{ fontSize: 10, color: '#777' }}>{fmtDate(sh.opened_at)} {fmtTime(sh.opened_at)}–{fmtTime(sh.closed_at)}</span>
                </div>
                <div style={{ display: 'flex', gap: 10, fontSize: 11, color: '#999' }}>
                  <span>{fmt(sh.revenue)} rev</span>
                  <span>{sh.margin_pct}% margin</span>
                  <span>{sh.tx_count} sales</span>
                  <span>{sh.duration_hours}h</span>
                </div>
              </div>

              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: GRADE_COLOR[sh.grade] }}>{sh.score}</div>
                <div style={{ fontSize: 9, color: '#777' }}>{fmt(sh.revenue_per_hour)}/hr</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Leaderboard */}
      {view === 'leaderboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {leaderboard.map((entry, i) => {
            const grade = entry.avg_score >= 80 ? 'A' : entry.avg_score >= 65 ? 'B' : entry.avg_score >= 50 ? 'C' : entry.avg_score >= 35 ? 'D' : 'F'
            return (
              <div key={entry.name} className="pos-item" style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 12,
                background: i === 0 ? 'rgba(16,185,129,.06)' : '#1e1e1e',
                border: `1px solid ${i === 0 ? 'rgba(16,185,129,.2)' : '#2a2a2a'}`,
                animationDelay: `${Math.min(i, 8) * 40}ms`,
              }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: i === 0 ? '#10B981' : i === 1 ? '#6366F1' : '#999', width: 24, textAlign: 'center' }}>
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{entry.name}</div>
                  <div style={{ fontSize: 11, color: '#999' }}>{entry.shifts} shifts • {fmt(entry.total_revenue)} total • {fmt(entry.rev_per_hour)}/hr</div>
                </div>
                <div style={{
                  padding: '4px 10px', borderRadius: 8,
                  background: GRADE_COLOR[grade] + '15',
                  color: GRADE_COLOR[grade],
                  fontSize: 14, fontWeight: 700,
                }}>{entry.avg_score}</div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function StatBox({ label, value, sub, color }: { label: string; value: string; sub?: string; color: string }) {
  return (
    <div style={{ padding: '8px 10px', borderRadius: 10, background: '#1e1e1e', border: '1px solid #2a2a2a', textAlign: 'center' }}>
      <div style={{ fontSize: 10, color: '#999', marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 700, color }}>
        {value}{sub && <span style={{ fontSize: 10, fontWeight: 400, color: '#777' }}>{sub}</span>}
      </div>
    </div>
  )
}
