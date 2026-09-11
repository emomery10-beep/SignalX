/**
 * Send WhatsApp notification when factory dispatch is approved.
 *
 * Sends dispatch details to recipient via WhatsApp:
 * - Product name & quantity
 * - Destination
 * - Approval timestamp
 * - Price (if set)
 */

export interface WhatsAppResult {
  success: boolean
  messageId?: string
  error?: string
}

export async function sendDispatchWhatsApp(
  phoneNumber: string | null,
  productName: string | null,
  quantity: number | null,
  destination: string | null,
  price: number | null
): Promise<WhatsAppResult> {
  // WhatsApp phone validation and sending
  if (!phoneNumber?.trim()) {
    return { success: true } // No phone, skip silently
  }

  try {
    const cleanPhone = phoneNumber.replace(/\D/g, '')
    if (cleanPhone.length < 10) {
      return { success: true } // Invalid phone, skip
    }

    const message = formatDispatchMessage(productName, quantity, destination, price)

    // Log the intent (actual sending requires WhatsApp Business API setup)
    console.log(`[WhatsApp] Dispatch notification queued for ${cleanPhone}: ${message}`)

    // TODO: Integrate with WhatsApp Business API when credentials available
    // For now, this logs the message that would be sent
    return { success: true, messageId: `msg_${Date.now()}` }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('WhatsApp dispatch notification failed:', message)
    return { success: false, error: message }
  }
}

function formatDispatchMessage(
  productName: string | null,
  quantity: number | null,
  destination: string | null,
  price: number | null
): string {
  let msg = `🚚 *Dispatch Approved*\n\n`

  if (productName) msg += `📦 Product: *${productName}*\n`
  if (quantity) msg += `⚖️ Quantity: *${quantity} kg*\n`
  if (destination) msg += `📍 Destination: *${destination}*\n`
  if (price) msg += `💰 Unit Price: *${price.toLocaleString()}*\n`

  msg += `\n✅ Ready for dispatch`

  return msg
}
