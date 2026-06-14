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

export type StaffTemplateType = 'factory' | 'restaurant'

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

/**
 * Export combined list for UI selection
 */
export const ALL_STAFF_TEMPLATES = [...FACTORY_TEMPLATES, ...RESTAURANT_TEMPLATES]
