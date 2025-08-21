import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SignJWT } from "https://deno.land/x/jose@v4.14.4/index.ts";
import { 
  handleCorsPreflightRequest, 
  createCorsErrorResponse, 
  createCorsSuccessResponse 
} from "../_shared/cors.ts";

function enc(s: string) { return new TextEncoder().encode(s); }

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return handleCorsPreflightRequest();
  }

  try {
    const { roomName, identity, ttlSeconds = 3600, isPublisher = false } = await req.json();
    if (!roomName) {
      return createCorsErrorResponse("roomName is required", 400);
    }
    
    const kid = Deno.env.get('LIVEKIT_API_KEY');
    const secret = Deno.env.get('LIVEKIT_API_SECRET');
    const lkUrl = Deno.env.get('LIVEKIT_URL');
    
    if (!kid || !secret || !lkUrl) {
      return createCorsErrorResponse('LiveKit env not configured', 500);
    }

    const grant: Record<string, unknown> = {
      video: {
        roomJoin: true,
        room: roomName,
        canPublish: !!isPublisher,
        canSubscribe: true,
        canPublishData: true,
      }
    };
    
    const now = Math.floor(Date.now() / 1000);
    const token = await new SignJWT(grant)
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT', kid })
      .setIssuer(kid)
      .setSubject(identity || 'anon')
      .setAudience(lkUrl)
      .setIssuedAt(now)
      .setExpirationTime(now + Number(ttlSeconds))
      .sign(enc(secret));

    return createCorsSuccessResponse({ url: lkUrl, token });
  } catch (e) {
    console.error('LiveKit token generation error:', e);
    return createCorsErrorResponse(e instanceof Error ? e : new Error(String(e)), 400);
  }
});
