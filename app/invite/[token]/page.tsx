'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useLang } from '@/components/LanguageProvider'

interface InviteData {
  email: string
  role: string
  name: string
  org_id: string
  invite_expires_at: string
}

const buildRoleLabels = (tc: (key: string) => string): Record<string, { label: string; desc: string }> => ({
  admin:      { label: tc('invite.role_admin_label'),      desc: tc('invite.role_admin_desc') },
  analyst:    { label: tc('invite.role_analyst_label'),    desc: tc('invite.role_analyst_desc') },
  accountant: { label: tc('invite.role_accountant_label'), desc: tc('invite.role_accountant_desc') },
  buyer:      { label: tc('invite.role_buyer_label'),      desc: tc('invite.role_buyer_desc') },
  viewer:     { label: tc('invite.role_viewer_label'),     desc: tc('invite.role_viewer_desc') },
})

export default function InvitePage({ params }: { params: { token: string } }) {
  const router = useRouter()
  const supabase = createClient()
  const { tc } = useLang()
  const ROLE_LABELS = buildRoleLabels(tc)

  const [invite, setInvite] = useState<InviteData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [step, setStep] = useState<'loading' | 'review' | 'signup' | 'signin' | 'accepting' | 'done' | 'expired'>('loading')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/team/invite/${params.token}`)
        if (!res.ok) {
          const data = await res.json()
          setError(data.error || tc('invite.error_invite_not_found'))
          setStep('expired')
          return
        }
        const data = await res.json()
        setInvite(data.invite)
        setEmail(data.invite.email)
        setName(data.invite.name || '')

        // Check if already logged in
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          if (user.email === data.invite.email) {
            // Already logged in as the right user — auto-accept
            setStep('accepting')
            await acceptInvite(params.token)
          } else {
            // Logged in as wrong user
            setError(tc('invite.error_wrong_user', { email: user.email || '', inviteEmail: data.invite.email }))
            setStep('review')
          }
        } else {
          setStep('review')
        }
      } catch (e) {
        setError(tc('invite.error_load_failed'))
        setStep('expired')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [params.token])

  const acceptInvite = async (token: any) => {
    const res = await fetch(`/api/team/invite/${token}`, { method: 'POST' })
    const data = await res.json()
    if (data.success) {
      setStep('done')
      setTimeout(() => router.push('/intelligence'), 2000)
    } else {
      setError(data.error || tc('invite.error_accept_failed'))
      setStep('review')
    }
  }

  const handleSignUp = async () => {
    setSubmitting(true)
    setError('')
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      })
      if (signUpError) { setError(signUpError.message); return }

      // Sign in immediately
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
      if (signInError) { setError(signInError.message); return }

      setStep('accepting')
      await acceptInvite(params.token)
    } finally {
      setSubmitting(false)
    }
  }

  const handleSignIn = async () => {
    setSubmitting(true)
    setError('')
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
      if (signInError) { setError(signInError.message); return }

      setStep('accepting')
      await acceptInvite(params.token)
    } finally {
      setSubmitting(false)
    }
  }

  const roleInfo = invite ? (ROLE_LABELS[invite.role] || { label: invite.role, desc: '' }) : null

  return (
    <div style={{ minHeight: '100vh', background: '#f4f3f1', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: 440, background: '#fff', borderRadius: 20, boxShadow: '0 4px 32px rgba(0,0,0,0.10)', overflow: 'hidden' }}>

        {/* Header */}
        <div style={{ background: '#6366F1', padding: '28px 32px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: '8px 14px', marginBottom: 12 }}>
            <svg width="16" height="16" viewBox="0 0 32 32" fill="none"><g fill="none" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 11 V5 H11"/><path d="M21 5 H27 V11"/><path d="M5 21 V27 H11"/><path d="M27 21 V27 H21"/></g><circle cx="16" cy="16" r="2.6" fill="white"/></svg>
            <span style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>AskBiz</span>
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)' }}>{tc('invite.tagline')}</div>
        </div>

        <div style={{ padding: '32px' }}>

          {/* LOADING */}
          {(step === 'loading' || loading) && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ width: 32, height: 32, border: '3px solid rgba(99,102,241,.2)', borderTopColor: '#6366F1', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }}></div>
              <div style={{ fontSize: 12, color: '#6b6760' }}>{tc('invite.loading')}</div>
            </div>
          )}

          {/* EXPIRED / ERROR */}
          {step === 'expired' && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 38, marginBottom: 12 }}>⏰</div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1a1916', marginBottom: 8 }}>{tc('invite.expired_title')}</h2>
              <p style={{ fontSize: 12, color: '#6b6760', lineHeight: 1.6, marginBottom: 20 }}>
                {error || tc('invite.expired_desc')}
              </p>
              <a href="https://askbiz.co" style={{ fontSize: 12, color: '#6366F1', textDecoration: 'none' }}>{tc('invite.go_to_askbiz')}</a>
            </div>
          )}

          {/* DONE */}
          {step === 'done' && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 38, marginBottom: 12 }}>✅</div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1a1916', marginBottom: 8 }}>{tc('invite.done_title')}</h2>
              <p style={{ fontSize: 12, color: '#6b6760', lineHeight: 1.6 }}>
                {tc('invite.done_desc')}
              </p>
            </div>
          )}

          {/* ACCEPTING */}
          {step === 'accepting' && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 32, height: 32, border: '3px solid rgba(99,102,241,.2)', borderTopColor: '#6366F1', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }}></div>
              <div style={{ fontSize: 12, color: '#6b6760' }}>{tc('invite.accepting')}</div>
            </div>
          )}

          {/* REVIEW — show invite details */}
          {step === 'review' && invite && roleInfo && (
            <>
              <div style={{ marginBottom: 20 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1a1916', marginBottom: 6 }}>{tc('invite.review_title')}</h2>
                <p style={{ fontSize: 12, color: '#6b6760', lineHeight: 1.6, margin: 0 }}>
                  {tc('invite.review_desc')}
                </p>
              </div>

              <div style={{ padding: '14px 16px', borderRadius: 12, background: 'rgba(99,102,241,.05)', border: '1px solid rgba(99,102,241,.15)', marginBottom: 20 }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: '#6366F1', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4 }}>{tc('invite.your_role')}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1916', marginBottom: 3 }}>{roleInfo.label}</div>
                <div style={{ fontSize: 11, color: '#6b6760' }}>{roleInfo.desc}</div>
              </div>

              {error && (
                <div style={{ padding: '10px 12px', borderRadius: 8, background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.2)', color: '#dc2626', fontSize: 11, marginBottom: 16 }}>
                  {error}
                </div>
              )}

              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setStep('signup')}
                  style={{ flex: 1, padding: '12px', borderRadius: 10, border: 'none', background: '#6366F1', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                  {tc('invite.create_account')}
                </button>
                <button onClick={() => setStep('signin')}
                  style={{ flex: 1, padding: '12px', borderRadius: 10, border: '1px solid #e8e6e1', background: '#fff', color: '#1a1916', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                  {tc('invite.sign_in')}
                </button>
              </div>
            </>
          )}

          {/* SIGN UP */}
          {step === 'signup' && (
            <>
              <div style={{ marginBottom: 20 }}>
                <button onClick={() => setStep('review')} style={{ fontSize: 11, color: '#6366F1', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit', marginBottom: 12 }}>
                  {tc('invite.back')}
                </button>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1a1916', marginBottom: 4 }}>{tc('invite.signup_title')}</h2>
                <p style={{ fontSize: 11, color: '#6b6760', margin: 0 }}>{tc('invite.signup_subtitle', { email: invite?.email || '' })}</p>
              </div>

              {error && (
                <div style={{ padding: '10px 12px', borderRadius: 8, background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.2)', color: '#dc2626', fontSize: 11, marginBottom: 16 }}>
                  {error}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                <input value={name} onChange={e => setName(e.target.value)} placeholder={tc('invite.placeholder_name')}
                  style={{ padding: '11px 14px', borderRadius: 9, border: '1px solid #e8e6e1', fontSize: 12, fontFamily: 'inherit', outline: 'none', color: '#1a1916' }}/>
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder={tc('invite.placeholder_email')} type="email"
                  style={{ padding: '11px 14px', borderRadius: 9, border: '1px solid #e8e6e1', fontSize: 12, fontFamily: 'inherit', outline: 'none', color: '#1a1916' }}/>
                <input value={password} onChange={e => setPassword(e.target.value)} placeholder={tc('invite.placeholder_choose_password')} type="password"
                  style={{ padding: '11px 14px', borderRadius: 9, border: '1px solid #e8e6e1', fontSize: 12, fontFamily: 'inherit', outline: 'none', color: '#1a1916' }}/>
              </div>

              <button onClick={handleSignUp} disabled={!email || !password || submitting}
                style={{ width: '100%', padding: '12px', borderRadius: 10, border: 'none', background: submitting ? '#e8e6e1' : '#6366F1', color: submitting ? '#a39e97' : '#fff', fontSize: 12, fontWeight: 600, cursor: submitting ? 'wait' : 'pointer', fontFamily: 'inherit' }}>
                {submitting ? tc('invite.signup_submitting') : tc('invite.signup_submit')}
              </button>
            </>
          )}

          {/* SIGN IN */}
          {step === 'signin' && (
            <>
              <div style={{ marginBottom: 20 }}>
                <button onClick={() => setStep('review')} style={{ fontSize: 11, color: '#6366F1', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit', marginBottom: 12 }}>
                  {tc('invite.back')}
                </button>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1a1916', marginBottom: 4 }}>{tc('invite.signin_title')}</h2>
                <p style={{ fontSize: 11, color: '#6b6760', margin: 0 }}>{tc('invite.signin_subtitle', { email: invite?.email || '' })}</p>
              </div>

              {error && (
                <div style={{ padding: '10px 12px', borderRadius: 8, background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.2)', color: '#dc2626', fontSize: 11, marginBottom: 16 }}>
                  {error}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder={tc('invite.placeholder_email')} type="email"
                  style={{ padding: '11px 14px', borderRadius: 9, border: '1px solid #e8e6e1', fontSize: 12, fontFamily: 'inherit', outline: 'none', color: '#1a1916' }}/>
                <input value={password} onChange={e => setPassword(e.target.value)} placeholder={tc('invite.placeholder_password')} type="password"
                  style={{ padding: '11px 14px', borderRadius: 9, border: '1px solid #e8e6e1', fontSize: 12, fontFamily: 'inherit', outline: 'none', color: '#1a1916' }}/>
              </div>

              <button onClick={handleSignIn} disabled={!email || !password || submitting}
                style={{ width: '100%', padding: '12px', borderRadius: 10, border: 'none', background: submitting ? '#e8e6e1' : '#6366F1', color: submitting ? '#a39e97' : '#fff', fontSize: 12, fontWeight: 600, cursor: submitting ? 'wait' : 'pointer', fontFamily: 'inherit' }}>
                {submitting ? tc('invite.signin_submitting') : tc('invite.signin_submit')}
              </button>
            </>
          )}

        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
