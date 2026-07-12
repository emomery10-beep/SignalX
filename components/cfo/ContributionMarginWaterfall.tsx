'use client'
import { useState, useEffect } from 'react'
import { useLang } from '@/components/LanguageProvider'

interface Channel {
  source: string
  label: string
  revenue: number
  cogs: number
  gross_profit: number
  margin_pct: number
  orders: number
  pct_of_total: number
}

interface Props {
  channels: Channel[]
  currencySymbol: string
  onAsk?: (prompt: string) => void
}

// Default platform fee % by source
const PLATFORM_FEES: Record<string, number> = {
  amazon_fba: 25,   // ~15% referral + ~10% FBA
  ebay: 12.9,
  etsy: 9.5,        // 6.5% listing + 3% payment
  tiktok_shop: 8,
  jumia: 18,
  takealot: 15,
  shopify: 2.9,
  woocommerce: 2.9,
  stripe: 2.9,
  square: 2.6,
  pos: 0,
  google_sheets: 0,
  manual_csv: 0,
}

const CHANNEL_COLORS: Record<string, string> = {
  amazon_fba: '#FF9900', ebay: '#E53238', etsy: '#F1641E', shopify: '#96BF48',
  pos: '#6366F1', stripe: '#635BFF', woocommerce: '#7B2D8E', square: '#00D632',
  tiktok_shop: '#010101', jumia: '#F68B1E', takealot: '#0B79BF',
  google_sheets: '#0F9D58', manual_csv: '#6B7280',
}

const STORAGE_KEY = 'cfo_ad_spend_pct'

function fmt(n: number, sym: string): string {
  const abs = Math.abs(n)
  if (abs >= 1_000_000) return `${n < 0 ? '-' : ''}${sym}${(abs / 1_000_000).toFixed(1)}M`
  if (abs >= 1_000) return `${n < 0 ? '-' : ''}${sym}${(abs / 1_000).toFixed(1)}K`
  return `${n < 0 ? '-' : ''}${sym}${Math.round(abs).toLocaleString()}`
}

export default function ContributionMarginWaterfall({ channels, currencySymbol: sym, onAsk }: Props) {
  const { tc } = useLang()
  const [platformFees, setPlatformFees] = useState<Record<string, number>>(() => ({ ...PLATFORM_FEES }))
  const [adSpendPct, setAdSpendPct] = useState<Record<string, number>>({})
  const [editingFees, setEditingFees] = useState(false)
  const [drillChannel, setDrillChannel] = useState<string | null>(null)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        setAdSpendPct(parsed.adSpend || {})
        setPlatformFees(prev => ({ ...prev, ...parsed.platformFees }))
      }
    } catch {}
  }, [])

  const savePrefs = (fees: Record<string, number>, ad: Record<string, number>) => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ platformFees: fees, adSpend: ad })) } catch {}
  }

  const updateFee = (source: string, val: number) => {
    const updated = { ...platformFees, [source]: val }
    setPlatformFees(updated)
    savePrefs(updated, adSpendPct)
  }

  const updateAdSpend = (source: string, val: number) => {
    const updated = { ...adSpendPct, [source]: val }
    setAdSpendPct(updated)
    savePrefs(platformFees, updated)
  }

  if (!channels || channels.length === 0) return null

  const rows = channels.map(ch => {
    const feeRate = (platformFees[ch.source] ?? 0) / 100
    const adRate = (adSpendPct[ch.source] ?? 0) / 100
    const platformFeesAmt = ch.revenue * feeRate
    const adSpendAmt = ch.revenue * adRate
    const cm1 = ch.gross_profit
    const cm2 = cm1 - platformFeesAmt
    const cm3 = cm2 - adSpendAmt
    return {
      ...ch,
      platformFeesAmt,
      adSpendAmt,
      cm1, cm2, cm3,
      cm1Pct: ch.revenue > 0 ? (cm1 / ch.revenue) * 100 : 0,
      cm2Pct: ch.revenue > 0 ? (cm2 / ch.revenue) * 100 : 0,
      cm3Pct: ch.revenue > 0 ? (cm3 / ch.revenue) * 100 : 0,
    }
  }).sort((a, b) => b.revenue - a.revenue)

  const totalRev = rows.reduce((s, r) => s + r.revenue, 0)
  const totalCm1 = rows.reduce((s, r) => s + r.cm1, 0)
  const totalCm2 = rows.reduce((s, r) => s + r.cm2, 0)
  const totalCm3 = rows.reduce((s, r) => s + r.cm3, 0)

  const drillRow = drillChannel ? rows.find(r => r.source === drillChannel) : null

  const pctColor = (p: number) => p >= 40 ? '#22C55E' : p >= 20 ? '#F59E0B' : '#EF4444'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Main table */}
      <div style={{ borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--b)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 3, height: 14, borderRadius: 2, background: '#22C55E' }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--tx)' }}>{tc('cfo_contribution.title')}</span>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              onClick={() => setEditingFees(!editingFees)}
              style={{ fontSize: 9, color: editingFees ? '#6366F1' : 'var(--tx3)', background: editingFees ? 'rgba(99,102,241,.08)' : 'transparent', border: editingFees ? '1px solid rgba(99,102,241,.3)' : '1px solid var(--b)', borderRadius: 6, padding: '3px 8px', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}
            >
              {editingFees ? tc('cfo_contribution.done') : tc('cfo_contribution.edit_rates')}
            </button>
            {onAsk && (
              <button
                onClick={() => onAsk(tc('cfo_contribution.ask_prompt_intro') + rows.map(r => tc('cfo_contribution.ask_prompt_channel', { label: r.label, cm1: r.cm1Pct.toFixed(1), fee: (platformFees[r.source] ?? 0), cm2: r.cm2Pct.toFixed(1), cm3: r.cm3Pct.toFixed(1) })).join('; ') + tc('cfo_contribution.ask_prompt_question'))}
                style={{ fontSize: 9, color: '#6366F1', background: 'rgba(99,102,241,.08)', border: 'none', borderRadius: 6, padding: '3px 8px', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}
              >{tc('cfo_contribution.ask_ai')}</button>
            )}
          </div>
        </div>

        {/* CM level explanation */}
        <div style={{ padding: '8px 18px', borderBottom: '1px solid var(--b)', display: 'flex', gap: 16, fontSize: 9, color: 'var(--tx3)' }}>
          <span><strong style={{ color: 'var(--tx)' }}>CM1</strong> = {tc('cfo_contribution.cm1_formula')}</span>
          <span><strong style={{ color: 'var(--tx)' }}>CM2</strong> = {tc('cfo_contribution.cm2_formula')}</span>
          <span><strong style={{ color: 'var(--tx)' }}>CM3</strong> = {tc('cfo_contribution.cm3_formula')}</span>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 9 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--b)' }}>
                <th style={{ textAlign: 'left', padding: '8px 18px', color: 'var(--tx3)', fontWeight: 600, fontSize: 9, textTransform: 'uppercase', letterSpacing: '.04em' }}>{tc('cfo_contribution.col_channel')}</th>
                <th style={{ textAlign: 'right', padding: '8px 10px', color: 'var(--tx3)', fontWeight: 600, fontSize: 9, textTransform: 'uppercase', letterSpacing: '.04em' }}>{tc('cfo_contribution.col_revenue')}</th>
                <th style={{ textAlign: 'right', padding: '8px 10px', color: 'var(--tx3)', fontWeight: 600, fontSize: 9, textTransform: 'uppercase', letterSpacing: '.04em' }}>{tc('cfo_contribution.col_cm1')}</th>
                {editingFees && <th style={{ textAlign: 'right', padding: '8px 10px', color: 'var(--tx3)', fontWeight: 600, fontSize: 9 }}>{tc('cfo_contribution.col_plat_fee')}</th>}
                <th style={{ textAlign: 'right', padding: '8px 10px', color: 'var(--tx3)', fontWeight: 600, fontSize: 9, textTransform: 'uppercase', letterSpacing: '.04em' }}>{tc('cfo_contribution.col_cm2')}</th>
                {editingFees && <th style={{ textAlign: 'right', padding: '8px 10px', color: 'var(--tx3)', fontWeight: 600, fontSize: 9 }}>{tc('cfo_contribution.col_ad_spend')}</th>}
                <th style={{ textAlign: 'right', padding: '8px 10px', color: 'var(--tx3)', fontWeight: 600, fontSize: 9, textTransform: 'uppercase', letterSpacing: '.04em' }}>{tc('cfo_contribution.col_cm3')}</th>
                <th style={{ textAlign: 'right', padding: '8px 18px', color: 'var(--tx3)', fontWeight: 600, fontSize: 9 }}>{tc('cfo_contribution.col_visual')}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => {
                const color = CHANNEL_COLORS[row.source] || '#6366F1'
                const isSelected = drillChannel === row.source
                return (
                  <tr
                    key={i}
                    onClick={() => setDrillChannel(isSelected ? null : row.source)}
                    style={{
                      borderTop: '1px solid var(--b)',
                      background: isSelected ? 'rgba(99,102,241,.03)' : undefined,
                      cursor: 'pointer',
                      transition: 'background 120ms',
                    }}
                  >
                    <td style={{ padding: '10px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block', flexShrink: 0 }} />
                        <span style={{ fontWeight: 600, color: 'var(--tx)' }}>{row.label}</span>
                        <span style={{ fontSize: 9, color: 'var(--tx3)' }}>{tc('cfo_contribution.orders', { n: row.orders })}</span>
                      </div>
                    </td>
                    <td style={{ padding: '10px', textAlign: 'right', color: 'var(--tx)', fontVariantNumeric: 'tabular-nums' }}>
                      {fmt(row.revenue, sym)}
                    </td>
                    <td style={{ padding: '10px', textAlign: 'right' }}>
                      <span style={{ fontWeight: 600, color: pctColor(row.cm1Pct) }}>{row.cm1Pct.toFixed(1)}%</span>
                      <div style={{ fontSize: 9, color: 'var(--tx3)' }}>{fmt(row.cm1, sym)}</div>
                    </td>
                    {editingFees && (
                      <td style={{ padding: '10px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
                          <input
                            type="number"
                            value={platformFees[row.source] ?? 0}
                            onChange={e => { e.stopPropagation(); updateFee(row.source, Number(e.target.value)) }}
                            onClick={e => e.stopPropagation()}
                            min={0} max={50} step={0.1}
                            style={{ width: 48, padding: '2px 4px', borderRadius: 4, border: '1px solid var(--b)', fontSize: 9, fontFamily: 'inherit', textAlign: 'right' }}
                          />
                          <span style={{ fontSize: 9, color: 'var(--tx3)' }}>%</span>
                        </div>
                      </td>
                    )}
                    <td style={{ padding: '10px', textAlign: 'right' }}>
                      <span style={{ fontWeight: 600, color: pctColor(row.cm2Pct) }}>{row.cm2Pct.toFixed(1)}%</span>
                      <div style={{ fontSize: 9, color: 'var(--tx3)' }}>{fmt(row.cm2, sym)}</div>
                    </td>
                    {editingFees && (
                      <td style={{ padding: '10px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
                          <input
                            type="number"
                            value={adSpendPct[row.source] ?? 0}
                            onChange={e => { e.stopPropagation(); updateAdSpend(row.source, Number(e.target.value)) }}
                            onClick={e => e.stopPropagation()}
                            min={0} max={100} step={0.5}
                            style={{ width: 48, padding: '2px 4px', borderRadius: 4, border: '1px solid var(--b)', fontSize: 9, fontFamily: 'inherit', textAlign: 'right' }}
                          />
                          <span style={{ fontSize: 9, color: 'var(--tx3)' }}>%</span>
                        </div>
                      </td>
                    )}
                    <td style={{ padding: '10px', textAlign: 'right' }}>
                      <span style={{ fontWeight: 700, color: pctColor(row.cm3Pct) }}>{row.cm3Pct.toFixed(1)}%</span>
                      <div style={{ fontSize: 9, color: 'var(--tx3)' }}>{fmt(row.cm3, sym)}</div>
                    </td>
                    <td style={{ padding: '10px 18px', textAlign: 'right' }}>
                      <WaterfallMini cm1={row.cm1Pct} cm2={row.cm2Pct} cm3={row.cm3Pct} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot>
              <tr style={{ borderTop: '2px solid var(--b)', background: 'rgba(99,102,241,.02)' }}>
                <td style={{ padding: '10px 18px', fontWeight: 700, color: 'var(--tx)', fontSize: 10 }}>{tc('cfo_contribution.total')}</td>
                <td style={{ padding: '10px', textAlign: 'right', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{fmt(totalRev, sym)}</td>
                <td style={{ padding: '10px', textAlign: 'right', fontWeight: 700, color: pctColor(totalRev > 0 ? (totalCm1 / totalRev) * 100 : 0) }}>
                  {totalRev > 0 ? ((totalCm1 / totalRev) * 100).toFixed(1) : 0}%
                </td>
                {editingFees && <td />}
                <td style={{ padding: '10px', textAlign: 'right', fontWeight: 700, color: pctColor(totalRev > 0 ? (totalCm2 / totalRev) * 100 : 0) }}>
                  {totalRev > 0 ? ((totalCm2 / totalRev) * 100).toFixed(1) : 0}%
                </td>
                {editingFees && <td />}
                <td style={{ padding: '10px', textAlign: 'right', fontWeight: 700, color: pctColor(totalRev > 0 ? (totalCm3 / totalRev) * 100 : 0) }}>
                  {totalRev > 0 ? ((totalCm3 / totalRev) * 100).toFixed(1) : 0}%
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Drill-down panel */}
        {drillRow && (
          <div style={{ padding: '14px 18px', borderTop: '1px solid var(--b)', background: 'rgba(99,102,241,.02)' }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--tx)', marginBottom: 10 }}>
              {tc('cfo_contribution.drill_title', { label: drillRow.label })}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { label: tc('cfo_contribution.step_revenue'), value: drillRow.revenue, pct: 100, color: '#6366F1' },
                { label: tc('cfo_contribution.step_cogs'), value: -drillRow.cogs, pct: drillRow.revenue > 0 ? -(drillRow.cogs / drillRow.revenue) * 100 : 0, color: '#EF4444' },
                { label: tc('cfo_contribution.step_cm1'), value: drillRow.cm1, pct: drillRow.cm1Pct, color: '#22C55E', bold: true },
                { label: tc('cfo_contribution.step_platform_fees', { pct: (platformFees[drillRow.source] ?? 0) }), value: -drillRow.platformFeesAmt, pct: drillRow.revenue > 0 ? -(drillRow.platformFeesAmt / drillRow.revenue) * 100 : 0, color: '#F97316' },
                { label: tc('cfo_contribution.step_cm2'), value: drillRow.cm2, pct: drillRow.cm2Pct, color: '#22C55E', bold: true },
                { label: tc('cfo_contribution.step_ad_spend', { pct: (adSpendPct[drillRow.source] ?? 0) }), value: -drillRow.adSpendAmt, pct: drillRow.revenue > 0 ? -(drillRow.adSpendAmt / drillRow.revenue) * 100 : 0, color: '#F97316' },
                { label: tc('cfo_contribution.step_cm3'), value: drillRow.cm3, pct: drillRow.cm3Pct, color: pctColor(drillRow.cm3Pct), bold: true },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 180, fontSize: 9, fontWeight: item.bold ? 700 : 400, color: item.bold ? 'var(--tx)' : 'var(--tx3)', flexShrink: 0 }}>{item.label}</span>
                  <div style={{ flex: 1, height: 14, borderRadius: 3, background: 'var(--ev, #f3f2ef)', overflow: 'hidden' }}>
                    {item.value > 0 && (
                      <div style={{ height: '100%', width: `${Math.min((item.value / drillRow.revenue) * 100, 100)}%`, background: item.color, borderRadius: 3 }} />
                    )}
                  </div>
                  <span style={{ width: 60, fontSize: 9, fontWeight: item.bold ? 700 : 400, color: item.color, textAlign: 'right', fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>
                    {fmt(item.value, sym)}
                  </span>
                  <span style={{ width: 44, fontSize: 9, color: item.bold ? item.color : 'var(--tx3)', textAlign: 'right', flexShrink: 0 }}>
                    {item.pct > 0 ? `${item.pct.toFixed(1)}%` : item.pct < 0 ? `${item.pct.toFixed(1)}%` : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function WaterfallMini({ cm1, cm2, cm3 }: { cm1: number; cm2: number; cm3: number }) {
  const max = Math.max(cm1, 1)
  const h = 12
  return (
    <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end', height: h + 4 }}>
      {[cm1, cm2, cm3].map((v, i) => {
        const ht = Math.max((v / max) * h, 2)
        const c = v >= 40 ? '#22C55E' : v >= 20 ? '#F59E0B' : '#EF4444'
        return (
          <div key={i} style={{ width: 8, height: ht, borderRadius: 2, background: c, opacity: 0.8, alignSelf: 'flex-end' }} />
        )
      })}
    </div>
  )
}
