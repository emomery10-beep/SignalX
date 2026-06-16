import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosOwner } from '@/lib/pos-auth'

/**
 * GET /api/pos/gdpr/data-retention-report
 *
 * Returns data retention policy and schedules for compliance
 * Shows what data is kept, for how long, and when it will be deleted
 */
export async function GET(req: NextRequest) {
  const ownerId = await resolvePosOwner(req)
  if (!ownerId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()

  // Get customer count and stats
  const { data: customers } = await service
    .from('pos_customers')
    .select('id, created_at, last_seen_at, is_anonymized, anonymized_at')
    .eq('owner_id', ownerId)

  const { data: transactions } = await service
    .from('pos_transactions')
    .select('created_at, customer_id')
    .eq('owner_id', ownerId)

  const { data: consents } = await service
    .from('pos_consent_log')
    .select('consent_type, status, timestamp')
    .eq('owner_id', ownerId)

  // Has the automated retention job ever run for this owner? (honest signal)
  const { data: lastAutoRun } = await service
    .from('pos_gdpr_deletion_log')
    .select('created_at')
    .eq('owner_id', ownerId)
    .eq('reason', 'automated_retention_policy')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  // GPS pings still pending purge (employee location minimization).
  const { count: gpsPingsPendingPurge } = await service
    .from('pos_truck_locations')
    .select('id', { count: 'exact', head: true })
    .eq('owner_id', ownerId)
    .lt('recorded_at', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString())

  const now = new Date()
  const sevenYearsAgo = new Date(now.getTime() - 7 * 365 * 24 * 60 * 60 * 1000)
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)

  // Latest transaction date per customer — mirrors the cron's "cold history"
  // signal exactly (only customers whose newest transaction is 90+ days old
  // are anonymized; zero-transaction customers are never auto-anonymized).
  const latestTxByCustomer = new Map<string, number>()
  for (const t of (transactions as any[]) || []) {
    if (!t.customer_id) continue
    const ts = new Date(t.created_at).getTime()
    const prev = latestTxByCustomer.get(t.customer_id) || 0
    if (ts > prev) latestTxByCustomer.set(t.customer_id, ts)
  }

  // Calculate retention stats — only customers with a cold transaction history.
  const customersToDelete = customers?.filter((c: any) => {
    if (c.is_anonymized) return false // Already anonymized
    const latestTx = latestTxByCustomer.get(c.id)
    if (!latestTx) return false // No transactions → never auto-anonymized
    return latestTx < ninetyDaysAgo.getTime() // Last sale 90+ days ago
  }) || []

  const transactionsExpired = transactions?.filter((t: any) => {
    const txDate = new Date(t.created_at)
    return txDate < sevenYearsAgo // Older than 7 years
  }) || []

  const consentExpired = consents?.filter((c: any) => {
    const consentDate = new Date(c.timestamp)
    return consentDate < sevenYearsAgo
  }) || []

  return NextResponse.json({
    compliance_report: {
      generated_at: now.toISOString(),
      jurisdiction: 'GDPR / CCPA / UK GDPR',
      total_customers: customers?.length || 0,
      anonymized_customers: customers?.filter((c: any) => c.is_anonymized).length || 0,
      active_customers: customers?.filter((c: any) => !c.is_anonymized).length || 0,
    },

    retention_schedule: {
      customer_data: {
        policy: 'Anonymize inactive customers after 90 days of inactivity (PII masked; transactions retained for tax)',
        inactive_threshold_days: 90,
        customers_pending_deletion: customersToDelete.length,
        next_deletion_batch: customersToDelete.slice(0, 5).map((c: any) => ({
          customer_id: c.id,
          last_activity: c.last_seen_at || c.created_at,
          deletion_date: new Date(new Date(c.last_seen_at || c.created_at).getTime() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        })),
      },

      transaction_data: {
        policy: 'Retain transaction data for 7 years (tax compliance)',
        retention_period_years: 7,
        total_transactions: transactions?.length || 0,
        transactions_ready_for_deletion: transactionsExpired.length,
        oldest_active_transaction: transactions
          ?.sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())[0]?.created_at,
        retention_expires_date: new Date(now.getTime() + 7 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      },

      consent_records: {
        policy: 'Retain consent logs for 7 years (regulatory compliance)',
        retention_period_years: 7,
        total_consent_records: consents?.length || 0,
        records_ready_for_deletion: consentExpired.length,
        granted_consents: consents?.filter((c: any) => c.status === 'granted').length || 0,
        withdrawn_consents: consents?.filter((c: any) => c.status === 'withdrawn').length || 0,
      },

      gps_location_data: {
        policy: 'Purge driver GPS pings after 90 days (employee location minimization)',
        retention_period_days: 90,
        pings_pending_purge: gpsPingsPendingPurge || 0,
      },

      audit_logs: {
        policy: 'Retain audit logs for 7 years (compliance verification)',
        retention_period_years: 7,
      },
    },

    // Honest enforcement status: capabilities are reported separately from
    // whether retention is actually being enforced. We do NOT assert blanket
    // compliance — that depends on the automated retention job running and the
    // backlog being cleared.
    enforcement: {
      automated_retention_job: '/api/cron/gdpr-retention (daily)',
      retention_job_last_run: lastAutoRun?.created_at || null,
      retention_job_has_run: Boolean(lastAutoRun),
      // Anything still eligible for deletion below means minimization is not
      // fully enforced yet (job hasn't run, or hasn't caught up).
      backlog: {
        inactive_customers_awaiting_anonymization: customersToDelete.length,
        gps_pings_awaiting_purge: gpsPingsPendingPurge || 0,
      },
      retention_enforced:
        Boolean(lastAutoRun) && customersToDelete.length === 0 && (gpsPingsPendingPurge || 0) === 0,
    },

    capabilities: {
      consent_tracking_enabled: true,
      right_to_erasure_enabled: true,
      data_portability_enabled: true,
      automated_minimization_enabled: true,
    },

    actions_required: {
      customers_to_anonymize: customersToDelete.length,
      gps_pings_to_purge: gpsPingsPendingPurge || 0,
      transactions_to_archive: transactionsExpired.length,
      consent_records_to_archive: consentExpired.length,
    },
  })
}
