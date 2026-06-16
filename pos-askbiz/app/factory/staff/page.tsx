'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { usePosAuth } from '@/lib/hooks/usePosAuth'

const ACCENT = '#d08a59'

type FactoryRole = 'worker' | 'supervisor' | 'manager'
type Permission = 'camera.output' | 'camera.wastage' | 'capture.approve' | 'data.export' | 'settings.manage'

interface StaffMember {
  id: string
  name: string
  email: string
  phone: string | null
  role: FactoryRole
  permissions: Permission[]
  status: 'active' | 'inactive'
  assigned_locations: string[]
  created_at: string
}

interface FormData {
  name: string
  email: string
  phone: string
  role: FactoryRole
  permissions: Permission[]
  locationId: string | null
}

const ROLE_CONFIG: Record<FactoryRole, { label: string; permissions: Permission[] }> = {
  worker: {
    label: '👷 Worker',
    permissions: ['camera.output', 'camera.wastage'],
  },
  supervisor: {
    label: '👔 Supervisor',
    permissions: ['camera.output', 'camera.wastage', 'capture.approve'],
  },
  manager: {
    label: '🎯 Manager',
    permissions: ['camera.output', 'camera.wastage', 'capture.approve', 'data.export', 'settings.manage'],
  },
}

const PERMISSION_LABELS: Record<Permission, string> = {
  'camera.output': '📸 Capture Production Photos',
  'camera.wastage': '🗑️ Log Wastage',
  'capture.approve': '✅ Approve Captures',
  'data.export': '📊 Export Data',
  'settings.manage': '⚙️ Manage Settings',
}

function IconArrowLeft({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

function IconPlus({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

export default function FactoryStaffPage() {
  const router = useRouter()
  const { session, ready: authReady } = usePosAuth()
  const [loading, setLoading] = useState(true)
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [locations, setLocations] = useState<Array<{ id: string; name: string }>>([])

  // Form state
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    role: 'worker',
    permissions: ['camera.output', 'camera.wastage'],
    locationId: null,
  })

  // Load staff
  const loadStaff = useCallback(async () => {
    if (!session) return
    setLoading(true)
    try {
      const r = await fetch('/api/pos/staff', { headers: session.headers })
      const d = r.ok ? await r.json() : { staff: [] }
      setStaff(d.staff || [])

      // Load locations
      const locRes = await fetch('/api/pos/locations', { headers: session.headers })
      const locData = locRes.ok ? await locRes.json() : { locations: [] }
      setLocations(locData.locations || [])
    } catch (e) {
      console.error(e)
      setError('Failed to load staff data')
    } finally {
      setLoading(false)
    }
  }, [session])

  useEffect(() => {
    if (!authReady || !session) return
    loadStaff()
  }, [authReady, session, loadStaff])

  const handleRoleChange = (newRole: FactoryRole) => {
    setForm({
      ...form,
      role: newRole,
      permissions: ROLE_CONFIG[newRole].permissions,
    })
  }

  const handlePermissionChange = (perm: Permission, checked: boolean) => {
    setForm({
      ...form,
      permissions: checked ? [...form.permissions, perm] : form.permissions.filter(p => p !== perm),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.name.trim() || !form.email.trim()) {
      setError('Name and email are required')
      return
    }

    if (!session) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/pos/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...session.headers },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || null,
          role: form.role,
          permissions: form.permissions,
          location_id: form.locationId,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to add staff member')
        return
      }

      // Reset form
      setForm({
        name: '',
        email: '',
        phone: '',
        role: 'worker',
        permissions: ['camera.output', 'camera.wastage'],
        locationId: null,
      })
      setShowForm(false)
      await loadStaff()
    } catch (err) {
      setError('Network error — please try again')
    } finally {
      setSubmitting(false)
    }
  }

  if (!authReady || !session)
    return (
      <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 36, height: 36, border: `3px solid ${ACCENT}20`, borderTopColor: ACCENT, borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f1f5f9', fontFamily: 'system-ui, sans-serif', paddingBottom: 40 }}>
      {/* Header */}
      <div style={{ background: '#1e293b', borderBottom: `1px solid #334155`, padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => router.push('/factory')}
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: '#334155',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#cbd5e1',
            }}
          >
            <IconArrowLeft size={18} />
          </button>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: ACCENT }}>👥 Factory Staff</div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>Manage team & assign permissions</div>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            background: ACCENT,
            border: 'none',
            borderRadius: 10,
            padding: '10px 16px',
            color: '#1a1206',
            fontWeight: 700,
            fontSize: 14,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <IconPlus size={18} />
          Add Staff
        </button>
      </div>

      <div style={{ padding: '20px', maxWidth: 1000, margin: '0 auto' }}>
        {/* Add Staff Form */}
        {showForm && (
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 14, padding: 20, marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: ACCENT }}>Add New Staff Member</h3>

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '12px 14px', marginBottom: 16, fontSize: 13, color: '#ef4444' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Name & Email */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g., John Operator"
                    style={{
                      width: '100%',
                      background: '#0f172a',
                      border: '1px solid #334155',
                      borderRadius: 8,
                      padding: '10px 12px',
                      color: '#f1f5f9',
                      fontSize: 14,
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>Email *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="john@factory.local"
                    style={{
                      width: '100%',
                      background: '#0f172a',
                      border: '1px solid #334155',
                      borderRadius: 8,
                      padding: '10px 12px',
                      color: '#f1f5f9',
                      fontSize: 14,
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              {/* Phone & Location */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>Phone</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    placeholder="+1 234 567 8900"
                    style={{
                      width: '100%',
                      background: '#0f172a',
                      border: '1px solid #334155',
                      borderRadius: 8,
                      padding: '10px 12px',
                      color: '#f1f5f9',
                      fontSize: 14,
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>Location</label>
                  <select
                    value={form.locationId || ''}
                    onChange={e => setForm({ ...form, locationId: e.target.value || null })}
                    style={{
                      width: '100%',
                      background: '#0f172a',
                      border: '1px solid #334155',
                      borderRadius: 8,
                      padding: '10px 12px',
                      color: '#f1f5f9',
                      fontSize: 14,
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  >
                    <option value="">Select location...</option>
                    {locations.map(loc => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 10 }}>Factory Role *</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                  {(Object.entries(ROLE_CONFIG) as Array<[FactoryRole, typeof ROLE_CONFIG[FactoryRole]]>).map(([role, config]) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => handleRoleChange(role)}
                      style={{
                        background: form.role === role ? ACCENT : '#0f172a',
                        border: `1.5px solid ${form.role === role ? ACCENT : '#334155'}`,
                        borderRadius: 10,
                        padding: '12px 14px',
                        color: form.role === role ? '#1a1206' : '#f1f5f9',
                        fontWeight: 700,
                        fontSize: 14,
                        cursor: 'pointer',
                        transition: 'all 150ms',
                      }}
                    >
                      {config.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Permissions */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 10 }}>Permissions</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {(Object.entries(PERMISSION_LABELS) as Array<[Permission, string]>).map(([perm, label]) => (
                    <label key={perm} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={form.permissions.includes(perm)}
                        onChange={e => handlePermissionChange(perm, e.target.checked)}
                        style={{ width: 18, height: 18, cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: 14, color: '#e2e8f0' }}>{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Form Actions */}
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    flex: 1,
                    background: ACCENT,
                    border: 'none',
                    borderRadius: 10,
                    padding: '12px 16px',
                    color: '#1a1206',
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    opacity: submitting ? 0.5 : 1,
                  }}
                >
                  {submitting ? 'Adding...' : 'Add Staff Member'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  style={{
                    flex: 1,
                    background: '#334155',
                    border: 'none',
                    borderRadius: 10,
                    padding: '12px 16px',
                    color: '#f1f5f9',
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Staff List */}
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: ACCENT }}>
            Team Members ({staff.length})
          </h3>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>Loading staff...</div>
          ) : staff.length === 0 ? (
            <div style={{ background: '#1e293b', border: '1px dashed #334155', borderRadius: 14, padding: '40px 20px', textAlign: 'center', color: '#94a3b8' }}>
              <div style={{ fontSize: 14, marginBottom: 8 }}>No staff members yet</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>Click "Add Staff" to create the first team member</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {staff.map(member => (
                <div
                  key={member.id}
                  style={{
                    background: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: 12,
                    padding: '16px',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr auto',
                    gap: 16,
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#f1f5f9' }}>{member.name}</div>
                    <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{member.email}</div>
                    {member.phone && <div style={{ fontSize: 11, color: '#64748b', marginTop: 1 }}>{member.phone}</div>}
                  </div>

                  <div>
                    <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Role</div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: ACCENT }}>{ROLE_CONFIG[member.role].label}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Permissions</div>
                    <div style={{ fontSize: 12, color: '#e2e8f0' }}>
                      {member.permissions.length > 0 ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                          {member.permissions.map(p => (
                            <span key={p} style={{ background: `${ACCENT}20`, color: ACCENT, padding: '2px 6px', borderRadius: 4, fontSize: 11, fontWeight: 600 }}>
                              {p.split('.')[1]}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span style={{ color: '#94a3b8' }}>None</span>
                      )}
                    </div>
                  </div>

                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      background: member.status === 'active' ? 'rgba(34,197,94,.15)' : 'rgba(148,163,184,.15)',
                      border: `1px solid ${member.status === 'active' ? 'rgba(34,197,94,.3)' : 'rgba(148,163,184,.3)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                    }}
                  >
                    {member.status === 'active' ? '✓' : '○'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
