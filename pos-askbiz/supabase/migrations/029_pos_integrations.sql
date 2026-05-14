-- Phase 3: Regulatory Reporting & Accounting Integrations
-- Stores OAuth credentials, sync status, and integration logs

CREATE TABLE IF NOT EXISTS pos_integrations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Provider identification
  provider VARCHAR(50) NOT NULL, -- 'xero', 'quickbooks', 'stripe', 'shopify'

  -- OAuth and credentials
  credentials_json JSONB, -- { access_token, refresh_token, tenant_id, expires_at }
  is_active BOOLEAN DEFAULT false,

  -- Sync tracking
  connected_at TIMESTAMP WITH TIME ZONE,
  disconnected_at TIMESTAMP WITH TIME ZONE,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  next_sync_scheduled_at TIMESTAMP WITH TIME ZONE,
  sync_frequency_minutes INTEGER DEFAULT 1440, -- Default daily (1440 mins)

  -- Error tracking
  error_log_json JSONB, -- Array of { timestamp, error, transaction_ids }
  last_error TEXT,
  error_count INTEGER DEFAULT 0,

  -- Metadata
  webhook_url TEXT, -- For webhooks from external services
  webhook_secret TEXT, -- Stored encrypted
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

  CONSTRAINT unique_provider_per_owner UNIQUE (owner_id, provider)
);

-- Extended pos_transactions for integration tracking
ALTER TABLE pos_transactions ADD COLUMN IF NOT EXISTS synced_to_xero BOOLEAN DEFAULT false;
ALTER TABLE pos_transactions ADD COLUMN IF NOT EXISTS xero_invoice_id VARCHAR(255);
ALTER TABLE pos_transactions ADD COLUMN IF NOT EXISTS synced_to_quickbooks BOOLEAN DEFAULT false;
ALTER TABLE pos_transactions ADD COLUMN IF NOT EXISTS qbo_invoice_id VARCHAR(255);
ALTER TABLE pos_transactions ADD COLUMN IF NOT EXISTS synced_at TIMESTAMP WITH TIME ZONE;

-- Create indices for integration queries
CREATE INDEX IF NOT EXISTS idx_integrations_owner ON pos_integrations(owner_id);
CREATE INDEX IF NOT EXISTS idx_integrations_provider ON pos_integrations(provider);
CREATE INDEX IF NOT EXISTS idx_integrations_active ON pos_integrations(owner_id, is_active);
CREATE INDEX IF NOT EXISTS idx_transactions_synced_xero ON pos_transactions(owner_id, synced_to_xero);
CREATE INDEX IF NOT EXISTS idx_transactions_synced_qbo ON pos_transactions(owner_id, synced_to_quickbooks);

-- Add function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_pos_integrations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_pos_integrations_updated_at_trigger
BEFORE UPDATE ON pos_integrations
FOR EACH ROW
EXECUTE FUNCTION update_pos_integrations_updated_at();

-- Extend pos_locations for multi-location tax reporting
ALTER TABLE pos_locations ADD COLUMN IF NOT EXISTS tax_settings_id uuid;
ALTER TABLE pos_locations ADD COLUMN IF NOT EXISTS tax_jurisdiction VARCHAR(50);
ALTER TABLE pos_locations ADD COLUMN IF NOT EXISTS tax_id VARCHAR(100); -- VAT number, EIN, etc.
ALTER TABLE pos_locations ADD COLUMN IF NOT EXISTS business_type VARCHAR(50); -- 'retail', 'restaurant', 'service', 'digital'

CREATE INDEX IF NOT EXISTS idx_locations_jurisdiction ON pos_locations(owner_id, tax_jurisdiction);

-- Create table for tax filing history
CREATE TABLE IF NOT EXISTS pos_tax_filings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  jurisdiction VARCHAR(50) NOT NULL,
  filing_period_start DATE NOT NULL,
  filing_period_end DATE NOT NULL,

  -- Filing details
  total_turnover DECIMAL(12, 2),
  total_tax_due DECIMAL(12, 2),
  tax_paid DECIMAL(12, 2),
  net_due DECIMAL(12, 2),

  -- Filing status
  status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'submitted', 'accepted', 'rejected'
  submitted_at TIMESTAMP WITH TIME ZONE,
  submitted_to VARCHAR(100), -- 'hmrc', 'irs', 'local_authority'
  filing_reference VARCHAR(255), -- HMRC reference number, etc.

  -- JSON snapshot of what was filed
  filing_data_json JSONB,

  -- Audit trail
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

  CONSTRAINT unique_filing_per_period UNIQUE (owner_id, jurisdiction, filing_period_start, filing_period_end)
);

CREATE INDEX IF NOT EXISTS idx_tax_filings_owner ON pos_tax_filings(owner_id);
CREATE INDEX IF NOT EXISTS idx_tax_filings_status ON pos_tax_filings(owner_id, status);
CREATE INDEX IF NOT EXISTS idx_tax_filings_jurisdiction ON pos_tax_filings(owner_id, jurisdiction);

-- Create table for transaction line-level tax tracking
CREATE TABLE IF NOT EXISTS pos_transaction_line_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_id uuid NOT NULL REFERENCES pos_transactions(id) ON DELETE CASCADE,

  name VARCHAR(255) NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL,
  unit_price DECIMAL(12, 2) NOT NULL,
  tax_code VARCHAR(50),
  tax_rate DECIMAL(5, 2),
  tax_amount DECIMAL(12, 2),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_transaction_line_items_tx ON pos_transaction_line_items(transaction_id);

-- Grant RLS policies
ALTER TABLE pos_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos_tax_filings ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos_transaction_line_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only view their own integrations"
ON pos_integrations FOR SELECT
USING (owner_id = auth.uid());

CREATE POLICY "Users can only modify their own integrations"
ON pos_integrations FOR UPDATE
USING (owner_id = auth.uid());

CREATE POLICY "Users can only insert their own integrations"
ON pos_integrations FOR INSERT
WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can only view their own tax filings"
ON pos_tax_filings FOR SELECT
USING (owner_id = auth.uid());

CREATE POLICY "Users can only view transaction line items for their own transactions"
ON pos_transaction_line_items FOR SELECT
USING (transaction_id IN (
  SELECT id FROM pos_transactions WHERE owner_id = auth.uid()
));
