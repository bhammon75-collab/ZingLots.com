import { useState, useEffect } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import ModernNav from "@/components/ModernNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  MapPin, 
  Clock, 
  Building2, 
  UtensilsCrossed, 
  Briefcase, 
  Wrench,
  ChevronLeft,
  Gavel,
  Eye
} from "lucide-react";

const RegionPageFixed = () => {
  const { regionSlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('ending_soon');

  // Region data with all cities
  const regionData = {
    seattle: {
      name: "Seattle",
      description: "Pacific Northwest's largest B2B surplus market",
      center: { lat: 47.6062, lon: -122.3321 },
      activeLots: 425,
      activeSellerCount: 34
    },
    tacoma: {
      name: "Tacoma", 
      description: "South Sound commercial equipment hub",
      center: { lat: 47.2529, lon: -122.4443 },
      activeLots: 187,
      activeSellerCount: 21
    },
    portland: {
      name: "Portland",
      description: "Oregon's premier B2B marketplace",
      center: { lat: 45.5152, lon: -122.6784 },
      activeLots: 312,
      activeSellerCount: 28
    },
    "los-angeles": {
      name: "Los Angeles",
      description: "Southern California's largest B2B hub",
      center: { lat: 34.0522, lon: -118.2437 },
      activeLots: 892,
      activeSellerCount: 67
    },
    "san-francisco": {
      name: "San Francisco",
      description: "Bay Area's tech and business equipment marketplace",
      center: { lat: 37.7749, lon: -122.4194 },
      activeLots: 567,
      activeSellerCount: 45
    },
    chicago: {
      name: "Chicago",
      description: "Midwest's commercial equipment center",
      center: { lat: 41.8781, lon: -87.6298 },
      activeLots: 654,
      activeSellerCount: 52
    },
    detroit: {
      name: "Detroit",
      description: "Motor City's industrial marketplace",
      center: { lat: 42.3314, lon: -83.0458 },
      activeLots: 298,
      activeSellerCount: 24
    },
    "new-york": {
      name: "New York",
      description: "America's largest B2B marketplace",
      center: { lat: 40.7128, lon: -74.0060 },
      activeLots: 1245,
      activeSellerCount: 98
    },
    boston: {
      name: "Boston",
      description: "New England's business equipment hub",
      center: { lat: 42.3601, lon: -71.0589 },
      activeLots: 432,
      activeSellerCount: 36
    },
    philadelphia: {
      name: "Philadelphia",
      description: "Mid-Atlantic's commercial marketplace",
      center: { lat: 39.9526, lon: -75.1652 },
      activeLots: 378,
      activeSellerCount: 31
    },
    houston: {
      name: "Houston",
      description: "Texas Gulf Coast's industrial hub",
      center: { lat: 29.7604, lon: -95.3698 },
      activeLots: 723,
      activeSellerCount: 58
    },
    dallas: {
      name: "Dallas",
      description: "North Texas commercial marketplace",
      center: { lat: 32.7767, lon: -96.7970 },
      activeLots: 589,
      activeSellerCount: 47
    },
    atlanta: {
      name: "Atlanta",
      description: "Southeast's B2B equipment center",
      center: { lat: 33.7490, lon: -84.3880 },
      activeLots: 467,
      activeSellerCount: 38
    },
    miami: {
      name: "Miami",
      description: "South Florida's commercial hub",
      center: { lat: 25.7617, lon: -80.1918 },
      activeLots: 391,
      activeSellerCount: 32
    },
    phoenix: {
      name: "Phoenix",
      description: "Southwest's growing B2B marketplace",
      center: { lat: 33.4484, lon: -112.0740 },
      activeLots: 445,
      activeSellerCount: 36
    }
  };

  const region = regionData[regionSlug as keyof typeof regionData] || regionData.seattle;

  // Mock lots data
  const mockLots = [
    {
      id: "1",
      title: "Commercial Pizza Oven - Blodgett Double Deck",
      currentPrice: 3200,
      startPrice: 2500,
      timeLeft: "1h 23m",
      location: `${region.name} Industrial District`,
      category: "restaurant",
      bidCount: 12,
      watchers: 38,
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop"
    },
    {
      id: "2",
      title: "Office Furniture Lot - 50 Herman Miller Chairs",
      currentPrice: 8900,
      startPrice: 5000,
      timeLeft: "3h 45m",
      location: `Downtown ${region.name}`,
      category: "office",
      bidCount: 24,
      watchers: 67,
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop"
    },
    {
      id: "3",
      title: "Construction Materials - Premium Lumber Package",
      currentPrice: 4500,
      startPrice: 3000,
      timeLeft: "6h 12m",
      location: `${region.name} Warehouse District`,
      category: "contractor",
      bidCount: 8,
      watchers: 23,
      image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=400&h=300&fit=crop"
    },
    {
      id: "4",
      title: "Industrial Floor Cleaning Equipment",
      currentPrice: 2100,
      startPrice: 1500,
      timeLeft: "1d 2h",
      location: `${region.name} Business Park`,
      category: "municipal",
      bidCount: 5,
      watchers: 19,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop"
    },
    {
      id: "5",
      title: "Restaurant Refrigeration Units - Walk-in Cooler",
      currentPrice: 6500,
      startPrice: 4000,
      timeLeft: "2d 5h",
      location: `${region.name} Commercial Zone`,
      category: "restaurant",
      bidCount: 15,
      watchers: 42,
      image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&h=300&fit=crop"
    },
    {
      id: "6",
      title: "IT Equipment - Servers and Network Hardware",
      currentPrice: 3200,
      startPrice: 2000,
      timeLeft: "8h 30m",
      location: `${region.name} Tech Center`,
      category: "office",
      bidCount: 18,
      watchers: 51,
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop"
    }
  ];

  const categories = [
    { id: 'all', name: 'All Categories', icon: null },
    { id: 'contractor', name: 'Construction & Materials', icon: Building2 },
    { id: 'restaurant', name: 'Restaurant & Food Service', icon: UtensilsCrossed },
    { id: 'office', name: 'Office & Business Equipment', icon: Briefcase },
    { id: 'municipal', name: 'Government & Municipal', icon: Wrench }
  ];

  const filteredLots = selectedCategory === 'all' 
    ? mockLots 
    : mockLots.filter(lot => lot.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{region.name} - B2B Marketplace | ZingLots</title>
        <meta name="description" content={region.description} />
      </Helmet>
      
      <ModernNav />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary">Home</Link>
          <ChevronLeft className="h-4 w-4 rotate-180" />
          <Link to="/regions" className="hover:text-primary">All Regions</Link>
          <ChevronLeft className="h-4 w-4 rotate-180" />
          <span className="text-foreground font-medium">{region.name}</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{region.name} B2B Marketplace</h1>
          <p className="text-lg text-muted-foreground mb-4">{region.description}</p>
          
          <div className="flex flex-wrap gap-4 mb-6">
            <Badge variant="secondary" className="px-3 py-1">
              <MapPin className="h-4 w-4 mr-1" />
              {region.activeLots} Active Lots
            </Badge>
            <Badge variant="secondary" className="px-3 py-1">
              {region.activeSellerCount} Verified Sellers
            </Badge>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ending_soon">Ending Soon</SelectItem>
                <SelectItem value="newly_listed">Newly Listed</SelectItem>
                <SelectItem value="price_low">Price: Low to High</SelectItem>
                <SelectItem value="price_high">Price: High to Low</SelectItem>
                <SelectItem value="most_bids">Most Bids</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Lots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLots.map(lot => (
            <Card key={lot.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gray-200 relative">
                <img 
                  src={lot.image} 
                  alt={lot.title}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-2 left-2 bg-green-500">
                  Live Auction
                </Badge>
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                  {lot.title}
                </h3>
                
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-2xl font-bold text-primary">
                      ${lot.currentPrice.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Starting: ${lot.startPrice.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {lot.timeLeft}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <Gavel className="h-3 w-3" />
                    {lot.bidCount} bids
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {lot.watchers} watching
                  </span>
                </div>

                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                  <MapPin className="h-3 w-3" />
                  {lot.location}
                </div>

                <Link to={`/lot/${lot.id}`}>
                  <Button className="w-full">Place Bid</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredLots.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No lots found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegionPageFixed;