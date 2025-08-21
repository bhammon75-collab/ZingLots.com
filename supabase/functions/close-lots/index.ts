import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.55.0";
import { getCorsHeaders } from "../_shared/cors.ts";

type CloseLotsResult = {
  processed: number;
  sold: number;
  unsold: number;
  skipped: number;
};

function computeFunctionsBase(): string {
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  try {
    const u = new URL(supabaseUrl);
    const isLocal = /localhost|127\.0\.0\.1/.test(u.hostname);
    if (isLocal) return `${u.origin}/functions/v1`;
    const projectRef = u.hostname.split(".")[0];
    return `https://${projectRef}.functions.supabase.co/functions/v1`;
  } catch {
    return "/functions/v1";
  }
}

async function postEmail(to: string, subject: string, text: string, html?: string) {
  const base = computeFunctionsBase();
  const anon = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
  const res = await fetch(`${base}/email-send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: anon,
      Authorization: `Bearer ${anon}`,
    },
    body: JSON.stringify({ to, subject, text, html: html ?? text }),
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    console.warn("email-send failed", res.status, errText);
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: getCorsHeaders("POST, OPTIONS", req.headers.get("Origin"), req.headers.get("Access-Control-Request-Headers")) });
  }

  const cors = getCorsHeaders("POST, OPTIONS", req.headers.get("Origin"), req.headers.get("Access-Control-Request-Headers"));

  try {
    // Service role client for system writes
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false }, db: { schema: "app" } });

    // 1) Fetch overdue lots (batch)
    const nowIso = new Date().toISOString();
    const { data: lots, error: eLots } = await supabase
      .from("lots")
      .select("id, title, show_id, winner_id, current_price, reserve_price, reserve_met, status, ends_at")
      .eq("status", "running")
      .lt("ends_at", nowIso)
      .limit(50);
    if (eLots) throw new Error(`fetch lots: ${eLots.message}`);

    let sold = 0;
    let unsold = 0;
    let skipped = 0;

    for (const lot of lots ?? []) {
      try {
        // Idempotency: if an order already exists, skip creating another
        const { data: existingOrder } = await supabase
          .from("orders")
          .select("id, buyer_id")
          .eq("lot_id", lot.id)
          .maybeSingle();
        if (existingOrder) {
          skipped++;
          continue;
        }

        const reserveSatisfied = lot.reserve_price == null || lot.reserve_met === true;
        if (lot.winner_id && reserveSatisfied) {
          const subtotal = Number(lot.current_price ?? 0);

          // Create order (invoice)
          const { data: order, error: eOrder } = await supabase
            .from("orders")
            .insert({ lot_id: lot.id, buyer_id: lot.winner_id, status: "invoiced", subtotal })
            .select("id")
            .single();
          if (eOrder) throw new Error(`create order: ${eOrder.message}`);

          // Mark lot as sold
          const { error: eSold } = await supabase
            .from("lots")
            .update({ status: "sold" })
            .eq("id", lot.id);
          if (eSold) throw new Error(`update lot(sold): ${eSold.message}`);

          // Notify winner and seller
          const { data: show, error: eShow } = await supabase
            .from("shows")
            .select("seller_id")
            .eq("id", lot.show_id)
            .single();
          if (eShow) throw new Error(`fetch show: ${eShow.message}`);

          const admin = supabase.auth.admin;
          const [winnerRes, sellerRes] = await Promise.all([
            admin.getUserById(lot.winner_id as string),
            admin.getUserById(show.seller_id as string),
          ]);
          const siteUrl = Deno.env.get("SITE_URL") ?? "https://zinglots.com";

          const lotTitle = lot.title || "your lot";
          const orderUrl = `${siteUrl.replace(/\/$/, "")}/cart`;
          if (winnerRes?.data?.user?.email) {
            await postEmail(
              winnerRes.data.user.email,
              `You won: ${lotTitle}`,
              `Congrats! You won ${lotTitle}. Pay your invoice: ${orderUrl}`,
            );
          }
          if (sellerRes?.data?.user?.email) {
            await postEmail(
              sellerRes.data.user.email,
              `Your lot sold: ${lotTitle}`,
              `Your lot "${lotTitle}" sold. The buyer has been invoiced.`,
            );
          }

          // Emit agent event
          await supabase.from("agent_events").insert({ type: "close_lots", payload: { lot_id: lot.id, order_id: order.id, status: "sold" }, status: "done" as any }).select();

          sold++;
        } else {
          // No winner or reserve not met -> unsold
          const { error: eUnsold } = await supabase
            .from("lots")
            .update({ status: "unsold" })
            .eq("id", lot.id);
          if (eUnsold) throw new Error(`update lot(unsold): ${eUnsold.message}`);

          // Notify seller only
          const { data: show, error: eShow2 } = await supabase
            .from("shows")
            .select("seller_id")
            .eq("id", lot.show_id)
            .single();
          if (!eShow2 && show?.seller_id) {
            const sellerRes = await supabase.auth.admin.getUserById(show.seller_id as string);
            const sellerEmail = sellerRes?.data?.user?.email;
            if (sellerEmail) {
              await postEmail(
                sellerEmail,
                `Your lot did not sell: ${lot.title}`,
                `Your lot "${lot.title}" did not meet reserve or had no bids. You may relist it.`,
              );
            }
          }

          await supabase.from("agent_events").insert({ type: "close_lots", payload: { lot_id: lot.id, status: "unsold" }, status: "done" as any }).select();
          unsold++;
        }
      } catch (lotErr) {
        console.error("close-lots error for lot", lot?.id, lotErr);
        // best-effort emit error event for observability
        try {
          await createClient(supabaseUrl, serviceKey, { auth: { persistSession: false }, db: { schema: "app" } })
            .from("agent_events")
            .insert({ type: "close_lots", payload: { lot_id: lot?.id }, status: "error", error: String(lotErr) as any });
        } catch (_) {
          // ignore
        }
      }
    }

    const result: CloseLotsResult = {
      processed: (lots ?? []).length,
      sold,
      unsold,
      skipped,
    };
    return new Response(JSON.stringify(result), { headers: { ...cors, "Content-Type": "application/json" }, status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), { headers: { ...cors, "Content-Type": "application/json" }, status: 500 });
  }
});

