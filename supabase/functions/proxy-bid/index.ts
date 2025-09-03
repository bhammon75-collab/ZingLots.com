import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { rateLimit } from "../_utils/security.ts";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": Deno.env.get("SITE_URL") ?? "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 405,
    });
  }

  try {
    const idempotencyKey = req.headers.get('x-idempotency-key') || req.headers.get('idempotency-key') || '';
    const origin = req.headers.get('origin') || '';
    const site = Deno.env.get('SITE_URL') || '';
    if (site && origin && !origin.startsWith(site)) {
      return new Response(JSON.stringify({ error: 'Forbidden origin' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 });
    }

    // Rate limit by origin/IP (simple)
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    if (!rateLimit(`${origin}:${ip}:proxy-bid`, 60, 60_000)) {
      return new Response(JSON.stringify({ error: 'Rate limit' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 429 });
    }

    const body = await req.json();
    const lotId = String(body?.lotId || "");
    const userId = String(body?.userId || "");
    const maxAmount = Number(body?.maxAmount);
    if (!lotId || !userId || !Number.isFinite(maxAmount) || maxAmount <= 0) {
      return new Response(JSON.stringify({ error: "Invalid input" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !supabaseKey) throw new Error("Missing Supabase env");
    const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });

    // TODO: enforce idempotency persistence — accept header for now; return 409 on duplicate if needed

    // Upsert proxy
    const { error: upErr } = await supabase
      .from('proxy_bids')
      .upsert({ lot_id: lotId, user_id: userId, max_amount: maxAmount }, { onConflict: 'lot_id,user_id' });
    if (upErr) throw upErr;

    // Evaluate proxies for the lot (simplified)
    const { data: proxies, error: pErr } = await supabase
      .from('proxy_bids')
      .select('*')
      .eq('lot_id', lotId)
      .order('max_amount', { ascending: false });
    if (pErr) throw pErr;

    // Fetch current price
    const { data: priceRow } = await supabase.from('lot_prices').select('*').eq('lot_id', lotId).maybeSingle();
    const current = Number(priceRow?.current_price || 0);
    const incRes = await supabase.rpc('compute_increment', { p_price: current });
    const step = Number(incRes?.data || 1);

    let leaderUserId = userId;
    let newPrice = current;
    if (proxies && proxies.length > 0) {
      const top = proxies[0];
      const second = proxies.length > 1 ? proxies[1] : null;
      if (second) {
        newPrice = Math.max(current, Math.min(Number(top.max_amount), Number(second.max_amount) + step));
        leaderUserId = String(top.user_id);
      } else {
        newPrice = Math.max(current, step + Number(priceRow?.start_price || 0));
        leaderUserId = String(top.user_id);
      }
    }

    if (newPrice > current) {
      await supabase.from('lot_prices').upsert({ lot_id: lotId, current_price: newPrice, updated_at: new Date().toISOString() });
      // Optionally insert a system bid record in a bids table (not included here)
    }

    const response = { ok: true, lotId, currentPrice: newPrice, leaderUserId };
    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json", 'x-idempotency-key': idempotencyKey },
      status: 200,
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});

