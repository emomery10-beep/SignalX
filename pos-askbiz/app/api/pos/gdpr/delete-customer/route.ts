import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosOwner } from '@/lib/pos-auth'
import { createHash } from 'crypto'

/**
 * POST /api/pos/gdpr/delete-customer
 *
 * Implements GDPR Right to Be Forgotten (Article 17)
 * Deletes/anonymizes customer data while keeping transaction history for tax compliance
 */
export async function POST(req: NextRequest) {
  const ownerId = await resolvePosOwner(req)
  if (!ownerId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const body = await req.json()
  const { customer_id, customer_phone, deletion_type = 'anonymization', reason = 'customer_request' } = body

  // Find customer
  let customerId = customer_id
  let customerPhone = customer_phone
  let customerName = ''

  if (!customerId && customer_phone) {
    const { data: customer } = await service
      .from('pos_customers')
      .select('id, phone, name')
      .eq('owner_id', ownerId)
      .eq('phone', customer_phone)
      .maybeSingle()

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }
    customerId = customer.id
    customerPhone = customer.phone
    customerName = customer.name
  } else if (customerId) {
    const { data: customer } = await service
      .from('pos_customers')
      .select('phone, name')
      .eq('id', customerId)
      .eq('owner_id', ownerId)
      .single()

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }
    customerPhone = customer.phone
    customerName = customer.name
  }

  if (!customerId) {
    return NextResponse.json({ error: 'customer_id or customer_phone required' }, { status: 400 })
  }

  // Get transaction count (for record keeping)
  const { data: transactions } = await service
    .from('pos_transactions')
    .select('id')
    .eq('customer_id', customerId)
    .eq('owner_id', ownerId)

  const transactionCount = transactions?.length || 0

  // Perform anonymization/deletion
  if (deletion_type === 'anonymization') {
    // Anonymize: Keep data but remove identifiers
    // Mask phone: keep last 2 digits only (e.g., "254712345678" → "****5678")
    const maskedPhone = customerPhone ? `****${customerPhone.slice(-4)}` : null

    await service
      .from('pos_customers')
      .update({
        name: 'Anonymized Customer',
        phone: maskedPhone,
        email: null,
        is_anonymized: true,
        anonymized_at: new Date().toISOString(),
      })
      .eq('id', customerId)
      .eq('owner_id', ownerId)

    // Unlink customer from transactions (keep transactionhistory for tax)
    await service.from('pos_transactions').update({ customer_id: null }).eq('customer_id', customerId)
  } else if (deletion_type === 'full_deletion') {
    // Full deletion (rarely used, needs special authorization)
    // Note: Transactions remain for tax compliance (keep customer_id for audit)
    await service
      .from('pos_customers')
      .update({
        name: 'DELETED - Retained for Tax Compliance',
        phone: null,
        email: null,
        is_anonymized: true,
        anonymized_at: new Date().toISOString(),
      })
      .eq('id', customerId)
      .eq('owner_id', ownerId)
  }

  // ── Parcel data (logistics) — GDPR Art. 17 ───────────────────────────────
  // Parcel senders/receivers are walk-ins keyed by phone, not pos_customers.
  // Anonymise PII columns and delete the intake photos from storage, while
  // keeping non-personal shipment/audit fields (tracking number, fees, status,
  // branches, timestamps) for accounting/legal retention.
  let parcelsAnonymised = 0
  let parcelPhotosDeleted = 0
  if (customerPhone) {
    const { data: parcels } = await service
      .from('pos_parcels')
      .select('id, intake_photo_path, sender_phone, receiver_phone')
      .eq('owner_id', ownerId)
      .or(`sender_phone.eq.${customerPhone},receiver_phone.eq.${customerPhone}`)

    const rows = (parcels as any[]) || []
    if (rows.length) {
      // 1. Remove intake photos from the private bucket
      const paths = rows.map(p => p.intake_photo_path).filter(Boolean)
      if (paths.length) {
        const { error: rmErr } = await service.storage.from('parcel-photos').remove(paths)
        if (rmErr) console.error('Parcel photo deletion failed:', rmErr.message)
        else parcelPhotosDeleted = paths.length
      }
      // 2. Anonymise only the matching side(s) of each parcel
      for (const p of rows) {
        const updates: Record<string, unknown> = { intake_photo_url: null, intake_photo_path: null }
        if (p.sender_phone === customerPhone) {
          updates.sender_name = 'Anonymised'; updates.sender_phone = null; updates.sender_id_number = null
        }
        if (p.receiver_phone === customerPhone) {
          updates.receiver_name = 'Anonymised'; updates.receiver_phone = null; updates.receiver_id_number = null; updates.delivery_address = null
        }
        await service.from('pos_parcels').update(updates).eq('id', p.id).eq('owner_id', ownerId)
      }
      parcelsAnonymised = rows.length
    }
  }

  // Create hash for integrity verification
  const hashInput = `${customerId}${new Date().toISOString()}${deletion_type}`
  const hash = createHash('sha256').update(hashInput).digest('hex')

  // Log the deletion
  await service.from('pos_gdpr_deletion_log').insert({
    owner_id: ownerId,
    customer_id: customerId,
    customer_phone: customerPhone,
    deletion_type,
    reason,
    anonymous_transactions_kept_count: transactionCount,
    retention_period_years: 7, // Tax compliance retention
    hash,
  })

  // Log data deletion request as completed
  await service.from('pos_data_requests').insert({
    owner_id: ownerId,
    customer_id: customerId,
    request_type: 'delete',
    status: 'completed',
    completed_at: new Date().toISOString(),
  })

  // Update customer
  await service
    .from('pos_customers')
    .update({ deletion_requested_at: new Date().toISOString(), last_gdpr_request_at: new Date().toISOString() })
    .eq('id', customerId)

  return NextResponse.json({
    success: true,
    message: `Customer ${deletion_type} completed`,
    customer_id: customerId,
    deletion_type,
    transactions_kept_for_tax: transactionCount,
    parcels_anonymised: parcelsAnonymised,
    parcel_photos_deleted: parcelPhotosDeleted,
    retention_until: new Date(new Date().getTime() + 7 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    hash, // For audit verification
  })
}
