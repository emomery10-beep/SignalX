import { NextRequest, NextResponse } from 'next/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { getTransactionStatus, isPaymentComplete } from '@/lib/pesapal'
import { provisionStaffDrafts } from '@/lib/pos-staff-provision'

const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

// PesaPal sends IPN as GET with ?OrderTrackingId=xxx&OrderMerchantReference=xxx&OrderNotificationType=xxx
export async function GET(request: NextRequest) {
  const orderTrackingId = request.nextUrl.searchParams.get('OrderTrackingId')
  const merchantReference = request.nextUrl.searchParams.get('OrderMerchantReference')

  if (!orderTrackingId) {
    return NextResponse.json({ error: 'Missing OrderTrackingId' }, { status: 400 })
  }

  try {
    const status = await getTransactionStatus(orderTrackingId)

    const { data: payment } = await supabaseAdmin
      .from('pesapal_payments')
      .select('*')
      .eq('order_tracking_id', orderTrackingId)
      .single()

    if (!payment) {
      console.error('[pesapal-callback] No payment found for', orderTrackingId)
      return NextResponse.json({ status: 'not_found' })
    }

    if (isPaymentComplete(status)) {
      await supabaseAdmin
        .from('pesapal_payments')
        .update({
          status: 'completed',
          payment_method: status.payment_method,
          confirmation_code: status.confirmation_code,
          completed_at: new Date().toISOString(),
        })
        .eq('order_tracking_id', orderTrackingId)

      const plan = payment.plan as string
      const userId = payment.user_id as string

      if (plan.startsWith('pos_seats_')) {
        const seats = parseInt(plan.replace('pos_seats_', ''), 10)
        await supabaseAdmin
          .from('profiles')
          .update({ pos_enabled: true, pos_seat_count: seats })
          .eq('id', userId)
        // Mark PoS trial as converted
        await supabaseAdmin.from('trials').update({ converted: true }).eq('user_id', userId).eq('trial_type', 'pos')
        // Reliable server-side provisioning of any staff drafts
        await provisionStaffDrafts(userId).catch(() => {})
      } else {
        await supabaseAdmin
          .from('subscriptions')
          .upsert({
            user_id: userId,
            plan_id: plan,
            status: 'active',
            payment_provider: 'pesapal',
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          }, { onConflict: 'user_id' })
        // Mark Growth trial as converted if applicable
        if (plan === 'growth' || plan === 'business') {
          await supabaseAdmin.from('trials').update({ converted: true }).eq('user_id', userId).eq('trial_type', 'growth')
        }
      }

      console.log(`[pesapal-callback] Payment completed: ${orderTrackingId} → ${plan} for ${userId}`)
    } else {
      const newStatus = status.status_code === 2 ? 'failed' : status.status_code === 3 ? 'reversed' : 'pending'
      await supabaseAdmin
        .from('pesapal_payments')
        .update({ status: newStatus })
        .eq('order_tracking_id', orderTrackingId)
    }

    return NextResponse.json({ orderTrackingId, status: status.status_code })
  } catch (err) {
    console.error('[pesapal-callback] error:', err)
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
  }
}
