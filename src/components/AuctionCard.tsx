import ImageWithFallback from "./ImageWithFallback";
import { Button } from "@/components/ui/button";
import { useTimeLeft } from "@/lib/useTimeLeft";
import { Gavel, Eye, MapPin, Clock } from "lucide-react";

export type Auction = {
  id: string;
  title: string;
  hero_image_url?: string | null;
  current_bid?: number | null;
  lots_count?: number | null;
  ends_at?: string | null;
  location?: string | null;
  watchers?: number | null;
  bids?: number | null;
  seller_shipping_offered?: boolean | null;
  seller_pickup_preferred?: boolean | null;
};

function money(n?: number | null) {
  if (n == null) return "—";
  return n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export default function AuctionCard({ a }: { a: Auction }) {
  const { label: timeLeft, urgency } = a.ends_at ? useTimeLeft(a.ends_at) : { label: "—", urgency: "base" as const };
  const chipClass = urgency === "crit" ? "chip chip-crit" : urgency === "warn" ? "chip chip-warn" : "chip chip-base";

  return (
    <a href={`/auction/${a.id}`} className="block overflow-hidden rounded-xl border hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
      <div className="relative">
        <ImageWithFallback src={a.hero_image_url || undefined} alt={a.title} className="w-full aspect-[4/3] object-cover" loading="lazy" />
      </div>
      <div className="p-4">
        <div className="text-base font-semibold line-clamp-2">{a.title}</div>

        {/* Price dominant + urgency */}
        <div className="mt-2 flex items-center justify-between">
          <div className="text-2xl font-semibold">{money(a.current_bid)}</div>
          <div className={chipClass}><Clock className="h-3.5 w-3.5 mr-1" />{timeLeft}</div>
        </div>

        {/* Meta row */}
        <div className="mt-2 flex items-center gap-3 text-sm text-slate-600">
          {typeof a.bids === "number" && (
            <span className="inline-flex items-center gap-1"><Gavel className="h-4 w-4" />{a.bids} bids</span>
          )}
          {typeof a.watchers === "number" && (
            <span className="inline-flex items-center gap-1"><Eye className="h-4 w-4" />{a.watchers} watching</span>
          )}
          {a.location && (
            <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" />{a.location}</span>
          )}
        </div>

        {/* Microcopy */}
        <div className="mt-1 text-xs text-neutral-600">B2B sale</div>

        {/* Seller logistics flags */}
        <div className="mt-2 flex flex-wrap gap-2">
          {a.seller_shipping_offered && (
            <span className="chip chip-base">Shipping offered by seller</span>
          )}
          {a.seller_pickup_preferred && (
            <span className="chip chip-base">Pickup preferred</span>
          )}
        </div>

        {/* Primary CTA */}
        <div className="mt-3">
          <Button className="w-full h-10 rounded-xl">Place Bid</Button>
        </div>
      </div>
    </a>
  );
}