import ImageWithFallback from "./ImageWithFallback";
import { Button } from "@/components/ui/button";
import { getUrgency, formatTimeLeft } from "@/lib/urgency";

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
  const urgency: "base" | "warn" | "crit" = a.ends_at ? getUrgency(a.ends_at) : "base";
  const chipClass = urgency === "crit" ? "chip-crit" : urgency === "warn" ? "chip-warn" : "chip-base";

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
          <div className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ${chipClass}`}>
            {a.ends_at ? formatTimeLeft(a.ends_at) : "—"}
          </div>
        </div>

        {/* Meta row */}
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-neutral-700">
          {typeof a.bids === "number" && <span>{a.bids} bids</span>}
          {typeof a.watchers === "number" && (
            <>
              <span className="opacity-70">•</span>
              <span>{a.watchers} watchers</span>
            </>
          )}
          {a.location && (
            <>
              <span className="opacity-70">•</span>
              <span>{a.location}</span>
            </>
          )}
        </div>

        {/* Microcopy */}
        <div className="mt-1 text-xs text-neutral-600">B2B sale</div>

        {/* Seller logistics flags */}
        <div className="mt-2 flex flex-wrap gap-2">
          {a.seller_shipping_offered && (
            <span className="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium chip-base">Shipping offered by seller</span>
          )}
          {a.seller_pickup_preferred && (
            <span className="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium chip-base">Pickup preferred</span>
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