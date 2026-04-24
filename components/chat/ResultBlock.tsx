'use client'
import { useState } from 'react'
import ShareableInsight from './ShareableInsight'
import VerdictBar from './VerdictBar'
import ScenarioBlock from './ScenarioBlock'
import CompetitorWatch from './CompetitorWatch'
import CFOBlock from './CFOBlock'

interface KpiCard { label: string; value: string; trend?: 'up'|'down'|'neutral'; status?: 'good'|'warning'|'risk' }
interface ChartPoint { label: string; revenue?: number; cost?: number; profit?: number }

interface AIResult {
  answer_text: string
  insight_header?: string
  confidence?: string
  chart_type?: string
  chart_labels?: string[]
  chart_values?: number[]
  chart_label?: string
  kpi_cards?: KpiCard[]
  table_headers?: string[]
  table_rows?: string[][]
  recommendations?: string[]
  action_buttons?: { label: string; query: string }[]
  follow_up_suggestions?: string[]
  scope_violation?: boolean
  // Decision Engine
  verdict?: 'act' | 'watch' | 'problem' | null
  verdict_sentence?: string
  // Scenario
  scenario_before?: { label: string; value: string }[]
  scenario_after?: { label: string; value: string }[]
  scenario_summary?: string
  // Competitor
  competitor_data?: { source: string; price: string; delta: string; position: 'cheaper'|'parity'|'expensive' }[]
  market_position?: 'cheapest' | 'competitive' | 'premium' | 'overpriced'
  // CFO
  cfo_summary?: string
  cfo_metrics?: { label: string; value: string; change: string; direction: 'up'|'down'|'flat' }[]
}

interface Props {
  result: AIResult
  question?: string
  onFollowUp: (q: string) => void
  geo?: { currencySymbol?: string } | null
  cfoMode?: boolean
}

// ── MINI CHART (no external lib needed) ──────────────────────────────────────
function MiniLineChart({ labels, values, label, symbol }: { labels: string[]; values: number[]; label: string; symbol: string }) {
  if (!values?.length || values.length < 2) return null
  const max = Math.max(...values)
  const min = Math.min(...values)
  const range = max - min || 1
  const w = 420, h = 120, pad = 32

  const pts = values.map((v, i) => {
    const x = pad + (i / (values.length - 1)) * (w - pad * 2)
    const y = pad + (1 - (v - min) / range) * (h - pad * 2)
    return `${x},${y}`
  }).join(' ')

  const fillPts = `${pad},${h - pad} ` + pts + ` ${w - pad},${h - pad}`

  return (
    <div style={{ margin: '0 0 16px', padding: '14px 16px', borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)' }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx3)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.06em' }}>{label}</div>
      <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
        <defs>
          <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d08a59" stopOpacity="0.2"/>
            <stop offset="100%" stopColor="#d08a59" stopOpacity="0"/>
          </linearGradient>
        </defs>
        <polygon points={fillPts} fill="url(#chartFill)"/>
        <polyline points={pts} fill="none" stroke="#d08a59" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        {values.map((v, i) => {
          const x = pad + (i / (values.length - 1)) * (w - pad * 2)
          const y = pad + (1 - (v - min) / range) * (h - pad * 2)
          return <circle key={i} cx={x} cy={y} r="3" fill="#d08a59"/>
        })}
        {labels.map((l, i) => {
          const x = pad + (i / (labels.length - 1)) * (w - pad * 2)
          return <text key={i} x={x} y={h - 6} textAnchor="middle" fontSize="9" fill="var(--tx3)">{l}</text>
        })}
        <text x={pad - 4} y={pad + 4} textAnchor="end" fontSize="9" fill="var(--tx3)">{symbol}{Math.round(max).toLocaleString()}</text>
        <text x={pad - 4} y={h - pad + 4} textAnchor="end" fontSize="9" fill="var(--tx3)">{symbol}{Math.round(min).toLocaleString()}</text>
      </svg>
    </div>
  )
}

// ── KPI CARD ──────────────────────────────────────────────────────────────────
function KpiCardBlock({ cards }: { cards: KpiCard[] }) {
  const statusColor = (s?: string) => s === 'good' ? '#22c55e' : s === 'warning' ? '#f59e0b' : s === 'risk' ? '#ef4444' : 'var(--tx3)'
  const statusBg = (s?: string) => s === 'good' ? 'rgba(34,197,94,.08)' : s === 'warning' ? 'rgba(245,158,11,.08)' : s === 'risk' ? 'rgba(239,68,68,.08)' : 'var(--ev)'
  const trendIcon = (t?: string) => t === 'up' ? '↑' : t === 'down' ? '↓' : ''
  const trendColor = (t?: string) => t === 'up' ? '#22c55e' : t === 'down' ? '#ef4444' : 'var(--tx3)'

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(120px,1fr))', gap: 8, marginBottom: 16 }}>
      {cards.map((c, i) => (
        <div key={i} style={{ padding: '10px 12px', borderRadius: 12, background: statusBg(c.status), border: `1px solid ${c.status ? statusColor(c.status) + '40' : 'var(--b)'}` }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--tx3)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.06em' }}>{c.label}</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: c.status ? statusColor(c.status) : 'var(--tx)', fontFamily: 'var(--font-sora)' }}>{c.value}</span>
            {c.trend && <span style={{ fontSize: 11, color: trendColor(c.trend) }}>{trendIcon(c.trend)}</span>}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── MAIN RESULT BLOCK ─────────────────────────────────────────────────────────
export default function ResultBlock({ result, question, onFollowUp, geo, cfoMode }: Props) {
  const [expanded, setExpanded] = useState(false)
  const sym = geo?.currencySymbol || '$'

  if (result.scope_violation) {
    return (
      <div style={{ padding: '12px 14px', borderRadius: 13, background: 'var(--ev)', border: '1px solid var(--b)', fontSize: 13, color: 'var(--tx2)', lineHeight: 1.6 }}>
        {result.answer_text}
      </div>
    )
  }

  const hasChart = result.chart_type && result.chart_type !== 'none' && result.chart_labels?.length && result.chart_values?.length
  const hasKpis = result.kpi_cards && result.kpi_cards.length > 0
  const hasTable = result.table_headers?.length && result.table_rows?.length
  const hasRecs = result.recommendations && result.recommendations.length > 0
  const hasActions = result.action_buttons && result.action_buttons.length > 0
  const hasFollowUps = result.follow_up_suggestions && result.follow_up_suggestions.length > 0
  const hasInsightHeader = result.insight_header && result.insight_header.trim()
  const hasScenario = result.scenario_before?.length && result.scenario_after?.length
  const hasCompetitor = result.competitor_data && result.competitor_data.length > 0
  const hasCfo = cfoMode && (result.cfo_summary || result.cfo_metrics?.length)

  const handlePdfExport = () => {
    const content = [
      result.insight_header || '',
      '',
      result.answer_text,
      '',
      result.cfo_summary || '',
      '',
      ...(result.cfo_metrics || []).map(m => `${m.label}: ${m.value} (${m.change})`),
      '',
      ...(result.recommendations || []).map((r, i) => `${i + 1}. ${r}`),
    ].join('\n')

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `askbiz-cfo-report-${new Date().toISOString().slice(0,10)}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div style={{ fontSize: 13, lineHeight: 1.65 }}>

      {/* 0. Verdict bar — ALWAYS first */}
      <VerdictBar
        verdict={result.verdict}
        sentence={result.verdict_sentence}
        marketPosition={result.market_position}
      />

      {/* 1. CFO block (CFO mode only) */}
      {hasCfo && (
        <CFOBlock
          summary={result.cfo_summary}
          metrics={result.cfo_metrics}
          onExportPdf={handlePdfExport}
        />
      )}

      {/* 2. Insight header — always shown in normal mode */}
      {hasInsightHeader && !hasCfo && (
        <div style={{ padding: '12px 14px', borderRadius: 12, background: 'rgba(99,102,241,.05)', border: '1px solid rgba(99,102,241,.15)', marginBottom: 12, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 16, flexShrink: 0 }}>💡</span>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: 'var(--tx)', lineHeight: 1.6 }}>{result.insight_header}</p>
        </div>
      )}

      {/* 3. KPI cards — CFO mode only */}
      {cfoMode && hasKpis && <KpiCardBlock cards={result.kpi_cards!}/>}

      {/* 4. Chart — CFO mode only */}
      {cfoMode && hasChart && (
        <MiniLineChart
          labels={result.chart_labels!}
          values={result.chart_values!}
          label={result.chart_label || result.chart_type || 'Trend'}
          symbol={sym}
        />
      )}

      {/* 4. Answer text */}
      <div style={{ padding: '12px 14px', borderRadius: 13, background: 'var(--ev)', border: '1px solid var(--b)', marginBottom: hasRecs || hasTable || hasActions || hasFollowUps || hasScenario || hasCompetitor ? 12 : 0 }}
        dangerouslySetInnerHTML={{ __html: result.answer_text
          .replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--tx);font-weight:600">$1</strong>')
          .replace(/\n/g, '<br/>')
        }}/>

      {/* 4a. Scenario block */}
      {hasScenario && (
        <ScenarioBlock
          before={result.scenario_before!}
          after={result.scenario_after!}
          summary={result.scenario_summary}
          verdict={result.verdict}
        />
      )}

      {/* 4b. Competitor watch */}
      {hasCompetitor && (
        <CompetitorWatch
          data={result.competitor_data!}
          marketPosition={result.market_position}
        />
      )}

      {/* 5. Table — CFO mode only */}
      {cfoMode && hasTable && (
        <div style={{ marginBottom: 12, borderRadius: 12, border: '1px solid var(--b)', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ background: 'var(--ev)' }}>
                  {result.table_headers!.map((h, i) => (
                    <th key={i} style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, color: 'var(--tx2)', borderBottom: '1px solid var(--b)', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.table_rows!.map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--b)', background: i % 2 === 0 ? 'var(--sf)' : 'var(--bg)' }}>
                    {row.map((cell, j) => (
                      <td key={j} style={{ padding: '7px 12px', color: 'var(--tx2)' }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. Recommendations */}
      {hasRecs && (
        <div style={{ padding: '12px 14px', borderRadius: 13, border: '1px solid var(--b)', background: 'var(--sf)', marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 10 }}>🎯 Recommendations</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {result.recommendations!.map((r, i) => (
              <div key={i} style={{ display: 'flex', gap: 9, alignItems: 'flex-start' }}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'rgba(208,138,89,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: 'var(--acc)', flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
                <span style={{ fontSize: 13, color: 'var(--tx2)', lineHeight: 1.55 }}>{r}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. Action buttons */}
      {hasActions && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
          {result.action_buttons!.map((btn, i) => (
            <button key={i} onClick={() => onFollowUp(btn.query)}
              style={{ padding: '8px 14px', borderRadius: 9999, border: '1px solid var(--b2)', background: 'var(--sf)', color: 'var(--tx)', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 150ms', display: 'flex', alignItems: 'center', gap: 5 }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = 'var(--ev)'}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'var(--sf)'}>
              {btn.label}
            </button>
          ))}
        </div>
      )}

      {/* Share insight button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
        <ShareableInsight
          question={question || 'Business insight from AskBiz'}
          result={result}
        />
      </div>

      {/* 8. Follow-up suggestions */}}
      {hasFollowUps && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {result.follow_up_suggestions!.slice(0, 2).map((s, i) => (
            <button key={i} onClick={() => onFollowUp(s)}
              style={{ padding: '8px 12px', borderRadius: 10, border: '1px solid rgba(208,138,89,.25)', background: 'rgba(208,138,89,.04)', color: 'var(--acc)', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', transition: 'all 150ms', display: 'flex', alignItems: 'center', gap: 7 }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = 'rgba(208,138,89,.08)'}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'rgba(208,138,89,.04)'}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              {s}
            </button>
          ))}
        </div>
      )}

    </div>
  )
}
