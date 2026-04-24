import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { normaliseShopify } from '@/lib/sync/normaliser'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const hmac = request.headers.get('x-shopify-hmac-sha256')
  const shop = request.headers.get('x-shopify-shop-domain')
  const topic = request.headers.get('x-shopify-topic')

  // Verify webhook signature
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET
  if (secret && hmac) {
    const hash = crypto.createHmac('sha256', secret).update(body).digest('base64')
    if (hash !== hmac) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }
  }

  const supabase = createServiceClient()

  // Store raw webhook event
  await supabase.from('webhook_events').insert({
    source_type: 'shopify',
    event_type: topic || 'unknown',
    payload: JSON.parse(body),
  })

  // Find the connected source for this shop
  const { data: source } = await supabase
    .from('connected_sources')
    .select('id, user_id')
    .eq('source_type', 'shopify')
    .contains('config', { shop_domain: shop })
    .single()

  if (!source) return NextResponse.json({ received: true }) // unknown shop, ignore

  // Process based on topic
  const payload = JSON.parse(body)

  if (topic === 'orders/create' || topic === 'orders/updated' || topic === 'orders/paid') {
    const records = normaliseShopify(payload)
    if (records.length) {
      const batch = records.map(r => ({
        ...r,
        user_id: source.user_id,
        source_id: source.id,
        updated_at: new Date().toISOString(),
      }))
      await supabase.from('unified_data').upsert(batch, {
        onConflict: 'user_id,source_type,source_record_id',
        ignoreDuplicates: false,
      })
    }
  }

  if (topic === 'inventory_levels/update') {
    // Update stock levels in unified_data
    const { inventory_item_id, available } = payload
    await supabase.from('unified_data')
      .update({ stock_level: available, low_stock_flag: available < 10, updated_at: new Date().toISOString() })
      .eq('user_id', source.user_id)
      .like('source_record_id', `%${inventory_item_id}%`)
  }

  // Mark webhook as processed
  await supabase.from('webhook_events')
    .update({ processed: true })
    .eq('source_type', 'shopify')
    .eq('processed', false)

  return NextResponse.json({ received: true })
}
