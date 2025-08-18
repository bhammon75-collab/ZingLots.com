export function AuctionHeader({ title = "Auctions near you" }: { title?: string }) {
  return (
    <div className="sticky top-0 z-30 bg-[var(--zl-bg)]/80 backdrop-blur border-b">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-3">
        <h1 className="text-xl font-semibold">{title}</h1>
        <div className="ml-auto flex gap-2">
          <input className="h-9 w-56 rounded-[var(--radius-sm)] border px-3" placeholder="Search lots…" aria-label="Search lots" />
          <select className="h-9 rounded-[var(--radius-sm)] border px-2" aria-label="Sort">
            <option>Ending soon</option>
            <option>Newly listed</option>
            <option>Lowest bid</option>
          </select>
        </div>
      </div>
    </div>
  );
}