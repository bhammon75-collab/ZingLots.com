import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve((_req) => {
  return new Response(JSON.stringify({ ok: true, ping: "pong" }), {
    headers: { "Content-Type": "application/json" },
  });
});