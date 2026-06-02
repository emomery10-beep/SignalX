'use client'
import { useState, useEffect } from 'react'
import { detectGeoFromTimezone } from '@/lib/geo'

interface ProductRow {
  name: string
  qty: number
  revenue: number
  margin: number
}

interface TopProductsProps {
  onAsk: (prompt: string) => void
}

export default function TopProducts({ onAsk }: TopProductsProps) {
  const [products, setProducts] = useState<ProductRow[]>([])
  const [allProducts, setAllProducts] = useState<ProductRow[]>([])
  const [loading, setLoading] = useState(true)
  const [hovered, setHovered] = useState<number | null>(null)
  const [expanded, setExpanded] = useState(false)
  const [sym, setSym] = useState('$')

  useEffect(() => {
    const geo = detectGeoFromTimezone()
    setSym(geo.symbol)
  }, [])

  useEffect(() => {
    const now = new Date()
    const from = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30).toISOString()
    fetch(`/api/pos/transactions?from=${from}&limit=500`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        const txns = data?.transactions || (Array.isArray(data) ? data : [])
        const map: Record<string, { qty: number; revenue: number; cost: number }> = {}
        for (const tx of txns) {
          const items = tx.pos_items || tx.items || []
          for (const item of items) {
            const name = item.name || 'Unknown'
            const qty = Number(item.qty) || 0
            const price = Number(item.unit_price) || 0
            const cost = Number(item.cost_price) || 0
            if (!map[name]) map[name] = { qty: 0, revenue: 0, cost: 0 }
            map[name].qty += qty
            map[name].revenue += qty * price
            map[name].cost += qty * cost
          }
        }
        const rows = Object.entries(map)
          .map(([name, d]) => ({
            name,
            qty: d.qty,
            revenue: d.revenue,
            margin: d.revenue > 0 ? ((d.revenue - d.cost) / d.revenue) * 100 : 0,
          }))
          .sort((a, b) => b.revenue - a.revenue)
        setAllProducts(rows)
        setProducts(rows.slice(0, 5))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const displayProducts = expanded ? allProducts.slice(0, 15) : products
  const maxRev = displayProducts.length > 0 ? Math.max(...displayProducts.map(p => p.revenue)) : 1
  const totalRev = allProducts.reduce((s, p) => s + p.revenue, 0)
  const totalCost = allProducts.reduce((s, p) => s + (p.revenue * (1 - p.margin / 100)), 0)
  const avgMargin = totalRev > 0 ? ((totalRev - totalCost) / totalRev * 100) : 0

  if (loading) {
    return (
      <div style={{ padding: '16px 18px', borderRadius: 16, border: '1px solid var(--b)', background: 'var(--sf)', height: 180 }}>
        <div style={{ height: 14, width: 100, borderRadius: 4, background: 'var(--ev)', marginBottom: 16 }} />
        {[1, 2, 3].map(i => (
          <div key={i} style={{ height: 10, borderRadius: 3, background: 'var(--ev)', marginBottom: 12, width: `${90 - i * 15}%` }} />
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div style={{ padding: '16px 18px', borderRadius: 16, border: '1px solid var(--b)', background: 'linear-gradient(180deg, var(--sf) 0%, rgba(34,197,94,.02) 100%)', fontSize: 13, color: 'var(--tx3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span>No sales data yet</span>
        <button onClick={() => onAsk('What products should I focus on selling?')} style={{ fontSize: 12, color: '#22C55E', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>Ask AskBiz &rarr;</button>
      </div>
    )
  }

  return (
    <div
      style={{
        padding: '16px 18px 14px',
        borderRadius: 16,
        border: expanded ? '1px solid #22C55E30' : '1px solid var(--b)',
        background: 'linear-gradient(180deg, var(--sf) 0%, rgba(34,197,94,.02) 100%)',
        transition: 'all 300ms ease',
        boxShadow: expanded ? '0 6px 24px rgba(0,0,0,0.08)' : 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.08em' }}>
            Top Products
          </span>
          <span style={{ fontSize: 9, color: 'var(--tx3)', opacity: 0.7 }}>30d</span>
        </div>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#22C55E', fontFamily: 'var(--font-sora, inherit)' }}>
          {sym}{totalRev.toLocaleString('en', { maximumFractionDigits: 0 })}
        </span>
      </div>

      {/* Expanded KPI summary */}
      {expanded && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: 8, marginBottom: 12, animation: 'fadeIn 200ms ease' }}>
          <div style={{ padding: '8px 10px', borderRadius: 8, background: 'var(--ev)' }}>
            <div style={{ fontSize: 9, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 2 }}>Products</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--tx)' }}>{allProducts.length}</div>
          </div>
          <div style={{ padding: '8px 10px', borderRadius: 8, background: 'var(--ev)' }}>
            <div style={{ fontSize: 9, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 2 }}>Avg margin</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: avgMargin >= 40 ? '#22C55E' : avgMargin >= 20 ? '#F59E0B' : '#EF4444' }}>{avgMargin.toFixed(0)}%</div>
          </div>
          <div style={{ padding: '8px 10px', borderRadius: 8, background: 'var(--ev)' }}>
            <div style={{ fontSize: 9, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 2 }}>Units sold</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--tx)' }}>{Math.round(allProducts.reduce((s, p) => s + p.qty, 0))}</div>
          </div>
        </div>
      )}

      {/* Header row for expanded table */}
      {expanded && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, paddingBottom: 6, borderBottom: '1px solid var(--b)' }}>
          <span style={{ width: 14, fontSize: 9, fontWeight: 700, color: 'var(--tx3)', textAlign: 'right', flexShrink: 0 }}>#</span>
          <span style={{ flex: 1, fontSize: 9, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em' }}>Product</span>
          <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', width: 50, textAlign: 'right' }}>Revenue</span>
          <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', width: 40, textAlign: 'right' }}>Qty</span>
          <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', width: 40, textAlign: 'right' }}>Margin</span>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: expanded ? 4 : 6 }}>
        {displayProducts.map((p, i) => {
          const pct = p.revenue / maxRev
          const isHov = hovered === i
          return expanded ? (
            <div
              key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '3px 0', borderRadius: 4, transition: 'background 100ms', background: isHov ? 'var(--ev)' : 'transparent' }}
            >
              <span style={{ width: 14, fontSize: 10, fontWeight: 700, color: i < 3 ? '#22C55E' : 'var(--tx3)', textAlign: 'right', flexShrink: 0 }}>{i + 1}</span>
              <span style={{ flex: 1, fontSize: 11, fontWeight: i < 3 ? 600 : 400, color: 'var(--tx2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</span>
              <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--tx)', width: 50, textAlign: 'right' }}>{sym}{p.revenue.toLocaleString('en', { maximumFractionDigits: 0 })}</span>
              <span style={{ fontSize: 10, color: 'var(--tx3)', width: 40, textAlign: 'right' }}>{p.qty}</span>
              <span style={{ fontSize: 10, fontWeight: 600, color: p.margin >= 40 ? '#22C55E' : p.margin >= 20 ? '#F59E0B' : '#EF4444', width: 40, textAlign: 'right' }}>{p.margin.toFixed(0)}%</span>
            </div>
          ) : (
            <div
              key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <span style={{ width: 14, fontSize: 10, fontWeight: 700, color: i === 0 ? '#22C55E' : 'var(--tx3)', textAlign: 'right', flexShrink: 0 }}>
                {i + 1}
              </span>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 11, fontWeight: i === 0 ? 700 : 500, color: isHov ? 'var(--tx)' : 'var(--tx2)', transition: 'color 100ms', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 140 }}>
                    {p.name}
                  </span>
                  <div style={{ display: 'flex', gap: 8, fontSize: 10, flexShrink: 0 }}>
                    <span style={{ color: 'var(--tx3)' }}>{p.qty} sold</span>
                    <span style={{ color: p.margin >= 40 ? '#22C55E' : p.margin >= 20 ? '#F59E0B' : '#EF4444', fontWeight: 600 }}>
                      {p.margin.toFixed(0)}%
                    </span>
                  </div>
                </div>
                <div style={{ height: 4, background: 'var(--ev)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${pct * 100}%`,
                    background: i === 0 ? 'linear-gradient(90deg, #22C55E, #22C55Eaa)' : 'linear-gradient(90deg, #6366F1cc, #6366F166)',
                    borderRadius: 2,
                    transition: 'width 400ms ease',
                  }} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, paddingTop: 8, borderTop: '1px solid var(--b)' }}>
        <span style={{ fontSize: 9, color: 'var(--tx3)', opacity: 0.7 }}>Revenue ranked · from POS data</span>
        <button
          onClick={() => setExpanded(e => !e)}
          style={{ fontSize: 9, color: '#22C55E', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}
        >
          {expanded ? '← Collapse' : 'Tap to analyse →'}
        </button>
      </div>
    </div>
  )
}
