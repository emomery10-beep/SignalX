import type { Metadata } from 'next'
import { Sora, DM_Sans, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  weight: ['300', '400', '500', '600'],
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

export const metadata: Metadata = {
  title: 'AskBiz — Ask Your Business Data Anything',
  icons: { icon: '/favicon.svg', apple: '/favicon.svg' },
  description: 'Ask your data anything. Get BI answers instantly. Upload a spreadsheet, ask a plain-English question, get grounded insights with charts and next steps.',
  manifest: '/manifest.json',
  openGraph: {
    title: 'AskBiz — Ask Your Business Data Anything',
    icons: { icon: '/favicon.svg', apple: '/favicon.svg' },
  description: 'Conversational BI for every business. Auto-localised to your region and currency.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${dm.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
