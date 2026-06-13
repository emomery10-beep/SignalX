#!/usr/bin/env node
/**
 * Factory Analytics Test Users Setup Script
 *
 * Creates test Supabase auth users and pos_staff records for Factory Analytics testing
 *
 * Usage:
 *   SUPABASE_SERVICE_ROLE_KEY=your_key npm run setup:test-users
 */

const { createClient } = require('@supabase/supabase-js');
const readline = require('readline');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://benptbfiudpfvmvwxcjm.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_ROLE_KEY) {
  console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  console.error('   Get it from: https://supabase.com/dashboard/project/benptbfiudpfvmvwxcjm/settings/api');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const TEST_USERS = [
  {
    email: 'factory-operator@test.local',
    password: 'TestPassword123!@#',
    name: 'Alex Operator',
    role: 'worker',
    phone: '+1-234-567-0001',
    permissions: ['camera.output', 'camera.wastage'],
  },
  {
    email: 'factory-approver@test.local',
    password: 'TestPassword123!@#',
    name: 'Blake Approver',
    role: 'supervisor',
    phone: '+1-234-567-0002',
    permissions: ['camera.output', 'camera.wastage', 'capture.approve'],
  },
  {
    email: 'factory-manager@test.local',
    password: 'TestPassword123!@#',
    name: 'Casey Manager',
    role: 'manager',
    phone: '+1-234-567-0003',
    permissions: ['camera.output', 'camera.wastage', 'capture.approve', 'data.export', 'settings.manage'],
  },
];

async function setup() {
  console.log('🏭 Factory Analytics Test Users Setup\n');
  console.log(`Supabase Project: ${SUPABASE_URL}\n`);

  // Create auth users and staff records
  const results = [];

  for (const user of TEST_USERS) {
    try {
      console.log(`Creating user: ${user.email}...`);

      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
      });

      if (authError) {
        console.error(`  ❌ Auth error: ${authError.message}`);
        results.push({ email: user.email, status: 'failed', error: authError.message });
        continue;
      }

      const userId = authData.user.id;
      console.log(`  ✅ Auth user created: ${userId}`);

      // 2. Create pos_staff record
      const { data: staffData, error: staffError } = await supabase
        .from('pos_staff')
        .insert({
          owner_id: userId,
          name: user.name,
          role: user.role,
          email: user.email,
          phone: user.phone,
        })
        .select()
        .single();

      if (staffError) {
        console.error(`  ❌ Staff error: ${staffError.message}`);
        results.push({ email: user.email, status: 'failed', error: staffError.message });
        continue;
      }

      console.log(`  ✅ Staff record created`);

      // 3. Create location for this user
      const { data: locData, error: locError } = await supabase
        .from('pos_locations')
        .insert({
          owner_id: userId,
          name: 'Factory Floor A',
          address: '123 Industrial Avenue',
          city: 'Accra',
          state: '',
          country: 'Ghana',
          currency_code: 'GHS',
          tz: 'Africa/Accra',
        })
        .select()
        .single();

      if (locError) {
        console.error(`  ⚠️  Location warning: ${locError.message}`);
      } else {
        console.log(`  ✅ Location created`);
      }

      results.push({
        email: user.email,
        userId,
        status: 'success',
        role: user.role,
        permissions: user.permissions,
      });

      console.log();
    } catch (error) {
      console.error(`  ❌ Error: ${error.message}`);
      results.push({ email: user.email, status: 'failed', error: error.message });
    }
  }

  // Print summary
  console.log('\n📊 Setup Summary:');
  console.log('═'.repeat(80));

  const successful = results.filter((r) => r.status === 'success');
  const failed = results.filter((r) => r.status === 'failed');

  console.log(`\n✅ Created: ${successful.length} users`);
  successful.forEach((r) => {
    console.log(`   • ${r.email} (${r.role})`);
    console.log(`     ID: ${r.userId}`);
    console.log(`     Permissions: ${r.permissions.join(', ')}`);
  });

  if (failed.length > 0) {
    console.log(`\n❌ Failed: ${failed.length} users`);
    failed.forEach((r) => {
      console.log(`   • ${r.email}: ${r.error}`);
    });
  }

  console.log('\n📝 Test Credentials:');
  console.log('═'.repeat(80));
  TEST_USERS.forEach((user, i) => {
    const result = results[i];
    if (result.status === 'success') {
      console.log(`\n${i + 1}. ${user.name}`);
      console.log(`   Email:    ${user.email}`);
      console.log(`   Password: ${user.password}`);
      console.log(`   Role:     ${user.role}`);
      console.log(`   Can:      ${user.permissions.join(', ')}`);
    }
  });

  console.log('\n🔗 Access URLs:');
  console.log('═'.repeat(80));
  console.log(`\n   Worker App:  https://pos.askbiz.co`);
  console.log(`   Dashboard:   https://askbiz.co`);

  console.log('\n✨ Setup complete!\n');
}

setup().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
