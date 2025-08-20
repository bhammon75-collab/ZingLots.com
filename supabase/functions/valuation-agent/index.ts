// deno-lint-ignore-file
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ValuationRequest {
  itemId: string
  title: string
  description?: string
  category?: string
  condition?: string
  quantity?: number
  unitOfMeasure?: string
  location?: string
  images?: string[]
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const valuationData: ValuationRequest = await req.json()

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Step 1: Find comparable items in our database
    let comparablesQuery = supabase
      .from('items')
      .select('title, start_price_cents, current_price_cents, condition, quantity, unit_of_measure, category, ends_at')
      .eq('status', 'ended')
      .not('current_price_cents', 'is', null)

    if (valuationData.category) {
      comparablesQuery = comparablesQuery.eq('category', valuationData.category)
    }

    const { data: internalComps, error: compError } = await comparablesQuery
      .order('ends_at', { ascending: false })
      .limit(20)

    if (compError) {
      console.error('Error fetching comparables:', compError)
    }

    // Step 2: Use Claude to analyze the item and comparables
    const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY')!
    
    const messages = [{
      role: "user",
      content: `You are an expert appraiser for B2B surplus equipment and materials. Analyze this item and provide a valuation:

Item Details:
- Title: ${valuationData.title}
- Description: ${valuationData.description || 'Not provided'}
- Category: ${valuationData.category || 'Unknown'}
- Condition: ${valuationData.condition || 'Unknown'}
- Quantity: ${valuationData.quantity || 1} ${valuationData.unitOfMeasure || 'units'}
- Location: ${valuationData.location || 'Not specified'}

Recent Comparable Sales from Our Platform:
${internalComps ? JSON.stringify(internalComps.slice(0, 10), null, 2) : 'No direct comparables available'}

Based on this information and your knowledge of B2B surplus markets, provide:

1. A valuation range (low to high) in cents
2. Suggested starting price for auction in cents
3. Suggested reserve price in cents (if applicable)
4. Confidence score (0-100)
5. Rationale for the valuation
6. Key factors affecting the value

Consider factors like:
- Seasonal demand
- Market conditions for this category
- Condition impact on value
- Bulk quantity discounts
- Regional price variations
- Typical depreciation rates

Return your analysis as JSON:
{
  "lowCents": number,
  "highCents": number,
  "suggestedStartCents": number,
  "suggestedReserveCents": number or null,
  "confidenceScore": number (0-100),
  "rationale": "string explaining the valuation",
  "keyFactors": ["array of key value drivers"],
  "comparablesSummary": "brief summary of comparable analysis",
  "marketTrend": "increasing|stable|decreasing"
}`
    }]

    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1500,
        messages: messages,
        temperature: 0.2,
      }),
    })

    if (!anthropicResponse.ok) {
      throw new Error(`Anthropic API error: ${anthropicResponse.status}`)
    }

    const anthropicData = await anthropicResponse.json()
    let valuation
    
    try {
      valuation = JSON.parse(anthropicData.content[0].text)
    } catch (e) {
      // Fallback to basic valuation if parsing fails
      const avgPrice = internalComps && internalComps.length > 0
        ? Math.round(internalComps.reduce((sum, item) => sum + (item.current_price_cents || 0), 0) / internalComps.length)
        : 10000 // Default $100

      valuation = {
        lowCents: Math.round(avgPrice * 0.7),
        highCents: Math.round(avgPrice * 1.3),
        suggestedStartCents: Math.round(avgPrice * 0.3),
        suggestedReserveCents: Math.round(avgPrice * 0.6),
        confidenceScore: 40,
        rationale: "Basic valuation based on available comparables",
        keyFactors: ["Limited data available"],
        comparablesSummary: `Based on ${internalComps?.length || 0} comparable items`,
        marketTrend: "stable"
      }
    }

    // Step 3: Store the valuation
    const { data: valuationRecord, error: insertError } = await supabase
      .from('valuations')
      .insert({
        item_id: valuationData.itemId,
        method: 'ai_comparables_v1',
        low_cents: valuation.lowCents,
        high_cents: valuation.highCents,
        suggested_start_cents: valuation.suggestedStartCents,
        suggested_reserve_cents: valuation.suggestedReserveCents,
        comparables: {
          internal: internalComps?.slice(0, 5),
          summary: valuation.comparablesSummary
        },
        rationale: valuation.rationale,
        confidence_score: valuation.confidenceScore / 100,
      })
      .select()
      .single()

    if (insertError) {
      console.error('Failed to store valuation:', insertError)
    }

    // Step 4: Check if this is a stale item needing price adjustment
    const { data: item } = await supabase
      .from('items')
      .select('created_at, start_price_cents')
      .eq('id', valuationData.itemId)
      .single()

    if (item) {
      const daysOld = Math.floor((Date.now() - new Date(item.created_at).getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysOld > 7 && valuation.marketTrend === 'decreasing') {
        // Suggest a price reduction for stale inventory
        const adjustmentPercentage = Math.min(daysOld * 2, 30) // Max 30% reduction
        const newStartPrice = Math.round(item.start_price_cents * (1 - adjustmentPercentage / 100))
        
        await supabase
          .from('price_adjustments')
          .insert({
            item_id: valuationData.itemId,
            reason: `Stale inventory (${daysOld} days) in declining market`,
            old_start_cents: item.start_price_cents,
            new_start_cents: newStartPrice,
            approved_by: 'auto_suggestion'
          })
        
        valuation.priceAdjustmentSuggested = {
          reason: 'Stale inventory',
          oldPrice: item.start_price_cents,
          newPrice: newStartPrice,
          reduction: `${adjustmentPercentage}%`
        }
      }
    }

    // Log AI activity
    await supabase
      .from('ai_agent_logs')
      .insert({
        agent_type: 'valuation',
        action: 'estimate_value',
        subject_type: 'item',
        subject_id: valuationData.itemId,
        input: { 
          title: valuationData.title,
          category: valuationData.category,
          comparablesFound: internalComps?.length || 0
        },
        output: valuation,
        model_version: 'claude-3-5-sonnet-20241022',
        tokens_used: anthropicData.usage?.total_tokens || 0,
      })

    return new Response(
      JSON.stringify({
        valuationId: valuationRecord?.id,
        ...valuation,
        comparablesCount: internalComps?.length || 0,
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    )

  } catch (error) {
    console.error('Error in valuation-agent:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Valuation failed',
        message: error.message 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    )
  }
})
