// Shopify manual token connection
// Merchant creates a custom app in their Shopify admin, copies the access token, pastes it here.
// No OAuth redirect needed — token is validated live against Shopify API then stored.
import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { encryptCredentials } from '@/lib/crypto'
import { runSync } from '@/lib/sync/engine'

export async function POST(request: NextRequest) {
  // Must be authenticated
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  let shop: string, access_token: string
  try {
    const body = await request.json()
    shop         = (body.shop         || '').trim().toLowerCase().replace(/https?:\/\//, '').replace(/\/$/, '')
    access_token = (body.access_token || '').trim()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (!shop || !access_token) {
    return NextResponse.json({ error: 'shop and access_token are required' }, { status: 400 })
  }

  // Normalise: add .myshopify.com if merchant just typed store name
  if (!shop.includes('.')) {
    shop = `${shop}.myshopify.com`
  }

  // Validate token by calling Shopify API
  let shopName: string
  try {
    const res = await fetch(`https://${shop}/admin/api/2025-01/shop.json`, {
      headers: { 'X-Shopify-Access-Token': access_token },
    })
    if (res.status === 401) {
      return NextResponse.json({ error: 'Invalid access token — check the token and try again' }, { status: 422 })
    }
    if (res.status === 404) {
      return NextResponse.json({ error: 'Store not found — check the store domain and try again' }, { status: 422 })
    }
    if (!res.ok) {
      return NextResponse.json({ error: `Shopify returned ${res.status} — check your token and domain` }, { status: 422 })
    }
    const data = await res.json()
    shopName = data.shop?.name || shop
  } catch {
    return NextResponse.json({ error: 'Could not reach Shopify — check the store domain' }, { status: 422 })
  }

  const svc = createServiceClient()

  // Remove any existing Shopify connection for this user, then insert fresh
  await svc
    .from('connected_sources')
    .delete()
    .eq('user_id', user.id)
    .eq('source_type', 'shopify')

  const { data: source, error: insertError } = await svc
    .from('connected_sources')
    .insert({
      user_id:               user.id,
      source_type:           'shopify',
      name:                  shopName,
      status:                'active',
      credentials:           encryptCredentials({ access_token }),
      config:                { shop_domain: shop, connection_method: 'manual_token' },
      sync_interval_minutes: 60,
    })
    .select()
    .single()

  if (insertError) {
    console.error('Shopify token insert failed:', insertError)
    return NextResponse.json({ error: 'Failed to save connection' }, { status: 500 })
  }

  // Kick off initial sync in background (don't await — return fast)
  if (source) {
    runSync(user.id).catch(() => {})
  }

  return NextResponse.json({ ok: true, shop_name: shopName })
}
