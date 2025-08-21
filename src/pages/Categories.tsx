import { Helmet } from "react-helmet-async";
import ModernNav from "@/components/ModernNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  Building2,
  UtensilsCrossed,
  Briefcase,
  Wrench,
  Monitor,
  Car,
  Package,
  Hammer,
  Heart,
  Home,
  Shirt,
  Dumbbell
} from "lucide-react";
import "../styles/modern-design.css";

const Categories = () => {
  const mainCategories = [
    {
      id: "construction",
      name: "Construction & Materials",
      icon: Building2,
      description: "Lumber, tools, heavy equipment, safety gear",
      count: 342,
      color: "from-orange-500 to-red-500",
      trending: true,
      subcategories: ["Lumber", "Tools", "Heavy Equipment", "Safety Equipment", "Hardware"]
    },
    {
      id: "restaurant",
      name: "Restaurant & Food Service",
      icon: UtensilsCrossed,
      description: "Commercial kitchen equipment, furniture, supplies",
      count: 189,
      color: "from-green-500 to-emerald-500",
      subcategories: ["Kitchen Equipment", "Refrigeration", "Furniture", "Smallwares", "Bar Equipment"]
    },
    {
      id: "office",
      name: "Office & Business",
      icon: Briefcase,
      description: "Furniture, computers, printers, supplies",
      count: 156,
      color: "from-blue-500 to-indigo-500",
      subcategories: ["Desks & Chairs", "Computers", "Printers", "Storage", "Conference Room"]
    },
    {
      id: "municipal",
      name: "Government & Municipal",
      icon: Wrench,
      description: "Surplus equipment, vehicles, maintenance tools",
      count: 98,
      color: "from-purple-500 to-pink-500",
      subcategories: ["Vehicles", "Maintenance", "Safety", "Parks & Rec", "Public Works"]
    },
    {
      id: "electronics",
      name: "Electronics & IT",
      icon: Monitor,
      description: "Computers, servers, networking, AV equipment",
      count: 267,
      color: "from-cyan-500 to-blue-500",
      trending: true,
      subcategories: ["Computers", "Servers", "Networking", "Audio/Video", "Components"]
    },
    {
      id: "vehicles",
      name: "Vehicles & Equipment",
      icon: Car,
      description: "Cars, trucks, trailers, parts",
      count: 145,
      color: "from-gray-600 to-gray-800",
      subcategories: ["Cars", "Trucks", "Trailers", "Parts", "Accessories"]
    },
    {
      id: "warehouse",
      name: "Warehouse & Industrial",
      icon: Package,
      description: "Shelving, forklifts, packaging equipment",
      count: 203,
      color: "from-yellow-500 to-orange-500",
      subcategories: ["Shelving", "Forklifts", "Packaging", "Material Handling", "Storage"]
    },
    {
      id: "tools",
      name: "Tools & Hardware",
      icon: Hammer,
      description: "Power tools, hand tools, hardware supplies",
      count: 178,
      color: "from-red-500 to-rose-500",
      subcategories: ["Power Tools", "Hand Tools", "Hardware", "Fasteners", "Tool Storage"]
    }
  ];

  const additionalCategories = [
    { id: "medical", name: "Medical & Lab", icon: Heart, count: 67 },
    { id: "furniture", name: "Home Furniture", icon: Home, count: 89 },
    { id: "apparel", name: "Apparel & Textiles", icon: Shirt, count: 45 },
    { id: "fitness", name: "Fitness & Sports", icon: Dumbbell, count: 78 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Browse Categories - ZingLots</title>
        <meta name="description" content="Browse surplus lots by category. Find deals on construction materials, restaurant equipment, office furniture, and more." />
      </Helmet>

      <ModernNav />

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
            <div>
              <span className="text-3xl font-bold">$4.2M</span>
              <span className="text-gray-300 ml-2">Total Value</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Categories Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Popular Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mainCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Link
                  key={category.id}
                  to={`/category/${category.id}`}
                  className="group"
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                    <div className={`h-2 bg-gradient-to-r ${category.color}`} />
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <div className={`p-3 rounded-lg bg-gradient-to-br ${category.color} bg-opacity-10`}>
                          <IconComponent className="h-8 w-8 text-gray-700" />
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          {category.trending && (
                            <Badge className="badge-hot">Trending</Badge>
                          )}
                          <Badge variant="secondary">{category.count} lots</Badge>
                        </div>
                      </div>
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-500 mb-2">Popular subcategories:</p>
                        <div className="flex flex-wrap gap-1">
                          {category.subcategories.slice(0, 3).map((sub) => (
                            <span key={sub} className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                              {sub}
                            </span>
                          ))}
                          {category.subcategories.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{category.subcategories.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Additional Categories */}
        <div>
          <h2 className="text-2xl font-bold mb-6">More Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {additionalCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Link
                  key={category.id}
                  to={`/category/${category.id}`}
                  className="group"
                >
                  <Card className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <IconComponent className="h-6 w-6 text-gray-600 group-hover:text-brand-red transition-colors" />
                          <div>
                            <p className="font-medium">{category.name}</p>
                            <p className="text-sm text-gray-500">{category.count} lots</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Browse by Location */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold mb-4">Browse by Location</h2>
          <p className="text-gray-600 mb-6">
            Find surplus lots near you for easy pickup
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["Seattle", "Tacoma", "Bellevue", "Kent", "Renton", "Everett", "Spokane", "Vancouver"].map((city) => (
              <Link
                key={city}
                to={`/browse?location=${city.toLowerCase()}`}
                className="text-center p-4 border rounded-lg hover:border-brand-red hover:bg-red-50 transition-all"
              >
                <p className="font-medium">{city}</p>
                <p className="text-sm text-gray-500">
                  {Math.floor(Math.random() * 50 + 10)} lots
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 bg-gradient-to-br from-brand-red to-brand-red-dark rounded-lg p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Can't find what you're looking for?</h2>
          <p className="text-xl mb-6 text-red-100">
            Set up alerts and we'll notify you when matching lots become available
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/alerts"
              className="btn-modern bg-white text-brand-red hover:bg-gray-100 px-6 py-3"
            >
              Set Up Alerts
            </Link>
            <Link
              to="/browse"
              className="btn-modern border-2 border-white bg-transparent hover:bg-white hover:text-brand-red px-6 py-3"
            >
              Browse All Lots
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;