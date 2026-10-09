import { NextRequest, NextResponse } from 'next/server'
import { resolveCfoReader } from '@/lib/cfo-auth'
import { buildCfoSnapshot } from '@/lib/cfo-snapshot'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  // Owner → own RLS-scoped client; team member with CFO access → owner's data (see lib/cfo-auth.ts)
  const access = await resolveCfoReader()
  if (!access.ok) return NextResponse.json({ error: access.error }, { status: access.status })
  const { user, ownerId, isOwner, db: supabase } = access.reader
  const payload = await buildCfoSnapshot({ supabase, ownerId, user, isOwner, params: new URL(request.url).searchParams })
  return NextResponse.json(payload)
}
