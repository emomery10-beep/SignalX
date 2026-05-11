// ── WhatsApp delivery via Twilio ─────────────────────────────────────────────
// Uses Twilio's WhatsApp sandbox / production channel.
// Env vars needed:
//   TWILIO_ACCOUNT_SID   — from Twilio console
//   TWILIO_AUTH_TOKEN    — from Twilio console
//   TWILIO_WHATSAPP_FROM — e.g. "whatsapp:+14155238886" (sandbox) or your approved number

const TWILIO_API = 'https://api.twilio.com/2010-04-01'

export async function sendWhatsApp(to: string, message: string): Promise<boolean> {
  const sid   = process.env.TWILIO_ACCOUNT_SID
  const token = process.env.TWILIO_AUTH_TOKEN
  const from  = process.env.TWILIO_WHATSAPP_FROM

  if (!sid || !token || !from) {
    console.warn('[whatsapp] Twilio env vars not set — message not sent')
    return false
  }

  // Normalise number — ensure it starts with whatsapp:+
  const toFormatted = to.startsWith('whatsapp:') ? to : `whatsapp:${to.startsWith('+') ? to : '+' + to}`

  try {
    const res = await fetch(`${TWILIO_API}/Accounts/${sid}/Messages.json`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        From: from,
        To:   toFormatted,
        Body: message,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('[whatsapp] Twilio error:', err)
      return false
    }
    return true
  } catch (e) {
    console.error('[whatsapp] Send failed:', e)
    return false
  }
}

// ── Message templates ─────────────────────────────────────────────────────────

export function alertWhatsApp(opts: {
  businessName: string
  alertName: string
  message: string
  severity: 'critical' | 'warning' | 'info'
}): string {
  const icon = opts.severity === 'critical' ? '🔴' : opts.severity === 'warning' ? '🟡' : '🔵'
  return `${icon} *AskBiz Alert — ${opts.businessName}*\n\n*${opts.alertName}*\n${opts.message}\n\nView details: https://askbiz.co/alerts`
}

export function proactiveWhatsApp(opts: {
  businessName: string
  title: string
  body: string
  type: 'stock' | 'anomaly' | 'news' | 'shipment'
}): string {
  const icon = { stock: '📦', anomaly: '📊', news: '🌍', shipment: '🚚' }[opts.type]
  return `${icon} *AskBiz — ${opts.businessName}*\n\n*${opts.title}*\n${opts.body}\n\nhttps://askbiz.co/home`
}

export function digestWhatsApp(opts: {
  businessName: string
  items: { label: string; value: string }[]
}): string {
  const lines = opts.items.map(i => `• *${i.label}:* ${i.value}`).join('\n')
  return `📋 *AskBiz Daily Brief — ${opts.businessName}*\n\n${lines}\n\nhttps://askbiz.co/home`
}
