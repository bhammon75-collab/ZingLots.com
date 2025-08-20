import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import SignatureGlow from "@/components/SignatureGlow";
import CategoryPills from "@/components/CategoryPills";
import LotCard from "@/components/LotCard";
import heroImage from "@/assets/hero-zinglots.jpg";
import { Button } from "@/components/ui/button";
import { DEMO_LOTS, DEMO_SHOWS } from "@/data/demo";
import { Link, useNavigate } from "react-router-dom";
import StripeOnboardSmokeTest from "@/components/StripeOnboardSmokeTest";
import PayPalSmokeTest from "@/components/PayPalSmokeTest";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { Hero } from "@/components/Hero";

const Index = () => {
  const showDev = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('dev') === '1';
  const [term, setTerm] = useState("");
  const navigate = useNavigate();
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = term.trim();
    navigate(`/discover${q ? `?q=${encodeURIComponent(q)}` : ""}`);
  };
  return (
    <div className="min-h-screen bg-paper">
      <Helmet>
        <title>ZingLots | Live Toy Auctions & Shows</title>
        <meta name="description" content="The marketplace where collectors buy, sell, and discover rare collectibles. Auction-style bidding, instant Buy Now, and secure checkout." />
        <link rel="canonical" href="/" />
        <meta property="og:title" content="ZingLots | Live Toy Auctions" />
        <meta property="og:description" content="Discover live shows and bid on collectible toys with soft-close and Buy Now." />
      </Helmet>

      <Header />
      {showDev && (<>
        <StripeOnboardSmokeTest />
        <PayPalSmokeTest />
      </>)}

      <main className="pt-16">
        {/* Hero section with premium polish */}
        <Hero />

        {/* Search bar section */}
        <section className="mx-auto max-w-screen-2xl px-4 pb-12">
          <form onSubmit={handleSearchSubmit} className="relative max-w-2xl">
            <Input
              type="text"
              placeholder="Search for collectibles..."
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className="w-full h-14 pl-4 pr-12 text-lg bg-white border border-line rounded-xl"
            />
            <Button 
              type="submit" 
              size="icon" 
              className="absolute right-2 top-2 bg-brand-primary hover:bg-brand-dark rounded-lg"
            >
              <Search className="h-5 w-5" />
            </Button>
          </form>
        </section>

        {/* Categories */}
        <section aria-labelledby="categories" className="border-t border-line bg-white">
          <div className="mx-auto max-w-screen-2xl px-4 md:px-6 py-6">
            <h2 id="categories" className="sr-only">Categories</h2>
            <CategoryPills />
          </div>
        </section>

        {/* Discovery Feed with consistent gutters */}
        <section aria-labelledby="discover" className="bg-paper">
          <div className="mx-auto max-w-screen-2xl px-4 md:px-6 py-10">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <h2 id="discover" className="text-2xl font-bold text-ink">Discover Lots</h2>
                <p className="text-sm text-zinc-600">Fresh picks across categories</p>
              </div>
              <Button variant="ghost" asChild>
                <Link to="/discover">See all</Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {DEMO_LOTS.slice(0, 12).map((item) => (
                <Link to={`/product/${item.id}`} key={item.id} aria-label={item.title}>
                  <LotCard item={item} />
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;