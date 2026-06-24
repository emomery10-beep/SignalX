'use client'
import { useState, useEffect, useMemo, useCallback } from 'react'
import { useLang } from '@/components/LanguageProvider'

// ── Market Climate ────────────────────────────────────────────────────────────
// Translates today's macro + supply-chain conditions into a personalised read
// for THIS business: weighted severity, real cash impact, a time-horizon
// playbook, ranked actions, a live stress test, and a supply-chain status.
// ─────────────────────────────────────────────────────────────────────────────

const INDIGO = '#6366F1'
const RED = '#EF4444'
const AMBER = '#F59E0B'
const GREEN = '#22C55E'

interface Signal {
  key: string; label: string; kind: string; value: string
  direction: 'up' | 'down' | 'flat'; changePct: number | null; summary: string
}
interface Lane { lane: string; route: string; status: string; severity: 'ok' | 'watch' | 'alert' }
interface ClimateData {
  currency_symbol: string
  country: string
  mapped: boolean
  requested_country: string
  sector: { key: string; label: string; icon: string; import_pct: number }
  tracking?: { sector: string; channel: string | null }
  condition: string
  condition_icon: string
  severity: number
  signals: Signal[]
  supply: { lanes: Lane[]; port: { port: string; status: string; severity: 'ok' | 'watch' | 'alert' } | null }
  exposure: {
    est_extra_monthly: number; monthly_import_spend: number; import_pct: number
    runway_months: number | null; cash_balance: number; monthly_fixed: number
  }
  narrative: {
    headline: string; body: string; opportunity: string | null
    timeline: Array<{ when: string; title: string; detail: string; severity: 'alert' | 'watch' | 'info' }>
    actions: Array<{ urgency: 'urgent' | 'soon' | 'watch'; title: string; detail: string }>
  }
  updated_at: string
}

interface Props {
  currencySymbol: string
  cashBalance?: number
  monthlyFixed?: number
  defaultExpanded?: boolean
  onAsk?: (prompt: string) => void
}

const SEV_COLOR = (s: number) => s >= 66 ? RED : s >= 33 ? AMBER : GREEN
const SEV_BG = (sev: 'ok' | 'watch' | 'alert') => sev === 'alert' ? RED : sev === 'watch' ? AMBER : GREEN

export default function MarketClimate({ currencySymbol: sym, cashBalance = 0, monthlyFixed = 0, defaultExpanded = false, onAsk }: Props) {
  const { tc, fmtDate } = useLang()
  const [data, setData] = useState<ClimateData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [requested, setRequested] = useState(false)
  const [expanded, setExpanded] = useState(defaultExpanded)
  const [tab, setTab] = useState<'now' | 'week' | 'stress' | 'actions' | 'supply'>('now')

  const load = useCallback((force = false) => {
    if (force) setRefreshing(true)
    const qs = new URLSearchParams()
    if (cashBalance > 0) qs.set('cash_balance', String(cashBalance))
    if (monthlyFixed > 0) qs.set('monthly_fixed_costs', String(monthlyFixed))
    if (force) qs.set('refresh', '1')
    const url = '/api/market-climate' + (qs.toString() ? `?${qs}` : '')
    fetch(url)
      .then(r => r.ok ? r.json() : null)
      .then(d => setData(d))
      .catch(() => setData(null))
      .finally(() => { setLoading(false); setRefreshing(false) })
  }, [cashBalance, monthlyFixed])

  useEffect(() => { load(false) }, [load])

  const fmt = (n: number) => {
    const abs = Math.abs(n)
    if (abs >= 1_000_000) return `${sym}${(n / 1_000_000).toFixed(1)}M`
    if (abs >= 1_000) return `${sym}${(n / 1_000).toFixed(1)}K`
    return `${sym}${Math.round(n).toLocaleString()}`
  }

  if (loading) {
    return <div style={{ height: 54, borderRadius: 12, border: '1px solid var(--b)', background: 'var(--ev, #f3f2ef)', animation: 'pulse 1.5s infinite' }} />
  }

  if (!data) return null
  const n = data.narrative
  const sevColor = SEV_COLOR(data.severity)
  const updated = fmtDate(data.updated_at, { hour: '2-digit', minute: '2-digit' })
  const extra = data.exposure.est_extra_monthly

  // ── Collapsed: a single compact row. Click to expand the full widget. ──
  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left',
          padding: '11px 14px', borderRadius: 12, border: '1px solid var(--b)', background: 'var(--sf)',
          cursor: 'pointer', fontFamily: 'inherit',
        }}
      >
        <span style={{ width: 9, height: 9, borderRadius: '50%', background: sevColor, flexShrink: 0, animation: data.severity >= 33 ? 'pulse 1.8s infinite' : 'none' }} />
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--tx3)' }}>{tc('cfo_marketclimate.headerTitle')} · {data.country}</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--tx)' }}>{data.condition} {data.condition_icon}</span>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          {extra > 0 && (
            <span style={{ fontSize: 12, fontWeight: 700, color: '#991b1b', whiteSpace: 'nowrap' }}>+{fmt(extra)}{tc('cfo_marketclimate.perMonth')}</span>
          )}
          <span style={{ fontSize: 12, fontWeight: 800, color: sevColor, whiteSpace: 'nowrap' }}>{data.severity}<span style={{ fontSize: 9, color: 'var(--tx3)' }}>/100</span></span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--tx3)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
        </div>
      </button>
    )
  }

  const tabs: Array<{ id: typeof tab; label: string }> = [
    { id: 'now', label: tc('cfo_marketclimate.tabNow') },
    { id: 'week', label: tc('cfo_marketclimate.tabWeek') },
    { id: 'stress', label: tc('cfo_marketclimate.tabStress') },
    { id: 'actions', label: tc('cfo_marketclimate.tabActions') },
    { id: 'supply', label: tc('cfo_marketclimate.tabSupply') },
  ]

  return (
    <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid var(--b)', boxShadow: '0 2px 12px rgba(0,0,0,.04)' }}>
      {/* ── Header ── */}
      <div style={{ background: '#0f172a', padding: '16px 18px 14px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 85% 40%, ${sevColor}33 0%, transparent 60%)` }} />
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: '#64748b' }}>{tc('cfo_marketclimate.headerTitle')} · {data.country}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: sevColor, animation: data.severity >= 33 ? 'pulse 1.8s infinite' : 'none' }} />
            <span style={{ fontSize: 9, color: '#475569' }}>{tc('cfo_marketclimate.updatedAt')} {updated}</span>
            <button
              onClick={() => load(true)}
              disabled={refreshing}
              title={refreshing ? tc('cfo_marketclimate.refreshing') : tc('cfo_marketclimate.refresh')}
              aria-label={refreshing ? tc('cfo_marketclimate.refreshing') : tc('cfo_marketclimate.refresh')}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20, borderRadius: 6, border: 'none', background: 'rgba(148,163,184,.15)', color: '#94a3b8', cursor: refreshing ? 'default' : 'pointer', padding: 0 }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: refreshing ? 'mcSpin 0.8s linear infinite' : 'none' }}>
                <path d="M23 4v6h-6M1 20v-6h6" /><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
              </svg>
            </button>
            <button
              onClick={() => setExpanded(false)}
              title={tc('cfo_marketclimate.collapse')}
              aria-label={tc('cfo_marketclimate.collapse')}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20, borderRadius: 6, border: 'none', background: 'rgba(148,163,184,.15)', color: '#94a3b8', cursor: 'pointer', padding: 0 }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6" /></svg>
            </button>
          </div>
        </div>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#fff', letterSpacing: '-.02em' }}>{data.condition} {data.condition_icon}</div>
            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 3, lineHeight: 1.5, maxWidth: 380 }}>{n.headline}</div>
            {data.tracking && (
              <div style={{ fontSize: 9, color: '#64748b', marginTop: 6, fontWeight: 600, letterSpacing: '.02em' }}>
                {tc('cfo_marketclimate.trackingPrefix')} {[data.tracking.sector, data.tracking.channel, data.country].filter(Boolean).join(' · ')}
              </div>
            )}
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 9, color: '#475569', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em' }}>{tc('cfo_marketclimate.severityLabel')}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: sevColor }}>{data.severity}<span style={{ fontSize: 11, color: '#475569' }}>/100</span></div>
          </div>
        </div>
      </div>

      {/* ── Global-coverage notice (country not individually tuned) ── */}
      {!data.mapped && (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 18px', background: 'rgba(99,102,241,.06)', borderBottom: '1px solid var(--b)' }}>
          <span style={{ fontSize: 15, marginTop: 1 }}>🌍</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: INDIGO, marginBottom: 2 }}>{tc('cfo_marketclimate.globalCoverageTitle')}</div>
            <div style={{ fontSize: 11, color: 'var(--tx3)', lineHeight: 1.5 }}>{tc('cfo_marketclimate.globalCoverageBody', { country: data.requested_country })}</div>
            {requested
              ? <div style={{ fontSize: 11, color: GREEN, fontWeight: 600, marginTop: 4 }}>{tc('cfo_marketclimate.globalCoverageRequested', { country: data.requested_country })}</div>
              : onAsk && (
                <button onClick={() => { setRequested(true); onAsk(`Please add Market Climate coverage for ${data.requested_country} — I'd like local stock index, FX, and central bank signals.`) }}
                  style={{ fontSize: 11, color: INDIGO, background: 'transparent', border: 'none', padding: '4px 0 0', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}>
                  {tc('cfo_marketclimate.globalCoverageCta', { country: data.requested_country })}
                </button>
              )}
          </div>
        </div>
      )}

      {/* ── Exposure strip ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', background: data.exposure.est_extra_monthly > 0 ? 'rgba(239,68,68,.05)' : 'rgba(34,197,94,.05)', borderLeft: `3px solid ${data.exposure.est_extra_monthly > 0 ? RED : GREEN}` }}>
        <span style={{ fontSize: 20 }}>📦</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: data.exposure.est_extra_monthly > 0 ? RED : GREEN }}>{tc('cfo_marketclimate.estimatedExtraCost')}</div>
          <div style={{ fontSize: 17, fontWeight: 800, color: data.exposure.est_extra_monthly > 0 ? '#991b1b' : '#166534' }}>
            {data.exposure.est_extra_monthly > 0 ? '+' : ''}{fmt(data.exposure.est_extra_monthly)}{tc('cfo_marketclimate.perMonth')}
          </div>
          <div style={{ fontSize: 11, color: 'var(--tx3)' }}>{tc('cfo_marketclimate.importExposedPct', { n: data.exposure.import_pct })}</div>
        </div>
        {data.exposure.runway_months != null && (
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 9, color: 'var(--tx3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em' }}>{tc('cfo_marketclimate.runwayLabel')}</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--tx)' }}>{data.exposure.runway_months} {tc('cfo_marketclimate.monthsAbbr')}</div>
          </div>
        )}
      </div>

      {/* ── Tabs ── */}
      <div style={{ display: 'flex', background: 'var(--ev, #f9fafb)', borderBottom: '1px solid var(--b)' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, padding: '10px 4px', textAlign: 'center', fontSize: 11, fontWeight: tab === t.id ? 700 : 500,
            color: tab === t.id ? INDIGO : 'var(--tx3)', background: tab === t.id ? 'var(--sf)' : 'transparent',
            border: 'none', borderBottom: `2px solid ${tab === t.id ? INDIGO : 'transparent'}`, cursor: 'pointer', fontFamily: 'inherit',
          }}>{t.label}</button>
        ))}
      </div>

      {/* ── Body ── */}
      <div style={{ background: 'var(--sf)', padding: 16 }}>
        {tab === 'now' && <NowPanel data={data} fmt={fmt} />}
        {tab === 'week' && <WeekPanel timeline={n.timeline} />}
        {tab === 'stress' && <StressPanel exposure={data.exposure} sym={sym} fmt={fmt} />}
        {tab === 'actions' && <ActionsPanel actions={n.actions} onAsk={onAsk} />}
        {tab === 'supply' && <SupplyPanel supply={data.supply} />}
      </div>

      {/* ── Footer: ask AI ── */}
      {onAsk && (
        <div style={{ padding: '10px 16px', borderTop: '1px solid var(--b)', background: 'var(--sf)' }}>
          <button onClick={() => onAsk(`Today's market climate is "${data.condition}" (severity ${data.severity}/100) for my ${data.sector.label} business in ${data.country}. Estimated extra cost ${fmt(data.exposure.est_extra_monthly)}/month. ${n.body} What should I prioritise this week?`)}
            style={{ fontSize: 11, color: INDIGO, background: 'rgba(99,102,241,.08)', border: 'none', borderRadius: 7, padding: '6px 12px', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}>
            {tc('cfo_marketclimate.askAi')}
          </button>
        </div>
      )}
      <style>{`@keyframes mcSpin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

/* ── NOW: signals + plain-English read + opportunity ── */
function NowPanel({ data, fmt }: { data: ClimateData; fmt: (n: number) => string }) {
  const { tc } = useLang()
  const n = data.narrative
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
        {data.signals.map(s => {
          const c = s.direction === 'down' ? RED : s.direction === 'up' ? GREEN : 'var(--tx3)'
          return (
            <div key={s.key} style={{ background: 'var(--ev, #f9fafb)', borderRadius: 10, padding: '10px 12px', border: '1px solid var(--b)' }}>
              <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--tx3)', marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: c }}>{s.value}</div>
              <div style={{ fontSize: 9, color: 'var(--tx3)', marginTop: 4, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{s.summary}</div>
            </div>
          )
        })}
      </div>

      <div style={{ background: 'rgba(245,158,11,.08)', border: `1.5px solid ${AMBER}55`, borderRadius: 10, padding: 12, marginBottom: n.opportunity ? 10 : 0 }}>
        <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: AMBER, marginBottom: 6 }}>{tc('cfo_marketclimate.yourBusinessSpecifically')}</div>
        <div style={{ fontSize: 12, color: 'var(--tx)', lineHeight: 1.6 }}>{n.body}</div>
      </div>

      {n.opportunity && (
        <div style={{ background: 'rgba(34,197,94,.08)', border: `1.5px solid ${GREEN}55`, borderRadius: 10, padding: 12 }}>
          <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: GREEN, marginBottom: 6 }}>{tc('cfo_marketclimate.hiddenOpportunity')}</div>
          <div style={{ fontSize: 12, color: 'var(--tx)', lineHeight: 1.6 }}>{n.opportunity}</div>
        </div>
      )}
    </div>
  )
}

/* ── THIS WEEK: time-horizon timeline ── */
function WeekPanel({ timeline }: { timeline: ClimateData['narrative']['timeline'] }) {
  const { tc } = useLang()
  if (!timeline.length) return <Empty msg={tc('cfo_marketclimate.emptyWeek')} />
  const dot = (sev: string) => sev === 'alert' ? RED : sev === 'watch' ? AMBER : '#cbd5e1'
  return (
    <div style={{ position: 'relative', paddingLeft: 4 }}>
      {timeline.map((t, i) => (
        <div key={i} style={{ display: 'flex', gap: 12, marginBottom: i === timeline.length - 1 ? 0 : 14 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: 9, height: 9, borderRadius: '50%', background: dot(t.severity), marginTop: 4, flexShrink: 0 }} />
            {i !== timeline.length - 1 && <div style={{ width: 2, flex: 1, background: 'var(--b)', marginTop: 2 }} />}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--tx3)' }}>{t.when}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)', marginTop: 1 }}>{t.title}</div>
            <div style={{ fontSize: 11, color: 'var(--tx3)', marginTop: 2, lineHeight: 1.5 }}>{t.detail}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ── 30 DAYS: live stress test ── */
function StressPanel({ exposure, sym, fmt }: { exposure: ClimateData['exposure']; sym: string; fmt: (n: number) => string }) {
  const { tc } = useLang()
  const [revDrop, setRevDrop] = useState(15)
  const [costRise, setCostRise] = useState(7)
  const [weeks, setWeeks] = useState(6)

  const result = useMemo(() => {
    // Base monthly revenue inferred from import spend & runway where possible.
    const monthlyFixed = exposure.monthly_fixed || 0
    const baseRevenue = Math.max(exposure.monthly_import_spend * 2.2, monthlyFixed * 1.5, 100000)
    const baseCost = exposure.monthly_import_spend || baseRevenue * 0.55
    const revImpact = baseRevenue * (revDrop / 100)
    const costImpact = baseCost * (costRise / 100)
    const monthlyHit = revImpact + costImpact
    const baseRunway = exposure.runway_months ?? 4
    const newRunway = Math.max(0.2, baseRunway - (weeks / 4.3) * (monthlyHit / Math.max(monthlyFixed, monthlyHit, 1)))
    const beShift = Math.round(costImpact / 100) * 100
    const verdict = newRunway > 3 ? tc('cfo_marketclimate.verdictComfortable') : newRunway > 1.5 ? tc('cfo_marketclimate.verdictManageable') : tc('cfo_marketclimate.verdictUrgent')
    return { monthlyHit, newRunway: Math.round(newRunway * 10) / 10, beShift, verdict, ok: newRunway > 3 }
  }, [revDrop, costRise, weeks, exposure, tc])

  const Slider = ({ label, val, set, min, max, suffix }: { label: string; val: number; set: (n: number) => void; min: number; max: number; suffix: string }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
      <span style={{ fontSize: 11, color: 'var(--tx2)', fontWeight: 600, minWidth: 86 }}>{label}</span>
      <input type="range" min={min} max={max} value={val} onChange={e => set(Number(e.target.value))} style={{ flex: 1, accentColor: INDIGO }} />
      <span style={{ fontSize: 12, fontWeight: 700, color: INDIGO, minWidth: 38, textAlign: 'right' }}>{suffix}{val}{suffix === '' ? tc('cfo_marketclimate.weeksAbbr') : '%'}</span>
    </div>
  )

  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--tx3)', marginBottom: 8 }}>{tc('cfo_marketclimate.stressTestTitle')}</div>
      <div style={{ background: 'var(--ev, #f9fafb)', borderRadius: 10, padding: 14, border: '1px solid var(--b)', marginBottom: 12 }}>
        <Slider label={tc('cfo_marketclimate.sliderRevenueDrop')} val={revDrop} set={setRevDrop} min={0} max={40} suffix="–" />
        <Slider label={tc('cfo_marketclimate.sliderCostIncrease')} val={costRise} set={setCostRise} min={0} max={30} suffix="+" />
        <Slider label={tc('cfo_marketclimate.sliderDuration')} val={weeks} set={setWeeks} min={1} max={12} suffix="" />
      </div>
      <div style={{ background: result.ok ? 'rgba(34,197,94,.06)' : 'rgba(239,68,68,.06)', borderRadius: 10, padding: 12 }}>
        <SRow label={tc('cfo_marketclimate.runwayCurrent')} val={exposure.runway_months != null ? tc('cfo_marketclimate.runwayMonthsVal', { n: exposure.runway_months }) : tc('cfo_marketclimate.runwaySetBalance')} ok />
        <SRow label={tc('cfo_marketclimate.runwayScenario')} val={tc('cfo_marketclimate.runwayMonthsVal', { n: result.newRunway })} ok={result.ok} />
        <SRow label={tc('cfo_marketclimate.monthlyProfitImpact')} val={`–${fmt(result.monthlyHit)}`} />
        <SRow label={tc('cfo_marketclimate.breakEvenShift')} val={`+${fmt(result.beShift)} ${tc('cfo_marketclimate.revenueNeeded')}`} />
        <SRow label={tc('cfo_marketclimate.verdictRowLabel')} val={result.verdict} ok={result.ok} last />
      </div>
    </div>
  )
}
function SRow({ label, val, ok, last }: { label: string; val: string; ok?: boolean; last?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: last ? 'none' : '1px solid rgba(0,0,0,.05)', fontSize: 11 }}>
      <span style={{ color: 'var(--tx3)' }}>{label}</span>
      <span style={{ fontWeight: 700, color: ok ? '#166534' : '#991b1b' }}>{val}</span>
    </div>
  )
}

/* ── ACTIONS: ranked, sector-specific ── */
function ActionsPanel({ actions, onAsk }: { actions: ClimateData['narrative']['actions']; onAsk?: (s: string) => void }) {
  const { tc } = useLang()
  if (!actions.length) return <Empty msg={tc('cfo_marketclimate.emptyActions')} />
  const bar = (u: string) => u === 'urgent' ? RED : u === 'soon' ? AMBER : '#cbd5e1'
  const label = (u: string) => u === 'urgent' ? tc('cfo_marketclimate.urgencyDoToday') : u === 'soon' ? tc('cfo_marketclimate.urgencyThisWeek') : tc('cfo_marketclimate.urgencyWatch')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {actions.map((a, i) => (
        <div key={i} onClick={() => onAsk?.(`Help me with this: ${a.title}. ${a.detail}`)} style={{ display: 'flex', gap: 10, padding: 12, borderRadius: 10, border: '1px solid var(--b)', cursor: onAsk ? 'pointer' : 'default', background: 'var(--ev, #f9fafb)' }}>
          <div style={{ width: 5, borderRadius: 3, background: bar(a.urgency), alignSelf: 'stretch', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: bar(a.urgency), marginBottom: 3 }}>{label(a.urgency)}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)', marginBottom: 2 }}>{a.title}</div>
            <div style={{ fontSize: 11, color: 'var(--tx3)', lineHeight: 1.45 }}>{a.detail}</div>
          </div>
          {onAsk && <span style={{ fontSize: 15, color: 'var(--tx3)', alignSelf: 'center' }}>›</span>}
        </div>
      ))}
    </div>
  )
}

/* ── SUPPLY: shipping lanes + port watch ── */
function SupplyPanel({ supply }: { supply: ClimateData['supply'] }) {
  const { tc } = useLang()
  const badge = (sev: 'ok' | 'watch' | 'alert') => (
    <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', padding: '2px 7px', borderRadius: 20, background: `${SEV_BG(sev)}1a`, color: SEV_BG(sev) }}>
      {sev === 'alert' ? tc('cfo_marketclimate.badgeDisrupted') : sev === 'watch' ? tc('cfo_marketclimate.badgeWatch') : tc('cfo_marketclimate.badgeClear')}
    </span>
  )
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {supply.lanes.map((l, i) => (
        <div key={i} style={{ background: 'var(--ev, #f9fafb)', borderRadius: 10, padding: 12, border: '1px solid var(--b)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)' }}>🚢 {l.lane}</span>
            {badge(l.severity)}
          </div>
          <div style={{ fontSize: 10, color: 'var(--tx3)', marginBottom: 4 }}>{tc('cfo_marketclimate.viaRoute')} {l.route}</div>
          <div style={{ fontSize: 11, color: 'var(--tx2)', lineHeight: 1.5 }}>{l.status}</div>
        </div>
      ))}
      {supply.port && (
        <div style={{ background: 'var(--ev, #f9fafb)', borderRadius: 10, padding: 12, border: '1px solid var(--b)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)' }}>⚓ {supply.port.port}</span>
            {badge(supply.port.severity)}
          </div>
          <div style={{ fontSize: 11, color: 'var(--tx2)', lineHeight: 1.5 }}>{supply.port.status}</div>
        </div>
      )}
    </div>
  )
}

function Empty({ msg }: { msg: string }) {
  return <div style={{ padding: 18, textAlign: 'center', fontSize: 12, color: 'var(--tx3)' }}>{msg}</div>
}
