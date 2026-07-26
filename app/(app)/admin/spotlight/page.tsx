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
  banner_url: string | null
  status: 'pending' | 'approved' | 'rejected'
  is_active: boolean
  rejected_reason: string | null
  submitted_at: string
  reviewed_at: string | null
  terms_accepted_at: string | null
  duration_days: number | null
  ends_at: string | null
  amount_charged: number | null
  currency: string | null
  impressions: number
  clicks: number
}

type Filter = 'pending' | 'approved' | 'rejected' | 'all'
type View = 'spotlights' | 'inquiries'
type InquiryFilter = 'pending' | 'contacted' | 'dismissed' | 'all'

interface InquiryItem {
  id: string
  name: string
  phone: string
  email: string
  status: 'pending' | 'contacted' | 'dismissed'
  submitted_at: string
  reviewed_at: string | null
}

export default function SpotlightAdminPage() {
  const { tc, fmtDate } = useLang()
  const router = useRouter()
  const supabase = createClient()
  const [authorized, setAuthorized] = useState(false)
  const [loading, setLoading]       = useState(true)
  const [view, setView]             = useState<View>('spotlights')
  const [filter, setFilter]         = useState<Filter>('pending')
  const [items, setItems]           = useState<SpotlightItem[]>([])
  const [actionId, setActionId]     = useState<string | null>(null)
  const [rejectingId, setRejectingId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [approvingId, setApprovingId] = useState<string | null>(null)
  const [approveDuration, setApproveDuration] = useState('30')
  const [approveAmount, setApproveAmount] = useState('')
  const [approveCurrency, setApproveCurrency] = useState('')

  const [inqFilter, setInqFilter]     = useState<InquiryFilter>('pending')
  const [inqItems, setInqItems]       = useState<InquiryItem[]>([])
  const [inqLoading, setInqLoading]   = useState(false)
  const [inqActionId, setInqActionId] = useState<string | null>(null)

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

  const loadInquiries = useCallback(async (status: InquiryFilter) => {
    setInqLoading(true)
    try {
      const headers = await authHeader()
      const res = await fetch(`/api/admin/spotlight-inquiries?status=${status}`, { headers })
      if (res.ok) setInqItems((await res.json()).inquiries || [])
    } finally {
      setInqLoading(false)
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

  useEffect(() => { if (authorized && view === 'spotlights') load(filter) }, [filter])
  useEffect(() => { if (authorized && view === 'inquiries') loadInquiries(inqFilter) }, [view, inqFilter])

  const act = async (id: string, action: 'approve' | 'reject', reason?: string) => {
    setActionId(id)
    try {
      const headers = await authHeader()
      const body: Record<string, unknown> = { id, action, reason }
      if (action === 'approve') {
        const days = parseInt(approveDuration, 10)
        body.duration_days = Number.isFinite(days) && days > 0 ? days : 30
        if (approveAmount.trim()) body.amount_charged = parseFloat(approveAmount)
        if (approveCurrency.trim()) body.currency = approveCurrency.trim().toUpperCase()
      }
      const res = await fetch('/api/admin/spotlight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify(body),
      })
      if (res.ok) {
        setItems(prev => prev.filter(i => i.id !== id))
        setRejectingId(null); setRejectReason('')
        setApprovingId(null); setApproveDuration('30'); setApproveAmount(''); setApproveCurrency('')
      }
    } finally {
      setActionId(null)
    }
  }

  const actInquiry = async (id: string, action: 'contact' | 'dismiss') => {
    setInqActionId(id)
    try {
      const headers = await authHeader()
      const res = await fetch('/api/admin/spotlight-inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({ id, action }),
      })
      if (res.ok) setInqItems(prev => prev.filter(i => i.id !== id))
    } finally {
      setInqActionId(null)
    }
  }

  if (!authorized) {
    return <div style={{ padding: 40, textAlign: 'center', color: 'var(--tx3)' }}>{loading ? tc('admin.loading') : null}</div>
  }

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 24px 60px' }}>
      <h1 style={{ fontFamily: 'var(--font-sora)', fontSize: 24, fontWeight: 700, marginBottom: 6 }}>{tc('admin.spotlight_title')}</h1>
      <p style={{ fontSize: 15, color: 'var(--tx3)', marginBottom: 20 }}>{tc('admin.spotlight_desc')}</p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, borderBottom: '1px solid var(--b)', paddingBottom: 16 }}>
        {(['spotlights', 'inquiries'] as View[]).map(v => (
          <button key={v} onClick={() => setView(v)}
            style={{
              padding: '6px 14px', borderRadius: 9999, border: 'none', fontFamily: 'inherit',
              fontSize: 14, fontWeight: 700, cursor: 'pointer',
              background: view === v ? 'var(--tx)' : 'transparent',
              color: view === v ? 'var(--bg)' : 'var(--tx2)',
            }}>
            {tc('admin.spotlight_view_' + v)}
          </button>
        ))}
      </div>

      {view === 'spotlights' && (<>
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

      {filter === 'pending' && (
        <div style={{ padding: '12px 16px', marginBottom: 16, borderRadius: 'var(--r-lg)', background: 'rgba(180,83,9,.06)', border: '1px solid rgba(180,83,9,.25)', fontSize: 13, color: 'var(--tx2)', lineHeight: 1.6 }}>
          <strong style={{ color: 'var(--tx)' }}>{tc('admin.spotlight_checklist_title')}</strong> {tc('admin.spotlight_checklist_body')}
        </div>
      )}

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
              {item.banner_url ? (
                <div style={{ width: 96, height: 48, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
                  <img src={item.banner_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                </div>
              ) : (
                <div style={{ width: 56, height: 56, borderRadius: 12, background: 'var(--ev)', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {item.logo_url
                    ? <img src={item.logo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                    : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--tx3)" strokeWidth="1.6"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>}
                </div>
              )}

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 16, fontWeight: 700 }}>{item.business_name}</div>
                <div style={{ fontSize: 14, color: 'var(--tx2)', marginTop: 2 }}>{item.tagline}</div>
                <div style={{ fontSize: 13, color: 'var(--tx3)', marginTop: 6, display: 'flex', gap: 10, flexWrap: 'wrap' as const }}>
                  <span>{tc('admin.spotlight_submitted')} {fmtDate ? fmtDate(item.submitted_at) : new Date(item.submitted_at).toLocaleDateString()}</span>
                  {item.link_url && <a href={item.link_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--acc)' }}>{item.link_url}</a>}
                  {!item.terms_accepted_at && <span style={{ color: '#b45309' }}>{tc('admin.spotlight_no_terms')}</span>}
                </div>
                {item.status === 'approved' && (
                  <div style={{ fontSize: 13, color: 'var(--tx3)', marginTop: 6, display: 'flex', gap: 10, flexWrap: 'wrap' as const }}>
                    {item.ends_at && <span>{tc('admin.spotlight_ends')} {fmtDate ? fmtDate(item.ends_at) : new Date(item.ends_at).toLocaleDateString()}</span>}
                    <span>{item.impressions || 0} {tc('admin.spotlight_impressions')} · {item.clicks || 0} {tc('admin.spotlight_clicks')}</span>
                    {item.amount_charged != null && <span>{item.currency || ''} {item.amount_charged}</span>}
                  </div>
                )}
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

                {approvingId === item.id && (
                  <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' as const, alignItems: 'center' }}>
                    <label style={{ fontSize: 13, color: 'var(--tx3)' }}>{tc('admin.spotlight_duration_label')}</label>
                    <input
                      autoFocus type="number" min={1} value={approveDuration} onChange={e => setApproveDuration(e.target.value)}
                      style={{ width: 64, padding: '7px 10px', fontSize: 14, borderRadius: 8, border: '1px solid var(--b2)', background: 'var(--bg)', color: 'var(--tx)', fontFamily: 'inherit' }}
                    />
                    <input
                      placeholder={tc('admin.spotlight_amount_placeholder')} value={approveAmount} onChange={e => setApproveAmount(e.target.value)}
                      style={{ width: 90, padding: '7px 10px', fontSize: 14, borderRadius: 8, border: '1px solid var(--b2)', background: 'var(--bg)', color: 'var(--tx)', fontFamily: 'inherit' }}
                    />
                    <input
                      placeholder={tc('admin.spotlight_currency_placeholder')} value={approveCurrency} onChange={e => setApproveCurrency(e.target.value)}
                      style={{ width: 70, padding: '7px 10px', fontSize: 14, borderRadius: 8, border: '1px solid var(--b2)', background: 'var(--bg)', color: 'var(--tx)', fontFamily: 'inherit' }}
                    />
                    <button onClick={() => act(item.id, 'approve')} disabled={actionId === item.id}
                      style={{ padding: '7px 14px', borderRadius: 8, border: 'none', background: '#16a34a', color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
                      {tc('admin.spotlight_confirm_approve')}
                    </button>
                    <button onClick={() => setApprovingId(null)}
                      style={{ padding: '7px 14px', borderRadius: 8, border: '1px solid var(--b2)', background: 'transparent', color: 'var(--tx2)', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
                      {tc('admin.spotlight_cancel')}
                    </button>
                  </div>
                )}
              </div>

              {item.status === 'pending' && rejectingId !== item.id && approvingId !== item.id && (
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <button onClick={() => setApprovingId(item.id)} disabled={actionId === item.id}
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
      </>)}

      {view === 'inquiries' && (<>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {(['pending', 'contacted', 'dismissed', 'all'] as InquiryFilter[]).map(f => (
          <button key={f} onClick={() => setInqFilter(f)}
            style={{
              padding: '6px 14px', borderRadius: 9999, border: '1px solid var(--b2)', fontFamily: 'inherit',
              fontSize: 14, fontWeight: 600, cursor: 'pointer',
              background: inqFilter === f ? 'var(--acc)' : 'var(--sf)',
              color: inqFilter === f ? '#fff' : 'var(--tx2)',
            }}>
            {tc('admin.spotlight_filter_' + f)}
          </button>
        ))}
      </div>

      {inqLoading ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--tx3)' }}>{tc('admin.loading')}</div>
      ) : inqItems.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--tx3)', background: 'var(--sf)', border: '1px solid var(--b)', borderRadius: 'var(--r-lg)' }}>
          {tc('admin.spotlight_inquiries_empty')}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {inqItems.map(item => (
            <div key={item.id} style={{ background: 'var(--sf)', border: '1px solid var(--b)', borderRadius: 'var(--r-lg)', padding: 16, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 16, fontWeight: 700 }}>{item.name}</div>
                <div style={{ fontSize: 14, color: 'var(--tx2)', marginTop: 4, display: 'flex', gap: 14, flexWrap: 'wrap' as const }}>
                  <a href={`tel:${item.phone}`} style={{ color: 'var(--acc)' }}>{item.phone}</a>
                  <a href={`mailto:${item.email}`} style={{ color: 'var(--acc)' }}>{item.email}</a>
                </div>
                <div style={{ fontSize: 13, color: 'var(--tx3)', marginTop: 6 }}>
                  {tc('admin.spotlight_submitted')} {fmtDate ? fmtDate(item.submitted_at) : new Date(item.submitted_at).toLocaleDateString()}
                </div>
              </div>

              {item.status === 'pending' && (
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <button onClick={() => actInquiry(item.id, 'contact')} disabled={inqActionId === item.id}
                    style={{ padding: '7px 14px', borderRadius: 8, border: 'none', background: '#16a34a', color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer', opacity: inqActionId === item.id ? .6 : 1 }}>
                    {tc('admin.spotlight_inquiry_contact')}
                  </button>
                  <button onClick={() => actInquiry(item.id, 'dismiss')} disabled={inqActionId === item.id}
                    style={{ padding: '7px 14px', borderRadius: 8, border: '1px solid var(--b2)', background: 'transparent', color: 'var(--tx2)', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
                    {tc('admin.spotlight_inquiry_dismiss')}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      </>)}
    </div>
  )
}
