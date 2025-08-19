/**
 * Shared CORS configuration for all Edge Functions
 * Multi-origin aware via SITE_ORIGINS, backward-compatible with SITE_URL
 */

function resolveAllowedOrigin(requestOrigin: string | null) {
  const siteOriginsRaw = Deno.env.get("SITE_ORIGINS") ?? "";
  const siteUrl = Deno.env.get("SITE_URL") ?? "";
  const allowedList = siteOriginsRaw.split(",").map(s => s.trim()).filter(Boolean);

  // If multi-origin list is present, try to echo the caller
  if (allowedList.length > 0) {
    if (requestOrigin && allowedList.includes(requestOrigin)) return requestOrigin;
    return allowedList[0]; // safe fallback to your first allowed origin
  }

  // Legacy single-origin or permissive fallback
  if (siteUrl) return siteUrl;
  return "*";
}

export function getCorsHeaders(
  methods: string = "GET, POST, PUT, DELETE, OPTIONS",
  origin?: string | null,
  requestHeaders?: string | null,
): Record<string, string> {
  const allowedOrigin = resolveAllowedOrigin(origin ?? null);
  const allowHeaders =
    (requestHeaders && requestHeaders.length > 0)
      ? requestHeaders
      : "authorization, x-client-info, apikey, content-type";

  return {
    // *** Always present: this is what your browser is looking for ***
    "Access-Control-Allow-Origin": allowedOrigin,

    // Help proxies/caches keep variants per origin
    "Vary": "Origin",

    // Required by preflight: echo requested headers if provided
    "Access-Control-Allow-Headers": allowHeaders,

    // Required by preflight
    "Access-Control-Allow-Methods": methods,

    // Keep if you ever use cookies with cross-site requests
    "Access-Control-Allow-Credentials": "true",

    "Access-Control-Max-Age": "86400",
  };
}

export function handleCorsPreflightRequest(
  methods: string = "GET, POST, PUT, DELETE, OPTIONS",
  origin?: string | null,
  requestHeaders?: string | null,
): Response {
  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(methods, origin, requestHeaders),
  });
}

export function createCorsErrorResponse(
  error: string | Error,
  status: number = 400,
  methods: string = "GET, POST, PUT, DELETE, OPTIONS",
  origin?: string | null,
  requestHeaders?: string | null,
): Response {
  const msg = error instanceof Error ? error.message : String(error);
  return new Response(JSON.stringify({ error: msg }), {
    status,
    headers: { ...getCorsHeaders(methods, origin, requestHeaders), "Content-Type": "application/json" },
  });
}

export function createCorsSuccessResponse(
  data: any,
  status: number = 200,
  methods: string = "GET, POST, PUT, DELETE, OPTIONS",
  origin?: string | null,
  requestHeaders?: string | null,
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...getCorsHeaders(methods, origin, requestHeaders), "Content-Type": "application/json" },
  });
}