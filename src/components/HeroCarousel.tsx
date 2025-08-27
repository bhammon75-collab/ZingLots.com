import { useEffect, useMemo, useRef, useState } from "react";

type Slide = {
  img: string;
  title: string;
  sub?: string;
  cta?: { label: string; href: string };
  // Optional: ariaLabel overrides for screen readers (else title used)
  ariaLabel?: string;
};

export const defaultSlides: Slide[] = [
  {
    img: "/products/tools.jpg",
    title: "Buy commercial equipment, hassle-free.",
    sub: "Business-to-business auctions from verified sellers.",
    cta: { label: "Browse Active Auctions", href: "#active-auctions" },
  },
  {
    img: "/products/cleaning-equipment.jpg",
    title: "Turn idle equipment into cash.",
    sub: "List free to verified business buyers in minutes.",
    cta: { label: "Start an Auction", href: "/sell" },
  },
  {
    img: "/products/furniture.jpg",
    title: "Built for business budgets.",
    sub: "Transparent fees, verified auctioneers, tax-ready receipts.",
    cta: { label: "See All Categories", href: "/categories" },
  },
  {
    img: "/products/tools.jpg",
    title: "Find it fast.",
    sub: "Sort by Ending Soon and filter by category, location, or seller shipping preferences.",
    cta: { label: "Browse Active Auctions", href: "#active-auctions" },
  },
  {
    img: "/products/cleaning-equipment.jpg",
    title: "Auctions near you, updated daily.",
    sub: "New business equipment added every day across major cities and regions.",
    cta: { label: "See All Regions", href: "/regions" },
  },
];

export default function HeroCarousel({
  slides = defaultSlides,
  intervalMs = 7000,
  className = "",
}: {
  slides?: Slide[];
  intervalMs?: number;
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<number | null>(null);

  const reducedMotion = usePrefersReducedMotion();
  const canRotate = !reducedMotion && !paused && slides.length > 1;

  // Clamp index if slides change
  const safeIndex = useMemo(
    () => (slides.length ? Math.max(0, Math.min(index, slides.length - 1)) : 0),
    [index, slides.length]
  );

  // Auto-rotate
  useEffect(() => {
    if (!canRotate) return;
    timerRef.current = window.setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      Math.max(2500, intervalMs)
    );
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [canRotate, slides.length, intervalMs]);

  // Pause when tab is hidden (prevents runaway timers)
  useEffect(() => {
    const onVis = () => setPaused((p) => document.hidden || p);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const goTo = (n: number) => setIndex(((n % slides.length) + slides.length) % slides.length);
  const prev = () => goTo(safeIndex - 1);
  const next = () => goTo(safeIndex + 1);

  if (!slides.length) return null;

  return (
    <section
      className={`group relative overflow-hidden rounded-2xl bg-slate-100 h-[220px] md:h-[340px] ${className}`}
      aria-roledescription="carousel"
      aria-label="Promoted auctions and features"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* Slides */}
      {slides.map((s, i) => {
        const active = i === safeIndex;
        return (
          <a
            key={i}
            href={s.cta?.href ?? "#"}
            aria-label={s.ariaLabel ?? s.title}
            className={`absolute inset-0 transition-opacity duration-700 ease-out ${
              active ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            tabIndex={active ? 0 : -1}
          >
            <img
              src={s.img}
              alt=""
              // Eager-load first slide only; others lazy
              loading={i === 0 ? "eager" : "lazy"}
              className="w-full h-full object-cover"
            />
            {/* Fade for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
            {/* Text/CTA */}
            <div className="absolute left-4 right-4 md:left-6 md:right-auto bottom-4 md:bottom-6 text-white">
              <h1 className="text-2xl md:text-3xl font-bold max-w-2xl">{s.title}</h1>
              {s.sub && <p className="mt-1 text-sm md:text-base max-w-2xl">{s.sub}</p>}
              {s.cta && (
                <span className="mt-3 inline-flex h-10 px-4 items-center rounded-xl bg-red-600 text-white font-semibold">
                  {s.cta.label}
                </span>
              )}
            </div>
          </a>
        );
      })}

      {/* Prev/Next arrows — hidden until hover/focus on desktop */}
      <button
        aria-label="Previous slide"
        onClick={prev}
        className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 items-center justify-center h-9 w-9 rounded-full bg-black/40 text-white
                   opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-white/70"
      >
        ‹
      </button>
      <button
        aria-label="Next slide"
        onClick={next}
        className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 items-center justify-center h-9 w-9 rounded-full bg-black/40 text-white
                   opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-white/70"
      >
        ›
      </button>

      {/* Dots — visible on desktop, subtle on mobile */}
      <div className="absolute bottom-2 right-3 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => goTo(i)}
            className={`h-2.5 w-2.5 rounded-full transition-opacity ${
              i === safeIndex ? "bg-white" : "bg-white/60 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

// --- hook: prefers-reduced-motion
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);
  return reduced;
}