import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.0.0'
import { corsHeaders } from '../_shared/cors.ts'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2024-06-20',
})

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { lotId } = await req.json()
    
    if (!lotId) {
      return new Response(
        JSON.stringify({ error: 'Missing lotId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get authenticated user
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get lot details and verify it's ended
    const { data: lot, error: lotError } = await supabase
      .from('lots')
      .select('*')
      .eq('id', lotId)
      .single()

    if (lotError || !lot) {
      return new Response(
        JSON.stringify({ error: 'Lot not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (lot.status !== 'ended') {
      return new Response(
        JSON.stringify({ error: 'Lot has not ended yet' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get winning bid
    const { data: winningBid, error: bidError } = await supabase
      .from('bids')
      .select('*')
      .eq('lot_id', lotId)
      .eq('is_valid', true)
      .order('amount_cents', { ascending: false })
      .order('created_at', { ascending: true })
      .limit(1)
      .single()

    if (bidError || !winningBid) {
      return new Response(
        JSON.stringify({ error: 'No winning bid found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify user is the winner
    if (winningBid.bidder_id !== user.id) {
      return new Response(
        JSON.stringify({ error: 'You are not the winner of this lot' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if escrow already exists
    const { data: existingEscrow } = await supabase
      .from('escrow')
      .select('*')
      .eq('lot_id', lotId)
      .single()

    if (existingEscrow && existingEscrow.status !== 'awaiting_payment') {
      return new Response(
        JSON.stringify({ 
          error: 'Payment already processed',
          status: existingEscrow.status
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Calculate fees
    const amountCents = winningBid.amount_cents
    const platformFeeBps = parseInt(Deno.env.get('STRIPE_PLATFORM_FEE_BPS') || '900') // 9% default
    const feeAmount = Math.round((amountCents * platformFeeBps) / 10000)
    const sellerPayout = amountCents - feeAmount
    const totalAmount = amountCents + feeAmount // Winner pays item price + marketplace fee

    // Get or create customer
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single()

    let customerId = profile?.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          user_id: user.id,
        },
      })
      customerId = customer.id

      // Update profile with customer ID
      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id)
    }

    // Create PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: 'usd',
      customer: customerId,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        lot_id: lotId,
        user_id: user.id,
        seller_id: lot.seller_id,
      },
      description: `ZingLots payment for: ${lot.title}`,
    })

    // Upsert escrow record
    const escrowData = {
      lot_id: lotId,
      winner_id: user.id,
      status: 'awaiting_payment' as const,
      amount_cents: amountCents,
      marketplace_fee_cents: feeAmount,
      seller_payout_cents: sellerPayout,
      payment_intent_id: paymentIntent.id,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
    }

    const { error: escrowError } = await supabase
      .from('escrow')
      .upsert(escrowData, { onConflict: 'lot_id' })

    if (escrowError) {
      console.error('Escrow upsert error:', escrowError)
      return new Response(
        JSON.stringify({ error: 'Failed to create escrow record' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Generate QR token for pickup
    const qrToken = crypto.randomUUID()
    
    const { error: pickupError } = await supabase
      .from('pickups')
      .insert({
        lot_id: lotId,
        qr_token: qrToken,
        status: 'pending',
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      })

    if (pickupError) {
      console.error('Pickup QR creation error:', pickupError)
      // Continue anyway, this is not critical for payment
    }

    return new Response(
      JSON.stringify({
        client_secret: paymentIntent.client_secret,
        amount_cents: amountCents,
        fee_cents: feeAmount,
        total_cents: totalAmount,
        qr_token: qrToken,
        success: true
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Payment intent creation error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
