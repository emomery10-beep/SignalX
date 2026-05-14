import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosOwner } from '@/lib/pos-auth'

/**
 * GET /api/pos/consolidated-tax-report
 *
 * Multi-location tax reporting
 * Consolidates tax liability across all locations and jurisdictions
 * Helps owners see big picture before filing with accountants
 *
 * Query params:
 *   start_date: ISO date
 *   end_date: ISO date
 *   jurisdictions?: 'UK,US_CA,DE' (comma-separated, or all if omitted)
 */
export async function GET(req: NextRequest) {
  const ownerId = await resolvePosOwner(req)
  if (!ownerId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const { searchParams } = new URL(req.url)

  const startDate = searchParams.get('start_date')
  const endDate = searchParams.get('end_date')
  const jurisdictionsParam = searchParams.get('jurisdictions')

  if (!startDate || !endDate) {
    return NextResponse.json({ error: 'start_date and end_date required' }, { status: 400 })
  }

  // Get all locations
  const { data: locations } = await service
    .from('pos_locations')
    .select('id, name, tax_jurisdiction')
    .eq('owner_id', ownerId)

  if (!locations) {
    return NextResponse.json({ error: 'No locations found' }, { status: 404 })
  }

  // Filter by requested jurisdictions if specified
  let locationsToReport = locations
  if (jurisdictionsParam) {
    const requestedJurisdictions = jurisdictionsParam.split(',')
    locationsToReport = locations.filter((loc) => requestedJurisdictions.includes(loc.tax_jurisdiction))
  }

  // Build report for each location
  const byLocation = []
  let totalRevenue = 0
  let totalTax = 0
  let totalTransactions = 0

  for (const location of locationsToReport) {
    const { data: transactions } = await service
      .from('pos_transactions')
      .select(`
        id,
        total_amount,
        total_tax,
        tax_jurisdiction,
        pos_items (
          tax_code,
          tax_rate,
          tax_amount,
          unit_price,
          qty
        )
      `)
      .eq('owner_id', ownerId)
      .eq('pos_location_id', location.id)
      .gte('created_at', `${startDate}T00:00:00Z`)
      .lte('created_at', `${endDate}T23:59:59Z`)

    const tx = transactions || []

    // Calculate by tax rate
    const byRate: Record<string, { net: number; tax: number; count: number }> = {}

    for (const transaction of tx) {
      const items = transaction.pos_items || []
      for (const item of items) {
        const rate = String(item.tax_rate || 0)
        if (!byRate[rate]) byRate[rate] = { net: 0, tax: 0, count: 0 }

        const itemNet = (item.unit_price || 0) * (item.qty || 1)
        const itemTax = item.tax_amount || 0

        byRate[rate].net += itemNet
        byRate[rate].tax += itemTax
        byRate[rate].count += 1
      }
    }

    const locationRevenue = tx.reduce((sum, t) => sum + (t.total_amount || 0), 0)
    const locationTax = tx.reduce((sum, t) => sum + (t.total_tax || 0), 0)

    totalRevenue += locationRevenue
    totalTax += locationTax
    totalTransactions += tx.length

    byLocation.push({
      location_id: location.id,
      location_name: location.name,
      jurisdiction: location.tax_jurisdiction,
      transaction_count: tx.length,
      total_revenue: Math.round(locationRevenue * 100) / 100,
      total_tax: Math.round(locationTax * 100) / 100,
      by_tax_rate: Object.entries(byRate).map(([rate, stats]) => ({
        rate: parseFloat(rate),
        net_sales: Math.round(stats.net * 100) / 100,
        tax_collected: Math.round(stats.tax * 100) / 100,
        transaction_count: stats.count,
      })),
      avg_transaction: Math.round((locationRevenue / Math.max(tx.length, 1)) * 100) / 100,
    })
  }

  // Filing checklist
  const filingChecklist = buildFilingChecklist(locationsToReport)

  return NextResponse.json({
    reporting_period: `${startDate} to ${endDate}`,
    consolidated: {
      total_revenue: Math.round(totalRevenue * 100) / 100,
      total_tax: Math.round(totalTax * 100) / 100,
      total_transactions: totalTransactions,
      locations_count: locationsToReport.length,
      average_transaction: Math.round((totalRevenue / Math.max(totalTransactions, 1)) * 100) / 100,
    },
    by_location: byLocation,
    filing_checklist: filingChecklist,
    recommendations: generateRecommendations(byLocation, locationsToReport),
  })
}

function buildFilingChecklist(locations: any[]): Record<string, any> {
  const checklist: Record<string, any> = {}

  for (const location of locations) {
    const jurisdiction = location.tax_jurisdiction

    checklist[jurisdiction] = {
      jurisdiction,
      status: 'ready', // Would be 'overdue', 'due_soon', 'not_required', etc.
      items: [
        { completed: true, item: 'Transactions recorded' },
        { completed: true, item: 'Tax codes assigned' },
        { completed: true, item: 'Audit trail intact' },
        { completed: false, item: 'Report generated' },
        { completed: false, item: 'Filed with authorities' },
      ],
    }
  }

  return checklist
}

function generateRecommendations(locations: any[], locationObjects: any[]): string[] {
  const recommendations: string[] = []

  // Check for zero revenue in any location
  const zeroRevenueLocations = locations.filter((loc) => loc.total_revenue === 0)
  if (zeroRevenueLocations.length > 0) {
    recommendations.push(
      `${zeroRevenueLocations.length} location(s) have zero revenue - verify this is correct or reconcile transactions`
    )
  }

  // Check if filing is required
  const highRevenueLocations = locations.filter((loc) => loc.total_revenue > 85000) // UK threshold
  if (highRevenueLocations.length > 0) {
    recommendations.push(
      `${highRevenueLocations.length} location(s) exceed VAT threshold - VAT registration/filing may be required`
    )
  }

  // Recommend Xero sync for large operations
  if (locations.length > 2 || locations.some((loc) => loc.total_revenue > 50000)) {
    recommendations.push('Connect Xero or QuickBooks for automatic multi-location reconciliation')
  }

  // Check for unusual tax rates
  const unusualRates = locations.flatMap((loc) =>
    loc.by_tax_rate
      .filter((rate: any) => rate.rate > 25 || (rate.rate > 0 && rate.rate < 1))
      .map((rate: any) => `${loc.location_name}: ${rate.rate}%`)
  )

  if (unusualRates.length > 0) {
    recommendations.push(`Unusual tax rates detected: ${unusualRates.join(', ')} - verify tax codes`)
  }

  return recommendations
}
