import { Link } from "react-router-dom";

export default function AboutHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-12 md:grid-cols-2 md:py-16 lg:py-20">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">
            A trusted marketplace for business surplus
          </h1>
          <p className="mt-3 max-w-prose text-slate-600">
            Verified sellers, fair auctions, and fast payouts. Buy and sell
            equipment across construction, restaurant, office, warehousing, IT, and more.
            Shipping is arranged between buyer and seller—clear and simple.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/apply"
              className="inline-flex items-center rounded-xl bg-red-600 px-4 py-2 text-white shadow-sm hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
            >
              Start Selling
            </Link>
            <Link
              to="/categories"
              className="inline-flex items-center rounded-xl border border-slate-300 px-4 py-2 text-slate-900 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            >
              Browse Auctions
            </Link>
          </div>

          <dl className="mt-8 grid grid-cols-3 gap-4 text-sm">
            <div>
              <dt className="text-slate-500">Active Auctions</dt>
              <dd className="text-slate-900 font-semibold">600+</dd>
            </div>
            <div>
              <dt className="text-slate-500">Markets</dt>
              <dd className="text-slate-900 font-semibold">15</dd>
            </div>
            <div>
              <dt className="text-slate-500">Businesses</dt>
              <dd className="text-slate-900 font-semibold">10K+</dd>
            </div>
          </dl>
        </div>

        <div className="relative">
          <img
            src="/img/about-hero.svg"
            alt="Illustration of a warehouse, location pin, and trust shield."
            width={720}
            height={360}
            className="h-auto w-full"
            loading="eager"
          />
        </div>
      </div>
    </section>
  );
}

