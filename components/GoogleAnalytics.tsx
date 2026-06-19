'use client'
import Script from 'next/script'
import { useEffect, useState } from 'react'

const CONSENT_EVENT = 'askbiz:cookie-consent'

function readAnalyticsConsent(): boolean {
  try {
    const raw = localStorage.getItem('askbiz_cookie_consent')
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
    // On mount, check stored consent.
    setEnabled(readAnalyticsConsent())

    // React to consent changes dispatched by CookieConsent.
    const handler = () => setEnabled(readAnalyticsConsent())
    // Also react to changes from other tabs/windows.
    const storageHandler = (e: StorageEvent) => {
      if (e.key === 'askbiz_cookie_consent') handler()
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

          // Referrer-based auto-attribution: when a visit has no UTM tags but
          // came from a known social platform, derive the source from the real
          // document.referrer so GA4 records it as Social instead of "(unlabeled)".
          var cfg = { page_path: window.location.pathname };
          try {
            var hasUtm = /[?&]utm_source=/i.test(window.location.search);
            if (!hasUtm && document.referrer) {
              var refHost = new URL(document.referrer).hostname.replace(/^www\\./, '');
              var ownHost = window.location.hostname.replace(/^www\\./, '');
              if (refHost && refHost !== ownHost) {
                var MAP = {
                  'instagram.com':'instagram','l.instagram.com':'instagram',
                  'facebook.com':'facebook','l.facebook.com':'facebook','lm.facebook.com':'facebook','m.facebook.com':'facebook',
                  'tiktok.com':'tiktok',
                  'youtube.com':'youtube','m.youtube.com':'youtube','youtu.be':'youtube',
                  't.co':'twitter','twitter.com':'twitter','x.com':'twitter',
                  'linkedin.com':'linkedin','lnkd.in':'linkedin'
                };
                var src = MAP[refHost];
                if (!src) { for (var k in MAP) { if (refHost === k || refHost.indexOf('.' + k) === refHost.length - k.length - 1) { src = MAP[k]; break; } } }
                if (src) {
                  cfg.campaign_source = src;
                  cfg.campaign_medium = (src === 'youtube') ? 'video' : 'social';
                  cfg.campaign_name = 'referrer_auto';
                }
              }
            }
          } catch (e) {}

          gtag('config', '${measurementId}', cfg);
        `}
      </Script>
    </>
  )
}
