import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

// Allowlist (prod, www, vercel preview, local dev)
const ALLOW = new Set<string>([
  "https://zinglots.com",
  "https://www.zinglots.com",
  "https://zing-lots-com.vercel.app",
  "http://localhost:5173",
  "https://localhost:5173",
  "http://localhost:3000",
  "http://localhost:9999",
]);

function pickOrigin(origin: string | null): string | null {
  if (!origin) return null;
  try {
    const u = new URL(origin);
    const h = u.hostname;

    if (ALLOW.has(origin)) return origin;

    // vercel preview like zing-lots-com-git-<branch>.<user>.vercel.app
    if (h.endsWith(".vercel.app") && h.startsWith("zing-lots-com")) return origin;

    // any *.zinglots.com (future subdomains)
    if (h === "zinglots.com" || h.endsWith(".zinglots.com")) return `${u.protocol}//${h}`;
  } catch {
    // Ignore errors
  }
  return null;
}

function corsHeaders(origin: string | null): Headers {
  const allowed = pickOrigin(origin);
  const h = new Headers();

  if (allowed) h.set("Access-Control-Allow-Origin", allowed);
  h.set("Vary", "Origin");
  h.set("Access-Control-Allow-Credentials", "true");
  h.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  h.set("Access-Control-Allow-Headers", "authorization, x-client-info, apikey, content-type");
  h.set("Access-Control-Max-Age", "86400");
  h.set("Content-Type", "application/json");
  return h;
}

serve((req) => {
  const origin = req.headers.get("Origin");
  const headers = corsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers,
    });
  }

  return new Response(JSON.stringify({ ok: true, ping: "pong", ts: new Date().toISOString() }), {
    status: 200,
    headers,
  });
});