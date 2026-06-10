'use client'
import { useState, useEffect } from 'react'

const ACC = '#d08a59'

interface MatrixItem {
  name: string
  category: string
  qty_sold: number
  revenue: number
  cost: number
  margin_pct: number
  contribution_margin: number
  quadrant: 'star' | 'plowhorse' | 'puzzle' | 'dog'
}

interface MatrixSummary {
  total_items: number
  avg_margin: number
  avg_popularity: number
  days: number
  stars: number
  plowhorses: number
  puzzles: number
  dogs: number
  total_revenue: number
  total_cost: number
}

const QUADRANT = {
  star:      { label: 'Stars',       icon: '⭐', color: '#10B981', bg: 'rgba(16,185,129,.08)', tip: 'High profit & popular — protect these' },
  plowhorse: { label: 'Plowhorses',  icon: '🐴', color: '#F59E0B', bg: 'rgba(245,158,11,.08)', tip: 'Popular but low margin — raise price or cut cost' },
  puzzle:    { label: 'Puzzles',     icon: '🧩', color: '#6366F1', bg: 'rgba(99,102,241,.08)', tip: 'High profit but low sales — promote more' },
  dog:       { label: 'Dogs',        icon: '🐕', color: '#EF4444', bg: 'rgba(239,68,68,.08)', tip: 'Low profit & unpopular — consider removing' },
}

export default function MenuMatrix({ ownerId, staffId, sym = '£' }: { ownerId?: string; staffId?: string; sym?: string }) {
  const [items, setItems] = useState<MatrixItem[]>([])
  const [summary, setSummary] = useState<MatrixSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [days, setDays] = useState(30)
  const [filter, setFilter] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    const headers: Record<string, string> = {}
    if (ownerId) headers['x-owner-id'] = ownerId
    if (staffId) headers['x-staff-id'] = staffId
    fetch(`/api/pos/restaurant/menu-matrix?days=${days}`, { headers })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => { setItems(data.items || []); setSummary(data.summary || null) })
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

  if (!summary || summary.total_items === 0) {
    return (
      <div style={{ padding: 20, textAlign: 'center', color: '#999', fontSize: 14 }}>
        No menu sales data for the last {days} days.
      </div>
    )
  }

  const filtered = filter ? items.filter(i => i.quadrant === filter) : items

  return (
    <div className="pos-screen" style={{ padding: '16px 20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>Menu Matrix</div>
          <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>Last {days} days • {summary.total_items} items</div>
        </div>
        <select
          value={days}
          onChange={e => setDays(parseInt(e.target.value))}
          style={{ padding: '6px 10px', borderRadius: 8, background: '#2a2a2a', border: '1px solid #444', color: '#ccc', fontSize: 12 }}
        >
          <option value={7}>7 days</option>
          <option value={14}>14 days</option>
          <option value={30}>30 days</option>
          <option value={90}>90 days</option>
        </select>
      </div>

      {/* Quadrant summary cards */}
      <div className="pos-reveal" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
        {(['star', 'plowhorse', 'puzzle', 'dog'] as const).map(q => {
          const cfg = QUADRANT[q]
          const count = summary[`${q}s` as keyof MatrixSummary] as number || (q === 'star' ? summary.stars : 0)
          const isActive = filter === q
          return (
            <button
              key={q}
              onClick={() => setFilter(isActive ? null : q)}
              style={{
                padding: '10px 12px', borderRadius: 12,
                background: isActive ? cfg.bg : '#1e1e1e',
                border: `1px solid ${isActive ? cfg.color : '#333'}`,
                cursor: 'pointer', textAlign: 'left',
                transition: 'all 150ms',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: 14 }}>{cfg.icon}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: cfg.color }}>{cfg.label}</span>
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>
                {q === 'star' ? summary.stars : q === 'plowhorse' ? summary.plowhorses : q === 'puzzle' ? summary.puzzles : summary.dogs}
              </div>
              <div style={{ fontSize: 10, color: '#777', marginTop: 2 }}>{cfg.tip}</div>
            </button>
          )
        })}
      </div>

      {/* Items list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {filtered.map((item, i) => {
          const cfg = QUADRANT[item.quadrant]
          return (
            <div key={i} className="pos-item" style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', borderRadius: 12,
              background: '#1e1e1e', border: '1px solid #2a2a2a',
              animationDelay: `${Math.min(i, 8) * 40}ms`,
            }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>{cfg.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.name}
                  </span>
                  <span style={{ fontSize: 9, color: '#777', flexShrink: 0 }}>{item.category}</span>
                </div>
                <div style={{ display: 'flex', gap: 12, fontSize: 11, color: '#999' }}>
                  <span>{item.qty_sold} sold</span>
                  <span>{sym}{item.revenue.toFixed(0)} rev</span>
                  <span style={{ color: item.margin_pct >= (summary?.avg_margin || 0) ? '#10B981' : '#EF4444' }}>
                    {item.margin_pct}% margin
                  </span>
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: cfg.color }}>{sym}{item.contribution_margin.toFixed(0)}</div>
                <div style={{ fontSize: 9, color: '#777' }}>profit</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Overall stats */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', marginTop: 12,
        padding: '8px 12px', borderRadius: 10, background: '#1e1e1e', border: '1px solid #2a2a2a',
        fontSize: 11, color: '#999',
      }}>
        <span>Avg margin: {summary.avg_margin}%</span>
        <span>Revenue: {sym}{summary.total_revenue.toLocaleString()}</span>
        <span>Food cost: {sym}{summary.total_cost.toLocaleString()}</span>
      </div>
    </div>
  )
}
