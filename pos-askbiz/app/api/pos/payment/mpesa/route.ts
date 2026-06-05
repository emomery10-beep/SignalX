import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosOwner } from '@/lib/pos-auth'
import { initiateStkPush } from '@/lib/paystack'

/**
 * POST /api/pos/payment/mpesa
 *
 * Initiate M-Pesa STK Push for a POS transaction
 *
 * Body:
 *   transaction_id: uuid
 *   customer_phone: string (e.g. '+254712345678' or '0712345678')
 *   amount?: number (if not provided, fetches from transaction)
 */
export async function POST(req: NextRequest) {
  const ownerId = await resolvePosOwner(req)
  if (!ownerId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const body = await req.json()
  const { transaction_id, customer_phone } = body

  if (!transaction_id || !customer_phone) {
    return NextResponse.json(
      { error: 'transaction_id and customer_phone required' },
      { status: 400 }
    )
  }

  try {
    // Fetch transaction to verify it exists and get amount
    const { data: transaction, error: txError } = await service
      .from('pos_transactions')
      .select('id, total, customer_id, payment_status')
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
    const { data: config, error: configError } = await service
      .from('merchant_payment_config')
      .select('payment_provider, paystack_subaccount_id')
      .eq('owner_id', ownerId)
      .single()

    if (configError || !config || config.payment_provider !== 'paystack') {
      return NextResponse.json(
        { error: 'M-Pesa payments not configured for this merchant' },
        { status: 400 }
      )
    }

    // Normalize phone number
    let phone = customer_phone.replace(/[\s\-()]/g, '')
    if (phone.startsWith('+')) phone = phone.slice(1)
    if (phone.startsWith('0')) phone = `254${phone.slice(1)}`
    if (!phone.startsWith('254')) phone = `254${phone}`

    // Initiate STK Push via Paystack
    const stk = await initiateStkPush({
      email: `customer@pos-${transaction_id.slice(0, 8)}.askbiz.co`,
      amount: Math.round(transaction.total * 100), // Convert to kobo
      phone,
      metadata: {
        transaction_id,
        merchant_id: ownerId,
        channel: 'pos_stk_push',
      },
    })

    // Store pending payment record
    const { data: payment, error: paymentError } = await service
      .from('pos_payments')
      .insert({
        owner_id: ownerId,
        transaction_id,
        customer_phone: phone,
        amount: transaction.total,
        payment_method: 'mpesa',
        provider: 'paystack',
        external_reference: stk.reference,
        status: 'pending',
      })
      .select()
      .single()

    if (paymentError) {
      console.error('[payment/mpesa] Failed to store payment record:', paymentError)
      return NextResponse.json({ error: 'Failed to record payment' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      payment_id: payment.id,
      reference: stk.reference,
      message: `STK Push sent to ${phone}`,
      amount: transaction.total,
      status: 'pending',
    })
  } catch (error: any) {
    console.error('[payment/mpesa] error:', error)
    return NextResponse.json({ error: error.message || 'Payment initiation failed' }, { status: 500 })
  }
}
