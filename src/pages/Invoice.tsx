import { Helmet } from "react-helmet-async";
import ZingNav from "@/components/ZingNav";
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabaseClient";
import { PayNowButton } from "@/components/PayNowButton";
import { OrderSummary } from "@/components/orders/OrderSummary";

interface OrderRow {
  id: string;
  status: 'invoiced'|'paid'|'shipped'|'settled'|'refunded';
  subtotal: number;
  fees_bps: number;
  shipping_cents: number;
  shipping_tracking: string | null;
  shipping_carrier: string | null;
  label_url: string | null;
  buyer_premium_pct?: number | null;
  card_fee_pct?: number | null;
}

const Invoice = () => {
  const [orders, setOrders] = useState<OrderRow[]>([]);

  useEffect(() => {
    (async () => {
      const sb = getSupabase();
      if (!sb) return;
      const { data: u } = await sb.auth.getUser();
      if (!u.user) return;
      const { data } = await sb
        .schema('app')
        .from('orders')
        .select('id, status, subtotal, fees_bps, shipping_cents, shipping_tracking, shipping_carrier, label_url, buyer_premium_pct, card_fee_pct')
        .eq('buyer_id', u.user.id)
        .order('created_at', { ascending: false });
      setOrders((data as any) || []);
    })();
  }, []);

  const invoices = orders.filter(o => o.status === 'invoiced');
  const paid = orders.filter(o => o.status === 'paid');

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Invoices | ZingLots</title>
        <meta name="description" content="Review invoices and complete secure checkout with Stripe." />
        <link rel="canonical" href="/cart" />
      </Helmet>
      <ZingNav />
      <main className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold">Invoices</h1>
        <p className="mt-2 text-muted-foreground">Your open and paid invoices will appear here.</p>

        {invoices.length > 0 && (
          <section className="mt-10">
            <h2 className="text-2xl font-semibold mb-4">Open Invoices</h2>
            <div className="grid gap-4">
              {invoices.map(o => {
                const subtotal = o.subtotal / 100;
                const shipping = o.shipping_cents / 100;
                
                return (
                  <div key={o.id} className="bg-card border rounded-lg p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold">Invoice #{o.id.slice(-8)}</h3>
                        <OrderSummary 
                          itemPrice={subtotal}
                          shipping={shipping}
                          bpOverridePct={o.buyer_premium_pct}
                          cardOverridePct={o.card_fee_pct}
                        />
                      </div>
                      <PayNowButton orderId={o.id} />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {paid.length > 0 && (
          <section className="mt-10">
            <h2 className="text-2xl font-semibold mb-4">Paid Orders</h2>
            <div className="grid gap-4">
              {paid.map(o => {
                const subtotal = o.subtotal / 100;
                const shipping = o.shipping_cents / 100;
                
                return (
                  <div key={o.id} className="bg-card border rounded-lg p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold">Order #{o.id.slice(-8)}</h3>
                        <div className="text-sm text-muted-foreground mb-3">Status: {o.status}</div>
                        <OrderSummary 
                          itemPrice={subtotal}
                          shipping={shipping}
                          bpOverridePct={o.buyer_premium_pct}
                          cardOverridePct={o.card_fee_pct}
                        />
                        {o.shipping_tracking && (
                          <div className="mt-4 p-3 bg-muted rounded">
                            <div className="text-sm font-medium">Tracking Information</div>
                            <div className="text-sm">
                              {o.shipping_carrier}: {o.shipping_tracking}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {invoices.length === 0 && paid.length === 0 && (
          <div className="mt-10 text-center text-muted-foreground">
            No invoices yet. Win an auction to see your first invoice here.
          </div>
        )}
      </main>
    </div>
  );
};

export default Invoice;

