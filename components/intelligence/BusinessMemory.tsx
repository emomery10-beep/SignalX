'use client'
import { useEffect, useState } from 'react'
import { useLang } from '@/components/LanguageProvider'

interface MemoryFact {
  id: string
  category: string
  key: string
  value: string
  confidence: 'high' | 'medium' | 'low'
  source: string
  updated_at: string
}

interface Props {
  onAsk?: (s: string) => void
}

function buildCatConfig(tc: (k: string) => string): Record<string, { label: string; icon: string; color: string; bg: string }> {
  return {
    finance:    { label: tc('intel_businessmemory.catFinance'),    icon: '💰', color: '#16a34a', bg: 'rgba(34,197,94,.07)' },
    product:    { label: tc('intel_businessmemory.catProduct'),    icon: '📦', color: '#db2777', bg: 'rgba(236,72,153,.07)' },
    operations: { label: tc('intel_businessmemory.catOperations'), icon: '⚙️', color: '#d97706', bg: 'rgba(245,158,11,.07)' },
    market:     { label: tc('intel_businessmemory.catMarket'),     icon: '🌍', color: '#0891b2', bg: 'rgba(6,182,212,.07)' },
    goal:       { label: tc('intel_businessmemory.catGoal'),       icon: '🎯', color: '#7c3aed', bg: 'rgba(139,92,246,.07)' },
    challenge:  { label: tc('intel_businessmemory.catChallenge'),  icon: '⚠️', color: '#dc2626', bg: 'rgba(239,68,68,.07)' },
    context:    { label: tc('intel_businessmemory.catContext'),    icon: '🏢', color: '#6366F1', bg: 'rgba(99,102,241,.07)' },
  }
}

function buildConfStyle(tc: (k: string) => string): Record<string, { label: string; color: string }> {
  return {
    high:   { label: tc('intel_businessmemory.confHigh'),   color: '#16a34a' },
    medium: { label: tc('intel_businessmemory.confMedium'), color: '#d97706' },
    low:    { label: tc('intel_businessmemory.confLow'),    color: '#9ca3af' },
  }
}

export default function BusinessMemory({ onAsk }: Props) {
  const { tc } = useLang()
  const [facts, setFacts] = useState<MemoryFact[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>('all')

  const CAT_CONFIG = buildCatConfig(tc)
  const CONF_STYLE = buildConfStyle(tc)

  useEffect(() => {
    fetch('/api/memory')
      .then(r => r.json())
      .then(d => setFacts(d.facts || []))
      .finally(() => setLoading(false))
  }, [])

  const deleteFact = async (id: string) => {
    setDeleting(id)
    try {
      const res = await fetch('/api/memory', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (res.ok) setFacts(f => f.filter(x => x.id !== id))
    } finally {
      setDeleting(null)
    }
  }

  const categories = ['all', ...Object.keys(CAT_CONFIG).filter(c => facts.some(f => f.category === c))]
  const filtered = activeCategory === 'all' ? facts : facts.filter(f => f.category === activeCategory)

  const grouped: Record<string, MemoryFact[]> = {}
  for (const fact of filtered) {
    if (!grouped[fact.category]) grouped[fact.category] = []
    grouped[fact.category].push(fact)
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14, gap: 12 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)' }}>{tc('intel_businessmemory.heading')}</div>
          <div style={{ fontSize: 10, color: 'var(--tx3)', marginTop: 2 }}>
            {tc('intel_businessmemory.subheading')}
          </div>
        </div>
        {onAsk && facts.length > 0 && (
          <button
            onClick={() => onAsk(tc('intel_businessmemory.askBizPrompt'))}
            style={{ flexShrink: 0, fontSize: 10, fontWeight: 600, color: '#6366F1', background: 'rgba(99,102,241,.08)', border: '1px solid rgba(99,102,241,.2)', borderRadius: 9999, padding: '6px 12px', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
            {tc('intel_businessmemory.askBizBtn')}
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 48, borderRadius: 10 }}></div>)}
        </div>
      ) : facts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '32px 20px', borderRadius: 14, border: '1px dashed var(--b)', color: 'var(--tx3)' }}>
          <div style={{ fontSize: 26, marginBottom: 10 }}>🧠</div>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx2)', marginBottom: 6 }}>{tc('intel_businessmemory.emptyTitle')}</div>
          <div style={{ fontSize: 10, maxWidth: 300, margin: '0 auto', lineHeight: 1.6 }}>
            {tc('intel_businessmemory.emptyBody')}
          </div>
          {onAsk && (
            <button
              onClick={() => onAsk(tc('intel_businessmemory.emptyBtnPrompt'))}
              style={{ marginTop: 14, fontSize: 10, fontWeight: 600, color: '#6366F1', background: 'rgba(99,102,241,.08)', border: '1px solid rgba(99,102,241,.2)', borderRadius: 9999, padding: '7px 14px', cursor: 'pointer', fontFamily: 'inherit' }}>
              {tc('intel_businessmemory.emptyBtn')}
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Stats bar */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
            <div style={{ padding: '8px 14px', borderRadius: 10, background: 'rgba(99,102,241,.06)', border: '1px solid rgba(99,102,241,.12)', fontSize: 10 }}>
              <span style={{ fontWeight: 700, color: '#6366F1', marginRight: 5 }}>{facts.length}</span>
              <span style={{ color: 'var(--tx3)' }}>{tc('intel_businessmemory.statsFactsLearned')}</span>
            </div>
            <div style={{ padding: '8px 14px', borderRadius: 10, background: 'rgba(34,197,94,.06)', border: '1px solid rgba(34,197,94,.12)', fontSize: 10 }}>
              <span style={{ fontWeight: 700, color: '#16a34a', marginRight: 5 }}>{facts.filter(f => f.confidence === 'high').length}</span>
              <span style={{ color: 'var(--tx3)' }}>{tc('intel_businessmemory.statsHighConfidence')}</span>
            </div>
            <div style={{ padding: '8px 14px', borderRadius: 10, background: 'var(--sf)', border: '1px solid var(--b)', fontSize: 10 }}>
              <span style={{ fontWeight: 700, color: 'var(--tx2)', marginRight: 5 }}>{Object.keys(grouped).length}</span>
              <span style={{ color: 'var(--tx3)' }}>{tc('intel_businessmemory.statsCategories')}</span>
            </div>
          </div>

          {/* Category filter */}
          <div className="tab-strip" style={{ gap: 6, marginBottom: 16, paddingBottom: 2 }}>
            {categories.map(cat => {
              const cfg = CAT_CONFIG[cat]
              const active = activeCategory === cat
              return (
                <button key={cat} onClick={() => setActiveCategory(cat)}
                  style={{ flexShrink: 0, padding: '5px 12px', borderRadius: 9999, border: `1px solid ${active ? (cfg?.color || '#6366F1') : 'var(--b)'}`, background: active ? (cfg?.bg || 'rgba(99,102,241,.08)') : 'transparent', color: active ? (cfg?.color || '#6366F1') : 'var(--tx3)', fontSize: 10, fontWeight: active ? 600 : 400, cursor: 'pointer', fontFamily: 'inherit' }}>
                  {cat === 'all' ? tc('intel_businessmemory.filterAll', { n: facts.length }) : `${cfg?.icon} ${cfg?.label}`}
                </button>
              )
            })}
          </div>

          {/* Facts grouped by category */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {Object.entries(grouped).map(([cat, catFacts]) => {
              const cfg = CAT_CONFIG[cat] || { label: cat, icon: '📌', color: '#6366F1', bg: 'rgba(99,102,241,.07)' }
              const factCountKey = catFacts.length !== 1 ? 'intel_businessmemory.factCountPlural' : 'intel_businessmemory.factCount'
              return (
                <div key={cat} style={{ borderRadius: 14, border: '1px solid var(--b)', overflow: 'hidden' }}>
                  <div style={{ padding: '10px 14px', background: cfg.bg, borderBottom: '1px solid var(--b)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 12 }}>{cfg.icon}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: cfg.color, textTransform: 'uppercase', letterSpacing: '.06em' }}>{cfg.label}</span>
                    <span style={{ fontSize: 9, color: 'var(--tx3)', marginLeft: 'auto' }}>{tc(factCountKey, { n: catFacts.length })}</span>
                  </div>
                  <div style={{ background: 'var(--sf)' }}>
                    {catFacts.map((fact, i) => {
                      const conf = CONF_STYLE[fact.confidence] || CONF_STYLE.medium
                      return (
                        <div key={fact.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderBottom: i < catFacts.length - 1 ? '1px solid var(--b)' : 'none' }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 9, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 2 }}>
                              {fact.key.replace(/_/g, ' ')}
                            </div>
                            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx)', lineHeight: 1.4 }}>
                              {fact.value}
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                            <span style={{ fontSize: 9, fontWeight: 600, color: conf.color, background: `${conf.color}15`, borderRadius: 6, padding: '2px 7px' }}>
                              {conf.label}
                            </span>
                            <button
                              onClick={() => deleteFact(fact.id)}
                              disabled={deleting === fact.id}
                              title={tc('intel_businessmemory.removeFactTitle')}
                              style={{ width: 24, height: 24, borderRadius: 6, border: '1px solid var(--b)', background: 'transparent', color: 'var(--tx3)', fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: deleting === fact.id ? 0.4 : 1, transition: 'all 150ms' }}
                              onMouseEnter={e => { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.color = '#ef4444' }}
                              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--b)'; e.currentTarget.style.color = 'var(--tx3)' }}>
                              ×
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>

          <div style={{ marginTop: 14, fontSize: 9, color: 'var(--tx3)', textAlign: 'center', lineHeight: 1.6 }}>
            {tc('intel_businessmemory.footer')}
          </div>
        </>
      )}
    </div>
  )
}
