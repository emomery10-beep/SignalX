CREATE TABLE IF NOT EXISTS mpesa_payments (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         uuid NOT NULL REFERENCES auth.users(id),
  checkout_request_id text NOT NULL UNIQUE,
  merchant_request_id text,
  phone           text NOT NULL,
  amount          integer NOT NULL,
  plan            text NOT NULL,
  status          text NOT NULL DEFAULT 'pending',
  mpesa_receipt   text,
  result_desc     text,
  completed_at    timestamptz,
  created_at      timestamptz DEFAULT now()
);

CREATE INDEX idx_mpesa_checkout ON mpesa_payments(checkout_request_id);
CREATE INDEX idx_mpesa_user     ON mpesa_payments(user_id);

ALTER TABLE mpesa_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own mpesa payments"
  ON mpesa_payments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own mpesa payments"
  ON mpesa_payments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role full access on mpesa_payments"
  ON mpesa_payments FOR ALL
  USING (auth.role() = 'service_role');
