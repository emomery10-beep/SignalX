import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosOwner } from '@/lib/pos-auth'

/**
 * GET /api/pos/tax-filing-preview
 *
 * Shows the user what their tax filing will look like before submission
 * Helps validate numbers before sending to HMRC/IRS
 *
 * Query params:
 *   jurisdiction: 'UK' | 'US_CA' etc.
 *   start_date: ISO date
 *   end_date: ISO date
 */
export async function GET(req: NextRequest) {
  const ownerId = await resolvePosOwner(req)
  if (!ownerId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const { searchParams } = new URL(req.url)

  const jurisdiction = searchParams.get('jurisdiction') || 'UK'
  const startDate = searchParams.get('start_date')
  const endDate = searchParams.get('end_date')

  if (!startDate || !endDate) {
    return NextResponse.json({ error: 'start_date and end_date required' }, { status: 400 })
  }

  // Fetch owner's tax settings
  const { data: taxSettings } = await service
    .from('pos_locations')
    .select('id, tax_settings_json')
    .eq('owner_id', ownerId)
    .eq('tax_jurisdiction', jurisdiction)
    .limit(1)

  // Fetch transaction data
  const { data: transactions } = await service
    .from('pos_transactions')
    .select(`
      id,
      created_at,
      total_amount,
      total_tax,
      payment_method,
      pos_items (name, tax_code, tax_rate, tax_amount)
    `)
    .eq('owner_id', ownerId)
    .eq('tax_jurisdiction', jurisdiction)
    .gte('created_at', `${startDate}T00:00:00Z`)
    .lte('created_at', `${endDate}T23:59:59Z`)

  const tx = transactions || []
  const totalGross = tx.reduce((s: number, t: any) => s + (t.total_amount || 0), 0)
  const totalTax = tx.reduce((s: number, t: any) => s + (t.total_tax || 0), 0)

  const preview = {
    jurisdiction,
    period: `${startDate} to ${endDate}`,
    period_type: getPeriodType(startDate, endDate),
    preview_generated: new Date().toISOString(),

    // Summary numbers
    summary: {
      total_transactions: tx.length,
      total_gross_sales: Math.round(totalGross * 100) / 100,
      total_tax_due: Math.round(totalTax * 100) / 100,
      average_transaction: Math.round((totalGross / Math.max(tx.length, 1)) * 100) / 100,
    },

    // Warnings and validation
    validation: {
      issues: getValidationIssues(jurisdiction, tx, totalGross, totalTax),
      warnings: getWarnings(jurisdiction, tx),
      ready_to_file: checkReadyToFile(jurisdiction, tx, totalGross),
    },

    // File format examples
    file_formats: {
      hmrc_mtd: jurisdiction === 'UK' ? {
        endpoint: '/api/pos/tax-filing-submit',
        method: 'POST',
        required_fields: ['vrn', 'period_key', 'total_net_sales', 'total_vat', 'due_date'],
        example: buildHMRCExample(tx, totalTax),
      } : null,
      us_sales_tax: jurisdiction.startsWith('US_') ? {
        endpoint: '/api/pos/tax-filing-submit',
        method: 'POST',
        required_fields: ['jurisdiction', 'tax_collected', 'taxable_sales'],
        format: 'state-specific',
      } : null,
    },

    // Filing deadline info
    filing_deadline: getFilingDeadline(jurisdiction, startDate),

    // Recommendations
    recommendations: getRecommendations(jurisdiction, tx, totalGross, totalTax),
  }

  return NextResponse.json(preview)
}

function getPeriodType(startDate: string, endDate: string): string {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const days = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)

  if (days <= 31) return 'monthly'
  if (days <= 95) return 'quarterly'
  if (days <= 370) return 'annual'
  return 'custom'
}

function getValidationIssues(jurisdiction: string, transactions: any[], gross: number, tax: number): string[] {
  const issues: string[] = []

  if (transactions.length === 0) {
    issues.push('No transactions found in period - filing may not be required')
  }

  if (gross === 0) {
    issues.push('Zero gross sales - verify this is correct')
  }

  if (jurisdiction === 'UK' && gross > 0 && gross < 85000) {
    // UK VAT threshold
    issues.push('Gross sales below UK VAT threshold (£85,000) - may not be required to register')
  }

  // Check for extreme tax rates that might indicate data entry errors
  const avgTaxRate = gross > 0 ? (tax / gross) * 100 : 0
  if (avgTaxRate > 30) {
    issues.push(`Unusually high average tax rate (${avgTaxRate.toFixed(1)}%) - verify tax codes are correct`)
  }
  if (avgTaxRate > 0 && avgTaxRate < 1) {
    issues.push(`Unusually low average tax rate (${avgTaxRate.toFixed(1)}%) - verify tax codes are correct`)
  }

  return issues
}

function getWarnings(jurisdiction: string, transactions: any[]): string[] {
  const warnings: string[] = []

  // Check for missing transaction details
  const missingPaymentMethod = transactions.filter((t) => !t.payment_method).length
  if (missingPaymentMethod > 0) {
    warnings.push(`${missingPaymentMethod} transactions missing payment method`)
  }

  // Check for VAT number presence
  if (jurisdiction === 'UK' && transactions.length > 100) {
    warnings.push('Large number of transactions - consider enabling VAT number validation for B2B sales')
  }

  return warnings
}

function checkReadyToFile(jurisdiction: string, transactions: any[], gross: number): boolean {
  // Ready to file if:
  // 1. Has transactions
  // 2. Has all required fields
  // 3. Meets jurisdiction thresholds
  if (transactions.length === 0) return false
  if (gross === 0) return false
  if (jurisdiction === 'UK' && gross < 85000) return false // Below threshold

  return true
}

function buildHMRCExample(transactions: any[], totalTax: number) {
  return {
    vrn: 'GB123456789', // Would come from user settings
    period_key: 'A001', // First quarter of tax year
    periodFromDate: transactions[0]?.created_at?.split('T')[0],
    periodToDate: transactions[transactions.length - 1]?.created_at?.split('T')[0],
    totalNetSales: (transactions.reduce((s, t) => s + (t.total_amount || 0) - (t.total_tax || 0), 0) / 100).toFixed(2),
    totalVATDue: (totalTax / 100).toFixed(2),
    totalValueGoodsSuppliedExcludingVAT: 0,
    totalMvaRelief: 0,
    totalSalesExcludingExemptionsAndZeroRated: 0,
    totalExemptSupplies: 0,
    totalValuePurchasesExcludingVAT: 0,
    totalPurchasesExcludingExemptionsAndZeroRated: 0,
    totalVATRecoverable: 0,
    vatPayable: (totalTax / 100).toFixed(2),
  }
}

function getFilingDeadline(jurisdiction: string, periodStartDate: string): {
  deadline: string
  days_until: number
  format: string
} {
  const start = new Date(periodStartDate)
  let deadline = new Date(start)

  if (jurisdiction === 'UK') {
    // UK: quarterly deadline is 30 days after quarter end
    // Quarters: Jan-Mar (deadline Apr 30), Apr-Jun (deadline Jul 31), etc.
    const month = start.getMonth()
    const quarterEnd = Math.floor(month / 3) * 3 + 2 // Last month of quarter
    deadline = new Date(start.getFullYear(), quarterEnd + 1, 30) // +1 for 30 days after
  } else if (jurisdiction.startsWith('US_')) {
    // US: typically monthly/quarterly depending on state
    deadline = new Date(start.getFullYear(), start.getMonth() + 1, 20)
  }

  const today = new Date()
  const daysUntil = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  return {
    deadline: deadline.toISOString().split('T')[0],
    days_until: daysUntil,
    format: jurisdiction === 'UK' ? 'HMRC MTD' : jurisdiction.startsWith('US_') ? 'State Sales Tax' : 'EU VAT',
  }
}

function getRecommendations(jurisdiction: string, transactions: any[], gross: number, tax: number): string[] {
  const recommendations: string[] = []

  // Add filing recommendation if threshold met
  if (jurisdiction === 'UK' && gross > 85000) {
    recommendations.push('✓ Gross sales exceed £85,000 VAT threshold - filing is required')
  }

  // Recommend data export
  if (transactions.length > 100) {
    recommendations.push('💾 Consider exporting audit trail for record-keeping (7 years required)')
  }

  // Recommend payment
  if (tax > 1000) {
    recommendations.push('💳 Large VAT amount due - ensure payment method is available')
  }

  // Recommend Xero sync
  if (transactions.length > 50) {
    recommendations.push('🔄 Consider connecting to Xero for automatic reconciliation')
  }

  return recommendations
}
