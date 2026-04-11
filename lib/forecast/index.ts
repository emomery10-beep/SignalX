// ============================================================
// SignalX Forecasting Engine
// Linear regression, moving average, seasonal detection
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
  summary: string
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
  // R²
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
  const mean = data.reduce((a, b) => a + b, 0) / data.length
  return Math.sqrt(data.reduce((s, x) => s + (x - mean) ** 2, 0) / data.length)
}

// ── MAPE (Mean Absolute Percentage Error) ────────────────────
function mape(actual: number[], predicted: number[]): number {
  const pairs = actual.map((a, i) => ({ a, p: predicted[i] })).filter(({ a }) => a !== 0)
  if (!pairs.length) return 0
  return pairs.reduce((s, { a, p }) => s + Math.abs((a - p) / a), 0) / pairs.length * 100
}

// ── Generate date labels ──────────────────────────────────────
function generateDateLabels(startFromEnd: number, horizon: number, period: 'day' | 'week' | 'month' = 'day'): string[] {
  const labels: string[] = []
  const now = new Date()
  // Historical labels
  for (let i = startFromEnd - 1; i >= 0; i--) {
    const d = new Date(now)
    if (period === 'day') d.setDate(d.getDate() - i)
    else if (period === 'week') d.setDate(d.getDate() - i * 7)
    else d.setMonth(d.getMonth() - i)
    labels.push(d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }))
  }
  // Future labels
  for (let i = 1; i <= horizon; i++) {
    const d = new Date(now)
    if (period === 'day') d.setDate(d.getDate() + i)
    else if (period === 'week') d.setDate(d.getDate() + i * 7)
    else d.setMonth(d.getMonth() + i)
    labels.push(d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }))
  }
  return labels
}

// ── Main forecast function ────────────────────────────────────
export function forecast(
  data: number[],
  horizonPoints: number = 7,
  method: 'linear' | 'moving_avg' | 'seasonal' = 'linear'
): ForecastResult {
  if (!data.length) throw new Error('No data to forecast')

  const n = data.length
  let predicted: number[] = []
  let methodLabel = ''
  let r2 = 0

  if (method === 'linear' || n < 4) {
    const reg = linearRegression(data)
    // Fitted values for historical
    const fitted = data.map((_, i) => reg.slope * i + reg.intercept)
    // Future points
    const future = Array.from({ length: horizonPoints }, (_, i) =>
      Math.max(0, reg.slope * (n + i) + reg.intercept)
    )
    predicted = [...fitted, ...future]
    r2 = reg.r2
    methodLabel = 'Linear regression'
  } else if (method === 'moving_avg') {
    const window = Math.min(Math.floor(n / 3), 7)
    const ma = movingAverage(data, window)
    const lastMA = ma[ma.length - 1]
    const trend = (ma[ma.length - 1] - ma[0]) / (n - 1)
    const future = Array.from({ length: horizonPoints }, (_, i) =>
      Math.max(0, lastMA + trend * (i + 1))
    )
    predicted = [...ma, ...future]
    r2 = 1 - mape(data, ma) / 100
    methodLabel = `Moving average (${window}-period)`
  } else {
    // Seasonal — detect period (7 for weekly, 4 for monthly)
    const period = n >= 14 ? 7 : 4
    const seasonal: number[] = []
    for (let i = 0; i < n; i++) {
      const base = data[i % period] || data[i]
      seasonal.push(base)
    }
    const reg = linearRegression(data)
    const fitted = data.map((_, i) => {
      const trend = reg.slope * i + reg.intercept
      const seasonalAdj = (data[i % period] || data[i]) / (seasonal[i % period] || 1)
      return Math.max(0, trend * (isFinite(seasonalAdj) ? seasonalAdj : 1))
    })
    const future = Array.from({ length: horizonPoints }, (_, i) => {
      const trend = reg.slope * (n + i) + reg.intercept
      const seasonalAdj = (data[(n + i) % period] || data[i % period] || 1) / (seasonal[(n + i) % period] || 1)
      return Math.max(0, trend * (isFinite(seasonalAdj) ? seasonalAdj : 1))
    })
    predicted = [...fitted, ...future]
    r2 = 1 - mape(data, fitted) / 100
    methodLabel = 'Seasonal decomposition'
  }

  // Confidence bands (±1 std dev of residuals)
  const residuals = data.map((d, i) => d - predicted[i])
  const sd = stdDev(residuals)
  const upperBound = predicted.map(p => p + sd * 1.5)
  const lowerBound = predicted.map(p => Math.max(0, p - sd * 1.5))

  // Trend analysis
  const firstVal = predicted[0]
  const lastVal = predicted[predicted.length - 1]
  const trendPct = firstVal === 0 ? 0 : ((lastVal - firstVal) / firstVal) * 100
  const trend: 'up' | 'down' | 'flat' = trendPct > 2 ? 'up' : trendPct < -2 ? 'down' : 'flat'

  // Accuracy
  const accuracy = Math.max(0, Math.min(100, 100 - mape(data, predicted.slice(0, n))))

  const labels = generateDateLabels(n, horizonPoints)
  const actual: (number | null)[] = [...data, ...Array(horizonPoints).fill(null)]

  const dirWord = trend === 'up' ? 'increase' : trend === 'down' ? 'decrease' : 'remain stable'
  const summary = `Based on ${n} data points using ${methodLabel}, values are forecast to ${dirWord} by ${Math.abs(trendPct).toFixed(1)}% over the next ${horizonPoints} periods. Model accuracy: ${accuracy.toFixed(0)}%.`

  return { labels, actual, predicted, upperBound, lowerBound, trend, trendPct, accuracy, method: methodLabel, summary }
}

// ── Forecast from dataset column ─────────────────────────────
export function forecastFromDataset(
  rows: Record<string, unknown>[],
  targetColumn: string,
  horizonPoints: number = 14,
  method: 'linear' | 'moving_avg' | 'seasonal' = 'linear'
): ForecastResult {
  const values = rows
    .map(r => Number(r[targetColumn]))
    .filter(v => !isNaN(v) && isFinite(v))

  if (values.length < 3) throw new Error(`Need at least 3 data points in "${targetColumn}" to forecast. Found ${values.length}.`)
  return forecast(values, horizonPoints, method)
}
