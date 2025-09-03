import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { rateLimit } from "../_utils/security.ts";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": Deno.env.get("SITE_URL") ?? "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-idempotency-key",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return new Response("Method not allowed", { headers: corsHeaders, status: 405 });
  try {
    const site = Deno.env.get('SITE_URL') || '';
    const origin = req.headers.get('origin') || '';
    if (site && origin && !origin.startsWith(site)) return new Response(JSON.stringify({ error: 'Forbidden origin' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 });

    const idemp = req.headers.get('x-idempotency-key') || req.headers.get('idempotency-key') || '';
    // TODO: enforce idempotency via storage

    const body = await req.json();
    const lotId = String(body?.lotId || '');
    const amount = Number(body?.amount);
    if (!lotId || !Number.isFinite(amount) || amount <= 0) return new Response(JSON.stringify({ error: 'Invalid input' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 });

    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    if (!rateLimit(`${origin}:${ip}:place-bid`, 60, 60_000)) return new Response(JSON.stringify({ error: 'Rate limit' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 429 });

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !supabaseKey) throw new Error("Missing Supabase env");
    const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });

    // Validate step
    const { data: priceRow } = await supabase.from('lot_prices').select('*').eq('lot_id', lotId).maybeSingle();
    const current = Number(priceRow?.current_price || 0);
    const incRes = await supabase.rpc('compute_increment', { p_price: current });
    const step = Number(incRes?.data || 1);
    const minNext = current + step;
    if (amount < minNext) return new Response(JSON.stringify({ error: 'Under minimum' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 });

    // Accept bid: update price
    await supabase.from('lot_prices').upsert({ lot_id: lotId, current_price: amount, updated_at: new Date().toISOString() });

    // Trigger anti-snipe extend if needed
    const nowIso = new Date().toISOString();
    await supabase.rpc('extend_lot_if_needed', { p_lot_id: lotId, p_now: nowIso });

    return new Response(JSON.stringify({ ok: true, currentPrice: amount }), { headers: { ...corsHeaders, 'Content-Type': 'application/json', 'x-idempotency-key': idemp }, status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 });
  }
});

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.55.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": Deno.env.get("SITE_URL") ?? "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 405 });
    }

    const { lot_id, offered, max } = await req.json();
    if (!lot_id || typeof offered !== "number") {
      return new Response(JSON.stringify({ error: "lot_id and offered are required" }), { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 });
    }
    const token = authHeader.replace("Bearer ", "");

    const supabase = createClient(supabaseUrl, anonKey, {
      auth: { persistSession: false },
      global: { headers: { Authorization: `Bearer ${token}` } },
      db: { schema: "public" },
    });

    // Use public wrapper which handles auth.uid() internally and delegates to app.place_bid
    const { data, error } = await supabase.rpc("place_bid", {
      lot_id,
      offered,
      max: typeof max === "number" ? max : null,
    });
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 });
    }

    return new Response(JSON.stringify({ ok: true, result: data }), { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 });
  }
});

