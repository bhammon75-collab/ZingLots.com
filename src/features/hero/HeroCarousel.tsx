// src/features/hero/HeroCarousel.tsx
import React, { useEffect, useRef, useState } from "react";
import HeroSlide, { HeroSlideProps } from "./HeroSlide";

type Props = {
  slides: HeroSlideProps[];
  intervalMs?: number; // default 7000
};

export default function HeroCarousel({ slides, intervalMs = 7000 }: Props) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  const wrapperRef = useRef<HTMLDivElement>(null);

  // pause when offscreen
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setPaused((p) => (entry.isIntersecting ? p : true)),
      { threshold: 0.01 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // auto-advance
  useEffect(() => {
    if (reduceMotion || paused) return;
    const id = setInterval(() => setIdx((v) => (v + 1) % slides.length), intervalMs);
    return () => clearInterval(id);
  }, [reduceMotion, paused, intervalMs, slides.length]);

  return (
    <section
      ref={wrapperRef}
      className="relative"
      aria-label="Featured auctions"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <HeroSlide {...slides[idx]} />

      {/* dots */}
      <div className="absolute bottom-6 right-6 flex items-center gap-3" role="tablist" aria-label="Hero slides">
        {slides.map((_, i) => {
          const selected = i === idx;
          return (
            <button
              key={i}
              role="tab"
              aria-selected={selected}
              aria-label={`Slide ${i + 1}`}
              onClick={() => setIdx(i)}
              className={selected
                ? "h-3.5 w-6 rounded-full bg-white/90"
                : "h-3.5 w-3 rounded-full bg-white/50 hover:bg-white/70"}
            />
          );
        })}
      </div>
    </section>
  );
}