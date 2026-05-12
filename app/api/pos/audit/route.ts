import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Comprehensive POS system audit
 * Diagnoses database schema, RLS, and connectivity issues
 * GET /api/pos/audit
 */
export async function GET(req: NextRequest) {
  try {
    const service = createServiceClient()
    const anonClient = createClient()

    const audit: any = {
      timestamp: new Date().toISOString(),
      checks: {}
    }

    // Check 1: Database connectivity
    console.log('🔍 Check 1: Database connectivity...')
    const { data: connTest, error: connError } = await service
      .from('pos_staff')
      .select('*')
      .limit(1)

    audit.checks.database_accessible = {
      status: !connError ? 'pass' : 'fail',
      error: connError?.message
    }

    // Check 2: Get pos_staff table schema
    console.log('🔍 Check 2: pos_staff table schema...')
    const { data: schemaInfo, error: schemaError } = await service
      .rpc('get_table_columns', { table_name: 'pos_staff' })
      .catch(() => ({ data: null, error: null }))

    // Fallback: try to select and inspect columns
    let columnNames: string[] = []
    if (!schemaInfo) {
      const { data: sampleData } = await service
        .from('pos_staff')
        .select('*')
        .limit(1)

      if (sampleData && sampleData.length > 0) {
        columnNames = Object.keys(sampleData[0])
      }
    }

    audit.checks.pos_staff_columns = {
      status: columnNames.length > 0 ? 'pass' : 'info',
      columns: columnNames,
      has_email: columnNames.includes('email'),
      has_phone: columnNames.includes('phone'),
      has_owner_id: columnNames.includes('owner_id')
    }

    // Check 3: Verify email column exists
    console.log('🔍 Check 3: Email column verification...')
    const emailColumnExists = columnNames.includes('email')
    audit.checks.email_column = {
      status: emailColumnExists ? 'pass' : 'fail',
      exists: emailColumnExists,
      message: emailColumnExists ? 'Email column exists' : 'Email column missing - migration 021 not applied'
    }

    // Check 4: Test with service role (should always work)
    console.log('🔍 Check 4: Service role access test...')
    const { data: testData, error: testError } = await service
      .from('pos_staff')
      .select('*')
      .limit(1)

    audit.checks.service_role_access = {
      status: !testError ? 'pass' : 'fail',
      error: testError?.message,
      records_found: testData?.length || 0
    }

    // Check 5: Test RLS with authenticated user
    console.log('🔍 Check 5: RLS/Auth test...')
    const { data: authData, error: authError } = await anonClient.auth.getUser()
    const { data: rlsData, error: rlsError } = await anonClient
      .from('pos_staff')
      .select('*')
      .limit(1)

    audit.checks.rls_policy = {
      status: !rlsError ? 'pass' : 'fail',
      user_authenticated: !!authData.user,
      user_id: authData.user?.id,
      error: rlsError?.message,
      error_code: (rlsError as any)?.code
    }

    // Check 6: Test INSERT with sample data
    console.log('🔍 Check 6: INSERT operation test...')
    if (authData.user) {
      const testInsert = await service
        .from('pos_staff')
        .insert({
          owner_id: authData.user.id,
          name: 'TEST_AUDIT_' + Date.now(),
          phone: '+1234567890',
          email: 'test@audit.local',
          role: 'cashier'
        })
        .select()
        .single()

      audit.checks.insert_test = {
        status: !testInsert.error ? 'pass' : 'fail',
        error: testInsert.error?.message,
        error_code: (testInsert.error as any)?.code,
        error_details: (testInsert.error as any)?.details
      }

      // If insert worked, clean up
      if (!testInsert.error && testInsert.data?.id) {
        await service
          .from('pos_staff')
          .delete()
          .eq('id', testInsert.data.id)
      }
    }

    // Check 7: Test other POS tables
    console.log('🔍 Check 7: Other POS tables...')
    const tableTests: any = {}

    for (const table of ['pos_customers', 'inventory', 'pos_transactions', 'pos_items', 'pos_otp', 'pos_image_recognition']) {
      const { error } = await service
        .from(table as any)
        .select('*')
        .limit(1)

      tableTests[table] = {
        status: !error ? 'pass' : 'fail',
        error: error?.message
      }
    }

    audit.checks.other_tables = tableTests

    // Summary
    audit.summary = {
      critical_issues: [
        !emailColumnExists ? '❌ Email column missing on pos_staff' : null,
        audit.checks.database_accessible.status === 'fail' ? '❌ Database not accessible' : null,
        audit.checks.insert_test?.status === 'fail' ? `❌ Cannot insert staff: ${audit.checks.insert_test.error}` : null
      ].filter(Boolean),
      warnings: [
        audit.checks.rls_policy.status === 'fail' ? '⚠️ RLS policy issue detected' : null
      ].filter(Boolean)
    }

    console.log('✅ Audit complete')

    return NextResponse.json(audit, { status: 200 })
  } catch (err: any) {
    console.error('❌ Audit error:', err)
    return NextResponse.json({
      error: 'Audit failed',
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    }, { status: 500 })
  }
}
