import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Collect all user data across all tables
    const [
      { data: profile },
      { data: conversations },
      { data: messages },
      { data: uploads },
      { data: shipments },
      { data: alerts },
      { data: freight_quotes },
      { data: health_scores },
      { data: anomalies },
      { data: consent },
    ] = await Promise.all([
      supabase.from('profiles').select('full_name, business_type, currency, region, plan, created_at').eq('id', user.id).single(),
      supabase.from('conversations').select('id, title, created_at, updated_at').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('messages').select('conversation_id, role, content, created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1000),
      supabase.from('uploads').select('filename, row_count, created_at').eq('user_id', user.id),
      supabase.from('shipments').select('tracking_number, supplier_name, sku, track_status, created_at').eq('user_id', user.id),
      supabase.from('shipment_alerts').select('alert_type, message, created_at').eq('user_id', user.id),
      supabase.from('freight_quotes').select('origin_port, destination_port, shipment_mode, cheapest_rate, quoted_at').eq('user_id', user.id),
      supabase.from('health_scores').select('score, label, created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(90),
      supabase.from('anomalies').select('type, product, severity, created_at').eq('user_id', user.id).limit(100),
      supabase.from('profiles').select('data_consent, training_consent, data_consent_at, training_consent_at').eq('id', user.id).single(),
    ])

    const exportData = {
      export_info: {
        generated_at: new Date().toISOString(),
        user_email: user.email,
        gdpr_note: 'This export contains all personal data held by AskBiz in accordance with GDPR Article 20 (Right to Data Portability). To request deletion, use the Delete Account option in Settings.',
      },
      profile: profile || {},
      consent: consent || {},
      conversations: conversations || [],
      messages: messages || [],
      uploads: uploads || [],
      shipments: shipments || [],
      shipment_alerts: alerts || [],
      freight_quotes: freight_quotes || [],
      health_scores: health_scores || [],
      anomalies: anomalies || [],
    }

    const json = JSON.stringify(exportData, null, 2)
    
    return new NextResponse(json, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="askbiz-data-export-${new Date().toISOString().slice(0,10)}.json"`,
      },
    })
  } catch (err: unknown) {
    console.error('[export]', err)
    return NextResponse.json({ error: 'Export failed. Please try again.' }, { status: 500 })
  }
}
