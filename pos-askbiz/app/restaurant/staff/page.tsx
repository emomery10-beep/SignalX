'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { usePosAuth } from '@/lib/hooks/usePosAuth'
import { usePosConfig } from '@/lib/hooks/usePosConfig'
import { useLang } from '@/components/LanguageProvider'
import LanguageToggle from '@/components/LanguageToggle'
import { tokens, Button, Card, ListItem } from '@/components/ui'

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
  const { tc } = useLang()
  const { session, ready: authReady } = usePosAuth()
  const { sym } = usePosConfig(session, authReady)
  const [days, setDays]     = useState(7)
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState<Summary | null>(null)
  const [servers, setServers] = useState<ServerPerf[]>([])
  const [shifts, setShifts]   = useState<ShiftPerf[]>([])
  const [tab, setTab]         = useState<'servers' | 'shifts'>('servers')


  useEffect(() => {
    if (!authReady || !session) return
    load()
  }, [authReady, session, days])

  async function load() {
    if (!session) return
    setLoading(true)
    try {
      const res = await fetch(`/api/pos/restaurant/staff-performance?days=${days}`, { headers: session.headers })
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
    <div className="pos-screen" style={{ minHeight: '100vh', background: tokens.bg, color: tokens.ink, fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ background: tokens.surface, borderBottom: `1px solid ${tokens.border}`, padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, color: tokens.accent }}>{tc('restaurant_staff.header_title')}</div>
          <div style={{ fontSize: 12, color: tokens.hint }}>{tc('restaurant_staff.header_subtitle')}</div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <select
            value={days}
            onChange={e => setDays(parseInt(e.target.value))}
            style={{ background: tokens.border, border: 'none', color: tokens.ink, padding: '6px 10px', borderRadius: 6, fontSize: 13, cursor: 'pointer' }}
          >
            <option value={1}>{tc('restaurant_staff.filter_today')}</option>
            <option value={7}>{tc('restaurant_staff.filter_last_7_days')}</option>
            <option value={14}>{tc('restaurant_staff.filter_last_14_days')}</option>
            <option value={30}>{tc('restaurant_staff.filter_last_30_days')}</option>
          </select>
          <button onClick={() => router.push('/restaurant')}
            style={{ background: tokens.border, border: 'none', color: tokens.hint, padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>
            {tc('restaurant_staff.back_to_hub')}
          </button>
        </div>
      </div>

      {/* Account bar — language + sign out, same slim row on every restaurant screen */}
      <div style={{ background: tokens.surface, borderBottom: `1px solid ${tokens.border}`, padding: '6px 20px 8px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
        <LanguageToggle inline />
        <button onClick={() => { localStorage.removeItem('pos_staff'); router.push('/') }}
          style={{ background: tokens.bg, border: `1px solid ${tokens.border}`, color: tokens.muted, padding: '5px 10px', borderRadius: 8, cursor: 'pointer', fontSize: 11, fontWeight: 600 }}>
          {tc('common.sign_out')}
        </button>
      </div>

      <div style={{ padding: '24px', maxWidth: 1100, margin: '0 auto' }}>
        {/* Summary KPIs */}
        {summary && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, marginBottom: 24 }}>
            {[
              { label: tc('restaurant_staff.kpi_total_revenue'), value: `${sym}${summary.total_revenue.toFixed(2)}` },
              { label: tc('restaurant_staff.kpi_total_orders'),  value: `${summary.total_orders}` },
              { label: tc('restaurant_staff.kpi_total_covers'),  value: `${summary.total_covers}` },
              { label: tc('restaurant_staff.kpi_labour_hours'),  value: `${summary.total_labour_hours.toFixed(1)}h` },
              { label: tc('restaurant_staff.kpi_labour_cost'),   value: `${sym}${summary.total_labour_cost.toFixed(2)}` },
              { label: tc('restaurant_staff.kpi_rev_per_labour_hr'), value: `${sym}${summary.revenue_per_labour_hour.toFixed(2)}` },
            ].map((k, idx) => (
              <ListItem key={k.label} index={idx}>
                <Card style={{ padding: '12px 14px' }}>
                  <div style={{ fontSize: 11, color: tokens.muted, textTransform: 'uppercase', letterSpacing: 1 }}>{k.label}</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: tokens.accent, marginTop: 4 }}>{k.value}</div>
                </Card>
              </ListItem>
            ))}
          </div>
        )}

        {/* Tab switcher */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: tokens.surface, padding: 4, borderRadius: 8, width: 'fit-content' }}>
          {(['servers', 'shifts'] as const).map(t => (
            <button key={t} className="pos-tab" onClick={() => setTab(t)}
              style={{ padding: '8px 20px', borderRadius: 6, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13,
                background: tab === t ? tokens.accent : 'transparent', color: tab === t ? '#fff' : tokens.hint }}>
              {t === 'servers' ? tc('restaurant_staff.tab_servers') : tc('restaurant_staff.tab_shifts')}
            </button>
          ))}
        </div>

        {loading && <div style={{ color: tokens.muted, textAlign: 'center', padding: 40 }}>{tc('restaurant_staff.loading')}</div>}

        {/* Server performance table */}
        {!loading && tab === 'servers' && (
          <div className="pos-reveal" style={{ background: tokens.surface, border: `1px solid ${tokens.border}`, borderRadius: 12, overflow: 'hidden' }}>
            {servers.length === 0 ? (
              <div style={{ padding: 32, textAlign: 'center', color: tokens.muted }}>{tc('restaurant_staff.servers_empty')}</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: tokens.bg }}>
                    {[
                      { key: 'rank', label: tc('restaurant_staff.col_rank'), left: true },
                      { key: 'server', label: tc('restaurant_staff.col_server'), left: true },
                      { key: 'orders', label: tc('restaurant_staff.col_orders'), left: false },
                      { key: 'covers', label: tc('restaurant_staff.col_covers'), left: false },
                      { key: 'revenue', label: tc('restaurant_staff.col_revenue'), left: false },
                      { key: 'avg_ticket', label: tc('restaurant_staff.col_avg_ticket'), left: false },
                      { key: 'avg_per_cover', label: tc('restaurant_staff.col_avg_per_cover'), left: false },
                      { key: 'items_sold', label: tc('restaurant_staff.col_items_sold'), left: false },
                    ].map(h => (
                      <th key={h.key} style={{ padding: '12px 16px', textAlign: h.left ? 'left' : 'right', fontSize: 11, color: tokens.muted, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>{h.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {servers.map((s, i) => (
                    <tr key={s.server_id || s.server_name} className="pos-item" style={{ borderTop: `1px solid ${tokens.border}`, animationDelay: `${Math.min(i, 8) * 40}ms` }}>
                      <td style={{ padding: '14px 16px', color: i === 0 ? tokens.warning : tokens.muted, fontWeight: 700, fontSize: 13 }}>
                        {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{s.server_name}</div>
                        {/* Revenue bar */}
                        <div style={{ height: 4, background: tokens.bg, borderRadius: 2, marginTop: 6, width: 120 }}>
                          <div style={{ height: '100%', background: tokens.accent, borderRadius: 2, width: `${(s.revenue / maxRevenue) * 100}%` }} />
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: 14 }}>{s.orders}</td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: 14 }}>{s.covers}</td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: 14, fontWeight: 600, color: tokens.success }}>{sym}{s.revenue.toFixed(2)}</td>
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
          <div className="pos-reveal" style={{ background: tokens.surface, border: `1px solid ${tokens.border}`, borderRadius: 12, overflow: 'hidden' }}>
            {shifts.length === 0 ? (
              <div style={{ padding: 32, textAlign: 'center', color: tokens.muted }}>{tc('restaurant_staff.shifts_empty')}</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: tokens.bg }}>
                    {[
                      { key: 'staff', label: tc('restaurant_staff.col_staff'), left: true },
                      { key: 'role', label: tc('restaurant_staff.col_role'), left: true },
                      { key: 'shifts', label: tc('restaurant_staff.col_shifts'), left: false },
                      { key: 'hours', label: tc('restaurant_staff.col_hours'), left: false },
                      { key: 'labour_cost', label: tc('restaurant_staff.col_labour_cost'), left: false },
                      { key: 'rev_per_hr', label: tc('restaurant_staff.col_rev_per_hr'), left: false },
                    ].map(h => (
                      <th key={h.key} style={{ padding: '12px 16px', textAlign: h.left ? 'left' : 'right', fontSize: 11, color: tokens.muted, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>{h.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {shifts.map((s, idx) => (
                    <tr key={s.staff_id} className="pos-item" style={{ borderTop: `1px solid ${tokens.border}`, animationDelay: `${Math.min(idx, 8) * 40}ms` }}>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{s.name}</div>
                        <div style={{ height: 4, background: tokens.bg, borderRadius: 2, marginTop: 6, width: 120 }}>
                          <div style={{ height: '100%', background: tokens.accent, borderRadius: 2, width: `${(s.total_hours / maxHours) * 100}%` }} />
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ background: tokens.border, color: tokens.hint, borderRadius: 4, padding: '2px 8px', fontSize: 12 }}>{s.role}</span>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: 14 }}>{s.total_shifts}</td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: 14 }}>{s.total_hours.toFixed(1)}h</td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: 14, color: tokens.warning }}>{sym}{s.total_labour_cost.toFixed(2)}</td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: 14, color: s.revenue_per_hour > 0 ? tokens.success : tokens.muted, fontWeight: s.revenue_per_hour > 0 ? 600 : 400 }}>
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
            <Button
              variant="secondary"
              style={{ borderColor: tokens.accent, color: tokens.accent }}
              onClick={() => router.push('/pos?q=Analyse+my+staff+performance+and+suggest+who+is+performing+best')}
            >
              {tc('restaurant_staff.ask_ai')}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
