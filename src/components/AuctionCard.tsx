import ImageWithFallback from "./ImageWithFallback";
import { Link } from "react-router-dom";

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
  if (d >= 1) return `${d}d ${h}h left`;
  const m = Math.floor((ms % 3_600_000) / 60_000);
  return `${h}h ${m}m left`;
}

export default function AuctionCard({ a }: { a: Auction }) {
  return (
    <Link to={`/auction/${a.id}`} className="block overflow-hidden rounded-xl border hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
      <div className="relative">
        <ImageWithFallback src={a.hero_image_url || undefined} alt={a.title} className="w-full aspect-[4/3] object-cover" loading="lazy" />
      </div>
      <div className="p-4">
        <div className="text-base font-semibold line-clamp-2">{a.title}</div>
        <div className="mt-2 flex items-center gap-4 text-sm text-neutral-700">
          <span>{money(a.current_bid)} current</span>
          <span className="opacity-70">•</span>
          <span>{a.lots_count ?? "—"} lots</span>
          <span className="opacity-70">•</span>
          <span>{timeLeft(a.ends_at)}</span>
        </div>
      </div>
    </Link>
  );
}