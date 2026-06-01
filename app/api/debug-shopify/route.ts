import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { decryptCredentials } from '@/lib/crypto'

export async function GET() {
  const supabase = createServiceClient()

  const { data: source } = await supabase
    .from('connected_sources')
    .select('*')
    .eq('source_type', 'shopify')
    .limit(1)
    .single()

  if (!source) return NextResponse.json({ error: 'No shopify source found' })

  const decrypted = decryptCredentials(source.credentials as Record<string, unknown>)
  const token = String(decrypted.access_token || '')
  const shop = (source.config as Record<string, unknown>)?.shop_domain

  // Test the API call
  const res = await fetch(
    `https://${shop}/admin/api/2025-01/shop.json`,
    { headers: { 'X-Shopify-Access-Token': token } }
  )
  const body = await res.text()

  return NextResponse.json({
    shop,
    token_prefix: token.substring(0, 10),
    token_length: token.length,
    api_status: res.status,
    api_response: body.substring(0, 500),
  })
}
