'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const ACC = '#f59e0b'
const API = process.env.NEXT_PUBLIC_API_URL || ''

const GOOD = '#22c55e'
const WARN = '#f59e0b'
const BAD = '#ef4444'

type CaptureType = 'intake' | 'output' | 'wastage' | 'dispatch'

interface Capture {
  id: string
  type: CaptureType
  product_name: string | null
  quantity: number | null
  batch_ref: string | null      // holds unit
  notes: string | null
  photo_url: string | null
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  captured_by_staff?: { id: string; name: string; role: string } | null
}

const TYPE_META: Record<CaptureType, { label: string; icon: string; color: string }> = {
  intake:   { label: 'Intake',   icon: '📥', color: '#3b82f6' },
  output:   { label: 'Output',   icon: '📤', color: GOOD },
  wastage:  { label: 'Wastage',  icon: '🗑️', color: BAD },
  dispatch: { label: 'Dispatch', icon: '🚚', color: '#8b5cf6' },
}

function timeAgo(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 60) return 'just now'
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return new Date(iso).toLocaleDateString()
}

export default function ApprovalsPage() {
  const router = useRouter()
  const supabase = createClient()
  const [ready, setReady] = useState(false)
  const [captures, setCaptures] = useState<Capture[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [patchUnsupported, setPatchUnsupported] = useState(false)

  // rejection modal
  const [rejecting, setRejecting] = useState<Capture | null>(null)
  const [reason, setReason] = useState('')

  // photo lightbox
  const [zoom, setZoom] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/pos'); return }
      setReady(true)
      fetch(`${API}/api/pos/config`).then(r => r.json()).catch(() => {})
    })
  }, [])

  useEffect(() => { if (ready) load() }, [ready])

  async function load() {
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/pos/factory/capture?status=pending&limit=100`)
      const data = res.ok ? await res.json() : { captures: [] }
      setCaptures(data.captures || [])
    } catch (e) {
      console.error('Approvals load error:', e)
    } finally {
      setLoading(false)
    }
  }

  async function decide(c: Capture, status: 'approved' | 'rejected', rejection_reason?: string) {
    setBusy(c.id)
    setError(null)
    try {
      const res = await fetch(`${API}/api/pos/factory/capture`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: c.id, status, ...(rejection_reason ? { rejection_reason } : {}) }),
      })
      if (res.status === 405) {
        // PATCH not supported on this deployment — surface clearly
        setPatchUnsupported(true)
        setError('Approve/reject (PATCH) is not enabled on this server build.')
        setBusy(null)
        return
      }
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error || 'Action failed.')
        setBusy(null)
        return
      }
      // remove from pending list
      setCaptures(prev => prev.filter(x => x.id !== c.id))
      setRejecting(null)
      setReason('')
    } catch {
      setError('Network error — please try again.')
    } finally {
      setBusy(null)
    }
  }

  function submitReject() {
    if (!rejecting) return
    if (!reason.trim()) { setError('A rejection reason is required.'); return }
    decide(rejecting, 'rejected', reason.trim())
  }

  if (!ready) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: '#f1f5f9', fontFamily: 'system-ui, sans-serif' }}>Loading…</div>
  }

  return (
    <div className="pos-screen" style={{ minHeight: '100vh', background: '#0f172a', color: '#f1f5f9', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button onClick={() => router.push('/factory')} style={{ background: '#334155', border: 'none', color: '#94a3b8', width: 36, height: 36, borderRadius: 8, cursor: 'pointer', fontSize: 18 }}>←</button>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: ACC }}>🏭 Pending Approvals</div>
            <div style={{ fontSize: 12, color: '#94a3b8' }}>{captures.length} capture{captures.length === 1 ? '' : 's'} awaiting sign-off</div>
          </div>
        </div>
        <button onClick={load} style={{ background: '#334155', border: 'none', color: '#94a3b8', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>↻ Refresh</button>
      </div>

      <div style={{ padding: '24px', maxWidth: 900, margin: '0 auto' }}>
        {error && (
          <div className="pos-banner" style={{ background: '#7f1d1d', border: `1px solid ${BAD}`, borderRadius: 10, padding: '12px 16px', marginBottom: 16, color: '#fee2e2', fontSize: 13 }}>{error}</div>
        )}
        {patchUnsupported && (
          <div className="pos-banner" style={{ background: '#451a03', border: `1px solid ${WARN}`, borderRadius: 10, padding: '12px 16px', marginBottom: 16, color: '#fde68a', fontSize: 13 }}>
            Note: this server build does not expose a PATCH endpoint for captures. Approvals cannot be recorded until it is enabled.
          </div>
        )}

        {loading ? (
          <div style={{ padding: 60, textAlign: 'center', color: '#64748b', fontSize: 13 }}>Loading pending captures…</div>
        ) : captures.length === 0 ? (
          <div className="pos-reveal" style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: 60, textAlign: 'center' }}>
            <div className="pos-success-icon" style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>All caught up</div>
            <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>No captures are waiting for approval.</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {captures.map((c, idx) => {
              const meta = TYPE_META[c.type]
              const working = busy === c.id
              return (
                <div key={c.id} className="pos-item" style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: 16, display: 'flex', gap: 16, animationDelay: `${Math.min(idx, 8) * 40}ms` }}>
                  {/* thumbnail */}
                  {c.photo_url ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={c.photo_url} alt="capture" onClick={() => setZoom(c.photo_url)} style={{ width: 96, height: 96, borderRadius: 10, objectFit: 'cover', border: `2px solid ${meta.color}55`, cursor: 'zoom-in', flexShrink: 0 }} />
                  ) : (
                    <div style={{ width: 96, height: 96, borderRadius: 10, background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0 }}>{meta.icon}</div>
                  )}

                  {/* body */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                      <span style={{ background: `${meta.color}22`, color: meta.color, padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700 }}>{meta.icon} {meta.label}</span>
                      <span style={{ fontSize: 11, color: '#64748b' }}>{c.captured_by_staff?.name || 'Operator'} · {timeAgo(c.created_at)}</span>
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9' }}>{c.product_name || 'Unspecified product'}</div>
                    <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>
                      {c.quantity != null ? `${c.quantity} ${c.batch_ref || ''}`.trim() : 'No quantity'}
                    </div>
                    {c.notes && <div style={{ fontSize: 13, color: '#cbd5e1', marginTop: 8, background: '#0f172a', borderRadius: 8, padding: '8px 12px', lineHeight: 1.4 }}>{c.notes}</div>}

                    {/* actions */}
                    <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                      <button onClick={() => decide(c, 'approved')} disabled={working || patchUnsupported} className="pos-btn-primary"
                        style={{ background: working ? '#334155' : GOOD, border: 'none', color: working ? '#94a3b8' : '#062b14', padding: '10px 20px', borderRadius: 8, cursor: working || patchUnsupported ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: 14, opacity: working || patchUnsupported ? 0.5 : 1 }}>
                        {working ? '…' : '✓ Approve'}
                      </button>
                      <button onClick={() => { setRejecting(c); setReason(''); setError(null) }} disabled={working || patchUnsupported}
                        style={{ background: 'transparent', border: `1px solid ${BAD}`, color: BAD, padding: '10px 20px', borderRadius: 8, cursor: working || patchUnsupported ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: 14, opacity: working || patchUnsupported ? 0.5 : 1 }}>
                        ✕ Reject
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Reject modal */}
      {rejecting && (
        <div onClick={() => !busy && setRejecting(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div onClick={e => e.stopPropagation()} className="pos-sheet" style={{ background: '#1e293b', borderRadius: 16, padding: 24, width: '100%', maxWidth: 440, border: `1px solid ${BAD}55` }}>
            <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 4 }}>Reject capture</div>
            <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 16 }}>{TYPE_META[rejecting.type].icon} {rejecting.product_name || 'Unspecified'} · {rejecting.quantity ?? '—'} {rejecting.batch_ref || ''}</div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Reason *</label>
            <textarea value={reason} onChange={e => setReason(e.target.value)} rows={3} autoFocus placeholder="Why is this capture being rejected?"
              style={{ width: '100%', padding: '12px 14px', background: '#0f172a', border: '1px solid #334155', borderRadius: 10, color: '#f1f5f9', fontSize: 14, outline: 'none', boxSizing: 'border-box', resize: 'vertical', fontFamily: 'system-ui, sans-serif' }} />
            {error && <div style={{ color: BAD, fontSize: 13, marginTop: 10 }}>{error}</div>}
            <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
              <button onClick={() => setRejecting(null)} disabled={!!busy} style={{ flex: 1, background: '#334155', border: 'none', color: '#e2e8f0', padding: '12px', borderRadius: 10, cursor: busy ? 'not-allowed' : 'pointer', fontWeight: 600, fontSize: 14, opacity: busy ? 0.5 : 1 }}>Cancel</button>
              <button onClick={submitReject} disabled={!!busy} style={{ flex: 1, background: BAD, border: 'none', color: '#fff', padding: '12px', borderRadius: 10, cursor: busy ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: 14, opacity: busy ? 0.5 : 1 }}>{busy ? 'Rejecting…' : 'Confirm reject'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Photo lightbox */}
      {zoom && (
        <div onClick={() => setZoom(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, cursor: 'zoom-out' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={zoom} alt="capture full" style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: 12 }} />
        </div>
      )}
    </div>
  )
}
