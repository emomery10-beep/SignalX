// ── Email sender via Resend API ───────────────────────────────────────────────
// No package needed — uses the Resend REST API directly

const RESEND_API = 'https://api.resend.com/emails'
const FROM = 'AskBiz <noreply@askbiz.co>'

interface SendOptions {
  to: string
  subject: string
  html: string
  replyTo?: string
}

export async function sendEmail(opts: SendOptions): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('[email] RESEND_API_KEY not set — email not sent')
    return false
  }

  try {
    const res = await fetch(RESEND_API, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM,
        to: opts.to,
        subject: opts.subject,
        html: opts.html,
        reply_to: opts.replyTo,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('[email] Resend error:', err)
      return false
    }

    return true
  } catch (e) {
    console.error('[email] Send failed:', e)
    return false
  }
}

// ── Team invite email template ────────────────────────────────────────────────
export function teamInviteEmail(opts: {
  inviterName: string
  inviteeName: string
  role: string
  acceptUrl: string
}): string {
  const roleLabels: Record<string, string> = {
    admin:      'Admin — full access',
    analyst:    'Analyst — read and write data',
    accountant: 'Accountant — financial reports and CFO Mode',
    buyer:      'Buyer — inventory and supply chain',
    viewer:     'Viewer — read-only access',
  }
  const roleLabel = roleLabels[opts.role] || opts.role

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>You have been invited to AskBiz</title>
</head>
<body style="margin:0;padding:0;background:#f4f3f1;font-family:system-ui,-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f3f1;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.08);">
          
          <!-- Header -->
          <tr>
            <td style="background:#6366F1;padding:28px 36px;text-align:center;">
              <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td style="background:rgba(255,255,255,0.15);border-radius:10px;padding:10px 14px;">
                    <span style="font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-0.02em;">AskBiz</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 36px 28px;">
              <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#1a1916;letter-spacing:-0.02em;">
                You have been invited
              </h1>
              <p style="margin:0 0 24px;font-size:15px;color:#6b6760;line-height:1.6;">
                <strong style="color:#1a1916;">${opts.inviterName}</strong> has invited you to their AskBiz workspace as a team member.
              </p>

              <!-- Role card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f3f1;border-radius:12px;margin-bottom:28px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <div style="font-size:11px;font-weight:700;color:#a39e97;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px;">Your role</div>
                    <div style="font-size:15px;font-weight:600;color:#6366F1;">${roleLabel}</div>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 24px;font-size:14px;color:#6b6760;line-height:1.6;">
                AskBiz is an AI-powered business intelligence tool. As ${opts.role === 'accountant' ? 'an accountant' : 'a'} <strong>${opts.role}</strong>, you will have access to the data and reports relevant to your role.
              </p>

              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="background:#6366F1;border-radius:9999px;padding:14px 28px;">
                    <a href="${opts.acceptUrl}" style="color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;display:block;">
                      Accept invitation &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0;font-size:12px;color:#a39e97;line-height:1.6;">
                This invitation expires in 7 days. If you did not expect this invitation, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 36px;border-top:1px solid #e8e6e1;text-align:center;">
              <p style="margin:0;font-size:12px;color:#a39e97;">
                AskBiz &middot; Business Intelligence for SME Founders &middot; <a href="https://askbiz.co" style="color:#6366F1;text-decoration:none;">askbiz.co</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
