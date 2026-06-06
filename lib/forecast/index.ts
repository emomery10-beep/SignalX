// ============================================================
// SignalX Forecasting Engine v3
// Linear regression, moving average, seasonal, exponential smoothing
// Auto-best selection, what-if scenarios, anomaly detection,
// backtesting, outlier handling, decomposition, multi-forecast overlay
// ============================================================

export interface ForecastResult {
  labels: string[]
  actual: (number | null)[]
  predicted: number[]
  upperBound: number[]
  lowerBound: number[]
  trend: 'up' | 'down' | 'flat'
  trendPct: number
  accuracy: number
  method: string
  methodKey: string
  summary: string
  decomposition?: { trend: number[]; seasonal: number[]; residual: number[] }
  dataQuality?: { score: number; issues: string[]; rowCount: number; outliers: number }
  backtest?: { mae: number; rmse: number; mape: number; r2: number }
  anomalies?: { index: number; value: number; expected: number; severity: 'high' | 'medium' }[]
}

export interface MethodComparison {
  method: string
  methodKey: string
  accuracy: number
  mae: number
  rmse: number
  trendPct: number
  trend: string
  predicted: number[]
  labels: string[]
}

export interface DataStats {
  mean: number; median: number; min: number; max: number
  stdDev: number; count: number; growth: number
  q1: number; q3: number; cv: number
  weekdayPattern?: { day: string; avg: number }[]
}

export interface WhatIfResult {
  base: ForecastResult
  modified: ForecastResult
  impactPct: number
  impactSummary: string
}

// ── Simple linear regression ──────────────────────────────────
function linearRegression(y: number[]): { slope: number; intercept: number; r2: number } {
  const n = y.length
  const x = Array.from({ length: n }, (_, i) => i)
  const sumX = x.reduce((a, b) => a + b, 0)
  const sumY = y.reduce((a, b) => a + b, 0)
  const sumXY = x.reduce((s, xi, i) => s + xi * y[i], 0)
  const sumX2 = x.reduce((s, xi) => s + xi * xi, 0)
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
  const intercept = (sumY - slope * sumX) / n
  const yMean = sumY / n
  const ssTot = y.reduce((s, yi) => s + (yi - yMean) ** 2, 0)
  const ssRes = y.reduce((s, yi, i) => s + (yi - (slope * i + intercept)) ** 2, 0)
  const r2 = ssTot === 0 ? 1 : Math.max(0, 1 - ssRes / ssTot)
  return { slope, intercept, r2 }
}

// ── Moving average ────────────────────────────────────────────
function movingAverage(data: number[], window: number): number[] {
  return data.map((_, i) => {
    const start = Math.max(0, i - window + 1)
    const slice = data.slice(start, i + 1)
    return slice.reduce((a, b) => a + b, 0) / slice.length
  })
}

// ── Standard deviation ───────────────────────────────────────
function stdDev(data: number[]): number {
  if (!data.length) return 0
  const mean = data.reduce((a, b) => a + b, 0) / data.length
  return Math.sqrt(data.reduce((s, x) => s + (x - mean) ** 2, 0) / data.length)
}

// ── MAPE ────────────────────────────────────────────────────
function mape(actual: number[], predicted: number[]): number {
  const pairs = actual.map((a, i) => ({ a, p: predicted[i] })).filter(({ a }) => a !== 0)
  if (!pairs.length) return 0
  return pairs.reduce((s, { a, p }) => s + Math.abs((a - p) / a), 0) / pairs.length * 100
}

function calcMae(actual: number[], predicted: number[]): number {
  if (!actual.length) return 0
  return actual.reduce((s, a, i) => s + Math.abs(a - predicted[i]), 0) / actual.length
}

function calcRmse(actual: number[], predicted: number[]): number {
  if (!actual.length) return 0
  return Math.sqrt(actual.reduce((s, a, i) => s + (a - predicted[i]) ** 2, 0) / actual.length)
}

// ── Exponential smoothing (Holt's double) ───────────────────
function exponentialSmoothing(data: number[], alpha = 0.3, beta = 0.1): { fitted: number[]; level: number; trend: number } {
  const n = data.length
  let level = data[0]
  let trend = n > 1 ? data[1] - data[0] : 0
  const fitted: number[] = [level]
  for (let i = 1; i < n; i++) {
    const prevLevel = level
    level = alpha * data[i] + (1 - alpha) * (prevLevel + trend)
    trend = beta * (level - prevLevel) + (1 - beta) * trend
    fitted.push(level + trend)
  }
  return { fitted, level, trend }
}

// ── Outlier detection (IQR) ─────────────────────────────────
export function detectOutliers(data: number[]): { indices: number[]; cleaned: number[] } {
  const sorted = [...data].sort((a, b) => a - b)
  const q1 = sorted[Math.floor(sorted.length * 0.25)]
  const q3 = sorted[Math.floor(sorted.length * 0.75)]
  const iqr = q3 - q1
  const lower = q1 - 1.5 * iqr
  const upper = q3 + 1.5 * iqr
  const indices: number[] = []
  const cleaned = data.map((v, i) => {
    if (v < lower || v > upper) { indices.push(i); return (q1 + q3) / 2 }
    return v
  })
  return { indices, cleaned }
}

// ── Anomaly detection (z-score on residuals) ────────────────
function detectAnomalies(actual: number[], fitted: number[]): { index: number; value: number; expected: number; severity: 'high' | 'medium' }[] {
  const residuals = actual.map((a, i) => a - fitted[i])
  const mean = residuals.reduce((a, b) => a + b, 0) / residuals.length
  const sd = stdDev(residuals)
  if (sd === 0) return []
  const anomalies: { index: number; value: number; expected: number; severity: 'high' | 'medium' }[] = []
  residuals.forEach((r, i) => {
    const z = Math.abs((r - mean) / sd)
    if (z > 3) anomalies.push({ index: i, value: actual[i], expected: fitted[i], severity: 'high' })
    else if (z > 2) anomalies.push({ index: i, value: actual[i], expected: fitted[i], severity: 'medium' })
  })
  return anomalies
}

// ── Data quality assessment ─────────────────────────────────
export function assessDataQuality(data: number[], rawRows: number): { score: number; issues: string[]; rowCount: number; outliers: number } {
  const issues: string[] = []
  let score = 100
  if (data.length < 7) { issues.push('Very few data points — forecast reliability is low'); score -= 30 }
  else if (data.length < 14) { issues.push('Limited data — consider uploading more history'); score -= 15 }
  const { indices } = detectOutliers(data)
  if (indices.length > 0) { issues.push(`${indices.length} outlier${indices.length > 1 ? 's' : ''} detected and smoothed`); score -= Math.min(20, indices.length * 5) }
  const zeros = data.filter(v => v === 0).length
  if (zeros > data.length * 0.3) { issues.push(`${zeros} zero values — may indicate missing data`); score -= 15 }
  const mean = data.reduce((a, b) => a + b, 0) / data.length
  const cv = mean !== 0 ? stdDev(data) / mean : 0
  if (cv > 1.5) { issues.push('High volatility — predictions will have wide confidence bands'); score -= 10 }
  if (issues.length === 0) issues.push('Data quality looks good')
  return { score: Math.max(10, score), issues, rowCount: rawRows, outliers: indices.length }
}

// ── Compute data statistics ─────────────────────────────────
export function computeStats(data: number[]): DataStats {
  const sorted = [...data].sort((a, b) => a - b)
  const n = data.length
  const mean = data.reduce((a, b) => a + b, 0) / n
  const median = n % 2 === 0 ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 : sorted[Math.floor(n / 2)]
  const first = data.slice(0, Math.max(1, Math.floor(n / 4)))
  const last = data.slice(-Math.max(1, Math.floor(n / 4)))
  const firstAvg = first.reduce((a, b) => a + b, 0) / first.length
  const lastAvg = last.reduce((a, b) => a + b, 0) / last.length
  const growth = firstAvg === 0 ? 0 : ((lastAvg - firstAvg) / firstAvg) * 100
  const cv = mean !== 0 ? stdDev(data) / mean : 0
  return {
    mean, median, min: sorted[0], max: sorted[n - 1],
    stdDev: stdDev(data), count: n, growth, cv,
    q1: sorted[Math.floor(n * 0.25)], q3: sorted[Math.floor(n * 0.75)],
  }
}

// ── Decompose time series ───────────────────────────────────
function decompose(data: number[]): { trend: number[]; seasonal: number[]; residual: number[] } {
  const n = data.length
  const window = Math.min(Math.floor(n / 3), 7) || 1
  const trendLine = movingAverage(data, window)
  const period = n >= 14 ? 7 : (n >= 8 ? 4 : n)
  const seasonalPattern: number[] = Array(period).fill(0)
  const counts: number[] = Array(period).fill(0)
  for (let i = 0; i < n; i++) {
    const detrended = trendLine[i] !== 0 ? data[i] / trendLine[i] : 1
    if (isFinite(detrended)) { seasonalPattern[i % period] += detrended; counts[i % period]++ }
  }
  for (let i = 0; i < period; i++) seasonalPattern[i] = counts[i] > 0 ? seasonalPattern[i] / counts[i] : 1
  const seasonal = data.map((_, i) => (trendLine[i] || 0) * (seasonalPattern[i % period] - 1))
  const residual = data.map((d, i) => d - trendLine[i] - seasonal[i])
  return { trend: trendLine, seasonal, residual }
}

// ── Generate date labels ──────────────────────────────────────
function generateDateLabels(startFromEnd: number, horizon: number, period: 'day' | 'week' | 'month' = 'day'): string[] {
  const labels: string[] = []
  const now = new Date()
  for (let i = startFromEnd - 1; i >= 0; i--) {
    const d = new Date(now)
    if (period === 'day') d.setDate(d.getDate() - i)
    else if (period === 'week') d.setDate(d.getDate() - i * 7)
    else d.setMonth(d.getMonth() - i)
    labels.push(d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }))
  }
  for (let i = 1; i <= horizon; i++) {
    const d = new Date(now)
    if (period === 'day') d.setDate(d.getDate() + i)
    else if (period === 'week') d.setDate(d.getDate() + i * 7)
    else d.setMonth(d.getMonth() + i)
    labels.push(d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }))
  }
  return labels
}

// ── Backtest (holdout validation) ───────────────────────────
function backtestMethod(data: number[], method: 'linear' | 'moving_avg' | 'seasonal' | 'exponential'): { mae: number; rmse: number; mape: number; r2: number } {
  const holdout = Math.max(2, Math.floor(data.length * 0.2))
  const train = data.slice(0, -holdout)
  const test = data.slice(-holdout)
  if (train.length < 3) return { mae: 0, rmse: 0, mape: 0, r2: 0 }
  const result = forecast(train, holdout, method)
  const predicted = result.predicted.slice(train.length)
  const maeVal = calcMae(test, predicted)
  const rmseVal = calcRmse(test, predicted)
  const mapeVal = mape(test, predicted)
  const meanTest = test.reduce((a, b) => a + b, 0) / test.length
  const ssTot = test.reduce((s, v) => s + (v - meanTest) ** 2, 0)
  const ssRes = test.reduce((s, v, i) => s + (v - predicted[i]) ** 2, 0)
  const r2 = ssTot === 0 ? 1 : Math.max(0, 1 - ssRes / ssTot)
  return { mae: maeVal, rmse: rmseVal, mape: mapeVal, r2 }
}

// ── Main forecast function ────────────────────────────────────
export function forecast(
  data: number[],
  horizonPoints: number = 7,
  method: 'linear' | 'moving_avg' | 'seasonal' | 'exponential' | 'auto' = 'linear',
  confidenceMultiplier: number = 1.5,
): ForecastResult {
  if (!data.length) throw new Error('No data to forecast')

  if (method === 'auto') {
    const best = findBestMethod(data, horizonPoints)
    return forecast(data, horizonPoints, best, confidenceMultiplier)
  }

  const n = data.length
  let predicted: number[] = []
  let methodLabel = ''
  let methodKey = method
  let r2 = 0

  if (method === 'linear' || n < 4) {
    const reg = linearRegression(data)
    const fitted = data.map((_, i) => reg.slope * i + reg.intercept)
    const future = Array.from({ length: horizonPoints }, (_, i) => Math.max(0, reg.slope * (n + i) + reg.intercept))
    predicted = [...fitted, ...future]
    r2 = reg.r2
    methodLabel = 'Linear regression'
    methodKey = 'linear'
  } else if (method === 'moving_avg') {
    const window = Math.min(Math.floor(n / 3), 7)
    const ma = movingAverage(data, window)
    const lastMA = ma[ma.length - 1]
    const trendSlope = (ma[ma.length - 1] - ma[0]) / (n - 1)
    const future = Array.from({ length: horizonPoints }, (_, i) => Math.max(0, lastMA + trendSlope * (i + 1)))
    predicted = [...ma, ...future]
    r2 = 1 - mape(data, ma) / 100
    methodLabel = `Moving average (${window}-period)`
  } else if (method === 'exponential') {
    const { fitted, level, trend } = exponentialSmoothing(data)
    const future = Array.from({ length: horizonPoints }, (_, i) => Math.max(0, level + trend * (i + 1)))
    predicted = [...fitted, ...future]
    r2 = 1 - mape(data, fitted) / 100
    methodLabel = 'Exponential smoothing'
  } else {
    const period = n >= 14 ? 7 : 4
    const seasonal: number[] = []
    for (let i = 0; i < n; i++) seasonal.push(data[i % period] || data[i])
    const reg = linearRegression(data)
    const fitted = data.map((_, i) => {
      const trendVal = reg.slope * i + reg.intercept
      const seasonalAdj = (data[i % period] || data[i]) / (seasonal[i % period] || 1)
      return Math.max(0, trendVal * (isFinite(seasonalAdj) ? seasonalAdj : 1))
    })
    const future = Array.from({ length: horizonPoints }, (_, i) => {
      const trendVal = reg.slope * (n + i) + reg.intercept
      const seasonalAdj = (data[(n + i) % period] || data[i % period] || 1) / (seasonal[(n + i) % period] || 1)
      return Math.max(0, trendVal * (isFinite(seasonalAdj) ? seasonalAdj : 1))
    })
    predicted = [...fitted, ...future]
    r2 = 1 - mape(data, fitted) / 100
    methodLabel = 'Seasonal decomposition'
  }

  const residuals = data.map((d, i) => d - predicted[i])
  const sd = stdDev(residuals)
  const upperBound = predicted.map(p => p + sd * confidenceMultiplier)
  const lowerBound = predicted.map(p => Math.max(0, p - sd * confidenceMultiplier))
  const firstVal = predicted[0]; const lastVal = predicted[predicted.length - 1]
  const trendPct = firstVal === 0 ? 0 : ((lastVal - firstVal) / firstVal) * 100
  const trend: 'up' | 'down' | 'flat' = trendPct > 2 ? 'up' : trendPct < -2 ? 'down' : 'flat'
  const accuracy = Math.max(0, Math.min(100, 100 - mape(data, predicted.slice(0, n))))
  const labels = generateDateLabels(n, horizonPoints)
  const actual: (number | null)[] = [...data, ...Array(horizonPoints).fill(null)]
  const dec = decompose(data)
  const bt = backtestMethod(data, (method as string) === 'auto' ? 'linear' : method)
  const dq = assessDataQuality(data, data.length)
  const anomalies = detectAnomalies(data, predicted.slice(0, n))

  const dirWord = trend === 'up' ? 'increase' : trend === 'down' ? 'decrease' : 'remain stable'
  const anomalyNote = anomalies.length > 0 ? ` ${anomalies.filter(a => a.severity === 'high').length} significant anomalies detected in historical data.` : ''
  const summary = `Based on ${n} data points using ${methodLabel}, values are forecast to ${dirWord} by ${Math.abs(trendPct).toFixed(1)}% over the next ${horizonPoints} periods. Model accuracy: ${accuracy.toFixed(0)}% (R²: ${r2.toFixed(2)}).${anomalyNote}`

  return {
    labels, actual, predicted, upperBound, lowerBound, trend, trendPct, accuracy,
    method: methodLabel, methodKey, summary, decomposition: dec, dataQuality: dq,
    backtest: bt, anomalies,
  }
}

// ── Auto-best method selection ──────────────────────────────
export function findBestMethod(data: number[], horizonPoints: number): 'linear' | 'moving_avg' | 'seasonal' | 'exponential' {
  const methods: ('linear' | 'moving_avg' | 'seasonal' | 'exponential')[] = ['linear', 'moving_avg', 'seasonal', 'exponential']
  let bestMethod: typeof methods[number] = 'linear'
  let bestAccuracy = -Infinity
  for (const m of methods) {
    try {
      const result = forecast(data, horizonPoints, m)
      if (result.accuracy > bestAccuracy) { bestAccuracy = result.accuracy; bestMethod = m }
    } catch { /* skip */ }
  }
  return bestMethod
}

// ── Compare all methods (with full prediction data) ─────────
export function compareMethods(data: number[], horizonPoints: number): MethodComparison[] {
  const methods: ('linear' | 'moving_avg' | 'seasonal' | 'exponential')[] = ['linear', 'moving_avg', 'seasonal', 'exponential']
  return methods.map(m => {
    try {
      const result = forecast(data, horizonPoints, m)
      const bt = backtestMethod(data, m)
      return {
        method: result.method, methodKey: m, accuracy: result.accuracy,
        mae: bt.mae, rmse: bt.rmse, trendPct: result.trendPct, trend: result.trend,
        predicted: result.predicted, labels: result.labels,
      }
    } catch {
      return { method: m, methodKey: m, accuracy: 0, mae: Infinity, rmse: Infinity, trendPct: 0, trend: 'flat', predicted: [], labels: [] }
    }
  }).sort((a, b) => b.accuracy - a.accuracy)
}

// ── What-if simulation ──────────────────────────────────────
export function whatIf(
  data: number[],
  horizonPoints: number,
  method: 'linear' | 'moving_avg' | 'seasonal' | 'exponential',
  adjustments: { startPeriod: number; endPeriod: number; changePct: number },
  confidenceMultiplier: number = 1.5,
): WhatIfResult {
  const base = forecast(data, horizonPoints, method, confidenceMultiplier)
  const modifiedData = [...data]

  const start = Math.max(0, adjustments.startPeriod)
  const end = Math.min(data.length - 1, adjustments.endPeriod)
  for (let i = start; i <= end; i++) {
    modifiedData[i] = modifiedData[i] * (1 + adjustments.changePct / 100)
  }

  const modified = forecast(modifiedData, horizonPoints, method, confidenceMultiplier)

  const baseFuture = base.predicted.slice(data.length)
  const modFuture = modified.predicted.slice(data.length)
  const baseSum = baseFuture.reduce((a, b) => a + b, 0)
  const modSum = modFuture.reduce((a, b) => a + b, 0)
  const impactPct = baseSum === 0 ? 0 : ((modSum - baseSum) / baseSum) * 100

  const dir = impactPct > 0 ? 'increase' : impactPct < 0 ? 'decrease' : 'not change'
  const impactSummary = `Applying a ${adjustments.changePct > 0 ? '+' : ''}${adjustments.changePct}% change to periods ${start + 1}–${end + 1} would ${dir} the forecast by ${Math.abs(impactPct).toFixed(1)}% over the next ${horizonPoints} periods.`

  return { base, modified, impactPct, impactSummary }
}

// ── Detect numeric columns ──────────────────────────────────
export function detectNumericColumns(rows: Record<string, unknown>[]): string[] {
  if (!rows.length) return []
  return Object.keys(rows[0]).filter(col => {
    const sample = rows.slice(0, 20).map(r => Number(r[col])).filter(v => !isNaN(v) && isFinite(v))
    return sample.length >= Math.min(3, rows.slice(0, 20).length * 0.5)
  })
}

// ── Detect date column ────────────────────────────────────────
export function detectDateColumn(rows: Record<string, unknown>[]): string | null {
  if (!rows.length) return null
  const cols = Object.keys(rows[0])
  const datePatterns = /date|day|week|month|period|created|time|when/i
  return cols.find(c => datePatterns.test(c) && rows.slice(0, 5).some(r => {
    const d = new Date(String(r[c]))
    return !isNaN(d.getTime())
  })) || null
}

// ── Aggregate by date ───────────────────────────────────────
function aggregateByDate(rows: Record<string, unknown>[], valueCol: string, dateCol: string | null): number[] {
  if (!dateCol) return rows.map(r => Number(r[valueCol])).filter(v => !isNaN(v) && isFinite(v))
  const grouped: Record<string, number> = {}
  rows.forEach(r => {
    const dateStr = String(r[dateCol] || '').substring(0, 10)
    if (!dateStr || dateStr === 'undefined') return
    const val = Number(r[valueCol])
    if (!isNaN(val) && isFinite(val)) grouped[dateStr] = (grouped[dateStr] || 0) + val
  })
  const sorted = Object.keys(grouped).sort()
  return sorted.map(d => grouped[d])
}

// ── Resolve values from dataset ─────────────────────────────
function resolveValues(rows: Record<string, unknown>[], targetColumn: string): number[] {
  const rawValues = rows.map(r => Number(r[targetColumn])).filter(v => !isNaN(v) && isFinite(v))
  if (rawValues.length >= 3) {
    const dateCol = detectDateColumn(rows)
    return dateCol ? aggregateByDate(rows, targetColumn, dateCol) : rawValues
  }
  const numericCols = detectNumericColumns(rows)
  if (numericCols.length === 0) throw new Error(`No numeric columns found. Your dataset has: ${Object.keys(rows[0]).join(', ')}`)
  const preferred = numericCols.find(c => /sale|revenue|unit|qty|quantity|amount|total|volume/i.test(c)) || numericCols[0]
  const dateCol = detectDateColumn(rows)
  return aggregateByDate(rows, preferred, dateCol)
}

// ── Forecast from dataset ───────────────────────────────────
export function forecastFromDataset(
  rows: Record<string, unknown>[], targetColumn: string,
  horizonPoints: number = 14,
  method: 'linear' | 'moving_avg' | 'seasonal' | 'exponential' | 'auto' = 'linear',
  confidenceMultiplier: number = 1.5,
): ForecastResult {
  if (!rows.length) throw new Error('Dataset is empty')
  const values = resolveValues(rows, targetColumn)
  if (values.length < 3) throw new Error(`Need at least 3 data points to forecast. Found ${values.length}. Try uploading more rows.`)
  const result = forecast(values, horizonPoints, method, confidenceMultiplier)
  const rawValues = rows.map(r => Number(r[targetColumn])).filter(v => !isNaN(v) && isFinite(v))
  if (rawValues.length < 3) {
    const numericCols = detectNumericColumns(rows)
    const preferred = numericCols.find(c => /sale|revenue|unit|qty|quantity|amount|total|volume/i.test(c)) || numericCols[0]
    return { ...result, summary: `Note: "${targetColumn}" contains text — AskBiz automatically forecast "${preferred}" instead. ${result.summary}` }
  }
  return result
}

// ── Compare methods from dataset ────────────────────────────
export function compareMethodsFromDataset(rows: Record<string, unknown>[], targetColumn: string, horizonPoints: number = 14): MethodComparison[] {
  const values = resolveValues(rows, targetColumn)
  if (values.length < 3) return []
  return compareMethods(values, horizonPoints)
}

// ── What-if from dataset ────────────────────────────────────
export function whatIfFromDataset(
  rows: Record<string, unknown>[], targetColumn: string,
  horizonPoints: number, method: 'linear' | 'moving_avg' | 'seasonal' | 'exponential',
  adjustments: { startPeriod: number; endPeriod: number; changePct: number },
  confidenceMultiplier: number = 1.5,
): WhatIfResult {
  const values = resolveValues(rows, targetColumn)
  if (values.length < 3) throw new Error('Need at least 3 data points')
  return whatIf(values, horizonPoints, method, adjustments, confidenceMultiplier)
}

// ── Stats from dataset ──────────────────────────────────────
export function statsFromDataset(rows: Record<string, unknown>[], targetColumn: string): DataStats | null {
  const rawValues = rows.map(r => Number(r[targetColumn])).filter(v => !isNaN(v) && isFinite(v))
  if (rawValues.length < 2) {
    const numericCols = detectNumericColumns(rows)
    if (!numericCols.length) return null
    const preferred = numericCols.find(c => /sale|revenue|unit|qty|quantity|amount|total|volume/i.test(c)) || numericCols[0]
    const vals = rows.map(r => Number(r[preferred])).filter(v => !isNaN(v) && isFinite(v))
    return vals.length >= 2 ? computeStats(vals) : null
  }
  return computeStats(rawValues)
}

// ── Deviation check (compare forecast vs new actuals) ───────
export function checkDeviation(
  forecastedValues: number[], actualValues: number[],
): { deviationPct: number; alert: boolean; severity: 'low' | 'medium' | 'high'; message: string } {
  const n = Math.min(forecastedValues.length, actualValues.length)
  if (n === 0) return { deviationPct: 0, alert: false, severity: 'low', message: 'No data to compare' }
  const totalForecast = forecastedValues.slice(0, n).reduce((a, b) => a + b, 0)
  const totalActual = actualValues.slice(0, n).reduce((a, b) => a + b, 0)
  const deviationPct = totalForecast === 0 ? 0 : ((totalActual - totalForecast) / totalForecast) * 100
  const abs = Math.abs(deviationPct)
  const severity = abs > 25 ? 'high' : abs > 10 ? 'medium' : 'low'
  const alert = abs > 10
  const dir = deviationPct > 0 ? 'above' : 'below'
  const message = alert
    ? `Actuals are ${abs.toFixed(1)}% ${dir} forecast — ${severity === 'high' ? 'significant deviation, review needed' : 'moderate deviation, monitor closely'}`
    : `Actuals are tracking within ${abs.toFixed(1)}% of forecast — on track`
  return { deviationPct, alert, severity, message }
}
