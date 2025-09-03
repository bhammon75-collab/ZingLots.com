import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Countdown, { type LotTiming } from "@/components/auction/Countdown";
import ReserveMeter from "@/components/auction/ReserveMeter";
import ProxyBidModal from "@/components/auction/ProxyBidModal";
import { getIncrementForPrice } from "@/lib/bidIncrements";
import { useViewers } from "@/hooks/useViewers";
import { analytics } from "@/lib/analytics";

type Auction = { id:string; title:string; heroImage?:string; status?:string; currentBid?:number; lotsCount?:number; reserve?: number | null };

export default function AuctionPage(){
  const { id = "" } = useParams();
  const [state, setState] = useState<{ loading:boolean; error?:string; auction?:Auction|null }>({ loading:true });
  const [timing, setTiming] = useState<LotTiming | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [bidInput, setBidInput] = useState<string>("");
  const viewers = useViewers(id);
  const [proxyOpen, setProxyOpen] = useState(false);

  useEffect(()=>{
    let on = true;
    (async()=>{
      try{
        // IMPORTANT: fetch from an API path, not window.location.pathname
        // const res = await fetch(`/api/auctions/${id}`);
        // if(!res.ok) throw new Error(`API ${res.status}`);
        // const auction:Auction = await res.json();
        const auction:Auction|null = null; // placeholder
        if(on) setState({ loading:false, auction });
        if(on) setCurrentPrice(auction?.currentBid ?? 0);
        // fetch timing from edge function
        const tRes = await fetch(`/functions/v1/lot-timing?lotId=${encodeURIComponent(id)}`);
        if (tRes.ok) {
          const t: LotTiming = await tRes.json();
          if (on) setTiming(t);
        }
      }catch(e:any){
        if(on) setState({ loading:false, error:e?.message || "Failed to load" });
      }
    })();
    return ()=>{ on=false; };
  },[id]);

  const handleSync = useCallback(async ()=>{
    const tRes = await fetch(`/functions/v1/lot-timing?lotId=${encodeURIComponent(id || "")}`);
    if (tRes.ok) {
      const t: LotTiming = await tRes.json();
      setTiming(t);
    }
  },[id]);

  const step = getIncrementForPrice(currentPrice);
  const minNext = currentPrice + step;
  const parsed = parseFloat(bidInput || "0");
  const isValid = parsed >= minNext || parsed === minNext;

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = (parsed || 0) + step;
      setBidInput(String(next));
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = Math.max(minNext, (parsed || 0) - step);
      setBidInput(String(next));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (isValid) {
        const before = timing?.endAt;
        setCurrentPrice(parsed);
        setBidInput("");
        fetch(`/functions/v1/lot-timing?lotId=${encodeURIComponent(id)}&extend=1`).then(async r=>{
          const t = await r.json();
          if (before && t?.endAt && new Date(t.endAt).getTime() > new Date(before).getTime()) {
            console.log('Closing time extended for fairness');
          }
        }).finally(handleSync);
      }
    }
  };

  const title = state.auction?.title || `Auction ${id}`;
  const closingSoon = useMemo(()=>{
    if (!timing) return false;
    const end = new Date(timing.endAt).getTime();
    const nowMs = Date.now();
    return end - nowMs <= 10 * 60 * 1000;
  },[timing]);

  return (
    <>
      <Helmet>
        <title>{`${title} — ZingLots`}</title>
        <meta name="robots" content="index,follow" />
      </Helmet>

      <main id="main" style={{ maxWidth:1024, margin:"0 auto", padding:24 }}>
        <nav aria-label="Breadcrumb" className="mb-3 text-sm text-subtle">
          <Link to="/">Home</Link> &nbsp;›&nbsp; <Link to="/auctions">Auctions</Link> &nbsp;›&nbsp; {id}
        </nav>

        {state.loading && (
          <div className="space-y-3" aria-busy="true">
            <div className="h-6 w-2/3 bg-gray-200 animate-pulse rounded" />
            <div className="h-4 w-1/2 bg-gray-200 animate-pulse rounded" />
            <div className="h-40 w-full bg-gray-200 animate-pulse rounded" />
          </div>
        )}

        {state.error && (<><h1>{title}</h1><p style={{ color:"crimson" }}>Couldn't load this auction. Please try again later.</p></>)}

        {!state.loading && !state.error && !state.auction && (
          <>
            <h1>{title}</h1>
            <p className="text-subtle">This auction could not be found. It may have ended or the URL is incorrect.</p>
            <p className="mt-2"><Link className="text-blue-600 underline" to="/auctions">Browse current auctions</Link></p>
          </>
        )}

        {!!state.auction && (
          <article>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              {state.auction.title}
              {closingSoon ? (
                <span className="inline-flex items-center rounded bg-red-600 px-2 py-0.5 text-white text-xs" aria-label="Closing soon">Closing soon</span>
              ) : (
                <span className="inline-flex items-center rounded bg-gray-200 px-2 py-0.5 text-gray-800 text-xs" aria-label="Open bidding">Open bidding</span>
              )}
            </h1>
            <div className="text-sm text-gray-600">Viewers: {viewers}</div>
            <div className="mt-3">
              {timing && <Countdown timing={timing} onSync={handleSync} />}
            </div>
            <p className="text-xs text-gray-600 mt-2">Bids are server-timestamped for fairness—even if video lags.</p>
            <p className="text-xs text-gray-600">Pickup/shipping arranged directly with the seller.</p>

            <section className="mt-4">
              <div className="text-lg font-semibold">${currentPrice.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Step: ${step.toLocaleString()}</div>
              <ReserveMeter
                className="mt-2 max-w-xs"
                reserve={state.auction?.reserve ?? null}
                currentPrice={currentPrice}
              />
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="number"
                  value={bidInput}
                  onChange={(e)=>setBidInput(e.target.value)}
                  onKeyDown={onKey}
                  placeholder={String(minNext)}
                  className="rounded border px-3 py-2 text-sm"
                  aria-label="Bid amount"
                />
                <button
                  className="rounded bg-red-600 px-4 py-2 text-white text-sm disabled:opacity-50"
                  onClick={()=>{ if(isValid){ const before = timing?.endAt; setCurrentPrice(parsed); analytics.trackBid(id, parsed); setBidInput(""); fetch(`/functions/v1/lot-timing?lotId=${encodeURIComponent(id)}&extend=1`).then(async r=>{ const t = await r.json(); if (before && t?.endAt && new Date(t.endAt).getTime() > new Date(before).getTime()) { console.log('Closing time extended for fairness'); } }).finally(handleSync); }}}
                  disabled={!isValid}
                >
                  Place Bid
                </button>
                <button
                  className="rounded border px-3 py-2 text-sm"
                  onClick={()=> setProxyOpen(true)}
                  aria-label="Set max bid"
                >
                  Set Max Bid
                </button>
              </div>
              <div className="text-xs text-gray-600 mt-1">↑ +step, ↓ −step, Enter to bid</div>
            </section>
            <ProxyBidModal
              open={proxyOpen}
              onOpenChange={setProxyOpen}
              lotId={id}
              currentPrice={currentPrice}
              step={step}
              onSet={(max)=>{ /* could toast */ }}
            />
          </article>
        )}
      </main>
    </>
  );
}