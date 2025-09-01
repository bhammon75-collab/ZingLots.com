import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/data/categories";

const Categories = () => {
  const categories = CATEGORIES;
  const categoriesCount = categories.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Browse Categories - ZingLots</title>
        <meta name="description" content="Browse surplus lots by category. Find deals on construction materials, restaurant equipment, office furniture, and more." />
      </Helmet>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Browse by Category</h1>
          <p className="text-xl text-gray-200">
            Explore thousands of surplus lots organized by category
          </p>
          <div className="mt-6 flex items-center gap-8">
            <div>
              <span className="text-3xl font-bold">2,156</span>
              <span className="text-gray-300 ml-2">Active Lots</span>
            </div>
            <div>
              <span className="text-3xl font-bold">{categoriesCount}</span>
              <span className="text-gray-300 ml-2">Categories</span>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Card key={cat.slug} className="hover:shadow-lg transition overflow-hidden">
              <div className="relative aspect-[4/3]">
                <img
                  src={`/categories/${cat.slug}.jpg`}
                  alt={cat.name}
                  loading="lazy"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.jpg";
                  }}
                />
              </div>
              <CardContent className="p-4">
                <div className="mb-3">
                  <h3 className="font-semibold">{cat.name}</h3>
                </div>
                <Button asChild variant="outline" className="w-full">
                  <Link to={`/category/${cat.slug}`}>Browse {cat.name}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;