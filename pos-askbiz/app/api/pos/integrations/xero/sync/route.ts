import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosOwner } from '@/lib/pos-auth'

/**
 * POST /api/pos/integrations/xero/sync
 *
 * Syncs POS transactions to Xero as draft invoices
 * Allows manual or automatic (nightly) sync
 *
 * Body:
 *   transaction_ids?: string[] (specific transactions) | null (all unsync'd)
 *   sync_type: 'manual' | 'automatic'
 */
export async function POST(req: NextRequest) {
  const ownerId = await resolvePosOwner(req)
  if (!ownerId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const body = await req.json()
  const { transaction_ids, sync_type = 'manual' } = body

  // Get Xero credentials from integrations table
  const { data: xeroAuth } = await service
    .from('pos_integrations')
    .select('id, credentials_json, last_sync_at, error_log_json')
    .eq('owner_id', ownerId)
    .eq('provider', 'xero')
    .maybeSingle()

  if (!xeroAuth?.credentials_json) {
    return NextResponse.json(
      { error: 'Xero not connected - authorize first via /api/pos/integrations/xero/connect' },
      { status: 403 }
    )
  }

  const credentials = JSON.parse(xeroAuth.credentials_json || '{}')
  const accessToken = credentials.access_token

  if (!accessToken) {
    return NextResponse.json({ error: 'Xero access token expired - re-authorize required' }, { status: 401 })
  }

  // Fetch transactions to sync
  let query = service
    .from('pos_transactions')
    .select(`
      id,
      created_at,
      total_amount,
      total_tax,
      payment_method,
      pos_items (
        name,
        qty,
        unit_price,
        tax_code,
        tax_rate,
        tax_amount
      )
    `)
    .eq('owner_id', ownerId)
    .eq('synced_to_xero', false)

  if (transaction_ids && transaction_ids.length > 0) {
    query = query.in('id', transaction_ids)
  }

  const { data: transactions } = await query.limit(50) // Batch by 50

  if (!transactions || transactions.length === 0) {
    return NextResponse.json({
      success: true,
      synced_count: 0,
      message: 'No new transactions to sync',
    })
  }

  // Transform transactions to Xero invoices
  const invoices = transactions.map((tx: any) => {
    const items = tx.pos_items || []
    return {
      Type: 'ACCREC', // Accounts Receivable (invoice)
      Status: 'DRAFT',
      LineAmountTypes: 'Inclusive', // Tax included in line amounts
      Contact: {
        Name: `POS Sale ${tx.id?.slice(0, 8)}`,
      },
      DueDate: tx.created_at?.split('T')[0],
      InvoiceNumber: tx.id?.slice(0, 8),
      Reference: `Sale-${tx.id?.slice(0, 8)}`,
      LineItems: items.map((item: any) => ({
        Description: item.name || 'POS Item',
        Quantity: item.qty || 1,
        UnitAmount: item.unit_price || 0,
        TaxType: mapTaxCode(item.tax_code),
        TaxAmount: item.tax_amount || 0,
        TrackingCategory: 'POS Sales',
      })),
    }
  })

  // Post to Xero API
  const syncResults = []
  let errorCount = 0

  for (const invoice of invoices) {
    try {
      const xeroResponse = await fetch('https://api.xero.com/api.xro/2.0/Invoices', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Xero-tenant-id': credentials.tenant_id,
        },
        body: JSON.stringify({
          Invoices: [invoice],
        }),
      })

      if (xeroResponse.ok) {
        const xeroData = await xeroResponse.json()
        const invoiceId = xeroData?.Invoices?.[0]?.InvoiceID

        if (invoiceId) {
          // Mark transaction as synced
          const txId = invoices.indexOf(invoice) < transactions.length ? transactions[invoices.indexOf(invoice)].id : null
          if (txId) {
            await service
              .from('pos_transactions')
              .update({ synced_to_xero: true, xero_invoice_id: invoiceId, synced_at: new Date().toISOString() })
              .eq('id', txId)

            syncResults.push({
              transaction_id: txId,
              status: 'success',
              xero_invoice_id: invoiceId,
            })
          }
        }
      } else {
        errorCount++
        const errorData = await xeroResponse.text()
        syncResults.push({
          status: 'failed',
          error: errorData,
        })
      }
    } catch (error: any) {
      errorCount++
      syncResults.push({
        status: 'error',
        error: error.message,
      })
    }
  }

  // Update integration status
  await service.from('pos_integrations').update({
    last_sync_at: new Date().toISOString(),
    error_log_json: errorCount > 0 ? JSON.stringify(syncResults.filter((r) => r.status !== 'success')) : null,
  })

  return NextResponse.json({
    success: errorCount === 0,
    synced_count: syncResults.filter((r) => r.status === 'success').length,
    failed_count: errorCount,
    results: syncResults,
    next_sync_scheduled: sync_type === 'automatic' ? 'nightly at 2:00 UTC' : 'manual only',
  })
}

function mapTaxCode(taxCode: string | null): string {
  // Map POS tax codes to Xero tax types
  const map: Record<string, string> = {
    'VAT-20-STANDARD': 'Tax on Sales',
    'VAT-5-REDUCED': 'Tax on Sales - Reduced',
    'VAT-0-EXEMPT': 'Tax Exempt',
    'SALES_TAX_7.25': 'Sales Tax',
    'SALES_TAX_8': 'Sales Tax',
  }
  return map[taxCode || ''] || 'Tax on Sales'
}
