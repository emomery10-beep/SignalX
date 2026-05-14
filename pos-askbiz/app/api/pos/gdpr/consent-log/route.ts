import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosOwner } from '@/lib/pos-auth'

/**
 * POST /api/pos/gdpr/consent-log
 *
 * Logs customer consent for marketing/email/SMS/WhatsApp/analytics
 * Implements GDPR Article 7 (Conditions for consent)
 */
export async function POST(req: NextRequest) {
  const ownerId = await resolvePosOwner(req)
  if (!ownerId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const body = await req.json()

  const {
    customer_id,
    customer_phone,
    consent_type, // 'marketing_email', 'sms', 'whatsapp', 'loyalty', 'analytics'
    status, // 'granted', 'withdrawn', 'refused'
    request_source = 'api', // 'web', 'api', 'pos_terminal', 'import'
  } = body

  if (!consent_type || !status) {
    return NextResponse.json({ error: 'consent_type and status required' }, { status: 400 })
  }

  if (!['granted', 'withdrawn', 'refused'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  // Find customer if phone provided
  let customerId = customer_id
  if (!customerId && customer_phone) {
    const { data: customer } = await service
      .from('pos_customers')
      .select('id')
      .eq('owner_id', ownerId)
      .eq('phone', customer_phone)
      .maybeSingle()

    if (customer) {
      customerId = customer.id
    }
  }

  // Get IP and user agent for audit trail
  const ip_address = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
  const user_agent = req.headers.get('user-agent') || 'unknown'

  // Log consent
  const { error: consentError } = await service.from('pos_consent_log').insert({
    owner_id: ownerId,
    customer_id: customerId || null,
    consent_type,
    status,
    ip_address,
    user_agent,
    request_source,
    timestamp: new Date().toISOString(),
  })

  if (consentError) {
    return NextResponse.json({ error: consentError.message }, { status: 500 })
  }

  // Update customer preferences if customer found
  if (customerId) {
    const consentMap: Record<string, string> = {
      marketing_email: 'allow_email_marketing',
      sms: 'allow_sms_marketing',
      whatsapp: 'allow_whatsapp_marketing',
      analytics: 'allow_analytics',
      loyalty: 'allow_analytics',
    }

    const prefsKey = consentMap[consent_type]
    if (prefsKey) {
      const updateData: any = {
        [prefsKey]: status === 'granted' ? true : false,
      }

      // If this is the only consent granted, set preferred contact method
      if (status === 'granted' && consent_type !== 'analytics' && consent_type !== 'loyalty') {
        updateData.preferred_contact_method = consent_type.replace('_', '')
      }

      await service
        .from('pos_customer_preferences')
        .upsert(
          {
            owner_id: ownerId,
            customer_id: customerId,
            ...updateData,
          },
          { onConflict: 'owner_id,customer_id' }
        )
        .select()
    }
  }

  return NextResponse.json({
    success: true,
    message: `Consent ${status} logged for ${consent_type}`,
    consent_type,
    status,
    request_source,
  })
}

/**
 * GET /api/pos/gdpr/consent-log?customer_id=xxx
 *
 * Retrieves consent history for a customer
 */
export async function GET(req: NextRequest) {
  const ownerId = await resolvePosOwner(req)
  if (!ownerId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const { searchParams } = new URL(req.url)

  const customer_id = searchParams.get('customer_id')
  const consent_type = searchParams.get('consent_type')

  if (!customer_id) {
    return NextResponse.json({ error: 'customer_id required' }, { status: 400 })
  }

  let query = service
    .from('pos_consent_log')
    .select('*')
    .eq('owner_id', ownerId)
    .eq('customer_id', customer_id)
    .order('timestamp', { ascending: false })

  if (consent_type) {
    query = query.eq('consent_type', consent_type)
  }

  const { data: consents, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    customer_id,
    consents: consents || [],
    summary: {
      email_marketing: (consents || []).find(c => c.consent_type === 'marketing_email' && c.status === 'granted') ? 'granted' : 'not_granted',
      sms: (consents || []).find(c => c.consent_type === 'sms' && c.status === 'granted') ? 'granted' : 'not_granted',
      whatsapp: (consents || []).find(c => c.consent_type === 'whatsapp' && c.status === 'granted') ? 'granted' : 'not_granted',
      analytics: (consents || []).find(c => c.consent_type === 'analytics' && c.status === 'granted') ? 'granted' : 'not_granted',
    },
  })
}
