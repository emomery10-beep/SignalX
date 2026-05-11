'use client'
import { useState, useCallback } from 'react'

const ACC  = '#d08a59'
const TX   = '#1a1916'
const TX2  = '#6b6760'
const TX3  = '#a39e97'
const B    = 'rgba(0,0,0,.08)'
const B2   = 'rgba(0,0,0,.14)'
const SF   = '#ffffff'
const EV   = '#f3f2ef'

const DUTY_PRESETS = [
  { label: 'Select category…', rate: '' },
  { label: 'Electronics & components', rate: '0' },
  { label: 'Clothing & apparel', rate: '12' },
  { label: 'Footwear', rate: '8' },
  { label: 'Furniture & homeware', rate: '5.6' },
  { label: 'Toys & games', rate: '2.7' },
  { label: 'Food & beverage', rate: '3.5' },
  { label: 'Beauty & personal care', rate: '3.4' },
  { label: 'Machinery & equipment', rate: '1.7' },
  { label: 'Plastics & rubber goods', rate: '6.5' },
  { label: 'Metals & metal products', rate: '4' },
  { label: 'Textiles (not clothing)', rate: '8' },
  { label: 'Bags & luggage', rate: '3' },
  { label: 'Sports equipment', rate: '2.5' },
  { label: 'Custom rate', rate: 'custom' },
]

const ORIGINS = [
  { code: 'CN', label: '🇨🇳 China' },
  { code: 'IN', label: '🇮🇳 India' },
  { code: 'TR', label: '🇹🇷 Turkey' },
  { code: 'BD', label: '🇧🇩 Bangladesh' },
  { code: 'VN', label: '🇻🇳 Vietnam' },
  { code: 'PK', label: '🇵🇰 Pakistan' },
  { code: 'EU', label: '🇪🇺 European Union' },
  { code: 'US', label: '🇺🇸 United States' },
  { code: 'NG', label: '🇳🇬 Nigeria' },
  { code: 'GH', label: '🇬🇭 Ghana' },
  { code: 'OT', label: '🌍 Other' },
]

function fmt(n: number): string {
  return '£' + Math.abs(n).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function fmtPct(n: number): string {
  return n.toFixed(1) + '%'
}

interface CostLine {
  id: string; label: string; value: string; pct: boolean
}

export default function LandedCost({ onAsk }: { onAsk: (prompt: string) => void }) {
  const [origin, setOrigin] = useState('CN')
  const [quantity, setQuantity] = useState('')
  const [unitCost, setUnitCost] = useState('')
  const [sellingPrice, setSellingPrice] = useState('')
  const [dutyPreset, setDutyPreset] = useState('')
  const [customDuty, setCustomDuty] = useState('')
  const [fxMarkup, setFxMarkup] = useState('2')
  const [extras, setExtras] = useState<CostLine[]>([
    { id: '1', label: 'Sea/Air freight', value: '', pct: false },
    { id: '2', label: 'Freight insurance', value: '0.5', pct: true },
    { id: '3', label: 'Port & handling charges', value: '', pct: false },
    { id: '4', label: 'Customs broker fee', value: '', pct: false },
    { id: '5', label: 'Last-mile delivery', value: '', pct: false },
  ])
  const [result, setResult] = useState<any>(null)
  const [calculated, setCalculated] = useState(false)
  const [showVAT, setShowVAT] = useState(false)

  const dutyRate = dutyPreset === 'custom' ? (parseFloat(customDuty) || 0) : (parseFloat(dutyPreset) || 0)

  const updateExtra = (id: string, field: string, val: any) => {
    setExtras(e => e.map(x => x.id === id ? { ...x, [field]: val } : x))
    setCalculated(false)
  }

  const inp: React.CSSProperties = {
    padding: '8px 11px', fontSize: 13, background: EV,
    border: `1px solid ${B2}`, borderRadius: 9, color: TX,
    outline: 'none', fontFamily: 'inherit', width: '100%', boxSizing: 'border-box' as const,
  }

  const calculate = useCallback(() => {
    const qty  = parseFloat(quantity) || 1
    const unit = parseFloat(unitCost) || 0
    const sell = parseFloat(sellingPrice) || 0
    const fx   = parseFloat(fxMarkup) || 0

    const goodsValue      = unit * qty
    const fxAdjusted      = goodsValue * (1 + fx / 100)
    const dutyAmount      = fxAdjusted * (dutyRate / 100)
    const freightLine     = extras.find(e => e.label.toLowerCase().includes('freight') && !e.label.toLowerCase().includes('insur'))
    const freightFixed    = parseFloat(freightLine?.value || '0') || 0
    const vatBase         = fxAdjusted + freightFixed + dutyAmount
    const vatAmount       = vatBase * 0.20

    const extraTotals = extras.map(e => {
      const val = parseFloat(e.value) || 0
      return e.pct ? (goodsValue * val / 100) : val
    })

    const freightTotal  = extraTotals.filter((_, i) => extras[i].label.toLowerCase().includes('freight')).reduce((s, v) => s + v, 0)
    const handlingTotal = extraTotals.filter((_, i) => !extras[i].label.toLowerCase().includes('freight')).reduce((s, v) => s + v, 0)
    const landedTotal   = fxAdjusted + dutyAmount + freightTotal + handlingTotal
    const landedPerUnit = qty > 0 ? landedTotal / qty : 0
    const grossMargin   = sell - landedPerUnit
    const grossMarginPct = sell > 0 ? (grossMargin / sell) * 100 : 0
    const naiveMarginPct = sell > 0 ? ((sell - unit) / sell) * 100 : 0
    const marginGap     = naiveMarginPct - grossMarginPct

    const lines = [
      { label: 'Supplier cost (incl. FX buffer)', amount: fxAdjusted, pct: (fxAdjusted / landedTotal) * 100 },
      ...extras.map((e, i) => ({ label: e.label || `Cost ${i+1}`, amount: extraTotals[i], pct: (extraTotals[i] / landedTotal) * 100 })).filter(l => l.amount > 0),
      { label: `Import duty (${fmtPct(dutyRate)})`, amount: dutyAmount, pct: (dutyAmount / landedTotal) * 100 },
    ].filter(l => l.amount > 0)

    setResult({ fxAdjusted, freightTotal, dutyAmount, vatAmount, handlingTotal, landedTotal, landedPerUnit, sellingPrice: sell, grossMargin, grossMarginPct, naiveMarginPct, marginGap, breakEven: landedPerUnit, lines })
    setCalculated(true)
  }, [quantity, unitCost, sellingPrice, dutyRate, fxMarkup, extras])

  const marginColour = result ? result.grossMarginPct >= 30 ? '#16a34a' : result.grossMarginPct >= 15 ? '#d97706' : '#dc2626' : TX

  return (
    <div style={{ maxWidth: 720 }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: 'var(--font-sora)', fontSize: 16, fontWeight: 700, color: TX, marginBottom: 4 }}>Landed Cost Calculator</div>
        <div style={{ fontSize: 13, color: TX2, lineHeight: 1.6 }}>Calculate your true cost per unit including freight, duty, VAT, and FX — then see your actual margin.</div>
      </div>

      <div style={{ background: SF, border: `1px solid ${B}`, borderRadius: 16, padding: '18px 20px', marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: TX3, textTransform: 'uppercase' as const, letterSpacing: '.08em', marginBottom: 14 }}>Product details</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 12, color: TX3, marginBottom: 5 }}>Origin</div>
            <select value={origin} onChange={e => setOrigin(e.target.value)} style={{ ...inp, cursor: 'pointer' }}>
              {ORIGINS.map(o => <option key={o.code} value={o.code}>{o.label}</option>)}
            </select>
          </div>
          <div>
            <div style={{ fontSize: 12, color: TX3, marginBottom: 5 }}>Quantity</div>
            <input style={inp} type="number" value={quantity} onChange={e => { setQuantity(e.target.value); setCalculated(false) }} placeholder="e.g. 500" />
          </div>
          <div>
            <div style={{ fontSize: 12, color: TX3, marginBottom: 5 }}>Supplier price / unit (£)</div>
            <input style={inp} type="number" value={unitCost} onChange={e => { setUnitCost(e.target.value); setCalculated(false) }} placeholder="e.g. 8.50" />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <div>
            <div style={{ fontSize: 12, color: TX3, marginBottom: 5 }}>Selling price / unit (£)</div>
            <input style={inp} type="number" value={sellingPrice} onChange={e => { setSellingPrice(e.target.value); setCalculated(false) }} placeholder="e.g. 24.99" />
          </div>
          <div>
            <div style={{ fontSize: 12, color: TX3, marginBottom: 5 }}>FX buffer (%)</div>
            <input style={inp} type="number" value={fxMarkup} onChange={e => { setFxMarkup(e.target.value); setCalculated(false) }} placeholder="2" />
          </div>
          <div>
            <div style={{ fontSize: 12, color: TX3, marginBottom: 5 }}>Duty category</div>
            <select value={dutyPreset} onChange={e => { setDutyPreset(e.target.value); setCalculated(false) }} style={{ ...inp, cursor: 'pointer' }}>
              {DUTY_PRESETS.map(d => <option key={d.label} value={d.rate}>{d.label}</option>)}
            </select>
          </div>
        </div>
        {dutyPreset === 'custom' && (
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 12, color: TX3, marginBottom: 5 }}>Custom duty rate (%)</div>
            <input style={{ ...inp, maxWidth: 160 }} type="number" value={customDuty} onChange={e => { setCustomDuty(e.target.value); setCalculated(false) }} placeholder="e.g. 6.5" />
          </div>
        )}
      </div>

      <div style={{ background: SF, border: `1px solid ${B}`, borderRadius: 16, padding: '18px 20px', marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: TX3, textTransform: 'uppercase' as const, letterSpacing: '.08em', marginBottom: 14 }}>Shipping & handling</div>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8, marginBottom: 12 }}>
          {extras.map((e) => (
            <div key={e.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: 8, alignItems: 'center' }}>
              <input style={inp} value={e.label} onChange={ev => updateExtra(e.id, 'label', ev.target.value)} placeholder="Cost description" />
              <input style={{ ...inp, paddingLeft: e.pct ? 11 : 22 }} type="number" value={e.value} onChange={ev => updateExtra(e.id, 'value', ev.target.value)} placeholder={e.pct ? '%' : '£'} />
              <button onClick={() => updateExtra(e.id, 'pct', !e.pct)} style={{ fontSize: 11, fontWeight: 600, color: e.pct ? ACC : TX3, background: e.pct ? 'rgba(208,138,89,.08)' : EV, border: `1px solid ${e.pct ? 'rgba(208,138,89,.3)' : B}`, borderRadius: 7, padding: '5px 8px', cursor: 'pointer', fontFamily: 'inherit' }}>
                {e.pct ? '%' : '£'}
              </button>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={calculate} disabled={!unitCost || !quantity} style={{ padding: '9px 22px', background: ACC, color: '#fff', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: (!unitCost || !quantity) ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: (!unitCost || !quantity) ? .6 : 1 }}>
            Calculate →
          </button>
        </div>
      </div>

      {calculated && result && (
        <div style={{ background: SF, border: `1px solid ${B}`, borderRadius: 16, padding: '18px 20px', marginBottom: 12 }}>
          {result.marginGap > 3 && (
            <div style={{ background: 'rgba(239,68,68,.05)', border: '1px solid rgba(239,68,68,.2)', borderRadius: 10, padding: '12px 14px', marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#dc2626', marginBottom: 3 }}>You were over-estimating margin by {fmtPct(result.marginGap)}</div>
              <div style={{ fontSize: 12, color: TX2 }}>Naive margin: {fmtPct(result.naiveMarginPct)} → True margin: {fmtPct(result.grossMarginPct)}</div>
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 18 }}>
            <div style={{ textAlign: 'center' as const }}>
              <div style={{ fontSize: 11, color: TX3, marginBottom: 4 }}>Landed cost / unit</div>
              <div style={{ fontFamily: 'var(--font-sora)', fontSize: 26, fontWeight: 800, color: TX }}>{fmt(result.landedPerUnit)}</div>
            </div>
            <div style={{ textAlign: 'center' as const, borderLeft: `1px solid ${B}`, borderRight: `1px solid ${B}` }}>
              <div style={{ fontSize: 11, color: TX3, marginBottom: 4 }}>Actual margin</div>
              <div style={{ fontFamily: 'var(--font-sora)', fontSize: 26, fontWeight: 800, color: marginColour }}>{fmtPct(result.grossMarginPct)}</div>
            </div>
            <div style={{ textAlign: 'center' as const }}>
              <div style={{ fontSize: 11, color: TX3, marginBottom: 4 }}>Break-even price</div>
              <div style={{ fontFamily: 'var(--font-sora)', fontSize: 26, fontWeight: 800, color: TX }}>{fmt(result.breakEven)}</div>
            </div>
          </div>
          {result.lines.map((line: any, i: number) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <span style={{ fontSize: 12, color: TX2 }}>{line.label}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: TX }}>{fmt(line.amount)} · {fmtPct(line.pct)}</span>
              </div>
              <div style={{ height: 4, background: EV, borderRadius: 3 }}>
                <div style={{ height: '100%', width: `${Math.max(line.pct, 0.5)}%`, background: ACC, borderRadius: 3 }}/>
              </div>
            </div>
          ))}
          <div style={{ marginTop: 14, padding: '10px 12px', borderRadius: 9, background: 'rgba(99,102,241,.04)', border: '1px solid rgba(99,102,241,.12)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 12, color: TX2 }}><strong style={{ color: '#6366F1' }}>Import VAT:</strong> {fmt(result.vatAmount)} (recoverable if VAT registered)</div>
            <button onClick={() => setShowVAT(v => !v)} style={{ fontSize: 11, color: '#6366F1', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
              {showVAT ? 'Hide' : 'What is this?'}
            </button>
          </div>
          {showVAT && <div style={{ fontSize: 12, color: TX3, marginTop: 8, lineHeight: 1.6 }}>Import VAT is paid at the border but recoverable on your next VAT return if you are VAT registered. It is a cash flow cost — typically 30-60 days — not a permanent cost.</div>}
          <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
            <button onClick={() => onAsk(`What is my true landed cost and margin? I import from ${origin} at £${unitCost}/unit, sell at £${sellingPrice}, duty rate ${dutyRate}%.`)} style={{ flex: 1, padding: '10px', background: ACC, color: '#fff', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Ask AskBiz to analyse this →</button>
            <button onClick={() => { setCalculated(false); setResult(null) }} style={{ padding: '10px 14px', color: TX3, background: 'transparent', border: `1px solid ${B}`, borderRadius: 9, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>Reset</button>
          </div>
        </div>
      )}

      {!calculated && (
        <div style={{ padding: '24px', textAlign: 'center' as const, background: SF, border: `1px solid ${B}`, borderRadius: 14 }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>🧮</div>
          <div style={{ fontFamily: 'var(--font-sora)', fontSize: 14, fontWeight: 600, color: TX, marginBottom: 6 }}>Know your true margin before you buy</div>
          <p style={{ fontSize: 13, color: TX3, lineHeight: 1.6, maxWidth: 380, margin: '0 auto' }}>Enter your product details above. Freight, duty, and FX typically add 15-30% to your real cost per unit.</p>
        </div>
      )}
    </div>
  )
}
