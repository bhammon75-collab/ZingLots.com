import { Helmet } from "react-helmet-async";
import ModernNav from "@/components/ModernNav";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Home,
  Search,
  ShoppingCart,
  User,
  HelpCircle,
  DollarSign,
  Building2,
  UtensilsCrossed,
  Briefcase,
  Wrench,
  TrendingUp,
  Package,
  Shield,
  FileText,
  MapPin,
  Gavel
} from "lucide-react";

const Sitemap = () => {
  const sitemapSections = [
    {
      title: "Main Pages",
      icon: Home,
      links: [
        { name: "Home", path: "/", description: "Main landing page" },
        { name: "Browse All", path: "/browse", description: "View all available lots" },
        { name: "Discover", path: "/discover", description: "Explore featured items" },
        { name: "Trending", path: "/explore", description: "See what's popular" },
        { name: "Pricing", path: "/pricing", description: "Our fee structure" }
      ]
    },
    {
      title: "Categories",
      icon: Package,
      links: [
        { name: "Construction", path: "/category/construction", description: "Building materials & tools" },
        { name: "Restaurant", path: "/category/restaurant", description: "Commercial kitchen equipment" },
        { name: "Office", path: "/category/office", description: "Furniture & supplies" },
        { name: "Municipal", path: "/category/municipal", description: "Government surplus" },
        { name: "All Categories", path: "/categories", description: "Browse all categories" }
      ]
    },
    {
      title: "Regions",
      icon: MapPin,
      links: [
        { name: "Seattle", path: "/r/seattle", description: "Seattle area listings" },
        { name: "Tacoma", path: "/r/tacoma", description: "Tacoma area listings" },
        { name: "Los Angeles", path: "/r/los-angeles", description: "LA area listings" },
        { name: "Chicago", path: "/r/chicago", description: "Chicago area listings" },
        { name: "All Regions", path: "/regions", description: "Browse by location" }
      ]
    },
    {
      title: "Buying",
      icon: ShoppingCart,
      links: [
        { name: "Active Auctions", path: "/shows", description: "Live auction events" },
        { name: "My Bids", path: "/auction/active", description: "Track your bidding" },
        { name: "Cart", path: "/cart", description: "View your cart" },
        { name: "Buyer Dashboard", path: "/dashboard/buyer", description: "Manage purchases" },
        { name: "How to Buy", path: "/help", description: "Buying guide" }
      ]
    },
    {
      title: "Selling",
      icon: TrendingUp,
      links: [
        { name: "Apply to Sell", path: "/seller/apply", description: "Become a seller" },
        { name: "List an Item", path: "/sell/new", description: "Create new listing" },
        { name: "Seller Dashboard", path: "/dashboard/seller", description: "Manage listings" },
        { name: "Selling Guide", path: "/help/selling", description: "How to sell" },
        { name: "Pricing for Sellers", path: "/pricing", description: "Seller fees" }
      ]
    },
    {
      title: "Support",
      icon: HelpCircle,
      links: [
        { name: "Help Center", path: "/help", description: "Get assistance" },
        { name: "Contact Us", path: "/contact", description: "Reach our team" },
        { name: "Q&A", path: "/qa", description: "Common questions" }
      ]
    },
    {
      title: "Account",
      icon: User,
      links: [
        { name: "Sign In", path: "/login", description: "Access your account" },
        { name: "Register", path: "/login?mode=register", description: "Create account" },
        { name: "Buyer Dashboard", path: "/dashboard/buyer", description: "Buyer portal" },
        { name: "Seller Dashboard", path: "/dashboard/seller", description: "Seller portal" }
      ]
    },
    {
      title: "Legal & Policies",
      icon: Shield,
      links: [
        { name: "Terms of Service", path: "/terms", description: "Usage terms" },
        { name: "Privacy Policy", path: "/privacy", description: "Data protection" },
        { name: "Security", path: "/security", description: "Platform security" },
        { name: "Accessibility", path: "/accessibility", description: "Accessibility info" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Sitemap - ZingLots</title>
        <meta name="description" content="Complete sitemap and navigation guide for ZingLots marketplace." />
      </Helmet>
      
      <ModernNav />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Sitemap</h1>
          <p className="text-xl text-gray-600">
            Quick access to all pages and features on ZingLots
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-brand-red">50+</div>
              <div className="text-sm text-gray-600">Pages</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-brand-red">4</div>
              <div className="text-sm text-gray-600">Main Categories</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-brand-red">10+</div>
              <div className="text-sm text-gray-600">Regions</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-brand-red">24/7</div>
              <div className="text-sm text-gray-600">Availability</div>
            </CardContent>
          </Card>
        </div>

        {/* Sitemap Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sitemapSections.map((section) => (
            <Card key={section.title} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <section.icon className="h-5 w-5 text-brand-red" />
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.path}>
                      <Link 
                        to={link.path}
                        className="group flex flex-col hover:bg-gray-50 p-2 rounded-lg transition-colors"
                      >
                        <span className="font-medium text-gray-900 group-hover:text-brand-red transition-colors">
                          {link.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {link.description}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* XML Sitemap Link */}
        <Card className="mt-12">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-1">XML Sitemap for Search Engines</h3>
                <p className="text-sm text-gray-600">
                  For search engine crawlers and SEO tools
                </p>
              </div>
              <a 
                href="/sitemap.xml" 
                target="_blank"
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
              >
                <FileText className="inline h-4 w-4 mr-2" />
                View XML Sitemap
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Can't find what you're looking for?
          </p>
          <div className="flex gap-4 justify-center">
            <Link 
              to="/help"
              className="px-6 py-3 bg-brand-red text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Visit Help Center
            </Link>
            <Link 
              to="/contact"
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sitemap;