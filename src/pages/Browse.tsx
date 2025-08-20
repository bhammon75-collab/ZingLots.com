import { useState } from "react";
import { Helmet } from "react-helmet-async";
import ModernNav from "@/components/ModernNav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  MapPin,
  Clock,
  Gavel,
  Eye,
  Heart,
  ChevronLeft,
  ChevronRight,
  Grid3x3,
  List,
  SortAsc,
  SortDesc
} from "lucide-react";
import { Link } from "react-router-dom";
import "../styles/modern-design.css";

const Browse = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("ending-soon");
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Mock data for lots
  const allLots = [
    {
      id: "1",
      title: "Commercial Kitchen Equipment Package - Full Restaurant Setup",
      currentBid: 3500,
      retailPrice: 12000,
      bids: 18,
      timeLeft: "2h 15m",
      location: "Seattle, WA",
      distance: "3.2 mi",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
      category: "Restaurant",
      watchers: 42,
      condition: "Excellent"
    },
    {
      id: "2",
      title: "Office Furniture Lot - 50 Herman Miller Chairs",
      currentBid: 8900,
      retailPrice: 25000,
      bids: 24,
      timeLeft: "4h 30m",
      location: "Bellevue, WA",
      distance: "8.1 mi",
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop",
      category: "Office",
      watchers: 67,
      condition: "Very Good"
    },
    {
      id: "3",
      title: "Construction Materials - Premium Lumber Package",
      currentBid: 1250,
      retailPrice: 3500,
      bids: 9,
      timeLeft: "45m",
      location: "Tacoma, WA",
      distance: "12.4 mi",
      image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=400&h=300&fit=crop",
      category: "Construction",
      watchers: 23,
      condition: "New",
      urgent: true
    },
    {
      id: "4",
      title: "Industrial Floor Cleaning Equipment",
      currentBid: 2100,
      retailPrice: 6500,
      bids: 7,
      timeLeft: "1d 6h",
      location: "Kent, WA",
      distance: "15.3 mi",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
      category: "Municipal",
      watchers: 19,
      condition: "Good"
    },
    {
      id: "5",
      title: "Restaurant Refrigeration Units - Walk-in Cooler",
      currentBid: 4500,
      retailPrice: 15000,
      bids: 12,
      timeLeft: "6h 45m",
      location: "Renton, WA",
      distance: "9.7 mi",
      image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&h=300&fit=crop",
      category: "Restaurant",
      watchers: 38,
      condition: "Very Good"
    },
    {
      id: "6",
      title: "IT Equipment - Servers and Network Hardware",
      currentBid: 3200,
      retailPrice: 12000,
      bids: 15,
      timeLeft: "8h 20m",
      location: "Seattle, WA",
      distance: "5.2 mi",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop",
      category: "Office",
      watchers: 51,
      condition: "Good",
      hot: true
    }
  ];

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "restaurant", label: "Restaurant Equipment" },
    { value: "office", label: "Office Furniture" },
    { value: "construction", label: "Construction Materials" },
    { value: "municipal", label: "Municipal Surplus" },
    { value: "electronics", label: "Electronics" },
    { value: "vehicles", label: "Vehicles" }
  ];

  const sortOptions = [
    { value: "ending-soon", label: "Ending Soon" },
    { value: "newly-listed", label: "Newly Listed" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "most-bids", label: "Most Bids" },
    { value: "nearest", label: "Nearest First" }
  ];

  const itemsPerPage = 12;
  const totalPages = Math.ceil(allLots.length / itemsPerPage);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search
    console.log("Searching for:", searchQuery);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Browse All Lots - ZingLots</title>
        <meta name="description" content="Browse all available surplus lots. Find great deals on restaurant equipment, office furniture, construction materials, and more." />
      </Helmet>

      <ModernNav />

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-brand-red">Home</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">Browse All Lots</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Browse All Lots</h1>
          <p className="text-gray-600">
            {allLots.length} active lots available • Updated every 5 minutes
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Search */}
            <div className="md:col-span-5">
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="text"
                  placeholder="Search lots..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </form>
            </div>

            {/* Category Filter */}
            <div className="md:col-span-3">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort */}
            <div className="md:col-span-3">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* View Toggle */}
            <div className="md:col-span-1 flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Active Filters */}
          <div className="flex items-center gap-2 mt-4">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Active filters:</span>
            {filterCategory !== "all" && (
              <Badge variant="secondary" className="cursor-pointer hover:bg-gray-200">
                {categories.find(c => c.value === filterCategory)?.label}
                <button className="ml-1">×</button>
              </Badge>
            )}
            {searchQuery && (
              <Badge variant="secondary" className="cursor-pointer hover:bg-gray-200">
                "{searchQuery}"
                <button className="ml-1">×</button>
              </Badge>
            )}
          </div>
        </div>

        {/* Results */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allLots.map((lot) => (
              <Card key={lot.id} className="lot-card group">
                <div className="relative overflow-hidden">
                  <img
                    src={lot.image}
                    alt={lot.title}
                    className="lot-card-image"
                  />
                  <div className="absolute top-2 left-2">
                    {lot.hot && <Badge className="badge-hot">🔥 Hot</Badge>}
                    {lot.urgent && <Badge className="bg-red-500 text-white">Urgent</Badge>}
                  </div>
                  <div className="absolute top-2 right-2">
                    <button className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
                      <Heart className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="absolute bottom-2 left-2 timer-badge">
                    <Clock className="h-3 w-3" />
                    {lot.timeLeft}
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <Badge variant="secondary" className="mb-2">{lot.category}</Badge>
                  <h3 className="font-semibold mb-2 line-clamp-2">{lot.title}</h3>
                  
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-2xl font-bold text-brand-red">
                      ${lot.currentBid.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      ${lot.retailPrice.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                    <span className="flex items-center gap-1">
                      <Gavel className="h-3 w-3" />
                      {lot.bids} bids
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {lot.watchers}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <MapPin className="h-3 w-3 mr-1" />
                    {lot.distance}
                  </div>
                  
                  <Button className="w-full btn-modern btn-primary" asChild>
                    <Link to={`/lot/${lot.id}`}>View Details</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {allLots.map((lot) => (
              <Card key={lot.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <img
                      src={lot.image}
                      alt={lot.title}
                      className="w-48 h-32 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="secondary">{lot.category}</Badge>
                            {lot.hot && <Badge className="badge-hot">🔥 Hot</Badge>}
                            {lot.urgent && <Badge className="bg-red-500 text-white">Urgent</Badge>}
                          </div>
                          <h3 className="text-xl font-semibold">{lot.title}</h3>
                        </div>
                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                          <Heart className="h-5 w-5" />
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-6 mb-3">
                        <div>
                          <span className="text-2xl font-bold text-brand-red">
                            ${lot.currentBid.toLocaleString()}
                          </span>
                          <span className="text-sm text-gray-500 line-through ml-2">
                            ${lot.retailPrice.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Gavel className="h-4 w-4" />
                            {lot.bids} bids
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {lot.watchers} watching
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {lot.timeLeft}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {lot.distance}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button className="btn-modern btn-primary" asChild>
                          <Link to={`/lot/${lot.id}`}>View & Bid</Link>
                        </Button>
                        <Button variant="outline">
                          Watch
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 mt-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          {[...Array(totalPages)].map((_, i) => (
            <Button
              key={i + 1}
              variant={currentPage === i + 1 ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(i + 1)}
              className="min-w-[40px]"
            >
              {i + 1}
            </Button>
          ))}
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Browse;