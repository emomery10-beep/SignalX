-- Track real Anthropic API token usage per call
CREATE TABLE IF NOT EXISTS api_usage (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at  timestamptz DEFAULT now(),
  route       text NOT NULL,
  user_id     uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  model       text NOT NULL,
  input_tokens  integer NOT NULL DEFAULT 0,
  output_tokens integer NOT NULL DEFAULT 0,
  cost_usd    numeric(10,6) NOT NULL DEFAULT 0
);

-- Admin reads all rows; users can't access this table
ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_all" ON api_usage
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Index for monthly cost queries
CREATE INDEX idx_api_usage_created_at ON api_usage (created_at DESC);
CREATE INDEX idx_api_usage_route ON api_usage (route);
