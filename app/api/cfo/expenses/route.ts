import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status })
}

/*
  Supabase table required (run once in SQL editor):

  create table if not exists cfo_expenses (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    vendor text not null,
    date date not null,
    amount numeric(12,2) not null,
    category text not null default 'Other',
    notes text,
    receipt_url text,
    created_at timestamptz not null default now()
  );

  alter table cfo_expenses enable row level security;

  create policy "Users own their expenses"
    on cfo_expenses for all
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

  create index on cfo_expenses (user_id, date desc);
*/

// GET — list expenses for the current user
export async function GET(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return json({ error: 'Unauthorised' }, 401)

  const url = new URL(req.url)
  const limit = Math.min(Number(url.searchParams.get('limit') || 200), 500)

  const { data, error } = await supabase
    .from('cfo_expenses')
    .select('id, vendor, date, amount, category, notes, receipt_url, created_at')
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .limit(limit)

  if (error) {
    // Table may not exist yet — return empty list gracefully
    if (error.code === '42P01') return json({ expenses: [], note: 'Table not yet created' })
    return json({ error: error.message }, 500)
  }

  return json({ expenses: data || [] })
}

// POST — create a new expense
export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return json({ error: 'Unauthorised' }, 401)

  let body: { vendor: string; date: string; amount: number; category?: string; notes?: string; receipt_url?: string }
  try {
    body = await req.json()
  } catch {
    return json({ error: 'Invalid JSON body' }, 400)
  }

  const { vendor, date, amount, category = 'Other', notes = '', receipt_url } = body

  if (!vendor?.trim()) return json({ error: 'vendor is required' }, 400)
  if (!date) return json({ error: 'date is required' }, 400)
  if (typeof amount !== 'number' || amount < 0) return json({ error: 'amount must be a non-negative number' }, 400)

  const { data, error } = await supabase
    .from('cfo_expenses')
    .insert({
      user_id: user.id,
      vendor: vendor.trim(),
      date,
      amount,
      category,
      notes: notes || null,
      receipt_url: receipt_url || null,
    })
    .select('id, vendor, date, amount, category, notes, receipt_url, created_at')
    .single()

  if (error) {
    if (error.code === '42P01') return json({ error: 'Expenses table not yet created. Run the SQL in the API file comment.' }, 503)
    return json({ error: error.message }, 500)
  }

  return json({ expense: data }, 201)
}

// DELETE — remove an expense by id
export async function DELETE(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return json({ error: 'Unauthorised' }, 401)

  const id = new URL(req.url).searchParams.get('id')
  if (!id) return json({ error: 'id is required' }, 400)

  const { error } = await supabase
    .from('cfo_expenses')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id) // RLS safety: users can only delete their own

  if (error) return json({ error: error.message }, 500)

  return json({ deleted: true })
}
