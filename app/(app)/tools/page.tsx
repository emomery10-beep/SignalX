'use client'
import { useState, useEffect } from 'react'
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

const TOOLS = [
  {
    id: 'fx',
    label: 'FX Risk Modeller',
    icon: '💱',
    desc: 'Model the impact of sterling depreciation on your import costs and product margins.',
    colour: '#6366F1',
    bg: 'rgba(99,102,241,.06)',
    tags: ['Importers', 'Currency'],
  },
  {
    id: 'suppliers',
    label: 'Supplier Scorecard',
    icon: '🏭',
    desc: 'Grade your suppliers A–F on on-time delivery, delay days, customs holds, and financial impact.',
    colour: '#16a34a',
    bg: 'rgba(34,197,94,.06)',
    tags: ['Shipments', 'Auto-populated'],
  },
  {
    id: 'landed',
    label: 'Landed Cost Calculator',
    icon: '🧮',
    desc: 'Calculate your true cost per unit including freight, duty, VAT, and FX — then see your actual margin.',
    colour: ACC,
    bg: 'rgba(208,138,89,.06)',
    tags: ['Importers', 'Margin'],
  },
  {
    id: 'export',
    label: 'Export Market Scoring',
    icon: '🌍',
    desc: 'Score 20 export markets by opportunity, logistics, UK brand premium, and product-category match.',
    colour: '#0284c7',
    bg: 'rgba(2,132,199,.06)',
    tags: ['Export', 'Growth'],
  },
  {
    id: 'social',
    label: 'Social Commerce',
    icon: '📱',
    desc: 'Track TikTok Shop, Instagram, and Pinterest conversion rates, demand signals, and viral products.',
    colour: '#E1306C',
    bg: 'rgba(225,48,108,.06)',
    tags: ['Social', 'Demand signals'],
  },
  {
    id: 'market',
    label: 'Market Intelligence',
    icon: '🌍',
    desc: 'Search real market prices across channels and regions — merchant data pooled with live web signals.',
    colour: '#d08a59',
    bg: 'rgba(208,138,89,.06)',
    tags: ['Pricing', 'Export', 'Growth+'],
  },
]

export default function ToolsPage() {
  const router = useRouter()
  const [activeTool, setActiveTool] = useState<string | null>(null)

  // Check URL param for deep link
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const tool = params.get('tool')
    if (tool && TOOLS.some(t => t.id === tool)) setActiveTool(tool)
  }, [])

  const askAskBiz = (prompt: string) => {
    router.push('/ask')
    setTimeout(() => window.dispatchEvent(new CustomEvent('askbiz:send', { detail: prompt })), 400)
  }

  const activeMeta = TOOLS.find(t => t.id === activeTool)

  const openTool = (id: string) => {
    if (id === 'market') { router.push('/intelligence?tab=market'); return }
    setActiveTool(id)
  }

  return (
    <div className="page-shell">
      {/* Header */}
      <div className="page-shell-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {activeTool && (
            <button
              onClick={() => setActiveTool(null)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 9, border: `1px solid ${B}`, background: 'transparent', fontSize: 13, color: TX2, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M19 12H5M12 5l-7 7 7 7"/>
              </svg>
              All tools
            </button>
          )}
          <div>
            <div style={{ fontFamily: 'var(--font-sora)', fontSize: 18, fontWeight: 600 }}>
              {activeMeta ? `${activeMeta.icon} ${activeMeta.label}` : 'Business Tools'}
            </div>
            <div style={{ fontSize: 13, color: 'var(--tx2)', marginTop: 3 }}>
              {activeMeta ? activeMeta.desc : 'Pre-filled from your connected data — review and calculate'}
            </div>
          </div>
        </div>
        {!activeTool && (
          <button
            onClick={() => askAskBiz('Which of my business tools should I use first based on my current data?')}
            style={{ padding: '8px 16px', borderRadius: 9999, border: 'none', background: ACC, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            Ask AskBiz which tool to use →
          </button>
        )}
      </div>

      <div className="page-shell-body">
        {/* Tool grid — shown when no tool selected */}
        {!activeTool && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14, marginBottom: 24 }}>
              {TOOLS.map(tool => (
                <button
                  key={tool.id}
                  onClick={() => openTool(tool.id)}
                  style={{ textAlign: 'left', padding: '20px', borderRadius: 16, border: `1px solid ${B}`, background: SF, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 150ms', display: 'flex', flexDirection: 'column', gap: 0 }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = tool.colour + '50'
                    e.currentTarget.style.boxShadow = `0 4px 20px ${tool.colour}15`
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = B
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: tool.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 14 }}>
                    {tool.icon}
                  </div>
                  <div style={{ fontFamily: 'var(--font-sora)', fontSize: 15, fontWeight: 600, color: TX, marginBottom: 7 }}>
                    {tool.label}
                  </div>
                  <div style={{ fontSize: 13, color: TX2, lineHeight: 1.6, marginBottom: 14, flex: 1 }}>
                    {tool.desc}
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {tool.tags.map(tag => (
                      <span key={tag} style={{ fontSize: 10, fontWeight: 600, color: tool.colour, background: tool.bg, padding: '2px 8px', borderRadius: 9999, textTransform: 'uppercase', letterSpacing: '.06em' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div style={{ marginTop: 14, fontSize: 13, fontWeight: 600, color: tool.colour, display: 'flex', alignItems: 'center', gap: 5 }}>
                    Open tool
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                </button>
              ))}
            </div>

            {/* Quick ask prompts */}
            <div style={{ padding: '16px 18px', borderRadius: 14, background: EV, border: `1px solid ${B}` }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: TX3, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 12 }}>
                Or ask AskBiz directly
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {[
                  'What is my true landed cost on my best-selling product?',
                  'Which of my suppliers is underperforming?',
                  'Model my FX risk if sterling falls 10%',
                  'Which export market should I enter first?',
                  'Which products have the most social commerce potential?',
                  'What is the market price for my best-selling product?',
                ].map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => askAskBiz(prompt)}
                    style={{ fontSize: 12, color: ACC, background: 'rgba(208,138,89,.08)', border: '1px solid rgba(208,138,89,.2)', borderRadius: 9999, padding: '6px 13px', cursor: 'pointer', fontFamily: 'inherit' }}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Active tool */}
        {activeTool === 'fx'        && <FXRisk onAsk={askAskBiz}/>}
        {activeTool === 'suppliers' && <SupplierScorecard onAsk={askAskBiz}/>}
        {activeTool === 'landed'    && <LandedCost onAsk={askAskBiz}/>}
        {activeTool === 'export'    && <ExportMarkets onAsk={askAskBiz}/>}
        {activeTool === 'social'    && <SocialCommerce onAsk={askAskBiz}/>}
      </div>
    </div>
  )
}
