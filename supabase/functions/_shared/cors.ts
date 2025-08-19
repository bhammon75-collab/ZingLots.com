/**
 * Shared CORS configuration for all Edge Functions
 * Multi-origin aware via SITE_ORIGINS, backward-compatible with SITE_URL
 */

function resolveAllowedOrigin(requestOrigin: string | null) {
  const siteOriginsRaw = Deno.env.get("SITE_ORIGINS") ?? "";
  const siteUrl = Deno.env.get("SITE_URL") ?? ""; // legacy single-origin fallback

  const allowedList = siteOriginsRaw
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);

  // If multi-origin list is present, echo back the matching origin
  if (allowedList.length > 0) {
    if (requestOrigin && allowedList.includes(requestOrigin)) {
      return requestOrigin; // echo caller when allowed
    }
    // Fallback to first allowed origin (safer than "*")
    return allowedList[0];
  }

  // Legacy behavior: prefer SITE_URL if set, else "*"
  if (siteUrl) return siteUrl;
  return "*";
}

/**
 * Get properly configured CORS headers
 * If origin is passed, we can echo it when allowed.
 * Default methods: "GET, POST, PUT, DELETE, OPTIONS"
 */
export function getCorsHeaders(
  methods: string = "GET, POST, PUT, DELETE, OPTIONS",
  origin?: string | null
): Record<string, string> {
  const allowedOrigin = resolveAllowedOrigin(origin ?? null);
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Vary": "Origin",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": methods,
    // If you don't use cookies with cross-site fetch, you can remove this line:
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Max-Age": "
New-Item -ItemType Directory -Force .\supabase\functions\_shared | Out-Null
@'
/**
 * Shared CORS configuration for all Edge Functions
 * Multi-origin aware via SITE_ORIGINS, backward-compatible with SITE_URL
 */

function resolveAllowedOrigin(requestOrigin: string | null) {
  const siteOriginsRaw = Deno.env.get("SITE_ORIGINS") ?? "";
  const siteUrl = Deno.env.get("SITE_URL") ?? ""; // legacy single-origin fallback

  const allowedList = siteOriginsRaw
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);

  // If multi-origin list is present, echo back the matching origin
  if (allowedList.length > 0) {
    if (requestOrigin && allowedList.includes(requestOrigin)) {
      return requestOrigin; // echo caller when allowed
    }
    // Fallback to first allowed origin (safer than "*")
    return allowedList[0];
  }

  // Legacy behavior: prefer SITE_URL if set, else "*"
  if (siteUrl) return siteUrl;
  return "*";
}

/**
 * Get properly configured CORS headers
 * If origin is passed, we can echo it when allowed.
 * Default methods: "GET, POST, PUT, DELETE, OPTIONS"
 */
export function getCorsHeaders(
  methods: string = "GET, POST, PUT, DELETE, OPTIONS",
  origin?: string | null
): Record<string, string> {
  const allowedOrigin = resolveAllowedOrigin(origin ?? null);
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Vary": "Origin",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": methods,
    // If you don't use cookies with cross-site fetch, you can remove this line:
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Max-Age": "86400",
  };
}

/**
 * Handle OPTIONS preflight requests
 */
export function handleCorsPreflightRequest(
  methods: string = "GET, POST, PUT, DELETE, OPTIONS",
  origin?: string | null
): Response {
  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(methods, origin),
  });
}

/**
 * Create an error response with CORS headers
 */
export function createCorsErrorResponse(
  error: string | Error,
  status: number = 400,
  methods: string = "GET, POST, PUT, DELETE, OPTIONS",
  origin?: string | null
): Response {
  const errorMessage = error instanceof Error ? error.message : error;
  return new Response(JSON.stringify({ error: errorMessage }), {
    status,
    headers: {
      ...getCorsHeaders(methods, origin),
      "Content-Type": "application/json",
    },
  });
}

/**
 * Create a success response with CORS headers
 */
export function createCorsSuccessResponse(
  data: any,
  status: number = 200,
  methods: string = "GET, POST, PUT, DELETE, OPTIONS",
  origin?: string | null
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...getCorsHeaders(methods, origin),
      "Content-Type": "application/json",
    },
  });
}