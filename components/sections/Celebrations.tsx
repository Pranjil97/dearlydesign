"use client";

import { useCallback, useRef, useState } from "react";
import { motion } from "motion/react";
import { EventCard } from "@/components/events/EventCard";
import { OrnamentalDivider } from "@/components/invitation/OrnamentalDivider";
import { easings, gsap, registerGsap, useGSAP } from "@/lib/animations";
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
  const sectionRef = useRef<HTMLElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);

  const handleToggle = useCallback((id: WeddingEventId) => {
    setExpandedId((current) => (current === id ? null : id));
  }, []);

  useGSAP(
    () => {
      registerGsap();
      if (reducedMotion || !sectionRef.current || !stackRef.current) return;

      const section = sectionRef.current;
      const cards = gsap.utils.toArray<HTMLElement>(
        stackRef.current.querySelectorAll("[data-event-stack-card]"),
      );
      if (cards.length < 2) return;

      const mm = gsap.matchMedia();

      mm.add(
        "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap.set(cards, {
            position: "absolute",
            inset: 0,
            width: "100%",
          });
          gsap.set(cards[0], { autoAlpha: 1, y: 0, scale: 1, zIndex: cards.length });
          cards.slice(1).forEach((card, index) => {
            gsap.set(card, {
              autoAlpha: 0,
              y: 56,
              scale: 0.94,
              zIndex: cards.length - index - 1,
            });
          });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => `+=${cards.length * window.innerHeight * 0.72}`,
              pin: true,
              scrub: 0.65,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          cards.forEach((card, index) => {
            if (index === cards.length - 1) return;
            const next = cards[index + 1];
            const step = index;

            tl.to(
              card,
              {
                autoAlpha: 0,
                y: -36,
                scale: 0.9,
                duration: 1,
                ease: "none",
              },
              step,
            ).to(
              next,
              {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                duration: 1,
                ease: "none",
              },
              step,
            );
          });
        },
      );

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  );

  return (
    <section
      ref={sectionRef}
      id="events"
      className="relative overflow-hidden bg-burgundy px-5 py-24 sm:px-8 sm:py-32 lg:px-10 lg:py-40"
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

      {/* Desktop asymmetric editorial grid */}
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

      {/* Mobile: vertical scroll stack — one card forward, previous slips back */}
      {!reducedMotion ? (
        <div className="relative md:hidden">
          <div
            ref={stackRef}
            className="relative mx-auto h-[min(72dvh,34rem)] w-full max-w-[22rem]"
          >
            {WEDDING_EVENTS.map((event, index) => (
              <div
                key={event.id}
                data-event-stack-card
                className="will-change-transform"
              >
                <EventCard
                  event={event}
                  expanded={expandedId === event.id}
                  onToggle={() => handleToggle(event.id)}
                  reducedMotion={reducedMotion}
                  skipEntrance
                  priority={index === 0}
                />
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-[0.58rem] uppercase tracking-[0.28em] text-champagne/55">
            Scroll to reveal each celebration
          </p>
        </div>
      ) : null}

      {/* Mobile fallback / reduced-motion: horizontal swipe */}
      <div
        className={cn(
          "relative max-w-[100vw] overflow-x-hidden",
          reducedMotion ? "md:hidden" : "hidden",
        )}
      >
        <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto overflow-y-hidden overscroll-x-contain px-1 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {WEDDING_EVENTS.map((event, index) => (
            <div
              key={event.id}
              className={cn(
                "w-[82vw] max-w-[22rem] shrink-0 snap-center",
                index === WEDDING_EVENTS.length - 1 && "mr-1",
              )}
            >
              <EventCard
                event={event}
                expanded={expandedId === event.id}
                onToggle={() => handleToggle(event.id)}
                reducedMotion={reducedMotion}
                priority={index === 0}
              />
            </div>
          ))}
        </div>
        <p className="mt-3 text-center text-[0.58rem] uppercase tracking-[0.28em] text-champagne/55">
          Swipe for more celebrations
        </p>
      </div>
    </section>
  );
}
