'use client'
import { useEffect, useState } from 'react'
import { useLang } from '@/components/LanguageProvider'

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

function buildLevelBadge(tc: (k: string) => string): Record<string, { label: string; bg: string; fg: string }> {
  return {
    full: { label: tc('intel_teampanel.levelFull'), bg: 'rgba(34,197,94,.12)',   fg: '#16a34a' },
    edit: { label: tc('intel_teampanel.levelEdit'), bg: 'rgba(59,130,246,.12)',  fg: '#2563eb' },
    view: { label: tc('intel_teampanel.levelView'), bg: 'rgba(168,162,158,.12)', fg: '#78716c' },
    none: { label: tc('intel_teampanel.levelNone'), bg: 'rgba(239,68,68,.08)',   fg: '#dc2626' },
  }
}

function buildRoles(tc: (k: string) => string): Record<string, RoleDetail> {
  const area = {
    dashboards:    tc('intel_teampanel.areaPermDashboards'),
    aiChat:        tc('intel_teampanel.areaPermAiChat'),
    businessTools: tc('intel_teampanel.areaPermBusinessTools'),
    cfo:           tc('intel_teampanel.areaPermCfo'),
    dataSources:   tc('intel_teampanel.areaPermDataSources'),
    team:          tc('intel_teampanel.areaPermTeam'),
    billing:       tc('intel_teampanel.areaPermBilling'),
    pos:           tc('intel_teampanel.areaPermPos'),
    settings:      tc('intel_teampanel.areaPermSettings'),
  }
  return {
    owner: {
      label: tc('intel_teampanel.roleOwnerLabel'),
      color: '#6366F1',
      desc:  tc('intel_teampanel.roleOwnerDesc'),
      who:   tc('intel_teampanel.roleOwnerWho'),
      emoji: '👑',
      permissions: [
        { area: area.dashboards,    level: 'full' },
        { area: area.aiChat,        level: 'full' },
        { area: area.businessTools, level: 'full' },
        { area: area.cfo,           level: 'full' },
        { area: area.dataSources,   level: 'full' },
        { area: area.team,          level: 'full' },
        { area: area.billing,       level: 'full' },
        { area: area.pos,           level: 'full' },
        { area: area.settings,      level: 'full' },
      ],
      cannotAccess: [],
      useCases: [
        tc('intel_teampanel.roleOwnerUseCase0'),
        tc('intel_teampanel.roleOwnerUseCase1'),
        tc('intel_teampanel.roleOwnerUseCase2'),
      ],
    },
    admin: {
      label: tc('intel_teampanel.roleAdminLabel'),
      color: '#7c3aed',
      desc:  tc('intel_teampanel.roleAdminDesc'),
      who:   tc('intel_teampanel.roleAdminWho'),
      emoji: '🛡️',
      permissions: [
        { area: area.dashboards,    level: 'full' },
        { area: area.aiChat,        level: 'full' },
        { area: area.businessTools, level: 'full' },
        { area: area.cfo,           level: 'full' },
        { area: area.dataSources,   level: 'full' },
        { area: area.team,          level: 'edit' },
        { area: area.billing,       level: 'view' },
        { area: area.pos,           level: 'full' },
        { area: area.settings,      level: 'edit' },
      ],
      cannotAccess: [
        tc('intel_teampanel.roleAdminCannotAccess0'),
        tc('intel_teampanel.roleAdminCannotAccess1'),
        tc('intel_teampanel.roleAdminCannotAccess2'),
      ],
      useCases: [
        tc('intel_teampanel.roleAdminUseCase0'),
        tc('intel_teampanel.roleAdminUseCase1'),
        tc('intel_teampanel.roleAdminUseCase2'),
      ],
    },
    analyst: {
      label: tc('intel_teampanel.roleAnalystLabel'),
      color: '#0284c7',
      desc:  tc('intel_teampanel.roleAnalystDesc'),
      who:   tc('intel_teampanel.roleAnalystWho'),
      emoji: '📊',
      permissions: [
        { area: area.dashboards,    level: 'full' },
        { area: area.aiChat,        level: 'full' },
        { area: area.businessTools, level: 'full' },
        { area: area.cfo,           level: 'view' },
        { area: area.dataSources,   level: 'view' },
        { area: area.team,          level: 'none' },
        { area: area.billing,       level: 'none' },
        { area: area.pos,           level: 'view' },
        { area: area.settings,      level: 'view' },
      ],
      cannotAccess: [
        tc('intel_teampanel.roleAnalystCannotAccess0'),
        tc('intel_teampanel.roleAnalystCannotAccess1'),
        tc('intel_teampanel.roleAnalystCannotAccess2'),
        tc('intel_teampanel.roleAnalystCannotAccess3'),
      ],
      useCases: [
        tc('intel_teampanel.roleAnalystUseCase0'),
        tc('intel_teampanel.roleAnalystUseCase1'),
        tc('intel_teampanel.roleAnalystUseCase2'),
      ],
    },
    accountant: {
      label: tc('intel_teampanel.roleAccountantLabel'),
      color: '#16a34a',
      desc:  tc('intel_teampanel.roleAccountantDesc'),
      who:   tc('intel_teampanel.roleAccountantWho'),
      emoji: '🧮',
      permissions: [
        { area: area.dashboards,    level: 'view' },
        { area: area.aiChat,        level: 'edit' },
        { area: area.businessTools, level: 'none' },
        { area: area.cfo,           level: 'full' },
        { area: area.dataSources,   level: 'none' },
        { area: area.team,          level: 'none' },
        { area: area.billing,       level: 'none' },
        { area: area.pos,           level: 'none' },
        { area: area.settings,      level: 'none' },
      ],
      cannotAccess: [
        tc('intel_teampanel.roleAccountantCannotAccess0'),
        tc('intel_teampanel.roleAccountantCannotAccess1'),
        tc('intel_teampanel.roleAccountantCannotAccess2'),
        tc('intel_teampanel.roleAccountantCannotAccess3'),
      ],
      useCases: [
        tc('intel_teampanel.roleAccountantUseCase0'),
        tc('intel_teampanel.roleAccountantUseCase1'),
        tc('intel_teampanel.roleAccountantUseCase2'),
      ],
    },
    buyer: {
      label: tc('intel_teampanel.roleBuyerLabel'),
      color: '#d97706',
      desc:  tc('intel_teampanel.roleBuyerDesc'),
      who:   tc('intel_teampanel.roleBuyerWho'),
      emoji: '📦',
      permissions: [
        { area: area.dashboards,    level: 'view' },
        { area: area.aiChat,        level: 'edit' },
        { area: area.businessTools, level: 'view' },
        { area: area.cfo,           level: 'none' },
        { area: area.dataSources,   level: 'none' },
        { area: area.team,          level: 'none' },
        { area: area.billing,       level: 'none' },
        { area: area.pos,           level: 'full' },
        { area: area.settings,      level: 'none' },
      ],
      cannotAccess: [
        tc('intel_teampanel.roleBuyerCannotAccess0'),
        tc('intel_teampanel.roleBuyerCannotAccess1'),
        tc('intel_teampanel.roleBuyerCannotAccess2'),
        tc('intel_teampanel.roleBuyerCannotAccess3'),
      ],
      useCases: [
        tc('intel_teampanel.roleBuyerUseCase0'),
        tc('intel_teampanel.roleBuyerUseCase1'),
        tc('intel_teampanel.roleBuyerUseCase2'),
      ],
    },
    viewer: {
      label: tc('intel_teampanel.roleViewerLabel'),
      color: '#94a3b8',
      desc:  tc('intel_teampanel.roleViewerDesc'),
      who:   tc('intel_teampanel.roleViewerWho'),
      emoji: '👁️',
      permissions: [
        { area: area.dashboards,    level: 'view' },
        { area: area.aiChat,        level: 'view' },
        { area: area.businessTools, level: 'view' },
        { area: area.cfo,           level: 'view' },
        { area: area.dataSources,   level: 'none' },
        { area: area.team,          level: 'none' },
        { area: area.billing,       level: 'none' },
        { area: area.pos,           level: 'view' },
        { area: area.settings,      level: 'none' },
      ],
      cannotAccess: [
        tc('intel_teampanel.roleViewerCannotAccess0'),
        tc('intel_teampanel.roleViewerCannotAccess1'),
        tc('intel_teampanel.roleViewerCannotAccess2'),
      ],
      useCases: [
        tc('intel_teampanel.roleViewerUseCase0'),
        tc('intel_teampanel.roleViewerUseCase1'),
        tc('intel_teampanel.roleViewerUseCase2'),
      ],
    },
  }
}

function buildPermissionAreas(tc: (k: string) => string): string[] {
  return [
    tc('intel_teampanel.areaPermDashboards'),
    tc('intel_teampanel.areaPermAiChat'),
    tc('intel_teampanel.areaPermBusinessTools'),
    tc('intel_teampanel.areaPermCfo'),
    tc('intel_teampanel.areaPermDataSources'),
    tc('intel_teampanel.areaPermTeam'),
    tc('intel_teampanel.areaPermBilling'),
    tc('intel_teampanel.areaPermPos'),
    tc('intel_teampanel.areaPermSettings'),
  ]
}

/* ───────── Comparison view ───────── */

const COMPARE_ROLES = ['owner', 'admin', 'analyst', 'accountant', 'buyer', 'viewer'] as const

/* ───────── Component ───────── */

export default function TeamPanel() {
  const { tc } = useLang()
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [inviting, setInviting] = useState(false)
  const [form, setForm] = useState({ email: '', role: 'analyst', name: '' })
  const [toast, setToast] = useState('')
  const [expandedRole, setExpandedRole] = useState<string | null>(null)
  const [showCompare, setShowCompare] = useState(false)

  const LEVEL_BADGE = buildLevelBadge(tc)
  const ROLES = buildRoles(tc)
  const PERMISSION_AREAS = buildPermissionAreas(tc)

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
          showToast(tc('intel_teampanel.toastEmailSent').replace('{email}', form.email))
        } else {
          showToast(tc('intel_teampanel.toastShareLink').replace('{url}', data.acceptUrl))
          navigator.clipboard?.writeText(data.acceptUrl).catch(() => {})
        }
      } else {
        showToast(data.error || tc('intel_teampanel.toastFailedDefault'))
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
          <h2 style={{ fontFamily: 'var(--font-sora)', fontSize: 18, fontWeight: 700, marginBottom: 6 }}>{tc('intel_teampanel.headingTeam')}</h2>
          <p style={{ fontSize: 13, color: 'var(--tx3)', lineHeight: 1.5 }}>
            {tc('intel_teampanel.headingDesc')}
          </p>
        </div>
        <button onClick={() => setShowCompare(v => !v)}
          style={{ padding: '6px 14px', borderRadius: 9999, border: '1px solid var(--b)', background: showCompare ? 'rgba(99,102,241,.08)' : 'transparent', color: showCompare ? '#6366F1' : 'var(--tx2)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
          {showCompare ? tc('intel_teampanel.btnBackToRoles') : tc('intel_teampanel.btnCompareRoles')}
        </button>
      </div>

      {/* ───── Comparison table view ───── */}
      {showCompare ? (
        <div style={{ overflowX: 'auto', marginBottom: 24 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, minWidth: 600 }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '8px 10px', borderBottom: '2px solid var(--b)', fontFamily: 'var(--font-sora)', fontWeight: 700, color: 'var(--tx)', fontSize: 12 }}>
                  {tc('intel_teampanel.tablePermissionArea')}
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
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.04em' }}>{tc('intel_teampanel.sectionPermissions')}</div>
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
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.04em' }}>{tc('intel_teampanel.sectionBestFor')}</div>
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
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#dc2626', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.04em' }}>{tc('intel_teampanel.sectionCannotAccess')}</div>
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
        <div style={{ fontSize: 13, fontWeight: 700, color: '#6366F1', marginBottom: 12 }}>{tc('intel_teampanel.inviteTitle')}</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 8, alignItems: 'end' }}>
          <input placeholder={tc('intel_teampanel.invitePlaceholder')} value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            style={{ padding: '9px 12px', borderRadius: 9, border: '1px solid var(--b2)', background: 'var(--sf)', fontSize: 13, fontFamily: 'inherit', color: 'var(--tx)', outline: 'none' }}/>
          <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
            style={{ padding: '9px 10px', borderRadius: 9, border: '1px solid var(--b2)', background: 'var(--sf)', fontSize: 13, fontFamily: 'inherit', color: 'var(--tx)', outline: 'none' }}>
            {Object.entries(ROLES).filter(([r]) => r !== 'owner').map(([role, info]) => (
              <option key={role} value={role}>{info.label}</option>
            ))}
          </select>
          <button onClick={invite} disabled={!form.email || inviting}
            style={{ padding: '9px 16px', borderRadius: 9, border: 'none', background: '#6366F1', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
            {inviting ? tc('intel_teampanel.btnSending') : tc('intel_teampanel.btnSendInvite')}
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
          {tc('intel_teampanel.emptyMembers')}
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
                    <span style={{ fontSize: 11, color: '#d97706', background: 'rgba(245,158,11,.1)', padding: '2px 8px', borderRadius: 9999 }}>{tc('intel_teampanel.statusPending')}</span>
                  )}
                  <button onClick={() => removeOrUpdate(m.id, { status: 'removed' })}
                    style={{ padding: '4px 8px', borderRadius: 7, border: '1px solid var(--b)', background: 'transparent', fontSize: 11, color: 'var(--tx3)', cursor: 'pointer', fontFamily: 'inherit' }}>
                    {tc('intel_teampanel.btnRemove')}
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
