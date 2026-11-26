"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { EventCard } from "@/components/events/EventCard";
import { OrnamentalDivider } from "@/components/invitation/OrnamentalDivider";
import { easings } from "@/lib/animations";
import {
  CELEBRATIONS_COPY,
  WEDDING_EVENTS,
  type WeddingEventId,
} from "@/lib/constants/events";
import { cn } from "@/lib/utils/cn";

type CelebrationsProps = {
  reducedMotion?: boolean;
};

/** Desktop asymmetric placement for editorial rhythm */
const desktopPlacement: Record<WeddingEventId, string> = {
  mehendi: "md:col-span-5 md:translate-y-4",
  haldi: "md:col-span-7 md:pt-16",
  sangeet: "md:col-span-7 md:-translate-y-6",
  ceremony: "md:col-span-5 md:pt-10",
  reception: "md:col-span-8 md:col-start-3 md:pt-6",
};

export function Celebrations({ reducedMotion = false }: CelebrationsProps) {
  const [expandedId, setExpandedId] = useState<WeddingEventId | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const handleToggle = useCallback((id: WeddingEventId) => {
    setExpandedId((current) => (current === id ? null : id));
  }, []);

  const updateActiveFromScroll = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const slides = Array.from(
      scroller.querySelectorAll<HTMLElement>("[data-event-slide]"),
    );
    if (slides.length === 0) return;

    const scrollerCenter = scroller.scrollLeft + scroller.clientWidth / 2;
    let nearest = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;

    slides.forEach((slide, index) => {
      const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
      const distance = Math.abs(slideCenter - scrollerCenter);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearest = index;
      }
    });

    setActiveIndex(nearest);
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    updateActiveFromScroll();
    scroller.addEventListener("scroll", updateActiveFromScroll, {
      passive: true,
    });

    return () => {
      scroller.removeEventListener("scroll", updateActiveFromScroll);
    };
  }, [updateActiveFromScroll]);

  const goToSlide = useCallback(
    (index: number) => {
      const scroller = scrollerRef.current;
      if (!scroller) return;

      const slide = scroller.querySelectorAll<HTMLElement>("[data-event-slide]")[
        index
      ];
      if (!slide) return;

      slide.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        inline: "center",
        block: "nearest",
      });
      setActiveIndex(index);
    },
    [reducedMotion],
  );

  const total = WEDDING_EVENTS.length;

  return (
    <section
      id="events"
      className="relative overflow-x-hidden bg-burgundy px-5 py-24 sm:px-8 sm:py-32 lg:px-10 lg:py-40"
      aria-label="Wedding celebrations"
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 10% 20%, color-mix(in srgb, var(--wine) 55%, transparent), transparent 70%)",
        }}
      />

      <div className="relative mx-auto mb-10 max-w-3xl text-center sm:mb-16 lg:mb-20">
        <motion.p
          className="text-[0.65rem] font-medium uppercase tracking-[0.34em] text-champagne sm:text-xs"
          initial={reducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: reducedMotion ? 0 : 0.8,
            ease: easings.cinematicOut,
          }}
        >
          {CELEBRATIONS_COPY.eyebrow}
        </motion.p>

        <motion.h2
          className="mt-5 font-heading text-balance text-4xl font-medium tracking-wide text-ivory sm:text-5xl md:text-6xl"
          initial={reducedMotion ? false : { opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: reducedMotion ? 0 : 0.95,
            delay: reducedMotion ? 0 : 0.08,
            ease: easings.cinematicOut,
          }}
        >
          {CELEBRATIONS_COPY.title}
        </motion.h2>

        <OrnamentalDivider className="mx-auto mt-7 text-champagne" />

        <motion.p
          className="mt-6 font-heading text-lg font-light text-ivory/70 sm:text-xl"
          initial={reducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: reducedMotion ? 0 : 0.85,
            delay: reducedMotion ? 0 : 0.14,
            ease: easings.cinematicOut,
          }}
        >
          {CELEBRATIONS_COPY.subtitle}
        </motion.p>
      </div>

      {/* Desktop asymmetric editorial grid — unchanged */}
      <div className="relative mx-auto hidden max-w-6xl md:grid md:grid-cols-12 md:gap-x-8 md:gap-y-14 lg:gap-x-10 lg:gap-y-16">
        {WEDDING_EVENTS.map((event, index) => (
          <EventCard
            key={event.id}
            event={event}
            expanded={expandedId === event.id}
            onToggle={() => handleToggle(event.id)}
            reducedMotion={reducedMotion}
            priority={index === 0}
            className={desktopPlacement[event.id]}
          />
        ))}
      </div>

      {/* Mobile: horizontal scroll-snap carousel */}
      <div className="relative -mx-5 max-w-[100vw] md:hidden">
        <div
          ref={scrollerRef}
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto overflow-y-hidden overscroll-x-contain px-5 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{
            // Extra end padding keeps the last card snappable while
            // revealing a peek of the next slide on earlier cards.
            paddingRight: "max(1.25rem, 14vw)",
            WebkitOverflowScrolling: "touch",
            scrollBehavior: reducedMotion ? "auto" : "smooth",
          }}
          role="region"
          aria-roledescription="carousel"
          aria-label="Wedding celebration events"
          tabIndex={0}
        >
          {WEDDING_EVENTS.map((event, index) => (
            <div
              key={event.id}
              data-event-slide
              className="w-[calc(100vw-3.75rem)] max-w-[22rem] shrink-0 snap-center"
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${total}: ${event.title}`}
            >
              <EventCard
                event={event}
                expanded={expandedId === event.id}
                onToggle={() => handleToggle(event.id)}
                reducedMotion={reducedMotion}
                skipEntrance
                compactMobile
                priority={index === 0}
              />
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col items-center gap-3">
          <p
            className="font-heading text-sm tracking-[0.2em] text-champagne/80"
            aria-live="polite"
          >
            {activeIndex + 1}
            <span className="mx-1 text-champagne/40">/</span>
            {total}
          </p>

          <div
            className="flex items-center justify-center gap-2"
            role="tablist"
            aria-label="Event pagination"
          >
            {WEDDING_EVENTS.map((event, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={event.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Go to ${event.title}`}
                  onClick={() => goToSlide(index)}
                  className={cn(
                    "h-2 rounded-full transition-[width,background-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne",
                    isActive
                      ? "w-6 bg-champagne"
                      : "w-2 bg-champagne/35 hover:bg-champagne/55",
                    reducedMotion && "duration-0",
                  )}
                />
              );
            })}
          </div>

          <p className="text-[0.58rem] uppercase tracking-[0.28em] text-champagne/55">
            Swipe for more celebrations
          </p>
        </div>
      </div>
    </section>
  );
}
