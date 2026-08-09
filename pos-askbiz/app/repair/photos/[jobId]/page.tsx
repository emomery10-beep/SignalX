'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

// Public, unauthenticated page — what a customer lands on after tapping
// "View Photos" in the askbiz_photo_update WhatsApp message (see
// lib/whatsapp.ts's sendPhotoUpdate). No login, no price, no staff-only
// data — just the shared photo gallery for their own repair.
interface Photo { photo_url: string; stage: 'in_progress' | 'completed'; created_at: string }

const tokens = {
  bg: 'var(--pos-bg)', surface: 'var(--pos-surface)', border: 'var(--pos-border)',
  ink: 'var(--pos-ink)', muted: 'var(--pos-muted)', hint: 'var(--pos-hint)', accent: 'var(--pos-accent)',
}

export default function PublicRepairPhotos() {
  const params = useParams()
  const jobId = params?.jobId as string
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [data, setData] = useState<{ ticket_number: string; device_model: string | null; photos: Photo[] } | null>(null)

  useEffect(() => {
    if (!jobId) return
    fetch(`/api/pos/service-jobs/photos/public?job=${jobId}`)
      .then(async r => {
        if (!r.ok) { setError(r.status === 404 ? 'This link is no longer valid.' : 'Could not load photos.'); return }
        setData(await r.json())
      })
      .catch(() => setError('Could not load photos.'))
      .finally(() => setLoading(false))
  }, [jobId])

  return (
    <div style={{ minHeight: '100vh', background: tokens.bg, color: tokens.ink, fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ background: tokens.surface, borderBottom: `1px solid ${tokens.border}`, padding: '16px 20px' }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: tokens.accent }}>🔧 Repair Photo Update</div>
      </div>

      <div style={{ maxWidth: 480, margin: '0 auto', padding: '20px' }}>
        {loading && <div style={{ color: tokens.hint, fontSize: 14, textAlign: 'center', padding: '40px 0' }}>Loading…</div>}
        {error && <div style={{ color: tokens.hint, fontSize: 14, textAlign: 'center', padding: '40px 0' }}>{error}</div>}

        {data && (
          <>
            <div style={{ background: tokens.surface, border: `1px solid ${tokens.border}`, borderRadius: 12, padding: 16, marginBottom: 16 }}>
              <div style={{ fontSize: 16, fontWeight: 700 }}>{data.device_model || 'Your device'}</div>
              <div style={{ fontSize: 12, color: tokens.muted, marginTop: 2 }}>Ticket #{data.ticket_number}</div>
            </div>

            {data.photos.length === 0 ? (
              <div style={{ color: tokens.hint, fontSize: 14, textAlign: 'center', padding: '40px 0' }}>No photos shared yet.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {data.photos.map((p, i) => (
                  <div key={i} style={{ background: tokens.surface, border: `1px solid ${tokens.border}`, borderRadius: 12, overflow: 'hidden' }}>
                    <img src={p.photo_url} alt={p.stage} style={{ width: '100%', display: 'block', maxHeight: 480, objectFit: 'cover' }} />
                    <div style={{ padding: '10px 14px', fontSize: 12, color: tokens.muted }}>
                      {p.stage === 'completed' ? 'Completed' : 'In progress'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
