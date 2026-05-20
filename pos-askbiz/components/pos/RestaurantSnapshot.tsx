'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const ACC = '#d08a59'
const API = process.env.NEXT_PUBLIC_API_URL || ''

interface Snapshot {
  revenue_today: number
  covers_today: number
  avg_check: number
  food_cost_pct: number
  labor_cost_pct: number
  prime_cost_pct: number
  active_tables: number
  clocked_in: number
  pending_online: number
  eighty_sixed_count: number
  top_item: string | null
}

function KpiChip({ label, value, color, sub }: { label: string; value: string; color: string; sub?: string }) {
  return (
    <div style={{ background: 'var(--sf)', border: '1px solid var(--b)', borderRadius: 10, padding: '12px 14px', minWidth: 0 }}>
      <div style={{ fontSize: 10, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--tx3)', marginTop: 2 }}>{sub}</div>}
    </div>
  )
}

function pctColor(pct: number, warnAt: number, badAt: number): string {
  if (pct >= badAt) return '#ef4444'
  if (pct >= warnAt) return '#f59e0b'
  return '#22c55e'
}

export default function RestaurantSnapshot({ currencySymbol }: { currencySymbol: string }) {
  const router = useRouter()
  const [snap, setSnap] = useState<Snapshot | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [analyticsRes, laborRes, ordersRes, tablesRes, onlineRes, eightyRes] = await Promise.all([
          fetch(`${API}/api/pos/restaurant/analytics?days=1`),
          fetch(`${API}/api/pos/restaurant/labor`),
          fetch(`${API}/api/pos/restaurant/orders?status=open`),
          fetch(`${API}/api/pos/restaurant/tables`),
          fetch(`${API}/api/pos/restaurant/online-orders?status=pending`),
          fetch(`${API}/api/pos/restaurant/eighty-six`),
        ])

        const [analytics, labor, orders, tables, online, eighty] = await Promise.all([
          analyticsRes.json(), laborRes.json(), ordersRes.json(),
          tablesRes.json(), onlineRes.json(), eightyRes.json(),
        ])

        const topItem = analytics?.top_items?.[0]?.name || null
        const activeShifts = (labor?.shifts || []).filter((s: any) => s.status === 'active')
        const activeTables = (tables?.tables || []).filter((t: any) => t.status === 'occupied').length
        const pendingOnline = (online?.orders || []).length
        const eightyCount = (eighty?.items || []).length

        const foodCostPct  = analytics?.food_cost_pct  ?? 0
        const laborCostPct = analytics?.labor_cost_pct ?? 0
        const primeCostPct = analytics?.prime_cost_pct ?? 0
        const revToday     = analytics?.total_revenue   ?? 0
        const coversToday  = analytics?.covers_today    ?? analytics?.total_covers ?? 0
        const avgCheck     = coversToday > 0 ? revToday / coversToday : 0

        setSnap({
          revenue_today:   revToday,
          covers_today:    coversToday,
          avg_check:       avgCheck,
          food_cost_pct:   foodCostPct,
          labor_cost_pct:  laborCostPct,
          prime_cost_pct:  primeCostPct,
          active_tables:   activeTables,
          clocked_in:      activeShifts.length,
          pending_online:  pendingOnline,
          eighty_sixed_count: eightyCount,
          top_item:        topItem,
        })
      } catch {
        // silently fail — snapshot is non-critical
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10 }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} style={{ background: 'var(--sf)', border: '1px solid var(--b)', borderRadius: 10, padding: '12px 14px', height: 68, animation: 'pulse 1.5s infinite ease-in-out' }} />
        ))}
      </div>
    )
  }

  if (!snap) return null

  const alerts: string[] = []
  if (snap.pending_online > 0) alerts.push(`${snap.pending_online} online order${snap.pending_online > 1 ? 's' : ''} pending`)
  if (snap.eighty_sixed_count > 0) alerts.push(`${snap.eighty_sixed_count} item${snap.eighty_sixed_count > 1 ? 's' : ''} 86'd`)
  if (snap.prime_cost_pct > 65) alerts.push(`Prime cost ${snap.prime_cost_pct.toFixed(0)}% — over target`)

  return (
    <div>
      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Today's Snapshot</div>

      {alerts.length > 0 && (
        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 8, padding: '8px 12px', marginBottom: 12, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {alerts.map(a => (
            <span key={a} style={{ fontSize: 12, color: '#ef4444', fontWeight: 600 }}>⚠ {a}</span>
          ))}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10 }}>
        <KpiChip label="Revenue" value={`${currencySymbol}${snap.revenue_today.toFixed(0)}`} color={ACC} sub="today" />
        <KpiChip label="Covers" value={String(snap.covers_today)} color="#f1f5f9" sub={snap.avg_check > 0 ? `${currencySymbol}${snap.avg_check.toFixed(2)} avg` : undefined} />
        <KpiChip label="Food Cost" value={snap.food_cost_pct > 0 ? `${snap.food_cost_pct.toFixed(1)}%` : '—'} color={pctColor(snap.food_cost_pct, 35, 42)} sub="target <35%" />
        <KpiChip label="Labour" value={snap.labor_cost_pct > 0 ? `${snap.labor_cost_pct.toFixed(1)}%` : '—'} color={pctColor(snap.labor_cost_pct, 30, 38)} sub="target <30%" />
        <KpiChip label="Prime Cost" value={snap.prime_cost_pct > 0 ? `${snap.prime_cost_pct.toFixed(1)}%` : '—'} color={pctColor(snap.prime_cost_pct, 60, 65)} sub="target <65%" />
        <KpiChip label="Active Tables" value={String(snap.active_tables)} color={snap.active_tables > 0 ? '#22c55e' : 'var(--tx3)'} sub={snap.clocked_in > 0 ? `${snap.clocked_in} staff in` : undefined} />
      </div>

      {snap.top_item && (
        <div style={{ marginTop: 10, fontSize: 12, color: 'var(--tx3)' }}>
          🏆 Top seller today: <span style={{ color: ACC, fontWeight: 600 }}>{snap.top_item}</span>
        </div>
      )}

      <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
        <button onClick={() => router.push('/restaurant')}
          style={{ background: ACC, border: 'none', color: '#fff', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
          Open Restaurant Hub →
        </button>
        {snap.pending_online > 0 && (
          <button onClick={() => router.push('/restaurant')}
            style={{ background: '#ef4444', border: 'none', color: '#fff', padding: '8px 14px', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>
            {snap.pending_online} Online Order{snap.pending_online > 1 ? 's' : ''} Waiting!
          </button>
        )}
      </div>
    </div>
  )
}
