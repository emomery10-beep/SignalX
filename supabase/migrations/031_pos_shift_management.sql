-- Phase 6: Shift Management & Cash Reconciliation
-- Tracks cashier shifts, cash balances, and variances

CREATE TABLE IF NOT EXISTS pos_shifts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  location_id uuid NOT NULL REFERENCES pos_locations(id) ON DELETE CASCADE,

  -- Shift identification
  cashier_id VARCHAR(50) NOT NULL, -- Employee ID or name
  opened_by uuid, -- Manager or owner who opened
  closed_by uuid, -- Manager or owner who closed

  -- Cash tracking
  opening_balance DECIMAL(12, 2), -- Cash handed to cashier
  closing_balance DECIMAL(12, 2), -- Actual cash count at end
  expected_balance DECIMAL(12, 2), -- calculated from opening + transactions

  -- Variance tracking
  variance_amount DECIMAL(12, 2), -- closing - expected
  variance_reason VARCHAR(255), -- 'customer_refund', 'register_error', 'rounding', 'under_investigation'
  status VARCHAR(50) DEFAULT 'open', -- 'open', 'reconciled', 'reconciled_with_variance', 'disputed'

  -- Timestamps
  opened_at TIMESTAMP WITH TIME ZONE NOT NULL,
  closed_at TIMESTAMP WITH TIME ZONE,

  -- Metadata
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Shift audit log for tracking changes
CREATE TABLE IF NOT EXISTS pos_shift_audit_log (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  shift_id uuid NOT NULL REFERENCES pos_shifts(id) ON DELETE CASCADE,

  event VARCHAR(100) NOT NULL, -- 'shift_opened', 'shift_closed', 'variance_reviewed', 'adjustment_made'
  details_json JSONB, -- { opening_balance, closing_balance, variance_reason, etc. }
  performed_by uuid, -- Manager who performed action
  logged_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Extended pos_transactions for shift tracking
ALTER TABLE pos_transactions ADD COLUMN IF NOT EXISTS shift_id uuid REFERENCES pos_shifts(id) ON DELETE SET NULL;
ALTER TABLE pos_transactions ADD COLUMN IF NOT EXISTS pos_location_id uuid REFERENCES pos_locations(id) ON DELETE SET NULL;

-- Create indices for shift queries
CREATE INDEX IF NOT EXISTS idx_shifts_owner ON pos_shifts(owner_id);
CREATE INDEX IF NOT EXISTS idx_shifts_cashier ON pos_shifts(owner_id, cashier_id);
CREATE INDEX IF NOT EXISTS idx_shifts_location ON pos_shifts(location_id);
CREATE INDEX IF NOT EXISTS idx_shifts_status ON pos_shifts(owner_id, status);
CREATE INDEX IF NOT EXISTS idx_shifts_dates ON pos_shifts(owner_id, opened_at, closed_at);
CREATE INDEX IF NOT EXISTS idx_shift_audit_shift_id ON pos_shift_audit_log(shift_id);
CREATE INDEX IF NOT EXISTS idx_transactions_shift_id ON pos_transactions(shift_id);

-- Add function to auto-update updated_at for shifts
CREATE OR REPLACE FUNCTION update_pos_shifts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_pos_shifts_updated_at_trigger
BEFORE UPDATE ON pos_shifts
FOR EACH ROW
EXECUTE FUNCTION update_pos_shifts_updated_at();

-- Enable RLS
ALTER TABLE pos_shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos_shift_audit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can only view their own shifts"
ON pos_shifts FOR SELECT
USING (owner_id = auth.uid());

CREATE POLICY "Users can only modify their own shifts"
ON pos_shifts FOR UPDATE
USING (owner_id = auth.uid());

CREATE POLICY "Users can only insert their own shifts"
ON pos_shifts FOR INSERT
WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can only view their own shift audit logs"
ON pos_shift_audit_log FOR SELECT
USING (owner_id = auth.uid());

-- View for shift performance analytics
CREATE OR REPLACE VIEW shift_performance_summary AS
SELECT
  s.owner_id,
  s.cashier_id,
  COUNT(*) as total_shifts,
  AVG(EXTRACT(EPOCH FROM (s.closed_at - s.opened_at)) / 3600) as avg_shift_duration_hours,
  SUM(CASE WHEN s.variance_amount IS NOT NULL THEN 1 ELSE 0 END) as shifts_with_variance,
  AVG(ABS(COALESCE(s.variance_amount, 0))) as avg_variance_amount,
  MAX(ABS(COALESCE(s.variance_amount, 0))) as max_variance_amount,
  COUNT(*) FILTER (WHERE s.status = 'reconciled') as perfect_reconciliations,
  ROUND(COUNT(*) FILTER (WHERE s.status = 'reconciled')::NUMERIC / NULLIF(COUNT(*), 0) * 100, 2) as reconciliation_rate
FROM pos_shifts s
GROUP BY s.owner_id, s.cashier_id;

-- Grant access to view
GRANT SELECT ON shift_performance_summary TO anon, authenticated;
