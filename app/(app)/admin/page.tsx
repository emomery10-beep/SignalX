'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const ADMIN_EMAIL = 'emomery10@gmail.com'
const ADMIN_EMAILS = ['emomery10@gmail.com', 'emomery10@googlemail.com']

interface Stats {
  totalUsers: number
  payingUsers: number
  freeUsers: number
  mrr: number
  newThisWeek: number
  newThisMonth: number
  suspiciousCount: number
}

interface UserRow {
  id: string
  email: string
  full_name: string
  plan_id: string
  business_type: string
  registration_country: string
  questions_used: number
  created_at: string
  is_suspicious: boolean
}

interface UpgradeCandidate {
  id: string
  email: string
  full_name: string
  questions_used: number
  business_type: string
  registration_country: string
}

const PLAN_COLORS: Record<string, string> = {
  free: '#6b6760',
  growth: '#d08a59',
  business: '#8c6fe0',
  enterprise: '#22c55e',
}

export default function AdminPage() {
  const router = useRouter()
  const supabase = createClient()
  const [authorized, setAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<Stats | null>(null)
  const [users, setUsers] = useState<UserRow[]>([])
  const [candidates, setCandidates] = useState<UpgradeCandidate[]>([])
  const [search, setSearch] = useState('')
  const [actionMsg, setActionMsg] = useState('')
  const [activeTab, setActiveTab] = useState<'overview'|'users'|'candidates'|'analytics'>('overview')

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !ADMIN_EMAILS.includes(user.email || '')) {
      router.push('/chat')
      return
    }
    setAuthorized(true)
    loadData()
  }

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin')
      const data = await res.json()
      setStats(data.stats)
      setUsers(data.users || [])
      setCandidates(data.candidates || [])
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  const changePlan = async (userId: string, planId: string) => {
    const res = await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'change_plan', userId, planId }),
    })
    const data = await res.json()
    if (data.success) {
      setActionMsg(`Plan updated to ${planId}`)
      loadData()
      setTimeout(() => setActionMsg(''), 3000)
    }
  }

  const filteredUsers = users.filter(u =>
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.full_name?.toLowerCase().includes(search.toLowerCase())
  )

  if (!authorized) return null

  const s: React.CSSProperties = { fontFamily: 'var(--font-dm, DM Sans)', background: 'var(--bg)', minHeight: '100vh', padding: '24px' }

  return (
    <div style={s} className="page-shell">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-sora)', fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
            🔐 AskBiz Admin
          </h1>
          <p style={{ fontSize: 13, color: 'var(--tx2)' }}>Restricted — emomery10@gmail.com only</p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          {(['overview','users','candidates','analytics'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ padding: '8px 16px', borderRadius: 9999, border: 'none', fontSize: 13, fontFamily: 'inherit', cursor: 'pointer',
                background: activeTab === tab ? 'var(--acc)' : 'var(--ev)',
                color: activeTab === tab ? '#fff' : 'var(--tx2)', fontWeight: activeTab === tab ? 600 : 400 }}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
          <a href="/admin/agent"
            style={{ padding: '8px 16px', borderRadius: 9999, border: '1px solid #6366F1', background: 'rgba(99,102,241,.08)', color: '#6366F1', fontSize: 13, fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}>
            ⚡ Growth Agent
          </a>
          <button onClick={loadData} style={{ padding: '8px 14px', borderRadius: 9999, border: '1px solid var(--b2)', background: 'transparent', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
            ↻ Refresh
          </button>
        </div>
      </div>

      {actionMsg && (
        <div style={{ padding: '10px 16px', borderRadius: 10, background: 'rgba(34,197,94,.1)', border: '1px solid rgba(34,197,94,.3)', fontSize: 13, color: '#22c55e', marginBottom: 16 }}>
          ✓ {actionMsg}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--tx3)' }}>Loading…</div>
      ) : (
        <>
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && stats && (
            <div>
              {/* KPI Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14, marginBottom: 24 }}>
                {[
                  { label: 'MRR', value: `£${stats.mrr}`, sub: 'Monthly recurring revenue', color: '#d08a59', icon: '💰' },
                  { label: 'Paying users', value: stats.payingUsers, sub: 'Growth + Business', color: '#8c6fe0', icon: '💳' },
                  { label: 'Free users', value: stats.freeUsers, sub: 'Conversion opportunities', color: '#6b6760', icon: '👤' },
                  { label: 'Total users', value: stats.totalUsers, sub: 'All time signups', color: '#1a1916', icon: '📊' },
                  { label: 'New this week', value: stats.newThisWeek, sub: 'Last 7 days', color: '#22c55e', icon: '📈' },
                  { label: 'New this month', value: stats.newThisMonth, sub: 'Calendar month', color: '#60a5fa', icon: '🗓' },
                  { label: 'Upgrade candidates', value: candidates.length, sub: '7-9 questions used', color: '#f5c55a', icon: '⚡' },
                  { label: 'Suspicious accounts', value: stats.suspiciousCount, sub: 'IP fraud flagged', color: '#f48080', icon: '⚠️' },
                ].map((k, i) => (
                  <div key={i} style={{ padding: '18px', borderRadius: 16, border: '1px solid var(--b)', background: 'var(--sf)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                      <span style={{ fontSize: 22 }}>{k.icon}</span>
                    </div>
                    <div style={{ fontSize: 28, fontWeight: 700, fontFamily: 'var(--font-sora)', color: k.color, marginBottom: 4 }}>{k.value}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{k.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--tx3)' }}>{k.sub}</div>
                  </div>
                ))}
              </div>

              {/* Plan breakdown */}
              <div style={{ background: 'var(--sf)', border: '1px solid var(--b)', borderRadius: 16, padding: 20, marginBottom: 16 }}>
                <div style={{ fontFamily: 'var(--font-sora)', fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Plan distribution</div>
                {['free', 'growth', 'business', 'enterprise'].map(plan => {
                  const count = users.filter(u => u.plan_id === plan).length
                  const pct = stats.totalUsers > 0 ? Math.round((count / stats.totalUsers) * 100) : 0
                  return (
                    <div key={plan} style={{ marginBottom: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 500, textTransform: 'capitalize' }}>{plan}</span>
                        <span style={{ fontSize: 13, color: 'var(--tx2)' }}>{count} users ({pct}%)</span>
                      </div>
                      <div style={{ height: 8, borderRadius: 4, background: 'var(--ev)', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: PLAN_COLORS[plan], borderRadius: 4, transition: 'width 600ms' }}></div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Upload analytics summary */}
              <div style={{ background: 'var(--sf)', border: '1px solid var(--b)', borderRadius: 16, padding: 20 }}>
                <div style={{ fontFamily: 'var(--font-sora)', fontSize: 15, fontWeight: 600, marginBottom: 8 }}>Business type breakdown</div>
                <div style={{ fontSize: 12, color: 'var(--tx3)', marginBottom: 14 }}>Anonymised profile data — no business names or financial figures stored</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10 }}>
                  {['retail', 'ecommerce', 'distributor', 'exporter', 'other'].map(type => {
                    const count = users.filter(u => u.business_type === type).length
                    return (
                      <div key={type} style={{ padding: '12px 14px', borderRadius: 12, background: 'var(--ev)', border: '1px solid var(--b)' }}>
                        <div style={{ fontSize: 18, marginBottom: 4 }}>
                          {type === 'retail' ? '🛍️' : type === 'ecommerce' ? '🛒' : type === 'distributor' ? '🚚' : type === 'exporter' ? '✈️' : '💼'}
                        </div>
                        <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-sora)' }}>{count}</div>
                        <div style={{ fontSize: 12, color: 'var(--tx2)', textTransform: 'capitalize' }}>{type}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* USERS TAB */}
          {activeTab === 'users' && (
            <div>
              <div style={{ marginBottom: 16 }}>
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search by email or name…"
                  style={{ width: '100%', maxWidth: 400, padding: '10px 14px', borderRadius: 10, border: '1px solid var(--b2)', background: 'var(--ev)', fontFamily: 'inherit', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}/>
              </div>
              <div style={{ background: 'var(--sf)', border: '1px solid var(--b)', borderRadius: 16, overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: 'var(--ev)' }}>
                        {['Name', 'Email', 'Plan', 'Business Type', 'Country', 'Questions', 'Signed Up', 'Actions'].map(h => (
                          <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 600, whiteSpace: 'nowrap', fontSize: 12, color: 'var(--tx2)' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((u, i) => (
                        <tr key={u.id} style={{ borderTop: '1px solid var(--b)', background: u.is_suspicious ? 'rgba(244,128,128,.04)' : i % 2 === 0 ? 'var(--sf)' : 'rgba(249,248,246,.5)' }}>
                          <td style={{ padding: '10px 14px', fontWeight: 500 }}>{u.full_name || '—'} {u.is_suspicious && '⚠️'}</td>
                          <td style={{ padding: '10px 14px', color: 'var(--tx2)' }}>{u.email}</td>
                          <td style={{ padding: '10px 14px' }}>
                            <span style={{ padding: '3px 10px', borderRadius: 9999, fontSize: 11, fontWeight: 600, background: `${PLAN_COLORS[u.plan_id]}20`, color: PLAN_COLORS[u.plan_id] }}>
                              {u.plan_id}
                            </span>
                          </td>
                          <td style={{ padding: '10px 14px', color: 'var(--tx2)', textTransform: 'capitalize' }}>{u.business_type || '—'}</td>
                          <td style={{ padding: '10px 14px', color: 'var(--tx2)' }}>{u.registration_country || '—'}</td>
                          <td style={{ padding: '10px 14px' }}>
                            <div style={{ fontSize: 12, color: 'var(--tx2)' }}>{u.questions_used ?? 0} used</div>
                          </td>
                          <td style={{ padding: '10px 14px', color: 'var(--tx3)', fontSize: 12 }}>
                            {new Date(u.created_at).toLocaleDateString('en-GB')}
                          </td>
                          <td style={{ padding: '10px 14px' }}>
                            <select onChange={e => changePlan(u.id, e.target.value)} value={u.plan_id}
                              style={{ padding: '4px 8px', borderRadius: 8, border: '1px solid var(--b2)', background: 'var(--ev)', fontFamily: 'inherit', fontSize: 12, cursor: 'pointer' }}>
                              {['free', 'growth', 'business', 'enterprise'].map(p => (
                                <option key={p} value={p}>{p}</option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div style={{ padding: '10px 14px', borderTop: '1px solid var(--b)', fontSize: 12, color: 'var(--tx3)' }}>
                  Showing {filteredUsers.length} of {users.length} users
                </div>
              </div>
            </div>
          )}

          {/* UPGRADE CANDIDATES TAB */}
          {activeTab === 'candidates' && (
            <div>
              <div style={{ background: 'rgba(245,197,90,.08)', border: '1px solid rgba(245,197,90,.3)', borderRadius: 16, padding: '16px 20px', marginBottom: 20 }}>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>⚡ These users have used 7-9 of their 10 free questions</div>
                <div style={{ fontSize: 13, color: 'var(--tx2)' }}>They are your hottest leads. A personal message now converts at 15-25%. Email them: "I noticed you're getting a lot out of AskBiz — want a free week of Growth access?"</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {candidates.length === 0 ? (
                  <div style={{ padding: 40, textAlign: 'center', color: 'var(--tx3)' }}>No upgrade candidates right now</div>
                ) : candidates.map(c => (
                  <div key={c.id} style={{ padding: '16px 20px', borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: 2 }}>{c.full_name || 'User'}</div>
                      <div style={{ fontSize: 13, color: 'var(--tx2)' }}>{c.email}</div>
                      <div style={{ fontSize: 12, color: 'var(--tx3)', marginTop: 4 }}>
                        {c.business_type || 'Unknown type'} · {c.registration_country || 'Unknown country'}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-sora)', color: '#f5c55a' }}>{c.questions_used}/10</div>
                        <div style={{ fontSize: 11, color: 'var(--tx3)' }}>questions</div>
                      </div>
                      <button onClick={() => changePlan(c.id, 'growth')}
                        style={{ padding: '8px 16px', borderRadius: 9999, border: 'none', background: 'var(--acc)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                        Give Growth access →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ANALYTICS TAB */}
          {activeTab === 'analytics' && (
            <div>
              <div style={{ background: 'rgba(34,197,94,.06)', border: '1px solid rgba(34,197,94,.2)', borderRadius: 16, padding: '14px 18px', marginBottom: 20 }}>
                <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>✓ GDPR Compliant Analytics</div>
                <div style={{ fontSize: 12, color: 'var(--tx2)' }}>Only anonymised metadata is stored — file types, row counts, column patterns, business type, and country. No actual business data, customer names, or financial figures are ever stored.</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16 }}>
                {/* Country breakdown */}
                <div style={{ background: 'var(--sf)', border: '1px solid var(--b)', borderRadius: 16, padding: 20 }}>
                  <div style={{ fontFamily: 'var(--font-sora)', fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Users by country</div>
                  {Object.entries(
                    users.reduce((acc, u) => {
                      const c = u.registration_country || 'Unknown'
                      acc[c] = (acc[c] || 0) + 1
                      return acc
                    }, {} as Record<string, number>)
                  ).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([country, count]) => (
                    <div key={country} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--b)', fontSize: 13 }}>
                      <span>{country}</span>
                      <span style={{ fontWeight: 600 }}>{count}</span>
                    </div>
                  ))}
                </div>

                {/* Business type */}
                <div style={{ background: 'var(--sf)', border: '1px solid var(--b)', borderRadius: 16, padding: 20 }}>
                  <div style={{ fontFamily: 'var(--font-sora)', fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Business types</div>
                  {Object.entries(
                    users.reduce((acc, u) => {
                      const t = u.business_type || 'Unknown'
                      acc[t] = (acc[t] || 0) + 1
                      return acc
                    }, {} as Record<string, number>)
                  ).sort((a, b) => b[1] - a[1]).map(([type, count]) => (
                    <div key={type} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--b)', fontSize: 13 }}>
                      <span style={{ textTransform: 'capitalize' }}>{type}</span>
                      <span style={{ fontWeight: 600 }}>{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: 16, background: 'var(--sf)', border: '1px solid var(--b)', borderRadius: 16, padding: 20 }}>
                <div style={{ fontFamily: 'var(--font-sora)', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Upload analytics</div>
                <div style={{ fontSize: 13, color: 'var(--tx2)' }}>Run this in Supabase SQL editor to see upload patterns:</div>
                <div style={{ marginTop: 10, padding: '12px 16px', borderRadius: 10, background: 'var(--ev)', fontFamily: 'var(--font-mono, monospace)', fontSize: 12, color: 'var(--tx2)' }}>
                  SELECT column_names, COUNT(*) as uploads, AVG(row_count) as avg_rows FROM uploads GROUP BY column_names ORDER BY uploads DESC LIMIT 20;
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
