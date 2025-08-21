import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.55.0";
import { getCorsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: getCorsHeaders("POST, OPTIONS", req.headers.get("Origin"), req.headers.get("Access-Control-Request-Headers")) });
  }

  const cors = getCorsHeaders("POST, OPTIONS", req.headers.get("Origin"), req.headers.get("Access-Control-Request-Headers"));
  const token = req.headers.get("x-zinglots-agent-token");
  if (!token || token !== (Deno.env.get("ZINGLOTS_AGENT_TOKEN") ?? "")) {
    return new Response("unauthorized", { status: 401, headers: cors });
  }

  try {
    const body = await req.json();
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false }, db: { schema: "app" } }
    );

    if (body?.type === "valuation" && body.lot_id && body.suggestion) {
      await supabase.from("lots").update({ valuation_suggest: body.suggestion }).eq("id", body.lot_id);
    }

    await supabase.from("agent_events").insert({ type: body?.type ?? "unknown", payload: body, status: "applied" as any });
    return new Response(JSON.stringify({ ok: true }), { headers: { ...cors, "Content-Type": "application/json" }, status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), { headers: { ...cors, "Content-Type": "application/json" }, status: 500 });
  }
});

