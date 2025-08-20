export function Hero() {
  return (
    <section className="mx-auto max-w-screen-2xl px-4 py-12 md:py-16">
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
        Bid. Win. Save.
      </h1>
      <p className="mt-4 max-w-2xl text-zinc-600 text-lg">
        Real auctions with proxy bidding, anti-snipe soft-close, and secure checkout.
        Built for power sellers & savvy buyers.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <a href="/auctions" className="rounded-full bg-brand-primary px-5 py-3 text-white font-medium hover:bg-brand-dark transition">
          Browse auctions
        </a>
        <a href="/ending-soon" className="rounded-full border border-line bg-white px-5 py-3 hover:shadow-sm transition">
          Ending soon
        </a>
        <a href="/sell" className="rounded-full border border-line bg-white px-5 py-3 hover:shadow-sm transition">
          Sell now
        </a>
      </div>
    </section>
  );
}