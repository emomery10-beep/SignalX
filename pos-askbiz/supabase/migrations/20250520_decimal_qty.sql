-- ============================================================
-- Migration: Allow decimal quantities for weighted items
-- Changes stock_qty and pos_items.qty from int to numeric(10,3)
-- so kg/litre items like "0.35 kg cumin" work correctly.
-- ============================================================

-- 1. inventory.stock_qty: int → numeric(10,3)
ALTER TABLE public.inventory
  ALTER COLUMN stock_qty          TYPE numeric(10,3) USING stock_qty::numeric,
  ALTER COLUMN low_stock_threshold TYPE numeric(10,3) USING low_stock_threshold::numeric;

-- 2. pos_items.qty: int → numeric(10,3)
ALTER TABLE public.pos_items
  ALTER COLUMN qty TYPE numeric(10,3) USING qty::numeric;

-- 3. Re-create the stock-deduct trigger function with numeric-safe arithmetic
--    (the arithmetic already works; just ensures the function signature is happy)
CREATE OR REPLACE FUNCTION public.deduct_stock_on_sale_fn()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE public.inventory
     SET stock_qty    = GREATEST(stock_qty - NEW.qty, 0),
         last_sold_at = now()
   WHERE id       = NEW.inventory_id
     AND owner_id = (
           SELECT owner_id FROM public.pos_transactions
            WHERE id = NEW.transaction_id
         );
  RETURN NEW;
END;
$$;

-- 4. Re-create the stock-restore trigger function
CREATE OR REPLACE FUNCTION public.restore_stock_on_refund_fn()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF NEW.refunded = true AND OLD.refunded = false AND NEW.inventory_id IS NOT NULL THEN
    UPDATE public.inventory
       SET stock_qty = stock_qty + NEW.qty
     WHERE id = NEW.inventory_id;
  END IF;
  RETURN NEW;
END;
$$;

-- Note: increment_inventory_stock / decrement_inventory_stock RPCs use
-- their own p_qty parameter — those will accept numeric automatically
-- because PostgreSQL widens int to numeric in arithmetic. No change needed.
