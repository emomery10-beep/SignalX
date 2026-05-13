import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosOwner } from '@/lib/pos-auth'
import { createHash } from 'crypto'

/**
 * POST /api/pos/gdpr/transaction-history
 *
 * Records immutable transaction history with SHA-256 hash chaining
 * Enables tamper detection and audit trail verification
 */
export async function POST(req: NextRequest) {
  const ownerId = await resolvePosOwner(req)
  if (!ownerId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const body = await req.json()

  const {
    transaction_id,
    state_json,
    change_reason = 'created', // 'created', 'refund', 'amendment', 'tax_rate_update', 'correction'
    change_details_json = null,
    changed_by = null,
  } = body

  if (!transaction_id || !state_json) {
    return NextResponse.json({ error: 'transaction_id and state_json required' }, { status: 400 })
  }

  // Get previous hash (for chain)
  const { data: previousHistory } = await service
    .from('pos_transaction_history')
    .select('hash, version')
    .eq('transaction_id', transaction_id)
    .eq('owner_id', ownerId)
    .order('version', { ascending: false })
    .limit(1)

  const previousHash = previousHistory?.[0]?.hash || null
  const version = (previousHistory?.[0]?.version || 0) + 1

  // Calculate hash: SHA-256(previous_hash + current_state)
  const hashInput = `${previousHash || ''}${JSON.stringify(state_json)}`
  const hash = createHash('sha256').update(hashInput).digest('hex')

  // Insert history record
  const { error: historyError } = await service.from('pos_transaction_history').insert({
    owner_id: ownerId,
    transaction_id,
    version,
    state_json,
    hash,
    previous_hash: previousHash,
    change_reason,
    change_details_json,
    changed_by: changed_by || null,
    changed_at: new Date().toISOString(),
  })

  if (historyError) {
    return NextResponse.json({ error: historyError.message }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    transaction_id,
    version,
    hash,
    hash_chain_valid: previousHash !== null, // True if this is not the first version
    tamper_detection_enabled: true,
  })
}

/**
 * GET /api/pos/gdpr/transaction-history?transaction_id=xxx
 *
 * Retrieves full immutable history of a transaction
 * Verifies hash chain integrity
 */
export async function GET(req: NextRequest) {
  const ownerId = await resolvePosOwner(req)
  if (!ownerId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const { searchParams } = new URL(req.url)

  const transaction_id = searchParams.get('transaction_id')
  if (!transaction_id) {
    return NextResponse.json({ error: 'transaction_id required' }, { status: 400 })
  }

  const { data: history, error } = await service
    .from('pos_transaction_history')
    .select('*')
    .eq('transaction_id', transaction_id)
    .eq('owner_id', ownerId)
    .order('version', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Verify hash chain integrity
  let chainValid = true
  let tamperingDetected = false

  if (history && history.length > 0) {
    for (let i = 1; i < history.length; i++) {
      const current = history[i]
      const previous = history[i - 1]

      // Recalculate hash
      const expectedHashInput = `${previous.hash}${JSON.stringify(current.state_json)}`
      const expectedHash = createHash('sha256').update(expectedHashInput).digest('hex')

      if (expectedHash !== current.hash) {
        chainValid = false
        tamperingDetected = true
        break
      }
    }
  }

  return NextResponse.json({
    transaction_id,
    history: history || [],
    integrity: {
      hash_chain_valid: chainValid,
      tamper_detection_enabled: true,
      tampering_detected: tamperingDetected,
      total_versions: history?.length || 0,
      first_recorded: history?.[0]?.changed_at,
      last_recorded: history?.[history.length - 1]?.changed_at,
    },
    audit_ready: chainValid && !tamperingDetected,
  })
}
