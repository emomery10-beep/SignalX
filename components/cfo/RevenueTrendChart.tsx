'use client'
import { useState } from 'react'
import { useLang } from '@/components/LanguageProvider'

interface ChartPoint {
  date: string
  revenue: number
  cogs: number
  fixed: number
  net: number
}

interface Props {
  data: ChartPoint[]
  currencySymbol: string
}

function fmt(n: number, sym: string): string {
  if (Math.abs(n) >= 1_000_000) return `${sym}${(n / 1_000_000).toFixed(1)}M`
  if (Math.abs(n) >= 1_000) return `${sym}${(n / 1_000).toFixed(1)}K`
  return `${sym}${Math.round(n)}`
}

function formatDate(d: string): string {
  const dt = new Date(d + 'T00:00:00')
  return dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export default function RevenueTrendChart({ data, currencySymbol }: Props) {
  const { tc } = useLang()
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)

  if (!data.length) {
    return (
      <div style={{
        padding: '20px', borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)',
        fontSize: 11, color: 'var(--tx3)', textAlign: 'center',
      }}>
        {tc('cfo_revtrend.empty')}
      </div>
    )
  }

  // Aggregate into buckets if too many points (>45 days → weekly)
  const buckets = data.length > 45 ? aggregateWeekly(data) : data
  const maxVal = Math.max(...buckets.map(d => Math.max(d.revenue, d.cogs + d.fixed)), 1)
  const minNet = Math.min(...buckets.map(d => d.net), 0)
  const maxNet = Math.max(...buckets.map(d => d.net), 0)
  const netRange = Math.max(maxNet - minNet, 1)

  const chartW = 680
  const chartH = 200
  const barW = Math.max(Math.min((chartW - 40) / buckets.length - 2, 24), 4)
  const gapW = barW + 2

  // Net profit line points
  const linePoints = buckets.map((d, i) => {
    const x = 20 + i * gapW + barW / 2
    const y = chartH - 20 - ((d.net - minNet) / netRange) * (chartH - 40)
    return `${x},${y}`
  }).join(' ')

  const hovered = hoveredIdx != null ? buckets[hoveredIdx] : null
  const selected = selectedIdx != null ? buckets[selectedIdx] : null

  return (
    <div style={{ borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', padding: '16px', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 3, height: 14, borderRadius: 2, background: '#6366F1' }} />
          <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--tx)', letterSpacing: '.02em' }}>{tc('cfo_revtrend.title')}</span>
        </div>
        <div style={{ display: 'flex', gap: 12, fontSize: 9, color: 'var(--tx3)' }}>
          <span><span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 2, background: '#22C55E', marginRight: 4, verticalAlign: 'middle' }} />{tc('cfo_revtrend.legendRevenue')}</span>
          <span><span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 2, background: '#F97316', marginRight: 4, verticalAlign: 'middle' }} />{tc('cfo_revtrend.legendCogs')}</span>
          <span><span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 2, background: '#EF4444', marginRight: 4, verticalAlign: 'middle' }} />{tc('cfo_revtrend.legendFixed')}</span>
          <span><span style={{ display: 'inline-block', width: 8, height: 3, borderRadius: 2, background: '#6366F1', marginRight: 4, verticalAlign: 'middle' }} />{tc('cfo_revtrend.legendNet')}</span>
        </div>
      </div>

      {/* Tooltip */}
      {hovered && (
        <div style={{
          display: 'flex', gap: 16, padding: '8px 12px', borderRadius: 8,
          background: 'var(--ev, #f3f2ef)', marginBottom: 8, fontSize: 9, color: 'var(--tx2)',
        }}>
          <span style={{ fontWeight: 600 }}>{formatDate(hovered.date)}</span>
          <span>{tc('cfo_revtrend.tipRev')}: <strong style={{ color: '#22C55E' }}>{fmt(hovered.revenue, currencySymbol)}</strong></span>
          <span>{tc('cfo_revtrend.tipCogs')}: <strong style={{ color: '#F97316' }}>{fmt(hovered.cogs, currencySymbol)}</strong></span>
          <span>{tc('cfo_revtrend.tipFixed')}: <strong style={{ color: '#EF4444' }}>{fmt(hovered.fixed, currencySymbol)}</strong></span>
          <span>{tc('cfo_revtrend.tipNet')}: <strong style={{ color: hovered.net >= 0 ? '#22C55E' : '#EF4444' }}>{fmt(hovered.net, currencySymbol)}</strong></span>
        </div>
      )}

      <div style={{ overflowX: 'auto' }}>
        <svg
          width={Math.max(chartW, buckets.length * gapW + 40)}
          height={chartH}
          style={{ display: 'block' }}
        >
          {/* Y axis labels */}
          <text x="2" y="16" fontSize="9" fill="var(--tx3)">{fmt(maxVal, currencySymbol)}</text>
          <text x="2" y={chartH - 8} fontSize="9" fill="var(--tx3)">0</text>

          {/* Bars */}
          {buckets.map((d, i) => {
            const x = 20 + i * gapW
            const revH = (d.revenue / maxVal) * (chartH - 40)
            const cogsH = (d.cogs / maxVal) * (chartH - 40)
            const fixH = (d.fixed / maxVal) * (chartH - 40)
            const isHovered = hoveredIdx === i

            return (
              <g
                key={i}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                onClick={() => setSelectedIdx(selectedIdx === i ? null : i)}
                style={{ cursor: 'pointer' }}
              >
                {/* Hover background */}
                {isHovered && (
                  <rect x={x - 1} y={0} width={barW + 2} height={chartH} fill="rgba(99,102,241,0.04)" rx={3} />
                )}
                {/* Revenue bar */}
                <rect
                  x={x} y={chartH - 20 - revH} width={barW} height={revH}
                  rx={2} fill="#22C55E" opacity={isHovered ? 1 : 0.7}
                />
                {/* COGS bar (offset right slightly) */}
                <rect
                  x={x + barW * 0.15} y={chartH - 20 - cogsH} width={barW * 0.7} height={cogsH}
                  rx={2} fill="#F97316" opacity={isHovered ? 0.9 : 0.5}
                />
                {/* Fixed cost bar (stacked on COGS) */}
                <rect
                  x={x + barW * 0.15} y={chartH - 20 - cogsH - fixH} width={barW * 0.7} height={fixH}
                  rx={1} fill="#EF4444" opacity={isHovered ? 0.9 : 0.45}
                />
              </g>
            )
          })}

          {/* Net profit line */}
          <polyline
            points={linePoints}
            fill="none"
            stroke="#6366F1"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.9}
          />

          {/* Zero line for net if there are negatives */}
          {minNet < 0 && (
            <line
              x1={16} y1={chartH - 20 - ((0 - minNet) / netRange) * (chartH - 40)}
              x2={20 + buckets.length * gapW}
              y2={chartH - 20 - ((0 - minNet) / netRange) * (chartH - 40)}
              stroke="var(--tx3)" strokeWidth={0.5} strokeDasharray="3,3" opacity={0.5}
            />
          )}

          {/* X axis labels (show every few) */}
          {buckets.map((d, i) => {
            const showLabel = buckets.length <= 14 || i % Math.ceil(buckets.length / 8) === 0 || i === buckets.length - 1
            if (!showLabel) return null
            return (
              <text
                key={`label-${i}`}
                x={20 + i * gapW + barW / 2}
                y={chartH - 2}
                fontSize="8"
                fill="var(--tx3)"
                textAnchor="middle"
              >
                {formatDate(d.date)}
              </text>
            )
          })}
        </svg>
      </div>

      {/* Drill-down detail panel */}
      {selected && (
        <div style={{ marginTop: 12, padding: '14px 16px', borderRadius: 10, border: '1px solid var(--b)', background: 'var(--ev, #f9f9f8)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--tx)' }}>
              {formatDate(selected.date)} — {tc('cfo_revtrend.detailedBreakdown')}
            </div>
            <button
              onClick={() => setSelectedIdx(null)}
              style={{ fontSize: 9, color: 'var(--tx3)', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              ✕ {tc('cfo_revtrend.close')}
            </button>
          </div>

          {/* Visual waterfall for the selected day */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
            <DrillRow label={tc('cfo_revtrend.rowRevenue')} amount={selected.revenue} pct={100} color="#22C55E" maxVal={selected.revenue} sym={currencySymbol} />
            <DrillRow label={tc('cfo_revtrend.rowCogs')} amount={selected.cogs} pct={selected.revenue > 0 ? (selected.cogs / selected.revenue) * 100 : 0} color="#F97316" maxVal={selected.revenue} sym={currencySymbol} />
            <DrillRow label={tc('cfo_revtrend.rowFixedCosts')} amount={selected.fixed} pct={selected.revenue > 0 ? (selected.fixed / selected.revenue) * 100 : 0} color="#EF4444" maxVal={selected.revenue} sym={currencySymbol} />
          </div>

          {/* Profit summary */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            <div style={{ padding: '8px 10px', borderRadius: 8, background: 'var(--sf)', border: '1px solid var(--b)', textAlign: 'center' }}>
              <div style={{ fontSize: 9, color: 'var(--tx3)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{tc('cfo_revtrend.grossProfit')}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: (selected.revenue - selected.cogs) >= 0 ? '#22C55E' : '#EF4444' }}>
                {fmt(selected.revenue - selected.cogs, currencySymbol)}
              </div>
              <div style={{ fontSize: 9, color: 'var(--tx3)' }}>
                {selected.revenue > 0 ? tc('cfo_revtrend.margin', { n: Math.round(((selected.revenue - selected.cogs) / selected.revenue) * 100) }) : '—'}
              </div>
            </div>
            <div style={{ padding: '8px 10px', borderRadius: 8, background: 'var(--sf)', border: '1px solid var(--b)', textAlign: 'center' }}>
              <div style={{ fontSize: 9, color: 'var(--tx3)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{tc('cfo_revtrend.totalCosts')}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#EF4444' }}>
                {fmt(selected.cogs + selected.fixed, currencySymbol)}
              </div>
              <div style={{ fontSize: 9, color: 'var(--tx3)' }}>
                {selected.revenue > 0 ? tc('cfo_revtrend.ofRevenue', { n: Math.round(((selected.cogs + selected.fixed) / selected.revenue) * 100) }) : '—'}
              </div>
            </div>
            <div style={{ padding: '8px 10px', borderRadius: 8, background: selected.net >= 0 ? 'rgba(34,197,94,.04)' : 'rgba(239,68,68,.04)', border: `1px solid ${selected.net >= 0 ? 'rgba(34,197,94,.2)' : 'rgba(239,68,68,.2)'}`, textAlign: 'center' }}>
              <div style={{ fontSize: 9, color: 'var(--tx3)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{tc('cfo_revtrend.netProfit')}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: selected.net >= 0 ? '#22C55E' : '#EF4444' }}>
                {fmt(selected.net, currencySymbol)}
              </div>
              <div style={{ fontSize: 9, color: 'var(--tx3)' }}>
                {selected.revenue > 0 ? tc('cfo_revtrend.margin', { n: Math.round((selected.net / selected.revenue) * 100) }) : '—'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function DrillRow({ label, amount, pct, color, maxVal, sym }: { label: string; amount: number; pct: number; color: string; maxVal: number; sym: string }) {
  const barPct = maxVal > 0 ? Math.max((amount / maxVal) * 100, 2) : 0
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ width: 70, fontSize: 9, color: 'var(--tx3)', textAlign: 'right', flexShrink: 0 }}>{label}</div>
      <div style={{ flex: 1, height: 22, borderRadius: 5, background: 'var(--sf)', overflow: 'hidden', border: '1px solid var(--b)' }}>
        <div style={{ height: '100%', width: `${barPct}%`, background: color, borderRadius: 5, display: 'flex', alignItems: 'center', paddingLeft: 6, transition: 'width 300ms' }}>
          {barPct > 20 && <span style={{ fontSize: 9, color: '#fff', fontWeight: 600 }}>{fmt(amount, sym)}</span>}
        </div>
      </div>
      <div style={{ width: 50, fontSize: 9, fontWeight: 600, color, textAlign: 'right', flexShrink: 0 }}>
        {Math.round(pct)}%
      </div>
      {barPct <= 20 && <span style={{ fontSize: 9, color, fontWeight: 600, flexShrink: 0 }}>{fmt(amount, sym)}</span>}
    </div>
  )
}

function aggregateWeekly(data: ChartPoint[]): ChartPoint[] {
  const weeks: ChartPoint[] = []
  let current: ChartPoint | null = null
  let count = 0

  for (const d of data) {
    const dt = new Date(d.date + 'T00:00:00')
    const dow = dt.getDay()
    if (dow === 1 || !current) {
      if (current) weeks.push(current)
      current = { ...d }
      count = 1
    } else {
      current.revenue += d.revenue
      current.cogs += d.cogs
      current.fixed += d.fixed
      current.net += d.net
      count++
    }
  }
  if (current) weeks.push(current)
  return weeks
}
