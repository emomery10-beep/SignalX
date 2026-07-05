// Shared types for the Purchase Orders / Supplier Orders feature.
// Mirrors 20260705000001_purchase_orders.sql. Consumed by the POS tab UI
// and the /api/pos/purchase-orders + /api/pos/suppliers routes.

export type PurchaseOrderStatus =
  | "draft"
  | "ordered"
  | "partial"
  | "received"
  | "cancelled";

export interface Supplier {
  id: string;
  owner_id: string;
  name: string;
  phone: string | null;
  email: string | null;
  lead_time_days: number | null;
  notes: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PurchaseOrderItem {
  id: string;
  po_id: string;
  inventory_id: string | null;
  name: string;
  qty_ordered: number;
  qty_received: number;
  unit_cost: number;
  line_total: number;
  created_at: string;
}

export interface PurchaseOrder {
  id: string;
  owner_id: string;
  supplier_id: string | null;
  status: PurchaseOrderStatus;
  total_cost: number;
  notes: string | null;
  expected_at: string | null;
  sent_at: string | null;
  received_at: string | null;
  created_by: string | null;
  client_tx_id: string | null;
  created_at: string;
  updated_at: string;
}

// Convenience shapes for API responses that join related rows.
export interface PurchaseOrderWithItems extends PurchaseOrder {
  items: PurchaseOrderItem[];
  supplier: Supplier | null;
}

// A line item still owed by the supplier (qty_ordered > qty_received).
export interface BackorderLine extends PurchaseOrderItem {
  qty_outstanding: number;
}
