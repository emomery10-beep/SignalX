import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { createClient as supabaseCreateClient } from '@supabase/supabase-js'
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

export async function POST(req: NextRequest) {
  const supabase = createServiceClient()
  const body = await req.json()
  const { action, email, token } = body

  // ── SEND magic link via Supabase email (server-side, no Resend) ──────────
  if (action === 'send') {
    if (!email?.trim()) return json({ error: 'email required' }, 400)

    // Check staff exists
    const { data: staff } = await supabase
      .from('pos_staff')
      .select('id, name, role, owner_id, active')
      .eq('email', email.trim().toLowerCase())
      .eq('active', true)
      .maybeSingle()

    if (!staff) return json({
      error: 'Email not recognised. Ask your manager to add you.',
    }, 404)

    // Use implicit flow (token_hash) so no PKCE code verifier needed
    const authClient = supabaseCreateClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false, flowType: 'implicit' } }
    )

    // Supabase sends the email — redirect callback goes to our server
    const { error } = await authClient.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        emailRedirectTo: 'https://www.askbiz.co/api/pos/callback',
        shouldCreateUser: true,
      },
    })

    if (error) {
      console.error('[pos/otp] send error:', error.message)
      return json({ error: 'Failed to send login link' }, 500)
    }

    return json({ sent: true, name: staff.name })
  }

  // ── VERIFY session token (set by the callback after Supabase auth) ────────
  if (action === 'verify') {
    if (!token) return json({ error: 'token required' }, 400)

    const { data: link } = await supabase
      .from('pos_magic_links')
      .select('*')
      .eq('token', token)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle()

    if (!link) return json({ error: 'Invalid or expired link' }, 401)

    // Mark as used
    await supabase.from('pos_magic_links')
      .update({ used: true, used_at: new Date().toISOString() })
      .eq('id', link.id)

    const { data: staff } = await supabase
      .from('pos_staff')
      .select('id, name, role, owner_id, active')
      .eq('id', link.staff_id)
      .eq('active', true)
      .single()

    if (!staff) return json({ error: 'Staff account not found' }, 404)

    await supabase.from('pos_staff')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', staff.id)

    return json({
      verified: true,
      staff: { id: staff.id, name: staff.name, role: staff.role, owner_id: staff.owner_id },
    })
  }

  return json({ error: 'Invalid action' }, 400)
}
