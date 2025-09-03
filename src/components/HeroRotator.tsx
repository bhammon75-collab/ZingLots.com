import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import ImageWithFallback from "./ImageWithFallback";

// Lightweight local swipe handler to avoid external dependency
function useSwipeableShim(opts: { onSwipedLeft?: () => void; onSwipedRight?: () => void; trackTouch?: boolean }) {
  const startXRef = useRef<number | null>(null);
  const startYRef = useRef<number | null>(null);
  const threshold = 30; // pixels

  const onTouchStart = (e: React.TouchEvent) => {
    if (!opts.trackTouch) return;
    const t = e.touches?.[0];
    if (!t) return;
    startXRef.current = t.clientX;
    startYRef.current = t.clientY;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!opts.trackTouch) return;
    if (startXRef.current === null || startYRef.current === null) return;
    const t = e.changedTouches?.[0];
    if (!t) return;
    const dx = t.clientX - startXRef.current;
    const dy = t.clientY - startYRef.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > threshold) {
      if (dx < 0) opts.onSwipedLeft?.(); else opts.onSwipedRight?.();
    }
    startXRef.current = null;
    startYRef.current = null;
  };

  return { onTouchStart, onTouchEnd } as const;
}

export type HeroSlide = {
  id: string;
  href?: string;
  title?: string;
  sub?: string;
  badge?: string;
  image: string;
  imageMobile?: string;
};

type Props = {
  slides: HeroSlide[];
  autoplayMs?: number;   // default 3600
  transitionMs?: number; // default 600
  className?: string;
  autoplayWhen?: "never" | "visible" | "always";
  respectReducedMotion?: boolean;
};

function resolveSlides(input: HeroSlide[]): HeroSlide[] {
  const cleaned = (input || [])
    .filter(Boolean)
    .map((s, i) => ({
      ...s,
      id: s.id ?? `slide-${i}`,
      image: s.image || "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&h=1080&fit=crop&auto=format",
      imageMobile: s.imageMobile || undefined,
      title: s.title ?? "",
      sub: s.sub ?? "",
    }));

  if (cleaned.length >= 2) return cleaned;

  if (cleaned.length === 1) {
    const one = cleaned[0];
    return [
      one,
      { ...one, id: `${one.id}-dup`, href: one.href || "#", title: one.title || "" },
    ];
  }

  // cleaned.length === 0 → return two placeholders
  return [
    {
      id: "ph-1",
      href: "/auctions",
      title: "Surplus & Liquidation Auctions",
      sub: "Heavy equipment, tools, office, and more",
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1920&h=1080&fit=crop&auto=format",
      imageMobile: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=640&h=480&fit=crop&auto=format",
    },
    {
      id: "ph-2",
      href: "/regions",
      title: "Browse by Region",
      sub: "Find auctions near you",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&h=1080&fit=crop&auto=format",
      imageMobile: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=640&h=480&fit=crop&auto=format",
    },
  ];
}

export default function HeroRotator(props: Props){
  const {
    slides,
    autoplayMs = 3600,
    transitionMs = 600,
    className = "",
    autoplayWhen = "visible",
    respectReducedMotion = true,
  } = props;

  const resolvedSlides = useMemo(() => resolveSlides(slides || []), [slides]);

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<number | null>(null);
  const visibleRef = useRef(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // Debug once: input vs resolved counts
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log("home slides in:", slides.length, "resolved:", resolvedSlides.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Preload next image for snappy fade
  useEffect(()=>{
    if(resolvedSlides.length < 2) return;
    const next = resolvedSlides[(index + 1) % resolvedSlides.length];
    const a = new Image(); a.src = next.image;
    if(next.imageMobile){ const b = new Image(); b.src = next.imageMobile; }
  },[index, resolvedSlides]);

  function clearTimer(){
    if(timerRef.current){ window.clearInterval(timerRef.current); timerRef.current = null; }
  }

  function canAutoplayNow(){
    if (resolvedSlides.length <= 1) return false;
    if (paused) return false;
    if (respectReducedMotion && prefersReducedMotion) return false;
    if (autoplayWhen === "never") return false;
    if (autoplayWhen === "always") return true;
    return visibleRef.current; // "visible"
  }

  function restart(){
    clearTimer();
    if (!canAutoplayNow()) return;
    timerRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % resolvedSlides.length);
    }, autoplayMs) as unknown as number;
  }

  // Observe visibility
  useEffect(()=>{
    const el = containerRef.current;
    if(!el) return;
    const io = new IntersectionObserver(
      ([e]) => { visibleRef.current = !!e?.isIntersecting; restart(); },
      { threshold: 0.05, rootMargin: "0px 0px -20% 0px" }
    );
    io.observe(el);
    return ()=> io.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  useEffect(()=>{
    const onVis = ()=> restart();
    document.addEventListener("visibilitychange", onVis);
    return ()=> document.removeEventListener("visibilitychange", onVis);
  },[]);

  // Reset index if slides shrink
  useEffect(() => {
    if (index >= resolvedSlides.length) setIndex(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedSlides.length]);

  useEffect(()=>{ restart(); return clearTimer; },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [autoplayMs, paused, prefersReducedMotion, respectReducedMotion, props.autoplayWhen, resolvedSlides.length]);

  const go = (dir:1|-1)=> setIndex(i => (i + dir + resolvedSlides.length) % resolvedSlides.length);
  const handlers = useSwipeableShim({ onSwipedLeft: ()=>go(1), onSwipedRight: ()=>go(-1), trackTouch:true });

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured auctions"
      className={`relative overflow-hidden rounded-xl ${className}`}
      onMouseEnter={()=> setPaused(true)} onMouseLeave={()=> setPaused(false)}
      {...handlers}
      ref={containerRef}
      tabIndex={0}
      onKeyDown={(e)=>{ if(e.key==="ArrowRight") go(1); if(e.key==="ArrowLeft") go(-1); }}
    >
      <div className="relative h-[46vh] md:h-[58vh]">
        {resolvedSlides.map((s,i)=>{
          const active = i===index;
          return (
            <Link
              key={s.id}
              to={s.href || "#"}
              className="absolute inset-0"
              aria-hidden={!active}
              tabIndex={active ? 0 : -1}
              style={{
                opacity: active ? 1 : 0,
                pointerEvents: active ? "auto" : "none",
                transition: `opacity ${transitionMs}ms ease-in-out`,
                zIndex: active ? 10 : 0
              }}
            >
              <picture>
                {s.imageMobile && (<source media="(max-width: 640px)" srcSet={s.imageMobile} />)}
                <ImageWithFallback src={s.image} alt={s.title || ""} className="h-full w-full object-cover" />
              </picture>

              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/25 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 md:top-1/2 md:-translate-y-1/2">
                <div className="px-4 md:px-8 max-w-5xl">
                  {s.badge && (<span className="inline-flex items-center rounded-full bg-red-600 text-white px-3 py-1 text-sm">{s.badge}</span>)}
                  {s.title && (<h1 className="mt-3 text-2xl md:text-5xl font-extrabold text-white drop-shadow">{s.title}</h1>)}
                  {s.sub && (<p className="mt-2 md:mt-3 text-white/90 max-w-2xl">{s.sub}</p>)}
                  <div className="mt-4 flex flex-wrap gap-3">
                    <span className="inline-flex items-center rounded-lg bg-red-600 text-white px-4 py-2.5 font-semibold">View Auction</span>
                    <Link to="/help" className="inline-flex items-center rounded-lg border border-white/70 text-white px-4 py-2.5 font-semibold">How to Bid</Link>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Dots */}
      <div className="pointer-events-none absolute bottom-3 left-0 right-0 flex justify-center gap-2">
        {resolvedSlides.map((s,i)=>(
          <button
            key={s.id}
            aria-label={`Go to slide ${i+1}`}
            className="pointer-events-auto h-2.5 w-2.5 rounded-full ring-1 ring-white/70"
            style={{ backgroundColor: i===index ? "white" : "rgba(255,255,255,.4)" }}
            onClick={()=> setIndex(i)}
          />
        ))}
      </div>

      {/* Prev/Next */}
      <button aria-label="Previous" className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/30 text-white px-3 py-2"
              onClick={()=>go(-1)}>&lsaquo;</button>
      <button aria-label="Next" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/30 text-white px-3 py-2"
              onClick={()=>go(1)}>&rsaquo;</button>
    </section>
  );
}