/**
 * WhatsApp notifications for factory dispatches, sent through the shared
 * `askbiz_notification` Utility template (lib/whatsapp.ts sendNotification) —
 * the same one repair, salon, restaurant and logistics already use.
 *
 * Two moments: "awaiting approval" (manager presses Send on the approvals
 * screen, before signing off) and "approved" (automatic, on approval).
 *
 * The customer's number is logged by the dispatcher into buyer_name on the
 * capture (see app/factory/capture/page.tsx). Meta rejects newlines in
 * template parameters, so messages are single-line.
 */
import { createServiceClient } from '@/lib/supabase/server'
import { COUNTRY_DIAL } from '@/lib/phone'
import { sendNotification } from '@/lib/whatsapp'

export interface WhatsAppResult {
  success: boolean
  skipped?: boolean
  messageId?: string
  error?: string
}

export type DispatchMessageKind = 'pending' | 'approved'

export interface DispatchMessageInput {
  kind: DispatchMessageKind
  productName: string | null
  quantity: number | null
  destination: string | null
  price?: number | null
}

export function formatDispatchMessage(m: DispatchMessageInput): string {
  const qty = m.quantity != null ? `${m.quantity} kg` : ''
  const what = [m.productName, qty].filter(Boolean).join(', ')
  const to = m.destination?.trim() ? ` to ${m.destination.trim()}` : ''
  if (m.kind === 'pending') {
    return `🚚 Dispatch update: your dispatch (${what || 'goods'}${to}) is awaiting approval. We will confirm as soon as it is approved.`
  }
  const price = m.price ? ` Unit price: ${m.price.toLocaleString()}.` : ''
  return `🚚 Dispatch approved: ${what || 'goods'}${to} is ready for dispatch.${price}`
}

export function cleanWhatsAppNumber(raw: string | null | undefined): string {
  return (raw || '').replace(/\D/g, '')
}

export async function sendDispatchWhatsApp(
  ownerId: string,
  phoneNumber: string | null | undefined,
  message: DispatchMessageInput
): Promise<WhatsAppResult> {
  const phone = cleanWhatsAppNumber(phoneNumber)
  if (phone.length < 8) return { success: true, skipped: true } // no usable number

  try {
    const service = createServiceClient()
    const { data: profile } = await service
      .from('profiles')
      .select('country_code')
      .eq('id', ownerId)
      .maybeSingle()
    const dialHint = COUNTRY_DIAL.find(c => c.code === profile?.country_code)?.dial

    const res = await sendNotification(phone, formatDispatchMessage(message), dialHint)
    if (!res.ok) return { success: false, error: res.error }
    return { success: true, messageId: res.messageId }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[factory-dispatch-whatsapp] send failed:', msg)
    return { success: false, error: msg }
  }
}
