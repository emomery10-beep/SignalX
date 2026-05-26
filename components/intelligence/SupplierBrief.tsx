'use client'
import { useState, useEffect } from 'react'

interface Supplier {
  name: string; product_count: number; products: string[]
  monthly_spend: number; avg_margin: number; spend_trend_pct: number
  dependency_pct: number; currencies: string[]
}

interface Brief {
  leverage_points?: string[]; risks?: string[]
  recommended_ask?: string; talking_points?: string[]; timing?: string
  raw?: string
}

export default function SupplierBrief({ onAsk }: { onAsk?: (prompt: string) => void }) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [brief, setBrief] = useState<Brief | null>(null)
  const [briefSupplier, setBriefSupplier] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null)
  const [loadingBrief, setLoadingBrief] = useState(false)

  useEffect(() => {
    fetch('/api/supplier-brief')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        setSuppliers(data.suppliers || [])
        setBrief(data.brief || null)
        setBriefSupplier(data.brief_supplier || '')
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const loadBrief = (name: string) => {
    setSelectedSupplier(name)
    setLoadingBrief(true)
    fetch(`/api/supplier-brief?supplier=${encodeURIComponent(name)}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => { setBrief(data.brief || null); setBriefSupplier(data.brief_supplier || name) })
      .catch(() => {})
      .finally(() => setLoadingBrief(false))
  }

  if (loading) {
    return (
      <div style={{ padding: '16px 18px', borderRadius: 16, border: '1px solid var(--b)', background: 'var(--sf)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <div style={{ width: 3, height: 14, borderRadius: 2, background: '#EF4444' }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)', letterSpacing: '.02em' }}>Supplier Brief</span>
        </div>
        {[1, 2].map(i => (
          <div key={i} style={{ height: 48, borderRadius: 10, background: 'var(--ev, #f3f2ef)', animation: 'pulse 1.5s infinite', marginBottom: 8 }} />
        ))}
      </div>
    )
  }

  if (suppliers.length === 0) return null

  const fmt = (n: number) => n >= 1000 ? `£${(n / 1000).toFixed(1)}k` : `£${n}`

  return (
    <div style={{ padding: '16px 18px', borderRadius: 16, border: '1px solid var(--b)', background: 'var(--sf)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 3, height: 14, borderRadius: 2, background: '#EF4444' }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)', letterSpacing: '.02em' }}>Supplier Brief</span>
        </div>
        {onAsk && (
          <button
            onClick={() => onAsk('Analyse my supplier relationships and recommend negotiation strategies for better margins.')}
            style={{ fontSize: 10, color: '#6366F1', background: 'rgba(99,102,241,.08)', border: 'none', borderRadius: 6, padding: '3px 7px', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}
          >Ask AI</button>
        )}
      </div>

      {/* Supplier list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: brief ? 14 : 0 }}>
        {suppliers.slice(0, 6).map(s => {
          const isSelected = briefSupplier === s.name
          return (
            <button
              key={s.name}
              onClick={() => loadBrief(s.name)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 10px', borderRadius: 10,
                background: isSelected ? 'rgba(99,102,241,.06)' : 'transparent',
                border: `1px solid ${isSelected ? 'rgba(99,102,241,.15)' : 'var(--b)'}`,
                cursor: 'pointer', width: '100%', textAlign: 'left', fontFamily: 'inherit',
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx)' }}>{s.name}</div>
                <div style={{ fontSize: 10, color: 'var(--tx3)' }}>
                  {s.product_count} products • {fmt(s.monthly_spend)}/mo • {s.avg_margin}% margin
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                {s.dependency_pct > 30 && (
                  <span style={{ fontSize: 9, color: '#F59E0B', background: 'rgba(245,158,11,.1)', borderRadius: 4, padding: '1px 5px', fontWeight: 700 }}>
                    {s.dependency_pct}% dep
                  </span>
                )}
                {s.spend_trend_pct > 10 && (
                  <span style={{ fontSize: 9, color: '#EF4444', marginLeft: 4 }}>↑{s.spend_trend_pct}%</span>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Negotiation brief */}
      {loadingBrief && (
        <div style={{ padding: 12, borderRadius: 10, background: 'var(--ev, #f3f2ef)', textAlign: 'center', fontSize: 12, color: 'var(--tx3)' }}>
          Generating brief for {selectedSupplier}...
        </div>
      )}

      {brief && !loadingBrief && (
        <div style={{ padding: '12px 14px', borderRadius: 12, border: '1px solid rgba(99,102,241,.15)', background: 'rgba(99,102,241,.03)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#6366F1', marginBottom: 8 }}>
            Negotiation Brief — {briefSupplier}
          </div>

          {brief.raw ? (
            <div style={{ fontSize: 12, color: 'var(--tx2)', lineHeight: 1.5 }}>{brief.raw}</div>
          ) : (
            <>
              {brief.recommended_ask && (
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx)', marginBottom: 8, padding: '6px 8px', borderRadius: 8, background: 'rgba(16,185,129,.06)', border: '1px solid rgba(16,185,129,.15)' }}>
                  💡 {brief.recommended_ask}
                </div>
              )}

              {brief.leverage_points?.length ? (
                <div style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#10B981', marginBottom: 4 }}>LEVERAGE</div>
                  {brief.leverage_points.map((p, i) => (
                    <div key={i} style={{ fontSize: 11, color: 'var(--tx2)', lineHeight: 1.5, paddingLeft: 10 }}>• {p}</div>
                  ))}
                </div>
              ) : null}

              {brief.risks?.length ? (
                <div style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#EF4444', marginBottom: 4 }}>RISKS</div>
                  {brief.risks.map((r, i) => (
                    <div key={i} style={{ fontSize: 11, color: 'var(--tx2)', lineHeight: 1.5, paddingLeft: 10 }}>• {r}</div>
                  ))}
                </div>
              ) : null}

              {brief.talking_points?.length ? (
                <div style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#6366F1', marginBottom: 4 }}>TALKING POINTS</div>
                  {brief.talking_points.map((t, i) => (
                    <div key={i} style={{ fontSize: 11, color: 'var(--tx2)', lineHeight: 1.5, paddingLeft: 10 }}>• {t}</div>
                  ))}
                </div>
              ) : null}

              {brief.timing && (
                <div style={{ fontSize: 11, color: 'var(--tx3)', marginTop: 4 }}>⏰ {brief.timing}</div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
