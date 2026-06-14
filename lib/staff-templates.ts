/**
 * Staff Role Templates
 *
 * Pre-configured role templates that new restaurants and factories
 * can use when setting up their team after sign-up.
 *
 * Each template includes:
 * - Role name and description
 * - Default permissions
 * - Job responsibilities
 * - Suggested team size
 */

export type StaffTemplateType = 'factory' | 'restaurant' | 'repair' | 'salon' | 'retail' | 'logistics'

export interface StaffTemplate {
  id: string
  name: string
  description: string
  type: StaffTemplateType
  icon: string
  defaultPermissions: string[]
  responsibilities: string[]
  suggestedTeamSize: string
  color: string
}

// ============================================================
// FACTORY STAFF TEMPLATES
// ============================================================

export const FACTORY_TEMPLATES: StaffTemplate[] = [
  {
    id: 'factory-line-operator',
    name: 'Line Operator',
    description: 'Production floor staff capturing output and logging wastage',
    type: 'factory',
    icon: '👷',
    defaultPermissions: ['camera.output', 'camera.wastage'],
    responsibilities: [
      'Capture production photos (intake, output, dispatch)',
      'Log and track wastage',
      'Report machine downtime',
      'Log quality defects',
      'Scan batch labels',
      'Start and end shifts',
      'Photograph waybills',
    ],
    suggestedTeamSize: '3-8 per shift',
    color: '#3b82f6', // Blue
  },

  {
    id: 'factory-quality-inspector',
    name: 'Quality Inspector',
    description: 'QA staff reviewing and approving production captures',
    type: 'factory',
    icon: '🔍',
    defaultPermissions: ['camera.output', 'camera.wastage', 'capture.approve'],
    responsibilities: [
      'Approve or reject production captures',
      'Review quality defect reports',
      'Track defect trends and patterns',
      'Inspect batch quality at checkpoints',
      'Manage 86 board (out-of-stock items)',
      'Generate quality reports',
    ],
    suggestedTeamSize: '1-2 per shift',
    color: '#f59e0b', // Amber
  },

  {
    id: 'factory-shift-supervisor',
    name: 'Shift Supervisor',
    description: 'Shift lead coordinating team and approving data',
    type: 'factory',
    icon: '👔',
    defaultPermissions: ['camera.output', 'camera.wastage', 'capture.approve'],
    responsibilities: [
      'Oversee production floor operations',
      'Approve staff captures and reports',
      'Manage shift coordination',
      'Handle escalations and issues',
      'Track shift performance metrics',
      'Coordinate with next shift',
    ],
    suggestedTeamSize: '1 per shift',
    color: '#8b5cf6', // Purple
  },

  {
    id: 'factory-production-manager',
    name: 'Production Manager',
    description: 'Management staff overseeing all factory operations',
    type: 'factory',
    icon: '🎯',
    defaultPermissions: [
      'camera.output',
      'camera.wastage',
      'capture.approve',
      'data.export',
      'settings.manage',
    ],
    responsibilities: [
      'Oversee all production operations',
      'Review and approve captures',
      'Export reports and analytics',
      'Configure factory settings',
      'Manage staff and assign roles',
      'Handle integrations with delivery platforms',
      'Strategic production planning',
    ],
    suggestedTeamSize: '1-2 total',
    color: '#dc2626', // Red
  },

  {
    id: 'factory-inventory-manager',
    name: 'Inventory Manager',
    description: 'Staff managing batch traceability and stock',
    type: 'factory',
    icon: '📦',
    defaultPermissions: ['camera.output', 'camera.wastage'],
    responsibilities: [
      'Scan batch labels at checkpoints',
      'Track batch traceability',
      'Manage intake and dispatch',
      'Monitor batch status transitions',
      'Log batch-level quality issues',
      'Coordinate batch movement',
    ],
    suggestedTeamSize: '2-4 per shift',
    color: '#06b6d4', // Cyan
  },
]

// ============================================================
// RESTAURANT STAFF TEMPLATES
// ============================================================

export const RESTAURANT_TEMPLATES: StaffTemplate[] = [
  {
    id: 'restaurant-server',
    name: 'Server',
    description: 'Floor staff taking orders and serving tables',
    type: 'restaurant',
    icon: '🍽️',
    defaultPermissions: ['orders.view', 'orders.take', 'orders.print'],
    responsibilities: [
      'Take orders from tables',
      'Manage table reservations',
      'View order status and kitchen progress',
      'Print guest checks and receipts',
      'Process payments',
      'Manage customer requests',
      'Upsell menu items',
    ],
    suggestedTeamSize: '4-8 per shift',
    color: '#06b6d4', // Cyan
  },

  {
    id: 'restaurant-lead-server',
    name: 'Lead Server',
    description: 'Senior server coordinating floor operations',
    type: 'restaurant',
    icon: '⭐',
    defaultPermissions: ['orders.view', 'orders.take', 'orders.print'],
    responsibilities: [
      'All server responsibilities',
      'Coordinate server team',
      'Handle VIP tables and requests',
      'Resolve customer issues',
      'Train junior servers',
      'Monitor table flow and timing',
    ],
    suggestedTeamSize: '1-2 per shift',
    color: '#f59e0b', // Amber
  },

  {
    id: 'restaurant-host',
    name: 'Host',
    description: 'Front-of-house staff managing seating and reservations',
    type: 'restaurant',
    icon: '🎫',
    defaultPermissions: ['orders.view'],
    responsibilities: [
      'Manage table reservations',
      'Greet guests',
      'Manage waiting list',
      'Coordinate with servers on table readiness',
      'Handle cancellations',
      'Track wait times',
    ],
    suggestedTeamSize: '1-2 per shift',
    color: '#3b82f6', // Blue
  },

  {
    id: 'restaurant-head-chef',
    name: 'Head Chef',
    description: 'Kitchen management overseeing all food production',
    type: 'restaurant',
    icon: '👨‍🍳',
    defaultPermissions: [
      'orders.view',
      'orders.take',
      'orders.print',
      'staff.manage',
      'analytics.view',
      'settings.manage',
    ],
    responsibilities: [
      'Oversee all kitchen operations',
      'Create and manage menu',
      'Manage kitchen staff',
      'Ensure food quality and consistency',
      'Handle food costs and inventory',
      'Plan special menus and events',
      'Train kitchen staff',
    ],
    suggestedTeamSize: '1 total',
    color: '#ef4444', // Red
  },

  {
    id: 'restaurant-kitchen-manager',
    name: 'Kitchen Manager',
    description: 'Kitchen operations coordinator',
    type: 'restaurant',
    icon: '🍳',
    defaultPermissions: [
      'orders.view',
      'orders.take',
      'orders.print',
      'staff.manage',
      'analytics.view',
      'settings.manage',
    ],
    responsibilities: [
      'Coordinate kitchen prep and cooking',
      'Manage kitchen staff during shift',
      'Ensure order timing and quality',
      'Track food costs',
      'Manage kitchen equipment',
      'Handle quality issues',
      'Monitor kitchen performance',
    ],
    suggestedTeamSize: '1 per shift',
    color: '#ec4899', // Pink
  },

  {
    id: 'restaurant-line-cook',
    name: 'Line Cook',
    description: 'Kitchen staff preparing food at specific stations',
    type: 'restaurant',
    icon: '🔪',
    defaultPermissions: ['orders.view'],
    responsibilities: [
      'Prepare food at assigned station',
      'Follow recipes and plating standards',
      'Manage station inventory',
      'Work as part of team',
      'Maintain kitchen cleanliness',
      'Report ingredient shortages',
      'Coordinate with other cooks',
    ],
    suggestedTeamSize: '2-5 per shift',
    color: '#14b8a6', // Teal
  },

  {
    id: 'restaurant-manager',
    name: 'Operations Manager',
    description: 'Overall restaurant management and administration',
    type: 'restaurant',
    icon: '🎯',
    defaultPermissions: [
      'orders.view',
      'orders.take',
      'orders.print',
      'staff.manage',
      'analytics.view',
      'settings.manage',
    ],
    responsibilities: [
      'Oversee all restaurant operations',
      'Manage staff scheduling and roles',
      'Review financial and sales reports',
      'Handle customer complaints',
      'Configure restaurant settings',
      'Manage integrations with delivery platforms',
      'Plan promotions and menus',
      'Ensure compliance and standards',
    ],
    suggestedTeamSize: '1-2 total',
    color: '#8b5cf6', // Purple
  },

  {
    id: 'restaurant-cashier',
    name: 'Cashier',
    description: 'Point-of-sale and payment processing',
    type: 'restaurant',
    icon: '💳',
    defaultPermissions: ['orders.view'],
    responsibilities: [
      'Process payments',
      'Issue receipts',
      'Handle cash drawer',
      'Reconcile sales',
      'Manage refunds and adjustments',
      'Process gift cards',
      'Handle customer inquiries',
    ],
    suggestedTeamSize: '1-3 per shift',
    color: '#10b981', // Green
  },
]

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export function getTemplateById(
  id: string,
  type: StaffTemplateType
): StaffTemplate | undefined {
  const templates = type === 'factory' ? FACTORY_TEMPLATES : RESTAURANT_TEMPLATES
  return templates.find(t => t.id === id)
}

export function getTemplatesByType(type: StaffTemplateType): StaffTemplate[] {
  return type === 'factory' ? FACTORY_TEMPLATES : RESTAURANT_TEMPLATES
}

export function getTemplateColor(template: StaffTemplate): string {
  return template.color
}

/**
 * Quick-start role suggestions for new locations
 */
export const QUICK_START_RECOMMENDATIONS = {
  factory_small: [
    'factory-line-operator',
    'factory-quality-inspector',
    'factory-production-manager',
  ],
  factory_medium: [
    'factory-line-operator',
    'factory-quality-inspector',
    'factory-shift-supervisor',
    'factory-production-manager',
    'factory-inventory-manager',
  ],
  factory_large: [
    'factory-line-operator',
    'factory-quality-inspector',
    'factory-shift-supervisor',
    'factory-production-manager',
    'factory-inventory-manager',
  ],
  restaurant_small: [
    'restaurant-server',
    'restaurant-head-chef',
    'restaurant-manager',
  ],
  restaurant_medium: [
    'restaurant-server',
    'restaurant-lead-server',
    'restaurant-head-chef',
    'restaurant-kitchen-manager',
    'restaurant-manager',
  ],
  restaurant_large: [
    'restaurant-server',
    'restaurant-lead-server',
    'restaurant-host',
    'restaurant-head-chef',
    'restaurant-kitchen-manager',
    'restaurant-line-cook',
    'restaurant-cashier',
    'restaurant-manager',
  ],
}

// ============================================================
// REPAIR STAFF TEMPLATES
// ============================================================

export const REPAIR_TEMPLATES: StaffTemplate[] = [
  {
    id: 'repair-intake-specialist',
    name: 'Intake Specialist',
    description: 'Reception and intake of repair jobs',
    type: 'repair',
    icon: '📋',
    defaultPermissions: ['intake.create', 'orders.view'],
    responsibilities: [
      'Receive devices for repair',
      'Create intake records',
      'Photograph device condition',
      'Document customer information',
      'Estimate repair costs',
      'Handle customer payments',
      'Issue receipts and service tickets',
    ],
    suggestedTeamSize: '1-2 per shift',
    color: '#06b6d4', // Cyan
  },

  {
    id: 'repair-technician',
    name: 'Technician',
    description: 'Repair work and technical assessment',
    type: 'repair',
    icon: '🔧',
    defaultPermissions: ['intake.view', 'repairs.update', 'parts.manage'],
    responsibilities: [
      'Diagnose device issues',
      'Perform repairs',
      'Test repaired devices',
      'Track work hours on jobs',
      'Update repair status',
      'Manage parts inventory',
      'Document repair work',
    ],
    suggestedTeamSize: '2-5 per shift',
    color: '#f59e0b', // Amber
  },

  {
    id: 'repair-quality-checker',
    name: 'Quality Checker',
    description: 'Quality assurance and final inspection',
    type: 'repair',
    icon: '✓',
    defaultPermissions: ['intake.view', 'repairs.approve', 'orders.view'],
    responsibilities: [
      'Inspect completed repairs',
      'Verify repair quality',
      'Test device functionality',
      'Approve repairs for pickup',
      'Check all accessories included',
      'Generate quality reports',
      'Track repair metrics',
    ],
    suggestedTeamSize: '1-2 per shift',
    color: '#10b981', // Green
  },

  {
    id: 'repair-manager',
    name: 'Repair Manager',
    description: 'Oversight and management of repair operations',
    type: 'repair',
    icon: '🎯',
    defaultPermissions: ['intake.create', 'repairs.update', 'repairs.approve', 'parts.manage', 'analytics.view', 'settings.manage'],
    responsibilities: [
      'Oversee repair operations',
      'Manage technician workload',
      'Handle customer escalations',
      'Approve complex repairs',
      'Manage parts inventory',
      'View repair analytics and metrics',
      'Configure repair settings',
      'Staff management',
    ],
    suggestedTeamSize: '1 total',
    color: '#8b5cf6', // Purple
  },
]

// ============================================================
// SALON STAFF TEMPLATES
// ============================================================

export const SALON_TEMPLATES: StaffTemplate[] = [
  {
    id: 'salon-receptionist',
    name: 'Receptionist',
    description: 'Front desk and appointment management',
    type: 'salon',
    icon: '📞',
    defaultPermissions: ['appointments.view', 'appointments.create', 'orders.view'],
    responsibilities: [
      'Answer client calls',
      'Book appointments',
      'Check in clients',
      'Process payments',
      'Manage waiting list',
      'Issue receipts',
      'Handle customer inquiries',
    ],
    suggestedTeamSize: '1-2 per shift',
    color: '#ec4899', // Pink
  },

  {
    id: 'salon-stylist',
    name: 'Stylist',
    description: 'Hair and beauty services',
    type: 'salon',
    icon: '💇',
    defaultPermissions: ['appointments.view', 'orders.view', 'orders.take'],
    responsibilities: [
      'Provide hair styling services',
      'Consult with clients on styles',
      'Maintain equipment and tools',
      'Track service times',
      'Upsell additional services',
      'Maintain client records',
      'Follow hygiene protocols',
    ],
    suggestedTeamSize: '3-8 per shift',
    color: '#06b6d4', // Cyan
  },

  {
    id: 'salon-esthetician',
    name: 'Esthetician',
    description: 'Beauty treatments and skincare',
    type: 'salon',
    icon: '💄',
    defaultPermissions: ['appointments.view', 'orders.view', 'orders.take'],
    responsibilities: [
      'Perform facials and skin treatments',
      'Apply makeup services',
      'Provide skincare advice',
      'Manage beauty product inventory',
      'Track treatment times',
      'Maintain client cards',
      'Recommend product purchases',
    ],
    suggestedTeamSize: '2-4 per shift',
    color: '#f59e0b', // Amber
  },

  {
    id: 'salon-manager',
    name: 'Salon Manager',
    description: 'Salon operations and staff management',
    type: 'salon',
    icon: '🎯',
    defaultPermissions: ['appointments.create', 'appointments.manage', 'orders.view', 'orders.take', 'staff.manage', 'analytics.view', 'settings.manage'],
    responsibilities: [
      'Oversee salon operations',
      'Manage staff schedules',
      'Handle customer complaints',
      'Manage inventory and supplies',
      'Track salon metrics and revenue',
      'Manage client loyalty program',
      'Configure salon settings',
      'Staff training and management',
    ],
    suggestedTeamSize: '1 total',
    color: '#8b5cf6', // Purple
  },
]

// ============================================================
// RETAIL STAFF TEMPLATES
// ============================================================

export const RETAIL_TEMPLATES: StaffTemplate[] = [
  {
    id: 'retail-cashier',
    name: 'Cashier',
    description: 'Point of sale and checkout',
    type: 'retail',
    icon: '💳',
    defaultPermissions: ['sales.process', 'orders.view'],
    responsibilities: [
      'Process customer transactions',
      'Handle cash and card payments',
      'Manage cash drawer',
      'Reconcile sales',
      'Issue receipts',
      'Handle refunds and exchanges',
      'Bag merchandise',
    ],
    suggestedTeamSize: '2-4 per shift',
    color: '#10b981', // Green
  },

  {
    id: 'retail-floor-staff',
    name: 'Floor Associate',
    description: 'Sales floor and customer service',
    type: 'retail',
    icon: '🏪',
    defaultPermissions: ['inventory.view', 'orders.view'],
    responsibilities: [
      'Stock shelves and displays',
      'Assist customers on sales floor',
      'Answer product questions',
      'Handle customer inquiries',
      'Manage product displays',
      'Maintain store cleanliness',
      'Check inventory levels',
    ],
    suggestedTeamSize: '3-6 per shift',
    color: '#06b6d4', // Cyan
  },

  {
    id: 'retail-inventory-manager',
    name: 'Inventory Manager',
    description: 'Stock management and inventory control',
    type: 'retail',
    icon: '📦',
    defaultPermissions: ['inventory.manage', 'inventory.view', 'orders.view'],
    responsibilities: [
      'Manage inventory levels',
      'Conduct stock counts',
      'Track product movement',
      'Order new inventory',
      'Manage warehouse',
      'Generate inventory reports',
      'Optimize stock levels',
    ],
    suggestedTeamSize: '1-2 total',
    color: '#f59e0b', // Amber
  },

  {
    id: 'retail-shift-supervisor',
    name: 'Shift Supervisor',
    description: 'Shift operations oversight',
    type: 'retail',
    icon: '👔',
    defaultPermissions: ['sales.process', 'inventory.view', 'orders.view', 'orders.take'],
    responsibilities: [
      'Oversee shift operations',
      'Manage floor staff',
      'Handle customer escalations',
      'Approve refunds and exchanges',
      'Cash reconciliation',
      'Staff breaks and scheduling',
      'Opening and closing procedures',
    ],
    suggestedTeamSize: '1 per shift',
    color: '#3b82f6', // Blue
  },

  {
    id: 'retail-manager',
    name: 'Store Manager',
    description: 'Overall store management',
    type: 'retail',
    icon: '🎯',
    defaultPermissions: ['sales.process', 'inventory.manage', 'orders.view', 'orders.take', 'staff.manage', 'analytics.view', 'settings.manage'],
    responsibilities: [
      'Oversee all store operations',
      'Manage staff and schedules',
      'Control store budget',
      'Monitor sales performance',
      'Manage customer relationships',
      'Handle supplier relationships',
      'Configure store settings',
      'Staff training and development',
    ],
    suggestedTeamSize: '1 total',
    color: '#8b5cf6', // Purple
  },
]

// ============================================================
// LOGISTICS STAFF TEMPLATES
// ============================================================

export const LOGISTICS_TEMPLATES: StaffTemplate[] = [
  {
    id: 'logistics-handler',
    name: 'Handler',
    description: 'Warehouse and parcel handling',
    type: 'logistics',
    icon: '📦',
    defaultPermissions: ['parcels.receive', 'parcels.dispatch', 'inventory.view'],
    responsibilities: [
      'Receive incoming parcels',
      'Sort and organize packages',
      'Load packages for dispatch',
      'Scan barcodes and track items',
      'Handle damaged packages',
      'Maintain warehouse cleanliness',
      'Follow safety procedures',
    ],
    suggestedTeamSize: '3-6 per shift',
    color: '#06b6d4', // Cyan
  },

  {
    id: 'logistics-driver',
    name: 'Driver',
    description: 'Delivery and vehicle operations',
    type: 'logistics',
    icon: '🚛',
    defaultPermissions: ['parcels.view', 'parcels.dispatch', 'vehicle.inspect'],
    responsibilities: [
      'Deliver packages to customers',
      'Perform pickups',
      'Maintain vehicle condition',
      'Inspect vehicle before each trip',
      'Track delivery routes',
      'Collect signatures and payments',
      'Handle customer interactions',
    ],
    suggestedTeamSize: '3-8 per shift',
    color: '#f59e0b', // Amber
  },

  {
    id: 'logistics-dispatcher',
    name: 'Dispatcher',
    description: 'Route planning and coordination',
    type: 'logistics',
    icon: '📍',
    defaultPermissions: ['parcels.view', 'routes.create', 'vehicles.manage'],
    responsibilities: [
      'Assign parcels to drivers',
      'Plan delivery routes',
      'Track vehicle locations',
      'Handle customer inquiries',
      'Communicate with drivers',
      'Optimize delivery routes',
      'Generate delivery reports',
    ],
    suggestedTeamSize: '1-2 per shift',
    color: '#3b82f6', // Blue
  },

  {
    id: 'logistics-branch-manager',
    name: 'Branch Manager',
    description: 'Branch operations management',
    type: 'logistics',
    icon: '🎯',
    defaultPermissions: ['parcels.view', 'parcels.dispatch', 'vehicles.manage', 'staff.manage', 'analytics.view', 'settings.manage'],
    responsibilities: [
      'Oversee branch operations',
      'Manage staff schedules',
      'Monitor delivery performance',
      'Handle customer complaints',
      'Manage vehicle maintenance',
      'Control branch budget',
      'Generate performance reports',
      'Staff training and management',
    ],
    suggestedTeamSize: '1 total',
    color: '#8b5cf6', // Purple
  },
]

/**
 * Export combined list for UI selection
 */
export const ALL_STAFF_TEMPLATES = [
  ...FACTORY_TEMPLATES,
  ...RESTAURANT_TEMPLATES,
  ...REPAIR_TEMPLATES,
  ...SALON_TEMPLATES,
  ...RETAIL_TEMPLATES,
  ...LOGISTICS_TEMPLATES,
]
