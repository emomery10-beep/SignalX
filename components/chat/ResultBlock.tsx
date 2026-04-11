'use client'
import { useEffect, useRef } from 'react'
import type { AIResult } from '@/lib/ai'
import type { GeoResult } from '@/lib/geo'

interface Props {
  result: AIResult
  onFollowUp: (q: string) => void
  geo?: GeoResult | null
}

let chartCount = 0

export default function ResultBlock({ result, onFollowUp, geo }: Props) {
  const chartId = useRef(`sx-chart-${++chartCount}`).current
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstanceRef = useRef<unknown>(null)

  useEffect(() => {
    if (result.chart_type === 'none' || !result.chart_labels?.length || !chartRef.current) return

    const drawChart = async () => {
      const Chart = (await import('chart.js/auto')).default
      if (chartInstanceRef.current) (chartInstanceRef.current as { destroy: () => void }).destroy()

      const colors = [
        'rgba(30,212,202,.72)','rgba(146,104,248,.68)','rgba(245,166,35,.68)',
        'rgba(82,128,204,.68)','rgba(232,64,64,.65)',
      ]
      const gridColor = 'rgba(82,128,204,.07)'
      const tickStyle = { color: '#8aa4cc', font: { size: 11, family: 'DM Sans' } }

      const config = result.chart_type === 'pie' ? {
        type: 'pie' as const,
        data: {
          labels: result.chart_labels,
          datasets: [{ data: result.chart_values, backgroundColor: colors, borderWidth: 0 }],
        },
        options: {
          responsive: true,
          plugins: { legend: { position: 'right' as const, labels: { color: '#8aa4cc', font: { size: 11 }, boxWidth: 10 } },
            tooltip: { backgroundColor: 'rgba(13,26,53,.95)', borderColor: 'rgba(82,128,204,.25)', borderWidth: 1, titleColor: '#e6edf8', bodyColor: '#8aa4cc', padding: 9, cornerRadius: 8 } }
        },
      } : {
        type: (result.chart_type === 'line' || result.chart_type === 'area' ? 'line' : 'bar') as 'line' | 'bar',
        data: {
          labels: result.chart_labels,
          datasets: [{
            label: result.chart_label || 'Value',
            data: result.chart_values,
            backgroundColor: result.chart_type === 'line' || result.chart_type === 'area' ? 'rgba(30,212,202,.1)' : colors[0],
            borderColor: 'rgba(30,212,202,.9)',
            borderRadius: result.chart_type === 'bar' ? 4 : 0,
            fill: result.chart_type === 'area',
            tension: .4, borderWidth: result.chart_type !== 'bar' ? 2 : 0, pointRadius: 3,
          }],
        },
        options: {
          responsive: true, maintainAspectRatio: true,
          plugins: { legend: { display: false }, tooltip: { backgroundColor: 'rgba(13,26,53,.95)', borderColor: 'rgba(82,128,204,.25)', borderWidth: 1, titleColor: '#e6edf8', bodyColor: '#8aa4cc', padding: 9, cornerRadius: 8 } },
          scales: { x: { grid: { color: gridColor }, ticks: tickStyle }, y: { grid: { color: gridColor }, ticks: tickStyle } },
        },
      }

      chartInstanceRef.current = new Chart(chartRef.current!, config)
    }

    drawChart()
    return () => { if (chartInstanceRef.current) (chartInstanceRef.current as { destroy: () => void }).destroy() }
  }, [result])

  const dirColor = (dir?: string) => dir === 'up' ? '#1ed4ca' : dir === 'down' ? '#f48080' : 'var(--tx3)'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', maxWidth: '88%' }}>
      {/* Scope violation */}
      {result.scope_violation && (
        <div style={{ padding: '10px 14px', borderRadius: 13, borderBottomLeftRadius: 3, background: 'rgba(245,166,35,.07)', border: '1px solid rgba(245,166,35,.22)', fontSize: 13, lineHeight: 1.6, color: '#f5c55a' }}>
          {result.answer_text}
        </div>
      )}

      {/* Main answer */}
      {!result.scope_violation && (
        <div style={{ padding: '10px 14px', borderRadius: 13, borderBottomLeftRadius: 3, background: 'var(--ev)', border: '1px solid var(--b)', fontSize: 13, lineHeight: 1.6 }}
          dangerouslySetInnerHTML={{ __html: result.answer_text.replace(/\*\*(.*?)\*\*/g,'<strong style="color:#47e2da;font-weight:500">$1</strong>').replace(/\n/g,'<br/>') }}
        />
      )}

      {/* KPI cards */}
      {result.kpi_cards?.length > 0 && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {result.kpi_cards.map((k, i) => (
            <div key={i} style={{ padding: '10px 12px', borderRadius: 10, border: '1px solid var(--b)', background: 'var(--sf)', minWidth: 105 }}>
              <div style={{ fontSize: 10, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 3 }}>{k.label}</div>
              <div style={{ fontFamily: 'var(--font-sora,Sora,sans-serif)', fontSize: 18, fontWeight: 600, letterSpacing: '-.02em' }}>{k.value}</div>
              {k.delta && <div style={{ fontSize: 10, marginTop: 2, color: dirColor(k.dir) }}>{k.delta}</div>}
            </div>
          ))}
        </div>
      )}

      {/* Chart */}
      {result.chart_type !== 'none' && result.chart_labels?.length > 0 && (
        <div style={{ padding: 12, borderRadius: 10, border: '1px solid var(--b)', background: 'var(--sf)' }}>
          <div style={{ fontSize: 10, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 9, fontWeight: 500 }}>
            {result.chart_label}
          </div>
          <canvas ref={chartRef} height={result.chart_type === 'pie' ? 180 : 130}/>
        </div>
      )}

      {/* Table */}
      {result.table_headers?.length > 0 && result.table_rows?.length > 0 && (
        <div style={{ borderRadius: 10, border: '1px solid var(--b)', overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr>{result.table_headers.map((h, i) => <th key={i} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 10, fontWeight: 500, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.05em', background: 'var(--ev)', borderBottom: '1px solid var(--b)', whiteSpace: 'nowrap' }}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {result.table_rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j} style={{ padding: '8px 12px', borderBottom: i < result.table_rows.length - 1 ? '1px solid var(--b)' : 'none', color: 'var(--tx2)' }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Expansion candidates */}
      {result.expansion_candidates && result.expansion_candidates.length > 0 && (
        <div style={{ display:'flex', flexDirection:'column', gap:10, marginTop:4 }}>
          <div style={{ fontSize:11, fontWeight:600, color:'var(--tx3)', textTransform:'uppercase', letterSpacing:'.07em' }}>Top expansion opportunities</div>
          {result.expansion_candidates.map((c, i) => {
            const rc = c.risk === 'low' ? '#22c55e' : c.risk === 'medium' ? '#f5c55a' : '#f48080'
            const sc = c.score >= 70 ? '#1ed4ca' : c.score >= 50 ? '#f5c55a' : '#f48080'
            return (
              <div key={i} style={{ padding:'14px 16px', borderRadius:13, border:'1px solid var(--b2)', background:'var(--sf)' }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
                  <div style={{ fontFamily:'var(--font-sora,Sora,sans-serif)', fontSize:14, fontWeight:600 }}>{c.name}</div>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <span style={{ fontSize:11, padding:'2px 8px', borderRadius:9999, background:`${rc}22`, border:`1px solid ${rc}44`, color:rc, fontWeight:500 }}>{c.risk} risk</span>
                    <span style={{ fontFamily:'var(--font-sora,Sora,sans-serif)', fontSize:18, fontWeight:700, color:sc }}>{c.score}</span>
                  </div>
                </div>
                <div style={{ fontSize:12, color:'var(--tx2)', marginBottom:8, lineHeight:1.55 }}>{c.why}</div>
                <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                  <div style={{ padding:'4px 10px', borderRadius:8, background:'rgba(30,212,202,.09)', border:'1px solid rgba(30,212,202,.2)', fontSize:11, color:'#47e2da', fontWeight:500 }}>📊 {c.margin} margin</div>
                  <div style={{ padding:'4px 10px', borderRadius:8, background:'rgba(146,104,248,.09)', border:'1px solid rgba(146,104,248,.2)', fontSize:11, color:'#b49cfc' }}>🚀 {c.launch}</div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Simulator result */}
      {result.simulator_result && (
        <div style={{ padding:'14px 16px', borderRadius:13, border:'1px solid rgba(30,212,202,.28)', background:'rgba(30,212,202,.05)' }}>
          <div style={{ fontSize:11, fontWeight:600, color:'#47e2da', textTransform:'uppercase', letterSpacing:'.07em', marginBottom:10 }}>Simulation result</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:10 }}>
            {[
              { label:'Gross margin',    value:`${result.simulator_result.gross_margin_pct}%` },
              { label:'Monthly profit',  value:`${result.simulator_result.projected_monthly_profit >= 0 ? '+' : ''}${result.simulator_result.projected_monthly_profit.toLocaleString()}` },
              { label:'Break-even',      value:`${result.simulator_result.months_to_recover} months` },
              { label:'Verdict',         value: result.simulator_result.projected_monthly_profit > 0 ? '✓ Viable' : '✗ Not yet' },
            ].map((k,i) => (
              <div key={i} style={{ padding:'9px 11px', borderRadius:9, border:'1px solid var(--b)', background:'var(--sf)' }}>
                <div style={{ fontSize:10, color:'var(--tx3)', marginBottom:3 }}>{k.label}</div>
                <div style={{ fontFamily:'var(--font-sora,Sora,sans-serif)', fontSize:15, fontWeight:600 }}>{k.value}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize:12, color:'var(--tx2)', lineHeight:1.55 }}>{result.simulator_result.verdict}</div>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
        {result.source_note && (
          <span style={{ fontSize: 10, color: 'var(--tx3)', display: 'flex', alignItems: 'center', gap: 4, marginRight: 4 }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {result.source_note}
          </span>
        )}
        <button onClick={() => exportResult(result)} style={actBtn}>Export CSV</button>
        {result.follow_ups?.map((q, i) => (
          <button key={i} onClick={() => onFollowUp(q)} style={{ ...actBtn, color: '#47e2da', borderColor: 'rgba(30,212,202,.26)' }}>↗ {q}</button>
        ))}
      </div>
    </div>
  )
}

function exportResult(result: AIResult) {
  if (!result.table_headers?.length) return
  const csv = [result.table_headers.join(','), ...result.table_rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n')
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
  a.download = `signalx-${Date.now()}.csv`
  a.click()
}

const actBtn: React.CSSProperties = { padding: '5px 12px', borderRadius: 9999, border: '1px solid var(--b2)', background: 'transparent', color: 'var(--tx2)', fontFamily: 'inherit', fontSize: 11, fontWeight: 500, cursor: 'pointer' }

// ── Expansion candidates renderer (appended to ResultBlock exports) ──
export function ExpansionBlock({ candidates }: { candidates: Array<{ name: string; score: number; margin: string; risk: string; launch: string; why: string }> }) {
  const riskColor = (r: string) => r === 'low' ? '#22c55e' : r === 'medium' ? '#f5c55a' : '#f48080'
  const scoreColor = (s: number) => s >= 70 ? '#1ed4ca' : s >= 50 ? '#f5c55a' : '#f48080'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.07em' }}>
        Top expansion opportunities
      </div>
      {candidates.map((c, i) => (
        <div key={i} style={{ padding: '14px 16px', borderRadius: 13, border: '1px solid var(--b2)', background: 'var(--sf)', transition: 'border-color 180ms' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ fontFamily: 'var(--font-sora,Sora,sans-serif)', fontSize: 14, fontWeight: 600 }}>{c.name}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 9999, background: `${riskColor(c.risk)}22`, border: `1px solid ${riskColor(c.risk)}44`, color: riskColor(c.risk), fontWeight: 500 }}>
                {c.risk} risk
              </span>
              <span style={{ fontFamily: 'var(--font-sora,Sora,sans-serif)', fontSize: 18, fontWeight: 700, color: scoreColor(c.score) }}>
                {c.score}
              </span>
            </div>
          </div>
          <div style={{ fontSize: 12, color: 'var(--tx2)', marginBottom: 7, lineHeight: 1.55 }}>{c.why}</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <div style={{ padding: '4px 10px', borderRadius: 8, background: 'rgba(30,212,202,.09)', border: '1px solid rgba(30,212,202,.2)', fontSize: 11, color: '#47e2da', fontWeight: 500 }}>
              📊 Margin: {c.margin}
            </div>
            <div style={{ padding: '4px 10px', borderRadius: 8, background: 'rgba(146,104,248,.09)', border: '1px solid rgba(146,104,248,.2)', fontSize: 11, color: '#b49cfc' }}>
              🚀 {c.launch}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
