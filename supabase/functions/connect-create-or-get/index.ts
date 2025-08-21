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

    const { refreshUrl, returnUrl } = await req.json()

    // Get user profile to check for existing Stripe Connect account
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('stripe_connect_id, business_name, display_name')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return new Response(
        JSON.stringify({ error: 'Profile not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    let accountId = profile.stripe_connect_id

    // Create Stripe Connect Express account if doesn't exist
    if (!accountId) {
      try {
        const account = await stripe.accounts.create({
          type: 'express',
          business_type: 'company', // Assuming B2B focus
          company: {
            name: profile.business_name || profile.display_name || 'Business',
          },
          email: user.email,
          capabilities: {
            transfers: { requested: true },
            card_payments: { requested: true },
          },
          business_profile: {
            mcc: '5999', // Miscellaneous retail
            product_description: 'B2B surplus equipment and materials',
          },
        })

        accountId = account.id

        // Store the account ID in the profile
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ stripe_connect_id: accountId })
          .eq('id', user.id)

        if (updateError) {
          console.error('Error updating profile with Stripe account:', updateError)
          // Continue anyway, account was created
        }

      } catch (stripeError) {
        console.error('Stripe account creation error:', stripeError)
        return new Response(
          JSON.stringify({ error: 'Failed to create Stripe account' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // Create account onboarding link
    try {
      const siteUrl = Deno.env.get('SITE_URL') || 'http://localhost:5173'
      
      const accountLink = await stripe.accountLinks.create({
        account: accountId,
        refresh_url: refreshUrl || `${siteUrl}/seller/onboarding/refresh`,
        return_url: returnUrl || `${siteUrl}/seller/onboarding/complete`,
        type: 'account_onboarding',
      })

      return new Response(
        JSON.stringify({ 
          onboardingUrl: accountLink.url,
          accountId: accountId,
          success: true
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )

    } catch (linkError) {
      console.error('Account link creation error:', linkError)
      return new Response(
        JSON.stringify({ error: 'Failed to create onboarding link' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

  } catch (error) {
    console.error('Connect onboarding error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
