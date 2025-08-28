import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const STATE_CITIES: Record<string, { name: string; href: string }[]> = {
  california: [
    { name: "Los Angeles", href: "/r/los-angeles" },
    { name: "San Francisco", href: "/r/san-francisco" },
  ],
  "new-york": [
    { name: "New York", href: "/r/new-york" },
  ],
  illinois: [
    { name: "Chicago", href: "/r/chicago" },
  ],
  texas: [
    { name: "Houston", href: "/r/houston" },
    { name: "Dallas", href: "/r/dallas" },
  ],
  washington: [
    { name: "Seattle", href: "/r/seattle" },
  ],
  oregon: [
    { name: "Portland", href: "/r/portland" },
  ],
  georgia: [
    { name: "Atlanta", href: "/r/atlanta" },
  ],
  florida: [
    { name: "Miami", href: "/r/miami" },
  ],
  arizona: [
    { name: "Phoenix", href: "/r/phoenix" },
  ],
  pennsylvania: [
    { name: "Philadelphia", href: "/r/philadelphia" },
  ],
};

export default function StatePage() {
  const params = useParams();
  const stateSlug = (params.state || "").toLowerCase();
  const stateName = stateSlug.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
  const cities = STATE_CITIES[stateSlug] || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{stateName} Auctions | ZingLots</title>
        <meta name="description" content={`Browse auctions across ${stateName}.`} />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">{stateName} Auctions</h1>
          <p className="text-gray-600">Explore all markets in {stateName}.</p>
        </div>

        {cities.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Major Cities</h2>
            <div className="flex flex-wrap gap-2">
              {cities.map((c) => (
                <Link key={c.href} to={c.href} className="px-4 py-2 rounded-full border hover:bg-gray-50">
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="bg-white border rounded-lg p-4">
              <div className="h-32 bg-gray-100 rounded mb-3" />
              <div className="font-medium">Sample Auction Lot</div>
              <div className="text-sm text-gray-500">More state-level content coming soon.</div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Link to="/regions" className="text-brand-red hover:underline">Back to all states</Link>
        </div>
      </div>
    </div>
  );
}

