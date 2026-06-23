'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useLang } from '@/components/LanguageProvider'
import DailyBrief from '@/components/intelligence/DailyBrief'
import AnomalyFeed from '@/components/intelligence/AnomalyFeed'
import DecisionMemory from '@/components/intelligence/DecisionMemory'
import TeamPanel from '@/components/intelligence/TeamPanel'
import LogisticsPulseCard from '@/components/LogisticsPulseCard'
import CourierPulseCard from '@/components/intelligence/CourierPulseCard'
import BusinessMemory from '@/components/intelligence/BusinessMemory'
import FeatureGate from '@/components/gates/FeatureGate'
import { usePlan } from '@/lib/hooks/usePlan'
import KpiStrip from '@/components/intelligence/KpiStrip'
import MiniTrendChart from '@/components/intelligence/MiniTrendChart'
import IntegrationHub from '@/components/intelligence/IntegrationHub'
import CfoDashboard from '@/components/cfo/CfoDashboard'
import RevenueWaterfall from '@/components/intelligence/RevenueWaterfall'
import DecisionTimeline from '@/components/intelligence/DecisionTimeline'
import TopProducts from '@/components/intelligence/TopProducts'
import PosPulse from '@/components/intelligence/PosPulse'
import DailyActions from '@/components/intelligence/DailyActions'
import CrossSectorIntel from '@/components/intelligence/CrossSectorIntel'
import HealthTimeMachine from '@/components/intelligence/HealthTimeMachine'

export default function IntelligencePage() {
  const router = useRouter()
  const { tc } = useLang()
  const { planId, loading: planLoading } = usePlan()

  // Core state
  const [tab, setTab] = useState('overview')
  const [health, setHealth] = useState<any>(null)
  const [anomalies, setAnomalies] = useState<any[]>([])
  const [loadingHealth, setLoadingHealth] = useState(true)
  const [scoreHistory, setScoreHistory] = useState<any[]>([])
  const [connectedCount, setConnectedCount] = useState(0)
  const [totalSources] = useState(31)
  const [isMobile, setIsMobile] = useState(false)

  // Time-sensitive state (must be client-only to avoid hydration mismatch)
  const [nowHour, setNowHour] = useState<number | null>(null)
  const [nowDateStr, setNowDateStr] = useState('')

  // Profile (for personalised greeting)
  const [greetingName, setGreetingName] = useState('')

  // Overview summary state
  const [cfoSnapshot, setCfoSnapshot] = useState<any>(null)
  const [logisticsHealth, setLogisticsHealth] = useState<any>(null)
  const [courierSummary, setCourierSummary] = useState<any>(null)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Populate time-sensitive greeting/date after mount — avoids SSR/client hydration mismatch
  useEffect(() => {
    const d = new Date()
    setNowHour(d.getHours())
    setNowDateStr(d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }))
  }, [])

  // Decisions state (for timeline)
  const [decisions, setDecisions] = useState<any[]>([])
  const [decisionsLoaded, setDecisionsLoaded] = useState(false)
  const [decisionView, setDecisionView] = useState<'timeline' | 'cards'>('timeline')

  // Sparring state
  const [sparringInput, setSparringInput] = useState('')
  const [sparringResponse, setSparringResponse] = useState('')
  const [sparringSending, setSparringSending] = useState(false)

  // Contextual widget state
  const [waterfallDrill, setWaterfallDrill] = useState<string | null>(null)
  const [trendForceOpen, setTrendForceOpen] = useState(false)

  // Market Intelligence state
  const [mktQuery, setMktQuery] = useState('')
  const [mktRegion, setMktRegion] = useState('')
  const [mktChannel, setMktChannel] = useState('')
  const [mktLoading, setMktLoading] = useState(false)
  const [mktResult, setMktResult] = useState<any>(null)

  const askAskBiz = useCallback((prompt: string) => {
    router.push('/ask')
    setTimeout(() => window.dispatchEvent(new CustomEvent('askbiz:send', { detail: prompt })), 400)
  }, [router])

  // Restore tab from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const t = params.get('tab')
    const validTabs = ['overview','anomalies','decisions','team','sparring','shipments','courier','memory','market','connections','cfo','actions']
    if (t && validTabs.includes(t)) setTab(t)
  }, [])

  // Fetch profile for greeting name
  useEffect(() => {
    fetch('/api/profile')
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d) setGreetingName(d.first_name || d.business_name || '')
      })
      .catch(() => {})
  }, [])

  // Fetch health, anomalies, history
  useEffect(() => {
    fetch('/api/health')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) {
          if (data.latest) setHealth(data.latest)
          setAnomalies(data.anomalies || [])
          setScoreHistory(data.history || [])
        }
      })
      .finally(() => setLoadingHealth(false))
  }, [])

  // Fetch CFO snapshot for overview alerts
  useEffect(() => {
    fetch('/api/cfo/snapshot?period=this_month')
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setCfoSnapshot(d) })
      .catch(() => {})
  }, [])

  // Fetch logistics health for overview
  useEffect(() => {
    fetch('/api/logistics?view=health')
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.health) setLogisticsHealth(d.health) })
      .catch(() => {})
  }, [])

  // Fetch courier summary for overview
  useEffect(() => {
    Promise.all([
      fetch('/api/pos/parcels?limit=200').then(r => r.json()).catch(() => ({ parcels: [] })),
      fetch('/api/pos/trucks').then(r => r.json()).catch(() => ({ trucks: [] })),
    ]).then(([pData, tData]) => {
      const parcels = pData.parcels || []
      const trucks = tData.trucks || []
      const inTransit = parcels.filter((p: any) => ['in_transit', 'out_for_delivery'].includes(p.status)).length
      const delivered = parcels.filter((p: any) => ['delivered', 'collected'].includes(p.status)).length
      const failed = parcels.filter((p: any) => p.status === 'failed_delivery').length
      const completedTotal = delivered + failed
      const now = Date.now()
      const stuck = parcels.filter((p: any) => ['received', 'at_branch'].includes(p.status) && (now - new Date(p.created_at).getTime()) > 48 * 3600000).length
      setCourierSummary({
        total: parcels.length,
        inTransit,
        delivered,
        failed,
        deliveryRate: completedTotal > 0 ? Math.round((delivered / completedTotal) * 100) : 0,
        stuck,
        trucksActive: trucks.filter((t: any) => t.status === 'in_transit').length,
        trucksTotal: trucks.length,
      })
    })
  }, [])

  // Fetch connected sources count (external sources + built-in POS)
  useEffect(() => {
    Promise.all([
      fetch('/api/sources').then(r => r.ok ? r.json() : []).catch(() => []),
      fetch('/api/pos/transactions?limit=1').then(r => r.ok ? r.json() : null).catch(() => null),
    ]).then(([sources, txns]) => {
      const externalCount = Array.isArray(sources) ? sources.length : 0
      const hasPosData = txns && ((Array.isArray(txns) && txns.length > 0) || (txns.transactions && txns.transactions.length > 0))
      setConnectedCount(externalCount + (hasPosData ? 1 : 0))
    })
  }, [])

  // Fetch decisions when decisions tab is active (lazy)
  useEffect(() => {
    if ((tab === 'decisions') && !decisionsLoaded) {
      fetch('/api/decisions')
        .then(r => r.ok ? r.json() : [])
        .then(data => {
          setDecisions(Array.isArray(data) ? data : (data?.decisions || []))
          setDecisionsLoaded(true)
        })
        .catch(() => setDecisionsLoaded(true))
    }
  }, [tab, decisionsLoaded])

  const dismissAnomaly = async (id: string) => {
    await fetch('/api/health/anomaly', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, seen: true }) })
    setAnomalies(prev => prev.filter(a => a.id !== id))
  }

  const askSparring = async () => {
    if (!sparringInput.trim()) return
    setSparringSending(true)
    setSparringResponse('')
    try {
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: [{ role: 'user', content: sparringInput }], streaming: false }) })
      const data = await res.json()
      setSparringResponse(data.answer_text || tc('intelligence.sparring_no_response'))
    } catch {
      setSparringResponse(tc('intelligence.sparring_could_not_connect'))
    } finally {
      setSparringSending(false)
    }
  }

  const searchMarket = async () => {
    if (!mktQuery.trim()) return
    setMktLoading(true)
    setMktResult(null)
    try {
      const params = new URLSearchParams({ q: mktQuery.trim() })
      if (mktRegion) params.set('region', mktRegion)
      if (mktChannel) params.set('channel', mktChannel)
      const res = await fetch(`/api/market/products?${params}`)
      setMktResult(await res.json())
    } catch {
      setMktResult({ error: tc('intelligence.market_could_not_load') })
    } finally {
      setMktLoading(false)
    }
  }

  // Derived values
  const criticalCount   = anomalies.filter(a => a.severity === 'critical').length
  const warningCount    = anomalies.filter(a => a.severity === 'warning').length
  const scoreHistoryItems = scoreHistory.slice(-30)
  const scoreDelta = scoreHistoryItems.length > 1
    ? Math.round((Number(scoreHistoryItems[scoreHistoryItems.length - 1]?.score) || 0) - (Number(scoreHistoryItems[0]?.score) || 0))
    : 0

  // Plan gates
  const canAlerts    = !planLoading && (planId === 'growth' || planId === 'business')
  const canDecisions = !planLoading && planId === 'business'
  const canCfo       = !planLoading && planId === 'business'

  const tabs = [
    { id: 'overview',     label: tc('intelligence.tab_overview') },
    { id: 'cfo',          label: tc('intelligence.tab_cfo'),       locked: !canCfo },
    { id: 'anomalies',    label: tc('intelligence.tab_anomalies'), badge: canAlerts ? (criticalCount + warningCount) : 0, locked: !canAlerts },
    { id: 'decisions',    label: tc('intelligence.tab_decisions'), locked: !canDecisions },
    { id: 'team',         label: tc('intelligence.tab_team') },
    { id: 'sparring',     label: tc('intelligence.tab_sparring') },
    { id: 'shipments',    label: tc('intelligence.tab_shipments') },
    { id: 'courier',      label: tc('intelligence.tab_courier') },
    { id: 'memory',       label: tc('intelligence.tab_memory') },
    { id: 'market',       label: tc('intelligence.tab_market') },
    { id: 'connections',  label: tc('intelligence.tab_connections') },
    { id: 'actions',      label: tc('intelligence.tab_actions') },
  ]

  const sparringPrompts = [
    tc('intelligence.sparring_prompt_0'),
    tc('intelligence.sparring_prompt_1'),
    tc('intelligence.sparring_prompt_2'),
    tc('intelligence.sparring_prompt_3'),
  ]

  // Sparkline data from score history
  const scoreSparkline = scoreHistoryItems.map(h => Number(h.score) || 0)

  // KPI strip cards
  const kpiCards = [
    {
      label: tc('intelligence.kpi_health_label'),
      value: health?.score != null ? health.score : '—',
      sub: health?.label ?? (loadingHealth ? tc('intelligence.kpi_health_loading') : tc('intelligence.kpi_health_empty')),
      trend: scoreDelta > 0 ? 'up' as const : scoreDelta < 0 ? 'down' as const : null,
      trendLabel: scoreDelta !== 0 ? tc('intelligence.kpi_health_trend', { delta: `${scoreDelta > 0 ? '+' : ''}${scoreDelta}` }) : undefined,
      accentColor: health?.score != null
        ? (health.score >= 65 ? '#22C55E' : health.score >= 45 ? '#F59E0B' : '#EF4444')
        : undefined,
      onClick: () => {
        setTab('overview')
        setTimeout(() => document.getElementById('health-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
      },
      sparkline: scoreSparkline.length > 1 ? scoreSparkline : undefined,
    },
    {
      label: tc('intelligence.kpi_alerts_label'),
      value: criticalCount + warningCount || '—',
      sub: criticalCount > 0 ? tc('intelligence.kpi_alerts_critical', { n: criticalCount }) : warningCount > 0 ? tc('intelligence.kpi_alerts_warnings', { n: warningCount }) : tc('intelligence.kpi_alerts_clear'),
      accentColor: criticalCount > 0 ? '#EF4444' : warningCount > 0 ? '#F59E0B' : '#22C55E',
      onClick: () => setTab('anomalies'),
    },
    {
      label: tc('intelligence.kpi_trend_label'),
      value: scoreDelta === 0 ? '—' : `${scoreDelta > 0 ? '+' : ''}${scoreDelta}`,
      sub: scoreHistoryItems.length > 1 ? tc('intelligence.kpi_trend_sub') : tc('intelligence.kpi_trend_empty'),
      trend: scoreDelta > 0 ? 'up' as const : scoreDelta < 0 ? 'down' as const : 'flat' as const,
      trendLabel: undefined,
      accentColor: scoreDelta > 0 ? '#22C55E' : scoreDelta < 0 ? '#EF4444' : undefined,
      sparkline: scoreSparkline.length > 1 ? scoreSparkline : undefined,
      onClick: () => setTrendForceOpen(true),
    },
    {
      label: tc('intelligence.kpi_sources_label'),
      value: connectedCount || '—',
      sub: connectedCount === 0 ? tc('intelligence.kpi_sources_none') : connectedCount === 1 ? tc('intelligence.kpi_sources_pos') : tc('intelligence.kpi_sources_live', { n: connectedCount }),
      accentColor: connectedCount > 0 ? '#6366F1' : undefined,
      onClick: () => setTab('connections'),
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }} className="intelligence-shell">

      {/* ── Header + tabs (CSS makes this scroll on mobile) ── */}
      <div style={{ flexShrink: 0, padding: '16px 20px 0', borderBottom: '1px solid var(--b)', background: 'var(--sf)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-sora)', fontSize: 16, fontWeight: 700 }}>{tc('intelligence.header_title')}</div>
              <div style={{ fontSize: 11, color: 'var(--tx3)' }}>{tc('intelligence.header_subtitle')}</div>
            </div>
            {criticalCount > 0 && (
              <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', background: '#EF4444', borderRadius: 9999, padding: '2px 8px' }}>
                {tc('intelligence.critical_badge', { n: criticalCount })}
              </span>
            )}
          </div>
        </div>

        {/* Tab bar */}
        <div className="tab-strip">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                padding: '8px 12px',
                border: 'none',
                background: 'transparent',
                fontSize: 12,
                fontWeight: tab === t.id ? 600 : 400,
                color: tab === t.id ? '#6366F1' : 'var(--tx3)',
                borderBottom: tab === t.id ? '2px solid #6366F1' : '2px solid transparent',
                cursor: 'pointer',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                whiteSpace: 'nowrap',
                opacity: t.locked ? 0.6 : 1,
                transition: 'color 150ms',
                flexShrink: 0,
              }}
            >
              {t.label}
              {t.locked && !planLoading && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              )}
              {t.badge ? (
                <span style={{ fontSize: 10, fontWeight: 700, background: '#EF4444', color: '#fff', borderRadius: 9999, padding: '1px 6px' }}>
                  {t.badge}
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab content ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '16px 16px 24px' : '20px' }}>

        {/* ─── OVERVIEW ─── */}
        {tab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 760 }}>

            {/* ── Greeting (lightweight, not a card) ── */}
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--tx)', fontFamily: 'var(--font-sora, inherit)', lineHeight: 1.3 }}>
                  {(() => {
                  if (nowHour === null) return ''
                  const key = nowHour < 12 ? 'intelligence.greeting_morning' : nowHour < 17 ? 'intelligence.greeting_afternoon' : 'intelligence.greeting_evening'
                  return tc(key, { name: greetingName }).trimEnd()
                })()}
                </div>
                <div style={{ fontSize: 12, color: 'var(--tx3)', marginTop: 2 }}>
                  {nowDateStr}
                </div>
              </div>
            </div>

            {/* ── Hero KPI section ── */}
            <KpiStrip cards={kpiCards} />

            {/* ── Daily brief ── */}
            <DailyBrief onAsk={askAskBiz}/>

            {/* ── Today's Actions (compact — max 3) ── */}
            <DailyActions onAsk={askAskBiz} limit={3} onViewAll={() => setTab('actions')}/>

            {/* ── Financial Summary ── */}
            {cfoSnapshot?.totals && (
              <div style={{ padding: '16px 18px', borderRadius: 16, border: '1px solid var(--b)', background: 'linear-gradient(180deg, var(--sf) 0%, rgba(99,102,241,.02) 100%)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 3, height: 14, borderRadius: 2, background: '#10B981' }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)', letterSpacing: '.02em' }}>{tc('intelligence.financial_summary')}</span>
                  </div>
                  <button onClick={() => setTab('cfo')} style={{ fontSize: 11, color: '#6366F1', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>
                    {tc('intelligence.open_cfo')}
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10 }}>
                  {[
                    { label: tc('intelligence.fin_revenue'), value: cfoSnapshot.totals.revenue, color: '#22C55E' },
                    { label: tc('intelligence.fin_gross_profit'), value: cfoSnapshot.totals.gross_profit, color: '#6366F1' },
                    { label: tc('intelligence.fin_net_profit'), value: cfoSnapshot.totals.net_profit, color: cfoSnapshot.totals.net_profit >= 0 ? '#10B981' : '#EF4444' },
                    { label: tc('intelligence.fin_gross_margin'), value: null, pct: cfoSnapshot.totals.gross_margin_pct, color: '#F59E0B' },
                    { label: tc('intelligence.fin_net_margin'), value: null, pct: cfoSnapshot.totals.net_margin_pct, color: cfoSnapshot.totals.net_margin_pct >= 0 ? '#10B981' : '#EF4444' },
                  ].map((item, i) => {
                    const sym = cfoSnapshot.currency_symbol || 'KSh'
                    const fmtVal = item.value != null
                      ? (Math.abs(item.value) >= 1000 ? `${sym}${(item.value / 1000).toFixed(1)}K` : `${sym}${Math.round(item.value).toLocaleString()}`)
                      : `${item.pct != null ? item.pct.toFixed(0) : '—'}%`
                    return (
                      <div key={i} style={{ padding: '10px 12px', borderRadius: 10, background: 'var(--sf)', border: '1px solid var(--b)', textAlign: 'center' }}>
                        <div style={{ fontSize: 11, color: 'var(--tx3)', marginBottom: 4 }}>{item.label}</div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: item.color, fontFamily: 'var(--font-sora, inherit)' }}>{fmtVal}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* ── Shipping & Delivery ── */}
            {(logisticsHealth || courierSummary) && (
              <div style={{ padding: '16px 18px', borderRadius: 16, border: '1px solid var(--b)', background: 'linear-gradient(180deg, var(--sf) 0%, rgba(6,182,212,.02) 100%)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <div style={{ width: 3, height: 14, borderRadius: 2, background: '#0891B2' }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)', letterSpacing: '.02em' }}>{tc('intelligence.shipping_delivery')}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {/* Shipments card */}
                  {logisticsHealth && (
                    <button
                      onClick={() => setTab('shipments')}
                      style={{
                        padding: '14px', borderRadius: 12, border: '1px solid var(--b)', background: 'var(--sf)',
                        textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', transition: 'box-shadow 200ms',
                      }}
                      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,.06)'}
                      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <span style={{ fontSize: 16 }}>📦</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)' }}>{tc('intelligence.shipments_card_title')}</span>
                        <span style={{
                          fontSize: 10, fontWeight: 600, padding: '1px 6px', borderRadius: 9999,
                          color: logisticsHealth.color === 'green' ? '#16a34a' : logisticsHealth.color === 'red' ? '#dc2626' : '#d97706',
                          background: logisticsHealth.color === 'green' ? 'rgba(34,197,94,.1)' : logisticsHealth.color === 'red' ? 'rgba(239,68,68,.1)' : 'rgba(245,158,11,.1)',
                        }}>{logisticsHealth.label}</span>
                      </div>
                      <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--tx)', fontFamily: 'var(--font-sora, inherit)', marginBottom: 4 }}>{logisticsHealth.score}<span style={{ fontSize: 11, color: 'var(--tx3)', fontWeight: 400 }}>/100</span></div>
                      <div style={{ fontSize: 11, color: 'var(--tx3)', lineHeight: 1.4 }}>
                        {logisticsHealth.active_shipments > 0 ? tc('intelligence.shipments_active', { active: logisticsHealth.active_shipments, transit: logisticsHealth.in_transit || 0 }) : tc('intelligence.shipments_none')}
                      </div>
                    </button>
                  )}
                  {/* Courier card */}
                  {courierSummary && courierSummary.total > 0 && (
                    <button
                      onClick={() => setTab('courier')}
                      style={{
                        padding: '14px', borderRadius: 12, border: '1px solid var(--b)', background: 'var(--sf)',
                        textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', transition: 'box-shadow 200ms',
                      }}
                      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,.06)'}
                      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <span style={{ fontSize: 16 }}>🚛</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)' }}>{tc('intelligence.courier_card_title')}</span>
                        {courierSummary.stuck > 0 && (
                          <span style={{ fontSize: 10, fontWeight: 600, padding: '1px 6px', borderRadius: 9999, color: '#EF4444', background: 'rgba(239,68,68,.1)' }}>
                            {tc('intelligence.courier_stuck', { n: courierSummary.stuck })}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--tx)', fontFamily: 'var(--font-sora, inherit)', marginBottom: 4 }}>{courierSummary.deliveryRate}%<span style={{ fontSize: 11, color: 'var(--tx3)', fontWeight: 400 }}>{tc('intelligence.courier_delivery_rate')}</span></div>
                      <div style={{ fontSize: 11, color: 'var(--tx3)', lineHeight: 1.4 }}>
                        {tc('intelligence.courier_summary_line', { transit: courierSummary.inTransit, delivered: courierSummary.delivered })}
                      </div>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* ── Data Connection Health ── */}
            {connectedCount < totalSources && connectedCount < 5 && (
              <button
                onClick={() => setTab('connections')}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, width: '100%',
                  padding: '12px 16px', borderRadius: 12,
                  background: 'rgba(99,102,241,.04)', border: '1px solid rgba(99,102,241,.12)',
                  cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
                }}
              >
                <span style={{ fontSize: 18 }}>🔗</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx)', marginBottom: 2 }}>
                    {tc('intelligence.connect_more_title')}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--tx3)' }}>
                    {tc('intelligence.connect_more_sub', { connected: connectedCount, total: totalSources })}
                  </div>
                </div>
                <span style={{ fontSize: 11, color: '#6366F1', fontWeight: 600, whiteSpace: 'nowrap' }}>{tc('intelligence.connect_cta')}</span>
              </button>
            )}

            {/* ── Health Time Machine ── */}
            <div id="health-section">
              <HealthTimeMachine onAsk={askAskBiz}/>
            </div>

            {/* ── Analytics section ── */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 3, height: 14, borderRadius: 2, background: '#6366F1' }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)', letterSpacing: '.02em' }}>{tc('intelligence.analytics_title')}</span>
                </div>
                <span style={{ fontSize: 11, color: 'var(--tx3)' }}>{tc('intelligence.analytics_last_30')}</span>
              </div>

              {/* Row 1: Health Trend + Revenue Waterfall */}
              {scoreHistoryItems.length > 1 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 12, marginBottom: 12, alignItems: 'start' }}>
                  <div style={{ minWidth: 0, overflow: 'hidden' }}>
                    <MiniTrendChart history={scoreHistoryItems} label={tc('intelligence.health_trend_label')} height={100} onAsk={askAskBiz} forceExpanded={trendForceOpen} onClose={() => setTrendForceOpen(false)}/>
                  </div>
                  <div style={{ minWidth: 0, overflow: 'hidden' }}>
                    <RevenueWaterfall health={health} onAsk={askAskBiz} onDrillChange={setWaterfallDrill}/>
                  </div>
                </div>
              )}
              {scoreHistoryItems.length <= 1 && (
                <div style={{ marginBottom: 12 }}>
                  <RevenueWaterfall health={health} onAsk={askAskBiz} onDrillChange={setWaterfallDrill}/>
                </div>
              )}

              {/* Row 2: Top Products + POS Pulse (Sales/Stock) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 12, alignItems: 'start' }}>
                <div style={{
                  borderRadius: 12, minWidth: 0, overflow: 'hidden',
                  transition: 'box-shadow 300ms ease, border-color 300ms ease',
                  boxShadow: waterfallDrill && ['Revenue', 'COGS', 'Gross Profit'].includes(waterfallDrill) ? '0 0 0 2px #22C55E40' : 'none',
                }}>
                  <TopProducts onAsk={askAskBiz} />
                </div>
                <div style={{
                  borderRadius: 12, minWidth: 0, overflow: 'hidden',
                  transition: 'box-shadow 300ms ease, border-color 300ms ease',
                  boxShadow: waterfallDrill === 'Stock Cost' ? '0 0 0 2px #6366F140' : 'none',
                }}>
                  <PosPulse onAsk={askAskBiz} />
                </div>
              </div>

              {/* Contextual hint */}
              {waterfallDrill && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 14px', borderRadius: 10,
                  background: 'rgba(99,102,241,.05)', border: '1px solid rgba(99,102,241,.12)',
                  marginTop: 10, fontSize: 11, color: '#6366F1', fontWeight: 500,
                  animation: 'fadeIn 200ms ease',
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  {waterfallDrill === 'Revenue' && tc('intelligence.drill_revenue')}
                  {waterfallDrill === 'COGS' && tc('intelligence.drill_cogs')}
                  {waterfallDrill === 'Gross Profit' && tc('intelligence.drill_gross_profit')}
                  {waterfallDrill === 'Stock Cost' && tc('intelligence.drill_stock_cost')}
                  {waterfallDrill === 'Operating' && tc('intelligence.drill_operating')}
                  {waterfallDrill === 'Net Margin' && tc('intelligence.drill_net_margin')}
                </div>
              )}
            </div>

            {/* ── Active alerts preview ── */}
            {anomalies.length > 0 && (
              <div style={{ padding: '16px 18px', borderRadius: 16, border: '1px solid var(--b)', background: 'linear-gradient(180deg, var(--sf) 0%, rgba(239,68,68,.02) 100%)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 3, height: 14, borderRadius: 2, background: '#EF4444' }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)', letterSpacing: '.02em' }}>{tc('intelligence.active_alerts')}</span>
                    <span style={{
                      fontSize: 10, fontWeight: 700, color: '#EF4444',
                      background: 'rgba(239,68,68,.1)', borderRadius: 6, padding: '1px 6px',
                    }}>{anomalies.length}</span>
                  </div>
                  <button
                    onClick={() => setTab('anomalies')}
                    style={{ fontSize: 11, color: '#6366F1', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}
                  >
                    {tc('intelligence.view_all')}
                  </button>
                </div>
                <AnomalyFeed anomalies={anomalies.slice(0, 3)} onAsk={askAskBiz} compact/>
              </div>
            )}

            {/* ── Command palette: quick actions ── */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div style={{ width: 3, height: 14, borderRadius: 2, background: '#8B5CF6' }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)', letterSpacing: '.02em' }}>{tc('intelligence.quick_actions')}</span>
              </div>

              {/* Top row: primary actions (larger) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                {[
                  {
                    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
                    title: tc('intelligence.qa_ask_title'),
                    sub: tc('intelligence.qa_ask_sub'),
                    gradient: 'linear-gradient(135deg, rgba(99,102,241,.08) 0%, rgba(99,102,241,.02) 100%)',
                    border: 'rgba(99,102,241,.18)',
                    action: () => askAskBiz('What is my best performing product by margin right now?'),
                  },
                  {
                    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
                    title: tc('intelligence.qa_whatif_title'),
                    sub: tc('intelligence.qa_whatif_sub'),
                    gradient: 'linear-gradient(135deg, rgba(245,158,11,.08) 0%, rgba(245,158,11,.02) 100%)',
                    border: 'rgba(245,158,11,.18)',
                    action: () => setTab('sparring'),
                  },
                ].map((card, i) => (
                  <button
                    key={i}
                    onClick={card.action}
                    style={{
                      padding: '18px 16px',
                      borderRadius: 14,
                      border: `1px solid ${card.border}`,
                      background: card.gradient,
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      transition: 'box-shadow 200ms, transform 200ms',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 14,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none' }}
                  >
                    <div style={{
                      width: 40, height: 40, borderRadius: 10,
                      background: 'var(--sf)',
                      border: `1px solid ${card.border}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      {card.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--tx)', marginBottom: 3 }}>{card.title}</div>
                      <div style={{ fontSize: 11, color: 'var(--tx3)', lineHeight: 1.4 }}>{card.sub}</div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Bottom row: secondary actions (compact grid) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                {[
                  { emoji: '📦', title: tc('intelligence.qa_ships_title'), sub: tc('intelligence.qa_ships_sub'), color: 'rgba(34,197,94,.06)', border: 'rgba(34,197,94,.15)', action: () => setTab('shipments') },
                  { emoji: '🚛', title: tc('intelligence.qa_courier_title'), sub: tc('intelligence.qa_courier_sub'), color: 'rgba(8,145,178,.06)', border: 'rgba(8,145,178,.15)', action: () => setTab('courier') },
                  { emoji: '🌍', title: tc('intelligence.qa_market_title'), sub: tc('intelligence.qa_market_sub'), color: 'rgba(208,138,89,.06)', border: 'rgba(208,138,89,.15)', action: () => setTab('market') },
                  { emoji: '🏛️', title: tc('intelligence.qa_cfo_title'), sub: tc('intelligence.qa_cfo_sub'), color: 'rgba(99,102,241,.06)', border: 'rgba(99,102,241,.15)', action: () => setTab('cfo') },
                ].map((card, i) => (
                  <button
                    key={i}
                    onClick={card.action}
                    style={{
                      padding: '14px 12px',
                      borderRadius: 12,
                      border: `1px solid ${card.border}`,
                      background: card.color,
                      textAlign: 'center',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      transition: 'box-shadow 200ms, transform 200ms',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.07)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none' }}
                  >
                    <div style={{ fontSize: 20, marginBottom: 6 }}>{card.emoji}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)', marginBottom: 2 }}>{card.title}</div>
                    <div style={{ fontSize: 10, color: 'var(--tx3)' }}>{card.sub}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── ALERTS ─── */}
        {tab === 'anomalies' && (
          <div style={{ maxWidth: 720 }}>
            <FeatureGate planId={planId} feature="anomaly_alerts">
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--tx)', marginBottom: 4 }}>{tc('intelligence.alerts_heading')}</div>
                <div style={{ fontSize: 12, color: 'var(--tx3)' }}>{tc('intelligence.alerts_sub')}</div>
              </div>
              <AnomalyFeed anomalies={anomalies} onAsk={askAskBiz} onDismiss={dismissAnomaly}/>
            </FeatureGate>
          </div>
        )}

        {/* ─── DECISIONS ─── */}
        {tab === 'decisions' && (
          <div style={{ maxWidth: 720 }}>
            <FeatureGate planId={planId} feature="decision_memory">
              {/* View toggle */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-sora)', fontSize: 16, fontWeight: 700, marginBottom: 3 }}>{tc('intelligence.decisions_heading')}</div>
                  <div style={{ fontSize: 12, color: 'var(--tx3)' }}>{tc('intelligence.decisions_sub')}</div>
                </div>
                <div style={{ display: 'flex', borderRadius: 9999, border: '1px solid var(--b)', overflow: 'hidden', background: 'var(--sf)' }}>
                  {(['timeline', 'cards'] as const).map(v => (
                    <button
                      key={v}
                      onClick={() => setDecisionView(v)}
                      style={{
                        padding: '6px 14px',
                        border: 'none',
                        background: decisionView === v ? '#6366F1' : 'transparent',
                        color: decisionView === v ? '#fff' : 'var(--tx3)',
                        fontSize: 12,
                        fontWeight: decisionView === v ? 600 : 400,
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        transition: 'all 150ms',
                      }}
                    >
                      {v === 'timeline' ? tc('intelligence.decisions_view_timeline') : tc('intelligence.decisions_view_cards')}
                    </button>
                  ))}
                </div>
              </div>

              {decisionView === 'timeline' ? (
                decisionsLoaded
                  ? <DecisionTimeline decisions={decisions} onAsk={askAskBiz}/>
                  : <div style={{ height: 200, borderRadius: 14, background: 'var(--ev)', animation: 'shimmer 1.4s infinite' }}/>
              ) : (
                <DecisionMemory onAsk={askAskBiz}/>
              )}
            </FeatureGate>
          </div>
        )}

        {/* ─── TEAM ─── */}
        {tab === 'team' && <div style={{ maxWidth: 720 }}><TeamPanel/></div>}

        {/* ─── WHAT I KNOW ─── */}
        {tab === 'memory' && <div style={{ maxWidth: 720 }}><BusinessMemory onAsk={askAskBiz}/></div>}

        {/* ─── SHIPMENTS ─── */}
        {tab === 'shipments' && (
          <div style={{ maxWidth: 720 }}>
            <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
              <div>
                <div style={{ fontFamily: 'var(--font-sora)', fontSize: 16, fontWeight: 700, marginBottom: 3 }}>{tc('intelligence.shipments_heading')}</div>
                <div style={{ fontSize: 12, color: 'var(--tx3)' }}>{tc('intelligence.shipments_sub')}</div>
              </div>
              <button
                onClick={() => router.push('/shipments')}
                style={{ padding: '8px 16px', borderRadius: 9999, border: 'none', background: '#6366F1', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
              >
                {tc('intelligence.shipments_open_full')}
              </button>
            </div>
            <LogisticsPulseCard />
            <div style={{ marginTop: 16, padding: '14px 16px', borderRadius: 12, background: 'var(--sf)', border: '1px solid var(--b)' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 12 }}>{tc('intelligence.quick_actions')}</div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[
                  { label: tc('intelligence.shipments_qa_add'), action: () => router.push('/shipments') },
                  { label: tc('intelligence.shipments_qa_at_risk'), action: () => router.push('/shipments?filter=at_risk') },
                  { label: tc('intelligence.shipments_qa_delay'), action: () => askAskBiz('Which of my shipments are delayed and what is the financial impact?') },
                  { label: tc('intelligence.shipments_qa_supplier'), action: () => askAskBiz('Which supplier has the best delivery reliability based on my shipment history?') },
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={item.action}
                    style={{ padding: '8px 14px', borderRadius: 9999, border: '1px solid var(--b)', background: 'var(--bg)', color: 'var(--tx2)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 150ms' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366F1'; e.currentTarget.style.color = '#6366F1' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--b)'; e.currentTarget.style.color = 'var(--tx2)' }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── COURIER ─── */}
        {tab === 'courier' && (
          <div style={{ maxWidth: 720 }}>
            <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
              <div>
                <div style={{ fontFamily: 'var(--font-sora)', fontSize: 16, fontWeight: 700, marginBottom: 3 }}>{tc('intelligence.courier_heading')}</div>
                <div style={{ fontSize: 12, color: 'var(--tx3)' }}>{tc('intelligence.courier_sub')}</div>
              </div>
            </div>
            <CourierPulseCard onAsk={askAskBiz} />
            <div style={{ marginTop: 16, padding: '14px 16px', borderRadius: 12, background: 'var(--sf)', border: '1px solid var(--b)' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 12 }}>{tc('intelligence.quick_actions')}</div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[
                  { label: tc('intelligence.courier_qa_failures'), action: () => askAskBiz('Analyse our delivery failures — what are the top reasons and which routes are worst?') },
                  { label: tc('intelligence.courier_qa_revenue_risk'), action: () => askAskBiz('How much courier revenue is unpaid? Which parcels should we chase first?') },
                  { label: tc('intelligence.courier_qa_fleet'), action: () => askAskBiz('How well are we using our truck fleet? Any bottlenecks or underutilized vehicles?') },
                  { label: tc('intelligence.courier_qa_routes'), action: () => askAskBiz('Which courier routes are most profitable and which have the highest failure rate?') },
                  { label: tc('intelligence.courier_qa_stuck'), action: () => askAskBiz('Which parcels have been at branch for over 48 hours and need urgent dispatch?') },
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={item.action}
                    style={{ padding: '8px 14px', borderRadius: 9999, border: '1px solid var(--b)', background: 'var(--bg)', color: 'var(--tx2)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 150ms' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#0891b2'; e.currentTarget.style.color = '#0891b2' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--b)'; e.currentTarget.style.color = 'var(--tx2)' }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── ASK ASKBIZ / SPARRING ─── */}
        {tab === 'sparring' && (
          <div style={{ maxWidth: 720 }}>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: 'var(--font-sora)', fontSize: 16, fontWeight: 700, marginBottom: 3 }}>{tc('intelligence.sparring_heading')}</div>
              <div style={{ fontSize: 12, color: 'var(--tx3)' }}>{tc('intelligence.sparring_sub')}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16, padding: '16px', borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)' }}>
              <textarea
                value={sparringInput}
                onChange={e => setSparringInput(e.target.value)}
                placeholder={tc('intelligence.sparring_placeholder')}
                rows={3}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--b)', background: 'var(--bg)', color: 'var(--tx)', fontSize: 14, fontFamily: 'inherit', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
              />
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button
                  onClick={askSparring}
                  disabled={sparringSending || !sparringInput.trim()}
                  style={{ padding: '9px 20px', borderRadius: 10, border: 'none', background: '#6366F1', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', opacity: sparringSending || !sparringInput.trim() ? 0.5 : 1 }}
                >
                  {sparringSending ? tc('intelligence.sparring_thinking') : tc('intelligence.sparring_ask')}
                </button>
              </div>
            </div>
            {/* Prompt suggestions */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
              {sparringPrompts.map((p, i) => (
                <button
                  key={i}
                  onClick={() => setSparringInput(p)}
                  style={{ padding: '6px 12px', borderRadius: 9999, border: '1px solid var(--b)', background: 'var(--sf)', color: 'var(--tx3)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  {p}
                </button>
              ))}
            </div>
            {sparringResponse && (
              <div style={{ padding: '16px', borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', fontSize: 13, color: 'var(--tx2)', lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>
                {sparringResponse}
              </div>
            )}
          </div>
        )}

        {/* ─── MARKET ─── */}
        {tab === 'market' && (
          <div style={{ maxWidth: 720 }}>
            <div style={{ marginBottom: 14 }}>
              <CrossSectorIntel onAsk={askAskBiz} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: 'var(--font-sora)', fontSize: 16, fontWeight: 700, marginBottom: 3 }}>{tc('intelligence.market_heading')}</div>
              <div style={{ fontSize: 12, color: 'var(--tx3)' }}>{tc('intelligence.market_sub')}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '16px', borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', marginBottom: 20 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  value={mktQuery}
                  onChange={e => setMktQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && searchMarket()}
                  placeholder={tc('intelligence.market_search_placeholder')}
                  style={{ flex: 1, padding: '10px 14px', borderRadius: 10, border: '1px solid var(--b)', background: 'var(--bg)', color: 'var(--tx)', fontSize: 14, fontFamily: 'inherit', outline: 'none' }}
                />
                <button
                  onClick={searchMarket}
                  disabled={mktLoading || !mktQuery.trim()}
                  style={{ padding: '10px 20px', borderRadius: 10, border: 'none', background: '#d08a59', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', opacity: mktLoading || !mktQuery.trim() ? 0.5 : 1 }}
                >
                  {mktLoading ? tc('intelligence.market_searching') : tc('intelligence.market_search')}
                </button>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <input
                  value={mktRegion}
                  onChange={e => setMktRegion(e.target.value)}
                  placeholder={tc('intelligence.market_region_placeholder')}
                  style={{ flex: 1, minWidth: 140, padding: '7px 12px', borderRadius: 8, border: '1px solid var(--b)', background: 'var(--bg)', color: 'var(--tx)', fontSize: 13, fontFamily: 'inherit', outline: 'none' }}
                />
                <select
                  value={mktChannel}
                  onChange={e => setMktChannel(e.target.value)}
                  style={{ flex: 1, minWidth: 140, padding: '7px 12px', borderRadius: 8, border: '1px solid var(--b)', background: 'var(--bg)', color: 'var(--tx)', fontSize: 13, fontFamily: 'inherit', outline: 'none' }}
                >
                  <option value="">{tc('intelligence.market_channel_all')}</option>
                  <option value="shopify">Shopify</option>
                  <option value="amazon_fba">Amazon FBA</option>
                  <option value="ebay">eBay</option>
                  <option value="etsy">Etsy</option>
                  <option value="woocommerce">WooCommerce</option>
                  <option value="pos">POS</option>
                </select>
              </div>
            </div>
            {mktResult?.locked && (
              <div style={{ padding: '24px 20px', borderRadius: 14, border: '1px solid #d08a59', background: 'rgba(208,138,89,0.07)', textAlign: 'center' }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>🌍</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--tx)', marginBottom: 6 }}>{tc('intelligence.market_locked_title')}</div>
                <div style={{ fontSize: 13, color: 'var(--tx3)', marginBottom: 16, lineHeight: 1.5 }}>{tc('intelligence.market_locked_desc')}</div>
                <a href="/billing" style={{ display: 'inline-block', padding: '10px 24px', borderRadius: 9999, background: '#d08a59', color: '#fff', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>{tc('intelligence.market_upgrade')}</a>
              </div>
            )}
            {mktResult?.error && (
              <div style={{ padding: '14px 16px', borderRadius: 12, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', fontSize: 13, color: '#EF4444' }}>{mktResult.error}</div>
            )}
            {mktResult && !mktResult.locked && !mktResult.error && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {mktResult.catalogue?.length > 0 && (
                  <div style={{ borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', overflow: 'hidden' }}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--b)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.08em' }}>{tc('intelligence.market_merchant_data')}</div>
                      <span style={{ fontSize: 11, color: 'var(--tx3)' }}>{tc('intelligence.market_records', { count: mktResult.catalogue.length, plan: mktResult.plan })}</span>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                        <thead>
                          <tr style={{ background: 'var(--ev)' }}>
                            {['product','channel','region','avg_price','min','max','margin','merchants'].map(h => (
                              <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--tx3)', whiteSpace: 'nowrap' }}>{tc('intelligence.market_col_' + h)}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {mktResult.catalogue.map((row: any, i: number) => (
                            <tr key={i} style={{ borderTop: '1px solid var(--b)' }}>
                              <td style={{ padding: '9px 12px', fontWeight: 500, color: 'var(--tx)', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.product_name}</td>
                              <td style={{ padding: '9px 12px', color: 'var(--tx2)' }}>{row.channel}</td>
                              <td style={{ padding: '9px 12px', color: 'var(--tx2)' }}>{row.region}</td>
                              <td style={{ padding: '9px 12px', fontWeight: 600, color: 'var(--tx)' }}>{row.currency} {row.avg_selling_price}</td>
                              <td style={{ padding: '9px 12px', color: 'var(--tx3)' }}>{row.min_selling_price}</td>
                              <td style={{ padding: '9px 12px', color: 'var(--tx3)' }}>{row.max_selling_price}</td>
                              <td style={{ padding: '9px 12px', color: row.avg_gross_margin ? 'var(--tx2)' : 'var(--tx3)' }}>{row.avg_gross_margin ? `${row.avg_gross_margin}%` : '—'}</td>
                              <td style={{ padding: '9px 12px', color: 'var(--tx3)' }}>{row.merchant_count}+</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                {mktResult.catalogue?.length === 0 && (
                  <div style={{ padding: '14px 16px', borderRadius: 12, background: 'var(--sf)', border: '1px solid var(--b)', fontSize: 13, color: 'var(--tx3)' }}>
                    {tc('intelligence.market_no_data')}
                  </div>
                )}
                {mktResult.routes?.length > 0 && (
                  <div style={{ borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', overflow: 'hidden' }}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--b)' }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.08em' }}>{tc('intelligence.market_route_intel', { region: mktResult.region })}</div>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                        <thead>
                          <tr style={{ background: 'var(--ev)' }}>
                            {['origin','destination','carrier','transit','ontime','customs','merchants'].map(h => (
                              <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--tx3)', whiteSpace: 'nowrap' }}>{tc('intelligence.market_route_' + h)}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {mktResult.routes.map((row: any, i: number) => (
                            <tr key={i} style={{ borderTop: '1px solid var(--b)' }}>
                              <td style={{ padding: '9px 12px', color: 'var(--tx2)' }}>{row.origin_country}</td>
                              <td style={{ padding: '9px 12px', color: 'var(--tx2)' }}>{row.destination_country}</td>
                              <td style={{ padding: '9px 12px', color: 'var(--tx2)' }}>{row.carrier_code}</td>
                              <td style={{ padding: '9px 12px', fontWeight: 500 }}>{row.avg_transit_days ? `${row.avg_transit_days}d` : '—'}</td>
                              <td style={{ padding: '9px 12px', color: row.on_time_rate >= 80 ? '#22C55E' : row.on_time_rate >= 60 ? '#F59E0B' : '#EF4444', fontWeight: 600 }}>{row.on_time_rate}%</td>
                              <td style={{ padding: '9px 12px', color: row.customs_hold_rate > 10 ? '#EF4444' : 'var(--tx3)' }}>{row.customs_hold_rate}%</td>
                              <td style={{ padding: '9px 12px', color: 'var(--tx3)' }}>{row.merchant_count}+</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                {mktResult.web && (
                  <div style={{ borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', overflow: 'hidden' }}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--b)' }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.08em' }}>{tc('intelligence.market_web_signals')}</div>
                    </div>
                    <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                      {mktResult.web.price_summary && (
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>{tc('intelligence.market_price_summary')}</div>
                          <div style={{ fontSize: 13, color: 'var(--tx)', lineHeight: 1.6, padding: '10px 14px', borderRadius: 10, background: 'var(--ev)' }}>{mktResult.web.price_summary}</div>
                          {mktResult.web.price_sources?.length > 0 && (
                            <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                              {mktResult.web.price_sources.map((s: any, i: number) => (
                                <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '8px 12px', borderRadius: 8, border: '1px solid var(--b)', textDecoration: 'none' }}>
                                  <span style={{ fontSize: 12, fontWeight: 600, color: '#6366F1' }}>{s.title}</span>
                                  <span style={{ fontSize: 11, color: 'var(--tx3)', lineHeight: 1.5 }}>{s.snippet}</span>
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                      {mktResult.web.news?.length > 0 && (
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>{tc('intelligence.market_news')}</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {mktResult.web.news.map((n: any, i: number) => (
                              <a key={i} href={n.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '8px 12px', borderRadius: 8, border: '1px solid var(--b)', textDecoration: 'none' }}>
                                <span style={{ fontSize: 12, fontWeight: 500, color: '#6366F1', flex: 1 }}>{n.title}</span>
                                {n.date && <span style={{ fontSize: 11, color: 'var(--tx3)', whiteSpace: 'nowrap' }}>{n.date?.slice(0,10)}</span>}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {mktResult.data_thin && (
                  <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(208,138,89,0.08)', border: '1px solid rgba(208,138,89,0.2)', fontSize: 12, color: '#d08a59' }}>
                    {tc('intelligence.market_data_thin')}
                  </div>
                )}
              </div>
            )}
            {!mktResult && !mktLoading && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10, marginTop: 4 }}>
                {[['leather handbag','USA'],['running shoes','UK'],['phone case','EU'],['candles','']].map(([product, region], i) => (
                  <button
                    key={i}
                    onClick={() => { setMktQuery(product); if (region) setMktRegion(region) }}
                    style={{ padding: '12px 14px', borderRadius: 12, border: '1px solid var(--b)', background: 'var(--sf)', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit' }}
                  >
                    <div style={{ fontSize: 12, color: 'var(--tx3)', marginBottom: 3 }}>{tc('intelligence.market_try_searching')}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--tx)' }}>{product}{region ? `, ${region}` : ''}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── CONNECTIONS ─── */}
        {tab === 'connections' && <IntegrationHub />}

        {/* ─── CFO MODE ─── */}
        {tab === 'cfo' && (
          <FeatureGate planId={planId} feature="cfo_mode">
            <CfoDashboard onAsk={askAskBiz} />
          </FeatureGate>
        )}

        {/* ─── ACTIONS ─── */}
        {tab === 'actions' && (
          <div style={{ maxWidth: 720 }}>
            <DailyActions onAsk={askAskBiz}/>
          </div>
        )}

        {/* Cash Flow merged into CFO dashboard */}

      </div>
    </div>
  )
}
