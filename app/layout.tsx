import type { Metadata } from 'next'
import { Sora, DM_Sans, JetBrains_Mono, Instrument_Serif, Plus_Jakarta_Sans } from 'next/font/google'
import { cookies, headers } from 'next/headers'
import './globals.css'
import { LanguageProvider } from '@/components/LanguageProvider'
import CookieConsent from '@/components/CookieConsent'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import type { Lang } from '@/lib/i18n'
import { resolveLocale, isRTL } from '@/lib/i18n-locale'
import { ThemeProvider } from 'next-themes'

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
})
const dm = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm',
  weight: ['400', '500'],
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
  title: 'AskBiz — Ask Your Business Data Anything',
  description: 'AI-powered business intelligence for SME owners. Upload your data and get plain-English answers instantly.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
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
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <LanguageProvider initialLang={lang}>
            {children}
            <CookieConsent />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
