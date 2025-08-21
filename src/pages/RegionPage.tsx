import { useState, useEffect } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import ModernNav from "@/components/ModernNav";
import { canonicalizeParams, parseQuery } from "@/lib/query";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/ui/search-bar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { 
  Search, 
  MapPin, 
  Filter, 
  SortDesc, 
  Clock, 
  Truck, 
  Building2, 
  UtensilsCrossed, 
  Briefcase, 
  Wrench,
  ChevronLeft,
  Navigation
} from "lucide-react";

const RegionPage = () => {
  const { regionSlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedVertical, setSelectedVertical] = useState(searchParams.get('vertical') || 'all');
  const [radiusFilter, setRadiusFilter] = useState([parseInt(searchParams.get('radius') || '25')]);
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'ending_soon');
  const [userLocation, setUserLocation] = useState<{lat: number, lon: number} | null>(null);
  const [locationPermission, setLocationPermission] = useState<'pending' | 'granted' | 'denied'>('pending');

  // Mock region data
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

  const verticals = [
    { id: 'all', name: 'All Categories', icon: null, count: 127 },
    { id: 'contractor', name: 'Construction & Materials', icon: Building2, count: 42 },
    { id: 'restaurant', name: 'Restaurant & Food Service', icon: UtensilsCrossed, count: 35 },
    { id: 'office', name: 'Office & Business Equipment', icon: Briefcase, count: 28 },
    { id: 'municipal', name: 'Government & Municipal', icon: Wrench, count: 22 }
  ];

  // Mock lots data with distance calculations
  const mockLots = [
    {
      id: "1",
      title: "Commercial Pizza Oven - Blodgett Double Deck",
      currentPrice: 3200,
      startPrice: 2500,
      timeLeft: "1h 23m",
      endTime: new Date(Date.now() + 1.4 * 60 * 60 * 1000),
      location: "Seattle Industrial District",
      coordinates: { lat: 47.5739, lon: -122.3319 },
      vertical: "restaurant",
      needsForklift: true,
      needsDock: false,
      bidCount: 12,
      condition: "Good",
      quantity: 1,
      uom: "piece",
      seller: "Pacific Restaurant Supply",
      photos: ["/placeholder-oven.jpg"]
    },
    {
      id: "2",
      title: "Pallet Lumber Mixed Hardwood - 200 Board Feet",
      currentPrice: 450,
      startPrice: 300,
      timeLeft: "3h 45m",
      endTime: new Date(Date.now() + 3.75 * 60 * 60 * 1000),
      location: "Georgetown",
      coordinates: { lat: 47.5414, lon: -122.3236 },
      vertical: "contractor",
      needsForklift: true,
      needsDock: false,
      bidCount: 8,
      condition: "New",
      quantity: 200,
      uom: "board_feet",
      seller: "Northwest Lumber Co",
      photos: ["/placeholder-lumber.jpg"]
    },
    {
      id: "3",
      title: "Office Furniture Package - 25 Desk + Chair Sets",
      currentPrice: 2100,
      startPrice: 1500,
      timeLeft: "6h 12m",
      endTime: new Date(Date.now() + 6.2 * 60 * 60 * 1000),
      location: "Bellevue",
      coordinates: { lat: 47.6101, lon: -122.2015 },
      vertical: "office",
      needsForklift: true,
      needsDock: true,
      bidCount: 6,
      condition: "Like New",
      quantity: 25,
      uom: "set",
      seller: "Tech Campus Liquidators",
      photos: ["/placeholder-office.jpg"]
    }
  ];

  // Calculate distance from user location
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Get user location
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
          setLocationPermission('granted');
        },
        () => {
          setLocationPermission('denied');
          // Fall back to region center
          setUserLocation(region.center);
        }
      );
    } else {
      setLocationPermission('denied');
      setUserLocation(region.center);
    }
  }, [region.center]);

  // Filter and sort lots
  const filteredLots = mockLots
    .filter(lot => {
      if (selectedVertical !== 'all' && lot.vertical !== selectedVertical) return false;
      if (searchQuery && !lot.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      
      // Distance filter
      if (userLocation) {
        const distance = calculateDistance(
          userLocation.lat, userLocation.lon,
          lot.coordinates.lat, lot.coordinates.lon
        );
        if (distance > radiusFilter[0]) return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'ending_soon':
          return a.endTime.getTime() - b.endTime.getTime();
        case 'price_low':
          return a.currentPrice - b.currentPrice;
        case 'price_high':
          return b.currentPrice - a.currentPrice;
        case 'distance': {
          if (!userLocation) return 0;
          const distA = calculateDistance(userLocation.lat, userLocation.lon, a.coordinates.lat, a.coordinates.lon);
          const distB = calculateDistance(userLocation.lat, userLocation.lon, b.coordinates.lat, b.coordinates.lon);
          return distA - distB;
        }
        default:
          return 0;
      }
    });

  const requestLocation = () => {
    setLocationPermission('pending');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
        setLocationPermission('granted');
      },
      () => setLocationPermission('denied')
    );
  };

  // sync state from URL on first load
  useEffect(() => {
    const qp = parseQuery(window.location.search)
    if (typeof qp.q === 'string') setSearchQuery(qp.q)
    if (typeof qp.vertical === 'string') setSelectedVertical(qp.vertical)
    if (typeof qp.radius === 'string') setRadiusFilter([Number(qp.radius) || 25])
    if (typeof qp.sort === 'string') setSortBy(qp.sort)
    // listen for back/forward
    const onPop = () => {
      const cur = parseQuery(window.location.search)
      if (typeof cur.q === 'string') setSearchQuery(cur.q)
      if (typeof cur.vertical === 'string') setSelectedVertical(cur.vertical)
      if (typeof cur.radius === 'string') setRadiusFilter([Number(cur.radius) || 25])
      if (typeof cur.sort === 'string') setSortBy(cur.sort)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  // whenever state changes, write canonical querystring
  useEffect(() => {
    const params = canonicalizeParams({
      q: searchQuery || undefined,
      vertical: selectedVertical !== 'all' ? selectedVertical : undefined,
      radius: radiusFilter?.[0] && radiusFilter[0] !== 25 ? radiusFilter[0] : undefined,
      sort: sortBy !== 'ending_soon' ? sortBy : undefined,
    })
    setSearchParams(params)
  }, [searchQuery, selectedVertical, radiusFilter, sortBy, setSearchParams])

  const canonicalUrl = `/r/${regionSlug}?${canonicalizeParams({
    q: searchQuery || undefined,
    vertical: selectedVertical !== 'all' ? selectedVertical : undefined,
    radius: radiusFilter?.[0] && radiusFilter[0] !== 25 ? radiusFilter[0] : undefined,
    sort: sortBy !== 'ending_soon' ? sortBy : undefined,
  }).toString()}`

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{region.name} Surplus | ZingLots</title>
        <meta name="description" content={`${region.name} marketplace: ${region.description}`} />
        <link rel="canonical" href={canonicalUrl} />
        <nav aria-label="breadcrumb">
          <meta name="breadcrumbs" content={`Home > Regions > ${region.name}`} />
        </nav>
      </Helmet>
      {/* Header */}
      <ModernNav />
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back to Home
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{region.name} Surplus</h1>
                <nav className="text-xs text-gray-500" aria-label="Breadcrumbs">
                  <ol className="flex items-center gap-1">
                    <li><Link to="/" className="hover:underline">Home</Link></li>
                    <li>/</li>
                    <li><Link to="/regions" className="hover:underline">Regions</Link></li>
                    <li>/</li>
                    <li aria-current="page">{region.name}</li>
                  </ol>
                </nav>
                <p className="text-sm text-gray-600">{region.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline">
                {region.activeLots} Active Lots
              </Badge>
              <Badge variant="outline">
                {region.activeSellerCount} Sellers
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-6">
              <h3 className="font-semibold mb-4">Filters</h3>
              
              {/* Location Status */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Your Location</span>
                  {locationPermission === 'granted' && (
                    <Badge variant="outline" className="text-xs">
                      <Navigation className="h-3 w-3 mr-1" />
                      Located
                    </Badge>
                  )}
                </div>
                {locationPermission === 'denied' && (
                  <div className="text-sm text-gray-600 mb-2">
                    <p>Enable location for accurate distances</p>
                    <Button variant="outline" size="sm" onClick={requestLocation} className="mt-2">
                      <Navigation className="h-4 w-4 mr-1" />
                      Enable Location
                    </Button>
                  </div>
                )}
                
                <div className="mt-3">
                  <label className="text-sm text-gray-600">
                    Max Distance: {radiusFilter[0]} miles
                  </label>
                  <Slider
                    value={radiusFilter}
                    onValueChange={setRadiusFilter}
                    max={50}
                    min={5}
                    step={5}
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium mb-3">Category</h4>
                <Tabs value={selectedVertical} onValueChange={setSelectedVertical} orientation="vertical">
                  <TabsList className="grid w-full grid-cols-1 h-auto space-y-1">
                    {verticals.map((vertical) => {
                      const IconComponent = vertical.icon;
                      return (
                        <TabsTrigger
                          key={vertical.id}
                          value={vertical.id}
                          className="w-full justify-start px-3 py-2 text-left data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
                        >
                          <div className="flex items-center space-x-2">
                            {IconComponent && <IconComponent className="h-4 w-4" />}
                            <span className="text-sm">{vertical.name}</span>
                            <Badge variant="secondary" className="ml-auto text-xs">
                              {vertical.count}
                            </Badge>
                          </div>
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>
                </Tabs>
              </div>

              {/* Sort Options */}
              <div>
                <h4 className="text-sm font-medium mb-3">Sort By</h4>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ending_soon">Ending Soon</SelectItem>
                    <SelectItem value="price_low">Price: Low to High</SelectItem>
                    <SelectItem value="price_high">Price: High to Low</SelectItem>
                    <SelectItem value="distance">Distance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search Bar */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <SearchBar
                  value={searchQuery}
                  onChange={(v) => setSearchQuery(v)}
                  onSubmit={(v) => {
                    setSearchQuery(v)
                  }}
                  placeholder="Search lots in this region..."
                />
              </div>
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">
                {filteredLots.length} lot{filteredLots.length !== 1 ? 's' : ''} found
              </h2>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>Within {radiusFilter[0]} miles</span>
              </div>
            </div>

            {/* Lots Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredLots.map((lot) => {
                const distance = userLocation ? 
                  calculateDistance(userLocation.lat, userLocation.lon, lot.coordinates.lat, lot.coordinates.lon) : 
                  null;

                return (
                  <Card key={lot.id} className="hover:shadow-lg transition-shadow">
                    <div className="aspect-video bg-gray-200 rounded-t-lg relative">
                      <img 
                        src={lot.photos[0]} 
                        alt={lot.title}
                        className="w-full h-full object-cover rounded-t-lg"
                        onError={(e) => {
                          e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='225' viewBox='0 0 400 225'%3E%3Crect width='400' height='225' fill='%23f3f4f6'/%3E%3Ctext x='200' y='112.5' font-family='Arial' font-size='14' fill='%236b7280' text-anchor='middle'%3E%5BItem Photo%5D%3C/text%3E%3C/svg%3E";
                        }}
                      />
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-red-500 text-white">
                          <Clock className="h-3 w-3 mr-1" />
                          {lot.timeLeft}
                        </Badge>
                      </div>
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary">{lot.condition}</Badge>
                      </div>
                      <div className="absolute bottom-2 left-2 flex gap-1">
                        {lot.needsForklift && (
                          <Badge variant="outline" className="bg-white text-xs">
                            <Truck className="h-3 w-3 mr-1" />
                            Forklift
                          </Badge>
                        )}
                        {lot.needsDock && (
                          <Badge variant="outline" className="bg-white text-xs">
                            Dock Access
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2 line-clamp-2">{lot.title}</h3>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-2xl font-bold text-green-600">
                          ${lot.currentPrice.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-500">
                          {lot.bidCount} bids
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        {lot.location}
                        {distance && (
                          <span className="ml-2">• {distance.toFixed(1)} mi</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 mb-3">
                        {lot.quantity.toLocaleString()} {lot.uom} • {lot.seller}
                      </div>
                      <Button className="w-full" asChild>
                        <Link to={`/lot/${lot.id}`}>View & Bid</Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {filteredLots.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No lots found matching your criteria</p>
                <Button variant="outline" onClick={() => {
                  setSearchQuery('');
                  setSelectedVertical('all');
                  setRadiusFilter([25]);
                }}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegionPage;
