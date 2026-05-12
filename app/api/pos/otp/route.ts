import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { sendMagicLinkEmail } from '@/lib/email'
import { randomBytes } from 'crypto'

const CORS = {
  'Access-Control-Allow-Origin': 'https://pos.askbiz.co',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS })
}

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: CORS })
}

// Generate a secure random token
function generateToken() {
  return randomBytes(32).toString('hex')
}

// POST /api/pos/otp — send magic link
export async function POST(req: NextRequest) {
  const supabase = createServiceClient()
  const { action, email } = await req.json()

  if (!email?.trim()) return json({ error: 'email required' }, 400)

  // ── SEND MAGIC LINK ───────────────────────────────────────
  if (action === 'send') {
    const { data: staff } = await supabase
      .from('pos_staff')
      .select('id, name, role, owner_id, active')
      .eq('email', email.trim())
      .eq('active', true)
      .maybeSingle()

    if (!staff) return json({
      error: 'Email not recognised. Ask your manager to add you.',
    }, 404)

    // Generate magic link token
    const token = generateToken()
    const expires_at = new Date(Date.now() + 15 * 60 * 1000).toISOString() // 15 minutes

    // Save to database
    const { error: insertError } = await supabase.from('pos_magic_links').insert({
      staff_id: staff.id,
      token,
      email: email.trim(),
      expires_at,
    })

    if (insertError) {
      console.error('[pos/magic-link] Insert error:', insertError)
      return json({ error: 'Failed to generate login link' }, 500)
    }

    // Send email with magic link
    const magicLinkUrl = `https://pos.askbiz.co/pos/login?token=${token}`
    const ok = await sendMagicLinkEmail(email.trim(), magicLinkUrl, staff.name)

    if (!ok) {
      console.error('[pos/magic-link] Email send failed for', email)
      return json({ error: 'Failed to send email' }, 500)
    }

    return json({ sent: true, name: staff.name })
  }

  // ── VERIFY MAGIC LINK ────────────────────────────────────
  if (action === 'verify') {
    const { token } = await req.json()
    if (!token) return json({ error: 'token required' }, 400)

    const { data: link } = await supabase
      .from('pos_magic_links')
      .select('*')
      .eq('token', token)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .single()
      .catch(() => ({ data: null }))

    if (!link) return json({ error: 'Invalid or expired link' }, 401)

    // Mark as used
    await supabase.from('pos_magic_links').update({ used: true, used_at: new Date().toISOString() }).eq('id', link.id)

    // Get staff details
    const { data: staff } = await supabase
      .from('pos_staff')
      .select('id, name, role, owner_id, active')
      .eq('id', link.staff_id)
      .eq('active', true)
      .single()

    if (!staff) return json({ error: 'Staff account not found' }, 404)

    // Update last login
    await supabase.from('pos_staff').update({ last_login_at: new Date().toISOString() }).eq('id', staff.id)

    return json({
      verified: true,
      staff: { id: staff.id, name: staff.name, role: staff.role, owner_id: staff.owner_id },
    })
  }

  return json({ error: 'Invalid action' }, 400)
}
