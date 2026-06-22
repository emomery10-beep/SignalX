'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { usePosAuth } from '@/lib/hooks/usePosAuth'
import { useLang } from '@/components/LanguageProvider'

const ACC = '#d08a59'

const NS = 'restaurant_reservations.'

const STATUS_CONFIG: Record<string, { color: string; bg: string }> = {
  pending:   { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  confirmed: { color: '#22c55e', bg: 'rgba(34,197,94,0.1)'  },
  seated:    { color: ACC,       bg: 'rgba(208,138,89,0.1)' },
  completed: { color: '#64748b', bg: 'rgba(100,116,139,0.1)'},
  no_show:   { color: '#ef4444', bg: 'rgba(239,68,68,0.1)'  },
  cancelled: { color: '#334155', bg: '#1e293b'               },
}

interface Reservation {
  id: string; customer_name: string; customer_phone: string | null; customer_email: string | null
  covers: number; reserved_at: string; duration_mins: number; status: string; notes: string | null
  table_id: string | null
  restaurant_tables?: { id: string; name: string; section: string; capacity: number } | null
}

interface Table { id: string; name: string; section: string; capacity: number }

const inp: React.CSSProperties = {
  background: '#0f172a', border: '1px solid #334155', borderRadius: 6,
  color: '#f1f5f9', padding: '8px 10px', fontSize: 13,
  boxSizing: 'border-box', width: '100%',
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// Returns a stable key: '__today__', '__tomorrow__', or a formatted date string
function fmtDate(iso: string) {
  const d = new Date(iso)
  const today = new Date(); today.setHours(0,0,0,0)
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1)
  if (d >= today && d < tomorrow) return '__today__'
  if (d >= tomorrow && d < new Date(tomorrow.getTime() + 86400000)) return '__tomorrow__'
  return d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })
}

function dateLabel(tc: (key: string, vars?: Record<string, string | number>) => string, key: string): string {
  if (key === '__today__') return tc(NS + 'date_today')
  if (key === '__tomorrow__') return tc(NS + 'date_tomorrow')
  return key
}

export default function ReservationsPage() {
  const router   = useRouter()
  const { tc } = useLang()
  const { session, ready: authReady } = usePosAuth()
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [tables, setTables] = useState<Table[]>([])
  const [summary, setSummary] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [showAdd, setShowAdd] = useState(false)
  const [saving, setSaving]   = useState(false)
  const [actioning, setActioning] = useState<string | null>(null)

  const [form, setForm] = useState({
    customer_name: '', customer_phone: '', customer_email: '',
    covers: '2', reserved_at: '', duration_mins: '90', table_id: '', notes: '',
  })

  const load = useCallback(async () => {
    if (!session) return
    setLoading(true)
    const [resRes, tabRes] = await Promise.all([
      fetch('/api/pos/restaurant/reservations?days=14', { headers: session.headers }),
      fetch('/api/pos/restaurant/tables', { headers: session.headers }),
    ])
    const [resData, tabData] = await Promise.all([resRes.json(), tabRes.json()])
    setReservations(resData.reservations || [])
    setSummary(resData.summary || {})
    setTables((tabData.tables || []).filter((t: Table) => t.capacity > 0))
    setLoading(false)
  }, [session])

  useEffect(() => { if (authReady && session) load() }, [authReady, session, load])

  async function createReservation() {
    if (!form.customer_name || !form.reserved_at || !form.covers || !session) return
    setSaving(true)
    await fetch('/api/pos/restaurant/reservations', {
      method: 'POST', headers: { ...session.headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name:  form.customer_name,
        customer_phone: form.customer_phone || null,
        customer_email: form.customer_email || null,
        covers:         parseInt(form.covers),
        reserved_at:    new Date(form.reserved_at).toISOString(),
        duration_mins:  parseInt(form.duration_mins) || 90,
        table_id:       form.table_id || null,
        notes:          form.notes || null,
      }),
    })
    setSaving(false)
    setShowAdd(false)
    setForm({ customer_name: '', customer_phone: '', customer_email: '', covers: '2', reserved_at: '', duration_mins: '90', table_id: '', notes: '' })
    await load()
  }

  async function updateStatus(id: string, status: string) {
    if (!session) return
    setActioning(id)
    await fetch('/api/pos/restaurant/reservations', {
      method: 'PATCH', headers: { ...session.headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    setActioning(null)
    await load()
  }

  async function cancel(id: string) {
    if (!confirm(tc(NS + 'confirm_cancel')) || !session) return
    await fetch(`/api/pos/restaurant/reservations?id=${id}`, { method: 'DELETE', headers: session.headers })
    await load()
  }

  // Group by date
  const filtered = reservations.filter(r => filterStatus === 'all' || r.status === filterStatus)
  const grouped: Record<string, Reservation[]> = {}
  for (const r of filtered) {
    const day = fmtDate(r.reserved_at)
    if (!grouped[day]) grouped[day] = []
    grouped[day].push(r)
  }

  // Default datetime for new booking: next hour rounded
  const defaultDt = () => {
    const d = new Date(); d.setMinutes(0, 0, 0)
    d.setHours(d.getHours() + 1)
    return d.toISOString().slice(0, 16)
  }

  return (
    <div className="pos-screen" style={{ minHeight: '100vh', background: '#0f172a', color: '#f1f5f9', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => router.push('/restaurant')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 18 }}>←</button>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16, color: ACC }}>{tc(NS + 'header_title')}</div>
          <div style={{ fontSize: 11, color: '#64748b' }}>{tc(NS + 'header_subtitle')}</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button onClick={() => { setShowAdd(true); setForm(f => ({ ...f, reserved_at: defaultDt() })) }}
            style={{ background: ACC, border: 'none', color: '#fff', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
            {tc(NS + 'new_booking')}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 780, margin: '0 auto', padding: '24px 20px' }}>
        {/* KPI strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
          {[
            { label: tc(NS + 'kpi_today_bookings'), value: String(summary.today_bookings ?? 0),  color: ACC },
            { label: tc(NS + 'kpi_today_covers'),   value: String(summary.today_covers ?? 0),    color: '#22c55e' },
            { label: tc(NS + 'kpi_upcoming'),       value: String(summary.upcoming ?? 0),         color: '#94a3b8' },
          ].map(k => (
            <div key={k.label} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: '14px 16px' }}>
              <div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1 }}>{k.label}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: k.color, marginTop: 4 }}>{k.value}</div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
          {['all', 'pending', 'confirmed', 'seated', 'no_show'].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              style={{ background: filterStatus === s ? ACC : '#1e293b', border: `1px solid ${filterStatus === s ? ACC : '#334155'}`, color: filterStatus === s ? '#fff' : '#94a3b8', padding: '6px 14px', borderRadius: 20, cursor: 'pointer', fontSize: 12, fontWeight: filterStatus === s ? 700 : 400 }}>
              {s === 'all' ? tc(NS + 'filter_all') : (STATUS_CONFIG[s] ? tc(NS + 'status_' + s) : s)}
            </button>
          ))}
        </div>

        {!loading && Object.keys(grouped).length === 0 && (
          <div style={{ textAlign: 'center', padding: 60, color: '#64748b' }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>📅</div>
            <div style={{ fontSize: 16, marginBottom: 4 }}>{tc(NS + 'no_reservations_title')}</div>
            <div style={{ fontSize: 13 }}>{tc(NS + 'no_reservations_blurb')}</div>
          </div>
        )}

        {/* Grouped reservation list */}
        {Object.entries(grouped).map(([day, dayRes]) => (
          <div key={day} style={{ marginBottom: 28 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#94a3b8', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
              {dateLabel(tc, day)}
              <span style={{ fontSize: 12, fontWeight: 400, color: '#475569' }}>
                · {tc(NS + 'covers_suffix', { count: dayRes.filter(r => r.status !== 'cancelled' && r.status !== 'no_show').reduce((s, r) => s + r.covers, 0) })}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {dayRes.map((res, idx) => {
                const cfg = STATUS_CONFIG[res.status] || STATUS_CONFIG.confirmed
                const statusKey = STATUS_CONFIG[res.status] ? res.status : 'confirmed'
                const isToday = fmtDate(res.reserved_at) === '__today__'
                return (
                  <div key={res.id} className="pos-item" style={{ background: '#1e293b', border: `1px solid ${isToday ? '#334155' : '#1e293b'}`, borderRadius: 10, padding: '14px 16px', display: 'flex', gap: 14, alignItems: 'center', animationDelay: `${Math.min(idx, 8) * 40}ms` }}>
                    {/* Time */}
                    <div style={{ textAlign: 'center', minWidth: 52, flexShrink: 0 }}>
                      <div style={{ fontWeight: 800, fontSize: 16, color: ACC, fontVariantNumeric: 'tabular-nums' }}>{fmtTime(res.reserved_at)}</div>
                      <div style={{ fontSize: 11, color: '#475569' }}>{tc(NS + 'duration_mins_short', { mins: res.duration_mins })}</div>
                    </div>

                    {/* Details */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{res.customer_name}</div>
                      <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                        {tc(NS + (res.covers === 1 ? 'covers_one' : 'covers_other'), { count: res.covers })}
                        {res.restaurant_tables && ` · ${res.restaurant_tables.name}`}
                        {res.customer_phone && ` · ${res.customer_phone}`}
                      </div>
                      {res.notes && <div style={{ fontSize: 12, color: '#f59e0b', marginTop: 2, fontStyle: 'italic' }}>✎ {res.notes}</div>}
                    </div>

                    {/* Status badge */}
                    <div style={{ background: cfg.bg, color: cfg.color, fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 20, flexShrink: 0 }}>
                      {tc(NS + 'status_' + statusKey)}
                    </div>

                    {/* Actions */}
                    {(res.status === 'confirmed' || res.status === 'pending') && (
                      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                        <button onClick={() => updateStatus(res.id, 'seated')} disabled={actioning === res.id}
                          style={{ background: ACC, border: 'none', color: '#fff', padding: '6px 12px', borderRadius: 6, cursor: actioning === res.id ? 'not-allowed' : 'pointer', fontSize: 12, fontWeight: 600, opacity: actioning === res.id ? 0.5 : 1 }}>
                          {actioning === res.id ? '...' : tc(NS + 'action_seat')}
                        </button>
                        <button onClick={() => updateStatus(res.id, 'no_show')} disabled={actioning === res.id}
                          style={{ background: '#334155', border: 'none', color: '#94a3b8', padding: '6px 10px', borderRadius: 6, cursor: actioning === res.id ? 'not-allowed' : 'pointer', fontSize: 12, opacity: actioning === res.id ? 0.5 : 1 }}>
                          {tc(NS + 'action_no_show')}
                        </button>
                        <button onClick={() => cancel(res.id)}
                          style={{ background: 'none', border: '1px solid #334155', color: '#ef4444', padding: '6px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
                          ✕
                        </button>
                      </div>
                    )}
                    {res.status === 'seated' && (
                      <button onClick={() => updateStatus(res.id, 'completed')} disabled={actioning === res.id}
                        style={{ background: '#22c55e', border: 'none', color: '#fff', padding: '6px 12px', borderRadius: 6, cursor: actioning === res.id ? 'not-allowed' : 'pointer', fontSize: 12, fontWeight: 600, flexShrink: 0, opacity: actioning === res.id ? 0.5 : 1 }}>
                        {tc(NS + 'action_complete')}
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Add Reservation Modal */}
      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 20 }}>
          <div className="pos-sheet" style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 16, padding: 24, width: '100%', maxWidth: 440 }}>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 18 }}>{tc(NS + 'modal_title')}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>{tc(NS + 'label_guest_name')}</label>
                <input value={form.customer_name} onChange={e => setForm(f => ({ ...f, customer_name: e.target.value }))}
                  placeholder={tc(NS + 'placeholder_guest_name')} style={inp} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>{tc(NS + 'label_phone')}</label>
                  <input value={form.customer_phone} onChange={e => setForm(f => ({ ...f, customer_phone: e.target.value }))}
                    placeholder={tc(NS + 'placeholder_phone')} style={inp} />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>{tc(NS + 'label_covers')}</label>
                  <input type="number" min="1" max="40" value={form.covers} onChange={e => setForm(f => ({ ...f, covers: e.target.value }))} style={inp} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>{tc(NS + 'label_date_time')}</label>
                <input type="datetime-local" value={form.reserved_at} onChange={e => setForm(f => ({ ...f, reserved_at: e.target.value }))} style={inp} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>{tc(NS + 'label_duration')}</label>
                  <select value={form.duration_mins} onChange={e => setForm(f => ({ ...f, duration_mins: e.target.value }))} style={inp}>
                    {[60, 75, 90, 105, 120, 150, 180].map(m => <option key={m} value={m}>{tc(NS + 'duration_option', { mins: m })}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>{tc(NS + 'label_table')}</label>
                  <select value={form.table_id} onChange={e => setForm(f => ({ ...f, table_id: e.target.value }))} style={inp}>
                    <option value="">{tc(NS + 'table_any')}</option>
                    {tables.map(t => (
                      <option key={t.id} value={t.id}>{tc(NS + 'table_option', { name: t.name, section: t.section, capacity: t.capacity })}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>{tc(NS + 'label_notes')}</label>
                <input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  placeholder={tc(NS + 'placeholder_notes')} style={inp} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
              <button onClick={() => setShowAdd(false)}
                style={{ flex: 1, background: '#334155', border: 'none', color: '#94a3b8', padding: '11px', borderRadius: 8, cursor: 'pointer' }}>
                {tc(NS + 'cancel')}
              </button>
              <button onClick={createReservation} disabled={saving || !form.customer_name || !form.reserved_at}
                className="pos-btn-primary"
                style={{ flex: 2, background: '#22c55e', border: 'none', color: '#fff', padding: '11px', borderRadius: 8, cursor: 'pointer', fontWeight: 700, opacity: (!form.customer_name || !form.reserved_at) ? 0.5 : 1 }}>
                {saving ? tc(NS + 'saving') : tc(NS + 'confirm_booking')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
