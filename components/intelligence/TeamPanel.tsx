'use client'
import { useEffect, useState, useRef } from 'react'
import { useLang } from '@/components/LanguageProvider'
import type { CallerRole } from '@/lib/team-auth'

interface TeamMember {
  id: string
  email: string
  name: string
  role: string
  status: 'pending' | 'active' | 'removed'
  invited_at: string
  invite_token?: string | null
}

/* ─── Role system ─── */

const ROLE_META: Record<string, { color: string; bg: string; label: string; short: string }> = {
  owner:      { color: '#d08a59', bg: 'rgba(208,138,89,.1)',  label: 'Owner',      short: 'Full control' },
  admin:      { color: '#7c3aed', bg: 'rgba(124,58,237,.08)', label: 'Admin',      short: 'Full + can invite' },
  analyst:    { color: '#0284c7', bg: 'rgba(2,132,199,.08)',  label: 'Analyst',    short: 'Read & write, view billing' },
  accountant: { color: '#059669', bg: 'rgba(5,150,105,.08)',  label: 'Accountant', short: 'Financial data & CFO reports' },
  buyer:      { color: '#b45309', bg: 'rgba(180,83,9,.08)',   label: 'Buyer',      short: 'Inventory & POS only' },
  viewer:     { color: '#5a5652', bg: 'rgba(90,86,82,.07)',   label: 'Viewer',     short: 'Read-only access' },
}

const ROLE_PERMS: Record<string, Record<string, 'full' | 'edit' | 'view' | 'none'>> = {
  owner:      { Dashboards: 'full', 'AI chat': 'full', 'Business tools': 'full', 'CFO reports': 'full', 'Data sources': 'full', POS: 'full', Team: 'full', Settings: 'full', Billing: 'full' },
  admin:      { Dashboards: 'full', 'AI chat': 'full', 'Business tools': 'full', 'CFO reports': 'full', 'Data sources': 'full', POS: 'full', Team: 'edit', Settings: 'edit', Billing: 'view' },
  analyst:    { Dashboards: 'full', 'AI chat': 'full', 'Business tools': 'full', 'CFO reports': 'view', 'Data sources': 'view', POS: 'view', Team: 'none', Settings: 'view', Billing: 'view' },
  accountant: { Dashboards: 'view', 'AI chat': 'edit', 'Business tools': 'none', 'CFO reports': 'full', 'Data sources': 'none', POS: 'none', Team: 'none', Settings: 'none', Billing: 'none' },
  buyer:      { Dashboards: 'view', 'AI chat': 'edit', 'Business tools': 'view', 'CFO reports': 'none', 'Data sources': 'none', POS: 'full', Team: 'none', Settings: 'none', Billing: 'none' },
  viewer:     { Dashboards: 'view', 'AI chat': 'view', 'Business tools': 'view', 'CFO reports': 'view', 'Data sources': 'none', POS: 'view', Team: 'none', Settings: 'none', Billing: 'none' },
}

const AREAS = ['Dashboards', 'AI chat', 'Business tools', 'CFO reports', 'Data sources', 'POS', 'Team', 'Settings', 'Billing']
const ROLES_ORDER = ['owner', 'admin', 'analyst', 'accountant', 'buyer', 'viewer']

const ROLE_ICONS: Record<string, string> = {
  owner: 'M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z',
  admin: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
  analyst: 'M3 3v18h18M9 17V9M13 17v-5M17 17V5',
  accountant: 'M9 7H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M9 7h6M12 12v4M10 14h4',
  buyer: 'M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM1 3h22M1 21h22',
  viewer: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 0 1 0 6 3 3 0 0 1 0-6z',
}

const LEVEL_STYLES = {
  full: { label: 'Full',  bg: 'rgba(5,150,105,.1)',   fg: '#047857' },
  edit: { label: 'Edit',  bg: 'rgba(2,132,199,.1)',   fg: '#0369a1' },
  view: { label: 'View',  bg: 'rgba(90,86,82,.08)',   fg: '#5a5652' },
  none: { label: '—',     bg: 'transparent',          fg: '#a39e97' },
}

function getInitials(name: string, email: string) {
  const src = name?.trim() || email || ''
  const parts = src.split(/[\s@]+/).filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return src.slice(0, 2).toUpperCase()
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function RoleIcon({ role, size = 16 }: { role: string; size?: number }) {
  const d = ROLE_ICONS[role] || ROLE_ICONS.viewer
  const isPolyline = role === 'analyst'
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      {isPolyline ? (
        <>
          <polyline points="3 3 3 21 21 21"/>
          <polyline points="9 17 9 9"/>
          <polyline points="13 17 13 12"/>
          <polyline points="17 17 17 5"/>
        </>
      ) : (
        <path d={d}/>
      )}
    </svg>
  )
}

/* ─── Main component ─── */

export default function TeamPanel() {
  const { tc } = useLang()
  const [members, setMembers] = useState<TeamMember[]>([])
  const [callerRole, setCallerRole] = useState<CallerRole>('owner')
  const [loading, setLoading] = useState(true)
  const [inviting, setInviting] = useState(false)
  const [resendingId, setResendingId] = useState<string | null>(null)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [form, setForm] = useState({ email: '', role: 'analyst', name: '' })
  const [toast, setToast] = useState<{ msg: string; type: 'ok' | 'err' } | null>(null)
  const [toastLeaving, setToastLeaving] = useState(false)
  const [expandedRole, setExpandedRole] = useState<string | null>(null)
  const [showCompare, setShowCompare] = useState(false)
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const toastExitTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const canManage = callerRole === 'owner' || callerRole === 'admin'

  useEffect(() => {
    Promise.all([
      fetch('/api/team').then(r => r.json()),
      fetch('/api/me/role').then(r => r.json()),
    ]).then(([td, rd]) => {
      setMembers(td.members || [])
      if (rd.role) setCallerRole(rd.role)
    }).finally(() => setLoading(false))
  }, [])

  useEffect(() => () => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    if (toastExitTimer.current) clearTimeout(toastExitTimer.current)
  }, [])

  function showToast(msg: string, type: 'ok' | 'err' = 'ok') {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    if (toastExitTimer.current) clearTimeout(toastExitTimer.current)
    setToastLeaving(false)
    setToast({ msg, type })
    toastTimer.current = setTimeout(() => {
      setToastLeaving(true)
      toastExitTimer.current = setTimeout(() => setToast(null), 200)
    }, 4000)
  }

  async function invite() {
    if (!form.email || inviting) return
    setInviting(true)
    try {
      const res = await fetch('/api/team', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.member) {
        setMembers(m => [data.member, ...m])
        setForm({ email: '', role: 'analyst', name: '' })
        emailRef.current?.focus()
        showToast(data.emailSent ? `Invite sent to ${form.email}` : `Link copied — share it with ${form.email}`)
        if (!data.emailSent) navigator.clipboard?.writeText(data.acceptUrl).catch(() => {})
      } else {
        showToast(data.error || 'Could not send invite', 'err')
      }
    } finally { setInviting(false) }
  }

  async function resendInvite(m: TeamMember) {
    setResendingId(m.id)
    try {
      const res = await fetch('/api/team', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: m.email, role: m.role, name: m.name }),
      })
      const data = await res.json()
      if (data.member) {
        setMembers(prev => prev.map(x => x.id === m.id ? data.member : x))
        showToast(data.emailSent ? `Resent to ${m.email}` : 'Link copied')
        if (!data.emailSent) navigator.clipboard?.writeText(data.acceptUrl).catch(() => {})
      } else {
        showToast(data.error || 'Failed to resend', 'err')
      }
    } finally { setResendingId(null) }
  }

  async function changeRole(id: string, newRole: string) {
    setEditingRoleId(null)
    const res = await fetch('/api/team', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, role: newRole }),
    })
    const data = await res.json()
    if (data.member) {
      setMembers(m => m.map(x => x.id === id ? data.member : x))
      showToast('Role updated')
    } else {
      showToast(data.error || 'Failed to update', 'err')
    }
  }

  async function removeMember(id: string) {
    setRemovingId(id)
    try {
      const res = await fetch('/api/team', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'removed' }),
      })
      const data = await res.json()
      if (data.member) {
        setMembers(m => m.filter(x => x.id !== id))
        showToast('Member removed')
      } else {
        showToast(data.error || 'Failed to remove', 'err')
      }
    } finally { setRemovingId(null) }
  }

  const active  = members.filter(m => m.status === 'active')
  const pending = members.filter(m => m.status === 'pending')

  return (
    <div style={{ maxWidth: 720 }}>

      {/* Toast */}
      {toast && (
        <div className="toast-enter" style={{
          position: 'fixed', top: 20, right: 20, zIndex: 9999,
          padding: '10px 16px', borderRadius: 'var(--r-md)', fontSize: 13,
          fontFamily: 'var(--font-dm), sans-serif', fontWeight: 500,
          background: toast.type === 'err' ? 'rgba(220,38,38,.08)' : 'rgba(5,150,105,.08)',
          border: `1px solid ${toast.type === 'err' ? 'rgba(220,38,38,.2)' : 'rgba(5,150,105,.2)'}`,
          color: toast.type === 'err' ? '#b91c1c' : '#047857',
          maxWidth: 320,
          opacity: toastLeaving ? 0 : 1,
          transform: toastLeaving ? 'translateX(8px)' : 'translateX(0)',
          transition: 'opacity 200ms var(--ease-out), transform 200ms var(--ease-out)',
          animation: toastLeaving ? 'none' : undefined,
        }}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 6 }}>
          <h2 style={{ fontFamily: 'var(--font-sora), system-ui', fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--tx)', margin: 0 }}>
            Your Team
          </h2>
          {callerRole !== 'owner' && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px',
              borderRadius: 'var(--r-pill, 9999px)', border: `1px solid ${ROLE_META[callerRole]?.color || '#888'}30`,
              background: ROLE_META[callerRole]?.bg || 'var(--ev)',
              fontSize: 12, fontWeight: 600, color: ROLE_META[callerRole]?.color,
              fontFamily: 'var(--font-dm), sans-serif', flexShrink: 0,
            }}>
              <RoleIcon role={callerRole} size={13} />
              {ROLE_META[callerRole]?.label}
            </span>
          )}
        </div>
        <p style={{ fontSize: 13, color: 'var(--tx3)', lineHeight: 1.55, margin: 0, maxWidth: 480 }}>
          Give your accountant, ops manager, or buyer their own view — filtered to what they need.
        </p>
      </div>

      {/* Roles section */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--tx)', fontFamily: 'var(--font-dm), sans-serif' }}>
            Roles
          </span>
          <button
            onClick={() => { setShowCompare(v => !v); setExpandedRole(null) }}
            style={{
              padding: '5px 12px', borderRadius: 'var(--r-pill, 9999px)',
              border: '1px solid var(--b2)', background: showCompare ? 'var(--ev)' : 'transparent',
              color: 'var(--tx2)', fontSize: 12, fontWeight: 500, cursor: 'pointer',
              fontFamily: 'var(--font-dm), sans-serif', transition: 'background 150ms',
            }}>
            {showCompare ? 'Back to roles' : 'Compare all roles'}
          </button>
        </div>

        {showCompare ? (
          /* Compare table */
          <div style={{ borderRadius: 'var(--r-lg)', border: '1px solid var(--b)', overflow: 'hidden', marginBottom: 0 }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
                <thead>
                  <tr style={{ background: 'var(--ev)' }}>
                    <th style={{ textAlign: 'left', padding: '10px 14px', fontSize: 12, fontWeight: 600, color: 'var(--tx2)', borderBottom: '1px solid var(--b)', whiteSpace: 'nowrap', fontFamily: 'var(--font-dm), sans-serif' }}>
                      Area
                    </th>
                    {ROLES_ORDER.map(r => {
                      const m = ROLE_META[r]
                      return (
                        <th key={r} style={{ textAlign: 'center', padding: '10px 8px', fontSize: 11, fontWeight: 700, color: m.color, borderBottom: '1px solid var(--b)', whiteSpace: 'nowrap', fontFamily: 'var(--font-dm), sans-serif' }}>
                          {m.label}
                        </th>
                      )
                    })}
                  </tr>
                </thead>
                <tbody>
                  {AREAS.map((area, i) => (
                    <tr key={area} style={{ background: i % 2 === 1 ? 'var(--ev)' : 'transparent' }}>
                      <td style={{ padding: '8px 14px', fontSize: 12, color: 'var(--tx2)', borderBottom: '1px solid var(--b)', fontFamily: 'var(--font-dm), sans-serif', fontWeight: 500 }}>
                        {area}
                      </td>
                      {ROLES_ORDER.map(r => {
                        const lvl = ROLE_PERMS[r]?.[area] || 'none'
                        const s = LEVEL_STYLES[lvl]
                        return (
                          <td key={r} style={{ textAlign: 'center', padding: '8px 4px', borderBottom: '1px solid var(--b)' }}>
                            <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 'var(--r-pill, 9999px)', background: s.bg, color: s.fg, fontSize: 10, fontWeight: 600, fontFamily: 'var(--font-dm), sans-serif' }}>
                              {s.label}
                            </span>
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <>
            {/* Role cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {ROLES_ORDER.map(key => {
                const meta = ROLE_META[key]
                const isExpanded = expandedRole === key
                return (
                  <button
                    key={key}
                    onClick={() => setExpandedRole(isExpanded ? null : key)}
                    style={{
                      padding: '14px 14px 12px',
                      borderRadius: 'var(--r-md)',
                      border: `1px solid ${isExpanded ? `${meta.color}35` : 'var(--b)'}`,
                      background: isExpanded ? meta.bg : 'var(--sf)',
                      cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
                      transition: 'border-color 150ms, background 150ms',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <div style={{
                        width: 30, height: 30, borderRadius: 'var(--r-sm)',
                        background: meta.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: meta.color,
                      }}>
                        <RoleIcon role={key} size={15} />
                      </div>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--tx3)" strokeWidth="2" strokeLinecap="round"
                        style={{ transform: isExpanded ? 'rotate(180deg)' : undefined, transition: 'transform 200ms var(--ease)' }}>
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: isExpanded ? meta.color : 'var(--tx)', marginBottom: 3, fontFamily: 'var(--font-dm), sans-serif' }}>
                      {meta.label}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--tx3)', lineHeight: 1.4, fontFamily: 'var(--font-dm), sans-serif' }}>
                      {meta.short}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Expanded detail */}
            {expandedRole && (() => {
              const meta = ROLE_META[expandedRole]
              const perms = ROLE_PERMS[expandedRole] || {}
              return (
                <div style={{
                  marginTop: 8, padding: '18px 20px', borderRadius: 'var(--r-md)',
                  border: `1px solid ${meta.color}20`, background: meta.bg,
                  animation: 'fadeUp .2s var(--ease) both',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 'var(--r-sm)', background: 'var(--sf)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: meta.color, border: `1px solid ${meta.color}20` }}>
                      <RoleIcon role={expandedRole} size={17} />
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: meta.color, fontFamily: 'var(--font-dm), sans-serif' }}>{meta.label}</div>
                      <div style={{ fontSize: 12, color: 'var(--tx3)', fontFamily: 'var(--font-dm), sans-serif' }}>{meta.short}</div>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
                    {AREAS.map(area => {
                      const lvl = perms[area] || 'none'
                      const s = LEVEL_STYLES[lvl]
                      return (
                        <div key={area} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 10px', borderRadius: 'var(--r-sm)', background: 'var(--sf)', border: '1px solid var(--b)' }}>
                          <span style={{ fontSize: 11, color: 'var(--tx2)', fontFamily: 'var(--font-dm), sans-serif' }}>{area}</span>
                          <span style={{ padding: '1px 6px', borderRadius: 'var(--r-pill, 9999px)', background: s.bg, color: s.fg, fontSize: 10, fontWeight: 600, fontFamily: 'var(--font-dm), sans-serif', marginLeft: 6, flexShrink: 0 }}>
                            {s.label}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })()}
          </>
        )}
      </div>

      {/* Invite form — owner/admin only */}
      {canManage && (
        <div style={{
          padding: '18px 20px', borderRadius: 'var(--r-lg)',
          border: '1px solid var(--b)', background: 'var(--sf)', marginBottom: 28,
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--tx)', fontFamily: 'var(--font-dm), sans-serif', marginBottom: 14 }}>
            Invite a team member
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
            <input
              ref={emailRef}
              type="email"
              placeholder="their@email.com"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && invite()}
              style={{
                padding: '9px 12px', borderRadius: 'var(--r-md)', border: '1px solid var(--b2)',
                background: 'var(--ev)', fontSize: 13, fontFamily: 'var(--font-dm), sans-serif',
                color: 'var(--tx)', width: '100%', boxSizing: 'border-box',
              }}
            />
            <input
              type="text"
              placeholder="Name (optional)"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              style={{
                padding: '9px 12px', borderRadius: 'var(--r-md)', border: '1px solid var(--b2)',
                background: 'var(--ev)', fontSize: 13, fontFamily: 'var(--font-dm), sans-serif',
                color: 'var(--tx)', width: '100%', boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <select
              value={form.role}
              onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
              style={{
                flex: 1, padding: '9px 12px', borderRadius: 'var(--r-md)', border: '1px solid var(--b2)',
                background: 'var(--ev)', fontSize: 13, fontFamily: 'var(--font-dm), sans-serif',
                color: 'var(--tx)',
              }}>
              {ROLES_ORDER
                .filter(r => r !== 'owner' && !(callerRole === 'admin' && r === 'admin'))
                .map(r => (
                  <option key={r} value={r}>{ROLE_META[r].label} — {ROLE_META[r].short}</option>
                ))}
            </select>
            <button
              onClick={invite}
              disabled={!form.email || inviting}
              style={{
                padding: '9px 20px', borderRadius: 'var(--r-md)', border: 'none',
                background: form.email && !inviting ? 'var(--acc)' : 'var(--ev)',
                color: form.email && !inviting ? '#fff' : 'var(--tx3)',
                fontSize: 13, fontWeight: 600, cursor: form.email && !inviting ? 'pointer' : 'not-allowed',
                fontFamily: 'var(--font-dm), sans-serif', whiteSpace: 'nowrap',
                transition: 'background 150ms, color 150ms',
              }}>
              {inviting ? 'Sending…' : 'Send invite'}
            </button>
          </div>
        </div>
      )}

      {/* Member list */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[1, 2, 3].map(i => (
            <div key={i} className="skeleton" style={{ height: 60, borderRadius: 'var(--r-md)' }} />
          ))}
        </div>
      ) : members.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 24px', borderRadius: 'var(--r-lg)', border: '1px dashed var(--b2)' }}>
          <div style={{ width: 44, height: 44, borderRadius: 'var(--r-md)', background: 'var(--ev)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', color: 'var(--tx3)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--tx)', marginBottom: 5, fontFamily: 'var(--font-dm), sans-serif' }}>
            No team members yet
          </div>
          <div style={{ fontSize: 13, color: 'var(--tx3)', fontFamily: 'var(--font-dm), sans-serif', lineHeight: 1.5 }}>
            {canManage
              ? 'Invite your accountant, ops manager, or co-founder above.'
              : 'Ask your account owner to invite you.'}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Active members */}
          {active.length > 0 && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8, fontFamily: 'var(--font-dm), sans-serif' }}>
                Active · {active.length}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {active.map((m, i) => {
                  const meta = ROLE_META[m.role] || ROLE_META.viewer
                  const isEditing = editingRoleId === m.id
                  return (
                    <div key={m.id} className="animate-fade-up"
                      style={{
                        animationDelay: `${i * 0.04}s`,
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '11px 14px', borderRadius: 'var(--r-md)',
                        border: '1px solid var(--b)', background: 'var(--sf)',
                      }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                        background: meta.bg, display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: 12, fontWeight: 700,
                        color: meta.color, fontFamily: 'var(--font-dm), sans-serif',
                      }}>
                        {getInitials(m.name, m.email)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--tx)', fontFamily: 'var(--font-dm), sans-serif', marginBottom: 2 }}>
                          {m.name || m.email.split('@')[0]}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--tx3)', fontFamily: 'var(--font-dm), sans-serif' }}>
                          {m.email}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                        {canManage && isEditing ? (
                          <select
                            autoFocus
                            defaultValue={m.role}
                            onChange={e => changeRole(m.id, e.target.value)}
                            onBlur={() => setEditingRoleId(null)}
                            style={{
                              padding: '4px 8px', borderRadius: 'var(--r-sm)', border: `1px solid ${meta.color}30`,
                              background: meta.bg, fontSize: 11, fontFamily: 'var(--font-dm), sans-serif',
                              color: meta.color, fontWeight: 600, cursor: 'pointer',
                            }}>
                            {ROLES_ORDER
                              .filter(r => r !== 'owner' && !(callerRole === 'admin' && r === 'admin'))
                              .map(r => (
                                <option key={r} value={r}>{ROLE_META[r].label}</option>
                              ))}
                          </select>
                        ) : (
                          <button
                            onClick={() => canManage && setEditingRoleId(m.id)}
                            title={canManage ? 'Click to change role' : undefined}
                            style={{
                              padding: '3px 10px', borderRadius: 'var(--r-pill, 9999px)',
                              border: `1px solid ${meta.color}25`, background: meta.bg,
                              color: meta.color, fontSize: 11, fontWeight: 600,
                              cursor: canManage ? 'pointer' : 'default',
                              fontFamily: 'var(--font-dm), sans-serif',
                              display: 'flex', alignItems: 'center', gap: 4,
                            }}>
                            <RoleIcon role={m.role} size={11} />
                            {meta.label}
                          </button>
                        )}
                        {canManage && (
                          <button
                            onClick={() => removeMember(m.id)}
                            disabled={removingId === m.id}
                            style={{
                              padding: '4px 10px', borderRadius: 'var(--r-sm)',
                              border: '1px solid var(--b)', background: 'transparent',
                              fontSize: 11, color: 'var(--tx3)', cursor: 'pointer',
                              fontFamily: 'var(--font-dm), sans-serif', transition: 'color 120ms',
                            }}>
                            {removingId === m.id ? '…' : 'Remove'}
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Pending */}
          {pending.length > 0 && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8, fontFamily: 'var(--font-dm), sans-serif' }}>
                Awaiting acceptance · {pending.length}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {pending.map((m, i) => {
                  const meta = ROLE_META[m.role] || ROLE_META.viewer
                  return (
                    <div key={m.id} className="animate-fade-up"
                      style={{
                        animationDelay: `${i * 0.04}s`,
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '11px 14px', borderRadius: 'var(--r-md)',
                        border: '1px solid var(--b)', background: 'var(--sf)',
                      }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                        background: 'var(--ev)', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: 12, fontWeight: 700,
                        color: 'var(--tx3)', fontFamily: 'var(--font-dm), sans-serif',
                      }}>
                        {getInitials(m.name, m.email)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 2 }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--tx)', fontFamily: 'var(--font-dm), sans-serif' }}>
                            {m.name || m.email.split('@')[0]}
                          </span>
                          <span style={{ fontSize: 10, fontWeight: 600, padding: '1px 7px', borderRadius: 'var(--r-pill, 9999px)', background: 'rgba(180,83,9,.08)', color: '#b45309', fontFamily: 'var(--font-dm), sans-serif' }}>
                            Pending
                          </span>
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--tx3)', fontFamily: 'var(--font-dm), sans-serif' }}>
                          {m.email} · Invited {fmtDate(m.invited_at)}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                        <span style={{ padding: '3px 10px', borderRadius: 'var(--r-pill, 9999px)', border: `1px solid ${meta.color}25`, background: meta.bg, color: meta.color, fontSize: 11, fontWeight: 600, fontFamily: 'var(--font-dm), sans-serif', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          <RoleIcon role={m.role} size={11} />
                          {meta.label}
                        </span>
                        {canManage && (
                          <>
                            <button
                              onClick={() => resendInvite(m)}
                              disabled={resendingId === m.id}
                              style={{
                                padding: '4px 10px', borderRadius: 'var(--r-sm)',
                                border: '1px solid var(--b2)', background: 'transparent',
                                fontSize: 11, color: 'var(--tx2)', cursor: 'pointer',
                                fontFamily: 'var(--font-dm), sans-serif',
                              }}>
                              {resendingId === m.id ? '…' : 'Resend'}
                            </button>
                            <button
                              onClick={() => removeMember(m.id)}
                              disabled={removingId === m.id}
                              style={{
                                padding: '4px 10px', borderRadius: 'var(--r-sm)',
                                border: '1px solid var(--b)', background: 'transparent',
                                fontSize: 11, color: 'var(--tx3)', cursor: 'pointer',
                                fontFamily: 'var(--font-dm), sans-serif',
                              }}>
                              {removingId === m.id ? '…' : 'Cancel'}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  )
}
