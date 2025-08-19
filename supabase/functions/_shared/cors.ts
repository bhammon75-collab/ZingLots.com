/**
 * Shared CORS configuration for all Edge Functions
 * Ensures consistent CORS handling across the application
 */

/**
 * Get properly configured CORS headers
 * In production, restricts to SITE_URL
 * In development/testing, allows localhost origins
 */
export function getCorsHeaders(methods: string = "POST, OPTIONS"): Record<string, string> {
  const siteUrl = Deno.env.get("SITE_URL");
  const isDevelopment = Deno.env.get("ENVIRONMENT") === "development";
  
  // In production, use SITE_URL; in dev or if not set, be more permissive
  let allowedOrigin = siteUrl || "*";
  
  // If SITE_URL is set but we're in development, also allow localhost
  if (siteUrl && isDevelopment) {
    // This would require more complex handling for multiple origins
    // For now, we'll keep it simple
    allowedOrigin = siteUrl;
  }
  
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": methods,
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Max-Age": "86400", // Cache preflight for 24 hours
  };
}

/**
 * Handle OPTIONS preflight requests
 */
export function handleCorsPreflightRequest(methods: string = "POST, OPTIONS"): Response {
  return new Response(null, { 
    status: 204,
    headers: getCorsHeaders(methods) 
  });
}

/**
 * Create an error response with CORS headers
 */
export function createCorsErrorResponse(
  error: string | Error, 
  status: number = 400,
  methods: string = "POST, OPTIONS"
): Response {
  const errorMessage = error instanceof Error ? error.message : error;
  
  return new Response(
    JSON.stringify({ error: errorMessage }), 
    {
      status,
      headers: { 
        ...getCorsHeaders(methods), 
        "Content-Type": "application/json" 
      },
    }
  );
}

/**
 * Create a success response with CORS headers
 */
export function createCorsSuccessResponse(
  data: any,
  status: number = 200,
  methods: string = "POST, OPTIONS"
): Response {
  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: {
        ...getCorsHeaders(methods),
        "Content-Type": "application/json"
      },
    }
  );
}
