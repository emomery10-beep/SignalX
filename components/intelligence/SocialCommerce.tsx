'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLang } from '@/components/LanguageProvider'

const ACC  = '#d08a59'
const TX   = '#1a1916'
const TX2  = '#6b6760'
const TX3  = '#a39e97'
const B    = 'rgba(0,0,0,.08)'
const B2   = 'rgba(0,0,0,.14)'
const SF   = '#ffffff'
const EV   = '#f3f2ef'

const PLATFORM_STYLE: Record<string, { colour: string; bg: string; icon: string }> = {
  'TikTok Shop': { colour: '#010101', bg: 'rgba(1,1,1,.06)',         icon: '🎵' },
  'Instagram':   { colour: '#E1306C', bg: 'rgba(225,48,108,.06)',     icon: '📸' },
  'Pinterest':   { colour: '#E60023', bg: 'rgba(230,0,35,.06)',       icon: '📌' },
}

interface Summary {
  total_views: number; total_saves: number; total_orders: number
  total_revenue: number; total_clicks: number
  overall_conversion_rate: number; avg_save_rate: number; period_days: number
}

interface PlatformBreakdown {
  platform: string; views: number; saves: number; clicks: number
  orders: number; revenue: number; posts: number
  avg_engagement: number; conversion_rate: number
}

interface TopContent {
  content_id: string; content_type: string; platform: string
  product_name: string; sku: string; views: number; saves: number
  orders: number; revenue: number; conversion_rate: number
  save_rate: number; viral_score: number; record_date: string
}

interface DemandSignal {
  platform: string; product_name: string; saves: number
  views: number; save_rate: number; signal: string; record_date: string
}

interface ConnectedSource {
  source_type: string; name: string; status: string; last_synced_at: string | null
}

function fmt(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
  if (n >= 1000)    return (n / 1000).toFixed(1) + 'K'
  return String(Math.round(n))
}

let _sym = '£'
function fmtGBP(n: number): string {
  return _sym + n.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

export default function SocialCommerce({ onAsk, sym = '£' }: { onAsk: (prompt: string) => void; sym?: string }) {
  _sym = sym
  const router = useRouter()
  const { tc } = useLang()
  const [loading,        setLoading]        = useState(true)
  const [syncing,        setSyncing]        = useState(false)
  const [hasData,        setHasData]        = useState(false)
  const [summary,        setSummary]        = useState<Summary | null>(null)
  const [platforms,      setPlatforms]      = useState<PlatformBreakdown[]>([])
  const [topContent,     setTopContent]     = useState<TopContent[]>([])
  const [demandSignals,  setDemandSignals]  = useState<DemandSignal[]>([])
  const [connectedSrcs,  setConnectedSrcs]  = useState<ConnectedSource[]>([])
  const [activeTab,      setActiveTab]      = useState<'overview' | 'content' | 'signals'>('overview')

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/social')
      const data = await res.json()
      setHasData(data.has_data || false)
      setSummary(data.summary || null)
      setPlatforms(data.platform_breakdown || [])
      setTopContent(data.top_content || [])
      setDemandSignals(data.demand_signals || [])
      setConnectedSrcs(data.connected_sources || [])
    } catch {}
    finally { setLoading(false) }
  }

  const syncNow = async () => {
    setSyncing(true)
    try {
      await fetch('/api/social', { method: 'POST' })
      await loadData()
    } catch {}
    finally { setSyncing(false) }
  }

  const connectedPlatforms = connectedSrcs.filter(s => s.status === 'active')
  const notConnected = ['tiktok_shop', 'instagram', 'pinterest'].filter(
    p => !connectedSrcs.some(s => s.source_type === p)
  )

  const platformCards = [
    { id: 'tiktok_shop', name: tc('intel_socialcommerce.tiktokName'), icon: '🎵', colour: '#010101', desc: tc('intel_socialcommerce.tiktokDesc'), fields: ['Access Token', 'Shop ID'] },
    { id: 'instagram',   name: tc('intel_socialcommerce.instagramName'), icon: '📸', colour: '#E1306C', desc: tc('intel_socialcommerce.instagramDesc'), fields: ['Access Token', 'IG User ID', 'Catalog ID'] },
    { id: 'pinterest',   name: tc('intel_socialcommerce.pinterestName'), icon: '📌', colour: '#E60023', desc: tc('intel_socialcommerce.pinterestDesc'), fields: ['Access Token'] },
  ]

  const buildKpis = (s: Summary) => [
    { label: tc('intel_socialcommerce.kpiViews'),      value: fmt(s.total_views),                  sub: tc('intel_socialcommerce.kpiViewsSub') },
    { label: tc('intel_socialcommerce.kpiSaves'),      value: fmt(s.total_saves),                  sub: tc('intel_socialcommerce.kpiSavesSub', { rate: s.avg_save_rate }) },
    { label: tc('intel_socialcommerce.kpiRevenue'),    value: fmtGBP(s.total_revenue),             sub: tc('intel_socialcommerce.kpiOrdersSub', { n: s.total_orders }) },
    { label: tc('intel_socialcommerce.kpiConversion'), value: `${s.overall_conversion_rate}%`,     sub: tc('intel_socialcommerce.kpiConversionSub') },
  ]

  const buildMetrics = (p: PlatformBreakdown) => [
    { label: tc('intel_socialcommerce.metricViews'),      value: fmt(p.views) },
    { label: tc('intel_socialcommerce.metricSaves'),      value: fmt(p.saves) },
    { label: tc('intel_socialcommerce.metricClicks'),     value: fmt(p.clicks) },
    { label: tc('intel_socialcommerce.metricOrders'),     value: String(p.orders) },
    { label: tc('intel_socialcommerce.metricConversion'), value: `${p.conversion_rate}%` },
  ]

  const buildTabs = () => [
    ['overview', tc('intel_socialcommerce.tabOverview')],
    ['content',  tc('intel_socialcommerce.tabContent')],
    ['signals',  tc('intel_socialcommerce.tabSignals')],
  ] as const

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[1,2,3].map(i => <div key={i} style={{ height: 80, borderRadius: 14, background: EV }}/>)}
      </div>
    )
  }

  // ── Not connected state ────────────────────────────────────────
  if (connectedPlatforms.length === 0) {
    return (
      <div>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontFamily: 'var(--font-sora)', fontSize: 14, fontWeight: 700, color: TX, marginBottom: 4 }}>
            {tc('intel_socialcommerce.title')}
          </div>
          <div style={{ fontSize: 11, color: TX2, lineHeight: 1.6 }}>
            {tc('intel_socialcommerce.subtitle')}
          </div>
        </div>

        {/* Platform cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, marginBottom: 20 }}>
          {platformCards.map(platform => (
            <div key={platform.id} style={{ background: SF, border: `1px solid ${B}`, borderRadius: 16, padding: '18px 16px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 26, marginBottom: 10 }}>{platform.icon}</div>
              <div style={{ fontFamily: 'var(--font-sora)', fontSize: 12, fontWeight: 600, color: TX, marginBottom: 5 }}>{platform.name}</div>
              <div style={{ fontSize: 10, color: TX3, lineHeight: 1.55, marginBottom: 14, flex: 1 }}>{platform.desc}</div>
              <button
                onClick={() => router.push('/sources')}
                style={{ padding: '8px 0', borderRadius: 9, border: 'none', background: platform.colour, color: '#fff', fontSize: 10, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
              >
                {tc('intel_socialcommerce.connectBtn', { name: platform.name.split(' ')[0] })}
              </button>
            </div>
          ))}
        </div>

        <div style={{ padding: '14px 16px', background: EV, borderRadius: 12, fontSize: 11, color: TX3, lineHeight: 1.6 }}>
          {tc('intel_socialcommerce.tipLabel')} <button onClick={() => onAsk(tc('intel_socialcommerce.tipPrompt'))} style={{ color: ACC, background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 11, fontWeight: 600 }}>{tc('intel_socialcommerce.tipLink')}</button>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-sora)', fontSize: 14, fontWeight: 700, color: TX, marginBottom: 3 }}>
            {tc('intel_socialcommerce.title')}
          </div>
          <div style={{ fontSize: 10, color: TX3 }}>
            {connectedPlatforms.map(p => p.name).join(' · ')} · {tc('intel_socialcommerce.last30Days')}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {notConnected.length > 0 && (
            <button onClick={() => router.push('/sources')}
              style={{ fontSize: 10, color: TX2, background: 'transparent', border: `1px solid ${B2}`, borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontFamily: 'inherit' }}>
              {tc('intel_socialcommerce.connectMore')}
            </button>
          )}
          <button onClick={syncNow} disabled={syncing}
            style={{ fontSize: 10, fontWeight: 600, color: ACC, background: 'rgba(208,138,89,.08)', border: '1px solid rgba(208,138,89,.2)', borderRadius: 8, padding: '6px 13px', cursor: 'pointer', fontFamily: 'inherit', opacity: syncing ? .7 : 1 }}>
            {syncing ? tc('intel_socialcommerce.syncing') : tc('intel_socialcommerce.syncNow')}
          </button>
        </div>
      </div>

      {/* KPI strip */}
      {summary && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 16 }}>
          {buildKpis(summary).map((k, i) => (
            <div key={i} style={{ background: SF, border: `1px solid ${B}`, borderRadius: 12, padding: '12px 14px' }}>
              <div style={{ fontSize: 9, color: TX3, marginBottom: 4 }}>{k.label}</div>
              <div style={{ fontFamily: 'var(--font-sora)', fontSize: 18, fontWeight: 700, color: TX }}>{k.value}</div>
              <div style={{ fontSize: 9, color: TX3, marginTop: 2 }}>{k.sub}</div>
            </div>
          ))}
        </div>
      )}

      {/* Demand signal banner */}
      {demandSignals.length > 0 && (
        <div style={{ background: 'rgba(208,138,89,.06)', border: '1px solid rgba(208,138,89,.25)', borderRadius: 12, padding: '13px 15px', marginBottom: 16, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 18, flexShrink: 0 }}>📈</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: ACC, marginBottom: 4 }}>
              {demandSignals.length > 1
                ? tc('intel_socialcommerce.demandDetected_plural', { n: demandSignals.length })
                : tc('intel_socialcommerce.demandDetected', { n: demandSignals.length })}
            </div>
            <div style={{ fontSize: 10, color: TX2, lineHeight: 1.55 }}>
              {tc('intel_socialcommerce.demandBody', { productName: demandSignals[0].product_name || 'A product', saves: demandSignals[0].saves, platform: demandSignals[0].platform })}
            </div>
            <button
              onClick={() => onAsk(tc('intel_socialcommerce.demandAskPrompt', { saves: demandSignals[0].saves, platform: demandSignals[0].platform, productName: demandSignals[0].product_name }))}
              style={{ marginTop: 8, fontSize: 10, fontWeight: 600, color: ACC, background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>
              {tc('intel_socialcommerce.demandAskLink')}
            </button>
          </div>
        </div>
      )}

      {/* Sub tabs */}
      <div style={{ display: 'flex', gap: 0, borderBottom: `1px solid ${B}`, marginBottom: 16 }}>
        {buildTabs().map(([id, label]) => (
          <button key={id} onClick={() => setActiveTab(id)}
            style={{ padding: '7px 14px', border: 'none', background: 'transparent', fontSize: 11, fontWeight: activeTab === id ? 600 : 400, color: activeTab === id ? ACC : TX3, borderBottom: activeTab === id ? `2px solid ${ACC}` : '2px solid transparent', cursor: 'pointer', fontFamily: 'inherit' }}>
            {label}
            {id === 'signals' && demandSignals.length > 0 && (
              <span style={{ marginLeft: 5, fontSize: 9, fontWeight: 700, background: ACC, color: '#fff', borderRadius: 9999, padding: '1px 6px' }}>{demandSignals.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Overview tab */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {platforms.map(p => {
            const style = PLATFORM_STYLE[p.platform] || { colour: ACC, bg: 'rgba(208,138,89,.06)', icon: '📊' }
            return (
              <div key={p.platform} style={{ background: SF, border: `1px solid ${B}`, borderRadius: 14, padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <span style={{ fontSize: 18 }}>{style.icon}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: TX }}>{p.platform}</span>
                  <span style={{ fontSize: 9, color: TX3 }}>{tc('intel_socialcommerce.platformPosts', { n: p.posts })}</span>
                  {p.revenue > 0 && <span style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 700, color: '#16a34a' }}>{fmtGBP(p.revenue)}</span>}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
                  {buildMetrics(p).map((m, i) => (
                    <div key={i} style={{ textAlign: 'center', padding: '8px 4px', background: style.bg, borderRadius: 9 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: style.colour }}>{m.value}</div>
                      <div style={{ fontSize: 9, color: TX3, marginTop: 2 }}>{m.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <button
                    onClick={() => onAsk(tc('intel_socialcommerce.analysePlatformPrompt', { platform: p.platform, views: fmt(p.views), saves: fmt(p.saves), orders: p.orders, revenue: fmtGBP(p.revenue), rate: p.conversion_rate }))}
                    style={{ fontSize: 10, fontWeight: 600, color: style.colour, background: style.bg, border: `1px solid ${style.colour}25`, borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontFamily: 'inherit' }}>
                    {tc('intel_socialcommerce.analysePlatformBtn', { platform: p.platform })}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Top content tab */}
      {activeTab === 'content' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {topContent.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', background: SF, border: `1px solid ${B}`, borderRadius: 12, fontSize: 11, color: TX3 }}>
              {tc('intel_socialcommerce.noContentYet')}
            </div>
          ) : topContent.map((c, i) => {
            const style = PLATFORM_STYLE[c.platform] || { colour: ACC, bg: 'rgba(208,138,89,.06)', icon: '📊' }
            return (
              <div key={i} style={{ background: SF, border: `1px solid ${B}`, borderRadius: 13, padding: '13px 15px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: style.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>
                  {style.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: TX }}>{c.product_name || `${c.content_type} — ${c.content_id?.slice(0, 12)}`}</span>
                    <span style={{ fontSize: 9, color: TX3 }}>{c.platform} · {c.content_type}</span>
                    {c.viral_score > 50 && <span style={{ fontSize: 9, fontWeight: 700, color: '#dc2626', background: 'rgba(220,38,38,.08)', padding: '1px 7px', borderRadius: 9999 }}>{tc('intel_socialcommerce.viralBadge')}</span>}
                  </div>
                  <div style={{ display: 'flex', gap: 12, fontSize: 9, color: TX3, flexWrap: 'wrap' }}>
                    <span>👁 {fmt(c.views)}</span>
                    <span>🔖 {fmt(c.saves)}</span>
                    <span>🛒 {tc('intel_socialcommerce.contentOrders', { n: c.orders })}</span>
                    {c.revenue > 0 && <span style={{ color: '#16a34a', fontWeight: 600 }}>{fmtGBP(c.revenue)}</span>}
                    <span>{c.conversion_rate > 0 ? `${(c.conversion_rate * 100).toFixed(1)}% CVR` : ''}</span>
                  </div>
                </div>
                <button
                  onClick={() => onAsk(tc('intel_socialcommerce.analyseContentPrompt', { platform: c.platform, contentType: c.content_type, productName: c.product_name, views: fmt(c.views), saves: fmt(c.saves), orders: c.orders }))}
                  style={{ fontSize: 9, color: ACC, background: 'transparent', border: `1px solid rgba(208,138,89,.25)`, borderRadius: 7, padding: '5px 10px', cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}>
                  {tc('intel_socialcommerce.analyseContentBtn')}
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Demand signals tab */}
      {activeTab === 'signals' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {demandSignals.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', background: 'rgba(34,197,94,.04)', border: '1px solid rgba(34,197,94,.2)', borderRadius: 12 }}>
              <div style={{ fontSize: 18, marginBottom: 8 }}>✅</div>
              <div style={{ fontSize: 11, color: TX2, fontWeight: 600 }}>{tc('intel_socialcommerce.noSignals')}</div>
              <div style={{ fontSize: 10, color: TX3, marginTop: 4 }}>{tc('intel_socialcommerce.noSignalsSub')}</div>
            </div>
          ) : demandSignals.map((signal, i) => {
            const style = PLATFORM_STYLE[signal.platform] || { colour: ACC, bg: 'rgba(208,138,89,.06)', icon: '📊' }
            return (
              <div key={i} style={{ background: 'rgba(208,138,89,.05)', border: '1px solid rgba(208,138,89,.25)', borderRadius: 13, padding: '14px 15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
                  <span style={{ fontSize: 14 }}>{style.icon}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: TX }}>{signal.product_name}</span>
                  <span style={{ fontSize: 9, color: TX3 }}>{signal.platform}</span>
                </div>
                <div style={{ fontSize: 10, color: TX2, lineHeight: 1.6, marginBottom: 10 }}>{signal.signal}</div>
                <div style={{ display: 'flex', gap: 12, fontSize: 10, color: TX3, marginBottom: 10 }}>
                  <span>{tc('intel_socialcommerce.signalSaves', { n: fmt(signal.saves) })}</span>
                  <span>{tc('intel_socialcommerce.signalViews', { n: fmt(signal.views) })}</span>
                  <span>{tc('intel_socialcommerce.signalSaveRate', { rate: (signal.save_rate * 100).toFixed(1) })}</span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => onAsk(tc('intel_socialcommerce.convertSalesPrompt', { productName: signal.product_name, saves: signal.saves, platform: signal.platform }))}
                    style={{ fontSize: 10, fontWeight: 600, color: ACC, background: 'rgba(208,138,89,.1)', border: '1px solid rgba(208,138,89,.25)', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontFamily: 'inherit' }}>
                    {tc('intel_socialcommerce.convertSalesBtn')}
                  </button>
                  <button
                    onClick={() => onAsk(tc('intel_socialcommerce.checkStockPrompt', { productName: signal.product_name, saves: signal.saves, platform: signal.platform }))}
                    style={{ fontSize: 10, color: TX2, background: 'transparent', border: `1px solid ${B2}`, borderRadius: 8, padding: '6px 11px', cursor: 'pointer', fontFamily: 'inherit' }}>
                    {tc('intel_socialcommerce.checkStockBtn')}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
