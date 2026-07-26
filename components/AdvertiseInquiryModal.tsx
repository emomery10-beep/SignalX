'use client'
import { useEffect, useState } from 'react'
import { useLang } from '@/components/LanguageProvider'

const inputStyle = {
  width: '100%', minHeight: 0, padding: '10px 14px', borderRadius: 10, border: '1px solid var(--b2)',
  background: 'var(--sf)', color: 'var(--tx)', fontFamily: 'inherit', fontSize: 14,
}

// Anonymous lead-capture form opened by the floating "Advertise here" bubble
// on the signin page (app/(auth)/signin/page.tsx). Posts to the public
// app/api/advertise-inquiry route, which lands the lead in the
// advertise_inquiries table for an admin to action at /admin/spotlight →
// Inquiries. Deliberately no auth — a prospective advertiser browsing the
// signin page isn't necessarily an existing account holder.
export default function AdvertiseInquiryModal({ onClose }: { onClose: () => void }) {
  const { tc } = useLang()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const submit = async () => {
    setError('')
    if (!name.trim() || !phone.trim() || !email.trim()) {
      setError(tc('auth.advertise_modal_required'))
      return
    }
    // Explicit, default-unchecked opt-in — captured before any marketing
    // contact is made, per POPIA §69 and Nigeria's NDPA consent standard.
    if (!consent) {
      setError(tc('auth.advertise_modal_consent_required'))
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/advertise-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, email, consent: true }),
      })
      const d = await res.json()
      if (res.ok) setSubmitted(true)
      else setError(d.error || tc('auth.advertise_modal_error'))
    } catch {
      setError(tc('auth.advertise_modal_error'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onClick={e => e.stopPropagation()} className="animate-fade-up"
        style={{ width: '100%', maxWidth: 380, background: 'var(--bg)', borderRadius: 'var(--r-lg)', border: '1px solid var(--b)', padding: 28, position: 'relative' }}>
        <button onClick={onClose} aria-label={tc('common.close')}
          style={{ position: 'absolute', top: 14, right: 14, minHeight: 0, width: 28, height: 28, borderRadius: 9999, border: 'none', background: 'var(--sf)', color: 'var(--tx2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, lineHeight: 1 }}>
          ×
        </button>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '20px 0 8px' }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(22,163,74,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
            </div>
            <h2 style={{ fontFamily: 'var(--font-sora, Sora)', fontSize: 18, fontWeight: 700, marginBottom: 6 }}>{tc('auth.advertise_modal_success_title')}</h2>
            <p style={{ fontSize: 14, color: 'var(--tx2)', lineHeight: 1.5 }}>{tc('auth.advertise_modal_success_body')}</p>
          </div>
        ) : (
          <>
            <h2 style={{ fontFamily: 'var(--font-sora, Sora)', fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{tc('auth.advertise_modal_title')}</h2>
            <p style={{ fontSize: 14, color: 'var(--tx2)', marginBottom: 18, lineHeight: 1.5 }}>{tc('auth.advertise_modal_body')}</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input value={name} onChange={e => setName(e.target.value)} placeholder={tc('auth.advertise_modal_name')} style={inputStyle}/>
              <input value={phone} onChange={e => setPhone(e.target.value)} placeholder={tc('auth.advertise_modal_phone')} type="tel" style={inputStyle}/>
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder={tc('auth.advertise_modal_email')} type="email" style={inputStyle}/>
            </div>

            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginTop: 14, fontSize: 13, color: 'var(--tx2)', lineHeight: 1.4, cursor: 'pointer' }}>
              <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} style={{ marginTop: 2, flexShrink: 0 }}/>
              {tc('auth.advertise_modal_consent')}
            </label>

            {error && <p style={{ fontSize: 13, color: '#dc2626', marginTop: 10 }}>{error}</p>}

            <button onClick={submit} disabled={submitting}
              style={{ width: '100%', minHeight: 0, marginTop: 16, padding: '11px', borderRadius: 9999, border: 'none', background: 'var(--acc)', color: '#fff', fontFamily: 'var(--font-sora, Sora)', fontSize: 15, fontWeight: 600, cursor: submitting ? 'wait' : 'pointer', opacity: submitting ? .7 : 1 }}>
              {submitting ? tc('auth.please_wait') : tc('auth.advertise_modal_submit')}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
