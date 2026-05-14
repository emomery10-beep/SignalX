// ============================================================
// SignalX Alerts Engine
// Evaluates alert conditions against parsed datasets
// ============================================================

export interface AlertCondition {
  id: string
  name: string
  alertType: 'stock_low' | 'margin_drop' | 'revenue_spike' | 'price_change' | 'custom'
  column: string
  operator: '<' | '>' | '<=' | '>=' | '==' | '!='
  threshold: number
  notifyEmail: boolean
}

export interface AlertFired {
  alertId: string
  alertName: string
  message: string
  severity: 'critical' | 'warning' | 'info'
  rows: Record<string, unknown>[]
  firedAt: Date
}

// ── Evaluate a single alert against dataset rows ─────────────
export function evaluateAlert(
  alert: AlertCondition,
  rows: Record<string, unknown>[]
): AlertFired | null {
  const matchingRows = rows.filter(row => {
    const val = Number(row[alert.column])
    if (isNaN(val)) return false
    switch (alert.operator) {
      case '<':  return val < alert.threshold
      case '>':  return val > alert.threshold
      case '<=': return val <= alert.threshold
      case '>=': return val >= alert.threshold
      case '==': return val === alert.threshold
      case '!=': return val !== alert.threshold
      default:   return false
    }
  })

  if (!matchingRows.length) return null

  const severity: 'critical' | 'warning' | 'info' =
    alert.alertType === 'stock_low' && matchingRows.some(r => Number(r[alert.column]) < 3)
      ? 'critical'
      : alert.alertType === 'margin_drop'
      ? 'warning'
      : 'info'

  const itemNames = matchingRows
    .slice(0, 5)
    .map(r => r['name'] || r['product'] || r['item'] || r[Object.keys(r)[0]])
    .join(', ')

  const messages: Record<string, string> = {
    stock_low:     `${matchingRows.length} item(s) have stock below ${alert.threshold}: ${itemNames}`,
    margin_drop:   `${matchingRows.length} item(s) have margin below ${alert.threshold}%: ${itemNames}`,
    revenue_spike: `${matchingRows.length} item(s) have revenue above ${alert.threshold}: ${itemNames}`,
    price_change:  `${matchingRows.length} item(s) have price changes exceeding ${alert.threshold}%: ${itemNames}`,
    custom:        `Alert "${alert.name}" triggered for ${matchingRows.length} row(s): ${itemNames}`,
  }

  return {
    alertId: alert.id,
    alertName: alert.name,
    message: messages[alert.alertType] || messages.custom,
    severity,
    rows: matchingRows.slice(0, 20),
    firedAt: new Date(),
  }
}

// ── Evaluate all alerts against a dataset ────────────────────
export function evaluateAllAlerts(
  alerts: AlertCondition[],
  rows: Record<string, unknown>[]
): AlertFired[] {
  return alerts
    .map(a => evaluateAlert(a, rows))
    .filter(Boolean) as AlertFired[]
}

// ── Smart auto-detect alerts from dataset ────────────────────
export function autoDetectAlerts(
  rows: Record<string, unknown>[],
  headers: string[]
): AlertCondition[] {
  const suggestions: AlertCondition[] = []
  const lowerHeaders = headers.map(h => h.toLowerCase())

  const stockCol = headers[lowerHeaders.findIndex(h => h.includes('stock') || h.includes('qty') || h.includes('quantity'))]
  const marginCol = headers[lowerHeaders.findIndex(h => h.includes('margin'))]
  const priceCol = headers[lowerHeaders.findIndex(h => h.includes('price') || h.includes('revenue'))]

  if (stockCol) {
    suggestions.push({
      id: 'auto-stock-critical', name: 'Critical stock alert',
      alertType: 'stock_low', column: stockCol, operator: '<', threshold: 5, notifyEmail: true,
    })
    suggestions.push({
      id: 'auto-stock-low', name: 'Low stock warning',
      alertType: 'stock_low', column: stockCol, operator: '<', threshold: 10, notifyEmail: true,
    })
  }
  if (marginCol) {
    suggestions.push({
      id: 'auto-margin', name: 'Low margin warning',
      alertType: 'margin_drop', column: marginCol, operator: '<', threshold: 15, notifyEmail: false,
    })
  }
  if (priceCol) {
    suggestions.push({
      id: 'auto-revenue', name: 'High revenue item',
      alertType: 'revenue_spike', column: priceCol, operator: '>', threshold: 1000, notifyEmail: false,
    })
  }

  return suggestions
}
