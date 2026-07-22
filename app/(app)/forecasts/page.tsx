'use client'
import { usePlan } from '@/lib/hooks/usePlan'
import FeatureGate from '@/components/gates/FeatureGate'
import { useLang } from '@/components/LanguageProvider'
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
type ChartInstance = { canvas: HTMLCanvasElement; data: { labels: unknown; datasets: unknown[] }; options: { animation?: unknown }; update: () => void; destroy: () => void }

type Tab = 'overview' | 'decomposition' | 'comparison' | 'whatif' | 'data'
type Method = 'linear' | 'moving_avg' | 'seasonal' | 'exponential' | 'auto'

const PLAN_ORDER = ['free', 'growth', 'business']
const isBusiness = (p: string) => PLAN_ORDER.indexOf(p) >= PLAN_ORDER.indexOf('business')

export default function ForecastsPage() {
  const { planId, loading: planLoading } = usePlan()
  const { tc } = useLang()
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
  const [initialLoading, setInitialLoading] = useState(true)

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
  const [statsError, setStatsError] = useState(false)

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
      if (!user) { setInitialLoading(false); return }
      const [{ data: ups }, { data: forecasts }, sourcesRes] = await Promise.all([
        supabase.from('uploads').select('id, filename, column_names').eq('user_id', user.id).eq('status', 'parsed').order('created_at', { ascending: false }),
        supabase.from('forecasts').select('id, name, accuracy, method, created_at, target_column, horizon_days, result').eq('user_id', user.id).order('created_at', { ascending: false }).limit(15),
        fetch('/api/forecast/sources').then(r => r.json()).catch(() => ({ datasets: [] })),
      ])
      setUploads(ups || [])
      setSavedForecasts(forecasts || [])
      setSourceDatasets(sourcesRes.datasets || [])
      setInitialLoading(false)
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
      const r = scenarioData(result)
      const ctx = chartRef.current!.getContext('2d')!
      const animation = prefersReducedMotion() ? false as const : { duration: 600, easing: 'easeOutQuart' as const }

      const datasets: unknown[] = [
        { label: tc('forecasts.col_actual'), data: r.actual, borderColor: 'rgba(208,138,89,.9)', backgroundColor: 'transparent', borderWidth: 2, pointRadius: 2, spanGaps: false },
        { label: tc('forecasts.legend_forecast'), data: r.predicted.map((v, i) => r.actual[i] === null ? v : null), borderColor: 'rgba(140,111,224,.9)', backgroundColor: 'rgba(140,111,224,.08)', borderWidth: 2, borderDash: [5,3], fill: false, spanGaps: false, pointRadius: 2 },
        { label: tc('forecasts.legend_confidence'), data: r.upperBound.map((v, i) => r.actual[i] === null ? v : null), borderColor: 'transparent', backgroundColor: 'rgba(140,111,224,.08)', fill: '+1', pointRadius: 0 },
        { label: '', data: r.lowerBound.map((v, i) => r.actual[i] === null ? v : null), borderColor: 'transparent', backgroundColor: 'transparent', fill: false, pointRadius: 0 },
      ]

      // Anomaly markers
      if (r.anomalies?.length) {
        const anomalyData = r.labels.map(() => null as number | null)
        r.anomalies.forEach(a => { anomalyData[a.index] = a.value })
        datasets.push({
          label: tc('forecasts.type_anomaly'), data: anomalyData, borderColor: 'transparent', backgroundColor: 'rgba(244,128,128,.9)',
          pointRadius: r.labels.map((_, i) => anomalyData[i] !== null ? 6 : 0),
          pointStyle: 'triangle', showLine: false, pointBorderColor: '#f48080', pointBorderWidth: 2,
        })
      }

      // Overlay forecasts
      const colors = ['rgba(208,138,89,.7)', 'rgba(140,111,224,.7)', 'rgba(34,197,94,.7)']
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

      // Reuse the live instance (and let Chart.js tween between values) as long as it's
      // still bound to the current canvas — a fresh canvas node (e.g. after navigating
      // away from and back to this tab) needs a fresh instance instead.
      const existing = chartInstanceRef.current as ChartInstance | null
      if (existing && existing.canvas === chartRef.current) {
        existing.data.labels = r.labels as any
        existing.data.datasets = datasets as any
        existing.options.animation = animation as any
        existing.update()
      } else {
        if (existing) existing.destroy()
        chartInstanceRef.current = new Chart(ctx, {
          type: 'line',
          data: { labels: r.labels, datasets: datasets as any },
          options: {
            responsive: true, maintainAspectRatio: false, animation,
            interaction: { mode: 'index', intersect: false },
            plugins: {
              legend: { labels: { color: 'var(--tx3)', font: { size: 11 }, boxWidth: 10, filter: (item: any) => item.text !== '' } },
              tooltip: { backgroundColor: 'var(--sf)', titleColor: 'var(--tx)', bodyColor: 'var(--tx2)', borderColor: 'var(--b)', borderWidth: 1, padding: 10, cornerRadius: 8 },
            },
            scales: {
              x: { grid: { color: 'var(--b)' }, ticks: { color: 'var(--tx3)', font: { size: 10 }, maxTicksLimit: 12 } },
              y: { grid: { color: 'var(--b)' }, ticks: { color: 'var(--tx3)', font: { size: 10 } } },
            },
          }
        })
      }
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
          { label: tc('forecasts.kpi_trend'), data: d.trend, borderColor: '#d08a59', borderWidth: 2, pointRadius: 0, fill: false },
          { label: tc('forecasts.legend_seasonal'), data: d.seasonal, borderColor: '#8c6fe0', borderWidth: 1.5, pointRadius: 0, fill: { target: 'origin', above: 'rgba(140,111,224,.06)', below: 'rgba(140,111,224,.06)' } },
          { label: tc('forecasts.legend_residual'), data: d.residual, borderColor: '#f48080', borderWidth: 1, pointRadius: 0, borderDash: [3,3], fill: false },
        ]},
        options: {
          responsive: true, maintainAspectRatio: false, animation: prefersReducedMotion() ? false : { duration: 600 },
          interaction: { mode: 'index', intersect: false },
          plugins: { legend: { labels: { color: 'var(--tx3)', font: { size: 11 }, boxWidth: 10 } } },
          scales: { x: { grid: { color: 'var(--b)' }, ticks: { color: 'var(--tx3)', font: { size: 10 }, maxTicksLimit: 12 } }, y: { grid: { color: 'var(--b)' }, ticks: { color: 'var(--tx3)', font: { size: 10 } } } },
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
          { label: tc('forecasts.col_actual'), data: b.actual, borderColor: 'rgba(208,138,89,.9)', borderWidth: 2, pointRadius: 2, spanGaps: false, backgroundColor: 'transparent' },
          { label: tc('forecasts.legend_base_forecast'), data: b.predicted.map((v, i) => b.actual[i] === null ? v : null), borderColor: 'rgba(140,111,224,.7)', borderWidth: 2, borderDash: [5,3], pointRadius: 0, fill: false, spanGaps: false },
          { label: tc('forecasts.legend_whatif', { sign: whatIfChange > 0 ? '+' : '', pct: whatIfChange }), data: m.predicted.map((v, i) => m.actual[i] === null ? v : null), borderColor: 'rgba(245,158,11,.9)', borderWidth: 2.5, pointRadius: 0, fill: false, spanGaps: false },
        ]},
        options: {
          responsive: true, maintainAspectRatio: false, animation: prefersReducedMotion() ? false : { duration: 600 },
          interaction: { mode: 'index', intersect: false },
          plugins: { legend: { labels: { color: 'var(--tx3)', font: { size: 11 }, boxWidth: 10 } }, tooltip: { backgroundColor: 'var(--sf)', titleColor: 'var(--tx)', bodyColor: 'var(--tx2)', borderColor: 'var(--b)', borderWidth: 1, padding: 10, cornerRadius: 8 } },
          scales: { x: { grid: { color: 'var(--b)' }, ticks: { color: 'var(--tx3)', font: { size: 10 }, maxTicksLimit: 12 } }, y: { grid: { color: 'var(--b)' }, ticks: { color: 'var(--tx3)', font: { size: 10 } } } },
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
    } catch (e) { setError(e instanceof Error ? e.message : tc('forecasts.forecast_failed')) }
    finally { setLoading(false) }
  }

  const runComparison = async () => {
    if ((!selectedUpload && !selectedSource) || !targetColumn) return
    setComparingMethods(true); setError('')
    try {
      const body: Record<string, unknown> = { targetColumn, horizonDays: horizon }
      if (selectedUpload) body.uploadId = selectedUpload.id
      else if (selectedSource && sourceRows) { body.sourceDatasetId = selectedSource.id; body.sourceRows = sourceRows }
      const res = await fetch('/api/forecast/compare', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const data = await res.json()
      if (res.ok) { setComparison(data); setActiveTab('comparison') }
      else throw new Error(data.error || tc('forecasts.comparison_failed'))
    } catch (e) { setError(e instanceof Error ? e.message : tc('forecasts.comparison_failed')) }
    finally { setComparingMethods(false) }
  }

  const runWhatIf = async () => {
    if ((!selectedUpload && !selectedSource) || !targetColumn || !result) return
    setWhatIfLoading(true); setError('')
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
      else throw new Error(data.error || tc('forecasts.whatif_failed'))
    } catch (e) { setError(e instanceof Error ? e.message : tc('forecasts.whatif_failed')) }
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
    const csvHeader = [tc('forecasts.csv_header_date'), tc('forecasts.csv_header_actual'), tc('forecasts.csv_header_predicted'), tc('forecasts.csv_header_upper_bound'), tc('forecasts.csv_header_lower_bound')].join(',')
    const csv = [csvHeader, ...rows].join('\n')
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
    setPdfLoading(true); setError('')
    try {
      const { jsPDF } = await import('jspdf')
      const pdf = new jsPDF('landscape', 'mm', 'a4')

      pdf.setFontSize(20); pdf.setTextColor(26, 25, 22)
      pdf.text(tc('forecasts.pdf_report_title'), 20, 20)
      pdf.setFontSize(10); pdf.setTextColor(107, 103, 96)
      pdf.text(tc('forecasts.pdf_generated', { date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) }), 20, 28)
      pdf.text(tc('forecasts.pdf_meta', { column: targetColumn, horizon, method: result.method }), 20, 34)

      pdf.setDrawColor(200); pdf.line(20, 38, 277, 38)

      const kpis = [
        { l: tc('forecasts.pdf_kpi_trend'), v: `${result.trend.toUpperCase()} (${result.trendPct > 0 ? '+' : ''}${result.trendPct.toFixed(1)}%)` },
        { l: tc('forecasts.pdf_kpi_accuracy'), v: `${result.accuracy.toFixed(0)}%` },
        { l: tc('forecasts.pdf_kpi_r2'), v: result.backtest?.r2?.toFixed(2) || '—' },
        { l: tc('forecasts.pdf_kpi_rmse'), v: result.backtest?.rmse?.toFixed(2) || '—' },
        { l: tc('forecasts.pdf_kpi_data_quality'), v: result.dataQuality ? `${result.dataQuality.score}%` : '—' },
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
        pdf.text(tc('forecasts.pdf_data_quality_notes'), 20, 175)
        pdf.setFontSize(9); pdf.setTextColor(107, 103, 96)
        result.dataQuality.issues.forEach((issue, i) => pdf.text(`• ${issue}`, 20, 182 + i * 5))
      }

      pdf.save(`forecast-report-${targetColumn}-${horizon}d.pdf`)
    } catch (e) { setError(e instanceof Error ? e.message : tc('forecasts.pdf_failed')) }
    finally { setPdfLoading(false) }
  }

  const shareForecast = async () => {
    if (!result) return
    const url = `${window.location.origin}/forecasts?shared=${savedForecasts[0]?.id || ''}`
    setShareUrl(url); setShowShareModal(true)
    try { await navigator.clipboard.writeText(url) } catch { /* clipboard write is best-effort; the modal still shows the URL to copy manually */ }
  }

  const fetchStats = async (uploadId: string, col: string) => {
    setStatsError(false)
    try {
      const res = await fetch('/api/forecast/stats', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ uploadId, targetColumn: col }) })
      if (res.ok) setStats(await res.json())
      else { setStats(null); setStatsError(true) }
    } catch { setStats(null); setStatsError(true) }
  }

  // ── Derived values ─────────────────────────────────────────
  const trendColor = result?.trend === 'up' ? '#22c55e' : result?.trend === 'down' ? '#f48080' : 'var(--tx3)'
  const qualityColor = (s: number) => s >= 80 ? '#22c55e' : s >= 50 ? '#f59e0b' : '#f48080'
  const canUsePro = isBusiness(planId)

  // ── Tab config with plan gating ────────────────────────────
  const tabs: { key: Tab; label: string; pro?: boolean }[] = [
    { key: 'overview', label: tc('forecasts.tab_overview') },
    { key: 'decomposition', label: tc('forecasts.tab_decomposition') },
    { key: 'comparison', label: tc('forecasts.tab_comparison') },
    { key: 'whatif', label: tc('forecasts.tab_whatif'), pro: true },
    { key: 'data', label: tc('forecasts.tab_data') },
  ]

  return (
    <FeatureGate planId={planId} feature="forecasts_per_month" featureName={tc('forecasts.feature_name')} planNeeded="growth">
    <div className="page-shell">

      <div className="page-shell-body">
        <div style={{ display: 'grid', gridTemplateColumns: 'min(230px,100%) 1fr', gap: 14 }}>

          {/* ═══ LEFT SIDEBAR ═══ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

            {/* ── Configuration ───────────────────────────────── */}
            <div style={card}>
              <div style={sectionLabel}>{tc('forecasts.configuration')}</div>

              <div style={formGroup}>
                <label style={labelStyle}>{tc('forecasts.dataset_label')}</label>
                {initialLoading ? <div className="skeleton" style={{ height: 30, marginTop: 1 }} /> : (
                <select style={selectStyle} onFocus={focusRing} onBlur={blurRing} value={selectedUpload?.id || selectedSource?.id || ''} onChange={async (e) => {
                  const val = e.target.value
                  setTargetColumn(''); setResult(null); setComparison(null); setStats(null); setWhatIfResult(null); setOverlayForecasts([])
                  setSelectedUpload(null); setSelectedSource(null); setSourceRows(null); setNumericColumns([]); setStats(null); setStatsError(false)

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
                  <option value="">{tc('forecasts.choose_dataset')}</option>
                  {sourceDatasets.length > 0 && (
                    <optgroup label={tc('forecasts.connected_sources')}>
                      {sourceDatasets.map(s => (
                        <option key={s.id} value={s.id}>
                          [{s.sourceType === 'pos' ? tc('forecasts.source_type_pos') : tc('forecasts.source_type_ecommerce')}] {s.name} ({s.rowCount.toLocaleString()} {tc('forecasts.records_suffix')})
                        </option>
                      ))}
                    </optgroup>
                  )}
                  {uploads.length > 0 && (
                    <optgroup label={tc('forecasts.uploaded_files')}>
                      {uploads.map(u => <option key={u.id} value={u.id}>{u.filename}</option>)}
                    </optgroup>
                  )}
                </select>
                )}
              </div>

              {(selectedUpload || selectedSource) && (
                <div style={formGroup}>
                  <label style={labelStyle}>{tc('forecasts.column_to_forecast')}</label>
                  <select style={selectStyle} onFocus={focusRing} onBlur={blurRing} value={targetColumn} onChange={e => {
                    setTargetColumn(e.target.value); setResult(null); setComparison(null); setWhatIfResult(null)
                    if (e.target.value && selectedUpload) fetchStats(selectedUpload.id, e.target.value)
                  }}>
                    <option value="">{tc('forecasts.choose_column')}</option>
                    {numericColumns.length > 0 && <optgroup label={tc('forecasts.numeric_recommended')}>{numericColumns.map(c => <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>)}</optgroup>}
                    {selectedUpload && selectedUpload.column_names?.filter(c => !numericColumns.includes(c)).length > 0 && (
                      <optgroup label={tc('forecasts.text_autodetect')}>{selectedUpload.column_names?.filter(c => !numericColumns.includes(c)).map(c => <option key={c} value={c}>{c}</option>)}</optgroup>
                    )}
                  </select>
                  {targetColumn && !numericColumns.includes(targetColumn) && <div style={warningBox}>{tc('forecasts.text_column_warning')}</div>}
                  {statsError && <div style={{ marginTop: 5, fontSize: 13, color: 'var(--tx3)' }}>{tc('forecasts.stats_failed')}</div>}
                </div>
              )}

              <div style={formGroup}>
                <label style={labelStyle}>{tc('forecasts.forecast_name')} <span style={{ color: 'var(--tx3)', fontWeight: 400 }}>{tc('forecasts.optional')}</span></label>
                <input style={inputStyle} onFocus={focusRing} onBlur={blurRing} placeholder={tc('forecasts.forecast_name_placeholder')} value={forecastName} onChange={e => setForecastName(e.target.value)} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div style={formGroup}>
                  <label style={labelStyle}>{tc('forecasts.horizon')}</label>
                  <select style={selectStyle} onFocus={focusRing} onBlur={blurRing} value={horizon} onChange={e => setHorizon(Number(e.target.value))}>
                    {[7,14,30,60,90].map(d => <option key={d} value={d}>{d} {tc('forecasts.days_suffix')}</option>)}
                  </select>
                </div>
                <div style={formGroup}>
                  <label style={labelStyle}>{tc('forecasts.method')}</label>
                  <select style={selectStyle} onFocus={focusRing} onBlur={blurRing} value={method} onChange={e => setMethod(e.target.value as Method)}>
                    <option value="auto">{tc('forecasts.method_auto')}</option>
                    <option value="linear">{tc('forecasts.method_linear')}</option>
                    <option value="moving_avg">{tc('forecasts.method_moving_avg')}</option>
                    <option value="seasonal">{tc('forecasts.method_seasonal')}</option>
                    <option value="exponential">{tc('forecasts.method_exponential')}</option>
                  </select>
                </div>
              </div>

              <div style={formGroup}>
                <label style={labelStyle}>{tc('forecasts.confidence', { pct: confidence === 1 ? '68%' : confidence === 1.5 ? '87%' : confidence === 2 ? '95%' : `${Math.round(confidence * 50)}%` })}</label>
                <input type="range" min="0.5" max="2.5" step="0.5" value={confidence} onChange={e => setConfidence(Number(e.target.value))} style={{ width: '100%', accentColor: '#8c6fe0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--tx3)', marginTop: -2 }}><span>{tc('forecasts.narrow')}</span><span>{tc('forecasts.wide')}</span></div>
              </div>

              {error && <div style={{ color: '#f48080', fontSize: 14, marginBottom: 10, padding: '8px 10px', background: 'rgba(232,64,64,.08)', borderRadius: 8 }}>{error}</div>}

              <button onClick={runForecast} disabled={loading || (!selectedUpload && !selectedSource) || !targetColumn} style={primaryBtn((!!selectedUpload || !!selectedSource) && !!targetColumn && !loading)}>
                {loading ? <span style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}><Spinner /> {tc('forecasts.running')}</span> : tc('forecasts.run_forecast')}
              </button>

              {selectedUpload && targetColumn && (
                <button onClick={runComparison} disabled={comparingMethods} style={secondaryBtnStyle}>
                  {comparingMethods ? tc('forecasts.comparing') : tc('forecasts.compare_all_methods')}
                </button>
              )}
            </div>

            {/* ── Data quality ────────────────────────────────── */}
            {result?.dataQuality && (
              <div style={card}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={sectionLabel}>{tc('forecasts.data_quality')}</div>
                  <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'var(--font-sora)', color: qualityColor(result.dataQuality.score) }}>{result.dataQuality.score}%</div>
                </div>
                <div style={{ height: 4, background: 'var(--b)', borderRadius: 2, marginBottom: 12, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: '100%', transformOrigin: 'left', transform: `scaleX(${result.dataQuality.score / 100})`, background: qualityColor(result.dataQuality.score), borderRadius: 2, transition: 'transform .5s ease' }} />
                </div>
                {result.dataQuality.issues.map((issue, i) => (
                  <div key={i} style={{ fontSize: 13, color: 'var(--tx2)', display: 'flex', alignItems: 'flex-start', gap: 6, lineHeight: 1.5, marginBottom: 4 }}>
                    <span style={{ flexShrink: 0, marginTop: 2 }}>{issue.includes('good') ? '✓' : '●'}</span>{issue}
                  </div>
                ))}
                <div style={{ marginTop: 8, fontSize: 13, color: 'var(--tx3)' }}>{tc('forecasts.points_outliers', { rows: result.dataQuality.rowCount, outliers: result.dataQuality.outliers, plural: result.dataQuality.outliers !== 1 ? 's' : '' })}</div>
              </div>
            )}

            {/* ── Anomaly alerts ──────────────────────────────── */}
            {result?.anomalies && result.anomalies.length > 0 && (
              <div style={{ ...card, borderColor: 'rgba(244,128,128,.3)' }}>
                <div style={{ ...sectionLabel, color: '#f48080' }}>{tc('forecasts.anomalies_detected')}</div>
                {result.anomalies.slice(0, 5).map((a, i) => (
                  <div key={i} style={{ padding: '6px 0', borderBottom: i < Math.min(4, result.anomalies!.length - 1) ? '1px solid var(--b)' : 'none', fontSize: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 500 }}>{tc('forecasts.period_n', { n: a.index + 1 })}</span>
                      <span style={{ fontSize: 12, padding: '2px 6px', borderRadius: 4, background: a.severity === 'high' ? 'rgba(244,128,128,.1)' : 'rgba(245,158,11,.1)', color: a.severity === 'high' ? '#f48080' : '#f59e0b', fontWeight: 600 }}>{a.severity}</span>
                    </div>
                    <div style={{ color: 'var(--tx3)', fontSize: 13, marginTop: 2 }}>{tc('forecasts.anomaly_detail', { actual: fmt(a.value), expected: fmt(a.expected), gap: fmt(Math.abs(a.value - a.expected)) })}</div>
                  </div>
                ))}
                {result.anomalies.length > 5 && <div style={{ fontSize: 13, color: 'var(--tx3)', marginTop: 6 }}>{tc('forecasts.more_count', { count: result.anomalies.length - 5 })}</div>}
              </div>
            )}

            {/* ── Column stats ────────────────────────────────── */}
            {stats && (
              <div style={card}>
                <div style={sectionLabel}>{tc('forecasts.column_statistics')}</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {[
                    { l: tc('forecasts.stat_mean'), v: fmt(stats.mean) }, { l: tc('forecasts.stat_median'), v: fmt(stats.median) },
                    { l: tc('forecasts.stat_min'), v: fmt(stats.min) }, { l: tc('forecasts.stat_max'), v: fmt(stats.max) },
                    { l: tc('forecasts.stat_std_dev'), v: fmt(stats.stdDev) }, { l: tc('forecasts.stat_growth'), v: `${stats.growth > 0 ? '+' : ''}${stats.growth.toFixed(1)}%` },
                  ].map((s, i) => (
                    <div key={i} style={{ padding: '6px 8px', borderRadius: 8, background: 'var(--ev)' }}>
                      <div style={{ fontSize: 12, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.04em' }}>{s.l}</div>
                      <div style={{ fontSize: 15, fontWeight: 600, fontFamily: 'var(--font-sora)', marginTop: 2 }}>{s.v}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Saved forecasts with overlay toggle ─────────── */}
            {savedForecasts.length > 0 && (
              <div style={card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <div style={sectionLabel}>{tc('forecasts.saved_forecasts')}</div>
                  {canUsePro && result && <span style={{ fontSize: 12, color: 'var(--tx3)' }}>{tc('forecasts.toggle_to_overlay')}</span>}
                </div>
                {savedForecasts.map(f => {
                  const isOverlaid = overlayForecasts.find(o => o.id === f.id)
                  return (
                    <div key={f.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--b)', fontSize: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                        <span style={{ fontWeight: 500, cursor: 'pointer' }} onClick={() => loadSavedForecast(f)}>{f.name || f.target_column}</span>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                          {canUsePro && result && f.result && (
                            <button onClick={() => toggleOverlay(f)} style={{ fontSize: 12, padding: '2px 8px', borderRadius: 4, border: isOverlaid ? '1.5px solid #d08a59' : '1px solid var(--b2)', background: isOverlaid ? 'rgba(208,138,89,.08)' : 'transparent', color: isOverlaid ? '#d08a59' : 'var(--tx3)', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}>
                              {isOverlaid ? tc('forecasts.overlaid') : tc('forecasts.overlay')}
                            </button>
                          )}
                          {f.result && <span style={{ fontSize: 12, color: '#8c6fe0', background: 'rgba(140,111,224,.08)', padding: '2px 6px', borderRadius: 4, cursor: 'pointer' }} onClick={() => loadSavedForecast(f)}>{tc('forecasts.load')}</span>}
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
            <details style={card}>
              <summary style={{ ...sectionLabel, cursor: 'pointer' }}>{tc('forecasts.method_guide')}</summary>
              <div style={{ marginTop: 8 }}>
                {[
                  { m: tc('forecasts.guide_auto_name'), d: tc('forecasts.guide_auto_desc'), icon: 'auto' as const },
                  { m: tc('forecasts.guide_linear_name'), d: tc('forecasts.guide_linear_desc'), icon: 'linear' as const },
                  { m: tc('forecasts.guide_moving_avg_name'), d: tc('forecasts.guide_moving_avg_desc'), icon: 'moving_avg' as const },
                  { m: tc('forecasts.guide_seasonal_name'), d: tc('forecasts.guide_seasonal_desc'), icon: 'seasonal' as const },
                  { m: tc('forecasts.guide_exponential_name'), d: tc('forecasts.guide_exponential_desc'), icon: 'exponential' as const },
                ].map((g, i) => (
                  <div key={i} style={{ padding: '7px 0', borderBottom: i < 4 ? '1px solid var(--b)' : 'none', fontSize: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500, marginBottom: 2 }}><MethodIcon type={g.icon} /> {g.m}</div>
                    <div style={{ color: 'var(--tx3)', lineHeight: 1.5 }}>{g.d}</div>
                  </div>
                ))}
              </div>
            </details>
          </div>

          {/* ═══ RIGHT: RESULTS ═══ */}
          <div>
            {!result ? (
              <div style={{ background: 'var(--sf)', border: '1px solid var(--b)', borderRadius: 14, padding: 48, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, minHeight: 440 }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--tx3)" strokeWidth="1.2" strokeLinecap="round" opacity=".4"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                <div style={{ fontSize: 18, fontWeight: 600, fontFamily: 'var(--font-sora)' }}>{tc('forecasts.empty_title')}</div>
                <div style={{ fontSize: 15, color: 'var(--tx3)', maxWidth: 400, lineHeight: 1.6 }}>
                  {tc('forecasts.empty_body')}
                </div>
                <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
                  {[tc('forecasts.feature_auto_method'), tc('forecasts.feature_anomaly_detection'), tc('forecasts.feature_scenario_analysis'), tc('forecasts.feature_whatif_simulator'), tc('forecasts.feature_forecast_overlay'), tc('forecasts.feature_pdf_reports')].map(f => (
                    <span key={f} style={{ fontSize: 12, padding: '4px 10px', borderRadius: 6, background: 'var(--ev)', color: 'var(--tx2)' }}>{f}</span>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

                {/* KPI row */}
                {(() => {
                  const lowConfidence = (result.dataQuality ? result.dataQuality.score < 50 : false) || ((result.backtest?.r2 ?? 1) < 0.3)
                  const kpis: { label: string; value: string; color: string; sub: string; help?: string; flag?: string }[] = [
                    { label: tc('forecasts.kpi_trend'), value: result.trend.toUpperCase(), color: trendColor, sub: `${result.trendPct > 0 ? '+' : ''}${result.trendPct.toFixed(1)}%`, flag: lowConfidence ? tc('forecasts.low_confidence') : undefined },
                    { label: tc('forecasts.kpi_accuracy'), value: `${result.accuracy.toFixed(0)}%`, color: result.accuracy > 80 ? '#22c55e' : result.accuracy > 60 ? '#f59e0b' : '#f48080', sub: result.method, flag: lowConfidence ? tc('forecasts.low_confidence') : undefined },
                    { label: tc('forecasts.kpi_r2'), value: result.backtest ? result.backtest.r2.toFixed(2) : '—', color: (result.backtest?.r2 || 0) > 0.7 ? '#22c55e' : '#f59e0b', sub: tc('forecasts.kpi_holdout_fit'), help: tc('forecasts.kpi_r2_help') },
                    { label: tc('forecasts.kpi_rmse'), value: result.backtest ? fmt(result.backtest.rmse) : '—', color: 'var(--tx2)', sub: tc('forecasts.kpi_prediction_error'), help: tc('forecasts.kpi_rmse_help') },
                    { label: tc('forecasts.kpi_anomalies'), value: `${result.anomalies?.length || 0}`, color: (result.anomalies?.length || 0) > 0 ? '#f48080' : '#22c55e', sub: (result.anomalies?.length || 0) > 0 ? tc('forecasts.kpi_review_flagged') : tc('forecasts.kpi_none_detected') },
                    { label: tc('forecasts.kpi_quality'), value: result.dataQuality ? `${result.dataQuality.score}%` : '—', color: result.dataQuality ? qualityColor(result.dataQuality.score) : 'var(--tx2)', sub: tc('forecasts.kpi_data_score') },
                  ]
                  return (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(130px,1fr))', gap: 10 }}>
                      {kpis.map((k, i) => (
                        <div key={i} title={k.help} style={{ padding: '10px 12px', borderRadius: 12, border: '1px solid var(--b)', background: 'var(--sf)', transition: 'transform .15s', opacity: k.flag ? 0.82 : 1 }}>
                          <div style={{ fontSize: 12, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 5 }}>
                            {k.label}
                            {k.help && <span aria-hidden="true" style={{ fontSize: 11, color: 'var(--tx3)', border: '1px solid var(--b2)', borderRadius: '50%', width: 12, height: 12, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1, cursor: 'help', textTransform: 'none' }}>?</span>}
                          </div>
                          <div style={{ fontFamily: 'var(--font-sora)', fontSize: 20, fontWeight: 600, color: k.color }}>{k.value}</div>
                          <div style={{ fontSize: 12, color: 'var(--tx3)', marginTop: 3 }}>{k.sub}</div>
                          {k.flag && <div style={{ fontSize: 11, color: '#f59e0b', marginTop: 4, fontWeight: 600 }}>{k.flag}</div>}
                        </div>
                      ))}
                    </div>
                  )
                })()}

                {/* Tab bar */}
                <div style={{ display: 'flex', gap: 2, background: 'var(--ev)', borderRadius: 10, padding: 3, overflowX: 'auto' }}>
                  {tabs.map(t => (
                    <button key={t.key}
                      onClick={() => { if (!t.pro || canUsePro) setActiveTab(t.key) }}
                      style={{ flex: 1, padding: '8px 10px', borderRadius: 8, border: 'none', background: activeTab === t.key ? 'var(--sf)' : 'transparent', color: activeTab === t.key ? 'var(--tx)' : (t.pro && !canUsePro) ? 'var(--b2)' : 'var(--tx3)', fontSize: 14, fontWeight: activeTab === t.key ? 600 : 400, cursor: (t.pro && !canUsePro) ? 'not-allowed' : 'pointer', fontFamily: 'inherit', boxShadow: activeTab === t.key ? '0 1px 3px rgba(0,0,0,.06)' : 'none', transition: 'all .15s', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center', opacity: (t.pro && !canUsePro) ? 0.5 : 1 }}>
                      {t.label}
                      {t.pro && !canUsePro && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>}
                    </button>
                  ))}
                </div>

                {/* ── TAB: Overview ────────────────────────────── */}
                {activeTab === 'overview' && (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 10, background: 'var(--sf)', border: '1px solid var(--b)', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 14, color: 'var(--tx2)', fontWeight: 500 }}>{tc('forecasts.scenario_label')}</span>
                      {(['base', 'optimistic', 'pessimistic'] as const).map(s => (
                        <button key={s} onClick={() => setScenario(s)} style={scenarioBtn(s, scenario)}>{s === 'base' ? tc('forecasts.scenario_base') : s === 'optimistic' ? tc('forecasts.scenario_optimistic') : tc('forecasts.scenario_pessimistic')}</button>
                      ))}
                      {overlayForecasts.length > 0 && (
                        <span style={{ fontSize: 13, color: '#f59e0b', marginLeft: 'auto' }}>{tc('forecasts.overlays_active', { count: overlayForecasts.length, plural: overlayForecasts.length > 1 ? 's' : '' })}</span>
                      )}
                    </div>
                    <div style={{ ...card, padding: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <div style={chartTitle}>{scenario !== 'base' ? tc('forecasts.chart_title_forecast_scenario', { column: targetColumn, horizon, scenario }) : tc('forecasts.chart_title_forecast', { column: targetColumn, horizon })}</div>
                      </div>
                      <div style={{ height: 260, position: 'relative' }}>
                        <canvas ref={chartRef} />
                      </div>
                    </div>
                    <div style={{ ...card, padding: '12px 16px' }}>
                      <div style={{ ...chartTitle, marginBottom: 6 }}>{tc('forecasts.ai_summary')}</div>
                      <div style={{ fontSize: 15, color: 'var(--tx2)', lineHeight: 1.6 }}>{result.summary}</div>
                    </div>
                  </>
                )}

                {/* ── TAB: Decomposition ──────────────────────── */}
                {activeTab === 'decomposition' && (
                  <div style={{ ...card, padding: 18 }}>
                    <div style={chartTitle}>{tc('forecasts.decomposition_title')}</div>
                    <div style={{ fontSize: 14, color: 'var(--tx3)', marginBottom: 14, marginTop: 4, lineHeight: 1.5 }}>
                      {tc('forecasts.decomposition_desc')}
                    </div>
                    {result.decomposition ? <div style={{ height: 280, position: 'relative' }}><canvas ref={decompRef} /></div> : <EmptyState text={tc('forecasts.decomposition_unavailable')} />}
                  </div>
                )}

                {/* ── TAB: Comparison ─────────────────────────── */}
                {activeTab === 'comparison' && (
                  <div style={{ ...card, padding: 18 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                      <div>
                        <div style={chartTitle}>{tc('forecasts.method_comparison')}</div>
                        <div style={{ fontSize: 14, color: 'var(--tx3)', marginTop: 4 }}>{tc('forecasts.method_comparison_desc')}</div>
                      </div>
                      {!comparison && <button onClick={runComparison} disabled={comparingMethods} style={secondaryBtnStyle}>{comparingMethods ? tc('forecasts.comparing') : tc('forecasts.run_comparison')}</button>}
                    </div>
                    {comparison ? (
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
                          <thead><tr>{[tc('forecasts.col_rank'), tc('forecasts.col_method'), tc('forecasts.col_accuracy'), tc('forecasts.col_mae'), tc('forecasts.col_rmse'), tc('forecasts.col_trend')].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr></thead>
                          <tbody>
                            {comparison.map((c, i) => (
                              <tr key={c.method} style={{ background: i === 0 ? 'rgba(34,197,94,.04)' : 'transparent' }}>
                                <td style={tdStyle}>{i === 0 ? <span style={{ background: '#22c55e', color: '#fff', padding: '2px 7px', borderRadius: 4, fontSize: 13, fontWeight: 700 }}>{tc('forecasts.best_badge')}</span> : `#${i + 1}`}</td>
                                <td style={{ ...tdStyle, fontWeight: 500 }}>{c.method}</td>
                                <td style={tdStyle}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <div style={{ width: 40, height: 4, background: 'var(--b)', borderRadius: 2, overflow: 'hidden' }}><div style={{ height: '100%', width: `${c.accuracy}%`, background: c.accuracy > 80 ? '#22c55e' : c.accuracy > 60 ? '#f59e0b' : '#f48080', borderRadius: 2 }} /></div>
                                    {c.accuracy.toFixed(1)}%
                                  </div>
                                </td>
                                <td style={tdStyle}>{c.mae === Infinity ? '—' : fmt(c.mae)}</td>
                                <td style={tdStyle}>{c.rmse === Infinity ? '—' : fmt(c.rmse)}</td>
                                <td style={tdStyle}>
                                  <span style={{ color: c.trend === 'up' ? '#22c55e' : c.trend === 'down' ? '#f48080' : 'var(--tx3)' }}>
                                    {c.trend === 'up' ? '↑' : c.trend === 'down' ? '↓' : '→'} {c.trendPct > 0 ? '+' : ''}{c.trendPct.toFixed(1)}%
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : <EmptyState text={tc('forecasts.comparison_empty')} />}
                  </div>
                )}

                {/* ── TAB: What-if ────────────────────────────── */}
                {activeTab === 'whatif' && canUsePro && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={card}>
                      <div style={chartTitle}>{tc('forecasts.whatif_simulator')}</div>
                      <div style={{ fontSize: 14, color: 'var(--tx3)', marginTop: 4, marginBottom: 16, lineHeight: 1.5 }}>
                        {tc('forecasts.whatif_desc')}
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 14 }}>
                        <div>
                          <label style={labelStyle}>{tc('forecasts.whatif_change')}</label>
                          <input type="number" style={inputStyle} onFocus={focusRing} onBlur={blurRing} value={whatIfChange} onChange={e => setWhatIfChange(Number(e.target.value))} />
                        </div>
                        <div>
                          <label style={labelStyle}>{tc('forecasts.whatif_from_period')}</label>
                          <input type="number" min={0} style={inputStyle} onFocus={focusRing} onBlur={blurRing} value={whatIfStart} onChange={e => setWhatIfStart(Number(e.target.value))} />
                        </div>
                        <div>
                          <label style={labelStyle}>{tc('forecasts.whatif_to_period')}</label>
                          <input type="number" min={0} style={inputStyle} onFocus={focusRing} onBlur={blurRing} value={whatIfEnd} onChange={e => setWhatIfEnd(Number(e.target.value))} />
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
                        {[{ l: tc('forecasts.whatif_preset_drop'), v: -20 }, { l: tc('forecasts.whatif_preset_spike'), v: 30 }, { l: tc('forecasts.whatif_preset_flat'), v: -5 }, { l: tc('forecasts.whatif_preset_double'), v: 100 }].map(p => (
                          <button key={p.l} onClick={() => setWhatIfChange(p.v)} style={{ padding: '5px 10px', borderRadius: 6, border: whatIfChange === p.v ? '1.5px solid #d08a59' : '1px solid var(--b2)', background: whatIfChange === p.v ? 'rgba(208,138,89,.06)' : 'transparent', color: whatIfChange === p.v ? '#d08a59' : 'var(--tx3)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>{p.l}</button>
                        ))}
                      </div>
                      <button onClick={runWhatIf} disabled={whatIfLoading} style={primaryBtn(!whatIfLoading)}>
                        {whatIfLoading ? <span style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}><Spinner /> {tc('forecasts.simulating')}</span> : tc('forecasts.simulate_change', { sign: whatIfChange > 0 ? '+' : '', pct: whatIfChange })}
                      </button>
                    </div>
                    {whatIfResult && (
                      <>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                          <div style={{ padding: '14px', borderRadius: 12, border: '1px solid var(--b)', background: 'var(--sf)' }}>
                            <div style={{ fontSize: 12, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 4 }}>{tc('forecasts.forecast_impact')}</div>
                            <div style={{ fontFamily: 'var(--font-sora)', fontSize: 24, fontWeight: 700, color: whatIfResult.impactPct > 0 ? '#22c55e' : whatIfResult.impactPct < 0 ? '#f48080' : 'var(--tx2)' }}>
                              {whatIfResult.impactPct > 0 ? '+' : ''}{whatIfResult.impactPct.toFixed(1)}%
                            </div>
                          </div>
                          <div style={{ padding: '14px', borderRadius: 12, border: '1px solid var(--b)', background: 'var(--sf)' }}>
                            <div style={{ fontSize: 12, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 4 }}>{tc('forecasts.modified_accuracy')}</div>
                            <div style={{ fontFamily: 'var(--font-sora)', fontSize: 24, fontWeight: 700, color: whatIfResult.modified.accuracy > 80 ? '#22c55e' : '#f59e0b' }}>
                              {whatIfResult.modified.accuracy.toFixed(0)}%
                            </div>
                          </div>
                        </div>
                        <div style={{ ...card, padding: 14 }}>
                          <div style={chartTitle}>{tc('forecasts.base_vs_whatif')}</div>
                          <div style={{ height: 260, position: 'relative', marginTop: 8 }}>
                            <canvas ref={whatIfChartRef} />
                          </div>
                        </div>
                        <div style={{ ...card, padding: '14px 16px' }}>
                          <div style={{ fontSize: 15, color: 'var(--tx2)', lineHeight: 1.65 }}>{whatIfResult.impactSummary}</div>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* ── TAB: Data & export ──────────────────────── */}
                {activeTab === 'data' && (
                  <div style={{ ...card, padding: 18 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                      <div style={chartTitle}>{tc('forecasts.forecast_data_table')}</div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={exportCSV} style={secondaryBtnStyle}>{tc('forecasts.export_csv')}</button>
                        {canUsePro && <button onClick={generatePdfReport} disabled={pdfLoading} style={secondaryBtnStyle}>{pdfLoading ? '…' : tc('forecasts.pdf_report')}</button>}
                      </div>
                    </div>
                    <div style={{ overflowX: 'auto', maxHeight: 450, overflowY: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                        <thead style={{ position: 'sticky', top: 0, background: 'var(--sf)' }}>
                          <tr>{[tc('forecasts.col_date'), tc('forecasts.col_actual'), tc('forecasts.col_predicted'), tc('forecasts.col_upper'), tc('forecasts.col_lower'), tc('forecasts.col_type')].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
                        </thead>
                        <tbody>
                          {result.labels.map((label, i) => {
                            const isAnomaly = result.anomalies?.some(a => a.index === i)
                            return (
                              <tr key={i} style={{ background: isAnomaly ? 'rgba(244,128,128,.04)' : result.actual[i] === null ? 'rgba(140,111,224,.03)' : 'transparent' }}>
                                <td style={tdStyle}>{label}</td>
                                <td style={tdStyle}>{result.actual[i] !== null ? fmt(result.actual[i] as number) : '—'}</td>
                                <td style={tdStyle}>{fmt(result.predicted[i])}</td>
                                <td style={tdStyle}>{fmt(result.upperBound[i])}</td>
                                <td style={tdStyle}>{fmt(result.lowerBound[i])}</td>
                                <td style={tdStyle}>
                                  {isAnomaly ? (
                                    <span style={{ fontSize: 12, padding: '2px 6px', borderRadius: 4, background: 'rgba(244,128,128,.1)', color: '#f48080', fontWeight: 600 }}>{tc('forecasts.type_anomaly')}</span>
                                  ) : (
                                    <span style={{ fontSize: 12, padding: '2px 6px', borderRadius: 4, background: result.actual[i] !== null ? 'rgba(208,138,89,.08)' : 'rgba(140,111,224,.08)', color: result.actual[i] !== null ? '#d08a59' : '#8c6fe0' }}>
                                      {result.actual[i] !== null ? tc('forecasts.type_historical') : tc('forecasts.type_forecast')}
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
          <div style={{ fontFamily: 'var(--font-sora)', fontSize: 18, fontWeight: 600, marginBottom: 8 }}>{tc('forecasts.share_forecast')}</div>
          <div style={{ fontSize: 15, color: 'var(--tx2)', marginBottom: 16, lineHeight: 1.5 }}>{tc('forecasts.share_desc')}</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input readOnly value={shareUrl} style={{ ...inputStyle, flex: 1 }} onFocus={focusRing} onBlur={blurRing} onClick={e => (e.target as HTMLInputElement).select()} />
            <button onClick={() => { navigator.clipboard.writeText(shareUrl).catch(() => {}); setShowShareModal(false) }} style={{ ...primaryBtn(true), width: 'auto', padding: '9px 18px', marginTop: 0 }}>{tc('forecasts.copied')}</button>
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

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

function Spinner() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>
}

function EmptyState({ text }: { text: string }) {
  return <div style={{ padding: 32, textAlign: 'center', color: 'var(--tx3)', fontSize: 15 }}>{text}</div>
}

const METHOD_ICON_PATHS: Record<string, React.ReactNode> = {
  auto: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none" /></>,
  linear: <polyline points="4 18 20 6" />,
  moving_avg: <path d="M2 12c2-4 4-4 6 0s4 4 6 0 4-4 6 0" />,
  seasonal: <><path d="M21 12a9 9 0 11-2.64-6.36" /><polyline points="21 3 21 9 15 9" /></>,
  exponential: <path d="M3 18C7 18 9 14 11 9S17 3 21 3" />,
}

function MethodIcon({ type }: { type: keyof typeof METHOD_ICON_PATHS }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--tx3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }} aria-hidden="true">
      {METHOD_ICON_PATHS[type]}
    </svg>
  )
}

function scenarioBtn(s: string, active: string): React.CSSProperties {
  const isActive = s === active
  const colorMap: Record<string, string> = { optimistic: '#22c55e', pessimistic: '#f48080', base: '#8c6fe0' }
  const c = colorMap[s] || '#8c6fe0'
  return {
    padding: '5px 12px', borderRadius: 6, border: isActive ? `1.5px solid ${c}` : '1px solid var(--b)',
    background: isActive ? `${c}0F` : 'transparent', color: isActive ? c : 'var(--tx3)',
    fontSize: 13, fontWeight: isActive ? 600 : 400, cursor: 'pointer', fontFamily: 'inherit', textTransform: 'capitalize',
  }
}

// ── Style constants ─────────────────────────────────────────
const card: React.CSSProperties = { background: 'var(--sf)', border: '1px solid var(--b)', borderRadius: 10, padding: '10px 12px' }
const sectionLabel: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.08em', margin: 0, lineHeight: 1 }
const formGroup: React.CSSProperties = { marginTop: 6, marginBottom: 0 }
const labelStyle: React.CSSProperties = { display: 'block', minHeight: 0, fontSize: 15, fontWeight: 500, color: 'var(--tx2)', margin: 0, padding: 0, lineHeight: 1 }
const selectStyle: React.CSSProperties = { fontFamily: 'inherit', fontSize: 15, color: 'var(--tx)', background: 'var(--ev)', border: '1px solid var(--b2)', borderRadius: 8, padding: '5px 8px', outline: 'none', width: '100%', marginTop: 1 }
const inputStyle: React.CSSProperties = { fontFamily: 'inherit', fontSize: 15, color: 'var(--tx)', background: 'var(--ev)', border: '1px solid var(--b2)', borderRadius: 8, padding: '5px 8px', outline: 'none', width: '100%', boxSizing: 'border-box', marginTop: 1 }
// selectStyle/inputStyle drop the native outline, so focus needs an explicit replacement.
const focusRing = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => { e.currentTarget.style.borderColor = 'var(--acc)' }
const blurRing = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => { e.currentTarget.style.borderColor = 'var(--b2)' }
const warningBox: React.CSSProperties = { marginTop: 5, fontSize: 13, color: '#f59e0b', lineHeight: 1.5, padding: '6px 8px', background: 'rgba(245,158,11,.06)', borderRadius: 6 }
const chartTitle: React.CSSProperties = { fontSize: 13, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.05em', fontWeight: 500 }
const tdStyle: React.CSSProperties = { padding: '8px 10px', borderBottom: '1px solid var(--b)' }
const thStyle: React.CSSProperties = { textAlign: 'left', padding: '8px 10px', borderBottom: '2px solid var(--b)', fontSize: 12, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.04em', fontWeight: 500 }

const primaryBtn = (enabled: boolean): React.CSSProperties => ({
  width: '100%', padding: '6px', borderRadius: 9999, border: 'none',
  background: 'var(--acc)', color: '#fff', opacity: enabled ? 1 : 0.5,
  fontFamily: 'inherit', fontSize: 14, fontWeight: 600,
  cursor: enabled ? 'pointer' : 'not-allowed', marginTop: 1, transition: 'all .15s ease',
})

const secondaryBtnStyle: React.CSSProperties = {
  padding: '9px 14px', borderRadius: 9999, border: '1px solid var(--b2)',
  background: 'transparent', color: 'var(--tx2)',
  fontFamily: 'inherit', fontSize: 14, fontWeight: 500,
  cursor: 'pointer', marginTop: 4, transition: 'all .15s',
}

const actionBtn: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 8,
  border: '1px solid var(--b2)', background: 'var(--sf)', color: 'var(--tx2)',
  fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
}
