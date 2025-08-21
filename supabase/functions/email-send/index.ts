import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

type EmailPayload = {
  to: string;
  subject: string;
  text?: string;
  html?: string;
};

const cors = {
  "Access-Control-Allow-Origin": Deno.env.get("SITE_URL") ?? "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

async function sendViaResend(payload: EmailPayload) {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  const from = Deno.env.get("EMAIL_FROM") || "noreply@example.com";
  if (!apiKey) throw new Error("RESEND_API_KEY not set");
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: payload.to, subject: payload.subject, html: payload.html ?? undefined, text: payload.text ?? undefined }),
  });
  if (!res.ok) throw new Error(`Resend error ${res.status}: ${await res.text()}`);
  return await res.json();
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  try {
    const auth = req.headers.get("authorization") || req.headers.get("Authorization");
    if (!auth) return new Response(JSON.stringify({ error: "Unauthorized" }), { headers: { ...cors, "Content-Type": "application/json" }, status: 401 });

    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return new Response(JSON.stringify({ error: "Content-Type must be application/json" }), { headers: { ...cors, "Content-Type": "application/json" }, status: 400 });
    }

    const body = (await req.json()) as EmailPayload;
    if (!body?.to || !body?.subject || (!body.text && !body.html)) {
      return new Response(JSON.stringify({ error: "to, subject, and text or html are required" }), { headers: { ...cors, "Content-Type": "application/json" }, status: 400 });
    }

    const result = await sendViaResend(body);
    return new Response(JSON.stringify({ ok: true, result }), { headers: { ...cors, "Content-Type": "application/json" }, status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), { headers: { ...cors, "Content-Type": "application/json" }, status: 400 });
  }
});

