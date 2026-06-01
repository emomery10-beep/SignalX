'use client'

interface Props {
  revenue: number
  cogs: number
  inventoryValue: number
  receivablesTotal: number
  payablesTotal: number
  currencySymbol: string
  onAsk?: (prompt: string) => void
}

function fmt(n: number, sym: string): string {
  if (Math.abs(n) >= 1_000_000) return `${sym}${(n / 1_000_000).toFixed(1)}M`
  if (Math.abs(n) >= 1_000) return `${sym}${(n / 1_000).toFixed(0)}K`
  return `${sym}${Math.round(n).toLocaleString()}`
}

export default function WorkingCapitalCycle({ revenue, cogs, inventoryValue, receivablesTotal, payablesTotal, currencySymbol: sym, onAsk }: Props) {
  const dailyRevenue = revenue / 30
  const dailyCogs = cogs / 30

  const dio = dailyCogs > 0 ? Math.round(inventoryValue / dailyCogs) : 0
  const dso = dailyRevenue > 0 ? Math.round(receivablesTotal / dailyRevenue) : 0
  const dpo = dailyCogs > 0 ? Math.round(payablesTotal / dailyCogs) : 0
  const ccc = dio + dso - dpo

  const maxDays = Math.max(dio + dso, dpo, 60)
  const barScale = (d: number) => Math.max((d / maxDays) * 100, 4)

  const cccColor = ccc <= 0 ? '#22C55E' : ccc <= 30 ? '#F59E0B' : '#EF4444'
  const cccStatus = ccc <= 0 ? 'Excellent — cash comes in before going out' :
    ccc <= 15 ? 'Good — short cash conversion cycle' :
    ccc <= 30 ? 'Fair — typical for retail SMBs' :
    'Long cycle — cash is tied up for extended periods'

  return (
    <div style={{ borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--b)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 3, height: 14, borderRadius: 2, background: '#6366F1' }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)' }}>Working Capital Cycle</span>
        </div>
        {onAsk && ccc > 0 && (
          <button
            onClick={() => onAsk(`My working capital cycle: DIO ${dio} days, DSO ${dso} days, DPO ${dpo} days. Cash Conversion Cycle = ${ccc} days. Inventory value ${fmt(inventoryValue, sym)}, receivables ${fmt(receivablesTotal, sym)}, payables ${fmt(payablesTotal, sym)}. How can I shorten my cash conversion cycle as a Kenyan SMB?`)}
            style={{ fontSize: 10, color: '#6366F1', background: 'rgba(99,102,241,.08)', border: 'none', borderRadius: 6, padding: '3px 8px', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}
          >
            Ask AI
          </button>
        )}
      </div>

      {/* CCC Hero */}
      <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--b)', background: ccc <= 0 ? 'rgba(34,197,94,.03)' : ccc <= 30 ? 'rgba(245,158,11,.03)' : 'rgba(239,68,68,.03)' }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
          Cash Conversion Cycle
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontSize: 28, fontWeight: 800, color: cccColor, fontFamily: 'var(--font-sora, inherit)' }}>
            {ccc}
          </span>
          <span style={{ fontSize: 14, fontWeight: 600, color: cccColor }}>days</span>
        </div>
        <div style={{ fontSize: 11, color: 'var(--tx3)', marginTop: 4 }}>{cccStatus}</div>
      </div>

      {/* Formula visual */}
      <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--b)' }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
          DIO + DSO − DPO = CCC
        </div>

        {/* DIO bar */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx)' }}>Days Inventory Outstanding (DIO)</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#F97316' }}>{dio} days</div>
          </div>
          <div style={{ height: 24, borderRadius: 6, background: 'var(--ev, #e5e5e5)', overflow: 'hidden', position: 'relative' }}>
            <div style={{ height: '100%', width: `${barScale(dio)}%`, background: '#F97316', borderRadius: 6, display: 'flex', alignItems: 'center', paddingLeft: 8, transition: 'width 400ms' }}>
              {barScale(dio) > 25 && <span style={{ fontSize: 9, color: '#fff', fontWeight: 600 }}>Inventory: {fmt(inventoryValue, sym)}</span>}
            </div>
          </div>
          <div style={{ fontSize: 10, color: 'var(--tx3)', marginTop: 2 }}>How long inventory sits before being sold</div>
        </div>

        {/* DSO bar */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx)' }}>Days Sales Outstanding (DSO)</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#6366F1' }}>{dso} days</div>
          </div>
          <div style={{ height: 24, borderRadius: 6, background: 'var(--ev, #e5e5e5)', overflow: 'hidden', position: 'relative' }}>
            <div style={{ height: '100%', width: `${barScale(dso)}%`, background: '#6366F1', borderRadius: 6, display: 'flex', alignItems: 'center', paddingLeft: 8, transition: 'width 400ms' }}>
              {barScale(dso) > 25 && <span style={{ fontSize: 9, color: '#fff', fontWeight: 600 }}>Receivables: {fmt(receivablesTotal, sym)}</span>}
            </div>
          </div>
          <div style={{ fontSize: 10, color: 'var(--tx3)', marginTop: 2 }}>How long customers take to pay you</div>
        </div>

        {/* DPO bar (inverted — higher is better) */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx)' }}>Days Payables Outstanding (DPO)</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#22C55E' }}>−{dpo} days</div>
          </div>
          <div style={{ height: 24, borderRadius: 6, background: 'var(--ev, #e5e5e5)', overflow: 'hidden', position: 'relative' }}>
            <div style={{ height: '100%', width: `${barScale(dpo)}%`, background: '#22C55E', borderRadius: 6, display: 'flex', alignItems: 'center', paddingLeft: 8, transition: 'width 400ms' }}>
              {barScale(dpo) > 25 && <span style={{ fontSize: 9, color: '#fff', fontWeight: 600 }}>Payables: {fmt(payablesTotal, sym)}</span>}
            </div>
          </div>
          <div style={{ fontSize: 10, color: 'var(--tx3)', marginTop: 2 }}>How long you take to pay suppliers (longer = better for cash)</div>
        </div>

        {/* CCC result bar */}
        <div style={{ marginTop: 14, padding: '10px 14px', borderRadius: 8, background: ccc <= 0 ? 'rgba(34,197,94,.06)' : ccc <= 30 ? 'rgba(245,158,11,.06)' : 'rgba(239,68,68,.06)', border: `1px solid ${ccc <= 0 ? 'rgba(34,197,94,.15)' : ccc <= 30 ? 'rgba(245,158,11,.15)' : 'rgba(239,68,68,.15)'}` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)' }}>
              {dio}d + {dso}d − {dpo}d = {ccc} days
            </span>
            <span style={{ fontSize: 11, fontWeight: 600, color: cccColor }}>
              {ccc <= 0 ? 'Cash positive cycle' : `${ccc} days cash tied up`}
            </span>
          </div>
        </div>
      </div>

      {/* Improvement tips */}
      <div style={{ padding: '14px 18px' }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>How to Improve</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {dio > 15 && (
            <TipRow
              color="#F97316"
              text={`Reduce DIO (${dio}d): Move slow stock faster with promotions, or reduce order sizes for slow-moving items.`}
            />
          )}
          {dso > 7 && (
            <TipRow
              color="#6366F1"
              text={`Reduce DSO (${dso}d): Offer M-Pesa payment at point of sale, incentivize early payment, or tighten credit terms.`}
            />
          )}
          {dpo < 30 && (
            <TipRow
              color="#22C55E"
              text={`Extend DPO (${dpo}d): Negotiate longer payment terms with suppliers — 30-45 days is standard for established relationships.`}
            />
          )}
          {ccc <= 0 && (
            <TipRow
              color="#22C55E"
              text="Your cash cycle is negative — you collect cash before paying suppliers. This is an ideal position. Maintain supplier relationships to keep these terms."
            />
          )}
        </div>
      </div>
    </div>
  )
}

function TipRow({ color, text }: { color: string; text: string }) {
  return (
    <div style={{ display: 'flex', gap: 8, fontSize: 11, color: 'var(--tx2)', lineHeight: 1.5 }}>
      <div style={{ width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0, marginTop: 5 }} />
      <span>{text}</span>
    </div>
  )
}
