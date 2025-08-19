// supabase/functions/ping/index.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

// Allow your known origins: prod, www, vercel preview, local dev
const ALLOWED = new Set<string>([
  "https://zinglots.com",
  "https://www.zinglots.com",
  "https://zing-lots-com.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
]);

function pickOrigin(origin: string | null): string | null {
  if (!origin) return null;
  if (ALLOWED.has(origin)) return origin;

  // allow previews like https://zing-lots-com-git-branch-user.vercel.app
  try {
    const u = new URL(origin);
    if (u.hostname.endsWith(".vercel.app") && u.hostname.startsWith("zing-lots-com")) {
      return origin;
    }
  } catch {}
  return null;
}

function corsHeaders(origin: string | null): HeadersInit {
  const allowed = pickOrigin(origin);
  const h: Record<string, string> = {
    "Vary": "Origin",
    "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type, x-requested-with, cache-control, pragma",
    "Access-Control-Max-Age": "86400",
  };
  if (allowed) {
    h["Access-Control-Allow-Origin"] = allowed;
    // If you later use cookies, also set:
    // h["Access-Control-Allow-Credentials"] = "true";
  }
  return h;
}

serve(async (req: Request) => {
  const origin = req.headers.get("origin");

  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }

  // Normal request
  const body = JSON.stringify({ pong: true, time: new Date().toISOString() });
  return new Response(body, {
    status: 200,
    headers: {
      ...corsHeaders(origin),
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
});
