import { NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

type ParcelNotifyEvent = 'dispatched' | 'delivered'

interface ParcelForNotify {
  tracking_number: string
  sender_name: string | null
  sender_phone: string | null
  receiver_name: string | null
  receiver_phone: string | null
  destination_city: string | null
  receipt_consent: boolean | null
}

// Fire-and-forget WhatsApp notifications for the two parcel status
// transitions that matter most to customers: dispatch (assigned to a
// driver) and delivery. Never blocks the caller's own status update — every
// failure is swallowed and logged.
//
// Consent:
//  - Sender: only notified when they explicitly opted in at counter intake
//    (pos_parcels.receipt_consent — backs the "Mtumaji anataka kupokea
//    risiti na taarifa za ufuatiliaji kwa WhatsApp/SMS" checkbox in
//    app/logistics/intake/page.tsx). No schema/consent bypass here.
//  - Receiver: there is no equivalent opt-in mechanism anywhere in the
//    schema (no receiver_consent column, nothing in pos_notification_settings
//    scoped to logistics). A tracking notification's entire value to the
//    receiver IS the notification, and courier services notify recipients
//    of dispatch/delivery by default — same posture as the repair
//    vertical's service_ready/service_collected sends, which fire
//    unconditionally to customer_phone with no extra consent gate beyond
//    the shared marketing opt-out already enforced inside
//    /api/pos/notifications/send. So the receiver is notified whenever a
//    receiver_phone was captured, with no additional gate invented here.
export function notifyParcelEvent(
  req: NextRequest,
  service: ReturnType<typeof createServiceClient>,
  ownerId: string,
  staffId: string | null,
  parcel: ParcelForNotify,
  event: ParcelNotifyEvent,
): void {
  const senderTemplate = event === 'dispatched' ? 'logistics_dispatched_sender' : 'logistics_delivered_sender'
  const receiverTemplate = event === 'dispatched' ? 'logistics_dispatched_receiver' : 'logistics_delivered_receiver'

  service
    .from('profiles')
    .select('business_name')
    .eq('id', ownerId)
    .single()
    .then(({ data: profile }) => {
      const businessName = (profile as { business_name?: string } | null)?.business_name || 'the courier'
      const headers = { 'Content-Type': 'application/json', 'x-staff-id': staffId || '', 'x-owner-id': ownerId }

      const send = (template: string, phone: string, data: Record<string, unknown>) =>
        fetch(new URL('/api/pos/notifications/send', req.url).toString(), {
          method: 'POST',
          headers,
          body: JSON.stringify({
            notification_type: `logistics_${event}`,
            recipient_phone: phone,
            message_template: template,
            data,
          }),
        }).catch(err => console.error(`Parcel ${event} sender/receiver notification failed:`, err))

      if (parcel.receipt_consent === true && parcel.sender_phone) {
        send(senderTemplate, parcel.sender_phone, {
          sender_name: parcel.sender_name || 'there',
          receiver_name: parcel.receiver_name || 'the recipient',
          destination: parcel.destination_city || 'the destination',
          tracking_number: parcel.tracking_number,
          business_name: businessName,
        })
      }

      if (parcel.receiver_phone) {
        send(receiverTemplate, parcel.receiver_phone, {
          sender_name: parcel.sender_name || 'the sender',
          receiver_name: parcel.receiver_name || 'there',
          tracking_number: parcel.tracking_number,
          business_name: businessName,
        })
      }
    })
    .catch(err => console.error(`Parcel ${event} notification setup failed:`, err))
}
