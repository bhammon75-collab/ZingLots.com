/**
 * Public ping endpoint with solid CORS + preflight handling
 * Works behind Supabase Edge Functions at /functions/v1/ping
 */
Deno.serve((req: Request) => {
  const origin = req.headers.get("Origin") ?? "*";
  const acrh   = req.headers.get("Access-Control-Request-Headers")
             ?? "authorization, x-client-info, apikey, content-type";

  const headers = {
    "Access-Control-Allow-Origin": origin,         // echo caller origin
    "Vary": "Origin",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": acrh,
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Max-Age": "86400",
    "Content-Type": "application/json",
  };

  if (req.method === "OPTIONS") {
    // CORS preflight
    return new Response(null, { status: 204, headers });
  }

  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers,
    });
  }

  return new Response(JSON.stringify({ ok: true, ping: "pong" }), {
    status: 200,
    headers,
  });
});
