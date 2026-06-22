'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { usePosAuth } from '@/lib/hooks/usePosAuth'
import { useLang } from '@/components/LanguageProvider'

const ACC = '#d08a59'

const NS = 'restaurant_kitchen.'

const STATIONS = ['all', 'grill', 'fryer', 'cold', 'drinks', 'dessert']
const STATION_ICONS: Record<string, string> = {
  all: '🍽️', grill: '🔥', fryer: '🍟', cold: '🥗', drinks: '🍹', dessert: '🍮',
}

interface KTicket {
  id: string; order_id: string; station: string; status: string
  items_json: { id: string; name: string; qty: number; notes?: string }[]
  table_name: string; covers: number; server_name: string; order_type: string
  sent_at: string; started_at?: string; completed_at?: string; age_seconds: number
}

function ageColor(seconds: number, station: string): string {
  const urgent = station === 'grill' ? 720 : 900  // 12min grill, 15min others
  const warn    = urgent * 0.6
  if (seconds >= urgent) return '#ef4444'
  if (seconds >= warn)   return '#f59e0b'
  return '#22c55e'
}

function fmtAge(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return m > 0 ? `${m}m ${s}s` : `${s}s`
}

export default function KitchenDisplay() {
  const router  = useRouter()
  const { tc } = useLang()
  const { session, ready: authReady } = usePosAuth()
  const [station, setStation]   = useState('all')
  const [tickets, setTickets]   = useState<KTicket[]>([])
  const [loading, setLoading]   = useState(true)
  const [bumping, setBumping]   = useState<string | null>(null)
  const [showDone, setShowDone] = useState(false)
  const [, setTick]             = useState(0) // force re-render every second for age

  const load = useCallback(async () => {
    if (!session) return
    const res = await fetch(
      `/api/pos/restaurant/kitchen?station=${station}&include_done=${showDone}`,
      { headers: session.headers }
    )
    const data = await res.json()
    setTickets(data.tickets || [])
    setLoading(false)
  }, [station, showDone, session])

  useEffect(() => {
    if (!authReady || !session) return
    load()
    const poll = setInterval(load, 8000) // refresh every 8s
    return () => clearInterval(poll)
  }, [authReady, session, load])

  // Live age counter
  useEffect(() => {
    const ticker = setInterval(() => setTick(t => t + 1), 1000)
    return () => clearInterval(ticker)
  }, [])

  async function bumpTicket(id: string) {
    if (!session) return
    setBumping(id)
    await fetch('/api/pos/restaurant/kitchen', {
      method: 'PATCH', headers: { ...session.headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action: 'bump' }),
    })
    await load()
    setBumping(null)
  }

  async function startTicket(id: string) {
    if (!session) return
    await fetch('/api/pos/restaurant/kitchen', {
      method: 'PATCH', headers: { ...session.headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action: 'start' }),
    })
    await load()
  }

  async function recallTicket(id: string) {
    if (!session) return
    await fetch('/api/pos/restaurant/kitchen', {
      method: 'PATCH', headers: { ...session.headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action: 'recall' }),
    })
    await load()
  }

  const activeTickets = tickets.filter(t => t.status !== 'done')
  const doneTickets   = tickets.filter(t => t.status === 'done')

  // Live age (adds elapsed time since page load)
  function liveAge(t: KTicket): number {
    return Math.floor((Date.now() - new Date(t.sent_at).getTime()) / 1000)
  }

  return (
    <div className="pos-screen" style={{ minHeight: '100vh', background: '#0a0f1a', color: '#f1f5f9', fontFamily: 'system-ui, sans-serif' }}>
      {/* KDS Header */}
      <div style={{ background: '#0f172a', borderBottom: '2px solid #1e293b', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => router.push('/restaurant')} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 20 }}>←</button>
        <div style={{ fontSize: 18, fontWeight: 800, color: ACC }}>{tc(NS + 'header_title')}</div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ fontSize: 12, color: '#64748b' }}>
            {tc(NS + 'active_done_count', { active: activeTickets.length, done: doneTickets.length })}
          </div>
          <button onClick={() => setShowDone(p => !p)}
            style={{ background: showDone ? '#334155' : '#1e293b', border: '1px solid #334155', color: '#94a3b8', padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
            {showDone ? tc(NS + 'hide_done') : tc(NS + 'show_done')}
          </button>
        </div>
      </div>

      {/* Station Tabs */}
      <div style={{ background: '#0f172a', padding: '0 16px', display: 'flex', gap: 4, borderBottom: '1px solid #1e293b', overflowX: 'auto' }}>
        {STATIONS.map(s => {
          const count = tickets.filter(t => (s === 'all' || t.station === s) && t.status !== 'done').length
          return (
            <button key={s} onClick={() => setStation(s)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: station === s ? ACC : '#64748b',
                padding: '12px 16px', fontWeight: station === s ? 700 : 400,
                borderBottom: station === s ? `3px solid ${ACC}` : '3px solid transparent',
                fontSize: 14, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6,
              }}>
              {STATION_ICONS[s]} {tc(NS + 'station_' + s)}
              {count > 0 && <span style={{ background: '#ef4444', color: '#fff', borderRadius: 10, padding: '1px 6px', fontSize: 11 }}>{count}</span>}
            </button>
          )
        })}
      </div>

      {/* Ticket Grid */}
      <div style={{ padding: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, alignItems: 'start' }}>
        {loading && <div style={{ color: '#64748b', gridColumn: '1/-1', textAlign: 'center', padding: 40 }}>{tc(NS + 'loading')}</div>}

        {!loading && activeTickets.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 60 }}>
            <div className="pos-success-icon" style={{ fontSize: 48, marginBottom: 8 }}>✅</div>
            <div style={{ color: '#22c55e', fontWeight: 700, fontSize: 18 }}>{tc(NS + 'all_clear')}</div>
            <div style={{ color: '#64748b', fontSize: 14 }}>{tc(NS + 'no_pending')}</div>
          </div>
        )}

        {activeTickets.map((ticket, idx) => {
          const age = liveAge(ticket)
          const color = ageColor(age, ticket.station)
          const isInProgress = ticket.status === 'in_progress'
          return (
            <div key={ticket.id} className="pos-item" style={{
              background: '#0f172a',
              border: `2px solid ${color}`,
              borderRadius: 12,
              overflow: 'hidden',
              animationDelay: `${Math.min(idx, 8) * 40}ms`,
            }}>
              {/* Ticket Header */}
              <div style={{ background: color + '20', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 18, color: '#f1f5f9' }}>{ticket.table_name}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8' }}>
                    {(() => {
                      const coversLabel = tc(NS + (ticket.covers === 1 ? 'covers_one' : 'covers_other'), { count: ticket.covers })
                      const stationLabel = tc(NS + 'station_' + ticket.station)
                      return ticket.server_name
                        ? tc(NS + 'ticket_meta_server', { covers: coversLabel, icon: STATION_ICONS[ticket.station], station: stationLabel, server: ticket.server_name })
                        : tc(NS + 'ticket_meta', { covers: coversLabel, icon: STATION_ICONS[ticket.station], station: stationLabel })
                    })()}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color, fontVariantNumeric: 'tabular-nums' }}>{fmtAge(age)}</div>
                  <div style={{ fontSize: 10, color: '#64748b' }}>{isInProgress ? tc(NS + 'in_progress') : tc(NS + 'pending')}</div>
                </div>
              </div>

              {/* Items */}
              <div style={{ padding: '12px 14px' }}>
                {ticket.items_json.map((item, i) => (
                  <div key={i} style={{ padding: '6px 0', borderBottom: i < ticket.items_json.length - 1 ? '1px solid #1e293b' : 'none' }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <span style={{ background: '#1e293b', color: ACC, fontWeight: 800, fontSize: 16, borderRadius: 6, padding: '2px 8px', minWidth: 32, textAlign: 'center' }}>
                        {item.qty}
                      </span>
                      <span style={{ fontSize: 15, fontWeight: 600, color: '#e2e8f0' }}>{item.name}</span>
                    </div>
                    {item.notes && (
                      <div style={{ marginTop: 4, marginLeft: 42, fontSize: 12, color: '#f59e0b', fontStyle: 'italic' }}>
                        ✎ {item.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div style={{ padding: '10px 14px', display: 'flex', gap: 8 }}>
                {!isInProgress && (
                  <button onClick={() => startTicket(ticket.id)}
                    style={{ flex: 1, background: '#1e293b', border: '1px solid #334155', color: '#94a3b8', padding: '10px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
                    {tc(NS + 'start')}
                  </button>
                )}
                <button
                  className="pos-btn-primary"
                  onClick={() => bumpTicket(ticket.id)}
                  disabled={bumping === ticket.id}
                  style={{
                    flex: 1, background: color, border: 'none', color: '#fff',
                    padding: '10px', borderRadius: 8, cursor: bumping === ticket.id ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: 14,
                    opacity: bumping === ticket.id ? 0.5 : 1,
                  }}>
                  {bumping === ticket.id ? tc(NS + 'bumping') : tc(NS + 'bump')}
                </button>
              </div>
            </div>
          )
        })}

        {/* Done tickets (greyed out, recall available) */}
        {showDone && doneTickets.map((ticket, idx) => (
          <div key={ticket.id} className="pos-item" style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12, overflow: 'hidden', opacity: 0.5, animationDelay: `${Math.min(idx, 8) * 40}ms` }}>
            <div style={{ background: '#22c55e20', padding: '10px 14px', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#94a3b8' }}>{ticket.table_name}</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>{tc(NS + 'done_meta', { station: tc(NS + 'station_' + ticket.station), count: ticket.items_json.length })}</div>
              </div>
              <div style={{ fontSize: 12, color: '#22c55e', fontWeight: 700 }}>{tc(NS + 'done')}</div>
            </div>
            <div style={{ padding: '8px 14px' }}>
              {ticket.items_json.map((item, i) => (
                <div key={i} style={{ fontSize: 13, color: '#64748b', padding: '3px 0' }}>{item.qty}× {item.name}</div>
              ))}
            </div>
            <div style={{ padding: '8px 14px' }}>
              <button onClick={() => recallTicket(ticket.id)}
                style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', color: '#94a3b8', padding: '7px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
                {tc(NS + 'recall')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
