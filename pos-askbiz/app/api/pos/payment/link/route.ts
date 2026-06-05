import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosOwner } from '@/lib/pos-auth'
import { createPaymentLink } from '@/lib/paystack'
import QRCode from 'qrcode'

/**
 * POST /api/pos/payment/link
 *
 * Create a payment link + QR code for card/Apple Pay payments
 *
 * Body:
 *   transaction_id: uuid
 *   payment_method: 'card' | 'apple_pay'
 */
export async function POST(req: NextRequest) {
  const ownerId = await resolvePosOwner(req)
  if (!ownerId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const body = await req.json()
  const { transaction_id, payment_method = 'card' } = body

  if (!transaction_id) {
    return NextResponse.json({ error: 'transaction_id required' }, { status: 400 })
  }

  try {
    // Fetch transaction
    const { data: transaction, error: txError } = await service
      .from('pos_transactions')
      .select('id, total, payment_status')
      .eq('id', transaction_id)
      .eq('owner_id', ownerId)
      .single()

    if (txError || !transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
    }

    if (transaction.payment_status === 'paid') {
      return NextResponse.json({ error: 'Transaction already paid' }, { status: 400 })
    }

    // Get merchant's payment config
    const { data: config } = await service
      .from('merchant_payment_config')
      .select('payment_provider, paystack_subaccount_id')
      .eq('owner_id', ownerId)
      .single()

    if (!config || config.payment_provider !== 'paystack') {
      return NextResponse.json({ error: 'Card payments not configured' }, { status: 400 })
    }

    // Create Paystack payment link
    const link = await createPaymentLink({
      amount: Math.round(transaction.total * 100), // Convert to kobo
      currency: 'KES',
      description: `AskBiz POS - Transaction ${transaction_id.slice(0, 8)}`,
      metadata: {
        transaction_id,
        merchant_id: ownerId,
        payment_method,
      },
    })

    // Generate QR code as data URL
    let qrDataUrl: string | null = null
    try {
      qrDataUrl = await QRCode.toDataURL(link.checkoutUrl, {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        quality: 0.95,
        margin: 1,
        width: 300,
      })
    } catch (err) {
      console.error('[payment/link] QR generation failed:', err)
      // Continue without QR, customer can use the URL directly
    }

    // Store payment record
    const { data: payment, error: paymentError } = await service
      .from('pos_payments')
      .insert({
        owner_id: ownerId,
        transaction_id,
        amount: transaction.total,
        payment_method: payment_method === 'apple_pay' ? 'apple_pay' : 'card',
        provider: 'paystack',
        external_reference: link.reference,
        status: 'pending',
      })
      .select()
      .single()

    if (paymentError) {
      console.error('[payment/link] Failed to store payment record:', paymentError)
      return NextResponse.json({ error: 'Failed to record payment' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      payment_id: payment.id,
      reference: link.reference,
      checkout_url: link.checkoutUrl,
      qr_code: qrDataUrl,
      amount: transaction.total,
      message: 'Payment link generated. Display QR code to customer.',
    })
  } catch (error: any) {
    console.error('[payment/link] error:', error)
    return NextResponse.json(
      { error: error.message || 'Link generation failed' },
      { status: 500 }
    )
  }
}
