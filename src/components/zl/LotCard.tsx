import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export type LotCardProps = {
  image: string;
  title: string;
  location?: string;
  currentBid?: string;
  bids?: number;
  endsIn?: string;
};

export default function LotCard({ image, title, location, currentBid, bids, endsIn }: LotCardProps) {
  return (
    <Card className="rounded-[var(--radius-lg)] shadow-sm overflow-hidden">
      <div className="aspect-[4/3] bg-[var(--zl-bg-subtle)]">
        <img src={image} alt={title} loading="lazy" className="h-full w-full object-cover" />
      </div>

      <CardContent className="p-[var(--s-300)]">
        <h3 className="text-lg font-semibold leading-tight line-clamp-2">{title}</h3>

        <div className="mt-2 text-sm text-neutral-600 flex gap-3">
          {location && <span>{location}</span>}
          {bids != null && <span aria-label="bid count">{bids} bids</span>}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div>
            <div className="text-xs text-neutral-500">Current bid</div>
            <div className="text-xl font-bold">{currentBid ?? "–"}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-neutral-500">Ends in</div>
            <div className="font-semibold text-[var(--zl-accent)]">{endsIn ?? "–"}</div>
          </div>
        </div>

        <div className="mt-[var(--s-300)]">
          <Button className="w-full h-10 rounded-[var(--radius-md)] bg-[var(--zl-accent)] hover:bg-[var(--zl-accent-600)]">
            Place bid
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}