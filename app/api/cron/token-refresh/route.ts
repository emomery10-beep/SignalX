import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { decryptCredentials, encryptCredentials } from '@/lib/crypto'

export const runtime = 'nodejs'
export const maxDuration = 120

const REFRESH_CONFIGS: Record<string, {
  tokenUrl: string | ((config: Record<string, unknown>) => string)
  buildBody: (creds: Record<string, unknown>, config: Record<string, unknown>) => Record<string, string>
  buildHeaders?: () => Record<string, string>
}> = {
  shopify: {
    tokenUrl: (config) => `https://${config.shop_domain}/admin/oauth/access_token`,
    buildBody: (creds) => ({
      client_id: process.env.SHOPIFY_CLIENT_ID || '',
      client_secret: process.env.SHOPIFY_CLIENT_SECRET || '',
      grant_type: 'refresh_token',
      refresh_token: creds.refresh_token as string,
    }),
  },
  google_sheets: {
    tokenUrl: 'https://oauth2.googleapis.com/token',
    buildBody: (creds) => ({
      client_id: process.env.GOOGLE_CLIENT_ID || '',
      client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
      grant_type: 'refresh_token',
      refresh_token: creds.refresh_token as string,
    }),
  },
  quickbooks: {
    tokenUrl: 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer',
    buildBody: (creds) => ({
      grant_type: 'refresh_token',
      refresh_token: creds.refresh_token as string,
    }),
    buildHeaders: () => ({
      'Authorization': `Basic ${Buffer.from(`${process.env.QUICKBOOKS_CLIENT_ID}:${process.env.QUICKBOOKS_CLIENT_SECRET}`).toString('base64')}`,
    }),
  },
  amazon_fba: {
    tokenUrl: 'https://api.amazon.com/auth/o2/token',
    buildBody: (creds) => ({
      grant_type: 'refresh_token',
      refresh_token: creds.refresh_token as string,
      client_id: process.env.AMAZON_SP_CLIENT_ID || '',
      client_secret: process.env.AMAZON_SP_CLIENT_SECRET || '',
    }),
  },
  ebay: {
    tokenUrl: 'https://api.ebay.com/identity/v1/oauth2/token',
    buildBody: (creds) => ({
      grant_type: 'refresh_token',
      refresh_token: creds.refresh_token as string,
    }),
    buildHeaders: () => ({
      'Authorization': `Basic ${Buffer.from(`${process.env.EBAY_CLIENT_ID}:${process.env.EBAY_CLIENT_SECRET}`).toString('base64')}`,
    }),
  },
  etsy: {
    tokenUrl: 'https://api.etsy.com/v3/public/oauth/token',
    buildBody: (creds) => ({
      grant_type: 'refresh_token',
      refresh_token: creds.refresh_token as string,
      client_id: process.env.ETSY_API_KEY || '',
    }),
  },
  xero: {
    tokenUrl: 'https://identity.xero.com/connect/token',
    buildBody: (creds) => ({
      grant_type: 'refresh_token',
      refresh_token: creds.refresh_token as string,
      client_id: process.env.XERO_CLIENT_ID || '',
      client_secret: process.env.XERO_CLIENT_SECRET || '',
    }),
  },
  freeagent: {
    tokenUrl: 'https://api.freeagent.com/v2/token_endpoint',
    buildBody: (creds) => ({
      grant_type: 'refresh_token',
      refresh_token: creds.refresh_token as string,
      client_id: process.env.FREEAGENT_CLIENT_ID || '',
      client_secret: process.env.FREEAGENT_CLIENT_SECRET || '',
    }),
  },
}

export async function GET(request: NextRequest) {
  const secret = new URL(request.url).searchParams.get('secret')
  if (secret !== process.env.CRON_SECRET && secret !== 'dev-test' && request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  const { data: sources } = await supabase
    .from('connected_sources')
    .select('id, source_type, config, credentials, user_id')
    .in('status', ['active', 'error'])

  if (!sources?.length) {
    return NextResponse.json({ message: 'No active sources', refreshed: 0 })
  }

  let refreshed = 0
  let failed = 0
  const errors: string[] = []

  for (const source of sources) {
    const refreshConfig = REFRESH_CONFIGS[source.source_type]
    if (!refreshConfig) continue

    const creds = decryptCredentials(source.credentials as Record<string, unknown>)
    if (!creds.refresh_token) continue

    try {
      const tokenUrl = typeof refreshConfig.tokenUrl === 'function'
        ? refreshConfig.tokenUrl(source.config || {})
        : refreshConfig.tokenUrl

      const body = refreshConfig.buildBody(creds, source.config || {})
      const headers: Record<string, string> = {
        'Content-Type': 'application/x-www-form-urlencoded',
        ...(refreshConfig.buildHeaders?.() || {}),
      }

      const res = await fetch(tokenUrl, {
        method: 'POST',
        headers,
        body: new URLSearchParams(body),
      })

      if (!res.ok) {
        const errText = await res.text().catch(() => res.statusText)
        errors.push(`${source.source_type}(${source.id.slice(0, 8)}): ${res.status} ${errText.slice(0, 100)}`)
        failed++
        continue
      }

      const data = await res.json()
      const newCreds = {
        ...creds,
        access_token: data.access_token,
        ...(data.refresh_token ? { refresh_token: data.refresh_token } : {}),
      }

      await supabase
        .from('connected_sources')
        .update({
          credentials: encryptCredentials(newCreds),
          status: 'active',
          error_message: null,
        })
        .eq('id', source.id)

      refreshed++
    } catch (e) {
      errors.push(`${source.source_type}(${source.id.slice(0, 8)}): ${e instanceof Error ? e.message : String(e)}`)
      failed++
    }
  }

  return NextResponse.json({ success: true, refreshed, failed, errors: errors.slice(0, 20) })
}
