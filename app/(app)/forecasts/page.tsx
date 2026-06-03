'use client'
import { usePlan } from '@/lib/hooks/usePlan'
import FeatureGate from '@/components/gates/FeatureGate'
import { useState, useEffect, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { detectNumericColumns } from '@/lib/forecast'
import type { MethodComparison, DataStats } from '@/lib/forecast'

interface Upload { id: string; filename: string; column_names: string[] }
interface SourceDataset { id: string; name: string; sourceType: 'ecommerce' | 'pos'; columns: string[]; rowCount: number }
interface ForecastResult {
  labels: string[]; actual: (number|null)[]; predicted: number[]
  upperBound: number[]; lowerBound: number[]
  trend: string; trendPct: number; accuracy: number; method: string; methodKey: string; summary: string
  decomposition?: { trend: number[]; seasonal: number[]; residual: number[] }
  dataQuality?: { score: number; issues: string[]; rowCount: number; outliers: number }
  backtest?: { mae: number; rmse: number; mape: number; r2: number }
  anomalies?: { index: number; value: number; expected: number; severity: 'high' | 'medium' }[]
}
interface SavedForecast { id: string; name: string; accuracy: number; method: string; created_at: string; target_column: string; horizon_days: number; result?: ForecastResult }
interface WhatIfResult { base: ForecastResult; modified: ForecastResult; impactPct: number; impactSummary: string }

type Tab = 'overview' | 'decomposition' | 'comparison' | 'whatif' | 'data'
type Method = 'linear' | 'moving_avg' | 'seasonal' | 'exponential' | 'auto'

const PLAN_ORDER = ['free', 'growth', 'business']
const isBusiness = (p: string) => PLAN_ORDER.indexOf(p) >= PLAN_ORDER.indexOf('business')

export default function ForecastsPage() {
  const { planId, loading: planLoading } = usePlan()
  const supabase = createClient()

  // Core state
  const [uploads, setUploads] = useState<Upload[]>([])
  const [sourceDatasets, setSourceDatasets] = useState<SourceDataset[]>([])
  const [selectedUpload, setSelectedUpload] = useState<Upload | null>(null)
  const [selectedSource, setSelectedSource] = useState<SourceDataset | null>(null)
  const [sourceRows, setSourceRows] = useState<Record<string, unknown>[] | null>(null)
  const [targetColumn, setTargetColumn] = useState('')
  const [horizon, setHorizon] = useState(14)
  const [method, setMethod] = useState<Method>('auto')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ForecastResult | null>(null)
  const [error, setError] = useState('')
  const [numericColumns, setNumericColumns] = useState<string[]>([])
  const [savedForecasts, setSavedForecasts] = useState<SavedForecast[]>([])
  const [forecastName, setForecastName] = useState('')
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [confidence, setConfidence] = useState(1.5)
  const [scenario, setScenario] = useState<'base'|'optimistic'|'pessimistic'>('base')

  // Pro state
  const [comparison, setComparison] = useState<MethodComparison[] | null>(null)
  const [comparingMethods, setComparingMethods] = useState(false)
  const [stats, setStats] = useState<DataStats | null>(null)
  const [overlayForecasts, setOverlayForecasts] = useState<SavedForecast[]>([])
  const [whatIfChange, setWhatIfChange] = useState(-20)
  const [whatIfStart, setWhatIfStart] = useState(0)
  const [whatIfEnd, setWhatIfEnd] = useState(0)
  const [whatIfResult, setWhatIfResult] = useState<WhatIfResult | null>(null)
  const [whatIfLoading, setWhatIfLoading] = useState(false)
  const [shareUrl, setShareUrl] = useState('')
  const [showShareModal, setShowShareModal] = useState(false)
  const [pdfLoading, setPdfLoading] = useState(false)

  // Chart refs
  const chartRef = useRef<HTMLCanvasElement>(null)
  const decompRef = useRef<HTMLCanvasElement>(null)
  const whatIfChartRef = useRef<HTMLCanvasElement>(null)
  const overlayChartRef = useRef<HTMLCanvasElement>(null)
  const chartInstanceRef = useRef<unknown>(null)
  const decompInstanceRef = useRef<unknown>(null)
  const whatIfChartInstanceRef = useRef<unknown>(null)
  const overlayChartInstanceRef = useRef<unknown>(null)

  // ── Load data ──────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const [{ data: ups }, { data: forecasts }, sourcesRes] = await Promise.all([
        supabase.from('uploads').select('id, filename, column_names').eq('user_id', user.id).eq('status', 'parsed').order('created_at', { ascending: false }),
        supabase.from('forecasts').select('id, name, accuracy, method, created_at, target_column, horizon_days, result').eq('user_id', user.id).order('created_at', { ascending: false }).limit(15),
        fetch('/api/forecast/sources').then(r => r.json()).catch(() => ({ datasets: [] })),
      ])
      setUploads(ups || [])
      setSavedForecasts(forecasts || [])
      setSourceDatasets(sourcesRes.datasets || [])
    }
    load()
  }, [supabase])

  // ── Scenario modifier ─────────────────────────────────────
  const scenarioData = useCallback((r: ForecastResult) => {
    if (scenario === 'base') return r
    const mult = scenario === 'optimistic' ? 1.15 : 0.85
    return {
      ...r,
      predicted: r.predicted.map((v, i) => r.actual[i] !== null ? v : v * mult),
      upperBound: r.upperBound.map((v, i) => r.actual[i] !== null ? v : v * (scenario === 'optimistic' ? 1.2 : 1)),
      lowerBound: r.lowerBound.map((v, i) => r.actual[i] !== null ? v : v * (scenario === 'pessimistic' ? 0.7 : 1)),
    }
  }, [scenario])

  // ── Main chart ─────────────────────────────────────────────
  useEffect(() => {
    if (!result || !chartRef.current || activeTab !== 'overview') return
    const draw = async () => {
      const Chart = (await import('chart.js/auto')).default
      if (chartInstanceRef.current) (chartInstanceRef.current as {destroy:()=>void}).destroy()
      const r = scenarioData(result)
      const ctx = chartRef.current!.getContext('2d')!

      const datasets: unknown[] = [
        { label: 'Actual', data: r.actual, borderColor: 'rgba(30,212,202,.9)', backgroundColor: 'transparent', borderWidth: 2, pointRadius: 2, spanGaps: false },
        { label: 'Forecast', data: r.predicted.map((v, i) => r.actual[i] === null ? v : null), borderColor: 'rgba(146,104,248,.9)', backgroundColor: 'rgba(146,104,248,.08)', borderWidth: 2, borderDash: [5,3], fill: false, spanGaps: false, pointRadius: 2 },
        { label: 'Confidence', data: r.upperBound.map((v, i) => r.actual[i] === null ? v : null), borderColor: 'transparent', backgroundColor: 'rgba(146,104,248,.08)', fill: '+1', pointRadius: 0 },
        { label: '', data: r.lowerBound.map((v, i) => r.actual[i] === null ? v : null), borderColor: 'transparent', backgroundColor: 'transparent', fill: false, pointRadius: 0 },
      ]

      // Anomaly markers
      if (r.anomalies?.length) {
        const anomalyData = r.labels.map(() => null as number | null)
        r.anomalies.forEach(a => { anomalyData[a.index] = a.value })
        datasets.push({
          label: 'Anomaly', data: anomalyData, borderColor: 'transparent', backgroundColor: 'rgba(244,128,128,.9)',
          pointRadius: r.labels.map((_, i) => anomalyData[i] !== null ? 6 : 0),
          pointStyle: 'triangle', showLine: false, pointBorderColor: '#f48080', pointBorderWidth: 2,
        })
      }

      // Overlay forecasts
      const colors = ['rgba(245,197,90,.7)', 'rgba(140,111,224,.7)', 'rgba(34,197,94,.7)']
      overlayForecasts.forEach((of, idx) => {
        if (of.result) {
          datasets.push({
            label: `${of.name || of.target_column} (${new Date(of.created_at).toLocaleDateString()})`,
            data: of.result.predicted.map((v, i) => of.result!.actual[i] === null ? v : null),
            borderColor: colors[idx % colors.length], borderWidth: 1.5, borderDash: [3,3],
            pointRadius: 0, fill: false, spanGaps: false,
          })
        }
      })

      chartInstanceRef.current = new Chart(ctx, {
        type: 'line',
        data: { labels: r.labels, datasets: datasets as any },
        options: {
          responsive: true, animation: { duration: 600, easing: 'easeOutQuart' },
          interaction: { mode: 'index', intersect: false },
          plugins: {
            legend: { labels: { color: '#8aa4cc', font: { size: 11 }, boxWidth: 10, filter: (item: any) => item.text !== '' } },
            tooltip: { backgroundColor: 'rgba(13,26,53,.95)', titleColor: '#e6edf8', bodyColor: '#8aa4cc', padding: 10, cornerRadius: 8 },
          },
          scales: {
            x: { grid: { color: 'rgba(82,128,204,.07)' }, ticks: { color: '#8aa4cc', font: { size: 10 }, maxTicksLimit: 12 } },
            y: { grid: { color: 'rgba(82,128,204,.07)' }, ticks: { color: '#8aa4cc', font: { size: 10 } } },
          },
        }
      })
    }
    draw()
  }, [result, scenario, scenarioData, activeTab, overlayForecasts])

  // ── Decomposition chart ────────────────────────────────────
  useEffect(() => {
    if (!result?.decomposition || !decompRef.current || activeTab !== 'decomposition') return
    const draw = async () => {
      const Chart = (await import('chart.js/auto')).default
      if (decompInstanceRef.current) (decompInstanceRef.current as {destroy:()=>void}).destroy()
      const d = result.decomposition!
      const labels = result.labels.slice(0, d.trend.length)
      const ctx = decompRef.current!.getContext('2d')!
      decompInstanceRef.current = new Chart(ctx, {
        type: 'line',
        data: { labels, datasets: [
          { label: 'Trend', data: d.trend, borderColor: '#1ed4ca', borderWidth: 2, pointRadius: 0, fill: false },
          { label: 'Seasonal', data: d.seasonal, borderColor: '#f5c55a', borderWidth: 1.5, pointRadius: 0, fill: { target: 'origin', above: 'rgba(245,197,90,.06)', below: 'rgba(245,197,90,.06)' } },
          { label: 'Residual', data: d.residual, borderColor: '#f48080', borderWidth: 1, pointRadius: 0, borderDash: [3,3], fill: false },
        ]},
        options: {
          responsive: true, animation: { duration: 600 },
          interaction: { mode: 'index', intersect: false },
          plugins: { legend: { labels: { color: '#8aa4cc', font: { size: 11 }, boxWidth: 10 } } },
          scales: { x: { grid: { color: 'rgba(82,128,204,.07)' }, ticks: { color: '#8aa4cc', font: { size: 10 }, maxTicksLimit: 12 } }, y: { grid: { color: 'rgba(82,128,204,.07)' }, ticks: { color: '#8aa4cc', font: { size: 10 } } } },
        }
      })
    }
    draw()
  }, [result, activeTab])

  // ── What-if chart ──────────────────────────────────────────
  useEffect(() => {
    if (!whatIfResult || !whatIfChartRef.current || activeTab !== 'whatif') return
    const draw = async () => {
      const Chart = (await import('chart.js/auto')).default
      if (whatIfChartInstanceRef.current) (whatIfChartInstanceRef.current as {destroy:()=>void}).destroy()
      const b = whatIfResult.base; const m = whatIfResult.modified
      const ctx = whatIfChartRef.current!.getContext('2d')!
      whatIfChartInstanceRef.current = new Chart(ctx, {
        type: 'line',
        data: { labels: b.labels, datasets: [
          { label: 'Actual', data: b.actual, borderColor: 'rgba(30,212,202,.9)', borderWidth: 2, pointRadius: 2, spanGaps: false, backgroundColor: 'transparent' },
          { label: 'Base forecast', data: b.predicted.map((v, i) => b.actual[i] === null ? v : null), borderColor: 'rgba(146,104,248,.7)', borderWidth: 2, borderDash: [5,3], pointRadius: 0, fill: false, spanGaps: false },
          { label: `What-if (${whatIfChange > 0 ? '+' : ''}${whatIfChange}%)`, data: m.predicted.map((v, i) => m.actual[i] === null ? v : null), borderColor: 'rgba(245,197,90,.9)', borderWidth: 2.5, pointRadius: 0, fill: false, spanGaps: false },
        ]},
        options: {
          responsive: true, animation: { duration: 600 },
          interaction: { mode: 'index', intersect: false },
          plugins: { legend: { labels: { color: '#8aa4cc', font: { size: 11 }, boxWidth: 10 } }, tooltip: { backgroundColor: 'rgba(13,26,53,.95)', titleColor: '#e6edf8', bodyColor: '#8aa4cc', padding: 10, cornerRadius: 8 } },
          scales: { x: { grid: { color: 'rgba(82,128,204,.07)' }, ticks: { color: '#8aa4cc', font: { size: 10 }, maxTicksLimit: 12 } }, y: { grid: { color: 'rgba(82,128,204,.07)' }, ticks: { color: '#8aa4cc', font: { size: 10 } } } },
        }
      })
    }
    draw()
  }, [whatIfResult, activeTab, whatIfChange])

  // ── Actions ────────────────────────────────────────────────
  const runForecast = async () => {
    if ((!selectedUpload && !selectedSource) || !targetColumn) return
    setLoading(true); setError(''); setComparison(null); setActiveTab('overview'); setWhatIfResult(null); setOverlayForecasts([])
    try {
      const body: Record<string, unknown> = { targetColumn, horizonDays: horizon, method, name: forecastName || undefined, confidence }
      if (selectedUpload) {
        body.uploadId = selectedUpload.id
      } else if (selectedSource && sourceRows) {
        body.sourceDatasetId = selectedSource.id
        body.sourceRows = sourceRows
      }
      const res = await fetch('/api/forecast', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResult(data); setScenario('base')
      if (data.actual) {
        const actualCount = data.actual.filter((v: unknown) => v !== null).length
        setWhatIfStart(0); setWhatIfEnd(Math.max(0, actualCount - 1))
      }
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: forecasts } = await supabase.from('forecasts').select('id, name, accuracy, method, created_at, target_column, horizon_days, result').eq('user_id', user.id).order('created_at', { ascending: false }).limit(15)
        setSavedForecasts(forecasts || [])
      }
    } catch (e) { setError(e instanceof Error ? e.message : 'Forecast failed') }
    finally { setLoading(false) }
  }

  const runComparison = async () => {
    if ((!selectedUpload && !selectedSource) || !targetColumn) return
    setComparingMethods(true)
    try {
      const body: Record<string, unknown> = { targetColumn, horizonDays: horizon }
      if (selectedUpload) body.uploadId = selectedUpload.id
      else if (selectedSource && sourceRows) { body.sourceDatasetId = selectedSource.id; body.sourceRows = sourceRows }
      const res = await fetch('/api/forecast/compare', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const data = await res.json()
      if (res.ok) { setComparison(data); setActiveTab('comparison') }
    } catch { /* ignore */ }
    finally { setComparingMethods(false) }
  }

  const runWhatIf = async () => {
    if ((!selectedUpload && !selectedSource) || !targetColumn || !result) return
    setWhatIfLoading(true)
    try {
      const body: Record<string, unknown> = { targetColumn, horizonDays: horizon, method: result.methodKey || 'linear', adjustments: { startPeriod: whatIfStart, endPeriod: whatIfEnd, changePct: whatIfChange }, confidence }
      if (selectedUpload) body.uploadId = selectedUpload.id
      else if (selectedSource && sourceRows) { body.sourceDatasetId = selectedSource.id; body.sourceRows = sourceRows }
      const res = await fetch('/api/forecast/whatif', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (res.ok) setWhatIfResult(data)
    } catch { /* ignore */ }
    finally { setWhatIfLoading(false) }
  }

  const loadSavedForecast = (f: SavedForecast) => {
    if (f.result) { setResult(f.result); setActiveTab('overview'); setScenario('base'); setOverlayForecasts([]); setWhatIfResult(null) }
  }

  const toggleOverlay = (f: SavedForecast) => {
    if (overlayForecasts.find(o => o.id === f.id)) setOverlayForecasts(overlayForecasts.filter(o => o.id !== f.id))
    else if (overlayForecasts.length < 3) setOverlayForecasts([...overlayForecasts, f])
  }

  const exportCSV = () => {
    if (!result) return
    const rows = result.labels.map((label, i) => [label, result.actual[i] !== null ? result.actual[i] : '', result.predicted[i]?.toFixed(2) || '', result.upperBound[i]?.toFixed(2) || '', result.lowerBound[i]?.toFixed(2) || ''].join(','))
    const csv = ['Date,Actual,Predicted,Upper Bound,Lower Bound', ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob); const a = document.createElement('a')
    a.href = url; a.download = `forecast-${targetColumn}-${horizon}d.csv`; a.click(); URL.revokeObjectURL(url)
  }

  const downloadChart = () => {
    if (!chartRef.current) return
    const url = chartRef.current.toDataURL('image/png'); const a = document.createElement('a')
    a.href = url; a.download = `forecast-chart-${targetColumn}.png`; a.click()
  }

  const generatePdfReport = async () => {
    if (!result) return
    setPdfLoading(true)
    try {
      const { jsPDF } = await import('jspdf')
      const pdf = new jsPDF('landscape', 'mm', 'a4')

      pdf.setFontSize(20); pdf.setTextColor(26, 25, 22)
      pdf.text('Demand Forecast Report', 20, 20)
      pdf.setFontSize(10); pdf.setTextColor(107, 103, 96)
      pdf.text(`Generated ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} · AskBiz`, 20, 28)
      pdf.text(`Column: ${targetColumn} · Horizon: ${horizon} days · Method: ${result.method}`, 20, 34)

      pdf.setDrawColor(200); pdf.line(20, 38, 277, 38)

      const kpis = [
        { l: 'Trend', v: `${result.trend.toUpperCase()} (${result.trendPct > 0 ? '+' : ''}${result.trendPct.toFixed(1)}%)` },
        { l: 'Accuracy', v: `${result.accuracy.toFixed(0)}%` },
        { l: 'R²', v: result.backtest?.r2?.toFixed(2) || '—' },
        { l: 'RMSE', v: result.backtest?.rmse?.toFixed(2) || '—' },
        { l: 'Data quality', v: result.dataQuality ? `${result.dataQuality.score}%` : '—' },
      ]

      let x = 20
      kpis.forEach(k => {
        pdf.setFontSize(8); pdf.setTextColor(160); pdf.text(k.l.toUpperCase(), x, 46)
        pdf.setFontSize(14); pdf.setTextColor(26, 25, 22); pdf.text(k.v, x, 54)
        x += 50
      })

      if (chartRef.current) {
        const chartImg = chartRef.current.toDataURL('image/png')
        pdf.addImage(chartImg, 'PNG', 20, 62, 257, 90)
      }

      pdf.setFontSize(9); pdf.setTextColor(107, 103, 96)
      const summaryLines = pdf.splitTextToSize(result.summary, 257)
      pdf.text(summaryLines, 20, 160)

      if (result.dataQuality) {
        pdf.setFontSize(8); pdf.setTextColor(160)
        pdf.text('DATA QUALITY NOTES', 20, 175)
        pdf.setFontSize(9); pdf.setTextColor(107, 103, 96)
        result.dataQuality.issues.forEach((issue, i) => pdf.text(`• ${issue}`, 20, 182 + i * 5))
      }

      pdf.save(`forecast-report-${targetColumn}-${horizon}d.pdf`)
    } catch { /* jspdf might not be installed */ }
    finally { setPdfLoading(false) }
  }

  const shareForecast = async () => {
    if (!result) return
    const url = `${window.location.origin}/forecasts?shared=${savedForecasts[0]?.id || ''}`
    setShareUrl(url); setShowShareModal(true)
    try { await navigator.clipboard.writeText(url) } catch { /* ignore */ }
  }

  const fetchStats = async (uploadId: string, col: string) => {
    try {
      const res = await fetch('/api/forecast/stats', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ uploadId, targetColumn: col }) })
      if (res.ok) setStats(await res.json()); else setStats(null)
    } catch { setStats(null) }
  }

  // ── Derived values ─────────────────────────────────────────
  const trendColor = result?.trend === 'up' ? '#1ed4ca' : result?.trend === 'down' ? '#f48080' : '#8aa4cc'
  const qualityColor = (s: number) => s >= 80 ? '#1ed4ca' : s >= 50 ? '#f5c55a' : '#f48080'
  const canUsePro = isBusiness(planId)

  // ── Tab config with plan gating ────────────────────────────
  const tabs: { key: Tab; label: string; pro?: boolean }[] = [
    { key: 'overview', label: 'Forecast' },
    { key: 'decomposition', label: 'Decomposition' },
    { key: 'comparison', label: 'Compare' },
    { key: 'whatif', label: 'What-if', pro: true },
    { key: 'data', label: 'Data & export' },
  ]

  return (
    <FeatureGate planId={planId} feature="forecasts_per_month" featureName="Demand Forecasting" planNeeded="growth">
    <div className="page-shell">

      <div className="page-shell-body">
        <div style={{ display: 'grid', gridTemplateColumns: 'min(230px,100%) 1fr', gap: 14 }}>

          {/* ═══ LEFT SIDEBAR ═══ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

            {/* ── Configuration ───────────────────────────────── */}
            <div style={card}>
              <div style={sectionLabel}>Configuration</div>

              <div style={formGroup}>
                <label style={labelStyle}>Dataset</label>
                <select style={selectStyle} value={selectedUpload?.id || selectedSource?.id || ''} onChange={async (e) => {
                  const val = e.target.value
                  setTargetColumn(''); setResult(null); setComparison(null); setStats(null); setWhatIfResult(null); setOverlayForecasts([])
                  setSelectedUpload(null); setSelectedSource(null); setSourceRows(null); setNumericColumns([])

                  // Check if it's a source dataset
                  const src = sourceDatasets.find(s => s.id === val)
                  if (src) {
                    setSelectedSource(src)
                    setNumericColumns(src.columns)
                    // Pre-fetch the aggregated rows
                    try {
                      const res = await fetch('/api/forecast/sources', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ datasetId: src.id, targetColumn: src.columns[0] }) })
                      const data = await res.json()
                      if (data.rows) { setSourceRows(data.rows); setNumericColumns(data.columns || src.columns) }
                    } catch { /* use column list from GET */ }
                    return
                  }

                  // Otherwise it's an upload
                  const up = uploads.find(u => u.id === val) || null
                  setSelectedUpload(up)
                  if (up) {
                    const { data } = await supabase.from('uploads').select('parsed_sample').eq('id', up.id).single()
                    if (data?.parsed_sample) setNumericColumns(detectNumericColumns(data.parsed_sample as Record<string, unknown>[]))
                  }
                }}>
                  <option value="">Choose a dataset…</option>
                  {sourceDatasets.length > 0 && (
                    <optgroup label="Connected Sources">
                      {sourceDatasets.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.sourceType === 'pos' ? '🏪 ' : '🛒 '}{s.name} ({s.rowCount.toLocaleString()} records)
                        </option>
                      ))}
                    </optgroup>
                  )}
                  {uploads.length > 0 && (
                    <optgroup label="Uploaded Files">
                      {uploads.map(u => <option key={u.id} value={u.id}>📄 {u.filename}</option>)}
                    </optgroup>
                  )}
                </select>
              </div>

              {(selectedUpload || selectedSource) && (
                <div style={formGroup}>
                  <label style={labelStyle}>Column to forecast</label>
                  <select style={selectStyle} value={targetColumn} onChange={e => {
                    setTargetColumn(e.target.value); setResult(null); setComparison(null); setWhatIfResult(null)
                    if (e.target.value && selectedUpload) fetchStats(selectedUpload.id, e.target.value)
                  }}>
                    <option value="">Choose a column…</option>
                    {numericColumns.length > 0 && <optgroup label="Numeric (recommended)">{numericColumns.map(c => <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>)}</optgroup>}
                    {selectedUpload && selectedUpload.column_names?.filter(c => !numericColumns.includes(c)).length > 0 && (
                      <optgroup label="Text (auto-detect numeric)">{selectedUpload.column_names?.filter(c => !numericColumns.includes(c)).map(c => <option key={c} value={c}>{c}</option>)}</optgroup>
                    )}
                  </select>
                  {targetColumn && !numericColumns.includes(targetColumn) && <div style={warningBox}>Text column — AskBiz will forecast your best numeric column instead.</div>}
                </div>
              )}

              <div style={formGroup}>
                <label style={labelStyle}>Forecast name <span style={{ color: 'var(--tx3)', fontWeight: 400 }}>(optional)</span></label>
                <input style={inputStyle} placeholder="e.g. Q3 revenue forecast" value={forecastName} onChange={e => setForecastName(e.target.value)} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div style={formGroup}>
                  <label style={labelStyle}>Horizon</label>
                  <select style={selectStyle} value={horizon} onChange={e => setHorizon(Number(e.target.value))}>
                    {[7,14,30,60,90].map(d => <option key={d} value={d}>{d} days</option>)}
                  </select>
                </div>
                <div style={formGroup}>
                  <label style={labelStyle}>Method</label>
                  <select style={selectStyle} value={method} onChange={e => setMethod(e.target.value as Method)}>
                    <option value="auto">Auto-best</option>
                    <option value="linear">Linear</option>
                    <option value="moving_avg">Moving avg</option>
                    <option value="seasonal">Seasonal</option>
                    <option value="exponential">Exponential</option>
                  </select>
                </div>
              </div>

              <div style={formGroup}>
                <label style={labelStyle}>Confidence: {confidence === 1 ? '68%' : confidence === 1.5 ? '87%' : confidence === 2 ? '95%' : `${Math.round(confidence * 50)}%`}</label>
                <input type="range" min="0.5" max="2.5" step="0.5" value={confidence} onChange={e => setConfidence(Number(e.target.value))} style={{ width: '100%', accentColor: '#9268f8' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'var(--tx3)', marginTop: -2 }}><span>Narrow</span><span>Wide</span></div>
              </div>

              {error && <div style={{ color: '#f48080', fontSize: 12, marginBottom: 10, padding: '8px 10px', background: 'rgba(232,64,64,.08)', borderRadius: 8 }}>{error}</div>}

              <button onClick={runForecast} disabled={loading || (!selectedUpload && !selectedSource) || !targetColumn} style={primaryBtn((!!selectedUpload || !!selectedSource) && !!targetColumn && !loading)}>
                {loading ? <span style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}><Spinner /> Running…</span> : 'Run forecast →'}
              </button>

              {selectedUpload && targetColumn && (
                <button onClick={runComparison} disabled={comparingMethods} style={secondaryBtnStyle}>
                  {comparingMethods ? 'Comparing…' : '⚡ Compare all methods'}
                </button>
              )}
            </div>

            {/* ── Data quality ────────────────────────────────── */}
            {result?.dataQuality && (
              <div style={card}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={sectionLabel}>Data quality</div>
                  <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-sora)', color: qualityColor(result.dataQuality.score) }}>{result.dataQuality.score}%</div>
                </div>
                <div style={{ height: 4, background: 'var(--b)', borderRadius: 2, marginBottom: 12, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${result.dataQuality.score}%`, background: qualityColor(result.dataQuality.score), borderRadius: 2, transition: 'width .5s ease' }} />
                </div>
                {result.dataQuality.issues.map((issue, i) => (
                  <div key={i} style={{ fontSize: 11, color: 'var(--tx2)', display: 'flex', alignItems: 'flex-start', gap: 6, lineHeight: 1.5, marginBottom: 4 }}>
                    <span style={{ flexShrink: 0, marginTop: 2 }}>{issue.includes('good') ? '✓' : '●'}</span>{issue}
                  </div>
                ))}
                <div style={{ marginTop: 8, fontSize: 11, color: 'var(--tx3)' }}>{result.dataQuality.rowCount} points · {result.dataQuality.outliers} outlier{result.dataQuality.outliers !== 1 ? 's' : ''}</div>
              </div>
            )}

            {/* ── Anomaly alerts ──────────────────────────────── */}
            {result?.anomalies && result.anomalies.length > 0 && (
              <div style={{ ...card, borderColor: 'rgba(244,128,128,.3)' }}>
                <div style={{ ...sectionLabel, color: '#f48080' }}>Anomalies detected</div>
                {result.anomalies.slice(0, 5).map((a, i) => (
                  <div key={i} style={{ padding: '6px 0', borderBottom: i < Math.min(4, result.anomalies!.length - 1) ? '1px solid var(--b)' : 'none', fontSize: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 500 }}>Period {a.index + 1}</span>
                      <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: a.severity === 'high' ? 'rgba(244,128,128,.1)' : 'rgba(245,197,90,.1)', color: a.severity === 'high' ? '#f48080' : '#f5c55a', fontWeight: 600 }}>{a.severity}</span>
                    </div>
                    <div style={{ color: 'var(--tx3)', fontSize: 11, marginTop: 2 }}>Actual: {fmt(a.value)} · Expected: {fmt(a.expected)} · Gap: {fmt(Math.abs(a.value - a.expected))}</div>
                  </div>
                ))}
                {result.anomalies.length > 5 && <div style={{ fontSize: 11, color: 'var(--tx3)', marginTop: 6 }}>+ {result.anomalies.length - 5} more</div>}
              </div>
            )}

            {/* ── Column stats ────────────────────────────────── */}
            {stats && (
              <div style={card}>
                <div style={sectionLabel}>Column statistics</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {[
                    { l: 'Mean', v: fmt(stats.mean) }, { l: 'Median', v: fmt(stats.median) },
                    { l: 'Min', v: fmt(stats.min) }, { l: 'Max', v: fmt(stats.max) },
                    { l: 'Std dev', v: fmt(stats.stdDev) }, { l: 'Growth', v: `${stats.growth > 0 ? '+' : ''}${stats.growth.toFixed(1)}%` },
                  ].map((s, i) => (
                    <div key={i} style={{ padding: '6px 8px', borderRadius: 8, background: 'var(--ev)' }}>
                      <div style={{ fontSize: 10, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.04em' }}>{s.l}</div>
                      <div style={{ fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-sora)', marginTop: 2 }}>{s.v}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Saved forecasts with overlay toggle ─────────── */}
            {savedForecasts.length > 0 && (
              <div style={card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <div style={sectionLabel}>Saved forecasts</div>
                  {canUsePro && result && <span style={{ fontSize: 10, color: 'var(--tx3)' }}>Toggle to overlay</span>}
                </div>
                {savedForecasts.map(f => {
                  const isOverlaid = overlayForecasts.find(o => o.id === f.id)
                  return (
                    <div key={f.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--b)', fontSize: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                        <span style={{ fontWeight: 500, cursor: 'pointer' }} onClick={() => loadSavedForecast(f)}>{f.name || f.target_column}</span>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                          {canUsePro && result && f.result && (
                            <button onClick={() => toggleOverlay(f)} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, border: isOverlaid ? '1.5px solid #f5c55a' : '1px solid var(--b2)', background: isOverlaid ? 'rgba(245,197,90,.08)' : 'transparent', color: isOverlaid ? '#f5c55a' : 'var(--tx3)', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}>
                              {isOverlaid ? '✓ overlaid' : 'overlay'}
                            </button>
                          )}
                          {f.result && <span style={{ fontSize: 10, color: '#9268f8', background: 'rgba(146,104,248,.08)', padding: '2px 6px', borderRadius: 4, cursor: 'pointer' }} onClick={() => loadSavedForecast(f)}>load</span>}
                        </div>
                      </div>
                      <div style={{ color: 'var(--tx3)', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        <span>{f.method}</span><span>·</span><span>{f.accuracy?.toFixed(0)}%</span><span>·</span><span>{new Date(f.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* ── Method guide ────────────────────────────────── */}
            <div style={card}>
              <div style={sectionLabel}>Method guide</div>
              {[
                { m: 'Auto-best', d: 'Tests all methods and picks the most accurate one for your data.', icon: '🎯' },
                { m: 'Linear', d: 'Best for steady growth or decline. Simple and interpretable.', icon: '📈' },
                { m: 'Moving avg', d: 'Smooths noise. Good for stable patterns without strong trend.', icon: '〰️' },
                { m: 'Seasonal', d: 'Captures repeating cycles (weekly, monthly). Needs 14+ data points.', icon: '🔄' },
                { m: 'Exponential', d: 'Adapts quickly to recent changes. Best for volatile data.', icon: '⚡' },
              ].map((g, i) => (
                <div key={i} style={{ padding: '7px 0', borderBottom: i < 4 ? '1px solid var(--b)' : 'none', fontSize: 12 }}>
                  <div style={{ fontWeight: 500, marginBottom: 2 }}>{g.icon} {g.m}</div>
                  <div style={{ color: 'var(--tx3)', lineHeight: 1.5 }}>{g.d}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ═══ RIGHT: RESULTS ═══ */}
          <div>
            {!result ? (
              <div style={{ background: 'var(--sf)', border: '1px solid var(--b)', borderRadius: 14, padding: 48, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, minHeight: 440 }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--tx3)" strokeWidth="1.2" strokeLinecap="round" opacity=".4"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                <div style={{ fontSize: 16, fontWeight: 600, fontFamily: 'var(--font-sora)' }}>Choose a dataset and column to forecast</div>
                <div style={{ fontSize: 13, color: 'var(--tx3)', maxWidth: 400, lineHeight: 1.6 }}>
                  Select your data, pick a column, and run a forecast. AskBiz fits trend models, detects anomalies, and projects forward with confidence bands.
                </div>
                <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
                  {['Auto-best method', 'Anomaly detection', 'Scenario analysis', 'What-if simulator', 'Forecast overlay', 'PDF reports'].map(f => (
                    <span key={f} style={{ fontSize: 10, padding: '4px 10px', borderRadius: 6, background: 'var(--ev)', color: 'var(--tx2)' }}>{f}</span>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                {/* KPI row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(130px,1fr))', gap: 10 }}>
                  {[
                    { label: 'Trend', value: result.trend.toUpperCase(), color: trendColor, sub: `${result.trendPct > 0 ? '+' : ''}${result.trendPct.toFixed(1)}%` },
                    { label: 'Accuracy', value: `${result.accuracy.toFixed(0)}%`, color: result.accuracy > 80 ? '#1ed4ca' : result.accuracy > 60 ? '#f5c55a' : '#f48080', sub: result.method },
                    { label: 'R²', value: result.backtest ? result.backtest.r2.toFixed(2) : '—', color: (result.backtest?.r2 || 0) > 0.7 ? '#1ed4ca' : '#f5c55a', sub: 'Holdout fit' },
                    { label: 'RMSE', value: result.backtest ? fmt(result.backtest.rmse) : '—', color: 'var(--tx2)', sub: 'Prediction error' },
                    { label: 'Anomalies', value: `${result.anomalies?.length || 0}`, color: (result.anomalies?.length || 0) > 0 ? '#f48080' : '#1ed4ca', sub: (result.anomalies?.length || 0) > 0 ? 'Review flagged' : 'None detected' },
                    { label: 'Quality', value: result.dataQuality ? `${result.dataQuality.score}%` : '—', color: result.dataQuality ? qualityColor(result.dataQuality.score) : 'var(--tx2)', sub: 'Data score' },
                  ].map((k, i) => (
                    <div key={i} style={{ padding: '12px 14px', borderRadius: 12, border: '1px solid var(--b)', background: 'var(--sf)', transition: 'transform .15s' }}>
                      <div style={{ fontSize: 10, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 4 }}>{k.label}</div>
                      <div style={{ fontFamily: 'var(--font-sora)', fontSize: 18, fontWeight: 600, color: k.color }}>{k.value}</div>
                      <div style={{ fontSize: 10, color: 'var(--tx3)', marginTop: 3 }}>{k.sub}</div>
                    </div>
                  ))}
                </div>

                {/* Tab bar */}
                <div style={{ display: 'flex', gap: 2, background: 'var(--ev)', borderRadius: 10, padding: 3, overflowX: 'auto' }}>
                  {tabs.map(t => (
                    <button key={t.key}
                      onClick={() => { if (!t.pro || canUsePro) setActiveTab(t.key) }}
                      style={{ flex: 1, padding: '8px 10px', borderRadius: 8, border: 'none', background: activeTab === t.key ? 'var(--sf)' : 'transparent', color: activeTab === t.key ? 'var(--tx)' : (t.pro && !canUsePro) ? 'var(--b2)' : 'var(--tx3)', fontSize: 12, fontWeight: activeTab === t.key ? 600 : 400, cursor: (t.pro && !canUsePro) ? 'not-allowed' : 'pointer', fontFamily: 'inherit', boxShadow: activeTab === t.key ? '0 1px 3px rgba(0,0,0,.06)' : 'none', transition: 'all .15s', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center', opacity: (t.pro && !canUsePro) ? 0.5 : 1 }}>
                      {t.label}
                      {t.pro && !canUsePro && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>}
                    </button>
                  ))}
                </div>

                {/* ── TAB: Overview ────────────────────────────── */}
                {activeTab === 'overview' && (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 10, background: 'var(--sf)', border: '1px solid var(--b)', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 12, color: 'var(--tx2)', fontWeight: 500 }}>Scenario:</span>
                      {(['base', 'optimistic', 'pessimistic'] as const).map(s => (
                        <button key={s} onClick={() => setScenario(s)} style={scenarioBtn(s, scenario)}>{s === 'base' ? '◎ Base' : s === 'optimistic' ? '▲ Optimistic' : '▼ Pessimistic'}</button>
                      ))}
                      {overlayForecasts.length > 0 && (
                        <span style={{ fontSize: 11, color: '#f5c55a', marginLeft: 'auto' }}>{overlayForecasts.length} overlay{overlayForecasts.length > 1 ? 's' : ''} active</span>
                      )}
                    </div>
                    <div style={{ ...card, padding: 18 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <div style={chartTitle}>{targetColumn} — {horizon}-day forecast {scenario !== 'base' && `(${scenario})`}</div>
                      </div>
                      <canvas ref={chartRef} height={200}/>
                    </div>
                    <div style={{ ...card, padding: '14px 16px' }}>
                      <div style={{ ...chartTitle, marginBottom: 8 }}>AI summary</div>
                      <div style={{ fontSize: 13, color: 'var(--tx2)', lineHeight: 1.65 }}>{result.summary}</div>
                    </div>
                  </>
                )}

                {/* ── TAB: Decomposition ──────────────────────── */}
                {activeTab === 'decomposition' && (
                  <div style={{ ...card, padding: 18 }}>
                    <div style={chartTitle}>Time series decomposition</div>
                    <div style={{ fontSize: 12, color: 'var(--tx3)', marginBottom: 14, marginTop: 4, lineHeight: 1.5 }}>
                      Trend (long-term direction), seasonal (repeating cycles), and residual (noise) components.
                    </div>
                    {result.decomposition ? <canvas ref={decompRef} height={250}/> : <EmptyState text="Decomposition not available for this forecast." />}
                  </div>
                )}

                {/* ── TAB: Comparison ─────────────────────────── */}
                {activeTab === 'comparison' && (
                  <div style={{ ...card, padding: 18 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                      <div>
                        <div style={chartTitle}>Method comparison</div>
                        <div style={{ fontSize: 12, color: 'var(--tx3)', marginTop: 4 }}>All methods ranked by accuracy on your data</div>
                      </div>
                      {!comparison && <button onClick={runComparison} disabled={comparingMethods} style={secondaryBtnStyle}>{comparingMethods ? 'Comparing…' : 'Run comparison'}</button>}
                    </div>
                    {comparison ? (
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                          <thead><tr>{['Rank', 'Method', 'Accuracy', 'MAE', 'RMSE', 'Trend'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr></thead>
                          <tbody>
                            {comparison.map((c, i) => (
                              <tr key={c.method} style={{ background: i === 0 ? 'rgba(30,212,202,.04)' : 'transparent' }}>
                                <td style={tdStyle}>{i === 0 ? <span style={{ background: '#1ed4ca', color: '#04080f', padding: '2px 7px', borderRadius: 4, fontSize: 11, fontWeight: 700 }}>BEST</span> : `#${i + 1}`}</td>
                                <td style={{ ...tdStyle, fontWeight: 500 }}>{c.method}</td>
                                <td style={tdStyle}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <div style={{ width: 40, height: 4, background: 'var(--b)', borderRadius: 2, overflow: 'hidden' }}><div style={{ height: '100%', width: `${c.accuracy}%`, background: c.accuracy > 80 ? '#1ed4ca' : c.accuracy > 60 ? '#f5c55a' : '#f48080', borderRadius: 2 }} /></div>
                                    {c.accuracy.toFixed(1)}%
                                  </div>
                                </td>
                                <td style={tdStyle}>{c.mae === Infinity ? '—' : fmt(c.mae)}</td>
                                <td style={tdStyle}>{c.rmse === Infinity ? '—' : fmt(c.rmse)}</td>
                                <td style={tdStyle}>
                                  <span style={{ color: c.trend === 'up' ? '#1ed4ca' : c.trend === 'down' ? '#f48080' : 'var(--tx3)' }}>
                                    {c.trend === 'up' ? '↑' : c.trend === 'down' ? '↓' : '→'} {c.trendPct > 0 ? '+' : ''}{c.trendPct.toFixed(1)}%
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : <EmptyState text='Click "Compare all methods" to see which method fits your data best.' />}
                  </div>
                )}

                {/* ── TAB: What-if ────────────────────────────── */}
                {activeTab === 'whatif' && canUsePro && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={card}>
                      <div style={chartTitle}>What-if simulator</div>
                      <div style={{ fontSize: 12, color: 'var(--tx3)', marginTop: 4, marginBottom: 16, lineHeight: 1.5 }}>
                        Adjust historical data and see how it changes the forecast. Test scenarios like &quot;what if sales dropped 20% last month?&quot;
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 14 }}>
                        <div>
                          <label style={labelStyle}>Change (%)</label>
                          <input type="number" style={inputStyle} value={whatIfChange} onChange={e => setWhatIfChange(Number(e.target.value))} />
                        </div>
                        <div>
                          <label style={labelStyle}>From period</label>
                          <input type="number" min={0} style={inputStyle} value={whatIfStart} onChange={e => setWhatIfStart(Number(e.target.value))} />
                        </div>
                        <div>
                          <label style={labelStyle}>To period</label>
                          <input type="number" min={0} style={inputStyle} value={whatIfEnd} onChange={e => setWhatIfEnd(Number(e.target.value))} />
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
                        {[{ l: 'Sales drop 20%', v: -20 }, { l: 'Sales spike 30%', v: 30 }, { l: 'Flat (-5%)', v: -5 }, { l: 'Double (+100%)', v: 100 }].map(p => (
                          <button key={p.l} onClick={() => setWhatIfChange(p.v)} style={{ padding: '5px 10px', borderRadius: 6, border: whatIfChange === p.v ? '1.5px solid #f5c55a' : '1px solid var(--b2)', background: whatIfChange === p.v ? 'rgba(245,197,90,.06)' : 'transparent', color: whatIfChange === p.v ? '#f5c55a' : 'var(--tx3)', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}>{p.l}</button>
                        ))}
                      </div>
                      <button onClick={runWhatIf} disabled={whatIfLoading} style={primaryBtn(!whatIfLoading)}>
                        {whatIfLoading ? <span style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}><Spinner /> Simulating…</span> : `Simulate ${whatIfChange > 0 ? '+' : ''}${whatIfChange}% change →`}
                      </button>
                    </div>
                    {whatIfResult && (
                      <>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                          <div style={{ padding: '14px', borderRadius: 12, border: '1px solid var(--b)', background: 'var(--sf)' }}>
                            <div style={{ fontSize: 10, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 4 }}>Forecast impact</div>
                            <div style={{ fontFamily: 'var(--font-sora)', fontSize: 22, fontWeight: 700, color: whatIfResult.impactPct > 0 ? '#1ed4ca' : whatIfResult.impactPct < 0 ? '#f48080' : 'var(--tx2)' }}>
                              {whatIfResult.impactPct > 0 ? '+' : ''}{whatIfResult.impactPct.toFixed(1)}%
                            </div>
                          </div>
                          <div style={{ padding: '14px', borderRadius: 12, border: '1px solid var(--b)', background: 'var(--sf)' }}>
                            <div style={{ fontSize: 10, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 4 }}>Modified accuracy</div>
                            <div style={{ fontFamily: 'var(--font-sora)', fontSize: 22, fontWeight: 700, color: whatIfResult.modified.accuracy > 80 ? '#1ed4ca' : '#f5c55a' }}>
                              {whatIfResult.modified.accuracy.toFixed(0)}%
                            </div>
                          </div>
                        </div>
                        <div style={{ ...card, padding: 18 }}>
                          <div style={chartTitle}>Base vs. what-if scenario</div>
                          <canvas ref={whatIfChartRef} height={220} style={{ marginTop: 10 }}/>
                        </div>
                        <div style={{ ...card, padding: '14px 16px' }}>
                          <div style={{ fontSize: 13, color: 'var(--tx2)', lineHeight: 1.65 }}>{whatIfResult.impactSummary}</div>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* ── TAB: Data & export ──────────────────────── */}
                {activeTab === 'data' && (
                  <div style={{ ...card, padding: 18 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                      <div style={chartTitle}>Forecast data table</div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={exportCSV} style={secondaryBtnStyle}>Export CSV</button>
                        {canUsePro && <button onClick={generatePdfReport} disabled={pdfLoading} style={secondaryBtnStyle}>{pdfLoading ? '…' : 'PDF report'}</button>}
                      </div>
                    </div>
                    <div style={{ overflowX: 'auto', maxHeight: 450, overflowY: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                        <thead style={{ position: 'sticky', top: 0, background: 'var(--sf)' }}>
                          <tr>{['Date', 'Actual', 'Predicted', 'Upper', 'Lower', 'Type'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
                        </thead>
                        <tbody>
                          {result.labels.map((label, i) => {
                            const isAnomaly = result.anomalies?.some(a => a.index === i)
                            return (
                              <tr key={i} style={{ background: isAnomaly ? 'rgba(244,128,128,.04)' : result.actual[i] === null ? 'rgba(146,104,248,.03)' : 'transparent' }}>
                                <td style={tdStyle}>{label}</td>
                                <td style={tdStyle}>{result.actual[i] !== null ? fmt(result.actual[i] as number) : '—'}</td>
                                <td style={tdStyle}>{fmt(result.predicted[i])}</td>
                                <td style={tdStyle}>{fmt(result.upperBound[i])}</td>
                                <td style={tdStyle}>{fmt(result.lowerBound[i])}</td>
                                <td style={tdStyle}>
                                  {isAnomaly ? (
                                    <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: 'rgba(244,128,128,.1)', color: '#f48080', fontWeight: 600 }}>Anomaly</span>
                                  ) : (
                                    <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: result.actual[i] !== null ? 'rgba(30,212,202,.08)' : 'rgba(146,104,248,.08)', color: result.actual[i] !== null ? '#1ed4ca' : '#9268f8' }}>
                                      {result.actual[i] !== null ? 'Historical' : 'Forecast'}
                                    </span>
                                  )}
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

    {/* ── Share modal ─────────────────────────────────────────── */}
    {showShareModal && (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }} onClick={() => setShowShareModal(false)}>
        <div style={{ background: 'var(--sf)', borderRadius: 16, padding: 24, maxWidth: 420, width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,.2)' }} onClick={e => e.stopPropagation()}>
          <div style={{ fontFamily: 'var(--font-sora)', fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Share forecast</div>
          <div style={{ fontSize: 13, color: 'var(--tx2)', marginBottom: 16, lineHeight: 1.5 }}>Anyone with this link can view this forecast result.</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input readOnly value={shareUrl} style={{ ...inputStyle, flex: 1 }} onClick={e => (e.target as HTMLInputElement).select()} />
            <button onClick={() => { navigator.clipboard.writeText(shareUrl); setShowShareModal(false) }} style={{ ...primaryBtn(true), width: 'auto', padding: '9px 18px', marginTop: 0 }}>Copied!</button>
          </div>
        </div>
      </div>
    )}

    <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
    </FeatureGate>
  )
}

// ── Helpers ──────────────────────────────────────────────────
function fmt(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return n % 1 === 0 ? n.toLocaleString() : n.toFixed(2)
}

function Spinner() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>
}

function EmptyState({ text }: { text: string }) {
  return <div style={{ padding: 32, textAlign: 'center', color: 'var(--tx3)', fontSize: 13 }}>{text}</div>
}

function scenarioBtn(s: string, active: string): React.CSSProperties {
  const isActive = s === active
  const colorMap: Record<string, string> = { optimistic: '#1ed4ca', pessimistic: '#f48080', base: '#9268f8' }
  const c = colorMap[s] || '#9268f8'
  return {
    padding: '5px 12px', borderRadius: 6, border: isActive ? `1.5px solid ${c}` : '1px solid var(--b)',
    background: isActive ? `${c}0F` : 'transparent', color: isActive ? c : 'var(--tx3)',
    fontSize: 11, fontWeight: isActive ? 600 : 400, cursor: 'pointer', fontFamily: 'inherit', textTransform: 'capitalize',
  }
}

// ── Style constants ─────────────────────────────────────────
const card: React.CSSProperties = { background: 'var(--sf)', border: '1px solid var(--b)', borderRadius: 10, padding: '10px 12px' }
const sectionLabel: React.CSSProperties = { fontSize: 11, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.08em', margin: 0, lineHeight: 1 }
const formGroup: React.CSSProperties = { marginTop: 6, marginBottom: 0 }
const labelStyle: React.CSSProperties = { display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--tx2)', margin: 0, padding: 0, lineHeight: 1 }
const selectStyle: React.CSSProperties = { fontFamily: 'inherit', fontSize: 13, color: 'var(--tx)', background: 'var(--ev)', border: '1px solid var(--b2)', borderRadius: 8, padding: '5px 8px', outline: 'none', width: '100%', marginTop: 1 }
const inputStyle: React.CSSProperties = { fontFamily: 'inherit', fontSize: 13, color: 'var(--tx)', background: 'var(--ev)', border: '1px solid var(--b2)', borderRadius: 8, padding: '5px 8px', outline: 'none', width: '100%', boxSizing: 'border-box', marginTop: 1 }
const warningBox: React.CSSProperties = { marginTop: 5, fontSize: 11, color: '#f59e0b', lineHeight: 1.5, padding: '6px 8px', background: 'rgba(245,158,11,.06)', borderRadius: 6 }
const chartTitle: React.CSSProperties = { fontSize: 11, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.05em', fontWeight: 500 }
const tdStyle: React.CSSProperties = { padding: '8px 10px', borderBottom: '1px solid var(--b)' }
const thStyle: React.CSSProperties = { textAlign: 'left', padding: '8px 10px', borderBottom: '2px solid var(--b)', fontSize: 10, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.04em', fontWeight: 500 }

const primaryBtn = (enabled: boolean): React.CSSProperties => ({
  width: '100%', padding: '6px', borderRadius: 9999, border: 'none',
  background: enabled ? '#1ed4ca' : 'var(--b2)', color: '#04080f',
  fontFamily: 'inherit', fontSize: 12, fontWeight: 600,
  cursor: enabled ? 'pointer' : 'not-allowed', marginTop: 1, transition: 'all .15s',
})

const secondaryBtnStyle: React.CSSProperties = {
  padding: '9px 14px', borderRadius: 9999, border: '1px solid var(--b2)',
  background: 'transparent', color: 'var(--tx2)',
  fontFamily: 'inherit', fontSize: 12, fontWeight: 500,
  cursor: 'pointer', marginTop: 4, transition: 'all .15s',
}

const actionBtn: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 8,
  border: '1px solid var(--b2)', background: 'var(--sf)', color: 'var(--tx2)',
  fontSize: 11, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
}
