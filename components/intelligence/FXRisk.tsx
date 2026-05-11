'use client'
import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

// ── Design tokens ─────────────────────────────────────────────────────────────
const ACC  = '#d08a59'
const TX   = '#1a1916'
const TX2  = '#6b6760'
const TX3  = '#a39e97'
const B    = 'rgba(0,0,0,.08)'
const B2   = 'rgba(0,0,0,.14)'
const SF   = '#ffffff'
const EV   = '#f3f2ef'

// ── Currency pairs ────────────────────────────────────────────────────────────
const CURRENCIES = [
  { code: 'USD', label: 'US Dollar', flag: '🇺🇸', symbol: '$' },
  { code: 'EUR', label: 'Euro',      flag: '🇪🇺', symbol: '€' },
  { code: 'CNY', label: 'Chinese Yuan', flag: '🇨🇳', symbol: '¥' },
  { code: 'INR', label: 'Indian Rupee', flag: '🇮🇳', symbol: '₹' },
  { code: 'TRY', label: 'Turkish Lira', flag: '🇹🇷', symbol: '₺' },
  { code: 'NGN', label: 'Nigerian Naira', flag: '🇳🇬', symbol: '₦' },
  { code: 'AED', label: 'UAE Dirham',  flag: '🇦🇪', symbol: 'د.إ' },
  { code: 'JPY', label: 'Japanese Yen', flag: '🇯🇵', symbol: '¥' },
]

const SCENARIOS = [
  { pct: 5,  label: 'Mild',     colour: '#d97706', bg: 'rgba(245,158,11,.06)',  border: 'rgba(245,158,11,.2)' },
  { pct: 10, label: 'Moderate', colour: '#dc2626', bg: 'rgba(239,68,68,.06)',   border: 'rgba(239,68,68,.2)' },
  { pct: 15, label: 'Severe',   colour: '#7f1d1d', bg: 'rgba(127,29,29,.06)',   border: 'rgba(127,29,29,.2)' },
]

interface ProductLine {
  id:     string
  name:   string
  margin: string   // percentage string e.g. "32"
  spend:  string   // monthly import spend in GBP
}

interface ScenarioResult {
  pct:            number
  label:          string
  colour:         string
  bg:             string
  border:         string
  costIncrease:   number   // additional monthly cost
  annualImpact:   number   // annual financial impact
  lines: Array<{
    name:           string
    originalMargin: number
    newMargin:      number
    monthlyImpact:  number
    belowMin:       boolean
  }>
}

function formatGBP(n: number): string {
  if (Math.abs(n) >= 1000) return '£' + (n / 1000).toFixed(1) + 'k'
  return '£' + Math.abs(n).toFixed(0)
}

function calcScenarios(
  lines: ProductLine[],
  totalSpend: number,
  minMargin: number,
): ScenarioResult[] {
  return SCENARIOS.map(s => {
    const costIncreaseFactor = s.pct / 100

    const lineResults = lines
      .filter(l => l.name.trim() && parseFloat(l.spend) > 0)
      .map(l => {
        const originalMargin = parseFloat(l.margin) || 0
        const lineSpend      = parseFloat(l.spend) || 0
        // Cost increase as a % of revenue ≈ cost increase × (1 - margin)
        // If margin is 30% and costs rise 10%, COGS rises by 10% of COGS (70% of revenue)
        // So margin impact = costIncreaseFactor × (1 - originalMargin/100) × 100
        const marginImpact   = costIncreaseFactor * (1 - originalMargin / 100) * 100
        const newMargin      = originalMargin - marginImpact
        const monthlyImpact  = lineSpend * costIncreaseFactor * (1 - originalMargin / 100)
        return {
          name:           l.name,
          originalMargin,
          newMargin,
          monthlyImpact,
          belowMin:       newMargin < minMargin,
        }
      })

    const costIncrease = totalSpend * costIncreaseFactor
    const annualImpact = lineResults.reduce((sum, l) => sum + l.monthlyImpact, 0) * 12

    return { ...s, costIncrease, annualImpact, lines: lineResults }
  })
}

export default function FXRisk({ onAsk }: { onAsk: (prompt: string) => void }) {
  const router = useRouter()

  // ── Inputs ──────────────────────────────────────────────────────────────────
  const [importCurrency, setImportCurrency] = useState('USD')
  const [totalMonthlySpend, setTotalMonthlySpend] = useState('')
  const [minMargin, setMinMargin] = useState('20')
  const [lines, setLines] = useState<ProductLine[]>([
    { id: '1', name: '', margin: '', spend: '' },
    { id: '2', name: '', margin: '', spend: '' },
  ])
  const [results, setResults] = useState<ScenarioResult[] | null>(null)
  const [calculated, setCalculated] = useState(false)

  const selectedCurrency = CURRENCIES.find(c => c.code === importCurrency) || CURRENCIES[0]

  const addLine = () => {
    setLines(l => [...l, { id: Date.now().toString(), name: '', margin: '', spend: '' }])
  }

  const updateLine = (id: string, field: keyof ProductLine, value: string) => {
    setLines(l => l.map(line => line.id === id ? { ...line, [field]: value } : line))
    setCalculated(false)
  }

  const removeLine = (id: string) => {
    setLines(l => l.filter(line => line.id !== id))
    setCalculated(false)
  }

  const calculate = useCallback(() => {
    const spend = parseFloat(totalMonthlySpend) || 0
    const min   = parseFloat(minMargin) || 0
    if (spend <= 0) return
    const res = calcScenarios(lines, spend, min)
    setResults(res)
    setCalculated(true)
  }, [lines, totalMonthlySpend, minMargin])

  const askDeep = useCallback(() => {
    const validLines = lines.filter(l => l.name.trim() && parseFloat(l.spend) > 0)
    const linesSummary = validLines.map(l => `${l.name} (${l.margin}% margin, £${l.spend}/mo spend)`).join(', ')
    const prompt = `Model the currency risk for my business. I import in ${importCurrency} and spend £${totalMonthlySpend} per month. My minimum acceptable margin is ${minMargin}%. Product lines: ${linesSummary || 'not specified'}. If sterling falls 10% against the ${importCurrency}, which product lines go below my minimum margin and what is the annual financial impact?`
    onAsk(prompt)
  }, [lines, importCurrency, totalMonthlySpend, minMargin, onAsk])

  const inp: React.CSSProperties = {
    padding: '8px 11px',
    fontSize: 13,
    background: EV,
    border: `1px solid ${B2}`,
    borderRadius: 9,
    color: TX,
    outline: 'none',
    fontFamily: 'inherit',
    width: '100%',
    boxSizing: 'border-box',
  }

  const worstCase = results?.[2]
  const atRiskLines = worstCase?.lines.filter(l => l.belowMin) || []

  return (
    <div style={{ maxWidth: 720 }}>

      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: 'var(--font-sora)', fontSize: 16, fontWeight: 700, color: TX, marginBottom: 4 }}>
          FX Risk Modeller
        </div>
        <div style={{ fontSize: 13, color: TX2, lineHeight: 1.6 }}>
          Model the impact of sterling depreciation on your import costs and product margins. Find out which lines go below your minimum margin — before the currency moves.
        </div>
      </div>

      {/* Inputs */}
      <div style={{ background: SF, border: `1px solid ${B}`, borderRadius: 16, padding: '18px 20px', marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: TX3, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 14 }}>
          Your import exposure
        </div>

        {/* Currency + total spend */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 12, color: TX3, marginBottom: 5, fontWeight: 500 }}>Import currency</div>
            <select
              value={importCurrency}
              onChange={e => { setImportCurrency(e.target.value); setCalculated(false) }}
              style={{ ...inp, cursor: 'pointer' }}
            >
              {CURRENCIES.map(c => (
                <option key={c.code} value={c.code}>{c.flag} {c.code} — {c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <div style={{ fontSize: 12, color: TX3, marginBottom: 5, fontWeight: 500 }}>Monthly import spend (£)</div>
            <input
              style={inp}
              type="number"
              value={totalMonthlySpend}
              onChange={e => { setTotalMonthlySpend(e.target.value); setCalculated(false) }}
              placeholder="e.g. 15000"
            />
          </div>
          <div>
            <div style={{ fontSize: 12, color: TX3, marginBottom: 5, fontWeight: 500 }}>Min acceptable margin (%)</div>
            <input
              style={inp}
              type="number"
              value={minMargin}
              onChange={e => { setMinMargin(e.target.value); setCalculated(false) }}
              placeholder="e.g. 20"
            />
          </div>
        </div>

        {/* Product lines */}
        <div style={{ fontSize: 12, color: TX3, marginBottom: 8, fontWeight: 500 }}>
          Product lines — add each line separately for a breakdown
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
          {lines.map((line, i) => (
            <div key={line.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 8, alignItems: 'center' }}>
              <input
                style={inp}
                value={line.name}
                onChange={e => updateLine(line.id, 'name', e.target.value)}
                placeholder={`Product line ${i + 1}`}
              />
              <div style={{ position: 'relative' }}>
                <input
                  style={{ ...inp, paddingRight: 28 }}
                  type="number"
                  value={line.margin}
                  onChange={e => updateLine(line.id, 'margin', e.target.value)}
                  placeholder="Margin %"
                />
                <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 11, color: TX3 }}>%</span>
              </div>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 11, color: TX3 }}>£</span>
                <input
                  style={{ ...inp, paddingLeft: 22 }}
                  type="number"
                  value={line.spend}
                  onChange={e => updateLine(line.id, 'spend', e.target.value)}
                  placeholder="Monthly spend"
                />
              </div>
              {lines.length > 1 ? (
                <button
                  onClick={() => removeLine(line.id)}
                  style={{ width: 28, height: 28, borderRadius: 7, border: `1px solid ${B}`, background: 'transparent', color: TX3, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              ) : <div style={{ width: 28 }}/>}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            onClick={addLine}
            style={{ fontSize: 12, color: TX2, background: 'transparent', border: `1px dashed ${B2}`, borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            + Add product line
          </button>
          <div style={{ flex: 1 }}/>
          <button
            onClick={calculate}
            disabled={!totalMonthlySpend || parseFloat(totalMonthlySpend) <= 0}
            style={{ padding: '9px 22px', background: ACC, color: '#fff', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: !totalMonthlySpend ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: !totalMonthlySpend ? .6 : 1, boxShadow: '0 2px 8px rgba(208,138,89,.25)', transition: 'opacity 150ms' }}
          >
            Model scenarios →
          </button>
        </div>
      </div>

      {/* Results */}
      {calculated && results && (
        <>
          {/* Risk summary banner */}
          {atRiskLines.length > 0 ? (
            <div style={{ background: 'rgba(239,68,68,.06)', border: '1px solid rgba(239,68,68,.2)', borderRadius: 12, padding: '13px 16px', marginBottom: 16, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#dc2626', marginTop: 4, flexShrink: 0 }}/>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#dc2626', marginBottom: 3 }}>
                  {atRiskLines.length} product line{atRiskLines.length > 1 ? 's' : ''} fall below your {minMargin}% minimum in a severe scenario
                </div>
                <div style={{ fontSize: 12, color: TX2, lineHeight: 1.5 }}>
                  {atRiskLines.map(l => l.name).join(', ')} — annual impact up to {formatGBP(worstCase?.annualImpact || 0)} if sterling falls 15% against the {importCurrency}.
                </div>
              </div>
            </div>
          ) : (
            <div style={{ background: 'rgba(34,197,94,.06)', border: '1px solid rgba(34,197,94,.2)', borderRadius: 12, padding: '13px 16px', marginBottom: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
              <span style={{ fontSize: 20 }}>✅</span>
              <div style={{ fontSize: 13, color: '#16a34a', fontWeight: 600 }}>
                All product lines stay above {minMargin}% margin even in a severe 15% depreciation scenario.
              </div>
            </div>
          )}

          {/* Three scenario cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
            {results.map((s, i) => (
              <div key={i} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 14, padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: s.colour, background: 'rgba(255,255,255,.5)', padding: '2px 8px', borderRadius: 9999, textTransform: 'uppercase', letterSpacing: '.06em' }}>
                    {s.label}
                  </span>
                  <span style={{ fontSize: 11, color: TX3 }}>−{s.pct}% GBP</span>
                </div>
                <div style={{ fontFamily: 'var(--font-sora)', fontSize: 22, fontWeight: 700, color: s.colour, marginBottom: 2 }}>
                  {formatGBP(s.annualImpact)}
                </div>
                <div style={{ fontSize: 11, color: TX3, marginBottom: 10 }}>annual margin impact</div>
                <div style={{ fontSize: 11, color: TX3, marginBottom: 6 }}>+{formatGBP(s.costIncrease)}/mo extra costs</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {s.lines.map((l, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11 }}>
                      <span style={{ color: TX2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '60%' }}>{l.name || `Line ${j + 1}`}</span>
                      <span style={{ fontWeight: 600, color: l.belowMin ? '#dc2626' : '#16a34a', flexShrink: 0 }}>
                        {l.originalMargin.toFixed(0)}% → {l.newMargin.toFixed(1)}%{l.belowMin ? ' ⚠' : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* What to do */}
          <div style={{ background: SF, border: `1px solid ${B}`, borderRadius: 14, padding: '16px 18px', marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: TX3, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 12 }}>
              Recommended actions
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {[
                atRiskLines.length > 0 ? `Review pricing on ${atRiskLines.map(l => l.name).join(', ')} — a ${(atRiskLines[0]?.originalMargin - atRiskLines[0]?.newMargin || 0).toFixed(1)}pp margin loss needs a price increase or cost reduction to offset` : null,
                parseFloat(totalMonthlySpend) > 5000 ? `Consider a forward currency contract to lock in the current GBP/${importCurrency} rate on your next 3-6 months of purchases` : null,
                `Ask your suppliers about pricing in GBP or EUR to eliminate ${importCurrency} exposure entirely on new contracts`,
                `Build a 10% FX buffer into your landed cost calculations for all ${importCurrency}-denominated purchases`,
                `Set a sterling alert — if GBP/${importCurrency} falls more than 5% from today's rate, review pricing across all affected lines`,
              ].filter(Boolean).map((action, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: EV, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: ACC, flexShrink: 0, marginTop: 1 }}>
                    {i + 1}
                  </div>
                  <div style={{ fontSize: 13, color: TX2, lineHeight: 1.55 }}>{action}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Ask AskBiz deeper */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={askDeep}
              style={{ flex: 1, padding: '11px', background: ACC, color: '#fff', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 2px 8px rgba(208,138,89,.25)' }}
            >
              Ask AskBiz to model this in full →
            </button>
            <button
              onClick={() => { setCalculated(false); setResults(null) }}
              style={{ padding: '11px 16px', color: TX3, background: 'transparent', border: `1px solid ${B}`, borderRadius: 10, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              Reset
            </button>
          </div>
        </>
      )}

      {/* Empty state when not yet calculated */}
      {!calculated && !results && parseFloat(totalMonthlySpend) <= 0 && (
        <div style={{ padding: '28px 20px', textAlign: 'center', background: SF, border: `1px solid ${B}`, borderRadius: 14 }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>💱</div>
          <div style={{ fontFamily: 'var(--font-sora)', fontSize: 14, fontWeight: 600, color: TX, marginBottom: 6 }}>
            Know your FX exposure before the rate moves
          </div>
          <p style={{ fontSize: 13, color: TX3, lineHeight: 1.65, maxWidth: 400, margin: '0 auto 16px' }}>
            Enter your import currency, monthly spend, and product margins above. AskBiz will model mild, moderate, and severe depreciation scenarios and show you exactly which lines go below your minimum margin.
          </p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
            {['I import from China in USD', 'My biggest exposure is EUR suppliers', 'I buy in dollars and sell in pounds'].map((p, i) => (
              <button
                key={i}
                onClick={() => onAsk(p + ' — what is my currency risk?')}
                style={{ fontSize: 12, color: ACC, background: 'rgba(208,138,89,.08)', border: '1px solid rgba(208,138,89,.2)', borderRadius: 9999, padding: '5px 12px', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
