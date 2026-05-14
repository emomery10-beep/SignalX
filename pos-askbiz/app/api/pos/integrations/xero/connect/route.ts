import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosOwner } from '@/lib/pos-auth'

/**
 * POST /api/pos/integrations/xero/connect
 *
 * Handles Xero OAuth callback after user authorizes
 * Stores access token and tenant ID
 *
 * Body:
 *   authorization_code: string (from Xero OAuth flow)
 */
export async function POST(req: NextRequest) {
  const ownerId = await resolvePosOwner(req)
  if (!ownerId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const body = await req.json()
  const { authorization_code, tenant_id } = body

  if (!authorization_code) {
    return NextResponse.json({ error: 'authorization_code required' }, { status: 400 })
  }

  try {
    // Exchange auth code for access token
    const tokenResponse = await fetch('https://identity.xero.com/connect/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: authorization_code,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/settings/integrations/xero/callback`,
        client_id: process.env.XERO_CLIENT_ID || '',
        client_secret: process.env.XERO_CLIENT_SECRET || '',
      }).toString(),
    })

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange auth code for token')
    }

    const tokenData = await tokenResponse.json()
    const { access_token, refresh_token, expires_in } = tokenData

    // Get tenant ID if not provided
    let finalTenantId = tenant_id

    if (!finalTenantId) {
      const tenantsResponse = await fetch('https://api.xero.com/connections', {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })

      if (tenantsResponse.ok) {
        const tenants = await tenantsResponse.json()
        finalTenantId = tenants?.[0]?.tenantId
      }
    }

    // Store credentials in integrations table
    const credentials = {
      access_token,
      refresh_token,
      tenant_id: finalTenantId,
      expires_at: new Date(Date.now() + expires_in * 1000).toISOString(),
    }

    // Check if integration already exists
    const { data: existing } = await service
      .from('pos_integrations')
      .select('id')
      .eq('owner_id', ownerId)
      .eq('provider', 'xero')
      .maybeSingle()

    if (existing) {
      // Update existing
      await service
        .from('pos_integrations')
        .update({
          credentials_json: JSON.stringify(credentials),
          connected_at: new Date().toISOString(),
          is_active: true,
        })
        .eq('id', existing.id)
    } else {
      // Create new
      await service.from('pos_integrations').insert({
        owner_id: ownerId,
        provider: 'xero',
        credentials_json: JSON.stringify(credentials),
        is_active: true,
        connected_at: new Date().toISOString(),
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Xero connected successfully',
      provider: 'xero',
      connected_at: new Date().toISOString(),
      sync_enabled: true,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

/**
 * GET /api/pos/integrations/xero/connect
 *
 * Returns Xero OAuth authorization URL for user to click
 */
export async function GET(req: NextRequest) {
  const clientId = process.env.XERO_CLIENT_ID || ''
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/settings/integrations/xero/callback`
  const scope = 'offline_access openid profile email accounting.transactions'

  const authUrl = `https://login.xero.com/identity/connect/authorize?
    response_type=code
    &client_id=${clientId}
    &redirect_uri=${encodeURIComponent(redirectUri)}
    &scope=${encodeURIComponent(scope)}
    &state=${generateState()}`

  return NextResponse.json({
    authorize_url: authUrl.replace(/\n\s+/g, ''),
  })
}

function generateState(): string {
  return Math.random().toString(36).substring(7)
}
