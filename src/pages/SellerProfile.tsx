import { Helmet } from "react-helmet-async";
import ZingNav from "@/components/ZingNav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { getSupabase } from "@/lib/supabaseClient";
import { toast } from "@/components/ui/use-toast";
import { sendEmail } from "@/lib/notify";
import { useParams } from "react-router-dom";
import { DEMO_SELLERS, DEMO_LOTS } from "@/data/demo";
import LotCard from "@/components/LotCard";

const SellerProfile = () => {
  const { id } = useParams();
  const seller = DEMO_SELLERS.find((s) => s.id === id) ?? { id: id || "", name: "Seller" };
  const lots = DEMO_LOTS.slice(0, 8);
  const [pickupWindow, setPickupWindow] = useState<string>("");
  const [selectedLotId, setSelectedLotId] = useState<string>("");
  const [markingId, setMarkingId] = useState<string>("");

  const savePickupWindow = async () => {
    const sb = getSupabase();
    if (!sb) return toast({ description: "Supabase not configured" });
    if (!selectedLotId || !pickupWindow) return toast({ description: "Choose a lot and a pickup window" });
    try {
      const { error } = await sb
        .schema('public')
        .from('pickups')
        .upsert({ lot_id: selectedLotId, pickup_notes: `Pickup window: ${pickupWindow}`, status: 'pending' }, { onConflict: 'lot_id' });
      if (error) throw error;
      toast({ description: 'Pickup window saved' });
    } catch (e:any) {
      toast({ description: e.message || 'Failed to save' });
    }
  };

  const markCollected = async (lotId: string) => {
    const sb = getSupabase();
    if (!sb) return toast({ description: "Supabase not configured" });
    try {
      setMarkingId(lotId);
      const { error } = await sb
        .schema('public')
        .from('pickups')
        .update({ status: 'completed', scanned_at: new Date().toISOString() })
        .eq('lot_id', lotId);
      if (error) throw error;
      toast({ description: 'Marked as collected' });
    } catch (e:any) {
      toast({ description: e.message || 'Failed to mark collected' });
    } finally {
      setMarkingId("");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{seller.name} | Seller on ZingLots</title>
        <meta name="description" content={`View ${seller.name}'s upcoming shows and lots on ZingLots.`} />
        <link rel="canonical" href={`/seller/${seller.id}`} />
      </Helmet>
      <ZingNav />
      <main className="container mx-auto px-4 py-10">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold">{seller.name}</h1>
            <p className="text-muted-foreground">Trusted seller · 4.9 rating</p>
          </div>
          <div className="flex gap-2">
            <button className="rounded-md border px-4 py-2 text-sm">Follow</button>
            <a href={`/shows`} className="text-sm text-primary underline-offset-4 hover:underline">Upcoming Shows</a>
          </div>
        </div>

        <Tabs defaultValue="profile" className="mt-8 w-full">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="fulfillment">Fulfillment</TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <h2 className="mt-4 text-xl font-semibold">Featured Lots</h2>
            <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {lots.map((item) => (
                <a href={`/product/${item.id}`} key={item.id}>
                  <LotCard item={item} />
                </a>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="fulfillment">
            <div className="rounded-lg border bg-card p-4 space-y-3">
              <h2 className="text-lg font-semibold">Local Pickup</h2>
              <div className="grid gap-2 sm:grid-cols-3">
                <select className="rounded-md border bg-background px-3 py-2" value={selectedLotId} onChange={(e)=>setSelectedLotId(e.target.value)}>
                  <option value="">Choose lot…</option>
                  {lots.map((l) => (
                    <option key={l.id} value={l.id}>{l.title}</option>
                  ))}
                </select>
                <input className="rounded-md border bg-background px-3 py-2" placeholder="Pickup window (e.g., Dec 15–17, 9am–3pm)" value={pickupWindow} onChange={(e)=>setPickupWindow(e.target.value)} />
                <Button onClick={savePickupWindow}>Save Window</Button>
              </div>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-3">
              <h3 className="font-semibold">Mark as Collected</h3>
              <div className="grid gap-2 sm:grid-cols-2">
                {lots.map((l) => (
                  <div key={l.id} className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
                    <div className="truncate">{l.title}</div>
                    <Button variant="outline" onClick={()=>markCollected(l.id)} disabled={markingId===l.id} aria-disabled={markingId===l.id}>
                      {markingId===l.id ? 'Saving…' : 'Mark Collected'}
                    </Button>
                  </div>
                ))}
              </div>
              <div className="text-xs text-muted-foreground">Tip: Use the pickup scanner at /pickup/:lotId/scan for QR verification.</div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default SellerProfile;
