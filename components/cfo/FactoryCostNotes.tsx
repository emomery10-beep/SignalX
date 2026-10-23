'use client'

// Plain-language notes under the segment switcher + a compact view of how
// factory cost of goods was worked out, so the number can be checked by hand.

export interface FactoryCostInfo {
  location_id: string
  name: string
  rawKgFed: number
  rawCostPerKg: number
  material: number
  workingDays: number
  electricity: number
  labour: number
  overhead: number
  byproductCredit: number
  pool: number
  cansProduced: number
  unitCost: number
  complete: boolean
  missing: string[]
  sources?: { labour: string; electricity: string; overhead: string }
  /** Cost per unit of each finished product (lower-cased name) when shared cost was split by sales value. */
  perProduct?: Record<string, number>
  /** Present when cost per can was worked out over the factory's cost cycle. */
  cycle?: { from: string; to: string; days: number; chargedDays: number; basis: 'cycle' | 'all_time'; cakeCredit: number; cakeKg: number; cakePricePerKg: number }
}

export interface SegmentInfo {
  key: 'all' | 'retail' | 'factory'
  expenses_allocated: boolean
  unpriced_dispatches: number
  factory_stock_value: number
  factory_wastage_value?: number
  factory_money?: { ar: number; ap: number; ar_overdue: number; ap_overdue: number; collected_in_period: number; paid_out_in_period: number; top_debtors: { name: string; outstanding: number; days_overdue: number }[] } | null
  factory_costs: FactoryCostInfo[]
}

const MISSING_TEXT: Record<string, string> = {
  labour_electricity_rates: 'labour and electricity rates are not set (Factory → Costing → Your cost rates)',
  raw_material_price: 'no priced raw-material delivery yet',
  finished_goods_output: 'no finished cans produced yet',
}

// 'actual' = real tagged expenses, 'mixed' = real for some months and estimated for the rest.
const srcNote = (s?: string) => s === 'actual' ? ', actual spend' : s === 'mixed' ? ', part actual spend' : ', estimate'

const fmtDay = (d: string) => new Date(d + 'T00:00:00Z').toLocaleDateString(undefined, { day: 'numeric', month: 'short', timeZone: 'UTC' })

export function FactoryCostNotes({ info, sym }: { info: SegmentInfo | undefined; sym: string }) {
  if (!info) return null
  const fmt = (n: number) => `${sym}${Math.round(n).toLocaleString()}`
  const notes: string[] = []
  if (info.key !== 'all') notes.push('Shown before shared expenses (rent, payroll, utilities and other overheads are not split between retail and factory).')
  if (info.unpriced_dispatches > 0) notes.push(`${info.unpriced_dispatches} factory dispatch${info.unpriced_dispatches === 1 ? '' : 'es'} in this period still need a price from an approver, so they are not in revenue yet.`)
  for (const f of info.factory_costs) {
    if (!f.complete) notes.push(`${f.name}: cost is understated — ${f.missing.map(m => MISSING_TEXT[m] || m).join('; ')}.`)
  }
  const fm = info.key !== 'retail' ? info.factory_money : null
  if (fm && (fm.ar > 0 || fm.ap > 0)) {
    notes.push(`Customers owe the factory ${fmt(fm.ar)}${fm.ar_overdue > 0 ? ` (${fmt(fm.ar_overdue)} overdue)` : ''}; the factory owes suppliers ${fmt(fm.ap)}${fm.ap_overdue > 0 ? ` (${fmt(fm.ap_overdue)} overdue)` : ''}. Both are in the Receivables and Payables totals. If you also typed these debts into the Receivables tracker, they are counted twice.`)
    if (fm.top_debtors.length > 0) notes.push(`Biggest debts: ${fm.top_debtors.map(d => `${d.name} ${fmt(d.outstanding)}${d.days_overdue > 0 ? ` (${d.days_overdue} days late)` : ''}`).join(', ')}.`)
  }
  if (fm && (fm.collected_in_period > 0 || fm.paid_out_in_period > 0)) notes.push(`Cash moved in this period: ${fmt(fm.collected_in_period)} collected from customers, ${fmt(fm.paid_out_in_period)} paid to suppliers.`)
  if (info.key !== 'retail' && (info.factory_wastage_value || 0) > 0) notes.push(`${fmt(info.factory_wastage_value || 0)} of finished goods and raw material was written off as wastage this period, valued at cost.`)
  const costed = info.key !== 'retail' ? info.factory_costs.filter(f => f.cansProduced > 0 && f.rawKgFed > 0) : []
  if (notes.length === 0 && costed.length === 0) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {notes.length > 0 && (
        <div role="status" style={{ padding: '10px 12px', borderRadius: 10, border: '1px solid var(--b)', background: 'var(--sf)', fontSize: 12, color: 'var(--tx2)', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {notes.map((n, i) => <div key={i}>{n}</div>)}
        </div>
      )}
      {costed.map(f => (
        <div key={f.location_id} style={{ padding: 14, borderRadius: 12, border: '1px solid var(--b)', background: 'var(--sf)' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--tx)', marginBottom: f.cycle ? 2 : 10 }}>{f.name}: how cost per can is worked out</div>
          {f.cycle && (
            <div style={{ fontSize: 11, color: 'var(--tx3)', marginBottom: 10 }}>
              {f.cycle.basis === 'all_time' ? 'Nothing was finished in the cost cycle, so all production so far is used' : `Cost cycle: ${fmtDay(f.cycle.from)} – ${fmtDay(f.cycle.to)} (${f.cycle.days} days)`}
              {' · '}change it under Factory → Costing → Your cost rates
            </div>
          )}
          <table style={{ display: 'table', width: '100%', borderCollapse: 'collapse', fontSize: 12, color: 'var(--tx2)' }}>
            <tbody>
              {([
                [`Raw material (${Math.round(f.rawKgFed).toLocaleString()} kg × ${fmt(f.rawCostPerKg)})`, fmt(f.material)],
                [`Electricity (${f.workingDays} ${f.cycle ? 'days' : 'working days'}${srcNote(f.sources?.electricity)})`, fmt(f.electricity)],
                [`Labour (${f.workingDays} ${f.cycle ? 'days' : 'working days'}${srcNote(f.sources?.labour)})`, fmt(f.labour)],
                ...(f.overhead > 0 ? [[`Overhead (${f.workingDays} ${f.cycle ? 'days' : 'working days'}${srcNote(f.sources?.overhead)})`, fmt(f.overhead)]] : []),
                ['Production cost pool', fmt(f.pool)],
                [`Cans produced`, f.cansProduced.toLocaleString()],
              ] as string[][]).map(([l, v]) => (
                <tr key={l}>
                  <td style={{ padding: '4px 0' }}>{l}</td>
                  <td style={{ padding: '4px 0', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{v}</td>
                </tr>
              ))}
              <tr>
                <td style={{ padding: '8px 0 0', fontWeight: 700, color: 'var(--tx)', borderTop: '1px solid var(--b)' }}>Cost per can</td>
                <td style={{ padding: '8px 0 0', textAlign: 'right', fontWeight: 700, color: 'var(--tx)', borderTop: '1px solid var(--b)', fontVariantNumeric: 'tabular-nums' }}>{fmt(f.unitCost)}</td>
              </tr>
            </tbody>
          </table>
          {f.perProduct && Object.keys(f.perProduct).length > 1 && (
            <div style={{ fontSize: 11, color: 'var(--tx3)', marginTop: 8 }}>
              This factory makes several products, so the shared cost is split by sales value rather than evenly:{' '}
              {Object.entries(f.perProduct).map(([n, c]) => `${n} ${fmt(c)} each`).join(' · ')}.
            </div>
          )}
          {f.byproductCredit > 0 && (
            <div style={{ fontSize: 11, color: 'var(--tx3)', marginTop: 8 }}>
              Waste and cake sales to date ({fmt(f.byproductCredit)}) are counted as revenue, so they already lift profit. They are not taken off the cost per can a second time.
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
