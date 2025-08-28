import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CategoryIcon, { type CategoryIconName } from "@/components/CategoryIcon";

const Categories = () => {
  const categories = [
    { id: "construction-materials", name: "Construction", count: 342 },
    { id: "restaurant-equipment", name: "Restaurant", count: 189 },
    { id: "office-furniture", name: "Office", count: 156 },
    { id: "municipal-surplus", name: "Municipal", count: 98 },
    { id: "blacksmithing", name: "Blacksmithing", count: 24 },
    { id: "jewelry-making", name: "Jewelry Making", count: 41 }
  ];

  const additionalCategories = [
    { id: "medical-lab", name: "Medical & Lab", count: 67 },
    { id: "home-furniture", name: "Home Furniture", count: 89 },
    { id: "apparel-textiles", name: "Apparel & Textiles", count: 45 },
    { id: "fitness-sports", name: "Fitness & Sports", count: 78 }
  ];

  const idToIconName: Record<string, CategoryIconName> = {
    "construction-materials": "bulldozer",
    "restaurant-equipment": "cutlery",
    "office-furniture": "briefcase",
    "municipal-surplus": "wrench",
    "industrial-equipment": "wrench",
    "blacksmithing": "anvil",
    "jewelry-making": "ring",
    "medical-lab": "flask",
    "home-furniture": "sofa",
    "apparel-textiles": "shirt",
    "fitness-sports": "dumbbells",
  };

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
              <span className="text-3xl font-bold">12</span>
              <span className="text-gray-300 ml-2">Categories</span>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Card key={cat.id} className="hover:shadow-lg transition">
              <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center gap-2 mb-3">
                  <div className="aspect-square w-20 flex items-center justify-center">
                    <CategoryIcon name={idToIconName[cat.id]} className="h-16 w-16" alt={cat.name} />
                  </div>
                  <h3 className="font-semibold">{cat.name}</h3>
                  <Badge variant="secondary">{cat.count}</Badge>
                </div>
                <Button asChild variant="outline" className="w-full">
                  <Link to={`/category/${cat.id}`}>Browse {cat.name}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <h2 className="text-2xl font-bold mt-12 mb-6">More Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {additionalCategories.map((cat) => (
            <Card key={cat.id} className="hover:shadow-lg transition">
              <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center gap-2 mb-3">
                  <div className="aspect-square w-20 flex items-center justify-center">
                    <CategoryIcon name={idToIconName[cat.id]} className="h-16 w-16" alt={cat.name} />
                  </div>
                  <h3 className="font-semibold">{cat.name}</h3>
                  <Badge variant="secondary">{cat.count}</Badge>
                </div>
                <Button asChild variant="outline" className="w-full">
                  <Link to={`/category/${cat.id}`}>Browse {cat.name}</Link>
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