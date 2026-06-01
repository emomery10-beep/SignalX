import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { runSync } from '@/lib/sync/engine'
import { decryptCredentials, encryptCredentials } from '@/lib/crypto'
import { validateStripeKey } from '@/lib/connectors/stripe'

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data } = await supabase
    .from('connected_sources')
    .select('id, source_type, name, status, last_synced_at, sync_interval_minutes, error_message, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return NextResponse.json(data || [])
}

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { source_type, name, credentials, config, sync_interval_minutes = 360 } = body

  if (!source_type || !name) return NextResponse.json({ error: 'source_type and name required' }, { status: 400 })

  if (source_type === 'stripe') {
    const key = credentials?.secret_key
    if (!key) return NextResponse.json({ error: 'Stripe secret key is required' }, { status: 400 })
    const valid = await validateStripeKey(key)
    if (!valid) return NextResponse.json({ error: 'Invalid Stripe key — check it in your Stripe Dashboard → Developers → API keys' }, { status: 400 })
  }

  // Encrypt credentials before storing
  const encryptedCreds = credentials ? encryptCredentials(credentials) : {}

  // Save source
  const { data: source, error } = await supabase
    .from('connected_sources')
    .insert({ user_id: user.id, source_type, name, credentials: encryptedCreds, config, sync_interval_minutes })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await supabase.from('audit_log').insert({
    user_id: user.id,
    event: 'source_connected',
    metadata: { source_type, name },
  })

  // Trigger initial sync immediately
  try {
    await runSync(user.id)
  } catch (_) {
    // Don't fail the connection if initial sync fails
  }

  return NextResponse.json(source)
}

export async function DELETE(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await request.json()

  // Fetch source so we can revoke with the provider before deleting
  const { data: source } = await supabase
    .from('connected_sources')
    .select('source_type, credentials, config')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (source) {
    const creds = decryptCredentials(source.credentials as Record<string, unknown>)
    await revokeProviderToken(source.source_type, creds, source.config as Record<string, unknown>)
  }

  await supabase.from('connected_sources').delete().eq('id', id).eq('user_id', user.id)
  return NextResponse.json({ deleted: true })
}

async function revokeProviderToken(
  sourceType: string,
  creds: Record<string, unknown>,
  config: Record<string, unknown>,
): Promise<void> {
  try {
    if (sourceType === 'google_sheets') {
      const token = String(creds.refresh_token || creds.access_token || '')
      if (token) {
        await fetch(`https://oauth2.googleapis.com/revoke?token=${encodeURIComponent(token)}`, { method: 'POST' })
      }
    } else if (sourceType === 'quickbooks') {
      const token = String(creds.refresh_token || creds.access_token || '')
      if (token) {
        const basicAuth = Buffer.from(
          `${process.env.QUICKBOOKS_CLIENT_ID}:${process.env.QUICKBOOKS_CLIENT_SECRET}`
        ).toString('base64')
        await fetch('https://developer.api.intuit.com/v2/oauth2/tokens/revoke', {
          method: 'POST',
          headers: { Authorization: `Basic ${basicAuth}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        })
      }
    } else if (sourceType === 'shopify') {
      const shopDomain = String(config?.shop_domain || '')
      const accessToken = String(creds.access_token || '')
      if (shopDomain && accessToken) {
        await fetch(`https://${shopDomain}/admin/oauth/access_tokens/current.json`, {
          method: 'DELETE',
          headers: { 'X-Shopify-Access-Token': accessToken },
        })
      }
    }
    // Amazon LWA does not expose a standard token revocation endpoint
  } catch {
    // Never block disconnect due to revocation errors — DB row is deleted either way
  }
}
