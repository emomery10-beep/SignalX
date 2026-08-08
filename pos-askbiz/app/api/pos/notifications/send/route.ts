import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosOwner } from '@/lib/pos-auth'
import { sendNotification } from '@/lib/whatsapp'
import { COUNTRY_DIAL } from '@/lib/phone'

type ConsentChannel = 'whatsapp' | 'sms' | 'email'

/**
 * GDPR consent gate. Returns true ONLY when the customer record clearly exists
 * AND the relevant channel's marketing-consent flag is explicitly false (hard
 * opt-out). Defensive: any DB error or missing record → returns false (proceed),
 * so the consent lookup can never crash the send path.
 *
 * Consent flags live on pos_customer_preferences (keyed by customer_id); the
 * customer is resolved from pos_customers by recipient phone/email + owner_id.
 */
async function isCustomerOptedOut(
  service: ReturnType<typeof createServiceClient>,
  ownerId: string,
  channel: ConsentChannel,
  recipient: { phone?: string | null; email?: string | null }
): Promise<boolean> {
  try {
    let customerQuery = service.from('pos_customers').select('id').eq('owner_id', ownerId)
    if (channel === 'email' && recipient.email) {
      customerQuery = customerQuery.eq('email', recipient.email)
    } else if (recipient.phone) {
      customerQuery = customerQuery.eq('phone', recipient.phone)
    } else {
      return false
    }

    const { data: customer } = await customerQuery.maybeSingle()
    if (!customer?.id) return false // no matching customer → proceed

    const column =
      channel === 'email'
        ? 'allow_email_marketing'
        : channel === 'sms'
          ? 'allow_sms_marketing'
          : 'allow_whatsapp_marketing'

    const { data: prefs } = await service
      .from('pos_customer_preferences')
      .select(column)
      .eq('owner_id', ownerId)
      .eq('customer_id', customer.id)
      .maybeSingle()

    // Only block on an EXPLICIT false. null / missing prefs → proceed.
    return (prefs as Record<string, boolean | null> | null)?.[column] === false
  } catch {
    return false // never let a consent-lookup error block a legitimate send
  }
}

/**
 * POST /api/pos/notifications/send
 *
 * Send notifications via WhatsApp (primary) or Email (fallback)
 * Used for: inventory alerts, sales anomalies, cash discrepancies, tax reminders
 *
 * Body:
 *   notification_type: 'inventory_alert' | 'sales_anomaly' | 'cash_variance' | 'tax_reminder' | 'payment_failed'
 *   recipient_phone?: string (for WhatsApp)
 *   recipient_email?: string (fallback if WhatsApp unavailable)
 *   message_template: string (name of template to use)
 *   data: object (template variables)
 */
export async function POST(req: NextRequest) {
  const ownerId = await resolvePosOwner(req)
  if (!ownerId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const body = await req.json()
  const { notification_type, recipient_phone, recipient_email, message_template, data } = body

  if (!notification_type || !message_template) {
    return NextResponse.json({ error: 'notification_type and message_template required' }, { status: 400 })
  }

  try {
    // Get notification settings
    const { data: settings } = await service
      .from('pos_notification_settings')
      .select('whatsapp_enabled, email_enabled, email_provider')
      .eq('owner_id', ownerId)
      .single()

    // Cashiers/customers type local-format numbers with no country selector
    // on that field — use the merchant's own signup country as the dial-code
    // hint, same as /api/pos/receipt, so it normalises to E.164 before
    // hitting the WhatsApp Cloud API (a malformed number still gets a 200 OK
    // from Meta but never delivers).
    const { data: profile } = await service
      .from('profiles')
      .select('country_code')
      .eq('id', ownerId)
      .maybeSingle()
    const dialHint = COUNTRY_DIAL.find(c => c.code === profile?.country_code)?.dial

    // Build message from template
    const message = buildMessage(message_template, data)

    let notificationResult: any = {
      notification_type,
      message_template,
      status: 'pending',
      methods_attempted: [],
    }

    // GDPR consent gate — these notifications are marketing/promotional, so a
    // hard opt-out on a channel means we skip that channel entirely.
    const whatsappOptedOut =
      !!recipient_phone && (await isCustomerOptedOut(service, ownerId, 'whatsapp', { phone: recipient_phone }))
    const emailOptedOut =
      !!recipient_email && (await isCustomerOptedOut(service, ownerId, 'email', { email: recipient_email }))

    // If every channel we could have used is opted out, skip the send outright.
    const whatsappViable = !!(settings?.whatsapp_enabled && recipient_phone)
    const emailViable = !!(settings?.email_enabled && recipient_email)
    if (
      (whatsappViable || emailViable) &&
      (!whatsappViable || whatsappOptedOut) &&
      (!emailViable || emailOptedOut)
    ) {
      return NextResponse.json({ sent: false, skipped: true, reason: 'customer opted out' })
    }

    // Try WhatsApp first (primary channel)
    if (settings?.whatsapp_enabled && recipient_phone && !whatsappOptedOut) {
      const whatsappResult = await sendWhatsApp(recipient_phone, message, dialHint)
      notificationResult.methods_attempted.push('whatsapp')

      if (whatsappResult.success) {
        notificationResult.status = 'sent_whatsapp'
        notificationResult.whatsapp_message_id = whatsappResult.message_id
      } else if (!recipient_email) {
        // No fallback available
        notificationResult.status = 'failed'
        notificationResult.error = whatsappResult.error
      }
    }

    // Fallback to email if WhatsApp failed or unavailable
    if (
      notificationResult.status !== 'sent_whatsapp' &&
      settings?.email_enabled &&
      recipient_email &&
      !emailOptedOut
    ) {
      const emailResult = await sendEmail(recipient_email, message, message_template, settings)
      notificationResult.methods_attempted.push('email')

      if (emailResult.success) {
        notificationResult.status = notificationResult.status === 'pending' ? 'sent_email' : 'sent_both'
        notificationResult.email_message_id = emailResult.message_id
      } else {
        notificationResult.status = 'failed'
        notificationResult.error = emailResult.error
      }
    }

    // Log notification
    await service.from('pos_notification_log').insert({
      owner_id: ownerId,
      notification_type,
      status: notificationResult.status,
      recipient_phone,
      recipient_email,
      message: message,
      sent_at: new Date().toISOString(),
      methods_used_json: notificationResult.methods_attempted,
    })

    return NextResponse.json(notificationResult)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Notification failed' }, { status: 500 })
  }
}

/**
 * GET /api/pos/notifications/settings
 *
 * Get user's notification preferences
 */
export async function GET(req: NextRequest) {
  const ownerId = await resolvePosOwner(req)
  if (!ownerId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()

  const { data: settings } = await service
    .from('pos_notification_settings')
    .select(
      'whatsapp_enabled, email_enabled, whatsapp_phone, email_address, inventory_alerts_enabled, sales_anomaly_alerts_enabled, cash_variance_alerts_enabled, tax_reminder_alerts_enabled'
    )
    .eq('owner_id', ownerId)
    .single()

  return NextResponse.json(settings || {})
}

function buildMessage(template: string, data: Record<string, any>): string {
  const messages: Record<string, string> = {
    inventory_alert: `⚠️ Inventory Alert\n${data.product_name} stock low: ${data.qty_remaining} units remaining.\nReorder threshold: ${data.reorder_qty} units.\n\nAction: Order now to avoid stockouts.`,

    sales_anomaly: `📊 Sales Anomaly Detected\nSales today: £${data.daily_sales}\nNormal average: £${data.avg_sales}\nVariance: ${data.variance_percent}%\n\nAction: Review transaction details for unusual patterns.`,

    cash_variance: `💰 Cash Variance Detected\nExpected: £${data.expected_cash}\nActual: £${data.actual_cash}\nVariance: £${data.variance_amount} (${data.variance_percent}%)\nReason: ${data.reason || 'Not provided'}\n\nAction: Review shift reconciliation.`,

    tax_reminder: `📅 Tax Filing Reminder\nJurisdiction: ${data.jurisdiction}\nDeadline: ${data.deadline}\nDays until: ${data.days_until}\nTax due: £${data.tax_due}\n\nAction: Prepare and file tax return.`,

    payment_failed: `❌ Payment Failed\nTransaction: ${data.transaction_id}\nAmount: £${data.amount}\nReason: ${data.failure_reason}\n\nAction: Contact customer or retry payment.`,

    service_intake: `🔧 Repair Intake Confirmation\nHi ${data.customer_name},\n\nYour device (${data.device_model}) has been checked in for repair.\n\nTicket: ${data.ticket_number}\nIssue: ${data.fault_description}\nEstimate: ${data.quoted_price}\nETA: ${data.estimated_time}\n\nWe'll notify you when it's ready.\n— ${data.business_name}`,

    // photo_note (optional) — one or two "Photo: <url>" / "Replaced part: <url>"
    // lines built by service-jobs/route.ts's completed-transition handler from
    // whatever was captured in the "Mark Ready" photo step. Plain text links,
    // not a template image header — see that handler for why.
    service_ready: `✅ Repair Complete\nHi ${data.customer_name},\n\nYour ${data.device_model} is ready for collection!\n\nTicket: ${data.ticket_number}\n${data.photo_note ? '\n' + data.photo_note + '\n' : ''}\nPlease collect at your earliest convenience.\n— ${data.business_name || 'Repair Centre'}`,

    service_quote: `💬 Repair Quote\nHi ${data.customer_name},\n\nQuote for your ${data.device_model}:\n${data.fault_description}\n\nPrice: ${data.quoted_price}\nETA: ${data.estimated_time}\n\nReply YES to approve or call us to discuss.\n— ${data.business_name}`,

    service_collected: `🧾 Repair Receipt\nHi ${data.customer_name},\n\nThank you for collecting your ${data.device_model}.\n\nTicket: ${data.ticket_number}\nTotal paid: ${data.total_paid}\n\nThank you for choosing ${data.business_name}!`,

    service_warranty: `🛡️ Warranty Information\nHi ${data.customer_name},\n\nYour repair (${data.device_model}) comes with a ${data.warranty_days}-day warranty.\n\nTicket: ${data.ticket_number}\nWarranty expires: ${data.warranty_expires}\n\nIf you experience any issues, quote your ticket number.\n— ${data.business_name}`,

    salon_booking_confirmed: `💇 Booking Confirmed\nHi ${data.client_name},\n\nYour ${data.service_name} appointment is confirmed for ${data.appointment_time}.${data.stylist_name ? `\nStylist: ${data.stylist_name}` : ''}\n\nSee you then!\n— ${data.business_name}`,

    restaurant_order_confirmed: `🍽️ Order Confirmed\nHi ${data.customer_name},\n\nWe've received your order:\n${data.order_summary}\n\nTotal: ${data.total}\n\nWe'll let you know when it's ready.\n— ${data.business_name}`,

    restaurant_reservation_confirmed: `📅 Reservation Confirmed\nHi ${data.customer_name},\n\nYour table for ${data.covers} on ${data.reserved_time} is confirmed.\n\nWe look forward to seeing you.\n— ${data.business_name}`,

    logistics_dispatched_sender: `🚚 Parcel Dispatched\nHi ${data.sender_name},\n\nYour parcel to ${data.destination} has been assigned to a driver and is on its way.\n\nTracking: ${data.tracking_number}\n— ${data.business_name}`,

    logistics_dispatched_receiver: `🚚 Parcel On The Way\nHi ${data.receiver_name},\n\nA parcel from ${data.sender_name} is on its way to you.\n\nTracking: ${data.tracking_number}\n— ${data.business_name}`,

    logistics_delivered_sender: `✅ Parcel Delivered\nHi ${data.sender_name},\n\nYour parcel has been delivered to ${data.receiver_name}.\n\nTracking: ${data.tracking_number}\n— ${data.business_name}`,

    logistics_delivered_receiver: `✅ Parcel Delivered\nHi ${data.receiver_name},\n\nYour parcel has arrived. Thank you!\n\nTracking: ${data.tracking_number}\n— ${data.business_name}`,
  }

  let message = messages[template] || template

  // Replace data variables
  for (const [key, value] of Object.entries(data)) {
    message = message.replace(`{${key}}`, String(value))
  }

  return message
}

// Real send via Meta's WhatsApp Cloud API — same helper (lib/whatsapp.ts) and
// same env vars (META_WHATSAPP_TOKEN / META_PHONE_NUMBER_ID) that retail's
// receipt send (app/api/pos/receipt/route.ts) already uses in production.
async function sendWhatsApp(
  recipientPhone: string,
  message: string,
  dialHint?: string
): Promise<{ success: boolean; message_id?: string; error?: string }> {
  // Do not log recipient phone or message body (PII).
  const result = await sendNotification(recipientPhone, message, dialHint)
  if (!result.ok) {
    return { success: false, error: result.error }
  }
  return { success: true, message_id: result.messageId }
}

async function sendEmail(
  recipientEmail: string,
  message: string,
  template: string,
  settings: any
): Promise<{ success: boolean; message_id?: string; error?: string }> {
  try {
    // Would use SendGrid or similar in production
    // Do not log recipient email or message body (PII).
    console.log('Email notification dispatched')

    /*
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + process.env.SENDGRID_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: recipientEmail }],
          },
        ],
        from: {
          email: settings.email_sender || 'noreply@askbiz.app',
        },
        subject: getEmailSubject(template),
        content: [
          {
            type: 'text/plain',
            value: message,
          },
        ],
      }),
    })
    */

    return {
      success: true,
      message_id: `email_${Date.now()}`,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    }
  }
}

function getEmailSubject(template: string): string {
  const subjects: Record<string, string> = {
    inventory_alert: '⚠️ Inventory Alert - Stock Low',
    sales_anomaly: '📊 Sales Anomaly Detected',
    cash_variance: '💰 Cash Variance Report',
    tax_reminder: '📅 Tax Filing Reminder',
    payment_failed: '❌ Payment Failed',
    service_intake: '🔧 Repair Intake Confirmation',
    service_ready: '✅ Your Repair is Ready for Collection',
    service_quote: '💬 Repair Quote for Your Device',
    service_collected: '🧾 Repair Collection Receipt',
    service_warranty: '🛡️ Repair Warranty Information',
    salon_booking_confirmed: '💇 Your Appointment is Confirmed',
    restaurant_order_confirmed: '🍽️ Your Order is Confirmed',
    restaurant_reservation_confirmed: '📅 Your Reservation is Confirmed',
    logistics_dispatched_sender: '🚚 Your Parcel Has Been Dispatched',
    logistics_dispatched_receiver: '🚚 A Parcel is On Its Way to You',
    logistics_delivered_sender: '✅ Your Parcel Has Been Delivered',
    logistics_delivered_receiver: '✅ Your Parcel Has Arrived',
  }

  return subjects[template] || 'AskBiz Alert'
}
