'use client'
import { useState, useEffect, useMemo } from 'react'

interface Product {
  sku: string; name: string; channel: string
  current_price: number; prev_price: number
  price_change_pct: number; volume_change_pct: number; revenue_change_pct: number
  elasticity: number; margin_pct: number
  sensitivity: string; opportunity: string | null
  monthly_units: number; monthly_revenue: number
}

const SENSITIVITY_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  elastic:      { label: 'Price Sensitive', color: '#EF4444', icon: '🔴' },
  inelastic:    { label: 'Price Resilient', color: '#10B981', icon: '🟢' },
  unit_elastic: { label: 'Balanced',        color: '#F59E0B', icon: '🟡' },
  inverse:      { label: 'Premium Effect',  color: '#6366F1', icon: '💎' },
  stable:       { label: 'Stable',          color: 'var(--tx3)', icon: '⚪' },
}

export default function PriceSensitivity({ onAsk }: { onAsk?: (prompt: string) => void }) {
  const [products, setProducts] = useState<Product[]>([])
  const [insights, setInsights] = useState<string[]>([])
  const [summary, setSummary] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string | null>(null)
  const [sym, setSym] = useState('£')

  useEffect(() => {
    fetch('/api/price-sensitivity')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        setProducts(data.products || [])
        setInsights(data.insights || [])
        setSummary(data.summary || null)
        if (data.currency_symbol) setSym(data.currency_symbol)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div style={{ padding: '16px 18px', borderRadius: 16, border: '1px solid var(--b)', background: 'var(--sf)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <div style={{ width: 3, height: 14, borderRadius: 2, background: '#F97316' }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)', letterSpacing: '.02em' }}>Price Sensitivity</span>
        </div>
        {[1, 2].map(i => (
          <div key={i} style={{ height: 44, borderRadius: 10, background: 'var(--ev, #f3f2ef)', animation: 'pulse 1.5s infinite', marginBottom: 8 }} />
        ))}
      </div>
    )
  }

  if (products.length === 0) return null

  const filtered = filter ? products.filter(p => p.sensitivity === filter) : products

  return (
    <div style={{ padding: '16px 18px', borderRadius: 16, border: '1px solid var(--b)', background: 'var(--sf)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 3, height: 14, borderRadius: 2, background: '#F97316' }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)', letterSpacing: '.02em' }}>Price Sensitivity</span>
          <span style={{ fontSize: 10, color: 'var(--tx3)' }}>{summary?.total_analysed} products</span>
        </div>
        {onAsk && (
          <button
            onClick={() => onAsk('Analyse my product price sensitivity. Which products can I safely increase prices on?')}
            style={{ fontSize: 10, color: '#6366F1', background: 'rgba(99,102,241,.08)', border: 'none', borderRadius: 6, padding: '3px 7px', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}
          >Ask AI</button>
        )}
      </div>

      {/* Insights */}
      {insights.length > 0 && (
        <div style={{ padding: '10px 12px', borderRadius: 10, background: 'rgba(249,115,22,.04)', border: '1px solid rgba(249,115,22,.12)', marginBottom: 12 }}>
          {insights.map((ins, i) => (
            <div key={i} style={{ fontSize: 11, color: 'var(--tx2)', lineHeight: 1.5, marginBottom: i < insights.length - 1 ? 4 : 0 }}>
              {ins}
            </div>
          ))}
        </div>
      )}

      {/* Filter chips */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 10, flexWrap: 'wrap' }}>
        {Object.entries(SENSITIVITY_CONFIG).map(([key, cfg]) => {
          const count = products.filter(p => p.sensitivity === key).length
          if (count === 0) return null
          const isActive = filter === key
          return (
            <button
              key={key}
              onClick={() => setFilter(isActive ? null : key)}
              style={{
                fontSize: 10, padding: '3px 8px', borderRadius: 6,
                background: isActive ? cfg.color + '15' : 'var(--ev, #f3f2ef)',
                border: `1px solid ${isActive ? cfg.color + '30' : 'transparent'}`,
                color: isActive ? cfg.color : 'var(--tx3)',
                cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit',
              }}
            >{cfg.icon} {cfg.label} ({count})</button>
          )
        })}
      </div>

      {/* P&L Impact Simulator */}
      {products.length > 0 && (
        <PriceImpactSimulator products={products} sym={sym} />
      )}

      {/* Product list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {filtered.slice(0, 12).map(p => {
          const cfg = SENSITIVITY_CONFIG[p.sensitivity] || SENSITIVITY_CONFIG.stable
          // Margin-based price suggestion
          const targetMargin = 40
          const suggestedPrice = p.margin_pct < targetMargin && p.sensitivity !== 'elastic'
            ? p.current_price * (1 + (targetMargin - p.margin_pct) / 100)
            : null
          return (
            <div key={p.sku} style={{
              padding: '8px 10px', borderRadius: 10,
              border: '1px solid var(--b)', background: p.opportunity ? 'rgba(99,102,241,.02)' : 'transparent',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 12 }}>{cfg.icon}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx)' }}>{p.name}</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)' }}>{sym}{p.current_price.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', gap: 12, fontSize: 10, color: 'var(--tx3)', marginBottom: p.opportunity || suggestedPrice ? 4 : 0 }}>
                <span>
                  Price {p.price_change_pct > 0 ? '↑' : p.price_change_pct < 0 ? '↓' : '→'}
                  <span style={{ color: p.price_change_pct > 0 ? '#EF4444' : p.price_change_pct < 0 ? '#10B981' : 'var(--tx3)' }}>
                    {' '}{Math.abs(p.price_change_pct)}%
                  </span>
                </span>
                <span>
                  Volume {p.volume_change_pct > 0 ? '↑' : p.volume_change_pct < 0 ? '↓' : '→'}
                  <span style={{ color: p.volume_change_pct > 0 ? '#10B981' : p.volume_change_pct < 0 ? '#EF4444' : 'var(--tx3)' }}>
                    {' '}{Math.abs(p.volume_change_pct)}%
                  </span>
                </span>
                <span>Margin: <span style={{ fontWeight: 600, color: p.margin_pct >= 40 ? '#10B981' : p.margin_pct >= 20 ? '#F59E0B' : '#EF4444' }}>{p.margin_pct}%</span></span>
              </div>
              {suggestedPrice && (
                <div style={{ fontSize: 10, color: '#10B981', fontWeight: 600, paddingLeft: 18, marginBottom: p.opportunity ? 2 : 0 }}>
                  💰 Suggested price for {targetMargin}% margin: {sym}{suggestedPrice.toFixed(2)} (+{((suggestedPrice - p.current_price) / p.current_price * 100).toFixed(1)}%)
                </div>
              )}
              {p.opportunity && (
                <div style={{ fontSize: 10, color: '#6366F1', fontWeight: 600, paddingLeft: 18 }}>
                  💡 {p.opportunity}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function PriceImpactSimulator({ products, sym }: { products: Product[]; sym: string }) {
  const [pctChange, setPctChange] = useState(5)

  const impact = useMemo(() => {
    const totalRevenue = products.reduce((s, p) => s + p.monthly_revenue, 0)
    let newRevenue = 0
    let opportunities = 0

    products.forEach(p => {
      const priceMultiplier = 1 + pctChange / 100
      // Estimate volume impact based on elasticity
      const volumeMultiplier = 1 - (p.elasticity * (pctChange / 100))
      const newRev = p.monthly_revenue * priceMultiplier * Math.max(volumeMultiplier, 0.3)
      newRevenue += newRev
      if (newRev > p.monthly_revenue) opportunities++
    })

    const revDelta = newRevenue - totalRevenue
    const pctDelta = totalRevenue > 0 ? (revDelta / totalRevenue) * 100 : 0

    return { totalRevenue, newRevenue, revDelta, pctDelta, opportunities }
  }, [products, pctChange])

  const fmtN = (n: number) => {
    const abs = Math.abs(n)
    if (abs >= 1_000_000) return `${n < 0 ? '-' : ''}${sym}${(abs / 1_000_000).toFixed(1)}M`
    if (abs >= 1_000) return `${n < 0 ? '-' : ''}${sym}${(abs / 1_000).toFixed(1)}K`
    return `${n < 0 ? '-' : ''}${sym}${Math.round(abs)}`
  }

  return (
    <div style={{ padding: 12, borderRadius: 10, border: '1px solid var(--b)', background: 'var(--ev, #f9f9f8)', marginBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx)' }}>P&L Impact Simulator</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: impact.revDelta >= 0 ? '#10B981' : '#EF4444', fontVariantNumeric: 'tabular-nums' }}>
          {impact.revDelta >= 0 ? '+' : ''}{fmtN(impact.revDelta)}/mo
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <span style={{ fontSize: 10, color: 'var(--tx3)', flexShrink: 0 }}>Price change:</span>
        <input type="range" min={-20} max={20} step={1} value={pctChange}
          onChange={e => setPctChange(Number(e.target.value))}
          style={{ flex: 1, accentColor: '#6366F1' }}
        />
        <span style={{ fontSize: 12, fontWeight: 700, color: pctChange >= 0 ? '#10B981' : '#EF4444', minWidth: 40, textAlign: 'right' }}>
          {pctChange > 0 ? '+' : ''}{pctChange}%
        </span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center', fontSize: 10 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--tx)', fontVariantNumeric: 'tabular-nums' }}>{fmtN(impact.totalRevenue)}</div>
          <div style={{ color: 'var(--tx3)' }}>Current</div>
        </div>
        <div style={{ fontSize: 16, color: 'var(--tx3)', alignSelf: 'center' }}>→</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 13, color: impact.revDelta >= 0 ? '#10B981' : '#EF4444', fontVariantNumeric: 'tabular-nums' }}>{fmtN(impact.newRevenue)}</div>
          <div style={{ color: 'var(--tx3)' }}>Projected</div>
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 13, color: impact.revDelta >= 0 ? '#10B981' : '#EF4444', fontVariantNumeric: 'tabular-nums' }}>{impact.pctDelta >= 0 ? '+' : ''}{impact.pctDelta.toFixed(1)}%</div>
          <div style={{ color: 'var(--tx3)' }}>Change</div>
        </div>
      </div>
    </div>
  )
}
