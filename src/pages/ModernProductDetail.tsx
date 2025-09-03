import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Heart,
  Share2,
  Clock,
  MapPin,
  Truck,
  Shield,
  Star,
  ChevronLeft,
  ChevronRight,
  Eye,
  Gavel,
  Package,
  AlertCircle,
  CheckCircle,
  User,
  Calendar,
  DollarSign,
  TrendingUp,
  Info,
  Camera,
  ZoomIn
} from "lucide-react";
import "../styles/modern-design.css";

const ModernProductDetail = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [bidAmount, setBidAmount] = useState("");
  const [isWatching, setIsWatching] = useState(false);
  const [showZoom, setShowZoom] = useState(false);

  // Mock product data
  const product = {
    id: id,
    title: "Commercial Kitchen Package - 6 Burner Range, Prep Tables & Equipment",
    description: "Complete commercial kitchen setup from a recently closed restaurant. All equipment is in excellent working condition and has been professionally cleaned. Perfect for new restaurant ventures or kitchen upgrades.",
    currentBid: 2400,
    nextMinBid: 2450,
    buyNowPrice: 4500,
    retailValue: 8500,
    bids: 12,
    timeLeft: "2h 15m 32s",
    endDate: "2025-01-15 14:30:00",
    condition: "Excellent - Used",
    category: "Restaurant Equipment",
    subcategory: "Kitchen Equipment",
    location: "Seattle, WA 98101",
    distance: "3.2 miles",
    pickupWindow: "Jan 16-18, 2025",
    images: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=800&h=600&fit=crop"
    ],
    seller: {
      name: "Restaurant Supply Co",
      rating: 4.8,
      reviews: 234,
      responseTime: "< 1 hour",
      memberSince: "2020",
      totalSales: 1847,
      verified: true
    },
    specifications: {
      "Brand": "Vulcan",
      "Model": "VC6GD-11",
      "Dimensions": "36\"W x 32\"D x 37\"H",
      "Power": "Natural Gas / 150,000 BTU",
      "Weight": "450 lbs",
      "Year": "2019",
      "Included Items": "6-burner range, 2 prep tables, utensil rack"
    },
    bidHistory: [
      { bidder: "j***e", amount: 2400, time: "2 min ago" },
      { bidder: "m***k", amount: 2350, time: "5 min ago" },
      { bidder: "s***a", amount: 2300, time: "12 min ago" },
      { bidder: "d***n", amount: 2200, time: "18 min ago" },
      { bidder: "r***t", amount: 2100, time: "25 min ago" }
    ],
    similarItems: [
      {
        id: "2",
        title: "Commercial Refrigerator - True T-49",
        currentBid: 1850,
        image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&h=300&fit=crop",
        timeLeft: "4h 30m"
      },
      {
        id: "3",
        title: "Dishwasher - Hobart AM15",
        currentBid: 3200,
        image: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=400&h=300&fit=crop",
        timeLeft: "1d 2h"
      }
    ],
    shipping: {
      localPickup: true,
      delivery: true,
      deliveryFee: "Quote on request",
      forkliftRequired: true
    },
    watchers: 34,
    views: 567
  };

  const handleBid = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle bid submission
    console.log("Placing bid:", bidAmount);
  };

  const handleBuyNow = () => {
    // Handle buy now
    console.log("Buy now clicked");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{product.title} - ZingLots</title>
        <meta name="description" content={product.description} />
        {id && <link rel="canonical" href={`/lot/${id}`} />}
        <meta property="og:title" content={`${product.title} | ZingLots`} />
        <meta property="og:type" content="product" />
        <meta property="og:url" content={`https://www.zinglots.com/lot/${id}`} />
        <meta property="og:description" content={product.description} />
        <meta property="og:image" content={product.images?.[0]} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          "name": product.title,
          "description": product.description,
          "image": product.images?.slice(0,3),
          "brand": { "@type": "Organization", "name": "ZingLots" },
          "offers": {
            "@type": "Offer",
            "priceCurrency": "USD",
            "price": product.currentBid?.toFixed?.(2) || String(product.currentBid ?? 0),
            "availability": "https://schema.org/InStock",
            "url": id ? `https://www.zinglots.com/lot/${id}` : undefined
          },
          "seller": { "@type": "Organization", "name": "ZingLots" },
          "@graph": [
            {
              "@type": "Organization",
              "name": "ZingLots",
              "url": "https://www.zinglots.com"
            },
            {
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.zinglots.com/" },
                { "@type": "ListItem", "position": 2, "name": product.category, "item": `https://www.zinglots.com/category/${(product.category||'').toLowerCase().replace(/\s+/g,'-')}` },
                { "@type": "ListItem", "position": 3, "name": product.title, "item": id ? `https://www.zinglots.com/lot/${id}` : undefined }
              ]
            },
            {
              "@type": "Place",
              "name": product.location || "United States"
            }
          ]
        })}</script>
      </Helmet>

      
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <nav className="flex items-center gap-2 text-sm">
              <Link to="/" className="text-gray-500 hover:text-brand-red">Home</Link>
              <span className="text-gray-400">/</span>
              <Link to={`/category/${
                product.category === 'Construction Materials' ? 'construction-materials' :
                product.category === 'Restaurant Equipment' ? 'restaurant-equipment' :
                product.category === 'Office Furniture' ? 'office-furniture' :
                product.category === 'Industrial Equipment' ? 'industrial-equipment' :
                product.category === 'Municipal Surplus' ? 'municipal-surplus' :
                product.category === 'Vehicles & Fleet' ? 'vehicles-fleet' :
                product.category === 'Medical & Lab' ? 'medical-lab' :
                product.category === 'Home Furniture' ? 'home-furniture' :
                product.category === 'Apparel & Textiles' ? 'apparel-textiles' :
                product.category === 'Fitness & Sports' ? 'fitness-sports' :
                ''
              }`} className="text-gray-500 hover:text-brand-red">
                {product.category}
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-medium">{product.subcategory}</span>
            </nav>
          </div>
        </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div>
            <div className="relative bg-white rounded-xl overflow-hidden mb-4 group">
              <img
                src={product.images[selectedImage]}
                alt={product.title}
                className="w-full h-[500px] object-cover cursor-zoom-in"
                onClick={() => setShowZoom(true)}
              />
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => setSelectedImage(Math.max(0, selectedImage - 1))}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => setSelectedImage(Math.min(product.images.length - 1, selectedImage + 1))}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <div className="absolute top-4 right-4 flex gap-2">
                <button className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
                  <ZoomIn className="h-5 w-5" />
                </button>
                <button className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
                  <Camera className="h-5 w-5" />
                </button>
              </div>
              <Badge className="absolute top-4 left-4 bg-green-500 text-white">
                {product.condition}
              </Badge>
            </div>
            
            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index ? 'border-brand-red' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`View ${index + 1}`}
                    className="w-full h-24 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-4">
              <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {product.views} views
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  {product.watchers} watching
                </span>
                <button className="flex items-center gap-1 hover:text-brand-red transition-colors">
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
              </div>
            </div>

            {/* Pricing Card */}
            <Card className="mb-6 border-2 border-brand-red/20 bg-red-50/50">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Current Bid</p>
                    <p className="text-3xl font-bold text-brand-red">
                      ${product.currentBid.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {product.bids} bids
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Time Left</p>
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-red-500" />
                      <p className="text-2xl font-semibold">{product.timeLeft}</p>
                    </div>
                    <p className="text-xs text-gray-500">Ends {product.endDate}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {Math.round((1 - product.currentBid / product.retailValue) * 100)}% below retail
                  </Badge>
                  <span className="text-sm text-gray-500">
                    Retail value: <span className="line-through">${product.retailValue.toLocaleString()}</span>
                  </span>
                </div>

                {/* Bid Form */}
                <form onSubmit={handleBid} className="mb-4">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <input
                        type="number"
                        min={product.nextMinBid}
                        step="50"
                        placeholder={`Enter $${product.nextMinBid} or more`}
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        className="input-modern"
                      />
                    </div>
                    <Button type="submit" className="btn-modern btn-primary">
                      Place Bid
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Next minimum bid: ${product.nextMinBid}
                  </p>
                </form>

                {/* Buy Now Option */}
                {product.buyNowPrice && (
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-sm text-gray-600">Buy It Now</p>
                        <p className="text-2xl font-bold">${product.buyNowPrice.toLocaleString()}</p>
                      </div>
                      <Button 
                        onClick={handleBuyNow}
                        className="btn-modern bg-green-600 hover:bg-green-700"
                      >
                        Buy Now
                      </Button>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setIsWatching(!isWatching)}
                  className={`w-full mt-4 py-2 px-4 rounded-lg border-2 transition-all ${
                    isWatching 
                      ? 'bg-brand-red text-white border-brand-red' 
                      : 'bg-white text-gray-700 border-gray-300 hover:border-brand-red'
                  }`}
                >
                  <Heart className={`h-4 w-4 inline mr-2 ${isWatching ? 'fill-current' : ''}`} />
                  {isWatching ? 'Watching' : 'Watch this item'}
                </button>
              </CardContent>
            </Card>

            {/* Location & Pickup */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-brand-red" />
                  Location & Pickup
                </h3>
                <div className="space-y-2 text-sm">
                  <p className="flex items-center gap-2">
                    <span className="font-medium">Location:</span>
                    {product.location} ({product.distance})
                  </p>
                  <p className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Pickup Window:</span>
                    {product.pickupWindow}
                  </p>
                  {product.shipping.forkliftRequired && (
                    <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <span className="text-yellow-800">Forklift required for loading</span>
                    </div>
                  )}
                  {product.shipping.delivery && (
                    <p className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-gray-500" />
                      Delivery available - {product.shipping.deliveryFee}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Seller Info */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold flex items-center gap-2">
                        {product.seller.name}
                        {product.seller.verified && (
                          <CheckCircle className="h-4 w-4 text-blue-500" />
                        )}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          {product.seller.rating} ({product.seller.reviews})
                        </span>
                        <span>Member since {product.seller.memberSince}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Contact Seller
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold">{product.seller.totalSales}</p>
                    <p className="text-xs text-gray-600">Items Sold</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">98%</p>
                    <p className="text-xs text-gray-600">Positive Feedback</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{product.seller.responseTime}</p>
                    <p className="text-xs text-gray-600">Response Time</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-12">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-4 max-w-2xl">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="bidding">Bid History</TabsTrigger>
              <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Description</h3>
                  <p className="text-gray-700 mb-4">{product.description}</p>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Info className="h-5 w-5 text-blue-600" />
                      What's Included
                    </h4>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      <li>6-Burner Commercial Range (Natural Gas)</li>
                      <li>2x Stainless Steel Prep Tables (48" x 24")</li>
                      <li>Wall-mounted Utensil Rack System</li>
                      <li>All necessary gas connectors and fittings</li>
                      <li>Original operation manuals</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="specifications" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Specifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b">
                        <span className="font-medium text-gray-600">{key}:</span>
                        <span className="text-gray-900">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="bidding" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Bid History</h3>
                  <div className="space-y-3">
                    {product.bidHistory.map((bid, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                        <div className="flex items-center gap-3">
                          <Gavel className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">{bid.bidder}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${bid.amount}</p>
                          <p className="text-xs text-gray-500">{bid.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="shipping" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Shipping & Returns</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Pickup Information</h4>
                      <p className="text-gray-700">
                        Items must be picked up within the specified pickup window. 
                        Buyer is responsible for loading and transportation. 
                        Staff will be available to assist with locating items.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Delivery Options</h4>
                      <p className="text-gray-700">
                        Delivery can be arranged for an additional fee. 
                        Quote available upon request based on distance and item size.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Return Policy</h4>
                      <p className="text-gray-700">
                        All sales are final. Items are sold as-is, where-is. 
                        Please inspect items carefully during the preview period.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Similar Items */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Similar Items</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {product.similarItems.map((item) => (
              <Card key={item.id} className="lot-card">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-2">{item.title}</h3>
                  <p className="text-2xl font-bold text-brand-red mb-2">
                    ${item.currentBid.toLocaleString()}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {item.timeLeft}
                    </span>
                    <Button size="sm" variant="outline" asChild>
                      <Link to={`/lot/${item.id}`}>View</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernProductDetail;