'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useLang } from '@/components/LanguageProvider'
import { ADMIN_EMAILS } from '@/lib/admin-auth'

interface SpotlightItem {
  id: string
  business_name: string
  tagline: string
  link_url: string | null
  logo_url: string | null
  status: 'pending' | 'approved' | 'rejected'
  is_active: boolean
  rejected_reason: string | null
  submitted_at: string
  reviewed_at: string | null
}

type Filter = 'pending' | 'approved' | 'rejected' | 'all'

export default function SpotlightAdminPage() {
  const { tc, fmtDate } = useLang()
  const router = useRouter()
  const supabase = createClient()
  const [authorized, setAuthorized] = useState(false)
  const [loading, setLoading]       = useState(true)
  const [filter, setFilter]         = useState<Filter>('pending')
  const [items, setItems]           = useState<SpotlightItem[]>([])
  const [actionId, setActionId]     = useState<string | null>(null)
  const [rejectingId, setRejectingId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')

  const authHeader = useCallback(async (): Promise<Record<string, string>> => {
    const { data: { session } } = await supabase.auth.getSession()
    return session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}
  }, [])

  const load = useCallback(async (status: Filter) => {
    setLoading(true)
    try {
      const headers = await authHeader()
      const res = await fetch(`/api/admin/spotlight?status=${status}`, { headers })
      if (res.ok) setItems((await res.json()).spotlights || [])
    } finally {
      setLoading(false)
    }
  }, [authHeader])

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || !ADMIN_EMAILS.includes(user.email || '')) { router.push('/'); return }
      setAuthorized(true)
      load(filter)
    }
    init()
  }, [])

  useEffect(() => { if (authorized) load(filter) }, [filter])

  const act = async (id: string, action: 'approve' | 'reject', reason?: string) => {
    setActionId(id)
    try {
      const headers = await authHeader()
      const res = await fetch('/api/admin/spotlight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({ id, action, reason }),
      })
      if (res.ok) {
        setItems(prev => prev.filter(i => i.id !== id))
        setRejectingId(null); setRejectReason('')
      }
    } finally {
      setActionId(null)
    }
  }

  if (!authorized) {
    return <div style={{ padding: 40, textAlign: 'center', color: 'var(--tx3)' }}>{loading ? tc('admin.loading') : null}</div>
  }

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 24px 60px' }}>
      <h1 style={{ fontFamily: 'var(--font-sora)', fontSize: 24, fontWeight: 700, marginBottom: 6 }}>{tc('admin.spotlight_title')}</h1>
      <p style={{ fontSize: 15, color: 'var(--tx3)', marginBottom: 20 }}>{tc('admin.spotlight_desc')}</p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {(['pending', 'approved', 'rejected', 'all'] as Filter[]).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{
              padding: '6px 14px', borderRadius: 9999, border: '1px solid var(--b2)', fontFamily: 'inherit',
              fontSize: 14, fontWeight: 600, cursor: 'pointer',
              background: filter === f ? 'var(--acc)' : 'var(--sf)',
              color: filter === f ? '#fff' : 'var(--tx2)',
            }}>
            {tc('admin.spotlight_filter_' + f)}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--tx3)' }}>{tc('admin.loading')}</div>
      ) : items.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--tx3)', background: 'var(--sf)', border: '1px solid var(--b)', borderRadius: 'var(--r-lg)' }}>
          {tc('admin.spotlight_empty')}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {items.map(item => (
            <div key={item.id} style={{ background: 'var(--sf)', border: '1px solid var(--b)', borderRadius: 'var(--r-lg)', padding: 16, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 56, height: 56, borderRadius: 12, background: 'var(--ev)', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {item.logo_url
                  ? <img src={item.logo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                  : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--tx3)" strokeWidth="1.6"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 16, fontWeight: 700 }}>{item.business_name}</div>
                <div style={{ fontSize: 14, color: 'var(--tx2)', marginTop: 2 }}>{item.tagline}</div>
                <div style={{ fontSize: 13, color: 'var(--tx3)', marginTop: 6, display: 'flex', gap: 10, flexWrap: 'wrap' as const }}>
                  <span>{tc('admin.spotlight_submitted')} {fmtDate ? fmtDate(item.submitted_at) : new Date(item.submitted_at).toLocaleDateString()}</span>
                  {item.link_url && <a href={item.link_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--acc)' }}>{item.link_url}</a>}
                </div>
                {item.status === 'rejected' && item.rejected_reason && (
                  <div style={{ fontSize: 13, color: '#dc2626', marginTop: 6 }}>{tc('admin.spotlight_reason_prefix')} {item.rejected_reason}</div>
                )}

                {rejectingId === item.id && (
                  <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                    <input
                      autoFocus value={rejectReason} onChange={e => setRejectReason(e.target.value)}
                      placeholder={tc('admin.spotlight_reason_placeholder')}
                      style={{ flex: 1, padding: '7px 10px', fontSize: 14, borderRadius: 8, border: '1px solid var(--b2)', background: 'var(--bg)', color: 'var(--tx)', fontFamily: 'inherit' }}
                    />
                    <button onClick={() => act(item.id, 'reject', rejectReason)} disabled={actionId === item.id}
                      style={{ padding: '7px 14px', borderRadius: 8, border: 'none', background: '#dc2626', color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
                      {tc('admin.spotlight_confirm_reject')}
                    </button>
                    <button onClick={() => { setRejectingId(null); setRejectReason('') }}
                      style={{ padding: '7px 14px', borderRadius: 8, border: '1px solid var(--b2)', background: 'transparent', color: 'var(--tx2)', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
                      {tc('admin.spotlight_cancel')}
                    </button>
                  </div>
                )}
              </div>

              {item.status === 'pending' && rejectingId !== item.id && (
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <button onClick={() => act(item.id, 'approve')} disabled={actionId === item.id}
                    style={{ padding: '7px 14px', borderRadius: 8, border: 'none', background: '#16a34a', color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer', opacity: actionId === item.id ? .6 : 1 }}>
                    {tc('admin.spotlight_approve')}
                  </button>
                  <button onClick={() => setRejectingId(item.id)} disabled={actionId === item.id}
                    style={{ padding: '7px 14px', borderRadius: 8, border: '1px solid var(--b2)', background: 'transparent', color: 'var(--tx2)', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
                    {tc('admin.spotlight_reject')}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
