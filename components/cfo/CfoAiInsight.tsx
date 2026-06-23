'use client'
import { useState, useEffect } from 'react'
import { useLang } from '@/components/LanguageProvider'

interface Insight {
  title: string
  body: string
  type: 'opportunity' | 'risk' | 'action'
}

interface Props {
  data: any
  countryCode?: string | null
  onAsk?: (prompt: string) => void
}

const TYPE_CONFIG: Record<string, { color: string; bg: string; icon: string }> = {
  opportunity: { color: '#22C55E', bg: 'rgba(34,197,94,.06)', icon: '↗' },
  risk: { color: '#EF4444', bg: 'rgba(239,68,68,.06)', icon: '⚠' },
  action: { color: '#6366F1', bg: 'rgba(99,102,241,.06)', icon: '→' },
}

export default function CfoAiInsight({ data, countryCode, onAsk }: Props) {
  const { tc } = useLang()
  const [insights, setInsights] = useState<Insight[]>([])
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const fetchInsights = () => {
    if (!data?.totals || data.totals.revenue === 0) return
    setLoading(true)
    fetch('/api/cfo/ai-insight', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        totals: data.totals,
        comparison: data.comparison,
        inventory: data.inventory,
        cash: data.cash,
        alerts: data.alerts,
        logistics: data.logistics,
        sourceBreakdown: data.source_breakdown,
        countryCode,
      }),
    })
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d?.insights) setInsights(d.insights)
        setLoaded(true)
      })
      .catch(() => setLoaded(true))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (data?.totals && data.totals.revenue > 0 && !loaded) {
      fetchInsights()
    }
  }, [data?.totals?.revenue])

  if (!data?.totals || data.totals.revenue === 0) return null

  return (
    <div style={{ borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', overflow: 'hidden' }}>
      <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--b)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 3, height: 14, borderRadius: 2, background: '#6366F1' }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)' }}>{tc('cfo_aiinsight.sectionTitle')}</span>
          <span style={{ fontSize: 10, color: 'var(--tx3)', fontStyle: 'italic' }}>{tc('cfo_aiinsight.poweredBy')}</span>
        </div>
        <button
          onClick={fetchInsights}
          disabled={loading}
          style={{
            fontSize: 10, color: '#6366F1', background: 'rgba(99,102,241,.08)',
            border: 'none', borderRadius: 6, padding: '3px 8px', cursor: loading ? 'default' : 'pointer',
            fontWeight: 600, fontFamily: 'inherit', opacity: loading ? 0.5 : 1,
          }}
        >
          {loading ? tc('cfo_aiinsight.analyzingBtn') : tc('cfo_aiinsight.refreshBtn')}
        </button>
      </div>

      {loading && !insights.length && (
        <div style={{ padding: '20px 18px', textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: 'var(--tx3)', marginBottom: 4 }}>{tc('cfo_aiinsight.analyzingBody')}</div>
          <div style={{ height: 3, borderRadius: 2, background: 'var(--ev, #e5e5e5)', overflow: 'hidden', maxWidth: 200, margin: '0 auto' }}>
            <div style={{ height: '100%', width: '60%', background: '#6366F1', borderRadius: 2, animation: 'pulse 1s infinite' }} />
          </div>
        </div>
      )}

      {insights.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {insights.map((insight, i) => {
            const cfg = TYPE_CONFIG[insight.type] || TYPE_CONFIG.action
            return (
              <div
                key={i}
                style={{
                  padding: '12px 18px', borderTop: i > 0 ? '1px solid var(--b)' : undefined,
                  background: cfg.bg, display: 'flex', gap: 10, alignItems: 'flex-start',
                  cursor: onAsk ? 'pointer' : 'default',
                }}
                onClick={onAsk ? () => onAsk(tc('cfo_aiinsight.expandPrompt', { title: insight.title, body: insight.body })) : undefined}
              >
                <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>{cfg.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: cfg.color, marginBottom: 2 }}>{insight.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--tx2)', lineHeight: 1.5 }}>{insight.body}</div>
                </div>
                {onAsk && <span style={{ fontSize: 9, color: 'var(--tx3)', flexShrink: 0, marginTop: 2 }}>{tc('cfo_aiinsight.askAi')}</span>}
              </div>
            )
          })}
        </div>
      )}

      {loaded && !insights.length && !loading && (
        <div style={{ padding: '16px 18px', textAlign: 'center', color: 'var(--tx3)', fontSize: 12 }}>
          {tc('cfo_aiinsight.noInsights')}
        </div>
      )}
    </div>
  )
}
