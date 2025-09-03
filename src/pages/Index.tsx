import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Brand from "@/components/Brand";
import CategoryPills from "@/components/CategoryPills";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DEMO_LOTS } from "@/data/demo";
import { Link, useNavigate } from "react-router-dom";
import StripeOnboardSmokeTest from "@/components/StripeOnboardSmokeTest";
import PayPalSmokeTest from "@/components/PayPalSmokeTest";

import { useState, useMemo } from "react";
import { SearchBar } from "@/components/ui/search-bar";
import { Building2, UtensilsCrossed, Briefcase, Wrench, MapPin, Truck, Shield, Clock } from "lucide-react";
// Duplicate imports removed below
import { Hero } from "@/components/Hero";

// Helper for ItemList JSON-LD
const listJsonLd = (items: {id:string; title:string}[]) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  "itemListElement": items.map((it, i) => ({
    "@type": "ListItem",
    "position": i + 1,
    "url": `https://www.zinglots.com/product/${it.id}`,
    "name": it.title
  }))
});

const Index = () => {
  const navigate = useNavigate();
  const [term, setTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("seattle");

  const showDev = import.meta.env.DEV;
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (term.trim()) {
      navigate(`/browse?q=${encodeURIComponent(term)}`);
    }
  };

  const regions = [
    { id: "seattle", name: "Seattle", count: 127 },
    { id: "tacoma", name: "Tacoma", count: 89 },
    { id: "bellevue", name: "Bellevue", count: 56 },
  ];

  const categories = [
    {
      id: "contractor",
      name: "Construction & Materials",
      icon: Building2,
      description: "Lumber, tools, heavy equipment",
      count: 342,
      color: "bg-orange-100 text-orange-800"
    },
    {
      id: "restaurant",
      name: "Restaurant & Food Service",
      icon: UtensilsCrossed,
      description: "Commercial ovens, refrigeration, furniture",
      count: 189,
      color: "bg-green-100 text-green-800"
    },
    {
      id: "office",
      name: "Office & Business Equipment",
      icon: Briefcase,
      description: "Furniture, computers, office supplies",
      count: 156,
      color: "bg-blue-100 text-blue-800"
    },
    {
      id: "municipal",
      name: "Government & Municipal Surplus",
      icon: Wrench,
      description: "Vehicles, equipment, furniture",
      count: 98,
      color: "bg-purple-100 text-purple-800"
    }
  ];

  const featuredLots = [
    {
      id: "1",
      title: "Commercial Kitchen Package - 6 Burner Range + Prep Tables",
      currentPrice: 2400,
      timeLeft: "2h 15m",
      location: "Seattle",
      distance: "3.2 mi",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&auto=format",
      needsForklift: true,
      category: "Restaurant",
      bidCount: 8
    },
    {
      id: "2", 
      title: "Pallet of Premium Cedar Lumber - 2x4x8 (150 pieces)",
      currentPrice: 890,
      timeLeft: "45m",
      location: "Tacoma",
      distance: "12.4 mi",
      image: "https://images.unsplash.com/photo-1609205612107-e0ec2120f9de?w=800&h=600&fit=crop&auto=format",
      needsForklift: false,
      category: "Construction",
      bidCount: 12
    },
    {
      id: "3",
      title: "Office Furniture Set - 20 Ergonomic Chairs + 8 Desks",
      currentPrice: 1250,
      timeLeft: "6h 30m", 
      location: "Bellevue",
      distance: "8.1 mi",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop&auto=format",
      needsForklift: true,
      category: "Office",
      bidCount: 5
    }
  ];

  return (
    <div className="min-h-screen bg-paper">
      <Helmet>
        <title>ZingLots | Live Toy Auctions & Shows</title>
        <meta name="description" content="The marketplace where collectors buy, sell, and discover rare collectibles. Auction-style bidding, instant Buy Now, and secure checkout." />
        <link rel="canonical" href="/" />
        <meta property="og:title" content="ZingLots | Live Toy Auctions" />
        <meta property="og:description" content="Discover live shows and bid on collectible toys with soft-close and Buy Now." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://www.zinglots.com/`} />
        <script type="application/ld+json">
          {JSON.stringify(listJsonLd((DEMO_LOTS ?? []).slice(0, 12)))}
        </script>
      </Helmet>

      <Header showSearch />
      {showDev && (<>
        <StripeOnboardSmokeTest />
        <PayPalSmokeTest />
      </>)}

      <main>
        {/* Hero section with premium polish */}
        <Hero />

        {/* Search bar section */}
        <section className="mx-auto max-w-screen-2xl px-4 pb-12">

          <SearchBar
            value={term}
            onChange={setTerm}
            onSubmit={(v) => {
              const q = (v ?? term).trim();
              if (!q) return;
              navigate(`/discover?q=${encodeURIComponent(q)}`);
            }}
            placeholder="Search for collectibles..."
            size="lg"
            className="max-w-2xl"
          />
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
                <h2 id="discover" className="text-2xl font-bold text-[#0f172a]">Discover Lots</h2>
                <p className="text-sm text-[#64748b]">Fresh picks across categories</p>
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <select 
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="pl-10 pr-8 py-2 border-0 bg-transparent focus:ring-0 min-w-32"
                >
                  {regions.map(region => (
                    <option key={region.id} value={region.id}>
                      {region.name} ({region.count})
                    </option>
                  ))}
                </select>
              </div>
              <Button size="lg" className="px-8" onClick={() => navigate(`/r/${selectedRegion}?q=${encodeURIComponent(term)}`)}>
                Search
              </Button>
            </div>
          </div>

      </section>
      

      {/* Value Props */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Local Marketplace</h3>
              <p className="text-gray-600">Buyers and sellers arrange pickup or delivery terms directly.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#0f172a]">Verified Businesses</h3>
              <p className="text-[#64748b]">All sellers are verified businesses. Secure escrow until pickup confirmation.</p>
            </div>
            <div className="text-center">
              <div className="W-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#0f172a]">Always-On Auctions</h3>
              <p className="text-[#64748b]">No waiting for live shows. Bid anytime on thousands of surplus items.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#0f172a]">Browse by Category</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Card key={category.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <IconComponent className="h-8 w-8 text-[#64748b]" />
                      <Badge className={category.color}>
                        {category.count} lots
                      </Badge>
                    </div>
                    <CardTitle className="text-lg text-[#0f172a]">{category.name}</CardTitle>
                    <CardDescription className="text-[#64748b]">{category.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Lots */}
      <section className="py-16 bg-[#f8fafc]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-[#0f172a]">Ending Soon Near You</h2>
            <Button variant="outline" asChild>
              <Link to="/browse">View All</Link>
            </Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredLots.map((lot) => (
              <Card key={lot.id} className="hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-200 rounded-t-lg relative">
                  <img 
                    src={lot.image} 
                    alt={lot.title}
                    className="w-full h-full object-cover rounded-t-lg"
                    onError={(e) => {
                      e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='225' viewBox='0 0 400 225'%3E%3Crect width='400' height='225' fill='%23f3f4f6'/%3E%3Ctext x='200' y='112.5' font-family='Arial' font-size='14' fill='%236b7280' text-anchor='middle'%3E%5BItem Photo%5D%3C/text%3E%3C/svg%3E";
                    }}
                  />
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary">{lot.category}</Badge>
                  </div>
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-[#ef4444] text-white">{lot.timeLeft}</Badge>
                  </div>
                  {lot.needsForklift && (
                    <div className="absolute bottom-2 left-2">
                      <Badge variant="outline" className="bg-white">
                        <Truck className="h-3 w-3 mr-1" />
                        Forklift Required
                      </Badge>
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-2 text-[#0f172a]">{lot.title}</h3>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-2xl font-bold text-[#0f172a]">
                      ${lot.currentPrice.toLocaleString()}
                    </span>
                    <span className="text-sm text-[#64748b]">
                      {lot.bidCount} bids
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-[#64748b] mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    {lot.location} • {lot.distance}
                  </div>
                  <Button className="w-full" asChild>
                    <Link to={`/lot/${lot.id}`}>View & Bid</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#0f172a] text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">Have Equipment to Auction?</h2>
          <p className="text-xl mb-8 text-gray-300">
            Join hundreds of verified businesses recovering capital from surplus inventory
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-[#ef4444] hover:bg-red-600 text-white" asChild>
              <Link to="/seller/apply">Create a Listing</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[#0f172a]" asChild>
              <Link to="/help">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      </main>

      {/* Footer */}
      <footer className="bg-[#0f172a] text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <div className="lg:col-span-1">
              <Brand variant="footer" textClassName="text-white text-2xl font-extrabold tracking-tight mb-3" />
              <p className="text-gray-400 text-sm leading-relaxed">
                The hyperlocal marketplace for business surplus and equipment
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Marketplace</h4>
              <div className="space-y-2 text-gray-400">
                <Link to="/browse" className="block hover:text-white">Browse Lots</Link>
                {import.meta.env.DEV && <Link to="/discover" className="block hover:text-white">Categories</Link>}
                <Link to="/regions" className="block hover:text-white">Regions</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Selling</h4>
              <div className="space-y-2 text-gray-400">
                <Link to="/seller/apply" className="block hover:text-white">Apply to Sell</Link>
                <Link to="/dashboard/seller" className="block hover:text-white">Seller Dashboard</Link>
                <Link to="/help" className="block hover:text-white">Selling Guide</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-2 text-gray-400">
                <Link to="/help" className="block hover:text-white">Help Center</Link>
                <Link to="/help" className="block hover:text-white">Contact Us</Link>
                <Link to="/legal/terms" className="block hover:text-white">Terms</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 ZingLots. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;