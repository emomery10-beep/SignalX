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
    .from('pos_products')
    .select('id, name, category, price, cost_price, stock_quantity, low_stock_threshold, sku, brand, supplier, active, image_url, last_sold_at')
    .eq('owner_id', user.id)
    .limit(limit)

  return NextResponse.json({
    products: products || [],
    currency_symbol: sym,
  })
}
