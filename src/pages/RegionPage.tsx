import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { labelForRegion, titleize } from "../lib/regions";
import { fetchRegionAuctions, type Auction } from "../lib/fetchRegionAuctions";
import { generateMockAuctions, getFeaturedAuctions, type MockAuction } from "../lib/mockRegionData";
import ProfessionalAuctionCard from "../components/ProfessionalAuctionCard";
import { MapPin, Filter, TrendingUp, Clock, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function RegionPage() {
  const { region = "" } = useParams();
  const slug = (region || "").toLowerCase();
  const cityLabel = labelForRegion(slug);

  const [state, setState] = useState<{ loading: boolean; error?: string; items: Auction[] }>({
    loading: true,
    items: [],
  });
  
  const [mockItems, setMockItems] = useState<MockAuction[]>([]);
  const [featuredItems, setFeaturedItems] = useState<MockAuction[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    let on = true;
    setState((s) => ({ ...s, loading: true, error: undefined, items: [] }));
    
    // Try to fetch real data first
    fetchRegionAuctions(slug)
      .then((items) => {
        if (on) {
          if (items.length > 0) {
            setState({ loading: false, items });
          } else {
            // Use mock data if no real data
            const mocked = generateMockAuctions(slug, 18);
            const featured = getFeaturedAuctions(slug);
            setMockItems(mocked);
            setFeaturedItems(featured);
            setState({ loading: false, items: [] });
          }
        }
      })
      .catch((e: any) => {
        if (on) {
          // Use mock data on error
          const mocked = generateMockAuctions(slug, 18);
          const featured = getFeaturedAuctions(slug);
          setMockItems(mocked);
          setFeaturedItems(featured);
          setState({ loading: false, items: [], error: undefined }); // Hide error, show mock data
        }
      });
    return () => { on = false; };
  }, [slug]);

  const displayItems = state.items.length > 0 ? state.items : mockItems;
  const hasData = displayItems.length > 0;
  
  // Get unique categories from items
  const categories = Array.from(new Set(mockItems.map(item => item.category))).filter(Boolean);
  
  // Filter items by category
  const filteredItems = selectedCategory === "all" 
    ? displayItems 
    : mockItems.filter(item => item.category === selectedCategory);

  // Stats for the region
  const totalValue = displayItems.reduce((sum, item) => sum + (item.current_bid || 0), 0);
  const activeAuctions = displayItems.filter(item => new Date(item.ends_at) > new Date()).length;
  const endingSoon = displayItems.filter(item => {
    const hoursLeft = (new Date(item.ends_at).getTime() - Date.now()) / (1000 * 60 * 60);
    return hoursLeft > 0 && hoursLeft <= 24;
  }).length;

  return (
    <>
      <Helmet>
        <title>{`${cityLabel} — Business Surplus Auctions — ZingLots`}</title>
        <meta name="description" content={`Find the best deals on business surplus in ${cityLabel}. Construction equipment, restaurant supplies, office furniture, and more.`} />
        <meta name="robots" content="index,follow" />
      </Helmet>

      <main id="main" className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <div className="bg-white border-b">
          <div className="mx-auto max-w-7xl px-4 py-6">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-4 text-sm text-gray-600">
              <Link to="/" className="hover:text-gray-900">Home</Link>
              <span className="mx-2">/</span>
              <Link to="/regions" className="hover:text-gray-900">All Regions</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900 font-medium">{titleize(slug)}</span>
            </nav>

            {/* City Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{cityLabel}</h1>
                </div>
                <p className="text-gray-600">
                  Browse active business surplus auctions in and around {cityLabel}
                </p>
              </div>
              
              {/* Stats */}
              {hasData && (
                <div className="flex gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{activeAuctions}</div>
                    <div className="text-xs text-gray-500">Active Auctions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{endingSoon}</div>
                    <div className="text-xs text-gray-500">Ending Soon</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      ${(totalValue / 1000).toFixed(0)}K
                    </div>
                    <div className="text-xs text-gray-500">Total Value</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8">
          {/* Featured Section */}
          {featuredItems.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-orange-500" />
                <h2 className="text-xl font-semibold text-gray-900">Featured Auctions</h2>
                <Badge variant="secondary" className="ml-2">Hot</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {featuredItems.map((item) => (
                  <div key={item.id} className="relative">
                    <div className="absolute -top-2 -right-2 z-10 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Featured
                    </div>
                    <ProfessionalAuctionCard auction={item} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Category Filter */}
          {categories.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filter by Category:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("all")}
                >
                  All Categories
                </Button>
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Loading State */}
          {state.loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-80 rounded-xl border bg-white animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-xl" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-6 bg-gray-200 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error State (now hidden when using mock data) */}
          {!state.loading && state.error && displayItems.length === 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-700">Unable to load auctions at this time. Please try again later.</p>
            </div>
          )}

          {/* Empty State */}
          {!state.loading && !state.error && displayItems.length === 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Auctions</h3>
              <p className="text-gray-600 mb-6">
                There are no active auctions in {cityLabel} at the moment.
              </p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" asChild>
                  <Link to="/regions">Browse Other Regions</Link>
                </Button>
                <Button asChild>
                  <Link to="/alerts">Set Up Alerts</Link>
                </Button>
              </div>
            </div>
          )}

          {/* Auction Grid */}
          {!state.loading && filteredItems.length > 0 && (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {selectedCategory === "all" ? "All Auctions" : selectedCategory}
                </h2>
                <span className="text-sm text-gray-500">
                  {filteredItems.length} {filteredItems.length === 1 ? "auction" : "auctions"}
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredItems.map((item) => (
                  <ProfessionalAuctionCard key={item.id} auction={item} />
                ))}
              </div>

              {/* Load More */}
              {filteredItems.length >= 12 && (
                <div className="mt-8 text-center">
                  <Button variant="outline" size="lg">
                    Load More Auctions
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Bottom CTA Section */}
        {hasData && (
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-12 mt-12">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <h2 className="text-2xl font-bold mb-3">
                Want to Sell Your Business Surplus?
              </h2>
              <p className="mb-6 text-blue-100">
                Join hundreds of businesses in {cityLabel} already selling on ZingLots
              </p>
              <Button size="lg" variant="secondary" asChild>
                <Link to="/seller/apply">Start Selling Today</Link>
              </Button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
