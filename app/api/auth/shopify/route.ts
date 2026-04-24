// Shopify OAuth — Step 1: Redirect to Shopify auth
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.redirect(new URL('/signin', request.url))

  const shop = request.nextUrl.searchParams.get('shop')
  if (!shop) return NextResponse.json({ error: 'shop parameter required' }, { status: 400 })

  const cleanShop = shop.replace(/https?:\/\//, '').replace(/\/$/, '')
  const clientId = process.env.SHOPIFY_CLIENT_ID
  if (!clientId) return NextResponse.json({ error: 'Shopify not configured' }, { status: 500 })

  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/shopify/callback`
  const scopes = 'read_orders,read_products,read_inventory,read_analytics'
  const state = Buffer.from(JSON.stringify({ userId: user.id, shop: cleanShop })).toString('base64url')

  const authUrl = `https://${cleanShop}/admin/oauth/authorize?client_id=${clientId}&scope=${scopes}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`

  return NextResponse.redirect(authUrl)
}
