import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosOwner } from '@/lib/pos-auth'
import { initiateWaafiPurchase } from '@/lib/waafipay'

const WALLETS = ['evc_plus', 'waafi', 'zaad', 'sahal'] as const
type Wallet = (typeof WALLETS)[number]

const WALLET_LABELS: Record<Wallet, string> = {
  evc_plus: 'EVC Plus',
  waafi: 'WAAFI',
  zaad: 'Zaad',
  sahal: 'Sahal',
}

/**
 * POST /api/pos/payment/evc-plus
 *
 * Initiate a WaafiPay mobile-wallet purchase (EVC Plus / WAAFI / Zaad / Sahal)
 * for a POS transaction. Named after the customer-facing payment method,
 * mirroring the mpesa/route.ts convention (route named after M-Pesa, not
 * Paystack, the gateway behind it).
 *
 * Body:
 *   transaction_id: uuid
 *   customer_phone: string (e.g. '+252612345678' or '0612345678')
 *   wallet?: 'evc_plus' | 'waafi' | 'zaad' | 'sahal' (default 'evc_plus')
 */
export async function POST(req: NextRequest) {
  const ownerId = await resolvePosOwner(req)
  if (!ownerId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const body = await req.json()
  const { transaction_id, customer_phone } = body
  const wallet: Wallet = WALLETS.includes(body.wallet) ? body.wallet : 'evc_plus'

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

    // Get merchant's WaafiPay config
    const { data: config, error: configError } = await service
      .from('merchant_payment_config')
      .select('payment_provider, is_active, waafipay_merchant_uid, waafipay_api_user_id, waafipay_api_key, country')
      .eq('owner_id', ownerId)
      .single()

    if (configError || !config || config.payment_provider !== 'waafipay') {
      return NextResponse.json(
        { error: 'Mobile money payments not configured for this merchant' },
        { status: 400 }
      )
    }

    if (!config.is_active) {
      return NextResponse.json({ error: 'Payment provider not yet active. Complete setup first.' }, { status: 400 })
    }

    if (!config.waafipay_merchant_uid || !config.waafipay_api_user_id || !config.waafipay_api_key) {
      return NextResponse.json({ error: 'WaafiPay credentials not configured for this merchant' }, { status: 400 })
    }

    // Normalize phone to +252XXXXXXXXX — Somalia
    let phone = customer_phone.replace(/[\s\-()]/g, '')
    if (phone.startsWith('+252')) phone = phone                    // already correct
    else if (phone.startsWith('252')) phone = `+${phone}`          // 252... → +252...
    else if (phone.startsWith('0')) phone = `+252${phone.slice(1)}` // 06... → +2526...
    else phone = `+252${phone}`                                     // 6... → +2526...

    // Basic validation — must be +252 followed by 8-9 digits
    // TODO(waafipay-verify): confirm exact Somali MSISDN length per carrier (Hormuud/Somtel/etc.)
    if (!/^\+252\d{8,9}$/.test(phone)) {
      return NextResponse.json({ error: 'Please enter a valid Somali phone number (e.g. 061 234 5678)' }, { status: 400 })
    }

    const referenceId = randomUUID()
    // WaafiPay's payerInfo.accountNo takes the full international number, no '+', no leading zero
    const accountNo = phone.replace('+', '')
    // TODO(waafipay-verify): confirm SOS vs USD default per merchant preference — USD used for now,
    // matching WaafiPay's public sandbox examples.
    const currency: 'SOS' | 'USD' = 'USD'

    const purchase = await initiateWaafiPurchase({
      merchantUid: config.waafipay_merchant_uid,
      apiUserId: config.waafipay_api_user_id,
      apiKey: config.waafipay_api_key,
      accountNo,
      referenceId,
      invoiceId: transaction_id,
      amount: transaction.total.toFixed(2),
      currency,
      description: `AskBiz POS sale ${transaction_id.slice(0, 8)}`,
    })

    // Store pending payment record
    const { data: payment, error: paymentError } = await service
      .from('pos_payments')
      .insert({
        owner_id: ownerId,
        transaction_id,
        customer_phone: phone,
        amount: transaction.total,
        payment_method: wallet,
        provider: 'waafipay',
        external_reference: referenceId,
        status: 'pending',
      })
      .select()
      .single()

    if (paymentError) {
      console.error('[payment/evc-plus] Failed to store payment record:', paymentError)
      return NextResponse.json({ error: 'Failed to record payment' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      payment_id: payment.id,
      reference: referenceId,
      wallet,
      message: `Payment request sent to ${phone} via ${WALLET_LABELS[wallet]}`,
      amount: transaction.total,
      status: 'pending',
      _waafiState: purchase.state, // debugging aid, not relied on by the client
    })
  } catch (error: any) {
    console.error('[payment/evc-plus] error:', error)
    return NextResponse.json({ error: error.message || 'Payment initiation failed' }, { status: 500 })
  }
}
