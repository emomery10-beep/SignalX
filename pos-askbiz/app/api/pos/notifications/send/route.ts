import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosOwner } from '@/lib/pos-auth'

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
      .select('whatsapp_enabled, email_enabled, whatsapp_account_sid, email_provider')
      .eq('owner_id', ownerId)
      .single()

    // Build message from template
    const message = buildMessage(message_template, data)

    let notificationResult: any = {
      notification_type,
      message_template,
      status: 'pending',
      methods_attempted: [],
    }

    // Try WhatsApp first (primary channel)
    if (settings?.whatsapp_enabled && recipient_phone) {
      const whatsappResult = await sendWhatsApp(recipient_phone, message, settings)
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
      recipient_email
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

    service_ready: `✅ Repair Complete\nHi ${data.customer_name},\n\nYour ${data.device_model} is ready for collection!\n\nTicket: ${data.ticket_number}\n\nPlease collect at your earliest convenience.\n— ${data.business_name || 'Repair Centre'}`,

    service_quote: `💬 Repair Quote\nHi ${data.customer_name},\n\nQuote for your ${data.device_model}:\n${data.fault_description}\n\nPrice: ${data.quoted_price}\nETA: ${data.estimated_time}\n\nReply YES to approve or call us to discuss.\n— ${data.business_name}`,

    service_collected: `🧾 Repair Receipt\nHi ${data.customer_name},\n\nThank you for collecting your ${data.device_model}.\n\nTicket: ${data.ticket_number}\nTotal paid: ${data.total_paid}\n\nThank you for choosing ${data.business_name}!`,

    service_warranty: `🛡️ Warranty Information\nHi ${data.customer_name},\n\nYour repair (${data.device_model}) comes with a ${data.warranty_days}-day warranty.\n\nTicket: ${data.ticket_number}\nWarranty expires: ${data.warranty_expires}\n\nIf you experience any issues, quote your ticket number.\n— ${data.business_name}`,
  }

  let message = messages[template] || template

  // Replace data variables
  for (const [key, value] of Object.entries(data)) {
    message = message.replace(`{${key}}`, String(value))
  }

  return message
}

async function sendWhatsApp(
  recipientPhone: string,
  message: string,
  settings: any
): Promise<{ success: boolean; message_id?: string; error?: string }> {
  try {
    // Would use Twilio WhatsApp API in production
    // For now, return mock success
    console.log(`WhatsApp to ${recipientPhone}: ${message}`)

    // Mock API call to Twilio
    /*
    const response = await fetch('https://api.twilio.com/2010-04-01/Accounts/' + settings.whatsapp_account_sid + '/Messages.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(settings.twilio_account_sid + ':' + settings.twilio_auth_token).toString('base64'),
      },
      body: new URLSearchParams({
        From: 'whatsapp:' + settings.whatsapp_sender_number,
        To: 'whatsapp:' + recipientPhone,
        Body: message,
      }).toString(),
    })
    */

    return {
      success: true,
      message_id: `msg_${Date.now()}`,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    }
  }
}

async function sendEmail(
  recipientEmail: string,
  message: string,
  template: string,
  settings: any
): Promise<{ success: boolean; message_id?: string; error?: string }> {
  try {
    // Would use SendGrid or similar in production
    console.log(`Email to ${recipientEmail}: ${message}`)

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
  }

  return subjects[template] || 'AskBiz Alert'
}
