import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"; // If you don't use shadcn buttons, swap to <a>/<button>.
import { X } from "lucide-react";

export default function Header() {
  const [promoHidden, setPromoHidden] = useState(true);

  useEffect(() => {
    setPromoHidden(localStorage.getItem("promo:hidden") === "1");
  }, []);

  function hidePromo() {
    localStorage.setItem("promo:hidden", "1");
    setPromoHidden(true);
  }

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
      {/* Skip link for a11y */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 bg-white border border-slate-300 rounded px-3 py-1 text-sm"
      >
        Skip to content
      </a>

      <div className="mx-auto max-w-7xl h-16 px-4 flex items-center gap-3">
        {/* Left: Brand */}
        <a href="/" className="group flex items-center gap-3 shrink-0" aria-label="ZingLots Home">
          <img src="/logo.svg" alt="" className="h-7 w-auto" />
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="font-semibold -mb-0.5">ZingLots</span>
            {/* Eyebrow tagline (B2B) */}
            <span className="text-[11px] text-slate-600">
              Built for small businesses — B2B surplus auctions
            </span>
          </div>
        </a>

        {/* Center: Search (desktop & tablet) */}
        <form action="/search" className="hidden md:block flex-1 max-w-2xl mx-auto">
          <label htmlFor="site-search" className="sr-only">
            Search active auctions
          </label>
          <input
            id="site-search"
            name="q"
            placeholder="Search active auctions…"
            className="w-full h-10 rounded-xl border border-slate-300 px-3
                       focus:outline-none focus:ring-2 focus:ring-slate-400"
            autoComplete="off"
          />
        </form>

        {/* Right: Actions */}
        <nav className="ml-auto flex items-center gap-2">
          <Button variant="outline" asChild>
            <a href="/sell">Sell</a>
          </Button>
          <a className="px-2 text-slate-700 hover:text-slate-900" href="/help">
            Help &amp; Contact
          </a>
          <a className="px-2 text-slate-700 hover:text-slate-900" href="/signin">
            Sign in
          </a>
          <a className="relative px-2 text-slate-700 hover:text-slate-900" href="/cart" aria-label="Cart">
            Cart
            {/* If you track a cart count, render a small badge here */}
          </a>

          {/* Tiny promo pill (dismissible, persisted) */}
          {!promoHidden && (
            <div className="ml-1 inline-flex items-center gap-1 rounded-full bg-green-50 text-green-800 text-xs px-2 py-1">
              Limited-time fees
              <button
                type="button"
                onClick={hidePromo}
                aria-label="Dismiss promotion"
                className="p-0.5 rounded hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-300"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </nav>
      </div>

      {/* Mobile search (optional): simple row under header. Remove if you don't want it. */}
      <div className="md:hidden border-t border-slate-200 px-4 py-2 bg-white/90">
        <form action="/search">
          <label htmlFor="site-search-mobile" className="sr-only">
            Search active auctions
          </label>
          <input
            id="site-search-mobile"
            name="q"
            placeholder="Search active auctions…"
            className="w-full h-10 rounded-xl border border-slate-300 px-3
                       focus:outline-none focus:ring-2 focus:ring-slate-400"
            autoComplete="off"
          />
        </form>
      </div>
    </header>
  );
}