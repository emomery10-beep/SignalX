'use client'
import { useEffect, useState } from 'react'
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

/* ─── Role definitions ─── */

interface PermissionBucket { area: string; level: 'full' | 'edit' | 'view' | 'none' }
interface RoleDetail {
  label: string; color: string; desc: string; who: string; emoji: string
  permissions: PermissionBucket[]; cannotAccess: string[]; useCases: string[]
}

function buildLevelBadge(tc: (k: string) => string) {
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
      label: tc('intel_teampanel.roleOwnerLabel'), color: '#6366F1', emoji: '👑',
      desc: tc('intel_teampanel.roleOwnerDesc'), who: tc('intel_teampanel.roleOwnerWho'),
      permissions: [
        { area: area.dashboards, level: 'full' }, { area: area.aiChat, level: 'full' },
        { area: area.businessTools, level: 'full' }, { area: area.cfo, level: 'full' },
        { area: area.dataSources, level: 'full' }, { area: area.team, level: 'full' },
        { area: area.billing, level: 'full' }, { area: area.pos, level: 'full' },
        { area: area.settings, level: 'full' },
      ],
      cannotAccess: [],
      useCases: [tc('intel_teampanel.roleOwnerUseCase0'), tc('intel_teampanel.roleOwnerUseCase1'), tc('intel_teampanel.roleOwnerUseCase2')],
    },
    admin: {
      label: tc('intel_teampanel.roleAdminLabel'), color: '#7c3aed', emoji: '🛡️',
      desc: tc('intel_teampanel.roleAdminDesc'), who: tc('intel_teampanel.roleAdminWho'),
      permissions: [
        { area: area.dashboards, level: 'full' }, { area: area.aiChat, level: 'full' },
        { area: area.businessTools, level: 'full' }, { area: area.cfo, level: 'full' },
        { area: area.dataSources, level: 'full' }, { area: area.team, level: 'edit' },
        { area: area.billing, level: 'view' }, { area: area.pos, level: 'full' },
        { area: area.settings, level: 'edit' },
      ],
      cannotAccess: [tc('intel_teampanel.roleAdminCannotAccess0'), tc('intel_teampanel.roleAdminCannotAccess1'), tc('intel_teampanel.roleAdminCannotAccess2')],
      useCases: [tc('intel_teampanel.roleAdminUseCase0'), tc('intel_teampanel.roleAdminUseCase1'), tc('intel_teampanel.roleAdminUseCase2')],
    },
    analyst: {
      label: tc('intel_teampanel.roleAnalystLabel'), color: '#0284c7', emoji: '📊',
      desc: tc('intel_teampanel.roleAnalystDesc'), who: tc('intel_teampanel.roleAnalystWho'),
      permissions: [
        { area: area.dashboards, level: 'full' }, { area: area.aiChat, level: 'full' },
        { area: area.businessTools, level: 'full' }, { area: area.cfo, level: 'view' },
        { area: area.dataSources, level: 'view' }, { area: area.team, level: 'none' },
        { area: area.billing, level: 'view' }, { area: area.pos, level: 'view' },
        { area: area.settings, level: 'view' },
      ],
      cannotAccess: [tc('intel_teampanel.roleAnalystCannotAccess0'), tc('intel_teampanel.roleAnalystCannotAccess1'), tc('intel_teampanel.roleAnalystCannotAccess2'), tc('intel_teampanel.roleAnalystCannotAccess3')],
      useCases: [tc('intel_teampanel.roleAnalystUseCase0'), tc('intel_teampanel.roleAnalystUseCase1'), tc('intel_teampanel.roleAnalystUseCase2')],
    },
    accountant: {
      label: tc('intel_teampanel.roleAccountantLabel'), color: '#16a34a', emoji: '🧮',
      desc: tc('intel_teampanel.roleAccountantDesc'), who: tc('intel_teampanel.roleAccountantWho'),
      permissions: [
        { area: area.dashboards, level: 'view' }, { area: area.aiChat, level: 'edit' },
        { area: area.businessTools, level: 'none' }, { area: area.cfo, level: 'full' },
        { area: area.dataSources, level: 'none' }, { area: area.team, level: 'none' },
        { area: area.billing, level: 'none' }, { area: area.pos, level: 'none' },
        { area: area.settings, level: 'none' },
      ],
      cannotAccess: [tc('intel_teampanel.roleAccountantCannotAccess0'), tc('intel_teampanel.roleAccountantCannotAccess1'), tc('intel_teampanel.roleAccountantCannotAccess2'), tc('intel_teampanel.roleAccountantCannotAccess3')],
      useCases: [tc('intel_teampanel.roleAccountantUseCase0'), tc('intel_teampanel.roleAccountantUseCase1'), tc('intel_teampanel.roleAccountantUseCase2')],
    },
    buyer: {
      label: tc('intel_teampanel.roleBuyerLabel'), color: '#d97706', emoji: '📦',
      desc: tc('intel_teampanel.roleBuyerDesc'), who: tc('intel_teampanel.roleBuyerWho'),
      permissions: [
        { area: area.dashboards, level: 'view' }, { area: area.aiChat, level: 'edit' },
        { area: area.businessTools, level: 'view' }, { area: area.cfo, level: 'none' },
        { area: area.dataSources, level: 'none' }, { area: area.team, level: 'none' },
        { area: area.billing, level: 'none' }, { area: area.pos, level: 'full' },
        { area: area.settings, level: 'none' },
      ],
      cannotAccess: [tc('intel_teampanel.roleBuyerCannotAccess0'), tc('intel_teampanel.roleBuyerCannotAccess1'), tc('intel_teampanel.roleBuyerCannotAccess2'), tc('intel_teampanel.roleBuyerCannotAccess3')],
      useCases: [tc('intel_teampanel.roleBuyerUseCase0'), tc('intel_teampanel.roleBuyerUseCase1'), tc('intel_teampanel.roleBuyerUseCase2')],
    },
    viewer: {
      label: tc('intel_teampanel.roleViewerLabel'), color: '#94a3b8', emoji: '👁️',
      desc: tc('intel_teampanel.roleViewerDesc'), who: tc('intel_teampanel.roleViewerWho'),
      permissions: [
        { area: area.dashboards, level: 'view' }, { area: area.aiChat, level: 'view' },
        { area: area.businessTools, level: 'view' }, { area: area.cfo, level: 'view' },
        { area: area.dataSources, level: 'none' }, { area: area.team, level: 'none' },
        { area: area.billing, level: 'none' }, { area: area.pos, level: 'view' },
        { area: area.settings, level: 'none' },
      ],
      cannotAccess: [tc('intel_teampanel.roleViewerCannotAccess0'), tc('intel_teampanel.roleViewerCannotAccess1'), tc('intel_teampanel.roleViewerCannotAccess2')],
      useCases: [tc('intel_teampanel.roleViewerUseCase0'), tc('intel_teampanel.roleViewerUseCase1'), tc('intel_teampanel.roleViewerUseCase2')],
    },
  }
}

const COMPARE_ROLES = ['owner', 'admin', 'analyst', 'accountant', 'buyer', 'viewer'] as const

function getInitials(name: string, email: string) {
  const src = name?.trim() || email || ''
  const parts = src.split(/[\s@]+/).filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return src.slice(0, 2).toUpperCase()
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

/* ─── Component ─── */

export default function TeamPanel() {
  const { tc } = useLang()
  const [members, setMembers] = useState<TeamMember[]>([])
  const [callerRole, setCallerRole] = useState<CallerRole>('owner')
  const [loading, setLoading] = useState(true)
  const [inviting, setInviting] = useState(false)
  const [resendingId, setResendingId] = useState<string | null>(null)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [form, setForm] = useState({ email: '', role: 'analyst', name: '' })
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' }>({ msg: '', type: 'success' })
  const [expandedRole, setExpandedRole] = useState<string | null>(null)
  const [showCompare, setShowCompare] = useState(false)
  const [editingRole, setEditingRole] = useState<string | null>(null)

  const LEVEL_BADGE = buildLevelBadge(tc)
  const ROLES = buildRoles(tc)
  const PERMISSION_AREAS = Object.values({
    dashboards: tc('intel_teampanel.areaPermDashboards'),
    aiChat: tc('intel_teampanel.areaPermAiChat'),
    businessTools: tc('intel_teampanel.areaPermBusinessTools'),
    cfo: tc('intel_teampanel.areaPermCfo'),
    dataSources: tc('intel_teampanel.areaPermDataSources'),
    team: tc('intel_teampanel.areaPermTeam'),
    billing: tc('intel_teampanel.areaPermBilling'),
    pos: tc('intel_teampanel.areaPermPos'),
    settings: tc('intel_teampanel.areaPermSettings'),
  })

  const canManage = callerRole === 'owner' || callerRole === 'admin'

  useEffect(() => {
    Promise.all([
      fetch('/api/team').then(r => r.json()),
      fetch('/api/me/role').then(r => r.json()),
    ]).then(([teamData, roleData]) => {
      setMembers(teamData.members || [])
      if (roleData.role) setCallerRole(roleData.role)
    }).finally(() => setLoading(false))
  }, [])

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast({ msg: '', type: 'success' }), 4000)
  }

  const invite = async () => {
    if (!form.email) return
    setInviting(true)
    try {
      const res = await fetch('/api/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.member) {
        setMembers(m => [data.member, ...m])
        setForm({ email: '', role: 'analyst', name: '' })
        if (data.emailSent) {
          showToast(`Invite sent to ${form.email}`)
        } else {
          navigator.clipboard?.writeText(data.acceptUrl).catch(() => {})
          showToast(`Link copied — email not sent. Share: ${data.acceptUrl}`)
        }
      } else {
        showToast(data.error || 'Failed to send invite', 'error')
      }
    } finally {
      setInviting(false)
    }
  }

  const resendInvite = async (member: TeamMember) => {
    setResendingId(member.id)
    try {
      // Re-send by POSTing again with same email/role (upserts, resets token + expiry)
      const res = await fetch('/api/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: member.email, role: member.role, name: member.name }),
      })
      const data = await res.json()
      if (data.member) {
        setMembers(m => m.map(x => x.id === member.id ? data.member : x))
        showToast(data.emailSent ? `Invite resent to ${member.email}` : `Link copied for ${member.email}`)
        if (!data.emailSent) navigator.clipboard?.writeText(data.acceptUrl).catch(() => {})
      } else {
        showToast(data.error || 'Failed to resend', 'error')
      }
    } finally {
      setResendingId(null)
    }
  }

  const changeRole = async (id: string, newRole: string) => {
    setEditingRole(null)
    const res = await fetch('/api/team', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, role: newRole }),
    })
    const data = await res.json()
    if (data.member) {
      setMembers(m => m.map(x => x.id === id ? data.member : x))
      showToast('Role updated')
    } else {
      showToast(data.error || 'Failed to update role', 'error')
    }
  }

  const removeMember = async (id: string) => {
    setRemovingId(id)
    try {
      const res = await fetch('/api/team', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'removed' }),
      })
      const data = await res.json()
      if (data.member) {
        setMembers(m => m.filter(x => x.id !== id))
        showToast('Member removed')
      } else {
        showToast(data.error || 'Failed to remove', 'error')
      }
    } finally {
      setRemovingId(null)
    }
  }

  const activeMembers = members.filter(m => m.status === 'active')
  const pendingMembers = members.filter(m => m.status === 'pending')

  return (
    <div style={{ maxWidth: 760 }}>
      {/* Toast */}
      {toast.msg && (
        <div style={{
          position: 'fixed', top: 16, right: 16, zIndex: 9999,
          padding: '10px 16px', borderRadius: 10, fontSize: 13, fontWeight: 500,
          background: toast.type === 'error' ? 'rgba(239,68,68,.1)' : 'rgba(34,197,94,.1)',
          border: `1px solid ${toast.type === 'error' ? 'rgba(239,68,68,.3)' : 'rgba(34,197,94,.3)'}`,
          color: toast.type === 'error' ? '#dc2626' : '#16a34a',
          maxWidth: 340, wordBreak: 'break-all',
        }}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-sora)', fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
            {tc('intel_teampanel.headingTeam')}
          </h2>
          <p style={{ fontSize: 13, color: 'var(--tx3)', lineHeight: 1.5 }}>
            {tc('intel_teampanel.headingDesc')}
          </p>
        </div>

        {/* Role badge for non-owners */}
        {callerRole !== 'owner' && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px',
            borderRadius: 9999, border: `1px solid ${ROLES[callerRole]?.color || '#888'}40`,
            background: `${ROLES[callerRole]?.color || '#888'}08`, flexShrink: 0,
          }}>
            <span style={{ fontSize: 13 }}>{ROLES[callerRole]?.emoji}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: ROLES[callerRole]?.color }}>
              Your role: {ROLES[callerRole]?.label}
            </span>
          </div>
        )}
      </div>

      {/* Role grid + compare toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, gap: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx2)', textTransform: 'uppercase', letterSpacing: '.05em' }}>
          Roles
        </span>
        <button
          onClick={() => { setShowCompare(v => !v); setExpandedRole(null) }}
          style={{
            padding: '5px 12px', borderRadius: 9999, border: '1px solid var(--b)',
            background: showCompare ? 'rgba(99,102,241,.08)' : 'transparent',
            color: showCompare ? '#6366F1' : 'var(--tx2)',
            fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
          }}>
          {showCompare ? '← Back to roles' : tc('intel_teampanel.btnCompareRoles')}
        </button>
      </div>

      {showCompare ? (
        /* ─── Compare table ─── */
        <div style={{ overflowX: 'auto', marginBottom: 28, borderRadius: 12, border: '1px solid var(--b)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, minWidth: 580 }}>
            <thead>
              <tr style={{ background: 'var(--ev)' }}>
                <th style={{ textAlign: 'left', padding: '10px 12px', fontWeight: 700, color: 'var(--tx)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.04em', borderBottom: '1px solid var(--b)' }}>
                  Area
                </th>
                {COMPARE_ROLES.map(r => (
                  <th key={r} style={{ textAlign: 'center', padding: '10px 6px', fontWeight: 700, color: ROLES[r].color, fontSize: 11, whiteSpace: 'nowrap', borderBottom: '1px solid var(--b)' }}>
                    {ROLES[r].emoji} {ROLES[r].label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PERMISSION_AREAS.map((area, i) => (
                <tr key={area} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--ev)' }}>
                  <td style={{ padding: '7px 12px', borderBottom: '1px solid var(--b)', color: 'var(--tx2)', fontWeight: 500 }}>
                    {area}
                  </td>
                  {COMPARE_ROLES.map(r => {
                    const perm = ROLES[r].permissions.find(p => p.area === area)
                    const badge = perm ? LEVEL_BADGE[perm.level] : LEVEL_BADGE.none
                    return (
                      <td key={r} style={{ textAlign: 'center', padding: '7px 4px', borderBottom: '1px solid var(--b)' }}>
                        <span style={{ display: 'inline-block', padding: '1px 7px', borderRadius: 9999, background: badge.bg, color: badge.fg, fontSize: 10, fontWeight: 600 }}>
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
          {/* ─── Role cards ─── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 8, marginBottom: expandedRole ? 0 : 24 }}>
            {Object.entries(ROLES).map(([key, role]) => {
              const isExpanded = expandedRole === key
              return (
                <button key={key} onClick={() => setExpandedRole(isExpanded ? null : key)}
                  style={{
                    padding: '10px 12px', borderRadius: 10, border: `1px solid ${isExpanded ? `${role.color}50` : 'var(--b)'}`,
                    background: isExpanded ? `${role.color}10` : 'var(--sf)',
                    cursor: 'pointer', textAlign: 'left', transition: 'all 150ms', fontFamily: 'inherit',
                  }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 15 }}>{role.emoji}</span>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={isExpanded ? role.color : 'var(--tx3)'} strokeWidth="2.5" strokeLinecap="round"
                      style={{ transform: isExpanded ? 'rotate(180deg)' : undefined, transition: 'transform 150ms' }}>
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: isExpanded ? role.color : 'var(--tx)', marginBottom: 2 }}>{role.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--tx3)', lineHeight: 1.35 }}>{role.desc}</div>
                </button>
              )
            })}
          </div>

          {/* ─── Expanded role detail ─── */}
          {expandedRole && (() => {
            const role = ROLES[expandedRole]
            return (
              <div style={{
                margin: '8px 0 24px', padding: 20, borderRadius: 14,
                border: `1px solid ${role.color}25`, background: `${role.color}04`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: `${role.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                    {role.emoji}
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-sora)', fontSize: 15, fontWeight: 700, color: role.color }}>{role.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--tx3)', marginTop: 1 }}>{role.who}</div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.05em' }}>
                      {tc('intel_teampanel.sectionPermissions')}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {role.permissions.map(p => {
                        const badge = LEVEL_BADGE[p.level]
                        return (
                          <div key={p.area} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 8px', borderRadius: 7, background: 'var(--sf)', border: '1px solid var(--b)' }}>
                            <span style={{ fontSize: 12, color: 'var(--tx2)' }}>{p.area}</span>
                            <span style={{ padding: '1px 7px', borderRadius: 9999, background: badge.bg, color: badge.fg, fontSize: 10, fontWeight: 600 }}>
                              {badge.label}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  <div>
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.05em' }}>
                        {tc('intel_teampanel.sectionBestFor')}
                      </div>
                      {role.useCases.map((u, i) => (
                        <div key={i} style={{ display: 'flex', gap: 7, alignItems: 'flex-start', marginBottom: 5 }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={role.color} strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 2 }}>
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                          <span style={{ fontSize: 12, color: 'var(--tx2)', lineHeight: 1.4 }}>{u}</span>
                        </div>
                      ))}
                    </div>
                    {role.cannotAccess.length > 0 && (
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#dc2626', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.05em' }}>
                          {tc('intel_teampanel.sectionCannotAccess')}
                        </div>
                        {role.cannotAccess.map((c, i) => (
                          <div key={i} style={{ display: 'flex', gap: 7, alignItems: 'flex-start', marginBottom: 5 }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 2 }}>
                              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                            <span style={{ fontSize: 12, color: 'var(--tx3)', lineHeight: 1.4 }}>{c}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })()}
        </>
      )}

      {/* ─── Invite form (owner/admin only) ─── */}
      {canManage && (
        <div style={{
          padding: 16, borderRadius: 14, marginBottom: 24,
          border: '1px solid rgba(99,102,241,.2)', background: 'rgba(99,102,241,.03)',
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#6366F1', marginBottom: 12 }}>
            {tc('intel_teampanel.inviteTitle')}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
            <input
              placeholder={tc('intel_teampanel.invitePlaceholder')}
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && invite()}
              style={{ padding: '9px 12px', borderRadius: 9, border: '1px solid var(--b2)', background: 'var(--sf)', fontSize: 13, fontFamily: 'inherit', color: 'var(--tx)', outline: 'none' }}
            />
            <input
              placeholder="Name (optional)"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              style={{ padding: '9px 12px', borderRadius: 9, border: '1px solid var(--b2)', background: 'var(--sf)', fontSize: 13, fontFamily: 'inherit', color: 'var(--tx)', outline: 'none' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <select
              value={form.role}
              onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
              style={{ flex: 1, padding: '9px 10px', borderRadius: 9, border: '1px solid var(--b2)', background: 'var(--sf)', fontSize: 13, fontFamily: 'inherit', color: 'var(--tx)', outline: 'none' }}>
              {Object.entries(ROLES)
                .filter(([r]) => r !== 'owner' && !(callerRole === 'admin' && r === 'admin'))
                .map(([role, info]) => (
                  <option key={role} value={role}>{info.emoji} {info.label}</option>
                ))}
            </select>
            <button
              onClick={invite}
              disabled={!form.email || inviting}
              style={{ padding: '9px 20px', borderRadius: 9, border: 'none', background: form.email && !inviting ? '#6366F1' : 'var(--b2)', color: form.email && !inviting ? '#fff' : 'var(--tx3)', fontSize: 13, fontWeight: 600, cursor: form.email && !inviting ? 'pointer' : 'default', fontFamily: 'inherit', whiteSpace: 'nowrap', transition: 'all 150ms' }}>
              {inviting ? 'Sending…' : tc('intel_teampanel.btnSendInvite')}
            </button>
          </div>
        </div>
      )}

      {/* ─── Member list ─── */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 64, borderRadius: 12 }} />)}
        </div>
      ) : members.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', borderRadius: 14, border: '1px dashed var(--b)' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>👥</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--tx)', marginBottom: 4 }}>No team members yet</div>
          <div style={{ fontSize: 13, color: 'var(--tx3)' }}>
            {canManage
              ? 'Invite your accountant, ops manager, or co-founder above.'
              : 'Ask your account owner to invite you to their team.'}
          </div>
        </div>
      ) : (
        <div>
          {/* Active */}
          {activeMembers.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 8 }}>
                Active · {activeMembers.length}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {activeMembers.map((m, i) => {
                  const roleInfo = ROLES[m.role] || ROLES.viewer
                  const isEditing = editingRole === m.id
                  return (
                    <div key={m.id} style={{
                      padding: '12px 14px', borderRadius: 12, border: '1px solid var(--b)',
                      background: 'var(--sf)', display: 'flex', alignItems: 'center', gap: 12,
                      animation: `fadeUp .2s ease ${i * 0.04}s both`,
                    }}>
                      <div style={{
                        width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                        background: `${roleInfo.color}22`, display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: 13, fontWeight: 700, color: roleInfo.color,
                      }}>
                        {getInitials(m.name, m.email)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--tx)', marginBottom: 1 }}>
                          {m.name || m.email.split('@')[0]}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--tx3)' }}>{m.email}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                        {/* Role badge or change dropdown */}
                        {canManage && isEditing ? (
                          <select
                            autoFocus
                            defaultValue={m.role}
                            onChange={e => changeRole(m.id, e.target.value)}
                            onBlur={() => setEditingRole(null)}
                            style={{ padding: '4px 8px', borderRadius: 7, border: `1px solid ${roleInfo.color}40`, background: 'var(--sf)', fontSize: 11, fontFamily: 'inherit', color: roleInfo.color, fontWeight: 600, cursor: 'pointer' }}>
                            {Object.entries(ROLES)
                              .filter(([r]) => r !== 'owner' && !(callerRole === 'admin' && r === 'admin'))
                              .map(([r, info]) => (
                                <option key={r} value={r}>{info.emoji} {info.label}</option>
                              ))}
                          </select>
                        ) : (
                          <button
                            onClick={() => canManage ? setEditingRole(m.id) : undefined}
                            title={canManage ? 'Click to change role' : undefined}
                            style={{
                              padding: '4px 10px', borderRadius: 9999, border: `1px solid ${roleInfo.color}30`,
                              background: `${roleInfo.color}12`, color: roleInfo.color,
                              fontSize: 11, fontWeight: 600, fontFamily: 'inherit',
                              cursor: canManage ? 'pointer' : 'default',
                            }}>
                            {roleInfo.emoji} {roleInfo.label}
                          </button>
                        )}
                        {canManage && (
                          <button
                            onClick={() => removeMember(m.id)}
                            disabled={removingId === m.id}
                            style={{ padding: '5px 8px', borderRadius: 7, border: '1px solid var(--b)', background: 'transparent', fontSize: 11, color: 'var(--tx3)', cursor: 'pointer', fontFamily: 'inherit' }}>
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
          {pendingMembers.length > 0 && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 8 }}>
                Pending invite · {pendingMembers.length}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {pendingMembers.map((m, i) => {
                  const roleInfo = ROLES[m.role] || ROLES.viewer
                  return (
                    <div key={m.id} style={{
                      padding: '12px 14px', borderRadius: 12, border: '1px solid rgba(245,158,11,.2)',
                      background: 'rgba(245,158,11,.03)', display: 'flex', alignItems: 'center', gap: 12,
                      animation: `fadeUp .2s ease ${i * 0.04}s both`,
                    }}>
                      <div style={{
                        width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                        background: 'rgba(245,158,11,.15)', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#d97706',
                      }}>
                        {getInitials(m.name, m.email)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 1 }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--tx)' }}>
                            {m.name || m.email.split('@')[0]}
                          </span>
                          <span style={{ fontSize: 10, fontWeight: 600, color: '#d97706', background: 'rgba(245,158,11,.12)', padding: '1px 7px', borderRadius: 9999 }}>
                            Pending
                          </span>
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--tx3)' }}>
                          {m.email} · Invited {formatDate(m.invited_at)}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                        <span style={{ padding: '4px 10px', borderRadius: 9999, border: `1px solid ${roleInfo.color}30`, background: `${roleInfo.color}12`, color: roleInfo.color, fontSize: 11, fontWeight: 600 }}>
                          {roleInfo.emoji} {roleInfo.label}
                        </span>
                        {canManage && (
                          <>
                            <button
                              onClick={() => resendInvite(m)}
                              disabled={resendingId === m.id}
                              style={{ padding: '5px 10px', borderRadius: 7, border: '1px solid rgba(99,102,241,.3)', background: 'rgba(99,102,241,.06)', color: '#6366F1', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                              {resendingId === m.id ? '…' : 'Resend'}
                            </button>
                            <button
                              onClick={() => removeMember(m.id)}
                              disabled={removingId === m.id}
                              style={{ padding: '5px 8px', borderRadius: 7, border: '1px solid var(--b)', background: 'transparent', fontSize: 11, color: 'var(--tx3)', cursor: 'pointer', fontFamily: 'inherit' }}>
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
