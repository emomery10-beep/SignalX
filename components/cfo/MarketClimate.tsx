'use client'
import { useState, useEffect, useCallback } from 'react'
import { useLang } from '@/components/LanguageProvider'

// Module-level: survives re-mounts within the same browser session so the
// loading skeleton never flashes when the user navigates away and back.
let _memCache: ClimateData | null = null

// ── Market Climate ────────────────────────────────────────────────────────────
// Translates today's macro + supply-chain conditions into a personalised read
// for THIS business: weighted severity, real cash impact, a time-horizon
// playbook, ranked actions, a live stress test, and a supply-chain status.
// ─────────────────────────────────────────────────────────────────────────────

const INDIGO = '#6366F1'
const RED = '#EF4444'
const AMBER = '#F59E0B'
const GREEN = '#22C55E'
const RED_INK = '#991b1b'
const GREEN_INK = '#166534'

interface Signal {
  key: string; label: string; kind: string; value: string
  direction: 'up' | 'down' | 'flat'; changePct: number | null; summary: string
}
interface Lane { lane: string; route: string; status: string; severity: 'ok' | 'watch' | 'alert' }
interface SupplierSource { product: string; sourceCountry: string; supplierName?: string; currency?: string }
interface MissingContext { product: string }
interface ChannelStat { name: string; revenue_7d: number; prev_7d: number; trend: 'up' | 'down' | 'flat'; change_pct: number | null }
interface ProductStat { product: string; revenue_7d: number; units_7d: number }
interface GeoSignal { level: 'city' | 'country' | 'region'; location: string; summary: string; severity: 'ok' | 'watch' | 'alert' }
interface WorstSeller { product: string; revenue_7d: number; units_7d: number; your_price: number | null; reason: string; action: string }
interface LocalPrice { product: string; your_price: number | null; market_note: string; market_value: string }
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
  supplier_sources: SupplierSource[]
  missing_context: MissingContext[]
  local_conditions: { event: string; severity: 'alert' | 'watch' | 'ok' } | null
  geo_signals: GeoSignal[]
  channel_activity: { channels: ChannelStat[]; total_7d: number; prev_7d: number; trend: 'up' | 'down' | 'flat' }
  top_products: ProductStat[]
  worst_sellers: WorstSeller[]
  local_prices: LocalPrice[]
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

// Scoped styles: keyframes, focus rings, hover, and reduced-motion fallbacks.
// Rendered in every return branch so the collapsed bar gets them too.
function Styles() {
  return (
    <style>{`
      .mc *:focus-visible { outline: 2px solid ${INDIGO}; outline-offset: 2px; border-radius: 7px; }
      .mc-iconbtn { transition: background .15s ease; }
      .mc-iconbtn:hover:not(:disabled) { background: rgba(148,163,184,.30) !important; }
      .mc-tab { transition: color .15s ease, background .15s ease; }
      .mc-tab:hover { color: var(--tx2); }
      .mc-row { transition: border-color .15s ease, background .15s ease; }
      .mc-row:hover { border-color: ${INDIGO}55; }
      .mc-bar { transition: border-color .15s ease; }
      .mc-bar:hover { border-color: ${INDIGO}55; }
      .mc-link { transition: opacity .15s ease; }
      .mc-link:hover { opacity: .72; }
      @keyframes mcSpin { from { transform: rotate(0) } to { transform: rotate(360deg) } }
      @keyframes mcPulse { 0%, 100% { opacity: 1 } 50% { opacity: .35 } }
      @keyframes mcFade { from { opacity: 0; transform: translateY(3px) } to { opacity: 1; transform: none } }
      .mc-spin { animation: mcSpin .8s linear infinite; }
      .mc-pulse { animation: mcPulse 1.8s ease-in-out infinite; }
      .mc-fade { animation: mcFade .18s cubic-bezier(.22,1,.36,1); }
      .mc-meter { transition: width .5s cubic-bezier(.22,1,.36,1); }
      @media (prefers-reduced-motion: reduce) {
        .mc-spin, .mc-pulse, .mc-fade { animation: none !important; }
        .mc-meter { transition: none !important; }
      }
    `}</style>
  )
}

/* ── Inline icons (stroke, currentColor) — no decorative emoji ── */
const ico = { width: 13, height: 13, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
const IconCost = () => <svg {...ico}><path d="M3 7l9-4 9 4v10l-9 4-9-4V7z" /><path d="M3 7l9 4 9-4M12 11v10" /></svg>
const IconLane = () => <svg {...ico}><circle cx="5" cy="12" r="2" /><circle cx="19" cy="12" r="2" /><path d="M7 12h10" strokeDasharray="2 2.5" /></svg>
const IconPort = () => <svg {...ico}><circle cx="12" cy="5" r="2" /><path d="M12 7v12M8 11h8M5 14a7 7 0 0014 0" /></svg>
const IconGlobe = () => <svg {...ico}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 000 18 14 14 0 000-18" /></svg>
const IconAlert = () => <svg {...ico}><path d="M10.3 4l-7.4 13A2 2 0 004.6 20h14.8a2 2 0 001.7-3L13.7 4a2 2 0 00-3.4 0z" /><path d="M12 9v4M12 17h.01" /></svg>

export default function MarketClimate({ currencySymbol: sym, cashBalance = 0, monthlyFixed = 0, defaultExpanded = false, onAsk }: Props) {
  const { tc, fmtDate } = useLang()
  const [data, setData] = useState<ClimateData | null>(_memCache)
  const [loading, setLoading] = useState(!_memCache)
  const [refreshing, setRefreshing] = useState(false)
  const [requested, setRequested] = useState(false)
  const [expanded, setExpanded] = useState(defaultExpanded)
  const [tab, setTab] = useState<'now' | 'week' | 'supply' | 'local'>('now')

  const load = useCallback((force = false) => {
    if (force) setRefreshing(true)
    const qs = new URLSearchParams()
    if (cashBalance > 0) qs.set('cash_balance', String(cashBalance))
    if (monthlyFixed > 0) qs.set('monthly_fixed_costs', String(monthlyFixed))
    if (force) qs.set('refresh', '1')
    const url = '/api/market-climate' + (qs.toString() ? `?${qs}` : '')
    fetch(url)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) _memCache = d; setData(d) })
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
    return <div className="mc"><Styles /><div className="mc-pulse" style={{ height: 54, borderRadius: 14, border: '1px solid var(--b)', background: 'var(--ev, #f3f2ef)' }} /></div>
  }

  if (!data) return null
  const n = data.narrative
  const sevColor = SEV_COLOR(data.severity)
  const updated = fmtDate(data.updated_at, { hour: '2-digit', minute: '2-digit' })
  const extra = data.exposure.est_extra_monthly
  // Refresh fetches live data (Tavily + Claude); cap to ~twice a day, matching
  // the server. Within the window the button is a disabled no-op, not a credit drain.
  const dataAgeMs = data.updated_at ? Date.now() - new Date(data.updated_at).getTime() : Infinity
  const canRefresh = dataAgeMs >= 11 * 60 * 60 * 1000

  // ── Collapsed: Weather Card (Option A) — gradient background, emoji, body, top action ──
  const wcBg = data.severity >= 66
    ? 'linear-gradient(135deg, #fef2f2 0%, #fecaca 100%)'
    : data.severity >= 33
    ? 'linear-gradient(135deg, #fffbeb 0%, #fde68a 100%)'
    : 'linear-gradient(135deg, #f0fdf4 0%, #bbf7d0 100%)'
  const wcBorder = data.severity >= 66 ? '#fca5a5' : data.severity >= 33 ? '#fcd34d' : '#86efac'
  const wcInk = data.severity >= 66 ? '#991b1b' : data.severity >= 33 ? '#92400e' : '#14532d'
  const wcMuted = data.severity >= 66 ? '#ef444480' : data.severity >= 33 ? '#f59e0b80' : '#22c55e80'
  const topAction = n.actions?.[0] ?? null

  if (!expanded) {
    return (
      <div className="mc">
        <Styles />
        <div style={{ borderRadius: 16, border: `1.5px solid ${wcBorder}`, overflow: 'hidden', background: wcBg }}>
          {/* Card body — click anywhere to expand */}
          <button
            className="mc-bar"
            onClick={() => setExpanded(true)}
            aria-label={`${tc('cfo_marketclimate.headerTitle')} — ${data.condition}. Tap to see full analysis.`}
            style={{ width: '100%', textAlign: 'left', padding: '18px 20px 14px', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', display: 'block' }}
          >
            {/* Top row: label + emoji */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: wcMuted, marginBottom: 3 }}>
                  {tc('cfo_marketclimate.headerTitle')} · {data.country}
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, color: wcInk, letterSpacing: '-.01em', lineHeight: 1.1 }}>
                  {data.condition}
                </div>
              </div>
              <span style={{ fontSize: 36, lineHeight: 1, marginTop: -2 }}>{data.condition_icon}</span>
            </div>

            {/* Body: personalised impact */}
            <div style={{ fontSize: 12, color: wcInk, lineHeight: 1.65, opacity: .85, marginBottom: extra > 0 ? 10 : 0 }}>
              {n.body}
            </div>

            {/* Cost pill */}
            {extra > 0 && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 20, background: 'rgba(0,0,0,.07)', marginBottom: 2 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: wcInk }}>+{fmt(extra)}{tc('cfo_marketclimate.perMonth')}</span>
                <span style={{ fontSize: 10, color: wcInk, opacity: .65 }}>{tc('cfo_marketclimate.estimatedExtraCost')}</span>
              </div>
            )}
          </button>

          {/* Action strip */}
          {topAction && (
            <button
              onClick={() => setExpanded(true)}
              style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '11px 20px', background: 'rgba(0,0,0,.06)', border: 'none', borderTop: `1px solid ${wcBorder}`, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}
            >
              <span style={{ fontSize: 14 }}>💡</span>
              <span style={{ flex: 1, fontSize: 11, fontWeight: 600, color: wcInk, lineHeight: 1.45 }}>{topAction.title}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={wcInk} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: .5 }}><path d="M9 6l6 6-6 6" /></svg>
            </button>
          )}

          {/* Supplier context prompts — shown when we know products but not where they're sourced */}
          {data.missing_context?.length > 0 && (
            <SupplierPrompts
              missing={data.missing_context}
              wcInk={wcInk}
              wcBorder={wcBorder}
              onSaved={() => load(true)}
            />
          )}

          {/* Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 20px 10px', opacity: .55 }}>
            <span style={{ fontSize: 9, fontWeight: 600, color: wcInk, textTransform: 'uppercase', letterSpacing: '.05em' }}>
              {data.sector.label} · {data.sector.import_pct}% import exposed
            </span>
            <span style={{ fontSize: 9, color: wcInk }}>{tc('cfo_marketclimate.updatedAt')} {updated}</span>
          </div>
        </div>
      </div>
    )
  }

  const tabs: Array<{ id: typeof tab; label: string }> = [
    { id: 'now', label: tc('cfo_marketclimate.tabNow') },
    { id: 'week', label: tc('cfo_marketclimate.tabWeek') },
    { id: 'supply', label: tc('cfo_marketclimate.tabSupply') },
    { id: 'local', label: 'LOCAL' },
  ]

  return (
    <section className="mc" role="region" aria-label={`${tc('cfo_marketclimate.headerTitle')} · ${data.country}`}
      style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid var(--b)' }}>
      <Styles />
      {/* ── Header ── */}
      <div style={{ background: '#0f172a', padding: '16px 18px 12px', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 85% 30%, ${sevColor}30 0%, transparent 62%)` }} />
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: '#94a3b8' }}>{tc('cfo_marketclimate.headerTitle')} · {data.country}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span className={data.severity >= 33 ? 'mc-pulse' : undefined} style={{ width: 7, height: 7, borderRadius: '50%', background: sevColor }} />
            <span style={{ fontSize: 9, color: '#94a3b8' }}>{tc('cfo_marketclimate.updatedAt')} {updated}</span>
            <button
              className="mc-iconbtn"
              onClick={() => { if (canRefresh && !refreshing) load(true) }}
              disabled={refreshing || !canRefresh}
              title={refreshing ? tc('cfo_marketclimate.refreshing') : canRefresh ? tc('cfo_marketclimate.refresh') : tc('cfo_marketclimate.refreshLimited')}
              aria-label={refreshing ? tc('cfo_marketclimate.refreshing') : canRefresh ? tc('cfo_marketclimate.refresh') : tc('cfo_marketclimate.refreshLimited')}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 22, borderRadius: 7, border: 'none', background: 'rgba(148,163,184,.16)', color: '#cbd5e1', cursor: refreshing || !canRefresh ? 'default' : 'pointer', opacity: canRefresh ? 1 : 0.45, padding: 0 }}
            >
              <svg className={refreshing ? 'mc-spin' : undefined} width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 4v6h-6M1 20v-6h6" /><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
              </svg>
            </button>
            <button
              className="mc-iconbtn"
              onClick={() => setExpanded(false)}
              title={tc('cfo_marketclimate.collapse')}
              aria-label={tc('cfo_marketclimate.collapse')}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 22, borderRadius: 7, border: 'none', background: 'rgba(148,163,184,.16)', color: '#cbd5e1', cursor: 'pointer', padding: 0 }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6" /></svg>
            </button>
          </div>
        </div>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 23, fontWeight: 800, color: '#fff', letterSpacing: '-.02em' }}>{data.condition} {data.condition_icon}</div>
            <div style={{ fontSize: 11, color: '#cbd5e1', marginTop: 3, lineHeight: 1.5, maxWidth: 400 }}>{n.headline}</div>
            {data.tracking && (
              <div style={{ fontSize: 9.5, color: '#94a3b8', marginTop: 6, fontWeight: 600, letterSpacing: '.02em' }}>
                {tc('cfo_marketclimate.trackingPrefix')} {[data.tracking.sector, data.tracking.channel, data.country].filter(Boolean).join(' · ')}
              </div>
            )}
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: 9, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em' }}>{tc('cfo_marketclimate.severityLabel')}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: sevColor, lineHeight: 1.1 }}>{data.severity}<span style={{ fontSize: 11, color: '#94a3b8' }}>/100</span></div>
          </div>
        </div>
        {/* severity meter — gives the 0-100 number physical weight */}
        <div aria-hidden style={{ position: 'relative', marginTop: 12, height: 3, borderRadius: 2, background: 'rgba(255,255,255,.09)', overflow: 'hidden' }}>
          <div className="mc-meter" style={{ height: '100%', borderRadius: 2, width: `${Math.max(2, data.severity)}%`, background: sevColor }} />
        </div>
      </div>

      {/* ── Global-coverage notice (country not individually tuned) ── */}
      {!data.mapped && (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 18px', background: 'rgba(99,102,241,.06)', borderBottom: '1px solid var(--b)' }}>
          <span style={{ color: INDIGO, marginTop: 1, flexShrink: 0 }}><IconGlobe /></span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: INDIGO, marginBottom: 2 }}>{tc('cfo_marketclimate.globalCoverageTitle')}</div>
            <div style={{ fontSize: 11, color: 'var(--tx2)', lineHeight: 1.5 }}>{tc('cfo_marketclimate.globalCoverageBody', { country: data.requested_country })}</div>
            {requested
              ? <div style={{ fontSize: 11, color: GREEN_INK, fontWeight: 600, marginTop: 4 }}>{tc('cfo_marketclimate.globalCoverageRequested', { country: data.requested_country })}</div>
              : onAsk && (
                <button className="mc-link" onClick={() => { setRequested(true); onAsk(`Please add Market Climate coverage for ${data.requested_country} — I'd like local stock index, FX, and central bank signals.`) }}
                  style={{ fontSize: 11, color: INDIGO, background: 'transparent', border: 'none', padding: '4px 0 0', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}>
                  {tc('cfo_marketclimate.globalCoverageCta', { country: data.requested_country })}
                </button>
              )}
          </div>
        </div>
      )}

      {/* ── Exposure strip ── */}
      {(() => {
        const isCost = extra > 0
        const tint = isCost ? RED : GREEN
        const ink = isCost ? RED_INK : GREEN_INK
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', background: `${tint}0d`, borderBottom: '1px solid var(--b)' }}>
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, borderRadius: 9, background: `${tint}1a`, color: tint, flexShrink: 0 }}><IconCost /></span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: ink }}>{tc('cfo_marketclimate.estimatedExtraCost')}</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: ink }}>
                {isCost ? `+${fmt(extra)}${tc('cfo_marketclimate.perMonth')}` : tc('cfo_marketclimate.noAddedCost')}
              </div>
              <div style={{ fontSize: 11, color: 'var(--tx3)' }}>{tc('cfo_marketclimate.importExposedPct', { n: data.exposure.import_pct })}</div>
            </div>
            {data.exposure.runway_months != null && (
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 9, color: 'var(--tx3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em' }}>{tc('cfo_marketclimate.runwayLabel')}</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--tx)' }}>{data.exposure.runway_months} {tc('cfo_marketclimate.monthsAbbr')}</div>
              </div>
            )}
          </div>
        )
      })()}

      {/* ── Tabs ── */}
      <div role="tablist" style={{ display: 'flex', background: 'var(--ev, #f9fafb)', borderBottom: '1px solid var(--b)' }}>
        {tabs.map(t => (
          <button key={t.id} role="tab" aria-selected={tab === t.id} className="mc-tab" onClick={() => setTab(t.id)} style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px 4px',
            fontSize: 11, fontWeight: tab === t.id ? 700 : 500, whiteSpace: 'nowrap',
            color: tab === t.id ? INDIGO : 'var(--tx3)', background: tab === t.id ? 'var(--sf)' : 'transparent',
            border: 'none', borderBottom: `2px solid ${tab === t.id ? INDIGO : 'transparent'}`, cursor: 'pointer', fontFamily: 'inherit',
          }}>{t.label}</button>
        ))}
      </div>

      {/* ── Body ── */}
      <div key={tab} className="mc-fade" style={{ background: 'var(--sf)', padding: 16 }}>
        {tab === 'now' && <NowPanel data={data} />}
        {tab === 'week' && <WeekPanel data={data} fmt={fmt} />}
        {tab === 'supply' && <SupplyPanel supply={data.supply} topProducts={data.top_products} geoSignals={data.geo_signals || []} fmt={fmt} />}
        {tab === 'local' && <LocalPanel data={data} fmt={fmt} />}
      </div>

      {/* ── Footer: ask AI ── */}
      {onAsk && (
        <div style={{ padding: '10px 16px', borderTop: '1px solid var(--b)', background: 'var(--sf)' }}>
          <button className="mc-link" onClick={() => onAsk(`Today's market climate is "${data.condition}" (severity ${data.severity}/100) for my ${data.sector.label} business in ${data.country}. Estimated extra cost ${fmt(extra)}/month. ${n.body} What should I prioritise this week?`)}
            style={{ fontSize: 11, color: INDIGO, background: 'rgba(99,102,241,.08)', border: 'none', borderRadius: 8, padding: '7px 13px', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}>
            {tc('cfo_marketclimate.askAi')}
          </button>
        </div>
      )}
    </section>
  )
}

/* ── NOW: signals + plain-English read + opportunity ── */
function NowPanel({ data }: { data: ClimateData }) {
  const { tc } = useLang()
  const n = data.narrative
  const hasLive = data.signals.some(s => (s.value && s.value !== '—') || s.changePct != null)

  const lc = data.local_conditions
  return (
    <div>
      {lc && lc.severity !== 'ok' && (
        <div style={{ marginBottom: 12, padding: 12, borderRadius: 10, background: lc.severity === 'alert' ? `${RED}12` : `${AMBER}12`, border: `1px solid ${lc.severity === 'alert' ? `${RED}40` : `${AMBER}40`}` }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <span style={{ color: lc.severity === 'alert' ? RED : AMBER, flexShrink: 0, marginTop: 1 }}><IconAlert /></span>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx)', marginBottom: 3 }}>Local conditions today</div>
              <div style={{ fontSize: 11, color: 'var(--tx2)', lineHeight: 1.5 }}>{lc.event}</div>
            </div>
          </div>
        </div>
      )}
      {!hasLive ? (
        <div style={{ marginBottom: 12 }}>
          {data.signals.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 8 }}>
              {data.signals.map(s => (
                <div key={s.key} style={{ background: 'var(--ev, #f9fafb)', borderRadius: 10, padding: '10px 12px' }}>
                  <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--tx3)', marginBottom: 6 }}>{s.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--tx3)' }}>—</div>
                  <div style={{ fontSize: 10, color: 'var(--tx3)', marginTop: 4, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>
                    {s.summary && s.summary !== 'No fresh reading available.' ? s.summary : 'No live data today'}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ background: 'var(--ev, #f9fafb)', borderRadius: 10, padding: 14, fontSize: 11, color: 'var(--tx3)' }}>
              Personalising your signals — check back shortly.
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 8, marginBottom: 12 }}>
          {data.signals.map(s => {
            const c = s.direction === 'down' ? RED : s.direction === 'up' ? GREEN : 'var(--tx2)'
            const blank = !s.value || s.value === '—'
            return (
              <div key={s.key} style={{ background: 'var(--ev, #f9fafb)', borderRadius: 10, padding: '10px 12px' }}>
                <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--tx3)', marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: blank ? 'var(--tx3)' : c }}>{blank ? '—' : s.value}</div>
                <div style={{ fontSize: 10, color: 'var(--tx3)', marginTop: 4, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{s.summary}</div>
              </div>
            )
          })}
        </div>
      )}

      <Callout color={AMBER} label={tc('cfo_marketclimate.yourBusinessSpecifically')} body={n.body} />
      {n.opportunity && <div style={{ marginTop: 10 }}><Callout color={GREEN} label={tc('cfo_marketclimate.hiddenOpportunity')} body={n.opportunity} /></div>}
    </div>
  )
}

function Callout({ color, label, body }: { color: string; label: string; body: string }) {
  return (
    <div style={{ background: `${color}14`, border: `1px solid ${color}40`, borderRadius: 10, padding: 12 }}>
      <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 12, color: 'var(--tx)', lineHeight: 1.6 }}>{body}</div>
    </div>
  )
}

/* ── THIS WEEK: POS + connected sources + market events ── */
function WeekPanel({ data, fmt }: { data: ClimateData; fmt: (n: number) => string }) {
  const { tc } = useLang()
  const n = data.narrative
  const channels = data.channel_activity?.channels || []
  const products = data.top_products || []
  const timeline = n.timeline || []
  const hasChannels = channels.some(c => c.revenue_7d > 0)
  const hasProducts = products.length > 0
  const hasTimeline = timeline.length > 0
  const trendArrow = (t: 'up' | 'down' | 'flat') => t === 'up' ? '▲' : t === 'down' ? '▼' : '—'
  const trendColor = (t: 'up' | 'down' | 'flat') => t === 'up' ? GREEN : t === 'down' ? RED : 'var(--tx3)'

  if (!hasChannels && !hasProducts && !hasTimeline) {
    return <Empty msg={tc('cfo_marketclimate.emptyWeek')} />
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {hasChannels && (
        <div>
          <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--tx3)', marginBottom: 8 }}>Your sources · last 30 days</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {channels.map(ch => (
              <div key={ch.name} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'var(--ev, #f9fafb)', borderRadius: 9 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx)', flex: 1 }}>{ch.name}</span>
                <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--tx)' }}>{fmt(ch.revenue_7d)}</span>
                {ch.change_pct !== null && (
                  <span style={{ fontSize: 10, fontWeight: 700, color: trendColor(ch.trend), minWidth: 44, textAlign: 'right' }}>
                    {trendArrow(ch.trend)} {Math.abs(ch.change_pct)}%
                  </span>
                )}
              </div>
            ))}
            {data.channel_activity?.total_7d > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 12px', fontSize: 10, color: 'var(--tx3)' }}>
                <span>Total this week</span>
                <span style={{ fontWeight: 700, color: trendColor(data.channel_activity.trend) }}>
                  {fmt(data.channel_activity.total_7d)}
                  {data.channel_activity.trend !== 'flat' && ` ${trendArrow(data.channel_activity.trend)} vs last week`}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {hasProducts && (
        <div>
          <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--tx3)', marginBottom: 8 }}>Top products · last 30 days</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {products.map((p, i) => (
              <div key={p.product} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 12px', background: 'var(--ev, #f9fafb)', borderRadius: 9 }}>
                <span style={{ fontSize: 10, color: 'var(--tx3)', minWidth: 14 }}>{i + 1}.</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.product}</span>
                {p.units_7d > 0 && <span style={{ fontSize: 10, color: 'var(--tx3)' }}>{p.units_7d} units</span>}
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx)' }}>{fmt(p.revenue_7d)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {hasTimeline && (
        <div>
          <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--tx3)', marginBottom: 8 }}>Market outlook</div>
          <div style={{ position: 'relative', paddingLeft: 4 }}>
            {timeline.map((t, i) => {
              const dot = t.severity === 'alert' ? RED : t.severity === 'watch' ? AMBER : '#cbd5e1'
              return (
                <div key={i} style={{ display: 'flex', gap: 12, marginBottom: i === timeline.length - 1 ? 0 : 14 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: 9, height: 9, borderRadius: '50%', background: dot, marginTop: 4, flexShrink: 0 }} />
                    {i !== timeline.length - 1 && <div style={{ width: 2, flex: 1, background: 'var(--b)', marginTop: 2 }} />}
                  </div>
                  <div style={{ flex: 1, paddingBottom: 2 }}>
                    <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--tx3)' }}>{t.when}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)', marginTop: 1 }}>{t.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--tx3)', marginTop: 2, lineHeight: 1.5 }}>{t.detail}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}



/* ── SUPPLY: geographic zoom (city → country → region) + inventory + port ── */
function SupplyPanel({ supply, topProducts, geoSignals, fmt }: {
  supply: ClimateData['supply']
  topProducts: ClimateData['top_products']
  geoSignals: GeoSignal[]
  fmt: (n: number) => string
}) {
  const { tc } = useLang()
  const hasProducts = (topProducts || []).length > 0
  const hasGeo = geoSignals.length > 0
  const port = supply.port

  const sevColor = (s: 'ok' | 'watch' | 'alert') => s === 'alert' ? RED : s === 'watch' ? AMBER : GREEN
  const levIcon = (l: string) => l === 'city' ? (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
  ) : l === 'country' ? (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
  ) : (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 000 18 14 14 0 000-18"/></svg>
  )
  const levLabel = (l: string) => l === 'city' ? 'Local' : l === 'country' ? 'Country' : 'Region'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* ── Geographic zoom: city → country → region ── */}
      {hasGeo && (
        <div>
          <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--tx3)', marginBottom: 8 }}>Local conditions</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1, borderRadius: 11, overflow: 'hidden', border: '1px solid var(--b)' }}>
            {geoSignals.map((g, i) => {
              const color = sevColor(g.severity)
              return (
                <div key={g.level} style={{
                  display: 'flex', gap: 12, padding: '11px 14px',
                  background: `color-mix(in srgb, ${color} 8%, ${i % 2 === 0 ? 'var(--sf)' : 'var(--ev, #f9fafb)'})`,
                  borderBottom: i < geoSignals.length - 1 ? '1px solid var(--b)' : 'none',
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 1, color: 'var(--tx3)', flexShrink: 0 }}>
                    {levIcon(g.level)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                      <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color }}>
                        {levLabel(g.level)}
                      </span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {g.location}
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--tx2)', lineHeight: 1.55, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {g.summary}
                    </div>
                  </div>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: color, flexShrink: 0, marginTop: 4 }} />
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Top inventory movers ── */}
      {hasProducts && (
        <div>
          <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--tx3)', marginBottom: 8 }}>Your inventory · top movers (30 days)</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {(topProducts || []).map((p, i) => (
              <div key={p.product} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'var(--ev, #f9fafb)', borderRadius: 9 }}>
                <span style={{ fontSize: 10, color: 'var(--tx3)', minWidth: 14 }}>{i + 1}.</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.product}</span>
                {p.units_7d > 0 && <span style={{ fontSize: 10, color: 'var(--tx3)' }}>{p.units_7d} units</span>}
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx)' }}>{fmt(p.revenue_7d)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Port watch (only if relevant) ── */}
      {port && (
        <div>
          <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--tx3)', marginBottom: 8 }}>Port</div>
          <div style={{ display: 'flex', gap: 12, padding: '11px 14px', borderRadius: 10, background: `color-mix(in srgb, ${sevColor(port.severity)} 8%, var(--ev, #f9fafb))`, border: `1px solid var(--b)` }}>
            <span style={{ color: 'var(--tx3)', flexShrink: 0, marginTop: 1 }}><IconPort /></span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx)', marginBottom: 3 }}>{port.port}</div>
              <div style={{ fontSize: 11, color: 'var(--tx2)', lineHeight: 1.5 }}>{port.status}</div>
            </div>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: sevColor(port.severity), flexShrink: 0, marginTop: 4 }} />
          </div>
        </div>
      )}

    </div>
  )
}

/* ── LOCAL: best/worst sellers with AI reasoning + area competitive pricing ── */
function LocalPanel({ data, fmt }: { data: ClimateData; fmt: (n: number) => string }) {
  const worstSellers = data.worst_sellers || []
  const localPrices = data.local_prices || []
  const topProduct = (data.top_products || [])[0] ?? null
  const sym = data.currency_symbol

  const hasWorst = worstSellers.length > 0
  const hasPrices = localPrices.length > 0
  const hasTop = !!topProduct

  if (!hasWorst && !hasPrices && !hasTop) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <div style={{ fontSize: 24, marginBottom: 8 }}>📊</div>
        <div style={{ fontSize: 12, color: 'var(--tx3)', lineHeight: 1.6 }}>
          Connect your POS or sales channels to see<br />local performance and area pricing data.
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* ── Best seller highlight ── */}
      {hasTop && (
        <div>
          <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--tx3)', marginBottom: 8 }}>
            Your best seller · last 30 days
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 12, background: `${GREEN}12`, border: `1px solid ${GREEN}33` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: 10, background: `${GREEN}20`, flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" />
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--tx)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {topProduct.product}
              </div>
              <div style={{ fontSize: 11, color: GREEN_INK, marginTop: 2 }}>
                {fmt(topProduct.revenue_7d)} revenue
                {topProduct.units_7d > 0 && ` · ${topProduct.units_7d} units sold`}
              </div>
            </div>
            <div style={{ fontSize: 9, fontWeight: 700, color: GREEN, background: `${GREEN}20`, padding: '3px 8px', borderRadius: 20, flexShrink: 0 }}>
              #1
            </div>
          </div>
        </div>
      )}

      {/* ── Worst sellers with AI reasoning ── */}
      {hasWorst && (
        <div>
          <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--tx3)', marginBottom: 8 }}>
            Underperforming · why &amp; what to do
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {worstSellers.map(w => (
              <div key={w.product} className="mc-row" style={{ padding: '11px 14px', borderRadius: 11, background: 'var(--ev, #f9fafb)', border: '1px solid var(--b)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: w.reason ? 8 : 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: 8, background: `${AMBER}18`, flexShrink: 0, marginTop: 1 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={AMBER} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" /><polyline points="16 17 22 17 22 11" />
                    </svg>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {w.product}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--tx3)', marginTop: 1 }}>
                      {w.revenue_7d > 0
                        ? `${fmt(w.revenue_7d)} · ${w.units_7d} units in 30 days`
                        : 'No sales in last 30 days'}
                      {w.your_price != null && ` · priced at ${sym}${w.your_price.toLocaleString()}`}
                    </div>
                  </div>
                </div>
                {w.reason && (
                  <div style={{ paddingLeft: 38 }}>
                    <div style={{ fontSize: 11, color: 'var(--tx2)', lineHeight: 1.55, marginBottom: 6 }}>
                      {w.reason}
                    </div>
                    {w.action && (
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, padding: '7px 10px', borderRadius: 8, background: `${INDIGO}0c`, border: `1px solid ${INDIGO}22` }}>
                        <span style={{ fontSize: 10 }}>💡</span>
                        <span style={{ fontSize: 11, fontWeight: 600, color: INDIGO, lineHeight: 1.45 }}>{w.action}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Local area pricing ── */}
      {hasPrices && (
        <div>
          <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--tx3)', marginBottom: 8 }}>
            Area market prices · {data.country}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {localPrices.map(lp => (
              <div key={lp.product} style={{ padding: '10px 13px', borderRadius: 10, background: 'var(--ev, #f9fafb)', border: '1px solid var(--b)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: lp.market_note ? 5 : 0 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lp.product}</span>
                  {lp.market_value && lp.market_value !== '—' && (
                    <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--tx)', flexShrink: 0 }}>~{lp.market_value}</span>
                  )}
                  {lp.your_price != null && (
                    <span style={{ fontSize: 10, color: 'var(--tx3)', flexShrink: 0 }}>you: {sym}{lp.your_price.toLocaleString()}</span>
                  )}
                </div>
                {lp.market_note && (
                  <div style={{ fontSize: 10, color: 'var(--tx3)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>
                    {lp.market_note}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 9, color: 'var(--tx3)', marginTop: 6, fontStyle: 'italic' }}>
            Area prices sourced from live web data · updated with market refresh
          </div>
        </div>
      )}

    </div>
  )
}

function Empty({ msg }: { msg: string }) {
  return <div style={{ padding: 18, textAlign: 'center', fontSize: 12, color: 'var(--tx3)' }}>{msg}</div>
}

// ── Supplier prompts — inline card asking where the user sources unknown products ──
// Saves to /api/supplier-context, then triggers a market climate refresh so
// the new source country feeds directly into signal selection.
function SupplierPrompts({ missing, wcInk, wcBorder, onSaved }: {
  missing: MissingContext[]
  wcInk: string
  wcBorder: string
  onSaved: () => void
}) {
  const [idx, setIdx] = useState(0)
  const [country, setCountry] = useState('')
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)
  const [flash, setFlash] = useState<{ ok: boolean; msg: string } | null>(null)

  if (done || missing.length === 0) return null
  const current = missing[idx]
  if (!current) return null

  const advance = () => {
    if (idx + 1 >= missing.length) { setDone(true); onSaved() }
    else { setIdx(i => i + 1); setCountry('') }
  }

  const save = async () => {
    if (!country.trim()) return
    setSaving(true)
    setFlash(null)
    try {
      const res = await fetch('/api/supplier-context', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ upsert: { product: current.product, sourceCountry: country.trim() } }),
      })
      if (!res.ok) throw new Error('save failed')
      setFlash({ ok: true, msg: `Saved — sourced from ${country.trim()}` })
      setTimeout(advance, 1000)
    } catch {
      setFlash({ ok: false, msg: 'Could not save, please try again' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ margin: '0 20px 12px', padding: '12px 14px', background: 'rgba(0,0,0,.06)', borderRadius: 12, border: `1px solid ${wcBorder}` }}>
      <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: wcInk, opacity: .6, marginBottom: 6 }}>
        Help us track your costs · {idx + 1} of {missing.length}
      </div>
      <div style={{ fontSize: 12, fontWeight: 700, color: wcInk, marginBottom: 8 }}>
        Where do you source your <em>{current.product}</em>?
      </div>
      {flash ? (
        <div style={{ fontSize: 12, fontWeight: 600, color: flash.ok ? '#166534' : '#991b1b', padding: '7px 0' }}>{flash.msg}</div>
      ) : (
      <div style={{ display: 'flex', gap: 6 }}>
        <input
          value={country}
          onChange={e => setCountry(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && save()}
          placeholder="e.g. UK, China, India, Ethiopia…"
          autoFocus
          style={{
            flex: 1, fontSize: 12, padding: '7px 10px', borderRadius: 8,
            border: `1.5px solid ${wcBorder}`, background: 'rgba(255,255,255,.7)',
            color: wcInk, fontFamily: 'inherit', outline: 'none',
          }}
        />
        <button
          onClick={save}
          disabled={saving || !country.trim()}
          style={{
            padding: '7px 14px', borderRadius: 8, border: 'none',
            background: wcInk, color: '#fff', fontSize: 12, fontWeight: 700,
            cursor: saving || !country.trim() ? 'default' : 'pointer',
            opacity: saving || !country.trim() ? .5 : 1, fontFamily: 'inherit',
          }}
        >
          {saving ? '…' : 'Save'}
        </button>
        <button
          onClick={advance}
          style={{ padding: '7px 10px', borderRadius: 8, border: `1px solid ${wcBorder}`, background: 'transparent', color: wcInk, fontSize: 11, cursor: 'pointer', opacity: .6, fontFamily: 'inherit' }}
        >
          Skip
        </button>
      </div>
      )}
    </div>
  )
}
