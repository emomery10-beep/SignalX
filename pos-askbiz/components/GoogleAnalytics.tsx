'use client'
import Script from 'next/script'
import { useEffect, useState } from 'react'

const CONSENT_KEY = 'pos_cookie_consent'
const CONSENT_EVENT = 'pos:cookie-consent'

function readAnalyticsConsent(): boolean {
  try {
    const raw = localStorage.getItem(CONSENT_KEY)
    if (!raw) return false
    const parsed = JSON.parse(raw)
    return parsed?.analytics === true
  } catch {
    return false
  }
}

export default function GoogleAnalytics({ measurementId }: { measurementId: string }) {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    setEnabled(readAnalyticsConsent())

    const handler = () => setEnabled(readAnalyticsConsent())
    const storageHandler = (e: StorageEvent) => {
      if (e.key === CONSENT_KEY) handler()
    }
    window.addEventListener(CONSENT_EVENT, handler)
    window.addEventListener('storage', storageHandler)
    return () => {
      window.removeEventListener(CONSENT_EVENT, handler)
      window.removeEventListener('storage', storageHandler)
    }
  }, [])

  // No consent (or analytics declined) => render nothing. No gtag, no network calls.
  if (!enabled) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('consent', 'default', {
            analytics_storage: 'denied',
          });
          gtag('consent', 'update', {
            analytics_storage: 'granted',
          });
          gtag('config', '${measurementId}', { page_path: window.location.pathname });
        `}
      </Script>
    </>
  )
}
