import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export const runtime = 'edge'

const ACC   = '#C97A44'
const INK   = '#1A1410'
const MUTED = '#6B5B4E'

// Fetched by Meta's servers when a receipt WhatsApp message is delivered
// (see lib/whatsapp.ts sendReceipt — the template's image header is a link
// to this route, not an uploaded file, so it's always current as of send
// time). No session reaches this request — Meta's fetcher can't carry our
// cookies — so this is gated only by the transaction id being an
// unguessable UUID, same trust model as every other transaction-scoped
// link in this codebase.
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const service = createServiceClient()

  const { data: tx } = await service
    .from('pos_transactions')
    .select('*, pos_items(*)')
    .eq('id', params.id)
    .maybeSingle()

  if (!tx) return new Response('Not found', { status: 404 })

  const { data: profile } = await service
    .from('profiles')
    .select('business_name, currency_symbol')
    .eq('id', tx.owner_id)
    .maybeSingle()

  const symbol       = profile?.currency_symbol || '£'
  const businessName = profile?.business_name || 'The Shop'
  const date          = new Date(tx.created_at).toLocaleString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
  const items = (tx.pos_items as { name: string; qty: number; line_total: number }[]) || []
  const discount = Number(tx.discount_amount) || 0

  const width = 640
  const rowHeight = 34
  const height = 460 + items.length * rowHeight + (discount > 0 ? rowHeight : 0)

  const divider = (
    <div style={{ display: 'flex', width: '100%', borderTop: `2px dashed #D8CFC2`, margin: '16px 0' }} />
  )

  return new ImageResponse(
    (
      <div
        style={{
          width: `${width}px`, height: `${height}px`, display: 'flex', flexDirection: 'column',
          background: '#FFFFFF', fontFamily: 'sans-serif', padding: '48px 48px 40px', color: INK,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'flex', fontSize: '30px', fontWeight: 700, textAlign: 'center' }}>{businessName}</div>
        </div>

        {divider}

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', color: MUTED }}>
          <div style={{ display: 'flex' }}>{date}</div>
          <div style={{ display: 'flex' }}>{tx.payment_type}</div>
        </div>

        {divider}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {items.map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '17px' }}>
              <div style={{ display: 'flex' }}>{item.name} ×{item.qty}</div>
              <div style={{ display: 'flex' }}>{symbol}{Number(item.line_total).toFixed(2)}</div>
            </div>
          ))}
          {discount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '17px', color: ACC }}>
              <div style={{ display: 'flex' }}>Discount</div>
              <div style={{ display: 'flex' }}>-{symbol}{discount.toFixed(2)}</div>
            </div>
          )}
        </div>

        {divider}

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '24px', fontWeight: 700 }}>
          <div style={{ display: 'flex' }}>TOTAL</div>
          <div style={{ display: 'flex' }}>{symbol}{Number(tx.total).toFixed(2)}</div>
        </div>

        {divider}

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
          <div style={{ display: 'flex', fontSize: '15px', color: MUTED }}>Thank you for shopping with us!</div>
          <div style={{ display: 'flex', fontSize: '12px', color: MUTED }}>Powered by AskBiz</div>
        </div>
      </div>
    ),
    { width, height }
  )
}
