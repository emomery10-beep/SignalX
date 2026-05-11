// app/api/webhooks/17track/route.ts
// Receives real-time push updates from 17Track and processes intelligence
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// 17Track status → human label mapping
const STATUS_LABELS: Record<string, string> = {
  'NotFound': 'Not Found',
  'Pending': 'Pending',
  'Pickup': 'Picked Up',
  'InTransit': 'In Transit',
  'OutForDelivery': 'Out for Delivery',
  'Delivered': 'Delivered',
  'Undelivered': 'Undelivered',
  'Exception': 'Exception',
  'Expired': 'Expired',
}

// Sub-statuses that trigger alerts
const CRITICAL_SUB_STATUSES = [
  'CustomsHold', 'Clearance_Fail', 'Exception_Other',
  'Return_Logistics', 'Undelivered_Other', 'Damaged',
]

const WARNING_SUB_STATUSES = [
  'InCustoms', 'Delay', 'AddressIssue', 'PickupReminder',
]

function calculateFinancialImpact(shipment: any, delayDays: number) {
  const dailyCost = shipment.daily_financing_cost || 0
  const totalValue = shipment.total_value || 0
  const stockoutRevenueLoss = shipment.stockout_risk
    ? (shipment.daily_sales_velocity || 0) * (shipment.unit_price || 0) * delayDays
    : 0
  return parseFloat((dailyCost * delayDays + stockoutRevenueLoss).toFixed(2))
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // 17Track sends an array of tracking updates
    const updates = Array.isArray(body) ? body : [body]

    const supabase = createClient()

    for (const update of updates) {
      const trackingNumber = update.number || update.tracking_number
      if (!trackingNumber) continue

      const latestStatus = update.latest_status || update.track?.w1
      const subStatus = update.latest_sub_status || update.track?.ws
      const lastEvent = update.latest_event?.description || update.track?.z0
      const lastLocation = update.latest_event?.location || update.track?.c

      // Find matching shipments in our DB
      const { data: shipments } = await supabase
        .from('shipments')
        .select('*')
        .eq('tracking_number', trackingNumber)

      if (!shipments?.length) continue

      for (const shipment of shipments) {
        // Determine alert level
        const isCritical = CRITICAL_SUB_STATUSES.some(s =>
          subStatus?.includes(s) || latestStatus?.includes(s)
        )
        const isWarning = WARNING_SUB_STATUSES.some(s =>
          subStatus?.includes(s) || latestStatus?.includes(s)
        )
        const isCustomsHold = subStatus?.includes('Customs') || subStatus?.includes('Clearance')
        const isDelivered = latestStatus === 'Delivered'

        // Calculate delay days
        let delayDays = 0
        if (shipment.expected_arrival && !isDelivered) {
          const expected = new Date(shipment.expected_arrival)
          const today = new Date()
          delayDays = Math.max(0, Math.floor((today.getTime() - expected.getTime()) / 86400000))
        }

        // Calculate working capital days
        const workingCapitalDays = shipment.order_date
          ? Math.floor((Date.now() - new Date(shipment.order_date).getTime()) / 86400000)
          : 0

        const financialImpact = calculateFinancialImpact(shipment, delayDays)

        // Update shipment record
        await supabase.from('shipments').update({
          track_status: STATUS_LABELS[latestStatus] || latestStatus || shipment.track_status,
          track_sub_status: subStatus || null,
          last_event: lastEvent || null,
          last_location: lastLocation || null,
          customs_hold: isCustomsHold,
          is_at_risk: isCritical || isWarning || delayDays > 3,
          delay_days: delayDays,
          working_capital_days: workingCapitalDays,
          financial_impact: financialImpact,
          actual_arrival: isDelivered ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        }).eq('id', shipment.id)

        // Create alert for critical/warning events
        if (isCritical || isCustomsHold || delayDays > 5) {
          const alertType = isCritical ? 'critical'
            : isCustomsHold ? 'customs_hold'
            : 'delay'

          const alertMessage = isCustomsHold
            ? `Customs hold on ${trackingNumber}${shipment.sku ? ` (${shipment.sku})` : ''}. Daily demurrage cost building.`
            : isCritical
            ? `Exception on ${trackingNumber}: ${subStatus?.replace(/_/g, ' ')}. Immediate action may be needed.`
            : `Shipment ${trackingNumber} is ${delayDays} days delayed. Financial impact: £${financialImpact}.`

          // Check for duplicate alert in last 24h
          const { data: recentAlert } = await supabase
            .from('shipment_alerts')
            .select('id')
            .eq('shipment_id', shipment.id)
            .eq('alert_type', alertType)
            .gte('created_at', new Date(Date.now() - 86400000).toISOString())
            .single()

          if (!recentAlert) {
            await supabase.from('shipment_alerts').insert({
              user_id: shipment.user_id,
              shipment_id: shipment.id,
              tracking_number: trackingNumber,
              alert_type: alertType,
              alert_level: isCritical || isCustomsHold ? 'critical' : 'warning',
              message: alertMessage,
              financial_impact: financialImpact,
              delay_days: delayDays,
              is_read: false,
            })
          }
        }

        // If delivered, calculate actual transit time for carrier scoring
        if (isDelivered && shipment.order_date) {
          const transitDays = workingCapitalDays
          await supabase.from('carrier_performance').upsert({
            user_id: shipment.user_id,
            carrier_code: shipment.carrier_code,
            carrier_name: shipment.carrier_name,
            route_origin: shipment.origin_country,
            route_destination: shipment.destination_country,
            transit_days: transitDays,
            on_time: delayDays === 0,
            had_customs_hold: shipment.customs_hold,
            recorded_at: new Date().toISOString(),
          }, { onConflict: 'user_id,carrier_code,route_origin,route_destination' })
        }
      }
    }

    return NextResponse.json({ received: updates.length })
  } catch (err: any) {
    console.error('[17track webhook]', err)
    // Always return 200 to 17Track or it will retry
    return NextResponse.json({ received: 0 })
  }
}
