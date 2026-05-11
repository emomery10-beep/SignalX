'use client'
import { useState, useEffect, useRef, useCallback } from 'react'

interface Notification {
  id: string
  type: 'alert' | 'shipment' | 'insight' | 'brief' | 'system'
  title: string
  body: string
  metadata: Record<string, unknown>
  read_at: string | null
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
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications')
      if (res.ok) setNotifications(await res.json())
    } catch {}
  }, [])

  useEffect(() => {
    fetchNotifications()
    const t = setInterval(fetchNotifications, 60_000)
    return () => clearInterval(t)
  }, [fetchNotifications])

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const unread = notifications.filter(n => !n.read_at).length

  const markAll = async () => {
    await fetch('/api/notifications', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) })
    setNotifications(ns => ns.map(n => ({ ...n, read_at: n.read_at || new Date().toISOString() })))
  }

  const markOne = async (id: string) => {
    await fetch('/api/notifications', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    setNotifications(ns => ns.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n))
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
          color: unread > 0 ? '#d08a59' : 'var(--tx3)',
          cursor: 'pointer', display: 'flex', alignItems: 'center',
          justifyContent: 'center', position: 'relative',
          transition: 'color 150ms',
        }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        {unread > 0 && (
          <span style={{
            position: 'absolute', top: -4, right: -4,
            minWidth: 14, height: 14, borderRadius: 9999,
            background: '#ef4444', color: '#fff',
            fontSize: 8, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '0 3px', border: '1.5px solid var(--sf)',
          }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute', top: 34, right: 0, zIndex: 200,
          width: 320, maxHeight: 440,
          background: 'var(--sf)', border: '1px solid var(--b)',
          borderRadius: 14, boxShadow: '0 8px 32px rgba(0,0,0,.15)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{ padding: '12px 14px 10px', borderBottom: '1px solid var(--b)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)' }}>Notifications {unread > 0 && <span style={{ color: '#d08a59' }}>({unread})</span>}</span>
            {unread > 0 && (
              <button onClick={markAll} style={{ fontSize: 11, color: '#6366F1', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
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
                    padding: '11px 14px',
                    borderBottom: '1px solid var(--b)',
                    cursor: 'pointer',
                    background: n.read_at ? 'transparent' : 'rgba(208,138,89,.04)',
                    display: 'flex', gap: 10, alignItems: 'flex-start',
                    transition: 'background 120ms',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--ev)'}
                  onMouseLeave={e => e.currentTarget.style.background = n.read_at ? 'transparent' : 'rgba(208,138,89,.04)'}
                >
                  {/* Icon */}
                  <div style={{
                    width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                    background: TYPE_COLOR[n.type] + '18',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={TYPE_COLOR[n.type]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d={TYPE_ICON[n.type] || TYPE_ICON.system}/>
                    </svg>
                  </div>
                  {/* Content */}
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
        </div>
      )}
    </div>
  )
}
