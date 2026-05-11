'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CookieConsent() {
  const [show, setShow] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [analytics, setAnalytics] = useState(true)
  const [marketing, setMarketing] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('askbiz_cookie_consent')
    if (!consent) setShow(true)
  }, [])

  const save = (acceptAll: boolean) => {
    const consent = {
      necessary: true,
      analytics: acceptAll ? true : analytics,
      marketing: acceptAll ? true : marketing,
      timestamp: new Date().toISOString(),
      version: '1.0',
    }
    localStorage.setItem('askbiz_cookie_consent', JSON.stringify(consent))
    // Save to DB if logged in
    fetch('/api/consent/cookies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(consent),
    }).catch(() => {})
    setShow(false)
  }

  if (!show) return null

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999,
      background: 'var(--sf)', borderTop: '1px solid var(--b)',
      padding: '16px 20px', boxShadow: '0 -4px 24px rgba(0,0,0,.12)',
    }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        {!showDetails ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 240 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--tx)', marginBottom: 4 }}>🍪 We use cookies</div>
              <p style={{ fontSize: 12, color: 'var(--tx3)', margin: 0, lineHeight: 1.6 }}>
                We use essential cookies to make AskBiz work, and optional analytics cookies to improve your experience.
                See our <Link href="/privacy" style={{ color: 'var(--acc)', textDecoration: 'none' }}>Privacy Policy</Link>.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', flexShrink: 0 }}>
              <button onClick={() => setShowDetails(true)}
                style={{ padding: '8px 14px', borderRadius: 9999, border: '1px solid var(--b)', background: 'transparent', color: 'var(--tx3)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
                Manage preferences
              </button>
              <button onClick={() => save(false)}
                style={{ padding: '8px 14px', borderRadius: 9999, border: '1px solid var(--b)', background: 'transparent', color: 'var(--tx2)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
                Essential only
              </button>
              <button onClick={() => save(true)}
                style={{ padding: '8px 16px', borderRadius: 9999, border: 'none', background: 'var(--acc)', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                Accept all
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--tx)', marginBottom: 12 }}>Cookie preferences</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
              {[
                { label: 'Essential cookies', desc: 'Required for login, security, and core features. Cannot be disabled.', value: true, locked: true, onChange: () => {} },
                { label: 'Analytics cookies', desc: 'Help us understand how you use AskBiz so we can improve it. No personal data shared with third parties.', value: analytics, locked: false, onChange: () => setAnalytics(a => !a) },
                { label: 'Marketing cookies', desc: 'Used to show relevant content about AskBiz features. Disabled by default.', value: marketing, locked: false, onChange: () => setMarketing(m => !m) },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, padding: '10px 12px', borderRadius: 10, background: 'var(--ev)', border: '1px solid var(--b)' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--tx)', marginBottom: 2 }}>{item.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--tx3)' }}>{item.desc}</div>
                  </div>
                  <div style={{ flexShrink: 0 }}>
                    {item.locked ? (
                      <span style={{ fontSize: 11, color: 'var(--tx3)', fontWeight: 500 }}>Always on</span>
                    ) : (
                      <button onClick={item.onChange} style={{
                        width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
                        background: item.value ? 'var(--acc)' : 'var(--b2)',
                        position: 'relative', transition: 'background 200ms',
                      }}>
                        <div style={{
                          position: 'absolute', top: 3, left: item.value ? 22 : 3,
                          width: 18, height: 18, borderRadius: '50%', background: '#fff',
                          transition: 'left 200ms',
                        }}/>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button onClick={() => save(false)}
                style={{ padding: '8px 16px', borderRadius: 9999, border: '1px solid var(--b)', background: 'transparent', color: 'var(--tx2)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
                Save preferences
              </button>
              <button onClick={() => save(true)}
                style={{ padding: '8px 16px', borderRadius: 9999, border: 'none', background: 'var(--acc)', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                Accept all
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
