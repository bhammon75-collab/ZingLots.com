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
    const { qrToken, proofPhotos } = await req.json()
    
    if (!qrToken) {
      return new Response(
        JSON.stringify({ error: 'Missing QR token' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get authenticated user (should be seller)
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

    // Get pickup record and validate
    const { data: pickup, error: pickupError } = await supabase
      .from('pickups')
      .select(`
        *,
        lots!inner (
          seller_id,
          title
        )
      `)
      .eq('qr_token', qrToken)
      .single()

    if (pickupError || !pickup) {
      return new Response(
        JSON.stringify({ error: 'Invalid QR token' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify user is the seller
    if (pickup.lots.seller_id !== user.id) {
      return new Response(
        JSON.stringify({ error: 'You are not authorized to confirm this pickup' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if pickup is expired
    if (pickup.expires_at && new Date(pickup.expires_at) < new Date()) {
      return new Response(
        JSON.stringify({ error: 'QR token has expired' }),
        { status: 410, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if already scanned
    if (pickup.scanned_at) {
      return new Response(
        JSON.stringify({ 
          error: 'QR token already used',
          scannedAt: pickup.scanned_at
        }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get escrow record
    const { data: escrow, error: escrowError } = await supabase
      .from('escrow')
      .select('*')
      .eq('lot_id', pickup.lot_id)
      .single()

    if (escrowError || !escrow) {
      return new Response(
        JSON.stringify({ error: 'Escrow record not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify escrow is paid
    if (escrow.status !== 'paid') {
      return new Response(
        JSON.stringify({ 
          error: 'Payment not confirmed yet',
          escrowStatus: escrow.status
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get seller's Stripe Connect account
    const { data: sellerProfile, error: profileError } = await supabase
      .from('profiles')
      .select('stripe_connect_id')
      .eq('id', pickup.lots.seller_id)
      .single()

    if (profileError || !sellerProfile?.stripe_connect_id) {
      return new Response(
        JSON.stringify({ error: 'Seller not properly onboarded with Stripe' }),
        { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create transfer to seller
    let transfer
    try {
      transfer = await stripe.transfers.create({
        amount: escrow.seller_payout_cents,
        currency: 'usd',
        destination: sellerProfile.stripe_connect_id,
        metadata: {
          lot_id: pickup.lot_id,
          escrow_id: escrow.id,
          pickup_qr: qrToken,
        },
        description: `Payout for: ${pickup.lots.title}`,
      })
    } catch (stripeError) {
      console.error('Stripe transfer error:', stripeError)
      return new Response(
        JSON.stringify({ error: 'Failed to transfer payment to seller' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Update pickup record
    const { error: pickupUpdateError } = await supabase
      .from('pickups')
      .update({
        status: 'completed',
        scanned_at: new Date().toISOString(),
        scanned_by: user.id,
        proof_photos: proofPhotos || null,
      })
      .eq('id', pickup.id)

    if (pickupUpdateError) {
      console.error('Pickup update error:', pickupUpdateError)
      // Continue anyway, transfer was successful
    }

    // Update escrow status
    const { error: escrowUpdateError } = await supabase
      .from('escrow')
      .update({
        status: 'picked_up',
        transfer_id: transfer.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', escrow.id)

    if (escrowUpdateError) {
      console.error('Escrow update error:', escrowUpdateError)
      // Continue anyway, transfer was successful
    }

    // Update lot status to sold
    const { error: lotUpdateError } = await supabase
      .from('lots')
      .update({
        status: 'sold',
        updated_at: new Date().toISOString(),
      })
      .eq('id', pickup.lot_id)

    if (lotUpdateError) {
      console.error('Lot update error:', lotUpdateError)
      // Continue anyway, the important operations succeeded
    }

    return new Response(
      JSON.stringify({
        success: true,
        transferId: transfer.id,
        payoutAmount: escrow.seller_payout_cents,
        scannedAt: new Date().toISOString(),
        lotTitle: pickup.lots.title,
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Pickup confirmation error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
