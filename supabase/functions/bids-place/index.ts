import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

// Haversine distance calculation in kilometers
function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (val: number) => val * Math.PI / 180
  const R = 6371 // Earth's radius in km
  
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
  
  return 2 * R * Math.asin(Math.sqrt(a))
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { lotId, amountCents, bidderLat, bidderLon } = await req.json()
    
    if (!lotId || !amountCents) {
      return new Response(
        JSON.stringify({ error: 'Missing lotId or amountCents' }),
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

    // Get lot details with pickup location
    const { data: lot, error: lotError } = await supabase
      .from('lots')
      .select(`
        *,
        regions (lat, lon, center),
        locations (lat, lon, point)
      `)
      .eq('id', lotId)
      .single()

    if (lotError || !lot) {
      return new Response(
        JSON.stringify({ error: 'Lot not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate lot is active
    if (lot.status !== 'active') {
      return new Response(
        JSON.stringify({ error: 'Lot is not active' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if lot has ended
    if (lot.end_time && new Date(lot.end_time) <= new Date()) {
      return new Response(
        JSON.stringify({ error: 'Lot has ended' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Determine pickup coordinates (location overrides region)
    const pickupLat = lot.locations?.lat ?? lot.regions?.lat
    const pickupLon = lot.locations?.lon ?? lot.regions?.lon

    if (!pickupLat || !pickupLon) {
      return new Response(
        JSON.stringify({ error: 'Lot missing pickup coordinates' }),
        { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate bidder is within pickup radius
    if (bidderLat && bidderLon) {
      const distance = haversineKm(bidderLat, bidderLon, pickupLat, pickupLon)
      if (distance > lot.pickup_radius_km) {
        return new Response(
          JSON.stringify({ 
            error: 'Buyer outside pickup radius',
            distance: Math.round(distance * 10) / 10,
            maxDistance: lot.pickup_radius_km
          }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // Check bidder verification tier and bid limits
    const { data: profile } = await supabase
      .from('profiles')
      .select('verification_tier')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return new Response(
        JSON.stringify({ error: 'Profile not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate bid amount based on verification tier
    const canBid = await supabase.rpc('can_bid', { 
      user_id: user.id, 
      amount_cents: amountCents 
    })

    if (!canBid.data) {
      return new Response(
        JSON.stringify({ 
          error: 'Bid amount exceeds verification tier limit',
          tier: profile.verification_tier,
          maxBid: profile.verification_tier === 'T1' ? 50000 : null
        }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get current highest bid
    const { data: currentBid } = await supabase
      .from('bids')
      .select('amount_cents')
      .eq('lot_id', lotId)
      .eq('is_valid', true)
      .order('amount_cents', { ascending: false })
      .limit(1)
      .single()

    const currentPrice = currentBid?.amount_cents ?? lot.start_price_cents
    const minNextBid = currentPrice + lot.increment_cents

    if (amountCents < minNextBid) {
      return new Response(
        JSON.stringify({ 
          error: 'Bid too low',
          currentPrice: currentPrice,
          minimumBid: minNextBid,
          increment: lot.increment_cents
        }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Insert the bid
    const { error: bidError } = await supabase
      .from('bids')
      .insert({
        lot_id: lotId,
        bidder_id: user.id,
        amount_cents: amountCents,
        bidder_lat: bidderLat,
        bidder_lon: bidderLon,
        is_valid: true
      })

    if (bidError) {
      console.error('Bid insert error:', bidError)
      return new Response(
        JSON.stringify({ error: 'Failed to place bid' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Anti-snipe: extend end time if bid placed in last 2 minutes
    let newEndTime = lot.end_time
    if (lot.end_time) {
      const endTime = new Date(lot.end_time)
      const now = new Date()
      const timeRemaining = (endTime.getTime() - now.getTime()) / 1000 // seconds

      if (timeRemaining > 0 && timeRemaining <= 120 && lot.soft_close_extend_count < 5) {
        newEndTime = new Date(endTime.getTime() + 120000) // Add 2 minutes
        
        await supabase
          .from('lots')
          .update({ 
            end_time: newEndTime.toISOString(),
            soft_close_extend_count: lot.soft_close_extend_count + 1
          })
          .eq('id', lotId)
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        newPrice: amountCents,
        newEndTime: newEndTime,
        extendCount: lot.soft_close_extend_count + (newEndTime !== lot.end_time ? 1 : 0)
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Bid placement error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
