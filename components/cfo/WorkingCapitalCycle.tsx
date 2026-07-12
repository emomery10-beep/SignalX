'use client'
import { getRegionConfig } from '@/lib/region-config'
import { useLang } from '@/components/LanguageProvider'

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
  const { tc } = useLang()
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
  const cccStatus = ccc <= 0 ? tc('cfo_workcap.cccStatusExcellent') :
    ccc <= 15 ? tc('cfo_workcap.cccStatusGood') :
    ccc <= 30 ? tc('cfo_workcap.cccStatusFair') :
    tc('cfo_workcap.cccStatusLong')

  return (
    <div style={{ borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--b)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 3, height: 14, borderRadius: 2, background: '#6366F1' }} />
          <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--tx)' }}>{tc('cfo_workcap.title')}</span>
        </div>
        {onAsk && ccc > 0 && (
          <button
            onClick={() => onAsk(tc('cfo_workcap.askPrompt', {
              dio,
              dso,
              dpo,
              ccc,
              inventory: fmt(inventoryValue, sym),
              receivables: fmt(receivablesTotal, sym),
              payables: fmt(payablesTotal, sym),
              smbLabel: region.smbLabel,
            }))}
            style={{ fontSize: 9, color: '#6366F1', background: 'rgba(99,102,241,.08)', border: 'none', borderRadius: 6, padding: '3px 8px', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}
          >
            {tc('cfo_workcap.askAi')}
          </button>
        )}
      </div>

      {/* CCC Hero */}
      <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--b)', background: ccc <= 0 ? 'rgba(34,197,94,.03)' : ccc <= 30 ? 'rgba(245,158,11,.03)' : 'rgba(239,68,68,.03)' }}>
        <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--tx2)', marginBottom: 6 }}>
          {tc('cfo_workcap.cccLabel')}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontSize: 26, fontWeight: 800, color: cccColor, fontFamily: 'var(--font-sora, inherit)' }}>
            {ccc}
          </span>
          <span style={{ fontSize: 12, fontWeight: 600, color: cccColor }}>{tc('cfo_workcap.days')}</span>
        </div>
        <div style={{ fontSize: 9, color: 'var(--tx3)', marginTop: 4 }}>{cccStatus}</div>
      </div>

      {/* Formula visual */}
      <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--b)' }}>
        <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--tx2)', marginBottom: 12 }}>
          {tc('cfo_workcap.formulaLabel')}
        </div>

        {/* DIO bar */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--tx)' }}>{tc('cfo_workcap.dioLabel')}</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#F97316' }}>{dio} {tc('cfo_workcap.days')}</div>
          </div>
          <div style={{ height: 24, borderRadius: 6, background: 'var(--ev, #e5e5e5)', overflow: 'hidden', position: 'relative' }}>
            <div style={{ height: '100%', width: `${barScale(dio)}%`, background: '#F97316', borderRadius: 6, display: 'flex', alignItems: 'center', paddingLeft: 8, transition: 'width 400ms' }}>
              {barScale(dio) > 25 && <span style={{ fontSize: 9, color: '#fff', fontWeight: 600 }}>{tc('cfo_workcap.inventoryInBar', { value: fmt(inventoryValue, sym) })}</span>}
            </div>
          </div>
          <div style={{ fontSize: 9, color: 'var(--tx3)', marginTop: 2 }}>{tc('cfo_workcap.dioHint')}</div>
        </div>

        {/* DSO bar */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--tx)' }}>{tc('cfo_workcap.dsoLabel')}</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#6366F1' }}>{dso} {tc('cfo_workcap.days')}</div>
          </div>
          <div style={{ height: 24, borderRadius: 6, background: 'var(--ev, #e5e5e5)', overflow: 'hidden', position: 'relative' }}>
            <div style={{ height: '100%', width: `${barScale(dso)}%`, background: '#6366F1', borderRadius: 6, display: 'flex', alignItems: 'center', paddingLeft: 8, transition: 'width 400ms' }}>
              {barScale(dso) > 25 && <span style={{ fontSize: 9, color: '#fff', fontWeight: 600 }}>{tc('cfo_workcap.receivablesInBar', { value: fmt(receivablesTotal, sym) })}</span>}
            </div>
          </div>
          <div style={{ fontSize: 9, color: 'var(--tx3)', marginTop: 2 }}>{tc('cfo_workcap.dsoHint')}</div>
        </div>

        {/* DPO bar (inverted — higher is better) */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--tx)' }}>{tc('cfo_workcap.dpoLabel')}</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#22C55E' }}>−{dpo} {tc('cfo_workcap.days')}</div>
          </div>
          <div style={{ height: 24, borderRadius: 6, background: 'var(--ev, #e5e5e5)', overflow: 'hidden', position: 'relative' }}>
            <div style={{ height: '100%', width: `${barScale(dpo)}%`, background: '#22C55E', borderRadius: 6, display: 'flex', alignItems: 'center', paddingLeft: 8, transition: 'width 400ms' }}>
              {barScale(dpo) > 25 && <span style={{ fontSize: 9, color: '#fff', fontWeight: 600 }}>{tc('cfo_workcap.payablesInBar', { value: fmt(payablesTotal, sym) })}</span>}
            </div>
          </div>
          <div style={{ fontSize: 9, color: 'var(--tx3)', marginTop: 2 }}>{tc('cfo_workcap.dpoHint')}</div>
        </div>

        {/* CCC result bar */}
        <div style={{ marginTop: 14, padding: '10px 14px', borderRadius: 8, background: ccc <= 0 ? 'rgba(34,197,94,.06)' : ccc <= 30 ? 'rgba(245,158,11,.06)' : 'rgba(239,68,68,.06)', border: `1px solid ${ccc <= 0 ? 'rgba(34,197,94,.15)' : ccc <= 30 ? 'rgba(245,158,11,.15)' : 'rgba(239,68,68,.15)'}` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--tx)' }}>
              {dio}d + {dso}d − {dpo}d = {ccc} {tc('cfo_workcap.days')}
            </span>
            <span style={{ fontSize: 9, fontWeight: 600, color: cccColor }}>
              {ccc <= 0 ? tc('cfo_workcap.cccPositive') : tc('cfo_workcap.cccTiedUp', { ccc })}
            </span>
          </div>
        </div>
      </div>

      {/* Quantified Action Suggestions */}
      <div style={{ padding: '14px 18px' }}>
        <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--tx2)', marginBottom: 8 }}>{tc('cfo_workcap.actionsTitle')}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {dio > 15 && (() => {
            const targetDio = Math.max(dio - 10, 10)
            const cashFreed = dailyCogs * (dio - targetDio)
            return (
              <ActionCard
                color="#F97316"
                title={tc('cfo_workcap.dioReduceTitle', { dio, target: targetDio })}
                impact={tc('cfo_workcap.dioReduceImpact', { amount: fmt(cashFreed, sym) })}
                actions={[
                  tc('cfo_workcap.dioAction1'),
                  tc('cfo_workcap.dioAction2'),
                  tc('cfo_workcap.dioAction3'),
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
                title={tc('cfo_workcap.dsoReduceTitle', { dso, target: targetDso })}
                impact={tc('cfo_workcap.dsoReduceImpact', { amount: fmt(cashFreed, sym) })}
                actions={[
                  tc('cfo_workcap.dsoAction1', { paymentMethods: region.paymentMethods }),
                  tc('cfo_workcap.dsoAction2'),
                  tc('cfo_workcap.dsoAction3', { discount: fmt(receivablesTotal * 0.02, sym) }),
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
                title={tc('cfo_workcap.dpoExtendTitle', { dpo, target: targetDpo })}
                impact={tc('cfo_workcap.dpoExtendImpact', { amount: fmt(cashGained, sym) })}
                actions={[
                  tc('cfo_workcap.dpoAction1'),
                  tc('cfo_workcap.dpoAction2'),
                  tc('cfo_workcap.dpoAction3'),
                ]}
              />
            )
          })()}
          {ccc <= 0 && (
            <ActionCard
              color="#22C55E"
              title={tc('cfo_workcap.negativeCycleTitle')}
              impact={tc('cfo_workcap.negativeCycleImpact')}
              actions={[
                tc('cfo_workcap.negativeCycleAction1'),
                tc('cfo_workcap.negativeCycleAction2'),
                tc('cfo_workcap.negativeCycleAction3'),
              ]}
            />
          )}
          {ccc > 0 && (() => {
            const totalCashTiedUp = dailyRevenue * ccc
            return (
              <div style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(99,102,241,.15)', background: 'rgba(99,102,241,.04)', marginTop: 4 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--tx)' }}>{tc('cfo_workcap.totalCashTiedLabel')}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#6366F1', fontVariantNumeric: 'tabular-nums' }}>{fmt(totalCashTiedUp, sym)}</span>
                </div>
                <div style={{ fontSize: 9, color: 'var(--tx3)', marginTop: 2 }}>
                  {tc('cfo_workcap.cccReductionHint', { amount: fmt(dailyRevenue * 10, sym) })}
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
        <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--tx)' }}>{title}</span>
      </div>
      <div style={{ fontSize: 9, fontWeight: 600, color, marginBottom: 6 }}>{impact}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {actions.map((a, i) => (
          <div key={i} style={{ display: 'flex', gap: 6, fontSize: 9, color: 'var(--tx2)', lineHeight: 1.4 }}>
            <span style={{ color: 'var(--tx3)', flexShrink: 0 }}>{i + 1}.</span>
            <span>{a}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
