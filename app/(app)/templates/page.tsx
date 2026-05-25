'use client'
import { usePlan } from '@/lib/hooks/usePlan'
import FeatureGate from '@/components/gates/FeatureGate'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

interface Template { id: string; name: string; description: string; biz_type: string; questions: string[]; icon: string }

const BIZ_FILTERS = [
  { value: '', label: 'All',          emoji: '✦' },
  { value: 'retail', label: 'Retail',        emoji: '🏪' },
  { value: 'ecommerce', label: 'Ecommerce',     emoji: '🛒' },
  { value: 'distributor', label: 'Distributor',   emoji: '🚚' },
  { value: 'exporter', label: 'Exporter',      emoji: '🌍' },
]

const ACCENT_COLORS: Record<string, { color: string; bg: string }> = {
  retail:      { color: '#d08a59', bg: 'rgba(208,138,89,.1)' },
  ecommerce:   { color: '#8c6fe0', bg: 'rgba(140,111,224,.1)' },
  distributor: { color: '#22c55e', bg: 'rgba(34,197,94,.1)' },
  exporter:    { color: '#47e2da', bg: 'rgba(71,226,218,.1)' },
  default:     { color: '#f5c55a', bg: 'rgba(245,197,90,.1)' },
}

export default function TemplatesPage() {
  const { planId, loading: planLoading } = usePlan()
  const router = useRouter()
  const [templates, setTemplates] = useState<Template[]>([])
  const [filter, setFilter] = useState<string>('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [usingTemplate, setUsingTemplate] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const url = filter ? `/api/templates?biz_type=${filter}` : '/api/templates'
      const res = await fetch(url)
      const data = await res.json()
      setTemplates(data || [])
      setLoading(false)
    }
    load()
  }, [filter])

  const useTemplate = (q: string) => {
    setUsingTemplate(q)
    setTimeout(() => {
      sessionStorage.setItem('signalx-prefill', q)
      router.push('/ask')
    }, 300)
  }

  const filtered = templates.filter(t =>
    !search || t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.description.toLowerCase().includes(search.toLowerCase()) ||
    t.questions.some(q => q.toLowerCase().includes(search.toLowerCase()))
  )

  if (!planLoading && planId === 'free') {
    return (
      <FeatureGate planId={planId} feature='templates' featureName='Industry Templates' planNeeded='growth'>
        <></>
      </FeatureGate>
    )
  }

  return (
    <>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        .tmpl-card { transition: border-color 200ms, box-shadow 200ms, transform 200ms; }
        .tmpl-card:hover { border-color: var(--b2) !important; box-shadow: 0 4px 20px rgba(0,0,0,.08); transform: translateY(-2px); }
        .tmpl-q { transition: background 140ms, transform 120ms; }
        .tmpl-q:hover { background: var(--ev) !important; transform: translateX(3px); }
        .tmpl-filter { padding: 7px 14px; border-radius: 9999px; border: 1px solid var(--b2); background: transparent; color: var(--tx2); font-family: inherit; font-size: 12px; cursor: pointer; transition: all 150ms; white-space: nowrap; }
        .tmpl-filter.active { border-color: rgba(208,138,89,.45); background: rgba(208,138,89,.1); color: var(--acc); font-weight: 600; }
      `}</style>

      <div className="page-shell">

        {/* Header */}
        <div style={{ padding: 'clamp(14px,4vw,22px) clamp(14px,3vw,24px) 14px', borderBottom: '1px solid var(--b)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-sora)', fontSize: 20, fontWeight: 700, letterSpacing: '-.025em' }}>Industry Templates</div>
              <div style={{ fontSize: 13, color: 'var(--tx2)', marginTop: 3 }}>
                {loading ? 'Loading…' : `${filtered.length} template${filtered.length !== 1 ? 's' : ''} — click any question to use it`}
              </div>
            </div>
          </div>

          {/* Search + filters row */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Search */}
            <div style={{ position: 'relative', flex: 1, minWidth: 200, maxWidth: 320 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--tx3)" strokeWidth="2" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                placeholder="Search templates or questions…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ width: '100%', paddingLeft: 32, paddingRight: 12, paddingTop: 8, paddingBottom: 8, fontSize: 13, background: 'var(--bg)', border: '1px solid var(--b2)', borderRadius: 10, color: 'var(--tx)', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
              />
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {BIZ_FILTERS.map(f => (
                <button key={f.value} className={`tmpl-filter${filter === f.value ? ' active' : ''}`} onClick={() => setFilter(f.value)}>
                  {f.emoji} {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="page-shell-body" style={{ padding: 'clamp(14px,3vw,20px) clamp(14px,3vw,24px)' }}>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 14 }}>
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} style={{ height: 190, borderRadius: 16, background: 'var(--ev)', animation: 'shimmer 1.4s infinite', backgroundSize: '200% 100%' }}/>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--tx3)' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>No templates found</div>
              <div style={{ fontSize: 13 }}>Try a different search or business type filter</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 14 }}>
              {filtered.map(t => {
                const ac = ACCENT_COLORS[t.biz_type] || ACCENT_COLORS.default
                const isExpanded = expanded === t.id
                return (
                  <div key={t.id} className="tmpl-card"
                    style={{ background: 'var(--sf)', border: '1px solid var(--b)', borderRadius: 18, overflow: 'hidden', position: 'relative' }}>

                    {/* Accent strip */}
                    <div style={{ height: 3, background: ac.color, opacity: 0.6 }}/>

                    {/* Card header */}
                    <div style={{ padding: '16px 18px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10, gap: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 40, height: 40, borderRadius: 12, background: ac.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                            {t.icon}
                          </div>
                          <div>
                            <div style={{ fontFamily: 'var(--font-sora)', fontSize: 14, fontWeight: 700 }}>{t.name}</div>
                            <div style={{ fontSize: 11, color: ac.color, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 1 }}>{t.biz_type}</div>
                          </div>
                        </div>
                        <div style={{ padding: '3px 9px', borderRadius: 9999, background: ac.bg, fontSize: 11, color: ac.color, fontWeight: 600, flexShrink: 0, whiteSpace: 'nowrap' }}>
                          {t.questions.length} questions
                        </div>
                      </div>

                      <div style={{ fontSize: 13, color: 'var(--tx2)', lineHeight: 1.6, marginBottom: 12 }}>{t.description}</div>

                      {/* Quick preview of first question */}
                      {!isExpanded && t.questions[0] && (
                        <div
                          onClick={() => useTemplate(t.questions[0])}
                          style={{ padding: '9px 12px', borderRadius: 10, background: ac.bg, border: `1px solid ${ac.color}33`, cursor: 'pointer', fontSize: 12, color: 'var(--tx)', lineHeight: 1.5, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, transition: 'opacity 150ms', opacity: usingTemplate === t.questions[0] ? 0.6 : 1 }}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={ac.color} strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                          <span style={{ flex: 1 }}>{t.questions[0]}</span>
                          <span style={{ color: ac.color, fontWeight: 600, flexShrink: 0 }}>Use →</span>
                        </div>
                      )}

                      <button onClick={() => setExpanded(isExpanded ? null : t.id)}
                        style={{ fontSize: 12, color: ac.color, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span>{isExpanded ? '↑ Hide' : `↓ See all ${t.questions.length} questions`}</span>
                      </button>
                    </div>

                    {/* Expanded questions */}
                    {isExpanded && (
                      <div style={{ borderTop: '1px solid var(--b)', padding: '12px 18px' }}>
                        {t.questions.map((q, i) => (
                          <div key={i} className="tmpl-q"
                            onClick={() => useTemplate(q)}
                            style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 10px', borderRadius: 10, cursor: 'pointer', marginBottom: 4, background: 'transparent', opacity: usingTemplate === q ? 0.6 : 1 }}>
                            <div style={{ width: 20, height: 20, borderRadius: 6, background: ac.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={ac.color} strokeWidth="2.5" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                            </div>
                            <span style={{ fontSize: 12, color: 'var(--tx)', flex: 1, lineHeight: 1.5 }}>{q}</span>
                            <span style={{ fontSize: 10, color: ac.color, fontWeight: 600, flexShrink: 0 }}>Use</span>
                          </div>
                        ))}
                        <button onClick={() => useTemplate(t.questions[0])}
                          style={{ width: '100%', marginTop: 10, padding: '10px', borderRadius: 9999, border: 'none', background: ac.color, color: '#fff', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, cursor: 'pointer', letterSpacing: '-.01em' }}>
                          Use first question in chat →
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
