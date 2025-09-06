import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { MapPin, TrendingUp, Users, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const regions = [
  { slug: "seattle", name: "Seattle, WA", active: 42, trending: true },
  { slug: "tacoma", name: "Tacoma, WA", active: 18, trending: false },
  { slug: "portland", name: "Portland, OR", active: 35, trending: true },
  { slug: "los-angeles", name: "Los Angeles, CA", active: 67, trending: true },
  { slug: "san-francisco", name: "San Francisco, CA", active: 54, trending: true },
  { slug: "chicago", name: "Chicago, IL", active: 48, trending: false },
  { slug: "detroit", name: "Detroit, MI", active: 22, trending: false },
  { slug: "new-york", name: "New York, NY", active: 89, trending: true },
  { slug: "boston", name: "Boston, MA", active: 31, trending: false },
  { slug: "philadelphia", name: "Philadelphia, PA", active: 27, trending: false },
  { slug: "houston", name: "Houston, TX", active: 45, trending: true },
  { slug: "dallas", name: "Dallas, TX", active: 38, trending: false },
  { slug: "atlanta", name: "Atlanta, GA", active: 33, trending: true },
  { slug: "miami", name: "Miami, FL", active: 29, trending: false },
  { slug: "phoenix", name: "Phoenix, AZ", active: 26, trending: false },
];

const featuredRegions = ["new-york", "los-angeles", "chicago", "houston"];

const Regions = () => {
  const totalActive = regions.reduce((sum, r) => sum + r.active, 0);
  const featured = regions.filter(r => featuredRegions.includes(r.slug));
  const other = regions.filter(r => !featuredRegions.includes(r.slug));

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>All Regions - Business Surplus Auctions | ZingLots</title>
        <meta name="description" content="Find business surplus auctions in your area. Browse all ZingLots regions across the United States." />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Markets & States",
            itemListElement: [
              "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"
            ].map((state, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: state,
              url: `${typeof window !== 'undefined' ? window.location.origin : 'https://www.zinglots.com'}/state/${state.toLowerCase().replace(/\s+/g,'-')}`
            }))
          })}
        </script>
      </Helmet>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Surplus Auctions Near You
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Browse business equipment, restaurant supplies, office furniture, and more in {regions.length} major markets across the United States
            </p>
            {/* Stat belt */}
            <div className="mb-6 flex justify-center gap-8 md:gap-12">
              <div className="text-center">
                <div className="text-3xl font-bold">{totalActive}</div>
                <div className="text-sm text-blue-200">Active Auctions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">$2.5K</div>
                <div className="text-sm text-blue-200">Median Lot Value</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">Restaurant</div>
                <div className="text-sm text-blue-200">Top Category</div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex justify-center gap-8 md:gap-12">
              <div>
                <div className="text-3xl font-bold">{totalActive}</div>
                <div className="text-sm text-blue-200">Active Auctions</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{regions.length}</div>
                <div className="text-sm text-blue-200">Cities</div>
              </div>
              <div>
                <div className="text-3xl font-bold">10K+</div>
                <div className="text-sm text-blue-200">Businesses</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Featured Regions */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            <h2 className="text-2xl font-bold text-gray-900">Featured Markets</h2>
            <Badge variant="secondary">Most Active</Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {featured.map((region) => (
              <Link
                key={region.slug}
                to={`/r/${region.slug}`}
                className="group relative bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-blue-500 hover:shadow-lg transition-all"
              >
                <div className="absolute top-3 right-3">
                  {region.trending && (
                    <Badge variant="destructive" className="bg-orange-500">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Hot
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                      {region.name}
                    </h3>
                    <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Package className="w-3.5 h-3.5" />
                        {region.active} active
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {Math.floor(region.active * 2.5)} sellers
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Avg. lot value</span>
                    <span className="font-semibold text-gray-900">
                      ${(2000 + Math.floor(Math.random() * 3000)).toLocaleString()}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* All States */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <MapPin className="w-5 h-5 text-gray-500" />
            <h2 className="text-2xl font-bold text-gray-900">All States</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"].map((state) => (
              <Link
                key={state}
                to={`/state/${state.toLowerCase().replace(/\s+/g,'-')}`}
                className="group bg-white rounded-lg border border-gray-200 p-4 hover:border-blue-400 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {state}
                  </h3>
                </div>
                <div className="text-sm text-gray-600">View markets →</div>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 md:p-12 text-white text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Don't See Your City?
          </h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            We're expanding to new markets every month. Join our waitlist to be notified when ZingLots launches in your area.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-3 rounded-lg text-gray-900 min-w-[250px]"
            />
            <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors">
              Join Waitlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Regions;

