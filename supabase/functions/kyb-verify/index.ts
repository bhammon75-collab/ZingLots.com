// deno-lint-ignore-file
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface KYBRequest {
  businessId: string
  businessName: string
  taxId?: string
  address?: any
  documents?: Array<{
    type: string
    data: string // base64
    mediaType: string
  }>
  owners?: Array<{
    name: string
    percentage: number
  }>
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const kybData: KYBRequest = await req.json()

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Start risk score at 0 (lower is better)
    let riskScore = 0
    const reasons = []
    const aiAnalysis: any = {}

    // Step 1: Document Analysis using Claude Vision
    if (kybData.documents && kybData.documents.length > 0) {
      const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY')!
      
      const documentAnalysisPromises = kybData.documents.map(async (doc) => {
        const messages = [{
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: doc.mediaType,
                data: doc.data
              }
            },
            {
              type: "text",
              text: `Analyze this business document for KYB verification. Extract:
1. Business name
2. Registration/Tax ID number
3. Address
4. Date of establishment
5. Any red flags or concerns
6. Document authenticity indicators

Return as JSON:
{
  "businessName": "string",
  "registrationNumber": "string",
  "address": "string",
  "establishedDate": "string",
  "redFlags": ["array"],
  "authenticityScore": 0-100,
  "documentType": "string"
}`
            }
          ]
        }]

        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'x-api-key': anthropicKey,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 1000,
            messages: messages,
            temperature: 0.1,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          try {
            return JSON.parse(data.content[0].text)
          } catch {
            return { error: 'Failed to parse document' }
          }
        }
        return { error: 'Document analysis failed' }
      })

      const documentResults = await Promise.all(documentAnalysisPromises)
      aiAnalysis.documents = documentResults

      // Analyze document results for risk
      documentResults.forEach((result: any) => {
        if (result.error) {
          riskScore += 20
          reasons.push('Document analysis failed')
        } else {
          if (result.authenticityScore < 70) {
            riskScore += 30
            reasons.push('Low document authenticity score')
          }
          if (result.redFlags && result.redFlags.length > 0) {
            riskScore += 10 * result.redFlags.length
            reasons.push(...result.redFlags)
          }
        }
      })
    } else {
      riskScore += 25
      reasons.push('No documents provided')
    }

    // Step 2: Business Name and Tax ID Validation
    if (!kybData.businessName || kybData.businessName.length < 3) {
      riskScore += 15
      reasons.push('Invalid business name')
    }

    if (!kybData.taxId) {
      riskScore += 20
      reasons.push('No tax ID provided')
    } else {
      // Basic tax ID format validation (US EIN format)
      const einRegex = /^\d{2}-\d{7}$/
      if (!einRegex.test(kybData.taxId)) {
        riskScore += 10
        reasons.push('Invalid tax ID format')
      }
    }

    // Step 3: Address Validation
    if (!kybData.address) {
      riskScore += 15
      reasons.push('No business address provided')
    }

    // Step 4: Beneficial Owner Check
    if (!kybData.owners || kybData.owners.length === 0) {
      riskScore += 10
      reasons.push('No beneficial owners declared')
    } else {
      const totalOwnership = kybData.owners.reduce((sum, owner) => sum + owner.percentage, 0)
      if (Math.abs(totalOwnership - 100) > 0.01) {
        riskScore += 15
        reasons.push('Ownership percentages do not sum to 100%')
      }
    }

    // Step 5: Determine verification status
    let status: 'approved' | 'rejected' | 'manual_review' = 'approved'
    
    if (riskScore >= 70) {
      status = 'rejected'
    } else if (riskScore >= 40) {
      status = 'manual_review'
    }

    // Step 6: Store KYB application
    const { data: application, error: insertError } = await supabase
      .from('kyb_applications')
      .insert({
        business_id: kybData.businessId,
        status: status,
        risk_score: riskScore,
        reasons: reasons,
        documents: kybData.documents ? { count: kybData.documents.length } : null,
        ai_analysis: aiAnalysis,
        decided_at: status === 'approved' || status === 'rejected' ? new Date().toISOString() : null,
        decided_by: status === 'approved' || status === 'rejected' ? 'ai_agent' : null
      })
      .select()
      .single()

    if (insertError) {
      throw insertError
    }

    // Step 7: Update business verification status if approved
    if (status === 'approved') {
      await supabase
        .from('businesses')
        .update({ verified_at: new Date().toISOString() })
        .eq('id', kybData.businessId)
    }

    // Log AI activity
    await supabase
      .from('ai_agent_logs')
      .insert({
        agent_type: 'kyb',
        action: 'verify_business',
        subject_type: 'business',
        subject_id: kybData.businessId,
        input: { 
          businessName: kybData.businessName,
          hasDocuments: !!kybData.documents,
          documentCount: kybData.documents?.length || 0
        },
        output: { status, riskScore, reasons },
        model_version: 'claude-3-5-sonnet-20241022',
      })

    return new Response(
      JSON.stringify({
        applicationId: application.id,
        status,
        riskScore,
        reasons,
        nextSteps: status === 'manual_review' 
          ? 'Your application will be reviewed by our team within 24-48 hours.'
          : status === 'approved'
          ? 'Congratulations! Your business is verified and you can start listing.'
          : 'Please review the issues and resubmit with correct documentation.'
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    )

  } catch (error) {
    console.error('Error in kyb-verify:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Verification failed',
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
