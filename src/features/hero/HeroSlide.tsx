import React from "react";

export type HeroSlideProps = {
  title: string;
  subtitle?: string;
  timeLabel: string;      // e.g., "3 Days Left" / "Ending Tomorrow" / "Ends in 2h 15m"
  currentBid: string;     // e.g., "$34,200"
  lotsLabel: string;      // e.g., "28 Lots"
  auctionId: string;      // e.g., "#A2024-1840"
  image: {
    src: string;
    width: number;
    height: number;
    objectPosition?: string; // e.g., "60% 40%"
  };
  primaryHref: string;
  onHowToBid?: () => void;
};

export default function HeroSlide({
  title,
  subtitle,
  timeLabel,
  currentBid,
  lotsLabel,
  auctionId,
  image,
  primaryHref,
  onHowToBid,
}: HeroSlideProps) {
  const onHeroError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.dataset.fallback === "1") return; // prevent loop
    img.dataset.fallback = "1";
    img.src = "/images/hero-fallback.jpg";    // TODO: add a neutral fallback image to /public/images/
  };

  return (
    <div className="relative">
      {/* Decorative hero image (no SR noise, no stray alt text) */}
      <img
        src={image.src}
        alt=""
        width={image.width}
        height={image.height}
        fetchpriority="high"
        decoding="async"
        className="block h-[56vh] w-full object-cover"
        style={image.objectPosition ? { objectPosition: image.objectPosition } : undefined}
        onError={onHeroError}
      />

      {/* Overlay for readability on light/dark photos */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/8 via-black/10 to-black/70 [backdrop-filter:blur(0.5px)]" />

      <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-4 sm:px-6 pb-10">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-[0.95]
                       drop-shadow-[0_1px_3px_rgba(0,0,0,.25)] md:drop-shadow-[0_2px_6px_rgba(0,0,0,.35)]">
          {title}
        </h1>

        {/* Chips — only TIME is red (urgency). Bid chip stays neutral. */}
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-white/90">
          <span className="rounded-full bg-[#DC2626] px-3 py-1 text-sm font-semibold">
            {timeLabel}
          </span>
          <span className="rounded bg-white/15 backdrop-blur px-2.5 py-1 text-sm font-semibold">
            Current Bid: {currentBid}
          </span>
          <span className="text-sm/6 opacity-90">• {lotsLabel}</span>
          <span className="text-sm/6 opacity-70">• {auctionId}</span>
        </div>

        {subtitle && (
          <p className="mt-4 max-w-3xl text-white/90 line-clamp-2 md:line-clamp-3">
            {subtitle}
          </p>
        )}

        {/* CTAs — consistent across slides */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a
            href={primaryHref}
            className="inline-flex items-center gap-2 rounded-2xl bg-[#DC2626] px-5 py-3 font-semibold text-white shadow-sm hover:brightness-95"
          >
            View Auction
          </a>
          <button
            onClick={onHowToBid}
            className="inline-flex items-center rounded-2xl border border-white/25 bg-white/10 px-5 py-3 font-semibold text-white/95 backdrop-blur hover:bg-white/15"
          >
            How to Bid
          </button>
        </div>
      </div>
    </div>
  );
}