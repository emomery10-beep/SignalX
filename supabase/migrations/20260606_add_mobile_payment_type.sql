-- Add 'mpesa' and 'mobile' to pos_transactions payment_type check constraint
-- Previous constraint: ('cash', 'card', 'other')
-- New constraint: ('cash', 'card', 'mobile', 'mpesa', 'other')
-- Note: sell page inserts 'mpesa' for M-Pesa mobile payments

ALTER TABLE pos_transactions
  DROP CONSTRAINT IF EXISTS pos_transactions_payment_type_check;

ALTER TABLE pos_transactions
  ADD CONSTRAINT pos_transactions_payment_type_check
  CHECK (payment_type IN ('cash', 'card', 'mobile', 'mpesa', 'other'));
