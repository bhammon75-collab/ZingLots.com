import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Share2, Eye } from "lucide-react";
import { VerifiedSMEBadge } from "@/components/VerifiedSMEBadge";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useWatchlist } from "@/hooks/useWatchlist";
import { FLAGS } from "@/lib/flags";
import { CountdownPill } from "@/components/auctions/CountdownPill";
import lotImage from "@/assets/lot-generic.jpg";

export interface LotItem {
  id: string;
  title: string;
  category: string;
  currentBid?: number;
  buyNow?: number;
  endsIn: string;
  image_url?: string;
  reserve_met?: boolean;
  watchers?: number;
  volume?: number;
  unit?: string;
  pickup_only?: boolean;
  verified_seller?: boolean;
  seller_verified?: boolean; // Legacy field for backward compatibility
}

const LotCard = ({ item }: { item: LotItem }) => {
  const { watched, loading, toggle } = useWatchlist(item.id);
  const { toast } = useToast();
  const [isSharing, setIsSharing] = useState(false);

  const price = item.currentBid ?? item.buyNow ?? 0;
  const priceLabel = item.currentBid ? `Current: $${(price/100).toFixed(2)}` : `Starting: $${(price/100).toFixed(2)}`;

  const handleWatch = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle();
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSharing(true);

    try {
      const url = `${window.location.origin}/product/${item.id}`;
      const shareData = {
        title: item.title,
        text: `Check out this ${item.category.toLowerCase()} on ZingLots`,
        url,
      };

      // @ts-expect-error - navigator.share is not available in all browsers
      if (navigator.share) {
        // @ts-expect-error - navigator.share is experimental API
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(url);
        toast({
          title: "Link copied!",
          description: "Product link copied to clipboard",
        });
      }
    } catch (error) {
      console.error("Share failed:", error);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <article className="group rounded-xl border border-line bg-white shadow-card hover:shadow-cardHover transition overflow-hidden">
      <div className="relative aspect-[4/3] bg-zinc-100">
        <img 
          src={item.image_url || lotImage} 
          alt={item.title}
          className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
        />
        
        {/* Reserve status and countdown */}
        <div className="absolute left-3 top-3 flex gap-2">
          <Badge variant={item.reserve_met ? 'default' : 'outline'}>
            {item.reserve_met ? 'Reserve met ✅' : 'Reserve not met'}
          </Badge>
          {item.pickup_only && (
            <Badge variant="secondary">Pickup only</Badge>
          )}
        </div>
        <div className="absolute right-3 bottom-3">
          <CountdownPill endsAt={item.endsIn} />
        </div>
        
        {/* Action buttons */}
        <div className="absolute right-3 top-3 flex gap-2">
          {FLAGS.ENABLE_WATCHLIST && (
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 bg-background/80 backdrop-blur"
              onClick={handleWatch}
              disabled={loading}
              aria-label={watched ? "Remove from watchlist" : "Add to watchlist"}
            >
              <Heart className={`h-4 w-4 ${watched ? "fill-current text-red-500" : ""}`} />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 bg-background/80 backdrop-blur"
            onClick={handleShare}
            disabled={isSharing}
            aria-label="Share"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-2">
        <h3 className="font-semibold leading-snug line-clamp-2">{item.title}</h3>
        {(item.seller_verified || item.verified_seller) && <VerifiedSMEBadge />}
        <div className="flex items-center justify-between">
          <div className="text-sm text-zinc-600">{priceLabel}</div>
          <div className="flex items-center gap-1 text-xs text-zinc-500">
            <Eye className="h-4 w-4" />
            <span>{item.watchers ?? 0} watching</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          {item.volume && item.unit && (
            <span>{item.volume.toLocaleString()} {item.unit}</span>
          )}
          {item.verified_seller && (
            <Badge variant="outline">Verified</Badge>
          )}
        </div>
        
        {/* Buy Now button - less prominent */}
        {item.buyNow && (
          <Button variant="outline" size="sm" className="w-full text-xs">
            Buy Now ${(item.buyNow/100).toFixed(2)}
          </Button>
        )}
      </div>
    </article>
  );
};

export default LotCard;