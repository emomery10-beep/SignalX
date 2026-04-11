'use client'
import { usePlan } from '@/lib/hooks/usePlan'
import FeatureGate from '@/components/gates/FeatureGate'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Upload { id: string; filename: string; column_names: string[] }
interface ForecastResult {
  labels: string[]; actual: (number|null)[]; predicted: number[]
  upperBound: number[]; lowerBound: number[]
  trend: string; trendPct: number; accuracy: number; method: string; summary: string
}

export default function ForecastsPage() {
  const { planId, loading: planLoading } = usePlan()
  const supabase = createClient()
  const [uploads, setUploads] = useState<Upload[]>([])
  const [selectedUpload, setSelectedUpload] = useState<Upload | null>(null)
  const [targetColumn, setTargetColumn] = useState('')
  const [horizon, setHorizon] = useState(14)
  const [method, setMethod] = useState<'linear'|'moving_avg'|'seasonal'>('linear')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ForecastResult | null>(null)
  const [error, setError] = useState('')
  const [savedForecasts, setSavedForecasts] = useState<{id:string;name:string;accuracy:number;method:string;created_at:string}[]>([])
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstanceRef = useRef<unknown>(null)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const [{ data: ups }, { data: forecasts }] = await Promise.all([
        supabase.from('uploads').select('id, filename, column_names').eq('user_id', user.id).eq('status', 'parsed').order('created_at', { ascending: false }),
        supabase.from('forecasts').select('id, name, accuracy, method, created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(10),
      ])
      setUploads(ups || [])
      setSavedForecasts(forecasts || [])
    }
    load()
  }, [supabase])

  useEffect(() => {
    if (!result || !chartRef.current) return
    const draw = async () => {
      const Chart = (await import('chart.js/auto')).default
      if (chartInstanceRef.current) (chartInstanceRef.current as {destroy:()=>void}).destroy()
      const ctx = chartRef.current!.getContext('2d')!
      chartInstanceRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: result.labels,
          datasets: [
            { label: 'Actual', data: result.actual, borderColor: 'rgba(30,212,202,.9)', backgroundColor: 'transparent', borderWidth: 2, pointRadius: 3, spanGaps: false },
            { label: 'Forecast', data: result.predicted.map((v, i) => result.actual[i] === null ? v : null), borderColor: 'rgba(146,104,248,.9)', backgroundColor: 'rgba(146,104,248,.08)', borderWidth: 2, borderDash: [5,3], fill: false, spanGaps: false, pointRadius: 2 },
            { label: 'Upper bound', data: result.upperBound.map((v, i) => result.actual[i] === null ? v : null), borderColor: 'transparent', backgroundColor: 'rgba(146,104,248,.08)', fill: '+1', pointRadius: 0 },
            { label: 'Lower bound', data: result.lowerBound.map((v, i) => result.actual[i] === null ? v : null), borderColor: 'transparent', backgroundColor: 'transparent', fill: false, pointRadius: 0 },
          ]
        },
        options: {
          responsive: true, interaction: { mode: 'index', intersect: false },
          plugins: { legend: { labels: { color: '#8aa4cc', font: { size: 11 }, boxWidth: 10 } }, tooltip: { backgroundColor: 'rgba(13,26,53,.95)', titleColor: '#e6edf8', bodyColor: '#8aa4cc', padding: 10, cornerRadius: 8 } },
          scales: { x: { grid: { color: 'rgba(82,128,204,.07)' }, ticks: { color: '#8aa4cc', font: { size: 10 }, maxTicksLimit: 12 } }, y: { grid: { color: 'rgba(82,128,204,.07)' }, ticks: { color: '#8aa4cc', font: { size: 10 } } } }
        }
      })
    }
    draw()
  }, [result])

  const runForecast = async () => {
    if (!selectedUpload || !targetColumn) return
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uploadId: selectedUpload.id, targetColumn, horizonDays: horizon, method }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResult(data)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Forecast failed')
    } finally { setLoading(false) }
  }

  const trendColor = result?.trend === 'up' ? '#1ed4ca' : result?.trend === 'down' ? '#f48080' : '#8aa4cc'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid var(--b)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-sora)', fontSize: 18, fontWeight: 600, letterSpacing: '-.02em' }}>Demand Forecasting</div>
          <div style={{ fontSize: 13, color: 'var(--tx2)', marginTop: 3 }}>Predict future trends using your uploaded data</div>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 20 }}>

          {/* Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ background: 'var(--sf)', border: '1px solid var(--b)', borderRadius: 14, padding: 18 }}>
              <div style={sectionLabel}>Configuration</div>

              <div style={formGroup}>
                <label style={labelStyle}>Dataset</label>
                <select style={selectStyle} value={selectedUpload?.id || ''} onChange={e => {
                  const up = uploads.find(u => u.id === e.target.value) || null
                  setSelectedUpload(up); setTargetColumn(''); setResult(null)
                }}>
                  <option value="">Choose a file…</option>
                  {uploads.map(u => <option key={u.id} value={u.id}>{u.filename}</option>)}
                </select>
              </div>

              {selectedUpload && (
                <div style={formGroup}>
                  <label style={labelStyle}>Column to forecast</label>
                  <select style={selectStyle} value={targetColumn} onChange={e => setTargetColumn(e.target.value)}>
                    <option value="">Choose a column…</option>
                    {selectedUpload.column_names?.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              )}

              <div style={formGroup}>
                <label style={labelStyle}>Forecast horizon (days)</label>
                <select style={selectStyle} value={horizon} onChange={e => setHorizon(Number(e.target.value))}>
                  <option value={7}>7 days</option>
                  <option value={14}>14 days</option>
                  <option value={30}>30 days</option>
                  <option value={60}>60 days</option>
                  <option value={90}>90 days</option>
                </select>
              </div>

              <div style={formGroup}>
                <label style={labelStyle}>Method</label>
                <select style={selectStyle} value={method} onChange={e => setMethod(e.target.value as 'linear'|'moving_avg'|'seasonal')}>
                  <option value="linear">Linear regression</option>
                  <option value="moving_avg">Moving average</option>
                  <option value="seasonal">Seasonal decomposition</option>
                </select>
              </div>

              {error && <div style={{ color: '#f48080', fontSize: 12, marginBottom: 10, padding: '8px 10px', background: 'rgba(232,64,64,.08)', borderRadius: 8 }}>{error}</div>}

              <button onClick={runForecast} disabled={loading || !selectedUpload || !targetColumn}
                style={{ width: '100%', padding: '10px', borderRadius: 9999, border: 'none', background: (!selectedUpload || !targetColumn) ? 'var(--b2)' : '#1ed4ca', color: '#04080f', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, cursor: (!selectedUpload || !targetColumn) ? 'not-allowed' : 'pointer' }}>
                {loading ? 'Running forecast…' : 'Run forecast →'}
              </button>
            </div>

            {/* Saved forecasts */}
            {savedForecasts.length > 0 && (
              <div style={{ background: 'var(--sf)', border: '1px solid var(--b)', borderRadius: 14, padding: 18 }}>
                <div style={sectionLabel}>Recent forecasts</div>
                {savedForecasts.map(f => (
                  <div key={f.id} style={{ padding: '8px 0', borderBottom: '1px solid var(--b)', fontSize: 12 }}>
                    <div style={{ fontWeight: 500, marginBottom: 2 }}>{f.name}</div>
                    <div style={{ color: 'var(--tx3)' }}>{f.method} · {f.accuracy?.toFixed(0)}% accuracy · {new Date(f.created_at).toLocaleDateString()}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Chart area */}
          <div>
            {!result ? (
              <div style={{ background: 'var(--sf)', border: '1px solid var(--b)', borderRadius: 14, padding: 48, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--tx3)" strokeWidth="1.5" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                <div style={{ fontSize: 15, fontWeight: 500 }}>Choose a dataset and column to forecast</div>
                <div style={{ fontSize: 13, color: 'var(--tx3)', maxWidth: 320 }}>SignalX will fit a trend model to your historical data and project it forward with confidence bands.</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* KPI row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
                  {[
                    { label: 'Trend', value: result.trend.toUpperCase(), color: trendColor },
                    { label: 'Change', value: `${result.trendPct > 0 ? '+' : ''}${result.trendPct.toFixed(1)}%`, color: trendColor },
                    { label: 'Accuracy', value: `${result.accuracy.toFixed(0)}%`, color: 'var(--tx)' },
                    { label: 'Method', value: result.method.split(' ')[0], color: 'var(--tx2)' },
                  ].map((k, i) => (
                    <div key={i} style={{ padding: '12px 14px', borderRadius: 12, border: '1px solid var(--b)', background: 'var(--sf)' }}>
                      <div style={{ fontSize: 10, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 4 }}>{k.label}</div>
                      <div style={{ fontFamily: 'var(--font-sora)', fontSize: 18, fontWeight: 600, color: k.color }}>{k.value}</div>
                    </div>
                  ))}
                </div>
                {/* Chart */}
                <div style={{ background: 'var(--sf)', border: '1px solid var(--b)', borderRadius: 14, padding: 18 }}>
                  <div style={{ fontSize: 11, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 10, fontWeight: 500 }}>
                    {targetColumn} — {horizon}-day forecast
                  </div>
                  <canvas ref={chartRef} height={200}/>
                </div>
                {/* Summary */}
                <div style={{ padding: '14px 16px', borderRadius: 12, border: '1px solid var(--b)', background: 'var(--sf)', fontSize: 13, color: 'var(--tx2)', lineHeight: 1.65 }}>
                  {result.summary}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const sectionLabel: React.CSSProperties = { fontSize: 11, fontWeight: 500, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 14 }
const formGroup: React.CSSProperties = { marginBottom: 12 }
const labelStyle: React.CSSProperties = { display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--tx2)', marginBottom: 5 }
const selectStyle: React.CSSProperties = { fontFamily: 'inherit', fontSize: 13, color: 'var(--tx)', background: 'var(--ev)', border: '1px solid var(--b2)', borderRadius: 10, padding: '9px 12px', outline: 'none', width: '100%' }
