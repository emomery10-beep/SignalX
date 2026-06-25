'use client'
import Script from 'next/script'
import { useEffect } from 'react'

const CONSENT_EVENT = 'askbiz:cookie-consent'

function hasAnalyticsConsent(): boolean {
  try {
    const raw = localStorage.getItem('askbiz_cookie_consent')
    if (!raw) return false
    return JSON.parse(raw)?.analytics === true
  } catch {
    return false
  }
}

export default function TikTokPixel({ pixelId }: { pixelId: string }) {
  useEffect(() => {
    const applyConsent = () => {
      if (typeof window === 'undefined' || !(window as any).ttq) return
      if (hasAnalyticsConsent()) {
        ;(window as any).ttq.grantConsent()
      } else {
        ;(window as any).ttq.holdConsent()
      }
    }

    // Apply on mount (consent may already be stored)
    applyConsent()

    // Re-apply when the user interacts with the cookie banner
    const handler = () => applyConsent()
    const storageHandler = (e: StorageEvent) => {
      if (e.key === 'askbiz_cookie_consent') applyConsent()
    }
    window.addEventListener(CONSENT_EVENT, handler)
    window.addEventListener('storage', storageHandler)
    return () => {
      window.removeEventListener(CONSENT_EVENT, handler)
      window.removeEventListener('storage', storageHandler)
    }
  }, [])

  return (
    <Script id="tiktok-pixel" strategy="afterInteractive">
      {`
        !function (w, d, t) {
          w.TiktokAnalyticsObject=t;
          var ttq=w[t]=w[t]||[];
          ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"];
          ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
          for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
          ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};
          ttq.load=function(e,n){
            var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;
            ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};
            var s=document.createElement("script");
            s.type="text/javascript",s.async=!0,s.src=r+"?sdkid="+e+"&lib="+t;
            var a=document.getElementsByTagName("script")[0];
            a.parentNode.insertBefore(s,a)
          };
          ttq.load('${pixelId}');
          ttq.page();
        }(window, document, 'ttq');
      `}
    </Script>
  )
}
