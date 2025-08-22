import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { labelForRegion, titleize } from "../lib/regions";
import { fetchRegionAuctions, type Auction } from "../lib/fetchRegionAuctions";

export default function RegionPage() {
  const { region = "" } = useParams();
  const slug = (region || "").toLowerCase();
  const cityLabel = labelForRegion(slug);

  const [state, setState] = useState<{ loading: boolean; error?: string; items: Auction[] }>({
    loading: true,
    items: [],
  });

  useEffect(() => {
    let on = true;
    setState((s) => ({ ...s, loading: true, error: undefined, items: [] }));
    fetchRegionAuctions(slug)
      .then((items) => on && setState({ loading: false, items }))
      .catch((e: any) => on && setState({ loading: false, items: [], error: e?.message || "Failed to load" }));
    return () => { on = false; };
  }, [slug]);

  return (
    <>
      <Helmet>
        <title>{`${cityLabel} — Auctions — ZingLots`}</title>
        <meta name="robots" content="index,follow" />
      </Helmet>

      <main id="main" className="mx-auto max-w-7xl px-4 py-8">
        <nav aria-label="Breadcrumb" className="mb-3 text-sm text-neutral-700">
          <Link to="/">Home</Link> &nbsp;›&nbsp; <Link to="/regions">Regions</Link> &nbsp;›&nbsp; {titleize(slug)}
        </nav>

        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{cityLabel}</h1>
        <p className="mt-2 text-neutral-700">Active auctions in and around {cityLabel}.</p>

        {state.loading && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 rounded-xl border animate-pulse bg-neutral-100" />
            ))}
          </div>
        )}

        {!state.loading && state.error && (
          <div className="mt-6 text-red-700">Couldn't load this region right now. Please try again later.</div>
        )}

        {!state.loading && !state.error && state.items.length === 0 && (
          <div className="mt-6 text-neutral-700">
            No active auctions in this region yet. Check back soon or explore{" "}
            <Link className="text-blue-600 underline" to="/regions">other regions</Link>.
          </div>
        )}

        {!state.loading && !state.error && state.items.length > 0 && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {state.items.map((a) => (
              <div key={a.id}>
                {/* Inline simple card */}
                <a href={`/auction/${a.id}`} className="block overflow-hidden rounded-xl border hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
                  <img src={a.hero_image_url || "/placeholder.jpg"} alt={a.title} className="w-full aspect-[4/3] object-cover" loading="lazy" />
                  <div className="p-4">
                    <div className="text-base font-semibold line-clamp-2">{a.title}</div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
