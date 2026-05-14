import { NextRequest, NextResponse } from 'next/server'

// GET — Meta webhook verification handshake
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const mode      = searchParams.get('hub.mode')
  const token     = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === process.env.META_WEBHOOK_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 })
  }

  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}

// POST — incoming messages and status updates (delivery receipts, read receipts)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    // Log delivery/read status updates — useful for receipt confirmation
    const changes = body?.entry?.[0]?.changes?.[0]?.value
    if (changes?.statuses) {
      for (const s of changes.statuses) {
        console.log(`[meta-wa] ${s.id} → ${s.status} (${s.recipient_id})`)
      }
    }
  } catch {}

  // Always return 200 — Meta will retry if we don't
  return NextResponse.json({ received: true })
}
