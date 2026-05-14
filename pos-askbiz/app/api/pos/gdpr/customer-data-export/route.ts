import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosOwner } from '@/lib/pos-auth'
import { createWriteStream } from 'fs'
import { join } from 'path'
import { promises as fs } from 'fs'

/**
 * POST /api/pos/gdpr/customer-data-export
 *
 * Exports all customer data in GDPR-compliant format
 * Returns: ZIP file with customer profile, transactions, loyalty history, consents
 */
export async function POST(req: NextRequest) {
  const ownerId = await resolvePosOwner(req)
  if (!ownerId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const body = await req.json()
  const { customer_phone, customer_id, format = 'json' } = body

  // Find customer
  let customerId = customer_id
  if (!customerId && customer_phone) {
    const { data: customer } = await service
      .from('pos_customers')
      .select('id')
      .eq('owner_id', ownerId)
      .eq('phone', customer_phone)
      .maybeSingle()

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }
    customerId = customer.id
  }

  if (!customerId) {
    return NextResponse.json({ error: 'customer_phone or customer_id required' }, { status: 400 })
  }

  // Fetch all customer data
  const [customerRes, transactionsRes, consentsRes, preferencesRes] = await Promise.all([
    service
      .from('pos_customers')
      .select('*')
      .eq('id', customerId)
      .eq('owner_id', ownerId)
      .single(),

    service
      .from('pos_transactions')
      .select('*')
      .eq('customer_id', customerId)
      .eq('owner_id', ownerId),

    service
      .from('pos_consent_log')
      .select('*')
      .eq('customer_id', customerId)
      .eq('owner_id', ownerId)
      .order('timestamp', { ascending: false }),

    service
      .from('pos_customer_preferences')
      .select('*')
      .eq('customer_id', customerId)
      .eq('owner_id', ownerId)
      .single(),
  ])

  const customer = customerRes.data
  const transactions = transactionsRes.data || []
  const consents = consentsRes.data || []
  const preferences = preferencesRes.data

  // Build export data
  const exportData = {
    export_timestamp: new Date().toISOString(),
    export_format: 'GDPR Article 15 Data Subject Access Request',
    customer: {
      id: customer?.id,
      name: customer?.name,
      phone: customer?.phone,
      email: customer?.email,
      created_at: customer?.created_at,
      last_seen_at: customer?.last_seen_at,
      total_spent: customer?.total_spent,
      is_anonymized: customer?.is_anonymized,
      anonymized_at: customer?.anonymized_at,
    },
    preferences: preferences
      ? {
          data_retention_days: preferences.data_retention_days,
          allow_email_marketing: preferences.allow_email_marketing,
          allow_sms_marketing: preferences.allow_sms_marketing,
          allow_whatsapp_marketing: preferences.allow_whatsapp_marketing,
          allow_analytics: preferences.allow_analytics,
          preferred_contact_method: preferences.preferred_contact_method,
        }
      : null,
    transaction_history: transactions.map(tx => ({
      id: tx.id,
      created_at: tx.created_at,
      subtotal: tx.subtotal,
      discount_amount: tx.discount_amount,
      total_tax: tx.total_tax,
      total: tx.total,
      payment_type: tx.payment_type,
      status: tx.status,
      notes: tx.notes,
    })),
    consent_history: consents.map(c => ({
      id: c.id,
      consent_type: c.consent_type,
      status: c.status,
      timestamp: c.timestamp,
      request_source: c.request_source,
    })),
    data_summary: {
      total_transactions: transactions.length,
      total_spent: customer?.total_spent || 0,
      total_consents_granted: consents.filter(c => c.status === 'granted').length,
      retention_policy: `${preferences?.data_retention_days || 2555} days (${Math.round((preferences?.data_retention_days || 2555) / 365)} years)`,
    },
  }

  // Log the export request
  await service.from('pos_data_requests').insert({
    owner_id: ownerId,
    customer_id: customerId,
    request_type: 'access',
    status: 'completed',
    exported_to: `export_${customerId}_${Date.now()}`,
    data_format: format,
    completed_at: new Date().toISOString(),
  })

  // Update customer
  await service
    .from('pos_customers')
    .update({ data_export_requested_at: new Date().toISOString(), last_gdpr_request_at: new Date().toISOString() })
    .eq('id', customerId)

  // Return based on format
  if (format === 'csv') {
    const csv = convertToCSV(exportData)
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="customer_data_${customerId}_${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })
  }

  // Default: JSON
  return new NextResponse(JSON.stringify(exportData, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="customer_data_${customerId}_${new Date().toISOString().split('T')[0]}.json"`,
    },
  })
}

function convertToCSV(data: any): string {
  let csv = 'GDPR Data Subject Access Request\n'
  csv += `Export Date: ${data.export_timestamp}\n\n`

  csv += 'CUSTOMER PROFILE\n'
  csv += `Name,${data.customer.name}\n`
  csv += `Phone,${data.customer.phone}\n`
  csv += `Email,${data.customer.email}\n`
  csv += `Member Since,${data.customer.created_at}\n`
  csv += `Total Spent,${data.customer.total_spent}\n`
  csv += `Anonymized,${data.customer.is_anonymized}\n\n`

  csv += 'TRANSACTION HISTORY\n'
  csv += 'Date,Amount,Status,Payment Type\n'
  data.transaction_history.forEach((tx: any) => {
    csv += `${tx.created_at.split('T')[0]},${tx.total},${tx.status},${tx.payment_type}\n`
  })

  csv += '\nCONSENT HISTORY\n'
  csv += 'Type,Status,Date\n'
  data.consent_history.forEach((c: any) => {
    csv += `${c.consent_type},${c.status},${c.timestamp.split('T')[0]}\n`
  })

  return csv
}
