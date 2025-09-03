import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, Keyboard, A11y } from "swiper/modules";
import { Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export type HeroSlide = {
  id: string;
  imageUrl: string;
  alt: string;
  dateText?: string;   // e.g., "Aug 26 | 12 PM EDT"
  title?: string;      // e.g., "Icons & Heroes: Comics & Comic Art"
  subhead?: string;    // e.g., "Landry Pop Auctions"
  ctaText?: string;    // e.g., "Shop Now"
  href?: string;       // destination for image + CTA
};

type Props = {
  slides: HeroSlide[];
  delayMs?: number;    // how long each slide stays
  speedMs?: number;    // animation duration
  className?: string;
  autoplayDefault?: boolean;
  compact?: boolean;   // reduces overall footprint
};

export default function HeroShowcase({
  slides,
  delayMs = 4500,
  speedMs = 650,
  className,
  autoplayDefault = true,
  compact = false,
}: Props) {
  const [playing, setPlaying] = useState(autoplayDefault);
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);
  const [navReady, setNavReady] = useState(false);

  useEffect(() => setNavReady(true), []);

  if (!slides?.length) return null;

  return (
    <section className={`w-full ${className ?? ""} ${compact ? "pb-2" : ""}`}>
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className={`relative hero-swiper ${compact ? "!pb-4" : ""}`}>
          {/* soft circular arrows at edges */}
          <button
            ref={prevRef}
            aria-label="Previous slide"
            className="swiper-button-prev !left-2 md:!left-4 after:!content-[''] absolute z-10"
          />
          <button
            ref={nextRef}
            aria-label="Next slide"
            className="swiper-button-next !right-2 md:!right-4 after:!content-[''] absolute z-10"
          />

          <Swiper
            modules={[Navigation, Pagination, Autoplay, Keyboard, A11y]}
            slidesPerView={1}
            loop={slides.length > 1}
            speed={speedMs}
            keyboard={{ enabled: true }}
            navigation={navReady ? { prevEl: prevRef.current, nextEl: nextRef.current } : undefined}
            pagination={{ clickable: true }}
            autoplay={
              playing
                ? { delay: delayMs, disableOnInteraction: false, pauseOnMouseEnter: true }
                : false
            }
            a11y={{ enabled: true }}
            className={compact ? "!pb-6" : "!pb-10"}
          >
            {slides.map((s) => (
              <SwiperSlide key={s.id}>
                <div className={`mx-auto ${compact ? "max-w-5xl" : "max-w-6xl"}`}>
                  <Link
                    to={s.href ?? "#"}
                    className="block focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-md"
                  >
                    {/* Layout: image left, copy right */}
                    <div className={`grid grid-cols-1 md:grid-cols-12 ${compact ? "gap-6" : "gap-8"} items-center`}>
                      <div className="md:col-span-5">
                        <div className="bg-gray-100 rounded-md shadow-sm overflow-hidden">
                          <div className={`${compact ? "aspect-[3/4] md:aspect-[3/4]" : "aspect-[3/4] md:aspect-[4/5]"}`}>
                            <img
                              src={s.imageUrl}
                              alt={s.alt}
                              loading="lazy"
                              className="h-full w-full object-contain"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="md:col-span-7">
                        {s.dateText && (
                          <div className="text-sm text-gray-600 mb-3">{s.dateText}</div>
                        )}
                        {s.title && (
                          <h2 className={`font-serif font-semibold leading-tight text-gray-900 ${compact ? "text-xl md:text-3xl" : "text-2xl md:text-4xl"}`}>
                            {s.title}
                          </h2>
                        )}
                        {s.subhead && (
                          <p className={`text-gray-700 ${compact ? "mt-1 text-sm" : "mt-2 text-base"}`}>{s.subhead}</p>
                        )}
                        {s.ctaText && (
                          <div className="mt-6">
                            <Button asChild className={`rounded-xl ${compact ? "px-5 py-3 text-sm" : "px-6 py-5 text-base"}`}>
                              <Link to={s.href ?? "#"}>{s.ctaText}</Link>
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Floating pause/play control */}
          <button
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Pause autoplay" : "Resume autoplay"}
            className="absolute bottom-3 right-3 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white shadow ring-1 ring-gray-200"
          >
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </section>
  );
}