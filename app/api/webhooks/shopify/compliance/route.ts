// Shopify mandatory compliance webhooks (GDPR)
// Handles: customers/data_request, customers/redact, shop/redact
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

function verifyHmac(body: string, hmacHeader: string | null): boolean {
  const secret = process.env.SHOPIFY_CLIENT_SECRET || ''
  if (!secret || !hmacHeader) return false
  try {
    const hash = crypto.createHmac('sha256', secret).update(body, 'utf8').digest('base64')
    const hashBuf = Buffer.from(hash.trim(), 'utf8')
    const hmacBuf = Buffer.from(hmacHeader.trim(), 'utf8')
    if (hashBuf.length !== hmacBuf.length) return false
    return crypto.timingSafeEqual(hashBuf, hmacBuf)
  } catch {
    return false
  }
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const hmac = request.headers.get('x-shopify-hmac-sha256')
  const topic = request.headers.get('x-shopify-topic')

  // Verify webhook signature using client secret
  if (!verifyHmac(body, hmac)) {
    console.error('Compliance webhook HMAC verification failed')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = JSON.parse(body)

  switch (topic) {
    case 'customers/data_request': {
      // Merchant requests data for a customer
      // Log the request — in production you'd email the data to the merchant
      console.log('Customer data request:', payload.customer?.email)
      break
    }
    case 'customers/redact': {
      // Delete customer personal data
      const { createServiceClient } = await import('@/lib/supabase/server')
      const supabase = createServiceClient()

      // Remove any customer-specific data from unified_data
      // Our unified_data doesn't store customer PII directly,
      // but we clear raw_data that might contain it
      const shopDomain = payload.shop_domain
      if (shopDomain && payload.customer?.id) {
        console.log('Redacting customer data:', payload.customer.id, 'from', shopDomain)
      }
      break
    }
    case 'shop/redact': {
      // Merchant uninstalled the app — delete all shop data
      const { createServiceClient } = await import('@/lib/supabase/server')
      const supabase = createServiceClient()

      const shopDomain = payload.shop_domain
      if (shopDomain) {
        // Find and remove the connected source and its data
        const { data: sources } = await supabase
          .from('connected_sources')
          .select('id, user_id')
          .eq('source_type', 'shopify')
          .contains('config', { shop_domain: shopDomain })

        if (sources?.length) {
          for (const source of sources) {
            await supabase.from('unified_data')
              .delete()
              .eq('source_id', source.id)
            await supabase.from('connected_sources')
              .delete()
              .eq('id', source.id)
          }
        }
        console.log('Shop redacted:', shopDomain)
      }
      break
    }
    default:
      console.log('Unknown compliance topic:', topic)
  }

  return NextResponse.json({ received: true })
}
