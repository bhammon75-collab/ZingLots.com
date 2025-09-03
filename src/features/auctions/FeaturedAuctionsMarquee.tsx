// src/features/auctions/FeaturedAuctionsMarquee.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

export type AuctionPromo = {
  id: string;
  title: string;
  imageUrl: string;
  closesAt: string;  // ISO
  location: string;  // "City, ST"
  href: string;
};

type Props = {
  items: AuctionPromo[];
  speedPxPerSec?: number; // default 40
  cardWidth?: number;     // default 320
  gapPx?: number;         // default 16
};

export default function FeaturedAuctionsMarquee({
  items,
  speedPxPerSec = 40,
  cardWidth = 320,
  gapPx = 16,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  const doubled = useMemo(() => [...items, ...items], [items]); // seamless loop

  useEffect(() => {
    if (reduceMotion) return;
    const track = trackRef.current;
    if (!track) return;

    let x = 0;
    let last = performance.now();
    let raf = 0;
    const cycleWidth = items.length * (cardWidth + gapPx);

    const step = (ts: number) => {
      const dt = (ts - last) / 1000;
      last = ts;
      if (!paused) {
        x -= speedPxPerSec * dt;
        if (-x >= cycleWidth) x += cycleWidth; // wrap at one cycle
        track.style.transform = `translateX(${x}px)`;
      }
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [paused, reduceMotion, items.length, cardWidth, gapPx, speedPxPerSec]);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) =>
      setPaused((p) => (entry.isIntersecting ? p : true)),
    { threshold: 0.01 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      aria-label="Featured auctions"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent" />

      <ul
        ref={trackRef}
        className="flex items-stretch will-change-transform"
        style={{ gap: `${gapPx}px` }}
        role="list"
        aria-live="polite"
      >
        {doubled.map((a, i) => (
          <li key={`${a.id}-${i}`} role="listitem" aria-hidden={i >= items.length}>
            <AuctionCard
              a={a}
              width={cardWidth}
              ariaHidden={i >= items.length}
            />
          </li>
        ))}
      </ul>

      <div className="absolute right-3 top-3 hidden gap-2 md:flex">
        <button className="rounded-full border border-zinc-300 bg-white px-3 py-1 text-sm font-medium shadow-sm"
                onClick={() => setPaused((v) => !v)}>
          {paused ? "Play" : "Pause"}
        </button>
      </div>
    </div>
  );
}

function AuctionCard({
  a, width, ariaHidden,
}: { a: AuctionPromo; width: number; ariaHidden?: boolean }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { 
    const id = setInterval(() => setNow(Date.now()), 1000); 
    return () => clearInterval(id); 
  }, []);
  const remaining = Math.max(0, new Date(a.closesAt).getTime() - now);
  const { label, urgent } = formatRemaining(remaining);

  return (
    <Link
      aria-hidden={ariaHidden}
      tabIndex={ariaHidden ? -1 : 0}
      to={a.href}
      className="group relative block shrink-0 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#E02020]/50"
      style={{ width }}
    >
      <div className="relative h-44 w-full overflow-hidden">
        <img
          src={a.imageUrl}
          alt=""
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          loading="lazy"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/55 to-transparent" />
        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold text-white ${urgent ? "bg-[#E02020]" : "bg-black/70"}`}
        >
          {label}
        </span>
      </div>
      <div className="space-y-1 p-3">
        <h3 className="line-clamp-2 text-base font-bold text-zinc-900">{a.title}</h3>
        <p className="text-sm text-zinc-600">{a.location}</p>
      </div>
    </Link>
  );
}

function formatRemaining(ms: number) {
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const urgent = s <= 3600;
  let label = s <= 0 ? "Closing" : d > 0 ? `${d}d ${h}h left` : `${h}h ${m}m left`;
  if (s < 60 && s > 0) label = `${s}s left`;
  return { label, urgent };
}