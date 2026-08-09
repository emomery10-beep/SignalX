'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { usePosAuth } from '@/lib/hooks/usePosAuth'
import { usePosConfig } from '@/lib/hooks/usePosConfig'
import { useLang } from '@/components/LanguageProvider'
import LanguageToggle from '@/components/LanguageToggle'
import { tokens, Button, Input, Select, Card, ListItem } from '@/components/ui'

const NS = 'restaurant_labor.'

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
  const { tc } = useLang()
  const { session, ready: authReady } = usePosAuth()
  const { sym } = usePosConfig(session, authReady)
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


  const load = useCallback(async () => {
    if (!session) return
    setLoading(true)
    const from = new Date(); from.setDate(from.getDate() - period); from.setHours(0,0,0,0)
    const [shiftsRes, staffRes] = await Promise.all([
      fetch(`/api/pos/restaurant/labor?from=${from.toISOString()}`, { headers: session.headers }),
      fetch('/api/pos/staff', { headers: session.headers }),
    ])
    const [shiftsData, staffData] = await Promise.all([shiftsRes.json(), staffRes.json()])
    setShifts(shiftsData.shifts || [])
    setSummary(shiftsData.summary || {})
    setStaffList((staffData.staff || []).filter((s: StaffMember) => s.active))
    setLoading(false)
  }, [period, session])

  useEffect(() => { if (authReady && session) load() }, [authReady, session, load])

  async function clockIn() {
    if (!clockInForm.staff_id || !session) return
    setSaving(true)
    await fetch('/api/pos/restaurant/labor', {
      method: 'POST', headers: { ...session.headers, 'Content-Type': 'application/json' },
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
    if (!confirm(tc(NS + 'confirm_clock_out')) || !session) return
    await fetch('/api/pos/restaurant/labor', {
      method: 'PATCH', headers: { ...session.headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: shiftId, action: 'clock_out' }),
    })
    await load()
  }

  const activeShifts   = shifts.filter(s => s.status === 'active')
  const completedShifts = shifts.filter(s => s.status === 'completed')
  const totalLiveCost  = activeShifts.reduce((s, sh) => s + liveCost(sh), 0) + (summary.total_cost || 0) - completedShifts.filter(s => activeShifts.some(a => a.id !== s.id)).reduce((s, sh) => s + (sh.total_cost || 0), 0)

  return (
    <div className="pos-screen" style={{ minHeight: '100vh', background: tokens.bg, color: tokens.ink, fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ background: tokens.surface, borderBottom: `1px solid ${tokens.border}`, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => router.push('/restaurant')} style={{ background: 'none', border: 'none', color: tokens.hint, cursor: 'pointer', fontSize: 18 }}>←</button>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16, color: tokens.accent }}>{tc(NS + 'header_title')}</div>
          <div style={{ fontSize: 11, color: tokens.muted }}>{tc(NS + 'header_subtitle')}</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          {[1, 7, 30].map(d => (
            <button key={d} className="pos-tab" onClick={() => setPeriod(d)}
              style={{ background: period === d ? tokens.accent : tokens.surface, border: `1px solid ${period === d ? tokens.accent : tokens.border}`, color: period === d ? '#fff' : tokens.muted, padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
              {d === 1 ? tc(NS + 'period_today') : tc(NS + 'period_days', { days: d })}
            </button>
          ))}
          <Button variant="primary" onClick={() => setShowClock(true)}>
            {tc(NS + 'clock_in')}
          </Button>
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

      <div style={{ padding: '20px', maxWidth: 900, margin: '0 auto' }}>
        {/* Summary KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
          {[
            { label: tc(NS + 'kpi_clocked_in_now'),  value: `${activeShifts.length}`,                   color: activeShifts.length ? tokens.success : tokens.muted },
            { label: tc(NS + 'kpi_live_cost'),       value: `${sym}${summary.live_running_cost?.toFixed(2) || '0.00'}`, color: tokens.warning },
            { label: tc(NS + 'kpi_total_cost_period'), value: `${sym}${summary.total_cost?.toFixed(2) || '0.00'}`, color: tokens.accent },
            { label: tc(NS + 'kpi_total_hours'),     value: `${summary.total_hours?.toFixed(1) || '0'}h`, color: tokens.hint },
          ].map(kpi => (
            <Card key={kpi.label} style={{ padding: '14px 16px' }}>
              <div style={{ fontSize: 11, color: tokens.muted, textTransform: 'uppercase', letterSpacing: 1 }}>{kpi.label}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: kpi.color, marginTop: 4 }}>{kpi.value}</div>
            </Card>
          ))}
        </div>

        {/* Active Shifts */}
        {activeShifts.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12, color: tokens.success }}>{tc(NS + 'currently_clocked_in')}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {activeShifts.map((shift, idx) => {
                const hours = liveHours(shift)
                const cost  = liveCost(shift)
                const elapsed = Math.floor((Date.now() - new Date(shift.clock_in).getTime()) / 60000)
                return (
                  <ListItem key={shift.id} index={idx} style={{ background: tokens.surface, border: `1px solid ${tokens.successRing}`, borderRadius: 10, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ fontSize: 24 }}>{ROLE_ICONS[shift.role] || '👤'}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>{shift.staff?.name || tc(NS + 'staff_fallback')}</div>
                      <div style={{ fontSize: 12, color: tokens.hint }}>
                        {tc(NS + 'active_shift_line', { role: tc(NS + 'role_' + shift.role), sym, rate: shift.hourly_rate, time: new Date(shift.clock_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) })}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', marginRight: 8 }}>
                      <div style={{ fontSize: 18, fontWeight: 800, color: tokens.warning, fontVariantNumeric: 'tabular-nums' }}>
                        {tc(NS + 'elapsed_hm', { hours: Math.floor(elapsed / 60), mins: elapsed % 60 })}
                      </div>
                      <div style={{ fontSize: 13, color: tokens.accent, fontWeight: 600 }}>{sym}{cost.toFixed(2)}</div>
                    </div>
                    <Button variant="danger" onClick={() => clockOut(shift.id)}>
                      {tc(NS + 'clock_out')}
                    </Button>
                  </ListItem>
                )
              })}
            </div>
          </div>
        )}

        {/* Completed Shifts */}
        {completedShifts.length > 0 && (
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12, color: tokens.muted }}>{tc(NS + 'completed_shifts')}</div>
            <div style={{ background: tokens.surface, borderRadius: 12, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: tokens.bg }}>
                    {[tc(NS + 'col_staff'), tc(NS + 'col_role'), tc(NS + 'col_clock_in'), tc(NS + 'col_clock_out'), tc(NS + 'col_hours'), tc(NS + 'col_rate'), tc(NS + 'col_cost')].map((h, hi) => (
                      <th key={hi} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, color: tokens.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {completedShifts.map((shift, idx) => (
                    <tr key={shift.id} className="pos-item" style={{ borderTop: `1px solid ${tokens.surface}`, animationDelay: `${Math.min(idx, 8) * 40}ms` }}>
                      <td style={{ padding: '10px 14px', fontSize: 14, fontWeight: 600 }}>{shift.staff?.name || '—'}</td>
                      <td style={{ padding: '10px 14px', fontSize: 13, color: tokens.hint }}>{ROLE_ICONS[shift.role]} {tc(NS + 'role_' + shift.role)}</td>
                      <td style={{ padding: '10px 14px', fontSize: 12, color: tokens.hint, fontVariantNumeric: 'tabular-nums' }}>
                        {new Date(shift.clock_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td style={{ padding: '10px 14px', fontSize: 12, color: tokens.hint, fontVariantNumeric: 'tabular-nums' }}>
                        {shift.clock_out ? new Date(shift.clock_out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                      </td>
                      <td style={{ padding: '10px 14px', fontSize: 13, fontVariantNumeric: 'tabular-nums' }}>{shift.total_hours != null ? tc(NS + 'hours_suffix', { hours: shift.total_hours.toFixed(2) }) : '—'}</td>
                      <td style={{ padding: '10px 14px', fontSize: 13, color: tokens.muted }}>{tc(NS + 'rate_per_hr', { sym, rate: shift.hourly_rate })}</td>
                      <td style={{ padding: '10px 14px', fontSize: 14, fontWeight: 700, color: tokens.accent }}>{sym}{shift.total_cost?.toFixed(2) || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!loading && shifts.length === 0 && (
          <div style={{ textAlign: 'center', padding: 60, color: tokens.muted }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>⏱️</div>
            <div style={{ fontSize: 16, marginBottom: 4 }}>{tc(NS + 'empty_no_shifts')}</div>
            <div style={{ fontSize: 13 }}>{tc(NS + 'empty_blurb')}</div>
          </div>
        )}
      </div>

      {/* Clock In Modal */}
      {showClockIn && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div className="pos-sheet" style={{ background: tokens.surface, border: `1px solid ${tokens.border}`, borderRadius: 16, padding: 24, width: 380 }}>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>{tc(NS + 'modal_title')}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Select label={tc(NS + 'label_staff_member')} value={clockInForm.staff_id} onChange={e => setForm(p => ({ ...p, staff_id: e.target.value }))}>
                <option value="">{tc(NS + 'select_staff')}</option>
                {staffList.map(s => <option key={s.id} value={s.id}>{tc(NS + 'staff_option', { name: s.name, role: s.role })}</option>)}
              </Select>
              <Select label={tc(NS + 'label_role_for_shift')} value={clockInForm.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}>
                {ROLES.map(r => <option key={r} value={r}>{ROLE_ICONS[r]} {tc(NS + 'role_' + r)}</option>)}
              </Select>
              <Input label={tc(NS + 'label_hourly_rate', { sym })} type="number" step="0.01" value={clockInForm.hourly_rate}
                onChange={e => setForm(p => ({ ...p, hourly_rate: e.target.value }))} />
              <Input label={tc(NS + 'label_notes')} value={clockInForm.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                placeholder={tc(NS + 'placeholder_notes')} />
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <Button variant="secondary" style={{ flex: 1 }} onClick={() => setShowClock(false)}>{tc(NS + 'cancel')}</Button>
              <button className="pos-btn-primary" onClick={clockIn} disabled={saving || !clockInForm.staff_id}
                style={{ flex: 1, background: tokens.success, border: 'none', color: '#fff', padding: '10px', borderRadius: 8, cursor: saving || !clockInForm.staff_id ? 'not-allowed' : 'pointer', fontWeight: 700, opacity: saving || !clockInForm.staff_id ? 0.5 : 1 }}>
                {saving ? tc(NS + 'saving') : tc(NS + 'clock_in_now')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
