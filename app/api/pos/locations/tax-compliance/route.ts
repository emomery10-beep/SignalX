import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosOwner } from '@/lib/pos-auth'

/**
 * GET /api/pos/locations/tax-compliance
 *
 * Returns tax compliance status for each location
 * Helps multi-location businesses track filing deadlines and compliance across jurisdictions
 */
export async function GET(req: NextRequest) {
  const ownerId = await resolvePosOwner(req)
  if (!ownerId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()

  // Get all locations for this owner
  const { data: locations } = await service
    .from('pos_locations')
    .select(`
      id,
      name,
      tax_jurisdiction,
      tax_id,
      business_type,
      created_at
    `)
    .eq('owner_id', ownerId)

  if (!locations || locations.length === 0) {
    return NextResponse.json({ locations: [], summary: { total_locations: 0 } })
  }

  const locationComplianceStatus = []

  // Check compliance for each location
  for (const location of locations) {
    // Get latest tax filing for this location
    const { data: lastFiling } = await service
      .from('pos_tax_filings')
      .select('status, submitted_at, filing_period_end, total_tax_due')
      .eq('owner_id', ownerId)
      .eq('jurisdiction', location.tax_jurisdiction)
      .order('filing_period_end', { ascending: false })
      .limit(1)

    // Calculate current period's tax liability
    const { data: currentTransactions } = await service
      .from('pos_transactions')
      .select('total_tax')
      .eq('owner_id', ownerId)
      .eq('pos_location_id', location.id)
      .gte('created_at', getCurrentPeriodStart(location.tax_jurisdiction).toISOString())

    const totalTaxDue = (currentTransactions || []).reduce((sum: number, tx: any) => sum + (tx.total_tax || 0), 0)

    // Determine filing status and deadline
    const { status, deadline, daysUntil } = getFilingStatus(location.tax_jurisdiction, lastFiling)

    // Compliance score based on: filing timeliness, data completeness, audit trail
    const complianceScore = calculateComplianceScore({
      has_tax_id: !!location.tax_id,
      has_transactions: (currentTransactions || []).length > 0,
      filed_on_time: lastFiling?.status === 'submitted' || lastFiling?.status === 'accepted',
      data_complete: totalTaxDue > 0,
      audit_trail_intact: true, // Assumed true from Phase 2 immutable logs
    })

    locationComplianceStatus.push({
      location_id: location.id,
      location_name: location.name,
      jurisdiction: location.tax_jurisdiction,
      tax_id: location.tax_id || 'Not Set',
      business_type: location.business_type || 'Unknown',

      // Current tax liability
      current_period_tax_due: Math.round(totalTaxDue * 100) / 100,
      current_period_transactions: currentTransactions?.length || 0,

      // Filing status
      last_filing: {
        status: lastFiling?.status || 'never_filed',
        submitted_at: lastFiling?.submitted_at,
        period_end: lastFiling?.filing_period_end,
      },
      next_filing: {
        deadline: deadline,
        days_until: daysUntil,
        filing_frequency: getFilingFrequency(location.tax_jurisdiction),
      },

      // Compliance health
      compliance_score: complianceScore,
      issues: getComplianceIssues(location, lastFiling, complianceScore),
    })
  }

  // Aggregate compliance across all locations
  const aggregatedScore = Math.round(
    locationComplianceStatus.reduce((sum, loc) => sum + loc.compliance_score, 0) / locationComplianceStatus.length
  )

  const allCompliant = locationComplianceStatus.every((loc) => loc.issues.length === 0)

  return NextResponse.json({
    locations: locationComplianceStatus,
    summary: {
      total_locations: locations.length,
      overall_compliance_score: aggregatedScore,
      all_compliant: allCompliant,
      total_tax_due_all_locations: Math.round(
        locationComplianceStatus.reduce((sum, loc) => sum + loc.current_period_tax_due, 0) * 100
      ) / 100,
      filing_deadlines_upcoming: locationComplianceStatus
        .filter((loc) => loc.next_filing.days_until <= 30 && loc.next_filing.days_until > 0)
        .map((loc) => ({ location: loc.location_name, days: loc.next_filing.days_until })),
    },
  })
}

function getCurrentPeriodStart(jurisdiction: string): Date {
  const now = new Date()

  // Determine period based on jurisdiction
  if (jurisdiction === 'UK') {
    // UK: Quarter ends on 31-Mar, 30-Jun, 30-Sep, 31-Dec
    const month = now.getMonth()
    const quarterStart =
      month < 3 ? new Date(now.getFullYear(), 0, 1) : // Q1
      month < 6 ? new Date(now.getFullYear(), 3, 1) : // Q2
      month < 9 ? new Date(now.getFullYear(), 6, 1) : // Q3
      new Date(now.getFullYear(), 9, 1) // Q4

    return quarterStart
  }

  // US: Month starts on 1st
  return new Date(now.getFullYear(), now.getMonth(), 1)
}

function getFilingStatus(jurisdiction: string, lastFiling: any): { status: string; deadline: string; daysUntil: number } {
  const now = new Date()

  if (!lastFiling) {
    // Never filed
    const deadline = getNextFilingDeadline(jurisdiction, new Date(new Date().getFullYear(), 0, 1))
    const daysUntil = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    return {
      status: 'never_filed',
      deadline: deadline.toISOString().split('T')[0],
      daysUntil,
    }
  }

  // Calculate next filing deadline
  const lastPeriodEnd = new Date(lastFiling.filing_period_end)
  const nextDeadline = getNextFilingDeadline(jurisdiction, lastPeriodEnd)
  const daysUntil = Math.ceil((nextDeadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  return {
    status: lastFiling.status,
    deadline: nextDeadline.toISOString().split('T')[0],
    daysUntil,
  }
}

function getNextFilingDeadline(jurisdiction: string, periodEnd: Date): Date {
  const deadline = new Date(periodEnd)

  if (jurisdiction === 'UK') {
    // UK: deadline is 30 days after quarter end
    deadline.setDate(deadline.getDate() + 30)
  } else if (jurisdiction.startsWith('US_')) {
    // US: typically 20th of next month
    deadline.setMonth(deadline.getMonth() + 1)
    deadline.setDate(20)
  } else {
    // EU: typically 15 days after period end
    deadline.setDate(deadline.getDate() + 15)
  }

  return deadline
}

function getFilingFrequency(jurisdiction: string): string {
  if (jurisdiction === 'UK' || jurisdiction.startsWith('US_')) {
    return jurisdiction === 'UK' ? 'quarterly' : 'varies by state'
  }
  return 'monthly'
}

function calculateComplianceScore(factors: {
  has_tax_id: boolean
  has_transactions: boolean
  filed_on_time: boolean
  data_complete: boolean
  audit_trail_intact: boolean
}): number {
  let score = 0
  score += factors.has_tax_id ? 20 : 0
  score += factors.has_transactions ? 20 : 0
  score += factors.filed_on_time ? 25 : 0
  score += factors.data_complete ? 20 : 0
  score += factors.audit_trail_intact ? 15 : 0

  return Math.min(100, score)
}

function getComplianceIssues(location: any, lastFiling: any, complianceScore: number): string[] {
  const issues: string[] = []

  if (!location.tax_id) {
    issues.push('Tax ID not set')
  }

  if (complianceScore < 80) {
    issues.push(`Low compliance score (${complianceScore}%) - review configuration`)
  }

  if (lastFiling && lastFiling.status === 'failed') {
    issues.push('Last filing was rejected - resubmit with corrections')
  }

  if (lastFiling?.submitted_at) {
    const submitted = new Date(lastFiling.submitted_at)
    const daysSinceFiling = (Date.now() - submitted.getTime()) / (1000 * 60 * 60 * 24)
    if (daysSinceFiling > 90) {
      issues.push(`No filing for ${Math.floor(daysSinceFiling)} days`)
    }
  } else if (!lastFiling) {
    issues.push('Never filed - set up tax configuration')
  }

  return issues
}
