// Catalogue-backed translation lookup for the POS app, with graceful fallback:
//   requested locale → English → the key itself.
// Keys are "<namespace>.<path>" mapping to locales/<loc>/<ns>.json.
// Add a namespace: create its JSON per locale + register it in CATALOG below.
import type { Lang } from './i18n'

import enCommon from '@/locales/en/common.json'
import enSell from '@/locales/en/sell.json'
import enDashboard from '@/locales/en/dashboard.json'
import enInventory from '@/locales/en/inventory.json'
import enPos from '@/locales/en/pos.json'
import enLogistics from '@/locales/en/logistics.json'
import enFactory from '@/locales/en/factory.json'
import enSalonClients from '@/locales/en/salon_clients.json'
import enFactoryCapture from '@/locales/en/factory_capture.json'
import enFactoryShift from '@/locales/en/factory_shift.json'
import enLogisticsIntake from '@/locales/en/logistics_intake.json'
import enLogisticsDashboard from '@/locales/en/logistics_dashboard.json'
import enRestaurantDeliveries from '@/locales/en/restaurant_deliveries.json'
import enFactoryWaybill from '@/locales/en/factory_waybill.json'
import enRepairIntake from '@/locales/en/repair_intake.json'
import enFactoryBatch from '@/locales/en/factory_batch.json'
import enFactoryDowntime from '@/locales/en/factory_downtime.json'
import enFactoryStaff from '@/locales/en/factory_staff.json'
import enRestaurantWaste from '@/locales/en/restaurant_waste.json'
import enRepair from '@/locales/en/repair.json'
import enRetailProducts from '@/locales/en/retail_products.json'
import enFactoryQuality from '@/locales/en/factory_quality.json'
import enRestaurantOrders from '@/locales/en/restaurant_orders.json'
import enRestaurantFloor from '@/locales/en/restaurant_floor.json'
import enLogisticsDispatch from '@/locales/en/logistics_dispatch.json'
import enRestaurantOnlineOrders from '@/locales/en/restaurant_online_orders.json'
import enRetailCustomers from '@/locales/en/retail_customers.json'
import enRestaurantMenu from '@/locales/en/restaurant_menu.json'
import enRestaurant from '@/locales/en/restaurant.json'
import enRetailStocktake from '@/locales/en/retail_stocktake.json'
import enRepairTickets from '@/locales/en/repair_tickets.json'
import enSalonBookings from '@/locales/en/salon_bookings.json'
import enIntelligence from '@/locales/en/intelligence.json'
import enRestaurantReservations from '@/locales/en/restaurant_reservations.json'
import enSalonProducts from '@/locales/en/salon_products.json'
import enLogisticsCollect from '@/locales/en/logistics_collect.json'
import enRestaurantLabor from '@/locales/en/restaurant_labor.json'
import enFactoryProduction from '@/locales/en/factory_production.json'
import enRestaurantKitchen from '@/locales/en/restaurant_kitchen.json'
import enRestaurantStaff from '@/locales/en/restaurant_staff.json'
import enFactoryApprovals from '@/locales/en/factory_approvals.json'
import enRetail from '@/locales/en/retail.json'
import enSalon from '@/locales/en/salon.json'
import enRepairParts from '@/locales/en/repair_parts.json'
import enPosLogin from '@/locales/en/pos_login.json'
import enPosBilling from '@/locales/en/pos_billing.json'
import enPosPaymentSuccess from '@/locales/en/pos_payment_success.json'

type Dict = Record<string, unknown>

// English-only for now — translation gated on API credits. The resolver falls
// back to English for locales lacking a namespace, so pages render correctly.
const CATALOG: Record<string, Record<string, Dict>> = {
  en: { common: enCommon, sell: enSell, dashboard: enDashboard, inventory: enInventory, pos: enPos, logistics: enLogistics, factory: enFactory, salon_clients: enSalonClients, factory_capture: enFactoryCapture, factory_shift: enFactoryShift, logistics_intake: enLogisticsIntake, logistics_dashboard: enLogisticsDashboard, restaurant_deliveries: enRestaurantDeliveries, factory_waybill: enFactoryWaybill, repair_intake: enRepairIntake, factory_batch: enFactoryBatch, factory_downtime: enFactoryDowntime, factory_staff: enFactoryStaff, restaurant_waste: enRestaurantWaste, repair: enRepair, retail_products: enRetailProducts, factory_quality: enFactoryQuality, restaurant_orders: enRestaurantOrders, restaurant_floor: enRestaurantFloor, logistics_dispatch: enLogisticsDispatch, restaurant_online_orders: enRestaurantOnlineOrders, retail_customers: enRetailCustomers, restaurant_menu: enRestaurantMenu, restaurant: enRestaurant, retail_stocktake: enRetailStocktake, repair_tickets: enRepairTickets, salon_bookings: enSalonBookings, intelligence: enIntelligence, restaurant_reservations: enRestaurantReservations, salon_products: enSalonProducts, logistics_collect: enLogisticsCollect, restaurant_labor: enRestaurantLabor, factory_production: enFactoryProduction, restaurant_kitchen: enRestaurantKitchen, restaurant_staff: enRestaurantStaff, factory_approvals: enFactoryApprovals, retail: enRetail, salon: enSalon, repair_parts: enRepairParts, pos_login: enPosLogin, pos_billing: enPosBilling, pos_payment_success: enPosPaymentSuccess },
}

const BASE = 'en'

function resolve(locale: string, key: string): string | undefined {
  const dot = key.indexOf('.')
  if (dot === -1) return undefined
  const ns = key.slice(0, dot)
  const path = key.slice(dot + 1)
  const dict = CATALOG[locale]?.[ns]
  if (!dict) return undefined
  let node: unknown = dict
  for (const seg of path.split('.')) {
    if (node && typeof node === 'object' && seg in (node as Dict)) node = (node as Dict)[seg]
    else return undefined
  }
  return typeof node === 'string' ? node : undefined
}

export function t(locale: string, key: string, vars?: Record<string, string | number>): string {
  let s = resolve(locale, key) ?? resolve(BASE, key) ?? key
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.split(`{${k}}`).join(String(v))
  return s
}

export type { Lang }
