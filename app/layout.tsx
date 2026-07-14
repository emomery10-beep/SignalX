import type { Metadata } from 'next'
import { Sora, Instrument_Sans, JetBrains_Mono, Instrument_Serif, Plus_Jakarta_Sans } from 'next/font/google'
import { cookies, headers } from 'next/headers'
import './globals.css'
import { LanguageProvider } from '@/components/LanguageProvider'
import CookieConsent from '@/components/CookieConsent'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import TikTokPixel from '@/components/TikTokPixel'
import type { Lang } from '@/lib/i18n'
import { getCatalog, CATALOG_EN } from '@/lib/i18n-catalog'
import { resolveLocale, isRTL } from '@/lib/i18n-locale'
import { ThemeProvider } from 'next-themes'

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
})
const dm = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-dm',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})
const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
  display: 'swap',
})
const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  variable: '--font-instrument',
  weight: ['400'],
  style: ['normal', 'italic'],
  display: 'swap',
})
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://askbiz.co'),
  title: 'AskBiz — Sell With Your Phone. Know Your Money Tonight.',
  description: 'Phone POS and business tracker for market stalls, street vendors, and small businesses. M-Pesa, cash, or card. Any phone, free to start.',
  alternates: {
    languages: {
      'x-default': 'https://askbiz.co',
      'en': 'https://askbiz.co',
      'en-KE': 'https://askbiz.co',
      'en-NG': 'https://askbiz.co',
      'en-UG': 'https://askbiz.co',
      'en-GB': 'https://askbiz.co',
      'en-US': 'https://askbiz.co',
      // Swahili — Kenya/Tanzania default; tells search engines a sw version exists
      'sw': 'https://askbiz.co/sw',
      'sw-KE': 'https://askbiz.co/sw',
      'sw-TZ': 'https://askbiz.co/sw',
      // Somali — Somalia/Djibouti default; tells search engines a so version exists
      'so': 'https://askbiz.co/so',
      'so-SO': 'https://askbiz.co/so',
      'so-DJ': 'https://askbiz.co/so',
    },
  },
  // Favicon and apple-touch-icon come from the App Router file conventions
  // (app/icon.svg, app/apple-icon.tsx), driven by the brand mark in lib/brand.ts.
  // The sitewide social card is /og-image.png → /api/og?mode=brand (branded with
  // the same mark); individual pages may override with their own image.
  openGraph: {
    type: 'website',
    siteName: 'AskBiz',
    url: 'https://askbiz.co',
    locale: 'en_GB',
    title: 'AskBiz — Sell With Your Phone. Know Your Money Tonight.',
    description: 'Phone POS and business tracker for market stalls, street vendors, and small businesses. M-Pesa, cash, or card. Any phone, free to start.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'AskBiz — Sell with your phone. Know your money tonight.' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@askbizco',
    title: 'AskBiz — Sell With Your Phone. Know Your Money Tonight.',
    description: 'Phone POS and business tracker for market stalls, street vendors, and small businesses. M-Pesa, cash, or card. Any phone, free to start.',
    images: ['/og-image.png'],
  },
  verification: {
    google: '9kV7FelOm_qspoK5hcdTe0drirWdQdMOyMx-Jje310s',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies()
  const hdrs = headers()
  // x-locale is set by middleware from the URL prefix (the authoritative content
  // locale). Cookie/geo are fallbacks only when there's no prefix (English).
  const lang = resolveLocale({
    urlLocale: hdrs.get('x-locale'),
    cookie: cookieStore.get('askbiz_lang')?.value,
    country: hdrs.get('x-vercel-ip-country'),
  }) as Lang

  return (
    <html lang={lang} dir={isRTL(lang) ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <body className={`${sora.variable} ${dm.variable} ${mono.variable} ${instrumentSerif.variable} ${plusJakarta.variable}`}>
        <GoogleAnalytics measurementId="G-ELBCMBBMEC" />
        <TikTokPixel pixelId="D8UAH7JC77UER4V7P7PG" />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <LanguageProvider
            initialLang={lang}
            initialCatalog={getCatalog(lang)}
            enCatalog={lang !== 'en' ? CATALOG_EN : undefined}
          >
            {children}
            <CookieConsent />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
