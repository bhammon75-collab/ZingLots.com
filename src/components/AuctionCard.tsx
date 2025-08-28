import ImageWithFallback from "./ImageWithFallback";
import { Clock, Package } from "lucide-react";

export type Auction = {
  id: string;
  title: string;
  hero_image_url?: string | null;
  current_bid?: number | null;
  lots_count?: number | null;
  ends_at?: string | null;
};

function money(n?: number | null) {
  if (n == null) return "—";
  return n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function timeLeft(iso?: string | null) {
  if (!iso) return "—";
  const end = new Date(iso).getTime(), ms = end - Date.now();
  if (ms <= 0) return "Ended";
  const d = Math.floor(ms / 86_400_000);
  const h = Math.floor((ms % 86_400_000) / 3_600_000);
  if (d >= 1) return `${d}d ${h}h`;
  const m = Math.floor((ms % 3_600_000) / 60_000);
  return `${h}h ${m}m`;
}

function getTimeUrgencyClass(iso?: string | null) {
  if (!iso) return "bg-gray-100 text-gray-700 border-gray-200";
  const ms = new Date(iso).getTime() - Date.now();
  if (ms <= 0) return "bg-gray-100 text-gray-700 border-gray-200";
  if (ms <= 3_600_000) return "bg-red-100 text-red-900 border-red-300"; // < 1 hour
  if (ms <= 86_400_000) return "bg-amber-100 text-amber-900 border-amber-300"; // < 24 hours
  return "bg-gray-100 text-gray-700 border-gray-200"; // > 24 hours
}

export default function AuctionCard({ a }: { a: Auction }) {
  const timeClass = getTimeUrgencyClass(a.ends_at);
  const isUrgent = a.ends_at && (new Date(a.ends_at).getTime() - Date.now()) <= 3_600_000;
  
  return (
    <a 
      href={`/auction/${a.id}`} 
      className="block overflow-hidden rounded-xl bg-white border border-gray-200 hover:shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <ImageWithFallback 
          src={a.hero_image_url || undefined} 
          alt={a.title} 
          className="w-full h-full object-cover" 
          loading="lazy" 
        />
      </div>
      <div className="p-4">
        {/* Time remaining badge - prominent at top */}
        <div className="flex items-center justify-between mb-3">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${timeClass}`}>
            <Clock className="h-3.5 w-3.5" />
            {timeLeft(a.ends_at)}
          </div>
          {a.lots_count && (
            <div className="inline-flex items-center gap-1 text-xs text-gray-500">
              <Package className="h-3.5 w-3.5" />
              {a.lots_count} lots
            </div>
          )}
        </div>
        
        {/* Title - secondary prominence */}
        <h3 className="font-medium text-sm text-gray-700 mb-3 line-clamp-2 min-h-[2.5rem]">
          {a.title}
        </h3>
        
        {/* Price - primary prominence */}
        <div className="text-2xl font-bold text-gray-900">
          {money(a.current_bid)}
        </div>
        <div className="text-xs text-gray-500 mt-0.5">Current bid</div>
        
        {/* CTA button */}
        <button 
          className={`w-full mt-4 px-4 py-2 rounded-lg font-semibold transition-all ${
            isUrgent 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          View Auction
        </button>
      </div>
    </a>
  );
}