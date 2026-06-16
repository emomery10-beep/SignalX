'use client'
import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { usePosAuth } from '@/lib/hooks/usePosAuth'

const ACC = '#ec4899' // salon pink accent

const C = { good: '#22c55e', warn: '#f59e0b', bad: '#ef4444', muted: '#94a3b8', dim: '#64748b' }

interface Appointment {
  id: string
  client_id: string | null
  stylist_id: string | null
  service_name: string
  service_category: string | null
  scheduled_at: string
  duration_mins: number
  price: number
  status: string
  notes: string | null
  client?: { id: string; name: string; phone: string | null } | null
  stylist?: { id: string; name: string } | null
}

function dayKey(iso: string) { return new Date(iso).toISOString().slice(0, 10) }
function fmtTime(iso: string) { return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }

const statusBadge: Record<string, { bg: string; fg: string; label: string }> = {
  completed: { bg: '#14532d', fg: '#22c55e', label: 'Completed' },
  voided: { bg: '#7f1d1d', fg: '#ef4444', label: 'Voided' },
  refunded: { bg: '#451a03', fg: '#f59e0b', label: 'Refunded' },
}

export default function SalonBookings() {
  const router = useRouter()
  const { session, ready: authReady } = usePosAuth()
  const [sym, setSym] = useState('£')
  const [loading, setLoading] = useState(true)

  const todayStr = new Date().toISOString().slice(0, 10)
  const [date, setDate] = useState(todayStr)
  const [stylistFilter, setStylistFilter] = useState('all')
  const [serviceFilter, setServiceFilter] = useState('all')

  const [showForm, setShowForm] = useState(false)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [staff, setStaff] = useState<{ id: string; name: string }[]>([])
  const [form, setForm] = useState({ client: '', phone: '', service: '', stylist_id: '', time: '' })

  useEffect(() => {
    if (!authReady || !session) return
    fetch('/api/pos/config', { headers: { ...session.headers } }).then(r => r.json()).then(c => {
      if (c.currency_symbol) setSym(c.currency_symbol)
    }).catch(() => {})
  }, [authReady, session])

  useEffect(() => {
    if (!authReady || !session) return
    load()
  }, [authReady, session])

  async function load() {
    setLoading(true)
    try {
      // Bookings list shows ONLY real salon appointments. Generic POS transactions
      // are not fetched here — they belong to other sectors and were previously
      // mis-rendered as salon "services" (cross-sector data bleed).
      const [apptRes, staffRes] = await Promise.all([
        fetch('/api/pos/salon/appointments', { headers: { ...session!.headers } }),
        fetch('/api/pos/staff', { headers: { ...session!.headers } }),
      ])
      const apptData = await apptRes.json()
      const staffData = await staffRes.json()
      setAppointments(apptData.appointments || [])
      setStaff((staffData.staff || []).map((s: { id: string; name: string }) => ({ id: s.id, name: s.name })))
    } catch (e) {
      console.error('Bookings load error:', e)
    } finally {
      setLoading(false)
    }
  }

  // Distinct stylists & services for filters — derived from real salon appointments,
  // not from generic POS transactions (which belong to other sectors).
  const stylists = useMemo(() => {
    const set = new Set<string>()
    appointments.forEach(a => { if (a.stylist?.name) set.add(a.stylist.name) })
    return Array.from(set).sort()
  }, [appointments])

  const services = useMemo(() => {
    const set = new Set<string>()
    appointments.forEach(a => { if (a.service_name) set.add(a.service_name) })
    return Array.from(set).sort()
  }, [appointments])

  // Scheduled (real) appointments for the selected day, honouring the stylist filter.
  const dayAppointments = useMemo(() => {
    return appointments
      .filter(a => dayKey(a.scheduled_at) === date)
      .filter(a => stylistFilter === 'all' || a.stylist?.name === stylistFilter)
      .filter(a => serviceFilter === 'all' || a.service_name === serviceFilter)
      .sort((a, b) => +new Date(a.scheduled_at) - +new Date(b.scheduled_at))
  }, [appointments, date, stylistFilter, serviceFilter])

  async function submitBooking(e: React.FormEvent) {
    e.preventDefault()
    if (!form.client.trim() || !form.time.trim()) return
    try {
      // Create (or attach) a salon client record so the booking persists against a profile.
      let client_id: string | null = null
      const clientRes = await fetch('/api/pos/salon/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...session?.headers },
        body: JSON.stringify({ name: form.client.trim(), phone: form.phone || null }),
      })
      const clientData = await clientRes.json()
      if (clientData.client) client_id = clientData.client.id

      // Compose scheduled_at from the selected day + chosen time.
      const scheduled_at = new Date(`${date}T${form.time}:00`).toISOString()

      const res = await fetch('/api/pos/salon/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...session?.headers },
        body: JSON.stringify({
          client_id,
          stylist_id: form.stylist_id || null,
          service_name: form.service.trim() || 'Service',
          scheduled_at,
          status: 'booked',
        }),
      })
      const data = await res.json()
      if (data.appointment) setAppointments(prev => [data.appointment, ...prev])
    } catch (err) {
      console.error('Create booking error:', err)
    }
    setForm({ client: '', phone: '', service: '', stylist_id: '', time: '' })
    setShowForm(false)
  }

  async function updateStatus(id: string, status: string) {
    setAppointments(prev => prev.map(a => (a.id === id ? { ...a, status } : a)))
    try {
      await fetch('/api/pos/salon/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...session?.headers },
        body: JSON.stringify({ id, status }),
      })
    } catch (err) {
      console.error('Update status error:', err)
    }
  }

  // Timeline window: 8:00 – 20:00
  const startHour = 8, endHour = 20
  const tlWidth = 1100, tlPad = 60, tlBarY = 56, tlBarH = 26
  const hourW = (tlWidth - tlPad * 2) / (endHour - startHour)
  function xForTime(iso: string) {
    const d = new Date(iso)
    const h = d.getHours() + d.getMinutes() / 60
    const clamped = Math.max(startHour, Math.min(endHour, h))
    return tlPad + (clamped - startHour) * hourW
  }

  const inputStyle: React.CSSProperties = {
    background: '#0f172a', border: '1px solid #334155', color: '#f1f5f9',
    borderRadius: 8, padding: '8px 12px', fontSize: 13, fontFamily: 'inherit',
  }

  return (
    <div className="pos-screen" style={{ minHeight: '100vh', background: '#0f172a', color: '#f1f5f9', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button onClick={() => router.push('/salon')} style={{ background: '#334155', border: 'none', color: C.muted, padding: '8px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>← Salon</button>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: ACC }}>💇 Bookings</div>
            <div style={{ fontSize: 12, color: C.muted }}>Appointment management</div>
          </div>
        </div>
        <button onClick={() => setShowForm(s => !s)} style={{ background: ACC, border: 'none', color: '#fff', padding: '9px 16px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
          + New Booking
        </button>
      </div>

      <div style={{ padding: '24px', maxWidth: 1400, margin: '0 auto' }}>
        {/* New booking form */}
        {showForm && (
          <form onSubmit={submitBooking} style={{ background: '#1e293b', border: `1px solid ${ACC}40`, borderRadius: 12, padding: 20, marginBottom: 24 }}>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>New Booking</div>
            <div style={{ fontSize: 12, color: C.dim, marginBottom: 14 }}>Scheduled on {date}. Saved to the salon appointments record.</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
              <input style={inputStyle} placeholder="Client name" value={form.client} onChange={e => setForm({ ...form, client: e.target.value })} />
              <input style={inputStyle} placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              <input style={inputStyle} placeholder="Service" value={form.service} onChange={e => setForm({ ...form, service: e.target.value })} />
              <select style={inputStyle} value={form.stylist_id} onChange={e => setForm({ ...form, stylist_id: e.target.value })}>
                <option value="">Stylist…</option>
                {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <input style={inputStyle} type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} />
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
              <button type="submit" className="pos-btn-primary" style={{ background: ACC, border: 'none', color: '#fff', padding: '9px 18px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>Save Booking</button>
              <button type="button" onClick={() => setShowForm(false)} style={{ background: '#334155', border: 'none', color: C.muted, padding: '9px 18px', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>Cancel</button>
            </div>
          </form>
        )}

        {/* Scheduled appointments for the day (persisted) */}
        {dayAppointments.length > 0 && (
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: 16, marginBottom: 24 }}>
            <div style={{ fontWeight: 700, marginBottom: 10, fontSize: 14 }}>Scheduled Appointments</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {dayAppointments.map((a, idx) => (
                <div key={a.id} className="pos-item" style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#0f172a', borderRadius: 8, padding: '8px 12px', animationDelay: `${Math.min(idx, 8) * 40}ms` }}>
                  <span style={{ color: ACC, fontWeight: 700, width: 48 }}>{fmtTime(a.scheduled_at)}</span>
                  <span style={{ flex: 1, fontSize: 13 }}>{a.client?.name || 'Walk-in'} {a.client?.phone && <span style={{ color: C.dim }}>· {a.client.phone}</span>}</span>
                  <span style={{ fontSize: 12, color: C.muted }}>{a.service_name} · {a.stylist?.name || 'Unassigned'}</span>
                  <select value={a.status} onChange={e => updateStatus(a.id, e.target.value)} style={{ ...inputStyle, padding: '4px 8px', fontSize: 12 }}>
                    {['booked', 'confirmed', 'in_progress', 'completed', 'no_show', 'cancelled'].map(s => (
                      <option key={s} value={s}>{s.replace('_', ' ')}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 20, alignItems: 'center' }}>
          <input style={inputStyle} type="date" value={date} onChange={e => setDate(e.target.value)} />
          <select style={inputStyle} value={stylistFilter} onChange={e => setStylistFilter(e.target.value)}>
            <option value="all">All stylists</option>
            {stylists.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select style={inputStyle} value={serviceFilter} onChange={e => setServiceFilter(e.target.value)}>
            <option value="all">All services</option>
            {services.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button onClick={() => setDate(todayStr)} style={{ background: '#334155', border: 'none', color: C.muted, padding: '8px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>Today</button>
          <div style={{ marginLeft: 'auto', fontSize: 13, color: C.dim }}>{dayAppointments.length} appointment{dayAppointments.length !== 1 ? 's' : ''}</div>
        </div>

        {/* SVG Timeline */}
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: 20, marginBottom: 24, overflowX: 'auto' }}>
          <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 15 }}>Day Timeline</div>
          <svg width={tlWidth} height={110} style={{ minWidth: tlWidth }}>
            {/* hour gridlines + labels */}
            {Array.from({ length: endHour - startHour + 1 }).map((_, i) => {
              const x = tlPad + i * hourW
              return (
                <g key={i}>
                  <line x1={x} y1={tlBarY - 8} x2={x} y2={tlBarY + tlBarH + 8} stroke="#334155" strokeWidth={1} />
                  <text x={x} y={tlBarY - 14} textAnchor="middle" fill={C.dim} fontSize={11}>{startHour + i}:00</text>
                </g>
              )
            })}
            {/* baseline */}
            <line x1={tlPad} y1={tlBarY + tlBarH + 8} x2={tlWidth - tlPad} y2={tlBarY + tlBarH + 8} stroke="#334155" strokeWidth={1} />
            {/* appointment markers — real salon appointments only */}
            {dayAppointments.map((a, idx) => {
              const x = xForTime(a.scheduled_at)
              const row = idx % 2 // stagger to reduce overlap
              const cy = tlBarY + (row === 0 ? 0 : tlBarH) + tlBarH / 2
              return (
                <g key={a.id}>
                  <line x1={x} y1={tlBarY - 8} x2={x} y2={cy} stroke={`${ACC}55`} strokeWidth={1} />
                  <circle cx={x} cy={cy} r={7} fill={ACC} stroke="#0f172a" strokeWidth={2}>
                    <title>{`${fmtTime(a.scheduled_at)} — ${a.client?.name || 'Walk-in'} (${a.service_name})`}</title>
                  </circle>
                  <text x={x} y={cy - 11} textAnchor="middle" fill="#e2e8f0" fontSize={10}>{fmtTime(a.scheduled_at)}</text>
                </g>
              )
            })}
            {dayAppointments.length === 0 && (
              <text x={tlWidth / 2} y={tlBarY + tlBarH} textAnchor="middle" fill={C.dim} fontSize={13}>No appointments for this day</text>
            )}
          </svg>
        </div>

        {/* List view */}
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, overflow: 'hidden', marginBottom: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '80px 1.4fr 1.6fr 1.2fr 1fr 110px', gap: 8, padding: '12px 16px', borderBottom: '1px solid #334155', fontSize: 11, color: C.dim, textTransform: 'uppercase', letterSpacing: 1 }}>
            <div>Time</div><div>Client</div><div>Service(s)</div><div>Stylist</div><div>Price</div><div>Status</div>
          </div>
          {loading && <div style={{ padding: 20, color: C.dim, fontSize: 13 }}>Loading…</div>}
          {!loading && dayAppointments.length === 0 && <div style={{ padding: 20, color: C.dim, fontSize: 13, textAlign: 'center' }}>No appointments match the filters.</div>}
          {dayAppointments.map((a, idx) => {
            const badge = statusBadge[a.status] || { bg: '#334155', fg: C.muted, label: (a.status || '—').replace('_', ' ') }
            return (
              <div key={a.id} className="pos-item" style={{ display: 'grid', gridTemplateColumns: '80px 1.4fr 1.6fr 1.2fr 1fr 110px', gap: 8, padding: '12px 16px', borderBottom: '1px solid #283548', fontSize: 13, alignItems: 'center', animationDelay: `${Math.min(idx, 8) * 40}ms` }}>
                <div style={{ color: ACC, fontWeight: 700 }}>{fmtTime(a.scheduled_at)}</div>
                <div>{a.client?.name || a.client?.phone || <span style={{ color: C.dim }}>Walk-in</span>}</div>
                <div style={{ color: '#e2e8f0' }}>{a.service_name}</div>
                <div style={{ color: C.muted }}>{a.stylist?.name || '—'}</div>
                <div style={{ fontWeight: 700 }}>{sym}{(a.price || 0).toFixed(2)}</div>
                <div><span style={{ background: badge.bg, color: badge.fg, borderRadius: 12, padding: '3px 10px', fontSize: 11, fontWeight: 600 }}>{badge.label}</span></div>
              </div>
            )
          })}
        </div>

        {/* No-show tracking */}
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: 20 }}>
          <div style={{ fontWeight: 700, marginBottom: 10, fontSize: 15 }}>No-Show Tracking</div>
          {(() => {
            const noShows = appointments.filter(a => a.status === 'no_show')
            if (noShows.length === 0) {
              return <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.5 }}>No missed appointments recorded. Mark a scheduled appointment as &quot;no show&quot; to track it here.</div>
            }
            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {noShows
                  .slice()
                  .sort((a, b) => +new Date(b.scheduled_at) - +new Date(a.scheduled_at))
                  .map((a, idx) => (
                    <div key={a.id} className="pos-item" style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#0f172a', borderRadius: 8, padding: '8px 12px', fontSize: 13, animationDelay: `${Math.min(idx, 8) * 40}ms` }}>
                      <span style={{ color: C.bad, fontWeight: 700, width: 110 }}>{new Date(a.scheduled_at).toLocaleDateString([], { day: '2-digit', month: 'short' })} {fmtTime(a.scheduled_at)}</span>
                      <span style={{ flex: 1 }}>{a.client?.name || 'Walk-in'}</span>
                      <span style={{ color: C.muted }}>{a.service_name} · {a.stylist?.name || 'Unassigned'}</span>
                      <span style={{ fontWeight: 700 }}>{sym}{(a.price || 0).toFixed(2)}</span>
                    </div>
                  ))}
              </div>
            )
          })()}
        </div>
      </div>
    </div>
  )
}
