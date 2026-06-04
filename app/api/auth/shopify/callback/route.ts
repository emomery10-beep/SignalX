// Shopify OAuth — Step 2: Exchange code for access token
import { NextRequest, NextResponse } from 'next/server'
import { runSync } from '@/lib/sync/engine'
import { encryptCredentials } from '@/lib/crypto'
import crypto from 'crypto'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://askbiz.co'

function verifyCallbackHmac(params: URLSearchParams): boolean {
  const hmac = params.get('hmac')
  const secret = process.env.SHOPIFY_CLIENT_SECRET
  if (!hmac || !secret) return false

  const entries = Array.from(params.entries())
    .filter(([key]) => key !== 'hmac')
    .sort(([a], [b]) => a.localeCompare(b))
  const message = entries.map(([k, v]) => `${k}=${v}`).join('&')
  const hash = crypto.createHmac('sha256', secret).update(message).digest('hex')
  try {
    // Use hex Buffers so lengths always match (both 32 bytes); avoids timingSafeEqual throw
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(hmac, 'hex'))
  } catch {
    return false
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl

  if (!verifyCallbackHmac(searchParams)) {
    return NextResponse.redirect(`${APP_URL}/?ref=shopify&error=invalid_signature`)
  }

  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const shop = searchParams.get('shop')

  if (!code || !state || !shop) {
    return NextResponse.redirect(`${APP_URL}/?ref=shopify&error=shopify_cancelled`)
  }

  let userId: string | undefined
  let shopFromState: string | undefined
  try {
    const decoded = JSON.parse(Buffer.from(state, 'base64url').toString())
    userId = decoded.userId
    shopFromState = decoded.shop
  } catch {
    return NextResponse.redirect(`${APP_URL}/?ref=shopify&error=invalid_state`)
  }

  // Validate that the shop in state matches the shop in the callback params
  // (prevents state substitution attacks; HMAC already covers parameter tampering)
  if (shopFromState && shopFromState !== shop) {
    return NextResponse.redirect(`${APP_URL}/?ref=shopify&error=shop_mismatch`)
  }

  // Exchange code for a permanent offline access token
  const tokenRes = await fetch(`https://${shop}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.SHOPIFY_CLIENT_ID,
      client_secret: process.env.SHOPIFY_CLIENT_SECRET,
      code,
    }),
  })

  if (!tokenRes.ok) {
    return NextResponse.redirect(`${APP_URL}/?ref=shopify&error=shopify_token_failed`)
  }

  const { access_token } = await tokenRes.json()

  if (!access_token) {
    return NextResponse.redirect(`${APP_URL}/?ref=shopify&error=no_access_token`)
  }

  // ── Shopify Billing API — create free $0 subscription ────────
  // Required by Shopify App Store policy 1.2.1 even for free apps.
  // A $0 recurring plan satisfies the requirement with no merchant charge.
  const GQL_VERSION = '2025-01'
  const FREE_PLAN_MUTATION = `
    mutation appSubscriptionCreate($returnUrl: URL!) {
      appSubscriptionCreate(
        name: "AskBiz Free"
        returnUrl: $returnUrl
        test: false
        lineItems: [{
          plan: {
            appRecurringPricingDetails: {
              price: { amount: 0, currencyCode: USD }
              interval: EVERY_30_DAYS
            }
          }
        }]
      ) {
        userErrors { field message }
        confirmationUrl
        appSubscription { id status }
      }
    }
  `
  try {
    const billingRes = await fetch(
      `https://${shop}/admin/api/${GQL_VERSION}/graphql.json`,
      {
        method: 'POST',
        headers: {
          'X-Shopify-Access-Token': access_token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: FREE_PLAN_MUTATION,
          variables: {
            returnUrl: `${APP_URL}/sources?connected=shopify&syncing=true`,
          },
        }),
      }
    )
    if (billingRes.ok) {
      const billingData = await billingRes.json()
      const sub = billingData?.data?.appSubscriptionCreate
      // If Shopify returns a confirmationUrl (non-zero plans), redirect merchant to approve.
      // For $0 plans Shopify auto-activates — confirmationUrl will be null or unused.
      if (sub?.confirmationUrl && sub.appSubscription?.status !== 'ACTIVE') {
        return NextResponse.redirect(sub.confirmationUrl)
      }
    }
  } catch (e) {
    // Billing creation failure should not block the connection — log and continue
    console.error('Shopify free subscription creation failed:', e)
  }

  // Get shop info for display name
  const shopRes = await fetch(`https://${shop}/admin/api/2025-01/shop.json`, {
    headers: { 'X-Shopify-Access-Token': access_token },
  })
  const shopData = shopRes.ok ? await shopRes.json() : {}
  const shopName = shopData.shop?.name || shop

  // Use service client to bypass RLS
  const { createServiceClient } = await import('@/lib/supabase/server')
  const supabase = createServiceClient()

  // If no userId (App Store install flow), try to find user by checking current session
  if (!userId) {
    const { createClient } = await import('@/lib/supabase/server')
    const sessionClient = createClient()
    const { data: { user } } = await sessionClient.auth.getUser()
    userId = user?.id
  }

  if (!userId) {
    // App Store install flow — no logged-in AskBiz user.
    // Store the token as a pending connection keyed by shop domain
    // so we can link it when the merchant signs into AskBiz later.
    await supabase
      .from('pending_shopify_installs')
      .upsert({
        shop_domain: shop,
        access_token: encryptCredentials({ access_token }),
        shop_name: shopName,
        installed_at: new Date().toISOString(),
      }, { onConflict: 'shop_domain' })
      .then(() => {})
      .catch((err: unknown) => console.error('Failed to store pending install:', err))

    return NextResponse.redirect(`${APP_URL}/signin?ref=shopify&shop=${shop}`)
  }

  // Remove any existing Shopify connection for this user, then insert fresh
  await supabase
    .from('connected_sources')
    .delete()
    .eq('user_id', userId)
    .eq('source_type', 'shopify')

  const { data: source, error: insertError } = await supabase
    .from('connected_sources')
    .insert({
      user_id: userId,
      source_type: 'shopify',
      name: shopName,
      status: 'active',
      credentials: encryptCredentials({ access_token }),
      config: { shop_domain: shop },
      sync_interval_minutes: 60,
    })
    .select()
    .single()

  if (insertError) {
    console.error('Shopify insert failed:', insertError)
    return NextResponse.redirect(`${APP_URL}/sources?error=shopify_save_failed`)
  }

  if (source) {
    try { await runSync(userId) } catch (_) {}
  }

  return NextResponse.redirect(`${APP_URL}/sources?connected=shopify&syncing=true`)
}
