// Queue a factory write on this device when the network is down, so a floor worker's shift start, downtime report,
// waybill or non-dispatch approval is not lost. Only PIN staff (who work on shared floor devices with poor signal)
// get queued writes; they are replayed and counted by components/PosOutboxBanner. Every route used here is safe to
// replay: creates carry a client_tx_id the server de-duplicates on, and updates are conditional on current state
// (a repeat gets a 400 "already done", which the queue treats as finished).
import { enqueueOfflineWrite, generateClientTxId } from '@/lib/pos-offline-queue'

export interface QueueSession { ownerId: string; staffId?: string; isPin: boolean }

/** true = saved on this device for upload later; false = not queued (owner session, or storage full) — show the normal error. */
export async function queueWrite(
  session: QueueSession,
  endpoint: string,
  method: 'POST' | 'PATCH',
  body: Record<string, any>,
  prefix: string,
  clientTxId: string = generateClientTxId(prefix),
): Promise<boolean> {
  if (!session.isPin) return false
  try {
    await enqueueOfflineWrite({
      client_tx_id: clientTxId, owner_id: session.ownerId, staff_id: session.staffId || '',
      endpoint, method, body: { ...body, client_tx_id: body.client_tx_id ?? clientTxId }, created_at: new Date().toISOString(),
    })
    return true
  } catch {
    return false
  }
}
