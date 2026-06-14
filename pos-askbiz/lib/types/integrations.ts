/**
 * Types for Restaurant Third-Party Platform Integrations
 * Used by Team B (Backend/Integration work)
 */

// ── Platform Types ──────────────────────────────────────────

export type PlatformType = 'uber_eats' | 'doordash' | 'grubhub' | 'just_eat' | 'swiggy' | 'grab' | 'meituan' | 'other'

export interface PlatformConfig {
  platform: PlatformType
  name: string
  apiUrl: string
  webhookPath: string
  requiresOAuth: boolean
  supportsMenuSync: boolean
  supportsStatusUpdates: boolean
}

// Platform-specific configurations
export const PLATFORM_CONFIGS: Record<PlatformType, PlatformConfig> = {
  uber_eats: {
    platform: 'uber_eats',
    name: 'Uber Eats',
    apiUrl: 'https://api.uber.com/v2',
    webhookPath: '/webhooks/uber-eats',
    requiresOAuth: true,
    supportsMenuSync: true,
    supportsStatusUpdates: true,
  },
  doordash: {
    platform: 'doordash',
    name: 'DoorDash',
    apiUrl: 'https://api.doordash.com',
    webhookPath: '/webhooks/doordash',
    requiresOAuth: false,
    supportsMenuSync: true,
    supportsStatusUpdates: true,
  },
  grubhub: {
    platform: 'grubhub',
    name: 'Grubhub',
    apiUrl: 'https://api.grubhub.com/v1',
    webhookPath: '/webhooks/grubhub',
    requiresOAuth: false,
    supportsMenuSync: true,
    supportsStatusUpdates: true,
  },
  just_eat: {
    platform: 'just_eat',
    name: 'Just Eat',
    apiUrl: 'https://api.justeatapi.com',
    webhookPath: '/webhooks/just-eat',
    requiresOAuth: false,
    supportsMenuSync: true,
    supportsStatusUpdates: true,
  },
  swiggy: {
    platform: 'swiggy',
    name: 'Swiggy',
    apiUrl: 'https://api.swiggystaging.com',
    webhookPath: '/webhooks/swiggy',
    requiresOAuth: true,
    supportsMenuSync: true,
    supportsStatusUpdates: true,
  },
  grab: {
    platform: 'grab',
    name: 'Grab',
    apiUrl: 'https://api.grab.com',
    webhookPath: '/webhooks/grab',
    requiresOAuth: true,
    supportsMenuSync: true,
    supportsStatusUpdates: true,
  },
  meituan: {
    platform: 'meituan',
    name: 'Meituan',
    apiUrl: 'https://api.meituan.com',
    webhookPath: '/webhooks/meituan',
    requiresOAuth: false,
    supportsMenuSync: true,
    supportsStatusUpdates: true,
  },
  other: {
    platform: 'other',
    name: 'Other',
    apiUrl: '',
    webhookPath: '/webhooks/custom',
    requiresOAuth: false,
    supportsMenuSync: false,
    supportsStatusUpdates: false,
  },
}

// ── Integration Database Types ──────────────────────────────

export interface PosIntegration {
  id: string
  owner_id: string
  location_id: string
  platform: PlatformType
  name: string
  api_key: string // Encrypted in DB
  api_secret?: string // Encrypted in DB
  webhook_secret?: string // Encrypted in DB
  oauth_token?: string // Encrypted in DB
  oauth_refresh_token?: string // Encrypted in DB
  oauth_expires_at?: string
  active: boolean
  commission_rate: number // %
  connected_at: string
  last_sync_at?: string
  last_menu_sync_at?: string
  last_webhook_received_at?: string
  metadata?: Record<string, any>
  sync_enabled: boolean
  created_at: string
  updated_at: string
}

export interface PosOrderFinancials {
  id: string
  owner_id: string
  location_id: string
  order_id: string
  integration_id: string
  platform_order_id: string
  platform: PlatformType
  gross_total: number
  subtotal: number
  tax: number
  platform_fee: number
  service_fee: number
  delivery_fee: number
  commission_percent: number
  commission_amount: number // GENERATED
  customer_tip: number
  customer_tip_after_fee?: number
  your_payout: number // GENERATED
  platform_settlement_id?: string
  reconciled: boolean
  reconciled_at?: string
  created_at: string
  updated_at: string
}

export interface PosIntegrationAudit {
  id: string
  owner_id: string
  integration_id: string
  operation: 'webhook_received' | 'menu_sync' | 'order_status_update' | 'financial_sync' | 'api_error'
  platform: PlatformType
  endpoint?: string
  method?: string
  status_code?: number
  success: boolean
  error_message?: string
  request_payload?: Record<string, any>
  response_payload?: Record<string, any>
  created_at: string
}

export interface PosWebhookQueue {
  id: string
  owner_id: string
  integration_id: string
  platform: PlatformType
  event_type: string
  external_id: string
  payload: Record<string, any>
  signature?: string
  processed: boolean
  processed_at?: string
  error_message?: string
  retry_count: number
  next_retry_at?: string
  created_at: string
  updated_at: string
}

export interface PosMenuSyncState {
  id: string
  owner_id: string
  location_id: string
  integration_id: string
  last_full_sync_at?: string
  last_incremental_sync_at?: string
  items_synced_count: number
  items_failed_count: number
  last_error?: string
  platform_catalog_id?: string
  platform_state?: Record<string, any>
  created_at: string
  updated_at: string
}

// ── Webhook Event Types ─────────────────────────────────────

export type WebhookEventType = 'order.created' | 'order.updated' | 'order.accepted' | 'order.cancelled' | 'order.ready' | 'order.dispatched'

export interface WebhookPayloadBase {
  platform: PlatformType
  event_type: WebhookEventType
  timestamp: string
  signature?: string // For verification
}

// Normalized webhook payload (Team A depends on this)
export interface NormalizedWebhookPayload extends WebhookPayloadBase {
  platform_order_id: string
  customer_name: string
  customer_phone: string
  customer_email?: string
  items: Array<{
    name: string
    qty: number
    price: number
    special_instructions?: string
  }>
  subtotal: number
  tax: number
  delivery_fee: number
  platform_fee: number
  service_fee: number
  customer_tip: number
  total: number
  delivery_address: string
  scheduled_time?: string
  status: OrderStatus
}

export type OrderStatus = 'pending' | 'accepted' | 'preparing' | 'ready' | 'dispatched' | 'cancelled'

// Platform-specific webhook payloads

export interface UberEatsWebhookPayload extends WebhookPayloadBase {
  event_id: string
  event_type: 'order.created' | 'order.status_changed'
  order_id: string
  order_state: string
  restaurant_uuid: string
  eater_uuid?: string
  created_at: string
  items: Array<{
    title: string
    quantity: number
    price: { value: number; currency_code: string }
    special_instructions?: string
  }>
  subtotal: { value: number; currency_code: string }
  tax: { value: number; currency_code: string }
  delivery_fee: { value: number; currency_code: string }
  service_fee: { value: number; currency_code: string }
  total: { value: number; currency_code: string }
  customer_tip?: { value: number; currency_code: string }
  delivery: {
    address: string
    contact: { phone: string }
    scheduled_time?: string
  }
}

export interface DoorDashWebhookPayload extends WebhookPayloadBase {
  id: string
  status: string
  order_id: string
  order_uuid: string
  merchant_id: string
  subtotal_amount: number
  tax_amount: number
  delivery_fee: number
  service_fee: number
  total_amount: number
  tip_amount?: number
  items: Array<{
    name: string
    quantity: number
    price: number
    special_instructions?: string
  }>
  delivery_address: string
  customer_name: string
  customer_phone: string
  estimated_ready_time?: string
  timestamp: string
}

export interface GrubhubWebhookPayload extends WebhookPayloadBase {
  eventId: string
  eventType: string
  orderId: string
  restaurantId: string
  createdAt: string
  updatedAt: string
  order: {
    id: string
    status: string
    subtotal: number
    tax: number
    delivery_fee: number
    service_fee: number
    total: number
    tip: number
    items: Array<{
      name: string
      quantity: number
      unitPrice: number
      specialInstructions?: string
    }>
    deliveryAddress: string
    customer: {
      name: string
      phone: string
    }
    scheduledDeliveryTime?: string
  }
}

// ── API Request/Response Types ──────────────────────────────

export interface IntegrationConnectionRequest {
  platform: PlatformType
  location_id: string
  api_key: string
  api_secret?: string
  commission_rate?: number
  webhook_secret?: string
  metadata?: Record<string, any>
}

export interface IntegrationConnectionResponse {
  integration: PosIntegration
  webhook_url: string // URL where platform should send webhooks
}

export interface MenuSyncRequest {
  integration_id: string
  full_sync?: boolean // true = full sync, false = incremental
}

export interface MenuSyncResponse {
  items_synced: number
  items_failed: number
  errors: Array<{ item_id: string; error: string }>
  last_sync_at: string
}

export interface OrderStatusUpdateRequest {
  order_id: string
  status: OrderStatus
  estimated_time_minutes?: number
}

export interface OrderStatusUpdateResponse {
  success: boolean
  platforms_notified: PlatformType[]
  errors: Array<{ platform: PlatformType; error: string }>
}

export interface FinancialReportRequest {
  location_id: string
  start_date: string // ISO 8601
  end_date: string // ISO 8601
  platforms?: PlatformType[]
  group_by?: 'platform' | 'day' | 'none'
}

export interface FinancialReportResponse {
  period: { start: string; end: string }
  summary: {
    total_orders: number
    gross_revenue: number
    total_commissions: number
    total_fees: number
    your_payout: number
  }
  by_platform: Record<PlatformType, {
    orders: number
    gross_revenue: number
    commission: number
    fees: number
    payout: number
  }>
}

// ── Helper Types ────────────────────────────────────────────

export interface WebhookSignatureConfig {
  platform: PlatformType
  algorithm: 'hmac-sha256' | 'rsa-sha256' | 'custom'
  headerName: string // e.g., 'X-Uber-Delivery-Signature'
  secret?: string
  publicKey?: string
}

export interface IntegrationMetadata {
  [key: string]: any
  // Platform-specific data
  uber_eats_restaurant_uuid?: string
  doordash_merchant_id?: string
  grubhub_restaurant_id?: string
  just_eat_restaurant_id?: string
  swiggy_store_id?: string
  grab_store_id?: string
}

export interface SyncState {
  last_sync_timestamp: string
  items_count: number
  success_count: number
  error_count: number
  status: 'idle' | 'syncing' | 'error' | 'success'
  error_message?: string
}
