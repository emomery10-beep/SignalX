import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { sendEmail } from '@/lib/email'

const ADMIN_EMAILS = ['emomery10@gmail.com', 'emomery10@googlemail.com']

async function getAdminUser(request: NextRequest, supabase: ReturnType<typeof createServiceClient>) {
  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))
    if (user && ADMIN_EMAILS.includes(user.email || '')) return user
  }
  return null
}

// POST /api/admin/send-test-email — lets an admin fire a real email through the
// live Resend pipeline on demand, to verify sending works end-to-end (deliverability,
// API key validity, template rendering) without waiting for a real lifecycle/billing
// trigger. Always sends to an address the caller supplies — never to real users.
export async function POST(request: NextRequest) {
  const supabase = createServiceClient()
  const admin = await getAdminUser(request, supabase)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { to } = await request.json().catch(() => ({}))
  if (!to || typeof to !== 'string' || !to.includes('@')) {
    return NextResponse.json({ error: 'A valid "to" email address is required' }, { status: 400 })
  }

  const sentAt = new Date().toISOString()
  const ok = await sendEmail({
    to,
    subject: 'AskBiz — test email',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
        <h2 style="margin:0 0 12px">✅ Test email received</h2>
        <p style="color:#555;line-height:1.6">
          This is a manual test send, triggered from the AskBiz Admin panel by
          <strong>${admin.email}</strong>, to confirm the email pipeline (Resend) is working.
        </p>
        <p style="color:#999;font-size:12px">Sent at ${sentAt}</p>
      </div>
    `,
  })

  if (!ok) return NextResponse.json({ error: 'Send failed — check RESEND_API_KEY and server logs' }, { status: 502 })
  return NextResponse.json({ success: true, to, sentAt })
}
