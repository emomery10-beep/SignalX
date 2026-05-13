import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosOwner } from '@/lib/pos-auth'

/**
 * GET /api/pos/integrations/status
 *
 * Returns status of all connected integrations
 * Helps user understand which services are synced and when last sync occurred
 */
export async function GET(req: NextRequest) {
  const ownerId = await resolvePosOwner(req)
  if (!ownerId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()

  // Get all integrations for this owner
  const { data: integrations } = await service
    .from('pos_integrations')
    .select('provider, is_active, connected_at, last_sync_at, error_log_json')
    .eq('owner_id', ownerId)

  const status: Record<string, any> = {
    integrations: {},
    summary: {
      connected_count: 0,
      failed_count: 0,
      last_sync_overall: null,
    },
  }

  // Build status for each integration
  const integrationsList = integrations || []

  for (const integration of integrationsList) {
    const { provider, is_active, connected_at, last_sync_at, error_log_json } = integration

    const errorLog = error_log_json ? JSON.parse(error_log_json) : null

    status.integrations[provider] = {
      provider,
      connected: is_active,
      connected_at,
      last_sync_at,
      sync_status: is_active ? (last_sync_at ? 'synced' : 'ready_to_sync') : 'disconnected',
      has_errors: !!errorLog,
      error_count: errorLog?.length || 0,
      last_error: errorLog?.[0]?.error,
    }

    if (is_active) {
      status.summary.connected_count++
    }
    if (errorLog) {
      status.summary.failed_count++
    }

    // Track overall last sync
    if (last_sync_at && (!status.summary.last_sync_overall || last_sync_at > status.summary.last_sync_overall)) {
      status.summary.last_sync_overall = last_sync_at
    }
  }

  // Add available integrations not yet connected
  const availableProviders = ['xero', 'quickbooks', 'stripe', 'shopify']
  for (const provider of availableProviders) {
    if (!status.integrations[provider]) {
      status.integrations[provider] = {
        provider,
        connected: false,
        available: true,
        connect_url: `/api/pos/integrations/${provider}/connect`,
      }
    }
  }

  // Recommendations based on status
  status.recommendations = []
  if (status.summary.connected_count === 0) {
    status.recommendations.push('Connect Xero or QuickBooks for automatic accounting sync')
  }
  if (status.summary.failed_count > 0) {
    status.recommendations.push('Some integrations have errors - check and retry sync')
  }
  if (status.summary.last_sync_overall && isOldSync(status.summary.last_sync_overall)) {
    status.recommendations.push('Last sync was more than 24 hours ago - trigger manual sync')
  }

  return NextResponse.json(status)
}

/**
 * POST /api/pos/integrations/disconnect
 *
 * Disconnects an integration and removes stored credentials
 */
export async function POST(req: NextRequest) {
  const ownerId = await resolvePosOwner(req)
  if (!ownerId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const body = await req.json()
  const { provider } = body

  if (!provider) {
    return NextResponse.json({ error: 'provider required' }, { status: 400 })
  }

  const { error } = await service
    .from('pos_integrations')
    .update({ is_active: false, credentials_json: null })
    .eq('owner_id', ownerId)
    .eq('provider', provider)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    message: `${provider} disconnected`,
    provider,
  })
}

function isOldSync(lastSync: string): boolean {
  const lastSyncTime = new Date(lastSync).getTime()
  const now = Date.now()
  const dayInMs = 24 * 60 * 60 * 1000
  return now - lastSyncTime > dayInMs
}
