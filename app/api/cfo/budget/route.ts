import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status })
}

/*
  Supabase table required (run once in SQL editor):

  create table if not exists cfo_budgets (
    user_id uuid primary key references auth.users(id) on delete cascade,
    revenue numeric(14,2) not null default 0,
    cogs numeric(14,2) not null default 0,
    fixed_costs numeric(14,2) not null default 0,
    net_profit numeric(14,2) not null default 0,
    updated_at timestamptz not null default now()
  );

  alter table cfo_budgets enable row level security;

  create policy "Users own their budget"
    on cfo_budgets for all
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

  One row per user (user_id is the primary key) — this is a single monthly
  target, the same shape components/cfo/BudgetVsActual.tsx has always stored
  in localStorage under cfo_budget_v3. That localStorage copy is now just a
  fast local cache; this table is the source of truth so a budget set on one
  device shows up everywhere, including in the exported CFO report. See the
  fetchServerBudget/saveServerBudget helpers in BudgetVsActual.tsx.
*/

const DEFAULT_BUDGET = { revenue: 0, cogs: 0, fixed_costs: 0, net_profit: 0 }

interface BudgetShape { revenue: number; cogs: number; fixed_costs: number; net_profit: number }

// GET — the current user's monthly budget target
export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return json({ error: 'Unauthorised' }, 401)

  const { data, error } = await supabase
    .from('cfo_budgets')
    .select('revenue, cogs, fixed_costs, net_profit, updated_at')
    .eq('user_id', user.id)
    .maybeSingle()

  if (error) {
    // Table may not exist yet — degrade to "no budget set" rather than error,
    // same convention as app/api/cfo/expenses/route.ts.
    if (error.code === '42P01') return json({ budget: DEFAULT_BUDGET, hasBudget: false, note: 'Table not yet created' })
    return json({ error: error.message }, 500)
  }

  if (!data) return json({ budget: DEFAULT_BUDGET, hasBudget: false })

  const budget: BudgetShape = {
    revenue: Number(data.revenue), cogs: Number(data.cogs),
    fixed_costs: Number(data.fixed_costs), net_profit: Number(data.net_profit),
  }
  const hasBudget = Object.values(budget).some(v => v > 0)
  return json({ budget, hasBudget, updated_at: data.updated_at })
}

// PUT — upsert the current user's monthly budget target (full replacement, not a patch)
export async function PUT(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return json({ error: 'Unauthorised' }, 401)

  let body: Partial<BudgetShape>
  try {
    body = await req.json()
  } catch {
    return json({ error: 'Invalid JSON body' }, 400)
  }

  const budget: BudgetShape = {
    revenue: Number(body.revenue) || 0,
    cogs: Number(body.cogs) || 0,
    fixed_costs: Number(body.fixed_costs) || 0,
    net_profit: Number(body.net_profit) || 0,
  }
  if (Object.values(budget).some(v => !Number.isFinite(v))) return json({ error: 'Budget values must be numbers' }, 400)

  const { error } = await supabase
    .from('cfo_budgets')
    .upsert({ user_id: user.id, ...budget, updated_at: new Date().toISOString() }, { onConflict: 'user_id' })

  if (error) {
    if (error.code === '42P01') return json({ error: 'Budget table not yet created. Run the SQL in the API file comment.' }, 503)
    return json({ error: error.message }, 500)
  }

  return json({ budget, hasBudget: Object.values(budget).some(v => v > 0) })
}
