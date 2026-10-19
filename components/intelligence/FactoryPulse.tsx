'use client'

// Intelligence card for factory accounts. Factories never ring pos_transactions, so the retail POS Pulse is empty for
// them — this reads the same CFO snapshot (approved captures, each factory costed on its own type) instead.

interface FactoryPulseProps {
  snapshot: any
  onAsk: (prompt: string) => void
}

const label: React.CSSProperties = { fontSize: 9, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 2 }
const big: React.CSSProperties = { fontSize: 20, fontWeight: 800, fontFamily: 'var(--font-sora, inherit)', lineHeight: 1, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis' }

export default function FactoryPulse({ snapshot, onAsk }: FactoryPulseProps) {
  const sym: string = snapshot?.currency_symbol || ''
  const fmt = (v: number) => `${sym}${Math.round(v || 0).toLocaleString('en')}`
  const t = snapshot?.totals || {}
  const seg = snapshot?.segment || {}
  const factories: { id: string; name: string; type: string | null }[] = snapshot?.factories || []
  const unpriced: number = seg.unpriced_dispatches || 0
  const stockValue: number = seg.factory_stock_value || 0
  const margin: number = t.gross_margin_pct || 0
  const costs: any[] = seg.factory_costs || []
  const incomplete = costs.filter(c => c && c.complete === false)
  const top: { name: string; revenue: number }[] = (snapshot?.margin_by_product || [])
    .filter((p: any) => p.category === 'Factory')
    .slice(0, 3)
    .map((p: any) => ({ name: p.name, revenue: p.revenue }))
  const hasRevenue = (t.revenue || 0) > 0

  return (
    <div style={{ padding: 4 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em' }}>This month</span>
        <span style={{ fontSize: 9, color: 'var(--tx3)', opacity: 0.7 }}>
          <span aria-hidden="true">🏭 </span>Factory Pulse{factories.length > 1 ? ` · ${factories.length} factories` : factories[0]?.name ? ` · ${factories[0].name}` : ''}
        </span>
      </div>

      {hasRevenue ? (
        <>
          <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={label}>Dispatch revenue</div>
              <span style={{ ...big, color: '#6366F1' }}>{fmt(t.revenue)}</span>
              <div style={{ fontSize: 10, color: 'var(--tx3)', marginTop: 2 }}>Cost {fmt(t.cogs)}</div>
            </div>
            <div style={{ width: 1, background: 'var(--b)', flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={label}>Gross profit</div>
              <span style={{ ...big, color: (t.gross_profit || 0) >= 0 ? '#22C55E' : '#EF4444' }}>{fmt(t.gross_profit)}</span>
              <div style={{ fontSize: 10, color: 'var(--tx3)', marginTop: 2 }}>{margin.toFixed(1)}% margin</div>
            </div>
          </div>
          {top.length > 0 && (
            <ul style={{ listStyle: 'none', margin: '0 0 10px', padding: 0, fontSize: 11, color: 'var(--tx2, var(--tx3))' }}>
              {top.map(p => (
                <li key={p.name} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, padding: '2px 0' }}>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</span>
                  <span style={{ fontVariantNumeric: 'tabular-nums' }}>{fmt(p.revenue)}</span>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <p style={{ fontSize: 12, color: 'var(--tx3)', lineHeight: 1.5, margin: '0 0 10px' }}>
          No priced dispatches this month yet. Production is tracked in the Factory section; revenue and profit appear here once a dispatch has been approved and priced.
        </p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 11, color: 'var(--tx3)' }}>
        <div>Stock value on hand: <strong style={{ color: 'var(--tx)' }}>{fmt(stockValue)}</strong></div>
        {unpriced > 0 && (
          <div role="status" style={{ color: '#F59E0B' }}>
            {unpriced} dispatch{unpriced === 1 ? '' : 'es'} waiting for a price — not counted in revenue yet.
          </div>
        )}
        {incomplete.length > 0 && (
          <div style={{ color: '#F59E0B' }}>Production costs are estimated — add your staff, electricity and overhead rates for exact margins.</div>
        )}
      </div>

      <button
        onClick={() => onAsk('How is my factory performing this month? Cover production, stock, wastage, dispatches and profit.')}
        style={{ marginTop: 12, minHeight: 36, padding: '0 12px', border: '1px solid var(--b)', borderRadius: 8, background: 'transparent', color: 'var(--tx)', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
      >
        Ask AskBiz about my factory
      </button>
    </div>
  )
}
