-- Phase 4: Payment Processing & PCI DSS Compliance
-- Extends transactions table with payment fields
-- Does NOT store card data (handled by Stripe only)

-- Extended pos_transactions for payment tracking
ALTER TABLE pos_transactions ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'pending'; -- 'pending', 'paid', 'failed', 'refunded'
ALTER TABLE pos_transactions ADD COLUMN IF NOT EXISTS stripe_payment_id VARCHAR(255);
ALTER TABLE pos_transactions ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50); -- 'cash', 'card', 'apple_pay', 'google_pay', 'klarna'
ALTER TABLE pos_transactions ADD COLUMN IF NOT EXISTS paid_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE pos_transactions ADD COLUMN IF NOT EXISTS refund_amount DECIMAL(12, 2);
ALTER TABLE pos_transactions ADD COLUMN IF NOT EXISTS refund_id VARCHAR(255);
ALTER TABLE pos_transactions ADD COLUMN IF NOT EXISTS refund_reason VARCHAR(255);
ALTER TABLE pos_transactions ADD COLUMN IF NOT EXISTS refund_reason_details TEXT;
ALTER TABLE pos_transactions ADD COLUMN IF NOT EXISTS refunded_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE pos_transactions ADD COLUMN IF NOT EXISTS payment_failure_reason TEXT;

-- Table for payment disputes and chargebacks
CREATE TABLE IF NOT EXISTS pos_payment_disputes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  transaction_id uuid NOT NULL REFERENCES pos_transactions(id) ON DELETE CASCADE,

  -- Dispute details
  dispute_id VARCHAR(255) NOT NULL, -- Stripe dispute ID
  reason VARCHAR(100) NOT NULL, -- 'chargeback', 'dispute', 'cancellation'
  amount_disputed DECIMAL(12, 2),
  currency VARCHAR(3),

  -- Timeline
  dispute_created_at TIMESTAMP WITH TIME ZONE,
  evidence_due_at TIMESTAMP WITH TIME ZONE,
  dispute_resolved_at TIMESTAMP WITH TIME ZONE,

  -- Status
  status VARCHAR(50) DEFAULT 'open', -- 'open', 'under_review', 'won', 'lost', 'closed'
  disputed_by_customer_reason TEXT,
  resolution_notes TEXT,

  -- Evidence submitted
  evidence_json JSONB, -- Array of { type, url, description }

  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table for Stripe customer records (for future subscriptions)
CREATE TABLE IF NOT EXISTS pos_stripe_customers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Stripe customer ID (not card data)
  stripe_customer_id VARCHAR(255) NOT NULL UNIQUE,

  -- Reference to POS customer (optional)
  pos_customer_id uuid REFERENCES pos_customers(id) ON DELETE SET NULL,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indices for payment queries
CREATE INDEX IF NOT EXISTS idx_transactions_payment_status ON pos_transactions(owner_id, payment_status);
CREATE INDEX IF NOT EXISTS idx_transactions_stripe_payment_id ON pos_transactions(stripe_payment_id);
CREATE INDEX IF NOT EXISTS idx_transactions_refunded ON pos_transactions(owner_id, refunded_at);
CREATE INDEX IF NOT EXISTS idx_payment_disputes_owner ON pos_payment_disputes(owner_id);
CREATE INDEX IF NOT EXISTS idx_payment_disputes_status ON pos_payment_disputes(owner_id, status);
CREATE INDEX IF NOT EXISTS idx_stripe_customers_owner ON pos_stripe_customers(owner_id);

-- Add function to auto-update updated_at for disputes
CREATE OR REPLACE FUNCTION update_pos_payment_disputes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_pos_payment_disputes_updated_at_trigger
BEFORE UPDATE ON pos_payment_disputes
FOR EACH ROW
EXECUTE FUNCTION update_pos_payment_disputes_updated_at();

-- Add function to auto-update updated_at for Stripe customers
CREATE OR REPLACE FUNCTION update_pos_stripe_customers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_pos_stripe_customers_updated_at_trigger
BEFORE UPDATE ON pos_stripe_customers
FOR EACH ROW
EXECUTE FUNCTION update_pos_stripe_customers_updated_at();

-- Enable RLS
ALTER TABLE pos_payment_disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos_stripe_customers ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can only view their own payment disputes"
ON pos_payment_disputes FOR SELECT
USING (owner_id = auth.uid());

CREATE POLICY "Users can only modify their own payment disputes"
ON pos_payment_disputes FOR UPDATE
USING (owner_id = auth.uid());

CREATE POLICY "Users can only view their own Stripe customers"
ON pos_stripe_customers FOR SELECT
USING (owner_id = auth.uid());

-- PCI DSS Compliance Note:
-- 1. No card data stored in any table
-- 2. All card processing via Stripe (PCI Level 1 certified)
-- 3. Tokenized payment methods only (payment_intent IDs, tokens)
-- 4. SSL/TLS required for all API calls
-- 5. This database and application are NOT directly handling card data
-- 6. Stripe manages PCI compliance; we maintain compliance via:
--    - No card data storage
--    - Secure OAuth for integrations
--    - HTTPS only
--    - Regular security audits
--    - Webhook signature verification
