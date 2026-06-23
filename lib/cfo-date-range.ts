export function getDateRange(key: string, now: Date) {
  const today = now.toISOString().split('T')[0]
  const y = now.getFullYear()
  const m = now.getMonth()
  const d = now.getDate()

  switch (key) {
    case 'today': {
      const yesterday = new Date(now.getTime() - 86400000).toISOString().split('T')[0]
      return { start: today, end: today, compStart: yesterday, compEnd: yesterday }
    }
    case 'this_week': {
      const dow = now.getDay()
      const mondayOffset = dow === 0 ? 6 : dow - 1
      const monday = new Date(y, m, d - mondayOffset)
      const prevMonday = new Date(monday.getTime() - 7 * 86400000)
      const prevSunday = new Date(monday.getTime() - 86400000)
      return {
        start: monday.toISOString().split('T')[0],
        end: today,
        compStart: prevMonday.toISOString().split('T')[0],
        compEnd: prevSunday.toISOString().split('T')[0],
      }
    }
    case 'this_month': {
      const monthStart = new Date(y, m, 1).toISOString().split('T')[0]
      const prevMonthStart = new Date(y, m - 1, 1).toISOString().split('T')[0]
      const prevMonthEnd = new Date(y, m, 0).toISOString().split('T')[0]
      return { start: monthStart, end: today, compStart: prevMonthStart, compEnd: prevMonthEnd }
    }
    case 'last_month': {
      const s = new Date(y, m - 1, 1).toISOString().split('T')[0]
      const e = new Date(y, m, 0).toISOString().split('T')[0]
      const cs = new Date(y, m - 2, 1).toISOString().split('T')[0]
      const ce = new Date(y, m - 1, 0).toISOString().split('T')[0]
      return { start: s, end: e, compStart: cs, compEnd: ce }
    }
    case 'this_quarter': {
      const qm = Math.floor(m / 3) * 3
      const qs = new Date(y, qm, 1).toISOString().split('T')[0]
      const pqs = new Date(y, qm - 3, 1).toISOString().split('T')[0]
      const pqe = new Date(y, qm, 0).toISOString().split('T')[0]
      return { start: qs, end: today, compStart: pqs, compEnd: pqe }
    }
    case 'ytd': {
      const ytdStart = `${y}-01-01`
      const prevYtdStart = `${y - 1}-01-01`
      const prevYtdEnd = `${y - 1}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      return { start: ytdStart, end: today, compStart: prevYtdStart, compEnd: prevYtdEnd }
    }
    case 'last_90': {
      const s90 = new Date(now.getTime() - 90 * 86400000).toISOString().split('T')[0]
      const cs90 = new Date(now.getTime() - 180 * 86400000).toISOString().split('T')[0]
      const ce90 = new Date(now.getTime() - 91 * 86400000).toISOString().split('T')[0]
      return { start: s90, end: today, compStart: cs90, compEnd: ce90 }
    }
    default:
      return getDateRange('this_month', now)
  }
}
