import { Clock, Eye, Package, Star, TrendingUp, MapPin } from "lucide-react";

export type AuctionData = {
  id: string;
  title: string;
  hero_image_url: string;
  current_bid: number;
  lots_count: number;
  ends_at: string;
  category?: string;
  condition?: string;
  seller_name?: string;
  seller_rating?: number;
  view_count?: number;
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function getTimeRemaining(endDate: string): { label: string; urgent: boolean } {
  const now = Date.now();
  const end = new Date(endDate).getTime();
  const diff = end - now;
  
  if (diff <= 0) return { label: "Ended", urgent: false };
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) {
    return { label: `${days}d ${hours}h`, urgent: days <= 1 };
  }
  if (hours > 0) {
    return { label: `${hours}h ${minutes}m`, urgent: true };
  }
  return { label: `${minutes}m`, urgent: true };
}

function getConditionColor(condition?: string): string {
  switch (condition?.toLowerCase()) {
    case 'new': return 'bg-green-100 text-green-800';
    case 'like new': return 'bg-blue-100 text-blue-800';
    case 'good': return 'bg-gray-100 text-gray-800';
    case 'fair': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

export default function ProfessionalAuctionCard({ auction, distanceMiles }: { auction: AuctionData; distanceMiles?: number }) {
  const timeRemaining = getTimeRemaining(auction.ends_at);
  
  return (
    <a 
      href={`/auction/${auction.id}`}
      className="group block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all duration-200"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
        <img 
          src={auction.hero_image_url || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop&auto=format"} 
          alt={auction.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        
        {/* Time Badge */}
        <div className={`absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm ${
          timeRemaining.urgent 
            ? 'bg-red-500/90 text-white' 
            : 'bg-white/90 text-gray-800'
        }`}>
          <Clock className="inline-block w-3 h-3 mr-1" />
          {timeRemaining.label}
        </div>
        
        {/* Category Badge */}
        {auction.category && (
          <div className="absolute top-3 left-3 px-3 py-1.5 bg-black/70 text-white rounded-full text-xs font-medium backdrop-blur-sm">
            {auction.category}
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
          {auction.title}
        </h3>
        
        {/* Condition Badge */}
        {auction.condition && (
          <div className="mb-3">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getConditionColor(auction.condition)}`}>
              {auction.condition}
            </span>
          </div>
        )}
        
        {/* Price Section */}
        <div className="flex items-baseline justify-between mb-3">
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(auction.current_bid)}
            </div>
            <div className="text-xs text-gray-500 mt-0.5">Current bid</div>
          </div>
          <div className="text-right">
            <div className="flex items-center text-sm text-gray-600">
              <Package className="w-3.5 h-3.5 mr-1" />
              {auction.lots_count} {auction.lots_count === 1 ? 'lot' : 'lots'}
            </div>
          </div>
        </div>

        {/* Distance (if available) */}
        {typeof distanceMiles === 'number' && (
          <div className="flex items-center text-xs text-gray-600 mb-2">
            <MapPin className="w-3 h-3 mr-1" />
            ≈ {Math.round(distanceMiles)} mi away
          </div>
        )}
        
        {/* Seller Info */}
        {auction.seller_name && (
          <div className="pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm">
              <div className="text-gray-600">
                {auction.seller_name}
              </div>
              {auction.seller_rating && (
                <div className="flex items-center text-yellow-500">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="ml-1 text-gray-600">{auction.seller_rating.toFixed(1)}</span>
                </div>
              )}
            </div>
            
            {/* View Count */}
            {auction.view_count && (
              <div className="flex items-center mt-2 text-xs text-gray-500">
                <Eye className="w-3 h-3 mr-1" />
                {auction.view_count} views
                {auction.view_count > 100 && (
                  <TrendingUp className="w-3 h-3 ml-2 text-green-500" />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </a>
  );
}