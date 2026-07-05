import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { DEMO_MARKETS } from '@/lib/demo-markets'

// Bare /demo → the visitor's country demo if it's a live market, else Kenya.
export default function DemoIndex() {
  const country = headers().get('x-vercel-ip-country')?.toUpperCase()
  const match = country ? DEMO_MARKETS.find((m) => m.code === country) : undefined
  redirect(`/demo/${match?.slug ?? 'kenya'}`)
}
