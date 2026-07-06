-- Receivables & Payables tracking for CFO dashboard
CREATE TABLE IF NOT EXISTS public.cfo_receivables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('receivable', 'payable')),
  counterparty text NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  due_date date NOT NULL,
  days_overdue int DEFAULT 0,
  status text CHECK (status IN ('current', 'overdue_30', 'overdue_60', 'overdue_90')) DEFAULT 'current',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.cfo_receivables ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own receivables" ON public.cfo_receivables;
CREATE POLICY "Users can manage their own receivables"
  ON public.cfo_receivables
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_cfo_receivables_user ON public.cfo_receivables(user_id);
CREATE INDEX IF NOT EXISTS idx_cfo_receivables_type ON public.cfo_receivables(user_id, type);
