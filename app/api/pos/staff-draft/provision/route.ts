import { NextRequest, NextResponse } from 'next/server'
import { resolvePosOwner, posEntitled } from '@/lib/pos-auth'
import { provisionStaffDrafts } from '@/lib/pos-staff-provision'

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}

// POST — turn staff drafts into real accounts after payment (activate-page
// path). The webhooks also call provisionStaffDrafts server-side, so this is
// a backup; it's idempotent, so both running is harmless.
export async function POST(req: NextRequest) {
  const ownerId = await resolvePosOwner(req)
  if (!ownerId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  if (!(await posEntitled(ownerId))) {
    return NextResponse.json({ error: 'POS is not active', code: 'pos_not_active' }, { status: 402 })
  }

  const result = await provisionStaffDrafts(ownerId)
  return NextResponse.json({ provisioned: result.provisioned, remaining_drafts: result.remaining })
}
