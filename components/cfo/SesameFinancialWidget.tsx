'use client'
import { useState, useEffect } from 'react'

interface SesameData {
  revenue: number
  gross_profit: number
  gross_margin_pct: number
  inventory_value: number
  costBreakdown: {
    feed: number
    jerrycans: number
    waste: number
  }
}

export default function SesameFinancialWidget({ period = 'this_month' }: { period?: string }) {
  const [data, setData] = useState<SesameData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch_data = async () => {
      try {
        const res = await fetch(`/api/pos/factory/sesame-production`)
        if (res.ok) {
          const d = await res.json()
          setData(d)
        }
      } catch (e) {
        console.error('Sesame widget load error:', e)
      } finally {
        setLoading(false)
      }
    }
    fetch_data()
  }, [period])

  if (loading || !data) return null

  const fmtCurrency = (n: number) => {
    if (Math.abs(n) >= 1_000_000) return `KSh${(n / 1_000_000).toFixed(1)}M`
    if (Math.abs(n) >= 1_000) return `KSh${(n / 1_000).toFixed(0)}K`
    return `KSh${Math.round(n).toLocaleString()}`
  }

  return (
    <div style={{ borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', padding: '16px', marginTop: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <div style={{ width: 3, height: 14, borderRadius: 2, background: '#6366F1' }} />
        <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--tx)' }}>🌾 Sesame Production Financial</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
        <div style={{ background: 'var(--ev)', borderRadius: 8, padding: 12 }}>
          <div style={{ fontSize: 11, color: 'var(--tx3)', marginBottom: 3 }}>Revenue</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#22C55E' }}>{fmtCurrency(data.revenue)}</div>
        </div>

        <div style={{ background: 'var(--ev)', borderRadius: 8, padding: 12 }}>
          <div style={{ fontSize: 11, color: 'var(--tx3)', marginBottom: 3 }}>Gross Profit</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#6366F1' }}>{fmtCurrency(data.gross_profit)}</div>
        </div>

        <div style={{ background: 'var(--ev)', borderRadius: 8, padding: 12 }}>
          <div style={{ fontSize: 11, color: 'var(--tx3)', marginBottom: 3 }}>Gross Margin</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: data.gross_margin_pct >= 35 ? '#22C55E' : data.gross_margin_pct >= 20 ? '#F59E0B' : '#EF4444' }}>
            {data.gross_margin_pct.toFixed(1)}%
          </div>
        </div>

        <div style={{ background: 'var(--ev)', borderRadius: 8, padding: 12 }}>
          <div style={{ fontSize: 11, color: 'var(--tx3)', marginBottom: 3 }}>Inventory Value</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#BLUE' }}>{fmtCurrency(data.inventory_value)}</div>
        </div>
      </div>

      <div style={{ background: 'var(--ev)', borderRadius: 8, padding: 12, marginTop: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8, color: 'var(--tx)' }}>Cost Breakdown</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, fontSize: 11 }}>
          <div>
            <div style={{ color: 'var(--tx3)', marginBottom: 2 }}>Feed</div>
            <div style={{ fontWeight: 600, color: 'var(--tx)' }}>{fmtCurrency(data.costBreakdown.feed)}</div>
          </div>
          <div>
            <div style={{ color: 'var(--tx3)', marginBottom: 2 }}>Jerrycans</div>
            <div style={{ fontWeight: 600, color: 'var(--tx)' }}>{fmtCurrency(data.costBreakdown.jerrycans)}</div>
          </div>
          <div>
            <div style={{ color: 'var(--tx3)', marginBottom: 2 }}>Waste</div>
            <div style={{ fontWeight: 600, color: 'var(--tx)' }}>{fmtCurrency(data.costBreakdown.waste)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
