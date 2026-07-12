'use client'
import { useState } from 'react'
import { useLang } from '@/components/LanguageProvider'

interface HealthData {
  score?: number
  label?: string
  components?: Array<{ name: string; score: number; label: string; status: string; detail?: string }>
  summary?: string
  topIssue?: string | null
}

interface CfoModeProps {
  health: HealthData | null
  onAsk: (prompt: string) => void
}

function buildReportPrompts(tc: (key: string) => string) {
  return [
    { label: tc('intel_cfomode.plSummaryLabel'), prompt: tc('intel_cfomode.plSummaryPrompt'), icon: '📊' },
    { label: tc('intel_cfomode.cashRunwayLabel'), prompt: tc('intel_cfomode.cashRunwayPrompt'), icon: '💰' },
    { label: tc('intel_cfomode.marginAnalysisLabel'), prompt: tc('intel_cfomode.marginAnalysisPrompt'), icon: '📉' },
    { label: tc('intel_cfomode.boardReportLabel'), prompt: tc('intel_cfomode.boardReportPrompt'), icon: '🏛️' },
    { label: tc('intel_cfomode.workingCapitalLabel'), prompt: tc('intel_cfomode.workingCapitalPrompt'), icon: '🔄' },
    { label: tc('intel_cfomode.costStructureLabel'), prompt: tc('intel_cfomode.costStructurePrompt'), icon: '🔍' },
  ]
}

function MetricBlock({ label, value, sub, color }: { label: string; value: string; sub: string; color?: string }) {
  return (
    <div style={{ padding: '14px 16px', borderRadius: 12, border: '1px solid var(--b)', background: 'var(--sf)' }}>
      <div style={{ fontSize: 9, color: 'var(--tx3)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 700, color: color || 'var(--tx)', fontFamily: 'var(--font-sora, inherit)', marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 9, color: 'var(--tx3)', lineHeight: 1.4 }}>{sub}</div>
    </div>
  )
}

export default function CfoMode({ health, onAsk }: CfoModeProps) {
  const { tc } = useLang()
  const [generating, setGenerating] = useState<string | null>(null)
  const [report, setReport] = useState<string | null>(null)
  const [reportTitle, setReportTitle] = useState('')

  const REPORT_PROMPTS = buildReportPrompts(tc)

  const components = health?.components || []
  const profitability = components.find(c => c.name?.toLowerCase().includes('profit'))
  const liquidity     = components.find(c => c.name?.toLowerCase().includes('liquid') || c.name?.toLowerCase().includes('cash'))
  const growth        = components.find(c => c.name?.toLowerCase().includes('growth'))
  const risk          = components.find(c => c.name?.toLowerCase().includes('risk'))
  const inventory     = components.find(c => c.name?.toLowerCase().includes('inventor'))

  function scoreColor(score: number) {
    if (score >= 65) return '#22C55E'
    if (score >= 45) return '#F59E0B'
    return '#EF4444'
  }

  async function generateReport(prompt: string, title: string) {
    setGenerating(title)
    setReport(null)
    setReportTitle(title)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: prompt }],
          streaming: false,
          mode: 'cfo',
        }),
      })
      const data = await res.json()
      setReport(data.answer_text || tc('intel_cfomode.reportFallback'))
    } catch {
      setReport(tc('intel_cfomode.reportError'))
    } finally {
      setGenerating(null)
    }
  }

  return (
    <div style={{ maxWidth: 720 }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: 'var(--font-sora)', fontSize: 14, fontWeight: 700, marginBottom: 3 }}>{tc('intel_cfomode.header')}</div>
        <div style={{ fontSize: 10, color: 'var(--tx3)' }}>{tc('intel_cfomode.headerSub')}</div>
      </div>

      {/* Health component metrics grid */}
      {components.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10, marginBottom: 20 }}>
          {profitability && (
            <MetricBlock
              label={tc('intel_cfomode.metricProfitability')}
              value={`${profitability.score}/20`}
              sub={profitability.detail || profitability.label}
              color={scoreColor(profitability.score * 5)}
            />
          )}
          {liquidity && (
            <MetricBlock
              label={tc('intel_cfomode.metricLiquidity')}
              value={`${liquidity.score}/20`}
              sub={liquidity.detail || liquidity.label}
              color={scoreColor(liquidity.score * 5)}
            />
          )}
          {growth && (
            <MetricBlock
              label={tc('intel_cfomode.metricGrowth')}
              value={`${growth.score}/20`}
              sub={growth.detail || growth.label}
              color={scoreColor(growth.score * 5)}
            />
          )}
          {inventory && (
            <MetricBlock
              label={tc('intel_cfomode.metricInventory')}
              value={`${inventory.score}/20`}
              sub={inventory.detail || inventory.label}
              color={scoreColor(inventory.score * 5)}
            />
          )}
          {risk && (
            <MetricBlock
              label={tc('intel_cfomode.metricRisk')}
              value={`${risk.score}/20`}
              sub={risk.detail || risk.label}
              color={scoreColor(risk.score * 5)}
            />
          )}
        </div>
      )}

      {!components.length && (
        <div style={{ padding: '14px 16px', borderRadius: 12, border: '1px solid var(--b)', background: 'var(--sf)', marginBottom: 20, fontSize: 11, color: 'var(--tx3)' }}>
          {tc('intel_cfomode.noDataMessage')}
        </div>
      )}

      {/* Summary from health */}
      {health?.summary && (
        <div style={{ padding: '12px 16px', borderRadius: 12, background: 'var(--ev)', marginBottom: 20, fontSize: 11, color: 'var(--tx2)', lineHeight: 1.6 }}>
          {health.summary}
        </div>
      )}

      {/* Report buttons */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>{tc('intel_cfomode.generateReportLabel')}</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
          {REPORT_PROMPTS.map(rp => (
            <button
              key={rp.label}
              onClick={() => generateReport(rp.prompt, rp.label)}
              disabled={!!generating}
              style={{
                padding: '12px 14px',
                borderRadius: 11,
                border: '1px solid var(--b)',
                background: generating === rp.label ? '#6366F110' : 'var(--sf)',
                textAlign: 'left',
                cursor: generating ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                opacity: generating && generating !== rp.label ? 0.55 : 1,
                transition: 'all 150ms',
              }}
              onMouseEnter={e => { if (!generating) e.currentTarget.style.borderColor = '#6366F1' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--b)' }}
            >
              <div style={{ fontSize: 14, marginBottom: 5 }}>{rp.icon}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx)' }}>
                {generating === rp.label ? tc('intel_cfomode.generating') : rp.label}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Generated report */}
      {report && (
        <div style={{ borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--b)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx)' }}>{reportTitle}</div>
            <button
              onClick={() => setReport(null)}
              style={{ fontSize: 9, color: 'var(--tx3)', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              {tc('intel_cfomode.clearButton')}
            </button>
          </div>
          <div style={{ padding: '16px', fontSize: 11, color: 'var(--tx2)', lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>
            {report}
          </div>
          <div style={{ padding: '12px 16px', borderTop: '1px solid var(--b)', display: 'flex', gap: 10 }}>
            <button
              onClick={() => onAsk(tc('intel_cfomode.followUpPrompt').replace('{title}', reportTitle))}
              style={{ padding: '7px 14px', borderRadius: 8, border: '1px solid var(--b)', background: 'transparent', color: '#6366F1', fontSize: 10, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              {tc('intel_cfomode.followUpButton')}
            </button>
          </div>
        </div>
      )}

      {/* Generating state */}
      {generating && !report && (
        <div style={{ padding: '20px', borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid #6366F1', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
          <span style={{ fontSize: 11, color: 'var(--tx3)' }}>{tc('intel_cfomode.generatingReport').replace('{title}', generating)}</span>
        </div>
      )}
    </div>
  )
}
