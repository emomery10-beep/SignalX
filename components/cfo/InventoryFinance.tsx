'use client'
import { useState, useEffect } from 'react'

interface Product {
  name: string
  category: string
  price: number
  cost_price: number
  stock_quantity: number
  low_stock_threshold: number
  margin_pct: number
  value_at_cost: number
  value_at_retail: number
  status: 'healthy' | 'low' | 'out'
}

interface Summary {
  total_products: number
  total_value_cost: number
  total_value_retail: number
  potential_profit: number
  out_of_stock: number
  low_stock: number
  healthy_stock: number
  dead_stock_value: number
  stockout_rate: number
}

interface Props {
  onAsk?: (prompt: string) => void
}

function fmt(n: number, sym: string): string {
  if (Math.abs(n) >= 1_000_000) return `${sym}${(n / 1_000_000).toFixed(1)}M`
  if (Math.abs(n) >= 1_000) return `${sym}${(n / 1_000).toFixed(0)}K`
  return `${sym}${Math.round(n).toLocaleString()}`
}

export default function InventoryFinance({ onAsk }: Props) {
  const [products, setProducts] = useState<Product[]>([])
  const [summary, setSummary] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(true)
  const [sym, setSym] = useState('$')
  const [filter, setFilter] = useState<'all' | 'out' | 'low' | 'healthy'>('all')

  useEffect(() => {
    fetch('/api/pos/products?limit=500')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return
        const raw = Array.isArray(data) ? data : data.products || []
        if (data.currency_symbol) setSym(data.currency_symbol)

        const mapped: Product[] = raw.map((p: any) => {
          const price = p.price || 0
          const cost = p.cost_price || 0
          const qty = p.stock_quantity ?? 0
          const threshold = p.low_stock_threshold || 5
          const marginPct = price > 0 ? ((price - cost) / price) * 100 : 0
          const status: Product['status'] = qty === 0 ? 'out' : qty <= threshold ? 'low' : 'healthy'

          return {
            name: p.name || 'Unknown',
            category: p.category || 'Uncategorized',
            price,
            cost_price: cost,
            stock_quantity: qty,
            low_stock_threshold: threshold,
            margin_pct: Math.round(marginPct),
            value_at_cost: cost * qty,
            value_at_retail: price * qty,
            status,
          }
        })

        setProducts(mapped)

        const outOfStock = mapped.filter(p => p.status === 'out').length
        const lowStock = mapped.filter(p => p.status === 'low').length
        const totalCost = mapped.reduce((s, p) => s + p.value_at_cost, 0)
        const totalRetail = mapped.reduce((s, p) => s + p.value_at_retail, 0)

        setSummary({
          total_products: mapped.length,
          total_value_cost: totalCost,
          total_value_retail: totalRetail,
          potential_profit: totalRetail - totalCost,
          out_of_stock: outOfStock,
          low_stock: lowStock,
          healthy_stock: mapped.length - outOfStock - lowStock,
          dead_stock_value: 0,
          stockout_rate: mapped.length > 0 ? Math.round(((outOfStock + lowStock) / mapped.length) * 100) : 0,
        })
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div style={{ borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <div style={{ width: 3, height: 14, borderRadius: 2, background: '#6366F1' }} />
          <span style={{ fontSize: 12, fontWeight: 700 }}>Inventory Finance</span>
        </div>
        {[1, 2].map(i => (
          <div key={i} style={{ height: 44, borderRadius: 10, background: 'var(--ev, #f3f2ef)', animation: 'pulse 1.5s infinite', marginBottom: 8 }} />
        ))}
      </div>
    )
  }

  if (!summary || summary.total_products === 0) return null

  const filtered = filter === 'all' ? products : products.filter(p => p.status === filter)
  const topByValue = [...products].sort((a, b) => b.value_at_cost - a.value_at_cost).slice(0, 10)

  return (
    <div style={{ borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', overflow: 'hidden' }}>
      <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--b)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 3, height: 14, borderRadius: 2, background: '#6366F1' }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)' }}>Inventory Finance</span>
          <span style={{ fontSize: 10, color: 'var(--tx3)' }}>({summary.total_products} products)</span>
        </div>
        {onAsk && (
          <button
            onClick={() => onAsk(`My inventory: ${fmt(summary.total_value_cost, sym)} at cost, ${summary.stockout_rate}% stockout rate (${summary.out_of_stock} OOS, ${summary.low_stock} low). What should I restock first and what dead stock should I discount?`)}
            style={{ fontSize: 10, color: '#6366F1', background: 'rgba(99,102,241,.08)', border: 'none', borderRadius: 6, padding: '3px 8px', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}
          >
            Ask AI
          </button>
        )}
      </div>

      {/* Summary metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'var(--b)' }}>
        <MetricCell label="Value at Cost" value={fmt(summary.total_value_cost, sym)} color="var(--tx)" />
        <MetricCell label="Value at Retail" value={fmt(summary.total_value_retail, sym)} color="#6366F1" />
        <MetricCell label="Potential Profit" value={fmt(summary.potential_profit, sym)} color="#22C55E" />
        <MetricCell label="Stockout Rate" value={`${summary.stockout_rate}%`} color={summary.stockout_rate > 50 ? '#EF4444' : summary.stockout_rate > 30 ? '#F59E0B' : '#22C55E'} />
      </div>

      {/* Stock health bar */}
      <div style={{ padding: '12px 18px', borderBottom: '1px solid var(--b)' }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Stock Health</div>
        <div style={{ height: 20, borderRadius: 6, overflow: 'hidden', display: 'flex' }}>
          <div style={{ width: `${(summary.healthy_stock / summary.total_products) * 100}%`, background: '#22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'width 300ms' }}>
            <span style={{ fontSize: 9, color: '#fff', fontWeight: 600 }}>{summary.healthy_stock}</span>
          </div>
          <div style={{ width: `${(summary.low_stock / summary.total_products) * 100}%`, background: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'width 300ms' }}>
            {summary.low_stock > 0 && <span style={{ fontSize: 9, color: '#fff', fontWeight: 600 }}>{summary.low_stock}</span>}
          </div>
          <div style={{ width: `${(summary.out_of_stock / summary.total_products) * 100}%`, background: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'width 300ms' }}>
            {summary.out_of_stock > 0 && <span style={{ fontSize: 9, color: '#fff', fontWeight: 600 }}>{summary.out_of_stock}</span>}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 6, fontSize: 10, color: 'var(--tx3)' }}>
          <span><span style={{ color: '#22C55E' }}>●</span> Healthy ({summary.healthy_stock})</span>
          <span><span style={{ color: '#F59E0B' }}>●</span> Low ({summary.low_stock})</span>
          <span><span style={{ color: '#EF4444' }}>●</span> Out ({summary.out_of_stock})</span>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ padding: '10px 18px', borderBottom: '1px solid var(--b)', display: 'flex', gap: 4 }}>
        {([['all', 'All'], ['out', 'Out of Stock'], ['low', 'Low Stock'], ['healthy', 'Healthy']] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            style={{
              padding: '4px 8px', borderRadius: 6, fontSize: 10, fontWeight: filter === key ? 600 : 400,
              border: filter === key ? '1px solid #6366F1' : '1px solid var(--b)',
              background: filter === key ? 'rgba(99,102,241,.08)' : 'transparent',
              color: filter === key ? '#6366F1' : 'var(--tx3)',
              cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Top products by capital tied up */}
      <div style={{ padding: '12px 18px' }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
          {filter === 'all' ? 'Top 10 by Capital Tied Up' : `${filter === 'out' ? 'Out of Stock' : filter === 'low' ? 'Low Stock' : 'Healthy Stock'} Products`}
        </div>
        <div style={{ maxHeight: 280, overflowY: 'auto' }}>
          {(filter === 'all' ? topByValue : filtered.slice(0, 20)).map((p, i) => (
            <div
              key={i}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 0',
                borderBottom: '1px solid var(--b)',
              }}
            >
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: p.status === 'out' ? '#EF4444' : p.status === 'low' ? '#F59E0B' : '#22C55E',
                flexShrink: 0,
              }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--tx)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {p.name}
                </div>
                <div style={{ fontSize: 10, color: 'var(--tx3)' }}>
                  {p.stock_quantity} units · {sym}{p.cost_price} cost · {p.margin_pct}% margin
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx)', fontVariantNumeric: 'tabular-nums' }}>
                  {fmt(p.value_at_cost, sym)}
                </div>
                <div style={{ fontSize: 9, color: 'var(--tx3)' }}>tied up</div>
              </div>
            </div>
          ))}
          {(filter !== 'all' ? filtered : topByValue).length === 0 && (
            <div style={{ padding: 16, textAlign: 'center', color: 'var(--tx3)', fontSize: 12 }}>No products in this category</div>
          )}
        </div>
      </div>
    </div>
  )
}

function MetricCell({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ padding: '10px 12px', background: 'var(--sf)', textAlign: 'center' }}>
      <div style={{ fontSize: 9, color: 'var(--tx3)', marginBottom: 3, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 700, color, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
    </div>
  )
}
