import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { formatDateTime } from '@/lib/i18n-format'
import { resolveLocale } from '@/lib/i18n-locale'

export const runtime = 'edge'

const PAGE  = '#EAE6DD'
const INK   = '#211B14'
const MUTED = '#6B5F4F'

const WIDTH = 620
const PAD_X = 40
const TOOTH = 16 // px width of each zigzag triangle — WIDTH must divide evenly for a clean edge

// Deterministic pseudo-random bar widths for the decorative barcode, seeded
// from the transaction id so the same receipt always renders identically
// (this is fetched fresh by Meta at delivery time, not cached from a
// pre-rendered file — an inconsistent barcode on refetch would look broken).
function barHeights(seed: string, count: number): number[] {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  const out: number[] = []
  for (let i = 0; i < count; i++) {
    h = (h * 1103515245 + 12345) >>> 0
    out.push(18 + (h % 100) / 100 * 26) // 18–44px
  }
  return out
}

function Zigzag({ pointDown }: { pointDown: boolean }) {
  const count = Math.ceil(WIDTH / TOOTH)
  return (
    <div style={{ display: 'flex', flexDirection: 'row', width: `${WIDTH}px` }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 0, height: 0,
            borderLeft: `${TOOTH / 2}px solid transparent`,
            borderRight: `${TOOTH / 2}px solid transparent`,
            ...(pointDown
              ? { borderTop: `11px solid ${PAGE}` }
              : { borderBottom: `11px solid ${PAGE}` }),
          }}
        />
      ))}
    </div>
  )
}

function Divider() {
  return <div style={{ display: 'flex', width: '100%', borderTop: `2px dashed #C9C0AE`, margin: '18px 0' }} />
}

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

  const [{ data: profile }, { data: cashier }] = await Promise.all([
    service.from('profiles').select('business_name, currency_symbol, vat_number, preferred_locale, registration_country').eq('id', tx.owner_id).maybeSingle(),
    tx.cashier_id
      ? service.from('pos_staff').select('name').eq('id', tx.cashier_id).maybeSingle()
      : Promise.resolve({ data: null }),
  ])

  const symbol       = profile?.currency_symbol || '£'
  const businessName = (profile?.business_name || 'The Shop').toUpperCase()
  const locale        = resolveLocale({ profile: profile?.preferred_locale, country: profile?.registration_country })
  const date          = formatDateTime(locale, tx.created_at)
  const items = (tx.pos_items as { name: string; qty: number; line_total: number; tax_rate: number | null }[]) || []
  const discount = Number(tx.discount_amount) || 0
  // total_tax (added in the tax-automation migration, computed per line item
  // from pos_item_tax_codes) is what actually gets written at sale time now —
  // tax_amount is the older column and is 0/null on every real transaction
  // written since. Prefer whichever is actually populated.
  const tax      = Number(tx.total_tax ?? tx.tax_amount) || 0
  const subtotal = tx.subtotal != null ? Number(tx.subtotal) : items.reduce((s, i) => s + Number(i.line_total), 0)
  const receiptNo = tx.id.replace(/-/g, '').slice(0, 8).toUpperCase()
  const money = (n: number) => `${symbol}${n.toFixed(2)}`

  // A receipt only needs to say "VAT" and show the registration number for a
  // VAT-registered business (profiles.vat_number, set in Settings — presence
  // IS the registration flag, there's no separate boolean anywhere in the
  // schema). Everyone else keeps the generic "Tax" label so a non-VAT sales
  // tax isn't mislabelled.
  const vatNumber   = profile?.vat_number?.trim() || null
  const isVat       = !!vatNumber
  const itemRates   = Array.from(new Set(items.map(i => i.tax_rate).filter((r): r is number => r != null)))
  const taxRate     = itemRates.length === 1 ? itemRates[0] : null
  const taxLabel    = isVat ? (taxRate != null ? `VAT (${taxRate}%)` : 'VAT') : 'Tax'

  const fontUrl = (name: string) => new URL(`/fonts/${name}`, req.url).toString()
  const [regular, bold] = await Promise.all([
    fetch(fontUrl('CourierPrime-Regular.ttf')).then(r => r.arrayBuffer()),
    fetch(fontUrl('CourierPrime-Bold.ttf')).then(r => r.arrayBuffer()),
  ])

  const bars = barHeights(tx.id, 46)

  const itemRowHeight = 54
  const height =
    620
    + items.length * itemRowHeight
    + (discount > 0 ? 30 : 0)
    + (tax > 0 ? 30 : 0)
    + (cashier?.name ? 26 : 0)
    + (vatNumber ? 26 : 0)

  return new ImageResponse(
    (
      <div
        style={{
          width: `${WIDTH + 40}px`, height: `${height}px`, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'flex-start', background: PAGE, paddingTop: '20px',
          fontFamily: 'Courier Prime',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', width: `${WIDTH}px`, position: 'relative' }}>
          <Zigzag pointDown />
          <div style={{ display: 'flex', flexDirection: 'column', background: '#FFFFFF', padding: `4px ${PAD_X}px 32px`, color: INK }}>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
              <div style={{ display: 'flex', fontSize: '27px', fontWeight: 700, letterSpacing: '2px', textAlign: 'center' }}>
                {businessName}
              </div>
              <div style={{ display: 'flex', fontSize: '13px', color: MUTED, letterSpacing: '5px', marginTop: '8px' }}>
                R E C E I P T
              </div>
              {vatNumber && (
                <div style={{ display: 'flex', fontSize: '12px', color: MUTED, marginTop: '10px' }}>
                  VAT Reg. No: {vatNumber}
                </div>
              )}
            </div>

            <Divider />

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: MUTED }}>
              <div style={{ display: 'flex' }}>No. {receiptNo}</div>
              <div style={{ display: 'flex' }}>{date}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: MUTED, marginTop: '6px' }}>
              <div style={{ display: 'flex' }}>{cashier?.name ? `Served by ${cashier.name}` : ' '}</div>
              <div style={{ display: 'flex', textTransform: 'uppercase' }}>{tx.payment_type}</div>
            </div>

            <Divider />

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: MUTED, letterSpacing: '1px' }}>
              <div style={{ display: 'flex' }}>ITEM</div>
              <div style={{ display: 'flex' }}>AMOUNT</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', marginTop: '14px' }}>
              {items.map((item, i) => {
                const unit = item.qty ? Number(item.line_total) / item.qty : Number(item.line_total)
                return (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 700 }}>
                      <div style={{ display: 'flex' }}>{item.name}</div>
                      <div style={{ display: 'flex' }}>{money(Number(item.line_total))}</div>
                    </div>
                    <div style={{ display: 'flex', fontSize: '13px', color: MUTED, marginTop: '2px' }}>
                      {item.qty} x {money(unit)}
                    </div>
                  </div>
                )
              })}
            </div>

            <Divider />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px' }}>
                <div style={{ display: 'flex' }}>Subtotal</div>
                <div style={{ display: 'flex' }}>{money(subtotal)}</div>
              </div>
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px' }}>
                  <div style={{ display: 'flex' }}>Discount</div>
                  <div style={{ display: 'flex' }}>-{money(discount)}</div>
                </div>
              )}
              {tax > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px' }}>
                  <div style={{ display: 'flex' }}>{taxLabel}</div>
                  <div style={{ display: 'flex' }}>{money(tax)}</div>
                </div>
              )}
            </div>

            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '24px', fontWeight: 700,
              border: `2px solid ${INK}`, padding: '12px 18px', marginTop: '18px',
            }}>
              <div style={{ display: 'flex' }}>TOTAL</div>
              <div style={{ display: 'flex' }}>{money(Number(tx.total))}</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '30px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px' }}>
                {bars.map((h, i) => (
                  <div key={i} style={{ display: 'flex', width: '3px', height: `${h}px`, background: INK }} />
                ))}
              </div>
              <div style={{ display: 'flex', fontSize: '12px', letterSpacing: '4px', color: MUTED, marginTop: '8px' }}>
                {receiptNo}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', marginTop: '26px' }}>
              <div style={{ display: 'flex', fontSize: '14px', fontWeight: 700, letterSpacing: '1px' }}>
                THANK YOU FOR YOUR BUSINESS
              </div>
              <div style={{ display: 'flex', fontSize: '11px', color: MUTED, marginTop: '4px' }}>Powered by AskBiz</div>
            </div>
          </div>
          <Zigzag pointDown={false} />
        </div>
      </div>
    ),
    {
      width: WIDTH + 40,
      height,
      fonts: [
        { name: 'Courier Prime', data: regular, weight: 400, style: 'normal' },
        { name: 'Courier Prime', data: bold, weight: 700, style: 'normal' },
      ],
    }
  )
}
