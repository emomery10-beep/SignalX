'use client'
import { useState } from 'react'

const TX  = '#1a1916'
const TX3 = '#a39e97'
const SF  = '#ffffff'
const ACC = '#d08a59'

export default function PreviewBilling() {
  const [mpesaPhone, setMpesaPhone]       = useState('')
  const [mpesaTarget, setMpesaTarget]     = useState<string|null>(null)
  const [mpesaPolling, setMpesaPolling]   = useState(false)
  const [mpesaStatus, setMpesaStatus]     = useState<'idle'|'sent'|'success'|'failed'|'cancelled'>('idle')
  const [posSeats, setPosSeats]           = useState(1)
  const currentPlan: string = 'free'
  const posEnabled = false

  const handleMpesaPay = async (planOrSeats: string, seats?: number) => {
    if (!mpesaPhone) { alert('Enter your M-Pesa phone number'); return }
    setMpesaTarget(planOrSeats)
    setMpesaStatus('sent')
    setMpesaPolling(true)
    // In preview mode, just simulate the flow
    setTimeout(() => { setMpesaPolling(false); setMpesaStatus('success') }, 4000)
  }

  return (
    <div style={{ maxWidth: 680, margin: '40px auto', padding: '0 20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Billing Preview</h1>
      <p style={{ fontSize: 11, color: TX3, marginBottom: 28 }}>Preview of M-Pesa payment section (no auth required)</p>

      {/* M-Pesa payment section */}
      <div style={{ borderRadius: 18, border: '1px solid rgba(76,175,80,.3)', background: 'rgba(76,175,80,.03)', padding: '22px 24px', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: '#4CAF50', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M12 1v4M12 19v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M1 12h4M19 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
          </div>
          <div>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#4CAF50' }}>Pay with M-Pesa</span>
            <div style={{ fontSize: 10, color: TX3 }}>Lipa Na M-Pesa — pay directly from your phone</div>
          </div>
        </div>

        {mpesaStatus === 'success' ? (
          <div style={{ padding: '14px 18px', borderRadius: 12, background: 'rgba(34,197,94,.08)', border: '1px solid rgba(34,197,94,.2)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
            <span style={{ fontSize: 11, color: '#16a34a', fontWeight: 600 }}>Payment confirmed! Activating your plan…</span>
          </div>
        ) : mpesaStatus === 'cancelled' ? (
          <div style={{ padding: '14px 18px', borderRadius: 12, background: 'rgba(239,68,68,.06)', border: '1px solid rgba(239,68,68,.2)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 11, color: '#dc2626' }}>Payment was cancelled. Try again when ready.</span>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
              <input
                type="tel"
                placeholder="e.g. 0712345678"
                value={mpesaPhone}
                onChange={e => setMpesaPhone(e.target.value)}
                style={{ flex: '1 1 180px', padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(76,175,80,.3)', background: SF, fontSize: 12, fontFamily: 'inherit', outline: 'none', color: TX }}
              />
            </div>

            {mpesaStatus === 'sent' && mpesaPolling && (
              <div style={{ padding: '12px 16px', borderRadius: 10, background: 'rgba(76,175,80,.06)', border: '1px solid rgba(76,175,80,.15)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 16, height: 16, border: '2px solid #4CAF50', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                <span style={{ fontSize: 11, color: '#4CAF50', fontWeight: 500 }}>Check your phone — enter your M-Pesa PIN to confirm</span>
              </div>
            )}

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {currentPlan !== 'growth' && (
                <button
                  onClick={() => handleMpesaPay('growth')}
                  disabled={mpesaPolling}
                  style={{ padding: '10px 20px', borderRadius: 10, border: 'none', background: '#4CAF50', color: '#fff', fontSize: 11, fontWeight: 600, cursor: mpesaPolling ? 'default' : 'pointer', fontFamily: 'inherit', opacity: mpesaPolling ? .6 : 1 }}
                >
                  {mpesaPolling && mpesaTarget === 'growth' ? 'Waiting…' : 'Growth — KES 2,400/mo'}
                </button>
              )}
              {currentPlan !== 'business' && (
                <button
                  onClick={() => handleMpesaPay('business')}
                  disabled={mpesaPolling}
                  style={{ padding: '10px 20px', borderRadius: 10, border: 'none', background: '#388E3C', color: '#fff', fontSize: 11, fontWeight: 600, cursor: mpesaPolling ? 'default' : 'pointer', fontFamily: 'inherit', opacity: mpesaPolling ? .6 : 1 }}
                >
                  {mpesaPolling && mpesaTarget === 'business' ? 'Waiting…' : 'Business — KES 4,900/mo'}
                </button>
              )}
              {!posEnabled && (
                <button
                  onClick={() => handleMpesaPay('pos_seats', posSeats)}
                  disabled={mpesaPolling}
                  style={{ padding: '10px 20px', borderRadius: 10, border: '1px solid rgba(76,175,80,.4)', background: 'transparent', color: '#4CAF50', fontSize: 11, fontWeight: 600, cursor: mpesaPolling ? 'default' : 'pointer', fontFamily: 'inherit', opacity: mpesaPolling ? .6 : 1 }}
                >
                  {mpesaPolling && mpesaTarget === 'pos_seats' ? 'Waiting…' : `POS ${posSeats} seat${posSeats !== 1 ? 's' : ''} — KES ${(posSeats * 500).toLocaleString()}/mo`}
                </button>
              )}
            </div>

            <p style={{ fontSize: 9, color: TX3, marginTop: 12, lineHeight: 1.5 }}>
              An STK push will be sent to your phone. Enter your M-Pesa PIN to complete. Card payments via Stripe also available above.
            </p>
          </>
        )}

        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    </div>
  )
}
