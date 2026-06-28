'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import FXRisk from '@/components/intelligence/FXRisk'
import SupplierScorecard from '@/components/intelligence/SupplierScorecard'
import LandedCost from '@/components/intelligence/LandedCost'
import ExportMarkets from '@/components/intelligence/ExportMarkets'
import SocialCommerce from '@/components/intelligence/SocialCommerce'
import { useLang } from '@/components/LanguageProvider'

const ACC  = '#d08a59'
const TX   = '#1a1916'
const TX2  = '#6b6760'
const TX3  = '#a39e97'
const B    = 'rgba(0,0,0,.08)'
const SF   = '#ffffff'
const EV   = '#f3f2ef'

type Severity = 'info' | 'warning' | 'critical'
interface Signal { message: string; tool: string; severity: Severity }
interface PreviewData {
  locked?: boolean
  message?: string
  upgrade_url?: string
  sym: string
  has_store?: boolean
  health: { score: number | null; label: string | null }
  source_count: number
  signals: Signal[]
  fx: {
    currencies: { code: string; flag: string; monthly_spend: number }[]
    top_exposure: { code: string; amount: number; scenario_10pct: number }
  } | null
  suppliers: {
    top_three: { name: string; grade: string; colour: string }[]
    at_risk_count: number
    total: number
  } | null
  landed: {
    sku: string
    cost: number
    sell_price: number
    landed_cost: number
    margin_pct: number
  } | null
  export_markets: {
    top_three: { flag: string; name: string; score: number }[]
  } | null
  social: {
    platforms: { name: string; status: string; colour: string; status_icon: string; status_label: string }[]
    demand_signals: number
    top_signal: string | null
  } | null
  market: {
    products: { name: string; price: number; channel: string }[]
    query_sku: string
  } | null
}

const SEV_COL: Record<Severity, string> = {
  info:     '#6366F1',
  warning:  '#d97706',
  critical: '#ef4444',
}

function SkeletonLine({ w = '100%', h = 10 }: { w?: string | number; h?: number }) {
  return (
    <div style={{ width: w, height: h, borderRadius: 6, background: 'rgba(0,0,0,.06)', animation: 'skPulse 1.4s ease-in-out infinite' }} />
  )
}
function CardSkeleton({ colour }: { colour: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', gap: 6 }}>
        <SkeletonLine w={60} h={22} />
        <SkeletonLine w={60} h={22} />
        <SkeletonLine w={60} h={22} />
      </div>
      <SkeletonLine w="80%" />
      <SkeletonLine w="60%" />
      <SkeletonLine w="70%" />
    </div>
  )
}

function EmptyState({ colour, message, sub, href }: { colour: string; message: string; sub: string; href: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 8, padding: '8px 0', textAlign: 'center' }}>
      <div style={{ width: 32, height: 32, borderRadius: 9999, background: colour + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={colour} strokeWidth="2.5" strokeLinecap="round">
          <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
        </svg>
      </div>
      <div style={{ fontSize: 12, fontWeight: 700, color: TX }}>{message}</div>
      <div style={{ fontSize: 11, color: TX3, lineHeight: 1.4 }}>{sub}</div>
      <a href={href} onClick={e => e.stopPropagation()}
        style={{ fontSize: 11, fontWeight: 700, color: colour, background: colour + '12', border: `1px solid ${colour}30`, padding: '5px 12px', borderRadius: 9999, textDecoration: 'none', marginTop: 2 }}>
        Connect now →
      </a>
    </div>
  )
}

function buildTools(tc: (k: string) => string) {
  return [
    { id: 'fx',        label: tc('page_tools.toolFxLabel'),        icon: '💱', colour: '#6366F1', bg: 'rgba(99,102,241,.08)',   tags: [tc('page_tools.tagImporters'), tc('page_tools.tagCurrency')]   },
    { id: 'suppliers', label: tc('page_tools.toolSuppliersLabel'), icon: '🏭', colour: '#16a34a', bg: 'rgba(34,197,94,.08)',    tags: [tc('page_tools.tagShipments'), tc('page_tools.tagAutoPopulated')] },
    { id: 'landed',    label: tc('page_tools.toolLandedLabel'),    icon: '🧮', colour: ACC,       bg: 'rgba(208,138,89,.08)',   tags: [tc('page_tools.tagImporters'), tc('page_tools.tagMargin')]      },
    { id: 'export',    label: tc('page_tools.toolExportLabel'),    icon: '🌍', colour: '#0284c7', bg: 'rgba(2,132,199,.08)',    tags: [tc('page_tools.tagExport'), tc('page_tools.tagGrowth')]         },
    { id: 'social',    label: tc('page_tools.toolSocialLabel'),    icon: '📱', colour: '#E1306C', bg: 'rgba(225,48,108,.08)',   tags: [tc('page_tools.tagSocial'), tc('page_tools.tagDemand')]         },
    { id: 'market',    label: tc('page_tools.toolMarketLabel'),    icon: '🔍', colour: ACC,       bg: 'rgba(208,138,89,.08)',   tags: [tc('page_tools.tagPricing'), tc('page_tools.tagExport')]        },
  ]
}

function LivePreview({ id, data, loading }: { id: string; data: PreviewData | null; loading: boolean }) {
  if (loading || !data) return <div style={{ flex: 1 }}><CardSkeleton colour="#ccc" /></div>

  const sym = data.sym

  if (id === 'fx') {
    if (!data.fx) return (
      <EmptyState colour="#6366F1"
        message={data.has_store ? 'No import costs detected' : 'No cost data yet'}
        sub={data.has_store ? 'Add shipment costs in foreign currencies to track your FX exposure' : 'Connect your store to see real currency exposure'}
        href="/intelligence" />
    )
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#6366F1', textTransform: 'uppercase', letterSpacing: '.06em' }}>Live Import Exposure</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {data.fx.currencies.map(c => (
            <span key={c.code} style={{ fontSize: 11, padding: '4px 8px', borderRadius: 7, border: '1px solid rgba(99,102,241,.2)', background: 'rgba(99,102,241,.05)', color: '#6366F1', fontWeight: 600 }}>
              {c.flag} {c.code}
            </span>
          ))}
        </div>
        <div style={{ height: 5, borderRadius: 9999, background: 'rgba(99,102,241,.12)', overflow: 'hidden', marginTop: 2 }}>
          <div style={{ height: '100%', width: `${Math.min((data.fx.top_exposure.amount / 10000) * 100, 95)}%`, borderRadius: 9999, background: '#6366F1' }} />
        </div>
        <div style={{ fontSize: 11, color: TX2 }}>
          Top: <strong style={{ color: TX }}>{sym}{data.fx.top_exposure.amount.toLocaleString()}/mo {data.fx.top_exposure.code}</strong>
        </div>
        <div style={{ fontSize: 11, color: TX3 }}>
          10% move = <strong style={{ color: '#ef4444' }}>{sym}{data.fx.top_exposure.scenario_10pct.toLocaleString()} at risk</strong>
        </div>
      </div>
    )
  }

  if (id === 'suppliers') {
    if (!data.suppliers) return (
      <EmptyState colour="#16a34a" message="No shipments tracked"
        sub="Add a shipment tracking number to grade your suppliers" href="/intelligence" />
    )
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {data.suppliers.top_three.map(s => (
          <div key={s.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, color: TX2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '75%' }}>{s.name}</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: s.colour, fontFamily: 'var(--font-sora)', flexShrink: 0 }}>{s.grade}</span>
          </div>
        ))}
        {data.suppliers.at_risk_count > 0 && (
          <div style={{ fontSize: 10, color: '#ea580c', marginTop: 2, fontWeight: 700 }}>
            ⚠ {data.suppliers.at_risk_count} supplier{data.suppliers.at_risk_count > 1 ? 's' : ''} at risk
          </div>
        )}
        <div style={{ fontSize: 10, color: TX3 }}>{data.suppliers.total} total tracked</div>
      </div>
    )
  }

  if (id === 'landed') {
    if (!data.landed) return (
      <EmptyState colour={ACC}
        message={data.has_store ? 'No product cost data found' : 'No product data yet'}
        sub={data.has_store ? 'Add cost prices to your inventory or POS products to calculate true landed cost' : 'Connect a data source to auto-calculate true landed cost'}
        href="/pos/inventory" />
    )
    const l = data.landed
    const rows = [
      ['Product cost', sym + l.cost.toFixed(2)],
      ['Freight (est.)', sym + (l.cost * 0.12).toFixed(2)],
      ['Duty (est.)', sym + (l.cost * 0.08).toFixed(2)],
      ['VAT (est.)', sym + ((l.cost * 1.2) * 0.2).toFixed(2)],
    ]
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        <div style={{ fontSize: 10, color: TX3, fontWeight: 600, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {l.sku}
        </div>
        {rows.map(([label, val]) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
            <span style={{ color: TX2 }}>{label}</span>
            <span style={{ fontWeight: 600, color: TX }}>{val}</span>
          </div>
        ))}
        <div style={{ borderTop: `1px solid ${B}`, paddingTop: 5, display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
          <span style={{ fontWeight: 700, color: TX }}>True landed cost</span>
          <span style={{ fontWeight: 800, color: ACC, fontFamily: 'var(--font-sora)' }}>{sym}{l.landed_cost.toFixed(2)}</span>
        </div>
      </div>
    )
  }

  if (id === 'export') {
    const top = data.export_markets?.top_three || []
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {top.map(m => (
          <div key={m.name} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
              <span style={{ color: TX2 }}>{m.flag} {m.name}</span>
              <span style={{ fontWeight: 700, color: '#0284c7' }}>{m.score}/100</span>
            </div>
            <div style={{ height: 4, borderRadius: 9999, background: 'rgba(2,132,199,.12)' }}>
              <div style={{ height: '100%', width: `${m.score}%`, borderRadius: 9999, background: '#0284c7' }} />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (id === 'social') {
    if (!data.social) return (
      <EmptyState colour="#E1306C" message="No social channels connected"
        sub="Connect TikTok Shop, Instagram, or Pinterest" href="/sources" />
    )
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {data.social.platforms.map(p => (
          <div key={p.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11 }}>
            <span style={{ color: TX2 }}>{p.name}</span>
            <span style={{ fontWeight: 700, color: p.colour }}>{p.status_icon} {p.status_label}</span>
          </div>
        ))}
        {data.social.demand_signals > 0 && (
          <div style={{ fontSize: 10, color: '#ef4444', fontWeight: 700, marginTop: 2 }}>
            ⚡ {data.social.top_signal}
          </div>
        )}
      </div>
    )
  }

  if (id === 'market') {
    if (data.market) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          <div style={{ fontSize: 10, color: TX3, fontWeight: 600 }}>
            Live prices · {data.market.query_sku}
          </div>
          {data.market.products.map((p, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
              <span style={{ color: TX2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '65%' }}>{p.name}</span>
              <span style={{ fontWeight: 700, color: ACC, flexShrink: 0 }}>
                {sym}{typeof p.price === 'number' ? p.price.toFixed(2) : p.price}
                <span style={{ color: TX3, fontWeight: 400 }}> · {p.channel}</span>
              </span>
            </div>
          ))}
        </div>
      )
    }
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ padding: '8px 11px', borderRadius: 8, border: `1px solid ${B}`, background: EV, fontSize: 11, color: TX3 }}>
          Search market prices…
        </div>
        <div style={{ fontSize: 10, color: TX3 }}>Expand to search live market prices for any product</div>
      </div>
    )
  }

  return null
}

export default function IntelligencePage() {
  const { tc } = useLang()
  const router  = useRouter()

  const [preview, setPreview]       = useState<PreviewData | null>(null)
  const [loading, setLoading]       = useState(true)
  const [expandedTool, setExpanded] = useState<string | null>(null)
  const [cardOrigin, setCardOrigin] = useState({ x: '50%', y: '50%' })

  // Market Intelligence local state (inside balloon)
  const [mktQuery, setMktQuery]   = useState('')
  const [mktLoading, setMktLoad]  = useState(false)
  const [mktResult, setMktResult] = useState<any>(null)

  useEffect(() => {
    fetch('/api/tools/preview')
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setPreview(d) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') setExpanded(null) }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [])

  const askAskBiz = (prompt: string) => {
    router.push('/ask')
    setTimeout(() => window.dispatchEvent(new CustomEvent('askbiz:send', { detail: prompt })), 400)
  }

  const openTool = (id: string, e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setCardOrigin({ x: `${rect.left + rect.width / 2}px`, y: `${rect.top + rect.height / 2}px` })
    setExpanded(id)
  }

  const searchMarket = async () => {
    if (!mktQuery.trim()) return
    setMktLoad(true); setMktResult(null)
    try {
      const res = await fetch(`/api/market/products?q=${encodeURIComponent(mktQuery.trim())}`)
      setMktResult(await res.json())
    } catch { setMktResult({ error: 'Could not load.' }) }
    finally { setMktLoad(false) }
  }

  const tools     = buildTools(tc)
  const activeTool = tools.find(t => t.id === expandedTool)
  const sym        = preview?.sym || '£'

  const healthColour = preview?.health?.score != null
    ? preview.health.score >= 65 ? '#22c55e' : preview.health.score >= 45 ? '#f59e0b' : '#ef4444'
    : TX3

  // ── Upgrade wall ──────────────────────────────────────────────
  if (!loading && preview?.locked) {
    return (
      <div className="page-shell">
        <div className="page-shell-body">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, gap: 20, textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ width: 64, height: 64, borderRadius: 20, background: 'rgba(208,138,89,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30 }}>📊</div>
            <div style={{ fontFamily: 'var(--font-sora)', fontSize: 22, fontWeight: 700, color: TX }}>Business Intelligence</div>
            <div style={{ fontSize: 14, color: TX2, maxWidth: 360, lineHeight: 1.6 }}>
              Live market insights, supplier grading, FX exposure, and cross-signal intelligence — all in one command centre.
            </div>
            <a href={preview.upgrade_url || '/billing'}
              style={{ padding: '13px 28px', borderRadius: 12, background: ACC, color: '#fff', fontSize: 14, fontWeight: 700, textDecoration: 'none', fontFamily: 'var(--font-sora)' }}>
              Upgrade to Growth →
            </a>
            <div style={{ fontSize: 12, color: TX3 }}>Available on Growth, Business, and Enterprise plans</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-shell">
      <div className="page-shell-body">

        {/* ── Signal bar ─────────────────────────────────────────── */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Health + sources chips — always shown */}
          {[
            {
              label: 'Health Score',
              value: preview?.health?.score != null ? `${preview.health.score}/100` : '—',
              colour: healthColour,
            },
            {
              label: 'Connected Sources',
              value: preview && preview.source_count > 0 ? `${preview.source_count} connected` : 'None yet',
              colour: preview && preview.source_count > 0 ? '#6366f1' : TX3,
            },
          ].map(chip => (
            <div key={chip.label} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 14px', borderRadius: 9999, background: SF, border: `1px solid ${B}`, fontSize: 13 }}>
              <span style={{ color: TX3, fontSize: 12 }}>{chip.label}</span>
              <span style={{ fontWeight: 700, color: chip.colour, fontFamily: 'var(--font-sora)' }}>{chip.value}</span>
            </div>
          ))}

          {/* Live signals */}
          {(preview?.signals || []).map((sig, i) => (
            <div key={i}
              onClick={() => {
                const tool = tools.find(t => t.id === sig.tool)
                if (tool) {
                  const fakeEl = document.querySelector(`[data-tool="${sig.tool}"]`)
                  if (fakeEl) {
                    const rect = fakeEl.getBoundingClientRect()
                    setCardOrigin({ x: `${rect.left + rect.width / 2}px`, y: `${rect.top + rect.height / 2}px` })
                  }
                  setExpanded(sig.tool)
                }
              }}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 14px', borderRadius: 9999, background: SEV_COL[sig.severity as Severity] + '0f', border: `1px solid ${SEV_COL[sig.severity as Severity]}30`, fontSize: 12, cursor: 'pointer', transition: 'all 160ms ease' }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = SEV_COL[sig.severity as Severity] + '18' }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = SEV_COL[sig.severity as Severity] + '0f' }}>
              <div style={{ width: 7, height: 7, borderRadius: 9999, background: SEV_COL[sig.severity as Severity], flexShrink: 0 }} />
              <span style={{ color: TX, fontWeight: 500 }}>{sig.message}</span>
              <span style={{ color: SEV_COL[sig.severity as Severity], fontWeight: 700, fontSize: 11 }}>→</span>
            </div>
          ))}
        </div>

        {/* ── Widget grid ────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
          {tools.map(tool => (
            <div key={tool.id}
              data-tool={tool.id}
              onClick={e => openTool(tool.id, e)}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.borderColor = tool.colour + '55'
                el.style.boxShadow   = `0 8px 28px ${tool.colour}18`
                el.style.transform   = 'translateY(-3px)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.borderColor = B
                el.style.boxShadow   = 'none'
                el.style.transform   = 'translateY(0)'
              }}
              style={{ borderRadius: 18, border: `1.5px solid ${B}`, background: SF, padding: '20px', cursor: 'pointer', transition: 'all 220ms ease', display: 'flex', flexDirection: 'column', userSelect: 'none', minHeight: 240 }}>

              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: tool.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                  {tool.icon}
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-sora)', fontSize: 13, fontWeight: 700, color: TX, lineHeight: 1.2 }}>{tool.label}</div>
                  <div style={{ display: 'flex', gap: 4, marginTop: 4, flexWrap: 'wrap' }}>
                    {tool.tags.map(tag => (
                      <span key={tag} style={{ fontSize: 9, fontWeight: 700, color: tool.colour, background: tool.bg, padding: '2px 7px', borderRadius: 9999, textTransform: 'uppercase', letterSpacing: '.06em' }}>{tag}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Live preview content */}
              <div style={{ flex: 1, marginBottom: 14, display: 'flex', flexDirection: 'column' }}>
                <LivePreview id={tool.id} data={preview} loading={loading} />
              </div>

              {/* Expand hint */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600, color: tool.colour }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                </svg>
                {tc('page_tools.cardExpand')}
              </div>
            </div>
          ))}
        </div>

        {/* ── Quick prompts ───────────────────────────────────────── */}
        <div style={{ padding: '16px 18px', borderRadius: 14, background: EV, border: `1px solid ${B}` }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: TX3, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 12 }}>
            {tc('page_tools.quickPromptsLabel')}
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[
              tc('page_tools.prompt1'), tc('page_tools.prompt2'), tc('page_tools.prompt3'),
              tc('page_tools.prompt4'), tc('page_tools.prompt5'), tc('page_tools.prompt6'),
            ].map((prompt, i) => (
              <button key={i} onClick={() => askAskBiz(prompt)}
                style={{ fontSize: 12, color: ACC, background: 'rgba(208,138,89,.08)', border: '1px solid rgba(208,138,89,.2)', borderRadius: 9999, padding: '6px 13px', cursor: 'pointer', fontFamily: 'inherit' }}>
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Balloon overlay ─────────────────────────────────────── */}
      {expandedTool && activeTool && (
        <>
          <div onClick={() => setExpanded(null)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(26,25,22,.45)', backdropFilter: 'blur(4px)', zIndex: 100, animation: 'fadeIn 200ms ease' }}
          />
          <div style={{
            position: 'fixed', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'min(860px, 92vw)', maxHeight: '88vh',
            borderRadius: 22, background: SF,
            border: `1.5px solid ${activeTool.colour}30`,
            boxShadow: `0 32px 80px rgba(0,0,0,.22), 0 0 0 1px ${activeTool.colour}15`,
            zIndex: 101, display: 'flex', flexDirection: 'column', overflow: 'hidden',
            animation: 'balloon 280ms cubic-bezier(.34,1.56,.64,1)',
            transformOrigin: `calc(${cardOrigin.x} - 50vw) calc(${cardOrigin.y} - 50vh)`,
          }}>
            {/* Modal header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: `1px solid ${B}`, background: activeTool.bg, flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 46, height: 46, borderRadius: 14, background: 'rgba(255,255,255,.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                  {activeTool.icon}
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-sora)', fontSize: 17, fontWeight: 700, color: TX }}>{activeTool.label}</div>
                  <div style={{ display: 'flex', gap: 5, marginTop: 4 }}>
                    {activeTool.tags.map(tag => (
                      <span key={tag} style={{ fontSize: 10, fontWeight: 700, color: activeTool.colour, background: activeTool.bg, padding: '2px 8px', borderRadius: 9999, textTransform: 'uppercase', letterSpacing: '.06em' }}>{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
              <button onClick={() => setExpanded(null)}
                style={{ width: 36, height: 36, borderRadius: 9999, border: `1px solid ${B}`, background: SF, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: TX2, flexShrink: 0 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            {/* Tool content */}
            <div style={{ overflowY: 'auto', padding: '24px', flex: 1 }}>
              {expandedTool === 'fx'        && <FXRisk onAsk={askAskBiz} sym={sym} />}
              {expandedTool === 'suppliers' && <SupplierScorecard onAsk={askAskBiz} sym={sym} />}
              {expandedTool === 'landed'    && <LandedCost onAsk={askAskBiz} sym={sym} />}
              {expandedTool === 'export'    && <ExportMarkets onAsk={askAskBiz} sym={sym} />}
              {expandedTool === 'social'    && <SocialCommerce onAsk={askAskBiz} sym={sym} />}
              {expandedTool === 'market'    && (
                <div>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                    <input type="text" value={mktQuery} onChange={e => setMktQuery(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && searchMarket()}
                      placeholder={tc('page_tools.marketInputPlaceholder')}
                      style={{ flex: 1, padding: '11px 14px', borderRadius: 10, border: `1.5px solid ${B}`, fontSize: 14, fontFamily: 'inherit', color: TX, outline: 'none', background: EV }} />
                    <button onClick={searchMarket} disabled={mktLoading}
                      style={{ padding: '11px 20px', borderRadius: 10, border: 'none', background: ACC, color: '#fff', fontSize: 14, fontWeight: 600, cursor: mktLoading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: mktLoading ? 0.7 : 1, whiteSpace: 'nowrap' }}>
                      {mktLoading ? tc('page_tools.marketSearching') : tc('page_tools.marketSearch')}
                    </button>
                  </div>
                  {!mktResult && !mktLoading && <div style={{ fontSize: 13, color: TX3 }}>{tc('page_tools.marketEmptyState')}</div>}
                  {mktResult?.locked && (
                    <div style={{ padding: '20px 18px', borderRadius: 14, border: `1px solid ${ACC}40`, background: `${ACC}08`, textAlign: 'center' }}>
                      <div style={{ fontSize: 24, marginBottom: 8 }}>🌍</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: TX, marginBottom: 6 }}>Market Intelligence</div>
                      <div style={{ fontSize: 13, color: TX2, marginBottom: 14, lineHeight: 1.5 }}>Available on Growth and above. See real market prices, channel benchmarks, and live web signals.</div>
                      <a href="/billing" style={{ display: 'inline-block', padding: '10px 24px', borderRadius: 9999, background: ACC, color: '#fff', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>Upgrade to Growth →</a>
                    </div>
                  )}
                  {mktResult?.error && <div style={{ padding: '14px 16px', borderRadius: 10, background: 'rgba(239,68,68,.07)', color: '#ef4444', fontSize: 14 }}>{mktResult.error}</div>}
                  {mktResult && !mktResult.locked && !mktResult.error && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {(mktResult.products || mktResult.results || []).map((item: any, i: number) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: 10, border: `1px solid ${B}`, background: EV, gap: 12, flexWrap: 'wrap' }}>
                          <div style={{ fontWeight: 600, fontSize: 14, color: TX, flex: 1 }}>{item.name || item.title || item.product || '—'}</div>
                          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                            {(item.price != null || item.price_gbp != null) && (
                              <span style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: 15, color: ACC }}>
                                {typeof (item.price ?? item.price_gbp) === 'number' ? `${sym}${(item.price ?? item.price_gbp).toFixed(2)}` : item.price ?? item.price_gbp}
                              </span>
                            )}
                            {item.channel && <span style={{ fontSize: 10, fontWeight: 700, color: '#0284c7', background: 'rgba(2,132,199,.08)', padding: '3px 9px', borderRadius: 9999 }}>{item.channel}</span>}
                            {item.region  && <span style={{ fontSize: 10, fontWeight: 700, color: '#16a34a', background: 'rgba(34,197,94,.08)',  padding: '3px 9px', borderRadius: 9999 }}>{item.region}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes balloon {
          0%   { opacity: 0; transform: translate(-50%,-50%) scale(0.15); }
          70%  { opacity: 1; transform: translate(-50%,-50%) scale(1.03); }
          100% { transform: translate(-50%,-50%) scale(1); }
        }
        @keyframes skPulse {
          0%, 100% { opacity: 1 }
          50%       { opacity: .4 }
        }
        @media (max-width: 700px) {
          .tools-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
