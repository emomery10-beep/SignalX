-- WhatsApp Autopilot Rules
CREATE TABLE IF NOT EXISTS whatsapp_autopilot_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  trigger TEXT NOT NULL,
  message_template TEXT NOT NULL,
  enabled BOOLEAN DEFAULT FALSE,
  conditions JSONB DEFAULT '{}',
  fire_count INT DEFAULT 0,
  last_fired_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_autopilot_owner ON whatsapp_autopilot_rules(owner_id);
CREATE INDEX IF NOT EXISTS idx_autopilot_trigger ON whatsapp_autopilot_rules(trigger, enabled);

ALTER TABLE whatsapp_autopilot_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners manage their autopilot rules"
  ON whatsapp_autopilot_rules FOR ALL
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);
