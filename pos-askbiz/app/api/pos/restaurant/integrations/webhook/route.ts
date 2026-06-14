/**
 * POST /api/pos/restaurant/integrations/webhook
 * Receives incoming webhooks from Uber Eats, DoorDash, Grubhub, etc.
 *
 * Responsibilities:
 * 1. Verify webhook signature (platform-specific)
 * 2. Normalize payload to standard schema
 * 3. Store in webhook_queue for reliable processing
 * 4. Return 200 OK immediately (webhook acks)
 *
 * Processing happens asynchronously via background job
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import type {
  PlatformType,
  WebhookPayloadBase,
  NormalizedWebhookPayload,
  PosWebhookQueue
} from '@/lib/types/integrations'

const SERVICE_SUPABASE = createServiceClient()

/**
 * POST handler for all incoming webhooks
 */
export async function POST(req: NextRequest) {
  try {
    // ── Step 1: Determine platform from headers or body ──────────────────
    const platform = getPlatformFromRequest(req)
    if (!platform) {
      return NextResponse.json(
        { error: 'Unable to determine platform' },
        { status: 400 }
      )
    }

    // ── Step 2: Read and parse payload ──────────────────────────────────
    let payload: any
    try {
      payload = await req.json()
    } catch (e) {
      return NextResponse.json(
        { error: 'Invalid JSON' },
        { status: 400 }
      )
    }

    // ── Step 3: Verify webhook signature ────────────────────────────────
    // TODO: Implement platform-specific signature verification
    // Each platform has different header names and algorithms
    // Example: Uber Eats uses X-Uber-Delivery-Signature with HMAC-SHA256

    const isValid = await verifyWebhookSignature(platform, req, payload)
    if (!isValid) {
      console.error(`[Webhook] Invalid signature from ${platform}`)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    // ── Step 4: Find integration by platform ────────────────────────────
    // Platform APIs include restaurant_id or similar in payload
    const restaurantId = getRestaurantIdFromPayload(platform, payload)

    const { data: integration, error: integError } = await SERVICE_SUPABASE
      .from('pos_integrations')
      .select('*')
      .eq('platform', platform)
      .eq('metadata->restaurant_id', restaurantId)
      .single()

    if (integError || !integration) {
      console.error(`[Webhook] No integration found: ${platform}/${restaurantId}`)
      return NextResponse.json(
        { error: 'Integration not found' },
        { status: 404 }
      )
    }

    // ── Step 5: Determine event type and extract order ID ────────────────
    const eventType = getEventType(platform, payload)
    const externalOrderId = getOrderIdFromPayload(platform, payload)

    if (!eventType || !externalOrderId) {
      console.warn(`[Webhook] Could not extract event or order ID: ${platform}`)
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // ── Step 6: Store in webhook queue for processing ────────────────────
    const { error: queueError } = await SERVICE_SUPABASE
      .from('pos_webhook_queue')
      .insert({
        owner_id: integration.owner_id,
        integration_id: integration.id,
        platform,
        event_type: eventType,
        external_id: externalOrderId,
        payload,
        signature: req.headers.get('x-webhook-signature') || undefined,
        processed: false,
        retry_count: 0,
      })

    if (queueError) {
      console.error(`[Webhook] Failed to queue webhook: ${queueError.message}`)
      // Still return 200 to prevent platform from retrying
      // Log to monitoring system
    }

    // ── Step 7: Log webhook receipt ──────────────────────────────────────
    await SERVICE_SUPABASE
      .from('pos_integration_audit')
      .insert({
        owner_id: integration.owner_id,
        integration_id: integration.id,
        operation: 'webhook_received',
        platform,
        endpoint: req.nextUrl.pathname,
        method: 'POST',
        status_code: 200,
        success: true,
        request_payload: payload,
      })

    // Update last_webhook_received_at
    await SERVICE_SUPABASE
      .from('pos_integrations')
      .update({ last_webhook_received_at: new Date().toISOString() })
      .eq('id', integration.id)

    // ── Return 200 OK ────────────────────────────────────────────────────
    // Platforms expect 200 response quickly; processing happens async
    return NextResponse.json({ status: 'received' }, { status: 200 })
  } catch (error) {
    console.error('[Webhook] Unexpected error:', error)
    // Always return 200 to prevent platform retries
    return NextResponse.json({ status: 'error' }, { status: 200 })
  }
}

/**
 * Helper: Determine platform from request headers or body
 */
function getPlatformFromRequest(req: NextRequest): PlatformType | null {
  // Check URL path for platform hint
  const path = req.nextUrl.pathname
  if (path.includes('uber')) return 'uber_eats'
  if (path.includes('doordash') || path.includes('door-dash')) return 'doordash'
  if (path.includes('grubhub') || path.includes('grub-hub')) return 'grubhub'
  if (path.includes('just') && path.includes('eat')) return 'just_eat'
  if (path.includes('swiggy')) return 'swiggy'
  if (path.includes('grab')) return 'grab'
  if (path.includes('meituan')) return 'meituan'

  // Check custom header
  const customPlatform = req.headers.get('x-platform') as PlatformType
  if (customPlatform) return customPlatform

  return null
}

/**
 * Helper: Verify webhook signature (platform-specific)
 *
 * Each platform uses different signature algorithms:
 * - Uber Eats: HMAC-SHA256 in X-Uber-Delivery-Signature
 * - DoorDash: HMAC-SHA256 in X-DoorDash-Signature
 * - Grubhub: RSA-SHA256 in X-Grubhub-Signature
 * etc.
 */
async function verifyWebhookSignature(
  platform: PlatformType,
  req: NextRequest,
  payload: any
): Promise<boolean> {
  // TODO: Implement per-platform verification
  // For now, return true for development
  // Production: verify using integration.webhook_secret

  console.warn(`[Webhook] Signature verification not yet implemented for ${platform}`)
  return true
}

/**
 * Helper: Extract restaurant ID from webhook payload
 * Varies by platform
 */
function getRestaurantIdFromPayload(platform: PlatformType, payload: any): string | null {
  switch (platform) {
    case 'uber_eats':
      return payload.restaurant_uuid
    case 'doordash':
      return payload.merchant_id
    case 'grubhub':
      return payload.restaurantId
    case 'just_eat':
      return payload.restaurant_id
    case 'swiggy':
      return payload.store_id
    case 'grab':
      return payload.merchant_id
    case 'meituan':
      return payload.poi_id
    default:
      return payload.restaurant_id || payload.merchant_id || payload.store_id
  }
}

/**
 * Helper: Determine event type from webhook
 */
function getEventType(platform: PlatformType, payload: any): string | null {
  switch (platform) {
    case 'uber_eats':
      return payload.event_type // e.g., 'order.created'
    case 'doordash':
      return payload.event_type
    case 'grubhub':
      return payload.eventType
    case 'just_eat':
      return payload.event_type
    case 'swiggy':
      return payload.event_type
    case 'grab':
      return payload.event_type
    case 'meituan':
      return payload.event_type
    default:
      return payload.event_type || payload.eventType
  }
}

/**
 * Helper: Extract order ID from webhook
 */
function getOrderIdFromPayload(platform: PlatformType, payload: any): string | null {
  switch (platform) {
    case 'uber_eats':
      return payload.order_id
    case 'doordash':
      return payload.order_uuid || payload.order_id
    case 'grubhub':
      return payload.orderId
    case 'just_eat':
      return payload.order_id
    case 'swiggy':
      return payload.order_id
    case 'grab':
      return payload.order_id
    case 'meituan':
      return payload.order_id
    default:
      return payload.order_id || payload.orderId
  }
}
