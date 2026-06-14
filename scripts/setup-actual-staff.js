#!/usr/bin/env node
/**
 * Actual Staff Setup Script
 *
 * Creates real staff members for both Factory and Restaurant sections
 * with appropriate roles and permissions
 *
 * Usage:
 *   SUPABASE_SERVICE_ROLE_KEY=your_key npm run setup:staff
 */

const { createClient } = require('@supabase/supabase-js');

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

// ============================================================
// FACTORY STAFF
// ============================================================
const FACTORY_STAFF = [
  {
    email: 'chef.weighter@factory.local',
    password: 'ChefWeighter123!@#',
    name: 'Chef Weighter',
    role: 'supervisor',
    phone: '+1-555-0101',
    section: 'factory',
    permissions: ['camera.output', 'camera.wastage', 'capture.approve'],
    jobTitle: 'Production Supervisor',
  },
  {
    email: 'maria.santos@factory.local',
    password: 'MariaProduction123!@#',
    name: 'Maria Santos',
    role: 'worker',
    phone: '+1-555-0102',
    section: 'factory',
    permissions: ['camera.output', 'camera.wastage'],
    jobTitle: 'Line Operator',
  },
  {
    email: 'robert.chen@factory.local',
    password: 'RobertQuality123!@#',
    name: 'Robert Chen',
    role: 'supervisor',
    phone: '+1-555-0103',
    section: 'factory',
    permissions: ['camera.output', 'camera.wastage', 'capture.approve'],
    jobTitle: 'Quality Inspector',
  },
  {
    email: 'amara.okafor@factory.local',
    password: 'AmaraFactory123!@#',
    name: 'Amara Okafor',
    role: 'manager',
    phone: '+1-555-0104',
    section: 'factory',
    permissions: ['camera.output', 'camera.wastage', 'capture.approve', 'data.export', 'settings.manage'],
    jobTitle: 'Production Manager',
  },
  {
    email: 'james.kozlov@factory.local',
    password: 'JamesShift123!@#',
    name: 'James Kozlov',
    role: 'worker',
    phone: '+1-555-0105',
    section: 'factory',
    permissions: ['camera.output', 'camera.wastage'],
    jobTitle: 'Shift Operator',
  },
];

// ============================================================
// RESTAURANT STAFF
// ============================================================
const RESTAURANT_STAFF = [
  {
    email: 'chef.marcus@restaurant.local',
    password: 'ChefMarcus123!@#',
    name: 'Marcus Thompson',
    role: 'manager',
    phone: '+1-555-0201',
    section: 'restaurant',
    permissions: ['orders.view', 'orders.take', 'orders.print', 'staff.manage', 'analytics.view', 'settings.manage'],
    jobTitle: 'Head Chef',
  },
  {
    email: 'sophie.martin@restaurant.local',
    password: 'SophieKitchen123!@#',
    name: 'Sophie Martin',
    role: 'manager',
    phone: '+1-555-0202',
    section: 'restaurant',
    permissions: ['orders.view', 'orders.take', 'orders.print', 'staff.manage', 'analytics.view', 'settings.manage'],
    jobTitle: 'Kitchen Manager',
  },
  {
    email: 'elena.garcia@restaurant.local',
    password: 'ElenaServer123!@#',
    name: 'Elena Garcia',
    role: 'server',
    phone: '+1-555-0203',
    section: 'restaurant',
    permissions: ['orders.view', 'orders.take', 'orders.print'],
    jobTitle: 'Lead Server',
  },
  {
    email: 'david.kim@restaurant.local',
    password: 'DavidServer123!@#',
    name: 'David Kim',
    role: 'server',
    phone: '+1-555-0204',
    section: 'restaurant',
    permissions: ['orders.view', 'orders.take', 'orders.print'],
    jobTitle: 'Server',
  },
  {
    email: 'yuki.tanaka@restaurant.local',
    password: 'YukiManager123!@#',
    name: 'Yuki Tanaka',
    role: 'manager',
    phone: '+1-555-0205',
    section: 'restaurant',
    permissions: ['orders.view', 'orders.take', 'orders.print', 'staff.manage', 'analytics.view', 'settings.manage'],
    jobTitle: 'Operations Manager',
  },
];

async function setup() {
  console.log('👥 Actual Staff Setup\n');
  console.log(`Supabase Project: ${SUPABASE_URL}\n`);

  const allStaff = [...FACTORY_STAFF, ...RESTAURANT_STAFF];
  const results = [];

  for (const staff of allStaff) {
    try {
      console.log(`Creating user: ${staff.name} (${staff.email})...`);

      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: staff.email,
        password: staff.password,
        email_confirm: true,
      });

      if (authError) {
        console.error(`  ❌ Auth error: ${authError.message}`);
        results.push({
          name: staff.name,
          email: staff.email,
          status: 'failed',
          error: authError.message
        });
        continue;
      }

      const userId = authData.user.id;
      console.log(`  ✅ Auth user created: ${userId}`);

      // 2. Create pos_staff record
      const { data: staffData, error: staffError } = await supabase
        .from('pos_staff')
        .insert({
          owner_id: userId,
          name: staff.name,
          role: staff.role,
          email: staff.email,
          phone: staff.phone,
          active: true,
          metadata: {
            jobTitle: staff.jobTitle,
            section: staff.section,
            permissions: staff.permissions,
          },
        })
        .select()
        .single();

      if (staffError) {
        console.error(`  ❌ Staff error: ${staffError.message}`);
        results.push({
          name: staff.name,
          email: staff.email,
          status: 'failed',
          error: staffError.message
        });
        continue;
      }

      console.log(`  ✅ Staff record created (${staff.section} - ${staff.jobTitle})`);

      // 3. Create location for this user (if not already created by same owner)
      const locationName = staff.section === 'factory' ? 'Factory Floor A' : 'Test Restaurant';
      const { data: locData, error: locError } = await supabase
        .from('pos_locations')
        .insert({
          owner_id: userId,
          name: locationName,
          address: staff.section === 'factory' ? '123 Industrial Avenue' : '456 Food Street',
          city: 'Accra',
          state: '',
          country: 'Ghana',
          currency_code: 'GHS',
          tz: 'Africa/Accra',
        })
        .select()
        .single();

      if (locError && !locError.message.includes('duplicate')) {
        console.error(`  ⚠️  Location warning: ${locError.message}`);
      } else if (!locError) {
        console.log(`  ✅ Location created`);
      }

      results.push({
        name: staff.name,
        email: staff.email,
        userId,
        status: 'success',
        role: staff.role,
        section: staff.section,
        jobTitle: staff.jobTitle,
        permissions: staff.permissions,
      });

      console.log();
    } catch (error) {
      console.error(`  ❌ Error: ${error.message}`);
      results.push({
        name: staff.name,
        email: staff.email,
        status: 'failed',
        error: error.message
      });
    }
  }

  // Print summary
  console.log('\n📊 Setup Summary:');
  console.log('═'.repeat(80));

  const successful = results.filter((r) => r.status === 'success');
  const failed = results.filter((r) => r.status === 'failed');

  const factoryStaff = successful.filter(r => r.section === 'factory');
  const restaurantStaff = successful.filter(r => r.section === 'restaurant');

  console.log(`\n✅ Created: ${successful.length} users`);

  console.log(`\n🏭 FACTORY STAFF (${factoryStaff.length}):`);
  factoryStaff.forEach((r) => {
    console.log(`   • ${r.name} (${r.jobTitle})`);
    console.log(`     Email: ${r.email}`);
    console.log(`     Role: ${r.role}`);
    console.log(`     Permissions: ${r.permissions.join(', ')}`);
  });

  console.log(`\n🍽️  RESTAURANT STAFF (${restaurantStaff.length}):`);
  restaurantStaff.forEach((r) => {
    console.log(`   • ${r.name} (${r.jobTitle})`);
    console.log(`     Email: ${r.email}`);
    console.log(`     Role: ${r.role}`);
    console.log(`     Permissions: ${r.permissions.join(', ')}`);
  });

  if (failed.length > 0) {
    console.log(`\n❌ Failed: ${failed.length} users`);
    failed.forEach((r) => {
      console.log(`   • ${r.name} (${r.email}): ${r.error}`);
    });
  }

  console.log('\n📝 Credentials:');
  console.log('═'.repeat(80));

  console.log('\n🏭 FACTORY ACCESS:');
  FACTORY_STAFF.forEach((staff, i) => {
    const result = results.find(r => r.email === staff.email);
    if (result && result.status === 'success') {
      console.log(`   ${staff.name}`);
      console.log(`   Email:    ${staff.email}`);
      console.log(`   Password: ${staff.password}`);
      console.log(`   Access:   https://pos.askbiz.co/factory`);
      console.log();
    }
  });

  console.log('🍽️  RESTAURANT ACCESS:');
  RESTAURANT_STAFF.forEach((staff, i) => {
    const result = results.find(r => r.email === staff.email);
    if (result && result.status === 'success') {
      console.log(`   ${staff.name}`);
      console.log(`   Email:    ${staff.email}`);
      console.log(`   Password: ${staff.password}`);
      console.log(`   Access:   https://pos.askbiz.co/restaurant`);
      console.log();
    }
  });

  console.log('🔗 Access URLs:');
  console.log('═'.repeat(80));
  console.log(`\n   Worker App:  https://pos.askbiz.co`);
  console.log(`   Factory:     https://pos.askbiz.co/factory`);
  console.log(`   Restaurant:  https://pos.askbiz.co/restaurant`);

  console.log('\n✨ Setup complete!\n');
  console.log('💡 Tip: Share credentials with your team via secure channel (not Git)');
  console.log('⚠️  Warning: Change passwords after first login for production use\n');
}

setup().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
