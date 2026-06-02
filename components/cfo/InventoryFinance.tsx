'use client'
import { useState, useEffect } from 'react'

interface Product {
  name: string
  category: string
  source: string
  price: number
  cost_price: number
  stock_quantity: number
  low_stock_threshold: number
  margin_pct: number
  value_at_cost: number
  value_at_retail: number
  status: 'healthy' | 'low' | 'out'
  units_sold: number
  sku: string
}

interface Summary {
  total_products: number
  total_value_cost: number
  total_value_retail: number
  potential_profit: number
  out_of_stock: number
  low_stock: number
  healthy_stock: number
  stockout_rate: number
}

interface SourceBreakdown {
  source: string
  count: number
  value: number
  lowOrOos: number
}

interface CategoryBreakdown {
  category: string
  count: number
  value: number
  avg_margin: number
}

interface Props {
  onAsk?: (prompt: string) => void
}

const SOURCE_COLORS: Record<string, string> = {
  POS: '#6366F1', Shopify: '#96BF48', Amazon: '#FF9900', eBay: '#E53238',
  Etsy: '#F1641E', Stripe: '#635BFF', WooCommerce: '#7B2D8E', Square: '#00D632',
  TikTok: '#010101', Jumia: '#F68B1E', Takealot: '#0B79BF', Sheets: '#0F9D58', CSV: '#6B7280',
}

function fmt(n: number, sym: string): string {
  if (Math.abs(n) >= 1_000_000) return `${sym}${(n / 1_000_000).toFixed(1)}M`
  if (Math.abs(n) >= 1_000) return `${sym}${(n / 1_000).toFixed(1)}K`
  return `${sym}${Math.round(n).toLocaleString()}`
}

export default function InventoryFinance({ onAsk }: Props) {
  const [products, setProducts] = useState<Product[]>([])
  const [summary, setSummary] = useState<Summary | null>(null)
  const [bySource, setBySource] = useState<SourceBreakdown[]>([])
  const [byCategory, setByCategory] = useState<CategoryBreakdown[]>([])
  const [loading, setLoading] = useState(true)
  const [sym, setSym] = useState('$')
  const [filter, setFilter] = useState<'all' | 'out' | 'low' | 'healthy'>('all')
  const [sourceFilter, setSourceFilter] = useState<string | null>(null)
  const [sortKey, setSortKey] = useState<'value' | 'margin' | 'stock' | 'units'>('value')
  const [viewMode, setViewMode] = useState<'products' | 'categories'>('products')

  useEffect(() => {
    fetch('/api/cfo/inventory')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return
        if (data.currency_symbol) setSym(data.currency_symbol)
        setProducts(data.products || [])
        setSummary(data.summary || null)
        setBySource(data.by_source || [])
        setByCategory(data.by_category || [])
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
        {[1, 2, 3].map(i => (
          <div key={i} style={{ height: 44, borderRadius: 10, background: 'var(--ev, #f3f2ef)', animation: 'pulse 1.5s infinite', marginBottom: 8 }} />
        ))}
      </div>
    )
  }

  if (!summary || summary.total_products === 0) {
    return (
      <div style={{ borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', padding: '24px 18px', textAlign: 'center' }}>
        <div style={{ fontSize: 13, color: 'var(--tx3)', marginBottom: 6 }}>No inventory data found</div>
        <div style={{ fontSize: 11, color: 'var(--tx3)' }}>Connect a data source (POS, Shopify, Amazon, etc.) to track inventory.</div>
      </div>
    )
  }

  // Apply filters
  let filtered = products
  if (filter !== 'all') filtered = filtered.filter(p => p.status === filter)
  if (sourceFilter) filtered = filtered.filter(p => p.source === sourceFilter)

  // Apply sort
  const sorted = [...filtered].sort((a, b) => {
    switch (sortKey) {
      case 'value': return b.value_at_cost - a.value_at_cost
      case 'margin': return b.margin_pct - a.margin_pct
      case 'stock': return a.stock_quantity - b.stock_quantity
      case 'units': return b.units_sold - a.units_sold
      default: return 0
    }
  })

  const maxCategoryValue = byCategory.length > 0 ? Math.max(...byCategory.map(c => c.value)) : 1

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Summary Card */}
      <div style={{ borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--b)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 3, height: 14, borderRadius: 2, background: '#6366F1' }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)' }}>Inventory Finance</span>
            <span style={{ fontSize: 10, color: 'var(--tx3)' }}>
              {summary.total_products} products from {bySource.length} source{bySource.length !== 1 ? 's' : ''}
            </span>
          </div>
          {onAsk && (
            <button
              onClick={() => onAsk(`My inventory across all sources: ${fmt(summary.total_value_cost, sym)} at cost (${fmt(summary.total_value_retail, sym)} retail), ${summary.stockout_rate}% stockout rate (${summary.out_of_stock} OOS, ${summary.low_stock} low stock). Sources: ${bySource.map(s => `${s.source} (${s.count} products, ${fmt(s.value, sym)})`).join(', ')}. What should I restock first, what dead stock should I discount, and how can I optimize across channels?`)}
              style={{ fontSize: 10, color: '#6366F1', background: 'rgba(99,102,241,.08)', border: 'none', borderRadius: 6, padding: '3px 8px', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}
            >
              Ask AI
            </button>
          )}
        </div>

        {/* KPI metrics */}
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
            {summary.healthy_stock > 0 && (
              <div style={{ width: `${(summary.healthy_stock / summary.total_products) * 100}%`, background: '#22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'width 300ms' }}>
                <span style={{ fontSize: 9, color: '#fff', fontWeight: 600 }}>{summary.healthy_stock}</span>
              </div>
            )}
            {summary.low_stock > 0 && (
              <div style={{ width: `${(summary.low_stock / summary.total_products) * 100}%`, background: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'width 300ms' }}>
                <span style={{ fontSize: 9, color: '#fff', fontWeight: 600 }}>{summary.low_stock}</span>
              </div>
            )}
            {summary.out_of_stock > 0 && (
              <div style={{ width: `${(summary.out_of_stock / summary.total_products) * 100}%`, background: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'width 300ms' }}>
                <span style={{ fontSize: 9, color: '#fff', fontWeight: 600 }}>{summary.out_of_stock}</span>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 6, fontSize: 10, color: 'var(--tx3)' }}>
            <span><span style={{ color: '#22C55E' }}>●</span> Healthy ({summary.healthy_stock})</span>
            <span><span style={{ color: '#F59E0B' }}>●</span> Low ({summary.low_stock})</span>
            <span><span style={{ color: '#EF4444' }}>●</span> Out ({summary.out_of_stock})</span>
          </div>
        </div>
      </div>

      {/* Source Breakdown */}
      {bySource.length > 1 && (
        <div style={{ borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', overflow: 'hidden' }}>
          <div style={{ padding: '12px 18px', borderBottom: '1px solid var(--b)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{ width: 3, height: 14, borderRadius: 2, background: '#F97316' }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)' }}>Inventory by Source</span>
            </div>

            {/* Source bar */}
            <div style={{ height: 24, borderRadius: 6, overflow: 'hidden', display: 'flex', marginBottom: 8 }}>
              {bySource.map(s => {
                const pct = summary.total_value_cost > 0 ? (s.value / summary.total_value_cost) * 100 : 0
                return (
                  <div
                    key={s.source}
                    style={{
                      width: `${Math.max(pct, 2)}%`, background: SOURCE_COLORS[s.source] || '#6B7280',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', transition: 'opacity 150ms',
                      opacity: sourceFilter && sourceFilter !== s.source ? 0.4 : 1,
                    }}
                    onClick={() => setSourceFilter(sourceFilter === s.source ? null : s.source)}
                  >
                    {pct > 12 && <span style={{ fontSize: 9, color: '#fff', fontWeight: 600 }}>{s.source}</span>}
                  </div>
                )
              })}
            </div>

            {/* Source legend */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 14px' }}>
              {bySource.map(s => (
                <button
                  key={s.source}
                  onClick={() => setSourceFilter(sourceFilter === s.source ? null : s.source)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4, fontSize: 10,
                    color: sourceFilter && sourceFilter !== s.source ? 'var(--tx3)' : 'var(--tx)',
                    background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: 0,
                  }}
                >
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: SOURCE_COLORS[s.source] || '#6B7280', display: 'inline-block' }} />
                  {s.source}: {s.count} products · {fmt(s.value, sym)}
                  {s.lowOrOos > 0 && <span style={{ color: '#EF4444', fontWeight: 600 }}> ({s.lowOrOos} alerts)</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Category Breakdown */}
      {byCategory.length > 1 && viewMode === 'categories' && (
        <div style={{ borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', overflow: 'hidden' }}>
          <div style={{ padding: '12px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ width: 3, height: 14, borderRadius: 2, background: '#22C55E' }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)' }}>Inventory by Category</span>
            </div>
            {byCategory.map((cat, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', borderBottom: i < byCategory.length - 1 ? '1px solid var(--b)' : undefined }}>
                <div style={{ width: 120, fontSize: 11, color: 'var(--tx)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flexShrink: 0 }}>{cat.category}</div>
                <div style={{ flex: 1, height: 16, borderRadius: 4, background: 'var(--ev, #f3f2ef)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(cat.value / maxCategoryValue) * 100}%`, background: '#6366F1', borderRadius: 4, transition: 'width 300ms' }} />
                </div>
                <div style={{ width: 60, fontSize: 11, fontWeight: 600, color: 'var(--tx)', textAlign: 'right', fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>{fmt(cat.value, sym)}</div>
                <div style={{ width: 40, fontSize: 10, color: cat.avg_margin >= 40 ? '#22C55E' : cat.avg_margin >= 20 ? '#F59E0B' : '#EF4444', textAlign: 'right', flexShrink: 0 }}>{cat.avg_margin}%</div>
                <div style={{ width: 24, fontSize: 10, color: 'var(--tx3)', textAlign: 'right', flexShrink: 0 }}>{cat.count}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Products Table */}
      <div style={{ borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', overflow: 'hidden' }}>
        {/* Filters row */}
        <div style={{ padding: '10px 18px', borderBottom: '1px solid var(--b)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
          <div style={{ display: 'flex', gap: 4 }}>
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
          <div style={{ display: 'flex', gap: 4 }}>
            <button
              onClick={() => setViewMode('products')}
              style={{
                padding: '4px 8px', borderRadius: 6, fontSize: 10, fontWeight: viewMode === 'products' ? 600 : 400,
                border: viewMode === 'products' ? '1px solid #6366F1' : '1px solid var(--b)',
                background: viewMode === 'products' ? 'rgba(99,102,241,.08)' : 'transparent',
                color: viewMode === 'products' ? '#6366F1' : 'var(--tx3)',
                cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              Products
            </button>
            {byCategory.length > 1 && (
              <button
                onClick={() => setViewMode('categories')}
                style={{
                  padding: '4px 8px', borderRadius: 6, fontSize: 10, fontWeight: viewMode === 'categories' ? 600 : 400,
                  border: viewMode === 'categories' ? '1px solid #6366F1' : '1px solid var(--b)',
                  background: viewMode === 'categories' ? 'rgba(99,102,241,.08)' : 'transparent',
                  color: viewMode === 'categories' ? '#6366F1' : 'var(--tx3)',
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                Categories
              </button>
            )}
          </div>
        </div>

        {/* Sort row */}
        <div style={{ padding: '6px 18px', borderBottom: '1px solid var(--b)', display: 'flex', gap: 4, fontSize: 10, color: 'var(--tx3)' }}>
          <span>Sort by:</span>
          {([['value', 'Value'], ['margin', 'Margin'], ['stock', 'Stock Level'], ['units', 'Units Sold']] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSortKey(key)}
              style={{
                fontSize: 10, fontWeight: sortKey === key ? 600 : 400,
                color: sortKey === key ? '#6366F1' : 'var(--tx3)',
                background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                textDecoration: sortKey === key ? 'underline' : 'none', padding: '0 4px',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Product list */}
        <div style={{ padding: '8px 18px' }}>
          <div style={{ fontSize: 10, color: 'var(--tx3)', marginBottom: 6 }}>
            Showing {Math.min(sorted.length, 30)} of {sorted.length} products
            {sourceFilter && <span> · Filtered: <strong>{sourceFilter}</strong> <button onClick={() => setSourceFilter(null)} style={{ color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: 10, fontFamily: 'inherit' }}>clear</button></span>}
          </div>
          <div style={{ maxHeight: 400, overflowY: 'auto' }}>
            {sorted.slice(0, 30).map((p, i) => (
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--tx)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {p.name}
                    </span>
                    <span style={{
                      fontSize: 8, fontWeight: 600, padding: '1px 4px', borderRadius: 3,
                      background: SOURCE_COLORS[p.source] ? `${SOURCE_COLORS[p.source]}18` : 'rgba(107,114,128,.1)',
                      color: SOURCE_COLORS[p.source] || '#6B7280',
                      flexShrink: 0,
                    }}>
                      {p.source}
                    </span>
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--tx3)', display: 'flex', gap: 8, marginTop: 1 }}>
                    <span>{p.stock_quantity} units</span>
                    <span>{sym}{p.cost_price.toFixed(0)} cost</span>
                    <span style={{ color: p.margin_pct >= 40 ? '#22C55E' : p.margin_pct >= 20 ? '#F59E0B' : '#EF4444' }}>{p.margin_pct}% margin</span>
                    {p.units_sold > 0 && <span>{p.units_sold} sold</span>}
                    {p.category !== 'Uncategorized' && <span>{p.category}</span>}
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
            {sorted.length === 0 && (
              <div style={{ padding: 16, textAlign: 'center', color: 'var(--tx3)', fontSize: 12 }}>No products match your filters</div>
            )}
          </div>
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
