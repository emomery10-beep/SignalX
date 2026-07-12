'use client'
import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { detectGeoFromTimezone } from '@/lib/geo'
import { useLang } from '@/components/LanguageProvider'

interface PosPulseProps {
  onAsk: (prompt: string) => void
}

interface DailyBucket { date: string; label: string; revenue: number; cost: number; txns: number; avgBasket: number }

interface SalesData {
  todayRevenue: number
  todayTxns: number
  todayCost: number
  todayRefunds: number
  todayDiscounts: number
  yesterdayRevenue: number
  yesterdayTxns: number
  yesterdayCost: number
  yesterdayHourly: Record<number, { revenue: number; count: number }>
  weekRevenue: number
  weekTxns: number
  weekCost: number
  prevWeekRevenue: number
  prevWeekTxns: number
  prevWeekCost: number
  avgBasket: number
  topHour: string
  topHourRevenue: number
  paymentBreakdown: Record<string, number>
  hourlyData: Record<number, { revenue: number; count: number }>
  topItems: Array<{ name: string; revenue: number; qty: number; margin: number }>
  categoryBreakdown: Record<string, { revenue: number; count: number }>
  staffSales: Array<{ name: string; revenue: number; txns: number }>
  itemsSold: number
  dailyBreakdown: DailyBucket[]
}

interface LowStockItem {
  name: string
  qty: number
  urgency: 'critical' | 'high' | 'medium'
}

const URGENCY_COLOR: Record<string, string> = {
  critical: '#EF4444',
  high: '#F59E0B',
  medium: '#6366F1',
}

function detectSector(bt: string): { label: string; emoji: string } {
  const t = (bt || '').toLowerCase()
  if (['restaurant','cafe','café','bar','pub','takeaway','food','catering','bistro','diner'].some(k => t.includes(k)))
    return { label: 'Kitchen Pulse', emoji: '🍴' }
  if (['repair','phone','mobile','electronic','watch','laptop','computer'].some(k => t.includes(k)))
    return { label: 'Repair Pulse', emoji: '🔧' }
  if (['salon','barber','barbershop','spa','beauty','clinic','nail'].some(k => t.includes(k)))
    return { label: 'Salon Pulse', emoji: '💇' }
  if (['factory','manufactur','production','warehouse','processing','packaging'].some(k => t.includes(k)))
    return { label: 'Factory Pulse', emoji: '🏭' }
  if (['logistics','courier','delivery','shipping','transport'].some(k => t.includes(k)))
    return { label: 'Logistics Pulse', emoji: '🚛' }
  if (['ecommerce','e-commerce','online','shopify','woocommerce','amazon','etsy','dropship'].some(k => t.includes(k)))
    return { label: 'Store Pulse', emoji: '🛒' }
  return { label: 'POS Pulse', emoji: '📊' }
}

export default function PosPulse({ onAsk }: PosPulseProps) {
  const { tc } = useLang()
  const [sales, setSales] = useState<SalesData | null>(null)
  const [lowStock, setLowStock] = useState<LowStockItem[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'sales' | 'stock'>('sales')
  const [expanded, setExpanded] = useState(false)
  const [salesDrill, setSalesDrill] = useState<string | null>(null)
  const [kpiDrill, setKpiDrill] = useState<string | null>(null)
  const [periodDrill, setPeriodDrill] = useState<'yesterday' | 'prevWeek' | null>(null)
  const [sym, setSym] = useState('$')
  const [sectorInfo, setSectorInfo] = useState({ label: 'POS Pulse', emoji: '📊' })

  const DRILL_SECTIONS = [
    { id: 'time', label: tc('intel_pospulse.drillTime'), icon: '⏰' },
    { id: 'categories', label: tc('intel_pospulse.drillCategories'), icon: '🏷️' },
    { id: 'payments', label: tc('intel_pospulse.drillPayments'), icon: '💳' },
  ]

  useEffect(() => {
    const geo = detectGeoFromTimezone()
    setSym(geo.symbol)
  }, [])

  useEffect(() => {
    const sb = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    sb.auth.getUser().then(({ data }) => {
      if (!data.user) return
      sb.from('profiles').select('business_type').eq('id', data.user.id).single()
        .then(({ data: profile }) => {
          if (profile?.business_type) {
            setSectorInfo(detectSector(profile.business_type))
          }
        })
    })
  }, [])

  useEffect(() => {
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
    const yesterdayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).toISOString()
    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7).toISOString()
    const prevWeekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 14).toISOString()

    Promise.all([
      fetch(`/api/pos/transactions?from=${todayStart}&limit=500`).then(r => r.ok ? r.json() : null).catch(() => null),
      fetch(`/api/pos/transactions?from=${yesterdayStart}&to=${todayStart}&limit=500`).then(r => r.ok ? r.json() : null).catch(() => null),
      fetch(`/api/pos/transactions?from=${weekStart}&limit=1000`).then(r => r.ok ? r.json() : null).catch(() => null),
      fetch(`/api/pos/transactions?from=${prevWeekStart}&to=${weekStart}&limit=1000`).then(r => r.ok ? r.json() : null).catch(() => null),
      fetch('/api/pos/inventory/low-stock').then(r => r.ok ? r.json() : null).catch(() => null),
    ]).then(([todayData, yesterdayData, weekData, prevWeekData, stockData]) => {
      const parseTxns = (d: any) => d?.transactions || (Array.isArray(d) ? d : [])
      const todayTxns = parseTxns(todayData)
      const yesterdayTxns = parseTxns(yesterdayData)
      const weekTxns = parseTxns(weekData)
      const prevWeekTxns = parseTxns(prevWeekData)

      const calcMetrics = (txns: any[]) => {
        let revenue = 0, cost = 0, refunds = 0, discounts = 0, itemsSold = 0
        const itemMap: Record<string, { revenue: number; cost: number; qty: number }> = {}
        const categoryMap: Record<string, { revenue: number; count: number }> = {}
        const staffMap: Record<string, { revenue: number; txns: number }> = {}
        const hourData: Record<number, { revenue: number; count: number }> = {}
        const paymentMap: Record<string, number> = {}

        for (const tx of txns) {
          const items = tx.pos_items || tx.items || []
          let txRev = 0
          for (const item of items) {
            const qty = Number(item.qty) || 0
            const price = Number(item.unit_price) || 0
            const costP = Number(item.cost_price) || 0
            const name = item.name || 'Unknown'
            const cat = item.category || 'Uncategorised'
            txRev += qty * price
            cost += qty * costP
            itemsSold += qty
            if (!itemMap[name]) itemMap[name] = { revenue: 0, cost: 0, qty: 0 }
            itemMap[name].revenue += qty * price
            itemMap[name].cost += qty * costP
            itemMap[name].qty += qty
            if (!categoryMap[cat]) categoryMap[cat] = { revenue: 0, count: 0 }
            categoryMap[cat].revenue += qty * price
            categoryMap[cat].count += qty
          }
          revenue += txRev

          // Refunds
          if (tx.status === 'refunded' || tx.status === 'void') refunds += txRev
          if (tx.discount) discounts += Number(tx.discount) || 0

          // Hourly
          const h = new Date(tx.created_at).getHours()
          if (!hourData[h]) hourData[h] = { revenue: 0, count: 0 }
          hourData[h].revenue += txRev
          hourData[h].count += 1

          // Payment
          const pType = tx.payment_type || 'cash'
          paymentMap[pType] = (paymentMap[pType] || 0) + 1

          // Staff
          const rawStaff = tx.staff_name || tx.cashier || 'Unknown'
          const staffName = typeof rawStaff === 'object' ? (rawStaff?.name || rawStaff?.first_name || JSON.stringify(rawStaff)) : String(rawStaff)
          if (!staffMap[staffName]) staffMap[staffName] = { revenue: 0, txns: 0 }
          staffMap[staffName].revenue += txRev
          staffMap[staffName].txns += 1
        }

        return { revenue, cost, refunds, discounts, itemsSold, itemMap, categoryMap, staffMap, hourData, paymentMap }
      }

      const today = calcMetrics(todayTxns)
      const yesterday = calcMetrics(yesterdayTxns)
      const week = calcMetrics(weekTxns)
      const prevWeek = calcMetrics(prevWeekTxns)

      // Top items
      const topItems = Object.entries(week.itemMap)
        .map(([name, d]) => ({
          name, revenue: d.revenue, qty: d.qty,
          margin: d.revenue > 0 ? ((d.revenue - d.cost) / d.revenue) * 100 : 0,
        }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10)

      // Staff sales
      const staffSales = Object.entries(week.staffMap)
        .map(([name, d]) => ({ name, ...d }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5)

      // Peak hour
      const peakEntry = Object.entries(week.hourData).sort((a, b) => b[1].revenue - a[1].revenue)[0]
      const topHour = peakEntry ? `${Number(peakEntry[0])}:00–${Number(peakEntry[0]) + 1}:00` : '—'
      const topHourRevenue = peakEntry ? peakEntry[1].revenue : 0

      // Daily breakdown (last 7 days)
      const dailyMap: Record<string, { revenue: number; cost: number; txns: number }> = {}
      const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      for (const tx of weekTxns) {
        const d = new Date(tx.created_at)
        const key = d.toISOString().slice(0, 10)
        if (!dailyMap[key]) dailyMap[key] = { revenue: 0, cost: 0, txns: 0 }
        const items = tx.pos_items || tx.items || []
        let txRev = 0, txCost = 0
        for (const item of items) { txRev += (Number(item.qty) || 0) * (Number(item.unit_price) || 0); txCost += (Number(item.qty) || 0) * (Number(item.cost_price) || 0) }
        dailyMap[key].revenue += txRev
        dailyMap[key].cost += txCost
        dailyMap[key].txns += 1
      }
      const dailyBreakdown: DailyBucket[] = []
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i)
        const key = d.toISOString().slice(0, 10)
        const data = dailyMap[key] || { revenue: 0, cost: 0, txns: 0 }
        dailyBreakdown.push({ date: key, label: dayLabels[d.getDay()], revenue: data.revenue, cost: data.cost, txns: data.txns, avgBasket: data.txns > 0 ? data.revenue / data.txns : 0 })
      }

      setSales({
        todayRevenue: today.revenue,
        todayTxns: todayTxns.length,
        todayCost: today.cost,
        todayRefunds: today.refunds,
        todayDiscounts: today.discounts,
        yesterdayRevenue: yesterday.revenue,
        yesterdayTxns: yesterdayTxns.length,
        yesterdayCost: yesterday.cost,
        yesterdayHourly: yesterday.hourData,
        weekRevenue: week.revenue,
        weekTxns: weekTxns.length,
        weekCost: week.cost,
        prevWeekRevenue: prevWeek.revenue,
        prevWeekTxns: prevWeekTxns.length,
        prevWeekCost: prevWeek.cost,
        avgBasket: weekTxns.length > 0 ? week.revenue / weekTxns.length : 0,
        topHour,
        topHourRevenue,
        paymentBreakdown: week.paymentMap,
        hourlyData: today.hourData,
        topItems,
        categoryBreakdown: week.categoryMap,
        staffSales,
        itemsSold: week.itemsSold,
        dailyBreakdown,
      })

      if (stockData?.items) {
        setLowStock(stockData.items.slice(0, expanded ? 10 : 5).map((it: any) => ({
          name: it.name || 'Unknown',
          qty: it.qty || 0,
          urgency: it.urgency || 'medium',
        })))
      }
    }).finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div style={{ padding: '16px 18px', borderRadius: 16, border: '1px solid var(--b)', background: 'var(--sf)', height: 180 }}>
        <div style={{ height: 14, width: 80, borderRadius: 4, background: 'var(--ev)', marginBottom: 16 }} />
        <div style={{ height: 32, width: 120, borderRadius: 6, background: 'var(--ev)', marginBottom: 12 }} />
        <div style={{ height: 10, borderRadius: 3, background: 'var(--ev)', width: '60%' }} />
      </div>
    )
  }

  const hasSales = sales && (sales.todayTxns > 0 || sales.weekTxns > 0)
  const hasStock = lowStock.length > 0
  const critCount = lowStock.filter(i => i.urgency === 'critical').length
  const dailyAvg = sales && sales.weekTxns > 0 ? sales.weekRevenue / 7 : 0
  const todayVsAvg = dailyAvg > 0 && sales ? ((sales.todayRevenue - dailyAvg) / dailyAvg * 100) : 0
  const weekVsPrev = sales && sales.prevWeekRevenue > 0 ? ((sales.weekRevenue - sales.prevWeekRevenue) / sales.prevWeekRevenue * 100) : 0
  const grossMarginWeek = sales && sales.weekRevenue > 0 ? ((sales.weekRevenue - sales.weekCost) / sales.weekRevenue * 100) : 0
  const todayNetSales = sales ? sales.todayRevenue - sales.todayRefunds - sales.todayDiscounts : 0

  // Projected end-of-day
  const nowHour = new Date().getHours()
  const hoursElapsed = Math.max(1, nowHour - 8) // assume 8am start
  const hoursRemaining = Math.max(0, 20 - nowHour) // assume 8pm close
  const projectedToday = sales && hoursElapsed > 0 ? (sales.todayRevenue / hoursElapsed) * (hoursElapsed + hoursRemaining) : 0

  const fmt = (v: number) => `${sym}${v.toLocaleString('en', { maximumFractionDigits: 0 })}`

  // KPI deep-dive definitions
  type KpiMeta = { id: string; label: string; value: string; color: string; status: 'good' | 'warning' | 'critical'; icon: string; benchmark: string; tips: string[]; action: string; askPrompt: string }

  const kpiCards: KpiMeta[] = !sales ? [] : [
    {
      id: 'dailyAvg', label: tc('intel_pospulse.kpiDailyAvgLabel'), value: fmt(dailyAvg), color: 'var(--tx)', icon: '📊',
      status: dailyAvg > 0 ? 'good' : 'warning',
      benchmark: dailyAvg > 0 ? tc('intel_pospulse.kpiDailyAvgBenchmarkYes', { value: fmt(dailyAvg) }) : tc('intel_pospulse.kpiDailyAvgBenchmarkNo'),
      tips: dailyAvg > 0
        ? [tc('intel_pospulse.kpiDailyAvgTip1'), tc('intel_pospulse.kpiDailyAvgTip2'), tc('intel_pospulse.kpiDailyAvgTip3'), tc('intel_pospulse.kpiDailyAvgTip4')]
        : [tc('intel_pospulse.kpiDailyAvgTipNo1'), tc('intel_pospulse.kpiDailyAvgTipNo2')],
      action: dailyAvg > 0 ? tc('intel_pospulse.kpiDailyAvgActionYes') : tc('intel_pospulse.kpiDailyAvgActionNo'),
      askPrompt: tc('intel_pospulse.kpiDailyAvgAskPrompt'),
    },
    {
      id: 'todayVsAvg', label: tc('intel_pospulse.kpiTodayVsAvgLabel'), value: `${todayVsAvg >= 0 ? '+' : ''}${todayVsAvg.toFixed(0)}%`, color: todayVsAvg >= 0 ? '#22C55E' : '#EF4444', icon: '📈',
      status: todayVsAvg >= -10 ? (todayVsAvg >= 10 ? 'good' : 'warning') : 'critical',
      benchmark: todayVsAvg >= 10 ? tc('intel_pospulse.kpiTodayVsAvgBenchmarkAbove') : todayVsAvg >= -10 ? tc('intel_pospulse.kpiTodayVsAvgBenchmarkAround') : tc('intel_pospulse.kpiTodayVsAvgBenchmarkBelow'),
      tips: todayVsAvg >= 0
        ? [tc('intel_pospulse.kpiTodayVsAvgTipAbove1'), tc('intel_pospulse.kpiTodayVsAvgTipAbove2'), tc('intel_pospulse.kpiTodayVsAvgTipAbove3')]
        : [tc('intel_pospulse.kpiTodayVsAvgTipBelow1'), tc('intel_pospulse.kpiTodayVsAvgTipBelow2'), tc('intel_pospulse.kpiTodayVsAvgTipBelow3'), tc('intel_pospulse.kpiTodayVsAvgTipBelow4')],
      action: todayVsAvg >= 0 ? tc('intel_pospulse.kpiTodayVsAvgActionAbove') : tc('intel_pospulse.kpiTodayVsAvgActionBelow'),
      askPrompt: `Today's sales are ${todayVsAvg >= 0 ? 'above' : 'below'} my average by ${Math.abs(todayVsAvg).toFixed(0)}%. Analyse why and suggest actions to ${todayVsAvg >= 0 ? 'maintain momentum' : 'recover'}.`,
    },
    {
      id: 'grossMargin', label: tc('intel_pospulse.kpiGrossMarginLabel'), value: `${grossMarginWeek.toFixed(0)}%`, color: grossMarginWeek >= 40 ? '#22C55E' : grossMarginWeek >= 20 ? '#F59E0B' : '#EF4444', icon: '💰',
      status: grossMarginWeek >= 40 ? 'good' : grossMarginWeek >= 20 ? 'warning' : 'critical',
      benchmark: grossMarginWeek >= 50 ? tc('intel_pospulse.kpiGrossMarginBenchmarkExcellent') : grossMarginWeek >= 40 ? tc('intel_pospulse.kpiGrossMarginBenchmarkHealthy') : grossMarginWeek >= 20 ? tc('intel_pospulse.kpiGrossMarginBenchmarkBelow') : tc('intel_pospulse.kpiGrossMarginBenchmarkCritical'),
      tips: grossMarginWeek >= 40
        ? [tc('intel_pospulse.kpiGrossMarginTipGood1'), tc('intel_pospulse.kpiGrossMarginTipGood2'), tc('intel_pospulse.kpiGrossMarginTipGood3'), tc('intel_pospulse.kpiGrossMarginTipGood4')]
        : grossMarginWeek >= 20
        ? [tc('intel_pospulse.kpiGrossMarginTipWarn1'), tc('intel_pospulse.kpiGrossMarginTipWarn2'), tc('intel_pospulse.kpiGrossMarginTipWarn3'), tc('intel_pospulse.kpiGrossMarginTipWarn4')]
        : [tc('intel_pospulse.kpiGrossMarginTipCrit1'), tc('intel_pospulse.kpiGrossMarginTipCrit2'), tc('intel_pospulse.kpiGrossMarginTipCrit3'), tc('intel_pospulse.kpiGrossMarginTipCrit4')],
      action: grossMarginWeek >= 40 ? tc('intel_pospulse.kpiGrossMarginActionGood') : tc('intel_pospulse.kpiGrossMarginActionBad'),
      askPrompt: `My gross margin is ${grossMarginWeek.toFixed(0)}%. Break down which products are pulling margins up vs down, and give me specific actions to improve profitability.`,
    },
    {
      id: 'avgBasket', label: tc('intel_pospulse.kpiAvgBasketLabel'), value: fmt(sales.avgBasket), color: '#6366F1', icon: '🛒',
      status: sales.avgBasket > 0 ? 'good' : 'warning',
      benchmark: sales.avgBasket > 0 ? tc('intel_pospulse.kpiAvgBasketBenchmarkYes', { value: fmt(sales.avgBasket) }) : tc('intel_pospulse.kpiAvgBasketBenchmarkNo'),
      tips: sales.avgBasket > 0
        ? [tc('intel_pospulse.kpiAvgBasketTip1'), tc('intel_pospulse.kpiAvgBasketTip2'), tc('intel_pospulse.kpiAvgBasketTip3'), tc('intel_pospulse.kpiAvgBasketTip4'), tc('intel_pospulse.kpiAvgBasketTip5')]
        : [tc('intel_pospulse.kpiAvgBasketTipNo')],
      action: sales.avgBasket > 0 ? tc('intel_pospulse.kpiAvgBasketActionYes') : tc('intel_pospulse.kpiAvgBasketActionNo'),
      askPrompt: `My average basket size is ${fmt(sales.avgBasket)}. How does this compare to similar businesses? What specific upselling strategies could increase it?`,
    },
    {
      id: 'netSales', label: tc('intel_pospulse.kpiNetSalesLabel'), value: fmt(todayNetSales), color: 'var(--tx)', icon: '💵',
      status: todayNetSales > 0 ? 'good' : sales.todayRefunds > 0 ? 'critical' : 'warning',
      benchmark: sales.todayRefunds > 0 ? tc('intel_pospulse.kpiNetSalesBenchmarkRefunds', { value: fmt(sales.todayRefunds) }) : tc('intel_pospulse.kpiNetSalesBenchmarkClean'),
      tips: [
        tc('intel_pospulse.kpiNetSalesTip1'),
        sales.todayRefunds > 0 ? tc('intel_pospulse.kpiNetSalesTipRefunds', { value: fmt(sales.todayRefunds) }) : tc('intel_pospulse.kpiNetSalesTipNoRefunds'),
        sales.todayDiscounts > 0 ? tc('intel_pospulse.kpiNetSalesTipDiscounts', { value: fmt(sales.todayDiscounts) }) : tc('intel_pospulse.kpiNetSalesTipNoDiscounts'),
        tc('intel_pospulse.kpiNetSalesTip4'),
        tc('intel_pospulse.kpiNetSalesTip5'),
      ],
      action: sales.todayRefunds > 0 ? tc('intel_pospulse.kpiNetSalesActionRefunds') : tc('intel_pospulse.kpiNetSalesActionClean'),
      askPrompt: `Analyse my net sales breakdown — I have ${fmt(sales.todayRevenue)} gross, ${fmt(sales.todayRefunds)} refunds, ${fmt(sales.todayDiscounts)} discounts. What patterns do you see and how can I reduce leakage?`,
    },
    {
      id: 'peakHour', label: tc('intel_pospulse.kpiPeakHourLabel'), value: sales.topHour, color: '#F59E0B', icon: '⏰',
      status: sales.topHourRevenue > 0 ? 'good' : 'warning',
      benchmark: sales.topHourRevenue > 0 ? tc('intel_pospulse.kpiPeakHourBenchmarkYes', { value: fmt(sales.topHourRevenue) }) : tc('intel_pospulse.kpiPeakHourBenchmarkNo'),
      tips: sales.topHourRevenue > 0
        ? [tc('intel_pospulse.kpiPeakHourTip1'), tc('intel_pospulse.kpiPeakHourTip2'), tc('intel_pospulse.kpiPeakHourTip3'), tc('intel_pospulse.kpiPeakHourTip4'), tc('intel_pospulse.kpiPeakHourTip5')]
        : [tc('intel_pospulse.kpiPeakHourTipNo')],
      action: sales.topHourRevenue > 0 ? tc('intel_pospulse.kpiPeakHourActionYes') : tc('intel_pospulse.kpiPeakHourActionNo'),
      askPrompt: `My peak hour is ${sales.topHour} with ${fmt(sales.topHourRevenue)} revenue. Analyse my hourly patterns — how can I maximize peak revenue and improve off-peak performance?`,
    },
  ]

  return (
    <div style={{
      padding: '16px 18px 14px', borderRadius: 16,
      border: '1px solid var(--b)',
      background: 'linear-gradient(180deg, var(--sf) 0%, rgba(99,102,241,.02) 100%)',
      transition: 'all 300ms ease',
    }}>
      {/* Tab toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', gap: 0, borderRadius: 6, overflow: 'hidden', border: '1px solid var(--b)' }}>
          {(['sales', 'stock'] as const).map(v => (
            <button key={v}
              onClick={() => { setView(v); setExpanded(false); setSalesDrill(null) }}
              style={{
                padding: '3px 10px', border: 'none',
                background: view === v ? '#6366F1' : 'transparent',
                color: view === v ? '#fff' : 'var(--tx3)',
                fontSize: 9, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                textTransform: 'uppercase', letterSpacing: '.06em', transition: 'all 100ms',
              }}
            >
              {v === 'sales' ? tc('intel_pospulse.tabSales') : tc('intel_pospulse.tabStock')}
              {v === 'stock' && critCount > 0 && (
                <span style={{ marginLeft: 4, fontSize: 8, background: '#EF4444', color: '#fff', borderRadius: 4, padding: '0 4px', fontWeight: 700 }}>{critCount}</span>
              )}
            </button>
          ))}
        </div>
        <span style={{ fontSize: 9, color: 'var(--tx3)', opacity: 0.7, display: 'flex', alignItems: 'center', gap: 3 }}>
          {sectorInfo.emoji} {sectorInfo.label}
        </span>
      </div>

      {/* ── Sales view ── */}
      {view === 'sales' && (
        <div>
          {hasSales ? (
            <>
              {/* Primary KPIs */}
              <div style={{ display: 'flex', gap: 12, marginBottom: 10, overflow: 'hidden' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 9, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 2 }}>{tc('intel_pospulse.today')}</div>
                  <span style={{ fontSize: 18, fontWeight: 800, color: '#6366F1', fontFamily: 'var(--font-sora, inherit)', lineHeight: 1, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {fmt(sales!.todayRevenue)}
                  </span>
                  <div style={{ fontSize: 9, color: 'var(--tx3)', marginTop: 2 }}>{tc('intel_pospulse.txns', { n: sales!.todayTxns })} · {sales!.itemsSold > 0 ? tc('intel_pospulse.items', { n: Math.round(sales!.itemsSold / Math.max(1, sales!.weekTxns) * sales!.todayTxns) }) : ''}</div>
                </div>
                <div style={{ width: 1, background: 'var(--b)', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 9, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 2 }}>{tc('intel_pospulse.thisWeek')}</div>
                  <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--tx)', fontFamily: 'var(--font-sora, inherit)', lineHeight: 1, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {fmt(sales!.weekRevenue)}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                    <span style={{ fontSize: 9, color: 'var(--tx3)' }}>{tc('intel_pospulse.txns', { n: sales!.weekTxns })}</span>
                    {weekVsPrev !== 0 && (
                      <span style={{ fontSize: 9, fontWeight: 700, color: weekVsPrev > 0 ? '#22C55E' : '#EF4444', background: weekVsPrev > 0 ? 'rgba(34,197,94,.1)' : 'rgba(239,68,68,.1)', borderRadius: 4, padding: '0 4px' }}>
                        {weekVsPrev > 0 ? '↑' : '↓'}{Math.abs(weekVsPrev).toFixed(0)}%
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Compact KPI grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(70px, 1fr))', gap: 6, marginBottom: 10 }}>
                <div style={{ padding: '6px 8px', borderRadius: 8, background: 'var(--ev)' }}>
                  <div style={{ fontSize: 8, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 2 }}>{tc('intel_pospulse.dailyAvgLabel')}</div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--tx)' }}>{fmt(dailyAvg)}</div>
                </div>
                <div style={{ padding: '6px 8px', borderRadius: 8, background: 'var(--ev)' }}>
                  <div style={{ fontSize: 8, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 2 }}>{tc('intel_pospulse.todayVsAvgLabel')}</div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: todayVsAvg >= 0 ? '#22C55E' : '#EF4444' }}>
                    {todayVsAvg >= 0 ? '+' : ''}{todayVsAvg.toFixed(0)}%
                  </div>
                </div>
                <div style={{ padding: '6px 8px', borderRadius: 8, background: 'var(--ev)' }}>
                  <div style={{ fontSize: 8, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 2 }}>{tc('intel_pospulse.grossMarginLabel')}</div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: grossMarginWeek >= 40 ? '#22C55E' : grossMarginWeek >= 20 ? '#F59E0B' : '#EF4444' }}>
                    {grossMarginWeek.toFixed(0)}%
                  </div>
                </div>
                <div style={{ padding: '6px 8px', borderRadius: 8, background: 'var(--ev)' }}>
                  <div style={{ fontSize: 8, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 2 }}>{tc('intel_pospulse.avgBasketLabel')}</div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#6366F1' }}>{fmt(sales!.avgBasket)}</div>
                </div>
              </div>

              {/* Net sales + Peak hour */}
              <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                <div style={{ flex: 1, padding: '6px 8px', borderRadius: 8, background: 'var(--ev)' }}>
                  <div style={{ fontSize: 8, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 2, fontWeight: 700 }}>{tc('intel_pospulse.netSalesTodayLabel')}</div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--tx)' }}>{fmt(todayNetSales)}</div>
                </div>
                <div style={{ flex: 1, padding: '6px 8px', borderRadius: 8, background: 'var(--ev)' }}>
                  <div style={{ fontSize: 8, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 2, fontWeight: 700 }}>{tc('intel_pospulse.peakHourLabel')}</div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#F59E0B' }}>{sales!.topHour}</div>
                </div>
              </div>

              {/* Drill section tabs — clicking opens modal */}
              <div style={{ display: 'flex', gap: 4 }}>
                {DRILL_SECTIONS.map(s => (
                  <button key={s.id}
                    onClick={() => setSalesDrill(s.id)}
                    style={{
                      flex: 1, padding: '6px 8px', borderRadius: 8,
                      border: '1px solid var(--b)',
                      background: 'var(--sf)',
                      color: 'var(--tx3)',
                      fontSize: 9, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                      transition: 'all 150ms', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366F130'; e.currentTarget.style.color = '#6366F1' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--b)'; e.currentTarget.style.color = 'var(--tx3)' }}
                  >
                    <span>{s.icon}</span>{s.label}
                  </button>
                ))}
              </div>

              {/* Footer */}
              <div style={{ display: 'flex', gap: 12, padding: '8px 0 0', borderTop: '1px solid var(--b)', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 9, color: 'var(--tx3)' }}>
                  <div style={{ width: 6, height: 6, borderRadius: 1, background: grossMarginWeek >= 40 ? '#22C55E' : '#F59E0B' }} />
                  {grossMarginWeek.toFixed(0)}{tc('intel_pospulse.marginFooter')}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 9, color: 'var(--tx3)' }}>
                  <div style={{ width: 6, height: 6, borderRadius: 1, background: '#F59E0B' }} />
                  {fmt(sales!.avgBasket)} {tc('intel_pospulse.avgFooter')}
                </div>
                <button
                  onClick={() => setSalesDrill('time')}
                  style={{ fontSize: 9, color: '#6366F1', fontWeight: 600, marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}
                >
                  {tc('intel_pospulse.tapToAnalyse')}
                </button>
              </div>
            </>
          ) : (
            <div style={{ fontSize: 11, color: 'var(--tx3)', padding: '8px 0' }}>
              {tc('intel_pospulse.noSalesToday')}
            </div>
          )}
        </div>
      )}

      {/* ── Stock view ── */}
      {view === 'stock' && (
        <div>
          {hasStock ? (
            <>
              {expanded && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 10, animation: 'fadeIn 200ms ease' }}>
                  <div style={{ padding: '8px 10px', borderRadius: 8, background: 'var(--ev)' }}>
                    <div style={{ fontSize: 9, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 2 }}>{tc('intel_pospulse.lowStockLabel')}</div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#F59E0B' }}>{lowStock.length}</div>
                  </div>
                  <div style={{ padding: '8px 10px', borderRadius: 8, background: 'var(--ev)' }}>
                    <div style={{ fontSize: 9, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 2 }}>{tc('intel_pospulse.criticalLabel')}</div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#EF4444' }}>{critCount}</div>
                  </div>
                  <div style={{ padding: '8px 10px', borderRadius: 8, background: 'var(--ev)' }}>
                    <div style={{ fontSize: 9, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 2 }}>{tc('intel_pospulse.outOfStockLabel')}</div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#EF4444' }}>{lowStock.filter(i => i.qty === 0).length}</div>
                  </div>
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {lowStock.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: 6, background: URGENCY_COLOR[item.urgency], flexShrink: 0 }} />
                    <span style={{ fontSize: 9, color: 'var(--tx2)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</span>
                    <span style={{ fontSize: 9, fontWeight: 700, color: URGENCY_COLOR[item.urgency], flexShrink: 0 }}>{item.qty === 0 ? tc('intel_pospulse.outText') : tc('intel_pospulse.leftText', { n: item.qty })}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, paddingTop: 8, borderTop: '1px solid var(--b)' }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  {([['#EF4444', tc('intel_pospulse.legendCritical')], ['#F59E0B', tc('intel_pospulse.legendLow')], ['#6366F1', tc('intel_pospulse.legendWatch')]] as [string, string][]).map(([c, l]) => (
                    <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 9, color: 'var(--tx3)' }}>
                      <div style={{ width: 5, height: 5, borderRadius: 5, background: c }} />{l}
                    </div>
                  ))}
                </div>
                <button onClick={() => setExpanded(e => !e)}
                  style={{ fontSize: 9, color: '#6366F1', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>
                  {expanded ? tc('intel_pospulse.collapseBtn') : tc('intel_pospulse.reorderBtn')}
                </button>
              </div>
            </>
          ) : (
            <div style={{ fontSize: 11, color: 'var(--tx3)', padding: '8px 0' }}>{tc('intel_pospulse.allStockHealthy')}</div>
          )}
        </div>
      )}

      {/* ── Sales Drill Modal ── */}
      {salesDrill && hasSales && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
          onClick={() => { setSalesDrill(null); setKpiDrill(null); setPeriodDrill(null) }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'var(--sf)', borderRadius: 20, padding: '24px 28px', width: '100%', maxWidth: 700, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.18)' }}>
            {/* Modal header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <div style={{ fontFamily: 'var(--font-sora)', fontSize: 13, fontWeight: 700, color: 'var(--tx)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  {sectorInfo.emoji} {sectorInfo.label}
                </div>
                <div style={{ fontSize: 10, color: 'var(--tx3)', marginTop: 2 }}>
                  {tc('intel_pospulse.thisWeekLabel')}<strong style={{ color: '#6366F1' }}>{fmt(sales!.weekRevenue)}</strong> · {tc('intel_pospulse.txns', { n: sales!.weekTxns })}
                </div>
              </div>
              <button onClick={() => { setSalesDrill(null); setKpiDrill(null); setPeriodDrill(null) }} style={{ width: 28, height: 28, borderRadius: 8, border: '1px solid var(--b)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--tx3)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            {/* Clickable KPI cards */}
            {!kpiDrill && (
              <div style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(99,102,241,.06)', border: '1px solid rgba(99,102,241,.12)', marginBottom: 14, fontSize: 9, color: '#6366F1', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                {tc('intel_pospulse.clickMetricHint')}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 16 }}>
              {kpiCards.map(kpi => {
                const isDrilled = kpiDrill === kpi.id
                const STATUS_COLOR = { good: '#22C55E', warning: '#F59E0B', critical: '#EF4444' }
                const sc = STATUS_COLOR[kpi.status]
                return (
                  <div key={kpi.id} style={{ gridColumn: isDrilled ? '1 / -1' : undefined }}>
                    <div
                      onClick={() => setKpiDrill(isDrilled ? null : kpi.id)}
                      style={{
                        padding: '10px 12px', borderRadius: 10, cursor: 'pointer',
                        border: isDrilled ? `1px solid ${sc}30` : '1px solid var(--b)',
                        background: isDrilled ? `${sc}06` : 'var(--ev)',
                        transition: 'all 150ms',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ fontSize: 9, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 3, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span style={{ fontSize: 10 }}>{kpi.icon}</span> {kpi.label}
                        </div>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--tx3)" strokeWidth="2" strokeLinecap="round" style={{ transition: 'transform 200ms', transform: isDrilled ? 'rotate(90deg)' : 'rotate(0deg)', opacity: 0.5 }}><polyline points="9 18 15 12 9 6"/></svg>
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: kpi.color }}>{kpi.value}</div>
                    </div>

                    {/* Deep-dive panel */}
                    {isDrilled && (
                      <div style={{ marginTop: 6, padding: '14px', borderRadius: 10, border: `1px solid ${sc}20`, background: `${sc}04`, animation: 'fadeIn 200ms ease' }}>
                        {/* Status + Benchmark */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, padding: '8px 10px', borderRadius: 8, background: 'var(--ev)' }}>
                          <span style={{ width: 8, height: 8, borderRadius: '50%', background: sc, flexShrink: 0 }} />
                          <div>
                            <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em' }}>{tc('intel_pospulse.benchmarkLabel')}</div>
                            <div style={{ fontSize: 10, fontWeight: 600, color: sc }}>{kpi.benchmark}</div>
                          </div>
                        </div>

                        {/* ── KPI-specific chart ── */}
                        {kpi.id === 'dailyAvg' && sales!.dailyBreakdown.length > 0 && (() => {
                          const days = sales!.dailyBreakdown
                          const maxR = Math.max(...days.map(d => d.revenue), 1)
                          const avg = dailyAvg
                          const chartW = 400, chartH = 120, barGap = 8, barW = (chartW - barGap * (days.length + 1)) / days.length
                          const avgY = chartH - (avg / maxR) * (chartH - 20)
                          return (
                            <div style={{ marginBottom: 14, padding: '10px 12px', borderRadius: 10, background: 'var(--ev)' }}>
                              <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>{tc('intel_pospulse.chartDailyRevenue')}</div>
                              <svg width="100%" viewBox={`0 0 ${chartW} ${chartH + 20}`} style={{ overflow: 'visible' }}>
                                {/* Average line */}
                                <line x1="0" y1={avgY} x2={chartW} y2={avgY} stroke={sc} strokeWidth="1.5" strokeDasharray="6 3" opacity="0.6"/>
                                <text x={chartW - 2} y={avgY - 4} fill={sc} fontSize="9" textAnchor="end" fontWeight="600">avg {fmt(avg)}</text>
                                {/* Bars */}
                                {days.map((d, i) => {
                                  const barH = (d.revenue / maxR) * (chartH - 20)
                                  const x = barGap + i * (barW + barGap)
                                  const y = chartH - barH
                                  const isToday = i === days.length - 1
                                  return (
                                    <g key={d.date}>
                                      <rect x={x} y={y} width={barW} height={barH} rx="4" fill={isToday ? '#6366F1' : `${sc}40`}/>
                                      {d.revenue > 0 && <text x={x + barW / 2} y={y - 4} fill="var(--tx2)" fontSize="8" textAnchor="middle" fontWeight="600">{fmt(d.revenue)}</text>}
                                      <text x={x + barW / 2} y={chartH + 14} fill="var(--tx3)" fontSize="9" textAnchor="middle">{d.label}</text>
                                    </g>
                                  )
                                })}
                              </svg>
                            </div>
                          )
                        })()}

                        {kpi.id === 'todayVsAvg' && (() => {
                          const todayR = sales!.todayRevenue
                          const avgR = dailyAvg
                          const maxR = Math.max(todayR, avgR, 1)
                          const chartW = 200, chartH = 100, barW = 60
                          return (
                            <div style={{ marginBottom: 14, padding: '10px 12px', borderRadius: 10, background: 'var(--ev)' }}>
                              <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>{tc('intel_pospulse.chartTodayVsAvg')}</div>
                              <svg width="100%" viewBox={`0 0 ${chartW} ${chartH + 24}`} style={{ overflow: 'visible' }}>
                                {/* Today bar */}
                                {(() => { const h = (todayR / maxR) * chartH; return (
                                  <g>
                                    <rect x={25} y={chartH - h} width={barW} height={h} rx="6" fill={todayVsAvg >= 0 ? '#22C55E' : '#EF4444'}/>
                                    <text x={25 + barW / 2} y={chartH - h - 5} fill="var(--tx)" fontSize="10" textAnchor="middle" fontWeight="700">{fmt(todayR)}</text>
                                    <text x={25 + barW / 2} y={chartH + 14} fill="var(--tx3)" fontSize="10" textAnchor="middle" fontWeight="600">{tc('intel_pospulse.chartTodayLabel')}</text>
                                  </g>
                                )})()}
                                {/* Avg bar */}
                                {(() => { const h = (avgR / maxR) * chartH; return (
                                  <g>
                                    <rect x={115} y={chartH - h} width={barW} height={h} rx="6" fill="#6366F140"/>
                                    <text x={115 + barW / 2} y={chartH - h - 5} fill="var(--tx2)" fontSize="10" textAnchor="middle" fontWeight="700">{fmt(avgR)}</text>
                                    <text x={115 + barW / 2} y={chartH + 14} fill="var(--tx3)" fontSize="10" textAnchor="middle" fontWeight="600">{tc('intel_pospulse.chartAverageLabel')}</text>
                                  </g>
                                )})()}
                              </svg>
                            </div>
                          )
                        })()}

                        {kpi.id === 'grossMargin' && (() => {
                          const rev = sales!.weekRevenue
                          const cogs = sales!.weekCost
                          const profit = rev - cogs
                          const maxR = Math.max(rev, 1)
                          const chartW = 280, chartH = 100, barW = 55
                          return (
                            <div style={{ marginBottom: 14, padding: '10px 12px', borderRadius: 10, background: 'var(--ev)' }}>
                              <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>{tc('intel_pospulse.chartRevVsCogs')}</div>
                              <svg width="100%" viewBox={`0 0 ${chartW} ${chartH + 24}`} style={{ overflow: 'visible' }}>
                                {/* Revenue bar */}
                                {(() => { const h = (rev / maxR) * chartH; return (
                                  <g>
                                    <rect x={30} y={chartH - h} width={barW} height={h} rx="6" fill="#22C55E"/>
                                    <text x={30 + barW / 2} y={chartH - h - 5} fill="#22C55E" fontSize="9" textAnchor="middle" fontWeight="700">{fmt(rev)}</text>
                                    <text x={30 + barW / 2} y={chartH + 14} fill="var(--tx3)" fontSize="9" textAnchor="middle" fontWeight="600">{tc('intel_pospulse.chartRevenueLabel')}</text>
                                  </g>
                                )})()}
                                {/* COGS bar */}
                                {(() => { const h = (cogs / maxR) * chartH; return (
                                  <g>
                                    <rect x={110} y={chartH - h} width={barW} height={h} rx="6" fill="#EF4444"/>
                                    <text x={110 + barW / 2} y={chartH - h - 5} fill="#EF4444" fontSize="9" textAnchor="middle" fontWeight="700">{fmt(cogs)}</text>
                                    <text x={110 + barW / 2} y={chartH + 14} fill="var(--tx3)" fontSize="9" textAnchor="middle" fontWeight="600">{tc('intel_pospulse.chartCogsLabel')}</text>
                                  </g>
                                )})()}
                                {/* Profit bar */}
                                {(() => { const h = (profit / maxR) * chartH; return (
                                  <g>
                                    <rect x={190} y={chartH - h} width={barW} height={Math.max(h, 2)} rx="6" fill={sc}/>
                                    <text x={190 + barW / 2} y={Math.max(chartH - h - 5, 10)} fill={sc} fontSize="9" textAnchor="middle" fontWeight="700">{fmt(profit)}</text>
                                    <text x={190 + barW / 2} y={chartH + 14} fill="var(--tx3)" fontSize="9" textAnchor="middle" fontWeight="600">{tc('intel_pospulse.chartProfitLabel')}</text>
                                  </g>
                                )})()}
                                {/* Margin line */}
                                <line x1={190} y1={chartH - (profit / maxR) * chartH} x2={248} y2={chartH - (profit / maxR) * chartH} stroke={sc} strokeWidth="1" strokeDasharray="4 2" opacity="0.5"/>
                              </svg>
                            </div>
                          )
                        })()}

                        {kpi.id === 'avgBasket' && sales!.dailyBreakdown.length > 0 && (() => {
                          const days = sales!.dailyBreakdown
                          const maxB = Math.max(...days.map(d => d.avgBasket), 1)
                          const chartW = 400, chartH = 90
                          const points = days.map((d, i) => {
                            const x = 20 + (i / Math.max(days.length - 1, 1)) * (chartW - 40)
                            const y = chartH - 10 - (d.avgBasket / maxB) * (chartH - 30)
                            return { x, y, d }
                          })
                          const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
                          const areaPath = linePath + ` L${points[points.length - 1].x},${chartH - 10} L${points[0].x},${chartH - 10} Z`
                          return (
                            <div style={{ marginBottom: 14, padding: '10px 12px', borderRadius: 10, background: 'var(--ev)' }}>
                              <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>{tc('intel_pospulse.chartAvgBasket')}</div>
                              <svg width="100%" viewBox={`0 0 ${chartW} ${chartH + 16}`} style={{ overflow: 'visible' }}>
                                <defs><linearGradient id="basketGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6366F1" stopOpacity="0.2"/><stop offset="100%" stopColor="#6366F1" stopOpacity="0"/></linearGradient></defs>
                                <path d={areaPath} fill="url(#basketGrad)"/>
                                <path d={linePath} fill="none" stroke="#6366F1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                {points.map((p, i) => (
                                  <g key={i}>
                                    <circle cx={p.x} cy={p.y} r="4" fill="#fff" stroke="#6366F1" strokeWidth="2"/>
                                    <text x={p.x} y={p.y - 8} fill="var(--tx2)" fontSize="8" textAnchor="middle" fontWeight="600">{fmt(p.d.avgBasket)}</text>
                                    <text x={p.x} y={chartH + 8} fill="var(--tx3)" fontSize="9" textAnchor="middle">{p.d.label}</text>
                                  </g>
                                ))}
                              </svg>
                            </div>
                          )
                        })()}

                        {kpi.id === 'netSales' && (() => {
                          const gross = sales!.todayRevenue
                          const ref = sales!.todayRefunds
                          const disc = sales!.todayDiscounts
                          const net = todayNetSales
                          const steps = [
                            { label: tc('intel_pospulse.chartGrossLabel'), value: gross, color: '#22C55E', cum: gross },
                            { label: tc('intel_pospulse.chartRefundsLabel'), value: -ref, color: '#EF4444', cum: gross - ref },
                            { label: tc('intel_pospulse.chartDiscountsLabel'), value: -disc, color: '#F59E0B', cum: gross - ref - disc },
                            { label: tc('intel_pospulse.chartNetLabel'), value: net, color: '#6366F1', cum: net },
                          ]
                          const maxV = Math.max(gross, 1)
                          const chartW = 320, chartH = 110, barW = 50, gap = 25
                          return (
                            <div style={{ marginBottom: 14, padding: '10px 12px', borderRadius: 10, background: 'var(--ev)' }}>
                              <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>{tc('intel_pospulse.chartNetWaterfall')}</div>
                              <svg width="100%" viewBox={`0 0 ${chartW} ${chartH + 24}`} style={{ overflow: 'visible' }}>
                                {steps.map((s, i) => {
                                  const x = 15 + i * (barW + gap)
                                  if (i === 0 || i === 3) {
                                    const h = (Math.abs(s.value) / maxV) * (chartH - 10)
                                    return (
                                      <g key={s.label}>
                                        <rect x={x} y={chartH - h} width={barW} height={h} rx="5" fill={s.color}/>
                                        <text x={x + barW / 2} y={chartH - h - 5} fill={s.color} fontSize="9" textAnchor="middle" fontWeight="700">{fmt(Math.abs(s.value))}</text>
                                        <text x={x + barW / 2} y={chartH + 14} fill="var(--tx3)" fontSize="9" textAnchor="middle" fontWeight="600">{s.label}</text>
                                      </g>
                                    )
                                  } else {
                                    const prevCum = steps[i - 1].cum
                                    const topY = chartH - (prevCum / maxV) * (chartH - 10)
                                    const h = (Math.abs(s.value) / maxV) * (chartH - 10)
                                    return (
                                      <g key={s.label}>
                                        <rect x={x} y={topY} width={barW} height={Math.max(h, 2)} rx="5" fill={s.color} opacity="0.7"/>
                                        {Math.abs(s.value) > 0 && <text x={x + barW / 2} y={topY - 5} fill={s.color} fontSize="9" textAnchor="middle" fontWeight="700">-{fmt(Math.abs(s.value))}</text>}
                                        <text x={x + barW / 2} y={chartH + 14} fill="var(--tx3)" fontSize="9" textAnchor="middle" fontWeight="600">{s.label}</text>
                                        {/* Connector line */}
                                        {i < 3 && <line x1={x + barW} y1={topY + h} x2={x + barW + gap} y2={topY + h} stroke="var(--tx3)" strokeWidth="1" strokeDasharray="3 2" opacity="0.3"/>}
                                      </g>
                                    )
                                  }
                                })}
                                {/* Connector from Gross to Refunds */}
                                <line x1={15 + barW} y1={chartH - (gross / maxV) * (chartH - 10)} x2={15 + barW + gap} y2={chartH - (gross / maxV) * (chartH - 10)} stroke="var(--tx3)" strokeWidth="1" strokeDasharray="3 2" opacity="0.3"/>
                              </svg>
                            </div>
                          )
                        })()}

                        {kpi.id === 'peakHour' && (() => {
                          const hours = Object.entries(sales!.hourlyData).map(([h, d]) => ({ hour: Number(h), ...d })).sort((a, b) => a.hour - b.hour)
                          if (hours.length === 0) return null
                          const maxR = Math.max(...hours.map(h => h.revenue), 1)
                          const chartW = 400, chartH = 100
                          const barW = Math.min((chartW - 10) / hours.length - 3, 28)
                          const gap = 3
                          return (
                            <div style={{ marginBottom: 14, padding: '10px 12px', borderRadius: 10, background: 'var(--ev)' }}>
                              <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>{tc('intel_pospulse.chartHourlySalesToday')}</div>
                              <svg width="100%" viewBox={`0 0 ${chartW} ${chartH + 18}`} style={{ overflow: 'visible' }}>
                                {hours.map((h, i) => {
                                  const barH = (h.revenue / maxR) * (chartH - 10)
                                  const x = 5 + i * (barW + gap)
                                  const isPeak = `${h.hour}:00–${h.hour + 1}:00` === sales!.topHour
                                  return (
                                    <g key={h.hour}>
                                      <rect x={x} y={chartH - barH} width={barW} height={barH} rx="3" fill={isPeak ? '#F59E0B' : '#6366F140'}/>
                                      {isPeak && <text x={x + barW / 2} y={chartH - barH - 5} fill="#F59E0B" fontSize="8" textAnchor="middle" fontWeight="700">⭐ {fmt(h.revenue)}</text>}
                                      <text x={x + barW / 2} y={chartH + 12} fill="var(--tx3)" fontSize="7" textAnchor="middle">{h.hour}:00</text>
                                    </g>
                                  )
                                })}
                              </svg>
                            </div>
                          )
                        })()}

                        {/* Score visual */}
                        <div style={{ display: 'flex', gap: 3, marginBottom: 12 }}>
                          {Array.from({ length: 10 }).map((_, bi) => {
                            const filled = kpi.status === 'good' ? bi < 8 : kpi.status === 'warning' ? bi < 5 : bi < 3
                            return (
                              <div key={bi} style={{ flex: 1, height: 8, borderRadius: 2, background: filled ? sc : 'var(--ev)', opacity: filled ? (0.5 + (bi / 10) * 0.5) : 0.3, transition: 'all 300ms ease' }} />
                            )
                          })}
                        </div>

                        {/* Analysis tips */}
                        <div style={{ marginBottom: 12 }}>
                          <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>{tc('intel_pospulse.analysisLabel')}</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {kpi.tips.map((tip, ti) => (
                              <div key={ti} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 10, color: 'var(--tx2)', lineHeight: 1.5 }}>
                                <span style={{ width: 5, height: 5, borderRadius: '50%', background: sc, flexShrink: 0, marginTop: 6 }} />
                                {tip}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Recommended action */}
                        <div style={{ padding: '10px 12px', borderRadius: 8, background: `${sc}10`, border: `1px dashed ${sc}30`, marginBottom: 12 }}>
                          <div style={{ fontSize: 9, fontWeight: 700, color: sc, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 4 }}>{tc('intel_pospulse.recommendedAction')}</div>
                          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--tx)', lineHeight: 1.4 }}>{kpi.action}</div>
                        </div>

                        {/* Ask AI */}
                        <button
                          onClick={(e) => { e.stopPropagation(); onAsk(kpi.askPrompt) }}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: `1px solid ${sc}30`, background: `${sc}08`, color: sc, fontSize: 10, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                          {tc('intel_pospulse.askAiDeeper', { label: kpi.label.toLowerCase() })}
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Projected EOD banner */}
            {projectedToday > 0 && nowHour < 20 && nowHour >= 8 && (
              <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(99,102,241,.05)', border: '1px solid rgba(99,102,241,.1)', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 9, color: '#6366F1', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 700 }}>{tc('intel_pospulse.projectedEod')}</div>
                  <div style={{ fontSize: 9, color: 'var(--tx3)', marginTop: 2 }}>{tc('intel_pospulse.atCurrentPace')}</div>
                </div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#6366F1' }}>{fmt(projectedToday)}</div>
              </div>
            )}

            {/* Drill section tabs */}
            <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
              {DRILL_SECTIONS.map(s => (
                <button key={s.id}
                  onClick={() => { setSalesDrill(s.id); setKpiDrill(null); setPeriodDrill(null) }}
                  style={{
                    flex: 1, padding: '8px 10px', borderRadius: 10,
                    border: salesDrill === s.id ? '1px solid #6366F130' : '1px solid var(--b)',
                    background: salesDrill === s.id ? 'rgba(99,102,241,.06)' : 'var(--sf)',
                    color: salesDrill === s.id ? '#6366F1' : 'var(--tx3)',
                    fontSize: 9, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                    transition: 'all 150ms', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                  }}
                >
                  <span>{s.icon}</span>{s.label}
                </button>
              ))}
            </div>

            {/* ── Time Analysis ── */}
            {salesDrill === 'time' && (
              <div style={{ animation: 'fadeIn 200ms ease' }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--tx)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10 }}>{tc('intel_pospulse.todayHourlySales')}</div>
                <div style={{ display: 'flex', gap: 3, marginBottom: 16 }}>
                  {Array.from({ length: 14 }).map((_, i) => {
                    const hour = i + 7
                    const data = sales!.hourlyData[hour]
                    const rev = data?.revenue || 0
                    const maxHourRev = Math.max(...Object.values(sales!.hourlyData).map(d => d.revenue), 1)
                    const intensity = rev / maxHourRev
                    return (
                      <div key={hour} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                        <div style={{
                          width: '100%', height: 48, borderRadius: 4,
                          background: intensity > 0 ? `rgba(99,102,241,${0.15 + intensity * 0.7})` : 'var(--ev)',
                          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2,
                        }}>
                          {rev > 0 && (
                            <>
                              <span style={{ fontSize: 9, fontWeight: 700, color: intensity > 0.5 ? '#fff' : '#6366F1' }}>{data?.count}</span>
                              <span style={{ fontSize: 7, color: intensity > 0.5 ? 'rgba(255,255,255,.7)' : 'var(--tx3)' }}>{fmt(rev)}</span>
                            </>
                          )}
                        </div>
                        <span style={{ fontSize: 9, color: 'var(--tx3)' }}>{hour}:00</span>
                      </div>
                    )
                  })}
                </div>

                {/* Yesterday comparison — clickable */}
                <div
                  onClick={() => setPeriodDrill(periodDrill === 'yesterday' ? null : 'yesterday')}
                  style={{ padding: '12px 14px', borderRadius: 10, background: 'var(--ev)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: periodDrill === 'yesterday' ? 0 : 12, cursor: 'pointer', border: periodDrill === 'yesterday' ? '1px solid #6366F130' : '1px solid transparent', transition: 'all 150ms' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div>
                      <div style={{ fontSize: 9, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 2 }}>{tc('intel_pospulse.yesterdayLabel')}</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)' }}>{fmt(sales!.yesterdayRevenue)} <span style={{ fontSize: 9, color: 'var(--tx3)', fontWeight: 400 }}>({tc('intel_pospulse.txns', { n: sales!.yesterdayTxns })})</span></div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {sales!.yesterdayRevenue > 0 && (
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 8,
                        color: sales!.todayRevenue >= sales!.yesterdayRevenue ? '#22C55E' : '#EF4444',
                        background: sales!.todayRevenue >= sales!.yesterdayRevenue ? 'rgba(34,197,94,.1)' : 'rgba(239,68,68,.1)',
                      }}>
                        {sales!.todayRevenue >= sales!.yesterdayRevenue ? '↑' : '↓'}
                        {Math.abs(((sales!.todayRevenue - sales!.yesterdayRevenue) / sales!.yesterdayRevenue) * 100).toFixed(0)}{tc('intel_pospulse.vsYesterday')}
                      </span>
                    )}
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--tx3)" strokeWidth="2" strokeLinecap="round" style={{ transition: 'transform 200ms', transform: periodDrill === 'yesterday' ? 'rotate(90deg)' : 'rotate(0deg)', opacity: 0.5 }}><polyline points="9 18 15 12 9 6"/></svg>
                  </div>
                </div>

                {/* Yesterday hourly comparison chart */}
                {periodDrill === 'yesterday' && (() => {
                  const todayH = sales!.hourlyData
                  const yestH = sales!.yesterdayHourly
                  const allHours = Array.from(new Set([...Object.keys(todayH), ...Object.keys(yestH)].map(Number))).sort((a, b) => a - b)
                  const startH = Math.min(...allHours, 7)
                  const endH = Math.max(...allHours, 20)
                  const hours: number[] = []
                  for (let h = startH; h <= endH; h++) hours.push(h)
                  const maxR = Math.max(...hours.map(h => Math.max(todayH[h]?.revenue || 0, yestH[h]?.revenue || 0)), 1)
                  const chartW = 420, chartH = 100, barW = Math.min((chartW - 20) / hours.length / 2 - 1, 12), gap = 2
                  return (
                    <div style={{ padding: '14px', borderRadius: '0 0 10px 10px', border: '1px solid #6366F115', borderTop: 'none', background: 'rgba(99,102,241,.02)', marginBottom: 12, animation: 'fadeIn 200ms ease' }}>
                      <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>{tc('intel_pospulse.chartTodayVsYestHourly')}</div>
                      <svg width="100%" viewBox={`0 0 ${chartW} ${chartH + 24}`} style={{ overflow: 'visible' }}>
                        {hours.map((h, i) => {
                          const x = 5 + i * (barW * 2 + gap * 3)
                          const tRev = todayH[h]?.revenue || 0
                          const yRev = yestH[h]?.revenue || 0
                          const tH = (tRev / maxR) * (chartH - 10)
                          const yH = (yRev / maxR) * (chartH - 10)
                          return (
                            <g key={h}>
                              <rect x={x} y={chartH - yH} width={barW} height={yH} rx="2" fill="#6366F130" />
                              <rect x={x + barW + gap} y={chartH - tH} width={barW} height={tH} rx="2" fill="#6366F1" />
                              <text x={x + barW + gap / 2} y={chartH + 12} fill="var(--tx3)" fontSize="7" textAnchor="middle">{h}:00</text>
                            </g>
                          )
                        })}
                        {/* Legend */}
                        <rect x={chartW - 100} y={-2} width="8" height="8" rx="2" fill="#6366F130"/>
                        <text x={chartW - 88} y={6} fill="var(--tx3)" fontSize="8">{tc('intel_pospulse.chartYesterdayLegend')}</text>
                        <rect x={chartW - 45} y={-2} width="8" height="8" rx="2" fill="#6366F1"/>
                        <text x={chartW - 33} y={6} fill="var(--tx3)" fontSize="8">{tc('intel_pospulse.chartTodayLegend')}</text>
                      </svg>
                      <div style={{ display: 'flex', gap: 12, marginTop: 10, fontSize: 9, color: 'var(--tx2)' }}>
                        <span>{tc('intel_pospulse.yesterdayTotal')}<strong>{fmt(sales!.yesterdayRevenue)}</strong></span>
                        <span>{tc('intel_pospulse.todaySoFar')}<strong>{fmt(sales!.todayRevenue)}</strong></span>
                        <span style={{ color: sales!.todayRevenue >= sales!.yesterdayRevenue ? '#22C55E' : '#EF4444', fontWeight: 700 }}>
                          {sales!.todayRevenue >= sales!.yesterdayRevenue ? '↑' : '↓'}{sales!.yesterdayRevenue > 0 ? Math.abs(((sales!.todayRevenue - sales!.yesterdayRevenue) / sales!.yesterdayRevenue) * 100).toFixed(0) : 0}%
                        </span>
                      </div>
                    </div>
                  )
                })()}

                {/* Week over week — clickable */}
                {(weekVsPrev !== 0 || sales!.prevWeekRevenue > 0) && (
                  <div>
                    <div
                      onClick={() => setPeriodDrill(periodDrill === 'prevWeek' ? null : 'prevWeek')}
                      style={{ padding: '12px 14px', borderRadius: periodDrill === 'prevWeek' ? '10px 10px 0 0' : 10, border: periodDrill === 'prevWeek' ? '1px solid #6366F130' : '1px dashed var(--b)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', transition: 'all 150ms' }}
                    >
                      <div>
                        <div style={{ fontSize: 9, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 2 }}>{tc('intel_pospulse.prevWeekLabel')}</div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)' }}>{fmt(sales!.prevWeekRevenue)} <span style={{ fontSize: 9, color: 'var(--tx3)', fontWeight: 400 }}>({tc('intel_pospulse.txns', { n: sales!.prevWeekTxns })})</span></div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {weekVsPrev !== 0 && (
                          <span style={{
                            fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 8,
                            color: weekVsPrev > 0 ? '#22C55E' : '#EF4444',
                            background: weekVsPrev > 0 ? 'rgba(34,197,94,.1)' : 'rgba(239,68,68,.1)',
                          }}>
                            {weekVsPrev > 0 ? '↑' : '↓'}{Math.abs(weekVsPrev).toFixed(0)}{tc('intel_pospulse.weekOverWeek')}
                          </span>
                        )}
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--tx3)" strokeWidth="2" strokeLinecap="round" style={{ transition: 'transform 200ms', transform: periodDrill === 'prevWeek' ? 'rotate(90deg)' : 'rotate(0deg)', opacity: 0.5 }}><polyline points="9 18 15 12 9 6"/></svg>
                      </div>
                    </div>

                    {/* Week comparison chart */}
                    {periodDrill === 'prevWeek' && (() => {
                      const thisWeekDays = sales!.dailyBreakdown
                      const maxR = Math.max(...thisWeekDays.map(d => d.revenue), 1)
                      const prevAvg = sales!.prevWeekTxns > 0 ? sales!.prevWeekRevenue / 7 : 0
                      const chartW = 400, chartH = 110
                      const barW = (chartW - 60) / thisWeekDays.length - 6
                      const prevAvgY = chartH - 10 - (prevAvg / maxR) * (chartH - 30)
                      return (
                        <div style={{ padding: '14px', borderRadius: '0 0 10px 10px', border: '1px solid #6366F115', borderTop: 'none', background: 'rgba(99,102,241,.02)', animation: 'fadeIn 200ms ease' }}>
                          <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>{tc('intel_pospulse.chartThisWeekVsPrev')}</div>
                          <svg width="100%" viewBox={`0 0 ${chartW} ${chartH + 20}`} style={{ overflow: 'visible' }}>
                            {/* Prev week avg line */}
                            {prevAvg > 0 && (
                              <>
                                <line x1="10" y1={prevAvgY} x2={chartW - 10} y2={prevAvgY} stroke="#EF4444" strokeWidth="1.5" strokeDasharray="6 3" opacity="0.5"/>
                                <text x={chartW - 8} y={prevAvgY - 4} fill="#EF4444" fontSize="8" textAnchor="end" fontWeight="600">prev avg {fmt(prevAvg)}</text>
                              </>
                            )}
                            {thisWeekDays.map((d, i) => {
                              const barH = (d.revenue / maxR) * (chartH - 30)
                              const x = 20 + i * (barW + 6)
                              const y = chartH - 10 - barH
                              const aboveAvg = d.revenue >= prevAvg
                              return (
                                <g key={d.date}>
                                  <rect x={x} y={y} width={barW} height={barH} rx="4" fill={aboveAvg ? '#22C55E' : '#EF4444'} opacity={i === thisWeekDays.length - 1 ? 1 : 0.6}/>
                                  {d.revenue > 0 && <text x={x + barW / 2} y={y - 5} fill="var(--tx2)" fontSize="8" textAnchor="middle" fontWeight="600">{fmt(d.revenue)}</text>}
                                  <text x={x + barW / 2} y={chartH + 10} fill="var(--tx3)" fontSize="9" textAnchor="middle">{d.label}</text>
                                </g>
                              )
                            })}
                          </svg>
                          <div style={{ display: 'flex', gap: 12, marginTop: 10, fontSize: 9, color: 'var(--tx2)' }}>
                            <span>{tc('intel_pospulse.thisWeekLabel')}<strong>{fmt(sales!.weekRevenue)}</strong></span>
                            <span>{tc('intel_pospulse.prevWeekLabelShort')}<strong>{fmt(sales!.prevWeekRevenue)}</strong></span>
                            <span style={{ color: weekVsPrev > 0 ? '#22C55E' : '#EF4444', fontWeight: 700 }}>
                              {weekVsPrev > 0 ? '↑' : '↓'}{Math.abs(weekVsPrev).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                )}
              </div>
            )}

            {/* ── Category & Mix ── */}
            {salesDrill === 'categories' && (
              <div style={{ animation: 'fadeIn 200ms ease' }}>
                {/* Category revenue bars */}
                {Object.keys(sales!.categoryBreakdown).length > 0 ? (
                  <>
                    <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--tx)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10 }}>{tc('intel_pospulse.categoryContribution')}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                      {(() => {
                        const cats = Object.entries(sales!.categoryBreakdown).sort((a, b) => b[1].revenue - a[1].revenue)
                        const CAT_COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#22C55E', '#06B6D4', '#EF4444', '#84CC16']
                        const maxRev = cats[0]?.[1]?.revenue || 1
                        return cats.map(([cat, d], i) => {
                          const pct = sales!.weekRevenue > 0 ? (d.revenue / sales!.weekRevenue * 100) : 0
                          const barPct = d.revenue / maxRev
                          const c = CAT_COLORS[i % CAT_COLORS.length]
                          return (
                            <div key={cat}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                  <div style={{ width: 10, height: 10, borderRadius: 3, background: c, flexShrink: 0 }} />
                                  <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--tx)', textTransform: 'capitalize' }}>{cat}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                  <span style={{ fontSize: 9, color: 'var(--tx3)' }}>{tc('intel_pospulse.itemsCount', { n: d.count })}</span>
                                  <span style={{ fontSize: 10, fontWeight: 700, color: c }}>{pct.toFixed(1)}%</span>
                                  <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--tx)' }}>{fmt(d.revenue)}</span>
                                </div>
                              </div>
                              <div style={{ height: 8, background: 'var(--ev)', borderRadius: 4, overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${barPct * 100}%`, background: `linear-gradient(90deg, ${c}, ${c}88)`, borderRadius: 4, transition: 'width 400ms ease' }} />
                              </div>
                            </div>
                          )
                        })
                      })()}
                    </div>

                    {/* Concentration risk */}
                    {(() => {
                      const cats = Object.entries(sales!.categoryBreakdown).sort((a, b) => b[1].revenue - a[1].revenue)
                      const topPct = sales!.weekRevenue > 0 ? ((cats[0]?.[1]?.revenue || 0) / sales!.weekRevenue * 100) : 0
                      const risk = topPct >= 70 ? 'high' : topPct >= 50 ? 'moderate' : 'low'
                      const riskColor = risk === 'high' ? '#EF4444' : risk === 'moderate' ? '#F59E0B' : '#22C55E'
                      return (
                        <div style={{ padding: '12px 14px', borderRadius: 10, border: `1px solid ${riskColor}20`, background: `${riskColor}06` }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                            <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em' }}>{tc('intel_pospulse.concentrationRisk')}</span>
                            <span style={{ fontSize: 9, fontWeight: 700, color: riskColor, background: `${riskColor}15`, borderRadius: 6, padding: '2px 8px', textTransform: 'capitalize' }}>{risk}</span>
                          </div>
                          <div style={{ fontSize: 10, color: 'var(--tx2)', lineHeight: 1.5 }}>
                            {risk === 'high' && tc('intel_pospulse.concentrationHigh', { pct: topPct.toFixed(0) })}
                            {risk === 'moderate' && tc('intel_pospulse.concentrationModerate', { pct: topPct.toFixed(0) })}
                            {risk === 'low' && tc('intel_pospulse.concentrationLow', { pct: topPct.toFixed(0) })}
                          </div>
                        </div>
                      )
                    })()}
                  </>
                ) : (
                  <div style={{ padding: '24px 16px', borderRadius: 10, background: 'var(--ev)', textAlign: 'center' }}>
                    <div style={{ fontSize: 18, marginBottom: 6 }}>🏷️</div>
                    <div style={{ fontSize: 10, color: 'var(--tx3)' }}>{tc('intel_pospulse.noCategoryData')}</div>
                  </div>
                )}
              </div>
            )}

            {/* ── Payments & Staff ── */}
            {salesDrill === 'payments' && (
              <div style={{ animation: 'fadeIn 200ms ease' }}>
                {/* Payment methods */}
                {Object.keys(sales!.paymentBreakdown).length > 0 && (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--tx)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10 }}>{tc('intel_pospulse.paymentMethods')}</div>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                      {Object.entries(sales!.paymentBreakdown).sort((a, b) => b[1] - a[1]).map(([type, count]) => {
                        const pct = sales!.weekTxns > 0 ? (count / sales!.weekTxns * 100) : 0
                        return (
                          <div key={type} style={{ flex: 1, padding: '12px 10px', borderRadius: 10, background: 'var(--ev)', textAlign: 'center' }}>
                            <div style={{ fontSize: 18, fontWeight: 800, color: '#6366F1' }}>{count}</div>
                            <div style={{ fontSize: 9, textTransform: 'capitalize', color: 'var(--tx)', fontWeight: 600, marginTop: 2 }}>{type}</div>
                            <div style={{ fontSize: 9, color: 'var(--tx3)', marginTop: 2 }}>{tc('intel_pospulse.pctOfTransactions', { pct: pct.toFixed(0) })}</div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Staff leaderboard */}
                {sales!.staffSales.length > 0 && sales!.staffSales[0].name !== 'Unknown' && (
                  <div>
                    <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--tx)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10 }}>{tc('intel_pospulse.staffPerformance')}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {sales!.staffSales.map((s, i) => {
                        const barPct = sales!.staffSales[0].revenue > 0 ? (s.revenue / sales!.staffSales[0].revenue) : 0
                        return (
                          <div key={i} style={{ padding: '10px 12px', borderRadius: 10, border: i === 0 ? '1px solid #6366F120' : '1px solid var(--b)', background: i === 0 ? 'rgba(99,102,241,.04)' : 'var(--sf)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                              <span style={{ fontSize: 12, fontWeight: 800, color: i === 0 ? '#6366F1' : 'var(--tx3)', width: 20, textAlign: 'center' }}>
                                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`}
                              </span>
                              <span style={{ flex: 1, fontSize: 11, fontWeight: 600, color: 'var(--tx)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</span>
                              <span style={{ fontSize: 9, color: 'var(--tx3)' }}>{tc('intel_pospulse.txns', { n: s.txns })}</span>
                              <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--tx)' }}>{fmt(s.revenue)}</span>
                            </div>
                            <div style={{ height: 6, background: 'var(--ev)', borderRadius: 3, overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${barPct * 100}%`, background: i === 0 ? '#6366F1' : '#6366F166', borderRadius: 3, transition: 'width 400ms ease' }} />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Ask AI footer */}
            <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--b)' }}>
              <button
                onClick={() => {
                  const prompts: Record<string, string> = {
                    time: tc('intel_pospulse.askPromptTime'),
                    categories: tc('intel_pospulse.askPromptCategories'),
                    payments: tc('intel_pospulse.askPromptPayments'),
                  }
                  onAsk(prompts[salesDrill!] || tc('intel_pospulse.askPromptDefault'))
                }}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #6366F130', background: 'rgba(99,102,241,.06)', color: '#6366F1', fontSize: 10, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                {tc('intel_pospulse.askAiFooter')}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  )
}
