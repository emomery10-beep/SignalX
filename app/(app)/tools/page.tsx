'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import FXRisk from '@/components/intelligence/FXRisk'
import SupplierScorecard from '@/components/intelligence/SupplierScorecard'
import LandedCost from '@/components/intelligence/LandedCost'
import ExportMarkets from '@/components/intelligence/ExportMarkets'
import SocialCommerce from '@/components/intelligence/SocialCommerce'

const ACC = '#d08a59'
const TX  = '#1a1916'
const TX2 = '#6b6760'
const TX3 = '#a39e97'
const B   = 'rgba(0,0,0,.08)'
const SF  = '#ffffff'
const EV  = '#f3f2ef'

function getTools(sym: string) { return [
  {
    id: 'fx', label: 'FX Risk Modeller', icon: '💱',
    colour: '#6366F1', bg: 'rgba(99,102,241,.08)', tags: ['Importers', 'Currency'],
    preview: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#6366F1', textTransform: 'uppercase', letterSpacing: '.06em' }}>Import currency</div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['🇺🇸 USD', '🇨🇳 CNY', '🇪🇺 EUR'].map(c => (
            <span key={c} style={{ fontSize: 11, padding: '4px 8px', borderRadius: 7, border: '1px solid rgba(99,102,241,.2)', background: 'rgba(99,102,241,.05)', color: '#6366F1', fontWeight: 600 }}>{c}</span>
          ))}
        </div>
        <div style={{ height: 6, borderRadius: 9999, background: 'rgba(99,102,241,.12)', overflow: 'hidden', marginTop: 4 }}>
          <div style={{ height: '100%', width: '62%', borderRadius: 9999, background: '#6366F1' }}/>
        </div>
        <div style={{ fontSize: 11, color: TX2 }}>GBP/USD at <strong style={{ color: TX }}>1.27</strong> · −2.1% exposure risk</div>
      </div>
    ),
  },
  {
    id: 'suppliers', label: 'Supplier Scorecard', icon: '🏭',
    colour: '#16a34a', bg: 'rgba(34,197,94,.08)', tags: ['Shipments', 'Auto-populated'],
    preview: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {[['Top Supplier Co', 'A', '#16a34a'], ['Global Parts Ltd', 'B+', '#65a30d'], ['FastShip Inc', 'C', '#d97706']].map(([name, grade, col]) => (
          <div key={name as string} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, color: TX2 }}>{name}</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: col as string, fontFamily: 'var(--font-sora)' }}>{grade}</span>
          </div>
        ))}
        <div style={{ fontSize: 10, color: TX3, marginTop: 2 }}>Expand to grade all suppliers →</div>
      </div>
    ),
  },
  {
    id: 'landed', label: 'Landed Cost', icon: '🧮',
    colour: '#d08a59', bg: 'rgba(208,138,89,.08)', tags: ['Importers', 'Margin'],
    preview: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {[['Product cost', `${sym}12.40`], ['Freight', `${sym}1.80`], ['Duty (12%)', `${sym}1.49`], ['VAT (20%)', `${sym}3.14`]].map(([label, val]) => (
          <div key={label as string} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
            <span style={{ color: TX2 }}>{label}</span>
            <span style={{ fontWeight: 600, color: TX }}>{val}</span>
          </div>
        ))}
        <div style={{ borderTop: `1px solid ${B}`, paddingTop: 6, display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
          <span style={{ fontWeight: 700, color: TX }}>True landed cost</span>
          <span style={{ fontWeight: 800, color: ACC, fontFamily: 'var(--font-sora)' }}>{sym}18.83</span>
        </div>
      </div>
    ),
  },
  {
    id: 'export', label: 'Export Markets', icon: '🌍',
    colour: '#0284c7', bg: 'rgba(2,132,199,.08)', tags: ['Export', 'Growth'],
    preview: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {[['🇩🇪 Germany', 87], ['🇺🇸 United States', 81], ['🇦🇺 Australia', 74]].map(([mkt, score]) => (
          <div key={mkt as string} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
              <span style={{ color: TX2 }}>{mkt}</span>
              <span style={{ fontWeight: 700, color: '#0284c7' }}>{score}/100</span>
            </div>
            <div style={{ height: 4, borderRadius: 9999, background: 'rgba(2,132,199,.12)' }}>
              <div style={{ height: '100%', width: `${score}%`, borderRadius: 9999, background: '#0284c7' }}/>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 'social', label: 'Social Commerce', icon: '📱',
    colour: '#E1306C', bg: 'rgba(225,48,108,.08)', tags: ['Social', 'Demand'],
    preview: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {[['TikTok Shop', '🔥 Trending', '#E1306C'], ['Instagram', '📈 Rising', '#9333ea'], ['Pinterest', '🟡 Stable', '#d97706']].map(([ch, status, col]) => (
          <div key={ch as string} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11 }}>
            <span style={{ color: TX2 }}>{ch}</span>
            <span style={{ fontWeight: 700, color: col as string }}>{status}</span>
          </div>
        ))}
        <div style={{ fontSize: 10, color: TX3 }}>Tap to see viral products →</div>
      </div>
    ),
  },
  {
    id: 'market', label: 'Market Intelligence', icon: '🔍',
    colour: '#d08a59', bg: 'rgba(208,138,89,.08)', tags: ['Pricing', 'Export'],
    preview: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ padding: '8px 11px', borderRadius: 8, border: `1px solid ${B}`, background: EV, fontSize: 11, color: TX3 }}>
          Search market prices…
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {[['Wireless earbuds', `${sym}24.99`, 'Amazon'], ['Running shoes', `${sym}67.50`, 'Zalando']].map(([p, price, ch]) => (
            <div key={p as string} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10 }}>
              <span style={{ color: TX2 }}>{p}</span>
              <span style={{ fontWeight: 700, color: ACC }}>{price} <span style={{ color: TX3, fontWeight: 400 }}>· {ch}</span></span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
] }

export default function ToolsPage() {
  const router = useRouter()
  const [expandedTool, setExpandedTool] = useState<string | null>(null)
  const [health, setHealth]             = useState<any>(null)
  const [alertCount, setAlertCount]     = useState(0)
  const [sourceCount, setSourceCount]   = useState(0)
  const [mktQuery, setMktQuery]         = useState('')
  const [mktLoading, setMktLoading]     = useState(false)
  const [mktResult, setMktResult]       = useState<any>(null)
  const [cardOrigin, setCardOrigin]     = useState({ x: '50%', y: '50%' })
  const gridRef = useRef<HTMLDivElement>(null)

  const [sym, setSym] = useState('£')

  useEffect(() => {
    fetch('/api/health').then(r => r.ok ? r.json() : null).then(d => {
      if (d) {
        setHealth(d.latest)
        setAlertCount((d.anomalies || []).filter((a: any) => a.severity === 'critical' || a.severity === 'warning').length)
      }
    }).catch(() => {})
    fetch('/api/sources').then(r => r.ok ? r.json() : []).then(d => {
      setSourceCount(Array.isArray(d) ? d.length : 0)
    }).catch(() => {})
    fetch('/api/profile').then(r => r.ok ? r.json() : null).then(d => {
      if (d?.currency_symbol) setSym(d.currency_symbol)
    }).catch(() => {})
  }, [])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setExpandedTool(null) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const askAskBiz = (prompt: string) => {
    router.push('/ask')
    setTimeout(() => window.dispatchEvent(new CustomEvent('askbiz:send', { detail: prompt })), 400)
  }

  const searchMarket = async () => {
    if (!mktQuery.trim()) return
    setMktLoading(true); setMktResult(null)
    try {
      const res = await fetch(`/api/market/products?q=${encodeURIComponent(mktQuery.trim())}`)
      setMktResult(await res.json())
    } catch { setMktResult({ error: 'Could not load.' }) }
    finally { setMktLoading(false) }
  }

  const openTool = (id: string, e: React.MouseEvent<HTMLDivElement>) => {
    // Calculate card centre relative to viewport for balloon origin
    const rect = e.currentTarget.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    setCardOrigin({ x: `${cx}px`, y: `${cy}px` })
    setExpandedTool(id)
  }

  const healthColour = health?.score != null
    ? health.score >= 65 ? '#22c55e' : health.score >= 45 ? '#f59e0b' : '#ef4444'
    : TX3

  const tools = getTools(sym)
  const activeTool = tools.find(t => t.id === expandedTool)

  return (
    <div className="page-shell">
      <div className="page-shell-header" style={{ minHeight: 'unset', padding: '8px 16px' }}>
        {/* Left: tools icon only */}
        <div style={{ opacity: 0.35 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
        </div>
        {/* Right: icon-only ghost button */}
        <div style={{ display: 'flex', gap: 4 }}>
          <button onClick={() => askAskBiz('Which of my business tools should I use first based on my current data?')}
            title="Ask AskBiz which tool to use"
            style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: 'transparent', color: 'var(--tx3)', opacity: 0.45, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </button>
        </div>
      </div>

      <div className="page-shell-body">
        {/* Context strip */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
          {[
            { label: 'Health Score',      value: health?.score != null ? `${health.score}/100` : '—', colour: healthColour },
            { label: 'Active Alerts',     value: alertCount > 0 ? `${alertCount} alerts` : 'All clear', colour: alertCount > 0 ? '#ef4444' : '#22c55e' },
            { label: 'Connected Sources', value: sourceCount > 0 ? `${sourceCount} connected` : 'None yet', colour: sourceCount > 0 ? '#6366f1' : TX3 },
          ].map(chip => (
            <div key={chip.label} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 14px', borderRadius: 9999, background: SF, border: `1px solid ${B}`, fontSize: 13 }}>
              <span style={{ color: TX3, fontSize: 12 }}>{chip.label}</span>
              <span style={{ fontWeight: 700, color: chip.colour, fontFamily: 'var(--font-sora)' }}>{chip.value}</span>
            </div>
          ))}
        </div>

        {/* Widget grid — always visible */}
        <div ref={gridRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
          {tools.map(tool => (
            <div key={tool.id} onClick={e => openTool(tool.id, e)}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.borderColor = tool.colour + '55'
                el.style.boxShadow = `0 8px 28px ${tool.colour}18`
                el.style.transform = 'translateY(-3px)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.borderColor = B
                el.style.boxShadow = 'none'
                el.style.transform = 'translateY(0)'
              }}
              style={{ borderRadius: 18, border: `1.5px solid ${B}`, background: SF, padding: '20px', cursor: 'pointer', transition: 'all 220ms ease', display: 'flex', flexDirection: 'column', userSelect: 'none', minHeight: 240 }}>
              {/* Header row */}
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
              <div style={{ flex: 1, marginBottom: 14 }}>
                {tool.preview}
              </div>

              {/* Expand hint */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600, color: tool.colour }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
                Expand
              </div>
            </div>
          ))}
        </div>

        {/* Quick prompts */}
        <div style={{ padding: '16px 18px', borderRadius: 14, background: EV, border: `1px solid ${B}` }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: TX3, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 12 }}>Or ask AskBiz directly</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[
              'What is my true landed cost on my best-selling product?',
              'Which of my suppliers is underperforming?',
              'Model my FX risk if sterling falls 10%',
              'Which export market should I enter first?',
              'Which products have the most social commerce potential?',
              'What is the market price for my best-selling product?',
            ].map((prompt, i) => (
              <button key={i} onClick={() => askAskBiz(prompt)}
                style={{ fontSize: 12, color: ACC, background: 'rgba(208,138,89,.08)', border: '1px solid rgba(208,138,89,.2)', borderRadius: 9999, padding: '6px 13px', cursor: 'pointer', fontFamily: 'inherit' }}>
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Balloon overlay ── */}
      {expandedTool && activeTool && (
        <>
          {/* Backdrop */}
          <div onClick={() => setExpandedTool(null)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(26,25,22,.45)', backdropFilter: 'blur(4px)', zIndex: 100, animation: 'fadeIn 200ms ease' }}
          />

          {/* Balloon panel — inflates from card centre */}
          <div style={{
            position: 'fixed',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'min(860px, 92vw)',
            maxHeight: '88vh',
            borderRadius: 22,
            background: SF,
            border: `1.5px solid ${activeTool.colour}30`,
            boxShadow: `0 32px 80px rgba(0,0,0,.22), 0 0 0 1px ${activeTool.colour}15`,
            zIndex: 101,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
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
              <button onClick={() => setExpandedTool(null)}
                style={{ width: 36, height: 36, borderRadius: 9999, border: `1px solid ${B}`, background: SF, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: TX2, flexShrink: 0, fontSize: 0 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>

            {/* Tool content — scrollable */}
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
                      placeholder="Search market prices — e.g. 'wireless earbuds UK'"
                      style={{ flex: 1, padding: '11px 14px', borderRadius: 10, border: `1.5px solid ${B}`, fontSize: 14, fontFamily: 'inherit', color: TX, outline: 'none', background: EV }} />
                    <button onClick={searchMarket} disabled={mktLoading}
                      style={{ padding: '11px 20px', borderRadius: 10, border: 'none', background: ACC, color: '#fff', fontSize: 14, fontWeight: 600, cursor: mktLoading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: mktLoading ? 0.7 : 1, whiteSpace: 'nowrap' }}>
                      {mktLoading ? 'Searching…' : 'Search'}
                    </button>
                  </div>
                  {!mktResult && !mktLoading && <div style={{ fontSize: 13, color: TX3 }}>Enter a product or category to search live market prices across channels and regions.</div>}
                  {mktResult?.error && <div style={{ padding: '14px 16px', borderRadius: 10, background: 'rgba(239,68,68,.07)', color: '#ef4444', fontSize: 14 }}>{mktResult.error}</div>}
                  {mktResult && !mktResult.error && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {(mktResult.products || mktResult.results || []).length === 0
                        ? <div style={{ fontSize: 14, color: TX3 }}>No results found.</div>
                        : (mktResult.products || mktResult.results || []).map((item: any, i: number) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: 10, border: `1px solid ${B}`, background: EV, gap: 12, flexWrap: 'wrap' }}>
                            <div style={{ fontWeight: 600, fontSize: 14, color: TX, flex: 1 }}>{item.name || item.title || item.product || '—'}</div>
                            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                              {(item.price != null || item.price_gbp != null) && (
                                <span style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: 15, color: ACC }}>
                                  {typeof (item.price ?? item.price_gbp) === 'number' ? `${sym}${(item.price ?? item.price_gbp).toFixed(2)}` : item.price ?? item.price_gbp}
                                </span>
                              )}
                              {item.channel && <span style={{ fontSize: 10, fontWeight: 700, color: '#0284c7', background: 'rgba(2,132,199,.08)', padding: '3px 9px', borderRadius: 9999, textTransform: 'uppercase', letterSpacing: '.06em' }}>{item.channel}</span>}
                              {item.region  && <span style={{ fontSize: 10, fontWeight: 700, color: '#16a34a', background: 'rgba(34,197,94,.08)', padding: '3px 9px', borderRadius: 9999, textTransform: 'uppercase', letterSpacing: '.06em' }}>{item.region}</span>}
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
        @media (max-width: 700px) {
          .tools-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
