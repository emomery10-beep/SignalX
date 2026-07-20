import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://developer.askbiz.co'),
  title: 'AskBiz Developers',
  description: 'API keys, usage, and docs for building on AskBiz — vision recognition, WhatsApp messaging, inventory and purchase order APIs.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-body">{children}</body>
    </html>
  )
}
