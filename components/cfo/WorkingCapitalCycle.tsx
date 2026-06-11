'use client'
import { getRegionConfig } from '@/lib/region-config'

interface Props {
  revenue: number
  cogs: number
  inventoryValue: number
  receivablesTotal: number
  payablesTotal: number
  currencySymbol: string
  countryCode?: string | null
  onAsk?: (prompt: string) => void
}

function fmt(n: number, sym: string): string {
  if (Math.abs(n) >= 1_000_000) return `${sym}${(n / 1_000_000).toFixed(1)}M`
  if (Math.abs(n) >= 1_000) return `${sym}${(n / 1_000).toFixed(0)}K`
  return `${sym}${Math.round(n).toLocaleString()}`
}

export default function WorkingCapitalCycle({ revenue, cogs, inventoryValue, receivablesTotal, payablesTotal, currencySymbol: sym, countryCode, onAsk }: Props) {
  const region = getRegionConfig(countryCode)
  const dailyRevenue = revenue / 30
  const dailyCogs = cogs / 30

  const dio = dailyCogs > 0 ? Math.round(inventoryValue / dailyCogs) : 0
  const dso = dailyRevenue > 0 ? Math.round(receivablesTotal / dailyRevenue) : 0
  const dpo = dailyCogs > 0 ? Math.round(payablesTotal / dailyCogs) : 0
  const ccc = dio + dso - dpo

  const maxDays = Math.max(dio + dso, dpo, 60)
  const barScale = (d: number) => d === 0 ? 0 : Math.max((d / maxDays) * 100, 4)

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
            onClick={() => onAsk(`My working capital cycle: DIO ${dio} days, DSO ${dso} days, DPO ${dpo} days. Cash Conversion Cycle = ${ccc} days. Inventory value ${fmt(inventoryValue, sym)}, receivables ${fmt(receivablesTotal, sym)}, payables ${fmt(payablesTotal, sym)}. How can I shorten my cash conversion cycle as a ${region.smbLabel}?`)}
            style={{ fontSize: 10, color: '#6366F1', background: 'rgba(99,102,241,.08)', border: 'none', borderRadius: 6, padding: '3px 8px', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}
          >
            Ask AI
          </button>
        )}
      </div>

      {/* CCC Hero */}
      <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--b)', background: ccc <= 0 ? 'rgba(34,197,94,.03)' : ccc <= 30 ? 'rgba(245,158,11,.03)' : 'rgba(239,68,68,.03)' }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx2)', marginBottom: 6 }}>
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
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx2)', marginBottom: 12 }}>
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

      {/* Quantified Action Suggestions */}
      <div style={{ padding: '14px 18px' }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx2)', marginBottom: 8 }}>Actionable Improvements</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {dio > 15 && (() => {
            const targetDio = Math.max(dio - 10, 10)
            const cashFreed = dailyCogs * (dio - targetDio)
            return (
              <ActionCard
                color="#F97316"
                title={`Reduce DIO from ${dio}d → ${targetDio}d`}
                impact={`Frees up ${fmt(cashFreed, sym)} in working capital`}
                actions={[
                  'Run clearance on slow-moving stock (items > 60 days)',
                  'Reduce reorder quantities for bottom 20% products',
                  `Move to just-in-time for fast-moving items`,
                ]}
              />
            )
          })()}
          {dso > 7 && (() => {
            const targetDso = Math.max(dso - 7, 3)
            const cashFreed = dailyRevenue * (dso - targetDso)
            return (
              <ActionCard
                color="#6366F1"
                title={`Reduce DSO from ${dso}d → ${targetDso}d`}
                impact={`Accelerates ${fmt(cashFreed, sym)} in collections`}
                actions={[
                  `Offer ${region.paymentMethods} for faster settlement`,
                  'Send payment reminders at day 3, 7, and 14',
                  `Offer 2% early-payment discount (saves ${fmt(receivablesTotal * 0.02, sym)} but accelerates cash)`,
                ]}
              />
            )
          })()}
          {dpo < 30 && (() => {
            const targetDpo = 30
            const cashGained = dailyCogs * (targetDpo - dpo)
            return (
              <ActionCard
                color="#22C55E"
                title={`Extend DPO from ${dpo}d → ${targetDpo}d`}
                impact={`Retains ${fmt(cashGained, sym)} longer in your account`}
                actions={[
                  'Negotiate net-30 terms with top 3 suppliers',
                  'Consolidate orders for volume-based term extensions',
                  'Use scheduled payments instead of immediate settlement',
                ]}
              />
            )
          })()}
          {ccc <= 0 && (
            <ActionCard
              color="#22C55E"
              title="Cash cycle is negative — excellent position"
              impact="You collect cash before paying suppliers"
              actions={[
                'Maintain supplier relationships to keep these terms',
                'Consider offering early-pay discounts to suppliers for additional savings',
                'Reinvest the float into growth or interest-bearing instruments',
              ]}
            />
          )}
          {ccc > 0 && (() => {
            const totalCashTiedUp = dailyRevenue * ccc
            return (
              <div style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(99,102,241,.15)', background: 'rgba(99,102,241,.04)', marginTop: 4 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx)' }}>Total cash tied up in cycle</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#6366F1', fontVariantNumeric: 'tabular-nums' }}>{fmt(totalCashTiedUp, sym)}</span>
                </div>
                <div style={{ fontSize: 10, color: 'var(--tx3)', marginTop: 2 }}>
                  Reducing CCC by 10 days frees up ~{fmt(dailyRevenue * 10, sym)} in working capital
                </div>
              </div>
            )
          })()}
        </div>
      </div>
    </div>
  )
}

function ActionCard({ color, title, impact, actions }: { color: string; title: string; impact: string; actions: string[] }) {
  return (
    <div style={{ padding: '10px 12px', borderRadius: 8, border: `1px solid ${color}25`, background: `${color}06` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx)' }}>{title}</span>
      </div>
      <div style={{ fontSize: 11, fontWeight: 600, color, marginBottom: 6 }}>{impact}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {actions.map((a, i) => (
          <div key={i} style={{ display: 'flex', gap: 6, fontSize: 10, color: 'var(--tx2)', lineHeight: 1.4 }}>
            <span style={{ color: 'var(--tx3)', flexShrink: 0 }}>{i + 1}.</span>
            <span>{a}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
