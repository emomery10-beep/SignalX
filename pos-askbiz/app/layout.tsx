import type { Metadata, Viewport } from 'next'
import { cookies, headers } from 'next/headers'
import './globals.css'
import PosConsentBanner from '@/components/PosConsentBanner'
import { LanguageProvider } from '@/components/LanguageProvider'
import { resolveLocale, isRTL } from '@/lib/i18n-locale'
import type { Lang } from '@/lib/i18n'

export const metadata: Metadata = {
  title: 'AskBiz POS',
  description: 'Point of Sale — scan, sell, done.',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'AskBiz POS' },
}

export const viewport: Viewport = {
  themeColor: '#d08a59',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // POS app is all-authenticated → cookie/preference-driven locale (no URL prefix).
  const lang = resolveLocale({
    cookie: cookies().get('askbiz_lang')?.value,
    country: headers().get('x-vercel-ip-country'),
  }) as Lang

  return (
    <html lang={lang} dir={isRTL(lang) ? 'rtl' : 'ltr'}>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body style={{ margin: 0, fontFamily: 'system-ui, -apple-system, sans-serif', background: '#f9f8f6', color: '#1a1916', WebkitFontSmoothing: 'antialiased' }}>
        <LanguageProvider initialLang={lang}>
          {children}
          <PosConsentBanner />
        </LanguageProvider>
      </body>
    </html>
  )
}
