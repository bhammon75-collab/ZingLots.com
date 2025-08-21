import { Helmet } from "react-helmet-async";
import ModernNav from "@/components/ModernNav";
import { Button } from "@/components/ui/button";
import Logo from "@/components/brand/Logo";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Clock,
  TrendingUp,
  Shield,
  Truck,
  Heart,
  Eye,
  Star,
  ChevronRight,
  ChevronLeft,
  Gavel,
  Package,
  Users,
  Building2,
  UtensilsCrossed,
  Briefcase,
  Wrench,
  Zap,
  ArrowRight
} from "lucide-react";
import "../styles/modern-design.css";

const ModernIndex = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [timeLeft, setTimeLeft] = useState({});

  // Hero carousel data - Featured Active Auctions
  const heroSlides = [
    {
      title: "Restaurant Equipment Auction - Closing Today",
      subtitle: "Complete kitchen liquidation from Seattle steakhouse - 45 lots available",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1920&h=600&fit=crop",
      cta: "View Auction",
      badge: "Ending in 2h 15m",
      currentBid: "$12,400",
      totalLots: 45
    },
    {
      title: "Construction Equipment Auction",
      subtitle: "Heavy machinery and power tools from contractor liquidation",
      image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1920&h=600&fit=crop",
      cta: "Place Bid",
      badge: "Ending Tomorrow",
      currentBid: "$34,200",
      totalLots: 28
    },
    {
      title: "Office Furniture Liquidation Auction",
      subtitle: "Herman Miller chairs, standing desks, conference tables - Tech startup closure",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&h=600&fit=crop",
      cta: "Join Auction",
      badge: "3 Days Left",
      currentBid: "$8,900",
      totalLots: 62
    }
  ];

  // Categories with icons and colors
  const categories = [
    {
      id: "construction",
      name: "Construction",
      icon: Building2,
      count: 342,
      color: "from-orange-500 to-red-500",
      trending: true
    },
    {
      id: "restaurant",
      name: "Restaurant",
      icon: UtensilsCrossed,
      count: 189,
      color: "from-green-500 to-emerald-500"
    },
    {
      id: "office",
      name: "Office",
      icon: Briefcase,
      count: 156,
      color: "from-blue-500 to-indigo-500"
    },
    {
      id: "municipal",
      name: "Municipal",
      icon: Wrench,
      count: 98,
      color: "from-purple-500 to-pink-500"
    }
  ];

  // Featured lots data - Active Auctions
  const featuredLots = [
    {
      id: "1",
      title: "Commercial Kitchen Package - 6 Burner Range + Prep Tables",
      currentPrice: 2400,
      retailPrice: 8500,
      bids: 12,
      timeLeft: "2h 15m",
      location: "Seattle, WA",
      distance: "3.2 mi",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
      seller: "Restaurant Supply Co",
      rating: 4.8,
      watchers: 34,
      category: "Restaurant Equipment",
      hot: true,
      auctionNumber: "#A2024-1842"
    },
    {
      id: "2",
      title: "Pallet of Premium Cedar Lumber - 2x4x8 (150 pieces)",
      currentPrice: 890,
      retailPrice: 2200,
      bids: 8,
      timeLeft: "45m",
      location: "Tacoma, WA",
      distance: "12.4 mi",
      image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=400&h=300&fit=crop",
      seller: "BuildPro Materials",
      rating: 4.9,
      watchers: 18,
      category: "Construction Materials",
      urgent: true,
      auctionNumber: "#A2024-1843"
    },
    {
      id: "3",
      title: "Herman Miller Aeron Chairs - Lot of 20",
      currentPrice: 3200,
      retailPrice: 12000,
      bids: 15,
      timeLeft: "6h 30m",
      location: "Bellevue, WA",
      distance: "8.1 mi",
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop",
      seller: "Office Liquidators",
      rating: 4.7,
      watchers: 42,
      category: "Office Furniture",
      auctionNumber: "#A2024-1844"
    },
    {
      id: "4",
      title: "Industrial Floor Scrubber - Tennant T5",
      currentPrice: 1850,
      retailPrice: 5500,
      bids: 6,
      timeLeft: "1d 4h",
      location: "Kent, WA",
      distance: "15.3 mi",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
      seller: "Municipal Surplus",
      rating: 4.6,
      watchers: 22,
      category: "Industrial Equipment",
      auctionNumber: "#A2024-1845"
    }
  ];

  // Helper function to parse time string to seconds
  const parseTimeToSeconds = (timeStr) => {
    const parts = timeStr.split(' ');
    let totalSeconds = 0;
    
    parts.forEach(part => {
      const value = parseInt(part);
      if (part.includes('d')) {
        totalSeconds += value * 24 * 60 * 60;
      } else if (part.includes('h')) {
        totalSeconds += value * 60 * 60;
      } else if (part.includes('m')) {
        totalSeconds += value * 60;
      } else if (part.includes('s')) {
        totalSeconds += value;
      }
    });
    
    return totalSeconds;
  };

  // Helper function to format seconds to time string
  const formatTimeLeft = (seconds) => {
    if (seconds <= 0) return 'Ended';
    
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    const secs = seconds % 60;
    
    if (days > 0) {
      return `${days}d ${hours}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  // Initialize timeLeft state with parsed seconds
  useEffect(() => {
    const initialTimeLeft = {};
    featuredLots.forEach(lot => {
      initialTimeLeft[lot.id] = parseTimeToSeconds(lot.timeLeft);
    });
    setTimeLeft(initialTimeLeft);
  }, []);

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTimeLeft => {
        const newTimeLeft = {};
        Object.keys(prevTimeLeft).forEach(lotId => {
          const remaining = prevTimeLeft[lotId] - 1;
          newTimeLeft[lotId] = remaining > 0 ? remaining : 0;
        });
        return newTimeLeft;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Auto-rotate hero carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/discover?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>ZingLots - Seattle's Premier B2B Surplus Marketplace</title>
        <meta name="description" content="Buy and sell business surplus locally. Construction materials, restaurant equipment, office furniture, and more. Verified sellers, secure transactions, local pickup only." />
      </Helmet>

      <ModernNav />

      {/* Hero Section with Carousel */}
      <section className="relative h-[500px] overflow-hidden bg-gradient-to-br from-gray-200 to-gray-100">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/60 to-transparent" />
          </div>
        ))}
        
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 w-full">
            <div className="max-w-2xl">
              <div className="h-8 mb-4">
                <Badge className="badge-hot">
                  {heroSlides[currentSlide].badge}
                </Badge>
              </div>
              <div className="h-32">
                <h1 className="text-5xl font-bold text-gray-900 mb-2">
                  {heroSlides[currentSlide].title}
                </h1>
                <div className="flex items-center gap-4 text-lg">
                  <span className="text-brand-red font-bold">Current Bid: {heroSlides[currentSlide].currentBid}</span>
                  <span className="text-gray-600">•</span>
                  <span className="text-gray-700">{heroSlides[currentSlide].totalLots} Lots</span>
                </div>
              </div>
              <div className="h-16 mb-8">
                <p className="text-xl text-gray-700">
                  {heroSlides[currentSlide].subtitle}
                </p>
              </div>
              
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="search-modern mb-6">
                <input
                  type="text"
                  placeholder="Search active auctions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="text-gray-900"
                />
                <button type="submit">
                  <Search className="h-5 w-5" />
                  <span className="hidden lg:inline ml-2">Search Auctions</span>
                </button>
              </form>
              
              <div className="flex gap-4">
                <Link to="/auction/active">
                  <Button className="btn-modern btn-primary">
                    <Gavel className="mr-2 h-4 w-4" />
                    <span className="inline-block min-w-[120px]">
                      {heroSlides[currentSlide].cta}
                    </span>
                  </Button>
                </Link>
                <Link to="/help">
                  <Button className="btn-modern btn-secondary">
                    How to Bid
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Carousel Controls */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentSlide ? 'w-8 bg-gray-800' : 'bg-gray-500'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-8">
              <div className="flex items-center gap-2">
                <Gavel className="h-5 w-5 text-gray-500" />
                <span className="text-sm">
                  <strong>47</strong> Live Auctions
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-gray-500" />
                <span className="text-sm">
                  <strong>2,847</strong> Active Bidders
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-500" />
                <span className="text-sm">
                  <strong>12</strong> Closing Today
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Gavel className="h-5 w-5 text-brand-red" />
              <span className="text-sm font-medium">
                Live Auctions: {featuredLots.length} Ending Today
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Auction Categories</h2>
            <Link to="/categories" className="text-brand-red hover:underline flex items-center">
              Browse All Auctions
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Link
                  key={category.id}
                  to={`/category/${category.id}`}
                  className="group relative overflow-hidden rounded-xl bg-white border hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <IconComponent className="h-10 w-10 text-gray-700 group-hover:text-brand-red transition-colors" />
                      {category.trending && (
                        <Badge className="badge-hot">Trending</Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
                    <p className="text-sm text-gray-500">{category.count} active auctions</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Browse by Location */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-3">Auctions by Location</h2>
            <p className="text-gray-600">Find live auctions in your area</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* West Coast */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <MapPin className="h-5 w-5 text-brand-red mr-2" />
                West Coast
              </h3>
              <div className="space-y-2">
                <Link to="/r/seattle" className="block py-2 px-3 rounded hover:bg-white transition-colors">
                  <span className="font-medium">Seattle, WA</span>
                  <span className="text-sm text-gray-500 ml-2">425 auctions</span>
                </Link>
                <Link to="/r/tacoma" className="block py-2 px-3 rounded hover:bg-white transition-colors">
                  <span className="font-medium">Tacoma, WA</span>
                  <span className="text-sm text-gray-500 ml-2">187 auctions</span>
                </Link>
                <Link to="/r/portland" className="block py-2 px-3 rounded hover:bg-white transition-colors">
                  <span className="font-medium">Portland, OR</span>
                  <span className="text-sm text-gray-500 ml-2">312 auctions</span>
                </Link>
                <Link to="/r/los-angeles" className="block py-2 px-3 rounded hover:bg-white transition-colors">
                  <span className="font-medium">Los Angeles, CA</span>
                  <span className="text-sm text-gray-500 ml-2">892 auctions</span>
                </Link>
                <Link to="/r/san-francisco" className="block py-2 px-3 rounded hover:bg-white transition-colors">
                  <span className="font-medium">San Francisco, CA</span>
                  <span className="text-sm text-gray-500 ml-2">567 auctions</span>
                </Link>
              </div>
            </div>

            {/* Midwest & East */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <MapPin className="h-5 w-5 text-brand-red mr-2" />
                Midwest & East
              </h3>
              <div className="space-y-2">
                <Link to="/r/chicago" className="block py-2 px-3 rounded hover:bg-white transition-colors">
                  <span className="font-medium">Chicago, IL</span>
                  <span className="text-sm text-gray-500 ml-2">654 auctions</span>
                </Link>
                <Link to="/r/detroit" className="block py-2 px-3 rounded hover:bg-white transition-colors">
                  <span className="font-medium">Detroit, MI</span>
                  <span className="text-sm text-gray-500 ml-2">298 auctions</span>
                </Link>
                <Link to="/r/new-york" className="block py-2 px-3 rounded hover:bg-white transition-colors">
                  <span className="font-medium">New York, NY</span>
                  <span className="text-sm text-gray-500 ml-2">1,245 auctions</span>
                </Link>
                <Link to="/r/boston" className="block py-2 px-3 rounded hover:bg-white transition-colors">
                  <span className="font-medium">Boston, MA</span>
                  <span className="text-sm text-gray-500 ml-2">432 auctions</span>
                </Link>
                <Link to="/r/philadelphia" className="block py-2 px-3 rounded hover:bg-white transition-colors">
                  <span className="font-medium">Philadelphia, PA</span>
                  <span className="text-sm text-gray-500 ml-2">378 auctions</span>
                </Link>
              </div>
            </div>

            {/* South */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <MapPin className="h-5 w-5 text-brand-red mr-2" />
                South
              </h3>
              <div className="space-y-2">
                <Link to="/r/houston" className="block py-2 px-3 rounded hover:bg-white transition-colors">
                  <span className="font-medium">Houston, TX</span>
                  <span className="text-sm text-gray-500 ml-2">723 auctions</span>
                </Link>
                <Link to="/r/dallas" className="block py-2 px-3 rounded hover:bg-white transition-colors">
                  <span className="font-medium">Dallas, TX</span>
                  <span className="text-sm text-gray-500 ml-2">589 auctions</span>
                </Link>
                <Link to="/r/atlanta" className="block py-2 px-3 rounded hover:bg-white transition-colors">
                  <span className="font-medium">Atlanta, GA</span>
                  <span className="text-sm text-gray-500 ml-2">467 auctions</span>
                </Link>
                <Link to="/r/miami" className="block py-2 px-3 rounded hover:bg-white transition-colors">
                  <span className="font-medium">Miami, FL</span>
                  <span className="text-sm text-gray-500 ml-2">391 auctions</span>
                </Link>
                <Link to="/r/phoenix" className="block py-2 px-3 rounded hover:bg-white transition-colors">
                  <span className="font-medium">Phoenix, AZ</span>
                  <span className="text-sm text-gray-500 ml-2">445 auctions</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link to="/regions" className="inline-flex items-center gap-2 px-6 py-3 bg-brand-red text-white rounded-lg hover:bg-red-700 transition-colors">
              View All Regions
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Lots */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Active Auctions</h2>
              <p className="text-gray-600">Place your bids before these auctions close</p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => {
                  const container = document.querySelector('.featured-lots-container');
                  if (container) container.scrollBy({ left: -300, behavior: 'smooth' });
                }}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => {
                  const container = document.querySelector('.featured-lots-container');
                  if (container) container.scrollBy({ left: 300, behavior: 'smooth' });
                }}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 featured-lots-container overflow-x-auto">
            {featuredLots.map((lot) => (
              <Card key={lot.id} className="lot-card group">
                <div className="relative overflow-hidden">
                  <img
                    src={lot.image}
                    alt={lot.title}
                    className="lot-card-image"
                  />
                  <div className="absolute top-2 left-2 flex flex-col gap-2">
                    {lot.hot && <Badge className="bg-red-500 text-white">Ending Soon</Badge>}
                    {lot.urgent && <Badge className="bg-orange-500 text-white">Final Hour</Badge>}
                  </div>
                  <div className="absolute top-2 right-2">
                    <button className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
                      <Heart className="h-4 w-4" />
                    </button>
                  </div>
                  <div className={`absolute bottom-2 left-2 timer-badge ${lot.urgent ? 'urgent' : ''}`}>
                    <Clock className="h-3 w-3" />
                    {timeLeft[lot.id] !== undefined ? formatTimeLeft(timeLeft[lot.id]) : lot.timeLeft}
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <Badge variant="secondary" className="mb-2">{lot.category}</Badge>
                  <h3 className="lot-card-title">{lot.title}</h3>
                  
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="lot-card-price">${lot.currentPrice.toLocaleString()}</span>
                    <span className="text-sm text-gray-500">
                      Est. Value: ${lot.retailPrice.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                    <span className="flex items-center gap-1">
                      <Gavel className="h-3 w-3" />
                      {lot.bids} bids
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {lot.watchers} watching
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm mb-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-gray-500" />
                      {lot.distance}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500" />
                      {lot.rating}
                    </span>
                  </div>
                  
                  <div className="text-xs text-gray-500 mb-2">
                    Auction {lot.auctionNumber}
                  </div>
                  <Link to={`/auction/${lot.id}`} className="block w-full">
                    <Button className="w-full btn-modern btn-primary">
                      <Gavel className="mr-2 h-4 w-4" />
                      Place Bid
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Verified Auctioneers</h3>
              <p className="text-gray-600">All auctions are managed by verified businesses with proven track records</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Truck className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Bidding</h3>
              <p className="text-gray-600">Transparent auction process with secure payment handling</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Clock className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Live Auctions</h3>
              <p className="text-gray-600">Place bids anytime on active auctions from your phone or computer</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-brand-red to-brand-red-dark text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-4">Have Equipment to Auction?</h2>
          <p className="text-xl mb-8 text-red-100">
            Turn your surplus inventory into cash through our trusted auction platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/seller/apply">
              <Button size="lg" className="btn-modern bg-white text-brand-red hover:bg-gray-100">
                <Gavel className="mr-2 h-5 w-5" />
                Start an Auction
              </Button>
            </Link>
            <Link to="/help">
              <Button size="lg" className="btn-modern border-2 border-white bg-transparent hover:bg-white hover:text-brand-red">
                How Auctions Work
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-modern">
        <div className="max-w-7xl mx-auto px-4">
          <div className="footer-links">
            <div className="lg:col-span-1">
              <Logo size="lg" withText={true} onDark={true} className="mb-4" />
              <p className="text-gray-400 mb-4 text-sm">
                Seattle's premier B2B surplus marketplace
              </p>
              <div className="flex gap-3">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors text-gray-400 hover:text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors text-gray-400 hover:text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors text-gray-400 hover:text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Marketplace</h4>
              <div className="space-y-2">
                <Link to="/browse" className="footer-link">Browse Lots</Link>
                <Link to="/categories" className="footer-link">Categories</Link>
                <Link to="/regions" className="footer-link">All Regions</Link>
                <Link to="/discover" className="footer-link">Discover</Link>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Popular Cities</h4>
              <div className="space-y-2">
                <Link to="/r/seattle" className="footer-link">Seattle</Link>
                <Link to="/r/los-angeles" className="footer-link">Los Angeles</Link>
                <Link to="/r/chicago" className="footer-link">Chicago</Link>
                <Link to="/r/new-york" className="footer-link">New York</Link>
                <Link to="/r/houston" className="footer-link">Houston</Link>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Selling</h4>
              <div className="space-y-2">
                <Link to="/seller/apply" className="footer-link">Apply to Sell</Link>
                <Link to="/dashboard/seller" className="footer-link">Seller Dashboard</Link>
                <Link to="/pricing" className="footer-link">Pricing</Link>
                <Link to="/help/selling" className="footer-link">Selling Guide</Link>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-2">
                <Link to="/help" className="footer-link">Help Center</Link>
                <Link to="/contact" className="footer-link">Contact Us</Link>
                <Link to="/terms" className="footer-link">Terms of Service</Link>
                <Link to="/privacy" className="footer-link">Privacy Policy</Link>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">&copy; 2025 ZingLots. All rights reserved.</p>
            <div className="flex gap-6 text-sm">
              <Link to="/accessibility" className="footer-link">Accessibility</Link>
              <Link to="/sitemap" className="footer-link">Sitemap</Link>
              <Link to="/security" className="footer-link">Security</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ModernIndex;