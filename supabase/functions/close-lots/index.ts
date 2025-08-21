import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.55.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": Deno.env.get("SITE_URL") ?? "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type LotRow = { id: string; show_id: string; ends_at: string | null; status: string };

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    if (!supabaseUrl || !serviceKey) throw new Error("Missing Supabase envs");

    const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false }, db: { schema: 'app' } });
    const userClient = createClient(supabaseUrl, anonKey, { auth: { persistSession: false }, db: { schema: 'app' } });

    const { data: lots, error: lErr } = await admin
      .from('lots')
      .select('id, show_id, ends_at, status')
      .eq('status', 'running')
      .lte('ends_at', new Date().toISOString());
    if (lErr) throw new Error(`Query lots error: ${lErr.message}`);

    const endedLots = (lots || []) as LotRow[];
    if (endedLots.length === 0) {
      return new Response(JSON.stringify({ ok: true, processed: 0 }), { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 });
    }

    let processed = 0;
    for (const lot of endedLots) {
      const { data: result, error: endErr } = await admin.rpc('end_lot', { p_lot: lot.id });
      if (endErr) {
        console.error('end_lot error', lot.id, endErr.message);
        continue;
      }

      processed += 1;

      try {
        const winnerId = (result as any)?.[0]?.winner_id as string | null | undefined;
        const orderId = (result as any)?.[0]?.order_id as string | null | undefined;

        if (winnerId) {
          const { data: show } = await admin.from('shows').select('seller_id').eq('id', lot.show_id).single();

          const winnerUser = winnerId ? await admin.auth.admin.getUserById(winnerId) : null;
          const sellerUser = show?.seller_id ? await admin.auth.admin.getUserById(show.seller_id) : null;
          const winnerEmail = winnerUser?.data.user?.email ?? null;
          const sellerEmail = sellerUser?.data.user?.email ?? null;

          const siteUrl = Deno.env.get('SITE_URL') ?? '';
          const orderUrl = orderId ? `${siteUrl}/cart?order=${orderId}` : `${siteUrl}/cart`;

          const send = async (to: string | null, subject: string, html: string) => {
            if (!to) return;
            await userClient.functions.invoke('email-send', { body: { to, subject, html } }).catch(() => {});
          };
          await Promise.all([
            send(winnerEmail, 'You won an auction!', `<p>Congrats! View and pay your invoice: <a href="${orderUrl}">${orderUrl}</a></p>`),
            send(sellerEmail, 'Your lot has sold', `<p>Your lot has a winner. Order ${orderId ?? ''} created.</p>`),
          ]);

          await admin.from('chat_messages').insert({
            show_id: lot.show_id,
            profile_id: winnerId,
            message: `Order ${orderId ?? ''} created. Please coordinate pickup.`,
          });
        } else {
          await admin.from('lots').update({ status: 'unsold' }).eq('id', lot.id);
        }
      } catch (notifyErr) {
        console.error('Notification error', lot.id, (notifyErr as Error).message);
      }
    }

    return new Response(JSON.stringify({ ok: true, processed }), { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 });
  }
});

