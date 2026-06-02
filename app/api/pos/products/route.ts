import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getCurrencySymbol } from '@/lib/get-currency'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const sym = await getCurrencySymbol(supabase, user.id)
  const limit = Number(new URL(req.url).searchParams.get('limit')) || 500

  const { data: products } = await supabase
    .from('inventory')
    .select('id, name, category, sale_price, cost_price, stock_qty, low_stock_threshold, sku, brand, supplier, active')
    .eq('owner_id', user.id)
    .eq('active', true)
    .limit(limit)

  return NextResponse.json({
    products: products || [],
    currency_symbol: sym,
  })
}
