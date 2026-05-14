-- AI Intelligence & Notifications
-- Stores analysis results, intelligence logs, and notification history

CREATE TABLE IF NOT EXISTS pos_intelligence_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Analysis type and scope
  analysis_type VARCHAR(50) NOT NULL, -- 'sales', 'cash', 'inventory', 'tax', 'all'
  analysis_date TIMESTAMP WITH TIME ZONE NOT NULL,
  period_days INTEGER,

  -- Analysis data and findings
  analysis_data_json JSONB, -- Original data analyzed
  findings_json JSONB, -- Parsed anomalies and insights
  raw_analysis TEXT, -- Full Claude AI response

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  indexed_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS pos_notification_settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,

  -- WhatsApp settings
  whatsapp_enabled BOOLEAN DEFAULT true,
  whatsapp_phone VARCHAR(20),
  whatsapp_account_sid VARCHAR(255), -- Twilio account

  -- Email settings
  email_enabled BOOLEAN DEFAULT true,
  email_address VARCHAR(255),
  email_provider VARCHAR(50) DEFAULT 'sendgrid', -- 'sendgrid', 'smtp', 'aws_ses'

  -- Alert preferences
  inventory_alerts_enabled BOOLEAN DEFAULT true,
  inventory_alert_threshold INTEGER DEFAULT 5, -- Alert when qty drops below this
  sales_anomaly_alerts_enabled BOOLEAN DEFAULT true,
  sales_anomaly_threshold_percent DECIMAL(5, 2) DEFAULT 25, -- Alert if daily sales vary > 25%
  cash_variance_alerts_enabled BOOLEAN DEFAULT true,
  cash_variance_threshold_amount DECIMAL(10, 2) DEFAULT 500, -- £5
  tax_reminder_alerts_enabled BOOLEAN DEFAULT true,
  tax_reminder_days_before INTEGER DEFAULT 7, -- Remind 7 days before deadline

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pos_notification_log (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  notification_type VARCHAR(50) NOT NULL, -- 'inventory_alert', 'sales_anomaly', 'cash_variance', 'tax_reminder', 'payment_failed'
  status VARCHAR(50) NOT NULL, -- 'sent_whatsapp', 'sent_email', 'sent_both', 'failed', 'pending'

  recipient_phone VARCHAR(20),
  recipient_email VARCHAR(255),

  message TEXT,
  methods_used_json JSONB, -- ['whatsapp', 'email']

  sent_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  read_at TIMESTAMP WITH TIME ZONE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indices
CREATE INDEX IF NOT EXISTS idx_intelligence_logs_owner ON pos_intelligence_logs(owner_id);
CREATE INDEX IF NOT EXISTS idx_intelligence_logs_date ON pos_intelligence_logs(owner_id, analysis_date);
CREATE INDEX IF NOT EXISTS idx_intelligence_logs_type ON pos_intelligence_logs(owner_id, analysis_type);
CREATE INDEX IF NOT EXISTS idx_notification_log_owner ON pos_notification_log(owner_id);
CREATE INDEX IF NOT EXISTS idx_notification_log_status ON pos_notification_log(owner_id, status);
CREATE INDEX IF NOT EXISTS idx_notification_log_type ON pos_notification_log(owner_id, notification_type);

-- Add function to auto-update updated_at for notification settings
CREATE OR REPLACE FUNCTION update_pos_notification_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_pos_notification_settings_updated_at_trigger
BEFORE UPDATE ON pos_notification_settings
FOR EACH ROW
EXECUTE FUNCTION update_pos_notification_settings_updated_at();

-- Enable RLS
ALTER TABLE pos_intelligence_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos_notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos_notification_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can only view their own intelligence logs"
ON pos_intelligence_logs FOR SELECT
USING (owner_id = auth.uid());

CREATE POLICY "Users can only view their own notification settings"
ON pos_notification_settings FOR SELECT
USING (owner_id = auth.uid());

CREATE POLICY "Users can only modify their own notification settings"
ON pos_notification_settings FOR UPDATE
USING (owner_id = auth.uid());

CREATE POLICY "Users can only view their own notification logs"
ON pos_notification_log FOR SELECT
USING (owner_id = auth.uid());

-- View for recent anomalies
CREATE OR REPLACE VIEW recent_anomalies AS
SELECT
  il.owner_id,
  il.analysis_date,
  il.analysis_type,
  il.period_days,
  jsonb_array_elements(il.findings_json) as anomaly,
  il.raw_analysis
FROM pos_intelligence_logs il
ORDER BY il.analysis_date DESC
LIMIT 100;

GRANT SELECT ON recent_anomalies TO anon, authenticated;
