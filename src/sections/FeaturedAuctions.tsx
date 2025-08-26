import AuctionCard, { type Auction } from "@/components/AuctionCard";

export default function FeaturedAuctions({ items = [] as Auction[] }){
  if (!items.length) return null;
  return (
    <section className="py-10 bg-white">
      <div className="mx-auto max-w-7xl px-4">
        <header className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Featured Auctions</h2>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((a) => (
            <div key={a.id} className="relative">
              <div className="absolute left-3 top-3 z-10 inline-flex rounded-md bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-900">Featured</div>
              <div className="relative rounded-xl ring-1 ring-slate-200/70 overflow-hidden">
                <AuctionCard a={a} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}