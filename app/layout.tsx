import type { Metadata } from 'next'
import { Sora, DM_Sans, JetBrains_Mono, Instrument_Serif, Plus_Jakarta_Sans } from 'next/font/google'
import { cookies, headers } from 'next/headers'
import './globals.css'
import { LanguageProvider } from '@/components/LanguageProvider'
import CookieConsent from '@/components/CookieConsent'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import type { Lang } from '@/lib/i18n'
import { resolveLocale } from '@/lib/i18n-locale'
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
  // Resolve locale without a DB hit: cookie (returning visitor) → geo (first
  // visit) → default. Profile-based sync happens at login, not on every page.
  const lang = resolveLocale({
    cookie: cookieStore.get('askbiz_lang')?.value,
    country: headers().get('x-vercel-ip-country'),
  }) as Lang

  return (
    <html lang={lang} suppressHydrationWarning>
      <body className={`${sora.variable} ${dm.variable} ${mono.variable} ${instrumentSerif.variable} ${plusJakarta.variable}`}>
        <GoogleAnalytics measurementId="G-ELBCMBBMEC" />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <LanguageProvider initialLang={lang}>
            {children}
          </LanguageProvider>
          <CookieConsent />
        </ThemeProvider>
      </body>
    </html>
  )
}
