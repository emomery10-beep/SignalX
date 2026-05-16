'use client'
import { useState } from 'react'

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

const REPORT_PROMPTS = [
  { label: 'P&L Summary', prompt: 'Give me a CFO-mode P&L summary for this period — use percentage-first language and highlight the most important variance.', icon: '📊' },
  { label: 'Cash Runway', prompt: 'How many months of cash runway do I have at current burn rate? What are the scenarios if revenue drops 10% or 20%?', icon: '💰' },
  { label: 'Margin Analysis', prompt: 'Analyse my gross margin by product category and flag anything that is eroding profitability versus last period.', icon: '📉' },
  { label: 'Board Report', prompt: 'Generate a board-ready one-page executive summary of my business performance this period, using percentage-first language throughout.', icon: '🏛️' },
  { label: 'Working Capital', prompt: 'Assess my working capital position — receivables, payables, inventory. Where are the cash conversion cycle bottlenecks?', icon: '🔄' },
  { label: 'Cost Structure', prompt: 'Break down my cost structure and identify the top 3 areas where I could reduce costs without impacting growth.', icon: '🔍' },
]

function MetricBlock({ label, value, sub, color }: { label: string; value: string; sub: string; color?: string }) {
  return (
    <div style={{ padding: '14px 16px', borderRadius: 12, border: '1px solid var(--b)', background: 'var(--sf)' }}>
      <div style={{ fontSize: 11, color: 'var(--tx3)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: color || 'var(--tx)', fontFamily: 'var(--font-sora, inherit)', marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--tx3)', lineHeight: 1.4 }}>{sub}</div>
    </div>
  )
}

export default function CfoMode({ health, onAsk }: CfoModeProps) {
  const [generating, setGenerating] = useState<string | null>(null)
  const [report, setReport] = useState<string | null>(null)
  const [reportTitle, setReportTitle] = useState('')

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
      setReport(data.answer_text || 'Report generated — no data available yet. Connect a data source to get real figures.')
    } catch {
      setReport('Could not generate report. Please try again.')
    } finally {
      setGenerating(null)
    }
  }

  return (
    <div style={{ maxWidth: 720 }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: 'var(--font-sora)', fontSize: 16, fontWeight: 700, marginBottom: 3 }}>CFO Mode</div>
        <div style={{ fontSize: 12, color: 'var(--tx3)' }}>Board-ready financial analysis · Percentage-first language · Executive summaries</div>
      </div>

      {/* Health component metrics grid */}
      {components.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10, marginBottom: 20 }}>
          {profitability && (
            <MetricBlock
              label="Profitability"
              value={`${profitability.score}/20`}
              sub={profitability.detail || profitability.label}
              color={scoreColor(profitability.score * 5)}
            />
          )}
          {liquidity && (
            <MetricBlock
              label="Liquidity"
              value={`${liquidity.score}/20`}
              sub={liquidity.detail || liquidity.label}
              color={scoreColor(liquidity.score * 5)}
            />
          )}
          {growth && (
            <MetricBlock
              label="Growth"
              value={`${growth.score}/20`}
              sub={growth.detail || growth.label}
              color={scoreColor(growth.score * 5)}
            />
          )}
          {inventory && (
            <MetricBlock
              label="Inventory"
              value={`${inventory.score}/20`}
              sub={inventory.detail || inventory.label}
              color={scoreColor(inventory.score * 5)}
            />
          )}
          {risk && (
            <MetricBlock
              label="Risk"
              value={`${risk.score}/20`}
              sub={risk.detail || risk.label}
              color={scoreColor(risk.score * 5)}
            />
          )}
        </div>
      )}

      {!components.length && (
        <div style={{ padding: '14px 16px', borderRadius: 12, border: '1px solid var(--b)', background: 'var(--sf)', marginBottom: 20, fontSize: 13, color: 'var(--tx3)' }}>
          Upload data or connect a source to see financial metrics here.
        </div>
      )}

      {/* Summary from health */}
      {health?.summary && (
        <div style={{ padding: '12px 16px', borderRadius: 12, background: 'var(--ev)', marginBottom: 20, fontSize: 13, color: 'var(--tx2)', lineHeight: 1.6 }}>
          {health.summary}
        </div>
      )}

      {/* Report buttons */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Generate a Report</div>
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
              <div style={{ fontSize: 16, marginBottom: 5 }}>{rp.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--tx)' }}>
                {generating === rp.label ? 'Generating...' : rp.label}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Generated report */}
      {report && (
        <div style={{ borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--b)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--tx)' }}>{reportTitle}</div>
            <button
              onClick={() => setReport(null)}
              style={{ fontSize: 11, color: 'var(--tx3)', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              Clear
            </button>
          </div>
          <div style={{ padding: '16px', fontSize: 13, color: 'var(--tx2)', lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>
            {report}
          </div>
          <div style={{ padding: '12px 16px', borderTop: '1px solid var(--b)', display: 'flex', gap: 10 }}>
            <button
              onClick={() => onAsk('Follow up on the CFO report: ' + reportTitle)}
              style={{ padding: '7px 14px', borderRadius: 8, border: '1px solid var(--b)', background: 'transparent', color: '#6366F1', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              Ask a follow-up →
            </button>
          </div>
        </div>
      )}

      {/* Generating state */}
      {generating && !report && (
        <div style={{ padding: '20px', borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid #6366F1', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
          <span style={{ fontSize: 13, color: 'var(--tx3)' }}>Generating {generating} report...</span>
        </div>
      )}
    </div>
  )
}
