-- ============================================================
-- Restaurant Third-Party Platform Integrations
-- Integrates Uber Eats, DoorDash, Grubhub, and regional platforms
-- ============================================================

-- ── 1. Platform Integrations Table ──────────────────────────
-- Stores connection credentials for third-party platforms
CREATE TABLE IF NOT EXISTS public.pos_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Restaurant owner & location
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  location_id UUID NOT NULL REFERENCES pos_locations(id) ON DELETE CASCADE,

  -- Platform identity
  platform TEXT NOT NULL CHECK (platform IN ('uber_eats', 'doordash', 'grubhub', 'just_eat', 'swiggy', 'grab', 'meituan', 'other')),
  name TEXT NOT NULL, -- e.g., "Uber Eats - Main Location"

  -- API credentials (encrypted at rest)
  api_key TEXT NOT NULL, -- PGP encrypted via Supabase Vault
  api_secret TEXT, -- Some platforms use secret too (encrypted)
  webhook_secret TEXT, -- For validating incoming webhook signatures (encrypted)

  -- OAuth tokens (for platforms using OAuth flow)
  oauth_token TEXT, -- Encrypted
  oauth_refresh_token TEXT, -- Encrypted
  oauth_expires_at TIMESTAMP WITH TIME ZONE,

  -- Configuration
  active BOOLEAN NOT NULL DEFAULT true,
  commission_rate DECIMAL(5, 2) NOT NULL DEFAULT 15.00, -- % commission charged by platform

  -- Status tracking
  connected_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  last_sync_at TIMESTAMP WITH TIME ZONE,
  last_menu_sync_at TIMESTAMP WITH TIME ZONE,
  last_webhook_received_at TIMESTAMP WITH TIME ZONE,

  -- Metadata
  metadata JSONB, -- Platform-specific config, e.g., restaurant_id on their system
  sync_enabled BOOLEAN NOT NULL DEFAULT true,

  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

  UNIQUE(owner_id, location_id, platform)
);

-- ⚠️ SCHEMA NAME COLLISION — NEEDS A PRODUCT DECISION ⚠️
-- Migration 029_pos_integrations already created a DIFFERENT public.pos_integrations
-- (accounting providers: xero/quickbooks/stripe, columns provider/credentials_json/
-- is_active). This migration reuses the same table name for restaurant delivery
-- platforms (uber_eats/doordash…), so the CREATE TABLE IF NOT EXISTS above no-ops on
-- a clean replay and these columns never land — the indexes/policies below then fail.
-- Replay-safety: add the restaurant columns idempotently so pos_integrations becomes
-- a (nullable) superset of both feature sets. This makes migrations replayable and
-- types generate, but the two features sharing one table is a real design conflict
-- that should be resolved (likely a separate pos_delivery_integrations table).
alter table public.pos_integrations add column if not exists location_id uuid references public.pos_locations(id) on delete cascade;
alter table public.pos_integrations add column if not exists platform text;
alter table public.pos_integrations add column if not exists name text;
alter table public.pos_integrations add column if not exists api_key text;
alter table public.pos_integrations add column if not exists api_secret text;
alter table public.pos_integrations add column if not exists webhook_secret text;
alter table public.pos_integrations add column if not exists oauth_token text;
alter table public.pos_integrations add column if not exists oauth_refresh_token text;
alter table public.pos_integrations add column if not exists oauth_expires_at timestamptz;
alter table public.pos_integrations add column if not exists active boolean default true;
alter table public.pos_integrations add column if not exists commission_rate decimal(5,2) default 15.00;
alter table public.pos_integrations add column if not exists last_menu_sync_at timestamptz;
alter table public.pos_integrations add column if not exists last_webhook_received_at timestamptz;
alter table public.pos_integrations add column if not exists metadata jsonb;
alter table public.pos_integrations add column if not exists sync_enabled boolean default true;

CREATE INDEX IF NOT EXISTS idx_integrations_owner ON public.pos_integrations(owner_id);
CREATE INDEX IF NOT EXISTS idx_integrations_location ON public.pos_integrations(location_id);
CREATE INDEX IF NOT EXISTS idx_integrations_platform ON public.pos_integrations(platform);
CREATE INDEX IF NOT EXISTS idx_integrations_active ON public.pos_integrations(active);

-- ── 2. Order Financials Table ──────────────────────────────
-- Tracks financial breakdown for each platform order
CREATE TABLE IF NOT EXISTS public.pos_order_financials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  location_id UUID NOT NULL REFERENCES pos_locations(id) ON DELETE CASCADE,
  -- FK dropped: pos_orders is never created by any migration (the orders table is
  -- pos_transactions). Kept as a plain uuid rather than guessing the target — the
  -- intended relationship needs clarification before re-adding a foreign key.
  order_id UUID NOT NULL,

  integration_id UUID NOT NULL REFERENCES pos_integrations(id) ON DELETE SET NULL,

  -- Platform order ID (external reference)
  platform_order_id TEXT NOT NULL,
  platform TEXT NOT NULL, -- Denormalized for quick filtering

  -- Financial breakdown
  gross_total DECIMAL(10, 2) NOT NULL, -- Total order value
  subtotal DECIMAL(10, 2) NOT NULL,
  tax DECIMAL(10, 2) NOT NULL DEFAULT 0.00,

  -- Fees
  platform_fee DECIMAL(10, 2) NOT NULL DEFAULT 0.00, -- Fixed platform fee
  service_fee DECIMAL(10, 2) NOT NULL DEFAULT 0.00, -- % service charge
  delivery_fee DECIMAL(10, 2) NOT NULL DEFAULT 0.00, -- Delivery partner cut

  -- Commission
  commission_percent DECIMAL(5, 2) NOT NULL, -- % charged by platform
  commission_amount DECIMAL(10, 2) NOT NULL GENERATED ALWAYS AS (gross_total * commission_percent / 100) STORED,

  -- Customer payments
  customer_tip DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  customer_tip_after_fee DECIMAL(10, 2), -- Some platforms take fee from tip

  -- Your payout — a generated column may not reference another generated column
  -- (commission_amount), so inline its definition (gross_total * commission_percent
  -- / 100). Identical result, but uses only base columns.
  your_payout DECIMAL(10, 2) NOT NULL GENERATED ALWAYS AS (
    gross_total - platform_fee - service_fee - delivery_fee - (gross_total * commission_percent / 100)
  ) STORED,

  -- Reconciliation
  platform_settlement_id TEXT, -- Reference to platform's settlement batch
  reconciled BOOLEAN NOT NULL DEFAULT false,
  reconciled_at TIMESTAMP WITH TIME ZONE,

  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_financials_owner ON public.pos_order_financials(owner_id);
CREATE INDEX IF NOT EXISTS idx_order_financials_location ON public.pos_order_financials(location_id);
CREATE INDEX IF NOT EXISTS idx_order_financials_order ON public.pos_order_financials(order_id);
CREATE INDEX IF NOT EXISTS idx_order_financials_integration ON public.pos_order_financials(integration_id);
CREATE INDEX IF NOT EXISTS idx_order_financials_platform ON public.pos_order_financials(platform);
CREATE INDEX IF NOT EXISTS idx_order_financials_reconciled ON public.pos_order_financials(reconciled);

-- ── 3. Integration Audit Log ────────────────────────────────
-- Logs all API calls, webhook receipts, and sync operations
CREATE TABLE IF NOT EXISTS public.pos_integration_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  integration_id UUID NOT NULL REFERENCES pos_integrations(id) ON DELETE CASCADE,

  -- Operation type
  operation TEXT NOT NULL CHECK (operation IN ('webhook_received', 'menu_sync', 'order_status_update', 'financial_sync', 'api_error')),

  -- Request details
  platform TEXT NOT NULL,
  endpoint TEXT,
  method TEXT, -- GET, POST, PATCH, etc.

  -- Response
  status_code INT,
  success BOOLEAN NOT NULL,
  error_message TEXT,

  -- Payload (stored for debugging)
  request_payload JSONB,
  response_payload JSONB,

  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_integration_audit_owner ON public.pos_integration_audit(owner_id);
CREATE INDEX IF NOT EXISTS idx_integration_audit_integration ON public.pos_integration_audit(integration_id);
CREATE INDEX IF NOT EXISTS idx_integration_audit_operation ON public.pos_integration_audit(operation);
CREATE INDEX IF NOT EXISTS idx_integration_audit_success ON public.pos_integration_audit(success);

-- ── 4. Webhook Queue (for reliable delivery) ────────────────
-- Stores incoming webhooks while processing, retry on failure
CREATE TABLE IF NOT EXISTS public.pos_webhook_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  integration_id UUID NOT NULL REFERENCES pos_integrations(id) ON DELETE CASCADE,

  -- Webhook details
  platform TEXT NOT NULL,
  event_type TEXT NOT NULL, -- e.g., "order.created", "order.status_changed"
  external_id TEXT NOT NULL, -- External order/event ID

  -- Payload
  payload JSONB NOT NULL,
  signature TEXT, -- Webhook signature for verification

  -- Processing
  processed BOOLEAN NOT NULL DEFAULT false,
  processed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  retry_count INT NOT NULL DEFAULT 0,
  next_retry_at TIMESTAMP WITH TIME ZONE,

  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_webhook_queue_owner ON public.pos_webhook_queue(owner_id);
CREATE INDEX IF NOT EXISTS idx_webhook_queue_integration ON public.pos_webhook_queue(integration_id);
CREATE INDEX IF NOT EXISTS idx_webhook_queue_processed ON public.pos_webhook_queue(processed);
CREATE INDEX IF NOT EXISTS idx_webhook_queue_retry ON public.pos_webhook_queue(next_retry_at);

-- ── 5. Menu Sync State (track last sync per platform) ───────
CREATE TABLE IF NOT EXISTS public.pos_menu_sync_state (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  location_id UUID NOT NULL REFERENCES pos_locations(id) ON DELETE CASCADE,
  integration_id UUID NOT NULL REFERENCES pos_integrations(id) ON DELETE CASCADE,

  -- Sync tracking
  last_full_sync_at TIMESTAMP WITH TIME ZONE,
  last_incremental_sync_at TIMESTAMP WITH TIME ZONE,

  -- State
  items_synced_count INT DEFAULT 0,
  items_failed_count INT DEFAULT 0,
  last_error TEXT,

  -- Platform-specific state
  platform_catalog_id TEXT, -- e.g., Uber Eats restaurant catalog ID
  platform_state JSONB, -- Store platform-specific sync state

  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

  UNIQUE(owner_id, location_id, integration_id)
);

CREATE INDEX IF NOT EXISTS idx_menu_sync_state_integration ON public.pos_menu_sync_state(integration_id);

-- ── 6. Row-Level Security (RLS) ────────────────────────────

ALTER TABLE public.pos_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pos_order_financials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pos_integration_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pos_webhook_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pos_menu_sync_state ENABLE ROW LEVEL SECURITY;

-- Integration owners can see/modify their own integrations
CREATE POLICY "integrations_owner_access" ON public.pos_integrations
  FOR ALL
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

-- Order financials visible to restaurant owner
CREATE POLICY "order_financials_owner_access" ON public.pos_order_financials
  FOR ALL
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

-- Audit logs visible to restaurant owner
CREATE POLICY "integration_audit_owner_access" ON public.pos_integration_audit
  FOR ALL
  USING (owner_id = auth.uid());

-- Webhook queue visible to restaurant owner
CREATE POLICY "webhook_queue_owner_access" ON public.pos_webhook_queue
  FOR ALL
  USING (owner_id = auth.uid());

-- Menu sync state visible to restaurant owner
CREATE POLICY "menu_sync_state_owner_access" ON public.pos_menu_sync_state
  FOR ALL
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

-- ── 7. Database Function: Normalize Webhook Timestamp ───────
-- Platforms use different timestamp formats; normalize to ISO 8601
CREATE OR REPLACE FUNCTION public.normalize_timestamp(raw_ts TEXT)
RETURNS TIMESTAMP WITH TIME ZONE AS $$
BEGIN
  -- Try parsing various timestamp formats
  BEGIN
    RETURN TO_TIMESTAMP(raw_ts, 'YYYY-MM-DDTHH24:MI:SSZ')::TIMESTAMP WITH TIME ZONE;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;

  BEGIN
    RETURN TO_TIMESTAMP(raw_ts::BIGINT / 1000)::TIMESTAMP WITH TIME ZONE;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;

  RETURN NOW();
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ── 8. Update Trigger for Updated_at ────────────────────────
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_integrations_updated_at
  BEFORE UPDATE ON public.pos_integrations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_order_financials_updated_at
  BEFORE UPDATE ON public.pos_order_financials
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_webhook_queue_updated_at
  BEFORE UPDATE ON public.pos_webhook_queue
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_menu_sync_state_updated_at
  BEFORE UPDATE ON public.pos_menu_sync_state
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ── 9. Grant Permissions ────────────────────────────────────
GRANT SELECT, INSERT, UPDATE ON public.pos_integrations TO authenticated;
GRANT SELECT, INSERT ON public.pos_order_financials TO authenticated;
GRANT SELECT, INSERT ON public.pos_integration_audit TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.pos_webhook_queue TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.pos_menu_sync_state TO authenticated;

COMMENT ON TABLE public.pos_integrations IS 'Third-party platform connections (Uber Eats, DoorDash, Grubhub, etc.)';
COMMENT ON TABLE public.pos_order_financials IS 'Financial breakdown for orders from platforms, including commissions and fees';
COMMENT ON TABLE public.pos_integration_audit IS 'Audit log for all API calls and webhook events';
COMMENT ON TABLE public.pos_webhook_queue IS 'Queue of incoming webhooks waiting to be processed';
COMMENT ON TABLE public.pos_menu_sync_state IS 'Tracks menu synchronization state per platform';
