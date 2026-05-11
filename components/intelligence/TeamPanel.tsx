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

const ROLE_LABELS: Record<string, { label: string; desc: string; color: string }> = {
  owner:      { label: 'Owner',      desc: 'Full access to everything',          color: '#6366F1' },
  admin:      { label: 'Admin',      desc: 'Full access + can invite members',   color: '#7c3aed' },
  analyst:    { label: 'Analyst',    desc: 'Read and write, no billing',         color: '#0284c7' },
  accountant: { label: 'Accountant', desc: 'Financial data and CFO reports only', color: '#16a34a' },
  buyer:      { label: 'Buyer',      desc: 'Inventory and supply chain only',    color: '#d97706' },
  viewer:     { label: 'Viewer',     desc: 'Read-only access',                   color: '#94a3b8' },
}

export default function TeamPanel() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [inviting, setInviting] = useState(false)
  const [form, setForm] = useState({ email: '', role: 'analyst', name: '' })
  const [toast, setToast] = useState('')

  useEffect(() => {
    fetch('/api/team').then(r => r.json()).then(d => setMembers(d.members || [])).finally(() => setLoading(false))
  }, [])

  const showToast = (msg: string, ok = true) => { setToast(msg); setTimeout(() => setToast(''), 4000) }

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
          // Copy to clipboard
          navigator.clipboard?.writeText(data.acceptUrl).catch(() => {})
        }
      } else {
        showToast(data.error || 'Failed to invite', false)
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
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontFamily: 'var(--font-sora)', fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Your Team</h2>
        <p style={{ fontSize: 13, color: 'var(--tx3)', lineHeight: 1.5 }}>
          Give your accountant, ops manager, or buyer their own view — filtered to what they need. Each role sees the same data, personalised for their job.
        </p>
      </div>

      {/* Role explanation */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8, marginBottom: 24 }}>
        {Object.entries(ROLE_LABELS).map(([role, info]) => (
          <div key={role} style={{ padding: '10px 12px', borderRadius: 10, border: '1px solid var(--b)', background: 'var(--sf)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: info.color, marginBottom: 3 }}>{info.label}</div>
            <div style={{ fontSize: 11, color: 'var(--tx3)', lineHeight: 1.4 }}>{info.desc}</div>
          </div>
        ))}
      </div>

      {/* Invite form */}
      <div style={{ padding: '16px', borderRadius: 14, border: '1px solid rgba(99,102,241,.2)', background: 'rgba(99,102,241,.03)', marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#6366F1', marginBottom: 12 }}>Invite a team member</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 8, alignItems: 'end' }}>
          <input placeholder="their@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            style={{ padding: '9px 12px', borderRadius: 9, border: '1px solid var(--b2)', background: 'var(--sf)', fontSize: 13, fontFamily: 'inherit', color: 'var(--tx)', outline: 'none' }}/>
          <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
            style={{ padding: '9px 10px', borderRadius: 9, border: '1px solid var(--b2)', background: 'var(--sf)', fontSize: 13, fontFamily: 'inherit', color: 'var(--tx)', outline: 'none' }}>
            {Object.entries(ROLE_LABELS).filter(([r]) => r !== 'owner').map(([role, info]) => (
              <option key={role} value={role}>{info.label}</option>
            ))}
          </select>
          <button onClick={invite} disabled={!form.email || inviting}
            style={{ padding: '9px 16px', borderRadius: 9, border: 'none', background: '#6366F1', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
            {inviting ? 'Sending…' : 'Send Invite'}
          </button>
        </div>
      </div>

      {/* Member list */}
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
            const roleInfo = ROLE_LABELS[m.role] || ROLE_LABELS.viewer
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
                    {roleInfo.label}
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
