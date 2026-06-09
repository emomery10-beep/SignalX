'use client'
import { useState, useEffect, useRef, useCallback } from 'react'

/* ── Notification (from /api/notifications) ── */
interface Notification {
  id: string
  type: 'alert' | 'shipment' | 'insight' | 'brief' | 'system'
  title: string
  body: string
  metadata: Record<string, unknown>
  read_at: string | null
  created_at: string
}

/* ── Signal (from /api/signals — previously Business Pulse) ── */
interface Signal {
  id: string
  title: string
  description: string
  severity: 'red' | 'yellow' | 'blue'
  suggested_action: string
  prompt: string
  product?: string
  metric?: string
  created_at: string
}

const TYPE_ICON: Record<string, string> = {
  alert:    'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0',
  shipment: 'M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z M16 3H8a2 2 0 00-2 2v2h12V5a2 2 0 00-2-2z',
  insight:  'M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5',
  brief:    'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6',
  system:   'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
}

const TYPE_COLOR: Record<string, string> = {
  alert:    '#ef4444',
  shipment: '#3b82f6',
  insight:  '#d08a59',
  brief:    '#8b5cf6',
  system:   '#6b7280',
}

const SEV_COLOR: Record<string, string> = { red: '#ef4444', yellow: '#f59e0b', blue: '#6366f1' }
const SEV_BG: Record<string, string>    = { red: 'rgba(239,68,68,.06)', yellow: 'rgba(245,158,11,.06)', blue: 'rgba(99,102,241,.06)' }

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [signals, setSignals] = useState<Signal[]>([])
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set()
    try { const raw = localStorage.getItem('bp_dismissed'); return raw ? new Set(JSON.parse(raw) as string[]) : new Set() } catch { return new Set() }
  })
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<'notifications' | 'pulse'>('pulse')
  const ref = useRef<HTMLDivElement>(null)

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications')
      if (res.ok) setNotifications(await res.json())
    } catch {}
  }, [])

  const fetchSignals = useCallback(async () => {
    try {
      const res = await fetch('/api/signals')
      if (res.ok) {
        const data = await res.json()
        setSignals(data.signals || [])
      }
    } catch {}
  }, [])

  useEffect(() => {
    fetchNotifications()
    fetchSignals()
    const t1 = setInterval(fetchNotifications, 60_000)
    const t2 = setInterval(fetchSignals, 5 * 60_000)
    return () => { clearInterval(t1); clearInterval(t2) }
  }, [fetchNotifications, fetchSignals])

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const unread = notifications.filter(n => !n.read_at).length
  const visibleSignals = signals.filter(s => !dismissedIds.has(s.id))
  const redSignals = visibleSignals.filter(s => s.severity === 'red').length
  const totalBadge = unread + visibleSignals.length

  const markAll = async () => {
    await fetch('/api/notifications', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) })
    setNotifications(ns => ns.map(n => ({ ...n, read_at: n.read_at || new Date().toISOString() })))
  }

  const markOne = async (id: string) => {
    await fetch('/api/notifications', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    setNotifications(ns => ns.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n))
  }

  const dismissSignal = (id: string) => {
    setDismissedIds(prev => {
      const next = new Set([...prev, id])
      try { localStorage.setItem('bp_dismissed', JSON.stringify([...next])) } catch {}
      return next
    })
  }

  const handleSignalAction = (prompt: string) => {
    setOpen(false)
    window.dispatchEvent(new CustomEvent('askbiz:send', { detail: prompt }))
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {/* Bell button */}
      <button
        onClick={() => setOpen(v => !v)}
        title="Notifications"
        style={{
          width: 27, height: 27, borderRadius: 7,
          border: '1px solid var(--b2)', background: 'transparent',
          color: redSignals > 0 ? '#ef4444' : unread > 0 ? '#d08a59' : 'var(--tx3)',
          cursor: 'pointer', display: 'flex', alignItems: 'center',
          justifyContent: 'center', position: 'relative',
          transition: 'color 150ms',
        }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        {totalBadge > 0 && (
          <span style={{
            position: 'absolute', top: -4, right: -4,
            minWidth: 14, height: 14, borderRadius: 9999,
            background: redSignals > 0 ? '#ef4444' : '#d08a59', color: '#fff',
            fontSize: 8, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '0 3px', border: '1.5px solid var(--sf)',
            animation: redSignals > 0 ? 'pulse 1.5s infinite' : 'none',
          }}>
            {totalBadge > 9 ? '9+' : totalBadge}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute', top: -4, left: 36, zIndex: 200,
          width: 300, maxHeight: 420,
          background: 'var(--sf)', border: '1px solid var(--b)',
          borderRadius: 14, boxShadow: '0 8px 32px rgba(0,0,0,.15)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>
          {/* Tab switcher */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--b)', flexShrink: 0 }}>
            <button
              onClick={() => setTab('pulse')}
              style={{
                flex: 1, padding: '10px 0', fontSize: 12, fontWeight: tab === 'pulse' ? 700 : 500,
                color: tab === 'pulse' ? '#ef4444' : 'var(--tx3)',
                background: tab === 'pulse' ? 'rgba(239,68,68,.04)' : 'transparent',
                border: 'none', borderBottom: tab === 'pulse' ? '2px solid #ef4444' : '2px solid transparent',
                cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
              Pulse
              {visibleSignals.length > 0 && (
                <span style={{ fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 9999, background: redSignals > 0 ? '#ef4444' : '#f59e0b', color: '#fff' }}>
                  {visibleSignals.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setTab('notifications')}
              style={{
                flex: 1, padding: '10px 0', fontSize: 12, fontWeight: tab === 'notifications' ? 700 : 500,
                color: tab === 'notifications' ? '#d08a59' : 'var(--tx3)',
                background: tab === 'notifications' ? 'rgba(208,138,89,.04)' : 'transparent',
                border: 'none', borderBottom: tab === 'notifications' ? '2px solid #d08a59' : '2px solid transparent',
                cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              Notifications
              {unread > 0 && (
                <span style={{ fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 9999, background: '#d08a59', color: '#fff' }}>
                  {unread}
                </span>
              )}
            </button>
          </div>

          {/* ── PULSE TAB ── */}
          {tab === 'pulse' && (
            <div style={{ overflowY: 'auto', flex: 1 }}>
              {visibleSignals.length === 0 ? (
                <div style={{ padding: '32px 16px', textAlign: 'center' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(34,197,94,.1)', border: '1px solid rgba(34,197,94,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                  </div>
                  <div style={{ fontFamily: 'var(--font-sora)', fontSize: 13, fontWeight: 600, color: '#22c55e', marginBottom: 4 }}>All clear</div>
                  <p style={{ fontSize: 11, color: 'var(--tx3)', lineHeight: 1.5, margin: 0 }}>
                    No urgent actions needed. Upload fresh data to run a health check.
                  </p>
                </div>
              ) : (
                <div style={{ padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {visibleSignals.map(signal => {
                    const col = SEV_COLOR[signal.severity]
                    return (
                      <div key={signal.id} style={{
                        background: SEV_BG[signal.severity],
                        border: `1px solid ${col}30`,
                        borderRadius: 12, padding: '10px 12px',
                        position: 'relative',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 7, marginBottom: 5 }}>
                          <div style={{
                            width: 7, height: 7, borderRadius: '50%', background: col, flexShrink: 0, marginTop: 4,
                            animation: signal.severity === 'red' ? 'pulse 1.5s infinite' : 'none',
                          }} />
                          <div style={{ flex: 1, fontSize: 12, fontWeight: 600, color: 'var(--tx)', lineHeight: 1.4 }}>
                            {signal.title}
                          </div>
                          {signal.metric && (
                            <span style={{ fontSize: 9, fontWeight: 700, color: col, background: SEV_BG[signal.severity], border: `1px solid ${col}30`, borderRadius: 9999, padding: '1px 6px', flexShrink: 0, whiteSpace: 'nowrap' }}>
                              {signal.metric}
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: 11, color: 'var(--tx2)', lineHeight: 1.5, margin: '0 0 8px 14px' }}>
                          {signal.description}
                        </p>
                        <div style={{ display: 'flex', gap: 5, marginLeft: 14 }}>
                          <button
                            onClick={() => handleSignalAction(signal.prompt)}
                            style={{ fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 9999, border: 'none', background: col, color: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}
                          >
                            {signal.suggested_action} →
                          </button>
                          <button
                            onClick={() => dismissSignal(signal.id)}
                            style={{ fontSize: 11, padding: '4px 8px', borderRadius: 9999, border: '1px solid var(--b)', background: 'transparent', color: 'var(--tx3)', cursor: 'pointer', fontFamily: 'inherit' }}
                          >
                            Dismiss
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Refresh button */}
              <div style={{ padding: '8px 10px', borderTop: '1px solid var(--b)', flexShrink: 0 }}>
                <button
                  onClick={fetchSignals}
                  style={{ width: '100%', padding: '6px', borderRadius: 8, border: '1px solid var(--b)', background: 'transparent', fontSize: 11, color: 'var(--tx3)', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--ev)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                  </svg>
                  Run health check
                </button>
              </div>
            </div>
          )}

          {/* ── NOTIFICATIONS TAB ── */}
          {tab === 'notifications' && (
            <>
              {/* Header actions */}
              {unread > 0 && (
                <div style={{ padding: '8px 14px 4px', display: 'flex', justifyContent: 'flex-end', flexShrink: 0 }}>
                  <button onClick={markAll} style={{ fontSize: 11, color: '#6366F1', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>
                    Mark all read
                  </button>
                </div>
              )}

              <div style={{ overflowY: 'auto', flex: 1 }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: '32px 16px', textAlign: 'center' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--tx3)" strokeWidth="1.5" strokeLinecap="round" style={{ margin: '0 auto 8px', display: 'block' }}>
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0"/>
                    </svg>
                    <p style={{ margin: 0, fontSize: 12, color: 'var(--tx3)' }}>No notifications yet</p>
                  </div>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => markOne(n.id)}
                      style={{
                        padding: '10px 14px',
                        borderBottom: '1px solid var(--b)',
                        cursor: 'pointer',
                        background: n.read_at ? 'transparent' : 'rgba(208,138,89,.04)',
                        display: 'flex', gap: 10, alignItems: 'flex-start',
                        transition: 'background 120ms',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--ev)'}
                      onMouseLeave={e => e.currentTarget.style.background = n.read_at ? 'transparent' : 'rgba(208,138,89,.04)'}
                    >
                      <div style={{
                        width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                        background: TYPE_COLOR[n.type] + '18',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={TYPE_COLOR[n.type]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d={TYPE_ICON[n.type] || TYPE_ICON.system}/>
                        </svg>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                          <span style={{ fontSize: 12, fontWeight: n.read_at ? 500 : 700, color: 'var(--tx)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.title}</span>
                          {!n.read_at && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#d08a59', flexShrink: 0 }}/>}
                        </div>
                        <p style={{ margin: '0 0 3px', fontSize: 11, color: 'var(--tx2)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{n.body}</p>
                        <span style={{ fontSize: 10, color: 'var(--tx3)' }}>{timeAgo(n.created_at)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
