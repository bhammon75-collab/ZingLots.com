// deno-lint-ignore-file
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { title, description, photos } = await req.json()

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Call Anthropic Claude API for vision analysis and text generation
    const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY')!
    
    // Prepare the messages for Claude
    const messages = []
    
    // Add photos if provided
    if (photos && photos.length > 0) {
      const imageContent = photos.map((photo: any) => ({
        type: "image",
        source: {
          type: "base64",
          media_type: photo.media_type || "image/jpeg",
          data: photo.data
        }
      }))
      
      messages.push({
        role: "user",
        content: [
          ...imageContent,
          {
            type: "text",
            text: `You are an expert at analyzing business surplus and equipment. Based on these images${title ? ` and the title "${title}"` : ''}${description ? ` and description "${description}"` : ''}, provide:

1. A professional, SEO-optimized title (max 80 chars) for this B2B surplus item
2. A detailed description with bullet points covering:
   - Key specifications (model, dimensions, power requirements if applicable)
   - Condition assessment
   - Quantity and unit of measure
   - Any visible compliance marks or certifications
   - Recommended use cases
3. Suggested category and subcategory
4. Any hazmat flags or safety concerns
5. Estimated weight and dimensions if possible
6. Whether special equipment (forklift, loading dock) might be needed
7. Alt text descriptions for accessibility

Format your response as JSON with this structure:
{
  "suggestedTitle": "string",
  "bulletSpecs": {
    "model": "string or null",
    "dimensions": "string or null",
    "power": "string or null",
    "quantity": "number",
    "unitOfMeasure": "string",
    "condition": "string"
  },
  "suggestedDescription": "string",
  "category": "string",
  "subcategory": "string",
  "hazmatFlags": ["array of strings or empty"],
  "policyNotes": ["array of strings or empty"],
  "estimatedWeightKg": "number or null",
  "estimatedDimensions": {
    "length": "number or null",
    "width": "number or null", 
    "height": "number or null"
  },
  "requiresForklift": "boolean",
  "requiresLoadingDock": "boolean",
  "altText": ["array of alt text descriptions for each image"]
}`
          }
        ]
      })
    } else {
      // Text-only analysis
      messages.push({
        role: "user",
        content: `You are an expert at creating B2B surplus listings. Based on this information:
Title: ${title || 'Not provided'}
Description: ${description || 'Not provided'}

Generate an optimized listing following the same JSON format as above, making reasonable assumptions for a B2B marketplace.`
      })
    }

    // Call Claude API
    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        messages: messages,
        temperature: 0.3,
      }),
    })

    if (!anthropicResponse.ok) {
      throw new Error(`Anthropic API error: ${anthropicResponse.status}`)
    }

    const anthropicData = await anthropicResponse.json()
    const aiContent = anthropicData.content[0].text
    
    // Parse the JSON response
    let suggestions
    try {
      suggestions = JSON.parse(aiContent)
    } catch (e) {
      // If JSON parsing fails, extract the content manually
      suggestions = {
        suggestedTitle: title || "Surplus Item",
        suggestedDescription: aiContent,
        category: "Other",
        subcategory: "General",
        bulletSpecs: {},
        hazmatFlags: [],
        policyNotes: [],
        altText: []
      }
    }

    // Log the AI agent activity
    const { error: logError } = await supabase
      .from('ai_agent_logs')
      .insert({
        agent_type: 'listing_copilot',
        action: 'generate_listing',
        input: { title, description, photo_count: photos?.length || 0 },
        output: suggestions,
        model_version: 'claude-3-5-sonnet-20241022',
        tokens_used: anthropicData.usage?.total_tokens || 0,
        latency_ms: 0, // You can add timing logic here
      })

    if (logError) {
      console.error('Failed to log AI activity:', logError)
    }

    return new Response(
      JSON.stringify(suggestions),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    )
  } catch (error) {
    console.error('Error in listing-copilot:', error)
    
    // Return a helpful error response
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process listing',
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
