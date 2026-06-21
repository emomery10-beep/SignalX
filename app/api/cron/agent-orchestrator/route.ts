import { NextRequest, NextResponse } from 'next/server'

export const runtime     = 'nodejs'
export const maxDuration = 30 // Just fires requests — scouts run as independent invocations

const SCOUTS = [
  { name: 'Alice (blog)',           path: '/api/agent/blog-scout' },
  { name: 'Victor (Africa mktg)',   path: '/api/agent/victor-scout' },
  { name: 'Carolyne (East Africa)', path: '/api/agent/carolyne-scout' },
  { name: 'Ben (US)',               path: '/api/agent/ben-scout' },
  { name: 'Maya (marketing)',       path: '/api/agent/marketing-scout' },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const secret     = searchParams.get('secret')
  const authHeader = request.headers.get('authorization')

  const isValid =
    (!!process.env.CRON_SECRET && secret === process.env.CRON_SECRET) ||
    (secret === 'dev-test' && process.env.NODE_ENV !== 'production') ||
    (!!process.env.CRON_SECRET && authHeader === `Bearer ${process.env.CRON_SECRET}`)

  if (!isValid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

  const triggered: string[] = []
  const failed: string[]    = []

  // Fire all scouts in parallel. Each becomes an independent Vercel function
  // invocation and runs to completion (up to its own 300s maxDuration) even
  // after this orchestrator disconnects. We abort our side of the connection
  // after 10s — the scout's execution is unaffected because Next.js route
  // handlers don't stream; the work is already in-flight server-side.
  await Promise.allSettled(
    SCOUTS.map(async ({ name, path }) => {
      try {
        await fetch(`${baseUrl}${path}`, {
          headers: { Authorization: `Bearer ${process.env.CRON_SECRET}` },
          signal: AbortSignal.timeout(10_000),
        })
        triggered.push(name)
      } catch (e: any) {
        // TimeoutError is expected — means we disconnected before the scout
        // responded (300s), but the scout is running independently on Vercel.
        if (e.name === 'TimeoutError' || e.message?.includes('abort')) {
          triggered.push(name)
        } else {
          failed.push(`${name}: ${e.message}`)
        }
      }
    })
  )

  return NextResponse.json({ triggered, failed, at: new Date().toISOString() })
}
