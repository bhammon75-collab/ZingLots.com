import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const KNOWN_REGIONS = [
  "seattle","tacoma","portland","los-angeles","san-francisco",
  "chicago","detroit","new-york","boston","philadelphia",
  "houston","dallas","atlanta","miami","phoenix"
];

function titleize(slug:string){ return slug.replace(/-/g," ").replace(/\b\w/g,c=>c.toUpperCase()); }

export default function RegionPage(){
  const { region = "" } = useParams();
  const slug = (region||"").toLowerCase();
  const known = useMemo(()=>KNOWN_REGIONS.includes(slug),[slug]);

  if(!known){
    return (
      <>
        <Helmet>
          <title>Region not found — ZingLots</title>
          <meta name="robots" content="noindex,follow" />
        </Helmet>
        <main id="main" style={{ maxWidth:960, margin:"0 auto", padding:24 }}>
          <nav aria-label="Breadcrumb" className="mb-3 text-sm text-subtle">
            <Link to="/">Home</Link> &nbsp;›&nbsp; <Link to="/regions">Regions</Link> &nbsp;›&nbsp; {slug}
          </nav>
          <h1>Region not found</h1>
          <p>We don't have a page for "{slug}" yet. Pick another region from <Link to="/regions">All Regions</Link>.</p>
        </main>
      </>
    );
  }

  const [state, setState] = useState<{loading:boolean; error?:string; items:any[]}>({ loading:true, items:[] });

  useEffect(()=>{
    let on = true;
    (async()=>{
      try{
        // TODO: replace with real API/Supabase call
        // const res = await fetch(`/api/regions/${slug}`);
        // const data = await res.json();
        const data:any[] = []; // placeholder
        if(on) setState({ loading:false, items:data });
      }catch(e:any){
        if(on) setState({ loading:false, error:e?.message || "Failed to load", items:[] });
      }
    })();
    return ()=>{ on=false; };
  },[slug]);

  const title = `${titleize(slug)} — Auctions`;

  return (
    <>
      <Helmet>
        <title>{`${title} — ZingLots`}</title>
        <meta name="robots" content="index,follow" />
      </Helmet>
      <main id="main" style={{ maxWidth:960, margin:"0 auto", padding:24 }}>
        <nav aria-label="Breadcrumb" className="mb-3 text-sm text-subtle">
          <Link to="/">Home</Link> &nbsp;›&nbsp; <Link to="/regions">Regions</Link> &nbsp;›&nbsp; {titleize(slug)}
        </nav>
        <h1>{titleize(slug)}</h1>

        {state.loading && <p className="text-subtle">Loading region…</p>}
        {state.error && <p style={{ color:"crimson" }}>Couldn't load listings for this region. Please try again later.</p>}
        {!state.loading && !state.error && state.items.length===0 &&
          <p className="text-subtle">No active auctions in this region yet. Check back soon or explore <Link to="/regions">other regions</Link>.</p>}
        {/* TODO: render items here */}
      </main>
    </>
  );
}
