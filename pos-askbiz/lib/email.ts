// ── Email sender via Resend API ───────────────────────────────────────────────
// No package needed — uses the Resend REST API directly

import { createHmac } from 'crypto'
import { t, tList } from '@/lib/i18n-catalog'
import { isRTL, type Lang } from '@/lib/i18n-locale'

const RESEND_API = 'https://api.resend.com/emails'
const FROM = 'AskBiz <noreply@askbiz.co>'

interface SendOptions {
  to: string
  subject: string
  html: string
  replyTo?: string
  /** Extra message headers, e.g. List-Unsubscribe for one-click opt-out */
  headers?: Record<string, string>
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
        ...(opts.headers ? { headers: opts.headers } : {}),
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

// ── POS OTP email ─────────────────────────────────────────────────────────────
export async function sendOTPEmail(email: string, code: string, name: string): Promise<boolean> {
  return sendEmail({
    to: email,
    subject: `${code} — your AskBiz POS login code`,
    html: `
    <div style="font-family:system-ui,sans-serif;max-width:400px;margin:0 auto;padding:32px 24px;background:#f9f8f6;">
      <div style="background:#fff;border-radius:16px;padding:32px;box-shadow:0 2px 12px rgba(0,0,0,.06);">
        <div style="font-size:12px;font-weight:700;color:#d08a59;letter-spacing:.06em;text-transform:uppercase;margin-bottom:20px;">AskBiz POS</div>
        <div style="font-size:18px;font-weight:700;color:#1a1916;margin-bottom:6px;">Hi ${name} 👋</div>
        <div style="font-size:14px;color:#6b6760;margin-bottom:24px;">Your login code for AskBiz POS:</div>
        <div style="font-size:44px;font-weight:800;letter-spacing:0.25em;color:#d08a59;font-family:monospace;margin-bottom:24px;text-align:center;">${code}</div>
        <div style="font-size:12px;color:#a39e97;text-align:center;">Valid for 10 minutes · Do not share this code</div>
      </div>
    </div>`,
  })
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

// ── POS Magic Link email ──────────────────────────────────────────────────────
export async function sendMagicLinkEmail(email: string, magicLinkUrl: string, name: string): Promise<boolean> {
  return sendEmail({
    to: email,
    subject: 'Your AskBiz POS login link',
    html: `
    <div style="font-family:system-ui,sans-serif;max-width:400px;margin:0 auto;padding:32px 24px;background:#f9f8f6;">
      <div style="background:#fff;border-radius:16px;padding:32px;box-shadow:0 2px 12px rgba(0,0,0,.06);">
        <div style="font-size:12px;font-weight:700;color:#d08a59;letter-spacing:.06em;text-transform:uppercase;margin-bottom:20px;">AskBiz POS</div>
        <div style="font-size:18px;font-weight:700;color:#1a1916;margin-bottom:6px;">Hi ${name} 👋</div>
        <div style="font-size:14px;color:#6b6760;margin-bottom:24px;">Click the button below to sign in to your AskBiz POS:</div>
        <table cellpadding="0" cellspacing="0" style="margin-bottom:24px;width:100%;">
          <tr>
            <td align="center">
              <a href="${magicLinkUrl}" style="display:inline-block;background:#d08a59;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;">Sign in to POS</a>
            </td>
          </tr>
        </table>
        <div style="font-size:12px;color:#a39e97;text-align:center;">
          Valid for 15 minutes · This link is only for your account
          <br style="margin-bottom:12px;" />
          <span style="color:#a39e97;">Or paste this link: <br/></span>
          <span style="color:#6b6760;word-break:break-all;font-size:11px;">${magicLinkUrl}</span>
        </div>
      </div>
    </div>`,
  })
}

// ── Lifecycle email helpers — shared by the lifecycle-emails cron and any
// webhook-triggered lifecycle email (e.g. plan-upgrade welcome) ──────────────
export function unsubscribeUrl(userId: string): string {
  const key = process.env.TOKEN_ENCRYPTION_KEY || process.env.CRON_SECRET || ''
  const token = createHmac('sha256', key).update(userId).digest('hex')
  return `https://askbiz.co/api/email/unsubscribe?uid=${userId}&t=${token}`
}

export function firstNameOf(fullName?: string | null): string {
  return (fullName || '').trim().split(/\s+/)[0] || ''
}

// ── Lifecycle emails: shared shell ───────────────────────────────────────────
// Same visual system as the alert email: #d08a59 header, white card, quiet footer.
// `dir` is set on html/body AND every nested table — table-based RTL email
// rendering isn't reliable enough in older Outlook/Windows Mail to trust
// inheritance alone.
function lifecycleShell(body: string, unsubscribeUrl: string, locale: Lang): string {
  const dir = isRTL(locale) ? 'rtl' : 'ltr'
  return `<!DOCTYPE html>
<html dir="${dir}" lang="${locale}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body dir="${dir}" style="margin:0;padding:0;background:#f4f3f1;font-family:system-ui,-apple-system,sans-serif;">
  <table dir="${dir}" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f3f1;padding:40px 20px;">
    <tr><td align="center">
      <table dir="${dir}" width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:#d08a59;padding:24px 36px;text-align:center;">
            <span style="font-family:Georgia,serif;font-size:20px;font-weight:700;color:#ffffff;letter-spacing:-.02em;">AskBiz</span>
          </td>
        </tr>
        <tr><td style="padding:32px 36px 28px;">${body}</td></tr>
        <tr>
          <td style="padding:16px 36px;border-top:1px solid #e8e6e1;text-align:center;">
            <p style="margin:0 0 4px;font-size:11px;color:#a39e97;">AskBiz &middot; <a href="https://askbiz.co" style="color:#d08a59;text-decoration:none;">askbiz.co</a></p>
            <p style="margin:0;font-size:11px;color:#a39e97;">
              ${t(locale, 'lifecycle_emails.shell.unsubscribe_prompt')} <a href="${unsubscribeUrl}" style="color:#a39e97;text-decoration:underline;">${t(locale, 'lifecycle_emails.shell.unsubscribe_link')}</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

// Recipient's first name, or a locale-appropriate generic greeting word when
// none is on file (matches the old `opts.firstName || 'there'` behavior, made
// locale-aware since "there" doesn't translate as a literal word).
function nameOr(locale: Lang, firstName: string): string {
  return firstName || t(locale, 'lifecycle_emails.fallback_name')
}

// ── Plan upgrade welcome — sent once per plan tier reached ───────────────────
// Plan name/features are resolved from the i18n catalog by planId+locale, not
// passed in by the caller — keeps callers simple (they already have planId)
// and keeps every language, including English, reading the same single source
// of copy instead of English alone reading live from the `plans` table.
export function planUpgradeEmail(opts: { firstName: string; planId: string; unsubscribeUrl: string; locale: Lang }): { subject: string; html: string } {
  const { locale, planId } = opts
  const name = nameOr(locale, opts.firstName)
  const planName = t(locale, `lifecycle_emails.plan_names.${planId}`)
  const features = tList(locale, `lifecycle_emails.plan_features.${planId}`)
  const k = (key: string) => t(locale, `lifecycle_emails.plan_upgrade.${key}`, { firstName: name, planName })
  const featureRows = features.map(f =>
    `<p style="margin:0 0 8px;font-size:14px;color:#1a1916;line-height:1.6;">✓&nbsp; ${f}</p>`
  ).join('')
  return {
    subject: k('subject'),
    html: lifecycleShell(`
      <h1 style="margin:0 0 10px;font-size:22px;font-weight:700;color:#1a1916;letter-spacing:-.02em;">${k('heading')}</h1>
      <p style="margin:0 0 16px;font-size:15px;color:#6b6760;line-height:1.65;">
        ${k('body')}
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
        <tr><td style="padding:14px 18px;background:#f4f3f1;border-radius:12px;">
          ${featureRows}
        </td></tr>
      </table>
      <table cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
        <tr><td style="background:#d08a59;border-radius:9999px;padding:14px 28px;">
          <a href="https://askbiz.co/dashboard" style="color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;display:block;">${k('cta')}</a>
        </td></tr>
      </table>
      <p style="margin:0 0 20px;font-size:14px;color:#1a1916;line-height:1.6;">
        ${k('closing')}
      </p>
      <p style="margin:0;font-size:14px;color:#1a1916;line-height:1.6;">
        ${k('signoff')}
      </p>
    `, opts.unsubscribeUrl, locale),
  }
}

// ── POS seats welcome — sent once, the first time pos_enabled flips on ──────
export function posSeatsWelcomeEmail(opts: { firstName: string; unsubscribeUrl: string; locale: Lang }): { subject: string; html: string } {
  const { locale } = opts
  const name = nameOr(locale, opts.firstName)
  const k = (key: string) => t(locale, `lifecycle_emails.pos_welcome.${key}`, { firstName: name })
  return {
    subject: k('subject'),
    html: lifecycleShell(`
      <h1 style="margin:0 0 10px;font-size:22px;font-weight:700;color:#1a1916;letter-spacing:-.02em;">${k('heading')}</h1>
      <p style="margin:0 0 16px;font-size:15px;color:#6b6760;line-height:1.65;">
        ${k('body1')}
      </p>
      <p style="margin:0 0 24px;font-size:15px;color:#1a1916;line-height:1.7;">
        ${k('body2')}
      </p>
      <table cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
        <tr><td style="background:#d08a59;border-radius:9999px;padding:14px 28px;">
          <a href="https://pos.askbiz.co" style="color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;display:block;">${k('cta')}</a>
        </td></tr>
      </table>
      <p style="margin:0 0 20px;font-size:14px;color:#1a1916;line-height:1.6;">
        ${k('closing')}
      </p>
      <p style="margin:0;font-size:14px;color:#1a1916;line-height:1.6;">
        ${k('signoff')}
      </p>
    `, opts.unsubscribeUrl, locale),
  }
}

// ── Alert fired email ─────────────────────────────────────────────────────────
export function alertEmail(opts: {
  alertName: string
  message: string
  severity: 'critical' | 'warning' | 'info'
  businessName?: string
}): string {
  const colors = {
    critical: { bg: '#FEF2F2', border: '#FCA5A5', badge: '#DC2626', label: 'CRITICAL' },
    warning:  { bg: '#FFFBEB', border: '#FCD34D', badge: '#D97706', label: 'WARNING' },
    info:     { bg: '#EFF6FF', border: '#93C5FD', badge: '#2563EB', label: 'INFO' },
  }
  const c = colors[opts.severity]

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f3f1;font-family:system-ui,-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f3f1;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:#d08a59;padding:24px 36px;text-align:center;">
            <span style="font-family:Georgia,serif;font-size:20px;font-weight:700;color:#ffffff;letter-spacing:-.02em;">AskBiz</span>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 36px 24px;">
            <table cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
              <tr>
                <td style="background:${c.badge};border-radius:9999px;padding:4px 12px;">
                  <span style="font-size:10px;font-weight:700;color:#fff;letter-spacing:.08em;">${c.label}</span>
                </td>
              </tr>
            </table>
            <h1 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#1a1916;">${opts.alertName}</h1>
            ${opts.businessName ? `<p style="margin:0 0 20px;font-size:13px;color:#a39e97;">${opts.businessName}</p>` : ''}
            <div style="background:${c.bg};border:1px solid ${c.border};border-radius:12px;padding:16px 20px;margin-bottom:24px;">
              <p style="margin:0;font-size:14px;color:#1a1916;line-height:1.6;">${opts.message}</p>
            </div>
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#d08a59;border-radius:9999px;padding:12px 24px;">
                  <a href="https://askbiz.co/alerts" style="color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;">View in AskBiz &rarr;</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 36px;border-top:1px solid #e8e6e1;text-align:center;">
            <p style="margin:0;font-size:11px;color:#a39e97;">AskBiz &middot; <a href="https://askbiz.co/alerts" style="color:#d08a59;text-decoration:none;">Manage alerts</a></p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}
