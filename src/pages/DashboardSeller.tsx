import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getSupabase } from "@/lib/supabaseClient";
import { useToast } from "@/components/ui/use-toast";
import ShippingTrackingDialog from "@/components/ShippingTrackingDialog";
import { Button as UIButton } from "@/components/ui/button";
import { getSupabase as getSb } from "@/lib/supabaseClient";
import { toast as showToast } from "@/components/ui/use-toast";
import AnalyticsDashboard from "@/components/seller/AnalyticsDashboard";
import BulkLotManager from "@/components/seller/BulkLotManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface OrderRow {
  id: string;
  status: 'invoiced'|'paid'|'shipped'|'settled'|'refunded';
  subtotal: number;
  fees_bps: number;
  shipping_cents: number;
  shipping_tracking: string | null;
  shipping_carrier: string | null;
  label_url: string | null;
}

interface SellerData {
  kyc_status: string;
  stripe_account_id: string | null;
  connect_details_submitted: boolean | null;
  connect_charges_enabled: boolean | null;
  connect_payouts_enabled: boolean | null;
  connect_requirements: string[] | null;
}

interface SellerInfo {
  verified: boolean;
  hasStripe: boolean;
  connectDetailsSubmitted?: boolean;
  connectChargesEnabled?: boolean;
  connectPayoutsEnabled?: boolean;
  connectRequirements?: string[] | null;
}

interface OnboardingResponse {
  url?: string;
}

// Proper error handling instead of unsafe casting
interface ErrorWithMessage {
  message: string;
}

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
}

function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
  if (isErrorWithMessage(maybeError)) return maybeError;
  
  try {
    return new Error(JSON.stringify(maybeError));
  } catch {
    return new Error(String(maybeError));
  }
}

// Type guards for safe data validation
function isValidSellerData(data: unknown): data is SellerData {
  if (!data || typeof data !== 'object') return false;
  const seller = data as Record<string, unknown>;
  
  return (
    typeof seller.kyc_status === 'string' &&
    (seller.stripe_account_id === null || typeof seller.stripe_account_id === 'string') &&
    (seller.connect_details_submitted === null || typeof seller.connect_details_submitted === 'boolean') &&
    (seller.connect_charges_enabled === null || typeof seller.connect_charges_enabled === 'boolean') &&
    (seller.connect_payouts_enabled === null || typeof seller.connect_payouts_enabled === 'boolean') &&
    (seller.connect_requirements === null || Array.isArray(seller.connect_requirements))
  );
}

function isValidOrdersArray(data: unknown): data is OrderRow[] {
  if (!Array.isArray(data)) return false;
  
  return data.every(order => 
    order &&
    typeof order === 'object' &&
    typeof order.id === 'string' &&
    typeof order.status === 'string' &&
    typeof order.subtotal === 'number' &&
    typeof order.fees_bps === 'number' &&
    typeof order.shipping_cents === 'number' &&
    (order.shipping_tracking === null || typeof order.shipping_tracking === 'string') &&
    (order.shipping_carrier === null || typeof order.shipping_carrier === 'string') &&
    (order.label_url === null || typeof order.label_url === 'string')
  );
}

function isValidOnboardingResponse(data: unknown): data is OnboardingResponse {
  if (!data || typeof data !== 'object') return false;
  const response = data as Record<string, unknown>;
  
  return (
    response.url === undefined || typeof response.url === 'string'
  );
}

const DashboardSeller = () => {
  const [sellerInfo, setSellerInfo] = useState<SellerInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [paidOrders, setPaidOrders] = useState<OrderRow[]>([]);
  const [onboardingLoading, setOnboardingLoading] = useState(false);
  const [trackingOpen, setTrackingOpen] = useState(false);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [sellerId, setSellerId] = useState<string | null>(null);
  // Live shows removed from product; keep state minimal
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      try {
        const sb = getSupabase();
        if (!sb) { setSellerInfo(null); setLoading(false); return; }
        const { data: u } = await sb.auth.getUser();
        const uid = u.user?.id;
        if (!uid) { setSellerInfo(null); setLoading(false); return; }
        setSellerId(uid);
        
        const { data, error } = await sb
          .schema('app')
          .from('sellers')
          .select('kyc_status, stripe_account_id, connect_details_submitted, connect_charges_enabled, connect_payouts_enabled, connect_requirements')
          .eq('id', uid)
          .maybeSingle();
        if (error) throw error;
        
        // Use type guard instead of unsafe casting
        if (!isValidSellerData(data)) {
          setSellerInfo(null);
          setLoading(false);
          return;
        }

        const details = Boolean(data.connect_details_submitted);
        const charges = Boolean(data.connect_charges_enabled);
        const payouts = Boolean(data.connect_payouts_enabled);
        const hasStripe = Boolean(data.stripe_account_id);
        const verified = (data.kyc_status === 'verified') || details;
        
        setSellerInfo({
          verified,
          hasStripe,
          connectDetailsSubmitted: details,
          connectChargesEnabled: charges,
          connectPayoutsEnabled: payouts,
          connectRequirements: data.connect_requirements ?? null,
        });

        // Live shows deprecated: no-op

        // Attempt to fetch paid orders with type safety
        const { data: orders } = await sb
          .schema('app')
          .from('orders')
          .select('id, status, subtotal, fees_bps, shipping_cents, shipping_tracking, shipping_carrier, label_url, lot_id')
          .eq('status', 'paid');
        
        if (isValidOrdersArray(orders)) {
          setPaidOrders(orders);
        } else {
          setPaidOrders([]);
        }
      } catch {
        setSellerInfo(null);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const canGoLive = !!((sellerInfo?.verified && sellerInfo?.hasStripe) || sellerInfo?.connectDetailsSubmitted);

  const startOnboarding = async () => {
    const sb = getSupabase();
    if (!sb) return;
    try {
      setOnboardingLoading(true);
      const { data: u } = await sb.auth.getUser();
      const uid = u.user?.id;
      if (!uid) throw new Error('Not signed in');

      const { data, error } = await sb.functions.invoke('stripe-connect-onboard', { body: {} });
      if (error) throw error;
      
      // Type-safe response handling
      if (!isValidOnboardingResponse(data)) {
        throw new Error('Invalid onboarding response format');
      }
      
      const url = data.url;
      if (url) {
        window.open(url, '_blank');
      } else {
        toast({ variant: 'destructive', title: 'Onboarding error', description: 'No onboarding URL returned.' });
      }
    } catch (error: unknown) {
      const errorWithMessage = toErrorWithMessage(error);
      toast({ variant: 'destructive', title: 'Onboarding failed', description: errorWithMessage.message });
    } finally {
      setOnboardingLoading(false);
    }
  };

  // Live shows deprecated: remove actions
  const goLive = async () => { toast({ title: 'Action unavailable', description: 'Live shows are no longer supported.' }); };

  const startLot = async () => { toast({ title: 'Action unavailable', description: 'Live shows are no longer supported.' }); };

  const openTracking = (orderId: string) => {
    setActiveOrderId(orderId);
    setTrackingOpen(true);
  };

  const saveTracking = async (values: { carrier: string; tracking_number: string; tracking_url?: string }) => {
    const sb = getSupabase();
    if (!sb || !activeOrderId) return;
    const { error } = await sb.functions.invoke('orders-set-tracking', {
      body: { order_id: activeOrderId, ...values },
    });
    if (error) {
      toast({ variant: 'destructive', title: 'Tracking update failed', description: error.message });
      return;
    }
    toast({ title: 'Tracking saved', description: 'Order marked as shipped.' });
    // Refresh list with type safety
    const { data: orders } = await sb
      .schema('app')
      .from('orders')
      .select('id, status, subtotal, fees_bps, shipping_cents, shipping_tracking, shipping_carrier, label_url, lot_id')
      .eq('status', 'paid');
    
    if (isValidOrdersArray(orders)) {
      setPaidOrders(orders);
    }
  };

  const netDue = (o: OrderRow) => {
    const fee = (o.fees_bps / 10000) * Number(o.subtotal);
    return (Number(o.subtotal) - fee).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Seller Dashboard | ZingLots</title>
        <meta name="description" content="Manage lots, shows, KYC, and payouts on ZingLots." />
        <link rel="canonical" href="/dashboard/seller" />
      </Helmet>
      {/* Header already provided by global AppShell; remove extra nav to avoid duplicate logos */}
      <main className="container mx-auto grid gap-6 px-4 py-10 md:grid-cols-3">
        <section className="md:col-span-2 space-y-4">
          <h1 className="text-3xl font-bold">Seller Console</h1>
          <div className="rounded-lg border bg-card p-6">
            <h2 className="font-semibold">KYC & Stripe Connect</h2>
            <p className="text-sm text-muted-foreground">Verify your identity and connect payouts to start selling.</p>
            <div className="mt-4 flex gap-3">
              <Button onClick={startOnboarding} disabled={onboardingLoading} aria-disabled={onboardingLoading}>
                {sellerInfo?.hasStripe ? (sellerInfo?.verified ? 'View Stripe' : 'Continue Onboarding') : 'Start Onboarding'}
              </Button>
            </div>
            <div className="mt-4 grid gap-1 text-xs text-muted-foreground">
              <div>Account: {sellerInfo?.hasStripe ? 'Connected' : 'Not connected'}</div>
              <div>Details submitted: {sellerInfo?.connectDetailsSubmitted ? 'Yes' : 'No'}</div>
              <div>Charges enabled: {sellerInfo?.connectChargesEnabled ? 'Yes' : 'No'}</div>
              <div>Payouts enabled: {sellerInfo?.connectPayoutsEnabled ? 'Yes' : 'No'}</div>
              {Array.isArray(sellerInfo?.connectRequirements) && sellerInfo.connectRequirements?.length > 0 && (
                <div>Action required: {sellerInfo.connectRequirements.join(', ')}</div>
              )}
            </div>
            {!sellerInfo?.verified && (
              <p className="mt-2 text-xs text-muted-foreground">
                Complete verification to enable Go Live and Start Lot.
              </p>
            )}
          </div>
          <div className="rounded-lg border bg-card p-6">
            <h2 className="font-semibold">Your Lots</h2>
            <p className="text-sm text-muted-foreground">Create and manage your lots here.</p>
            <div className="mt-4 flex gap-3">
              <Button onClick={() => navigate('/sell/new')}>Create New Lot</Button>
              <Button variant="outline" onClick={() => navigate('/browse')}>Browse Lots</Button>
            </div>
          </div>

          {/* Bulk import tied to live shows removed */}

          <div className="rounded-lg border bg-card p-6">
            <h2 className="font-semibold">Paid Orders</h2>
            <div className="space-y-2 mt-2">
              {paidOrders.length === 0 ? (
                <p className="text-sm text-muted-foreground">No paid orders yet (or insufficient permissions).</p>
              ) : paidOrders.map((o) => (
                <div key={o.id} className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
                  <div>
                    <div className="font-medium">Order {o.id.slice(0,8)}…</div>
                    <div className="text-muted-foreground">Net due to you ${netDue(o)}{o.shipping_cents ? ` · Shipping $${(o.shipping_cents/100).toFixed(2)}` : ''}</div>
                    {o.shipping_tracking ? (
                      <div className="text-muted-foreground">{o.shipping_carrier} · {o.shipping_tracking} {o.label_url && (<a href={o.label_url} target="_blank" rel="noreferrer" className="underline ml-2">View Label</a>)}</div>
                    ) : null}
                  </div>
                  {!o.shipping_tracking ? (
                    <Button onClick={() => openTracking(o.id)}>Add Tracking</Button>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </section>
        <aside className="space-y-4">
          <div className="rounded-lg border bg-card p-4">
            <h2 className="font-semibold">Upcoming Shows</h2>
            <p className="text-sm text-muted-foreground">Schedule a show to showcase multiple lots live.</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h2 className="font-semibold">Fees</h2>
            <p className="text-sm text-muted-foreground">Global fee tiers 8–15%. Category surcharges apply.</p>
          </div>
        </aside>
      </main>
      {/* Simple pickup scheduler for sellers (structured message) */}
      <div className="container mx-auto px-4 pb-10">
        <div className="rounded-lg border bg-card p-4 mt-2">
          <h2 className="font-semibold">Pickup Scheduler</h2>
          <p className="text-sm text-muted-foreground">Send a structured pickup window message to your buyer.</p>
          <div className="mt-3 flex flex-col sm:flex-row gap-2">
            <input id="pickupLotId" className="rounded-md border bg-background px-3 py-2" placeholder="Lot ID" />
            <input id="pickupWindowText" className="rounded-md border bg-background px-3 py-2" placeholder="Pickup window (e.g., Dec 15–17, 9–3)" />
            <UIButton onClick={async ()=>{
              const sb = getSb();
              if (!sb) return;
              const lotIdInput = document.getElementById('pickupLotId') as HTMLInputElement | null;
              const windowInput = document.getElementById('pickupWindowText') as HTMLInputElement | null;
              const lotId = lotIdInput?.value || '';
              const windowText = windowInput?.value || '';
              if (!lotId || !windowText) return showToast({ description: 'Enter lot and window' });
              try {
                const { error } = await sb.schema('public').from('pickups').upsert({ lot_id: lotId, status: 'pending', pickup_notes: `Pickup window: ${windowText}` }, { onConflict: 'lot_id' });
                if (error) throw error;
                showToast({ description: 'Pickup window posted to thread' });
              } catch (e:any) {
                showToast({ description: e.message || 'Failed to post pickup window' });
              }
            }}>Post Window</UIButton>
          </div>
        </div>
      </div>
      <ShippingTrackingDialog
        open={trackingOpen}
        onOpenChange={setTrackingOpen}
        onSubmit={saveTracking}
      />
    </div>
  );
};

export default DashboardSeller;