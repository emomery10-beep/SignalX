'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const ACC = '#d08a59'
const API = process.env.NEXT_PUBLIC_API_URL || ''

interface ServerPerf {
  server_id: string | null
  server_name: string
  orders: number
  covers: number
  revenue: number
  items_sold: number
  avg_ticket: number
  avg_per_cover: number
}

interface ShiftPerf {
  staff_id: string
  name: string
  role: string
  total_shifts: number
  total_hours: number
  total_labour_cost: number
  revenue_per_hour: number
}

interface Summary {
  total_orders: number
  total_revenue: number
  total_covers: number
  total_labour_hours: number
  total_labour_cost: number
  revenue_per_labour_hour: number
}

export default function StaffPerformancePage() {
  const router  = useRouter()
  const supabase = createClient()
  const [ready, setReady]   = useState(false)
  const [sym, setSym]       = useState('£')
  const [days, setDays]     = useState(7)
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState<Summary | null>(null)
  const [servers, setServers] = useState<ServerPerf[]>([])
  const [shifts, setShifts]   = useState<ShiftPerf[]>([])
  const [tab, setTab]         = useState<'servers' | 'shifts'>('servers')

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/pos'); return }
      setReady(true)
      fetch(`${API}/api/pos/config`).then(r => r.json()).then(c => {
        if (c.currency_symbol) setSym(c.currency_symbol)
      }).catch(() => {})
    })
  }, [])

  useEffect(() => {
    if (!ready) return
    load()
  }, [ready, days])

  async function load() {
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/pos/restaurant/staff-performance?days=${days}`)
      const data = await res.json()
      setSummary(data.summary || null)
      setServers(data.server_performance || [])
      setShifts(data.shift_performance || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const maxRevenue = Math.max(...servers.map(s => s.revenue), 1)
  const maxHours   = Math.max(...shifts.map(s => s.total_hours), 1)

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f1f5f9', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, color: ACC }}>👥 Staff Performance</div>
          <div style={{ fontSize: 12, color: '#94a3b8' }}>Server revenue & labour metrics</div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <select
            value={days}
            onChange={e => setDays(parseInt(e.target.value))}
            style={{ background: '#334155', border: 'none', color: '#f1f5f9', padding: '6px 10px', borderRadius: 6, fontSize: 13, cursor: 'pointer' }}
          >
            <option value={1}>Today</option>
            <option value={7}>Last 7 days</option>
            <option value={14}>Last 14 days</option>
            <option value={30}>Last 30 days</option>
          </select>
          <button onClick={() => router.push('/restaurant')}
            style={{ background: '#334155', border: 'none', color: '#94a3b8', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>
            ← Hub
          </button>
        </div>
      </div>

      <div style={{ padding: '24px', maxWidth: 1100, margin: '0 auto' }}>
        {/* Summary KPIs */}
        {summary && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, marginBottom: 24 }}>
            {[
              { label: 'Total Revenue', value: `${sym}${summary.total_revenue.toFixed(2)}` },
              { label: 'Total Orders',  value: `${summary.total_orders}` },
              { label: 'Total Covers',  value: `${summary.total_covers}` },
              { label: 'Labour Hours',  value: `${summary.total_labour_hours.toFixed(1)}h` },
              { label: 'Labour Cost',   value: `${sym}${summary.total_labour_cost.toFixed(2)}` },
              { label: 'Rev / Labour Hr', value: `${sym}${summary.revenue_per_labour_hour.toFixed(2)}` },
            ].map(k => (
              <div key={k.label} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 10, padding: '12px 14px' }}>
                <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1 }}>{k.label}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: ACC, marginTop: 4 }}>{k.value}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tab switcher */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: '#1e293b', padding: 4, borderRadius: 8, width: 'fit-content' }}>
          {(['servers', 'shifts'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ padding: '8px 20px', borderRadius: 6, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13,
                background: tab === t ? ACC : 'transparent', color: tab === t ? '#fff' : '#94a3b8' }}>
              {t === 'servers' ? '🍽️ Servers' : '⏱️ Shifts'}
            </button>
          ))}
        </div>

        {loading && <div style={{ color: '#64748b', textAlign: 'center', padding: 40 }}>Loading…</div>}

        {/* Server performance table */}
        {!loading && tab === 'servers' && (
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, overflow: 'hidden' }}>
            {servers.length === 0 ? (
              <div style={{ padding: 32, textAlign: 'center', color: '#64748b' }}>No server data for this period</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#0f172a' }}>
                    {['Rank', 'Server', 'Orders', 'Covers', 'Revenue', 'Avg Ticket', 'Avg/Cover', 'Items Sold'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: h === 'Rank' || h === 'Server' ? 'left' : 'right', fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {servers.map((s, i) => (
                    <tr key={s.server_id || s.server_name} style={{ borderTop: '1px solid #334155' }}>
                      <td style={{ padding: '14px 16px', color: i === 0 ? '#f59e0b' : '#64748b', fontWeight: 700, fontSize: 13 }}>
                        {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{s.server_name}</div>
                        {/* Revenue bar */}
                        <div style={{ height: 4, background: '#0f172a', borderRadius: 2, marginTop: 6, width: 120 }}>
                          <div style={{ height: '100%', background: ACC, borderRadius: 2, width: `${(s.revenue / maxRevenue) * 100}%` }} />
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: 14 }}>{s.orders}</td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: 14 }}>{s.covers}</td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: 14, fontWeight: 600, color: '#22c55e' }}>{sym}{s.revenue.toFixed(2)}</td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: 14 }}>{sym}{s.avg_ticket.toFixed(2)}</td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: 14 }}>{sym}{s.avg_per_cover.toFixed(2)}</td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: 14 }}>{s.items_sold}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Shift / labour table */}
        {!loading && tab === 'shifts' && (
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, overflow: 'hidden' }}>
            {shifts.length === 0 ? (
              <div style={{ padding: 32, textAlign: 'center', color: '#64748b' }}>No shift data for this period</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#0f172a' }}>
                    {['Staff', 'Role', 'Shifts', 'Hours', 'Labour Cost', 'Rev / Hr'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: h === 'Staff' || h === 'Role' ? 'left' : 'right', fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {shifts.map(s => (
                    <tr key={s.staff_id} style={{ borderTop: '1px solid #334155' }}>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{s.name}</div>
                        <div style={{ height: 4, background: '#0f172a', borderRadius: 2, marginTop: 6, width: 120 }}>
                          <div style={{ height: '100%', background: '#6366f1', borderRadius: 2, width: `${(s.total_hours / maxHours) * 100}%` }} />
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ background: '#334155', color: '#94a3b8', borderRadius: 4, padding: '2px 8px', fontSize: 12 }}>{s.role}</span>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: 14 }}>{s.total_shifts}</td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: 14 }}>{s.total_hours.toFixed(1)}h</td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: 14, color: '#f59e0b' }}>{sym}{s.total_labour_cost.toFixed(2)}</td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: 14, color: s.revenue_per_hour > 0 ? '#22c55e' : '#64748b', fontWeight: s.revenue_per_hour > 0 ? 600 : 400 }}>
                        {s.revenue_per_hour > 0 ? `${sym}${s.revenue_per_hour.toFixed(2)}` : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {!loading && (
          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <button
              onClick={() => router.push('/pos?q=Analyse+my+staff+performance+and+suggest+who+is+performing+best')}
              style={{ background: '#1e293b', border: `1px solid ${ACC}`, color: ACC, padding: '10px 24px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
            >
              Ask AI for staff analysis →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
