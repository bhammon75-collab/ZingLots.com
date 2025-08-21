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

