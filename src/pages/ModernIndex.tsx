import { Helmet } from "react-helmet-async";
import ModernNav from "@/components/ModernNav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
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
  Anvil,
  Diamond,
  ArrowRight
} from "lucide-react";
import "../styles/modern-design.css";
import HeroShowcase, { type HeroSlide as HeroShowcaseSlide } from "@/components/HeroShowcase";
import FeaturedAuctionsMarquee, { type AuctionPromo } from "@/features/auctions/FeaturedAuctionsMarquee";
import Brand from "../components/Brand";

const ModernIndex = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [timeLeft, setTimeLeft] = useState({});
  const [dense, setDense] = useState(false);

  // Featured auctions for marquee
  const featuredAuctions: AuctionPromo[] = [
    {
      id: "a1",
      title: "Office Furniture Liquidation - Herman Miller Chairs",
      imageUrl: "https://images.unsplash.com/photo-1562113134-d71a4d791c6f?w=400&h=300&fit=crop",
      closesAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      location: "Seattle, WA",
      href: "/auction/a1",
    },
    {
      id: "a2",
      title: "Commercial Kitchen Equipment Package",
      imageUrl: "https://images.unsplash.com/photo-1574739782594-db4ead022697?w=400&h=300&fit=crop",
      closesAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      location: "Tacoma, WA",
      href: "/auction/a2",
    },
    {
      id: "a3",
      title: "Construction Equipment - Excavator & Tools",
      imageUrl: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop",
      closesAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      location: "Portland, OR",
      href: "/auction/a3",
    },
    {
      id: "a4",
      title: "Premium Cedar Lumber Pallet - 150 pieces",
      imageUrl: "https://images.unsplash.com/photo-1609205612107-e0ec2120f9de?w=400&h=300&fit=crop",
      closesAt: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
      location: "Bellevue, WA",
      href: "/auction/a4",
    },
    {
      id: "a5",
      title: "Industrial Floor Scrubber Equipment",
      imageUrl: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&h=300&fit=crop",
      closesAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      location: "Los Angeles, CA",
      href: "/auction/a5",
    },
  ];

  // Hero carousel data - Invaluable-style showcase
  const heroSlides: HeroShowcaseSlide[] = [
    {
      id: "construction-auction",
      imageUrl: "/products/tools.jpg",
      alt: "Contractor tools and equipment pallet",
      dateText: "Aug 26 | 12 PM EDT",
      title: "Contractor Tools & Jobsite Equipment",
      subhead: "Regional Surplus Auction",
      ctaText: "Browse Lots",
      href: "/browse?category=construction",
    },
    {
      id: "restaurant-liquidation",
      imageUrl: "/products/cleaning-equipment.jpg",
      alt: "Commercial cleaning and restaurant equipment",
      dateText: "Aug 27 | 10 AM EDT",
      title: "Commercial Kitchen & Facility Equipment",
      subhead: "Local Pickup Only",
      ctaText: "Browse Lots",
      href: "/browse?category=restaurant",
    },
  ];

  // Categories with icons and colors
  const categories = [
    {
      id: "construction-materials",
      name: "Construction",
      icon: Building2,
      count: 342,
      color: "from-orange-500 to-red-500",
      image: "/categories/constructionreal.jpg",
      trending: true
    },
    {
      id: "restaurant-equipment",
      name: "Restaurant",
      icon: UtensilsCrossed,
      count: 189,
      color: "from-green-500 to-emerald-500",
      image: "/categories/cookingreal.jpg"
    },
    {
      id: "office-furniture",
      name: "Office",
      icon: Briefcase,
      count: 156,
      color: "from-blue-500 to-indigo-500",
      image: "/categories/officereal.jpg"
    },
    {
      id: "municipal-surplus",
      name: "Municipal",
      icon: Wrench,
      count: 98,
      color: "from-purple-500 to-pink-500",
      image: "/categories/municipal.jpg"
    }
    ,
    {
      id: "blacksmithing",
      name: "Blacksmithing",
      icon: Anvil,
      count: 24,
      color: "from-stone-600 to-stone-800",
      image: "/categories/blacksmithreal.jpg"
    },
    {
      id: "jewelry-making",
      name: "Jewelry Making",
      icon: Diamond,
      count: 41,
      color: "from-rose-500 to-pink-500",
      image: "/categories/jewelryreal.jpg"
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
      image: "https://images.unsplash.com/photo-1574739782594-db4ead022697?w=400&h=300&fit=crop", // Actual commercial range
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
      image: "https://images.unsplash.com/photo-1609205612107-e0ec2120f9de?w=400&h=300&fit=crop", // Stacked lumber
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
      image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400&h=300&fit=crop", // Office chairs
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
      image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&h=300&fit=crop", // Industrial equipment
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

  // Countdown timer effect - optimized to prevent unnecessary re-renders
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTimeLeft => {
        // Only update if there are active timers
        const hasActiveTimers = Object.values(prevTimeLeft).some(time => time > 0);
        if (!hasActiveTimers) {
          clearInterval(timer);
          return prevTimeLeft;
        }
        
        const newTimeLeft = {};
        let hasChanges = false;
        Object.keys(prevTimeLeft).forEach(lotId => {
          const remaining = prevTimeLeft[lotId] - 1;
          const newValue = remaining > 0 ? remaining : 0;
          if (newValue !== prevTimeLeft[lotId]) {
            hasChanges = true;
          }
          newTimeLeft[lotId] = newValue;
        });
        
        // Only return new object if there were actual changes
        return hasChanges ? newTimeLeft : prevTimeLeft;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);





  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>ZingLots - The Premier B2B Surplus Marketplace</title>
        <meta name="description" content="Buy and sell business surplus locally. Construction materials, restaurant equipment, office furniture, and more. Verified sellers, secure transactions, local pickup only." />
      </Helmet>

      <ModernNav />

      {/* LCP preload for first hero image */}
      <link rel="preload" as="image" href={heroSlides[0].imageUrl} />
      
      {/* Hero Carousel (compact) */}
      <HeroShowcase slides={heroSlides} delayMs={4500} speedMs={650} compact className="mb-4" />

      {/* Stats Bar */}
      <section className="border-t border-zinc-200/70 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 py-3 text-sm">
            <Link to="/browse" className="inline-flex items-center gap-2 text-zinc-600 hover:text-zinc-900 transition-colors">
              <Gavel className="h-4 w-4" />
              <span><strong>47</strong> Live Auctions</span>
            </Link>
            <span className="h-4 w-px bg-zinc-200 hidden sm:block"></span>
            <Link to="/browse" className="inline-flex items-center gap-2 text-zinc-600 hover:text-zinc-900 transition-colors">
              <Users className="h-4 w-4" />
              <span><strong>2,847</strong> Active Bidders</span>
            </Link>
            <span className="h-4 w-px bg-zinc-200 hidden sm:block"></span>
            <Link to="/browse" className="inline-flex items-center gap-2 text-zinc-600 hover:text-zinc-900 transition-colors">
              <Clock className="h-4 w-4" />
              <span><strong>12</strong> Closing Today</span>
            </Link>
            <span className="ml-auto hidden lg:flex items-center gap-4">
              <Link to="/help" className="hover:text-brand-red transition-colors">How to Bid</Link>
              <Link to="/seller/apply" className="hover:text-brand-red transition-colors">Consign Items</Link>
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Notice Bar */}
      <section className="bg-green-50 border-y border-green-200">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-center gap-2 text-sm text-green-800">
            <svg className="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>
              <strong>Promo Pricing:</strong> Buyer's Premium 9% (min $2) • Card processing 3% • 
              <strong className="text-green-600"> Sellers list FREE (0% fees)</strong>
            </span>
            <Link to="/pricing" className="text-green-600 hover:text-green-700 underline ml-1">
              Learn more
            </Link>
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
                  className="group category-card-link relative overflow-hidden rounded-xl bg-white border hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={category.image}
                      alt={`${category.name}`}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
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

      {/* Browse by Location - city buttons + All locations */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">Auctions by Location</h2>
            <Link to="/regions" className="text-brand-red hover:underline flex items-center">
              view all regions
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/r/new-york" className="px-4 py-2 rounded-full border hover:bg-gray-50">New York</Link>
            <Link to="/r/los-angeles" className="px-4 py-2 rounded-full border hover:bg-gray-50">Los Angeles</Link>
            <Link to="/r/chicago" className="px-4 py-2 rounded-full border hover:bg-gray-50">Chicago</Link>
            <Link to="/r/houston" className="px-4 py-2 rounded-full border hover:bg-gray-50">Houston</Link>
            <Link to="/r/phoenix" className="px-4 py-2 rounded-full border hover:bg-gray-50">Phoenix</Link>
            <Link to="/r/philadelphia" className="px-4 py-2 rounded-full border hover:bg-gray-50">Philadelphia</Link>
            <Link to="/r/san-francisco" className="px-4 py-2 rounded-full border hover:bg-gray-50">San Francisco</Link>
            <Link to="/r/los-angeles" className="px-4 py-2 rounded-full border hover:bg-gray-50">Los Angeles</Link>
            <Link to="/r/dallas" className="px-4 py-2 rounded-full border hover:bg-gray-50">Dallas</Link>
            <Link to="/r/miami" className="px-4 py-2 rounded-full border hover:bg-gray-50">Miami</Link>
            <Link to="/regions" className="ml-auto px-4 py-2 rounded-full bg-black text-white hover:opacity-90">All locations</Link>
          </div>
        </div>
      </section>

      {/* Moving Auctions Marquee */}
      <section className="bg-zinc-50/60 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-4 flex items-center gap-2">
            <Badge className="bg-black text-white">Featured</Badge>
            <h2 className="text-xl font-extrabold tracking-tight text-zinc-900">Featured Auctions</h2>
          </div>
          <FeaturedAuctionsMarquee items={featuredAuctions} />
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
            <div className="flex gap-2 items-center">
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
              <label className="ml-2 flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" checked={dense} onChange={(e)=>setDense(e.target.checked)} />
                Compact
              </label>
            </div>
          </div>
          
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 featured-lots-container overflow-x-auto ${dense ? 'lot-card-dense' : ''}`}>
            {featuredLots.map((lot) => (
              <Card key={lot.id} className={`lot-card group flex flex-col h-full ${dense ? 'lot-card-dense' : ''}`}>
                <div className="relative overflow-hidden aspect-[4/3]">
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
                  {(() => {
                    const seconds = timeLeft[lot.id] ?? undefined;
                    const badgeClass = seconds !== undefined
                      ? seconds <= 3600
                        ? 'timer-badge-critical'
                        : seconds <= 86400
                          ? 'timer-badge-warning'
                          : 'timer-badge'
                      : 'timer-badge';
                    return (
                      <div className={`absolute bottom-2 left-2 ${badgeClass}`}>
                        <Clock className="h-3 w-3" />
                        {seconds !== undefined ? formatTimeLeft(seconds) : lot.timeLeft}
                      </div>
                    );
                  })()}
                </div>
                
                <CardContent className={`flex flex-col h-full ${dense ? 'card-padding' : 'p-4'}`}>
                  <Badge variant="secondary" className="mb-2">{lot.category}</Badge>
                  <h3 className="lot-card-title">{lot.title}</h3>
                  
                  <div className="flex items-baseline justify-between mb-3">
                    <span className="lot-card-price">${lot.currentPrice.toLocaleString()}</span>
                    <span className="text-xs text-gray-500">{lot.bids} bids</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-gray-400" />
                      {lot.distance}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {lot.watchers} watching
                    </span>
                  </div>
                  
                  <Link to={`/live/${lot.id}`} className="block w-full mt-auto">
                    <Button className="w-full btn-modern btn-primary" aria-label="Bid Now">
                      Bid Now
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
      <section className="py-20 bg-[#0f172a] text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-4">Have Equipment to Auction?</h2>
          <p className="text-xl mb-8 text-white/80">
            Turn your surplus inventory into cash through our trusted auction platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/seller/apply">
              <Button size="lg" className="btn-modern bg-[#ef4444] text-white hover:bg-red-600">
                <Gavel className="mr-2 h-5 w-5" />
                Start an Auction
              </Button>
            </Link>
            <Link to="/help">
              <Button size="lg" variant="outline" className="btn-modern border-[#2563eb] text-[#2563eb] hover:bg-blue-50">
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
              <div className="text-center md:text-left">
                {/* Brand removed to reduce redundant dark logo */}
                <p className="text-white/70">The premier B2B surplus marketplace.</p>
                
                <div className="mt-3 flex items-center justify-center md:justify-start gap-2.5">
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
                     className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
                     aria-label="Facebook">
                    <span className="sr-only">Facebook</span>
                    <svg className="h-4 w-4 fill-white/80" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" 
                     className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
                     aria-label="X">
                    <span className="sr-only">X</span>
                    <svg className="h-4 w-4 fill-white/80" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" 
                     className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
                     aria-label="LinkedIn">
                    <span className="sr-only">LinkedIn</span>
                    <svg className="h-4 w-4 fill-white/80" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                </div>
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
                <Link to="/buyer-protection" className="footer-link">Buyer Protection</Link>
                <Link to="/secure-payments" className="footer-link">Secure Payments</Link>
                <Link to="/disputes" className="footer-link">Dispute Resolution</Link>
                <Link to="/logistics" className="footer-link">Logistics & Handoff Guidance</Link>
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