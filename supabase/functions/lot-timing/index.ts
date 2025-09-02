import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": Deno.env.get("SITE_URL") ?? "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  const url = new URL(req.url);
  const lotId = url.searchParams.get("lotId") ?? "unknown";
  const extend = url.searchParams.get("extend") === "1";

  try {
    // In-memory stub store (per function instance)
    // For demo purposes only; real impl uses DB with row-level locking
    // deno-lint-ignore no-explicit-any
    const store = (globalThis as any).__LOT_TIMING__ || ((globalThis as any).__LOT_TIMING__ = new Map<string, { endAt: number; extensionsUsed: number }>());

    const now = new Date();
    const windowSec = 120;
    const maxExt = 5;
    const extendByMs = 2 * 60 * 1000; // 2 minutes per extension

    let record = store.get(lotId);
    if (!record) {
      record = { endAt: now.getTime() + 10 * 60 * 1000, extensionsUsed: 0 };
      store.set(lotId, record);
    }

    // Anti-snipe extend when requested and within window
    if (extend && record.extensionsUsed < maxExt) {
      const remainingMs = record.endAt - now.getTime();
      if (remainingMs <= windowSec * 1000) {
        record.endAt = now.getTime() + extendByMs;
        record.extensionsUsed += 1;
      }
    }

    const payload = {
      lotId,
      endAt: new Date(record.endAt).toISOString(),
      serverNow: now.toISOString(),
      antiSnipeWindowSec: windowSec,
      maxExtensions: maxExt,
      extensionsUsed: record.extensionsUsed,
    };

    return new Response(JSON.stringify(payload), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});

