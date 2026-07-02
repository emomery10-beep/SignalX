'use client'
import React from 'react'
import Link from 'next/link'
import { useLang } from '@/components/LanguageProvider'

const ACK_KEY = 'pos_consent_ack'

export default function PosConsentBanner() {
  const { tc } = useLang()
  const [visible, setVisible] = React.useState(false)

  React.useEffect(() => {
    try {
      if (!localStorage.getItem(ACK_KEY)) setVisible(true)
    } catch {
      /* localStorage unavailable — don't block the app */
    }
  }, [])

  const acknowledge = () => {
    try {
      localStorage.setItem(ACK_KEY, '1')
    } catch {
      /* ignore */
    }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-label={tc('common.consent_aria')}
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        padding: 'max(12px, env(safe-area-inset-bottom)) 14px 14px',
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          pointerEvents: 'auto',
          width: 'min(720px, 100%)',
          background: 'var(--pos-surface)',
          border: '1px solid var(--pos-border)',
          borderRadius: 14,
          boxShadow: '0 8px 28px rgba(26,25,22,0.16)',
          padding: '14px 16px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 12,
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <p
          style={{
            margin: 0,
            flex: '1 1 280px',
            fontSize: 13.5,
            lineHeight: 1.6,
            color: 'var(--pos-muted)',
          }}
        >
          {tc('common.consent_notice')}{' '}
          <Link href="/privacy" style={{ color: 'var(--pos-accent)', textDecoration: 'underline' }}>
            {tc('common.consent_privacy')}
          </Link>{' '}
          ·{' '}
          <Link href="/cookies" style={{ color: 'var(--pos-accent)', textDecoration: 'underline' }}>
            {tc('common.consent_cookies')}
          </Link>
        </p>
        <button
          onClick={acknowledge}
          style={{
            flex: '0 0 auto',
            padding: '9px 22px',
            borderRadius: 9999,
            border: 'none',
            background: 'var(--pos-accent)',
            color: '#fff',
            fontFamily: 'inherit',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {tc('common.consent_got_it')}
        </button>
      </div>
    </div>
  )
}
