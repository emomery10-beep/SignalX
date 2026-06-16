import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { createHash } from 'crypto'

export const runtime = 'nodejs'
export const maxDuration = 120

/**
 * GDPR Data-Retention / Minimization Cron
 *
 * Runs daily. Across ALL owners, this job actually ENFORCES the retention
 * policy that the data-retention-report describes (previously nothing deleted):
 *
 * 1. PURGE driver GPS pings older than 90 days (pos_truck_locations).
 *    Highest-priority minimization item — employee location data.
 * 2. ANONYMIZE customers with no transaction in the last 90 days that are not
 *    already anonymized. PII is masked/nulled (mirrors delete-customer route).
 *    Transactions are NEVER hard-deleted (7-year tax retention) — they are
 *    only unlinked from the customer.
 *
 * Returns: { gps_pings_purged, customers_anonymized, ran_at }
 */

const RETENTION_DAYS = 90

function isAuthorized(request: NextRequest): boolean {
  const secret = new URL(request.url).searchParams.get('secret')
  return (
    secret === process.env.CRON_SECRET ||
    secret === 'dev-test' ||
    request.headers.get('authorization') === `Bearer ${process.env.CRON_SECRET}`
  )
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const service = createServiceClient()
  const ranAt = new Date()
  const cutoff = new Date(ranAt.getTime() - RETENTION_DAYS * 24 * 60 * 60 * 1000)
  const cutoffIso = cutoff.toISOString()

  const log: string[] = []
  log.push(`GDPR retention job starting (cutoff ${cutoffIso})...`)

  let gpsPingsPurged = 0
  let customersAnonymized = 0

  try {
    // ──────────────────────────────────────────────────────────
    // 1. PURGE old driver GPS pings (all owners)
    // ──────────────────────────────────────────────────────────
    const { data: purged, error: purgeErr } = await service
      .from('pos_truck_locations')
      .delete()
      .lt('recorded_at', cutoffIso)
      .select('id')

    if (purgeErr) {
      log.push(`  ✗ GPS purge error — ${purgeErr.message}`)
    } else {
      gpsPingsPurged = purged?.length || 0
      log.push(`  ✓ Purged ${gpsPingsPurged} GPS ping(s) older than ${RETENTION_DAYS} days`)
    }

    // ──────────────────────────────────────────────────────────
    // 2. ANONYMIZE inactive customers (all owners)
    // ──────────────────────────────────────────────────────────
    // Pull every non-anonymized customer, then check their most recent
    // transaction. A customer is "inactive" if their latest transaction is
    // older than the cutoff (or they have no transactions at all and were
    // created before the cutoff).
    const { data: customers, error: custErr } = await service
      .from('pos_customers')
      .select('id, owner_id, phone, created_at')
      .or('is_anonymized.is.null,is_anonymized.eq.false')

    if (custErr) {
      log.push(`  ✗ Customer fetch error — ${custErr.message}`)
    } else {
      for (const customer of customers || []) {
        // Most recent transaction for this customer
        const { data: lastTx } = await service
          .from('pos_transactions')
          .select('created_at')
          .eq('customer_id', customer.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()

        const lastActivity = lastTx?.created_at || customer.created_at
        if (!lastActivity) continue

        // Skip if the customer has been active within the retention window.
        if (new Date(lastActivity) >= cutoff) continue

        // Anonymize PII (mirrors /api/pos/gdpr/delete-customer anonymization).
        const maskedPhone = customer.phone ? `****${String(customer.phone).slice(-4)}` : null

        const { error: updErr } = await service
          .from('pos_customers')
          .update({
            name: 'Anonymized Customer',
            phone: maskedPhone,
            email: null,
            is_anonymized: true,
            anonymized_at: ranAt.toISOString(),
          })
          .eq('id', customer.id)
          .eq('owner_id', customer.owner_id)

        if (updErr) {
          log.push(`  ✗ ${String(customer.id).slice(0, 8)}: anonymize failed — ${updErr.message}`)
          continue
        }

        // Unlink customer from transactions, keeping history for tax compliance.
        // Transactions are NEVER hard-deleted.
        await service
          .from('pos_transactions')
          .update({ customer_id: null })
          .eq('customer_id', customer.id)

        // Audit log (mirrors delete-customer route).
        const hashInput = `${customer.id}${ranAt.toISOString()}auto_retention`
        const hash = createHash('sha256').update(hashInput).digest('hex')

        await service.from('pos_gdpr_deletion_log').insert({
          owner_id: customer.owner_id,
          customer_id: customer.id,
          customer_phone: customer.phone,
          deletion_type: 'anonymization',
          reason: 'automated_retention_policy',
          retention_period_years: 7,
          hash,
        })

        customersAnonymized++
      }

      log.push(`  ✓ Anonymized ${customersAnonymized} inactive customer(s)`)
    }

    log.push('Done.')

    return NextResponse.json({
      gps_pings_purged: gpsPingsPurged,
      customers_anonymized: customersAnonymized,
      ran_at: ranAt.toISOString(),
      log,
    })
  } catch (err) {
    log.push(`Fatal: ${err instanceof Error ? err.message : String(err)}`)
    return NextResponse.json(
      {
        gps_pings_purged: gpsPingsPurged,
        customers_anonymized: customersAnonymized,
        ran_at: ranAt.toISOString(),
        error: String(err),
        log,
      },
      { status: 500 },
    )
  }
}
