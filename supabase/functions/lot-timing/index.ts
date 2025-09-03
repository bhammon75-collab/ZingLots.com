import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !supabaseKey) throw new Error("Missing Supabase env");
    const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });

    const nowIso = new Date().toISOString();

    let endAtIso = nowIso;
    let extensionsUsed = 0;
    let antiSnipeWindowSec = 120;
    let maxExtensions = 5;

    if (extend) {
      // Use transactional helper to extend if needed
      const { data, error } = await supabase.rpc('extend_lot_if_needed', { p_lot_id: lotId, p_now: nowIso });
      if (error) throw error;
      endAtIso = data.end_at;
      extensionsUsed = data.extensions_used;
      antiSnipeWindowSec = data.anti_snipe_window_sec;
      maxExtensions = data.max_extensions;
    } else {
      // Read current timing
      const { data, error } = await supabase.from('lot_closing').select('*').eq('lot_id', lotId).maybeSingle();
      if (error) throw error;
      if (data) {
        endAtIso = data.end_at;
        extensionsUsed = data.extensions_used;
        antiSnipeWindowSec = data.anti_snipe_window_sec;
        maxExtensions = data.max_extensions;
      } else {
        // default seed if missing
        endAtIso = new Date(Date.now() + 10 * 60 * 1000).toISOString();
      }
    }

    const payload = {
      lotId,
      endAt: endAtIso,
      serverNow: nowIso,
      antiSnipeWindowSec,
      maxExtensions,
      extensionsUsed,
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

