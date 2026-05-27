'use client'
import { useEffect, useState } from 'react'

interface TeamMember {
  id: string
  email: string
  name: string
  role: string
  status: 'pending' | 'active' | 'removed'
  invited_at: string
}

/* ───────── Role definitions ───────── */

interface PermissionBucket {
  area: string
  level: 'full' | 'edit' | 'view' | 'none'
}

interface RoleDetail {
  label: string
  color: string
  desc: string
  who: string
  emoji: string
  permissions: PermissionBucket[]
  cannotAccess: string[]
  useCases: string[]
}

const LEVEL_BADGE: Record<string, { label: string; bg: string; fg: string }> = {
  full:  { label: 'Full',    bg: 'rgba(34,197,94,.12)',  fg: '#16a34a' },
  edit:  { label: 'Edit',    bg: 'rgba(59,130,246,.12)', fg: '#2563eb' },
  view:  { label: 'View',    bg: 'rgba(168,162,158,.12)', fg: '#78716c' },
  none:  { label: 'None',    bg: 'rgba(239,68,68,.08)',  fg: '#dc2626' },
}

const ROLES: Record<string, RoleDetail> = {
  owner: {
    label: 'Owner',
    color: '#6366F1',
    desc: 'Full access to everything',
    who: 'The business owner or founder. One per organisation.',
    emoji: '👑',
    permissions: [
      { area: 'Dashboards & Reports', level: 'full' },
      { area: 'AI Chat & Questions', level: 'full' },
      { area: 'Business Tools', level: 'full' },
      { area: 'CFO Mode & Financials', level: 'full' },
      { area: 'Data Sources', level: 'full' },
      { area: 'Team Management', level: 'full' },
      { area: 'Billing & Subscription', level: 'full' },
      { area: 'POS & Inventory', level: 'full' },
      { area: 'Settings', level: 'full' },
    ],
    cannotAccess: [],
    useCases: [
      'Manages billing, team, and all settings',
      'Full control over data connections and integrations',
      'Can delete data, remove members, and cancel plans',
    ],
  },
  admin: {
    label: 'Admin',
    color: '#7c3aed',
    desc: 'Full access + can invite members',
    who: 'A trusted co-founder, operations manager, or senior partner.',
    emoji: '🛡️',
    permissions: [
      { area: 'Dashboards & Reports', level: 'full' },
      { area: 'AI Chat & Questions', level: 'full' },
      { area: 'Business Tools', level: 'full' },
      { area: 'CFO Mode & Financials', level: 'full' },
      { area: 'Data Sources', level: 'full' },
      { area: 'Team Management', level: 'edit' },
      { area: 'Billing & Subscription', level: 'view' },
      { area: 'POS & Inventory', level: 'full' },
      { area: 'Settings', level: 'edit' },
    ],
    cannotAccess: [
      'Cannot change billing or cancel subscription',
      'Cannot remove the Owner',
      'Cannot delete the organisation',
    ],
    useCases: [
      'Invites and manages team members',
      'Connects new data sources',
      'Full operational access to all intelligence tools',
    ],
  },
  analyst: {
    label: 'Analyst',
    color: '#0284c7',
    desc: 'Read and write, no billing',
    who: 'A data-savvy team member who runs reports and analyses trends.',
    emoji: '📊',
    permissions: [
      { area: 'Dashboards & Reports', level: 'full' },
      { area: 'AI Chat & Questions', level: 'full' },
      { area: 'Business Tools', level: 'full' },
      { area: 'CFO Mode & Financials', level: 'view' },
      { area: 'Data Sources', level: 'view' },
      { area: 'Team Management', level: 'none' },
      { area: 'Billing & Subscription', level: 'none' },
      { area: 'POS & Inventory', level: 'view' },
      { area: 'Settings', level: 'view' },
    ],
    cannotAccess: [
      'Cannot invite or remove team members',
      'Cannot access billing or subscription',
      'Cannot connect or disconnect data sources',
      'Cannot modify POS inventory or settings',
    ],
    useCases: [
      'Runs AI-powered analyses and saves reports',
      'Monitors dashboards, alerts, and anomalies',
      'Creates forecasts and expansion opportunity research',
    ],
  },
  accountant: {
    label: 'Accountant',
    color: '#16a34a',
    desc: 'Financial data and CFO reports only',
    who: 'Your external accountant, bookkeeper, or financial advisor.',
    emoji: '🧮',
    permissions: [
      { area: 'Dashboards & Reports', level: 'view' },
      { area: 'AI Chat & Questions', level: 'edit' },
      { area: 'Business Tools', level: 'none' },
      { area: 'CFO Mode & Financials', level: 'full' },
      { area: 'Data Sources', level: 'none' },
      { area: 'Team Management', level: 'none' },
      { area: 'Billing & Subscription', level: 'none' },
      { area: 'POS & Inventory', level: 'none' },
      { area: 'Settings', level: 'none' },
    ],
    cannotAccess: [
      'Cannot access non-financial dashboards or tools',
      'Cannot see POS transactions or inventory',
      'Cannot manage team, billing, data sources, or settings',
      'Cannot access supplier or expansion tools',
    ],
    useCases: [
      'Reviews P&L summaries and cash runway reports',
      'Runs CFO Mode reports for board preparation',
      'Asks financial questions about revenue, margins, and cash flow',
    ],
  },
  buyer: {
    label: 'Buyer',
    color: '#d97706',
    desc: 'Inventory and supply chain only',
    who: 'A purchasing manager, procurement lead, or stock controller.',
    emoji: '📦',
    permissions: [
      { area: 'Dashboards & Reports', level: 'view' },
      { area: 'AI Chat & Questions', level: 'edit' },
      { area: 'Business Tools', level: 'view' },
      { area: 'CFO Mode & Financials', level: 'none' },
      { area: 'Data Sources', level: 'none' },
      { area: 'Team Management', level: 'none' },
      { area: 'Billing & Subscription', level: 'none' },
      { area: 'POS & Inventory', level: 'full' },
      { area: 'Settings', level: 'none' },
    ],
    cannotAccess: [
      'Cannot access financial reports or CFO Mode',
      'Cannot manage team, billing, or settings',
      'Cannot connect or disconnect data sources',
      'Cannot view revenue or margin data',
    ],
    useCases: [
      'Manages inventory levels, reorder points, and stock alerts',
      'Uses Supplier Scorecard and Landed Cost tools',
      'Runs AI questions about stock, suppliers, and purchasing',
    ],
  },
  viewer: {
    label: 'Viewer',
    color: '#94a3b8',
    desc: 'Read-only access',
    who: 'An investor, advisor, or board member who needs visibility without editing.',
    emoji: '👁️',
    permissions: [
      { area: 'Dashboards & Reports', level: 'view' },
      { area: 'AI Chat & Questions', level: 'view' },
      { area: 'Business Tools', level: 'view' },
      { area: 'CFO Mode & Financials', level: 'view' },
      { area: 'Data Sources', level: 'none' },
      { area: 'Team Management', level: 'none' },
      { area: 'Billing & Subscription', level: 'none' },
      { area: 'POS & Inventory', level: 'view' },
      { area: 'Settings', level: 'none' },
    ],
    cannotAccess: [
      'Cannot create, edit, or delete anything',
      'Cannot ask AI questions (view saved answers only)',
      'Cannot access settings, billing, team, or data sources',
    ],
    useCases: [
      'Views dashboards and saved reports',
      'Monitors Business Pulse score and KPIs',
      'Reviews board-ready CFO summaries',
    ],
  },
}

/* ───────── Comparison view ───────── */

const PERMISSION_AREAS = [
  'Dashboards & Reports',
  'AI Chat & Questions',
  'Business Tools',
  'CFO Mode & Financials',
  'Data Sources',
  'Team Management',
  'Billing & Subscription',
  'POS & Inventory',
  'Settings',
]

const COMPARE_ROLES = ['owner', 'admin', 'analyst', 'accountant', 'buyer', 'viewer'] as const

/* ───────── Component ───────── */

export default function TeamPanel() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [inviting, setInviting] = useState(false)
  const [form, setForm] = useState({ email: '', role: 'analyst', name: '' })
  const [toast, setToast] = useState('')
  const [expandedRole, setExpandedRole] = useState<string | null>(null)
  const [showCompare, setShowCompare] = useState(false)

  useEffect(() => {
    fetch('/api/team').then(r => r.json()).then(d => setMembers(d.members || [])).finally(() => setLoading(false))
  }, [])

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 4000) }

  const invite = async () => {
    if (!form.email) return
    setInviting(true)
    try {
      const res = await fetch('/api/team', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await res.json()
      if (data.member) {
        setMembers(m => [...m, data.member])
        setForm({ email: '', role: 'analyst', name: '' })
        if (data.emailSent) {
          showToast(`Invitation email sent to ${form.email}`)
        } else {
          showToast(`Added — share this link: ${data.acceptUrl}`)
          navigator.clipboard?.writeText(data.acceptUrl).catch(() => {})
        }
      } else {
        showToast(data.error || 'Failed to invite')
      }
    } finally { setInviting(false) }
  }

  const removeOrUpdate = async (id: string, update: { role?: string; status?: string }) => {
    const res = await fetch('/api/team', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, ...update }) })
    const data = await res.json()
    if (data.member) setMembers(m => m.map(mem => mem.id === id ? data.member : mem))
  }

  return (
    <div>
      {toast && (
        <div className="toast-enter" style={{ position: 'fixed', top: 16, right: 16, zIndex: 999, padding: '10px 16px', borderRadius: 10, background: 'rgba(34,197,94,.12)', border: '1px solid rgba(34,197,94,.3)', color: '#16a34a', fontSize: 13, fontWeight: 500 }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: 20, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-sora)', fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Your Team</h2>
          <p style={{ fontSize: 13, color: 'var(--tx3)', lineHeight: 1.5 }}>
            Give your accountant, ops manager, or buyer their own view — filtered to what they need. Click a role to see detailed permissions.
          </p>
        </div>
        <button onClick={() => setShowCompare(v => !v)}
          style={{ padding: '6px 14px', borderRadius: 9999, border: '1px solid var(--b)', background: showCompare ? 'rgba(99,102,241,.08)' : 'transparent', color: showCompare ? '#6366F1' : 'var(--tx2)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
          {showCompare ? '← Back to roles' : '⬡ Compare all roles'}
        </button>
      </div>

      {/* ───── Comparison table view ───── */}
      {showCompare ? (
        <div style={{ overflowX: 'auto', marginBottom: 24 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, minWidth: 600 }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '8px 10px', borderBottom: '2px solid var(--b)', fontFamily: 'var(--font-sora)', fontWeight: 700, color: 'var(--tx)', fontSize: 12 }}>
                  Permission area
                </th>
                {COMPARE_ROLES.map(r => {
                  const role = ROLES[r]
                  return (
                    <th key={r} style={{ textAlign: 'center', padding: '8px 6px', borderBottom: '2px solid var(--b)', fontWeight: 700, color: role.color, fontSize: 11, whiteSpace: 'nowrap' }}>
                      {role.emoji} {role.label}
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {PERMISSION_AREAS.map((area, i) => (
                <tr key={area} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--ev)' }}>
                  <td style={{ padding: '7px 10px', borderBottom: '1px solid var(--b)', color: 'var(--tx2)', fontSize: 12, fontWeight: 500 }}>
                    {area}
                  </td>
                  {COMPARE_ROLES.map(r => {
                    const perm = ROLES[r].permissions.find(p => p.area === area)
                    const badge = perm ? LEVEL_BADGE[perm.level] : LEVEL_BADGE.none
                    return (
                      <td key={r} style={{ textAlign: 'center', padding: '7px 4px', borderBottom: '1px solid var(--b)' }}>
                        <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 9999, background: badge.bg, color: badge.fg, fontSize: 10, fontWeight: 600 }}>
                          {badge.label}
                        </span>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <>
          {/* ───── Role cards (clickable/expandable) ───── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8, marginBottom: 24 }}>
            {Object.entries(ROLES).map(([key, role]) => {
              const isExpanded = expandedRole === key
              return (
                <div key={key}>
                  <div
                    onClick={() => setExpandedRole(isExpanded ? null : key)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 10,
                      border: `1px solid ${isExpanded ? `${role.color}40` : 'var(--b)'}`,
                      background: isExpanded ? `${role.color}08` : 'var(--sf)',
                      cursor: 'pointer',
                      transition: 'all 150ms',
                    }}
                    onMouseEnter={e => { if (!isExpanded) { e.currentTarget.style.borderColor = `${role.color}30`; e.currentTarget.style.background = `${role.color}05` }}}
                    onMouseLeave={e => { if (!isExpanded) { e.currentTarget.style.borderColor = 'var(--b)'; e.currentTarget.style.background = 'var(--sf)' }}}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 14 }}>{role.emoji}</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: role.color }}>{role.label}</span>
                      </div>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={role.color} strokeWidth="2" strokeLinecap="round"
                        style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 150ms' }}>
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--tx3)', lineHeight: 1.4, marginTop: 3 }}>{role.desc}</div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* ───── Expanded role detail ───── */}
          {expandedRole && (() => {
            const role = ROLES[expandedRole]
            return (
              <div style={{ marginBottom: 24, padding: '20px', borderRadius: 14, border: `1px solid ${role.color}25`, background: `${role.color}04`, animation: 'fadeUp .2s ease' }}>
                {/* Role header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: `${role.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                    {role.emoji}
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-sora)', fontSize: 16, fontWeight: 700, color: role.color }}>{role.label}</div>
                    <div style={{ fontSize: 13, color: 'var(--tx2)', marginTop: 1 }}>{role.who}</div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                  {/* Permissions */}
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.04em' }}>Permissions</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {role.permissions.map(p => {
                        const badge = LEVEL_BADGE[p.level]
                        return (
                          <div key={p.area} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 8px', borderRadius: 8, background: 'var(--sf)', border: '1px solid var(--b)' }}>
                            <span style={{ fontSize: 12, color: 'var(--tx2)' }}>{p.area}</span>
                            <span style={{ padding: '1px 8px', borderRadius: 9999, background: badge.bg, color: badge.fg, fontSize: 10, fontWeight: 600 }}>
                              {badge.label}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Right column: use cases + cannot access */}
                  <div>
                    {/* Use cases */}
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.04em' }}>Best for</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                        {role.useCases.map((u, i) => (
                          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={role.color} strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 1 }}>
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            <span style={{ fontSize: 12, color: 'var(--tx2)', lineHeight: 1.4 }}>{u}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Cannot access */}
                    {role.cannotAccess.length > 0 && (
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#dc2626', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.04em' }}>Cannot access</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                          {role.cannotAccess.map((c, i) => (
                            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 1 }}>
                                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                              </svg>
                              <span style={{ fontSize: 12, color: 'var(--tx3)', lineHeight: 1.4 }}>{c}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })()}
        </>
      )}

      {/* ───── Invite form ───── */}
      <div style={{ padding: '16px', borderRadius: 14, border: '1px solid rgba(99,102,241,.2)', background: 'rgba(99,102,241,.03)', marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#6366F1', marginBottom: 12 }}>Invite a team member</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 8, alignItems: 'end' }}>
          <input placeholder="their@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            style={{ padding: '9px 12px', borderRadius: 9, border: '1px solid var(--b2)', background: 'var(--sf)', fontSize: 13, fontFamily: 'inherit', color: 'var(--tx)', outline: 'none' }}/>
          <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
            style={{ padding: '9px 10px', borderRadius: 9, border: '1px solid var(--b2)', background: 'var(--sf)', fontSize: 13, fontFamily: 'inherit', color: 'var(--tx)', outline: 'none' }}>
            {Object.entries(ROLES).filter(([r]) => r !== 'owner').map(([role, info]) => (
              <option key={role} value={role}>{info.label}</option>
            ))}
          </select>
          <button onClick={invite} disabled={!form.email || inviting}
            style={{ padding: '9px 16px', borderRadius: 9, border: 'none', background: '#6366F1', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
            {inviting ? 'Sending…' : 'Send Invite'}
          </button>
        </div>
      </div>

      {/* ───── Member list ───── */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[1, 2].map(i => <div key={i} className="skeleton" style={{ height: 60, borderRadius: 12 }}></div>)}
        </div>
      ) : members.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--tx3)', fontSize: 13 }}>
          No team members yet. Invite your accountant, ops manager, or co-founder.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {members.filter(m => m.status !== 'removed').map((m, i) => {
            const roleInfo = ROLES[m.role] || ROLES.viewer
            return (
              <div key={m.id} className="animate-fade-up" style={{ animationDelay: `${i * 0.05}s`, padding: '12px 16px', borderRadius: 12, border: '1px solid var(--b)', background: 'var(--sf)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${roleInfo.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: roleInfo.color, flexShrink: 0 }}>
                  {(m.name || m.email)[0].toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--tx)' }}>{m.name || m.email}</div>
                  <div style={{ fontSize: 11, color: 'var(--tx3)' }}>{m.email}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: roleInfo.color, background: `${roleInfo.color}18`, padding: '2px 8px', borderRadius: 9999 }}>
                    {roleInfo.emoji} {roleInfo.label}
                  </span>
                  {m.status === 'pending' && (
                    <span style={{ fontSize: 11, color: '#d97706', background: 'rgba(245,158,11,.1)', padding: '2px 8px', borderRadius: 9999 }}>Pending</span>
                  )}
                  <button onClick={() => removeOrUpdate(m.id, { status: 'removed' })}
                    style={{ padding: '4px 8px', borderRadius: 7, border: '1px solid var(--b)', background: 'transparent', fontSize: 11, color: 'var(--tx3)', cursor: 'pointer', fontFamily: 'inherit' }}>
                    Remove
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
