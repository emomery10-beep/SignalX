'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const ACC = '#d08a59'
const API = process.env.NEXT_PUBLIC_API_URL || ''

const ROLES = ['chef', 'waiter', 'bartender', 'manager', 'cashier', 'runner', 'cleaner']
const ROLE_ICONS: Record<string, string> = {
  chef: '👨‍🍳', waiter: '🤵', bartender: '🍸', manager: '👔',
  cashier: '💰', runner: '🏃', cleaner: '🧹',
}

interface Shift {
  id: string; staff_id: string; role: string; hourly_rate: number
  clock_in: string; clock_out?: string; break_mins: number
  total_hours?: number; total_cost?: number; status: string; notes?: string
  staff?: { id: string; name: string; role: string }
}
interface StaffMember { id: string; name: string; role: string; active: boolean }

function liveHours(shift: Shift): number {
  if (shift.status !== 'active') return shift.total_hours || 0
  const mins = (Date.now() - new Date(shift.clock_in).getTime()) / 60000 - (shift.break_mins || 0)
  return Math.max(0, mins / 60)
}

function liveCost(shift: Shift): number {
  return liveHours(shift) * (shift.hourly_rate || 0)
}

export default function LaborPage() {
  const router   = useRouter()
  const supabase = createClient()
  const [ready, setReady]         = useState(false)
  const [sym, setSym]             = useState('£')
  const [shifts, setShifts]       = useState<Shift[]>([])
  const [summary, setSummary]     = useState<any>({})
  const [staffList, setStaffList] = useState<StaffMember[]>([])
  const [loading, setLoading]     = useState(true)
  const [, setTick]               = useState(0)
  const [showClockIn, setShowClock] = useState(false)
  const [clockInForm, setForm]    = useState({ staff_id: '', role: 'waiter', hourly_rate: '12.00', notes: '' })
  const [saving, setSaving]       = useState(false)
  const [period, setPeriod]       = useState(1) // days

  // Force re-render every 10s for live cost counter
  useEffect(() => { const t = setInterval(() => setTick(x => x + 1), 10000); return () => clearInterval(t) }, [])

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/pos'); return }
      setReady(true)
      fetch(`${API}/api/pos/config`).then(r => r.json()).then(c => {
        if (c.currency_symbol) setSym(c.currency_symbol)
      }).catch(() => {})
    })
  }, [])

  const load = useCallback(async () => {
    setLoading(true)
    const from = new Date(); from.setDate(from.getDate() - period); from.setHours(0,0,0,0)
    const [shiftsRes, staffRes] = await Promise.all([
      fetch(`${API}/api/pos/restaurant/labor?from=${from.toISOString()}`),
      fetch(`${API}/api/pos/staff`),
    ])
    const [shiftsData, staffData] = await Promise.all([shiftsRes.json(), staffRes.json()])
    setShifts(shiftsData.shifts || [])
    setSummary(shiftsData.summary || {})
    setStaffList((staffData.staff || []).filter((s: StaffMember) => s.active))
    setLoading(false)
  }, [period])

  useEffect(() => { if (ready) load() }, [ready, load])

  async function clockIn() {
    if (!clockInForm.staff_id) return
    setSaving(true)
    await fetch(`${API}/api/pos/restaurant/labor`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        staff_id: clockInForm.staff_id, role: clockInForm.role,
        hourly_rate: parseFloat(clockInForm.hourly_rate) || 0, notes: clockInForm.notes,
      }),
    })
    setShowClock(false)
    setForm({ staff_id: '', role: 'waiter', hourly_rate: '12.00', notes: '' })
    setSaving(false)
    await load()
  }

  async function clockOut(shiftId: string) {
    if (!confirm('Clock out this staff member?')) return
    await fetch(`${API}/api/pos/restaurant/labor`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: shiftId, action: 'clock_out' }),
    })
    await load()
  }

  const activeShifts   = shifts.filter(s => s.status === 'active')
  const completedShifts = shifts.filter(s => s.status === 'completed')
  const totalLiveCost  = activeShifts.reduce((s, sh) => s + liveCost(sh), 0) + (summary.total_cost || 0) - completedShifts.filter(s => activeShifts.some(a => a.id !== s.id)).reduce((s, sh) => s + (sh.total_cost || 0), 0)

  const inp: React.CSSProperties = {
    width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: 6,
    color: '#f1f5f9', padding: '8px 10px', fontSize: 13, boxSizing: 'border-box',
  }

  return (
    <div className="pos-screen" style={{ minHeight: '100vh', background: '#0f172a', color: '#f1f5f9', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => router.push('/restaurant')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 18 }}>←</button>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16, color: ACC }}>⏱️ Labour Tracking</div>
          <div style={{ fontSize: 11, color: '#64748b' }}>Clock in/out · Live cost · Shift analysis</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          {[1, 7, 30].map(d => (
            <button key={d} onClick={() => setPeriod(d)}
              style={{ background: period === d ? ACC : '#1e293b', border: `1px solid ${period === d ? ACC : '#334155'}`, color: period === d ? '#fff' : '#64748b', padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
              {d === 1 ? 'Today' : `${d}d`}
            </button>
          ))}
          <button className="pos-btn-primary" onClick={() => setShowClock(true)}
            style={{ background: ACC, border: 'none', color: '#fff', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
            Clock In
          </button>
        </div>
      </div>

      <div style={{ padding: '20px', maxWidth: 900, margin: '0 auto' }}>
        {/* Summary KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
          {[
            { label: 'Clocked In Now',  value: `${activeShifts.length}`,                   color: activeShifts.length ? '#22c55e' : '#64748b' },
            { label: 'Live Cost',       value: `${sym}${summary.live_running_cost?.toFixed(2) || '0.00'}`, color: '#f59e0b' },
            { label: 'Total Cost (period)', value: `${sym}${summary.total_cost?.toFixed(2) || '0.00'}`, color: ACC },
            { label: 'Total Hours',     value: `${summary.total_hours?.toFixed(1) || '0'}h`, color: '#94a3b8' },
          ].map(kpi => (
            <div key={kpi.label} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: '14px 16px' }}>
              <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1 }}>{kpi.label}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: kpi.color, marginTop: 4 }}>{kpi.value}</div>
            </div>
          ))}
        </div>

        {/* Active Shifts */}
        {activeShifts.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12, color: '#22c55e' }}>🟢 Currently Clocked In</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {activeShifts.map((shift, idx) => {
                const hours = liveHours(shift)
                const cost  = liveCost(shift)
                const elapsed = Math.floor((Date.now() - new Date(shift.clock_in).getTime()) / 60000)
                return (
                  <div key={shift.id} className="pos-item" style={{ background: '#1e293b', border: '1px solid #14532d', borderRadius: 10, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, animationDelay: `${Math.min(idx, 8) * 40}ms` }}>
                    <div style={{ fontSize: 24 }}>{ROLE_ICONS[shift.role] || '👤'}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>{shift.staff?.name || 'Staff'}</div>
                      <div style={{ fontSize: 12, color: '#94a3b8' }}>
                        {shift.role} · {sym}{shift.hourly_rate}/hr · In since {new Date(shift.clock_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', marginRight: 8 }}>
                      <div style={{ fontSize: 18, fontWeight: 800, color: '#f59e0b', fontVariantNumeric: 'tabular-nums' }}>
                        {Math.floor(elapsed / 60)}h {elapsed % 60}m
                      </div>
                      <div style={{ fontSize: 13, color: ACC, fontWeight: 600 }}>{sym}{cost.toFixed(2)}</div>
                    </div>
                    <button onClick={() => clockOut(shift.id)}
                      style={{ background: '#ef4444', border: 'none', color: '#fff', padding: '8px 14px', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>
                      Clock Out
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Completed Shifts */}
        {completedShifts.length > 0 && (
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12, color: '#64748b' }}>Completed Shifts</div>
            <div style={{ background: '#1e293b', borderRadius: 12, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#0f172a' }}>
                    {['Staff', 'Role', 'Clock In', 'Clock Out', 'Hours', 'Rate', 'Cost'].map(h => (
                      <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {completedShifts.map((shift, idx) => (
                    <tr key={shift.id} className="pos-item" style={{ borderTop: '1px solid #1e293b', animationDelay: `${Math.min(idx, 8) * 40}ms` }}>
                      <td style={{ padding: '10px 14px', fontSize: 14, fontWeight: 600 }}>{shift.staff?.name || '—'}</td>
                      <td style={{ padding: '10px 14px', fontSize: 13, color: '#94a3b8' }}>{ROLE_ICONS[shift.role]} {shift.role}</td>
                      <td style={{ padding: '10px 14px', fontSize: 12, color: '#94a3b8', fontVariantNumeric: 'tabular-nums' }}>
                        {new Date(shift.clock_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td style={{ padding: '10px 14px', fontSize: 12, color: '#94a3b8', fontVariantNumeric: 'tabular-nums' }}>
                        {shift.clock_out ? new Date(shift.clock_out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                      </td>
                      <td style={{ padding: '10px 14px', fontSize: 13, fontVariantNumeric: 'tabular-nums' }}>{shift.total_hours?.toFixed(2) || '—'}h</td>
                      <td style={{ padding: '10px 14px', fontSize: 13, color: '#64748b' }}>{sym}{shift.hourly_rate}/hr</td>
                      <td style={{ padding: '10px 14px', fontSize: 14, fontWeight: 700, color: ACC }}>{sym}{shift.total_cost?.toFixed(2) || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!loading && shifts.length === 0 && (
          <div style={{ textAlign: 'center', padding: 60, color: '#64748b' }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>⏱️</div>
            <div style={{ fontSize: 16, marginBottom: 4 }}>No shifts recorded</div>
            <div style={{ fontSize: 13 }}>Clock in staff to start tracking labour costs.</div>
          </div>
        )}
      </div>

      {/* Clock In Modal */}
      {showClockIn && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div className="pos-sheet" style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 16, padding: 24, width: 380 }}>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Clock In Staff</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>Staff Member *</label>
                <select value={clockInForm.staff_id} onChange={e => setForm(p => ({ ...p, staff_id: e.target.value }))} style={inp}>
                  <option value="">— Select staff —</option>
                  {staffList.map(s => <option key={s.id} value={s.id}>{s.name} ({s.role})</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>Role for this shift</label>
                <select value={clockInForm.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} style={inp}>
                  {ROLES.map(r => <option key={r} value={r}>{ROLE_ICONS[r]} {r}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>Hourly Rate ({sym})</label>
                <input type="number" step="0.01" value={clockInForm.hourly_rate}
                  onChange={e => setForm(p => ({ ...p, hourly_rate: e.target.value }))} style={inp} />
              </div>
              <div>
                <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>Notes (optional)</label>
                <input value={clockInForm.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                  placeholder="Evening shift, covering for..." style={inp} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button onClick={() => setShowClock(false)} style={{ flex: 1, background: '#334155', border: 'none', color: '#94a3b8', padding: '10px', borderRadius: 8, cursor: 'pointer' }}>Cancel</button>
              <button className="pos-btn-primary" onClick={clockIn} disabled={saving || !clockInForm.staff_id}
                style={{ flex: 1, background: '#22c55e', border: 'none', color: '#fff', padding: '10px', borderRadius: 8, cursor: saving || !clockInForm.staff_id ? 'not-allowed' : 'pointer', fontWeight: 700, opacity: saving || !clockInForm.staff_id ? 0.5 : 1 }}>
                {saving ? '...' : '🟢 Clock In Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
