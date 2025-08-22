import { Helmet } from "react-helmet-async";
import ModernNav from "@/components/ModernNav";
import { Link } from "react-router-dom";

const regions = [
  { slug: "seattle", name: "Seattle, WA" },
  { slug: "tacoma", name: "Tacoma, WA" },
  { slug: "portland", name: "Portland, OR" },
  { slug: "los-angeles", name: "Los Angeles, CA" },
  { slug: "san-francisco", name: "San Francisco, CA" },
  { slug: "chicago", name: "Chicago, IL" },
  { slug: "detroit", name: "Detroit, MI" },
  { slug: "new-york", name: "New York, NY" },
  { slug: "boston", name: "Boston, MA" },
  { slug: "philadelphia", name: "Philadelphia, PA" },
  { slug: "houston", name: "Houston, TX" },
  { slug: "dallas", name: "Dallas, TX" },
  { slug: "atlanta", name: "Atlanta, GA" },
  { slug: "miami", name: "Miami, FL" },
  { slug: "phoenix", name: "Phoenix, AZ" },
];

const Regions = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>All Regions | ZingLots</title>
        <meta name="description" content="Browse all supported ZingLots regions and find surplus near you." />
      </Helmet>

      <ModernNav />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">All Regions</h1>
          <p className="text-gray-600 mt-2">Select a region to view local surplus.</p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {regions.map((region) => (
            <Link
              key={region.slug}
              to={`/r/${region.slug}`}
              aria-label={`View ${region.name}`}
              className="block rounded-xl border p-5 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 h-full"
            >
              <div className="text-lg font-semibold">{region.name}</div>
              <div className="text-neutral-700 text-sm mt-1">Browse local auctions →</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Regions;

