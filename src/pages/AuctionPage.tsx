import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

type Auction = { id:string; title:string; heroImage?:string; status?:string; currentBid?:number; lotsCount?:number; };

export default function AuctionPage(){
  const { id = "" } = useParams();
  const [state, setState] = useState<{ loading:boolean; error?:string; auction?:Auction|null }>({ loading:true });

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
      }catch(e:any){
        if(on) setState({ loading:false, error:e?.message || "Failed to load" });
      }
    })();
    return ()=>{ on=false; };
  },[id]);

  const title = state.auction?.title || `Auction ${id}`;

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

        {state.loading && <p className="text-subtle">Loading auction…</p>}

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
            <h1 className="text-2xl md:text-3xl font-bold">{state.auction.title}</h1>

            {/* Logistics note near bidding module */}
            <aside className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
              <strong>Logistics:</strong> Pickup and/or shipping are arranged directly between buyer and seller as stated by the seller. ZingLots does not provide or broker transportation.
            </aside>
          </article>
        )}
      </main>
    </>
  );
}