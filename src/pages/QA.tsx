import { Helmet } from "react-helmet-async";
import ZingNav from "@/components/ZingNav";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { getSupabase } from "@/lib/supabaseClient";
import LiveLotTicker from "@/components/auctions/LiveLotTicker";
import { supaFetch } from "@/lib/supaFetchVite";
import { sendEmail } from "@/lib/notify";

const QA = () => {
  const [lotId, setLotId] = useState("");
  const [showId, setShowId] = useState("");
  const [startingBid, setStartingBid] = useState(0);
  // Fetch starting bid when lot changes
  useEffect(() => {
    const sb = getSupabase();
    let active = true;
    (async () => {
      if (!sb || !lotId) return;
      const { data } = await sb.from('lots').select('starting_bid').eq('id', lotId).maybeSingle();
      if (!active) return;
      setStartingBid(Number((data as any)?.starting_bid ?? 0));
    })();
    return () => { active = false; };
  }, [lotId]);

  const placeSampleBid = async () => {
    const sb = getSupabase();
    if (!sb) return toast({ description: "Supabase not configured" });
    const { data: user } = await sb.auth.getUser();
    if (!user?.user) return toast({ description: "Sign in first" });
    const { error } = await sb.rpc("public.place_bid", { lot_id: lotId, offered: 12.34, max: null });
    if (error) return toast({ description: error.message });
    toast({ description: `Bid placed for $12.34` });
    try { await sendEmail({ to: 'dev@localhost', type: 'bid_placed', input: { lotId, lotTitle: 'QA Lot' } }); } catch {}
  };

  const shortenSoftClose = async () => {
    const sb = getSupabase();
    if (!sb) return toast({ description: "Supabase not configured" });
    const { error } = await sb.from("lots").update({ ends_at: new Date(Date.now() + 20_000).toISOString() }).eq("id", lotId);
    if (error) return toast({ description: error.message });
    toast({ description: "ends_at set to 20s from now (if you have permission)" });
  };

  const endLotNow = async () => {
    const sb = getSupabase();
    if (!sb) return toast({ description: "Supabase not configured" });
    const { error } = await sb.rpc("end_lot", { p_lot: lotId });
    if (error) return toast({ description: error.message });
    toast({ description: "Lot ended (if you have permission)" });
    try { await sendEmail({ to: 'dev@localhost', type: 'win', input: { lotId, lotTitle: 'QA Lot' } }); } catch {}
  };

  const [imgFile, setImgFile] = useState<File | null>(null);
  const uploadImage = async () => {
    const sb = getSupabase();
    if (!sb) return toast({ description: "Supabase not configured" });
    if (!imgFile) return toast({ description: "Choose a file first" });
    const { data: sess } = await sb.auth.getSession();
    const uid = sess?.session?.user?.id;
    if (!uid) return toast({ description: "Sign in first" });
    const path = `${uid}/${Date.now()}_${imgFile.name}`;
    const { error } = await sb.storage.from('lot-images').upload(path, imgFile, { upsert: false, cacheControl: '3600' });
    if (error) return toast({ description: error.message });
    toast({ description: `Uploaded to lot-images/${path}` });
  };

  const sendTestEmail = async () => {
    try {
      await sendEmail({
        to: 'dev@localhost',
        type: 'bid_placed',
        input: { lotId, lotTitle: 'QA Smoke Lot' },
      });
      toast({ description: 'Email sent (check provider logs/inbox)' });
    } catch (e: any) {
      toast({ description: e.message || 'Failed to send email' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>QA Harness | ZingLots</title>
        <meta name="description" content="Test soft-close, bids, and realtime for ZingLots." />
        <link rel="canonical" href="/qa" />
      </Helmet>
      <ZingNav />
      <main className="container mx-auto px-4 py-10 space-y-6">
        <h1 className="text-3xl font-bold">QA Harness</h1>
        <p className="text-sm text-muted-foreground">Use in two browsers to demo bidding + soft-close.</p>

        <div className="rounded-lg border bg-card p-4 space-y-3">
          <div className="grid gap-2 sm:grid-cols-2">
            <input className="rounded-md border bg-background px-3 py-2" placeholder="Lot ID" value={lotId} onChange={(e) => setLotId(e.target.value)} />
            <input className="rounded-md border bg-background px-3 py-2" placeholder="Show ID" value={showId} onChange={(e) => setShowId(e.target.value)} />
          </div>
          {lotId && <LiveLotTicker lotId={lotId} startingBid={startingBid} />}
          <div className="flex gap-3">
            <Button onClick={placeSampleBid}>Place Sample Bid ($12.34)</Button>
            <Button variant="outline" onClick={shortenSoftClose}>Shorten Soft-Close (20s)</Button>
            <Button variant="destructive" onClick={endLotNow}>End Lot (demo)</Button>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-4 space-y-3">
          <h2 className="text-lg font-semibold">Phase 0: Smoke Tests</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Upload to lot-images</label>
              <input type="file" accept="image/*" onChange={(e)=>setImgFile(e.target.files?.[0] || null)} />
              <Button onClick={uploadImage} disabled={!imgFile}>Upload image</Button>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Send test email</label>
              <Button variant="outline" onClick={sendTestEmail}>Send email via provider</Button>
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            <Button variant="outline" onClick={async ()=>{ try { await sendEmail({ to: 'dev@localhost', type: 'outbid', input: { lotId, lotTitle: 'QA Lot' } }); toast({ description: 'Outbid email sent' }); } catch(e:any){ toast({ description: e.message || 'Failed' }); } }}>Send outbid</Button>
            <Button variant="outline" onClick={async ()=>{ try { await sendEmail({ to: 'dev@localhost', type: 'reserve_met', input: { lotId, lotTitle: 'QA Lot' } }); toast({ description: 'Reserve met email sent' }); } catch(e:any){ toast({ description: e.message || 'Failed' }); } }}>Send reserve met</Button>
            <Button variant="outline" onClick={async ()=>{ try { await sendEmail({ to: 'dev@localhost', type: 'pickup_reminder', input: { lotId, lotTitle: 'QA Lot', pickupWindowText: 'Tomorrow 9–3' } }); toast({ description: 'Pickup reminder sent' }); } catch(e:any){ toast({ description: e.message || 'Failed' }); } }}>Send pickup reminder</Button>
          </div>
        </div>

        <aside className="text-xs text-muted-foreground">
          Seeds: see docs/migrations/0003_seed_demo.sql. Legal: Collectibles intended for ages 14+.
        </aside>
      </main>
    </div>
  );
};

export default QA;

