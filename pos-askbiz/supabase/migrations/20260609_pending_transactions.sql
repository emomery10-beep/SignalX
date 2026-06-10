-- Allow 'pending' and 'void' transaction statuses
-- 'pending' = card/mobile payment initiated but not yet confirmed
-- 'void'    = payment was abandoned or failed, transaction nullified

ALTER TABLE pos_transactions
  DROP CONSTRAINT IF EXISTS pos_transactions_status_check;

ALTER TABLE pos_transactions
  ADD CONSTRAINT pos_transactions_status_check
  CHECK (status IN ('pending', 'completed', 'refunded', 'partially_refunded', 'amended', 'void'));
